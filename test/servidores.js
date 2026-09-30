/* FUTBOLINI · test/servidores.js (7.9116) · levanta servidor.js y server/index.js en puertos al azar y los ataca:
   URL rota, archivos ocultos, datos del servidor, cuerpos gigantes, tokens en claro, fuerza bruta con IP inventada.
   Node puro (sin npm). Uso: node test/servidores.js */
"use strict";
const { spawn } = require("child_process");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const RAIZ = path.join(__dirname, "..");
let malos = 0;
function ok(c, t) { console.log((c ? "  ✅ " : "  ❌ ") + t); if (!c) malos++; }
function pedir(port, metodo, ruta, cuerpo, headers) {
  return new Promise(res => {
    const r = http.request({ host: "127.0.0.1", port, method: metodo, path: ruta, headers: Object.assign({ "Content-Type": "application/json" }, headers || {}) }, rr => {
      let d = ""; rr.on("data", c => d += c); rr.on("end", () => res({ code: rr.statusCode, body: d, h: rr.headers }));
    });
    r.on("error", e => res({ code: 0, body: String(e.message) }));
    if (cuerpo) r.write(cuerpo); r.end();
  });
}
function levantar(args, env, port) {
  const p = spawn(process.execPath, args, { cwd: RAIZ, env: Object.assign({}, process.env, env), stdio: "ignore" });
  return new Promise(res => { const t0 = Date.now(); (function probar() {
    pedir(port, "GET", "/index.html").then(r => { if (r.code) res(p); else if (Date.now() - t0 > 8000) res(p); else setTimeout(probar, 150); }); })(); });
}
(async function () {
  /* ---- servidor.js (el local) ---- */
  console.log("▸ servidor.js");
  const p1 = 30000 + Math.floor(Math.random() * 20000);
  const s1 = await levantar(["servidor.js", String(p1)], {}, p1);
  ok((await pedir(p1, "GET", "/index.html")).code === 200, "sirve el juego");
  { const r = await pedir(p1, "GET", "/index.html"); ok(r.h && r.h["x-frame-options"] === "SAMEORIGIN" && /frame-ancestors 'self'/.test(r.h["content-security-policy"] || "") && r.h["x-content-type-options"] === "nosniff", "7.9118 · no se deja meter en un iframe ajeno (clickjacking) y no adivina tipos"); }
  ok((await pedir(p1, "GET", "/%E0%A4%A")).code === 400, "una URL mal formada no lo tumba (400)");
  ok((await pedir(p1, "GET", "/index.html")).code === 200, "sigue vivo después de la URL rota");
  ok((await pedir(p1, "GET", "/.git/config")).code !== 200, "no sirve .git");
  ok((await pedir(p1, "GET", "/server/index.js")).code !== 200, "no sirve el código ni los datos del servidor");
  ok((await pedir(p1, "GET", "/..%2f..%2fetc%2fpasswd")).code !== 200, "no sale de la carpeta del juego");
  ok((await pedir(p1, "POST", "/api/presencia", JSON.stringify({ id: "x".repeat(20000) }))).code === 413, "un POST gigante se corta (413)");
  s1.kill();
  /* ---- server/index.js (cuentas y nube) ---- */
  console.log("▸ server/index.js");
  const datos = fs.mkdtempSync(path.join(os.tmpdir(), "futbolini-srv-"));
  const p2 = 30000 + Math.floor(Math.random() * 20000);
  const s2 = await levantar(["server/index.js"], { PORT: String(p2), DATA_DIR: datos, ADMIN_KEY: "clave-admin-de-prueba" }, p2);
  const reg = await pedir(p2, "POST", "/api/registro", JSON.stringify({ email: "a@b.cl", pass: "secreta123" }));
  let tok = ""; try { tok = JSON.parse(reg.body).token; } catch (e) {}
  ok(reg.code === 200 && tok, "registro entrega token");
  const us = fs.readFileSync(path.join(datos, "usuarios.json"), "utf8");
  ok(us.indexOf(tok) < 0, "el token NO queda guardado en claro en usuarios.json");
  ok((await pedir(p2, "GET", "/api/bajar", null, { Authorization: "Bearer " + tok })).code === 200, "el token sirve para entrar");
  ok((await pedir(p2, "GET", "/api/bajar", null, { Authorization: "Bearer otro" })).code === 401, "un token inventado no entra");
  ok((await pedir(p2, "POST", "/api/datos", "{}", { "x-admin-key": "clave-admin-de-prueb" })).code === 403, "clave de admin equivocada: 403");
  ok((await pedir(p2, "GET", "/.git/config")).code !== 200, "no sirve .git");
  { const r = await pedir(p2, "GET", "/index.html"); ok(r.code === 200 && r.h["x-frame-options"] === "SAMEORIGIN" && r.h["x-content-type-options"] === "nosniff", "7.9118 · el juego servido no se deja meter en un iframe ajeno"); }
  let bloqueado = false;
  for (let i = 0; i < 14; i++) {
    const r = await pedir(p2, "POST", "/api/entrar", JSON.stringify({ email: "a@b.cl", pass: "mala" + i }), { "X-Forwarded-For": "10.0.0." + i });
    if (r.code === 429) { bloqueado = true; break; }
  }
  ok(bloqueado, "fuerza bruta frenada aunque invente una IP distinta en cada intento (X-Forwarded-For)");
  s2.kill();
  try { fs.rmSync(datos, { recursive: true, force: true }); } catch (e) {}
  console.log(malos ? "❌ SERVIDORES con fallas" : "✅ SERVIDORES: sin los agujeros conocidos");
  process.exit(malos ? 1 : 0);
})();
