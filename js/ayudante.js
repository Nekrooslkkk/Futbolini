"use strict";
/* ============================================================
   FUTBOLINI · ayudante.js — 7.9040 (Claude)
   Pedido del autor: "el ayudante tiene que HACER cosas en vez de preguntar,
   para automatizar y enseñar. Cada problema se arregla rápido con él, y te
   cuenta qué hizo". Antes solo diagnosticaba ("Caja flaca", "Camarín cortado")
   y te mandaba a buscar el botón.
   Acá: cada problema que detecta trae su acción concreta, con el PORQUÉ
   (para aprender) y, después de hacerla, el QUÉ HIZO con números.
   Todo usa las mismas funciones que usarías tú: no hay atajos mágicos.
   ============================================================ */

function _ayLog(txt){
  E.ayudante=E.ayudante||{log:[]};
  E.ayudante.log=E.ayudante.log||[];
  E.ayudante.log.unshift({anio:E.anio, idx:E.idx, txt:txt});
  E.ayudante.log=E.ayudante.log.slice(0,10);
}
function _ayClave(k){ return "ay_"+k+"_"+E.anio+"_"+E.idx; }
function _ayCansados(){
  const once=(typeof onceIdeal==="function")?onceIdeal():[];
  return once.filter(j=>(j.cansancio||0)>=16);
}
function _ayManualRoto(){
  const m=E.tactica&&E.tactica.xiManual;
  if(!Array.isArray(m)||!m.length) return [];
  return m.filter(n=>{ const j=(E.plantel||[]).find(x=>x.n===n); return !j||j.vendido||j.cedido||(j.lesion||0)>0; });
}
/* la opción que el ayudante se juega: la de mejor puntaje que hoy se puede pagar */
function ayudanteOpcion(d){
  if(!d||!d.op) return -1;
  let idx=-1, mejor=-Infinity;
  d.op.forEach((o,i)=>{
    const ok=(typeof requisitoCumplido==="function")?requisitoCumplido(o).ok:true;
    const s=(typeof puntajeOpcion==="function")?puntajeOpcion(o):0;
    if(ok&&s>mejor){ mejor=s; idx=i; }
  });
  return idx;
}

/* ---------- qué puede hacer ahora (con el porqué) ---------- */
function ayudanteAcciones(){
  if(!E) return [];
  E.flags=E.flags||{};
  const out=[];
  const nDec=(E.decPend||[]).length;
  if(nDec) out.push({id:"decisiones", ic:"📥", seguro:true,
    t:"Resolver "+(nDec===1?"la decisión pendiente":"las "+nDec+" decisiones pendientes"),
    porque:"Si no decides, el club decide solo y casi nunca a tu favor. Elijo en cada una la que más le conviene al club con lo que hoy se puede pagar."});
  const moral=(E.ind&&E.ind.moral)||60;
  if(moral<55 && typeof charlaCapitan==="function" && !(typeof _claveCharla==="function"&&E.flags[_claveCharla()]))
    out.push({id:"charla", ic:"🧑‍✈️", seguro:true, t:"Hablar con el capitán para bajar la ansiedad",
      porque:"Con la moral en "+Math.round(moral)+", una arenga suena a exigencia y baja más. Con el grupo caído, calmar es lo que sube."});
  const cans=_ayCansados();
  if(cans.length>=2 && !E.flags[_ayClave("suave")] && !E.flags["entreno_"+E.anio+"_"+E.idx])
    out.push({id:"suave", ic:"🧘", seguro:true, t:"Semana suave para "+cans.length+" titulares cansados",
      porque:"Con las piernas pesadas el riesgo de lesión sube y rinden menos. Una semana suave les baja el cansancio a cambio de un poco de forma."});
  const roto=_ayManualRoto();
  if(roto.length) out.push({id:"once", ic:"📋", seguro:true, t:"Rearmar el once (tenías a "+roto.length+" que no pueden jugar)",
    porque:"Tu once manual incluye lesionados o jugadores que ya no están. Lo rearmo con los mejores disponibles por puesto."});
  const ratio=(typeof precioPromedioRatio==="function")?precioPromedioRatio():1;
  if(E.ind&&E.ind.hinchada<45 && ratio>0.95 && E.precios && !E.flags[_ayClave("precios")])
    out.push({id:"precios", ic:"🎫", seguro:false, t:"Bajar las entradas un 10%",
      porque:"La hinchada está en "+Math.round(E.ind.hinchada)+". Entradas más baratas llenan más y la gente vuelve de a poco. Se pierde algo de taquilla por entrada."});
  if(E.finanzas && !E.finanzas.delegado && ((E.plata||0)<(typeof costoSemanal==="function"?costoSemanal()*3:80) || (E.deuda||0)>(E.plata||0)*3))
    out.push({id:"tesorero", ic:"🏦", seguro:false, t:"Pasarle la caja al Tesorero en modo prudente",
      porque:"Con la caja justa, un Tesorero prudente guarda un colchón de 6 semanas de gastos y usa lo que sobra para bajar deuda. Cobra una comisión chica."});
  return out;
}

