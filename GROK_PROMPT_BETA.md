# GROK_PROMPT_BETA.md — Contenido para la beta pro de Futbolini

Este archivo es para pegarle a **Grok** (o cualquier LLM con buen conocimiento del fútbol chileno).
Futbolini es 100% offline: Grok **no corre dentro del juego**, solo genera texto/datos que después se
copian a los `js/data-*.js`. Devolvé **solo el bloque de código pedido**, listo para pegar.

## REGLAS DURAS (no romper nunca, aplican a TODO)
1. **Español chileno/neutro (tú), SIN lenguaje inclusivo** (es "todos", "jugadores", "la gente").
2. **Nombres reales OK** (clubes, jugadores, DTs, periodistas, estadios), pero:
   - **Stats estimadas**, nunca presentadas como oficiales.
   - **NUNCA inventar declaraciones reales** atribuidas a una persona real como cita textual. El que
     declara en el juego es el DT que maneja el usuario (personaje). Un periodista real solo *pregunta*.
   - Nada que dañe a una persona real (acusaciones, datos privados, burlas crueles).
3. **Info histórica verificada y SIN sesgo** (títulos, campañas, hechos públicos). Si no estás seguro, omití.
4. **Sin copyright** (nada de letras de canciones ni textos calcados largos).
5. Humor sí, mala leche gratis no. Se ríe *con* la cultura del fútbol chileno.

---

## TANDA 1 · PRIMERA B 2026 (la más pedida)
Necesito los clubes de la **Primera B chilena 2026** para hacerlos jugables (arranca por **Cobreloa** y
sumá los demás que correspondan a la categoría ese año). Dame DOS cosas:

### 1.a) Datos de cada club (formato `LIGA_2026`)
```js
{id:"CBL", n:"Cobreloa", c:"Cobreloa", fuerza:64, aforo:22000, est:"Estadio Zorros del Desierto", ciudad:"Calama"},
```
- `id`: 3 letras únicas (no repitas los de Primera: CC, UCH, UC, PAL, LIM, EVE, COQ, AUD, HUA, OHI, NUB, COB, CAL, LSE, DCO, UDC).
- `fuerza` 0–100 (calibra el nivel del rival; Primera B suele ir 50–68).
- Dame **todos los clubes de Primera B 2026**.

### 1.b) Plantel real de cada club (formato de siempre)
```js
const PLANTEL_CBL_2026=[
 ["Nombre Apellido","POS",edad,nivel,proy,sueldo,valor,["rasgos"]],
 ...
];
```
- POS: `"ARQ"|"DEF"|"VOL"|"DEL"`. 20–24 jugadores. nivel/proy 20–75 (es Primera B). sueldo/valor en millones.
- rasgos (0–2) de esta lista: `canterano, extranjero, contención, proyección, ídolo, de la casa,
  velocidad, enganche, juego aéreo, tiro libre, penales, desequilibrio, cabeza caliente,
  frio de definicion, llegador`.
- Nombres reales del plantel 2026 (de referencia); si no sabés 22, poné los que sepas (mínimo 16) y
  NO inventes nombres como reales.

---

## TANDA 2 · COPA CHILE (para el modo actual 2026)
Investigá y explicá (texto claro, no código todavía) para que el desarrollador arme el motor:
- **Formato real de la Copa Chile** más reciente (fases, cuántos equipos, ida/vuelta o partido único,
  si entran equipos de Primera + Primera B + amateurs, cupo internacional que otorga).
- **Calendario tipo** (en qué meses del año se juega, cuántas fechas).
- Si la Copa Chile **existía en 1991**, contá brevemente cómo era ese año (para el modo histórico).
Devolvé esto en prosa corta y verificable. (El código lo arma el desarrollador con tu info.)

---

## TANDA 3 · COPA LIBERTADORES + SUDAMERICANA (formato fiel)
Investigá y explicá (prosa corta, verificable):
- **Formato actual** de la Copa Libertadores (fase de grupos: cuántos grupos, cuántos por grupo, cuántos
  avanzan; octavos→final; ida/vuelta; final única). Ídem **Copa Sudamericana**.
- **Cómo clasifican los clubes chilenos** a cada torneo (cupos por el campeonato nacional y la Copa Chile).
- Un **esqueleto de calendario** (meses de fase de grupos, octavos, etc.).
- Nota para el modo histórico: cómo era el formato de la **Libertadores 1991** (la que ganó Colo-Colo),
  para simularlo fiel en esa época.
(El desarrollador arma el motor; vos das el formato correcto.)

---

