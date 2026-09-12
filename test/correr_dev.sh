#!/usr/bin/env bash
# Corre las pruebas del MOTOR DE EDICIÓN (test/pruebas_dev.js).
# Aparte de correr.sh para no tocar el archivo de tests que edita Grok.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "· node --check js/dev-*.js"
for f in js/dev-*.js; do node --check "$f"; done
CHROME_BIN="${CHROME:-}"
if [ -z "$CHROME_BIN" ]; then
  for c in chromium google-chrome google-chrome-stable chromium-browser /opt/pw-browsers/chromium; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME_BIN="$c"; break; fi
  done
fi
if [ -z "$CHROME_BIN" ]; then echo "⚠ Sin Chromium; solo corrió node --check."; exit 0; fi
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
PAGE="$TMP/pruebas_dev.html"
python3 - "$PAGE" <<'PY'
import sys
s=open("index.html",encoding="utf-8").read()
inject='<pre id="out">corriendo...</pre>\n<script src="test/pruebas_dev.js"></script>\n</body>'
open(sys.argv[1],"w",encoding="utf-8").write(s.replace("</body>",inject))
PY
cp "$PAGE" ./_pruebas_dev_tmp.html
OUT=$(timeout 120 "$CHROME_BIN" --headless --no-sandbox --disable-gpu --virtual-time-budget=15000 --dump-dom ./_pruebas_dev_tmp.html 2>/dev/null | python3 -c "
import sys,re,html
d=sys.stdin.read(); m=re.search(r'<pre id=\"out\">(.*?)</pre>', d, re.S)
print(html.unescape(m.group(1)) if m else 'NO OUT')
")
rm -f ./_pruebas_dev_tmp.html
echo "$OUT"
echo "$OUT" | grep -q "PRUEBAS_DEV_DONE:PASS"
