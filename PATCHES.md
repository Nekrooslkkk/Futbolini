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

# ─────────────── FUTBOLINI 5.0 (Beta jugable) ───────────────
Orden: 6 bloques. Ejecución incremental. Estado global nuevo en normalizarEstado (motor.js):
E.perfil, E.dinastia, E.personal, E.flags.desfalco.

## 5.0 · Bloque 1 — Vida social, perfil y dinastía  ✅ (2026-08-15, autónomo)
**Archivos:** `js/reputacion.js` (nuevo), `motor.js`, `ui.js`, `index.html`, `css/aero.css`
- **Estado**: `E.perfil{nombre,nacimiento,avatar,orientacion,vidaSocial{publica,agenda[]}}`,
  `E.dinastia{generacion,linaje,limiteAnio:2100,historial[],sucesionPendiente}`,
  `E.personal{bolsillo,propiedades[],autos[]}`, `E.flags.desfalco=0`. Se inicializan en `normalizarEstado`
  (y `nuevaPartida` ahora la llama al final).
- **Perfil Aero** (`vistaVida`, sección "Vida" 🪪): ventana `.aero-window` con `.aero-avatar` (emoji ciclable),
  nombre/fecha de nacimiento (edad derivada)/orientación editables. `edadDT()`.
- **Vida social**: `salir()` → `resolverSalida(ev,modo)`. Pública sube prensa/pública con ~28% de filtración
  (escándalo + post de prensa); privada cuesta `E.personal.bolsillo` y bloquea prensa. Agenda en `E.perfil.vidaSocial.agenda`.
- **Dinastía**: `chequearSucesion()` en `nuevoAnio` (muerte/retiro por edad ≥74 con prob creciente, tope 90;
  año > limiteAnio → `finDeCarrera`). `sucesionPendiente` → `pantallaSucesion()` (guard en render, antes de enParo) →
  `asumirSucesor()` (gen++, conserva apellido/linaje/patrimonio/historia; hereda bolsillo; edad ~30).
- Verificado: harness (estado, salidas, sucesión con herencia, horizonte 2100, envejecimiento) + UI + regresión 4.0 sin errores.

## 5.0 · Pendiente
- **B2** Casino + corrupción/desfalco + redención (`js/casino.js`).
- **B3** Ticker de redes en vivo durante el partido.
- **B4** Paneles institucionales + conferencias de prensa interactivas.
- **B5** Modo histórico Colo-Colo 1989/1991→2008 (selector de inicio, línea temporal continua, hitos: quiebra 2002, camada Borghi 2006-07).
- **B6** Registro de goles completo (asistencia/tipo), filtros de mercado, timer 1x/2x/4x configurable.

## 5.0 · Bloque 2 — Casino, corrupción y redención  ✅ (2026-08-15)
**Archivos:** `js/casino.js` (nuevo), `motor.js`, `ui.js`, `data-eventos.js`, `index.html`
- **Casino** (`js/casino.js`): ruleta europea con odds reales (`APUESTAS_CASINO`, ventaja de casa ~2,7% verificada).
  `girarRuleta(apId,monto,pleno)` mueve `E.personal.bolsillo`. UI `modalCasino()` + `panelCasino()` (sección Vida).
- **Desfalco**: `desviarFondos(monto)` transfiere de `E.plata` (club) a `E.personal.bolsillo`, sube `E.flags.desfalco`
  y `E.ind.riesgo`. Se ofrece cuando `bolsillo<=0` (en Casino/Vida). `modalDesviar()`.
- **Auditoría**: `chequearDesfalco()` (semanal, en `avanzar`) — prob. crece con lo desviado y baja con credibilidad;
  dispara la encadenada `enc_investigacion_dirigencial` (data-eventos.js, 3 respuestas: colaborar / dilatar con imagen / negar).
  Acciones `cierraInvestigacion` y `limpiaDesfalco` en `ejecutarAccion`.
