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
DEUDA=" "   # 7.9110: las 8 duplicadas se borraron (L1 cerrada). Tiene que quedar vacía.
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
# 7.9119 · ninguna animación infinita puede animar algo que no sea transform/opacity (repinta sin parar: CPU y batería)
echo "· animaciones infinitas baratas"
python3 - <<'PY' || exit 1
import re,glob,sys
kf={}
for f in glob.glob("css/*.css"):
    s=open(f,encoding="utf-8").read()
    for m in re.finditer(r'@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}',s):
        bad=set(re.findall(r'([a-z-]+)\s*:',m.group(2)))-{"transform","opacity","offset"}
        if bad: kf[m.group(1)]=(f,sorted(bad))
mal=[]
for f in glob.glob("css/*.css"):
    s=open(f,encoding="utf-8").read()
    for m in re.finditer(r'animation\s*:\s*([^;}]+)',s):
        v=m.group(1)
        if "infinite" not in v: continue
        for k,(fk,b) in kf.items():
            if re.search(r'(^|\s)'+re.escape(k)+r'(\s|$)',v): mal.append(f"{f}: {k} es infinita y anima {'/'.join(b)} ({fk})")
for x in sorted(set(mal)): print("  ❌ "+x)
print("  ok: todas las infinitas van por transform/opacity" if not mal else "")
sys.exit(1 if mal else 0)
PY
# 7.9118 · la CSP del juego real: nada inline ni eval en script-src, y ningún onclick="…"/onerror="…" armado en los .js
echo "· CSP y manejadores inline"
python3 - <<'PY' || exit 1
import re,sys,glob
h=open("index.html",encoding="utf-8").read(); mal=[]
m=re.search(r'http-equiv="Content-Security-Policy" content="([^"]+)"',h)
if not m: mal.append("index.html sin CSP")
else:
    sc=next((d.split()[1:] for d in m.group(1).split(";") if d.strip().startswith("script-src")),[])
    for x in ("'unsafe-inline'","'unsafe-eval'","*","https:","data:","blob:"):
        if x in sc: mal.append("script-src permite "+x)
if re.search(r'<script(?![^>]*\bsrc=)[^>]*>',h): mal.append("index.html tiene un <script> inline")
for f in sorted(glob.glob("js/*.js")):
    if "dev-banco" in f: continue
    for i,l in enumerate(open(f,encoding="utf-8"),1):
        if re.search(r"""\son(?:click|error|load|change|input|submit|mouse\w+|key\w+|focus|blur)=\\?["']""",l): mal.append(f"{f}:{i} manejador inline en HTML (usa addEventListener)")
for x in mal: print("  ❌ "+x)
print("  ok: CSP estricta y sin manejadores inline" if not mal else "")
sys.exit(1 if mal else 0)
PY
# 7.9116 · los servidores atacados de verdad (URL rota, archivos ocultos, tokens, fuerza bruta) y el duelo en sala
# jugado entre dos copias del juego. Si falla cualquiera, no se sube.
echo "· servidores (servidor.js y server/index.js)"
if command -v node >/dev/null 2>&1; then node test/servidores.js || exit 1; else echo "  ⚠ sin node: no se prueban los servidores"; fi
echo "· duelos en sala"
bash test/duelo.sh || exit 1
# 7.9120 · 🥔 Modo papa: el juego juntado en un archivo es el mismo juego (doctor entero adentro) y el service worker lo sirve
echo "· modo papa"
bash test/papa.sh || exit 1
# 7.9125 · partida perdida: guardar no miente, las partidas se mudan a IndexedDB y "Continuar" abre la última (Playwright)
echo "· partidas guardadas (navegador de verdad)"
bash test/partidas.sh || exit 1
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
# 7.9118 · el editor genera .js y la prueba los valida con new Function: SOLO en esta copia se permite eval (y queda marcada)
s=s.replace("script-src 'self'","script-src 'self' 'unsafe-eval'",1).replace('<meta charset="utf-8">','<meta charset="utf-8">\n<meta name="futbolini-pruebas" content="1">',1)
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
