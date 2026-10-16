"use strict";
/* ============================================================
   FUTBOLINI · estrellas.js — LAS ESTRELLAS DE CADA TEMPORADA (7.9136)
   Pedido del autor: "me gusta el sistema final de balance, pero quiero mejorarlo añadiendo puntos al juego: 3 estrellas
   (metas simples) y 5 estrellas chicas que son puntos del juego. Si ganas todo de todo obtienes el juego maestro; si
   pierdes un partido y una copa quizás sacas 3 de las chicas. Que la gente busque puntuaciones altas (revisado cada
   temporada)".

   - 3 ESTRELLAS GRANDES (metas simples): 🎯 la meta del directorio · 🏆 un título o el ascenso · 💚 el club sano (caja en
     positivo y la deuda no creció en el año). Si GANAS TODO (la liga y todas las copas que jugaste) las 3 se prenden sí o sí.
   - 5 ESTRELLAS CHICAS (los puntos del juego): ⚽ 60 % de los puntos · 🥅 diferencia de gol a favor · 📣 la hinchada
     terminó más arriba que empezó · 🌱 un sub-21 jugó 3 partidos completos · 🧱 el camarín terminó en pie (moral ≥ 60).
   - TEMPORADA PERFECTA = las 3 grandes. JUEGO MAESTRO = ganaste todo y las 8 estrellas.
   - PUNTAJE: 300 por grande + 100 por chica + 150 por título + 500 el juego maestro. Se suma en la carrera (E.estrellas) y
     los mejores quedan como RÉCORDS de este navegador (sirven para picarse; no salen de tu equipo).
   Se mide con lo que el juego ya sabe (E.temporada, E.titulos, la evaluación del directorio): no se inventa nada.
   ============================================================ */
const ESTRELLAS_GRANDES=[
  {id:"meta",   ic:"🎯", n:"La meta del directorio",  d:"Cumpliste lo que te pidieron"},
  {id:"titulo", ic:"🏆", n:"Un título o el ascenso",   d:"Levantaste una copa, saliste campeón o subiste"},
  {id:"sano",   ic:"💚", n:"El club sano",             d:"Caja en positivo y la deuda no creció en el año"}
];
const ESTRELLAS_CHICAS=[
  {id:"puntos",  ic:"⚽", n:"Puntos",   d:"60 % de los puntos en juego"},
  {id:"goles",   ic:"🥅", n:"Goles",    d:"Diferencia de gol a favor"},
  {id:"hinchada",ic:"📣", n:"Hinchada", d:"La hinchada terminó más arriba que empezó"},
  {id:"cantera", ic:"🌱", n:"Cantera",  d:"Un sub-21 jugó al menos 3 partidos completos"},
  {id:"camarin", ic:"🧱", n:"Camarín",  d:"El camarín terminó en pie (moral 60 o más)"}
];
const ESTRELLAS_PUNTAJE={grande:300, chica:100, titulo:150, maestro:500};
const ESTRELLAS_RECORDS="futbolini_records";

