"use strict";
/* ============================================================
   FUTBOLINI · federacion-poder.js  (8.x · Modo Asociación — Fase 1)
   LA IDEA GRANDE (estilo Victoria III): no solo diriges tu club; si juntas
   suficiente poder, subes a CONTROLAR LA ASOCIACIÓN que manda el fútbol
   (ANFP en Chile, AFA en Argentina) y desde ahí mueves las palancas:
   repartir la TV, reformar el torneo, amañar, presionar a la CONMEBOL/FIFA
   y —a futuro— pelear con las otras asociaciones.

   Sátira con respeto: NO se acusa a personas reales de nada. El "dirigente",
   el "consejo de presidentes" y la "asociación" son entes de juego. Todo el
   poder se ejerce como jugador ficticio, igual que las Jugadas de poder.

   Aislado: archivo nuevo. Envuelve `vistaInstitucion` (patrón de dev-editor.js)
   para colgar el panel. Cargar en index.html DESPUÉS de ui.js y federacion.js.
   No toca el motor: usa aplicarEfectos/aplicarGrupos/aplicarRep/E.mods + guardar/render.
   ============================================================ */
(function(){

  /* ---------- estado (lazy, a prueba de saves viejos) ---------- */
  function fedEstado(){
    if(typeof E!=="object"||!E) return null;
    if(!E.fed) E.fed={ presidente:false, mandato:0, sospecha:0, reformas:[], electo:0, campanas:0 };
    if(E.fed.reformas==null) E.fed.reformas=[];
    return E.fed;
  }
  function _sigla(){ return (typeof fedSigla==="function")?fedSigla():"ANFP"; }
  function _nombreFed(){ return (typeof fedNombre==="function")?fedNombre():"la Asociación"; }
  function _clubN(){ return (E&&E.clubNombre)||(E&&E.club)||"tu club"; }

  /* ---------- requisitos para postular a la presidencia ---------- */
  /* No es gratis llegar: hay que pesar en la asociación, tener capital político
     y prestigio institucional. Se muestran como barras de progreso. */
  var FED_REQ=[
    { k:"anfp",      n:"Peso en la asociación", meta:25,
      get:function(){ return (E.grupos&&E.grupos.anfp)?E.grupos.anfp.aprob:0; } },
    { k:"capital",   n:"Capital político",      meta:60,
      get:function(){ return E.capital||0; } },
    { k:"prestigio", n:"Prestigio del club",    meta:55,
      get:function(){ return (E.ind&&E.ind.prestigio)||0; } }
  ];
  function fedFaltantes(){
    return FED_REQ.filter(function(r){ return r.get()<r.meta; });
  }
  function fedPuedePostular(){ return fedFaltantes().length===0; }
  /* probabilidad de ganar la elección: peso ANFP + prestigio + credibilidad */
  function fedProbEleccion(){
    var anfp=(E.grupos&&E.grupos.anfp)?E.grupos.anfp.aprob:0;
    var pres=(E.ind&&E.ind.prestigio)||0;
    var cred=(E.rep&&E.rep.credibilidad)||50;
    var p=0.18 + (anfp/200) + ((pres-50)/220) + ((cred-50)/300);
    return Math.max(0.1, Math.min(0.9, p));
  }

  /* ---------- postularse ---------- */
  function fedPostular(){
    var f=fedEstado(); if(!f) return;
    if(f.presidente){ if(typeof aviso==="function") aviso("Ya presides "+_sigla()); return; }
    if(!fedPuedePostular()){ if(typeof aviso==="function") aviso("Todavía no tienes peso para postular"); return; }
    var costo=40;
    if((E.capital||0)<costo){ if(typeof aviso==="function") aviso("Necesitas "+costo+" de capital para lanzar la campaña"); return; }
    var prob=fedProbEleccion();
    if(typeof confirm==="function" && !confirm("Postular a la presidencia de "+_sigla()+" cuesta "+costo+" de capital. Chance de ganar: ~"+Math.round(prob*100)+"%. ¿Lanzar la campaña?")) return;
    E.capital=Math.max(0,(E.capital||0)-costo);
    f.campanas=(f.campanas||0)+1;
    var gana=Math.random()<prob;
    if(gana){
      f.presidente=true; f.mandato=0; f.electo=E.anio||0;
      if(typeof aplicarRep==="function") aplicarRep({credibilidad:6});
      if(typeof recordar==="function") recordar("poder","ganaste la presidencia de "+_sigla(),{peso:"alto",tono:"bueno"});
      if(typeof notificar==="function") notificar({t:"🏛️ Presidente de "+_sigla(),tipo:"bueno",bandeja:true,
        d:"Ganaste la elección. Desde hoy controlas el calendario, la plata de TV y las bases. Úsalo con cabeza… o no."});
      if(typeof aviso==="function") aviso("🏛️ ¡Ganaste! Ahora presides "+_sigla());
    } else {
      if(typeof aplicarGrupos==="function") aplicarGrupos({anfp:-8,prensa:-4});
      if(typeof recordar==="function") recordar("poder","perdiste la elección de "+_sigla(),{peso:"medio",tono:"malo"});
      if(typeof notificar==="function") notificar({t:"🗳️ Elección perdida",tipo:"malo",bandeja:false,
        d:"El consejo de presidentes no te dio los votos. Quedaste expuesto: habrá que reconstruir peso."});
      if(typeof aviso==="function") aviso("🗳️ Perdiste la elección. A juntar votos de nuevo.");
    }
    if(typeof guardar==="function") guardar();
    if(typeof render==="function") render();
  }

  /* ---------- poderes de la asociación (solo como presidente) ---------- */
  /* Cada poder usa el sistema de efectos que ya existe. Los corruptos suben la
     SOSPECHA; con sospecha alta, cada movida puede detonar un escándalo que te
     saca del cargo. El riesgo es real: el poder total tiene precio. */
  function _mod(id,n,ef,anios){
    if(!Array.isArray(E.mods)) E.mods=[];
    var ex=E.mods.find(function(x){return x.id===id;});
    if(ex){ ex.hasta=(E.anio||0)+(anios||1); ex.ef=ef; }
    else E.mods.push({id:id,n:n,hasta:(E.anio||0)+(anios||1),ef:ef});
  }
  var FED_PODERES=[
    { id:"tv_favor", ic:"💰", n:"Repartir la TV a tu favor", corrupto:true, sospecha:14, costo:0,
      d:"Inclinas el reparto de los derechos de TV hacia "+"tu club. Entra plata; los otros presidentes lo notan.",
      hacer:function(){
        if(typeof aplicarEfectos==="function") aplicarEfectos({plata:260});
        if(typeof aplicarGrupos==="function") aplicarGrupos({anfp:-6,sponsors:4});
        return "Se movió el reparto: +"+(typeof plata==="function"?plata(260):"$260 M")+" para "+_clubN()+".";
      } },
    { id:"reforma", ic:"📐", n:"Reformar el torneo", corrupto:false, sospecha:4, costo:16,
      d:"Cambias las bases del campeonato. Ganas prestigio de estadista… y algún enemigo.",
      elige:true },
    { id:"amanar", ic:"🧑‍⚖️", n:"Amañar el arbitraje", corrupto:true, sospecha:24, costo:10,
      d:"Aprietas a los árbitros para la próxima temporada de "+"tu club. Alto riesgo si se filtra.",
      hacer:function(){
        _mod("fed_arb","Guiño arbitral (asociación)",{arbitraje:4},2);
        if(typeof aplicarGrupos==="function") aplicarGrupos({hinchada:3});
        return "Los pitos van a mirar a "+_clubN()+" con mejores ojos (2 temporadas).";
      } },
    { id:"conmebol", ic:"🌎", n:"Presionar a la CONMEBOL", corrupto:false, sospecha:8, costo:22,
      d:"Mueves los hilos por un cupo internacional y peso continental. Es el primer paso hacia la FIFA.",
      hacer:function(){
        if(typeof aplicarEfectos==="function") aplicarEfectos({prestigio:6});
        if(!E.flags) E.flags={}; E.flags.fed_conmebol=(E.flags.fed_conmebol||0)+1;
        return "Sumaste peso en la CONMEBOL (×"+E.flags.fed_conmebol+"). La FIFA queda un poco más cerca.";
      } },
    { id:"guerra", ic:"⚔️", n:"Pelear con la otra asociación", corrupto:false, sospecha:6, costo:20,
      d:"Cruzas la cordillera: le disputas amistosos, sponsors y figuras a la asociación vecina. Notoriedad pura.",
      hacer:function(){
        if(typeof aplicarEfectos==="function") aplicarEfectos({prestigio:4});
        if(typeof aplicarRep==="function") aplicarRep({dureza:5});
        if(!E.flags) E.flags={}; E.flags.fed_guerra=(E.flags.fed_guerra||0)+1;
        return "Le declaraste la guerra fría a la asociación vecina. La prensa del continente te mira.";
      } }
  ];

  var FED_REFORMAS=[
    { id:"tv_todos", n:"Reparto de TV más parejo", d:"Todos los clubes reciben mejor: baja tu riesgo institucional.",
      ef:function(){ if(typeof aplicarEfectos==="function") aplicarEfectos({riesgo:-8}); } },
    { id:"menos_desc", n:"Bajar los descensos", d:"Menos equipos bajan: la hinchada respira, los chicos te aman.",
      ef:function(){ if(typeof aplicarGrupos==="function") aplicarGrupos({hinchada:6,comunidad:6,directorio:-3}); } },
    { id:"pro_grandes", n:"Torneo para los grandes", d:"Más cupos y plata a los poderosos: sponsors felices, provincia molesta.",
      ef:function(){ if(typeof aplicarGrupos==="function") aplicarGrupos({sponsors:8,comunidad:-6}); if(typeof aplicarEfectos==="function") aplicarEfectos({prestigio:4}); } }
  ];

  function fedHacerPoder(p){
    var f=fedEstado(); if(!f) return;
    if(!f.presidente){ if(typeof aviso==="function") aviso("Primero tienes que presidir "+_sigla()); return; }
    if((E.capital||0)<(p.costo||0)){ if(typeof aviso==="function") aviso("No te alcanza el capital ("+p.costo+")"); return; }
    if(p.elige){ return fedElegirReforma(); }
    E.capital=Math.max(0,(E.capital||0)-(p.costo||0));
    var msg=p.hacer?p.hacer():"";
    f.sospecha=Math.min(100,(f.sospecha||0)+(p.sospecha||0));
    if(typeof notificar==="function") notificar({t:(p.corrupto?"🕵️ ":"🏛️ ")+p.n,tipo:p.corrupto?"neutro":"bueno",bandeja:false,d:msg});
    if(typeof aviso==="function") aviso((p.corrupto?"🕵️ ":"🏛️ ")+msg);
    if(p.corrupto) fedChequearEscandalo();
    if(typeof guardar==="function") guardar();
    if(typeof render==="function") render();
  }

  function fedElegirReforma(){
    var f=fedEstado();
    if(typeof modal!=="function"){ /* fallback sin modal */ var r=FED_REFORMAS[0]; r.ef(); f.reformas.push(r.id); return; }
    modal(function(box){
      box.appendChild(el("div","cab",'<span class="ic">📐</span><span>Reforma del torneo · '+_sigla()+'</span>'));
      var c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini","Firmas una reforma de las bases. Queda registrada en tu mandato. Cuesta 16 de capital."));
      FED_REFORMAS.forEach(function(r){
        var b=el("button","op");
        b.innerHTML='<div class="t">'+r.n+'</div><div class="d">'+r.d+'</div>';
        b.onclick=function(){
          if((E.capital||0)<16){ if(typeof aviso==="function") aviso("No te alcanza el capital"); return; }
          E.capital=Math.max(0,(E.capital||0)-16);
          r.ef(); f.reformas.push(r.id); f.sospecha=Math.min(100,(f.sospecha||0)+4);
          if(typeof recordar==="function") recordar("poder","reformaste el torneo: "+r.n,{peso:"medio",tono:"bueno"});
          if(typeof aviso==="function") aviso("📐 Reforma firmada: "+r.n);
          if(typeof cerrarModal==="function") cerrarModal();
          if(typeof guardar==="function") guardar();
          if(typeof render==="function") render();
        };
        c.appendChild(b);
      });
      var x=el("button","btn-aqua ancho gris","Cerrar"); x.style.marginTop="8px"; x.onclick=cerrarModal;
      c.appendChild(x);
    });
  }

  /* ---------- escándalo: el poder total tiene precio ---------- */
  function fedChequearEscandalo(){
    var f=fedEstado(); if(!f||!f.presidente) return;
    var riesgo=Math.max(0,(f.sospecha-30))/140;   /* recién sobre 30 de sospecha empieza a doler */
    if(Math.random()<riesgo){
      f.presidente=false; var m=f.mandato||0; f.mandato=0; f.sospecha=Math.max(0,f.sospecha-40);
      if(typeof aplicarRep==="function") aplicarRep({credibilidad:-18,dureza:-6});
      if(typeof aplicarGrupos==="function") aplicarGrupos({anfp:-20,prensa:-14,socios:-8});
      E.capital=Math.max(0,(E.capital||0)-20);
      if(typeof recordar==="function") recordar("poder","estalló un escándalo y te sacaron de "+_sigla(),{peso:"alto",tono:"malo"});
      if(typeof notificar==="function") notificar({t:"💣 Escándalo en "+_sigla(),tipo:"malo",bandeja:true,
        d:"Se filtró todo. El consejo te destituye tras "+m+" año(s) de mandato. Tu credibilidad queda por el suelo."});
      if(typeof aviso==="function") aviso("💣 Escándalo: te sacaron de "+_sigla());
      return true;
    }
    return false;
  }

  /* inserta el panel justo DESPUÉS de "Jugadas de poder" (la escalada natural del
     poder); si no lo encuentra, lo cuelga al final. */
  function _insertarPanel(v,p){
    try{
      var ps=v.querySelectorAll(".panel");
      for(var i=0;i<ps.length;i++){
        var cab=ps[i].querySelector(".cab");
        if(cab && (cab.textContent||"").indexOf("Jugadas de poder")>=0){
          v.insertBefore(p, ps[i].nextSibling); return;
        }
      }
    }catch(e){}
    v.appendChild(p);
  }

  /* ---------- el panel (se cuelga de Institución) ---------- */
  function panelAsociacion(v){
    if(typeof E!=="object"||!E||!E.grupos||!E.grupos.anfp) return;
    var f=fedEstado(); if(!f) return;
    var sig=_sigla();
    var p=(typeof panel==="function")?panel("La Asociación · "+sig,"🏛️","agua"):null;
    if(!p) return;

    if(!f.presidente){
      p.cuerpo.appendChild(el("p","mini","Tu club es una pieza; "+_nombreFed()+" es el tablero. Junta peso y postúlate a la <b>presidencia de "+sig+"</b> para controlar el fútbol desde arriba."));
      var faltan=fedFaltantes();
      FED_REQ.forEach(function(r){
        var val=Math.round(r.get()), ok=val>=r.meta;
        var d=el("div");
        d.innerHTML='<div class="fila" style="border:none;padding:2px 0"><span>'+(ok?"✅":"⏳")+" "+r.n+'</span><b>'+val+" / "+r.meta+'</b></div>'+
          (typeof barrita==="function"?barrita(Math.min(val,r.meta),ok?"#4fbf3f":"#d68a1f",r.meta):"");
        p.cuerpo.appendChild(d);
      });
      var bp=el("button","btn-aqua ancho verde","🏛️ Postular a la presidencia de "+sig+" (40 cap.)");
      bp.disabled=!fedPuedePostular()||(E.capital||0)<40;
      if(fedPuedePostular()) bp.title="Chance de ganar: ~"+Math.round(fedProbEleccion()*100)+"%";
      bp.onclick=function(){ fedPostular(); };
      p.cuerpo.appendChild(bp);
      if(faltan.length) p.cuerpo.appendChild(el("p","mini","Te falta: "+faltan.map(function(r){return r.n.toLowerCase();}).join(", ")+". Sube tu peso con las Jugadas de poder y ganando en la cancha."));
      _insertarPanel(v,p);
      return;
    }

    /* --- presidente en ejercicio --- */
    p.cuerpo.appendChild(el("h2","tit","🏛️ Presides "+sig));
    p.cuerpo.appendChild(el("p","mini","Mandato: <b>"+(f.mandato||0)+" año(s)</b> · desde "+(f.electo||E.anio)+". Controlas el calendario, la TV y las bases. El poder total tiene precio: cada movida turbia sube la <b>sospecha</b>."));
    /* medidor de sospecha */
    var col=f.sospecha>=60?"#c9392c":(f.sospecha>=30?"#d68a1f":"#4fbf3f");
    p.cuerpo.appendChild(el("div","fila","<span>🕵️ Sospecha</span><b>"+Math.round(f.sospecha||0)+" / 100</b>"));
    if(typeof barrita==="function") p.cuerpo.appendChild(el("div",null,barrita(f.sospecha||0,col)));
    p.cuerpo.appendChild(el("p","mini",f.sospecha>=60?"⚠ Estás al borde: una movida más y puede estallar todo.":(f.sospecha>=30?"La prensa ya husmea. Cuida las corruptelas.":"Por ahora nadie sospecha nada.")));
    if(f.reformas&&f.reformas.length){
      var rn=f.reformas.map(function(id){ var r=FED_REFORMAS.filter(function(x){return x.id===id;})[0]; return r?r.n:id; });
      p.cuerpo.appendChild(el("p","mini","<b>Reformas firmadas:</b> "+rn.join(" · ")));
    }
    p.cuerpo.appendChild(el("h3","sub","Poderes de la asociación"));
    FED_PODERES.forEach(function(pw){
      var b=el("button","op"); b.disabled=(E.capital||0)<(pw.costo||0);
      b.innerHTML='<div class="t">'+pw.ic+" "+pw.n+(pw.costo?(" · "+pw.costo+" cap."):"")+(pw.corrupto?' <span class="mini" style="color:#c9392c">turbio +'+pw.sospecha+' sospecha</span>':"")+'</div><div class="d">'+pw.d+'</div>';
      b.onclick=function(){ fedHacerPoder(pw); };
      p.cuerpo.appendChild(b);
    });
    p.cuerpo.appendChild(el("p","mini","Fase 1 del <b>Modo Asociación</b>. Vienen: guerra abierta entre asociaciones, el salto a la <b>FIFA</b> y control del fútbol mundial."));
    _insertarPanel(v,p);
  }

  /* ---------- avance de año: sube el mandato, baja algo la sospecha ---------- */
  /* Se engancha a render de forma barata: si cambió el año, corre una vez. */
  function fedTickAnio(){
    var f=fedEstado(); if(!f||!f.presidente) return;
    if(f._ultAnio===undefined) f._ultAnio=E.anio;
    if(E.anio>f._ultAnio){
      f.mandato=(f.mandato||0)+(E.anio-f._ultAnio);
      f.sospecha=Math.max(0,(f.sospecha||0)-6*(E.anio-f._ultAnio));   /* el tiempo enfría el escándalo */
      f._ultAnio=E.anio;
    } else if(E.anio<f._ultAnio){ f._ultAnio=E.anio; }
  }

  /* ---------- wraps (no tocan ui.js) ---------- */
  if(typeof vistaInstitucion==="function" && !vistaInstitucion._fedPoder){
    var origVI=vistaInstitucion;
    vistaInstitucion=function(){
      origVI.apply(this,arguments);
      try{ var v=document.getElementById("vista"); if(v) panelAsociacion(v); }catch(e){ if(window.console) console.error("fed-poder:",e); }
    };
    vistaInstitucion._fedPoder=true;
  }
  if(typeof render==="function" && !render._fedPoder){
    var origR=render;
    render=function(){ try{ fedTickAnio(); }catch(e){} return origR.apply(this,arguments); };
    render._fedPoder=true;
  }

  /* expuesto (para tests y para el resto del juego) */
  window.fedEstado=fedEstado;
  window.fedPuedePostular=fedPuedePostular;
  window.fedPostular=fedPostular;
  window.fedHacerPoder=fedHacerPoder;
  window.fedChequearEscandalo=fedChequearEscandalo;
  window.panelAsociacion=panelAsociacion;
  window.FED_PODERES=FED_PODERES;
  window.FED_REQ=FED_REQ;
})();
