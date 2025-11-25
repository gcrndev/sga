function staff_invite_template({ name, inviteLink, firmName, adminName }) {
  const displayFirm = firmName || "Seu escritorio";
  const displayAdmin = adminName || "Administrador do escritorio";

  const subject = `[${displayFirm}] Convite para acesso ao portal`;

  const text = `
Ola, ${name}!

${displayAdmin} convidou voce para acessar o portal do escritorio ${displayFirm}.

Crie sua senha e ative seu acesso pelo link abaixo (valido por 48 horas):
${inviteLink}

Se nao reconhecer este convite, ignore esta mensagem.
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>${subject}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f5; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(15,23,42,0.08);">
            <tr>
              <td style="background-color:#0f172a; padding:16px 24px; text-align:left;">
                <div style="color:#e5e7eb; font-size:14px; letter-spacing:0.08em; text-transform:uppercase;">Convite de acesso</div>
                <div style="color:#ffffff; font-size:18px; font-weight:600; margin-top:4px;">${displayFirm}</div>
                <div style="color:#cbd5e1; font-size:13px; margin-top:2px;">Enviado por ${displayAdmin}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 24px 8px 24px; color:#111827; font-size:15px; line-height:1.6;">
                <p style="margin:0 0 12px 0;">Ola, <strong>${name}</strong>!</p>
                <p style="margin:0 0 12px 0;">
                  Voce foi convidado para acessar o portal interno do escritorio <strong>${displayFirm}</strong>, gerenciado por <strong>${displayAdmin}</strong>.
                </p>
                <p style="margin:0 0 12px 0;">
                  Para criar sua senha e ativar o acesso, clique no botao abaixo.
                  <br />
                  <span style="font-size:13px; color:#6b7280;">Link valido por <strong>48 horas</strong>.</span>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 8px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" align="left">
                  <tr>
                    <td>
                      <a href="${inviteLink}" style="
                        display:inline-block;
                        background-color:#2563eb;
                        color:#ffffff;
                        padding:10px 20px;
                        border-radius:6px;
                        text-decoration:none;
                        font-weight:600;
                        font-size:14px;
                      ">
                        Criar minha senha
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 24px 16px 24px; color:#374151; font-size:13px; line-height:1.6;">
                <p style="margin:0 0 4px 0;">Se o botao acima nao funcionar, copie e cole este endereco no navegador:</p>
                <p style="margin:0; word-break:break-all;">
                  <a href="${inviteLink}" style="color:#2563eb; text-decoration:none;">${inviteLink}</a>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 24px 24px 24px; color:#6b7280; font-size:12px; line-height:1.6; border-top:1px solid #e5e7eb;">
                <p style="margin:8px 0;">Se nao reconhecer este convite, ignore esta mensagem.</p>
                <p style="margin:4px 0 0 0;">Convite enviado pelo escritorio via plataforma SGA.</p>
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
  staff_invite_template,
};
