#!/usr/bin/env bash
# Corre las pruebas del MOTOR DE EDICIÓN (test/pruebas_dev.js).
# Aparte de correr.sh para no tocar el archivo de tests que edita Grok.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "· node --check js/dev-*.js"
for f in js/dev-*.js; do node --check "$f"; done
# 7.9082 · funciones declaradas dos veces en js/: la copia del archivo que carga ANTES es código muerto
# (la del que carga después la pisa). DEUDA = las que ya se sabe que sobran (ver GUIA_HUMANO.md, tarea L1).
# Si borras una copia muerta, sácala de DEUDA. Si aparece una duplicada nueva, esto falla.
DEUDA=" _animBola _arcoMira _arcoPunto _arqDestino _figPersona htmlArcoVivo momentoTrivia triviaMate "
echo "· funciones duplicadas en js/"
DUP=$(grep -ho "^function [A-Za-z_0-9]*" js/*.js | awk '{print $2}' | sort | uniq -d)
NUEVAS=""; for f in $DUP; do case "$DEUDA" in *" $f "*) ;; *) NUEVAS="$NUEVAS $f";; esac; done
for f in $DEUDA; do echo "$DUP" | grep -qx "$f" || echo "  ✨ $f ya no está duplicada: sácala de DEUDA en test/correr_dev.sh"; done
if [ -n "$NUEVAS" ]; then echo "  ❌ función declarada en dos archivos (una copia queda muerta):$NUEVAS"; grep -n "^function \($(echo $NUEVAS | sed 's/ /\\|/g')\)\b" js/*.js; exit 1; fi
echo "  deuda conocida: $(echo $DUP | wc -w) duplicadas (bajarlas a 0 es la tarea L1 de GUIA_HUMANO.md)"
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
