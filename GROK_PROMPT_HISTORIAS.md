# GROK_PROMPT_HISTORIAS.md — Historias, contenido y escudos para Futbolini

Para pegarle a **Grok**. Futbolini es 100% offline: Grok genera **código/datos** que se pegan en
`js/data-*.js`. Este archivo se enfoca en **HISTORIAS** (súper modo histórico, arcos, historia real) y en
los **escudos**. Grok ya ejecutó `GROK_PROMPT_BETA.md` con éxito (Primera B, Copa Chile, relato, prensa),
así que **conoce el flujo**: crear un `js/data-XX.js`, mergear en las constantes existentes, cargarlo en
`index.html`, sin duplicar ids.

## CÓMO INTEGRAR (leé esto primero, Grok)
1. **Creá UN archivo nuevo** por tanda (ej. `js/data-historico.js`) y cargalo en `index.html` **después** de
   los datos base y **antes** de `js/ui.js`.
2. **No redeclares** constantes existentes: mergeá con `Object.assign(EPOCAS_CLUB_ADD, {...})`, `ARR.push(...)`,
   o un `if(typeof X!=="undefined")`. Constantes que YA existen (no las pises, extendelas):
   `EPOCAS_CLUB` / `EPOCAS_CLUB_ADD` (épocas de gloria), `ARCOS_EQUIPO` / `ARCOS_NUEVOS` (storylines),
   `HISTORIA_BETA` (historia real por club/época), `RELATO_BETA`, `FRASES_CUERPO`, `PREGUNTAS_BETA`,
   `TUITS_MOMENTO` / `TUITS_BETA`, `PLANTELES_REALES`, `ESTADIOS_DATA`, `PERIODISTAS_POR_ERA`.
3. **Envolvé** (wrap) funciones si hace falta, con un guard `_flag` para no doblar (como ya hiciste con
   `construirCalendario`).
4. Probá mentalmente que **no rompa** una carrera nueva (ids válidos, sin nulls).

## REGLAS DURAS (no romper nunca)
- Español chileno/neutro (**tú**), sin lenguaje inclusivo.
- Nombres reales OK, **stats estimadas**, **NUNCA citas inventadas** a personas reales (el que declara es el DT del jugador).
- Historia **verificada, hechos públicos, sin sesgo político**. Si dudás, omití.
- Sin copyright (nada de letras ni escudos oficiales calcados).

---

## TANDA A · SÚPER MODO HISTÓRICO (lo más grande)
Objetivo del juego: poder **arrancar la carrera de un club en distintas épocas de su historia**, desde su
fundación hasta hoy, y en el futuro (escenarios generados). Para CADA club (los 16 de Primera + los 16 de la
B), dame su **línea de tiempo real por eras** y las **épocas jugables**.

### A.1) Épocas jugables (formato `EPOCAS_CLUB_ADD`, se mergea solo)
```js
CLUBID:[
 { anio:1975, etq:"1975 · La primera estrella", desc:"1-2 frases del contexto real (qué se logró, idea de juego).",
   squad:"PLANTEL_CLUBID_1975", ind:{plantel:78,moral:70,hinchada:76,socios:55,cantera:60,estadio:40,prestigio:72,riesgo:26},
   caja:{plata:300,deuda:400}, dt:"Nombre Real DT" },
 ...
]
```
- Elegí 2-4 hitos reales por club (fundación temprana si tiene sentido, época dorada, una crisis célebre, el presente).
- Si el plantel de esa época no existe aún, generalo (formato de siempre, 18-24 nombres reales, stats estimadas).
- `baseEra`: años ≥2010 juegan en la liga 2026; <2010 en la de 1991 (ya está en el motor).

### A.2) Timeline real por club (para la vista Historia y "ser consecuente")
Extendé `HISTORIA_BETA`. Por cada club, 4-8 hitos con **año + hecho real + el problema/tema de esa era**:
```js
CLUBID:[
 { anio:1966, hito:"Fundación", txt:"Cómo y por qué nació el club (barrio, gente, contexto real)." },
 { anio:1975, hito:"Primer título", txt:"..." },
 { anio:2002, hito:"Crisis", txt:"El problema real de esa época (quiebra, descenso, dirigencia, estadio…)." },
 { anio:2026, hito:"Hoy", txt:"El tema actual del club." }
]
```

