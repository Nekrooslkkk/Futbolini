# FUTBOLINI 3.0 — Bitácora de parches

Registro de todo lo que se fue construyendo sobre la Fase A, para tenerlo a mano
en futuras actualizaciones. Cada bloque dice **qué se hizo**, **qué archivos toca**
y **funciones/datos clave**. Al final: cómo **editar planteles** y cómo **encender la IA**.

> Red de seguridad: la carpeta es un repo git. `git log --oneline` lista los commits.
> Para volver al estado anterior a los cambios: `git checkout c29776a -- .`

---

## Mejora 1 · Eventos encadenados (efecto mariposa)
**Archivos:** `motor.js`, `data-eventos.js`, `data-decisiones.js`, `ui.js`
- `encadena:{id,en}` en una opción/desenlace agenda otra decisión N fechas después.
  Cola en `E.pendientesEncadenadas`, madura en `procesarEncadenadas()`.
- Banderas: `flag:"x"` / `flags:{x:true}` en una opción; otros eventos las leen con `peso:E=>E.flags.x?...:0`.
  Acción `limpiaBandera:x` para consumirlas.
- Mala racha: `E.temporada.sinGanar` (cuenta partidos sin ganar); a 4 dispara `enc_racha`.
- Oferta de medianoche antes de semifinal/final → `enc_medianoche` → secuela `enc_factura`.
- Pool de decisiones disparadas: `ENCADENADAS` en `data-eventos.js`.
- Contexto semanal: `eventosDeContexto()` (se llama en `avanzar()`).

## Mejora 2 · Motor de partido
**Archivos:** `partido.js`, `data-liga.js`, `ui-partido.js`
- Penales reales: `cobrarPenal(pateador,arquero)` (~78% base, ajusta por nivel; tope 55–92%).
- Polémica arbitral en minutos calientes: `polemicaArbitral()` (penal dudoso / gol anulado), sesgada por `modSuma("arbitraje")`.
- Clima por fecha: `CLIMAS` + `climaDeFecha(mes)` en `data-liga.js`; `part.clima` afecta cansancio y precisión.
- Atajos de teclado (modo dirigir/seguir): `partidoTeclas()` en `ui-partido.js` — Espacio = pausa, 1/2/3 = orden rápida.

## Mejora 5 · Mercado (base) → **Mercado 2.0**
**Archivos:** `mercado.js` (nuevo), `ui.js`, `index.html`
- Negociación de 4 pilares: precio · sueldo · rol · interés del jugador (`interesJugador`, `clubAcepta`, `cerrarFichaje`).
- **Barras editables** de precio y sueldo (`<input type=range class="rango">`) con lectura en vivo.
- Ofertas entrantes **persistentes** en `E.ofertasPend`, llegan como **notificación accionable** (`generarOfertasSemana()` en `avanzar()`).
- Rechazo con **enfriamiento**: `E.mercadoLog.rechazadas[jid]`; caducan a 3 fechas (`caducarOfertas()`).
- Vender proactivamente: `buscarComprador(j)` (botón en Mercado y en la ficha del jugador).
- Ventana por mes: `mercadoAbierto()` (ene-feb y jun-jul).

## Centro de notificaciones
**Archivos:** `motor.js`, `ui.js`, `index.html`, `css/base.css`
- `notificar({t,d,tipo,acc,extra})` → registro persistente en `E.notifs` (tope 80) + bandeja semanal.
- Campana con badge (`#btnAvisos`) + sección **Avisos** (`vistaAvisos`) con avisos accionables arriba.
- **Todo** rutea por acá: resultados de partido, decisiones, eventos, crisis, copa, mercado, cierre de temporada, retiros, redes, promesas.

## Decisiones · variedad y arreglos
**Archivos:** `data-decisiones.js`, `data-eventos.js`
- 6 decisiones nuevas en `BOLSA`: `b_joya`, `b_sponsor_gris`, `b_dt_ultimatum`, `b_clasico`, `b_estrella_lesion` (+ variantes).
- Reescritos los desenlaces "a media máquina" / "no pasó nada" para que impliquen consecuencia y muevan indicadores.

