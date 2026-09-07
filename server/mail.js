import nodemailer from "nodemailer";

const toAddress = () =>
  process.env.QUOTE_EMAIL_TO || process.env.VITE_EMAIL || "infofawares@gmail.com";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function messageBody(quote) {
  return [
    "New quote request from the Fawares Al Shamal website",
    "",
    `Name: ${quote.name}`,
    `Number: ${quote.number}`,
    `Location: ${quote.location}`,
    `Description: ${quote.description}`,
    "",
    `Submitted: ${new Date().toISOString()}`,
  ].join("\n");
}

function htmlBody(quote) {
  return `
    <h2>New quote request</h2>
    <p><strong>Name:</strong> ${escapeHtml(quote.name)}</p>
    <p><strong>Number:</strong> ${escapeHtml(quote.number)}</p>
    <p><strong>Location:</strong> ${escapeHtml(quote.location)}</p>
    <p><strong>Description:</strong><br>${escapeHtml(quote.description).replaceAll("\n", "<br>")}</p>
  `;
}

export async function sendQuoteEmail(quote) {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replaceAll(" ", "").trim();
  const to = toAddress();
  const from = process.env.SMTP_FROM || user;

  if (!user || !pass) {
    const reason = "SMTP_USER or SMTP_PASS is missing";
    console.warn("[quote-email]", reason, {
      hasUser: Boolean(user),
      hasPass: Boolean(pass),
    });
    return { ok: false, error: reason };
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  console.log("[quote-email] sending", {
    host,
    port,
    user,
    from,
    to,
    passLength: pass.length,
  });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Fawares Al Shamal website" <${from}>`,
      to,
      subject: `Quote request from ${quote.name}`,
      text: messageBody(quote),
      html: htmlBody(quote),
    });
    console.log("[quote-email] sent", { to, messageId: info.messageId, response: info.response });
    return { ok: true };
  } catch (err) {
    const details = {
      message: err.message,
      code: err.code,
      command: err.command,
      response: err.response,
      responseCode: err.responseCode,
    };
    console.error("[quote-email] failed", details);
    if (err.stack) console.error(err.stack);
    return { ok: false, error: err.message, details };
  }
}
