# FUTBOLINI — Briefing para agentes de IA (memoria portátil)

> Pegá este archivo COMPLETO al inicio de cualquier sesión con otra IA (Grok, Gemini, etc.)
> junto con `PATCHES.md`. Es la memoria del proyecto: sin esto, la IA "olvida" y rompe el hilo.

## 1. Qué es
**Futbolini** es un simulador de **conducción de clubes de fútbol chileno**. La idea fuerza:
> *"No manejás un equipo. Manejás una institución."*
El jugador es el mandamás del club: grupos de interés que empujan para lados distintos, plata que
duele, estatutos que se pueden cambiar si tenés el poder, decisiones sin porcentajes a la vista, y
partidos que se sienten. Dos épocas jugables: **1991** (histórico real) y **2026** (Primera actual).

## 2. Regla de oro (INVIOLABLE)
- **NUNCA reconstruir desde cero.** Se EXPANDE sobre los módulos existentes.
- **Vanilla JS puro**, sin frameworks, sin librerías externas, sin build. Todo corre abriendo
  `index.html` o con `python -m http.server`. Nada de npm/React/CDN.
- **Match del estilo del código**: identificadores en español, funciones cortas, `"use strict"`,
  comentarios escuetos. Mirá un archivo antes de escribir y copiá el tono.
- **Estado global `E`** (un objeto). Se guarda en localStorage vía `Store`. Casi todo cuelga de `E`.
- **Integridad**: nombres reales de clubes/jugadores/dirigentes OK, pero stats son estimaciones del
  juego y se declara "aproximado". Lo dramatizado (charlas, conflictos, frases) es ficción, declarado
  una vez. **Nunca poner frases inventadas como declaraciones reales documentadas.**

## 3. Cómo correrlo / probarlo
```
cd futbolini && python -m http.server 8891   # abrir http://localhost:8891/
```
Para probar lógica sin navegador se usa un **harness de Node** que concatena los `js/` que no tocan
el DOM (util, data-*, motor, partido, carrera, mercado, ia) con stubs de `render/aviso`, y simula
temporadas. (Pedir el harness a Claude Code si hace falta; no está en el repo del juego.)

## 4. Mapa de archivos (`js/`)
- `util.js` — helpers, azar (`rnd/ri/elige/eligePeso`), `clamp`, `plata`, `Store` (guardado), `modal`, `panel`, `el`.
- `data-liga.js` — `LIGA91`, `LIGA_2026`, `ERA` (puntos/inflación), `activarLiga`, calendario, `CLIMAS`.
- `data-plantel.js` — planteles reales (`PLANTEL_*`), `generarJugador`, `armarPlantel`, tokens (`{GOLEADOR}` etc).
- `data-grupos.js` — grupos de interés, estatutos, reputación.
- `data-decisiones.js` — decisiones (`DECISIONES`, `BOLSA`, `ENCADENADAS`); `decisionPorId`.
- `data-eventos.js` — `EVENTOS` (mundo vivo), `CRISIS`, `ENCADENADAS`.
- `motor.js` — estado `E`, economía, resolución de decisiones (sin dado a la vista), eventos, tiempo, notificaciones.
- `partido.js` — motor de partido por ticks (`tickPartido`), penales/tiro libre/lesión, pizarra libre, presión con stamina.
- `carrera.js` — mandato, destitución, ofertas de otros clubes.
- `ia.js` — redes del club + roleo OFFLINE (hook de API apagado, `IA_CONFIG`).
- `ui-partido.js` — previa, partido en vivo (timer fluido + auto-pausa), pizarra, resumen.
- `ui.js` — interfaz general, menú, todas las vistas, arranque.
- `css/` — `base.css`, `aero.css`, `temas.css` (estética Frutiger Aero).

## 5. Modelo de estado `E` (campos clave)
`club, eraBase(1991|2026), clubNombre, anio, modo, ind{plantel,moral,hinchada,socios,cantera,estadio,prestigio,riesgo},
plata, deuda, capital(sin tope), rep{publica,credibilidad,prensa,dureza}, grupos{}, estatutos{}, mods[], flags{},
plantel[], calendario[], idx, tabla{}, decPend[], decHechas{}, bandeja[], notifs[], ofertasPend[], redes[], promesas[],
precios{galeria,tribuna,marquesina}, staff{deportivo,tesorero,prensa,cm}, tactica{form,estilo,presion,pizarra},
temporada{...,sinGanar}, carrera{...}, pendientesEncadenadas[]`.
Helpers centrales: `aplicarEfectos(ef)`, `aplicarGrupos`, `aplicarRep`, `notificar({t,d,tipo,acc})`, `guardar()`.

## 6. Estado del roadmap
Roadmap 3.0 **completo** (encadenados, motor partido, mercado, eras 1991/2026, redes offline) + centro de
notificaciones. Roadmap **4.0 COMPLETO** (Pizarra/Timer, Economía/Sliders, Historial, Mercado profundo, Redes procedural).
**`PATCHES.md` es la bitácora fuente de verdad**: dice qué toca cada parche, cómo editar planteles y cómo
encender la IA. LEERLA SIEMPRE ANTES DE TOCAR NADA.

## 7. Protocolo de delegación (para no perder el hilo)
Cuando recibas una tarea de este proyecto:
1. **Leé** este BRIEFING + `PATCHES.md` + el/los archivo(s) que vas a tocar. No asumas nada de memoria.
2. **Alcance**: hacé SOLO lo pedido. Si algo requiere tocar otro módulo, avisá antes.
3. **Entregá** código listo para pegar: función(es) completas o un diff claro, en el estilo del repo,
   sin romper el orden de carga (`index.html`) ni globals. Nada de dependencias externas.
4. **No dupliques**: si ya existe una función/dato parecido, extendelo.
5. **Reportá** al final en 5 líneas: qué archivos tocaste, qué funciones agregaste/cambiaste, qué probar,
   y una línea para pegar en `PATCHES.md`. Ese reporte es el que mantiene el hilo entre IAs.
6. **Ante la duda, preguntá.** Mejor una pregunta que romper el juego.

## 8. Anti-amnesia
- Si no ves `PATCHES.md`/`BRIEFING.md` en tu contexto, PEDILOS antes de escribir código.
- Nunca inventes cómo funciona algo: verificá en el archivo real.
- Mantené el tono y la identidad del juego (institución, no equipo; realismo; ficción declarada).
