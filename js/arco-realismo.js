"use strict";
/* ============================================================
   FUTBOLINI · arco-realismo.js — 7.9090 · penal, tiro libre y córner con luz y textura
   Pedido del autor: "se ve muy feo y Paint; subirlo a ese realismo tipo FIFA / Score / juego flash /
   celu Nokia, lo mismo la cancha". La escena (arco3d.js) ya era 3D con cámara; le faltaba LUZ y TEXTURA:
   todo eran colores planos. Esta capa se engancha a las piezas de la escena sin tocar su lógica:
   · Pasto: grano, franjas de corte marcadas, degradé lejos→cerca y el foco de luz sobre el área.
   · Sombras de los palos y de la red sobre el pasto (focos detrás de la tribuna).
   · Figuras: contorno fino oscuro y sombra de contacto (el look de juego flash / FIFA de la época).
   · Tribuna: bruma de estadio de noche (lo alto se hunde en la oscuridad) y halos de los focos.
   · Pelota: brillo especular. Todo el cuadro: tono de transmisión nocturna.
   Modo liviano (body.perf): sin filtros ni grano (se ve plano pero vuela). Animaciones OFF no afecta: nada
   de esto se mueve.
   ============================================================ */
function _arcoRealOn(){ return !(document.body&&document.body.classList.contains("perf")); }

const ARCO_REAL_DEFS=
  /* grano del pasto: briznas claras y oscuras (patrón barato, sin feTurbulence) */
  '<pattern id="a3Grano" width="7" height="7" patternUnits="userSpaceOnUse">'+
    '<path d="M1,6 l.5,-1.6 M4,3 l.4,-1.4 M6,6.5 l.3,-1.2 M2.5,2 l.4,-1.3" stroke="rgba(190,240,150,.28)" stroke-width=".55"/>'+
    '<path d="M3,6 l.4,-1.5 M5.5,1.5 l.3,-1.2 M.5,3 l.4,-1.4" stroke="rgba(0,35,5,.35)" stroke-width=".6"/>'+
  '</pattern>'+
  '<linearGradient id="a3PastoProf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(0,20,10,.55)"/><stop offset=".45" stop-color="rgba(0,20,10,.12)"/><stop offset="1" stop-color="rgba(255,255,220,.06)"/></linearGradient>'+
  '<radialGradient id="a3FocoPasto" cx=".5" cy=".62" r=".6"><stop offset="0" stop-color="rgba(255,252,220,.22)"/><stop offset=".6" stop-color="rgba(255,252,220,.05)"/><stop offset="1" stop-color="rgba(255,252,220,0)"/></radialGradient>'+
  '<linearGradient id="a3Noche" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(2,5,14,.8)"/><stop offset=".55" stop-color="rgba(4,10,24,.35)"/><stop offset="1" stop-color="rgba(4,10,24,0)"/></linearGradient>'+
  '<radialGradient id="a3Halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(255,248,210,.35)"/><stop offset="1" stop-color="rgba(255,248,210,0)"/></radialGradient>'+
  '<linearGradient id="a3Tono" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(40,70,140,.18)"/><stop offset="1" stop-color="rgba(255,200,120,.08)"/></linearGradient>'+
  /* contorno de las figuras: se engorda la silueta, se pinta oscura y se pone detrás */
  '<filter id="a3Contorno" x="-20%" y="-10%" width="140%" height="125%">'+
    '<feMorphology in="SourceAlpha" operator="dilate" radius="1.1" result="gordo"/>'+
    '<feFlood flood-color="#0b0f18" flood-opacity=".85"/><feComposite in2="gordo" operator="in" result="borde"/>'+
    '<feMerge><feMergeNode in="borde"/><feMergeNode in="SourceGraphic"/></feMerge>'+
  '</filter>';

