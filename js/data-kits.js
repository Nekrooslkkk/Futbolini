"use strict";
/* ============================================================
   FUTBOLINI 7.9112 · data-kits.js
   Camiseta, short y medias por club. Se carga ANTES de cancha.js.
   local/visita: [camiseta, short, medias] en #rrggbb.
   franja: null | "vertical" | "horizontal" | "banda" (solo si el patrón está en la fuente).
   Regla: si la ficha trae dos colores, la camiseta es el primero, el short el segundo
   y las medias repiten la camiseta. No se agrega un tercer color ni una raya.
   Un id, un kit. COB es Cobresal en 2026 y Cobreloa en 1991: los dos son naranja y negro.

   Fuera (sin short y medias con fuente; no se inventan):
   PDM, ELR, GCX, MST, BCN, SNA, NAC, LBL (Liga Metropolitana 1925).
   ENG: Litoral Press, 19 abr 2025, sobre el partido del 31 may 1925, dice camiseta azul.
   El short y las medias no aparecen. Queda fuera.
   ============================================================ */
const KITS={
  /* ---- Primera 2026 · par de CLUB_META (js/data-clubes-meta.js, Wikipedia / sitio / ANFP) salvo la línea que dice otra cosa ---- */
  CC: {local:["#ffffff","#111111","#ffffff"], visita:["#111111","#ffffff","#111111"], franja:null},
  /* Colo-Colo: camiseta blanca, pantalón negro (ficha 1925 del juego; Wikipedia). Medias blancas. Sin franja en la camiseta. */
  UCH:{local:["#003da5","#ffffff","#003da5"], visita:["#ffffff","#003da5","#ffffff"], franja:null},
  /* U de Chile: azul y blanco. El rojo de CLUB_META es la cinta, no la camiseta. */
  UC: {local:["#ffffff","#00205b","#ffffff"], visita:["#00205b","#ffffff","#00205b"], franja:"horizontal", franjaColor:"#00205b", franjaVisita:"horizontal", franjaColorVisita:"#ffffff"},
  /* La franja. Wikipedia Universidad Católica: blanca con banda azul; alternativa azul. */
  EVE:{local:["#ffd100","#0033a0","#ffd100"], visita:["#0033a0","#ffd100","#0033a0"], franja:null},
  PAL:{local:["#007a3d","#ffffff","#cc0000"], visita:["#ffffff","#007a3d","#ffffff"], franja:null},
  /* Palestino: verde, blanco y rojo (Wikipedia, colores de la bandera). Medias rojas. Sin franja. */
  COQ:{local:["#ffd100","#111111","#ffd100"], visita:["#111111","#ffd100","#ffd100"], franja:null},
  AUD:{local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:"vertical", franjaColor:"#ffffff", franjaVisita:"vertical", franjaColorVisita:"#007a33"},
  /* Audax Italiano: verde con franja vertical blanca (Wikipedia). */
  HUA:{local:["#111111","#0055a5","#111111"], visita:["#ffffff","#0055a5","#ffffff"], franja:null},
  OHI:{local:["#00843d","#ffffff","#00843d"], visita:["#ffffff","#00843d","#ffffff"], franja:null},
  NUB:{local:["#e30613","#ffffff","#e30613"], visita:["#ffffff","#e30613","#ffffff"], franja:null},
  COB:{local:["#f36c21","#111111","#f36c21"], visita:["#111111","#f36c21","#f36c21"], franja:null},
  /* COB 2026 = Cobresal. COB 1991 = Cobreloa. Mismo par naranja/negro en CLUB_META. Sin banda inventada. */
  CAL:{local:["#c8102e","#111111","#c8102e"], visita:["#ffffff","#c8102e","#ffffff"], franja:null},
  LSE:{local:["#c8102e","#ffffff","#c8102e"], visita:["#ffffff","#c8102e","#ffffff"], franja:null},
  DCO:{local:["#4b2e83","#ffffff","#4b2e83"], visita:["#ffffff","#4b2e83","#ffffff"], franja:null},
  UDC:{local:["#ffcc00","#003da5","#ffcc00"], visita:["#ffffff","#003da5","#ffffff"], franja:"horizontal", franjaColor:"#003da5", franjaVisita:"horizontal", franjaColorVisita:"#003da5"},
  /* UdeC: Wikipedia «Historia del uniforme»: camiseta amarilla y pantalón azul (auriazul). Sala de Prensa, 2 may 2025: franja azul. CLUB_META pone negro; no es el short. */
  LIM:{local:["#0055a4","#ffffff","#0055a4"], visita:["#ffffff","#0055a4","#ffffff"], franja:null},

  /* ---- Primera B · mismo par de CLUB_META ---- */
  SW: {local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:null},
  CBL:{local:["#f36c21","#111111","#f36c21"], visita:["#111111","#f36c21","#f36c21"], franja:null},
  /* Cobreloa (id moderno). Mismo naranja que COB y CBS: son clubes distintos con el mismo par. */
  SLQ:{local:["#ffd100","#111111","#ffd100"], visita:["#111111","#ffd100","#ffd100"], franja:null},
  ANT:{local:["#0055a4","#ffffff","#0055a4"], visita:["#ffffff","#0055a4","#ffffff"], franja:null},
  MAG:{local:["#003da5","#ffffff","#003da5"], visita:["#ffffff","#003da5","#ffffff"], franja:null},
  UES:{local:["#c8102e","#ffd100","#c8102e"], visita:["#ffd100","#c8102e","#ffd100"], franja:null},
  REC:{local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:null},
  PMO:{local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:null},
  SMA:{local:["#0055a4","#ffffff","#0055a4"], visita:["#ffffff","#0055a4","#ffffff"], franja:null},
  COP:{local:["#ffd100","#007a33","#ffd100"], visita:["#007a33","#ffd100","#007a33"], franja:null},
  TEM:{local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:null},
  IQQ:{local:["#0055a4","#ffffff","#0055a4"], visita:["#ffffff","#0055a4","#ffffff"], franja:null},
  /* Iquique, dragón celeste: el azul de CLUB_META. No se inventa short negro. */
  USF:{local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:null},
  CUR:{local:["#c8102e","#111111","#c8102e"], visita:["#ffffff","#c8102e","#ffffff"], franja:null},
  SCR:{local:["#c8102e","#111111","#c8102e"], visita:["#ffffff","#111111","#ffffff"], franja:null},
  /* Santa Cruz: footballkitarchive, copa local 2025, colores rojo/negro/verde (mitad y mitad). Uso rojo y negro. No dibujo la mitad. El verde de CLUB_META no va de camiseta. */
  RAN:{local:["#c8102e","#111111","#c8102e"], visita:["#111111","#c8102e","#c8102e"], franja:null},

  /* ---- Segunda · CLUB_META (Wikipedia / ANFP / ASIFUCH, comentario del archivo) ---- */
  TRA:{local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:null},
  COL:{local:["#0055a4","#ffffff","#0055a4"], visita:["#ffffff","#0055a4","#ffffff"], franja:null},
  OVA:{local:["#f36c21","#111111","#f36c21"], visita:["#111111","#f36c21","#f36c21"], franja:null},
  CNA:{local:["#0055a4","#ffffff","#0055a4"], visita:["#ffffff","#0055a4","#ffffff"], franja:null},
  BSA:{local:["#4b2e83","#ffffff","#4b2e83"], visita:["#ffffff","#4b2e83","#ffffff"], franja:null},
  RSJ:{local:["#ffffff","#007a33","#ffffff"], visita:["#007a33","#ffffff","#007a33"], franja:null},
  SCI:{local:["#111111","#e89bb8","#111111"], visita:["#e89bb8","#111111","#e89bb8"], franja:null},
  /* Santiago City: negro y rosa, CLUB_META (EN wiki). */
  SMO:{local:["#ffffff","#007a33","#ffffff"], visita:["#007a33","#ffffff","#007a33"], franja:null},
  LSC:{local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:null},
  OSO:{local:["#c8102e","#111111","#c8102e"], visita:["#111111","#c8102e","#c8102e"], franja:null},
  LIN:{local:["#c8102e","#ffffff","#c8102e"], visita:["#ffffff","#c8102e","#ffffff"], franja:null},
  /* Linares es albirrojo (data-segunda2026). El emoji azul de la ficha no es el color. */
  CLC:{local:["#ffd100","#007a33","#ffd100"], visita:["#007a33","#ffd100","#007a33"], franja:null},
  GVE:{local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:null},
  /* General Velásquez: CLUB_META «Verdes» (Wikipedia EN/PT). El emoji rojo de data-segunda2026 no se usa. */
  REN:{local:["#ffd100","#5eb1e8","#ffd100"], visita:["#5eb1e8","#ffd100","#5eb1e8"], franja:null},

  /* ---- 1991 y 2006, fuera del selector 2026, con fuente ---- */
  FV: {local:["#ffd100","#111111","#ffd100"], visita:["#111111","#ffd100","#ffd100"], franja:null},
  /* Fernández Vial, aurinegro. CLUB_META. */
  CBS:{local:["#f36c21","#111111","#f36c21"], visita:["#111111","#f36c21","#f36c21"], franja:null},
  /* Cobresal en 1991 y 2006. En 2026 el mismo club es el id COB. Mismo par. */

  /* ---- Argentina · CLUB_META_ARG (js/data-planteles.js, Wikipedia) salvo la línea que corrige ---- */
  RIV:{local:["#ffffff","#111111","#ffffff"], visita:["#e31837","#ffffff","#e31837"], franja:"banda", franjaColor:"#e31837"},
  /* River: blanca con banda roja, short negro, medias blancas (Wikipedia). La alternativa roja va lisa: la faja es del blanco. */
  BOC:{local:["#003da5","#003da5","#003da5"], visita:["#ffd100","#003da5","#ffd100"], franja:"horizontal", franjaColor:"#ffd100", franjaVisita:"horizontal", franjaColorVisita:"#003da5"},
  /* Boca: azul con banda horizontal amarilla (Wikipedia). */
  RAC:{local:["#7ec8e3","#111111","#7ec8e3"], visita:["#ffffff","#111111","#ffffff"], franja:"vertical", franjaColor:"#ffffff", franjaVisita:"vertical", franjaColorVisita:"#7ec8e3"},
  /* Racing: celeste y blanco a rayas verticales, short negro. */
  IND:{local:["#e31837","#e31837","#e31837"], visita:["#ffffff","#e31837","#ffffff"], franja:null},
  /* Independiente, liso. El Rojo. */
  VEL:{local:["#ffffff","#003da5","#ffffff"], visita:["#003da5","#ffffff","#003da5"], franja:null},
  /* Vélez: blanco y azul (Wikipedia). CLUB_META_ARG pone negro como segundo hex; el short es azul. */
  SLO:{local:["#003da5","#003da5","#003da5"], visita:["#ffffff","#003da5","#ffffff"], franja:"vertical", franjaColor:"#e31837", franjaVisita:"vertical", franjaColorVisita:"#e31837"},
  /* San Lorenzo, azulgrana a rayas verticales. */
  ELP:{local:["#e31837","#111111","#e31837"], visita:["#ffffff","#111111","#ffffff"], franja:"vertical", franjaColor:"#ffffff", franjaVisita:"vertical", franjaColorVisita:"#e31837"},
  /* Estudiantes LP: rojo y blanco a rayas, short negro. */
  ROS:{local:["#003da5","#003da5","#003da5"], visita:["#ffd100","#003da5","#ffd100"], franja:"vertical", franjaColor:"#ffd100", franjaVisita:"vertical", franjaColorVisita:"#003da5"},
  /* Rosario Central: azul y amarillo a rayas verticales. */
  TAL:{local:["#003da5","#ffffff","#003da5"], visita:["#ffffff","#003da5","#ffffff"], franja:"vertical", franjaColor:"#ffffff", franjaVisita:"vertical", franjaColorVisita:"#003da5"},
  /* Talleres: azul y blanco a rayas verticales. */
  HUR:{local:["#ffffff","#ffffff","#ffffff"], visita:["#e31837","#ffffff","#e31837"], franja:null},
  /* Huracán: camiseta blanca. El globo es el escudo, no una franja. El rojo de CLUB_META_ARG no es el short. */
  LAN:{local:["#6b2d3c","#6b2d3c","#ffffff"], visita:["#ffffff","#6b2d3c","#ffffff"], franja:null},
  /* Lanús, granate liso. CLUB_META_ARG. */
  ARG:{local:["#e31837","#e31837","#e31837"], visita:["#ffffff","#e31837","#ffffff"], franja:null},
  NEW:{local:["#e31837","#111111","#e31837"], visita:["#111111","#e31837","#111111"], franja:"vertical", franjaColor:"#111111", franjaVisita:"vertical", franjaColorVisita:"#e31837"},
  /* Newell's: rojo y negro a rayas verticales. */
  BEL:{local:["#7ec8e3","#ffffff","#7ec8e3"], visita:["#ffffff","#7ec8e3","#ffffff"], franja:null},
  /* Belgrano: celeste (Wikipedia). CLUB_META_ARG trae #003da5, que no es ese celeste. Sin raya. */
  DYJ:{local:["#ffd100","#007a33","#ffd100"], visita:["#007a33","#ffd100","#007a33"], franja:null},
  INS:{local:["#e31837","#ffffff","#e31837"], visita:["#ffffff","#e31837","#ffffff"], franja:"vertical", franjaColor:"#ffffff", franjaVisita:"vertical", franjaColorVisita:"#e31837"},
  /* Instituto: rojo y blanco a rayas verticales. */
  UNI:{local:["#e31837","#ffffff","#e31837"], visita:["#ffffff","#e31837","#ffffff"], franja:"vertical", franjaColor:"#ffffff", franjaVisita:"vertical", franjaColorVisita:"#e31837"},
  /* Unión de Santa Fe: rojo y blanco a rayas verticales. */
  GLP:{local:["#ffffff","#003da5","#ffffff"], visita:["#003da5","#ffffff","#003da5"], franja:null},
  TUC:{local:["#7ec8e3","#ffffff","#7ec8e3"], visita:["#ffffff","#7ec8e3","#ffffff"], franja:"vertical", franjaColor:"#ffffff", franjaVisita:"vertical", franjaColorVisita:"#7ec8e3"},
  /* Atlético Tucumán: celeste y blanco a rayas. CLUB_META_ARG ya trae #7ec8e3. */
  TIG:{local:["#003da5","#003da5","#003da5"], visita:["#ffffff","#003da5","#ffffff"], franja:"vertical", franjaColor:"#e31837", franjaVisita:"vertical", franjaColorVisita:"#e31837"},
  /* Tigre: azul y rojo a rayas verticales. */
  BAN:{local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:"vertical", franjaColor:"#ffffff", franjaVisita:"vertical", franjaColorVisita:"#007a33"},
  /* Banfield: verde y blanco a rayas verticales. */
  PLA:{local:["#ffffff","#5c4033","#ffffff"], visita:["#5c4033","#ffffff","#5c4033"], franja:"horizontal", franjaColor:"#5c4033", franjaVisita:"horizontal", franjaColorVisita:"#ffffff"},
  /* Platense: blanco con faja marrón. CLUB_META_ARG #5c4033. */
  CCO:{local:["#ffffff","#111111","#ffffff"], visita:["#111111","#ffffff","#111111"], franja:"vertical", franjaColor:"#111111", franjaVisita:"vertical", franjaColorVisita:"#ffffff"},
  /* Central Córdoba (SdE): blanco y negro a rayas verticales. */
  IRV:{local:["#003da5","#ffffff","#003da5"], visita:["#ffffff","#003da5","#ffffff"], franja:null},
  SAR:{local:["#007a33","#ffffff","#007a33"], visita:["#ffffff","#007a33","#ffffff"], franja:null},
  ALD:{local:["#007a33","#ffd100","#007a33"], visita:["#ffd100","#007a33","#ffd100"], franja:null},
  GME:{local:["#ffffff","#003da5","#ffffff"], visita:["#003da5","#ffffff","#003da5"], franja:null},
  RIE:{local:["#111111","#ffffff","#111111"], visita:["#ffffff","#111111","#ffffff"], franja:null},
  ERC:{local:["#1d4fa0","#111111","#ffffff"], visita:["#ffffff","#1d4fa0","#ffffff"], franja:null},
  /* Estudiantes RC: footballkitarchive, local 2026 (22 ene 2026), liso, azul/negro/blanco. CLUB_META_ARG rojo no es ese kit. */
  BAR:{local:["#ffffff","#111111","#c8102e"], visita:["#111111","#111111","#111111"], franja:"vertical", franjaColor:"#c8102e"}
  /* Barracas: Wikipedia, uniforme titular, blanca con franjas verticales rojas y medias rojas. Short negro: footballkitarchive 2026 lista negro entre los tres colores. Alternativa toda negra (Wikipedia). */
};

