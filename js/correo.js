"use strict";
/* ============================================================
   FUTBOLINI · correo.js — 7.9145
   Bandeja tipo Hotmail 2007, con color Aero. Se abre desde el ícono
   del escritorio (no desde la campana). La dirección queda fija en la
   partida. Los informes y el resumen de la semana llegan como correo,
   escrito en segunda persona.
   ============================================================ */
var CORREO_NOMBRES=["fabian","sebastian","camilo","matias","diego","nicolas","javier","andres","pablo","rodrigo","cristian","gonzalo","felipe","ignacio","tomas","benjamin","martin","joaquin","lucas","vicente"];
var CORREO_MAX=200;

function _correoSinTilde(s){
  return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}
function correoTld(){
  try{
    if(typeof paisDeEra==="function"){
      var p=String(paisDeEra()||"");
      if(/arg/i.test(p)) return "ar";
      if(/bra/i.test(p)) return "br";
    }
  }catch(e){}
  var era=String((E&&(E.eraBase||E.liga))||"");
  if(/arg|afa/i.test(era)) return "ar";
  return "cl";
}
function correoAbrev(){
  var id=String((E&&E.club)||"").toUpperCase();
  if(id && id.length<=4) return id;
  var n=_correoSinTilde((E&&E.clubNombre)||"Club").replace(/[^a-zA-Z ]/g," ").replace(/\s+/g," ").trim();
  var p=n.split(" ").filter(Boolean);
  if(p.length>=2) return (p[0].slice(0,3).charAt(0).toUpperCase()+p[0].slice(1,3).toLowerCase())+(p[1].charAt(0).toUpperCase()+p[1].slice(1).toLowerCase());
  return (p[0]||"Club").slice(0,8);
}
function correoAsegurar(){
  if(!E) return null;
  E.correo=E.correo||{};
  if(!E.correo.direccion){
    var nom=CORREO_NOMBRES[Math.floor(Math.random()*CORREO_NOMBRES.length)];
    var club=_correoSinTilde(E.clubNombre||"club").replace(/[^a-zA-Z]/g,"");
    var n=1+Math.floor(Math.random()*9);
    E.correo.direccion=nom+"_"+correoAbrev()+n+"@"+(club||"club").toLowerCase()+"."+correoTld();
  }
  if(!Array.isArray(E.correo.mails)) E.correo.mails=[];
  return E.correo;
}
function correoPush(m){
  var c=correoAsegurar(); if(!c||!m) return;
  c.mails.unshift({
    id:"m"+(E.anio||0)+"_"+(E.idx||0)+"_"+c.mails.length+"_"+Math.floor(Math.random()*999),
    anio:E.anio, idx:E.idx,
    de:m.de||"Ayudante del club",
    asunto:String(m.asunto||"Aviso").slice(0,90),
    cuerpo:String(m.cuerpo||"").slice(0,700),
    leido:false
  });
  if(c.mails.length>CORREO_MAX) c.mails.length=CORREO_MAX;
}
function correoSinLeer(){
  var c=E&&E.correo; if(!c||!c.mails) return 0;
  return c.mails.filter(function(m){ return m&&!m.leido; }).length;
}
function correoResumen(lineas){
  if(!E) return;
  if(E.piloto&&E.piloto.sinResumen) return;
  var cuerpo="Este es tu resumen de la semana: "+(lineas&&lineas.length?("resolviste "+lineas.length+" cosa"+(lineas.length>1?"s":"")+". "+lineas.join(" ")): "no tuviste que mover nada.");
  correoPush({de:"Syntergia", asunto:"Resumen de la semana "+(E.idx+1), cuerpo:cuerpo});
}

function _correoDecisiones(){
  var out=[];
  (E&&E.decPend||[]).forEach(function(x){
    var d=(typeof decisionPorId==="function")?decisionPorId(x.id):null;
    if(!d) return;
    out.push({x:x,d:d});
  });
  return out;
}

