"use strict";
/* ============================================================
   FUTBOLINI · escritorio-vista.js — 7.9146 · EL ESCRITORIO DE WINDOWS VISTA, DE VERDAD
   Pedido del autor (3 nov 2026): "las UI de escritorio están re bugeadas y no se pueden usar, el BUZÓN quedó muy
   generado a la rápida, yo esperaba más de ese realismo Windows Vista".
   Lo que estaba roto (7.9145):
   - las ventanas no se veían NUNCA: llevaban role="dialog" + la clase .window de 7.css, y 7.css esconde
     `.window[role=dialog]` (opacity 0, visibility hidden) hasta que la URL apunte a su #id;
   - el ícono urgente saltaba sin parar (no se podía hacer clic: se movía bajo el mouse);
   - la ventana de atrás no recibía clics (pointer-events:none) y cualquier render() las cerraba todas;
   - los íconos quedaban abajo de todo, después de los paneles.
   Ahora:
   - ESCRITORIO en tres partes: los íconos en columna a la izquierda (como Windows), el centro con el próximo
     partido y lo que hay que atender, y a la derecha la BARRA LATERAL de Vista con gadgets (calendario con la
     fecha del juego, medidores del club, la temporada y "El club no olvida" como nota adhesiva).
   - VENTANAS de vidrio: se arrastran por la barra de título, doble clic maximiza, minimizar las manda a la barra de
     tareas, la de adelante es la activa (las de atrás quedan con el vidrio más claro, pero se pueden tocar), se
     acuerdan de dónde estaban y SOBREVIVEN a render(): si resuelves una decisión, la ventana sigue abierta y al día.
   - En el celular: los íconos en grilla arriba y cada ventana a pantalla completa.
   El doctor `escritorio_vista` lo revisa en el navegador (ventana visible de verdad: se mira qué hay en el centro).
   ============================================================ */
var VD={abiertas:[], pos:{}, min:{}, max:{}, nodos:{}, correo:{carpeta:"entrada", sel:null, q:""}};
var VD_ICONOS=[
  {id:"ayudante",   re:/Ayudante\s*$/,            ic:"🧑‍🏫", n:"Ayudante",    w:560},
  {id:"decisiones", re:/Decisiones/,           ic:"📥",  n:"Decisiones",  w:660},
  {id:"semana",     re:/pas[oó] esta semana/,  ic:"📰",  n:"Esta semana", w:600},
  {id:"historia",   re:/Historia del club/,    ic:"📖",  n:"Historia",    w:620},
  {id:"correo",                                 ic:"✉️",  n:"Correo",      w:900}
];
function vdDef(id){ return VD_ICONOS.filter(function(d){ return d.id===id; })[0]||null; }
function vdMovil(){ try{ return window.matchMedia("(max-width: 760px)").matches; }catch(e){ return false; } }
function vdCab(p){ var c=p&&p.querySelector(":scope > .cab"); return c?(c.textContent||"").trim():""; }

/* ---------- el escritorio: íconos | centro | barra lateral ---------- */
function vdArmar(){
  var vista=document.getElementById("vista"); if(!vista||!E) return;
  var rej=vista.querySelector(".rejilla.esc-aero")||vista.querySelector(".rejilla"); if(!rej) return;
  VD.nodos={};
  [].slice.call(rej.querySelectorAll(".panel")).forEach(function(p){
    var t=vdCab(p);
    for(var i=0;i<VD_ICONOS.length;i++){ var d=VD_ICONOS[i];
      if(d.re&&d.re.test(t)){ if(p.parentNode) p.parentNode.removeChild(p); VD.nodos[d.id]=p; return; } }
  });
  var col=[].slice.call(rej.children);
  var vd=el("div","vd"), iconos=el("nav","vd-iconos"), centro=el("div","vd-centro"), lateral=el("aside","vd-lateral");
  iconos.setAttribute("aria-label","Íconos del escritorio");
  lateral.setAttribute("aria-label","Barra lateral");
  VD_ICONOS.forEach(function(d){ if(d.id==="correo"||VD.nodos[d.id]) iconos.appendChild(vdIcono(d)); });
  if(col[0]) [].slice.call(col[0].children).forEach(function(n){ centro.appendChild(n); });
  lateral.appendChild(vdCalendario());
  if(col[1]) [].slice.call(col[1].children).forEach(function(n){
    n.classList.add("vd-gadget"); if(/no olvida/.test(vdCab(n))) n.classList.add("vd-nota"); lateral.appendChild(n); });
  vd.appendChild(iconos); vd.appendChild(centro); vd.appendChild(lateral);
  rej.parentNode.replaceChild(vd,rej);
  /* las ventanas que estaban abiertas vuelven, con el contenido de este render */
  vdQuitarVentanas();
  VD.abiertas=VD.abiertas.filter(function(id){ return id==="correo"||VD.nodos[id]; });
  VD.abiertas.forEach(function(id){ vdCrear(id); });
  vdOrden(); vdTareas();
}

