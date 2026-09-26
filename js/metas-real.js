"use strict";
/* ============================================================
   FUTBOLINI · metas-real.js — 7.9083 · metas SIEMPRE realistas
   Reporte del autor: "Linares, en Segunda, tiene de meta clasificar a Sudamericana". Las metas
   se armaban en capas (carrera.js por prestigio, data-copas2026.js, pulido.js) y ninguna miraba
   la división ni cuán fuerte es tu plantel frente a tu liga. Esta capa va AL FINAL y manda:
   1) Fuera de Primera no hay metas continentales (la B y la Segunda no clasifican).
   2) La meta de posición no puede pedir más de lo que da tu plantel: se mide tu lugar real
      en la liga por fuerza (tu plantel vs. la fuerza de cada rival) y se exige, como mucho,
      2 puestos por encima de ese lugar. Un grande sigue peleando el título; un chico, no.
   3) Triunfos: tope según partidos de liga y lo que ganaría un equipo de tu nivel.
   4) Sudamericana solo se pide si tu plantel da para pelear el 6° (queda de consuelo para los grandes).
   5) El "mandato" (lo que te piden) dice lo mismo que la meta deportiva.
   ============================================================ */
const METAS_CONTINENTAL=/Libertadores|Sudamericana|internacional|continental|CONMEBOL/i;

/* tu lugar real en la liga por fuerza: 1 = el más fuerte */
function rankingFuerza(){
  const L=(typeof clubesLigaActual==="function")?clubesLigaActual():[];
  if(!L.length||!E) return {rank:1,n:1};
  const mia=(E.ind&&E.ind.plantel)||60;
  const otros=L.filter(c=>c.id!==E.club).map(c=>+c.fuerza||60);
  return {rank:1+otros.filter(f=>f>mia+1).length, n:L.length};
}
function divisionActual(){ return (typeof miDivision==="function")?miDivision():1; }
function partidosLiga(){ return ((E&&E.calendario)||[]).filter(x=>x.tipo==="liga").length||30; }

function metaPosicionRealista(dep,rk,div){
  const piso=Math.max(1,rk.rank-2);            /* lo más alto que se le puede pedir a este plantel */
  if(dep.meta>=piso) return false;             /* ya era alcanzable */
  const n=rk.n, meta=piso;
  dep.meta=meta; dep.realista=true;
  if(div===1){
    if(meta<=1){ dep.t="Pelear el título"; dep.detalle="Salir campeón."; }
    else if(meta>=n-3){ dep.t="Mantener la categoría"; dep.detalle="No caer a los puestos de descenso."; dep.meta=n-2; }
    else if(meta<=Math.ceil(n/2)){ dep.t="Terminar entre los "+meta+" primeros"; dep.detalle="Terminar "+meta+"° o más arriba."; }
    else { dep.t="Terminar en la mitad de la tabla"; dep.detalle="Terminar "+meta+"° o más arriba."; }
  } else {
    if(meta<=2){ dep.t="Pelear el ascenso"; dep.detalle="Terminar entre los 2 primeros."; }
    else if(div===2&&meta<=8){ dep.meta=8; dep.t="Entrar a la liguilla de ascenso"; dep.detalle="Terminar entre los 8 primeros de la B: del 2° al 8° pelean el segundo cupo a Primera."; }
    else if(meta>=n-1){ dep.t="No terminar en el fondo"; dep.detalle="Salir del último lugar."; dep.meta=n-1; }
    else { dep.t="Terminar "+meta+"° o más arriba"; dep.detalle="Pelear la parte alta sin mentirle a nadie."; }
  }
  dep.porque="Con este plantel eres el "+rk.rank+"° más fuerte de "+n+". La dirigencia pide lo que se puede pelear, no un milagro.";
  return true;
}
function ajustarMetasReales(objs){
  objs=(objs||[]).slice();
  if(!E) return objs;
  const div=divisionActual(), rk=rankingFuerza();
  /* 1 · sin continentales fuera de Primera */
  if(div>1) objs=objs.filter(o=>!METAS_CONTINENTAL.test((o.t||"")+" "+(o.torneo||"")));
  const dep=objs.find(o=>o.id==="dep");
  /* 2 · posición alcanzable */
  if(dep&&(dep.tipo==="pos"||dep.tipo==="posicion")&&typeof dep.meta==="number") metaPosicionRealista(dep,rk,div);
  /* 4 · "clasificar a Sudamericana" es el premio de consuelo de los que pelean arriba (un grande que no sale campeón
     igual la busca); si tu plantel no da para el 6° (con 3 de margen), no se pide */
  objs=objs.filter(o=>o.id!=="sud27"||rk.rank<=9);
  /* 3 · triunfos posibles */
  const vic=objs.find(o=>o.id==="vic");
  if(vic){
    const pj=partidosLiga(), q=rk.rank/Math.max(1,rk.n);
    const tasa=q<=0.15?0.62:(q<=0.35?0.5:(q<=0.6?0.38:(q<=0.8?0.3:0.24)));
    const tope=Math.max(2,Math.round(pj*tasa));
    if(vic.meta>tope){ vic.meta=tope; vic.t="Sumar "+tope+" triunfos"; vic.detalle="Ganar al menos "+tope+" de los "+pj+" partidos de liga."; }
  }
  return objs;
}
/* ---------- enganches: después de todas las capas que ya existían ---------- */
(function(){
  const o=window.generarObjetivos;
  if(typeof o==="function"&&!o._real){
    const w=function(){ return ajustarMetasReales(o.apply(this,arguments)||[]); };
    Object.keys(o).forEach(k=>w[k]=o[k]); w._real=true; w._orig=o; window.generarObjetivos=w;
  }
  const x=window.expectativa;
  if(typeof x==="function"&&!x._real){
    /* el mandato repite la meta deportiva vigente, para que nunca digan cosas distintas */
    const w=function(){ const r=x.apply(this,arguments);
      try{ const dep=E&&(E.objetivos||[]).find(o=>o.id==="dep"); if(dep&&typeof dep.meta==="number") return {pos:dep.meta,txt:dep.t.charAt(0).toLowerCase()+dep.t.slice(1)}; }catch(e){}
      return r; };
    Object.keys(x).forEach(k=>w[k]=x[k]); w._real=true; w._orig=x; window.expectativa=w;
  }
})();
/* partidas ya empezadas con metas imposibles: se corrigen al cargar (una vez por temporada) */
function sanearMetasPartida(){
  if(!E||!E.objetivos||!E.objetivos.length) return false;
  if(E._metasReal===E.anio) return false;
  const antes=JSON.stringify(E.objetivos.map(o=>[o.id,o.meta,o.t]));
  E.objetivos=ajustarMetasReales(E.objetivos);
  E._metasReal=E.anio;
  return antes!==JSON.stringify(E.objetivos.map(o=>[o.id,o.meta,o.t]));
}
(function(){
  /* las metas se generan antes de que la liga nueva esté armada (el ranking daba 1°): se corrigen al terminar */
  const n=window.nuevaPartida;
  if(typeof n==="function"&&!n._real){ const w=function(){ const x=n.apply(this,arguments); try{ if(E) E._metasReal=null; sanearMetasPartida(); }catch(e){} return x; };
    Object.keys(n).forEach(k=>w[k]=n[k]); w._real=true; w._orig=n; window.nuevaPartida=w; }
  const r=window.render; if(typeof r!=="function"||r._real) return;
  const w=function(){ try{ sanearMetasPartida(); }catch(e){} return r.apply(this,arguments); };
  Object.keys(r).forEach(k=>w[k]=r[k]); w._real=true; w._orig=r; window.render=w;
})();