/* foto del club al empezar la temporada (para medir lo que cambió) */
function estrellasFotoInicio(){
  if(typeof E==="undefined"||!E) return;
  E.estrellasIni={anio:E.anio, plata:Math.round(E.plata||0), deuda:Math.round(E.deuda||0),
    hinchada:Math.round((E.ind&&E.ind.hinchada)||0), moral:Math.round((E.ind&&E.ind.moral)||0)};
}
function _estTitulosDe(anio){ return ((E&&E.titulos)||[]).filter(t=>String(t).indexOf(anio+" · ")===0); }
/* ¿ganó todo? la liga y cada copa que jugó este año */
function _estGanoTodo(res,tit){
  if(!res||!res.campeon) return false;
  const copas={}; ((E&&E.calendario)||[]).forEach(p=>{ if(p&&p.tipo==="copa"&&p.torneo) copas[p.torneo]=true; });
  return Object.keys(copas).every(c=>tit.some(t=>{ const x=String(t).toLowerCase(), y=c.toLowerCase(); return x.indexOf(y)>=0||y.indexOf(x.split(" · ")[1]||"#")>=0; }));
}
/* el cálculo, puro: recibe lo que dejó finDeTemporada (res) y lee E. Devuelve las 8 estrellas con su porqué */
function estrellasTemporada(res){
  res=res||{};
  const t=(E&&E.temporada)||{}, ini=(E&&E.estrellasIni&&E.estrellasIni.anio===E.anio)?E.estrellasIni:null;
  const tit=_estTitulosDe(E.anio), ind=(E&&E.ind)||{};
  const nivel=res.ev&&res.ev.nivel, ascendio=!!(res.asc&&res.asc.tipo==="ascenso");
  const todo=_estGanoTodo(res,tit);
  const g={
    meta: nivel==="cumplido"||nivel==="excelente",
    titulo: !!(res.campeon||res.copa||tit.length||ascendio),
    sano: (E.plata||0)>=0&&(ini?(E.deuda||0)<=ini.deuda+1:(E.deuda||0)<=0)
  };
  if(todo){ g.meta=true; g.titulo=true; g.sano=true; }   /* ganarlo todo enciende las tres sí o sí */
  const pj=t.pj||0, sub21=((E&&E.plantel)||[]).filter(j=>(j.edad||99)<=21&&(j.minutosTemporada||0)>=270);
  const c={
    puntos: pj>0&&(t.pts||0)>=pj*3*0.6,
    goles: (t.gf||0)>(t.gc||0),
    hinchada: ini?(ind.hinchada||0)>ini.hinchada:(ind.hinchada||0)>=80,
    cantera: sub21.length>0,
    camarin: (ind.moral||0)>=60
  };
  const nG=ESTRELLAS_GRANDES.filter(x=>g[x.id]).length, nC=ESTRELLAS_CHICAS.filter(x=>c[x.id]).length;
  const maestro=todo&&nG===3&&nC===5;
  const P=ESTRELLAS_PUNTAJE, puntaje=nG*P.grande+nC*P.chica+tit.length*P.titulo+(maestro?P.maestro:0);
  return {anio:E.anio, club:E.club, clubNombre:E.clubNombre||E.club, grandes:g, chicas:c, nGrandes:nG, nChicas:nC,
    ganoTodo:todo, perfecta:nG===3, maestro:maestro, titulos:tit.length, titulosNom:tit.map(x=>String(x).split(" · ").slice(1).join(" · ")), puntaje:puntaje,
    detalle:{pts:t.pts||0, pj:pj, gf:t.gf||0, gc:t.gc||0, sub21:sub21.slice(0,2).map(j=>j.n)}};
}
/* se anota una vez por temporada (en la partida y en los récords del navegador) */
function estrellasAnotar(r){
  if(!r||!E) return r;
  E.estrellas=E.estrellas||[];
  if(E.estrellas.some(x=>x.anio===r.anio&&x.club===r.club)) return r;
  E.estrellas.push({anio:r.anio, club:r.club, g:r.nGrandes, c:r.nChicas, puntaje:r.puntaje, maestro:r.maestro, perfecta:r.perfecta});
  if(E.cronica&&E.cronica[0]&&E.cronica[0].anio===r.anio) E.cronica[0].estrellas={g:r.nGrandes,c:r.nChicas,puntaje:r.puntaje,maestro:r.maestro};
  if(!(E.flags&&E.flags.modoDiosUsado)&&!E._bulkSim) estrellasRecord(r);   /* lo simulado al por mayor no es récord: se juega */
  if(r.maestro&&typeof desbloquear==="function") try{ desbloquear("juego_maestro"); }catch(e){}
  return r;
}
function estrellasCarrera(){ const L=(E&&E.estrellas)||[]; return {temporadas:L.length, puntaje:L.reduce((s,x)=>s+(x.puntaje||0),0),
  grandes:L.reduce((s,x)=>s+(x.g||0),0), chicas:L.reduce((s,x)=>s+(x.c||0),0), maestros:L.filter(x=>x.maestro).length, perfectas:L.filter(x=>x.perfecta).length}; }
