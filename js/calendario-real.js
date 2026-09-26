"use strict";
/* ============================================================
   FUTBOLINI · calendario-real.js  (7.9048)
   Las decisiones que hablan de días y horarios miran TU calendario:
   - "domingo" en decisiones y arcos pasa a ser el día real de tu próximo partido de local;
   - "entrada barata" rebaja DE VERDAD ese partido; "horario de televisión" lo mueve al lunes 21:00;
   - la votación en la ANFP condiciona tu próximo fixture (horario estelar o castigo);
   - la decisión del "viaje imposible" solo aparece si tu fixture tiene ese tramo, y lo nombra.
   Carga después de storylines.js / ui.js y antes de ayudante.js.
   ============================================================ */
const DIAS_SEM=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
function fechaRealDe(f){ return new Date((E&&E.anio)||2026, (f.m||1)-1, f.d||1); }
function diaSemanaDe(part){ return (part&&part.f)?fechaRealDe(part.f).getDay():-1; }
function nombreDiaDe(part){ const d=diaSemanaDe(part); return d>=0?DIAS_SEM[d]:""; }
function _crDias(f1,f2){ return Math.round((fechaRealDe(f2)-fechaRealDe(f1))/86400000); }
function _crFechaCorta(f){ return f?(f.d+"/"+f.m):""; }
function _crPendientes(){ return (E&&E.calendario||[]).slice(E.idx||0).filter(p=>p&&!p.jugado&&p.f); }
function proximoLocal(){ return _crPendientes().find(p=>p.local&&(p.tipo==="liga"||p.tipo==="copa"))||null; }
function proximoLocalFinde(){ const p=proximoLocal(); const d=diaSemanaDe(p); return (p&&(d===0||d===6))?p:null; }

