#!/usr/bin/env python3
"""FUTBOLINI · scripts/modelo_jugador.py (7.9130)

Arma img/modelos/jugador.glb a partir del paquete CC0 "Universal Animation Library [Standard]" de Quaternius
(https://quaternius.com/packs/universalanimationlibrary.html · licencia CC0 1.0, dominio público).

Qué hace (para que el juego lo cargue rápido y sin depender de nada):
  - junta las dos partes del maniquí (cuerpo + articulaciones) en UNA malla (un solo dibujo por jugador);
  - saca lo que el juego no usa (coordenadas de textura, escalas animadas, dedos animados);
  - deja solo las animaciones útiles para el fútbol (quieto, caminar, trotar, piquear, golpe en el pecho, agachado);
  - marca cada vértice con la ZONA DEL UNIFORME (_KIT): 0 piel, 1 camiseta, 2 short, 3 medias, 4 botines, 5 pelo,
    6 manos (guantes del arquero), según el hueso que más lo mueve y su altura en la pose de reposo. El juego pinta cada
    zona con los colores del club.

Uso:  python3 scripts/modelo_jugador.py "ruta/UAL1_Standard.glb" img/modelos/jugador.glb
Escribe también img/modelos/jugador.js (el mismo archivo en base64 dentro de un .js): así el juego lo carga aunque se
abra con file:// (sin servidor) o sin internet, donde el navegador no deja leer el .glb con fetch.
"""
import base64, json, struct, sys

ANIMS = ["Idle_Loop", "Walk_Loop", "Jog_Fwd_Loop", "Sprint_Loop", "Hit_Chest", "Crouch_Idle_Loop"]
DEDOS = ("index_", "middle_", "pinky_", "ring_", "thumb_")
PIEL, CAMISETA, SHORT, MEDIAS, BOTINES, PELO, MANOS = 0, 1, 2, 3, 4, 5, 6


def leer_glb(ruta):
    f = open(ruta, "rb").read()
    magic, ver, largo = struct.unpack("<III", f[:12])
    assert magic == 0x46546C67 and ver == 2, "no es un GLB 2.0"
    cl, ct = struct.unpack("<II", f[12:20])
    j = json.loads(f[20:20 + cl])
    bl, bt = struct.unpack("<II", f[20 + cl:28 + cl])
    return j, f[28 + cl:28 + cl + bl]


COMP = {5126: ("f", 4), 5123: ("H", 2), 5121: ("B", 1), 5125: ("I", 4)}
NCOMP = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT4": 16}


def datos(j, b, ai):
    a = j["accessors"][ai]
    v = j["bufferViews"][a["bufferView"]]
    fmt, sz = COMP[a["componentType"]]
    n = NCOMP[a["type"]]
    stride = v.get("byteStride", n * sz)
    off = v.get("byteOffset", 0) + a.get("byteOffset", 0)
    return [struct.unpack_from("<" + fmt * n, b, off + i * stride) for i in range(a["count"])]


class Escritor:
    """arma el buffer binario nuevo con sus bufferViews y accessors"""
    def __init__(self):
        self.bin = bytearray(); self.vistas = []; self.accs = []

    def agregar(self, valores, comp, tipo, minmax=False, normalizado=False):
        fmt, sz = COMP[comp]
        n = NCOMP[tipo]
        while len(self.bin) % 4: self.bin.append(0)
        off = len(self.bin)
        for v in valores:
            self.bin += struct.pack("<" + fmt * n, *v)
        self.vistas.append({"buffer": 0, "byteOffset": off, "byteLength": len(self.bin) - off})
        acc = {"bufferView": len(self.vistas) - 1, "componentType": comp, "count": len(valores), "type": tipo}
        if normalizado: acc["normalized"] = True
        if minmax:
            acc["min"] = [min(v[k] for v in valores) for k in range(n)]
            acc["max"] = [max(v[k] for v in valores) for k in range(n)]
        self.accs.append(acc)
        return len(self.accs) - 1


def zona(nombre, x, y, z):
    """la zona del uniforme según el hueso dominante y la posición en la pose de reposo (T, mirando a +Z, en metros)"""
    if nombre in ("Head",):
        if y > 1.70 or (y > 1.60 and z < -0.03): return PELO
        return PIEL
    if nombre.startswith("neck"): return PIEL
    if nombre.startswith("spine") or nombre.startswith("clavicle"): return CAMISETA
    if nombre.startswith("upperarm"): return CAMISETA if abs(x) < 0.34 else PIEL      # manga corta
    if nombre.startswith("hand") or nombre.startswith(DEDOS): return MANOS
    if nombre.startswith("lowerarm"): return MANOS if abs(x) > 0.68 else PIEL      # la muñeca va con el guante
    if nombre == "pelvis": return SHORT if y > 0.66 else PIEL
    if nombre.startswith("thigh"): return SHORT if y > 0.64 else PIEL                 # el short llega a medio muslo
    if nombre.startswith("calf"): return MEDIAS if y < 0.47 else PIEL                  # la media hasta abajo de la rodilla
    if nombre.startswith(("foot", "ball")): return BOTINES
    return CAMISETA if y > 0.95 else SHORT


