"use strict";
/* ============================================================
   FUTBOLINI · dev-cobertura.js  (análisis de CONTENIDO por club/época)
   El auditor de rigor (dev-esquema) mide si los CAMPOS están llenos. Esto mide
   otra cosa: ¿cuánta ALMA propia tiene cada club? — decisiones que solo le pasan
   a él, arcos de historia, plantel real. Un club puede estar 100% en rigor de
   ficha y aun así ser "pobre" en contenido vivo (cartas, arcos, tuits).

   Sirve para RESPONDER: "si juego a X en tal año, ¿voy a ver cosas de X y de esa
   época, o puro contenido genérico?". Y para ver DÓNDE hay que trabajar.

   No toca el juego: solo LEE DECISIONES / ARCOS_EQUIPO / PLANTELES_REALES.
   ============================================================ */
(function(){

  function _arr(nombre){ try{ return (typeof window[nombre]!=="undefined")?window[nombre]:(eval("typeof "+nombre+"!=='undefined'")?eval(nombre):null); }catch(e){ return null; } }
  /* const globales no cuelgan de window; los tomo por nombre explícito */
  function _DEC(){ return (typeof DECISIONES!=="undefined")?DECISIONES:[]; }
  function _ARC(){ return (typeof ARCOS_EQUIPO!=="undefined")?ARCOS_EQUIPO:{}; }
  function _PLA(){ return (typeof PLANTELES_REALES!=="undefined")?PLANTELES_REALES:{}; }

  /* contenido propio de UN club */
  function auditarContenido(id){
    var dec=_DEC().filter(function(d){ return d && d.club===id; });
    var porAnio={}; dec.forEach(function(d){ var a=d.anio||"s/año"; porAnio[a]=(porAnio[a]||0)+1; });
    var arcos=(_ARC()[id]||[]).length;
    var pr=_PLA()[id];
    var plantelReal=!!(pr && Object.keys(pr).length);
    var total=dec.length+arcos;
    var nivel=total>=6?"rico":(total>=2?"medio":"pobre");
    return { id:id, decisiones:dec.length, porAnio:porAnio, arcos:arcos, plantelReal:plantelReal, total:total, nivel:nivel };
  }

  /* lista de clubes dirigibles (los que ofrece el picker: 1991 + 2026 + B + C + AFA) */
  function _clubesDirigibles(){
    var set={}, push=function(o){ if(o) Object.keys(o).forEach(function(k){ set[k]=1; }); };
    push(typeof CLUB_INFO!=="undefined"?CLUB_INFO:null);
    push(typeof CLUB_INFO_2026!=="undefined"?CLUB_INFO_2026:null);
    var out=Object.keys(set).filter(function(id){ return typeof devEsJugable!=="function" || devEsJugable(id); });
    return out;
  }

  /* informe global: cuántos clubes ricos/medios/pobres, y la lista de los pobres */
  function devInformeCobertura(){
    var ids=_clubesDirigibles(), ricos=[], medios=[], pobres=[];
    ids.forEach(function(id){
      var c=auditarContenido(id);
      (c.nivel==="rico"?ricos:c.nivel==="medio"?medios:pobres).push(c);
    });
    return { total:ids.length, ricos:ricos, medios:medios, pobres:pobres,
             pctRico: ids.length?Math.round(ricos.length/ids.length*100):0 };
  }

  /* ---------- render de la pestaña Cobertura del editor ---------- */
  function devPintarCobertura(cont){
    if(typeof el!=="function") return;
    var inf=devInformeCobertura();
    cont.appendChild(el("p","mini","Mide el <b>alma propia</b> de cada club (decisiones que solo le pasan a él + arcos de historia), no solo si la ficha está llena. Muestra dónde el juego se siente genérico. La vara es <b>Colo-Colo</b>."));
    var res=el("div","dev-liga");
    res.innerHTML="<div class='dev-liga-cab'><b>Cobertura de contenido</b> <span class='mini'>"+inf.total+" clubes dirigibles</span><b class='dev-pct'>"+inf.pctRico+"% ricos</b></div>";
    res.appendChild(el("div","mini",
      "<span style='color:#2fa84f'>● Ricos "+inf.ricos.length+"</span> · <span style='color:#d68a1f'>● Medios "+inf.medios.length+"</span> · <span style='color:#c0392b'>● Pobres "+inf.pobres.length+"</span>"));
    cont.appendChild(res);
    function tabla(titulo,lista,color){
      if(!lista.length) return;
      var d=el("div","dev-liga");
      d.appendChild(el("div","dev-liga-cab","<b style='color:"+color+"'>"+titulo+"</b> <span class='mini'>"+lista.length+"</span>"));
      var grid=el("div","dev-grid");
      lista.sort(function(a,b){ return b.total-a.total; }).forEach(function(c){
        var b=el("button","dev-club"+(c.nivel==="rico"?" ok":c.nivel==="medio"?" medio":" mal"));
        b.innerHTML="<b>"+c.id+"</b><span>"+c.decisiones+"d·"+c.arcos+"a</span>";
        var anios=Object.keys(c.porAnio).filter(function(x){return x!=="s/año";});
        b.title=c.id+": "+c.decisiones+" decisiones ("+ (anios.length?("años "+anios.join(", ")):"sin año") +"), "+c.arcos+" arco(s), plantel real: "+(c.plantelReal?"sí":"no");
        if(typeof CLUB_SEL!=="undefined"){ b.onclick=function(){ CLUB_SEL=c.id; }; }
        grid.appendChild(b);
      });
      d.appendChild(grid);
      cont.appendChild(d);
    }
    tabla("🔴 Pobres — a rellenar primero (0-1 de contenido)", inf.pobres, "#c0392b");
    tabla("🟠 Medios — les falta alma (2-5)", inf.medios, "#d68a1f");
    tabla("🟢 Ricos — la vara", inf.ricos, "#2fa84f");
    cont.appendChild(el("p","mini","Cómo subir a un club: darle <b>decisiones propias</b> (cartas que solo le pasan a él, con <code>club:\"ID\"</code>) y <b>arcos</b> de historia. Colo-Colo tiene 15+ decisiones; ese es el listón del <i>alma</i>."));
  }

  window.auditarContenido=auditarContenido;
  window.devInformeCobertura=devInformeCobertura;
  window.devPintarCobertura=devPintarCobertura;
})();
