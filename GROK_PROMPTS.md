# GROK — BATERÍA DE PROMPTS (pegar de a uno)

> Cada bloque es **un prompt independiente**: copiá el que quieras y pegáselo a Grok.
> Todos comparten las mismas **reglas** (repetilas si hace falta). Claude integra el
> código; Grok trae datos verificados; el usuario aprueba.

## Reglas comunes (van en todos)
- **Integridad:** nombres reales, stats **estimadas** con aviso de "aproximado". **Nunca**
  inventes un club/jugador/cita/título/fecha como real. Si no está documentado, lo dejás fuera.
- **Respeto:** diversidad sí, burla no. Nada discriminatorio.
- **Formato idéntico al molde** (`js/data-segunda2026.js`, `js/liga-registrar.js`, `REGLAS.md`).
- Español. `id` = 3 letras únicas. `fuerza` = 40–90.
- Si dudás de un dato, marcá **"sin verificar"** en vez de afirmarlo.

---

## PROMPT 1 — Planteles reales 2026 (grandes primero)
> Armá los planteles REALES 2026 de **Colo-Colo, Universidad de Chile y Universidad Católica**
> para Futbolini, en formato `PLANTEL_<ID>_2026`:
> `["Nombre Apellido","ARQ|DEF|VOL|DEL",edad,niv(40-90),proy(40-95),sueldo,valor,["rasgos"]]`.
> Solo jugadores documentados en el plantel 2026 (Transfermarkt/prensa). Estimá niv/proy/valor.
> Rasgos posibles: "capitán","ídolo","joven","goleador","killer","muralla","crack","cantera".
> Entregá un bloque por club. Si un jugador no lo tenés confirmado, no lo pongas.

## PROMPT 2 — Planteles reales 2026 (resto de Primera)
> Igual que el anterior, pero para el **resto de la Primera División 2026** (los 13 clubes que
> faltan). Prioridad: los titulares y figuras. Formato `PLANTEL_<ID>_2026`. Documentados nomás.

## PROMPT 3 — Liga Argentina 2026 (para registrarLiga)
> Armá la **Liga Profesional Argentina 2026**: array `LIGA_ARG_2026` con TODOS los clubes
> (`id` 3 letras únicas que no choquen con los chilenos, `n`, `c`, `ciudad`, `est`, `aforo`,
> `fuerza` 40–90). Además, resumí el **formato real 2026**: cuántos equipos, zonas/playoffs,
> cómo se define el campeón, **descensos (tabla anual + promedios)** y cupos a Libertadores/
> Sudamericana — claro para implementar. Opcional: planteles de River/Boca en `PLANTEL_<ID>_2026`.

## PROMPT 4 — Épocas históricas de clubes (para data-historia.js)
> Dame **épocas doradas reales** de estos clubes chilenos, con hechos documentados
> (campeonatos con año, goleador, DT, racha, dato de color), en 3–5 líneas cada una:
> **Palestino, Cobreloa, Unión Española, Everton, Deportes Limache, Magallanes, Santiago Wanderers,
> Deportes Iquique**. Formato: `{club, anios:[desde,hasta], titulo, hechos:[...], texto}`.
> Solo hechos verificables; lo que no puedas confirmar, lo marcás.

## PROMPT 5 — Cuerpos técnicos (DT) reales 2026
> Lista de **DT reales 2026** por club de Primera y Primera B chilena (nombre del entrenador
> actual). Formato `{ id:"CC", dt:"Nombre Apellido" }`. Si un club cambió de DT hace poco,
> poné el vigente y marcá la fecha. No inventes; si no sabés, "sin verificar".

## PROMPT 6 — Estadios y aforos (verificación)
> Revisá y corregí **estadios, ciudades y aforos** de los clubes chilenos ya cargados
> (te paso el listado). Reportá SOLO lo que esté mal, con el dato correcto y fuente. Formato:
> `[FIX] ID — campo: valor_actual → valor_correcto (fuente)`. Ojo con estadios compartidos/mudanzas.

## PROMPT 7 — Copa de la Liga / Supercopa (formato real)
> Explicá el **formato real** de la **Supercopa de Chile** y de cualquier "Copa de la Liga"
> chilena vigente 2026: quiénes la juegan, a cuántos partidos, cuándo, y qué otorga (cupo/
> título). Resumilo para implementarlo como torneo aparte. Marcá lo que cambie por temporada.

## PROMPT 8 — Pool de tuits 2026 (contexto GOL / DERROTA)
> Generá **120 tuits** cortos y creíbles de hinchas/prensa chilena 2026 para dos contextos:
> `gol` (60) y `derrota` (60). Formato `{ ctx, quien:"@handle", txt, registro }`. Placeholders:
> `{GOLEADOR}`,`{DT}`,`{CLUB}`,`{RIVAL}`. **Dos registros:** `neutro` (limpio) y `cl` (chilensis
> real, sin voseo argentino: "po","cachái","-ai/-ís"; puede ser crudo pero **sin burla a grupos**).

## PROMPT 9 — Pool de tuits 2026 (mercado / dirigencia / arbitraje)
> Igual que el 8 pero para contextos `fichaje`, `crisis_dirigencia`, `arbitraje_var`, `clasico`
> (40 de cada uno). Mismo formato y dos registros (neutro + chilensis).

## PROMPT 10 — Citas de dirigentes y prensa (personas del Plop!)
> Dame **30 "personas" del Plop!**: periodistas, cuentas de hinchas, dirigentes ficticios pero
> creíbles (NO uses nombres de personas reales para las opiniones inventadas). Formato
> `{ handle:"@...", tipo:"prensa|hincha|dirigente|troll|dato", voz:"descripción del tono" }`.
> El tono guía cómo escriben; el texto que digan es ficción declarada.

## PROMPT 11 — Chilenización de textos existentes (QA de tono)
> Te paso textos del juego (decisiones/avisos). Reescribilos en **chilensis real** SOLO donde
> suene forzado o tenga **voseo argentino** ("manejás/tenés/gastás" → "manejai/tení/gastai" o
> neutro). No cambies el sentido ni los datos. Devolvé pares `clave → texto_cl`.

## PROMPT 12 — Caza de inconsistencias de datos (QA duro)
> Revisá los `js/data-*.js` (te los paso) y listá, priorizado (crítico→menor): **ids duplicados**,
> **fuerzas incoherentes** (grande con fuerza de chico), **zonas Norte/Sur mal puestas** en
> Segunda, **nombres mal escritos**, **hechos históricos dudosos**. Por hallazgo:
> `[NIVEL] archivo — problema → fix (fuente)`.

---

### División de trabajo
**Grok:** datos + pools + QA de datos. **Claude:** código/UI/integración. **Usuario:** aprueba y da voz.
