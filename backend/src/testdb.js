const db = require("./config/db");

async function testConnection() {
  try {
    const result = await db.query("SELECT NOW() as now");
    console.log("Conexão OK! Horário do banco:", result.rows[0].now);
  } catch (err) {
    console.error("Erro ao conectar no Postgres:", err);
  } finally {
    // encerra o pool de conexões
    db.pool.end();
  }
}

testConnection();
