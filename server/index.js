import "dotenv/config";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import { connectDb, createQuote, listQuotes } from "./db.js";
import { sendQuoteEmail } from "./mail.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 43145;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "fawares-admin";

const app = express();
app.use(cors());
app.use(express.json({ limit: "200kb" }));

function validateQuote(body) {
  const name = String(body?.name || "").trim();
  const number = String(body?.number || "").trim();
  const location = String(body?.location || "").trim();
  const description = String(body?.description || "").trim();
  if (name.length < 2) return "Please enter your name.";
  if (number.length < 7) return "Please enter a valid phone number.";
  if (location.length < 2) return "Please enter a location.";
  if (description.length < 4) return "Please add a short description.";
  if (name.length > 120 || number.length > 40 || location.length > 160 || description.length > 2000) {
    return "One of the fields is too long.";
  }
  return null;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "fawares-al-shamal" });
});

app.get("/api/company", (_req, res) => {
  res.json({
    name: "Fawares Al Shamal Environmental Services Co.",
    city: "Dammam",
    region: "Eastern Province",
    country: "Saudi Arabia",
    phone: process.env.VITE_PHONE || "+966 54 361 3464",
    email: process.env.VITE_EMAIL || "infofawares@gmail.com",
    whatsapp: process.env.VITE_WHATSAPP || "966543613464",
  });
});

app.post("/api/quotes", async (req, res) => {
  const error = validateQuote(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const payload = {
      name: String(req.body.name).trim(),
      number: String(req.body.number).trim(),
      location: String(req.body.location).trim(),
      description: String(req.body.description).trim(),
    };
    const quote = await createQuote(payload);
    const emailed = await sendQuoteEmail(payload);
    res.status(201).json({ ok: true, id: quote._id, emailed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save your request. Please try again." });
  }
});

app.get("/api/quotes", async (req, res) => {
  const key = req.headers["x-admin-key"] || req.query.key;
  if (key !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const quotes = await listQuotes();
    res.json({ quotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load quotes." });
  }
});

async function start() {
  await connectDb();

  const server = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      configFile: path.join(root, "client/vite.config.js"),
      server: { middlewareMode: true, hmr: { server } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const dist = path.join(root, "client/dist");
    app.use(express.static(dist));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Fawares Al Shamal running at http://127.0.0.1:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
