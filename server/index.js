"use strict";
/* ============================================================
   FUTBOLINI · server/index.js — backend personal (sin dependencias)
   ── Node puro: http + crypto + fs. Nada de npm install. ──

   Qué hace:
   - Login/registro con contraseña hasheada (scrypt) y token de sesión.
   - Guardar/bajar la partida en la nube (una por usuario).
   - Servir datos vivos para actualizar el juego sin redeploy (/api/datos).
   - Servir el juego estático (index.html, js/, css/) en la misma URL.

   Endurecido (7.56): CORS restringido a ALLOWED_ORIGINS, rate limiting por IP
   (login/registro 10/min, API 120/min) y validación de tamaño/forma del guardado
   (SAVE_MAX, por defecto 2 MB). Variables: ALLOWED_ORIGINS (coma-separado), SAVE_MAX.

   Cómo correr:  PORT=8080 DATA_DIR=./datos ADMIN_KEY=loquesea node index.js
   ============================================================ */

const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "8080", 10);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "datos");
const ADMIN_KEY = process.env.ADMIN_KEY || "";
const TOKEN_TTL = 1000 * 60 * 60 * 24 * 30;
const MAX_BODY = 5 * 1024 * 1024;
const SAVE_MAX = parseInt(process.env.SAVE_MAX || String(2 * 1024 * 1024), 10);  /* 2 MB por partida */
/* CORS: orígenes permitidos (coma-separados en ALLOWED_ORIGINS). Por defecto el
   GitHub Pages del juego + localhost. El propio Railway se sirve same-origin. */
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://nekrooslkkk.github.io,http://localhost:8080,http://127.0.0.1:8080")
  .split(",").map(function (s) { return s.trim(); }).filter(Boolean);
/* rate limiting en memoria por IP (sin dependencias). */
const _rl = new Map();
function ipDe(req) {
  const xf = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return xf || (req.socket && req.socket.remoteAddress) || "?";
}
function limitar(clave, max, ventanaMs) {
  const ahora = Date.now();
  let e = _rl.get(clave);
  if (!e || ahora > e.reset) { e = { n: 0, reset: ahora + ventanaMs }; _rl.set(clave, e); }
  e.n++;
  return e.n > max;   /* true = pasó el límite */
}
setInterval(function () { const ahora = Date.now(); _rl.forEach(function (v, k) { if (ahora > v.reset) _rl.delete(k); }); }, 60000);
const PUBLIC = path.join(__dirname, "..");
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8"
};

function versionDelJuego() {
  try {
    const fuente = fs.readFileSync(path.join(PUBLIC, "js", "util.js"), "utf8");
    const match = fuente.match(/const VERSION\s*=\s*["']([^"']+)["']/);
    return match ? match[1] : "desconocida";
  } catch (e) { return "desconocida"; }
}

fs.mkdirSync(path.join(DATA_DIR, "saves"), { recursive: true });

function rutaUsuarios() { return path.join(DATA_DIR, "usuarios.json"); }
function leerJSON(f, def) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return def; } }
function escribirJSON(f, obj) { fs.writeFileSync(f, JSON.stringify(obj)); }
function cargarUsuarios() { return leerJSON(rutaUsuarios(), {}); }
function guardarUsuarios(u) { escribirJSON(rutaUsuarios(), u); }

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

function cors(res, origin) {
  /* solo se refleja el origen si está en la lista blanca; si no, se responde con
     el primero permitido (el navegador bloqueará el cruce no autorizado). */
  const permitido = (origin && ALLOWED_ORIGINS.indexOf(origin) >= 0) ? origin : (ALLOWED_ORIGINS[0] || "null");
  res.setHeader("Access-Control-Allow-Origin", permitido);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-key");
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

function servirEstatico(url, res) {
  let rel = url === "/" ? "/index.html" : url;
  if (rel.startsWith("/server") || rel.includes("..")) return false;
  const full = path.normalize(path.join(PUBLIC, rel));
  if (!full.startsWith(path.normalize(PUBLIC))) return false;
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) return false;
  res.writeHead(200, { "Content-Type": MIME[path.extname(full)] || "application/octet-stream" });
  res.end(fs.readFileSync(full));
  return true;
}

const rutas = {
  "GET /api/salud": async (req, res) => responder(res, 200, { ok: true, servicio: "futbolini", version: versionDelJuego(), hora: new Date().toISOString() }),

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
    if (!b || typeof b.estado !== "object" || Array.isArray(b.estado)) return responder(res, 400, { ok: false, msg: "Falta el estado de la partida." });
    const serial = JSON.stringify(b.estado);
    if (serial.length > SAVE_MAX) return responder(res, 413, { ok: false, msg: "La partida es demasiado grande para guardar en la nube." });
    const id = crypto.createHash("sha1").update(sesion.email).digest("hex");
    fs.writeFileSync(path.join(DATA_DIR, "saves", id + ".json"), JSON.stringify({ estado: b.estado, updated: Date.now() }));
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

  "GET /api/datos": async (req, res) => {
    const datos = leerJSON(path.join(DATA_DIR, "datos.json"), { version: 0, nota: "sin datos remotos" });
    responder(res, 200, { ok: true, datos });
  },

  "POST /api/datos": async (req, res) => {
    if (!ADMIN_KEY || (req.headers["x-admin-key"] || "") !== ADMIN_KEY) return responder(res, 403, { ok: false, msg: "No autorizado." });
    const b = await leerCuerpo(req);
    if (!b || typeof b.datos !== "object") return responder(res, 400, { ok: false, msg: "Falta 'datos'." });
    b.datos.version = (b.datos.version || 0);
    escribirJSON(path.join(DATA_DIR, "datos.json"), b.datos);
    responder(res, 200, { ok: true, version: b.datos.version });
  }
};

const server = http.createServer(async (req, res) => {
  cors(res, req.headers.origin);
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  const url = (req.url || "/").split("?")[0].replace(/\/+$/, "") || "/";
  const clave = req.method + " " + url;
  /* rate limiting solo en la API (los estáticos van libres). Login/registro más
     estricto para frenar fuerza bruta. */
  if (url.indexOf("/api/") === 0) {
    const ip = ipDe(req);
    if ((url === "/api/registro" || url === "/api/entrar") && limitar("auth:" + ip, 10, 60000))
      return responder(res, 429, { ok: false, msg: "Demasiados intentos. Espera un minuto." });
    if (limitar("api:" + ip, 120, 60000))
      return responder(res, 429, { ok: false, msg: "Demasiadas peticiones. Espera un momento." });
  }
  const handler = rutas[clave];
  if (handler) {
    try { await handler(req, res); }
    catch (e) { responder(res, 400, { ok: false, msg: "Error procesando la petición." }); }
    return;
  }
  if (req.method === "GET" && servirEstatico(url, res)) return;
  responder(res, 404, { ok: false, msg: "Ruta no encontrada: " + clave });
});
server.listen(PORT, () => console.log("Futbolini server escuchando en :" + PORT + " (datos en " + DATA_DIR + ")"));
