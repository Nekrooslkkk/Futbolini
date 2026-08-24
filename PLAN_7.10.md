# PLAN 7.10 · Futbolini — "Darle vida" (diagnóstico + hoja de ruta)

> Revisión de código hecha sobre la 7.00 real (git, no los docs viejos).
> Reemplaza como foto de estado a `ANALISIS.md`/`LISTADO.md`, que quedaron congelados en 5.1l.
> Regla de siempre: se EXPANDE, no se reconstruye. Vanilla JS, estado global `E`, todo en español.

---

## 0 · Diagnóstico en una frase

El juego tiene **más contenido del que se nota**. Los planteles históricos, la voz de Grok y
los arcos **sí están cargados y enchufados**. Lo que falla no es el contenido: es que **no
persiste, no te habla, y tiene costuras sueltas** que gritan "proyecto a medio hacer".
"Le falta vida" = falta persistencia + falta que el mundo reaccione, no faltan datos.

Verificado en código: los 12 planteles de `data-historia.js`, UCH 2011 de Sampaoli
(`data-grok.js:492`) y el merge de `data-voz.js` (`aplicarVoz()`) funcionan bien. Eso NO se toca.

---

## TIER 1 · Bugs y continuidad (baratos, alto impacto, primero)

Son parches chicos que cambian la sensación de "esto está vivo y cuidado".

- **1.1 · Versión unificada.** Hoy conviven "3.0" (`index.html:6` title, `:42` footer,
  `ui.js:68` panel) y "7.0" (`index.html:27` badge). Crear `const VERSION="7.10"` en `util.js`
  y que title, footer, badge y panel salgan de ahí. *(Toca: `util.js`, `index.html`, `ui.js`.)*

- **1.2 · Handles de jugador persistentes.** `redes.js:19-24` `handleJugador()` tira una moneda
  `_of`/`_oficial` **cada llamada** → el mismo jugador tuitea con @ distinto según el evento.
  Fijar el handle por jugador (guardarlo en `j.handle` al armar plantel, o derivarlo determinista
  del nombre sin azar). Mismo criterio para `handleClub`. *(Toca: `redes.js`, quizá `data-plantel.js`.)*

- **1.3 · Cantera muerta de Grok.** `data-voz.js:15-21` `NOMBRES_CANTERA` y `APODOS_CANTERA` no
  los usa nadie (el IIFE `aplicarVoz()` enchufa arcos/logros/trivia/handles/periodistas pero se
  saltó la cantera). Cablearlos: que los juveniles que suben de cantera se bauticen desde esos
  pools en vez de generar nombre random. *(Toca: `data-voz.js` merge + donde nazca el juvenil.)*

- **1.4 · Docs sincronizados.** `ANALISIS.md`, `LISTADO.md`, `IDEAS.md` dicen 5.1l. Actualizarlos
  a 7.10 (o marcarlos como históricos y que este archivo sea la foto viva). Anti-amnesia.

**Entregable Tier 1:** cero costuras visibles. Un jugador nuevo no ve nada que diga "inconcluso".
**Esfuerzo:** 1 sesión.

---

## TIER 2 · Persistencia (para que las mejoras no rompan partidas)

- **2.1 · Save versionado + migración.** `motor.js:969` `guardar()` vuelca `E` sin `SAVE_VER`.
  Agregar `E.saveVer` y un `migrarSave(E)` que corra al cargar y rellene campos nuevos por versión
  (hoy `normalizarEstado()` parcha a ciegas, sin gate). Sin esto, cada parche futuro arriesga dejar
  saves viejos a medio armar. Es el ítem 9 del LISTADO y la promesa "guardar y seguir mañana".
  *(Toca: `motor.js`, `util.js`.)*

**Entregable Tier 2:** actualizar el juego no obliga a partida nueva.
**Esfuerzo:** 1 sesión.

---

## TIER 3 · Que la institución te hable (el corazón de "manejo un club, no un equipo")

Esto es lo que más "vida" da y lo que separa Futbolini de un manager cualquiera.

- **3.1 · La prensa filtra.** Cuando un grupo cae bajo -45, que salga en Chirp / buzón antes de la
  asamblea (hoy la censura existe pero llega muda). Es el ítem C.20 del LISTADO. *(Toca: `motor.js`,
  `redes.js`/`reputacion.js`.)*

- **3.2 · Notificaciones de red.** "te citaron", "te mencionaron", "tendencia en contra". La infra
  de `E.cuentas` y notifs ya existe; falta el hook cuando un hecho (gol anulado, roja, estatuto)
  genera reacción dirigida al DT. *(Toca: `redes.js`, `motor.js`.)*

- **3.3 · Jugadores postean según moral, no al azar.** Ligar la probabilidad y el tono del post del
  jugador a `j.moral` (bronca si está bajo, elogio si está alto). *(Toca: `redes.js`.)*

- **3.4 · Hilos de 4-6 posts** en vez de tweet suelto en los momentos calientes (previa de clásico,
  crisis). *(Toca: `redes.js`.)*

**Entregable Tier 3:** el club reacciona solo. Chirp habla cuando pasa algo, no de relleno.
**Esfuerzo:** 2 sesiones.

---

## TIER 4 · Que el partido y la plata aprieten

- **4.1 · Árbitro con nombre y sesgo visible.** Hoy es `modSuma("arbitraje")` escondido. Darle
  nombre, una tendencia (casero/estricto/VAR-adicto) y que el relato lo mencione. *(Toca:
  `partido.js`, `ui-partido.js`.)*

- **4.2 · Cambio voluntario en vivo.** El recambio por lesión existe; falta que el DT haga hasta 3
  cambios a voluntad (el que entra, frío). *(Toca: `partido.js`, `ui-partido.js`.)*

- **4.3 · Deuda con cuotas.** Que la deuda venza por tramos con fecha, no que sea un globo. Cláusulas
  y comisiones que exploten en fechas concretas. *(Toca: `motor.js`, `mercado.js`.)*

**Entregable Tier 4:** el partido se siente y la caja te puede echar de verdad.
**Esfuerzo:** 2-3 sesiones.

---

## TIER 5 · Que un año se sienta distinto (el gran pendiente de la beta)

Según tu propia definición de beta cerrada, este es el ítem grande que sigue abierto.

- **5.1 · Torneos de copa 2026.** El 1991 tiene el camino real de Libertadores de Colo-Colo
  (`data-liga.js:207`). El 2026 no tiene Copa Chile ni Libertadores/Sudamericana jugables. Armar
  al menos uno bien hecho. *(Toca: `data-liga.js`, `motor.js`, `carrera.js`.)*

- **5.2 · Sabor de época en el relato.** Que el modo histórico/libre/caos cambie el tono del relato,
  los tuits y los eventos (no solo los números). 1991 huele a 1991, 2026 a 2026. *(Toca: `data-eventos.js`,
  `data-voz.js`, `partido.js`.)*

**Entregable Tier 5:** elegir 1991 vs 2026 vs una época de gloria se siente distinto de jugar.
**Esfuerzo:** 3-4 sesiones.

---

## Congelado (no tocar hasta cerrar la beta)

- Tinder / dinastía / casino: están "a medias" y no cierran la beta. Coincide con tu nota vieja.
- IA de pago: apagada, hook listo, no prender.

---

## Orden sugerido de ejecución

1 → 2 → 3 → 4 → 5. Los Tier 1 y 2 son baratos y desbloquean todo lo demás sin riesgo.
Cada tier se prueba (`node --check js/*.js` + navegador en puerto nuevo) y se commitea con
una línea en `PATCHES.md`.
