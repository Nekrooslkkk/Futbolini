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
  copas:"Campeón Apertura y Clausura → Libertadores 2027. Copa Argentina: campeón → Libertadores 2027. 2026 ya clasificados a grupos de Libertadores (documentados): Estudiantes A, Independiente Rivadavia C, Boca D, Platense E.",
  juego:"Apertura: zona de 15 (sorteo AFA), 14 PJ + 1 bye. Clausura: misma zona, localías invertidas, tabla de 0. Copa Argentina: 32avos documentados, partido único, empate a penales. No hay rueda de 29. CONMEBOL al mismo rigor que Chile."
};

function idsArgentina(){ return LIGA_ARG_2026.map(function(c){ return c.id; }); }
function esClubArg(id){ return idsArgentina().indexOf(id)>=0; }
function zonaArgDe(id){
  if(!id) return null;
  if(typeof E!=="undefined"&&E&&E.zonaArg&&E.zonaArg[id]) return E.zonaArg[id];
  var c=null;
  if(typeof LIGA_ARG_2026!=="undefined"){
    for(var i=0;i<LIGA_ARG_2026.length;i++) if(LIGA_ARG_2026[i].id===id){ c=LIGA_ARG_2026[i]; break; }
  }
  return c&&c.z?c.z:null;
}
function clubsZonaArg(z){
  if(typeof LIGA_ARG_2026==="undefined") return [];
  return LIGA_ARG_2026.filter(function(c){ return c.z===z; });
}

/* Copa Argentina 2026 · 32avos (Sporting News / Wikipedia, sorteo 10 dic 2025).
   Partido único, cancha neutral, empate a penales sin alargue.
   `n` = rival de 32avos (nombre real). `next` = cruce de 16avos documentado. */
const COPA_ARG_32_2026={
  SLO:{n:"Deportivo Rincón",fue:46,next:{id:"RIE"}},
  RIE:{n:"Deportivo Maipú",fue:56,next:{id:"SLO"}},
  NEW:{n:"Acassuso",fue:50,next:{id:"GLP"}},
  GLP:{n:"Camioneros",fue:48,next:{n:"Acassuso",fue:50}},
  BAN:{n:"Real Pilar",fue:47,next:{n:"San Martín (Tucumán)",fue:58}},
  ERC:{n:"San Martín (Tucumán)",fue:58,next:{id:"BAN"}},
  ARG:{n:"Ferrocarril Midland",fue:52,next:{n:"Deportivo Morón",fue:57}},
  RAC:{n:"San Martín (Formosa)",fue:50,next:{id:"DYJ"}},
  DYJ:{n:"Chaco For Ever",fue:54,next:{id:"RAC"}},
  CCO:{n:"Gimnasia (Jujuy)",fue:55,next:{id:"BEL"}},
  BEL:{n:"Atlético Rafaela",fue:53,next:{n:"Gimnasia (Jujuy)",fue:55}},
  VEL:{n:"Deportivo Armenio",fue:50,next:{n:"Gimnasia y Tiro (Salta)",fue:54}},
  GME:{n:"Gimnasia y Tiro (Salta)",fue:54,next:{id:"VEL"}},
  SAR:{n:"Tristán Suárez",fue:52,next:{id:"BOC"}},
  BOC:{n:"Gimnasia (Chivilcoy)",fue:48,next:{id:"SAR"}},
  RIV:{n:"Ciudad de Bolívar",fue:49,next:{id:"ALD"}},
  ALD:{n:"San Miguel",fue:51,next:{id:"RIV"}},
  IRV:{n:"Estudiantes (BA)",fue:54,next:{id:"TIG"}},
  TIG:{n:"Claypole",fue:45,next:{id:"IRV"}},
  TAL:{n:"Argentino de Merlo",fue:47,next:{id:"TUC"}},
  TUC:{n:"Sportivo Barracas",fue:46,next:{id:"TAL"}},
  UNI:{n:"Agropecuario",fue:55,next:{id:"IND"}},
  IND:{n:"Atenas de Río Cuarto",fue:48,next:{id:"UNI"}},
  PLA:{n:"Argentino (Monte Maíz)",fue:46,next:{n:"San Martín (San Juan)",fue:57}},
  INS:{n:"Atlanta",fue:56,next:{id:"LAN"}},
  LAN:{n:"Sarmiento (Santiago del Estero)",fue:50,next:{id:"INS"}},
  ELP:{n:"Ituzaingó",fue:47,next:{id:"ROS"}},
  ROS:{n:"Sportivo Belgrano",fue:53,next:{id:"ELP"}},
  BAR:{n:"Temperley",fue:56,next:{id:"HUR"}},
  HUR:{n:"Olimpo",fue:54,next:{id:"BAR"}}
};
const COPA_ARG_OCTAVOS_2026={
  RIE:{n:"Gimnasia (LP)",id:"GLP"},
  BAN:{n:"Ferrocarril Midland",fue:52},
  RAC:{n:"Belgrano",id:"BEL"},
  BOC:{n:"Vélez",id:"VEL"},
  IRV:{n:"Aldosivi",id:"ALD"},
  TUC:{n:"Independiente",id:"IND"},
  PLA:{n:"Instituto",id:"INS"},
  ELP:{n:"Barracas Central",id:"BAR"}
};