/* el gadget de calendario de Vista, con la fecha del juego */
function vdCalendario(){
  var g=el("div","vd-cal"), f=null;
  try{ var c=E.calendario&&E.calendario[E.idx]; f=c&&c.f; }catch(e){}
  var dias=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
  var mes=(typeof MESES!=="undefined"&&f)?MESES[f.m-1]:"";
  var dd=f&&f.d?f.d:1, wd="";
  try{ wd=dias[new Date(E.anio,(f?f.m:1)-1,dd).getDay()]; }catch(e){}
  g.appendChild(el("div","vd-cal-dia",escHtml(wd)));
  g.appendChild(el("div","vd-cal-num",String(dd)));
  g.appendChild(el("div","vd-cal-mes",escHtml(mes+" "+(E.anio||""))));
  var part=(typeof proximoPartido==="function")?proximoPartido():null;
  if(part) g.appendChild(el("div","vd-cal-prox","⚽ "+escHtml(part.rivalNombre)+(part.local?" · de local":" · de visita")));
  g.title="La fecha del juego";
  return g;
}

/* ---------- íconos ---------- */
function vdIcono(d){
  var b=el("button","vd-ico"); b.type="button"; b.dataset.vd=d.id;
  b.appendChild(el("span","vd-ico-img",d.ic)).setAttribute("aria-hidden","true");
  b.appendChild(el("span","vd-ico-nom",escHtml(d.n)));
  var n=0, alto=false;
  if(d.id==="decisiones"&&E.decPend){ n=E.decPend.length; alto=E.decPend.some(function(x){ return x.peso==="alto"; }); }
  if(d.id==="correo"&&typeof correoMensajes==="function") n=correoMensajes().filter(function(x){ return !x.leido&&x.carpeta!=="eliminados"; }).length;
  if(n){ var g=el("span","vd-glob"+(alto?" vd-glob-alto":""),String(n)); b.appendChild(g); b.setAttribute("aria-label",d.n+" ("+n+")"); }
  else b.setAttribute("aria-label",d.n);
  var abrir=function(){ vdAbrir(d.id); };
  var fino=false; try{ fino=window.matchMedia("(pointer:fine)").matches&&!vdMovil(); }catch(e){}
  if(fino){
    /* como en Windows: un clic selecciona, doble clic abre */
    b.onclick=function(){ [].forEach.call(document.querySelectorAll(".vd-ico.sel"),function(x){ x.classList.remove("sel"); }); b.classList.add("sel"); };
    b.ondblclick=abrir; b.title="Doble clic para abrir";
  } else b.onclick=abrir;
  b.onkeydown=function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); abrir(); } };
  return b;
}

