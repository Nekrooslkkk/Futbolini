"use strict";
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
