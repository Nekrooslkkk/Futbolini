"use strict";
/* ============================================================
   FUTBOLINI · barra.js   (Section 5 · Mesa de la barra)
   La barra NO es un slider de hinchada: es un interlocutor con
   memoria. Acordás pactos, quedan guardados, y si los rompés te
   lo cobran (lienzo + silbidos + evento de puerta).
   E.barra = {humor, lienzos:[], pactos:[], ultimoIdx, roto}
   ============================================================ */
function normalizarBarra(){
  if(!E) return;
  if(!E.barra) E.barra={humor:60, lienzos:[], pactos:[], ultimoIdx:-99, roto:false};
  if(!Array.isArray(E.barra.lienzos)) E.barra.lienzos=[];
  if(!Array.isArray(E.barra.pactos)) E.barra.pactos=[];
}
function pactosVigentes(){ return (((E&&E.barra)||{}).pactos||[]).filter(p=>!p.roto).length; }
function barraContenta(){ return pactosVigentes()>=3; }
function puedeMesaBarra(){ return E&&E.barra&&((E.idx||0)-(E.barra.ultimoIdx||-99))>=4; }

/* los 3 pactos reales que se pueden acordar */
function pactosBarra(){
  const idolo=(E.plantel||[]).filter(j=>!j.vendido&&j.rasgos&&(j.rasgos.indexOf("de la casa")>=0||j.rasgos.indexOf("ídolo")>=0))
    .sort((a,b)=>b.nivel-a.nivel)[0];
  const L=[
    {tipo:"aliento", t:"Darles lugar para lienzos, bombos y trapos",
     d:"La barra copa la tribuna con todo. Aliento asegurado, pero atás al club a un grupo que no rinde cuentas.",
     costo:0, ef:{riesgo:6}, grupos:{hinchada:8,prensa:-4}, resumen:"aliento a cambio de vista gorda"},
    {tipo:"logistica", t:"Entradas y un viaje al norte",
     d:"Bancás pasajes y entradas para el próximo viaje largo. Cuesta plata, pero la mesa lo valora.",
     costo:40, ef:{}, grupos:{hinchada:7}, resumen:"entradas y viaje pagados"}
  ];
  if(idolo) L.push({tipo:"no_vender", quien:idolo.n,
     t:"Comprometerte a no vender a "+idolo.n,
     d:idolo.n+" es de los suyos. Si les das la palabra de que no se vende y después lo vendés, se te dan vuelta.",
     costo:0, ef:{}, grupos:{hinchada:10,directorio:-6}, resumen:"no vender a "+idolo.n});
  else L.push({tipo:"no_bajar", t:"Prometer que no se remata el plantel",
     d:"Les asegurás que no vas a malvender para tapar agujeros. Palabra de dirigencia.",
     costo:0, ef:{}, grupos:{hinchada:8,directorio:-4}, resumen:"no rematar el plantel"});
  return L;
}
function pactar(o){
  normalizarBarra();
  if(o.costo && E.plata<o.costo){ if(typeof aviso==="function") aviso("No te alcanza la caja ("+plata(o.costo)+")"); return false; }
  if(o.costo) aplicarEfectos({plata:-o.costo});
  if(o.ef) aplicarEfectos(o.ef);
  if(o.grupos) aplicarGrupos(o.grupos);
  E.barra.pactos.push({tipo:o.tipo, quien:o.quien||null, resumen:o.resumen, anio:E.anio, idx:E.idx, roto:false});
  E.barra.humor=clamp((E.barra.humor||60)+8,0,100);
  E.barra.ultimoIdx=E.idx||0;
  if(typeof recordar==="function") recordar("barra","le diste tu palabra a la barra: "+o.resumen,{peso:"medio"});
  if(typeof postProc==="function"&&typeof handleHinchaDeClub==="function")
    postProc(handleHinchaDeClub(),"hincha","La mesa con la dirigencia cerró: "+o.resumen+". Ahora que se cumpla. 🚩","neutro");
  if(barraContenta() && typeof notificar==="function")
    notificar({t:"La barra está de tu lado",tipo:"bueno",bandeja:false,
      d:"Tres pactos en pie. En el próximo clásico de local vas a tener una caldera a favor (aunque el riesgo de incidentes también sube)."});
  guardar();
  return true;
}
/* rompés un pacto (ej: vender al de la casa que juraste no vender) */
function romperPacto(motivo,quien){
  normalizarBarra();
  let p=E.barra.pactos.find(x=>!x.roto && quien && x.tipo==="no_vender" && x.quien===quien);
  if(!p) p=E.barra.pactos.find(x=>!x.roto && (x.tipo==="no_vender"||x.tipo==="no_bajar"));
  if(!p) return false;
  p.roto=true; E.barra.roto=true;
  E.barra.humor=clamp((E.barra.humor||60)-28,0,100);
  E.barra.lienzos.push({t:"«Dirigencia mentirosa: "+p.resumen+"»", anio:E.anio, idx:E.idx});
  aplicarGrupos({hinchada:-14,directorio:-4});
  E.flags.puertaBarra=E.idx;   /* semilla: evento de puerta pronto */
  if(typeof notificar==="function") notificar({t:"La barra se sintió traicionada",tipo:"malo",bandeja:false,
    d:(motivo||"Rompiste un pacto con la barra.")+" Colgaron un lienzo en contra y el clima se puso hostil. En el próximo partido vas a escuchar silbidos, y algo se va a mover en la puerta."});
  if(typeof postProc==="function"&&typeof handleHinchaDeClub==="function")
    postProc(handleHinchaDeClub(),"hincha","La mesa era clara y la rompieron igual. A esta dirigencia no se le olvida más. 🚩🔥","malo");
  if(typeof recordar==="function") recordar("barra","le rompiste un pacto a la barra ("+p.resumen+")",{peso:"alto",tono:"malo"});
  guardar();
  return true;
}
