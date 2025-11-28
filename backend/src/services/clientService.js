const db = require("../config/db");

const ALLOWED_STATUS = ["pending", "active", "rejected"];

async function listClients(req, res) {
  try {
    const lawFirmId = req.context.lawFirmId;

    const result = await db.query(
      `SELECT id, full_name, nif, phone, email, is_minor, created_at,
              service_type, status, sources,
              date_of_birth, passport_number, address, postal_code, nationality
       FROM clients
       WHERE law_firm_id = $1
       ORDER BY created_at DESC`,
      [lawFirmId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar clientes:", err);
    res.status(500).json({ error: "Erro ao listar clientes" });
  }
}

async function createClient(req, res) {
  try {
    const lawFirmId = req.context.lawFirmId;
    const {
      full_name,
      nif,
      phone,
      email,
      is_minor,
      guardian_name,
      guardian_contact,
      service_type,
      date_of_birth,
      passport_number,
      address,
      postal_code,
      nationality,
    } = req.body;

    if (!full_name) {
      return res.status(400).json({ error: "Nome do cliente e obrigatorio" });
    }

    const normalizedStatus = "active";
    const normalizedSource = "staff_manual";

    const result = await db.query(
      `INSERT INTO clients
        (law_firm_id, full_name, nif, phone, email, is_minor, guardian_name, guardian_contact,
         service_type, date_of_birth, passport_number,
         address, postal_code, nationality, status, sources)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8,
         $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id`,
      [
        lawFirmId,
        full_name,
        nif || null,
        phone || null,
        email || null,
        is_minor || false,
        guardian_name || null,
        guardian_contact || null,
        service_type || null,
        date_of_birth || null,
        passport_number || null,
        address || null,
        postal_code || null,
        nationality || null,
        normalizedStatus,
        normalizedSource,
      ]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error("Erro ao criar cliente:", err);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
}

async function updateStatus(req, res) {
  try {
    const lawFirmId = req.context.lawFirmId;
    const { id } = req.params;
    const { status } = req.body;

    if (!ALLOWED_STATUS.includes(status)) {
      return res
        .status(400)
        .json({ error: `Status invalido. Use um de: ${ALLOWED_STATUS.join(", ")}` });
    }

    const result = await db.query(
      `UPDATE clients
       SET status = $1
       WHERE id = $2 AND law_firm_id = $3
       RETURNING id, status`,
      [status, id, lawFirmId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cliente nao encontrado" });
    }

    res.json({ id: result.rows[0].id, status: result.rows[0].status });
  } catch (err) {
    console.error("Erro ao atualizar status do cliente:", err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
}

module.exports = {
  listClients,
  createClient,
  updateStatus,
};
