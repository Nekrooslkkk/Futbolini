"use strict";
/* ============================================================
   FUTBOLINI · dev-esquema.js  (motor de edición · parte 1 de 3)
   EL CONTRATO DE RIGOR. Define, campo por campo, qué necesita un club para
   estar tan detallado como Colo-Colo, y qué necesita una liga para estar
   tan completa como la Primera chilena.

   No toca nada del juego: solo DESCRIBE dónde vive cada dato. Lo usan
   dev-auditor.js (puntúa) y dev-editor.js (edita).

   Si mañana copiamos la liga danesa, este archivo es la lista de lo que
   hay que llenar para que quede al nivel del resto. Ver PLANTILLA_LIGA.md.
   ============================================================ */

/* Lee un mapa global {id:valor}. OJO: las estructuras del juego se declaran con
   `const`, y los `const` NO quedan colgados de `window`; por eso hay que nombrarlas
   explícitamente acá (nada de eval). Si sumás una estructura nueva, agregala. */
function _devMapa(nombre){
  try{
    switch(nombre){
      case "CLUB_INFO_2026":   return (typeof CLUB_INFO_2026   !=="undefined")?CLUB_INFO_2026   :null;
      case "CLUB_META":        return (typeof CLUB_META        !=="undefined")?CLUB_META        :null;
      case "IND_BASE_2026":    return (typeof IND_BASE_2026    !=="undefined")?IND_BASE_2026    :null;
      case "CAJA_BASE_2026":   return (typeof CAJA_BASE_2026   !=="undefined")?CAJA_BASE_2026   :null;
      case "ESTATUTO_INICIAL": return (typeof ESTATUTO_INICIAL !=="undefined")?ESTATUTO_INICIAL :null;
      case "PODER_CLUB":       return (typeof PODER_CLUB       !=="undefined")?PODER_CLUB       :null;
      case "SITUACION_CLUB":   return (typeof SITUACION_CLUB   !=="undefined")?SITUACION_CLUB   :null;
      case "HISTORIA_LINEA":   return (typeof HISTORIA_LINEA   !=="undefined")?HISTORIA_LINEA   :null;
      case "EPOCAS_CLUB":      return (typeof EPOCAS_CLUB      !=="undefined")?EPOCAS_CLUB      :null;
      case "ESTADIOS_DATA":    return (typeof ESTADIOS_DATA    !=="undefined")?ESTADIOS_DATA    :null;
      case "ESCUDOS_CLUB":     return (typeof ESCUDOS_CLUB     !=="undefined")?ESCUDOS_CLUB     :null;
      case "ESCUDOS_FOTOS":    return (typeof ESCUDOS_FOTOS    !=="undefined")?ESCUDOS_FOTOS    :null;
      case "PLANTELES_REALES": return (typeof PLANTELES_REALES !=="undefined")?PLANTELES_REALES :null;
      case "LIGAS":            return (typeof LIGAS            !=="undefined")?LIGAS            :null;
      case "ERA":              return (typeof ERA              !=="undefined")?ERA              :null;
      case "DECISIONES":       return (typeof DECISIONES       !=="undefined")?DECISIONES       :null;
    }
  }catch(e){}
  return null;
}
function _devDe(nombre,id){ var m=_devMapa(nombre); return (m&&m[id]!=null)?m[id]:null; }
/* ¿el texto tiene contenido de verdad (no vacío, no placeholder)? */
function _devTxt(v){
  if(typeof v!=="string") return null;
  var t=v.trim();
  if(!t || /^(PEGA_LINK|TODO|—|-)$/i.test(t)) return null;
  return t;
}
/* ¿el objeto tiene TODAS estas claves con número? */
function _devNums(o,claves){
  if(!o||typeof o!=="object") return null;
  for(var i=0;i<claves.length;i++){ if(typeof o[claves[i]]!=="number") return null; }
  return o;
}

/* AUSENCIAS JUSTIFICADAS. Regla inviolable del proyecto: si un dato no está
   documentado, NO se inventa. Acá se declara "falta a propósito" para que la
   auditoría no lo cuente como hueco ni empuje a rellenarlo con humo.
   Clave: "ID.campo" → motivo. */
var DEV_SIN_DATO={
  "SCI.fund":"Fundación no documentada con certeza (2020 vs 2022). No se inventa."
};
function devJustificado(id,campo){ return DEV_SIN_DATO[id+"."+campo]||null; }

var IND_CLAVES=["plantel","moral","hinchada","socios","cantera","estadio","prestigio","riesgo"];