## TANDA 4 · HISTORIA REAL POR CLUB Y ÉPOCA (para "ser consecuente")
Para CADA club jugable, en su **época actual** y en su(s) **época(s) histórica(s)**, dame los **problemas
e hitos REALES** de ese club en esa era (2–4 líneas por club/época). Esto alimenta que el modo historia
sea fiel (la U con el estadio propio, etc.), sin inventar citas.
Formato libre pero etiquetado:
```
UCH · actual: ...
UCH · 2011: ...
CC · 1991: ...
```
Clubes: CC, UCH, UC, PAL, LIM + los 11 de Primera 2026 (EVE COQ AUD HUA OHI NUB COB CAL LSE DCO UDC) +
las épocas de gloria ya cargadas (ver PATCHES). Hechos públicos, cero sesgo político.

---

## TANDA 5 · RELATO DE PARTIDO (pool grande, anti-repetición)
Frases de relato para que NO se repita "Primeros toques, todavía sin profundidad". Cortas, chilenas, por
momento del partido. Formato:
```js
// momento: "inicio" | "dominio" | "equilibrio" | "ahogo" | "aguanta" | "cansancio" | "llega_local" | "llega_rival"
{ m:"equilibrio", x:"Se pelean cada pelota en el medio, nadie afloja." },
```
Dame ~8 por momento, variadas (algunas con humor de barrio, otras secas de relator).

---

## TANDA 6 · FRASES DEL CUERPO TÉCNICO (antes de salir a la cancha)
Una frase del ayudante/cuerpo técnico antes del partido, **chilena, seca, sin pelos en la lengua**, según
el contexto. Formato:
```js
// ctx: "favorito" | "parejo" | "desventaja" | "clasico" | "racha_mala" | "meta_cerca"
{ ctx:"clasico", x:"Hoy no se especula, profe. O los pasamos por arriba o nos comen." },
```
Dame ~6 por contexto. Nada acartonado; que suene a camarín chileno.

---

## TANDA 7 · PREGUNTAS DE PRENSA (pools grandes por contexto)
Preguntas que un periodista chileno haría (solo pregunta, nunca opinión inventada). Para que la conferencia
deje de repetir. Formato:
```js
// sit: "previa_favorito" | "post_derrota" | "racha_sin_ganar" | "clasico_previa" | "post_goleada" |
//      "figura_juvenil" | "rumor_venta" | "promesa_incumplida" | "arbitro"
{ sit:"post_derrota", q:"¿Qué le pasó al equipo en el segundo tiempo?" },
```
Dame ~8 por situación. Naturales, no calcadas.

---

## TANDA 8 · TUITS DE PLOP (más variedad)
Tuits atados al MOMENTO (no al relato). Voz de hincha, meme, troll, prensa. Máx ~140 caracteres. Formato:
```js
// ctx: "gana_agonico" | "pierde_local" | "expulsion" | "hat_trick" | "penal_errado" | "remontada" |
//      "goleada_favor" | "clasico_gana" | "arquero_figura" | "aburrido" | "autogol" | "var"
{ ctx:"aburrido", quien:"@doña_clarita", txt:"Este partido da más sueño que la micro un lunes 😴" },
```
Dame ~8 por contexto. `quien` = handle inventado genérico o medio real (nunca cita textual de persona real).

---

## TANDA 9 · CANTERANOS / DATOS (más plantel)
Pool de nombres de **canteranos ficticios creíbles** (para rellenar sin inventar reales) + rasgos, y
apodos del ambiente chileno. Formato: array de strings para nombres, y para canteranos con stat:
```js
["Nombre Apellido","POS",edad(16-21),nivel(25-55),proy(55-85),0.5,valor,["canterano","proyección"]],
```
Dame ~30 canteranos y ~40 apodos/nombres de relleno.

---

## TANDA 10 · IMÁGENES (logos, periodistas, estadios) — OJO
El juego es **100% offline**, así que las imágenes tienen que ser **archivos locales** en `img/`. Grok
**no puede** meter archivos al repo. Lo que SÍ podés hacer: darme una **lista** de qué logo/foto conseguir
por club y una descripción, o generar SVGs simples (escudos estilizados, no oficiales) como texto pegable.
Si generás SVG de escudos, que sean **genéricos/estilizados** (no calcar el escudo oficial con copyright).

---

## Dónde lo pega el desarrollador (referencia interna)
- Primera B → `js/data-liga.js` (LIGA_2026 o una LIGA_B nueva) + `js/data-grok.js` (PLANTELES_REALES).
- Historia/épocas → `js/data-historia.js`. · Relato → `js/partido.js`. · Cuerpo técnico → `js/ui-partido.js`.
- Prensa → `js/ui-partido.js` (PERIODISTAS/preguntas). · Tuits → `js/data-tuits.js`/`js/redes.js`.
- Canteranos → `js/data-plantel.js`. · Copa Chile / Libertadores → motor nuevo (con tu formato).
