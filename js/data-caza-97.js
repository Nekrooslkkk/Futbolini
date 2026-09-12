"use strict";
/* ============================================================
   FUTBOLINI 7.97 · caza de copias (TAREA E)
   1) Historia/arcos: un club no hereda la de otro (COB 1991 ≠ Cobresal).
   2) Decisiones: no sale el Monumental / ANFP / Libertadores en Segunda o AFA.
   3) Planteles 2026: un jugador no vive en dos clubes a la vez (pases Wiki).
   Cargar ÚLTIMO (después de data-planteles-95.js).
   ============================================================ */

function _blobDec97(d){
  try{ return JSON.stringify(d).toLowerCase(); }catch(e){ return ((d&&d.t)||"")+" "+((d&&d.d)||""); }
}
function _esAFA97(club){
  if(typeof E!=="undefined"&&E&&E.eraBase==="arg2026") return true;
  return typeof esClubArg==="function" && esClubArg(club||(typeof E!=="undefined"&&E&&E.club));
}
function _esSeg97(){
  return typeof E!=="undefined"&&E&&E.eraBase==="2026c";
}

/* ¿esta carta habla de la casa de OTRO club / de otra federación? */
function decisionCabeEnClub(d){
  if(!d||typeof E==="undefined"||!E) return true;
  if(d.club && d.club!==E.club) return false;
  var club=E.club;
  var blob=_blobDec97(d);
  if(_esAFA97(club) && (/\banfp\b/.test(blob)||/quilín|quilin/.test(blob)||/copa chile/.test(blob))) return false;
  if(_esSeg97() && /libertadores|sudamericana|copa chile|copa de la liga/.test(blob)) return false;
  if(E.eraBase===1925 && /\bvar\b|libertadores|sponsor|anfp/.test(blob)) return false;
  var marcas=[
    {re:/macul|la leonera/, ok:["CC"]},
    {re:/santa laura/, ok:["UES"]},
    {re:/claro arena/, ok:["UC"]},
    {re:/ester roa/, ok:["DCO","UDC"]},
    {re:/la cisterna/, ok:["PAL"]},
    {re:/playa ancha/, ok:["SW"]},
    {re:/el teniente/, ok:["OHI"]},
    {re:/sausalito/, ok:["EVE"]},
    {re:/la bombonera/, ok:["BOC"]}
  ];
  for(var i=0;i<marcas.length;i++){
    if(marcas[i].re.test(blob) && marcas[i].ok.indexOf(club)<0) return false;
  }
  if(/monumental/.test(blob) && club!=="CC" && club!=="RIV" && club!=="TUC" && club!=="BOC"){
    if(!_esAFA97(club)) return false;
  }
  return true;
}

function arcoCabeEnClub(a, club){
  if(!a) return true;
  var blob=((a.t||"")+" "+(a.desc||"")).toLowerCase();
  var caps=a.capitulos||[];
  for(var i=0;i<caps.length;i++) blob+=" "+(caps[i].ctx||"")+" "+(caps[i].t||"");
  club=club||(typeof E!=="undefined"&&E&&E.club);
  if(/el salvador|el cobre/.test(blob) && club!=="COB" && club!=="CBS") return false;
  if(/calama|zorros del desierto/.test(blob) && club!=="CBL") return false;
  if(/monumental/.test(blob) && club!=="CC" && club!=="RIV" && club!=="BOC" && club!=="TUC") return false;
  if(/macul|cacique/.test(blob) && club!=="CC") return false;
  if(/bombonera|xeneize/.test(blob) && club!=="BOC") return false;
  if(/sausalito/.test(blob) && club!=="EVE") return false;
  if(/santa laura/.test(blob) && club!=="UES") return false;
  if(typeof E!=="undefined"&&E&&E.eraBase===1925){
    if(/\bvar\b|sponsor|naming|anfp|libertadores|streaming|instagram|tiktok|europeo ofrece/.test(blob)) return false;
  }
  return true;
}

(function parcheBolsa97(){
  if(typeof BOLSA==="undefined"||!Array.isArray(BOLSA)) return;
  function wrap(id, extra){
    var d=BOLSA.find(function(x){ return x.id===id; });
    if(!d) return;
    var prev=d.cuando;
    d.cuando=function(E){
      if(extra && extra(E)===false) return false;
      return prev?prev(E):true;
    };
  }
  wrap("b_tv", function(E){ return !_esAFA97(E&&E.club); });
  wrap("b_anfp_voto", function(E){ return !_esAFA97(E&&E.club); });
  wrap("b_anfp_sancion", function(E){ return !_esAFA97(E&&E.club); });
  wrap("b_anfp_fixture", function(E){ return !_esAFA97(E&&E.club); });
})();

/* Pases Wiki ya documentados: el jugador se queda en UN club 2026. */
const COPIAS_KEEP_97={
  "Cristian Palavecino":"UC",
  "Luciano Palavecino":"UC",
  "Dylan Escobar":"COQ",
  "Felipe Villagrán":"COB",
  "Renzo Malanca":"HUA",
  "Maximiliano Gutiérrez":"IND",
  "Marcelo Malcorra":"UNI",
  "Ignacio Fuenzalida":"COP",
  "César Munder":"PAL",
  "Bryan Cerezo":"UC",
  "Lucas Assadi":null,
  "Vicente Pizarro":"ROS",
  "Matías Nadruz":null,
  "Nicolás Sarrafiore":null,
  "Fabricio Vera":"OHI",
  "Manuel Olea":"USF"
};

(function cazarCopiasPlantel97(){
  if(typeof PLANTELES_REALES!=="object") return;
  var anio=2026;
  var ids=Object.keys(PLANTELES_REALES);
  Object.keys(COPIAS_KEEP_97).forEach(function(nom){
    var keep=COPIAS_KEEP_97[nom];
    ids.forEach(function(id){
      var s=PLANTELES_REALES[id]&&PLANTELES_REALES[id][anio];
      if(!s) return;
      if(keep===id) return;
      PLANTELES_REALES[id][anio]=s.filter(function(j){
        return (j[0]||"").indexOf(nom)<0;
      });
    });
  });
})();
