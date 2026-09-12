"use strict";
/* ============================================================
   FUTBOLINI 7.33 · data-copas2026.js
   Copas CONMEBOL: 2026 usa grupos y fechas REALES (ya se jugaron).
   Solo los clubes chilenos que clasificaron. 2027+ es sorteo del
   juego, etiquetado como tal. Nunca se inventa un grupo 2026.
   Se carga DESPUÉS de ia.js / carrera.js y ANTES de data-32.js.
   ============================================================ */

/* Chile 2026 entra por 2025: CH1 Coquimbo, CH2 Católica, CH3 O'Higgins,
   CH4 Huachipato. A grupos de Libertadores SOLO Coquimbo y Católica.
   Sudamericana primera fase (partido único): UCH-PAL y COB-AUD. */
var LIB_GRUPOS_2026_CHILE={COQ:"B",UC:"D"};
var LIB_FASE2_2026={HUA:1,OHI:1};
var SUD_FASE1_2026={UCH:1,PAL:1,COB:1,AUD:1};

/* Grupos CONMEBOL 2026 documentados (CONMEBOL / TyC / Sporting News, sep 2026).
   Solo grupos con fuente. El juego simula los marcadores; no copia el fixture ajeno
   como si fuera el resultado oficial, salvo el partido del jugador. */
var CONMEBOL_GRUPOS_2026={
  lib:[
    {letra:"A", chile:[], arg:["ELP"],
      ids:["FLA_BR","ELP","DIM_CO","CUS_PE"],
      nom:{FLA_BR:"Flamengo",ELP:"Estudiantes (LP)",DIM_CO:"Independiente Medellín",CUS_PE:"Cusco FC"},
      fue:{FLA_BR:90,ELP:75,DIM_CO:76,CUS_PE:68}},
    {letra:"B", chile:["COQ"], arg:[],
      ids:["COQ","TOL_CO","NAC_UY","UNI_PE"],
      nom:{COQ:"Coquimbo Unido",TOL_CO:"Deportes Tolima",NAC_UY:"Nacional",UNI_PE:"Universitario"},
      fue:{COQ:72,TOL_CO:76,NAC_UY:80,UNI_PE:74}},
    {letra:"C", chile:[], arg:["IRV"],
      ids:["IRV","FLU_BR","BOL_BO","DLG_VE"],
      nom:{IRV:"Independiente Rivadavia",FLU_BR:"Fluminense",BOL_BO:"Bolívar",DLG_VE:"Deportivo La Guaira"},
      fue:{IRV:61,FLU_BR:84,BOL_BO:76,DLG_VE:64}},
    {letra:"D", chile:["UC"], arg:["BOC"],
      ids:["UC","CRU_BR","BOC","BAR_EC"],
      nom:{UC:"Universidad Católica",CRU_BR:"Cruzeiro",BOC:"Boca Juniors",BAR_EC:"Barcelona SC"},
      fue:{UC:78,CRU_BR:84,BOC:86,BAR_EC:76}},
    {letra:"E", chile:[], arg:["PLA"],
      ids:["COR_BR","PLA","SFE_CO","PEN_UY"],
      nom:{COR_BR:"Corinthians",PLA:"Platense",SFE_CO:"Independiente Santa Fe",PEN_UY:"Peñarol"},
      fue:{COR_BR:82,PLA:63,SFE_CO:74,PEN_UY:78}}
  ],
  sud:[
    {letra:"C", chile:["OHI"], arg:[],
      ids:["OHI","MIL_CO","SAO_BR","BOS_UY"],
      nom:{OHI:"O'Higgins",MIL_CO:"Millonarios",SAO_BR:"São Paulo",BOS_UY:"Boston River"},
      fue:{OHI:70,MIL_CO:76,SAO_BR:84,BOS_UY:68}},
    {letra:"F", chile:["PAL"], arg:["RIE"],
      ids:["PAL","RIE","MCT_UY","GRE_BR"],
      nom:{PAL:"Palestino",RIE:"Deportivo Riestra",MCT_UY:"Montevideo City Torque",GRE_BR:"Grêmio"},
      fue:{PAL:68,RIE:58,MCT_UY:70,GRE_BR:82}},
    {letra:"G", chile:["AUD"], arg:["BAR"],
      ids:["AUD","OLI_PY","VAS_BR","BAR"],
      nom:{AUD:"Audax Italiano",OLI_PY:"Olimpia",VAS_BR:"Vasco da Gama",BAR:"Barracas Central"},
      fue:{AUD:68,OLI_PY:80,VAS_BR:82,BAR:57}}
  ]
};
function conmebolGrupoDe(clubId, torneo){
  var pack=CONMEBOL_GRUPOS_2026[torneo==="lib"||torneo==="Copa Libertadores"?"lib":"sud"];
  if(!pack) return null;
  var i;
  for(i=0;i<pack.length;i++) if(pack[i].ids.indexOf(clubId)>=0) return pack[i];
  return null;
}

function clubEnLibertadores2026(id){ return !!(LIB_GRUPOS_2026_CHILE[id]||LIB_FASE2_2026[id]||(typeof conmebolGrupoDe==="function"&&conmebolGrupoDe(id,"lib"))); }
function clubEnSudamericana2026(id){ return !!SUD_FASE1_2026[id]||id==="OHI"||(typeof conmebolGrupoDe==="function"&&conmebolGrupoDe(id,"sud")); }

function etqCompromiso(part){
  if(!part) return "";
  var t=(typeof nombreTorneo==="function")?nombreTorneo(part):(part.torneo||"Campeonato");
  if(part.tipo==="copa") return t+" · "+(part.ronda||"Copa");
  return t+(part.fecha!=null?" · fecha "+part.fecha:"");
}

function mCopa(clubId, spec){
  var yo=(typeof clubLookup==="function")?clubLookup(clubId):null;
  var riv=spec.rivalId&&typeof clubLookup==="function"?clubLookup(spec.rivalId):null;
  var sede=spec.sede||(spec.local?(yo&&yo.est)||"local":(riv&&riv.est)||spec.sedeRiv||"estadio rival");
  return {
    tipo:"copa", torneo:spec.torneo, ronda:spec.ronda,
    rivalId:spec.rivalId||null,
    rivalNombre:riv?riv.n:spec.rival,
    fuerzaRival:riv?riv.fuerza:(spec.fuerza||72),
    local:!!spec.local, sede:sede, f:spec.f, jugado:false,
    clima:(typeof climaDeFecha==="function")?climaDeFecha(spec.f.m,(spec.torneo||"copa")+clubId+(spec.ronda||"")+(spec.f.d||0)):"despejado",
    real:spec.real||null, apodo:spec.apodo||null,
    nota:spec.nota||"Fecha y rival reales 2026 (CONMEBOL / Wikipedia). El marcador histórico es referencia; tú lo juegas desde enero.",
    notaId:spec.notaId||("C26-"+(spec.ronda||"x")+"-"+(spec.rivalId||spec.rival||"x")+"-"+(spec.local?"L":"V"))
  };
}

