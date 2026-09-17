"use strict";
/* ============================================================
   FUTBOLINI · data-planteles.js
   Planteles 2026 documentados (ex 88–95). UN archivo para pegar.
   Molde: PLANTEL_<ID>_2026 = [ ["Nombre","POS",edad,niv,proy,sueldo,valor,["rasgos"]], ... ]
   o _pj("Nombre","POS",edad,niv,["rasgos"]).
   Registrar en el IIFE (PLANTELES_REALES[id][2026]=...).
   Nombres reales. Stats ESTIMADAS. No inventar.
   Cargar DESPUÉS de data-huecos-87.js.
   ============================================================ */

/* ──────── data-planteles-88.js ──────── */
/* ============================================================
   FUTBOLINI 7.88 · más planteles 2026 documentados
   Wikipedia (club / temporada), ago–sep 2026.
   Stats (nivel/sueldo/valor) ESTIMADAS. Nombres reales.
   Cargar DESPUÉS de data-huecos-87.js (pisa los goleadores sueltos
   de TRA/CLC con el plantel completo).
   ============================================================ */

function _pj(n,pos,edad,niv,ras){
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}

/* Osorno · es.wikipedia Plantilla 2026 · DT Jeremías Viale */
const PLANTEL_OSO_2026=[
  _pj("Daniel Retamal","ARQ",31,62,["experiencia"]),
  _pj("Francisco Cifuentes","ARQ",24,54,[]),
  _pj("Diego Lara","ARQ",28,56,[]),
  _pj("Daniel Vicencio","DEF",34,60,["veterano"]),
  _pj("Eduardo Navarrete","DEF",24,58,[]),
  _pj("Marcel Cortéz","DEF",30,58,[]),
  _pj("Gonzalo Lauler","DEF",37,58,["veterano"]),
  _pj("Brandon Cáceres","DEF",24,56,[]),
  _pj("Luciano Meneses","DEF",30,58,[]),
  _pj("Vicente Yáñez","DEF",22,54,["préstamo"]),
  _pj("Ignacio Pacheco","VOL",22,56,[]),
  _pj("Juan Gutiérrez","VOL",36,60,["veterano"]),
  _pj("Diego Pezoa","VOL",32,60,["experiencia"]),
  _pj("Sebastián Namoncura","VOL",21,54,["canterano"]),
  _pj("Diego Vergara","VOL",24,56,[]),
  _pj("Carlos Soto","VOL",24,56,[]),
  _pj("Abel Moreno","VOL",24,56,[]),
  _pj("Juan Arias","DEL",24,58,[]),
  _pj("Felipe Escobar","DEL",33,58,["veterano"]),
  _pj("Diego Bielkiewicz","DEL",35,64,["capitán","extranjero","goleador"]),
  _pj("Esteban Antilef","DEL",23,56,[]),
  _pj("Gustavo Castro","DEL",25,58,[]),
  _pj("Job Bogmis","DEL",26,56,["extranjero"])
];

/* Lota · es.wikipedia Plantilla 2026 · DT Renato Ramos */
const PLANTEL_LSC_2026=[
  _pj("Gabriel Fuentes","ARQ",23,58,[]),
  _pj("Patricio Silva","ARQ",22,52,[]),
  _pj("José Alburquenque","ARQ",19,50,["préstamo"]),
  _pj("Juan Pablo Reyes","DEF",21,54,[]),
  _pj("Diego Torres","DEF",34,60,["veterano"]),
  _pj("Agustín Ambiado","DEF",25,56,[]),
  _pj("Mijael Muñoz","DEF",20,52,[]),
  _pj("Juan José Contreras","DEF",33,58,["veterano"]),
  _pj("Dilan Alvarado","DEF",23,54,[]),
  _pj("Cristóbal Vergara","DEF",32,58,[]),
  _pj("Claudio Jopia","DEF",34,56,["veterano"]),
  _pj("Gianfranco Hernández","DEF",23,54,[]),
  _pj("Leonardo Povea","VOL",32,64,["capitán","contención"]),
  _pj("Diego Bravo","VOL",23,56,[]),
  _pj("Gerardo Navarrete","VOL",32,60,["experiencia"]),
  _pj("Byron Hermosilla","VOL",23,54,[]),
  _pj("Nicolás Lincopán","VOL",20,52,["préstamo"]),
  _pj("Paolo Fuentes","VOL",25,56,[]),
  _pj("Sebastián Torres Sepúlveda","VOL",24,54,[]),
  _pj("Felipe Ortiz","VOL",24,56,[]),
  _pj("Jordy Contreras","VOL",25,54,[]),
  _pj("Cristóbal Díaz","DEL",24,56,[]),
  _pj("Lucas Quiroga","DEL",26,60,["extranjero","goleador"]),
  _pj("Fabián Neira","DEL",25,58,[]),
  _pj("Vicente Oñate","DEL",19,52,["préstamo","joven"]),
  _pj("Cristofer Salas","DEL",26,58,[]),
  _pj("Luca Pontigo","DEL",31,58,["veterano"])
];

/* Trasandino · en.wikipedia squad 16 ago 2026. Goleador Quiñones (Wiki Segunda). DT Fernando Gutiérrez (tabla 2026). */
const PLANTEL_TRA_FULL_2026=[
  _pj("Sergio Cabello","ARQ",22,56,[]),
  _pj("Matías Reyes","ARQ",22,54,["préstamo"]),
  _pj("Ricardo Patiño","ARQ",21,52,["préstamo"]),
  _pj("Matías Torres","DEF",25,60,["capitán"]),
  _pj("Matías Silva","DEF",26,56,[]),
  _pj("Axel Cortés","DEF",22,54,[]),
  _pj("Joshoa Sotomayor","DEF",25,56,[]),
  _pj("Alan Riquelme","DEF",22,54,[]),
  _pj("Juan José Llul","DEF",26,56,[]),
  _pj("Santiago Bravo","DEF",22,54,[]),
  _pj("Jens Buss","DEF",26,56,[]),
  _pj("Marlon Carrasco","VOL",23,56,[]),
  _pj("Martín González","VOL",21,56,["préstamo"]),
  _pj("Kevin Flores","VOL",31,60,["experiencia"]),
  _pj("Nicolás Letelier","VOL",21,54,["préstamo"]),
  _pj("Vicente González","VOL",20,52,["préstamo"]),
  _pj("Dylan Fernández","VOL",22,54,["extranjero"]),
  _pj("Javier Quiñones","DEL",23,64,["goleador"]),
  _pj("Emiliano Cuvertino","DEL",21,56,["extranjero"]),
  _pj("Benjamín Araneda","DEL",21,54,["préstamo"]),
  _pj("Tomás San Martín","DEL",27,56,[]),
  _pj("Fabián Abarca","DEL",22,56,["préstamo"]),
  _pj("Lucas Poza","DEL",21,52,[])
];

/* Colchagua · es.wikipedia Plantilla 2026 · DT Raúl González */
const PLANTEL_CLC_FULL_2026=[
  _pj("Rodrigo Cancino","ARQ",26,56,[]),
  _pj("Fabricio Vera","ARQ",20,50,[]),
  _pj("Mateo Martín","DEF",21,52,[]),
  _pj("Manuel Olea","DEF",32,58,["veterano"]),
  _pj("Carlos Rodríguez","DEF",25,56,[]),
  _pj("Diego Salas","DEF",28,56,[]),
  _pj("Ricardo Segovia","DEF",25,54,[]),
  _pj("Santiago Medina","DEF",20,50,["canterano"]),
  _pj("Renato Díaz","VOL",22,54,[]),
  _pj("Rodrigo Díaz","VOL",24,54,[]),
  _pj("Juan Tobar","VOL",24,54,[]),
  _pj("Osvaldo Carrasco","VOL",26,56,[]),
  _pj("Cristóbal Marín","VOL",32,58,["experiencia"]),
  _pj("Carlos Opazo","VOL",37,56,["veterano"]),
  _pj("Matías Pérez","DEL",29,62,["goleador"]),
  _pj("Alexis Ponce","DEL",24,54,[]),
  _pj("Jhon Alegría","DEL",29,56,["extranjero"]),
  _pj("Cristián Valenzuela","DEL",27,56,[]),
  _pj("Matías Belmar","DEL",24,56,[]),
  _pj("Emilio Moreno","DEL",22,52,[])
];

/* Racing · es.wikipedia Plantel 2026, act. 3 sep 2026 */
const PLANTEL_RAC_2026=[
  _pj("Facundo Cambeses","ARQ",29,78,["experiencia"]),
  _pj("Francisco Gómez","ARQ",22,64,["canterano"]),
  _pj("Matías Tagliamonte","ARQ",28,70,[]),
  _pj("Thiago De Bellis","ARQ",21,60,["canterano"]),
  _pj("Marco Di Cesare","DEF",24,76,[]),
  _pj("Nazareno Colombo","DEF",27,74,[]),
  _pj("Matías Pérez","DEF",27,74,[]),
  _pj("Marcos Rojo","DEF",36,74,["veterano","selección"]),
  _pj("Ezequiel Cannavo","DEF",24,72,[]),
  _pj("Alfonso Espino","DEF",34,72,["extranjero","veterano"]),
  _pj("Juan Barinaga","DEF",25,72,[]),
  _pj("Ignacio Rodríguez","DEF",25,70,[]),
  _pj("Gonzalo Escudero","DEF",19,62,["canterano"]),
  _pj("Mateo Martínez","DEF",18,58,["canterano"]),
  _pj("Matías Kranevitter","VOL",33,76,["contención","veterano"]),
  _pj("Matías Zaracho","VOL",28,80,["figura"]),
  _pj("Matko Miljevic","VOL",25,76,["desequilibrio"]),
  _pj("Ulises Ortegoza","VOL",29,74,[]),
  _pj("Gastón Lodico","VOL",28,74,[]),
  _pj("Adrián Fernández","VOL",25,72,[]),
  _pj("Alan Forneris","VOL",21,66,["joven"]),
  _pj("Leonel Pérez","VOL",22,66,[]),
  _pj("Adrián Martínez","DEL",34,78,["goleador","veterano"]),
  _pj("Tomás Conechny","DEL",28,76,[]),
  _pj("Duván Vergara","DEL",30,74,["extranjero"]),
  _pj("Valentín Carboni","DEL",21,74,["proyección"]),
  _pj("Lautaro Díaz","DEL",28,72,[]),
  _pj("Elías Torres","DEL",25,70,[])
];

/* Independiente · en.wikipedia current squad 11 sep 2026 · DT Jadson Viera */
const PLANTEL_IND_2026=[
  _pj("Rodrigo Rey","ARQ",35,80,["capitán","experiencia"]),
  _pj("Joaquín Blázquez","ARQ",25,70,["préstamo"]),
  _pj("Santiago Mele","ARQ",28,74,["extranjero","préstamo"]),
  _pj("Facundo Zabala","DEF",27,74,[]),
  _pj("Sebastián Valdez","DEF",30,72,[]),
  _pj("Santiago Arias","DEF",34,72,["extranjero","veterano"]),
  _pj("Leonardo Godoy","DEF",31,74,[]),
  _pj("Juan Fedorco","DEF",25,72,[]),
  _pj("Franco Calderón","DEF",26,72,["préstamo"]),
  _pj("Iván Marcone","VOL",36,76,["veterano","contención"]),
  _pj("Luciano Cabral","VOL",31,76,["extranjero"]),
  _pj("Lautaro Millán","VOL",24,72,["extranjero"]),
  _pj("David Martínez","VOL",26,70,[]),
  _pj("Ignacio Malcorra","VOL",34,74,["veterano"]),
  _pj("Santiago Montiel","DEL",25,76,["desequilibrio"]),
  _pj("Matías Abaldo","DEL",22,74,["extranjero"]),
  _pj("Maximiliano Meza","DEL",33,76,["veterano"]),
  _pj("Chimy Ávila","DEL",32,74,[]),
  _pj("Imanol Machuca","DEL",26,70,[]),
  _pj("Rodrigo Márquez","DEL",24,68,[])
];

/* Vélez · es.wikipedia Plantel 2026, act. 4 ago 2026 · DT Guillermo Barros Schelotto */
const PLANTEL_VEL_2026=[
  _pj("Tomás Marchiori","ARQ",31,78,[]),
  _pj("Álvaro Busso","ARQ",19,60,["canterano"]),
  _pj("Emanuel Mammana","DEF",30,76,[]),
  _pj("Elías Gómez","DEF",32,74,[]),
  _pj("Joaquín García","DEF",25,72,[]),
  _pj("Lisandro Magallán","DEF",32,74,["veterano"]),
  _pj("Jano Gordon","DEF",22,66,["canterano"]),
  _pj("Thiago Silvero","DEF",20,64,["canterano"]),
  _pj("Claudio Baeza","VOL",32,74,["extranjero","contención"]),
  _pj("Lucas Robertone","VOL",29,76,[]),
  _pj("Diego Valdés","VOL",32,76,["extranjero"]),
  _pj("Manuel Lanzini","VOL",33,78,["ídolo","desequilibrio"]),
  _pj("Rodrigo Aliendro","VOL",35,74,["veterano"]),
  _pj("Matías Pellegrini","DEL",26,74,[]),
  _pj("Florián Monzón","DEL",25,72,[])
];

