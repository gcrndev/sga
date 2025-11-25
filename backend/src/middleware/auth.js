const jwt = require("jsonwebtoken");
const db = require("../config/db");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token nao fornecido" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userResult = await db.query(
      `SELECT id, law_firm_id, user_type, role, is_active
       FROM users
       WHERE id = $1`,
      [decoded.sub]
    );

    if (userResult.rowCount === 0) {
      return res.status(401).json({ error: "Usuario nao encontrado" });
    }

    const dbUser = userResult.rows[0];

    if (!dbUser.is_active) {
      return res.status(403).json({ error: "Usuario inativo" });
    }

    if (dbUser.law_firm_id !== decoded.law_firm_id) {
      return res
        .status(403)
        .json({ error: "Token invalido para o escritorio" });
    }

    req.context = {
      userId: dbUser.id,
      lawFirmId: dbUser.law_firm_id,
      userType: dbUser.user_type,
      role: dbUser.role,
    };

    next();
  } catch (err) {
    console.error("Erro ao validar token:", err);
    return res.status(401).json({ error: "Token invalido ou expirado" });
  }
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.context || !req.context.role) {
      return res.status(401).json({ error: "Nao autenticado" });
    }

    if (!allowedRoles.includes(req.context.role)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
