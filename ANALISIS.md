# ANALISIS.md — estado real y rumbo (al día · v7.32)

> **LEER PRIMERO.** Refleja el estado real del juego hoy. Para el detalle de
> cada parche, ver `PATCHES.md`. GitHub HEAD de partida: `d3e9e1b` (7.31).
> Esta copia es **7.32**.

## Dónde estamos (v7.32)
Motor 7.30 + contenido 7.19 + GROK_PROMPT_BETA (7.31) + **Copa Chile que
clasifica de verdad**, gadget de clima Vista, canal de TV, prensa atada a
indicadores, arcos de CBL/IQQ/PMO/MAG/REC.

| Área | Estado real |
|---|---|
| Motor de partido | Estable (7.30). Rasgos pesan (7.19). Relato con pool beta (7.31). |
| Épocas | 1991, 2026, **2026b (Primera B)**, glorias (U 2011, PAL 1978, EVE 2008, etc.). |
| Planteles B | Los 16 documentados (nombres reales; stats estimadas). Cantera rellena si faltan. |
| Copa Chile 2026 | Fase de grupos (6 partidos, grupos A–H reales). **Si terminas top 2, entran octavos** (procedural: A↔B, C↔D, E↔F, G↔H; 1° vs 2°). No es el bracket real 2026. |
| Libertadores 2026 | Formato documentado. **Grupos no inventados.** 1991 CC intacta. |
| DTs B (sep 2026) | Verificados al 8/09: COP Erwin Durán (Almandoz salió el 7/09), PMO Emilio Mancilla, TEM Emiliano Astorga, USF Juan José Luvera, SCR Dalcio Giovagnoli, RAN Ivo Basay, UES Ronald Fuentes, IQQ Hernán Peña. |
| Previa | Gadget de clima (desgaste/precisión) + canal de TV (1991 Canal 13/TVN; 2026 TNT Sports según prestigio). |
| Prensa | Preguntas extra si hay deuda alta, caja justa, moral baja o hinchada tibia/caliente. |
| Redes / voz | Pools grandes + Plop 7.29/7.30. Tuits `aburrido`/`autogol`/`var`. |
| Economía | Deuda con cuotas (7.19 sobre 7.30). |
| Imágenes | Lista en `img/LEEME.txt`. El usuario sube. |

## Lo que quedó honesto-null (no se inventó)
- Octavos de Copa Chile **no copian el cuadro real 2026** (el jugador puede no clasificar; el rival se estima por fuerza del grupo pareja).
- Grupos de Libertadores 2026 para una carrera nueva.
- Fotos/escudos oficiales.
- UC 1991 sigue mayormente generado; varios 1991 de B-históricos también.
- Citas atribuidas a personas reales: cero.
- Fase 7 multi, Tinder/casino, IA de pago: congelados.

## Rumbo que sigue (no 7.32)
- Hilos 4–6 de Plop, cláusulas con fecha, partir `ui.js`.
- Fotos: las manda el usuario a `img/`.
- `cancha.js` fome (otro chat).
- Libertadores 2026 grupos: cuando existan de verdad, cablearlos; no inventarlos.
