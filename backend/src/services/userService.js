const crypto = require("crypto");
const db = require("../config/db");
const { sendMail } = require("../config/mailer");
const { staff_invite_template } = require("../email/staff_invite_template");

const ALLOWED_STAFF_ROLES = [
  "ADMIN",
  "ADVOGADO",
  "ADMINISTRATIVO",
  "FINANCEIRO",
  "PARCEIRO",
];

async function listStaff(req, res) {
  try {
    const lawFirmId = req.context.lawFirmId;

    const result = await db.query(
      `SELECT id, name, email, role, is_active, invite_expires_at
       FROM users
       WHERE law_firm_id = $1 AND user_type = 'staff'
       ORDER BY name ASC`,
      [lawFirmId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar staff:", err);
    res.status(500).json({ error: "Erro ao listar usuarios" });
  }
}

async function createStaffUser(req, res) {
  try {
    const lawFirmId = req.context.lawFirmId;
    const adminUserId = req.context.userId;

    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        error: "name, email e role sao obrigatorios",
      });
    }

    const normalizedRole = role.toUpperCase();

    if (!ALLOWED_STAFF_ROLES.includes(normalizedRole)) {
      return res.status(400).json({
        error: `Role invalido. Use um de: ${ALLOWED_STAFF_ROLES.join(", ")}`,
      });
    }

    const contextResult = await db.query(
      `SELECT lf.name AS firm_name, u.name AS admin_name
       FROM law_firms lf
       JOIN users u ON u.id = $1 AND u.law_firm_id = lf.id
       WHERE lf.id = $2`,
      [adminUserId, lawFirmId]
    );

    const {
      firm_name: firmName = "Seu escritorio",
      admin_name: adminName = "Administrador",
    } = contextResult.rows[0] || {};

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const result = await db.query(
      `INSERT INTO users
        (law_firm_id, name, email, user_type, role, is_active,
         invite_token, invite_expires_at)
       VALUES
        ($1, $2, $3, 'staff', $4, FALSE, $5, $6)
       RETURNING id, name, email, role, invite_token, invite_expires_at`,
      [lawFirmId, name, email, normalizedRole, inviteToken, expiresAt]
    );

    const newUser = result.rows[0];

    const inviteLink = `https://sgadvocacias.com/invite/confirm?token=${newUser.invite_token}`;

    const { subject, text, html } = staff_invite_template({
      name: newUser.name,
      inviteLink,
      firmName,
      adminName,
    });

    try {
      await sendMail({
        to: newUser.email,
        subject,
        text,
        html,
      });
    } catch (emailErr) {
      console.error("Erro ao enviar email de convite:", emailErr);
    }

    res.status(201).json({
      message: "Convite criado com sucesso. Email enviado (se possivel).",
      inviteLink,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        invite_expires_at: newUser.invite_expires_at,
      },
    });
  } catch (err) {
    console.error("Erro ao criar usuario staff:", err);

    if (err.code === "23505") {
      return res.status(409).json({ error: "Email ja esta em uso" });
    }

    res.status(500).json({ error: "Erro ao criar funcionario" });
  }
}

module.exports = {
  listStaff,
  createStaffUser,
};
