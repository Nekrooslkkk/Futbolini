"use strict";
/* ============================================================
   FUTBOLINI · escritorio-vista.js — 7.9145
   Los menús que pediste pasan a íconos de escritorio (Vista). No se agregan
   Jugar, Plantel, Finanzas ni Calendario: esas siguen en el menú de siempre.
   A la vista se quedan el próximo partido y «Atiende antes de avanzar».
   El correo se abre desde su ícono, no desde la campana.
   ============================================================ */
var ESC_VENTANAS=[];
var ESC_ICONOS=[
  {id:"ayudante", re:/Ayudante/, ic:"🧑‍🏫", n:"Ayudante"},
  {id:"decisiones", re:/Decisiones/, ic:"📥", n:"Decisiones"},
  {id:"semana", re:/pas[oó] esta semana/, ic:"📰", n:"Esta semana"},
  {id:"historia", re:/Historia del club/, ic:"📖", n:"Historia"}
];

function _escCab(p){
  var c=p&&p.querySelector(":scope > .cab");
  return c?c.textContent||"":"";
}
function _escQueda(txt){ return /Pr[oó]ximo compromiso|Atiende antes/.test(txt||""); }

function escCerrar(id){
  var i=ESC_VENTANAS.findIndex(function(w){ return w.id===id; });
  if(i<0) return;
  var w=ESC_VENTANAS[i];
  if(w.win&&w.win.parentNode) w.win.parentNode.removeChild(w.win);
  ESC_VENTANAS.splice(i,1);
  escApilar();
  var ic=document.querySelector('.esc-ico[data-esc="'+id+'"]');
  if(ic) try{ ic.focus(); }catch(e){}
}
function escApilar(){
  ESC_VENTANAS.forEach(function(w,i){
    var ultima=i===ESC_VENTANAS.length-1;
    w.win.classList.toggle("esc-detras",!ultima);
    w.win.style.zIndex=String(40+i);
  });
}
function escAbrir(id,titulo,ic,nodo){
  if(!nodo) return;
  var ya=ESC_VENTANAS.filter(function(w){ return w.id===id; })[0];
  if(ya){ ESC_VENTANAS=ESC_VENTANAS.filter(function(w){ return w.id!==id; }); ESC_VENTANAS.push(ya); escApilar(); try{ ya.win.focus(); }catch(e){} return; }
  while(ESC_VENTANAS.length>=2) escCerrar(ESC_VENTANAS[0].id);
  var win=el("div","esc-win");
  win.tabIndex=-1;
  win.setAttribute("role","dialog");
  win.setAttribute("aria-label",titulo);
  var cuerpo;
  if(typeof montarBarraSO==="function") cuerpo=montarBarraSO(win,titulo,ic,function(){ escCerrar(id); });
  else {
    win.classList.add("ventana-so");
    var bar=el("div","so-barra"); bar.appendChild(el("span","so-titulo",titulo));
    var x=el("button","btn-aqua chico","✕"); x.onclick=function(){ escCerrar(id); };
    bar.appendChild(x); win.appendChild(bar); cuerpo=el("div","so-cuerpo"); win.appendChild(cuerpo);
  }
  nodo.classList.remove("oculto");
  cuerpo.appendChild(nodo);
  var host=document.getElementById("vista")||document.body;
  host.appendChild(win);
  ESC_VENTANAS.push({id:id,win:win});
  escApilar();
  try{ win.focus(); }catch(e){}
}

function escPixel(emoji){
  var s=el("span","esc-px",emoji);
  s.setAttribute("aria-hidden","true");
  return s;
}

function escritorioAIconos(){
  var vista=document.getElementById("vista"); if(!vista||!E) return;
  ESC_VENTANAS.forEach(function(w){ if(w.win&&w.win.parentNode) w.win.parentNode.removeChild(w.win); });
  ESC_VENTANAS=[];
  var paneles=[].slice.call(vista.querySelectorAll(".panel"));
  var mesa=el("div","esc-mesa");
  var puestos={};
  paneles.forEach(function(p){
    var txt=_escCab(p);
    if(!txt||_escQueda(txt)) return;
    var def=null;
    for(var i=0;i<ESC_ICONOS.length;i++){ if(ESC_ICONOS[i].re.test(txt)){ def=ESC_ICONOS[i]; break; } }
    if(!def) return;
    if(p.parentNode) p.parentNode.removeChild(p);
    puestos[def.id]={def:def, nodo:p};
  });
  ESC_ICONOS.forEach(function(def){
    if(def.id!=="correo"&&!puestos[def.id]) return;
  });
  /* orden pedido: ayudante, decisiones, semana, historia. Correo aparte, al final. */
  ["ayudante","decisiones","semana","historia"].forEach(function(id){
    var p=puestos[id]; if(!p) return;
    mesa.appendChild(escBoton(p.def, p.nodo));
  });
  mesa.appendChild(escBoton({id:"correo", ic:"✉️", n:"Correo"}, null));
  if(!mesa.children.length) return;
  var ancla=vista.querySelector(".rejilla")||vista.firstChild;
  if(ancla&&ancla.parentNode) ancla.parentNode.insertBefore(mesa, ancla.nextSibling);
  else vista.appendChild(mesa);
}

function escBoton(def, nodo){
  var b=el("button","esc-ico");
  b.type="button";
  b.dataset.esc=def.id;
  b.appendChild(escPixel(def.ic));
  var nom=el("span","esc-nom",def.n);
  b.appendChild(nom);
  if(def.id==="decisiones"&&E&&E.decPend&&E.decPend.length){
    var g=el("span","esc-glob",String(E.decPend.length));
    b.appendChild(g);
    if(E.decPend.some(function(x){ return x.peso==="alto"; })) b.classList.add("esc-late");
  }
  if(def.id==="correo"&&typeof correoSinLeer==="function"){
    var n=correoSinLeer();
    if(n) b.appendChild(el("span","esc-glob",String(n)));
  }
  var abrir=function(){
    if(def.id==="correo"){ if(typeof abrirCorreo==="function") abrirCorreo(); return; }
    escAbrir(def.id, def.n, def.ic, nodo);
  };
  var fino=window.matchMedia&&window.matchMedia("(pointer:fine)").matches;
  if(fino){
    b.onclick=function(){ [].forEach.call(document.querySelectorAll(".esc-ico"),function(x){ x.classList.remove("sel"); }); b.classList.add("sel"); };
    b.ondblclick=abrir;
    b.title="Doble clic";
  } else {
    b.onclick=abrir;
  }
  b.onkeydown=function(e){ if(e.key==="Enter"){ e.preventDefault(); abrir(); } };
  return b;
}

document.addEventListener("keydown",function(e){
  if(e.key!=="Escape"||!ESC_VENTANAS.length) return;
  var top=ESC_VENTANAS[ESC_VENTANAS.length-1];
  if(document.getElementById("capa-modal")&&document.getElementById("capa-modal").children.length) return;
  e.preventDefault();
  escCerrar(top.id);
});

(function wrapEscritorioIconos(){
  if(typeof vistaEscritorio!=="function"||vistaEscritorio._esc915) return;
  var orig=vistaEscritorio;
  vistaEscritorio=function(){
    var r=orig.apply(this,arguments);
    try{ escritorioAIconos(); }catch(e){}
    return r;
  };
  try{ Object.keys(orig).forEach(function(k){ vistaEscritorio[k]=orig[k]; }); }catch(e){}
  vistaEscritorio._esc915=true;
})();