/* ---------- calendarios reales 2026 (gf-gc desde el club chileno) ---------- */
var COPA_2026_INICIAL={
  COQ:[
    {torneo:"Copa Libertadores",ronda:"Grupo B",rival:"Nacional",fuerza:80,local:true, sede:"Francisco Sánchez Rumoroso",sedeRiv:"Gran Parque Central",f:{m:4,d:8}, real:"1-1"},
    {torneo:"Copa Libertadores",ronda:"Grupo B",rival:"Universitario",fuerza:74,local:false,sede:"Estadio Monumental (Lima)",f:{m:4,d:14},real:"2-0"},
    {torneo:"Copa Libertadores",ronda:"Grupo B",rival:"Deportes Tolima",fuerza:76,local:false,sede:"Manuel Murillo Toro",f:{m:4,d:28},real:"0-3"},
    {torneo:"Copa Libertadores",ronda:"Grupo B",rival:"Universitario",fuerza:74,local:true, sede:"Francisco Sánchez Rumoroso",f:{m:5,d:7}, real:"2-1"},
    {torneo:"Copa Libertadores",ronda:"Grupo B",rival:"Deportes Tolima",fuerza:76,local:true, sede:"Francisco Sánchez Rumoroso",f:{m:5,d:19},real:"3-0"},
    {torneo:"Copa Libertadores",ronda:"Grupo B",rival:"Nacional",fuerza:80,local:false,sede:"Gran Parque Central",f:{m:5,d:26},real:"0-1"}
  ],
  UC:[
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Boca Juniors",fuerza:86,local:true, sede:"Claro Arena",sedeRiv:"La Bombonera",f:{m:4,d:7}, real:"1-2"},
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Cruzeiro",fuerza:84,local:false,sede:"Mineirão",f:{m:4,d:15},real:"2-1"},
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Barcelona SC",fuerza:76,local:false,sede:"Monumental (Guayaquil)",f:{m:4,d:29},real:"2-1"},
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Cruzeiro",fuerza:84,local:true, sede:"Claro Arena",f:{m:5,d:6}, real:"0-0"},
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Barcelona SC",fuerza:76,local:true, sede:"Claro Arena",f:{m:5,d:21},real:"2-0"},
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Boca Juniors",fuerza:86,local:false,sede:"La Bombonera",f:{m:5,d:28},real:"1-0"}
  ],
  HUA:[
    {torneo:"Copa Libertadores",ronda:"Fase 2",rival:"Carabobo",fuerza:70,local:false,sede:"Polideportivo Misael Delgado",f:{m:2,d:17},real:"0-1"},
    {torneo:"Copa Libertadores",ronda:"Fase 2",rival:"Carabobo",fuerza:70,local:true, sede:"Huachipato-CAP Acero",f:{m:2,d:24},real:"1-2"}
  ],
  OHI:[
    {torneo:"Copa Libertadores",ronda:"Fase 2",rival:"Bahia",fuerza:78,local:true, sede:"El Teniente",sedeRiv:"Arena Fonte Nova",f:{m:2,d:18},real:"1-0"},
    {torneo:"Copa Libertadores",ronda:"Fase 2",rival:"Bahia",fuerza:78,local:false,sede:"Arena Fonte Nova",f:{m:2,d:25},real:"1-2"}
  ],
  UCH:[
    {torneo:"Copa Sudamericana",ronda:"Primera fase",rivalId:"PAL",local:true, sede:"Estadio Nacional",f:{m:3,d:5},real:"1-2"}
  ],
  PAL:[
    {torneo:"Copa Sudamericana",ronda:"Primera fase",rivalId:"UCH",local:false,sede:"Estadio Nacional",f:{m:3,d:5},real:"2-1"}
  ],
  COB:[
    {torneo:"Copa Sudamericana",ronda:"Primera fase",rivalId:"AUD",local:true, sede:"Estadio Zorros del Desierto",f:{m:3,d:3},real:"1-1",
      nota:"Primera fase 2026, partido único. Cobresal de local en Calama (El Cobre no cumplía CONMEBOL). Histórico 1-1 y Audax pasó 3-2 en penales."}
  ],
  AUD:[
    {torneo:"Copa Sudamericana",ronda:"Primera fase",rivalId:"COB",local:false,sede:"Estadio Zorros del Desierto",f:{m:3,d:3},real:"1-1",
      nota:"Primera fase 2026, partido único en Calama. Histórico 1-1; Audax pasó 3-2 en penales. El juego, si empatas, define al azar quién pasa."}
  ],
  BOC:[
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Universidad Católica",fuerza:78,local:false,sede:"Claro Arena",f:{m:4,d:7},real:"2-1"},
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Barcelona SC",fuerza:76,local:true, sede:"La Bombonera",f:{m:4,d:15},real:"3-0"},
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Cruzeiro",fuerza:84,local:false,sede:"Mineirão",f:{m:4,d:29},real:"0-1"},
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Barcelona SC",fuerza:76,local:false,sede:"Monumental (Guayaquil)",f:{m:5,d:6},real:"0-1"},
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Cruzeiro",fuerza:84,local:true, sede:"La Bombonera",f:{m:5,d:21},real:"1-1"},
    {torneo:"Copa Libertadores",ronda:"Grupo D",rival:"Universidad Católica",fuerza:78,local:true, sede:"La Bombonera",f:{m:5,d:28},real:"0-1"}
  ],
  ELP:[
    {torneo:"Copa Libertadores",ronda:"Grupo A",rival:"Flamengo",fuerza:90,local:false,sede:"Maracaná",f:{m:4,d:8}},
    {torneo:"Copa Libertadores",ronda:"Grupo A",rival:"Independiente Medellín",fuerza:76,local:true, sede:"Jorge Luis Hirschi",f:{m:4,d:15}},
    {torneo:"Copa Libertadores",ronda:"Grupo A",rival:"Cusco FC",fuerza:68,local:false,sede:"Garcilaso",f:{m:4,d:29}},
    {torneo:"Copa Libertadores",ronda:"Grupo A",rival:"Independiente Medellín",fuerza:76,local:false,sede:"Atanasio Girardot",f:{m:5,d:6}},
    {torneo:"Copa Libertadores",ronda:"Grupo A",rival:"Cusco FC",fuerza:68,local:true, sede:"Jorge Luis Hirschi",f:{m:5,d:21}},
    {torneo:"Copa Libertadores",ronda:"Grupo A",rival:"Flamengo",fuerza:90,local:true, sede:"Jorge Luis Hirschi",f:{m:5,d:27}}
  ],
  IRV:[
    {torneo:"Copa Libertadores",ronda:"Grupo C",rival:"Bolívar",fuerza:76,local:true, sede:"Malvinas Argentinas",f:{m:4,d:8},real:"1-0"},
    {torneo:"Copa Libertadores",ronda:"Grupo C",rival:"Fluminense",fuerza:84,local:false,sede:"Maracaná",f:{m:4,d:15}},
    {torneo:"Copa Libertadores",ronda:"Grupo C",rival:"Deportivo La Guaira",fuerza:64,local:true, sede:"Malvinas Argentinas",f:{m:4,d:29}},
    {torneo:"Copa Libertadores",ronda:"Grupo C",rival:"Fluminense",fuerza:84,local:true, sede:"Malvinas Argentinas",f:{m:5,d:6}},
    {torneo:"Copa Libertadores",ronda:"Grupo C",rival:"Deportivo La Guaira",fuerza:64,local:false,sede:"Olímpico de la UCV",f:{m:5,d:21}},
    {torneo:"Copa Libertadores",ronda:"Grupo C",rival:"Bolívar",fuerza:76,local:false,sede:"Hernando Siles",f:{m:5,d:27}}
  ],
  PLA:[
    {torneo:"Copa Libertadores",ronda:"Grupo E",rival:"Corinthians",fuerza:82,local:false,sede:"Neo Química Arena",f:{m:4,d:8}},
    {torneo:"Copa Libertadores",ronda:"Grupo E",rival:"Independiente Santa Fe",fuerza:74,local:true, sede:"Ciudad de Vicente López",f:{m:4,d:15}},
    {torneo:"Copa Libertadores",ronda:"Grupo E",rival:"Peñarol",fuerza:78,local:false,sede:"Campeón del Siglo",f:{m:4,d:29}},
    {torneo:"Copa Libertadores",ronda:"Grupo E",rival:"Independiente Santa Fe",fuerza:74,local:false,sede:"El Campín",f:{m:5,d:6}},
    {torneo:"Copa Libertadores",ronda:"Grupo E",rival:"Peñarol",fuerza:78,local:true, sede:"Ciudad de Vicente López",f:{m:5,d:21}},
    {torneo:"Copa Libertadores",ronda:"Grupo E",rival:"Corinthians",fuerza:82,local:true, sede:"Ciudad de Vicente López",f:{m:5,d:27}}
  ]
};