function abrirCorreo(){
  correoAsegurar();
  if(typeof modal!=="function") return;
  modal(function(box){
    box.classList.add("correo-win");
    var cab=el("div","cab"); cab.appendChild(el("span","ic","✉️")); cab.appendChild(el("span",null,"Correo"));
    box.appendChild(cab);
    var cuerpo=el("div","cuerpo correo-cuerpo");
    var bar=el("div","correo-bar");
    bar.appendChild(el("b",null,"Hotmail del club"));
    bar.appendChild(el("span","correo-dir",E.correo.direccion));
    cuerpo.appendChild(bar);
    var lay=el("div","correo-lay");
    var lista=el("div","correo-lista");
    var leer=el("div","correo-leer");
    function pintarLeer(m, dec){
      leer.innerHTML="";
      if(dec){
        leer.appendChild(el("div","correo-as","Decisión · "+(typeof resolverTokens==="function"?resolverTokens(dec.d.t,E):dec.d.t)));
        leer.appendChild(el("p","mini","Llegó a tu bandeja porque sigue sobre la mesa. Elige como lo harías en el club."));
        (dec.d.op||[]).forEach(function(op,i){
          var b=el("button","btn-aqua chico",op.t);
          b.onclick=function(){
            try{ resolverDecision(dec.d,i); }catch(e){}
            if(typeof guardar==="function") guardar();
            cerrarModal();
            if(typeof render==="function") render();
          };
          leer.appendChild(b);
        });
        return;
      }
      if(!m){ leer.appendChild(el("p","mini","Elige un mensaje. Los informes del ayudante y el resumen de la semana quedan acá.")); return; }
      m.leido=true;
      leer.appendChild(el("div","correo-as",m.asunto));
      leer.appendChild(el("p","mini","De "+m.de+" · "+(m.anio||"")+(m.idx!=null?" · semana "+(m.idx+1):"")));
      leer.appendChild(el("p",null,m.cuerpo));
      pintarLista();
    }
    function pintarLista(){
      lista.innerHTML="";
      var decs=_correoDecisiones();
      if(decs.length){
        lista.appendChild(el("div","correo-sec","Sobre la mesa"));
        decs.forEach(function(dec){
          var b=el("button","correo-item nuevo");
          b.innerHTML="<b>"+escHtml(typeof resolverTokens==="function"?resolverTokens(dec.d.t,E):dec.d.t)+"</b><span>decisión pendiente</span>";
          b.onclick=function(){ pintarLeer(null, dec); };
          lista.appendChild(b);
        });
      }
      lista.appendChild(el("div","correo-sec","Bandeja de entrada"));
      var mails=(E.correo.mails||[]);
      if(!mails.length) lista.appendChild(el("p","mini correo-vacio","Todavía no te llega nada. Cuando Syntergia o el ayudante hagan algo, el informe cae acá."));
      mails.forEach(function(m){
        var b=el("button","correo-item"+(m.leido?"":" nuevo"));
        b.innerHTML="<b>"+escHtml(m.asunto)+"</b><span>"+escHtml(m.de)+"</span>";
        b.onclick=function(){ pintarLeer(m,null); if(typeof guardar==="function") guardar(); };
        lista.appendChild(b);
      });
    }
    pintarLista();
    pintarLeer(null,null);
    lay.appendChild(lista); lay.appendChild(leer);
    cuerpo.appendChild(lay);
    var bx=el("button","btn-aqua chico gris","Cerrar"); bx.onclick=function(){ cerrarModal(); if(typeof render==="function") render(); };
    cuerpo.appendChild(bx);
    box.appendChild(cuerpo);
  },{clase:"correo-modal"});
}

(function wrapCorreo(){
  if(typeof nuevaPartida==="function"&&!nuevaPartida._correo){
    var o=nuevaPartida;
    nuevaPartida=function(){ var r=o.apply(this,arguments); try{ if(E){ E.correo=null; correoAsegurar(); } }catch(e){} return r; };
    try{ Object.keys(o).forEach(function(k){ nuevaPartida[k]=o[k]; }); }catch(e){}
    nuevaPartida._correo=true;
  }
  if(typeof normalizarEstado==="function"&&!normalizarEstado._correo){
    var n=normalizarEstado;
    normalizarEstado=function(){ var r=n.apply(this,arguments); try{ correoAsegurar(); }catch(e){} return r; };
    try{ Object.keys(n).forEach(function(k){ normalizarEstado[k]=n[k]; }); }catch(e){}
    normalizarEstado._correo=true;
  }
  if(typeof ayudanteHacer==="function"&&!ayudanteHacer._correo){
    var h=ayudanteHacer;
    ayudanteHacer=function(id){
      var t=h.apply(this,arguments);
      try{
        if(t && !E._correoLote && !(E.piloto&&E.piloto.sinResumen)){
          correoPush({
            de:id==="decisiones"?"Tú":"Ayudante del club",
            asunto:id==="decisiones"?"Resolviste las decisiones":"El ayudante se encargó",
            cuerpo:id==="decisiones"?("Este es tu resumen: "+t):t
          });
        }
      }catch(e){}
      return t;
    };
    ayudanteHacer._correo=true;
  }
  if(typeof syntergiaTurno==="function"&&!syntergiaTurno._correo){
    var s=syntergiaTurno;
    syntergiaTurno=function(){
      if(E) E._correoLote=true;
      var hechas=[];
      try{ hechas=s.apply(this,arguments)||[]; }
      finally{ if(E) E._correoLote=false; }
      try{ if(hechas.length) correoResumen(hechas); }catch(e){}
      return hechas;
    };
    syntergiaTurno._correo=true;
  }
})();
