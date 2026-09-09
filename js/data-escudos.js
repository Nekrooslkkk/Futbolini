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
  SCR:{c1:"#d84315",c2:"#ffffff",txt:"SCR"},  RAN:{c1:"#b71c1c",c2:"#111111",txt:"RAN"}
};
/* color de texto legible sobre un fondo hex */
function _escContraste(hex){
  var h=(hex||"#000").replace("#",""); if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  var r=parseInt(h.substr(0,2),16), g=parseInt(h.substr(2,2),16), b=parseInt(h.substr(4,2),16);
  var lum=(0.299*r+0.587*g+0.114*b)/255;
  return lum>0.6?"#111111":"#ffffff";
}
/* devuelve un SVG (string) del escudo estilizado, o "" si el club no está */
function escudoSVG(id, px){
  var e=ESCUDOS_CLUB[id]; if(!e) return "";
  px=px||28;
  var txt=(e.txt||id), fs=txt.length>=3?11:(txt.length===2?14:17);
  var tc=_escContraste(e.c1);
  return '<svg viewBox="0 0 40 44" width="'+px+'" height="'+px+'" xmlns="http://www.w3.org/2000/svg" style="display:block">'+
    '<path d="M20 2 L37 8 V22 C37 34 20 42 20 42 C20 42 3 34 3 22 V8 Z" fill="'+e.c1+'" stroke="'+e.c2+'" stroke-width="2.2"/>'+
    '<path d="M20 2 L37 8 V14 L3 14 V8 Z" fill="'+e.c2+'"/>'+
    '<circle cx="20" cy="26" r="8.5" fill="none" stroke="'+e.c2+'" stroke-width="1.4" opacity=".55"/>'+
    '<text x="20" y="30" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="'+fs+'" fill="'+tc+'">'+txt+'</text>'+
    '</svg>';
}
/* HTML listo para el glifo: escudo SVG si existe, si no el emoji que reciba de fallback */
function escudoHTML(id, px, fallbackEmoji){
  var s=escudoSVG(id, px);
  return s || (fallbackEmoji||"");
}
/* escudo chico inline para tablas/calendario (alineado al texto); "" si no hay */
function escudoChip(id, px){
  px=px||18; var s=escudoSVG(id, px);
  return s?'<span style="display:inline-block;vertical-align:middle;width:'+px+'px;height:'+px+'px;margin-right:5px">'+s+'</span>':'';
}
