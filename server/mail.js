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

async function sendViaResend(quote) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  const to = toAddress();
  const from = process.env.RESEND_FROM || "Fawares Al Shamal <onboarding@resend.dev>";
  console.log("[quote-email] sending via Resend HTTPS", { to, from });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Quote request from ${quote.name}`,
      text: messageBody(quote),
      html: htmlBody(quote),
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = body?.message || body?.error || `Resend HTTP ${res.status}`;
    console.error("[quote-email] Resend failed", { status: res.status, body });
    return { ok: false, error };
  }

  console.log("[quote-email] sent via Resend", { to, id: body.id });
  return { ok: true };
}

async function sendViaSmtp(quote) {
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
  console.log("[quote-email] sending via SMTP", {
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
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
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
    console.log("[quote-email] sent via SMTP", { to, messageId: info.messageId, response: info.response });
    return { ok: true };
  } catch (err) {
    const details = {
      message: err.message,
      code: err.code,
      command: err.command,
      response: err.response,
      responseCode: err.responseCode,
    };
    console.error("[quote-email] SMTP failed", details);
    if (err.stack) console.error(err.stack);
    const timedOut = /timeout|ETIMEDOUT|ESOCKET/i.test(`${err.message} ${err.code || ""}`);
    const error = timedOut
      ? "Connection timeout: Render free hosting blocks Gmail SMTP. Set RESEND_API_KEY to send email over HTTPS."
      : err.message;
    return { ok: false, error, details };
  }
}

export async function sendQuoteEmail(quote) {
  try {
    const resend = await sendViaResend(quote);
    if (resend) return resend;
    return sendViaSmtp(quote);
  } catch (err) {
    console.error("[quote-email] unexpected error", err);
    return { ok: false, error: err.message };
  }
}
