"use strict";
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
