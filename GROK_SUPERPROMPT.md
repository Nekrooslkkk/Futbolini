# GROK — SUPER PROMPT (bugs + datos)

> Pegá este prompt en Grok. Es el pedido "sácale el jugo": caza bugs de datos y
> produce contenido real para Futbolini. **Claude** hace el código/UI; **vos (Grok)**
> traés datos verificados y detectás inconsistencias. **El usuario** aprueba.

---

## Contexto (leé esto primero)
**Futbolini** es un simulador satírico de conducción de clubes del fútbol chileno.
Vanilla JS puro (ES6), **sin frameworks, sin build, sin dependencias, sin CDN**, corre
**offline**. Todo el estado cuelga del objeto global `E`. Épocas: 1991, 2026, e histórico.

**Reglas inviolables (no las rompas):**
1. **Integridad:** nombres reales de clubes/jugadores/dirigentes con **stats estimadas** y
   aviso de "aproximado". **Nunca inventes** un club, jugador, cita, título o fecha como si
   fuera real. Si no tenés el dato documentado, lo dejás fuera (el juego rellena con cantera).
2. **Respeto:** diversidad sí, burla no. Nada discriminatorio.
3. **Español**; identificadores y comentarios en español.
4. Formato de datos **idéntico a los archivos molde** (abajo). No cambies la forma.

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

**Formato de salida (por hallazgo):**
```
[CRÍTICO] js/data-b2026.js — "Cobreloa" fuerza:40
  Problema: subestimada; peleó ascenso 2025.
  Fix: fuerza:58. Fuente: <link/dato>.
```

## TAREA B — DATOS NUEVOS (contenido real)
Elegí y entregá lo que tengas documentado, en el formato molde:

1. **Históricos de clubes** (para `data-historia.js`): épocas doradas con **hechos reales**
   (campeón X año, goleador, DT, racha), texto breve. Palestino 1978, Limache, etc. — los que
   falten. Nada inventado; si un dato no está, no lo pongas.
2. **Planteles reales 2026** (formato `PLANTEL_<ID>_2026`): empezá por los clubes grandes.
   Solo nombres documentados: `["Nombre Apellido","ARQ|DEF|VOL|DEL",edad,niv(40-90),proy,sueldo,valor,["rasgos"]]`.
3. **Liga extranjera (Argentina primero)**: array `LIGA_ARG_2026` con todos los clubes de la
   Primera 2026 (id/n/ciudad/estadio/aforo/fuerza) + el **formato real del torneo** (cuántos
   equipos, zonas/playoffs, descensos por promedio, cupos internacionales) resumido para que
   Claude lo implemente. Se registra con `registrarLiga(...)`.

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

### División de trabajo
- **Grok:** datos verificados + detección de inconsistencias + pools de texto.
- **Claude:** todo el código (registro de ligas, formatos de torneo, UI, integración del pool).
- **Usuario:** aprueba y aporta voz (chilensis).

### Recordá
Sin inventar nada como real. Formato idéntico al molde. Si dudás de un dato, marcalo como
"sin verificar" en vez de afirmarlo.
