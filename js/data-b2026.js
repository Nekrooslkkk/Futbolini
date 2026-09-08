"use strict";
/* ============================================================
   FUTBOLINI 7.32 · data-b2026.js
   Primera B / Liga de Ascenso 2026 (16 clubes) + Copa Chile 2026
   (8 grupos reales, Wikipedia / ANFP). Se carga DESPUÉS de
   data-clubes2026.js y ANTES de partido.js.

   Nombres reales documentados; stats ESTIMADAS del juego.
   Si un plantel no llega a 22, se dejan los que hay: armarPlantel
   rellena con cantera ficticia. NUNCA se inventa un nombre como real.

   IDs (no chocan con Primera 2026: CC UCH UC PAL LIM EVE COQ AUD
   HUA OHI NUB COB CAL LSE DCO UDC):
   CBL Cobreloa · SW Wanderers · SLQ San Luis · ANT Antofagasta ·
   MAG Magallanes · UES U. Española · REC Recoleta · PMO Puerto Montt ·
   SMA San Marcos · COP Copiapó · TEM Temuco · IQQ Iquique ·
   USF San Felipe · CUR Curicó · SCR Santa Cruz · RAN Rangers.
   (COB en 2026 es Cobresal de Primera. Cobreloa = CBL.)
   ============================================================ */

const LIGA_B_2026=[
 {id:"SW", n:"Santiago Wanderers",     c:"Wanderers",   fuerza:68, aforo:20575, est:"Estadio Elías Figueroa Brander", ciudad:"Valparaíso"},
 {id:"CBL",n:"Cobreloa",                c:"Cobreloa",    fuerza:67, aforo:20352, est:"Estadio Zorros del Desierto",    ciudad:"Calama"},
 {id:"SLQ",n:"San Luis de Quillota",    c:"San Luis",    fuerza:64, aforo:7703,  est:"Estadio Lucio Fariña Fernández", ciudad:"Quillota"},
 {id:"ANT",n:"Deportes Antofagasta",    c:"Antofagasta", fuerza:64, aforo:21178, est:"Estadio Regional Calvo y Bascuñán", ciudad:"Antofagasta"},
 {id:"MAG",n:"Deportes Magallanes",     c:"Magallanes",  fuerza:63, aforo:3500,  est:"Estadio Luis Navarro Avilés",     ciudad:"San Bernardo"},
 {id:"UES",n:"Unión Española",          c:"U. Española", fuerza:62, aforo:19000, est:"Estadio Santa Laura",             ciudad:"Santiago"},
 {id:"REC",n:"Deportes Recoleta",       c:"Recoleta",    fuerza:61, aforo:5000,  est:"Estadio Municipal de Recoleta",   ciudad:"Santiago"},
 {id:"PMO",n:"Deportes Puerto Montt",   c:"Pto. Montt",  fuerza:61, aforo:10000, est:"Estadio Regional de Chinquihue",  ciudad:"Puerto Montt"},
 {id:"SMA",n:"San Marcos de Arica",     c:"San Marcos",  fuerza:60, aforo:14200, est:"Estadio Carlos Dittborn",         ciudad:"Arica"},
 {id:"COP",n:"Deportes Copiapó",        c:"Copiapó",     fuerza:58, aforo:8000,  est:"Estadio Luis Valenzuela Hermosilla", ciudad:"Copiapó"},
 {id:"TEM",n:"Deportes Temuco",         c:"Temuco",      fuerza:57, aforo:18413, est:"Estadio Germán Becker",           ciudad:"Temuco"},
 {id:"IQQ",n:"Deportes Iquique",        c:"Iquique",     fuerza:56, aforo:13171, est:"Estadio Tierra de Campeones",     ciudad:"Iquique"},
 {id:"USF",n:"Unión San Felipe",        c:"San Felipe",  fuerza:54, aforo:12000, est:"Estadio Municipal de San Felipe", ciudad:"San Felipe"},
 {id:"CUR",n:"Curicó Unido",            c:"Curicó",      fuerza:53, aforo:8278,  est:"Estadio La Granja",               ciudad:"Curicó"},
 {id:"SCR",n:"Deportes Santa Cruz",     c:"Santa Cruz",  fuerza:52, aforo:5000,  est:"Estadio Municipal Joaquín Muñoz", ciudad:"Santa Cruz"},
 {id:"RAN",n:"Rangers de Talca",        c:"Rangers",     fuerza:50, aforo:8234,  est:"Estadio Fiscal de Talca",         ciudad:"Talca"}
];

function idsPrimeraB(){ return LIGA_B_2026.map(function(c){ return c.id; }); }
function esClubB(id){ return idsPrimeraB().indexOf(id)>=0; }
function clubLookup(id){
  if(typeof CLUB_POR_ID!=="undefined" && CLUB_POR_ID[id]) return CLUB_POR_ID[id];
  var i, x;
  for(i=0;i<LIGA_B_2026.length;i++){ if(LIGA_B_2026[i].id===id) return LIGA_B_2026[i]; }
  if(typeof LIGA_2026!=="undefined"){
    for(i=0;i<LIGA_2026.length;i++){ if(LIGA_2026[i].id===id) return LIGA_2026[i]; }
  }
  if(typeof LIGA91!=="undefined"){
    for(i=0;i<LIGA91.length;i++){ if(LIGA91[i].id===id) return LIGA91[i]; }
  }
  return null;
}

if(typeof LIGAS==="object") LIGAS["2026b"]=LIGA_B_2026;
if(typeof ERA==="object" && ERA[2026]) ERA["2026b"]=ERA[2026];

