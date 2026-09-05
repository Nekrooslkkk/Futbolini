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

## 6.0b · Pantalla de arranque + teclado + partido horizontal + fixes  ✅ (2026-08-19)
**Archivos:** `js/ui.js` (arranque, navegación, fix guardado), `js/ui-partido.js` (ops horizontales),
`js/partido.js` + `js/carrera.js` (loop de aprendizaje), `css/base.css`, `index.html`
- **Pantalla de arranque** (`pantallaArranque`): que entrar no sea fome. Splash Frutiger Aero con logo animado,
  barra de carga estilo Vista y botones que aparecen al terminar. Con partida guardada ofrece
  «Continuar mi carrera · <club> <año>» + «Empezar de nuevo»; sin guardado, «Entrar al juego».
- **FIX guardado crítico:** el arranque solo cargaba `g.v===3`, pero las partidas se guardan `v:4` → no se
  podía retomar la carrera. Ahora carga cualquier save con club y `normalizarEstado` migra.
- **Navegación por teclado** (`navContenedor`/`navegables` + handler global): flechas ← → ↑ ↓ mueven el foco
  entre opciones (menú de inicio, decisiones, botones anchos) y **Enter** elige. Foco visible con glow cian.
  Convive con las teclas 1/2/3 y Espacio del partido.
- **Decisiones del partido en horizontal** (`.ops.ops-part`): los momentos tácticos y las jugadas ahora se
  muestran en fila (2–4 lado a lado, con wrap), así no empujan el marcador y el relato hacia abajo. Las
  decisiones del menú siguen verticales.
- **Loop de aprendizaje**: al terminar un partido, si el resultado te mete o te saca de la zona de tu meta
  deportiva, te avisa («Trepás al 4°, entrás en zona de tu meta» / «Caés al 6°, te salís de…»). Ganar el
  clásico dispara el aviso de meta institucional cumplida.
- Verificado: navegador puerto 8820 — arranque con/sin save, teclado moviendo foco, partido horizontal en fila,
  guardado v4 recargable, avisos de objetivo entrar/salir de zona, decisiones de menú siguen verticales,
  consola limpia.

## 6.0c · Partido lado a lado + prompts para Grok  ✅ (2026-08-19)
**Archivos:** `js/ui-partido.js` (.partido-wrap), `css/base.css`, `GROK_PROMPTS.md` (nuevo)
- **Panel de partido y decisión LADO A LADO** (`.partido-wrap`, flex): la charla táctica / jugada aparece a
  la derecha del partido, no debajo. Así se ve todo sin que la página crezca. En pantalla angosta se apila.
  El relato ahora tiene scroll propio (max 240px) para que el panel no se estire.
- Corrección del pedido anterior: en vez de decisiones "horizontales" (que igual empujaban), ahora van
  al costado, que era lo que el usuario realmente quería.
- **`GROK_PROMPTS.md`**: 4 prompts autónomos para que Grok genere contenido con el formato exacto del juego
  y pegue directo — (1) planteles 2026 de los clubes que faltan, (2) planteles 1991, (3) fixtures+resultados
  reales (con regla "el resultado real solo si se sabe, si no null"), (4) "sorprendeme" (rasgos/planteles
  históricos/eventos/mecánicas). Todos con la regla de no inventar nombres como reales.
- Verificado: navegador puerto 8824 — partido y decisión lado a lado en escritorio, apilados en angosto,
  relato con scroll, consola limpia.

## 6.1 · E.memoria — el club recuerda lo que hiciste (corazón Fase 1)  ✅ (2026-08-19)
**Archivos:** `js/memoria.js` (nuevo motor), `js/motor.js`/`js/partido.js`/`js/data-proc.js` (puntos de grabado),
`js/ui.js` (panel + decisiones como modal), `css/base.css`, `css/aero.css`, `index.html`
- **Motor de memoria** (`E.memoria`, registro rodante máx 60): `recordar(tipo,txt,opts)` graba hechos salientes
  siempre en 2ª persona ("vendiste", "prometiste", "ganaste"); `memoriaReciente`, `citarMemoria` (marca usado,
  evita repetir), `cuandoMemoria` ("hace 3 fechas"/"el año pasado"), `promesaPendiente`.
- **Puntos de grabado**: promesa de aumento (negociación), clásico ganado/perdido, goleada/paliza (±3),
  venta de jugador (peso alto si es ídolo/crack), campeón nacional y Copa Libertadores.
- **Payoff visible** — panel **"El club no olvida"** en el escritorio: últimos 5 hechos con tu firma, punto de
  color por tono y "cuándo". Le da al jugador la sensación de que la historia depende de él.
- **Decisión-callback** (la killer feature): nueva plantilla en DEC_PROC que **existe por lo que hiciste** —
  "«Fulano» te cobra la promesa" cita el hecho real de memoria y ofrece Cumplir / Pedir tiempo / Negar,
  con consecuencias proporcionales sobre credibilidad y camarín.
- **UX "volvés a donde estabas"**: las decisiones del menú ahora se abren como **modal** sobre la vista actual
  (el escritorio queda detrás) y al cerrar se refresca en el mismo lugar; la negociación también deja de
  patearte al escritorio. Cumple el pedido de volver donde estabas al terminar una acción.
- Verificado: harness (recordar/dedup/citar/cuándo/promesaPendiente/callback OK) + navegador (panel con hechos
  en 2ª persona, decisión como modal con escritorio detrás, temporada completa acumula 14 recuerdos reales,
  consola limpia).

## 6.2 · Barras vivas + PLOP! + pasillos con consecuencia + inversiones con tope  ✅ (2026-08-19)
**Archivos:** `css/base.css` (barras), `js/ui.js` (PLOP/pasillos/inversiones), `js/redes.js` (tweets)
- **Movimiento en TODAS las barras**: rayas diagonales que corren estilo "descargando de Windows"
  (`@keyframes barLoad` sobre `.barrita i`). Respeta prefers-reduced-motion.
- **Chirp → PLOP!** (en honor al ¡Plop! de Condorito). Rediseño de la red social:
  · **Reportar** mensaje (baja alcance a hostiles / lo saca del feed).
  · **Likes que importan**: darle me gusta a un hincha sube la barra hinchada (+2) y la cuenta te responde
    ("¡le gustó al DT!"); a un hostil te resta. Se guardan en la tab **"Me gusta"**, donde podés **quitarlos**
    (revierte el acercamiento).
  · **Reposts que importan**: repostear a un hostil = **te auto-troleaste** (−6 hinchada, −prensa, queda en la
    memoria); repostear a los tuyos suma. Feedback claro en cada acción.
  · **Crecer para comerte todo**: "Impulsá tu cuenta" con plata → alcance y seguidores.
  · Tweets nuevos con sabor: aliento ("¡Vamos a ganarles, madres kla!") y hostiles para aprender a no repostear.
- **Pasillos con consecuencia visible**: al mover un pasillo aparece un modal con **lo que se movió**
  (deltas concretos de grupos/caja/capital/riesgo), queda en la memoria, y hay **límite de una vez por
  temporada** (antes se podía apretar sin que "pasara nada").
- **Inversiones con topes realistas y precios altos, SIN cooldown de tiempo**: el estadio se pone más caro y
  rinde menos a medida que sube (tope ~92); la campaña de marketing pierde efecto con la hinchada alta (tope
  ~88). Cuando no hay más que mejorar, muestra "Tope alcanzado".
- Verificado: navegador puerto 8834 — barras animadas, PLOP! con tabs/reportar/impulsar, like +2 / RT hostil −6
  con memoria, reportar elimina, impulsar sube seguidores, inversiones con tope, consola limpia.

## 6.3 · Sliders Aero + butacas documentadas + PLOP con vida + changas honestas  ✅ (2026-08-19)
**Archivos:** `js/motor.js` (taquillaPorSector, init), `js/ui.js` (sliders/butacas/PLOP), `js/redes.js`
(handleDT/verificado/botPost), `js/reputacion.js` (avatar foto + changas), `css/base.css`
- **Sliders Aero** (adiós look "Paint"): track glossy con relleno vía `--fill`, pulgar de cristal, y llegan
  hasta el final (bug de que no llegaban). Estilados para WebKit y Firefox.
- **Butacas documentadas**: tabla en Precios de entradas con cada sector (Galería 55% / Tribuna 33% /
  Marquesina 12% del aforo), su capacidad, precio, ocupación y **ganancia estimada por partido** (con total).
  Se actualiza en vivo al mover los sliders (`taquillaPorSector`).
- **PLOP con más vida**:
  · **Tu usuario**: elegís tu @handle (ya no firmás como "el cuerpo técnico"). RT/respuestas/posteos salen
    con tu nombre (`handleDT`).
  · **Comprar verificado** ✔ (con plata) para tu cuenta — más alcance y estatus; prensa y club vienen verificados.
  · **Bots que se mueven solos**: el feed suma posts cada ~5s como Twitter (hinchas/prensa/rival), con animación
    de entrada. Se frena solo al salir de PLOP (sin fugas de interval).
- **Vida — foto de avatar propia**: subís una imagen (se achica a 96px para no pesar en el guardado) o la quitás.
- **Vida — changas honestas**: 5 formas de ganar plata sin casino (columna, clínica, charla, TV, publicidad),
  una por semana, algunas piden imagen pública. Pagan al bolsillo personal.
- Verificado: navegador puerto 8840 — sliders con fill, butacas 3 filas, RT firmado @dtcrack, verificado,
  bots sumando post a los 5s y frenando al salir, changas pagan, subir foto, consola limpia.

## 6.4 · FIX brutal de duplicación + continuidad del jugador + comodidad PC  ✅ (2026-08-19)
**Archivos:** `js/motor.js` (repartirDecisiones, lesionAToken), `js/data-decisiones.js`, `js/ui.js`, `css/base.css`
- **FIX BRUTAL (decisiones que se multiplican en el 2do año):** `repartirDecisiones` armaba un Set de **ids**
  (`x.id`) pero comparaba contra la **clave** (`d.id+"_"+anio`) — nunca coincidían, así que cada semana
  re-agregaba las decisiones ya pendientes y se multiplicaban. Fix: dedup por `d.id`. Verificado: 10 repartos
  seguidos en año 1 y año 2 → sin duplicados.
- **Continuidad del jugador:** la decisión "El referente al borde de una recaída" nombra al {IDOLO} (ej. Vidal)
  pero lesionaba a otro al azar (Jeyson Rojas). Nueva acción `lesionAToken:IDOLO` que lesiona al MISMO jugador
  que nombra el texto. Se dejó `lesionAlAzar` donde el texto dice "un titular" (genérico).
- **Comodidad en PC:** las decisiones del escritorio ahora van en **2 columnas** en pantalla ancha (≥1000px),
  ordenadas con las urgentes primero, con un contador arriba. Menos scroll eterno.
- Verificado: harness (sin duplicados año 1/2, lesión cae en el ídolo Barticciotto) + navegador (grid, consola limpia).

## 6.5 · Contenido de Grok integrado: planteles reales + fixtures  ✅ (2026-08-19)
**Archivos:** `js/data-grok.js` (nuevo), `index.html`
- Integrados los datos que devolvió Grok: **planteles 2026 de 11 clubes** (EVE, COQ, AUD, HUA, OHI, NUB, COB,
  CAL, LSE, DCO, UDC), **planteles 1991 de 8 clubes** (UC, COQ, OHI, COB, UES, UCH, FV, DCO) y **fixtures
  reales 2026 de Palestino y Deportes Limache** (30 fechas c/u con resultados hasta agosto). 346 jugadores reales.
- Se cargan en un archivo propio `data-grok.js` (después de data-liga/plantel) y se enchufan por **mutación** a
  `PLANTELES_REALES` y `FIXTURES_OFICIALES` — sin tocar los archivos base, sin zona muerta temporal, y sin pisar
  lo existente (UC/UCH conservan sus años previos).
- Ahora **18 clubes con plantel documentado** y 5 con fixture oficial. PAL/LIM dejan de usar el calendario
  prestado de Colo-Colo.
- Verificado: navegador puerto 8850 — 18 clubes en el mapa, AUD 22/22 reales, UC 1991 con Toledo, PAL/LIM 30
  fechas, temporada 2026 completa simulada sin crashes, U. Española 1991 con 17 reales, consola limpia.

## 6.6 · Revisiones del ESCRITORIO (flujo de partido) — parte 1  ✅ (2026-08-19)
**Archivos:** `js/ui.js`, `js/ui-partido.js`, `js/data-decisiones.js`, `js/data-plantel.js`, `css/base.css`
HECHO en esta tanda:
- **(a) Próximo compromiso**: título "Próximo partido con X" (antes "visita a X") + subtítulo local/visita.
  Nuevo desplegable **"👁️ Ver el once probable del rival"** (usa `plantelRival`, muestra XI con nivel; ● = real).
