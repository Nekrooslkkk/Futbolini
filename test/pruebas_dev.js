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

    grupo("Localización 7.9013");
    safe(function(){
      ["mep_solo","riv_racha","riv_sin","riv_puesto","cal_prog","cal_sig",
       "fed_escalera","fed_guerra","fed_cupos","fed_sin","fed_subiste","riv_otra"].forEach(function(k){
        t(FRASES.neutro[k] && FRASES.en[k] && FRASES.pt[k], "clave "+k+" está en neutro/en/pt");
      });
    },"i18n 7.9013");

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