- **Redención** (`panelDesfalco()` en Finanzas, solo si hay desfalco): `procesoRedencion("devolver")` (monto ×1.2, cierra causa,
  sube credibilidad) o `("donar")` (donaciones comunitarias, cierra causa, sube comunidad). Ambas limpian `E.flags.desfalco`
  e `investigacionAbierta` → sin callejón sin salida.
- Verificado: harness (RTP ruleta, desvío, auditoría, decisión, redención) + UI + regresión 4.0/5.0-B1 sin errores.

## 5.0 · Bloque 6 — Motor, registro y mercado  ✅ (2026-08-15)
**Archivos:** `partido.js`, `ui-partido.js`, `mercado.js`, `motor.js`
- **Registro de goles completo:** `regGol(P,min,quien,propio,tipo,asist)`. Tipos: `jugada` (con **asistencia** ~60%),
  `penal`, `tiro libre`, `cabeza` (centro en dirigir), `autogol` (raro, ambos arcos, en `tickPartido`). El resumen
  post-partido muestra `[tipo]` y `(asist. X)`.
- **Filtros de mercado:** en "Objetivos" — Posición (ARQ/DEF/VOL/DEL), Jóvenes (≤23), Dentro de mi caja. `MERC_FILTRO`.
- **Timer 1x/2x/4x** (relabel de VEL_PARTIDO 420/240/110) + **auto-pausa configurable** (`E.config.autoPausa`, toggle en
  controles de Dirigir): con OFF, penal/tiro libre/lesión se resuelven solos sin frenar el partido.
- Verificado: harness (tipos de gol, asistencia 59,6%, filtros, config) + UI + regresión sin errores.

## ✅ FUTBOLINI 5.0: Bloques 1, 2 y 6 hechos. Pendientes: B3 (ticker en vivo), B4 (institución + conferencias), B5 (histórico 1989→2008, best-effort con datos a validar).

## 5.0 · Bloque 3 — Ticker de redes EN VIVO (FutbolGram)  ✅ (2026-08-15)
**Archivos:** `js/redes.js`, `ui-partido.js`, `partido.js`, `css/base.css`
- `tickerPost(P,ev)` (redes.js): genera posts cortos de hinchas/prensa por cada tick del partido según el evento
  (gol, gol rival, penal/penal rival, tiro libre, tarjeta, lesión, polémica, chance). Se acumulan en `P.ticker`
  (feed local del partido, no toca E.timeline).
- Hook en `pasoEnVivo` (después de `tickPartido`). `P.ticker` se inicializa en `iniciarPartido`.
- Render en `pintarPartido`: sección "📱 FutbolGram · en vivo" con los últimos posts (solo modos Seguir/Dirigir). CSS `.ticker/.tk`.
- Verificado: harness (genera por tipo de evento, se puebla en vivo) + UI + regresión sin errores.

## 5.0 · Bloque 5 — Modo histórico Colo-Colo 1989→2008  ✅ (2026-08-15)
**Archivos:** `data-plantel.js`, `data-eventos.js`, `motor.js`, `ui.js`
- **Planteles históricos reales** (stats estimadas): `PLANTEL_CC_1989`, `PLANTEL_CC_2002`, `PLANTEL_CC_2006`
  (en `PLANTELES_REALES.CC` bajo 1989/2002/2006/2007). Datos cruzados aportados por el usuario (fuentes públicas).
  Joyas con proyección alta para ventas (Margas 92, Bravo 94, Vidal 96, Alexis 97, Matías F. 95).
- **Selector de punto de inicio** (en `elegirEpoca`, solo CC época 1991): **1989 "La Reconstrucción"** o
  **1991 "La Gloria Libertadores"**. `anioInicio`. 1989 arranca sin Copa (calendario solo liga), eraBase 1991 (2 pts).
- **Línea temporal continua**: se juega año a año (nuevoAnio). Verificado 1989→2007 sin crashes.
- **Hitos**: crisis `cr_quiebra` (solo CC, año 2002 — administración judicial, 3 caminos: vender canteranos /
  convenio / resistir); evento `ev_camada` + acción `camadaBorghi` (CC 2006-2008: inyecta a Fernández, Vidal,
  Alexis, Valdivia, Suazo si no están, +cantera).
