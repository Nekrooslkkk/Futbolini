"use strict";
/* ============================================================
   FUTBOLINI · mundo-vivo.js   (carril Claude · sigue la línea de 7.9011)
   El mundo se mueve y se VE: los clubes CPU hacen cosas y alguien las cuenta.

   Es una CAPA DE LECTURA sobre lo que ya existe (`E.mundo.pais`, `E.mundo.ligas`)
   más memoria propia en `E.mundo.vida` (máx 40). NO toca el motor, NO toca
   mercado.js, NO mueve planteles de la CPU: lo que cuenta, lo deriva de los
   resultados que el mundo ya simuló.

   Estado nuevo en E:
     E.mundo.vida = [{anio,idx,tipo,id,n,txt}]   (máx 40)
     E.mundo.vidaEst = {idClub:{sg,rg}}          (racha viva por club)
     E.mundo.vidaSem = última semana procesada
   ============================================================ */

function _mvT(k,d){ return (typeof T==="function")?T(k,d):d; }
function _mvSemana(){ return (typeof E!=="undefined"&&E)?(((E.anio||0)*100)+(E.idx||0)):0; }
function _mvNom(id){
  var c=(typeof clubMundo==="function")?clubMundo(id):null;
  return (c&&(c.n||c.c))||id;
}
function _mvEstado(){
  if(!E||!E.mundo) return {};
  if(!E.mundo.vidaEst||typeof E.mundo.vidaEst!=="object") E.mundo.vidaEst={};
  return E.mundo.vidaEst;
}
function mundoVida(){
  if(!E||!E.mundo) return [];
  if(!Array.isArray(E.mundo.vida)) E.mundo.vida=[];
  return E.mundo.vida;
}
function _mvApuntar(tipo,id,txt){
  var v=mundoVida();
  v.push({anio:E.anio,idx:E.idx||0,tipo:tipo,id:id||null,n:id?_mvNom(id):"",txt:txt});
  if(v.length>40) v.splice(0,v.length-40);
  return v[v.length-1];
}
/* puestos del mundo, por liga: para saber quién es puntero y quién es colista */
function _mvPuestos(key){
  var L=E&&E.mundo&&E.mundo.ligas&&E.mundo.ligas[key];
  if(!L||!L.tab) return {};
  var arr=Object.keys(L.tab).map(function(id){
    var t=L.tab[id]||{};
    return {id:id,pts:t.pts||0,dg:(t.gf||0)-(t.gc||0),gf:t.gf||0};
  });
  arr.sort(function(a,b){ return (b.pts-a.pts)||(b.dg-a.dg)||(b.gf-a.gf); });
  var m={};
  arr.forEach(function(x,i){ m[x.id]={pos:i+1,de:arr.length}; });
  return m;
}
function _mvLigaDe(id){
  var ligas=(E&&E.mundo&&E.mundo.ligas)||{};
  var keys=Object.keys(ligas);
  for(var i=0;i<keys.length;i++){
    if((ligas[keys[i]].ids||[]).indexOf(id)>=0) return keys[i];
  }
  return null;
}
var _MV_PUESTOS={};
function _mvPos(id){
  var k=_mvLigaDe(id); if(!k) return 0;
  if(!_MV_PUESTOS[k]) _MV_PUESTOS[k]=_mvPuestos(k);
  return (_MV_PUESTOS[k][id]||{}).pos||0;
}

/* ---------- 1) leer los resultados nuevos y armar la racha de cada club ---------- */
/* Los partidos de `E.mundo.pais` se marcan con `_v` una sola vez: es la única
   marca que dejamos sobre datos ajenos, y no cambia ningún resultado. */
function _mvLeerResultados(){
  var est=_mvEstado(), nuevos=[];
  ((E.mundo&&E.mundo.pais)||[]).forEach(function(x){
    if(!x||x._v) return;
    x._v=1;
    if(!x.idA||!x.idB) return;
    nuevos.push(x);
    [[x.idA,x.ga,x.gb],[x.idB,x.gb,x.ga]].forEach(function(par){
      var id=par[0], gf=par[1], gc=par[2];
      if(E.club&&id===E.club) return;                /* tu club ya se cuenta solo */
      var e=est[id]||(est[id]={sg:0,rg:0});
      if(gf>gc){ e.rg=(e.rg||0)+1; e.sg=0; }
      else { e.rg=0; e.sg=(e.sg||0)+1; }
    });
  });
  return nuevos;
}

