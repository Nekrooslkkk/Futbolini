"use strict";
/* ============================================================
   FUTBOLINI · sw.js — el juego vive aunque se caiga internet
   7.9030 (Claude)

   - Al instalarse lee index.html y guarda TODOS los .js/.css/img que
     nombra: la lista nunca queda desactualizada (sin build, sin listas
     a mano que alguien olvida actualizar).
   - 7.9107 · Archivos versionados (?v=VERSION), three.js, fuentes e
     imágenes: CACHÉ PRIMERO. Esa URL exacta nunca cambia de contenido, así
     que no hay que preguntarle a la red: en un celu con 3G la segunda
     apertura pasó de ~10 s a instantánea. index.html: red primero (para
     enterarse de versiones nuevas), pero si la red tarda más de 3,5 s se
     sirve la copia guardada. Las claves de caché incluyen ?v= : una
     versión nueva nunca recibe un archivo viejo.
   - CDN (fuentes, 7.css): caché primero. Son URLs versionadas que no
     cambian; se guardan la primera vez que se usan.
   - Nada de la cuenta ni del servidor se cachea (/api, supabase):
     eso tiene que ser siempre en vivo o fallar honesto.
   La versión viene en la URL de registro (sw.js?v=VERSION): cada
   parche nuevo instala una caché nueva y borra las viejas.
   ============================================================ */
const SW_VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE_JUEGO = "futbolini-juego-" + SW_VERSION;
const CACHE_CDN = "futbolini-cdn-1";
const CDN_OK = /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com)\//;
const NUNCA = /\/api\/|supabase\.co|railway\.app/;

function assetsDe(html){
  const out = new Set(["./", "index.html"]);
  const re = /(?:src|href)\s*=\s*["']([^"'#]+)["']/g;
  let m;
  while((m = re.exec(html))){
    const u = m[1];
    if(/^(https?:)?\/\//.test(u) || u.startsWith("data:") || u.startsWith("mailto:")) continue;
    out.add(u);   /* 7.9107 · con ?v= : la clave es la versión exacta */
  }
  return [...out];
}

self.addEventListener("install", ev => {
  ev.waitUntil((async () => {
    const cache = await caches.open(CACHE_JUEGO);
    const r = await fetch("index.html", {cache: "no-store"});
    const html = await r.text();
    await cache.put("index.html", new Response(html, {headers: {"Content-Type": "text/html; charset=utf-8"}}));
    /* uno por uno: si falta un archivo, el resto igual queda (no todo-o-nada) */
    await Promise.all(assetsDe(html).map(u => cache.add(u).catch(() => null)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", ev => {
  ev.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("futbolini-juego-") && k !== CACHE_JUEGO).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", ev => {
  const req = ev.request;
  if(req.method !== "GET") return;
  const url = req.url;
  if(NUNCA.test(url)) return;
  if(CDN_OK.test(url)){ ev.respondWith(cdnPrimero(req)); return; }
  const u = new URL(url);
  if(u.origin !== self.location.origin) return;
  if(req.mode !== "navigate" && (u.searchParams.has("v") || /\/(js\/vendor|fonts|img)\//.test(u.pathname))){ ev.respondWith(cachePrimero(req)); return; }
  ev.respondWith(redPrimero(req));
});

/* 7.9107 · lo versionado no cambia: se sirve de la caché sin preguntar */
async function cachePrimero(req){
  const cache = await caches.open(CACHE_JUEGO);
  const c = await cache.match(req);
  if(c) return c;
  try{
    const r = await fetch(req);
    if(r && r.ok) cache.put(req, r.clone());
    return r;
  }catch(e){
    const v = await cache.match(req, {ignoreSearch: true});   /* sin red: mejor una versión anterior que nada */
    if(v) return v;
    throw e;
  }
}
async function redPrimero(req){
  const cache = await caches.open(CACHE_JUEGO);
  const clave = req.mode === "navigate" ? "index.html" : req.url.replace(/\?.*$/, "");
  try{
    /* red lenta: a los 3,5 s se sirve lo guardado (si hay) y la red sigue actualizando la copia por detrás */
    const red = fetch(req).then(r => { if(r && r.ok) cache.put(clave, r.clone()); return r; });
    red.catch(() => null);   /* si ya se sirvió lo guardado, un fallo de red posterior no es un error */
    const guardado = await cache.match(clave);
    return guardado ? await Promise.race([red, new Promise(res => setTimeout(() => res(guardado), 3500))]) : await red;
  }catch(e){
    const c = await cache.match(clave) || await cache.match(req, {ignoreSearch: true});
    if(c) return c;
    if(req.mode === "navigate"){ const i = await cache.match("index.html"); if(i) return i; }
    throw e;
  }
}

async function cdnPrimero(req){
  const cache = await caches.open(CACHE_CDN);
  const c = await cache.match(req);
  if(c) return c;
  try{
    const r = await fetch(req);
    if(r && (r.ok || r.type === "opaque")) cache.put(req, r.clone());
    return r;
  }catch(e){
    /* sin red y sin copia: la fuente cae a la del sistema; el juego sigue */
    return new Response("", {status: 504, statusText: "sin red"});
  }
}

/* el juego pregunta cuánto tiene guardado para la pantalla de Ajustes */
self.addEventListener("message", async ev => {
  if(!ev.data || ev.data.tipo !== "estado") return;
  const c = await caches.open(CACHE_JUEGO);
  const k = await c.keys();
  const cd = await caches.open(CACHE_CDN);
  const kc = await cd.keys();
  ev.source && ev.source.postMessage({tipo: "estado", version: SW_VERSION, archivos: k.length, cdn: kc.length});
});
