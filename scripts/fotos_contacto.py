#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fotos_contacto.py — arma una HOJA DE CONTACTO (img/_contacto.html) con TODAS las
fotos bajadas, para revisarlas de un vistazo y cazar las que quedaron mal (una
foto equivocada salta a la vista). Borrás las malas y re-corrés fotos_bajar.py
solo con esas.

USO:  python3 scripts/fotos_contacto.py
      (abrí img/_contacto.html en el navegador)
"""
import os, html, json

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(RAIZ, "img")
META = {}
try:
    META = json.load(open(os.path.join(IMG, "_fotos_meta.json"), encoding="utf-8"))
except Exception:
    META = {}
CARPETAS = ["estadios", "clubes", "periodistas"]
EXTS = (".jpg", ".jpeg", ".png", ".webp", ".gif")

def main():
    partes = ["<!doctype html><meta charset=utf-8><title>Hoja de contacto · fotos</title>",
              "<style>body{font-family:system-ui;background:#111;color:#eee;margin:0;padding:16px}"
              "h2{margin:18px 0 8px}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}"
              ".c{background:#1c1c1c;border:1px solid #333;border-radius:8px;overflow:hidden}"
              ".c img{width:100%;height:120px;object-fit:cover;display:block;background:#000}"
              ".c .n{font-size:12px;padding:5px 7px;color:#bbb;word-break:break-all}"
              "</style>",
              "<h1>Hoja de contacto — revisá y borrá las que estén mal</h1>"]
    total = 0
    for carp in CARPETAS:
        d = os.path.join(IMG, carp)
        if not os.path.isdir(d): continue
        files = sorted(f for f in os.listdir(d) if f.lower().endswith(EXTS))
        if not files: continue
        partes.append("<h2>%s (%d)</h2><div class=g>" % (carp, len(files)))
        for f in files:
            rel = carp + "/" + f
            m = META.get(rel, {})
            etq = f + (("  ·  " + m["nombre"]) if m.get("nombre") else "")
            partes.append('<div class=c><img loading=lazy src="%s"><div class=n>%s</div></div>'
                          % (html.escape(rel), html.escape(etq)))
        partes.append("</div>")
        total += len(files)
    out = os.path.join(IMG, "_contacto.html")
    open(out, "w", encoding="utf-8").write("\n".join(partes))
    print("Hoja de contacto con %d fotos → %s" % (total, out))
    print("Abrila en el navegador (o: python3 -m http.server y andá a /img/_contacto.html).")

if __name__ == "__main__":
    main()
