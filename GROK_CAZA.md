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








