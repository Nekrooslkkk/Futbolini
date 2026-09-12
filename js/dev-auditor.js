"use strict";
/* ============================================================
   FUTBOLINI · dev-auditor.js  (motor de edición · parte 2 de 3)
   MIDE EL RIGOR. Recorre el ESQUEMA_CLUB y dice, por club, qué tiene y qué
   le falta para estar al nivel de Colo-Colo. Lo mismo por liga.

   Uso rápido (consola o modo dev):
     auditarClub("CAL")      → {pct, faltan:[...], tiene:[...]}
     auditarLiga("2026c")    → resumen de la Segunda
     auditarTodo()           → todas las ligas, peor primero
     devFaltanCampo("gloria")→ qué clubes no tienen época dorada

   No modifica nada. Solo lee.
   ============================================================ */

var DEV_CLUB_REF="CC";   /* la vara: Colo-Colo */

/* ids de una liga registrada (era) */
function devIdsLiga(era){
  try{
    var L=(typeof LIGAS!=="undefined")?LIGAS[era]:null;
    if(L&&L.length) return L.map(function(c){ return c.id; });
  }catch(e){}
  return [];
}
/* todas las eras que son ligas jugables */
function devErasLiga(){
  var out=[];
  try{ if(typeof LIGAS==="object") Object.keys(LIGAS).forEach(function(k){ if(devIdsLiga(k).length) out.push(k); }); }catch(e){}
  return out;
}

/* auditoría de UN club */
function auditarClub(id){
  var tiene=[], faltan=[], extra=[], justi=[], reqTot=0, reqOk=0;
  ESQUEMA_CLUB.forEach(function(c){
    var v=null;
    try{ v=c.get(id); }catch(e){ v=null; }
    var hay=(v!=null);
    var motivo=(!hay && typeof devJustificado==="function")?devJustificado(id,c.k):null;
    if(motivo){ justi.push({k:c.k,n:c.n,motivo:motivo}); return; }   /* no cuenta ni a favor ni en contra */
    if(c.req){ reqTot++; if(hay) reqOk++; }
    (hay?(c.req?tiene:extra):faltan).push({k:c.k, n:c.n, grupo:c.grupo, req:!!c.req});
  });
  return {
    id:id,
    pct: reqTot?Math.round(reqOk/reqTot*100):0,
    reqOk:reqOk, reqTot:reqTot,
    tiene:tiene, faltan:faltan, extra:extra, justificados:justi,
    faltanReq: faltan.filter(function(f){ return f.req; })
  };
}

/* auditoría de una liga entera */
function auditarLiga(era){
  var ids=devIdsLiga(era), fichas=ids.map(auditarClub);
  var suma=fichas.reduce(function(s,f){ return s+f.pct; },0);
  /* qué campo falta más seguido en esta liga */
  var cuenta={};
  fichas.forEach(function(f){ f.faltanReq.forEach(function(x){ cuenta[x.k]=(cuenta[x.k]||0)+1; }); });
  var huecos=Object.keys(cuenta).map(function(k){ return {k:k, n:(devCampo(k)||{}).n||k, cuantos:cuenta[k]}; })
    .sort(function(a,b){ return b.cuantos-a.cuantos; });
  return {
    era:era,
    nombre:((typeof ERA!=="undefined"&&ERA[era]&&ERA[era].n)||String(era)),
    clubes:ids.length,
    pct: ids.length?Math.round(suma/ids.length):0,
    huecos:huecos,
    fichas:fichas.sort(function(a,b){ return a.pct-b.pct; })
  };
}

/* todas las ligas, de peor a mejor */
function auditarTodo(){
  return devErasLiga().map(auditarLiga).sort(function(a,b){ return a.pct-b.pct; });
}

/* definición de un campo por clave */
function devCampo(k){
  for(var i=0;i<ESQUEMA_CLUB.length;i++) if(ESQUEMA_CLUB[i].k===k) return ESQUEMA_CLUB[i];
  return null;
}
/* qué clubes (de todas las ligas) NO tienen cierto campo */
function devFaltanCampo(k){
  var c=devCampo(k); if(!c) return [];
  var vistos={}, out=[];
  devErasLiga().forEach(function(era){
    devIdsLiga(era).forEach(function(id){
      if(vistos[id]) return; vistos[id]=1;
      var v=null; try{ v=c.get(id); }catch(e){}
      if(v==null) out.push(id);
    });
  });
  return out;
}

/* auditoría de una liga a nivel TORNEO (no de clubes) */
function auditarFormato(era){
  var faltan=[], tiene=[];
  ESQUEMA_LIGA.forEach(function(c){
    var v=null; try{ v=c.get(era); }catch(e){}
    (v!=null?tiene:faltan).push({k:c.k, n:c.n});
  });
  return {era:era, pct:Math.round(tiene.length/(tiene.length+faltan.length)*100), tiene:tiene, faltan:faltan};
}

/* informe en texto plano (consola o para pegar) */
function devInforme(){
  var L=[], todo=auditarTodo();
  L.push("═══ RIGOR DE FUTBOLINI · vara = "+DEV_CLUB_REF+" ═══");
  todo.forEach(function(r){
    L.push("");
    L.push("▸ "+r.nombre+"  ["+r.era+"]  "+r.pct+"%  ("+r.clubes+" clubes)");
    var f=auditarFormato(r.era);
    if(f.faltan.length) L.push("   formato incompleto: "+f.faltan.map(function(x){return x.n;}).join(", "));
    r.huecos.slice(0,6).forEach(function(h){ L.push("   falta "+h.n+" en "+h.cuantos+" clubes"); });
    var peores=r.fichas.slice(0,3).map(function(x){ return x.id+" "+x.pct+"%"; }).join(" · ");
    if(peores) L.push("   peores: "+peores);
  });
  return L.join("\n");
}
