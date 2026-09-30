"use strict";
/* ============================================================
   FUTBOLINI · papa.js — 7.9120 · 🥔 Modo papa (pedido del autor: "un botón para cambiar al modo papa y que
   ese cambie todo y esté full optimizado, pero que puedas jugar el modo full igualmente")

   Qué hace al prenderlo:
   1) CARGA: el service worker junta los ~130 archivos del juego en uno (js/papa-armar.js). Con CPU 20× más lenta
      abrir pasa de ~4,5 s a ~0,8 s. Empieza a regir desde la próxima vez que abras el juego.
   2) PANTALLA (desde ya): nada se anima, sin sombras ni desenfoques, fondo quieto, paneles fuera de pantalla sin
      calcular, cancha en su versión liviana y balón parado en dibujo clásico (sin 3D), 7.css local, sin fuentes de
      Google. El juego es el mismo: misma partida, mismas reglas.
   3) SEGURO: si el archivo juntado falla al cargar, se apaga solo, se vuelve al modo normal y se avisa.
   Se prende y apaga en Ajustes ▸ Pantalla o desde la pantalla de inicio. La marca vive en localStorage
   (futbolini_papa) y en la caché del service worker (que no tiene localStorage).
   ============================================================ */
const PAPA={ listo:null, kb:0 };

function modoPapa(){ try{ return localStorage.getItem("futbolini_papa")==="1"; }catch(e){ return false; } }
/* ¿este arranque vino juntado? (lo marca el final del paquete) */
function papaCargaJunta(){ return !!(typeof self!=="undefined"&&self.__papaOK); }
function papaPuedeJuntar(){ return typeof offlineSoportado==="function"&&offlineSoportado(); }

function modoPapaSet(on,silencio){
  on=!!on;
  try{ localStorage.setItem("futbolini_papa",on?"1":"0"); localStorage.removeItem("futbolini_papa_fallo"); }catch(e){}
  document.documentElement.classList.toggle("papa",on);
  if(on){ document.body.classList.add("perf"); try{ Store.set("futbolini3_perf",true); }catch(e){} }
  PAPA.listo=null;
  try{ const sw=navigator.serviceWorker&&navigator.serviceWorker.controller; if(sw) sw.postMessage({tipo:"papa",on:on}); }catch(e){}
  if(typeof render==="function") render();
  if(silencio||typeof aviso!=="function") return;
  if(!on) aviso("✨ Modo full de vuelta: todo se ve completo desde ya.",5000);
  else aviso(papaPuedeJuntar()
    ? "🥔 Modo papa: ya va liviano. La próxima vez que abras el juego carga de una (hasta 5× más rápido)."
    : "🥔 Modo papa: ya va liviano. La carga rápida necesita abrir el juego desde su página web (no el archivo suelto).",6500);
}

/* el service worker avisa cuando terminó de juntar el juego */
if(typeof navigator!=="undefined"&&navigator.serviceWorker&&navigator.serviceWorker.addEventListener){
  navigator.serviceWorker.addEventListener("message",function(ev){
    const d=ev.data; if(!d) return;
    if(d.tipo==="papa_listo"){ PAPA.listo=!!(d.on&&d.ok); PAPA.kb=d.kb||0; const n=document.getElementById("papaEstado"); if(n) n.innerHTML=papaEstadoTxt(); }
    if(d.tipo==="estado"&&d.papa!==undefined){ PAPA.listo=!!d.papaListo; }
  });
}
function papaEstadoTxt(){
  if(!modoPapa()) return "";
  if(papaCargaJunta()) return "✅ Esta vez el juego cargó juntado (un solo archivo).";
  if(!papaPuedeJuntar()) return "ℹ️ Pantalla liviana activa. La carga juntada funciona abriendo el juego desde su página web.";
  if(PAPA.listo) return "✅ Carga rápida lista"+(PAPA.kb?" ("+Math.round(PAPA.kb/1024*10)/10+" MB)":"")+": se usa la próxima vez que abras el juego.";
  return "⏳ Juntando el juego en tu equipo… se usa la próxima vez que lo abras.";
}

/* la marca del <html> tiene que calzar con la elección aunque el arranque haya venido normal (y al revés) */
(function(){
  try{ document.documentElement.classList.toggle("papa",modoPapa()); }catch(e){}
})();

/* pantalla de inicio: el botón está donde se nota que el celu sufre. El init de ui.js es asíncrono y a veces dibuja el
   splash antes de que cargue este archivo: por eso se pone al cargar, al terminar la carga y en cada splash nuevo. */
function papaBotonInicio(){
  try{
    const inner=document.querySelector("#arranque .arr-inner"); if(!inner||inner.querySelector(".arr-papa")) return;
    const txt=()=>modoPapa()?"🥔 Modo papa activo · volver a full":"🥔 ¿Tu celu sufre? Modo papa";
    const b=el("button","arr-papa",txt()); b.type="button";
    b.onclick=function(ev){ ev.stopPropagation(); modoPapaSet(!modoPapa(),true); b.textContent=txt(); };
    inner.appendChild(b);
  }catch(e){}
}
(function(){
  const o=window.pantallaArranque; if(typeof o!=="function"||o._papa) return;
  const w=function(){ const r=o.apply(this,arguments); papaBotonInicio(); return r; };
  Object.keys(o).forEach(function(k){ w[k]=o[k]; }); w._papa=true; w._orig=o; window.pantallaArranque=w;
  papaBotonInicio();
  if(document.addEventListener) document.addEventListener("DOMContentLoaded",function(){ setTimeout(papaBotonInicio,0); });
})();

/* si el paquete falló y la guardia volvió al modo normal, se avisa una vez; si abrir tardó mucho, se sugiere */
if(typeof document!=="undefined"&&document.addEventListener) document.addEventListener("DOMContentLoaded",function(){
  const t0=(typeof performance!=="undefined"&&performance.now)?performance.now():0;
  setTimeout(function(){
    let fallo=null; try{ fallo=localStorage.getItem("futbolini_papa_fallo"); if(fallo) localStorage.removeItem("futbolini_papa_fallo"); }catch(e){}
    if(fallo&&typeof aviso==="function"){ aviso("🥔 El Modo papa no pudo cargar y volvimos al normal. Tu partida está intacta. Si te pasa de nuevo, cuéntale al autor.",8000); return; }
    let dicho=false; try{ dicho=localStorage.getItem("futbolini_papa_sugerido")==="1"; }catch(e){}
    if(!modoPapa()&&!dicho&&t0>7000&&typeof aviso==="function"){
      try{ localStorage.setItem("futbolini_papa_sugerido","1"); }catch(e){}
      aviso("Tu equipo tardó "+Math.round(t0/1000)+" s en abrir el juego. Prueba 🥔 Modo papa (Ajustes ▸ Pantalla): carga hasta 5× más rápido.",9000);
    }
  },2500);
});
