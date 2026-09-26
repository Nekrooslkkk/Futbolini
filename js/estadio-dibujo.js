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
/* ocup: 0..1 de la tribuna llena; obra: {tipo,pct} o null
   7.9057 · MAQUETA ISOMÉTRICA (pedido del autor): cuatro tribunas con altura que suben etapa por etapa.
   Coordenadas del predio: x 0..120 (largo), y 0..80 (ancho), z altura. Vista desde +x+y (abajo-derecha). */
const TRIBUNAS_ED=[
  {id:"pac",n:"Pacífico",x0:14,x1:106,y0:0,y1:14,eje:"x",afuera:"y0"},   /* lejos: principal */
  {id:"oes",n:"Norte",   x0:0, x1:14, y0:14,y1:66,eje:"y",afuera:"x0"},   /* lejos */
  {id:"est",n:"Sur",     x0:106,x1:120,y0:14,y1:66,eje:"y",afuera:"x1"},  /* cerca */
  {id:"and",n:"Andes",   x0:14,x1:106,y0:66,y1:80,eje:"x",afuera:"y1"}    /* cerca */
];
/* qué tiene cada tribuna en cada etapa: 0 talud · 1 butacas · 2 techo · 3 doble bandeja */
function _edTrib(et,id){
  const plan={pac:[1,1,2,2,3,3],oes:[0,0,1,1,1,2],est:[0,0,0,1,1,2],and:[0,1,1,1,3,3]}[id];
  return plan[Math.max(0,Math.min(5,et))];
}
function svgEstadio(opts){
  opts=opts||{};
  const et=opts.etapa!=null?opts.etapa:etapaEstadio(), ocup=Math.max(0,Math.min(1,opts.ocup||0.5));
  const col=_edColores(), completo=opts.completo!=null?opts.completo:estadioCompleto();
  let sem=0; String((E&&E.club)||"x").split("").forEach(c=>{ sem=(sem*31+c.charCodeAt(0))>>>0; });
  const rnd=()=>{ sem=(sem*1664525+1013904223)>>>0; return sem/4294967296; };
  const uid="ed"+(svgEstadio._n=(svgEstadio._n||0)+1);
  const S=1.55, C=Math.cos(Math.PI/6)*S, Sn=Math.sin(Math.PI/6)*S;
  const iso=(x,y,z)=>[(x-y)*C, (x+y)*Sn-(z||0)*S];
  /* límites para el viewBox */
  const esq=[iso(0,0,68),iso(120,0,68),iso(0,80,68),iso(120,80,0),iso(0,80,0),iso(120,0,0)];
  const minX=Math.min(...esq.map(p=>p[0]))-14, maxX=Math.max(...esq.map(p=>p[0]))+14;
  const minY=Math.min(...esq.map(p=>p[1]))-8, maxY=Math.max(...esq.map(p=>p[1]))+10;
  const P=(x,y,z)=>{ const q=iso(x,y,z); return (q[0]).toFixed(1)+","+(q[1]).toFixed(1); };
  const poly=(pts,fill,extra)=>'<polygon points="'+pts.map(p=>P(p[0],p[1],p[2])).join(" ")+'" fill="'+fill+'"'+(extra||"")+'/>';
  const sombra=(hex,f)=>{ try{ return (typeof _cvSombra==="function")?_cvSombra(hex,f):hex; }catch(e){ return hex; } };
  const cemento=et<=0?"#8d8a82":"#b9b5ac", cementoOsc=sombra(cemento,0.25), cementoMed=sombra(cemento,0.12);
  let s='<svg class="estadio-svg" viewBox="'+minX.toFixed(0)+" "+minY.toFixed(0)+" "+(maxX-minX).toFixed(0)+" "+(maxY-minY).toFixed(0)+'" role="img" aria-label="Maqueta de tu estadio: '+ETAPAS_ESTADIO[et]+'">';
  s+='<defs><linearGradient id="'+uid+'Cielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="'+(completo?"#0b1733":"#8ec5f0")+'"/><stop offset="1" stop-color="'+(completo?"#1d3b73":"#e2f1fb")+'"/></linearGradient></defs>';
  s+='<rect x="'+minX+'" y="'+minY+'" width="'+(maxX-minX)+'" height="'+(maxY-minY)+'" fill="url(#'+uid+'Cielo)"/>';
  if(completo) for(let i=0;i<30;i++) s+='<circle cx="'+(minX+rnd()*(maxX-minX)).toFixed(0)+'" cy="'+(minY+rnd()*40).toFixed(0)+'" r="0.9" fill="#fff" opacity=".7"/>';
  /* terreno y cancha */
  s+=poly([[-6,-6,0],[126,-6,0],[126,86,0],[-6,86,0]],"#4d8a3c");
  s+=poly([[10,10,0.2],[110,10,0.2],[110,70,0.2],[10,70,0.2]],et<3?"#8a6a4e":"#3b8a46");   /* pista atlética en recintos viejos */
  for(let k=0;k<10;k++){ const x0=16+k*8.8; s+=poly([[x0,16,0.4],[x0+8.8,16,0.4],[x0+8.8,64,0.4],[x0,64,0.4]],k%2?"#43a24f":"#3b9446"); }
  const L=(a,b)=>'<polyline points="'+a.map(p=>P(p[0],p[1],0.5)).join(" ")+'" fill="none" stroke="#fff" stroke-width="0.9" opacity=".92"/>';
  s+=L([[16,16],[104,16],[104,64],[16,64],[16,16]]); s+=L([[60,16],[60,64]]);
  const circ=[]; for(let k=0;k<=24;k++){ const a=k/24*Math.PI*2; circ.push([60+Math.cos(a)*6,40+Math.sin(a)*6]); } s+=L(circ);
  s+=L([[16,29],[29,29],[29,51],[16,51]]); s+=L([[104,29],[91,29],[91,51],[104,51]]);
  /* una tribuna: talud (0), butacas (1), con techo (2), doble bandeja (3) */
  const tribuna=(T,lvl,obraAqui)=>{
    const cerca=(T.id==="est"||T.id==="and");   /* las tribunas cercanas más bajas: no tapan la cancha */
    const hIn=lvl===0?2:3, hOut=(lvl===0?7:(lvl>=3?30:17))*(cerca?0.55:1);
    const {x0,x1,y0,y1}=T, ejeX=T.eje==="x";
    /* alto de cada esquina: el lado de "afuera" es el alto */
    const zc=(x,y)=>{ if(T.afuera==="y0") return y===y0?hOut:hIn; if(T.afuera==="y1") return y===y1?hOut:hIn; if(T.afuera==="x0") return x===x0?hOut:hIn; return x===x1?hOut:hIn; };
    const tp=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(q=>[q[0],q[1],zc(q[0],q[1])]);
    let o="";
    /* caras visibles: +x (x=x1) y +y (y=y1) */
    o+=poly([[x1,y0,0],[x1,y1,0],[x1,y1,zc(x1,y1)],[x1,y0,zc(x1,y0)]],cementoOsc);
    o+=poly([[x0,y1,0],[x1,y1,0],[x1,y1,zc(x1,y1)],[x0,y1,zc(x0,y1)]],cementoMed);
    o+=poly(tp,lvl===0?cemento:"#d9d4ca");
    if(lvl>=1){
      /* filas de butacas en los colores del club, a lo largo de la tribuna */
      const filas=lvl>=3?8:6;
      for(let f=0;f<filas;f++){
        const t0=f/filas, t1=(f+0.72)/filas, c=f%2?col.a:col.b;
        const pts=ejeX?[[x0+1,y0+(y1-y0)*t0],[x1-1,y0+(y1-y0)*t0],[x1-1,y0+(y1-y0)*t1],[x0+1,y0+(y1-y0)*t1]]
                      :[[x0+(x1-x0)*t0,y0+1],[x0+(x1-x0)*t1,y0+1],[x0+(x1-x0)*t1,y1-1],[x0+(x1-x0)*t0,y1-1]];
        o+=poly(pts.map(q=>[q[0],q[1],zc(q[0]<(x0+x1)/2?x0:x1,q[1]<(y0+y1)/2?y0:y1)*0+ (function(){ /* interpola la altura según la fila */ const t=ejeX?(q[1]-y0)/(y1-y0):(q[0]-x0)/(x1-x0); const alto=(T.afuera==="y0"||T.afuera==="x0")?(hOut+(hIn-hOut)*t):(hIn+(hOut-hIn)*t); return alto+0.3; })()]),c);
      }
      /* público según la ocupación */
      const n=Math.round((ejeX?70:40)*ocup*(lvl>=3?1.4:1));
      for(let k=0;k<n;k++){ const u=rnd(), v=rnd(); const x=x0+1+(x1-x0-2)*(ejeX?u:v), y=y0+1+(y1-y0-2)*(ejeX?v:u);
        const t=ejeX?(y-y0)/(y1-y0):(x-x0)/(x1-x0), alto=(T.afuera==="y0"||T.afuera==="x0")?(hOut+(hIn-hOut)*t):(hIn+(hOut-hIn)*t);
        const q=iso(x,y,alto+0.8); o+='<circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="0.9" fill="'+(rnd()<0.55?col.a:"#f4efe6")+'"/>'; }
    } else {
      /* talud viejo: grietas */
      const a=iso((x0+x1)/2,(y0+y1)/2,5), b=iso((x0+x1)/2+4,(y0+y1)/2+2,4);
      o+='<path d="M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+' L'+b[0].toFixed(1)+' '+b[1].toFixed(1)+'" stroke="#4a4740" stroke-width="0.8"/>';
    }
    if(lvl>=2){
      /* techo: losa sobre el lado alto, con pilares */
      const zt=hOut+7, prof=ejeX?(y1-y0)*0.75:(x1-x0)*0.75;
      let r;
      if(T.afuera==="y0") r=[[x0,y0,zt],[x1,y0,zt],[x1,y0+prof,zt-2],[x0,y0+prof,zt-2]];
      else if(T.afuera==="y1") r=[[x0,y1-prof,zt-2],[x1,y1-prof,zt-2],[x1,y1,zt],[x0,y1,zt]];
      else if(T.afuera==="x0") r=[[x0,y0,zt],[x0+prof,y0,zt-2],[x0+prof,y1,zt-2],[x0,y1,zt]];
      else r=[[x1-prof,y0,zt-2],[x1,y0,zt],[x1,y1,zt],[x1-prof,y1,zt-2]];
      o+=poly(r,completo?"rgba(235,242,255,.85)":"rgba(235,242,255,.72)",' stroke="#9aa6b5" stroke-width="0.5"');
    }
    if(obraAqui){
      const c=iso(ejeX?(x0+x1)/2:x1, ejeX?y1:(y0+y1)/2, 0);
      for(let k=0;k<5;k++) o+='<line x1="'+(c[0]-10+k*5).toFixed(1)+'" y1="'+c[1].toFixed(1)+'" x2="'+(c[0]-10+k*5).toFixed(1)+'" y2="'+(c[1]-26).toFixed(1)+'" stroke="#e0a92a" stroke-width="1"/>';
      for(let k=0;k<4;k++) o+='<line x1="'+(c[0]-10).toFixed(1)+'" y1="'+(c[1]-k*7).toFixed(1)+'" x2="'+(c[0]+10).toFixed(1)+'" y2="'+(c[1]-k*7).toFixed(1)+'" stroke="#e0a92a" stroke-width="0.8"/>';
      o+='<line x1="'+(c[0]+18).toFixed(1)+'" y1="'+c[1].toFixed(1)+'" x2="'+(c[0]+18).toFixed(1)+'" y2="'+(c[1]-60).toFixed(1)+'" stroke="#f0b429" stroke-width="2"/><line x1="'+(c[0]-12).toFixed(1)+'" y1="'+(c[1]-60).toFixed(1)+'" x2="'+(c[0]+40).toFixed(1)+'" y2="'+(c[1]-60).toFixed(1)+'" stroke="#f0b429" stroke-width="2"/>';
      o+='<rect x="'+(c[0]-14).toFixed(1)+'" y="'+(c[1]+3).toFixed(1)+'" width="50" height="11" rx="2" fill="rgba(0,0,0,.65)"/><text x="'+(c[0]+11).toFixed(1)+'" y="'+(c[1]+11).toFixed(1)+'" font-size="7.5" fill="#fff" text-anchor="middle" font-family="system-ui">Obra '+Math.round(opts.obra.pct||0)+'%</text>';
    }
    return o;
  };
  /* la próxima tribuna que mejora es la que tiene la obra */
  const siguiente=TRIBUNAS_ED.find(T=>_edTrib(Math.min(5,et+1),T.id)>_edTrib(et,T.id))||TRIBUNAS_ED[0];
  /* torres de luz desde la etapa 3 (las lejanas primero) */
  const torre=(x,y)=>{ const b=iso(x,y,0), t=iso(x,y,62); let o='<line x1="'+b[0].toFixed(1)+'" y1="'+b[1].toFixed(1)+'" x2="'+t[0].toFixed(1)+'" y2="'+t[1].toFixed(1)+'" stroke="#4b4f57" stroke-width="1.8"/>';
    o+='<rect x="'+(t[0]-6).toFixed(1)+'" y="'+(t[1]-4).toFixed(1)+'" width="12" height="6" fill="'+(completo?"#fffbe0":"#d8d8d8")+'" stroke="#4b4f57" stroke-width="0.6"/>';
    if(completo) o+='<circle cx="'+t[0].toFixed(1)+'" cy="'+t[1].toFixed(1)+'" r="16" fill="#fff6c8" opacity=".2"/>';
    return o; };
  if(et>=3) s+=torre(2,2)+torre(118,2)+torre(2,78);
  /* orden de pintado: primero lo lejano */
  ["pac","oes"].forEach(id=>{ const T=TRIBUNAS_ED.find(t=>t.id===id); s+=tribuna(T,_edTrib(et,id),opts.obra&&siguiente.id===id); });
  ["est","and"].forEach(id=>{ const T=TRIBUNAS_ED.find(t=>t.id===id); s+=tribuna(T,_edTrib(et,id),opts.obra&&siguiente.id===id); });
  if(et>=3) s+=torre(118,78);
  if(completo){
    const a=iso(60,0,48); s+='<rect x="'+(a[0]-22).toFixed(1)+'" y="'+(a[1]-10).toFixed(1)+'" width="44" height="14" rx="2" fill="#111" stroke="#666"/><text x="'+a[0].toFixed(1)+'" y="'+(a[1]+0.5).toFixed(1)+'" font-size="7" fill="#38d66a" text-anchor="middle" font-family="monospace">'+escHtml((E.clubNombre||"").slice(0,12))+'</text>';
    /* banderas sobre el techo de la tribuna principal (no flotando) */
    [20,36,52,68,84,100].forEach((x,k)=>{ const q=[x,0]; const b=iso(q[0],q[1],37), t=iso(q[0],q[1],45);
      s+='<line x1="'+b[0].toFixed(1)+'" y1="'+b[1].toFixed(1)+'" x2="'+t[0].toFixed(1)+'" y2="'+t[1].toFixed(1)+'" stroke="#ddd" stroke-width="0.8"/><rect x="'+t[0].toFixed(1)+'" y="'+t[1].toFixed(1)+'" width="7" height="4.5" fill="'+(k%2?col.a:col.b)+'"/>'; });
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
    '<span class="mini">'+(completo?"Terminado: techo completo, segunda bandeja, luces y pantalla.":("Cada obra terminada lo sube un escalón"+(et<5?" · faltan "+(5-et)+" para completarlo":"")+"."+
      (function(){ const T=(typeof TRIBUNAS_ED!=="undefined")&&TRIBUNAS_ED.find(t=>_edTrib(Math.min(5,et+1),t.id)>_edTrib(et,t.id)); return T?" Próxima mejora: tribuna "+T.n+".":""; })()))+"</span>"));
  return box;
}