/* ---------- las acciones (devuelven qué hicieron, con números) ---------- */
function ayudanteHacer(id){
  if(!E) return "";
  E.flags=E.flags||{};
  let txt="";
  if(id==="decisiones"){
    const lineas=[];
    (E.decPend||[]).slice().forEach(x=>{
      const d=(typeof decisionPorId==="function")?decisionPorId(x.id):null; if(!d) return;
      const i=ayudanteOpcion(d); if(i<0) return;
      let r=null; try{ r=resolverDecision(d,i); }catch(e){}
      lineas.push("«"+(typeof resolverTokens==="function"?resolverTokens(d.t,E):d.t)+"» → "+d.op[i].t+(r&&r.tier?" ("+(r.tier==="bien"?"salió bien":r.tier==="mitad"?"a medias":"salió mal")+")":""));
    });
    txt=lineas.length?"Resolví "+lineas.length+": "+lineas.join(" · "):"No había decisiones que se pudieran resolver.";
  } else if(id==="charla"){
    const m0=E.ind.moral, r=charlaCapitan("calma"), dm=Math.round(E.ind.moral-m0);
    if(typeof _claveCharla==="function") E.flags[_claveCharla()]=r.txt;
    txt="Hablé con el capitán para bajar la ansiedad: "+r.txt+" Moral "+(dm>=0?"+":"")+dm+".";
  } else if(id==="suave"){
    const cans=_ayCansados();
    cans.forEach(j=>{ j.cansancio=Math.max(0,(j.cansancio||0)-8); j.forma=Math.max(30,(j.forma||60)-1); });
    E.flags[_ayClave("suave")]=true;
    txt="Semana suave para "+cans.map(j=>j.n).join(", ")+": −8 de cansancio cada uno, −1 de forma.";
  } else if(id==="once"){
    const roto=_ayManualRoto();
    E.tactica.xiManual=null;
    const once=(typeof onceIdeal==="function")?onceIdeal():[];
    txt="Saqué del once a "+roto.join(", ")+" y lo rearmé con los mejores disponibles: "+once.map(j=>j.n.split(" ").slice(-1)[0]).join(", ")+".";
  } else if(id==="precios"){
    const antes=(typeof proyeccionTaquilla==="function")?proyeccionTaquilla():null;
    Object.keys(E.precios||{}).forEach(k=>{ E.precios[k]=Math.max(1,Math.round(E.precios[k]*0.9)); });
    const desp=(typeof proyeccionTaquilla==="function")?proyeccionTaquilla():null;
    E.flags[_ayClave("precios")]=true;
    txt="Bajé las entradas un 10%."+(antes&&desp?" Taquilla estimada de local: "+plata(antes.ingreso)+" → "+plata(desp.ingreso)+", público "+(antes.gente||0).toLocaleString("es-CL")+" → "+(desp.gente||0).toLocaleString("es-CL")+".":"")+" La hinchada lo nota en unas semanas.";
  } else if(id==="tesorero"){
    E.finanzas.delegado=true; E.finanzas.riesgo="prudente";
    txt="Le pasé la caja al Tesorero en modo prudente: guarda "+plata(colchonTesorero())+" de colchón (6 semanas de gastos) y lo que sobre va a la deuda. Lo puedes cambiar en Finanzas.";
  }
  if(txt){
    _ayLog(txt);
    if(typeof notificar==="function") notificar({t:"🧑‍🏫 El ayudante se encargó",tipo:"neutro",d:txt,bandeja:false});
    if(typeof guardar==="function") guardar();
  }
  return txt;
}
/* lo seguro de una: lo que no tiene costo ni riesgo de salir mal */
function ayudanteHacerTodoSeguro(){
  const hechas=[];
  ayudanteAcciones().filter(a=>a.seguro).forEach(a=>{ const t=ayudanteHacer(a.id); if(t) hechas.push(t); });
  return hechas;
}

