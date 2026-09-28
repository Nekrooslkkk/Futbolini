"use strict";
/* ============================================================
   FUTBOLINI · arco-gl.js — 7.9092 · penal, tiro libre y córner en 3D REAL (WebGL, estilo PES 2006)
   Pedido del autor: "así quiero que se vea: como el PES 2006 … 3D REAL".
   CÓMO FUNCIONA (sin tocar la lógica):
   - La jugada sigue viviendo en el SVG de arco3d.js: el dedo, el imán, la mira, las probabilidades y las
     animaciones del arquero, la pelota y el pateador. Nada de eso cambia.
   - Debajo del SVG se monta un <canvas> WebGL con three.js (MIT, en js/vendor/: funciona sin internet)
     y una cámara IDÉNTICA a la del SVG: la matriz de proyección se arma con la misma focal y el mismo
     centro, leídos del SVG en cada cuadro (así la repetición con zoom también calza).
   - Cada cuadro se leen del SVG la pelota, el arquero (salto, giro y brazos), el pateador y los jugadores,
     y se ubican sus versiones 3D en el mismo punto del mundo. El SVG de fondo se esconde; quedan encima
     solo la mira, el trazo, el imán y el papel picado.
   - Si no hay WebGL o three.js no cargó, se ve el dibujo SVG de siempre (se degrada, no se rompe).
   - Modo liviano: sin sombras, menos público y resolución 1×. Se apaga del todo con localStorage
     futbolini_arcogl = "off" (Ajustes ▸ Pantalla).
   ============================================================ */
const ARCOGL={cargando:null, activos:0, ultimo:null};
function arcoGLApagado(){ try{ return localStorage.getItem("futbolini_arcogl")==="off"; }catch(e){ return false; } }
function webglDisponible(){
  if(ARCOGL._wgl!=null) return ARCOGL._wgl;
  try{ const c=document.createElement("canvas"); ARCOGL._wgl=!!(c.getContext("webgl2")||c.getContext("webgl")); }catch(e){ ARCOGL._wgl=false; }
  return ARCOGL._wgl;
}
function cargarThree(){
  if(typeof THREE!=="undefined") return Promise.resolve(true);
  if(ARCOGL.cargando) return ARCOGL.cargando;
  ARCOGL.cargando=new Promise(res=>{
    const s=document.createElement("script"); s.src="js/vendor/three.min.js"; s.async=true;
    s.onload=()=>res(typeof THREE!=="undefined"); s.onerror=()=>{ ARCOGL.cargando=null; res(false); };
    document.head.appendChild(s);
  });
  return ARCOGL.cargando;
}
/* se precarga cuando el navegador está libre: el primer penal ya sale en 3D */
if(typeof window!=="undefined"){
  const pre=()=>{ if(!arcoGLApagado()&&webglDisponible()) cargarThree(); };
  window.addEventListener("load",()=>{ setTimeout(()=>{ if(window.requestIdleCallback) window.requestIdleCallback(pre); else pre(); },2500); });
}

/* ---------- texturas hechas con canvas (nada de archivos con copyright) ---------- */
function _glCanvas(w,h,fn){ const c=document.createElement("canvas"); c.width=w; c.height=h; fn(c.getContext("2d"),w,h); const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }
function _texPasto(){
  return _glCanvas(256,512,(g,w,h)=>{
    for(let i=0;i<2;i++){ g.fillStyle=i?"#2f6f2a":"#3a7d31"; g.fillRect(0,i*h/2,w,h/2); }
    const img=g.getImageData(0,0,w,h), d=img.data;
    for(let i=0;i<d.length;i+=4){ const n=(Math.random()-0.5)*26; d[i]+=n*0.6; d[i+1]+=n; d[i+2]+=n*0.4; }
    g.putImageData(img,0,0);
    g.globalAlpha=0.05; for(let i=0;i<900;i++){ g.fillStyle=Math.random()<0.5?"#d8ffb0":"#0b2a08"; g.fillRect(Math.random()*w,Math.random()*h,1,3); }
  });
}
function _texPublicidad(){
  const sp=(typeof SPONSORS_CL!=="undefined"&&SPONSORS_CL.length)?SPONSORS_CL.slice(0,6):["FUTBOLINI","FÚTBOL CHILENO"];
  const t=_glCanvas(2048,64,(g,w,h)=>{
    const cols=[["#0b3d91","#ffffff"],["#c8102e","#ffffff"],["#f4f4f4","#0b3d91"],["#1a7f3a","#ffffff"]];
    const seg=w/sp.length;
    sp.forEach((n,i)=>{ const c=cols[i%cols.length]; g.fillStyle=c[0]; g.fillRect(i*seg,0,seg,h); g.fillStyle=c[1];
      g.font="900 38px system-ui,Arial,sans-serif"; g.textAlign="center"; g.textBaseline="middle"; g.fillText(String(n).toUpperCase(),i*seg+seg/2,h/2+2); });
  });
  t.wrapS=THREE.RepeatWrapping; return t;
}
function _texNumero(n,fondo,tinta){
  return _glCanvas(128,128,(g,w,h)=>{ g.fillStyle=fondo; g.fillRect(0,0,w,h); g.fillStyle=tinta; g.font="900 86px system-ui,Arial,sans-serif"; g.textAlign="center"; g.textBaseline="middle"; g.fillText(String(n),w/2,h/2+6); });
}
function _texPelota(){
  return _glCanvas(256,128,(g,w,h)=>{ g.fillStyle="#f4f4f4"; g.fillRect(0,0,w,h); g.fillStyle="#15181f";
    for(let r=0;r<3;r++) for(let i=0;i<6;i++){ const x=(i+(r%2)*0.5)*w/6, y=(r+0.5)*h/3; g.beginPath();
      for(let k=0;k<5;k++){ const a=k*Math.PI*2/5-Math.PI/2; g.lineTo(x+Math.cos(a)*11,y+Math.sin(a)*14); } g.fill(); } });
}
function _texBrillo(){
  return _glCanvas(64,64,(g,w,h)=>{ const r=g.createRadialGradient(32,32,0,32,32,32); r.addColorStop(0,"rgba(255,250,225,1)"); r.addColorStop(0.3,"rgba(255,245,210,.45)"); r.addColorStop(1,"rgba(255,245,210,0)"); g.fillStyle=r; g.fillRect(0,0,w,h); });
}

