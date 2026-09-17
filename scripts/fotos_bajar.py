#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fotos_bajar.py — baja TODAS las fotos de un manifiesto de una sola vez y
VALIDA que cada una sea una imagen de verdad (no una página de error, no un
HTML, no un archivo de 2 KB). Así no se sube "cualquier estupidez".

USO:
    python3 scripts/fotos_bajar.py [FOTOS.json]

MANIFIESTO (FOTOS.json) = lista de objetos:
    { "id":"CC", "tipo":"estadio", "nombre":"Estadio Monumental",
      "url":"https://.../archivo.jpg", "autor":"...", "lic":"CC BY-SA 4.0" }

  - `url` debe ser el ENLACE DIRECTO al archivo de imagen (no una búsqueda de
    Google, no una página). De donde sea (sitio oficial, prensa, Commons) mientras
    sea el archivo exacto y verificado.
  - `tipo` in {estadio, club, periodista} -> guarda en img/estadios|clubes|periodistas/<ID>.<ext>

Después corré `python3 scripts/fotos_contacto.py` y abrí img/_contacto.html para
revisar TODAS de un vistazo y borrar las que quedaron mal (solo esas se re-buscan).
"""
import sys, os, json, urllib.request, ssl

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLURAL = {"estadio": "estadios", "club": "clubes", "periodista": "periodistas"}
MIN_BYTES = 12000            # menos que esto casi seguro es un placeholder/error
UA = "FutboliniFotoBot/1.0 (descarga de fotos con licencia; contacto: futbolini)"

def url_valida(url):
    """Rechaza links que NO son un archivo directo (búsquedas, páginas, categorías).
    Devuelve (ok, motivo)."""
    u = (url or "").strip()
    low = u.lower()
    if not low.startswith("http"):
        return False, "no es http(s)"
    # Un archivo real termina en imagen (permitimos ?query después).
    base = low.split("?", 1)[0]
    if not base.endswith((".jpg", ".jpeg", ".png", ".webp", ".gif")):
        return False, "la URL no termina en un archivo de imagen (¿es una búsqueda/página?)"
    # Páginas/búsquedas típicas que traen basura: NO son el archivo.
    malos = ["/search", "special:", "/wiki/file:", "/wiki/category:", "google.", "bing.",
             "duckduckgo.", "/imgres", "tbn:", "gstatic.com/images"]
    for m in malos:
        if m in low:
            return False, "parece una búsqueda/página, no el archivo directo (%s)" % m
    # Wikimedia: el archivo vive en upload.wikimedia.org, NO en commons.wikimedia.org/wiki/
    if "commons.wikimedia.org/wiki/" in low:
        return False, "es la PÁGINA de Commons, no el archivo (usá el link de upload.wikimedia.org)"
    return True, ""

def magia(b):
    """Devuelve la extensión si los primeros bytes son una imagen real, si no None."""
    if b[:3] == b"\xff\xd8\xff": return "jpg"
    if b[:8] == b"\x89PNG\r\n\x1a\n": return "png"
    if b[:4] == b"RIFF" and b[8:12] == b"WEBP": return "webp"
    if b[:4] in (b"GIF8",): return "gif"
    return None

def _ctx():
    # Si hay un CA de proxy (entornos con proxy corporativo), lo usamos. En tu compu
    # normal no existe y se usan los CA del sistema, sin cambios.
    cafile = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")
    if not cafile:
        for p in ("/root/.ccr/ca-bundle.crt",):
            if os.path.exists(p): cafile = p; break
    try:
        return ssl.create_default_context(cafile=cafile) if cafile else ssl.create_default_context()
    except Exception:
        return ssl.create_default_context()

def bajar(url):
    ctx = _ctx()
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "image/*"})
    with urllib.request.urlopen(req, timeout=45, context=ctx) as r:
        ct = (r.headers.get("Content-Type") or "").lower()
        data = r.read()
    return data, ct

def parse_txt(path):
    """Formato copia-y-pega. Líneas '@estadio' / '@club' / '@periodista' cambian el tipo.
    Cada otra línea: 'ID  https://...archivo.jpg   # nombre opcional'. Se toma el primer
    token http como url. Líneas sin http (o con placeholder) se ignoran (aún sin llenar)."""
    items, tipo = [], "estadio"
    for raw in open(path, encoding="utf-8"):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("@"):
            t = line[1:].strip().lower().rstrip("s")   # @estadios -> estadio
            if t in PLURAL: tipo = t
            continue
        # separar el comentario (# nombre) del resto
        nombre = ""
        if "#" in line:
            line, nombre = line.split("#", 1); line = line.strip(); nombre = nombre.strip()
        toks = line.split()
        if not toks: continue
        cid = toks[0]
        url = next((t for t in toks[1:] if t.lower().startswith("http")), None)
        if not url:
            continue   # todavía sin link → se salta
        items.append({"id": cid, "tipo": tipo, "url": url, "nombre": nombre})
    return items

def main():
    man = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, "FOTOS.txt")
    if not os.path.exists(man):
        alt = os.path.join(RAIZ, "img", "FOTOS.txt")
        if os.path.exists(alt): man = alt
    if not os.path.exists(man):
        print("No encontré la lista:", man); print("Usá img/FOTOS.txt (pegá los links) o un FOTOS.json.")
        sys.exit(1)
    items = parse_txt(man) if man.lower().endswith(".txt") else json.load(open(man, encoding="utf-8"))
    if not items:
        print("La lista no tiene ningún link todavía. Pegá los links en", man); sys.exit(0)
    ok, mal, saltados, lineas = 0, 0, 0, []
    meta = {}
    for it in items:
        cid = it.get("id"); tipo = it.get("tipo"); url = it.get("url")
        plural = PLURAL.get(tipo)
        if it.get("sin_foto"):
            print("  · sin foto (a propósito), uso escudo:", cid); saltados += 1; continue
        if not (cid and plural and url):
            print("  ✗ entrada incompleta:", it); mal += 1; continue
        vok, motivo = url_valida(url)
        if not vok:
            print("  ✗ URL rechazada ("+motivo+"):", cid); mal += 1; continue
        dest_dir = os.path.join(RAIZ, "img", plural)
        os.makedirs(dest_dir, exist_ok=True)
        # ¿ya existe alguna extensión para ese id? -> saltar (no re-bajar)
        ya = [e for e in ("jpg","png","webp","gif") if os.path.exists(os.path.join(dest_dir, cid+"."+e))]
        if ya and not it.get("forzar"):
            print("  · ya existe, salto:", plural+"/"+cid+"."+ya[0]); saltados += 1; continue
        try:
            data, ct = bajar(url)
        except Exception as e:
            print("  ✗ error de red:", cid, "-", str(e)[:80]); mal += 1; continue
        ext = magia(data)
        if not ext:
            print("  ✗ NO es imagen (¿HTML/redirección?):", cid, "ct=", ct[:40]); mal += 1; continue
        if len(data) < MIN_BYTES:
            print("  ✗ demasiado chica ("+str(len(data))+" bytes), sospechosa:", cid); mal += 1; continue
        path = os.path.join(dest_dir, cid+"."+ext)
        open(path, "wb").write(data)
        print("  ✓ "+plural+"/"+cid+"."+ext+"  ("+str(len(data)//1024)+" KB)")
        meta[plural+"/"+cid+"."+ext] = {"nombre": it.get("nombre",""), "autor": it.get("autor",""), "lic": it.get("lic","")}
        ok += 1
        if tipo == "estadio":
            lineas.append('  %s:{src:"img/estadios/%s.%s",autor:%s,lic:%s},'
                          % (cid, cid, ext, json.dumps(it.get("autor","")), json.dumps(it.get("lic",""))))
    # sidecar para que la hoja de contacto muestre el NOMBRE al lado (verificás el sujeto)
    if meta:
        try: json.dump(meta, open(os.path.join(RAIZ, "img", "_fotos_meta.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        except Exception: pass
    print("\n==== %d bajadas · %d con problema · %d saltadas ====" % (ok, mal, saltados))
    if lineas:
        print("\nLíneas listas para data-estadios.js (FOTOS_EST):")
        print("\n".join(lineas))
    print("\nAhora: python3 scripts/fotos_contacto.py  → abrí img/_contacto.html y revisá.")

if __name__ == "__main__":
    main()
