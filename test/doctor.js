/* FUTBOLINI · test/doctor.js (7.9078) · corre el DOCTOR completo sobre UNA partida.
   test/doctor.sh lo llama una vez por partida, cada una en un navegador limpio (sin estado compartido).
   La partida llega en el hash: #CC,2026,historico */
(function(){
  var pp=(location.hash||"#CC,2026,historico").slice(1).split(",");
  pp[1]=+pp[1]||pp[1];
  var OUT=[], malos=0;
  function pintar(res){
    OUT.push("== "+pp.join(" ")+" · "+res.veredicto.toUpperCase()+" "+res.ok+"/"+res.total);
    res.checks.filter(function(c){ return !c.ok; }).forEach(function(c){
      malos++;
      OUT.push("  ❌ "+c.id+" — "+c.txt+"  📍 "+(c.donde||"?"));
      (c.detalle||[]).slice(0,6).forEach(function(d){ OUT.push("       · "+d); });
    });
  }
  function fin(){
    OUT.push("DOCTOR_DONE:"+(malos?"FAIL":"PASS"));
    var pre=document.getElementById("out"); if(pre) pre.textContent=OUT.join("\n");
  }
  function correr(){
    try{
      /* 7.9125 · bajo --virtual-time-budget IndexedDB tarda "segundos" virtuales y sus topes de espera saltan al azar:
         acá las partidas van por localStorage (el mismo camino que usa el juego sin base). IndexedDB se prueba con tiempo
         real en test/partidas.sh. */
      if(typeof PARTIDAS!=="undefined") PARTIDAS.apagada=true;
      nuevaPartida(pp[0],pp[1],pp[2]||"historico");
      /* 7.9125 · el doctor completo: también los chequeos asíncronos (guardar/cargar partidas) */
      if(typeof devDoctorCompleto==="function"){
        devDoctorCompleto({sinHistoria:true}).then(function(res){ pintar(res); fin(); })
          .catch(function(e){ malos++; OUT.push("== "+pp.join(" ")+" · EXPLOTÓ: "+e.message); fin(); });
        return;
      }
      pintar(devDoctor({sinHistoria:true}));
    }catch(e){ malos++; OUT.push("== "+pp.join(" ")+" · EXPLOTÓ: "+e.message); }
    fin();
  }
  window.addEventListener("DOMContentLoaded",function(){ setTimeout(function(){ try{ var o=document.getElementById("arranque"); if(o) o.remove(); }catch(e){} correr(); },300); });
})();
