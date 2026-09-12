"use strict";
/* ============================================================
   FUTBOLINI 7.78 · data-2006.js
   PROMPT D · Modo histórico 2006 (Apertura + Clausura).
   19 clubes reales. Deportes Concepción FUE SUSPENDIDO 2006
   (problemas financieros) — no está. Wikipedia / ANFP.
   Plantel documentado: solo Colo-Colo (PLANTEL_CC_2006 en data-plantel.js).
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
  juego:"En el juego: una rueda de 18 fechas (bye incluido). El formato real de playoffs queda documentado acá."
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

if(typeof LIGAS==="object") LIGAS[2006]=LIGA_2006;
if(typeof ERA==="object"){
  ERA[2006]={n:"2006", puntosVictoria:3, inflacion:1.15, cuposInternacional:4,
    desc:"Apertura y Clausura 2006: 19 clubes (Concepción suspendido), playoffs estilo México. Victoria vale 3. Colo-Colo bicampeón del año."};
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
        const clubs=LIGA_2006.slice();
        if(clubs.length%2) clubs.push({id:"_BYE",n:"(libre)",fuerza:0,est:"",ciudad:""});
        const fx=(typeof fixturesLiga==="function")?fixturesLiga(clubs):[];
        const ida=fx.slice(0, Math.max(0, clubs.length-1)); /* una rueda: 18 fechas con bye */
        const cal=[];
        const fechas=(typeof fechasTemporada==="function")?fechasTemporada():[];
        ida.forEach(function(fecha,i){
          const pares=fecha.filter(function(p){ return p[0]!=="_BYE" && p[1]!=="_BYE"; });
          const mio=pares.find(function(p){ return p[0]===clubId||p[1]===clubId; });
          if(!mio) return; /* bye esa fecha */
          const local=mio[0]===clubId, rival=local?mio[1]:mio[0];
          const riv=LIGA_2006.filter(function(c){ return c.id===rival; })[0]
            || (typeof clubMundo==="function"?clubMundo(rival):null);
          if(!riv) return;
          const yo=LIGA_2006.filter(function(c){ return c.id===clubId; })[0];
          const f=fechas[i]||{m:2,d:1+i};
          cal.push({tipo:"liga", torneo:"Apertura 2006", fecha:i+1, rivalId:rival,
            rivalNombre:riv.n, fuerzaRival:riv.fuerza, local:local,
            sede:local?((yo&&yo.est)||"local"):riv.est,
            f:f, jugado:false,
            clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,"06"+clubId+i):"despejado",
            jornada:pares});
        });
        return cal;
      }
      return orig(clubId,anio,conCopa);
    };
    construirCalendario._e06=true;
  }
  try{ if(typeof _mapaTodosCache!=="undefined") _mapaTodosCache=null; }catch(e){}
})();
