"use strict";
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