var COPA_2026_GRUPO={
  PAL:[
    {torneo:"Copa Sudamericana",ronda:"Grupo F",rival:"Deportivo Riestra",fuerza:68,local:false,sede:"Guillermo Laza",f:{m:4,d:8},real:"0-0"},
    {torneo:"Copa Sudamericana",ronda:"Grupo F",rival:"Montevideo City Torque",fuerza:70,local:true, sede:"Municipal de La Cisterna",f:{m:4,d:14},real:"0-2"},
    {torneo:"Copa Sudamericana",ronda:"Grupo F",rival:"Grêmio",fuerza:82,local:true, sede:"Municipal de La Cisterna",f:{m:4,d:29},real:"0-0"},
    {torneo:"Copa Sudamericana",ronda:"Grupo F",rival:"Montevideo City Torque",fuerza:70,local:false,sede:"Centenario",f:{m:5,d:6},real:"0-1"},
    {torneo:"Copa Sudamericana",ronda:"Grupo F",rival:"Grêmio",fuerza:82,local:false,sede:"Arena do Grêmio",f:{m:5,d:20},real:"0-2"},
    {torneo:"Copa Sudamericana",ronda:"Grupo F",rival:"Deportivo Riestra",fuerza:68,local:true, sede:"Municipal de La Cisterna",f:{m:5,d:27},real:"1-1"}
  ],
  AUD:[
    {torneo:"Copa Sudamericana",ronda:"Grupo G",rival:"Olimpia",fuerza:80,local:true, sede:"Bicentenario de La Florida",f:{m:4,d:8},real:"0-2"},
    {torneo:"Copa Sudamericana",ronda:"Grupo G",rival:"Vasco da Gama",fuerza:82,local:false,sede:"São Januário",f:{m:4,d:14},real:"2-1"},
    {torneo:"Copa Sudamericana",ronda:"Grupo G",rival:"Barracas Central",fuerza:70,local:false,sede:"Florencio Sola",f:{m:4,d:28},real:"1-1"},
    {torneo:"Copa Sudamericana",ronda:"Grupo G",rival:"Vasco da Gama",fuerza:82,local:true, sede:"Bicentenario de La Florida",f:{m:5,d:6},real:"1-2"},
    {torneo:"Copa Sudamericana",ronda:"Grupo G",rival:"Barracas Central",fuerza:70,local:true, sede:"Bicentenario de La Florida",f:{m:5,d:19},real:"2-0"},
    {torneo:"Copa Sudamericana",ronda:"Grupo G",rival:"Olimpia",fuerza:80,local:false,sede:"Defensores del Chaco",f:{m:5,d:27},real:"1-3"}
  ],
  OHI:[
    {torneo:"Copa Sudamericana",ronda:"Grupo C",rival:"Millonarios",fuerza:76,local:true, sede:"El Teniente",f:{m:4,d:8},real:"2-0"},
    {torneo:"Copa Sudamericana",ronda:"Grupo C",rival:"São Paulo",fuerza:84,local:false,sede:"Morumbi",f:{m:4,d:14},real:"0-2"},
    {torneo:"Copa Sudamericana",ronda:"Grupo C",rival:"Boston River",fuerza:68,local:true, sede:"El Teniente",f:{m:4,d:29},real:"2-0"},
    {torneo:"Copa Sudamericana",ronda:"Grupo C",rival:"São Paulo",fuerza:84,local:true, sede:"El Teniente",f:{m:5,d:7},real:"0-0"},
    {torneo:"Copa Sudamericana",ronda:"Grupo C",rival:"Boston River",fuerza:68,local:false,sede:"Complejo Rentistas",f:{m:5,d:20},real:"2-3"},
    {torneo:"Copa Sudamericana",ronda:"Grupo C",rival:"Millonarios",fuerza:76,local:false,sede:"El Campín",f:{m:5,d:26},real:"2-1"}
  ]
};

var COPA_2026_FASE3={
  OHI:[
    {torneo:"Copa Libertadores",ronda:"Fase 3",rival:"Deportes Tolima",fuerza:76,local:true, sede:"El Teniente",f:{m:3,d:5},real:"1-0"},
    {torneo:"Copa Libertadores",ronda:"Fase 3",rival:"Deportes Tolima",fuerza:76,local:false,sede:"Manuel Murillo Toro",f:{m:3,d:12},real:"0-2"}
  ]
};

var COPA_2026_KO={
  "COQ|Copa Libertadores":[
    {torneo:"Copa Libertadores",ronda:"Octavos",rival:"Platense",fuerza:72,local:false,sede:"Ciudad de Vicente López",f:{m:8,d:12},real:"1-1"},
    {torneo:"Copa Libertadores",ronda:"Octavos",rival:"Platense",fuerza:72,local:true, sede:"Francisco Sánchez Rumoroso",f:{m:8,d:19},real:"0-0",
      nota:"Octavos reales 2026 vs Platense. Histórico 1-1 / 0-0 y Coquimbo quedó 3-4 en penales. El juego, si empatas la llave, define al azar."}
  ],
  "UC|Copa Libertadores":[
    {torneo:"Copa Libertadores",ronda:"Octavos",rival:"Estudiantes de La Plata",fuerza:80,local:false,sede:"UNO (La Plata)",f:{m:8,d:11},real:"1-1"},
    {torneo:"Copa Libertadores",ronda:"Octavos",rival:"Estudiantes de La Plata",fuerza:80,local:true, sede:"Claro Arena",f:{m:8,d:18},real:"0-3"}
  ],
  "OHI|Copa Sudamericana":[
    {torneo:"Copa Sudamericana",ronda:"Playoff",rival:"Boca Juniors",fuerza:86,local:false,sede:"La Bombonera",f:{m:7,d:24},real:"0-1"},
    {torneo:"Copa Sudamericana",ronda:"Playoff",rival:"Boca Juniors",fuerza:86,local:true, sede:"El Teniente",f:{m:7,d:31},real:"1-0",
      nota:"Playoff Sudamericana 2026 vs Boca. Histórico 0-1 / 1-0 y O'Higgins quedó 3-4 en penales."}
  ]
};

function partidosCopa2026De(clubId){
  var src=COPA_2026_INICIAL[clubId];
  if(!src) return [];
  return src.map(function(s){ return mCopa(clubId,s); });
}
function partidosLista(clubId, lista){
  if(!lista) return [];
  return lista.map(function(s){ return mCopa(clubId,s); });
}

var POOL_CONMEBOL=[
  {n:"Flamengo",f:90,est:"Maracaná"},{n:"Palmeiras",f:88,est:"Allianz Parque"},
  {n:"River Plate",f:88,est:"Más Monumental"},{n:"Boca Juniors",f:86,est:"La Bombonera"},
  {n:"São Paulo",f:84,est:"Morumbi"},{n:"Cruzeiro",f:84,est:"Mineirão"},
  {n:"Racing Club",f:80,est:"El Cilindro"},{n:"Nacional",f:80,est:"Gran Parque Central"},
  {n:"LDU Quito",f:80,est:"Rodrigo Paz Delgado"},{n:"Atlético Nacional",f:80,est:"Atanasio Girardot"},
  {n:"Independiente del Valle",f:82,est:"Banco Guayaquil"},{n:"Peñarol",f:78,est:"Campeón del Siglo"},
  {n:"Cerro Porteño",f:78,est:"General Pablo Rojas"},{n:"Olimpia",f:78,est:"Defensores del Chaco"},
  {n:"Libertad",f:78,est:"Tigo La Huerta"},{n:"Bolívar",f:76,est:"Hernando Siles"},
  {n:"Junior",f:76,est:"Metropolitano"},{n:"Universitario",f:76,est:"Monumental de Lima"},
  {n:"Sporting Cristal",f:74,est:"Alberto Gallardo"},{n:"Vélez Sarsfield",f:78,est:"José Amalfitani"}
];

