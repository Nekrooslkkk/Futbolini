"use strict";
/* ============================================================
   FUTBOLINI 3.0 · util.js
   Helpers, guardado y azar. No sabe nada del juego.
   ============================================================ */

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

/* Pesos chilenos. Toda la plata del juego está en MILLONES de pesos de la época. */
function plata(v){
  const n=Math.round(v);
  const s=Math.abs(n).toLocaleString("es-CL");
  return (n<0?"−$":"$")+s+" M";
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
  const n=el("div","aviso",txt); cont.appendChild(n);
  setTimeout(()=>{ n.style.transition="opacity .3s"; n.style.opacity="0"; setTimeout(()=>n.remove(),320); }, ms||2600);
}
/* ---------- modal ---------- */
function modal(fn,opts){
  const capa=$("#capa-modal"); capa.innerHTML="";
  const fondo=el("div","modal-fondo");
  const caja=el("div","modal panel"+((opts&&opts.clase)?" "+opts.clase:""));
  fondo.appendChild(caja); capa.appendChild(fondo);
  fn(caja);
  if(!opts||opts.cerrarFuera!==false){
    fondo.addEventListener("click",e=>{ if(e.target===fondo) cerrarModal(); });
  }
  return caja;
}
function cerrarModal(){ $("#capa-modal").innerHTML=""; }
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
  const n=window.innerWidth<640?8:15;
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
