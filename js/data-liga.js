"use strict";
/* ============================================================
   FUTBOLINI 3.0 · data-liga.js
   Clubes del Campeonato Nacional 1991 (16 equipos, 30 fechas,
   del 27 de abril al 22 de diciembre de 1991), Copa Libertadores
   1991 con el camino real de Colo-Colo, y la tabla histórica de
   referencia. Datos contrastados con registros públicos.
   ============================================================ */

/* fuerza 0-100: calibrada a partir de la tabla final de 1991 */
const LIGA91=[
 {id:"CC", n:"Colo-Colo",             c:"Colo-Colo",   fuerza:82, aforo:62000, est:"Estadio Monumental",           ciudad:"Santiago"},
 {id:"COQ",n:"Coquimbo Unido",        c:"Coquimbo",    fuerza:70, aforo:18000, est:"Estadio Municipal de Coquimbo", ciudad:"Coquimbo"},
 {id:"UC", n:"Universidad Católica",  c:"U. Católica", fuerza:74, aforo:20000, est:"San Carlos de Apoquindo",       ciudad:"Santiago"},
 {id:"OHI",n:"O'Higgins",             c:"O'Higgins",   fuerza:69, aforo:14000, est:"Estadio El Teniente",           ciudad:"Rancagua"},
 {id:"FV", n:"Fernández Vial",        c:"F. Vial",     fuerza:62, aforo:12000, est:"Estadio Municipal",             ciudad:"Concepción"},
 {id:"COB",n:"Cobreloa",              c:"Cobreloa",    fuerza:68, aforo:12000, est:"Estadio Municipal de Calama",   ciudad:"Calama"},
 {id:"DCO",n:"Deportes Concepción",   c:"D. Concep.",  fuerza:64, aforo:30000, est:"Estadio Collao",                ciudad:"Concepción"},
 {id:"ANT",n:"Deportes Antofagasta",  c:"Antofagasta", fuerza:59, aforo:12000, est:"Estadio Regional",              ciudad:"Antofagasta"},
 {id:"PAL",n:"Palestino",             c:"Palestino",   fuerza:60, aforo:12000, est:"Municipal de La Cisterna",      ciudad:"Santiago"},
 {id:"LSE",n:"Deportes La Serena",    c:"La Serena",   fuerza:59, aforo:18000, est:"Estadio La Portada",            ciudad:"La Serena"},
 {id:"CBS",n:"Cobresal",              c:"Cobresal",    fuerza:58, aforo:12000, est:"Estadio El Cobre",              ciudad:"El Salvador"},
 {id:"UES",n:"Unión Española",        c:"U. Española", fuerza:60, aforo:20000, est:"Estadio Santa Laura",           ciudad:"Santiago"},
 {id:"EVE",n:"Everton",               c:"Everton",     fuerza:58, aforo:20000, est:"Estadio Sausalito",             ciudad:"Viña del Mar"},
 {id:"UCH",n:"Universidad de Chile",  c:"U. de Chile", fuerza:55, aforo:70000, est:"Estadio Nacional",              ciudad:"Santiago"},
 {id:"OSO",n:"Provincial Osorno",     c:"P. Osorno",   fuerza:50, aforo:10000, est:"Estadio Municipal",             ciudad:"Osorno"},
 {id:"SW", n:"Santiago Wanderers",    c:"Wanderers",   fuerza:50, aforo:20000, est:"Estadio Playa Ancha",           ciudad:"Valparaíso"}
];
/* ---------- Liga de Primera 2026 · 16 equipos reales (Wikipedia / ANFP)
   Descendieron Iquique y Unión Española. Ascendieron U. de Concepción y D. Concepción. */
