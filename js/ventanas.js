"use strict";
/* ============================================================
   FUTBOLINI 7.9994 · ventanas.js
   Chrome Aero local (css/so.css) = plan A, funciona sin red.
   CDN de 7.css/window.css = extra SI hay internet. El paquete
   completo pinta `button` global y rompe el juego; solo se
   pide el chrome de ventana. Si unpkg falla, so.css ya pintó.
   ============================================================ */

const CDN_7_WINDOW="https://unpkg.com/7.css@0.21.1/dist/gui/window.css";

function cargarCdnAero(){
  if(typeof document==="undefined") return;
  if(document.getElementById("cdn-7css")) return;
  if(typeof navigator!=="undefined" && navigator.onLine===false) return;
  const l=document.createElement("link");
  l.id="cdn-7css";
  l.rel="stylesheet";
  l.href=CDN_7_WINDOW;
  l.crossOrigin="anonymous";
  l.onload=function(){ document.documentElement.classList.add("cdn-7"); };
  l.onerror=function(){
    if(l.parentNode) l.remove();
    document.documentElement.classList.remove("cdn-7");
  };
  document.head.appendChild(l);
}

function montarBarraSO(host, titulo, icono, onCerrar, onMin, onMax){
  if(!host) return null;
  host.classList.add("ventana-so","window","glass");
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
  const cuerpo=el("div","so-cuerpo window-body");
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
