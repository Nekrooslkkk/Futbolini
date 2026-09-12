# REGLAS.md — reglas canónicas de los torneos (memoria fija)

> **Fuente de verdad de los formatos.** Cuando toques ligas, ascensos, descensos,
> cupos o copas, respetá esto. Los formatos del fútbol chileno **cambian casi todos
> los años** (número de descensos, cupos internacionales, etc.): lo marcado con ⚠️
> hay que verificar por temporada. Integridad: nombres reales + stats estimadas;
> nunca inventar un club/jugador/cita como real.

## Pirámide del fútbol chileno (ANFP)
1. **Primera División** ("Liga de Primera") — 1er nivel. En el juego: era `2026`.
2. **Primera B** ("Liga de Ascenso") — 2º nivel. En el juego: era `2026b`.
3. **Segunda División Profesional** — 3er nivel. En el juego: era `2026c`.
4. **Tercera División A / B** — amateur/semi. (No modelada aún.)

Ascenso/descenso **encadenado** entre niveles (implementado: Primera↔B↔Segunda,
`procesarAscensoDescenso` en `motor.js`).

## Primera División 2026 (era 2026)
- **16 clubes**, todos contra todos ida y vuelta (**30 fechas**). Victoria **3 pts**.
- **Descensos:** ⚠️ 2 al año (los 2 últimos) — verificar por temporada (a veces 1 directo + promoción).
- **Cupos internacionales:** campeón y escoltas a **Copa Libertadores**; siguientes a **Copa Sudamericana**; también entra el campeón de **Copa Chile**. ⚠️ el reparto exacto de cupos cambia por año.
- En el juego hoy: liga corrida de 16, 3 pts, 1 desciende / 1 asciende (simplificado; el real son 2 — pendiente afinar).

## Primera B 2026 (era 2026b)
- **16 clubes**, liga corrida. Victoria **3 pts**.
- **Ascenso:** el **campeón** sube directo a Primera; una **liguilla** (playoff) define un 2º ascenso. ⚠️ formato de liguilla varía.
- **Descenso:** el último (o últimos) baja a Segunda División.

## Segunda División Profesional 2026 (era 2026c)
- **14 clubes**, en **dos zonas: Norte y Sur (7 y 7)**. Victoria **3 pts**.
- **Fase zonal:** todos contra todos ida y vuelta DENTRO de la zona. 7 clubes (impar) → **14 fechas de calendario, 12 partidos por club, 2 byes**.
- **Clasificación:** 3 primeros de cada zona → liguilla de ascenso. 3 últimos → liguilla de permanencia. Los **4°** de Norte y Sur se cruzan (bases: cancha neutral; en 2026 se jugó ida y vuelta: Trasandino 1-0 General Velásquez) — ganador a liguilla de título, perdedor a permanencia.
- **Liguilla de ascenso:** 7 clubes, ida y vuelta, puntaje desde 0. El **1° es campeón y sube a Primera B**.
- **Liguilla de permanencia:** 7 clubes, ida y vuelta. Los **2 últimos bajan a Tercera A**.
- La zona real de cada club está en el campo `z` de `LIGA_C_2026` (`data-segunda2026.js`). Resumen estructurado: `FORMAT_SEGUNDA_2026`.
- **Implementado (7.65):** se juega por **zona** (Norte/Sur, 7 clubes → **12 fechas**); la tabla y el "campeón" son **por zona**. El **ascenso** lo define una **liguilla** entre el 1º de Norte y el 1º de Sur (hoy se resuelve por fuerza + azar; **pendiente**: liguilla de 7 jugable + playoff de 4°s). Las zonas se mantienen **7 y 7** aunque haya ascensos/descensos: el que baja de la B hereda el cupo de zona del que sube (`E.zonaSeg`, `zonaSegDe()` en `motor.js`).
- **Pendiente:** descenso a Tercera A (no modelada) y liguilla de 7 jugable. Planteles: **cantera** (no se inventan).
- **Copa Chile 2026 NO incluye Segunda.**

## Copa Chile
- Copa nacional con **clubes de Primera y Primera B** (32 = 16+16). Fase de grupos zonales → eliminación directa.
- El **campeón** clasifica a repechaje Libertadores (Chile 4) y a la **Supercopa**.
- En el juego: `data-copas2026.js` (grupos + KO). ⚠️ formato exacto cambia por año.
- **2026: Segunda NO juega Copa Chile** (bases ANFP).