const LIGA_2026=[
 {id:"CC", n:"Colo-Colo",             c:"Colo-Colo",   fuerza:86, aforo:43667, est:"Estadio Monumental",           ciudad:"Santiago"},
 {id:"UCH",n:"Universidad de Chile",  c:"U. de Chile", fuerza:81, aforo:46190, est:"Estadio Nacional",              ciudad:"Santiago"},
 {id:"UC", n:"Universidad Católica",  c:"U. Católica", fuerza:78, aforo:20249, est:"Claro Arena",                  ciudad:"Santiago"},
 {id:"EVE",n:"Everton",               c:"Everton",     fuerza:72, aforo:21754, est:"Estadio Sausalito",             ciudad:"Viña del Mar"},
 {id:"PAL",n:"Palestino",             c:"Palestino",   fuerza:72, aforo:8000,  est:"Municipal de La Cisterna",      ciudad:"Santiago"},
 {id:"COQ",n:"Coquimbo Unido",        c:"Coquimbo",    fuerza:73, aforo:15809, est:"Estadio Francisco Sánchez R.",  ciudad:"Coquimbo"},
 {id:"AUD",n:"Audax Italiano",        c:"Audax",       fuerza:70, aforo:11637, est:"Estadio La Florida",            ciudad:"Santiago"},
 {id:"HUA",n:"Huachipato",            c:"Huachipato",  fuerza:71, aforo:10032, est:"Estadio CAP",                   ciudad:"Talcahuano"},
 {id:"OHI",n:"O'Higgins",             c:"O'Higgins",   fuerza:70, aforo:12476, est:"Estadio El Teniente",           ciudad:"Rancagua"},
 {id:"NUB",n:"Ñublense",              c:"Ñublense",    fuerza:68, aforo:11319, est:"Estadio Nelson Oyarzún",        ciudad:"Chillán"},
 {id:"COB",n:"Cobresal",              c:"Cobresal",    fuerza:68, aforo:11240, est:"Estadio El Cobre",              ciudad:"El Salvador"},
 {id:"CAL",n:"Unión La Calera",       c:"La Calera",   fuerza:67, aforo:8353,  est:"Estadio Nicolás Chahuán",       ciudad:"La Calera"},
 {id:"LSE",n:"Deportes La Serena",    c:"La Serena",   fuerza:66, aforo:17134, est:"Estadio La Portada",            ciudad:"La Serena"},
 {id:"DCO",n:"Deportes Concepción",   c:"D. Concep.",  fuerza:64, aforo:30448, est:"Estadio Ester Roa",             ciudad:"Concepción"},
 {id:"UDC",n:"Universidad de Concepción",c:"U. Concepción",fuerza:62,aforo:30448,est:"Estadio Ester Roa",           ciudad:"Concepción"},
 {id:"LIM",n:"Deportes Limache",      c:"Limache",     fuerza:63, aforo:7680,  est:"Estadio Lucio Fariña",          ciudad:"Limache"}
];
/* Fixture oficial Colo-Colo 2026 (Wikipedia, congelado 18/08/2026). real=null si no se jugó. */
const LIGA_CC_2026=[
 {fecha:1,  f:{m:1,d:31}, rival:"LIM", local:false, real:"3-1"},
 {fecha:2,  f:{m:2,d:7},  rival:"EVE", local:true,  real:"2-0"},
 {fecha:3,  f:{m:2,d:15}, rival:"CAL", local:true,  real:"1-0"},
 {fecha:4,  f:{m:2,d:21}, rival:"OHI", local:false, real:"0-1"},
 {fecha:5,  f:{m:3,d:1},  rival:"UCH", local:true,  real:"0-1"},
 {fecha:6,  f:{m:3,d:7},  rival:"AUD", local:false, real:"0-1"},
 {fecha:7,  f:{m:3,d:16}, rival:"HUA", local:true,  real:"2-0"},
 {fecha:8,  f:{m:4,d:5},  rival:"DCO", local:false, real:"0-1"},
 {fecha:9,  f:{m:5,d:3},  rival:"COQ", local:true,  real:"3-1"},
 {fecha:10, f:{m:4,d:19}, rival:"PAL", local:true,  real:"0-1"},
 {fecha:11, f:{m:4,d:26}, rival:"UDC", local:false, real:"1-2"},
 {fecha:12, f:{m:5,d:17}, rival:"NUB", local:true,  real:"6-2"},
 {fecha:13, f:{m:5,d:24}, rival:"UC",  local:false, real:"1-2"},
 {fecha:14, f:{m:5,d:30}, rival:"LSE", local:false, real:"2-4"},
 {fecha:15, f:{m:6,d:13}, rival:"COB", local:true,  real:"3-0"},
 {fecha:16, f:{m:7,d:24}, rival:"LIM", local:true,  real:"3-1"},
 {fecha:17, f:{m:8,d:1},  rival:"EVE", local:false, real:"3-4"},
 {fecha:18, f:{m:8,d:9},  rival:"CAL", local:false, real:"1-2"},
 {fecha:19, f:{m:8,d:16}, rival:"OHI", local:true,  real:"2-2"},
 {fecha:20, f:{m:8,d:23}, rival:"UCH", local:false, real:null},
 {fecha:21, f:{m:8,d:30}, rival:"AUD", local:true,  real:null},
 {fecha:22, f:{m:9,d:6},  rival:"HUA", local:false, real:null},
 {fecha:23, f:{m:9,d:13}, rival:"DCO", local:true,  real:null},
 {fecha:24, f:{m:10,d:11},rival:"COQ", local:false, real:null},
 {fecha:25, f:{m:10,d:25},rival:"PAL", local:false, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"UDC", local:true,  real:null},
 {fecha:27, f:{m:11,d:8}, rival:"NUB", local:false, real:null},
 {fecha:28, f:{m:11,d:22},rival:"UC",  local:true,  real:null},
 {fecha:29, f:{m:11,d:29},rival:"LSE", local:true,  real:null},
 {fecha:30, f:{m:12,d:6}, rival:"COB", local:false, real:null}
];
const LIGA_UCH_2026=[
 {fecha:1,  f:{m:1,d:30}, rival:"AUD", local:true,  real:"0-0"},
 {fecha:2,  f:{m:2,d:8},  rival:"HUA", local:false, real:"2-1"},
 {fecha:3,  f:{m:2,d:13}, rival:"PAL", local:false, real:"0-0"},
 {fecha:4,  f:{m:2,d:22}, rival:"LIM", local:true,  real:"2-2"},
 {fecha:5,  f:{m:3,d:1},  rival:"CC",  local:false, real:"0-1"},
 {fecha:6,  f:{m:3,d:9},  rival:"UDC", local:true,  real:"1-1"},
 {fecha:7,  f:{m:3,d:14}, rival:"COQ", local:false, real:"0-1"},
 {fecha:8,  f:{m:4,d:5},  rival:"LSE", local:true,  real:"4-0"},
 {fecha:9,  f:{m:4,d:12}, rival:"NUB", local:false, real:"1-0"},
 {fecha:10, f:{m:4,d:18}, rival:"EVE", local:false, real:"0-0"},
 {fecha:11, f:{m:4,d:25}, rival:"UC",  local:true,  real:"1-0"},
 {fecha:12, f:{m:5,d:17}, rival:"COB", local:false, real:"1-0"},
 {fecha:13, f:{m:6,d:18}, rival:"OHI", local:true,  real:"2-0"},
 {fecha:14, f:{m:5,d:30}, rival:"DCO", local:true,  real:"2-1"},
 {fecha:15, f:{m:6,d:14}, rival:"CAL", local:false, real:"2-2"},
 {fecha:16, f:{m:7,d:26}, rival:"AUD", local:false, real:"1-2"},
 {fecha:17, f:{m:8,d:2},  rival:"HUA", local:true,  real:"2-0"},
 {fecha:18, f:{m:8,d:9},  rival:"PAL", local:true,  real:"2-1"},
 {fecha:19, f:{m:8,d:15}, rival:"LIM", local:false, real:"1-3"},
 {fecha:20, f:{m:8,d:23}, rival:"CC",  local:true,  real:null},
 {fecha:21, f:{m:8,d:30}, rival:"UDC", local:false, real:null},
 {fecha:22, f:{m:9,d:6},  rival:"COQ", local:true,  real:null},
 {fecha:23, f:{m:9,d:13}, rival:"LSE", local:false, real:null},
 {fecha:24, f:{m:10,d:9}, rival:"NUB", local:true,  real:null},
 {fecha:25, f:{m:10,d:25},rival:"EVE", local:true,  real:null},
 {fecha:26, f:{m:11,d:1}, rival:"UC",  local:false, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"COB", local:true,  real:null},
 {fecha:28, f:{m:11,d:22},rival:"OHI", local:false, real:null},
 {fecha:29, f:{m:11,d:29},rival:"DCO", local:false, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"CAL", local:true,  real:null}
];
const LIGA_UC_2026=[
 {fecha:1,  f:{m:2,d:1},  rival:"LSE", local:false, real:"2-2"},
 {fecha:2,  f:{m:2,d:8},  rival:"DCO", local:true,  real:"2-0"},
 {fecha:3,  f:{m:2,d:14}, rival:"COB", local:false, real:"3-2"},
 {fecha:4,  f:{m:2,d:21}, rival:"COQ", local:true,  real:"3-1"},
 {fecha:5,  f:{m:3,d:1},  rival:"NUB", local:false, real:"1-2"},
 {fecha:6,  f:{m:3,d:7},  rival:"OHI", local:false, real:"1-0"},
 {fecha:7,  f:{m:3,d:14}, rival:"EVE", local:true,  real:"2-2"},
 {fecha:8,  f:{m:4,d:2},  rival:"PAL", local:true,  real:"6-1"},
 {fecha:9,  f:{m:4,d:11}, rival:"AUD", local:false, real:"3-4"},
 {fecha:10, f:{m:4,d:20}, rival:"CAL", local:true,  real:"1-2"},
 {fecha:11, f:{m:4,d:25}, rival:"UCH", local:false, real:"1-0"},
 {fecha:12, f:{m:5,d:16}, rival:"LIM", local:false, real:"0-2"},
 {fecha:13, f:{m:5,d:24}, rival:"CC",  local:true,  real:"1-2"},
 {fecha:14, f:{m:5,d:31}, rival:"HUA", local:false, real:"0-3"},
 {fecha:15, f:{m:6,d:14}, rival:"UDC", local:true,  real:"5-1"},
 {fecha:16, f:{m:7,d:25}, rival:"LSE", local:true,  real:"3-3"},
 {fecha:17, f:{m:8,d:2},  rival:"DCO", local:false, real:"3-0"},
 {fecha:18, f:{m:8,d:7},  rival:"COB", local:true,  real:"2-0"},
 {fecha:20, f:{m:8,d:22}, rival:"NUB", local:true,  real:null},
 {fecha:19, f:{m:8,d:26}, rival:"COQ", local:false, real:null},
 {fecha:21, f:{m:8,d:31}, rival:"OHI", local:true,  real:null},
 {fecha:22, f:{m:9,d:5},  rival:"EVE", local:false, real:null},
 {fecha:23, f:{m:9,d:12}, rival:"PAL", local:false, real:null},
 {fecha:24, f:{m:10,d:10},rival:"AUD", local:true,  real:null},
 {fecha:25, f:{m:10,d:25},rival:"CAL", local:false, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"UCH", local:true,  real:null},
 {fecha:27, f:{m:11,d:8}, rival:"LIM", local:true,  real:null},
 {fecha:28, f:{m:11,d:22},rival:"CC",  local:false, real:null},
 {fecha:29, f:{m:11,d:29},rival:"HUA", local:true,  real:null},
 {fecha:30, f:{m:12,d:6}, rival:"UDC", local:false, real:null}
];
const FIXTURES_OFICIALES={
  CC:{2026:LIGA_CC_2026},
  UCH:{2026:LIGA_UCH_2026},
  UC:{2026:LIGA_UC_2026}
};
/* Corte 18/08/2026. CC pts documentados; el resto de la tabla es referencia. */
const CORTE_2026={m:8,d:18};
const TABLA_2026_CORTE={
 CC:{pj:19,pg:15,pe:1,pp:3,gf:40,gc:19,pts:46},
 UCH:{pj:19,pg:10,pe:6,pp:3,gf:26,gc:13,pts:36},
 UC:{pj:18,pg:9,pe:3,pp:6,gf:40,gc:26,pts:30},
 COQ:{pj:18,pg:8,pe:5,pp:5,gf:24,gc:20,pts:29},
 EVE:{pj:19,pg:7,pe:6,pp:6,gf:28,gc:22,pts:27},
 PAL:{pj:18,pg:8,pe:3,pp:7,gf:26,gc:26,pts:27},
 AUD:{pj:18,pg:7,pe:5,pp:6,gf:22,gc:22,pts:26},
 HUA:{pj:18,pg:7,pe:4,pp:7,gf:23,gc:24,pts:25},
 OHI:{pj:19,pg:6,pe:6,pp:7,gf:22,gc:25,pts:24},
 NUB:{pj:18,pg:6,pe:5,pp:7,gf:20,gc:24,pts:23},
 COB:{pj:18,pg:6,pe:4,pp:8,gf:21,gc:26,pts:22},
 CAL:{pj:19,pg:5,pe:6,pp:8,gf:18,gc:25,pts:21},
 LSE:{pj:18,pg:5,pe:5,pp:8,gf:19,gc:26,pts:20},
 DCO:{pj:18,pg:5,pe:4,pp:9,gf:18,gc:27,pts:19},
 UDC:{pj:18,pg:4,pe:5,pp:9,gf:16,gc:28,pts:17},
 LIM:{pj:18,pg:4,pe:4,pp:10,gf:17,gc:30,pts:16}
};

