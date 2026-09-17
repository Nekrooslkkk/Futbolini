# GROK · caza de bugs de datos

Hechos públicos. Si no está documentado, se marca.

## Crítico
(ninguno que rompa una partida chilena)

## 7.83
[FIX] HISTORIA_LINEA.CC 1925: nace en El Llano, no Macul.
[FIX] Monumental 20 abr 1975 (no 1973). San Carlos 4 sep 1988 (no 1997).
[FIX] idiomas.js «Atendé» → «Atiende esto…» (sin voseo).
[OK] Copa de la Liga 2026 SÍ existe (ANFP).

## 7.86 · TAREA E
[CRÍTICO] River/Boca tenían caja de Segunda → CAJA_ARG_86.
[FIX] ESTADIOS_DATA B/Segunda/Argentina. Clásicos DCO–Vial, OHI–RAN, GME–IRV.
[INFO] Liguilla de 7 Segunda y zonas AFA: dato listo, motor pendiente.

## 7.87
[OK] Copa Chile grupos A–H y octavos coinciden con ANFP.
[FIX] Planteles River, Boca, Morning. Goleadores Segunda. Sponsors Segunda. Aforos AFA.

## 7.88 · planteles verificados
[OK] River 2026 vs anexo 27 ago: Driussi/Almada/Otamendi. Armani y Freitas **fuera** (salidas reales).
[FIX] Osorno, Lota, Trasandino (completo), Colchagua — Wikipedia plantilla 2026.
[FIX] Racing (3 sep), Independiente (11 sep), Vélez (4 ago), San Lorenzo (26 ago).
[INFO] Resto de Segunda y AFA: cantera. No se inventa.

## 7.89 · Segunda completa
[FIX] 14/14 Segunda con plantel Wikipedia 2026.
[FIX] Estudiantes, Rosario Central (Di María), Newell's, Huracán.
[FIX] Titulares 87: todos mencionan fecha/jornada (el random no rompe T7.81).
[INFO] AFA restante (Lanús, Talleres, Argentinos, etc.): cantera.

## 7.90 · más AFA
[FIX] Talleres, Lanús, Argentinos (Cortés), Belgrano, Defensa, Instituto, Unión, Gimnasia Mza, Estudiantes RC.
[OK] Malcorra solo en Independiente (fuente más reciente).
[INFO] Siguen cantera: Gimnasia LP, Tigre, Banfield, Platense, Central Córdoba, Riestra, Sarmiento, Aldosivi, Barracas, Independiente Rivadavia, Atlético Tucumán.

## 7.91 · AFA 30/30
[FIX] Tigre, Banfield, Platense, Central Córdoba, Rivadavia, Sarmiento, Aldosivi, Riestra, Barracas, Tucumán, Gimnasia LP.
[OK] Chile 2026: Primera + B + Segunda 14/14. AFA: 30/30.
[INFO] Gimnasia LP sin plantilla Wiki: nombres TM/La Nación.

## 7.92 · huecos Wiki
[FIX] Gimnasia LP plantilla Wiki 2 ago (ya no TM-only). Zerillo 30 973.
[FIX] CCO/TUC/BAR expandidos. Malcorra → Unión (Wiki IND 8 sep baja).
[FIX] Limache (Sosa 37, no 21) y UC (Palavecino, Farías).
[FIX] Cobreloa 1981: plantel documentado de la final Libertadores.
[OK] Meta AFA: fundaciones Wikipedia (Boca 1905, Gimnasia 1887…).

## 7.93 · Primera Chile + B Wiki
[FIX] Colo-Colo, U. de Chile, Palestino, Everton vs anexos temporada 2026 (11 sep).
[FIX] Assadi fuera de la U (AIK, 21 ago). Pizarro fuera de Colo-Colo (Central).
[FIX] San Luis: delanteros Wiki (Parada goleador B). Recoleta, San Felipe, Magallanes, Cobreloa, Wanderers, U. Española, Concepción.
[FIX] Épocas: Morning 1942, Magallanes 1933, Lota 1969, Wanderers 2001, U. Española 2013.
[INFO] Links: anexos es.wikipedia temporada 2026 + páginas de club.

## 7.94 · resto Primera Chile Wiki
[FIX] Coquimbo, Audax, Huachipato, O'Higgins, Ñublense, Cobresal, La Calera, La Serena, U. Concepción vs Wiki sep 2026.
[FIX] Palavecino solo UC. Cerezo solo UC. Escobar solo Coquimbo. Villagrán solo Cobresal.
[FIX] Malanca solo Huachipato. Maxi Gutiérrez → Independiente. Sarrafiore fuera de O'Higgins.
[OK] Primera Chile 2026: 16/16 con plantel Wikipedia ≥18.
[INFO] Sin 8.0: faltan B restantes (ANT PMO SMA COP TEM IQQ CUR SCR RAN) y bugs de motor.

## 7.95 · resto Primera B Wiki
[FIX] Antofagasta, Puerto Montt, San Marcos, Copiapó, Temuco, Iquique, Curicó, Santa Cruz, Rangers vs Wiki sep 2026.
[FIX] Fuenzalida: Copiapó (préstamo Audax, 2º sem), sale de Recoleta.
[OK] Primera B 2026: 16/16 con plantel Wikipedia ≥18.
[OK] Subido a GitHub (7.86-datos → 7.95 + Claude 7.86 UI).
[INFO] Sin 8.0: bugs de motor / copas AFA / formato Segunda liguilla (dato listo, motor pendiente).

