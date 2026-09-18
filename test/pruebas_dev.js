"use strict";
/* ============================================================
   FUTBOLINI · test/pruebas_dev.js — pruebas del MOTOR DE EDICIÓN
   Aparte de pruebas_core.js a propósito: así Grok y Claude no se pisan
   el mismo archivo de tests. Se corre con: bash test/correr_dev.sh
   ============================================================ */
(function(){
  var OUT=[], OK=0, BAD=0;
  function t(cond,n){ if(cond){OK++;OUT.push("  ✅ "+n);} else {BAD++;OUT.push("  ❌ "+n);} }
  function grupo(n){ OUT.push("\n▸ "+n); }
  function safe(fn,n){ try{ fn(); }catch(e){ BAD++; OUT.push("  ❌ "+n+" — EXCEPCIÓN: "+e.message); } }

  function correr(){
    grupo("Esquema de rigor");
    safe(function(){
      t(typeof ESQUEMA_CLUB!=="undefined" && ESQUEMA_CLUB.length>=15, "ESQUEMA_CLUB tiene los campos ("+(ESQUEMA_CLUB||[]).length+")");
      t(typeof ESQUEMA_LIGA!=="undefined" && ESQUEMA_LIGA.length>=4, "ESQUEMA_LIGA definido");
      var conSet=ESQUEMA_CLUB.filter(function(c){ return typeof c.set==="function"; }).length;
      t(conSet>=14, "la mayoría de campos son editables ("+conSet+")");
      t(ESQUEMA_CLUB.some(function(c){ return c.k==="decisiones"; }), "mide la DECISIÓN PROPIA del club (vara de data-rigor-801)");
      ESQUEMA_CLUB.forEach(function(c){
        if(typeof c.get!=="function") t(false,"campo "+c.k+" sin get");
      });
      t(true,"todos los campos tienen lector");
    },"Esquema");

    grupo("Auditor calibrado contra la vara");
    safe(function(){
      t(typeof auditarClub==="function","auditarClub existe");
      ["CC","UCH","UC"].forEach(function(id){
        t(auditarClub(id).pct===100, id+" (referencia) marca 100% — da "+auditarClub(id).pct+"%");
      });
      var l=auditarLiga("2026");
      t(l && l.clubes>=16, "auditarLiga lee Primera ("+(l&&l.clubes)+" clubes)");
      t(l.pct>=90, "Primera 2026 va sobre 90% de rigor ("+l.pct+"%)");
      /* los clubes que solo son RIVALES no arrastran el promedio */
      var l91=auditarLiga("1991");
      t(l91.soloRival && l91.soloRival.length>0, "1991 separa los clubes solo-rival ("+(l91.soloRival||[]).join(",")+")");
      t(l91.pct===100, "1991 marca 100% contando solo los dirigibles ("+l91.pct+"%)");
      t(typeof devEsJugable==="function" && devEsJugable("CC") && !devEsJugable("FV"),
        "devEsJugable distingue dirigible (CC) de solo-rival (FV)");
      t(devDecisionesDe("CC").length>0, "Colo-Colo tiene decisiones propias ("+devDecisionesDe("CC").length+")");
      t(auditarTodo().length>=5, "auditarTodo recorre todas las ligas");
      t(typeof devInforme==="function" && devInforme().indexOf("RIGOR")>=0, "devInforme arma el informe");
    },"Auditor");

    grupo("Ausencia justificada (no se inventa nada)");
    safe(function(){
      t(typeof DEV_SIN_DATO==="object","DEV_SIN_DATO existe");
      var sci=auditarClub("SCI");
      t(sci.justificados.length>0,"SCI declara su dato faltante como justificado");
      t(sci.pct===100,"un dato sin fuente NO castiga el rigor ("+sci.pct+"%)");
    },"Justificados");

    grupo("Edición en vivo (el motor)");
    safe(function(){
      t(typeof aplicarParcheClubes==="function","aplicarParcheClubes existe");
      /* Con TODO al 100% ya no hay club incompleto: demostramos el mecanismo
         bajando un campo (el rigor cae), y volviéndolo a poner (sube). */
      var dtPrevio=(CLUB_INFO_2026.DYJ||{}).dt;
      var lleno=auditarClub("DYJ").pct;
      CLUB_INFO_2026.DYJ.dt="el cuerpo técnico";        /* "vaciar" el DT */
      var bajo=auditarClub("DYJ").pct;
      t(bajo<lleno,"al vaciar el DT el rigor CAE ("+lleno+"% → "+bajo+"%)");
      aplicarParcheClubes({DYJ:{dt:"DT de prueba"}});
      t(CLUB_INFO_2026.DYJ.dt==="DT de prueba","editar el DT escribe en CLUB_INFO_2026");
      t(auditarClub("DYJ").pct>bajo,"el rigor SUBE al completar ("+bajo+"% → "+auditarClub("DYJ").pct+"%)");
      aplicarParcheClubes({DYJ:{clasico:["LAN"]}});
      t(devRivalesDe("DYJ").indexOf("LAN")>=0,"se puede definir el clásico");
      /* dejar como estaba para no ensuciar otras pruebas */
      if(dtPrevio) CLUB_INFO_2026.DYJ.dt=dtPrevio; else delete CLUB_INFO_2026.DYJ.dt;
      devPonerRivales("DYJ",[]);
    },"Edición");

    grupo("Panel del editor");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      DEV_ON=true; if(!E.flags)E.flags={}; E.flags.dev=true;
      SEC="ajustes"; render();
      t(!!document.querySelector(".dev-editor-acceso"),"con dev ON, Ajustes ofrece el editor");
      DEV_ON=false; E.flags.dev=false;
      SEC="ajustes"; render();
      t(!document.querySelector(".dev-editor-acceso"),"con dev OFF, el editor NO aparece");
      DEV_ON=true; E.flags.dev=true;
      t(typeof abrirEditorContenido==="function","abrirEditorContenido expuesto");
      abrirEditorContenido();
      var m=document.querySelector(".modal.dev-editor");
      t(!!m,"el editor abre");
      var txt=m?(m.textContent||""):"";
      t(txt.indexOf("Rigor")>=0 && txt.indexOf("Exportar")>=0,"tiene las pestañas Rigor y Exportar");
      t(txt.indexOf("Nuevo")>=0,"tiene la pestaña Nuevo (PEGAR)");
      cerrarModal();
    },"Panel");

    grupo("PEGAR club (crear / mejorar)");
    safe(function(){
      t(typeof parsearPegarClub==="function" && typeof crearClubDesdePegar==="function","motor PEGAR");
      var p=parsearPegarClub("ID: ZZZ\nnombre: Club Zeta\nciudad: Talca\nliga: 2026");
      t(p.id==="ZZZ" && p.nombre==="Club Zeta" && p.liga==="2026","parsea ID/nombre/liga");
      var r=crearClubDesdePegar("ID: ZZZ\nnombre: Club <b>Zeta</b>\nciudad: Talca\nliga: 2026");
      t(r.ok && r.id==="ZZZ","crea el club");
      t(CLUB_INFO_2026.ZZZ && CLUB_INFO_2026.ZZZ.n==="Club Zeta","HTML recortado, nombre vivo");
      t(CLUB_INFO.ZZZ && CLUB_INFO.ZZZ.n==="Club Zeta","espejo 1991");
      t(LIGAS[2026].some(function(c){return c.id==="ZZZ";}),"aparece en la liga");
      try{
        delete CLUB_INFO_2026.ZZZ; delete CLUB_INFO.ZZZ;
        if(CLUB_META) delete CLUB_META.ZZZ;
        if(LIGAS[2026]){
          for(var i=LIGAS[2026].length-1;i>=0;i--) if(LIGAS[2026][i]&&LIGAS[2026][i].id==="ZZZ") LIGAS[2026].splice(i,1);
        }
      }catch(e){}
    },"PEGAR");

    grupo("Liga nueva: generador de scaffold (Claude)");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      DEV_ON=true; if(!E.flags)E.flags={}; E.flags.dev=true;
      abrirEditorContenido();
      var tabs=document.querySelectorAll(".dev-tabs .ficha");
      t(tabs.length===6, "el editor tiene 6 pestañas (Rigor/Club/Nuevo/Liga/Alma/Exportar)");
      tabs[3].click(); // Liga
      var m=document.querySelector(".modal.dev-editor");
      t(!!m && !!m.querySelector(".dev-liga-nueva"), "la pestaña Liga ofrece 'Liga nueva — generar .js'");
      var byPh=function(ph){ return [].slice.call(m.querySelectorAll("input,select,textarea")).filter(function(x){return (x.placeholder||"").indexOf(ph)>=0;})[0]; };
      byPh("Superliga").value="Superliga Danesa"; byPh("din2026").value="din2026"; byPh("dinamarca").value="dinamarca";
      byPh("FCK").value="FCK | FC Kobenhavn | Copenhague | 78 | 38000 | Parken\nBIF | Brondby | Brondby | 72 | 28000 | Brondby Stadion";
      [].slice.call(m.querySelectorAll("button")).filter(function(b){return b.textContent.indexOf("Generar")>=0;})[0].click();
      var js=([].slice.call(m.querySelectorAll("textarea")).filter(function(x){return x.readOnly && x.value.indexOf("registrarLiga")>=0;})[0]||{}).value||"";
      t(js.indexOf("registrarLiga(")>=0 && (js.match(/id:"/g)||[]).length===2, "genera un .js con registrarLiga y 2 clubes");
      var okSyntax=true, cfg=null;
      try{ (new Function("registrarLiga", js))(function(c){ cfg=c; }); }catch(e){ okSyntax=false; }
      t(okSyntax, "el .js generado es sintácticamente válido");
      t(cfg && cfg.eraKey==="din2026" && cfg.clubs.length===2 && cfg.era && cfg.era.pais==="dinamarca", "el scaffold registra eraKey/clubes/país bien");
      t(cfg && cfg.clubs[0].fuerza===78, "la fuerza se parsea (deriva indicadores en el motor)");
      // XSS: etiqueta en un nombre de club NO llega al .js
      byPh("FCK").value="EVL | <img src=x onerror=alert(1)>Mal | Ciudad | 60 | 100 | Est";
      [].slice.call(m.querySelectorAll("button")).filter(function(b){return b.textContent.indexOf("Generar")>=0;})[0].click();
      var js2=([].slice.call(m.querySelectorAll("textarea")).filter(function(x){return x.readOnly;})[0]||{}).value||"";
      t(js2.indexOf("onerror")<0, "el generador recorta HTML de los nombres (anti-XSS)");
      cerrarModal();
    }, "Liga nueva");

    grupo("Cobertura de contenido / Alma por club (Claude)");
    safe(function(){
      t(typeof auditarContenido==="function" && typeof devInformeCobertura==="function", "analizador de cobertura disponible");
      var cc=auditarContenido("CC");
      t(cc.decisiones>=6 && cc.nivel==="rico", "Colo-Colo es 'rico' en alma ("+cc.decisiones+" decisiones)");
      var inf=devInformeCobertura();
      t(inf.total>=40, "recorre todos los clubes dirigibles ("+inf.total+")");
      t(inf.pobres.length>0, "detecta clubes 'pobres' de contenido ("+inf.pobres.length+")");
      t(inf.ricos.length<inf.total, "el analizador distingue niveles (no todos ricos)");
    }, "Cobertura");

    grupo("Generador de decisiones propias / dar alma (Claude)");
    safe(function(){
      t(typeof crearDecisionDesde==="function" && typeof parsearPegarDecision==="function", "generador de decisiones disponible");
      var antes=auditarContenido("LAN").decisiones;
      var r=crearDecisionDesde("club: LAN\nanio: 2026\nbuzon: hinchada\ntitulo: Prueba de alma\ncontexto: Contexto de prueba.\nop: Bancar | +tecnico -hinchada\nop: Cambiar | +hinchada -plata:120");
      t(r.ok===true, "crea una decisión propia bien formada");
      t(auditarContenido("LAN").decisiones===antes+1, "el club sube su alma (+1 decisión, "+antes+"→"+auditarContenido("LAN").decisiones+")");
      var d=DECISIONES.filter(function(x){return x.id===r.id;})[0];
      t(d && d.club==="LAN" && d.anio===2026 && d.op.length===2 && !!d.op[0].bien, "la carta tiene la forma del motor (club/año/op/bien)");
      t(d.op[1].grupos && d.op[1].grupos.hinchada===6 && d.op[1].bien.ef.plata===-120, "parsea los efectos (+hinchada, -plata:120)");
      t(!crearDecisionDesde("club: XX\ntitulo: incompleta").ok, "rechaza una decisión sin opciones");
      var js=devExportarDecisiones("LAN");
      t(js.indexOf("DECISIONES.push")>=0, "exporta las decisiones creadas a un .js");
      var okS=true; try{ new Function(js); }catch(e){ okS=false; }
      t(okS, "el .js de decisiones exportado es válido");
      // limpiar para no ensuciar otras pruebas
      for(var z=DECISIONES.length-1;z>=0;z--){ if(/^dev_lan_/.test(DECISIONES[z].id||"")) DECISIONES.splice(z,1); }
    }, "Decisiones alma");

    grupo("Clonar liga a RIGOR COLO-COLO (Claude)");
    safe(function(){
      t(typeof devClonarLigaRigor==="function", "motor de clonado a rigor disponible");
      var clubs=[
        {id:"FCK",n:"FC Kobenhavn",c:"Kobenhavn",fuerza:80,aforo:38000,est:"Parken",ciudad:"Copenhague"},
        {id:"BIF",n:"Brondby",c:"Brondby",fuerza:74,aforo:28000,est:"Brondby Stadion",ciudad:"Brondby"},
        {id:"FCM",n:"Midtjylland",c:"Herning",fuerza:76,aforo:12000,est:"MCH Arena",ciudad:"Herning"},
        {id:"AGF",n:"AGF Aarhus",c:"Aarhus",fuerza:68,aforo:20000,est:"Ceres Park",ciudad:"Aarhus"}
      ];
      var r=devClonarLigaRigor(clubs,{eraKey:"tst_din", baseEra:"2026", nombre:"Superliga TST", pais:"dinamarca", pts:3});
      t(r&&r.ok, "clona sin romper");
      t(auditarLiga("tst_din").pct===100, "la liga clonada queda con rigor de Primera (100%) — da "+auditarLiga("tst_din").pct+"%");
      var cada=clubs.map(function(c){ return auditarClub(c.id).pct; });
      t(cada.every(function(p){return p===100;}), "CADA club queda a rigor Colo-Colo (100%): "+cada.join("/"));
      t(auditarClub("FCK").pct===auditarClub("CC").pct, "un club clonado iguala el rigor de la vara Colo-Colo");
      // integridad: los datos duros NO se inventan, quedan justificados
      var j=auditarClub("BIF").justificados.map(function(x){return x.k;});
      t(j.indexOf("dt")>=0 && j.indexOf("fund")>=0 && j.indexOf("historia")>=0, "DT/fundación/historia quedan JUSTIFICADOS (no inventados): "+j.join(","));
      t((CLUB_INFO_2026.BIF.dt||"el cuerpo técnico")==="el cuerpo técnico", "no se inventó un DT real (queda el placeholder del motor)");
      // estructural sí lleno: estadio con sectores, escudo, decisión propia, clásico
      t(devDecisionesDe("FCK").length>0, "cada club recibe su decisión propia (vara de Grok)");
      t(devRivalesDe("FCK").length>0, "cada club recibe un clásico (anillo de rivalidades)");
      /* EXPORT PERSISTENTE: exportar → borrar de memoria → recargar el .js → 100% otra vez */
      t(typeof devExportarLigaRigor==="function", "exportador de liga a rigor disponible");
      var meta2={eraKey:"tst_prs", baseEra:"2026", nombre:"Liga Persist TST", pais:"dinamarca", pts:3};
      var clubs2=[{id:"PZA",n:"Alpha",c:"A",fuerza:70,aforo:9000,est:"Est A",ciudad:"Ciudad A"},
                  {id:"PZB",n:"Beta",c:"B",fuerza:66,aforo:8000,est:"Est B",ciudad:"Ciudad B"}];
      devClonarLigaRigor(clubs2, meta2);
      var jsTxt=devExportarLigaRigor(clubs2, meta2);
      t(jsTxt.indexOf("registrarLiga")>=0 && jsTxt.length>1000, "el export genera un .js completo ("+jsTxt.length+" chars)");
      // borrar de memoria
      ["CLUB_INFO_2026","CLUB_META","IND_BASE_2026","CAJA_BASE_2026","ESTATUTO_INICIAL","PODER_CLUB","SITUACION_CLUB","ESTADIOS_DATA","ESCUDOS_CLUB"].forEach(function(nm){ var m=_devMapa(nm); if(m){ delete m.PZA; delete m.PZB; } });
      for(var z=DECISIONES.length-1;z>=0;z--){ if(DECISIONES[z].club==="PZA"||DECISIONES[z].club==="PZB") DECISIONES.splice(z,1); }
      for(var w=RIVALIDADES_2026.length-1;w>=0;w--){ var pr=RIVALIDADES_2026[w]; if(pr[0]==="PZA"||pr[1]==="PZA"||pr[0]==="PZB"||pr[1]==="PZB") RIVALIDADES_2026.splice(w,1); }
      Object.keys(DEV_SIN_DATO).forEach(function(k){ if(k.indexOf("PZA.")===0||k.indexOf("PZB.")===0) delete DEV_SIN_DATO[k]; });
      delete LIGAS["tst_prs"]; if(typeof ERA==="object") delete ERA["tst_prs"];
      t(auditarClub("PZA").pct<100, "tras borrar de memoria, el club ya NO está al 100%");
      // recargar el .js exportado (como data file fresco)
      (new Function(jsTxt))();
      t(auditarLiga("tst_prs").pct===100 && auditarClub("PZA").pct===100 && auditarClub("PZB").pct===100,
        "cargar el .js exportado reconstruye la liga al 100% (persistencia real)");
    }, "Clonar rigor");

    grupo("Liga clonada JUGABLE (Grok 7.9001)");
    safe(function(){
      t(typeof eraCustomDeClub==="function" && typeof clubMundo==="function", "helpers de Grok para clon jugable");
      t(typeof LIGAS==="object" && LIGAS.tst_din && LIGAS.tst_din.length>=4, "tst_din sigue registrada tras el clon");
      t(eraCustomDeClub("FCK")==="tst_din", "eraCustomDeClub(FCK) = tst_din");
      var okNP=nuevaPartida("FCK",2026,"historico");
      t(okNP!==false && E && E.club==="FCK", "nuevaPartida con un club clonado arranca");
      t(E.eraBase==="tst_din", "eraBase es la liga clonada (no 2026) — da "+E.eraBase);
      t((E.calendario||[]).length>=6, "el calendario NO está vacío ("+(E.calendario||[]).length+" fechas)");
      t(clubMundo("FCK") && clubMundo("FCK").id==="FCK", "clubMundo indexa el clon");
      t(typeof preguntasDeLiga==="function", "preguntasDeLiga existe (Boca ≠ Copa Chile)");
      var L=preguntasDeLiga({rivalNombre:"Brondby",fuerzaRival:74,local:true});
      var qs=L.map(function(x){return x.q;}).join(" ");
      t(!/Copa Chile/.test(qs), "una liga clonada no pregunta por Copa Chile");
    }, "Liga clonada jugable");

    grupo("Cierre de rigor AFA (Claude)");
    safe(function(){
      t(typeof DECISIONES_AFA!=="undefined" && DECISIONES_AFA.length>=23, "DECISIONES_AFA: 23 cartas propias ("+(typeof DECISIONES_AFA!=="undefined"?DECISIONES_AFA.length:0)+")");
      var ids=(typeof LIGA_ARG_2026!=="undefined"?LIGA_ARG_2026:[]).map(function(c){return c.id;});
      var conDec=ids.filter(function(id){ return DECISIONES.some(function(d){return d.club===id && d.anio===2026;}); });
      t(conDec.length===ids.length, "los 30 clubes AFA tienen decisión propia ("+conDec.length+"/"+ids.length+")");
      var a=auditarLiga("arg2026");
      t(a.pct===100, "rigor AFA 100% — todos los clubes al listón CC ("+a.pct+"%)");
      // clásicos: 0 pendientes (los sin rival en liga están justificados)
      var sinClas=ids.filter(function(id){ return auditarClub(id).faltanReq.some(function(x){return x.k==="clasico";}); });
      t(sinClas.length===0, "ningún club AFA queda marcado sin clásico (los reales fuera de liga = justificados)");
      t(typeof DEV_SIN_DATO==="object" && DEV_SIN_DATO["ALD.clasico"], "clásico de Aldosivi (Alvarado, otra división) declarado justificado");
      // integridad: las decisiones abren sin romper
      var d=DECISIONES.filter(function(x){return x.id==="tal26_interior";})[0];
      t(d && d.op && d.op.length>=2 && d.op[0].bien, "carta AFA bien formada (Talleres)");
      t(typeof DT_AFA_2026==="object" && CLUB_INFO_2026.PLA && CLUB_INFO_2026.PLA.dt!=="el cuerpo técnico", "DTs AFA cargados (dato Wikipedia 2026)");
    }, "AFA rigor");

    grupo("Arcos propios no se auto-bloquean (Claude)");
    safe(function(){
      t(typeof arcosDe==="function" && typeof ARCOS_EQUIPO==="object", "sistema de arcos disponible");
      // O'Higgins: su arco 'ohi_rancagua' menciona 'el cobre' (minería) y antes lo
      // bloqueaba la marca del estadio El Cobre de Cobresal. Debe llegar igual.
      nuevaPartida("OHI",2026,"historico");
      var ids=arcosDe("OHI").map(function(a){return a.id;});
      t(ids.indexOf("ohi_rancagua")>=0, "O'Higgins recibe su arco propio (Rancagua/el cobre)");
      // ningún arco de ARCOS_EQUIPO debe quedar fuera de arcosDe de su club
      var propiosOHI=(ARCOS_EQUIPO.OHI||[]).map(function(a){return a.id;});
      t(propiosOHI.every(function(id){ return ids.indexOf(id)>=0; }), "todos los arcos propios de OHI llegan");
    }, "Arcos propios");

    grupo("Modo Asociación: subir a controlar la ANFP/AFA (Claude)");
    safe(function(){
      t(typeof fedEstado==="function" && typeof fedPostular==="function" && typeof FED_PODERES!=="undefined", "sistema de Asociación disponible");
      nuevaPartida("CC",2026,"historico");
      // sin requisitos, no se puede postular
      E.grupos.anfp.aprob=0; E.capital=10; E.ind.prestigio=40;
      t(!fedPuedePostular(), "sin peso/capital/prestigio NO se puede postular");
      SEC="institucion"; render();
      var vt=(document.getElementById("vista")||{}).textContent||"";
      t(vt.indexOf("La Asociación")>=0 && vt.indexOf("Postular")>=0, "el panel de Asociación aparece en Institución");
      // con requisitos, sí; postular con victoria forzada
      E.grupos.anfp.aprob=60; E.capital=120; E.ind.prestigio=80; E.rep.credibilidad=90;
      t(fedPuedePostular(), "con peso+capital+prestigio SÍ se puede postular");
      var _r=Math.random, _c=window.confirm; Math.random=function(){return 0.01;}; window.confirm=function(){return true;};
      fedPostular(); Math.random=_r; window.confirm=_c;
      t(fedEstado().presidente===true, "gana la elección y preside la asociación");
      SEC="institucion"; render();
      var vt2=(document.getElementById("vista")||{}).textContent||"";
      t(vt2.indexOf("Presides")>=0 && vt2.indexOf("Poderes de la asociación")>=0, "la UI cambia a presidente con sus poderes");
      // poder corrupto: sube plata y sospecha; con random alto no estalla
      var plata0=E.plata, s0=fedEstado().sospecha, _r2=Math.random; Math.random=function(){return 0.99;};
      fedHacerPoder(FED_PODERES.filter(function(p){return p.id==="tv_favor";})[0]); Math.random=_r2;
      t(E.plata>plata0, "'Repartir la TV a tu favor' mete plata al club");
      t(fedEstado().sospecha>s0, "las movidas turbias suben la sospecha ("+s0+"→"+fedEstado().sospecha+")");
      // amaño: mod de arbitraje real
      var _r3=Math.random; Math.random=function(){return 0.99;};
      fedHacerPoder(FED_PODERES.filter(function(p){return p.id==="amanar";})[0]); Math.random=_r3;
      t(typeof modSuma==="function" && modSuma("arbitraje")>0, "'Amañar' deja un mod de arbitraje para tu club");
      // escándalo: sospecha alta + suerte pésima → destitución
      fedEstado().sospecha=90; var _r4=Math.random; Math.random=function(){return 0.0;};
      var estallo=fedChequearEscandalo(); Math.random=_r4;
      t(estallo===true && fedEstado().presidente===false, "con sospecha alta estalla el escándalo y te destituyen");
    }, "Modo Asociación");

    grupo("Localización de federación AFA→ANFP (Claude)");
    safe(function(){
      t(typeof localizarFed==="function" && typeof sincronizarGrupoFed==="function", "sistema de federación disponible");
      // Chile: el grupo se llama ANFP
      nuevaPartida("CC",2026,"historico"); SEC="institucion"; render();
      t(GRUPO_POR_ID.anfp && GRUPO_POR_ID.anfp.n==="ANFP", "en Chile el grupo federación es 'ANFP' ("+(GRUPO_POR_ID.anfp&&GRUPO_POR_ID.anfp.n)+")");
      var tc=(document.getElementById("vista")||{}).textContent||"";
      t(/\bANFP\b/.test(tc), "Chile SÍ menciona ANFP (no se rompió)");
      // Argentina: el grupo se llama AFA y no se cuela ANFP indebido
      nuevaPartida("BOC",2026,"historico",{categoria:"ARG"}); SEC="institucion"; render();
      t(GRUPO_POR_ID.anfp && GRUPO_POR_ID.anfp.n==="AFA", "en AFA el grupo federación es 'AFA' ("+(GRUPO_POR_ID.anfp&&GRUPO_POR_ID.anfp.n)+")");
      var ta=(document.getElementById("vista")||{}).textContent||"";
      var neto=(ta.match(/\bANFP\b/g)||[]).length-(ta.match(/no (es )?(la )?ANFP/g)||[]).length;
      t(neto===0, "institución de Boca no muestra ANFP indebido (neto="+neto+")");
      t(typeof localizarFed==="function" && localizarFed("Lobby en la ANFP").indexOf("AFA")>=0, "localizarFed traduce ANFP→AFA en partida argentina");
    }, "Localización AFA");

    grupo("Seguridad de texto: huecos que cerró Claude sobre el XSS de Grok");
    safe(function(){
      t(typeof textoLimpio==="function" && typeof escHtml==="function", "helpers de Grok presentes (textoLimpio/escHtml)");
      var xss='<img src=x onerror=alert(1)>Pep';
      t(textoLimpio(xss).indexOf("<")<0, "textoLimpio quita etiquetas ("+textoLimpio(xss)+")");
      t(textoLimpio(textoLimpio(xss))===textoLimpio(xss), "textoLimpio es IDEMPOTENTE");
      // HUECO 1+1b: el nombre del DT, linaje e hijos se sanean en la CARGA (normalizarEstado),
      // que es la frontera de confianza real (un .fut envenenado se dibuja tras normalizar).
      nuevaPartida("CC",2026,"historico");
      E.perfil.nombre='<script>x()</script>Vicente';
      E.dinastia.linaje='<img onerror=y>Familia';
      if(!E.perfil.hijos) E.perfil.hijos=[]; E.perfil.hijos.push({nombre:'<b onmouseover=z>Pepe</b>'});
      normalizarEstado();
      t(E.perfil.nombre.indexOf("<")<0, "normalizarEstado limpia el NOMBRE DEL DT ("+E.perfil.nombre+")");
      t(E.dinastia.linaje.indexOf("<")<0, "normalizarEstado limpia el linaje ("+E.dinastia.linaje+")");
      t(E.perfil.hijos[0].nombre.indexOf("<")<0, "normalizarEstado limpia nombres de hijos");
      E.perfil.nombre='<img src=x onerror=alert(1)>Vicente'; normalizarEstado();
      t(E.perfil.nombre==="Vicente", "una etiqueta completa se borra entera, queda el texto ("+E.perfil.nombre+")");
      // util.js de Grok queda intacto: escHtml no fue tocado
      t(escHtml("<b>")==="&lt;b&gt;", "escHtml de Grok sigue funcionando (no se tocó su archivo)");
    }, "Seguridad texto");

    OUT.push("\n════════════════════════");
    OUT.push((BAD===0?"✅ TODO VERDE":"❌ HAY FALLOS")+" · "+OK+"/"+(OK+BAD)+" checks");
    OUT.push("PRUEBAS_DEV_DONE:"+(BAD===0?"PASS":"FAIL"));
    var pre=document.getElementById("out"); if(pre) pre.textContent=OUT.join("\n");
    document.title=(BAD===0?"PASS":"FAIL")+" "+OK+"/"+(OK+BAD);
  }
  window.addEventListener("DOMContentLoaded",function(){
    setTimeout(function(){
      try{ correr(); }
      catch(e){ var p=document.getElementById("out"); if(p) p.textContent="FATAL: "+e.message+"\n"+(e.stack||"")+"\nPRUEBAS_DEV_DONE:FAIL"; }
    },450);
  });
})();
