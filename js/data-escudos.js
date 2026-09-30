"use strict";
/* ============================================================
   FUTBOLINI · data-escudos.js
   Escudos ESTILIZADOS por código (SVG). NO son los escudos oficiales:
   forma de escudo genérica con los COLORES del club y su sigla. 100% offline,
   sin copyright, sin subir archivos. Grok puede refinar/ampliar ESCUDOS_CLUB.
   Si un club no está acá, el juego cae al glifo de texto (emoji) de siempre.
   ============================================================ */
var ESCUDOS_CLUB = {
  /* Primera 2026 */
  CC:{c1:"#1a1a1a",c2:"#ffffff",txt:"CC"},   UCH:{c1:"#0a3d91",c2:"#ffffff",txt:"U"},
  UC:{c1:"#12428c",c2:"#ffffff",txt:"UC"},    PAL:{c1:"#1a7a3c",c2:"#d02b2b",txt:"PAL"},
  LIM:{c1:"#2e8b57",c2:"#ffffff",txt:"LIM"},  EVE:{c1:"#0e4d92",c2:"#f5c518",txt:"EVE"},
  COQ:{c1:"#f2c200",c2:"#111111",txt:"COQ"},  AUD:{c1:"#1f8b3a",c2:"#ffffff",txt:"AUD"},
  HUA:{c1:"#1b2a4a",c2:"#2f6fb0",txt:"HUA"},  OHI:{c1:"#1f7ac2",c2:"#ffffff",txt:"OHI"},
  NUB:{c1:"#c8202f",c2:"#ffffff",txt:"NUB"},  COB:{c1:"#e8681a",c2:"#ffffff",txt:"COB"},
  CAL:{c1:"#b71c1c",c2:"#ffffff",txt:"CAL"},  LSE:{c1:"#6a1b9a",c2:"#ffffff",txt:"LSE"},
  DCO:{c1:"#4a148c",c2:"#ffffff",txt:"DC"},   UDC:{c1:"#f5c518",c2:"#0d3b66",txt:"UDC"},
  /* Primera B 2026 */
  CBL:{c1:"#ff6a00",c2:"#ffffff",txt:"CBL"},  SW:{c1:"#1b7a3d",c2:"#ffffff",txt:"SW"},
  SLQ:{c1:"#f2c200",c2:"#0d3b66",txt:"SL"},   ANT:{c1:"#6a1b9a",c2:"#ffffff",txt:"ANT"},
  MAG:{c1:"#4aa3df",c2:"#ffffff",txt:"MAG"},  UES:{c1:"#c8202f",c2:"#ffffff",txt:"UE"},
  REC:{c1:"#2e7d32",c2:"#ffffff",txt:"REC"},  PMO:{c1:"#1b5e20",c2:"#ffffff",txt:"PM"},
  SMA:{c1:"#1565c0",c2:"#ffffff",txt:"SMA"},  COP:{c1:"#7b1fa2",c2:"#ffffff",txt:"COP"},
  TEM:{c1:"#1b7a3d",c2:"#ffffff",txt:"TEM"},  IQQ:{c1:"#29b6f6",c2:"#ffffff",txt:"IQQ"},
  USF:{c1:"#b8860b",c2:"#ffffff",txt:"USF"},  CUR:{c1:"#f2c200",c2:"#111111",txt:"CUR"},
  SCR:{c1:"#d84315",c2:"#ffffff",txt:"SCR"},  RAN:{c1:"#b71c1c",c2:"#111111",txt:"RAN"},
  /* Segunda 2026 · colores de CLUB_META (estilizado; archivos SVG ya en disco) */
  SMO:{c1:"#111111",c2:"#007a33",txt:"SMO"}, LSC:{c1:"#007a33",c2:"#ffffff",txt:"LSC"},
  OSO:{c1:"#c8102e",c2:"#111111",txt:"OSO"}, LIN:{c1:"#c8102e",c2:"#ffffff",txt:"LIN"},
  CLC:{c1:"#ffd100",c2:"#007a33",txt:"CLC"}, TRA:{c1:"#007a33",c2:"#ffffff",txt:"TRA"},
  COL:{c1:"#0055a4",c2:"#ffffff",txt:"COL"}, OVA:{c1:"#f36c21",c2:"#111111",txt:"OVA"},
  CNA:{c1:"#0055a4",c2:"#ffffff",txt:"CNA"}, BSA:{c1:"#4b2e83",c2:"#ffffff",txt:"BSA"},
  RSJ:{c1:"#ffffff",c2:"#007a33",txt:"RSJ"}, SCI:{c1:"#111111",c2:"#e89bb8",txt:"SCI"},
  GVE:{c1:"#007a33",c2:"#ffffff",txt:"GVE"}, REN:{c1:"#ffd100",c2:"#5eb1e8",txt:"REN"},
  /* AFA 2026 · colores de camiseta (estilizado, no el escudo oficial) */
  RIV:{c1:"#ffffff",c2:"#e31837",txt:"RIV"}, BOC:{c1:"#003da5",c2:"#ffd100",txt:"BOC"},
  RAC:{c1:"#8fd3ff",c2:"#ffffff",txt:"RAC"}, IND:{c1:"#c8102e",c2:"#ffffff",txt:"IND"},
  VEL:{c1:"#ffffff",c2:"#0055a4",txt:"VEL"}, SLO:{c1:"#003da5",c2:"#c8102e",txt:"SLO"},
  ELP:{c1:"#c8102e",c2:"#ffffff",txt:"ELP"}, ROS:{c1:"#003da5",c2:"#ffd100",txt:"ROS"},
  TAL:{c1:"#003da5",c2:"#ffffff",txt:"TAL"}, HUR:{c1:"#c8102e",c2:"#ffffff",txt:"HUR"},
  LAN:{c1:"#6b2332",c2:"#ffffff",txt:"LAN"}, ARG:{c1:"#c8102e",c2:"#ffffff",txt:"ARG"},
  NEW:{c1:"#c8102e",c2:"#111111",txt:"NEW"}, BEL:{c1:"#6baed6",c2:"#ffffff",txt:"BEL"},
  DYJ:{c1:"#ffd100",c2:"#007a33",txt:"DYJ"}, INS:{c1:"#c8102e",c2:"#ffffff",txt:"INS"},
  UNI:{c1:"#c8102e",c2:"#ffffff",txt:"UNI"}, GLP:{c1:"#ffffff",c2:"#003da5",txt:"GLP"},
  TUC:{c1:"#6baed6",c2:"#ffffff",txt:"TUC"}, TIG:{c1:"#003da5",c2:"#c8102e",txt:"TIG"},
  BAN:{c1:"#007a33",c2:"#ffffff",txt:"BAN"}, PLA:{c1:"#6b4423",c2:"#ffffff",txt:"PLA"},
  CCO:{c1:"#111111",c2:"#ffffff",txt:"CCO"}, IRV:{c1:"#003da5",c2:"#ffffff",txt:"IRV"},
  SAR:{c1:"#007a33",c2:"#ffffff",txt:"SAR"}, ALD:{c1:"#007a33",c2:"#ffd100",txt:"ALD"},
  GME:{c1:"#ffffff",c2:"#003da5",txt:"GME"}, RIE:{c1:"#111111",c2:"#ffffff",txt:"RIE"},
  ERC:{c1:"#c8102e",c2:"#ffffff",txt:"ERC"}, BAR:{c1:"#c8102e",c2:"#ffffff",txt:"BAR"}
};
/* color de texto legible sobre un fondo hex */
function _escContraste(hex){
  var h=(hex||"#000").replace("#",""); if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  var r=parseInt(h.substr(0,2),16), g=parseInt(h.substr(2,2),16), b=parseInt(h.substr(4,2),16);
  var lum=(0.299*r+0.587*g+0.114*b)/255;
  return lum>0.6?"#111111":"#ffffff";
}
/* 7.9107 · rivales de CONMEBOL (vienen por NOMBRE, sin id): colores de camiseta, dato público. Estilizado, no el oficial. */
var ESCUDOS_NOMBRE={
  "Flamengo":{c1:"#c8102e",c2:"#111111",txt:"FLA"}, "Palmeiras":{c1:"#006437",c2:"#ffffff",txt:"PAL"},
  "River Plate":{c1:"#ffffff",c2:"#e31837",txt:"RIV"}, "Boca Juniors":{c1:"#003da5",c2:"#ffd100",txt:"BOC"},
  "São Paulo":{c1:"#ffffff",c2:"#c8102e",txt:"SPF"}, "Cruzeiro":{c1:"#0033a0",c2:"#ffffff",txt:"CRU"},
  "Racing Club":{c1:"#8fd3ff",c2:"#ffffff",txt:"RAC"}, "Nacional":{c1:"#ffffff",c2:"#0b2d6b",txt:"NAC"},
  "LDU Quito":{c1:"#ffffff",c2:"#c8102e",txt:"LDU"}, "Atlético Nacional":{c1:"#00843d",c2:"#ffffff",txt:"ATN"},
  "Independiente del Valle":{c1:"#0b2d6b",c2:"#111111",txt:"IDV"}, "Peñarol":{c1:"#ffd100",c2:"#111111",txt:"CAP"},
  "Cerro Porteño":{c1:"#c8102e",c2:"#003da5",txt:"CCP"}, "Olimpia":{c1:"#ffffff",c2:"#111111",txt:"OLI"},
  "Libertad":{c1:"#111111",c2:"#ffffff",txt:"LIB"}, "Bolívar":{c1:"#6cace4",c2:"#ffffff",txt:"BOL"},
  "Junior":{c1:"#c8102e",c2:"#ffffff",txt:"JUN"}, "Universitario":{c1:"#f3e5c0",c2:"#9b1b30",txt:"U"},
  "Sporting Cristal":{c1:"#6cace4",c2:"#ffffff",txt:"SC"}, "Vélez Sarsfield":{c1:"#ffffff",c2:"#0055a4",txt:"VEL"}
};
/* sigla de hasta 3 letras desde un nombre ("Santiago National" → SN) */
function _escSigla(n){
  var w=String(n||"?").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[()]/g,"").split(/[\s.-]+/)
    .filter(function(x){ return x&&!/^(de|del|la|las|los|el|y|club|deportes|deportivo|cd|fc)$/i.test(x); });
  if(!w.length) return "?";
  return (w.length===1?w[0].slice(0,3):w.slice(0,3).map(function(x){ return x[0]; }).join("")).toUpperCase();
}
/* escudo de cualquier club: por id, por nombre (CONMEBOL) o generado con la sigla en colores neutros (no se inventan
   colores de un club histórico que no tenemos documentado) */