/* ---------- 2) de la racha salen las noticias ---------- */
function _mvElegir(lista,sem){
  if(!lista.length) return null;
  return lista[(sem*5)%lista.length];
}
var PUESTOS_MV=["un arquero","un lateral","un central","un volante de marca","un volante creativo","un extremo","un delantero"];

function mundoVivoTick(){
  if(!E||E._bulkSim||!E.mundo) return [];
  var sem=_mvSemana();
  _MV_PUESTOS={};                                   /* los puestos se recalculan por tick */
  var nuevos=_mvLeerResultados();
  if(E.mundo.vidaSem===sem) return [];              /* una vez por semana */
  E.mundo.vidaSem=sem;
  var est=_mvEstado(), salida=[];

  /* a) el técnico que se cae: 4 fechas sin ganar */
  var caidos=Object.keys(est).filter(function(id){ return (est[id].sg||0)>=4; });
  var caido=_mvElegir(caidos,sem);
  if(caido){
    est[caido].sg=0;
    salida.push(_mvApuntar("dt",caido,
      _mvNom(caido)+" cortó al entrenador: cuatro fechas sin ganar y la paciencia se acabó."));
  }

  /* b) el que se puso en racha */
  var enRacha=Object.keys(est).filter(function(id){ return (est[id].rg||0)>=3 && est[id].rg!==est[id].av; });
  var racha=_mvElegir(enRacha,sem+1);
  if(racha){
    est[racha].av=est[racha].rg;                    /* no repetir la misma racha */
    var pos=_mvPos(racha);
    salida.push(_mvApuntar("racha",racha,
      _mvNom(racha)+" lleva "+est[racha].rg+" triunfos al hilo"+(pos?" y anda "+(typeof ordinal==="function"?ordinal(pos):pos+"°"):"")+"."));
  }

  /* c) el mercado de los otros (sin inventar nombres de jugadores) */
  if(typeof mercadoAbierto==="function"&&mercadoAbierto()){
    var key=_mvLigaDe(E.club)||Object.keys((E.mundo.ligas)||{})[0];
    var ids=((E.mundo.ligas&&E.mundo.ligas[key])?E.mundo.ligas[key].ids:[]).filter(function(i){ return i!==E.club; });
    if(ids.length>=2){
      var a=ids[(sem*3)%ids.length], b=ids[(sem*3+1+((sem*7)%(ids.length-1)))%ids.length];
      if(a!==b){
        var pu=PUESTOS_MV[(sem*11)%PUESTOS_MV.length];
        salida.push(_mvApuntar("fichaje",b,
          _mvNom(b)+" le sacó "+pu+" a "+_mvNom(a)+". El mercado no descansa."));
      }
    }
  }

  /* d) el golpe de la fecha: un club de abajo le gana a uno de los tres de arriba */
  var golpes=nuevos.filter(function(x){
    var pa=_mvPos(x.idA), pb=_mvPos(x.idB);
    if(!pa||!pb) return false;
    if(x.ga>x.gb) return pb<=3 && pa>=8;
    if(x.gb>x.ga) return pa<=3 && pb>=8;
    return false;
  });
  var g=_mvElegir(golpes,sem+2);
  if(g){
    var gana=(g.ga>g.gb)?g.idA:g.idB, pierde=(g.ga>g.gb)?g.idB:g.idA;
    var marca=(g.ga>g.gb)?(g.ga+"-"+g.gb):(g.gb+"-"+g.ga);
    salida.push(_mvApuntar("golpe",gana,
      _mvNom(gana)+" le ganó "+marca+" a "+_mvNom(pierde)+". Nadie lo tenía en la quiniela."));
  }
  return salida;
}

/* lo que pasó esta semana (o lo último, si la semana fue tranquila) */
function mundoVivoSemana(){
  var v=mundoVida();
  var hoy=v.filter(function(x){ return x.anio===E.anio && x.idx===(E.idx||0); });
  return hoy.length?hoy:v.slice(-3);
}
function _mvIcono(tipo){
  return {dt:"🧉",racha:"🔥",fichaje:"💸",golpe:"😮"}[tipo]||"•";
}
function _mvEtq(tipo){
  return {dt:_mvT("mv_dt","Cambio de banca"),
          racha:_mvT("mv_racha","Racha"),
          fichaje:_mvT("mv_fichaje","Se movió el mercado"),
          golpe:_mvT("mv_golpe","Golpe de la fecha")}[tipo]||"";
}
function _mvLinea(x){
  return el("div","fila mv-linea","<span><b class='mv-ic'>"+_mvIcono(x.tipo)+"</b> "+escHtml(x.txt)+"</span>");
}

