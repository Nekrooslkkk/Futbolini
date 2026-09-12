"use strict";
/* ============================================================
   FUTBOLINI 7.78 · data-clubes-meta.js
   PROMPT A + F de GROK_EPOCAS.md
   esc / ciudad / colores / fund de cada club chileno (Primera, B, Segunda)
   + FIX de aforos que estaban mal. Solo datos verificados.
   Cargar después de data-segunda2026.js.
   ============================================================ */

const CLUB_META={
  /* Primera 2026 · fuente: Wikipedia / sitios oficiales, fundaciones documentadas */
  CC: {esc:"⚫", ciudad:"Santiago",     colores:["#ffffff","#000000"], fund:1925}, /* 19 abr 1925 */
  UCH:{esc:"🔵", ciudad:"Santiago",     colores:["#003da5","#e31837"], fund:1927}, /* 24 may 1927 */
  UC: {esc:"⚪", ciudad:"Santiago",     colores:["#00205b","#ffffff"], fund:1937}, /* 21 abr 1937 */
  EVE:{esc:"🟡", ciudad:"Viña del Mar", colores:["#ffd100","#0033a0"], fund:1909}, /* 24 jun 1909 */
  PAL:{esc:"🟢", ciudad:"Santiago",     colores:["#007a3d","#cc0000"], fund:1920}, /* 20 ago 1920 */
  COQ:{esc:"🟡", ciudad:"Coquimbo",     colores:["#ffd100","#000000"], fund:1958},
  AUD:{esc:"🟢", ciudad:"Santiago",     colores:["#007a33","#ffffff"], fund:1910}, /* 30 nov 1910 */
  HUA:{esc:"⚫", ciudad:"Talcahuano",   colores:["#000000","#0055a5"], fund:1947},
  OHI:{esc:"🟢", ciudad:"Rancagua",     colores:["#00843d","#ffffff"], fund:1955},
  NUB:{esc:"🔴", ciudad:"Chillán",      colores:["#e30613","#ffffff"], fund:1916},
  COB:{esc:"🟠", ciudad:"El Salvador",  colores:["#f36c21","#000000"], fund:1979}, /* Cobresal 1979 */
  CAL:{esc:"🔴", ciudad:"La Calera",    colores:["#c8102e","#000000"], fund:1954},
  LSE:{esc:"🔴", ciudad:"La Serena",    colores:["#c8102e","#ffffff"], fund:1955},
  DCO:{esc:"🟣", ciudad:"Concepción",   colores:["#4b2e83","#ffffff"], fund:1966},
  UDC:{esc:"🟡", ciudad:"Concepción",   colores:["#ffcc00","#000000"], fund:1994},
  LIM:{esc:"🔵", ciudad:"Limache",      colores:["#0055a4","#ffffff"], fund:2010},
  /* Primera B */
  SW: {esc:"🟢", ciudad:"Valparaíso",   colores:["#007a33","#ffffff"], fund:1892}, /* 15 ago 1892 */
  CBL:{esc:"🟠", ciudad:"Calama",       colores:["#f36c21","#000000"], fund:1977}, /* Cobreloa 7 ene 1977 */
  SLQ:{esc:"🟡", ciudad:"Quillota",     colores:["#ffd100","#000000"], fund:1919},
  ANT:{esc:"🔵", ciudad:"Antofagasta",  colores:["#0055a4","#ffffff"], fund:1966},
  MAG:{esc:"🔵", ciudad:"Santiago",     colores:["#003da5","#ffffff"], fund:1897}, /* 27 oct 1897 */
  UES:{esc:"🔴", ciudad:"Santiago",     colores:["#c8102e","#ffd100"], fund:1897}, /* 18 may 1897 */
  REC:{esc:"🟢", ciudad:"Santiago",     colores:["#007a33","#ffffff"], fund:2014},
  PMO:{esc:"🟢", ciudad:"Puerto Montt", colores:["#007a33","#ffffff"], fund:1983},
  SMA:{esc:"🔵", ciudad:"Arica",        colores:["#0055a4","#ffffff"], fund:1978},
  COP:{esc:"🟡", ciudad:"Copiapó",      colores:["#ffd100","#007a33"], fund:1999},
  TEM:{esc:"🟢", ciudad:"Temuco",       colores:["#007a33","#ffffff"], fund:1965},
  IQQ:{esc:"🔵", ciudad:"Iquique",      colores:["#0055a4","#ffffff"], fund:1978},
  USF:{esc:"🟢", ciudad:"San Felipe",   colores:["#007a33","#ffffff"], fund:1956},
  CUR:{esc:"🔴", ciudad:"Curicó",       colores:["#c8102e","#000000"], fund:1973},
  SCR:{esc:"🟢", ciudad:"Santa Cruz",   colores:["#007a33","#ffffff"], fund:1913},
  RAN:{esc:"🔴", ciudad:"Talca",        colores:["#c8102e","#000000"], fund:1902},
  /* Segunda · fundaciones documentadas (Wikipedia / ANFP / ASIFUCH) */
  SMO:{esc:"⚫", ciudad:"Santiago",     colores:["#ffffff","#007a33"], fund:1909}, /* 16 oct 1909 */
  LSC:{esc:"⚫", ciudad:"Coronel",      colores:["#007a33","#ffffff"], fund:1966},
  OSO:{esc:"🔴", ciudad:"Osorno",       colores:["#c8102e","#000000"], fund:1983}, /* club original 1983; entidad 2012 */
  LIN:{esc:"🔵", ciudad:"Linares",      colores:["#c8102e","#ffffff"], fund:1956},
  CLC:{esc:"🟡", ciudad:"San Fernando", colores:["#ffd100","#007a33"], fund:1957},
  TRA:{esc:"🟢", ciudad:"Los Andes",    colores:["#007a33","#ffffff"], fund:1906},
  COL:{esc:"🔵", ciudad:"Colina",       colores:["#0055a4","#ffffff"], fund:2014}, /* 27 nov 2014 Athletic Club Colina */
  OVA:{esc:"🟠", ciudad:"Ovalle",       colores:["#f36c21","#000000"], fund:1942}, /* 1 jun 1942 como C.D. Socos; Wikipedia / ANFP */
  CNA:{esc:"🔵", ciudad:"Concón",       colores:["#0055a4","#ffffff"], fund:1914}, /* 8 may 1914 · ASIFUCH / AlAireLibre */
  BSA:{esc:"🟣", ciudad:"Salamanca",    colores:["#4b2e83","#ffffff"], fund:2015}, /* 24 ene 2015 */
  RSJ:{esc:"⚪", ciudad:"Santiago",     colores:["#ffffff","#007a33"], fund:1998}, /* 15 dic 1998 escuela Bam Bam Zamorano */
  SCI:{esc:"⚫", ciudad:"Santiago",     colores:["#000000","#e89bb8"]}, /* negro/rosa documentados (EN wiki). Fund 2020 vs 2022: no se pone año */
  GVE:{esc:"🟢", ciudad:"San Vicente",  colores:["#007a33","#ffffff"], fund:1908}, /* 8 ene 1908 · Wikipedia EN/PT «Verdes» */
  REN:{esc:"🟡", ciudad:"Rengo",        colores:["#ffd100","#5eb1e8"], fund:1984}, /* 18 mar 1984; apodo Oro y Cielo */
  /* 1991 extra (Fernández Vial, Cobresal-id CBS) */
  FV: {esc:"🟡", ciudad:"Concepción",   colores:["#ffd100","#000000"], fund:1903},
  CBS:{esc:"🟠", ciudad:"El Salvador",  colores:["#f36c21","#000000"], fund:1979}
};