- Verificado: harness (planteles, quiebra por club/año, camada, timeline continua) + UI (selector) + regresión OK.

## FUTBOLINI 5.0: B1·B2·B3·B5·B6 hechos. Falta solo **B4** (paneles institucionales + conferencias de prensa).

## 5.0 · Bloque 4 — Institución profunda + conferencias de prensa  ✅ (2026-08-15)
**Archivos:** `data-grupos.js`, `motor.js`, `ui.js`, `ui-partido.js`
- **Interacción directa** (`INTERACCIONES` en data-grupos.js): panel en Institución con acciones por actor
  (Barra brava, Directorio, Prensa, Ex-jugadores, Anónimos). `aplicarInteraccion(op)` cobra capital/plata,
  mueve grupos/rep/ind/flags. Anónimos → `soploAnonimo()` (útil / humo / trampa).
- **Conferencia de prensa PRE-partido** (`modalConferencia` en ui-partido.js): botón en la previa, 3 respuestas
  (humildad / confianza / palo al rival-árbitros) que mueven prensa/credibilidad/hinchada/moral. Una por fecha
  (`E.flags["conf_"+idx]`, se limpia en `nuevoAnio`). La conferencia POST ya existía (seccionPrensa).
- Verificado: harness (interacciones, costos, soplo, limpieza de flags) + UI + regresión OK.

# ═══════════ FUTBOLINI 5.0 COMPLETO (Bloques 1-6) ═══════════
B1 Vida/Perfil/Dinastía · B2 Casino/Corrupción · B3 Ticker en vivo · B4 Institución/Prensa ·
B5 Histórico 1989→2008 · B6 Motor/registro/mercado. Todo verificado, regresiones sin errores.

## 5.0 · Vida 2.0 — pulido de la sección Personal  ✅ (2026-08-15)
**Archivos:** `reputacion.js` (reescritura), `motor.js`, `css/aero.css`
- **Avatares tipo MSN/Vista**: esferas vidriosas 3D en CSS (`.aero-orb` + colores `orb-azul/verde/celeste/morado/naranja/rosa`).
  Se quitaron todos los emojis del avatar SALVO los lentes 😎. Migración automática en `normalizarEstado`. `pintarAvatarBtn`.
- **Nombre heredado**: `E.dinastia.raiz` + `nombreGeneracion(raiz,gen)` → Juan → **Juan Jr.** → **Juan III** → **Juan IV**…
  (`romano()`). El retiro es **por edad, NO muerte** (textos y panel `pantallaSucesion` reformulados a "se retira").
- **Dinero personal que se mueve**: `ingresoPersonalSemanal()` (sueldo del cargo, escala con prestigio/títulos/generación)
  entra al `E.personal.bolsillo` en `tickSemana`. Gastos: salidas, casino, citas, lujos.
- **Tinder / parejas** (`CANDIDATOS` pool DIVERSO y respetuoso — mujer/hombre/no binarie/trans/travesti, todes escrites
  con la misma picardía, nadie es el chiste): `modalTinder` (deslizar Paso/Me gusta) → `likeCandidato` (match) →
  `invitarSalir` (cita → `E.perfil.pareja`, o infidelidad si ya tenés pareja) → `romperPareja`. Pareja estable baja el
  riesgo de escándalo en salidas.
- **Lujos** (`LUJOS`): propiedades/autos que cuestan bolsillo y dan estatus (`comprarLujo`, `E.personal.propiedades/autos`).
- Verificado: harness (nombre heredado, sucesión, dinero, tinder→pareja→ruptura, lujos, pool) + UI + regresión sin errores.

