"use strict";
/* ============================================================
   FUTBOLINI · dev-decisiones.js  (crear DECISIONES PROPIAS rápido)
   El diagnóstico de la pestaña Alma es claro: casi todos los clubes tienen
   poca "decisión propia". Esto lo arregla rápido: un formato copy-paste que
   crea una carta bien formada (con club:"ID"), la mete EN VIVO (la pestaña
   Alma sube al instante) y la exporta a un .js para dejarla permanente.

   Formato (una clave por línea; `op:` se repite 2-3 veces):
     club: UCH
     anio: 2026            (o "siempre")
     buzon: hinchada
     titulo: La barra pide cabezas
     contexto: Tras la derrota, la Garra exige salidas y hay ruido en el CDA.
     op: Bancar al proceso | +tecnico -hinchada
     op: Sacar a un referente | +hinchada -moral
   Efectos tras el "|": +/-<grupo> o +/-<plata|deuda|moral> con magnitud opcional
   (ej: +hinchada:10). Grupos: directorio socios hinchada camarin tecnico prensa
   anfp sponsors comunidad. Sin efecto = neutro.

   Integridad: son cartas de JUEGO (situaciones), no hechos reales inventados.
   No toca el motor: empuja a DECISIONES y punto.
   ============================================================ */
(function(){

  var BUZONES=["institucional","refuerzos","finanzas","camarin","preparacion","hinchada","cantera","prensa","gris"];
  var GRUPOS_OK=["directorio","socios","hinchada","camarin","tecnico","prensa","anfp","sponsors","comunidad"];
  var EF_OK=["plata","deuda","moral","riesgo","prestigio"];

  function _lp(s,max){ return (typeof textoLimpio==="function")?textoLimpio(s,max):String(s==null?"":s).replace(/<[^>]*>/g,"").trim().slice(0,max||200); }

  /* parsea "+hinchada -moral +plata:120" → {grupos:{...}, ef:{...}} */
  function _efectos(txt){
    var g={}, ef={};
    String(txt||"").split(/[,\s]+/).forEach(function(tok){
      tok=tok.trim(); if(!tok) return;
      var m=tok.match(/^([+-])([a-záéíóúñ]+)(?::(\d+))?$/i);
      if(!m) return;
      var signo=(m[1]==="-")?-1:1, k=m[2].toLowerCase(), mag=m[3]?parseInt(m[3],10):null;
      if(GRUPOS_OK.indexOf(k)>=0) g[k]=signo*(mag||6);
      else if(EF_OK.indexOf(k)>=0) ef[k]=signo*(mag||(k==="plata"||k==="deuda"?80:6));
    });
    return {grupos:g, ef:ef};
  }

  function parsearPegarDecision(txt){
    var o={op:[]};
    String(txt||"").split(/\n+/).forEach(function(ln){
      ln=ln.trim(); if(!ln) return;
      var i=ln.indexOf(":"); if(i<0) return;
      var k=ln.slice(0,i).trim().toLowerCase(), v=ln.slice(i+1).trim();
      if(k==="club") o.club=String(v).toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);
      else if(k==="anio"||k==="año") o.anio=(/^\d{4}$/.test(v))?parseInt(v,10):"siempre";
      else if(k==="buzon"||k==="buzón") o.buzon=(BUZONES.indexOf(v.toLowerCase())>=0?v.toLowerCase():"institucional");
      else if(k==="titulo"||k==="título") o.t=_lp(v,80);
      else if(k==="contexto"||k==="desc"||k==="d") o.d=_lp(v,320);
      else if(k==="op"||k==="opcion"||k==="opción"){
        var parts=v.split("|");
        var ef=_efectos(parts[1]||"");
        o.op.push({ t:_lp(parts[0],70), grupos:ef.grupos, ef:ef.ef });
      }
    });
    return o;
  }

  /* arma la decisión final (shape de data-decisiones.js) y valida */
  function _construir(p){
    if(!p.club) return {ok:false, msg:"falta club: ID"};
    if(!p.t) return {ok:false, msg:"falta titulo:"};
    if(!p.op || p.op.length<2) return {ok:false, msg:"faltan al menos 2 op:"};
    var anio=(typeof p.anio==="number")?p.anio:null;
    var id="dev_"+p.club.toLowerCase()+"_"+((typeof DECISIONES!=="undefined"?DECISIONES.length:0))+"_"+Math.floor(Math.random()*1000);
    var op=p.op.slice(0,3).map(function(o){
      var neg={}; Object.keys(o.ef||{}).forEach(function(k){ neg[k]=-Math.abs(o.ef[k]); });
      return {
        t:o.t||"Opción", d:"", dif:45,
        grupos:o.grupos||{},
        bien:{ txt:"Salió bien.", ef:o.ef||{} },
        mitad:{ txt:"Quedó a medias.", ef:{} },
        mal:{ txt:"Salió mal.", ef:neg }
      };
    });
    var dec={ id:id, club:p.club, buzon:p.buzon||"institucional", peso:"medio", mes:(2+Math.floor(Math.random()*8)),
              t:p.t, d:p.d||(p.t+"."), posturas:{}, op:op };
    if(anio) dec.anio=anio;   /* sin anio = aplica en cualquier época del club */
    return {ok:true, dec:dec};
  }

  function crearDecisionDesde(txt){
    var p=parsearPegarDecision(txt);
    var r=_construir(p);
    if(!r.ok) return r;
    try{ if(typeof DECISIONES!=="undefined") DECISIONES.push(r.dec); }catch(e){ return {ok:false, msg:"no se pudo insertar"}; }
    return {ok:true, id:r.dec.id, club:r.dec.club};
  }

  /* exporta TODAS las decisiones dev_ (creadas acá) de un club a un .js */
  function devExportarDecisiones(club){
    var D=(typeof DECISIONES!=="undefined")?DECISIONES:[];
    var mias=D.filter(function(d){ return d && (!club || d.club===club) && /^dev_/.test(d.id||""); });
    if(!mias.length) return "";
    var fecha=new Date().toISOString().slice(0,10);
    return '"use strict";\n'+
      '/* FUTBOLINI · data-decisiones-'+(club||"dev").toLowerCase()+'.js\n'+
      '   Decisiones propias generadas por el editor el '+fecha+'. Cargar tras data-decisiones.js.\n'+
      '   Son cartas de JUEGO — dales sabor real de la historia del club al editarlas. */\n'+
      '(function(){ if(typeof DECISIONES==="undefined") return;\n'+
      '  var nuevas='+JSON.stringify(mias,null,1)+';\n'+
      '  nuevas.forEach(function(d){ if(!DECISIONES.some(function(x){return x.id===d.id;})) DECISIONES.push(d); });\n'+
      '})();\n';
  }

  /* ---------- UI: crear decisión propia (se cuelga en la pestaña Alma) ---------- */
  function devPintarNuevaDecision(cont){
    if(typeof el!=="function") return;
    var sel=(typeof CLUB_SEL!=="undefined" && CLUB_SEL)?CLUB_SEL:"";
    var wrap=el("div","dev-liga-nueva");
    wrap.appendChild(el("h3","dev-h3","➕ Nueva decisión propia"+(sel?(" · "+sel):"")));
    wrap.appendChild(el("p","mini","Le da <b>alma</b> a un club: una carta que solo le pasa a él. Escribe el formato y créala en vivo (la cobertura sube al toque). Efectos tras <code>|</code>: <code>+hinchada -moral +plata:120</code>."));
    var ta=el("textarea","dev-ta"); ta.rows=8;
    ta.value="club: "+(sel||"UCH")+"\nanio: 2026\nbuzon: hinchada\ntitulo: La barra pide cabezas\ncontexto: Tras la derrota, la hinchada exige salidas y hay ruido en el predio.\nop: Bancar el proceso | +tecnico -hinchada\nop: Sacar a un referente | +hinchada -moral -camarin";
    wrap.appendChild(ta);
    var acc=el("div","dev-acc");
    var bCrear=el("button","btn-aqua chico verde","✨ Crear en vivo");
    var bExp=el("button","btn-aqua chico","💾 Exportar .js del club"); bExp.disabled=!sel;
    acc.appendChild(bCrear); acc.appendChild(bExp);
    wrap.appendChild(acc);
    var msg=el("p","mini dev-msg","");
    var salida=el("textarea","dev-ta"); salida.rows=10; salida.readOnly=true; salida.style.display="none";
    wrap.appendChild(msg); wrap.appendChild(salida);
    bCrear.onclick=function(){
      var r=crearDecisionDesde(ta.value);
      if(!r.ok){ msg.textContent="❌ "+r.msg; msg.className="mini dev-msg mal"; return; }
      var n=(typeof auditarContenido==="function")?auditarContenido(r.club).decisiones:"?";
      msg.textContent="✅ Decisión creada para "+r.club+" (ahora tiene "+n+" propias). Vuelve a la vista de arriba para ver el color subir.";
      msg.className="mini dev-msg bien"; bExp.disabled=false;
      if(typeof aviso==="function") aviso("Alma +1 para "+r.club);
    };
    bExp.onclick=function(){
      var txt=devExportarDecisiones(sel);
      if(!txt){ msg.textContent="Este club no tiene decisiones creadas acá todavía."; msg.className="mini dev-msg"; return; }
      salida.value=txt; salida.style.display="block";
      try{ salida.select(); document.execCommand("copy"); if(typeof aviso==="function") aviso("Copiado"); }catch(e){}
      msg.textContent="✅ .js de "+sel+" listo (copiado). Guárdalo en js/ y agrégalo a index.html tras data-decisiones.js.";
      msg.className="mini dev-msg bien";
    };
    cont.appendChild(wrap);
  }

  window.parsearPegarDecision=parsearPegarDecision;
  window.crearDecisionDesde=crearDecisionDesde;
  window.devExportarDecisiones=devExportarDecisiones;
  window.devPintarNuevaDecision=devPintarNuevaDecision;
})();
