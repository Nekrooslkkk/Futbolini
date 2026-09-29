#!/usr/bin/env bash
# PARTIDAS VIEJAS (7.9110): los saves de test/saves/*.json.gz (hechos con 7.9003, 7.9053, 7.9090 de verdad)
# tienen que cargar, pintar todas las secciones y terminar su temporada en la versión actual.
# Para agregar una versión: ver test/README.md ("Saves viejos").
set -uo pipefail
cd "$(dirname "$0")/.."
CHROME_BIN="${CHROME:-}"
if [ -z "$CHROME_BIN" ]; then
  for c in chromium google-chrome google-chrome-stable chromium-browser /opt/pw-browsers/chromium /opt/pw-browsers/chromium-*/chrome-linux/chrome; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME_BIN="$c"; break; fi
  done
fi
if [ -z "$CHROME_BIN" ]; then echo "⚠ Sin Chromium: no se pueden probar los saves."; exit 0; fi
python3 - <<'PY'
import glob,gzip,json
packs=[json.loads(gzip.open(p).read()) for p in sorted(glob.glob("test/saves/*.json.gz"))]
open("_saves_datos.js","w",encoding="utf-8").write("window.SAVES_VIEJOS="+json.dumps(packs,ensure_ascii=False)+";")
s=open("index.html",encoding="utf-8").read()
inject='<pre id="out">corriendo...</pre>\n<script src="_saves_datos.js"></script>\n<script src="test/saves.js"></script>\n</body>'
open("_saves_tmp.html","w",encoding="utf-8").write(s.replace("</body>",inject))
PY
DIR=$(mktemp -d)
trap 'rm -f ./_saves_tmp.html ./_saves_datos.js; rm -rf "$DIR"' EXIT
OUT=$(timeout 900 "$CHROME_BIN" --headless=new --no-sandbox --disable-gpu --user-data-dir="$DIR" --window-size=1366,800 --virtual-time-budget=600000 --dump-dom "file://$PWD/_saves_tmp.html" 2>/dev/null | python3 -c "
import sys,re,html
d=sys.stdin.read(); m=re.search(r'<pre id=\"out\">(.*?)</pre>', d, re.S)
print(html.unescape(m.group(1)) if m else 'NO OUT · SAVES_DONE:FAIL')
")
echo "$OUT" | grep -v "SAVES_DONE"
echo
if echo "$OUT" | grep -q "SAVES_DONE:PASS"; then echo "✅ PARTIDAS VIEJAS: todas cargan y siguen"; exit 0; else echo "❌ PARTIDAS VIEJAS con fallas"; exit 1; fi
