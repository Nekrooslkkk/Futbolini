"use strict";
/* ============================================================
   FUTBOLINI · retrato.js — 7.9033 (Claude)
   El DT tiene cara, y el cargo se la va cambiando.
   No es un chiste: es la verdad incómoda del juego dibujada.
   - La edad y los años en el cargo traen canas y arrugas.
   - El estrés (bienestar bajo, rachas sin ganar, riesgo, desfalco)
     trae ojeras, ceño, barba de días y la sonrisa que se apaga.
   - La corbata es del club: el cargo te viste.
   SVG propio, sin assets externos: se ve igual sin internet.
   ============================================================ */
const RETRATO_PIELES=["#f2c9a0","#e0ae84","#c68b5e","#9c6641","#6e4429"];
const RETRATO_PELOS=["#1b1410","#3a2616","#5a3a22","#0e0e10","#7a5230"];

function _retratoHash(s){ s=String(s||""); let h=11; for(let i=0;i<s.length;i++) h=(h*33+s.charCodeAt(i))|0; return Math.abs(h); }
function _mezclaHex(a,b,t){
  const pa=parseInt(a.slice(1),16), pb=parseInt(b.slice(1),16);
  const r=Math.round(((pa>>16)&255)*(1-t)+((pb>>16)&255)*t), g=Math.round(((pa>>8)&255)*(1-t)+((pb>>8)&255)*t), bl=Math.round((pa&255)*(1-t)+(pb&255)*t);
  return "#"+((1<<24)+(r<<16)+(g<<8)+bl).toString(16).slice(1);
}
/* lo que el cargo le hizo a esta persona, en números 0–100 */
function estadoRetrato(){
  const P=(E&&E.perfil)||{};
  const edad=(typeof edadDT==="function")?edadDT():38;
  const bien=(P.bienestar==null)?70:P.bienestar;
  const sinGanar=(E&&E.temporada&&E.temporada.sinGanar)||0;
  const riesgo=(E&&E.ind&&E.ind.riesgo)||0;
  const sucio=!!(E&&E.flags&&(E.flags.desfalco>0||E.flags.investigacionAbierta));
  const anios=Math.max(0,((E&&E.anio)||2026)-((E&&E.carrera&&E.carrera.desde)||(E&&E.anio)||2026));
  const estres=Math.max(0,Math.min(100,(70-bien)*1.4+sinGanar*7+riesgo*0.35+(sucio?18:0)));
  const canas=Math.max(0,Math.min(100,(edad-36)*2.6+anios*7+estres*0.35));
  const arrugas=Math.max(0,Math.min(100,(edad-30)*2.2+estres*0.4));
  return {edad:edad, bien:bien, estres:Math.round(estres), canas:Math.round(canas), arrugas:Math.round(arrugas), sinGanar:sinGanar, sucio:sucio, anios:anios};
}
function retratoSVG(opts){
  opts=opts||{};
  const P=(E&&E.perfil)||{};
  const S=opts.estado||estadoRetrato();
  const mujer=/^(f|mujer)/i.test(String(P.genero||""));
  const h=_retratoHash((P.nombre||"DT")+"|"+(P.nacimiento||""));
  const piel=P.piel||RETRATO_PIELES[h%RETRATO_PIELES.length];
  const peloBase=P.pelo||RETRATO_PELOS[(h>>3)%RETRATO_PELOS.length];
  const pelo=_mezclaHex(peloBase,"#c9c9c4",Math.min(0.85,S.canas/100));
  const kit=(typeof _kitDe==="function"&&E)?_kitDe(E.club,["#1a4a9c","#f4f4f4"]):["#1a4a9c","#f4f4f4"];
  const e=S.estres/100, a=S.arrugas/100;
  /* ojos: con estrés se cierran (párpado baja) */
  const parp=2.2+e*2.4;
  const ojo=function(x){
    return '<ellipse cx="'+x+'" cy="58" rx="3.6" ry="3" fill="#fff"/>'+
      '<circle cx="'+x+'" cy="58.4" r="1.9" fill="#2a1f18"/>'+
      '<path d="M'+(x-4)+',56 Q'+x+','+(56-2+parp)+' '+(x+4)+',56 L'+(x+4)+',54 L'+(x-4)+',54 Z" fill="'+piel+'"/>'+
      (e>0.25?'<path d="M'+(x-4)+',62 Q'+x+',64.6 '+(x+4)+',62" stroke="rgba(80,40,60,'+(0.12+e*0.4).toFixed(2)+')" stroke-width="1.6" fill="none"/>':"");
  };
  /* cejas: el ceño se frunce */
  const ceja=function(x,s){ const dy=e*3.2; return '<path d="M'+(x-5*s)+','+(51+(s>0?0:0))+' L'+(x+5*s)+','+(51-1+dy*(s>0?1:1))+'" stroke="'+_mezclaHex(peloBase,"#8a8a86",S.canas/140)+'" stroke-width="2.2" stroke-linecap="round" transform="rotate('+(s*e*9)+' '+x+' 51)"/>'; };
  /* boca: de sonrisa a línea caída */
  const curva=(S.bien-50)/50*3.2 - e*2.2;
  const boca='<path d="M53,74 Q60,'+(74+curva).toFixed(1)+' 67,74" stroke="'+_mezclaHex(piel,"#2a0a0a",0.6)+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
  const frente=a>0.3?'<path d="M50,44 Q60,42 70,44" stroke="rgba(90,50,30,'+(0.1+a*0.25).toFixed(2)+')" stroke-width="1" fill="none"/>'+
    (a>0.6?'<path d="M52,47.5 Q60,45.8 68,47.5" stroke="rgba(90,50,30,'+(a*0.25).toFixed(2)+')" stroke-width="1" fill="none"/>':""):"";
  const surcos=a>0.45?'<path d="M50,66 Q48,71 51,75" stroke="rgba(90,50,30,'+(a*0.28).toFixed(2)+')" stroke-width="1" fill="none"/><path d="M70,66 Q72,71 69,75" stroke="rgba(90,50,30,'+(a*0.28).toFixed(2)+')" stroke-width="1" fill="none"/>':"";
  const barba=(!mujer&&e>0.45)?'<path d="M47,68 Q48,84 60,86 Q72,84 73,68 Q66,78 60,78 Q54,78 47,68 Z" fill="'+pelo+'" opacity="'+(0.18+e*0.35).toFixed(2)+'"/>':"";
  const gota=(S.sinGanar>=3)?'<path d="M75,49 q2.2,4 0,6 q-2.2,-2 0,-6 Z" fill="#9fd8ff" stroke="#5aa8d8" stroke-width=".6"/>':"";
  const peloSVG=mujer
    ? '<path d="M38,58 Q36,30 60,28 Q84,30 82,58 L84,88 Q76,80 76,62 Q70,42 60,42 Q48,42 44,62 Q44,80 36,88 Z" fill="'+pelo+'"/>'
    : '<path d="M43,56 Q41,33 60,31 Q79,33 77,56 Q76,44 70,40 Q60,37 50,40 Q44,44 43,56 Z" fill="'+pelo+'"/>'+
      (S.canas>60?'':'')+
      (S.edad>50?'<path d="M50,40 Q60,36 70,40 Q60,38.5 50,40 Z" fill="'+piel+'" opacity=".55"/>':"");
  const sombraOjos='<ellipse cx="60" cy="60" rx="16" ry="6" fill="rgba(60,30,40,'+(e*0.12).toFixed(2)+')"/>';
  return '<svg class="retrato-svg" viewBox="0 0 120 120" role="img" aria-label="Retrato del DT">'+
    '<defs><radialGradient id="retFondo" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#e9f7ff"/><stop offset=".6" stop-color="#8fcbf2"/><stop offset="1" stop-color="#2b78c2"/></radialGradient>'+
    '<linearGradient id="retBrillo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,255,255,.75)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></linearGradient>'+
    '<clipPath id="retClip"><circle cx="60" cy="60" r="58"/></clipPath></defs>'+
    '<circle cx="60" cy="60" r="58" fill="url(#retFondo)"/>'+
    '<g clip-path="url(#retClip)"><g transform="translate(60 64) scale(1.38) translate(-60 -64)">'+
      '<path d="M18,120 Q20,96 44,90 L76,90 Q100,96 102,120 Z" fill="#1f2530"/>'+
      '<path d="M50,90 L60,104 L70,90 Z" fill="#f4f6f8"/>'+
      '<path d="M57.5,92 L62.5,92 L63.5,110 L60,116 L56.5,110 Z" fill="'+kit[0]+'"/>'+
      '<path d="M57.5,92 L62.5,92 L61.5,96 L58.5,96 Z" fill="'+kit[1]+'" opacity=".85"/>'+
      '<rect x="54" y="78" width="12" height="13" rx="4" fill="'+piel+'"/>'+
      '<ellipse cx="60" cy="62" rx="17" ry="20" fill="'+piel+'"/>'+
      '<ellipse cx="43.5" cy="62" rx="2.6" ry="4" fill="'+piel+'"/><ellipse cx="76.5" cy="62" rx="2.6" ry="4" fill="'+piel+'"/>'+
      sombraOjos+barba+peloSVG+frente+surcos+
      ceja(53,-1)+ceja(67,1)+ojo(53)+ojo(67)+
      '<path d="M60,60 Q58,68 60,69.5 Q62,70 62.5,69" stroke="rgba(90,50,30,.35)" stroke-width="1.1" fill="none"/>'+
      boca+gota+
    '</g></g>'+
    '<ellipse cx="60" cy="14" rx="38" ry="11" fill="url(#retBrillo)" opacity=".4"/>'+
    '<circle cx="60" cy="60" r="58" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="2"/>'+
  '</svg>';
}
/* lo que te dice el espejo: sin adornos */
function espejoDT(){
  const S=estadoRetrato();
  const f=/^(f|mujer)/i.test(String((E&&E.perfil&&E.perfil.genero)||""));
  const g=function(m,fe){ return f?fe:m; };
  if(S.sucio) return T("esp_sucio","Duermes con el celular en la mano. Cada llamada puede ser la fiscalía.");
  if(S.estres>=75) return T("esp_roto","El cargo se te ve en la cara: ojeras, canas nuevas y una sonrisa que ya no sale.");
  if(S.estres>=50) return T("esp_tenso","Dormís mal. En la casa ya no preguntan cómo te fue.");
  if(S.sinGanar>=3) return T("esp_racha","Tres sin ganar. Se nota en cómo caminas por el pasillo.");
  if(S.bien>=80) return T("esp_bien","Hoy te reconoces en el espejo. Disfrútalo: en este cargo dura poco.");
  return g(T("esp_normal","Cansado, pero entero. Por ahora."),T("esp_normal_f","Cansada, pero entera. Por ahora."));
}

/* el avatar "retrato" se suma a los orbes MSN (se puede volver a los orbes tocándolo) */
(function(){
  if(typeof AVATARES!=="undefined" && AVATARES.indexOf("retrato")<0) AVATARES.unshift("retrato");
  if(typeof pintarAvatarBtn!=="function" || pintarAvatarBtn._ret) return;
  const orig=pintarAvatarBtn;
  pintarAvatarBtn=function(btn,av){
    if(av==="retrato"){
      btn.className="aero-avatar aero-orb retrato";
      btn.innerHTML=retratoSVG();
      btn.title=espejoDT();
      return;
    }
    return orig.apply(this,arguments);
  };
  pintarAvatarBtn._ret=true;
})();
