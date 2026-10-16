#!/usr/bin/env python3
"""FUTBOLINI · scripts/plop_banco.py (7.9137) — el banco de respuestas de PLOP!, redactado con DeepSeek y revisado a mano.

Pedido del autor (16 oct 2026): "Plop sigue sin entender mucho lo que publicas, puse algo serio y respuestas nada que ver…
usa DeepSeek para generar el banco". La clave de DeepSeek NO puede ir dentro del juego (el repo es público): por eso las
respuestas se generan ACÁ, una vez, por TEMA y por TIPO de cuenta, se revisan y quedan en js/data-plop-banco.js. En el
juego, plopTema() reconoce el tema de lo que publicas y la gente contesta desde ese cajón (sin internet).

Todas las cuentas son ficticias. Nada de nombres reales, partidos políticos ni garabatos gratuitos; en los temas serios
(luto, violencia, causas sociales) no hay trolls ni burlas.
La clave se lee de la variable de entorno DEEPSEEK_API_KEY (nunca en el repo).
Uso:  DEEPSEEK_API_KEY=... python3 scripts/plop_banco.py [modelo]
"""
import json, os, re, sys, urllib.request

API = "https://api.deepseek.com/chat/completions"
TIPOS = ["hincha", "critico", "prensa", "troll", "rival", "jugador"]
SERIOS = {"luto", "violencia", "social", "lesion"}
TEMAS = {
    "luto": "el club o el DT lamenta la muerte de alguien (ex jugador, hincha, funcionario): condolencias, respeto",
    "derrota": "después de una derrota: el DT pide calma, asume, promete levantarse",
    "triunfo": "celebra un triunfo, un golazo o una buena racha",
    "arbitro": "reclama por el arbitraje, el VAR o un penal no cobrado",
    "refuerzo": "anuncia o celebra un refuerzo/fichaje que llega",
    "despedida": "se despide un jugador o un funcionario; agradecimientos",
    "hinchada": "agradece el aliento de la hinchada, la galería, los que viajan",
    "entradas": "invita a llenar el estadio, habla de entradas o precios",
    "directiva": "habla de la directiva, la plata del club, la sociedad anónima, los dueños",
    "disculpas": "pide disculpas o reconoce un error propio",
    "promesa": "promete ganar, pelear el título o subir",
    "clasico": "habla del clásico o del rival de siempre",
    "lesion": "informa la lesión de un jugador o le desea pronta recuperación",
    "cantera": "habla de los juveniles, la cantera, los cabros que suben",
    "violencia": "condena la violencia en los estadios o incidentes",
    "social": "una causa social seria: una tragedia, una colecta, salud mental, inclusión, fútbol femenino",
    "pregunta": "le hace una pregunta a la gente (qué opinan, qué once ponen)",
    "humor": "un chiste o un comentario liviano del DT o del club",
    "trabajo": "el día a día: entrenamiento, concentración, preparación del partido",
}

SISTEMA = """Eres guionista de FUTBOLINI, un simulador de clubes del fútbol chileno, realista y crudo. Escribes las respuestas
que gente FICTICIA deja en PLOP!, una red social estilo Twitter de 2007-2009 dentro del juego. Español de Chile informal,
como se escribe en redes: frases cortas, a veces sin mayúscula ni tilde, algún emoji ocasional, chilenismos con medida
(cabros, la wea con mesura, po, cachai, al tiro), nada de garabatos fuertes, nada de insultos a grupos de personas.
REGLAS: cero nombres de personas, clubes o marcas reales (usa {CLUB} para el club del jugador y {RIVAL} para el rival);
cero partidos políticos; nada de discriminación. Cada respuesta tiene SENTIDO con el tema del post (eso es lo más
importante: si el post es serio, la gente responde en serio). Máximo 110 caracteres cada una. Responde SOLO JSON."""

PEDIDO = """Para cada TEMA, escribe respuestas a un post del club o de su DT sobre ese tema, separadas por tipo de cuenta:
- "hincha": hinchas fieles (12 respuestas distintas)
- "critico": hinchas propios críticos, exigentes pero del club (6)
- "prensa": periodistas o cuentas de datos, tono informativo (6)
- "troll": cuentas que buscan pelea o se burlan (4) — VACÍO [] si el tema es serio
- "rival": hinchas del rival (4) — VACÍO [] si el tema es serio
- "jugador": un jugador del plantel responde (4)
Temas serios (sin troll ni rival, todos respetuosos): {serios}.
TEMAS:
{temas}
Forma exacta: {{"<tema>": {{"hincha": [...], "critico": [...], "prensa": [...], "troll": [...], "rival": [...], "jugador": [...]}}, ...}}"""


def pedir(temas, modelo):
    clave = os.environ.get("DEEPSEEK_API_KEY")
    if not clave:
        sys.exit("Falta DEEPSEEK_API_KEY en el entorno (nunca la escribas en el repo).")
    lista = "\n".join("- " + t + ": " + TEMAS[t] for t in temas)
    cuerpo = {"model": modelo, "temperature": 0.9, "response_format": {"type": "json_object"},
              "messages": [{"role": "system", "content": SISTEMA},
                           {"role": "user", "content": PEDIDO.format(temas=lista, serios=", ".join(sorted(SERIOS)))}]}
    req = urllib.request.Request(API, data=json.dumps(cuerpo).encode(), method="POST",
                                 headers={"Authorization": "Bearer " + clave, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        res = json.loads(r.read().decode())
    return json.loads(res["choices"][0]["message"]["content"]), res.get("usage", {})


MALAS = re.compile(r"\b(colo.?colo|universidad|católica|wanderers|everton|cobreloa|huachipato|o.?higgins|audax|palestino|"
                   r"conchetumare|weón culiao|culiao|maric|fleto|negro de mierda|piñera|boric|kast|bachelet)\b", re.I)


def revisar(banco):
    """filtro mecánico: largo, nombres reales, trolls en temas serios, repetidas"""
    mal, vistas = [], set()
    for tema, por in banco.items():
        if tema not in TEMAS: mal.append("tema desconocido " + tema); continue
        for tipo in TIPOS:
            xs = por.get(tipo, [])
            if tema in SERIOS and tipo in ("troll", "rival") and xs: mal.append("%s/%s: troll en tema serio" % (tema, tipo)); por[tipo] = []
            limpias = []
            for x in xs:
                x = str(x).strip()
                k = x.lower()
                if len(x) > 125 or len(x) < 3: mal.append("%s/%s largo: %s" % (tema, tipo, x)); continue
                if MALAS.search(x): mal.append("%s/%s nombre real o garabato: %s" % (tema, tipo, x)); continue
                if k in vistas: continue
                vistas.add(k); limpias.append(x)
            por[tipo] = limpias
    return mal


if __name__ == "__main__":
    modelo = sys.argv[1] if len(sys.argv) > 1 else "deepseek-v4-pro"
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plop")
    os.makedirs(base, exist_ok=True)
    banco, usos = {}, []
    temas = list(TEMAS)
    for i in range(0, len(temas), 4):
        out, uso = pedir(temas[i:i + 4], modelo)
        banco.update({k: v for k, v in out.items() if k in TEMAS})
        usos.append(uso)
        print("lote", i // 4 + 1, "·", ", ".join(temas[i:i + 4]), "· tokens", uso.get("total_tokens"))
    mal = revisar(banco)
    json.dump(banco, open(os.path.join(base, "banco.borrador.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("temas:", len(banco), "· respuestas:", sum(len(x) for p in banco.values() for x in p.values()),
          "· tokens:", sum(u.get("total_tokens", 0) for u in usos))
    for m in mal: print("  ⚠", m)
