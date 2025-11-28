const db = require("../config/db");
const { sendMail } = require("../config/mailer");
const { new_client_notification } = require("../email/new_client_notification");

const SERVICE_TYPES = {
  ACAO_JUDICIAL: "Acao judicial",
  NACIONALIDADE: "Nacionalidade",
  VISTO: "Visto",
};

function normalizeServiceType(raw = "") {
  const key = raw.toString().trim().toUpperCase().replace(/\s+/g, "_");
  return SERVICE_TYPES[key] ? key : null;
}

function parseDateToISO(dateStr) {
  if (!dateStr) return null;
  const dt = new Date(dateStr);
  if (Number.isNaN(dt.getTime())) {
    throw new Error("Data de nascimento invalida");
  }
  return dt.toISOString().slice(0, 10);
}

async function submitClientForm(req, res) {
  try {
    const { slug } = req.params;
    const {
      name,
      email,
      phone,
      service_type,
      date_of_birth,
      passport_number,
      nif,
      address,
      postal_code,
      nationality,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !service_type ||
      !address ||
      !postal_code ||
      !nationality
    ) {
      return res.status(400).json({
        error:
          "Campos obrigatorios: name, email, phone, service_type, address, postal_code, nationality",
      });
    }

    const normalizedService = normalizeServiceType(service_type);
    if (!normalizedService) {
      return res.status(400).json({
        error: `service_type invalido. Use um de: ${Object.keys(SERVICE_TYPES).join(", ")}`,
      });
    }

    let normalizedBirthDate = null;
    try {
      normalizedBirthDate = parseDateToISO(date_of_birth);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const firmResult = await db.query(
      `SELECT id, name, email
       FROM law_firms
       WHERE slug = $1 AND is_active = TRUE`,
      [slug]
    );

    if (firmResult.rowCount === 0) {
      return res.status(404).json({ error: "Escritorio nao encontrado" });
    }

    const firm = firmResult.rows[0];
    const phoneFull = phone.toString().trim();

    const insertResult = await db.query(
      `INSERT INTO clients
        (law_firm_id, full_name, email, phone,
         service_type, date_of_birth, passport_number, nif, address, postal_code,
         nationality, status, sources)
       VALUES
        ($1, $2, $3, $4,
         $5, $6, $7, $8, $9, $10,
         $11, 'pending', 'public_form')
       RETURNING id, created_at`,
      [
        firm.id,
        name,
        email,
        phoneFull,
        normalizedService,
        normalizedBirthDate,
        passport_number || null,
        nif || null,
        address,
        postal_code,
        nationality,
      ]
    );

    if (firm.email) {
      const { subject, text, html } = new_client_notification({
        firmName: firm.name,
        clientName: name,
        clientEmail: email,
        clientPhone: phoneFull,
        serviceLabel: SERVICE_TYPES[normalizedService],
        nationality,
        postal_code,
        passport_number,
        nif,
        date_of_birth: normalizedBirthDate,
      });

      try {
        await sendMail({
          to: firm.email,
          subject,
          text,
          html,
        });
      } catch (emailErr) {
        console.error("Erro ao enviar email para admin:", emailErr);
      }
    }

    res.status(201).json({
      message: "Solicitacao recebida. O escritorio entrara em contacto.",
      id: insertResult.rows[0].id,
    });
  } catch (err) {
    console.error("Erro no submitClientForm:", err);
    res.status(500).json({ error: "Erro ao registrar cliente" });
  }
}

module.exports = {
  submitClientForm,
  SERVICE_TYPES,
};
