"use strict";
/* ============================================================
   FUTBOLINI 7.78 · data-2006.js
   PROMPT D · Modo histórico 2006 (Apertura + Clausura).
   19 clubes reales. Deportes Concepción FUE SUSPENDIDO 2006
   (problemas financieros) — no está. Wikipedia / ANFP.
   Plantel documentado: Colo-Colo (data-plantel.js) + UCH/AUD/UC (data-996.js).
   El resto: cantera. No se inventan nombres.
   Cargar DESPUÉS de liga-registrar.js y data-clubes-meta.js.
   ============================================================ */

/* 19 equipos. Cobreloa = CBL (no COB: en 2026 COB es Cobresal).
   Cobresal 2006 = CBS (id de 1991). */
const LIGA_2006=[
 /* fuente: Wikipedia Torneo Apertura 2006 (Chile) / Clausura 2006 */
 {id:"CC", n:"Colo-Colo",              c:"Colo-Colo",   fuerza:88, aforo:45000, est:"Estadio Monumental",            ciudad:"Santiago",      z:"A", esc:"⚫", fund:1925, dt:"Claudio Borghi"},
 {id:"UCH",n:"Universidad de Chile",   c:"U. de Chile", fuerza:80, aforo:47000, est:"Estadio Nacional",              ciudad:"Santiago",      z:"B", esc:"🔵", fund:1927},
 {id:"UC", n:"Universidad Católica",   c:"U. Católica", fuerza:78, aforo:20000, est:"San Carlos de Apoquindo",       ciudad:"Santiago",      z:"A", esc:"⚪", fund:1937},
 {id:"CBL",n:"Cobreloa",               c:"Cobreloa",    fuerza:77, aforo:12000, est:"Municipal de Calama",           ciudad:"Calama",        z:"A", esc:"🟠", fund:1977},
 {id:"AUD",n:"Audax Italiano",         c:"Audax",       fuerza:76, aforo:12000, est:"Municipal de La Florida",       ciudad:"Santiago",      z:"A", esc:"🟢", fund:1910},
 {id:"HUA",n:"Huachipato",             c:"Huachipato",  fuerza:75, aforo:10000, est:"Estadio CAP",                   ciudad:"Talcahuano",    z:"B", esc:"⚫", fund:1947},
 {id:"UDC",n:"Universidad de Concepción",c:"U. Concepción",fuerza:74,aforo:30000,est:"Estadio Collao",               ciudad:"Concepción",    z:"A", esc:"🟡", fund:1994},
 {id:"OHI",n:"O'Higgins",              c:"O'Higgins",   fuerza:73, aforo:14000, est:"Estadio El Teniente",           ciudad:"Rancagua",      z:"B", esc:"🟢", fund:1955},
 {id:"PMO",n:"Deportes Puerto Montt",  c:"Pto. Montt",  fuerza:70, aforo:10000, est:"Regional de Chinquihue",        ciudad:"Puerto Montt",  z:"B", esc:"🟢", fund:1983},
 {id:"COQ",n:"Coquimbo Unido",         c:"Coquimbo",    fuerza:69, aforo:18000, est:"Francisco Sánchez Rumoroso",    ciudad:"Coquimbo",      z:"B", esc:"🟡", fund:1958},
 {id:"SW", n:"Santiago Wanderers",     c:"Wanderers",   fuerza:68, aforo:18000, est:"Estadio Playa Ancha",           ciudad:"Valparaíso",    z:"A", esc:"🟢", fund:1892},
 {id:"UES",n:"Unión Española",         c:"U. Española", fuerza:67, aforo:18000, est:"Estadio Santa Laura",           ciudad:"Santiago",      z:"B", esc:"🔴", fund:1897},
 {id:"ANT",n:"Deportes Antofagasta",   c:"Antofagasta", fuerza:66, aforo:21000, est:"Regional Calvo y Bascuñán",    ciudad:"Antofagasta",   z:"B", esc:"🔵", fund:1966},
 {id:"EVE",n:"Everton",                c:"Everton",     fuerza:65, aforo:18000, est:"Estadio Sausalito",             ciudad:"Viña del Mar",  z:"B", esc:"🟡", fund:1909},
 {id:"LSE",n:"Deportes La Serena",     c:"La Serena",   fuerza:64, aforo:18000, est:"Estadio La Portada",            ciudad:"La Serena",     z:"B", esc:"🔴", fund:1955},
 {id:"CBS",n:"Cobresal",               c:"Cobresal",    fuerza:63, aforo:12000, est:"Estadio El Cobre",              ciudad:"El Salvador",   z:"A", esc:"🟠", fund:1979},
 {id:"RAN",n:"Rangers",                c:"Rangers",     fuerza:62, aforo:8000,  est:"Fiscal de Talca",               ciudad:"Talca",         z:"B", esc:"🔴", fund:1902},
 {id:"PAL",n:"Palestino",              c:"Palestino",   fuerza:61, aforo:8000,  est:"Municipal de La Cisterna",      ciudad:"Santiago",      z:"A", esc:"🟢", fund:1920},
 {id:"SMO",n:"Santiago Morning",       c:"S. Morning",  fuerza:58, aforo:5000,  est:"Santa Laura (arriendo)",        ciudad:"Santiago",      z:"A", esc:"⚫", fund:1909}
];

