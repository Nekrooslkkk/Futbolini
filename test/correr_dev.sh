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
# 7.9108 · un envoltorio (typeof X==="function" + X=function…) en un archivo que carga ANTES que el que declara X no se
# instala nunca y falla en silencio (así la liga argentina perdió el Clausura). Los que ya se instalan tarde a propósito
# (llamada extra en DOMContentLoaded o dentro de otra función) van en TARDIOS.
echo "· envoltorios que se instalan antes de que exista la función"
python3 - <<'PY' || exit 1
import re,sys
TARDIOS={("js/data-argentina2026.js","resolverCopa"),("js/data-argentina2026.js","terminarPartido"),
         ("js/data-2006.js","terminarPartido"),("js/data-2006.js","resolverCopa"),("js/liga-registrar.js","resolverCopa")}
orden=[m.group(1) for m in re.finditer(r'<script src="(js/[^"?]+)',open('index.html',encoding='utf-8').read())]
pos={f:i for i,f in enumerate(orden)}; decl={}; src={}
for f in orden:
    try: src[f]=open(f,encoding='utf-8').read()
    except Exception: continue
    for m in re.finditer(r'^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(|^(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=',src[f],re.M):
        decl.setdefault(m.group(1) or m.group(2),[]).append(f)
malos=[]
for f,s in src.items():
    for m in re.finditer(r'typeof\s+([A-Za-z_$][\w$]*)\s*[!=]==\s*"function"',s):
        n=m.group(1)
        if n not in decl or min(pos[x] for x in decl[n])<=pos[f] or (f,n) in TARDIOS: continue
        if re.search(r'(^|[^.\w])'+re.escape(n)+r'\s*=\s*function|window\.'+re.escape(n)+r'\s*=|envolver\(\s*"'+re.escape(n)+'"',s):
            malos.append(f"{f}:{s.count(chr(10),0,m.start())+1} envuelve {n}, que nace después en {decl[n][0]}")
for x in sorted(set(malos)): print("  ❌ "+x)
print("  ok: ningún envoltorio nuevo antes de tiempo" if not malos else "  (muévelo a una función que se llame también en DOMContentLoaded)")
sys.exit(1 if malos else 0)
PY
# 7.9109 · cada escudo que nombra data-escudos.js existe en disco, y los de Commons tienen su crédito en img/FUENTES.md
echo "· escudos: archivos y créditos"
python3 - <<'PY' || exit 1
import re,os,sys
s=open("js/data-escudos.js",encoding="utf-8").read(); f=open("img/FUENTES.md",encoding="utf-8").read()
mal=[]
for m in re.finditer(r'(?:"([^"]+)"|([A-Za-z_0-9]+)):\{src:"(img/clubes/[^"]+)",tipo:"(\w+)"',s):
    id_=m.group(1) or m.group(2); src,tipo=m.group(3),m.group(4)
    if not os.path.exists(src): mal.append(f"{id_}: falta el archivo {src}")
    elif tipo=="commons":
        base=os.path.basename(src).split(".")[0]; nom=id_[2:] if id_.startswith("n:") else id_
        if ("| "+nom+" |") not in f and ("| "+base+" |") not in f: mal.append(f"{id_}: sin crédito en img/FUENTES.md")
for x in mal: print("  ❌ "+x)
print("  ok: todos los escudos existen y los de Commons tienen crédito" if not mal else "")
sys.exit(1 if mal else 0)
PY
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