/* ---------- 3) se ve: panel del escritorio ---------- */
function panelMundoVivo(){
  if(!E||!E.mundo) return null;
  var l=mundoVivoSemana();
  if(!l.length) return null;
  var p=panel(_mvT("mv_tit","El mundo se movió"),"🌎","agua");
  l.slice(-4).forEach(function(x){ p.cuerpo.appendChild(_mvLinea(x)); });
  if(mundoVida().length>l.length){
    var b=el("button","btn-aqua chico gris",_mvT("mv_ver","Ver todo lo que pasó"));
    b.onclick=function(){ modalMundoVivo(); };
    p.cuerpo.appendChild(b);
  }
  return p;
}
function modalMundoVivo(){
  modal(function(box){
    var cuerpo=(typeof montarBarraSO==="function")
      ? montarBarraSO(box,_mvT("mv_tit","El mundo se movió"),"🌎",function(){ cerrarModal(); })
      : (function(){ box.appendChild(el("div","cab",'<span class="ic">🌎</span><span>'+_mvT("mv_tit","El mundo se movió")+'</span>')); var c=el("div","cuerpo"); box.appendChild(c); return c; })();
    var v=mundoVida().slice().reverse();
    if(!v.length) cuerpo.appendChild(el("p","mini",_mvT("mv_nada","Semana tranquila afuera. Nadie se movió.")));
    v.forEach(function(x){
      var f=_mvLinea(x);
      f.appendChild(el("b","mini","F"+((x.idx||0)+1)+" · "+_mvEtq(x.tipo)));
      cuerpo.appendChild(f);
    });
  },{clase:"ventana-so"});
}

/* ---------- 4) enganches (wraps, nada reescrito) ---------- */
/* el mundo se mueve cuando el mundo simula */
(function wrapMundoTickMV(){
  if(typeof mundoTick!=="function"||mundoTick._mv) return;
  var orig=mundoTick;
  mundoTick=function(part){
    var r=orig.apply(this,arguments);
    try{ mundoVivoTick(); }catch(e){}
    return r;
  };
  mundoTick._mv=true;
})();
/* "La liga se movió" del escritorio suma lo de afuera */
(function wrapPanelJornadaMV(){
  if(typeof panelJornada!=="function"||panelJornada._mv) return;
  var orig=panelJornada;
  panelJornada=function(){
    var p=orig.apply(this,arguments);
    try{
      var l=mundoVivoSemana();
      if(p&&l.length){
        p.cuerpo.appendChild(el("h3","sub",_mvT("mv_tit","El mundo se movió")));
        l.slice(-3).forEach(function(x){ p.cuerpo.appendChild(_mvLinea(x)); });
      }
    }catch(e){}
    return p;
  };
  panelJornada._mv=true;
})();
/* el resumen de la fecha en vivo también lo cuenta */
(function wrapJorTablaMV(){
  if(typeof _jorTabla!=="function"||_jorTabla._mv) return;
  var orig=_jorTabla;
  _jorTabla=function(cont){
    var r=orig.apply(this,arguments);
    try{
      var l=mundoVivoSemana();
      if(cont&&l.length){
        cont.appendChild(el("h3","sub",_mvT("mv_tit","El mundo se movió")));
        l.slice(-3).forEach(function(x){ cont.appendChild(_mvLinea(x)); });
      }
    }catch(e){}
    return r;
  };
  _jorTabla._mv=true;
})();
/* si el escritorio no tiene jornada que mostrar, el mundo igual se cuenta */
(function wrapEscritorioMV(){
  if(typeof vistaEscritorio!=="function"||vistaEscritorio._mv) return;
  var orig=vistaEscritorio;
  vistaEscritorio=function(){
    var r=orig.apply(this,arguments);
    try{
      if(typeof SEC!=="undefined"&&SEC!=="escritorio") return r;
      var vista=document.getElementById("vista");
      if(!vista||vista.textContent.indexOf(_mvT("mv_tit","El mundo se movió"))>=0) return r;
      var p=panelMundoVivo(); if(!p) return r;
      var rej=vista.querySelector(".rejilla.dos");
      var der=rej&&rej.children[1];
      (der||rej||vista).appendChild(p);
    }catch(e){}
    return r;
  };
  vistaEscritorio._mv=true;
  vistaEscritorio._jor10=true;   /* el wrap de la jornada ya corrió: no rearmar */
  vistaEscritorio._sit84=true;
})();
