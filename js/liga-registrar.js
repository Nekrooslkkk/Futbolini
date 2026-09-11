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
                     nombre:"Liga Profesional Argentina" });
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
  return clubs.length;
}
/* Predicados genéricos reutilizables por cualquier liga registrada. */
function idsDeLiga(eraKey){ return (typeof LIGAS==="object" && LIGAS[eraKey])?LIGAS[eraKey].map(function(c){return c.id;}):[]; }
function clubEnLiga(id, eraKey){ return idsDeLiga(eraKey).indexOf(id)>=0; }
