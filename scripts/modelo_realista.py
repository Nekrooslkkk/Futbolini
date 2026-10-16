#!/usr/bin/env python3
"""FUTBOLINI · scripts/modelo_realista.py (7.9139) — el jugador REALISTA (cara, pelo, cuerpo con piel de verdad)

Pedido del autor: "las caras TIENEN QUE SER MODELOS realistas libres tipo PES 2006". Arma img/modelos/jugador_real.glb
(y su copia en base64 img/modelos/jugador_real.js, para file:// y sin internet) con el paquete GRATIS de Quaternius
"Universal Base Characters [Standard]" (quaternius.com · License_Standard.txt: CC0 1.0, dominio público):
  - el cuerpo "Superhero_Male" (textura pintada a mano con cara, ojos y piel), los ojos y las cejas;
  - tres peinados del mismo paquete (rapado, partido al lado, barba) metidos en LA MISMA malla: cada jugador muestra el
    suyo (el shader esconde los otros), así sigue siendo UN dibujo por jugador;
  - las ZONAS del uniforme (_KIT) como en el maniquí (0 piel, 1 camiseta, 2 short, 3 medias, 4 botines, 5 pelo,
    6 manos, 7 ojos): el juego pinta la camiseta del club encima del cuerpo y deja la piel con su textura;
  - UNA textura (atlas JPEG 2048x1024, dentro del .glb): piel+cara a la izquierda, el detalle del pelo a la derecha y los
    ojos en una esquina libre;
  - las ANIMACIONES del maniquí (img/modelos/jugador.glb, paquetes UAL1 y UAL2, CC0) REDIRIGIDAS a este esqueleto: tiene
    los mismos 65 huesos con los mismos nombres pero otra pose de reposo y otras medidas, así que se copia la orientación
    de cada hueso EN EL MUNDO (no el número crudo) y la cadera se escala por el largo de la pierna.

Necesita Pillow (solo para armar el atlas; el juego no usa Python). Los archivos bajados son datos no confiables: este
script solo los LEE (json, binario, imágenes) y no ejecuta nada de ellos.
Uso:  python3 scripts/modelo_realista.py "<carpeta Base Characters>" "<carpeta peinados Rigged to Head Bone/glTF>" \\
          img/modelos/jugador.glb img/modelos/jugador_real.glb
"""
import base64, io, json, math, os, struct, sys
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from modelo_jugador import leer_glb, datos, Escritor, PIEL, CAMISETA, SHORT, MEDIAS, BOTINES, PELO, MANOS  # noqa: E402

OJOS = 7
PEINADOS = [("", None), ("rapado", "Hair_Buzzed"), ("partido", "Hair_SimpleParted"), ("barba", "Hair_Beard")]
ATLAS = (2048, 1024)
REG_CUERPO = (0, 0, 1024, 1024)       # x, y, ancho, alto en el atlas (y desde arriba: el glTF no da vuelta la textura)
REG_PELO = (1024, 0, 1024, 1024)
REG_OJOS = (1792, 0, 128, 128)        # dos copias lado a lado (los ojos usan u de 0,12 a 1,22: dan la vuelta)
PELO_LIBRE = (0.74, 0.0, 1.0, 0.26)   # esquina del pelo que no usa ningún peinado (ahí van los ojos)


def leer_gltf(ruta):
    j = json.load(open(ruta, encoding="utf-8"))
    b = open(os.path.join(os.path.dirname(ruta), j["buffers"][0]["uri"]), "rb").read()
    return j, b


# ---------- cuaterniones [x, y, z, w] ----------
def qmul(a, b):
    ax, ay, az, aw = a; bx, by, bz, bw = b
    return (aw * bx + ax * bw + ay * bz - az * by, aw * by - ax * bz + ay * bw + az * bx,
            aw * bz + ax * by - ay * bx + az * bw, aw * bw - ax * bx - ay * by - az * bz)


def qinv(a):
    return (-a[0], -a[1], -a[2], a[3])


def qnorm(a):
    n = math.sqrt(sum(x * x for x in a)) or 1.0
    return tuple(x / n for x in a)


def qslerp(a, b, t):
    d = sum(x * y for x, y in zip(a, b))
    if d < 0: b = tuple(-x for x in b); d = -d
    if d > 0.9995: return qnorm(tuple(x + (y - x) * t for x, y in zip(a, b)))
    th = math.acos(d); s = math.sin(th)
    return tuple((math.sin((1 - t) * th) * x + math.sin(t * th) * y) / s for x, y in zip(a, b))


def qrot(q, v):
    p = qmul(qmul(q, (v[0], v[1], v[2], 0.0)), qinv(q))
    return p[:3]