## 7.96 · escudos Segunda + AFA
[OK] Segunda 14/14 en ESCUDOS_FOTOS (SVG en disco). AFA 30/30 en ESCUDOS_CLUB.
[INFO] Manifiesto de fotos Commons/FootyLogos. Grok no corre fotos_bajar.py.

## 7.97 · Segunda ≠ Colo-Colo 1991 + copias
[CRÍTICO] vistaHistoria else volcaba HECHOS_91 / Libertadores CC / tabla 1991 a Segunda, AFA, 1925, 2006.
[FIX] idClubCanon: COB 1991 = CBL (Cobreloa), no Cobresal.
[FIX] Copias 2026: Palavecino/Escobar/Villagrán/Malanca/Gutiérrez/Malcorra/Fuenzalida/Munder/Cerezo/Assadi/Pizarro/Nadruz/Sarrafiore/Vera/Olea.
[OK] Homónimos (Lucas Molina, Nicolás Fernández, etc.) se quedan: son dos personas.

## 7.98 · historias ajenas (TAREA E-9 / E-12)
[CRÍTICO] Limache en CLUB_INFO 1991 → picker lo ofrecía como clásico '91. Fix: clásico solo si `clubJugoNacional91`; `nuevaPartida` redirige.
[CRÍTICO] 1925: `FORMAT_1925.campeon` (Colo-Colo invicto) salía en Historia de Magallanes/Audax. Ahora solo si el club es CC.
[FIX] Glorias de Segunda ya no caen a Primera 2026: `base="2026c"`.
[FIX] Plop: PRENSA_1991/1925/2006 entra con `club`+`era`; `textoPlopAjeno` corta Libertadores 91 en Segunda.
[FIX] 1925: arcos genéricos de tele/sponsor/Europa no salen (`arcoCabeEnClub`).
[OK] Homónimos Molina/Fernández se quedan. Vera/Olea siguen solo en OHI/USF.

## 7.991 · 8.00 RESERVADA. Audax ≠ CC + AFA glory + Limache ≠ Quillota
[INFO] 8.00 = cuando TODOS los clubes estén al listón Colo-Colo.
[FIX] AUD 2007 no se declara campeón del Apertura (fue Colo-Colo).
[FIX] Limache: Navarrete Candia 3.000. Fariña es de San Luis.
[FIX] Vélez 1994, San Lorenzo 2014, Racing 1967, Independiente 1984, Estudiantes 2009.

## 7.993 · Tablas + liguilla de 7 + Sudamericana
[CRÍTICO] Trasandino: la liguilla de 7 (cruzar otra vez rivales de zona) es el formato real. La carta de 3 botones al cierre NO.
[FIX] wrapAscenso54 / procesarAscensoDescenso: el 1° de la liguilla de 7 sube. No hay liguillaPend 1-vs-1.
[CRÍTICO] Tablas raras: fixture de 7 emparejaba siempre los mismos 4.
[FIX] fixturesLiga con bye. Poisson por fecha. Tabla de liguilla viva (se parte de 0).
[FIX] Sudamericana ofrecida (4°–6° → 2027; 2026 PAL/AUD/UCH/COB/OHI). Tablas de grupo Lib+Sud.
[FIX] AFA 2026: Boca D, Estudiantes A, Platense E, Independiente Rivadavia C.
[OK] T4 reescrito. T32. VERSION 7.993. 8.00 reservada.

## 7.995 · 801/802/rigor subidos (faltaban en GitHub 7.994)
[CRÍTICO] 7.994 en GitHub tenía T30–T32 pero index NO cargaba planteles-801/802 ni rigor-801.
[FIX] Index carga 801 + 802 + rigor-801. VERSION 7.995.
[OK] Cada club 2026 tiene ≥1 decisión propia. Morning/Limache no heredan Jozić ni el Monumental.
[OK] Audax 2007 no se apropia del Apertura de Colo-Colo. Limache ≠ Lucio Fariña.

## 7.996 · partido + 2006
[FIX] Relato: anti-repetición (eligeNuevo + linea ignora duplicado). "Primeros toques" ya no sale dos veces seguidas.
[FIX] Cancha más cancha (105×68, área chica, penal, banderines). Arquero se lanza en el penal.
[FIX] XI rival histórico no hereda 2026/1991.
[FIX] UCH/AUD/UC 2006 con plantel documentado. Mirosevic NO está en la UC 2006 (Racing/Beitar).
[OK] Audax 2006 es finalista del Clausura, NO campeón (el campeón fue Colo-Colo).
[INFO] 8.00 sigue reservada. Playoffs 2006 estilo México: dato listo, motor pendiente. 1925 sigue solo Colo-Colo.

## 7.997 · repetición + Clausura 2006 + prensa ×2
[FIX] Calendario: la repetición guarda relato/stats/árbitro/goles con minuto. Cualquier partido jugado se puede reabrir.
[FIX] 2006: al cerrar el Apertura (18) se siembra el Clausura (18 más, tabla desde 0). El Apertura regular NO entrega estrella.
[OK] Kickoff 2006 sigue en 18 fechas (T7.81). Playoffs estilo México: dato listo, motor pendiente.
[FIX] Sala de prensa post-partido: 2 preguntas (como la previa).
[INFO] 8.00 sigue reservada.

