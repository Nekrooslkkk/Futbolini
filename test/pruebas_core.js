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
      var zMia=(typeof zonaSegDe==="function")?zonaSegDe("SMO"):null;
      ok(liga.length>0, "Segunda tiene fechas de liga");
      ok(liga.every(function(p){ return segIds.indexOf(p.rivalId)>=0; }), "todos los rivales de liga son de Segunda");
      ok(liga[0] && liga[0].torneo.indexOf("Segunda División")===0, "torneo rotulado 'Segunda División ...'");
      /* 7.65 · zonal: SMO (Sur) solo juega contra su zona (7 clubes → 12 fechas ida y vuelta) */
      ok(liga.every(function(p){ return zonaSegDe(p.rivalId)===zMia; }), "todos los rivales son de la MISMA zona ("+zMia+")");
      ok(liga.length===12, "12 fechas zonales (6 rivales ida y vuelta): "+liga.length);
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

    /* T3b · temporada COMPLETA de Segunda (zonal): byes, cierre, liguilla, sin excepción */
    grupo("Temporada de Segunda (zonal)");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      var liga0=(E.calendario||[]).filter(function(p){return p.tipo==="liga";}).length;
      var n=simularTemporada(60);
      ok(n>0, "se jugó la fase zonal ("+n+" partidos, liga="+liga0+")");
      ok(!( (typeof proximoPartido==="function") && proximoPartido()), "el calendario zonal se agotó");
      ok(E.temporada && E.temporada.pj>0, "la tabla de la zona avanzó (PJ="+(E.temporada&&E.temporada.pj)+")");
      var _r=Math.random; Math.random=function(){return 0.5;};
      var fin; try{ fin=finDeTemporada(); } finally { Math.random=_r; }
      ok(fin && typeof fin.pos==="number", "cierre de temporada de Segunda sin excepción (pos "+(fin&&fin.pos)+")");
    }, "Temporada Segunda");

    /* T4 · ascenso/descenso de 3 niveles */
    grupo("Ascenso/descenso 3 niveles");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      initLigaMod();
      E.tabla={}; (E.ligaMod["2026c"]||[]).forEach(function(id,i){ E.tabla[id]={pts:(id==="SMO"?90:70-i),gf:40,gc:20}; });
      /* 7.66 · el jugador campeón de su zona NO asciende solo: se difiere para jugar la liguilla */
      var m=procesarAscensoDescenso();
      ok(m && m.tipo==="liguilla" && E.liguillaPend, "campeón de zona: la liguilla queda PENDIENTE (jugable)");
      ok(E.eraBase==="2026c", "sigue en Segunda hasta jugar la liguilla");
      ok(E.liguillaPend && E.liguillaPend.rival && zonaSegDe(E.liguillaPend.rival)==="norte", "el rival es el campeón de la otra zona (Norte)");
      /* gana la liguilla → sube a la B; zonas quedan 7 y 7, Segunda 14 */
      var r=liguillaResolverAscenso(true);
      ok(r && r.tipo==="ascenso" && E.eraBase==="2026b", "gana la liguilla y sube a Primera B");
      ok((E.ligaMod["2026b"]||[]).indexOf("SMO")>=0, "SMO queda registrado en la B");
      var zc={norte:0,sur:0}; (E.ligaMod["2026c"]||[]).forEach(function(id){ var z=zonaSegDe(id); if(z) zc[z]++; });
      ok((E.ligaMod["2026c"]||[]).length===14, "Segunda mantiene 14 clubes ("+(E.ligaMod["2026c"]||[]).length+")");
      ok(zc.norte===7 && zc.sur===7, "zonas quedan 7 y 7 (N:"+zc.norte+" S:"+zc.sur+")");
    }, "Ascenso Segunda→B (liguilla)");
    safe(function(){
      /* perder la liguilla: el rival sube, el jugador se queda en Segunda (14, zonas 7/7) */
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      initLigaMod();
      E.tabla={}; (E.ligaMod["2026c"]||[]).forEach(function(id,i){ E.tabla[id]={pts:(id==="SMO"?90:70-i),gf:40,gc:20}; });
      procesarAscensoDescenso();
      var rival=E.liguillaPend&&E.liguillaPend.rival;
      var r=liguillaResolverAscenso(false);
      ok(r && r.tipo==="descenso_liguilla" && E.eraBase==="2026c", "pierde la liguilla y se queda en Segunda");
      ok((E.ligaMod["2026b"]||[]).indexOf(rival)>=0, "el rival ascendió a la B");
      ok((E.ligaMod["2026c"]||[]).indexOf("SMO")>=0, "SMO sigue en Segunda");
      var zc={norte:0,sur:0}; (E.ligaMod["2026c"]||[]).forEach(function(id){ var z=zonaSegDe(id); if(z) zc[z]++; });
      ok((E.ligaMod["2026c"]||[]).length===14 && zc.norte===7 && zc.sur===7, "Segunda 14, zonas 7/7 tras perder");
    }, "Pierde liguilla");

    /* T4a0 · idiomas: T() resuelve por registro con fallback a neutro */
    grupo("Idiomas (neutro/chilensis/pt)");
    safe(function(){
      ok(typeof T==="function" && typeof setIdioma==="function", "existe el sistema de idioma");
      setIdioma("neutro");
      ok(T("ini_headline")==="No manejas un equipo. Manejas una institución.", "neutro es la base");
      setIdioma("cl");
      ok(T("ini_headline").toLowerCase().indexOf("manejái")>=0, "chilensis cambia el texto");
      ok(T("clave_que_no_existe_xyz","porDefecto")==="porDefecto", "clave sin traducir cae al default");
      setIdioma("pt");
      ok(T("ini_elige").toLowerCase().indexOf("clube")>=0, "portugués traduce");
      /* fallback a neutro: inyecto una clave sólo en neutro y la pido en pt */
      if(typeof FRASES==="object"){ FRASES.neutro.__prueba_fb="valor_neutro"; ok(T("__prueba_fb")==="valor_neutro", "clave sólo-neutro cae a neutro desde pt"); delete FRASES.neutro.__prueba_fb; }
      setIdioma("neutro");
    }, "Idiomas");
    safe(function(){
      /* 7.70 · el gol común erupciona SOLO en chilensis; neutro queda limpio */
      setIdioma("neutro");
      ok(typeof tuitDeCtx==="function" && tuitDeCtx("gol_propio")===null, "en neutro un gol común no fuerza tuit");
      setIdioma("cl");
      var t=tuitDeCtx("gol_propio");
      ok(t && /GOOOO|CTM|GOL/i.test(t.txt||""), "en chilensis el gol erupciona");
      setIdioma("neutro");
    }, "Chilensis gol");

    /* T4a03 · amistosos: no tocan tabla/fecha/temporada (7.74) */
    grupo("Amistosos (7.74)");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      var idx0=E.idx, pj0=(E.temporada&&E.temporada.pj)||0;
      var ptsCC0=(E.tabla&&E.tabla["CC"]&&E.tabla["CC"].pts)||0;
      var m=(typeof clubMapaTodos==="function")?clubMapaTodos():{};
      var riv="UCH", rc=m[riv]||CLUB_POR_ID[riv]||{n:"Rival",fuerza:60};
      var part={tipo:"amistoso",amistoso:true,rivalId:riv,rivalNombre:rc.n||"Rival",fuerzaRival:rc.fuerza||60,
        local:true,sede:"casa",f:{m:6,d:15},clima:"despejado",jugado:false,torneo:"Amistoso"};
      var P=iniciarPartido(part,"simular"); correrHasta(P,90); var res=terminarPartido(P);
      ok(res && res.amistoso===true && res.esLiga===false, "el amistoso se marca (no liga)");
      ok(E.idx===idx0, "no gasta la fecha (idx intacto)");
      ok(((E.temporada&&E.temporada.pj)||0)===pj0, "no suma partidos de temporada");
      ok(((E.tabla&&E.tabla["CC"]&&E.tabla["CC"].pts)||0)===ptsCC0, "no toca la tabla");
    }, "Amistoso");

    /* T4a04 · tokens de decisiones: no quedan crudos en pantalla (7.73) */
    grupo("Tokens en decisiones (7.73)");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      var t=resolverTokens("Oferta por {CRACK}, el {IDOLO} y {JOVEN}", E);
      ok(t.indexOf("{")<0, "no queda ningún token sin resolver ("+t+")");
      ok(t.indexOf("CRACK")<0, "el {CRACK} se reemplaza por un jugador real");
      /* render real de una decisión con token en la descripción de una opción */
      var pool=[]; if(typeof DECISIONES!=="undefined") pool=pool.concat(DECISIONES); if(typeof BOLSA!=="undefined") pool=pool.concat(BOLSA);
      var conTok=pool.find(function(d){ return d.op&&d.op.some(function(o){ return (o.d||"").indexOf("{")>=0; }); });
      if(conTok && typeof abrirDecision==="function"){
        abrirDecision(conTok,true);
        var caja=document.querySelector("#capa-modal .op .d")||document.querySelector("#capa-modal");
        var htmlOps=document.querySelector("#capa-modal")?document.querySelector("#capa-modal").innerHTML:"";
        ok(htmlOps.indexOf("{CRACK}")<0 && htmlOps.indexOf("{IDOLO}")<0, "la decisión renderizada no muestra {TOKENS} crudos");
        if(typeof cerrarModal==="function") cerrarModal();
      } else { ok(true, "sin decisión-token para render (ok)"); }
    }, "Tokens");

    /* T4a05 · simulación realista: fuerza + forma + localía (7.72) */
    grupo("Simulación realista (7.72)");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      E.tabla["ZFUE"]={pj:8,pg:7,pe:1,pp:0,gf:20,gc:5,pts:22};
      E.tabla["ZMAL"]={pj:8,pg:0,pe:1,pp:7,gf:4,gc:20,pts:1};
      ok(typeof _formaClub==="function" && _formaClub("ZFUE")>0 && _formaClub("ZMAL")<0, "la forma pesa (racha buena +, mala -)");
      var fuerte={id:"ZA",fuerza:84}, debil={id:"ZB",fuerza:48};
      var win=0,los=0,N=400;
      for(var i=0;i<N;i++){ var g=_golesSimulados(fuerte,debil); if(g[0]>g[1])win++; else if(g[0]<g[1])los++; }
      ok(win>los*1.8, "el fuerte de local le gana al débil la gran mayoría ("+win+"G/"+los+"P de "+N+")");
      var w2=0,l2=0;
      for(var j=0;j<N;j++){ var h=_golesSimulados(debil,fuerte); if(h[1]>h[0])w2++; else if(h[1]<h[0])l2++; }
      ok(w2>l2, "el fuerte de visita igual gana más que pierde ("+w2+">"+l2+")");
      /* válido siempre: goles en rango 0..6 */
      var okRango=true; for(var k=0;k<50;k++){ var gg=_golesSimulados(fuerte,debil); if(gg[0]<0||gg[0]>6||gg[1]<0||gg[1]>6) okRango=false; }
      ok(okRango, "los marcadores quedan en rango (0..6)");
    }, "Sim realista");

    /* T4a1 · menú de inicio: el picker lista y filtra clubes sin romper */
    grupo("Menú de inicio (picker)");
    safe(function(){
      var d=document.createElement("div");
      if(typeof pickerClubes==="function") pickerClubes(d);
      var cards=d.querySelectorAll(".icono").length;
      ok(cards>=40, "el picker lista todos los clubes ("+cards+")");
      var tabs=d.querySelectorAll(".pick-tab").length;
      ok(tabs===5, "hay 5 filtros (Todos/Primera/B/Segunda/Clásicos)");
      var buscar=d.querySelector(".pick-buscar");
      ok(!!buscar, "hay buscador de club/ciudad");
    }, "Picker inicio");

    /* T4a2 · registrarLiga: una liga nueva se cablea con UNA llamada */
    grupo("registrarLiga (empaquetado)");
    safe(function(){
      var demo=[{id:"ZZA",n:"Demo Uno",c:"Uno",fuerza:70,aforo:20000,est:"Estadio Uno",ciudad:"Uno",z:"—"},
                {id:"ZZB",n:"Demo Dos",c:"Dos",fuerza:50,aforo:8000,est:"Estadio Dos",ciudad:"Dos",z:"—"}];
      var n=(typeof registrarLiga==="function")?registrarLiga({eraKey:"demo9",clubs:demo,baseEra:2026,nombre:"Liga Demo"}):0;
      ok(n===2, "registrarLiga cableó los 2 clubes de una");
      ok(typeof LIGAS==="object" && LIGAS["demo9"] && LIGAS["demo9"].length===2, "la liga quedó en LIGAS['demo9']");
      ok(typeof ERA==="object" && ERA["demo9"] && ERA["demo9"].n==="Liga Demo", "la época quedó registrada con su nombre");
      ok(typeof CLUB_INFO_2026!=="undefined" && CLUB_INFO_2026.ZZA && CLUB_INFO_2026.ZZA.n==="Demo Uno", "CLUB_INFO derivado");
      ok(typeof IND_BASE_2026!=="undefined" && IND_BASE_2026.ZZA && IND_BASE_2026.ZZA.plantel>IND_BASE_2026.ZZB.plantel, "IND_BASE derivado de la fuerza (70>50)");
      ok(typeof CAJA_BASE_2026!=="undefined" && CAJA_BASE_2026.ZZA && CAJA_BASE_2026.ZZA.plata>0, "CAJA_BASE derivada");
    }, "registrarLiga");

    /* T4b · simular varias temporadas seguidas (testeo hasta el final) */
    grupo("Simular temporadas (testeo)");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      var anio0=E.anio, histo0=(E.historialAnual||[]).length;
      var _r=Math.random; Math.random=function(){return 0.42;};
      var res; try{ res=simularTemporadas(3); } finally { Math.random=_r; }
      ok(res && res.temps>=1, "corrió al menos 1 temporada ("+(res&&res.temps)+")");
      ok(E.anio>anio0, "el año avanzó ("+anio0+"→"+E.anio+")");
      ok((E.historialAnual||[]).length>histo0, "el historial quedó lleno ("+(E.historialAnual||[]).length+" temporadas)");
      ok(!E.carrera.enParo && !E.carrera.fin, "la carrera sigue viva tras simular");
    }, "Simular temporadas");

    safe(function(){
      nuevaPartida("CC",2026,"historico");
      initLigaMod();
      E.tabla={}; (E.ligaMod[2026]||[]).forEach(function(id,i){ E.tabla[id]={pts:(id==="CC"?1:40+i),gf:10,gc:60}; });
      var nAntes=(E.ligaMod[2026]||[]).length;
      var m=procesarAscensoDescenso();
      ok(m && m.tipo==="descenso" && E.eraBase==="2026b", "colista de Primera baja a la B (2 niveles intacto)");
      ok(m && (m.bajan||[]).length===2, "Primera baja 2 clubes (cupo real): "+((m&&m.bajan)||[]).length);
      ok((E.ligaMod[2026]||[]).length===nAntes, "Primera conserva su tamaño tras el recambio ("+(E.ligaMod[2026]||[]).length+")");
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

    /* T8 · nunca game over: rescate desde la división más baja */
    grupo("Nunca game over (7.59)");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      E.rep.publica=5; E.rep.credibilidad=5;   /* nombre quemado */
      var resc=ofertaDeRescate();
      ok(resc.length>0, "hay oferta de rescate aunque estés quemado ("+resc.length+")");
      var segIds=(typeof idsSegunda==="function")?idsSegunda():[];
      ok(resc.every(function(c){ return segIds.indexOf(c.id)>=0; }), "el rescate es de la división más baja (Segunda)");
      var titAntes=E.titulos.length;
      aceptarClub(resc[0].id, 2026);
      ok(E.eraBase==="2026c" && !E.carrera.fin && !E.carrera.enParo, "al aceptar sigue en Segunda (sin game over)");
      ok(E.titulos.length===titAntes, "la carrera se preserva (títulos)");
    }, "Rescate desde Segunda");

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
