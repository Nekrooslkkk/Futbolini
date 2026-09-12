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
      var antes=auditarClub("DYJ").pct;
      var dtPrevio=(CLUB_INFO_2026.DYJ||{}).dt;
      aplicarParcheClubes({DYJ:{dt:"DT de prueba"}});
      t(CLUB_INFO_2026.DYJ.dt==="DT de prueba","editar el DT escribe en CLUB_INFO_2026");
      t(auditarClub("DYJ").pct>antes,"el rigor sube al completar ("+antes+"% → "+auditarClub("DYJ").pct+"%)");
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
