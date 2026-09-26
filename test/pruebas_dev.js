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
      t(tabs.length===7, "el editor tiene 7 pestañas (Rigor/Club/Nuevo/Liga/Alma/Doctor/Exportar)");
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
      t(typeof nombreCopaDomestica==="function", "nombreCopaDomestica (liga completa)");
      t((E.calendario||[]).some(function(p){ return p.tipo==="copa" && !/Copa Chile/i.test(p.torneo||""); }),
        "el clon trae copa doméstica en el calendario");
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

    grupo("Jornada en vivo · 7.9011 (que se sienta movido)");
    safe(function(){
      t(typeof jornadaEnVivo==="function","jornadaEnVivo existe");
      t(typeof panelJornada==="function","panelJornada existe");
      t(typeof parteSemana==="function","parteSemana existe");
      t(terminarPartido._jor10===true,"terminarPartido queda envuelto (captura la tabla antes/después)");
      t(vistaEscritorio._jor10===true,"vistaEscritorio queda envuelto (panel al escritorio)");
      nuevaPartida("CC",2026,"historico");
      var part=proximoPartido();
      t(!!part,"hay próximo partido");
      var P=iniciarPartido(part,"simular"); correrHasta(P,90);
      var res=terminarPartido(P);
      t(!!E.ultimaJornada,"tras el partido queda E.ultimaJornada");
      t(E.ultimaJornada.mio && E.ultimaJornada.mio.yo===res.yo,"la jornada guarda TU marcador");
      t(Array.isArray(E.ultimaJornada.otros) && E.ultimaJornada.otros.length>0,
        "guarda los otros partidos de la fecha ("+(E.ultimaJornada.otros||[]).length+")");
      t(Array.isArray(E.ultimaJornada.mov),"guarda el movimiento de la tabla");
      t(E.ultimaJornada.vista===false,"arranca sin ver (el escritorio ofrece verla)");
      t(E.ultimaJornada.mio.pos>0,"sabe en qué puesto quedaste ("+E.ultimaJornada.mio.pos+"°)");
      var pj=panelJornada();
      t(!!pj,"panelJornada devuelve panel con datos");
      t(pj.textContent.indexOf("-")>=0,"el panel muestra marcadores");
      /* el escritorio lo inserta de verdad */
      SEC="escritorio"; render();
      t(document.getElementById("vista").textContent.indexOf(T("jor_panel","La liga se movió"))>=0,
        "el escritorio muestra 'la liga se movió'");
      /* parte de la semana: aparece y caduca */
      parteSemana(["Caja de la semana: $1 M","otra cosa"]);
      SEC="escritorio"; render();
      t(document.getElementById("vista").textContent.indexOf(T("sem_tit","Parte de la semana"))>=0,
        "el parte de la semana se pinta en el escritorio");
      E._parte.idx=E._parte.idx-5;
      SEC="escritorio"; render();
      t(document.getElementById("vista").textContent.indexOf(T("sem_tit","Parte de la semana"))<0,
        "el parte viejo NO se queda pegado (caduca con la semana)");
      /* el botón avanzar dice qué va a pasar */
      var bav=document.getElementById("btnAvanzar");
      t(bav && bav.textContent.length>3,"el botón Avanzar tiene texto vivo ("+(bav&&bav.textContent)+")");
      /* nada de esto corre en simulación masiva */
      E._bulkSim=true; var antes=JSON.stringify(E.ultimaJornada);
      _jorGuardar(part,{yo:9,otro:9},{});
      t(JSON.stringify(E.ultimaJornada)===antes,"en simulación masiva no se toca la jornada");
      E._bulkSim=false;
    },"Jornada");

    grupo("Preguntas 7.9012 · el banco rota (A1)");
    safe(function(){
      t(typeof elegirPreguntas==="function","elegirPreguntas(pool,sit,n) existe");
      t(preguntasConferencia._p92===true,"preguntasConferencia queda envuelta con ._p92");
      t(preguntasPostPartido._p92===true,"preguntasPostPartido queda envuelta con ._p92");
      t(preguntasConferencia._voz===true,"el wrap ._voz de adentro NO se rompió");
      t(preguntasPostPartido._beta===true,"el wrap ._beta de adentro NO se rompió");
      nuevaPartida("CC",2026,"historico");
      var part=proximoPartido();
      /* misma semana = mismas preguntas (si no, el guardado mostraría otras) */
      var a=preguntasConferencia(part).filter(function(x){return x._p92;}).map(function(x){return x.q;}).join("|");
      var b=preguntasConferencia(part).filter(function(x){return x._p92;}).map(function(x){return x.q;}).join("|");
      t(a===b && a.length>0,"la misma semana da SIEMPRE las mismas preguntas");
      E.idx++;
      var c=preguntasConferencia(part).filter(function(x){return x._p92;}).map(function(x){return x.q;}).join("|");
      t(c!==a,"otra semana da preguntas distintas");
      /* 6 fechas seguidas en la misma situación: ni una repetida */
      nuevaPartida("CC",2026,"historico");
      var vistas={}, rep=0, tot=0;
      for(var w=0;w<6;w++){
        preguntasConferencia(part).filter(function(x){return x._p92;}).forEach(function(x){
          tot++; if(vistas[x.q]) rep++; vistas[x.q]=1;
        });
        E.idx++;
      }
      t(tot>=12,"en 6 fechas se inyectaron "+tot+" preguntas");
      t(rep===0,"en 6 fechas seguidas NO se repite ninguna (repetidas: "+rep+")");
      /* el registro vive en E.flags y se limpia al cerrar temporada */
      t(E.flags.qUsadas && Object.keys(E.flags.qUsadas).length>0,"E.flags.qUsadas registra lo preguntado");
      limpiarPreguntasUsadas();
      t(Object.keys(E.flags.qUsadas).length===0,"limpiarPreguntasUsadas vacía el registro");
      t(nuevoAnio._p92===true,"nuevoAnio limpia el banco al cerrar la temporada");
    },"Rotación de preguntas");

    grupo("Preguntas 7.9012 · banco nuevo (A2)");
    safe(function(){
      t(PREGUNTAS_92.length>=60,"hay al menos 60 preguntas nuevas ("+PREGUNTAS_92.length+")");
      var sits=["post_empate","lesion_clave","rival_puntero","racha_ganadora","debut_juvenil",
                "deuda_alta","hinchada_caliente","mercado_caliente","ultimo_partido_del_anio",
                "copa_internacional","vuelves_de_la_b","clasico_de_visita","arbitro_polemico","dt_cuestionado"];
      var faltan=sits.filter(function(x){ return !PREGUNTAS_92.some(function(p){ return p.sit===x; }); });
      t(faltan.length===0,"están las 14 situaciones nuevas"+(faltan.length?" — faltan "+faltan.join(","):""));
      var malas=PREGUNTAS_92.concat(PREGUNTAS_PAIS,PREGUNTAS_EPOCA).filter(function(p){
        return !p.q || !Array.isArray(p.ops) || p.ops.length!==3 || p.ops.some(function(o){ return !o.t||!o.k; });
      });
      t(malas.length===0,"todas traen 3 opciones {t,k} del patrón del repo");
      var voseo=/\b(pediste|ten[ée]s|quer[ée]s|pod[ée]s|sab[ée]s|jug[áa]s|decid[íi]s|bancás|vos)\b/i;
      var conVoseo=PREGUNTAS_92.concat(PREGUNTAS_PAIS,PREGUNTAS_EPOCA).filter(function(p){ return voseo.test(p.q); });
      t(conVoseo.length===0,"sin voseo en el banco nuevo (regla del repo)");
    },"Banco nuevo");

    grupo("Preguntas 7.9012 · el DT sabe dónde está (A3)");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      t(paisDeBanco()==="CL","Colo-Colo resuelve país CL");
      var Lc=preguntasConferencia(proximoPartido()).map(function(x){return x.q;}).join(" ");
      t(/ANFP|Copa Chile|chilen/i.test(Lc),"Colo-Colo recibe preguntas de Chile");
      t(!/AFA|Superclásico|argentin/i.test(Lc),"a Colo-Colo no le preguntan por Argentina");
      nuevaPartida("BOC",2026,"historico",{categoria:"ARG"});
      t(paisDeBanco()==="AR","Boca resuelve país AR");
      var Lb=preguntasConferencia({rivalNombre:"River Plate",fuerzaRival:80,local:true}).map(function(x){return x.q;}).join(" ");
      t(/AFA|Superclásico|argentin/i.test(Lb),"Boca recibe preguntas de Argentina");
      t(!/Copa Chile|ANFP/.test(Lb),"a Boca NO le preguntan por Copa Chile ni la ANFP");
      /* liga clonada: no se le mete la ANFP a una liga que no es de Chile */
      registrarLiga({eraKey:"tst_q92", baseEra:2026, nombre:"Liga Q92", clubs:[
        {id:"QA",n:"Q Alfa",c:"Alfa",fuerza:70,aforo:20000,est:"Alfa Park",ciudad:"Alfa"},
        {id:"QB",n:"Q Beta",c:"Beta",fuerza:66,aforo:18000,est:"Beta Park",ciudad:"Beta"},
        {id:"QC",n:"Q Gama",c:"Gama",fuerza:62,aforo:15000,est:"Gama Park",ciudad:"Gama"},
        {id:"QD",n:"Q Delta",c:"Delta",fuerza:58,aforo:12000,est:"Delta Park",ciudad:"Delta"}]});
      nuevaPartida("QA",2026,"historico");
      t(paisDeBanco()===null,"una liga clonada no tiene banco de país");
      var Lq=preguntasConferencia(proximoPartido()).filter(function(x){return x._p92;}).map(function(x){return x.q;}).join(" ");
      t(!/ANFP|Copa Chile|AFA/.test(Lq),"la liga clonada no recibe preguntas de la ANFP ni de la AFA");
    },"País");

    grupo("Preguntas 7.9012 · el DT sabe en qué año está (A4)");
    safe(function(){
      t(PREGUNTAS_EPOCA.filter(function(p){return p.era==="1991";}).length>=12,"12+ preguntas con sabor 1991");
      t(PREGUNTAS_EPOCA.filter(function(p){return p.era==="2006";}).length>=12,"12+ preguntas con sabor 2006");
      t(PREGUNTAS_EPOCA.filter(function(p){return p.era==="2026";}).length>=12,"12+ preguntas con sabor 2026");
      t(eraDePregunta(1991)==="1991" && eraDePregunta(2006)==="2006" && eraDePregunta(2026)==="2026",
        "eraDePregunta ubica las tres épocas jugables");
      t(textoAnacronico("¿El plantel puede mirar redes sociales?",1991)===true,"«redes sociales» es anacrónico en 1991");
      t(textoAnacronico("¿Vio la jugada del VAR?",1991)===true,"«VAR» es anacrónico en 1991");
      t(textoAnacronico("¿Vio la jugada del VAR?",2026)===false,"«VAR» sí corre en 2026");
      nuevaPartida("CC",1991,"historico");
      var vistas91=[];
      for(var w=0;w<6;w++){
        preguntasConferencia(proximoPartido()).filter(function(x){return x._p92;}).forEach(function(x){
          vistas91.push(x.q+" "+(x.ops||[]).map(function(o){return o.t;}).join(" "));
        });
        E.idx++;
      }
      var malos=TERMINOS_EPOCA.filter(function(term){
        return term.desde>1991 && vistas91.some(function(txt){ return term.re.test(txt); });
      });
      t(vistas91.length>=10,"en 1991 se preguntó de verdad ("+vistas91.length+" preguntas)");
      t(malos.length===0,"en 1991 NO sale nada posterior a 1991"+(malos.length?" — "+malos.map(function(m){return m.re.source;}).join(" , "):""));
      var era91=PREGUNTAS_EPOCA.filter(function(p){ return p.era==="2026"; })[0];
      t(_q92EraOk(era91,1991)===false,"una pregunta marcada era:2026 no entra en 1991");
    },"Época");

    grupo("Preguntas 7.9012 · dificultad por tamaño (A5)");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      t(durezaClub()==="grande","Colo-Colo es club grande ("+presionClub()+")");
      t(preguntasPorRueda()===3,"al grande se le hace una pregunta más por rueda");
      t(elegirPreguntasConf._p92===true,"la conferencia del grande pide una pregunta más");
      nuevaPartida("LIM",2026,"historico");
      t(durezaClub()==="chico","Limache es club chico ("+presionClub()+")");
      t(preguntasPorRueda()===2,"al chico se le hacen 2 por rueda");
      var P={once:E.plantel.slice(0,11),goleadores:[],part:{rivalNombre:"Audax Italiano",local:true},lineas:[]};
      var Lp=preguntasPostPartido({yo:1,otro:1,lesionados:[]},P).filter(function(x){return x._p92;});
      t(Lp.length===2,"el club chico recibe 2 preguntas en la sala ("+Lp.length+")");
      var amables=Lp.filter(function(x){ return /un club como este|levanten la cabeza|de a poco/i.test(x.q+" "+x.ops.map(function(o){return o.t;}).join(" ")); });
      t(amables.length>=1,"al club chico le llega tono amable");
      t(sitsPost({yo:1,otro:1},P).indexOf("post_empate")>=0,"el empate se detecta como situación");
    },"Dificultad");

    grupo("Mundo vivo 7.9012 (B1)");
    safe(function(){
      t(typeof mundoVivoTick==="function","mundoVivoTick existe");
      t(typeof panelMundoVivo==="function","panelMundoVivo existe");
      t(mundoTick._mv===true,"mundoTick queda envuelto (capa de lectura)");
      t(panelJornada._mv===true,"panelJornada queda envuelto, no reescrito");
      t(_jorTabla._mv===true,"el resumen de la fecha en vivo también lo cuenta");
      nuevaPartida("CC",2026,"historico");
      for(var w=0;w<5;w++){
        var part=proximoPartido(); if(!part) break;
        var P=iniciarPartido(part,"simular"); correrHasta(P,90); terminarPartido(P);
      }
      var v=mundoVida();
      t(v.length>=3,"en 5 fechas el mundo contó al menos 3 cosas ("+v.length+")");
      var ajenas=v.filter(function(x){ return x.id!==E.club; });
      t(ajenas.length>=3,"al menos 3 no tienen que ver con tu club ("+ajenas.length+")");
      t(v.every(function(x){ return x.txt && x.tipo; }),"cada cosa tiene tipo y texto");
      t(v.length<=40,"la memoria del mundo no crece sin freno ("+v.length+"/40)");
      var pj=panelJornada();
      t(pj && pj.textContent.indexOf(T("mv_tit","El mundo se movió"))>=0,"«La liga se movió» suma lo de afuera");
      SEC="escritorio"; render();
      t(document.getElementById("vista").textContent.indexOf(T("mv_tit","El mundo se movió"))>=0,
        "el escritorio muestra el mundo vivo");
      E._bulkSim=true;
      var antes=mundoVida().length;
      mundoVivoTick();
      t(mundoVida().length===antes,"en simulación masiva el mundo vivo no escribe");
      E._bulkSim=false;
    },"Mundo vivo");

    grupo("Localización de preguntas y mundo");
    safe(function(){
      ["q92_calma","q92_confianza","q92_palo","q92_humilde","q92_bancar","q92_palo2",
       "mv_tit","mv_nada","mv_dt","mv_fichaje","mv_racha","mv_golpe","mv_ver"].forEach(function(k){
        t(FRASES.neutro[k] && FRASES.en[k] && FRASES.pt[k], "clave "+k+" está en neutro/en/pt");
      });
    },"i18n 7.9012");

    grupo("Localización de la jornada");
    safe(function(){
      ["jor_tit","jor_panel","jor_ver","jor_saltar","jor_tabla","sem_tit","av_jugar","av_semana","av_cierre"].forEach(function(k){
        t(FRASES.neutro[k] && FRASES.en[k] && FRASES.pt[k], "clave "+k+" está en neutro/en/pt");
      });
    },"i18n jornada");

    grupo("Mundo por época · 7.9013 (nada anacrónico)");
    safe(function(){
      t(typeof mundoEpocaPodar==="function","mundoEpocaPodar existe");
      t(typeof mundoEpocaLimitada==="function","mundoEpocaLimitada existe");
      t(mundoInit._ep===true && mundoSimCopas._ep===true,"mundoInit y mundoSimCopas quedan envueltos");
      t(mundoTick._mv===true,"el wrap de mundo-vivo sobrevive al de época (marcas heredadas)");
      nuevaPartida("CC",1991,"historico");
      for(var i=0;i<12;i++){ var p=proximoPartido(); if(!p) break;
        var P=iniciarPartido(p,"simular"); correrHasta(P,90); terminarPartido(P);
        try{ procesarSemanaPostPartido(); }catch(e){} }
      t(mundoEpocaLimitada()===true,"1991 queda marcado como época sin mundo modelado");
      var ligas=Object.keys(E.mundo.ligas||{});
      t(ligas.length===1 && ligas[0]==="1991","en 1991 solo queda la liga de 1991 ("+ligas.join(",")+")");
      var txt=JSON.stringify({p:E.mundo.pais||[],v:E.mundo.vida||[],j:(E.ultimaJornada&&E.ultimaJornada.mundo)||[],n:E.mundo.noticias||[]});
      ["Sudamericana","Copa de la Liga","Bragantino","Cusco","Copa Argentina","Libertadores","Limache"].forEach(function(w){
        t(txt.indexOf(w)<0,"1991 no nombra «"+w+"»");
      });
      t(typeof mundoEpocaTexto()==="string" && mundoEpocaTexto().length>20,"hay texto honesto para la época sin mundo");
      /* 2026 sigue igual: el mundo moderno no se poda */
      nuevaPartida("CC",2026,"historico");
      var p2=proximoPartido(); var P2=iniciarPartido(p2,"simular"); correrHasta(P2,90); terminarPartido(P2);
      t(mundoEpocaLimitada()===false,"2026 NO se poda");
      t(Object.keys(E.mundo.ligas||{}).length>=5,"2026 mantiene sus ligas ("+Object.keys(E.mundo.ligas||{}).length+")");
    },"Mundo época");

    grupo("FIFA / guerra de federaciones · 7.9013 (la cara del motor)");
    safe(function(){
      ["fedEscalon","fedPeso","panelEscalera","panelGuerra","fedLineaEscritorio","fedTickAnio","fedElegirReforma","fedChequearSalto"]
        .forEach(function(f){ t(typeof window[f]==="function","export "+f); });
      nuevaPartida("CC",2026,"historico");
      t(fedEscalon("conmebol")==="cerrado","sin peso, CONMEBOL está cerrado");
      E.flags.fed_conmebol=3; aplicarSaltoFed();
      t(E.fed.conmebolOk===true && fedNivelContinental()==="conmebol","con 3 jugadas se abre CONMEBOL");
      t(fedEscalon("conmebol")==="ok" && fedEscalon("fifa")==="actual","la escalera lo refleja");
      SEC="institucion"; render();
      var v1=document.getElementById("vista").textContent;
      t(v1.indexOf(T("fed_escalera","Escalera del poder"))>=0,"Institución muestra la escalera");
      t(v1.indexOf("CONMEBOL")>=0,"Institución nombra el escalón CONMEBOL");
      E.flags.fed_conmebol=6; aplicarSaltoFed();
      t(E.fed.fifaOk===true && fedNivelContinental()==="fifa","con 6 jugadas se llega a FIFA");
      E.flags.fed_guerra=1; aplicarGuerraFed();
      SEC="institucion"; render();
      var v2=document.getElementById("vista").textContent;
      t(v2.indexOf(T("fed_guerra","Guerra de asociaciones"))>=0,"con guerra, aparece el panel de guerra");
      t(v2.indexOf(T("fed_cupos","Cupos internacionales"))>=0,"la guerra muestra los cupos en números");
      t(fedLineaEscritorio()===null,"sin presidir, no hay línea en el escritorio");
      E.fed.presidente=true;
      var ln=fedLineaEscritorio();
      t(typeof ln==="string" && ln.indexOf("FIFA")>=0,"presidiendo, el escritorio dice el escalón ("+ln+")");
    },"Federación UI");

    grupo("El rival tiene pasado · 7.9013");
    safe(function(){
      t(typeof formaClub==="function" && typeof ultimoCruce==="function","formaClub y ultimoCruce existen");
      t(typeof _pasadoRival==="function","_pasadoRival existe");
      nuevaPartida("CC",2026,"historico");
      var pr=proximoPartido();
      var caja=_pasadoRival(pr);
      t(caja && caja.textContent.length>10,"sin historial, igual dice algo");
      t(caja.textContent.indexOf(T("riv_sin","Primera vez que se cruzan este año."))>=0 ||
        caja.textContent.indexOf(T("riv_nuevo","Todavía no jugó esta temporada."))>=0,
        "sin datos, lo DICE en vez de inventar");
      for(var i=0;i<6;i++){ var p=proximoPartido(); if(!p) break;
        var P=iniciarPartido(p,"simular"); correrHasta(P,90); terminarPartido(P);
        try{ procesarSemanaPostPartido(); }catch(e){} }
      var algun=Object.keys(E.forma||{}).filter(function(k){ return (E.forma[k]||[]).length>0; });
      t(algun.length>0,"E.forma guarda racha de los clubes ("+algun.length+")");
      var f=formaClub(algun[0]);
      t(f.length>0 && f.length<=5,"formaClub devuelve hasta 5 ("+f.length+")");
      t(["V","E","D"].indexOf(f[0].r)>=0,"cada resultado es V/E/D ("+f[0].r+")");
      var prox=proximoPartido();
      if(prox){ var c2=_pasadoRival(prox); t(c2.textContent.length>10,"con datos, la tira del rival se arma"); }
      else t(true,"sin próximo partido, nada que armar");
    },"Rival");

    grupo("Calendario con pulso y botones vivos · 7.9013");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      var P=iniciarPartido(proximoPartido(),"simular"); correrHasta(P,90); terminarPartido(P);
      SEC="calendario"; render();
      var v=document.getElementById("vista").textContent;
      t(v.indexOf(T("cal_prog","Temporada"))>=0,"el calendario muestra el progreso de la temporada");
      t(v.indexOf(T("cal_sig","Lo que viene"))>=0,"el calendario muestra lo que viene");
      t(typeof _irAPanel==="function","_irAPanel existe (las 4 fichas de Finanzas ya no son mudas)");
      SEC="finanzas"; render();
      var chips=document.querySelectorAll("#vista .banco-cta");
      t(chips.length===4,"hay 4 fichas de banco ("+chips.length+")");
      var conAccion=0;
      for(var i=0;i<chips.length;i++){ if(typeof chips[i].onclick==="function") conAccion++; }
      t(conAccion===4,"las 4 tienen acción ("+conAccion+")");
    },"Calendario/Finanzas");

    grupo("Alma: ningún club pobre · 7.9013");
    safe(function(){
      /* OJO: los grupos de arriba clonan una liga de prueba; esos clones entran al
         informe global. Se mide sobre los clubes REALES del juego, que es la vara. */
      var reales=[];
      [typeof LIGA_2026!=="undefined"?LIGA_2026:[], typeof LIGA_ARG_2026!=="undefined"?LIGA_ARG_2026:[],
       typeof LIGA91!=="undefined"?LIGA91:[]].forEach(function(L){
        (L||[]).forEach(function(c){ if(c&&c.id&&devEsJugable(c.id)&&reales.indexOf(c.id)<0) reales.push(c.id); });
      });
      var pobresReales=reales.filter(function(id){ return auditarContenido(id).nivel==="pobre"; });
      t(pobresReales.length===0,"ningún club real queda pobre ("+pobresReales.join(",")+")");
      t(reales.length>=45,"se midieron los clubes reales del juego ("+reales.length+")");
      var pobresAfa=ALMA_ARG.filter(function(c){ return auditarContenido(c.id).nivel==="pobre"; });
      t(pobresAfa.length===0,"los 23 de la AFA salieron de pobres");
      t(typeof ALMA_ARG!=="undefined" && ALMA_ARG.length===23,"ALMA_ARG cubre los 23 ("+(typeof ALMA_ARG!=="undefined"?ALMA_ARG.length:-1)+")");
      ALMA_ARG.forEach(function(c){
        var a=(ARCOS_EQUIPO[c.id]||[]).filter(function(x){ return x.id==="alma_"+c.id.toLowerCase(); });
        if(a.length!==1) t(false,"arco propio de "+c.id);
        else if((a[0].capitulos||[]).length!==2) t(false,"2 capítulos en "+c.id);
      });
      t(true,"los 23 tienen su arco de 2 capítulos");
      var decs=DECISIONES.filter(function(d){ return d.id && d.id.indexOf("alma26_")===0; });
      t(decs.length===23,"23 decisiones propias nuevas ("+decs.length+")");
      t(decs.every(function(d){ return d.club && d.anio===2026 && (d.op||[]).length===3; }),"cada decisión tiene club, año y 3 opciones");
      /* integridad: el ancla es dato del propio repo, no inventado */
      var anclaMal=ALMA_ARG.filter(function(c){
        var real=(typeof LIGA_ARG_2026!=="undefined")&&LIGA_ARG_2026.filter(function(x){ return x.id===c.id; })[0];
        return !(real && real.aforo===c.af && real.est===c.est);
      }).map(function(c){ return c.id; });
      t(anclaMal.length===0,"el estadio y el aforo salen tal cual de LIGA_ARG_2026 ("+anclaMal.join(",")+")");
    },"Alma AFA");

    grupo("Épocas con alma · 7.9015");
    safe(function(){
      t(typeof ALMA_EPOCA!=="undefined" && ALMA_EPOCA.length>0,"ALMA_EPOCA existe ("+(typeof ALMA_EPOCA!=="undefined"?ALMA_EPOCA.length:-1)+")");
      t(typeof epocasHuerfanas==="function","epocasHuerfanas existe (auditor)");
      t(decisionesDisponibles._epAlma===true,"decisionesDisponibles queda envuelto por E.epocaHist");
      /* el hallazgo: cuántos arranques (club, época) ofrece el juego */
      var pares=0;
      Object.keys(EPOCAS_CLUB||{}).forEach(function(id){
        (EPOCAS_CLUB[id]||[]).forEach(function(e){ if(e.anio||e.a) pares++; });
      });
      t(pares>=84,"el juego ofrece "+pares+" arranques (club, época)");
      var h=epocasHuerfanas();
      t(h.length===pares-ALMA_EPOCA.length-12,"las huérfanas bajan exactamente por lo escrito ("+h.length+")");
      /* cada entrada dispara DE VERDAD al arrancar esa época */
      var ok=0, mal=[];
      ALMA_EPOCA.forEach(function(x){
        var ep=(EPOCAS_CLUB[x.c]||[]).filter(function(e){ return (e.anio||e.a)===x.a; })[0];
        if(!ep){ mal.push(x.c+" "+x.a+" sin época"); return; }
        nuevaPartida(x.c,x.a,"historico",{epoca:ep});
        var id="ep_"+x.c.toLowerCase()+"_"+x.a;
        if((E.decPend||[]).some(function(y){ return y.id===id; })) ok++;
        else mal.push(x.c+" "+x.a+" (anio="+E.anio+")");
      });
      t(ok===ALMA_EPOCA.length,"las "+ALMA_EPOCA.length+" salen en la mesa al arrancar su época"+(mal.length?(" — fallan: "+mal.join(", ")):""));
      /* el caso que obligó al wrap: el año se cae y la época igual dispara */
      var epT=(EPOCAS_CLUB.TEM||[])[0];
      nuevaPartida("TEM",2001,"historico",{epoca:epT});
      t(E.anio!==2001 && E.epocaHist===2001,"Temuco 2001 pierde el año pero conserva epocaHist");
      t((E.decPend||[]).some(function(y){ return y.id==="ep_tem_2001"; }),"y su decisión de época igual aparece");
      /* forma: 3 opciones, arquetipo válido, sin texto vacío */
      var tipos={};
      ALMA_EPOCA.forEach(function(x){
        tipos[x.tipo]=1;
        if(!ALMA_TIPOS[x.tipo]) t(false,"arquetipo desconocido en "+x.c);
        if((x.op||[]).length!==3) t(false,x.c+" "+x.a+" no tiene 3 opciones");
        if(!x.t||!x.ctx||x.ctx.length<80) t(false,x.c+" "+x.a+" con contexto flaco");
      });
      t(true,"todas tienen 3 opciones y contexto");
      t(Object.keys(tipos).length>=4,"se usan los 4 arquetipos ("+Object.keys(tipos).join(",")+")");
      /* integridad: el ancla sale de EPOCAS_CLUB, no de la nada */
      var sinAncla=ALMA_EPOCA.filter(function(x){
        return !(EPOCAS_CLUB[x.c]||[]).some(function(e){ return (e.anio||e.a)===x.a; });
      }).map(function(x){ return x.c+" "+x.a; });
      t(sinAncla.length===0,"cada entrada corresponde a una época real del repo ("+sinAncla.join(",")+")");
      /* 7.9017 · el error que se colo en 7.9015: el texto de Coquimbo campeon
         nombraba "La Portada", que es el estadio de La Serena — la ciudad rival.
         Este check lo habria cazado, asi que ahora vive en las pruebas. */
      var estDe={};
      [typeof LIGA_2026!=="undefined"?LIGA_2026:[], typeof LIGA_B_2026!=="undefined"?LIGA_B_2026:[],
       typeof LIGA_C_2026!=="undefined"?LIGA_C_2026:[], typeof LIGA_ARG_2026!=="undefined"?LIGA_ARG_2026:[],
       typeof LIGA91!=="undefined"?LIGA91:[], typeof LIGA_2006!=="undefined"?LIGA_2006:[]].forEach(function(L){
        (L||[]).forEach(function(c){
          if(!c||!c.id||!c.est) return;
          (estDe[c.id]=estDe[c.id]||[]).push(String(c.est).replace(/^Estadio\s+/i,"").toLowerCase());
        });
      });
      /* Solo nombres DISTINTIVOS: 2+ palabras y 10+ caracteres. "nacional" y
         "el cobre" quedan fuera porque son además el torneo y el mineral, y los
         textos los usan con ese sentido (falsos positivos comprobados). */
      var AMBIGUOS=["nacional","el cobre","municipal"];
      function distintivo(e){
        return e.split(/\s+/).length>=2 && e.length>=10 && AMBIGUOS.indexOf(e)<0;
      }
      var checkables=[];
      Object.keys(estDe).forEach(function(k){ estDe[k].forEach(function(e){ if(distintivo(e)) checkables.push(e); }); });
      t(checkables.indexOf("la portada")>=0,"el check cubre «la portada», que es el caso que se colo");
      var cruces=[];
      ALMA_EPOCA.forEach(function(x){
        var txt=[x.t,x.ctx].concat((x.op||[]).map(function(o){ return o.t+" "+o.d; })).join(" ").toLowerCase();
        var propios=estDe[x.c]||[];
        Object.keys(estDe).forEach(function(otro){
          if(otro===x.c) return;
          estDe[otro].forEach(function(e){
            if(!distintivo(e) || propios.indexOf(e)>=0) return;
            if(txt.indexOf(e)>=0) cruces.push(x.c+" "+x.a+' nombra "'+e+'" (es de '+otro+")");
          });
        });
      });
      t(cruces.length===0,"ninguna época nombra el estadio de OTRO club ("+cruces.join(" | ")+")");
      /* se resuelve sin romper nada */
      var d=DECISIONES.filter(function(x){ return x.id==="ep_pal_1978"; })[0];
      t(!!d,"la decisión de Palestino 1978 quedó registrada");
      var epP=(EPOCAS_CLUB.PAL||[])[0];
      nuevaPartida("PAL",1978,"historico",{epoca:epP});
      var r=resolverDecision({id:d.id,buzon:d.buzon,op:d.op,posturas:d.posturas},1);
      t(r && r.txt && r.txt.length>10,"resolverla devuelve un desenlace escrito");
    },"Épocas");

    grupo("Pulido 7.9014");
    safe(function(){
      t(typeof _nomCortoRival==="function","_nomCortoRival existe");
      nuevaPartida("CC",2026,"historico");
      var pa=proximoPartido();
      var corto=_nomCortoRival(pa);
      t(corto.length<=16,"el nombre del rival en la barra nunca pasa de 16 ("+corto.length+")");
      SEC="escritorio"; render();
      var bav=document.getElementById("btnAvanzar");
      t(bav.textContent.indexOf(T("av_jugar","Jugar"))>=0,"el botón dice la acción");
      t((bav.title||"").indexOf(pa.rivalNombre)>=0,"el nombre completo del rival queda en el title");
      t(document.documentElement.scrollWidth-document.documentElement.clientWidth===0,
        "la barra superior no desborda la pantalla");
      /* rival que no comparte tabla: se dice, no se finge */
      t(typeof _enMiLiga==="function","_enMiLiga existe");
      t(_enMiLiga(E.club)===true,"tu club está en tu liga");
      t(_enMiLiga("__NO_EXISTE__")===false,"un club de otro torneo no está en tu liga");
      var falso={rivalId:"__NO_EXISTE__",rivalNombre:"Rival de otra liga",local:true};
      t(_pasadoRival(falso).textContent.indexOf(T("riv_otra","Juega en otro torneo: no comparten tabla."))>=0,
        "un rival de otra liga lo dice en vez de inventar racha");
      /* los partidos de copa vienen con rivalId:null — el tipo manda */
      var copa={tipo:"copa",torneo:"Copa Libertadores",rivalId:null,rivalNombre:"LDU de Quito",local:false};
      t(_pasadoRival(copa).textContent.indexOf(T("riv_otra","Juega en otro torneo: no comparten tabla."))>=0,
        "un rival de copa (sin rivalId) también lo dice");
      /* el escalón local ya no muestra un guión mudo */
      E.fed=E.fed||{}; E.fed.presidente=true;
      var cu=el("div"); panelEscalera(cu);
      t(cu.textContent.indexOf("✓")>=0,"el escalón conquistado se marca con ✓");
    },"Pulido");

    grupo("Modo desarrollador · Doctor 7.9021");
    safe(function(){
      t(typeof devDoctor==="function","devDoctor existe");
      t(typeof devDoctorRegistrar==="function","se le pueden registrar chequeos nuevos");
      t(typeof devPintarDoctor==="function","tiene cara (pestaña 🩺)");
      t(typeof devDoctorTexto==="function","exporta informe en texto");
      t(typeof devSimularYRevisar==="function","puede simular y revisar");
      t(DOCTOR_CHECKS.length>=12,"hay "+DOCTOR_CHECKS.length+" chequeos registrados");
      ["motor","simulacion","contenido","interfaz"].forEach(function(a){
        t(DOCTOR_CHECKS.some(function(c){ return c.area===a; }),"cubre el área "+a);
      });
      nuevaPartida("CC",2026,"historico");
      for(var i=0;i<6;i++){ var p=proximoPartido(); if(!p) break;
        var P=iniciarPartido(p,"simular"); correrHasta(P,90); terminarPartido(P); }
      var r=devDoctor({soloRapidos:true});
      t(r.total>0 && r.ok+r.mal===r.total,"corre y suma bien ("+r.ok+"/"+r.total+")");
      t(["sano","con detalles","roto"].indexOf(r.veredicto)>=0,"da un veredicto ("+r.veredicto+")");
      /* OJO: el área "contenido" NO se puede exigir limpia acá. Los grupos de
         arriba clonan una liga de prueba y esos clones entran al informe global
         como clubes pobres. El doctor mide bien; es la sesión de tests la que
         está poblada. Se exige limpieza en motor, que es lo que este grupo prueba. */
      var rm=devDoctor({area:"motor"});
      t(rm.mal===0,"la partida de prueba sale sana en MOTOR"+(rm.mal?(" — falla: "+rm.checks.filter(function(c){return !c.ok;}).map(function(c){return c.n+": "+c.txt;}).join(" | ")):""));
      /* los invariantes tienen que CAZAR una tabla rota, no solo aprobar */
      var snap=clonarPartida(E);
      E.tabla[E.club].pts=E.tabla[E.club].pts+7;   /* puntos que no corresponden */
      var r2=devDoctor({area:"motor"});
      t(r2.mal>0,"el doctor caza una tabla adulterada");
      t(r2.checks.some(function(c){ return c.id==="tabla_coherente" && !c.ok; }),"y dice cuál invariante se rompió");
      restaurarPartida(snap);
      var r3=devDoctor({area:"motor"});
      t(r3.mal===0,"tras restaurar, vuelve a estar sano");
      /* el informe en texto sirve para pegar */
      var txt=devDoctorTexto(r3);
      t(txt.indexOf("FUTBOLINI · DOCTOR")===0 && txt.length>80,"el informe en texto se arma");
      /* no puede destruir la partida del jugador */
      var club=E.club, anio=E.anio;
      devSimularYRevisar(1);
      t(E.club===club && E.anio===anio,"simular y revisar NO altera la partida abierta");
    },"Doctor");

    grupo("Copas del país que se ven venir · 7.9022");
    safe(function(){
      /* bug reportado por el autor, verificado a 390px reales con Playwright:
         panelCopasPais solo dibujaba lo YA jugado (20 filas, 0 con "—"), y
         los sub-paneles "Grupo X" dibujaban la tabla pero CERO partidos. */
      t(typeof copaGrupoFixture==="function","copaGrupoFixture existe");
      t(typeof copasPaisProximos==="function","copasPaisProximos existe");
      t(typeof copasPaisConPendientes==="function","copasPaisConPendientes existe");
      /* 7.9035 · ya no hay captura aparte: el universo único guarda cada resultado en g.res */
      t(String(copaGrupoFixture).indexOf("g.res")>=0 && String(copaGrupoFixture).indexOf("_real")<0,"copaGrupoFixture lee el registro único (g.res), sin copias capturadas");
      nuevaPartida("COQ",2026,"historico");   /* COQ: Copa Chile grupo A */
      if(typeof mundoInit==="function") mundoInit();
      for(var i=0;i<3;i++){
        var p=proximoPartido(); if(!p) break;
        var P=iniciarPartido(p,"simular"); correrHasta(P,90); terminarPartido(P);
      }
      var ch=E.mundo&&E.mundo.copas&&E.mundo.copas.chile;
      t(ch&&ch.grupos&&Object.keys(ch.grupos).length===8,"Copa Chile arranca con 8 grupos");
      var letraA=null; Object.keys(ch.grupos).forEach(function(L){ if((ch.grupos[L].ids||[]).indexOf("COQ")>=0) letraA=L; });
      var fx=copaGrupoFixture("chile",letraA);
      /* 4 equipos, ida y vuelta: C(4,2)=6 duelos × 2 = 12 partidos totales del grupo */
      t(fx.filas.length===12,"un grupo de 4 tiene 12 partidos (ida+vuelta) — dio "+fx.filas.length);
      t(fx.filas.filter(function(f){ return f.mia; }).length===6,"de esos, 6 son míos (3 rivales × ida y vuelta)");
      t(fx.filas.some(function(f){ return f.jugado; }),"al menos un partido ya jugado, con marcador real");
      t(fx.filas.some(function(f){ return !f.jugado; }),"al menos un partido sin jugar (será \"—\" en pantalla)");
      t(fx.filas.some(function(f){ return f.mia; }),"reconoce cuáles partidos son los míos");
      /* mis partidos jugados en la fixture tienen que calzar con mi calendario real:
         ida y vuelta contra el mismo rival NO se pueden contar como el mismo partido */
      var miosCal=(E.calendario||[]).filter(function(x){ return x.tipo==="copa"&&x.torneo==="Copa Chile"&&x.jugado; });
      var miosFix=fx.filas.filter(function(f){ return f.mia&&f.jugado; });
      t(miosFix.length===miosCal.length,"mis resultados de la fixture calzan con mi calendario, sin doble conteo ("+miosFix.length+"="+miosCal.length+")");
      /* lo que aún no se jugó, en NINGÚN caso trae marcador inventado */
      t(fx.filas.every(function(f){ return f.jugado || (f.ga===null&&f.gb===null); }),"nada sin jugar trae marcador (nada inventado)");
      var prox=copasPaisProximos(20);
      t(prox.length>0,"hay cruces pendientes listados para el país ("+prox.length+")");
      t(prox.every(function(x){ return x.a&&x.b&&x.liga; }),"cada cruce trae rival y torneo, listo para pintar con \"—\"");
      t(copasPaisConPendientes()===true,"copasPaisConPendientes detecta que faltan partidos");
      /* el doctor tiene que estar al tanto de este arreglo */
      ["copas_proximos","copas_grupo_partidos"].forEach(function(id){
        t(DOCTOR_CHECKS.some(function(c){ return c.id===id; }),"el Doctor registra "+id);
      });
      var rd=devDoctor({area:"interfaz"});
      t(rd.checks.filter(function(c){ return c.id==="copas_proximos"||c.id==="copas_grupo_partidos"; }).every(function(c){ return c.ok; }),
        "ambos chequeos de copas salen sanos con esta partida");
    },"Copas vivas");

    grupo("Avance rápido que se ve · 7.9022");
    safe(function(){
      /* pedido del autor: "mejora las que hay fuera (las originales), que no
         se ralentice, se pueda ver incluso" — fecha a fecha, no solo el año. */
      t(typeof avanzarRapidoLote==="function","avanzarRapidoLote existe (versión por lotes de avanzarRapido)");
      t(avanzarRapidoLote.toString().indexOf("setTimeout")>=0,"cede el hilo entre lotes (no bloquea la UI)");
      t(typeof avanzarRapido==="function","avanzarRapido original sigue intacto (lo usan los botones de 1 fecha)");
      t(typeof _simTextoProgreso==="function","_simTextoProgreso existe (misma función que pinta el overlay real)");
      var txt=_simTextoProgreso({temp:2,tope:5,anio:2027,club:"Club de Prueba",fecha:8,totFechas:30,pos:3,campeonAnterior:"Otro Club (60 pts)"});
      t(txt.indexOf("8")>=0 && txt.indexOf("30")>=0,"el overlay muestra la fecha (8/30)");
      t(txt.indexOf(ordinal(3))>=0,"el overlay muestra la posición real");
      t(txt.indexOf("Otro Club")>=0,"el overlay muestra el campeón del año que acaba de cerrar");
      var txtSinDatos=_simTextoProgreso({temp:1,tope:5,anio:2026,club:"Club"});
      t(txtSinDatos.indexOf("Temporada")>=0,"sin datos de fecha/posición igual arma el texto base (no rompe)");
      t(DOCTOR_CHECKS.some(function(c){ return c.id==="sim_progreso_visible"; }),"el Doctor registra sim_progreso_visible");
      var rd=devDoctor({area:"interfaz"});
      t(rd.checks.find(function(c){ return c.id==="sim_progreso_visible"; }).ok,"el chequeo sale sano");
      /* función avanzarRapidoLote real: corre un lote y llama onListo (síncrono
         hasta el primer setTimeout, que en este entorno de test se puede
         inspeccionar sin esperar: alcanza con que no explote al armarse). */
      nuevaPartida("CC",2026,"historico");
      var err=null;
      try{ avanzarRapidoLote(function(){}, function(){}); }catch(e){ err=e; }
      t(!err,"avanzarRapidoLote arranca sin explotar"+(err?(" — "+err.message):""));
      E._bulkCancel=true;   /* corta el lote programado (setTimeout) para no dejarlo corriendo suelto tras el test */
    },"Avance visible");

    grupo("Calendario que no se pega · 7.9025");
    safe(function(){
      t(typeof _jorSaltarJugados==="function","existe la red _jorSaltarJugados");
      t(DOCTOR_CHECKS.some(function(c){ return c.id==="idx_no_pegado"; }),"el doctor tiene el chequeo idx_no_pegado");
      nuevaPartida("CC",2026,"historico");
      /* el caso real: una inserción ordenada deja un partido YA jugado justo después */
      var i0=E.idx;
      E.calendario[i0+1].jugado=true; E.calendario[i0+1].gf=1; E.calendario[i0+1].gc=0;
      var chk=DOCTOR_CHECKS.filter(function(c){ return c.id==="idx_no_pegado"; })[0];
      t(!chk.fn().ok,"AL REVÉS: el doctor detecta el partido jugado mal ordenado");
      var P=iniciarPartido(proximoPartido(),"simular"); correrHasta(P,90); terminarPartido(P);
      t(E.idx===i0+2,"tras jugar, el índice salta el ya jugado ("+i0+" → "+E.idx+")");
      t(!proximoPartido()||!proximoPartido().jugado,"el próximo partido NO está jugado");
      t(chk.fn().ok,"y el doctor vuelve a dar sano");
      /* forzado directo: índice clavado en un jugado */
      E.calendario[E.idx].jugado=true;
      t(!chk.fn().ok,"el doctor caza un índice clavado en un partido jugado");
      _jorSaltarJugados();
      t(chk.fn().ok,"la red lo destraba");
    },"Calendario pegado");

    grupo("Economía en escala · 7.9025");
    safe(function(){
      var chk=DOCTOR_CHECKS.filter(function(c){ return c.id==="precios_entrada"; })[0];
      t(!!chk,"el doctor tiene el chequeo de precios de entrada");
      t(chk.fn().ok,"hoy todos los precios están en escala");
      /* AL REVÉS: el precio que tenía la Bombonera tiene que saltar */
      var sec=ESTADIOS_DATA.BOC.sectores[0], viejo=sec.precio;
      sec.precio=360000;
      t(!chk.fn().ok,"el doctor caza la popular de Boca a 360.000");
      sec.precio=viejo;
      t(chk.fn().ok,"y vuelve a sano al restaurar");
      nuevaPartida("CC",2026,"historico"); var tcc=taquilla({tipo:"liga",local:true}).ingreso;
      nuevaPartida("BOC",2026,"historico",{categoria:"ARG"}); var tbo=taquilla({tipo:"liga",local:true}).ingreso;
      t(tbo<tcc*4,"la taquilla de Boca ya no es 60× la de Colo-Colo ("+tbo+" vs "+tcc+")");
      var ctq=DOCTOR_CHECKS.filter(function(c){ return c.id==="taquilla_escala"; })[0];
      t(ctq&&ctq.fn().ok,"el chequeo de taquilla da sano con Boca");
    },"Economía");

    grupo("Celu prolijo · 7.9033");
    safe(function(){
      nuevaPartida("UCH",2026,"historico");
      var frase=resolverTokens("no quiere infiltrar al {IDOLO}",E);
      t(!/ al [A-Z]/.test(frase),"sin 'al' delante del nombre completo: «"+frase+"»");
      t(/^Tu ayudante/.test(T("dec_elige","")),"la sugerencia dice de quién es (tu ayudante)");
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="celu_prolijo"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor celu_prolijo: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
    },"Celu 7.9033");

    grupo("Vida visible: retrato, plata, historia · 7.9033");
    safe(function(){
      nuevaPartida("UCH",2026,"historico");
      t(E.perfil.avatar==="retrato","partida nueva arranca con el retrato del DT");
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="vida_visible"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor vida_visible: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
      E.perfil.genero="F"; E.perfil.bienestar=70; E.temporada.sinGanar=0; E.ind.riesgo=10;
      t(/Cansada|entera|reconoces/.test(espejoDT()),"el espejo respeta el género ("+espejoDT()+")");
      E.perfil.avatar="algo-raro"; normalizarEstado();
      t(E.perfil.avatar==="retrato","un avatar desconocido cae al retrato, no a un orbe");
      var arr=_lineaHistoriaPropia(_idHistoriaClub()), ok=true; for(var i=1;i<arr.length;i++) if(arr[i].anio<arr[i-1].anio) ok=false;
      t(ok,"la historia del club sale en orden cronológico");
      /* la plata se siente */
      render(); aplicarEfectos({plata:-250}); render();
      var chip=[].slice.call(document.querySelectorAll("#barraDatos .bd")).filter(function(x){ return /caja/i.test(x.textContent); })[0];
      t(chip&&chip.classList.contains("vida-baja")&&/−/.test(chip.textContent),"perder plata destella en rojo con el −$ en la barra");
      ["esp_roto","esp_normal","esp_normal_f"].forEach(function(k){ t(FRASES.neutro[k]&&FRASES.en[k]&&FRASES.pt[k],"clave "+k+" en neutro/en/pt"); });
    },"Vida 7.9033");

    grupo("Legibilidad sin perder el vidrio · 7.9032");
    safe(function(){
      var tema0=document.body.dataset.tema; document.body.dataset.tema="aero"; document.body.setAttribute("data-tema","aero");
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="legibilidad_ui"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor legibilidad_ui: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
      var st=document.createElement("style"); st.textContent='body[data-tema="aero"] .btn-aqua.verde{background:linear-gradient(rgba(255,255,255,.85),#2a2) !important}';
      document.head.appendChild(st); t(!c.fn().ok,"el doctor caza el brillo blanco al 85% (el bug viejo)"); st.remove();
      document.body.dataset.tema=tema0||"aero"; document.body.setAttribute("data-tema",tema0||"aero");
    },"Legibilidad 7.9032");

    grupo("Calendario vivo y repeticiones honestas · 7.9030");
    safe(function(){
      nuevaPartida("UCH",2026,"historico"); mundoInit(); E._bulkSim=true;
      for(var i=0;i<3;i++){ var pp=proximoPartido(); if(!pp) break; if(pp.jugado){ procesarSemanaRapido(); continue; } var P=iniciarPartido(pp,"simular"); correrHasta(P,90); terminarPartido(P); procesarSemanaRapido(); }
      E._bulkSim=false;
      var fila=mundoFilasLiga(_ligaKeyJugador()).filter(function(f){ return f.id===E.club; })[0];
      t(fila&&fila.pj===E.tabla[E.club].pj&&fila.pj>0,"tras avance masivo, el Calendario muestra tus PJ reales ("+(fila&&fila.pj)+")");
      var jug=E.calendario.filter(function(p){ return p.jugado&&p.tipo!=="amistoso"; })[0];
      t(jug&&(!jug.stats||!statsReales(jug.stats)),"un partido simulado no tiene estadísticas reales");
      modalRepeticion(jug);
      t(!document.querySelector("#capa-modal .stat-part"),"y la repetición no muestra el bloque en cero");
      cerrarModal();
      t(jug&&(jug.lineas||[]).length>5,"la repetición trae relato");
      t(_nomCortoStats("UCH","Universidad de Chile")==="U. de Chile","la posesión dice 'U. de Chile', no 'Chile'");
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="calendario_vivo"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor calendario_vivo: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
      var mr=modalRepeticion; modalRepeticion=function(){ /* sin filtro */ };
      t(!c.fn().ok,"el doctor caza una repetición que no filtra las stats en cero"); modalRepeticion=mr;
    },"Calendario 7.9030");

    grupo("Se juega sin internet · 7.9030");
    safe(function(){
      t(typeof offlineRegistrar==="function"&&typeof panelOffline==="function","offline.js cargado");
      t(!!document.querySelector('link[rel=manifest]'),"manifiesto para instalar como app");
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="offline_listo"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor offline_listo: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
      var s0=document.querySelector('script[src*="?v="]'), src0=s0&&s0.getAttribute("src");
      if(s0){ s0.setAttribute("src",src0.replace(/\?v=.*/,"?v=0.0001")); var r2=c.fn(); t(!r2.ok,"el doctor caza un ?v= viejo"); s0.setAttribute("src",src0); }
      ["off_tit","off_ok","off_txt","off_cayo"].forEach(function(k){ t(FRASES.neutro[k]&&FRASES.en[k]&&FRASES.pt[k],"clave "+k+" en neutro/en/pt"); });
      nuevaPartida("CC",2026,"historico"); abrirAjustes();
      t(!!document.querySelector(".ajustes-cuerpo .offline-caja"),"Ajustes muestra el panel Jugar sin internet");
      cerrarModal();
    },"Offline 7.9030");

    grupo("Equilibrio: fuerza, sueldos y motor · 7.9029");
    safe(function(){
      nuevaPartida("CC",2026,"historico");
      t(E._fuerzaV===2,"partida nueva usa la escala de fuerza 1:1");
      var fz=fuerzaEquipo(onceIdeal()), ef=(fz.ataque+fz.orden)/2;
      t(Math.abs(ef-fuerzaTablaPropia())<=2,"Colo-Colo rinde lo que dice la tabla ("+Math.round(ef)+" vs "+fuerzaTablaPropia()+")");
      var fCC=E.factorMercado;
      nuevaPartida("LIM",2026,"historico");
      var fz2=fuerzaEquipo(onceIdeal()), ef2=(fz2.ataque+fz2.orden)/2;
      t(Math.abs(ef2-fuerzaTablaPropia())<=2,"Limache rinde lo que dice la tabla ("+Math.round(ef2)+" vs "+fuerzaTablaPropia()+")");
      t(fCC>E.factorMercado,"el mercado de sueldos de Colo-Colo ("+fCC+") es más caro que el de Limache ("+E.factorMercado+")");
      /* una partida vieja (sin _fuerzaV) conserva la fórmula de antes */
      var n0=E._fuerzaV; delete E._fuerzaV;
      var viejo=fuerzaEquipo(onceIdeal()).base; E._fuerzaV=n0;
      var nuevo=fuerzaEquipo(onceIdeal()).base;
      t(Math.abs(viejo-nuevo)>0.5,"las partidas viejas no cambian de fórmula de golpe");
      t(typeof MOTOR_AJUSTE==="object"&&MOTOR_AJUSTE.s>0&&MOTOR_AJUSTE.s<1,"el ajuste del motor es un par de números medidos");
      ["fuerza_calibrada","economia_escala","motor_vs_ia"].forEach(function(id){
        var c=DOCTOR_CHECKS.filter(function(x){ return x.id===id; })[0];
        var r=c&&c.fn();
        t(r&&r.ok,"doctor "+id+": "+(r&&r.txt));
      });
      t(typeof devEconomiaClubes==="function"&&typeof devCalibrarMotor==="function","radiografía económica y calibrador del motor en el modo dev");
    },"Equilibrio 7.9029");

    grupo("Ajustes es una ventana · 7.9027");
    safe(function(){
      nuevaPartida("CC",2026,"historico"); SEC="escritorio"; render();
      t(typeof abrirAjustes==="function","existe abrirAjustes");
      abrirAjustes();
      t(!!document.querySelector("#capa-modal .ajustes-ventana"),"⚙️ abre una ventana, no reemplaza el juego");
      t(SEC==="escritorio","la sección de fondo no cambia");
      t(ajustesAbiertos() && !!document.querySelector(".ajustes-cuerpo .panel"),"los paneles se pintan adentro de la ventana");
      render();
      t(ajustesAbiertos(),"un render() no la cierra: se repinta");
      irA("ajustes");
      t(SEC!=="ajustes" && ajustesAbiertos(),"irA('ajustes') (menú Más) también abre la ventana");
      cerrarModal();
      var chk=DOCTOR_CHECKS.filter(function(c){ return c.id==="ajustes_ventana"; })[0];
      var r=chk&&chk.fn();
      t(r&&r.ok,"doctor ajustes_ventana: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
      t(typeof devProbarLoginCodigo==="function","la sonda del login por código está en el modo dev");
      t(FRASES.neutro.aj_tit&&FRASES.en.aj_tit&&FRASES.pt.aj_tit,"clave aj_tit en neutro/en/pt");
    },"Ajustes ventana 7.9027");

    grupo("El arco se ve como un arco · 7.9027");
    safe(function(){
      var chk=DOCTOR_CHECKS.filter(function(c){ return c.id==="arco_arte"; })[0];
      var r=chk&&chk.fn();
      t(r&&r.ok,"doctor arco_arte: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
      t(FRASES.neutro.arco_apunta&&FRASES.en.arco_apunta&&FRASES.pt.arco_apunta,"clave arco_apunta en neutro/en/pt");
      /* el guante llega en los cuatro rincones cuando ataja */
      [[70,60,"izq"],[70,150,"izq"],[290,60,"der"],[290,150,"der"]].forEach(function(q){
        var aim={cx:q[0],cy:q[1],tercio:q[2],fuera:false};
        var svg=_docArcoSvg(), arq=svg.querySelector("#arco-arq");
        var D=_arqDestino(arq,q[2],{aim:aim,ataja:true});
        _arqPose(arq, D.x0+D.dx, D.y0+D.dy, D.esc, D.rot, D.brazo);
        var c=svg.querySelector(q[2]==="izq"?"#arco-mano-izq":"#arco-mano-der").getCTM();
        svg.remove();
        var dist=Math.hypot(c.e-q[0],c.f-q[1]);
        t(dist<12,"rincón "+q[2]+" "+(q[1]<100?"alto":"bajo")+": el guante llega (a "+Math.round(dist)+")");
      });
      /* la escena real: no hay un svg que recorte y el botón explica qué falta */
      nuevaPartida("CC",2026,"historico");
      var once=(E.plantel||[]).filter(function(j){ return j&&j.pos!=="ARQ"; }).slice(0,11);
      P_ACTUAL={modo:"dirigir", once:once, rivalPlantel:[{n:"Arquero rival",pos:"ARQ",nivel:72}], part:{rivalId:"UCH",local:true,sede:"Monumental"}, min:44, goleadores:[], gl:0,gv:0, lineas:[], iner:{cor:0}};
      minijuegoPenal(P_ACTUAL, once[0], {cands:once.slice(0,3)});
      var svg2=document.querySelector("#capa-modal .e3d-svg");
      t(svg2&&svg2.getAttribute("preserveAspectRatio").indexOf("slice")<0,"la cámara no recorta los palos");
      var b=[].slice.call(document.querySelectorAll("#capa-modal .so-pie button")).filter(function(x){ return x.disabled; })[0];
      t(b&&b.textContent===T("arco_apunta","Tocá el arco para apuntar"),"¡Patear! apagado dice qué hacer");
      cerrarModal(); P_ACTUAL=null;
    },"Arco 7.9027");

    grupo("La semana se cierra también al simular · 7.9026");
    safe(function(){
      t(typeof _salirSemanaSimulada==="function","existe _salirSemanaSimulada");
      nuevaPartida("CC",2026,"historico");
      var part=proximoPartido(), idx0=E.idx;
      var dec0=(E.decPend||[]).length, dia0=E.plata;
      /* se simula por la UI real: el modal de resultado y su botón de salida */
      simularDesdeAvance(part);
      var bs=[].slice.call(document.querySelectorAll("#capa-modal button"));
      var salir=bs.filter(function(b){ return /escritorio/i.test(b.textContent||""); })[0];
      t(!!salir,"el modal de resultado tiene salida al escritorio");
      if(salir) salir.click();
      t(part._semanaOk===true,"al salir, la semana del partido simulado quedó procesada");
      /* no se cobra dos veces */
      var antes=E.plata; _salirSemanaSimulada(part);
      t(E.plata===antes,"volver a salir no procesa la semana de nuevo");
      cerrarModal();
      /* calibración */
      var chk=DOCTOR_CHECKS.filter(function(c){ return c.id==="taquilla_vs_costos"; })[0];
      t(chk&&chk.fn().ok,"la taquilla ya no aplasta a los costos: "+(chk&&chk.fn().txt));
      t(typeof FACTOR_TAQUILLA==="number" && FACTOR_TAQUILLA>0 && FACTOR_TAQUILLA<1,"la calibración es un solo número ("+FACTOR_TAQUILLA+")");
    },"Semana simulada");

    grupo("Localización 7.9013");
    safe(function(){
      ["mep_solo","riv_racha","riv_sin","riv_puesto","cal_prog","cal_sig",
       "fed_escalera","fed_guerra","fed_cupos","fed_sin","fed_subiste","riv_otra"].forEach(function(k){
        t(FRASES.neutro[k] && FRASES.en[k] && FRASES.pt[k], "clave "+k+" está en neutro/en/pt");
      });
    },"i18n 7.9013");

    grupo("Grok 7.9024 escena 3d (penal en la cancha)");
    safe(function(){
      t(typeof _abrirEscenaArco==="function","_abrirEscenaArco existe");
      t(typeof minijuegoPenal==="function" && String(minijuegoPenal).indexOf("_abrirEscenaArco")>=0,"el penal abre la escena");
      t(typeof minijuegoTiroLibre==="function" && String(minijuegoTiroLibre).indexOf("_abrirEscenaArco")>=0,"el tiro libre abre la escena");
      t(typeof minijuegoCorner==="function" && String(minijuegoCorner).indexOf("_abrirEscenaArco")>=0,"el córner abre la escena");
      t(DOCTOR_CHECKS.some(function(c){ return c.id==="arco_escena_3d"; }),"el Doctor registra arco_escena_3d");
      var rd=devDoctor({area:"interfaz"});
      var chk=rd.checks.find(function(c){ return c.id==="arco_escena_3d"; });
      t(chk && chk.ok, "el chequeo del penal sale sano"+(chk&&!chk.ok?(" — "+chk.txt):""));
    },"escena 3d");

    grupo("Un solo universo · 7.9035 (liguilla, ascensos, copas)");
    safe(function(){
      /* el bug del autor con Rangers: 3° de la B, la liguilla no lo dejó seguir, subió
         otro "nada que ver" y el Calendario mostraba a los que subieron de nuevo en la B */
      nuevaPartida("RAN",2026,"historico");
      t(E.mundo&&E.mundo.ver===2,"la partida arranca con el registro único (ver 2)");
      t(!!E.mundoSemilla,"la partida tiene su propia semilla de país");
      var guard=0, forzado=false;
      while(proximoPartido() && guard++<200){
        var pp=proximoPartido();
        if(pp.jugado){ procesarSemanaRapido(); continue; }
        var rest=E.calendario.filter(function(x){ return x.tipo==="liga"&&!x.fase&&!x.jugado; }).length;
        if(!forzado && rest===1 && pp.tipo==="liga"){
          var tab=tablaOrdenada(), obj=tab[4], yo=E.tabla[E.club];   /* 5° antes de la última: cae en cuartos */
          if(obj.id!==E.club){ var tmp=Object.assign({},yo); Object.assign(yo,E.tabla[obj.id]); Object.assign(E.tabla[obj.id],tmp); }
          forzado=true;
        }
        /* la liga con Modo Dios: sin eso, a veces una racha mala termina en moción de censura a
           mitad de año y el test pierde el club (no es lo que se prueba acá) */
        var P=iniciarPartido(pp,"simular"); if(pp.tipo==="liga"&&!forzado) P.diosForzar=true; correrHasta(P,90); terminarPartido(P); procesarSemanaRapido();
      }
      t(E.club==="RAN" && !E.carrera.enParo,"sigues en Rangers al final del año");
      var lb=E.mundo.ligB;
      t(!!lb,"al terminar la fase regular existe el cuadro de la liguilla");
      var pos=E.flags.ligaBPos;
      var liguilla=E.calendario.filter(function(x){ return x.torneo==="Liguilla de Ascenso"; });
      if(pos>=3&&pos<=8){
        var cruce={3:8,4:7,5:6,6:5,7:4,8:3}[pos];
        t(liguilla.length>=2 && liguilla[0].rivalId===lb.tabla[cruce-1],"tus cuartos son contra el "+cruce+"° ("+(liguilla[0]&&liguilla[0].rivalId)+")");
      }
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="universo_copas_jugador"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor universo_copas_jugador: "+(r&&r.txt)+" "+(r&&r.detalle.slice(0,3).join(" · ")));
      var c2=DOCTOR_CHECKS.filter(function(x){ return x.id==="universo_liguilla"; })[0], r2=c2&&c2.fn();
      t(r2&&r2.ok,"doctor universo_liguilla antes del cierre: "+(r2&&r2.txt));
      finDeTemporada();
      t(!!lb.campeon,"el cierre juega la liguilla entera (campeón: "+lb.campeon+")");
      var suben=(E.ascensoMsg&&E.ascensoMsg.suben)||[];
      t(suben.indexOf(lb.campeon)>=0,"sube el que GANÓ la liguilla ("+lb.campeon+" ∈ "+suben.join(",")+")");
      t(E.ligaMod[2026].indexOf(lb.campeon)>=0,"el campeón de la liguilla quedó en Primera");
      r2=c2.fn(); t(r2.ok,"doctor universo_liguilla después del cierre: "+r2.txt);
      /* al revés: si el campeón no hubiera subido, el Doctor lo caza */
      var real=lb.campeon, otroB=E.ligaMod["2026b"].filter(function(id){ return id!==E.club; })[0];
      lb.campeon=otroB; t(!c2.fn().ok,"el Doctor caza un campeón de liguilla que no subió"); lb.campeon=real;
      nuevoAnio();
      var M=E.mundo.ligas;
      t(_docMismo(M["2026"].ids,E.ligaMod[2026]),"el año siguiente, la Primera del Calendario = la Primera vigente");
      t(_docMismo(M["2026b"].ids,E.ligaMod["2026b"]),"y la B del Calendario = la B vigente (los que subieron no aparecen de nuevo en la B)");
      var c3=DOCTOR_CHECKS.filter(function(x){ return x.id==="universo_ligas"; })[0], r3=c3&&c3.fn();
      t(r3&&r3.ok,"doctor universo_ligas: "+(r3&&r3.txt)+" "+(r3&&r3.detalle.join(" · ")));
      var id0=M["2026"].ids[0]; M["2026"].ids[0]="ZZZ";
      t(!c3.fn().ok,"el Doctor caza un Calendario que no calza con la división vigente (el bug viejo)"); M["2026"].ids[0]=id0;
      /* 2027: tu grupo de Copa Chile es EL del país, con tu fixture */
      var gcc=mundoGrupoDe("chile",E.club,E.anio);
      var mios=E.calendario.filter(function(x){ return x.torneo==="Copa Chile"&&/^Grupo /.test(x.ronda||""); });
      t(gcc && mios.length===6 && mios.every(function(x){ return gcc.ids.indexOf(x.rivalId)>=0 && x.ronda==="Grupo "+gcc.letra; }),"Copa Chile "+E.anio+": tus 6 partidos son contra tu grupo del sorteo del país ("+(gcc&&gcc.letra)+")");
      var gU=E.mundo.copas.chile.grupos[gcc.letra];
      t(gU&&gU.derivado,"y el fixture del grupo sale de tu calendario (mismas fechas y localía)");
      /* el partido salteado: Rangers clasificaba a octavos de Copa Chile el 12/8 y el partido
         de liga del 17/8 quedaba sin jugar para siempre (idx++ después de insertar la llave) */
      var cs=DOCTOR_CHECKS.filter(function(x){ return x.id==="calendario_sin_saltos"; })[0];
      t(cs&&cs.fn().ok,"doctor calendario_sin_saltos: "+(cs&&cs.fn().txt));
      var viejoIns=_insertarYOrdenar;
      _insertarYOrdenar=function(nuevos){
        var actual=E.calendario[E.idx]; nuevos.forEach(function(p){ E.calendario.push(p); });
        E.calendario.sort(function(a,b){ return ordenFecha(a.f)-ordenFecha(b.f); });
        if(actual&&!actual.jugado){ E.idx=E.calendario.indexOf(actual); }
        else { for(var j=0;j<E.calendario.length;j++) if(!E.calendario[j].jugado){ E.idx=j; break; } }
      };
      t(!cs.fn().ok,"el Doctor caza la regla vieja que se salteaba un partido");
      _insertarYOrdenar=viejoIns;
    },"Universo Rangers");
    safe(function(){
      /* Copa de la Liga con la U: antes decía 0 PJ y eliminaba del grupo que ganaste */
      nuevaPartida("UCH",2026,"historico");
      var guard=0;
      while(proximoPartido() && guard++<200){
        var pp=proximoPartido();
        if(pp.jugado){ procesarSemanaRapido(); continue; }
        if(pp.torneo==="Copa de la Liga"&&!/^Grupo/.test(pp.ronda||"")) break;
        var P=iniciarPartido(pp,"simular"); P.diosForzar=true; correrHasta(P,90); terminarPartido(P); procesarSemanaRapido();
        if(E.calendario.filter(function(x){ return x.torneo==="Copa de la Liga"&&x.jugado; }).length>=6) break;
      }
      var letra=(grupoCopaLigaDe("UCH",2026)||{}).letra;
      var fila=mundoFilasCopa("copaLiga",letra).filter(function(f){ return f.id==="UCH"; })[0];
      t(fila&&fila.pj===6&&fila.pts===18,"tu grupo de Copa de la Liga cuenta tus 6 partidos ("+(fila&&fila.pj)+" PJ, "+(fila&&fila.pts)+" pts)");
      var semi=E.calendario.filter(function(x){ return x.torneo==="Copa de la Liga"&&x.ronda==="Semifinal"; });
      var pareja=COPA_LIGA_PAREJA[letra], primero=mundoFilasCopa("copaLiga",pareja)[0];
      t(semi.length===2 && semi[0].rivalId===primero.id,"tu semi es contra el 1° REAL del grupo "+pareja+" ("+(semi[0]&&semi[0].rivalId)+" = "+primero.id+")");
      /* la tanda mira el GLOBAL: ida 2-1 a favor y vuelta 0-1 → 2-2 → hay tanda */
      var ida=semi[0], vuelta=semi[1];
      var tt=mundoLlaveJugador("copaLiga","Semifinal");
      var iIda=(ida.local===(tt.a===E.club))?0:1, locIda=iIda===0?tt.a:tt.b;
      tt.legs[iIda]=(locIda===E.club)?{ga:2,gb:1}:{ga:1,gb:2};
      var Pv=iniciarPartido(vuelta,"simular"); Pv.min=90;
      if(vuelta.local){ Pv.gl=0; Pv.gv=1; } else { Pv.gl=1; Pv.gv=0; }
      var d=marcadorDefine(Pv);
      t(d.necesita===true,"ida 2-1 y vuelta 0-1: el global 2-2 manda a penales");
      if(vuelta.local){ Pv.gl=1; Pv.gv=1; } else { Pv.gl=1; Pv.gv=1; }
      t(marcadorDefine(Pv).necesita===false,"ida 2-1 y vuelta 1-1: pasas por global, sin tanda (antes miraba solo la vuelta)");
      t(pideProrroga(vuelta)===false,"Copa de la Liga: empate en el global va directo a penales (sin alargue)");
      tt.legs[iIda]=null;
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="llave_global"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor llave_global: "+(r&&r.txt));
      var md=marcadorDefine; marcadorDefine=function(P){ return md.apply(this,arguments); };
      t(!c.fn().ok,"el Doctor caza una tanda que no mira el global"); marcadorDefine=md;
      /* al revés del registro: si tu partido no está en la tabla del país, el Doctor lo ve */
      var c2=DOCTOR_CHECKS.filter(function(x){ return x.id==="universo_copas_jugador"; })[0];
      t(c2.fn().ok,"doctor universo_copas_jugador sano con la U");
      var g=E.mundo.copas.copaLiga.grupos[letra], k=Object.keys(g.res).filter(function(x){ return x.split("|").indexOf("UCH")>0; })[0], v=g.res[k];
      delete g.res[k]; t(!c2.fn().ok,"el Doctor caza un partido tuyo que no cuenta en el país"); g.res[k]=v;
      /* partida guardada con el registro viejo: se rearma y tus partidos vuelven a contar */
      delete E.mundo.ver; mundoTick(proximoPartido());
      t(E.mundo.ver===2 && c2.fn().ok,"una partida vieja se migra: registro nuevo y tus copas re-anotadas ("+c2.fn().txt+")");
      var fila2=mundoFilasCopa("copaLiga",letra).filter(function(f){ return f.id==="UCH"; })[0];
      t(fila2&&fila2.pj===6,"tras migrar, tu grupo sigue con 6 PJ");
    },"Universo copas");
    safe(function(){
      /* simular varias temporadas es "hasta el final": una crisis se delega, no corta */
      nuevaPartida("CC",2026,"historico");
      t(typeof delegarCrisis==="function","delegarCrisis existe");
      E.ind.riesgo=95;
      var res=simularTemporadas(1);
      t(res.temps===1,"con una crisis encima, simular 1 temporada igual la completa ("+res.temps+", "+(res.freno||"sin freno")+")");
    },"Crisis delegada");
    safe(function(){
      /* "el 1 de NUB" (once probable) y "el 7 de UdeC" (partido) jugando con Rangers */
      nuevaPartida("RAN",2026,"historico");
      var relleno=/^el \d+ de /i;
      t(idClubDe("NUB")==="NUB" && idClubDe("Universidad de Concepción")==="UDC","el rival se encuentra aunque sea de otra división (por id y por nombre)");
      var xi=plantelRival("NUB",70);
      t(xi.length===11 && !xi.some(function(j){ return relleno.test(j.n); }),"Ñublense sale con su once real para Rangers ("+xi[0].n+"…)");
      var xi2=plantelRival("Universidad de Concepción",65);
      t(!xi2.some(function(j){ return relleno.test(j.n); }),"la UdeC por nombre (como la pasa el partido) también");
      var tol=plantelRival("Deportes Tolima",76);
      t(!tol.some(function(j){ return relleno.test(j.n)||j.real; }),"un extranjero sin plantel documentado: once del juego, sin ● ("+tol[0].n+")");
      var apes=tol.map(function(j){ return j.n.split(" ").slice(-1)[0]; });
      t(apes.filter(function(a,i){ return apes.indexOf(a)!==i; }).length===0,"sin apellidos repetidos en el mismo once");
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="rivales_con_nombre"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor rivales_con_nombre: "+(r&&r.txt));
      var pr=plantelRival; plantelRival=function(id){ return ["ARQ","DEF","DEF","DEF","DEF","VOL","VOL","VOL","DEL","DEL","DEL"].map(function(p,i){ return {n:"el "+(i+1)+" de "+id,pos:p}; }); };
      t(!c.fn().ok,"el Doctor caza un once de relleno (el bug viejo)"); plantelRival=pr;
      nuevaPartida("CC",1991,"historico");
      var r91=c.fn(); t(r91.ok,"1991 (sin planteles documentados de muchos rivales): "+r91.txt);
    },"Rivales con nombre");

    grupo("Rendimiento · 7.9037");
    safe(function(){
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="rendimiento_ui"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor rendimiento_ui: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
      var av=_arcoVista;
      _arcoVista=function(svg){ var q=svg.parentNode.getBoundingClientRect(); var H=Math.max(240,Math.min(340,360*q.height/q.width)); svg.setAttribute("viewBox","0 "+(240-H).toFixed(1)+" 360 "+H.toFixed(1)); };
      t(!c.fn().ok,"el Doctor caza la escena que crece (el bug viejo)"); _arcoVista=av;
      nuevaPartida("UCH",2026,"historico");
      var antes=JSON.stringify(E), t0=performance.now(), rc=devCalibrarMotor(30,[0]), ms=performance.now()-t0;
      t(rc&&rc.length===2 && JSON.stringify(E)===antes,"calibrar deja la partida intacta ("+Math.round(ms)+" ms para 60 partidos)");
      t(typeof devCalibrarMotorAsync==="function","hay versión por tandas que no congela la página");
      /* azar sembrado: estable, no idéntico (el relato recuerda frases usadas fuera de la partida) */
      var r2=devCalibrarMotor(60,[0]), r3=devCalibrarMotor(60,[0]);
      var d23=Math.abs(r2[0].ptsMotor-r3[0].ptsMotor)+Math.abs(r2[1].ptsMotor-r3[1].ptsMotor);
      t(d23<0.8,"calibrar da números estables entre corridas (diferencia "+d23.toFixed(2)+" pts)");
    },"Rendimiento");

    grupo("Scroll que no salta · 7.9038");
    safe(function(){
      nuevaPartida("UCH",2026,"historico"); SEC="escritorio"; render();
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="scroll_estable"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor scroll_estable: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
      var rv=render; render=function(){ var v=$("#vista"); v.innerHTML=""; SEC=SEC; };
      t(!c.fn().ok,"el Doctor caza un render que vacía la página (el bug viejo)"); render=rv;
      var pp=proximoPartido(); P_ACTUAL=iniciarPartido(pp,"dirigir"); PAUSADO=true; correrHasta(P_ACTUAL,20); pintarPartido();
      var n0=document.querySelectorAll(".relato .rel").length; pintarPartido();
      t(document.querySelectorAll(".relato .rel").length===n0 && n0>0,"repintar el partido conserva todo el relato ("+n0+" líneas)");
      clearInterval(TIMER); P_ACTUAL=null; PAUSADO=false; render();
    },"Scroll");

    grupo("Pantallas sin duplicados · 7.9039");
    safe(function(){
      nuevaPartida("RAN",2026,"historico"); SEC="escritorio"; render();
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="ui_sin_duplicados"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor ui_sin_duplicados: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
      SECCIONES.push(["avisos","🔔","Avisos"]); t(!c.fn().ok,"el Doctor caza Avisos duplicado en el menú"); SECCIONES.pop();
      t(![].slice.call(document.querySelectorAll("#vista button")).some(function(b){ return b.textContent.trim()==="Ir al partido"; }),"el Escritorio no repite Jugar");
      irA("institucion"); t(!!document.querySelector("#vista .obj"),"las metas están en Institución");
      irA("plantel"); var bc=[].slice.call(document.querySelectorAll("#vista button")).filter(function(b){ return /capitán/.test(b.textContent); })[0];
      t(!!bc,"la charla con el capitán está en Plantel");
      var m0=E.ind.moral; E.flags[_claveCharla()]="probado"; render();
      bc=[].slice.call(document.querySelectorAll("#vista button")).filter(function(b){ return /esta semana/.test(b.textContent); })[0];
      t(bc&&bc.disabled,"después de hablar, no se puede repetir la misma semana");
      t(plata(0.95)==="$950.000" && plata(1.4)==="$1,4 M" && plata(250)==="$250 M","la plata chica se lee en pesos ($950.000, $1,4 M)");
    },"Sin duplicados");

    grupo("El ayudante hace · 7.9040");
    safe(function(){
      nuevaPartida("RAN",2026,"historico");
      for(var i=0;i<4;i++){ var pp=proximoPartido(); if(pp.jugado){ procesarSemanaPostPartido(); continue; } var P=iniciarPartido(pp,"simular"); correrHasta(P,90); terminarPartido(P); procesarSemanaRapido(); }
      /* un club con problemas: moral baja, piernas pesadas, once manual con un lesionado, hinchada caída */
      E.ind.moral=40; E.ind.hinchada=35;
      var once=onceIdeal(); once.slice(0,3).forEach(function(j){ j.cansancio=20; });
      E.tactica.xiManual=once.map(function(j){ return j.n; }); once[5].lesion=2;
      var ids=ayudanteAcciones().map(function(a){ return a.id; });
      ["charla","suave","once","precios"].forEach(function(k){ t(ids.indexOf(k)>=0,"el ayudante ofrece: "+k); });
      var c=DOCTOR_CHECKS.filter(function(x){ return x.id==="ayudante_hace"; })[0], r=c&&c.fn();
      t(r&&r.ok,"doctor ayudante_hace: "+(r&&r.txt)+" "+(r&&r.detalle.join(" · ")));
      var ah=ayudanteHacer; ayudanteHacer=function(){ return "listo"; };
      t(!c.fn().ok,"el Doctor caza un ayudante que dice que hizo pero no hizo"); ayudanteHacer=ah;
      var dec0=(E.decPend||[]).length, m0=E.ind.moral;
      var h=ayudanteHacerTodoSeguro();
      t(h.length>=3,"'Haz todo lo seguro' resolvió "+h.length+" cosas");
      t((E.decPend||[]).length<dec0||dec0===0,"las decisiones quedaron resueltas ("+dec0+" → "+(E.decPend||[]).length+")");
      t(E.ind.moral!==m0,"la charla movió la moral ("+m0+" → "+E.ind.moral+")");
      t(!E.tactica.xiManual,"el once manual roto se rearmó");
      t(onceIdeal().every(function(j){ return !(j.lesion>0); }),"sin lesionados en el once");
      t(E.ayudante&&E.ayudante.log.length>=3,"queda registro de lo que hizo");
      SEC="escritorio"; render();
      t(!!document.querySelector("#vista .ay-hace"),"el bloque 'Lo hago yo' está en el Escritorio");
      E.finanzas.delegado=true; E.finanzas.riesgo="prudente"; E.deuda=500; E.plata=colchonTesorero()+200;
      var d0=E.deuda; gestionTesorero();
      t(E.deuda<d0 && E.plata>=colchonTesorero()-5,"Tesorero prudente: abona deuda sin romper el colchón ("+plata(d0)+" → "+plata(E.deuda)+")");
      E.finanzas.riesgo="agresivo"; t(colchonTesorero()<(E.finanzas.riesgo="prudente",colchonTesorero()),"agresivo guarda menos colchón que prudente");
    },"Ayudante");

    grupo("Syntergia · piloto automático · 7.9041");
    safe(function(){
      nuevaPartida("RAN",2026,"historico");
      t(!syntergiaOn(),"arranca apagada");
      E.piloto={on:true};
      for(var i=0;i<3;i++){ var pp=proximoPartido(); if(pp.jugado){ procesarSemanaPostPartido(); continue; } var P=iniciarPartido(pp,"simular"); correrHasta(P,90); terminarPartido(P); procesarSemanaPostPartido(); }
      t((E.decPend||[]).length===0,"con Syntergia encendida no quedan decisiones pendientes ("+(E.decPend||[]).length+")");
      t((E.notifs||[]).some(function(n){ return /Syntergia/.test(n.t||""); })||(E.piloto.semanas||0)>=3,"Syntergia trabaja cada semana (semanas: "+(E.piloto.semanas||0)+")");
      SEC="escritorio"; render();
      t(!!document.querySelector("#vista .syn-box.on"),"el interruptor se ve encendido en el Ayudante");
      E.piloto.on=false; var n0=(E.decPend||[]).length; repartirDecisiones(); var n1=(E.decPend||[]).length; syntergiaTurno();
      t((E.decPend||[]).length===n1,"apagada no toca nada");
    },"Syntergia");

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