## Motor de variedad — decisiones procedurales + tácticas ampliadas  ✅ (2026-08-17)
**Archivos:** `js/data-proc.js` (nuevo), `data-decisiones.js`, `motor.js`, `ui.js`, `partido.js`, `mercado.js`, `index.html`
- **Decisiones procedurales** (`DEC_PROC`, 8 plantillas): renovación, rumor de salida, conflicto entre dos jugadores,
  indisciplina, juvenil pide minutos, marca de imagen, bajón de forma, la hinchada canta por un ídolo. Cada una toma
  jugador(es) AL AZAR del plantel (`jugAzar`) → el sujeto varía (ya no siempre el mismo). `generarDecisionProc()` crea
  una instancia única en `E.decProc[id]`; `sembrarDecisionProc()` la siembra en `avanzar` (~cada 2 semanas, tope 2
  simultáneas). `decisionPorId` la encuentra; `resolverDecision` la limpia; `nuevoAnio`/`normalizarEstado` la resetean.
- **Tácticas de partido ampliadas**: `TACTICAS_INICIO/ABAJO/ARRIBA/EMPATE` (8 opciones c/u con efectos distintos);
  `momentoActual` elige 4 al azar → variedad en cada partido (presión asfixiante, doble 9, congelar ritmo, gambeteador,
  centros, contención, etc.), no solo "aguantar".
- **Ofertas de mercado más variadas**: peso de `crearOfertaEntrante` aplanado → reciben ofertas más jugadores, no siempre el crack.
- Verificado: harness (17 jugadores distintos citados, 8 tácticas, siembra con tope, limpieza) + UI + regresión sin errores.

## 5.0 · Vida 3.0 — vida personal con profundidad (mejor que EA/FIFA)  ✅ (2026-08-17)
**Archivos:** `reputacion.js`, `motor.js`, `ui.js`
- **La relación EVOLUCIONA**: `E.perfil.pareja.nivel` (0-100) sube con `citaConPareja()` y se enfría solo en `tickSemana`
  (más lento si `casades`). Nivel bajo → crisis/ruptura. `casarse()` (nivel≥60) afianza y da imagen pública.
- **Familia → dinastía**: `tenerHijo()` (el primogénito hereda el nombre = `nombreGeneracion`, ej. "Juan Jr."). En
  `asumirSucesor()` el heredero es tu **hije mayor** (nombre real) con bonus de capital/imagen; si no tuviste, cae al Jr./III.
  `pantallaSucesion` muestra "tu hije, criade en el club".
- **Bienestar / estrés** (`E.perfil.bienestar` 0-100): deriva y baja con mala racha (`tickSemana`); `tomarRespiro()` lo sube.
  Barra en el perfil.
- **Eventos de vida procedurales** (`VIDA_PROC`, 9): viejo amigo pide plata, ex reaparece, paparazzi, susto de salud,
  premio, familiar en apuros, negocio dudoso, crisis de mediana edad, adoptar un perro. `dispararVidaProc()` en `avanzar`
  (~1/7 semanas) abre `modalVidaProc`.
- Verificado: harness (relación, casarse, hije heredere, bienestar, tickSemana, 9 eventos) + UI + regresión sin errores.

## 5.0 spec · lenguaje estándar + orientación en Tinder + Modo Dios  ✅ (2026-08-17)
**Archivos:** `reputacion.js`, `motor.js`, `ui.js`
- **Sin lenguaje inclusivo**: se pasó todo a español estándar (hije→hijo, heredere→heredero, etc.), por pedido del usuario.
- **Filtro de orientación en Tinder** (Hetero/Gay/Bi/Libre) + Género (Hombre/Mujer) en el perfil: `generoCandidato`,
  `candidatoPasaFiltro`, `generarTinder` filtra el pool. La diversidad (trans/travesti/no binario) se mantiene presente.
- **Modo Dios (panel de cheats)** en Ajustes (`E.flags.modoDios`): caja/bolsillo/capital/deuda/riesgo, plantel +5,
  moral/hinchada, curar lesionados, grupos +30, bienestar, inyectar decisión procedural / evento de vida / título.
- Verificado: harness (filtro por orientación con diversidad) + UI (cheats operativos) + regresión sin errores.

## 5.0 spec · PENDIENTE (próximas pasadas, una por turno)
- **Aero visual Vista/7** (CSS grande): botones glossy con corte especular, barras de título degradado azul, progress bars
  animadas estilo copia de Windows, radios 4-8px, pizarra táctica tipo WMP11/Wii. (Alto impacto, hacer con screenshot.)
