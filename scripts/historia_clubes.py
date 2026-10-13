#!/usr/bin/env python3
"""FUTBOLINI · scripts/historia_clubes.py (7.9133) — la historia de un club con DeepSeek, SOLO desde hechos con fuente.

Pedido del autor (13 oct 2026): "armar la historia de los clubes... de Deportes Rengo ni idea, la idea es al menos aprender;
que sus capítulos no sean siempre los mismos". El flujo:
  1. Un humano o una IA junta los HECHOS con su fuente en scripts/historia/<ID>.json (ver REN.json).
  2. Este script le pide a DeepSeek que redacte, usando SOLO esos hechos: hitos para la línea de historia y arcos (capítulos
     con decisiones) en el formato de ARCOS_EQUIPO (js/data-storylines.js).
  3. La salida queda en scripts/historia/<ID>.borrador.json para REVISAR A MANO antes de pasarla a js/data-historia-clubes.js.
     Nada entra al juego sin revisión (integridad: nada inventado como real).

La clave NUNCA va al repo: se lee de la variable de entorno DEEPSEEK_API_KEY.
Uso:  DEEPSEEK_API_KEY=... python3 scripts/historia_clubes.py REN [modelo]
"""
import json, os, sys, urllib.request

API = "https://api.deepseek.com/chat/completions"
GRUPOS = ["directorio", "socios", "hinchada", "camarin", "tecnico", "prensa", "anfp", "sponsors", "comunidad"]

SISTEMA = """Eres guionista de FUTBOLINI, un simulador de conducción de clubes del fútbol chileno. El juego es REALISTA Y CRUDO:
trata de la mierda en la que te puedes convertir manejando poder y de lo que eso le hace a tu vida. El humor solo aparece
porque el fútbol chileno es así; si dudas entre un chiste y una verdad incómoda, va la verdad incómoda. Escribes en español
de Chile, trato de tú, frases cortas, sin garabatos gratuitos.

REGLAS DE INTEGRIDAD (no se negocian):
- Solo puedes afirmar como REAL lo que está en la lista de HECHOS. No agregues años, cifras, nombres, títulos ni lugares
  que no estén ahí. Si no sabes algo, no lo pongas.
- Las personas reales de los hechos solo aparecen como hechos ("el penal que atajó Lecaros en 2022"). NUNCA les inventes
  frases, opiniones ni conductas.
- Los dilemas de los capítulos son FICCIÓN del presente del juego (el jugador dirige el club hoy), anclados en un hecho real
  que el jugador aprende leyendo el contexto.
Responde SOLO con JSON válido, sin texto fuera del JSON."""

PEDIDO = """CLUB: {nombre} (id {id}). HECHOS (con su fuente; son lo ÚNICO real que puedes afirmar):
{hechos}

Escribe un JSON con esta forma exacta:
{{
 "hitos": [ {{"anio": 1984, "hito": "2 a 4 palabras", "txt": "1 o 2 frases, máx 200 caracteres, solo con los hechos"}} ],
 "arcos": [
  {{"id": "{pre}_a1", "t": "título corto", "desc": "una frase", "capitulos": [
    {{"id": "{pre}_a1_1", "t": "título corto", "ctx": "2 o 3 frases (máx 330 caracteres): parte de un hecho real con su año y plantea el dilema de HOY",
     "ops": [
       {{"t": "lo que decides (máx 45 caracteres)", "d": "consecuencia corta (máx 90)", "ef": {{"plata": 0, "moral": 0, "prestigio": 0}},
        "grupos": {{"hinchada": 0}}, "mem": "recuerdo en 2.ª persona y pasado, minúscula: 'le cerraste la puerta a ...'", "va": "{pre}_a1_2"}}
     ]}}
  ]}}
 ]
}}
Requisitos:
- 8 a 10 hitos, en orden de año, todos distintos, cubriendo toda la historia de los hechos (origen, auge, caída, regreso,
  títulos, ascenso, hoy). Nada de hitos sin año.
- 2 arcos de 3 capítulos cada uno; cada capítulo con 2 o 3 opciones; las opciones de los capítulos 1 y 2 llevan "va" al
  siguiente capítulo del mismo arco; las del capítulo 3 llevan "cierra": true en vez de "va".
- Ningún capítulo repite el dilema de otro. Prohibido el dilema genérico de "subir o bajar el precio de las entradas".
- Cada opción tiene costo y beneficio (nunca una opción gratis): "grupos" usa SOLO estas claves {grupos} con valores
  entre -16 y 16; "ef" usa solo plata (-80 a 80, en millones), moral (-8 a 8), prestigio (-8 a 8) y capital (-6 a 6).
- Los textos del juego le hablan al jugador de tú. Nada de comillas que atribuyan frases a personas reales."""