def main(origen, destino):
    j, b = leer_glb(origen)
    nodos = j["nodes"]
    nombres = [n.get("name", "") for n in nodos]
    piel = j["skins"][0]
    juntas = piel["joints"]

    # ---- malla: las dos partes en una, sin coordenadas de textura, con la zona del uniforme ----
    pos, nor, jts, pes, zon, idx = [], [], [], [], [], []
    for prim in j["meshes"][0]["primitives"]:
        a = prim["attributes"]
        P = datos(j, b, a["POSITION"]); N = datos(j, b, a["NORMAL"])
        J = datos(j, b, a["JOINTS_0"]); W = datos(j, b, a["WEIGHTS_0"])
        I = datos(j, b, prim["indices"])
        base = len(pos)
        for k in range(len(P)):
            w = W[k]; dom = max(range(4), key=lambda q: w[q])
            hueso = nombres[juntas[J[k][dom]]]
            pos.append(P[k]); nor.append(N[k]); jts.append(J[k]); pes.append(w)
            zon.append((zona(hueso, *P[k]),))
        idx += [(i[0] + base,) for i in I]

    E = Escritor()
    aPos = E.agregar(pos, 5126, "VEC3", minmax=True)
    aNor = E.agregar(nor, 5126, "VEC3")
    aJts = E.agregar(jts, 5121, "VEC4")
    aPes = E.agregar(pes, 5126, "VEC4")
    aZon = E.agregar(zon, 5121, "SCALAR")
    aIdx = E.agregar(idx, 5123 if len(pos) < 65535 else 5125, "SCALAR")
    aIbm = E.agregar(datos(j, b, piel["inverseBindMatrices"]), 5126, "MAT4")

    # ---- animaciones: solo las útiles; sin dedos ni escalas; posición solo en la cadera ----
    anims = []
    for an in j["animations"]:
        if an["name"] not in ANIMS: continue
        muestras, canales = [], []
        for ch in an["channels"]:
            nn = nombres[ch["target"]["node"]]; camino = ch["target"]["path"]
            if nn.startswith(DEDOS) or camino == "scale": continue
            if camino == "translation" and nn not in ("pelvis", "root"): continue
            sm = an["samplers"][ch["sampler"]]
            t = datos(j, b, sm["input"]); v = datos(j, b, sm["output"])
            ai = E.agregar(t, 5126, "SCALAR", minmax=True)
            ao = E.agregar(v, 5126, "VEC4" if camino == "rotation" else "VEC3")
            muestras.append({"input": ai, "output": ao, "interpolation": sm.get("interpolation", "LINEAR")})
            canales.append({"sampler": len(muestras) - 1, "target": {"node": ch["target"]["node"], "path": camino}})
        anims.append({"name": an["name"], "samplers": muestras, "channels": canales})

    salida = {
        "asset": {"version": "2.0", "generator": "Futbolini scripts/modelo_jugador.py",
                  "copyright": "Universal Animation Library by Quaternius - CC0 1.0 (dominio público)"},
        "scene": 0, "scenes": j["scenes"], "nodes": nodos,
        "meshes": [{"name": "Jugador", "primitives": [{"attributes": {"POSITION": aPos, "NORMAL": aNor, "JOINTS_0": aJts,
                     "WEIGHTS_0": aPes, "_KIT": aZon}, "indices": aIdx}]}],
        "skins": [{"name": piel.get("name", "Armature"), "joints": juntas, "inverseBindMatrices": aIbm}],
        "animations": anims,
        "buffers": [{"byteLength": len(E.bin)}], "bufferViews": E.vistas, "accessors": E.accs,
    }
    js = json.dumps(salida, separators=(",", ":")).encode()
    while len(js) % 4: js += b" "
    binb = bytes(E.bin)
    while len(binb) % 4: binb += b"\0"
    total = 12 + 8 + len(js) + 8 + len(binb)
    with open(destino, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, total))
        f.write(struct.pack("<II", len(js), 0x4E4F534A)); f.write(js)
        f.write(struct.pack("<II", len(binb), 0x004E4942)); f.write(binb)
    gl = open(destino, "rb").read()
    js_dest = destino[:-4] + ".js"
    with open(js_dest, "w", encoding="utf-8") as f:
        f.write('"use strict";\n/* FUTBOLINI · %s — generado por scripts/modelo_jugador.py: el maniquí de img/modelos/jugador.glb en base64\n'
                '   (para cargar con file:// o sin internet). Universal Animation Library by Quaternius · CC0 1.0 (dominio público). */\n'
                'window.MODELO3D_GLB="%s";\n' % (js_dest, base64.b64encode(gl).decode()))
    cuenta = [0] * 7
    for z in zon: cuenta[z[0]] += 1
    print(destino, total, "bytes ·", len(pos), "vértices ·", len(idx) // 3, "triángulos ·", len(anims), "animaciones ·",
          "zonas piel/camiseta/short/medias/botines/pelo/manos =", cuenta)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