## Mejora 3 · Sistema de eras (1991 / 2026)
**Archivos:** `data-liga.js`, `data-plantel.js`, `motor.js`, `partido.js`, `ui.js`, `util.js`
- `ERA={1991,2026}` con `puntosVictoria` (2 vs 3) e `inflacion`. `puntosVictoria()` reemplaza los 2 pts hardcodeados.
- `LIGA_2026` (16 clubes reales) + `activarLiga(base)` que setea `LIGA_ACT` y `CLUB_POR_ID` según la época. `baseEra(anio)`, `eraDe(base)`.
- Club por época: `CLUB_INFO_2026`, `IND_BASE_2026`, `CAJA_BASE_2026`; selección en `datosEra(base)` y `nuevaPartida`.
- Planteles 2026 reales (aprox.) en `data-plantel.js`; inflación aplicada a jugadores **generados** (`inflacionEra()`).
- Retiros (edad ≥ 37) + regens de cantera en `nuevoAnio()`.
- Inicio con selección de época (`elegirEpoca`); `vistaHistoria` adaptada para 2026.

## Mejora 4 · Redes del club + roleo (OFFLINE)
**Archivos:** `ia.js` (nuevo), `ui.js`, `ui-partido.js`, `partido.js`, `motor.js`, `index.html`, `css/base.css`
- Sección **Redes** (`vistaRedes`): barra de texto libre + frases predefinidas (`POSTS_PREDEF`).
- Análisis **offline** por palabras clave: `analizarOffline(texto)` → `{sentimiento, promesa, consecuencia}`.
- `aplicarPost(texto,ev)` mueve moral/hinchada/prensa/rep y registra en `E.redes`.
- Promesas públicas con condición (`E.promesas`): "gano o me voy" → `chequearPromesas()` al terminar el partido → si no cumple, `destituir()`.
- Roleo con el capitán antes de finales: `charlaCapitan(tono)` (evalúa según la moral). Botón en Redes y en la previa.
- **Hook de API apagado** (ver abajo).

---

## ✏️ Cómo editar / agregar PLANTELES (fácil, sin tocar lógica)

Todo está en **`js/data-plantel.js`**, arriba del archivo, en arrays. Formato de cada jugador:

```
["Nombre Apellido", "POS", edad, nivel, proy, sueldo, valor, ["rasgo1","rasgo2"]]
```
- **POS**: `"ARQ"`, `"DEF"`, `"VOL"`, `"DEL"`.
- **nivel / proy**: 28–97 (proy = techo del jugador). **sueldo / valor**: en millones (MM$).
- **rasgos**: texto libre; algunos tienen efecto de juego (`"capitán"`, `"ídolo"`, `"penales"`, `"definición"`, `"goleador"`, `"de la cantera"`).

**Editar un plantel 2026:** cambiá el array correspondiente (`PLANTEL_CC_2026`, `PLANTEL_UCH_2026`, `PLANTEL_UC_2026`, `PLANTEL_PAL_2026`).
**Agregar plantel a un club que hoy se genera (ej. Limache 2026):**
1. Creá `const PLANTEL_LIM_2026=[ ... ];` con el mismo formato.
2. En `PLANTELES_REALES`, agregá `LIM:{2026:PLANTEL_LIM_2026}`.
Los huecos hasta 22 jugadores se completan solos con generados.

**Editar clubes de la liga 2026:** `js/data-liga.js` → array `LIGA_2026`
(`{id, n, c, fuerza, aforo, est, ciudad}`). `fuerza` 0–100 calibra el nivel del rival.
**Datos base de un club jugable 2026:** `js/motor.js` → `CLUB_INFO_2026`, `IND_BASE_2026`, `CAJA_BASE_2026`.

> Los 5 clubes jugables son `CC`, `UCH`, `UC`, `PAL`, `LIM`. Mantené esos ids.

> **Pendiente / a mejorar:** hoy los planteles 2026 son *aproximados*. Cuando subas los
> definitivos, se pegan en los arrays de arriba. (Idea futura: pantalla "Editor/Admin"
> para editar planteles dentro del juego y guardarlos en localStorage — pedir si se quiere.)

---

