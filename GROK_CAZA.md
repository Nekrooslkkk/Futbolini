# GROK · caza de bugs de datos (7.76 + 7.83)

Lista priorizada. Hechos públicos; si no está documentado, se marca.

## Crítico
(ninguno nuevo que rompa una partida chilena)

## 7.83 · hallazgos horneados
[FIX] `js/data-historico.js` HISTORIA_LINEA.CC 1925.
  Era: «Nace en Macul, de una fusión de clubes escolares».
  Falso. 19 abr 1925, Estadio El Llano (San Miguel). Escisión de Magallanes
  («Ancha es la puerta»), David Arellano capitán. Macul es el Monumental, 1975/89.

[FIX] HISTORIA_LINEA.CC «1973 El Monumental».
  Inauguración **20 abr 1975** (1-0 a Aviación, Orellana). Reinauguración
  **30 sep 1989** (2-1 a Peñarol). 1973 no es la fecha.

[FIX] HISTORIA_LINEA.UC «1997 San Carlos».
  San Carlos de Apoquindo se inauguró el **4 sep 1988** (0-1 vs River).
  1997 no es la fecha. Claro Arena 2025 se queda.

[FIX] DTs Primera 2026 que seguían en «el cuerpo técnico»:
  CC Fernando Ortiz · PAL Guillermo Farré · AUD Patricio Graff ·
  UDC Cristián Muñoz. El resto ya estaba (Gago, Garnero, Caputto, etc.).
  Fuente: Wikipedia Liga de Primera 2026 / Transfermarkt, sep 2026.

[FIX] `idiomas.js` FRASES.cl.esc_atiende: «Atendé» es voseo argentino.
  Chilensis: «Atiende esto antes de avanzar, po».

[OK] Copa de la Liga 2026 **SÍ existe** (1ª edición, ANFP). GROK_TAREAS Tarea 3
  quedó vieja. Grupos de `COPA_LIGA_GRUPOS_2026` cruzan con Wikipedia 8 ene 2026.
  No la juegan B ni Segunda.

[OK] Supercopa 2026: Final Four en Sausalito. Coquimbo campeón 0-0 (8-7p) vs UC.
  Semis reales: HUA 2-4 UC, COQ 3-2 LIM. Ya en `SUPERCOPA_2026`.

[INFO] Segunda 2026 formato real (TAREA 2): 3+3 a liguillas de 7 + playoff de 4°s.
  En 2026 el de 4°s fue ida y vuelta (Trasandino 1-0 G. Velásquez).
  Motor hoy: zona 12 fechas. Liguilla de 7 **pendiente**. Ver FORMAT_SEGUNDA_2026.

## Medio
[INFO] `COB` 1991 = Cobreloa · `COB` 2026 = Cobresal.
  Ya está documentado en `clubMapaTodos`: ganan los IDs modernos.
  No se unifica: rompería 1991. Cobreloa 2026 es `CBL`.

[INFO] `OSO` es el mismo club (Provincial Osorno) en 1991 Primera y 2026 Segunda.
  Correcto históricamente. En 1991 descendió (tabla real: 19 pts).

[OK] Decisiones con Monumental (`cc91_premios`, `cc91_monumental`) llevan `club:"CC"`.
  El filtro `textoAjenoClub74` sigue cazando bolsa genérica. Bombonera ahora
  **no** se filtra si el club es Boca (`BOC`).

[OK] Segunda 2026 no tiene Copa Chile ni metas Libertadores (tests 7.74/7.75).

[OK] IDs Argentina (30) no chocan con Primera / B / Segunda / 1991.

## Menor (corregido en 7.76)
[FIX] `js/data-segunda2026.js` — Santiago City, estadio.
  Era: Municipal de Las Condes (sin cruzar).
  Ahora: **Municipal de Lo Barnechea** (lista de clubes / Liga de Segunda 2026).

[FIX] Aforos/estadios de Segunda cruzados con Wikipedia 2026:
  Osorno 12.000 (Rubén Marcos), Morning 5.000 (La Pintana), Trasandino 3.500,
  Ovalle Diaguita 5.160, Colchagua Jorge Silva 7.200, Linares Tucapel Bustamante 4.000,
  Colina Manuel Rojas 4.000, Rengo Guillermo Guzmán, Velásquez Augusto Rodríguez.

[FIX] DTs 2026 de Segunda (ficha pública, no inventados): Paredes (Morning),
  Viale (Osorno), Ramos (Lota), Meléndez (Linares), González (Colchagua),
  Gutiérrez (Trasandino), Vergara (Colina), Quintanilla (Ovalle),
  Gutiérrez (Concón), Cornejo (Salamanca), Lizama (San Joaquín),
  Febre (City), Garrido (Velásquez), Fuentes (Rengo).

[MENOR] RSJ y SCI en zona **Norte** siendo de Santiago.
  No es error de mapa: es el armado ANFP 2026 del torneo (7 y 7).

[INFO] Aforos: Barracas 4.400 (EN wiki) vs 10.000 (ES wiki) — se usó 4.400.

## Huecos que quedan
- Planteles reales de Segunda: **no se inventan**. Falta fuente club por club
  (Transfermarkt tiene tamaños; nombres no se copian a ciegas).
- Formato Argentina: zonas de 15 + 2 interzonales + playoffs. Hoy: 29 fechas ida
  (fixturesLiga no banca n impar: zona de 15 rompería el círculo).
- Fixtures reales Argentina 2026 (Apertura).
- Liguilla de 7 de Segunda + playoff de 4°s: documentados, no jugables aún.
- Fotos: FOTOS.txt tiene URLs Commons verificadas (CC, UCH, EVE, UES, OHI, COQ,
  HUA, COB, NUB, BOC, RIV). El resto sigue PEGA_LINK / sin_foto.