function _mkCopaArg(clubId, spec, ronda){
  var yo=(typeof clubLookup==="function")?clubLookup(clubId):null;
  var riv=spec.id&&(typeof clubLookup==="function")?clubLookup(spec.id):null;
  var nom=riv?riv.n:(spec.n||"rival de inferior");
  var fue=riv?riv.fuerza:(spec.fue||50);
  return {
    tipo:"copa", torneo:"Copa Argentina", ronda:ronda||"32avos",
    rivalId:riv?riv.id:null, rivalNombre:nom, fuerzaRival:fue,
    local:false, sede:spec.sede||"cancha neutral",
    f:spec.f||{m:2,d:18}, jugado:false,
    clima:(typeof climaDeFecha==="function")?climaDeFecha((spec.f&&spec.f.m)||2,"copaArg"+clubId+ronda):"despejado",
    nota:"Copa Argentina 2026: partido único, empate a penales (sin alargue). Cruce documentado; el marcador lo jugás vos.",
    notaId:"CA26-"+clubId+"-"+(ronda||"32")
  };
}
function partidosCopaArgentinaDe(clubId){
  var spec=COPA_ARG_32_2026[clubId];
  if(!spec) return [];
  return [_mkCopaArg(clubId, Object.assign({}, spec, {f:{m:2,d:18}}), "32avos")];
}
function _siguienteCopaArg(clubId, ronda){
  if(ronda==="32avos"){
    var spec=COPA_ARG_32_2026[clubId];
    if(spec&&spec.next) return {ronda:"16avos", spec:spec.next, f:{m:5,d:20}};
  }
  if(ronda==="16avos"){
    var oc=COPA_ARG_OCTAVOS_2026[clubId];
    if(oc) return {ronda:"Octavos", spec:oc, f:{m:8,d:20}};
    return {ronda:"Octavos", spec:{n:"ganador de la otra llave (sorteo del juego)",fue:62}, f:{m:8,d:20}};
  }
  if(ronda==="Octavos") return {ronda:"Cuartos", spec:{n:"ganador de la otra llave (sorteo del juego)",fue:68}, f:{m:9,d:16}};
  if(ronda==="Cuartos") return {ronda:"Semifinal", spec:{n:"ganador de la otra llave (sorteo del juego)",fue:72}, f:{m:10,d:14}};
  if(ronda==="Semifinal") return {ronda:"FINAL", spec:{n:"finalista (sorteo del juego)",fue:74,sede:"estadio neutral"}, f:{m:11,d:4}};
  return null;
}
function resolverCopaArgentina(part, yo, otro){
  var pasa=yo>otro;
  var pens=false;
  if(yo===otro){ pasa=Math.random()<0.5; pens=true; }
  var penalTxt=pens?" Empate: a penales, sin alargue (bases Copa Argentina).":"";
  if(!pasa){
    if(typeof sacarCopaPendienteTorneo==="function") sacarCopaPendienteTorneo("Copa Argentina");
    else if(E&&E.calendario) E.calendario=E.calendario.filter(function(p){ return !(p.tipo==="copa"&&p.torneo==="Copa Argentina"&&!p.jugado); });
    if(typeof notificar==="function") notificar({t:"Eliminado de Copa Argentina",tipo:"malo",
      d:"Fuera en "+(part.ronda||"32avos")+" "+yo+"-"+otro+" ante "+part.rivalNombre+"."+penalTxt});
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:-3,prestigio:-1});
    return;
  }
  if(part.ronda==="FINAL"){
    E.flags=E.flags||{};
    E.flags.copaArgentinaCampeon=true;
    E.flags.cupoLib=true;
    if(E.titulos&&E.titulos.indexOf(E.anio+" · Copa Argentina")<0) E.titulos.push(E.anio+" · Copa Argentina");
    if(typeof notificar==="function") notificar({t:"🏆 CAMPEÓN — Copa Argentina",tipo:"bueno",
      d:"Campeón de Copa Argentina "+E.anio+". Cupo a Libertadores "+(E.anio+1)+"."+penalTxt});
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:8,prestigio:6,plata:200});
    return;
  }
  if(typeof aplicarEfectos==="function") aplicarEfectos({moral:3,plata:40});
  var nxt=_siguienteCopaArg(E.club, part.ronda||"32avos");
  if(!nxt) return;
  if(typeof notificar==="function") notificar({t:"Avanza en Copa Argentina",tipo:"bueno",
    d:"Pasaste "+(part.ronda||"32avos")+"."+penalTxt+" Sigue "+nxt.ronda+"."});
  var p=_mkCopaArg(E.club, Object.assign({}, nxt.spec, {f:nxt.f}), nxt.ronda);
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