- **(c) Antes de salir**: solo 3 acciones — **Simular**, **Dirigir**, **Conferencia**. El botón "Seguir" se fusionó:
  "⚡ Simular" abre el partido en vivo y adentro hay **"⏩ Al resultado"** para saltar al final al toque.
- **(d parte 1 · clásico)**: "Semana de clásico" ahora dispara **solo cuando el próximo partido es un clásico**
  (antes salía al azar con hinchada>45). Texto usa el token nuevo {RIVAL}. Token RIVAL agregado a resolverTokens.
- **(b parte 1 · entrenamiento)**: botón **"🏃 Entrenar fuerte"** (una vez por semana): sube la forma del plantel
  (más chance de ganar) con **riesgo bajo (~12%) de lesión** realista. Los lesionados ya se excluían del once.
- Verificado: navegador puerto 8854 — título nuevo, XI rival 11 filas, entrenar sube forma, 2 botones de modo,
  clásico dispara solo con rival clásico, "⏩ Al resultado" en vivo, consola limpia.

### PENDIENTE de las revisiones del escritorio (para próximas tandas)
- **(b) Pizarra estilo FIFA**: interactiva, que detecte el tipo de formación (incl. bizarras tipo 2-4-4) y que
  eso dé tácticas/estrategias reales; más formaciones clásicas; coordinada con los planteles reales.
- **(b) Designados**: pateador de penales, tiros libres y córners elegibles en la previa.
- **(b) Presión y estilo**: más opciones que realmente cambien el partido.
- **(c) Conferencia de prensa**: más viva y variada (hoy repite las mismas preguntas) — engancharla al motor de
  personajes/memoria del plan.
- **(d) Ofertas de mercado**: más variedad de jugador ofertado; y las "caras largas" solucionables metiendo plata
  (institución/finanzas) para reconquistar al jugador.

## 6.7 · Profundidad táctica estilo Football Manager  ✅ (2026-08-19)
**Archivos:** `js/partido.js`, `js/ui-partido.js`, `js/motor.js`
**Investigación:** mecánicas de Football Manager (mentalidad, roles/duties, shape) — comunidad Sports Interactive.
- **MENTALIDAD** (nuevo eje táctico global, estilo FM): Ultradefensivo → Defensivo → Equilibrado → Ofensivo →
  Ultraofensivo. Sesga ataque/orden/desgaste/exposición del equipo. Verificado: ofensivo sube ataque y baja
  orden (64/84 → 82/67). Enganchada al motor (`fuerzaEquipo` + `P.expo/recup`).
- **Más formaciones**: se suman 4-5-1, 5-4-1 y 3-4-3 (ahora 8 clásicas).
- **Detección de formación en la pizarra** (`formacionDetectada`): lee la grilla y muestra el esquema (incl.
  bizarros tipo **2-4-4**), avisando si no es clásico (el equipo "lo siente raro"). Ahora la pizarra libre
  tiene consecuencia real y legible.
- **Designados de balón parado**: pateador de **penales**, **tiros libres** y **córners** elegibles en la previa
  (selects del once). El designado tiene prioridad en el partido; con especialista de tiro libre puede haber
  golazo directo. Verificado: el penalista designado va primero aunque no sea el mejor.
- Resuelve parte del pendiente (b) de las revisiones del escritorio (designados + más formaciones + detección).
- Verificado: navegador puerto 8858 — mentalidad cambia el partido, 8 formaciones, 2-4-4 detectado, 3 selects
  de designados, penalista designado primero, consola limpia.

### Sigue pendiente del escritorio
- Pizarra 100% drag&drop tipo FIFA + poder meter suplentes al once (selección manual de XI).
- Presión/estilo con aún más opciones; roles/duties por jugador (Attack/Support/Defend) al estilo FM.
- Conferencia de prensa más viva (motor de personajes/memoria).
- Ofertas de mercado con más variedad + "caras largas" solucionables con plata.

## 6.8 · Alineación manual (armá tu XI, meté suplentes)  ✅ (2026-08-19)
**Archivos:** `js/partido.js` (onceIdeal), `js/ui-partido.js` (modalAlineacion + botón), `js/motor.js`, `css/base.css`
- **Editor de alineación** (`modalAlineacion`): la queja principal resuelta — ahora **elegís tu once a mano**,
  metiendo suplentes y sacando titulares. Jugadores agrupados por posición (con nivel/forma/rasgo), toggle
  para entrar/salir del XI, contador 11/11 y validación (necesita arquero). Coordinado con los planteles reales.
- **`onceIdeal` respeta el XI manual** (`E.tactica.xiManual`) y **se autocompleta con inteligencia** si un
  titular elegido se lesiona o se vende (sigue siendo 11, sin el lesionado). Botón "Volver a automático".
- Botón "👥 Alinear el equipo · manual/automático" en la previa, junto a la pizarra.
- Verificado: navegador puerto 8862 — 20 jugadores, 11 titulares, meter suplente respeta el once, fallback por
  lesión mantiene 11, consola limpia.
- Resuelve el pendiente clave del escritorio (b): "poder añadir más jugadores, coordinado con los planteles".

### Sigue pendiente
- Pizarra 100% drag&drop; roles/duties por jugador (Attack/Support/Defend); conferencia más viva;
  variedad de ofertas de mercado + "caras largas" con plata.

## 6.9 · Conferencia de prensa VIVA (reactiva + con periodistas)  ✅ (2026-08-19)
**Archivos:** `js/ui-partido.js`
- La conferencia dejó de repetir las mismas 3 opciones genéricas. Ahora un **periodista con nombre** (Tironi,
  la Kari, el Chico Sotomayor…) te hace una **pregunta reactiva** al contexto real: la derrota de la fecha
  pasada, la racha sin ganar, una **promesa que recuerda la memoria** ({QUIEN}), el clásico que se viene, ser
  favorito, estar lejos del objetivo, o venir encendido. Cada pregunta trae 3 respuestas con su tono (calma /
  autocrítica / confianza / palo) y efectos.
- Usa el motor de memoria ([[E.memoria]]) y `postProc` para que tus dichos aparezcan en PLOP. "No hablar" ahora
  cuesta un poco con la prensa.
- Resuelve el pendiente de la conferencia (se sentía poco cercana y repetitiva).
- Verificado: navegador puerto 8866 — pregunta por la derrota / por la promesa / por el clásico según contexto,
  periodista con nombre, 3 opciones, consola limpia.

## 6.10 · Caras largas con plata (reconquistar descontentos)  ✅ (2026-08-19)
**Archivos:** `js/data-proc.js` (moral individual), `js/motor.js` (reconquista), `js/ui.js` (panel Finanzas)
- Las negociaciones cara a cara ahora mueven la **moral individual** del jugador (antes solo la del equipo):
  forzar mal / promesa fallida / convencer mal lo dejan **con la cara larga** (moral baja); persuadir/prometer/
  convencer bien lo levantan.
- **Panel "Camarín descontento" en Finanzas**: lista a los jugadores con poca moral y un botón
  **"💵 Acercarlo al plantel"** que gasta plata (según valor/nivel) para reconquistarlo (+moral, +camarín).
  Justo lo pedido: dar plata para que los jugadores se acerquen al plantel.
- Verificado: navegador puerto 8870 — forzar fallido baja la moral individual, panel aparece con descontentos,
  reconquistar gasta plata, sube la moral y saca al jugador de la lista, consola limpia.

### Sigue pendiente
- Variedad de jugador ofertado en el mercado; pizarra drag&drop; roles/duties por jugador.

## 6.11 · El mundo recuerda TU historia (memoria en PLOP + balance)  ✅ (2026-08-19)
**Archivos:** `js/redes.js` (tweetDesdeMemoria), `js/ui.js` (balance de año)
- **PLOP cita tus hechos reales**: ~30% de los posts-bot ahora comentan algo que VOS hiciste, tomado de la
  memoria ([[E.memoria]]) y convertido a 3ª persona (`memoriaEn3a`): "Nadie olvida que el DT vendió a Vidal 👀",
  "El que dude que se acuerde: el DT le ganó el clásico a la U 2-0 💙". Hinchas festejan lo bueno, cuentas
  críticas te cobran lo malo, la prensa comenta lo neutro. Cada hecho se cita hasta 3 veces (no satura).
- **Balance de fin de año** lista "Lo que quedó del año" con tus momentos de más peso (títulos, clásicos, ventas).
- Profundiza el motor anti-robótico (Fase 1/2 del plan): el feed deja de ser genérico y se ata a tu historia.
- Verificado: navegador puerto 8874 — tweets citando ventas/clásicos/goleadas/títulos en 3ª persona correcta,
  balance cita memorias, consola limpia.

## 6.12 · Variedad en las decisiones de mercado  ✅ (2026-08-19)
**Archivos:** `js/data-proc.js`
- Tres tipos nuevos de operación procedural, cada uno con jugador y club distintos cada vez:
  **préstamo con opción de compra** (por un joven), **intercambio/trueque** (con posturas según si es ídolo) y
  **sondeo de un grande por tu joya**. Antes la oferta era casi siempre por el mismo jugador.
- Cada uno con 2-3 opciones y consecuencias proporcionales (sin castigos catastróficos), en el tono del juego.
- Verificado: harness (55 variantes distintas en 200 tiradas, jugadores/clubes/tipos variados, estructura OK) +
  navegador (renderiza como modal con 3 opciones, consola limpia).

### Sigue pendiente
- Pizarra 100% drag&drop tipo FIFA; roles/duties por jugador (Attack/Support/Defend).

## 6.13 · Roles/duties por jugador (lo más profundo de FM)  ✅ (2026-08-19)
**Archivos:** `js/partido.js` (fuerzaEquipo), `js/ui-partido.js` (previa), `js/motor.js`, `css/base.css`
- Cada jugador de campo puede tener un **duty**: **Defensivo / Equilibrado / Ofensivo** (estilo Attack/Support/
  Defend de Football Manager). La suma de duties inclina al equipo: más ofensivos = más ataque pero menos orden.
- Sección colapsable **"🎭 Roles de los jugadores"** en la previa, con selector de 3 por jugador y una lectura
  de **balance/fluidez** ("Muy volcado al ataque: vas a generar pero quedás abierto atrás" / "Reparto sano").
  Update local (no cierra el colapsable al elegir).
- Enganchado al motor: verificado que 11 ofensivos suben ataque y bajan orden (86/63) vs 11 defensivos (61/89).
- Verificado: navegador puerto 8882 — roles cambian el partido, sección con 30 botones (10×3), consola limpia.
- Con esto quedan cubiertas las dos capas tácticas grandes de FM (mentalidad de equipo + roles por jugador).

### Sigue pendiente
- Pizarra 100% drag&drop tipo FIFA (la última feature grande de UI).

## 6.14 · Pizarra drag & drop tipo FIFA  ✅ (2026-08-19)
**Archivos:** `js/ui-partido.js` (modalPizarra), `css/base.css`
- La pizarra dejó de ser "tocar y tocar": ahora **arrastrás a los jugadores por la cancha** con el dedo o el
  mouse (pointer events → funciona en PC y celular). Ghost que sigue el puntero, celda de destino resaltada,
  y **swap** automático si soltás sobre otro jugador.
- Mantiene la detección de formación (incl. bizarras) y el efecto táctico en vivo mientras acomodás.
- Verificado: navegador puerto 8886 — 11 chips arrastrables, mover a celda vacía OK, swap OK, formación
  detectada se actualiza, consola limpia.
- **Con esto queda cerrada la última feature grande del plan de pulido.** Táctica completa: formaciones,
  mentalidad, roles por jugador, designados, alineación manual y pizarra drag&drop.

## 6.15 · Pulido de interfaz  ✅ (2026-08-19)
**Archivos:** `js/ui.js` (irA), `css/base.css`
- **Transición suave (fade + slide) al cambiar de sección**: el juego se siente más premium al navegar.
- **Micro-interacciones**: hover lift en las pestañas del menú y en los íconos de club, transición en filas.
- Todo respeta prefers-reduced-motion.
- Verificado: navegador puerto 8890 — la transición aparece al navegar, las 11 vistas cargan sin error, consola limpia.

## Estado del plan de pulido: COMPLETO ✅
Táctica (formaciones, mentalidad, roles, designados, alineación manual, pizarra drag&drop), motor de memoria
(el mundo recuerda y cita tu historia), objetivos, PLOP vivo con bots, finanzas + bolsa, vida con changas,
planteles reales de 18 clubes, arranque, conferencia viva, caras largas, y pulido de interfaz. Los pendientes
del plan original quedaron cerrados. Lo que sigue es contenido (Grok) y lo que salga de jugarlo.