/* ---------- ESQUEMA DE CLUB ----------
   grupo  = pestaña del editor
   req    = cuenta para el % de rigor (los opcionales suman aparte)
   donde  = estructura global real donde vive (para el export)
   get(id)= devuelve el valor o null si falta
*/
var ESQUEMA_CLUB=[
  /* --- identidad --- */
  {k:"nombre",   grupo:"identidad", n:"Nombre del club",        req:true, tipo:"texto", donde:"CLUB_INFO_2026[id].n",
   get:function(id){ var o=_devDe("CLUB_INFO_2026",id); return o?_devTxt(o.n):null; },
   set:function(id,v){ _devSet("CLUB_INFO_2026",id,"n",v); try{ if(typeof CLUB_INFO!=="undefined"&&CLUB_INFO[id]) CLUB_INFO[id].n=v; }catch(e){} }},
  {k:"desc",     grupo:"identidad", n:"Descripción (quién es)", req:true, tipo:"parrafo", donde:"CLUB_INFO_2026[id].desc",
   get:function(id){ var o=_devDe("CLUB_INFO_2026",id); return o?_devTxt(o.desc):null; },
   set:function(id,v){ _devSet("CLUB_INFO_2026",id,"desc",v); }},
  {k:"dt",       grupo:"identidad", n:"Técnico",                req:true, tipo:"texto", donde:"CLUB_INFO_2026[id].dt",
   get:function(id){ var o=_devDe("CLUB_INFO_2026",id); var t=o?_devTxt(o.dt):null;
                     return (t&&t!=="el cuerpo técnico")?t:null; },
   set:function(id,v){ _devSet("CLUB_INFO_2026",id,"dt",v); }},
  {k:"ciudad",   grupo:"identidad", n:"Ciudad",                 req:true, tipo:"texto", donde:"CLUB_META[id].ciudad",
   get:function(id){ var o=_devDe("CLUB_META",id); return o?_devTxt(o.ciudad):null; },
   set:function(id,v){ _devSet("CLUB_META",id,"ciudad",v); }},
  {k:"fund",     grupo:"identidad", n:"Año de fundación",       req:true, tipo:"numero", donde:"CLUB_META[id].fund",
   get:function(id){ var o=_devDe("CLUB_META",id); return (o&&typeof o.fund==="number")?o.fund:null; },
   set:function(id,v){ _devSet("CLUB_META",id,"fund",parseInt(v,10)||null); }},
  {k:"colores",  grupo:"identidad", n:"Colores (hex)",          req:true, tipo:"json", donde:"CLUB_META[id].colores",
   get:function(id){ var o=_devDe("CLUB_META",id); return (o&&o.colores&&o.colores.length>=2)?o.colores:null; },
   set:function(id,v){ _devSet("CLUB_META",id,"colores",v); }},

  /* --- números de arranque --- */
  {k:"ind",      grupo:"numeros",   n:"Indicadores (los 8)",    req:true, tipo:"json", donde:"IND_BASE_2026[id]",
   get:function(id){ return _devNums(_devDe("IND_BASE_2026",id), IND_CLAVES); },
   set:function(id,v){ _devPone("IND_BASE_2026",id,v); }},
  {k:"caja",     grupo:"numeros",   n:"Caja (plata y deuda)",   req:true, tipo:"json", donde:"CAJA_BASE_2026[id]",
   get:function(id){ return _devNums(_devDe("CAJA_BASE_2026",id), ["plata","deuda"]); },
   set:function(id,v){ _devPone("CAJA_BASE_2026",id,v); }},
  {k:"estatuto", grupo:"numeros",   n:"Estatuto del club",      req:true, tipo:"json", donde:"ESTATUTO_INICIAL[id]",
   get:function(id){ var o=_devDe("ESTATUTO_INICIAL",id); return (o&&Object.keys(o).length>=4)?o:null; },
   set:function(id,v){ _devPone("ESTATUTO_INICIAL",id,v); }},
  {k:"poder",    grupo:"numeros",   n:"Mapa de poder",          req:true, tipo:"json", donde:"PODER_CLUB[id]",
   get:function(id){ var o=_devDe("PODER_CLUB",id); return (o&&Object.keys(o).length>=5)?o:null; },
   set:function(id,v){ _devPone("PODER_CLUB",id,v); }},

  /* --- alma del club --- */
  {k:"situacion",grupo:"alma", n:"Situación (por qué juego a esto)", req:true, tipo:"parrafo", donde:"SITUACION_CLUB[id]",
   get:function(id){ return _devTxt(_devDe("SITUACION_CLUB",id)); },
   set:function(id,v){ _devPone("SITUACION_CLUB",id,v); }},
  {k:"historia", grupo:"alma", n:"Línea de historia (hitos)",   req:true, tipo:"json", donde:"HISTORIA_LINEA[id]",
   get:function(id){ var a=_devDe("HISTORIA_LINEA",id); return (a&&a.length)?a:null; },
   set:function(id,v){ _devPone("HISTORIA_LINEA",id,v); }},
  {k:"clasico",  grupo:"alma", n:"Clásico / rival",             req:true, tipo:"lista", donde:"RIVALIDADES_2026 (+ trío grande en partido.js)",
   get:function(id){ var r=devRivalesDe(id); return r.length?r:null; },
   set:function(id,v){ devPonerRivales(id,v); }},
  {k:"gloria",   grupo:"alma", n:"Época dorada (botón oro)",    req:true, tipo:"json", donde:"EPOCAS_CLUB[id] / era base con gloria",
   get:function(id){ var a=_devDe("EPOCAS_CLUB",id); if(a&&a.length) return a;
     /* caso Colo-Colo: su gloria (1991 Libertadores) es una ERA BASE marcada
        `gloria:true` en ui.js/elegirEpoca, no una entrada de EPOCAS_CLUB. */
     return GLORIA_ERA_BASE[id]?[{anio:GLORIA_ERA_BASE[id],etq:"era base",eraBase:true}]:null; },
   set:function(id,v){ _devPone("EPOCAS_CLUB",id,v); }},

  /* --- cancha y cara --- */
  {k:"estadio",  grupo:"cancha", n:"Estadio (sectores y precios)", req:true, tipo:"json", donde:"ESTADIOS_DATA[id]",
   get:function(id){ var o=_devDe("ESTADIOS_DATA",id);
                     return (o&&o.nombre&&typeof o.aforo==="number"&&o.sectores&&o.sectores.length)?o:null; },
   set:function(id,v){ _devPone("ESTADIOS_DATA",id,v); }},
  {k:"escudo",   grupo:"cancha", n:"Escudo estilizado (colores)", req:true, tipo:"json", donde:"ESCUDOS_CLUB[id]",
   get:function(id){ var o=_devDe("ESCUDOS_CLUB",id); return (o&&o.c1)?o:null; },
   set:function(id,v){ _devPone("ESCUDOS_CLUB",id,v); }},
  {k:"escudoImg",grupo:"cancha", n:"Escudo archivo (svg/png)",  req:false, tipo:"json", donde:"ESCUDOS_FOTOS[id]",
   get:function(id){ var o=_devDe("ESCUDOS_FOTOS",id); return (o&&o.src)?o:null; },
   set:function(id,v){ _devPone("ESCUDOS_FOTOS",id,v); }},
  {k:"decisiones",grupo:"alma", n:"Decisión propia del club",  req:true, tipo:"ro", donde:"DECISIONES (campo .club)",
   get:function(id){ var n=devDecisionesDe(id); return n.length?n:null; }},

  {k:"plantel",  grupo:"cancha", n:"Plantel real documentado",  req:false, tipo:"ro", donde:"PLANTELES_REALES[id]",
   get:function(id){ var o=_devDe("PLANTELES_REALES",id);
                     if(!o) return null; var k=Object.keys(o); return k.length?o:null; }},
];

