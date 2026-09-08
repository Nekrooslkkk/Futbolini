"use strict";
/* ============================================================
   FUTBOLINI · data-grok-plus.js  (7.19 · pase GROK_PROMPT*)
   Se carga DESPUÉS de data-clubes2026.js (EPOCAS ya mergeadas).
   Nombres reales documentados; stats estimadas. Sin citas inventadas.
   ============================================================ */

/* ---------- PAL 1978 · campeón Nacional (Asifuch / Wikipedia) ---------- */
const PLANTEL_PAL_1978=[
 ["Manuel Araya","ARQ",28,82,82,55,140,["seguro bajo los tres palos"]],
 ["Mario Varas","DEF",25,76,78,40,90,[]],
 ["Edgardo Fuentes","DEF",18,74,84,18,110,["proyección","de la casa"]],
 ["Elías Figueroa","DEF",32,94,94,90,400,["ídolo","juego aéreo","capitán"]],
 ["Eddie Campodónico","DEF",25,76,78,42,95,[]],
 ["Carlos Valenzuela","DEF",28,70,70,28,55,[]],
 ["Rodolfo Dubó","VOL",23,80,84,50,160,["contención","selección"]],
 ["Manuel Rojas","VOL",22,82,86,52,180,["desequilibrio","ídolo"]],
 ["Sergio Messen","VOL",27,78,78,48,130,["creación"]],
 ["Ricardo Lazbal","VOL",19,70,80,16,80,["proyección"]],
 ["Jorge Zelada","VOL",24,68,72,22,50,[]],
 ["Óscar Fabbiani","DEL",26,90,90,85,350,["goleador","ídolo","extranjero"]],
 ["Pedro Pinto","DEL",25,76,78,45,110,[]],
 ["Enrique Graff","DEL",24,68,72,22,55,[]]
];

/* ---------- EVE 2008 · Apertura campeón (Cooperativa / Wikipedia) ---------- */
const PLANTEL_EVE_2008=[
 ["Gustavo Dalsasso","ARQ",31,76,76,40,70,["extranjero"]],
 ["Johnny Herrera","ARQ",27,80,84,55,140,["seguro bajo los tres palos"]],
 ["Mauricio Arias","DEF",23,70,76,28,80,["lateral ofensivo"]],
 ["Leandro Delgado","DEF",25,74,76,38,95,[]],
 ["Cristián Oviedo","DEF",27,76,76,42,100,["juego aéreo"]],
 ["Adrián Rojas","DEF",30,74,74,40,85,[]],
 ["Benjamín Ruiz","DEF",26,72,74,32,75,[]],
 ["Marco Velásquez","DEF",27,68,70,24,50,["extranjero"]],
 ["Jaime Riveros","VOL",37,84,84,70,160,["ídolo","creación","tiro libre"]],
 ["Cristián Canio","VOL",26,78,80,50,140,["desequilibrio","goleador"]],
 ["Juan Luis González","VOL",33,74,74,38,70,["contención"]],
 ["Fernando Saavedra","VOL",21,70,80,22,90,["proyección","de la casa"]],
 ["Cristián Uribe","VOL",29,70,70,28,55,[]],
 ["Francisco Sánchez","VOL",23,66,74,18,50,["de la casa"]],
 ["Gustavo Tejería","VOL",27,68,70,24,55,["extranjero"]],
 ["Ángel Rojas","VOL",22,66,74,18,55,[]],
 ["Roberto Reyes","VOL",20,62,74,12,45,["proyección"]],
 ["Ezequiel Miralles","DEL",24,84,86,70,220,["extranjero","goleador","velocidad"]],
 ["Darío Gigena","DEL",30,74,74,42,80,["extranjero"]],
 ["Claudio Núñez","DEL",32,68,68,28,45,[]]
];

