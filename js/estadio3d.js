"use strict";
/* ============================================================
   FUTBOLINI · estadio3d.js — EL ESTADIO DEL PARTIDO 3D (7.9135)
   Pedido del autor: "corrige bien el tema de los estadios, que se vea más pulido".

   Antes (cancha3d.js _c3dEstadio): el mismo estadio para todos (el Monumental y la cancha de Rengo eran iguales),
   techos negros flotando sin nada que los sostenga, torres con un rectángulo blanco y un público de 0,22 m de ancho
   por persona: de lejos se veía como la estática de la tele.

   Ahora el estadio sale de los DATOS del partido (c3dPlanEstadio: puro, sin three.js, lo revisa el doctor):
   - TAMAÑO REAL: el aforo del club local (data-estadios.js / CLUB_POR_ID) decide cuántas tribunas hay, cuántas filas
     tienen (0,8 m de fondo y 0,42 m de alto cada una, 0,5 m por asiento) y cuáles llevan techo. Un estadio de 3.000
     tiene su tribuna con marquesina, una galería enfrente y taludes con álamos detrás de los arcos; uno de 45.000 es
     una olla cerrada.
   - TU ESTADIO ES EL DE LA MAQUETA: de local, cada obra terminada (estadio-dibujo.js, _edTrib) se ve en el 3D: techo,
     segunda bandeja, galería nueva. Las obras solo agregan.
   - LA GENTE ES LA DE LA TAQUILLA: de local, el público de cada tribuna sale de taquillaPorSector y del total de
     ingresoPartidoLocal (el mismo número del "Fueron X personas" del final). Si subes la galería, la galería se ve
     vacía; si el estadio está venido a menos, se nota; con la tribuna clausurada, se ve cerrada. La visita va en su
     sector, separada por butacas vacías. De visita es una estimación del juego (siempre la misma para el partido).
   - LA HORA DEL PARTIDO (part.hora): 15:00 de día, 18:00 al atardecer, 21:00 o sin hora de noche con las torres
     prendidas. El paisaje: cordillera nevada en el valle central (y Mendoza), llano con luces en Buenos Aires,
     cerros en el resto.
   - Techos con pilares y vigas, torres de reticulado con focos que encandilan, reja y lienzos en la galería,
     marcador que muestra el resultado y el minuto, bancas, carteles, la hinchada que salta con el gol.
   BARATO: todo el concreto y el acero van en UNA malla con color por vértice; el estadio entero son ~12 llamadas de
   dibujo (el de antes, ~36). Si algo de acá falla, cancha3d.js vuelve al estadio de antes (se degrada, no se rompe).
   ============================================================ */

const E3D={ fila:0.8, alza:0.42, muro:1.4, dLat:40, dFon:59.5, esq:6.5, filasTex:16 };
/* lados (los ids de la maqueta de estadio-dibujo.js): pac = lateral del lado de la cámara (la principal) ·
   and = lateral del frente (la que se ve en la transmisión) · oes = detrás del arco z<0 · est = detrás del arco z>0 */
const E3D_LADOS=["pac","and","oes","est"];
const E3D_LARGO={ chico:{pac:56,and:76,oes:46,est:46}, mediano:{pac:92,and:92,oes:52,est:52},
  grande:{pac:106,and:106,oes:70,est:70}, olla:{pac:106,and:106,oes:67,est:67} };
const E3D_PESO={pac:1.5,and:1.4,oes:1,est:1};
const E3D_CORDILLERA=/^(Santiago|San Bernardo|Colina|Puente Alto|Rancagua|Rengo|San Fernando|San Vicente|Santa Cruz|Curicó|Talca|Linares|Chillán|Los Andes|San Felipe|Mendoza)$/;
const E3D_LLANO=/^(Buenos Aires|La Plata|Avellaneda|Lanús|Banfield|Florencio Varela|Florida Este|Rosario|Santa Fe|Junín|Mar del Plata|Río Cuarto|Santiago del Estero)$/;
/* cielo: [cénit, media altura, horizonte, bajo el horizonte] · luz del cielo [arriba, suelo, fuerza] · foco/sol [color, fuerza, posición] */
const E3D_AMB={
  noche:{cielo:["#02050d","#0a1630","#22324f","#283247"], niebla:"#22324f", hemi:[0xd7e6ff,0x23301f,0.8], sol:[0xfff6e6,0.95,[30,60,25]], focos:true, estrellas:true},
  tarde:{cielo:["#152a5c","#4a5f92","#e1a072","#7a5a4c"], niebla:"#c9957a", hemi:[0xffe6d2,0x3a3424,0.74], sol:[0xffc896,1.05,[72,30,-52]], focos:true},
  dia:  {cielo:["#2a63b8","#5f97d6","#bcd8ee","#8fa3ad"], niebla:"#bcd8ee", hemi:[0xeaf4ff,0x3d4a2c,0.95], sol:[0xfff1dc,1.15,[45,75,-35]], focos:false}
};
const E3D_COL={ cem:"#4b505a", muro:"#2f343d", tapa:"#575c66", techoArriba:"#2a2f37", techoAbajo:"#a9b1bd", techoLado:"#3a3f48",
  fascia:"#e6eaf0", acero:"#737b88", vidrio:"#1b2738", vom:"#0b0e14", suelo:"#262d27", pista:"#55585e", talud:"#2f5a28",
  alamo:"#22421e", tronco:"#3b2d22", banca:"#273142", bancaTecho:"#b8c2ce", marco:"#15181d" };