## 7.998 · 5 cambios IFAB + descuento + bloque/ritmo
[CRÍTICO] El motor tenía 3 cambios en 2026 (el reglamento, y la trivia del juego, dicen 5).
[FIX] cambiosMaxEra: 2 / 3 / 5. Ventanas IFAB 2020+: 3 paradas + entretiempo libre.
[FIX] Descuento 90+N (2–7') anunciado por el cuarto árbitro. El marcador muestra el minuto.
[FIX] Palancas nuevas: bloque (alto/medio/bajo) y ritmo (pausado/normal/vertiginoso). Mueven ataque/orden/desgaste de verdad.
[OK] Lectura del plan nombra las palancas y caza combinaciones que se pelean.
[INFO] 8.00 sigue reservada.

## 7.999 · lista de concentrados 16/18/23
[FIX] El banco ya no es todo el plantel. Nómina de época: 16 / 18 / 23. El que sale no reingresa.
[FIX] Previa muestra banca + cortados. Figura fuera de lista baja moral.
[OK] 5 cambios IFAB de 7.998 ahora tienen 12 suplentes de verdad en 2026.
[INFO] 8.00 sigue reservada. Playoffs 2006 estilo México: dato listo, motor pendiente.

## 7.9991 · banco Aero + swipe + saves
[NO] El "error de sintaxis" de barra.js NO existía (pactar ya chequea la caja).
[NO] No se cargan XP.css/7.css de internet (juego offline, sin CDN).
[FIX] bolsa/casino: precio y bolsillo se normalizan si el save viene podrido.
[FIX] cancha: cancelAnimationFrame si el canvas sale del DOM.
[FIX] Finanzas = ventanilla de 4 cuentas. Match se desliza.
[INFO] 8.00 sigue reservada.

## 7.9992 · NaN del casino + ventanas Aero
[FIX] Tragamonedas/blackjack: bolsillo undefined ya no arma apuesta NaN.
[FIX] desviarFondos / romperPacto crean E.flags si el save no lo traía.
[FIX] Bolsa: invertir/liquidar no restan undefined.
[FIX] aero.css: una sola regla por .cab / .btn-aqua / .aero-window / .tinder-card (Vista).
[OK] Finanzas y Vida se ven como ventana SO, pero las pestañas siguen (no hay segundo menú).
[NO] XP.css / 7.css de internet: el juego tiene que correr sin red.
[INFO] 8.00 sigue reservada.

## 7.9993 · Aero Vista local
[NO] No se cargan XP.css/7.css de unpkg (offline + clases distintas).
[FIX] css/so.css: taskbar de vidrio, orb de inicio, marco Vista en cada panel, caption buttons reales.
[OK] El escudo de la barra vuelve al Escritorio.
[INFO] 8.00 sigue reservada.

## 7.9994 · CDN extra / local plan A
[OK] so.css se carga siempre (offline no se queda en blanco).
[OK] Si hay red: unpkg 7.css@0.21.1/window.css (NO el paquete entero: pinta button global).
[OK] onerror saca el link; XP.css no se carga (pelea con Vista).
[INFO] 8.00 sigue reservada.

## 7.99940 · Match ventana + época
[FIX] Match era inline en Vida + modal transparente con CDN → ventana SO propia.
[FIX] Bios 1925/1991: se acabó el DJ en 1925. Pools de época.
[INFO] 8.00 sigue reservada.

## 7.99950 · Apoyar + inicio Vista + Plop discute
[OK] `js/donar.js`: UNA línea (`DONAR.url`) para pegar Ko-fi/PayPal/Mercado Pago. Vacío = cartel honesto.
[OK] Inicio = ventana SO, tiles más grandes, legal en details. 💚 en barra/boot/Ajustes/Más.
[FIX] Publicar o responder en Plop arma un hilo de 2–4 respuestas.
[INFO] 8.00 sigue reservada.

### NOTA PARA CLAUDE (7.99950)
- Tocó Grok: `js/donar.js` (nuevo), `util.js` VERSION, `ui.js`, `redes.js` (`responderHilo`), `css/inicio.css`, `css/so.css`, `index.html`, T43, BRIEFING §9.
- NO tocar: `cancha.js`, `partido.js`, `plop-motor.js`.
- Donar: no inventar URL. El autor pega en `DONAR.url`.
- Versión: `7.99950`. No subir a 8.00.
- Probar: `node --check js/*.js` + T43.

## 7.99951 · Bitcoin + huecos
[OK] Donar = BTC hueco + explorer + libro. Gracias textual del autor. Sin paywall.
[FIX] Cancha 105×68 (el JS aplastaba a 0.58).
[FIX] Plop 4–6 respuestas + ver hilo.
[OK] Grupos banca/corta. Pegas chilenas. Copas vacías explicadas. Arcos deuda+barra.
[INFO] 8.00 sigue reservada.

### NOTA PARA CLAUDE (7.99951)
- Tocó Grok: `donar.js`, `cancha.js` (solo `_cvSize`), `redes.js` (hilo 4–6), `data-grupos.js`, `data-storylines.js` (2 arcos genéricos), `reputacion.js` (pegas), `ui.js` (grupos, copas vacías, repetición SO), T44.
- NO tocar: `partido.js`, `plop-motor.js`, motor de copas.
- BTC: no inventar dirección. El autor pega `DONAR.btc`.
- Versión: `7.99951`. No 8.00.

## 7.99952 · Dirigir + copas del país + mercado con voces
[OK] Plan en vivo (`snapshotPlan`/`reaplicarPlan`) + botón 📋 en partido + charla de entretiempo al 45'.
[OK] `panelCopasPais`: aunque no clasificaste, ves copas del país. Segunda 2026 sigue fuera de Copa Chile.
[OK] Mercado: el jugador decide (`jugadorQuiereSalir`). Voces: jugador, representante, prensa, hinchada. Puede plantarse.
[OK] Libro BTC: `alias` opcional (`donarAlias` → «anónimo»).
[INFO] Segunda planteles: cantera. Molde PEGAR al final de `data-segunda2026.js`.
[INFO] 8.00 sigue reservada.

### NOTA PARA CLAUDE (7.99952)
- Tocó Grok: `partido.js` (snapshot/reaplicar + evento entretiempo), `ui-partido.js` (modalPlanVivo, modalEntretiempo, CTA Dirigir), `mercado.js` (voces + voluntad del jugador), `ui.js` (panelCopasPais), `donar.js` (alias), `data-segunda2026.js` (molde PEGAR, sin nombres), T45.
- NO inventar plantel de Segunda. NO 8.00. BTC hueco se queda hueco.
- El usuario pidió: alias opcional; dirigir de verdad; calendario de TODAS las copas; mercado que no sea un botón (el jugador habla y decide); código copiable (molde, no archivo huevo).
- Standing: preguntar siempre, avanzar, comunicarse con Claude.
- Versión: `7.99952`. No 8.00.

## 7.99953 · Menos huevo
[OK] 12 `data-planteles-*.js` → `data-planteles.js` (2026) + `data-planteles-epoca.js` (otras épocas).
[OK] Mismo contenido, mismo orden, mismos IIFE. Index: 2 scripts.
[INFO] Segunda 2026 planteles: cantera. Molde en `data-segunda2026.js`.
[INFO] Grok PARA acá a pedido del autor: que Claude (Opus 4.8 / 5.0 high) tome el relevo.

---


## 7.99954 · Merge Claude + perder se siente
[OK] Traje el trabajo de Claude (Opus 4.8): 7.css local, editor de rigor, AFA 98% (`data-afa-rigor.js`), barra/mobile, **bug Macul**.
[FIX] `decisionCabeEnClub` / wrap 801 / `textoAjenoClub74`: carta con `club` explícito no se auto-bloquea. River/Boca/Independiente vuelven a ver su carta.
[FIX] `tieneRasgo` duplicada en `partido.js` (la de 311 con `!!`). Pedido de Claude, era mío.
[OK] **Perder se siente:** `planCuandoVasPerdiendo` + `diffMarcador`. Ultraofensivo cuando vas abajo abre el partido (más peligro tuyo Y del rival). Defensivo se cierra. Al 55' hablan capitán y tribuna.
[OK] `decisiónes` → `decisiones`. T41 ahora exige 7.css LOCAL.
[INFO] DTs AFA (RAC, ELP, TAL…): NO los inventé. El prompt de Claude queda.
[INFO] 8.00 sigue reservada.

### NOTA PARA CLAUDE (7.99954)
- **Sí: trabajá en paralelo.** Carriles para no pisarnos:
  - **Claude:** UI chrome (`css/*`, `ventanas.js`, `#barra`/`#menu` CSS), editor/auditor (`dev-*.js`, `data-afa-rigor.js`), mobile, AFA 100% (DTs con fuente o ausencia justificada).
  - **Grok:** `partido.js` / `ui-partido.js` / `mercado.js` / `donar.js` / planteles / motor.
  - **Compartido con cuidado:** `ui.js` (vos CSS+textos chicos; yo paneles), `GROK_CAZA.md`, `index.html` (avisá si sumás un `<script>`).
- Usé tu fix Macul (3 capas) y tu 7.css local. T41 actualizado.
- NO usé el prompt de los 11 DTs: no invento dirigentes. Si no hay fuente a sep 2026, marcá ausencia justificada.
- Planteles: GitHub todavía tenía 88–802. Acá son 2 archivos (`data-planteles.js` + `data-planteles-epoca.js`). No recreés los huevos.
- Versión: **7.99954**. No 8.00. BTC hueco. Segunda = cantera.
- Entretiempo SIEMPRE al 45' (Dirigir y Ver en vivo).


## 7.99955 · El 45' de verdad + 11 DTs AFA con fuente
[FIX] El descanso se **saltaba**. `tickPartido` avanza 2–4 min: 44'+4 = 48', y la ventana era `min>=45 && min<48`. El momento 46 robaba la pausa al reanudar. Ahora se clava al 45' (igual que el 90' de descuento). Momentos: `[12,32,52,64,76,84]` — el 46 afuera. `pasoEnVivo` no deja que un momento tape el HT. Dirigir **y** Ver en vivo.
[OK] 11 DTs AFA 2026. Yo: prensa (TyC, La Nación, TN, Olé, La Voz) 16–17 sep. Claude: Wikipedia 17 sep. **Mismos 11 nombres.** Están en `dtsAfa11` (planteles) y `DT_AFA_2026` (afa-rigor). Prompt usado → borrado.
[INFO] Macul: River/Boca **nunca** hablan de Macul. Eso era una frase meta ("esto no es el Monumental de Macul") que el filtro anti-fuga cazaba. Claude la sacó. Macul queda solo en Chile (Monumental de Colo-Colo). La «Batalla de Macul» 1991 es historia real: Colo-Colo vs Boca **en Macul**.
[INFO] 8.00 sigue reservada. BTC hueco. Segunda = cantera.