/* ---------- ERAS: reglas que cambian con la época ----------
   puntos por victoria (2 en 1991, 3 hoy), inflación económica y cupos. */
const ERA={
 1991:{n:"1991", puntosVictoria:2, inflacion:1.0,  cuposInternacional:3,
   desc:"Fútbol de los 90: la victoria vale 2 puntos, presupuestos chicos y la Copa Libertadores como techo."},
 2026:{n:"2026", puntosVictoria:3, inflacion:1.4,  cuposInternacional:6,
   desc:"Fútbol moderno: la victoria vale 3 puntos, sociedades anónimas, plata de TV y valores inflados."}
};
function eraDe(base){ return ERA[base] || (base>=2010?ERA[2026]:ERA[1991]); }
function baseEra(anio){ return anio>=2010?2026:1991; }

/* liga activa y su índice, según la época del juego actual */
const LIGAS={1991:LIGA91, 2026:LIGA_2026};
let LIGA_ACT=LIGA91;
let CLUB_POR_ID={}; LIGA91.forEach(c=>CLUB_POR_ID[c.id]=c);
function activarLiga(base){
  LIGA_ACT = LIGAS[base] || LIGA91;
  CLUB_POR_ID={}; LIGA_ACT.forEach(c=>CLUB_POR_ID[c.id]=c);
}

