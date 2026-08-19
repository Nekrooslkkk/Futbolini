# Prompts para Grok — contenido de datos de Futbolini

Cada prompt es autónomo (incluye el formato exacto del juego) para que la salida de Grok
pegue directo en los archivos `js/data-plantel.js` y `js/data-liga.js` sin reformatear.

Regla de oro que se repite en todos: **nada de nombres inventados como reales.** Si Grok no
está seguro de un nombre real, deja el hueco (el juego rellena con canteranos genéricos).

---

## PROMPT 1 · Planteles 2026 (los clubes que faltan)

```
Sos un investigador de fútbol chileno y vas a generar datos para un videojuego de gestión (Futbolini).
Necesito los planteles reales de la Liga de Primera 2026 de Chile, en un formato JS exacto para pegar.

FORMATO — un array por club; cada jugador es un array:
["Nombre Apellido","POS",edad,nivel,proy,sueldo,valor,[rasgos]]
- POS: uno de "ARQ","DEF","VOL","DEL".
- edad: entero (años).
- nivel: 28–92 (habilidad ACTUAL; crack ~85+, titular de medio pelo ~70, suplente ~60).
- proy: proyección/techo 28–95, siempre >= nivel; en jóvenes (<23) puede ser bastante mayor.
- sueldo: anual estimado en millones (titular de grande ~100–200, de club chico ~20–60).
- valor: de mercado en millones (crack joven ~400–900, titular ~150–300, suplente ~30–90).
- rasgos: 0–3 etiquetas cortas en español, descriptivas. Ej: "ídolo","joven","goleador",
  "juego aéreo","extranjero","capitán","proyección europea","velocidad","lateral ofensivo",
  "seguro bajo los tres palos","tiro libre","penales","desequilibrio","contención". Inventá las que sirvan.

REGLA DE HONESTIDAD (crítica): SOLO nombres REALES de jugadores documentados del club en 2026.
Si no estás seguro de un nombre, NO lo inventes: dejá el plantel más corto con los que sí conocés
(el juego rellena los huecos con canteranos genéricos). Nunca pongas un nombre inventado como real.

CLUBES 2026 (id → nombre):
CC Colo-Colo · UCH U. de Chile · UC U. Católica · EVE Everton · PAL Palestino · COQ Coquimbo Unido ·
AUD Audax Italiano · HUA Huachipato · OHI O'Higgins · NUB Ñublense · COB Cobresal · CAL Unión La Calera ·
LSE D. La Serena · DCO D. Concepción · UDC U. de Concepción · LIM D. Limache

Ya tengo CC, UCH, UC, PAL y LIM. Generá los que FALTAN: EVE, COQ, AUD, HUA, OHI, NUB, COB, CAL, LSE, DCO, UDC.
~16 a 20 jugadores por club, así:

const PLANTEL_EVE_2026=[
 ["Nombre Apellido","ARQ",30,74,74,90,120,["reflejos"]],
 ... 
];

Si no entra todo en un mensaje, seguí en el próximo. Al final dame el bloque para el mapa PLANTELES_REALES:
EVE:{2026:PLANTEL_EVE_2026}, COQ:{2026:PLANTEL_COQ_2026}, AUD:{2026:PLANTEL_AUD_2026}, ...
```

---

## PROMPT 2 · Planteles 1991 (Campeonato Nacional)

