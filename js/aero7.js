"use strict";
/* ============================================================
   FUTBOLINI · aero7.js — 7.9082 · el escritorio de Windows 7 (la parte que necesita JS)
   El look vive en css/aero7.css. Acá:
   1) Cada sección (menos el Escritorio, que ES el escritorio, y PLOP!, que ya es Internet
      Explorer) se abre en su ventana de Explorador: marco de vidrio, título, y la barra de
      direcciones con atrás/adelante y la ruta «Futbolini ▸ Club ▸ Sección».
   2) Ranuras de imagen (js/data-ranuras.js): si el humano puso la imagen y la marcó lista,
      reemplaza al emoji en el menú, el dock y el fondo. Si no, queda el emoji.
   Nada de esto toca la lógica del juego: solo mueve nodos que ya pintó cada vista.
   ============================================================ */
/* secciones que viven en una ventana con paneles en columnas (el resto, una sola columna) */
const AERO7_COLUMNAS=["finanzas","institucion","mercado","vida","historia","carrera","avisos"];
/* secciones que NO se envuelven: el escritorio es el fondo; PLOP! ya es su navegador */
const AERO7_SIN_VENTANA=["escritorio","redes","ajustes","partido","full"];
const AERO7_NAV={atras:[],adelante:[],moviendo:false};

/* 7.9087 · DarkAero (tema negro) también vive en ventanas de Explorador */
function _aero7Activo(){ if(typeof document==="undefined"||!document.body) return false; const t=document.body.getAttribute("data-tema")||"aero"; return t==="aero"||t==="negro"; }
function _aero7Seccion(id){ return (typeof SECCIONES!=="undefined"&&SECCIONES.find(s=>s[0]===id))||(id==="avisos"?["avisos","🔔","Avisos"]:null); }

/* ---------- 1. ventana de Explorador por sección ---------- */
function ventanaDeSeccion(){
  const v=document.getElementById("vista");
  if(!v||!E||!_aero7Activo()) return false;
  const sec=v.dataset.sec;
  if(!sec||AERO7_SIN_VENTANA.indexOf(sec)>=0) return false;
  let win=v.querySelector(":scope > .ventana-so.in-vista");
  if(!win){
    const s=_aero7Seccion(sec); if(!s||typeof montarBarraSO!=="function") return false;
    const hijos=[].slice.call(v.childNodes);
    if(!hijos.length) return false;
    win=el("div","ventana-so in-vista sec-auto");
    const cuerpo=montarBarraSO(win,s[2]+" — "+(E.clubNombre||""),s[1],function(){ if(typeof irA==="function") irA("escritorio"); });
    hijos.forEach(n=>cuerpo.appendChild(n));
    v.appendChild(win);
  }
  win.classList.toggle("so-una-col",AERO7_COLUMNAS.indexOf(sec)<0);
  win.dataset.sec=sec;
  if(!win.querySelector(":scope > .so-dir")) barraDirecciones(win,sec);
  barraComandosVista(win);
  return true;
}
function barraDirecciones(win,sec){
  const s=_aero7Seccion(sec)||[sec,"📁",sec];
  const dir=el("div","so-dir");
  const nav=el("div","dir-nav");
  const atras=el("button","dir-b","◀"), adel=el("button","dir-b","▶");
  atras.type=adel.type="button"; atras.title="Atrás"; adel.title="Adelante";
  atras.setAttribute("aria-label","Atrás"); adel.setAttribute("aria-label","Adelante");
  atras.disabled=!AERO7_NAV.atras.length; adel.disabled=!AERO7_NAV.adelante.length;
  atras.onclick=function(){ aero7Navegar(-1); }; adel.onclick=function(){ aero7Navegar(1); };
  nav.appendChild(atras); nav.appendChild(adel); dir.appendChild(nav);
  const ruta=el("div","dir-ruta");
  ruta.appendChild(el("span","ic","🖥️"));
  const miga=(txt,fn)=>{ const b=el("button",null,escHtml(txt)); b.type="button"; b.onclick=fn; ruta.appendChild(b); ruta.appendChild(el("span","sep","▶")); };
  miga("Futbolini",()=>irA("escritorio"));
  miga(E.clubNombre||"Club",()=>irA("escritorio"));
  ruta.appendChild(el("b",null,escHtml(s[2])));
  dir.appendChild(ruta);
  const barra=win.querySelector(":scope > .so-barra");
  if(barra) barra.insertAdjacentElement("afterend",dir); else win.insertBefore(dir,win.firstChild);
}
/* 7.9087 · barra de comandos de Vista (la franja negra brillante del Explorador): un botón por panel de la
   sección que te lleva a él. Es navegación de verdad, no adorno. */
