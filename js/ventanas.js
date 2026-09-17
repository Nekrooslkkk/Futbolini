"use strict";
/* ============================================================
   FUTBOLINI 7.9993 · ventanas.js
   Chrome de ventana Aero (barra Vista + min/max/cerrar) sobre el
   modal() y las pestañas que ya existen. Sin CDN, sin segundo menú.
   Los botones de caption se dibujan en css/so.css (como 7.css, pero nuestro).
   ============================================================ */

function montarBarraSO(host, titulo, icono, onCerrar, onMin, onMax){
  if(!host) return null;
  host.classList.add("ventana-so");
  const barra=el("div","so-barra");
  barra.appendChild(el("span","so-ic",icono||""));
  barra.appendChild(el("span","so-titulo",titulo||""));
  const ctr=el("div","so-ctrl");
  [["min","Minimizar",onMin||function(){ host.classList.toggle("so-min"); }],
   ["max","Maximizar",onMax||function(){ host.classList.toggle("so-maxi"); }],
   ["cerrar","Cerrar",onCerrar||function(){ if(typeof cerrarModal==="function") cerrarModal(); }]
  ].forEach(function(x){
    const b=el("button","so-btn "+x[0]);
    b.type="button"; b.setAttribute("aria-label",x[1]); b.title=x[1];
    b.onclick=function(ev){ if(ev) ev.stopPropagation(); x[2](); };
    ctr.appendChild(b);
  });
  barra.appendChild(ctr);
  host.appendChild(barra);
  const cuerpo=el("div","so-cuerpo");
  host.appendChild(cuerpo);
  host._cuerpo=cuerpo;
  return cuerpo;
}

/* Modal con chrome de SO. Devuelve el .so-cuerpo para pintar adentro
   (así un innerHTML="" del cuerpo no borra la barra). */
function abrirSeccion(titulo, icono){
  const box=modal(function(caja){
    caja.innerHTML="";
    montarBarraSO(caja, titulo, icono, function(){ cerrarModal(); });
  }, {clase:"ventana-so"});
  return box._cuerpo||box;
}

/* Envuelve el contenido de una pestaña (Finanzas, Vida) en una ventana
   que vive DENTRO de #vista. Cerrar vuelve al Escritorio; las pestañas
   del #menu siguen funcionando. */
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
