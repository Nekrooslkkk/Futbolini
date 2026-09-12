"use strict";
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
