/* FUTBOLINI · test/duelo.js (7.9116) · dos jugadores de verdad (dos copias del juego) arman una sala y juegan un duelo */
(function(){
  var OUT=[], malos=0;
  function ok(c,t){ OUT.push((c?"  ✅ ":"  ❌ ")+t); if(!c) malos++; }
  function fin(){ OUT.push("DUELO_DONE:"+(malos?"FAIL":"PASS")); document.getElementById("out").textContent=OUT.join("\n"); }
  var A,B;
  function M(w){ return w.globalPorNombre("MP"); }
  function esperar(cond,ms){ return new Promise(function(res){ var t0=Date.now(); (function p(){ var v=false; try{ v=cond(); }catch(e){} if(v) return res(true); if(Date.now()-t0>ms) return res(false); setTimeout(p,50); })(); }); }
  function boton(w,txt){ return Array.prototype.find.call(w.document.querySelectorAll(".duelo-modal button"),function(b){ return b.textContent.indexOf(txt)>=0&&!b.disabled; }); }
  function clic(w,txt){ var b=boton(w,txt); if(b){ b.click(); return true; } return false; }
  function campo(w,tipo){ return w.document.querySelector(".duelo-modal .duelo-campo input"+(tipo?"[type="+tipo+"]":"")); }
  function texto(w){ var m=w.document.querySelector(".duelo-modal"); return m?m.textContent:""; }
  async function correr(){
    A=document.getElementById("A").contentWindow; B=document.getElementById("B").contentWindow;
    await esperar(function(){ return typeof A.modalDuelo==="function"&&typeof B.modalDuelo==="function"; },20000);
    [A,B].forEach(function(w){ var o=w.document.getElementById("arranque"); if(o) o.remove(); });
    ok(A.__peerFalso&&B.__peerFalso,"las dos copias usan el buzón de prueba");
    /* 1 · crear sala con contraseña */
    M(A).yo="Ana"; A.modalDuelo();
    ok(clic(A,"Crear sala"),"botón Crear sala");
    await esperar(function(){ return campo(A,"password"); },3000);
    campo(A,"password").value="secreta"; clic(A,"Crear sala");
    ok(await esperar(function(){ return A.document.querySelector(".duelo-codigo"); },5000),"la sala muestra su código");
    var cod=(A.document.querySelector(".duelo-codigo").textContent||"").trim().slice(0,5);
    ok(A.mpCodigoValido(cod),"código de 5 letras: "+cod);
    /* 2 · clave mala */
    M(B).yo='<img src=x onerror="window.__xss=1">Beto';
    B.modalDuelo({codigo:cod});
    await esperar(function(){ return campo(B,"password"); },3000);
    ok(campo(B).value===cod,"el link ?sala= deja el código puesto");
    campo(B,"password").value="mala"; clic(B,"Entrar");
    ok(await esperar(function(){ return /Contraseña equivocada/.test(texto(B)); },5000),"con la clave mala no entra");
    ok(!!A.document.querySelector(".duelo-espera"),"el anfitrión sigue esperando");
    /* 3 · clave buena */
    B.cerrarModal(); B.modalDuelo({codigo:cod});
    await esperar(function(){ return campo(B,"password"); },3000);
    campo(B,"password").value="secreta"; clic(B,"Entrar");
    ok(await esperar(function(){ return A.document.querySelector(".duelo-vs")&&B.document.querySelector(".duelo-vs"); },5000),"con la clave buena los dos llegan al vestuario");
    ok(!A.__xss&&!Array.prototype.some.call(A.document.querySelectorAll(".duelo-vs img"),function(i){ return !i.classList.contains("esc-img"); }),"un nombre con código HTML llega escapado");
    /* 4 · un tercero no entra a una sala llena */
    ok(B.mpValidarMsg(JSON.stringify({tipo:"club",club:"<script>"}))===null&&B.mpValidarMsg(JSON.stringify({tipo:"hackear"}))===null&&B.mpValidarMsg("x".repeat(3000))===null,"mensajes raros del rival se descartan");
    /* 5 · clubes y listo */
    A.document.querySelectorAll(".duelo-club")[0].click();
    await esperar(function(){ return M(B).rivalClub; },3000);
    B.document.querySelectorAll(".duelo-club")[1].click();
    await esperar(function(){ return M(A).rivalClub; },3000);
    clic(A,"Listo"); await esperar(function(){ return M(B).rivalListo; },3000); clic(B,"Listo");
    ok(await esperar(function(){ return A.document.querySelector(".duelo-modal .marcador-vivo")&&B.document.querySelector(".duelo-modal .marcador-vivo"); },5000),"arranca el duelo en los dos (marcador como en los partidos)");
    ok(!!A.document.querySelector(".duelo-modal canvas.cancha2d"),"el duelo trae la cancha");
    /* 6 · jugar las 9 jugadas (B no elige nunca: tiene que correr el reloj y jugar "equilibrado") */
    var t0=Date.now();
    while(Date.now()-t0<240000){
      var fa=M(A).duel&&M(A).duel.fase, fb=M(B).duel&&M(B).duel.fase;
      if(fa==="fin"&&fb==="fin") break;
      var op=A.document.querySelector(".duelo-ops button"); if(op) op.click();
      await new Promise(function(r){ setTimeout(r,300); });
    }
    ok(M(A).duel&&M(A).duel.fase==="fin"&&M(B).duel&&M(B).duel.fase==="fin","se juegan las 9 jugadas hasta el final (el reloj elige por el que no elige)");
    var ma=A.duelMarcador(), mb=B.duelMarcador();
    ok(ma[0]===mb[1]&&ma[1]===mb[0],"el marcador cuadra en los dos lados: "+ma.join("-")+" / "+mb.join("-"));
    ok((M(A).duel.relato||[]).length>=9,"el relato tiene las jugadas ("+(M(A).duel.relato||[]).length+")");
    /* 7 · fuerza bruta: 6 claves malas y la sala se cierra */
    B.mpReset(); A.mpReset(); A.cerrarModal(); B.cerrarModal();
    A.modalDuelo(); clic(A,"Crear sala"); await esperar(function(){ return campo(A,"password"); },3000);
    campo(A,"password").value="otra"; clic(A,"Crear sala");
    await esperar(function(){ return A.document.querySelector(".duelo-codigo"); },5000);
    var cod2=M(A).codigo;
    for(var i=0;i<A.globalPorNombre("DUELO_MAX_MALAS");i++){ try{ await B.mpEntrarSala(cod2,"x"+i); }catch(e){} await esperar(function(){ return !M(B).conn; },3000); await new Promise(function(r){ setTimeout(r,400); }); }
    ok(await esperar(function(){ return /cerramos la sala/.test(texto(A)); },5000),"después de "+A.globalPorNombre("DUELO_MAX_MALAS")+" claves malas la sala se cierra");
    fin();
  }
  window.addEventListener("load",function(){ correr().catch(function(e){ ok(false,"EXPLOTÓ: "+e.message); fin(); }); });
})();
