import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "quotes.json");

let mode = "file";

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    number: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, default: "new" },
  },
  { timestamps: true }
);

const Quote = mongoose.models.Quote || mongoose.model("Quote", quoteSchema);

async function ensureFileStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]", "utf8");
  }
}

async function readQuotes() {
  await ensureFileStore();
  const raw = await fs.readFile(dataFile, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeQuotes(quotes) {
  await ensureFileStore();
  await fs.writeFile(dataFile, JSON.stringify(quotes, null, 2), "utf8");
}

export async function connectDb() {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) {
    await ensureFileStore();
    mode = "file";
    console.log("Quote storage: local JSON file (set MONGO_URI to use MongoDB)");
    return mode;
  }

  try {
    await mongoose.connect(uri);
    mode = "mongo";
    console.log("Quote storage: MongoDB");
    return mode;
  } catch (err) {
    console.warn("MongoDB connection failed, falling back to file store:", err.message);
    await ensureFileStore();
    mode = "file";
    return mode;
  }
}

export async function createQuote(payload) {
  if (mode === "mongo") {
    const doc = await Quote.create(payload);
    return doc.toObject();
  }
  const quotes = await readQuotes();
  const doc = {
    _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...payload,
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  quotes.unshift(doc);
  await writeQuotes(quotes);
  return doc;
}

export async function listQuotes() {
  if (mode === "mongo") {
    return Quote.find().sort({ createdAt: -1 }).lean();
  }
  return readQuotes();
}
