# GROK — SUPER PROMPT (bugs + datos + lenguaje)

> Pegá este prompt en Grok. Es el pedido de siempre, **mejorado**: caza de
> bugs de datos, liga Argentina + historia de Segunda, pool Plop 200+, y
> ahora también **voz chilensis**. Claude mete el código; vos traés datos
> verificados y lenguaje. El usuario aprueba.
>
> Claude también te va a promptear los huecos que queden (planteles, frases,
> fixtures). Este archivo es la base; no borres las tareas A/B/C.

---

## Contexto (leé esto primero)

**Futbolini** es un simulador satírico de conducción de clubes del fútbol chileno.
Vanilla JS puro (ES6), **sin frameworks, sin build, sin dependencias, sin CDN**, corre
**offline**. Todo el estado cuelga del objeto global `E`. Épocas: 1991, 2026
(Primera / B / Segunda), e histórico.

**Reglas inviolables (no las rompas):**
1. **Integridad:** nombres reales de clubes/jugadores/dirigentes con **stats estimadas** y
   aviso de "aproximado". **Nunca inventes** un club, jugador, cita, título o fecha como si
   fuera real. Si no tenés el dato documentado, lo dejás fuera (el juego rellena con cantera).
2. **Respeto:** diversidad sí, burla no. Nada discriminatorio.
3. **Chilensis de verdad, sin voseo argentino.** Nada de "vos tenés / andá / mirá" argentino.
   En Chile: -ai/-ís, "po", "cachái", "pa'", "wn", "brigido", "la cagó". El autor escribe
   así: directo, con apuro, listas, "la idea es…", "no sé cuántas veces te he pedido…".
4. Formato de datos **idéntico a los archivos molde** (abajo). No cambies la forma.
5. **Dos registros:** `neutro` (limpio, latinoamericano **sin voseo**) y `cl` (chilensis de
   cancha). El crudo vive SOLO en `cl`.

**Cómo escribe el autor (copiá ESTE tono, no el de un copywriter):**
- "No estás conectado, futbolini esta en la 7.69"
- "en la segunda división, encontré una de dichas decisiones pero sobre el estadio de Colo-Colo"
- "NO SE CUANTAS VECES TE HE PEDIDO QUE CONECTES EL CALENDARIO BIEN A TODO LO QUE SE JUEGA"
- "el ayudante obvio no sean tan obvio xd"

**Archivos molde (copiá la forma EXACTA):**
- `js/data-segunda2026.js` → cómo se define una liga a mano (array de clubes + info).
- `js/liga-registrar.js` → **`registrarLiga({eraKey, clubs, baseEra, nombre})`**: cablea una
  liga entera con UNA llamada (deriva indicadores/caja/estatuto de la `fuerza`).
- `REGLAS.md` → reglas reales de cada torneo (Primera 16 clubes/2 descensos, Primera B,
  Segunda Norte/Sur + liguilla, Copa Chile, etc.).

**Esquema de un club:**
```js
{ id:"BOC", n:"Boca Juniors", c:"Boca", fuerza:82, aforo:54000,
  est:"La Bombonera", ciudad:"Buenos Aires", z:"—" }
```
`id` = 3 letras únicas (que no choquen con las existentes). `fuerza` = estimación 40–90.

---

## TAREA A — CAZA DE BUGS DE DATOS (QA)

Revisá los archivos de datos (`js/data-*.js`) y reportá, en una **lista priorizada**
(crítico → menor), todo lo que encuentres. Para cada hallazgo: **archivo, qué está mal,
por qué, y el fix propuesto** (con el valor correcto documentado). Buscá:

1. **IDs duplicados o chocados** entre divisiones/ligas (mismo `id` en dos clubes).
2. **Ciudades / estadios / aforos irreales o cambiados** (ej. estadio que no es del club,
   aforo imposible para la categoría). Traé el dato correcto con fuente.
3. **`fuerza` incoherente** (un grande con fuerza de chico o viceversa; rangos fuera de 40–90;
   una división entera demasiado pareja o demasiado dispar).
4. **Nombres mal escritos** (tildes, apodos, nombres oficiales 2026).
5. **Zonas de Segunda mal asignadas** (campo `z`: "norte"/"sur") según geografía real.
6. **Hechos históricos dudosos** en `data-historia.js` (títulos, años, goleadores, DTs):
   confirmá o corregí con fuente. Marcá lo que no puedas verificar.