/* ---------- HUA 2023 · campeón Nacional (ADN / AS Chile) ---------- */
const PLANTEL_HUA_2023=[
 ["Gabriel Castellón","ARQ",29,80,82,55,140,["seguro bajo los tres palos"]],
 ["Martín Parra","ARQ",22,64,76,16,50,["proyección"]],
 ["Benjamín Gazzolo","DEF",26,76,78,42,110,["juego aéreo"]],
 ["Nicolás Ramírez","DEF",26,76,78,42,110,[]],
 ["Felipe Loyola","DEF",22,78,86,40,200,["proyección","desequilibrio"]],
 ["Joaquín Gutiérrez","DEF",21,72,82,22,120,["proyección","lateral ofensivo"]],
 ["Nicolás Baeza","DEF",26,70,74,28,80,["lateral"]],
 ["Antonio Castillo","DEF",24,68,74,22,70,[]],
 ["Claudio Sepúlveda","VOL",31,80,80,55,130,["capitán","contención","ídolo"]],
 ["Gonzalo Montes","VOL",28,78,80,50,140,["extranjero","creación"]],
 ["Jimmy Martínez","VOL",26,74,76,38,95,[]],
 ["Brayan Palmezano","VOL",23,72,80,30,110,["extranjero","desequilibrio"]],
 ["Carlo Villanueva","VOL",24,68,74,22,70,[]],
 ["Claudio Torres","VOL",20,64,78,14,70,["proyección"]],
 ["Nelson Guaiquil","VOL",20,62,76,12,55,["proyección"]],
 ["Cris Martínez","DEL",29,82,82,65,180,["extranjero","goleador"]],
 ["Maximiliano Rodríguez","DEL",23,76,82,40,150,["desequilibrio"]],
 ["Julián Brea","DEL",23,70,76,28,90,["extranjero"]],
 ["Pablo Magnin","DEL",33,70,70,32,55,["extranjero"]]
];

/* ---------- SW 1991 · plantel documentado (Memoria Wanderers) ---------- */
const PLANTEL_SW_1991=[
 ["Guillermo Velasco","ARQ",28,70,70,22,45,[]],
 ["Jaime Zapata","ARQ",26,66,68,16,35,[]],
 ["Jaime Bahamondes","DEF",27,68,70,22,50,[]],
 ["Osvaldo Vargas","DEF",29,68,68,22,45,[]],
 ["Leonardo Ramírez","DEF",26,66,68,18,40,[]],
 ["Miguel Vásquez","DEF",25,64,66,16,35,[]],
 ["Francisco Rodríguez","DEF",24,64,68,14,35,[]],
 ["Wilson Fre","VOL",26,72,74,28,70,["desequilibrio"]],
 ["Alejandro Glaría","DEL",24,70,74,26,65,["extranjero"]],
 ["Jorge Muñoz","DEL",27,66,68,20,45,[]],
 ["George Biehl","VOL",25,64,66,16,40,[]],
 ["Antonio Sepúlveda","DEL",23,62,70,12,40,[]]
];

