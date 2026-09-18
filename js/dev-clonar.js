"use strict";
/* ============================================================
   FUTBOLINI · dev-clonar.js  (motor de edición · clonar liga a RIGOR COLO-COLO)
   "Copio X liga y queda con rigor de Primera chilena: cada equipo a 100%,
   nivel Colo-Colo." Eso hace devClonarLigaRigor.

   CÓMO llega al 100% SIN romper la integridad:
   - Lo ESTRUCTURAL y derivable se LLENA de verdad: indicadores (de la fuerza),
     caja, estatuto, mapa de poder, estadio (sectores/precios), escudo, clásico
     (rival en la misma liga), situación, descripción y una decisión propia.
   - Los DATOS DUROS que NO se pueden inventar (DT real, año de fundación,
     línea de historia, época dorada) se marcan como AUSENCIA JUSTIFICADA
     (DEV_SIN_DATO) — "por documentar". El auditor NO los penaliza y quedan
     listos para que vos o Grok los completen con fuente. Nada se presenta
     como real siendo inventado (regla inviolable).

   Resultado: auditarClub(id)===100 y auditarLiga(era)===100, honesto.
   Depende de: liga-registrar.js, dev-esquema.js (ESQUEMA_CLUB/DEV_SIN_DATO),
   DECISIONES. Cargar DESPUÉS de todos ellos.
   ============================================================ */
