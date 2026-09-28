"use strict";
/* ============================================================
   FUTBOLINI · extranjeros.js — 7.9095 · cupo de extranjeros (nacional ≠ extranjero en el mercado)
   Pedido del autor (fase A de CHECKLIST_8): "cupo de extranjeros y diferencia real nacional/extranjero".
   Regla real (Bases ANFP 2026, anfp.cl): Primera inscribe hasta 6 extranjeros y cita hasta 5 por partido;
   Primera B inscribe hasta 5. Segunda: no está en las fuentes revisadas → ESTIMADO (se dice en pantalla).
   Épocas viejas: aproximado (en los 90 el cupo chileno rondaba los 3).
   Qué cambia en el juego:
   · Fichar un extranjero con el cupo lleno no se puede: hay que liberar uno (vender, ceder o no renovar).
     Un preacuerdo con un extranjero espera a que haya cupo (no se pierde).
   · En el mercado cada extranjero lleva 🌎 y arriba se ve "Extranjeros 4/6".
   · Si la partida ya viene con más de la cuenta (planteles reales), nadie se va: solo no entran más.
   Extranjero = rasgo "extranjero" de los datos (ya lo traen ~500 jugadores reales).
   ============================================================ */
const CUPO_EXT={
  2026:     {inscritos:6, citados:5, fuente:"Bases Primera División 2026 (ANFP)", aprox:false},
  "2026b":  {inscritos:5, citados:5, fuente:"Bases Primera B 2026 (ANFP)", aprox:false},
  "2026c":  {inscritos:4, citados:4, fuente:"estimado (las bases de Segunda no se revisaron)", aprox:true},
  arg2026:  {inscritos:6, citados:5, fuente:"aproximado (reglamento LPF)", aprox:true}
};
function _paisLiga(){ return (E&&E.eraBase==="arg2026")?"arg":"chi"; }
/* extranjero = trae el rasgo (planteles chilenos) o juega en la liga de otro país (un jugador de River para un club chileno) */
function esExtranjero(j){
  if(!j) return false;
  if(j.clubId&&typeof esClubArg==="function"&&E&&(E.anio|0)>=2010){
    const pais=esClubArg(j.clubId)?"arg":"chi";
    if(pais!==_paisLiga()) return true;
  }
  return !!(j.rasgos&&j.rasgos.indexOf("extranjero")>=0);
}
function cupoExtranjeros(){
  if(!E) return null;
  const c=CUPO_EXT[E.eraBase]||CUPO_EXT[String(E.eraBase)];
  if(c) return c;
  const a=parseInt(E.anio,10)||2026;
  return {inscritos:a<2000?3:(a<2015?5:6), citados:a<2000?3:5, fuente:"aproximado para la época", aprox:true};
}
function extranjerosPlantel(){ return (E&&E.plantel||[]).filter(j=>!j.vendido&&!j.cedido&&esExtranjero(j)); }
/* ¿puede entrar este jugador? {ok, txt} */
function cupoPermite(j){
  if(!esExtranjero(j)) return {ok:true};
  const c=cupoExtranjeros(); if(!c) return {ok:true};
  const n=extranjerosPlantel().length;
  if(n<c.inscritos) return {ok:true};
  return {ok:false, txt:"Cupo de extranjeros lleno ("+n+"/"+c.inscritos+"). Para inscribir a "+j.n+" tienes que liberar uno: vender, ceder o dejar ir a un extranjero."};
}
function etiquetaCupo(){
  const c=cupoExtranjeros(); if(!c) return "";
  const n=extranjerosPlantel().length;
  return "🌎 Extranjeros "+n+"/"+c.inscritos+(c.citados<c.inscritos?" (máx. "+c.citados+" por partido)":"")+(c.aprox?" · "+c.fuente:"");
}
/* ---------- citados por partido (Primera: 6 inscritos, 5 citados) ----------
   Los citados son la lista entera del partido (once + banca). Si hay más extranjeros que el tope, sale el que
   menos rinde y entra el mejor nacional de su puesto (o el mejor nacional que haya). */
