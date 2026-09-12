"use strict";
/* ============================================================
   FUTBOLINI 7.78 · data-1925.js
   PROMPT E · Modo 1925, fundación de Colo-Colo.
   Liga Metropolitana División de Honor 1925: 13 inscritos,
   Unión Chilena se retiró (resultados anulados) → 12 clubes
   de una rueda. Amateur. Wikipedia / historiadecolocolo.com
   (Salinas, Por Empuje y Coraje, 2004).
   Plantel documentado: solo Colo-Colo 1925. El resto, cantera.
   Cargar DESPUÉS de data-2006.js.
   ============================================================ */

const LIGA_1925=[
 /* fuente: Wikipedia «División de Honor de la Liga Metropolitana 1925» */
 {id:"CC", n:"Colo-Colo",           c:"Colo-Colo",     fuerza:82, aforo:8000, est:"Campos de Sports de Ñuñoa", ciudad:"Santiago", esc:"⚫", fund:1925, dt:"David Arellano"},
 {id:"PDM",n:"Primero de Mayo",     c:"1° de Mayo",    fuerza:76, aforo:4000, est:"Cancha de Primero de Mayo", ciudad:"Santiago", esc:"🔴", fund:null},
 {id:"AUD",n:"Audax Italiano",      c:"Audax",         fuerza:75, aforo:5000, est:"Cancha de Audax",           ciudad:"Santiago", esc:"🟢", fund:1910},
 {id:"ELR",n:"Eleuterio Ramírez",   c:"E. Ramírez",    fuerza:70, aforo:3000, est:"Cancha de Eleuterio Ramírez",ciudad:"Santiago",esc:"🔵", fund:null},
 {id:"MAG",n:"Magallanes",          c:"Magallanes",    fuerza:68, aforo:6000, est:"Cancha de Magallanes",      ciudad:"Santiago", esc:"🔵", fund:1897},
 {id:"GCX",n:"Gold Cross",          c:"Gold Cross",    fuerza:58, aforo:3000, est:"Cancha de Gold Cross",      ciudad:"Santiago", esc:"🟡", fund:null},
 {id:"MST",n:"Morning Star",        c:"Morning Star",  fuerza:58, aforo:3000, est:"Cancha de Morning Star",    ciudad:"Santiago", esc:"⚪", fund:null},
 {id:"BCN",n:"Barcelona",           c:"Barcelona",     fuerza:58, aforo:3000, est:"Cancha Barcelona/Gold Cross",ciudad:"Santiago",esc:"🔴", fund:null},
 {id:"SNA",n:"Santiago National",   c:"S. National",   fuerza:55, aforo:3000, est:"Cancha English",            ciudad:"Santiago", esc:"⚪", fund:1904},
 {id:"NAC",n:"Nacional",            c:"Nacional",      fuerza:50, aforo:3000, est:"Cancha de Nacional",        ciudad:"Santiago", esc:"🔵", fund:null},
 {id:"LBL",n:"Loma Blanca",         c:"Loma Blanca",   fuerza:48, aforo:2500, est:"Campos de Sports de Ñuñoa",ciudad:"Santiago", esc:"⚪", fund:null},
 {id:"ENG",n:"English",             c:"English",       fuerza:44, aforo:3000, est:"Cancha del Club English",   ciudad:"Santiago", esc:"🔴", fund:null}
];
/* Unión Chilena se retiró: no se incluye. */

const FORMAT_1925={
  n:12,
  pts:2,
  amateur:true,
  federacion:{sigla:"LMD", nombre:"Liga Metropolitana de Deportes", ascenso:null,
    terminos:["amateur","cuotas de socio","cancha","Campos de Sports","invicto"]},
  juego:"Una rueda, 11 fechas. Victoria vale 2 puntos (época). Sin profesionalismo.",
  campeon:"Colo-Colo, invicto (10G 1E 0P, 61-5). Última fecha: 6-0 a Barcelona, 11 oct 1925.",
  debut:"31 may 1925, Colo-Colo 6-0 English, cancha del Club English. ~300 espectadores."
};

