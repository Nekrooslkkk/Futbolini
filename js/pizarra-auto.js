"use strict";
/* ============================================================
   FUTBOLINI · pizarra-auto.js — 7.9089 · pizarra por formación, automática y con química alcanzable
   Pedido del autor: "mejorar la pizarra única: que tenga que ver con las formaciones, que quede guardada
   cuando sea buena, que se automatice y quede buena sola (pero que el jugador pueda cambiarla, por si
   quiere subir las ganas de un jugador de jugar con otro y la moral), y que con CUALQUIER formación
   se pueda llegar a 100".
   1) AUTOMÁTICA: sin tocar nada, el once se acomoda solo dentro de su formación buscando la mejor química
      (cada uno sigue en su línea: un defensa no aparece de nueve). Va en E.tactica.pizQuimica y solo define
      quién queda al lado de quién: la forma táctica sigue siendo la de la formación (el motor no cambia).
   2) POR FORMACIÓN: cada formación recuerda su pizarra (la manual que guardaste o la mejor automática).
      Cambias de 4-4-2 a 3-5-2 y de vuelta: vuelve la tuya.
   3) SESIÓN DE DUPLAS (una por semana): trabajas a las 3 duplas con más roce. Suben sus ganas de jugar
      juntos (E.afinidad, hasta +30) y la moral un poco. Con semanas de trabajo, cualquier formación llega a 100.
   ============================================================ */
const AFINIDAD_MAX=30, DUPLAS_POR_SESION=3;
function _pizClave(a,b){ return a<b?a+"|"+b:b+"|"+a; }
function afinidadPar(a,b){ return (E&&E.afinidad&&E.afinidad[_pizClave(a,b)])||0; }

