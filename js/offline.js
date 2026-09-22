"use strict";
/* ============================================================
   FUTBOLINI · offline.js — 7.9030 (Claude)
   El juego usa internet para verse mejor (fuentes, CDN, nube), pero
   TIENE que poder jugarse sin red: un retiro, un viaje, un domingo sin
   señal. Esto registra el service worker (sw.js), permite instalarlo
   como app y muestra en Ajustes qué quedó guardado en el equipo.
   Si algo de esto falla, el juego sigue igual: solo no queda offline.
   ============================================================ */
const OFFLINE={ reg:null, estado:null, instalar:null };

function offlineSoportado(){
  return typeof navigator!=="undefined" && "serviceWorker" in navigator &&
    typeof location!=="undefined" && /^https?:$/.test(location.protocol) &&
    (location.protocol==="https:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname));
}
function offlineRegistrar(){
  if(!offlineSoportado()) return Promise.resolve(null);
  const v=(typeof VERSION!=="undefined")?VERSION:"dev";
  return navigator.serviceWorker.register("sw.js?v="+encodeURIComponent(v)).then(function(reg){
    OFFLINE.reg=reg;
    navigator.serviceWorker.addEventListener("message",function(ev){
      if(ev.data&&ev.data.tipo==="estado"){ OFFLINE.estado=ev.data; if(typeof _offlinePintar==="function") _offlinePintar(); }
    });
    offlinePedirEstado();
    return reg;
  }).catch(function(e){ console.warn("offline: no se pudo registrar",e); return null; });
}
function offlinePedirEstado(){
  try{
    const sw=navigator.serviceWorker&&navigator.serviceWorker.controller;
    if(sw) sw.postMessage({tipo:"estado"});
  }catch(e){}
}
function offlineListo(){ return !!(OFFLINE.estado&&OFFLINE.estado.archivos>10); }
function offlineEnLinea(){ return typeof navigator==="undefined"||navigator.onLine!==false; }

/* instalar como app (Chrome/Edge/Android) */
if(typeof window!=="undefined"){
  window.addEventListener("beforeinstallprompt",function(e){ e.preventDefault(); OFFLINE.instalar=e; if(typeof _offlinePintar==="function") _offlinePintar(); });
  window.addEventListener("online",function(){ document.body&&document.body.classList.remove("sin-red"); if(typeof aviso==="function") aviso(T("off_volvio","Volvió internet. La nube y las fuentes se reconectan solas.")); });
  window.addEventListener("offline",function(){ document.body&&document.body.classList.add("sin-red"); if(typeof aviso==="function") aviso(T("off_cayo","Sin internet. Seguís jugando: la partida se guarda en este equipo.")); });
  if(document.readyState==="complete") offlineRegistrar();
  else window.addEventListener("load",offlineRegistrar);
}

/* ---- panel en Ajustes ---- */
let _offlineCaja=null;
function _offlinePintar(){
  const c=_offlineCaja; if(!c||!c.isConnected) return;
  c.innerHTML="";
  const est=OFFLINE.estado;
  let linea;
  if(!offlineSoportado()) linea=T("off_nosop","Este navegador (o abrir el archivo directo) no permite dejar el juego instalado. Igual podés descargar tu partida abajo.");
  else if(!est) linea=T("off_prep","Preparando la copia local del juego…");
  else linea=T("off_ok","Listo para jugar sin internet")+": <b>"+est.archivos+"</b> "+T("off_arch","archivos del juego")+(est.cdn?(" + <b>"+est.cdn+"</b> "+T("off_cdn","de fuentes/estilos")):"")+" · v"+escHtml(String(est.version));
  c.appendChild(el("p",null,(offlineListo()?"✅ ":"⏳ ")+linea));
  c.appendChild(el("p","mini",T("off_txt","Con internet, el juego se ve mejor y tu partida puede ir a la nube. Sin internet se degrada, no se rompe: juega igual y guarda en este equipo.")+" "+(offlineEnLinea()?"🟢 "+T("off_on","Con red ahora."):"🔴 "+T("off_off","Sin red ahora."))));
  const fila=el("div","fichas");
  if(OFFLINE.instalar){
    const bi=el("button","btn-aqua chico verde",T("off_instalar","📲 Instalar como app"));
    bi.onclick=function(){ const p=OFFLINE.instalar; OFFLINE.instalar=null; p.prompt(); p.userChoice.then(function(){ _offlinePintar(); }); };
    fila.appendChild(bi);
  }
  if(E){
    const bd=el("button","btn-aqua chico",T("off_bajar","💾 Descargar mi partida"));
    bd.onclick=function(){ if(typeof descargarPartida==="function") descargarPartida(); };
    fila.appendChild(bd);
  }
  if(offlineSoportado()){
    const br=el("button","btn-aqua chico gris",T("off_revisar","↻ Revisar"));
    br.onclick=function(){ offlinePedirEstado(); if(OFFLINE.reg) OFFLINE.reg.update().catch(function(){}); setTimeout(_offlinePintar,400); };
    fila.appendChild(br);
  }
  c.appendChild(fila);
}
function panelOffline(v){
  const p=panel(T("off_tit","Jugar sin internet"),"📴");
  _offlineCaja=el("div","offline-caja");
  p.cuerpo.appendChild(_offlineCaja);
  v.appendChild(p);
  offlinePedirEstado();
  _offlinePintar();
}