const SECCIONES_OCULTAS_1925=["redes","mercado"];
/* Qué NO debe aparecer en 1925 (para Claude/UI):
   redes sociales, Copa Libertadores, VAR, sponsors modernos,
   mercado de pases millonario, Primera B/Segunda profesional,
   sociedades anónimas, TV, apuestas, bolsa. */

const FUNDACION_CC_1925={
  fecha:"19 de abril de 1925",
  lugar:"Estadio El Llano, San Miguel (acta). Reunión previa el 18 en casa de los Arellano, calle Covadonga.",
  origen:"Escisión de Magallanes. Jóvenes liderados por David Arellano piden profesionalizar; la directiva no acepta. Asamblea del 4 de abril: «Ancha es la puerta».",
  nombre:"Luis Contreras propone «Colo-Colo» (cacique mapuche). Otros nombres descartados: Independiente, O'Higgins, Arturo Prat.",
  uniforme:"Juan Quiñones: camiseta blanca (pureza), pantalón negro (seriedad), medias negras con franja blanca.",
  lema:"Todos para uno y uno para todos. Timbre: Fuerza y destreza.",
  presidente:"Alberto Parodi. Capitán/DT: David Arellano.",
  plantelDoc:"Cataldo, N. Arroyo, Stavelot; A. Bascuñán, T. Bascuñán; F. Arellano, Cáceres, Quiñones, Mancilla; D. Arellano, Moreno, Contreras, Acuña, R. Arroyo, Sepúlveda. Fuente: Wikipedia temporada 1925 / Salinas 2004."
};

const PRENSA_1925=[
  {ctx:"titular", registro:"neutro", txt:"COLO-COLO FOOT-BALL CLUB. Fundado el 19 de abril en El Llano."},
  {ctx:"titular", registro:"neutro", txt:"Los albos debutan con goleada: 6 a 0 al English."},
  {ctx:"titular", registro:"neutro", txt:"Arellano anota cuatro. El nuevo club no conoce la derrota."},
  {ctx:"titular", registro:"neutro", txt:"Campeón invicto de la Liga Metropolitana, el mismo año de su fundación."},
  {ctx:"titular", registro:"cl", txt:"Nació el Cacique, po. Blancos, serios, y le ganaron a los de Magallanes 2-0."}
];

/* Plantel 1925 documentado (edades APROXIMADAS; David Arellano nació en 1901). */
const PLANTEL_CC_1925=[
 ["Eduardo Cataldo","ARQ",24,70,70,0,0,["amateur"]],
 ["Nicolás Arroyo","ARQ",23,62,62,0,0,["amateur"]],
 ["Armando Stavelot","ARQ",24,60,60,0,0,["amateur"]],
 ["Absalón Bascuñán","DEF",24,72,72,0,0,["amateur"]],
 ["Togo Bascuñán","DEF",22,70,70,0,0,["amateur"]],
 ["Francisco Arellano","VOL",22,74,74,0,0,["amateur","hermano de David"]],
 ["Guillermo Cáceres","VOL",24,72,72,0,0,["amateur"]],
 ["Juan Quiñones","VOL",24,73,73,0,0,["amateur","diseñó el uniforme"]],
 ["Luis Mancilla","VOL",23,68,68,0,0,["amateur"]],
 ["David Arellano","DEL",24,88,88,0,0,["ídolo","capitán","goleador"]],
 ["Humberto Moreno","DEL",23,80,80,0,0,["amateur","goleador"]],
 ["Luis Contreras","DEL",24,76,76,0,0,["amateur","puso el nombre"]],
 ["Clemente Acuña","DEL",23,74,74,0,0,["amateur"]],
 ["Rubén Arroyo","DEL",23,70,70,0,0,["amateur"]],
 ["Rubén Sepúlveda","DEL",23,68,68,0,0,["amateur"]]
];
if(typeof PLANTELES_REALES==="object"){
  PLANTELES_REALES.CC=PLANTELES_REALES.CC||{};
  PLANTELES_REALES.CC[1925]=PLANTEL_CC_1925;
}