/* ---------- el estadio ---------- */
function _glMat(color,o){ return new THREE.MeshStandardMaterial(Object.assign({color:color,roughness:0.8,metalness:0},o||{})); }
function _glLineaCancha(grupo,mat,x1,z1,x2,z2,ancho){
  const L=Math.hypot(x2-x1,z2-z1), m=new THREE.Mesh(new THREE.PlaneGeometry(L,ancho||0.12),mat);
  m.rotation.x=-Math.PI/2; m.rotation.z=-Math.atan2(z2-z1,x2-x1); m.position.set((x1+x2)/2,0.012,(z1+z2)/2); m.receiveShadow=true; grupo.add(m);
}
function _glCancha(scene,cam,liviano){
  const g=new THREE.Group();
  const tex=_texPasto(); tex.wrapS=tex.wrapT=THREE.RepeatWrapping; tex.repeat.set(8,18);
  const pasto=new THREE.Mesh(new THREE.PlaneGeometry(200,180),new THREE.MeshStandardMaterial({map:tex,roughness:0.95}));
  pasto.rotation.x=-Math.PI/2; pasto.position.set(0,0,60); pasto.receiveShadow=!liviano; g.add(pasto);
  const blanco=new THREE.MeshBasicMaterial({color:0xf2f5f0});
  const L=(a,b,c,d)=>_glLineaCancha(g,blanco,a,b,c,d);
  L(-34,0,34,0); L(-9.16,0,-9.16,5.5); L(-9.16,5.5,9.16,5.5); L(9.16,5.5,9.16,0);
  L(-20.16,0,-20.16,16.5); L(-20.16,16.5,20.16,16.5); L(20.16,16.5,20.16,0);
  L(-34,0,-34,70); L(34,0,34,70);
  let prev=null; for(let a=-53;a<=53;a+=4){ const r=a*Math.PI/180, p=[9.15*Math.sin(r),11+9.15*Math.cos(r)]; if(prev) L(prev[0],prev[1],p[0],p[1]); prev=p; }
  [-1,1].forEach(sg=>{ let q=null; for(let a=0;a<=90;a+=15){ const r=a*Math.PI/180, p=[sg*(34-Math.sin(r)),Math.cos(r)*1-1+1*(1-Math.cos(r))+Math.sin(r)*0]; const pp=[sg*(34-Math.cos(r)),Math.sin(r)]; if(q) L(q[0],q[1],pp[0],pp[1]); q=pp; } });
  const pto=new THREE.Mesh(new THREE.CircleGeometry(0.12,16),blanco); pto.rotation.x=-Math.PI/2; pto.position.set(0,0.013,11); g.add(pto);
  scene.add(g);
}
function _glArco(scene,liviano){
  const g=new THREE.Group(), W=3.66, H=2.44, Zt=-1.0, Zb=-2.0, r=0.06;
  const mPalo=_glMat(0xffffff,{roughness:0.35,metalness:0.1});
  const cil=(x1,y1,z1,x2,y2,z2,rad)=>{ const a=new THREE.Vector3(x1,y1,z1), b=new THREE.Vector3(x2,y2,z2), L=a.distanceTo(b);
    const m=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,L,14),mPalo); m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize()); m.castShadow=!liviano; g.add(m); return m; };
  cil(-W,0,0,-W,H+r,0,r); cil(W,0,0,W,H+r,0,r); cil(-W-r,H,0,W+r,H,0,r);
  const mSop=_glMat(0xc9d2dc,{roughness:0.5}); const cs=(a,b,c,d,e,f)=>{ const m=cil(a,b,c,d,e,f,0.025); m.material=mSop; };
  [-W,W].forEach(x=>{ cs(x,H,0,x,H,Zt); cs(x,H,Zt,x,0,Zb); }); cs(-W,0,Zb,W,0,Zb);
  /* red: malla fina en el fondo, techo y costados */
  const pts=[], paso=0.15;
  for(let x=-W;x<=W+1e-6;x+=paso){ pts.push(x,H,Zt, x,0,Zb); pts.push(x,H,0, x,H,Zt); }
  for(let t=0;t<=1+1e-6;t+=paso/2.6){ const y=H*(1-t), z=Zt+(Zb-Zt)*t; pts.push(-W,y,z, W,y,z); }
  for(let z=0;z>=Zt-1e-6;z-=paso) pts.push(-W,H,z, W,H,z);
  [-W,W].forEach(x=>{ for(let z=0;z>=Zb-1e-6;z-=paso){ const y=z>Zt?H:H*(z-Zb)/(Zt-Zb); pts.push(x,0,z, x,Math.max(0,y),z); }
    for(let y=0;y<=H+1e-6;y+=paso){ const zf=y>=H?Zt:Zb+(Zt-Zb)*(y/H); pts.push(x,y,0, x,y,zf); } });
  const geo=new THREE.BufferGeometry(); geo.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
  g.add(new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0xeef3f8,transparent:true,opacity:0.55})));
  scene.add(g); return g;
}
function _glPublicidad(scene,cam){
  const tex=_texPublicidad(), g=new THREE.Group();
  const cartel=(largo,x,z,rotY)=>{ const t=tex.clone(); t.needsUpdate=true; t.repeat.set(largo/40,1);
    const m=new THREE.Mesh(new THREE.BoxGeometry(largo,0.9,0.12),[_glMat(0x111822),_glMat(0x111822),_glMat(0x111822),_glMat(0x111822),new THREE.MeshBasicMaterial({map:t}),_glMat(0x111822)]);
    m.position.set(x,0.45,z); m.rotation.y=rotY||0; g.add(m); };
  cartel(96,0,-4.2,0);
  if(!cam.frontal){ const sx=-cam.sg*37; cartel(80,sx,36,cam.sg*Math.PI/2); }
  scene.add(g); return g;
}
function _glTribuna(scene,cam,hc,liviano){
  const g=new THREE.Group(), filas=[], cemento=_glMat(0x151a24,{roughness:0.95});
  /* gradas: detrás del arco (a lo ancho) y, en el córner, la del costado lejano */
  const bloques=[{eje:"x", desde:-70, hasta:70, fija:-12, dir:-1, base:2.4}];
  if(!cam.frontal) bloques.push({eje:"z", desde:-6, hasta:80, fija:-cam.sg*42, dir:-cam.sg, base:2.4});
  const personas=[];
  bloques.forEach(b=>{
    /* muro bajo la primera fila (el público no está al nivel del pasto) */
    const muro=new THREE.Mesh(new THREE.BoxGeometry(b.eje==="x"?b.hasta-b.desde:0.5,b.base,b.eje==="x"?0.5:b.hasta-b.desde),_glMat(0x1a2130));
    if(b.eje==="x") muro.position.set((b.desde+b.hasta)/2,b.base/2,b.fija+0.4); else muro.position.set(b.fija+0.4*(-b.dir),b.base/2,(b.desde+b.hasta)/2);
    g.add(muro);
    for(let i=0;i<22;i++){
      const y=b.base+i*0.62, off=b.fija+b.dir*(i*0.85), largo=b.hasta-b.desde;
      const esc=new THREE.Mesh(new THREE.BoxGeometry(b.eje==="x"?largo:0.85,0.62,b.eje==="x"?0.85:largo),cemento);
      if(b.eje==="x") esc.position.set((b.desde+b.hasta)/2,y-0.31,off); else esc.position.set(off,y-0.31,(b.desde+b.hasta)/2);
      esc.receiveShadow=!liviano; g.add(esc);
      for(let t=b.desde;t<b.hasta;t+=liviano?1.0:0.55){ if(Math.random()<0.1) continue;
        const j=(Math.random()-0.5)*0.15; personas.push(b.eje==="x"?[t+j,y,off]:[off,y,t+j]); }
    }
    /* techo */
    const techo=new THREE.Mesh(new THREE.BoxGeometry(b.eje==="x"?b.hasta-b.desde+4:14,0.4,b.eje==="x"?14:b.hasta-b.desde+4),_glMat(0x0c1119));
    if(b.eje==="x") techo.position.set(0,b.base+22*0.62+4,b.fija+b.dir*13); else techo.position.set(b.fija+b.dir*13,b.base+22*0.62+4,(b.desde+b.hasta)/2);
    g.add(techo);
  });
  /* el público: cuerpo con la camiseta del equipo (mayoría) o ropa de calle, y cabeza */
  const pal=[hc[0],hc[0],hc[1]||"#ffffff",hc[0],"#23293a","#8a8272","#3a4050",hc[1]||"#ffffff"].map(c=>new THREE.Color(c).multiplyScalar(0.62));
  const pieles=["#f2c9a0","#e0ae84","#c68b5e","#9c6641","#6e4429"].map(c=>new THREE.Color(c));
  const n=personas.length;
  const cuerpo=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.17,0.2,0.48,7),new THREE.MeshLambertMaterial(),n);
  const cabeza=new THREE.InstancedMesh(new THREE.SphereGeometry(0.1,8,6),new THREE.MeshLambertMaterial(),n);
  const M=new THREE.Matrix4();
  personas.forEach((p,i)=>{ const alto=Math.random()<0.3?0.18:0;
    M.makeTranslation(p[0],p[1]+0.26+alto,p[2]); cuerpo.setMatrixAt(i,M); cuerpo.setColorAt(i,pal[(i*7+(i>>3))%pal.length]);
    M.makeTranslation(p[0],p[1]+0.6+alto,p[2]); cabeza.setMatrixAt(i,M); cabeza.setColorAt(i,pieles[(i*3)%pieles.length].clone().multiplyScalar(0.75)); });
  const publico=new THREE.Group(); publico.add(cuerpo); publico.add(cabeza); g.add(publico);
  scene.add(g); return {grupo:g, publico:publico};
}
/* cielo de noche con resplandor de los focos, y el resto del estadio a lo lejos (anillo) */
function _glCielo(scene,hc){
  const cielo=_glCanvas(8,256,(g,w,h)=>{ const r=g.createLinearGradient(0,0,0,h); r.addColorStop(0,"#02050c"); r.addColorStop(0.55,"#0b1730"); r.addColorStop(0.8,"#1c2d4d"); r.addColorStop(1,"#2a3a58"); g.fillStyle=r; g.fillRect(0,0,w,h); });
  const domo=new THREE.Mesh(new THREE.SphereGeometry(300,24,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({map:cielo,side:THREE.BackSide,fog:false}));
  domo.position.set(0,-10,40); scene.add(domo);
  const cols=[hc[0],hc[1]||"#ffffff","#2a3040","#6d6a60"];
  const gente=_glCanvas(1024,128,(g,w,h)=>{ g.fillStyle="#141a26"; g.fillRect(0,0,w,h);
    for(let y=6;y<h;y+=5) for(let x=0;x<w;x+=3){ if(Math.random()<0.18) continue; g.fillStyle=cols[(x*7+y*3)%cols.length]; g.globalAlpha=0.35+Math.random()*0.35; g.fillRect(x,y,2,3); }
    g.globalAlpha=1; g.fillStyle="#0a0e16"; g.fillRect(0,0,w,6); });
  gente.wrapS=THREE.RepeatWrapping; gente.repeat.set(10,1);
  const anillo=new THREE.Mesh(new THREE.CylinderGeometry(120,105,26,48,1,true),new THREE.MeshBasicMaterial({map:gente,side:THREE.BackSide}));
  anillo.position.set(0,12,45); scene.add(anillo);
}
function _glFocos(scene,cam){
  const g=new THREE.Group(), brillo=_texBrillo(), torre=_glMat(0x39414f,{metalness:0.4,roughness:0.5});
  const sitios=[[-50,-32],[50,-32]]; if(!cam.frontal) sitios.push([-cam.sg*58,50]);
  sitios.forEach(([x,z])=>{
    const palo=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.5,34,8),torre); palo.position.set(x,17,z); g.add(palo);
    const panel=new THREE.Mesh(new THREE.BoxGeometry(6,3.4,0.6),new THREE.MeshBasicMaterial({color:0xfffbe8})); panel.position.set(x,35,z); panel.lookAt(0,0,10); g.add(panel);
    const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:brillo,color:0xfff6d8,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));
    halo.scale.set(26,26,1); halo.position.set(x,35,z); g.add(halo);
  });
  scene.add(g);
}