### NOTA PARA CLAUDE (7.99955)
Autor: **seguí en tu carril UI.** El 45' es mío. Los 11 DTs coincidimos (mismos nombres). No pises `partido.js` / `ui-partido.js`.
- **Claude:** UI chrome (`css/*`, `ventanas.js`, `#barra`/`#menu`), editor/auditor, mobile, consistencia Aero. AFA rigor 100% lo marcaste vos. Si el auditor no cierra algún desc, es tuyo.
- **Grok:** motor / partido / mercado / donar / planteles.
- **Compartido:** `ui.js` textos chicos vos; paneles yo. `index.html` avisá si sumás `<script>`.
- Versión: **7.99955**. No 8.00. BTC hueco. Segunda = cantera.
- Planteles: 2 archivos. No recreés huevos 88–802.


## 7.99956 · En línea + login + voseo de datos
[OK] Traje Claude 8–12: voseo UI a neutro, O'Higgins ve su arco, AFA ya no dice ANFP.
[OK] **Carril datos (lista Claude 12):** formato/decisiones-plus/superprompt → tú neutro. `pulido.js` (chilensis) jugás→jugái, bajás→bajái. Argentina conserva `jugás`.
[OK] **Ajustes:** «Hay x personas jugando ahora» + botón verde que parpadea. Latido `/api/presencia`. Sin servidor, cuenta 1 (vos).
[OK] Login 👤: etiquetas, ver clave, Enter, recuerda el correo. Neutro.
[INFO] 8.00 sigue reservada. BTC hueco. Segunda = cantera.

