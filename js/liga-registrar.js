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