class Esqueleto:
    """los nodos de un glTF por nombre, con su padre y su pose de reposo (rotación y posición en el mundo)"""
    def __init__(self, j):
        self.nodos = j["nodes"]; self.nombre = [n.get("name", "n%d" % i) for i, n in enumerate(self.nodos)]
        self.padre = {}
        for i, n in enumerate(self.nodos):
            for c in n.get("children", []): self.padre[c] = i
        self.idx = {n: i for i, n in enumerate(self.nombre)}
        self.orden = []
        for r in j["scenes"][j.get("scene", 0)]["nodes"]: self._bajar(r)
        self.rotR = {i: tuple(n.get("rotation", (0, 0, 0, 1))) for i, n in enumerate(self.nodos)}
        self.posR = {i: tuple(n.get("translation", (0, 0, 0))) for i, n in enumerate(self.nodos)}
        self.mundoRot, self.mundoPos = self.mundo(self.rotR)

    def _bajar(self, i):
        self.orden.append(i)
        for c in self.nodos[i].get("children", []): self._bajar(c)

    def mundo(self, rot):
        """rotación y posición de cada nodo en el mundo (sin escalas: estos esqueletos no las usan en reposo)"""
        W, P = {}, {}
        for i in self.orden:
            p = self.padre.get(i)
            if p is None: W[i] = rot[i]; P[i] = self.posR[i]
            else:
                W[i] = qmul(W[p], rot[i]); t = qrot(W[p], self.posR[i]); P[i] = tuple(a + b for a, b in zip(P[p], t))
        return W, P


def muestrear(j, b, an):
    """las pistas de una animación: {nodo: {"rotation": (tiempos, valores), "translation": ...}} y todos los tiempos"""
    pistas, tiempos = {}, set()
    for ch in an["channels"]:
        sm = an["samplers"][ch["sampler"]]
        t = [x[0] for x in datos(j, b, sm["input"])]; v = datos(j, b, sm["output"])
        pistas.setdefault(ch["target"]["node"], {})[ch["target"]["path"]] = (t, v)
        tiempos.update(round(x, 5) for x in t)
    return pistas, sorted(tiempos)


def valor(tv, t, rot):
    ts, vs = tv
    if t <= ts[0]: return tuple(vs[0])
    if t >= ts[-1]: return tuple(vs[-1])
    for k in range(len(ts) - 1):
        if ts[k] <= t <= ts[k + 1]:
            u = (t - ts[k]) / max(1e-9, ts[k + 1] - ts[k])
            return qslerp(vs[k], vs[k + 1], u) if rot else tuple(a + (c - a) * u for a, c in zip(vs[k], vs[k + 1]))
    return tuple(vs[-1])


def redirigir(jA, bA, A, B, escala):
    """cada animación del maniquí (A) en el esqueleto realista (B): misma orientación de cada hueso en el mundo"""
    salida = []
    for an in jA.get("animations", []):
        pistas, tiempos = muestrear(jA, bA, an)
        porB = {}   # nodo B -> {"rotation": [...], "translation": [...]}
        for t in tiempos:
            rotA = dict(A.rotR)
            for n, p in pistas.items():
                if "rotation" in p: rotA[n] = qnorm(valor(p["rotation"], t, True))
            WA, _ = A.mundo(rotA)
            WB = {}
            for i in B.orden:
                nom = B.nombre[i]; ia = A.idx.get(nom)
                if ia is None or ia not in WA: WB[i] = qmul(WB[B.padre[i]], B.rotR[i]) if i in B.padre else B.rotR[i]
                else: WB[i] = qmul(qmul(WA[ia], qinv(A.mundoRot[ia])), B.mundoRot[i])
            for n, p in pistas.items():
                ib = B.idx.get(A.nombre[n])
                if ib is None: continue
                d = porB.setdefault(ib, {})
                if "rotation" in p:
                    pa = B.padre.get(ib)
                    q = qmul(qinv(WB[pa]), WB[ib]) if pa is not None else WB[ib]
                    prev = d.get("rotation", [])
                    if prev and sum(x * y for x, y in zip(prev[-1], q)) < 0: q = tuple(-x for x in q)   # sin saltos de signo
                    d.setdefault("rotation", []).append(qnorm(q))
                if "translation" in p:
                    d.setdefault("translation", []).append(tuple(x * escala for x in valor(p["translation"], t, False)))
        salida.append((an["name"], tiempos, porB))
    return salida


