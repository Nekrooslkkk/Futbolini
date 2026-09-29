#!/usr/bin/env bash
# BANCO DE PRUEBAS POR EQUIPO (7.9110): todos los clubes elegibles × cada época de inicio × modo,
# una temporada entera cada uno, en navegadores limpios y en paralelo.
#   bash test/banco.sh            → todos (4 procesos)
#   bash test/banco.sh CC,UCH RIV → solo esos (cada argumento = un navegador)
#   HILOS=8 bash test/banco.sh    → más procesos
#   TEMPS=3 bash test/banco.sh    → 3 temporadas seguidas por partida (barrido largo)
# Es la prueba para "agregar un equipo y saber que funciona": si falla, dice club, época y qué se rompió.
set -uo pipefail
cd "$(dirname "$0")/.."
CHROME_BIN="${CHROME:-}"
if [ -z "$CHROME_BIN" ]; then
  for c in chromium google-chrome google-chrome-stable chromium-browser /opt/pw-browsers/chromium /opt/pw-browsers/chromium-*/chrome-linux/chrome; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME_BIN="$c"; break; fi
  done
fi
if [ -z "$CHROME_BIN" ]; then echo "⚠ Sin Chromium: no se puede correr el banco."; exit 0; fi
TMP="_banco_tmp.html"
python3 - "$TMP" <<'PY'
import sys
s=open("index.html",encoding="utf-8").read()
inject='<pre id="out">corriendo...</pre>\n<script src="test/banco.js"></script>\n</body>'
open(sys.argv[1],"w",encoding="utf-8").write(s.replace("</body>",inject))
PY
DIR=$(mktemp -d)
trap 'rm -f "./$TMP"; rm -rf "$DIR"' EXIT
TANDAS=("$@")
if [ ${#TANDAS[@]} -eq 0 ]; then
  H=${HILOS:-4}; for i in $(seq 0 $((H-1))); do TANDAS+=("TODOS/$H/$i"); done
fi
i=0
for T in "${TANDAS[@]}"; do
  ( timeout 1500 "$CHROME_BIN" --headless=new --no-sandbox --disable-gpu --user-data-dir="$DIR/p$i" --window-size=1366,800 \
      --virtual-time-budget=1200000 --dump-dom "file://$PWD/$TMP?temps=${TEMPS:-1}#$T" 2>/dev/null | python3 -c "
import sys,re,html
d=sys.stdin.read(); m=re.search(r'<pre id=\"out\">(.*?)</pre>', d, re.S)
print(html.unescape(m.group(1)) if m else 'NO OUT (tanda $T) · BANCO_DONE:FAIL')
" > "$DIR/out$i.txt" ) &
  i=$((i+1))
done
wait
FALLA=0; TOT=0; MAL=0; DESP=0
for f in "$DIR"/out*.txt; do
  grep -v "BANCO_DONE\|^BANCO:\|^✓" "$f"
  grep -q "BANCO_DONE:PASS" "$f" || FALLA=1
  TOT=$((TOT+$(grep -c "^✓\|^❌" "$f"))); MAL=$((MAL+$(grep -c "^❌" "$f"))); DESP=$((DESP+$(grep -c " · DESPEDIDO · " "$f")))
done
[ -n "${VERBOSO:-}" ] && cat "$DIR"/out*.txt | grep "^✓"
echo
# 7.9110 · balance: con el ayudante decidiendo, echar a más de 1 de cada 4 en la PRIMERA temporada es un bug de
# balance (medido: 142/255 antes del arreglo, 24/255 después; los que quedan terminan abajo y fallan el mandato)
if [ $TOT -gt 0 ]; then
  PCT=$((DESP*100/TOT)); echo "Despedidos en la primera temporada: $DESP de $TOT ($PCT%) · tope 25%"
  [ $PCT -gt 25 ] && { echo "❌ demasiados despidos: revisar qué le baja el directorio (bash test/banco.sh CLUB con VERBOSO=1)"; FALLA=1; }
fi
if [ $FALLA -eq 0 ]; then echo "✅ BANCO SANO: $TOT partida(s) × ${TEMPS:-1} temporada(s) sin fallas"; else echo "❌ BANCO: $MAL de $TOT partida(s) con fallas"; fi
exit $FALLA
