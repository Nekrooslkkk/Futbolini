"use strict";
/* ============================================================
   FUTBOLINI · epoca-intro.js  (7.82)
   Inmersión de época en los modos históricos: un panel arriba del Escritorio
   que cuenta EN QUÉ época estás y sus hechos reales (1925 = nacimiento de
   Colo-Colo; 2006 = Apertura/Clausura de Borghi). Datos verificados de Grok.

   Aislado (envuelve vistaEscritorio, patrón de data-epocas-78.js): no toca
   ninguna función existente. En 2026/1991 no aparece (cero cambio ahí).
   Cargar DESPUÉS de ui.js.
   ============================================================ */
(function(){
  if(typeof vistaEscritorio!=="function" || vistaEscritorio._intro82) return;
  var orig=vistaEscritorio;
  vistaEscritorio=function(){
    orig();
    try{ pintarIntroEpoca(); }catch(e){}
  };
  vistaEscritorio._intro82=true;

  function linea(txt){ return el("p","mini",txt); }
  function pintarIntroEpoca(){
    if(typeof E==="undefined" || !E) return;
    var era=E.eraBase;
    if(era!==1925 && era!==2006) return;           /* solo modos históricos */
    var v=document.getElementById("vista"); if(!v) return;
    if(v.querySelector(".intro-epoca")) return;    /* no duplicar */
    var nom=(typeof ERA==="object"&&ERA[era]&&ERA[era].n)?ERA[era].n:String(era);
    var p=panel("📜 "+nom+" · en esta época","📜","agua");
    p.classList.add("intro-epoca");
    if(typeof ERA==="object"&&ERA[era]&&ERA[era].desc) p.cuerpo.appendChild(linea(ERA[era].desc));

    if(era===1925 && E.club==="CC" && typeof FUNDACION_CC_1925==="object"){
      var f=FUNDACION_CC_1925;
      p.cuerpo.appendChild(el("h3","sub","El nacimiento del Cacique"));
      if(f.fecha)      p.cuerpo.appendChild(linea("<b>Fundación:</b> "+f.fecha+(f.lugar?". "+f.lugar:"")));
      if(f.origen)     p.cuerpo.appendChild(linea("<b>Origen:</b> "+f.origen));
      if(f.nombre)     p.cuerpo.appendChild(linea("<b>El nombre:</b> "+f.nombre));
      if(f.uniforme)   p.cuerpo.appendChild(linea("<b>La camiseta:</b> "+f.uniforme));
      if(f.lema)       p.cuerpo.appendChild(linea("<b>Lema:</b> "+f.lema));
      if(f.presidente) p.cuerpo.appendChild(linea("<b>Conducción:</b> "+f.presidente));
      if(typeof FORMAT_1925==="object"){
        if(FORMAT_1925.debut)  p.cuerpo.appendChild(linea("<b>Debut:</b> "+FORMAT_1925.debut));
        if(FORMAT_1925.juego)  p.cuerpo.appendChild(linea("<b>El torneo:</b> "+FORMAT_1925.juego));
      }
      p.cuerpo.appendChild(el("p","mini","Datos verificados (Wikipedia 1925). El plantel documentado es el de Colo-Colo; el resto es cantera. Época amateur: no hay redes, mercado millonario ni Libertadores."));
    } else if(era===1925){
      p.cuerpo.appendChild(el("p","mini","Fútbol amateur de 1925, Liga Metropolitana de Deportes. Una rueda, la victoria vale 2 puntos. Sin redes ni mercado millonario."));
    } else if(era===2006 && typeof FORMAT_2006==="object"){
      var g=FORMAT_2006;
      p.cuerpo.appendChild(el("h3","sub","Cómo se jugó el 2006"));
      if(g.apertura)    p.cuerpo.appendChild(linea("<b>Apertura:</b> "+g.apertura));
      if(g.clausura)    p.cuerpo.appendChild(linea("<b>Clausura:</b> "+g.clausura));
      if(g.goleadores)  p.cuerpo.appendChild(linea("<b>Goleadores:</b> "+g.goleadores));
      if(g.descenso)    p.cuerpo.appendChild(linea("<b>Descenso:</b> "+g.descenso));
      if(g.juego)       p.cuerpo.appendChild(el("p","mini",g.juego));
    }
    v.insertBefore(p, v.firstChild);
  }
  /* expuesto por si se quiere invocar directo */
  window.pintarIntroEpoca=pintarIntroEpoca;
})();
