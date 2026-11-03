"use strict";
/* FUTBOLINI · boot-pintar.js — 7.9145
   Primer archivo, chico a propósito. El splash ya está pintado con el CSS del
   propio index (si no, la pantalla queda blanca mientras bajan los equipos).
   Acá se piden las hojas de estilo sin trabar ese primer cuadro, y si el
   service worker guardó una versión vieja, se recarga una sola vez. */
(function(){
  var V="7.9146";
  try{ document.title="Futbolini "+V+" — Conducción de clubes chilenos"; }catch(e){}
  var hojas=["base","aero","so","temas","lateral","inicio","gol","pulido","aero7","dev","movil","temas7","interfaz-club"];
  var head=document.head||document.documentElement;
  hojas.forEach(function(n){
    var href="css/"+n+".css?v="+V;
    if(document.querySelector('link[rel="stylesheet"][href="'+href+'"]')) return;
    var l=document.createElement("link");
    l.rel="stylesheet"; l.href=href;
    head.appendChild(l);
  });
  /* Inter no puede ir en el <head>: es de afuera y, si se demora, deja la página en blanco. */
  var fu=document.createElement("link");
  fu.rel="stylesheet";
  fu.href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap";
  head.appendChild(fu);
  function alDia(ver){
    if(!ver||ver===V) return;
    try{ if(sessionStorage.getItem("fb_reload")==="1") return; sessionStorage.setItem("fb_reload","1"); }catch(e){ return; }
    location.reload();
  }
  if(navigator.serviceWorker&&navigator.serviceWorker.addEventListener){
    navigator.serviceWorker.addEventListener("message",function(ev){
      var d=ev.data; if(d&&d.tipo==="version-nueva") alDia(d.version);
    });
  }
  try{ if(sessionStorage.getItem("fb_reload")==="1") sessionStorage.removeItem("fb_reload"); }catch(e){}
})();