/* ---------- UCH 1991 · fixture REAL (chuncho.com). real = local-visita (home-away) ---------- */
const LIGA_UCH_1991=[
 {fecha:1,  f:{m:4,d:28}, rival:"FV",  local:true,  real:"1-0"},
 {fecha:2,  f:{m:5,d:5},  rival:"OSO", local:false, real:"3-2"},
 {fecha:3,  f:{m:5,d:11}, rival:"PAL", local:true,  real:"6-0"},
 {fecha:4,  f:{m:5,d:19}, rival:"COQ", local:false, real:"1-0"},
 {fecha:5,  f:{m:6,d:9},  rival:"CBS", local:false, real:"0-1"},
 {fecha:6,  f:{m:6,d:16}, rival:"UES", local:true,  real:"1-0"},
 {fecha:7,  f:{m:7,d:28}, rival:"EVE", local:false, real:"1-0"},
 {fecha:8,  f:{m:8,d:4},  rival:"DCO", local:true,  real:"0-1"},
 {fecha:9,  f:{m:8,d:11}, rival:"ANT", local:true,  real:"1-1"},
 {fecha:10, f:{m:8,d:15}, rival:"UC",  local:true,  real:"2-5"},
 {fecha:11, f:{m:8,d:18}, rival:"LSE", local:true,  real:"0-0"},
 {fecha:12, f:{m:8,d:25}, rival:"OHI", local:false, real:"1-1"},
 {fecha:13, f:{m:9,d:2},  rival:"COB", local:true,  real:"2-2"},
 {fecha:14, f:{m:9,d:8},  rival:"SW",  local:false, real:"0-0"},
 {fecha:15, f:{m:9,d:15}, rival:"FV",  local:false, real:"2-1"},
 {fecha:16, f:{m:9,d:18}, rival:"CC",  local:true,  real:"0-2"},
 {fecha:17, f:{m:9,d:22}, rival:"OSO", local:true,  real:"5-1"},
 {fecha:18, f:{m:9,d:29}, rival:"PAL", local:true,  real:"1-1"},
 {fecha:19, f:{m:10,d:5}, rival:"COQ", local:true,  real:"4-1"},
 {fecha:20, f:{m:10,d:13},rival:"CC",  local:false, real:"2-0"},
 {fecha:21, f:{m:10,d:20},rival:"CBS", local:true,  real:"1-2"},
 {fecha:22, f:{m:10,d:27},rival:"UES", local:false, real:"3-1"},
 {fecha:23, f:{m:11,d:3}, rival:"EVE", local:true,  real:"0-2"},
 {fecha:24, f:{m:11,d:9}, rival:"DCO", local:false, real:"0-1"},
 {fecha:25, f:{m:11,d:16},rival:"ANT", local:false, real:"0-0"},
 {fecha:26, f:{m:11,d:23},rival:"UC",  local:true,  real:"2-3"},
 {fecha:27, f:{m:11,d:28},rival:"LSE", local:false, real:"1-1"},
 {fecha:28, f:{m:12,d:1}, rival:"OHI", local:true,  real:"0-1"},
 {fecha:29, f:{m:12,d:8}, rival:"COB", local:false, real:"1-0"},
 {fecha:30, f:{m:12,d:22},rival:"SW",  local:true,  real:"2-2"}
];