- **3 pilares de decisión con color** ([DEPORTIVO] verde / [PERSONAL] azul / [EJECUTIVO] dorado) + post-partido fuerza uno DEPORTIVO.
- **Diálogo/negociación con jugadores** (Persuadir/Prometer/Forzar/Convencer) con severidad de color en botones.
- **Bolsa de valores del club** + finanzas avanzadas (gastos delegables, flujo de caja).
- **Blackjack** en el casino. **Redes en 2 pestañas** (club oficial vs perfil personal del DT).

## 5.0 spec · Estética Windows Vista/7 (Aero Glass)  ✅ (2026-08-17)
**Archivos:** `css/aero.css` (bloque Vista/7 al final, override del tema aero)
- **Botones glossy Vista** (`.btn-aqua`): rectangulares (radio 5px), gradiente con corte especular al 50%
  (blanco arriba, azul abajo), :hover glow cian #00d2ff, :active hundimiento inset. Variantes de severidad:
  verde/amarillo/rojo/morado/gris (para el futuro sistema de negociación por color).
- **Barras de título azul metálico** (`.panel > .cab`): degradado glossy #5b9be6→#00317a con corte al 50%.
  Variantes agua/alerta/grave conservadas en estilo Vista.
- **Paneles cristal** (`.panel`): rectangulares (radio 7px), `backdrop-filter:blur(12px)`, biselado inset.
- Rectangularización general (radio 4-8px): fichas, .op, menú, modal, ventanas, tinder-card (adiós pastillas 999px).
- **Progress bars Vista**: `.barrita` hundida con borde; nueva `.aero-progress` animada estilo copia de Windows
  (`@keyframes vistaProgress`, bloque verde con brillo que se desliza).
- **Pizarra táctica**: fichas de cristal con marco plateado estilo WMP11/Wii (`.pizarra .chip`).
- Solo CSS (cero riesgo de lógica). Verificado por computed-styles (radios, gradientes, blur, animación) + consola limpia.

## 5.0 spec · 3 pilares de decisión + negociación cara a cara  ✅ (2026-08-18)
**Archivos:** `js/data-proc.js` (motor), `js/ui.js` (render + modal + hook), `js/partido.js` (siembra post-partido),
`js/reputacion.js` (fix "Criade"→"Criado"), `css/base.css` (chip .pilar + severidad base)
- **3 pilares con color**: `pilarDeBuzon(buzon)` clasifica cada decisión en DEPORTIVO (verde, camarin/preparacion/cantera),
  PERSONAL (azul, prensa/gris/hinchada) o EJECUTIVO (dorado, institucional/refuerzos/finanzas/anfp). Chip rectangular
  `.pilar` renderizado en `abrirDecision` sobre el título.
- **Post-partido fuerza DEPORTIVO**: `terminarPartido` siembra una decisión procedural DEPORTIVA si no hay ninguna
  pendiente (`sembrarDecisionProcDeCategoria("DEPORTIVO")`), así siempre hay algo táctico que resolver tras jugar.
- **Negociación cara a cara** (`NEGOCIACIONES`, `generarNegociacion`, `resolverNegociacion`, `modalNegociacion`):
  jugador te encara (exige titularidad / pide renovar / amenaza con irse) y respondés con 4 enfoques de severidad:
  Persuadir (verde/seguro), Prometer aumento (amarillo/riesgo medio, cuesta planilla + flag prometido_), 
  Forzar permanencia (rojo/alto riesgo), Convencer (morado/impredecible, alta varianza). Efectos proporcionales
  (moral ±3-8, sin castigos catastróficos). Disparo ~11% al avanzar (`dispararNegociacion` tras vida proc).
- Verificado: harness Node (pilares OK, 200/200 negociaciones sin crash, siembra DEPORTIVO OK) + smoke navegador
  puerto 8791 (chip DEPORTIVO verde renderiza, modal con 4 botones de severidad, consola limpia).