function _escDatos(id){
  if(ESCUDOS_CLUB[id]) return ESCUDOS_CLUB[id];
  var c=(typeof clubLookup==="function")?clubLookup(id):null, n=(c&&(c.n||c.c))||id;
  if(ESCUDOS_NOMBRE[n]) return ESCUDOS_NOMBRE[n];
  if(ESCUDOS_NOMBRE[id]) return ESCUDOS_NOMBRE[id];
  if(!id) return null;
  var NEUTROS=["#2f3e55","#3d4a3a","#4a3b3b","#34495e","#3b3f4a","#44403c"], h=0, k=String(n);
  for(var i=0;i<k.length;i++) h=(h*31+k.charCodeAt(i))|0;
  return {c1:NEUTROS[Math.abs(h)%NEUTROS.length], c2:"#d9dee6", txt:_escSigla(n), gen:true};
}
/* devuelve un SVG (string) del escudo estilizado; 7.9107: ya nunca "" (todo club tiene uno) */
function escudoSVG(id, px){
  var e=_escDatos(id); if(!e) return "";
  px=px||28;
  var txt=(e.txt||id), fs=txt.length>=3?11:(txt.length===2?14:17);
  var tc=_escContraste(e.c1);
  return '<svg viewBox="0 0 40 44" width="'+px+'" height="'+px+'" xmlns="http://www.w3.org/2000/svg" style="display:block">'+
    '<path d="M20 2 L37 8 V22 C37 34 20 42 20 42 C20 42 3 34 3 22 V8 Z" fill="'+e.c1+'" stroke="'+e.c2+'" stroke-width="2.2"/>'+
    '<path d="M20 2 L37 8 V14 L3 14 V8 Z" fill="'+e.c2+'"/>'+
    '<circle cx="20" cy="26" r="8.5" fill="none" stroke="'+e.c2+'" stroke-width="1.4" opacity=".55"/>'+
    '<text x="20" y="30" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="'+fs+'" fill="'+tc+'">'+_escAttr(txt)+'</text>'+
    '</svg>';
}
/* HTML listo para el glifo: archivo Commons/estilizado si hay, si no SVG inline, si no emoji */
/* 7.9037 · escudo que ya falló (sin internet, archivo que falta): la próxima vez va el dibujo
   directo, sin <img> que falla de nuevo en cada tabla. */