/* ---------- identidad / indicadores / caja / estatuto / poder ---------- */
(function integrarB2026(){
  if(typeof CLUB_INFO_2026!=="undefined") Object.assign(CLUB_INFO_2026,{
    CBL:{n:"Cobreloa",esc:"🟠",est:"Estadio Zorros del Desierto",dt:"César Bravo",
      desc:"Calama, desierto y un estadio que quema. Descendió en 2024 y en 2026 pelea el ascenso con plantel de peso. El naranja no negocia quedarse en la B."},
    SW:{n:"Santiago Wanderers",esc:"🟢",est:"Estadio Elías Figueroa Brander",dt:"Francisco Palladino",
      desc:"El decano de Valparaíso. Años en la B y una hinchada que no se rinde. En 2026 manda la tabla y Playa Ancha duele."},
    SLQ:{n:"San Luis de Quillota",esc:"🟡",est:"Estadio Lucio Fariña Fernández",dt:"Humberto Suazo",
      desc:"Quillota, cantera y un estadio chico que se pone bravo. Pelea arriba con menos vitrina que los grandes de la categoría."},
    ANT:{n:"Deportes Antofagasta",esc:"🔵",est:"Estadio Regional Calvo y Bascuñán",dt:"Luis Marcoleta",
      desc:"El puma del norte. Regional grande, viaje eterno para el rival y la costumbre de pelear el ascenso."},
    MAG:{n:"Deportes Magallanes",esc:"🔵",est:"Estadio Luis Navarro Avilés",dt:"Miguel Ponce",
      desc:"El más antiguo de Chile, hoy en San Bernardo. Historia enorme, presupuesto de B y la mancha carabelera que no se apaga."},
    UES:{n:"Unión Española",esc:"🔴",est:"Estadio Santa Laura",dt:"Ronald Fuentes",
      desc:"Descendió en 2025. Santa Laura, colonia hispana y la urgencia de volver. El 2026 es para no eternizarse en la B."},
    REC:{n:"Deportes Recoleta",esc:"🟢",est:"Estadio Municipal de Recoleta",dt:"Francisco Arrué",
      desc:"Barrio, gente y poco aforo. Club joven de Santiago que se hace respetar de local aunque el recinto sea chico."},
    PMO:{n:"Deportes Puerto Montt",esc:"🟢",est:"Estadio Regional de Chinquihue",dt:"Emilio Mancilla",
      desc:"El salmón del sur. Chinquihue, lluvia y un viaje que cansa al rival. Recién ascendido, el objetivo es consolidarse."},
    SMA:{n:"San Marcos de Arica",esc:"🔵",est:"Estadio Carlos Dittborn",dt:"Iván Sandrock",
      desc:"Arica, frontera y el Dittborn. Localía de norte extremo: si el rival no viaja entero, se queda con un punto."},
    COP:{n:"Deportes Copiapó",esc:"🟡",est:"Estadio Luis Valenzuela Hermosilla",dt:"Erwin Durán",
      desc:"Atacama, calor y un club que ya conoció Primera. En 2026 arma plantel para no quedar a mitad de tabla."},
    TEM:{n:"Deportes Temuco",esc:"⚪",est:"Estadio Germán Becker",dt:"Emiliano Astorga",
      desc:"El albiverde de La Araucanía. Becker lleno es otro partido. Años de B, la gente pide algo más que pelear abajo."},
    IQQ:{n:"Deportes Iquique",esc:"🔵",est:"Estadio Tierra de Campeones",dt:"Hernán Peña",
      desc:"Descendió en 2025. Dragones del desierto, Tierra de Campeones y la obligación de volver. El 2026 duele si se estanca."},
    USF:{n:"Unión San Felipe",esc:"🟢",est:"Estadio Municipal de San Felipe",dt:"Juan José Luvera",
      desc:"El uni-uni del Aconcagua. Pueblo, estadio chico y campañas que a veces se van al fondo de la tabla."},
    CUR:{n:"Curicó Unido",esc:"🔴",est:"Estadio La Granja",dt:"Damián Muñoz",
      desc:"Albirrojo de La Granja. Conoció Primera y ahora pelea para no irse más abajo. La gente no olvida lo que fue."},
    SCR:{n:"Deportes Santa Cruz",esc:"🔴",est:"Estadio Municipal Joaquín Muñoz",dt:"Dalcio Giovagnoli",
      desc:"Colchagua, estadio chico y plantel corto. Sobrevivir en la B ya es un título para el pueblo."},
    RAN:{n:"Rangers de Talca",esc:"🔴",est:"Estadio Fiscal de Talca",dt:"Ivo Basay",
      desc:"El piducano. Talca, Fiscal y una temporada 2026 para olvidar si no se endereza. La categoría no perdona."}
  });
  if(typeof IND_BASE_2026!=="undefined") Object.assign(IND_BASE_2026,{
    CBL:{plantel:66,moral:64,hinchada:72,socios:48,cantera:55,estadio:74,prestigio:62,riesgo:38},
    SW: {plantel:68,moral:70,hinchada:78,socios:52,cantera:58,estadio:70,prestigio:64,riesgo:32},
    SLQ:{plantel:62,moral:62,hinchada:55,socios:42,cantera:52,estadio:50,prestigio:48,riesgo:36},
    ANT:{plantel:64,moral:60,hinchada:58,socios:44,cantera:50,estadio:72,prestigio:52,riesgo:40},
    MAG:{plantel:60,moral:58,hinchada:50,socios:46,cantera:54,estadio:42,prestigio:58,riesgo:42},
    UES:{plantel:63,moral:52,hinchada:62,socios:50,cantera:56,estadio:66,prestigio:60,riesgo:48},
    REC:{plantel:58,moral:60,hinchada:48,socios:36,cantera:48,estadio:38,prestigio:40,riesgo:40},
    PMO:{plantel:60,moral:64,hinchada:58,socios:40,cantera:46,estadio:62,prestigio:46,riesgo:34},
    SMA:{plantel:58,moral:58,hinchada:52,socios:38,cantera:44,estadio:60,prestigio:44,riesgo:38},
    COP:{plantel:56,moral:54,hinchada:48,socios:36,cantera:42,estadio:52,prestigio:44,riesgo:44},
    TEM:{plantel:56,moral:55,hinchada:54,socios:40,cantera:48,estadio:68,prestigio:46,riesgo:40},
    IQQ:{plantel:55,moral:48,hinchada:56,socios:42,cantera:50,estadio:64,prestigio:52,riesgo:50},
    USF:{plantel:52,moral:50,hinchada:42,socios:34,cantera:40,estadio:48,prestigio:38,riesgo:46},
    CUR:{plantel:52,moral:48,hinchada:50,socios:38,cantera:44,estadio:56,prestigio:44,riesgo:48},
    SCR:{plantel:50,moral:50,hinchada:40,socios:30,cantera:38,estadio:36,prestigio:34,riesgo:44},
    RAN:{plantel:48,moral:42,hinchada:48,socios:36,cantera:42,estadio:54,prestigio:40,riesgo:52}
  });
  if(typeof CAJA_BASE_2026!=="undefined") Object.assign(CAJA_BASE_2026,{
    CBL:{plata:280,deuda:160}, SW:{plata:300,deuda:140}, SLQ:{plata:180,deuda:90},
    ANT:{plata:240,deuda:130}, MAG:{plata:160,deuda:80}, UES:{plata:260,deuda:220},
    REC:{plata:140,deuda:70},  PMO:{plata:170,deuda:85}, SMA:{plata:150,deuda:75},
    COP:{plata:160,deuda:95},  TEM:{plata:170,deuda:100},IQQ:{plata:200,deuda:180},
    USF:{plata:120,deuda:90},  CUR:{plata:140,deuda:110},SCR:{plata:110,deuda:70},
    RAN:{plata:130,deuda:100}
  });
  var estatutoB={propiedad:"corporacion",modelo:"mixto",identidad:"regional",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"};
  if(typeof ESTATUTO_INICIAL!=="undefined"){
    var est={};
    LIGA_B_2026.forEach(function(c){ est[c.id]=Object.assign({},estatutoB); });
    est.UES.identidad="colonia"; est.MAG.identidad="popular"; est.REC.identidad="barrial";
    Object.assign(ESTATUTO_INICIAL,est);
  }
  if(typeof PODER_CLUB!=="undefined"){
    var pod={};
    LIGA_B_2026.forEach(function(c){
      pod[c.id]={directorio:50,socios:46,hinchada:55,camarin:55,tecnico:52,prensa:42,anfp:44,sponsors:40,comunidad:58};
    });
    pod.CBL.hinchada=70; pod.SW.hinchada=76; pod.UES.hinchada=62; pod.IQQ.hinchada=58;
    Object.assign(PODER_CLUB,pod);
  }
})();

/* ============================================================
   PLANTELES 2026 · nombres documentados (Wikipedia / FotMob /
   En Cancha / ADN / Transfermarkt / playmakerstats, sep 2026).
   Stats estimadas. POS ARQ|DEF|VOL|DEL. nivel/proy 20–75.
   ============================================================ */

const PLANTEL_CBL_2026=[
 ["Diego Tapia","ARQ",31,68,70,22,55,["seguro bajo los tres palos"]],
 ["Hugo Araya","ARQ",25,66,74,18,50,["canterano","proyección"]],
 ["Cristián Alarcón","ARQ",22,52,68,8,18,["canterano"]],
 ["Bastián San Juan","DEF",32,70,70,28,70,["juego aéreo","de la casa"]],
 ["Rodolfo González","DEF",37,64,64,18,22,["ídolo","juego aéreo"]],
 ["Diego García","DEF",29,66,68,20,48,[]],
 ["David Tapia","DEF",28,64,66,16,40,["de la casa"]],
 ["Felipe Fritz","DEF",28,63,65,16,38,["velocidad"]],
 ["Youssef González","DEF",22,58,70,10,28,["canterano"]],
 ["Joaquín Méndez","DEF",20,54,70,8,22,["canterano","proyección"]],
 ["Matías Tapia","DEF",24,56,66,10,24,["canterano"]],
 ["Jorge Gatica","VOL",30,68,68,24,55,["contención"]],
 ["Tomás Aránguiz","VOL",21,64,74,16,48,["proyección","enganche"]],
 ["Cristian Muga","VOL",30,64,64,18,40,["extranjero","contención"]],
 ["Sebastián Zúñiga","VOL",35,62,62,16,22,["tiro libre"]],
 ["Facundo Velazco","VOL",27,63,66,16,38,["extranjero","desequilibrio"]],
 ["Lucas Cornejo","VOL",21,58,70,10,28,["canterano"]],
 ["Vicente Conelli","DEL",23,72,78,32,95,["proyección","frio de definicion"]],
 ["Gustavo Gotti","DEL",32,74,74,35,80,["extranjero","ídolo"]],
 ["Cristian Insaurralde","DEL",34,70,70,28,55,["extranjero","desequilibrio"]],
 ["Matías Sandoval","DEL",29,66,68,22,50,["extranjero","llegador"]],
 ["Álvaro Delgado","DEL",29,62,64,16,32,["velocidad"]],
 ["Yastin Navarro","DEL",19,52,70,8,22,["canterano","proyección"]]
];

const PLANTEL_SW_2026=[
 ["Eduardo Miranda","ARQ",33,66,66,18,40,[]],
 ["Bayron Martínez","ARQ",25,64,70,14,38,[]],
 ["Raúl Olivares","ARQ",38,60,60,12,12,[]],
 ["Sergio Felipe","DEF",35,66,66,18,32,["extranjero","juego aéreo"]],
 ["Pedro Navarro","DEF",25,66,72,18,50,["velocidad"]],
 ["Axel Herrera","DEF",25,64,68,16,42,[]],
 ["Víctor Espinoza","DEF",27,62,64,14,32,[]],
 ["Luis Margas","DEF",20,58,72,10,32,["canterano","proyección"]],
 ["Cristopher Valenzuela","DEF",18,54,72,8,28,["canterano"]],
 ["Cristóbal Cáceres","VOL",30,64,64,16,38,["contención"]],
 ["Leandro Navarro","VOL",34,68,68,22,40,["extranjero","contención"]],
 ["Joaquín Silva","VOL",21,66,76,18,60,["canterano","proyección"]],
 ["Martín Villarroel","VOL",24,62,68,14,38,["contención"]],
 ["Jorge Luna","VOL",39,64,64,16,18,["extranjero","enganche"]],
 ["Dylan Portilla","VOL",22,58,68,10,28,[]],
 ["Marcos Camarda","DEL",25,74,76,32,90,["extranjero","frio de definicion"]],
 ["Cristóbal Ponce","DEL",19,62,76,12,45,["canterano","proyección"]],
 ["Javier Parraguez","DEL",36,62,62,16,18,["juego aéreo"]],
 ["Ignacio Flores","DEL",19,56,72,8,28,["canterano"]],
 ["Vicente Vera","DEL",22,58,68,10,28,["velocidad"]],
 ["Denilson San Martín","DEL",18,55,72,8,26,["canterano"]]
];

const PLANTEL_UES_2026=[
 ["Martín Parra","ARQ",26,66,72,18,45,[]],
 ["Julio Fierro","ARQ",24,62,70,12,32,[]],
 ["Enzo Uribe","ARQ",22,54,68,8,18,["canterano"]],
 ["Sebastián Pereira","DEF",27,66,68,18,45,[]],
 ["José Aja","DEF",33,64,64,16,28,["extranjero","juego aéreo"]],
 ["Gabriel Norambuena","DEF",23,64,74,16,48,["canterano","velocidad"]],
 ["Bastián Roco","DEF",22,62,72,14,42,["proyección"]],
 ["Martín Ormeño","DEF",27,62,64,14,32,[]],
 ["Kevin Contreras","DEF",21,58,70,10,28,["canterano"]],
 ["Rodrigo Alarcón","DEF",21,56,68,8,24,["canterano"]],
 ["Pablo Aránguiz","VOL",29,68,68,22,50,["enganche"]],
 ["Ángelo Araos","VOL",29,66,68,20,48,["desequilibrio"]],
 ["William Machado","VOL",32,64,64,16,32,["extranjero","contención"]],
 ["Ignacio Núñez","VOL",27,62,66,14,36,[]],
 ["Ulises Ojeda","VOL",30,62,62,14,30,[]],
 ["Renato Cordero","VOL",23,60,72,12,38,["proyección"]],
 ["Patricio Rubio","DEL",37,66,66,22,28,["ídolo","frio de definicion"]],
 ["Andrés Vilches","DEL",34,64,64,18,24,["juego aéreo"]],
 ["Mitchell Wassenne","DEL",25,62,70,14,40,["velocidad"]],
 ["Franco Ratotti","DEL",21,56,70,8,26,["canterano"]]
];

const PLANTEL_IQQ_2026=[
 ["Daniel Castillo","ARQ",35,66,66,16,28,[]],
 ["Zacarías López","ARQ",28,64,70,14,40,[]],
 ["Henry Binimelis","ARQ",19,50,68,6,16,["canterano"]],
 ["Mario López","DEF",31,64,64,16,32,["extranjero"]],
 ["Franco Ledesma","DEF",33,64,64,16,28,["extranjero"]],
 ["Vicente Concha","DEF",24,62,70,14,38,[]],
 ["Dilan Rojas","DEF",22,60,70,12,34,["canterano"]],
 ["Felipe Espinoza","DEF",26,62,66,14,36,[]],
 ["Matías Blázquez","DEF",35,60,60,12,16,[]],
 ["Simón Contreras","DEF",24,60,68,12,32,[]],
 ["Brayan Garrido","VOL",27,64,68,16,42,["contención"]],
 ["Joaquín Pereyra","VOL",32,62,62,14,28,["extranjero"]],
 ["Diego Orellana","VOL",33,62,62,14,26,[]],
 ["Agustín Venezia","VOL",23,60,70,12,36,["extranjero"]],
 ["Álvaro Ramos","DEL",34,68,68,22,40,["ídolo","de la casa"]],
 ["Edson Puch","DEL",40,64,64,18,18,["ídolo","desequilibrio"]],
 ["Isaac Díaz","DEL",36,62,62,14,16,["juego aéreo"]],
 ["César González","DEL",29,62,64,14,32,[]],
 ["Thomas Jones","DEL",28,62,64,14,32,[]],
 ["Dylan Arias","DEL",19,54,70,8,24,["canterano","proyección"]]
];

const PLANTEL_ANT_2026=[
 ["Fernando Hurtado","ARQ",43,62,62,12,10,[]],
 ["Cristóbal Marín","ARQ",22,58,70,10,26,["canterano"]],
 ["Juan Pablo Cisternas","ARQ",23,54,66,8,18,["canterano"]],
 ["Bastián Tapia","DEF",24,66,72,18,50,["juego aéreo"]],
 ["Alex Ibacache","DEF",27,64,68,16,42,["velocidad"]],
 ["Mathías Suárez","DEF",30,64,64,16,36,["extranjero"]],
 ["Zacarías Abuhadba","DEF",21,60,72,12,36,["canterano","proyección"]],
 ["Simón Ramírez","DEF",27,62,66,14,36,[]],
 ["Diego Salvia","DEF",26,60,64,12,28,[]],
 ["Manuel Maluenda","DEF",24,58,66,10,26,[]],
 ["Sebastián Leyton","VOL",33,66,66,18,36,["contención"]],
 ["Diego Rojas","VOL",31,64,64,16,34,["enganche"]],
 ["Fabián Manzano","VOL",32,62,62,14,28,["contención"]],
 ["Nelson Sepúlveda","VOL",34,62,62,14,24,[]],
 ["Kevin Campillay","VOL",25,64,70,16,45,["desequilibrio"]],
 ["Adrián Cuadra","VOL",28,60,64,12,28,[]],
 ["Josepablo Monreal","DEL",30,68,70,22,55,["frio de definicion"]],
 ["Matías Gallegos","DEL",29,64,66,16,40,["extranjero"]],
 ["Brayan Hurtado","DEL",26,62,66,14,34,["extranjero","velocidad"]]
];

const PLANTEL_COP_2026=[
 ["Nicolás Temperini","ARQ",31,66,66,16,36,["extranjero"]],
 ["Richard Leyton","ARQ",33,58,58,10,14,[]],
 ["Marcelo Filla","DEF",28,64,66,16,38,[]],
 ["Fabián Torres","DEF",27,62,64,14,32,[]],
 ["Nicolás Suárez","DEF",29,62,64,14,30,[]],
 ["Agustín Ortiz","DEF",26,60,66,12,30,[]],
 ["John Santander","DEF",31,62,62,14,28,[]],
 ["Diego Opazo","DEF",30,58,60,10,20,[]],
 ["Axl Ríos","VOL",26,64,68,16,40,["contención"]],
 ["Francisco Espoz","VOL",27,64,68,16,42,["llegador"]],
 ["Claudio Zamorano","VOL",26,62,66,14,34,[]],
 ["Iván Ledezma","VOL",31,62,62,14,28,[]],
 ["Gastón Pérez","VOL",26,60,66,12,28,["extranjero"]],
 ["Nozomi Kimura","VOL",28,60,64,12,26,[]],
 ["Lautaro Palacios","DEL",31,68,68,22,50,["extranjero","frio de definicion"]],
 ["Carlos Ross","DEL",35,64,64,16,24,["velocidad"]],
 ["Manuel López","DEL",30,60,62,12,24,[]],
 ["Enzo Fernández","DEL",24,58,66,10,26,["proyección"]]
];

const PLANTEL_PMO_2026=[
 ["Gonzalo Collao","ARQ",28,66,70,18,45,[]],
 ["Luis Ureta","ARQ",27,62,68,14,34,[]],
 ["Maximiliano Riveros","DEF",28,66,68,18,48,["juego aéreo"]],
 ["Ariel Morales","DEF",29,64,66,16,40,[]],
 ["Francisco Calisto","DEF",22,62,72,14,42,["proyección"]],
 ["Byron Nieto","DEF",28,64,66,16,40,[]],
 ["Jesús Pino","DEF",35,60,60,12,16,[]],
 ["Kevin Egaña","DEF",30,60,62,12,26,[]],
 ["Juan Jaime","VOL",33,64,64,16,32,["contención"]],
 ["Gabriel Castillo","VOL",28,64,66,16,38,[]],
 ["Alexis Sabella","VOL",25,62,68,14,36,["extranjero"]],
 ["Jason Flores","VOL",29,64,66,16,38,["enganche"]],
 ["Danilo Díaz","VOL",24,60,68,12,32,[]],
 ["Richard Paredes","DEL",28,68,70,22,52,["frio de definicion"]],
 ["Reiner Castro","DEL",32,64,64,16,32,["extranjero"]],
 ["Sebastián Pérez","DEL",27,62,66,14,34,["velocidad"]],
 ["Luciano Vásquez","DEL",41,58,58,10,8,[]],
 ["Salvador Negrete","DEL",20,56,72,10,30,["canterano","proyección"]]
];

const PLANTEL_SLQ_2026=[
 ["Nicolás Peranic","ARQ",41,60,60,10,8,[]],
 ["Fernando Abarzúa","ARQ",23,58,68,10,24,["canterano"]],
 ["Tomás Charpentier","ARQ",20,52,68,6,16,["canterano"]],
 ["Guillermo Avello","DEF",30,64,64,16,34,[]],
 ["Ignacio Meza","DEF",30,64,64,16,32,["juego aéreo"]],
 ["Cristian González","DEF",36,60,60,12,14,[]],
 ["Mateo Guerra","DEF",21,60,70,12,34,["proyección"]],
 ["Vicente Durán","DEF",26,62,66,14,32,[]],
 ["Carlos Hormazábal","DEF",24,62,68,14,36,[]],
 ["Lucciano Moreno","DEF",22,58,68,10,26,["canterano"]],
 ["Fabián González","VOL",23,60,68,12,30,[]],
 ["Franco Cortés","VOL",25,60,66,12,28,[]],
 ["Gamal Plaza","VOL",18,52,70,6,20,["canterano","proyección"]],
 ["Diego Zamorano","VOL",19,52,68,6,18,["canterano"]]
];

/* Planteles 2026 documentados (Wikipedia / FotMob / fichajes). Stats estimadas. */
const PLANTEL_TEM_2026=[
 ["Yerko Urra","ARQ",30,66,66,16,36,[]],
 ["Juan José Garrido","ARQ",23,56,68,8,20,["canterano"]],
 ["Franco Quijada","ARQ",19,48,66,6,14,["canterano"]],
 ["Luis Casanova","DEF",34,64,64,16,28,["juego aéreo"]],
 ["Miguel Sanhueza","DEF",35,62,62,14,22,[]],
 ["Diego Zambrano","DEF",28,62,64,14,30,[]],
 ["Brian Torrealba","DEF",29,62,64,14,30,[]],
 ["Enzo Lettieri","DEF",28,62,66,14,32,["extranjero"]],
 ["Rodrigo González","DEF",30,60,62,12,26,[]],
 ["Franco Ortega","DEF",30,60,62,12,24,[]],
 ["Frank Valenzuela","DEF",24,58,66,10,24,["canterano"]],
 ["Diego Buonanotte","VOL",38,66,66,18,22,["extranjero","enganche"]],
 ["Nicolás Astete","VOL",33,60,60,12,22,[]],
 ["Camilo Núñez","VOL",32,62,62,14,26,["extranjero"]],
 ["Brayan Valdivia","VOL",32,60,60,12,22,[]],
 ["Brayan Troncoso","VOL",25,60,66,12,30,[]],
 ["César Huanca","DEL",25,66,72,18,48,["frio de definicion"]],
 ["Felipe Reynero","DEL",37,62,62,14,18,["velocidad"]],
 ["Luis Acevedo","DEL",29,64,66,16,36,["extranjero"]],
 ["Nicolás Rivera","DEL",28,62,64,14,32,[]],
 ["Sebastián Molina","DEL",25,60,66,12,30,[]]
];
const PLANTEL_REC_2026=[
 ["Álvaro Salazar","ARQ",33,64,64,16,28,[]],
 ["José Ignacio Narr","ARQ",23,54,66,8,16,["canterano"]],
 ["Jaime Vargas","ARQ",21,50,66,6,14,["canterano"]],
 ["Francisco Alarcón","DEF",36,62,62,14,18,["juego aéreo"]],
 ["Brayams Viveros","DEF",34,62,62,14,24,[]],
 ["Christian Cepeda","DEF",35,60,60,12,16,["extranjero"]],
 ["Camilo Rodríguez","DEF",31,62,62,14,26,[]],
 ["Fabrizio Tomarelli","DEF",25,60,66,12,30,[]],
 ["Daniel Viveros","DEF",25,60,66,12,28,[]],
 ["Ignacio Lara","DEF",30,60,62,12,22,[]],
 ["Branco Provoste","VOL",26,64,68,16,40,["proyección"]],
 ["Felipe Báez","VOL",35,60,60,12,18,[]],
 ["Mikel Arguinarena","VOL",35,60,60,12,16,[]],
 ["Federico Martín","VOL",35,58,58,10,14,["extranjero"]],
 ["Nicolás Carvajal","VOL",29,58,62,10,20,[]],
 ["Germán Estigarribia","DEL",29,66,68,18,42,["frio de definicion"]],
 ["Pedro Sánchez","DEL",28,64,66,16,38,[]],
 ["Gonzalo Álvarez","DEL",30,62,64,14,32,["velocidad"]],
 ["Bastián Valdés","DEL",25,60,66,12,28,[]],
 ["Ignacio Fuenzalida","DEL",24,58,66,10,24,[]],
 ["Carlos González","DEL",23,56,66,10,22,["proyección"]]
];
const PLANTEL_SMA_2026=[
 ["Rodrigo Saracho","ARQ",32,66,66,16,34,["extranjero"]],
 ["Benjamín Tapia","ARQ",21,58,72,10,28,["proyección"]],
 ["Josaphat Muñoz","ARQ",17,46,68,4,12,["canterano"]],
 ["Yerko Águila","DEF",30,64,66,16,38,[]],
 ["Álvaro Cazula","DEF",30,64,66,16,36,["extranjero","juego aéreo"]],
 ["Andrés Barboza","DEF",32,62,62,14,28,["extranjero"]],
 ["Augusto Barrios","DEF",34,62,62,14,24,[]],
 ["Guillermo Cubillos","DEF",31,62,62,14,26,[]],
 ["Cristóbal Guerra","DEF",25,62,68,14,36,[]],
 ["Nicolás Aguirre","DEF",36,60,60,12,16,["extranjero"]],
 ["Mauricio Iturra","VOL",29,64,66,16,34,["contención"]],
 ["Boris Sagredo","VOL",37,62,62,14,16,["enganche"]],
 ["Nahuel Donadell","VOL",35,64,64,16,28,["extranjero","desequilibrio"]],
 ["Agustín Maidana","VOL",24,60,68,12,30,["extranjero"]],
 ["Camilo Rencoret","VOL",35,60,60,12,16,["contención"]],
 ["Nicolás Orrego","VOL",24,58,66,10,24,[]],
 ["Camilo Melivilú","DEL",32,66,66,18,36,["frio de definicion"]],
 ["Bairon Monroy","DEL",26,64,70,16,42,[]],
 ["Gonzalo Reyes","DEL",31,62,64,14,30,["velocidad"]],
 ["Nicolás Zedán","DEL",26,62,66,14,32,[]],
 ["Alfredo Ábalos","DEL",40,60,60,12,12,["extranjero"]]
];
const PLANTEL_MAG_2026=[
 ["Joaquín Muñoz","ARQ",35,64,64,16,22,[]],
 ["Juan Pablo Zozaya","ARQ",25,62,70,14,36,["extranjero"]],
 ["Martín Riffo","ARQ",22,54,68,8,18,["canterano"]],
 ["Matías Vásquez","DEF",23,64,72,16,42,["proyección"]],
 ["Jeremías James","DEF",25,64,70,16,40,["extranjero"]],
 ["Claudio Meneses","DEF",38,60,60,12,14,[]],
 ["Felipe Yáñez","DEF",21,62,74,14,48,["proyección"]],
 ["Alonso Walters","DEF",21,58,70,10,28,["canterano"]],
 ["Hans Salinas","DEF",36,60,60,12,16,[]],
 ["Diego Figueroa","DEF",23,56,66,8,22,["canterano"]],
 ["Bruno Liuzzi","VOL",26,66,70,18,44,["contención"]],
 ["Cristóbal Jorquera","VOL",38,64,64,16,18,["enganche","ídolo"]],
 ["Diego Fernández","VOL",28,64,66,16,36,[]],
 ["Santiago Coronel","VOL",26,62,68,14,34,["extranjero"]],
 ["Javier Quiroz","VOL",25,58,64,10,22,[]],
 ["Facundo Peraza","DEL",34,68,68,22,40,["extranjero","frio de definicion"]],
 ["Rubén Farfán","DEL",34,64,64,16,26,["velocidad"]],
 ["Matías Fredes","DEL",25,62,68,14,34,[]],
 ["Milton Alegre","DEL",34,62,62,14,24,["extranjero"]],
 ["Alessandro Toledo","DEL",23,60,68,12,30,["proyección"]],
 ["Ignacio Serpa","DEL",23,58,66,10,24,["extranjero"]]
];
const PLANTEL_USF_2026=[
 ["Leandro Cañete","ARQ",31,62,64,14,26,[]],
 ["Andrés Fernández","ARQ",28,60,66,12,24,[]],
 ["Martín Ibacache","ARQ",26,54,64,8,16,["canterano"]],
 ["Valentín Perales","DEF",31,62,64,14,28,["extranjero"]],
 ["Byron Guajardo","DEF",34,60,60,12,20,[]],
 ["Diego Bravo","DEF",29,60,62,12,24,[]],
 ["Kevin Serrano","DEF",28,58,64,10,22,[]],
 ["Diego Pereira","DEF",28,58,64,10,22,[]],
 ["Cristián Suárez","DEF",39,58,58,10,10,[]],
 ["Norberto Palmieri","VOL",30,62,64,14,28,["extranjero","contención"]],
 ["Gonzalo Jara","VOL",27,60,64,12,26,[]],
 ["Ignacio Jara","VOL",29,60,64,12,26,[]],
 ["Luis García","VOL",30,58,62,10,20,[]],
 ["Axel León","VOL",23,54,66,8,18,["canterano"]],
 ["Bruno Vides","DEL",33,64,64,16,30,["extranjero","frio de definicion"]],
 ["Agustín Fontana","DEL",30,62,64,14,28,["extranjero"]],
 ["Nicolás Brun","DEL",27,60,66,12,28,["extranjero"]],
 ["Franco Lobos","DEL",27,60,66,12,28,["velocidad"]],
 ["Bairo Riveros","DEL",27,58,64,10,22,[]],
 ["Patricio Muñoz","DEL",24,56,64,8,20,[]]
];
const PLANTEL_CUR_2026=[
 ["Damián Tello","ARQ",30,64,64,16,32,["extranjero"]],
 ["Thomas Vergara","ARQ",23,58,68,10,22,["canterano"]],
 ["Juan Ruz","ARQ",22,52,66,6,16,["canterano"]],
 ["Rodrigo Colombo","DEF",33,64,64,16,30,["extranjero","juego aéreo"]],
 ["Henry Sanhueza","DEF",30,64,64,16,32,[]],
 ["Ronald de la Fuente","DEF",35,62,62,14,20,[]],
 ["Gabriel Sarria","DEF",26,62,66,14,32,[]],
 ["Francisco Oliver","DEF",31,62,62,14,26,["extranjero"]],
 ["Cristopher Medina","DEF",25,62,66,14,32,[]],
 ["Enzo Ormeño","DEF",26,60,64,12,26,[]],
 ["Juan Pablo Gómez","DEF",35,60,60,12,16,[]],
 ["Joaquín Romo","VOL",27,64,68,16,36,["enganche"]],
 ["Braulio Guisolfo","VOL",24,62,70,14,36,["extranjero","proyección"]],
 ["Bruno Veglio","VOL",28,62,66,14,32,["extranjero"]],
 ["Javier Retamales","VOL",29,62,64,14,30,[]],
 ["Benjamín Inostroza","VOL",29,62,64,14,30,[]],
 ["Leandro Benegas","DEL",37,66,66,18,24,["frio de definicion"]],
 ["Nicolás Fernández","DEL",27,64,68,16,36,["extranjero"]],
 ["Ian Aliaga","DEL",24,60,68,12,30,["proyección"]],
 ["Mauro Lópes","DEL",29,62,64,14,28,[]],
 ["Antonio Ramírez","DEL",27,58,64,10,22,[]]
];
const PLANTEL_SCR_2026=[
 ["Juan Dobboletta","ARQ",33,62,62,14,24,["extranjero"]],
 ["Maximiliano Henríquez","ARQ",20,52,68,6,16,["canterano"]],
 ["Braian Camisassa","DEF",29,64,66,16,34,["extranjero"]],
 ["Hardy Cavero","DEF",30,62,62,14,26,[]],
 ["Felipe Alvarado","DEF",27,60,64,12,26,[]],
 ["Esteban Flores","DEF",34,60,60,12,16,[]],
 ["David Tati","DEF",24,58,66,10,24,[]],
 ["Gino Alucema","VOL",34,62,62,14,22,["contención"]],
 ["Diego Acevedo","VOL",25,62,68,14,32,[]],
 ["Santiago Mederos","VOL",28,62,66,14,30,["extranjero"]],
 ["Hugo Herrera","VOL",28,60,64,12,26,[]],
 ["Felipe Orellana","VOL",25,58,64,10,22,[]],
 ["Mathías Pinto","DEL",28,64,66,16,34,[]],
 ["Nadir Zeineddin","DEL",26,64,68,16,36,["extranjero"]],
 ["Diego Arias","DEL",26,66,70,18,42,["frio de definicion"]],
 ["Yashir Islame","DEL",35,62,62,14,20,[]],
 ["Juan Delgado","DEL",33,62,62,14,22,[]],
 ["Nicolás Barrios","DEL",22,58,68,10,26,["proyección","velocidad"]],
 ["Cristian Pardo","DEL",23,56,66,8,22,[]]
];
const PLANTEL_RAN_2026=[
 ["Cristian Campestrini","ARQ",46,62,62,14,10,["extranjero"]],
 ["Fabián Cerda","ARQ",37,60,60,12,12,[]],
 ["Martín Torres","ARQ",21,52,66,6,16,["canterano"]],
 ["Carlos Labrín","DEF",35,64,64,16,22,[]],
 ["Kevin Vásquez","DEF",29,62,64,14,28,[]],
 ["Claudio Servetti","DEF",31,62,62,14,26,["extranjero"]],
 ["Sebastián Silva","DEF",35,60,60,12,16,[]],
 ["José Navarrete","DEF",28,60,64,12,26,[]],
 ["Lautaro Rigazzi","DEF",28,60,64,12,26,["extranjero"]],
 ["Matías Cortés","DEF",23,56,66,8,22,[]],
 ["Juan Méndez","VOL",30,66,68,18,40,["contención"]],
 ["Alejandro Márquez","VOL",34,64,64,16,24,[]],
 ["Iván Rozas","VOL",28,62,66,14,32,[]],
 ["Alonso Rodríguez","VOL",28,60,64,12,26,[]],
 ["Gary Moya","VOL",24,58,66,10,24,[]],
 ["Diego Plaza","VOL",25,58,64,10,22,[]],
 ["Junior Arias","DEL",33,66,66,18,32,["extranjero","frio de definicion"]],
 ["Ignacio Ibáñez","DEL",38,62,62,14,16,[]],
 ["Ignacio Mesías","DEL",25,62,68,14,34,[]],
 ["Damián González","DEL",33,60,60,12,20,[]],
 ["Manuel Vicuña","DEL",26,60,66,12,28,[]]
];

(function registrarPlantelesB(){
  if(typeof PLANTELES_REALES!=="object") return;
  function reg(club,squad){
    if(!squad || !squad.length) return;
    if(!PLANTELES_REALES[club]) PLANTELES_REALES[club]={};
    PLANTELES_REALES[club][2026]=squad;
  }
  reg("CBL",PLANTEL_CBL_2026);
  reg("SW", PLANTEL_SW_2026);
  reg("UES",PLANTEL_UES_2026);
  reg("IQQ",PLANTEL_IQQ_2026);
  reg("ANT",PLANTEL_ANT_2026);
  reg("COP",PLANTEL_COP_2026);
  reg("PMO",PLANTEL_PMO_2026);
  reg("SLQ",PLANTEL_SLQ_2026);
  reg("TEM",PLANTEL_TEM_2026);
  reg("REC",PLANTEL_REC_2026);
  reg("SMA",PLANTEL_SMA_2026);
  reg("MAG",PLANTEL_MAG_2026);
  reg("USF",PLANTEL_USF_2026);
  reg("CUR",PLANTEL_CUR_2026);
  reg("SCR",PLANTEL_SCR_2026);
  reg("RAN",PLANTEL_RAN_2026);
})();

/* ============================================================
   COPA CHILE 2026 · formato real (Wikipedia / ANFP)
   32 clubes (16 Primera + 16 B), 8 grupos de 4 (2+2), ida y vuelta.
   Top 2 a octavos (ida/vuelta). Final a partido único.
   Grupos A–H verificados. Octavos NO se pre-siembran al crear
   la carrera: se arman al clasificar (data-32.js, procedural,
   pareja A↔B / C↔D / E↔F / G↔H). No es el cuadro real 2026.
   Copa Chile 1991 existía (Copa Chile 1991 / Digeder); no se simula acá.
   ============================================================ */
const FORMAT_COPAS={
  copaChile2026:"32 clubes (16 Liga de Primera + 16 Liga de Ascenso). 8 grupos de 4, sembrados por zona (Norte/Sur), 2 de cada división por grupo. Ida y vuelta (6 fechas). Clasifican 1° y 2°. Octavos a semifinales ida/vuelta; final a partido único. El campeón (si está en Primera 2027) juega un repechaje con el 3° de liga por un cupo a Libertadores fase 2; el perdedor va a Sudamericana.",
  copaChile1991:"La Copa Chile 1991 (Digeder) se jugó en el primer semestre, con clubes de Primera y del ascenso en fases regionales y eliminación directa. Formato distinto al actual: no se copia 1:1 al 2026.",
  libertadores2026:"8 grupos de 4. Ida y vuelta. 1° y 2° a octavos. Octavos a semis ida/vuelta; final única. Chile 2026 entra por la temporada 2025: CH1 Coquimbo (campeón), CH2 Católica, CH3 O'Higgins, CH4 Huachipato (Copa Chile). En una carrera NUEVA 2026 NO se inventan los grupos: el jugador no arranca metido en una llave falsa.",
  sudamericana2026:"Fase de grupos (primera ronda de playoff + grupos según el año CONMEBOL vigente). Chile mete cupos por liga (puestos que no van a Libertadores) y por el perdedor del repechaje de Copa Chile. Knockout ida/vuelta, final única.",
  libertadores1991:"Formato 1991 (el que ganó Colo-Colo): grupos de 4 con ida/vuelta, octavos a final también ida/vuelta (sin final única). El camino real de Colo-Colo ya está en COPA91."
};

const COPA_CHILE_GRUPOS_2026={
  A:["COQ","IQQ","LIM","SMA"],
  B:["UC","EVE","SLQ","COP"],
  C:["ANT","CBL","LSE","COB"],
  D:["UCH","CAL","USF","SW"],
  E:["CC","OHI","REC","UES"],
  F:["NUB","CUR","RAN","UDC"],
  G:["SCR","AUD","PAL","MAG"],
  H:["DCO","PMO","HUA","TEM"]
};
const COPA_CHILE_FECHAS_2026=[
  {m:1,d:31},{m:2,d:8},{m:6,d:20},{m:6,d:27},{m:7,d:5},{m:8,d:12}
];

function grupoCopaChileDe(clubId){
  var g, arr, i;
  for(g in COPA_CHILE_GRUPOS_2026){
    arr=COPA_CHILE_GRUPOS_2026[g];
    for(i=0;i<arr.length;i++) if(arr[i]===clubId) return {letra:g, ids:arr};
  }
  return null;
}

function partidosCopaChileGrupo(clubId){
  var g=grupoCopaChileDe(clubId);
  if(!g) return [];
  var rivales=g.ids.filter(function(id){ return id!==clubId; });
  var out=[], i, riv, local, f, yo, elotro;
  /* 6 fechas: vs cada rival ida y vuelta, intercaladas */
  var orden=[[0,true],[1,false],[2,true],[0,false],[1,true],[2,false]];
  for(i=0;i<orden.length;i++){
    riv=rivales[orden[i][0]];
    local=orden[i][1];
    yo=clubLookup(clubId); elotro=clubLookup(riv);
    if(!yo||!elotro) continue;
    f=COPA_CHILE_FECHAS_2026[i]||{m:7,d:1+i};
    out.push({
      tipo:"copa", torneo:"Copa Chile", ronda:"Grupo "+g.letra,
      rivalId:riv, rivalNombre:elotro.n, fuerzaRival:elotro.fuerza,
      local:local, sede:local?yo.est:elotro.est,
      f:f, jugado:false,
      clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,"copaChile"+clubId+i):"despejado",
      real:null, apodo:null, notaId:"CC26-"+g.letra+"-"+i
    });
  }
  return out;
}

(function wrapCalendarioCopaChile(){
  if(typeof construirCalendario!=="function" || construirCalendario._copaChile) return;
  var orig=construirCalendario;
  construirCalendario=function(clubId, anio, conCopa){
    var cal=orig(clubId, anio, conCopa)||[];
    if(anio===2026){
      var extra=partidosCopaChileGrupo(clubId);
      extra.forEach(function(p){ cal.push(p); });
      cal.sort(function(a,b){
        var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
        var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
        return oa-ob;
      });
    }
    return cal;
  };
  construirCalendario._copaChile=true;
})();

/* rivalidades de B (esClasico / esRivalidadRegional) */
if(typeof RIVALIDADES_2026!=="undefined" && Array.isArray(RIVALIDADES_2026)){
  [["CBL","ANT"],["CBL","COP"],["IQQ","SMA"],["SW","UES"],["SLQ","USF"],
   ["TEM","PMO"],["RAN","CUR"],["MAG","UES"],["REC","UES"]].forEach(function(par){
    RIVALIDADES_2026.push(par);
  });
}
