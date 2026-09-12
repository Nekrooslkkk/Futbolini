"use strict";
/* ============================================================
   FUTBOLINI 7.76 · data-argentina2026.js
   Liga Profesional Argentina 2026 (30 clubes reales).
   Fuente: Wikipedia / AFA, sep 2026. Stats (fuerza) ESTIMADAS.
   IDs de 3 letras que NO chocan con Chile.
   Cargar DESPUÉS de liga-registrar.js.

   Formato real 2026 (para el motor, resumido):
   - 30 clubes. Apertura + Clausura, cada uno en 2 zonas de 15.
   - Ascendieron: Gimnasia (Mza) y Estudiantes (RC).
   - Bajaron 2025: Godoy Cruz y San Martín (SJ).
   - Descienden 2: 1 por promedio (coeficiente) + 1 colista de la anual.
   - Campeón de cada torneo → Libertadores 2027.
   En el juego HOY: una rueda (29 fechas) contra todos, 3 pts.
   Zonas A/B quedan en el campo `z` para cuando se arme el formato real.
   ============================================================ */

const LIGA_ARG_2026=[
 {id:"RIV",n:"River Plate",              c:"River",      fuerza:86, aforo:83196, est:"Estadio Mâs Monumental",          ciudad:"Buenos Aires",     z:"B", esc:"⚪"},
 {id:"BOC",n:"Boca Juniors",             c:"Boca",       fuerza:84, aforo:54000, est:"La Bombonera",                    ciudad:"Buenos Aires",     z:"A", esc:"🔵"},
 {id:"RAC",n:"Racing Club",              c:"Racing",     fuerza:80, aforo:55880, est:"El Cilindro",                     ciudad:"Avellaneda",       z:"B", esc:"🔵"},
 {id:"IND",n:"Independiente",            c:"Independiente",fuerza:78,aforo:52853,est:"Libertadores de América",         ciudad:"Avellaneda",       z:"A", esc:"🔴"},
 {id:"VEL",n:"Vélez Sarsfield",          c:"Vélez",      fuerza:77, aforo:49540, est:"José Amalfitani",                 ciudad:"Buenos Aires",     z:"A", esc:"⚪"},
 {id:"SLO",n:"San Lorenzo",              c:"San Lorenzo",fuerza:76, aforo:39494, est:"Pedro Bidegain",                  ciudad:"Buenos Aires",     z:"A", esc:"🔵"},
 {id:"ELP",n:"Estudiantes (LP)",         c:"Estudiantes",fuerza:75, aforo:30530, est:"Jorge Luis Hirschi",              ciudad:"La Plata",         z:"A", esc:"🔴"},
 {id:"ROS",n:"Rosario Central",          c:"Central",    fuerza:74, aforo:41654, est:"Gigante de Arroyito",             ciudad:"Rosario",          z:"B", esc:"🔵"},
 {id:"TAL",n:"Talleres (C)",             c:"Talleres",   fuerza:73, aforo:57000, est:"Mario Alberto Kempes",            ciudad:"Córdoba",          z:"A", esc:"🔵"},
 {id:"HUR",n:"Huracán",                  c:"Huracán",    fuerza:72, aforo:48314, est:"Tomás Adolfo Ducó",               ciudad:"Buenos Aires",     z:"B", esc:"🔴"},
 {id:"LAN",n:"Lanús",                    c:"Lanús",      fuerza:72, aforo:47090, est:"Ciudad de Lanús",                 ciudad:"Lanús",            z:"A", esc:"🟠"},
 {id:"ARG",n:"Argentinos Juniors",       c:"Argentinos", fuerza:71, aforo:25000, est:"Diego Armando Maradona",          ciudad:"Buenos Aires",     z:"B", esc:"🔴"},
 {id:"NEW",n:"Newell's Old Boys",        c:"Newell's",   fuerza:70, aforo:38095, est:"Marcelo Bielsa",                  ciudad:"Rosario",          z:"A", esc:"🔴"},
 {id:"BEL",n:"Belgrano",                 c:"Belgrano",   fuerza:69, aforo:30000, est:"Julio César Villagra",            ciudad:"Córdoba",          z:"B", esc:"🔵"},
 {id:"DYJ",n:"Defensa y Justicia",       c:"Defensa",    fuerza:68, aforo:12000, est:"Norberto Tito Tomaghello",        ciudad:"Florencio Varela", z:"A", esc:"🟡"},
 {id:"INS",n:"Instituto",                c:"Instituto",  fuerza:67, aforo:26535, est:"Juan Domingo Perón",              ciudad:"Córdoba",          z:"A", esc:"🔴"},
 {id:"UNI",n:"Unión",                    c:"Unión",      fuerza:66, aforo:22852, est:"15 de Abril",                     ciudad:"Santa Fe",         z:"A", esc:"🔴"},
 {id:"GLP",n:"Gimnasia (LP)",            c:"Gimnasia",   fuerza:66, aforo:26544, est:"Juan Carmelo Zerillo",            ciudad:"La Plata",         z:"B", esc:"⚪"},
 {id:"TUC",n:"Atlético Tucumán",         c:"Atl. Tucumán",fuerza:65,aforo:32700, est:"Monumental José Fierro",          ciudad:"Tucumán",          z:"B", esc:"🔵"},
 {id:"TIG",n:"Tigre",                    c:"Tigre",      fuerza:64, aforo:26282, est:"José Dellagiovanna",              ciudad:"Victoria",         z:"B", esc:"🔵"},
 {id:"BAN",n:"Banfield",                 c:"Banfield",   fuerza:63, aforo:21820, est:"Florencio Sola",                  ciudad:"Banfield",         z:"B", esc:"🟢"},
 {id:"PLA",n:"Platense",                 c:"Platense",   fuerza:63, aforo:22530, est:"Ciudad de Vicente López",         ciudad:"Florida Este",     z:"A", esc:"🟤"},
 {id:"CCO",n:"Central Córdoba (SdE)",    c:"C. Córdoba", fuerza:62, aforo:34000, est:"Único Madre de Ciudades",         ciudad:"Santiago del Estero",z:"A",esc:"⚫"},
 {id:"IRV",n:"Independiente Rivadavia",  c:"I. Rivadavia",fuerza:61,aforo:24000, est:"Bautista Gargantini",             ciudad:"Mendoza",          z:"B", esc:"🔵"},
 {id:"SAR",n:"Sarmiento (J)",            c:"Sarmiento",  fuerza:60, aforo:19000, est:"Eva Perón",                       ciudad:"Junín",            z:"B", esc:"🟢"},
 {id:"ALD",n:"Aldosivi",                 c:"Aldosivi",   fuerza:59, aforo:35180, est:"José María Minella",              ciudad:"Mar del Plata",    z:"B", esc:"🟢"},
 {id:"GME",n:"Gimnasia (Mza)",           c:"Gimnasia Mza",fuerza:63,aforo:11000, est:"Víctor Antonio Legrotaglie",      ciudad:"Mendoza",          z:"A", esc:"⚪"},
 {id:"RIE",n:"Deportivo Riestra",        c:"Riestra",    fuerza:58, aforo:3000,  est:"Guillermo Laza",                  ciudad:"Buenos Aires",     z:"A", esc:"⚫"},
 {id:"ERC",n:"Estudiantes (RC)",         c:"Estudiantes RC",fuerza:58,aforo:12000,est:"Antonio Candini",                ciudad:"Río Cuarto",       z:"B", esc:"🔴"},
 {id:"BAR",n:"Barracas Central",         c:"Barracas",   fuerza:57, aforo:4400,  est:"Claudio Chiqui Tapia",            ciudad:"Buenos Aires",     z:"B", esc:"🔴"}
];

