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

## 7.99 · rigor vs Colo-Colo (uno por uno)
[INFO] Listón CC: 24 jugadores 2026, 3 ARQ, capitán Vidal, ídolo, 0 rasgos vacíos, épocas 1989/1991/2002/2006.
[OK] Primera 16/16 y B 16/16 ya tenían plantel Wiki ≥18. Segunda 14/14 FULL (89 pisa los stubs de 87).
[FIX] UC 2026: Giani es DEL (no VOL). Entran Martín Gómez, Diego Corral, Nicolás L'Huillier (wiki 14 ago).
[FIX] Assadi sale del stub de data-plantel.js (AIK, 21 ago). Sosa Limache 37, no 21.
[FIX] UES 2013: plantel real Transición (Sierra, Ampuero, Villagra, Canales, Cueva) — la época ya no es cantera.
[FIX] SW 2001: plantel real tercera estrella (Garcés, Silvio Fernández, Riveros, Villarroel) — ASIFUCH.
[FIX] HISTORIA_LINEA.CC 1925 en fuente: El Llano, no Macul.
[INFO] Todavía bajo el listón CC (sin plantel de época real): palestino 1978 sí; LIM/ANT/PMO/COP/TEM/IQQ/CUR/SCR/RAN/SLQ/USF/REC y casi toda Segunda/AFA. No se inventa.
[OK] Rasgo mínimo por edad si el array venía vacío (veterano/joven/recambio). Capitán no se inventa.

## 8.00 · U 1994 / Boca 2007 / River 2018 = listón Colo-Colo
[CRÍTICO] UCH 1994 tenía 8 fichas (el resto cantera). Es EL título de la U, el equivalente a CC 1991.
[FIX] Plantel 21 nombres BDFA/Wikipedia/ASIFUCH. Musrri capitán, Salas goleador, Vargas ídolo. 3 ARQ.
[FIX] HISTORIA_LINEA.UCH no tenía 1994 — ahora sí (25 años, El Salvador, penal de Mardones).
[FIX] Época dorada jugable (botón oro) con squad real.
[CRÍTICO] Boca 2007 y River 2018 (EPOCAS_TAREA_E) decían "Plantel: cantera".
[FIX] Boca 2007: 22 nombres, Russo, Riquelme, Palermo capitán. Schelotto no (abril).
[FIX] River 2018: 24 nombres, Gallardo, Ponzio capitán, Pratto, Armani. 3 ARQ.
[INFO] Siguiente lote (aún cantera, no se inventa): Audax 2007, Cobreloa 1981 ya tiene XI de final en 7.92, Magallanes/Morning 1942, AFA 1967/1984/1994.
[OK] VERSION 8.00. Tests T29.