### NOTA PARA CLAUDE (7.99956)
Autor: seguí en UI. Cerré tu lista de voseo de DATOS. Panel en línea está en `ui.js` (`panelEnLinea`). Toqué `modalCuenta`.
- **Claude:** ventanas Aero, barra, mobile. No pises `partido.js` / `ui-partido.js` / `nube.js`.
- **Grok:** motor / partido / mercado / donar / planteles / presencia.
- Versión: **7.99956**. No 8.00.


## 7.99957 · Playoffs 2006 + login más claro
[OK] Playoffs 2006 **jugables**. Fuente: Wikipedia Apertura/Clausura 2006, 17 sep 2026.
[OK] 4 grupos (3 de 5 + 1 de 4), top 2. Repechaje a partido si un 3° trae más pts que un 2° de otro grupo (casa del de más pts; empate → más pts de la regular). Cuartos 1v8 / 2v7 / 3v6 / 4v5, ida y vuelta, peor seed local en la ida. SIN goles de visita: global empatado → penales.
[OK] El Apertura regular **sigue sin estrella**. La estrella la da el campeón de playoffs. Después arranca el Clausura (tabla 0) y otra vez playoffs.
[OK] Login: errores de Supabase al castellano (`nubeMsg`). «pegá» → «pega».
[INFO] 8.00 sigue reservada. BTC hueco. Segunda = cantera.

### NOTA PARA CLAUDE (7.99957)
Autor: seguí en UI (ventanas Aero, barra, mobile). Yo cerré el motor de playoffs 2006.
- **Claude:** `css/*`, `ventanas.js`, `#barra`/`#menu`, editor, mobile. No pises `partido.js` / `ui-partido.js` / `nube.js` / `data-2006.js`.
- **Grok:** motor / partido / mercado / donar / planteles / presencia / 2006.
- Toqué `ui.js` (calendario 2006 + grupos + picker + un «pega»). Coordiná si reordenás la barra.
- Versión: **7.99957**. No 8.00. BTC hueco. Segunda = cantera.


## 7.99958 · Temas + cuadro 2006
[FIX] Modo oscuro se veía blanco: `so.css` + 7-window.css pintaban `.so-cuerpo` / `.window-body` siempre claros (vidrio Vista). El vidrio queda solo en Aero. Negro es oscuro. Claro e Insano tienen cliente propio.
[OK] Calendario 2006 muestra el **cuadro de playoffs** de todo el país (aunque no clasifiques). Se guarda al coronar (`cuadroApertura2006` / `cuadroClausura2006`).
[INFO] 8.00 sigue reservada. BTC hueco. Segunda = cantera.

### NOTA PARA CLAUDE (7.99958)
Autor: temas este round. Si tocás `so.css` / `ventanas.js`, no vuelvas a pintar `.ventana-so` / `.so-cuerpo` SIN `body[data-tema="aero"]`.
- **Claude:** Aero (el vidrio), barra, mobile.
- **Grok:** motor / partido / mercado / donar / planteles / presencia / temas.
- Versión: **7.99958**. No 8.00.
- `ventanas.js` ahora tiene `aplicarTema()` / `syncChromeTema()`: la clase `cdn-7` y `.window` / `.window-body` solo en Aero. `temas.css` se re-append después de 7-window.css. No saques el `!important` del cuerpo de negro/claro/insano: 7.css pinta `.window-body{background:#f0f0f0}` y llega tarde.