const CLUB_INFO_1925={};
const IND_BASE_1925={};
const CAJA_BASE_1925={};
(function armar1925(){
  LIGA_1925.forEach(function(c){
    const f=c.fuerza||50;
    CLUB_INFO_1925[c.id]={
      n:c.n, esc:c.esc||"⚪", est:c.est, dt:c.dt||"el capitán",
      ciudad:"Santiago", fund:c.fund,
      desc:c.n+" en la Liga Metropolitana amateur de 1925. Sin sueldos profesionales."
    };
    IND_BASE_1925[c.id]={
      plantel:Math.round(f), moral:60, hinchada:Math.round(30+f*0.4), socios:Math.round(20+f*0.3),
      cantera:40, estadio:28, prestigio:Math.round(f*0.6), riesgo:20
    };
    /* plata en millones de pesos de JUEGO, no históricos: caja chica amateur */
    CAJA_BASE_1925[c.id]={ plata:Math.max(8,Math.round(f/4)), deuda:Math.round(f/10) };
  });
  CLUB_INFO_1925.CC.desc="Año 1. Escisión de Magallanes. David Arellano capitán y DT. Camiseta blanca, pantalón negro. Invicto en la Metropolitana.";
  CLUB_INFO_1925.CC.dt="David Arellano";
  CLUB_INFO_1925.MAG.desc="El club del que salieron los albos. En 1925 Magallanes queda 5° de la Metropolitana. El cisma es fresco.";
})();

function ids1925(){ return LIGA_1925.map(function(c){ return c.id; }); }
function esClub1925(id){ return ids1925().indexOf(id)>=0; }

if(typeof LIGAS==="object") LIGAS[1925]=LIGA_1925;
if(typeof ERA==="object"){
  ERA[1925]={n:"1925", pais:"metropolitana", puntosVictoria:2, inflacion:0.12, cuposInternacional:0,
    desc:"Amateur. Liga Metropolitana de Deportes. No hay redes, ni Libertadores, ni mercado millonario. La plata es de cuotas.",
    secciones_ocultas:SECCIONES_OCULTAS_1925};
}

(function wrap1925(){
  if(typeof construirCalendario==="function" && !construirCalendario._e25){
    const orig=construirCalendario;
    construirCalendario=function(clubId,anio,conCopa){
      if(typeof E!=="undefined" && E && E.eraBase===1925){
        const fx=(typeof fixturesLiga==="function")?fixturesLiga(LIGA_1925):[];
        const ida=fx.slice(0, Math.max(0, LIGA_1925.length-1)); /* una rueda, 11 fechas */
        const cal=[];
        ida.forEach(function(fecha,i){
          const mio=fecha.find(function(p){ return p[0]===clubId||p[1]===clubId; });
          if(!mio) return;
          const local=mio[0]===clubId, rival=local?mio[1]:mio[0];
          const riv=LIGA_1925.filter(function(c){ return c.id===rival; })[0];
          if(!riv) return;
          const yo=LIGA_1925.filter(function(c){ return c.id===clubId; })[0];
          const meses=[5,6,6,6,7,7,7,8,8,8,10];
          const dias=[31,7,14,21,5,19,26,2,9,23,11];
          const ff={m:meses[i]||5, d:dias[i]||1};
          cal.push({tipo:"liga", torneo:"Liga Metropolitana", fecha:i+1, rivalId:rival,
            rivalNombre:riv.n, fuerzaRival:riv.fuerza, local:local,
            sede:local?((yo&&yo.est)||"cancha"):riv.est,
            f:ff, jugado:false, clima:"despejado", jornada:fecha});
        });
        return cal;
      }
      return orig(clubId,anio,conCopa);
    };
    construirCalendario._e25=true;
  }
  try{ if(typeof _mapaTodosCache!=="undefined") _mapaTodosCache=null; }catch(e){}
})();
