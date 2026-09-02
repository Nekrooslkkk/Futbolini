# SERVIDOR.md — montar el backend de Futbolini (Hetzner, ~€3,79/mes)

Guía copy-paste. El juego sigue gratis y offline en GitHub Pages; el servidor
es una **capa opcional** para: login + guardar tu partida en la nube, y
**actualizar contenido sin redeploy** (`/api/datos`).

## 0. Por qué Hetzner CAX11
Lo más barato piola: **CAX11 (ARM), ~€3,79/mes**, 2 vCPU, 4 GB RAM, IP fija
incluida. Alcanza de sobra. (Alternativa cero-mantención: Railway/Render ~US$5,
o Cloudflare; pero Hetzner es tuyo y baratísimo.)

## 1. Crear el servidor
1. Cuenta en https://console.hetzner.cloud → **New Project**.
2. **Add Server** → Location: Falkenstein/Nuremberg → Image: **Ubuntu 24.04**
   → Type: **CAX11** (Arm64, el más barato) → crea con tu **SSH key**.
3. Anota la **IP pública** (ej: `203.0.113.45`). No hace falta dominio.

## 2. Entrar e instalar Node + Caddy
```bash
ssh root@TU_IP

# Node 20 (Arm) + git
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git

# Caddy (https automático)
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update && apt-get install -y caddy
```

## 3. Subir el código del server
```bash
mkdir -p /opt/futbolini && cd /opt/futbolini
# opción A: clonar el repo y usar la carpeta server/
git clone https://github.com/Nekrooslkkk/Futbolini.git repo
cp -r repo/server/* .
# opción B: scp server/index.js server/datos ... a mano
```

## 4. Correrlo como servicio (systemd, arranca solo)
```bash
# genera una ADMIN_KEY para editar /api/datos
ADMIN=$(openssl rand -hex 16); echo "TU ADMIN_KEY: $ADMIN"

cat >/etc/systemd/system/futbolini.service <<EOF
[Unit]
Description=Futbolini server
After=network.target
[Service]
WorkingDirectory=/opt/futbolini
Environment=PORT=8080
Environment=DATA_DIR=/opt/futbolini/datos
Environment=ADMIN_KEY=$ADMIN
ExecStart=/usr/bin/node /opt/futbolini/index.js
Restart=always
User=root
[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload && systemctl enable --now futbolini
systemctl status futbolini --no-pager
```

## 5. HTTPS con Caddy (usando la IP, sin dominio)
`nip.io` convierte tu IP en dominio: `203.0.113.45` → `203-0-113-45.nip.io`.
```bash
# reemplaza los guiones por TU IP
cat >/etc/caddy/Caddyfile <<'EOF'
203-0-113-45.nip.io {
    encode gzip
    reverse_proxy localhost:8080
}
EOF
systemctl reload caddy
```
Probá: `https://203-0-113-45.nip.io/api/salud` → debe responder `{"ok":true,...}`.

## 6. Enchufar el juego
En `js/servidor.js`, pon tu URL:
```js
const SERVIDOR_CONFIG = { base: "https://203-0-113-45.nip.io" };
```
Commit + push. Listo: el login y el guardado en la nube quedan andando.

## Firewall (opcional, recomendado)
En Hetzner Cloud → Firewalls: permití entrada solo a **22 (SSH), 80, 443**.
El 8080 queda interno (solo Caddy lo habla).

## Endpoints
| Método | Ruta | Qué hace |
|---|---|---|
| POST | /api/registro | crear cuenta {email,pass} → token |
| POST | /api/entrar | login → token |
| POST | /api/subir | guardar partida (auth) |
| GET | /api/bajar | bajar partida (auth) |
| GET | /api/datos | datos vivos (updates sin redeploy) |
| POST | /api/datos | editar datos vivos (header `x-admin-key`) |
| GET | /api/salud | health check |

## Backups
Todo vive en `/opt/futbolini/datos/`. Un `tar czf backup.tgz datos/` de vez en
cuando (o un cron) y listo.
