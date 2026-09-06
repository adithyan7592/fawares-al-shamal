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
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) {
    console.warn("Quote email skipped: set SMTP_USER and SMTP_PASS (Gmail app password) in .env");
    return false;
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Fawares Al Shamal website" <${process.env.SMTP_FROM || user}>`,
    to: toAddress(),
    replyTo: undefined,
    subject: `Quote request from ${quote.name}`,
    text: messageBody(quote),
    html: htmlBody(quote),
  });
  console.log("Quote email sent via Gmail SMTP to", toAddress());
  return true;
}
