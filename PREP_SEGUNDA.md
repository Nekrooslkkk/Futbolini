# PREP_SEGUNDA.md — preparar la "segunda división" (coordinación 3 IAs)

> Estado y plan para el que la tome (Grok/Claude/ChatGPT). Regla: expandir, no
> reconstruir. Antes de pushear: `git fetch` + FF. Marcar en PATCHES.

## Qué YA existe (no rehacer)
- **Primera B 2026 = jugable.** `js/data-b2026.js`: 16 clubes reales (SW, CBL, SLQ,
  ANT, MAG, UES, REC, PMO, SMA, COP, TEM, IQQ, USF, CUR, SCR, RAN) con estadio,
  ciudad y fuerza. Elegibles en el selector (`ui.js`, base `"2026b"`).
- **Ascenso/descenso** Primera↔B conectado (7.41). **Copa Chile** todos los años.
- **Rosters reales:** ~10/16 tienen plantel cargado (CBL, SW, UES, IQQ, ANT, COP,
  PMO, SLQ, TEM, REC). Los otros 6 (MAG, SMA, USF, CUR, SCR, RAN) → cantera ficticia.
- **Fixture B:** GENERADO (round-robin vía `construirCalendario`), no el oficial ANFP.

## Camino A — profundizar la Primera B (más barato, alto valor)
Meta: que la B se sienta tan real como Primera.
- **[GROK]** Completar los **6 rosters faltantes** (MAG, SMA, USF, CUR, SCR, RAN),
  mismo formato que los de `data-b2026.js` (`["Nombre","POS",edad,niv,proy,sueldo,valor,[rasgos]]`).
  Nombres reales documentados; stats estimadas; nunca inventar un nombre como real.
- **[GROK]** (opcional) Fixture real de la B 2026 si se consigue; si no, el generado sirve.
- **[CLAUDE/yo]** Objetivos propios de la B: pelear el ascenso, playoff de liguilla,
  presión distinta del directorio en 2ª. Hooks en `carrera.js` / objetivos.

## Camino B — agregar el 3er nivel real (Segunda División Profesional)
Ojo: en Chile la 2ª es "Primera B" (ya está). La liga llamada **"Segunda División
Profesional" es el 3er nivel** — eso NO existe hoy. Agregarlo = pirámide de 3.
- **[GROK]** Lista de clubes de la Segunda División Profesional 2026 + estadios/ciudad
  + (si se puede) rosters reales. Formato igual a `LIGA_B_2026`.
- **[CLAUDE/yo]** Código, espejando la B: `LIGAS["2026c"]`, entrada en el selector,
  `ligaMod`, y **ascenso/descenso B↔Segunda** (extender lo de 7.41 a 3 niveles).
  Es directo porque la B ya dejó el patrón hecho.

## Recomendación
Camino **A** primero (barato, cierra la B que ya está al 90%). El **B** (3er nivel)
solo si querés la pirámide completa — es más data que código.

---

## Prompt para Grok (Camino A — 6 rosters faltantes)
> Dame los planteles 2026 REALES de estos clubes de la Primera B de Chile:
> Deportes Magallanes, San Marcos de Arica, Unión San Felipe, Curicó Unido,
> Deportes Santa Cruz, Rangers de Talca. Por jugador:
> `["Nombre Apellido","ARQ|DEF|MED|DEL",edad,nivel(40-80),proyección(mismo rango),
> sueldo(10-120),valor(20-400),["rasgos"]]`. 18-22 por club. Solo nombres reales
> documentados (planteles públicos 2026); si no tenés a alguien, lo dejas fuera
> (el juego rellena con cantera). No inventes nombres como si fueran reales.
