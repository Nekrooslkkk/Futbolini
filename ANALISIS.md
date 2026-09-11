# ANALISIS.md — estado real y rumbo (al día · v7.52)

> **LEER PRIMERO.** Refleja el estado real del juego hoy. Para el detalle de
> cada parche, ver `PATCHES.md`. HEAD: `e7d1b70` (7.52).

## Actualización 7.48–7.52 (Claude)
- **7.48** Más contextos generativos de Plop! (tiro libre, atajada de penal, lesión, debut).
- **7.49** **Segunda División Profesional (3er nivel)** jugable: 14 clubes reales (`data-segunda2026.js`), rosters cantera.
- **7.50** **Ascenso/descenso de 3 niveles** Primera ↔ B ↔ Segunda.
- **7.51** FIX: la Segunda recibía el calendario de Primera → arreglado (round-robin propio); esto rompía el avance post-partido.
- **7.52** Botón Avanzar: confirma antes de cerrar la temporada (avance irreversible).
- **Pendiente:** planteles reales de Segunda (Grok, ver `GROK_TAREAS.md`), formato grupos+liguilla, Copa de la Liga/Supercopa.

## Dónde estamos (v7.44)
Claude avanzó **7.37–7.43** (casino tragamonedas, pistas del ayudante, conferencia libre,
jugadas de poder, **ascenso/descenso Primera↔B**, Copa Chile todos los años, escudos
estilizados en selector/tabla/calendario). No subió el número de versión: quedó en 7.36
hasta este parche.

**7.44** ejecuta `GROK_PROMPT_HISTORIAS`: línea de tiempo de los 32, épocas extra,
escenarios futuros, arcos que faltaban y más voz. Prompts ya usados: **borrados**.

| Área | Estado real |
|---|---|
| Motor de partido | Estable (7.30). Relato con pool beta + hist (7.44). |
| Liga | Primera + B conectadas: 1 baja, 1 sube (7.41). Copa Chile todos los años. |
| Libertadores 2026 | Solo COQ (B) y UC (D) a grupos. El resto, no. |
| Épocas | 1991, 2026, 2026b + glorias previas **y** LIM 2025, CBL 2003, SW 2019, UES 2005, IQQ 2014, USF 2009, MAG 2023, CUR 2017, ANT 2018. |
| Historia | Línea de tiempo por club (hechos públicos) en la vista Historia. |
| Futuro | 2030–2226: escenarios generativos al pasar de año. No son hechos. |
| Escudos | SVG estilizado por código (32 clubes). No oficiales. |
| Celular | Dock + HUD (7.34). Previa Ver en vivo / Dirigir (7.36). |
| Institución | Jugadas de poder con capital (7.40). Pistas 3/año (7.38). |
| Casino | Ruleta + blackjack + tragamonedas, monto exacto (7.37). |
| Imágenes | Lista corta en `GROK_PROMPT_HISTORIAS.md`. El usuario sube. |

## Lo que quedó honesto-null
- Planteles de las épocas nuevas **sin lista documentada**: cantera. No se inventan nombres como reales.
- Fotos/escudos oficiales: no. Estilizados sí.
- UC 1991: plantel documentado; fixture sigue generado.
- Citas a personas reales: cero.
- Fase 7 multi: congelado.
- `cancha.js` / hilos Plop: otro chat.

## Rumbo que sigue
- Fotos de estadio con licencia libre (el usuario o Grok con Commons).
- Hilos 4–6 de Plop (`plop-motor.js`), partir `ui.js`.
- UC 1991 fixture real.