/* "domingo" → el día real de tu próximo partido de local. "Juan Domingo" no se toca. */
function textoConDia(txt){
  if(!txt||typeof txt!=="string"||txt.indexOf("omingo")<0) return txt;
  const p=proximoLocal(); const dia=nombreDiaDe(p);
  if(!dia||dia==="domingo") return txt;
  const Dia=dia[0].toUpperCase()+dia.slice(1);
  return txt.replace(/domingo/g,dia).replace(/(^|[.¿¡«"(:]\s*)Domingo/g,function(m,a){ return a+Dia; });
}
/* tramo apretado: una visita y el partido siguiente con 4 días o menos */
function tramoApretado(){
  const L=_crPendientes().slice(0,6);
  for(let i=0;i<L.length-1;i++){
    const a=L[i], b=L[i+1], dias=_crDias(a.f,b.f);
    if(!a.local && dias>0 && dias<=4) return {a:a,b:b,dias:dias};
  }
  return null;
}
function textoTramo(){
  const t=tramoApretado(); if(!t) return "El fixture viene cargado";
  const num=["","un día","dos días","tres días","cuatro días"][t.dias]||(t.dias+" días");
  return "De visita el "+nombreDiaDe(t.a)+" "+_crFechaCorta(t.a.f)+" ante "+(t.a.rivalNombre||"el rival")+
    ", y el "+nombreDiaDe(t.b)+" "+_crFechaCorta(t.b.f)+" otra vez"+(t.b.local?" de local":"")+" ante "+(t.b.rivalNombre||"el rival")+": "+num+" entre partidos";
}

/* ---------- efectos reales sobre el partido ---------- */
function promoProxLocal(pr){
  const p=proximoLocal(); if(!p) return null;
  p.promo=Object.assign({},p.promo||{},pr);
  return p;
}
function moverAHorarioTV(){
  const p=proximoLocal(); if(!p) return null;
  const d=diaSemanaDe(p);
  let movido=false;
  if(d===0||d===6){
    const nueva=fechaRealDe(p.f); nueva.setDate(nueva.getDate()+(d===6?2:1));
    const L=_crPendientes(), i=L.indexOf(p), sig=L[i+1];
    const nf={m:nueva.getMonth()+1,d:nueva.getDate()};
    if(nueva.getFullYear()===((E&&E.anio)||2026) && (!sig||_crDias(nf,sig.f)>=3)){ p.f=nf; movido=true; }
  }
  p.hora="21:00";
  p.promo=Object.assign({},p.promo||{},{gente:0.85,motivo:(movido?"Movido al lunes 21:00 por la TV":"A las 21:00 por la TV")});
  return p;
}
const _CR_BARATA=/entrada barata|entradas? baratas?|precios? bajos|bajar (las )?entradas|llenarlo con (el pueblo|su gente)|llenar con (la|su) gente/i;
const _CR_TV=/horario de televisi|lunes a las 21|aceptar el lunes/i;
function efectoCalendario(txt){
  if(!txt) return null;
  if(_CR_BARATA.test(txt)){
    const p=promoProxLocal({precio:0.7,gente:1.15,motivo:"Entrada rebajada: lo decidiste"});
    return p?("La rebaja corre para tu partido del "+nombreDiaDe(p)+" "+_crFechaCorta(p.f)+" ante "+p.rivalNombre+"."):null;
  }
  if(_CR_TV.test(txt)){
    const p=moverAHorarioTV();
    return p?("Tu partido ante "+p.rivalNombre+" queda el "+nombreDiaDe(p)+" "+_crFechaCorta(p.f)+" a las 21:00."):null;
  }
  return null;
}
/* ---------- la votación en la ANFP condiciona el fixture ---------- */
function _crEsVotoANFP(dec){ return !!dec&&(dec.id==="b_anfp_voto"||/Consejo de Presidentes|Votaci[oó]n en la ANFP/i.test(dec.t||"")); }
function _crTipoVoto(op,tier){
  const t=(op&&op.t)||"";
  if(/grandes/i.test(t)) return tier==="mal"?"castigo":"favor";
  if(/chicos|regionales/i.test(t)) return tier==="bien"?"nada":"castigo";
  return "nada";
}
function aplicarFixtureANFP(tipo){
  if(!E) return [];
  E.flags=E.flags||{};
  E.flags.fixtureANFP={tipo:tipo,anio:E.anio,idx:E.idx||0};
  const L=_crPendientes().filter(p=>p.tipo==="liga").slice(0,4), tocados=[];
  if(tipo==="favor"){
    const p=L.find(x=>x.local);
    if(p){ p.hora="18:00"; p.promo=Object.assign({},p.promo||{},{gente:1.08,motivo:"La ANFP te dio el horario estelar"}); tocados.push(p); }
  } else if(tipo==="castigo"){
    const p=L.find(x=>x.local);
    if(p){ p.hora="15:00"; p.promo=Object.assign({},p.promo||{},{gente:0.82,motivo:"Horario castigo de la ANFP ("+nombreDiaDe(p)+" 15:00)"}); tocados.push(p); }
    const v=L.find(x=>!x.local);
    if(v){ v.castigoViaje=true; v.promo=Object.assign({},v.promo||{},{motivo:"Viaje de castigo: llegan cansados"}); tocados.push(v); }
  }
  return tocados;
}
/* ---------- enganches ---------- */
(function(){
  if(typeof resolverTokens==="function" && !resolverTokens._cr){
    const orig=resolverTokens;
    resolverTokens=function(txt,Eg,extra){
      const ex=Object.assign({FX_TRAMO:textoTramo()},extra||{});
      return textoConDia(orig(txt,Eg,ex));
    };
    Object.keys(orig).forEach(k=>resolverTokens[k]=orig[k]);
    resolverTokens._cr=true;
  }
  if(typeof capituloActivo==="function" && !capituloActivo._cr){
    const orig=capituloActivo;
    capituloActivo=function(){
      const c=orig.apply(this,arguments); if(!c) return c;
      const cap=Object.assign({},c.cap,{t:textoConDia(c.cap.t),ctx:textoConDia(c.cap.ctx),
        ops:(c.cap.ops||[]).map(o=>Object.assign({},o,{t:textoConDia(o.t),d:textoConDia(o.d)}))});
      return {arco:c.arco,cap:cap};
    };
    Object.keys(orig).forEach(k=>capituloActivo[k]=orig[k]);
    capituloActivo._cr=true;
  }
  if(typeof resolverStoryline==="function" && !resolverStoryline._cr){
    const orig=resolverStoryline;
    resolverStoryline=function(op){
      const txt=efectoCalendario(op&&[op.t,op.d,op.mem].join(" "));
      const r=orig.apply(this,arguments);
      if(txt && typeof notificar==="function") notificar({t:"Calendario",tipo:"neutro",bandeja:false,d:txt});
      return r;
    };
    Object.keys(orig).forEach(k=>resolverStoryline[k]=orig[k]);
    resolverStoryline._cr=true;
  }
  if(typeof resolverDecision==="function" && !resolverDecision._cr){
    const orig=resolverDecision;
    resolverDecision=function(dec,idx){
      const op=dec&&dec.op&&dec.op[idx];
      const r=orig.apply(this,arguments);
      if(r&&op){
        let extra=efectoCalendario([op.t,op.d].join(" "));
        if(_crEsVotoANFP(dec)){
          const tipo=_crTipoVoto(op,r.tier), toc=aplicarFixtureANFP(tipo);
          if(toc.length) extra=(tipo==="favor"?"La ANFP te devuelve la mano: ":"La ANFP te pasa la cuenta: ")+
            toc.map(p=>(p.local?"de local":"de visita")+" ante "+p.rivalNombre+" ("+nombreDiaDe(p)+" "+_crFechaCorta(p.f)+(p.hora?" "+p.hora:"")+")").join("; ")+".";
        }
        if(extra){ r.extra=(r.extra?r.extra+" ":"")+extra; const h=E.decHechas&&E.decHechas[dec.id+"_"+E.anio]; if(h) h.extra=r.extra; }
      }
      return r;
    };
    Object.keys(orig).forEach(k=>resolverDecision[k]=orig[k]);
    resolverDecision._cr=true;
  }
  /* la taquilla lee la rebaja / el horario del partido */
  if(typeof taquilla==="function" && !taquilla._cr){
    const orig=taquilla;
    taquilla=function(part){
      const pr=part&&part.promo;
      if(!pr||(!pr.precio&&!pr.gente)) return orig.apply(this,arguments);
      const guard=E.precios;
      if(pr.precio){ const base=E.precios||preciosDefault(), nuevo={}; Object.keys(base).forEach(k=>nuevo[k]=Math.round(base[k]*pr.precio)); E.precios=nuevo; }
      let r;
      try{ r=orig.apply(this,arguments); } finally { E.precios=guard; }
      if(pr.gente){ const aforo=(typeof aforoActual==="function")?aforoActual():r.gente*2;
        const g=Math.min(aforo,Math.round(r.gente*pr.gente)); r={gente:g, ingreso:Math.round(r.ingreso*(g/Math.max(1,r.gente)))}; }
      return r;
    };
    Object.keys(orig).forEach(k=>taquilla[k]=orig[k]);
    taquilla._cr=true;
  }
  /* viaje de castigo: el equipo llega cansado */
  if(typeof iniciarPartido==="function" && !iniciarPartido._cr){
    const orig=iniciarPartido;
    iniciarPartido=function(part){
      const P=orig.apply(this,arguments);
      if(P&&part&&part.castigoViaje){ P.cansancio=(P.cansancio||0)+1.2;
        if(typeof linea==="function") linea(P,0,"Viaje de castigo que armó la ANFP: el equipo llega con las piernas pesadas.","grave"); }
      return P;
    };
    Object.keys(orig).forEach(k=>iniciarPartido[k]=orig[k]);
    iniciarPartido._cr=true;
  }
  /* las decisiones de horario solo aparecen si el calendario las hace posibles */
  if(typeof BOLSA!=="undefined"){
    const tv=BOLSA.find(x=>x.id==="b_tv_horario");
    if(tv) tv.cuando=function(){ return !!proximoLocalFinde(); };
    const fx=BOLSA.find(x=>x.id==="b_anfp_fixture");
    if(fx){ fx.cuando=function(Eg){ return (Eg.idx||0)>4 && !!tramoApretado(); };
      fx.d="{FX_TRAMO}. El técnico pide reclamo formal. La ANFP dice que «el fixture es el fixture»."; }
    const vt=BOLSA.find(x=>x.id==="b_anfp_voto");
    if(vt){ const c0=vt.cuando; vt.cuando=function(Eg){ return (!c0||c0(Eg)) && _crPendientes().filter(p=>p.tipo==="liga").length>=3; }; }
  }
})();
/* chip para la previa: por qué este partido tiene otro horario o precio */
function chipCalendario(part){
  if(!part||!part.promo||!part.promo.motivo) return null;
  const d=el("span","chip-cal",(part.castigoViaje?"🚌 ":"🗓 ")+escHtml(part.promo.motivo)+(part.hora?" · "+part.hora:""));
  return d;
}
