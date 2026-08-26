"use strict";
/* ============================================================
   FUTBOLINI · data-estadios.js  (7.10)
   Estadios reales de cada club con sus SECTORES reales (nombres de la hinchada).
   Datos aproximados (nombres/aforos reales de fuentes públicas; las cuotas y
   precios son estimación del juego). Grok amplía o corrige acá.
   Uso: `sectoresDe(clubId)` devuelve los sectores en el formato del motor
   (mismo shape que SECTORES); si el club no tiene ficha, cae al genérico.
   ============================================================ */

const ESTADIOS_DATA = {
  CC:{ nombre:"Estadio Monumental David Arellano", aforo:47000, sectores:[
    { n:"Galería Norte (Arica / Garra Blanca)", tipo:"popular", cuota:0.28, precio:8000 },
    { n:"Cordillera", tipo:"tribuna", cuota:0.26, precio:16000 },
    { n:"Océano", tipo:"tribuna", cuota:0.24, precio:22000 },
    { n:"Magallanes", tipo:"popular", cuota:0.14, precio:9000 },
    { n:"Rapa Nui", tipo:"premium", cuota:0.08, precio:45000 } ]},
  UCH:{ nombre:"Estadio Nacional Julio Martínez Prádanos", aforo:48000, sectores:[
    { n:"Galería Norte", tipo:"popular", cuota:0.28, precio:8000 },
    { n:"Galería Sur", tipo:"popular", cuota:0.24, precio:8000 },
    { n:"Tribuna Andes", tipo:"tribuna", cuota:0.26, precio:18000 },
    { n:"Tribuna Pacífico", tipo:"tribuna", cuota:0.22, precio:25000 } ]},
  UC:{ nombre:"Claro Arena", aforo:20250, sectores:[
    { n:"Tribuna Mario Lepe", tipo:"popular", cuota:0.28, precio:10000 },
    { n:"Tribuna Ignacio Prieto", tipo:"popular", cuota:0.22, precio:10000 },
    { n:"Tribuna Alberto Fouillioux", tipo:"tribuna", cuota:0.28, precio:18000 },
    { n:"Tribuna Sergio Livingstone", tipo:"premium", cuota:0.22, precio:35000 } ]},
  EVE:{ nombre:"Estadio Sausalito", aforo:23000, sectores:[
    { n:"Galería Cerro", tipo:"popular", cuota:0.30, precio:7000 },
    { n:"Galería Laguna", tipo:"popular", cuota:0.25, precio:7000 },
    { n:"Tribuna Andes", tipo:"tribuna", cuota:0.28, precio:14000 },
    { n:"Marquesina", tipo:"premium", cuota:0.17, precio:35000 } ]},
  PAL:{ nombre:"Estadio Municipal de La Cisterna", aforo:8000, sectores:[
    { n:"Galería Norte", tipo:"popular", cuota:0.30, precio:6000 },
    { n:"Galería Sur", tipo:"popular", cuota:0.25, precio:6000 },
    { n:"Tribuna Andes", tipo:"tribuna", cuota:0.28, precio:12000 },
    { n:"Preferencial", tipo:"premium", cuota:0.17, precio:25000 } ]},
  COQ:{ nombre:"Estadio Francisco Sánchez Rumoroso", aforo:18750, sectores:[
    { n:"Galería Norte", tipo:"popular", cuota:0.30, precio:7000 },
    { n:"Galería Sur", tipo:"popular", cuota:0.25, precio:7000 },
    { n:"Tribuna", tipo:"tribuna", cuota:0.28, precio:14000 },
    { n:"Marquesina / Preferencial", tipo:"premium", cuota:0.17, precio:30000 } ]},
  AUD:{ nombre:"Estadio Bicentenario de La Florida", aforo:12000, sectores:[
    { n:"Galería Norte", tipo:"popular", cuota:0.30, precio:7000 },
    { n:"Galería Sur", tipo:"popular", cuota:0.25, precio:7000 },
    { n:"Tribuna", tipo:"tribuna", cuota:0.28, precio:14000 },
    { n:"VIP / Preferencial", tipo:"premium", cuota:0.17, precio:28000 } ]},
  HUA:{ nombre:"Estadio CAP Acero", aforo:10500, sectores:[
    { n:"Galería Norte", tipo:"popular", cuota:0.22, precio:8000 },
    { n:"Galería Sur", tipo:"popular", cuota:0.22, precio:8000 },
    { n:"Tribuna Andes", tipo:"tribuna", cuota:0.30, precio:15000 },
    { n:"Tribuna Pacífico", tipo:"tribuna", cuota:0.18, precio:18000 },
    { n:"Oficial / VIP", tipo:"premium", cuota:0.08, precio:40000 } ]},
  OHI:{ nombre:"Estadio El Teniente", aforo:14000, sectores:[
    { n:"Galería 16", tipo:"popular", cuota:0.28, precio:7000 },
    { n:"Galería Andes", tipo:"tribuna", cuota:0.28, precio:14000 },
    { n:"Galería Rengo", tipo:"popular", cuota:0.20, precio:7000 },
    { n:"Marquesina", tipo:"tribuna", cuota:0.18, precio:20000 },
    { n:"Palco VIP", tipo:"premium", cuota:0.06, precio:40000 } ]},
  NUB:{ nombre:"Estadio Nelson Oyarzún", aforo:12000, sectores:[
    { n:"Galería Norte", tipo:"popular", cuota:0.28, precio:7000 },
    { n:"Galería Sur", tipo:"popular", cuota:0.25, precio:7000 },
    { n:"Tribuna Andes", tipo:"tribuna", cuota:0.30, precio:15000 },
    { n:"Tribuna Pacífico", tipo:"premium", cuota:0.17, precio:30000 } ]},
  COB:{ nombre:"Estadio El Cobre", aforo:12000, sectores:[
    { n:"Galería", tipo:"popular", cuota:0.40, precio:8000 },
    { n:"Tribuna", tipo:"tribuna", cuota:0.40, precio:15000 },
    { n:"Preferencial", tipo:"premium", cuota:0.20, precio:30000 } ]},
  CAL:{ nombre:"Estadio Nicolás Chahuán", aforo:9200, sectores:[
    { n:"Galería Norte", tipo:"popular", cuota:0.30, precio:6000 },
    { n:"Galería Sur", tipo:"popular", cuota:0.25, precio:6000 },
    { n:"Tribuna", tipo:"tribuna", cuota:0.30, precio:12000 },
    { n:"Preferencial", tipo:"premium", cuota:0.15, precio:25000 } ]},
  LSE:{ nombre:"Estadio La Portada", aforo:18240, sectores:[
    { n:"Galería Norte", tipo:"popular", cuota:0.28, precio:7000 },
    { n:"Galería Sur", tipo:"popular", cuota:0.25, precio:7000 },
    { n:"Tribuna Andes", tipo:"tribuna", cuota:0.28, precio:14000 },
    { n:"Marquesina", tipo:"premium", cuota:0.19, precio:28000 } ]},
  DCO:{ nombre:"Estadio Ester Roa Rebolledo", aforo:30450, sectores:[
    { n:"Galería Norte", tipo:"popular", cuota:0.28, precio:8000 },
    { n:"Galería Sur", tipo:"popular", cuota:0.24, precio:8000 },
    { n:"Tribuna Andes", tipo:"tribuna", cuota:0.26, precio:16000 },
    { n:"Tribuna Pacífico", tipo:"premium", cuota:0.22, precio:30000 } ]},
  UDC:{ nombre:"Estadio Ester Roa Rebolledo", aforo:30450, sectores:[
    { n:"Galería Norte", tipo:"popular", cuota:0.28, precio:8000 },
    { n:"Galería Sur", tipo:"popular", cuota:0.24, precio:8000 },
    { n:"Tribuna Andes", tipo:"tribuna", cuota:0.26, precio:16000 },
    { n:"Tribuna Pacífico", tipo:"premium", cuota:0.22, precio:30000 } ]},
  LIM:{ nombre:"Estadio Lucio Fariña Fernández", aforo:5500, sectores:[
    { n:"Galería", tipo:"popular", cuota:0.40, precio:5000 },
    { n:"Tribuna", tipo:"tribuna", cuota:0.40, precio:10000 },
    { n:"Preferencial", tipo:"premium", cuota:0.20, precio:20000 } ]}
};

