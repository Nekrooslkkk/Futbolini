"use strict";
/* ============================================================
   FUTBOLINI 7.91 · AFA 2026 resto (cierra los 30)
   Wikipedia (y web oficial Barracas). Stats ESTIMADAS.
   Cargar DESPUÉS de data-planteles-90.js.
   ============================================================ */

function _pj91(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var R=_pj91;

/* Tigre · es.wikipedia 14 ago 2026 · DT Diego Dabove. Soto ex UC. Pity Martínez. */
const PLANTEL_TIG_2026=[
  R("Felipe Zenobio","ARQ",26,72,[]), R("Lautaro Morales","ARQ",26,70,[]),
  R("Joaquín Laso","DEF",36,74,["veterano"]), R("Guillermo Soto","DEF",32,72,["extranjero"]),
  R("Nahuel Banegas","DEF",29,70,[]), R("Alan Barrionuevo","DEF",29,70,[]),
  R("Federico Álvarez","DEF",32,70,[]),
  R("Gonzalo Martínez","VOL",33,76,["figura"]), R("Jabes Saralegui","VOL",23,74,[]),
  R("Martín Garay","VOL",27,72,[]), R("Tiago Serrago","VOL",22,70,[]),
  R("Ignacio Russo","DEL",25,74,[]), R("Mauro Méndez","DEL",27,72,["extranjero"]),
  R("Ian Subiabre","DEL",19,70,["préstamo","joven"]), R("Alfio Oviedo","DEL",30,70,["extranjero"])
];

/* Banfield · es.wikipedia Plantel 2026 · DT Pedro Troglio.
   Nehuén Paz queda en Huracán (Wiki 3 ago). Pombo titular de Aldosivi el 5 sep. */
const PLANTEL_BAN_2026=[
  R("Diego Rodríguez","ARQ",37,74,["veterano"]), R("Gino Santilli","ARQ",25,70,[]),
  R("Joaquín Molina","ARQ",22,62,[]),
  R("Nicolás Meriano","DEF",25,72,[]), R("Renzo Malanca","DEF",23,70,["extranjero"]),
  R("Lautaro Cano","DEF",24,70,[]), R("Ignacio Abraham","DEF",28,68,[]),
  R("Favio Álvarez","VOL",33,72,["veterano"]), R("Ignacio Pais","VOL",26,70,[]),
  R("Lautaro Ríos","VOL",25,68,[]),
  R("Adrián Balboa","DEL",32,74,["extranjero"]), R("Matías Hernández","DEL",21,70,[]),
  R("Federico Anselmo","DEL",32,70,[]), R("David Zalazar","DEL",24,68,[]),
  R("Alexander Machado","DEL",24,68,["extranjero"])
];

/* Platense · en.wikipedia 10 sep 2026. Capitán Vázquez. Nasif préstamo River. */
const PLANTEL_PLA_2026=[
  R("Brian Bustos","ARQ",30,72,[]), R("Juan Pablo Cozzani","ARQ",27,70,[]),
  R("Ignacio Vázquez","DEF",29,74,["capitán"]), R("Víctor Cuesta","DEF",37,74,["veterano"]),
  R("Juan Ignacio Saborido","DEF",28,72,[]), R("Agustín Lagos","DEF",24,70,["préstamo"]),
  R("Santiago Quirós","DEF",23,68,["préstamo"]),
  R("Franco Zapiola","VOL",25,72,[]), R("Iván Gómez","VOL",29,70,[]),
  R("Guido Mainero","VOL",31,72,[]),
  R("Nicolás López","DEL",32,74,["extranjero"]), R("Tomás Nasif","DEL",22,72,["préstamo"]),
  R("Gastón Togni","DEL",28,72,["préstamo"]), R("Augusto Lotti","DEL",30,70,[]),
  R("Juan Carlos Gauto","DEL",22,70,["préstamo"])
];

/* Central Córdoba · en.wikipedia 26 feb 2026 (nombres que siguen en MD sep). DT Sebastián Domínguez. */
const PLANTEL_CCO_2026=[
  R("Alan Aguerre","ARQ",36,74,["capitán","veterano"]), R("Máximo Alvarez","ARQ",21,62,[]),
  R("Javier Vallejos","ARQ",23,64,[]),
  R("Alejandro Maciel","DEF",29,72,[]), R("Facundo Mansilla","DEF",27,70,[]),
  R("Santiago Moyano","DEF",29,70,[]), R("José Gómez","DEF",26,68,[]),
  R("Fernando Juárez","VOL",28,70,["préstamo"]), R("Matías Vera","VOL",30,70,[]),
  R("Lucas González","VOL",26,68,["préstamo"]),
  R("Lucas Varaldo","DEL",24,72,[]), R("Michael Santos","DEL",33,72,["extranjero","préstamo"]),
  R("Ezequiel Naya","DEL",25,70,["préstamo"]), R("Diego Barrera","DEL",23,66,["préstamo"])
];

/* Independiente Rivadavia · es.wikipedia 9 ago 2026 · DT Alfredo Berti. Riep ex Audax. */
const PLANTEL_IRV_2026=[
  R("Ramiro Macagno","ARQ",29,74,[]), R("Emmanuel Gómez Riga","ARQ",24,66,[]),
  R("Nicolás Bolcato","ARQ",22,62,[]),
  R("Sheyko Studer","DEF",23,72,[]), R("Leonard Costa","DEF",28,70,["extranjero"]),
  R("Juan Elordi","DEF",32,70,[]), R("Iván Villalba","DEF",31,70,["extranjero"]),
  R("Alex Vigo","DEF",27,70,[]),
  R("Alessandro Riep","VOL",23,72,["extranjero"]), R("Luis Sequeira","VOL",23,70,[]),
  R("Leonel Bucca","VOL",27,70,[]), R("José Florentín","VOL",30,70,["extranjero"]),
  R("Álex Arce","DEL",31,76,["extranjero","goleador"]), R("Maximiliano Salas","DEL",28,74,[]),
  R("Victorio Ramis","DEL",32,70,[]), R("Luis Díaz","DEL",22,68,["extranjero"])
];

/* Sarmiento · es.wikipedia 12 ago 2026 · DT Facundo Sava. Insaurralde. */
const PLANTEL_SAR_2026=[
  R("Iván Arboleda","ARQ",30,72,["extranjero"]), R("Thyago Ayala","ARQ",24,62,[]),
  R("Juan Insaurralde","DEF",41,74,["capitán","veterano"]), R("Lucas Suárez","DEF",31,70,["préstamo"]),
  R("Nicolás Pasquini","DEF",35,70,["veterano"]), R("Ulises Giménez","DEF",20,66,["préstamo"]),
  R("Gabriel Díaz","DEF",26,68,[]),
  R("Mauricio Martínez","VOL",33,72,[]), R("Cristian Zabala","VOL",28,70,[]),
  R("Agustín Nadruz","VOL",30,70,["extranjero"]), R("Manuel García","VOL",27,68,[]),
  R("Pablo Magnín","DEL",36,74,["veterano","goleador"]), R("Diego Churín","DEL",36,72,["veterano"]),
  R("Jonathan Herrera","DEL",34,72,[]), R("Gastón González","DEL",25,70,["préstamo"])
];

/* Aldosivi · es.wikipedia 5 ago 2026. Vombergar marcó el 5 sep (TN). Pombo titular ese día. */
const PLANTEL_ALD_2026=[
  R("Lucas Acosta","ARQ",31,74,[]), R("Ignacio Chicco","ARQ",30,70,[]), R("Sebastián Moyano","ARQ",36,70,["veterano"]),
  R("Leonardo Sigali","DEF",39,74,["veterano"]), R("Néstor Breitenbruch","DEF",30,70,[]),
  R("Joaquín Pombo","DEF",25,70,[]), R("Elías López","DEF",26,68,[]),
  R("Braian Cufré","DEF",29,70,[]),
  R("Lucas Castro","VOL",37,72,["veterano"]), R("Federico Gino","VOL",33,70,[]),
  R("Nicolás Linares","VOL",30,70,[]), R("Francisco Perruzzi","VOL",25,68,[]),
  R("Andrés Vombergar","DEL",31,74,["goleador","extranjero"]), R("Nicolás Gaitán","DEL",38,72,["veterano"]),
  R("Andrés Chávez","DEL",35,70,["veterano"]), R("Bautista Dadín","DEL",20,66,["préstamo"])
];

/* Riestra · es.wikipedia 24 ago 2026 · DT Guillermo Duró. */
const PLANTEL_RIE_2026=[
  R("Ignacio Arce","ARQ",34,74,["experiencia"]), R("Iván López","ARQ",30,68,[]),
  R("Marino Arzamendia","ARQ",28,66,["extranjero"]),
  R("Carlos Quintana","DEF",38,74,["veterano"]), R("Eric Tovo","DEF",34,70,[]),
  R("Nicolás Sansotre","DEF",33,70,[]), R("Jonatan Goitía","DEF",32,70,[]),
  R("Pedro Ramírez","DEF",26,68,[]),
  R("Milton Céliz","VOL",34,72,["capitán"]), R("Braian Sánchez","VOL",33,70,[]),
  R("Pablo Monje","VOL",29,68,[]), R("Nicolás Watson","VOL",28,68,[]),
  R("Nicolás Benegas","DEL",30,72,[]), R("Antony Alonso","DEL",28,70,[]),
  R("Alexander Díaz","DEL",26,70,[])
];

/* Barracas · web oficial plantel 2026 (barracascentral.com). */
const PLANTEL_BAR_2026=[
  R("Juan Espínola","ARQ",31,74,["extranjero"]), R("Marcelo Miño","ARQ",29,70,[]),
  R("Juan Insúa","ARQ",21,62,[]),
  R("Nicolás Capraro","DEF",28,72,[]), R("Fernando Tobio","DEF",36,74,["veterano"]),
  R("Rodrigo Insúa","DEF",28,70,[]), R("Yonatthan Rak","DEF",33,70,["extranjero"]),
  R("Gastón Campi","DEF",35,70,["veterano"]),
  R("Dardo Miloc","VOL",35,72,["veterano"]), R("Tomás Porra","VOL",22,68,[]),
  R("Kevin Jappert","VOL",22,66,[]),
  R("Facundo Bruera","DEL",27,72,[]), R("Jhonatan Candia","DEL",31,70,["extranjero"]),
  R("Nicolás Blandi","DEL",36,70,["veterano"])
];

/* Atlético Tucumán · es.wikipedia 26 jul 2026. Canelo, Díaz, Julián Fernández ex Palestino.
   Mansilla está en Unión (3 sep): no se duplica. */
const PLANTEL_TUC_2026=[
  R("Luis Ingolotti","ARQ",26,74,[]), R("Patricio Albornoz","ARQ",26,68,[]), R("Tomás Durso","ARQ",27,70,[]),
  R("Gastón Suso","DEF",35,74,["veterano"]), R("Leonel Di Plácido","DEF",32,72,[]),
  R("Gianluca Ferrari","DEF",29,72,[]), R("Juan Infante","DEF",30,70,[]),
  R("Maximiliano Villa","DEF",29,70,["extranjero"]),
  R("Martín Benítez","VOL",32,74,[]), R("Julián Fernández","VOL",31,72,["extranjero"]),
  R("Kevin Ortiz","VOL",25,70,[]), R("Renzo Tesuri","VOL",30,72,[]),
  R("Leandro Díaz","DEL",34,76,["goleador"]), R("Alexis Canelo","DEL",34,74,["veterano"]),
  R("Ramiro Ruiz Rodríguez","DEL",26,70,[]), R("Franco Nicola","DEL",24,70,["extranjero"])
];

/* Gimnasia LP · Transfermarkt + La Nación sep 2026 (no hay plantilla Wiki usable). Janson alta 28 jul. */
const PLANTEL_GLP_2026=[
  R("Nelson Insfrán","ARQ",31,74,[]), R("Harlen Castillo","ARQ",33,70,["extranjero"]),
  R("Julián Kadijevic","ARQ",22,62,[]),
  R("Renzo Giampaoli","DEF",26,74,[]), R("Enzo Martínez","DEF",28,72,[]),
  R("Germán Conti","DEF",32,72,[]), R("Gonzalo Errecalde","DEF",26,68,[]),
  R("Lucas Janson","DEL",32,76,["figura"]), R("Ivo Mammini","DEL",23,70,[]),
  R("Alan Colazo","DEL",25,68,["préstamo"])
];

(function reg91(){
  if(typeof PLANTELES_REALES!=="object") return;
  var map={TIG:PLANTEL_TIG_2026,BAN:PLANTEL_BAN_2026,PLA:PLANTEL_PLA_2026,CCO:PLANTEL_CCO_2026,
           IRV:PLANTEL_IRV_2026,SAR:PLANTEL_SAR_2026,ALD:PLANTEL_ALD_2026,RIE:PLANTEL_RIE_2026,
           BAR:PLANTEL_BAR_2026,TUC:PLANTEL_TUC_2026,GLP:PLANTEL_GLP_2026};
  Object.keys(map).forEach(function(id){
    if(!PLANTELES_REALES[id]) PLANTELES_REALES[id]={};
    PLANTELES_REALES[id][2026]=map[id];
  });
  if(typeof CLUB_INFO_2026==="object"){
    var dts={TIG:"Diego Dabove",BAN:"Pedro Troglio",SAR:"Facundo Sava",IRV:"Alfredo Berti",
             RIE:"Guillermo Duró",CCO:"Sebastián Domínguez"};
    Object.keys(dts).forEach(function(id){
      if(CLUB_INFO_2026[id]) CLUB_INFO_2026[id].dt=dts[id];
    });
  }
})();
