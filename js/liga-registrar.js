"use strict";
/* ============================================================
   FUTBOLINI · liga-registrar.js  (7.67)
   Empaquetado para AGREGAR UNA LIGA con UNA sola llamada.
   En vez de repetir a mano CLUB_INFO / IND_BASE / CAJA / ESTATUTO / PODER
   (como hace data-segunda2026.js), definís el array de clubes y llamás a
   `registrarLiga(cfg)`: el helper deriva todo de la `fuerza` de cada club
   (y respeta lo que pongas explícito). Así copiar la Liga Argentina (u otra)
   es: array de clubes + una línea. Ver REGLAS.md para el molde y el prompt.

   Esquema de club (mínimo):
     { id:"BOC", n:"Boca Juniors", c:"Boca", fuerza:82, aforo:54000,
       est:"La Bombonera", ciudad:"Buenos Aires", z:"—" }
   Campos opcionales por club (si no, se derivan de la fuerza):
     esc (emoji), dt, desc, ind{...}, caja{plata,deuda}, estatuto{...}, poder{...}

   Uso:
     registrarLiga({ eraKey:"arg2026", clubs:LIGA_ARG_2026, baseEra:2026,
                     nombre:"Liga Profesional Argentina",
                     copas:[{id:"copaArg", nombre:"Copa Argentina", tipo:"eliminacion"}] });
   Crear una liga = este par: clubs + (opcional) copas. El motor deriva el resto.
   7.994 · helpers compartidos: calendarioZonal + tablaViva. Segunda (7) y AFA
   (15) usan lo mismo; crear una liga zonal es clubs + z + una llamada.
   ============================================================ */

/* Indicadores base derivados de la fuerza (0–90). Todo acotado 20–95. */
function _indDeFuerza(f){
  f=f||55;
  var cl=function(x){ return Math.max(20,Math.min(95,Math.round(x))); };
  return {
    plantel:cl(f), moral:cl(52+(f-55)*0.2), hinchada:cl(40+(f-45)*0.7),
    socios:cl(28+(f-45)*0.6), cantera:cl(44+(f-55)*0.2), estadio:cl(40+(f-50)*0.5),
    prestigio:cl(38+(f-45)*0.8), riesgo:cl(50-(f-50)*0.3)
  };
}
/* Caja base derivada de la fuerza. */
function _cajaDeFuerza(f){
  f=f||55;
  return { plata:Math.max(40,Math.round(60+(f-45)*4)), deuda:Math.max(20,Math.round(40+(f-45)*2.2)) };
}
var _ESTATUTO_DEF={propiedad:"club_social",modelo:"vendedor",identidad:"regional",
  finanzas:"austeridad",barra:"tolerancia",anfp:"bloque_chicos"};
var _PODER_DEF={directorio:48,socios:40,hinchada:48,camarin:52,tecnico:48,prensa:38,anfp:38,sponsors:36,comunidad:56};
var COPAS_DE_LIGA=typeof COPAS_DE_LIGA==="object"?COPAS_DE_LIGA:{};

/* Registra la liga completa. Devuelve la cantidad de clubes cableados. */
function registrarLiga(cfg){
  if(!cfg || !cfg.eraKey || !cfg.clubs || !cfg.clubs.length) return 0;
  var era=cfg.eraKey, clubs=cfg.clubs, base=cfg.baseEra!=null?cfg.baseEra:2026;

  /* 1 · la liga y su época */
  if(typeof LIGAS==="object") LIGAS[era]=clubs;
  if(typeof clubMapaTodosReset==="function") clubMapaTodosReset();
  if(typeof ERA==="object"){
    var eb=ERA[base]||ERA[2026]||{n:"2026",puntosVictoria:3};
    ERA[era]=cfg.era?Object.assign({},eb,cfg.era):Object.assign({},eb);
    if(cfg.nombre) ERA[era].n=cfg.nombre;
  }

  /* 2 · identidad / indicadores / caja / estatuto / poder (deriva o respeta overrides) */
  clubs.forEach(function(c){
    if(typeof CLUB_INFO_2026!=="undefined" && !CLUB_INFO_2026[c.id]){
      CLUB_INFO_2026[c.id]={ n:c.n, esc:c.esc||"⚪", est:c.est||("Estadio de "+(c.ciudad||c.c||c.n)),
        dt:c.dt||"el cuerpo técnico", desc:c.desc||((c.n)+", de "+(c.ciudad||"la región")+".") };
    }
    if(typeof IND_BASE_2026!=="undefined" && !IND_BASE_2026[c.id])
      IND_BASE_2026[c.id]=Object.assign(_indDeFuerza(c.fuerza), c.ind||{});
    if(typeof CAJA_BASE_2026!=="undefined" && !CAJA_BASE_2026[c.id])
      CAJA_BASE_2026[c.id]=Object.assign(_cajaDeFuerza(c.fuerza), c.caja||{});
    if(typeof ESTATUTO_INICIAL!=="undefined" && !ESTATUTO_INICIAL[c.id])
      ESTATUTO_INICIAL[c.id]=Object.assign({}, _ESTATUTO_DEF, cfg.estatuto||{}, c.estatuto||{});
    if(typeof PODER_CLUB!=="undefined" && !PODER_CLUB[c.id])
      PODER_CLUB[c.id]=Object.assign({}, _PODER_DEF, cfg.poder||{}, c.poder||{});
  });
  if(cfg.copas && cfg.copas.length){
    COPAS_DE_LIGA[era]=(COPAS_DE_LIGA[era]||[]).concat(cfg.copas);
  } else if(clubs.length>=2 && typeof esEraHardcode==="function" && !esEraHardcode(era)){
    /* liga clonada/nueva: copa doméstica automática (el campeonato solo no es liga completa) */
    var nomCopa=_nombreCopaDeMeta(cfg.nombre||era);
    COPAS_DE_LIGA[era]=[{id:"copaDom", nombre:nomCopa, tipo:"eliminacion"}];
    if(typeof ERA==="object" && ERA[era]) ERA[era].copa=nomCopa;
  }
  return clubs.length;
}
/* Predicados genéricos reutilizables por cualquier liga registrada. */
function idsDeLiga(eraKey){ return (typeof LIGAS==="object" && LIGAS[eraKey])?LIGAS[eraKey].map(function(c){return c.id;}):[]; }
function clubEnLiga(id, eraKey){ return idsDeLiga(eraKey).indexOf(id)>=0; }
function copasDeLiga(eraKey){ return (COPAS_DE_LIGA[eraKey]||[]).slice(); }