/* ---------- jugadores con volumen ---------- */
function jugador3D(o){
  o=o||{};
  const kit=o.kit||["#c0392b","#1a1a28"], piel=o.piel||"#e0ae84", pelo=o.pelo||"#1b1410";
  const mCam=_glMat(kit[0],{roughness:0.7}), mPan=_glMat(kit[1]||"#111111",{roughness:0.75}), mPiel=_glMat(piel,{roughness:0.65});
  const mMed=_glMat(o.arquero?kit[0]:(o.media||"#f2f2f2")), mBot=_glMat(0x16181d,{roughness:0.4}), mPelo=_glMat(pelo,{roughness:0.9});
  const raiz=new THREE.Group(), cuerpo=new THREE.Group(); raiz.add(cuerpo);
  const add=(geo,mat,x,y,z,padre)=>{ const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); m.castShadow=true; (padre||cuerpo).add(m); return m; };
  /* piernas */
  const piernas=[];
  [-1,1].forEach(s=>{ const p=new THREE.Group(); p.position.set(s*0.1,0.92,0); cuerpo.add(p);
    add(new THREE.CapsuleGeometry(0.075,0.3,4,8),mPiel,0,-0.2,0,p);
    add(new THREE.CapsuleGeometry(0.062,0.34,4,8),mMed,0,-0.6,0,p);
    add(new THREE.BoxGeometry(0.11,0.08,0.27),mBot,0,-0.88,0.05,p);
    piernas.push(p); });
  add(new THREE.CylinderGeometry(0.19,0.2,0.24,14),mPan,0,0.88,0);
  add(new THREE.CylinderGeometry(0.215,0.175,0.56,14),mCam,0,1.2,0);
  add(new THREE.SphereGeometry(0.2,14,10),mCam,0,1.43,0).scale.set(1.1,0.45,0.85);
  add(new THREE.CylinderGeometry(0.055,0.06,0.1,10),mPiel,0,1.52,0);
  const cab=add(new THREE.SphereGeometry(0.115,16,12),mPiel,0,1.65,0); cab.scale.set(1,1.12,1.02);
  add(new THREE.SphereGeometry(0.12,16,10,0,Math.PI*2,0,Math.PI*0.52),mPelo,0,1.67,-0.01).scale.set(1.02,1.05,1.05);
  /* brazos con pivote en el hombro (el arquero los levanta) */
  const brazos=[];
  [-1,1].forEach(s=>{ const b=new THREE.Group(); b.position.set(s*0.27,1.42,0); cuerpo.add(b);
    add(new THREE.CapsuleGeometry(0.058,0.22,4,8),mCam,0,-0.16,0,b);
    add(new THREE.CapsuleGeometry(0.046,0.24,4,8),o.arquero?mCam:mPiel,0,-0.43,0,b);
    add(new THREE.SphereGeometry(o.arquero?0.07:0.05,10,8),o.arquero?_glMat(0xf0f0f0):mPiel,0,-0.6,0,b);
    brazos.push(b); });
  /* número en la espalda */
  if(o.num){ const t=_texNumero(o.num,kit[0],kit[1]||"#111"); const n=new THREE.Mesh(new THREE.PlaneGeometry(0.26,0.26),new THREE.MeshStandardMaterial({map:t,roughness:0.7}));
    n.position.set(0,1.24,-0.205); n.rotation.y=Math.PI; cuerpo.add(n); }
  /* poses */
  if(o.pose==="muro"){ brazos.forEach((b,i)=>{ b.rotation.x=-0.5; b.rotation.z=(i?-1:1)*0.45; }); }
  else if(o.pose==="arq"){ piernas.forEach((p,i)=>{ p.rotation.z=(i?-1:1)*0.12; }); brazos.forEach((b,i)=>{ b.rotation.z=(i?1:-1)*0.55; b.rotation.x=-0.3; }); cuerpo.position.y=-0.04; }
  else { brazos.forEach((b,i)=>{ b.rotation.z=(i?1:-1)*0.12; }); }
  raiz.userData={piernas:piernas, brazos:brazos, cuerpo:cuerpo};
  return raiz;
}

