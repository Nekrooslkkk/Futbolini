"use strict";
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