/* --- escritura segura sobre los mapas del juego --- */
function _devSet(nombre,id,campo,valor){
  var m=_devMapa(nombre); if(!m) return false;
  if(!m[id]||typeof m[id]!=="object") m[id]={};
  if(valor===null||valor==="") delete m[id][campo]; else m[id][campo]=valor;
  return true;
}
function _devPone(nombre,id,valor){
  var m=_devMapa(nombre); if(!m) return false;
  if(valor===null) delete m[id]; else m[id]=valor;
  return true;
}
/* reemplaza los rivales de un club en RIVALIDADES_2026 (respeta el trío hardcodeado) */
function devPonerRivales(id,lista){
  try{
    if(typeof RIVALIDADES_2026==="undefined") return false;
    for(var i=RIVALIDADES_2026.length-1;i>=0;i--){
      var p=RIVALIDADES_2026[i];
      if(p[0]===id||p[1]===id) RIVALIDADES_2026.splice(i,1);
    }
    (lista||[]).forEach(function(r){ if(r&&r!==id) RIVALIDADES_2026.push([id,r]); });
    return true;
  }catch(e){ return false; }
}

/* Clubes cuya época dorada se juega como ERA BASE (no como entrada de EPOCAS_CLUB).
   Espejo de lo que marca ui.js en elegirEpoca con `gloria:true`. */