function sembrarGrupoSimulado(clubId, anio, torneo){
  var pool=(typeof mezcla==="function"?mezcla:function(a){return a.slice();})(POOL_CONMEBOL.slice());
  var rivs=pool.slice(0,3);
  var seed=(typeof semilla==="function")?semilla(clubId+anio+torneo):(clubId.charCodeAt(0)+anio);
  var letra="ABCDEFGH".charAt(Math.abs(seed)%8);
  var fechas=[{m:4,d:8},{m:4,d:15},{m:4,d:29},{m:5,d:6},{m:5,d:21},{m:5,d:27}];
  var orden=[[0,true],[1,false],[2,true],[0,false],[1,true],[2,false]];
  var yo=(typeof clubLookup==="function")?clubLookup(clubId):null;
  var out=[], i, riv, local;
  for(i=0;i<6;i++){
    riv=rivs[orden[i][0]]; local=orden[i][1];
    out.push({
      tipo:"copa", torneo:torneo, ronda:"Grupo "+letra,
      rivalId:null, rivalNombre:riv.n, fuerzaRival:riv.f,
      local:local, sede:local?(yo&&yo.est)||"local":riv.est,
      f:fechas[i], jugado:false,
      clima:(typeof climaDeFecha==="function")?climaDeFecha(fechas[i].m,torneo+clubId+i):"despejado",
      real:null, apodo:null,
      nota:"Sorteo del juego para "+anio+". No es el grupo CONMEBOL "+anio+" real: el 2026 ya se jugó y el de "+anio+" no se copia.",
      notaId:"SIM-"+torneo.slice(0,3)+"-"+anio+"-"+i
    });
  }
  return out;
}
function sembrarKOSimulado(torneo, ronda, rivalNom, fuerza, estRiv, fechas, pos){
  var yo=(typeof clubLookup==="function")?clubLookup(E.club):null;
  var idaLocal=pos===2;
  var out=[], p;
  function uno(f, local){
    return {
      tipo:"copa", torneo:torneo, ronda:ronda,
      rivalId:null, rivalNombre:rivalNom, fuerzaRival:fuerza||74,
      local:!!local, sede:local?(yo&&yo.est)||"local":(estRiv||"estadio rival"),
      f:f, jugado:false,
      clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,torneo+ronda+rivalNom+(f.d||0)):"despejado",
      real:null,
      nota:"Eliminatoria armada por el juego (no es un cruce CONMEBOL publicado).",
      notaId:"SIMKO-"+ronda+"-"+rivalNom+"-"+(local?"L":"V")
    };
  }
  if(ronda==="FINAL"){
    p=uno(fechas[0]||{m:11,d:21}, false);
    p.sede="sede única (sorteo del juego)";
    out.push(p);
  } else {
    out.push(uno(fechas[0]||{m:8,d:12}, idaLocal));
    out.push(uno(fechas[1]||{m:8,d:19}, !idaLocal));
  }
  return out;
}

function insertarCopaYOrdenar(nuevos){
  if(!E||!nuevos||!nuevos.length) return;
  if(typeof insertarCopaChileYOrdenar==="function"){ insertarCopaChileYOrdenar(nuevos); return; }
  var actual=(E.calendario||[])[E.idx];
  nuevos.forEach(function(p){ E.calendario.push(p); });
  E.calendario.sort(function(a,b){
    var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
    var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
    return oa-ob;
  });
  if(actual){
    var i=E.calendario.indexOf(actual);
    if(i>=0) E.idx=i;
  }
}
function sacarCopaPendienteTorneo(torneo){
  if(!E||!E.calendario) return;
  E.calendario=E.calendario.filter(function(p){
    return !(p.tipo==="copa"&&p.torneo===torneo&&!p.jugado);
  });
}

