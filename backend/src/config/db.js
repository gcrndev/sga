const { Pool } = require("pg");
require("dotenv").config();

const sslEnabled =
  String(process.env.DB_SSL || "").toLowerCase() === "true" ||
  String(process.env.DB_SSL || "").toLowerCase() === "1";

// Criamos um pool de conexoes com os dados do .env
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
});

// Logar se der algum erro inesperado
pool.on("error", (err) => {
  console.error("Erro inesperado no pool de conexao PG:", err);
  process.exit(-1);
});

// Exportamos uma funcao simples pra usar nas queries
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