const FORMAT_2006={
  n:19,
  pts:3,
  nota:"Deportes Concepción suspendido 2006. 19 equipos (impar).",
  apertura:"Fase todos contra todos (18 fechas, un bye por club) + grupos + playoffs. Campeón: Colo-Colo vs U. de Chile (penales).",
  clausura:"Misma modalidad. Campeón: Colo-Colo 3-0 Audax Italiano (20 dic, Monumental).",
  descenso:"Tabla anual (Apertura+Clausura). Descendió Santiago Morning. Rangers y Palestino a liguilla de promoción.",
  copas:"Colo-Colo (Apertura) → Libertadores 2007. Huachipato y Colo-Colo → Sudamericana 2006.",
  goleadores:"Apertura: Humberto Suazo (CC) 19. Clausura: Leonardo Monje 17.",
  juego:"En el juego: Apertura 18 fechas (bye) y, al cerrar esa rueda, Clausura de otras 18 con tabla desde 0 y localías invertidas. El Apertura regular NO entrega estrella (en 2006 el título se definía en playoffs estilo México, todavía no jugables). El 1° del Clausura regular cierra el año — simplificación. Descenso: tabla anual. Planteles documentados: Colo-Colo, U. de Chile, Audax Italiano y Católica."
};

const HECHOS_2006={
  campeonA:"Colo-Colo (24° título) — final vs Universidad de Chile, penales. Goles de Matías Fernández en la vuelta.",
  campeonC:"Colo-Colo (25° título) — final 3-0 vs Audax Italiano (Fernández, Suazo, Meléndez).",
  dtCC:"Claudio Borghi. Empieza el tetracampeonato 2006-2007.",
  color:"Matías Fernández (falsa rabona) y Jorge Valdivia (tiro al vacío). Suazo goleador. Alexis Sánchez debuta en Primera con 17 años.",
  dco:"Deportes Concepción no juega 2006 por sanción económica. Vuelve en 2007."
};

const CLUB_INFO_2006={};
const IND_BASE_2006={};
const CAJA_BASE_2006={};
(function armar2006(){
  LIGA_2006.forEach(function(c){
    const f=c.fuerza||60;
    CLUB_INFO_2006[c.id]={
      n:c.n, esc:c.esc||"⚪", est:c.est, dt:c.dt||"el cuerpo técnico",
      ciudad:c.ciudad, colores:c.colores, fund:c.fund,
      desc:c.n+" en el Campeonato 2006 (Apertura y Clausura, 19 clubes). Stats aproximadas."
    };
    IND_BASE_2006[c.id]={
      plantel:Math.max(20,Math.min(95,Math.round(f))),
      moral:Math.round(55+(f-60)*0.2), hinchada:Math.round(40+(f-50)*0.7),
      socios:Math.round(30+(f-50)*0.5), cantera:Math.round(48+(f-60)*0.2),
      estadio:Math.round(40+(f-50)*0.4), prestigio:Math.round(40+(f-50)*0.8),
      riesgo:Math.round(50-(f-55)*0.2)
    };
    CAJA_BASE_2006[c.id]={ plata:Math.max(80,Math.round(200+(f-55)*8)), deuda:Math.max(40,Math.round(120+(f-55)*4)) };
  });
  CLUB_INFO_2006.CC.desc="Ciclo Borghi. Suazo, Mati Fernández, Valdivia, Vidal, Bravo, Alexis de 17. Campeón Apertura y Clausura 2006.";
  CLUB_INFO_2006.CC.dt="Claudio Borghi";
})();