var _ESC_FALLO={};
/* 7.9118 · nada de manejador onerror escrito dentro del HTML: la CSP lo bloquea y metía el id del club dentro de código.
   Los datos van en atributos escapados y un solo escuchador (fase de captura) decide qué hacer si la imagen falla. */
function _escAttr(v){ return String(v==null?"":v).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escudoHTML(id, px, fallbackEmoji){
  px=px||28;
  var f=typeof ESCUDOS_FOTOS!=="undefined" && (ESCUDOS_FOTOS[id]||(function(){ var c=(typeof clubLookup==="function")?clubLookup(id):null; var n=(c&&(c.n||c.c))||id; return ESCUDOS_FOTOS["n:"+n]; })());
  if(f&&f.src&&!_ESC_FALLO[id]){
    /* si el archivo no carga, NO desaparece: cae al escudo estilizado (o emoji). */
    return '<img class="esc-img" src="'+f.src+'" width="'+px+'" height="'+px+'" alt="" '+
      'style="width:'+px+'px;height:'+px+'px;object-fit:contain;display:block" '+
      'data-esc-id="'+_escAttr(id)+'" data-esc-px="'+(px|0)+'" data-esc-emo="'+_escAttr(fallbackEmoji||"")+'">';
  }
  var s=escudoSVG(id, px);
  return s || (fallbackEmoji||"");
}
/* fallback cuando el archivo de escudo (Commons/footylogos) no carga: reemplaza el <img>
   por el escudo estilizado inline; si el club no tiene estilizado, deja el emoji o lo esconde. */
function _escFall(img, id, px, emoji){
  _ESC_FALLO[id]=1;
  try{
    var s=(typeof escudoSVG==="function")?escudoSVG(id, px):"";
    if(s){ var w=document.createElement("span"); w.innerHTML=s; if(w.firstChild) img.parentNode.replaceChild(w.firstChild, img); else img.style.display="none"; }
    else if(emoji){ var e=document.createElement("span"); e.textContent=emoji; img.parentNode.replaceChild(e, img); }
    else img.style.display="none";
  }catch(e){ try{ img.style.display="none"; }catch(_){ } }
}
if(typeof window!=="undefined") window._escFall=_escFall;
function _imgFallo(ev){
  var t=ev&&ev.target; if(!t||t.tagName!=="IMG"||!t.getAttribute) return;
  if(t.hasAttribute("data-esc-id")){ var id=t.getAttribute("data-esc-id"); t.removeAttribute("data-esc-id"); _escFall(t, id, +t.getAttribute("data-esc-px")||28, t.getAttribute("data-esc-emo")||""); }
  else if(t.hasAttribute("data-ocultar-si-falla")) t.style.display="none";
}
if(typeof document!=="undefined"&&document.addEventListener) document.addEventListener("error", _imgFallo, true);
/* escudo chico inline para tablas/calendario (alineado al texto); "" si no hay */
function escudoChip(id, px){
  px=px||18;
  var h=escudoHTML(id, px, "");
  return h?'<span style="display:inline-block;vertical-align:middle;width:'+px+'px;height:'+px+'px;margin-right:5px">'+h+'</span>':'';
}

const ESCUDOS_FOTOS={
  CC:{src:"img/clubes/CC.svg",tipo:"commons"},
  UCH:{src:"img/clubes/UCH.png",tipo:"commons"},
  UC:{src:"img/clubes/UC.svg",tipo:"commons"},
  PAL:{src:"img/clubes/PAL.svg",tipo:"commons"},
  LIM:{src:"img/clubes/LIM.svg",tipo:"estilizado"},
  EVE:{src:"img/clubes/EVE.png",tipo:"commons"},
  COQ:{src:"img/clubes/COQ.svg",tipo:"estilizado"},
  AUD:{src:"img/clubes/AUD.png",tipo:"commons"},
  HUA:{src:"img/clubes/HUA.svg",tipo:"commons"},
  OHI:{src:"img/clubes/OHI.svg",tipo:"estilizado"},
  NUB:{src:"img/clubes/NUB.png",tipo:"commons"},
  COB:{src:"img/clubes/COB.svg",tipo:"estilizado"},
  CAL:{src:"img/clubes/CAL.svg",tipo:"commons"},   /* escudo actual (footylogos), reemplaza el png azul viejo */
  LSE:{src:"img/clubes/LSE.svg",tipo:"estilizado"},
  DCO:{src:"img/clubes/DCO.svg",tipo:"commons"},
  UDC:{src:"img/clubes/UDC.svg",tipo:"estilizado"},
  CBL:{src:"img/clubes/CBL.svg",tipo:"commons"},
  SW:{src:"img/clubes/SW.png",tipo:"commons"},
  SLQ:{src:"img/clubes/SLQ.jpg",tipo:"commons"},
  ANT:{src:"img/clubes/ANT.svg",tipo:"estilizado"},
  MAG:{src:"img/clubes/MAG.png",tipo:"commons"},
  UES:{src:"img/clubes/UES.svg",tipo:"estilizado"},
  REC:{src:"img/clubes/REC.svg",tipo:"estilizado"},
  PMO:{src:"img/clubes/PMO.svg",tipo:"estilizado"},
  SMA:{src:"img/clubes/SMA.svg",tipo:"estilizado"},
  COP:{src:"img/clubes/COP.png",tipo:"commons"},
  TEM:{src:"img/clubes/TEM.png",tipo:"commons"},   /* 7.9109 · Commons, licencia libre (img/FUENTES.md) */
  IQQ:{src:"img/clubes/IQQ.svg",tipo:"estilizado"},
  USF:{src:"img/clubes/USF.svg",tipo:"estilizado"},
  CUR:{src:"img/clubes/CUR.png",tipo:"commons"},
  SCR:{src:"img/clubes/SCR.svg",tipo:"estilizado"},
  RAN:{src:"img/clubes/RAN.png",tipo:"commons"},
  /* Segunda 2026 · SVG estilizado ya en disco (no estaban cableados) */
  SMO:{src:"img/clubes/SMO.svg",tipo:"estilizado"},
  LSC:{src:"img/clubes/LSC.svg",tipo:"estilizado"},
  OSO:{src:"img/clubes/OSO.svg",tipo:"estilizado"},
  LIN:{src:"img/clubes/LIN.png",tipo:"commons"},   /* 7.9109 · Commons, licencia libre (img/FUENTES.md) */
  CLC:{src:"img/clubes/CLC.png",tipo:"commons"},   /* 7.9109 · Commons, licencia libre (img/FUENTES.md) */
  TRA:{src:"img/clubes/TRA.svg",tipo:"estilizado"},
  COL:{src:"img/clubes/COL.svg",tipo:"estilizado"},
  OVA:{src:"img/clubes/OVA.svg",tipo:"estilizado"},
  CNA:{src:"img/clubes/CNA.png",tipo:"commons"},   /* 7.9109 · Commons, licencia libre (img/FUENTES.md) */
  BSA:{src:"img/clubes/BSA.svg",tipo:"estilizado"},
  RSJ:{src:"img/clubes/RSJ.svg",tipo:"estilizado"},
  SCI:{src:"img/clubes/SCI.svg",tipo:"estilizado"},
  GVE:{src:"img/clubes/GVE.svg",tipo:"estilizado"},
  REN:{src:"img/clubes/REN.svg",tipo:"estilizado"},
  /* 7.9109 · escudos con licencia libre de Wikimedia Commons (verificada archivo por archivo; créditos en
     img/FUENTES.md). AFA 2026 y rivales de CONMEBOL (estos van por nombre: "n:Nombre"). */
  ARG:{src:"img/clubes/ARG.png",tipo:"commons"},
  BEL:{src:"img/clubes/BEL.png",tipo:"commons"},
  BOC:{src:"img/clubes/BOC.png",tipo:"commons"},
  DYJ:{src:"img/clubes/DYJ.png",tipo:"commons"},
  ELP:{src:"img/clubes/ELP.png",tipo:"commons"},
  GLP:{src:"img/clubes/GLP.png",tipo:"commons"},
  HUR:{src:"img/clubes/HUR.png",tipo:"commons"},
  IND:{src:"img/clubes/IND.png",tipo:"commons"},
  INS:{src:"img/clubes/INS.png",tipo:"commons"},
  LAN:{src:"img/clubes/LAN.png",tipo:"commons"},
  MST:{src:"img/clubes/MST.png",tipo:"commons"},
  NEW:{src:"img/clubes/NEW.png",tipo:"commons"},
  PLA:{src:"img/clubes/PLA.png",tipo:"commons"},
  RAC:{src:"img/clubes/RAC.png",tipo:"commons"},
  RIV:{src:"img/clubes/RIV.png",tipo:"commons"},
  ROS:{src:"img/clubes/ROS.png",tipo:"commons"},
  SAR:{src:"img/clubes/SAR.png",tipo:"commons"},
  SLO:{src:"img/clubes/SLO.png",tipo:"commons"},
  TAL:{src:"img/clubes/TAL.png",tipo:"commons"},
  TUC:{src:"img/clubes/TUC.png",tipo:"commons"},
  VEL:{src:"img/clubes/VEL.png",tipo:"commons"},
  "n:Boca Juniors":{src:"img/clubes/BOC.png",tipo:"commons"},
  "n:Bolívar":{src:"img/clubes/CM_BOLIVAR.png",tipo:"commons"},
  "n:Cruzeiro":{src:"img/clubes/CM_CRUZEIRO.png",tipo:"commons"},
  "n:Independiente del Valle":{src:"img/clubes/CM_INDEPENDIE.png",tipo:"commons"},
  "n:Junior":{src:"img/clubes/CM_JUNIOR.png",tipo:"commons"},
  "n:Olimpia":{src:"img/clubes/CM_OLIMPIA.png",tipo:"commons"},
  "n:Palmeiras":{src:"img/clubes/CM_PALMEIRAS.png",tipo:"commons"},
  "n:Peñarol":{src:"img/clubes/CM_PENAROL.png",tipo:"commons"},
  "n:Racing Club":{src:"img/clubes/RAC.png",tipo:"commons"},
  "n:River Plate":{src:"img/clubes/RIV.png",tipo:"commons"},
  "n:Sporting Cristal":{src:"img/clubes/CM_SPORTINGCR.png",tipo:"commons"},
  "n:São Paulo":{src:"img/clubes/CM_SAOPAULO.png",tipo:"commons"},
  "n:Vélez Sarsfield":{src:"img/clubes/VEL.png",tipo:"commons"}
};
function escudoArchivo(id){return (typeof ESCUDOS_FOTOS!=='undefined'&&ESCUDOS_FOTOS[id])||null;}
