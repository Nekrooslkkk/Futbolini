"use strict";
/* ============================================================
   FUTBOLINI · vida-ui.js — 7.9033 (Claude)
   Que la plata se SIENTA. Cuando cambian la caja, la deuda o tu
   bolsillo, el número de la barra cuenta hasta el valor nuevo,
   destella (verde si mejora, rojo si empeora) y sube un "+$120 M"
   flotando. Sin esto, perder 800 millones se veía igual que nada.
   Deuda que sube = rojo (empeora), aunque el número crezca.
   Liviano: se apaga en modo liviano y con movimiento reducido.
   ============================================================ */
const VIDA_UI={ prev:null, club:null, anims:{} };
const VIDA_MS=1600;
function _vidaQuieto(){
  return (document.body&&document.body.classList.contains("perf")) ||
    (window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
function _vidaChip(k){
  const bd=document.getElementById("barraDatos"); if(!bd) return null;
  return [].slice.call(bd.querySelectorAll(".bd")).filter(function(c){
    const kk=c.querySelector(".k"); return kk&&kk.textContent.trim().toLowerCase()===k;
  })[0]||null;
}
/* decora el chip según cuánto va de la animación: sobrevive a repintados de la barra */
function _vidaDecorar(k){
  const A=VIDA_UI.anims[k], chip=_vidaChip(k);
  if(!A||!chip) return;
  const pasado=performance.now()-A.t0;
  if(pasado>=VIDA_MS){ delete VIDA_UI.anims[k]; return; }
  chip.classList.add(A.mejor?"vida-sube":"vida-baja");
  chip.style.animationDelay=(-pasado)+"ms";
  let flo=chip.querySelector(".vida-delta");
  if(!flo){ flo=document.createElement("span"); chip.appendChild(flo); }
  flo.className="vida-delta "+(A.mejor?"sube":"baja");
  flo.textContent=(A.hasta>A.desde?"+":"−")+plata(Math.abs(A.hasta-A.desde));
  flo.style.animationDelay=(-pasado)+"ms";
  const v=chip.querySelector(".v");
  if(!v||_vidaQuieto()) return;
  const ms=Math.min(900,300+Math.abs(A.hasta-A.desde)*0.6), d=A.hasta-A.desde;
  (function paso(){
    if(!v.isConnected) return;
    const u=Math.min(1,(performance.now()-A.t0)/ms), e=1-Math.pow(1-u,3);
    v.textContent=plata(Math.round(A.desde+d*e));
    if(u<1) requestAnimationFrame(paso);
  })();
  clearTimeout(A.fin);
  A.fin=setTimeout(function(){ const c=_vidaChip(k); if(c){ c.classList.remove("vida-sube","vida-baja"); c.style.animationDelay=""; const f=c.querySelector(".vida-delta"); if(f) f.remove(); } delete VIDA_UI.anims[k]; }, VIDA_MS-pasado);
}
function _vidaNueva(k, desde, hasta, mejor){
  const A0=VIDA_UI.anims[k];
  VIDA_UI.anims[k]={t0:performance.now(), desde:A0?A0.desde:desde, hasta:hasta, mejor:mejor};
}
function vidaBarraTras(){
  if(typeof E==="undefined"||!E){ VIDA_UI.prev=null; VIDA_UI.anims={}; return; }
  const ahora={caja:Math.round(E.plata||0), deuda:Math.round(E.deuda||0), bolsillo:Math.round((E.personal&&E.personal.bolsillo)||0)};
  const p=VIDA_UI.prev;
  if(p && VIDA_UI.club===E.club){
    if(ahora.caja!==p.caja) _vidaNueva("caja", p.caja, ahora.caja, ahora.caja>p.caja);
    if(ahora.deuda!==p.deuda) _vidaNueva("deuda", p.deuda, ahora.deuda, ahora.deuda<p.deuda);
    if(ahora.bolsillo!==p.bolsillo) _vidaNueva("tu plata", p.bolsillo, ahora.bolsillo, ahora.bolsillo>p.bolsillo);
  } else VIDA_UI.anims={};
  VIDA_UI.prev=ahora; VIDA_UI.club=E.club;
  Object.keys(VIDA_UI.anims).forEach(_vidaDecorar);
}
(function(){
  if(typeof pintarBarra!=="function"||pintarBarra._vida) return;
  const orig=pintarBarra;
  const env=function(){ const r=orig.apply(this,arguments); try{ vidaBarraTras(); }catch(e){} return r; };
  Object.keys(orig).forEach(function(k){ env[k]=orig[k]; });
  env._vida=true;
  pintarBarra=env;
})();