/* Tabla final real 1991, para la pestaña Historia y la comparación de líneas */
const TABLA_REAL_91=[
 ["Colo-Colo",44],["Coquimbo Unido",39],["Universidad Católica",38],["O'Higgins",37],
 ["Fernández Vial",32],["Cobreloa",31],["Deportes Concepción",31],["Deportes Antofagasta",29],
 ["Palestino",29],["Deportes La Serena",28],["Cobresal",27],["Unión Española",27],
 ["Everton",27],["Universidad de Chile",23],["Provincial Osorno",19],["Santiago Wanderers",19]
];
const HECHOS_91={
  campeon:"Colo-Colo (18° título, primer tricampeonato)",
  goleador:"Rubén Martínez (Colo-Colo), 23 goles",
  descendidos:"Provincial Osorno y Santiago Wanderers",
  publico:"Promedio de 7.331 espectadores por partido; el más alto fue U. Católica 0-2 Colo-Colo, 59.610 personas el 20 de octubre",
  cierre:"Colo-Colo aseguró el título el 18 de diciembre con un 0-0 de visita ante Coquimbo Unido"
};

/* ---------- COPA LIBERTADORES 1991 · camino real de Colo-Colo ----------
   Grupo 2 con Deportes Concepción, Barcelona SC y LDU de Quito.
   Resultados reales guardados como referencia histórica. */
