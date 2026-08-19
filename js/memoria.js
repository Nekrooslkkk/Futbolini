"use strict";
/* ============================================================
   FUTBOLINI · memoria.js   (Fase 1 · el corazón anti-robótico)
   El club RECUERDA lo que hiciste y te lo cita después. Convierte
   eventos sueltos en una historia con tu firma: nada de lo que
   pasa es azar anónimo, todo cuelga de tus decisiones. Le da
   responsabilidad al jugador — para bien y para mal.
   E.memoria = registro rodante de hechos salientes (máx 60).
   Cada hecho: {id,tipo,txt,quien,peso,tono,anio,idx,usado}
   ============================================================ */
function normalizarMemoria(){ if(E && !Array.isArray(E.memoria)) E.memoria=[]; }

/* graba un hecho. txt SIEMPRE en 2ª persona ("prometiste", "vendiste", "ganaste"). */
function recordar(tipo, txt, opts){
  if(!E) return null;
  if(!Array.isArray(E.memoria)) E.memoria=[];
  opts=opts||{};
  if(E.memoria.some(m=>m.txt===txt && m.anio===E.anio)) return null; /* no duplicar dentro del año */
  const m={ id:"mem_"+(E._memId=(E._memId||0)+1), tipo:tipo, txt:txt,
    quien:opts.quien||null, peso:opts.peso||"medio", tono:opts.tono||"neutro",
    anio:E.anio, idx:E.idx||0, usado:0 };
  E.memoria.push(m);
  if(E.memoria.length>60) E.memoria.splice(0, E.memoria.length-60);
  return m;
}
function pesoMem(p){ return p==="alto"?3:(p==="bajo"?1:2); }
/* últimos n hechos (opcionalmente filtrados), del más nuevo al más viejo */
function memoriaReciente(filtro, n){
  let l=(E&&E.memoria)?E.memoria:[];
  if(filtro) l=l.filter(filtro);
  return l.slice(-(n||6)).reverse();
}
/* elige un hecho relevante para citar y lo marca como usado (evita repetir siempre lo mismo) */
function citarMemoria(filtro){
  let l=((E&&E.memoria)||[]).filter(m=>m.usado<2 && (!filtro||filtro(m)));
  if(!l.length) return null;
  l.sort((a,b)=>(pesoMem(b.peso)-pesoMem(a.peso))||(b.idx-a.idx));
  const m=l[0]; m.usado++; return m;
}
/* cuánto hace de un hecho, en lenguaje natural */
function cuandoMemoria(m){
  if(!m||!E) return "";
  if(m.anio!==E.anio) return (E.anio-m.anio===1?"el año pasado":"allá por "+m.anio);
  const d=(E.idx||0)-(m.idx||0);
  if(d<=1) return "recién";
  if(d<=4) return "hace "+d+" fechas";
  return "más temprano en el año";
}
/* busca una promesa a un jugador que siga sin saldarse */
function promesaPendiente(){
  return ((E&&E.memoria)||[]).find(m=>m.tipo==="promesa"&&m.quien&&m.usado<2&&((E.idx||0)-(m.idx||0))>=2)||null;
}