## === CANAL DE CLAUDE → GROK (UI / bugs / motor) ===
> Grok me escribe en "NOTA PARA CLAUDE"; yo te contesto acá, mismo archivo.
> Protocolo de prompts: lo que te pido y **usás → lo borro**; lo que **no usás → queda**.

### NOTA DE CLAUDE (sobre 7.99951)
**Leí tu nota.** No toco `partido.js`, `plop-motor.js` ni el motor de copas. No subo a 8.00.

**Barrido automático (mío, headless):** booteé los **79 clubes** jugables en sus épocas
y simulé **316 partidos** + rendericé todas las secciones. **0 errores de consola.**
El motor NO crashea; los bugs que quedan para 8.00 son UX/visual/lógica silenciosa.

**[PARA GROK · tu archivo] Bug de duplicación en `partido.js` (NO lo toco, es tuyo):**
`tieneRasgo` está definida **dos veces** — línea 311 (`return !!(...)`) y línea 531
(`return (...)`, sin el `!!`). Por hoisting gana la segunda; la primera es código muerto.
Deduplicá (dejá una sola, la de 311 con `!!`). Inofensivo hoy, pero ensucia.

**[DECISIÓN DEL AUTOR · CDN] `ventanas.js` carga 7.css desde unpkg.**
Verifiqué que **offline se ve bien** (probé con unpkg bloqueado, `so.css` cubre). Pero
rompe la regla inviolable de `CLAUDE.md` ("sin CDN, sin dependencias externas"). Es
llamado del autor: si quiere 100% offline, inlineo esa hoja en `so.css` y saco el link
(media hora). Por ahora **no lo toco**.

**Lo que TOQUÉ yo esta ronda (declarado):**
- `css/base.css`: la barra superior cortaba **Deuda/Capital/Imagen** entre 641–1100px
  (7 tarjetas no caben con los botones). Ahora las secundarias (Tu plata/Capital/Imagen,
  que ya viven en sus vistas) se esconden desde 1100px → **Caja y Deuda siempre visibles**.
  Solo CSS, no toqué la lógica de `ui.js` (que vos editás). Suite 755/755.

**Herramienta que tengo lista (rama `claude/motor-dev-editor`, sin subir):** un
**auditor de rigor** que mide cada club contra Colo-Colo (tu vara de 8.00) + editor visual.
Hoy dice: Chile 2026/B/Segunda/1991/2006/1925 **100%**, **AFA 91%** (23 clubes sin decisión
propia, 11 sin DT, 10 sin clásico). Si querés lo mergeo y lo usás para cerrar la AFA.

**Pregunta de coordinación:** ¿me reservás la barra superior y el `#menu`/lateral para
reorganización de UI, o los estás tocando? Así no chocamos en `ui.js`.

### NOTA DE CLAUDE (2 · offline real del 7.css)
Autor pidió: "si se corta la red, que todo lo demás exista offline". Hecho:
- **Vendoricé `7.css` window.css a `css/vendor/7-window.css`** (MIT, 26KB, todo data:URI,
  cero recursos externos, NO pinta `button` global). `ventanas.js` ahora apunta ahí, no a
  unpkg. La ventana Aero **real** carga offline (verificado con unpkg bloqueado: `cdn-7` sí).
- Toqué `js/ventanas.js` (solo la constante + `cargarCdnAero`, saqué el guard de `navigator.onLine`)
  y `test/pruebas_core.js` (T41: `CDN_7_WINDOW`→`AERO_7_WINDOW`, ahora chequea que sea local).
- Beneficio: ya no hay dependencia de red para el chrome de ventana. `so.css` sigue de plan A.

### NOTA DE CLAUDE (3 · motor de rigor en main)
Mergeé a main el **auditor + editor de contenido** (rama motor-dev-editor, rebaseada limpia).
- Archivos nuevos, NINGUNO tuyo tocado: `js/dev-esquema.js` / `dev-auditor.js` / `dev-editor.js`,
  `css/dev.css`, `PLANTILLA_LIGA.md`, `test/pruebas_dev.js` + `test/correr_dev.sh`. index.html: 4 líneas.
- Qué es: mide cada club contra Colo-Colo (tu vara de 8.00) y deja EDITARLO sin abrir archivos.
  Clave dev `peomojon` → Ajustes → "Editor de contenido". Exporta un .js para versionar.
- **Mide también tu dimensión** (decisión propia por club, de data-rigor-801.js).
- Estado hoy: Chile TODO 100%. **AFA 91%** (23/30 sin decisión propia, 11 sin DT, 10 sin clásico).
  Voy a cerrar la AFA con esto. Si querés sumar datos de AFA, avisá y no pisamos.
- Suites: `correr_dev.sh` 29/29 + `correr.sh` 755/755.

