# HOSTING.md — Railway (sin Hetzner)

El juego en GitHub Pages sigue igual. Railway corre `server/index.js`:
login, guardar partida y `/api/datos`.

Costo: plan Hobby ~US$5/mes.

## 1. Crear el servicio
1. Entra a https://railway.com con GitHub.
2. New Project → Deploy from GitHub repo → `Nekrooslkkk/Futbolini`.
3. Settings → start command: `node server/index.js` (ya viene en `Procfile` / `railway.json`).
4. Variables:
   - `PORT` lo pone Railway solo. No lo hardcodes.
   - `DATA_DIR` = `/data`
   - `ADMIN_KEY` = una clave larga que solo vos sepas (para editar `/api/datos`).
5. Volume: New Volume → mount `/data` (si no, cada deploy borra cuentas y partidas).
6. Settings → Networking → Generate Domain.
   Queda algo tipo `futbolini-production-xxxx.up.railway.app`.

## 2. Probar
Abrí `https://TU_DOMINIO.up.railway.app/api/salud`
Tiene que responder `{"ok":true,"servicio":"futbolini",...}`.

## 3. Enchufar el juego
Pasale esa URL a Grok (o a Claude) y se pega en `js/servidor.js`:

```js
const SERVIDOR_CONFIG = {
  base: "https://TU_DOMINIO.up.railway.app"
};
```

Commit + push. Pages se actualiza. El front sigue en Pages; las cuentas viven en Railway.

## 4. Dominio propio (cuando lo compres)
Railway → Custom Domain → `futbolini.cl` → CNAME en NIC/Namecheap.
Después cambiá `SERVIDOR_CONFIG.base` a `https://futbolini.cl`.

## Qué no tocar
- No subas `ADMIN_KEY` al repo.
- El juego sin `base` sigue 100% offline.
- Hetzner queda documentado en `SERVIDOR.md` por si algún día lo querés; no hace falta.