/* La pieza que se pone: local, o visita si el partido lo pide. La franja de la alternativa no se pinta sobre la titular. */
function piezaKit(id, visita){
  const k=(typeof KITS==="object")&&id&&KITS[id];
  if(!k||!k.local||k.local.length<3) return null;
  const vis=!!visita && k.visita && k.visita.length>=3;
  const a=vis?k.visita:k.local;
  return {
    camiseta:a[0], short:a[1], medias:a[2],
    franja:vis?(k.franjaVisita||null):(k.franja||null),
    franjaColor:vis?(k.franjaColorVisita||null):(k.franjaColor||null)
  };
}

/* Puro: lo usa el doctor kits_clubes. ids = clubes elegibles. Un color que no es #rrggbb entra en mal. */
function revisarKits(ids, kits){
  const HEX=/^#[0-9a-fA-F]{6}$/;
  const FRANJA={vertical:1, horizontal:1, banda:1};
  const mal=[], sin=[];
  const K=kits||{};
  (ids||[]).forEach(function(id){
    const k=K[id];
    if(!k){ sin.push(id); return; }
    ["local","visita"].forEach(function(lado){
      const a=k[lado];
      if(!a||a.length<3){ mal.push(id+" "+lado+" incompleto"); return; }
      for(let i=0;i<3;i++) if(!HEX.test(String(a[i]||""))) mal.push(id+" "+lado+"["+i+"]="+a[i]);
    });
    if(k.franja!=null && !FRANJA[k.franja]) mal.push(id+" franja="+k.franja);
    if(k.franja && !HEX.test(String(k.franjaColor||""))) mal.push(id+" franjaColor="+k.franjaColor);
    if(k.franjaVisita!=null && !FRANJA[k.franjaVisita]) mal.push(id+" franjaVisita="+k.franjaVisita);
    if(k.franjaVisita && !HEX.test(String(k.franjaColorVisita||""))) mal.push(id+" franjaColorVisita="+k.franjaColorVisita);
  });
  return {ok:!mal.length && !sin.length, sin:sin, mal:mal, con:(ids||[]).length-sin.length, total:(ids||[]).length};
}
