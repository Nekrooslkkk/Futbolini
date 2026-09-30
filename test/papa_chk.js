/* FUTBOLINI · test/papa_chk.js (7.9120) · el juego juntado: llegó entero, nada choca con el navegador, nada cambió de alcance */
(function(){
  var OUT=[], malos=0;
  function ok(c,t){ OUT.push((c?"  ✅ ":"  ❌ ")+t); if(!c) malos++; }
  function fin(){ OUT.push("PAPA_DONE:"+(malos?"FAIL":"PASS")); document.getElementById("out").textContent=OUT.join("\n"); }
  window.addEventListener("load",function(){ setTimeout(function(){
    try{
      ok(self.__papaOK===1,"el paquete llegó entero (self.__papaOK)");
      ok(document.documentElement.classList.contains("papa")===modoPapa(),"la marca <html class=papa> sigue la elección del jugador (el Modo papa de la pantalla va aparte de la carga)");
      var js=[].slice.call(document.querySelectorAll("script[src]")).map(function(s){ return s.getAttribute("src"); }).filter(function(s){ return /^js\//.test(s); });
      ok(js.length===2,"el juego se pide en 2 archivos (paquete + guardia), no en 130: "+js.join(", "));
      var n=window.__papaNombres||[], fuera=n.filter(function(x){ return !Object.prototype.hasOwnProperty.call(window,x); });
      ok(n.length>100&&!fuera.length,"los "+n.length+" nombres de primer nivel son globales"+(fuera.length?" · estos estaban DENTRO de una función: "+fuera.slice(0,8).join(", "):""));
      var fr=document.createElement("iframe"); document.body.appendChild(fr);
      var choca=n.filter(function(x){ return x in fr.contentWindow; }); fr.remove();
      ok(!choca.length,"ningún nombre del juego pisa algo del navegador"+(choca.length?": "+choca.join(", "):""));
      ok(typeof nuevaPartida==="function"&&nuevaPartida("CC",2026,"historico")!==false&&E&&E.club==="CC","se arma una partida en el juego juntado");
      var t0=performance.now(); ["escritorio","plantel","calendario","mercado","vida"].forEach(function(s){ SEC=s; render(); }); var ms=performance.now()-t0;
      ok(ms<3000,"5 secciones se pintan ("+Math.round(ms)+" ms)");
      ok(typeof modoPapa==="function","el Modo papa sabe que está (js/papa.js)");
      ok(!!document.querySelector("#arranque .arr-papa")||!document.getElementById("arranque"),"la pantalla de inicio ofrece el botón 🥔 Modo papa");
    }catch(e){ ok(false,"error: "+e.message); }
    fin();
  },1500); });
})();
