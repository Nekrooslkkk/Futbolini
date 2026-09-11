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

def main():
    man = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, "FOTOS.json")
    if not os.path.exists(man):
        print("No encontré el manifiesto:", man); print("Creá FOTOS.json (ver FOTOS.example.json).")
        sys.exit(1)
    items = json.load(open(man, encoding="utf-8"))
    ok, mal, saltados, lineas = 0, 0, 0, []
    for it in items:
        cid = it.get("id"); tipo = it.get("tipo"); url = it.get("url")
        plural = PLURAL.get(tipo)
        if not (cid and plural and url):
            print("  ✗ entrada incompleta:", it); mal += 1; continue
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
        ok += 1
        if tipo == "estadio":
            lineas.append('  %s:{src:"img/estadios/%s.%s",autor:%s,lic:%s},'
                          % (cid, cid, ext, json.dumps(it.get("autor","")), json.dumps(it.get("lic",""))))
    print("\n==== %d bajadas · %d con problema · %d saltadas ====" % (ok, mal, saltados))
    if lineas:
        print("\nLíneas listas para data-estadios.js (FOTOS_EST):")
        print("\n".join(lineas))
    print("\nAhora: python3 scripts/fotos_contacto.py  → abrí img/_contacto.html y revisá.")

if __name__ == "__main__":
    main()