(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._real3) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._real3=true; w._orig=o; window[nom]=w; };
  /* pasto con grano, profundidad, foco y sombras de los palos */
  envolver("_a3Pasto",o=>function(cam){
    let s=o.apply(this,arguments);
    if(!_arcoRealOn()) return s;
    const cancha=[[-80,0,-8],[80,0,-8],[80,0,120],[-80,0,120]];
    /* franjas de corte más marcadas (claras entre las oscuras que ya había) */
    for(let Z=-4,i=0;Z<90;Z+=5,i++) if(!(i%2)) s+=_poly(cam,[[-70,0,Z],[70,0,Z],[70,0,Z+5],[-70,0,Z+5]],'fill="rgba(210,255,170,.07)"');
    s+=_poly(cam,cancha,'fill="url(#a3Grano)"');
    s+=_poly(cam,cancha,'fill="url(#a3PastoProf)"');
    s+=_poly(cam,cancha,'fill="url(#a3FocoPasto)"');
    /* sombras de los palos y del fondo de la red, estiradas hacia la cámara */
    const W=3.66;
    s+='<g class="a3-sombras" fill="rgba(0,0,0,.22)">'+
      _poly(cam,[[-W-0.06,0,0],[-W+0.06,0,0],[-W+0.5,0,3.2],[-W+0.3,0,3.2]],"")+
      _poly(cam,[[W-0.06,0,0],[W+0.06,0,0],[W-0.3,0,3.2],[W-0.5,0,3.2]],"")+
      _poly(cam,[[-W,0,0.05],[W,0,0.05],[W-0.3,0,1.1],[-W+0.3,0,1.1]],'opacity=".6"')+
    '</g>';
    return s;
  });
  /* la tribuna se hunde en la noche hacia arriba, con halos en los focos */
  envolver("_a3Tribuna",o=>function(cam){
    const r=o.apply(this,arguments);
    if(!_arcoRealOn()||!r||!r.svg) return r;
    const noche=_poly(cam,[[-70,0.9,-8.8],[70,0.9,-8.8],[70,24,-30],[-70,24,-30]],'fill="url(#a3Noche)" pointer-events="none"');
    let halos="";
    [-60,-36,-12,12,36,60].forEach(X=>{ if(_aCam(cam,X,17.6,-23.8).d<1) return; const p=proyectar(cam,X,17.6,-23.8);
      halos+='<ellipse cx="'+p.x.toFixed(1)+'" cy="'+(p.y+30).toFixed(1)+'" rx="46" ry="60" fill="url(#a3Halo)" pointer-events="none"/>'; });
    return {defs:r.defs, svg:r.svg.replace(/<\/g>$/,noche+halos+"</g>")};
  });
  /* figuras con contorno oscuro (se envuelve el dibujo de la persona completo) */
  envolver("_figPersona",o=>function(opts){
    const s=o.apply(this,arguments);
    return _arcoRealOn()?'<g filter="url(#a3Contorno)">'+s+'</g>':s;
  });
  /* defs nuevas, brillo de la pelota y el tono de transmisión nocturna */
  envolver("htmlArcoVivo",o=>function(){
    let s=o.apply(this,arguments);
    if(!_arcoRealOn()) return s;
    s=s.replace("<defs>","<defs>"+ARCO_REAL_DEFS);
    s=s.replace('<circle r="8" fill="url(#arcoVolumen)"/>','<circle r="8" fill="url(#arcoVolumen)"/><ellipse cx="-2.8" cy="-3.4" rx="2.4" ry="1.5" fill="rgba(255,255,255,.85)" transform="rotate(-30 -2.8 -3.4)"/>');
    s=s.replace('<rect x="-60" y="-600" width="480" height="900" fill="url(#arcoVineta)" pointer-events="none"/>',
      '<rect x="-60" y="-600" width="480" height="900" fill="url(#a3Tono)" pointer-events="none" style="mix-blend-mode:soft-light"/>'+
      '<rect x="-60" y="-600" width="480" height="900" fill="url(#arcoVineta)" pointer-events="none"/>');
    return s;
  });
})();
/* la escena es una transmisión de TV: fondo oscuro, texto claro (el Aero claro de los diálogos no aplica) */
if(typeof document!=="undefined"&&!document.getElementById("css-arco-real")){
  const st=document.createElement("style"); st.id="css-arco-real";
  st.textContent=
    "html body[data-tema] .modal.escena-3d :is(.cuerpo,.so-cuerpo,.window-body),html body[data-tema] .escena-3d.ventana-so :is(.so-cuerpo,.window-body){background:linear-gradient(180deg,#14233b,#0a1424) !important;color:#e8f4ff !important}"+
    "html body .escena-3d .e3d-etiq{color:#d7e8ff !important}html body .escena-3d .e3d-etiq b{color:#fff}";
  document.head.appendChild(st);
}