## Copa de la Liga de Chile 2026
- **SÍ existe** (1ª edición). No es un invento ni un alias de la Supercopa. Consejo de Presidentes 13 oct 2025 / grupos 8 ene 2026.
- **Solo los 16 de Primera.** 4 grupos de 4, ida y vuelta. Clasifica **únicamente el 1°** a semifinales (A↔D, B↔C, ida/vuelta). Final a partido único en el **Elías Figueroa** (Valparaíso).
- El **campeón obtiene el cupo Chile 3 a Libertadores** del año siguiente.
- Grupos 2026 (reales): A COQ/CC/HUA/DCO · B UC/NUB/UDC/COB · C OHI/EVE/LIM/PAL · D CAL/AUD/UCH/LSE.
- **No la juegan B ni Segunda.** Implementada en `data-formato2026.js`.

## Supercopa de Chile
- **2026: Final Four** (ya no es partido único). Campeón y subcampeón de Liga 2025 + finalistas de Copa Chile 2025. Sede: **Sausalito**, 20–25 ene 2026.
- Semis: Huachipato 2-4 Católica (20 ene); Coquimbo 3-2 Limache (21 ene). Final: Católica 0-0 Coquimbo (**7-8 penales**). Campeón: **Coquimbo Unido**.
- En una partida 2026 es **HECHO** (ya se jugó en enero), no un fixture a simular. El formato de 4 equipos vale para 2027. `SUPERCOPA_2026` / `FORMAT_SUPERCOPA_2026`.

---

## Liga Profesional Argentina 2026 (era `arg2026`) — datos 7.76
- **30 clubes** reales (Wikipedia / AFA, sep 2026). IDs de 3 letras que no chocan con Chile (`BOC`, `RIV`, `RAC`…).
- **Formato real:** Apertura + Clausura, cada uno en **2 zonas de 15**. Descienden **2**: 1 por promedio (coeficiente) + 1 colista de la anual. Campeón de cada torneo → Libertadores 2027. Ascendieron Gimnasia (Mza) y Estudiantes (RC); bajaron Godoy Cruz y San Martín (SJ).
- **En el juego hoy:** una rueda de **29 fechas** (ida), 3 pts. Calendario muestra la tabla de los 30. Las zonas A/B están en el campo `z` de cada club para cuando se arme el formato real (playoffs / promedio). `fixturesLiga` no banca n impar (zona de 15).
- Archivo: `js/data-argentina2026.js` (`registrarLiga`). Planteles: **cantera** (no se inventan nombres).
- Segunda 2026: DTs de la ficha pública (Paredes, Viale, Ramos…) y estadios cruzados (City = Lo Barnechea, Ovalle = Diaguita). Planteles: cantera.

## Modo 2006 (era `2006`)
- **19 clubes** (Deportes Concepción **suspendido** por problemas financieros). Wikipedia Apertura/Clausura 2006.
- **Formato real:** Apertura + Clausura, grupos + playoffs estilo México, 3 pts. Campeones: Colo-Colo (Apertura vs la U por penales; Clausura 3-0 a Audax). Desciende Morning por tabla anual.
- **En el juego hoy:** una rueda de **18 fechas** (bye, n impar). Cobreloa = `CBL`, Cobresal = `CBS` (no chocar con Cobresal 2026 = `COB`).
- Plantel documentado: **solo Colo-Colo** (`PLANTEL_CC_2006`). El resto, cantera.
- Archivo: `js/data-2006.js`.

## Modo 1925 (era `1925`) — amateur, acotado
- **Liga Metropolitana de Deportes**, División de Honor. 13 inscritos; **Unión Chilena se retiró** → **12 clubes**, una rueda, 11 fechas. Victoria **2 pts**.
- Campeón invicto: Colo-Colo (fundado el 19 de abril; debut 6-0 al English el 31 de mayo).
- **Se oculta:** redes, mercado millonario. No hay Libertadores, VAR, ANFP, B/Segunda profesional.
- Plantel documentado: **solo Colo-Colo** (Arellano y los Rebeldes). Archivo: `js/data-1925.js`.