/* ---------- Tesorero con nivel de riesgo (enseña cuánto arriesgar) ---------- */
const TESORERO_RIESGO={
  prudente:{n:"Prudente", semanas:6, abono:0.7, d:"Guarda 6 semanas de gastos y usa casi todo lo demás para bajar deuda. Dormís tranquilo; no queda plata para fichar."},
  medio:{n:"Medio", semanas:4, abono:0.5, d:"4 semanas de colchón y la mitad del excedente a la deuda. Un equilibrio."},
  agresivo:{n:"Agresivo", semanas:2, abono:0.2, d:"Solo 2 semanas de colchón y poco a la deuda: queda caja para fichar, pero un mes malo te deja sin sueldos."}
};
function colchonTesorero(){
  const r=TESORERO_RIESGO[(E.finanzas&&E.finanzas.riesgo)||"medio"]||TESORERO_RIESGO.medio;
  const cs=(typeof costoSemanal==="function")?costoSemanal():40;
  return Math.max(10, Math.round(cs*r.semanas));
}
(function wrapTesorero(){
  if(typeof gestionTesorero!=="function"||gestionTesorero._ay) return;
  gestionTesorero=function(){
    if(!E.finanzas||!E.finanzas.delegado) return;
    const r=TESORERO_RIESGO[E.finanzas.riesgo||"medio"]||TESORERO_RIESGO.medio;
    const col=colchonTesorero(), hizo=[];
    if(E.deuda>0 && E.plata>col){
      const ab=Math.min(E.deuda, Math.round((E.plata-col)*r.abono));
      if(ab>0){ E.plata-=ab; E.deuda-=ab; hizo.push("abonó "+plata(ab)+" a la deuda"); }
    }
    if(E.plata<col) hizo.push("la caja ("+plata(E.plata)+") está bajo el colchón de "+plata(col)+": no abonó nada");
    const honestidad=(E.staff&&E.staff.tesorero)||60;
    const fee=Math.round(((typeof ingresoSemanal==="function")?ingresoSemanal():0)*(0.02+(100-honestidad)/1500));
    if(fee>0){ E.plata=Math.max(0,E.plata-fee); if(E.flags) E.flags.feeTesoreroUlt=fee; hizo.push("cobró "+plata(fee)+" de comisión"); }
    E.finanzas.informe="Semana "+(E.idx+1)+" · "+r.n+": "+(hizo.join("; ")||"nada que mover")+".";
  };
  gestionTesorero._ay=true;
})();

/* ---------- en el Escritorio: "Lo hago yo" dentro del panel del Ayudante ---------- */
function bloqueAyudanteHace(){
  const box=el("div","ay-hace");
  const acc=ayudanteAcciones();
  box.appendChild(el("h3","sub","🧑‍🏫 Lo hago yo"));
  if(!acc.length) box.appendChild(el("p","mini","Por ahora no hay nada que arreglar. Si aparece algo, lo vas a ver acá con su botón."));
  acc.forEach(a=>{
    const fila=el("div","ay-accion"+(a.seguro?"":" ay-riesgo"));
    fila.innerHTML='<div class="ay-t">'+a.ic+" "+escHtml(a.t)+'</div><div class="ay-pq mini">Por qué: '+escHtml(a.porque)+'</div>';
    const b=el("button","btn-aqua chico"+(a.seguro?" verde":""),a.seguro?"Hazlo":"Hazlo (tiene costo)");
    b.onclick=()=>{ const t=ayudanteHacer(a.id); render(); if(t&&typeof aviso==="function") aviso("🧑‍🏫 "+t.slice(0,90)); };
    fila.appendChild(b);
    box.appendChild(fila);
  });
  if(acc.filter(a=>a.seguro).length>=2){
    const bt=el("button","btn-aqua ancho verde","✅ Haz todo lo seguro ("+acc.filter(a=>a.seguro).length+")");
    bt.onclick=()=>{ const h=ayudanteHacerTodoSeguro(); render(); if(typeof aviso==="function") aviso("🧑‍🏫 Listo: "+h.length+" cosas resueltas"); };
    box.appendChild(bt);
  }
  const log=(E.ayudante&&E.ayudante.log)||[];
  if(log.length){
    const det=el("details","ay-log");
    det.appendChild(el("summary","","Lo último que hice ("+log.length+")"));
    log.slice(0,5).forEach(l=>det.appendChild(el("p","mini","• "+escHtml(l.txt))));
    box.appendChild(det);
  }
  return box;
}
(function wrapEscritorioAyudante(){
  if(typeof vistaEscritorio!=="function"||vistaEscritorio._ay) return;
  const orig=vistaEscritorio;
  vistaEscritorio=function(){
    const r=orig.apply(this,arguments);
    try{
      const p=[].slice.call(document.querySelectorAll("#vista .panel")).find(x=>{ const c=x.querySelector(".cab"); return c&&/Ayudante/.test(c.textContent); });
      if(p){ const c=p.querySelector(".cuerpo"); if(c) c.insertBefore(bloqueAyudanteHace(), c.children[1]||null); }
    }catch(e){}
    return r;
  };
  try{ Object.keys(orig).forEach(k=>{ vistaEscritorio[k]=orig[k]; }); }catch(e){}
  vistaEscritorio._ay=true;
})();