7. **Frases/citas** que suenen inventadas-como-reales (deberían ser ficción declarada).
8. **Texto de otro club** en decisiones: Monumental / Macul / Santa Laura / Nacional /
   Ester Roa / Elías Figueroa / Sausalito / etc. si el club de la partida **no es** ese.
   (Ya se filtró `b_cantera_cancha`; cazá más.)
9. **Metas de Libertadores / Copa Chile en B o Segunda** (en 2026 Segunda no juega Copa Chile
   ni clasifica a CONMEBOL; la B no clasifica a Libertadores por liga).
10. **Calendario**: Segunda 2026 con partidos de Copa Chile; Copa de la Liga en B/Segunda;
    un id de rival que no resuelve `clubLookup`.
11. **Tokens crudos** `{CRACK}` `{IDOLO}` `{ESTADIO}` que sobrevivan en textos de UI.

**Formato de salida (por hallazgo):**
```
[CRÍTICO] js/data-b2026.js — "Cobreloa" fuerza:40
  Problema: subestimada; peleó ascenso 2025.
  Fix: fuerza:58. Fuente: <link/dato>.
```

---

## TAREA B — DATOS NUEVOS (contenido real)

Elegí y entregá lo que tengas documentado, en el formato molde:

1. **Históricos de clubes** (para `data-historia.js`): épocas doradas con **hechos reales**
   (campeón X año, goleador, DT, racha), texto breve. Palestino 1978, Limache, etc. — los que
   falten. Nada inventado; si un dato no está, no lo pongas.
2. **HISTORIA de Segunda 2026** (los 14): SMO, LSC, OSO, LIN, CLC, TRA, COL, OVA, CNA, BSA,
   RSJ, SCI, GVE, REN. Hechos **públicos** (fundación, ciudad, apodo, un hito). Sin inventar
   plantel si no está documentado.
3. **Planteles reales 2026** (formato `PLANTEL_<ID>_2026`): empezá por los clubes grandes y
   después Segunda. Solo nombres documentados:
   `["Nombre Apellido","ARQ|DEF|VOL|DEL",edad,niv(40-90),proy,sueldo,valor,["rasgos"]]`.
4. **Liga extranjera (Argentina primero)**: array `LIGA_ARG_2026` con todos los clubes de la
   Primera 2026 (id/n/ciudad/estadio/aforo/fuerza) + el **formato real del torneo** (cuántos
   equipos, zonas/playoffs, descensos por promedio, cupos internacionales) resumido para que
   Claude lo implemente. Se registra con `registrarLiga(...)`.
   IDs de 3 letras que **no choquen** con Chile (BOC, RIV, RAC, IND, etc. — chequeá
   `js/data-liga.js` + `data-clubes2026.js` + `data-b2026.js` + `data-segunda2026.js`).

---

## TAREA C — CONTENIDO PARA EL PLOP! 2026 (generación en batch, offline)

Generá un **pool grande** (200+) de **titulares y tweets estilo 2026** del fútbol chileno,
para hornearlos en un archivo de datos (NO se llama a Grok en vivo; esto es de una vez).
- Personas variadas (hincha, periodista serio, cuenta troll, cuenta de datos, doña del barrio).
- Etiquetá cada uno con un **contexto** (`gol`, `derrota`, `crisis_dirigencia`, `fichaje`,
  `clasico`, `ascenso`, `descenso`, `arbitraje_var`, `mercado`).
- Placeholders permitidos: `{GOLEADOR}`, `{DT}`, `{CLUB}`, `{RIVAL}`.
- **Dos registros:** neutro (limpio) y **chilensis de verdad** (sin voseo argentino; "po",
  "cachái", "-ai/-ís"). El chilensis puede ser crudo pero **sin burla a grupos**.
- Formato: `{ ctx:"gol", quien:"@handle", txt:"...", registro:"cl" }`.

---

## TAREA D — POOL DE LENGUAJE (voz del autor, UI y ayudante)

Entregá **80–120 líneas** listas para pegar, en este formato exacto:

```
{ ctx:"escritorio", registro:"cl", k:"esc_atiende", txt:"Atendé esto antes de avanzar, po" }
{ ctx:"meta_deuda", registro:"cl", txt:"La deuda no es un número, wn: es un tipo en traje que te llama el viernes." }
{ ctx:"noticia_imp", registro:"neutro", txt:"…" }
```

