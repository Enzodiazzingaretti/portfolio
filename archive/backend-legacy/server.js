import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fillDefaults, mergePatch, validateSiteContent } from "./contentUtils.mjs";

dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT || 4000);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const ADMIN_SESSION_MINUTES = Number(process.env.ADMIN_SESSION_MINUTES || 60);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "data", "site-content.json");
const DEFAULT_FILE = path.join(__dirname, "default-site-content.json");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

let baselineCache = null;
const adminSessions = new Map();

async function readBaseline() {
  if (!baselineCache) {
    const raw = await fs.readFile(DEFAULT_FILE, "utf-8");
    baselineCache = JSON.parse(raw);
  }
  return baselineCache;
}

async function readStoredOrEmpty() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writeContent(content) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const formatted = `${JSON.stringify(content, null, 2)}\n`;
  await fs.writeFile(DATA_FILE, formatted, "utf-8");
}

function isAdmin(request) {
  const sessionToken = request.header("x-admin-session");
  if (sessionToken) {
    const session = adminSessions.get(sessionToken);
    if (session && session.expiresAt > Date.now()) {
      return true;
    }
    adminSessions.delete(sessionToken);
  }

  // Compatibilidad hacia atrás con el header antiguo.
  const token = request.header("x-admin-token");
  return ADMIN_TOKEN.length > 0 && token === ADMIN_TOKEN;
}

function createAdminSession() {
  const token = randomUUID();
  const expiresAt = Date.now() + ADMIN_SESSION_MINUTES * 60 * 1000;
  adminSessions.set(token, { expiresAt });
  return { token, expiresAt };
}

setInterval(() => {
  const now = Date.now();
  for (const [token, session] of adminSessions.entries()) {
    if (session.expiresAt <= now) {
      adminSessions.delete(token);
    }
  }
}, 60_000).unref();

app.get("/", (_request, response) => {
  response.type("json").json({
    name: "kexxy-portfolio-api",
    hint: "No hay pagina en /. Usa las rutas bajo /api.",
    routes: {
      "GET /api/health": "comprueba que el servidor responde",
      "GET /api/content": "JSON del sitio (para el frontend)",
      "PUT /api/content": "actualiza contenido (header x-admin-token + body JSON)",
    },
  });
});

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/admin/login", (request, response) => {
  const provided = request.body?.token;
  if (typeof provided !== "string" || !provided.trim()) {
    response.status(400).json({ ok: false, message: "Token requerido." });
    return;
  }
  if (ADMIN_TOKEN.length === 0 || provided !== ADMIN_TOKEN) {
    response.status(401).json({ ok: false, message: "Token admin invalido." });
    return;
  }

  const session = createAdminSession();
  response.json({
    ok: true,
    sessionToken: session.token,
    expiresAt: session.expiresAt,
    expiresInMinutes: ADMIN_SESSION_MINUTES,
  });
});

app.get("/api/content", async (_request, response) => {
  try {
    const baseline = await readBaseline();
    const stored = await readStoredOrEmpty();
    response.json(fillDefaults(baseline, stored));
  } catch (error) {
    response.status(500).json({
      message: "No se pudo leer el contenido.",
      detail: error instanceof Error ? error.message : "Error desconocido.",
    });
  }
});

app.put("/api/content", async (request, response) => {
  if (!isAdmin(request)) {
    response.status(401).json({ message: "Token admin invalido o ausente." });
    return;
  }

  if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) {
    response.status(400).json({ message: "El body debe ser un objeto JSON." });
    return;
  }

  try {
    const baseline = await readBaseline();
    const stored = await readStoredOrEmpty();
    const normalized = fillDefaults(baseline, stored);
    const merged = mergePatch(normalized, request.body);
    const errors = validateSiteContent(merged);

    if (errors.length > 0) {
      response.status(400).json({ message: "Contenido invalido.", errors });
      return;
    }

    await writeContent(merged);
    response.json({ ok: true, message: "Contenido actualizado correctamente." });
  } catch (error) {
    response.status(500).json({
      message: "No se pudo guardar el contenido.",
      detail: error instanceof Error ? error.message : "Error desconocido.",
    });
  }
});

app.listen(PORT, () => {
  const base = `http://localhost:${PORT}`;
  console.log(`Backend listo — ${base}/api/health | ${base}/api/content`);
});
