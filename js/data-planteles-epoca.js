"use strict";
/* ============================================================
   FUTBOLINI · data-planteles-epoca.js
   Planteles de otras épocas (ex 99 + 800–802). UN archivo para pegar.
   Molde igual. Registrar PLANTELES_REALES[id][anio].
   Nombres reales. Stats ESTIMADAS. No inventar.
   Cargar DESPUÉS de data-caza-98.js.
   ============================================================ */

/* ──────── data-planteles-99.js ──────── */
/* ============================================================
   FUTBOLINI 7.99 · rigor vs Colo-Colo (Wikipedia / ASIFUCH / BDFA)
   El listón: CC 2026 tiene 24 nombres, 3 ARQ, capitán, ídolo,
   0 rasgos vacíos y planteles jugables 1989/1991/2002/2006.
   Acá se empatan huecos verificados — no se inventa nadie.

   Fuentes:
     UC  https://en.wikipedia.org/wiki/2026_Club_Deportivo_Universidad_Católica_season
         + Template:Universidad Católica squad (14 ago 2026)
     UES https://es.wikipedia.org/wiki/Anexo:Temporada_2013_de_Unión_Española
         + BDFA plantel campeón Transición 2013
     SW  ASIFUCH «Santiago Wanderers campeón 2001» + Memoria Wanderers
   Stats ESTIMADAS. Cargar ÚLTIMO (después de data-caza-98.js).
   Assadi no va (AIK, 21 ago). Giani es DEL (wiki season, no VOL).
   ============================================================ */