/* ---------- ventanas ---------- */
function vdAbrir(id){
  if(!vdDef(id)) return;
  if(id!=="correo"&&!VD.nodos[id]) return;
  if(VD.abiertas.indexOf(id)<0){ VD.abiertas.push(id); vdCrear(id); }
  VD.min[id]=false;
  vdFrente(id); vdTareas();
}
function vdWin(id){ return document.querySelector('.vd-win[data-vd="'+id+'"]'); }
function vdCrear(id){
  var d=vdDef(id); if(!d) return null;
  var w=el("div","vd-win"); w.dataset.vd=id; w.setAttribute("aria-label",d.n);
  /* OJO: sin role="dialog" (7.css esconde .window[role=dialog]) */
  var cuerpo=montarBarraSO(w,d.n,d.ic,function(){ vdCerrar(id); },function(){ vdMinimizar(id); },function(){ vdMaximizar(id); });
  if(id==="correo"){ w.classList.add("vd-correo"); if(typeof correoMontar==="function") correoMontar(cuerpo); }
  else { var p=VD.nodos[id]; if(p){ p.classList.add("vd-en-ventana"); cuerpo.appendChild(p); } }
  document.body.appendChild(w);
  vdUbicar(w,id,d);
  if(VD.max[id]) w.classList.add("vd-max");
  if(VD.min[id]) w.classList.add("vd-min");
  w.addEventListener("pointerdown",function(){ vdFrente(id); },true);
  vdArrastre(w,id);
  var barra=w.querySelector(".so-barra");
  if(barra) barra.ondblclick=function(ev){ if(ev.target.closest&&ev.target.closest("button")) return; vdMaximizar(id); };
  w.classList.add("vd-entra"); setTimeout(function(){ w.classList.remove("vd-entra"); },200);
  return w;
}
function vdLimites(){
  var v=document.getElementById("vista"), r=v?v.getBoundingClientRect():{left:0};
  var b=document.getElementById("barra"), arriba=b?Math.max(0,b.getBoundingClientRect().bottom):0;
  return {izq:Math.max(0,r.left), arriba:arriba+6, ancho:window.innerWidth, alto:window.innerHeight};
}
function vdUbicar(w,id,d){
  if(vdMovil()){ w.style.left=w.style.top=w.style.width=""; return; }
  var L=vdLimites(), ancho=Math.min(d.w||600, L.ancho-L.izq-40);
  w.style.width=ancho+"px";
  var p=VD.pos[id];
  if(!p){ var k=VD.abiertas.indexOf(id);
    p={x:Math.round(L.izq+Math.max(20,(L.ancho-L.izq-ancho)/2)+k*28), y:Math.round(L.arriba+30+k*28)}; VD.pos[id]=p; }
  w.style.left=Math.max(0,Math.min(p.x,L.ancho-120))+"px";
  w.style.top=Math.max(L.arriba,Math.min(p.y,L.alto-60))+"px";
  /* que entre entera: si la cascada la deja colgando bajo el borde (o bajo Jugar), se sube */
  var alto=w.offsetHeight||0, piso=L.alto-84;
  if(alto&&parseFloat(w.style.top)+alto>piso){ var y=Math.max(L.arriba,piso-alto); w.style.top=y+"px"; p.y=y; }
  document.documentElement.style.setProperty("--vd-izq",L.izq+"px");
  document.documentElement.style.setProperty("--vd-arriba",L.arriba+"px");
}
/* arrastrar por la barra de título (con mouse o lápiz; en el celu las ventanas van a pantalla completa) */
function vdArrastre(w,id){
  var barra=w.querySelector(".so-barra"); if(!barra) return;
  barra.addEventListener("pointerdown",function(ev){
    if(vdMovil()||VD.max[id]||ev.button!==0||(ev.target.closest&&ev.target.closest("button"))) return;
    var r=w.getBoundingClientRect(), dx=ev.clientX-r.left, dy=ev.clientY-r.top, L=vdLimites();
    w.classList.add("vd-moviendo");
    try{ barra.setPointerCapture(ev.pointerId); }catch(e){}
    var mover=function(e){
      var x=Math.max(-r.width+120,Math.min(e.clientX-dx,L.ancho-120)), y=Math.max(L.arriba-6,Math.min(e.clientY-dy,L.alto-40));
      w.style.left=x+"px"; w.style.top=y+"px"; VD.pos[id]={x:x,y:y};
    };
    var soltar=function(){ w.classList.remove("vd-moviendo"); barra.removeEventListener("pointermove",mover); barra.removeEventListener("pointerup",soltar); barra.removeEventListener("pointercancel",soltar); };
    barra.addEventListener("pointermove",mover); barra.addEventListener("pointerup",soltar); barra.addEventListener("pointercancel",soltar);
    ev.preventDefault();
  });
}
function vdFrente(id){
  var i=VD.abiertas.indexOf(id); if(i<0) return;
  VD.abiertas.splice(i,1); VD.abiertas.push(id); vdOrden();
}
function vdOrden(){
  VD.abiertas.forEach(function(id,i){ var w=vdWin(id); if(!w) return;
    w.style.zIndex=String((vdMovil()?60:46)+i);   /* en el celu van sobre la barra de arriba (pantalla completa) */
    var activa=i===VD.abiertas.length-1&&!VD.min[id];
    w.classList.toggle("vd-activa",activa); w.classList.toggle("active",activa); });
  vdTareas();
}
function vdCerrar(id){
  var i=VD.abiertas.indexOf(id); if(i>=0) VD.abiertas.splice(i,1);
  VD.min[id]=false;
  var w=vdWin(id);
  if(w){ w.classList.add("vd-sale"); setTimeout(function(){ if(w.parentNode) w.parentNode.removeChild(w); },140); }
  vdOrden(); vdTareas();
  var ic=document.querySelector('.vd-ico[data-vd="'+id+'"]'); if(ic) try{ ic.focus({preventScroll:true}); }catch(e){}
}
function vdMinimizar(id){
  VD.min[id]=true; var w=vdWin(id); if(w) w.classList.add("vd-min");
  vdOrden();
}
function vdRestaurar(id){ VD.min[id]=false; var w=vdWin(id); if(w) w.classList.remove("vd-min"); vdFrente(id); }
function vdMaximizar(id){
  if(vdMovil()) return;
  VD.max[id]=!VD.max[id]; var w=vdWin(id); if(w) w.classList.toggle("vd-max",!!VD.max[id]);
  var b=w&&w.querySelector(".so-btn.max"); if(b){ b.title=VD.max[id]?"Restaurar":"Maximizar"; b.setAttribute("aria-label",VD.max[id]?"Restore":"Maximize"); }
}
function vdQuitarVentanas(){ [].forEach.call(document.querySelectorAll(".vd-win"),function(w){ if(w.parentNode) w.parentNode.removeChild(w); }); }

