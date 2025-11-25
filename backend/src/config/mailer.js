const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true para porta 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Opcional: testar conexão na inicialização
transporter.verify((error, success) => {
  if (error) {
    console.error("Erro ao conectar no SMTP:", error);
  } else {
    console.log("SMTP pronto para enviar emails ✔️");
  }
});

async function sendMail({ to, subject, text, html }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  console.log("Email enviado:", info.messageId);
  return info;
}

module.exports = {
  sendMail,
};