/* ---------- el plan (sin three.js) ---------- */
function _e3Tamano(a){ return a>=30000?"olla":(a>=12000?"grande":(a>=4500?"mediano":"chico")); }
function _e3Hora(part){ const m=/^(\d{1,2})(?::(\d{2}))?/.exec(String((part&&part.hora)||"")); return m?(+m[1])+(+(m[2]||0))/60:null; }
function _e3Ambiente(part){ const h=_e3Hora(part); return h==null?"noche":(h<17?"dia":(h<19.5?"tarde":"noche")); }
function _e3Relieve(ciudad){ const c=String(ciudad||""); return E3D_CORDILLERA.test(c)?"cordillera":(E3D_LLANO.test(c)?"llano":"cerros"); }
function _e3ColoresClub(id,resp){
  const m=(typeof CLUBES_META!=="undefined"&&id&&CLUBES_META[id])||null, c=(m&&m.colores)||[];
  return [c[0]||resp||"#2a3550", c[1]||"#f2f2f2"];
}
/* qué tiene cada lado según el aforo: 0 talud · 1 tribuna o galería · 2 con techo · 3 dos bandejas (los números de la maqueta) */
function _e3Forma(tam,aforo){
  const f={pac:2,and:1,oes:1,est:1};
  if(tam==="chico"){ f.oes=0; f.est=0; if(aforo<2000) f.pac=1; }
  else if(aforo>=20000) f.and=2;
  return f;
}
function c3dPlanEstadio(P){
  const part=(P&&P.part)||{}, hayE=typeof E!=="undefined"&&!!E;
  const mio=(P&&P.clubMio)||(hayE&&E.club)||null, local=part.local!==false;
  const casa=local?mio:(part.rivalId||null), visita=local?(part.rivalId||null):mio;
  const club=(typeof CLUB_POR_ID!=="undefined"&&casa&&CLUB_POR_ID[casa])||{};
  const propio=!!casa&&hayE&&casa===E.club;
  let aforo=propio&&typeof aforoActual==="function"?aforoActual():((typeof aforoDe==="function"&&aforoDe(casa))||club.aforo);
  aforo=Math.round(Math.max(800,Math.min(95000,(+aforo)||6000)));
  const tam=_e3Tamano(aforo), forma=_e3Forma(tam,aforo);
  let etapa=null;
  if(propio&&typeof etapaEstadio==="function"&&typeof _edTrib==="function"){
    etapa=etapaEstadio(); E3D_LADOS.forEach(id=>{ forma[id]=Math.max(forma[id],_edTrib(etapa,id)||0); }); }
  const olla=tam==="olla", lados={}, con=E3D_LADOS.filter(id=>forma[id]>0);
  const pesoT=con.reduce((s,id)=>s+E3D_PESO[id],0)/(olla?0.9:1);
  E3D_LADOS.forEach(id=>{
    const t=forma[id], largo=E3D_LARGO[tam][id];
    let filas=0;
    if(t>0){ filas=Math.round(aforo*(E3D_PESO[id]/pesoT)/(largo*2)); filas=Math.max(t===3?18:4,Math.min(44,filas)); }
    lados[id]={id:id, tipo:t, largo:largo, filas:filas, techo:t>=2, doble:t===3||(!olla&&filas>30),
      galeria:id==="oes"||id==="est"||(tam==="chico"&&id==="and"), ocup:0, cerrada:false};
  });
  const ciudad=club.ciudad||((typeof CLUBES_META!=="undefined"&&casa&&CLUBES_META[casa])||{}).ciudad||"";
  const plan={casa:casa, visitaId:visita, local:local, propio:propio, aforo:aforo, tamano:tam, olla:olla, etapa:etapa, lados:lados,
    nombre:(typeof estadioNombre==="function"&&estadioNombre(casa))||club.est||"", ciudad:ciudad, relieve:_e3Relieve(ciudad),
    ambiente:_e3Ambiente(part), colores:_e3ColoresClub(casa), coloresVisita:_e3ColoresClub(visita,"#c8102e"),
    gente:0, fuente:"", visita:null};
  _e3Ocupacion(plan,P);
  plan.clave=[casa,aforo,plan.ambiente,E3D_LADOS.map(id=>{ const l=lados[id]; return l.tipo+"/"+l.filas+"/"+Math.round(l.ocup*20)+(l.cerrada?"c":""); }).join(","),
    plan.visita?plan.visita.lado+plan.visita.ancho:"-",plan.colores.join(""),plan.coloresVisita.join("")].join("|");
  return plan;
}
function _e3TipoSector(s){ return (s&&s.tipo)||(/galer|popular/i.test((s&&s.n)||"")?"popular":(/pref|vip|palco|premium|marques/i.test((s&&s.n)||"")?"premium":"tribuna")); }
function _e3Ocupacion(plan,P){
  const part=(P&&P.part)||{}, L=plan.lados, hay=id=>L[id].tipo>0;
  if(plan.propio&&plan.local&&typeof taquillaPorSector==="function"&&typeof ingresoPartidoLocal==="function"){
    let sec=[], tot=0;
    try{ sec=taquillaPorSector(part)||[]; tot=(ingresoPartidoLocal(part)||{}).gente||0; }catch(e){ sec=[]; }
    if(sec.length){
      const fuentes=(typeof sectoresActuales==="function")?sectoresActuales():[], cap={}, gen={};
      E3D_LADOS.forEach(id=>{ cap[id]=0; gen[id]=0; });
      const reparte=(ids,c,g)=>{ ids=ids.filter(hay); if(!ids.length) ids=["pac"];
        const t=ids.reduce((s,id)=>s+L[id].largo,0); ids.forEach(id=>{ const k=L[id].largo/t; cap[id]+=c*k; gen[id]+=g*k; }); };
      let sumaG=0;
      sec.forEach(s=>{ const f=fuentes.find(x=>x.id===s.id)||{}, tipo=_e3TipoSector(f.id?f:s), fis=plan.aforo*(f.cuota||0.25);
        sumaG+=s.gente||0;
        if(tipo==="popular") reparte(hay("oes")||hay("est")?["oes","est"]:["and"],fis,s.gente||0);
        else if(tipo==="premium") reparte(["pac"],fis,s.gente||0);
        else reparte(["and","pac"],fis,s.gente||0); });
      const k=sumaG>0?tot/sumaG:1;
      E3D_LADOS.forEach(id=>{ if(hay(id)) L[id].ocup=cap[id]>0?Math.max(0,Math.min(1,gen[id]*k/cap[id])):0; });
      plan.gente=tot; plan.fuente="taquilla";
    }
  }
  if(plan.fuente!=="taquilla"){
    /* de visita (o sin taquilla): estimación del juego según el club local y el partido */
    const club=(typeof CLUB_POR_ID!=="undefined"&&CLUB_POR_ID[plan.casa])||{};
    let o=0.2+(club.fuerza||50)/260;
    if(part.tipo==="copa") o+=0.12;
    try{ if(typeof esClasico==="function"&&part.rivalId&&esClasico(part)) o+=0.2; }catch(e){}
    o=Math.max(0.12,Math.min(0.93,o));
    E3D_LADOS.forEach(id=>{ if(hay(id)) L[id].ocup=Math.min(1,o*(L[id].galeria?1.12:(id==="pac"?0.9:1))); });
    plan.gente=Math.round(plan.aforo*o); plan.fuente="estimada";
  }
  /* tribuna clausurada (deuda o sanción): cerrada y vacía, con el lienzo de clausura */
  if(plan.propio&&plan.local&&typeof tribunaCerrada==="function"&&tribunaCerrada()){
    const id=hay("oes")?"oes":"and"; L[id].cerrada=true; L[id].ocup=0;
  }
  /* la visita: su sector en la galería sur (o en la punta de la lateral), separado por butacas vacías */
  if(plan.visitaId&&plan.aforo>=2500){
    const lado=hay("est")&&!L.est.cerrada?"est":"and";
    const fz=((typeof CLUB_POR_ID!=="undefined"&&CLUB_POR_ID[plan.visitaId])||{}).fuerza||50;
    plan.visita={lado:lado, ancho:Math.round(Math.max(8,Math.min(L[lado].largo*0.35,(plan.tamano==="chico"?6:8)+fz/8))), ocup:0.9};
  }
}

/* ---------- constructor de mallas: cuadriláteros con color por vértice (el concreto entero es UNA llamada de dibujo) ---------- */
function _e3Malla(){ return {p:[],n:[],c:[],t:[]}; }
function _e3Col(hex){ const c=(typeof c3dCol==="function")?c3dCol(hex):new THREE.Color(hex); return [c.r,c.g,c.b]; }
function _e3Resta(a,b){ return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]; }
function _e3Cruz(a,b){ return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]; }
/* A,B,C,D en orden alrededor; Nd = hacia dónde debe mirar la cara (se da vuelta sola si venía al revés) */
function _e3Quad(m,A,B,C,D,col,Nd,uv){
  let N=_e3Cruz(_e3Resta(B,A),_e3Resta(D,A));
  if(Nd&&N[0]*Nd[0]+N[1]*Nd[1]+N[2]*Nd[2]<0){ const t=B; B=D; D=t; N=[-N[0],-N[1],-N[2]]; if(uv) uv=[uv[0],uv[3],uv[2],uv[1]]; }
  const l=Math.hypot(N[0],N[1],N[2])||1, V=[A,B,C,A,C,D], U=uv?[uv[0],uv[1],uv[2],uv[0],uv[2],uv[3]]:null;
  for(let k=0;k<6;k++){ const q=V[k]; m.p.push(q[0],q[1],q[2]); m.n.push(N[0]/l,N[1]/l,N[2]/l); m.c.push(col[0],col[1],col[2]); if(U) m.t.push(U[k][0],U[k][1]); }
}
/* caja de sx·sy·sz centrada en el origen local; f lleva un punto local al mundo (rígido) */
function _e3Caja(m,f,sx,sy,sz,col,arriba,abajo){
  const hx=sx/2, hy=sy/2, hz=sz/2, o=f(0,0,0);
  const cara=(c,d1,d2,k)=>{ const P=(a,b)=>f(c[0]+d1[0]*a+d2[0]*b,c[1]+d1[1]*a+d2[1]*b,c[2]+d1[2]*a+d2[2]*b), fc=f(c[0],c[1],c[2]);
    _e3Quad(m,P(-1,-1),P(1,-1),P(1,1),P(-1,1),k,_e3Resta(fc,o)); };
  cara([hx,0,0],[0,hy,0],[0,0,hz],col); cara([-hx,0,0],[0,hy,0],[0,0,hz],col);
  cara([0,hy,0],[hx,0,0],[0,0,hz],arriba||col); cara([0,-hy,0],[hx,0,0],[0,0,hz],abajo||col);
  cara([0,0,hz],[hx,0,0],[0,hy,0],col); cara([0,0,-hz],[hx,0,0],[0,hy,0],col);
}
/* caja derecha en el mundo */
function _e3CajaM(m,x,y,z,sx,sy,sz,col,arriba){ _e3Caja(m,(a,b,c)=>[x+a,y+b,z+c],sx,sy,sz,col,arriba); }
/* barra de grosor g entre dos puntos (tensores, pasamanos) */
function _e3Barra(m,A,B,g,col){
  const d=_e3Resta(B,A), l=Math.hypot(d[0],d[1],d[2])||1, f=[d[0]/l,d[1]/l,d[2]/l];
  let r=_e3Cruz(f,[0,1,0]); const lr=Math.hypot(r[0],r[1],r[2]); r=lr<1e-3?[1,0,0]:[r[0]/lr,r[1]/lr,r[2]/lr];
  const u=_e3Cruz(r,f), c=[(A[0]+B[0])/2,(A[1]+B[1])/2,(A[2]+B[2])/2];
  _e3Caja(m,(x,y,z)=>[c[0]+r[0]*x+u[0]*y+f[0]*z,c[1]+r[1]*x+u[1]*y+f[1]*z,c[2]+r[2]*x+u[2]*y+f[2]*z],g,g,l,col);
}
/* cartel vertical de w·h centrado en c que mira hacia n (horizontal): la u crece hacia la derecha de quien lo mira
   (así los textos no salen al revés en ningún lado) */