/* ---------- cámara idéntica a la del SVG ---------- */
function _glCamara(cam){
  const c=new THREE.PerspectiveCamera(); c.matrixAutoUpdate=false;
  const r=new THREE.Vector3(cam.rx,0,cam.rz), u=new THREE.Vector3(cam.s*cam.fx,cam.c,cam.s*cam.fz), atras=new THREE.Vector3(-cam.c*cam.fx,cam.s,-cam.c*cam.fz);
  c.matrix.makeBasis(r,u,atras).setPosition(cam.C.x,cam.C.y,cam.C.z); c.matrixWorldNeedsUpdate=true;
  c.updateMatrixWorld(true);
  return c;
}
/* proyección leída del SVG en este cuadro: focal y centro en píxeles del canvas */
function _glProyeccion(camGL,cam,svg,canvas){
  const m=svg.getScreenCTM(), rc=canvas.getBoundingClientRect(); if(!m||!rc.width) return false;
  const W=rc.width, H=rc.height, f=m.a*cam.F, ox=m.a*180+m.e-rc.left, oy=m.d*cam.cy+m.f-rc.top, n=0.3, lejos=400;
  camGL.projectionMatrix.set(2*f/W,0,(W-2*ox)/W,0, 0,2*f/H,(2*oy-H)/H,0, 0,0,-(lejos+n)/(lejos-n),-2*lejos*n/(lejos-n), 0,0,-1,0);
  camGL.projectionMatrixInverse.copy(camGL.projectionMatrix).invert();
  return {W:W,H:H,m:m};
}
/* punto de la pantalla del SVG → mundo, cortando un plano */
function _glMundo(cam,xs,ys,eje,valor){ const p=_cortaPlano(cam,_rayo(cam,xs,ys),eje,valor); return p.t>0?p:null; }
function _glTransform(el){
  const t=(el&&el.getAttribute("transform"))||"";
  const tr=/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(t), sc=/scale\(([-\d.]+)\)/.exec(t), ro=/rotate\(([-\d.]+)/.exec(t);
  return tr?{x:+tr[1],y:+tr[2],s:sc?+sc[1]:1,r:ro?+ro[1]:0}:null;
}

/* ---------- montaje ---------- */
function arcoGLMontar(esc,svg,opts){
  const cam=_camDe(svg); if(!cam||typeof THREE==="undefined") return null;
  opts=opts||{};
  const liviano=!!(document.body&&document.body.classList.contains("perf"));
  const canvas=document.createElement("canvas"); canvas.className="a3gl";
  esc.world.insertBefore(canvas,svg);
  let renderer;
  try{ renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:!liviano,powerPreference:"high-performance"}); }
  catch(e){ canvas.remove(); return null; }
  renderer.outputEncoding=THREE.sRGBEncoding; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=!liviano; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(liviano?1:Math.min(2,window.devicePixelRatio||1));
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x060b14); scene.fog=new THREE.Fog(0x0e1a2e,80,260);
  scene.add(new THREE.HemisphereLight(0xaec4ff,0x1c3a1c,0.62));
  const sol=new THREE.DirectionalLight(0xfff4e0,1.25); sol.position.set(-26,48,40); sol.target.position.set(0,0,5);
  sol.castShadow=!liviano; sol.shadow.mapSize.set(2048,2048);
  Object.assign(sol.shadow.camera,{left:-26,right:26,top:26,bottom:-26,near:10,far:140}); sol.shadow.bias=-0.0004;
  scene.add(sol); scene.add(sol.target);
  const relleno=new THREE.DirectionalLight(0xc8d8ff,0.45); relleno.position.set(30,40,-30); scene.add(relleno);
  const hc=((svg.querySelector("#arco-cam")||{getAttribute:()=>""}).getAttribute("data-hc")||"#ffffff,#1a1a1a").split(",");
  _glCielo(scene,hc); _glCancha(scene,cam,liviano); _glArco(scene,liviano); _glPublicidad(scene,cam); _glFocos(scene,cam);
  const trib=_glTribuna(scene,cam,hc,liviano);
  if(!cam.frontal){ const bf=new THREE.Group(); const pm=_glMat(0xf4f4f4);
    const palo=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,1.5,8),pm); palo.position.y=0.75; palo.castShadow=true; bf.add(palo);
    const tela=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.34),new THREE.MeshStandardMaterial({color:0xf0c419,side:THREE.DoubleSide})); tela.position.set(0.26*cam.sg,1.32,0); bf.add(tela);
    bf.position.set(34*cam.sg,0,0); scene.add(bf); }
  /* jugadores: se crean desde las figuras del SVG (misma posición, mismo equipo) */
  const kits={atk:opts.kitAtk||hc, def:opts.kitWall||["#c0392b","#1a1a28"], arq:opts.kitArq||["#1a6ad4","#111827"]};
  const pieles=typeof ARCO_PIELES!=="undefined"?ARCO_PIELES:["#e0ae84"], pelos=typeof ARCO_PELOS!=="undefined"?ARCO_PELOS:["#1b1410"];
  const figuras=[];
  [].forEach.call(svg.querySelectorAll("#arco-wall > g, #arco-area > g"),(g,i)=>{
    const t=_glTransform(g); if(!t) return;
    const w=_glMundo(cam,t.x,t.y,"y",0); if(!w) return;
    const hijo=g.querySelector(".arco-atk,.arco-def,.arco-muro"), tipo=hijo?hijo.getAttribute("class"):"arco-muro";
    const atk=/arco-atk/.test(tipo);
    const j=jugador3D({kit:atk?kits.atk:kits.def, pose:/muro/.test(tipo)?"muro":"parado", num:atk?[4,2,9][i%3]:0, piel:pieles[(i*3+1)%pieles.length], pelo:pelos[i%pelos.length]});
    j.position.set(w.x,0,w.z);
    j.lookAt(atk?0:(cam.frontal?0:34*cam.sg),0,atk?-2:(cam.frontal?cam.Zb:1));
    scene.add(j); figuras.push({el:hijo,obj:j});
  });
  const arq=jugador3D({kit:kits.arq, pose:"arq", arquero:true, piel:pieles[2], pelo:pelos[1]});
  scene.add(arq);
  const pat=jugador3D({kit:kits.atk, pose:"parado", num:opts.dorsal||(cam.frontal?10:7), piel:pieles[3], pelo:pelos[2]});
  scene.add(pat);
  const bolaTex=_texPelota();
  const bola=new THREE.Mesh(new THREE.SphereGeometry(ARCO3D.bolaR*(cam.frontal?1:1.5),24,16),new THREE.MeshStandardMaterial({map:bolaTex,roughness:0.45}));
  bola.castShadow=!liviano; scene.add(bola);
  const sombraBola=new THREE.Mesh(new THREE.CircleGeometry(0.16,20),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.35,depthWrite:false}));
  sombraBola.rotation.x=-Math.PI/2; scene.add(sombraBola);
  const camGL=_glCamara(cam);
  svg.classList.add("a3gl-on");
  const est={svg:svg, canvas:canvas, renderer:renderer, scene:scene, cam:cam, camGL:camGL, arq:arq, pat:pat, bola:bola, sombraBola:sombraBola, figuras:figuras, publico:trib.publico, t0:performance.now()};
  ARCOGL.activos++; ARCOGL.ultimo=est;
  let W0=0,H0=0;
  const cuadro=function(t){
    if(!svg.isConnected){ try{ renderer.dispose(); renderer.forceContextLoss(); }catch(e){} ARCOGL.activos=Math.max(0,ARCOGL.activos-1); if(ARCOGL.ultimo===est) ARCOGL.ultimo=null; return; }
    const rc=canvas.getBoundingClientRect();
    if(rc.width&&(Math.abs(rc.width-W0)>0.5||Math.abs(rc.height-H0)>0.5)){ W0=rc.width; H0=rc.height; renderer.setSize(W0,H0,false); }
    if(_glProyeccion(camGL,cam,svg,canvas)){ _glSincronizar(est,t); renderer.render(scene,camGL); }
    est.raf=requestAnimationFrame(cuadro);
  };
  est.raf=requestAnimationFrame(cuadro);
  return est;
}
/* lee el SVG y mueve el 3D */
function _glSincronizar(est,t){
  const svg=est.svg, cam=est.cam;
  /* arquero: la cadera sale del SVG; el giro es el del SVG, alrededor del eje de la cámara */
  const aEl=svg.querySelector("#arco-arq"), ta=_glTransform(aEl);
  if(ta){
    const zArq=cam.frontal?0.3:0.45, cad=_glMundo(cam,ta.x,ta.y-46*ta.s,"z",zArq);
    if(cad){
      est.arq.position.set(cad.x,cad.y-0.92,cad.z);
      const eje=new THREE.Vector3(-cam.c*cam.fx,cam.s,-cam.c*cam.fz).normalize();
      const q=new THREE.Quaternion().setFromAxisAngle(eje,-ta.r*Math.PI/180);
      const mira=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),cam.frontal?0:Math.atan2(cam.C.x,cam.C.z-zArq));
      est.arq.quaternion.copy(q).multiply(mira);
      /* el pivote del giro es la cadera, no los pies */
      est.arq.userData.cuerpo.position.y=-0.04; est.arq.position.y=cad.y-0.92;
      const bi=aEl.querySelector("#arco-brazo-izq"), bd=aEl.querySelector("#arco-brazo-der"), ang=b=>{ const m=/rotate\(([-\d.]+)/.exec((b&&b.getAttribute("transform"))||""); return m?+m[1]:0; };
      const A=est.arq.userData.brazos, ai=ang(bi)*Math.PI/180;
      if(ai){ A[0].rotation.set(0,0,-ai); A[1].rotation.set(0,0,ai); }
      else { const res=Math.sin((t-est.t0)/260)*0.08; A[0].rotation.set(-0.3,0,-0.55-res); A[1].rotation.set(-0.3,0,0.55+res); }
    }
  }
  /* pateador: pies en el pasto; corre si se mueve */
  const pt=_glTransform(svg.querySelector("#a3-pateador"));
  if(pt){ const w=_glMundo(cam,pt.x,pt.y,"y",0);
    if(w){ const prev=est.pat.userData.prev, se_mueve=prev&&Math.hypot(prev.x-w.x,prev.z-w.z)>0.004;
      est.pat.position.set(w.x,0,w.z); est.pat.userData.prev={x:w.x,z:w.z};
      const blanco=cam.frontal?{x:0,z:0}:{x:0,z:11};
      est.pat.lookAt(blanco.x,0,blanco.z);
      const P=est.pat.userData.piernas, fase=se_mueve?Math.sin(t/60)*0.7:0;
      P[0].rotation.x=fase; P[1].rotation.x=-fase;
      const B=est.pat.userData.brazos; B[0].rotation.x=-fase*0.8; B[1].rotation.x=fase*0.8;
      if(svg.querySelector("#a3-pateador.a3-festeja")){ B[0].rotation.set(0,0,-2.6); B[1].rotation.set(0,0,2.6); }
    } }
  /* pelota: en pantalla la da el SVG; la distancia sale de su tamaño (tamaño ∝ 1/distancia) */
  const bEl=svg.querySelector("#arco-bola"), tb=_glTransform(bEl);
  if(tb){
    const quieta=!svg._pateado&&Math.abs(tb.x-cam.sbx)<0.6&&Math.abs(tb.y-cam.sby)<0.6;
    let w=null;
    if(quieta){ w=cam.frontal?{x:0,y:ARCO3D.bolaR,z:cam.Zb}:{x:ARCO3D.cornerX*cam.sg,y:ARCO3D.bolaR*1.5,z:ARCO3D.cornerZ}; }
    else {
      let d=ARCO3D.bolaR*cam.F/(8*Math.max(0.02,tb.s));
      if(!cam.frontal){ const s0=cam.sbs||1, sE=ARCO3D.bolaR*proyectar(cam,0,1.9,6).k/8, u=clamp((1/tb.s-1/s0)/Math.max(1e-6,1/sE-1/s0),0,1); d*=1+0.8*(1-u); }
      const r=_rayo(cam,tb.x,tb.y), L=Math.hypot(r.dx,r.dy,r.dz), al=(r.dx*cam.fx+r.dz*cam.fz)*cam.c-r.dy*cam.s;
      const k=d/Math.max(1e-6,al);
      w={x:cam.C.x+r.dx*k, y:Math.max(ARCO3D.bolaR,cam.C.y+r.dy*k), z:cam.C.z+r.dz*k};
    }
    est.bola.position.set(w.x,w.y,w.z); est.bola.rotation.x=-tb.r*Math.PI/180; est.bola.rotation.z=tb.r*Math.PI/360;
    est.sombraBola.position.set(w.x,0.015,w.z); const alto=Math.max(0,w.y-ARCO3D.bolaR);
    est.sombraBola.scale.setScalar(1+alto*0.25); est.sombraBola.material.opacity=Math.max(0.08,0.38-alto*0.08);
  }
  /* los del área saltan cuando el SVG los hace saltar */
  est.figuras.forEach(f=>{ const m=/translateY\((-?[\d.]+)px\)/.exec((f.el&&f.el.style.transform)||""); f.obj.position.y=m?Math.min(0.7,-m[1]/30):0; });
  /* gol: la tribuna salta */
  if(svg.classList.contains("arco-golazo")&&!document.body.classList.contains("anim-off")) est.publico.position.y=Math.abs(Math.sin(t/140))*0.22;
  else est.publico.position.y=0;
}
/* ---------- enganche: cada escena de arco nueva se monta en 3D ---------- */
(function(){
  const h=window.htmlArcoVivo;
  if(typeof h==="function"&&!h._gl){ const w=function(o){ ARCOGL.opts=o||{}; return h.apply(this,arguments); }; Object.keys(h).forEach(k=>w[k]=h[k]); w._gl=true; w._orig=h; window.htmlArcoVivo=w; }
  const o=window._arcoMontarSvg; if(typeof o!=="function"||o._gl) return;
  const w=function(esc){
    const svg=o.apply(this,arguments), opts=ARCOGL.opts||{};
    try{
      if(esc&&esc.world&&!arcoGLApagado()&&webglDisponible()){
        const montar=()=>{ if(svg.isConnected&&!svg.classList.contains("a3gl-on")){ try{ arcoGLMontar(esc,svg,opts); }catch(e){ console.error("arco 3D:",e); } } };
        if(typeof THREE!=="undefined") montar(); else cargarThree().then(ok=>{ if(ok) montar(); });
      }
    }catch(e){ console.error("arco 3D:",e); }
    return svg;
  };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._gl=true; w._orig=o; window._arcoMontarSvg=w;
})();
if(typeof document!=="undefined"&&!document.getElementById("css-arco-gl")){
  const st=document.createElement("style"); st.id="css-arco-gl";
  st.textContent=
    ".e3d-world>canvas.a3gl{position:absolute;inset:0;width:100%;height:100%;display:block}"+
    /* con el 3D montado, del SVG quedan solo los controles encima */
    ".arco-svg.a3gl-on>*:not(defs):not(#arco-mira):not(#arco-linea):not(#a3-trazo):not(#a3-papel):not(#arco-iman){visibility:hidden}";
  document.head.appendChild(st);
}