/* San Lorenzo · es.wikipedia Plantel 2026, act. 26 ago 2026 · DT Rubén Darío Insúa */
const PLANTEL_SLO_2026=[
  _pj("Facundo Altamirano","ARQ",30,76,[]),
  _pj("José Devecchi","ARQ",31,72,[]),
  _pj("Mateo Clemente","ARQ",24,66,[]),
  _pj("Emiliano Amor","DEF",31,74,[]),
  _pj("Gastón Hernández","DEF",28,74,[]),
  _pj("Guzmán Corujo","DEF",30,72,["extranjero"]),
  _pj("Danilo Arboleda","DEF",31,70,["extranjero"]),
  _pj("Mathías De Ritis","DEF",23,68,["extranjero"]),
  _pj("Nahuel Arias","DEF",21,66,[]),
  _pj("Ezequiel Herrera","DEF",23,66,[]),
  _pj("Nicolás Tripichio","VOL",30,74,[]),
  _pj("Manuel Insaurralde","VOL",27,72,[]),
  _pj("Gonzalo Abrego","VOL",26,72,[]),
  _pj("Juan Pablo Álvarez","VOL",30,72,[]),
  _pj("Martín Río","VOL",25,70,[]),
  _pj("Ezequiel Cerutti","DEL",34,76,["ídolo","veterano"]),
  _pj("Alexis Cuello","DEL",26,74,[]),
  _pj("Facundo Farías","DEL",24,74,[]),
  _pj("Matías Reali","DEL",29,72,[]),
  _pj("Nahuel Barrios","DEL",28,72,[]),
  _pj("Gustavo del Prete","DEL",30,70,[]),
  _pj("Rodrigo Auzmendi","DEL",25,70,[])
];

(function reg88(){
  if(typeof PLANTELES_REALES!=="object") return;
  function reg(id, squad){
    if(!PLANTELES_REALES[id]) PLANTELES_REALES[id]={};
    PLANTELES_REALES[id][2026]=squad;
  }
  reg("OSO", PLANTEL_OSO_2026);
  reg("LSC", PLANTEL_LSC_2026);
  reg("TRA", PLANTEL_TRA_FULL_2026);
  reg("CLC", PLANTEL_CLC_FULL_2026);
  reg("RAC", PLANTEL_RAC_2026);
  reg("IND", PLANTEL_IND_2026);
  reg("VEL", PLANTEL_VEL_2026);
  reg("SLO", PLANTEL_SLO_2026);
  if(typeof CLUB_INFO_2026==="object"){
    if(CLUB_INFO_2026.IND) CLUB_INFO_2026.IND.dt="Jadson Viera";
    if(CLUB_INFO_2026.VEL) CLUB_INFO_2026.VEL.dt="Guillermo Barros Schelotto";
    if(CLUB_INFO_2026.SLO) CLUB_INFO_2026.SLO.dt="Rubén Darío Insúa";
  }
})();

/* ──────── data-planteles-89.js ──────── */
/* ============================================================
   FUTBOLINI 7.89 · Segunda 2026 completa + 4 AFA
   Wikipedia plantilla/squad ago–sep 2026. Stats ESTIMADAS.
   Cargar DESPUÉS de data-planteles-88.js (usa _pj).
   ============================================================ */