const COPA91=[
 {ronda:"Grupo 2", rival:"Deportes Concepción", sede:"Estadio Collao", local:false, f:{m:2,d:20}, real:"0-0", fuerza:64},
 {ronda:"Grupo 2", rival:"Barcelona SC",        sede:"Monumental",     local:true,  f:{m:3,d:1},  real:"3-1", fuerza:70},
 {ronda:"Grupo 2", rival:"Deportes Concepción", sede:"Monumental",     local:true,  f:{m:3,d:13}, real:"2-0", fuerza:64},
 {ronda:"Grupo 2", rival:"LDU de Quito",        sede:"Monumental",     local:true,  f:{m:3,d:22}, real:"3-0", fuerza:68},
 {ronda:"Grupo 2", rival:"Barcelona SC",        sede:"Guayaquil",      local:false, f:{m:4,d:2},  real:"2-2", fuerza:74},
 {ronda:"Grupo 2", rival:"LDU de Quito",        sede:"Quito (altura)", local:false, f:{m:4,d:5},  real:"0-0", fuerza:76},
 {ronda:"Octavos", rival:"Universitario",       sede:"Lima",           local:false, f:{m:4,d:17}, real:"0-0", fuerza:72},
 {ronda:"Octavos", rival:"Universitario",       sede:"Monumental",     local:true,  f:{m:4,d:24}, real:"2-1", fuerza:72},
 {ronda:"Cuartos", rival:"Nacional",            sede:"Monumental",     local:true,  f:{m:5,d:3},  real:"4-0", fuerza:78},
 {ronda:"Cuartos", rival:"Nacional",            sede:"Montevideo",     local:false, f:{m:5,d:8},  real:"0-2", fuerza:80},
 {ronda:"Semifinal",rival:"Boca Juniors",       sede:"La Bombonera",   local:false, f:{m:5,d:16}, real:"0-1", fuerza:84},
 {ronda:"Semifinal",rival:"Boca Juniors",       sede:"Monumental",     local:true,  f:{m:5,d:22}, real:"3-1", fuerza:84, apodo:"Batalla de Macul"},
 {ronda:"FINAL",   rival:"Olimpia",             sede:"Defensores del Chaco", local:false, f:{m:5,d:29}, real:"0-0", fuerza:80},
 {ronda:"FINAL",   rival:"Olimpia",             sede:"Monumental",     local:true,  f:{m:6,d:5},  real:"3-0", fuerza:80}
];
/* Intercontinental 8/12/1991 Tokio — resultado real 0-3 */
const INTERC91={ronda:"Intercontinental", rival:"Estrella Roja", sede:"Estadio Nacional de Tokio", local:false, f:{m:12,d:8}, real:"0-3", fuerza:88};
/* Campeonato Nacional 1991 · 30 partidos de Colo-Colo (fechas reales, historiadecolocolo / Wikipedia)
   fechaN = número oficial de fecha. real = marcador histórico CC-rival si local, rival-CC si visita. */