### A.3) Escenarios FUTUROS (2030 → 2226) — generativos, no inventados como hechos
El súper histórico llega hasta 2226. No inventes "títulos futuros" como si hubieran pasado: dame **semillas
de escenarios** plausibles por década/era, que el juego dispara al azar cuando la carrera llega ahí. Con
sabor chileno y modernizaciones de época (tecnología, clima, economía). Formato:
```js
// era: "cercano" (2030-2050) | "medio" (2050-2120) | "lejano" (2120-2226)
{ era:"cercano", t:"VAR con IA", txt:"El arbitraje ahora lo asiste una IA; la hinchada desconfía.", ef:{riesgo:3} },
{ era:"lejano", t:"Estadio orbital", txt:"La final se juega en la estación orbital de la CONMEBOL.", grupos:{sponsors:8} }
```
Dame ~10 por era. Absurdo-plausible, respetando el tono del juego.

---

## TANDA B · STORYLINES PROFUNDOS (arcos con alma)
Extendé `ARCOS_EQUIPO` (formato documentado arriba de `js/data-storylines.js`). Cada club merece un arco de
**3 capítulos** con SU conflicto identitario real (el estadio de la U ya existe; hacé los que falten o
profundizá). Que las decisiones dejen huella en la memoria (`mem` en 2ª persona) y muevan grupos/plata/rep.
```js
CLUBID:[{ id:"clubid_tema", t:"Título corto", desc:"Enganche.",
  capitulos:[
   {id:"c1", t:"...", ctx:"Situación en 2-3 frases con color chileno.",
    ops:[{t:"Opción", d:"Consecuencia.", grupos:{hinchada:12}, mem:"lo que hiciste, en 2ª persona", va:"c2"}, ...]},
   {id:"c2", t:"...", ctx:"...", ops:[{t:"Cierre", d:"...", ef:{prestigio:8}, mem:"...", cierra:true}, ...]}
]}]
```
Dame arcos para los clubes que aún no tienen uno propio, y 3-4 **arcos genéricos** nuevos (sirven a cualquier club).

---

## TANDA C · MÁS VOZ (que NUNCA se repita)
Extendé los pools existentes (no los pises, agregá):
- `RELATO_BETA` — +6 por momento (`inicio/dominio/equilibrio/ahogo/aguanta/cansancio/llega_local/llega_rival`).
- `FRASES_CUERPO` — +5 por contexto (`favorito/parejo/desventaja/clasico/racha_mala/meta_cerca`).
- `PREGUNTAS_BETA` — +6 por situación (sumá `previa_copa`, `descenso_en_juego`, `ascenso_en_juego`).
- `TUITS_MOMENTO` / `TUITS_BETA` — +8 por contexto (sumá `ascenso`, `descenso`, `copa_chile`, `libertadores`).
Formatos: ver `GROK_PROMPT_BETA.md` (tandas 5-8). Mantené el tono chileno.

---

## TANDA D · ESCUDOS SVG ESTILIZADOS (imágenes sin copyright)
El juego usa colores reales pero **escudos estilizados** (no oficiales). Generá un SVG simple por club,
cuadrado, con los **colores del club** y su **sigla/inicial**, forma de escudo. NADA de calcar el escudo
oficial. Formato: dame un objeto JS pegable (lo consume el juego como fondo/ícono):
```js
// clave = id del club; valor = { c1:"#color primario", c2:"#color secundario", txt:"CC" }
const ESCUDOS_CLUB = {
  CC:{c1:"#111111", c2:"#ffffff", txt:"CC"},
  UCH:{c1:"#0a3d91", c2:"#ffffff", txt:"U"},
  UC:{c1:"#12428c", c2:"#ffffff", txt:"UC"},
  ...  /* los 32: Primera CC UCH UC PAL LIM EVE COQ AUD HUA OHI NUB COB CAL LSE DCO UDC · B CBL SW SLQ ANT MAG UES REC PMO SMA COP TEM IQQ USF CUR SCR RAN */
};
```
(El juego dibuja el escudo con esos colores + la sigla; así no hay que subir 32 archivos.) Si además querés,
dame SVGs completos como texto para `img/clubes/{ID}.svg`, siempre **estilizados**.

---

## Dónde pega cada cosa (referencia)
- Épocas/timeline → `js/data-historico.js` (nuevo) → `EPOCAS_CLUB_ADD`, `HISTORIA_BETA`, escenarios futuros.
- Storylines → `ARCOS_EQUIPO` (data-storylines.js) o un `data-arcos-plus.js`.
- Voz → `RELATO_BETA`/`FRASES_CUERPO`/`PREGUNTAS_BETA`/`TUITS_*` (data-grok-beta.js style).
- Escudos → `ESCUDOS_CLUB` en un `data-escudos.js` (el juego ya trae el motor de dibujo).
