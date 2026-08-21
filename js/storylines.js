"use strict";
/* ============================================================
   FUTBOLINI · storylines.js   (motor de arcos de equipo)
   Sistema PARALELO al motor de decisiones: no toca el token motor.
   Un arco se siembra solo cada tanto, aparece en el escritorio, y
   lo resolvés capítulo a capítulo. Lo que elegís queda en la memoria.
   E.storyline = {activo, cap, hechos:{id:{anio}}, cd, lastKey}
   ============================================================ */
function normalizarStorylines(){
  if(!E) return;
  if(!E.storyline || typeof E.storyline!=="object") E.storyline={activo:null,cap:0,hechos:{},cd:0,lastKey:null};
  if(!E.storyline.hechos) E.storyline.hechos={};
}
function arcosDe(club){
  const propios=(typeof ARCOS_EQUIPO!=="undefined"&&ARCOS_EQUIPO[club])?ARCOS_EQUIPO[club]:[];
  const gen=(typeof ARCOS_GENERICOS!=="undefined")?ARCOS_GENERICOS:[];
  return propios.concat(gen);
}
function arcoPorId(id){ return arcosDe(E.club).find(a=>a.id===id)||null; }
/* ¿hay un arco elegible para arrancar? (respeta era y condición) */
function arcoElegible(){
  const S=E.storyline; if(S.activo) return null;
  const era=(E.modo==="historico")?"historico":"actual";
  return arcosDe(E.club).find(a=>
    !S.hechos[a.id] &&
    (!a.era || a.era===era) &&
    (!a.cond || (function(){ try{ return a.cond(E); }catch(_){ return false; } })())
  )||null;
}
/* se llama al pintar el escritorio: intenta sembrar una vez por semana */
function sembrarStoryline(){
  normalizarStorylines();
  const S=E.storyline, key=E.anio+"-"+E.idx;
  if(S.lastKey===key) return;      /* ya intentó esta semana */
  S.lastKey=key;
  if(S.activo){ guardar(); return; }
  if((S.cd||0)>0){ S.cd--; guardar(); return; }
  const a=arcoElegible(); if(!a){ guardar(); return; }
  S.activo=a.id; S.cap=0;
  if(typeof notificar==="function") notificar({t:"Historia del club: "+a.t,tipo:"neutro",bandeja:true,
    d:a.desc+" Tenés un capítulo abierto para resolver en el escritorio."});
  if(typeof recordar==="function") recordar("storyline","se abrió una historia en el club: "+a.t,{peso:"bajo"});
  guardar();
}
function arcoActivo(){ normalizarStorylines(); const S=E.storyline; return S.activo?arcoPorId(S.activo):null; }
function capituloActivo(){
  const a=arcoActivo(); if(!a) return null;
  const cap=a.capitulos[E.storyline.cap||0];
  return cap?{arco:a,cap:cap}:null;
}
function resolverStoryline(op){
  const ctx=capituloActivo(); if(!ctx||!op) return;
  if(op.ef && typeof aplicarEfectos==="function") aplicarEfectos(op.ef);
  if(op.grupos && typeof aplicarGrupos==="function") aplicarGrupos(op.grupos);
  if(op.rep && typeof aplicarRep==="function") aplicarRep(op.rep);
  if(op.mem && typeof recordar==="function") recordar("storyline",op.mem,{peso:"alto"});
  if(op.logro && typeof desbloquear==="function") desbloquear(op.logro);   /* 7.0 · logro por elección de arco */
  const S=E.storyline, a=ctx.arco;
  const cerrar=()=>{ S.hechos[a.id]={anio:E.anio}; S.activo=null; S.cap=0; S.cd=6;
    if(Object.keys(S.hechos).length>=3 && typeof desbloquear==="function") desbloquear("novelero");
    if(typeof notificar==="function") notificar({t:"Se cerró un capítulo del club",tipo:"neutro",bandeja:false,
      d:"«"+a.t+"» quedó saldado. Lo que decidiste ya es parte de la historia del club."}); };
  if(op.cierra){ cerrar(); }
  else if(op.va){ const idx=a.capitulos.findIndex(c=>c.id===op.va); S.cap=(idx>=0)?idx:((S.cap||0)+1);
    if(S.cap>=a.capitulos.length) cerrar(); }
  else { S.cap=(S.cap||0)+1; if(S.cap>=a.capitulos.length) cerrar(); }
  guardar();
}
/* ---------- UI ---------- */
function modalStoryline(){
  const ctx=capituloActivo(); if(!ctx){ if(typeof aviso==="function") aviso("No hay historia abierta"); return; }
  const a=ctx.arco, cap=ctx.cap;
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">📖</span><span>'+a.t+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("div","story-cap","<b>"+cap.t+"</b>"));
    c.appendChild(el("p","ctx",cap.ctx));
    const ops=el("div","ops");
    cap.ops.forEach(o=>{
      const b=el("button","op");
      b.innerHTML='<div class="t">'+o.t+'</div>'+(o.d?'<div class="d">'+o.d+'</div>':"");
      b.onclick=()=>{ resolverStoryline(o); cerrarModal();
        if(typeof aviso==="function") aviso("Decidiste: "+o.t);
        if(typeof render==="function") render(); };
      ops.appendChild(b);
    });
    c.appendChild(ops);
    const x=el("button","btn-aqua ancho gris","Lo veo después"); x.style.marginTop="6px";
    x.onclick=cerrarModal;
    c.appendChild(x);
  });
}
/* panel de "saga del club": lo que fuiste decidiendo en los arcos (payoff) */
function panelSagaClub(){
  if(typeof panel!=="function") return null;
  const mems=((E&&E.memoria)||[]).filter(m=>m.tipo==="storyline" && m.txt.indexOf("se abrió")<0);
  const ctx=capituloActivo();
  if(!mems.length && !ctx) return null;
  const p=panel("La saga de "+E.clubNombre,"📖","alerta");
  p.cuerpo.appendChild(el("p","mini","Los capítulos propios de tu club y lo que decidiste en cada uno. Esto queda en la historia."));
  if(ctx){
    const d=el("div","story-card");
    d.innerHTML="⏳ <b>Abierto:</b> "+ctx.arco.t+" · <span class='mini'>"+ctx.cap.t+"</span>";
    p.cuerpo.appendChild(d);
  }
  mems.slice().reverse().forEach(m=>{
    const q=(m.anio!==E.anio)?(m.anio+" · "):"";
    p.cuerpo.appendChild(el("div","saga-linea","<span class='saga-punto'>◆</span> "+q+m.txt.charAt(0).toUpperCase()+m.txt.slice(1)+"."));
  });
  return p;
}
/* tarjeta para el escritorio (la pinta ui.js si hay capítulo abierto) */
function panelStoryline(){
  const ctx=capituloActivo(); if(!ctx) return null;
  const a=ctx.arco, cap=ctx.cap;
  const p=panel("Historia del club","📖","alerta");
  p.cuerpo.appendChild(el("p","mini","Un arco propio de "+E.clubNombre+" que sigue el tiempo: lo que elijas queda."));
  const d=el("div","story-card");
  d.innerHTML="<b>"+a.t+"</b> · <span class='mini'>"+cap.t+"</span><div class='mini' style='margin-top:4px'>"+cap.ctx.slice(0,140)+"…</div>";
  p.cuerpo.appendChild(d);
  const b=el("button","btn-aqua ancho verde","📖 Abrir el capítulo");
  b.onclick=modalStoryline;
  p.cuerpo.appendChild(b);
  return p;
}