const LIGA_CC_1991=[
 {fecha:1,  f:{m:4,d:27}, rival:"CBS", local:true,  real:"3-1"},
 {fecha:3,  f:{m:5,d:12}, rival:"EVE", local:false, real:"1-0"},
 {fecha:6,  f:{m:6,d:9},  rival:"UC",  local:true,  real:"4-1"},
 {fecha:7,  f:{m:6,d:16}, rival:"LSE", local:false, real:"1-5"},
 {fecha:8,  f:{m:7,d:28}, rival:"OHI", local:true,  real:"1-1"},
 {fecha:2,  f:{m:8,d:1},  rival:"UES", local:true,  real:"4-1"},
 {fecha:9,  f:{m:8,d:4},  rival:"COB", local:false, real:"2-0"},
 {fecha:4,  f:{m:8,d:8},  rival:"DCO", local:true,  real:"1-2"},
 {fecha:10, f:{m:8,d:11}, rival:"SW",  local:true,  real:"2-0"},
 {fecha:11, f:{m:8,d:15}, rival:"FV",  local:false, real:"0-1"},
 {fecha:12, f:{m:8,d:18}, rival:"OSO", local:true,  real:"2-2"},
 {fecha:13, f:{m:8,d:24}, rival:"PAL", local:false, real:"0-1"},
 {fecha:14, f:{m:9,d:1},  rival:"COQ", local:true,  real:"0-0"},
 {fecha:15, f:{m:9,d:8},  rival:"ANT", local:false, real:"0-0"},
 {fecha:16, f:{m:9,d:15}, rival:"CBS", local:false, real:"1-3"},
 {fecha:5,  f:{m:9,d:17}, rival:"UCH", local:false, real:"0-2"},
 {fecha:17, f:{m:9,d:22}, rival:"UES", local:false, real:"1-5"},
 {fecha:18, f:{m:9,d:28}, rival:"EVE", local:true,  real:"2-1"},
 {fecha:19, f:{m:10,d:6}, rival:"DCO", local:false, real:"1-1"},
 {fecha:20, f:{m:10,d:13},rival:"UCH", local:true,  real:"2-0"},
 {fecha:21, f:{m:10,d:20},rival:"UC",  local:false, real:"0-2"},
 {fecha:22, f:{m:10,d:27},rival:"LSE", local:true,  real:"3-1"},
 {fecha:23, f:{m:11,d:3}, rival:"OHI", local:false, real:"1-0"},
 {fecha:24, f:{m:11,d:9}, rival:"COB", local:true,  real:"4-2"},
 {fecha:25, f:{m:11,d:17},rival:"SW",  local:false, real:"0-1"},
 {fecha:26, f:{m:11,d:23},rival:"FV",  local:true,  real:"4-2"},
 {fecha:27, f:{m:11,d:28},rival:"OSO", local:false, real:"2-2"},
 {fecha:28, f:{m:11,d:30},rival:"PAL", local:true,  real:"1-1"},
 {fecha:29, f:{m:12,d:18},rival:"COQ", local:false, real:"0-0"},
 {fecha:30, f:{m:12,d:22},rival:"ANT", local:true,  real:"1-0"}
];
FIXTURES_OFICIALES.CC[1991]=LIGA_CC_1991;
/* Notas históricas que se muestran después de jugar cada partido de copa */
const NOTAS_COPA={
 "Semifinal-1":"En la vuelta de semifinales, el 22 de mayo de 1991 en el Monumental, Colo-Colo ganó 3-1. El partido pasó a la historia como la «Batalla de Macul» por los incidentes: fueron expulsados Patricio Yáñez y Blas Giunta.",
 "FINAL-1":"El 5 de junio de 1991 Colo-Colo ganó 3-0 en el Monumental ante Olimpia, con doblete de Luis Pérez y gol de Leonel Herrera, y se consagró campeón de América. Es el único título de Copa Libertadores del fútbol chileno.",
 "Cuartos-0":"El 3 de mayo de 1991 Colo-Colo goleó 4-0 a Nacional de Montevideo, con goles de Rubén Martínez, dos de Ricardo Dabrowski y uno de Rubén Espinoza.",
 "Octavos-1":"En la vuelta de octavos, Colo-Colo venció 2-1 a Universitario de Lima con dos goles de Rubén Espinoza.",
 "INTERC-0":"El 8 de diciembre de 1991 en Tokio, Estrella Roja ganó 3-0 la Copa Intercontinental. Resultado real documentado."
};

