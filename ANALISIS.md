# ANALISIS.md — estado real y rumbo (al día · v7.36)

> **LEER PRIMERO.** Refleja el estado real del juego hoy. Para el detalle de
> cada parche, ver `PATCHES.md`. GitHub HEAD de partida: `61958a2` (7.35).
> Esta copia es **7.36**.

## Dónde estamos (v7.36)
7.35 + **jugar se siente jugar**: la previa pone Ver en vivo / Dirigir arriba
(no al fondo del once), el cansancio se ve por cabeza, el árbitro sale con
chip y sesgo, el escritorio pone el partido primero, y una hinchada en crisis
cierra la popular.

| Área | Estado real |
|---|---|
| Motor de partido | Estable (7.30). Rasgos pesan (7.19). Relato con pool beta (7.31). |
| Épocas | 1991, 2026, **2026b (Primera B)**, glorias (U 2011, PAL 1978, EVE 2008, etc.). |
| Planteles B | Los 16 documentados (nombres reales; stats estimadas). Cantera rellena si faltan. |
| Copa Chile 2026 | Grupos A–H reales. Top 2 → octavos: si el club está en el cuadro ANFP 2026, el cruce es el real (CBL–COQ, AUD–CC, etc.). Si no, pareja A↔C / B↔D / E↔G / F↔H. |
| Libertadores 2026 | **Solo COQ (Grupo B) y UC (Grupo D)** a grupos. HUA Fase 2 vs Carabobo. OHI Fase 2 vs Bahia y Fase 3 vs Tolima. Colo-Colo, la U y el resto **no clasificaron**. |
| Sudamericana 2026 | Primera fase: UCH–PAL (5 mar) y COB–AUD (3 mar, Calama). Grupos: PAL F, AUD G, OHI C (drop desde Lib). |
| 2027+ | Si terminas 1–4 o ganas Copa Chile → Libertadores (sorteo del juego). 5–8 → Sudamericana. No se copia un sorteo CONMEBOL que no existe. |
| Objetivos | La B pelea ascenso. Primera 2026 sin cupo pelea Libertadores **2027**. Nadie de Limache ni Cobreloa «clasifica» a la Lib 2026. |
| Ayudante | Compositor local gratis (`informeSemanal` / `preguntarAyudante`). Cero API. |
| DTs B (sep 2026) | Verificados al 8/09: COP Erwin Durán, PMO Emilio Mancilla, TEM Emiliano Astorga, USF Juan José Luvera, SCR Dalcio Giovagnoli. |
| Previa | Clima Vista + canal. CTAs **Ver en vivo / Dirigir** arriba. Chip de árbitro. Cansancio en el XI. (7.36) |
| Celular | Dock Aero + HUD de partido fijo al pulgar (7.34). Barra de jugar sticky. Desktop ≥720px intacto. |
| Vida | 1991 presentaciones · 2004 Messenger · 2012+ Match. Sin -e. (7.35) |
| Contratos | Cláusula de salida con año. Rechazarla enoja al jugador. (7.35) |
| Estadio | Deuda alta clausura sectores. Hinchada < 22 cierra la popular. (7.36) |
| Imágenes | Lista en `img/LEEME.txt`. El usuario sube. |

## Lo que quedó honesto-null (no se inventó)
- Otros partidos del grupo CONMEBOL (los que no juega el jugador) se simulan por fuerza; no se copió el fixture ajeno completo.
- Cuartos en adelante de Copa Chile 2026: procedural (el cuadro real todavía depende de quién gane octavos).
- Si el jugador da vuelta la historia (pasa una fase que en 2026 perdió), el siguiente grupo es sorteo del juego, no un grupo CONMEBOL falso.
- Fotos/escudos oficiales.
- UC 1991 sigue mayormente generado.
- Citas atribuidas a personas reales: cero.
- Fase 7 multi, casino a fondo: no son la beta.
- Árbitros: nombres **ficticios** (nunca silbantes reales).

## Rumbo que sigue (no 7.36)
- Hilos 4–6 de Plop (otro chat en `plop-motor.js`), partir `ui.js`.
- Fotos: las manda el usuario a `img/`.
- `cancha.js` fome (otro chat).
- UC 1991: plantel documentado; el fixture sigue generado.