function _sembrarClausuraArg(){
  if(!E||E.eraBase!=="arg2026") return;
  E.flags=E.flags||{};
  if(E.flags.argFase==="clausura") return;
  E.flags.argFase="clausura";
  E.tablaApertura=E.tabla?JSON.parse(JSON.stringify(E.tabla)):{};
  E.tabla={};
  var z=zonaArgDe(E.club);
  var clubs=clubsZonaArg(z);
  clubs.forEach(function(c){ E.tabla[c.id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  var fechas=(typeof fechasSemanales==="function")?fechasSemanales(7,12,16,12):[];
  var fxAll=(typeof fixturesLiga==="function")?fixturesLiga(clubs):[];
  var mitad=Math.ceil(fxAll.length/2);
  var parts=(typeof calendarioZonal==="function")
    ?calendarioZonal(E.club, clubs, {torneo:"Clausura · Zona "+z, fase:"clausura", fechas:fechas, desde:mitad})
    :[];
  if(typeof _insertarYOrdenar==="function") _insertarYOrdenar(parts);
  else if(E.calendario){ parts.forEach(function(p){ E.calendario.push(p); }); }
  if(typeof notificar==="function") notificar({t:"Arranca el Clausura",tipo:"neutro",
    d:"Apertura cerrado. El Clausura parte de cero, misma Zona "+z+" (15 clubes, 14 PJ, localías invertidas)."});
  try{ if(typeof mundoInit==="function"){ /* no reiniciar el año entero: solo las zonas AFA */
    ["arg2026A","arg2026B"].forEach(function(k){
      if(E.mundo&&E.mundo.ligas&&E.mundo.ligas[k]){
        var ids=E.mundo.ligas[k].ids||[];
        var tab={}; ids.forEach(function(id){ tab[id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
        E.mundo.ligas[k].tab=tab; E.mundo.ligas[k].ronda=0;
        E.mundo.ligas[k].nom="Clausura · Zona "+(k==="arg2026A"?"A":"B");
      }
    });
  } }catch(e){}
}
function avanzarFaseArg(part){
  if(!E||E.eraBase!=="arg2026"||!part||part.tipo!=="liga") return;
  E.flags=E.flags||{};
  var fase=part.fase||E.flags.argFase||"apertura";
  if(fase==="apertura"||!part.fase){
    var ape=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&(p.fase==="apertura"||!p.fase); });
    if(ape.filter(function(p){ return p.jugado; }).length<ape.length) return;
    _sembrarClausuraArg();
  }
}

if(typeof registrarLiga==="function"){
  registrarLiga({
    eraKey:"arg2026",
    clubs:LIGA_ARG_2026,
    baseEra:2026,
    nombre:"Liga Profesional Argentina",
    copas:[
      {id:"copaArg", nombre:"Copa Argentina", tipo:"eliminacion",
       nota:"2026: 64 equipos, partido único, empate a penales. 32avos documentados."},
      {id:"lib2026", nombre:"Copa Libertadores", tipo:"grupos",
       nota:"2026 grupos reales: Estudiantes A, Independiente Rivadavia C, Boca D, Platense E."}
    ],
    era:{n:"2026 · Argentina", pais:"argentina", puntosVictoria:3, inflacion:1.4, cuposInternacional:6,
      desc:"Liga Profesional 2026 (AFA): 30 clubes, Apertura y Clausura en zonas de 15 (14 PJ). Copa Argentina a partido único. Descienden 2: 1 por promedio + 1 colista de la anual."}
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
      const r=orig(clubId,anio,modo,extra);
      if(typeof E!=="undefined"&&E&&E.eraBase==="arg2026"){
        E.flags=E.flags||{};
        E.flags.argFase="apertura";
        E.zonaArg={};
        if(typeof LIGA_ARG_2026!=="undefined") LIGA_ARG_2026.forEach(function(c){ E.zonaArg[c.id]=c.z; });
      }
      return r;
    };
    nuevaPartida._arg76=true;
  }
  if(typeof construirCalendario==="function" && !construirCalendario._arg76){
    const orig=construirCalendario;
    construirCalendario=function(clubId,anio,conCopa){
      if(typeof E!=="undefined" && E && E.eraBase==="arg2026"){
        const z=zonaArgDe(clubId)||"A";
        const clubs=clubsZonaArg(z);
        const fechas=(typeof fechasSemanales==="function")?fechasSemanales(1,24,16,6):[];
        const cal=(typeof calendarioZonal==="function")
          ?calendarioZonal(clubId, clubs, {torneo:"Apertura · Zona "+z, fase:"apertura", fechas:fechas, soloIda:true})
          :[];
        partidosCopaArgentinaDe(clubId).forEach(function(p){ cal.push(p); });
        cal.sort(function(a,b){
          var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
          var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
          return oa-ob;
        });
        return cal;
      }
      return orig(clubId,anio,conCopa);
    };
    construirCalendario._arg76=true;
  }
  if(typeof resolverCopa==="function" && !resolverCopa._argCopa){
    const origR=resolverCopa;
    resolverCopa=function(part, yo, otro){
      if(part&&part.torneo==="Copa Argentina"){ resolverCopaArgentina(part, yo, otro); return; }
      return origR(part, yo, otro);
    };
    resolverCopa._argCopa=true;
  }
  if(typeof terminarPartido==="function" && !terminarPartido._argFase){
    const origT=terminarPartido;
    terminarPartido=function(P){
      const snap=(P&&P.part&&P.part.fase==="clausura"&&E&&E.tabla)?JSON.parse(JSON.stringify(E.tabla)):null;
      const res=origT.apply(this, arguments);
      try{ avanzarFaseArg(P&&P.part); }catch(e){}
      return res;
    };
    terminarPartido._argFase=true;
  }
  if(typeof clubMapaTodos==="function"){
    try{ if(typeof _mapaTodosCache!=="undefined") _mapaTodosCache=null; }catch(e){}
  }
})();