function topeCitadosExt(){ const c=cupoExtranjeros(); return c?c.citados:99; }
function _extScore(j){ return (typeof scoreOnce==="function")?scoreOnce(j):(j.nivel||0); }
function ajustarOnceCupo(once){
  const tope=topeCitadosExt(), fuera=[];
  if(!once||once.filter(esExtranjero).length<=tope){ ajustarOnceCupo.fuera=fuera; return once; }
  const out=once.slice(), disp=(typeof dispPlantel==="function")?dispPlantel():[];
  const exts=out.filter(esExtranjero).sort((a,b)=>_extScore(a)-_extScore(b));
  let sobran=exts.length-tope;
  for(const j of exts){
    if(sobran<=0) break;
    const libres=disp.filter(x=>out.indexOf(x)<0&&!esExtranjero(x));
    const r=libres.filter(x=>x.pos===j.pos).sort((a,b)=>_extScore(b)-_extScore(a))[0]
          ||(j.pos!=="ARQ"?libres.filter(x=>x.pos!=="ARQ").sort((a,b)=>_extScore(b)-_extScore(a))[0]:null);
    if(!r) continue;
    out[out.indexOf(j)]=r; fuera.push(j.n); sobran--;
  }
  ajustarOnceCupo.fuera=fuera;
  return out;
}
function ajustarListaCupo(lista,nOnce){
  const tope=topeCitadosExt();
  if(!lista||lista.filter(esExtranjero).length<=tope) return lista;
  const once=lista.slice(0,nOnce), banca=lista.slice(nOnce);
  let libres=Math.max(0,tope-once.filter(esExtranjero).length);
  const nueva=[];
  banca.forEach(j=>{ if(!esExtranjero(j)) nueva.push(j); else if(libres>0){ nueva.push(j); libres--; } });
  const usados=once.concat(nueva);
  const disp=((typeof dispPlantel==="function")?dispPlantel():[]).filter(x=>usados.indexOf(x)<0&&!esExtranjero(x)).sort((a,b)=>_extScore(b)-_extScore(a));
  /* banca automática: el hueco lo llena el mejor nacional. Banca manual: se respeta tu elección y el hueco queda
     vacío (no se mete a nadie que dejaste afuera a propósito). */
  const manual=!!(E&&E.tactica&&Array.isArray(E.tactica.bancaManual)&&E.tactica.bancaManual.length);
  while(!manual&&nueva.length<banca.length&&disp.length) nueva.push(disp.shift());
  return once.concat(nueva);
}
/* quién queda fuera de la lista del partido por el cupo (texto corto, vacío si nadie) */
function resumenCupoPartido(){
  if(!E||typeof listaIdeal!=="function"||!listaIdeal._orig||!onceIdeal._orig) return "";
  const sin=listaIdeal._orig(onceIdeal._orig()), con=listaIdeal();
  const fuera=sin.filter(j=>esExtranjero(j)&&con.indexOf(j)<0);
  return fuera.length?"fuera por el tope de "+topeCitadosExt()+" citados: "+fuera.map(j=>j.n).join(", "):"";
}
/* ---------- enganches ---------- */
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._ext) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._ext=true; w._orig=o; window[nom]=w; };
  /* negociar con un extranjero sin cupo: se avisa antes de gastar tiempo */
  envolver("modalComprar",o=>function(j){
    const p=cupoPermite(j);
    if(!p.ok){ if(typeof aviso==="function") aviso(p.txt,5000); return null; }
    return o.apply(this,arguments);
  });
  /* el preacuerdo espera cupo: no se cobra ni se pierde */
  envolver("ejecutarPreacuerdo",o=>function(pa){
    const p=pa&&pa.j?cupoPermite(pa.j):{ok:true};
    if(!p.ok){ if(typeof notificar==="function") notificar({t:"El trato de "+pa.j.n+" espera cupo",tipo:"malo",d:p.txt+" El preacuerdo sigue vivo."}); return false; }
    return o.apply(this,arguments);
  });
  /* última barrera (cualquier otro camino que fiche): no se inscribe sobre el cupo */
  envolver("cerrarFichaje",o=>function(j){
    const p=cupoPermite(j);
    if(!p.ok){ if(typeof notificar==="function") notificar({t:"No se pudo inscribir a "+j.n,tipo:"malo",d:p.txt}); return Object.assign({},j,{_sinCupo:true}); }
    const ext=esExtranjero(j), nuevo=o.apply(this,arguments);
    /* al firmar se pierde el club de origen: el rasgo queda para que siga contando en el cupo */
    if(ext&&nuevo&&!(nuevo.rasgos&&nuevo.rasgos.indexOf("extranjero")>=0)) nuevo.rasgos=(nuevo.rasgos||[]).concat(["extranjero"]);
    return nuevo;
  });
  /* nadie entra a la cancha ni a la banca sobre el tope de citados */
  envolver("onceIdeal",o=>function(){ const r=o.apply(this,arguments); try{ return ajustarOnceCupo(r); }catch(e){ return r; } });
  envolver("listaIdeal",o=>function(once){ const r=o.apply(this,arguments); try{ return ajustarListaCupo(r,(once||[]).length||11); }catch(e){ return r; } });
  /* la previa avisa si el cupo deja a alguien importante afuera */
  envolver("checklistPrevia",o=>function(){ const r=o.apply(this,arguments); try{ const fu=resumenCupoPartido(); if(fu&&Array.isArray(r)) r.push({warn:true,ok:false,t:"Cupo de extranjeros",d:"Hoy "+fu+". Solo "+topeCitadosExt()+" extranjeros por partido (Bases ANFP)."}); }catch(e){} return r; });
  /* el mercado muestra el cupo arriba de la lista */
  envolver("pintarResultadosMercado",o=>function(box){
    const r=o.apply(this,arguments);
    try{ const t=etiquetaCupo(); if(t&&box){ const d=el("p","mini merc-cupo",escHtml(t)); box.insertBefore(d,box.firstChild); } }catch(e){}
    return r;
  });
})();
