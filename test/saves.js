/* FUTBOLINI · test/saves.js (7.9110) · partidas guardadas con versiones viejas del juego (test/saves/*.json.gz,
   generadas corriendo esas versiones de verdad) tienen que cargar, pintarse y seguir jugándose en la actual.
   test/saves.sh descomprime y deja window.SAVES_VIEJOS antes de este script. */
(function(){
  window.addEventListener("DOMContentLoaded",function(){ setTimeout(function(){
    var OUT=[], malos=0, n=0;
    try{ var o=document.getElementById("arranque"); if(o) o.remove(); }catch(e){}
    (window.SAVES_VIEJOS||[]).forEach(function(pack){
      Object.keys(pack.saves).forEach(function(k){
        n++;
        var r=probarSaveViejo(pack.saves[k]);
        if(r.fallas.length){ malos++; OUT.push("❌ save "+pack.v+" · "+k); r.fallas.slice(0,8).forEach(function(x){ OUT.push("     · "+x); }); }
        else OUT.push("✓ save "+pack.v+" · "+k+" · "+r.resumen);
      });
    });
    if(!n){ malos++; OUT.push("❌ no llegó ninguna partida vieja (¿test/saves vacío?)"); }
    OUT.push("SAVES: "+n+" partida(s), "+malos+" con fallas");
    OUT.push("SAVES_DONE:"+(malos?"FAIL":"PASS"));
    document.getElementById("out").textContent=OUT.join("\n");
  },300); });
})();
