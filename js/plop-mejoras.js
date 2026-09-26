"use strict";
/* ============================================================
   FUTBOLINI · plop-mejoras.js  (7.9055)
   Pedido del autor: PLOP! como una ventana de navegador estilo Internet Explorer en
   "http://plop.com/", que se abre como app de escritorio (logo del pajarito rojo),
   carga como el navegador de XP y se cierra. Envuelve vistaRedes sin tocar su lógica.
   ============================================================ */
function logoPlop(tam){
  tam=tam||22;
  return '<svg class="plop-logo" width="'+tam+'" height="'+tam+'" viewBox="0 0 32 32" aria-hidden="true">'+
    '<circle cx="16" cy="17" r="12" fill="#e0262b"/>'+
    '<path d="M27 15 l4 -2 l-3 4z" fill="#f0b429"/>'+
    '<circle cx="21" cy="13" r="3.2" fill="#fff"/><circle cx="21.8" cy="13" r="1.5" fill="#111"/>'+
    '<path d="M8 17 q4 -6 9 -1 q-4 5 -9 1z" fill="#b01a1f"/>'+
    '<path d="M11 6 q3 -4 6 0 q-3 -1 -6 0z" fill="#e0262b"/></svg>';
}
let _plopCargado=false;
(function(){
  if(typeof vistaRedes!=="function"||vistaRedes._ie) return;
  const orig=vistaRedes;
  vistaRedes=function(){
    const r=orig.apply(this,arguments);
    try{
      const v=document.getElementById("vista"); if(!v) return r;
      const hijos=Array.prototype.slice.call(v.childNodes);
      const win=el("div","plop-ie");
      const tit=el("div","plop-ie-tit",logoPlop(18)+'<span>PLOP! — Internet Explorer</span>');
      const cerrar=el("button","plop-ie-x","✕"); cerrar.title="Cerrar PLOP!"; cerrar.setAttribute("aria-label","Cerrar PLOP!");
      cerrar.onclick=function(){ if(typeof irA==="function") irA("escritorio"); };
      tit.appendChild(cerrar);
      const barra=el("div","plop-ie-barra",'<span class="plop-ie-nav">◀ ▶ ⟳</span><span class="plop-ie-dir">🌐 http://plop.com/'+(typeof REDES_PEST!=="undefined"&&REDES_PEST==="club"?"oficial":"dt")+'</span>');
      const cuerpo=el("div","plop-ie-cuerpo");
      hijos.forEach(h=>cuerpo.appendChild(h));
      win.appendChild(tit); win.appendChild(barra); win.appendChild(cuerpo);
      /* carga "como el navegador de XP": solo la primera vez que se abre en la sesión */
      const liviano=document.body.classList.contains("perf")||(window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches);
      if(!_plopCargado && !liviano){
        _plopCargado=true;
        const car=el("div","plop-ie-carga",logoPlop(48)+'<div class="plop-ie-carga-t">Abriendo http://plop.com/…</div><div class="plop-ie-prog"><i></i></div>');
        win.appendChild(car);
        setTimeout(()=>{ if(car.parentNode) car.classList.add("fuera"); },650);
        setTimeout(()=>{ if(car.parentNode) car.parentNode.removeChild(car); },950);
      } else _plopCargado=true;
      v.appendChild(win);
    }catch(e){}
    return r;
  };
  Object.keys(orig).forEach(k=>vistaRedes[k]=orig[k]);
  vistaRedes._ie=true;
})();
/* en el menú, PLOP! se abre como una app: el pajarito rojo y su nombre */
(function(){
  if(typeof SECCIONES==="undefined") return;
  const s=SECCIONES.find(x=>x[0]==="redes");
  if(s){ s[1]=logoPlop(18); s[2]="PLOP!"; }
})();