(function aplicarGrokPlus(){
  if(typeof PLANTELES_REALES==="object"){
    if(!PLANTELES_REALES.PAL) PLANTELES_REALES.PAL={};
    PLANTELES_REALES.PAL[1978]=PLANTEL_PAL_1978;
    if(!PLANTELES_REALES.EVE) PLANTELES_REALES.EVE={};
    PLANTELES_REALES.EVE[2008]=PLANTEL_EVE_2008;
    if(!PLANTELES_REALES.HUA) PLANTELES_REALES.HUA={};
    PLANTELES_REALES.HUA[2023]=PLANTEL_HUA_2023;
    if(!PLANTELES_REALES.SW) PLANTELES_REALES.SW={};
    PLANTELES_REALES.SW[1991]=PLANTEL_SW_1991;
  }

  /* épocas extra: se suman a las que ya están, no las pisan */
  if(typeof EPOCAS_CLUB==="object"){
    const pal78=(EPOCAS_CLUB.PAL&&EPOCAS_CLUB.PAL[0])||null;
    if(pal78){ pal78.squad="PLANTEL_PAL_1978"; pal78.desc="Campeón del Nacional 1978. Elías Figueroa de eje, Óscar Fabbiani goleador (35) y 44 fechas invicto. Dirigía Caupolicán Peña."; }
    const eve2008={anio:2008,etq:"2008 · Apertura en Sausalito",liga:2026,squad:"PLANTEL_EVE_2008",
      desc:"Campeón del Apertura 2008 con Nelson Acosta. Remontó 0-2 a Colo-Colo con 3-0 en la vuelta: Miralles y Riveros.",
      dt:"Nelson Acosta",
      ind:{plantel:80,moral:86,hinchada:82,socios:58,cantera:55,estadio:72,prestigio:76,riesgo:22},
      caja:{plata:320,deuda:180}};
    EPOCAS_CLUB.EVE= [eve2008].concat(EPOCAS_CLUB.EVE||[]);
    const hua2023={anio:2023,etq:"2023 · Tercera estrella",squad:"PLANTEL_HUA_2023",
      desc:"Campeón 2023 con Gustavo Álvarez. Cris Martínez y Maxi Rodríguez en la última fecha ante Audax, en el CAP.",
      dt:"Gustavo Álvarez",
      ind:{plantel:82,moral:84,hinchada:78,socios:55,cantera:70,estadio:62,prestigio:78,riesgo:18},
      caja:{plata:380,deuda:140}};
    EPOCAS_CLUB.HUA=(EPOCAS_CLUB.HUA||[]).concat([hua2023]);
  }

  if(typeof FIXTURES_OFICIALES==="object"){
    /* resto de 1991 PRIMERO, solo con el fixture de Colo-Colo (sin pisar fechas de la U).
       vs CC: marcador real, el string home-away se mantiene. El resto: real:null. */
    if(typeof LIGA_CC_1991!=="undefined" && typeof emparejarFecha==="function" && typeof LIGA91!=="undefined"){
      LIGA91.forEach(function(c){
        if(c.id==="CC") return;
        const fx=[];
        LIGA_CC_1991.forEach(function(ccM){
          if(ccM.rival===c.id){
            fx.push({fecha:ccM.fecha,f:ccM.f,rival:"CC",local:!ccM.local,real:ccM.real});
            return;
          }
          const pares=emparejarFecha(1991,ccM.fecha,"CC",ccM.rival);
          const mio=pares.find(function(p){ return p[0]===c.id||p[1]===c.id; });
          if(!mio) return;
          const local=mio[0]===c.id, riv=local?mio[1]:mio[0];
          fx.push({fecha:ccM.fecha,f:ccM.f,rival:riv,local:local,real:null});
        });
        if(c.id==="UC"){
          const vsUch=fx.filter(function(x){ return x.rival==="UCH"; });
          if(vsUch[0]){ vsUch[0].f={m:8,d:15}; vsUch[0].local=false; vsUch[0].real="2-5"; }
          if(vsUch[1]){ vsUch[1].f={m:11,d:23}; vsUch[1].local=false; vsUch[1].real="2-3"; }
        }
        if(!FIXTURES_OFICIALES[c.id]) FIXTURES_OFICIALES[c.id]={};
        FIXTURES_OFICIALES[c.id][1991]=fx;
      });
    }
    /* la U pisa el generado con su campaña real (chuncho.com) */
    if(!FIXTURES_OFICIALES.UCH) FIXTURES_OFICIALES.UCH={};
    FIXTURES_OFICIALES.UCH[1991]=LIGA_UCH_1991;
  }

  /* E) arcos 1991-only (FV, SW, ANT, OSO, UES, CBS) */
  if(typeof ARCOS_EQUIPO==="object"){
    if(!ARCOS_EQUIPO.FV) ARCOS_EQUIPO.FV=[{id:"fv_almirante",t:"El Almirante en Primera",desc:"Fernández Vial es Concepción obrera: hinchada de puerto y un club que no se deja de Santiago.",
      capitulos:[
        {id:"fv_1",t:"El barrio no se vende",ctx:"Aparece un inversionista santiaguino. La gente del Almirante pide que el club se quede en Collao, con su gente.",
         ops:[{t:"El club se queda en el puerto",d:"Identidad firme.",grupos:{comunidad:14,hinchada:10,sponsors:-6},mem:"dejaste a Vial en su puerto",va:"fv_2"},
              {t:"Abrir a plata de afuera",d:"Caja ahora, recelo después.",ef:{plata:70},grupos:{directorio:8,comunidad:-10},mem:"abriste Vial a plata de Santiago",va:"fv_2"}]},
        {id:"fv_2",t:"No ser sucursal de nadie",ctx:"Cada año un grande quiere usar a Vial de puente. La hinchada está harta.",
         ops:[{t:"Armar con sello local",d:"Menos nombres, más casa.",grupos:{comunidad:12,hinchada:8},mem:"le diste a Vial un sello de Concepción",cierra:true,logro:"de_la_comunidad"},
              {t:"Aceptar el puente y cobrarlo",d:"Plata, alma ajena.",ef:{plata:50},grupos:{directorio:8,hinchada:-10},mem:"aceptaste que Vial sea puente",cierra:true}]}
      ]}];
    if(!ARCOS_EQUIPO.SW) ARCOS_EQUIPO.SW=[{id:"sw_ceta",t:"Playa Ancha no pide permiso",desc:"Wanderers es Valparaíso: orgullo porteño y una historia más grande que la tabla.",
      capitulos:[
        {id:"sw_1",t:"El puerto contra la tabla",ctx:"Wanderers carga con una camiseta pesada y una campaña flaca. La gente pide dignidad, no milagros.",
         ops:[{t:"Hablar claro: primero no bajar",d:"Honesto. Poco épico.",grupos:{socios:8,directorio:6,hinchada:-4},mem:"hablaste claro en Wanderers: primero no bajar",va:"sw_2"},
              {t:"Prometer que el ceta se levanta",d:"La ciudad se prende.",grupos:{hinchada:12,prensa:6,directorio:-6},mem:"prometiste que Wanderers se levantaba",va:"sw_2"}]},
        {id:"sw_2",t:"Playa Ancha de los domingos",ctx:"¿El estadio es de los porteños de toda la vida o de la postal?",
         ops:[{t:"Precios para el que vive acá",d:"Tribuna local.",ef:{plata:-20},grupos:{comunidad:12,hinchada:10},mem:"cuidaste al hincha de Playa Ancha",cierra:true,logro:"de_la_comunidad"},
              {t:"Cobrar la marca Valparaíso",d:"Caja de turismo.",ef:{plata:55},grupos:{sponsors:10,comunidad:-8},mem:"cobraste Wanderers como postal de puerto",cierra:true}]}
      ]}];
    if(!ARCOS_EQUIPO.ANT) ARCOS_EQUIPO.ANT=[{id:"ant_puma",t:"El puma del norte",desc:"Antofagasta es distancia, calor y un club que odia que lo traten de sucursal minera.",
      capitulos:[
        {id:"ant_1",t:"El viaje es un arma",ctx:"El rival sufre el norte. Eso es ventaja. También es un club lejos de todo.",
         ops:[{t:"Hacer de la localía un infierno",d:"Puntos feos, poco marketing.",grupos:{hinchada:10,camarin:8,prensa:-4},mem:"hiciste de Antofagasta un arma y no una queja",va:"ant_2"},
              {t:"Pedir más fechas en el centro",d:"Cómodo, menos identidad.",grupos:{sponsors:8,comunidad:-10},mem:"sacaste a Antofagasta de su casa por comodidad",va:"ant_2"}]},
        {id:"ant_2",t:"Puma de región",ctx:"¿Se pelea de igual a igual o se acepta el rol de club del norte?",
         ops:[{t:"Pelearle a los grandes",d:"Ambicioso.",ef:{prestigio:6},grupos:{hinchada:12},mem:"prometiste que Antofagasta no iba a ser sucursal",cierra:true},
              {t:"Ser sólidos y de región",d:"Menos tapa, más respeto local.",grupos:{comunidad:10,socios:8},mem:"afirmaste a Antofagasta como club de región",cierra:true}]}
      ]}];
    if(!ARCOS_EQUIPO.OSO) ARCOS_EQUIPO.OSO=[{id:"oso_sur",t:"El sur no es turismo",desc:"Osorno llegó a Primera. El frío, la distancia y el pueblo piden que no sea un verano.",
      capitulos:[
        {id:"oso_1",t:"Quedarse o volver",ctx:"El club está arriba y la ciudad se ilusiona. La caja no da para soñar en voz alta.",
         ops:[{t:"Construir para quedarse",d:"Menos fiesta, más predio.",grupos:{camarin:10,socios:8},mem:"construiste para que Osorno se quede en Primera",va:"oso_2"},
              {t:"Cobrar la fiesta del ascenso",d:"Plata ahora.",ef:{plata:60},grupos:{sponsors:10,camarin:-6},mem:"cobraste la fiesta de Osorno",va:"oso_2"}]},
        {id:"oso_2",t:"El sur tiene memoria",ctx:"Si se baja, duele el doble. Hay que dejarle un mensaje al pueblo.",
         ops:[{t:"Gracias, pase lo que pase",d:"El pueblo te adopta.",ef:{prestigio:6},grupos:{comunidad:14,hinchada:10},mem:"le dejaste a Osorno un recuerdo de Primera",cierra:true,logro:"de_la_comunidad"},
              {t:"Prometer que esto recién empieza",d:"Si no cumples, duele.",grupos:{hinchada:12,directorio:-4},mem:"le prometiste a Osorno que el sueño recién empezaba",cierra:true}]}
      ]}];
    if(!ARCOS_EQUIPO.UES) ARCOS_EQUIPO.UES=[{id:"ues_hispano",t:"Santa Laura y la colonia",desc:"Unión Española es colonia, Santa Laura y un club que se cree grande cuando la tabla no lo acompaña.",
      capitulos:[
        {id:"ues_1",t:"Colonia o mercado",ctx:"La colectividad pide que el club siga siendo suyo. Un fondo ofrece plata a cambio de marca neutra.",
         ops:[{t:"El club es de la colonia",d:"Orgullo, menos caja.",grupos:{comunidad:14,hinchada:8,sponsors:-6},mem:"defendiste que la Española siga siendo de su colonia",va:"ues_2"},
              {t:"Abrir la marca",d:"Plata, recelo.",ef:{plata:80},grupos:{sponsors:12,comunidad:-10},mem:"abriste la Española más allá de su colonia",va:"ues_2"}]},
        {id:"ues_2",t:"Santa Laura de semana",ctx:"El estadio se llena con visita grande. El resto, sillas vacías.",
         ops:[{t:"Bajar entradas y llenar",d:"Caja chica, tribuna viva.",ef:{plata:-25},grupos:{hinchada:10,comunidad:8},mem:"llenaste Santa Laura bajando el precio",cierra:true},
              {t:"Cobrar caro la platea",d:"Más por cabeza, menos pueblo.",ef:{plata:45},grupos:{sponsors:8,hinchada:-8},mem:"cuidaste la platea de la Española y vaciaste la popular",cierra:true}]}
      ]}];
    if(!ARCOS_EQUIPO.CBS) ARCOS_EQUIPO.CBS=[{id:"cbs_cobre",t:"El Cobre no es postal",desc:"Cobresal 1991 ya jugaba en el desierto. Llegar, quedarse y que la gente no se sienta sola.",
      capitulos:[
        {id:"cbs_1",t:"El fin del mundo",ctx:"El rival odia ir a El Salvador. Eso es ventaja y también aislamiento.",
         ops:[{t:"Hacer de la altura un arma",d:"Localía brava.",grupos:{hinchada:10,camarin:8},mem:"hiciste de El Salvador un arma en el 91",va:"cbs_2"},
              {t:"Pedir jugar más cerca",d:"Cómodo, menos identidad.",grupos:{sponsors:8,comunidad:-12},mem:"sacaste a Cobresal de su casa por comodidad",va:"cbs_2"}]},
        {id:"cbs_2",t:"Pueblo minero",ctx:"El club es la otra bandera del pueblo.",
         ops:[{t:"El club es de El Salvador",d:"Identidad de pueblo.",ef:{prestigio:6},grupos:{comunidad:14,hinchada:10},mem:"afirmaste que Cobresal es de El Salvador",cierra:true,logro:"de_la_comunidad"},
              {t:"Administrarlo como negocio",d:"Sano y frío.",ef:{plata:40},grupos:{directorio:10,comunidad:-12},mem:"trataste a Cobresal como un negocio nómade",cierra:true}]}
      ]}];
  }
})();