function estrellasRecords(){ try{ const v=JSON.parse(localStorage.getItem(ESTRELLAS_RECORDS)||"[]"); return Array.isArray(v)?v:[]; }catch(e){ return []; } }
function estrellasRecord(r){
  try{ const L=estrellasRecords(); L.push({club:r.clubNombre, anio:r.anio, puntaje:r.puntaje, g:r.nGrandes, c:r.nChicas, maestro:r.maestro, f:Date.now()});
    L.sort((a,b)=>b.puntaje-a.puntaje); localStorage.setItem(ESTRELLAS_RECORDS,JSON.stringify(L.slice(0,10))); }catch(e){}
}
/* ---------- cómo se ve ---------- */
function _estFila(lista,ok,grande){
  const f=el("div","est-fila"+(grande?" grandes":" chicas"));
  lista.forEach(x=>{ const on=!!ok[x.id];
    const s=el("div","est "+(on?"on":"off"),'<span class="est-ic">'+(on?"★":"☆")+'</span><span class="est-n">'+x.ic+" "+x.n+'</span>');
    s.title=x.d+(on?" ✓":" — esta vez no"); f.appendChild(s); });
  return f;
}
function bloqueEstrellas(r,opts){
  opts=opts||{};
  const b=el("div","est-box"+(r.maestro?" maestro":(r.perfecta?" perfecta":"")));
  const tit=r.maestro?"👑 JUEGO MAESTRO":(r.perfecta?"✨ Temporada perfecta":(opts.envivo?"⭐ Las estrellas de "+r.anio+" (van así)":"⭐ Las estrellas de "+r.anio));
  b.appendChild(el("div","est-tit",tit+' <span class="est-pts">'+r.puntaje.toLocaleString("es-CL")+" pts</span>"));
  b.appendChild(_estFila(ESTRELLAS_GRANDES,r.grandes,true));
  b.appendChild(_estFila(ESTRELLAS_CHICAS,r.chicas,false));
  const falta=ESTRELLAS_GRANDES.filter(x=>!r.grandes[x.id]).concat(ESTRELLAS_CHICAS.filter(x=>!r.chicas[x.id]));
  if(falta.length&&!opts.envivo) b.appendChild(el("p","mini","Te faltó: "+falta.map(x=>x.ic+" "+x.d.toLowerCase()).join(" · ")+"."));
  if(opts.envivo&&falta.length) b.appendChild(el("p","mini","Para la próxima estrella: "+falta[0].ic+" "+falta[0].d.toLowerCase()+"."));
  if(r.titulosNom&&r.titulosNom.length) b.appendChild(el("p","mini","🏆 "+r.titulosNom.map(escHtml).join(" · ")));
  if(!opts.envivo){ const k=estrellasCarrera(), rec=estrellasRecords()[0];
    if(!((E&&E.estrellas)||[]).some(x=>x.anio===r.anio&&x.club===r.club)){ k.puntaje+=r.puntaje; k.temporadas++; if(r.maestro) k.maestros++; }   /* la que se está cerrando cuenta */
    b.appendChild(el("p","mini","Carrera: "+k.puntaje.toLocaleString("es-CL")+" pts en "+k.temporadas+" temporada"+(k.temporadas!==1?"s":"")+
      (k.maestros?" · 👑 "+k.maestros+" juego"+(k.maestros>1?"s":"")+" maestro":"")+(rec?" · récord del navegador: "+rec.puntaje.toLocaleString("es-CL")+" ("+escHtml(rec.club)+" "+rec.anio+")":"")+".")); }
  return b;
}
/* ---------- enganches: foto al empezar, estrellas en el Balance, anotadas al pasar de año, y en el Escritorio ---------- */
(function(){
  const envolver=(nom,antes,despues)=>{ const o=window[nom]; if(typeof o!=="function"||o._est) return;
    const w=function(){ try{ if(antes) antes.apply(this,arguments); }catch(e){} const r=o.apply(this,arguments); try{ if(despues) despues(r,arguments); }catch(e){} return r; };
    Object.keys(o).forEach(k=>w[k]=o[k]); w._est=true; window[nom]=w; };
  const instalar=()=>{
    envolver("finDeTemporada",null,function(r){ if(E&&r) E._estRes={anio:E.anio, campeon:!!r.campeon, copa:!!r.copa, ev:{nivel:r.ev&&r.ev.nivel}, asc:r.asc?{tipo:r.asc.tipo}:null}; });
    envolver("nuevoAnio",function(){ if(E&&E._estRes&&E._estRes.anio===E.anio) estrellasAnotar(estrellasTemporada(E._estRes)); },function(){ estrellasFotoInicio(); });
    envolver("nuevaPartida",null,function(){ estrellasFotoInicio(); });
    envolver("cerrarTemporada",null,function(){
      if(!E||!E._estRes) return; const r=estrellasTemporada(E._estRes);
      const caja=document.querySelector("#capa-modal .modal"), h2=caja&&caja.querySelector("h2.tit");
      if(h2&&h2.parentNode) h2.parentNode.insertBefore(bloqueEstrellas(r),h2.nextSibling); });
    envolver("vistaEscritorio",null,function(){
      if(!E||!E.temporada||!(E.temporada.pj>0)) return; const col=document.querySelector("#vista .esc-aero > div:last-child"); if(!col) return;
      const p=panel("Estrellas de la temporada","⭐"); p.cuerpo.appendChild(bloqueEstrellas(estrellasTemporada(Object.assign({},estrellasEnVivo())),{envivo:true})); col.appendChild(p); });
  };
  instalar();
  if(typeof document!=="undefined") document.addEventListener("DOMContentLoaded",function(){ setTimeout(instalar,0); });
})();
/* a mitad de temporada: cómo vas (la meta según el directorio hoy; el título si ya levantaste algo) */
function estrellasEnVivo(){
  let nivel=null;
  try{ if(Array.isArray(E.objetivos)&&typeof progresoObjetivo==="function"){ const L=E.objetivos.map(o=>progresoObjetivo(o)); nivel=L.length&&L.every(x=>x.cumplido||x.estado!=="riesgo")?"cumplido":"riesgo"; } }catch(e){}
  let campeon=false; try{ campeon=typeof posicionEnTabla==="function"&&posicionEnTabla()===1; }catch(e){}
  return {campeon:campeon, copa:!!(E.flags&&E.flags.copaCampeon), ev:{nivel:nivel}, asc:null};
}
if(typeof document!=="undefined"&&!document.getElementById("css-estrellas")){
  const st=document.createElement("style"); st.id="css-estrellas";
  st.textContent=
    ".est-box{margin:8px 0 10px;padding:10px 12px;border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,.75),rgba(225,238,252,.7));border:1px solid rgba(60,110,170,.3)}"+
    ".est-box.perfecta{border-color:#d9a400;box-shadow:0 0 0 2px rgba(255,200,0,.25) inset}"+
    ".est-box.maestro{background:linear-gradient(180deg,#fff7d6,#ffe08a);border-color:#c48a00;box-shadow:0 0 18px rgba(255,190,0,.45)}"+
    ".est-tit{font-weight:800;font-size:15px;margin-bottom:6px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}"+
    ".est-pts{font-variant-numeric:tabular-nums;color:#1d4f8f}"+
    ".est-fila{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0}"+
    ".est{display:flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;background:rgba(0,0,0,.05);font-size:12px;line-height:1.2}"+
    ".est .est-ic{font-size:15px;color:#9aa3ad}.est.on .est-ic{color:#f2b400;text-shadow:0 0 6px rgba(255,190,0,.7)}"+
    ".est-fila.grandes .est{font-size:13px;padding:6px 10px}.est-fila.grandes .est-ic{font-size:22px}"+
    ".est.on{background:rgba(255,205,40,.18)}.est.off{opacity:.62}";
  document.head.appendChild(st);
}
