# GROK_TAREAS.md — encargos para Grok (coordinación 3 IAs)

> Claude (motor/UI/QA) dejó el terreno de código listo. Grok: datos reales.
> Codex/GPT-5 también colabora. Antes de tocar: `git fetch` + FF sobre `main`.
> Regla de oro (CLAUDE.md): expandir, no reconstruir. **Nunca inventar un jugador,
> DT o cita como real.** Nombres reales documentados + stats estimadas. Cada cambio:
> `node --check js/*.js` + una línea en `PATCHES.md`. No tocar el orden de `<script>`.

## Estado real (sep 2026, HEAD e7d1b70 / 7.52)
- Primera (2026), Primera B (2026b) y **Segunda División Profesional (2026c)** jugables,
  con **ascenso/descenso de 3 niveles** conectado. Copa Chile andando.
- La **Segunda ya está en el juego** con sus 14 clubes reales (ver `data-segunda2026.js`),
  pero los **planteles son cantera** (genéricos). Ese es el hueco a llenar.

---

## Tarea 1 — Planteles reales de la Segunda División 2026 (PRIORIDAD)
Los 14 clubes ya existen; faltan sus jugadores reales. Para cada club, dame un array
`PLANTEL_<ID>_2026` con 18–22 jugadores en ESTE formato exacto (igual a `data-b2026.js`):

```js
const PLANTEL_SMO_2026=[
 ["Nombre Apellido","ARQ|DEF|VOL|DEL",edad, nivel(40-70), proy(40-70), sueldo(10-60), valor(20-200), ["rasgos"]],
 ...
];
```
- IDs: SMO Santiago Morning · LSC Lota Schwager · OSO Provincial Osorno · LIN Deportes Linares ·
  CLC Colchagua · TRA Trasandino · COL Atlético Colina · OVA Provincial Ovalle ·
  CNA Concón National · BSA Brujas de Salamanca · RSJ Real San Joaquín · SCI Santiago City ·
  GVE General Velásquez · REN Deportes Rengo.
- Fuente: Wikipedia / ANFP / En Cancha / playmakerstats (planteles 2026). Solo nombres
  documentados; si no llegas a 18, deja los que haya (el juego rellena con cantera).
- Dónde: agrégalos al final de `js/data-segunda2026.js` y regístralos en `PLANTELES_REALES`
  (mirá cómo lo hace `data-b2026.js` al final, con su IIFE). Nivel bajo (3er nivel): 40–60.

## Tarea 2 — Formato real de la Segunda: grupos Norte/Sur + liguilla
Cada club ya tiene su **zona** en el campo `z` ("norte"/"sur") de `LIGA_C_2026`.
Grok: documentá el formato exacto 2026 (cuántas fechas por zona, cómo es la liguilla por
el ascenso, cuántos descienden y a dónde). Yo (Claude) lo implemento en el motor con eso.
Dejá el resumen en un `.md` o acá abajo; no toques el motor.

## Tarea 3 — "Copa de la Liga" / Supercopa (investigar antes de construir)
El usuario quiere una "Copa de la Liga". En Chile no hay una tradicional con ese nombre;
existe la **Supercopa** (campeón de Primera vs campeón de Copa Chile). Grok: confirmá qué
competencia es la que corresponde (formato, participantes, cuándo se juega). Con eso decidimos
si armamos Supercopa o un torneo corto. No inventar un torneo como si fuera oficial.

## Tarea 4 — Automejora / barrido de datos
Buscá y reportá (en un `.md`) huecos de datos reales:
- Rosters de épocas nuevas sin lista (hoy cantera): LIM 2025, CBL 2003, SW 2019, etc.
- Stats que se vean muy fuera de rango vs la realidad.
- Fixtures generados que podrían ser reales (UC 1991, Primera B 2026).
Priorizá por impacto; no cambies código de motor, solo datos + reportes.

## Cómo entregar
Pegale los arrays/datos al usuario o commiteá directo a `data-*.js` (con `node --check` +
línea en PATCHES). Si es mucho, dejalo en un `.md` y Claude lo integra. Coordinación: si
tocás un archivo que Claude/Codex también tocan, avisá en el commit.
