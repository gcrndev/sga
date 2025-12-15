function welcome_email_template({ userName, userEmail, firmName }) {
  const displayName = userName || "Cliente";
  const displayFirm = firmName || "seu escritorio";

  const subject = `[${displayFirm}] Bem-vindo(a) ao portal do SGA`;

  const text = `
Ola, ${displayName}!

Bem-vindo(a) ao portal do escritorio ${displayFirm}.

Seu acesso foi criado com o e-mail: ${userEmail}.

Acesse o painel para gerir clientes, processos e documentos do escritorio.

Se nao reconhece este cadastro, ignore este e-mail.
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>${subject}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 18px rgba(15,23,42,0.08);">
            <tr>
              <td style="background-color:#0f172a; padding:16px 24px;">
                <div style="color:#22c55e; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; font-size:12px;">Boas-vindas</div>
                <div style="color:#e2e8f0; font-size:16px; margin-top:6px;">${displayFirm}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px; color:#0f172a; font-size:14px; line-height:1.6;">
                <p style="margin:0 0 12px 0;">Ola, <strong>${displayName}</strong>!</p>
                <p style="margin:0 0 12px 0;">Bem-vindo(a) ao portal do escritorio <strong>${displayFirm}</strong>.</p>
                <p style="margin:0 0 12px 0;">Seu acesso foi criado com o e-mail <strong>${userEmail}</strong>.</p>
                <p style="margin:0 0 12px 0;">Acesse o painel para organizar clientes, processos e documentos do escritorio.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 20px 24px; color:#6b7280; font-size:12px; line-height:1.6; border-top:1px solid #e5e7eb;">
                <p style="margin:12px 0 4px 0;">Se nao reconhece este cadastro, ignore este e-mail.</p>
                <p style="margin:4px 0;">E-mail automatico enviado pela plataforma SGA.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return { subject, text, html };
}

module.exports = {
  welcome_email_template,
};
