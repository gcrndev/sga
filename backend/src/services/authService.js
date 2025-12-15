const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../config/mailer");
const { welcome_email_template } = require("../email/welcome_email_template");

function slugifyName(name = "") {
  return (
    name
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 60) || "escritorio"
  );
}

function getSaltRounds() {
  const parsed = Number(process.env.BCRYPT_SALT_ROUNDS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha sao obrigatorios" });
    }

    const result = await db.query(
      `SELECT u.id, u.law_firm_id, u.name, u.email, u.password_hash, u.user_type, u.role, u.is_active,
              lf.slug AS law_firm_slug
       FROM users u
       JOIN law_firms lf ON lf.id = u.law_firm_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Credenciais invalidas" });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        error: "Usuario inativo. Complete o convite enviado por e-mail.",
      });
    }

    if (!user.password_hash) {
      return res.status(403).json({
        error:
          "Usuario ainda nao definiu uma senha. Complete o convite enviado por e-mail.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais invalidas" });
    }

    const payload = {
      sub: user.id,
      law_firm_id: user.law_firm_id,
      user_type: user.user_type,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
        role: user.role,
        law_firm_id: user.law_firm_id,
        law_firm_slug: user.law_firm_slug,
      },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

async function registerFirm(req, res) {
  const client = await db.pool.connect(); // para transacao

  try {
    const {
      firm_name,
      firm_email,
      firm_nif,
      firm_phone,
      owner_name,
      owner_email,
      owner_password,
    } = req.body;

    if (!firm_name || !owner_name || !owner_email || !owner_password) {
      return res.status(400).json({
        error:
          "firm_name, owner_name, owner_email e owner_password sao obrigatorios",
      });
    }

    const firmNifRaw = firm_nif ? firm_nif.toString() : "";
    const nifOnlyDigits = firmNifRaw.replace(/\D/g, "");
    const hasNonDigits = firmNifRaw.length > 0 && firmNifRaw !== nifOnlyDigits;

    if (hasNonDigits || nifOnlyDigits.length > 9) {
      return res.status(400).json({
        error: "firm_nif deve conter apenas numeros e ate 9 caracteres",
      });
    }

    const normalizedNif = nifOnlyDigits || null;

    await client.query("BEGIN");

    const slug = slugifyName(firm_name);

    const firmResult = await client.query(
      `INSERT INTO law_firms (name, nif, email, phone, is_active, slug)
       VALUES ($1, $2, $3, $4, TRUE, $5)
       RETURNING id, slug`,
      [
        firm_name,
        normalizedNif,
        firm_email || null,
        firm_phone || null,
        slug,
      ]
    );

    const lawFirmId = firmResult.rows[0].id;
    const firmSlug = firmResult.rows[0].slug;

    const passwordHash = await bcrypt.hash(owner_password, getSaltRounds());

    const userResult = await client.query(
      `INSERT INTO users
        (law_firm_id, name, email, password_hash, user_type, role, is_active)
       VALUES
        ($1, $2, $3, $4, 'staff', 'ADMIN', TRUE)
       RETURNING id, name, email, user_type, role`,
      [lawFirmId, owner_name, owner_email, passwordHash]
    );

    const adminUser = userResult.rows[0];

    const payload = {
      sub: adminUser.id,
      law_firm_id: lawFirmId,
      user_type: adminUser.user_type,
      role: adminUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    });

    await client.query("COMMIT");

    try {
      const { subject, text, html } = welcome_email_template({
        userName: adminUser.name,
        userEmail: adminUser.email,
        firmName: firm_name,
      });

      await sendMail({
        to: adminUser.email,
        subject,
        text,
        html,
      });
    } catch (emailErr) {
      console.error("Erro ao enviar email de boas-vindas:", emailErr);
    }

    res.status(201).json({
      token,
      firm: {
        id: lawFirmId,
        name: firm_name,
        email: firm_email,
        slug: firmSlug,
        nif: firm_nif,
        phone: firm_phone,
      },
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        user_type: adminUser.user_type,
        role: adminUser.role,
        law_firm_id: lawFirmId,
        law_firm_slug: firmSlug,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro no registerFirm:", err);

    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "Nome/slug de escritorio ja em uso. Escolha outro nome." });
    }

    res.status(500).json({ error: "Erro ao registrar escritorio" });
  } finally {
    client.release();
  }
}

async function completeInvite(req, res) {
  try {
    const { token, password, confirm_password } = req.body;

    if (!token || !password || !confirm_password) {
      return res.status(400).json({
        error: "token, password e confirm_password sao obrigatorios",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        error: "password e confirm_password nao coincidem",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "A senha deve ter pelo menos 8 caracteres",
      });
    }

    const result = await db.query(
      `SELECT u.id, u.law_firm_id, u.name, u.email, u.user_type, u.role,
              invite_token, invite_expires_at, is_active, password_hash
             , lf.slug AS law_firm_slug
       FROM users u
       JOIN law_firms lf ON lf.id = u.law_firm_id
       WHERE u.invite_token = $1`,
      [token]
    );

    if (result.rowCount === 0) {
      return res
        .status(400)
        .json({ error: "Convite invalido ou ja utilizado" });
    }

    const user = result.rows[0];

    if (!user.invite_expires_at || user.invite_expires_at < new Date()) {
      return res.status(400).json({
        error: "Convite expirado. Peca um novo convite ao administrador.",
      });
    }

    if (user.is_active || user.password_hash) {
      return res.status(400).json({
        error: "Este convite ja foi utilizado. Faca login normalmente.",
      });
    }

    const passwordHash = await bcrypt.hash(password, getSaltRounds());

    await db.query(
      `UPDATE users
       SET password_hash = $1,
           is_active = TRUE,
           invite_token = NULL,
           invite_expires_at = NULL
       WHERE id = $2`,
      [passwordHash, user.id]
    );

    const payload = {
      sub: user.id,
      law_firm_id: user.law_firm_id,
      user_type: user.user_type,
      role: user.role,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    });

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
        role: user.role,
        law_firm_id: user.law_firm_id,
        law_firm_slug: user.law_firm_slug,
      },
    });
  } catch (err) {
    console.error("Erro no completeInvite:", err);
    res.status(500).json({ error: "Erro ao completar convite" });
  }
}

async function me(req, res) {
  try {
    const userId = req.context?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Nao autenticado" });
    }

    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.user_type, u.role, u.law_firm_id,
              lf.slug AS law_firm_slug
       FROM users u
       JOIN law_firms lf ON lf.id = u.law_firm_id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Erro no /auth/me:", err);
    res.status(500).json({ error: "Erro ao buscar usuario" });
  }
}

module.exports = {
  login,
  registerFirm,
  completeInvite,
  me,
};
