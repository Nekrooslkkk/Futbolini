#!/usr/bin/env bash
# DUELOS (7.9116): dos copias del juego arman una sala con contraseña y juegan un duelo entero, con un buzón de
# prueba en vez del de PeerJS (sin internet). Necesita python3 (sirve el repo en un puerto local) y Chromium.
set -uo pipefail
cd "$(dirname "$0")/.."
CHROME_BIN="${CHROME:-}"
if [ -z "$CHROME_BIN" ]; then
  for c in chromium google-chrome google-chrome-stable chromium-browser /opt/pw-browsers/chromium /opt/pw-browsers/chromium-*/chrome-linux/chrome; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME_BIN="$c"; break; fi
  done
fi
if [ -z "$CHROME_BIN" ]; then echo "⚠ Sin Chromium: no se prueban los duelos."; exit 0; fi
python3 - <<'PY'
s=open("index.html",encoding="utf-8").read()
open("_duelo_juego.html","w",encoding="utf-8").write(s.replace("<head>","<head>\n<script src=\"test/peer_falso.js\"></script>",1))
open("_duelo_tmp.html","w",encoding="utf-8").write('<!doctype html><meta charset="utf-8"><body><pre id="out">corriendo...</pre>'
  '<iframe id="A" src="_duelo_juego.html" style="width:420px;height:900px"></iframe>'
  '<iframe id="B" src="_duelo_juego.html" style="width:420px;height:900px"></iframe>'
  '<script>window.__buzon={peers:{}};</script><script src="test/duelo.js"></script></body>')
PY
PORT=$((20000 + RANDOM % 20000))
python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 &
SRV=$!
DIR=$(mktemp -d)
trap 'kill $SRV 2>/dev/null; rm -f ./_duelo_tmp.html ./_duelo_juego.html; rm -rf "$DIR"' EXIT
sleep 1
OUT=$(timeout 600 "$CHROME_BIN" --headless=new --no-sandbox --disable-gpu --user-data-dir="$DIR" --window-size=900,1000 \
  --virtual-time-budget=400000 --dump-dom "http://127.0.0.1:$PORT/_duelo_tmp.html" 2>/dev/null | python3 -c "
import sys,re,html
d=sys.stdin.read(); m=re.search(r'<pre id=\"out\">(.*?)</pre>', d, re.S)
print(html.unescape(m.group(1)) if m else 'NO OUT · DUELO_DONE:FAIL')
")
echo "$OUT" | grep -v "DUELO_DONE"
if echo "$OUT" | grep -q "DUELO_DONE:PASS"; then echo "✅ DUELOS: sala, clave, vestuario y partido entero"; exit 0; else echo "❌ DUELOS con fallas"; exit 1; fi