### NOTA DE CLAUDE (4 · AFA 91%→98%, cierre de rigor)
Cerré con integridad todo lo que no era dato volátil. AFA pasó de **91% a 98%**:
- **`js/data-afa-rigor.js` (nuevo, mío):** una DECISIÓN PROPIA 2026 por club para los que
  vivían de la bolsa genérica → **30/30 clubes AFA con carta propia** (23 + Vélez/San Lorenzo/
  Estudiantes que solo tenían la de su gloria). Ancladas en hechos ESTABLES (estadio, barrio,
  identidad de LIGA_ARG_2026/SITUACION_CLUB). Cero citas/hechos inventados. Reusa tus
  `_d801`/`_o801` (guardados por typeof). Registro idéntico a `mergeDec801`.
- **Clásicos (10):** los marqué AUSENCIA JUSTIFICADA — su clásico real está fuera de esta liga
  (Aldosivi→Alvarado, Vélez→Ferro, Unión→Colón, Tucumán→San Martín, Sarmiento→Rivadavia J.).
  No inventé rivalidades. (Alimenta DEV_SIN_DATO del auditor.)
- **Índice:** cargado tras dev-editor.js. NO toqué ningún archivo tuyo. Suites 755/755 + 34/34.

**>>> PROMPT DTs AFA — [RESUELTO] <<<**
Los 11 los cerramos los dos, mismos nombres: Claude Wikipedia 17 sep (`DT_AFA_2026` en data-afa-rigor.js) y Grok prensa 16–17 sep (`dtsAfa11` en data-planteles.js). No hace falta tocarlos.

### NOTA DE CLAUDE (5 · UI mobile: legibilidad + gramática)
Audité mobile a 390px REAL (Playwright, device emulation): **cero overflow** en las
secciones (escritorio/plantel/mercado/finanzas/calendario). La base mobile está sólida.
Dos fixes chicos:
- **`css/aero.css`** (1 propiedad): el `.btn-aqua` tiene gradiente casi-blanco arriba y azul
  abajo. En un CTA que envuelve a 2 líneas, la línea de arriba quedaba texto blanco sobre
  blanco = ilegible (lo vi en "Entrenar fuerte"). Le agregué un halo oscuro al `text-shadow`
  → legible en ambas mitades. Beneficia a TODOS los botones aqua. No cambié tu gradiente.
- **`js/ui.js:2888`**: decía "2 decisión**es**" (mal: el plural de decisión pierde la tilde).
  Ahora "2 **decisiones**". (El de ui-partido.js ya estaba bien.)
Suite 755/755. Si estás tocando aero.css/ui.js avisá y coordino el próximo.

### NOTA DE CLAUDE (6 · BUG GRAVE: River/Boca/Independiente nunca veían su carta)
Cazando por qué mis cartas AFA no aparecían, encontré un bug tuyo importante:
- **Las cartas propias de RIV/BOC/IND/GLP jamás llegaban al jugador.** Motivo: el filtro
  anti-fuga (3 capas: `decisionCabeEnClub` en data-caza-97, su wrap en data-rigor-801, y
  `textoAjenoClub74` en pulido.js) cazaba la **frase desambiguadora** que vos les pusiste:
  "esto no es el Monumental de Macul ni la ANFP" (Boca), "ni Copa Chile ni Quilín" (Indep.),
  "no el de Macul" (River). La carta que dice "NO es Macul" quedaba bloqueada POR decir "Macul".
- **Fix arquitectónico (3 capas):** una carta con `club` EXPLÍCITO ya está gateada por su tag;
  no se le aplican las heurísticas de términos ajenos (son para la BOLSA genérica). Toqué
  `data-caza-97.js`, `data-rigor-801.js` (wrap) y `pulido.js`. Defensa para tus cartas futuras.
- **Fix de contenido:** quité las 3 frases meta ("esto no es la ANFP…") — leían raro (¿por qué
  la carta de Boca explica que no es chilena?) y eran la raíz. Ahora pasan solas.
- **Además:** remapeé mis cartas AFA a mes 1–4 (la temporada AFA son 14 fechas ene–abr; las de
  mes 5+ nunca disparaban). Verificado: **30/30 clubes AFA con su carta disponible y mes≤4.**
- **[PARA GROK, opcional]** Si querés desambiguar época/país, usá campos `era`/`div` (que el filtro
  SÍ respeta) en vez de meterlo en el texto. Suites: 755/755 + 35/35.

### NOTA DE CLAUDE (7 · AFA 100% — TODAS las ligas al listón CC)
Cerré los 11 DTs AFA con fuente (ver arriba). **Estado del rigor (auditor):**
- Chile Primera / B / Segunda: 100% · 1991 / 2006 / 1925: 100% · **AFA: 100%**.
- **TODAS las ligas al listón Colo-Colo.** Ese era tu gate para 8.00
  ("8.00 = cuando TODOS los clubes estén al listón CC"). Del lado rigor, cumplido.
- `js/data-afa-rigor.js`: bloque `DT_AFA_2026` (solo rellena genéricos, no pisa tu dato).
- Suites: 755/755 + 37/37. La decisión de subir a 8.00 es tuya/del autor; yo no bumpeo.

### NOTA DE CLAUDE (8 · primo del bug de filtro: arcos de historia)
Cacé el "primo" del bug de las decisiones. `arcosDe()` (storylines.js) re-filtraba los
arcos PROPIOS de cada club (`ARCOS_EQUIPO[id]`) con `arcoCabeEnClub`, y el arco de O'Higgins
("carga con **el cobre**, El Teniente…" — el cobre = la minería) quedaba bloqueado por la
marca del estadio **El Cobre** de Cobresal. O'Higgins nunca veía su propia historia.
- **Fix (storylines.js):** los arcos propios ya son del club → NO se re-filtran; el filtro
  anti-fuga se aplica solo a los GENÉRICOS. Verificado: ningún arco propio queda fuera.
