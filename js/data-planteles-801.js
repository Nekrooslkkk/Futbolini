"use strict";
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