function tablaGrupoContinental(torneo, ronda, clubId){
  var letra=(ronda||"").replace(/^Grupo\s+/i,"");
  var tor= /Sudamericana/i.test(torneo||"") ? "sud" : "lib";
  if(typeof mundoFilasConmebol==="function" && typeof E!=="undefined" && E && E.mundo){
    var filM=mundoFilasConmebol(tor, letra);
    if(filM && filM.length) return filM;
  }
  var mios=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo===torneo&&p.ronda===ronda; });
  var keys=[clubId], nombres={}; nombres[clubId]=(typeof clubLookup==="function"&&clubLookup(clubId)||{}).c||clubId;
  var fuerzas={}; fuerzas[clubId]=(typeof clubLookup==="function"&&clubLookup(clubId)||{}).fuerza||60;
  mios.forEach(function(p){
    var k=p.rivalId||p.rivalNombre;
    if(keys.indexOf(k)<0){ keys.push(k); nombres[k]=p.rivalNombre; fuerzas[k]=p.fuerzaRival||70; }
  });
  var t={};
  keys.forEach(function(id){ t[id]={id:id,n:nombres[id]||id,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  function app(a,b,ga,gb){
    if(!t[a]||!t[b]) return;
    t[a].pj++; t[b].pj++; t[a].gf+=ga; t[a].gc+=gb; t[b].gf+=gb; t[b].gc+=ga;
    if(ga>gb){ t[a].pg++; t[a].pts+=3; t[b].pp++; }
    else if(ga<gb){ t[b].pg++; t[b].pts+=3; t[a].pp++; }
    else { t[a].pe++; t[b].pe++; t[a].pts++; t[b].pts++; }
  }
  mios.forEach(function(p){
    if(!p.jugado) return;
    app(clubId, p.rivalId||p.rivalNombre, p.gf||0, p.gc||0);
  });
  var arr=keys.map(function(id){ return t[id]; });
  arr.sort(function(x,y){
    if(y.pts!==x.pts) return y.pts-x.pts;
    var dx=x.gf-x.gc, dy=y.gf-y.gc;
    if(dy!==dx) return dy-dx;
    if(y.gf!==x.gf) return y.gf-x.gf;
    return (fuerzas[y.id]||0)-(fuerzas[x.id]||0);
  });
  return arr;
}

function sembrarSiguienteContinental(part, pasa){
  var club=E.club, anio=E.anio, torneo=part.torneo, ronda=part.ronda||"";
  if(anio===2026){
    if(pasa && ronda==="Fase 2" && COPA_2026_FASE3[club]){
      insertarCopaYOrdenar(partidosLista(club, COPA_2026_FASE3[club]));
      return;
    }
    if(!pasa && ronda==="Fase 2") return; /* HUA: fuera de Lib, sin Sudamericana */
    if(!pasa && ronda==="Fase 3" && club==="OHI" && COPA_2026_GRUPO.OHI){
      insertarCopaYOrdenar(partidosLista(club, COPA_2026_GRUPO.OHI));
      notificar({t:"Drop a Sudamericana",tipo:"neutro",
        d:"Fuera de Libertadores en Fase 3. En 2026 O'Higgins cayó al Grupo C de Sudamericana (São Paulo, Millonarios, Boston River): fechas reales."});
      return;
    }
    if(pasa && ronda==="Fase 3"){
      insertarCopaYOrdenar(sembrarGrupoSimulado(club, anio, "Copa Libertadores"));
      notificar({t:"Grupo de Libertadores (sorteo del juego)",tipo:"bueno",
        d:"Pasaste Fase 3. En la vida real este club no llegó a grupos 2026, así que el grupo lo arma el juego — no es un grupo CONMEBOL inventado como si fuera oficial."});
      return;
    }
    if(pasa && ronda==="Primera fase" && COPA_2026_GRUPO[club]){
      insertarCopaYOrdenar(partidosLista(club, COPA_2026_GRUPO[club]));
      return;
    }
    if(pasa && ronda==="Primera fase"){
      insertarCopaYOrdenar(sembrarGrupoSimulado(club, anio, "Copa Sudamericana"));
      notificar({t:"Grupo de Sudamericana (sorteo del juego)",tipo:"bueno",
        d:"Pasaste la primera fase. El grupo 2026 real de este lado ya estaba tomado; el juego arma uno etiquetado como sorteo, no como fixture CONMEBOL."});
      return;
    }
    if(pasa && ronda.indexOf("Grupo ")===0){
      var key=club+"|"+torneo;
      if(COPA_2026_KO[key]){ insertarCopaYOrdenar(partidosLista(club, COPA_2026_KO[key])); return; }
      var pool=POOL_CONMEBOL[Math.abs(((typeof semilla==="function")?semilla(key+ronda):club.charCodeAt(0)))%POOL_CONMEBOL.length];
      insertarCopaYOrdenar(sembrarKOSimulado(torneo,"Octavos",pool.n,pool.f,pool.est,[{m:8,d:12},{m:8,d:19}],1));
      return;
    }
  }
  if(pasa && ronda.indexOf("Grupo ")===0){
    var riv=POOL_CONMEBOL[Math.abs(((typeof semilla==="function")?semilla(club+anio+"ko"):7))%POOL_CONMEBOL.length];
    insertarCopaYOrdenar(sembrarKOSimulado(torneo,"Octavos",riv.n,riv.f,riv.est,[{m:8,d:12},{m:8,d:19}],1));
    return;
  }
  if(pasa && (ronda==="Octavos"||ronda==="Playoff")){
    var riv2=POOL_CONMEBOL[(Math.abs(((typeof semilla==="function")?semilla(club+anio+"c"):3))+3)%POOL_CONMEBOL.length];
    insertarCopaYOrdenar(sembrarKOSimulado(torneo,"Cuartos",riv2.n,riv2.f,riv2.est,[{m:9,d:16},{m:9,d:23}],1));
    return;
  }
  if(pasa && ronda==="Cuartos"){
    var riv3=POOL_CONMEBOL[(Math.abs(((typeof semilla==="function")?semilla(club+anio+"s"):5))+5)%POOL_CONMEBOL.length];
    insertarCopaYOrdenar(sembrarKOSimulado(torneo,"Semifinal",riv3.n,riv3.f,riv3.est,[{m:10,d:21},{m:10,d:28}],1));
    return;
  }
  if(pasa && ronda==="Semifinal"){
    var riv4=POOL_CONMEBOL[(Math.abs(((typeof semilla==="function")?semilla(club+anio+"f"):8))+8)%POOL_CONMEBOL.length];
    insertarCopaYOrdenar(sembrarKOSimulado(torneo,"FINAL",riv4.n,riv4.f,riv4.est,[{m:11,d:21}],1));
  }
}

function esCopaContinental(part){
  if(!part||part.tipo!=="copa") return false;
  var t=part.torneo||"";
  return t==="Copa Libertadores"||t==="Copa Sudamericana"||t==="Copa Intercontinental";
}

function resolverCopaContinental33(part, yo, otro){
  var torneo=part.torneo, ronda=part.ronda||"";
  if(ronda.indexOf("Grupo ")===0){
    var idx=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo===torneo&&p.ronda===ronda; });
    if(idx.filter(function(p){ return p.jugado; }).length<idx.length) return;
    var tab=tablaGrupoContinental(torneo, ronda, E.club);
    var pos=-1, i;
    for(i=0;i<tab.length;i++) if(tab[i].id===E.club) pos=i+1;
    var etq=tab.map(function(x,n){ return (n+1)+". "+x.n+" "+x.pts+" pts"; }).join(" · ");
    if(pos>2||pos<1){
      sacarCopaPendienteTorneo(torneo);
      notificar({t:"Eliminado de "+torneo,tipo:"malo",
        d:"El "+ronda+" quedó así (tus partidos reales de fecha; el resto del grupo se simula por fuerza, no se copia el fixture ajeno): "+etq+". Quedaste "+pos+"° y no clasificas."});
      aplicarEfectos({moral:-4,prestigio:-2});
    } else {
      notificar({t:"Clasificado a eliminatorias de "+torneo,tipo:"bueno",
        d:"Saliste "+pos+"° de "+ronda+". "+etq+"."});
      aplicarEfectos({moral:5,prestigio:3,plata:80});
      sembrarSiguienteContinental(part, true);
    }
    return;
  }
  if(ronda==="Primera fase"){
    var pasa=yo>otro||(yo===otro&&Math.random()<0.5);
    var pens=yo===otro;
    var penalTxt=pens?" Se definió en penales (el juego no inventa el 3-2: solo quién pasa).":"";
    if(!pasa){
      sacarCopaPendienteTorneo(torneo);
      notificar({t:"Eliminado de "+torneo,tipo:"malo",
        d:"Fuera en primera fase "+yo+"-"+otro+" ante "+part.rivalNombre+"."+penalTxt});
      aplicarEfectos({moral:-4,prestigio:-2});
    } else {
      notificar({t:"A la fase de grupos de "+torneo,tipo:"bueno",
        d:"Pasaste la primera fase ante "+part.rivalNombre+"."+penalTxt});
      aplicarEfectos({moral:4,prestigio:2,plata:50});
      sembrarSiguienteContinental(part, true);
    }
    return;
  }
  E.flags.copaAcum=E.flags.copaAcum||{};
  var k=torneo+"-"+ronda+"-"+(part.rivalId||part.rivalNombre||"");
  var acc=E.flags.copaAcum[k]||{gf:0,gc:0,j:0};
  acc.gf+=yo; acc.gc+=otro; acc.j++;
  E.flags.copaAcum[k]=acc;
  var idxRonda=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo===torneo&&p.ronda===ronda; });
  if(idxRonda.filter(function(p){ return p.jugado; }).length<idxRonda.length) return;
  var pasa2, pens2=false;
  if(ronda==="FINAL"){
    if(yo>otro) pasa2=true;
    else if(yo<otro) pasa2=false;
    else { pasa2=Math.random()<0.5; pens2=true; }
  } else {
    pasa2=acc.gf>acc.gc||(acc.gf===acc.gc&&Math.random()<0.5);
    if(acc.gf===acc.gc) pens2=true;
  }
  var penal=pens2?" Se definió en penales (el juego no inventa el 4-3: solo quién pasa).":"";
  if(!pasa2){
    sacarCopaPendienteTorneo(torneo);
    notificar({t:"Eliminado de "+torneo,tipo:"malo",
      d:"Fuera en "+ronda+" ("+acc.gf+"-"+acc.gc+" en la llave)."+penal});
    aplicarEfectos({moral:-5,prestigio:-2});
    sembrarSiguienteContinental(part, false);
  } else if(ronda==="FINAL"){
    if(torneo==="Copa Libertadores") E.flags.copaCampeon=true;
    else E.flags.copaSudCampeon=true;
    notificar({t:torneo==="Copa Libertadores"?"CAMPEÓN DE AMÉRICA":"Campeón de Sudamericana",tipo:"bueno",
      d:"El club gana la "+torneo+" "+E.anio+"."+penal});
    aplicarEfectos({moral:8,prestigio:torneo==="Copa Libertadores"?14:8,plata:torneo==="Copa Libertadores"?600:280,hinchada:10});
  } else {
    aplicarEfectos({plata:130,moral:5,prestigio:3});
    notificar({t:"Avanza en "+torneo,tipo:"bueno",
      d:"Supera "+ronda+" ("+acc.gf+"-"+acc.gc+")."+penal});
    sembrarSiguienteContinental(part, true);
  }
}

function cuposDesdeTemporada(pos, copaChile, b){
  if(b) return {lib:false,sud:false};
  var lib=pos<=4||!!copaChile;
  var sud=!lib&&pos<=8;
  return {lib:lib,sud:sud};
}

