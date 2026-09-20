"use strict";
/* ============================================================
   FUTBOLINI · mundo-epoca.js  (7.9013 · el mundo de fondo respeta el año)
   Bug de integridad: `mundoInit()` sembraba SIEMPRE las ligas y copas de 2026
   (Copa de la Liga, Libertadores/Sudamericana con planteles 2026, Copa Argentina),
   jugaras el año que jugaras. En una partida de 1991 el panel «Mientras tanto,
   afuera» mostraba Cusco FC y Bragantino.
   Acá se PODA lo que no existía ese año. Lo que no está modelado no se inventa:
   se dice que en esa época solo se sigue el Nacional.
   Carril Claude: wraps con flag `._ep`. No toca mundo.js ni motor.js.
   ============================================================ */

/* Desde qué año vale cada mundo modelado. Los datos son de 2026 (planteles,
   grupos, cupos), así que fuera de la era moderna no representan nada real. */
const MUNDO_LIGA_DESDE={
  "2026":2010, "2026b":2010, "2026cN":2010, "2026cS":2010,
  "arg2026":2010, "arg2026A":2010, "arg2026B":2010
};
const MUNDO_COPA_DESDE={ chile:2010, copaLiga:2020, lib:2010, sud:2010, arg:2011 };

function _epAnio(){ return (typeof E!=="undefined"&&E&&E.anio)||2026; }
function _epPropia(){
  try{ return (typeof _ligaKeyJugador==="function")?_ligaKeyJugador():null; }catch(e){ return null; }
}
/* true si este año NO tiene mundo modelado (toda época que no sea la moderna) */
function mundoEpocaLimitada(){
  if(typeof E==="undefined"||!E||!E.mundo) return false;
  return !!E.mundo.epocaLimitada;
}
/* Saca del mundo lo que no existía el año que se juega. Devuelve cuántas cosas podó. */
function mundoEpocaPodar(){
  if(typeof E==="undefined"||!E||!E.mundo) return 0;
  const anio=_epAnio(), propia=_epPropia();
  let podado=0;
  const L=E.mundo.ligas||{};
  Object.keys(L).forEach(function(k){
    if(k===propia) return;                       /* la liga del jugador nunca se toca */
    const desde=MUNDO_LIGA_DESDE[k];
    if(desde!=null && anio<desde){ delete L[k]; podado++; }
  });
  const C=E.mundo.copas||{};
  Object.keys(MUNDO_COPA_DESDE).forEach(function(c){
    if(anio<MUNDO_COPA_DESDE[c] && C[c] && (C[c].grupos||C[c].clubs||C[c].vivos||C[c].partidos)){
      C[c]={}; podado++;
    }
  });
  if(podado){
    /* lo ya escrito por un tick anterior también sobra */
    E.mundo.pais=[];
    E.mundo.noticias=[];
    E.mundo.vida=[];
    E.mundo.vidaEst={};
  }
  E.mundo.epocaLimitada=podado>0;
  return podado;
}
/* Texto honesto para cuando no hay mundo que mostrar. */
function mundoEpocaTexto(){
  const anio=_epAnio();
  const liga=(typeof E!=="undefined"&&E&&E.mundo&&E.mundo.ligas&&E.mundo.ligas[_epPropia()]);
  const nom=(liga&&liga.nom)||((typeof T==="function")?T("mep_nacional","el Nacional"):"el Nacional");
  const base=(typeof T==="function")
    ? T("mep_solo","En esta época solo se sigue el torneo local: el resto del continente no está modelado para este año.")
    : "En esta época solo se sigue el torneo local: el resto del continente no está modelado para este año.";
  return anio+" · "+nom+". "+base;
}

/* ---------- wraps ---------- */
/* Un wrap sobre un wrap pierde las marcas del anterior (`._mv`, `._jor10`…) y el
   archivo de abajo cree que nunca envolvió. Se heredan para no rearmar nada. */
function _epHeredar(nuevo,viejo){
  try{ Object.keys(viejo||{}).forEach(function(k){ nuevo[k]=viejo[k]; }); }catch(e){}
  return nuevo;
}
(function(){
  if(typeof mundoInit!=="function"||mundoInit._ep) return;
  const orig=mundoInit;
  mundoInit=function(){
    const r=orig.apply(this,arguments);
    try{ mundoEpocaPodar(); }catch(e){}
    return r;
  };
  _epHeredar(mundoInit,orig);
  mundoInit._ep=true;
})();
(function(){
  if(typeof mundoSimCopas!=="function"||mundoSimCopas._ep) return;
  const orig=mundoSimCopas;
  mundoSimCopas=function(){
    if(mundoEpocaLimitada()) return;             /* sin copas modeladas, no se simula nada */
    return orig.apply(this,arguments);
  };
  _epHeredar(mundoSimCopas,orig);
  mundoSimCopas._ep=true;
})();
/* red de seguridad: si un tick reabre el mundo con otro año, se vuelve a podar */
(function(){
  if(typeof mundoTick!=="function"||mundoTick._ep) return;
  const orig=mundoTick;
  mundoTick=function(){
    const r=orig.apply(this,arguments);
    try{ if(E&&E.mundo&&E.mundo.epocaLimitada){ E.mundo.pais=[]; } else mundoEpocaPodar(); }catch(e){}
    return r;
  };
  _epHeredar(mundoTick,orig);
  mundoTick._ep=true;
})();
/* el panel lo DICE, no lo esconde */
(function(){
  if(typeof panelJornada!=="function"||panelJornada._ep) return;
  const orig=panelJornada;
  panelJornada=function(){
    const p=orig.apply(this,arguments);
    try{
      if(p&&p.cuerpo&&mundoEpocaLimitada()) p.cuerpo.appendChild(el("p","mini",escHtml(mundoEpocaTexto())));
    }catch(e){}
    return p;
  };
  _epHeredar(panelJornada,orig);
  panelJornada._ep=true;
})();
(function(){
  if(typeof _jorTabla!=="function"||_jorTabla._ep) return;
  const orig=_jorTabla;
  _jorTabla=function(cont){
    const r=orig.apply(this,arguments);
    try{
      if(cont&&mundoEpocaLimitada()) cont.appendChild(el("p","mini",escHtml(mundoEpocaTexto())));
    }catch(e){}
    return r;
  };
  _epHeredar(_jorTabla,orig);
  _jorTabla._ep=true;
})();
