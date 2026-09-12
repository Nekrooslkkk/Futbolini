"use strict";
/* ============================================================
   FUTBOLINI 7.87 · huecos TAREA E
   Planteles Wikipedia. Stats ESTIMADAS. Cargar antes de 88/89.
   ============================================================ */

function _j87(n,pos,edad,niv,ras){
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(10,Math.round(niv*niv/110)), Math.max(14,Math.round(niv*niv/16)), ras||[]];
}

/* River · anexo temporada 27 ago 2026. DT Leonardo Ponzio (interino). */
const PLANTEL_RIV_2026=[
  _j87("Ezequiel Centurión","ARQ",29,82,["experiencia"]),
  _j87("Santiago Beltrán","ARQ",21,68,["canterano"]),
  _j87("Jeremías Martinet","ARQ",21,66,[]),
  _j87("Nicolás Otamendi","DEF",38,84,["veterano","selección","líder"]),
  _j87("Gonzalo Montiel","DEF",29,82,["selección"]),
  _j87("Lucas Martínez Quarta","DEF",30,82,[]),
  _j87("Marcos Acuña","DEF",34,80,["veterano","selección"]),
  _j87("Francisco Ortega","DEF",27,78,[]),
  _j87("Giovanni González","DEF",31,76,["extranjero"]),
  _j87("Lautaro Rivero","DEF",22,76,[]),
  _j87("Tobías Ramírez","DEF",19,70,["canterano"]),
  _j87("Thiago Almada","VOL",25,86,["figura","desequilibrio"]),
  _j87("Aníbal Moreno","VOL",27,82,["contención"]),
  _j87("Mauro Arambarri","VOL",30,80,["extranjero"]),
  _j87("Fausto Vera","VOL",26,78,[]),
  _j87("Juan Portillo","VOL",26,76,[]),
  _j87("Tomás Galván","VOL",26,74,[]),
  _j87("Sebastián Driussi","DEL",30,84,["goleador","ídolo"]),
  _j87("Ángel Correa","DEL",31,84,["figura"]),
  _j87("Lucas Beltrán","DEL",25,82,[]),
  _j87("Rafael Borré","DEL",30,80,[]),
  _j87("Agustín Ruberto","DEL",20,72,["canterano"])
];

/* Boca · temporada 2026 (altas Montero, Valencia, Villa, Lozano). DT Arruabarrena. */
const PLANTEL_BOC_2026=[
  _j87("Álvaro Montero","ARQ",31,80,["extranjero"]),
  _j87("Leandro Brey","ARQ",23,72,["canterano"]),
  _j87("Lautaro Blanco","DEF",27,78,[]),
  _j87("Ayrton Costa","DEF",27,76,[]),
  _j87("Cristian Lema","DEF",36,76,["veterano"]),
  _j87("Luis Advíncula","DEF",36,76,["veterano","extranjero"]),
  _j87("Leandro Lozano","DEF",27,74,["extranjero"]),
  _j87("Leandro Paredes","VOL",32,84,["figura","selección"]),
  _j87("Carlos Palacios","VOL",25,80,["extranjero","desequilibrio"]),
  _j87("Guillermo Fernández","VOL",34,78,["veterano"]),
  _j87("Kevin Zenón","VOL",25,78,[]),
  _j87("Exequiel Zeballos","VOL",24,76,["canterano"]),
  _j87("Miguel Merentiel","DEL",30,82,["goleador","extranjero"]),
  _j87("Edinson Cavani","DEL",39,80,["veterano","extranjero","ídolo"]),
  _j87("Enner Valencia","DEL",36,78,["veterano","extranjero"]),
  _j87("Sebastián Villa","DEL",30,78,["extranjero"]),
  _j87("Milton Giménez","DEL",29,76,[])
];

/* Morning · Wikipedia squad 26 abr 2026. DT Esteban Paredes. */
const PLANTEL_SMO_2026=[
  _j87("Juan Cruz Bolado","ARQ",28,62,["extranjero"]),
  _j87("Benjamín Rebolledo","ARQ",22,54,[]),
  _j87("Milovan Arredondo","ARQ",20,52,[]),
  _j87("Nicolás Palomo","DEF",24,56,[]),
  _j87("David Montoya","DEF",26,56,["extranjero"]),
  _j87("Martín Delgado","DEF",25,56,[]),
  _j87("Cristóbal Kuljis","DEF",24,54,[]),
  _j87("Marcelo Jorquera","DEF",33,58,["veterano"]),
  _j87("Cristian Magaña","DEF",35,56,["veterano"]),
  _j87("Fernando Manríquez","VOL",40,66,["capitán","ídolo","veterano"]),
  _j87("Luis Valenzuela","VOL",35,60,["experiencia"]),
  _j87("Sebastián Salazar","VOL",25,56,[]),
  _j87("Diego Faúndez","VOL",24,54,[]),
  _j87("Simón Arias","VOL",23,54,[]),
  _j87("Carlos Muñoz","DEL",37,62,["veterano","goleador"]),
  _j87("Gustavo Escobar","DEL",26,58,["extranjero"]),
  _j87("Kevin Rojas","DEL",24,56,[]),
  _j87("Martin Arancibia","DEL",23,54,[])
];