function _e3Vertical(m,c,n,w,h,col,uv){
  const r=[n[2],0,-n[0]], P=(a,b)=>[c[0]+r[0]*a,c[1]+b,c[2]+r[2]*a];
  _e3Quad(m,P(-w/2,-h/2),P(w/2,-h/2),P(w/2,h/2),P(-w/2,h/2),col,n,uv||[[0,0],[1,0],[1,1],[0,1]]);
}
function _e3Geo(m){
  const g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(m.p,3)); g.setAttribute("normal",new THREE.Float32BufferAttribute(m.n,3));
  g.setAttribute("color",new THREE.Float32BufferAttribute(m.c,3)); if(m.t.length) g.setAttribute("uv",new THREE.Float32BufferAttribute(m.t,2));
  g.computeBoundingSphere(); return g;
}
/* marco de un lado: (u a lo largo, y arriba, v hacia afuera desde el frente de la tribuna) → mundo */
function _e3Marco(id,d0){
  const lat=id==="pac"||id==="and", s=(id==="pac"||id==="est")?1:-1;
  return lat?(u,y,v)=>[s*(d0+v),y,u]:(u,y,v)=>[u,y,s*(d0+v)];
}
function _e3Dist(id){ return (id==="pac"||id==="and")?E3D.dLat:E3D.dFon; }
function _e3Dir(F,a,b,c){ return _e3Resta(F(a,b,c),F(0,0,0)); }

/* ---------- texturas dibujadas acá (sin internet, sin archivos) ---------- */
function _e3Rnd(sem){ let s=(sem>>>0)||7; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function _e3Semilla(txt){ let s=7; String(txt||"").split("").forEach(c=>{ s=(s*31+c.charCodeAt(0))>>>0; }); return s; }
function _e3Tex(c,rep){ const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; if(rep){ t.wrapS=t.wrapT=THREE.RepeatWrapping; } return t; }
/* público: 16 filas × nA asientos de 0,5 m. Cada persona ocupa su asiento (antes 0,22 m: de lejos era estática) */
function _e3TexPublico(o){
  const nF=E3D.filasTex, nA=o.nA, aw=o.aw, fh=aw*2, W=nA*aw, H=nF*fh;
  const c=document.createElement("canvas"); c.width=W; c.height=H; const x=c.getContext("2d"), rnd=_e3Rnd(o.semilla);
  const gal=o.tipo==="galeria", C=o.cols;
  const camis=[C[0],C[0],C[0],C[0],C[1],C[1],"#f2f2f2","#1d1f24","#59606b","#8a1f1f","#2b4a7a","#c9b28f"];
  const pieles=["#e8b98f","#c99067","#a87250","#7a4a32","#f1cfae"], pelos=["#1b1410","#2c2018","#4a3524","#7a5a3a","#111"];
  x.fillStyle=gal?"#585c64":"#353a44"; x.fillRect(0,0,W,H);
  for(let f=0;f<nF;f++){ const y0=f*fh;
    x.fillStyle=gal?"#6d7179":"#434955"; x.fillRect(0,y0+fh*0.76,W,fh*0.24);
    x.fillStyle="rgba(0,0,0,.42)"; x.fillRect(0,y0+fh*0.74,W,Math.max(1,fh*0.05)); }
  const persona=(x0,y0)=>{
    const w=aw*(0.64+rnd()*0.2), cx=x0+aw/2+(rnd()-0.5)*aw*0.22, top=y0+fh*(gal?0.0:0.1), piel=pieles[(rnd()*pieles.length)|0];
    x.fillStyle=camis[(rnd()*camis.length)|0];
    x.beginPath(); x.moveTo(cx-w/2,y0+fh*0.97); x.lineTo(cx-w/2,top+fh*0.44);
    x.quadraticCurveTo(cx-w/2,top+fh*0.3,cx,top+fh*0.3); x.quadraticCurveTo(cx+w/2,top+fh*0.3,cx+w/2,top+fh*0.44);
    x.lineTo(cx+w/2,y0+fh*0.97); x.fill();
    x.fillStyle=piel; x.beginPath(); x.arc(cx,top+fh*0.18,aw*0.23,0,Math.PI*2); x.fill();
    if(rnd()<0.82){ x.fillStyle=pelos[(rnd()*pelos.length)|0]; x.beginPath(); x.arc(cx,top+fh*0.15,aw*0.24,Math.PI,0); x.fill(); }
    if(rnd()<(gal?0.16:0.05)){ x.strokeStyle=piel; x.lineWidth=Math.max(1,aw*0.13); x.beginPath();
      x.moveTo(cx-w*0.42,top+fh*0.38); x.lineTo(cx-w*0.62,top-fh*0.06); x.moveTo(cx+w*0.42,top+fh*0.38); x.lineTo(cx+w*0.62,top-fh*0.06); x.stroke(); }
    if(gal&&rnd()<0.035){ x.fillStyle="#d8d2c4"; x.fillRect(cx-0.5,top-fh*0.6,Math.max(1,aw*0.07),fh*0.8);
      x.fillStyle=C[0]; x.fillRect(cx,top-fh*0.6,aw*1.6,fh*0.32); x.fillStyle=C[1]; x.fillRect(cx,top-fh*0.49,aw*1.6,fh*0.1); }
  };
  for(let f=0;f<nF;f++){ const y0=f*fh;
    for(let a=0;a<nA;a++){ const x0=a*aw;
      if(a%16===8){ x.fillStyle=gal?"#80848c":"#727985"; x.fillRect(x0+aw*0.08,y0,aw*0.84,fh);
        x.fillStyle="rgba(0,0,0,.32)"; x.fillRect(x0+aw*0.08,y0+fh*0.74,aw*0.84,Math.max(1,fh*0.06)); continue; }   /* escalera */
      if(o.vacioIzq!=null&&(a<o.vacioIzq||a>=nA-o.vacioDer)) continue;   /* el colchón vacío alrededor de la visita */
      if(!gal){ x.fillStyle=((a>>4)&1)?C[1]:C[0]; x.globalAlpha=0.85;
        x.fillRect(x0+aw*0.16,y0+fh*0.12,aw*0.68,fh*0.36); x.fillRect(x0+aw*0.12,y0+fh*0.5,aw*0.76,fh*0.22); x.globalAlpha=1; }   /* butaca */
      const p=o.ocup*(1+0.6*Math.sin(a*0.23+f*0.11+o.fase)*Math.sin(a*0.047+o.fase*0.5));   /* la gente se junta: manchas llenas y vacías */
      if(rnd()<p) persona(x0,y0);
    } }
  return c;
}
function _e3TexReja(){
  const c=document.createElement("canvas"); c.width=c.height=64; const x=c.getContext("2d");
  x.strokeStyle="rgba(205,212,222,1)"; x.lineWidth=3;
  x.beginPath(); x.moveTo(0,32); x.lineTo(32,0); x.lineTo(64,32); x.lineTo(32,64); x.closePath(); x.stroke();
  x.beginPath(); x.moveTo(0,0); x.lineTo(0,64); x.moveTo(64,0); x.lineTo(64,64); x.stroke();
  return c;
}
function _e3TexReticula(){
  const c=document.createElement("canvas"); c.width=32; c.height=64; const x=c.getContext("2d");
  x.strokeStyle="#fff"; x.lineWidth=3; x.beginPath(); x.moveTo(2,0); x.lineTo(2,64); x.moveTo(30,0); x.lineTo(30,64);
  x.moveTo(2,0); x.lineTo(30,64); x.moveTo(30,0); x.lineTo(2,64); x.moveTo(0,1); x.lineTo(32,1); x.stroke();
  return c;
}
function _e3TexFocos(nx,ny){
  const c=document.createElement("canvas"); c.width=nx*32; c.height=ny*32; const x=c.getContext("2d");
  x.fillStyle="#24272d"; x.fillRect(0,0,c.width,c.height);
  for(let i=0;i<nx;i++) for(let j=0;j<ny;j++){ const cx=i*32+16, cy=j*32+16, r=x.createRadialGradient(cx,cy,1,cx,cy,14);
    r.addColorStop(0,"#ffffff"); r.addColorStop(0.45,"#fff3cf"); r.addColorStop(0.8,"#c9b98a"); r.addColorStop(1,"#3a3a36");
    x.fillStyle=r; x.beginPath(); x.arc(cx,cy,13,0,Math.PI*2); x.fill(); }
  return c;
}
function _e3TexBrillo(){
  const c=document.createElement("canvas"); c.width=c.height=64; const x=c.getContext("2d"), r=x.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,"rgba(255,250,235,1)"); r.addColorStop(0.18,"rgba(255,240,205,.8)"); r.addColorStop(0.5,"rgba(255,225,170,.18)"); r.addColorStop(1,"rgba(255,220,160,0)");
  x.fillStyle=r; x.fillRect(0,0,64,64); return c;
}
/* lienzos de la barra: 4 diseños con los colores del club (sin nombres reales de barras) */
function _e3TexLienzos(C){
  const c=document.createElement("canvas"); c.width=256; c.height=256; const x=c.getContext("2d");
  x.fillStyle=C[0]; x.fillRect(0,0,256,64); x.fillStyle=C[1]; x.fillRect(0,21,256,22);
  for(let i=0;i<8;i++){ x.fillStyle=i%2?C[1]:C[0]; x.fillRect(i*32,64,32,64); }
  x.fillStyle=C[0]; x.fillRect(0,128,256,64); x.fillStyle=C[1]; x.beginPath();
  for(let k=0;k<10;k++){ const a=-Math.PI/2+k*Math.PI/5, r=k%2?11:26; x.lineTo(128+Math.cos(a)*r,160+Math.sin(a)*r); } x.fill();
  x.fillStyle=C[1]; x.fillRect(0,192,256,64); x.fillStyle=C[0]; x.beginPath(); x.moveTo(0,256); x.lineTo(60,192); x.lineTo(110,192); x.lineTo(50,256); x.fill();
  x.beginPath(); x.moveTo(150,256); x.lineTo(210,192); x.lineTo(256,192); x.lineTo(200,256); x.fill();
  x.strokeStyle="rgba(0,0,0,.35)"; x.lineWidth=3; [0,64,128,192].forEach(y=>x.strokeRect(1.5,y+1.5,253,61));
  return c;
}
/* el horizonte: cordillera nevada, cerros o el llano con la ciudad (un anillo de 360°) */
function _e3TexHorizonte(plan,amb,px){
  const W=px, H=Math.round(px/16), c=document.createElement("canvas"); c.width=W; c.height=H; const x=c.getContext("2d"), rnd=_e3Rnd(_e3Semilla(plan.ciudad||plan.casa));
  const tono={noche:["#0d1424","#1b2538","#8d9bb3"], tarde:["#5d4b63","#7d6a7c","#f1c8b4"], dia:["#6f879c","#8ea3b5","#f3f6fa"]}[amb];
  const alto=new Float32Array(W);
  const ruido=(i,f,a)=>Math.sin(i*f+rnd()*0)*a;
  let f1=rnd()*6, f2=rnd()*6, f3=rnd()*6;
  for(let i=0;i<W;i++){ const u=i/W;
    let h=0.18+0.08*Math.sin(u*Math.PI*2*3+f1)+0.05*Math.sin(u*Math.PI*2*7+f2)+0.03*Math.sin(u*Math.PI*2*17+f3);
    if(plan.relieve==="cordillera"){ const d=Math.abs(((u-0.75+1.5)%1)-0.5); if(d<0.2){ const k=Math.cos(d/0.2*Math.PI/2);
      h=Math.max(h,k*(0.55+0.18*Math.sin(u*90+f1)+0.12*Math.abs(Math.sin(u*230+f2))+0.06*Math.sin(u*610))); } }
    if(plan.relieve==="llano") h=0.05+(((i*7919)%97)<45?((i*31)%7)*0.012:0);
    alto[i]=Math.max(0.02,Math.min(0.95,h)); }
  for(let i=0;i<W;i++){ const y=H*(1-alto[i]);
    const g=x.createLinearGradient(0,y,0,H); g.addColorStop(0,tono[1]); g.addColorStop(1,tono[0]); x.fillStyle=g; x.fillRect(i,y,1,H-y);
    if(plan.relieve==="cordillera"&&alto[i]>0.42){ x.fillStyle=tono[2]; x.fillRect(i,y,1,(alto[i]-0.42)*H*0.55+1); } }
  if(amb!=="dia"){ /* la ciudad al pie: lucecitas */
    for(let k=0;k<W*0.6;k++){ const i=(rnd()*W)|0, y=H*(1-Math.min(alto[i],0.16)*rnd())-1;
      x.fillStyle=rnd()<0.8?"rgba(255,206,140,.9)":"rgba(220,235,255,.85)"; x.fillRect(i,y,1,1); } }
  return c;
}
function _e3TexMarcador(){ const c=document.createElement("canvas"); c.width=512; c.height=160; return c; }
function _e3PintarMarcador(S,a,b,ga,gb,min){
  const x=S.ctx, c=S.canvas; x.fillStyle="#06080b"; x.fillRect(0,0,c.width,c.height);
  x.strokeStyle="#3b4250"; x.lineWidth=6; x.strokeRect(3,3,c.width-6,c.height-6);
  x.textBaseline="middle"; x.font="bold 34px monospace"; x.fillStyle="#f4f6f8";
  x.textAlign="left"; x.fillText(a,18,42); x.textAlign="right"; x.fillText(b,c.width-18,42);
  x.textAlign="center"; x.font="bold 76px monospace"; x.fillStyle="#ffb21a"; x.fillText(ga+" - "+gb,c.width/2,100);
  x.font="bold 28px monospace"; x.fillStyle="#7fe08a"; x.fillText(min,c.width/2,145);
}