function ajustarObjetivos33(objs){
  objs=objs||[];
  var p=(E&&E.ind&&E.ind.prestigio)||50;
  var anio=E&&E.anio;
  var b=E&&E.eraBase==="2026b";
  var dep=null, i;
  for(i=0;i<objs.length;i++) if(objs[i].id==="dep") dep=objs[i];
  var enLibG=anio===2026&&(!!LIB_GRUPOS_2026_CHILE[E.club]||!!(typeof conmebolGrupoDe==="function"&&conmebolGrupoDe(E.club,"lib")));
  var enLibF=anio===2026&&!!LIB_FASE2_2026[E.club];
  var enSud=anio===2026&&(!!SUD_FASE1_2026[E.club]||E.club==="OHI"||!!(typeof conmebolGrupoDe==="function"&&conmebolGrupoDe(E.club,"sud")));
  if(b && dep){
    if(p>=60){ dep.t="Pelear el ascenso"; dep.meta=2; dep.detalle="Terminar entre los primeros 2 de la B.";
      dep.porque="La B no clasifica a Libertadores. El premio es subir a Primera."; }
    else { dep.t="No eternizarse en la B"; dep.meta=10; dep.detalle="Terminar en la mitad de arriba de la Liga de Ascenso.";
      dep.porque="Abajo se pudre el proyecto. Libertadores no es el tema acá."; }
  } else if(anio===2026 && dep && /Libertadores/.test(dep.t) && !enLibG){
    dep.t="Clasificar a Libertadores 2027";
    dep.meta=4;
    dep.detalle="Terminar entre los primeros 4 de Primera, o ganar Copa Chile. El cupo 2026 ya lo definieron Coquimbo (CH1) y Católica (CH2) en 2025; O'Higgins y Huachipato jugaron la fase previa.";
    dep.porque="No todos clasifican a la Libertadores de este año. El 2026 continental ya está escrito.";
  } else if(anio>=2027 && dep && /Libertadores/.test(dep.t) && !(E.flags&&E.flags.cupoLib)){
    dep.t="Clasificar a Libertadores "+(anio+1);
    dep.detalle="Terminar entre los primeros 4. El grupo continental de este año se sortea solo si ya tienes el cupo.";
  }
  if(enLibG && dep && /Libertadores/.test(dep.t)){
    dep.t="Pelear el campeonato nacional"; dep.meta=2;
    dep.detalle="La Libertadores 2026 ya la tienes por el 2025. En liga, pelear arriba.";
    dep.porque="El cupo continental de este año está; el mandato local no se regala.";
  }
  function hay(id){ return objs.some(function(o){ return o.id===id; }); }
  if(enLibG && !hay("lib")){
    objs.unshift({id:"lib",cat:"deportivo",tipo:"copaAvance",torneo:"Copa Libertadores",meta:"octavos",
      t:"Avanzar de grupo en Libertadores",
      detalle:"Salir 1° o 2° del Grupo "+LIB_GRUPOS_2026_CHILE[E.club]+" (rivales reales 2026).",
      porque:"Este cupo se ganó en 2025. No es un sorteo inventado."});
  }
  if(enLibF && !hay("libf")){
    objs.unshift({id:"libf",cat:"deportivo",tipo:"copaAvance",torneo:"Copa Libertadores",meta:"grupos",
      t:"Pasar de fase en Libertadores",
      detalle:"Ganar la llave de Fase 2"+(E.club==="OHI"?" y la de Fase 3":"")+". Fechas reales 2026.",
      porque:"Chile 4 y Chile 3 entran en fase previa, no en grupos."});
  }
  if(enSud && !hay("sud")){
    objs.unshift({id:"sud",cat:"deportivo",tipo:"copaAvance",torneo:"Copa Sudamericana",meta:"grupos",
      t:"Avanzar en Sudamericana",
      detalle:"Pasar la primera fase (partido único, rival chileno real) y pelear el grupo si clasificas.",
      porque:"El 2026 de Sudamericana también ya se jugó: no es un cupo genérico de Libertadores."});
  }
  if(!enLibG && !enLibF && !enSud && !b && anio===2026 && !hay("sud27") && dep){
    objs.push({id:"sud27",cat:"deportivo",tipo:"posicion",meta:6,
      t:"Clasificar a Sudamericana 2027",
      detalle:"4° a 6° de Liga (o el que pierde el repechaje Chile 4) entra a Sudamericana. Un club no va a las dos copas CONMEBOL.",
      porque:"No todos van a Libertadores. Sudamericana se ofrece por la tabla, no se inventa un cupo."});
  }
  if(anio>=2027 && E.flags && E.flags.cupoLib && !hay("lib")){
    objs.unshift({id:"lib",cat:"deportivo",tipo:"copaAvance",torneo:"Copa Libertadores",meta:"octavos",
      t:"Avanzar de grupo en Libertadores",
      detalle:"El grupo de "+anio+" lo sortea el juego. No es el sorteo CONMEBOL.",
      porque:"El cupo lo ganaste el año pasado. Ahora hay que no hacer el ridículo."});
  } else if(anio>=2027 && E.flags && E.flags.cupoSud && !hay("sud")){
    objs.unshift({id:"sud",cat:"deportivo",tipo:"copaAvance",torneo:"Copa Sudamericana",meta:"octavos",
      t:"Avanzar en Sudamericana",
      detalle:"Grupo sorteado por el juego para "+anio+".",
      porque:"Entraste por la liga del año pasado."});
  }
  return objs;
}

(function wrapCalendarioCopas33(){
  if(typeof construirCalendario!=="function"||construirCalendario._copas33) return;
  var orig=construirCalendario;
  construirCalendario=function(clubId, anio, conCopa){
    var cal=orig(clubId, anio, conCopa)||[];
    if(anio===2026){
      partidosCopa2026De(clubId).forEach(function(p){ cal.push(p); });
      cal.sort(function(a,b){
        var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
        var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
        return oa-ob;
      });
    } else if(anio>=2027 && typeof E!=="undefined" && E && E.flags){
      var extra=null;
      if(E.flags.cupoLib) extra=sembrarGrupoSimulado(clubId, anio, "Copa Libertadores");
      else if(E.flags.cupoSud) extra=sembrarGrupoSimulado(clubId, anio, "Copa Sudamericana");
      if(extra){
        extra.forEach(function(p){ cal.push(p); });
        cal.sort(function(a,b){
          var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
          var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
          return oa-ob;
        });
      }
    }
    return cal;
  };
  construirCalendario._copas33=true;
})();

(function wrapResolverCopa33(){
  if(typeof resolverCopa!=="function"||resolverCopa._33) return;
  var orig=resolverCopa;
  resolverCopa=function(part, yo, otro){
    if(part && (E&&E.anio||0)>=2026 && esCopaContinental(part) && part.torneo!=="Copa Intercontinental"){
      var keepChile=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo==="Copa Chile"&&!p.jugado; });
      var keepOtra=(E.calendario||[]).filter(function(p){
        return p.tipo==="copa"&&p.torneo!==part.torneo&&p.torneo!=="Copa Chile"&&!p.jugado;
      });
      resolverCopaContinental33(part, yo, otro);
      keepChile.concat(keepOtra).forEach(function(p){ if(E.calendario.indexOf(p)<0) E.calendario.push(p); });
      return;
    }
    orig(part, yo, otro);
  };
  resolverCopa._33=true;
})();

