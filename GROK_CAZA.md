# GROK · caza de bugs de datos (7.76)

Lista priorizada. Hechos públicos; si no está documentado, se marca.

## Crítico
(ninguno nuevo que rompa una partida chilena)

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

## Menor (corregido en este pase)
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
- DTs de Primera / B 2026: varios siguen en "el cuerpo técnico" a propósito.