def zona_cuerpo(nombre, v, J):
    """zona del uniforme por el hueso que más mueve al vértice y por dónde cae a lo largo de ese hueso (pose de reposo)"""
    def a_lo_largo(a, b):
        pa, pb = J[a], J[b]; d = [y - x for x, y in zip(pa, pb)]; L = sum(x * x for x in d) or 1.0
        return sum((vv - x) * dd for vv, x, dd in zip(v, pa, d)) / L
    if nombre in ("Head",) or nombre.startswith("neck"): return PIEL
    if nombre.startswith(("spine", "clavicle")): return CAMISETA
    lado = nombre[-1]
    if nombre.startswith("upperarm"): return CAMISETA if a_lo_largo("upperarm_" + lado, "lowerarm_" + lado) < 0.52 else PIEL
    if nombre.startswith("lowerarm"): return MANOS if a_lo_largo("lowerarm_" + lado, "hand_" + lado) > 0.86 else PIEL
    if nombre.startswith(("hand", "index", "middle", "pinky", "ring", "thumb")): return MANOS
    if nombre == "pelvis": return SHORT
    if nombre.startswith("thigh"): return SHORT if a_lo_largo("thigh_" + lado, "calf_" + lado) < 0.56 else PIEL
    if nombre.startswith("calf"): return MEDIAS if a_lo_largo("calf_" + lado, "foot_" + lado) > 0.24 else PIEL
    if nombre.startswith(("foot", "ball")): return BOTINES
    return CAMISETA


def mat4inv_pos(m):
    """posición del hueso en reposo a partir de su matriz inversa de enlace (columna mayor, rígida)"""
    R = [[m[0], m[4], m[8]], [m[1], m[5], m[9]], [m[2], m[6], m[10]]]; t = (m[12], m[13], m[14])
    return tuple(-(R[0][k] * t[0] + R[1][k] * t[1] + R[2][k] * t[2]) for k in range(3))


