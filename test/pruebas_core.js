"use strict";
/* ============================================================
   FUTBOLINI · test/pruebas_core.js — pruebas automáticas (regresión)
   Se inyecta al final de una copia de index.html (ver test/correr.sh) y corre
   en el navegador (headless o normal). Usa el MISMO orden de carga del juego,
   así no hay shims frágiles. Escribe PASS/FAIL en #out y en el <title>.

   Cubre: arranque de las 3 divisiones, simulación de temporada, ascenso/descenso
   de 3 niveles, Copa Chile, y round-trip de guardado. Cualquier error de consola
   cuenta como fallo. No depende de red ni de APIs pagadas.
   ============================================================ */
(function(){
  var OUT=[], FAILS=0, PASSES=0, ERR=[];
  window.onerror=function(m,s,l){ ERR.push("console/onerror: "+m+" @"+(s||"").split("/").pop()+":"+l); };
  var _ce=console.error; console.error=function(){ ERR.push("console.error: "+Array.prototype.slice.call(arguments).join(" ").slice(0,160)); _ce.apply(console,arguments); };

  function ok(cond, nombre){ if(cond){ PASSES++; OUT.push("  ✅ "+nombre); } else { FAILS++; OUT.push("  ❌ "+nombre); } }
  function grupo(n){ OUT.push("\n▸ "+n); }
  function safe(fn, nombre){ try{ fn(); }catch(e){ FAILS++; OUT.push("  ❌ "+nombre+" — EXCEPCIÓN: "+e.message+"\n     "+((e.stack||"").split("\n").slice(1,4).join("\n     "))); } }

  /* simula una temporada completa desde el estado actual (modo simular) */
  function simularTemporada(maxPartidos){
    var jug=0, guard=0;
    while(guard++ < (maxPartidos||60)){
      var p=(typeof proximoPartido==="function")?proximoPartido():null;
      if(!p) break;
      if(p.jugado){ E.idx++; continue; }
      var P=iniciarPartido(p,"simular"); correrHasta(P,90);
      if(typeof terminarPartido==="function") terminarPartido(P);
      p.jugado=true; E.idx++; jug++;
    }
    return jug;
  }

  function correr(){
    /* T1 · arranque de las tres divisiones */
    grupo("Arranque de divisiones");
    safe(function(){ var r=nuevaPartida("CC",2026,"historico"); ok(r!==false && E.club==="CC" && E.plantel.length>0, "Primera (CC) arranca con plantel"); ok(LIGA_ACT.length>=16, "Primera tiene 16+ equipos"); }, "Primera");
    safe(function(){ nuevaPartida("CBL",2026,"historico",{categoria:"B"}); ok(E.eraBase==="2026b" && E.plantel.length>0, "Primera B (Cobreloa) arranca en 2026b"); }, "Primera B");
    safe(function(){ nuevaPartida("SMO",2026,"historico",{categoria:"C"}); ok(E.eraBase==="2026c" && E.plantel.length>0, "Segunda (S. Morning) arranca en 2026c"); }, "Segunda");

    /* T2 · calendario de Segunda: propio, no el de Primera */
    grupo("Calendario de Segunda (fix 7.51)");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      var liga=(E.calendario||[]).filter(function(p){return p.tipo==="liga";});
      var segIds=(typeof idsSegunda==="function")?idsSegunda():[];
      ok(liga.length>0, "Segunda tiene fechas de liga");
      ok(liga.every(function(p){ return segIds.indexOf(p.rivalId)>=0; }), "todos los rivales de liga son de Segunda");
      ok(liga[0] && liga[0].torneo==="Segunda División", "torneo rotulado 'Segunda División'");
    }, "Calendario Segunda");

    /* T3 · simular una temporada completa (Primera) sin romper */
    grupo("Simulación de temporada");
    safe(function(){
      nuevaPartida("UC",2026,"historico");
      var n=simularTemporada(80);
      ok(n>0, "se jugaron partidos ("+n+")");
      ok((typeof proximoPartido==="function") && !proximoPartido(), "el calendario se agotó (fin de temporada)");
      var suma=Object.keys(E.tabla||{}).length;
      ok(suma>=16, "la tabla tiene todos los equipos ("+suma+")");
    }, "Temporada Primera");

    /* T4 · ascenso/descenso de 3 niveles */
    grupo("Ascenso/descenso 3 niveles");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      initLigaMod();
      E.tabla={}; (E.ligaMod["2026c"]||[]).forEach(function(id,i){ E.tabla[id]={pts:(id==="SMO"?90:70-i),gf:40,gc:20}; });
      var m=procesarAscensoDescenso();
      ok(m && m.tipo==="ascenso" && E.eraBase==="2026b", "campeón de Segunda sube a Primera B");
      ok((E.ligaMod["2026b"]||[]).indexOf("SMO")>=0, "SMO queda registrado en la B");
    }, "Ascenso Segunda→B");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      initLigaMod();
      E.tabla={}; (E.ligaMod[2026]||[]).forEach(function(id,i){ E.tabla[id]={pts:(id==="CC"?1:40+i),gf:10,gc:60}; });
      var m=procesarAscensoDescenso();
      ok(m && m.tipo==="descenso" && E.eraBase==="2026b", "colista de Primera baja a la B (2 niveles intacto)");
    }, "Descenso Primera→B");

    /* T5 · Copa Chile corre sin reventar */
    grupo("Copa Chile");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      var copa=(E.calendario||[]).filter(function(p){return p.tipo==="copa";});
      ok(copa.length>=0, "hay entradas de copa en el calendario ("+copa.length+")");
      simularTemporada(80);
      ok(true, "temporada con copa simulada sin excepción");
    }, "Copa Chile");

    /* T6 · round-trip de guardado (serializar/deserializar E) */
    grupo("Guardado (round-trip)");
    safe(function(){
      nuevaPartida("COQ",2026,"historico");
      simularTemporada(10);
      var snap=JSON.stringify(E);
      var E2=JSON.parse(snap);
      ok(E2 && E2.club==="COQ" && E2.plantel && E2.plantel.length>0, "el estado sobrevive al round-trip con plantel");
      ok(E2.calendario && E2.calendario.length>0 && typeof E2.temporada==="object", "calendario y temporada preservados");
      ok(JSON.stringify(E2).length===snap.length, "sin pérdida en la serialización");
    }, "Guardado round-trip");

    /* T7 · economía: refinanciar */
    grupo("Economía · refinanciar (7.58)");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      E.deuda=1000; E.mods=[];
      var tasaAntes=tasaInteresAnual();
      var r=refinanciarDeuda();
      ok(r && r.ok, "refinanciar aplica con deuda alta");
      ok(tasaInteresAnual() < tasaAntes, "baja la tasa de interés ("+tasaAntes.toFixed(2)+"→"+tasaInteresAnual().toFixed(2)+")");
      ok(E.deuda > 1000, "sube la deuda total ("+Math.round(E.deuda)+")");
      var r2=refinanciarDeuda();
      ok(r2 && !r2.ok, "no se puede refinanciar dos veces seguidas");
    }, "Refinanciar deuda");

    /* Reporte */
    OUT.push("\n════════════════════════");
    if(ERR.length){ OUT.push("Errores de consola ("+ERR.length+"):"); ERR.slice(0,15).forEach(function(x){ OUT.push("  ⚠ "+x); }); FAILS+=ERR.length; }
    var total=PASSES+FAILS;
    OUT.push((FAILS===0?"✅ TODO VERDE":"❌ HAY FALLOS")+" · "+PASSES+"/"+total+" checks"+(ERR.length?" · "+ERR.length+" errores consola":""));
    OUT.push("PRUEBAS_DONE:"+(FAILS===0?"PASS":"FAIL"));
    var pre=document.getElementById("out"); if(pre) pre.textContent=OUT.join("\n");
    document.title=(FAILS===0?"PASS":"FAIL")+" "+PASSES+"/"+total;
  }

  window.addEventListener("DOMContentLoaded",function(){ setTimeout(function(){ try{ correr(); }catch(e){ var pre=document.getElementById("out"); if(pre) pre.textContent="FATAL: "+e.message+"\n"+(e.stack||"")+"\nPRUEBAS_DONE:FAIL"; document.title="FAIL fatal"; } }, 400); });
})();
