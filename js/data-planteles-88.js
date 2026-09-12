"use strict";
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
