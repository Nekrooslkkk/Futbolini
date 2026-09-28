#!/usr/bin/env bash
# Corre el DOCTOR completo (devDoctor) sobre partidas representativas, cada una en un navegador limpio.
# Úsalo antes de subir: si algo se rompió, dice qué chequeo, en qué archivo:línea y por qué.
#   bash test/doctor.sh                 → las 3 de siempre
#   bash test/doctor.sh RIV,2026 UC,2026 → las que digas
# 7.9082: la primera partida corre además en pantalla de celular (390×844): el desborde de página en el
# celu solo se ve con esa ventana (medido: una regla de la barra desbordaba 200 px y en PC no se notaba).
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME_BIN="${CHROME:-}"
if [ -z "$CHROME_BIN" ]; then
  for c in chromium google-chrome google-chrome-stable chromium-browser /opt/pw-browsers/chromium; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME_BIN="$c"; break; fi
  done
fi
if [ -z "$CHROME_BIN" ]; then echo "⚠ Sin Chromium: no se puede correr el doctor."; exit 0; fi
PARTIDAS=("$@"); [ ${#PARTIDAS[@]} -eq 0 ] && PARTIDAS=("CC,2026,historico" "CC,1991,historico" "LIN,2026,historico" "TRA,2026,historico")   # TRA = Segunda por zonas (7.9094)
python3 - <<'PY'
s=open("index.html",encoding="utf-8").read()
inject='<pre id="out">corriendo...</pre>\n<script src="test/doctor.js"></script>\n</body>'
open("_doctor_tmp.html","w",encoding="utf-8").write(s.replace("</body>",inject))
PY
trap 'rm -f ./_doctor_tmp.html' EXIT
FALLA=0
CORRIDAS=(); for P in "${PARTIDAS[@]}"; do CORRIDAS+=("$P|1366,800"); done
CORRIDAS+=("${PARTIDAS[0]}|390,844")
for C in "${CORRIDAS[@]}"; do
  P="${C%%|*}"; VEN="${C##*|}"
  [ "$VEN" = "390,844" ] && echo "── celular 390×844 ──"
  OUT=$(timeout 600 "$CHROME_BIN" --headless=new --no-sandbox --disable-gpu --window-size=$VEN --virtual-time-budget=120000 --dump-dom "file://$PWD/_doctor_tmp.html#$P" 2>/dev/null | python3 -c "
import sys,re,html
d=sys.stdin.read(); m=re.search(r'<pre id=\"out\">(.*?)</pre>', d, re.S)
print(html.unescape(m.group(1)) if m else 'NO OUT · DOCTOR_DONE:FAIL')
")
  echo "$OUT" | grep -v "DOCTOR_DONE"
  echo "$OUT" | grep -q "DOCTOR_DONE:PASS" || FALLA=1
done
echo
if [ $FALLA -eq 0 ]; then echo "✅ DOCTOR SANO en ${#PARTIDAS[@]} partida(s) + celular"; else echo "❌ DOCTOR con fallas"; fi
exit $FALLA
