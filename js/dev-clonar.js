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
  /* perfil según la fuerza: da vida a desc/situación sin inventar hechos */
  function _perfilFuerza(f){
    f=f||55;
    if(f>=78) return { desc:"uno de los pesos pesados", meta:"Te contratan para ganar el título y competir en el continente." };
    if(f>=70) return { desc:"un club consolidado", meta:"El objetivo es meterse arriba y pelear un cupo internacional." };
    if(f>=60) return { desc:"un club de mitad de tabla", meta:"Estabilizar el club y soñar con dar el salto es el mandato." };
    return { desc:"un club chico", meta:"Sobrevivir en la categoría y crecer de a poco es la misión." };
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
    /* 7.9025 · antes 6000+(f-30)*260: un club fuerza 90 quedaba con palco a 112.320, y el
       palco más caro documentado de Chile (Rapa Nui, Colo-Colo) es 45.000. Misma banda que
       el resto del juego: popular 5.000–9.200, palco hasta ~48 mil. */
    var p=Math.round((5000+(Math.max(30,Math.min(90,fuerza||55))-30)*70)/100)*100;   /* precio popular según fuerza */
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
      var tier=_perfilFuerza(c.fuerza), ciu=(c.ciudad||c.c||"la región");
      /* identidad — descripción derivada del tier (más viva que un placeholder pelado) */
      _setRigor("desc", id, (c.n||id)+", "+tier.desc+" de "+ciu+". (Ficha base del clonador — completar con fuente.)");
      if(c.ciudad) _setRigor("ciudad", id, c.ciudad); else _justif(id,"ciudad","Ciudad por documentar (no se inventa).");
      if(typeof c.fund==="number" && c.fund>1800) _setRigor("fund", id, c.fund); else _justif(id,"fund","Año de fundación por documentar (no se inventa).");
      _setRigor("colores", id, col);
      /* alma — la situación arranca del objetivo que impone el tamaño del club */
      _setRigor("situacion", id, "Diriges a "+(c.n||id)+". "+tier.meta+" Historia, clásico y DT se completan en el editor.");
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

  /* ---------- EXPORTAR el clon a un .js PERSISTENTE ----------
     Lee el estado EN VIVO (después de devClonarLigaRigor) y serializa TODO el
     rigor de esos clubes a un data file autocontenido. Cargándolo en index.html
     la liga vuelve a quedar al 100% sin re-clonar. */
  function _mapa(nombre){ return (typeof _devMapa==="function")?_devMapa(nombre):null; }
  function _slice(nombre,ids){ var m=_mapa(nombre)||{}, o={}; ids.forEach(function(id){ if(m[id]!=null) o[id]=m[id]; }); return o; }
  function _jstr(s){ return '"'+String(s==null?"":s).replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'; }
  function devExportarLigaRigor(clubs, meta){
    if(!clubs||!clubs.length||!meta||!meta.eraKey) return "";
    var ids=clubs.map(function(c){return c.id;});
    var fecha=new Date().toISOString().slice(0,10);
    var varName="LIGA_"+meta.eraKey.toUpperCase().replace(/[^A-Z0-9]/g,"_");
    var J=function(o){ return JSON.stringify(o,null,0); };
    /* club array para registrarLiga (registra LIGAS/ERA; los detalles van aparte) */
    var lineas=clubs.map(function(c){
      return "  {id:"+_jstr(c.id)+",n:"+_jstr(c.n)+",c:"+_jstr(c.c||c.n)+",fuerza:"+(c.fuerza||55)+
             ",aforo:"+(c.aforo||0)+",est:"+_jstr(c.est||"")+",ciudad:"+_jstr(c.ciudad||"")+",z:\"—\"}";
    }).join(",\n");
    /* slices en vivo de cada estructura */
    var infos=_slice("CLUB_INFO_2026",ids), metas=_slice("CLUB_META",ids), inds=_slice("IND_BASE_2026",ids),
        cajas=_slice("CAJA_BASE_2026",ids), estat=_slice("ESTATUTO_INICIAL",ids), poder=_slice("PODER_CLUB",ids),
        sit=_slice("SITUACION_CLUB",ids), estad=_slice("ESTADIOS_DATA",ids), esc=_slice("ESCUDOS_CLUB",ids),
        hist=_slice("HISTORIA_LINEA",ids), epo=_slice("EPOCAS_CLUB",ids);
    var D=_mapa("DECISIONES")||[]; var decs=D.filter(function(d){ return d && ids.indexOf(d.club)>=0; });
    var R=(typeof RIVALIDADES_2026!=="undefined")?RIVALIDADES_2026:[];
    var rivs=R.filter(function(p){ return ids.indexOf(p[0])>=0 || ids.indexOf(p[1])>=0; });
    var sd={}; if(typeof DEV_SIN_DATO==="object") Object.keys(DEV_SIN_DATO).forEach(function(k){ if(ids.indexOf(String(k).split(".")[0])>=0) sd[k]=DEV_SIN_DATO[k]; });

    return '"use strict";\n'+
      '/* ============================================================\n'+
      '   FUTBOLINI · data-liga-'+meta.eraKey+'.js  (LIGA A RIGOR COLO-COLO)\n'+
      '   Generada por el Editor ('+fecha+'). Cada club al 100% de rigor.\n'+
      '   Cargar en index.html DESPUÉS de liga-registrar.js y dev-esquema.js.\n'+
      '   INTEGRIDAD: los datos duros (DT/fundación/historia/gloria) van marcados\n'+
      '   como "por documentar" en DEV_SIN_DATO — reemplazalos con fuente real.\n'+
      '   ============================================================ */\n'+
      'var '+varName+'=[\n'+lineas+'\n];\n'+
      'if(typeof registrarLiga==="function"){ registrarLiga({eraKey:'+_jstr(meta.eraKey)+',clubs:'+varName+
        ',baseEra:'+_jstr(meta.baseEra||"2026")+',nombre:'+_jstr(meta.nombre||meta.eraKey)+
        ',era:{n:'+_jstr(meta.nombre||meta.eraKey)+(meta.pais?',pais:'+_jstr(meta.pais):'')+',puntosVictoria:'+(meta.pts||3)+'}}); }\n'+
      '(function(){\n'+
      '  function fus(mapa,data){ if(typeof mapa!=="object"||!mapa) return; Object.keys(data).forEach(function(id){ mapa[id]=Object.assign(mapa[id]||{},data[id]); }); }\n'+
      '  function put(mapa,data){ if(typeof mapa!=="object"||!mapa) return; Object.keys(data).forEach(function(id){ mapa[id]=data[id]; }); }\n'+
      '  try{ if(typeof CLUB_INFO_2026!=="undefined") fus(CLUB_INFO_2026,'+J(infos)+'); }catch(e){}\n'+
      '  try{ if(typeof CLUB_INFO!=="undefined") Object.keys('+J(infos)+').forEach(function(id){ if(!CLUB_INFO[id]) CLUB_INFO[id]=CLUB_INFO_2026[id]; }); }catch(e){}\n'+
      '  try{ if(typeof CLUB_META!=="undefined") fus(CLUB_META,'+J(metas)+'); }catch(e){}\n'+
      '  try{ if(typeof IND_BASE_2026!=="undefined") put(IND_BASE_2026,'+J(inds)+'); }catch(e){}\n'+
      '  try{ if(typeof CAJA_BASE_2026!=="undefined") put(CAJA_BASE_2026,'+J(cajas)+'); }catch(e){}\n'+
      '  try{ if(typeof ESTATUTO_INICIAL!=="undefined") put(ESTATUTO_INICIAL,'+J(estat)+'); }catch(e){}\n'+
      '  try{ if(typeof PODER_CLUB!=="undefined") put(PODER_CLUB,'+J(poder)+'); }catch(e){}\n'+
      '  try{ if(typeof SITUACION_CLUB!=="undefined") put(SITUACION_CLUB,'+J(sit)+'); }catch(e){}\n'+
      '  try{ if(typeof ESTADIOS_DATA!=="undefined") put(ESTADIOS_DATA,'+J(estad)+'); }catch(e){}\n'+
      '  try{ if(typeof ESCUDOS_CLUB!=="undefined") put(ESCUDOS_CLUB,'+J(esc)+'); }catch(e){}\n'+
      '  try{ if(typeof HISTORIA_LINEA!=="undefined") put(HISTORIA_LINEA,'+J(hist)+'); }catch(e){}\n'+
      '  try{ if(typeof EPOCAS_CLUB!=="undefined") put(EPOCAS_CLUB,'+J(epo)+'); }catch(e){}\n'+
      '  try{ if(typeof DECISIONES!=="undefined"){ '+J(decs)+'.forEach(function(d){ if(!DECISIONES.some(function(x){return x.id===d.id;})) DECISIONES.push(d); }); } }catch(e){}\n'+
      '  try{ if(typeof RIVALIDADES_2026!=="undefined"){ '+J(rivs)+'.forEach(function(p){ if(!RIVALIDADES_2026.some(function(q){return (q[0]===p[0]&&q[1]===p[1])||(q[0]===p[1]&&q[1]===p[0]);})) RIVALIDADES_2026.push(p); }); } }catch(e){}\n'+
      '  try{ if(typeof DEV_SIN_DATO==="object") Object.assign(DEV_SIN_DATO,'+J(sd)+'); }catch(e){}\n'+
      '})();\n';
  }

  window.devClonarLigaRigor=devClonarLigaRigor;
  window.devExportarLigaRigor=devExportarLigaRigor;
})();
