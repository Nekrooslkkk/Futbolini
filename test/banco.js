/* FUTBOLINI · test/banco.js (7.9110) · BANCO DE PRUEBAS POR EQUIPO.
   test/banco.sh lo llama con una tanda de clubes en el hash (#CC,UCH,RIV o #TODOS/3/0 = tercio 0 de todos).
   Por cada club × cada punto de inicio que ve el jugador (puntosDeInicio) × modo (histórico; libre en el
   primer punto): arranca la partida por el MISMO camino del botón (argsInicio), revisa el arranque, juega una
   temporada entera (simularTemporadasSync), y revisa el cierre y el año siguiente. Cada falla sale con club,
   época y qué se rompió. */
(function(){
  var OUT=[], malos=0, n=0;
  var errsJS=[];
  var TEMPS=+((location.search.match(/temps=(\d+)/)||[])[1])||1;
  window.addEventListener("error",function(e){ errsJS.push((e.message||"error")+" @"+(e.filename||"").split("/").pop()+":"+(e.lineno||"?")); });
  function lista(){
    var h=decodeURIComponent((location.hash||"#TODOS/1/0").slice(1));
    var todos=bancoClubes();
    if(h.indexOf("TODOS")===0){
      var p=h.split("/"), k=+p[1]||1, i=+p[2]||0;
      return todos.filter(function(_,j){ return j%k===i; });
    }
    return h.split(",").filter(Boolean);
  }
  function correr(){
    var ids=lista();
    var elegibles=bancoClubes();
    ids.forEach(function(id){
      var pts=[];
      if(elegibles.indexOf(id)<0){ malos++; OUT.push("❌ "+id+" · no es un club elegible en el selector (¿id mal escrito?)"); return; }
      try{ pts=puntosDeInicio(id); }catch(e){ malos++; OUT.push("❌ "+id+" · puntosDeInicio explotó: "+e.message); return; }
      if(!pts.length){ malos++; OUT.push("❌ "+id+" · no tiene ningún punto de inicio"); return; }
      pts.forEach(function(pt,i){
        ["historico","libre"].forEach(function(modo){
          if(modo==="libre"&&i>0) return;
          n++;
          var r=bancoUno(id,pt,modo,TEMPS);
          if(r.fallas.length){ malos++; OUT.push("❌ "+id+" · "+pt.etq+" · "+modo); r.fallas.slice(0,8).forEach(function(f){ OUT.push("     · "+f); }); }
          else OUT.push("✓ "+id+" · "+pt.etq+" · "+modo+" · "+r.resumen);
        });
      });
    });
    OUT.push("BANCO: "+n+" partida(s), "+malos+" con fallas");
    OUT.push("BANCO_DONE:"+(malos?"FAIL":"PASS"));
    var pre=document.getElementById("out"); if(pre) pre.textContent=OUT.join("\n");
  }
  window.addEventListener("DOMContentLoaded",function(){ setTimeout(function(){ try{ var o=document.getElementById("arranque"); if(o) o.remove(); }catch(e){} try{ correr(); }catch(e){ OUT.push("BANCO EXPLOTÓ: "+e.message+"\nBANCO_DONE:FAIL"); document.getElementById("out").textContent=OUT.join("\n"); } },300); });
})();
