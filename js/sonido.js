"use strict";
/* ============================================================
   FUTBOLINI · sonido.js — 7.9123
   Clic, aviso, gol y pitazo con un oscilador. Sin archivos y sin licencia de terceros.
   Se calla si Animaciones OFF (body.anim-off) o si el interruptor de Ajustes está en off.
   No toca el motor del partido: solo suena cuando alguien ya festeja o arranca.
   ============================================================ */
let _sonCtx=null;
let _sonUlt=0;
function sonidoPermitido(){
  if(typeof document!=="undefined"&&document.body&&document.body.classList.contains("anim-off")) return false;
  try{ if(localStorage.getItem("futbolini3_sonido")==="off") return false; }catch(e){ return false; }
  return true;
}
function sonar(tipo){
  if(!sonidoPermitido()) return;
  var ahora=Date.now();
  if(tipo==="click"&&ahora-_sonUlt<70) return;
  _sonUlt=ahora;
  var AC=window.AudioContext||window.webkitAudioContext;
  if(!AC) return;
  var hz=tipo==="pitazo"?1400:(tipo==="gol"?660:(tipo==="aviso"?520:880));
  var dur=tipo==="pitazo"?0.16:(tipo==="gol"?0.2:(tipo==="aviso"?0.07:0.03));
  try{
    if(!_sonCtx) _sonCtx=new AC();
    if(_sonCtx.state==="suspended"){ var p=_sonCtx.resume(); if(p&&p.catch) p.catch(function(){}); }
    var t=_sonCtx.currentTime, o=_sonCtx.createOscillator(), g=_sonCtx.createGain();
    o.type=tipo==="pitazo"?"square":"sine";
    o.frequency.value=hz;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(tipo==="gol"?0.07:0.035,t+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(_sonCtx.destination);
    o.start(t); o.stop(t+dur+0.02);
    if(tipo==="gol"){
      var o2=_sonCtx.createOscillator();
      o2.type="sine"; o2.frequency.setValueAtTime(880,t+0.06);
      o2.connect(g); o2.start(t+0.06); o2.stop(t+0.2);
    }
  }catch(e){}
}
function montarSonidoAjuste(host){
  var v=host||document.getElementById("vista");
  if(!v||v.querySelector(".aj-sonido")) return;
  var dest=null, grupos=v.querySelectorAll(".aj-grupo"), i;
  for(i=0;i<grupos.length;i++){
    if(/Animaciones/.test(grupos[i].textContent||"")){ dest=grupos[i]; break; }
  }
  if(!dest){
    var anim=v.querySelector(".aj-anim-74");
    dest=anim&&(anim.cuerpo||anim.querySelector(".cuerpo"));
  }
  /* Sin un panel suelto: Ajustes ya repartió todo en pestañas y un panel nuevo queda sin pestaña. */
  if(!dest) return;
  var off=false;
  try{ off=localStorage.getItem("futbolini3_sonido")==="off"; }catch(e){}
  var nota=el("p","mini","Clic, aviso, gol y pitazo. Si apagas las animaciones, el sonido también se calla.");
  var f=el("div","fichas aj-sonido");
  [["on","Sonido on"],["off","Sonido off"]].forEach(function(par){
    var b=el("button","ficha",par[1]);
    b.setAttribute("aria-pressed",(off?"off":"on")===par[0]?"true":"false");
    b.onclick=function(){
      try{ localStorage.setItem("futbolini3_sonido",par[0]); }catch(e){}
      if(typeof render==="function") render();
    };
    f.appendChild(b);
  });
  dest.appendChild(nota);
  dest.appendChild(f);
}
(function engancharSonido(){
  if(typeof notificar==="function"&&!notificar._son){
    var o=notificar;
    var w=function(n){
      var r=o.apply(this,arguments);
      try{ if(r&&n&&n.tipo&&n.tipo!=="neutro") sonar("aviso"); }catch(e){}
      return r;
    };
    Object.keys(o).forEach(function(k){ w[k]=o[k]; });
    w._son=true; w._orig=o;
    notificar=w;
  }
  document.addEventListener("pointerdown",function(ev){
    if(!ev.isTrusted) return;
    var t=ev.target&&ev.target.closest&&ev.target.closest("button,a.ficha,.ficha");
    if(!t) return;
    sonar("click");
  },true);
  if(typeof vistaAjustes==="function"&&!vistaAjustes._son){
    var oa=vistaAjustes;
    var wa=function(host){
      var r=oa.apply(this,arguments);
      try{ montarSonidoAjuste(host); }catch(e){}
      return r;
    };
    Object.keys(oa).forEach(function(k){ wa[k]=oa[k]; });
    wa._son=true; wa._orig=oa;
    vistaAjustes=wa;
  }
})();