## 6.16 · Interfaz PC + móvil: adiós scroll eterno · PLOP con scroll propio  ✅ (2026-08-19)
**Archivos:** `js/ui.js` (render data-sec, bots), `js/ui-partido.js` (data-sec partido), `css/base.css`
- **PC sin scroll eterno**: las vistas de lista (finanzas, institución, mercado, vida, redes, historia, carrera,
  ajustes, avisos, calendario) fluyen en **2 columnas** a ≥1000px y **3** a ≥1560px (masonry con multicolumn,
  panels intactos con break-inside:avoid). Escritorio (rejilla propia), plantel (tabla) y partido quedan excluidos.
  Se hace con `#vista[data-sec]` seteado en render.
- **PLOP con scroll propio**: el feed (`#plopFeed`) ahora scrollea DENTRO de su panel (max-height ~60vh) en vez
  de crecer toda la página. Los bots insertan arriba **sin moverle la vista al que está leyendo** (guarda la
  posición de scroll, como Twitter real). Indicador **"● EN VIVO"** pulsante. Cap de 60 posts.
- Móvil intacto (una columna, la multicolumna es solo ≥1000px); todo responsive.
- Verificado: navegador — 2 columnas a 1360px en finanzas/redes, plantel/escritorio en 1, feed con overflow
  interno (max-height 458px) y EN VIVO, partido no columnizado, consola limpia + screenshot del layout 2-col.

## 6.17 · FIX venta con nombre (continuidad) — prioridad 0  ✅ (2026-08-19)
**Archivos:** `js/motor.js` (venderJugador, ejecutarAccion+dec, atarFicha), `js/data-proc.js` (Oferta formal con ficha)
**Funciones:** `atarFicha(dec,j)`, acciones `venderFicha`/`venderNombre`, `venderJugador(j,monto)` enriquecido,
`ejecutarAccion(a,dec)` (dec pasado desde resolverDecision y tirarEvento).
**Qué probar:** CC 2026 → "Oferta formal por X" → vender → X sale del plantel, plata sube, `mercadoLog.vendidos`
lo lista, onceIdeal lo excluye, y un tuit lo nombra a ÉL (no al más caro). venderTitular genérico sigue igual.
**1 línea:** si la carta nombra a un jugador, la venta toca a ESE jugador (ficha snapshoteada), no al más caro.
**Riesgos:** módulos tocados motor.js (venderJugador ahora notifica a bandeja + golpea hinchada si es ídolo/de
la casa; 3 call sites de ejecutarAccion reciben dec) y data-proc.js (2 cartas usan venderFicha). No se tocó
repartirDecisiones/resolverTokens/idsHechosPrevios. venderTitular queda solo para cartas sin nombre.

## 6.18 · Banca + cambios con nombre (Section 2)  ✅ (2026-08-19)
**Archivos:** `js/partido.js` (bancaPartido, hacerCambio, cambiosMax, estado), `js/ui-partido.js` (modalCambio + botón)
**Funciones:** `hacerCambio(P,sale,entra)`, `bancaPartido(P)`, `modalCambio()`; P.cambios/cambiosMax; j.estado.
**Qué probar:** en el partido, botón "🔄 Cambio (n/max)" → elegís quién sale y quién entra → relato "{Y} entra
por {X}"; tope 3 (2026) / 2 (1991); el 4º (o 3º en 1991) queda bloqueado. El que sale deja de ser citado
por el relato (sale de P.once).
**1 línea:** cambios manuales con nombre en el partido (sale X, entra Y), con tope por era.
**Riesgos:** módulos partido.js/ui-partido.js. j.estado nuevo (once/banca), no rompe onceIdeal (filtra vendido/
lesión). El modal pausa el reloj y lo reanuda al cerrar.

## 6.19 · Tweets nacidos del estado actual (Section 3)  ✅ (2026-08-19)
**Archivos:** `js/redes.js` (actualidadRedes, tuitDesdeActualidad, handleHinchaDeClub, botPost), `js/partido.js` (part.goleadores)
**Funciones:** `actualidadRedes()` (lee SOLO hechos que existen: club/año/rival/sede/local, último resultado y
goleador, vendido reciente, lesionado, posición+pts), `tuitDesdeActualidad()` (el hecho fresco manda; venta/
resultado/lesión priorizados sobre previa/tabla; anti-repetición), `handleHinchaDeClub()`.
**Qué probar:** vendé a X → un tuit lo nombra ("X afuera, ¿con quién jugamos?"); ganá de visita 2-1 → tuit con
marcador y rival reales ("2-1 a Audax de visita"); previa cita rival+sede reales. Nada de "arriba el equipo".
**1 línea:** el feed de PLOP nace de E de ESTA semana (resultado/venta/lesión/previa/tabla), no de un banco 2010.
**Riesgos:** redes.js (botPost prioriza el fresco; TWEETS_HINCHA queda como relleno <20%; memoria 40%),
partido.js (guarda goleadores en la fecha). No repite el texto del último post.

## 6.20 · 4 rasgos con hook + plantel U 2011 (Sections 4 y 6)  ✅ (2026-08-19)
**Archivos:** `js/partido.js` (hooks), `js/ui.js` (fichaJugador), `js/data-grok.js` (U 2011)
**Rasgos (cada uno con hook real):**
- **de la casa**: venderlo golpea hinchada -12 + post hostil (venderJugador); en el clásico los de la casa dan empuje.
- **cabeza caliente**: post-60' más chance de amarilla (mitad si viene ganando); 2ª amarilla = ROJA (queda con 10).
- **frio de definicion**: DEL convierte menos en jugada (peso -25%) pero +15% de penal (letal desde el punto).
- **llegador**: VOL con más peso a marcar y asistir.
Se muestran en `fichaJugador` (qué hace cada uno).
**Plantel histórico:** `PLANTELES_REALES.UCH[2011]` — U. de Chile 2011 (Sampaoli, campeón Sudamericana), 18
nombres reales (Herrera, Rojas, Marcelo Díaz, Aránguiz, Mena, Vargas, Canales, Henríquez…), stats estimadas.
**Qué probar:** ficha de un jugador con rasgo muestra el hook; frío convierte más penales (377 vs 322 en 400);
clásico con "de la casa" en el once sube el empuje; U 2011 carga con 18 jugadores.
**Riesgos:** partido.js (tieneRasgo helper, tarjeta con roja saca del once, P.amar per-match). data-grok mutación.

## 6.21 · Mesa de la barra (Section 5) — interlocutor con memoria  ✅ (2026-08-19)
**Archivos:** `js/barra.js` (nuevo), `js/ui.js` (abrirMesaBarra/panelMesaBarra), `js/motor.js` (init + hook venta),
`js/partido.js` (empuje/silbidos), `js/redes.js` (tweet del pacto), `js/data-proc.js` (evento de puerta), `index.html`
**Funciones:** `E.barra={humor,lienzos,pactos,ultimoIdx,roto}`; `pactar(o)`, `romperPacto(motivo,quien)`,
`pactosVigentes()`, `barraContenta()`, `abrirMesaBarra()`, `panelMesaBarra()`.
**Qué probar:** en Institución → "Mesa con la barra" → acordá 3 pactos (aliento / entradas+viaje / no vender al
de la casa) → barra contenta = empuje +2 en clásico de local (y riesgo +4). Vendé al de la casa que juraste no
vender → pacto roto: lienzo, humor -28, silbidos al 15', tweet "la mesa era clara y la rompieron", y a las pocas
fechas germina el evento "Tensión en la puerta 8".
**1 línea:** la barra es un interlocutor con memoria: pactás, cumplís o pagás (lienzo + silbidos + puerta).
**Riesgos:** módulo nuevo barra.js; venderJugador llama romperPacto si es de la casa; iniciarPartido y tickPartido
leen E.barra; DEC_PROC nuevo consume flag puertaBarra (fix: ==null porque idx 0 es falsy). No dupliqué nada.

## ORDEN DE ATAQUE (spec ingeniero): 1-6 COMPLETO
1 venta con nombre · 2 banca+cambios con nombre · 3 tweets del estado · 4 rasgos con hook · 5 mesa de la barra ·
6 plantel U 2011. Pendientes del spec detallado: 8 eventos locales, Tinder cada 2-3 fechas, minutosTemporada/dorsal.

## 6.22 · 8 eventos locales con sabor chileno (Section 4 del spec)  ✅ (2026-08-19)
**Archivos:** `js/data-proc.js` (7 eventos), `js/motor.js` (acciones lesionFicha/cansarFicha)
**Eventos:** Consejo de Presidentes en Quilín (votar con grandes/regionales/abstenerse → flag votoConsejo +
mod favor_tv) · La Roja convoca a {jugador} (ceder con riesgo de lesión/cansancio del MISMO jugador via ficha,
o retener con costo de prensa/ANFP) · CDF quiere el clásico 21:30 (plata TV vs desgaste) · el municipio pide
el estadio para un concierto (arriendo vs cancha marcada) · lienzo contra el directorio (bajarlo/dejarlo/mesa
de barra) · impuesto de la SAD (pagar/lobby con deuda) · dirigente filtra el camarín (echarlo/contrafiltrar/
desmentir). El 8º ("puerta 8") ya existía como consecuencia de romper un pacto de barra (6.21).
**Cada uno:** 1 texto con lugar/token real + 1 cambio de mundo + 1 semilla (flag o mod).
**Qué probar:** aparecen en el escritorio y renderizan como decisión (modal); las 3 opciones resuelven sin
romper; "La Roja" con ceder-mal lesiona al jugador nombrado (lesionFicha). Verificado: 11 variantes, 0 errores.
**Riesgos:** data-proc.js (7 gen nuevos), motor.js (2 acciones que leen dec.ficha). No dupliqué nada.

## 6.23 · Tinder: pregunta del club + filtración (Section 7)  ✅ (2026-08-19)
**Archivos:** `js/reputacion.js` (chatMatch + chequearTinderMentira), `js/ui.js` (hook en avanzar)
**Funciones:** chatMatch ahora antepone una pregunta del CLUB ("¿vas a vender a {joven}?") con opción de mentir;
`chequearTinderMentira()` (llamado en avanzar) filtra a la prensa a las ~4 fechas si mentiste.
**Qué probar:** abrí una charla de Tinder → primera pregunta es sobre un joven real del plantel → elegí "Jamás,
es intocable" → a ~4 fechas de avanzar aparece un tuit de prensa citando al jugador y baja tu credibilidad.
**1 línea:** con la vida pública, hasta la almohada habla: mentir en una cita sobre el club te sale caro.
**Riesgos:** reputacion.js (chatMatch usa lista local de preguntas, no rompe CHARLAS_MATCH), ui.js (1 hook en avanzar).
No inflé el Tinder: extendí lo que ya existía (E.perfil.tinder).

## ESTADO SPEC INGENIERO: Sections 1-7 hechas
Pendiente fino: Section 8 (minutosTemporada/dorsal/pie — el core banca/cambios ya está en 6.18) y Section 9
(más eventos con semilla — ya hay varios: puerta de barra, La Roja, concierto, promesa).