/* la barra de tareas: un botón por ventana abierta (la activa, hundida; un clic minimiza o la trae al frente) */
function vdTareas(){
  var t=document.getElementById("vd-tareas");
  if(!VD.abiertas.length||!document.querySelector(".vd")){ if(t) t.remove(); return; }
  if(!t){ t=el("div"); t.id="vd-tareas"; t.setAttribute("role","toolbar"); t.setAttribute("aria-label","Barra de tareas"); document.body.appendChild(t); }
  t.innerHTML="";
  var arriba=VD.abiertas.filter(function(id){ return !VD.min[id]; }).slice(-1)[0];
  VD_ICONOS.forEach(function(d){ if(VD.abiertas.indexOf(d.id)<0) return;
    var b=el("button","vd-tarea"+(d.id===arriba?" activa":"")+(VD.min[d.id]?" mini":""));
    b.type="button"; b.dataset.vd=d.id;
    b.appendChild(el("span","vd-tarea-ic",d.ic)); b.appendChild(el("span","vd-tarea-n",escHtml(d.n)));
    b.title=d.n;
    b.onclick=function(){ if(d.id===arriba) vdMinimizar(d.id); else vdRestaurar(d.id); };
    t.appendChild(b);
  });
  /* va abajo a la izquierda y no se mete debajo del botón Jugar */
  var v=document.getElementById("vista"), izq=v?Math.max(8,v.getBoundingClientRect().left+8):8;
  t.style.left=izq+"px";
  var jug=document.getElementById("avanceGrande"), lim=jug&&jug.getBoundingClientRect().width?jug.getBoundingClientRect().left-12:window.innerWidth-16;
  t.style.maxWidth=Math.max(120,lim-izq)+"px";
}

/* Escape cierra la ventana de adelante (si no hay un cuadro modal encima) */
document.addEventListener("keydown",function(e){
  if(e.key!=="Escape"||!VD.abiertas.length) return;
  var m=document.getElementById("capa-modal"); if(m&&m.children.length) return;
  var vis=VD.abiertas.filter(function(id){ return !VD.min[id]; }); if(!vis.length) return;
  e.preventDefault(); vdCerrar(vis[vis.length-1]);
});
window.addEventListener("resize",function(){
  VD.abiertas.forEach(function(id){ var w=vdWin(id), d=vdDef(id); if(w&&d) vdUbicar(w,id,d); }); vdTareas();
});

(function engancharEscritorioVista(){
  if(typeof vistaEscritorio==="function"&&!vistaEscritorio._vd){
    var orig=vistaEscritorio;
    vistaEscritorio=function(){ var r=orig.apply(this,arguments); try{ vdArmar(); }catch(e){ if(window.console) console.error("escritorio:",e); } return r; };
    try{ Object.keys(orig).forEach(function(k){ vistaEscritorio[k]=orig[k]; }); }catch(e){}
    vistaEscritorio._vd=true;
  }
  /* fuera del Escritorio (u otra partida) las ventanas no quedan flotando: se guardan y vuelven al volver */
  if(typeof render==="function"&&!render._vd){
    var r0=render;
    render=function(){ var x=r0.apply(this,arguments);
      try{ if(!E||SEC!=="escritorio"){ vdQuitarVentanas(); var t=document.getElementById("vd-tareas"); if(t) t.remove(); if(!E) VD.abiertas=[]; } }catch(e){}
      return x; };
    try{ Object.keys(r0).forEach(function(k){ render[k]=r0[k]; }); }catch(e){}
    render._vd=true;
  }
})();