/* Goleadores Segunda — 88/89 pisan con el plantel completo. */
const PLANTEL_TRA_2026=[["Javier Quiñones","DEL",23,64,70,18,40,["goleador"]]];
const PLANTEL_CLC_2026=[["Matías Pérez","DEL",29,62,66,16,32,["goleador"]]];
const PLANTEL_SCI_2026=[["Bryan Taiva","DEL",31,62,68,16,36,["goleador"]],["Joaquín Agüero","DEL",23,60,68,14,34,[]]];
const PLANTEL_REN_2026=[["Lucas Fierro","DEL",28,60,66,16,32,["goleador"]]];
const PLANTEL_CNA_2026=[["Axel Cerda","DEL",20,62,68,16,36,["goleador","préstamo"]],["Joaquín Plaza","DEL",22,60,66,14,30,["extranjero"]],["Luis Vargas","DEL",26,60,64,14,28,[]]];
const PLANTEL_RSJ_2026=[["Nicolás Forttes","DEL",29,58,64,14,30,["goleador"]]];
const PLANTEL_LIN_2026=[["Diego Vallejos","DEL",36,62,66,16,32,["veterano"]]];

(function reg87planteles(){
  if(typeof PLANTELES_REALES!=="object") return;
  function reg(id,s){ if(!PLANTELES_REALES[id]) PLANTELES_REALES[id]={}; PLANTELES_REALES[id][2026]=s; }
  reg("RIV", PLANTEL_RIV_2026);
  reg("BOC", PLANTEL_BOC_2026);
  reg("SMO", PLANTEL_SMO_2026);
  reg("TRA", PLANTEL_TRA_2026);
  reg("CLC", PLANTEL_CLC_2026);
  reg("SCI", PLANTEL_SCI_2026);
  reg("REN", PLANTEL_REN_2026);
  reg("CNA", PLANTEL_CNA_2026);
  reg("RSJ", PLANTEL_RSJ_2026);
  reg("LIN", PLANTEL_LIN_2026);
})();

(function dts87(){
  if(typeof CLUB_INFO_2026!=="object") return;
  if(CLUB_INFO_2026.RIV) CLUB_INFO_2026.RIV.dt="Leonardo Ponzio";
  if(CLUB_INFO_2026.BOC) CLUB_INFO_2026.BOC.dt="Rodolfo Arruabarrena";
})();

const SPONSORS_CLUB_2026={
  SMO:{ausp:"Miami Outlet", kit:"KS7"},
  SCI:{ausp:"Miami Outlet", kit:"KS7"},
  BSA:{ausp:"Minera Los Pelambres", kit:"OneFit"},
  TRA:{ausp:"PF Alimentos", kit:"OneFit"},
  OSO:{ausp:"Colún", kit:"OneFit"},
  LIN:{ausp:"PF Alimentos", kit:"KS7"},
  CLC:{ausp:"PF Alimentos", kit:"KS7"},
  REN:{ausp:"PF Alimentos", kit:"OneFit"},
  GVE:{ausp:"PF Alimentos", kit:"KS7"},
  CNA:{ausp:"Municipalidad de Concón", kit:"KS7"},
  OVA:{ausp:"Municipalidad de Ovalle", kit:"OneFit"},
  COL:{ausp:"Municipalidad de Colina", kit:"KS7"},
  LSC:{ausp:"Carbonífera Lota", kit:"OneFit"},
  RSJ:{ausp:"Municipalidad de San Joaquín", kit:"KS7"}
};

