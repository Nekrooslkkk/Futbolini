"use strict";
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
