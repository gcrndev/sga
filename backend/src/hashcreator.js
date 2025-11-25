const bcrypt = require("bcrypt");

async function gerarHash() {
  let senha = "teste123";
  let saltRounds = 10;

  const hash = await bcrypt.hash(senha, saltRounds);

  console.log("Sua senha hash é esta: " + hash);
}

gerarHash();
