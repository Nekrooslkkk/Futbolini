"use strict";
/* ============================================================
   FUTBOLINI · server/index.js — backend personal (sin dependencias)
   ── Node puro: http + crypto + fs. Nada de npm install. ──

   Qué hace:
   - Login/registro con contraseña hasheada (scrypt) y token de sesión.
   - Guardar/bajar la partida en la nube (una por usuario).
   - Servir datos vivos para actualizar el juego sin redeploy (/api/datos).

   Cómo correr:  PORT=8080 DATA_DIR=./datos ADMIN_KEY=loquesea node index.js
   HTTPS: NO lo hace este server. Poné Caddy adelante (ver Caddyfile / SERVIDOR.md)
   para tener https automático — importante porque el login viaja con contraseña.
   ============================================================ */

const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "8080", 10);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "datos");
const ADMIN_KEY = process.env.ADMIN_KEY || "";           /* para editar /api/datos */
const TOKEN_TTL = 1000 * 60 * 60 * 24 * 30;              /* 30 días */
const MAX_BODY = 5 * 1024 * 1024;                        /* 5 MB por request */

fs.mkdirSync(path.join(DATA_DIR, "saves"), { recursive: true });

/* ---------- almacén simple en JSON (suficiente para uso personal) ---------- */
function rutaUsuarios() { return path.join(DATA_DIR, "usuarios.json"); }
function leerJSON(f, def) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return def; } }
function escribirJSON(f, obj) { fs.writeFileSync(f, JSON.stringify(obj)); }
function cargarUsuarios() { return leerJSON(rutaUsuarios(), {}); }
function guardarUsuarios(u) { escribirJSON(rutaUsuarios(), u); }

/* ---------- passwords + tokens ---------- */
function hashPass(pass, salt) {
  salt = salt || crypto.randomBytes(16).toString("hex");
  const h = crypto.scryptSync(pass, salt, 64).toString("hex");
  return salt + ":" + h;
}
function verificarPass(pass, guardado) {
  const [salt, h] = String(guardado).split(":");
  if (!salt || !h) return false;
  const nuevo = crypto.scryptSync(pass, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(h, "hex"), Buffer.from(nuevo, "hex"));
}
function nuevoToken() { return crypto.randomBytes(24).toString("hex"); }

/* ---------- helpers http ---------- */
function cors(res, origin) {
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Vary", "Origin");
}
function responder(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(body);
}
function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let data = "", size = 0;
    req.on("data", c => { size += c.length; if (size > MAX_BODY) { reject(new Error("too big")); req.destroy(); } else data += c; });
    req.on("end", () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
    req.on("error", reject);
  });
}
function usuarioDeToken(req) {
  const auth = req.headers["authorization"] || "";
  const tok = auth.replace(/^Bearer\s+/i, "").trim();
  if (!tok) return null;
  const us = cargarUsuarios();
  for (const email in us) {
    const u = us[email];
    if (u.token === tok && u.tokenExp > Date.now()) return { email, u };
  }
  return null;
}
function emailValido(e) { return typeof e === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) && e.length <= 120; }

/* ---------- rutas ---------- */
const rutas = {
  "GET /api/salud": async (req, res) => responder(res, 200, { ok: true, servicio: "futbolini", hora: new Date().toISOString() }),

  "POST /api/registro": async (req, res) => {
    const b = await leerCuerpo(req);
    const email = String(b.email || "").toLowerCase().trim();
    const pass = String(b.pass || "");
    if (!emailValido(email)) return responder(res, 400, { ok: false, msg: "Correo inválido." });
    if (pass.length < 6) return responder(res, 400, { ok: false, msg: "La clave debe tener al menos 6 caracteres." });
    const us = cargarUsuarios();
    if (us[email]) return responder(res, 409, { ok: false, msg: "Ese correo ya está registrado. Entra en vez de crear." });
    const token = nuevoToken();
    us[email] = { pass: hashPass(pass), token, tokenExp: Date.now() + TOKEN_TTL, creado: Date.now() };
    guardarUsuarios(us);
    responder(res, 200, { ok: true, token, email });
  },

  "POST /api/entrar": async (req, res) => {
    const b = await leerCuerpo(req);
    const email = String(b.email || "").toLowerCase().trim();
    const pass = String(b.pass || "");
    const us = cargarUsuarios();
    const u = us[email];
    if (!u || !verificarPass(pass, u.pass)) return responder(res, 401, { ok: false, msg: "Correo o clave incorrectos." });
    u.token = nuevoToken(); u.tokenExp = Date.now() + TOKEN_TTL;
    guardarUsuarios(us);
    responder(res, 200, { ok: true, token: u.token, email });
  },

  "POST /api/subir": async (req, res) => {
    const sesion = usuarioDeToken(req);
    if (!sesion) return responder(res, 401, { ok: false, msg: "Entra a tu cuenta primero." });
    const b = await leerCuerpo(req);
    if (!b || typeof b.estado !== "object") return responder(res, 400, { ok: false, msg: "Falta el estado de la partida." });
    const id = crypto.createHash("sha1").update(sesion.email).digest("hex");
    escribirJSON(path.join(DATA_DIR, "saves", id + ".json"), { estado: b.estado, updated: Date.now() });
    responder(res, 200, { ok: true });
  },

  "GET /api/bajar": async (req, res) => {
    const sesion = usuarioDeToken(req);
    if (!sesion) return responder(res, 401, { ok: false, msg: "Entra a tu cuenta primero." });
    const id = crypto.createHash("sha1").update(sesion.email).digest("hex");
    const save = leerJSON(path.join(DATA_DIR, "saves", id + ".json"), null);
    if (!save) return responder(res, 200, { ok: false, vacio: true, msg: "No hay ninguna partida guardada en la nube todavía." });
    responder(res, 200, { ok: true, estado: save.estado, cuando: save.updated });
  },

  /* datos vivos: el juego los baja al abrir; editás este archivo y todos lo
     tienen al próximo abrir, SIN redeploy de GitHub Pages. */
  "GET /api/datos": async (req, res) => {
    const datos = leerJSON(path.join(DATA_DIR, "datos.json"), { version: 0, nota: "sin datos remotos" });
    responder(res, 200, { ok: true, datos });
  },

  /* actualizar los datos vivos (requiere ADMIN_KEY en el header x-admin-key) */
  "POST /api/datos": async (req, res) => {
    if (!ADMIN_KEY || (req.headers["x-admin-key"] || "") !== ADMIN_KEY) return responder(res, 403, { ok: false, msg: "No autorizado." });
    const b = await leerCuerpo(req);
    if (!b || typeof b.datos !== "object") return responder(res, 400, { ok: false, msg: "Falta 'datos'." });
    b.datos.version = (b.datos.version || 0);
    escribirJSON(path.join(DATA_DIR, "datos.json"), b.datos);
    responder(res, 200, { ok: true, version: b.datos.version });
  }
};

/* ---------- servidor ---------- */
const server = http.createServer(async (req, res) => {
  cors(res, req.headers.origin);
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  const url = (req.url || "/").split("?")[0].replace(/\/+$/, "") || "/";
  const clave = req.method + " " + url;
  const handler = rutas[clave];
  if (!handler) return responder(res, 404, { ok: false, msg: "Ruta no encontrada: " + clave });
  try { await handler(req, res); }
  catch (e) { responder(res, 400, { ok: false, msg: "Error procesando la petición." }); }
});
server.listen(PORT, () => console.log("Futbolini server escuchando en :" + PORT + " (datos en " + DATA_DIR + ")"));