# ─────────────── FUTBOLINI 4.0 (expansión de simulación) ───────────────
Orden de programación acordado: **Pizarra/Timer → Economía/Sliders → Historial → Mercado → Redes.**

## 4.0 · Bloque 1 — Motor de partido fluido + Pizarra libre
**Archivos:** `partido.js`, `ui-partido.js`, `data-decisiones.js`, `css/base.css`
- **Motor por ticks:** `tickPartido(P)` avanza el reloj un poco y devuelve UN evento
  (`gol/golRival/penal/penalRival/tiroLibre/lesion/tarjeta/chance/relato/polemica`).
  Los de acción se devuelven SIN resolver para poder auto-pausar. `correrHasta()` los
  auto-resuelve para el modo Simular.
- **Timer realista + auto-pausa:** `correrEnVivo()`/`pasoEnVivo()` con `setInterval`
  (velocidad `VEL_PARTIDO`, botones Lento/Normal/Rápido + Pausa). En Dirigir se auto-pausa
  en penal (elegís pateador), tiro libre (al arco/centro/corto) y lesión (recambio/aguantar)
  vía `mostrarAccion(ev)`, y en los momentos tácticos vía `mostrarMomento()`.
- **Presión con peso real:** `PRESIONES` ahora trae `recup` (recuperar arriba) y `expo`
  (exponer defensa). En `peligro()` se aplican FUERA del clamp para que pesen; el cansancio
  (`P.cansancio`, drena según `desgaste`) apaga el pressing y agrava la exposición. Barra de
  físico del equipo en pantalla.
- **Pizarra libre:** grilla 5×5 (`PIZ_FILAS/PIZ_COLS`). `pizarraDesdeFormacion(once)` arma el
  default; `formaLibre(piz)` deduce ataque/orden/ancho (permite esquemas asimétricos) y
  alimenta `fuerzaEquipo()`. UI: `modalPizarra(part)` (tocar jugador → tocar celda). Se guarda
  en `E.tactica.pizarra`; "volver a formación clásica" la limpia.
- Guardas anti-crash: `pintarPartido`/`cerrarPartido` chequean `P_ACTUAL` nulo; `P.cerrado`
  evita doble cierre (un solo `terminarPartido` por partido).

## 4.0 · Bloque 2 — Economía viva, sliders e inversiones
**Archivos:** `motor.js`, `ui.js`, `ui-partido.js`, `carrera.js`
- **Capital sin tope:** `aplicarEfectos`/`nuevoAnio`/`evaluarMandato` ya no clampean el capital a 100
  (se guarda y muestra sin techo). Su EFECTO en el motor de decisiones se suaviza con `capEf=Math.min(120,E.capital)`.
- **Sectores del estadio con sliders:** `SECTORES` (galería/tribuna/marquesina, cada uno con cuota, precio
  de referencia y elasticidad). `taquilla(part)` reemplaza al viejo `ingresoPartidoLocal` de 3 tiers.
  `E.precios={galeria,tribuna,marquesina}` (default `preciosDefault()`, escala con `inflacionEra()`).
  UI: sliders en Finanzas con **proyección en vivo** (`proyeccionTaquilla`) — público, % de aforo e ingreso.
- **Deuda con impacto real:** en `tickSemana`, si la caja no cubre planilla → `flags.sueldosAtrasados`
  (moral cae semana a semana + aviso); deuda > 4000 → `flags.clausura` + `clausuraFactor()` baja el aforo/taquilla.
  Precios altos/baratos derivan la hinchada (`precioPromedioRatio()`).
- **Inversiones** (panel en Finanzas): mejorar estadio, campaña de propaganda, y **contratar Community Manager**
  (`E.staff.cm`) — el CM se usará en el bloque de Redes.
- Nota: el viejo `E.precioEntrada` quedó obsoleto (se mantiene por compatibilidad, ya no se usa).

## 4.0 · Bloque 3 — Historial, tablas y efemérides
**Archivos:** `motor.js`, `partido.js`, `ui.js`, `ui-partido.js`
- **Tablas históricas:** `E.historialAnual` (copia profunda de la tabla final + goleador por año), se llena en
  `finDeTemporada` vía `guardarHistorial()`. UI: panel "Temporadas jugadas" en `vistaHistoria` +
  `modalTablaHistorica(h)` para ver la tabla final de cada año. `tablaOrdenada()` centraliza el orden.