/* tipo de sector → estética y comportamiento económico (elasticidad al precio) */
const ESTADIO_TIPOS={
  popular: { ic:"🎉", elast:1.5, kMin:0.4, kMax:2.6 },
  tribuna: { ic:"🪑", elast:1.0, kMin:0.5, kMax:3.0 },
  premium: { ic:"🥂", elast:0.6, kMin:0.6, kMax:3.6 }
};
function _slugEstadio(txt){
  return (txt||"sector").toLowerCase()
    .replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u").replace(/ñ/g,"n")
    .replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"") || "sector";
}
/* sectores del club en el shape que espera el motor: {id,n,ic,cuota,ref,elast,min,max,tipo} */
function sectoresDe(clubId){
  const e=ESTADIOS_DATA[clubId];
  if(!e||!e.sectores||!e.sectores.length) return (typeof SECTORES!=="undefined")?SECTORES:[];
  const vistos={};
  return e.sectores.map(s=>{
    const t=ESTADIO_TIPOS[s.tipo]||ESTADIO_TIPOS.tribuna;
    let id=_slugEstadio(s.n); if(vistos[id]) id+="_"+(vistos[id]++); else vistos[id]=1;
    const ref=s.precio||2500;
    return { id:id, n:s.n, ic:t.ic, cuota:s.cuota, ref:ref, elast:t.elast, tipo:s.tipo,
      min:Math.round(ref*t.kMin), max:Math.round(ref*t.kMax) };
  });
}
function estadioNombre(clubId){ const e=ESTADIOS_DATA[clubId]; return e?e.nombre:null; }
function aforoDe(clubId){ const e=ESTADIOS_DATA[clubId]; return e?e.aforo:null; }