def hechos_txt(d):
    return "\n".join("- " + h["txt"] + "  [" + h.get("fuente", d.get("fuente", "")) + "]" for h in d["hechos"])


def pedir(d, modelo):
    clave = os.environ.get("DEEPSEEK_API_KEY")
    if not clave:
        sys.exit("Falta DEEPSEEK_API_KEY en el entorno (nunca la escribas en el repo).")
    cuerpo = {"model": modelo, "temperature": 0.8, "response_format": {"type": "json_object"},
              "messages": [{"role": "system", "content": SISTEMA},
                           {"role": "user", "content": PEDIDO.format(nombre=d["nombre"], id=d["id"], pre=d["id"].lower() + "_h",
                                                                     hechos=hechos_txt(d), grupos=", ".join(GRUPOS))}]}
    req = urllib.request.Request(API, data=json.dumps(cuerpo).encode(), method="POST",
                                 headers={"Authorization": "Bearer " + clave, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        res = json.loads(r.read().decode())
    txt = res["choices"][0]["message"]["content"]
    return json.loads(txt), res.get("usage", {})


def revisar(out):
    """chequeos mecánicos (el contenido lo revisa un humano/IA después)"""
    mal = []
    hitos = out.get("hitos", [])
    if not 6 <= len(hitos) <= 12: mal.append("hay %d hitos" % len(hitos))
    for h in hitos:
        if not isinstance(h.get("anio"), int) or not 1850 <= h["anio"] <= 2026: mal.append("hito sin año válido: %r" % h)
        if len(h.get("txt", "")) > 230: mal.append("hito largo: %s" % h.get("hito"))
    for a in out.get("arcos", []):
        caps = a.get("capitulos", [])
        ids = {c.get("id") for c in caps}
        if len(caps) != 3: mal.append("%s tiene %d capítulos" % (a.get("id"), len(caps)))
        for i, c in enumerate(caps):
            if not 2 <= len(c.get("ops", [])) <= 3: mal.append("%s: %d opciones" % (c.get("id"), len(c.get("ops", []))))
            for o in c.get("ops", []):
                for g, v in (o.get("grupos") or {}).items():
                    if g not in GRUPOS or abs(v) > 16: mal.append("%s: grupo %s=%s" % (c.get("id"), g, v))
                ult = i == len(caps) - 1
                if ult and not o.get("cierra"): mal.append("%s: la última no cierra" % c.get("id"))
                if not ult and o.get("va") not in ids: mal.append("%s: va a %r" % (c.get("id"), o.get("va")))
    return mal


if __name__ == "__main__":
    cid = sys.argv[1]
    modelo = sys.argv[2] if len(sys.argv) > 2 else "deepseek-v4-pro"
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "historia")
    d = json.load(open(os.path.join(base, cid + ".json"), encoding="utf-8"))
    out, uso = pedir(d, modelo)
    dest = os.path.join(base, cid + ".borrador.json")
    json.dump(out, open(dest, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(dest, "· tokens", uso)
    for m in revisar(out): print("  ⚠", m)