const FEDERACION_ARG={
  sigla:"AFA",
  nombre:"Asociación del Fútbol Argentino",
  ascenso:"Primera Nacional",
  terminos:["promedios","descenso por tabla anual","Liga Profesional","el clásico","la Bombonera","el Monumental"]
};

const FORMAT_ARG_2026={
  n:30,
  pts:3,
  torneos:["Apertura","Clausura"],
  zonas:15,
  descenso:"2 (1 por promedio + 1 colista de la anual)",
  copas:"Campeón Apertura y Clausura → Libertadores 2027. El resto, por la tabla anual.",
  juego:"Por ahora: 29 fechas (una rueda). Las zonas A/B están en cada club (campo z) para el formato real."
};

function idsArgentina(){ return LIGA_ARG_2026.map(function(c){ return c.id; }); }
function esClubArg(id){ return idsArgentina().indexOf(id)>=0; }

if(typeof registrarLiga==="function"){
  registrarLiga({
    eraKey:"arg2026",
    clubs:LIGA_ARG_2026,
    baseEra:2026,
    nombre:"Liga Profesional Argentina",
    era:{n:"2026 · Argentina", pais:"argentina", puntosVictoria:3, inflacion:1.4, cuposInternacional:6,
      desc:"Liga Profesional 2026 (AFA, no ANFP): 30 clubes, Apertura y Clausura en zonas de 15. En el juego, una rueda de 29 fechas. Descienden 2: 1 por promedio + 1 colista de la anual."}
  });
}