def main(dir_base, dir_pelo, glb_maniqui, destino):
    jB, bB = leer_gltf(os.path.join(dir_base, "Superhero_Male_FullBody.gltf"))
    jA, bA = leer_glb(glb_maniqui)
    A, B = Esqueleto(jA), Esqueleto(jB)
    piel = jB["skins"][0]; juntas = piel["joints"]; nomJ = [B.nombre[k] for k in juntas]
    ibm = datos(jB, bB, piel["inverseBindMatrices"])
    J = {nomJ[k]: mat4inv_pos(ibm[k]) for k in range(len(juntas))}
    # la pierna del realista es más larga: la cadera de las animaciones (y la zancada) se escalan por la altura de la cadera
    escala = B.mundoPos[B.idx["pelvis"]][1] / A.mundoPos[A.idx["pelvis"]][1]
    # los bordes del uniforme en línea recta (el sombreador los corta por la posición de reposo: sin serrucho de triángulos)
    cortes = {"hombro": round(J["upperarm_l"][0], 3),
              "manga": round(J["upperarm_l"][0] + 0.5 * (J["lowerarm_l"][0] - J["upperarm_l"][0]), 3),
              "cuello": round(J["neck_01"][1] - 0.035, 3), "cuelloZ": round(J["neck_01"][2], 3), "cintura": round(J["pelvis"][1] + 0.05, 3),
              "short": round(J["thigh_l"][1] - 0.56 * (J["thigh_l"][1] - J["calf_l"][1]), 3),
              "media": round(J["calf_l"][1] - 0.24 * (J["calf_l"][1] - J["foot_l"][1]), 3)}

    # ---- las piezas de la malla ----
    piezas = []   # (j, b, primitiva, zona fija o None, peinado, región uv)
    for m in jB["meshes"]:
        pr = m["primitives"][0]; mat = jB["materials"][pr["material"]]["name"]
        if mat == "MI_Superhero_Male": piezas.append((jB, bB, pr, None, 0, "cuerpo"))
        elif mat == "MI_Eyes": piezas.append((jB, bB, pr, OJOS, 0, "ojos"))
        elif mat == "MI_Hair_1": piezas.append((jB, bB, pr, PELO, 0, "pelo"))   # las cejas
    for k, (nom, arch) in enumerate(PEINADOS):
        if not arch: continue
        jh, bh = leer_gltf(os.path.join(dir_pelo, arch + ".gltf"))
        nh = [jh["nodes"][q]["name"] for q in jh["skins"][0]["joints"]]
        ih = datos(jh, bh, jh["skins"][0]["inverseBindMatrices"])
        prh = jh["meshes"][0]["primitives"][0]
        usados = {jt[q] for jt, w in zip(datos(jh, bh, prh["attributes"]["JOINTS_0"]), datos(jh, bh, prh["attributes"]["WEIGHTS_0"]))
                  for q in range(4) if w[q] > 0}
        for q in usados:   # el pelo tiene que estar enlazado igual que el cuerpo en los huesos que lo mueven (la cabeza)
            assert max(abs(x - y) for x, y in zip(ih[q], ibm[nomJ.index(nh[q])])) < 1e-3, "el peinado %s no calza en %s" % (arch, nh[q])
        piezas.append((jh, bh, prh, PELO, k, "pelo"))

    pos, nor, uv, jts, pes, zon, pei, idx, refPiel = [], [], [], [], [], [], [], [], []
    for (j, b, pr, zfija, peinado, reg) in piezas:
        at = pr["attributes"]; nombresJ = [j["nodes"][q]["name"] for q in j["skins"][0]["joints"]]
        P = datos(j, b, at["POSITION"]); N = datos(j, b, at["NORMAL"]); T = datos(j, b, at["TEXCOORD_0"])
        Jt = datos(j, b, at["JOINTS_0"]); W = datos(j, b, at["WEIGHTS_0"]); I = datos(j, b, pr["indices"])
        base = len(pos)
        for k in range(len(P)):
            jj = tuple(nomJ.index(nombresJ[q]) for q in Jt[k])
            w = W[k]; dom = max(range(4), key=lambda q: w[q])
            z = zfija if zfija is not None else zona_cuerpo(nomJ[jj[dom]], P[k], J)
            u, v = T[k]
            if reg == "cuerpo":
                x0, y0, ww, hh = REG_CUERPO; U = (x0 + u * ww) / ATLAS[0]; V = (y0 + v * hh) / ATLAS[1]
                if z == PIEL: refPiel.append((u, v))
            elif reg == "pelo":
                assert not (u > PELO_LIBRE[0] and v < PELO_LIBRE[3]), "un peinado usa la esquina de los ojos"
                x0, y0, ww, hh = REG_PELO; U = (x0 + u * ww) / ATLAS[0]; V = (y0 + v * hh) / ATLAS[1]
            else:
                assert -0.001 <= u <= 2.0, "los ojos se salen de las dos copias"
                x0, y0, ww, hh = REG_OJOS; U = (x0 + u * ww) / ATLAS[0]; V = (y0 + (v % 1.0) * hh) / ATLAS[1]
            pos.append(P[k]); nor.append(N[k]); uv.append((U, V)); jts.append(jj); pes.append(w)
            zon.append((z,)); pei.append((peinado,))
        idx += [(i[0] + base,) for i in I]

    # ---- el atlas ----
    tex = os.path.join(dir_base, "..", "Textures")
    cuerpo = Image.open(os.path.join(tex, "T_Superhero_Male_Ligh.png")).convert("RGB")
    pelo = Image.open(os.path.join(dir_base, "T_Hair_1_BaseColor.png")).convert("RGB")
    ojo = Image.open(os.path.join(dir_base, "T_Eye_Brown.png")).convert("RGB")
    atlas = Image.new("RGB", ATLAS, (128, 128, 128))
    atlas.paste(cuerpo.resize(REG_CUERPO[2:], Image.LANCZOS), REG_CUERPO[:2])
    atlas.paste(pelo.resize(REG_PELO[2:], Image.LANCZOS), REG_PELO[:2])
    o = ojo.resize((REG_OJOS[2], REG_OJOS[3]), Image.LANCZOS)
    atlas.paste(o, REG_OJOS[:2]); atlas.paste(o, (REG_OJOS[0] + REG_OJOS[2], REG_OJOS[1]))
    jpg = io.BytesIO(); atlas.save(jpg, "JPEG", quality=84, optimize=True, progressive=False); jpg = jpg.getvalue()
    # color de referencia de la piel (promedio de la textura donde es piel): el juego la tiñe al tono de cada jugador
    px = cuerpo.load(); W0, H0 = cuerpo.size; suma = [0, 0, 0]; n = 0
    for (u, v) in refPiel[::7]:
        c = px[min(W0 - 1, int(u * W0)), min(H0 - 1, int(v * H0))]; suma = [s + x for s, x in zip(suma, c)]; n += 1
    ref = "#%02x%02x%02x" % tuple(int(s / max(1, n)) for s in suma)
    chico = pelo.resize((64, 64)).convert("L")
    lumPelo = sum(chico.getpixel((x, y)) for x in range(64) for y in range(64)) / (64 * 64 * 255)

    # ---- el archivo ----
    E = Escritor()
    aPos = E.agregar(pos, 5126, "VEC3", minmax=True)
    aNor = E.agregar(nor, 5126, "VEC3")
    aUv = E.agregar(uv, 5126, "VEC2")
    aJts = E.agregar(jts, 5121, "VEC4")
    aPes = E.agregar(pes, 5126, "VEC4")
    aZon = E.agregar(zon, 5121, "SCALAR")
    aPei = E.agregar(pei, 5121, "SCALAR")
    aIdx = E.agregar(idx, 5123 if len(pos) < 65535 else 5125, "SCALAR")
    aIbm = E.agregar(ibm, 5126, "MAT4")
    while len(E.bin) % 4: E.bin.append(0)
    offImg = len(E.bin); E.bin += jpg
    E.vistas.append({"buffer": 0, "byteOffset": offImg, "byteLength": len(jpg)}); vImg = len(E.vistas) - 1

    anims = []
    for nombre, tiempos, porB in redirigir(jA, bA, A, B, escala):
        ai = E.agregar([(t,) for t in tiempos], 5126, "SCALAR", minmax=True)
        muestras, canales = [], []
        for nodo, d in sorted(porB.items()):
            for camino, vals in d.items():
                ao = E.agregar(vals, 5126, "VEC4" if camino == "rotation" else "VEC3")
                muestras.append({"input": ai, "output": ao, "interpolation": "LINEAR"})
                canales.append({"sampler": len(muestras) - 1, "target": {"node": nodo, "path": camino}})
        anims.append({"name": nombre, "samplers": muestras, "channels": canales})

    # los nodos: el esqueleto del realista y UN nodo de malla (se sacan las tres mallas sueltas del paquete)
    sacar = {i for i, n in enumerate(jB["nodes"]) if "mesh" in n}
    nuevo = {}; nodos = []
    for i, n in enumerate(jB["nodes"]):
        if i in sacar: continue
        nuevo[i] = len(nodos); nodos.append(dict(n))
    for n in nodos:
        if "children" in n: n["children"] = [nuevo[c] for c in n["children"] if c in nuevo]
        if not n.get("children"): n.pop("children", None)
    nodos.append({"name": "Jugador", "mesh": 0, "skin": 0}); iMalla = len(nodos) - 1
    escena = [nuevo[k] for k in jB["scenes"][jB.get("scene", 0)]["nodes"] if k in nuevo] + [iMalla]
    for a in anims:
        for c in a["channels"]: c["target"]["node"] = nuevo[c["target"]["node"]]

    salida = {
        "asset": {"version": "2.0", "generator": "Futbolini scripts/modelo_realista.py",
                  "copyright": "Universal Base Characters [Standard] + Universal Animation Library 1 y 2 by Quaternius - CC0 1.0 (dominio público)",
                  "extras": {"futbolini": {"pielRef": ref, "escala": round(escala, 4), "lumPelo": round(lumPelo, 4), "cortes": cortes,
                                           "peinados": [p[0] for p in PEINADOS], "zonas": "0 piel,1 camiseta,2 short,3 medias,4 botines,5 pelo,6 manos,7 ojos"}}},
        "scene": 0, "scenes": [{"name": "Scene", "nodes": escena}], "nodes": nodos,
        "meshes": [{"name": "JugadorReal", "primitives": [{"attributes": {"POSITION": aPos, "NORMAL": aNor, "TEXCOORD_0": aUv,
                     "JOINTS_0": aJts, "WEIGHTS_0": aPes, "_KIT": aZon, "_PEINADO": aPei}, "indices": aIdx}]}],
        "skins": [{"name": piel.get("name", "Armature"), "joints": [nuevo[k] for k in juntas], "inverseBindMatrices": aIbm}],
        "images": [{"bufferView": vImg, "mimeType": "image/jpeg", "name": "atlas"}],
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
        f.write('"use strict";\n/* FUTBOLINI · %s — generado por scripts/modelo_realista.py: el jugador realista de img/modelos/jugador_real.glb\n'
                '   en base64 (para cargar con file:// o sin internet). Universal Base Characters + Universal Animation Library 1 y 2\n'
                '   by Quaternius · CC0 1.0 (dominio público). */\n'
                'window.MODELO3D_REAL_GLB="%s";\n' % (js_dest, base64.b64encode(gl).decode()))
    cuenta = [0] * 8
    for z in zon: cuenta[z[0]] += 1
    print(destino, total, "bytes · atlas", len(jpg), "bytes ·", len(pos), "vértices ·", len(idx) // 3, "triángulos ·",
          len(anims), "animaciones · escala", round(escala, 3), "· piel ref", ref, "· zonas", cuenta)


if __name__ == "__main__":
    main(*sys.argv[1:5])