Campos:
- `ctx` de esta lista: `escritorio`, `atiende`, `meta_deuda`, `meta_pos`, `meta_hinchada`,
  `ayudante`, `noticia_imp`, `noticia_chiste`, `poder`, `grupo_directorio`, `grupo_barra`,
  `estatuto`, `mercado`, `cesion`, `calendario`, `segunda`, `copa_chile`, `conferencia`,
  `gol`, `derrota`, `directorio_cierre`.
- `registro`: `cl` o `neutro`. **Mitad y mitad.** El `cl` puede ser crudo; el `neutro` no.
- `k` opcional (clave corta tipo `esc_atiende`) cuando sea un string de UI.
- `txt`: una frase. Placeholders: `{CLUB}`, `{RIVAL}`, `{GOLEADOR}`, `{DT}`, `{ESTADIO}`, `{DIVISION}`.

**Qué busco (prioridad):**
1. Frases de **dirigente chileno** hablando con el ayudante, el directorio, la barra, el tesorero.
2. **Cómo hacer** las cosas: no "la deuda es alta" sino "vendé al que no juega, no pidas más crédito".
3. Noticias de diario deportivo chileno: una importante y una chistosa.
4. Segunda División: zona, lodazal, viaje eterno. **Nunca** el Monumental si el club no es Colo-Colo.
5. El ayudante **no suena a tutorial**. Nada de "¿Hay Libertadores?" en Segunda. Suena a
   mano derecha: "¿El domingo?", "¿Vendemos a alguien?", "¿Hablo con el capitán?".

## TAREA E — VERIFICACIÓN INTEGRAL POR EQUIPO (el gran barrido pre-8.0)

> Esto es lo grande. La idea es que **cada** equipo (Primera, B, Segunda, Argentina)
> quede coherente y jugable, para que después Claude solo tenga que **agregar** encima
> de esta pulición. Sin 8.0 sólido, no hay Futbolini 8.0. Andá club por club y devolvé
> una **tabla por división** con una fila por club y una columna por cada punto de abajo,
> marcando ✅ OK / ⚠️ dudoso / ❌ falta, con el **dato correcto + fuente** en cada ❌/⚠️.
> Formato de hallazgo idéntico a la TAREA A (`[CRÍTICO] archivo — problema / fix / fuente`).

Revisá para **TODOS** los equipos:

1. **Problema / situación definida.** Que cada club tenga su "por qué juego a esto":
   deuda, dirigencia, meta de la temporada, conflicto (baja de socios, cantera vendida,
   barra, arriendo del estadio). Que el hincha entienda **qué está haciendo** con ese club.
   Marcá los clubes que hoy no tienen situación propia (rellenan genérico). Archivos:
   `data-clubes-meta.js`, `data-storylines.js`, `data-decisiones*.js`.

2. **Clásico correcto y VARIADO.** Verificá que el rival de cada club sea el **real** y
   **no siempre el mismo**. Nada de que todos tengan de clásico a Colo-Colo o a la U.
   Traé el par correcto (ej. Wanderers–Everton, Concepción–Fernández Vial, Antofagasta–Cobreloa,
   Iquique–regional, etc.). Archivo: `RIVALIDADES_2026` en `data-clubes2026.js` (+ equivalentes
   B/Segunda/Argentina). Devolvé la lista completa de pares corregida.

3. **Economía realista por club.** `caja:{plata,deuda}` e indicadores (`socios`, `hinchada`,
   `estadio`, `prestigio`) coherentes con la categoría y el tamaño real. Un grande no puede
   tener caja de club chico ni al revés; un club de Segunda no maneja los millones de un grande.
   Traé rangos/valores estimados con criterio y aviso "aproximado".

4. **Planteles, canteranos, situación de jugadores, sponsors.** Que los planteles reales
   (`PLANTEL_<ID>_2026`) existan y sean documentados; que los canteranos/jóvenes tengan sentido
   por club; que las "situaciones con jugadores" (renovación, lesión, oferta) no repitan el mismo
   nombre para todos; sponsors reales por club si están documentados (si no, dejar genérico).

