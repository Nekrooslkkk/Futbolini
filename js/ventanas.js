"use strict";
/* ============================================================
   FUTBOLINI 7.99958 · ventanas.js
   Chrome Aero: css/so.css (plan A) + css/vendor/7-window.css (el 7.css
   REAL, vendorizado LOCAL, MIT). Antes se pedía a unpkg; ahora vive en el
   repo → la ventana Aero real existe OFFLINE, sin depender de la red.
   Solo el chrome de ventana (no pinta `button` global, que rompía el juego).
   [Claude, coordinado con Grok en GROK_CAZA.md]
   7.99958: el vidrio Vista (.window / .window-body / cdn-7) SOLO en Aero.
   Negro/claro/insano no heredan el cliente blanco de 7.css.
   ============================================================ */

const AERO_7_WINDOW="css/vendor/7-window.css";   /* local, MIT, offline */

function temaActual(){
  if(typeof document==="undefined" || !document.body) return "aero";
  return document.body.getAttribute("data-tema") || document.body.dataset.tema || "aero";
}
function esAero(){ return temaActual()==="aero"; }

function syncChromeTema(){
  if(typeof document==="undefined") return;
  /* cdn-7 marca que 7-window.css cargó. NO se saca al cambiar de tema:
     7.css no usa esa clase, y sacarla dejaba reglas !important pegadas
     en Chromium (el cliente negro se quedaba en claro/aero). */
  if(document.getElementById("cdn-7css")) document.documentElement.classList.add("cdn-7");
}

/* Pinta el atributo que leen so.css / temas.css. No hace render(). */
function aplicarTema(k){
  k=k||"aero";
  if(typeof document==="undefined" || !document.body) return;
  document.body.setAttribute("data-tema", k);
  try{ document.body.dataset.tema=k; }catch(e){}
  syncChromeTema();
}

function _reponerTemasCss(){
  /* 7.css se inyecta tarde y pisa .window-body en blanco. temas.css
     tiene que quedar DESPUÉS para que negro/claro/insano ganen. */
  const t=document.querySelector('link[href="css/temas.css"],link[href*="temas.css"]');
  if(t && t.parentNode) t.parentNode.appendChild(t);
}

function cargarCdnAero(){
  if(typeof document==="undefined") return;
  if(document.getElementById("cdn-7css")) return;
  const l=document.createElement("link");
  l.id="cdn-7css";
  l.rel="stylesheet";
  l.href=AERO_7_WINDOW;   /* archivo local: carga siempre, también offline */
  l.onload=function(){
    document.documentElement.classList.add("cdn-7");
    _reponerTemasCss();
    syncChromeTema();
  };
  l.onerror=function(){   /* si por lo que sea no está, so.css ya pintó */
    if(l.parentNode) l.remove();
    document.documentElement.classList.remove("cdn-7");
  };
  document.head.appendChild(l);
}

function montarBarraSO(host, titulo, icono, onCerrar, onMin, onMax){
  if(!host) return null;
  host.classList.add("ventana-so");
  const aero=esAero();
  if(aero) host.classList.add("window","glass");
  else host.classList.remove("window","glass");
  const barra=el("div","so-barra title-bar");
  barra.appendChild(el("span","so-ic",icono||""));
  const tit=el("span","so-titulo title-bar-text",titulo||"");
  barra.appendChild(tit);
  const ctr=el("div","so-ctrl title-bar-controls");
  [["min","is-minimize","Minimize","Minimizar",onMin||function(){ host.classList.toggle("so-min"); }],
   ["max","is-maximize","Maximize","Maximizar",onMax||function(){ host.classList.toggle("so-maxi"); }],
   ["cerrar","is-close","Close","Cerrar",onCerrar||function(){ if(typeof cerrarModal==="function") cerrarModal(); }]
  ].forEach(function(x){
    const b=el("button","so-btn "+x[0]+" "+x[1]);
    b.type="button";
    b.setAttribute("aria-label",x[2]);
    b.title=x[3];
    b.onclick=function(ev){ if(ev) ev.stopPropagation(); x[4](); };
    ctr.appendChild(b);
  });
  barra.appendChild(ctr);
  host.appendChild(barra);
  const cuerpo=el("div", aero?"so-cuerpo window-body":"so-cuerpo");
  host.appendChild(cuerpo);
  host._cuerpo=cuerpo;
  return cuerpo;
}

function abrirSeccion(titulo, icono){
  const box=modal(function(caja){
    caja.innerHTML="";
    montarBarraSO(caja, titulo, icono, function(){ cerrarModal(); });
  }, {clase:"ventana-so"});
  return box._cuerpo||box;
}

function envolverVistaSO(titulo, icono){
  const v=$("#vista");
  if(!v) return null;
  const win=el("div","ventana-so in-vista");
  const cuerpo=montarBarraSO(win, titulo, icono, function(){
    if(typeof irA==="function") irA("escritorio");
  });
  v.appendChild(win);
  return cuerpo;
}

cargarCdnAero();
if(typeof document!=="undefined"){
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", syncChromeTema);
  } else syncChromeTema();
}