/* ---------- las piezas ---------- */
/* una tribuna (una o dos bandejas) con su muro, sus tapas, la gente, el muro de atrás y los vomitorios */
function _e3Grada(M,plan,id,info){
  const L=plan.lados[id], F=_e3Marco(id,_e3Dist(id)), h0=E3D.muro, a=L.largo/2, K=M.col;
  const caja=(cu,cy,cv,sx,sy,sz,col,ar,ab)=>_e3Caja(M.cem,(x,y,z)=>F(cu+x,cy+y,cv+z),sx,sy,sz,col,ar,ab);
  const tr=[];
  if(L.doble){ const r1=Math.ceil(L.filas*0.55), y1=h0+r1*E3D.alza, v1=r1*E3D.fila;
    tr.push({v0:0,y0:h0,filas:r1,alza:E3D.alza}); tr.push({v0:v1-2.5,y0:y1+3.6,filas:L.filas-r1,alza:0.5,banda:y1+0.3}); }
  else tr.push({v0:0,y0:h0,filas:L.filas,alza:E3D.alza});
  tr.forEach(t=>{ t.v1=t.v0+t.filas*E3D.fila; t.y1=t.y0+t.filas*t.alza; });
  const fin=tr[tr.length-1], V=fin.v1, Y=fin.y1, pub=M.pubDe[id];
  caja(0,h0/2,-0.15,L.largo,h0,0.3,K.muro);
  tr.forEach(t=>{
    const uM=L.largo/(M.nA*0.5), vM=t.filas/E3D.filasTex;
    _e3Quad(pub.m,F(-a,t.y0+0.3,t.v0+0.1),F(a,t.y0+0.3,t.v0+0.1),F(a,t.y1+0.3,t.v1-0.1),F(-a,t.y1+0.3,t.v1-0.1),[1,1,1],_e3Dir(F,0,1,-0.5),[[0,0],[uM,0],[uM,vM],[0,vM]]);
    [-1,1].forEach(sg=>{ const Q=(y,v)=>F(sg*a,y,v);
      _e3Quad(M.cem,Q(0,t.v0-0.3),Q(t.y0+0.3,t.v0-0.3),Q(t.y1+1.2,t.v1+0.4),Q(0,t.v1+0.4),K.tapa,_e3Dir(F,sg,0,0)); });
    if(t.banda!=null){
      caja(0,(t.banda+t.y0)/2,t.v0-0.2,L.largo,t.y0-t.banda,0.4,K.vidrio);
      _e3Quad(M.cem,F(-a,t.banda,t.v0),F(a,t.banda,t.v0),F(a,t.y1-0.5,t.v1),F(-a,t.y1-0.5,t.v1),K.cem,_e3Dir(F,0,-1,0));   /* el cielo bajo la bandeja */
    }
    /* vomitorios: el túnel por donde entra la gente, cada 16 m a media altura */
    if(t.filas>=12) for(let u=-a+8;u<a-4;u+=16){ const f0=Math.floor(t.filas*0.45), va=t.v0+f0*E3D.fila, vb=va+2.4, ya=t.y0+f0*t.alza+0.36, yb=ya+3*t.alza;
      _e3Quad(M.cem,F(u-1.1,ya,va),F(u+1.1,ya,va),F(u+1.1,yb,vb),F(u-1.1,yb,vb),K.vom,_e3Dir(F,0,1,-0.5));
      [-1.25,1.25].forEach(du=>caja(u+du,ya+0.3,va+1.1,0.25,0.75,2.4,K.tapa)); }
  });
  caja(0,(Y+1.2)/2,V+0.2,L.largo,Y+1.2,0.4,K.cem);
  for(let u=-a+4;u<=a-4;u+=8) caja(u,(Y+1.2)/2,V+0.65,0.8,Y+1.2,0.5,K.muro);   /* pilares por fuera */
  info.gradas++;
  return {F:F,V:V,Y:Y,a:a,tr:tr};
}
/* techo en voladizo: plancha, frontis blanco, vigas y pilares que bajan al suelo (antes flotaba) */
function _e3Techo(M,plan,id,g,info){
  const L=plan.lados[id], F=g.F, a=g.a, V=g.V, Y=g.Y, K=M.col, chico=plan.tamano==="chico";
  const vF=chico?Math.max(1,V*0.05):Math.max(1.5,V*0.12), yF=Y+(chico?3.4:6.2), vB=V+0.6, yB=Y+(chico?2.9:4.4);
  const ang=Math.atan2(yB-yF,vB-vF), co=Math.cos(ang), si=Math.sin(ang), vm=(vF+vB)/2, ym=(yF+yB)/2, lt=Math.hypot(vB-vF,yB-yF);
  const inc=(cu,cv,cy,sx,sy,sz,col,ar,ab)=>_e3Caja(M.cem,(x,y,z)=>F(cu+x,cy+z*si+y*co,cv+z*co-y*si),sx,sy,sz,col,ar,ab);
  const caja=(cu,cy,cv,sx,sy,sz,col)=>_e3Caja(M.cem,(x,y,z)=>F(cu+x,cy+y,cv+z),sx,sy,sz,col);
  inc(0,vm,ym,L.largo+1,0.35,lt+0.6,K.techoLado,K.techoArriba,K.techoAbajo);
  inc(0,vF-0.15,yF-0.55,L.largo+1.2,1.5,0.3,K.fascia);
  const n=Math.max(2,Math.round(L.largo/(chico?7:10))), paso=L.largo/n;
  for(let k=0;k<=n;k++){ const u=-a+k*paso;
    inc(u,vm,ym-0.72,0.35,1.1,lt,K.acero);
    caja(u,yB/2,vB+0.25,0.7,yB,0.7,K.acero); info.pilares++;
    if(chico&&k>0&&k<n){ const vp=V*0.38, ys=E3D.muro+vp/E3D.fila*E3D.alza, yr=yF+(yB-yF)*((vp-vF)/(vB-vF));
      caja(u,(ys+yr)/2,vp,0.3,yr-ys,0.3,K.acero); info.pilares++; }   /* la marquesina antigua: pilares en la tribuna */
    if(!chico){ /* el mástil sobre el pilar y el tensor que sostiene la punta del voladizo */
      caja(u,yB+2.2,vB+0.25,0.4,4.4,0.4,K.acero);
      _e3Barra(M.cem,F(u,yB+4.2,vB+0.25),F(u,yF+0.1,vF+(vB-vF)*0.3),0.16,K.acero); }
  }
  /* luces bajo el frontis (estadios grandes) */
  if(plan.tamano==="grande"||plan.tamano==="olla") for(let u=-a+3;u<=a-3;u+=6){
    const c0=F(u,yF-1.4,vF+0.2), dirP=_e3Dir(F,0,-0.9,-1);
    M.focosTecho.push([c0,dirP]); }
  info.techos++;
  return yF;
}
/* esquinas de la olla: cuartos de anillo que cierran el estadio (sin esto, cuatro tribunas sueltas) */
function _e3Esquinas(M,plan,info){
  const La=plan.lados.and, Lo=plan.lados.oes; if(!La.tipo||!Lo.tipo) return;
  const filas=Math.min(La.filas,Lo.filas), V=filas*E3D.fila, Y=E3D.muro+filas*E3D.alza, r0=E3D.esq, cx=E3D.dLat-r0, cz=E3D.dFon-r0, K=M.col, pub=M.pubDe.and;
  const seg=8, an=8;
  [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(s=>{ const sx=s[0], sz=s[1];
    const P=(th,r,y)=>[sx*(cx+Math.cos(th)*r),y,sz*(cz+Math.sin(th)*r)];
    for(let i=0;i<seg;i++){ const t0=i/seg*Math.PI/2, t1=(i+1)/seg*Math.PI/2, tm=(t0+t1)/2, adentro=[-sx*Math.cos(tm),0,-sz*Math.sin(tm)];
      for(let k=0;k<an;k++){ const v0=k/an*V, v1=(k+1)/an*V, ra=r0+v0, rb=r0+v1, ya=E3D.muro+0.3+v0/E3D.fila*E3D.alza, yb=E3D.muro+0.3+v1/E3D.fila*E3D.alza;
        const rm=(ra+rb)/2, u0=t0*rm/(M.nA*0.5), u1=t1*rm/(M.nA*0.5), w0=v0/E3D.fila/E3D.filasTex, w1=v1/E3D.fila/E3D.filasTex;
        _e3Quad(pub.m,P(t0,ra,ya),P(t1,ra,ya),P(t1,rb,yb),P(t0,rb,yb),[1,1,1],[adentro[0],2,adentro[2]],[[u0,w0],[u1,w0],[u1,w1],[u0,w1]]); }
      _e3Quad(M.cem,P(t0,r0-0.3,0),P(t1,r0-0.3,0),P(t1,r0-0.3,E3D.muro+0.3),P(t0,r0-0.3,E3D.muro+0.3),K.muro,adentro);
      _e3Quad(M.cem,P(t0,r0+V+0.1,Y+0.3),P(t1,r0+V+0.1,Y+0.3),P(t1,r0+V+0.1,Y+1.2),P(t0,r0+V+0.1,Y+1.2),K.cem,adentro);
      _e3Quad(M.cem,P(t0,r0+V+0.5,0),P(t1,r0+V+0.5,0),P(t1,r0+V+0.5,Y+1.2),P(t0,r0+V+0.5,Y+1.2),K.cem,[-adentro[0],0,-adentro[2]]);
      _e3Quad(M.cem,P(t0,r0+V+0.1,Y+1.2),P(t1,r0+V+0.1,Y+1.2),P(t1,r0+V+0.5,Y+1.2),P(t0,r0+V+0.5,Y+1.2),K.tapa,[0,1,0]);
    }
  });
  info.esquinas=4;
}
/* el talud de los estadios chicos: pasto en pendiente, la pandereta y los álamos */
function _e3Talud(M,plan,id){
  const F=_e3Marco(id,_e3Dist(id)), a=E3D_LARGO[plan.tamano][id]/2+10, K=M.col;
  _e3Quad(M.cem,F(-a,0,0.4),F(a,0,0.4),F(a,2.6,9),F(-a,2.6,9),K.talud,_e3Dir(F,0,1,-0.3));
  _e3Quad(M.cem,F(-a,2.6,9),F(a,2.6,9),F(a,2.6,14),F(-a,2.6,14),K.talud,[0,1,0]);
  [-1,1].forEach(sg=>_e3Quad(M.cem,F(sg*a,0,0.4),F(sg*a,2.6,9),F(sg*a,2.6,14),F(sg*a,0,14),K.talud,_e3Dir(F,sg,0,0)));
  _e3Caja(M.cem,(x,y,z)=>F(x,1.6+y,14.3+z),2*a,3.2,0.4,_e3Col("#6b675f"));
  for(let u=-a+3;u<a;u+=6.5){ const cx=u+((u*13)%3), h=13+Math.abs((u*7)%5), base=F(cx,0,17.5);
    _e3CajaM(M.cem,base[0],base[1]+1.5,base[2],0.5,3,0.5,K.tronco);
    const ap=[base[0],base[1]+h,base[2]], r=1.5;
    for(let k=0;k<6;k++){ const a0=k/6*Math.PI*2, a1=(k+1)/6*Math.PI*2, y0=base[1]+2.4;
      const A=[base[0]+Math.cos(a0)*r,y0,base[2]+Math.sin(a0)*r], B=[base[0]+Math.cos(a1)*r,y0,base[2]+Math.sin(a1)*r];
      _e3Quad(M.cem,A,B,ap,ap,K.alamo,[Math.cos((a0+a1)/2),0.3,Math.sin((a0+a1)/2)]); } }
  _e3Reja(M,F,-a+10,a-10,-0.3,0,2.6);
}
/* la reja: malla de alambre + postes + pasamanos */
function _e3Reja(M,F,u0,u1,v,y0,alto){
  const L=u1-u0, K=M.col;
  _e3Quad(M.reja.m,F(u0,y0,v),F(u1,y0,v),F(u1,y0+alto,v),F(u0,y0+alto,v),[1,1,1],_e3Dir(F,0,0,-1),[[0,0],[L/1.2,0],[L/1.2,alto/1.2],[0,alto/1.2]]);
  for(let u=u0;u<=u1+0.01;u+=3) _e3Caja(M.cem,(x,y,z)=>F(u+x,y0+alto/2+y,v+z),0.09,alto,0.09,K.acero);
  _e3Caja(M.cem,(x,y,z)=>F((u0+u1)/2+x,y0+alto+y,v+z),L,0.08,0.08,K.acero);
}
/* torres de reticulado (o postes en los chicos) con sus focos y su brillo */
function _e3Luces(M,plan,G,info){
  const t=plan.tamano, K=M.col, maxY=Math.max(8,...Object.keys(G).map(id=>G[id].Y+(G[id].techo||0)));
  const pos=[];
  if(t==="chico"){
    [-1,1].forEach(s=>{ const id=s>0?"pac":"and", g=G[id], x=s*(E3D.dLat+(g?g.V+3:2.5));
      [-30,0,30].forEach(z=>pos.push({x:x,z:z,h:Math.max(20,maxY+12),w:3.4,hh:2.2,nx:3,ny:2,base:0.45})); });
  } else if(plan.olla){
    const Vm=G.and?G.and.V:20, d=E3D.esq+Vm+8;
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(s=>pos.push({x:s[0]*(E3D.dLat-E3D.esq+d*0.7071),z:s[1]*(E3D.dFon-E3D.esq+d*0.7071),h:Math.max(44,maxY+20),w:8,hh:5.2,nx:6,ny:4,base:1.7}));
  } else {
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(s=>pos.push({x:s[0]*(E3D.dLat+4.5),z:s[1]*(E3D.dFon+4.5),h:Math.max(t==="grande"?40:32,maxY+16),w:t==="grande"?7.5:6,hh:t==="grande"?5:4,nx:t==="grande"?6:5,ny:4,base:t==="grande"?1.6:1.3}));
  }
  pos.forEach(q=>{
    /* el cuerpo: tronco de pirámide con reticulado (4 caras) */
    const b=q.base, tp=b*0.55, H=q.h;
    for(let k=0;k<4;k++){ const a0=k*Math.PI/2+Math.PI/4, a1=a0+Math.PI/2, c0=[Math.cos(a0),Math.sin(a0)], c1=[Math.cos(a1),Math.sin(a1)];
      const A=[q.x+c0[0]*b,0,q.z+c0[1]*b], B=[q.x+c1[0]*b,0,q.z+c1[1]*b], C=[q.x+c1[0]*tp,H,q.z+c1[1]*tp], D=[q.x+c0[0]*tp,H,q.z+c0[1]*tp];
      _e3Quad(M.reti.m,A,B,C,D,[1,1,1],[Math.cos((a0+a1)/2),0,Math.sin((a0+a1)/2)],[[0,0],[1,0],[1,H/3],[0,H/3]]); }
    /* la cabeza: mira al pasto, marco de acero y la grilla de focos */
    const cab=[q.x,H+q.hh/2,q.z], obj=[q.x*0.2,0,q.z*0.3], d=_e3Resta(obj,cab), ld=Math.hypot(d[0],d[1],d[2]), f=[d[0]/ld,d[1]/ld,d[2]/ld];
    const r0=_e3Cruz(f,[0,1,0]), lr=Math.hypot(r0[0],r0[1],r0[2]), r=[r0[0]/lr,r0[1]/lr,r0[2]/lr], u=_e3Cruz(r,f);
    const pt=(a,b2,c)=>[cab[0]+r[0]*a+u[0]*b2+f[0]*c,cab[1]+r[1]*a+u[1]*b2+f[1]*c,cab[2]+r[2]*a+u[2]*b2+f[2]*c];
    _e3Caja(M.cem,pt,q.w+0.5,q.hh+0.5,0.6,K.acero);
    _e3Quad(M.foco.m,pt(-q.w/2,-q.hh/2,0.32),pt(q.w/2,-q.hh/2,0.32),pt(q.w/2,q.hh/2,0.32),pt(-q.w/2,q.hh/2,0.32),[1,1,1],f,
      [[0,0],[q.nx/6,0],[q.nx/6,q.ny/4],[0,q.ny/4]]);
    const pb=pt(0,0,1.2); M.brillos.push(pb[0],pb[1],pb[2]);
    info.torres++; info.focos+=q.nx*q.ny;
  });
  /* focos bajo los techos de los estadios grandes */
  M.focosTecho.forEach(fq=>{ const c=fq[0], d=fq[1], ld=Math.hypot(d[0],d[1],d[2]), f=[d[0]/ld,d[1]/ld,d[2]/ld];
    const r0=_e3Cruz(f,[0,1,0]), lr=Math.hypot(r0[0],r0[1],r0[2])||1, r=[r0[0]/lr,r0[1]/lr,r0[2]/lr], u=_e3Cruz(r,f);
    const pt=(a,b)=>[c[0]+r[0]*a+u[0]*b,c[1]+r[1]*a+u[1]*b,c[2]+r[2]*a+u[2]*b];
    _e3Quad(M.foco.m,pt(-0.9,-0.35),pt(0.9,-0.35),pt(0.9,0.35),pt(-0.9,0.35),[1,1,1],f,[[0,0],[2/6,0],[2/6,1/4],[0,1/4]]);
    M.brillosChicos.push(c[0]+f[0]*0.5,c[1]+f[1]*0.5,c[2]+f[2]*0.5); info.focos+=2; });
}
/* carteles alrededor de la cancha (la misma textura LED del balón parado) con su soporte */
function _e3Carteles(M){
  [[0,-56.5,112,"z"],[0,56.5,112,"z"],[-37.5,0,104,"x"],[37.5,0,104,"x"]].forEach(c=>{
    const n=c[3]==="z"?[0,0,-Math.sign(c[1])]:[-Math.sign(c[0]),0,0], uM=c[2]/14;
    _e3Vertical(M.cartel.m,[c[0],0.47,c[1]],n,c[2],0.9,[1,1,1],[[0,0],[uM,0],[uM,1],[0,1]]);
    const atras=c[3]==="z"?[0,0,0.12*Math.sign(c[1])]:[0.12*Math.sign(c[0]),0,0];
    _e3CajaM(M.cem,c[0]+atras[0],0.47,c[1]+atras[2],c[3]==="z"?c[2]:0.2,0.94,c[3]==="z"?0.2:c[2],M.col.marco);
  });
}
/* las bancas de suplentes, del lado de la tribuna principal */
function _e3Bancas(M){
  const K=M.col;
  [-9,9].forEach(z0=>{
    _e3CajaM(M.cem,37.15,1.05,z0,0.15,2.1,7,K.banca);
    _e3CajaM(M.cem,36.3,2.12,z0,1.9,0.12,7,K.banca,K.bancaTecho);
    [-3.5,3.5].forEach(dz=>_e3CajaM(M.cem,36.3,1.05,z0+dz,1.9,2.1,0.1,K.banca));
    _e3CajaM(M.cem,36.75,0.45,z0,0.55,0.12,6.6,_e3Col("#4a5568"));
  });
}
/* el suelo de afuera y el pasillo de cemento entre los carteles y las tribunas */
function _e3Suelo(M){
  const K=M.col, y=-0.012, ix=37.9, iz=56.9, ox=E3D.dLat+0.4, oz=E3D.dFon+0.4;
  _e3Quad(M.cem,[-450,-0.06,-450],[450,-0.06,-450],[450,-0.06,450],[-450,-0.06,450],K.suelo,[0,1,0]);
  _e3Quad(M.cem,[ix,y,-oz],[ox,y,-oz],[ox,y,oz],[ix,y,oz],K.pista,[0,1,0]);
  _e3Quad(M.cem,[-ox,y,-oz],[-ix,y,-oz],[-ix,y,oz],[-ox,y,oz],K.pista,[0,1,0]);
  _e3Quad(M.cem,[-ix,y,iz],[ix,y,iz],[ix,y,oz],[-ix,y,oz],K.pista,[0,1,0]);
  _e3Quad(M.cem,[-ix,y,-oz],[ix,y,-oz],[ix,y,-iz],[-ix,y,-iz],K.pista,[0,1,0]);
}
/* el marcador: arriba de la tribuna del frente (la que se ve en la transmisión), hacia el arco sur, en sus patas */
function _e3Marcador(M,plan,G){
  const t=plan.tamano, w=t==="olla"||t==="grande"?15:(t==="mediano"?11:7), h=w*0.31, K=M.col, g=G.and;
  const F=g?g.F:_e3Marco("and",E3D.dLat), uc=g?g.a*0.55:22, v=g?g.V+0.9:3, yb=g?g.Y+(g.techo?g.techo+0.8:1.6):3.2;
  const n=_e3Dir(F,0,0,-1), ln=Math.hypot(n[0],n[1],n[2]), nn=[n[0]/ln,0,n[2]/ln];
  _e3Caja(M.cem,(x,y,z)=>F(uc+x,yb+h/2+y,v+0.35+z),w+0.8,h+0.8,0.5,K.marco);
  [-w/2+1,w/2-1].forEach(du=>_e3Caja(M.cem,(x,y,z)=>F(uc+du+x,yb/2+y,v+0.8+z),0.5,yb,0.5,K.acero));
  _e3Vertical(M.marc.m,F(uc,yb+h/2,v),nn,w,h,[1,1,1]);
}
/* la visita en su sector: un parche de su gente con butacas vacías a los lados */
function _e3Visita(M,plan,G){
  const v=plan.visita, g=v&&G[v.lado]; if(!g) return;
  const F=g.F, t=g.tr[0], w=v.ancho+4, u1=g.a-1, u0=u1-w, off=0.06;
  const vM=t.filas/E3D.filasTex;
  _e3Quad(M.visita.m,F(u0,t.y0+0.3+off,t.v0+0.1),F(u1,t.y0+0.3+off,t.v0+0.1),F(u1,t.y1+0.3+off,t.v1-0.1),F(u0,t.y1+0.3+off,t.v1-0.1),[1,1,1],_e3Dir(F,0,1,-0.5),[[0,0],[1,0],[1,vM],[0,vM]]);
  /* las rejas que la separan del resto */
  [u0,u1].forEach(u=>_e3Quad(M.reja.m,F(u,t.y0,t.v0),F(u,t.y0,t.v1),F(u,t.y1+2.6,t.v1),F(u,t.y0+2.6,t.v0),[1,1,1],_e3Dir(F,1,0,0),[[0,0],[t.v1/1.2,0],[t.v1/1.2,3],[0,3]]));
}
/* lienzos colgando de la reja de la galería de la barra */
function _e3Lienzos(M,plan,G,id){
  const g=G[id]; if(!g) return;
  const F=g.F, anchos=[9,6,11,7], y1=E3D.muro+2.5, y0=y1-1.6;
  let u=-g.a+6;
  anchos.forEach((w,k)=>{ if(u+w>g.a-6) return; const v0=k/4, v1=(k+1)/4;
    _e3Quad(M.lienzo.m,F(u,y0,-0.42),F(u+w,y0,-0.42),F(u+w,y1,-0.42),F(u,y1,-0.42),[1,1,1],_e3Dir(F,0,0,-1),[[0,1-v1],[1,1-v1],[1,1-v0],[0,1-v0]]);
    u+=w+3+((k*5)%4); });
}

/* ---------- armar el estadio entero ---------- */
function _e3Armar(est,plan){
  const perf=est.perfil, plano=!!perf.plano, alta=perf.tex>=2048, amb=E3D_AMB[plan.ambiente]||E3D_AMB.noche;
  const M={cem:_e3Malla(), nA:alta?128:64, aw:alta?16:(plano?4:8), nAv:32, pubDe:{}, pubs:{}, focosTecho:[], brillos:[], brillosChicos:[], col:{}};
  ["reti","foco","reja","lienzo","cartel","marc","visita"].forEach(k=>M[k]={m:_e3Malla()});
  Object.keys(E3D_COL).forEach(k=>M.col[k]=_e3Col(E3D_COL[k]));
  const info={gradas:0, techos:0, pilares:0, torres:0, focos:0, esquinas:0, llamadas:0, plan:plan};
  /* la gente: una textura por (tipo, techo, ocupación); las tribunas que se parecen la comparten */
  E3D_LADOS.forEach(id=>{ const L=plan.lados[id]; if(!L.tipo) return;
    const k=(L.galeria?"g":"t")+(L.techo?"T":"")+Math.round(L.ocup*10);
    if(!M.pubs[k]) M.pubs[k]={m:_e3Malla(), techo:L.techo, canvas:_e3TexPublico({tipo:L.galeria?"galeria":"tribuna", ocup:L.ocup, cols:plan.colores,
      nA:M.nA, aw:M.aw, semilla:_e3Semilla(plan.casa+k), fase:(_e3Semilla(k)%628)/100})};
    M.pubDe[id]=M.pubs[k]; });
  const G={};
  E3D_LADOS.forEach(id=>{ const L=plan.lados[id];
    if(L.tipo){ G[id]=_e3Grada(M,plan,id,info); if(L.techo) G[id].techo=_e3Techo(M,plan,id,G[id],info)-G[id].Y; }
    else _e3Talud(M,plan,id); });
  if(plan.olla) _e3Esquinas(M,plan,info);
  _e3Luces(M,plan,G,info);
  _e3Carteles(M); _e3Bancas(M); _e3Suelo(M); _e3Marcador(M,plan,G);
  if(plan.visita) _e3Visita(M,plan,G);
  E3D_LADOS.forEach(id=>{ const L=plan.lados[id];
    if(L.tipo&&L.galeria&&!plano){ _e3Reja(M,G[id].F,-G[id].a,G[id].a,-0.3,E3D.muro,2.6); }
    if(L.cerrada&&G[id]) L._cerrada=true; });
  const barra=plan.lados.oes.tipo&&!plan.lados.oes.cerrada?"oes":(plan.lados.and.galeria&&!plan.lados.and.cerrada?"and":null);
  if(barra&&!plano) _e3Lienzos(M,plan,G,barra);
  /* a three.js */
  const grupo=new THREE.Group(); grupo.name="estadio3d";
  const malla=(m,mat,orden)=>{ if(!m.p.length){ mat.dispose(); return null; } const o=new THREE.Mesh(_e3Geo(m),mat); o.matrixAutoUpdate=false; o.updateMatrix(); if(orden!=null) o.renderOrder=orden; grupo.add(o); info.llamadas++; return o; };
  malla(M.cem,new THREE.MeshLambertMaterial({vertexColors:true}));
  const S={plan:plan, info:info, grupo:grupo, pubs:[], amb:plan.ambiente};
  Object.keys(M.pubs).forEach(k=>{ const p=M.pubs[k], t=_e3Tex(p.canvas,true); t.anisotropy=alta?4:1;
    const mat=new THREE.MeshLambertMaterial({map:t,color:p.techo?0xc4c4c4:0xffffff}); malla(p.m,mat); S.pubs.push(t); });
  if(plan.visita&&M.visita.m.p.length){ const c=_e3TexPublico({tipo:"galeria", ocup:plan.visita.ocup, cols:plan.coloresVisita, nA:M.nAv, aw:M.aw, semilla:_e3Semilla("v"+plan.visitaId), fase:1.3, vacioIzq:4, vacioDer:4});
    const t=_e3Tex(c,true); S.texVisita=t; malla(M.visita.m,new THREE.MeshLambertMaterial({map:t})); }
  const ret=_e3Tex(_e3TexReticula(),true); malla(M.reti.m,new THREE.MeshLambertMaterial({map:ret,alphaTest:0.5,side:THREE.DoubleSide,color:0x9aa2ae}));
  const focos=_e3Tex(_e3TexFocos(6,4),false); S.matFocos=new THREE.MeshBasicMaterial({map:focos,color:amb.focos?0xffffff:0x6a6a6a,fog:false}); malla(M.foco.m,S.matFocos);
  if(M.reja.m.p.length) malla(M.reja.m,new THREE.MeshLambertMaterial({map:_e3Tex(_e3TexReja(),true),alphaTest:0.45,side:THREE.DoubleSide,color:0xb8c0cc}));
  if(M.lienzo.m.p.length) malla(M.lienzo.m,new THREE.MeshLambertMaterial({map:_e3Tex(_e3TexLienzos(plan.colores),false),side:THREE.DoubleSide}));
  const ptex=(typeof _texPublicidad==="function")?_texPublicidad():null;
  if(ptex){ ptex.wrapS=THREE.RepeatWrapping; ptex.repeat.set(1,1); }
  malla(M.cartel.m,ptex?new THREE.MeshBasicMaterial({map:ptex}):new THREE.MeshBasicMaterial({color:0x123a7a}));
  const mc=_e3TexMarcador(); S.marcador={canvas:mc, ctx:mc.getContext("2d"), tex:_e3Tex(mc,false), txt:""};
  malla(M.marc.m,new THREE.MeshBasicMaterial({map:S.marcador.tex,fog:false}));
  /* el brillo de los focos: puntos que se suman a la luz (de noche y al atardecer) */
  if(!plano&&amb.focos){ const tb=_e3Tex(_e3TexBrillo(),false);
    [[M.brillos,plan.tamano==="chico"?13:30],[M.brillosChicos,7]].forEach(b=>{ if(!b[0].length) return;
      const geo=new THREE.BufferGeometry(); geo.setAttribute("position",new THREE.Float32BufferAttribute(b[0],3));
      const pts=new THREE.Points(geo,new THREE.PointsMaterial({map:tb,size:b[1]*(plan.ambiente==="tarde"?0.7:1),sizeAttenuation:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));
      pts.renderOrder=5; grupo.add(pts); info.llamadas++; }); }
  /* el cielo (cúpula con degradé) y el horizonte de la ciudad: siguen a la cámara */
  if(!plano){
    const geo=new THREE.SphereGeometry(370,32,16), P=geo.attributes.position, col=new Float32Array(P.count*3), cs=amb.cielo.map(h=>new THREE.Color(h).convertSRGBToLinear()), C=new THREE.Color();
    for(let i=0;i<P.count;i++){ const e=Math.asin(Math.max(-1,Math.min(1,P.getY(i)/370)));
      if(e>0.5) C.copy(cs[1]).lerp(cs[0],Math.min(1,(e-0.5)/1.07)); else if(e>=0) C.copy(cs[2]).lerp(cs[1],e/0.5); else C.copy(cs[2]).lerp(cs[3],Math.min(1,-e/0.15));
      col[i*3]=C.r; col[i*3+1]=C.g; col[i*3+2]=C.b; }
    geo.setAttribute("color",new THREE.BufferAttribute(col,3));
    S.cielo=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}));
    S.cielo.renderOrder=-10; grupo.add(S.cielo); info.llamadas++;
    if(amb.estrellas){ const n=420, sp=new Float32Array(n*3), rnd=_e3Rnd(_e3Semilla(plan.casa+"*"));
      for(let i=0;i<n;i++){ const az=rnd()*Math.PI*2, el=0.12+Math.pow(rnd(),0.7)*1.4; sp[i*3]=Math.cos(az)*Math.cos(el)*360; sp[i*3+1]=Math.sin(el)*360; sp[i*3+2]=Math.sin(az)*Math.cos(el)*360; }
      const g2=new THREE.BufferGeometry(); g2.setAttribute("position",new THREE.Float32BufferAttribute(sp,3));
      const st=new THREE.Points(g2,new THREE.PointsMaterial({color:0xdfe8ff,size:1.6,sizeAttenuation:false,transparent:true,opacity:0.75,fog:false,depthWrite:false}));
      st.renderOrder=-9; S.cielo.add(st); info.llamadas++; }
    const ht=_e3Tex(_e3TexHorizonte(plan,plan.ambiente,alta?4096:2048),false); ht.wrapS=THREE.RepeatWrapping;
    S.cerros=new THREE.Mesh(new THREE.CylinderGeometry(330,330,62,72,1,true),new THREE.MeshBasicMaterial({map:ht,transparent:true,depthWrite:false,fog:false,side:THREE.BackSide}));
    S.cerros.renderOrder=-8; grupo.add(S.cerros); info.llamadas++;
  }
  S.colorNiebla=new THREE.Color(amb.niebla).convertSRGBToLinear();
  return S;
}
function _e3Quitar(est){
  const S=est.estadio; if(!S) return; est.estadio=null;
  try{ est.scene.remove(S.grupo); S.grupo.traverse(o=>{ if(o.geometry) o.geometry.dispose(); const m=o.material; if(m){ if(m.map) m.map.dispose(); m.dispose(); } }); }catch(e){}
}
/* luz, niebla y cielo según la hora del partido */
function _e3Ambientar(est,S){
  const amb=E3D_AMB[S.amb]||E3D_AMB.noche, sc=est.scene;
  if(est.hemi){ est.hemi.color.setHex(amb.hemi[0]); est.hemi.groundColor.setHex(amb.hemi[1]); est.hemi.intensity=amb.hemi[2]; }
  if(est.sol){ est.sol.color.setHex(amb.sol[0]); est.sol.intensity=amb.sol[1]; est.sol.position.set(amb.sol[2][0],amb.sol[2][1],amb.sol[2][2]); }
  if(sc.fog){ sc.fog.color.copy(S.colorNiebla); sc.fog.near=160; sc.fog.far=420; }
  if(!est.perfil.plano) sc.background=S.colorNiebla.clone();
}
/* entrada: arma (o reusa) el estadio del partido. Devuelve false si no pudo (cancha3d.js usa el de antes) */
function c3dEstadioMontar(est,P){
  if(typeof THREE==="undefined"||!est||!est.scene) return false;
  const plan=c3dPlanEstadio(P), clave=plan.clave+"|"+est.calidad;
  if(est.estadio&&est.estadio.clave===clave){ est.estadio.plan=plan; return true; }
  const S=_e3Armar(est,plan); S.clave=clave;
  _e3Quitar(est);
  if(est.estadioViejo){ try{ est.scene.remove(est.estadioViejo); }catch(e){} est.estadioViejo=null; }
  est.scene.add(S.grupo); est.estadio=S;
  _e3Ambientar(est,S);
  S.ult=null; S.salto={casa:0,visita:0}; S.t=0;
  c3dEstadioCuadro(est,0);
  return true;
}
/* cada cuadro: el cielo sigue a la cámara, el marcador muestra lo que pasa y la hinchada salta con el gol (quieto en pausa) */
function c3dEstadioCuadro(est,dt){
  const S=est&&est.estadio; if(!S) return;
  const cam=est.camGL.position;
  if(S.cielo) S.cielo.position.copy(cam);
  if(S.cerros) S.cerros.position.set(cam.x,26,cam.z);
  const P=est.P, gl=(P&&P.gl)||0, gv=(P&&P.gv)||0;
  if(S.ult&&dt>0){ if(gl>S.ult[0]) S.salto.casa=4.5; if(gv>S.ult[1]) S.salto.visita=4.5; }
  if(!S.ult||dt>0||!S.marcador.txt) S.ult=[gl,gv];
  S.t+=dt;
  const salta=(tex,k)=>{ if(!tex) return; const s=S.salto[k]; tex.offset.y=s>0?Math.abs(Math.sin(S.t*11))*0.012*Math.min(1,s):0; };
  if(dt>0){ S.salto.casa=Math.max(0,S.salto.casa-dt); S.salto.visita=Math.max(0,S.salto.visita-dt); }
  S.pubs.forEach(t=>salta(t,"casa")); salta(S.texVisita,"visita");
  _e3ActualizarMarcador(est,S);
}
function _e3Corto(id,resp){ const c=(typeof CLUB_POR_ID!=="undefined"&&id&&CLUB_POR_ID[id])||null; return String((c&&(c.c||c.n))||resp||"").toUpperCase().slice(0,12); }
function _e3ActualizarMarcador(est,S){
  const P=est.P, plan=S.plan, m=S.marcador; if(!m) return;
  const a=_e3Corto(plan.casa,plan.local?"LOCAL":(P&&P.part&&P.part.rivalNombre)), b=_e3Corto(plan.visitaId,plan.local?(P&&P.part&&P.part.rivalNombre):"VISITA");
  const ga=(P&&P.gl)||0, gb=(P&&P.gv)||0, min=P&&P.min!=null?Math.min(90,Math.floor(P.min))+"'":"";
  const txt=a+" "+ga+" - "+gb+" "+b+" "+min;
  if(txt===m.txt) return;
  m.txt=txt; m.ga=ga; m.gb=gb; m.a=a; m.b=b; _e3PintarMarcador(m,a,b,ga,gb,min); m.tex.needsUpdate=true;
}
/* para el doctor y el laboratorio: qué se armó */
function c3dEstadioInforme(est){
  const S=est&&est.estadio; if(!S) return null;
  let tris=0; S.grupo.traverse(o=>{ if(o.isMesh&&o.geometry&&o.geometry.attributes.position) tris+=o.geometry.attributes.position.count/3; });
  return Object.assign({clave:S.clave, triangulos:Math.round(tris), marcador:S.marcador&&S.marcador.txt}, S.info);
}