function metaDeClub(id){ return (CLUB_META && CLUB_META[id]) || null; }
function colorDeClub(id){ const m=metaDeClub(id); return m&&m.colores&&m.colores[0]?m.colores[0]:null; }
function fundDeClub(id){ const m=metaDeClub(id); return m&&m.fund?m.fund:null; }

/* Pinta esc/ciudad/colores/fund sobre los arrays de liga (no pisa est/aforo). */
(function aplicarMeta78(){
  function pinta(L){
    if(!L) return;
    L.forEach(function(c){
      const m=CLUB_META[c.id]; if(!m) return;
      if(m.esc && !c.esc) c.esc=m.esc;
      if(m.ciudad && !c.ciudad) c.ciudad=m.ciudad;
      if(m.colores) c.colores=m.colores;
      if(m.fund) c.fund=m.fund;
    });
  }
  pinta(typeof LIGA_2026!=="undefined"?LIGA_2026:null);
  pinta(typeof LIGA_B_2026!=="undefined"?LIGA_B_2026:null);
  pinta(typeof LIGA_C_2026!=="undefined"?LIGA_C_2026:null);
  pinta(typeof LIGA91!=="undefined"?LIGA91:null);
  /* identidad 2026: esc + ciudad al briefing */
  if(typeof CLUB_INFO_2026==="object"){
    Object.keys(CLUB_META).forEach(function(id){
      const m=CLUB_META[id];
      if(!CLUB_INFO_2026[id]) return;
      if(m.esc) CLUB_INFO_2026[id].esc=m.esc;
      if(m.ciudad) CLUB_INFO_2026[id].ciudad=m.ciudad;
      if(m.colores) CLUB_INFO_2026[id].colores=m.colores;
      if(m.fund) CLUB_INFO_2026[id].fund=m.fund;
    });
  }
  if(typeof CLUB_INFO==="object"){
    Object.keys(CLUB_META).forEach(function(id){
      const m=CLUB_META[id];
      if(!CLUB_INFO[id]) return;
      if(m.esc) CLUB_INFO[id].esc=m.esc;
      if(m.ciudad) CLUB_INFO[id].ciudad=m.ciudad;
      if(m.colores) CLUB_INFO[id].colores=m.colores;
      if(m.fund) CLUB_INFO[id].fund=m.fund;
    });
  }
})();

/* PROMPT F · aforos que estaban mal vs la ficha 2026 (Wikipedia / ANFP).
   1991 se deja (Monumental de entonces no es el de ahora). */
const ESTADIO_FIX_78=[
  {id:"CC", campo:"aforo", de:47000, a:43667, fuente:"Wikipedia Estadio Monumental David Arellano (capacidad post-remodelación)"},
  {id:"UCH",campo:"aforo", de:48000, a:46190, fuente:"Wikipedia Estadio Nacional Julio Martínez Prádanos"},
  {id:"EVE",campo:"aforo", de:23000, a:21754, fuente:"Wikipedia Estadio Sausalito / ficha LIGA_2026"}
];
(function aplicarFixEstadios78(){
  if(typeof ESTADIOS_DATA!=="object") return;
  ESTADIO_FIX_78.forEach(function(f){
    if(ESTADIOS_DATA[f.id] && ESTADIOS_DATA[f.id][f.campo]===f.de)
      ESTADIOS_DATA[f.id][f.campo]=f.a;
  });
})();
