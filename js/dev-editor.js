"use strict";
/* ============================================================
   FUTBOLINI · dev-editor.js  (motor de edición · parte 3 de 3)
   EL "WORDPRESS" DE FUTBOLINI. Panel para editar clubes y ligas sin abrir
   un solo archivo .js, con medidor de rigor al lado.

   Cómo entrar: Ajustes → Modo desarrollador → clave → "Editor de contenido".

   Cómo funciona (importante):
   - Lo que editas se aplica EN VIVO sobre los mapas del juego y queda
     guardado como PARCHE en localStorage (no toca ningún archivo).
   - Cuando te gusta, "Exportar" te da un .js listo para dejar en js/ y
     cargar en index.html. Eso lo hace permanente y versionable en git.
   - Así nunca se pisa el trabajo de nadie: el parche es aparte.

   Aislado: envuelve vistaAjustes (patrón de epoca-intro.js). Cargar al final.
   ============================================================ */
(function(){
  if(typeof vistaAjustes!=="function" || vistaAjustes._editor8) return;
  var orig=vistaAjustes;
  vistaAjustes=function(){ orig(); try{ _pintarAccesoEditor(); }catch(e){ console.error("editor:",e); } };
  vistaAjustes._editor8=true;

  var LLAVE_PARCHE="futbolini_dev_parche";
  var TAB="rigor", CLUB_SEL=null, LIGA_SEL=null;

  /* ---------- parche persistente ---------- */
  function parcheLeer(){
    try{ var s=localStorage.getItem(LLAVE_PARCHE); return s?JSON.parse(s):{}; }catch(e){ return {}; }
  }
  function parcheGuardar(p){
    try{ localStorage.setItem(LLAVE_PARCHE, JSON.stringify(p)); return true; }catch(e){ return false; }
  }
  function parcheSet(id,campo,valor){
    var p=parcheLeer(); if(!p[id]) p[id]={};
    p[id][campo]=valor; parcheGuardar(p); return p;
  }
  function parcheBorrar(){ try{ localStorage.removeItem(LLAVE_PARCHE); }catch(e){} }
  function parcheCuenta(){
    var p=parcheLeer(), n=0;
    Object.keys(p).forEach(function(id){ n+=Object.keys(p[id]||{}).length; });
    return n;
  }
  /* al cargar la página, re-aplicar lo editado */
  try{
    var p0=parcheLeer();
    if(Object.keys(p0).length && typeof aplicarParcheClubes==="function") aplicarParcheClubes(p0);
  }catch(e){}

  /* ---------- acceso desde Ajustes ---------- */
  function _pintarAccesoEditor(){
    if(typeof devOn!=="function" || !devOn()) return;
    var v=document.getElementById("vista"); if(!v) return;
    if(v.querySelector(".dev-editor-acceso")) return;
    var p=panel("Editor de contenido","🧱","agua");
    p.classList.add("dev-editor-acceso");
    p.cuerpo.appendChild(el("p","mini",
      "Editá clubes, ligas y datos sin tocar archivos. Mide el <b>rigor</b> de cada club contra Colo-Colo y te dice qué falta. Lo editado queda como parche y se exporta a un .js."));
    var n=parcheCuenta();
    if(n) p.cuerpo.appendChild(el("p","mini","Tienes <b>"+n+"</b> campo(s) editados sin exportar."));
    var b=el("button","btn-aqua ancho verde","🧱 Abrir editor");
    b.onclick=function(){ abrirEditorContenido(); };
    p.cuerpo.appendChild(b);
    v.appendChild(p);
  }

  /* ---------- utilidades UI ---------- */
  function barraPct(pct){
    var c = pct>=95?"#2fa84f" : pct>=75?"#d68a1f" : "#c0392b";
    return '<div class="dev-barra"><i style="width:'+pct+'%;background:'+c+'"></i></div>';
  }
  function chip(txt,cls){ return el("span","dev-chip"+(cls?" "+cls:""),txt); }

  /* ---------- el editor ---------- */
  function abrirEditorContenido(){
    modal(function(box){
      box.classList.add("dev-editor");
      box.appendChild(el("div","cab",'<span class="ic">🧱</span><span>Editor de contenido · Futbolini</span>'));
      var c=el("div","cuerpo"); box.appendChild(c);

      var tabs=el("div","fichas dev-tabs");
      [["rigor","📏 Rigor"],["club","🏟️ Club"],["liga","🏆 Liga"],["exportar","💾 Exportar"]].forEach(function(t){
        var b=el("button","ficha",t[1]);
        b.setAttribute("aria-pressed",TAB===t[0]?"true":"false");
        b.onclick=function(){ TAB=t[0]; pintar(); };
        tabs.appendChild(b);
      });

      var cont=el("div","dev-cont");
      function pintar(){
        c.innerHTML=""; c.appendChild(tabs);
        Array.prototype.forEach.call(tabs.children,function(b,i){
          b.setAttribute("aria-pressed",["rigor","club","liga","exportar"][i]===TAB?"true":"false");
        });
        cont.innerHTML=""; c.appendChild(cont);
        if(TAB==="rigor") pintarRigor(cont,pintar);
        else if(TAB==="club") pintarClub(cont,pintar);
        else if(TAB==="liga") pintarLiga(cont,pintar);
        else pintarExportar(cont,pintar);
        var x=el("button","btn-aqua ancho","Cerrar"); x.style.marginTop="10px";
        x.onclick=cerrarModal; c.appendChild(x);
      }
      pintar();
    },{clase:"ancho"});
  }

  /* ---------- pestaña RIGOR ---------- */
  function pintarRigor(cont,repintar){
    cont.appendChild(el("p","mini",
      "Cada club se mide contra <b>"+DEV_CLUB_REF+"</b>: si tiene los mismos campos llenos, va 100%. "+
      "Los datos que <i>a propósito</i> no existen (sin fuente) no cuentan en contra."));
    var todo=auditarTodo();
    todo.forEach(function(r){
      var p=el("div","dev-liga");
      p.appendChild(el("div","dev-liga-cab","<b>"+r.nombre+"</b> <span class='mini'>["+r.era+"] · "+r.clubes+" clubes</span><b class='dev-pct'>"+r.pct+"%</b>"));
      p.innerHTML+=barraPct(r.pct);
      if(r.huecos.length){
        var h=el("div","mini dev-huecos","Huecos: "+r.huecos.slice(0,5).map(function(x){ return x.n+" ("+x.cuantos+")"; }).join(" · "));
        p.appendChild(h);
      }
      var grid=el("div","dev-grid");
      r.fichas.forEach(function(f){
        var b=el("button","dev-club"+(f.pct>=100?" ok":(f.pct>=75?" medio":" mal")));
        b.innerHTML="<b>"+f.id+"</b><span>"+f.pct+"%</span>";
        b.title=f.faltanReq.length?("Falta: "+f.faltanReq.map(function(x){return x.n;}).join(", ")):"Completo";
        b.onclick=function(){ CLUB_SEL=f.id; TAB="club"; repintar(); };
        grid.appendChild(b);
      });
      p.appendChild(grid);
      cont.appendChild(p);
    });
  }

  /* ---------- pestaña CLUB ---------- */
  function pintarClub(cont,repintar){
    /* selector */
    var sel=el("select","dev-select");
    var vistos={};
    devErasLiga().forEach(function(era){
      var og=document.createElement("optgroup");
      og.label=((typeof ERA!=="undefined"&&ERA[era]&&ERA[era].n)||era)+" ["+era+"]";
      devIdsLiga(era).forEach(function(id){
        if(vistos[id]) return; vistos[id]=1;
        var o=document.createElement("option"); o.value=id;
        var a=auditarClub(id);
        o.textContent=id+" · "+((_nombreDe(id))||"")+"  ("+a.pct+"%)";
        og.appendChild(o);
      });
      if(og.children.length) sel.appendChild(og);
    });
    if(!CLUB_SEL) CLUB_SEL=sel.value||"CC";
    sel.value=CLUB_SEL;
    sel.onchange=function(){ CLUB_SEL=sel.value; repintar(); };
    cont.appendChild(sel);

    var a=auditarClub(CLUB_SEL);
    var cab=el("div","dev-club-cab");
    cab.innerHTML="<b>"+(_nombreDe(CLUB_SEL)||CLUB_SEL)+"</b> <span class='mini'>"+CLUB_SEL+"</span> <b class='dev-pct'>"+a.pct+"%</b>"+barraPct(a.pct);
    cont.appendChild(cab);
    if(a.justificados&&a.justificados.length){
      a.justificados.forEach(function(j){
        cont.appendChild(el("p","mini dev-justi","🤍 <b>"+j.n+"</b> no se llena a propósito: "+j.motivo));
      });
    }

    DEV_GRUPOS.forEach(function(g){
      var campos=ESQUEMA_CLUB.filter(function(x){ return x.grupo===g.k; });
      if(!campos.length) return;
      cont.appendChild(el("h3","sub",g.ic+" "+g.n));
      campos.forEach(function(campo){ cont.appendChild(_filaCampo(campo,CLUB_SEL,repintar)); });
    });
  }

  function _nombreDe(id){
    try{
      if(typeof CLUB_INFO_2026!=="undefined" && CLUB_INFO_2026[id] && CLUB_INFO_2026[id].n) return CLUB_INFO_2026[id].n;
      if(typeof CLUB_INFO!=="undefined" && CLUB_INFO[id] && CLUB_INFO[id].n) return CLUB_INFO[id].n;
    }catch(e){}
    return null;
  }

  /* una fila editable según el tipo del campo */
  function _filaCampo(campo,id,repintar){
    var val=null; try{ val=campo.get(id); }catch(e){}
    var fila=el("div","dev-campo"+(val==null&&campo.req?" falta":""));
    var lab=el("label","dev-lab");
    lab.innerHTML="<b>"+campo.n+"</b> <span class='mini'>"+campo.donde+"</span>"+(val==null&&campo.req?" <span class='dev-falta'>falta</span>":"");
    fila.appendChild(lab);

    if(campo.tipo==="ro" || typeof campo.set!=="function"){
      fila.appendChild(el("div","mini dev-ro", val==null?"—":"(solo lectura) "+_resumen(val)));
      return fila;
    }
    var entrada, esJson=(campo.tipo==="json"||campo.tipo==="lista");
    if(esJson){
      entrada=el("textarea","dev-ta");
      entrada.rows=(campo.tipo==="lista")?2:5;
      entrada.value = val==null?"":JSON.stringify(val,null,1);
      entrada.placeholder = campo.tipo==="lista"?'["UCH","UC"]':"{ }";
    }else if(campo.tipo==="parrafo"){
      entrada=el("textarea","dev-ta"); entrada.rows=3; entrada.value=val==null?"":String(val);
    }else{
      entrada=el("input","dev-in");
      entrada.type=(campo.tipo==="numero")?"number":"text";
      entrada.value=val==null?"":String(val);
    }
    fila.appendChild(entrada);

    var acc=el("div","dev-acc");
    var bg=el("button","btn-aqua chico verde","Guardar");
    var msg=el("span","mini dev-msg","");
    bg.onclick=function(){
      var nuevo;
      if(esJson){
        var t=entrada.value.trim();
        if(!t){ msg.textContent="vacío: no se guardó"; return; }
        try{ nuevo=JSON.parse(t); }
        catch(err){ msg.textContent="❌ JSON inválido: "+err.message; msg.className="mini dev-msg mal"; return; }
      }else if(campo.tipo==="numero"){
        nuevo=parseInt(entrada.value,10);
        if(isNaN(nuevo)){ msg.textContent="❌ no es número"; return; }
      }else{
        nuevo=entrada.value.trim();
        if(!nuevo){ msg.textContent="vacío: no se guardó"; return; }
      }
      try{ campo.set(id,nuevo); }catch(err){ msg.textContent="❌ "+err.message; return; }
      parcheSet(id,campo.k,nuevo);
      msg.textContent="✅ guardado (parche)"; msg.className="mini dev-msg bien";
      if(typeof aviso==="function") aviso("Guardado: "+campo.n+" de "+id);
      setTimeout(repintar,350);
    };
    acc.appendChild(bg); acc.appendChild(msg);
    fila.appendChild(acc);
    return fila;
  }
  function _resumen(v){
    try{
      if(Array.isArray(v)) return v.length+" entrada(s)";
      if(typeof v==="object") return Object.keys(v).join(", ").slice(0,80);
      return String(v).slice(0,80);
    }catch(e){ return "—"; }
  }

  /* ---------- pestaña LIGA ---------- */
  function pintarLiga(cont,repintar){
    cont.appendChild(el("p","mini","Estado del <b>formato</b> de cada torneo (no de sus clubes). Para crear una liga nueva mira <b>PLANTILLA_LIGA.md</b>."));
    devErasLiga().forEach(function(era){
      var f=auditarFormato(era), r=auditarLiga(era);
      var d=el("div","dev-liga");
      d.innerHTML="<div class='dev-liga-cab'><b>"+r.nombre+"</b> <span class='mini'>["+era+"]</span><b class='dev-pct'>"+f.pct+"%</b></div>"+barraPct(f.pct);
      var ul=el("div","mini");
      f.tiene.forEach(function(x){ ul.appendChild(chip("✓ "+x.n,"ok")); });
      f.faltan.forEach(function(x){ ul.appendChild(chip("✗ "+x.n,"mal")); });
      d.appendChild(ul);
      d.appendChild(el("p","mini","Clubes de este torneo: <b>"+r.pct+"%</b> de rigor promedio."));
      cont.appendChild(d);
    });
  }

  /* ---------- pestaña EXPORTAR ---------- */
  function pintarExportar(cont,repintar){
    var p=parcheLeer(), n=parcheCuenta();
    cont.appendChild(el("p","mini",
      "Lo editado vive en tu navegador. Para hacerlo <b>permanente</b>: copia este archivo, guárdalo como "+
      "<code>js/data-parche-dev.js</code> y agrégalo al final de <code>index.html</code>. Ahí queda en git."));
    if(!n){ cont.appendChild(el("div","resul mitad","Todavía no editaste nada.")); return; }
    cont.appendChild(el("p","mini","<b>"+n+"</b> campo(s) en "+Object.keys(p).length+" club(es).")); 
    var txt=_generarArchivo(p);
    var ta=el("textarea","dev-ta"); ta.rows=14; ta.value=txt; ta.readOnly=true;
    cont.appendChild(ta);
    var acc=el("div","dev-acc");
    var bc=el("button","btn-aqua chico verde","📋 Copiar");
    bc.onclick=function(){
      try{ ta.select(); document.execCommand("copy"); aviso("Copiado"); }
      catch(e){ aviso("Cópialo a mano (Ctrl+C)"); }
    };
    var bd=el("button","btn-aqua chico","⬇ Descargar .js");
    bd.onclick=function(){
      try{
        var blob=new Blob([txt],{type:"text/javascript"});
        var a=document.createElement("a");
        a.href=URL.createObjectURL(blob); a.download="data-parche-dev.js";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }catch(e){ aviso("No se pudo descargar; copia el texto"); }
    };
    var bx=el("button","btn-aqua chico rojo","🗑 Borrar parche");
    bx.onclick=function(){
      if(!confirm("¿Borrar TODO lo editado? (recarga después para volver a los datos originales)")) return;
      parcheBorrar(); aviso("Parche borrado"); repintar();
    };
    acc.appendChild(bc); acc.appendChild(bd); acc.appendChild(bx);
    cont.appendChild(acc);
  }

  function _generarArchivo(p){
    var fecha=new Date().toISOString().slice(0,10);
    return '"use strict";\n'+
      '/* ============================================================\n'+
      '   FUTBOLINI · data-parche-dev.js\n'+
      '   Generado por el Editor de contenido el '+fecha+'.\n'+
      '   Cargar DESPUÉS de dev-esquema.js (que trae aplicarParcheClubes).\n'+
      '   Cada clave es un club; cada campo, uno del ESQUEMA_CLUB.\n'+
      '   ============================================================ */\n'+
      'var DEV_PARCHE_GUARDADO='+JSON.stringify(p,null,2)+';\n'+
      '(function(){\n'+
      '  if(typeof aplicarParcheClubes==="function") aplicarParcheClubes(DEV_PARCHE_GUARDADO);\n'+
      '})();\n';
  }

  /* expuesto */
  window.abrirEditorContenido=abrirEditorContenido;
})();
