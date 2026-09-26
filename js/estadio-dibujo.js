"use strict";
/* ============================================================
   FUTBOLINI · estadio-dibujo.js  (7.9054)
   El estadio DIBUJADO (SVG propio, sin internet): mejora obra por obra hasta quedar
   completo, y completo se nota de verdad (techo entero, segunda bandeja, luces, banderas).
   Etapas (0–5): sale de las obras terminadas (E.obrasHechas) y del estado del recinto.
   Durante una obra: andamios y grúa sobre la tribuna que se está tocando.
   La tribuna se llena según la proyección de público.
   ============================================================ */
function etapaEstadio(){
  const hechas=((E&&E.obrasHechas)||[]).length;
  const est=(E&&E.ind&&E.ind.estadio)||50;
  const base=est>=85?2:(est>=60?1:0);
  const amp=((E&&E.obrasHechas)||[]).filter(o=>o.tipo==="ampliacion").length;
  return Math.min(5, base+hechas+(amp?1:0));
}
function estadioCompleto(){ return etapaEstadio()>=5 && ((E&&E.ind&&E.ind.estadio)||0)>=80; }
const ETAPAS_ESTADIO=["Recinto venido a menos","Recinto recuperado","Recinto ordenado","Estadio moderno","Estadio de primer nivel","Estadio completo"];
function _edColores(){
  let a="#c8102e", b="#ffffff";
  try{ const m=(typeof CLUBES_META!=="undefined"&&CLUBES_META[E.club])||null; if(m&&m.colores){ a=m.colores[0]||a; b=m.colores[1]||b; } }catch(e){}
  try{ const ic=(typeof infoClub==="function")&&infoClub(E.club); if(ic&&ic.color) a=ic.color; }catch(e){}
  return {a:a,b:b};
}
/* ocup: 0..1 de la tribuna llena; obra: {tipo,pct} o null */
function svgEstadio(opts){
  opts=opts||{};
  const et=opts.etapa!=null?opts.etapa:etapaEstadio(), ocup=Math.max(0,Math.min(1,opts.ocup||0.5));
  const col=_edColores(), completo=opts.completo!=null?opts.completo:estadioCompleto();
  const W=360,H=240, cx=180, cy=128;
  /* azar fijo por club: el dibujo no "baila" en cada repintado */
  let sem=0; String((E&&E.club)||"x").split("").forEach(c=>{ sem=(sem*31+c.charCodeAt(0))>>>0; });
  const rnd=()=>{ sem=(sem*1664525+1013904223)>>>0; return sem/4294967296; };
  const uid="ed"+(svgEstadio._n=(svgEstadio._n||0)+1);   /* ids únicos: dos dibujos en la misma página no se pisan */
  const cemento=et<=0?"#7d7a73":(et<=2?"#9a978f":"#b8b4ab");
  const gris="#5c5a55";
  let s='<svg class="estadio-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Tu estadio, '+ETAPAS_ESTADIO[et]+'">';
  s+='<defs><radialGradient id="'+uid+'edCielo" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="'+(completo?"#1d3b73":"#6fa4d8")+'"/><stop offset="1" stop-color="'+(completo?"#0b1733":"#cfe4f5")+'"/></radialGradient>'+
     '<linearGradient id="'+uid+'edPasto" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3f9a4a"/><stop offset="1" stop-color="#2f7d3a"/></linearGradient></defs>';
  s+='<rect width="'+W+'" height="'+H+'" fill="url(#'+uid+'edCielo)"/>';
  /* luces de noche cuando está completo */
  if(completo) for(let i=0;i<24;i++){ s+='<circle cx="'+(10+rnd()*340).toFixed(0)+'" cy="'+(4+rnd()*40).toFixed(0)+'" r="0.8" fill="#fff" opacity=".7"/>'; }
  /* anillo exterior (segunda bandeja desde la etapa 4) */
  if(et>=4) s+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="172" ry="102" fill="'+cemento+'" stroke="'+gris+'" stroke-width="2"/>';
  s+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="160" ry="92" fill="'+cemento+'" stroke="'+gris+'" stroke-width="2"/>';
  /* graderías: anillos de butacas; con color de club desde la etapa 1, y gente según la ocupación */
  const anillos=et>=4?5:(et>=2?4:3);
  for(let k=0;k<anillos;k++){
    const rx=150-k*12, ry=86-k*7;
    const color=et<=0?(k%2?"#8a8780":"#96938b"):(k%2?col.a:col.b);
    s+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="'+color+'" stroke-width="9" opacity="'+(et<=0?0.9:0.95)+'"/>';
  }
  /* público: puntitos en las graderías */
  const n=Math.round(40+ocup*260);
  for(let i=0;i<n;i++){
    const a=rnd()*Math.PI*2, k=rnd()*anillos;
    const rx=150-k*12, ry=86-k*7;
    s+='<circle cx="'+(cx+Math.cos(a)*rx).toFixed(1)+'" cy="'+(cy+Math.sin(a)*ry).toFixed(1)+'" r="1.4" fill="'+(rnd()<0.55?col.a:"#f4efe6")+'" opacity=".9"/>';
  }
  /* sectores rotos en etapa 0: grietas y un tramo clausurado */
  if(et===0){
    s+='<path d="M60 70 l10 8 l-6 6 l12 10" stroke="#3b3934" stroke-width="1.5" fill="none"/>';
    s+='<path d="M250 190 l-10 6 l8 5 l-12 9" stroke="#3b3934" stroke-width="1.5" fill="none"/>';
    s+='<rect x="275" y="96" width="34" height="60" fill="url(#'+uid+'edRayas)" opacity=".8"/>';
    s+='<defs><pattern id="'+uid+'edRayas" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="6" fill="#e0a92a"/><rect x="3" width="3" height="6" fill="#222"/></pattern></defs>';
  }
  /* cancha */
  s+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="96" ry="52" fill="#6b5a45"/>';   /* pista */
  s+='<rect x="'+(cx-80)+'" y="'+(cy-40)+'" width="160" height="80" rx="3" fill="url(#'+uid+'edPasto)"/>';
  for(let i=0;i<8;i++) if(i%2) s+='<rect x="'+(cx-80+i*20)+'" y="'+(cy-40)+'" width="20" height="80" fill="#fff" opacity=".05"/>';
  s+='<g fill="none" stroke="#fff" stroke-width="1.1" opacity=".9"><rect x="'+(cx-80)+'" y="'+(cy-40)+'" width="160" height="80"/><line x1="'+cx+'" y1="'+(cy-40)+'" x2="'+cx+'" y2="'+(cy+40)+'"/><circle cx="'+cx+'" cy="'+cy+'" r="11"/>'+
     '<rect x="'+(cx-80)+'" y="'+(cy-20)+'" width="20" height="40"/><rect x="'+(cx+60)+'" y="'+(cy-20)+'" width="20" height="40"/></g>';
  /* techo: tribuna principal desde la etapa 2; completo = anillo de techo entero */
  if(et>=2){
    if(completo) s+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="166" ry="98" fill="none" stroke="rgba(230,240,255,.55)" stroke-width="16"/>';
    else s+='<path d="M'+(cx-120)+' '+(cy-78)+' Q'+cx+' '+(cy-112)+' '+(cx+120)+' '+(cy-78)+'" stroke="rgba(230,240,255,.6)" stroke-width="12" fill="none"/>';
  }
  /* torres de luz desde la etapa 3 (encendidas si está completo) */
  if(et>=3) [[26,30],[334,30],[26,226],[334,226]].forEach(([x,y])=>{
    s+='<line x1="'+x+'" y1="'+y+'" x2="'+x+'" y2="'+(y+(y<100?40:-40))+'" stroke="#444" stroke-width="3"/>';
    s+='<rect x="'+(x-8)+'" y="'+(y-6)+'" width="16" height="8" fill="'+(completo?"#fffbe0":"#ddd")+'" stroke="#444"/>';
    if(completo) s+='<circle cx="'+x+'" cy="'+(y-2)+'" r="22" fill="#fff6c8" opacity=".18"/>';
  });
  /* pantalla gigante y banderas cuando está completo */
  if(completo){
    s+='<rect x="'+(cx-26)+'" y="8" width="52" height="18" rx="2" fill="#111" stroke="#666"/><text x="'+cx+'" y="21" font-size="9" fill="#38d66a" text-anchor="middle" font-family="monospace">'+escHtml((E.clubNombre||"").slice(0,10))+'</text>';
    for(let i=0;i<10;i++){ const a=i/10*Math.PI*2, x=cx+Math.cos(a)*170, y=cy+Math.sin(a)*100;
      s+='<line x1="'+x.toFixed(0)+'" y1="'+y.toFixed(0)+'" x2="'+x.toFixed(0)+'" y2="'+(y-14).toFixed(0)+'" stroke="#ddd" stroke-width="1"/><rect x="'+x.toFixed(0)+'" y="'+(y-14).toFixed(0)+'" width="9" height="6" fill="'+(i%2?col.a:col.b)+'"/>'; }
  }
  /* obra en marcha: andamios + grúa sobre la tribuna de enfrente, con avance */
  if(opts.obra){
    const x0=cx+60, y0=cy+58, pct=Math.round(opts.obra.pct||0);
    s+='<g class="ed-obra">';
    for(let i=0;i<5;i++) s+='<line x1="'+(x0+i*10)+'" y1="'+y0+'" x2="'+(x0+i*10)+'" y2="'+(y0+34)+'" stroke="#e0a92a" stroke-width="1.5"/>';
    for(let j=0;j<4;j++) s+='<line x1="'+x0+'" y1="'+(y0+j*10)+'" x2="'+(x0+40)+'" y2="'+(y0+j*10)+'" stroke="#e0a92a" stroke-width="1.2"/>';
    s+='<line x1="'+(x0+60)+'" y1="'+(y0+40)+'" x2="'+(x0+60)+'" y2="'+(y0-40)+'" stroke="#f0b429" stroke-width="3"/><line x1="'+(x0+10)+'" y1="'+(y0-40)+'" x2="'+(x0+90)+'" y2="'+(y0-40)+'" stroke="#f0b429" stroke-width="3"/>';
    s+='<line x1="'+(x0+20)+'" y1="'+(y0-40)+'" x2="'+(x0+20)+'" y2="'+(y0-20)+'" stroke="#333" stroke-width="1"/><rect x="'+(x0+15)+'" y="'+(y0-20)+'" width="10" height="6" fill="#888"/>';
    s+='<rect x="'+(x0-6)+'" y="'+(y0+38)+'" width="66" height="14" rx="3" fill="rgba(0,0,0,.6)"/><text x="'+(x0+27)+'" y="'+(y0+48)+'" font-size="9" fill="#fff" text-anchor="middle" font-family="system-ui">Obra '+pct+'%</text>';
    s+='</g>';
  }
  s+='</svg>';
  return s;
}
function panelEstadioDibujo(){
  const et=etapaEstadio(), completo=estadioCompleto();
  let ocup=0.5;
  try{ const r=proyeccionTaquilla(E.precios); ocup=r.gente/Math.max(1,aforoActual()); }catch(e){}
  let obra=null;
  if(E.obras){ obra={tipo:E.obras.tipo, pct:100*(E.obras.semanas-E.obras.resta)/Math.max(1,E.obras.semanas)}; }
  const box=el("div","estadio-dibujo"+(completo?" completo":""));
  box.innerHTML=svgEstadio({etapa:et, ocup:ocup, obra:obra, completo:completo});
  const pasos=ETAPAS_ESTADIO.map((n,i)=>'<span class="ed-paso'+(i<=et?" hecho":"")+(i===et?" actual":"")+'" title="'+n+'"></span>').join("");
  box.appendChild(el("div","ed-pie","<b>"+ETAPAS_ESTADIO[et]+"</b>"+(completo?" 🏆":"")+'<div class="ed-pasos">'+pasos+'</div>'+
    '<span class="mini">'+(completo?"Terminado: techo completo, segunda bandeja, luces y pantalla.":("Cada obra terminada lo sube un escalón"+(et<5?" · faltan "+(5-et)+" para completarlo":"")+"."))+"</span>"));
  return box;
}
