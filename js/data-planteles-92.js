"use strict";
/* ============================================================
   FUTBOLINI 7.92 · huecos 2026 + Cobreloa 1981
   Wikipedia (club / plantilla / temporada) ago–sep 2026.
   Stats ESTIMADAS. Cargar DESPUÉS de data-planteles-91.js.
   ============================================================ */

function _pj92(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var S=_pj92;

/* Gimnasia LP · es.wikipedia plantel, act. 2 ago 2026 · DT Ariel Pereyra.
   Antes solo TM/La Nación (~10 nombres). Ingolotti está en Tucumán: no se duplica. */
const PLANTEL_GLP_FULL_2026=[
  S("Nelson Insfrán","ARQ",31,74,["capitán"]), S("Harlen Castillo","ARQ",33,70,["extranjero"]),
  S("Julián Kadijevic","ARQ",22,62,[]), S("Máximo Cabrera","ARQ",20,58,["canterano"]),
  S("Renzo Giampaoli","DEF",26,74,["préstamo"]), S("Enzo Martínez","DEF",28,72,["extranjero"]),
  S("Germán Conti","DEF",32,72,["veterano"]), S("Gonzalo Errecalde","DEF",26,70,[]),
  S("Matías Melluso","DEF",28,70,[]), S("Pedro Silva Torrejón","DEF",29,72,[]),
  S("Alexis Steimbach","DEF",24,70,[]), S("Bautista Barros Schelotto","DEF",26,70,[]),
  S("Diego Mastrángelo","DEF",23,68,[]),
  S("Ignacio Fernández","VOL",36,76,["veterano","ídolo"]), S("Ignacio Miramón","VOL",23,74,[]),
  S("Nicolás Barros Schelotto","VOL",19,68,["canterano","joven"]), S("Augusto Max","VOL",34,70,["veterano"]),
  S("Mateo Seoane","VOL",22,70,[]), S("Leandro Mamut","VOL",22,66,["canterano"]),
  S("Lucas Janson","DEL",32,76,["figura"]), S("Ivo Mammini","DEL",23,70,[]),
  S("Manuel Panaro","DEL",23,70,[]), S("Agustín Colazo","DEL",25,68,[]),
  S("Franco Torres","DEL",27,68,[]), S("Agustín Auzmendi","DEL",29,70,[]),
  S("Marcelo Torres","DEL",28,70,[]), S("Maximiliano Zalazar","DEL",25,70,[])
];

/* Central Córdoba · es.wikipedia 29 jul 2026 · DT Sebastián Domínguez. */
const PLANTEL_CCO_FULL_2026=[
  S("Alan Aguerre","ARQ",36,74,["capitán","veterano"]), S("Máximo Alvarez","ARQ",21,62,[]),
  S("Javier Vallejos","ARQ",23,64,[]),
  S("Alejandro Maciel","DEF",29,72,[]), S("Leonardo Marchi","DEF",29,70,[]),
  S("Facundo Mansilla","DEF",27,70,[]), S("José Gómez","DEF",26,68,[]),
  S("Yuri Casermeiro","DEF",24,68,[]), S("Fernando Martínez","DEF",26,68,[]),
  S("Lucas Bernabeu","DEF",22,66,[]), S("Santiago Moyano","DEF",28,70,[]),
  S("Juan Pablo Pignani","DEF",25,68,["préstamo"]), S("Felipe Aguilar","DEF",33,70,["extranjero","veterano"]),
  S("Tiago Cravero","VOL",23,70,["préstamo"]), S("Fernando Juárez","VOL",28,70,["préstamo"]),
  S("Marco Iacobellis","VOL",26,70,[]), S("Lucas González","VOL",26,68,["préstamo"]),
  S("Matías Vera","VOL",30,70,[]), S("Juan Cardozo","VOL",22,68,["extranjero","préstamo"]),
  S("Lucas Varaldo","DEL",24,72,[]), S("Horacio Tijanovich","DEL",30,70,[]),
  S("Michael Santos","DEL",33,72,["extranjero","préstamo"]), S("Ezequiel Naya","DEL",25,70,["préstamo"]),
  S("Diego Barrera","DEL",22,66,["préstamo"]), S("Joaquín Flores","DEL",21,66,["préstamo"]),
  S("Alan Daian Laprida","DEL",21,64,["préstamo"]), S("Bautista Gerez","DEL",19,60,["canterano"])
];

/* Atlético Tucumán · es.wikipedia 26 jul 2026 · DT Julio César Falcioni (La Gaceta 11 sep). */
const PLANTEL_TUC_FULL_2026=[
  S("Luis Ingolotti","ARQ",26,74,[]), S("Patricio Albornoz","ARQ",26,68,[]), S("Tomás Durso","ARQ",27,70,[]),
  S("Gastón Suso","DEF",35,74,["veterano"]), S("Leonel Di Plácido","DEF",32,72,[]),
  S("Gianluca Ferrari","DEF",29,72,[]), S("Clever Ferreira","DEF",23,72,["extranjero"]),
  S("Juan Infante","DEF",30,70,[]), S("Maximiliano Villa","DEF",29,70,["extranjero"]),
  S("Ignacio Galván","DEF",24,70,[]), S("Luciano Vallejo","DEF",22,68,["canterano"]),
  S("Moisés Brandán","DEF",26,68,[]), S("Ramiro Paunero","DEF",21,64,["canterano"]),
  S("Martín Benítez","VOL",32,74,[]), S("Julián Fernández","VOL",31,72,["extranjero"]),
  S("Kevin Ortiz","VOL",25,70,[]), S("Renzo Tesuri","VOL",30,72,[]),
  S("Ezequiel Ham","VOL",32,70,["extranjero"]), S("Gabriel Compagnucci","VOL",35,70,["veterano"]),
  S("Lautaro Godoy","VOL",23,68,[]), S("Leonel Vega","VOL",22,66,["canterano"]),
  S("Leandro Díaz","DEL",34,76,["goleador"]), S("Alexis Canelo","DEL",34,74,["veterano"]),
  S("Franco Nicola","DEL",24,70,["extranjero"]), S("Ramiro Ruiz Rodríguez","DEL",26,70,[]),
  S("Nicolás Laméndola","DEL",27,70,[]), S("Manuel Brondo","DEL",24,68,[]),
  S("Facundo Pimienta","DEL",23,64,[]), S("Rodrigo Granillo","DEL",20,62,["canterano"])
];

/* Barracas · web oficial + Mundo Deportivo sep 2026. Jappert es DEF en la web. */
const PLANTEL_BAR_FULL_2026=[
  S("Juan Espínola","ARQ",31,74,["extranjero"]), S("Marcelo Miño","ARQ",29,70,[]),
  S("Juan Insúa","ARQ",21,62,[]), S("Luca Fernández","ARQ",21,58,[]),
  S("Nicolás Capraro","DEF",28,72,[]), S("Fernando Tobio","DEF",36,74,["veterano"]),
  S("Rodrigo Insúa","DEF",28,70,[]), S("Yonatthan Rak","DEF",33,70,["extranjero"]),
  S("Gastón Campi","DEF",35,70,["veterano"]), S("Nicolás Demartini","DEF",26,72,[]),
  S("Kevin Jappert","DEF",22,70,[]), S("Rafael Barrios","DEF",33,68,[]),
  S("Damián Martínez","DEF",36,70,["veterano"]), S("Elías Pereyra","DEF",27,68,[]),
  S("Dardo Miloc","VOL",35,72,["veterano"]), S("Tomás Porra","VOL",22,68,[]),
  S("Iván Tapia","VOL",27,70,[]),
  S("Facundo Bruera","DEL",27,72,[]), S("Jhonatan Candia","DEL",31,70,["extranjero"]),
  S("Nicolás Blandi","DEL",36,70,["veterano"])
];

/* Independiente · es.wikipedia 8 sep 2026. Malcorra baja a Unión (rescisión). Morales ex Colo-Colo. */
const PLANTEL_IND_FULL_2026=[
  S("Rodrigo Rey","ARQ",35,80,["capitán","experiencia"]), S("Joaquín Blázquez","ARQ",25,70,[]),
  S("Santiago Mele","ARQ",29,74,["extranjero"]),
  S("Facundo Zabala","DEF",27,74,[]), S("Sebastián Valdez","DEF",30,72,[]),
  S("Santiago Arias","DEF",34,72,["extranjero","veterano"]), S("Leonardo Godoy","DEF",31,74,[]),
  S("Juan Fedorco","DEF",25,72,[]), S("Franco Calderón","DEF",28,72,[]),
  S("Iván Marcone","VOL",36,76,["veterano","contención"]), S("Luciano Cabral","VOL",31,76,["extranjero"]),
  S("Lautaro Millán","VOL",21,72,[]), S("David Martínez","VOL",22,70,[]),
  S("Maximiliano Meza","VOL",33,76,["veterano"]), S("Imanol Machuca","VOL",26,70,[]),
  S("Santiago Montiel","DEL",25,76,["desequilibrio"]), S("Matías Abaldo","DEL",22,74,["extranjero"]),
  S("Chimy Ávila","DEL",32,74,[]), S("Iván Morales","DEL",27,72,["extranjero"]),
  S("Rodrigo Márquez","DEL",24,68,[])
];

/* Unión · es.wikipedia 8 sep 2026. Malcorra alta desde Independiente. DT Madelón. */
const PLANTEL_UNI_FULL_2026=[
  S("Matías Mansilla","ARQ",30,74,[]), S("Federico Gomes Gerth","ARQ",22,66,[]), S("Lucas Meuli","ARQ",25,64,[]),
  S("Bruno Pittón","DEF",33,72,["veterano"]), S("Juan Pintado","DEF",29,72,["extranjero"]),
  S("Matías Rocha","DEF",25,70,[]), S("Lautaro Vargas","DEF",21,66,[]),
  S("Lucas Menossi","VOL",34,74,["veterano"]), S("Augusto Solari","VOL",34,72,["veterano"]),
  S("Mauro Luna Diale","VOL",27,72,[]), S("Joaquín Mosqueira","VOL",21,68,[]),
  S("Ignacio Malcorra","VOL",39,74,["veterano"]), S("Brahian Cuello","VOL",28,68,[]),
  S("Julián Palacios","VOL",27,68,[]),
  S("Franco Fragapane","DEL",33,74,[]), S("Marcelo Estigarribia","DEL",31,74,[]),
  S("Cristian Tarragona","DEL",35,72,["veterano"]), S("Eric Ramírez","DEL",29,70,[]),
  S("Valentín Cerrudo","DEL",20,64,["préstamo"])
];

/* Universidad Católica · en.wikipedia temporada 2026, act. 14 ago · DT Daniel Garnero. */
const PLANTEL_UC_FULL_2026=[
  S("Vicente Bernedo","ARQ",25,74,["proyección"]), S("Darío Melo","ARQ",33,68,["recambio"]),
  S("Martín Contreras","ARQ",21,60,["canterano"]), S("Francisco Valdés","ARQ",22,58,[]),
  S("Daniel González","DEF",24,78,["salida limpia"]), S("Eugenio Mena","DEF",38,72,["veterano","lateral"]),
  S("Branco Ampuero","DEF",33,73,["marca"]), S("Tomás Asta-Buruaga","DEF",29,72,[]),
  S("Cristián Cuevas","DEF",31,72,["lateral"]), S("Ignacio Pérez","DEF",20,66,["canterano"]),
  S("Sebastián Arancibia","DEF",20,68,["canterano"]), S("Juan Ignacio Díaz","DEF",28,70,["extranjero"]),
  S("Bernardo Cerezo","DEF",31,70,[]), S("Agustín García Basso","DEF",34,72,["extranjero"]),
  S("Gary Medel","VOL",39,75,["ídolo","carácter"]), S("Agustín Farías","VOL",38,74,["veterano","extranjero"]),
  S("Alfred Canales","VOL",26,74,["contención"]), S("Fernando Zuqui","VOL",34,73,["extranjero"]),
  S("Matías Palavecino","VOL",28,76,["desequilibrio"]), S("Jimmy Martínez","VOL",29,72,[]),
  S("Jhojan Valencia","VOL",30,72,["extranjero"]), S("Justo Giani","VOL",27,74,["extranjero"]),
  S("Fernando Zampedri","DEL",38,80,["capitán","goleador"]), S("Clemente Montes","DEL",25,77,["velocidad","canterano"]),
  S("Diego Valencia","DEL",26,72,[]), S("Juan Rossel","DEL",21,70,["proyección"])
];

/* Limache · es.wikipedia plantel 2026 · DT Víctor Rivero.
   Sosa es 37 (no 21). Leonardo Valencia no figura: se saca. */
const PLANTEL_LIM_FULL_2026=[
  S("Matías Bórquez","ARQ",28,70,[]), S("Claudio González","ARQ",36,72,["experiencia"]),
  S("Martin Smith","ARQ",17,54,["joven"]),
  S("Alfonso Parot","DEF",36,74,["capitán","veterano"]), S("Augusto Aguirre","DEF",27,72,["extranjero"]),
  S("Dylan Escobar","DEF",25,70,[]), S("Javier Rojas","DEF",21,68,["joven"]),
  S("Marcelo Flores","DEF",24,68,[]), S("Axel Alfonzo","DEF",22,66,[]),
  S("Carlos Morales","DEF",26,68,[]), S("Yerko González","DEF",25,68,[]),
  S("César Fuentes","VOL",33,71,["orden"]), S("Hugo Martínez","VOL",26,68,["extranjero"]),
  S("Danilo Catalán","VOL",28,68,[]), S("Misael Llantén","VOL",27,70,[]),
  S("Tiago Galletto","VOL",24,68,["extranjero"]), S("Flavio Moya","VOL",20,62,["joven"]),
  S("Gonzalo Sosa","DEL",37,74,["goleador","veterano"]), S("Jean Meneses","DEL",33,76,["desequilibrio"]),
  S("Daniel Castro","DEL",32,75,["goleador"]), S("Marcos Arturia","DEL",28,72,[]),
  S("Vicente Álvarez","DEL",19,60,["joven"])
];

/* Cobreloa 1981 · final Libertadores vs Flamengo.
   Wikipedia Historia del Club + EN wiki 1981 Copa Libertadores finals. Edades de 1981. */
const PLANTEL_CBL_1981=[
  S("Óscar Wirth","ARQ",25,82,["seguro bajo los tres palos"]),
  S("Eduardo Fournier","ARQ",22,68,[]),
  S("Mario Soto","DEF",31,86,["capitán","ídolo","marca implacable"]),
  S("Hugo Tabilo","DEF",25,80,["lateral ofensivo"]),
  S("Juan Páez","DEF",31,80,["marca"]),
  S("Enzo Escobar","DEF",30,78,["lateral"]),
  S("Raúl Gómez","DEF",29,76,[]),
  S("Eduardo Gómez","DEF",24,72,[]),
  S("Víctor Merello","VOL",28,86,["cerebro","ídolo","gol de media distancia"]),
  S("Eduardo Jiménez","VOL",26,80,["polivalente"]),
  S("Armando Alarcón","VOL",26,78,["contención"]),
  S("Héctor Puebla","VOL",25,80,["desequilibrio"]),
  S("Óscar Muñoz","VOL",30,76,[]),
  S("Rubén Gómez","VOL",26,74,[]),
  S("Jorge Luis Siviero","DEL",29,86,["goleador","extranjero"]),
  S("Washington Olivera","DEL",27,84,["extranjero","definición"]),
  S("Luis Ahumada","DEL",24,76,[]),
  S("Carlos Rojas","DEL",23,72,[])
];

/* Identidad AFA (fundaciones Wikipedia). No pisa est/aforo. */
const CLUB_META_ARG={
  RIV:{esc:"⚪", ciudad:"Buenos Aires", colores:["#ffffff","#e31c23"], fund:1901},
  BOC:{esc:"🔵", ciudad:"Buenos Aires", colores:["#0033a0","#f4c400"], fund:1905},
  RAC:{esc:"🔵", ciudad:"Avellaneda",   colores:["#7ec8e3","#ffffff"], fund:1903},
  IND:{esc:"🔴", ciudad:"Avellaneda",   colores:["#e31837","#ffffff"], fund:1905},
  VEL:{esc:"⚪", ciudad:"Buenos Aires", colores:["#ffffff","#000000"], fund:1910},
  SLO:{esc:"🔵", ciudad:"Buenos Aires", colores:["#003da5","#e31837"], fund:1908},
  ELP:{esc:"🔴", ciudad:"La Plata",     colores:["#e31837","#ffffff"], fund:1905},
  ROS:{esc:"🔵", ciudad:"Rosario",      colores:["#003da5","#ffd100"], fund:1889},
  NEW:{esc:"🔴", ciudad:"Rosario",      colores:["#000000","#e31837"], fund:1903},
  HUR:{esc:"🔴", ciudad:"Buenos Aires", colores:["#ffffff","#e31837"], fund:1908},
  TAL:{esc:"🔵", ciudad:"Córdoba",      colores:["#003da5","#ffffff"], fund:1913},
  LAN:{esc:"🟠", ciudad:"Lanús",        colores:["#6b2d3c","#ffffff"], fund:1915},
  ARG:{esc:"🔴", ciudad:"Buenos Aires", colores:["#e31837","#ffffff"], fund:1904},
  BEL:{esc:"🔵", ciudad:"Córdoba",      colores:["#003da5","#e31837"], fund:1905},
  GLP:{esc:"⚪", ciudad:"La Plata",     colores:["#ffffff","#003da5"], fund:1887},
  TUC:{esc:"🔵", ciudad:"Tucumán",      colores:["#7ec8e3","#ffffff"], fund:1902},
  BAN:{esc:"🟢", ciudad:"Banfield",     colores:["#007a33","#ffffff"], fund:1896},
  PLA:{esc:"🟤", ciudad:"Florida Este", colores:["#5c4033","#ffffff"], fund:1905},
  CCO:{esc:"⚫", ciudad:"Santiago del Estero", colores:["#000000","#ffffff"], fund:1919},
  TIG:{esc:"🔵", ciudad:"Victoria",     colores:["#003da5","#e31837"], fund:1902},
  DYJ:{esc:"🟡", ciudad:"Florencio Varela", colores:["#ffd100","#007a33"], fund:1935},
  INS:{esc:"🔴", ciudad:"Córdoba",      colores:["#e31837","#ffffff"], fund:1918},
  UNI:{esc:"🔴", ciudad:"Santa Fe",     colores:["#e31837","#ffffff"], fund:1907},
  IRV:{esc:"🔵", ciudad:"Mendoza",      colores:["#003da5","#ffffff"], fund:1913},
  SAR:{esc:"🟢", ciudad:"Junín",        colores:["#007a33","#ffffff"], fund:1911},
  ALD:{esc:"🟢", ciudad:"Mar del Plata",colores:["#007a33","#ffd100"], fund:1913},
  GME:{esc:"⚪", ciudad:"Mendoza",      colores:["#ffffff","#003da5"], fund:1908},
  RIE:{esc:"⚫", ciudad:"Buenos Aires", colores:["#000000","#ffffff"], fund:1931},
  ERC:{esc:"🔴", ciudad:"Río Cuarto",   colores:["#e31837","#000000"], fund:1912},
  BAR:{esc:"🔴", ciudad:"Buenos Aires", colores:["#e31837","#ffffff"], fund:1904}
};

(function reg92(){
  if(typeof PLANTELES_REALES!=="object") return;
  var map={
    GLP:PLANTEL_GLP_FULL_2026, CCO:PLANTEL_CCO_FULL_2026, TUC:PLANTEL_TUC_FULL_2026,
    BAR:PLANTEL_BAR_FULL_2026, IND:PLANTEL_IND_FULL_2026, UNI:PLANTEL_UNI_FULL_2026,
    UC:PLANTEL_UC_FULL_2026, LIM:PLANTEL_LIM_FULL_2026
  };
  Object.keys(map).forEach(function(id){
    if(!PLANTELES_REALES[id]) PLANTELES_REALES[id]={};
    PLANTELES_REALES[id][2026]=map[id];
  });
  if(!PLANTELES_REALES.CBL) PLANTELES_REALES.CBL={};
  PLANTELES_REALES.CBL[1981]=PLANTEL_CBL_1981;

  if(typeof CLUB_INFO_2026==="object"){
    var dts={GLP:"Ariel Pereyra", TUC:"Julio César Falcioni", BAR:"Rubén Insúa",
             UC:"Daniel Garnero", LIM:"Víctor Rivero"};
    Object.keys(dts).forEach(function(id){
      if(CLUB_INFO_2026[id]) CLUB_INFO_2026[id].dt=dts[id];
    });
  }
  if(typeof EPOCAS_CLUB==="object" && EPOCAS_CLUB.CBL){
    EPOCAS_CLUB.CBL.forEach(function(ep){
      if(ep.anio===1981){
        ep.squad="PLANTEL_CBL_1981";
        ep.desc="Finalista de la Libertadores 1981 vs Flamengo. Wirth, Soto, Merello, Siviero. DT Vicente Cantatore.";
      }
    });
  }
  if(typeof CLUB_META==="object"){
    Object.keys(CLUB_META_ARG).forEach(function(id){
      if(!CLUB_META[id]) CLUB_META[id]=CLUB_META_ARG[id];
      else{
        var m=CLUB_META_ARG[id];
        if(!CLUB_META[id].fund && m.fund) CLUB_META[id].fund=m.fund;
        if(!CLUB_META[id].colores && m.colores) CLUB_META[id].colores=m.colores;
      }
    });
  }
  function pinta(L){
    if(!L) return;
    L.forEach(function(c){
      var m=CLUB_META_ARG[c.id]; if(!m) return;
      if(m.colores) c.colores=m.colores;
      if(m.fund && !c.fund) c.fund=m.fund;
    });
  }
  pinta(typeof LIGA_ARG_2026!=="undefined"?LIGA_ARG_2026:null);
  if(typeof CLUB_INFO_2026==="object"){
    Object.keys(CLUB_META_ARG).forEach(function(id){
      var m=CLUB_META_ARG[id];
      if(!CLUB_INFO_2026[id]) return;
      if(m.fund) CLUB_INFO_2026[id].fund=m.fund;
      if(m.colores) CLUB_INFO_2026[id].colores=m.colores;
    });
  }
  if(typeof AFORO_ARG_87==="object") AFORO_ARG_87.GLP=30973;
  if(typeof ESTADIOS_DATA==="object"){
    if(!ESTADIOS_DATA.GLP) ESTADIOS_DATA.GLP={};
    ESTADIOS_DATA.GLP.aforo=30973;
    ESTADIOS_DATA.GLP.nombre=ESTADIOS_DATA.GLP.nombre||"Juan Carmelo Zerillo";
  }
  if(typeof LIGA_ARG_2026!=="undefined"){
    LIGA_ARG_2026.forEach(function(c){ if(c.id==="GLP") c.aforo=30973; });
  }
})();