/* Orden de tabla (pts, DG, GF). Misma regla en liga, copa y liguilla. */
function ordenarFilasTabla(arr){
  return (arr||[]).slice().sort(function(a,b){
    if((b.pts||0)!==(a.pts||0)) return (b.pts||0)-(a.pts||0);
    var dx=(a.gf||0)-(a.gc||0), dy=(b.gf||0)-(b.gc||0);
    if(dy!==dx) return dy-dx;
    if((b.gf||0)!==(a.gf||0)) return (b.gf||0)-(a.gf||0);
    return String(a.id||"").localeCompare(String(b.id||""));
  });
}
/* Tabla VIVA: solo lo jugado. Nunca rellena los partidos que faltan.
   (Rellenar el resto era el bug de "todos con 12 PJ después de 1 fecha".) */
function tablaViva(ids, tab){
  tab=tab||{};
  var arr=(ids||[]).map(function(id){
    var t=tab[id]||{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
    var c=(typeof clubLookup==="function")?clubLookup(id):null;
    if(!c && typeof clubMundo==="function") c=clubMundo(id);
    return Object.assign({id:id, n:c?(c.c||c.n):id}, t);
  });
  return ordenarFilasTabla(arr);
}
function _clubCal(id){
  if(typeof clubLookup==="function"){ var a=clubLookup(id); if(a) return a; }
  if(typeof clubMundo==="function"){ var b=clubMundo(id); if(b) return b; }
  if(typeof CLUB_POR_ID!=="undefined" && CLUB_POR_ID[id]) return CLUB_POR_ID[id];
  return null;
}
/* Calendario zonal genérico (7 de Segunda, 15 de AFA, lo que venga).
   n impar → fixturesLiga mete bye; el jugador no tiene partido esa fecha. */
function calendarioZonal(clubId, clubsZona, opts){
  opts=opts||{};
  if(!clubsZona||!clubsZona.length||typeof fixturesLiga!=="function") return [];
  var fx=fixturesLiga(clubsZona);
  if(opts.soloIda) fx=fx.slice(0, Math.ceil(fx.length/2));
  if(opts.desde!=null||opts.hasta!=null) fx=fx.slice(opts.desde||0, opts.hasta!=null?opts.hasta:fx.length);
  var fechas=opts.fechas||[];
  var torneo=opts.torneo||"Liga";
  var fase=opts.fase||"zonal";
  var out=[], n=0, r, fecha, i, mio, local, riv, cRiv, yo, f;
  yo=_clubCal(clubId);
  for(r=0;r<fx.length;r++){
    fecha=fx[r]||[];
    mio=null;
    for(i=0;i<fecha.length;i++) if(fecha[i][0]===clubId||fecha[i][1]===clubId) mio=fecha[i];
    if(!mio) continue;
    local=mio[0]===clubId;
    riv=local?mio[1]:mio[0];
    if(riv==="__BYE__") continue;
    cRiv=_clubCal(riv);
    if(!cRiv) continue;
    f=fechas[n]||{m:Math.min(12, 2+Math.floor(n/4)), d:1+(n%4)*7};
    out.push({
      tipo:"liga", torneo:torneo, fase:fase, fecha:n+1, fxRonda:r,
      rivalId:riv, rivalNombre:cRiv.n||cRiv.c||riv, fuerzaRival:cRiv.fuerza||55,
      local:!!local, sede:local?((yo&&yo.est)||"local"):(cRiv.est||"visita"),
      f:f, jugado:false,
      clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,(torneo||"z")+clubId+n):"despejado",
      jornada:fecha.filter(function(p){ return p[0]!=="__BYE__"&&p[1]!=="__BYE__"; })
    });
    n++;
  }
  return out;
}
function fechasSemanales(m0, d0, n, topeM){
  var out=[], m=m0||1, d=d0||1, i, dim;
  var md=[31,28,31,30,31,30,31,31,30,31,30,31];
  for(i=0;i<n;i++){
    out.push({m:m,d:d});
    d+=7;
    dim=md[m-1]||31;
    while(d>dim){ d-=dim; m++; if(m>12) m=1; dim=md[m-1]||31; }
    if(topeM && m>topeM && m0<=topeM) { m=topeM; d=Math.min(28,d); }
  }
  return out;
}