/* Clausura 2026 · 442.perfil / ESPN · 15 y 15 */
const ZONA_A_ARG_2026=["BOC","IND","SLO","TAL","INS","VEL","ELP","LAN","NEW","DYJ","CCO","UNI","PLA","RIE","GME"];
const ZONA_B_ARG_2026=["RIV","RAC","HUR","ROS","BEL","ARG","GLP","BAN","TIG","TUC","SAR","BAR","ALD","ERC","IRV"];
const INTERZONAL_ARG_2026={BOC:"RIV",RIV:"BOC",IND:"RAC",RAC:"IND",SLO:"HUR",HUR:"SLO",VEL:"GLP",GLP:"VEL",ELP:"BAN",BAN:"ELP",NEW:"ROS",ROS:"NEW",TAL:"BEL",BEL:"TAL"};

const AFORO_ARG_87={RIV:85018,BOC:54000,RAC:55000,IND:48069,VEL:49540,SLO:47964,ELP:32000,ROS:41654,NEW:39000,HUR:48314,LAN:47027,GLP:33000,RIE:8000};

(function aforo87(){
  if(typeof ESTADIOS_DATA!=="object") return;
  Object.keys(AFORO_ARG_87).forEach(function(id){
    if(!ESTADIOS_DATA[id]) ESTADIOS_DATA[id]={};
    ESTADIOS_DATA[id].aforo=AFORO_ARG_87[id];
  });
})();

const ARCOS_AFA_87={
  RIV:[{id:"riv_2026",t:"El Superclásico no se negocia",desc:"Gallardo se fue. Ponzio interino. Otamendi y Almada no alcanzan si el Monumental pide identidad.",
    capitulos:[{id:"riv_1",t:"¿Qué es River sin el Muñeco?",ctx:"La prensa pide un DT de estirpe. El vestuario pide silencio.",
      ops:[{t:"Bancá a Ponzio",d:"Continuidad.",grupos:{plantel:8,hinchada:-4},mem:"bancaste a Ponzio",cierra:true},
           {t:"Buscá un nombre grande",d:"Ruido y esperanza.",grupos:{hinchada:10,directorio:-6},mem:"pediste un DT de cartel",cierra:true}]}]}],
  BOC:[{id:"boc_2026",t:"La Bombonera pide un ciclo",desc:"Arruabarrena volvió. Paredes manda el medio. El Superclásico define la semana.",
    capitulos:[{id:"boc_1",t:"¿El ciclo es de verdad?",ctx:"Un empate en el Monumental no se perdona.",
      ops:[{t:"El estilo no se discute",d:"Identidad xeneize.",grupos:{hinchada:10,plantel:4},mem:"defendiste el estilo Boca",cierra:true},
           {t:"Ajustar para sumar",d:"Pragmático.",grupos:{directorio:8,hinchada:-6},mem:"priorizaste la tabla",cierra:true}]}]}]
};
(function arcosAfa87(){
  if(typeof ARCOS_EQUIPO!=="object") return;
  Object.keys(ARCOS_AFA_87).forEach(function(id){
    if(!ARCOS_EQUIPO[id]) ARCOS_EQUIPO[id]=ARCOS_AFA_87[id];
  });
})();

const TITULARES_87=[
  {ctx:"fecha_previa", registro:"cl", txt:"En Segunda no hay marketing: hay un pueblo y un bus. Fecha {N}."},
  {ctx:"fecha_previa", registro:"neutro", txt:"La liguilla espera. Primero hay que terminar la zona. Fecha {N}, {RIVAL}."},
  {ctx:"fecha_previa", registro:"cl", txt:"La B no perdona el ego de ex-Primera. Fecha {N}: se viene {RIVAL}."},
  {ctx:"fecha_previa", registro:"neutro", txt:"En Argentina el clásico está escrito: el interzonal de la jornada no se negocia."},
  {ctx:"fecha_post", registro:"cl", txt:"Otra fecha de zona. La liguilla de 7 no perdona."},
  {ctx:"fecha_post", registro:"neutro", txt:"Cerró la jornada. En Copa Chile, Segunda no juega: lo resolvió la ANFP."}
];
(function plop87(){
  if(typeof TITULARES_FECHA==="object" && Array.isArray(TITULARES_FECHA)){
    TITULARES_87.forEach(function(x){ TITULARES_FECHA.push(x); });
  }
})();

(function sitSponsor87(){
  if(typeof SITUACION_CLUB!=="object") return;
  Object.keys(SPONSORS_CLUB_2026).forEach(function(id){
    var s=SPONSORS_CLUB_2026[id];
    if(!SITUACION_CLUB[id] || /Auspicia/.test(SITUACION_CLUB[id])) return;
    SITUACION_CLUB[id]+=" Auspicia "+s.ausp+" · kit "+s.kit+".";
  });
})();
