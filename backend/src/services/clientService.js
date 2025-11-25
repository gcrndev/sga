const db = require("../config/db");

async function listClients(req, res) {
  try {
    const lawFirmId = req.context.lawFirmId;

    const result = await db.query(
      `SELECT id, full_name, nif, phone, email, is_minor, created_at
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
    } = req.body;

    if (!full_name) {
      return res.status(400).json({ error: "Nome do cliente e obrigatorio" });
    }

    const result = await db.query(
      `INSERT INTO clients
        (law_firm_id, full_name, nif, phone, email, is_minor, guardian_name, guardian_contact)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
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
      ]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error("Erro ao criar cliente:", err);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
}

module.exports = {
  listClients,
  createClient,
};