- **Resultados de la fecha + tabla al día:** `simularResto` guarda los otros partidos en `E.ultimaFecha`;
  `terminarPartido` devuelve `posAntes`/`posDespues` (salto de posición) y `golesDetalle`/`tarjetas`/`lesionados`.
- **Caja de resumen (efemérides):** `cerrarPartido` muestra goles con minuto y autor, tarjetas, lesiones,
  hitos (`hitosPartido`: manita, goleada, valla invicta, hat-trick/doblete, gol de juvenil), salto de posición,
  otros resultados de la fecha y una mini tabla (top 5 + tu posición). `regGol()` captura goles con minuto.
- **Prensa manual/automática:** `E.prensaAuto` (toggle en el post-partido). Manual → mini-decisión contextual
  (`opcionesPrensa` por resultado); automático → el ayudante resuelve neutral. `seccionPrensa(p,res)`.

## 4.0 · Bloque 4 — Mercado de fichajes profundo
**Archivos:** `mercado.js`, `motor.js`, `partido.js`, `ui.js`
- **Panic sell:** `ventaFlash(j)` vende YA por 40-55% del valor con castigo de directorio/credibilidad
  (hinchada extra si es referente). Botón "Rematar" en Mercado y en la ficha del jugador.
- **Préstamos:** estado `j.cedido={desde,hasta,club}`. `cederPrestamo(j)` (juveniles ≤23, `puedeCeder`);
  vuelven en `nuevoAnio` con `+ri(3,8)` de nivel. Los cedidos NO cuentan en `onceIdeal`/`planillaAnual`/`mediaPlantel`.
  Panel "Cesiones a préstamo" en Mercado + botón en la ficha; marca 🔄 en el plantel.
- **Lluvia de ofertas:** `generarOfertasSemana` refactorizada (`crearOfertaEntrante`): ~62% por semana en
  ventana (con chance de una segunda) vs ~18% fuera.
- **Negociación en 2-3 pasos:** `modalComprar` ahora es por etapas — tu oferta (sliders) → contraoferta del
  club/jugador → aceptás / insistís (suben la vara, a las 3 rondas se levantan) / te retirás.

> Nota de testing: el navegador MCP CACHEA los `.js` por origen. Para verificar cambios, usar un
> puerto nuevo (`python -m http.server 889X`) o cache-bust; el harness de Node siempre lee los archivos reales.

## 4.0 · Bloque 5 — Redes sociales procedural  ✅ (cierra el 4.0)
**Archivos:** `js/redes.js` (nuevo), `ui.js`, `motor.js`, `partido.js`, `mercado.js`, `ia.js`, `index.html`
- **Timeline procedural** (`E.timeline`): hinchas/prensa/jugadores/club postean solos vía `redesReaccion(tipo,data)`,
  enganchado en resultados (`terminarPartido`), fichajes (`cerrarFichaje`), ventas (`ventaFlash`/`responderOferta`)
  y precios (slider de Finanzas). UI: panel "Timeline" en `vistaRedes`. Los posteos del DT (ia.js) también entran.
- **Seguidores** (`E.seguidores`): suben con victorias/fichajes/buenas campañas, bajan con derrotas/ventas de ídolos/precios altos.
- **Community Manager** (`E.staff.cm`, se contrata en Finanzas): `campanaCM("humo"|"serio")` — humo sube hinchada/seguidores
  a costa de credibilidad; serio suma credibilidad. Botones en `vistaRedes`.
- **Sponsor digital**: `ingresoDigital()` = 2% de los seguidores/año (solo con CM), entra en `ingresosAnuales`/`ingresoSemanal`.

## ✅ ROADMAP 4.0 COMPLETO (Bloques 1-5). Próximas mejoras: las que definas / la lista pendiente del usuario.

---

## 🔌 Encender la IA (queda APAGADA por defecto, no gasta nada)

Todo el hook está en **`js/ia.js`**. Para activarlo cuando haya backend con llave:

```js
IA_CONFIG.activa   = true;
IA_CONFIG.endpoint = "https://tu-backend/evaluar"; // NUNCA pongas la API key acá
```

