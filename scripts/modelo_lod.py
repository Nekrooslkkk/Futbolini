#!/usr/bin/env python3
"""FUTBOLINI · scripts/modelo_lod.py (7.9147) — la versión LIVIANA de los jugadores 3D, para verlos de lejos

Medido en un celular (7.9146): los 22 maniquíes eran 306.000 triángulos por cuadro, y 7 de cada 10 vértices del maniquí
son DEDOS que desde la cámara de transmisión miden menos de un pixel. Este script le agrega a un modelo ya armado
(img/modelos/jugador.glb o jugador_real.glb) una segunda malla, liviana, con su propio esqueleto sin dedos:
  - los vértices se juntan por celdas (2 a 4 cm) en la pose de reposo, sin mezclar zonas del uniforme, ni huesos
    distintos, ni lados de una costura de la textura, ni peinados;
  - los dedos pasan a moverse con la mano (35 huesos en vez de 65: menos cuentas por cuadro y textura de huesos más chica);
  - queda como meshes[1] + skins[1] del mismo .glb (y se rehace el .js en base64). El juego la usa cuando el jugador
    está lejos de la cámara y vuelve a la completa de cerca (penal, córner, repetición): js/modelo3d.js modelo3dLod.
No necesita los paquetes originales: trabaja sobre el .glb del repo, y se puede correr de nuevo (rehace la liviana).
Uso:  python3 scripts/modelo_lod.py img/modelos/jugador.glb [img/modelos/jugador_real.glb ...]
"""
import base64, json, math, os, re, struct, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from modelo_jugador import leer_glb, datos, COMP, NCOMP, DEDOS  # noqa: E402

CELDA = {"mano": 0.045, "cabeza": 0.024, "cuerpo": 0.03}
CELDA_UV = 1 / 20.0


def _agregar(binb, vistas, accs, valores, comp, tipo, minmax=False):
    fmt, sz = COMP[comp]; n = NCOMP[tipo]
    while len(binb) % 4: binb.append(0)
    off = len(binb)
    for v in valores: binb += struct.pack("<" + fmt * n, *v)
    vistas.append({"buffer": 0, "byteOffset": off, "byteLength": len(binb) - off})
    acc = {"bufferView": len(vistas) - 1, "componentType": comp, "count": len(valores), "type": tipo}
    if minmax:
        acc["min"] = [min(v[k] for v in valores) for k in range(n)]
        acc["max"] = [max(v[k] for v in valores) for k in range(n)]
    accs.append(acc)
    return len(accs) - 1


def liviana(j, b):
    """devuelve (atributos, índices, juntas, inversas) de la malla liviana a partir de meshes[0] / skins[0]"""
    pr = j["meshes"][0]["primitives"][0]; at = pr["attributes"]
    P = datos(j, b, at["POSITION"]); N = datos(j, b, at["NORMAL"]); J = datos(j, b, at["JOINTS_0"]); W = datos(j, b, at["WEIGHTS_0"])
    Z = datos(j, b, at["_KIT"]) if "_KIT" in at else [(0,)] * len(P)
    UV = datos(j, b, at["TEXCOORD_0"]) if "TEXCOORD_0" in at else None
    PE = datos(j, b, at["_PEINADO"]) if "_PEINADO" in at else None
    I = [i[0] for i in datos(j, b, pr["indices"])]
    piel = j["skins"][0]; juntas = piel["joints"]; nombres = [j["nodes"][k].get("name", "") for k in juntas]
    ibm = datos(j, b, piel["inverseBindMatrices"])
    dedo = [n.startswith(DEDOS) for n in nombres]
    queda = [k for k in range(len(juntas)) if not dedo[k]]
    nuevo = {k: i for i, k in enumerate(queda)}
    for k, n in enumerate(nombres):   # cada dedo pasa a la mano de su lado
        if dedo[k]: nuevo[k] = nuevo[nombres.index("hand_" + n[-1])]
    grupos, de = {}, []
    for v in range(len(P)):
        w = {}
        for q in range(4):
            if W[v][q] > 0: w[nuevo[J[v][q]]] = w.get(nuevo[J[v][q]], 0.0) + W[v][q]
        dom = max(w, key=w.get); nom = nombres[queda[dom]]
        c = CELDA["mano"] if nom.startswith("hand") else (CELDA["cabeza"] if nom in ("Head", "neck_01") else CELDA["cuerpo"])
        clave = (Z[v][0], PE[v][0] if PE else 0, dom, math.floor(P[v][0] / c), math.floor(P[v][1] / c), math.floor(P[v][2] / c),
                 (math.floor(UV[v][0] / CELDA_UV), math.floor(UV[v][1] / CELDA_UV)) if UV else 0)
        g = grupos.get(clave)
        if g is None: g = grupos[clave] = {"i": len(grupos), "n": 0, "p": [0.0] * 3, "nor": [0.0] * 3, "uv": [0.0] * 2, "w": {}}
        g["n"] += 1
        for k in range(3): g["p"][k] += P[v][k]; g["nor"][k] += N[v][k]
        if UV: g["uv"][0] += UV[v][0]; g["uv"][1] += UV[v][1]
        for k, x in w.items(): g["w"][k] = g["w"].get(k, 0.0) + x
        de.append(g["i"])
    orden = sorted(grupos.items(), key=lambda kv: kv[1]["i"])
    pos, nor, jts, pes, zon, uv, pei = [], [], [], [], [], [], []
    for clave, g in orden:
        n = g["n"]; pos.append(tuple(x / n for x in g["p"]))
        L = math.sqrt(sum(x * x for x in g["nor"])) or 1.0; nor.append(tuple(x / L for x in g["nor"]))
        top = sorted(g["w"].items(), key=lambda kv: -kv[1])[:4]; s = sum(x for _, x in top) or 1.0
        top += [(0, 0.0)] * (4 - len(top))
        jts.append(tuple(k for k, _ in top)); pes.append(tuple(x / s for _, x in top))
        zon.append((clave[0],)); pei.append((clave[1],)); uv.append((g["uv"][0] / n, g["uv"][1] / n))
    vistos, idx = set(), []
    for t in range(0, len(I), 3):
        a, c, d = de[I[t]], de[I[t + 1]], de[I[t + 2]]
        if a == c or c == d or a == d: continue
        k = tuple(sorted((a, c, d)))
        if k in vistos: continue
        vistos.add(k); idx += [(a,), (c,), (d,)]
    attrs = {"POSITION": (pos, 5126, "VEC3"), "NORMAL": (nor, 5126, "VEC3"), "JOINTS_0": (jts, 5121, "VEC4"),
             "WEIGHTS_0": (pes, 5126, "VEC4"), "_KIT": (zon, 5121, "SCALAR")}
    if UV: attrs["TEXCOORD_0"] = (uv, 5126, "VEC2")
    if PE: attrs["_PEINADO"] = (pei, 5121, "SCALAR")
    return attrs, idx, [juntas[k] for k in queda], [ibm[k] for k in queda], len(P), len(I) // 3