## 6.24 · Estado del jugador: minutosTemporada + pie (Section 8)  ✅ (2026-08-19)
**Archivos:** `js/partido.js` (minutos), `js/motor.js` (init/reset + pie), `js/ui.js` (fichaJugador)
**Qué:** cada jugador acumula `minutosTemporada` (contabilidad exacta: sale al 60' = 60', entra al 60' = 30',
titular completo = 90'), se resetea cada año; `estado` (once/banca/lesion/cedido/vendido) y `pie`
(determinístico por nombre, ~25% zurdos) se inicializan en normalizarEstado. Se muestran en `fichaJugador`.
**Qué probar:** ficha de un jugador muestra "Minutos en la temporada · pie X"; tras un cambio al 60', el que
sale suma 60', el que entra 30', el titular 90'.
**1 línea:** ya se sabe quién juega de verdad (minutos por temporada) y con qué pie.
**Riesgos:** partido.js (minEntrada por partido), motor.js (init en normalizarEstado + reset anual). Bajo.

## SPEC INGENIERO: Sections 1-8 hechas + 8 eventos locales. Section 9 (eventos con semilla) satisfecha en varios.

## 6.25 · Bugs de 2do año + Cambio + reflejo + SECCIÓN LOGROS  ✅ (2026-08-21)
**Archivos:** `js/logros.js` (NUEVO), `js/motor.js`, `js/partido.js`, `js/ui-partido.js`, `js/barra.js`,
`js/redes.js`, `js/ui.js`, `js/reputacion.js`, `css/base.css`, `css/aero.css`, `index.html`
**Bugs cerrados:**
- Botón "ya entrenaron fuerte" se quedaba apretado y todo se bugeaba en el 2º año: los flags se
  llavean por `E.idx`, que vuelve a 0 en `nuevoAnio` y colisiona con el año anterior. Fix raíz: entreno
  y changa ahora se llavean por `anio_idx`, y `nuevoAnio` limpia todos los prefijos de flags semanales.
- Al apretar "Cambio" durante un partido dirigido desaparecían las elecciones tácticas: el botón de
  cambio ahora queda deshabilitado mientras haya un momento (MOMENTO_OPS) pendiente.
**Reflejo blanco:** bajé los alfas de `.destello` (.75→.38, .55→.28) + opacity .7 en aero.css.
**Logros (nueva sección):** 12 logros bizarros-pero-reales. Ej: "Bomba de hidrógeno vs bomba de hidrógeno"
(patear y meter un penal con tu arquero), "El pueblo unido" (clásico ganado con 3+ de la casa), "Nunca
bajar los brazos" (remontada de 2), "El defensor que soñó con ser 9" (gol de cabeza de un DEF), "Con uno
menos y con el alma" (ganar con expulsado), "Palabra de dirigente" (3 pactos con la barra), etc. Se
desbloquean con hooks en el motor real (no cosméticos) y viven en `E.logros`. Panel dorado en Carrera.
**Qué probar:** desbloquear un logro (ej. penal con arquero) tiñe la tarjeta de dorado en Carrera; avanzar
un año y volver a entrenar sin que el botón quede trabado; el cambio no borra las elecciones tácticas.
**1 línea:** cerré los bugs del 2º año y del cambio, bajé el reflejo, y nació la sección de Logros.
**Riesgos:** motor.js (limpieza de flags en nuevoAnio + normalizarLogros en normalizarEstado). Medio-bajo.

## 6.26 · Sala de prensa post-partido VIVA (reactiva + memoria + gente real)  ✅ (2026-08-21)
**Archivos:** `js/ui-partido.js`
**Qué:** la rueda de prensa dejó de ser 3 preguntas fijas. Ahora un periodista con nombre (mezcla de
prensa deportiva chilena real —Guarello, Danilo Díaz, De Tezanos, Caamaño, Solabarrieta, Yáñez, Palma…—
que SOLO pregunta; el que declara es tu DT) hace una pregunta reactiva a:
- lo que pasó en la cancha: figura/hat-trick, doblete, remontada (abajo x2), ganar con expulsado,
  clásico ganado/perdido, goleada a favor/en contra, lesión de un titular, racha sin ganar;
- lo que hiciste ANTES (MEMORIA DEL JUEGO): una promesa a un jugador, una venta polémica, etc. — el juego
  te lo cita con "hace X fechas".
Cada pregunta ofrece 2-3 respuestas con arquetipo (elogio/humilde/agrandado/palo/mea/bancar/árbitro/
respaldo/foco → POST_ARQ). No se repite la misma pregunta seguido (E.flags.prensaVistas, ventana de 8).
Se agregó una **barra de clima de prensa** del momento (según E.grupos.prensa) arriba de la sala.
**Qué probar:** ganar goleando con una figura → el periodista pregunta por la figura; perder un clásico →
pregunta distinta y con opción de apuntar al árbitro; tener una promesa vieja → la prensa te la recuerda.
**1 línea:** la prensa ahora pregunta por lo que pasó y por lo que hiciste, con nombres reales y sin repetir.
**Riesgos:** ui-partido.js (reescritura de seccionPrensa + nuevo motor preguntasPostPartido). Medio-bajo.

## 6.27 · MINIJUEGO DE PENAL (dibujá el tiro, el arquero se tira)  ✅ (2026-08-21)
**Archivos:** `js/ui-partido.js` (minijuegoPenal + wiring), `js/partido.js` (penalEnPartido acepta forzado), `css/base.css`
**Qué:** cuando hay penal a favor en un partido DIRIGIDO, después de elegir quién patea se abre un
minijuego: un arco Frutiger Aero dibujado en SVG (red, arquero, pelota). Tocás/arrastrás dentro del arco
para elegir dónde ponerla (aparece la línea de tiro punteada + la mira), elegís efecto (🎯 Colocado /
💥 Potente / 🥄 Picadita) y apretás ¡Patear! El arquero se tira a un lado cuando pateás.
- Justo por diseño: apuntar a un rincón mete el gol el ~80-86% de las veces AUNQUE el arquero adivine el
  palo (los rincones son casi imparables). Solo el centro flojo o apuntarle encima al arquero se atajan.
  La picadita mata al arquero que se tira y muere contra el que se queda. Nivel del pateador y del arquero
  ajustan un poco. Nunca "te joden" por dibujar bien.
- Funciona con mouse (PC) y touch (celular) vía pointer events; el resultado (gol/atajado/afuera) se fuerza
  a penalEnPartido, saltando el RNG. En modo simular/auto sigue el cálculo viejo.
**Qué probar:** dirigir un partido, penal a favor, elegir pateador → sale el arco; apuntar arriba a la
derecha, patear → el arquero se tira y (casi siempre) es gol; el marcador y el relato lo registran.
**1 línea:** los penales a favor ahora se patean dibujando: apuntás, elegís efecto, y el arquero vuela.
**Riesgos:** ui-partido.js (nuevo flujo async en mostrarAccion, guardado con return-flag). Medio.

## 6.28 · Más elecciones en el partido: TRIVIA de pizarra + DOPAR (turbio)  ✅ (2026-08-21)
**Archivos:** `js/partido.js`, `js/ui-partido.js`, `js/logros.js`, `js/css/base.css`
**Qué:** dos tipos nuevos de decisión mientras dirigís, para que no sea siempre la misma charla:
- **Trivia de pizarra (🧮):** cada tanto (no en la previa) cae una pregunta REAL de fútbol (cuántos
  jugadores, minutos por tiempo, cuántos puntos da ganar, de qué continente es la Libertadores, etc.) o
  una cuenta simple de matemática (12+7, 11×9…). Si acertás, el equipo se suelta (empuje/ataque) y hasta
  puede caer un gol inmediato (~28%); si errás, se ponen nerviosos. Absurdo a propósito, como pidió el jefe.
- **Dopar (💉):** en momentos críticos (min ≥ 62, partido parejo, con caja) aparece una 4ª opción para
  repartir un «preparado especial». Cuesta carísimo (≥ $60 o 18% de tu caja) y agranda al equipo por lo
  que queda. PERO al terminar el partido se juega el riesgo: 35% escándalo de dopaje (multa, prensa e
  hinchada por el piso, credibilidad destruida, queda en el prontuario, +logro «El químico»), 20% un
  titular se descompensa y se lesiona, 45% zafás… por ahora. Se confirma en un modal aparte.
Se agregó el logro **«El químico»** (dopar y que te estalle encima) → 13 logros.
**Qué probar:** dirigir; en un momento debería salir una trivia con 3 respuestas; en un partido parejo
pasado el minuto 62 con plata, la charla ofrece la opción de dopar (pide confirmación por lo caro/turbio).
**1 línea:** ahora en el partido te toman prueba de pizarra… o podés jugar sucio y dopar, con todo el riesgo.
**Riesgos:** partido.js (momentoActual ahora puede devolver trivia/doping; consecuencias en terminarPartido),
ui-partido.js (mostrarMomento ramifica por tipo). Medio.

## 6.29 · Objetivos: más metas, por sección, en pestañas (menos scroll)  ✅ (2026-08-21)
**Archivos:** `js/carrera.js`, `js/ui.js`, `css/base.css`
**Qué:** "Lo que se espera de vos" pasó de 3 a 6 metas, 2 por sección, todas atadas al estado real:
- **Deportivo:** posición en la tabla (ya estaba) + **sumar N triunfos** (nuevo, según tamaño del club,
  atado a E.temporada.pg; entra en riesgo solo cuando ya es imposible por fechas).
- **Económico:** caja/deuda (ya estaba) + **tener a los sponsors sobre 40** (nuevo, atado a E.grupos.sponsors).
- **Institucional:** **ganar un clásico AHORA ES SIEMPRE** (antes solo para los grandes) y con uno basta,
  como pediste; + reconquistar a la hinchada o mantener al directorio, según el contexto.
- UI: **pestañas por sección** (Todo · Deportivo · Económico · Institucional) → ves una sección a la vez,
  no scroleás una página entera. Tarjetas **compactas** (2 columnas en pantalla ancha) con el "por qué
  importa" oculto que se despliega al tocar. La pestaña elegida se recuerda (E.uiObjTab).
**Qué probar:** en escritorio, el panel de objetivos muestra pestañas; tocar "Institucional" deja solo el
clásico y la meta de hinchada/directorio; tocar una tarjeta despliega el "💡 por qué". (Metas nuevas
aplican desde una temporada nueva; las partidas ya empezadas mantienen sus 3 metas hasta el próximo año.)
**1 línea:** más objetivos, ordenados por sección y en pestañas para no scrolear, y el clásico ya es meta fija.
**Riesgos:** carrera.js (nuevos tipos victorias/grupo en progresoObjetivo), ui.js (panel con tabs). Bajo.

## 6.30 · Química en la pizarra: los que se llevan bien dan nivel  ✅ (2026-08-21)
**Archivos:** `js/partido.js` (motor de química + bono al partido), `js/ui-partido.js` (líneas + lectura), `js/css/base.css` (cancha linda)
**Qué:** la pizarra táctica ahora tiene **química real**:
- `quimicaPar(a,b)` es determinística (no azar por partido): edad parecida, rasgos compartidos, ambos "de
  la casa", partidos juntos, y un "click/roce" fijo por par. Da 5-99.
- `quimicaEquipo(once)` mira los pares **conectados** (vecinos en la pizarra, o misma línea si no movés
  nada), saca el promedio y un **bono de nivel** (−3 a +5) que entra al partido en `P.empuje`/`P.orden`
  → afecta de verdad la chance de ganar. Juntar a los que congenian sube el nivel.
- En la pizarra se **dibujan las líneas**: verde = se llevan bien, roja punteada = hay roce. Debajo, una
  barra de "Química del equipo" con el promedio, el bono, y quiénes congenian / chocan.
- La cancha quedó **más linda**: pasto con franjas de corte, círculo central y línea de mitad.
**Qué probar:** abrir la pizarra → líneas verdes entre jugadores + barra de química; mover a un jugador
al lado de otro con el que congenia sube el promedio; el bono se siente en el partido.
**1 línea:** la pizarra ahora muestra quién se lleva bien con quién, y juntarlos te da nivel de verdad.
**Riesgos:** partido.js (química en iniciarPartido → empuje/orden), ui-partido.js (overlay SVG de lazos). Bajo.

## 6.31 · Checklist «Antes de salir a la cancha» (reconoce qué falta)  ✅ (2026-08-21)
**Archivos:** `js/ui-partido.js`, `js/css/base.css`
**Qué:** al entrar a la previa de un partido, arriba de todo aparece un panel que reconoce el estado real
y te dice qué conviene resolver antes de jugar: si hoy es clásico, decisiones urgentes sin cerrar (te
lleva al escritorio al tocar), conferencia de prensa dada o pendiente, alineación manual o automática,
química del equipo (si es baja te ofrece abrir la pizarra), titulares con las piernas pesadas (te lleva a
alinear), lesionados que se pierden el partido, y barra caliente si rompiste un pacto. Los ítems con ⚠
son accionables (un toque te lleva a resolverlos).
**Qué probar:** ir a un partido → panel «Antes de salir a la cancha» con la lista; con una decisión
urgente pendiente aparece en ⚠ y al tocarla vas al escritorio.
**1 línea:** antes de jugar, el juego te muestra qué te falta por hacer, y te lleva a hacerlo.
**Riesgos:** ui-partido.js (checklistPrevia + panel al tope de pantallaPrevia). Bajo.

## 6.32 · El desarrollo sigue el tiempo: los jóvenes maduran según lo que hiciste  ✅ (2026-08-21)
**Archivos:** `js/motor.js` (nuevoAnio · envejecer)
**Qué:** arregla lo que marcaste: "las decisiones no siguen el tiempo". Antes, al cambiar de año, los
jóvenes subían nivel con un random plano, ignorando lo que pasó. Ahora el desarrollo está **atado a lo
que hiciste con cada jugador**:
- Un ≤23 que **jugó mucho (≥1200 min) y bien** (forma alta) crece fuerte hacia su proyección.
- Uno que **jugó algo** crece poco; uno al que **casi no diste minutos** (banca, lesiones) se **estanca o
  retrocede**; si además **le fue mal** (forma baja), crece todavía menos.
- Los ≤28 se mantienen si juegan y bajan si no; los ≥30 caen, y **más** si no sumaron minutos.
- El crecimiento no se dispara sobre el techo (proyección) del jugador.
Al cerrar el año, un aviso te cuenta quién dio el salto y quién retrocedió, **explicando por qué** (minutos,
rendimiento). Así, pedir un canterano y no hacerlo jugar (o que le vaya mal) tiene consecuencia real y no
queda congelado para siempre.
**Qué probar:** meté un juvenil al once toda la temporada → sube; dejalo en la banca → se estanca o baja.
Al pasar de año, el aviso «Cómo maduraron los jóvenes» lo explica.
**1 línea:** los pibes ahora crecen o se estancan según cuánto y cómo jugaron: la decisión sigue el tiempo.
**Riesgos:** motor.js (curva de desarrollo en el cierre de temporada). Bajo.

## 6.33 · Conferencia más larga + el clima de prensa influye en el partido  ✅ (2026-08-21)
**Archivos:** `js/ui-partido.js`, `js/partido.js`
**Qué:** la conferencia previa ahora es **más larga y variada**, como pediste:
- Son **2 preguntas** seguidas, cada una con **un periodista distinto** (del pool real ampliado:
  Guarello, Danilo Díaz, De Tezanos, Caamaño, Solabarrieta, Yáñez, Palma…).
- **No se repiten** las preguntas de la vez anterior (E.flags.confVistas, ventana de 10). Se sumaron
  preguntas "evergreen" (físico, el rival, mensaje a la gente) para que siempre haya de dónde elegir.
- Arriba de la conferencia hay una **barra de clima de prensa para ese partido**, y ese clima **influye de
  verdad en la cancha**: la aprobación de la prensa suma o resta empuje al salir a jugar (probado: ~1.4 de
  diferencia de empuje entre prensa a favor y en contra). Calentar de más te la puede jugar en contra.
**Qué probar:** dar la conferencia → 2 preguntas, 2 periodistas distintos, barra de clima; con la prensa
a favor el equipo sale más suelto que con la prensa picada.
**1 línea:** la conferencia dura más, no repite y con periodistas reales; y el clima de prensa mueve la aguja del partido.
**Riesgos:** ui-partido.js (modalConferencia secuencial), partido.js (nudge de prensa en empuje). Bajo.

## 6.34 · "Lo que pasó esta semana" con titulares de la liga relevantes  ✅ (2026-08-21)
**Archivos:** `js/redes.js` (titularesSemana + noticiaPosible), `js/ui.js`, `js/css/base.css`
**Qué:** el panel "Lo que pasó esta semana" ya no queda vacío ni se limita a tus avisos: debajo suma
**Titulares de la liga** atados al estado real:
- Quién manda la tabla (puntero + tu posición).
- La goleada de la fecha (del resto de partidos simulados).
- Tu racha sin ganar, si la hay ("la prensa cuenta los partidos que te quedan").
- El próximo rival (local/visita, sede).
- Una noticia posible del ambiente (árbitro designado, rumor de mercado, clima, cambio de horario, otro
  técnico en la cuerda floja), estable dentro de la semana (indexada por E.idx/anio, no cambia en cada render).
**Qué probar:** en el escritorio, "Lo que pasó esta semana" muestra "Titulares de la liga" con el puntero,
resultados de la fecha y el próximo rival.
**1 línea:** la semana ahora trae titulares de la liga de verdad, no solo tus propios avisos.
**Riesgos:** redes.js (nuevo generador), ui.js (render extra). Bajo.

## 6.35 · Cerebro local desarrollado (análisis priorizado del club)  ✅ (2026-08-21)
**Archivos:** `js/ia.js` (cerebroLocal), `js/ui.js`, `js/css/base.css`
**Qué:** la idea que dejó Grok hace rato —una "IA" local sin internet ni créditos— ahora está desarrollada.
`cerebroLocal()` lee el estado real y arma un **análisis priorizado** con lo que importa esta semana:
- **Lectura del próximo partido**: favorito/parejo/en desventaja + un consejo táctico concreto (presionar,
  ordenarse y salir de contra, cuidar la pelota parada).
- **Química** del equipo (floja → acomodá la pizarra; enchufada → no toques).
- **Objetivos en riesgo** (te nombra el que peligra y por qué).
- **Caja/deuda**, **camarín/moral**, **hinchada**, **piernas cansadas**, **racha sin ganar**, y **mercado**
  cuando hay caja para moverse.
Devuelve los 5 insights más importantes, ordenados por prioridad, y el escritorio los pinta como tarjetas
categorizadas con acento de color. (El viejo `consejoLocal()` sigue para el roleo offline.)
**Qué probar:** en el escritorio, el panel «Cerebro local» muestra la lectura del rival y las alertas
priorizadas según cómo esté tu club.
**1 línea:** el cerebro local ya no es una línea suelta: es un analista que te prioriza la semana, 100% offline.
**Riesgos:** ia.js (nuevo cerebroLocal), ui.js (panel). Bajo.

## 6.36 · FutbolGram en vivo más realista (reacciona al momento, no al relato)  ✅ (2026-08-21)
**Archivos:** `js/redes.js` (tickerPost + tickerAmbiente), `js/ui-partido.js`
**Qué:** el feed en vivo del partido se siente más real:
- Los tuits de gol ahora **nombran al goleador real** ("¡GOOOL de Fulano!", con el marcador), igual los
  goles en contra citan al autor del rival.
- Se agregaron **tuits de ambiente** que reaccionan al MOMENTO (marcador, tensión, minuto), no a la jugada:
  "Ganando y sufriendo como siempre 85'", "Partido trabado, cero que ver 50' 😴", "El técnico tiene que
  mover algo YA", "Se nos va el partido 😔". Leen el marcador con `miMarcador` (respeta local/visita) y
  aparecen de a ratos (~14% de los ticks tranquilos) para que FutbolGram esté vivo entre jugada y jugada.
**Qué probar:** dirigir/seguir un partido en vivo → entre eventos aparecen tuits que comentan cómo va el
partido; al meter un gol, el tuit dice el nombre del que lo hizo.
**1 línea:** FutbolGram ahora tuitea sobre el momento (va ganando y sufriendo, partido aburrido) y nombra al goleador.
**Riesgos:** redes.js (tickerAmbiente nuevo), ui-partido.js (llamada en el loop). Bajo.

# ===== OVERHAUL 7.0 (gran actualización de interfaz/diseño) =====

## 7.0-a · Fondo Frutiger Aero con AURORAS + paneles de vidrio  ✅ (2026-08-21)
**Archivos:** `index.html` (capa .aurora), `css/aero.css`
**Qué:** primer golpe del overhaul visual, arrancando por lo que marcó el jefe (el fondo plano).
- **Fondo con auroras estilo Windows Vista**: nueva capa `.aurora` con cintas de luz sedosas
  (conic-gradients girando lento, blur medio, blend soft-light) sobre un cielo celeste→verde más rico.
  Se mueven en loop lento; respetan `prefers-reduced-motion`. Las burbujas glossy quedaron.
- **Paneles de vidrio (glass)**: los paneles ahora son translúcidos (opacidad ~.6 + `backdrop-filter:
  blur(16px) saturate`) para que la aurora del fondo asome a través de ellos — el look Aero de verdad.
  Se les agregó un reflejo de vidrio en la mitad superior (`::after`). Texto sigue legible.
**Qué probar:** entrar al juego con tema Aero → fondo con auroras que ondulan y paneles que dejan ver el
color del fondo. Se ve bien en PC y en celular.
**1 línea:** el fondo dejó de ser plano: auroras Vista + paneles de vidrio que las dejan brillar a través.
**Riesgos:** solo `body[data-tema="aero"]`, no toca otros temas. Bajo.

## 7.0-b · Comodidad PC · vistas en 2 columnas (menos scroll)  ✅ (2026-08-21)
**Archivos:** `css/base.css`
**Qué:** en pantallas anchas (≥1000px) las vistas que eran una columna larguísima ahora fluyen en
**2 columnas** aprovechando `#vista[data-sec]` que ya seteaba `render()` — cero cambios de JS. Aplica a
Institución, Finanzas, Historia, Carrera, Redes, Avisos y Vida (con `break-inside:avoid` para que ningún
panel se corte). En celu/tablet siguen en una columna. El escritorio ya usaba su propia rejilla.
**Qué probar:** en PC ancho, entrar a Institución o Finanzas → los paneles se acomodan en dos columnas y
se scrollea mucho menos. En celular, todo sigue en una sola columna.
**1 línea:** en PC las vistas largas ahora son de dos columnas: se acabó el scroll eterno.
**Riesgos:** solo CSS con media query ≥1000px; no toca el layout mobile. Bajo.

## 7.0-c · Storylines: arcos de equipo con alma (atados a la memoria)  ✅ (2026-08-21)
**Archivos:** `js/data-storylines.js` (NUEVO · data), `js/storylines.js` (NUEVO · motor+UI), `index.html`, `js/motor.js`, `js/ui.js`, `js/css/base.css`
**Qué:** cada club tiene HISTORIAS propias que siguen el tiempo y se enganchan a la memoria. Sistema
PARALELO al motor de decisiones (no toca repartirDecisiones ni el token motor).
- **Arcos escritos a mano** para los grandes: **U de Chile · "El estadio propio"** (3 capítulos: impulsar
  → financiar → permisos, con final de estadio construido o en humo), **Colo-Colo · "El peso del más
  grande"** (marca vs pueblo, gira vs clásico, el Cacique y la calle), **UC · "Crecer sin perder la
  esencia"** (masificar vs cuidar, cantera vs vitrina, el sello cruzado).
- **Arcos genéricos** que aplican a CUALQUIER club (la sede que se cae, el ídolo que quiere volver al CT).
- **Era-agnóstico**: la U actual está en el mismo plano que Colo actual (los arcos aplican salvo que marques
  `era`). Se siembra solo 1 vez por semana, con cooldown tras cerrar uno.
- Cada elección aplica efectos reales (plata/grupos/reputación) y **queda en la memoria en 2ª persona**
  ("sacaste adelante el estadio propio de la U"), así te la pueden citar después.
- Aparece como tarjeta "Historia del club" en el escritorio y se resuelve en un modal de vidrio.
**Fácil de ampliar (7.00):** agregar un club = una entrada en `ARCOS_EQUIPO[ID]`. El formato está
documentado arriba del archivo. Probado end-to-end: arco completo U (3 caps → cierra → memoria + cooldown)
y arco Colo renderizando. Consola limpia.
**1 línea:** cada club tiene sus propias historias (el estadio de la U, la grandeza de Colo) que siguen el tiempo y quedan en la memoria.
**Riesgos:** sistema nuevo y aislado; solo agrega `normalizarStorylines` y una tarjeta al escritorio. Bajo.

## 7.0-d · Arcos de Palestino y Limache + micro-animaciones  ✅ (2026-08-21)
**Archivos:** `js/data-storylines.js`, `js/css/base.css`
**Qué:**
- **Palestino · "Más que un club: una comunidad"** — su identidad como casa de una colectividad
  (comunidad vs inversión, la camiseta que emociona, chico de plata pero grande de alma). Escrito con
  respeto y sin meterse en la política; foco en el vínculo con la comunidad.
- **Deportes Limache · "El pueblo chico en primera"** — la épica del chico en la elite (competir sin
  complejos, te quieren robar la joya, el mensaje final al pueblo). Ya todos los clubes jugables tienen arco.
- **Micro-animaciones sutiles**: los paneles entran con un fade+slide, los modales hacen un pop suave, los
  avisos aparecen desde arriba, y las opciones tienen hover más vivo. Respeta `prefers-reduced-motion`.
**Qué probar:** jugar como Palestino o Limache → aparece su historia propia; al navegar entre vistas los
paneles entran con una animación suave.
**1 línea:** Palestino y Limache ya tienen su propia historia, y todo entra con micro-animaciones con onda de época.
**Riesgos:** data + CSS de animación. Bajo.

## 7.0-e · Marcador tipo pantalla de estadio (scoreboard)  ✅ (2026-08-21)
**Archivos:** `js/css/base.css`
**Qué:** el marcador del partido (lo más importante de la pantalla más usada) pasó de texto plano a un
**scoreboard de estadio**: panel de vidrio oscuro con los goles en dígitos ámbar que brillan (glow), nombres
de los equipos en claro, y un puntito rojo que late en el reloj como señal de "en vivo". Respeta
`prefers-reduced-motion`.
**Qué probar:** entrar a un partido → el marcador se ve como una pantalla de estadio con dígitos que brillan.
**1 línea:** el marcador ahora parece la pantalla gigante del estadio, con dígitos que brillan y señal de en vivo.
**Riesgos:** solo CSS del `.marcador`/`.reloj`. Bajo.

## 7.0-f · La saga del club en Historia (payoff de las storylines)  ✅ (2026-08-21)
**Archivos:** `js/storylines.js` (panelSagaClub), `js/ui.js` (vistaHistoria), `js/css/base.css`
**Qué:** las decisiones de los arcos de equipo ahora tienen payoff visible: en la vista **Historia**
aparece "La saga de <tu club>" — una línea de tiempo con el capítulo abierto (si hay) y todo lo que fuiste
decidiendo en los arcos, en 2ª persona y con el año ("Le pusiste el pecho al viejo sueño del estadio de la
U", "Bancaste el estadio con aporte de los socios"). Se arma desde la memoria (tipo storyline), así que es
fiel a lo que hiciste.
**Qué probar:** resolver capítulos de la historia del club y entrar a Historia → aparece la saga con tus decisiones.
**1 línea:** la vista Historia ahora muestra la saga de tu club: los arcos que resolviste y qué elegiste.
**Riesgos:** solo lectura de la memoria + un panel nuevo. Bajo.

## 7.0-g · Logros conectados a las storylines  ✅ (2026-08-21)
**Archivos:** `js/logros.js`, `js/data-storylines.js`, `js/storylines.js`
**Qué:** los dos sistemas nuevos se premian entre sí. 3 logros nuevos (16 en total):
- **"El que construyó la casa"** — sacar adelante el estadio propio en la historia de la U.
- **"Esto es más que fútbol"** — cerrar una historia poniendo la identidad del club por delante de la caja
  (Colo con su gente, Palestino con su comunidad, Limache con su pueblo).
- **"Culebrón de primera"** — completar 3 historias de equipo.
Se disparan con un campo `logro` en la opción de cierre del arco + un contador de arcos completados.
**Qué probar:** construir el estadio de la U → salta «El que construyó la casa»; completar 3 arcos → «Culebrón de primera».
**1 línea:** resolver las historias de tu club ahora también te da logros.
**Riesgos:** data + un hook en resolverStoryline. Bajo.

## 7.0-h · Pulido de chrome: chips de la barra como vidrio Vista  ✅ (2026-08-21)
**Archivos:** `css/aero.css`
**Qué:** los chips de datos de la barra superior (club, fecha, caja, deuda, capital) —que están en TODA
pantalla— pasaron a verse como pastillas de vidrio Vista: gradiente translúcido, borde claro, brillo
interior y sombra suave; los de alerta tiñen en rojo. El glifo de la marca tiene un aro de luz.
**Qué probar:** en cualquier vista, la barra de arriba se ve más pulida y con más profundidad.
**1 línea:** la barra superior ahora tiene chips de vidrio con onda Vista, en toda pantalla.
**Riesgos:** solo CSS del tema Aero. Bajo.

## 7.0-j · Vida: excesos absurdos que escalan con el club  ✅ (2026-08-21)
**Archivos:** `js/reputacion.js`, `js/css/base.css`
**Qué:** los lujos de la Vida del DT pasaron de 5 a **15, escalonados por el prestigio del club** (`req`):
- Siempre: reloj, camioneta, parcela, auto deportivo, depto en Vitacura.
- Club mediano (≥55): palco VIP vitalicio, yate en Algarrobo, sommelier de planta.
- Club grande (≥70): helicóptero para ir a los partidos, colección de autos clásicos, chef privado.
- Club enorme (≥85): isla privada, un **tigre de mascota** (como cierto dueño de club), estatua tuya
  afuera del estadio, y el delirio total: **cohete privado para la pretemporada** (≥92).
Los bloqueados se ven con 🔒 y el prestigio que te falta. Cada uno da estatus (y a veces riesgo). Cuanto
más grande hacés el club, más ridículo el exceso que te podés dar.
**Qué probar:** en Vida → Lujos, con un club chico casi todo está bloqueado; al subir prestigio se
habilitan los delirios.
**1 línea:** los lujos del DT ahora escalan con el club: de un reloj a un cohete de pretemporada.
**Riesgos:** reputacion.js (LUJOS + gate en comprarLujo). Bajo.

## 7.0-k · Repeticiones: abrir un partido jugado y ver los goleadores  ✅ (2026-08-21)
**Archivos:** `js/ui.js`, `js/css/base.css`
**Qué:** en el Calendario, cada partido ya jugado ahora es **clickeable** ("▶ ver repetición") y abre un
modal con el marcador (scoreboard de estadio), los datos del partido, y **los goleadores de tu equipo
agrupados con cantidad** (ej. "Barticciotto · 2 goles"). Si el partido tiene referencia histórica, muestra
"En la historia real: ese partido terminó X" para que veas cuánto te separaste de lo que pasó de verdad.
Cierra un pendiente viejo de la cola (goleadores en el calendario / "las repeticiones").
**Qué probar:** jugar unos partidos, ir a Calendario, tocar un partido jugado → sale la repetición con goleadores.
**1 línea:** en el calendario ahora podés abrir cualquier partido jugado y ver quién hizo los goles.
**Riesgos:** ui.js (modalRepeticion + filas clickeables). Bajo.

## 7.0-l · Edad del DT más piola (stepper en vez de escribir la fecha)  ✅ (2026-08-21)
**Archivos:** `js/reputacion.js`, `js/css/base.css`
**Qué:** el perfil del DT ya no te hace escribir una fecha de nacimiento entera en un input date incómodo.
Ahora hay un **stepper simple de edad** (− / 40 años / +, rango 22-80): elegís cuántos años tiene tu DT y
el juego calcula el año de nacimiento solo (conserva el día/mes). Actualiza al toque, sin recargar la vista.
**Qué probar:** en Vida → Perfil del DT, tocar − / + cambia la edad sin escribir nada.
**1 línea:** la edad del DT se elige con un +/− en vez de tipear una fecha; mucho más cómodo, en PC y celu.
**Riesgos:** reputacion.js (control de edad). Bajo.

## 7.0-m · Más variedad en decisiones de mercado  ✅ (2026-08-21)
**Archivos:** `js/data-proc.js` (extiende DEC_PROC, no toca el token motor)
**Qué:** 3 plantillas nuevas de mercado para que el buzón no repita siempre lo mismo (24 plantillas ahora):
- **Un representante te ofrece un jugador** (libre, barato pero incierto: ganga o dolor de cabeza).
- **Trueque** (un club propone cambiar tu jugador por uno suyo, sin plata; podés pedir que sumen plata).
- **Rumor de un refuerzo de renombre** (la hinchada se ilusiona; confirmás y prometés, bajás la espuma, o
  exprimís el rumor para vender entradas y sponsors, con riesgo de quedar como vendehumo).
Cada una con 3 opciones y consecuencias reales, usando las acciones ya existentes (venderFicha) y efectos.
**Qué probar:** avanzar varias semanas → en el buzón aparecen estas situaciones nuevas de mercado.
**1 línea:** el mercado ahora tiene más situaciones (trueques, representantes, rumores) para no repetirse.
**Riesgos:** solo agrega plantillas a DEC_PROC. Probado: mini-temporada resolviendo 27 decisiones, 0 errores.
## 7.00 · Voz PLOP / FutbolGram (Grok)
Archivos: js/data-voz.js (NUEVO), index.html (una linea al final).
Pools: TUITS_MOMENTO, PREGUNTAS_VOZ, TRIVIA_VOZ, ARCOS_NUEVOS, LOGROS_VOZ.
tickerPost / tickerAmbiente / preguntasConferencia se envuelven al cargar (flag _voz).
No toca tokens ni repartirDecisiones.
Arcos nuevos: EVE COQ AUD HUA OHI NUB COB CAL LSE DCO UDC (no pisa CC/UCH/UC/PAL/LIM).


## 7.00-fix · Cableado de la voz de Grok (data-voz.js integrado)  ✅ (2026-08-21)
**Archivos:** `index.html` (carga data-voz.js último), `js/data-voz.js` (fix ctxDeEvento), `js/partido.js` (hooks)
**Qué:** integré el `data-voz.js` que mandó Grok y cablé lo que le faltaba (era motor, no contenido):
- **Tuits de expulsión:** `ctxDeEvento` buscaba la roja en `tipo:"tarjeta"` con un flag inexistente; en el
  juego la roja es su propio evento `tipo:"roja"`. Corregido → ahora salen.
- **Tuits de penal errado:** el resultado del penal no viene en el evento; ahora `penalEnPartido` marca
  `P.penalErrado` y emite el tuit `penal_errado` cuando se falla un penal a favor (`vozPenalErrado`).
- **9 logros de Grok (LOGROS_VOZ)** se agregaban al panel pero sin hook. Cableé 8 en `terminarPartido`:
  no_se_jode (clásico ganado), tres_del_9 (hat-trick), diez_visita (sumar de visita con roja), micro_cantando
  (ganar de visita con gol 80+), luna_penal (errar penal y no perder), el_1_es_el_dt (0-0 de visita),
  silencio_local (perder de local sin marcar), pueblo_lleno (ganar de local con club chico).
  Queda 1 sin hook: **post_oficial_muerto** (depende de un mecanismo de "post de aura" que no existe).
- Los 11 arcos nuevos (EVE/COQ/AUD/HUA/OHI/NUB/COB/CAL/LSE/DCO/UDC) usan IDs que coinciden con LIGA_2026:
  quedan latentes hasta que esos clubes sean manejables (7.00).
**Probado:** temporada completa + año 2 + 12 vistas, 0 errores; tres_del_9 y micro_cantando desbloquean OK;
expulsion y penal_errado mapean bien.
**1 línea:** integré la voz de Grok y cablé lo que le faltaba: tuits de roja/penal errado y 8 de 9 logros nuevos.

## 7.00 · ¡16 clubes manejables! Integración de la data de Grok  ✅ (2026-08-22)
**Archivos:** `js/data-clubes2026.js` (NUEVO · merge), `index.html`, `js/partido.js` (esClasico), `js/ui.js` (inicio + barra)
**Qué:** integré la data que mandó Grok para hacer DIRIGIBLES los 11 clubes que faltaban de Primera 2026
(Everton, Coquimbo, Audax, Huachipato, O'Higgins, Ñublense, Cobresal, La Calera, La Serena, D. Concepción,
U. de Concepción). Ahora son **16 clubes jugables**.
- `data-clubes2026.js` mergea por MUTACIÓN (Object.assign, sin redeclarar const): CLUB_INFO_2026 (identidad),
  IND_BASE_2026 (indicadores), CAJA_BASE_2026 (caja), ESTATUTO_INICIAL (identidad institucional) y
  PODER_CLUB (poder de grupos). Los planteles ya estaban en `data-grok.js`.
- **Selector de inicio**: sección nueva "… o un club de la Primera 2026" con los 11. Los clubes que solo
  existen en 2026 fuerzan la época 2026 (no muestran el botón 1991).
- **esClasico** ahora reconoce **rivalidades regionales** (RIVALIDADES_2026): clásico penquista (DCO↔UDC),
  del norte chico (COQ↔LSE), del Biobío (HUA↔DCO, HUA↔UDC), de colonias (AUD↔PAL), del Aconcagua (CAL↔LIM).
- Fix: `pintarBarra` leía el escudo de CLUB_INFO (1991); ahora usa `infoClub()` (era-aware) → no crashea con
  los clubes 2026.
**Probado:** los 16 clubes bootean; temporada completa como Huachipato (30 partidos, 0 errores, 2 clásicos
regionales detectados); las 12 vistas OK; start screen muestra los 16. Consola limpia.
**1 línea:** los 11 clubes que faltaban ya se pueden dirigir: 16 clubes jugables, cada uno con su arco, plantel y clásico.
**Riesgos:** motor de selección + merge de datos; aislado en un archivo. Medio-bajo.

## 7.00 · Listo para GitHub Pages  ✅ (2026-08-22)
**Archivos:** `.nojekyll` (NUEVO)
**Qué:** dejé el repo listo para publicar en GitHub Pages: verifiqué que TODAS las rutas de assets son
relativas (css/…, js/…) → funciona servido en `/Futbolini/`; el juego no hace ningún fetch/XHR (100%
offline). Agregué `.nojekyll` para que Pages sirva todos los archivos tal cual (sin procesamiento Jekyll).
**Cómo publicar (el usuario, 3 clics):** GitHub → repo Futbolini → Settings → Pages → Source: Deploy from a
branch → Branch: main / carpeta / (root) → Save. En ~1 min: https://nekrooslkkk.github.io/Futbolini/
**1 línea:** el juego quedó listo para publicarse en GitHub Pages y compartirse por link, sin login ni servidor.

## 7.00 · FASE A · Pulida verificada  ✅ (2026-08-22)
**Qué:** barrido de calidad previo al multijugador. Resultado: el juego ya estaba muy sólido tras el
overhaul 7.0, así que la pulida fue sobre todo verificación + un ajuste:
- Saqué el logro `post_oficial_muerto` (confuso y sin mecánica) y corregí la descripción de `silencio_local`.
- **Auditoría automática de las 12 vistas** en mobile (375px) y desktop (1280px): 0 overflow horizontal,
  0 paneles vacíos, 0 errores de render.
- **QA de temporada completa** con club grande (Coquimbo) y chico (Cobresal): 30 partidos c/u, 0 errores;
  sus arcos propios siembran y cierran; clásicos regionales se detectan; planteles reales de Grok cargados.
- Los 16 clubes bootean; la barra usa `infoClub()` era-aware; el selector muestra los 16.
**1 línea:** pulida = verificado que los 16 clubes y las 12 vistas están redondos en PC y celu, y saqué el logro confuso.
**Siguiente:** FASE B · multijugador P2P (ver PLAN_7.00.md).

## 7.00 · FASE B1 · Conexión P2P (multijugador, primer ladrillo)  ✅ (2026-08-22)
**Archivos:** `js/multi.js` (NUEVO), `index.html`, `js/ui.js` (botón en el inicio)
**Qué:** primer incremento del multijugador. Duelo contra un amigo **sin servidor ni cuentas**: WebRTC
DataChannel con señalización MANUAL (copia-pega de código), STUN público solo para descubrir la IP.
- `js/multi.js`: motor `MP` + `mpCrearSala()` (anfitrión → código de invitación), `mpUnirse(cod)`
  (visitante → código de respuesta), `mpConfirmarSala(resp)` (anfitrión confirma). Espera a juntar los
  candidatos ICE antes de dar el código (sin trickle), los codifica en base64. Handshake de nombres al
  abrir el canal. `mpEnviar/onMensaje` para B2/B3.
- UI `modalDuelo()`: pantalla "Duelo con un amigo" (crear sala / unirse), copiar código con un toque,
  y estado "¡Conectados!". Botón de entrada en la pantalla de inicio.
**Probado (2 pestañas):** anfitrión crea oferta → visitante genera respuesta → anfitrión confirma →
`conectado=true`, `dc=open`, `iceState=connected` en ambos, nombres intercambiados, y un mensaje de prueba
viajó del host al guest exacto. STUN resolvió la IP pública OK. Consola limpia.
**1 línea:** dos navegadores ya se conectan directo (P2P) con un código, sin servidor — la base del duelo.
**Siguiente:** B2 · lobby (cada uno elige su club y se sincroniza).
**Riesgos:** WebRTC nuevo; aislado en multi.js, no toca el single-player. Medio.

## 7.00 · FASE B2 · Lobby del duelo  ✅ (2026-08-22)
**Archivos:** `js/multi.js`, `js/css/base.css`
**Qué:** el lobby del duelo P2P. Al conectar, ambos caen en la pantalla de lobby:
- Cada uno **elige su club** de los 16 (grilla con escudos). La elección se sincroniza por el canal
  (`{tipo:"club"}`) → los dos ven "Vos: X vs Rival: Y" en una tarjeta VS.
- Botón **Listo** (`{tipo:"listo"}`); cuando ambos están listos, el **anfitrión** (autoritativo) manda
  `{tipo:"arrancar"}` y los dos pasan a la pantalla de arranque del duelo (B3, en construcción).
- Reabrir el modal estando conectado va directo al lobby.
**Probado (2 pestañas):** host elige CC → guest lo recibe; guest elige UCH + listo → host lo recibe;
host da listo → ambos listos → arrancar sincronizado. Lobby renderiza los 16 clubes + tarjeta VS. Consola limpia.
**1 línea:** el lobby del duelo ya sincroniza club y "listo" de los dos por el canal P2P; falta el partido (B3).
**Siguiente:** B3 · el partido dirigido entre los dos (aparecen los 2 y deciden).

## 7.00 · FASE B3 · El duelo dirigido (¡multijugador jugable!)  ✅ (2026-08-22)
**Archivos:** `js/multi.js`
**Qué:** el corazón del multijugador. Un duelo head-to-head por rondas entre los dos clubes, con el
anfitrión autoritativo (sin desyncs de RNG), robusto ante lag porque sincroniza por turnos.
- **9 rondas** (jugadas clave). En cada una, LOS DOS eligen su postura (🗡️ atacar / ⚖️ equilibrado /
  🛡️ meterse atrás). El host calcula con la **fuerza real de cada club** (IND_BASE_2026) + la postura de
  cada uno + azar si cae gol, actualiza el marcador y lo transmite. Los dos ven el mismo scoreboard.
- Protocolo: `duelo_ronda` (host→guest), `duelo_pick` (guest→host), `duelo_res` (host→guest), `duelo_fin`.
  El host resuelve cuando tiene los dos picks; auto-avanza a la ronda siguiente.
- Pantallas: marcador tipo estadio, elegir postura, "esperando al rival", resultado de la ronda
  ("¡GOL TUYO!" / "Te marcaron"), y final (ganaste/empate/perdiste) con botón **Revancha**.
**Probado (2 pestañas, duelo completo automático):** Colo-Colo (fza 80) vs Huachipato (62), 9 rondas,
picks y resultados sincronizados, terminó **1-1** consistente en ambos lados, pantalla final "🤝 Empate"
en los dos. Consola limpia.
**1 línea:** ¡ya se puede jugar un duelo contra un amigo! 9 rondas donde los dos deciden, con la fuerza real de cada club.
**Siguiente:** B4/B5 (historial de duelos, copiar código con QR) — opcionales; o Fase C.
**Riesgos:** netcode nuevo; aislado en multi.js. Medio.

## 7.00 · FASE B4/B5 · Serie de duelos + robustez  ✅ (2026-08-22)
**Archivos:** `js/multi.js`
**Qué:** pulido del multijugador.
- **B4 · Serie de duelos**: cada duelo cuenta para una serie de la conexión (ganados/empates/perdidos),
  que se muestra en la pantalla final ("📊 Serie vs [amigo]: 2 ganados · 0 empates · 0 perdidos"). La
  revancha mantiene la serie; da ganas de seguir jugando. Además un log persistente en localStorage
  (`futbolini_duelos`).
- **B5 · Robustez**: watchdog de conexión (si en 20s no conecta tras confirmar, avisa con un mensaje claro
  —suele ser una red muy cerrada— en vez de colgarse); mensaje amable si se cae la conexión; el watchdog
  se limpia al conectar o al resetear.
**Probado (2 pestañas, 2 duelos + revancha):** la serie contó bien (host 2-0-0, guest 0-0-2), la pantalla
final la muestra, el marcador final (3-2) consistente. Consola limpia.
**1 línea:** los duelos ahora llevan una serie vs tu amigo (con revancha), y la conexión avisa si falla en vez de colgarse.
**Riesgos:** solo multi.js. Bajo.

## 7.00 · FASE C · Sistema de épocas de gloria + U de Chile 2011  ✅ (2026-08-22)
**Archivos:** `js/data-clubes2026.js` (EPOCAS_CLUB), `js/motor.js` (override en nuevaPartida), `js/ui.js` (selector)
**Qué:** el motor para las épocas históricas por club (modo leyendas / what-if), listo para recibir el
contenido de Grok.
- `EPOCAS_CLUB[club]` = lista de épocas de gloria. Cada una: {anio, etq, desc, squad, ind, caja, dt}. El
  plantel se toma de `PLANTELES_REALES[club][anio]`; el override cambia identidad/indicadores/caja/DT.
  Grok agrega más con `EPOCAS_CLUB_ADD` (merge automático).
- `nuevaPartida(club, anio, modo, {epoca})`: aplica los overrides de la época (ind/caja/dt) sobre la base.
  `baseEra(anio)` decide la liga (≥2010 → 2026, si no → 1991).
- Selector de inicio: sección **"🏆 O revivir una época de gloria"** cuando el club tiene épocas; el botón
  de empezar pasa a "Revivir <etq>".
- **Wireada la U de Chile 2011 · La Sudamericana** (el plantel de Sampaoli ya estaba en data-grok.js):
  sub 84, DT Sampaoli, juega en la liga 2026 como leyendas. Verificado: bootea con Herrera, Marcos
  González, Aránguiz, Vargas, Canales; mini-temporada 12 partidos, 0 errores.
**Cómo se amplía (Grok, con GROK_PROMPT_HISTORIA.md):** genera los planteles que falten + un
`EPOCAS_CLUB_ADD` con las entradas (UC tetra 2019, etc.) y se pegan.
**1 línea:** ya se puede revivir la U de Sampaoli 2011; el sistema de épocas de gloria está listo para sumar el resto.
**Riesgos:** motor de selección + override; aislado. Bajo.

## 7.00 · Épocas de gloria de los 12 clubes (contenido de Grok integrado)  ✅ (2026-08-22)
**Archivos:** `js/data-historia.js` (NUEVO), `index.html`
**Qué:** Grok generó los planteles históricos reales + `EPOCAS_CLUB_ADD` de los 12 clubes que faltaban.
Integrado en `data-historia.js` (planteles + registro en PLANTELES_REALES[club][anio] + EPOCAS_CLUB_ADD que
se mergea solo en data-clubes2026.js). Ahora **13 clubes tienen época de gloria jugable**:
- UC 2019 (bicampeón, Quinteros), O'Higgins 2013 (1ª estrella, Berizzo/Calandria), Huachipato 2012
  (Clausura), Cobresal 2015 (milagro), U. de Concepción 2018 (subcampeón), La Calera 2018 (Brian
  Fernández), Ñublense 2022 (subcampeón + Libertadores), Coquimbo 2025 (1er título), Everton 2012,
  Audax 2018, La Serena 2019, D. Concepción 2010 — + la U 2011 y Colo 1989/1991 que ya estaban.
- Todos con plantel REAL de la época, DT real, indicadores/caja acordes. Juegan en la liga actual (leyendas).
**Probado:** los 12 bootean sin fallar; temporada completa como UC 2019 (30 partidos, 0 errores); los
selectores muestran las épocas; consola limpia. Los planteles cargan a sus figuras reales (Dituro,
Fuenzalida, Calandria, Brian Fernández, Aravena, Johansen…).
**1 línea:** los 16 clubes ahora tienen su época de gloria jugable con plantel real — la 7.00 quedó completa de contenido.

## Mejora 7.10 · IA gratis blindada + respaldo/nube (login opcional)
**Archivos:** `js/ia.js`, `js/ui.js`, `js/nube.js` (nuevo), `index.html`, `SETUP_NUBE.md` (nuevo), `PLAN_7.10.md` (nuevo)
- **IA 100% offline:** saqué el hook de pago (`IA_CONFIG`, `evaluarPostAPI`, `iaDisponible`).
  `evaluarPost()` ahora usa solo `analizarOffline()`. Cero red, cero costo, sin tentación de prenderlo.
  Texto de donación en Ajustes actualizado (ya no habla de "pagar IA").
- **Respaldo por archivo** (Ajustes → "Respaldo de partida"): `descargarPartida()` baja `E` como `.fut`
  (JSON envuelto `{app,saveVer,guardado,E}`); `cargarPartidaArchivo(f)` lo restaura (acepta envuelto o `E` crudo).
- **Login/sync en la nube (opcional):** `nube.js` habla por `fetch` puro a Supabase (free tier), sin SDK/CDN/build.
  `nubeRegistrar/nubeEntrar/nubeSalir/nubeSubir/nubeBajar`, token en localStorage, refresh en 401.
  Config en `NUBE_CONFIG` (vacío por defecto → el panel no aparece y el juego anda 100% offline).
  Panel "Cuenta en la nube" en Ajustes (entrar/crear cuenta/subir/bajar). Pasos de setup en `SETUP_NUBE.md`.
**Probado:** `node --check` OK en ia/ui/nube. Falta QA de navegador (descargar/cargar archivo) y wirear claves Supabase reales para el sync.
**1 línea:** la IA quedó gratis para siempre y ahora podés respaldar tu partida por archivo o (opcional) por login en la nube.

## Mejora 7.10 · Sección Estadio (sectores reales + obras) + época sin redes
**Archivos:** `js/data-estadios.js` (nuevo), `js/motor.js`, `js/ui.js`, `js/ui-partido.js`, `js/data-voz.js`, `index.html`
- **Estadios reales (Grok):** `ESTADIOS_DATA` con los 16 clubes: estadio, aforo y SECTORES reales
  (Colo-Colo: Rapa Nui/Cordillera/Océano/Magallanes; U: Andes/Pacífico; etc.). `sectoresDe(clubId)`
  los devuelve en el shape del motor; `aforoDe`/`estadioNombre`. Fallback al genérico si no hay ficha.
- **Motor de taquilla por club:** `sectoresActuales()` y `aforoActual()` reemplazan a `SECTORES`/`club.aforo`
  en `taquilla`, `taquillaPorSector`, `preciosDefault`, `precioPromedioRatio`. Normalizador rellena
  `E.precios` para ids de sector nuevos (saves viejos no rompen). `E.aforoExtra`.
- **Sección Estadio nueva** (menú 🏟️): cabecera (recinto + estado), **Obras** (mantención/remodelación/
  ampliación: pagás ahora, avanza cada semana con barra de progreso, el efecto llega al terminar — `OBRAS_PLAN`,
  `iniciarObra`, `avanzarObras` en tickSemana), y los precios por sector con proyección en vivo (movidos de Finanzas).
- **Época sin redes:** antes de 2008 se oculta la pestaña Redes/Chirp y no hay tuits en el ticker del partido;
  conferencia/prensa usan `PERIODISTAS_CLASICOS` (seed real, pendiente ampliar con Grok).
**Probado:** `node --check` OK; test lógico de `sectoresDe` (16 clubes, ids únicos, cuotas ~1). Falta QA navegador.
**1 línea:** cada club juega en su estadio real con sus tribunas de verdad, que ahora podés arreglar y ver mejorar; y en 1991 ya no hay Twitter.

## Mejora 7.10 · Motor de partido con vida: cancha animada + stats + quiz + tuits
**Archivos:** `js/cancha.js` (nuevo), `js/partido.js`, `js/ui-partido.js`, `js/data-voz.js`, `js/data-tuits.js` (nuevo), `js/data-periodistas.js` (nuevo), `js/mercado.js`, `css/base.css`, `css/aero.css`, `index.html`
- **Cancha animada** (`cancha.js`): canvas 2D puro, dos equipos como puntos que se mueven según empuje/marcador + pelota. requestAnimationFrame propio, posiciones en módulo (sobreviven re-render), se auto-detiene. Respeta prefers-reduced-motion.
- **Stats de transmisión**: `actualizarStats(P,ev)` (posesión viva + remates/al arco/córners); `bloqueStats(P)` bajo la cancha.
- **Quiz más grande**: +18 preguntas de fútbol + `triviaProc(P)` (preguntas inventadas sobre tu club con respuesta real: goles, puntos, rival, estadio, edad/nivel); efecto escalado por nivel del plantel (`m.factor`).
- **Voz 2026**: +181 tuits chilenos (`data-tuits.js`) con memes/jerga; token `{FIGURA}`; resolución de tokens en el ticker; anti-repetición. Contextos autogol / gol_anulado_var / empate_pobre enganchados en `ctxDeEvento` (invicto queda idle).
- **Periodistas reales por época** (`data-periodistas.js`: 1991/2003/2015/2025) con selección por año y anti-repetición.
- **Fichajes**: ojeo/informe de scout (`E.ojeados`) + comisión de representante regateable.
- **Época sin redes** (<2008): sin pestaña Redes ni tuits en el ticker; periodistas clásicos.
- **Estadio**: sección propia con sectores reales por club (`data-estadios.js`) + obras que avanzan.
**Probado:** node --check en todos; QA en navegador headless (cancha, stats, mercado) con capturas; tests de lógica (sectores, periodistas, trivia, contextos).
**1 línea:** el partido dejó de ser un timer — ahora se ve jugar, con stats, quiz procedural y las redes hablando en chileno.

## 7.11 · Tuits aprobados de Grok + apodos meme + contextos nuevos
- **Pisar los genéricos**: para cada contexto que cubre `TUITS_EXTRA` (data-tuits.js), se sacan los tuits viejos del pool base (`TUITS_MOMENTO` en data-voz.js) y quedan SOLO los 240 aprobados (15 x 16 contextos). Lo no cubierto (analogia_dunk) queda intacto. Ahora se ven tal cual.
- **APODOS_MEME**: las cuentas troll (@cuenta_troll, @garrafal_cl, etc.) bautizan al jugador cuando ESE está en cancha — si su nombre resuelto aparece en el tuit y su apellido tiene apodo, se reemplaza (Vidal→Rey Arturo, Palacios→Pala…). Enganchado vía wrap de `empujarTicker` (post-resolución de tokens).
- **Contextos que no son evento de partido** (`descenso_peligro`, `rumor_fichaje`, `invicto`): se disparan desde el ambiente del ticker. descenso_peligro = club en zona de descenso (`posicionEnTabla` >= n-1) con torneo avanzado; invicto = `E.temporada.sinPerder>=5` (contador nuevo en partido.js); rumor_fichaje = chismerío de mercado, baja frecuencia.
**Probado:** node --check; harness de lógica (merge pisa lo viejo, apodo aplica ~55% solo en handles troll, contextos nuevos en el pool).

## 7.12 · Partido conectado con Redes + marca unificada Plop!
- **Guard nuevaPartida**: no crashea con club inexistente en la época (aviso limpio).
- **persistirTicker (redes.js)**: al cerrar el partido, los tuits de la hinchada del ticker quedan pegados en el feed de Plop! (E.timeline) + una reacción de cierre atada al resultado. La conversa sigue después del pitazo, no se muere. Solo 2008+.
- **Marca unificada**: lo que quedaba como "FutbolGram" en el partido ahora es "Plop!" (ticker en vivo + opinión-pista táctica).
**Probado:** node --check; harness (dedupe, orden, reacción por resultado).

## 7.13 · Plop! con vida — motor generativo procedural
- **plop-motor.js (nuevo)**: en vez de elegir 1 de un pool fijo, ARMA la frase con el estado REAL (marcador, minuto, goleador, figura, arquero, rival, racha, posición en tabla). Cada cuenta tiene PERSONALIDAD (voz: exaltado/tierno/irónico/dato/amargado/rival/serio…) y el conjunto tiene MEMORIA (E.plop.hist) para no repetir.
- Envuelve `tuitDeCtx`: 55% genera con estado, si no cae al pool aprobado (no reemplaza, mezcla). Cubre 15 contextos.
- Resultado: "92'+2 y Javier Correa la reventó, NO DA EL CORAZÓN 😭" — tuits que hablan del partido que estás jugando, combinatoria de miles.
**Probado:** node --check; harness generativo (referencia marcador/goleador/minuto/rival reales, varía por tirada).

## 7.13b · Época histórica de Palestino 1978 (real) + fix épocas de clubes solo-2026
- **Palestino 1978 · "La Estrella Árabe"** (data-historia.js): campeón del Nacional 1978, Elías Figueroa de eje, Óscar Fabbiani goleador (35 goles), 44 fechas invicto, DT Caupolicán Peña. Datos reales; el plantel en juego es el 2026 (identidad histórica encima, avisado). Limache NO recibe época: su identidad real es el recién ascendido, no se inventa gloria.
- **Fix (ui.js)**: una época cuyo año mapea a una era donde el club no existe (Palestino 1978 → liga 91) ahora se juega en 2026 sin romper. La U 2011 y demás quedan igual.

## 7.14 · Backend propio (opcional) + cliente + guía de deploy
- **server/index.js**: backend Node PURO (sin dependencias): registro/login con contraseña hasheada (scrypt) + token, guardar/bajar partida en la nube (una por usuario), y /api/datos para actualizar contenido SIN redeploy. CORS listo.
- **js/servidor.js**: cliente fetch opcional (SERVIDOR_CONFIG.base vacío = no hace nada, sigue offline). Login/subir/bajar/datos.
- **SERVIDOR.md**: guía copy-paste Hetzner CAX11 (~€3,79/mes) + Node + Caddy (https auto vía nip.io, sin dominio) + systemd.
- **server/Caddyfile, server/datos/datos.json**: plantillas.
**Probado:** smoke test en vivo (registro→token, subir/bajar, clave mala rechazada, salud). Falta enchufar el login del juego cuando haya IP.

## 7.15 · Cancha pixel-art (chao SVG liso)
- **cancha.js**: se renderiza a baja resolución (~4 px reales por pixel del juego) y se escala con nearest-neighbor (imageSmoothingEnabled=false) → pixel-art de verdad. Césped a franjas pixeladas, líneas/áreas/círculo central chunky, arcos, y jugadores como spritecitos (cabeza + camiseta + sombra) con color del club. Pelota cuadrada. Toda la lógica de movimiento/gol intacta.
**Probado:** node --check + captura headless (se ve retro, sprites y líneas pixeladas).

## 7.16 · Economía explicativa (nunca callejón sin salida)
- **ui.js / Finanzas**: panel "¿Cómo estamos de plata?" arriba de todo. Semáforo (🟢🟡🔴), explica en chileno claro POR QUÉ estás así (flujo semanal, planilla, deuda, sueldos atrasados, clausura, semanas de caja) y da los pasos a seguir apuntando a los botones que ya existen (abonar, crédito, vender en Mercado). Regla de oro visible: siempre hay salida.
**Probado:** node --check. Panel de solo-lectura sobre helpers existentes.

## 7.17 · Plop! hilos — las cuentas se responden entre ellas
- **plop-motor.js**: al postear un hincha en el feed, otra cuenta (con voz distinta) le tira 1-2 réplicas cortas según el tono (bueno/malo/neutro). Se cuelga de postProc y usa el campo `hilo` que ya renderiza el feed (↳). El conjunto se siente conversando, no monologando.
**Probado:** node --check + test de plopReplica (respuestas calzan con el tono y vienen de otra persona).

## 7.18 · Auto-respaldo a la nube (que no se pierda la partida)  ✅ (2026-09-03)
**Archivos:** `js/nube.js` (motor de auto-respaldo), `js/motor.js` (hook en `guardar()`), `js/ui.js` (toggle en Ajustes)
**Qué:** el login en la nube ya existía pero el sync era 100% manual (Subir/Bajar). Ahora, con la sesión
iniciada, cada vez que el juego guarda se **sube sola la partida** a la nube — colchón para que nadie
pierda su carrera por limpiar el navegador o cambiar de equipo. Pensado para compartir con amigos.
- `nubeAutoRespaldo(estado)` en `nube.js`: **solo SUBE, nunca baja ni pisa** tu partida (bajar sigue
  manual y con confirmación). Debounce de ~5s con **coalescing**: una ráfaga de guardados = 1 sola subida
  del estado más nuevo. Guardas: no hace nada si la nube no está configurada, si no hay sesión, si el
  auto-respaldo está apagado, o si el estado no tiene club.
- Hook de una línea en `guardar()` (motor.js), envuelto en try/catch y `typeof`-guard → si `nube.js` no
  está o falla, `guardar()` anda igual.
- **Ajustes → Cuenta en la nube**: toggle **Automático (recomendado) / Solo manual** (`nubeAutoActivo`/
  `nubeAutoSet`, default ON) + muestra "último respaldo: …" (`nubeUltimoRespaldo`).
**Probado:** node --check (3/3) + test de lógica: ráfaga de 3 guardados → 1 subida del estado más nuevo,
timestamp guardado, y NO sube con auto OFF / sin login / sin club (0 extra en los 3 casos).
**1 línea:** con la cuenta iniciada, la partida se respalda sola en la nube tras cada guardado — sin perder nada.
**Riesgos:** aislado en nube.js + 1 línea guardada en guardar(). Bajo.

## 7.19 · Configurar la nube DENTRO del juego (sin editar archivos ni exponer llaves)  ✅ (2026-09-04)
**Archivos:** `js/nube.js` (config efectiva + prueba de conexión), `js/ui.js` (formulario en Ajustes)
**Qué:** para prender el login ya no hace falta editar `nube.js` a mano. Si `NUBE_CONFIG` está vacío,
el juego lee la config que el admin **pega en Ajustes → Cuenta en la nube** (URL + anon key), guardada
en `localStorage` de ESE navegador — nunca en el repo, nunca pasa por el dev.
- `nubeConfig()`: config efectiva (baked manda; si no, la pegada a mano). `nubeGuardarConfig(url,key)`
  (normaliza la URL, saca barra final), `nubeConfigManual()`, `nubeProbar(url,key)` (valida formato
  `https://xxxx.supabase.co` + hace un GET a `/auth/v1/settings` con la anon key → OK / 401 / sin conexión).
  `nubeActiva`/`nubeHeaders`/`nubeFetch` ahora usan `nubeConfig()`.
- **Ajustes**: cuando la nube NO está configurada, aparece un formulario (URL + anon key) con "Probar
  conexión" y "Guardar y activar"; una vez guardada, aparece el login normal + "Cambiar conexión a la nube".
  Nota clara: la anon key es pública a propósito; la `service_role` NUNCA se pega.
**Seguridad:** el dev/IA nunca toca las credenciales del usuario. Crear el proyecto Supabase y pegar las
llaves es 100% del usuario; el juego solo las lee de su propio navegador.
**Probado:** node --check (3/3) + test de lógica 9/9 (activa/manual/normaliza URL/prueba OK-URLmala-401/borrar)
+ smoke navegador (form con 2 campos y 2 botones renderiza en Ajustes, consola limpia).
**1 línea:** ahora prendés el login pegando 2 valores dentro del juego — sin tocar código y sin que las llaves salgan de tu navegador.
**Riesgos:** aislado en nube.js + un panel en Ajustes. Bajo.

## 7.21 · Plop! memoria entre partidos
- **plop-motor.js**: al cerrar un partido se registra el resultado en `E.plop.racha`/`ultRes`. Si hay quiebre de racha (venías de N derrotas y ganaste, se cortó una buena, van N al hilo…), una cuenta lo comenta en el feed con el "callback": "después de 3 fechas funándolos, hoy toca callar bocas". Se cuelga de persistirTicker. Solo 2008+.
**Probado:** node --check + harness (racha de 3 derrotas → callback; victoria posterior → callback de quiebre; racha/ultRes se actualizan).

## 7.22 · Momentazo — flash grande en el gol/roja/penal
- **ui-partido.js**: banner grande y de color arriba del marcador cuando cae un gol (verde propio / rojo rival) o una jugada grave (roja, penal, gol anulado, autogol). Se detecta comparando el marcador y las líneas graves entre renders; dura ~6 ticks y se va. Sin tocar el motor.
**Probado:** node --check + captura headless (banner "¡GOOOL de Colo-Colo!" sobre el marcador; cancha pixel visible en el partido).