El juego hará `POST` a ese endpoint con:
```json
{ "tarea":"post_red_club", "club":"...", "texto":"...", "contexto":{...} }
```
y espera de vuelta:
```json
{ "sentimiento": -100..100, "promesa": {"hay":true,"texto":"...","tipo":"...","castigo":"destitucion|reputacion"} , "consecuencia":"texto corto" }
```
- La **llave de la API vive en el backend**, nunca en el HTML.
- Si `IA_CONFIG.activa` es `false` o el endpoint falla, cae automáticamente al análisis **offline** (nunca se rompe ni gasta).
- Función que decide: `evaluarPost(texto)` → usa API si `iaDisponible()`, si no `analizarOffline()`.

---

## 🧪 Testing
Hay un harness de Node que corre la lógica sin navegador (no está en el repo del juego,
vive en la carpeta scratchpad de la sesión). Carga los archivos de `js/` que no tocan el
DOM y permite simular temporadas completas. Para probar en el navegador:
```
python -m http.server 8891
```
y abrir `http://localhost:8891/`.

---

# ─────────────── PULIDOS POST-4.0 ───────────────

## Pulido v1 · Narrativa, ventas y Aero XP (2026-08-14)
**Archivos:** `js/redes.js` (reescritura), `js/mercado.js` (`ventaFlash`, `responderOferta`), `css/aero.css`
- `redesReaccion("venta")` con ramas: flash+ref / flash / ref mixto / normal / veterano. Ya no siempre "amurrado".
- Timeline más denso: más handles, frases contextuales en partido/ficha/precio, likes por tipo de autor.
- Notificaciones de venta varían por referente y edad (≥32 = ciclo natural).
- Aero: bordes duros + inset shadow estilo Luna/XP, botones con `:active`.

## Pulido v2 · Motor de partido narrativo (2026-08-14)
**Archivos:** `js/partido.js` (`tickPartido`, nuevas `fraseChance`/`fraseRelato`), `js/ui-partido.js` (reloj)
- Chance y color dejan de ser frases fijas: miran marcador, minuto, cansancio y clima.
- Más densidad de relato (0.18 vs 0.12) → menos ticks “vacíos” en modo dirigir/seguir.
- Reloj muestra 1T / 2T / FT.
- No se tocó la firma de `tickPartido` ni el loop de auto-pausa (penal/tiro libre/lesión).

## Pulido v3 · Ofertas con contraoferta + momentos tácticos (2026-08-14)
**Archivos:** `js/mercado.js` (`responderOferta` modo aceptar/contra/rechazar), `js/ui.js` (`tarjetaAviso`), `js/partido.js` (`momentoActual`), `js/ui-partido.js`
- Avisos y Mercado: 3 botones — Aceptar / Pedir más plata / Rechazar.
- Contraoferta: 42% suben 12-22%, 30% se mantienen, 28% se retiran ofendidos. Una sola contra por oferta (`of._contraHecha`).
- Momentos tácticos: 4ª opción de “confiar en el plan” en cada situación (menos sensación de solo reaccionar a botones).
- Teclas 1-4 ya soportadas por el handler existente.

## Pulido v4 · Textos editables (decisiones + eventos) (2026-08-14)
**Archivos:** `js/data-decisiones.js`, `js/data-eventos.js`
- Guía de edición al tope de cada archivo (campos, tokens, dónde va cada cosa).
- PLANTILLA copy-paste para decisiones nuevas y para crisis/encadenadas.
- Índice de todos los ids (DECISIONES, BOLSA, EVENTOS, CRISIS, ENCADENADAS).
- Marcadores `/* --- id | buzon | mes --- */` antes de cada bloque para buscar rápido.
- **No se cambió ningún campo ni lógica del motor** — solo organización y comentarios.

## Fix · Empezar partida (2026-08-14)
**Archivos:** `js/ui.js` (`elegirEpoca`)
- try/catch al armar briefing y al pulsar «Empezar».
- Si falla, muestra el error en aviso y en consola; no cierra el modal a ciegas.
- Orden: `nuevaPartida` primero → validar `E` → `cerrarModal` → `render`.