/* ---------- clima ---------- */
/* El clima de cada partido se fija al construir el calendario y después el
   motor de partido lo lee: cambia el desgaste (cansancio) y la precisión
   (cuántas ocasiones terminan en gol). */
const CLIMAS={
 despejado:{n:"despejado",ic:"☀️",desgaste:0,  precision:1.00, d:"Tarde despejada, cancha en buen estado."},
 calor:    {n:"calor",    ic:"🌡️",desgaste:1.3,precision:0.97, d:"Calor pesado: se va a sentir en las piernas."},
 lluvia:   {n:"lluvia",   ic:"🌧️",desgaste:0.8,precision:0.89, d:"Llueve fuerte y la pelota queda pesada."},
 viento:   {n:"viento",   ic:"🌬️",desgaste:0.3,precision:0.92, d:"Viento cruzado que complica cada pelota alta."},
 frio:     {n:"frío",     ic:"❄️",desgaste:0.6,precision:0.96, d:"Frío de invierno y cancha dura."}
};
function climaDeFecha(mes,seed){
  const rr=azarFijo(semilla("clima-"+seed+"-"+mes));
  let tabla;
  if(mes>=6&&mes<=8) tabla=[["lluvia",3],["frio",3],["viento",2],["despejado",2]];        // invierno
  else if(mes===12||mes<=2) tabla=[["calor",3],["despejado",4],["viento",1]];              // verano
  else tabla=[["despejado",5],["viento",2],["lluvia",2],["calor",1]];                      // media estación
  const tot=tabla.reduce((s,x)=>s+x[1],0); let r=rr()*tot;
  for(const par of tabla){ r-=par[1]; if(r<=0) return par[0]; }
  return "despejado";
}
/* ---------- generación de calendario ---------- */
/* Round robin de 16 equipos → 15 fechas por rueda, 30 en total. */
function fixturesLiga(equipos){
  const ids=equipos.map(e=>e.id), n=ids.length;
  const rot=ids.slice(1), fijo=ids[0], ruedas=[];
  for(let r=0;r<n-1;r++){
    const fecha=[]; const orden=[fijo].concat(rot);
    for(let i=0;i<n/2;i++){
      const a=orden[i], b=orden[n-1-i];
      fecha.push(r%2===0?[a,b]:[b,a]);
    }
    ruedas.push(fecha);
    rot.unshift(rot.pop());
  }
  const vuelta=ruedas.map(f=>f.map(p=>[p[1],p[0]]));
  return ruedas.concat(vuelta);
}
/* Fechas del calendario 1991: del 27 de abril al 22 de diciembre, una por semana */
function fechasTemporada(){
  const out=[]; let m=4,d=27;
  for(let i=0;i<30;i++){
    out.push({m:m,d:d});
    d+=7;
    while(d>[31,28,31,30,31,30,31,31,30,31,30,31][m-1]){ d-=[31,28,31,30,31,30,31,31,30,31,30,31][m-1]; m++; }
  }
  return out;
}
/* Construye el calendario completo del año para el club del jugador */
function ordenFecha(f){ return (f.m||1)*100+(f.d||1); }
function shuffleSeed(arr,seed){
  const a=arr.slice(); let s=seed||1;
  for(let i=a.length-1;i>0;i--){
    s=(s*9301+49297)%233280;
    const j=Math.floor((s/233280)*(i+1));
    const t=a[i]; a[i]=a[j]; a[j]=t;
  }
  return a;
}
/* Arma los 8 partidos de una fecha: usa fixtures oficiales si hay, el resto se empareja con semilla fija. */
function emparejarFecha(anio,nFecha,clubId,rivalId){
  const pares=[]; const used={};
  const add=(a,b)=>{
    if(!a||!b||a===b) return;
    const k=a<b?a+"-"+b:b+"-"+a;
    if(used[k]) return;
    used[k]=1; pares.push([a,b]);
  };
  if(clubId&&rivalId) add(clubId,rivalId);
  if(typeof FIXTURES_OFICIALES==="object"){
    Object.keys(FIXTURES_OFICIALES).forEach(cid=>{
      const fx=(FIXTURES_OFICIALES[cid]||{})[anio];
      if(!fx) return;
      const m=fx.find(x=>x.fecha===nFecha);
      if(!m) return;
      add(m.local?cid:m.rival, m.local?m.rival:cid);
    });
  }
  const ids=(typeof LIGA_ACT!=="undefined"?LIGA_ACT:[]).map(c=>c.id).filter(id=>!pares.some(p=>p[0]===id||p[1]===id));
  const rest=shuffleSeed(ids,(anio||0)*100+(nFecha||1)*17+3);
  for(let i=0;i+1<rest.length;i+=2) add(rest[i],rest[i+1]);
  return pares;
}
function construirCalendario(clubId, anio, conCopa){
  const cal=[];
  if(conCopa && anio===1991 && clubId==="CC"){
    COPA91.forEach((p,i)=>cal.push({
      tipo:"copa", torneo:"Copa Libertadores", ronda:p.ronda, rivalNombre:p.rival, rivalId:null,
      fuerzaRival:p.fuerza, local:p.local, sede:p.sede, f:p.f, jugado:false, clima:climaDeFecha(p.f.m,"copa"+anio+i),
      real:p.real, apodo:p.apodo||null, notaId:p.ronda+"-"+(cal.filter(x=>x.ronda===p.ronda).length)
    }));
    cal.push({
      tipo:"copa", torneo:"Copa Intercontinental", ronda:INTERC91.ronda, rivalNombre:INTERC91.rival, rivalId:null,
      fuerzaRival:INTERC91.fuerza, local:false, sede:INTERC91.sede, f:INTERC91.f, jugado:false,
      clima:"frio", real:INTERC91.real, apodo:"Tokio 1991", notaId:"INTERC-0"
    });
  }
  const fxOf=(typeof FIXTURES_OFICIALES!=="undefined"&&FIXTURES_OFICIALES[clubId])?FIXTURES_OFICIALES[clubId][anio]:null;
  if(fxOf){
    fxOf.forEach((p,i)=>{
      const riv=CLUB_POR_ID[p.rival]; if(!riv) return;
      cal.push({tipo:"liga", torneo:anio>=2010?"Liga de Primera":"Campeonato Nacional", fecha:p.fecha, rivalId:p.rival,
        rivalNombre:riv.n, fuerzaRival:riv.fuerza, local:p.local,
        sede:p.local?CLUB_POR_ID[clubId].est:riv.est,
        f:p.f, jugado:false, clima:climaDeFecha(p.f.m,"liga"+clubId+anio+i), real:p.real,
        jornada:emparejarFecha(anio,p.fecha,clubId,p.rival)});
    });
    cal.sort((a,b)=>ordenFecha(a.f)-ordenFecha(b.f));
    return cal;
  }
  if(anio===2026 && typeof LIGA_CC_2026!=="undefined"){
    LIGA_CC_2026.forEach(p=>{
      const pares=emparejarFecha(anio,p.fecha,clubId,null);
      const mio=pares.find(x=>x[0]===clubId||x[1]===clubId);
      if(!mio) return;
      const local=mio[0]===clubId, rival=local?mio[1]:mio[0];
      const riv=CLUB_POR_ID[rival]; if(!riv) return;
      cal.push({tipo:"liga", torneo:"Liga de Primera", fecha:p.fecha, rivalId:rival,
        rivalNombre:riv.n, fuerzaRival:riv.fuerza, local:local,
        sede:local?CLUB_POR_ID[clubId].est:riv.est,
        f:p.f, jugado:false, clima:climaDeFecha(p.f.m,"liga"+clubId+anio+p.fecha),
        jornada:pares});
    });
    cal.sort((a,b)=>ordenFecha(a.f)-ordenFecha(b.f));
    return cal;
  }
  const fx=fixturesLiga(LIGA_ACT), fechas=fechasTemporada();
  fx.forEach((jornada,i)=>{
    const mio=jornada.find(p=>p[0]===clubId||p[1]===clubId);
    if(!mio) return;
    const local=mio[0]===clubId, rival=local?mio[1]:mio[0];
    cal.push({tipo:"liga", torneo:"Campeonato Nacional", fecha:i+1, rivalId:rival,
      rivalNombre:CLUB_POR_ID[rival].n, fuerzaRival:CLUB_POR_ID[rival].fuerza,
      local:local, sede:local?CLUB_POR_ID[clubId].est:CLUB_POR_ID[rival].est,
      f:fechas[i], jugado:false, clima:climaDeFecha(fechas[i].m,"liga"+clubId+anio+i), jornada:jornada});
  });
  cal.sort((a,b)=>(a.f.m*100+(a.f.d||15))-(b.f.m*100+(b.f.d||15)));
  return cal;
}