(function wrapArg76(){
  if(typeof datosEra==="function" && !datosEra._arg76){
    const orig=datosEra;
    datosEra=function(base){
      if(base==="arg2026") return {info:CLUB_INFO_2026, ind:IND_BASE_2026, caja:CAJA_BASE_2026};
      return orig(base);
    };
    datosEra._arg76=true;
  }
  if(typeof eraDe==="function" && !eraDe._arg76){
    const orig=eraDe;
    eraDe=function(base){
      if(base==="arg2026") return (typeof ERA==="object"&&ERA.arg2026)?ERA.arg2026:(orig(2026));
      return orig(base);
    };
    eraDe._arg76=true;
  }
  if(typeof nuevaPartida==="function" && !nuevaPartida._arg76){
    const orig=nuevaPartida;
    nuevaPartida=function(clubId,anio,modo,extra){
      extra=extra||null;
      if(typeof esClubArg==="function" && esClubArg(clubId)){
        extra=Object.assign({}, extra||{}, {categoria:"ARG"});
      }
      return orig(clubId,anio,modo,extra);
    };
    nuevaPartida._arg76=true;
  }
  if(typeof construirCalendario==="function" && !construirCalendario._arg76){
    const orig=construirCalendario;
    construirCalendario=function(clubId,anio,conCopa){
      if(typeof E!=="undefined" && E && E.eraBase==="arg2026"){
        const fx=(typeof fixturesLiga==="function")?fixturesLiga(LIGA_ARG_2026):[];
        const ida=fx.slice(0, Math.max(0, LIGA_ARG_2026.length-1));
        const cal=[];
        const fechas=(typeof fechasTemporada==="function")?fechasTemporada():[];
        ida.forEach(function(fecha,i){
          const mio=fecha.find(function(p){ return p[0]===clubId||p[1]===clubId; });
          if(!mio) return;
          const local=mio[0]===clubId, rival=local?mio[1]:mio[0];
          const riv=(typeof clubMundo==="function"?clubMundo(rival):null)||(typeof CLUB_POR_ID!=="undefined"?CLUB_POR_ID[rival]:null);
          if(!riv) return;
          const yo=(typeof CLUB_POR_ID!=="undefined"?CLUB_POR_ID[clubId]:null);
          const f=fechas[i]||{m:2,d:1+i};
          cal.push({tipo:"liga", torneo:"Liga Profesional", fecha:i+1, rivalId:rival,
            rivalNombre:riv.n, fuerzaRival:riv.fuerza, local:local,
            sede:local?((yo&&yo.est)||"local"):riv.est,
            f:f, jugado:false,
            clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,"arg"+clubId+i):"despejado",
            jornada:fecha});
        });
        return cal;
      }
      return orig(clubId,anio,conCopa);
    };
    construirCalendario._arg76=true;
  }
  if(typeof clubMapaTodos==="function"){
    try{ if(typeof _mapaTodosCache!=="undefined") _mapaTodosCache=null; }catch(e){}
  }
})();
