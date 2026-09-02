"use strict";
/* ============================================================
   FUTBOLINI · servidor.js — cliente del backend propio
   ── OPCIONAL. Si SERVIDOR_CONFIG.base está vacío, no hace nada y el
   juego sigue 100% offline como siempre. ──

   Endpoints: /api/registro /api/entrar /api/subir /api/bajar /api/datos
   (los sirve server/index.js). Habla por fetch puro, sin dependencias.
   ============================================================ */

const SERVIDOR_CONFIG = {
  base: "https://web-production-363f4.up.railway.app"
};
const SRV_LLAVE = "futbolini_srv_sesion";

function servidorActivo() { return !!(SERVIDOR_CONFIG.base); }

function srvSesion() { try { const v = localStorage.getItem(SRV_LLAVE); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function srvGuardarSesion(s) { try { if (s) localStorage.setItem(SRV_LLAVE, JSON.stringify(s)); else localStorage.removeItem(SRV_LLAVE); } catch (e) {} }
function servidorLogueado() { const s = srvSesion(); return !!(s && s.token); }
function servidorEmail() { const s = srvSesion(); return (s && s.email) || ""; }
function servidorSalir() { srvGuardarSesion(null); }

function srvHeaders(conAuth) {
  const h = { "Content-Type": "application/json" };
  if (conAuth) { const s = srvSesion(); if (s && s.token) h["Authorization"] = "Bearer " + s.token; }
  return h;
}
async function srvFetch(ruta, opts) {
  if (!servidorActivo()) throw new Error("El servidor no está configurado.");
  return fetch(SERVIDOR_CONFIG.base + ruta, opts);
}

async function servidorRegistrar(email, pass) {
  try {
    const r = await srvFetch("/api/registro", { method: "POST", headers: srvHeaders(false), body: JSON.stringify({ email, pass }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.token) return { ok: false, msg: j.msg || ("Error " + r.status) };
    srvGuardarSesion({ token: j.token, email: j.email }); return { ok: true, email: j.email };
  } catch (e) { return { ok: false, msg: "No se pudo conectar con el servidor." }; }
}
async function servidorEntrar(email, pass) {
  try {
    const r = await srvFetch("/api/entrar", { method: "POST", headers: srvHeaders(false), body: JSON.stringify({ email, pass }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.token) return { ok: false, msg: j.msg || "Correo o clave incorrectos" };
    srvGuardarSesion({ token: j.token, email: j.email }); return { ok: true, email: j.email };
  } catch (e) { return { ok: false, msg: "No se pudo conectar con el servidor." }; }
}
async function servidorSubir(estado) {
  if (!servidorLogueado()) return { ok: false, msg: "Entra a tu cuenta primero." };
  try {
    const r = await srvFetch("/api/subir", { method: "POST", headers: srvHeaders(true), body: JSON.stringify({ estado }) });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { ok: true } : { ok: false, msg: j.msg || ("Error " + r.status) };
  } catch (e) { return { ok: false, msg: "No se pudo conectar con el servidor." }; }
}
async function servidorBajar() {
  if (!servidorLogueado()) return { ok: false, msg: "Entra a tu cuenta primero." };
  try {
    const r = await srvFetch("/api/bajar", { method: "GET", headers: srvHeaders(true) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, msg: j.msg || ("Error " + r.status) };
    return j;
  } catch (e) { return { ok: false, msg: "No se pudo conectar con el servidor." }; }
}

/* datos vivos: se bajan al abrir para actualizar contenido sin redeploy.
   Guarda en E-nada; devuelve el objeto para que quien lo llame lo mergee. */
async function servidorDatos() {
  if (!servidorActivo()) return null;
  try {
    const r = await srvFetch("/api/datos", { method: "GET", headers: srvHeaders(false) });
    const j = await r.json().catch(() => ({}));
    return (r.ok && j.datos) ? j.datos : null;
  } catch (e) { return null; }
}
