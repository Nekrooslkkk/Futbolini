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
      cerrarModal();
    },"Panel");

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