## 5.0 spec · Bolsa de valores del club + finanzas avanzadas  ✅ (2026-08-18)
**Archivos:** `js/bolsa.js` (nuevo modulo), `js/motor.js` (hooks tick/finTemporada/normalizar),
`js/partido.js` (golpe post-partido), `js/ui.js` (vistaFinanzas + sparkline), `css/base.css`, `index.html`
- **Bolsa de valores**: el club es una sociedad anonima que cotiza (Blanco y Negro S.A., Azul Azul S.A.D.P.,
  Cruzados SADP...). `fundamentoBolsa` deriva el valor de prestigio/hinchada/moral/titulos/deuda/racha.
  `actualizarBolsa` (semanal, en tickSemana) persigue el fundamento con inercia + ruido especulativo;
  `golpeBolsa` (en terminarPartido) hace saltar la accion segun el resultado — ganar sube, perder hunde.
- **Especulacion con bolsillo personal** (conflicto de interes satirico: el DT sabe los resultados antes que
  el mercado): `invertirBolsa` compra acciones fraccionarias, `liquidarBolsa` vende %, con ganancia latente y
  costo invertido. `dividendoBolsa` paga dividendo anual a accionistas si la campana termina top-6.
- **Cotizacion en vivo** con sparkline SVG (sin librerias, area+linea verde/roja), variacion % semanal.
- **Flujo de caja semanal itemizado**: TV/sponsors/socios/digital vs planilla/operacion/intereses/comision,
  con resultado neto (usa ingresosAnuales/egresosAnuales /40).
- **Prestamo estructurado** (`tomarPrestamo`): caja inmediata a cambio de deuda con recargo 8%; intereses corren.
- **Delegar caja al Tesorero** (`gestionTesorero` en tickSemana): abona deuda con el excedente y cobra comision
  semanal (mayor si el tesorero es poco honesto). Toggle en el panel de Deuda.
- Verificado: harness Node (precio simula 25 sem, golpes suben/bajan bien, invertir/liquidar/dividendo/prestamo/
  tesorero OK, estable 120 semanas) + smoke navegador puerto 8793 (cotizacion, sparkline SVG, flujo 6 filas,
  todos los botones, consola limpia).

### 5.0 spec · PENDIENTE
- Corrección Avanzar/Simular (respetar calendario + modal Aero "¿dejar el progreso al azar?").
- Blackjack en el casino. Barras de apoyo en vivo (Ánimo Hinchada/Confianza Plantel/Criterio DT) + ticker lateral.
- Redes en 2 pestañas (Cuenta Oficial del Club vs Perfil Personal del DT con like/retuit/responder).

## 5.1 · Loop de calendario + casino vivo + servidor (2026-08-18)
**Archivos:** `ui.js`, `ui-partido.js`, `motor.js`, `js/casino.js`, `css/base.css`, `servidor.js`
- Avanzar ya no come semanas sin partido: si hay fixture, modal Dirigir / Simular al azar.
- Tras el partido, "Cerrar y seguir la semana" corre `procesarSemanaPostPartido` (plata, eventos, vida).
- Modos: `umbralEvento()` — histórico más calmo, libre medio, caos casi sin semana muerta.
- Casino: ruleta con giro + historial de fichas; **blackjack** (dealer 17, BJ 3:2).
- `servidor.js`: Node local (`node servidor.js`) — mismo archivo para el host 1.0. `/api/health`.

## 5.1b · Redes 2 pestañas + Vista/7 + Limache + donaciones (2026-08-18)
**Archivos:** `ui.js`, `css/base.css`, `data-plantel.js`, `motor.js`, `index.html`
- Redes: pestaña **club oficial** vs **perfil del DT**. En el perfil: Like / RT / Responder.
- Radios de botones/paneles/fichas bajados a 5–6px (deja de verse “pill”).
- Plantel LIM 2026 (nombres públicos, stats estimadas). DT 2026: Víctor Rivero.
- Ajustes: pantalla del proyecto / donaciones (sin pasarela todavía).