/* química del once con una disposición dada (sin tocar la de verdad) */
function _quimicaCon(piz,once){
  const t=E.tactica, prev=t.pizarra;
  t.pizarra=piz;
  try{ return quimicaEquipo(once).prom; } finally { t.pizarra=prev; }
}
/* optimizador: intercambia a jugadores de la misma línea mientras suba la química */
function pizarraOptima(once,base){
  let piz=(base||pizarraDesdeFormacion(once)).map(p=>Object.assign({},p));
  let mejor=_quimicaCon(piz,once);
  const grupo=p=>p.pos==="ARQ"?"ARQ":(p.pos==="DEF"?"DEF":(p.pos==="VOL"?"VOL":"DEL"));
  for(let vuelta=0;vuelta<6;vuelta++){
    let subio=false;
    for(let i=0;i<piz.length;i++) for(let j=i+1;j<piz.length;j++){
      const a=piz[i], b=piz[j];
      if(grupo(a)==="ARQ"||grupo(a)!==grupo(b)) continue;
      [a.r,b.r]=[b.r,a.r]; [a.c,b.c]=[b.c,a.c];
      const q=_quimicaCon(piz,once);
      if(q>mejor){ mejor=q; subio=true; } else { [a.r,b.r]=[b.r,a.r]; [a.c,b.c]=[b.c,a.c]; }
    }
    if(!subio) break;
  }
  return {piz:piz,q:mejor};
}
function _mismos(piz,once){ return typeof mismaGente==="function"?mismaGente(piz,once):false; }
/* se asegura de que la pizarra corresponda a la formación y al once de hoy */
function asegurarPizarra(once){
  if(!E||!E.tactica) return null;
  once=once||((typeof onceIdeal==="function")?onceIdeal():[]);
  if(!once.length) return null;
  const t=E.tactica, form=t.form||"4-4-2";
  t.pizarras=t.pizarras||{};
  /* cambió la formación: la manual de la anterior queda guardada y se carga la de esta */
  if(t._pizForm&&t._pizForm!==form){
    if(t.pizarra&&t.pizarra.length) t.pizarras[t._pizForm]=Object.assign({},t.pizarras[t._pizForm]||{},{manual:t.pizarra});
    const g=t.pizarras[form];
    t.pizarra=(g&&g.manual&&_mismos(g.manual,once))?g.manual:null;
  }
  t._pizForm=form;
  /* la automática: la guardada para esta formación si es de esta gente, si no se recalcula */
  const g=t.pizarras[form]||{};
  if(!(g.auto&&_mismos(g.auto,once))||(t.pizQuimica&&!_mismos(t.pizQuimica,once))||t._pizGente!==once.map(j=>j.n).join("|")){
    t._pizGente=once.map(j=>j.n).join("|");
    const r=pizarraOptima(once,(g.auto&&_mismos(g.auto,once))?g.auto:null);
    /* si la clásica (misma posición = conectados) rinde más, la automática no se usa: nunca empeora */
    const pz=t.pizQuimica; t.pizQuimica=null; const clasica=quimicaEquipo(once).prom; t.pizQuimica=pz;
    t.pizQuimica=r.q>=clasica?r.piz:null;
    t.pizarras[form]=Object.assign({},g,{auto:r.piz,q:Math.max(r.q,clasica)});
  }
  return t.pizarra||t.pizQuimica;
}
/* sesión de duplas: una por semana, a las que tienen más roce */
function puedeSesionDuplas(){ return !!E&&!(E.flags&&E.flags.duplasSem===((E.anio||0)+"-"+(E.idx||0))); }
function sesionDuplas(once){
  if(!puedeSesionDuplas()) return {ok:false,txt:"Ya trabajaste duplas esta semana."};
  once=once||onceIdeal();
  const lazos=(quimicaEquipo(once).lazos||[]).filter(l=>afinidadPar(l.a,l.b)<AFINIDAD_MAX).sort((x,y)=>x.q-y.q).slice(0,DUPLAS_POR_SESION);
  if(!lazos.length) return {ok:false,txt:"Tus duplas ya están al tope: no hay roce que trabajar."};
  E.afinidad=E.afinidad||{};
  lazos.forEach(l=>{ const k=_pizClave(l.a,l.b); E.afinidad[k]=Math.min(AFINIDAD_MAX,(E.afinidad[k]||0)+10); });
  E.flags=E.flags||{}; E.flags.duplasSem=(E.anio||0)+"-"+(E.idx||0);
  if(typeof aplicarEfectos==="function") aplicarEfectos({moral:2});
  const ap=(typeof apodoJug==="function")?apodoJug:(x=>x);
  return {ok:true,txt:"Sesión de duplas: "+lazos.map(l=>ap(l.a)+" & "+ap(l.b)).join(", ")+". Ahora se buscan más en la cancha (moral +2)."};
}
/* ---------- enganches ---------- */
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._pa) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._pa=true; w._orig=o; window[nom]=w; };
  /* la afinidad trabajada suma a la química del par */
  envolver("quimicaPar",o=>function(a,b){ const q=o.apply(this,arguments); if(!a||!b||a===b) return q; return clamp(q+afinidadPar(a.n,b.n),5,100); });
  /* sin pizarra manual, los vecinos salen de la automática (la forma táctica no cambia) */
  envolver("paresConectados",o=>function(once){
    const t=E&&E.tactica; if(!t||(t.pizarra&&t.pizarra.length)||!t.pizQuimica) return o.apply(this,arguments);
    t.pizarra=t.pizQuimica; try{ return o.apply(this,arguments); } finally { t.pizarra=null; } });
  ["pantallaPrevia","iniciarPartido"].forEach(n=>envolver(n,o=>function(){ try{ asegurarPizarra(); }catch(e){ console.error("pizarra:",e); } return o.apply(this,arguments); }));
  /* la pizarra manual: botón de acomodar solo, sesión de duplas, y queda guardada por formación */
  envolver("modalPizarra",o=>function(part){
    const r=o.apply(this,arguments);
    try{
      const c=document.querySelector("#capa-modal .modal .cuerpo"); if(!c) return r;
      const once=onceIdeal(), t=E.tactica, form=t.form||"4-4-2";
      const fila=el("div","piz-auto");
      const bA=el("button","btn-aqua ancho","✨ Acomodar solo (la mejor química de esta formación)");
      bA.onclick=()=>{ const x=pizarraOptima(once,t.pizarra); t.pizarra=x.piz; cerrarModal(); modalPizarra(part); aviso("Acomodado: química "+x.q+"/100"); };
      const bD=el("button","btn-aqua ancho verde","🤝 Sesión de duplas ("+(puedeSesionDuplas()?"una por semana":"ya hecha esta semana")+")");
      bD.disabled=!puedeSesionDuplas(); bD.style.marginTop="6px";
      bD.onclick=()=>{ const x=sesionDuplas(once); aviso(x.txt,4500); if(x.ok){ if(typeof guardar==="function") guardar(); cerrarModal(); modalPizarra(part); } };
      fila.appendChild(bA); fila.appendChild(bD);
      fila.appendChild(el("p","mini","Sin tocar nada, el once se acomoda solo dentro de su formación. Cada formación recuerda su pizarra. Las duplas con roce se trabajan de a 3 por semana: con constancia, cualquier formación llega a 100."));
      const g=[].slice.call(c.querySelectorAll("button")).find(b=>/Guardar pizarra/.test(b.textContent));
      if(g){ c.insertBefore(fila,g);
        const viejo=g.onclick; g.onclick=function(){ t.pizarras=t.pizarras||{}; t.pizarras[form]=Object.assign({},t.pizarras[form]||{},{manual:t.pizarra}); t._pizForm=form; return viejo.apply(this,arguments); }; }
      else c.appendChild(fila);
    }catch(e){ console.error("pizarra:",e); }
    return r;
  });
})();
