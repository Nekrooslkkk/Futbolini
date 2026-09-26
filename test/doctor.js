/* FUTBOLINI · test/doctor.js (7.9078) · corre el DOCTOR completo sobre UNA partida.
   test/doctor.sh lo llama una vez por partida, cada una en un navegador limpio (sin estado compartido).
   La partida llega en el hash: #CC,2026,historico */
(function(){
  var pp=(location.hash||"#CC,2026,historico").slice(1).split(",");
  pp[1]=+pp[1]||pp[1];
  var OUT=[], malos=0;
  function correr(){
    try{
      nuevaPartida(pp[0],pp[1],pp[2]||"historico");
      var res=devDoctor({sinHistoria:true});
      OUT.push("== "+pp.join(" ")+" · "+res.veredicto.toUpperCase()+" "+res.ok+"/"+res.total);
      res.checks.filter(function(c){ return !c.ok; }).forEach(function(c){
        malos++;
        OUT.push("  ❌ "+c.id+" — "+c.txt+"  📍 "+(c.donde||"?"));
        (c.detalle||[]).slice(0,6).forEach(function(d){ OUT.push("       · "+d); });
      });
    }catch(e){ malos++; OUT.push("== "+pp.join(" ")+" · EXPLOTÓ: "+e.message); }
    OUT.push("DOCTOR_DONE:"+(malos?"FAIL":"PASS"));
    var pre=document.getElementById("out"); if(pre) pre.textContent=OUT.join("\n");
  }
  window.addEventListener("DOMContentLoaded",function(){ setTimeout(function(){ try{ var o=document.getElementById("arranque"); if(o) o.remove(); }catch(e){} correr(); },300); });
})();