## 5.1c · Calendario y plantel Colo-Colo 1991 exactos (2026-08-18)
**Archivos:** `data-liga.js`, `data-plantel.js`
- Libertadores 1991: día exacto de cada partido (20/02 a 05/06).
- Nacional 1991: 30 partidos reales de CC (rival, localía, fecha, marcador histórico).
- Se agrega Intercontinental Tokio 8/12/1991 (0-3).
- El calendario se ordena por fecha real (copa y liga intercaladas).
- Plantel CC 1991: se suman recambios documentados (Verdirame, Letelier, Salvatierra, Castro, Soto).
- 2026 sigue aproximado: el fixture ANFP cambia cada fecha.

## 5.1d · Liga 2026 real + fixture CC 2026 + planteles (2026-08-18)
**Archivos:** `data-liga.js`, `data-plantel.js`, `motor.js`
- Liga 2026: 16 equipos correctos (salen Iquique y U. Española; entran D. Concepción y U. de Concepción).
- Fixture oficial de Colo-Colo 2026, 30 fechas (Wikipedia, congelado al 18/08/2026) con marcadores reales hasta la 19.
- Planteles CC/UCH/UC 2026 actualizados a nombres públicos de agosto 2026. Stats estimadas.
- DT 2026: UCH Fernando Gago, UC Daniel Garnero.

## 5.1e · Planteles: nada de nombres inventados como reales (2026-08-18)
**Archivos:** `data-plantel.js`
- `generarJugador` ya no arma "Luis Aránguiz": sale "Canterano POS N" con `real:false`.
- Si hay 16+ nombres documentados, no se rellena el plantel.
- PAL 2026 reescrito (Pérez, Roco, Garguez, Abrigo, Munder, etc.).
- CC 2026: Pastrán, Alarcón, Román, Ulloa.

## 5.1f · Ficha de jugador + tabla 2026 (2026-08-18)
**Archivos:** `ui.js`
- Plantel: filtros, rol (titular/suplente/fondo), ficha con lectura, charla y renovación.
- Calendario: muestra marcador histórico si existe; la tabla usa `LIGA_ACT` (ya no LIGA91 en 2026).
- Arrancar en fecha actual: NO. Queda para un bloque aparte con resultados reales del club.

## 5.1g · Corte agosto 2026 + fases de partido + save v4 (2026-08-18)
**Archivos:** `data-liga.js`, `motor.js`, `ui.js`, `partido.js`
- Nueva partida 2026: opción "Desde ahora" carga fixture jugado + tabla de referencia al 18/08.
- Partido: fases dominio / equilibrio / ahogo (pesan el peligro y el relato).
- Save v4: si el plantel tiene nombres inventados, se rearma.

## 5.1h · Fixture UCH 2026 + cerebro local (2026-08-18)
**Archivos:** `data-liga.js`, `ia.js`, `ui.js`, `servidor.js`, `data-plantel.js`
- Fixture oficial Universidad de Chile 2026 (30 fechas). Corte agosto también le aplica.
- Cerebro local en el escritorio: heurística, cero red, cero créditos.
- `/api/pensar` en localhost (POST) usa la misma idea, no llama modelos de pago.
- Assadi/Vargas + Reyna en UCH.

## 5.1i · Fixture UC 2026 + pista de caja (2026-08-18)
**Archivos:** `data-liga.js`, `data-plantel.js`, `ia.js`, `ui.js`
- Fixture oficial Universidad Católica 2026 (30 fechas, resultados hasta la 18).
- Finanzas avisa cuántas semanas dura la caja si el flujo es rojo.
- Cerebro local también mira la deuda.
- Lucero en UCH.

## 5.1j · Chirp 2008 + listado (2026-08-18)
**Archivos:** `redes.js`, `ui.js`, `motor.js`, `LISTADO.md`
- Feed con hilos, RT que cita, menciones, tendencias.
- Semilla al crear partida.
- Lista de mejora A–I para la beta.

## 5.1k · Liga completa por fecha (2026-08-18)
**Archivos:** `data-liga.js`, `partido.js`, `ui.js`, `redes.js`
- Al terminar un partido de liga se actualiza también el rival.
- El resto de la fecha se simula (empareja fixtures oficiales CC/UCH/UC + el resto con semilla fija).
- Calendario muestra "Resto de la fecha".
- Prensa con línea persistente (te banca o te funde).

