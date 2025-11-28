function new_client_notification({
  firmName,
  clientName,
  clientEmail,
  clientPhone,
  serviceLabel,
  nationality,
  postal_code,
  passport_number,
  nif,
  date_of_birth,
}) {
  const subject = `[${firmName}] Novo cliente recebido via formulario publico`;

  const text = `
Novo cliente pendente

Nome: ${clientName}
Email: ${clientEmail}
Telefone: ${clientPhone || "-"}
Servico: ${serviceLabel}
Nacionalidade: ${nationality}
CEP/Codigo postal: ${postal_code}
Passaporte: ${passport_number || "-"}
NIF: ${nif || "-"}
Data de nascimento: ${date_of_birth || "-"}

Acesse o painel para alterar o status para ativo.
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
                <div style="color:#facc15; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; font-size:12px;">Novo cliente</div>
                <div style="color:#e2e8f0; font-size:16px; margin-top:6px;">${firmName}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px; color:#0f172a; font-size:14px; line-height:1.6;">
                <p style="margin:0 0 12px 0;">Um cliente preencheu o formulario publico:</p>
                <ul style="padding:0 0 0 18px; margin:0 0 12px 0; color:#1f2937;">
                  <li><strong>Nome:</strong> ${clientName}</li>
                  <li><strong>Email:</strong> ${clientEmail}</li>
                  <li><strong>Telefone:</strong> ${clientPhone || "-"}</li>
                  <li><strong>Servico:</strong> ${serviceLabel}</li>
                  <li><strong>Nacionalidade:</strong> ${nationality}</li>
                  <li><strong>CEP/Codigo postal:</strong> ${postal_code}</li>
                  <li><strong>Passaporte:</strong> ${passport_number || "-"}</li>
                  <li><strong>NIF:</strong> ${nif || "-"}</li>
                  <li><strong>Data de nascimento:</strong> ${date_of_birth || "-"}</li>
                </ul>
                <p style="margin:12px 0 0 0; color:#6b7280;">Acesse o painel do SGA para revisar e ativar o cliente.</p>
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
  new_client_notification,
};
