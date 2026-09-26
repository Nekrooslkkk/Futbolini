"use strict";
/* ============================================================
   FUTBOLINI · util.js
   Helpers, guardado y azar. No sabe nada del juego.
   ============================================================ */

/* Versión única del juego (una sola fuente de verdad). */
const VERSION="7.9057";
const $=(s,c)=>(c||document).querySelector(s);
const $$=(s,c)=>Array.from((c||document).querySelectorAll(s));
function el(tag,cls,html){const n=document.createElement(tag);if(cls)n.className=cls;if(html!=null)n.innerHTML=html;return n;}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const elige=a=>a[Math.floor(Math.random()*a.length)];
function eligePeso(lista,peso){
  const tot=lista.reduce((s,x)=>s+peso(x),0); if(tot<=0) return null;
  let r=Math.random()*tot;
  for(const x of lista){ r-=peso(x); if(r<=0) return x; }
  return lista[lista.length-1];
}
function mezcla(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=ri(0,i);[b[i],b[j]]=[b[j],b[i]];}return b;}

/* Texto de usuario → HTML: NUNCA innerHTML con alias, posts, correo, PEGAR. */
function escHtml(s){
  return String(s==null?"":s)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function mailOk(s){
  s=String(s||"").trim();
  if(s.length<5||s.length>120) return false;
  if(/[<>"'`]/.test(s)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function codigoOk(s){ return /^\d{6}$/.test(String(s||"").replace(/\s/g,"")); }
function textoLimpio(s,max){
  s=String(s==null?"":s).replace(/<[^>]*>/g,"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"");
  if(max) s=s.slice(0,max);
  return s.trim();
}
/* Partida guardada: recorta HTML de lo que el jugador tipeó (posts, alias, nombres). */
function saneaEstado(est){
  if(!est||typeof est!=="object") return est;
  try{
    if(est.clubNombre) est.clubNombre=textoLimpio(est.clubNombre,80);
    if(est.dt) est.dt=textoLimpio(est.dt,80);
    (est.plantel||[]).forEach(function(j){ if(j&&j.n) j.n=textoLimpio(j.n,80); });
    (est.timeline||[]).forEach(function(t){
      if(!t) return;
      if(t.autor) t.autor=textoLimpio(t.autor,48);
      if(t.texto) t.texto=textoLimpio(t.texto,280);
      (t.hilo||[]).forEach(function(h){
        if(!h) return;
        if(h.autor) h.autor=textoLimpio(h.autor,48);
        if(h.texto) h.texto=textoLimpio(h.texto,280);
      });
    });
    if(est.perfil&&est.perfil.plopUser) est.perfil.plopUser=textoLimpio(est.perfil.plopUser,16).replace(/[<>"'`]/g,"");
    (est.calendario||[]).forEach(function(p){
      if(!p) return;
      if(p.rivalNombre) p.rivalNombre=textoLimpio(p.rivalNombre,80);
      if(p.sede) p.sede=textoLimpio(p.sede,80);
    });
  }catch(e){}
  return est;
}
/* Pesos chilenos. Toda la plata del juego está en MILLONES de pesos de la época. */
function plata(v){
  v=+v||0;
  const a=Math.abs(v), sg=v<0?"−$":"$";
  /* 7.9039 · montos chicos (un informe, un sueldo de CM, una apuesta): en pesos, no "$0 M" o "$1 M" */
  if(a>0 && a<1) return sg+(Math.round(a*1000)*1000).toLocaleString("es-CL");
  if(a<10 && Math.abs(a-Math.round(a))>=0.05) return sg+a.toLocaleString("es-CL",{minimumFractionDigits:1,maximumFractionDigits:1})+" M";
  const n=Math.round(v);
  return (n<0?"−$":"$")+Math.abs(n).toLocaleString("es-CL")+" M";
}
function pesosLargo(v){ return plata(v)+" (millones de pesos)"; }
function signo(v){ return (v>0?"+":"")+Math.round(v); }
function ordinal(n){ return n+"°"; }

const MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
function fechaTxt(f){ if(!f) return ""; return f.d?(f.d+" de "+MESES[f.m-1]):MESES[f.m-1]; }

/* ---------- guardado ---------- */
const LLAVE="futbolini3_save";
const _ram={};
const Store={
  async get(k){
    try{ if(window.storage&&window.storage.get){const r=await window.storage.get(k);return r&&r.value?JSON.parse(r.value):null;} }catch(e){}
    try{ const v=localStorage.getItem(k); return v?JSON.parse(v):null; }catch(e){}
    return _ram[k]!==undefined?_ram[k]:null;
  },
  async set(k,v){
    _ram[k]=v;
    try{ if(window.storage&&window.storage.set){ await window.storage.set(k,JSON.stringify(v)); return true; } }catch(e){}
    try{ localStorage.setItem(k,JSON.stringify(v)); return true; }catch(e){}
    return false;
  },
  async del(k){
    delete _ram[k];
    try{ if(window.storage&&window.storage.delete){ await window.storage.delete(k); } }catch(e){}
    try{ localStorage.removeItem(k); }catch(e){}
  }
};

/* ---------- avisos ---------- */
function aviso(txt,ms){
  const cont=$("#avisos"); if(!cont) return;
  const n=el("div","aviso"); n.textContent=String(txt==null?"":txt);
  cont.appendChild(n);
  setTimeout(()=>{ n.style.transition="opacity .3s"; n.style.opacity="0"; setTimeout(()=>n.remove(),320); }, ms||2600);
}
/* ---------- modal ---------- */
function modal(fn,opts){
  const capa=$("#capa-modal"); capa.innerHTML="";
  if(!document.body.classList.contains("con-modal")){
    document.body.dataset.scrollY=String(window.scrollY||0);
  }
  document.body.classList.add("con-modal");
  document.body.style.top=(-((+document.body.dataset.scrollY)||0))+"px";
  const fondo=el("div","modal-fondo");
  const caja=el("div","modal panel"+((opts&&opts.clase)?" "+opts.clase:""));
  fondo.appendChild(caja); capa.appendChild(fondo);
  fn(caja);
  if(!opts||opts.cerrarFuera!==false){
    fondo.addEventListener("click",e=>{ if(e.target===fondo) cerrarModal(); });
  }
  return caja;
}
function cerrarModal(){
  const c=$("#capa-modal"); if(c) c.innerHTML="";
  const y=parseInt(document.body.dataset.scrollY||"0",10)||0;
  document.body.classList.remove("con-modal");
  document.body.style.top="";
  delete document.body.dataset.scrollY;
  try{ window.scrollTo(0,y); }catch(e){}
}
function panel(titulo,icono,clase){
  const p=el("section","panel"+(clase?" "+clase:""));
  if(titulo!=null) p.appendChild(el("div","cab",'<span class="ic">'+(icono||"")+'</span><span>'+titulo+'</span>'));
  const c=el("div","cuerpo"); p.appendChild(c);
  p.cuerpo=c; return p;
}
function fila(k,v,cls){ return el("div","fila"+(cls?" "+cls:""),"<span>"+k+"</span><b>"+v+"</b>"); }
function barrita(v,color,max){
  const pct=clamp((v/(max||100))*100,0,100);
  return '<div class="barrita"><i style="width:'+pct+'%;--c:'+(color||"#5ec94f")+'"></i></div>';
}
/* ---------- burbujas de fondo ---------- */
function burbujas(){
  const c=$("#burbujas"); if(!c) return;
  c.innerHTML="";
  if(window.matchMedia&&window.matchMedia("(max-width:720px), (prefers-reduced-motion:reduce)").matches) return;
  const n=15;
  for(let i=0;i<n;i++){
    const b=el("i"), s=rnd(12,72);
    b.style.width=b.style.height=s+"px";
    b.style.left=rnd(-2,99)+"vw";
    b.style.animationDuration=rnd(18,44)+"s";
    b.style.animationDelay=(-rnd(0,44))+"s";
    b.style.opacity=rnd(.2,.75);
    c.appendChild(b);
  }
}