var GLORIA_ERA_BASE={ CC:1991 };

/* Rivalidades que NO viven en RIVALIDADES_2026: el trío grande está hardcodeado
   en partido.js/esClasico. Una liga extranjera solo puede usar el array, así que
   esto se declara acá para que la auditoría no dé falsos negativos. */
var CLASICO_HARDCODE=["CC","UCH","UC"];

/* Decisiones que SOLO le pasan a este club (la vara de Grok en data-rigor-801.js:
   "que cada semana te llegue una carta que solo existe en ese club"). */
function devDecisionesDe(id){
  var out=[];
  try{
    var D=_devMapa("DECISIONES"); if(!D||!D.length) return out;
    D.forEach(function(d){ if(d && d.club===id) out.push(d.id||"?"); });
  }catch(e){}
  return out;
}

/* ¿el jugador puede ELEGIR este club? El picker de inicio ofrece los de
   CLUB_INFO (core 1991) + CLUB_INFO_2026 + B + C + Argentina. Los que solo
   figuran como RIVAL del calendario (ej. CBS, FV en 1991) no se manejan, así
   que no tiene sentido exigirles ficha completa: quedan fuera del promedio. */
function devEsJugable(id){
  try{
    var a=_devMapa("CLUB_INFO_2026"), b=(typeof CLUB_INFO!=="undefined")?CLUB_INFO:null;
    if(a&&a[id]) return true;
    if(b&&b[id]) return true;
  }catch(e){}
  return false;
}

/* rivales declarados de un club (array de pares + trío hardcodeado) */
function devRivalesDe(id){
  var out=[];
  if(CLASICO_HARDCODE.indexOf(id)>=0){
    CLASICO_HARDCODE.forEach(function(x){ if(x!==id) out.push(x); });
  }
  try{
    var R=(typeof RIVALIDADES_2026!=="undefined")?RIVALIDADES_2026:null;
    if(!R) return out;
    R.forEach(function(p){
      if(p[0]===id && out.indexOf(p[1])<0) out.push(p[1]);
      else if(p[1]===id && out.indexOf(p[0])<0) out.push(p[0]);
    });
  }catch(e){}
  return out;
}

/* ---------- ESQUEMA DE LIGA ---------- */
var ESQUEMA_LIGA=[
  {k:"clubs",   n:"Array de clubes",            req:true, donde:"LIGAS[era]",
   get:function(era){ var L=_devDe("LIGAS",era); return (L&&L.length)?L:null; }},
  {k:"nombre",  n:"Nombre del torneo",          req:true, donde:"ERA[era].n",
   get:function(era){ var o=_devDe("ERA",era); return o?_devTxt(o.n):null; }},
  {k:"desc",    n:"Descripción de la época",    req:true, donde:"ERA[era].desc",
   get:function(era){ var o=_devDe("ERA",era); return o?_devTxt(o.desc):null; }},
  {k:"puntos",  n:"Puntos por victoria",        req:true, donde:"ERA[era].puntosVictoria",
   get:function(era){ var o=_devDe("ERA",era); return (o&&typeof o.puntosVictoria==="number")?o.puntosVictoria:null; }},
  {k:"pais",    n:"País / federación",          req:true, donde:"ERA[era].pais / paisDeEra()",
   get:function(era){ var o=_devDe("ERA",era); var p=o?_devTxt(o.pais):null;
     if(p) return p;
     try{ if(typeof paisDeEra==="function") return _devTxt(paisDeEra(era)); }catch(e){}
     return null; }},
];

/* agrupaciones para el editor */
var DEV_GRUPOS=[
  {k:"identidad", n:"Identidad", ic:"🪪"},
  {k:"numeros",   n:"Números",   ic:"📊"},
  {k:"alma",      n:"Alma",      ic:"❤️"},
  {k:"cancha",    n:"Cancha y cara", ic:"🏟️"}
];

/* Aplica un parche {ID:{campo:valor}} sobre los mapas del juego usando el
   esquema. Lo usa el editor y los archivos de parche que exporta. */