## 5.1l · Once vivo + rivales honestos + spoiler + asamblea (2026-08-18)
**Archivos:** `data-plantel.js`, `data-liga.js`, `partido.js`, `motor.js`, `ui.js`, `LISTADO.md`, `ANALISIS.md`
- XI rival usa plantel documentado (CC/UCH/UC/PAL/LIM). Si no hay, “el 9 de Coquimbo” — no inventa nombres.
- PAL/LIM 2026: calendario con las fechas reales de CC + empareje de jornada.
- Once pesa moral, rol y cansancio. El titular se cansa; la banca recupera.
- Lesión: entra alguien frío (forma -8). Clásico/copa pesan. Relato cita jugadores.
- Ajustes: spoiler on/off. Chirp: 140 caracteres.
- Hinchada + socios < -45 → asamblea; a las 3 semanas, moción de censura.
- **Build no entregó zip.** Este parche es el que quedó pendiente.

## 5.1m · Tinder con charla, dinastía viva, cerebro en la vida (2026-08-18)
**Archivos:** `reputacion.js`, `motor.js`, `ia.js`, `LISTADO.md`, `ANALISIS.md`
- Match: charla de 3 preguntas antes de invitar. El puntaje decide si hay cita.
- Citas: ~62% abre dilema (llegás tarde / clásico / foto).
- Hijos envejecen. A los 17 pueden firmar en cantera.
- Sucesión: hijo o DT de afuera.
- `pensarOffline` cubre tinder/sucesor. IA de pago sigue APAGADA.

## 5.1n · Fix modal de inicio (2026-08-18)
**Archivos:** `data-liga.js`, `ui.js`
- `FIXTURES_OFICIALES` no toca `LIGA_CC_1991` antes de declararla (TDZ). El modal volvía a cortarse en «Elegí época».
- `pintar` del briefing ahora atrapa el error y lo muestra.

## 6.0 · Objetivos de temporada (juego estratégico + enseñable)  ✅ (2026-08-18)
**Archivos:** `js/carrera.js` (motor), `js/motor.js` (init/nuevoAnio), `js/partido.js` (flag clásico),
`js/ui.js` (panel escritorio), `css/base.css`, `css/aero.css`
- **Primer paso del plan de pulido 6.0 (Fase 0 — jugable de verdad).** La dirigencia ahora fija metas
  concretas en 3 frentes y el jugador las ve progresar: hace el juego estratégico (hay un plan que perseguir)
  y enseñable (cada meta dice QUÉ se pide y POR QUÉ importa).
- `generarObjetivos()`: 3 objetivos según contexto del club —
  · Deportivo (siempre, por prestigio): título / Libertadores (top4) / mitad de arriba (top8) / mantener categoría.
  · Económico: bajar la deuda 25% si es alta, o cerrar el año en azul si la caja está sana.
  · Institucional: reconquistar hinchada (<55), ganar un clásico (grandes) o mantener al directorio.
- `progresoObjetivo()`: progreso en vivo con estado cumplido/encamino/riesgo, leyendo tabla, deuda, caja,
  hinchada, directorio y el flag de clásico ganado.
- Panel **"Lo que se espera de vos"** en el escritorio (arriba): chip de categoría, estado, barra de progreso,
  el dato en vivo y una línea 💡 "por qué importa" que enseña la prioridad de la institución.
- `evaluarMandato()` reescrito: en vez de una sola posición, pondera cuántos objetivos se cumplieron
  (el deportivo pesa doble) y da un balance que **lista con ✓/✗ qué metas cumpliste** — feedback que enseña.
- Objetivos se regeneran cada `nuevoAnio` y el clásico ganado se marca en `terminarPartido`.
- Verificado: harness Node (metas correctas por tamaño de club, progreso en vivo, evaluación campeón=excelente /
  15º sin nada=fracaso con resumen ✓/✗) + smoke navegador (panel con 3 objetivos, barras, estados, consola limpia).
