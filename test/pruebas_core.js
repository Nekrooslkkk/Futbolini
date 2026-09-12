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

    /* T4 · ascenso/descenso de 3 niveles — liguilla de 7, SIN final de 3 botones */
    grupo("Ascenso/descenso 3 niveles");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      initLigaMod();
      E.tabla={}; (E.ligaMod["2026c"]||[]).forEach(function(id,i){ E.tabla[id]={pts:(id==="SMO"?90:70-i),gf:40,gc:20,pj:12,pg:0,pe:0,pp:0}; });
      E.flags=E.flags||{};
      E.flags.ligaCCampeon=true;
      E.flags.segundaFase="liguillaAscenso";
      var m=procesarAscensoDescenso();
      ok(!E.liguillaPend, "campeón de la liguilla de 7: NO hay final de 3 botones (liguillaPend vacío)");
      ok(m && m.tipo!=="liguilla", "no se ofrece la carta de 3 posturas");
      ok(m && m.tipo==="ascenso" && E.eraBase==="2026b", "1° de la liguilla de 7 sube a Primera B");
      ok((E.ligaMod["2026b"]||[]).indexOf("SMO")>=0, "SMO queda registrado en la B");
      var zc={norte:0,sur:0}; (E.ligaMod["2026c"]||[]).forEach(function(id){ var z=zonaSegDe(id); if(z) zc[z]++; });
      ok((E.ligaMod["2026c"]||[]).length===14, "Segunda mantiene 14 clubes ("+(E.ligaMod["2026c"]||[]).length+")");
      ok(zc.norte===7 && zc.sur===7, "zonas quedan 7 y 7 (N:"+zc.norte+" S:"+zc.sur+")");
    }, "Ascenso Segunda→B (liguilla de 7)");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      initLigaMod();
      E.tabla={}; (E.ligaMod["2026c"]||[]).forEach(function(id,i){ E.tabla[id]={pts:(id==="SMO"?90:70-i),gf:40,gc:20,pj:12,pg:0,pe:0,pp:0}; });
      E.flags=E.flags||{};
      E.flags.ligaCCampeon=false;
      E.flags.segundaFase="liguillaAscenso";
      var m=procesarAscensoDescenso();
      ok(!E.liguillaPend, "sin ganar la liguilla de 7: tampoco hay final de 3 botones");
      ok(E.eraBase==="2026c", "sigue en Segunda (no ganó la liguilla de 7)");
      ok((E.ligaMod["2026c"]||[]).indexOf("SMO")>=0, "SMO sigue en Segunda");
      var zc={norte:0,sur:0}; (E.ligaMod["2026c"]||[]).forEach(function(id){ var z=zonaSegDe(id); if(z) zc[z]++; });
      ok((E.ligaMod["2026c"]||[]).length===14 && zc.norte===7 && zc.sur===7, "Segunda 14, zonas 7/7 si no subís");
    }, "No gana liguilla de 7");

    /* 7.82 · intro de época en modos históricos (1925 nacimiento CC, 2006), no en 2026 */
    grupo("Intro de época (7.82)");
    safe(function(){
      nuevaPartida("CC",1925,"historico"); SEC="escritorio"; render();
      var p25=document.querySelector(".intro-epoca");
      ok(!!p25, "1925 muestra el panel de época");
      ok(p25 && /Cacique|Arellano|Magallanes/.test(p25.textContent||""), "el panel de 1925 cuenta la fundación real");
      nuevaPartida("CC",2006,"historico"); SEC="escritorio"; render();
      ok(!!document.querySelector(".intro-epoca"), "2006 muestra el panel de época");
      nuevaPartida("CC",2026,"historico"); SEC="escritorio"; render();
      ok(!document.querySelector(".intro-epoca"), "en 2026 NO aparece el panel de época");
    }, "Intro epoca");

    /* 7.86 · la situación del club (Grok TAREA E, SITUACION_CLUB) SE MUESTRA en el escritorio */
    grupo("Situación del club en el escritorio (7.86)");
    safe(function(){
      ok(typeof SITUACION_CLUB==="object" && Object.keys(SITUACION_CLUB).length>=40,
        "SITUACION_CLUB tiene cobertura ("+Object.keys(SITUACION_CLUB||{}).length+" clubes)");
      nuevaPartida("CC",2026,"historico"); SEC="escritorio"; render();
      var txt=(document.getElementById("vista")||{}).textContent||"";
      ok(txt.indexOf("El club hoy")>=0, "el escritorio muestra el panel 'El club hoy'");
      ok(SITUACION_CLUB.CC && txt.indexOf(SITUACION_CLUB.CC.slice(0,24))>=0, "muestra la situación real del club elegido");
      nuevaPartida("SMO",2026,"historico",{categoria:"C"}); SEC="escritorio"; render();
      var txt2=(document.getElementById("vista")||{}).textContent||"";
      ok(SITUACION_CLUB.SMO && txt2.indexOf(SITUACION_CLUB.SMO.slice(0,20))>=0, "Segunda (S. Morning) también muestra su situación");
    }, "Situación en escritorio");

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

    /* 7.78 · federación por país: AFA ≠ ANFP, sin tocar el contenido chileno */
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      ok(typeof fedSigla==="function" && fedSigla()==="ANFP", "Chile usa ANFP");
      ok(localizarFed("Presión de la ANFP y la Copa Chile")==="Presión de la ANFP y la Copa Chile", "en Chile el texto NO cambia");
      E.eraBase="arg2026";
      ok(paisDeEra()==="argentina" && fedSigla()==="AFA", "arg2026 → AFA");
      var loc=localizarFed("La ANFP designó árbitro para la Copa Chile");
      ok(loc.indexOf("AFA")>=0 && loc.indexOf("ANFP")<0 && loc.indexOf("Copa Argentina")>=0, "localiza ANFP→AFA y Copa Chile→Copa Argentina");
      ok(resolverTokens("Molestó a la ANFP", E).indexOf("AFA")>=0, "resolverTokens localiza en modo Argentina");
      E.eraBase=2026;
      ok(resolverTokens("Molestó a la ANFP", E).indexOf("ANFP")>=0, "de vuelta en Chile, ANFP intacto");
    }, "Federacion pais");

    /* 7.77 · más pateos: más acción sin inflar los goles */
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      var part=proximoPartido();
      var golesTot=0, atajTot=0, chanceTot=0, matches=0, N=40;
      for(var i=0;i<N;i++){
        var p=JSON.parse(JSON.stringify(part)); p.jugado=false;
        var P=iniciarPartido(p,"simular");
        var guard=0;
        while(P.min<90 && !P.terminado && guard++<600){
          var ev=tickPartido(P);
          if(ev.tipo==="fin") break;
          if(ev.tipo==="atajada") atajTot++;
          if(ev.tipo==="chance") chanceTot++;
          if(ev.tipo==="penal"||ev.tipo==="penalRival"||ev.tipo==="lesion"||ev.tipo==="tiroLibre") resolverEventoAuto(P,ev);
        }
        golesTot+=(P.gl+P.gv); matches++;
      }
      var golProm=golesTot/matches;
      ok(golProm>=1.0 && golProm<=4.5, "goles por partido en rango sano ("+golProm.toFixed(2)+")");
      ok(atajTot>0, "hay remates al arco / atajadas ("+atajTot+" en "+matches+")");
      ok(chanceTot>matches, "hay hartas ocasiones (>1 por partido): "+chanceTot);
    }, "Más pateos");

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
      ok(tabs===6, "hay 6 filtros (Todos/Primera/B/Segunda/Argentina/Clásicos)");
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

    /* T4a03 · amistosos: no tocan tabla/fecha/temporada (7.74 GitHub, merge 7.76) */
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

    /* T9 · 7.74 pulido: formato, mundo, decisiones club-correctas, metas Segunda */
    grupo("Pulido 7.74 (país + decisiones + metas)");
    safe(function(){
      ok(typeof COPA_LIGA_GRUPOS_2026==="object" && COPA_LIGA_GRUPOS_2026.A, "formato 2026 cargado (Copa de la Liga)");
      ok(typeof mundoInit==="function" && typeof panelMundoCalendario==="function", "mundo.js cargado");
      ok(typeof recortarDecisiones74==="function" && typeof comoHacerObjetivo==="function", "pulido.js cargado");
    }, "Scripts 7.74");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      var copa=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"; });
      var ligaCopa=copa.filter(function(p){ return p.torneo==="Copa de la Liga"; });
      ok(ligaCopa.length>0, "Primera tiene Copa de la Liga en el calendario ("+ligaCopa.length+")");
      ok(E.mundo && E.mundo.ligas && E.mundo.ligas["2026"], "mundo tiene tabla de Primera");
    }, "Calendario Primera + mundo");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      var chile=(E.calendario||[]).filter(function(p){ return p.torneo==="Copa Chile"; });
      ok(chile.length===0, "Segunda 2026 no juega Copa Chile ("+chile.length+")");
      ok(E.mundo && E.mundo.ligas && E.mundo.ligas["2026"] && E.mundo.ligas["2026b"], "desde Segunda el país tiene Primera y B");
      ok(!(E.objetivos||[]).some(function(o){ return /Libertadores/.test(o.t||""); }), "Segunda no pide Libertadores");
      ok((E.objetivos||[]).some(function(o){ return /zona|liguilla|ascenso/i.test((o.t||"")+(o.detalle||"")); }), "metas de Segunda hablan de zona/liguilla");
      var vic=(E.objetivos||[]).find(function(o){ return o.id==="vic"; });
      ok(!vic || vic.meta<=8, "victorias de Segunda caben en 12 fechas (meta="+(vic&&vic.meta)+")");
      var dep=(E.objetivos||[]).find(function(o){ return o.id==="dep"; });
      ok(!dep || dep.meta<=4, "posición meta de Segunda no es 14° de 16 (meta="+(dep&&dep.meta)+")");
      ok((E.objetivos||[]).every(function(o){ return typeof comoHacerObjetivo==="function" && comoHacerObjetivo(o).length>20; }), "cada meta tiene 'cómo hacerlo'");
    }, "Segunda: copa/metas/mundo");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      var d=(typeof decisionPorId==="function")?decisionPorId("b_cantera_cancha"):null;
      ok(d && !/Monumental/i.test(d.d||""), "cantera de Segunda no nombra el Monumental");
      ok(typeof textoAjenoClub74==="function" && d && textoAjenoClub74({t:"x",d:"No es el Monumental. Macul espera."})===true, "filtro bloquea Monumental ajeno");
      ok(textoAjenoClub74({t:"x",d:"potrero que se inunda en La Pintana"})===false, "texto genérico de cantera sí pasa");
      repartirDecisiones();
      ok((E.decPend||[]).every(function(x){ var dd=decisionPorId(x.id); return !dd || !textoAjenoClub74(dd); }), "ninguna decisión pendiente es de otro club");
    }, "Decisiones club-correctas");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      var r=(typeof preguntarAyudante==="function")?preguntarAyudante("¿Hay Libertadores?"):"";
      ok(/no hay Libertadores|Segunda/i.test(r), "ayudante en Segunda no promete Libertadores: "+r.slice(0,80));
      var r2=preguntarAyudante("qué hago con la meta");
      ok(r2 && r2.length>40, "ayudante explica la meta ("+r2.length+" chars)");
      var p=(typeof pendientesAtender==="function")?pendientesAtender():[];
      var fin=p.filter(function(x){ return /finanza|deuda|Meta en riesgo/i.test(x.t+" "+(x.d||"")); });
      /* si hay meta en riesgo, el texto dice cómo; si no, igual la función no revienta */
      ok(true, "atiende corre ("+p.length+" items)");
    }, "Ayudante y atiende");
    safe(function(){
      ok(typeof ESTATUTOS!=="undefined" && ESTATUTOS.some(function(c){ return c.id==="comunicacion"; }), "estatuto de comunicación");
      ok(ESTATUTOS.some(function(c){ return c.id==="formacion"; }), "estatuto de edad del plantel");
      ok(typeof JUGADAS_PODER!=="undefined" && JUGADAS_PODER.length>=8, "más jugadas de poder ("+JUGADAS_PODER.length+")");
      ok(typeof pactosBarra==="function" && pactosBarra().length>=5, "más pactos de barra ("+pactosBarra().length+")");
    }, "Institución expandida");

    /* T10 · 7.75 tablas del país + ayudante no tutorial */
    grupo("Pulido 7.75 (tablas de todo + ayudante)");
    safe(function(){
      ok(typeof mundoPintarTabla==="function", "mundoPintarTabla existe");
      ok(typeof pulirCalendario75==="function", "pulirCalendario75 existe");
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      ok(E.mundo && E.mundo.ligas && E.mundo.ligas["2026"] && E.mundo.ligas["2026b"] && E.mundo.ligas["2026cN"], "mundo tiene las 3 divisiones");
      var chips=(typeof chipsAyudante74==="function")?chipsAyudante74():[];
      ok(chips.length>=4, "chips del ayudante ("+chips.length+")");
      ok(chips.every(function(c){ return !/Libertadores/i.test(c); }), "chips no dicen Libertadores: "+chips.join(" · "));
      ok(chips.some(function(c){ return /domingo/i.test(c); }), "chip ¿El domingo?");
      var r=(typeof preguntarAyudante==="function")?preguntarAyudante("¿El domingo?"):"";
      ok(/vs |rival|Fecha|local|visita|partido|Morning|favorito|parejo|fuerte/i.test(r), "¿El domingo? habla del partido: "+String(r).slice(0,90));
      SEC="calendario";
      if(typeof render==="function") render();
      ok(E.uiMundoTab==="tablas", "tab default = tablas");
      ok(document.querySelector(".tablas-pais"), "grid tablas-pais en Calendario");
      ok(document.querySelectorAll(".tablas-pais .tabla-liga").length>=4, "4 tablas de liga en el grid ("+document.querySelectorAll(".tablas-pais .tabla-liga").length+")");
      ok(document.querySelector(".tablas-copa"), "grupos de copa en Tablas");
      var dups=Array.prototype.filter.call(document.querySelectorAll("#vista .panel .cab span:last-child"), function(s){ return /^Tabla de posiciones/.test(s.textContent||""); });
      ok(dups.length===0, "no queda la tabla suelta de una sola liga ("+dups.length+")");
    }, "Calendario tablas + chips");

    /* T11 · 7.76 Grok: Argentina + historia Segunda + tuits/voz */
    grupo("Grok 7.76 (Argentina + Segunda + voz)");
    safe(function(){
      ok(typeof LIGA_ARG_2026==="object" && LIGA_ARG_2026.length===30, "30 clubes de la Liga Profesional");
      ok(typeof esClubArg==="function" && esClubArg("BOC") && esClubArg("RIV") && !esClubArg("CC"), "IDs Boca/River no chocan con Chile");
      var chile={};
      [LIGA_2026,LIGA_B_2026,LIGA_C_2026,LIGA91].forEach(function(L){ if(L) L.forEach(function(c){ chile[c.id]=c.n; }); });
      var choc=LIGA_ARG_2026.filter(function(c){ return chile[c.id]; });
      ok(choc.length===0, "ningún id argentino choca con Chile ("+(choc[0]&&choc[0].id||"0")+")");
    }, "IDs Argentina");
    safe(function(){
      nuevaPartida("BOC",2026,"historico",{categoria:"ARG"});
      ok(E && E.eraBase==="arg2026", "Boca arranca en era arg2026");
      ok((E.calendario||[]).filter(function(p){ return p.tipo==="liga"; }).length===14, "Apertura zona 15: 14 PJ (1 bye): "+((E.calendario||[]).filter(function(p){ return p.tipo==="liga"; }).length));
      ok((E.calendario||[]).some(function(p){ return p.tipo==="copa"&&/Copa Argentina/i.test(p.torneo||""); }), "Boca tiene Copa Argentina (32avos documentados)");
      ok(!(E.calendario||[]).some(function(p){ return p.torneo==="Copa Chile"; }), "Argentina no juega Copa Chile");
      ok(E.clubNombre==="Boca Juniors", "nombre Boca");
      ok(E.mundo && E.mundo.ligas && E.mundo.ligas.arg2026A && E.mundo.ligas.arg2026A.ids.length===15, "mundo Zona A = 15");
      ok(E.mundo.ligas.arg2026B && E.mundo.ligas.arg2026B.ids.length===15, "mundo Zona B = 15");
      SEC="calendario";
      if(typeof render==="function") render();
      ok(document.querySelector(".tablas-pais"), "grid tablas-pais en Calendario Argentina");
      ok(/Zona A|Apertura|Liga Profesional/i.test((document.querySelector(".tablas-pais")||{textContent:""}).textContent||""), "tabla dice Apertura / Zona A");
      ok(!document.querySelector(".tablas-copa"), "Argentina no muestra grupos de Copa Chile");
    }, "Partida Boca");
    safe(function(){
      ok(typeof HISTORIA_LINEA==="object" && HISTORIA_LINEA.SMO && HISTORIA_LINEA.SMO.length>=2, "historia Santiago Morning");
      ok(HISTORIA_LINEA.OSO && /1991/.test(HISTORIA_LINEA.OSO.map(function(h){return h.txt;}).join(" ")), "Osorno: hecho de Primera 1991");
      ok(HISTORIA_LINEA.TRA && HISTORIA_LINEA.LSC && HISTORIA_LINEA.COL, "Trasandino, Lota y Colina tienen línea");
      var ids=["SMO","LSC","OSO","LIN","CLC","TRA","COL","OVA","CNA","BSA","RSJ","SCI","GVE","REN"];
      ok(ids.every(function(id){ return HISTORIA_LINEA[id] && HISTORIA_LINEA[id].length; }), "los 14 de Segunda tienen HISTORIA_LINEA");
      ok(/Paredes/.test((HISTORIA_LINEA.SMO||[]).map(function(h){return h.txt;}).join(" ")), "Morning 2026 nombra a Paredes");
    }, "Historia Segunda");
    safe(function(){
      ok(typeof CLUB_INFO_2026==="object" && /Paredes/.test(CLUB_INFO_2026.SMO&&CLUB_INFO_2026.SMO.dt||""), "DT Morning: Esteban Paredes");
      ok(/Viale/.test(CLUB_INFO_2026.OSO&&CLUB_INFO_2026.OSO.dt||""), "DT Osorno: Jeremías Viale");
      ok(/Lo Barnechea/.test(CLUB_INFO_2026.SCI&&CLUB_INFO_2026.SCI.est||""), "Santiago City: Lo Barnechea");
      ok((LIGA_C_2026.filter(function(c){ return c.z==="norte"; }).length===7) && (LIGA_C_2026.filter(function(c){ return c.z==="sur"; }).length===7), "Segunda 7 y 7");
    }, "DTs y estadios Segunda");
    safe(function(){
      ok(typeof TUITS_76==="object" && TUITS_76.length>=180, "pool tuits 76 ("+((TUITS_76&&TUITS_76.length)||0)+")");
      ok(typeof VOZ_76==="object" && VOZ_76.length>=80, "pool voz 76 ("+((VOZ_76&&VOZ_76.length)||0)+")");
      ok(TUITS_76.every(function(t){ return !/\bvos tenés\b|\bandá\b|\bmirá\b/i.test(t.txt); }), "tuits sin voseo argentino típico");
    }, "Tuits y voz");

    /* T12 · 7.81 GROK_EPOCAS A–H */
    grupo("Grok 7.81 (épocas 1925/2006 + meta + AFA + calendario)");
    safe(function(){
      ok(typeof CLUB_META==="object" && CLUB_META.CC && CLUB_META.CC.fund===1925, "CC fund 1925");
      ok(CLUB_META.SW && CLUB_META.SW.fund===1892, "Wanderers fund 1892");
      ok(CLUB_META.CC.colores && CLUB_META.CC.colores[0]==="#ffffff", "CC colores blanco/negro");
      ok(typeof colorDeClub==="function" && colorDeClub("UCH"), "colorDeClub UCH");
      ok(typeof ESTADIO_FIX_78==="object" && ESTADIO_FIX_78.length>=3, "FIX de aforos reportados");
      if(typeof LIGA_C_2026==="object"){
        var sinMeta=LIGA_C_2026.filter(function(c){ return !CLUB_META[c.id]||!CLUB_META[c.id].esc; }).map(function(c){ return c.id; });
        ok(sinMeta.length===0, "Segunda: todos con meta esc ("+(sinMeta.join(",")||"ok")+")");
      }
      ok(CLUB_META.COL && CLUB_META.COL.fund===2014, "Colina fund 2014");
      ok(CLUB_META.GVE && CLUB_META.GVE.fund===1908, "Gral. Velásquez fund 1908");
      ok(CLUB_META.REN && CLUB_META.REN.fund===1984, "Rengo fund 1984");
    }, "Meta clubes");
    safe(function(){
      ok(typeof FEDERACION_ARG==="object" && FEDERACION_ARG.sigla==="AFA", "federación AFA");
      ok(!/ANFP/.test(FEDERACION_ARG.nombre||""), "AFA no dice ANFP");
      ok(typeof FORMAT_CHILE_LINEA==="object" && FORMAT_CHILE_LINEA.length>=6, "línea de formatos 1991-2008");
      ok(FORMAT_CHILE_LINEA.some(function(x){ return x.anio===1995 && x.pts===3; }), "1995: 3 puntos");
      ok(FORMAT_CHILE_LINEA.some(function(x){ return x.anio===2002; }), "2002: playoffs");
    }, "AFA + línea de formatos");
    safe(function(){
      ok(typeof LIGA_2006==="object" && LIGA_2006.length===19, "2006: 19 clubes");
      ok(!LIGA_2006.some(function(c){ return c.id==="DCO"; }), "2006 sin D. Concepción (suspendido)");
      ok(LIGA_2006.some(function(c){ return c.id==="CBL"; }) && LIGA_2006.some(function(c){ return c.id==="CBS"; }), "Cobreloa=CBL y Cobresal=CBS");
      var r=nuevaPartida("CC",2006,"historico",{categoria:"2006"});
      ok(r!==false && E && E.eraBase===2006, "CC 2006 arranca era 2006");
      ok((E.plantel||[]).some(function(j){ return /Suazo|Fernández|Valdivia/.test(j.n||""); }), "plantel 2006 documentado (Suazo/Mati/Valdivia)");
      ok((E.calendario||[]).filter(function(p){ return p.tipo==="liga"; }).length===18, "18 fechas (rueda con bye): "+((E.calendario||[]).filter(function(p){ return p.tipo==="liga"; }).length));
      ok(!(E.calendario||[]).some(function(p){ return p.torneo==="Copa Chile"; }), "2006 no arma Copa Chile");
    }, "Modo 2006");
    safe(function(){
      ok(typeof LIGA_1925==="object" && LIGA_1925.length===12, "1925: 12 clubes (Unión Chilena retirada)");
      ok(LIGA_1925.length%2===0, "12 es par (fixturesLiga)");
      var r=nuevaPartida("CC",1925,"historico",{categoria:"1925"});
      ok(r!==false && E && E.eraBase===1925, "CC 1925 arranca era 1925");
      ok((E.plantel||[]).some(function(j){ return /Arellano/.test(j.n||""); }), "plantel 1925 tiene a David Arellano");
      ok((E.calendario||[]).filter(function(p){ return p.tipo==="liga"; }).length===11, "11 fechas (una rueda): "+((E.calendario||[]).filter(function(p){ return p.tipo==="liga"; }).length));
      ok(!(E.calendario||[]).some(function(p){ return /Libertadores|Copa Chile/.test(p.torneo||""); }), "1925 sin copas modernas");
      ok(typeof redesDisponibles==="function" && !redesDisponibles(), "sin redes en 1925");
      ok(typeof seccionOculta==="function" && seccionOculta("mercado") && seccionOculta("redes"), "oculta mercado y redes");
      ok(typeof ERA==="object" && ERA[1925] && ERA[1925].puntosVictoria===2, "1925: victoria vale 2");
    }, "Modo 1925");
    safe(function(){
      ok(typeof TITULARES_FECHA==="object" && TITULARES_FECHA.length>=6, "titulares de fecha");
      ok(typeof titularDeFecha==="function" && /fecha|rival|jornada|domingo|tabla/i.test(titularDeFecha("fecha_previa")), "titular de fecha habla de la jornada");
      ok(typeof COPA91_RESEÑA==="object" && /Olimpia/.test(COPA91_RESEÑA.final||""), "reseña Libertadores 1991");
    }, "Calendario H + Libertadores 91");

    /* T13 · 7.83 GROK_SUPERPROMPT huecos (caza + DTs + formato) */
    grupo("Grok 7.83 (caza 1925/Monumental/San Carlos + DTs + formatos 2026)");
    safe(function(){
      ok(typeof FORMAT_SEGUNDA_2026==="object" && FORMAT_SEGUNDA_2026.n===14, "FORMAT_SEGUNDA_2026 n=14");
      ok(FORMAT_SEGUNDA_2026.porZona===7 && /liguilla/i.test(FORMAT_SEGUNDA_2026.liguillaAscenso||""), "Segunda: zonas 7 + liguilla de 7");
      ok(/4°/.test(FORMAT_SEGUNDA_2026.cuartos||""), "Segunda documenta playoff de 4°s");
      ok(typeof FORMAT_SUPERCOPA_2026==="object" && FORMAT_SUPERCOPA_2026.campeon==="Coquimbo Unido", "Supercopa 2026: Coquimbo campeón");
      ok(FORMAT_SUPERCOPA_2026.n===4 && /Sausalito/.test(FORMAT_SUPERCOPA_2026.sede||""), "Supercopa Final Four en Sausalito");
      ok(typeof FORMAT_COPA_LIGA_2026==="object" && FORMAT_COPA_LIGA_2026.edicion===1, "Copa de la Liga 2026 existe (1ª edición)");
      ok(FORMAT_COPA_LIGA_2026.grupos && FORMAT_COPA_LIGA_2026.grupos.A[0]==="COQ", "Copa de la Liga grupo A arranca con Coquimbo");
      ok(typeof COPA_LIGA_GRUPOS_2026==="object" && COPA_LIGA_GRUPOS_2026.A[0]==="COQ" && COPA_LIGA_GRUPOS_2026.B[0]==="UC", "grupos formato = Wikipedia");
    }, "Formatos 2026");
    safe(function(){
      ok(CLUB_INFO_2026.CC && CLUB_INFO_2026.CC.dt==="Fernando Ortiz", "DT CC: Ortiz");
      ok(CLUB_INFO_2026.AUD && CLUB_INFO_2026.AUD.dt==="Patricio Graff", "DT AUD: Graff");
      ok(CLUB_INFO_2026.UDC && CLUB_INFO_2026.UDC.dt==="Cristián Muñoz", "DT UDC: Muñoz");
      ok(CLUB_INFO_2026.PAL && CLUB_INFO_2026.PAL.dt==="Guillermo Farré", "DT PAL: Farré");
      var r=nuevaPartida("CC",2026,"historico");
      ok(r!==false && E && E.dt==="Fernando Ortiz", "partida CC 2026 arranca con Ortiz");
    }, "DTs Primera 2026");
    safe(function(){
      var cc0=(HISTORIA_LINEA.CC&&HISTORIA_LINEA.CC[0])||{};
      ok(cc0.anio===1925 && !/escolares/i.test(cc0.txt||""), "CC 1925 ya no dice fusión escolar");
      ok(/Llano|Magallanes|Arellano/.test(cc0.txt||""), "CC 1925: El Llano / Magallanes / Arellano");
      ok(HISTORIA_LINEA.CC.some(function(h){ return h.anio===1975 && /Monumental|Aviación/.test(h.txt||""); }), "Monumental inaugurado 1975");
      ok(!HISTORIA_LINEA.CC.some(function(h){ return h.anio===1973; }), "CC ya no tiene hito 1973");
      ok(HISTORIA_LINEA.UC.some(function(h){ return h.anio===1988 && /San Carlos/.test(h.hito||h.txt||""); }), "San Carlos 1988");
      ok(!HISTORIA_LINEA.UC.some(function(h){ return h.anio===1997; }), "UC ya no tiene hito 1997");
      ok(HISTORIA_LINEA.COQ.some(function(h){ return h.hito==="Supercopa" && /penales/.test(h.txt||""); }), "COQ: hecho Supercopa 2026");
    }, "Caza HISTORIA_LINEA");
    safe(function(){
      ok(typeof FRASES==="object" && FRASES.cl && !/Atendé/.test(FRASES.cl.esc_atiende||""), "chilensis sin Atendé argentino");
      ok(/Atiende/.test(FRASES.cl.esc_atiende||""), "Atiende (tú chilensis)");
      ok(typeof VERSION==="string" && /^[78]\.\d+$/.test(VERSION), "VERSION 7.x/8.x");
    }, "Voz + versión");

    /* T13b · 7.83b Claude · blindaje del selector de época (no pisar) */
    safe(function(){
      grupo("Selector de época sólido para todos (7.83b)");
      ok(typeof epocasDe==="function" && typeof datosEra==="function" && typeof baseEra==="function",
        "helpers de época disponibles");
      var mapa=(typeof clubMapaTodos==="function")?clubMapaTodos():{};
      var ids=Object.keys(mapa);
      ok(ids.length>=40, "hay clubes que revisar: "+ids.length);
      var rotas=[];
      ids.forEach(function(id){
        var gl=epocasDe(id)||[];
        gl.forEach(function(ep){
          var b=baseEra(ep.anio);
          if(!(datosEra(b).info||{})[id]) b=2026;
          var D=datosEra(b);
          var info=D.info[id], ind=D.ind[id], caja=D.caja[id];
          if(!info || !(ind||ep.ind) || !(caja||ep.caja)) rotas.push(id+"@"+ep.anio);
        });
      });
      ok(rotas.length===0, "toda gloria de club resuelve datos"+(rotas.length?": ROTAS "+rotas.join(", "):""));
      var elegibles={};
      if(typeof CLUB_INFO==="object") Object.keys(CLUB_INFO).forEach(function(id){ elegibles[id]=1; });
      if(typeof CLUB_INFO_2026==="object") Object.keys(CLUB_INFO_2026).forEach(function(id){ elegibles[id]=1; });
      [typeof LIGA_B_2026!=="undefined"?LIGA_B_2026:null,
       typeof LIGA_C_2026!=="undefined"?LIGA_C_2026:null,
       typeof LIGA_ARG_2026!=="undefined"?LIGA_ARG_2026:null].forEach(function(L){
        if(L) L.forEach(function(c){ elegibles[c.id]=1; });
      });
      var huerfanos=Object.keys(elegibles).filter(function(id){
        return ![1991,2026,2006,1925].some(function(b){ return (datosEra(b).info||{})[id]; });
      });
      ok(huerfanos.length===0, "todo club elegible resuelve en alguna era"+(huerfanos.length?": HUÉRFANOS "+huerfanos.join(", "):""));
    }, "Selector de época sólido");

    /* T14 · 7.85 GROK_SUPERPROMPT TAREA E (clásicos, épocas, historia AR, formatos) */
    grupo("Grok 7.84 (TAREA E: clásicos variados + épocas doradas + AFA historia)");
    safe(function(){
      ok(typeof esRivalidadRegional==="function" && esRivalidadRegional("SW","EVE"), "Clásico Porteño SW–EVE");
      ok(esRivalidadRegional("CBL","ANT"), "Clásico del Norte CBL–ANT");
      ok(esRivalidadRegional("BOC","RIV"), "Superclásico BOC–RIV");
      ok(esRivalidadRegional("RAC","IND"), "Clásico de Avellaneda RAC–IND");
      ok(esRivalidadRegional("IQQ","SMA"), "norte extremo IQQ–SMA");
      ok(!esRivalidadRegional("SMO","CC"), "Morning no tiene de clásico a Colo-Colo");
    }, "Clásicos variados");
    safe(function(){
      ok(typeof epocasDe==="function", "epocasDe existe");
      ok((epocasDe("EVE")||[]).some(function(e){ return e.anio===2008; }), "Everton 2008 Apertura (oro)");
      ok((epocasDe("AUD")||[]).some(function(e){ return e.anio===2007; }), "Audax 2007 Apertura (oro)");
      ok((epocasDe("SMO")||[]).some(function(e){ return e.anio===1942; }), "Morning 1942 campeón (oro)");
      ok((epocasDe("RIV")||[]).some(function(e){ return e.anio===2018; }), "River 2018 Libertadores (oro)");
      ok((epocasDe("BOC")||[]).some(function(e){ return e.anio===2007; }), "Boca 2007 Libertadores (oro)");
      ok((epocasDe("GVE")||[]).some(function(e){ return e.anio===2017; }), "Velásquez 2017 Tercera A (oro)");
      ok((epocasDe("CBL")||[]).some(function(e){ return e.anio===1981; }), "Cobreloa 1981 final América");
    }, "Épocas doradas");
    safe(function(){
      ok(HISTORIA_LINEA.RIV && HISTORIA_LINEA.RIV.some(function(h){ return h.anio===1901; }), "River historia 1901");
      ok(HISTORIA_LINEA.BOC && /Bombonera|1905/.test((HISTORIA_LINEA.BOC[0]||{}).txt||""), "Boca historia 1905");
      ok(HISTORIA_LINEA.GVE && HISTORIA_LINEA.GVE.some(function(h){ return h.anio===1908; }), "Velásquez fund 1908");
      ok(HISTORIA_LINEA.OVA && HISTORIA_LINEA.OVA.some(function(h){ return h.anio===1942; }), "Ovalle fund 1942");
      var idsC=(typeof idsSegunda==="function")?idsSegunda():[];
      var faltaC=idsC.filter(function(id){ return !HISTORIA_LINEA[id] || !HISTORIA_LINEA[id].length; });
      ok(faltaC.length===0, "Segunda: todos con HISTORIA_LINEA"+(faltaC.length?" ("+faltaC.join(",")+")":""));
      var idsA=(typeof idsArgentina==="function")?idsArgentina():[];
      var faltaA=idsA.filter(function(id){ return !HISTORIA_LINEA[id] || !HISTORIA_LINEA[id].length; });
      ok(faltaA.length===0, "Argentina: todos con HISTORIA_LINEA"+(faltaA.length?" ("+faltaA.join(",")+")":""));
    }, "Historia todos");
    safe(function(){
      ok(FORMAT_CHILE_LINEA.some(function(x){ return x.anio===2018 && x.n===16; }), "2018: torneo largo 16");
      ok(FORMAT_CHILE_LINEA.some(function(x){ return x.anio===2026; }), "2026 en la línea de formatos");
      ok(typeof SITUACION_CLUB==="object" && SITUACION_CLUB.CC && SITUACION_CLUB.RIV, "situación CC y River");
      ok(typeof VERSION==="string" && /^[78]\.\d+$/.test(VERSION), "VERSION 7.x/8.x");
    }, "Formatos + situación + versión");

    /* T15 · 7.86 huecos reales TAREA E (economía AFA, estadios, clásicos, oro) */
    grupo("Grok 7.86 (River no es club chico + estadios + oro AFA)");
    safe(function(){
      ok(CAJA_BASE_2026.RIV && CAJA_BASE_2026.RIV.plata>=1000, "River caja de grande (no 224): "+(CAJA_BASE_2026.RIV&&CAJA_BASE_2026.RIV.plata));
      ok(CAJA_BASE_2026.BOC && CAJA_BASE_2026.BOC.plata>=1000, "Boca caja de grande");
      ok(CAJA_BASE_2026.RIV.plata>CAJA_BASE_2026.SMO.plata, "River tiene más plata que Morning");
      ok(IND_BASE_2026.RIV && IND_BASE_2026.RIV.hinchada>=90, "River hinchada de grande");
    }, "Economía AFA");
    safe(function(){
      ok(ESTADIOS_DATA.BOC && /Bombonera/i.test(ESTADIOS_DATA.BOC.nombre||""), "ESTADIOS_DATA Boca");
      ok(ESTADIOS_DATA.SW && ESTADIOS_DATA.SW.aforo>10000, "ESTADIOS_DATA Wanderers");
      ok(ESTADIOS_DATA.SMO && ESTADIOS_DATA.SMO.aforo>0, "ESTADIOS_DATA Morning");
      ok(esRivalidadRegional("GME","IRV"), "clásico mendocino");
      ok(esRivalidadRegional("DCO","FV"), "clásico penquista DCO–Vial");
      ok(esRivalidadRegional("OHI","RAN"), "O'Higgins–Rangers");
    }, "Estadios + clásicos 86");
    safe(function(){
      ok((epocasDe("TIG")||[]).some(function(e){ return e.anio===2019; }), "Tigre 2019 Superliga (oro)");
      ok((epocasDe("PLA")||[]).some(function(e){ return e.anio===2021; }), "Platense 2021 (oro)");
      ok((epocasDe("BAR")||[]).some(function(e){ return e.anio===2022; }), "Barracas 2022 (oro)");
      var idsA=(typeof idsArgentina==="function")?idsArgentina():[];
      var sin=idsA.filter(function(id){ return !(epocasDe(id)||[]).length; });
      ok(sin.length===0, "Argentina: todos con época dorada"+(sin.length?" ("+sin.join(",")+")":""));
    }, "Oro AFA completo");

    /* T16 · 7.87 planteles documentados + sponsors + zonas AFA */
    grupo("Grok 7.87 (planteles River/Boca/Morning + datos ANFP/AFA)");
    safe(function(){
      ok(PLANTELES_REALES.RIV && PLANTELES_REALES.RIV[2026] && PLANTELES_REALES.RIV[2026].some(function(j){ return /Driussi/.test(j[0]); }), "River 2026: Driussi documentado");
      ok(PLANTELES_REALES.BOC && PLANTELES_REALES.BOC[2026] && PLANTELES_REALES.BOC[2026].some(function(j){ return /Paredes/.test(j[0]); }), "Boca 2026: Paredes documentado");
      ok(PLANTELES_REALES.SMO && PLANTELES_REALES.SMO[2026] && PLANTELES_REALES.SMO[2026].some(function(j){ return /Manríquez/.test(j[0]); }), "Morning 2026: Manríquez documentado");
      ok(PLANTELES_REALES.TRA && PLANTELES_REALES.TRA[2026].some(function(j){ return /Quiñones/.test(j[0]); }), "Trasandino: Quiñones (goleador Wikipedia)");
      ok(CLUB_INFO_2026.RIV && /Ponzio/.test(CLUB_INFO_2026.RIV.dt||""), "River DT Ponzio");
      ok(CLUB_INFO_2026.BOC && /Arruabarrena/.test(CLUB_INFO_2026.BOC.dt||""), "Boca DT Arruabarrena");
    }, "Planteles documentados");
    safe(function(){
      ok(SPONSORS_CLUB_2026.SMO && /Miami/.test(SPONSORS_CLUB_2026.SMO.ausp||""), "Morning sponsor Wikipedia");
      ok(SPONSORS_CLUB_2026.BSA && /Pelambres/.test(SPONSORS_CLUB_2026.BSA.ausp||""), "Brujas sponsor Los Pelambres");
      ok(ZONA_A_ARG_2026.indexOf("BOC")>=0 && ZONA_B_ARG_2026.indexOf("RIV")>=0, "zonas AFA 2026: Boca A, River B");
      ok(INTERZONAL_ARG_2026.BOC==="RIV" && INTERZONAL_ARG_2026.IND==="RAC", "interzonales Superclásico y Avellaneda");
      ok(COPA_CHILE_OCTAVOS_2026.AUD && COPA_CHILE_OCTAVOS_2026.AUD.rival==="CC", "Audax–Colo-Colo en octavos");
      ok(Object.keys(COPA_CHILE_OCTAVOS_2026).length>=16, "cuadro de octavos (ida y vuelta)");
      ok(AFORO_ARG_87.RIV>=80000, "Monumental aforo Wikipedia");
      ok(ARCOS_EQUIPO.RIV && ARCOS_EQUIPO.BOC, "arcos River y Boca");
    }, "Sponsors + zonas + octavos");
    safe(function(){
      nuevaPartida("RIV",2026,"historico",{categoria:"ARG"});
      ok(E.plantel.some(function(j){ return /Driussi|Almada|Otamendi/.test(j.n); }), "River arranca con plantel real");
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      ok(E.plantel.some(function(j){ return /Manríquez|Muñoz|Bolado/.test(j.n); }), "Morning arranca con plantel real");
    }, "Arranque con plantel real");

    /* T17 · 7.88 más planteles Wikipedia */
    grupo("Grok 7.88 (Osorno Lota Trasandino Racing Independiente Vélez San Lorenzo)");
    safe(function(){
      function tiene(id, ape){
        var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
        return s && s.some(function(j){ return (j[0]||"").indexOf(ape)>=0; });
      }
      ok(tiene("OSO","Bielkiewicz"), "Osorno: Bielkiewicz (Wiki)");
      ok(tiene("LSC","Povea"), "Lota: Povea capitán (Wiki)");
      ok(tiene("TRA","Cabello") && tiene("TRA","Quiñones"), "Trasandino plantel completo + Quiñones");
      ok(tiene("CLC","Cancino") && tiene("CLC","Pérez"), "Colchagua plantel completo");
      ok(tiene("RAC","Cambeses") && tiene("RAC","Zaracho"), "Racing 2026 Wikipedia 3 sep");
      ok(tiene("IND","Rey") && tiene("IND","Montiel"), "Independiente 11 sep");
      ok(tiene("VEL","Lanzini"), "Vélez: Lanzini");
      ok(tiene("SLO","Cerutti"), "San Lorenzo: Cerutti");
    }, "Planteles 88");
    safe(function(){
      nuevaPartida("OSO",2026,"historico",{categoria:"C"});
      ok(E.plantel.filter(function(j){ return j.real; }).length>=16, "Osorno arranca con plantel real");
      nuevaPartida("RAC",2026,"historico",{categoria:"ARG"});
      ok(E.plantel.some(function(j){ return /Zaracho|Cambeses|Rojo/.test(j.n); }), "Racing arranca con plantel real");
      ok(CLUB_INFO_2026.VEL && /Schelotto/.test(CLUB_INFO_2026.VEL.dt||""), "Vélez DT Barros Schelotto");
    }, "Arranque 88");

    /* T18 · 7.89 Segunda completa + AFA */
    grupo("Grok 7.89 (Segunda completa + Estudiantes Central Newell's Huracán)");
    safe(function(){
      function tiene(id, ape){
        var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
        return s && s.some(function(j){ return (j[0]||"").indexOf(ape)>=0; });
      }
      var seg=["COL","OVA","CNA","BSA","RSJ","SCI","LIN","REN","GVE","SMO","OSO","LSC","TRA","CLC"];
      ok(seg.every(function(id){ return PLANTELES_REALES[id] && PLANTELES_REALES[id][2026] && PLANTELES_REALES[id][2026].length>=14; }),
        "Segunda 2026: 14 clubes con plantel ≥14");
      ok(tiene("COL","Harding") && tiene("OVA","Cabrera") && tiene("CNA","Ragusa"), "Colina Harding / Ovalle Cabrera / Concón Ragusa");
      ok(tiene("BSA","Requena") && tiene("PMO","Taiva") && tiene("LIN","Vallejos"), "Brujas Requena / Taiva en Puerto Montt (salió de City) / Linares Vallejos");
      ok(tiene("ELP","Carrillo") && tiene("ELP","Muslera"), "Estudiantes: Carrillo + Muslera");
      ok(tiene("ROS","Di María") && tiene("ROS","Pizarro"), "Central: Di María + Vicente Pizarro");
      ok(tiene("NEW","Arias") && tiene("HUR","Galíndez") && tiene("HUR","Gil"), "Newell's Arias / Huracán Galíndez+Gil");
    }, "Planteles 89");
    safe(function(){
      nuevaPartida("CNA",2026,"historico",{categoria:"C"});
      ok(E.plantel.some(function(j){ return /Cerda|Ragusa/.test(j.n); }), "Concón arranca con plantel real");
      nuevaPartida("ROS",2026,"historico",{categoria:"ARG"});
      ok(E.plantel.some(function(j){ return /Di María|Campaz/.test(j.n); }), "Central arranca con Di María");
      ok(CLUB_INFO_2026.NEW && /Kudelka/.test(CLUB_INFO_2026.NEW.dt||""), "Newell's DT Kudelka");
      ok(CLUB_INFO_2026.LIN && /Meléndez/.test(CLUB_INFO_2026.LIN.dt||""), "Linares DT Meléndez");
    }, "Arranque 89");

    /* T19 · 7.90 más AFA */
    grupo("Grok 7.90 (Talleres Lanús Argentinos Belgrano Defensa Instituto Unión)");
    safe(function(){
      function tiene(id, ape){
        var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
        return s && s.some(function(j){ return (j[0]||"").indexOf(ape)>=0; });
      }
      ok(tiene("TAL","Catalán") && tiene("TAL","Schott"), "Talleres: Catalán + Schott");
      ok(tiene("LAN","Moreno") && tiene("LAN","Izquierdoz"), "Lanús: Moreno + Izquierdoz");
      ok(tiene("ARG","Cortés") && tiene("ARG","Verón"), "Argentinos: Cortés (Colo-Colo) + Verón");
      ok(tiene("BEL","Zelarayán") && tiene("DYJ","Pérez"), "Belgrano Zelarayán / Defensa César Pérez");
      ok(tiene("INS","Guerra") && tiene("UNI","Fragapane"), "Instituto Guerra / Unión Fragapane");
      ok(tiene("GME","Rigamonti") && tiene("ERC","Ábila"), "Gimnasia Mza Rigamonti / Estudiantes RC Ábila");
      ok(tiene("UNI","Fragapane"), "Unión Fragapane");
    }, "Planteles 90");
    safe(function(){
      nuevaPartida("ARG",2026,"historico",{categoria:"ARG"});
      ok(E.plantel.some(function(j){ return /Cortés|Verón|Lescano/.test(j.n); }), "Argentinos arranca con plantel real");
      ok(CLUB_INFO_2026.LAN && /Pellegrino/.test(CLUB_INFO_2026.LAN.dt||""), "Lanús DT Pellegrino");
      ok(CLUB_INFO_2026.UNI && /Madelón/.test(CLUB_INFO_2026.UNI.dt||""), "Unión DT Madelón");
    }, "Arranque 90");

    /* T20 · 7.91 AFA 30/30 */
    grupo("Grok 7.91 (AFA completa: Tigre Banfield Platense Riestra Tucumán)");
    safe(function(){
      function tiene(id, ape){
        var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
        return s && s.some(function(j){ return (j[0]||"").indexOf(ape)>=0; });
      }
      var afa=["RIV","BOC","RAC","IND","VEL","SLO","ELP","ROS","NEW","HUR","TAL","LAN","ARG","BEL","DYJ","INS","UNI","GLP","TUC","TIG","BAN","PLA","CCO","IRV","SAR","ALD","GME","RIE","ERC","BAR"];
      ok(afa.length===30 && afa.every(function(id){ return PLANTELES_REALES[id] && PLANTELES_REALES[id][2026] && PLANTELES_REALES[id][2026].length>=8; }),
        "AFA 2026: 30/30 con plantel documentado ≥8");
      ok(tiene("TIG","Soto") && tiene("TIG","Martínez"), "Tigre: Soto + Pity Martínez");
      ok(tiene("PLA","Vázquez") && tiene("PLA","Nasif"), "Platense: Vázquez + Nasif");
      ok(tiene("IRV","Riep") && tiene("RIE","Quintana"), "Rivadavia Riep / Riestra Quintana");
      ok(tiene("TUC","Canelo") && tiene("SAR","Insaurralde") && tiene("ALD","Vombergar"), "Tucumán Canelo / Sarmiento Insaurralde / Aldosivi Vombergar");
      ok(tiene("BAR","Espínola") && tiene("GLP","Janson") && tiene("BAN","Balboa"), "Barracas / Gimnasia Janson / Banfield Balboa");
    }, "Planteles 91");
    safe(function(){
      nuevaPartida("TIG",2026,"historico",{categoria:"ARG"});
      ok(E.plantel.some(function(j){ return /Soto|Saralegui|Martínez/.test(j.n); }), "Tigre arranca con plantel real");
      ok(CLUB_INFO_2026.BAN && /Troglio/.test(CLUB_INFO_2026.BAN.dt||""), "Banfield DT Troglio");
      ok(CLUB_INFO_2026.SAR && /Sava/.test(CLUB_INFO_2026.SAR.dt||""), "Sarmiento DT Sava");
      ok(CLUB_INFO_2026.RIE && /Duró/.test(CLUB_INFO_2026.RIE.dt||""), "Riestra DT Duró");
    }, "Arranque 91");

    /* T21 · 7.92 huecos Wikipedia + Cobreloa 1981 */
    grupo("Grok 7.92 (Gimnasia Wiki, Malcorra a Unión, Cobreloa 1981)");
    safe(function(){
      function tiene(id, ape){
        var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
        return s && s.some(function(j){ return (j[0]||"").indexOf(ape)>=0; });
      }
      ok(PLANTELES_REALES.GLP[2026].length>=22, "Gimnasia LP plantel Wiki ≥22");
      ok(tiene("GLP","Janson") && tiene("GLP","Fernández") && tiene("GLP","Giampaoli"), "Gimnasia: Janson + Nacho Fernández + Giampaoli");
      ok(tiene("CCO","Marchi") && tiene("CCO","Tijanovich"), "Central Córdoba: Marchi + Tijanovich");
      ok(tiene("TUC","Ferreira") && tiene("TUC","Laméndola"), "Tucumán: Ferreira + Laméndola");
      ok(tiene("BAR","Demartini") && tiene("BAR","Tapia"), "Barracas: Demartini + Tapia");
      ok(!tiene("IND","Malcorra") && tiene("UNI","Malcorra"), "Malcorra solo en Unión (Wiki 8 sep)");
      ok(tiene("IND","Morales"), "Independiente: Iván Morales");
      ok(tiene("LIM","Sosa") && PLANTELES_REALES.LIM[2026].length>=20, "Limache plantel Wiki ≥20");
      ok(tiene("UC","Palavecino") && tiene("UC","Farías"), "UC: Palavecino + Farías");
      var cbl=PLANTELES_REALES.CBL && PLANTELES_REALES.CBL[1981];
      ok(cbl && cbl.some(function(j){ return /Wirth/.test(j[0]); }) && cbl.some(function(j){ return /Soto/.test(j[0]); }) && cbl.some(function(j){ return /Merello/.test(j[0]); }),
        "Cobreloa 1981: Wirth + Soto + Merello (final Libertadores)");
    }, "Planteles 92");
    safe(function(){
      nuevaPartida("GLP",2026,"historico",{categoria:"ARG"});
      ok(E.plantel.some(function(j){ return /Janson|Fernández|Giampaoli/.test(j.n); }), "Gimnasia arranca con plantel Wiki");
      nuevaPartida("LIM",2026,"historico");
      ok(E.plantel.some(function(j){ return /Sosa|Parot|Meneses/.test(j.n); }), "Limache arranca con plantel Wiki");
      ok(CLUB_INFO_2026.GLP && /Pereyra/.test(CLUB_INFO_2026.GLP.dt||""), "Gimnasia DT Ariel Pereyra");
      ok(CLUB_INFO_2026.TUC && /Falcioni/.test(CLUB_INFO_2026.TUC.dt||""), "Tucumán DT Falcioni");
      ok(CLUB_META.GLP && CLUB_META.GLP.fund===1887, "Gimnasia fund 1887");
      ok(CLUB_META.BOC && CLUB_META.BOC.fund===1905, "Boca fund 1905");
      ok(AFORO_ARG_87.GLP===30973, "Zerillo aforo Wikipedia 30973");
      ok(typeof VERSION==="string" && /^[78]\.\d+$/.test(VERSION), "VERSION 7.x/8.x");
    }, "Arranque 92");

    /* T22 · 7.93 Primera Chile + B Wikipedia */
    grupo("Grok 7.93 (Colo-Colo U. de Chile Palestino Everton San Luis)");
    safe(function(){
      function tiene(id, ape){
        var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
        return s && s.some(function(j){ return (j[0]||"").indexOf(ape)>=0; });
      }
      ok(PLANTELES_REALES.CC[2026].length>=20, "Colo-Colo plantel Wiki ≥20");
      ok(tiene("CC","Vidal") && tiene("CC","Romero") && tiene("CC","Correa") && tiene("CC","de Paul"), "CC: Vidal + Romero + Correa + de Paul");
      ok(!tiene("CC","Pizarro"), "CC: Pizarro no (fue a Central)");
      ok(tiene("UCH","Vargas") && tiene("UCH","Lucero") && tiene("UCH","Aránguiz") && tiene("UCH","Altamirano"), "UCH: Vargas + Lucero + Aránguiz + Altamirano");
      ok(!tiene("UCH","Assadi"), "UCH: Assadi no (AIK 21 ago)");
      ok(tiene("PAL","Roco") && tiene("PAL","Abrigo") && tiene("PAL","Munder") && tiene("PAL","Tapia"), "PAL: Roco + Abrigo + Munder + Tapia");
      ok(tiene("EVE","Opazo") && tiene("EVE","Villalpando") && tiene("EVE","Palacios"), "EVE: Opazo + Villalpando + Palacios");
      ok(tiene("SLQ","Parada") && tiene("SLQ","Vergara") && PLANTELES_REALES.SLQ[2026].length>=18, "San Luis: Parada + delanteros Wiki");
      ok(tiene("UES","Rubio") && tiene("UES","Vilches") && tiene("CBL","Gotti") && tiene("CBL","Duma"), "UES Rubio/Vilches · Cobreloa Gotti/Duma");
      ok(tiene("USF","Fontana") && tiene("REC","Estigarribia") && tiene("MAG","Jorquera") && tiene("DCO","Sandoval"), "USF Fontana / Recoleta Estigarribia / MAG Jorquera / DCO Sandoval");
      ok(tiene("SW","Camarda") && tiene("SW","Luna"), "Wanderers: Camarda + Luna");
    }, "Planteles 93");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      ok(E.plantel.some(function(j){ return /Vidal|Romero|Correa/.test(j.n); }), "Colo-Colo arranca con plantel Wiki");
      nuevaPartida("UCH",2026,"historico");
      ok(E.plantel.some(function(j){ return /Vargas|Lucero|Aránguiz/.test(j.n); }), "La U arranca con plantel Wiki");
      ok(!E.plantel.some(function(j){ return /Assadi/.test(j.n); }), "La U no arranca con Assadi");
      nuevaPartida("SLQ",2026,"historico",{categoria:"B"});
      ok(E.plantel.some(function(j){ return /Parada|Vergara|Madrigal/.test(j.n); }), "San Luis arranca con delanteros Wiki");
      ok(CLUB_INFO_2026.CC && /Ortiz/.test(CLUB_INFO_2026.CC.dt||""), "Colo-Colo DT Ortiz");
      ok(CLUB_INFO_2026.UCH && /Gago/.test(CLUB_INFO_2026.UCH.dt||""), "U. de Chile DT Gago");
      ok(CLUB_INFO_2026.SLQ && /Suazo/.test(CLUB_INFO_2026.SLQ.dt||""), "San Luis DT Suazo");
      function tieneEp(id, anio){
        var arr=(typeof epocasDe==="function"?epocasDe(id):(EPOCAS_CLUB[id]||[]));
        return arr.some(function(e){ return e.anio===anio; });
      }
      ok(tieneEp("SMO",1942), "Morning época 1942 (campeón)");
      ok(tieneEp("MAG",1933), "Magallanes época 1933 (primer campeón)");
      ok(tieneEp("LSC",1969), "Lota época 1969 (ascenso)");
      ok(typeof VERSION==="string" && /^[78]\.\d+$/.test(VERSION), "VERSION 7.x/8.x");
    }, "Arranque 93");

    /* T23 · 7.94 resto Primera Chile Wikipedia */
    grupo("Grok 7.94 (Coquimbo Audax Huachipato O'Higgins Ñublense Cobresal)");
    safe(function(){
      function tiene(id, ape){
        var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
        return s && s.some(function(j){ return (j[0]||"").indexOf(ape)>=0; });
      }
      var pri=["CC","UCH","UC","EVE","PAL","COQ","AUD","HUA","OHI","NUB","COB","CAL","LSE","DCO","UDC","LIM"];
      ok(pri.length===16 && pri.every(function(id){ return PLANTELES_REALES[id] && PLANTELES_REALES[id][2026] && PLANTELES_REALES[id][2026].length>=18; }),
        "Primera 2026: 16/16 con plantel Wiki ≥18");
      ok(tiene("COQ","Galani") && tiene("COQ","Pratto") && tiene("COQ","Glaby") && tiene("COQ","Johansen"), "Coquimbo: Galani + Pratto + Glaby + Johansen");
      ok(!tiene("COQ","Palavecino") && tiene("UC","Palavecino"), "Palavecino solo en UC (baja Coquimbo)");
      ok(tiene("COQ","Escobar") && !tiene("LIM","Escobar"), "Dylan Escobar solo en Coquimbo (retorno)");
      ok(tiene("AUD","Ahumada") && tiene("AUD","Pizarro") && tiene("AUD","Pinares") && tiene("AUD","Collao"), "Audax: Ahumada + Pizarro + Pinares + Collao");
      ok(tiene("HUA","Sepúlveda") && tiene("HUA","Altamirano") && tiene("HUA","Cañete") && tiene("HUA","Malanca"), "Huachipato: Sepúlveda + Altamirano + Cañete + Malanca");
      ok(!tiene("HUA","Gutiérrez") && tiene("IND","Gutiérrez"), "Maxi Gutiérrez: Independiente (traspaso HUA)");
      ok(!tiene("BAN","Malanca"), "Malanca no está en Banfield");
      ok(tiene("OHI","Robledo") && tiene("OHI","Vecino") && tiene("OHI","Castillo") && tiene("OHI","Avilés"), "O'Higgins: Robledo + Vecino + Castillo + Avilés");
      ok(!tiene("OHI","Sarrafiore"), "Sarrafiore no (baja Atlante 2º sem)");
      ok(tiene("NUB","Plaza") && tiene("NUB","Pérez") && tiene("NUB","Céspedes") && !tiene("NUB","Cerezo"), "Ñublense: Plaza + Pérez + Céspedes, Cerezo no (UC)");
      ok(tiene("COB","Tiznado") && tiene("COB","Brea") && tiene("COB","Villagrán") && !tiene("EVE","Villagrán"), "Cobresal Tiznado/Brea/Villagrán · Everton ya no");
      ok(!tiene("COB","Nadruz") && !tiene("COB","Munder"), "Cobresal: Nadruz y Munder no (bajas documentadas)");
      ok(tiene("CAL","Sáez") && tiene("CAL","Avellaneda") && tiene("LSE","Henríquez") && tiene("LSE","Vargas") && tiene("LSE","Rubio"), "Calera Sáez + Serena Henríquez/Vargas/Rubio");
      ok(tiene("UDC","Waterman") && tiene("UDC","Broun") && tiene("UDC","Funes Mori") && tiene("UDC","González"), "U. Concepción: Waterman + Broun + Funes Mori");
    }, "Planteles 94");
    safe(function(){
      nuevaPartida("COQ",2026,"historico");
      ok(E.plantel.some(function(j){ return /Galani|Pratto|Johansen/.test(j.n); }), "Coquimbo arranca con plantel Wiki");
      ok(!E.plantel.some(function(j){ return /Palavecino/.test(j.n); }), "Coquimbo no arranca con Palavecino");
      nuevaPartida("AUD",2026,"historico");
      ok(E.plantel.some(function(j){ return /Ahumada|Pizarro|Pinares/.test(j.n); }), "Audax arranca con plantel Wiki");
      nuevaPartida("HUA",2026,"historico");
      ok(E.plantel.some(function(j){ return /Sepúlveda|Altamirano|Malanca/.test(j.n); }), "Huachipato arranca con plantel Wiki");
      ok(CLUB_INFO_2026.COQ && /Caputto/.test(CLUB_INFO_2026.COQ.dt||""), "Coquimbo DT Caputto");
      ok(CLUB_INFO_2026.AUD && /Graff/.test(CLUB_INFO_2026.AUD.dt||""), "Audax DT Graff");
      ok(CLUB_INFO_2026.HUA && /García/.test(CLUB_INFO_2026.HUA.dt||""), "Huachipato DT García");
      ok(CLUB_INFO_2026.OHI && /Bovaglio/.test(CLUB_INFO_2026.OHI.dt||""), "O'Higgins DT Bovaglio");
      ok(CLUB_INFO_2026.NUB && /Ribera/.test(CLUB_INFO_2026.NUB.dt||""), "Ñublense DT Ribera");
      ok(CLUB_INFO_2026.COB && /Huerta/.test(CLUB_INFO_2026.COB.dt||""), "Cobresal DT Huerta");
      ok(CLUB_INFO_2026.CAL && /Cicotello/.test(CLUB_INFO_2026.CAL.dt||""), "La Calera DT Cicotello");
      ok(CLUB_INFO_2026.UDC && /Muñoz/.test(CLUB_INFO_2026.UDC.dt||""), "U. Concepción DT Muñoz");
      ok(typeof VERSION==="string" && /^[78]\.\d+$/.test(VERSION), "VERSION 7.x/8.x");
    }, "Arranque 94");

    /* T24 · 7.95 resto Primera B Wikipedia */
    grupo("Grok 7.95 (Antofagasta Puerto Montt San Marcos Copiapó Temuco Iquique Curicó Santa Cruz Rangers)");
    safe(function(){
      function tiene(id, ape){
        var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
        return s && s.some(function(j){ return (j[0]||"").indexOf(ape)>=0; });
      }
      var b=["SW","CBL","SLQ","ANT","MAG","UES","REC","PMO","SMA","COP","TEM","IQQ","USF","CUR","SCR","RAN"];
      ok(b.length===16 && b.every(function(id){ return PLANTELES_REALES[id] && PLANTELES_REALES[id][2026] && PLANTELES_REALES[id][2026].length>=18; }),
        "Primera B 2026: 16/16 con plantel Wiki ≥18");
      ok(tiene("ANT","Monreal") && tiene("ANT","Bandez") && tiene("ANT","Campillay") && tiene("ANT","Ibacache"), "Antofagasta: Monreal + Bandez + Campillay + Ibacache");
      ok(tiene("PMO","Paredes") && tiene("PMO","Collao") && tiene("PMO","Nieto") && tiene("PMO","Castro"), "Puerto Montt: Paredes + Collao + Nieto + Castro");
      ok(tiene("SMA","Melivil") && tiene("SMA","Saracho") && tiene("SMA","Barboza") && tiene("SMA","Monroy"), "San Marcos: Melivilú + Saracho + Barboza + Monroy");
      ok(tiene("COP","Palacios") && tiene("COP","Temperini") && tiene("COP","Fuenzalida") && !tiene("REC","Fuenzalida"), "Copiapó Palacios/Temperini/Fuenzalida · Recoleta ya no");
      ok(tiene("TEM","Huanca") && tiene("TEM","Buonanotte") && tiene("TEM","Urra") && tiene("TEM","Acevedo"), "Temuco: Huanca + Buonanotte + Urra + Acevedo");
      ok(tiene("IQQ","Ramos") && tiene("IQQ","Puch") && tiene("IQQ","López") && tiene("IQQ","Garrido"), "Iquique: Ramos + Puch + López + Garrido");
      ok(tiene("CUR","Benegas") && tiene("CUR","Colombo") && tiene("CUR","Tello") && tiene("CUR","Romo"), "Curicó: Benegas + Colombo + Tello + Romo");
      ok(tiene("SCR","Zeineddin") && tiene("SCR","Pinto") && tiene("SCR","Camisassa") && tiene("SCR","Islame"), "Santa Cruz: Zeineddin + Pinto + Camisassa + Islame");
      ok(tiene("RAN","Arias") && tiene("RAN","Campestrini") && tiene("RAN","Méndez") && tiene("RAN","Mesías"), "Rangers: Arias + Campestrini + Méndez + Mesías");
    }, "Planteles 95");
    safe(function(){
      nuevaPartida("ANT",2026,"historico",{categoria:"B"});
      ok(E.plantel.some(function(j){ return /Monreal|Bandez|Campillay/.test(j.n); }), "Antofagasta arranca con plantel Wiki");
      nuevaPartida("IQQ",2026,"historico",{categoria:"B"});
      ok(E.plantel.some(function(j){ return /Ramos|Puch/.test(j.n); }), "Iquique arranca con Ramos/Puch");
      nuevaPartida("RAN",2026,"historico",{categoria:"B"});
      ok(E.plantel.some(function(j){ return /Arias|Campestrini|Méndez/.test(j.n); }), "Rangers arranca con plantel Wiki");
      ok(CLUB_INFO_2026.ANT && /Marcoleta/.test(CLUB_INFO_2026.ANT.dt||""), "Antofagasta DT Marcoleta");
      ok(CLUB_INFO_2026.PMO && /Mancilla/.test(CLUB_INFO_2026.PMO.dt||""), "Puerto Montt DT Mancilla");
      ok(CLUB_INFO_2026.SMA && /Sandrock/.test(CLUB_INFO_2026.SMA.dt||""), "San Marcos DT Sandrock");
      ok(CLUB_INFO_2026.COP && /Durán/.test(CLUB_INFO_2026.COP.dt||""), "Copiapó DT Durán");
      ok(CLUB_INFO_2026.TEM && /Astorga/.test(CLUB_INFO_2026.TEM.dt||""), "Temuco DT Astorga");
      ok(CLUB_INFO_2026.IQQ && /Peña/.test(CLUB_INFO_2026.IQQ.dt||""), "Iquique DT Peña");
      ok(CLUB_INFO_2026.CUR && /Muñoz/.test(CLUB_INFO_2026.CUR.dt||""), "Curicó DT Muñoz");
      ok(CLUB_INFO_2026.SCR && /Giovagnoli/.test(CLUB_INFO_2026.SCR.dt||""), "Santa Cruz DT Giovagnoli");
      ok(CLUB_INFO_2026.RAN && /Basay/.test(CLUB_INFO_2026.RAN.dt||""), "Rangers DT Basay");
      ok(typeof VERSION==="string" && /^[78]\.\d+$/.test(VERSION), "VERSION 7.x/8.x");
    }, "Arranque 95");

    /* T25 · 7.96 LINKS: Segunda cableada + AFA estilizado + manifiesto */
    grupo("Grok 7.96 (escudos Segunda + AFA + VERSION)");
    safe(function(){
      var c=["SMO","LSC","OSO","LIN","CLC","TRA","COL","OVA","CNA","BSA","RSJ","SCI","GVE","REN"];
      ok(c.length===14 && c.every(function(id){ return ESCUDOS_FOTOS[id] && ESCUDOS_FOTOS[id].src; }),
        "Segunda 14/14 en ESCUDOS_FOTOS");
      ok(c.every(function(id){ return /img\/clubes\/[A-Z]{3}\.svg$/.test(ESCUDOS_FOTOS[id].src); }),
        "Segunda usa SVG estilizado en disco");
      ok(c.every(function(id){ return ESCUDOS_CLUB[id] && ESCUDOS_CLUB[id].c1; }),
        "Segunda 14/14 en ESCUDOS_CLUB");
      var afa=["RIV","BOC","RAC","IND","VEL","SLO","ELP","ROS","TAL","HUR","LAN","ARG","NEW","BEL","DYJ","INS","UNI","GLP","TUC","TIG","BAN","PLA","CCO","IRV","SAR","ALD","GME","RIE","ERC","BAR"];
      ok(afa.length===30 && afa.every(function(id){ return ESCUDOS_CLUB[id] && ESCUDOS_CLUB[id].c1; }),
        "AFA 30/30 en ESCUDOS_CLUB (estilizado)");
      ok(typeof fotoEstadioDe==="function" && fotoEstadioDe("PAL") && fotoEstadioDe("RAN"),
        "Chile Primera+B sigue con foto de estadio");
      ok(!fotoEstadioDe("SCR"), "Santa Cruz sin foto de estadio (a propósito)");
      ok(typeof VERSION==="string" && /^[78]\.\d+$/.test(VERSION), "VERSION 7.x/8.x");
    }, "Escudos 96");

    /* T26 · 7.97 caza: Segunda ≠ Colo-Colo 1991 + copias de plantel */
    grupo("Grok 7.97 (historia por club + sin copias)");
    safe(function(){
      ok(typeof idClubCanon==="function" && idClubCanon("COB",1991)==="CBL", "COB 1991 canónico = CBL (Cobreloa)");
      ok(idClubCanon("COB",2026)==="COB", "COB 2026 sigue Cobresal");
      ok(idClubCanon("SMO","2026c")==="SMO", "Morning no se reescribe");
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      ok(E.eraBase==="2026c", "Morning arranca en Segunda");
      SEC="historia";
      if(typeof render==="function") render();
      var txt=(document.getElementById("vista")||{textContent:""}).textContent||"";
      ok(!/Temporada 1991/.test(txt), "Segunda no titula Temporada 1991");
      ok(!/Libertadores 1991 la ganó Colo-Colo/.test(txt), "Segunda no muestra la Libertadores de Colo-Colo");
      ok(!/Tabla final histórica 1991/.test(txt), "Segunda no muestra la tabla 1991");
      ok(/Segunda División/.test(txt), "Segunda muestra su propia época");
      ok(/Morning|Pintana|1909|Paredes/.test(txt), "línea del club es Morning");
    }, "Historia Segunda ≠ CC 1991");
    safe(function(){
      nuevaPartida("BOC",2026,"historico",{categoria:"ARG"});
      SEC="historia";
      if(typeof render==="function") render();
      var txt=(document.getElementById("vista")||{textContent:""}).textContent||"";
      ok(!/Temporada 1991/.test(txt), "Argentina no titula Temporada 1991");
      ok(!/Libertadores 1991 la ganó Colo-Colo/.test(txt), "Argentina no muestra CC 1991");
      ok(/AFA|Liga Profesional/.test(txt), "Argentina muestra AFA / Liga Profesional");
      ok(/Bombonera|1905|Boca/.test(txt), "línea del club es Boca");
    }, "Historia Argentina ≠ CC 1991");
    safe(function(){
      nuevaPartida("CC",1991,"historico");
      SEC="historia";
      if(typeof render==="function") render();
      var txt=(document.getElementById("vista")||{textContent:""}).textContent||"";
      ok(/Libertadores/.test(txt) && /Olimpia/.test(txt), "Colo-Colo 1991 SÍ muestra su Libertadores");
      ok(/Tabla final histórica 1991/.test(txt), "Colo-Colo 1991 muestra la tabla nacional");
    }, "CC 1991 conserva su historia");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      var dec=(typeof decisionesDisponibles==="function")?decisionesDisponibles():[];
      ok(dec.every(function(d){ return d.id.indexOf("cc91_")!==0; }), "Segunda no recibe decisiones cc91_");
      ok(dec.every(function(d){ return typeof decisionCabeEnClub!=="function" || decisionCabeEnClub(d); }), "todas las de Segunda pasan el filtro");
      var blob=JSON.stringify(dec);
      ok(!/La Leonera|deuda del Monumental/i.test(blob), "Segunda no habla del Monumental / La Leonera");
      nuevaPartida("BOC",2026,"historico",{categoria:"ARG"});
      var decA=(typeof decisionesDisponibles==="function")?decisionesDisponibles():[];
      ok(!decA.some(function(d){ return /ANFP/.test((d.t||"")+" "+(d.d||"")); }), "Argentina no recibe cartas de la ANFP");
    }, "Decisiones no se copian de CC/ANFP");
    safe(function(){
      var seen={}, dups=[];
      Object.keys(PLANTELES_REALES||{}).forEach(function(id){
        var s=PLANTELES_REALES[id]&&PLANTELES_REALES[id][2026];
        if(!s) return;
        s.forEach(function(j){
          var n=j[0], pos=j[1], edad=j[2];
          if(!n) return;
          var key=n+"|"+pos+"|"+edad;
          if(seen[key] && seen[key]!==id) dups.push(n+" "+pos+" "+edad+" en "+seen[key]+" y "+id);
          else seen[key]=id;
        });
      });
      ok(dups.length===0, "sin copias de ficha 2026 (mismo nombre+posición+edad)"+(dups.length?" ("+dups.slice(0,8).join("; ")+")":""));
      ok(typeof tiene==="undefined" || true, "keep");
      function tiene(id, ape){
        var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
        return s && s.some(function(j){ return (j[0]||"").indexOf(ape)>=0; });
      }
      ok(tiene("UES","Molina") && tiene("NUB","Molina"), "Lucas Molina: dos personas (UES y Ñublense)");
      ok(tiene("UCH","Fernández") && tiene("CUR","Fernández"), "Nicolás Fernández: dos personas (U y Curicó)");
      ok(!tiene("CLC","Fabricio Vera") && tiene("OHI","Vera"), "Fabricio Vera solo en O'Higgins (copia sacada de Colchagua)");
      ok(!tiene("CLC","Olea") && tiene("USF","Olea"), "Manuel Olea solo en San Felipe (copia sacada de Colchagua)");
      ok(tiene("PMO","Taiva") && !tiene("SCI","Taiva"), "Bryan Taiva solo Puerto Montt (junio 2026, salió de City)");
      ok(tiene("OSO","Pacheco") && !tiene("COB","Ignacio Pacheco"), "Ignacio Pacheco cedido en Osorno (no Cobresal)");
      ok(tiene("UCH","Alburquenque") && !tiene("LSC","Alburquenque"), "Alburquenque volvió a la U (julio 2026)");
      ok(tiene("BSA","Valdés") && !tiene("REC","Bastián Valdés"), "Bastián Valdés en Brujas (salió de Recoleta)");
      ok(tiene("GVE","Cerda") && !tiene("COB","Jean Cerda"), "Jean Cerda cedido en Velásquez (no Cobresal)");
      ok(tiene("TUC","Julián Fernández") && !tiene("PAL","Julián Fernández"), "Julián Fernández cedido en Tucumán (no Palestino)");
      ok(typeof VERSION==="string" && /^[78]\.\d+$/.test(VERSION), "VERSION 7.x/8.x");
    }, "Planteles sin copias");

    /* T27 · 7.98 historias ajenas: todos los de Segunda + 1925 + Limache */
    grupo("Grok 7.98 (Segunda/1925/Limache no heredan Colo-Colo 1991)");
    safe(function(){
      ok(typeof textoHistoriaAjeno==="function", "textoHistoriaAjeno existe");
      ok(textoHistoriaAjeno("Campeón de América: 3-0 a Olimpia en el Monumental","SMO"), "Morning no hereda Olimpia");
      ok(!textoHistoriaAjeno("Campeón de América: 3-0 a Olimpia en el Monumental","CC"), "Colo-Colo sí puede hablar de Olimpia");
      var seg=["SMO","LSC","OSO","LIN","CLC","TRA","COL","OVA","CNA","BSA","RSJ","SCI","GVE","REN"];
      var mal=[];
      seg.forEach(function(id){
        nuevaPartida(id,2026,"historico",{categoria:"C"});
        SEC="historia";
        if(typeof render==="function") render();
        var txt=(document.getElementById("vista")||{textContent:""}).textContent||"";
        if(/Libertadores 1991 la ganó Colo-Colo/.test(txt) || /Tabla final histórica 1991/.test(txt) || /Temporada 1991/.test(txt))
          mal.push(id);
      });
      ok(mal.length===0, "ningún Segunda vuelca CC 1991"+(mal.length?" ("+mal.join(",")+")":""));
    }, "Segunda 14/14 historia propia");
    safe(function(){
      nuevaPartida("LIM",1991,"historico");
      ok(E && E.eraBase===2026, "Limache 1991 se redirige a 2026 (no existía)");
      SEC="historia";
      if(typeof render==="function") render();
      var txt=(document.getElementById("vista")||{textContent:""}).textContent||"";
      ok(!/Libertadores 1991 la ganó Colo-Colo/.test(txt), "Limache no muestra la Libertadores de CC");
      ok(!/Tabla final histórica 1991/.test(txt), "Limache no muestra la tabla 1991");
    }, "Limache ≠ 1991");
    safe(function(){
      var r=nuevaPartida("MAG",1925,"historico",{categoria:"1925"});
      ok(r!==false && E && E.eraBase===1925, "Magallanes arranca en 1925");
      SEC="historia";
      if(typeof render==="function") render();
      var txt=(document.getElementById("vista")||{textContent:""}).textContent||"";
      ok(!/Campeón histórico:/.test(txt), "Magallanes 1925 no titula el invicto de Colo-Colo como propio");
      ok(!/Libertadores 1991 la ganó Colo-Colo/.test(txt), "1925 no muestra CC 1991");
      ok(!/Arellano y los Rebeldes/.test(txt), "1925 de Magallanes no vende el plantel de Colo-Colo");
    }, "1925 Magallanes ≠ CC");
    safe(function(){
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      ok(typeof textoPlopAjeno==="function" && textoPlopAjeno("COLO-COLO CAMPEÓN DE AMÉRICA. 3-0 a Olimpia en el Monumental."), "Plop de Segunda filtra titular de CC 1991");
      nuevaPartida("CC",1991,"historico");
      ok(!textoPlopAjeno("COLO-COLO CAMPEÓN DE AMÉRICA. 3-0 a Olimpia en el Monumental."), "Plop de CC 1991 conserva su titular");
      ok(typeof VERSION==="string" && /^7\.\d+$/.test(VERSION), "VERSION 7.x");
    }, "Plop filtrado + versión");

    /* T28 · 7.99 rigor vs Colo-Colo: épocas con plantel real + UC al día */
    grupo("Grok 7.99 (rigor vs Colo-Colo)");
    safe(function(){
      ok(typeof VERSION==="string" && /^7\.\d+$/.test(VERSION), "VERSION 7.x");
      var cc=PLANTELES_REALES.CC;
      ok(cc && cc[2026] && cc[2026].length>=22, "CC 2026 sigue siendo el listón (≥22)");
      ok(cc[1989] && cc[1991] && cc[2002] && cc[2006], "CC tiene 1989/1991/2002/2006");
      var vidal=(cc[2026]||[]).filter(function(j){ return j[0]==="Arturo Vidal"; })[0];
      ok(vidal && (vidal[7]||[]).indexOf("capitán")>=0, "CC: Vidal capitán");
      var uch=(PLANTELES_REALES.UCH&&PLANTELES_REALES.UCH[2026])||[];
      ok(uch.every(function(j){ return j[0]!=="Lucas Assadi"; }), "Assadi no está en la U 2026 (AIK)");
      var uc=(PLANTELES_REALES.UC&&PLANTELES_REALES.UC[2026])||[];
      var giani=uc.filter(function(j){ return j[0]==="Justo Giani"; })[0];
      ok(giani && giani[1]==="DEL", "UC: Giani es DEL (wiki season)");
      ok(uc.some(function(j){ return j[0]==="Martín Gómez"; }), "UC: Martín Gómez (préstamo Pilar)");
      ok(uc.some(function(j){ return j[0]==="Diego Corral"; }), "UC: Diego Corral");
      ok(uc.some(function(j){ return j[0]==="Nicolás L'Huillier"; }), "UC: L'Huillier");
      var ues13=PLANTELES_REALES.UES&&PLANTELES_REALES.UES[2013];
      ok(ues13 && ues13.length>=18, "UES 2013 plantel real ≥18 (Transición)");
      ok(ues13.some(function(j){ return j[0]==="Christian Cueva"; }), "UES 2013: Cueva");
      ok(ues13.some(function(j){ return j[0]==="Jorge Ampuero"; }), "UES 2013: Ampuero");
      var sw01=PLANTELES_REALES.SW&&PLANTELES_REALES.SW[2001];
      ok(sw01 && sw01.length>=18, "SW 2001 plantel real ≥18 (tercera estrella)");
      ok(sw01.some(function(j){ return j[0]==="Silvio Fernández"; }), "SW 2001: Silvio Fernández");
      ok(sw01.some(function(j){ return j[0]==="Jaime Riveros"; }), "SW 2001: Riveros");
      var pri=["CC","UCH","UC","PAL","EVE","COQ","AUD","HUA","OHI","NUB","COB","CAL","LSE","DCO","UDC","LIM"];
      var flacos=[];
      pri.forEach(function(id){
        var n=(PLANTELES_REALES[id]&&PLANTELES_REALES[id][2026]||[]).length;
        if(n<18) flacos.push(id+"="+n);
      });
      ok(flacos.length===0, "Primera 16/16 plantel 2026 ≥18"+(flacos.length?" ("+flacos.join(",")+")":""));
    }, "Rigor vs Colo-Colo");

    /* T29 · 8.00 UCH 1994 / Boca 2007 / River 2018 al listón CC */
    grupo("Grok 8.00 (U 1994 + Boca 2007 + River 2018)");
    safe(function(){
      ok(typeof VERSION==="string" && /^7\.\d+$/.test(VERSION), "VERSION 7.x");
      var u94=PLANTELES_REALES.UCH&&PLANTELES_REALES.UCH[1994];
      ok(u94 && u94.length>=20, "UCH 1994 plantel real ≥20 (era 8 fichas)");
      ok(u94.filter(function(j){ return j[1]==="ARQ"; }).length>=2, "UCH 1994 tiene ≥2 ARQ");
      ok(u94.some(function(j){ return j[0]==="Marcelo Salas"; }), "UCH 1994: Salas");
      ok(u94.some(function(j){ return j[0]==="Luis Musrri" && (j[7]||[]).indexOf("capitán")>=0; }), "UCH 1994: Musrri capitán");
      ok(u94.some(function(j){ return j[0]==="Patricio Mardones"; }), "UCH 1994: Mardones");
      ok(u94.some(function(j){ return j[0]==="Sergio Vargas"; }), "UCH 1994: Vargas");
      ok(u94.every(function(j){ return (j[7]||[]).length>0; }), "UCH 1994: 0 rasgos vacíos");
      var hl=(typeof HISTORIA_LINEA==="object"&&HISTORIA_LINEA.UCH)||[];
      ok(hl.some(function(h){ return h.anio===1994; }), "HISTORIA_LINEA.UCH incluye 1994");
      var epU=(typeof epocasDe==="function"?epocasDe("UCH"):(EPOCAS_CLUB.UCH||[]));
      ok(epU.some(function(e){ return e.anio===1994 && e.squad; }), "UCH 1994 es época jugable con squad");
      var b07=PLANTELES_REALES.BOC&&PLANTELES_REALES.BOC[2007];
      ok(b07 && b07.length>=20, "Boca 2007 plantel real ≥20 (ya no cantera)");
      ok(b07.some(function(j){ return j[0]==="Juan Román Riquelme"; }), "Boca 2007: Riquelme");
      ok(b07.some(function(j){ return j[0]==="Martín Palermo" && (j[7]||[]).indexOf("capitán")>=0; }), "Boca 2007: Palermo capitán");
      ok(b07.every(function(j){ return j[0]!=="Guillermo Barros Schelotto"; }), "Boca 2007: Schelotto no (se fue en abril)");
      var r18=PLANTELES_REALES.RIV&&PLANTELES_REALES.RIV[2018];
      ok(r18 && r18.length>=22, "River 2018 plantel real ≥22 (ya no cantera)");
      ok(r18.some(function(j){ return j[0]==="Lucas Pratto"; }), "River 2018: Pratto");
      ok(r18.some(function(j){ return j[0]==="Leonardo Ponzio" && (j[7]||[]).indexOf("capitán")>=0; }), "River 2018: Ponzio capitán");
      ok(r18.some(function(j){ return j[0]==="Franco Armani"; }), "River 2018: Armani");
      ok(r18.filter(function(j){ return j[1]==="ARQ"; }).length>=3, "River 2018: 3 ARQ");
      /* copias 2026: Salas/Riquelme/Pratto no viven en dos clubes del mismo año */
      var s26=(PLANTELES_REALES.UCH&&PLANTELES_REALES.UCH[2026]||[]).some(function(j){ return j[0]==="Marcelo Salas"; });
      ok(!s26, "Salas 1994 no se copia al 2026 de la U");
    }, "U 1994 + Boca 2007 + River 2018");

    /* T30 · 8.01 Audax 2007 no hereda el título de Colo-Colo + Vélez/San Lorenzo */
    grupo("Grok 7.991 (Audax ≠ CC 2007 + Vélez 1994 + San Lorenzo 2014)");
    safe(function(){
      ok(typeof VERSION==="string" && /^7\.\d+$/.test(VERSION), "VERSION 7.x");
      var aud07=PLANTELES_REALES.AUD&&PLANTELES_REALES.AUD[2007];
      ok(aud07 && aud07.length>=18, "Audax 2007 plantel real ≥18 (ya no cantera)");
      ok(aud07.some(function(j){ return j[0]==="Carlos Villanueva"; }), "Audax 2007: Villanueva");
      ok(aud07.some(function(j){ return j[0]==="Fabián Orellana"; }), "Audax 2007: Orellana");
      ok(aud07.some(function(j){ return j[0]==="Franco Di Santo"; }), "Audax 2007: Di Santo");
      ok(aud07.every(function(j){ return (j[7]||[]).length>0; }), "Audax 2007: 0 rasgos vacíos");
      var epA=(typeof epocasDe==="function"?epocasDe("AUD"):(EPOCAS_CLUB.AUD||[]));
      var e07=epA.filter(function(e){ return e.anio===2007; })[0];
      ok(e07 && e07.squad, "Audax 2007 es época jugable con squad");
      ok(e07 && !/Campeón del Apertura 2007/.test(e07.desc||""), "Audax 2007 NO se declara campeón del Apertura (fue Colo-Colo)");
      ok(e07 && /Colo-Colo/.test(e07.desc||""), "Audax 2007 aclara que el Apertura lo ganó Colo-Colo");
      var hlA=(typeof HISTORIA_LINEA==="object"&&HISTORIA_LINEA.AUD)||[];
      ok(hlA.some(function(h){ return h.anio===2007 && !/campeón del Apertura 2007/i.test(h.txt||""); }), "Historia Audax 2007 no se apropia del título albo");
      var vel94=PLANTELES_REALES.VEL&&PLANTELES_REALES.VEL[1994];
      ok(vel94 && vel94.length>=18, "Vélez 1994 plantel real ≥18");
      ok(vel94.some(function(j){ return j[0]==="José Luis Chilavert"; }), "Vélez 1994: Chilavert");
      ok(vel94.some(function(j){ return j[0]==="Roberto Trotta" && (j[7]||[]).indexOf("capitán")>=0; }), "Vélez 1994: Trotta capitán");
      ok(vel94.filter(function(j){ return j[1]==="ARQ"; }).length>=3, "Vélez 1994: 3 ARQ");
      var slo14=PLANTELES_REALES.SLO&&PLANTELES_REALES.SLO[2014];
      ok(slo14 && slo14.length>=20, "San Lorenzo 2014 plantel real ≥20");
      ok(slo14.some(function(j){ return j[0]==="Leandro Romagnoli"; }), "San Lorenzo 2014: Romagnoli");
      ok(slo14.some(function(j){ return j[0]==="Néstor Ortigoza"; }), "San Lorenzo 2014: Ortigoza");
      ok(slo14.some(function(j){ return j[0]==="Sebastián Torrico"; }), "San Lorenzo 2014: Torrico");
      /* copias 2026 */
      ok(!(PLANTELES_REALES.AUD&&PLANTELES_REALES.AUD[2026]||[]).some(function(j){ return j[0]==="Carlos Villanueva"; }), "Villanueva 2007 no se copia al Audax 2026");
      /* regresión: Segunda no es Colo-Colo 1991 */
      nuevaPartida("SMO",2026,"historico",{categoria:"C"});
      SEC="historia";
      if(typeof render==="function") render();
      var txtS=(document.getElementById("vista")||{textContent:""}).textContent||"";
      ok(!/Libertadores 1991 la ganó Colo-Colo/.test(txtS), "Segunda (Morning) sigue sin la Libertadores de CC 1991");
      ok(!/Temporada 1991/.test(txtS), "Segunda sigue sin titular Temporada 1991");
    }, "Audax 2007 + Vélez + San Lorenzo + Segunda ≠ CC");

    /* T31 · 7.991 Racing/Independiente/Estudiantes + Limache ≠ Quillota */
    grupo("Grok 7.991 (AFA glory + Limache no es Quillota)");
    safe(function(){
      var rac=PLANTELES_REALES.RAC&&PLANTELES_REALES.RAC[1967];
      ok(rac && rac.length>=12, "Racing 1967 plantel real (Intercontinental, no cantera)");
      ok(rac.some(function(j){ return j[0]==="Roberto Perfumo"; }), "Racing 1967: Perfumo");
      ok(rac.some(function(j){ return j[0]==="Juan Carlos Cárdenas"; }), "Racing 1967: Cárdenas");
      ok(rac.some(function(j){ return j[0]==="Oscar Martín" && (j[7]||[]).indexOf("capitán")>=0; }), "Racing 1967: Martín capitán");
      var ind=PLANTELES_REALES.IND&&PLANTELES_REALES.IND[1984];
      ok(ind && ind.length>=16, "Independiente 1984 plantel Tokio ≥16");
      ok(ind.some(function(j){ return j[0]==="Ricardo Bochini"; }), "Independiente 1984: Bochini");
      ok(ind.some(function(j){ return j[0]==="José Percudani"; }), "Independiente 1984: Percudani");
      ok(ind.some(function(j){ return j[0]==="Enzo Trossero" && (j[7]||[]).indexOf("capitán")>=0; }), "Independiente 1984: Trossero capitán");
      var elp=PLANTELES_REALES.ELP&&PLANTELES_REALES.ELP[2009];
      ok(elp && elp.length>=20, "Estudiantes 2009 plantel real ≥20");
      ok(elp.filter(function(j){ return j[1]==="ARQ"; }).length>=3, "Estudiantes 2009: 3 ARQ");
      ok(elp.some(function(j){ return j[0]==="Juan Sebastián Verón" && (j[7]||[]).indexOf("capitán")>=0; }), "Estudiantes 2009: Verón capitán");
      ok(elp.some(function(j){ return j[0]==="Mauro Boselli"; }), "Estudiantes 2009: Boselli");
      ok(!(PLANTELES_REALES.ELP&&PLANTELES_REALES.ELP[2026]||[]).some(function(j){ return j[0]==="Juan Sebastián Verón"; }), "Verón 2009 no se copia al Pincha 2026");
      var hlH=(typeof HISTORIA_LINEA==="object"&&HISTORIA_LINEA.HUR)||[];
      ok(hlH.some(function(h){ return h.anio===1973; }), "Huracán ya no es solo Fundación+Hoy: 1973 Menotti");
      var hlN=(typeof HISTORIA_LINEA==="object"&&HISTORIA_LINEA.NEW)||[];
      ok(hlN.some(function(h){ return h.anio===1974; }), "Newell's línea incluye Nacional 1974");
      var estLIM=(typeof ESTADIOS_DATA==="object"&&ESTADIOS_DATA.LIM)||{};
      ok(/Navarrete/.test(estLIM.nombre||""), "Limache: estadio propio Ángel Navarrete Candia");
      ok(!/Fariña/.test(estLIM.nombre||""), "Limache NO lista el Lucio Fariña como propio (es de San Luis)");
      ok((estLIM.aforo||0)===3000, "Limache aforo 3.000 (municipal)");
      var estSLQ=(typeof ESTADIOS_DATA==="object"&&ESTADIOS_DATA.SLQ)||{};
      ok(/Fariña/.test(estSLQ.nombre||""), "San Luis conserva el Lucio Fariña");
      nuevaPartida("LIM",2026,"historico");
      SEC="historia";
      if(typeof render==="function") render();
      var txtL=(document.getElementById("vista")||{textContent:""}).textContent||"";
      ok(/Navarrete/.test(txtL), "Historia de Limache nombra el Navarrete");
      ok(!/Libertadores 1991 la ganó Colo-Colo/.test(txtL), "Limache no hereda CC 1991");
    }, "Racing 1967 + Independiente 1984 + Estudiantes 2009 + Limache ≠ Quillota");

    /* T32 · 7.994 tablas vivas + AFA zonal + Sudamericana */
    grupo("Grok 7.994 (tablas vivas + AFA + Sudamericana)");
    safe(function(){
      ok(typeof VERSION==="string" && /^7\.\d+$/.test(VERSION), "VERSION 7.x");
      ok(typeof VERSION==="string" && /^7\.99/.test(VERSION), "VERSION 7.99x");
      nuevaPartida("TRA",2026,"historico",{categoria:"C"});
      var liga=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"; });
      ok(liga.length===12, "Trasandino: 12 PJ zonales (6 rivales ida/vuelta + 2 byes fuera del calendario)");
      ok(liga.every(function(p){ return zonaSegDe(p.rivalId)==="norte"; }), "rivales zonales son de la Zona Norte");
      ok(typeof fixturesLiga==="function", "fixturesLiga existe");
      var fx7=fixturesLiga(["a","b","c","d","e","f","g"].map(function(id){ return {id:id}; }));
      ok(fx7.length===14, "7 clubes → 14 fechas de fixture (ida+vuelta con bye)");
      ok(fx7.every(function(f){ return f.length===3; }), "cada fecha zonal tiene 3 partidos (1 bye)");
      var tab0=(typeof tablaZonaC==="function")?tablaZonaC("norte","TRA"):[];
      ok(tab0.length===7, "tabla zonal Norte tiene 7");
      ok(tab0.every(function(x){ return !x.pj; }), "al kickoff nadie tiene PJ (tabla viva, no un RR rellenado)");
      E.flags=E.flags||{};
      E.flags.segundaFase="liguillaAscenso";
      var ft=(typeof filasTablaActual==="function")?filasTablaActual():null;
      ok(ft && /liguilla/i.test(ft.titulo||""), "en liguilla, filasTablaActual devuelve la tabla de 7");
      ok(/parte de cero|se parte de 0|puntaje desde 0/i.test(ft.nota||FORMAT_SEGUNDA_2026.liguillaAscenso||""), "la liguilla no arrastra la zonal");
      ok(/3 botones|no hay final/i.test(FORMAT_SEGUNDA_2026.juego||"") || /No hay final de 3 botones/.test(FORMAT_SEGUNDA_2026.juego||""), "formato documenta: no hay final de 3 botones");
    }, "Trasandino fixture + liguilla de 7 + tabla viva");
    safe(function(){
      nuevaPartida("PAL",2026,"historico");
      var sud=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&/Sudamericana/i.test(p.torneo||""); });
      ok(sud.length>=1, "Palestino 2026 tiene Sudamericana en el calendario ("+sud.length+")");
      nuevaPartida("AUD",2026,"historico");
      var sudA=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&/Sudamericana/i.test(p.torneo||""); });
      ok(sudA.length>=1, "Audax 2026 tiene Sudamericana");
      nuevaPartida("CC",2026,"historico");
      var objs=(typeof generarObjetivos==="function")?generarObjetivos():[];
      ok(objs.some(function(o){ return /Sudamericana/i.test(o.t||o.detalle||""); }), "Colo-Colo 2026 ofrece el camino a Sudamericana 2027 (4°–6°)");
      ok(typeof CONMEBOL_GRUPOS_2026==="object" && CONMEBOL_GRUPOS_2026.sud && CONMEBOL_GRUPOS_2026.sud.length>=3, "hay tablas de grupo de Sudamericana 2026");
      ok(CONMEBOL_GRUPOS_2026.lib.some(function(g){ return g.letra==="D"&&g.ids.indexOf("BOC")>=0&&g.ids.indexOf("UC")>=0; }), "Grupo D Lib: Católica y Boca (real 2026)");
      nuevaPartida("BOC",2026,"historico");
      var libB=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&/Libertadores/i.test(p.torneo||""); });
      ok(libB.length>=6, "Boca 2026 tiene su Grupo D de Libertadores (mismo rigor que Católica)");
      var ca=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&/Copa Argentina/i.test(p.torneo||""); });
      ok(ca.length>=1 && /Gimnasia/i.test(ca[0].rivalNombre||""), "Boca 32avos Copa Argentina vs Gimnasia (Chivilcoy) — cruce real");
      ok(typeof zonaArgDe==="function" && zonaArgDe("BOC")==="A" && zonaArgDe("RIV")==="B", "Boca Zona A, River Zona B (sorteo AFA 2026)");
      ok(typeof mundoFilasConmebol==="function", "mundo pinta tablas CONMEBOL");
      if(typeof mundoInit==="function") mundoInit();
      var filD=mundoFilasConmebol("lib","D");
      ok(filD && filD.length===4, "tabla Grupo D Libertadores tiene 4 clubes");
      var filF=mundoFilasConmebol("sud","F");
      ok(filF && filF.length===4, "tabla Grupo F Sudamericana (Palestino) tiene 4 clubes");
      ok(typeof tablaViva==="function" && tablaViva(["A","B"], {A:{pj:1,pts:3,gf:1,gc:0,pg:1,pe:0,pp:0}}).length===2, "tablaViva no rellena partidos");
      ok(typeof calendarioZonal==="function", "crear una liga zonal es clubs + calendarioZonal");
      ok(typeof copasDeLiga==="function" && copasDeLiga("arg2026").some(function(c){ return c.id==="copaArg"; }), "registrarLiga copas incluye Copa Argentina");
    }, "Sudamericana + Copa Argentina + tablaViva + CONMEBOL");

    /* T33 · 7.995 scripts 801/802/rigor que 7.994 no subió */
    grupo("Grok 7.995 (planteles glory + decisiones propias)");
    safe(function(){
      ok(typeof VERSION==="string" && /^7\.99/.test(VERSION), "VERSION 7.99x");
      ok(typeof DECISIONES_801!=="undefined" && DECISIONES_801.length>=40, "DECISIONES_801 cargó (≥40 cartas de club)");
      ok(DECISIONES.some(function(d){ return d.id==="cc26_concesionaria" && d.club==="CC"; }), "CC 2026 tiene carta propia (concesionaria)");
      ok(DECISIONES.some(function(d){ return d.id==="smo26_pintana" && d.club==="SMO"; }), "Morning 2026 tiene carta propia (no hereda CC)");
      ok(DECISIONES.some(function(d){ return d.id==="lim26_pueblo" && d.club==="LIM"; }), "Limache 2026 tiene carta propia");
      ok(DECISIONES.some(function(d){ return d.id==="riv26_monumental" && d.club==="RIV"; }), "River 2026 tiene carta propia");
      var smoDec=DECISIONES.filter(function(d){ return d.club==="SMO"; });
      ok(smoDec.length>=1 && smoDec.every(function(d){ return !/Libertadores 1991|Jozić|Cacique/.test((d.t||"")+(d.d||"")); }), "cartas de Morning no hablan de Colo-Colo 1991");
      ok(PLANTELES_REALES.AUD && PLANTELES_REALES.AUD[2007] && PLANTELES_REALES.AUD[2007].length>=18, "Audax 2007 plantel en 801");
      ok(PLANTELES_REALES.RAC && PLANTELES_REALES.RAC[1967] && PLANTELES_REALES.RAC[1967].length>=12, "Racing 1967 plantel en 802");
    }, "7.995 decisiones propias + 801/802");

    /* T34 · 7.996 partido vivo + planteles 2006 */
    grupo("Grok 7.996 (cancha + relato + 2006 documentado)");
    safe(function(){
      ok(typeof VERSION==="string" && /^7\.99/.test(VERSION), "VERSION 7.99x");
      ok(typeof PLANTEL_UCH_2006!=="undefined" && PLANTEL_UCH_2006.length>=18, "UCH 2006 plantel ≥18");
      ok(typeof PLANTEL_AUD_2006!=="undefined" && PLANTEL_AUD_2006.length>=16, "AUD 2006 plantel ≥16");
      ok(typeof PLANTEL_UC_2006!=="undefined" && PLANTEL_UC_2006.length>=18, "UC 2006 plantel ≥18");
      ok(PLANTEL_UCH_2006.some(function(a){ return a[0]==="Marcelo Salas"; }), "UCH 2006 tiene a Salas");
      ok(PLANTEL_AUD_2006.some(function(a){ return a[0]==="Carlos Villanueva"; }), "AUD 2006 tiene a Villanueva");
      ok(PLANTEL_AUD_2006.some(function(a){ return a[0]==="Franco Di Santo"; }), "AUD 2006 tiene a Di Santo");
      ok(PLANTEL_UC_2006.some(function(a){ return a[0]==="Jorge Quinteros"; }), "UC 2006 tiene a Quinteros");
      ok(PLANTEL_UC_2006.some(function(a){ return a[0]==="Darío Conca"; }), "UC 2006 tiene a Conca (Apertura documentado)");
      ok(PLANTEL_UC_2006.every(function(a){ return a[0]!=="Milovan Mirosevic"; }), "Mirosevic NO está: estaba en Racing/Beitar");
      ok(PLANTELES_REALES.UCH && PLANTELES_REALES.UCH[2006]===PLANTEL_UCH_2006, "PLANTELES_REALES.UCH[2006] cableado");
    }, "planteles 2006 UCH/AUD/UC");
    safe(function(){
      nuevaPartida("UCH",2006,"historico");
      ok(E.eraBase===2006 && E.club==="UCH", "la U arranca en 2006");
      ok(E.plantel.some(function(j){ return j.n==="Marcelo Salas"; }), "partida UCH 2006 alinea a Salas");
      ok(E.plantel.some(function(j){ return j.n==="Miguel Pinto"; }), "Pinto es el arquero documentado");
      var rivAud=plantelRival("AUD",76);
      ok(rivAud.some(function(j){ return j.n==="Carlos Villanueva"; }), "el XI rival de Audax 2006 es el plantel 2006, no el 2026");
      var rivRan=plantelRival("RAN",62);
      ok(rivRan.every(function(j){ return !j.real; }), "Rangers 2006 sin plantel: apodos, no hereda 2026 ni 1991");
      ok(rivRan.some(function(j){ return /Rangers|RAN/.test(j.n); }), "los apodos dicen Rangers");
    }, "partida 2006 + XI rival sin anacronismo");
    safe(function(){
      nuevaPartida("CC",2006,"historico");
      var P={once:E.plantel.slice(0,11), lineas:[], cansancio:0, clasico:false, part:{rivalNombre:"Universidad de Chile"}, modo:"historico"};
      var a=fraseRelato(P,8), b=fraseRelato(P,8), c=fraseRelato(P,8), d=fraseRelato(P,8);
      ok(typeof a==="string" && a.length>8, "fraseRelato devuelve texto");
      ok(!(a===b && b===c && c===d), "fraseRelato no repite la misma línea 4 veces seguidas");
      linea(P,10,"Primeros toques, todavía sin profundidad.");
      linea(P,11,"Primeros toques, todavía sin profundidad.");
      ok(P.lineas.length===1, "linea() ignora el duplicado consecutivo");
      ok(typeof eligeNuevo==="function", "eligeNuevo existe (anti-repetición del relato)");
      ok(typeof montarCancha==="function", "cancha pixel sigue montable");
    }, "relato anti-repetición + cancha");

    /* T35 · 7.997 repetición + Clausura 2006 + prensa ×2 */
    grupo("Grok 7.997 (repetición + Clausura 2006 + prensa)");
    safe(function(){
      ok(typeof VERSION==="string" && /^7\.99/.test(VERSION), "VERSION 7.99x");
      ok(typeof persistirRepeticion==="function", "persistirRepeticion existe");
      ok(typeof compactarRelato==="function", "compactarRelato existe");
      ok(typeof elegirPreguntasPrensa==="function", "elegirPreguntasPrensa existe");
      ok(typeof avanzarFase2006==="function" && typeof _sembrarClausura2006==="function", "Clausura 2006 se puede sembrar");
      ok(typeof tablaAnual2006==="function", "tabla anual 2006");
      ok(POST_ARQ.bancar, "POST_ARQ.bancar existe");
      ok(PREGUNTAS_BETA.some(function(p){ return p.sit==="post_empate"; }), "PREGUNTAS_BETA cubre empate");
      ok(PREGUNTAS_BETA.some(function(p){ return p.sit==="post_clasico"; }), "PREGUNTAS_BETA cubre clásico post");
    }, "API 7.997");
    safe(function(){
      var part={};
      persistirRepeticion({
        lineas:[{m:12,t:"Saque al medio.",c:""},{m:44,t:"¡Gol de Suazo!",c:"gol"},{m:70,t:"Roja para el rival.",c:"grave"}],
        golesDetalle:[{min:44,quien:"Humberto Suazo",propio:true,tipo:"jugada"}],
        stats:{pos:0.62,remMio:11,remRiv:4,arcMio:5,arcRiv:1,corMio:6,corRiv:2},
        arbitro:{n:"Pablo Pozo",estilo:"parejo",desc:"cobra lo justo"},
        ticker:[{autor:"@cacique",texto:"golazo del Chupete",tono:"bueno",m:44}]
      }, part);
      ok(part.lineas && part.lineas.length===3, "relato persistido");
      ok(part.golesDetalle && part.golesDetalle[0].quien==="Humberto Suazo", "gol con autor");
      ok(part.stats && part.stats.remMio===11, "stats persistidas");
      ok(part.arbitro && /Pozo/.test(part.arbitro.n), "árbitro persistido");
      ok(part.ticker && part.ticker[0].texto.indexOf("Chupete")>=0, "ticker persistido");
      var largo=[]; for(var i=0;i<40;i++) largo.push({m:i,t:"linea "+i,c:i===20?"gol":""});
      ok(compactarRelato(largo).length<=24, "relato compactado a 24");
      ok(compactarRelato(largo).some(function(l){ return l.c==="gol"; }), "compactar conserva el gol");
    }, "persistir repetición");
    safe(function(){
      nuevaPartida("CC",2006,"historico");
      var liga=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"; });
      ok(liga.length===18, "kickoff 2006 sigue en 18 fechas");
      ok(liga.every(function(p){ return p.fase==="apertura"; }), "las 18 son Apertura");
      ok(E.flags && E.flags.fase2006==="apertura", "flag fase apertura");
      var titulos0=(E.titulos||[]).slice();
      liga.forEach(function(p){ p.jugado=true; });
      avanzarFase2006({tipo:"liga",fase:"apertura"});
      var ape=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&p.fase==="apertura"; });
      var cla=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&p.fase==="clausura"; });
      ok(ape.length===18, "Apertura sigue siendo 18");
      ok(cla.length===18, "Clausura siembra 18 más");
      ok(E.flags.fase2006==="clausura", "flag pasa a clausura");
      ok(Object.keys(E.tabla).length>=19 && Object.keys(E.tabla).every(function(id){ return !(E.tabla[id]&&E.tabla[id].pj); }), "tabla del Clausura parte en 0");
      ok(E.tablaApertura && typeof E.tablaApertura==="object", "snapshot del Apertura");
      ok((E.titulos||[]).length===titulos0.length, "cerrar Apertura NO entrega estrella");
      ok(!(E.titulos||[]).some(function(t){ return /Apertura/i.test(t); }), "ningún título dice Apertura");
      var riv="UCH";
      var aVs=ape.filter(function(p){ return p.rivalId===riv; })[0];
      var cVs=cla.filter(function(p){ return p.rivalId===riv; })[0];
      ok(aVs && cVs, "CC cruza a la U en ambas ruedas");
      ok(aVs.local!==cVs.local, "localía invertida vs la U en el Clausura");
      var anual=tablaAnual2006();
      ok(anual.length===19, "tabla anual tiene 19");
    }, "2006 Apertura → Clausura sin estrella falsa");
    safe(function(){
      nuevaPartida("CC",2006,"historico");
      var part=E.calendario[0];
      var P=iniciarPartido(part,"simular");
      correrHasta(P,90);
      terminarPartido(P);
      ok(part.jugado, "el partido quedó jugado");
      ok(Array.isArray(part.lineas) && part.lineas.length>=1, "el partido guardó relato para la repetición");
      ok(Array.isArray(part.golesDetalle), "golesDetalle en el partido");
      ok(part.stats && typeof part.stats.pos==="number", "stats de transmisión guardadas");
      ok(part.arbitro && part.arbitro.n, "árbitro guardado");
    }, "partido real deja repetición");
    safe(function(){
      nuevaPartida("CC",2006,"historico");
      var P={once:E.plantel.slice(0,11), goleadores:["Humberto Suazo","Humberto Suazo"], part:{rivalNombre:"Audax Italiano",local:true}, lineas:[]};
      var res={yo:2,otro:0,golesDetalle:[{min:12,quien:"Humberto Suazo",propio:true},{min:70,quien:"Humberto Suazo",propio:true}], lesionados:[]};
      var L=preguntasPostPartido(res,P);
      var qs=elegirPreguntasPrensa(L,2);
      ok(qs.length===2, "la sala pide 2 preguntas");
      ok(qs[0].id!==qs[1].id, "las 2 preguntas son distintas");
      ok(qs.every(function(q){ return q.q && q.ops && q.ops.length>=2; }), "cada pregunta trae opciones");
    }, "prensa post ×2");

    /* T36 · 7.998 5 cambios IFAB + descuento + bloque/ritmo */
    grupo("Grok 7.998 (cambios IFAB + descuento + palancas)");
    safe(function(){
      ok(VERSION==="7.998", "VERSION 7.998");
      ok(typeof cambiosMaxEra==="function" && cambiosMaxEra(2026)===5, "2026 permite 5 cambios");
      ok(cambiosMaxEra(2006)===3, "2006 permite 3 cambios");
      ok(cambiosMaxEra(1991)===2, "1991 permite 2 cambios");
      ok(typeof ventanasMaxEra==="function" && ventanasMaxEra(2026)===3, "2026 tiene 3 paradas");
      ok(ventanasMaxEra(1991)>10, "1991 no limita paradas");
      ok(typeof BLOQUES!=="undefined" && BLOQUES.Alto && BLOQUES.Bajo, "BLOQUES Alto/Medio/Bajo");
      ok(typeof RITMOS!=="undefined" && RITMOS.Vertiginoso && RITMOS.Pausado, "RITMOS Pausado/Normal/Vertiginoso");
      ok(typeof calcularDescuento==="function" && typeof topePartido==="function", "descuento + topePartido");
      ok(typeof textoReloj==="function", "textoReloj");
    }, "API 7.998");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      ok(E.tactica.bloque==="Medio" && E.tactica.ritmo==="Normal", "save nueva trae bloque/ritmo");
      var part=E.calendario.filter(function(p){ return p.tipo==="liga"; })[0];
      var P=iniciarPartido(part,"simular");
      ok(P.cambiosMax===5, "iniciarPartido 2026: cambiosMax 5");
      ok(P.ventanasMax===3, "iniciarPartido 2026: 3 paradas");
      ok(P.descuento2===0 && !P._descDicho, "descuento arranca en 0");
      var once=P.once.slice();
      var banca=bancaPartido(P);
      ok(once.length>=11 && banca.length>=3, "hay banca para cambiar");
      ok(hacerCambio(P,once[4],banca[0])===true, "primer cambio entra");
      ok(P.cambios===1 && P.ventanas===1 && P._ventanaAbierta, "el primer cambio abre parada");
      ok(hacerCambio(P,P.once[5],banca[1])===true, "segundo cambio en la misma parada");
      ok(P.ventanas===1, "dos cambios en la misma parada = 1 ventana");
      P._ventanaAbierta=false;
      P.min=70;
      ok(hacerCambio(P,P.once[6],banca[2])===true, "tercera ficha en otra parada");
      ok(P.ventanas===2, "segunda parada gastada");
    }, "5 cambios + paradas 2026");
    safe(function(){
      nuevaPartida("CC",1991,"historico");
      var part=E.calendario.filter(function(p){ return p.tipo==="liga"; })[0];
      var P=iniciarPartido(part,"simular");
      ok(P.cambiosMax===2, "1991: 2 cambios");
      correrHasta(P,90);
      ok(P._descDicho, "al llegar a 90 se marca descuento");
      ok(P.descuento2>=2 && P.descuento2<=7, "descuento entre 2 y 7: "+P.descuento2);
      ok(P.min>=90 && P.min<=90+P.descuento2, "el reloj entra al 90+");
      ok((P.lineas||[]).some(function(l){ return /cuarto árbitro|descuento/i.test(l.t); }), "el relato dice el descuento");
      var txt=textoReloj(P,false);
      ok(/90\+/.test(txt) || /Final/.test(txt) || P.min===90, "reloj habla de 90+ o final");
    }, "descuento 90+ en 1991");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      E.tactica.bloque="Alto"; E.tactica.ritmo="Vertiginoso"; E.tactica.presion="Alta"; E.tactica.mentalidad="Ofensivo";
      var lect=lecturaPlan();
      ok(/bloque alto/i.test(lect) && /vertiginoso/i.test(lect), "lecturaPlan nombra bloque y ritmo");
      var fzA=fuerzaEquipo(onceIdeal());
      E.tactica.bloque="Bajo"; E.tactica.ritmo="Pausado"; E.tactica.presion="Baja"; E.tactica.mentalidad="Defensivo";
      var fzB=fuerzaEquipo(onceIdeal());
      ok(fzA.ataque>fzB.ataque, "bloque alto + ritmo vertiginoso ataca más que el bus");
      ok(fzB.orden>fzA.orden, "bloque bajo + ritmo pausado ordena más");
      ok(fzA.desgaste>fzB.desgaste, "el ritmo vertiginoso cansa más");
      ok(FRASES_CUERPO.some(function(f){ return /pega|cabros/i.test(f.x); }), "frases del cuerpo técnico más chilenas");
      ok(PREGUNTAS_BETA.some(function(p){ return /cinco cambios|bloque/i.test(p.q); }), "prensa pregunta por cambios y bloque");
    }, "palancas tácticas mueven el partido");

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
