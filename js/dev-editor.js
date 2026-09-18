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
      "Edita clubes, ligas y datos sin tocar archivos. Mide el <b>rigor</b> de cada club contra Colo-Colo y te dice qué falta. Lo editado queda como parche y se exporta a un .js."));
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
      [["rigor","📏 Rigor"],["club","🏟️ Club"],["nuevo","➕ Nuevo"],["liga","🏆 Liga"],["alma","📚 Alma"],["exportar","💾 Exportar"]].forEach(function(t){
        var b=el("button","ficha",t[1]);
        b.setAttribute("aria-pressed",TAB===t[0]?"true":"false");
        b.onclick=function(){ TAB=t[0]; pintar(); };
        tabs.appendChild(b);
      });

      var cont=el("div","dev-cont");
      function pintar(){
        c.innerHTML=""; c.appendChild(tabs);
        Array.prototype.forEach.call(tabs.children,function(b,i){
          b.setAttribute("aria-pressed",["rigor","club","nuevo","liga","alma","exportar"][i]===TAB?"true":"false");
        });
        cont.innerHTML=""; c.appendChild(cont);
        if(TAB==="rigor") pintarRigor(cont,pintar);
        else if(TAB==="club") pintarClub(cont,pintar);
        else if(TAB==="nuevo") pintarNuevo(cont,pintar);
        else if(TAB==="liga") pintarLiga(cont,pintar);
        else if(TAB==="alma"){ if(typeof devPintarCobertura==="function") devPintarCobertura(cont); else cont.appendChild(el("p","mini","Analizador de contenido no cargó.")); }
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
    var busca=el("input","dev-in"); busca.type="search"; busca.placeholder="Filtrar por nombre o ID…"; busca.style.margin="6px 0";
    var solo=el("label","mini"); var chk=el("input"); chk.type="checkbox";
    solo.appendChild(chk); solo.appendChild(document.createTextNode(" solo los que no llegan a 100%"));
    var host=el("div");
    function dibujar(){
      host.innerHTML="";
      var q=(busca.value||"").toLowerCase().trim();
      var todo=auditarTodo();
      todo.forEach(function(r){
        var p=el("div","dev-liga");
        var cab=el("div","dev-liga-cab");
        var tit=el("b"); tit.textContent=r.nombre||"";
        var mini=el("span","mini"); mini.textContent=" ["+r.era+"] · "+r.clubes+" clubes";
        var pct=el("b","dev-pct"); pct.textContent=r.pct+"%";
        cab.appendChild(tit); cab.appendChild(mini); cab.appendChild(pct);
        p.appendChild(cab);
        p.appendChild(el("div",null,barraPct(r.pct)));
        var grid=el("div","dev-grid");
        r.fichas.forEach(function(f){
          if(chk.checked && f.pct>=100) return;
          var nom=_nombreDe(f.id)||"";
          if(q && (f.id+" "+nom).toLowerCase().indexOf(q)<0) return;
          var b=el("button","dev-club"+(f.pct>=100?" ok":(f.pct>=75?" medio":" mal")));
          var ib=el("b"); ib.textContent=f.id; b.appendChild(ib);
          var sp=el("span"); sp.textContent=f.pct+"%"; b.appendChild(sp);
          b.title=nom+(f.faltanReq.length?(" · Falta: "+f.faltanReq.map(function(x){return x.n;}).join(", ")):" · Completo");
          b.onclick=function(){ CLUB_SEL=f.id; TAB="club"; repintar(); };
          grid.appendChild(b);
        });
        if(!grid.children.length) return;
        p.appendChild(grid);
        host.appendChild(p);
      });
    }
    busca.oninput=dibujar; chk.onchange=dibujar;
    cont.appendChild(busca); cont.appendChild(solo); cont.appendChild(host); dibujar();
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
    try{
      var idsP=Object.keys(parcheLeer()||{});
      var ogP=document.createElement("optgroup"); ogP.label="Parche (nuevos / editados)";
      idsP.forEach(function(id){
        if(vistos[id]) return; vistos[id]=1;
        var o=document.createElement("option"); o.value=id;
        o.textContent=id+" · "+((_nombreDe(id))||"(nuevo)")+"  (parche)";
        ogP.appendChild(o);
      });
      if(ogP.children.length) sel.appendChild(ogP);
    }catch(e){}
    if(!CLUB_SEL) CLUB_SEL=sel.value||"CC";
    sel.value=CLUB_SEL;
    sel.onchange=function(){ CLUB_SEL=sel.value; repintar(); };
    var busca=el("input","dev-in"); busca.type="search"; busca.placeholder="Buscar en el selector…";
    busca.style.marginBottom="6px";
    busca.oninput=function(){
      var q=(busca.value||"").toLowerCase();
      Array.prototype.forEach.call(sel.querySelectorAll("option"),function(o){
        o.hidden=!!q && (o.textContent||"").toLowerCase().indexOf(q)<0;
      });
    };
    cont.appendChild(busca);
    cont.appendChild(sel);

    var a=auditarClub(CLUB_SEL);
    var cab=el("div","dev-club-cab");
    var nb=el("b"); nb.textContent=_nombreDe(CLUB_SEL)||CLUB_SEL;
    var idsp=el("span","mini"); idsp.textContent=" "+CLUB_SEL+" ";
    var pct=el("b","dev-pct"); pct.textContent=a.pct+"%";
    cab.appendChild(nb); cab.appendChild(idsp); cab.appendChild(pct);
    cab.appendChild(el("div",null,barraPct(a.pct)));
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
    if(esJson && !String(entrada.value||"").trim()){
      var bp=el("button","btn-aqua chico gris","Plantilla");
      bp.onclick=function(){
        if(campo.k==="ind") entrada.value=JSON.stringify({plantel:50,moral:50,hinchada:50,socios:40,cantera:45,estadio:45,prestigio:40,riesgo:50},null,1);
        else if(campo.k==="caja") entrada.value=JSON.stringify({plata:80,deuda:40},null,1);
        else if(campo.k==="colores") entrada.value='["#111111","#ffffff"]';
        else if(campo.tipo==="lista") entrada.value='["CC"]';
        else entrada.value="{ }";
        entrada.focus();
      };
      acc.appendChild(bp);
    }
    var bg=el("button","btn-aqua chico verde","Guardar");
    var msg=el("span","mini dev-msg","");
    bg.onclick=function(){
      var nuevo;
      if(esJson){
        var t=entrada.value.trim();
        if(!t){ nuevo=null; }
        else {
          try{ nuevo=JSON.parse(t); }
          catch(err){ msg.textContent="❌ JSON inválido: "+err.message; msg.className="mini dev-msg mal"; return; }
        }
      }else if(campo.tipo==="numero"){
        if(!String(entrada.value).trim()){ nuevo=null; }
        else { nuevo=parseInt(entrada.value,10); if(isNaN(nuevo)){ msg.textContent="❌ no es número"; return; } }
      }else{
        nuevo=entrada.value.trim();
        if(!nuevo) nuevo=null;
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

  /* ---------- pestaña NUEVO (formulario + PEGAR) ---------- */
  function pintarNuevo(cont,repintar){
    cont.appendChild(el("p","mini","Crea o <b>mejora</b> un club. Si el ID ya existe, se actualiza (no se duplica). Si cambia el nombre, también se espeja en la ficha 1991. El HTML se recorta. Si pones liga, el club aparece en el selector."));
    var grid=el("div","pegar-grid");
    function campo(lbl,ph,cls){
      var lab=el("label"); lab.textContent=lbl;
      var i=el("input","dev-in"); i.placeholder=ph||""; if(cls) lab.className=cls;
      lab.appendChild(i); grid.appendChild(lab); return i;
    }
    var iId=campo("ID (2-6 letras)","SMO");
    var iNom=campo("Nombre","Club de ejemplo");
    var iCiu=campo("Ciudad","Santiago");
    var iFund=campo("Fundación","1909"); iFund.type="number";
    var iDt=campo("DT","Cuerpo técnico");
    var iLiga=campo("Liga (2026, 2026b, 2026c, 1991, arg2026…)","2026");
    iLiga.value="2026";
    var labD=el("label","span2"); labD.textContent="Descripción";
    var iDesc=el("textarea","dev-ta"); iDesc.rows=2; iDesc.placeholder="Quién es este club, en una frase.";
    labD.appendChild(iDesc); grid.appendChild(labD);
    var labS=el("label","span2"); labS.textContent="Situación (por qué dirigir acá)";
    var iSit=el("textarea","dev-ta"); iSit.rows=2; iSit.placeholder="Por qué el jugador elige este club.";
    labS.appendChild(iSit); grid.appendChild(labS);
    cont.appendChild(grid);

    var det=el("details","pegar-adv");
    var sum=el("summary"); sum.textContent="O pega un bloque de texto (PEGAR)";
    det.appendChild(sum);
    var ta=el("textarea","dev-ta"); ta.rows=8;
    ta.value=(typeof PEGAR_CLUB_EJEMPLO==="function")?PEGAR_CLUB_EJEMPLO():"ID: XXX\nnombre: Club de ejemplo";
    det.appendChild(ta);
    det.appendChild(el("p","mini","Formato: ID / nombre / ciudad / fund / dt / liga / desc / situacion. Una clave por línea."));
    cont.appendChild(det);

    var msg=el("p","mini","");
    var bg=el("button","btn-aqua ancho verde","Crear / mejorar club");
    bg.style.marginTop="8px";
    function bloqueDeForm(){
      var id=(iId.value||"").trim(), nom=(iNom.value||"").trim();
      if(!id&&!nom) return ta.value;
      return "ID: "+id+"\nnombre: "+nom+"\nciudad: "+(iCiu.value||"")+"\nfund: "+(iFund.value||"")+"\ndt: "+(iDt.value||"")+"\nliga: "+(iLiga.value||"")+"\ndesc: "+(iDesc.value||"")+"\nsituacion: "+(iSit.value||"");
    }
    bg.onclick=function(){
      if(typeof crearClubDesdePegar!=="function"){ msg.textContent="Motor de PEGAR no cargó"; return; }
      var r=crearClubDesdePegar(bloqueDeForm());
      if(!r.ok){ msg.textContent="❌ "+r.msg; msg.className="mini dev-msg mal"; return; }
      var p=(typeof parsearPegarClub==="function")?parsearPegarClub(bloqueDeForm()):{};
      if(p.nombre) parcheSet(r.id,"nombre",p.nombre);
      if(p.desc) parcheSet(r.id,"desc",p.desc);
      if(p.dt) parcheSet(r.id,"dt",p.dt);
      if(p.ciudad) parcheSet(r.id,"ciudad",p.ciudad);
      if(p.fund) parcheSet(r.id,"fund",p.fund);
      if(p.situacion) parcheSet(r.id,"situacion",p.situacion);
      msg.textContent="✅ "+r.id+" · "+r.nombre+(r.liga?" · liga "+r.liga:"")+" — abre en Club para números, historia y clásico.";
      msg.className="mini dev-msg bien";
      CLUB_SEL=r.id;
      if(typeof aviso==="function") aviso("Club "+r.id+" listo. Sigue en la pestaña Club.");
      TAB="club"; setTimeout(repintar,280);
    };
    var ir=el("button","btn-aqua chico","Abrir en Club →"); ir.style.marginTop="6px";
    ir.onclick=function(){ TAB="club"; repintar(); };
    cont.appendChild(bg); cont.appendChild(ir); cont.appendChild(msg);
    cont.appendChild(el("p","mini","Plantel y decisiones propias siguen en los .js (no se inventan acá). Segunda 2026 = cantera."));
  }

  /* ---------- pestaña LIGA ---------- */
  function pintarLiga(cont,repintar){
    cont.appendChild(el("p","mini","Estado del <b>formato</b> de cada torneo (no de sus clubes)."));
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
    _pintarLigaNueva(cont);
  }

  /* Liga nueva: generador de scaffold .js (como el Exportar de clubes, pero para
     una liga entera). Puro codegen — NO toca el motor. Copiás/descargás el .js,
     lo dejás en js/, lo sumás a index.html y ya tenés "la liga danesa". */
  function _pintarLigaNueva(cont){
    var wrap=el("div","dev-liga-nueva");
    wrap.appendChild(el("h3","dev-h3","➕ Liga nueva — generar .js"));
    wrap.appendChild(el("p","mini","Copia el formato de una liga existente. Llenás nombre, clave de época y los clubes; el motor deriva fuerza→indicadores, caja, estatuto y poder. Un club por línea: <code>ID | Nombre | Ciudad | fuerza(30-90) | aforo | Estadio</code>."));
    var grid=el("div","pegar-grid");
    function campo(lbl,ph,val,span){
      var lab=el("label"); if(span) lab.className="span2"; lab.textContent=lbl;
      var i=el("input","dev-in"); i.placeholder=ph||""; if(val!=null) i.value=val;
      lab.appendChild(i); grid.appendChild(lab); return i;
    }
    var iNom=campo("Nombre de la liga","Superliga Danesa");
    var iEra=campo("Clave de época (única)","din2026");
    /* base de época: reusar una existente para heredar reglas */
    var labB=el("label"); labB.textContent="Época base (hereda reglas)";
    var selB=el("select","dev-select");
    ["2026","2026b","2026c","1991","2006","arg2026"].forEach(function(k){
      var o=document.createElement("option"); o.value=k; o.textContent=k; selB.appendChild(o);
    });
    labB.appendChild(selB); grid.appendChild(labB);
    var iPais=campo("País (federación: chile, argentina…)","dinamarca");
    var iPts=campo("Puntos por victoria","3"); iPts.type="number"; iPts.value="3";
    wrap.appendChild(grid);

    var labC=el("label","span2"); labC.textContent="Clubes (uno por línea)";
    var taC=el("textarea","dev-ta"); taC.rows=6;
    taC.placeholder="FCK | FC København | Copenhague | 78 | 38000 | Parken\nBIF | Brøndby IF | Brøndby | 72 | 28000 | Brøndby Stadion";
    labC.appendChild(taC); wrap.appendChild(labC);

    /* clonar a rigor Colo-Colo: llena todo lo estructural y deja los datos duros
       como "por documentar" (justificados). La liga queda al 100% en el auditor. */
    var labR=el("label","mini"); labR.style.display="flex"; labR.style.gap="6px"; labR.style.alignItems="center"; labR.style.margin="4px 0";
    var chkR=el("input"); chkR.type="checkbox"; chkR.checked=true;
    labR.appendChild(chkR); labR.appendChild(document.createTextNode(" Clonar a rigor Colo-Colo (cada club al 100%, aplicado en vivo)"));
    wrap.appendChild(labR);

    var acc=el("div","dev-acc");
    var bGen=el("button","btn-aqua chico verde","⚙ Generar .js");
    var bCop=el("button","btn-aqua chico","📋 Copiar"); bCop.disabled=true;
    var bDes=el("button","btn-aqua chico","⬇ Descargar .js"); bDes.disabled=true;
    acc.appendChild(bGen); acc.appendChild(bCop); acc.appendChild(bDes);
    wrap.appendChild(acc);
    var msg=el("p","mini dev-msg","");
    var salida=el("textarea","dev-ta"); salida.rows=12; salida.readOnly=true; salida.style.display="none";
    wrap.appendChild(msg); wrap.appendChild(salida);
    cont.appendChild(wrap);

    bGen.onclick=function(){
      var meta={
        nombre:_lp(iNom.value,60), eraKey:_claveEra(iEra.value),
        baseEra:selB.value, pais:_lp(iPais.value,24).toLowerCase().replace(/[^a-z]/g,""),
        pts:Math.max(1,Math.min(3,parseInt(iPts.value,10)||3))
      };
      if(!meta.eraKey){ msg.textContent="❌ Falta la clave de época (solo letras/números, ej: din2026)."; msg.className="mini dev-msg mal"; return; }
      var clubs=_parseClubesLiga(taC.value);
      if(!clubs.length){ msg.textContent="❌ No leí ningún club válido. Formato: ID | Nombre | Ciudad | fuerza | aforo | Estadio."; msg.className="mini dev-msg mal"; return; }
      var txt=_scaffoldLiga(meta,clubs);
      var extra="";
      if(chkR.checked && typeof devClonarLigaRigor==="function"){
        var r=devClonarLigaRigor(clubs,meta);
        if(r&&r.ok){
          /* con rigor completo, el .js descargable ES el persistente (todo el rigor) */
          if(typeof devExportarLigaRigor==="function"){ var full=devExportarLigaRigor(clubs,meta); if(full) txt=full; }
          extra=" · 🟢 Clonada a rigor Colo-Colo: liga al "+(r.pct!=null?r.pct+"%":"100%")+". El .js de abajo YA trae todo el rigor (persistente). Datos duros marcados 'por documentar'.";
          CLUB_SEL=clubs[0].id;
        }
      }
      salida.value=txt; salida.style.display="block";
      bCop.disabled=false; bDes.disabled=false;
      msg.textContent="✅ Liga "+meta.eraKey+" con "+clubs.length+" club(es). Guarda el .js en js/, agrégalo a index.html DESPUÉS de liga-registrar.js."+extra;
      msg.className="mini dev-msg bien";
    };
    bCop.onclick=function(){ try{ salida.select(); document.execCommand("copy"); if(typeof aviso==="function") aviso("Copiado"); }catch(e){ if(typeof aviso==="function") aviso("Cópialo a mano (Ctrl+C)"); } };
    bDes.onclick=function(){
      try{
        var blob=new Blob([salida.value],{type:"text/javascript"});
        var a=document.createElement("a"); a.href=URL.createObjectURL(blob);
        a.download="data-liga-"+(_claveEra(iEra.value)||"nueva")+".js";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }catch(e){ if(typeof aviso==="function") aviso("No se pudo descargar; copia el texto"); }
    };
  }
  /* helpers del generador de liga */
  function _lp(s,max){ return (typeof textoLimpio==="function")?textoLimpio(s,max):String(s==null?"":s).replace(/<[^>]*>/g,"").trim().slice(0,max||80); }
  function _claveEra(s){ return String(s||"").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,16); }
  function _parseClubesLiga(txt){
    var out=[];
    String(txt||"").split(/\n+/).forEach(function(ln){
      ln=ln.trim(); if(!ln) return;
      var p=ln.split("|").map(function(x){ return x.trim(); });
      var id=String(p[0]||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);
      var nom=_lp(p[1],48);
      if(!id||!nom) return;
      var fuerza=Math.max(30,Math.min(90,parseInt(p[3],10)||55));
      var aforo=Math.max(0,parseInt((p[4]||"").replace(/[^0-9]/g,""),10)||0);
      out.push({ id:id, n:nom, c:_lp(p[2],32)||nom, fuerza:fuerza, aforo:aforo,
                 est:_lp(p[5],48)||("Estadio de "+(_lp(p[2],32)||nom)), ciudad:_lp(p[2],32)||"" });
    });
    return out;
  }
  function _jsStr(s){ return '"'+String(s==null?"":s).replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'; }
  function _scaffoldLiga(meta,clubs){
    var fecha=new Date().toISOString().slice(0,10);
    var varName="LIGA_"+meta.eraKey.toUpperCase().replace(/[^A-Z0-9]/g,"_");
    var lineas=clubs.map(function(c){
      return "  { id:"+_jsStr(c.id)+", n:"+_jsStr(c.n)+", c:"+_jsStr(c.c)+", fuerza:"+c.fuerza+
             ", aforo:"+c.aforo+", est:"+_jsStr(c.est)+", ciudad:"+_jsStr(c.ciudad)+", z:\"—\" }";
    }).join(",\n");
    return '"use strict";\n'+
      '/* ============================================================\n'+
      '   FUTBOLINI · data-liga-'+meta.eraKey+'.js\n'+
      '   Liga generada por el Editor de contenido el '+fecha+'.\n'+
      '   Cargar en index.html DESPUÉS de liga-registrar.js.\n'+
      '   El motor deriva indicadores, caja, estatuto y poder de la fuerza (0-90).\n'+
      '   INTEGRIDAD: pon nombres/estadios REALES y documentados; nada inventado como real.\n'+
      '   ============================================================ */\n'+
      'var '+varName+'=[\n'+lineas+'\n];\n'+
      'if(typeof registrarLiga==="function"){\n'+
      '  registrarLiga({\n'+
      '    eraKey:'+_jsStr(meta.eraKey)+',\n'+
      '    clubs:'+varName+',\n'+
      '    baseEra:'+_jsStr(meta.baseEra)+',\n'+
      '    nombre:'+_jsStr(meta.nombre||("Liga "+meta.eraKey))+',\n'+
      '    era:{ n:'+_jsStr(meta.nombre||meta.eraKey)+(meta.pais?', pais:'+_jsStr(meta.pais):'')+', puntosVictoria:'+meta.pts+' }\n'+
      '  });\n'+
      '}\n';
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
      if(!confirm("¿Borrar TODO lo editado? (se recarga para volver a los datos originales)")) return;
      parcheBorrar(); aviso("Parche borrado"); try{ location.reload(); }catch(e){ repintar(); }
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