function aplicarParcheClubes(parche){
  if(!parche||typeof parche!=="object") return 0;
  var n=0;
  Object.keys(parche).forEach(function(id){
    var campos=parche[id]||{};
    Object.keys(campos).forEach(function(k){
      var c=null;
      for(var i=0;i<ESQUEMA_CLUB.length;i++) if(ESQUEMA_CLUB[i].k===k){ c=ESQUEMA_CLUB[i]; break; }
      if(!c||typeof c.set!=="function") return;
      try{ c.set(id, campos[k]); n++; }catch(e){}
    });
  });
  return n;
}

/* PEGAR un club. Si A (nombre) cambia, B (CLUB_INFO 1991) también.
   HTML se recorta: esto entra al picker. */
function parsearPegarClub(txt){
  var out={}, lines=String(txt||"").split(/\r?\n/);
  lines.forEach(function(ln){
    var m=String(ln).match(/^\s*([A-Za-zÁÉÍÓÚÑáéíóúñ_]+)\s*[:：]\s*(.+)\s*$/);
    if(!m) return;
    var k=m[1].toLowerCase().replace(/[áà]/g,"a").replace(/[éè]/g,"e").replace(/[íì]/g,"i").replace(/[óò]/g,"o").replace(/[úù]/g,"u");
    var v=m[2].trim();
    if(k==="id"||k==="codigo"||k==="sigla") out.id=v.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);
    else if(k==="nombre"||k==="club") out.nombre=v;
    else if(k==="ciudad") out.ciudad=v;
    else if(k==="fund"||k==="fundacion") out.fund=parseInt(v,10)||null;
    else if(k==="dt"||k==="tecnico") out.dt=v;
    else if(k==="desc"||k==="descripcion") out.desc=v;
    else if(k==="situacion") out.situacion=v;
    else if(k==="liga"||k==="era") out.liga=v;
  });
  return out;
}
function _devLimpiaTxt(s,max){
  if(typeof textoLimpio==="function") return textoLimpio(s,max||400);
  s=String(s==null?"":s).replace(/<[^>]*>/g,"");
  return s.trim().slice(0,max||400);
}
function _devPonerEnLiga(era,id,nombre){
  try{
    era=String(era==null?"2026":era);
    if(typeof LIGAS==="undefined"||!LIGAS[era]) return false;
    var hay=false;
    LIGAS[era].forEach(function(c){
      if(c&&c.id===id){ hay=true; if(nombre) c.n=nombre; }
    });
    if(hay) return true;
    LIGAS[era].push({id:id, n:nombre||id, c:nombre||id, fuerza:55, aforo:8000, est:"Estadio", ciudad:""});
    return true;
  }catch(e){ return false; }
}
function crearClubDesdePegar(txt){
  var d=parsearPegarClub(txt);
  if(!d.id||d.id.length<2) return {ok:false,msg:"Falta el ID (2 a 6 letras, ej. SMO)"};
  d.nombre=_devLimpiaTxt(d.nombre||"",80);
  if(!d.nombre) return {ok:false,msg:"Falta el nombre"};
  var id=d.id;
  _devSet("CLUB_INFO_2026",id,"n",d.nombre);
  if(d.desc) _devSet("CLUB_INFO_2026",id,"desc",_devLimpiaTxt(d.desc,400));
  if(d.dt) _devSet("CLUB_INFO_2026",id,"dt",_devLimpiaTxt(d.dt,80));
  if(d.ciudad) _devSet("CLUB_META",id,"ciudad",_devLimpiaTxt(d.ciudad,80));
  if(d.fund && d.fund>1800 && d.fund<2100) _devSet("CLUB_META",id,"fund",d.fund);
  if(d.situacion) _devPone("SITUACION_CLUB",id,_devLimpiaTxt(d.situacion,500));
  try{ if(typeof CLUB_INFO!=="undefined"&&CLUB_INFO[id]) CLUB_INFO[id].n=d.nombre;
       else if(typeof CLUB_INFO!=="undefined") CLUB_INFO[id]={n:d.nombre}; }catch(e){}
  if(d.liga) _devPonerEnLiga(d.liga,id,d.nombre);
  return {ok:true,id:id,nombre:d.nombre,liga:d.liga||null};
}
function PEGAR_CLUB_EJEMPLO(){
  return "ID: XXX\nnombre: Club de ejemplo\nciudad: Santiago\nfund: 1909\ndt: Cuerpo técnico\nliga: 2026\ndesc: Quién es este club, en una frase.\nsituacion: Por qué el jugador elige dirigir acá.";
}
