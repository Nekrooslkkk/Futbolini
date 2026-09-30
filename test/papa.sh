#!/usr/bin/env bash
# 🥔 MODO PAPA (7.9120): el juego juntado en un archivo (con el mismo código que usa sw.js) tiene que ser EL MISMO
# juego. 1) se arma el paquete, 2) chequeos propios (llegó entero, nombres globales, nada pisa al navegador),
# 3) el DOCTOR ENTERO corre adentro del juego juntado, 4) el service worker de verdad lo junta y lo sirve.
set -uo pipefail
cd "$(dirname "$0")/.."
CHROME_BIN="${CHROME:-}"
if [ -z "$CHROME_BIN" ]; then
  for c in chromium google-chrome google-chrome-stable chromium-browser /opt/pw-browsers/chromium /opt/pw-browsers/chromium-*/chrome-linux/chrome; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME_BIN="$c"; break; fi
  done
fi
if [ -z "$CHROME_BIN" ] || ! command -v node >/dev/null 2>&1; then echo "⚠ Sin Chromium o node: no se prueba el Modo papa."; exit 0; fi
trap 'rm -f js/_papa.js js/_papa_guardia.js _papa_nombres.js _papa_doctor.html _papa_chk.html' EXIT
node test/papa_armar.js || exit 1
node --check js/_papa.js || { echo "  ❌ el paquete no es JavaScript válido"; exit 1; }
FALLA=0
leer(){ python3 -c "
import sys,re,html
d=sys.stdin.read(); m=re.search(r'<pre id=\"out\">(.*?)</pre>', d, re.S)
print(html.unescape(m.group(1)) if m else 'NO OUT · $1_DONE:FAIL')
"; }
OUT=$(timeout 300 "$CHROME_BIN" --headless=new --no-sandbox --disable-gpu --window-size=1366,800 --virtual-time-budget=60000 --dump-dom "file://$PWD/_papa_chk.html" 2>/dev/null | leer PAPA)
echo "$OUT" | grep -v "PAPA_DONE"; echo "$OUT" | grep -q "PAPA_DONE:PASS" || FALLA=1
echo "· doctor completo dentro del juego juntado"
OUT=$(timeout 600 "$CHROME_BIN" --headless=new --no-sandbox --disable-gpu --window-size=1366,800 --virtual-time-budget=120000 --dump-dom "file://$PWD/_papa_doctor.html#CC,2026,historico" 2>/dev/null | leer DOCTOR)
echo "$OUT" | grep -E "❌|SANO|ENFERMO|NO OUT" | head -20; echo "$OUT" | grep -q "DOCTOR_DONE:PASS" || FALLA=1
if [ -f /opt/node22/lib/node_modules/playwright/index.mjs ] || node -e "require.resolve('playwright')" >/dev/null 2>&1; then
  echo "· service worker de verdad"
  node test/papa_sw.mjs || FALLA=1
else echo "  ⚠ sin Playwright: el service worker no se prueba de punta a punta"; fi
if [ $FALLA -eq 0 ]; then echo "✅ MODO PAPA: mismo juego, un archivo, doctor sano adentro"; else echo "❌ MODO PAPA con fallas"; fi
exit $FALLA
