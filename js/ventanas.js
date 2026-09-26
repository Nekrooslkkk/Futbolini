"use strict";
/* ============================================================
   FUTBOLINI 7.9015 · ventanas.js
   Chrome Aero: css/so.css (plan A, offline) + 7.css window.css del CDN
   (unpkg 0.21.1, SOLO window.css: el paquete entero pinta `button` global).
   Autor: las ventanas SON las del CDN. Si unpkg falla, cae a
   css/vendor/7-window.css (mismo archivo, MIT, data:URI).
   7.99958: el vidrio Vista (.window / .window-body / cdn-7) SOLO en Aero.
   7.9015: pie sticky (Empezar siempre a mano en el celu).
   ============================================================ */

const AERO_7_WINDOW_CDN="https://unpkg.com/7.css@0.21.1/dist/gui/window.css";
const AERO_7_WINDOW_LOCAL="css/vendor/7-window.css";
const AERO_7_WINDOW=AERO_7_WINDOW_CDN;   /* la fuente que pide el autor */

function temaActual(){
  if(typeof document==="undefined" || !document.body) return "aero";
  return document.body.getAttribute("data-tema") || document.body.dataset.tema || "aero";
}
function esAero(){ return temaActual()==="aero"; }

function syncChromeTema(){
  if(typeof document==="undefined") return;
  /* cdn-7 marca que window.css cargó (CDN o fallback). NO se saca al cambiar
     de tema: 7.css no usa esa clase, y sacarla dejaba reglas !important pegadas. */
  if(document.getElementById("cdn-7css")) document.documentElement.classList.add("cdn-7");
}

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
  l.href=AERO_7_WINDOW_CDN;
  const ok=function(){
    document.documentElement.classList.add("cdn-7");
    _reponerTemasCss();
    syncChromeTema();
  };
  l.onload=ok;
  l.onerror=function(){
    if(l.dataset.fb){
      if(l.parentNode) l.remove();
      document.documentElement.classList.remove("cdn-7");
      return;
    }
    l.dataset.fb="1";
    l.href=AERO_7_WINDOW_LOCAL;   /* sin red: mismo chrome, offline */
    l.onload=ok;
  };
  document.head.appendChild(l);
}

function montarBarraSO(host, titulo, icono, onCerrar, onMin, onMax){
  if(!host) return null;
  host.classList.add("ventana-so");
  const aero=esAero();
  if(aero) host.classList.add("window","glass","active");
  else host.classList.remove("window","glass");
  const barra=el("div","so-barra title-bar");
  barra.appendChild(el("span","so-ic",icono||""));
  const tit=el("span","so-titulo title-bar-text",titulo||"");
  barra.appendChild(tit);
  const ctr=el("div","so-ctrl title-bar-controls");
  /* 7.9039 · minimizar escondía solo el cuerpo y dejaba el pie suelto ("Empezar en 2026" flotando):
     ahora minimizar cierra igual que la X. Maximizar agranda de verdad (CSS .so-maxi). */
  const cerrarFn=onCerrar||function(){ if(typeof cerrarModal==="function") cerrarModal(); };
  [["min","is-minimize","Minimize","Minimizar",onMin||cerrarFn],
   ["max","is-maximize","Maximize","Maximizar",onMax||function(){ host.classList.toggle("so-maxi"); }],
   ["cerrar","is-close","Close","Cerrar",cerrarFn]
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

function montarPieSO(host){
  if(!host) return null;
  const pie=el("div", esAero()?"so-pie window-footer":"so-pie");
  host.appendChild(pie);
  host._pie=pie;
  return pie;
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