---

El motor ya está preparado: una "era"/división es un **array de clubes** registrado en
`LIGAS[...]` + entradas en `CLUB_INFO_2026 / IND_BASE_2026 / CAJA_BASE_2026` +
`ESTATUTO_INICIAL / PODER_CLUB`.

### Forma FÁCIL (7.67): `registrarLiga(cfg)` — una sola llamada
En vez de copiar todo a mano, definís el **array de clubes** y llamás a
**`registrarLiga`** (en `js/liga-registrar.js`): deriva `CLUB_INFO/IND/CAJA/ESTATUTO/PODER`
de la **`fuerza`** de cada club (y respeta lo que pongas explícito). Ejemplo:
```js
// js/data-argentina2026.js  (nuevo, cargar después de liga-registrar.js)
const LIGA_ARG_2026=[
  { id:"BOC", n:"Boca Juniors", c:"Boca", fuerza:82, aforo:54000, est:"La Bombonera", ciudad:"Buenos Aires", z:"—" },
  { id:"RIV", n:"River Plate",  c:"River", fuerza:84, aforo:70000, est:"Monumental",  ciudad:"Buenos Aires", z:"—" },
  // ... el resto (id de 3 letras únicas)
];
registrarLiga({ eraKey:"arg2026", clubs:LIGA_ARG_2026, baseEra:2026, nombre:"Liga Profesional Argentina" });
```
Campos opcionales por club si querés afinar: `esc` (emoji), `dt`, `desc`, `ind{...}`,
`caja{plata,deuda}`, `estatuto{...}`, `poder{...}`. Con eso la liga queda **cableada**.
Falta sólo el gancho de **selección/formato** en el motor (selector de época y, si tiene
grupos/playoffs, su regla) — eso lo hace Claude cuando llegan los datos. El molde
"a mano" sigue siendo `data-segunda2026.js` (por si necesitás control fino).

## Esquema de un club (igual a `LIGA_C_2026`)
```js
{ id:"BOC", n:"Boca Juniors", c:"Boca", fuerza:82, aforo:54000,
  est:"Estadio Alberto J. Armando", ciudad:"Buenos Aires", z:"—" }
```
Y su plantel real (opcional; si falta, se rellena con cantera):
```js
const PLANTEL_BOC_2026=[ ["Nombre Apellido","ARQ|DEF|VOL|DEL",edad,niv(40-90),proy,sueldo,valor,["rasgos"]], ... ];
```

## Prompt para Grok — copiar la Liga Profesional Argentina 2026 (realismo actual)
> Arma la **Liga Profesional Argentina 2026** para Futbolini, con el mismo formato que
> `js/data-segunda2026.js` (que es el molde). Necesito, con datos REALES documentados
> (Wikipedia/AFA/Transfermarkt, 2026):
> 1. **Lista completa de clubes** de la Primera División Argentina 2026 con: `id` (3 letras
>    únicas, que no choquen con los ids chilenos), nombre, ciudad, estadio, aforo y una
>    `fuerza` estimada 40–90.
> 2. **Formato real del torneo 2026**: cuántos equipos, cómo se juega (zonas/grupos, fase
>    campeonato, playoffs), cuántos descienden y cómo (tabla anual + promedios), y cupos a
>    Libertadores/Sudamericana. Resumilo claro para que Claude lo implemente.
> 3. (Opcional, por impacto) **planteles reales** de los clubes grandes primero, en el
>    formato `PLANTEL_<ID>_2026` de arriba. Solo nombres documentados; si no tenés a alguien,
>    lo dejás fuera (el juego rellena). No inventes nombres como reales.
>
> Entregá los clubes como un array `LIGA_ARG_2026` + los bloques `CLUB_INFO`/`IND`/`CAJA`/
> `ESTATUTO`/`PODER` (mirá cómo lo hace `data-segunda2026.js`). Claude registra la liga en
> el motor (`LIGAS["arg2026"]`, selector, ascenso/descenso propio de Argentina) y arma el
> formato real que le pases en el punto 2.

> Nota de división de trabajo: **Grok** trae los datos (clubes/planteles) y el resumen del
> formato; **Claude** hace el código (registro de la liga, selector, reglas del torneo).