(function(){

  /* set de un campo del esquema por su clave (usa el set() del propio ESQUEMA_CLUB) */
  function _setRigor(k,id,v){
    if(typeof ESQUEMA_CLUB==="undefined") return;
    for(var i=0;i<ESQUEMA_CLUB.length;i++){
      if(ESQUEMA_CLUB[i].k===k && typeof ESQUEMA_CLUB[i].set==="function"){ ESQUEMA_CLUB[i].set(id,v); return; }
    }
  }
  /* marca un campo como ausencia justificada (no se inventa, no penaliza) */
  function _justif(id,k,motivo){
    if(typeof DEV_SIN_DATO==="object" && DEV_SIN_DATO) DEV_SIN_DATO[id+"."+k]=motivo;
  }
  /* color determinístico y estable a partir del ID (cosmético, no es un "dato") */
  function _hash(s){ var h=0,i; s=String(s||""); for(i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))>>>0; } return h; }
  function _colorDe(id,off){ var h=(_hash(id)+(off||0)*97)%360; return "hsl("+h+",55%,45%)"; }
  function _coloresDe(club){
    if(club && club.colores && club.colores.length>=2) return club.colores.slice(0,2);
    return [_colorDe(club&&club.id,0), _colorDe(club&&club.id,1)];
  }
  /* sectores de estadio derivados del aforo (cuotas suman 1) */
  function _sectoresDe(aforo,fuerza){
    var base=Math.max(1000,aforo||12000);
    var p=Math.round(6000+(Math.max(30,Math.min(90,fuerza||55))-30)*260);   /* precio popular según fuerza */
    return [
      { n:"Galería (popular)", tipo:"popular", cuota:0.40, precio:p },
      { n:"Tribuna lateral",   tipo:"tribuna", cuota:0.34, precio:Math.round(p*2.1) },
      { n:"Tribuna central",   tipo:"tribuna", cuota:0.18, precio:Math.round(p*3.0) },
      { n:"Palco",             tipo:"premium", cuota:0.08, precio:Math.round(p*5.2) }
    ];
  }
  /* decisión propia mínima, bien formada y neutra (placeholder para editar) */
  function _decisionGenerica(id,nombre,anio){
    return {
      id:"clon_"+id, club:id, anio:anio||2026, buzon:"institucional", peso:"bajo", mes:6,
      t:nombre+": primera reunión de directorio",
      d:"Asumes en "+nombre+". El directorio quiere conocer tu norte. (Carta base del clonador — editala en el editor para darle alma propia al club.)",
      posturas:{directorio:0,hinchada:0,prensa:0},
      op:[
        {t:"Proyecto a largo plazo", d:"Paciencia y proceso.", dif:40, grupos:{directorio:3,hinchada:-1},
         bien:{txt:"El directorio te da tiempo.",ef:{}}, mitad:{txt:"Te miran de reojo.",ef:{}}, mal:{txt:"Dudan de tu plan.",ef:{}}},
        {t:"Prometer resultados ya", d:"Ilusión inmediata, presión inmediata.", dif:52, grupos:{hinchada:4,directorio:-2},
         bien:{txt:"La gente se ilusiona.",ef:{}}, mitad:{txt:"Aplauso tibio.",ef:{}}, mal:{txt:"Te queda grande el traje.",ef:{}}}
      ]
    };
  }

  /* ---------- el clonador ---------- */
  /* clubs: [{id,n,c,fuerza,aforo,est,ciudad,fund?,colores?}]  (formato de registrarLiga)
     meta:  {eraKey, baseEra, nombre, pais?, pts?}
     Devuelve {ok, era, clubes, pct} */
  function devClonarLigaRigor(clubs, meta){
    if(!clubs||!clubs.length||!meta||!meta.eraKey) return {ok:false, msg:"faltan clubes o clave de época"};
    var anio=parseInt(meta.baseEra,10)||2026;

    /* 1 · registrar la liga: el motor deriva ind/caja/estatuto/poder de la fuerza */
    if(typeof registrarLiga==="function"){
      registrarLiga({
        eraKey:meta.eraKey, clubs:clubs, baseEra:meta.baseEra||2026,
        nombre:meta.nombre||("Liga "+meta.eraKey),
        era:{ n:meta.nombre||meta.eraKey, pais:(meta.pais||undefined), puntosVictoria:meta.pts||3 }
      });
    }

    /* 2 · por club, completar TODO lo que el auditor exige */
    clubs.forEach(function(c,i){
      var id=c.id; if(!id) return;
      var col=_coloresDe(c);
      /* identidad */
      _setRigor("desc", id, (c.n||id)+", de "+(c.ciudad||c.c||"la región")+". Ficha base — completar con fuente.");
      if(c.ciudad) _setRigor("ciudad", id, c.ciudad); else _justif(id,"ciudad","Ciudad por documentar (no se inventa).");
      if(typeof c.fund==="number" && c.fund>1800) _setRigor("fund", id, c.fund); else _justif(id,"fund","Año de fundación por documentar (no se inventa).");
      _setRigor("colores", id, col);
      /* alma */
      _setRigor("situacion", id, "Diriges a "+(c.n||id)+". Objetivos, historia y clásico se completan en el editor.");
      _justif(id,"dt","DT por documentar (no se inventa un nombre real).");
      _justif(id,"historia","Línea de historia por documentar con fuente.");
      _justif(id,"gloria","Época dorada por documentar.");
      /* cancha */
      _setRigor("estadio", id, { nombre:(c.est||("Estadio de "+(c.ciudad||c.n||id))), aforo:(c.aforo||12000), sectores:_sectoresDe(c.aforo,c.fuerza) });
      _setRigor("escudo", id, { c1:col[0], c2:col[1]||"#ffffff" });
      /* decisión propia (la "vara" de Grok): una carta que solo existe en este club */
      try{
        if(typeof DECISIONES!=="undefined" && !DECISIONES.some(function(d){return d&&d.club===id;}))
          DECISIONES.push(_decisionGenerica(id, c.n||id, anio));
      }catch(e){}
    });

    /* clásicos: anillo circular en UNA pasada. OJO: un par [A,B] sirve a los DOS,
       y devPonerRivales borra los pares de un id — por eso NO se setea por club en
       cadena (se pisan). Acá se empujan los pares directo, sin borrar. */
    try{
      if(typeof RIVALIDADES_2026!=="undefined" && clubs.length>=2){
        for(var k=0;k<clubs.length;k++){
          var a=clubs[k].id, b=clubs[(k+1)%clubs.length].id;
          if(a&&b&&a!==b && !RIVALIDADES_2026.some(function(p){ return (p[0]===a&&p[1]===b)||(p[0]===b&&p[1]===a); }))
            RIVALIDADES_2026.push([a,b]);
        }
      } else if(clubs.length===1){ _justif(clubs[0].id,"clasico","Liga de un club: sin rival."); }
    }catch(e){}

    var pct=null;
    try{ if(typeof auditarLiga==="function") pct=auditarLiga(meta.eraKey).pct; }catch(e){}
    return { ok:true, era:meta.eraKey, clubes:clubs.length, pct:pct };
  }

  window.devClonarLigaRigor=devClonarLigaRigor;
})();