function ids2006(){ return LIGA_2006.map(function(c){ return c.id; }); }
function esClub2006(id){ return ids2006().indexOf(id)>=0; }

function _fx2006(){
  const clubs=LIGA_2006.slice();
  if(clubs.length%2) clubs.push({id:"_BYE",n:"(libre)",fuerza:0,est:"",ciudad:""});
  return {clubs:clubs, fx:(typeof fixturesLiga==="function")?fixturesLiga(clubs):[]};
}
function _cal2006Rueda(clubId, ruedaFx, torneo, fase, fechas){
  const cal=[];
  ruedaFx.forEach(function(fecha,i){
    const pares=fecha.filter(function(p){ return p[0]!=="_BYE" && p[1]!=="_BYE" && p[0]!=="__BYE__" && p[1]!=="__BYE__"; });
    const mio=pares.find(function(p){ return p[0]===clubId||p[1]===clubId; });
    if(!mio) return;
    const local=mio[0]===clubId, rival=local?mio[1]:mio[0];
    const riv=LIGA_2006.filter(function(c){ return c.id===rival; })[0]
      || (typeof clubMundo==="function"?clubMundo(rival):null);
    if(!riv) return;
    const yo=LIGA_2006.filter(function(c){ return c.id===clubId; })[0];
    const f=fechas[i]||{m:Math.min(12, (fase==="clausura"?7:2)+Math.floor(i/4)), d:1+(i%4)*7};
    cal.push({tipo:"liga", torneo:torneo, fase:fase, fecha:i+1, rivalId:rival,
      rivalNombre:riv.n, fuerzaRival:riv.fuerza, local:local,
      sede:local?((yo&&yo.est)||"local"):riv.est,
      f:f, jugado:false,
      clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,"06"+fase+clubId+i):"despejado",
      jornada:pares});
  });
  return cal;
}
function tablaAnual2006(){
  if(typeof E==="undefined"||!E) return [];
  const a=E.tablaApertura||{}, b=E.tabla||{};
  const arr=LIGA_2006.map(function(c){
    const x=a[c.id]||{}, y=b[c.id]||{};
    return {
      id:c.id, n:c.n,
      pj:(x.pj||0)+(y.pj||0), pg:(x.pg||0)+(y.pg||0), pe:(x.pe||0)+(y.pe||0), pp:(x.pp||0)+(y.pp||0),
      gf:(x.gf||0)+(y.gf||0), gc:(x.gc||0)+(y.gc||0), pts:(x.pts||0)+(y.pts||0)
    };
  });
  arr.sort(function(p,q){ return q.pts-p.pts||((q.gf-q.gc)-(p.gf-p.gc))||q.gf-p.gf; });
  return arr;
}
function _sembrarClausura2006(){
  if(typeof E==="undefined"||!E||E.eraBase!==2006) return;
  E.flags=E.flags||{};
  if(E.flags.fase2006==="clausura") return;
  E.flags.fase2006="clausura";
  E.tablaApertura=E.tabla?JSON.parse(JSON.stringify(E.tabla)):{};
  E.tabla={};
  LIGA_2006.forEach(function(c){ E.tabla[c.id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  E.temporadaApertura=E.temporada?JSON.parse(JSON.stringify(E.temporada)):null;
  if(E.temporada){
    E.temporada.pj=0; E.temporada.pg=0; E.temporada.pe=0; E.temporada.pp=0;
    E.temporada.gf=0; E.temporada.gc=0; E.temporada.pts=0;
  }
  const pack=_fx2006();
  const vuelta=pack.fx.slice(Math.max(0, pack.clubs.length-1));
  const fechas=(typeof fechasSemanales==="function")?fechasSemanales(9,9,20,12):[];
  const parts=_cal2006Rueda(E.club, vuelta, "Clausura 2006", "clausura", fechas);
  if(typeof _insertarYOrdenar==="function") _insertarYOrdenar(parts);
  else if(E.calendario){
    parts.forEach(function(p){ E.calendario.push(p); });
    E.calendario.sort(function(a,b){
      const oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
      const ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
      return oa-ob;
    });
    let j;
    for(j=0;j<E.calendario.length;j++) if(!E.calendario[j].jugado){ E.idx=j; break; }
  }
  if(typeof notificar==="function") notificar({t:"Arranca el Clausura 2006",tipo:"neutro",
    d:"Cerró el Apertura regular. No hay estrella por esa rueda: en 2006 el título se definía en playoffs estilo México (todavía no se juegan). La tabla parte de cero. Otras 18 fechas, localías invertidas. El descenso se mira en la tabla anual."});
}
function avanzarFase2006(part){
  if(typeof E==="undefined"||!E||E.eraBase!==2006||!part||part.tipo!=="liga") return;
  E.flags=E.flags||{};
  const fase=part.fase||E.flags.fase2006||"apertura";
  if(fase==="apertura"||!part.fase){
    const ape=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&(p.fase==="apertura"||!p.fase); });
    if(ape.filter(function(p){ return p.jugado; }).length<ape.length) return;
    _sembrarClausura2006();
  }
}
function _hookFase2006(){
  if(typeof terminarPartido!=="function"||terminarPartido._e06fase) return false;
  const orig=terminarPartido;
  terminarPartido=function(P){
    const res=orig.apply(this, arguments);
    try{ avanzarFase2006(P&&P.part); }catch(e){}
    return res;
  };
  terminarPartido._e06fase=true;
  return true;
}

if(typeof LIGAS==="object") LIGAS[2006]=LIGA_2006;
if(typeof ERA==="object"){
  ERA[2006]={n:"2006", puntosVictoria:3, inflacion:1.15, cuposInternacional:4,
    desc:"Apertura y Clausura 2006: 19 clubes (Concepción suspendido). Se juegan las dos ruedas (18+18). Playoffs estilo México: documentados, no jugables. Victoria vale 3. Colo-Colo bicampeón real del año."};
}

const PRENSA_2006=[
  {ctx:"titular", registro:"neutro", txt:"COLO-COLO BICAMPEÓN: Borghi cierra el año con dos estrellas."},
  {ctx:"titular", registro:"cl", txt:"EL CACIQUE SE MANDÓ EL AÑO COMPLETO. Apertura, Clausura y Suazo que no perdona."},
  {ctx:"titular", registro:"neutro", txt:"Suazo, 19 goles en el Apertura. El goleador de Chile es albo."},
  {ctx:"titular", registro:"cl", txt:"LA FALSA RABONA DE MATI FERNÁNDEZ: el pibe de 20 años se pasa a todo el país."},
  {ctx:"titular", registro:"neutro", txt:"Concepción no juega en 2006: sanción económica. El torneo queda con 19."},
  {ctx:"titular", registro:"cl", txt:"MORNING SE VA A LA B. El chaguito no aguantó la tabla anual."},
  {ctx:"titular", registro:"neutro", txt:"Audax Italiano, finalista del Clausura. La Florida casi toca el cielo."},
  {ctx:"titular", registro:"cl", txt:"ALEXIS SÁNCHEZ, 17 AÑOS, YA ESTÁ EN PRIMERA. Acuérdense de este cabro."}
];

(function wrap2006(){
  if(typeof construirCalendario==="function" && !construirCalendario._e06){
    const orig=construirCalendario;
    construirCalendario=function(clubId,anio,conCopa){
      if(typeof E!=="undefined" && E && E.eraBase===2006){
        const pack=_fx2006();
        const ida=pack.fx.slice(0, Math.max(0, pack.clubs.length-1));
        const fechas=(typeof fechasTemporada==="function")?fechasTemporada():[];
        return _cal2006Rueda(clubId, ida, "Apertura 2006", "apertura", fechas);
      }
      return orig(clubId,anio,conCopa);
    };
    construirCalendario._e06=true;
  }
  if(typeof nuevaPartida==="function" && !nuevaPartida._e06){
    const origN=nuevaPartida;
    nuevaPartida=function(clubId,anio,modo,extra){
      const r=origN.apply(this, arguments);
      if(typeof E!=="undefined"&&E&&E.eraBase===2006){
        E.flags=E.flags||{};
        if(!E.flags.fase2006) E.flags.fase2006="apertura";
      }
      return r;
    };
    nuevaPartida._e06=true;
  }
  _hookFase2006();
  try{ if(typeof _mapaTodosCache!=="undefined") _mapaTodosCache=null; }catch(e){}
})();
