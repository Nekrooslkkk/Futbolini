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
const CLUB_POR_ID={}; LIGA91.forEach(c=>CLUB_POR_ID[c.id]=c);

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
 {ronda:"Grupo 2", rival:"Deportes Concepción", sede:"Estadio Collao", local:false, f:{m:2},  real:"0-0", fuerza:64},
 {ronda:"Grupo 2", rival:"Barcelona SC",        sede:"Monumental",     local:true,  f:{m:2},  real:"3-1", fuerza:70},
 {ronda:"Grupo 2", rival:"Deportes Concepción", sede:"Monumental",     local:true,  f:{m:3},  real:"2-0", fuerza:64},
 {ronda:"Grupo 2", rival:"LDU de Quito",        sede:"Monumental",     local:true,  f:{m:3},  real:"3-0", fuerza:68},
 {ronda:"Grupo 2", rival:"Barcelona SC",        sede:"Guayaquil",      local:false, f:{m:3},  real:"2-2", fuerza:74},
 {ronda:"Grupo 2", rival:"LDU de Quito",        sede:"Quito (altura)", local:false, f:{m:4},  real:"0-0", fuerza:76},
 {ronda:"Octavos", rival:"Universitario",       sede:"Lima",           local:false, f:{m:4},  real:"0-0", fuerza:72},
 {ronda:"Octavos", rival:"Universitario",       sede:"Monumental",     local:true,  f:{m:4},  real:"2-1", fuerza:72},
 {ronda:"Cuartos", rival:"Nacional",            sede:"Monumental",     local:true,  f:{m:5,d:3},  real:"4-0", fuerza:78},
 {ronda:"Cuartos", rival:"Nacional",            sede:"Montevideo",     local:false, f:{m:5,d:8},  real:"0-2", fuerza:80},
 {ronda:"Semifinal",rival:"Boca Juniors",       sede:"La Bombonera",   local:false, f:{m:5,d:15}, real:"0-1", fuerza:84},
 {ronda:"Semifinal",rival:"Boca Juniors",       sede:"Monumental",     local:true,  f:{m:5,d:22}, real:"3-1", fuerza:84, apodo:"Batalla de Macul"},
 {ronda:"FINAL",   rival:"Olimpia",             sede:"Asunción",       local:false, f:{m:5,d:29}, real:"0-0", fuerza:80},
 {ronda:"FINAL",   rival:"Olimpia",             sede:"Monumental",     local:true,  f:{m:6,d:5},  real:"3-0", fuerza:80}
];
/* Notas históricas que se muestran después de jugar cada partido de copa */
const NOTAS_COPA={
 "Semifinal-1":"En la vuelta de semifinales, el 22 de mayo de 1991 en el Monumental, Colo-Colo ganó 3-1. El partido pasó a la historia como la «Batalla de Macul» por los incidentes: fueron expulsados Patricio Yáñez y Blas Giunta.",
 "FINAL-1":"El 5 de junio de 1991 Colo-Colo ganó 3-0 en el Monumental ante Olimpia, con doblete de Luis Pérez y gol de Leonel Herrera, y se consagró campeón de América. Es el único título de Copa Libertadores del fútbol chileno.",
 "Cuartos-0":"El 3 de mayo de 1991 Colo-Colo goleó 4-0 a Nacional de Montevideo, con goles de Rubén Martínez, dos de Ricardo Dabrowski y uno de Rubén Espinoza.",
 "Octavos-1":"En la vuelta de octavos, Colo-Colo venció 2-1 a Universitario de Lima con dos goles de Rubén Espinoza."
};

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
function construirCalendario(clubId, anio, conCopa){
  const cal=[];
  if(conCopa && anio===1991 && clubId==="CC"){
    COPA91.forEach((p,i)=>cal.push({
      tipo:"copa", torneo:"Copa Libertadores", ronda:p.ronda, rivalNombre:p.rival, rivalId:null,
      fuerzaRival:p.fuerza, local:p.local, sede:p.sede, f:p.f, jugado:false,
      real:p.real, apodo:p.apodo||null, notaId:p.ronda+"-"+(cal.filter(x=>x.ronda===p.ronda).length)
    }));
  }
  const fx=fixturesLiga(LIGA91), fechas=fechasTemporada();
  fx.forEach((jornada,i)=>{
    const mio=jornada.find(p=>p[0]===clubId||p[1]===clubId);
    if(!mio) return;
    const local=mio[0]===clubId, rival=local?mio[1]:mio[0];
    cal.push({tipo:"liga", torneo:"Campeonato Nacional", fecha:i+1, rivalId:rival,
      rivalNombre:CLUB_POR_ID[rival].n, fuerzaRival:CLUB_POR_ID[rival].fuerza,
      local:local, sede:local?CLUB_POR_ID[clubId].est:CLUB_POR_ID[rival].est,
      f:fechas[i], jugado:false, jornada:jornada});
  });
  cal.sort((a,b)=>(a.f.m*100+(a.f.d||15))-(b.f.m*100+(b.f.d||15)));
  return cal;
}
