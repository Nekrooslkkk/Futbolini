"use strict";
/* ============================================================
   FUTBOLINI · rendimiento.js — 7.9093 · que corra igual en un celu de 60 lucas que en uno de un palo
   Pedido del autor: "tenerlo súper rendido: que la experiencia sea la misma en un celular malo que en un
   iPhone". Medido con la CPU 6× más lenta (un Android barato de hace años), el tiempo se iba en dos cosas
   que no eran el juego:
   1) GUARDAR: cada acción guardaba la partida entera (~520 KB) varias veces, y cada vez la convertía a texto
      DOS veces (la ranura y la clave vieja). Era el 38 % del tiempo. Ahora las llamadas de una misma acción se
      juntan en UN guardado, con un solo texto para las dos claves, y como mucho uno cada 1,5 s. Al salir o
      cambiar de app se guarda al tiro (no se pierde nada).
   2) La cinta de secciones del celu se recentraba con scrollIntoView en cada repintado (25 %): ahora solo al
      cambiar de sección (ui.js, pintarDock).
   Y deja medición adentro (regla del modo dev): devRendimiento() cronometra secciones, semana y guardado, y
   si el equipo se traba de verdad en uso real (tareas largas seguidas) prende el Modo liviano solo, salvo que
   el jugador lo haya elegido a mano.
   ============================================================ */
const REND={pend:null, prom:null, ultimo:0, guardados:0, pedidos:0, MIN_MS:1500};

/* guarda ya (el de siempre, con un solo JSON para las dos claves) */
async function guardarAhora(){
  if(!E||E._bulkSim) return;
  E.saveVer=SAVE_VER;
  if(!E._slot) E._slot=nuevoSlotId();
  if(typeof saneaEstado==="function") saneaEstado(E);
  const txt=JSON.stringify(E);
  let ok=false;
  try{ if(window.storage&&window.storage.set){ await window.storage.set(slotKey(E._slot),txt); await window.storage.set(LLAVE,txt); ok=true; } }catch(e){}
  if(!ok){ try{ localStorage.setItem(slotKey(E._slot),txt); localStorage.setItem(LLAVE,txt); }catch(e){ try{ await Store.set(slotKey(E._slot),E); }catch(_){} } }
  _ram[slotKey(E._slot)]=E; _ram[LLAVE]=E;
  REND.ultimo=performance.now(); REND.guardados++; REND.kb=Math.round(txt.length/1024);
  await slotFijarActivo(E._slot);
  try{ await slotActualizarIndice(E); }catch(e){}
  const n=document.getElementById("guardadoTxt");
  if(n) n.textContent="guardado "+new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"});
  if(typeof nubeAutoRespaldo==="function"){ try{ nubeAutoRespaldo(E); }catch(e){} }
}
/* guardar(): se agrupa. Devuelve una promesa que se cumple cuando de verdad quedó guardado. */
function guardarAgrupado(){
  REND.pedidos++;
  if(!E||E._bulkSim) return Promise.resolve();
  if(REND.prom) return REND.prom;
  const espera=Math.max(0,REND.MIN_MS-(performance.now()-REND.ultimo));
  REND.prom=new Promise(res=>{ REND.pend=setTimeout(async()=>{ REND.pend=null; const p=REND.prom; REND.prom=null; try{ await guardarAhora(); }catch(e){ console.error("guardar:",e); } res(); },espera); REND.resolver=res; });
  return REND.prom;
}
/* si hay un guardado esperando, que se haga ya (salir, cambiar de app, cambiar de partida) */
async function guardarPendienteYa(){
  if(!REND.pend) return;
  clearTimeout(REND.pend); REND.pend=null; const res=REND.resolver; REND.prom=null;
  try{ await guardarAhora(); }catch(e){} if(res) res();
}
(function(){
  if(typeof window.guardar!=="function"||window.guardar._rend) return;
  const w=function(){ return guardarAgrupado(); };
  w._rend=true; w._orig=window.guardar; window.guardar=w;
  const flush=()=>{ guardarPendienteYa(); };
  window.addEventListener("pagehide",flush);
  document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden") flush(); });
  /* cambiar de partida (continuarPartida, cambiarDeClub) ya hace "await guardar()": espera al agrupado */
})();