function _pj99(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var S=_pj99;

function _idx99(sq, nom){
  if(!sq) return -1;
  var i;
  for(i=0;i<sq.length;i++) if(sq[i][0]===nom) return i;
  return -1;
}
function _ras99(id, nom, ras, anio){
  var sq=typeof PLANTELES_REALES==="object" && PLANTELES_REALES[id] && PLANTELES_REALES[id][anio||2026];
  var i=_idx99(sq, nom);
  if(i<0) return;
  var r=sq[i][7]||[];
  if(r.indexOf(ras)<0) sq[i][7]=r.concat([ras]);
}
function _pos99(id, nom, pos){
  var sq=typeof PLANTELES_REALES==="object" && PLANTELES_REALES[id] && PLANTELES_REALES[id][2026];
  var i=_idx99(sq, nom);
  if(i>=0) sq[i][1]=pos;
}
function _mete99(id, anio, j){
  if(typeof PLANTELES_REALES!=="object") return;
  if(!PLANTELES_REALES[id]) PLANTELES_REALES[id]={};
  if(!PLANTELES_REALES[id][anio]) PLANTELES_REALES[id][anio]=[];
  if(_idx99(PLANTELES_REALES[id][anio], j[0])<0) PLANTELES_REALES[id][anio].push(j);
}

/* Unión Española · Transición 2013 · DT José Luis Sierra.
   Edades de 2013. Ampuero capitán histórico; Villagra ídolo de Santa Laura.
   Cueva figura en el plantel campeón BDFA. */
const PLANTEL_UES_2013=[
  S("Raúl Olivares","ARQ",25,74,["préstamo"]),
  S("Diego Sánchez","ARQ",26,78,["seguro bajo los tres palos"]),
  S("Cristian Guerra","ARQ",19,60,["canterano","joven"]),
  S("Jorge Ampuero","DEF",26,80,["capitán","ídolo","juego aéreo"]),
  S("Nicolás Berardo","DEF",23,76,["extranjero","lateral"]),
  S("Luis Casanova","DEF",21,72,["proyección"]),
  S("Mario Larenas","DEF",20,70,["canterano","lateral"]),
  S("Matías Navarrete","DEF",21,70,["canterano"]),
  S("Nicolás Mancilla","DEF",20,66,["canterano"]),
  S("Enzo Ruiz","DEF",24,68,["extranjero"]),
  S("Dagoberto Currimilla","VOL",26,74,["pulmón"]),
  S("Gonzalo Villagra","VOL",32,80,["ídolo","contención"]),
  S("Diego Scotti","VOL",36,74,["veterano","extranjero"]),
  S("Luis Pavez","VOL",25,72,["orden"]),
  S("Óscar Hernández","VOL",19,68,["canterano","proyección"]),
  S("Matías Abelairas","VOL",28,74,["extranjero","desequilibrio"]),
  S("Christian Cueva","VOL",22,80,["extranjero","desequilibrio"]),
  S("Dante Martínez","VOL",19,62,["canterano"]),
  S("Patricio Rubio","DEL",24,80,["goleador"]),
  S("Francisco Castro","DEL",21,74,["velocidad"]),
  S("Gustavo Canales","DEL",31,82,["goleador","extranjero"]),
  S("Sebastián Jaime","DEL",26,78,["goleador"]),
  S("Fabián Saavedra","DEL",21,70,["canterano","velocidad"])
];

/* Santiago Wanderers · campeón Nacional 2001 · DT Jorge Garcés.
   Plantel ASIFUCH / Memoria Wanderers. Edades de 2001.
   Silvio Fernández 17 goles. Riveros eje. Villarroel ídolo caturro. */
const PLANTEL_SW_2001=[
  S("Carlos Toro","ARQ",25,80,["seguro bajo los tres palos"]),
  S("Alex Varas","ARQ",25,76,["reflejos"]),
  S("Rodrigo Naranjo","ARQ",22,62,["recambio"]),
  S("Rodrigo Barra","DEF",26,76,["marca"]),
  S("Héctor Robles","DEF",30,80,["juego aéreo","líder"]),
  S("Manuel Valencia","DEF",30,76,["extranjero","marca"]),
  S("Renato Garrido","DEF",27,74,["lateral"]),
  S("Mauricio Rojas","DEF",23,74,["lateral ofensivo"]),
  S("Ronny Vergara","DEF",26,66,["recambio"]),
  S("Moisés Villarroel","VOL",25,80,["ídolo","canterano","contención"]),
  S("Arturo Sanhueza","VOL",23,78,["contención"]),
  S("Jaime Riveros","VOL",31,84,["cerebro","desequilibrio","ídolo"]),
  S("Jorge Ormeño","VOL",24,76,["contención"]),
  S("Rodrigo Núñez","VOL",24,74,["pulmón"]),
  S("Alonzo Zúñiga","VOL",21,70,["joven","polivalente"]),
  S("Rodrigo Valenzuela","VOL",26,72,["desequilibrio"]),
  S("Silvio Fernández","DEL",27,84,["goleador","extranjero"]),
  S("Joel Soto","DEL",19,74,["joven","canterano","proyección"]),
  S("Darío Scotto","DEL",32,74,["extranjero","veterano"]),
  S("Emiliano Romay","DEL",24,70,["extranjero"]),
  S("Mario Galleguillos","DEL",24,66,["recambio"])
];

(function reg99(){
  if(typeof PLANTELES_REALES!=="object") return;

  /* UC 2026 · wiki 14 ago / 11 sep: Giani es delantero; faltaban Gómez, Corral, L'Huillier. */
  _pos99("UC","Justo Giani","DEL");
  _ras99("UC","Justo Giani","goleador");
  _mete99("UC",2026, S("Martín Gómez","VOL",20,68,["extranjero","préstamo","joven"]));
  _mete99("UC",2026, S("Diego Corral","VOL",25,72,["canterano","llegador"]));
  _mete99("UC",2026, S("Nicolás L'Huillier","DEF",21,66,["canterano"]));
  _ras99("UC","Francisco Valdés","canterano");
  _ras99("UC","Tomás Asta-Buruaga","recambio");
  _ras99("UC","Bernardo Cerezo","marca");
  _ras99("UC","Jimmy Martínez","box-to-box");
  _ras99("UC","Diego Valencia","definición");

  /* Stub viejo de data-plantel.js: Assadi vendido a AIK 21 ago. */
  if(PLANTELES_REALES.UCH && PLANTELES_REALES.UCH[2026]){
    PLANTELES_REALES.UCH[2026]=PLANTELES_REALES.UCH[2026].filter(function(j){ return j[0]!=="Lucas Assadi"; });
  }

  PLANTELES_REALES.UES=PLANTELES_REALES.UES||{};
  PLANTELES_REALES.UES[2013]=PLANTEL_UES_2013;
  PLANTELES_REALES.SW=PLANTELES_REALES.SW||{};
  PLANTELES_REALES.SW[2001]=PLANTEL_SW_2001;

  /* Rasgo mínimo (edad) donde el array venía vacío: igual que CC, nadie queda mudo. */
  Object.keys(PLANTELES_REALES).forEach(function(id){
    var sq=PLANTELES_REALES[id][2026];
    if(!sq) return;
    sq.forEach(function(j){
      var r=j[7];
      if(!r) j[7]=r=[];
      if(r.length) return;
      if(j[2]>=35) r.push("veterano");
      else if(j[2]<=21) r.push("joven");
      else if(j[1]==="ARQ") r.push("recambio");
    });
  });
})();

(function epocas99(){
  if(typeof EPOCAS_CLUB!=="object") return;
  function attach(id, anio, squad, extra){
    var cur=EPOCAS_CLUB[id]||[];
    var i, ep=null;
    for(i=0;i<cur.length;i++) if(cur[i].anio===anio){ ep=cur[i]; break; }
    if(!ep){
      ep={anio:anio};
      cur.push(ep);
      EPOCAS_CLUB[id]=cur;
    }
    ep.squad=squad;
    if(extra) Object.keys(extra).forEach(function(k){ if(!ep[k]) ep[k]=extra[k]; });
  }
  attach("UES",2013,"PLANTEL_UES_2013",{
    etq:"2013 · Transición",
    desc:"Campeón del Transición 2013 con José Luis Sierra. 1-0 a Colo-Colo en la última. Ampuero, Villagra, Canales, Cueva. Fuente: es.wikipedia.org/wiki/Anexo:Temporada_2013_de_Unión_Española",
    dt:"José Luis Sierra"
  });
  attach("SW",2001,"PLANTEL_SW_2001",{
    etq:"2001 · Tercera estrella",
    desc:"Campeón nacional 2001 con Jorge Garcés. 4-2 a Audax en el Nacional (50 mil). Silvio Fernández 17 goles, Riveros, Villarroel. Fuente: ASIFUCH / Memoria Wanderers.",
    dt:"Jorge Garcés"
  });
})();

(function hist99(){
  if(typeof HISTORIA_LINEA!=="object") return;
  function pushH(id, item){
    if(!HISTORIA_LINEA[id]) HISTORIA_LINEA[id]=[];
    if(HISTORIA_LINEA[id].some(function(h){ return h.anio===item.anio && h.hito===item.hito; })) return;
    var i=HISTORIA_LINEA[id].length, k;
    for(k=0;k<HISTORIA_LINEA[id].length;k++){ if(HISTORIA_LINEA[id][k].hito==="Hoy"){ i=k; break; } }
    HISTORIA_LINEA[id].splice(i,0,item);
  }
  pushH("UES",{anio:2013,hito:"Transición",txt:"Campeón del Torneo de Transición 2013. José Luis Sierra. 1-0 a Colo-Colo en la última fecha. Séptima estrella."});
  pushH("SW",{anio:2001,hito:"Tercera estrella",txt:"Campeón nacional 2001 con Jorge Garcés. 4-2 a Audax Italiano en el Nacional. 33 años de espera."});
  /* Fuente canónica 7.83: El Llano, no Macul. data-superprompt-83 ya pisa; se refuerza. */
  if(HISTORIA_LINEA.CC){
    HISTORIA_LINEA.CC.forEach(function(h){
      if(h.anio===1925 && /Macul|fusión de clubes escolares/.test(h.txt||"")){
        h.txt="19 de abril de 1925, Estadio El Llano (San Miguel). Escisión de Magallanes: «Ancha es la puerta». David Arellano capitán.";
      }
    });
  }
})();

/* ──────── data-planteles-800.js ──────── */
/* ============================================================
   FUTBOLINI 8.00 · rigor vs Colo-Colo (épocas jugables con nombres)
   El listón: CC 1991 tiene 24 fichas, 3 ARQ, capitán, ídolo, 0 rasgos
   vacíos. La U 1994 venía con 8 nombres (el resto era cantera).
   Boca 2007 / River 2018 decían "Plantel: cantera".

   Fuentes:
     UCH 1994  BDFA plantel campeón + es.wikipedia.org/wiki/Club_Universidad_de_Chile
               (XI vs Cobresal 18 dic, El Salvador) + Transfermarkt 1994
               + ASIFUCH (Salas 41 goles). DT Jorge Socías.
     BOC 2007  es.wikipedia.org/wiki/Anexo:Temporada_2006-07_del_Club_Atlético_Boca_Juniors
               + 2007 Copa Libertadores finals (Caranta, Riquelme, Palermo).
               DT Miguel Ángel Russo. Barros Schelotto sale en abril: no va.
     RIV 2018  TyC lista de buena fe Libertadores + ESPN 26 feb 2018
               + 90min once de Madrid. DT Marcelo Gallardo.
   Stats ESTIMADAS. Cargar ÚLTIMO (después de data-planteles-99.js).
   No se inventa nadie. Guarda (dopaje, fecha 7) no entra.
   ============================================================ */

function _pj800(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var S=_pj800;

/* Universidad de Chile · campeón Nacional 1994 · DT Jorge Socías.
   25 años de sequía. 1-1 a Cobresal en El Salvador; penal de Mardones.
   Musrri levantó la copa. Salas 27 goles en el Nacional (41 en la temporada).
   Edades de 1994. */
const PLANTEL_UCH_1994_FULL=[
  S("Sergio Vargas","ARQ",27,86,["ídolo","seguro bajo los tres palos","selección"]),
  S("Nelson Cossio","ARQ",26,72,["recambio"]),
  S("Leonardo Zamora","ARQ",18,58,["joven","canterano"]),
  S("Cristián Castañeda","DEF",24,80,["lateral ofensivo","temperamento"]),
  S("Ronald Fuentes","DEF",25,82,["marca","salida limpia"]),
  S("Rogelio Delgado","DEF",33,80,["extranjero","veterano","liderazgo"]),
  S("Fabián Guevara","DEF",26,78,["lateral","marca"]),
  S("Luis Abarca","DEF",27,74,["marca"]),
  S("Cristián Romero","DEF",29,72,["lateral","recambio"]),
  S("Gabriel Galindo","DEF",21,66,["joven","canterano"]),
  S("Luis Musrri","VOL",24,84,["capitán","pulmón","ídolo"]),
  S("Patricio Mardones","VOL",30,80,["penales","experiencia","veterano"]),
  S("Víctor Hugo Castañeda","VOL",30,80,["pegada","tiro libre"]),
  S("Raúl Aredes","VOL",27,82,["extranjero","desequilibrio","enganche"]),
  S("Esteban Valencia","VOL",22,78,["joven","desequilibrio"]),
  S("Cristián Mora","VOL",24,72,["contención"]),
  S("David Reyes","VOL",18,60,["joven","canterano"]),
  S("Marcelo Salas","DEL",19,88,["joven","goleador","killer","proyección europea"]),
  S("Juan Carlos Ibáñez","DEL",25,78,["extranjero","juego aéreo"]),
  S("Rodrigo Goldberg","DEL",22,74,["joven","definición"]),
  S("Marcelo Jara","DEL",21,70,["joven","recambio"])
];

/* Boca Juniors · campeón Copa Libertadores 2007 vs Grêmio (5-0 global).
   DT Miguel Ángel Russo. Riquelme 8 goles (goleador xeneize). Palermo capitán.
   Edades de 2007. Barros Schelotto se fue el 17 abr: no está en la final. */
const PLANTEL_BOC_2007=[
  S("Mauricio Caranta","ARQ",28,82,["seguro bajo los tres palos"]),
  S("Aldo Bobadilla","ARQ",31,76,["extranjero","experiencia"]),
  S("Pablo Migliore","ARQ",25,70,["recambio"]),
  S("Hugo Ibarra","DEF",33,82,["ídolo","lateral","veterano"]),
  S("Daniel Díaz","DEF",27,84,["marca","juego aéreo"]),
  S("Claudio Morel Rodríguez","DEF",29,80,["extranjero","marca"]),
  S("Clemente Rodríguez","DEF",25,80,["lateral ofensivo"]),
  S("Matías Silvestre","DEF",22,74,["joven","proyección"]),
  S("Jonatan Maidana","DEF",21,70,["joven","marca"]),
  S("Pablo Cahais","DEF",19,64,["joven","canterano"]),
  S("Juan Román Riquelme","VOL",28,92,["ídolo","cerebro","tiro libre"]),
  S("Sebastián Battaglia","VOL",26,82,["contención","ídolo"]),
  S("Pablo Ledesma","VOL",22,78,["pulmón","box-to-box"]),
  S("Neri Cardozo","VOL",21,78,["joven","desequilibrio"]),
  S("Éver Banega","VOL",18,76,["joven","proyección europea"]),
  S("Jesús Dátolo","VOL",23,74,["desequilibrio"]),
  S("Guillermo Marino","VOL",26,72,["recambio"]),
  S("Sergio Órteman","VOL",29,70,["extranjero","oficio"]),
  S("Martín Palermo","DEL",33,86,["capitán","ídolo","goleador","veterano"]),
  S("Rodrigo Palacio","DEL",25,84,["goleador","velocidad"]),
  S("Mauro Boselli","DEL",22,72,["joven","definición"]),
  S("Bruno Marioni","DEL",31,74,["extranjero","recambio"])
];

/* River Plate · campeón Copa Libertadores 2018 vs Boca (Madrid).
   DT Marcelo Gallardo. Ponzio capitán. Pratto gol en Madrid.
   Lista de buena fe TyC/ESPN. Edades de diciembre 2018. */
const PLANTEL_RIV_2018=[
  S("Franco Armani","ARQ",32,88,["ídolo","seguro bajo los tres palos"]),
  S("Germán Lux","ARQ",36,72,["veterano","ídolo"]),
  S("Enrique Bologna","ARQ",36,68,["veterano","recambio"]),
  S("Jonatan Maidana","DEF",33,82,["ídolo","marca","juego aéreo"]),
  S("Javier Pinola","DEF",35,80,["veterano","liderazgo"]),
  S("Gonzalo Montiel","DEF",21,82,["joven","lateral","proyección europea"]),
  S("Milton Casco","DEF",30,78,["lateral"]),
  S("Lucas Martínez Quarta","DEF",22,76,["joven","proyección"]),
  S("Camilo Mayada","DEF",27,74,["extranjero","polivalente"]),
  S("Jorge Moreira","DEF",28,72,["extranjero","lateral"]),
  S("Luciano Lollo","DEF",31,70,["recambio"]),
  S("Leonardo Ponzio","VOL",36,82,["capitán","ídolo","contención","veterano"]),
  S("Enzo Pérez","VOL",32,84,["contención","pulmón"]),
  S("Ignacio Fernández","VOL",28,82,["llegador","desequilibrio"]),
  S("Gonzalo Martínez","VOL",25,86,["ídolo","desequilibrio","gambeta"]),
  S("Juan Fernando Quintero","VOL",25,84,["extranjero","enganche","tiro libre"]),
  S("Exequiel Palacios","VOL",20,76,["joven","proyección europea"]),
  S("Nicolás De La Cruz","VOL",21,76,["extranjero","joven","desequilibrio"]),
  S("Bruno Zuculini","VOL",25,72,["contención","recambio"]),
  S("Lucas Pratto","DEL",30,84,["goleador","juego aéreo"]),
  S("Rafael Santos Borré","DEL",23,80,["extranjero","goleador"]),
  S("Ignacio Scocco","DEL",33,78,["goleador","veterano"]),
  S("Rodrigo Mora","DEL",31,74,["extranjero","recambio"]),
  S("Julián Álvarez","DEL",18,70,["joven","canterano","proyección"])
];

(function reg800(){
  if(typeof PLANTELES_REALES!=="object") return;
  PLANTELES_REALES.UCH=PLANTELES_REALES.UCH||{};
  PLANTELES_REALES.UCH[1994]=PLANTEL_UCH_1994_FULL;
  PLANTELES_REALES.BOC=PLANTELES_REALES.BOC||{};
  PLANTELES_REALES.BOC[2007]=PLANTEL_BOC_2007;
  PLANTELES_REALES.RIV=PLANTELES_REALES.RIV||{};
  PLANTELES_REALES.RIV[2018]=PLANTEL_RIV_2018;
})();

(function epocas800(){
  if(typeof EPOCAS_CLUB!=="object") return;
  function attach(id, anio, squad, extra){
    var cur=EPOCAS_CLUB[id]||[];
    var i, ep=null;
    for(i=0;i<cur.length;i++) if(cur[i].anio===anio){ ep=cur[i]; break; }
    if(!ep){
      ep={anio:anio};
      cur.push(ep);
      EPOCAS_CLUB[id]=cur;
    }
    ep.squad=squad;
    if(extra) Object.keys(extra).forEach(function(k){ ep[k]=extra[k]; });
  }
  attach("UCH",1994,"PLANTEL_UCH_1994_FULL",{
    etq:"1994 · Fin de la sequía",
    desc:"Campeón nacional 1994 con Jorge Socías. 25 años sin títulos. 1-1 a Cobresal en El Salvador (penal de Mardones). Salas 27 goles. Musrri capitán. Fuente: BDFA / Wikipedia.",
    dt:"Jorge Socías",
    ind:{plantel:82,moral:88,hinchada:90,socios:58,cantera:62,estadio:42,prestigio:84,riesgo:18},
    caja:{plata:280,deuda:220}
  });
  attach("BOC",2007,"PLANTEL_BOC_2007",{
    etq:"2007 · Libertadores",
    desc:"Boca campeón de América 2007 vs Grêmio (5-0 global). Russo. Riquelme 8 goles, Palermo capitán. Fuente: Wikipedia temporada 2006-07 / finals 2007.",
    dt:"Miguel Ángel Russo",
    ind:{plantel:88,moral:86,hinchada:94,socios:78,cantera:70,estadio:90,prestigio:92,riesgo:16},
    caja:{plata:850,deuda:380}
  });
  attach("RIV",2018,"PLANTEL_RIV_2018",{
    etq:"2018 · Libertadores",
    desc:"River campeón de América 2018 vs Boca (Madrid). Gallardo. Pratto, Pity, Armani, Ponzio. Fuente: TyC lista de buena fe / ESPN 26 feb 2018.",
    dt:"Marcelo Gallardo",
    ind:{plantel:90,moral:88,hinchada:92,socios:80,cantera:78,estadio:94,prestigio:94,riesgo:14},
    caja:{plata:900,deuda:400}
  });
})();

(function hist800(){
  if(typeof HISTORIA_LINEA!=="object") return;
  function pushH(id, item){
    if(!HISTORIA_LINEA[id]) HISTORIA_LINEA[id]=[];
    if(HISTORIA_LINEA[id].some(function(h){ return h.anio===item.anio && h.hito===item.hito; })) return;
    var i=HISTORIA_LINEA[id].length, k;
    for(k=0;k<HISTORIA_LINEA[id].length;k++){ if(HISTORIA_LINEA[id][k].hito==="Hoy"){ i=k; break; } }
    HISTORIA_LINEA[id].splice(i,0,item);
  }
  pushH("UCH",{anio:1994,hito:"Fin de la sequía",txt:"Campeón nacional 1994. 25 años sin títulos. 1-1 a Cobresal en El Salvador: penal de Patricio Mardones. Jorge Socías. Marcelo Salas 27 goles. Musrri levantó la copa."});
  pushH("BOC",{anio:2007,hito:"Sexta Libertadores",txt:"Campeón de América 2007 vs Grêmio (3-0 y 2-0). Miguel Ángel Russo. Riquelme figura y goleador xeneize del certamen."});
  pushH("RIV",{anio:2018,hito:"Libertadores en Madrid",txt:"Campeón de América 2018 vs Boca. Final en Madrid. Marcelo Gallardo. Pratto marca en la vuelta."});
})();

/* ──────── data-planteles-801.js ──────── */
/* ============================================================
   FUTBOLINI 7.991 · rigor vs Colo-Colo + caza de historia ajena
   Audax 2007 NO fue campeón del Apertura (lo fue Colo-Colo).
   EPOCAS_TAREA_E repetía el título albo: se corrige.
   Planteles reales: Audax Libertadores 2007, Vélez 1994, San Lorenzo 2014.

   Fuentes:
     AUD 2007  AS Chile «¿Qué fue del plantel de Audax 2007?»
               + TM vs UCH 17/05/2007 y vs Colo-Colo 20/05/2007
               + playmakerstats/zerozero época 2007. DT Raúl Toro.
               Apertura 2007: 3º (44 pts). Libertadores: 11 pts, no pasa.
     VEL 1994  BDFA plantel campeón Libertadores + Wikipedia finals
               (Chilavert, Trotta capitán, Asad, Flores). DT Bianchi.
     SLO 2014  sanlorenzowebsite.com.ar plantel Libertadores
               + Wikipedia final vs Nacional + Olé. DT Edgardo Bauza.
   Stats ESTIMADAS. Cargar ÚLTIMO (después de data-planteles-800.js).
   No se inventa nadie. Capitán solo si está documentado (Trotta).
   ============================================================ */

function _pj801(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var S=_pj801;

/* Audax Italiano · 2007 · DT Raúl Toro.
   Animador: 3º Apertura, Libertadores con 11 pts (no clasificó).
   NO campeón: el Apertura 2007 lo ganó Colo-Colo. */
const PLANTEL_AUD_2007=[
  S("Nicolás Peric","ARQ",27,82,["seguro bajo los tres palos","ídolo"]),
  S("Víctor Loyola","ARQ",26,70,["recambio"]),
  S("Carlos Garrido","DEF",29,80,["ídolo","marca","liderazgo"]),
  S("Juan González","DEF",31,76,["marca","veterano"]),
  S("Jorge Carrasco","DEF",25,74,["marca"]),
  S("Roberto Cereceda","DEF",22,76,["lateral","joven"]),
  S("Fernando Gutiérrez","DEF",26,74,["marca"]),
  S("Boris Rieloff","DEF",23,80,["lateral ofensivo","ídolo"]),
  S("Patricio Gutiérrez","DEF",24,70,["lateral","recambio"]),
  S("Cristian Reynero","DEF",27,72,["marca"]),
  S("César Santis","DEF",28,70,["polivalente"]),
  S("Miguel Ángel Romero","VOL",32,78,["veterano","orden"]),
  S("Carlos Villanueva","VOL",21,86,["ídolo","enganche","tiro libre","proyección europea"]),
  S("Braulio Leal","VOL",25,78,["pulmón","box-to-box"]),
  S("Diego Scotti","VOL",30,76,["extranjero","contención"]),
  S("Enzo Cabrera","VOL",22,70,["recambio"]),
  S("Marco Medel","VOL",18,64,["joven","canterano"]),
  S("Fabián Orellana","DEL",21,82,["desequilibrio","velocidad","proyección europea"]),
  S("Rodolfo Moya","DEL",27,80,["goleador"]),
  S("Franco Di Santo","DEL",18,78,["joven","extranjero","proyección europea"]),
  S("Leonardo Medina","DEL",30,74,["extranjero","juego aéreo"])
];

/* Vélez · campeón Copa Libertadores 1994 vs São Paulo (penales) + Intercontinental vs Milan.
   DT Carlos Bianchi. Trotta capitán (c) en la final. Asad 6 goles. */
const PLANTEL_VEL_1994=[
  S("José Luis Chilavert","ARQ",29,90,["ídolo","seguro bajo los tres palos","penales"]),
  S("Juan Carlos Docabo","ARQ",23,70,["recambio"]),
  S("Sandro Guzmán","ARQ",22,62,["joven"]),
  S("Roberto Trotta","DEF",25,84,["capitán","marca","penales"]),
  S("Flavio Zandoná","DEF",26,80,["marca","juego aéreo"]),
  S("Víctor Hugo Sotomayor","DEF",26,80,["marca"]),
  S("Raúl Cardozo","DEF",26,82,["lateral","ídolo"]),
  S("Héctor Almandoz","DEF",25,76,["marca"]),
  S("Mauricio Pellegrino","DEF",23,74,["joven","marca"]),
  S("José Basualdo","VOL",31,84,["cerebro","experiencia internacional"]),
  S("Marcelo Gómez","VOL",23,80,["contención"]),
  S("Christian Bassedas","VOL",21,82,["joven","box-to-box"]),
  S("Roberto Pompei","VOL",24,78,["llegador"]),
  S("Carlos Compagnucci","VOL",25,74,["recambio"]),
  S("Patricio Camps","VOL",22,74,["desequilibrio"]),
  S("Claudio Husain","VOL",19,68,["joven","canterano"]),
  S("Omar Asad","DEL",23,84,["goleador","ídolo"]),
  S("José Oscar Flores","DEL",23,82,["goleador"]),
  S("Esteban González","DEL",32,72,["veterano","recambio"]),
  S("Martín Posse","DEL",18,66,["joven","canterano"]),
  S("Mariano Armentano","DEL",20,64,["joven"])
];

/* San Lorenzo · campeón Copa Libertadores 2014 vs Nacional (1-1 / 1-0).
   DT Edgardo Bauza. Romagnoli ídolo. Ortigoza mejor jugador de la final. */
const PLANTEL_SLO_2014=[
  S("Sebastián Torrico","ARQ",33,84,["ídolo","seguro bajo los tres palos","penales"]),
  S("Cristian Álvarez","ARQ",28,76,["recambio"]),
  S("José Devecchi","ARQ",18,60,["joven","canterano"]),
  S("Julio Buffarini","DEF",25,80,["lateral ofensivo"]),
  S("Santiago Gentiletti","DEF",29,82,["marca","juego aéreo"]),
  S("Walter Kannemann","DEF",22,78,["marca","joven"]),
  S("Emmanuel Más","DEF",25,78,["lateral"]),
  S("Mauro Cetto","DEF",31,76,["veterano","marca"]),
  S("Fabricio Fontanini","DEF",23,74,["marca"]),
  S("Gonzalo Prósperi","DEF",28,70,["lateral","recambio"]),
  S("Carlos Valdés","DEF",28,72,["extranjero","marca"]),
  S("Néstor Ortigoza","VOL",29,84,["cerebro","ídolo","penales"]),
  S("Juan Ignacio Mercier","VOL",33,78,["contención","veterano"]),
  S("Leandro Romagnoli","VOL",32,86,["ídolo","desequilibrio","enganche"]),
  S("Ignacio Piatti","VOL",28,82,["desequilibrio","llegador"]),
  S("Enzo Kalinski","VOL",26,72,["pulmón"]),
  S("Héctor Villalba","DEL",19,76,["joven","velocidad","extranjero"]),
  S("Mauro Matos","DEL",31,78,["goleador"]),
  S("Martín Cauteruccio","DEL",26,76,["goleador","extranjero"]),
  S("Nicolás Blandi","DEL",24,74,["definición"]),
  S("Ángel Correa","DEL",19,78,["joven","canterano","proyección europea"]),
  S("Pablo Barrientos","VOL",29,74,["desequilibrio","recambio"])
];

(function reg801(){
  if(typeof PLANTELES_REALES!=="object") return;
  PLANTELES_REALES.AUD=PLANTELES_REALES.AUD||{};
  PLANTELES_REALES.AUD[2007]=PLANTEL_AUD_2007;
  PLANTELES_REALES.VEL=PLANTELES_REALES.VEL||{};
  PLANTELES_REALES.VEL[1994]=PLANTEL_VEL_1994;
  PLANTELES_REALES.SLO=PLANTELES_REALES.SLO||{};
  PLANTELES_REALES.SLO[2014]=PLANTEL_SLO_2014;
})();

(function epocas801(){
  if(typeof EPOCAS_CLUB!=="object") return;
  function attach(id, anio, squad, extra){
    var cur=EPOCAS_CLUB[id]||[];
    var i, ep=null;
    for(i=0;i<cur.length;i++) if(cur[i].anio===anio){ ep=cur[i]; break; }
    if(!ep){
      ep={anio:anio};
      cur.push(ep);
      EPOCAS_CLUB[id]=cur;
    }
    ep.squad=squad;
    if(extra) Object.keys(extra).forEach(function(k){ ep[k]=extra[k]; });
  }
  /* PISA el texto falso «Campeón del Apertura 2007» (era Colo-Colo). */
  attach("AUD",2007,"PLANTEL_AUD_2007",{
    etq:"2007 · Libertadores",
    desc:"Audax de Raúl Toro: 3º del Apertura 2007 (44 pts) y 11 puntos en el grupo de Libertadores, sin pasar. Villanueva, Orellana, Di Santo, Rieloff. NO campeón: el Apertura lo ganó Colo-Colo. Fuente: Wikipedia Apertura 2007 / AS Chile plantel.",
    dt:"Raúl Toro",
    ind:{plantel:78,moral:80,hinchada:72,socios:52,cantera:60,estadio:58,prestigio:74,riesgo:22},
    caja:{plata:280,deuda:120}
  });
  attach("VEL",1994,"PLANTEL_VEL_1994",{
    etq:"1994 · Libertadores y el mundo",
    desc:"Vélez campeón de América 1994 vs São Paulo (penales) y del mundo vs Milan (2-0 en Tokio). Bianchi. Chilavert, Trotta, Asad. Fuente: BDFA / Wikipedia finals.",
    dt:"Carlos Bianchi",
    ind:{plantel:84,moral:88,hinchada:80,socios:62,cantera:66,estadio:78,prestigio:90,riesgo:14},
    caja:{plata:380,deuda:100}
  });
  attach("SLO",2014,"PLANTEL_SLO_2014",{
    etq:"2014 · Libertadores",
    desc:"San Lorenzo campeón de América 2014 vs Nacional (1-1 / 1-0). Bauza. Romagnoli, Ortigoza, Torrico. Fuente: Wikipedia final / Olé.",
    dt:"Edgardo Bauza",
    ind:{plantel:82,moral:86,hinchada:84,socios:64,cantera:60,estadio:76,prestigio:86,riesgo:16},
    caja:{plata:360,deuda:120}
  });
})();

(function hist801(){
  if(typeof HISTORIA_LINEA!=="object") return;
  function pushH(id, item){
    if(!HISTORIA_LINEA[id]) HISTORIA_LINEA[id]=[];
    if(HISTORIA_LINEA[id].some(function(h){ return h.anio===item.anio && h.hito===item.hito; })) return;
    var i=HISTORIA_LINEA[id].length, k;
    for(k=0;k<HISTORIA_LINEA[id].length;k++){ if(HISTORIA_LINEA[id][k].hito==="Hoy"){ i=k; break; } }
    HISTORIA_LINEA[id].splice(i,0,item);
  }
  pushH("AUD",{anio:2007,hito:"Libertadores",txt:"Audax de Raúl Toro anima el Apertura (3º, 44 pts) y hace 11 puntos en el grupo de Libertadores. No es campeón: el Apertura 2007 lo ganó Colo-Colo. Villanueva, Orellana, Di Santo."});
  pushH("VEL",{anio:1994,hito:"Libertadores y el mundo",txt:"Campeón de América vs São Paulo (penales) y del mundo vs Milan 2-0 en Tokio. Carlos Bianchi. Chilavert, Trotta, Asad."});
  pushH("SLO",{anio:2014,hito:"Primera Libertadores",txt:"Campeón de América 2014 vs Nacional de Paraguay. 1-0 en el Nuevo Gasómetro. Edgardo Bauza. Romagnoli, Ortigoza, Torrico."});
})();

/* ──────── data-planteles-802.js ──────── */
/* ============================================================
   FUTBOLINI 7.991 · AFA glory planteles + Limache no es Quillota
   8.00 queda RESERVADA para cuando el listón Colo-Colo esté en
   todos los clubes. Faltan muchas cosas.

   Fuentes:
     RAC 1967  racingclub.com.ar palmarés Intercontinental + RSSSF
               + BDFutbol 1967-68. DT Juan José Pizzuti.
               Capitán: Oscar Martín (RSSSF). Cárdenas gol en Montevideo.
     IND 1984  Wikipedia 1984 Intercontinental Cup + BDFutbol + RSSSF.
               DT José Omar Pastoriza. Trossero capitán. Percudani gol.
               Solo el XI + banco del partido de Tokio: no se inventa.
     ELP 2009  estudiantesdelaplata.com + BDFutbol Libertadores 2009
               + football-lineups plantilla. DT Alejandro Sabella.
               Verón alza la copa. Boselli goleador (8). 3 ARQ.
   Stats ESTIMADAS. Cargar ÚLTIMO.
   ============================================================ */

function _pj802(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var S=_pj802;

/* Racing · campeón Intercontinental 1967 vs Celtic (playoff Montevideo).
   Plantel oficial del palmarés. Edades: BDFutbol del XI. */
const PLANTEL_RAC_1967=[
  S("Agustín Cejas","ARQ",22,86,["ídolo","seguro bajo los tres palos"]),
  S("Roberto Perfumo","DEF",25,90,["ídolo","marca","liderazgo"]),
  S("Oscar Martín","DEF",33,82,["capitán","veterano","marca"]),
  S("Nelson Chabay","DEF",27,78,["marca"]),
  S("Rubén Díaz","DEF",21,76,["joven","lateral"]),
  S("Miguel Ángel Mori","DEF",24,76,["marca"]),
  S("Alfio Basile","VOL",24,84,["contención","ídolo"]),
  S("Juan Carlos Rulli","VOL",30,80,["contención"]),
  S("Juan José Rodríguez","VOL",30,78,["llegador"]),
  S("João Cardoso","VOL",28,76,["extranjero","desequilibrio"]),
  S("Norberto Raffo","DEL",28,84,["goleador"]),
  S("Juan Carlos Cárdenas","DEL",22,86,["goleador","ídolo"]),
  S("Humberto Maschio","DEL",34,82,["veterano","ídolo"])
];

/* Independiente · Intercontinental 1984 vs Liverpool 1-0 (Tokio).
   Solo nombres del partido + banco (Wikipedia / BDFutbol / RSSSF). */
const PLANTEL_IND_1984=[
  S("Carlos Goyén","ARQ",29,82,["seguro bajo los tres palos"]),
  S("Gustavo Moriconi","ARQ",24,68,["recambio"]),
  S("Néstor Clausen","DEF",22,80,["lateral","joven"]),
  S("Hugo Villaverde","DEF",27,80,["marca"]),
  S("Enzo Trossero","DEF",31,84,["capitán","marca","liderazgo"]),
  S("Carlos Enrique","DEF",21,76,["lateral","joven"]),
  S("Pedro Monzón","DEF",22,74,["marca","joven"]),
  S("Rodolfo Zimmermann","DEF",33,70,["veterano","recambio"]),
  S("Ricardo Giusti","VOL",28,82,["pulmón","contención"]),
  S("Claudio Marangoni","VOL",30,80,["cerebro"]),
  S("Ricardo Bochini","VOL",30,90,["ídolo","enganche","desequilibrio"]),
  S("Jorge Burruchaga","VOL",22,86,["llegador","joven","proyección europea"]),
  S("Gerardo Reinoso","VOL",19,66,["joven","recambio"]),
  S("Sergio Merlini","VOL",22,66,["recambio"]),
  S("José Percudani","DEL",19,82,["goleador","joven"]),
  S("Alejandro Barberón","DEL",25,76,["desequilibrio"]),
  S("Sergio Bufarini","DEL",21,66,["joven","recambio"])
];

/* Estudiantes LP · campeón Libertadores 2009 vs Cruzeiro.
   Final: Andújar; Cellay, Schiavi, Desábato, Ré; Pérez, Braña, Verón, Benítez; Fernández, Boselli. */
const PLANTEL_ELP_2009=[
  S("Mariano Andújar","ARQ",25,86,["ídolo","seguro bajo los tres palos","penales"]),
  S("Damián Albil","ARQ",29,72,["recambio"]),
  S("Agustín Dobler","ARQ",26,64,["recambio"]),
  S("Leandro Desábato","DEF",30,82,["marca","ídolo"]),
  S("Christian Cellay","DEF",27,78,["lateral"]),
  S("Germán Ré","DEF",27,78,["marca"]),
  S("Rolando Schiavi","DEF",36,80,["veterano","marca","juego aéreo"]),
  S("Marcos Angeleri","DEF",26,78,["lateral"]),
  S("Agustín Alayes","DEF",30,74,["marca","recambio"]),
  S("Raúl Iberbia","DEF",19,64,["joven","lateral"]),
  S("Marcos Rojo","DEF",18,66,["joven","canterano","proyección europea"]),
  S("Juan Sebastián Verón","VOL",34,90,["capitán","ídolo","cerebro"]),
  S("Enzo Pérez","VOL",23,82,["pulmón","box-to-box"]),
  S("Rodrigo Braña","VOL",30,82,["contención","ídolo"]),
  S("Leandro Benítez","VOL",28,78,["desequilibrio"]),
  S("Diego Galván","VOL",26,72,["recambio"]),
  S("Gastón Fernández","DEL",25,80,["enganche","goleador"]),
  S("Mauro Boselli","DEL",23,86,["goleador","ídolo"]),
  S("José Luis Calderón","DEL",38,72,["veterano","ídolo"]),
  S("Maximiliano Núñez","DEL",22,70,["velocidad","recambio"]),
  S("Juan Manuel Salgueiro","DEL",25,72,["extranjero","recambio"])
];

(function reg802(){
  if(typeof PLANTELES_REALES!=="object") return;
  PLANTELES_REALES.RAC=PLANTELES_REALES.RAC||{};
  PLANTELES_REALES.RAC[1967]=PLANTEL_RAC_1967;
  PLANTELES_REALES.IND=PLANTELES_REALES.IND||{};
  PLANTELES_REALES.IND[1984]=PLANTEL_IND_1984;
  PLANTELES_REALES.ELP=PLANTELES_REALES.ELP||{};
  PLANTELES_REALES.ELP[2009]=PLANTEL_ELP_2009;
})();

(function epocas802(){
  if(typeof EPOCAS_CLUB!=="object") return;
  function attach(id, anio, squad, extra){
    var cur=EPOCAS_CLUB[id]||[];
    var i, ep=null;
    for(i=0;i<cur.length;i++) if(cur[i].anio===anio){ ep=cur[i]; break; }
    if(!ep){
      ep={anio:anio};
      cur.push(ep);
      EPOCAS_CLUB[id]=cur;
    }
    ep.squad=squad;
    if(extra) Object.keys(extra).forEach(function(k){ ep[k]=extra[k]; });
  }
  attach("RAC",1967,"PLANTEL_RAC_1967",{
    etq:"1967 · Campeón del mundo",
    desc:"Racing campeón Intercontinental vs Celtic (playoff 1-0 en Montevideo, gol de Cárdenas). Pizzuti. Perfumo, Cejas, Martín capitán. Fuente: RSSSF / palmarés oficial.",
    dt:"Juan José Pizzuti",
    ind:{plantel:86,moral:90,hinchada:86,socios:64,cantera:58,estadio:78,prestigio:92,riesgo:12},
    caja:{plata:400,deuda:80}
  });
  attach("IND",1984,"PLANTEL_IND_1984",{
    etq:"1984 · Campeón del mundo",
    desc:"Independiente 1-0 a Liverpool en Tokio. Percudani. Pastoriza. Bochini, Trossero capitán, Burruchaga. Fuente: Wikipedia Intercontinental 1984 / RSSSF.",
    dt:"José Omar Pastoriza",
    ind:{plantel:86,moral:88,hinchada:86,socios:64,cantera:60,estadio:80,prestigio:92,riesgo:12},
    caja:{plata:380,deuda:90}
  });
  attach("ELP",2009,"PLANTEL_ELP_2009",{
    etq:"2009 · Libertadores",
    desc:"Estudiantes campeón de América 2009 vs Cruzeiro. Sabella. Verón alza la copa. Boselli goleador (8). Fuente: club / BDFutbol.",
    dt:"Alejandro Sabella",
    ind:{plantel:84,moral:88,hinchada:84,socios:62,cantera:62,estadio:76,prestigio:88,riesgo:14},
    caja:{plata:360,deuda:110}
  });
})();

(function hist802(){
  if(typeof HISTORIA_LINEA!=="object") return;
  function pushH(id, item){
    if(!HISTORIA_LINEA[id]) HISTORIA_LINEA[id]=[];
    if(HISTORIA_LINEA[id].some(function(h){ return h.anio===item.anio && h.hito===item.hito; })) return;
    var i=HISTORIA_LINEA[id].length, k;
    for(k=0;k<HISTORIA_LINEA[id].length;k++){ if(HISTORIA_LINEA[id][k].hito==="Hoy"){ i=k; break; } }
    HISTORIA_LINEA[id].splice(i,0,item);
  }
  /* AFA que solo tenían Fundación+Hoy: el hito ya estaba en la época, faltaba en la línea. */
  pushH("ROS",{anio:1987,hito:"Campeón",txt:"Rosario Central campeón 1986/87. Arroyito. El Canalla grande."});
  pushH("NEW",{anio:1974,hito:"Nacional",txt:"Newell's campeón del Nacional 1974. La Lepra."});
  pushH("HUR",{anio:1973,hito:"Metropolitano",txt:"Huracán campeón del Metropolitano 1973, el de Menotti. Parque Patricios."});
  pushH("LAN",{anio:2013,hito:"Sudamericana",txt:"Lanús campeón de la Sudamericana 2013. El Granate continental."});
  pushH("ARG",{anio:1985,hito:"Libertadores",txt:"Argentinos Juniors campeón de América 1985. La Paternal."});
  pushH("BAN",{anio:2009,hito:"Apertura",txt:"Banfield campeón del Apertura 2009. El Taladro."});
  pushH("GLP",{anio:1929,hito:"Campeón",txt:"Gimnasia LP campeón 1929. El hito máximo amateur/profesional temprano."});
  pushH("TAL",{anio:2016,hito:"Primera",txt:"Talleres de Córdoba vuelve a Primera 2016 y se afirma."});
  pushH("BEL",{anio:2022,hito:"Ascenso",txt:"Belgrano asciende a Primera 2022. El Pirata vuelve."});
  pushH("TIG",{anio:2019,hito:"Superliga",txt:"Tigre campeón de la Copa de la Superliga 2019."});
  pushH("PLA",{anio:2021,hito:"Ascenso",txt:"Platense asciende a Primera 2021, 22 años después."});
  pushH("BAR",{anio:2022,hito:"Primera",txt:"Barracas Central llega a Primera 2022. La Ribera."});
  pushH("INS",{anio:2022,hito:"Ascenso",txt:"Instituto asciende a Primera 2022. Córdoba, cantera."});
  pushH("IRV",{anio:2023,hito:"Ascenso",txt:"Independiente Rivadavia asciende a Primera 2023. Mendoza."});
  pushH("ELP",{anio:2009,hito:"Libertadores",txt:"Estudiantes campeón de América 2009 con Sabella. Verón, Boselli."});
  pushH("RAC",{anio:1967,hito:"Intercontinental",txt:"Campeón del mundo vs Celtic. Playoff en Montevideo, gol de Cárdenas. Pizzuti."});
  pushH("IND",{anio:1984,hito:"Intercontinental",txt:"Campeón del mundo vs Liverpool 1-0 en Tokio. Percudani. Bochini."});
})();

(function lim802(){
  /* Limache no es Quillota: el Fariña es de San Luis. */
  if(typeof ESTADIOS_DATA==="object" && ESTADIOS_DATA.LIM){
    ESTADIOS_DATA.LIM.nombre="Estadio Municipal Ángel Navarrete Candia";
    ESTADIOS_DATA.LIM.aforo=3000;
    ESTADIOS_DATA.LIM.propietario="Municipalidad de Limache";
  }
  if(typeof ESTADIOS_DATA==="object" && !ESTADIOS_DATA.SLQ){
    ESTADIOS_DATA.SLQ={
      nombre:"Estadio Lucio Fariña Fernández",
      aforo:7703,
      propietario:"San Luis de Quillota",
      aproximado:true,
      sectores:[
        {n:"Popular", tipo:"popular", cuota:0.40, precio:5000},
        {n:"Tribuna", tipo:"tribuna", cuota:0.40, precio:10000},
        {n:"Preferencial", tipo:"premium", cuota:0.20, precio:20000}
      ]
    };
  } else if(typeof ESTADIOS_DATA==="object" && ESTADIOS_DATA.SLQ){
    ESTADIOS_DATA.SLQ.nombre="Estadio Lucio Fariña Fernández";
    ESTADIOS_DATA.SLQ.aforo=ESTADIOS_DATA.SLQ.aforo||7703;
    ESTADIOS_DATA.SLQ.propietario="San Luis de Quillota";
  }
  if(typeof CLUB_INFO_2026==="object" && CLUB_INFO_2026.LIM){
    CLUB_INFO_2026.LIM.est="Estadio Municipal Ángel Navarrete Candia";
  }
})();