def agregar(ruta):
    j, b = leer_glb(ruta); b = bytearray(b)
    ex = j["asset"].setdefault("extras", {})
    marca = ex.get("futbolini_lod")
    if marca:   # ya tenía una liviana: se corta y se rehace desde la malla completa
        b = b[:marca["bin"]]; j["bufferViews"] = j["bufferViews"][:marca["vistas"]]; j["accessors"] = j["accessors"][:marca["accs"]]
        j["meshes"] = j["meshes"][:1]; j["skins"] = j["skins"][:1]
        j["nodes"] = [n for n in j["nodes"] if n.get("name") != "JugadorLOD"]
        for e in j["scenes"]: e["nodes"] = [k for k in e["nodes"] if k < len(j["nodes"])]
    marca = {"bin": len(b), "vistas": len(j["bufferViews"]), "accs": len(j["accessors"])}
    attrs, idx, juntas, inversas, v0, t0 = liviana(j, bytes(b))
    V, A = j["bufferViews"], j["accessors"]
    at = {k: _agregar(b, V, A, vals, comp, tipo, minmax=(k == "POSITION")) for k, (vals, comp, tipo) in attrs.items()}
    aI = _agregar(b, V, A, idx, 5123, "SCALAR"); aM = _agregar(b, V, A, inversas, 5126, "MAT4")
    j["meshes"].append({"name": "JugadorLOD", "primitives": [{"attributes": at, "indices": aI}]})
    j["skins"].append({"name": "ArmatureLOD", "joints": juntas, "inverseBindMatrices": aM})
    j["nodes"].append({"name": "JugadorLOD", "mesh": 1, "skin": 1}); j["scenes"][j.get("scene", 0)]["nodes"].append(len(j["nodes"]) - 1)
    nv = len(attrs["POSITION"][0]); nt = len(idx) // 3
    marca.update({"vertices": nv, "triangulos": nt, "huesos": len(juntas)}); ex["futbolini_lod"] = marca
    while len(b) % 4: b.append(0)
    j["buffers"][0]["byteLength"] = len(b)
    js = json.dumps(j, separators=(",", ":")).encode()
    while len(js) % 4: js += b" "
    total = 12 + 8 + len(js) + 8 + len(b)
    with open(ruta, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, total))
        f.write(struct.pack("<II", len(js), 0x4E4F534A)); f.write(js)
        f.write(struct.pack("<II", len(b), 0x004E4942)); f.write(bytes(b))
    # el mismo archivo en base64 dentro del .js (para file:// y sin internet): se cambia solo el texto entre comillas
    rjs = ruta[:-4] + ".js"
    if os.path.exists(rjs):
        s = open(rjs, encoding="utf-8").read()
        s2 = re.sub(r'(window\.MODELO3D\w*_GLB=")[^"]*(";)', lambda m: m.group(1) + base64.b64encode(open(ruta, "rb").read()).decode() + m.group(2), s)
        assert s2 != s or marca, "no encontré el modelo dentro de " + rjs
        open(rjs, "w", encoding="utf-8").write(s2)
    print("%s · liviana: %d → %d vértices · %d → %d triángulos (%d %%) · %d → %d huesos · %d bytes" %
          (ruta, v0, nv, t0, nt, round(100 * nt / t0), len(j["skins"][0]["joints"]), len(juntas), total))


if __name__ == "__main__":
    for r in sys.argv[1:]: agregar(r)
