#!/usr/bin/env bash
# ============================================================
# Futbolini · test/correr.sh — corre las pruebas automáticas
# Arma una copia de index.html + inyecta test/pruebas_core.js y la levanta en
# Chromium headless. Sale 0 si TODO VERDE, 1 si hay fallos. Sin red ni APIs.
#
# Uso:   bash test/correr.sh
# Chrome: usa $CHROME si está seteado; si no, busca chromium/google-chrome.
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

# 1) node --check de todos los js (falla rápido ante error de sintaxis)
echo "· node --check js/*.js"
for f in js/*.js server/*.js; do node --check "$f"; done
echo "  sintaxis OK ($(ls js/*.js | wc -l | tr -d ' ') archivos js)"

# 2) buscar Chromium
CHROME_BIN="${CHROME:-}"
if [ -z "$CHROME_BIN" ]; then
  for c in chromium google-chrome google-chrome-stable chromium-browser \
           /opt/pw-browsers/chromium-*/chrome-linux/chrome \
           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME_BIN="$c"; break; fi
  done
fi
if [ -z "$CHROME_BIN" ]; then
  echo "⚠ No encontré Chromium. Seteá CHROME=/ruta/a/chrome y reintentá."
  echo "  (node --check pasó; el resto de las pruebas necesita navegador.)"
  exit 0
fi
echo "· Chromium: $CHROME_BIN"

# 3) armar la página de prueba desde index.html (mismo orden de carga)
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
PAGE="$TMP/pruebas.html"
python3 - "$PAGE" <<'PY'
import sys
src=open("index.html",encoding="utf-8").read()
inject='<pre id="out">corriendo...</pre>\n<script src="test/pruebas_core.js"></script>\n</body>'
open(sys.argv[1],"w",encoding="utf-8").write(src.replace("</body>",inject))
PY
# el archivo debe correr desde la raíz del repo para que las rutas js/... resuelvan
cp "$PAGE" ./_pruebas_tmp.html; trap 'rm -rf "$TMP"; rm -f ./_pruebas_tmp.html' EXIT

# 4) correr headless y extraer el resultado
DOM="$TMP/dom.html"
"$CHROME_BIN" --headless=new --no-sandbox --disable-gpu --virtual-time-budget=30000 \
  --dump-dom "file://$PWD/_pruebas_tmp.html" > "$DOM" 2>/dev/null || true

RES="$(python3 - "$DOM" <<'PY'
import re,html,sys
d=open(sys.argv[1],encoding="utf-8",errors="replace").read()
m=re.search(r'<pre id="out"[^>]*>(.*?)</pre>', d, re.S)
print(html.unescape(m.group(1)) if m else "NO se pudo leer el resultado (¿cargó la página?)")
PY
)"
echo "$RES"

echo "$RES" | grep -q "PRUEBAS_DONE:PASS" && exit 0 || exit 1
