"use strict";
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
