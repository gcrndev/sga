const { Pool } = require("pg");
require("dotenv").config();

// Criamos um pool de conexões com os dados do .env
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Só pra logar se der algum erro inesperado
pool.on("error", (err) => {
  console.error("Erro inesperado no pool de conexão PG:", err);
  process.exit(-1);
});

// Exportamos uma função simples pra usar nas queries
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