- No toqué tus datos ni el motor de copas. Test de regresión en pruebas_dev.js. Suites 812/812 + 40/40.

### NOTA DE CLAUDE (9 · voseo argentino en textos chilenos — regla inviolable)
Auditando mobile encontré **voseo argentino** (podés/tenés/querés/sabés/"Vos mandás") en UI
que se muestra a clubes CHILENOS — viola la regla "sin voseo argentino". Ej: la previa de
Colo-Colo decía "Adentro **podés** saltar" y "**Vos mandás**".
- **Arreglé a NEUTRO (10 casos) en UI:** `ui-partido.js` (previa ×5), `ui.js` (×4), `mundo.js` (×1).
  Neutro es rule-compliant y nunca está mal; no inventé chilensis (esa es voz del autor).
- **[PARA GROK, tus archivos de datos]** Quedan estos `tenés` (rioplatense) para pasar a neutro
  o chileno, como prefiera el autor: `data-formato2026.js:1216,1220,1225,1236,1556` y
  `data-superprompt-83.js:26`. Ojo con el estilo rioplatense filtrándose (el juego es chileno).

### NOTA DE CLAUDE (10 · localización: toda la AFA decía "ANFP")
Bug de inmersión grande: los **30 clubes argentinos** veían "ANFP" (federación chilena) en
institución/escritorio — el grupo de poder, las jugadas, el estatuto. `localizarFed` solo
cubría lo que pasa por `resolverTokens` (decisiones); el resto se renderiza directo.
- **Fix central (mi `federacion.js`):** `sincronizarGrupoFed()` en un wrap de `render()` pone
  el nombre del grupo "anfp" al de la federación del país (ANFP en Chile, AFA en Argentina).
  No toca datos; se auto-corrige al cambiar de club.
- **`ui.js` (2 spots):** el panel de Jugadas de poder y el de Estatutos localizan su texto con
  `localizarFed` (ANFP→AFA en liga extranjera). También saqué un "gastás" (voseo→"gastas").
- **`data-grupos.js` (1 string):** "pasillos de la ANFP" → "pasillos del poder" (universal).
- Verificado: **30 clubes × 6 secciones = cero ANFP indebido**; Chile sigue mostrando ANFP
  (no-op); las frases "AFA, no ANFP" se preservan. Test de regresión. Suites 812/812 + 46/46.

### NOTA DE CLAUDE (11 · barrido de voseo cerrado en MI carril; quedan datos tuyos)
Seguí "Adelante con los bugs". Cerré el voseo en **toda la capa UI mía** (`ui.js`, `ia.js`):
- `ui.js` JUGADAS_PODER: Movés/Parás/Renegociás/Corrés/ponés/Mandás + "sos un dictador" → tú neutro.
- `ui.js` varios: clasificás, "Si subís… jugás", "Elegí cómo la jugás", "Te parás… salís", Apelás,
  Sacás, "decidís vos" → "decides tú", "enojado con vos" → "contigo", "si no donás" → "donas".
- `ia.js`: "Sostené el clima" → "Sostén".
- Commit `ea5a7f3` en main. Suites 812/812 + 46/46 verdes.
**[PARA GROK, siguen en tus datos]** además de los de la Nota 9, encontré:
`data-decisiones-plus.js:65` "Te **debés** una." → "Te debes una." Pasalos a neutro cuando toques esos files.
**[Verificado, NO era bug]** `panelCopasPais` NO filtra "Copa Chile" a un club AFA: el guard
`pj>0` deja los punteros chilenos vacíos en partida argentina. Probado headless con Boca. No lo toqué.

### NOTA DE CLAUDE (12 · voseo: MI carril 100% limpio; lista final para TU carril)
Cerré voseo en **toda la UI mía**: `ui.js`, `ia.js`, `dev-editor.js`, `mundo.js` (commits `ea5a7f3`→`4a77013`).
Todo a **tú neutro** (rule-compliant, nunca inventé chilensis: esa es voz del autor).

**Quedan SOLO en tus archivos de datos** (lista completa, para que lo cierres de una):
| Archivo | Líneas | Voseo |
|---|---|---|
| `data-formato2026.js` | 1198(subís) 1216/1220/1225/1236/1556(tenés) 1572(dejás) | rioplatense |
| `data-decisiones-plus.js` | 65 (debés) | "Te debés una" |
| `data-superprompt-83.js` | 26 (tenés "cuando vos tenés 1") | rioplatense |
| `pulido.js` | 275(jugás) 290(subís) | ⚠ ojo: ese archivo YA usa chilensis (querís/tenís/**jugái**). Ahí lo coherente NO es neutro sino **jugái** (voz chilena), decisión tuya/del autor |
| `data-argentina2026.js` | 142 (jugás) | 🤔 club **argentino**: acá el voseo puede ser intencional (voz del club AFA). Autor decide |

Criterio que usé: **-ás/-és rioplatense = fuera** en voz chilena; **-ís/-ái = chilensis, se respeta**;
club argentino = voz propia, la deja el autor. No toqué nada de datos (tu carril).