/* ---------- copa doméstica de una liga registrada / clonada ----------
   Una liga completa = campeonato + copa. Si el autor no pasó copas:[],
   se arma un KO con los clubes de ESA liga (cero clubes inventados).
   Ligas estatales (Brasil, etc.) = copas:[{tipo:"estatal",...}] cuando
   haya clubes documentados. No se inventan. */
function _nombreCopaDeMeta(nombre){
  var n=String(nombre||"").replace(/^(Liga|Superliga|Campeonato)(\s+(de|Profesional))?\s+/i,"").trim();
  if(!n) n=String(nombre||"").trim();
  if(!n) return "Copa doméstica";
  if(/^Copa\s/i.test(n)) return n;
  return "Copa "+n;
}
function nombreCopaDomestica(era){
  era=era||(typeof E!=="undefined"&&E?E.eraBase:null);
  var copas=(typeof copasDeLiga==="function")?copasDeLiga(era):((typeof COPAS_DE_LIGA==="object"&&COPAS_DE_LIGA[era])||[]);
  if(copas.length && copas[0] && copas[0].nombre) return copas[0].nombre;
  if(typeof ERA==="object" && ERA[era] && ERA[era].copa) return ERA[era].copa;
  var n=(typeof ERA==="object" && ERA[era] && ERA[era].n) || "";
  return _nombreCopaDeMeta(n||era||"doméstica");
}
function _rondasCopaN(n){
  n=n||2;
  if(n<=2) return ["FINAL"];
  if(n<=4) return ["Semifinal","FINAL"];
  if(n<=8) return ["Cuartos","Semifinal","FINAL"];
  if(n<=16) return ["Octavos","Cuartos","Semifinal","FINAL"];
  return ["16avos","Octavos","Cuartos","Semifinal","FINAL"];
}
function _rivalesCopaDom(clubId, era){
  var clubs=(typeof LIGAS==="object" && LIGAS[era])?LIGAS[era]:[];
  return clubs.filter(function(c){ return c&&c.id&&c.id!==clubId; })
    .slice().sort(function(a,b){ return String(a.id).localeCompare(String(b.id)); });
}
function _mkCopaDom(clubId, riv, torneo, ronda, f, local){
  var yo=_clubCal(clubId);
  var cRiv=riv||{};
  local=!!local;
  return {
    tipo:"copa", torneo:torneo, ronda:ronda,
    rivalId:cRiv.id||null,
    rivalNombre:cRiv.n||cRiv.c||cRiv.id||"ganador de la otra llave",
    fuerzaRival:cRiv.fuerza||62,
    local:local,
    sede:local?((yo&&yo.est)||"local"):(cRiv.est||"estadio neutral"),
    f:f||{m:3,d:12}, jugado:false,
    clima:(typeof climaDeFecha==="function")?climaDeFecha((f&&f.m)||3,"copaDom"+clubId+ronda):"despejado",
    notaId:"CD-"+(clubId||"x")+"-"+(ronda||"R")
  };
}
function partidosCopaDomesticaDe(clubId, era){
  era=era||(typeof E!=="undefined"&&E?E.eraBase:null);
  if(!era || (typeof esEraHardcode==="function" && esEraHardcode(era))) return [];
  var clubs=(typeof LIGAS==="object" && LIGAS[era])?LIGAS[era]:[];
  if(!clubs || clubs.length<2) return [];
  var rivs=_rivalesCopaDom(clubId, era);
  if(!rivs.length) return [];
  var rondas=_rondasCopaN(clubs.length);
  var nom=nombreCopaDomestica(era);
  return [_mkCopaDom(clubId, rivs[0], nom, rondas[0], {m:3,d:12}, true)];
}
function resolverCopaDomestica(part, yo, otro){
  var nom=nombreCopaDomestica();
  var pasa=yo>otro, pens=false;
  if(yo===otro){
    if(part&&part.penales){ pasa=!!part.penales.gano; pens=true; }
    else { pasa=Math.random()<0.5; pens=true; }
  }
  var extra=pens
    ? (part&&part.penales
      ? (" Tanda "+part.penales.yo+"-"+part.penales.el+".")
      : " Empate: a penales.")
    : "";
  if(!pasa){
    if(typeof sacarCopaPendienteTorneo==="function") sacarCopaPendienteTorneo(nom);
    else if(E&&E.calendario) E.calendario=E.calendario.filter(function(p){ return !(p.tipo==="copa"&&p.torneo===nom&&!p.jugado); });
    if(typeof notificar==="function") notificar({t:"Eliminado de "+nom,tipo:"malo",
      d:"Fuera en "+(part.ronda||"ronda")+" "+yo+"-"+otro+" ante "+(part.rivalNombre||"el rival")+"."+extra});
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:-3,prestigio:-1});
    return;
  }
  if(part.ronda==="FINAL"){
    E.flags=E.flags||{};
    E.flags.copaCampeon=true;
    E.flags.copaCampeonTorneo=nom;
    if(E.titulos && E.titulos.indexOf(E.anio+" · "+nom)<0) E.titulos.push(E.anio+" · "+nom);
    if(typeof notificar==="function") notificar({t:"🏆 CAMPEÓN — "+nom,tipo:"bueno",
      d:"Campeón de "+nom+" "+E.anio+"."+extra});
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:8,prestigio:6,plata:180});
    return;
  }
  if(typeof aplicarEfectos==="function") aplicarEfectos({moral:3,plata:40});
  var era=E&&E.eraBase;
  var clubs=(typeof LIGAS==="object" && LIGAS[era])?LIGAS[era]:[];
  var rondas=_rondasCopaN(clubs.length);
  var idx=rondas.indexOf(part.ronda);
  var nxtR=rondas[idx+1]||"FINAL";
  var ya=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo===nom; }).map(function(p){ return p.rivalId; });
  var resto=_rivalesCopaDom(E.club, era).filter(function(c){ return ya.indexOf(c.id)<0; });
  resto.sort(function(a,b){ return (b.fuerza||0)-(a.fuerza||0); });
  var next=resto[0]||{id:null, n:"ganador de la otra llave", fuerza:64, est:"estadio neutral"};
  var f={m:Math.min(11, ((part.f&&part.f.m)||3)+2), d:18};
  var p=_mkCopaDom(E.club, next, nom, nxtR, f, false);
  if(typeof notificar==="function") notificar({t:"Avanza en "+nom,tipo:"bueno",
    d:"Pasaste "+(part.ronda||"ronda")+"."+extra+" Sigue "+nxtR+"."});
  if(typeof insertarCopaYOrdenar==="function") insertarCopaYOrdenar([p]);
  else if(E&&E.calendario){
    E.calendario.push(p);
    E.calendario.sort(function(a,b){
      var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
      var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
      return oa-ob;
    });
  }
}
(function wrapCalendarioCopaDom(){
  if(typeof construirCalendario!=="function" || construirCalendario._copaDom) return;
  var orig=construirCalendario;
  construirCalendario=function(clubId, anio, conCopa){
    if(typeof resolverCopa==="function" && !resolverCopa._copaDom){
      var origR=resolverCopa;
      resolverCopa=function(part, yo, otro){
        try{
          var nom=(typeof nombreCopaDomestica==="function")?nombreCopaDomestica():"";
          if(part && part.tipo==="copa" && nom && part.torneo===nom){
            resolverCopaDomestica(part, yo, otro); return;
          }
        }catch(e){}
        return origR.apply(this, arguments);
      };
      /* 7.9035 · hereda las marcas de los envoltorios de abajo (._uni, ._fmt54…) */
      try{ Object.keys(origR).forEach(function(k){ resolverCopa[k]=origR[k]; }); }catch(e){}
      resolverCopa._copaDom=true;
    }
    var cal=orig(clubId, anio, conCopa)||[];
    var era=(typeof E!=="undefined"&&E&&E.eraBase)||null;
    if(era && typeof esEraHardcode==="function" && !esEraHardcode(era) && conCopa!==false){
      var ya=cal.some(function(p){ return p&&p.tipo==="copa"; });
      if(!ya){
        (partidosCopaDomesticaDe(clubId, era)||[]).forEach(function(p){ cal.push(p); });
        cal.sort(function(a,b){
          var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
          var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
          return oa-ob;
        });
      }
    }
    return cal;
  };
  construirCalendario._copaDom=true;
})();

