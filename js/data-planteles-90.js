"use strict";
/* ============================================================
   FUTBOLINI 7.90 · más AFA 2026 (Wikipedia)
   Stats ESTIMADAS. Cargar DESPUÉS de data-planteles-89.js.
   ============================================================ */

function _pj90(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var Q=_pj90;

/* Talleres · en.wikipedia 6 sep 2026. Capitán Schott. Catalán chileno. */
const PLANTEL_TAL_2026=[
  Q("Ezequiel Unsain","ARQ",31,78,[]), Q("Santino Barbi","ARQ",21,62,[]),
  Q("Augusto Schott","DEF",26,74,["capitán"]), Q("Matías Catalán","DEF",34,74,["extranjero","veterano"]),
  Q("Alexandro Maidana","DEF",21,68,["extranjero"]), Q("Román Riquelme","DEF",24,70,[]),
  Q("Valentín Fascendini","DEF",23,70,[]), Q("Gabriel Báez","DEF",31,72,[]),
  Q("Matías Galarza","VOL",24,74,[]), Q("Federico Fattori","VOL",34,74,["veterano"]),
  Q("Franco Cristaldo","VOL",30,76,[]), Q("Juan Sforza","VOL",24,72,["préstamo"]),
  Q("Diego Valoyes","DEL",29,74,["extranjero","préstamo"]), Q("Agustín Álvarez","DEL",25,74,["extranjero","préstamo"]),
  Q("Rick","DEL",26,74,["extranjero"]), Q("Valentín Depietri","DEL",25,70,[])
];

/* Lanús · es.wikipedia 16 ago 2026 · DT Mauricio Pellegrino. Sepúlveda ex UCH. */
const PLANTEL_LAN_2026=[
  Q("Franco Petroli","ARQ",28,76,[]), Q("Nahuel Losada","ARQ",33,74,[]),
  Q("Carlos Izquierdoz","DEF",37,76,["veterano","ídolo"]), Q("Sasha Marcich","DEF",28,74,[]),
  Q("José Canale","DEF",30,72,["extranjero"]), Q("Gonzalo Pérez","DEF",25,72,["extranjero"]),
  Q("Nicolás Morgantini","DEF",32,70,[]), Q("Ronaldo Dejesús","DEF",25,70,["extranjero"]),
  Q("Marcelino Moreno","VOL",31,80,["figura","desequilibrio"]), Q("Felipe Peña Biafore","VOL",25,74,[]),
  Q("Matías Sepúlveda","VOL",27,74,["extranjero"]), Q("Ramiro Carrera","VOL",32,72,[]),
  Q("Agustín Cardozo","VOL",29,72,[]), Q("Eduardo Salvio","DEL",36,76,["veterano","ídolo"]),
  Q("Allan Wlk","DEL",23,70,["extranjero"]), Q("Dylan Aquino","DEL",21,70,["canterano"]),
  Q("Lucas Besozzi","DEL",23,70,[])
];

/* Argentinos · es.wikipedia + en.wikipedia 9 sep. Cortés préstamo Colo-Colo. */
const PLANTEL_ARG_2026=[
  Q("Brayan Cortés","ARQ",31,78,["extranjero","préstamo"]), Q("Agustín Mangiaut","ARQ",22,66,[]),
  Q("Gonzalo Siri","ARQ",23,64,[]),
  Q("Francisco Álvarez","DEF",26,74,[]), Q("Érik Godoy","DEF",33,72,["veterano"]),
  Q("Claudio Bravo","DEF",29,74,[]), Q("Sebastián Prieto","DEF",33,72,[]),
  Q("Luciano Sánchez","DEF",32,70,[]), Q("Franco Paredes","DEF",27,70,["préstamo"]),
  Q("Alan Lescano","VOL",24,76,[]), Q("Nicolás Oroz","VOL",32,74,[]),
  Q("Federico Mancuello","VOL",37,74,["veterano"]), Q("Gabriel Florentín","VOL",27,72,[]),
  Q("Gastón Verón","DEL",25,74,[]), Q("Tomás Molina","DEL",31,74,[]),
  Q("Leandro Fernández","DEL",35,72,["veterano"]), Q("Emiliano Viveros","DEL",24,70,[])
];

/* Belgrano · en.wikipedia + worldfootball Clausura. Capitán Zelarayán. */
const PLANTEL_BEL_2026=[
  Q("Manuel Vicentini","ARQ",36,74,["veterano"]), Q("Thiago Cardozo","ARQ",30,72,["extranjero","préstamo"]),
  Q("Matías Daniele","ARQ",22,64,[]),
  Q("Leonardo Morales","DEF",35,74,["veterano"]), Q("Lisandro López","DEF",37,74,["veterano"]),
  Q("Alexis Maldonado","DEF",29,72,[]), Q("Federico Ricca","DEF",31,72,["extranjero"]),
  Q("Adrián Spörle","DEF",31,70,[]),
  Q("Lucas Zelarayán","VOL",34,80,["capitán","figura","extranjero"]), Q("Franco Vázquez","VOL",37,76,["veterano"]),
  Q("Santiago Longo","VOL",28,74,["contención"]), Q("Francisco González Metilli","VOL",29,72,[]),
  Q("Nicolás Fernández","DEL",30,76,["goleador"]), Q("Lucas Passerini","DEL",32,74,[]),
  Q("Emiliano Rigoni","DEL",33,72,[]), Q("Jeremías Lucco","DEL",20,66,["canterano"])
];

/* Defensa · en.wikipedia 17 jul + TyC. DT Vaccari. César Pérez chileno. Amor está en San Lorenzo (más reciente). */
const PLANTEL_DYJ_2026=[
  Q("Lautaro Amadé","ARQ",26,72,[]), Q("Matías Borgogno","ARQ",28,70,[]), Q("Facundo Quintana","ARQ",24,64,[]),
  Q("Lucas Souto","DEF",28,72,[]), Q("David Martínez","DEF",28,72,["extranjero","préstamo"]),
  Q("Ayrton Portillo","DEF",26,70,[]), Q("Damián Fernández","DEF",25,70,[]),
  Q("Samuel Lucero","DEF",23,66,[]),
  Q("César Pérez","VOL",24,74,["extranjero"]), Q("Julián López","VOL",26,72,[]),
  Q("Aarón Molinas","VOL",26,72,[]), Q("Santiago Sosa","VOL",25,70,[]),
  Q("Leandro Fernández","DEL",31,74,[]), Q("Domingo Blanco","DEL",31,72,["préstamo"]),
  Q("Juan Gutiérrez","DEL",24,70,["extranjero"]), Q("Agustín Hausch","DEL",23,68,[])
];

/* Instituto · es.wikipedia 17 ago 2026. Guerra ex U. de Chile. */
const PLANTEL_INS_2026=[
  Q("Marcos Ledesma","ARQ",29,74,[]), Q("Emanuel Sittaro","ARQ",26,66,[]),
  Q("Fernando Alarcón","DEF",32,74,[]), Q("Jonathan Galván","DEF",34,72,["veterano"]),
  Q("Hernán de la Fuente","DEF",29,72,[]), Q("Diego Sosa","DEF",29,72,[]),
  Q("Leonel Mosevich","DEF",29,70,[]), Q("Giuliano Cerato","DEF",28,70,[]),
  Q("Alex Luna","VOL",22,76,["proyección"]), Q("Franco Moyano","VOL",28,72,[]),
  Q("Juan Ignacio Méndez","VOL",29,72,[]), Q("Gustavo Abregú","VOL",29,70,[]),
  Q("Nicolás Guerra","DEL",27,74,["extranjero"]), Q("Facundo Suárez","DEL",32,72,[]),
  Q("Matías Tissera","DEL",30,72,[]), Q("Jonás Acevedo","DEL",29,70,[]),
  Q("Jhon Córdoba","DEL",26,70,["extranjero"])
];

/* Unión · es.wikipedia 3 sep 2026 · DT Leonardo Madelón.
   Malcorra figura en Independiente (11 sep, más reciente): no se duplica. */
const PLANTEL_UNI_2026=[
  Q("Matías Mansilla","ARQ",30,74,[]), Q("Federico Gomes Gerth","ARQ",22,66,[]), Q("Lucas Meuli","ARQ",25,64,[]),
  Q("Bruno Pittón","DEF",33,72,["veterano"]), Q("Juan Pintado","DEF",29,72,["extranjero"]),
  Q("Matías Rocha","DEF",25,70,[]), Q("Lautaro Vargas","DEF",21,66,[]),
  Q("Lucas Menossi","VOL",34,74,["veterano"]), Q("Augusto Solari","VOL",34,72,["veterano"]),
  Q("Mauro Luna Diale","VOL",27,72,[]), Q("Joaquín Mosqueira","VOL",21,68,[]),
  Q("Franco Fragapane","DEL",33,74,[]), Q("Marcelo Estigarribia","DEL",31,74,[]),
  Q("Cristian Tarragona","DEL",35,72,["veterano"]), Q("Eric Ramírez","DEL",29,70,[])
];

/* Gimnasia Mendoza · es.wikipedia 10 ago 2026. Rigamonti ex Palestino. */
const PLANTEL_GME_2026=[
  Q("Santiago Roggero","ARQ",24,68,[]), Q("César Rigamonti","ARQ",39,72,["veterano","extranjero"]),
  Q("Lautaro Petruchi","ARQ",28,66,[]),
  Q("Ezequiel Muñoz","DEF",35,74,["veterano"]), Q("Diego Mondino","DEF",31,70,[]),
  Q("Imanol González","DEF",28,70,[]), Q("Germán Guiffrey","DEF",28,70,[]),
  Q("Matías Recalde","DEF",29,68,[]),
  Q("Ulises Sánchez","VOL",28,72,[]), Q("Fermín Antonini","VOL",29,70,[]),
  Q("Nahuel Barboza","VOL",26,68,[]), Q("Tomás Ortiz","VOL",26,68,[]),
  Q("Blas Armoa","DEL",26,72,["extranjero"]), Q("Brian Andrada","DEL",29,70,[]),
  Q("Ignacio Sabatini","DEL",27,68,[]), Q("Agustín Módica","DEL",23,68,[])
];

/* Estudiantes RC · Asociación Atlética Estudiantes, Wiki 1 ago 2026. Ábila. */
const PLANTEL_ERC_2026=[
  Q("Lucas Bruera","ARQ",28,70,[]), Q("Francisco Gualtieri","ARQ",23,62,[]), Q("Agustín Lastra","ARQ",25,64,[]),
  Q("Gonzalo Maffini","DEF",33,70,[]), Q("Sergio Ojeda","DEF",34,70,["veterano"]),
  Q("Facundo Cobos","DEF",33,68,[]), Q("Juan Antonini","DEF",27,68,[]),
  Q("Alejandro Cabrera","VOL",33,70,[]), Q("Gabriel Alanís","VOL",32,70,[]),
  Q("Siro Rosané","VOL",26,68,[]), Q("Nicolás Talpone","VOL",30,68,[]),
  Q("Ramón Ábila","DEL",36,74,["veterano","goleador"]), Q("Mateo Bajamich","DEL",27,70,[]),
  Q("Lucas González","DEL",29,68,[]), Q("Martín Garnerone","DEL",27,66,[])
];

(function reg90(){
  if(typeof PLANTELES_REALES!=="object") return;
  var map={TAL:PLANTEL_TAL_2026,LAN:PLANTEL_LAN_2026,ARG:PLANTEL_ARG_2026,BEL:PLANTEL_BEL_2026,
           DYJ:PLANTEL_DYJ_2026,INS:PLANTEL_INS_2026,UNI:PLANTEL_UNI_2026,GME:PLANTEL_GME_2026,
           ERC:PLANTEL_ERC_2026};
  Object.keys(map).forEach(function(id){
    if(!PLANTELES_REALES[id]) PLANTELES_REALES[id]={};
    PLANTELES_REALES[id][2026]=map[id];
  });
  if(typeof CLUB_INFO_2026==="object"){
    if(CLUB_INFO_2026.LAN) CLUB_INFO_2026.LAN.dt="Mauricio Pellegrino";
    if(CLUB_INFO_2026.UNI) CLUB_INFO_2026.UNI.dt="Leonardo Madelón";
  }
})();
