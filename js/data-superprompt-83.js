"use strict";
/* ============================================================
   FUTBOLINI 7.83 · data-superprompt-83.js
   Huecos abiertos del GROK_SUPERPROMPT (A/B) + GROK_TAREAS 2/3:
   · caza de hechos (CC 1925, Monumental, San Carlos)
   · DTs de Primera vigentes (sep 2026)
   · formato real Segunda 2026 (3+3+4°s → liguillas de 7)
   · Supercopa 2026 (Final Four, ya jugada) — NO es «Copa de la Liga»
   La Copa de la Liga 2026 SÍ existe (1ª edición, ANFP). Ya está en
   data-formato2026.js (grupos A–D cruzados con Wikipedia).
   Planteles de Segunda: NO se inventan.
   Cargar DESPUÉS de data-historico.js.
   ============================================================ */

/* TAREA 2 · Segunda 2026 (Wikipedia «Liga de Segunda 2026» / Pauta 23 ene 2026).
   El motor YA juega la fase zonal (12 fechas, 7.65). Acá queda el formato
   completo: liguilla de 7, playoff de 4°s, descenso a Tercera A. */
const FORMAT_SEGUNDA_2026={
  n:14, pts:3, zonas:2, porZona:7,
  faseZonal:"Todos contra todos ida y vuelta DENTRO de la zona. 7 clubes (impar) → 14 fechas de calendario, 12 partidos por club, 2 byes.",
  clasifican:"3 primeros de cada zona → liguilla de ascenso. 3 últimos de cada zona → liguilla de permanencia.",
  cuartos:"Los 4° de Norte y Sur se cruzan. Bases: un partido en cancha neutral. En 2026 se jugó ida y vuelta: Trasandino 1-0 General Velásquez (0-0 / 0-1) y Trasandino entró a la liguilla de ascenso.",
  liguillaAscenso:"Liguilla de ascenso: 7 clubes, todos contra todos ida y vuelta (14 fechas de calendario, 12 PJ, puntaje desde 0). El 1° es campeón y sube a Primera B 2027.",
  liguillaPermanencia:"Liguilla de permanencia: 7 clubes, ida y vuelta, puntaje desde 0. Los 2 últimos descienden a Tercera A.",
  inicio:"21–22 de marzo 2026. Termina fin de noviembre.",
  juego:"Fase zonal (12 PJ + 2 byes, fixture round-robin). Top 3 de cada zona → liguilla de ascenso de 7, ida y vuelta, puntaje desde 0 (volver a cruzar rivales de tu zona es el formato real). 4°s se cruzan a partido. Bottom 3 → liguilla de permanencia. El 1° de la liguilla de 7 sube a la B. No hay final de 3 botones. Tablas vivas: nadie aparece con 12 PJ cuando vos tenés 1.",
  fuente:"Wikipedia «Liga de Segunda 2026» / Anexo Fase 1 / Pauta 23 ene 2026 / bases ANFP art. 78"
};

/* TAREA 3 · Chile 2026 tiene DOS copas cortas, no una.
   · Copa de la Liga: 1ª edición, solo Primera, 4 grupos. YA en data-formato2026.js.
   · Supercopa: Final Four (ya no es partido único). Edición 2026 YA se jugó en enero. */