function barraComandosVista(win){
  const cu=win._cuerpo||win.querySelector(".so-cuerpo"); if(!cu) return;
  let cmd=win.querySelector(":scope > .so-cmd");
  const paneles=[].slice.call(cu.querySelectorAll(":scope > .panel, :scope > * > .panel")).filter(p=>p.querySelector(":scope > .cab"));
  if(paneles.length<3){ if(cmd) cmd.remove(); return; }
  if(!cmd){ cmd=el("div","so-cmd"); cu.insertAdjacentElement("beforebegin",cmd); }
  cmd.innerHTML="";
  paneles.slice(0,8).forEach(p=>{
    const sp=p.querySelectorAll(":scope > .cab > span"), t=sp.length?sp[sp.length-1].textContent.trim():"";
    if(!t) return;
    const b=el("button","so-cmd-b",escHtml(t.length>22?t.slice(0,21)+"…":t)); b.type="button"; b.title=t;
    b.onclick=()=>{ try{ p.scrollIntoView({block:"start",behavior:document.body.classList.contains("anim-off")?"auto":"smooth"}); window.scrollBy(0,-70); }catch(e){} };
    cmd.appendChild(b);
  });
}
/* historial de atrás/adelante: lo alimenta irA */
function aero7Navegar(paso){
  const de=paso<0?AERO7_NAV.atras:AERO7_NAV.adelante, a=paso<0?AERO7_NAV.adelante:AERO7_NAV.atras;
  if(!de.length) return;
  a.push(SEC);
  AERO7_NAV.moviendo=true;
  try{ irA(de.pop()); } finally { AERO7_NAV.moviendo=false; }
}

/* ---------- 2. ranuras de imagen ---------- */
function ranuraLista(id){
  if(typeof RANURAS_IMG==="undefined") return null;
  const r=RANURAS_IMG.find(x=>x.id===id);
  return r&&r.listo?r:null;
}
function imgRanura(id,alt){
  const r=ranuraLista(id); if(!r) return null;
  const im=document.createElement("img");
  im.className="ranura-img"; im.src=r.archivo; im.alt=alt||""; im.decoding="async";
  /* si el archivo no carga (lo marcaron listo y no está), vuelve el emoji */
  im.onerror=function(){ const p=im.parentNode; if(p&&im.dataset.emoji!=null) p.textContent=im.dataset.emoji; };
  return im;
}
function _ponerIcono(span,id){
  if(!span||span.querySelector(".ranura-img")) return;
  const im=imgRanura(id); if(!im) return;
  im.dataset.emoji=span.textContent; span.textContent=""; span.appendChild(im);
}
function aero7Iconos(){
  if(typeof SECCIONES==="undefined") return;
  const porNombre={}; SECCIONES.forEach(s=>porNombre[s[2]]=s[0]);
  document.querySelectorAll("#menu .mi").forEach(b=>{
    const sp=b.querySelectorAll(":scope > span"); if(sp.length<2) return;
    const id=porNombre[sp[1].textContent.trim()]; if(id) _ponerIcono(sp[0],"sec-"+id);
  });
  document.querySelectorAll(".dock-tab").forEach(b=>{
    const ic=b.querySelector(".ic"), n=b.querySelector(".ic + span"); if(!ic||!n) return;
    const id=porNombre[n.textContent.trim()]; if(id) _ponerIcono(ic,"sec-"+id);
  });
}
function aero7Fondo(){
  if(!document.body) return;
  const r=ranuraLista("fondo");
  document.body.classList.toggle("fondo-propio",!!r);
  if(r) document.body.style.setProperty("--fondo-propio",'url("'+r.archivo+'")');
}

/* ---------- enganches ---------- */
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._a7) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._a7=true; w._orig=o; window[nom]=w; };
  /* 7.9087 · al entrar a otra sección las barras se llenan (clase un momento; el CSS la ignora con Animaciones OFF) */
  let _secLlenada=null, _tLlenar=null;
  function barrasLlenar(){
    const v=document.getElementById("vista"); if(!v||!E) return;
    const sec=v.dataset.sec; if(sec===_secLlenada) return;
    _secLlenada=sec; v.classList.add("llenando");
    clearTimeout(_tLlenar); _tLlenar=setTimeout(()=>{ const x=document.getElementById("vista"); if(x) x.classList.remove("llenando"); },1000);
  }
  window.barrasLlenar=barrasLlenar;
  envolver("render",o=>function(){ const r=o.apply(this,arguments);
    try{ barrasLlenar(); }catch(e){}
    try{ if(ventanaDeSeccion()&&typeof marcarVistaConVentana==="function") marcarVistaConVentana(); aero7Iconos(); }catch(e){ console.error("aero7:",e); }
    return r; });
  /* el historial se anota ANTES de pintar: así el botón Atrás ya sabe que hay adónde volver */
  envolver("irA",o=>function(s){
    try{ if(!AERO7_NAV.moviendo&&s&&s!==SEC&&s!=="ajustes"&&SEC){ AERO7_NAV.atras.push(SEC); if(AERO7_NAV.atras.length>30) AERO7_NAV.atras.shift(); AERO7_NAV.adelante.length=0; } }catch(e){}
    return o.apply(this,arguments); });
  ["pintarMenu","pintarDock"].forEach(n=>envolver(n,o=>function(){ const r=o.apply(this,arguments); try{ aero7Iconos(); }catch(e){} return r; }));
  if(typeof document!=="undefined"){
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",aero7Fondo); else aero7Fondo();
  }
})();