function _pj89(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var P=_pj89;

/* ——— SEGUNDA (faltaban 9) ——— */

const PLANTEL_COL_FULL_2026=[
  P("Tomás López","ARQ",24,54,[]), P("Juan José Echave","ARQ",25,56,[]), P("Julio Bórquez","ARQ",26,56,[]),
  P("Cristóbal Finch","DEF",24,56,[]), P("Martín Ochoa","DEF",22,54,[]), P("Alejandro Contreras","DEF",33,60,["veterano"]),
  P("César Evans","DEF",25,56,[]), P("Mario Larenas","DEF",33,58,["veterano"]), P("Levit Béjar","DEF",22,54,[]),
  P("Ignacio Mesina","DEF",25,56,[]),
  P("Juan David Bacca","VOL",21,54,[]), P("Leonardo Naranjo","VOL",22,56,[]), P("Alexis Hormazábal","VOL",22,56,[]),
  P("Franco Gutiérrez","VOL",25,56,[]), P("Jhon Bravo","VOL",25,54,[]),
  P("Gabriel Harding","DEL",25,62,["goleador"]), P("Cristian Alarcón","DEL",22,56,[]),
  P("Ignacio Contreras","DEL",26,56,[]), P("Matías Colossi","DEL",25,58,[])
];

const PLANTEL_OVA_FULL_2026=[
  P("Kevin Catalán","ARQ",26,56,[]), P("Guillermo Orellana","ARQ",36,58,["veterano"]), P("Claudio Abarca","ARQ",28,54,[]),
  P("César González","DEF",28,56,[]), P("Sebastián Contreras","DEF",26,56,[]), P("Erick Millalén","DEF",27,58,[]),
  P("Jaime Soto","DEF",32,58,["veterano"]), P("Odswart Canessa","DEF",24,54,[]), P("Diego Cerón","DEF",34,58,["veterano"]),
  P("Camilo Matamala","DEF",22,54,["préstamo"]),
  P("Luis Cabrera","VOL",32,62,["capitán","experiencia"]), P("Albano Becica","VOL",36,60,["extranjero","veterano"]),
  P("Mauro Maureira","VOL",26,56,["extranjero"]), P("Luckas Carreño","VOL",26,56,[]),
  P("Martín Meneses","DEL",26,58,[]), P("Nicolás Julio","DEL",23,56,["préstamo"]),
  P("Luis Maluenda","DEL",24,56,["préstamo"]), P("Renato Tarifeño","DEL",30,58,[]),
  P("Cristian Duma","DEL",30,60,["extranjero"]), P("Benjamín Castro","DEL",22,54,["préstamo"])
];

const PLANTEL_CNA_FULL_2026=[
  P("Christian Fuentes","ARQ",27,58,[]), P("Pedro Pizarro","ARQ",24,54,[]), P("Marcelo Salcedo","ARQ",22,52,[]),
  P("Marcos Velásquez","DEF",38,60,["veterano"]), P("Benjamín Fuentes","DEF",23,54,[]),
  P("Gonzalo Santelices","DEF",30,58,[]), P("Franco Cubillos","DEF",25,56,[]), P("Kevin Araya","DEF",26,56,[]),
  P("Cristian Vega","DEF",26,56,[]),
  P("Franco Ragusa","VOL",33,64,["capitán","experiencia"]), P("Valentín Demateis","VOL",25,56,["extranjero"]),
  P("Bruno Álvarez","VOL",24,56,[]), P("Bastián Bravo","VOL",22,54,[]), P("Alexis Ugarte","VOL",20,52,["préstamo"]),
  P("Axel Cerda","DEL",20,62,["préstamo","goleador","joven"]), P("Joaquín Plaza","DEL",22,56,["extranjero"]),
  P("Luis Vargas","DEL",26,56,[]), P("Giovanni Bustos","DEL",26,56,[]),
  P("Rodrigo Gattas","DEL",34,58,["veterano"]), P("Martín Cárcamo","DEL",22,54,["préstamo"])
];

const PLANTEL_BSA_FULL_2026=[
  P("Joshua Tapia","ARQ",23,54,[]), P("Leandro Requena","ARQ",39,62,["veterano","experiencia"]),
  P("Sebastián Aravena","ARQ",24,54,["préstamo"]),
  P("Mauro Tapia","DEF",22,54,[]), P("Hugo Rojo","DEF",25,56,[]), P("Joaquín Aros","DEF",30,58,[]),
  P("Víctor Araya","DEF",28,56,[]), P("Nicolás Barrios","DEF",24,54,[]), P("César Molina","DEF",29,56,[]),
  P("Fabián Carmona","VOL",32,60,["experiencia"]), P("Juan Pablo Miño","VOL",39,58,["veterano"]),
  P("Francisco Arenas","VOL",26,56,[]), P("Diego Ortiz","VOL",21,54,["préstamo"]),
  P("Ignacio Morales","VOL",22,54,["préstamo"]),
  P("Wladimir Cid","DEL",29,60,[]), P("Felipe Durán","DEL",29,58,[]),
  P("César Díaz","DEL",24,58,[]), P("Bastián Valdés","DEL",25,56,[]),
  P("Benjamín Osses","DEL",24,56,[]), P("Bastián Pinnola","DEL",22,54,[])
];

const PLANTEL_RSJ_FULL_2026=[
  P("Benjamín Reyes","ARQ",28,54,[]), P("Elías Hartard","ARQ",39,58,["veterano"]), P("Vicente Castellano","ARQ",24,54,[]),
  P("Alexandro Benavente","DEF",22,54,[]), P("Diego Muñoz","DEF",28,56,[]), P("Lucas Abarca","DEF",26,56,[]),
  P("Daniel Navarrete","DEF",25,54,[]), P("Patricio Jerez","DEF",39,56,["veterano"]),
  P("Israel Muñoz","VOL",29,60,["capitán"]), P("Marcelo Carvajal","VOL",29,56,[]),
  P("Joao Ugarte","VOL",24,56,[]), P("Pablo Contreras","VOL",22,54,[]), P("Bryan Figueroa","VOL",27,54,[]),
  P("Nicolás Forttes","DEL",29,58,[]), P("Luis Pérez","DEL",27,56,[]),
  P("Lens Leger","DEL",23,56,["extranjero"]), P("Rubén Cobo","DEL",30,56,[]),
  P("Ignacio Farías","DEL",24,54,[]), P("Boris González","DEL",22,54,[])
];

const PLANTEL_SCI_FULL_2026=[
  P("Mauricio Maslovski","ARQ",26,58,["extranjero"]), P("Alonso Montecinos","ARQ",27,54,[]),
  P("Ítalo Muller","DEF",27,56,[]), P("Diego González","DEF",28,58,[]), P("Max Gatica","DEF",30,56,[]),
  P("Pablo Cárdenas","DEF",26,56,[]), P("Víctor González","DEF",32,58,[]), P("Miguel Arias","DEF",24,54,[]),
  P("Marco Medel","VOL",37,64,["capitán","veterano","experiencia"]), P("Andrés Díaz","VOL",26,56,[]),
  P("Carlos Lobos","VOL",29,58,[]), P("Nicolás Clavería","VOL",26,56,[]), P("Bastián Arias","VOL",21,54,["préstamo"]),
  P("Bryan Taiva","DEL",31,62,["goleador"]), P("Matías Sáez","DEL",24,56,[]),
  P("Fabián Núñez","DEL",34,58,["veterano"]), P("Joaquín Agüero","DEL",23,56,[])
];

const PLANTEL_LIN_FULL_2026=[
  P("Celso Castillo","ARQ",28,58,[]), P("Branko Gezan","ARQ",20,52,[]),
  P("Flavio Rojas","DEF",32,60,["veterano"]), P("Ignacio Sierra","DEF",25,56,[]),
  P("Claudio Fernández","DEF",26,56,[]), P("Ignacio Castillo","DEF",21,54,[]),
  P("Alberto Hernández","DEF",27,56,[]), P("Fernando Valdivia","DEF",22,54,[]),
  P("Julián Rodríguez","VOL",29,58,[]), P("José Ignacio Molina","VOL",26,56,[]),
  P("Nicolás Candado","VOL",22,56,[]), P("Cristian Arrué","VOL",31,58,[]), P("René Meléndez","VOL",27,56,[]),
  P("Diego Vallejos","DEL",36,62,["veterano","experiencia"]), P("Nathan Hayes","DEL",25,56,["extranjero"]),
  P("Abdallah Al-Hamidi","DEL",23,56,["extranjero"]), P("Bastián Gómez","DEL",19,52,["joven"]),
  P("Sebastián Peñaloza","DEL",23,54,[]), P("Claudio Galaz","DEL",23,54,[])
];

const PLANTEL_REN_FULL_2026=[
  P("Federico Molina","ARQ",22,56,["extranjero"]), P("Cristóbal Lecaros","ARQ",26,54,[]),
  P("Matías Navarrete","DEF",34,60,["capitán","veterano"]), P("José Manuel Basualto","DEF",26,56,[]),
  P("Michel Quezada","DEF",26,56,[]), P("Bayron Saavedra","DEF",29,56,[]), P("Joaquín López","DEF",27,56,[]),
  P("Matías Recabal","VOL",27,58,[]), P("Nicolás Basaure","VOL",23,54,[]),
  P("Juan Pablo Carrasco","VOL",38,56,["veterano"]), P("Jeckar Amaya","VOL",23,54,[]),
  P("Vicente Quevedo","VOL",20,52,[]),
  P("Lucas Fierro","DEL",28,60,[]), P("Zederick Vega","DEL",26,58,[]),
  P("Benjamín Campos","DEL",25,56,[]), P("Francisco Rivera","DEL",22,54,["préstamo"]),
  P("Matías Meneses","DEL",27,56,[]), P("Joshua Arrué","DEL",19,50,["joven"])
];

const PLANTEL_GVE_FULL_2026=[
  P("Wladimir Núñez","ARQ",21,52,[]), P("Jean Cerda","ARQ",23,56,["préstamo"]), P("Felipe Abarca","ARQ",32,58,["capitán"]),
  P("Ian Aguirre","DEF",26,56,[]), P("Iván Carrasco","DEF",20,52,[]), P("Francisco López","DEF",22,54,[]),
  P("Francisco Sepúlveda","DEF",35,58,["veterano"]), P("Juan Abarca","DEF",37,58,["veterano"]),
  P("Byron Bustamante","VOL",31,60,["experiencia"]), P("Benjamín Pinto","VOL",27,56,[]),
  P("Jorge Pavez","VOL",26,56,[]), P("Luis Torres","VOL",27,56,[]), P("Matías Villablanca","VOL",29,56,[]),
  P("Leandro Vargas","DEL",27,58,[]), P("Juan Pablo Lorca","DEL",23,56,[]),
  P("Jason Lorca","DEL",21,54,[]), P("Martín Alfaro","DEL",21,54,[]), P("Cristóbal Arriaza","DEL",21,52,[])
];

/* ——— AFA ——— */

const PLANTEL_ELP_2026=[
  P("Fabricio Iacovich","ARQ",24,74,[]), P("Fernando Muslera","ARQ",40,78,["veterano","extranjero"]),
  P("Rodrigo Borzone","ARQ",21,62,[]),
  P("Santiago Núñez","DEF",26,74,[]), P("Gastón Benedetti","DEF",25,74,[]),
  P("Leandro González Pírez","DEF",34,76,["veterano"]), P("Ramiro Funes Mori","DEF",35,74,["veterano"]),
  P("Eric Meza","DEF",27,72,[]), P("Santiago Arzamendia","DEF",28,72,["extranjero"]),
  P("José Sosa","VOL",41,76,["veterano","ídolo"]), P("Gabriel Neves","VOL",29,74,["extranjero"]),
  P("Ezequiel Piovi","VOL",34,74,[]), P("Alexis Castro","VOL",31,72,[]),
  P("Guido Carrillo","DEL",35,80,["capitán","goleador","veterano"]),
  P("Tiago Palacios","DEL",25,76,["extranjero"]), P("Lucas Alario","DEL",33,76,[]),
  P("Joaquín Correa","DEL",32,76,[]), P("Edwuin Cetré","DEL",28,74,["extranjero"]),
  P("Adolfo Gaich","DEL",27,72,[]), P("Brian Aguirre","DEL",23,72,["préstamo"])
];

const PLANTEL_ROS_2026=[
  P("Conan Ledesma","ARQ",33,78,["préstamo"]), P("Axel Werner","ARQ",30,70,["préstamo"]),
  P("Damián Fernández","ARQ",22,62,[]),
  P("Facundo Mallo","DEF",31,76,["extranjero"]), P("Agustín Sández","DEF",25,74,["extranjero"]),
  P("Juan Cruz Komar","DEF",29,74,[]), P("Gastón Ávila","DEF",25,74,["préstamo"]),
  P("Emanuel Coronel","DEF",29,72,[]), P("Alexis Soto","DEF",32,72,["préstamo"]),
  P("Franco Ibarra","VOL",25,74,[]), P("Pol Fernández","VOL",34,76,["veterano"]),
  P("Vicente Pizarro","VOL",23,76,["extranjero"]), P("Alan Rodríguez","VOL",26,72,["extranjero","préstamo"]),
  P("Ángel Di María","DEL",38,84,["capitán","ídolo","veterano","selección"]),
  P("Jáminton Campaz","DEL",26,78,["extranjero","desequilibrio"]),
  P("Franco Cervi","DEL",32,76,[]), P("Enzo Copetti","DEL",30,76,[]),
  P("Marco Ruben","DEL",39,74,["ídolo","veterano"]), P("Tomás Badaloni","DEL",26,70,[])
];

const PLANTEL_NEW_2026=[
  P("Gabriel Arias","ARQ",38,76,["veterano","extranjero"]), P("Josué Reinatti","ARQ",23,68,[]),
  P("Ian Glavinovich","DEF",24,72,[]), P("Lautaro Giannetti","DEF",32,76,[]),
  P("Saúl Salcedo","DEF",29,74,["extranjero"]), P("Oscar Salomón","DEF",27,72,[]),
  P("Martín Luciano","DEF",23,68,[]), P("Franco Escobar","DEF",31,72,[]),
  P("Armando Méndez","DEF",30,70,[]), P("Bruno Cabrera","DEF",29,70,[]),
  P("Valentino Acuña","VOL",20,70,["canterano","proyección"]), P("Alan Soñora","VOL",28,72,[]),
  P("Rodrigo Herrera","VOL",26,70,[]), P("David Sotelo","VOL",23,68,[]),
  P("Matías Cóccaro","DEL",28,74,["extranjero"]), P("Wálter Mazzantti","DEL",30,74,[]),
  P("Ignacio Ramírez","DEL",29,74,["extranjero"]), P("Walter Núñez","DEL",23,70,[])
];

const PLANTEL_HUR_2026=[
  P("Hernán Galíndez","ARQ",39,78,["veterano","extranjero"]), P("Sebastián Meza","ARQ",26,70,[]),
  P("Nazareno Durán","ARQ",22,62,[]),
  P("Lucas Blondel","DEF",29,74,[]), P("Federico Vera","DEF",28,72,[]),
  P("Fabio Pereyra","DEF",36,72,["veterano"]), P("Martín Nervo","DEF",35,72,["veterano"]),
  P("César Ibáñez","DEF",27,72,[]), P("Nehuén Paz","DEF",33,70,[]),
  P("Leonardo Gil","VOL",35,78,["experiencia","extranjero"]), P("Óscar Romero","VOL",34,76,["extranjero","desequilibrio"]),
  P("Emmanuel Ojeda","VOL",28,74,[]), P("Facundo Waller","VOL",29,72,["extranjero"]),
  P("Jordy Caicedo","DEL",28,74,["extranjero"]), P("Juan Bisanz","DEL",25,74,[]),
  P("Ignacio Pussetto","DEL",30,74,[]), P("Alejandro Martínez","DEL",29,72,[]),
  P("Leonardo Sequeira","DEL",31,70,[])
];

(function reg89(){
  if(typeof PLANTELES_REALES!=="object") return;
  function reg(id, squad){
    if(!PLANTELES_REALES[id]) PLANTELES_REALES[id]={};
    PLANTELES_REALES[id][2026]=squad;
  }
  ["COL","OVA","CNA","BSA","RSJ","SCI","LIN","REN","GVE","ELP","ROS","NEW","HUR"].forEach(function(id){
    var s=({COL:PLANTEL_COL_FULL_2026,OVA:PLANTEL_OVA_FULL_2026,CNA:PLANTEL_CNA_FULL_2026,BSA:PLANTEL_BSA_FULL_2026,
            RSJ:PLANTEL_RSJ_FULL_2026,SCI:PLANTEL_SCI_FULL_2026,LIN:PLANTEL_LIN_FULL_2026,REN:PLANTEL_REN_FULL_2026,
            GVE:PLANTEL_GVE_FULL_2026,ELP:PLANTEL_ELP_2026,ROS:PLANTEL_ROS_2026,NEW:PLANTEL_NEW_2026,
            HUR:PLANTEL_HUR_2026})[id];
    if(s) reg(id,s);
  });
  if(typeof CLUB_INFO_2026==="object"){
    var dts={
      COL:"Fernando Vergara", OVA:"Juan José Luvera", CNA:"Orlando Gutiérrez",
      BSA:"Felipe Cornejo", RSJ:"Jaime Lizama", SCI:"Cristian Febre",
      LIN:"Rodrigo Meléndez", REN:"Víctor Fuentes", GVE:"Matías Garrido",
      NEW:"Frank Darío Kudelka", HUR:"Diego Martínez", ROS:"Jorge Almirón"
    };
    Object.keys(dts).forEach(function(id){
      if(CLUB_INFO_2026[id]) CLUB_INFO_2026[id].dt=dts[id];
    });
  }
})();

/* ──────── data-planteles-90.js ──────── */
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

/* ──────── data-planteles-91.js ──────── */
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

/* ──────── data-planteles-92.js ──────── */
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

/* ──────── data-planteles-93.js ──────── */
/* ============================================================
   FUTBOLINI 7.93 · Primera Chile + B 2026 (Wikipedia, sep 2026)
   Fuentes (links):
     CC  https://es.wikipedia.org/wiki/Anexo:Temporada_2026_del_Club_Social_y_Deportivo_Colo-Colo
     UCH https://es.wikipedia.org/wiki/Anexo:Temporada_2026_del_Club_Universidad_de_Chile
     PAL https://es.wikipedia.org/wiki/Anexo:Temporada_2026_del_Club_Deportivo_Palestino
     EVE https://es.wikipedia.org/wiki/Anexo:Temporada_2026_de_Everton_de_Vi%C3%B1a_del_Mar
     UES https://es.wikipedia.org/wiki/Anexo:Temporada_2026_de_Uni%C3%B3n_Espa%C3%B1ola
     DCO https://es.wikipedia.org/wiki/Club_Social_y_de_Deportes_Concepci%C3%B3n
     SLQ https://es.wikipedia.org/wiki/San_Luis_de_Quillota
     USF https://es.wikipedia.org/wiki/Club_Deportivo_Uni%C3%B3n_San_Felipe
     MAG https://es.wikipedia.org/wiki/Club_Deportivo_Magallanes
     CBL https://es.wikipedia.org/wiki/Club_de_Deportes_Cobreloa
     REC https://es.wikipedia.org/wiki/Deportes_Recoleta
     SW  https://en.wikipedia.org/wiki/Template:Santiago_Wanderers_squad
   Stats ESTIMADAS. Cargar DESPUÉS de data-planteles-92.js.
   Assadi → AIK 21 ago 2026 (baja UCH). Pizarro → Rosario Central (baja CC).
   ============================================================ */

function _pj93(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var S=_pj93;

/* Colo-Colo · Anexo temporada 2026, act. 11 sep. DT Fernando Ortiz. Capitán Vidal.
   Bajas documentadas: Pizarro (Central), Pavez (Alianza), Cepeda (Elche), Cortés (Argentinos), Opazo (Everton). */
const PLANTEL_CC_FULL_2026=[
  S("Fernando de Paul","ARQ",35,78,["experiencia","seguro bajo los tres palos"]),
  S("Vozinha","ARQ",40,70,["veterano","extranjero"]),
  S("Eduardo Villanueva","ARQ",21,62,["canterano"]),
  S("Jonathan Villagra","DEF",25,78,["proyección","marca"]),
  S("Joaquín Sosa","DEF",24,74,["extranjero","préstamo"]),
  S("Matías Fernández","DEF",31,74,["lateral"]),
  S("Javier Méndez","DEF",31,75,["marca","extranjero"]),
  S("Erick Wiemberg","DEF",32,74,["lateral"]),
  S("Diego Ulloa","DEF",23,72,["lateral","canterano"]),
  S("Jeyson Rojas","DEF",24,72,["lateral"]),
  S("Iván Román","DEF",20,74,["proyección","préstamo"]),
  S("Miguel Toledo","DEF",22,66,["canterano"]),
  S("Víctor Méndez","VOL",26,74,["contención"]),
  S("Tomás Alarcón","VOL",27,74,["contención"]),
  S("Álvaro Madrid","VOL",31,74,["orden","préstamo"]),
  S("Claudio Aquino","VOL",35,78,["extranjero","desequilibrio"]),
  S("Arturo Vidal","VOL",39,76,["ídolo","capitán","carácter"]),
  S("Bastián Silva","VOL",22,66,["canterano"]),
  S("Francisco Marchant","DEL",20,74,["canterano","proyección"]),
  S("Javier Correa","DEL",33,80,["extranjero","goleador"]),
  S("Lautaro Pastrán","DEL",24,74,["extranjero","préstamo"]),
  S("Marcos Bolados","DEL",30,74,["velocidad"]),
  S("Maximiliano Romero","DEL",27,82,["extranjero","goleador","préstamo"]),
  S("Leandro Hernández","DEL",21,74,["joven","proyección"])
];

/* Universidad de Chile · Anexo temporada 2026, act. 11 sep. DT Fernando Gago (desde 19 mar).
   Capitán Marcelo Díaz. Assadi vendido a AIK (cláusula, 21 ago) — no va. */
const PLANTEL_UCH_FULL_2026=[
  S("Gabriel Castellón","ARQ",33,78,["reflejos"]),
  S("Cristopher Toselli","ARQ",38,70,["veterano"]),
  S("José Alburquenque","ARQ",19,60,["canterano"]),
  S("Igor Lichnovsky","DEF",32,77,["selección"]),
  S("Nicolás Ramírez","DEF",29,76,["marca"]),
  S("Nicolás Fernández","DEF",27,74,[]),
  S("Marcelo Morales","DEF",23,76,["lateral","proyección","préstamo"]),
  S("Fabián Hormazábal","DEF",30,76,["lateral ofensivo"]),
  S("Matías Zaldivia","DEF",35,74,["experiencia"]),
  S("Bianneider Tamayo","DEF",21,68,["extranjero","joven"]),
  S("Diego Vargas","DEF",20,66,["canterano"]),
  S("Israel Poblete","VOL",31,73,["orden"]),
  S("Charles Aránguiz","VOL",37,79,["ídolo","cerebro","experiencia internacional"]),
  S("Marcelo Díaz","VOL",39,72,["ídolo","capitán","veterano"]),
  S("Javier Altamirano","VOL",27,76,["desequilibrio"]),
  S("Tobías Reinhart","VOL",26,72,["extranjero"]),
  S("Agustín Arce","VOL",21,72,["canterano"]),
  S("Ignacio Vásquez","VOL",20,66,["canterano"]),
  S("Eduardo Vargas","DEL",36,78,["ídolo","experiencia internacional"]),
  S("Juan Martín Lucero","DEL",34,76,["extranjero","goleador"]),
  S("Maximiliano Guerrero","DEL",26,76,["velocidad"]),
  S("Octavio Rivero","DEL",34,74,["extranjero"]),
  S("Gonzalo Reyna","DEL",20,72,["extranjero","proyección","préstamo"])
];

/* Palestino · Anexo temporada 2026, act. 10 sep. DT Guillermo Farré (fecha 12; Muñoz 1–11).
   Glaby no figura. Fernando Meza / Ariel Martínez / Julián Fernández / Gonzalo Tapia sí. */
const PLANTEL_PAL_FULL_2026=[
  S("Sebastián Pérez","ARQ",35,74,["experiencia"]),
  S("Sebastián Salas","ARQ",25,68,[]),
  S("Renato Canto","ARQ",23,62,["canterano"]),
  S("Enzo Roco","DEF",34,75,["experiencia internacional"]),
  S("Fernando Meza","DEF",36,72,["extranjero","veterano"]),
  S("José Bizama","DEF",32,72,["marca"]),
  S("Dilan Zúñiga","DEF",30,73,["lateral"]),
  S("Ian Garguez","DEF",21,72,["proyección","canterano"]),
  S("Vicente Espinoza","DEF",22,70,["lateral","canterano"]),
  S("Antonio Ceza","DEF",23,68,[]),
  S("Jason León","DEF",26,68,[]),
  S("Joe Abrigo","VOL",31,75,["desequilibrio"]),
  S("Sebastián Gallegos","VOL",34,72,["experiencia"]),
  S("Julián Fernández","VOL",31,72,["extranjero"]),
  S("Ariel Martínez","VOL",32,72,[]),
  S("Nicolás Meza","VOL",24,68,["canterano"]),
  S("Francisco Montes","VOL",22,64,["canterano"]),
  S("Bryan Carrasco","DEL",35,72,["veterano"]),
  S("Ronnie Fernández","DEL",35,73,["goleador"]),
  S("César Munder","DEL",26,74,["velocidad"]),
  S("Jonathan Benítez","DEL",35,72,["extranjero"]),
  S("Nelson Da Silva","DEL",30,73,["extranjero"]),
  S("Gonzalo Tapia","DEL",30,72,[]),
  S("Martín Araya","DEL",21,64,["canterano"])
];

/* Everton · Anexo temporada 2026, act. 11 sep. DT Walter Ribonetto.
   Opazo llega de Colo-Colo. Madrid se va a Colo-Colo. Villalpando alta. */
const PLANTEL_EVE_FULL_2026=[
  S("Ignacio González","ARQ",37,74,["veterano","seguro bajo los tres palos"]),
  S("Esteban Kirkman","ARQ",22,64,["joven"]),
  S("Isaac Esquenazi","ARQ",22,58,["canterano"]),
  S("Diego Oyarzún","DEF",33,73,["capitán","juego aéreo"]),
  S("Hugo Magallanes","DEF",29,74,["extranjero","juego aéreo"]),
  S("Óscar Opazo","DEF",36,72,["lateral ofensivo","veterano"]),
  S("Nicolás Baeza","DEF",29,70,["lateral ofensivo"]),
  S("Vicente Fernández","DEF",27,68,["lateral"]),
  S("Cristopher Barrera","DEF",28,68,[]),
  S("Ramiro González","DEF",35,66,["extranjero","veterano"]),
  S("Valentín Vidal","DEF",22,66,["joven","préstamo"]),
  S("Benjamín Berríos","VOL",28,73,["contención"]),
  S("Diéter Villalpando","VOL",35,72,["extranjero","experiencia"]),
  S("Joaquín Moya","VOL",32,68,["experiencia"]),
  S("Felipe Villagrán","VOL",29,68,[]),
  S("Lucas Soto","VOL",23,66,["joven","préstamo"]),
  S("Alan Medina","DEL",28,74,["extranjero","desequilibrio"]),
  S("Julián Alfaro","DEL",25,70,["desequilibrio","préstamo"]),
  S("Emiliano Ramos","DEL",21,66,["joven","proyección"]),
  S("Cristian Palacios","DEL",36,72,["goleador","extranjero"]),
  S("Braian Martínez","DEL",27,68,["extranjero","velocidad","préstamo"]),
  S("Sebastián Sosa","DEL",32,70,["extranjero"]),
  S("Nicolás Montiel","DEL",21,64,["joven","extranjero","préstamo"])
];

/* Unión Española · Anexo temporada 2026, act. 11 sep. DT Ronald Fuentes. B 2026. */
const PLANTEL_UES_FULL_2026=[
  S("Martín Parra","ARQ",26,68,[]),
  S("Julio Fierro","ARQ",24,64,["préstamo"]),
  S("Enzo Uribe","ARQ",22,56,["canterano"]),
  S("Sebastián Pereira","DEF",27,68,[]),
  S("José Aja","DEF",33,66,["extranjero","juego aéreo"]),
  S("Bastián Roco","DEF",22,66,["proyección"]),
  S("Martín Ormeño","DEF",27,64,[]),
  S("Kevin Contreras","DEF",21,60,["canterano"]),
  S("Milovan Celis","DEF",20,58,["canterano"]),
  S("Pablo Aránguiz","VOL",29,70,["enganche"]),
  S("Ángelo Araos","VOL",29,68,["desequilibrio"]),
  S("William Machado","VOL",32,66,["extranjero","contención"]),
  S("Ignacio Núñez","VOL",27,64,[]),
  S("Ulises Ojeda","VOL",30,64,["extranjero"]),
  S("Renato Cordero","VOL",23,64,["proyección","préstamo"]),
  S("Felipe Massri","VOL",24,62,["canterano"]),
  S("Benjamín Droguett","VOL",23,62,[]),
  S("Lucas Molina","VOL",22,62,["préstamo"]),
  S("Patricio Rubio","DEL",37,68,["ídolo","veterano"]),
  S("Andrés Vilches","DEL",34,68,["juego aéreo"]),
  S("Gabriel Norambuena","DEL",23,66,["canterano","velocidad"]),
  S("Mitchell Wassenne","DEL",25,64,["velocidad"]),
  S("Franco Ratotti","DEL",21,62,["extranjero"])
];

/* San Luis · es.wikipedia club, plantilla 2026. DT Humberto Suazo.
   Parada 4° goleador B (en.wiki Liga de Ascenso 2026, 10 sep). Antes el plantel no tenía delanteros. */
const PLANTEL_SLQ_FULL_2026=[
  S("Nicolás Peranic","ARQ",41,62,["veterano"]),
  S("Fernando Abarzúa","ARQ",23,60,[]),
  S("Tomás Charpentier","ARQ",20,54,["canterano"]),
  S("Guillermo Avello","DEF",30,66,[]),
  S("Ignacio Meza","DEF",30,66,["juego aéreo"]),
  S("Cristian González","DEF",36,62,["veterano"]),
  S("Vicente Durán","DEF",26,64,[]),
  S("Luis Muñoz","DEF",22,62,[]),
  S("Nicolás Muñoz","DEF",28,64,[]),
  S("Joel Torres","VOL",26,64,["extranjero"]),
  S("Daniel Monardes","VOL",26,64,[]),
  S("Franco Cortés","VOL",26,62,[]),
  S("Carlos Hormazábal","VOL",25,64,[]),
  S("Gonzalo Bustos","VOL",26,64,[]),
  S("Sebastián Parada","DEL",25,72,["goleador"]),
  S("Sergio Vergara","DEL",32,66,[]),
  S("Gael Acosta","DEL",34,66,["extranjero"]),
  S("Guillermo Madrigal","DEL",33,66,["extranjero"]),
  S("Diego González","DEL",29,64,[]),
  S("Martín Carreño","DEL",21,60,["canterano"])
];

/* Unión San Felipe · es.wikipedia plantilla 2026. DT Juan José Luvera. */
const PLANTEL_USF_FULL_2026=[
  S("Andrés Fernández","ARQ",28,64,[]),
  S("Leandro Cañete","ARQ",31,64,[]),
  S("Martín Ibacache","ARQ",26,56,["canterano"]),
  S("Valentín Perales","DEF",31,64,["extranjero"]),
  S("Byron Guajardo","DEF",34,62,[]),
  S("Diego Bravo","DEF",29,62,[]),
  S("Kevin Serrano","DEF",28,62,[]),
  S("Diego Pereira","DEF",28,60,[]),
  S("Cristián Suárez","DEF",39,60,["veterano"]),
  S("Manuel Olea","DEF",32,60,[]),
  S("Norberto Palmieri","VOL",30,66,["extranjero","contención"]),
  S("Gonzalo Jara","VOL",27,64,[]),
  S("Ignacio Jara","VOL",29,64,[]),
  S("Luis García","VOL",30,62,[]),
  S("Axel León","VOL",23,58,["canterano"]),
  S("Bruno Vides","DEL",33,66,["extranjero"]),
  S("Agustín Fontana","DEL",30,66,["extranjero"]),
  S("Nicolás Brun","DEL",27,64,["extranjero"]),
  S("Franco Lobos","DEL",27,64,["velocidad"]),
  S("Bairo Riveros","DEL",27,62,[]),
  S("Patricio Muñoz","DEL",24,60,[]),
  S("Benjamín Aravena","DEL",21,60,[])
];

/* Magallanes · es.wikipedia plantilla 2026. DT Miguel Ponce. Jorquera ídolo. */
const PLANTEL_MAG_FULL_2026=[
  S("Joaquín Muñoz","ARQ",35,66,[]),
  S("Juan Pablo Zozaya","ARQ",25,64,["extranjero"]),
  S("Martín Riffo","ARQ",22,56,["canterano"]),
  S("Matías Vásquez","DEF",23,66,["proyección"]),
  S("Jeremías James","DEF",25,66,["extranjero"]),
  S("Claudio Meneses","DEF",38,62,["veterano"]),
  S("Felipe Yáñez","DEF",21,64,["proyección","préstamo"]),
  S("Alonso Walters","DEF",21,60,["canterano"]),
  S("Hans Salinas","DEF",36,62,["veterano"]),
  S("Diego Figueroa","DEF",23,60,["canterano"]),
  S("Bruno Liuzzi","VOL",26,68,["contención"]),
  S("Cristóbal Jorquera","VOL",38,66,["enganche","ídolo","veterano"]),
  S("Diego Fernández","VOL",28,66,[]),
  S("Santiago Coronel","VOL",26,64,["extranjero"]),
  S("Javier Quiroz","VOL",25,60,[]),
  S("Facundo Peraza","DEL",34,70,["extranjero","goleador"]),
  S("Rubén Farfán","DEL",34,66,["velocidad"]),
  S("Matías Fredes","DEL",25,64,[]),
  S("Milton Alegre","DEL",34,64,["extranjero"]),
  S("Alessandro Toledo","DEL",23,62,["proyección"]),
  S("Ignacio Serpa","DEL",23,60,["extranjero"])
];

/* Cobreloa · es.wikipedia plantilla 2026. DT César Bravo (Wiki; prensa 11 sep habla de salida).
   Gotti 2° goleador B (en.wiki Liga de Ascenso, 10 sep). */
const PLANTEL_CBL_FULL_2026=[
  S("Diego Tapia","ARQ",31,70,["seguro bajo los tres palos"]),
  S("Hugo Araya","ARQ",25,68,["canterano","proyección"]),
  S("Cristián Alarcón","ARQ",18,54,["canterano"]),
  S("Bastián San Juan","DEF",32,72,["juego aéreo"]),
  S("Rodolfo González","DEF",37,66,["ídolo","veterano"]),
  S("Diego García","DEF",29,68,[]),
  S("David Tapia","DEF",28,66,[]),
  S("Felipe Fritz","DEF",28,64,["velocidad"]),
  S("Felipe Saavedra","DEF",29,64,[]),
  S("Jorge Gatica","VOL",30,70,["contención"]),
  S("Tomás Aránguiz","VOL",21,66,["proyección","enganche"]),
  S("Cristian Muga","VOL",30,66,["extranjero","contención"]),
  S("Facundo Velazco","VOL",27,66,["extranjero","desequilibrio"]),
  S("Sebastián Zúñiga","VOL",36,64,["tiro libre","veterano"]),
  S("Gustavo Gotti","DEL",32,76,["extranjero","ídolo","goleador"]),
  S("Vicente Conelli","DEL",23,74,["proyección"]),
  S("Cristian Insaurralde","DEL",35,70,["extranjero","desequilibrio"]),
  S("Juan Ignacio Duma","DEL",32,68,[]),
  S("Matías Sandoval","DEL",29,68,["extranjero"]),
  S("Álvaro Delgado","DEL",31,64,[])
];

/* Recoleta · es.wikipedia plantilla 2026. DT Francisco Arrué. */
const PLANTEL_REC_FULL_2026=[
  S("Álvaro Salazar","ARQ",33,66,[]),
  S("José Ignacio Narr","ARQ",23,58,["canterano"]),
  S("Jaime Vargas","ARQ",21,56,["canterano"]),
  S("Francisco Alarcón","DEF",36,66,["veterano"]),
  S("Fabrizio Tomarelli","DEF",25,64,[]),
  S("Daniel Viveros","DEF",25,64,[]),
  S("Ignacio Lara","DEF",30,64,[]),
  S("Brayams Viveros","DEF",34,62,[]),
  S("Christian Cepeda","DEF",35,62,["veterano"]),
  S("Camilo Rodríguez","DEF",31,64,[]),
  S("Branco Provoste","VOL",26,66,[]),
  S("Mikel Arguinarena","VOL",35,66,["veterano"]),
  S("Federico Martin","VOL",35,64,["extranjero","veterano"]),
  S("Felipe Báez","VOL",35,64,["veterano"]),
  S("Nicolás Carvajal","VOL",29,62,[]),
  S("Germán Estigarribia","DEL",29,70,["goleador"]),
  S("Pedro Sánchez","DEL",28,66,[]),
  S("Gonzalo Álvarez","DEL",30,66,[]),
  S("Ignacio Fuenzalida","DEL",24,64,[]),
  S("Carlos González","DEL",23,62,[]),
  S("Bastián Valdés","DEL",25,62,[])
];

/* Deportes Concepción · es.wikipedia plantilla 2026. DT Fernando Díaz.
   Larrivey 42. Sandoval / Yonathan Rodríguez altas. */
const PLANTEL_DCO_FULL_2026=[
  S("César Dutra","ARQ",34,72,["extranjero"]),
  S("Nicolás Araya","ARQ",27,64,[]),
  S("Nery Veloso","ARQ",39,62,["veterano"]),
  S("Fausto Grillo","DEF",33,72,["extranjero"]),
  S("Diego Carrasco","DEF",31,70,[]),
  S("Norman Rodríguez","DEF",28,70,["extranjero","juego aéreo"]),
  S("Brayan Véjar","DEF",31,70,["lateral ofensivo","préstamo"]),
  S("Ariel Cáceres","DEF",26,66,[]),
  S("Cristian Riquelme","DEF",22,66,["joven","préstamo"]),
  S("Mateo González","DEF",21,64,["joven","préstamo"]),
  S("Jorge Henríquez","VOL",32,70,[]),
  S("Misael Dávila","VOL",35,70,["veterano"]),
  S("Sebastián Martínez","VOL",33,68,["contención"]),
  S("Yonathan Rodríguez","VOL",33,68,["extranjero"]),
  S("Mario Sandoval","VOL",35,68,["veterano"]),
  S("Ethan Espinoza","VOL",25,66,["préstamo"]),
  S("Leenhan Romero","VOL",19,60,["joven","préstamo"]),
  S("Joaquín Larrivey","DEL",42,72,["capitán","goleador","extranjero","veterano"]),
  S("Joaquín Montecinos","DEL",30,70,["velocidad"]),
  S("Aldrix Jara","DEL",26,68,["goleador"]),
  S("Matías Cavalleri","DEL",28,68,[]),
  S("Fernando Romero","DEL",26,66,["extranjero"]),
  S("Carlos Escobar","DEL",36,66,["veterano"])
];

/* Wanderers · Template en.wiki 8 mar + TM 2026. DT Francisco Palladino.
   Camarda 12 goles (en.wiki Liga de Ascenso 10 sep). Portilla a préstamo desde Colo-Colo. */
const PLANTEL_SW_FULL_2026=[
  S("Eduardo Miranda","ARQ",33,68,[]),
  S("Bayron Martínez","ARQ",25,66,[]),
  S("Raúl Olivares","ARQ",38,62,["veterano"]),
  S("Sergio Felipe","DEF",35,68,["extranjero","juego aéreo"]),
  S("Pedro Navarro","DEF",25,68,["velocidad","préstamo"]),
  S("Axel Herrera","DEF",25,66,[]),
  S("Víctor Espinoza","DEF",27,64,[]),
  S("Luis Margas","DEF",20,62,["canterano","proyección"]),
  S("Cristopher Valenzuela","DEF",18,56,["canterano"]),
  S("Cristóbal Cáceres","VOL",30,66,["contención"]),
  S("Leandro Navarro","VOL",34,70,["extranjero","contención"]),
  S("Joaquín Silva","VOL",21,70,["canterano","proyección"]),
  S("Martín Villarroel","VOL",24,64,["contención"]),
  S("Jorge Luna","VOL",39,66,["extranjero","enganche","capitán","veterano"]),
  S("Dylan Portilla","VOL",22,62,["préstamo"]),
  S("Marcos Camarda","DEL",25,76,["extranjero","goleador"]),
  S("Cristóbal Ponce","DEL",19,64,["canterano","proyección"]),
  S("Javier Parraguez","DEL",36,64,["veterano"]),
  S("Ignacio Flores","DEL",19,58,["canterano"]),
  S("Vicente Vera","DEL",22,60,["velocidad"]),
  S("Denilson San Martín","DEL",18,58,["canterano"])
];

(function reg93(){
  if(typeof PLANTELES_REALES!=="object") return;
  var map={
    CC:PLANTEL_CC_FULL_2026, UCH:PLANTEL_UCH_FULL_2026, PAL:PLANTEL_PAL_FULL_2026,
    EVE:PLANTEL_EVE_FULL_2026, UES:PLANTEL_UES_FULL_2026, SLQ:PLANTEL_SLQ_FULL_2026,
    USF:PLANTEL_USF_FULL_2026, MAG:PLANTEL_MAG_FULL_2026, CBL:PLANTEL_CBL_FULL_2026,
    REC:PLANTEL_REC_FULL_2026, DCO:PLANTEL_DCO_FULL_2026, SW:PLANTEL_SW_FULL_2026
  };
  Object.keys(map).forEach(function(id){
    if(!PLANTELES_REALES[id]) PLANTELES_REALES[id]={};
    PLANTELES_REALES[id][2026]=map[id];
  });

  /* Épocas doradas Segunda / B · hechos Wikipedia. Sin plantel inventado. */
  var epocas={
    SMO:[{anio:1942,etq:"1942 · Campeón nacional",
      desc:"Santiago Morning campeón del Campeonato Nacional 1942. DT José Luis Boffi. Domingo Romo goleador del torneo (16). Raúl Toro, figura histórica. Fuente: es.wikipedia.org/wiki/Club_de_Deportes_Santiago_Morning",
      dt:"José Luis Boffi",
      ind:{plantel:78,moral:86,hinchada:80,socios:52,cantera:48,estadio:50,prestigio:78,riesgo:18},
      caja:{plata:160,deuda:40}}],
    MAG:[{anio:1933,etq:"1933 · Primer campeón",
      desc:"Magallanes primer campeón profesional de Chile (1933). Tricampeón 1933-34-35 y otra estrella en 1938. DT Arturo Torres. Fuente: es.wikipedia.org/wiki/Historial_de_la_Primera_Divisi%C3%B3n_de_Chile",
      dt:"Arturo Torres",
      ind:{plantel:82,moral:88,hinchada:78,socios:50,cantera:46,estadio:48,prestigio:82,riesgo:16},
      caja:{plata:140,deuda:30}}],
    LSC:[{anio:1969,etq:"1969 · Primer ascenso",
      desc:"Lota Schwager campeón de Segunda 1969 (DT Juan Jenaro) y primer salto a Primera. Otro título de Segunda en 1986. Fuente: es.wikipedia.org/wiki/Club_de_Deportes_Lota_Schwager",
      dt:"Juan Jenaro",
      ind:{plantel:70,moral:84,hinchada:76,socios:40,cantera:44,estadio:46,prestigio:62,riesgo:26},
      caja:{plata:90,deuda:35}}],
    SW:[{anio:2001,etq:"2001 · Tercera estrella",
      desc:"Santiago Wanderers campeón de Primera 2001. Último título de honor del decano (tras 1958 y 1968). Fuente: es.wikipedia.org/wiki/Historial_de_la_Primera_Divisi%C3%B3n_de_Chile",
      dt:"el cuerpo técnico",
      ind:{plantel:78,moral:86,hinchada:84,socios:56,cantera:52,estadio:72,prestigio:76,riesgo:22},
      caja:{plata:240,deuda:100}}],
    UES:[{anio:2013,etq:"2013 · Transición",
      desc:"Unión Española campeón del Torneo de Transición 2013. Séptima estrella. Santa Laura. Fuente: es.wikipedia.org/wiki/Historial_de_la_Primera_Divisi%C3%B3n_de_Chile",
      dt:"José Luis Sierra",
      ind:{plantel:80,moral:84,hinchada:76,socios:56,cantera:60,estadio:68,prestigio:78,riesgo:20},
      caja:{plata:320,deuda:110}}]
  };
  if(typeof EPOCAS_CLUB==="object"){
    Object.keys(epocas).forEach(function(id){
      var cur=EPOCAS_CLUB[id]||[];
      epocas[id].forEach(function(ep){
        if(!cur.some(function(x){ return x.anio===ep.anio; })) cur.push(ep);
      });
      EPOCAS_CLUB[id]=cur;
    });
  }

  function pushH(id, item){
    if(typeof HISTORIA_LINEA!=="object") return;
    if(!HISTORIA_LINEA[id]) HISTORIA_LINEA[id]=[];
    if(HISTORIA_LINEA[id].some(function(h){ return h.anio===item.anio && h.hito===item.hito; })) return;
    var i=HISTORIA_LINEA[id].length, k;
    for(k=0;k<HISTORIA_LINEA[id].length;k++){ if(HISTORIA_LINEA[id][k].hito==="Hoy"){ i=k; break; } }
    HISTORIA_LINEA[id].splice(i,0,item);
    if(typeof HISTORIA_BETA==="object"){
      if(!HISTORIA_BETA[id]) HISTORIA_BETA[id]={};
      HISTORIA_BETA[id][String(item.anio)]=item.txt;
    }
  }
  pushH("SMO",{anio:1942,hito:"Campeón",txt:"Campeón nacional 1942. José Luis Boffi, Domingo Romo (16 goles), Raúl Toro."});
  pushH("MAG",{anio:1933,hito:"Primer campeón",txt:"Primer campeón profesional de Chile (1933). Tricampeón 33-34-35 y 1938."});
  pushH("LSC",{anio:1969,hito:"Ascenso",txt:"Campeón de Segunda 1969 (Juan Jenaro). Primer salto a Primera. Otro título en 1986."});
  pushH("SW",{anio:2001,hito:"Campeón",txt:"Campeón de Primera 2001. Tercera estrella del decano (1958, 1968, 2001)."});
})();

/* ──────── data-planteles-94.js ──────── */
/* ============================================================
   FUTBOLINI 7.94 · resto Primera Chile 2026 (Wikipedia, sep 2026)
   Fuentes (links):
     COQ https://es.wikipedia.org/wiki/Anexo:Temporada_2026_de_Coquimbo_Unido
     AUD https://es.wikipedia.org/wiki/Audax_Italiano
     HUA https://es.wikipedia.org/wiki/Anexo:Temporada_2026_del_Club_Deportivo_Huachipato
     OHI https://es.wikipedia.org/wiki/Club_Deportivo_O%27Higgins
         + https://es.wikipedia.org/wiki/Anexo:Temporada_2026_del_Club_Deportivo_O%27Higgins
     NUB https://es.wikipedia.org/wiki/%C3%91ublense
     COB https://es.wikipedia.org/wiki/Club_de_Deportes_Cobresal
     CAL https://es.wikipedia.org/wiki/Club_de_Deportes_Uni%C3%B3n_La_Calera
     LSE https://es.wikipedia.org/wiki/Club_de_Deportes_La_Serena
     UDC https://en.wikipedia.org/wiki/Template:C.D._Universidad_de_Concepci%C3%B3n_squad (13 ago)
   Stats ESTIMADAS. Cargar DESPUÉS de data-planteles-93.js.
   Palavecino → UC (baja COQ). Cerezo → UC (baja NUB). Munder → PAL (baja COB).
   Escobar retorno COQ (sale de LIM). Villagrán → Cobresal (sale de Everton).
   Malanca en Huachipato (sale de Banfield). Maxi Gutiérrez → Independiente.
   ============================================================ */

function _pj94(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var S=_pj94;

/* Coquimbo Unido · Anexo temporada 2026. DT Hernán Caputto. Capitán Galani.
   Palavecino baja a UC. Fracchia alta y rescisión: no va. Glaby retorno Barracas. */
const PLANTEL_COQ_FULL_2026=[
  S("Gonzalo Flores","ARQ",26,74,["proyección"]),
  S("Diego Sánchez","ARQ",39,72,["veterano","seguro bajo los tres palos"]),
  S("Cristóbal Dorador","ARQ",20,58,["canterano"]),
  S("Benjamín Gazzolo","DEF",29,74,["juego aéreo"]),
  S("Elvis Hernández","DEF",26,72,["extranjero"]),
  S("Manuel Fernández","DEF",37,68,["extranjero","veterano"]),
  S("Dylan Escobar","DEF",25,72,["retorno"]),
  S("Francisco Salinas","DEF",26,76,["lateral ofensivo","proyección"]),
  S("Sebastián Cabrera","DEF",28,72,["lateral ofensivo"]),
  S("Juan Cornejo","DEF",36,70,["veterano","asistidor"]),
  S("Lukas Soza","DEF",28,66,[]),
  S("Joshua Arancibia","DEF",21,64,["canterano"]),
  S("Sebastián Galani","VOL",29,76,["capitán","contención"]),
  S("Dylan Glaby","VOL",30,74,["retorno","contención"]),
  S("Alejandro Camargo","VOL",37,70,["extranjero","experiencia"]),
  S("Guido Vadalá","VOL",29,72,["extranjero","creación"]),
  S("Salvador Cordero","VOL",30,68,["contención"]),
  S("Pablo Rodríguez","VOL",19,62,["préstamo","joven"]),
  S("Matías Zepeda","VOL",22,64,["canterano"]),
  S("Nicolás Johansen","DEL",27,76,["extranjero","goleador"]),
  S("Lucas Pratto","DEL",38,74,["extranjero","ídolo","veterano"]),
  S("Cristián Zavala","DEL",27,72,["velocidad","préstamo"]),
  S("Luis Riveros","DEL",28,70,["extranjero"]),
  S("Rodrigo Holgado","DEL",31,72,["extranjero","préstamo"]),
  S("Alejandro Azócar","DEL",25,70,["desequilibrio"]),
  S("Benjamín Chandía","DEL",23,66,["canterano"]),
  S("Martín Mundaca","DEL",19,64,["joven","proyección"])
];

/* Audax Italiano · es.wikipedia plantilla 2026. DT Patricio Graff. Capitán Collao.
   Pizarro préstamo Racing (2º sem). Pinares llega de Limache. Riveros se fue a Coquimbo. */
const PLANTEL_AUD_FULL_2026=[
  S("Tomás Ahumada","ARQ",25,78,["seguro bajo los tres palos","proyección"]),
  S("Pedro Garrido","ARQ",22,64,["joven"]),
  S("Martín Ballesteros","ARQ",24,64,[]),
  S("Cristóbal Piña","ARQ",19,56,["canterano"]),
  S("Daniel Piña","DEF",24,72,["juego aéreo"]),
  S("Enzo Ferrario","DEF",26,72,[]),
  S("Marcelo Ortiz","DEF",32,70,["extranjero"]),
  S("Felipe Salomoni","DEF",23,70,["extranjero","préstamo","lateral ofensivo"]),
  S("Óliver Rojas","DEF",26,68,["lateral"]),
  S("Raimundo Rebolledo","DEF",29,68,["lateral ofensivo"]),
  S("Diego Monreal","DEF",22,66,["retorno"]),
  S("Cristóbal Muñoz","DEF",26,64,[]),
  S("Tomás Cayuqueo","DEF",20,62,["canterano"]),
  S("Marco Collao","VOL",28,74,["capitán","box-to-box"]),
  S("Federico Mateos","VOL",33,72,["extranjero","experiencia"]),
  S("César Pinares","VOL",35,72,["tiro libre","veterano"]),
  S("Ariel Uribe","VOL",27,70,["préstamo","desequilibrio"]),
  S("Nicolás Orellana","VOL",31,68,[]),
  S("Nicolás Aedo","VOL",25,66,[]),
  S("Bryan Soto","VOL",25,64,["préstamo","contención"]),
  S("Favian Loyola","VOL",21,64,["joven","extranjero"]),
  S("Franco Troyansky","DEL",29,74,["extranjero","goleador"]),
  S("Diego Coelho","DEL",31,72,["extranjero","juego aéreo"]),
  S("Damián Pizarro","DEL",21,74,["préstamo","proyección"]),
  S("Giovani Chiaverano","DEL",21,72,["extranjero","préstamo","desequilibrio"]),
  S("Rodrigo Cabral","DEL",26,70,["extranjero","préstamo"]),
  S("Michael Vadulli","DEL",28,68,[]),
  S("Paolo Guajardo","DEL",23,66,[])
];

/* Huachipato · Anexo temporada 2026. DT Jaime García. Capitán Sepúlveda.
   Maxi Gutiérrez traspaso a Independiente: no va. Gazzolo se fue a Coquimbo.
   Malanca llega de Independiente Rivadavia. */
const PLANTEL_HUA_FULL_2026=[
  S("Sebastián Mella","ARQ",21,70,["joven","proyección"]),
  S("Christian Bravo","ARQ",20,68,["joven"]),
  S("Rodrigo Odriozola","ARQ",38,66,["extranjero","veterano"]),
  S("Guillermo Guaiquil","DEF",23,68,["lateral"]),
  S("Benjamín Mellado","DEF",22,66,[]),
  S("José Castro","DEF",24,68,["préstamo","lateral"]),
  S("Rafael Caroca","DEF",37,70,["veterano","experiencia"]),
  S("Renzo Malanca","DEF",23,72,["extranjero","joven"]),
  S("Nicolás Vargas","DEF",32,70,["juego aéreo"]),
  S("Cristian Toro","DEF",25,68,[]),
  S("Lucas Velásquez","DEF",20,68,["joven","lateral ofensivo"]),
  S("Claudio Sepúlveda","VOL",34,74,["capitán","contención","ídolo"]),
  S("Ezequiel Cañete","VOL",27,74,["extranjero","creación"]),
  S("Santiago Silva","VOL",22,66,["extranjero"]),
  S("Carlos Herrera","VOL",26,66,["contención"]),
  S("Maicol León","VOL",23,68,[]),
  S("Kevin Altez","VOL",21,66,["joven","extranjero","préstamo"]),
  S("Nicolás Cárcamo","VOL",21,62,["canterano"]),
  S("Lionel Altamirano","DEL",33,76,["extranjero","goleador"]),
  S("Mario Briceño","DEL",30,72,["desequilibrio"]),
  S("Cris Martínez","DEL",33,70,["extranjero","experiencia"]),
  S("Maximiliano Rodríguez","DEL",26,70,["retorno"]),
  S("Juan Ignacio Figueroa","DEL",22,68,["joven"]),
  S("Harold Antiñirre","DEL",24,68,[]),
  S("Claudio Torres","DEL",23,66,[]),
  S("Luciano Arriagada","DEL",24,64,["juego aéreo"])
];

/* O'Higgins · Anexo + club Wikipedia (altas 2º sem). DT Lucas Bovaglio. Capitán Robledo.
   Sarrafiore baja a Atlante (2º sem): no va. Schamine rescisión. Moisés González → UDC.
   Avilés, Toloza, Schor, Bou, Fernández: altas 2º semestre documentadas. */
const PLANTEL_OHI_FULL_2026=[
  S("Omar Carabalí","ARQ",29,76,["seguro bajo los tres palos"]),
  S("Jorge Peña","ARQ",26,68,["préstamo"]),
  S("Diego Carreño","ARQ",24,64,[]),
  S("Fabricio Vera","ARQ",20,56,["canterano"]),
  S("Alan Robledo","DEF",28,74,["capitán","extranjero"]),
  S("Tomás Avilés","DEF",22,76,["extranjero","proyección","préstamo"]),
  S("Miguel Brizuela","DEF",29,72,["extranjero","préstamo"]),
  S("Luis Pavez","DEF",30,70,["lateral ofensivo"]),
  S("Felipe Faúndez","DEF",20,70,["joven","lateral ofensivo"]),
  S("Nicolás Garrido","DEF",24,68,[]),
  S("Leandro Díaz","DEF",27,68,["lateral"]),
  S("Benjamín Rojas","DEF",25,66,[]),
  S("Cristian Morales","DEF",19,60,["canterano"]),
  S("Felipe Ogaz","VOL",23,72,["contención"]),
  S("Bryan Rabello","VOL",32,74,["creación","tiro libre"]),
  S("Juan Leiva","VOL",32,72,["experiencia"]),
  S("Santiago Toloza","VOL",23,70,["extranjero"]),
  S("Gabriel Pinto","VOL",21,64,["joven"]),
  S("Arnaldo Castillo","DEL",29,76,["extranjero","goleador"]),
  S("Thiago Vecino","DEL",27,74,["extranjero","goleador"]),
  S("Walter Bou","DEL",32,74,["extranjero","préstamo"]),
  S("Bastián Yáñez","DEL",25,70,["velocidad"]),
  S("Ignacio Schor","DEL",26,68,["extranjero"]),
  S("Esteban Moreira","DEL",24,66,["juego aéreo"]),
  S("David Fernández","DEL",20,64,["joven","extranjero"])
];

/* Ñublense · es.wikipedia plantilla 2026. DT Juan José Ribera. Capitán Lorenzo Reyes.
   Cerezo baja a UC: no va. Céspedes llega de Cobresal. Calderón cesión O'Higgins. */
const PLANTEL_NUB_FULL_2026=[
  S("Nicola Pérez","ARQ",36,74,["extranjero","seguro bajo los tres palos"]),
  S("Claudio Chandía","ARQ",19,58,["canterano"]),
  S("Hernán Muñoz","ARQ",38,60,["veterano"]),
  S("Osvaldo Bosso","DEF",32,72,[]),
  S("Felipe Campos","DEF",32,70,[]),
  S("Pablo Calderón","DEF",28,72,["extranjero"]),
  S("Carlos Salomón","DEF",26,66,[]),
  S("Jovany Campusano","DEF",33,70,["lateral ofensivo"]),
  S("Diego Sanhueza","DEF",24,72,["lateral ofensivo"]),
  S("Sebastián Valencia","DEF",26,70,["juego aéreo"]),
  S("Joaquín González","DEF",25,66,[]),
  S("Lorenzo Reyes","VOL",35,74,["capitán","contención"]),
  S("Matías Plaza","VOL",25,76,["creación","asistidor"]),
  S("Manuel Rivera","VOL",30,72,["box-to-box"]),
  S("Gabriel Graciani","VOL",32,72,["extranjero","desequilibrio"]),
  S("Diego Céspedes","VOL",27,70,["contención"]),
  S("Ignacio Tapia","VOL",22,68,["extranjero","joven"]),
  S("Daniel Saavedra","VOL",22,64,[]),
  S("Ignacio Jeraldino","DEL",30,74,["goleador","préstamo"]),
  S("Franco Rami","DEL",23,72,["extranjero","préstamo"]),
  S("Fernando Ovelar","DEL",22,70,["extranjero","joven"]),
  S("Alex Valdés","DEL",24,66,["velocidad"]),
  S("Esteban Calderón","DEL",22,66,["préstamo"]),
  S("Lucas Molina","DEL",20,66,["joven"]),
  S("Giovanny Ávalos","DEL",21,64,["joven"])
];

/* Cobresal · es.wikipedia plantilla 2026. DT Gustavo Huerta. Capitán Tiznado.
   Nadruz baja 2º sem a Sarmiento: no va. Munder se fue a Palestino.
   Villagrán llega de Everton (2º sem). */
const PLANTEL_COB_FULL_2026=[
  S("Jean Cerda","ARQ",23,68,["canterano"]),
  S("Alejandro Santander","ARQ",23,66,[]),
  S("Matías Olguín","ARQ",30,68,[]),
  S("José Tiznado","DEF",32,72,["capitán"]),
  S("Christian Moreno","DEF",30,70,["extranjero"]),
  S("Franco Bechtholdt","DEF",33,70,["extranjero"]),
  S("Juan Fuentes","DEF",31,70,[]),
  S("Antonio Castillo","DEF",27,68,["lateral"]),
  S("Aaron Astudillo","DEF",26,68,["extranjero","lateral"]),
  S("Rodrigo Sandoval","DEF",25,66,[]),
  S("Guillermo Pacheco","DEF",37,64,["veterano","lateral ofensivo"]),
  S("Bryan Carvallo","VOL",29,72,["creación"]),
  S("Esteban Valencia","VOL",27,68,[]),
  S("Felipe Villagrán","VOL",29,68,[]),
  S("Ignacio Pacheco","VOL",22,64,["retorno"]),
  S("Steffan Pino","DEL",32,74,["goleador","préstamo"]),
  S("Julián Brea","DEL",26,74,["extranjero","desequilibrio"]),
  S("César Yanis","DEL",30,70,["extranjero"]),
  S("Franco Frías","DEL",24,70,["extranjero","préstamo"]),
  S("Renato Huerta","DEL",22,68,["préstamo","joven"]),
  S("Janpol Morales","DEL",28,68,["extranjero"])
];

/* Unión La Calera · es.wikipedia plantilla 2026. DT Martín Cicotello. Capitán Sáez.
   Peña se fue a O'Higgins. Campos a Ñublense. */
const PLANTEL_CAL_FULL_2026=[
  S("Nicolás Avellaneda","ARQ",33,72,["extranjero","seguro bajo los tres palos"]),
  S("Nelson Espinoza","ARQ",30,66,[]),
  S("Benjamín Astudillo","ARQ",19,54,["canterano"]),
  S("Daniel Gutiérrez","DEF",23,72,["préstamo"]),
  S("Juan Salomoni","DEF",29,72,["extranjero"]),
  S("Rodrigo Cáseres","DEF",29,70,["extranjero"]),
  S("Nicolás Palma","DEF",24,68,[]),
  S("Cristián Gutiérrez","DEF",29,68,["lateral"]),
  S("Christopher Díaz","DEF",31,68,["lateral"]),
  S("Yonathan Andía","DEF",34,66,["veterano"]),
  S("Vicente Lavín","DEF",23,66,["préstamo"]),
  S("Michael Maturana","DEF",23,62,["canterano"]),
  S("Camilo Moya","VOL",28,70,["contención"]),
  S("Yerko Leiva","VOL",28,70,["creación"]),
  S("Carlo Villanueva","VOL",27,68,[]),
  S("Joan Cruz","VOL",23,68,["préstamo"]),
  S("Rodrigo Pérez","VOL",30,66,["extranjero"]),
  S("Joaquín Soto","VOL",19,58,["canterano"]),
  S("Sebastián Sáez","DEL",41,72,["capitán","goleador","extranjero","veterano"]),
  S("Bayron Oyarzo","DEL",31,70,["velocidad"]),
  S("Kevin Méndez","DEL",30,70,["extranjero","desequilibrio"]),
  S("Matías Campos López","DEL",35,68,["veterano"]),
  S("Francisco Pozzo","DEL",23,66,["extranjero","préstamo"]),
  S("Axel Encinas","DEL",22,64,["extranjero"]),
  S("Martín Hiriart","DEL",21,62,["préstamo","joven"])
];

/* Deportes La Serena · es.wikipedia plantilla 2026. DT Felipe Gutiérrez. Capitán Jeisson Vargas.
   Oroz llega de Colo-Colo. Escalante de Cádiz. Rivera se fue a Ñublense. */
const PLANTEL_LSE_FULL_2026=[
  S("Federico Lanzillotta","ARQ",33,72,["extranjero"]),
  S("Eryin Sanhueza","ARQ",30,68,[]),
  S("Ignacio Sáez","ARQ",21,64,["préstamo","joven"]),
  S("José Tapia","ARQ",24,60,[]),
  S("Lucas Alarcón","DEF",26,72,[]),
  S("Andrés Zanini","DEF",29,70,["extranjero"]),
  S("Joaquín Gutiérrez","DEF",24,72,["lateral ofensivo","préstamo"]),
  S("Bruno Gutiérrez","DEF",24,70,["préstamo"]),
  S("Yahir Salazar","DEF",21,68,["préstamo","joven"]),
  S("Fernando Dinamarca","DEF",23,68,["lateral"]),
  S("Matías Pinto","DEF",22,66,["préstamo"]),
  S("Rafael Delgado","DEF",36,66,["extranjero","veterano"]),
  S("Ian Rasso","DEF",26,66,["extranjero"]),
  S("Francis Mac Allister","VOL",30,72,["extranjero","contención"]),
  S("Gonzalo Escalante","VOL",33,72,["extranjero"]),
  S("Sebastián Díaz","VOL",30,70,["contención"]),
  S("Felipe Chamorro","VOL",25,70,[]),
  S("Matías Marín","VOL",26,68,["préstamo"]),
  S("Joan Orellana","VOL",21,64,["préstamo"]),
  S("Milovan Velásquez","VOL",19,60,["préstamo","joven"]),
  S("Jeisson Vargas","DEL",28,76,["capitán","tiro libre","desequilibrio"]),
  S("Diego Rubio","DEL",33,74,["goleador"]),
  S("Ángelo Henríquez","DEL",32,72,["experiencia"]),
  S("Alexander Oroz","DEL",23,70,["velocidad"]),
  S("Nicolás Stefanelli","DEL",31,68,["extranjero"]),
  S("Gonzalo Figueroa","DEL",26,66,["extranjero","préstamo"]),
  S("Fabricio Díaz","DEL",20,62,["extranjero","joven"])
];

/* Universidad de Concepción · en.wikipedia squad 13 ago 2026. DT Cristián Muñoz.
   Capitán Osvaldo González. Waterman llega de Coquimbo. Funes Mori alta invierno.
   Moisés González llega de O'Higgins. */
const PLANTEL_UDC_FULL_2026=[
  S("Jorge Broun","ARQ",40,74,["extranjero","veterano"]),
  S("José Sanhueza","ARQ",25,68,[]),
  S("Diego Matamala","ARQ",24,64,[]),
  S("Osvaldo González","DEF",41,74,["capitán","ídolo","veterano"]),
  S("Miguel Barbieri","DEF",32,72,["extranjero"]),
  S("David Retamal","DEF",23,70,["préstamo"]),
  S("Bastián Ubal","DEF",24,68,[]),
  S("Yerco Oyanedel","DEF",25,70,["lateral ofensivo"]),
  S("Antonio Díaz","DEF",26,68,["préstamo"]),
  S("Moisés González","DEF",25,68,[]),
  S("Jorge Espejo","DEF",25,66,["lateral"]),
  S("Patricio Romero","DEF",24,64,["préstamo"]),
  S("Esteban Páez","DEF",23,62,[]),
  S("Jeison Fuentealba","VOL",23,74,["creación","préstamo"]),
  S("Facundo Mater","VOL",28,72,["extranjero","préstamo"]),
  S("Pablo Parra","VOL",31,70,["experiencia"]),
  S("Bryan Ogaz","VOL",26,68,["contención"]),
  S("Cristhofer Mesías","VOL",28,66,[]),
  S("Luis Rojas","VOL",24,66,[]),
  S("Harol Salgado","VOL",25,64,["desequilibrio"]),
  S("Cecilio Waterman","DEL",35,76,["extranjero","goleador"]),
  S("Rogelio Funes Mori","DEL",35,74,["extranjero","goleador"]),
  S("Daniel Barrea","DEL",25,70,["extranjero","préstamo"]),
  S("Iam González","DEL",22,66,["préstamo","joven"]),
  S("Cristóbal Zambrano","DEL",23,62,[])
];

(function reg94(){
  if(typeof PLANTELES_REALES!=="object") return;
  var map={
    COQ:PLANTEL_COQ_FULL_2026, AUD:PLANTEL_AUD_FULL_2026, HUA:PLANTEL_HUA_FULL_2026,
    OHI:PLANTEL_OHI_FULL_2026, NUB:PLANTEL_NUB_FULL_2026, COB:PLANTEL_COB_FULL_2026,
    CAL:PLANTEL_CAL_FULL_2026, LSE:PLANTEL_LSE_FULL_2026, UDC:PLANTEL_UDC_FULL_2026
  };
  Object.keys(map).forEach(function(id){
    if(!PLANTELES_REALES[id]) PLANTELES_REALES[id]={};
    PLANTELES_REALES[id][2026]=map[id];
  });

  /* Parches de pases documentados que pisan planteles anteriores. */
  function saca(id, ape){
    var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
    if(!s) return;
    PLANTELES_REALES[id][2026]=s.filter(function(j){ return (j[0]||"").indexOf(ape)<0; });
  }
  function mete(id, fila){
    var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
    if(!s) return;
    if(s.some(function(j){ return (j[0]||"")===fila[0]; })) return;
    s.push(fila);
  }
  saca("LIM","Dylan Escobar");          /* retorno Coquimbo, Anexo COQ 2026 */
  saca("EVE","Felipe Villagrán");       /* alta Cobresal 2º sem */
  saca("BAN","Renzo Malanca");          /* Huachipato, Anexo HUA 2026 */
  mete("IND", S("Maximiliano Gutiérrez","DEL",23,74,["extranjero","proyección"])); /* traspaso HUA */

  if(typeof CLUB_INFO_2026==="object"){
    var dts={
      COQ:"Hernán Caputto", AUD:"Patricio Graff", HUA:"Jaime García",
      OHI:"Lucas Bovaglio", NUB:"Juan José Ribera", COB:"Gustavo Huerta",
      CAL:"Martín Cicotello", LSE:"Felipe Gutiérrez", UDC:"Cristián Muñoz"
    };
    Object.keys(dts).forEach(function(id){
      if(!CLUB_INFO_2026[id]) CLUB_INFO_2026[id]={};
      CLUB_INFO_2026[id].dt=dts[id];
    });
  }
})();

/* ──────── data-planteles-95.js ──────── */
/* ============================================================
   FUTBOLINI 7.95 · resto Primera B 2026 (Wikipedia, sep 2026)
   Fuentes (links):
     ANT https://es.wikipedia.org/wiki/Club_de_Deportes_Antofagasta
     PMO https://es.wikipedia.org/wiki/Club_de_Deportes_Puerto_Montt
     SMA https://es.wikipedia.org/wiki/Club_Deportivo_San_Marcos_de_Arica
     COP https://es.wikipedia.org/wiki/Club_de_Deportes_Copiap%C3%B3
     TEM https://es.wikipedia.org/wiki/Club_de_Deportes_Temuco
     IQQ https://es.wikipedia.org/wiki/Club_de_Deportes_Iquique
     CUR https://es.wikipedia.org/wiki/Curic%C3%B3_Unido
     SCR https://es.wikipedia.org/wiki/Club_de_Deportes_Santa_Cruz
     RAN https://es.wikipedia.org/wiki/Club_Social_de_Deportes_Rangers
   DTs: es.wikipedia.org/wiki/Liga_de_Ascenso_de_Chile_2026
   Stats ESTIMADAS. Cargar DESPUÉS de data-planteles-94.js.
   Fuenzalida: Recoleta → Copiapó (préstamo Audax, 2º sem).
   ============================================================ */

function _pj95(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var S=_pj95;

/* Antofagasta · es.wikipedia plantilla 2026. DT Luis Marcoleta.
   3° de la B a sep 2026. Bandez llega de Puerto Montt. */
const PLANTEL_ANT_FULL_2026=[
  S("Cristóbal Marín","ARQ",22,64,["canterano","proyección"]),
  S("Fernando Hurtado","ARQ",43,62,["veterano"]),
  S("Juan Pablo Cisternas","ARQ",23,58,["canterano"]),
  S("Mathías Suárez","DEF",30,68,["extranjero","juego aéreo"]),
  S("Bastián Tapia","DEF",24,68,["juego aéreo","préstamo"]),
  S("Alex Ibacache","DEF",27,68,["lateral ofensivo"]),
  S("Simón Ramírez","DEF",27,66,["lateral"]),
  S("Cristian Díaz","DEF",23,64,["canterano"]),
  S("Rodrigo Astorga","DEF",22,62,["canterano"]),
  S("Zacarías Abuhadba","DEF",21,62,["proyección"]),
  S("Diego Salvia","DEF",26,62,[]),
  S("Manuel Maluenda","DEF",24,62,[]),
  S("Franko Siegler","DEF",20,58,["canterano"]),
  S("Sebastián Leyton","VOL",33,68,["contención","experiencia"]),
  S("Diego Rojas","VOL",31,68,["enganche"]),
  S("Kevin Campillay","VOL",25,70,["desequilibrio"]),
  S("Adrián Cuadra","VOL",28,64,[]),
  S("Fabián Manzano","VOL",32,62,["contención"]),
  S("Nelson Sepúlveda","VOL",34,62,["veterano"]),
  S("Patricio Castro","VOL",21,58,[]),
  S("Sergio Hinojosa","VOL",21,56,["canterano"]),
  S("Josepablo Monreal","DEL",30,70,["goleador"]),
  S("José Bandez","DEL",26,68,["extranjero","velocidad"]),
  S("Matías Gallegos","DEL",29,66,["extranjero"]),
  S("Brayan Hurtado","DEL",27,64,["extranjero","velocidad"]),
  S("Christian Bravo","DEL",32,64,["veterano"])
];

/* Puerto Montt · es.wikipedia plantilla 2026. DT Emilio Mancilla.
   Nieto llega de Antofagasta. Collao de Audax. */
const PLANTEL_PMO_FULL_2026=[
  S("Gonzalo Collao","ARQ",28,68,[]),
  S("Luis Ureta","ARQ",27,64,[]),
  S("Maximiliano Riveros","DEF",28,66,["juego aéreo"]),
  S("Ariel Morales","DEF",29,64,["extranjero"]),
  S("Byron Nieto","DEF",28,64,["lateral"]),
  S("Francisco Calisto","DEF",22,64,["proyección"]),
  S("Nicolás Mancilla","DEF",32,62,[]),
  S("Kevin Egaña","DEF",30,62,[]),
  S("Jesús Pino","DEF",35,60,["veterano"]),
  S("Juan Jaime","VOL",33,64,["contención","experiencia"]),
  S("Jason Flores","VOL",29,64,["enganche"]),
  S("Gabriel Castillo","VOL",28,64,[]),
  S("Alexis Sabella","VOL",25,64,["extranjero"]),
  S("Cristóbal Vargas","VOL",26,62,[]),
  S("Fabián Espinoza","VOL",28,62,[]),
  S("Danilo Díaz","VOL",24,60,[]),
  S("Richard Paredes","DEL",28,70,["goleador"]),
  S("Reiner Castro","DEL",32,66,["extranjero"]),
  S("Bryan Taiva","DEL",31,64,[]),
  S("Sebastián Pérez","DEL",27,64,["velocidad"]),
  S("Luciano Vázquez","DEL",41,60,["extranjero","veterano"]),
  S("Salvador Negrete","DEL",20,58,["canterano","proyección"])
];

/* San Marcos · es.wikipedia plantilla 2026. DT Iván Sandrock.
   Barboza alta 2º sem (Fénix). Donadell de Coquimbo. */
const PLANTEL_SMA_FULL_2026=[
  S("Rodrigo Saracho","ARQ",32,66,["extranjero"]),
  S("Benjamín Tapia","ARQ",21,62,["proyección"]),
  S("Yerko Águila","DEF",30,64,[]),
  S("Álvaro Cazula","DEF",30,64,["extranjero","juego aéreo"]),
  S("Andrés Barboza","DEF",32,64,["extranjero"]),
  S("Augusto Barrios","DEF",34,62,["veterano"]),
  S("Guillermo Cubillos","DEF",31,62,[]),
  S("Cristóbal Guerra","DEF",25,62,[]),
  S("Nicolás Aguirre","DEF",36,60,["extranjero","veterano"]),
  S("Reiner Campos","DEF",22,58,["canterano"]),
  S("Mauricio Iturra","VOL",29,64,["contención"]),
  S("Nahuel Donadell","VOL",35,64,["extranjero","desequilibrio"]),
  S("Boris Sagredo","VOL",37,62,["enganche","veterano"]),
  S("Javier Rivera","VOL",26,62,[]),
  S("Agustín Maidana","VOL",24,60,["extranjero"]),
  S("Camilo Rencoret","VOL",35,60,["capitán","contención","veterano"]),
  S("Nicolás Orrego","VOL",24,58,[]),
  S("Camilo Melivilú","DEL",33,66,["goleador"]),
  S("Bairon Monroy","DEL",26,66,[]),
  S("Gonzalo Reyes","DEL",31,64,["velocidad"]),
  S("Nicolás Zedán","DEL",26,64,[]),
  S("Alfredo Ábalos","DEL",40,60,["extranjero","veterano"])
];

/* Copiapó · es.wikipedia plantilla 2026. DT Erwin Durán (Wiki Liga de Ascenso).
   Temperini de San Marcos. Palacios de Audax. Fuenzalida préstamo 2º sem. */
const PLANTEL_COP_FULL_2026=[
  S("Nicolás Temperini","ARQ",31,66,["extranjero"]),
  S("Richard Leyton","ARQ",39,58,["veterano"]),
  S("Benjamín Arce","ARQ",20,54,["canterano"]),
  S("Marcelo Filla","DEF",28,64,[]),
  S("Fabián Torres","DEF",37,62,["veterano"]),
  S("John Santander","DEF",32,62,[]),
  S("Salvador Sánchez","DEF",31,62,["extranjero"]),
  S("Nozomi Kimura","DEF",29,62,["préstamo"]),
  S("Agustín Ortiz","DEF",27,62,[]),
  S("Diego Opazo","DEF",35,58,["veterano"]),
  S("Nicolás Suárez","DEF",21,58,["joven"]),
  S("Axl Ríos","VOL",27,64,["contención"]),
  S("Claudio Zamorano","VOL",27,64,[]),
  S("Iván Ledezma","VOL",31,62,[]),
  S("Gastón Pérez","VOL",26,62,["extranjero"]),
  S("Enzo Fernández","VOL",24,60,[]),
  S("Lautaro Palacios","DEL",31,68,["extranjero","goleador"]),
  S("Carlos Ross","DEL",35,64,["velocidad","veterano"]),
  S("Manuel López","DEL",30,62,[]),
  S("Damián Sáez","DEL",25,62,[]),
  S("Ignacio Fuenzalida","DEL",24,62,["préstamo"]),
  S("John Valladares","DEL",23,60,[])
];

/* Temuco · es.wikipedia plantilla 2026. DT Emiliano Astorga.
   Huanca  de Huachipato. Buonanotte. Urra. */
const PLANTEL_TEM_FULL_2026=[
  S("Yerko Urra","ARQ",30,66,[]),
  S("Juan José Garrido","ARQ",23,58,["canterano"]),
  S("Franco Quijada","ARQ",19,52,["canterano"]),
  S("Luis Casanova","DEF",34,64,["juego aéreo"]),
  S("Enzo Lettieri","DEF",28,64,["extranjero"]),
  S("Brian Torrealba","DEF",29,62,[]),
  S("Diego Zambrano","DEF",28,62,[]),
  S("Miguel Sanhueza","DEF",35,62,["veterano"]),
  S("Rodrigo González","DEF",30,62,[]),
  S("Franco Ortega","DEF",30,60,[]),
  S("Frank Valenzuela","DEF",24,58,["canterano"]),
  S("Diego Buonanotte","VOL",38,66,["extranjero","enganche","veterano"]),
  S("Camilo Núñez","VOL",32,64,["extranjero"]),
  S("Nicolás Astete","VOL",33,62,[]),
  S("Brayan Valdivia","VOL",32,60,[]),
  S("Brayan Troncoso","VOL",25,60,[]),
  S("César Huanca","DEL",25,70,["goleador"]),
  S("Luis Acevedo","DEL",29,66,["extranjero"]),
  S("Nicolás Rivera","DEL",28,64,[]),
  S("Felipe Reynero","DEL",37,62,["velocidad","veterano"]),
  S("Sebastián Molina","DEL",25,62,[]),
  S("Diego Sánchez","DEL",27,62,["extranjero"])
];

/* Iquique · es.wikipedia plantilla 2026. DT Hernán Peña.
   Descendió 2025. Ramos e ídolo Puch. López de Huachipato. */
const PLANTEL_IQQ_FULL_2026=[
  S("Daniel Castillo","ARQ",35,66,["veterano"]),
  S("Zacarías López","ARQ",28,66,[]),
  S("Henry Binimelis","ARQ",19,54,["canterano"]),
  S("Mario López","DEF",31,64,["extranjero"]),
  S("Franco Ledesma","DEF",33,64,["extranjero"]),
  S("Vicente Concha","DEF",24,64,[]),
  S("Felipe Espinoza","DEF",26,64,[]),
  S("Jorge Ayala","DEF",30,62,["extranjero"]),
  S("Dilan Rojas","DEF",22,62,["canterano"]),
  S("Simón Contreras","DEF",24,62,[]),
  S("Matías Blázquez","DEF",35,60,["veterano"]),
  S("Brayan Garrido","VOL",27,66,["contención"]),
  S("Joaquín Pereyra","VOL",32,64,["extranjero"]),
  S("Diego Orellana","VOL",33,62,[]),
  S("Agustín Venezia","VOL",23,62,["extranjero"]),
  S("Álvaro Ramos","DEL",34,70,["ídolo","de la casa"]),
  S("Edson Puch","DEL",40,66,["ídolo","desequilibrio","veterano"]),
  S("Isaac Díaz","DEL",36,64,["juego aéreo","veterano"]),
  S("César González","DEL",29,64,[]),
  S("Thomas Jones","DEL",28,64,[]),
  S("Dylan Arias","DEL",19,56,["canterano","proyección"])
];

/* Curicó Unido · es.wikipedia plantilla 2026. DT Damián Muñoz.
   Benegas de La Calera. Colombo. Tello. */
const PLANTEL_CUR_FULL_2026=[
  S("Damián Tello","ARQ",30,64,["extranjero"]),
  S("Thomas Vergara","ARQ",23,58,["canterano"]),
  S("Juan Ruz","ARQ",22,54,["canterano"]),
  S("Rodrigo Colombo","DEF",33,64,["extranjero","juego aéreo"]),
  S("Henry Sanhueza","DEF",30,64,[]),
  S("Ronald de la Fuente","DEF",35,62,["veterano"]),
  S("Gabriel Sarria","DEF",26,62,[]),
  S("Francisco Oliver","DEF",31,62,["extranjero"]),
  S("Cristopher Medina","DEF",25,62,["préstamo"]),
  S("Enzo Ormeño","DEF",26,60,[]),
  S("Juan Pablo Gómez","DEF",35,60,["veterano"]),
  S("Joaquín Romo","VOL",27,64,["enganche"]),
  S("Braulio Guisolfo","VOL",24,64,["extranjero","proyección"]),
  S("Bruno Veglio","VOL",28,62,["extranjero"]),
  S("Javier Retamales","VOL",29,62,[]),
  S("Benjamín Inostroza","VOL",29,62,[]),
  S("Leandro Benegas","DEL",37,66,["goleador","veterano"]),
  S("Nicolás Fernández","DEL",27,64,["extranjero"]),
  S("Ian Aliaga","DEL",24,62,["proyección"]),
  S("Mauro Lópes","DEL",29,62,[]),
  S("Antonio Ramírez","DEL",27,58,[])
];

/* Santa Cruz · es.wikipedia plantilla 2026. DT Dalcio Giovagnoli.
   Zeineddin gol a Iquique 9 sep. Pinto de Rangers. Islame 2º sem. */
const PLANTEL_SCR_FULL_2026=[
  S("Juan Dobboletta","ARQ",33,62,["extranjero"]),
  S("Maximiliano Henríquez","ARQ",20,54,["canterano"]),
  S("Braian Camisassa","DEF",29,64,["extranjero"]),
  S("Hardy Cavero","DEF",30,62,[]),
  S("Felipe Alvarado","DEF",27,60,[]),
  S("Esteban Flores","DEF",34,60,["veterano"]),
  S("David Tati","DEF",24,58,[]),
  S("Gino Alucema","VOL",34,62,["contención","veterano"]),
  S("Diego Acevedo","VOL",25,62,[]),
  S("Santiago Mederos","VOL",28,62,["extranjero"]),
  S("Hugo Herrera","VOL",28,60,[]),
  S("Diego Plaza","VOL",23,60,[]),
  S("Felipe Orellana","VOL",25,58,[]),
  S("Diego Arias","DEL",26,66,["goleador"]),
  S("Mathías Pinto","DEL",28,64,[]),
  S("Nadir Zeineddin","DEL",26,64,["extranjero"]),
  S("Yashir Islame","DEL",35,62,["veterano"]),
  S("Juan Delgado","DEL",33,62,[]),
  S("Nicolás Barrios","DEL",22,60,["velocidad","proyección"]),
  S("Cristian Pardo","DEL",23,58,[])
];

/* Rangers · es.wikipedia plantilla 2026. DT Ivo Basay.
   Colista a sep 2026. Campestrini. Arias de Aldosivi. Méndez de Calera. */
const PLANTEL_RAN_FULL_2026=[
  S("Cristian Campestrini","ARQ",46,62,["extranjero","veterano"]),
  S("Fabián Cerda","ARQ",37,60,["veterano"]),
  S("Martín Torres","ARQ",21,54,["canterano"]),
  S("Carlos Labrín","DEF",35,64,["experiencia"]),
  S("Kevin Vásquez","DEF",29,62,[]),
  S("Claudio Servetti","DEF",31,62,["extranjero"]),
  S("José Navarrete","DEF",28,60,[]),
  S("Lautaro Rigazzi","DEF",28,60,["extranjero"]),
  S("Sebastián Silva","DEF",35,60,["veterano"]),
  S("Matías Cortés","DEF",23,58,["préstamo"]),
  S("Juan Méndez","VOL",30,66,["contención"]),
  S("Alejandro Márquez","VOL",34,64,[]),
  S("Iván Rozas","VOL",28,62,[]),
  S("Alonso Rodríguez","VOL",28,60,[]),
  S("Gary Moya","VOL",24,58,[]),
  S("Diego Plaza","VOL",25,58,[]),
  S("Junior Arias","DEL",33,66,["extranjero","goleador"]),
  S("Ignacio Mesías","DEL",25,64,["préstamo"]),
  S("Ignacio Ibáñez","DEL",38,62,["veterano"]),
  S("Damián González","DEL",33,60,[]),
  S("Manuel Vicuña","DEL",26,60,[])
];

(function reg95(){
  if(typeof PLANTELES_REALES!=="object") return;
  var map={
    ANT:PLANTEL_ANT_FULL_2026, PMO:PLANTEL_PMO_FULL_2026, SMA:PLANTEL_SMA_FULL_2026,
    COP:PLANTEL_COP_FULL_2026, TEM:PLANTEL_TEM_FULL_2026, IQQ:PLANTEL_IQQ_FULL_2026,
    CUR:PLANTEL_CUR_FULL_2026, SCR:PLANTEL_SCR_FULL_2026, RAN:PLANTEL_RAN_FULL_2026
  };
  Object.keys(map).forEach(function(id){
    if(!PLANTELES_REALES[id]) PLANTELES_REALES[id]={};
    PLANTELES_REALES[id][2026]=map[id];
  });

  function saca(id, ape){
    var s=PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
    if(!s) return;
    PLANTELES_REALES[id][2026]=s.filter(function(j){ return (j[0]||"").indexOf(ape)<0; });
  }
  saca("REC","Ignacio Fuenzalida");  /* préstamo Copiapó 2º sem (Wiki COP) */

  if(typeof CLUB_INFO_2026==="object"){
    var dts={
      ANT:"Luis Marcoleta", PMO:"Emilio Mancilla", SMA:"Iván Sandrock",
      COP:"Erwin Durán", TEM:"Emiliano Astorga", IQQ:"Hernán Peña",
      CUR:"Damián Muñoz", SCR:"Dalcio Giovagnoli", RAN:"Ivo Basay"
    };
    Object.keys(dts).forEach(function(id){
      if(!CLUB_INFO_2026[id]) CLUB_INFO_2026[id]={};
      CLUB_INFO_2026[id].dt=dts[id];
    });
  }
})();

/* 7.99955 · 11 DTs AFA que faltaban. Hechos públicos a 16–17 sep 2026.
   Protocolo Claude: fuente + fecha. No se inventa dirigente.
     RAC  Juan Pablo Vojvoda     TyC 16 sep 2026 (ensayo vs Sarmiento) + La Nación 14 sep
     ELP  Alexander Medina       TN 12 sep 2026 (vs Platense) + estudiantesdelaplata.com 23 feb
     TAL  Omar De Felippe        La Voz 16 sep 2026 + Infobae 1 sep (reemplazó a Sampaoli)
     ARG  Nicolás Diez           es.wikipedia plantel 15 sep 2026 (último partido 13 sep)
     BEL  Ricardo Zielinski      TN 13 sep 2026 (vs Sarmiento)
     DYJ  Julio Vaccari          es.wikipedia 13 sep 2026 (ciclo desde 24 may) + sitio oficial
     INS  Diego Flores           TN 14 sep 2026 (vs Estudiantes RC) + Perfil 5 sep
     PLA  Martín Palermo         Olé 15 sep 2026 (Libertadores vs Flu) + TN 12 sep
     ALD  Javier Sanguinetti     TyC 10 sep 2026 (1ª victoria) + TN 12 sep vs Independiente Mza
     GME  Darío Franco           La Nación 11 sep 2026 + TN 5 sep (vs Boca)
     ERC  Rubén Forestello       La Voz 15 sep 2026 (vs Instituto) */
(function dtsAfa11(){
  if(typeof CLUB_INFO_2026!=="object") return;
  var dts={
    RAC:"Juan Pablo Vojvoda",
    ELP:"Alexander Medina",
    TAL:"Omar De Felippe",
    ARG:"Nicolás Diez",
    BEL:"Ricardo Zielinski",
    DYJ:"Julio Vaccari",
    INS:"Diego Flores",
    PLA:"Martín Palermo",
    ALD:"Javier Sanguinetti",
    GME:"Darío Franco",
    ERC:"Rubén Forestello"
  };
  Object.keys(dts).forEach(function(id){
    if(CLUB_INFO_2026[id]) CLUB_INFO_2026[id].dt=dts[id];
  });
})();