const FORMAT_SUPERCOPA_2026={
  n:4, pts:null,
  nombre:"Supercopa Lanco 2026",
  sede:"Estadio Sausalito, Viña del Mar",
  fechas:"20–25 enero 2026",
  formato:"Final four. Campeón y subcampeón de Liga de Primera 2025 + finalistas de Copa Chile 2025.",
  equipos:[
    {id:"COQ", cupo:"Campeón Liga de Primera 2025"},
    {id:"UC",  cupo:"Subcampeón Liga de Primera 2025"},
    {id:"HUA", cupo:"Campeón Copa Chile 2025"},
    {id:"LIM", cupo:"Subcampeón Copa Chile 2025"}
  ],
  semis:["HUA 2-4 UC (20 ene)","COQ 3-2 LIM (21 ene)"],
  final:"25 ene, Sausalito: Universidad Católica 0-0 Coquimbo Unido (7-8 penales).",
  campeon:"Coquimbo Unido",
  subcampeon:"Universidad Católica",
  semisOut:["Huachipato","Deportes Limache"],
  juego:"La edición 2026 YA se jugó (enero). En una partida 2026 es HECHO, no fixture a simular. El formato de 4 equipos vale para 2027. data-formato2026.js ya arma la Final Four.",
  fuente:"Wikipedia Supercopa de Chile 2026 / La Tercera 25 ene 2026"
};

const FORMAT_COPA_LIGA_2026={
  n:16, grupos:4, porGrupo:4,
  nombre:"Copa de la Liga de Chile 2026",
  edicion:1,
  formato:"Solo los 16 de Primera. 4 grupos de 4, ida y vuelta. Clasifica ÚNICAMENTE el 1° a semis (ida/vuelta). Final a partido único en el Elías Figueroa (Valparaíso). El campeón es Chile 3 a Libertadores 2027.",
  grupos:{A:["COQ","CC","HUA","DCO"], B:["UC","NUB","UDC","COB"], C:["OHI","EVE","LIM","PAL"], D:["CAL","AUD","UCH","LSE"]},
  noEs:"No es Copa Chile. No la juegan B ni Segunda.",
  juego:"Ya implementada en data-formato2026.js (COPA_LIGA_GRUPOS_2026). Grupos cruzados con Wikipedia, 8 ene 2026.",
  fuente:"Wikipedia Copa de la Liga de Chile 2026 / Consejo de Presidentes 13 oct 2025 y 8 ene 2026"
};

/* DTs de Primera vigentes a sep 2026 (Wikipedia Liga de Primera 2026 · Entrenadores / Transfermarkt).
   Stats no. Solo el nombre. */
const DT_PRIMERA_2026={
  CC:"Fernando Ortiz",     /* inicio 2026 (RedGol / La Tercera). Sigue. */
  UCH:"Fernando Gago",     /* desde fecha 8. Meneghini 1–6. */
  UC:"Daniel Garnero",
  PAL:"Guillermo Farré",   /* desde fecha 12. Cristián Muñoz 1–11. */
  LIM:"Víctor Rivero",
  EVE:"Walter Ribonetto",  /* desde fecha 7. Torrente 1–4. */
  COQ:"Hernán Caputto",
  AUD:"Patricio Graff",    /* desde fecha 15. Gustavo Lema 1–14. */
  HUA:"Jaime García",
  OHI:"Lucas Bovaglio",
  NUB:"Juan José Ribera",
  COB:"Gustavo Huerta",
  CAL:"Martín Cicotello",  /* Transfermarkt sep 2026: sigue. */
  LSE:"Felipe Gutiérrez",
  DCO:"Fernando Díaz",     /* desde fecha 14. */
  UDC:"Cristián Muñoz"     /* desde fecha 18. */
};

(function aplicarDt83(){
  if(typeof CLUB_INFO_2026!=="object") return;
  Object.keys(DT_PRIMERA_2026).forEach(function(id){
    if(!CLUB_INFO_2026[id]) return;
    CLUB_INFO_2026[id].dt=DT_PRIMERA_2026[id];
  });
})();