(function wrapObjetivos33(){
  if(typeof generarObjetivos!=="function"||generarObjetivos._33) return;
  var orig=generarObjetivos;
  generarObjetivos=function(){ return ajustarObjetivos33(orig()||[]); };
  generarObjetivos._33=true;
  if(typeof progresoObjetivo==="function" && !progresoObjetivo._33){
    var origP=progresoObjetivo;
    progresoObjetivo=function(o){
      if(o&&o.tipo==="copaAvance"){
        var copas=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo===o.torneo; });
        var ko=copas.some(function(p){ return /Octavos|Cuartos|Semifinal|Playoff|FINAL/.test(p.ronda||""); });
        var champ=(o.torneo==="Copa Libertadores"&&E.flags&&E.flags.copaCampeon)||(o.torneo==="Copa Sudamericana"&&E.flags&&E.flags.copaSudCampeon);
        if(champ) return {pct:100,txt:"Campeón",cumplido:true,estado:"cumplido"};
        if(ko) return {pct:75,txt:"Clasificado a eliminatorias",cumplido:true,estado:"cumplido"};
        if(copas.some(function(p){ return !p.jugado; })) return {pct:45,txt:"En carrera",cumplido:false,estado:"encamino"};
        if(copas.length) return {pct:15,txt:"Fuera",cumplido:false,estado:"riesgo"};
        return {pct:20,txt:"Todavía no arranca",cumplido:false,estado:"encamino"};
      }
      return origP(o);
    };
    progresoObjetivo._33=true;
  }
  if(typeof expectativa==="function" && !expectativa._33){
    var origE=expectativa;
    expectativa=function(){
      var b=E&&E.eraBase==="2026b";
      var p=(E&&E.ind&&E.ind.prestigio)||50;
      if(b) return p>=60?{pos:2,txt:"pelear el ascenso"}:{pos:10,txt:"no eternizarse en la B"};
      if(E&&E.anio===2026 && p>=60 && !LIB_GRUPOS_2026_CHILE[E.club] && !LIB_FASE2_2026[E.club])
        return {pos:4,txt:"clasificar a Libertadores 2027"};
      return origE();
    };
    expectativa._33=true;
  }
})();

(function wrapFinAnio33(){
  if(typeof finDeTemporada!=="function"||finDeTemporada._33) return;
  var origF=finDeTemporada;
  finDeTemporada=function(){
    var pos=(typeof posicionEnTabla==="function")?posicionEnTabla():16;
    var b=E&&E.eraBase==="2026b";
    var cup=cuposDesdeTemporada(pos, !!(E.flags&&E.flags.copaChileCampeon), b);
    if(E.flags){ E.flags.cupoLib=cup.lib; E.flags.cupoSud=cup.sud; }
    var r=origF();
    if(E.flags&&E.flags.copaChileCampeon){
      E.titulos=E.titulos||[];
      if(E.titulos.indexOf(E.anio+" · Copa Chile")<0) E.titulos.push(E.anio+" · Copa Chile");
    }
    if(E.flags&&E.flags.copaSudCampeon){
      E.titulos=E.titulos||[];
      if(E.titulos.indexOf(E.anio+" · Copa Sudamericana")<0) E.titulos.push(E.anio+" · Copa Sudamericana");
    }
    if(cup.lib) notificar({t:"Cupo a Libertadores "+(E.anio+1),tipo:"bueno",
      d:"Por la temporada "+E.anio+" el club entra a Libertadores "+(E.anio+1)+". El grupo lo sortea el juego (no es el sorteo CONMEBOL)."});
    else if(cup.sud) notificar({t:"Cupo a Sudamericana "+(E.anio+1),tipo:"bueno",
      d:"Clasificaste a Sudamericana "+(E.anio+1)+". El grupo se arma en el juego."});
    else if(!b && (E.anio||0)>=2026) notificar({t:"Sin copa continental "+(E.anio+1),tipo:"neutro",
      d:"No hay cupo CONMEBOL el año que viene. Hay que pelearlo de nuevo en la liga o en Copa Chile."});
    return r;
  };
  finDeTemporada._33=true;
  if(typeof nuevoAnio==="function" && !nuevoAnio._33){
    var origN=nuevoAnio;
    nuevoAnio=function(){
      origN();
      if(E&&E.flags){
        E.flags.copaChileCampeon=false;
        E.flags.copaSudCampeon=false;
        E.flags.copaChileGrupo=null;
        E.flags.copaChilePos=null;
        E.flags.copaChileRivales=[];
      }
    };
    nuevoAnio._33=true;
  }
})();

if(typeof FORMAT_COPAS==="object"){
  FORMAT_COPAS.libertadores2026="Chile 2026 entra por 2025: CH1 Coquimbo (campeón), CH2 Católica, CH3 O'Higgins, CH4 Huachipato. A grupos SOLO Coquimbo (B: Nacional, Universitario, Tolima) y Católica (D: Boca, Cruzeiro, Barcelona SC). Huachipato quedó en Fase 2 vs Carabobo; O'Higgins en Fase 3 vs Tolima y cayó a Sudamericana. Colo-Colo, la U y el resto NO clasificaron. 2027+ el grupo lo sortea el juego.";
  FORMAT_COPAS.sudamericana2026="Primera fase 2026 (partido único): U. de Chile 1-2 Palestino (5 mar, Nacional); Cobresal 1-1 Audax (3 mar, Calama, Audax 3-2 penales). Grupos: PAL F (Gremio, Torque, Riestra), AUD G (Olimpia, Vasco, Barracas), OHI C (São Paulo, Millonarios, Boston River) tras caer en Libertadores.";
}

