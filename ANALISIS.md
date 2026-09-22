# ANALISIS.md — estado real y rumbo (al día · 7.9013)

> **LEER PRIMERO.** Refleja el estado real del juego HOY, medido, no de memoria.
> El detalle parche por parche vive en `PATCHES.md`. La coordinación con Grok, en
> `ChatDeTrabajIA.md` (canal único). La wishlist del autor, en `IDEAS.md`.
>
> Versión de trabajo: **7.9013**. `VERSION` en `js/util.js` la sube Grok (hoy va en `"7.9010"`).

## Qué es, en una línea
Simulador de conducción de clubes de fútbol chileno (y argentino). **No es satírico**: es
realista y crudo sobre en qué te podés convertir manejando poder, y sobre el costo personal.
Vanilla JS ES6, sin build, sin npm, sin frameworks — internet sí (CDN sin copyright), pero el
jugador tiene que poder descargarse el estado y jugar offline. Todo el estado cuelga del global `E`, persistido con `Store`.
Se abre con `index.html` o `python -m http.server`.

## Cómo se trabaja
Tres manos sobre `main`, en paralelo: el autor (Vicente), **Grok** (motor, partido, mercado,
planteles, datos) y **Claude** (UI, escritorio, editor/dev, QA, i18n, CSS, federación).
Los carriles y lo que cada uno no toca están escritos en `ChatDeTrabajIA.md`.

## Estado por área (medido en 7.9013)

| Área | Estado real |
|---|---|
| Motor de partido | Estable. Córner aéreo, palo con rebote y tanda de penales (Grok, 7.9005–7.9009). |
| Mercado | Abierto todo el año, con preacuerdos y CPUs que envejecen (Grok, 7.9010). |
| Jornada | La fecha se juega a la vista: otros resultados uno a uno + movimiento de tabla (7.9011). |
| Preguntas / prensa | 142 preguntas nuevas, rotación por semana, banco por país y por época (7.9012). |
| Mundo de fondo | Poda por año: en 1991 ya no aparecen torneos ni clubes de 2026 (7.9013). |
| Federación | Motor completo + **cara**: escalera local → CONMEBOL → FIFA y guerra de asociaciones (7.9013). |
| Épocas jugables | 1925, 1991, 2006, 2026 (+ B y Segunda), arg2026, y el histórico CC 1989→2008. |
| Ligas clonadas | `devClonarLigaRigor` llega a 100% de rigor y es jugable (Grok cerró el motor en 7.9001–7.9002). |
| Editor / dev | Pestañas de esquema, auditor, clonado, **Alma** (cobertura) y generador de decisiones. |
| Pruebas | `test/correr.sh` **1047/1047** (Grok) · `test/correr_dev.sh` **276/276** (Claude). |

## El cuello de botella real: CONTENIDO, no código
Medido con `devInformeCobertura()` (pestaña 📚 Alma del editor). La vara es Colo-Colo.
`total = decisiones propias del club + arcos de club`; rico ≥6, medio ≥2, pobre <2.

| Corte | Total dirigibles | Ricos | Medios | Pobres | % ricos |
|---|---|---|---|---|---|
| Antes de 7.9013 | 76 | 1 (solo CC, 16) | 52 | **23** (todos AFA, 1 ítem c/u) | 1% |
| Después de 7.9013 | 76 | 1 | 75 | **0** | 1% |

Lectura honesta: 7.9013 **sacó a todos los clubes de la pobreza** (un arco de 2 capítulos y una
decisión propia para los 23 de la AFA, en `js/data-alma-arg.js`), pero el **% de ricos sigue en 1%**:
para que un club sea "rico" necesita 6 ítems propios y hoy solo Colo-Colo los tiene. El segundo
es CBL con 4 y el tercero UCH con 3.

**Eso es lo que separa al juego de su propia vara.** No falta motor: falta alma por club y por año.
El camino corto para mover la aguja es subir a 6 ítems los ~15 clubes más jugados (los grandes de
Chile y Argentina), no repartir uno a cada uno.

## Deuda técnica viva
- `VERSION` (`js/util.js`) quedó en `"7.9010"`: solo Grok toca ese archivo.
- `ARCOS_EQUIPO` se mergea con `if(!ARCOS_EQUIPO[id])` en varios archivos: el primero que carga gana.
- El mundo modelado (`E.mundo`) es de 2026. Fuera de la era moderna se poda y se avisa; **no** hay
  mundo histórico modelado y eso está declarado, no disimulado.
- `mundo-vivo` cuenta lo que pasa afuera pero **no mueve planteles CPU**: es capa de lectura.
- Un wrap sobre otro wrap borra las marcas del anterior: hay que heredarlas (ver `_epHeredar`).

## Rumbo
1. **Alma por club y por año** — la idea "rigor Colo-Colo en cada club, en cada época".
2. **Victoria III**: la escalera de poder ya se ve; falta el mapa mundial y la FIFA jugable.
3. Ordenar las ventanas que faltan (Grok: finanzas, estadio, redes, historia, carrera, institución).

**Esto no es la 8.00.**
