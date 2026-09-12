"use strict";
/* ============================================================
   FUTBOLINI 7.98 · caza: historias ajenas + copias + Plop de época
   TAREA E: un club no hereda la historia de otro; 1925 no habla
   de VAR/ANFP; el Plop no suelta la Libertadores 91 en La Pintana.
   Cargar ÚLTIMO (después de data-caza-97.js).
   ============================================================ */

function textoHistoriaAjeno(txt, club){
  if(!txt) return false;
  club=club||(typeof E!=="undefined"&&E&&E.club);
  if(!club || club==="CC") return false;
  var t=String(txt).toLowerCase();
  if(/3-0 a olimpia|campeón de américa:\s*3-0|la leonera/.test(t)) return true;
  if(/nace en macul/.test(t)) return true;
  if(/batalla de macul/.test(t) && club!=="CC") return true;
  if(/libertadores 1991 la ganó colo-colo/.test(t)) return true;
  return false;
}

function textoPlopAjeno(txt){
  if(!txt || typeof E==="undefined" || !E) return false;
  var t=String(txt);
  var club=E.club;
  var era=E.eraBase;
  if(era===1925 && /\bVAR\b|ANFP|sponsor|Instagram|TikTok|Libertadores|Sudamericana|sociedad anónima/i.test(t)) return true;
  if(club!=="CC"){
    if(/COLO-COLO CAMPEÓN DE AMÉRICA|3-0 a Olimpia en el Monumental|Batalla de Macul|La Leonera/i.test(t)) return true;
    if(/Arellano anota cuatro|Nació el Cacique/i.test(t)) return true;
  }
  if(era==="2026c" && /Libertadores 1991|Copa Libertadores de ese año/i.test(t)) return true;
  if(era==="arg2026" && /\bANFP\b|Copa Chile/i.test(t)) return true;
  return false;
}

(function wrapTuit98(){
  if(typeof tuitDeCtx!=="function" || tuitDeCtx._p98) return;
  var orig=tuitDeCtx;
  tuitDeCtx=function(ctx){
    var i, t;
    for(i=0;i<10;i++){
      t=orig(ctx);
      if(!t) return t;
      if(t.club && typeof E!=="undefined" && E && t.club!==E.club) continue;
      if(t.era!=null && typeof E!=="undefined" && E && t.era!==E.eraBase && t.era!==E.anio) continue;
      if(textoPlopAjeno(t.txt)) continue;
      return t;
    }
    return null;
  };
  tuitDeCtx._p98=true;
})();

/* Prensa de época: entra al pool con club+era, no como titular suelto de todos. */
(function mixPrensaEpoca98(){
  if(typeof TUITS_MOMENTO==="undefined" || !Array.isArray(TUITS_MOMENTO)) return;
  function pushPool(arr, club, era){
    if(!arr) return;
    arr.forEach(function(t){
      var row=Object.assign({club:club, era:era}, t);
      if(!TUITS_MOMENTO.some(function(x){ return x.txt===row.txt && x.quien===row.quien; }))
        TUITS_MOMENTO.push(row);
    });
  }
  if(typeof PRENSA_1991!=="undefined") pushPool(PRENSA_1991, "CC", 1991);
  if(typeof PRENSA_2006!=="undefined") pushPool(PRENSA_2006, "CC", 2006);
  if(typeof PRENSA_1925!=="undefined") pushPool(PRENSA_1925, "CC", 1925);
})();

/* Copias extra 7.98: fichas clonadas que sobrevivieron el KEEP de 7.97.
   Solo nombre completo documentado como el mismo pase; no se tocan homónimos. */
const COPIAS_KEEP_98={
  "Fabricio Vera":"OHI",
  "Manuel Olea":"USF",
  "Bryan Taiva":"PMO",
  "Ignacio Pacheco":"OSO",
  "José Alburquenque":"UCH",
  "Bastián Valdés":"BSA",
  "Jean Cerda":"GVE",
  "Julián Fernández":"TUC"
};
(function cazarCopiasPlantel98(){
  if(typeof PLANTELES_REALES!=="object") return;
  var anio=2026, ids=Object.keys(PLANTELES_REALES);
  Object.keys(COPIAS_KEEP_98).forEach(function(nom){
    var keep=COPIAS_KEEP_98[nom];
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