/* ---------- IA de pago, gratis: compositor local (tú chileno, 2–4 frases) ---------- */
function hechosAyudante(){
  var part=(typeof proximoPartido==="function")?proximoPartido():null;
  var yo=E.tabla&&E.tabla[E.club];
  var arr=(typeof tablaOrdenada==="function")?tablaOrdenada():[];
  var pos=arr.findIndex(function(c){ return c.id===E.club; })+1;
  var copas=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&!p.jugado; });
  return {
    club:E.clubNombre||E.club, anio:E.anio, b:E.eraBase==="2026b",
    p:Math.round((E.ind&&E.ind.prestigio)||50),
    moral:Math.round((E.ind&&E.ind.moral)||50),
    hin:Math.round((E.ind&&E.ind.hinchada)||50),
    caja:E.plata||0, deuda:E.deuda||0,
    pos:pos||null, pts:yo?yo.pts:null, pg:(E.temporada&&E.temporada.pg)||0,
    part:part,
    lib:copas.filter(function(p){ return /Libertadores/i.test(p.torneo||""); }),
    sud:copas.filter(function(p){ return /Sudamericana/i.test(p.torneo||""); }),
    cupoLib:!!(E.flags&&E.flags.cupoLib), cupoSud:!!(E.flags&&E.flags.cupoSud),
    enLib26:typeof clubEnLibertadores2026==="function"&&clubEnLibertadores2026(E.club),
    enSud26:typeof clubEnSudamericana2026==="function"&&clubEnSudamericana2026(E.club)
  };
}
function detectarTemasAyudante(norm){
  function t(){ var i; for(i=0;i<arguments.length;i++) if(norm.indexOf(arguments[i])>=0) return true; return false; }
  var temas=[];
  if(t("informe","resumen","semana","que hago","consejo","ahora","prioridad")) temas.push("informe");
  if(t("rival","proximo","partido","gano","ganar","ganamos","enfrent","clasico")) temas.push("partido");
  if(t("libertadores","sudamericana","conmebol","cupo","copa continental")) temas.push("copa");
  if(t("quimic","congenia","dupla","llevan bien")) temas.push("quimica");
  if(t("plata","caja","deuda","dinero","economi","finanz","presupuesto")) temas.push("plata");
  if(t("moral","camarin","animo","vestuario","descontent")) temas.push("camarin");
  if(t("hinchada","barra","gente","socios","publico")) temas.push("hinchada");
  if(t("objetivo","meta","directorio","piden","espera","exig","clasific")) temas.push("objetivo");
  if(t("fich","compr","refuerzo","mercado","vend","transferi")) temas.push("mercado");
  if(t("cansad","fisic","lesion","piernas","rotar","descans")) temas.push("fisico");
  if(t("tactic","formacion","mentalidad","presion","plan","estilo","alinea")) temas.push("tactica");
  if(t("ascenso","primera b","la be","categoria")) temas.push("b");
  if(!temas.length) temas.push("informe");
  return temas;
}
function fraseTemaAyudante(tema, h){
  var part=h.part;
  if(tema==="partido"){
    if(!part) return "No tienes un partido a la vista ahora mismo.";
    var cab=(part.tipo==="copa"?((part.torneo||"Copa")+" · "+(part.ronda||"Copa")):"Fecha "+(part.fecha||""));
    cab+=": "+(part.local?"de local":"de visita")+" vs "+part.rivalNombre+".";
    if(part.real) cab+=" El marcador histórico de referencia es "+part.real+"; tú lo juegas.";
    if(typeof fuerzaEquipo==="function" && typeof onceIdeal==="function"){
      var dif=fuerzaEquipo(onceIdeal()).base-part.fuerzaRival;
      if(dif>6) cab+=" Sales favorito: presiona arriba y busca el arco temprano.";
      else if(dif<-6) cab+=" Llegan más fuertes: ordena atrás y sal de contra.";
      else cab+=" Está parejo. Lo define un detalle: pelota parada y no regalar el mediocampo.";
    }
    return cab;
  }
  if(tema==="quimica" && typeof quimicaEquipo==="function" && typeof onceIdeal==="function"){
    var x=quimicaEquipo(onceIdeal());
    return "La química del once está en "+x.prom+"/100 ("+(x.buenos||0)+" duplas que se llevan, "+(x.malos||0)+" con roce). Juntar edad parecida o ídolos de la casa la sube.";
  }
  if(tema==="plata"){
    var r="Caja "+plata(h.caja)+" · deuda "+plata(h.deuda)+". ";
    if(h.caja<80) r+="Está flaca: no firmes renovaciones caras esta semana.";
    else if(h.deuda>h.caja*3) r+="La deuda te come. Un prescindible vendido ordena más que un préstamo más.";
    else r+="Relativamente sano; con cabeza se puede mirar el mercado.";
    return r;
  }
  if(tema==="camarin"){
    if(h.moral<45) return "El camarín está cortado (moral "+h.moral+"). Una charla con el capitán o un once que no sea de castigo. Ganar cura casi todo.";
    return "El camarín está bien (moral "+h.moral+"). No rompas lo que funciona.";
  }
  if(tema==="hinchada"){
    if(h.hin<45) return "La hinchada se enfría ("+h.hin+"). Un resultado, bajar la entrada o un gesto con la barra.";
    return "La gente te banca (hinchada "+h.hin+"). Aprovecha el envión de local.";
  }
  if(tema==="objetivo" && Array.isArray(E.objetivos) && typeof progresoObjetivo==="function"){
    var en=E.objetivos.map(function(o){ return {o:o,pr:progresoObjetivo(o)}; });
    var risk=en.filter(function(x){ return x.pr.estado==="riesgo"; });
    if(risk.length) return "Cuidado: «"+risk[0].o.t+"» está en riesgo — "+risk[0].pr.txt+". El directorio evalúa esto al cierre.";
    return "Vas en línea con «"+(en[0]&&en[0].o.t||"el mandato")+"». Sigue sumando.";
  }
  if(tema==="mercado"){
    if(h.caja>250) return "Hay caja para moverse ("+plata(h.caja)+"). Un refuerzo en la posición más floja cambia una temporada.";
    return "La caja no da para lujos ("+plata(h.caja)+"). Si quieres reforzar, primero vende un prescindible.";
  }
  if(tema==="fisico" && typeof onceIdeal==="function"){
    var cans=onceIdeal().filter(function(j){ return (j.cansancio||0)>=18; });
    var les=(E.plantel||[]).filter(function(j){ return j.lesion>0&&!j.vendido; });
    var f="";
    if(cans.length>=2) f+=cans.length+" titulares con las piernas pesadas: rota o entrena suave. ";
    if(les.length) f+=les.length+" lesionado"+(les.length>1?"s":"")+" fuera.";
    return (f||"El plantel llega entero, sin cansancio preocupante.").trim();
  }
  if(tema==="tactica"){
    return (typeof lecturaPlan==="function")?("Tu plan actual: "+lecturaPlan()):"Revisa formación, mentalidad, estilo y presión en la previa.";
  }
  if(tema==="copa"){
    if(h.b) return "La B no clasifica a Libertadores por la liga. El premio es subir.";
    if(h.anio===2026 && h.enLib26) return "Sí: estás en Libertadores 2026 con fechas y rivales reales (cupo de 2025).";
    if(h.anio===2026 && h.enSud26) return "A Libertadores 2026 no. Sí a Sudamericana: primera fase real, y el grupo si pasas también es el de verdad.";
    if(h.anio===2026) return "No. Libertadores 2026 ya está escrita: a grupos solo Coquimbo y Católica. Tú peleas el cupo 2027 en la liga o en Copa Chile.";
    if(h.cupoLib) return "Tienes cupo a Libertadores "+h.anio+". El grupo lo sorteó el juego, no CONMEBOL.";
    if(h.cupoSud) return "Tienes cupo a Sudamericana "+h.anio+" (sorteo del juego).";
    return "Este año no hay copa continental, a menos que hayas clasificado el año pasado.";
  }
  if(tema==="b"){
    return "Esto es Primera B. Nadie de acá clasifica a Libertadores por la liga: el premio es subir, no soñar con grupos CONMEBOL.";
  }
  if(tema==="informe"){
    var bits=[];
    bits.push("Informe de la semana en "+h.club+" ("+h.anio+").");
    if(h.pos) bits.push("Vas "+h.pos+"° con "+h.pts+" pts ("+h.pg+" ganados).");
    if(h.part) bits.push("Siguiente: "+(h.part.local?"vs ":"en ")+h.part.rivalNombre+(h.part.tipo==="copa"?" ("+(h.part.torneo||"Copa")+" · "+(h.part.ronda||"")+")":"")+".");
    if(h.b) bits.push("Esto es Primera B: el premio es subir, no la Libertadores.");
    if(h.anio===2026 && !h.enLib26 && !h.b) bits.push("Libertadores 2026 ya está escrita: a grupos solo Coquimbo y Católica. El resto pelea el cupo 2027.");
    if(h.anio===2026 && h.enLib26) bits.push("Tú sí estás en Libertadores 2026 (cupo de 2025). Fechas y rivales reales, no un sorteo.");
    if(h.anio===2026 && h.enSud26) bits.push("Sudamericana 2026: primera fase real. Si pasas, el grupo también es el de verdad.");
    if(h.anio>=2027 && h.cupoLib) bits.push("Tienes cupo a Libertadores "+h.anio+": el grupo lo sorteó el juego, no CONMEBOL.");
    if(h.caja<80) bits.push("La caja está justa.");
    if(h.moral<45) bits.push("El camarín está cortado.");
    var ins=(typeof cerebroLocal==="function")?cerebroLocal():[];
    if(ins[0]) bits.push("Prioridad: "+ins[0].t+" — "+ins[0].d);
    else bits.push("No hay incendio. Puedes mover un estatuto o mirar el mercado.");
    return bits.join(" ");
  }
  return "";
}
function informeSemanal(){
  if(!E) return "Todavía no arrancaste una partida.";
  return fraseTemaAyudante("informe", hechosAyudante());
}
(function wrapAyudante33(){
  if(typeof preguntarAyudante!=="function"||preguntarAyudante._33) return;
  var orig=preguntarAyudante;
  preguntarAyudante=function(q){
    if(!E) return "Todavía no arrancaste una partida.";
    var baja=(q||"").toLowerCase();
    var norm=baja.normalize?baja.normalize("NFD").replace(/[\u0300-\u036f]/g,""):baja;
    if(!norm.trim()) return informeSemanal()+" Pregúntame del rival, la plata, el camarín, la hinchada, el objetivo, el mercado o la táctica.";
    var h=hechosAyudante();
    var temas=detectarTemasAyudante(norm);
    var frases=[], seen={}, i, f;
    for(i=0;i<temas.length;i++){
      if(seen[temas[i]]) continue; seen[temas[i]]=1;
      f=fraseTemaAyudante(temas[i], h);
      if(f) frases.push(f);
    }
    if(!frases.length) return orig(q);
    return frases.slice(0,4).join(" ");
  };
  preguntarAyudante._33=true;
})();