```
Mismo videojuego (Futbolini), ahora la temporada 1991 del fútbol chileno (Campeonato Nacional, 16 equipos).
Necesito los planteles reales de esa temporada en este formato JS exacto:

["Nombre Apellido","POS",edad,nivel,proy,sueldo,valor,[rasgos]]
(POS: "ARQ"/"DEF"/"VOL"/"DEL"; nivel 28–92; proy>=nivel; sueldo/valor en millones de la época,
más chicos que hoy: titular de grande ~40–70 de sueldo, ~150–400 de valor; rasgos 0–3 descriptivos.)

REGLA DE HONESTIDAD (crítica): SOLO nombres reales y documentados del plantel 1991 de cada club.
Si dudás de un nombre, dejalo afuera. Nunca inventes un nombre como si fuera real. La temporada 1991
es histórica (Colo-Colo campeón de la Copa Libertadores), así que priorizá exactitud.

CLUBES 1991 (id → nombre): CC Colo-Colo (YA HECHO, saltá) · COQ Coquimbo Unido · UC U. Católica ·
OHI O'Higgins · FV Fernández Vial · COB Cobreloa · DCO D. Concepción · ANT D. Antofagasta ·
PAL Palestino · LSE D. La Serena · CBS Cobresal · UES Unión Española · EVE Everton ·
UCH U. de Chile · OSO P. Osorno · SW Santiago Wanderers

Generá los que puedas, priorizando UC, COB, UES, UCH y los que peleaban arriba. Formato:
const PLANTEL_UC_1991=[ ... ];
Y al final el bloque para PLANTELES_REALES: UC:{1991:PLANTEL_UC_1991, ...(lo que ya tenga)}, ...
```

---

## PROMPT 3 · Calendarios y resultados reales

```
Mismo videojuego (Futbolini). Necesito el FIXTURE oficial de un club para una temporada, con resultados
reales donde existan, en este formato JS exacto (una entrada por fecha):

const LIGA_PAL_2026=[
 {fecha:1,  f:{m:2,d:1},  rival:"CC",  local:false, real:"1-3"},
 {fecha:2,  f:{m:2,d:8},  rival:"EVE", local:true,  real:null},
 ...
];
- fecha: número de jornada.
- f: {m: mes, d: día} de ese partido.
- rival: el ID del rival (CC, UCH, UC, EVE, PAL, COQ, AUD, HUA, OHI, NUB, COB, CAL, LSE, DCO, UDC, LIM).
- local: true si el club juega de local, false si visita.
- real: el marcador HISTÓRICO desde la perspectiva de ESTE club, como "GF-GC" (ej. "2-1" = ganó 2 a 1).

REGLA DE RESULTADOS (importante): "real" NO es obligatorio siempre. Poné el marcador SOLO si lo sabés
con certeza; si no, poné real:null (el juego lo simula). Preferí null antes que inventar un resultado.
Así la historia tiene sentido donde importa, sin forzar datos falsos.

Generame los fixtures 2026 de: PAL (Palestino) y LIM (D. Limache) — que son jugables y hoy usan un
calendario prestado. Si podés, sumá EVE y COQ. Un const por club. Ordená por fecha real de calendario.
```

---

## PROMPT 4 · Sorprendeme — contenido que sumaría un estudio grande

```
Sos diseñador de un juego de gestión de fútbol chileno (Futbolini), con humor y cariño, que quiere
competir con los grandes (Football Manager) y superar a los indies aburridos. El motor ya tiene:
planteles reales, decisiones con consecuencias, finanzas + bolsa de valores del club, vida personal del DT,
redes sociales, y objetivos de temporada.

Tirame ideas CONCRETAS y accionables (no genéricas) para subir el nivel, en estas líneas:
1. RASGOS de jugador nuevos con efecto jugable claro (nombre + qué hace en un partido/temporada).
2. PLANTELES HISTÓRICOS memorables del fútbol chileno que valga la pena agregar (club + año + por qué,
   con 3–5 nombres emblemáticos de ese plantel; respetando que sean reales).
3. EVENTOS de temporada con sabor local (situaciones reales del fútbol chileno: barras, dirigentes,
   prensa, ANFP) — dame 8–10 con un título y qué decisión plantean.
4. Una mecánica que hoy NO tenga y que marque diferencia contra los juegos grandes.

Priorizá lo específico de Chile y lo que dé identidad. Nada de nombres inventados como reales.
```

---

### Cómo pegar lo que devuelva Grok
- **Planteles** → `js/data-plantel.js`: pegá los `const PLANTEL_XXX_ANIO=[...]` y sumá la clave al objeto
  `PLANTELES_REALES` (abajo del archivo).
- **Fixtures** → `js/data-liga.js`: pegá el `const LIGA_XXX_ANIO=[...]` y sumá la clave a `FIXTURES_OFICIALES`
  (ojo: si referencia otra constante, declararla antes o asignar después, por la zona muerta de `const`).
- Siempre probar en el navegador con puerto nuevo antes de dar por bueno.