/* TAREA A · hechos mal escritos. */
(function cazaHistoria83(){
  if(typeof HISTORIA_LINEA!=="object") return;
  function setH(id, anioOld, item){
    var arr=HISTORIA_LINEA[id]; if(!arr) return;
    for(var i=0;i<arr.length;i++){
      if(arr[i].anio===anioOld){ arr[i]=item; return; }
    }
  }
  function pushH(id, item){
    if(!HISTORIA_LINEA[id]) HISTORIA_LINEA[id]=[];
    if(HISTORIA_LINEA[id].some(function(h){ return h.anio===item.anio && h.hito===item.hito; })) return;
    var i=HISTORIA_LINEA[id].length;
    for(var k=0;k<HISTORIA_LINEA[id].length;k++){ if(HISTORIA_LINEA[id][k].hito==="Hoy"){ i=k; break; } }
    HISTORIA_LINEA[id].splice(i,0,item);
  }
  /* CC 1925 NO fue «fusión de clubes escolares». Fue escisión de Magallanes en El Llano. */
  setH("CC",1925,{anio:1925,hito:"Fundación",txt:"19 de abril de 1925, Estadio El Llano (San Miguel). Escisión de Magallanes: «Ancha es la puerta». David Arellano capitán. Camiseta blanca, pantalón negro."});
  /* Monumental: inauguración 20 abr 1975 (no 1973); reinauguración 30 sep 1989. */
  setH("CC",1973,{anio:1975,hito:"El Monumental",txt:"20 de abril de 1975: se inaugura en Macul (1-0 a Aviación, gol de Juan Carlos Orellana). Solo unos partidos: la cancha no daba y vuelven al Nacional."});
  setH("CC",1989,{anio:1989,hito:"Reinauguración",txt:"30 de septiembre de 1989: se reabre el Monumental (2-1 a Peñarol; Barticciotto y Herrera). Arranca el ciclo que termina en la Libertadores."});
  /* San Carlos se inauguró el 4 sep 1988 (0-1 vs River), no en 1997. */
  setH("UC",1997,{anio:1988,hito:"San Carlos",txt:"4 de septiembre de 1988: se inaugura San Carlos de Apoquindo (0-1 vs River de Menotti). Casa propia, no arriendo eterno."});
  pushH("COQ",{anio:2026,hito:"Supercopa",txt:"Campeón de la Supercopa Lanco 2026 en Sausalito: 0-0 vs Católica, 8-7 en penales. Primer título de Supercopa del puerto."});
  pushH("UC",{anio:2026,hito:"Supercopa",txt:"Finalista de la Supercopa 2026. Pierde con Coquimbo en penales (0-0, 7-8) en el Sausalito, después de ganar 4-2 a Huachipato en semis."});
  pushH("HUA",{anio:2025,hito:"Copa Chile",txt:"Campeón de Copa Chile 2025 (penales vs Limache). Juega la Supercopa 2026; cae 2-4 con Católica en semis."});
  pushH("LIM",{anio:2025,hito:"Copa Chile",txt:"Finalista de Copa Chile 2025. Juega la Supercopa 2026 y cae 2-3 vs Coquimbo en semis."});
})();

/* TAREA D · «Atendé» es voseo argentino. En Chile: Atiende. */
(function cazaVoseo83(){
  if(typeof FRASES!=="object" || !FRASES.cl) return;
  if(/Atendé/.test(FRASES.cl.esc_atiende||"")){
    FRASES.cl.esc_atiende="Atiende esto antes de avanzar, po";
  }
})();

const PRENSA_SUPERCOPA_2026=[
  {ctx:"titular", registro:"neutro", txt:"COQUIMBO ES SUPERCAMPEÓN. 0-0 y 8-7 en penales a Católica, en el Sausalito."},
  {ctx:"titular", registro:"cl", txt:"EL PIRATA SE MANDÓ LA SUPERCOPA. Penales en Viña, po. El norte no perdona."},
  {ctx:"titular", registro:"neutro", txt:"La Supercopa ya no es un partido: son cuatro (campeón, subcampeón, finalistas de Copa)."}
];
(function mixPrensa83(){
  if(typeof TUITS_MOMENTO!=="object") return;
  PRENSA_SUPERCOPA_2026.forEach(function(t){
    var ctx=t.ctx||"titular";
    TUITS_MOMENTO[ctx]=TUITS_MOMENTO[ctx]||[];
    TUITS_MOMENTO[ctx].push(t);
  });
})();