5. **Calendarios y fixtures DE CADA COPA.** Verificá que a cada club le toquen los partidos
   correctos **por torneo**: Liga (rueda), **Copa Chile** (grupos/llaves reales), Supercopa,
   y CONMEBOL (Libertadores/Sudamericana) **solo** para quien clasifica. Nada de Copa Chile en
   Segunda ni Libertadores por liga en B. Archivos: `data-copas2026.js`, `data-formato2026.js`,
   `motor.js` (construcción de calendario).

6. **Equipos IA (los que NO elijo pero salen en mi calendario).** Verificá que esos rivales
   simulados también tengan **su** fixture correcto y su temporada propia coherente (no que
   jueguen partidos fantasma o resultados imposibles). Que el mundo alrededor del club elegido
   sea consistente.

7. **Simulación posterior NO idéntica — cambios "que aprueba la ANFP".** La liga no debería
   repetirse igual cada año: sujetala a **cambios leves reales** de reglamento que de verdad
   pasaron (traé los cambios históricos documentados: cantidad de clubes, descensos, formato
   Apertura/Clausura→anual, cupos internacionales, etc.) para escalonarlos año a año, y dejá
   propuesta de **cambios mayores a futuro** (hipotéticos, marcados como ficción). Entregá una
   **línea de tiempo de reglas** para que Claude la implemente.

8. **Estadios correctos.** Nombre real, **aforo/butacas** real, si el club **arrienda** o es
   dueño, ciudad, y (si aplica) **precios de entrada** por categoría. Marcá los estadios mal
   asignados o con aforo irreal. Archivos: `data-estadios.js`, campo `est`/`aforo` de cada club.

9. **Sección HISTORIA para todos, INCLUIDA la liga argentina.** Verificá que la historia
   funcione y tenga contenido para cada club chileno **y** argentino (`HISTORIA_BETA`,
   `data-historia.js`, `data-historico.js`). Marcá los que quedan vacíos o con texto de otro club.

10. **Más realismo en el Plop!** Titulares/tuits más creíbles y variados por contexto
    (ver TAREA C): que reaccionen al club, la categoría y el momento real, no genéricos.

11. **Modos históricos para TODOS los equipos, incluida Segunda.** Hoy hay 1925/2006 centrados
    en Colo-Colo. Proponé, con **hechos verificados**, la época dorada/histórica de cada club
    (año, título/hito, DT, plantel documentado) para que tenga su propio modo. Formato exacto de
    `EPOCAS_CLUB_ADD` (ver `data-historia.js`) + `PLANTEL_<ID>_<AÑO>`. Incluí clubes de Segunda.

12. **Modo 1925: sacar lo actual.** En 1925 no debe haber nada moderno (redes, mercado
    millonario, Libertadores, sponsors, VAR). Mantener el **formato Plop** de la época (prensa
    de 1925) y, si corresponde, **mismas reglas de fútbol** de entonces (verificá qué reglas
    regían: offside, puntos por victoria, cantidad de jugadores). Marcá cualquier anacronismo.

13. **UI dorada (oro) consistente — dato que falta.** Claude ya arregló el **lado del código**:
    ahora un club marca su época de gloria en dorado igual para todos (Colo-Colo 1991 Libertadores
    ya sale en oro, como el 2011 de la U). Lo que falta es **dato**: varios clubes todavía no
    tienen ninguna época de gloria definida en `EPOCAS_CLUB`/`EPOCAS_CLUB_ADD`, así que su menú
    no muestra botón dorado. En la TAREA E-11 entregá esas épocas para que **todos** tengan su
    hito dorado. No inventes glorias: si un club no ganó nada grande, su "gloria" puede ser un
    subcampeonato/ascenso real (como ya se hizo con Everton 2012 o Audax 2018).

**Prioridad:** primero lo que rompe coherencia (clásicos, calendarios, estadios, economías),
después contenido nuevo (historias, modos, épocas doradas), al final el pulido de texto (Plop!).

---

### División de trabajo
- **Grok:** datos verificados + detección de inconsistencias + pools de texto + voz.
- **Claude / Build:** código (registro de ligas, formatos, UI, integración del pool).
- **Usuario:** aprueba y corrige el chilensis (es su voz). Claude te va a pedir los huecos
  que vayan quedando; contestá en el mismo formato.

### Recordá
Sin inventar nada como real. Formato idéntico al molde. Si dudás de un dato, marcalo como
"sin verificar" en vez de afirmarlo.