/* ---------- medición (la sonda que se usó para diagnosticar, dejada adentro) ---------- */
function devRendimiento(){
  if(!E) return null;
  const T=f=>{ const a=performance.now(); try{ f(); }catch(e){} return Math.round((performance.now()-a)*10)/10; };
  const sec=SEC, snap=clonarPartida(E), out={secciones:{}};
  try{
    ["escritorio","finanzas","plantel","mercado","calendario","historia","vida"].forEach(s=>{ SEC=s; render(); out.secciones[s]=T(()=>{ render(); }); });
    out.peor=Object.keys(out.secciones).reduce((a,k)=>out.secciones[k]>out.secciones[a]?k:a,"escritorio");
    out.kbPartida=Math.round(JSON.stringify(E).length/1024);
    out.stringify=T(()=>JSON.stringify(E));
    const g0=REND.guardados, p0=REND.pedidos; for(let i=0;i<5;i++) guardar();
    out.agrupa=(REND.pedidos-p0===5)&&(REND.guardados===g0);   /* 5 pedidos seguidos = 0 guardados inmediatos */
  } finally { restaurarPartida(snap); SEC=sec; try{ render(); }catch(e){} }
  return out;
}
/* uso real: si se juntan muchas tareas largas (>120 ms) en poco rato, el equipo no da: se prende el liviano */
(function(){
  if(typeof PerformanceObserver==="undefined") return;
  let largas=[];
  try{
    new PerformanceObserver(l=>{ const ahora=performance.now();
      l.getEntries().forEach(e=>{ if(e.duration>120) largas.push(ahora); });
      largas=largas.filter(t=>ahora-t<15000);
      if(largas.length>=8&&!document.body.classList.contains("perf")){
        Store.get("futbolini3_perf").then(v=>{ if(v===null||v===undefined){ document.body.classList.add("perf"); REND.autoLiviano=true;
          if(typeof aviso==="function") aviso("Tu equipo va justo: activé el Modo liviano (lo cambias en Ajustes ▸ Pantalla)",5000); } }).catch(()=>{});
        largas=[];
      }
    }).observe({entryTypes:["longtask"]});
  }catch(e){}
})();

/* 7.9103 · el scroll de ADENTRO de la ventana (celu: .so-cuerpo) sobrevive a un repintado de la misma sección.
   Va como el envoltorio más externo de render (se instala al terminar de cargar todo): así corre después de los que
   arman la ventana Aero y es síncrono (el doctor lo puede medir). ui.js deja además una microtarea de respaldo. */
function _envolverScrollInterno(){
  const o=window.render; if(typeof o!=="function"||o._scIn) return;
  const w=function(){
    const v=document.getElementById("vista"), misma=!!(E&&v&&render._sec===SEC);
    const sc=misma?v.querySelector(".so-cuerpo,.window-body"):null, y=sc?sc.scrollTop:0;
    const r=o.apply(this,arguments);
    if(y>0){ const s2=v.querySelector(".so-cuerpo,.window-body"); if(s2&&Math.abs(s2.scrollTop-y)>2){ try{ s2.scrollTop=y; }catch(e){} } }
    return r;
  };
  Object.keys(o).forEach(k=>{ try{ w[k]=o[k]; }catch(e){} }); w._scIn=true; w._orig=o; window.render=w;
}
/* DOMContentLoaded: ya corrieron todos los scripts (el doctor arranca ahí). En load se revisa otra vez por si alguien
   envolvió render después (si quedó abajo, se vuelve a poner arriba). */
if(typeof document!=="undefined"){
  if(document.readyState!=="loading") _envolverScrollInterno(); else document.addEventListener("DOMContentLoaded",_envolverScrollInterno);
  window.addEventListener("load",_envolverScrollInterno);
}

