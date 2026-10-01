"use strict";
/* ============================================================
   FUTBOLINI · cancha3d.js — 7.9122 · PARTIDO EN 3D (cámara estilo FIFA)
   Pedido del autor (1 oct 2026): el partido en vivo con cámara 3D tipo FIFA, más cerca y suave, no el cenital 2D.

   CLAVE: no es una animación aparte. Lee la MISMA simulación que el cenital (`_cvStep`/`_cvSt` de cancha.js): cada
   cuadro avanza el estado y coloca los modelos 3D donde está cada jugador y la pelota. Así "la cancha mide el fútbol"
   de verdad — es una cámara de la simulación, no un adorno. Reusa texturas/materiales/luces de arco-gl.js.

   - APAGADO por defecto (E.config.cancha3d). Se prende en Ajustes ▸ Pantalla. En Modo papa cae al cenital 2D
     (liviano) salvo que el autor lo fuerce. Si no hay WebGL o Three, cae al 2D solo.
   - Mundo en METROS: cancha 105×68 centrada en el origen; largo = eje Z (−52.5..52.5), ancho = eje X (−34..34).
     Mapeo desde la sim (0..1): worldZ=(st.x−0.5)*105 · worldX=(st.y−0.5)*68 · altura pelota = ball.z * 11.
   - Cámara de transmisión: sobre una banda, elevada, sigue la pelota a lo largo con suavizado (lerp). "Más cerca" y
     "más suave" se afinan con CAM.* (una sola fuente de verdad, el doctor la mira).
   ============================================================ */

/* una sola fuente de verdad para la cámara: así el autor (o el doctor) la afina sin cazar números por todo el archivo */
const CAM3D={ lado:38, alto:14, atras:6, mira_alto:1.2, sigue_z:0.78, sigue_x:0.42, suave:3.6, fov:42 };
const C3D={ est:null };

function cancha3dSoportado(){ try{ return typeof webglDisponible==="function" && webglDisponible(); }catch(e){ return false; } }
function cancha3dPreferido(){
  try{
    if(typeof E!=="undefined"&&E&&E.config&&E.config.cancha3d!=null) return !!E.config.cancha3d;
    return false;   /* por ahora OFF por defecto: se prende en Ajustes mientras lo pulimos */
  }catch(e){ return false; }
}
/* ¿se usa el 3D para este partido? (preferencia + soporte + no Modo papa, salvo que se fuerce) */
function cancha3dActivo(){
  if(!cancha3dPreferido()||!cancha3dSoportado()) return false;
  try{ if(document.documentElement.classList.contains("papa")&&!(E&&E.config&&E.config.cancha3dPapa)) return false; }catch(e){}
  return true;
}

/* ---------- construcción de la escena ---------- */
function _c3dLuces(scene,liviano){
  scene.add(new THREE.HemisphereLight(0xdfeeff,0x2b3a22,0.95));
  const sol=new THREE.DirectionalLight(0xfff4e0,1.15); sol.position.set(40,70,30);
  if(!liviano){ sol.castShadow=true; sol.shadow.mapSize.set(1024,1024);
    const d=70; sol.shadow.camera.left=-d; sol.shadow.camera.right=d; sol.shadow.camera.top=d; sol.shadow.camera.bottom=-d;
    sol.shadow.camera.near=10; sol.shadow.camera.far=200; sol.shadow.bias=-0.0006; }
  scene.add(sol);
}
/* cancha completa 105×68 centrada, con las dos áreas, círculo central y los dos arcos */
function _c3dCancha(scene,liviano){
  const g=new THREE.Group();
  const tex=(typeof _texPasto==="function")?_texPasto():null;
  if(tex){ tex.wrapS=tex.wrapT=THREE.RepeatWrapping; tex.repeat.set(10,16); }
  const pasto=new THREE.Mesh(new THREE.PlaneGeometry(150,120), tex?new THREE.MeshStandardMaterial({map:tex,roughness:0.96}):new THREE.MeshStandardMaterial({color:0x337a2e,roughness:0.96}));
  pasto.rotation.x=-Math.PI/2; pasto.receiveShadow=!liviano; g.add(pasto);
  const blanco=new THREE.MeshBasicMaterial({color:0xf2f5f0});
  /* línea entre (xa,za)-(xb,zb) en metros */
  const L=(xa,za,xb,zb)=>{ const len=Math.hypot(xb-xa,zb-za), m=new THREE.Mesh(new THREE.PlaneGeometry(len,0.12),blanco);
    m.rotation.x=-Math.PI/2; m.rotation.z=-Math.atan2(zb-za,xb-xa); m.position.set((xa+xb)/2,0.014,(za+zb)/2); g.add(m); };
  const HX=34, HZ=52.5;
  L(-HX,-HZ,HX,-HZ); L(-HX,HZ,HX,HZ); L(-HX,-HZ,-HX,HZ); L(HX,-HZ,HX,HZ);   /* perímetro */
  L(-HX,0,HX,0);                                                             /* mitad */
  /* círculo central */
  let prev=null; for(let a=0;a<=360;a+=12){ const r=a*Math.PI/180, p=[9.15*Math.cos(r),9.15*Math.sin(r)]; if(prev) L(prev[0],prev[1],p[0],p[1]); prev=p; }
  const pcen=new THREE.Mesh(new THREE.CircleGeometry(0.3,16),blanco); pcen.rotation.x=-Math.PI/2; pcen.position.y=0.015; g.add(pcen);
  /* áreas y arcos en los dos fondos */
  [-1,1].forEach(sg=>{
    const z=HZ*sg, zi=(HZ-16.5)*sg, zc=(HZ-5.5)*sg, zp=(HZ-11)*sg;
    L(-20.16,z,-20.16,zi); L(20.16,z,20.16,zi); L(-20.16,zi,20.16,zi);        /* área grande */
    L(-9.16,z,-9.16,zc); L(9.16,z,9.16,zc); L(-9.16,zc,9.16,zc);              /* área chica */
    const pp=new THREE.Mesh(new THREE.CircleGeometry(0.25,12),blanco); pp.rotation.x=-Math.PI/2; pp.position.set(0,0.015,zp); g.add(pp);
    _c3dArco(g,sg,liviano);
  });
  scene.add(g);
  return g;
}
/* un arco en el fondo sg (±1), mirando hacia el centro */
function _c3dArco(g,sg,liviano){
  const W=3.66, H=2.44, z0=52.5*sg, prof=2.0*sg;
  const mPalo=(typeof _glMat==="function")?_glMat(0xffffff,{roughness:0.35,metalness:0.1}):new THREE.MeshStandardMaterial({color:0xffffff});
  const barra=(xa,ya,za,xb,yb,zb,rad)=>{ const a=new THREE.Vector3(xa,ya,za), b=new THREE.Vector3(xb,yb,zb), len=a.distanceTo(b);
    const m=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,len,10),mPalo); m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize()); m.castShadow=!liviano; g.add(m); };
  barra(-W,0,z0,-W,H,z0,0.06); barra(W,0,z0,W,H,z0,0.06); barra(-W,H,z0,W,H,z0,0.06);
  /* red: líneas desde el travesaño/postes hacia atrás */
  const pts=[], paso=0.3, zb=z0+prof;
  for(let x=-W;x<=W+1e-6;x+=paso){ pts.push(x,H,z0, x,H,zb); pts.push(x,0,z0, x,0.0,zb); pts.push(x,0,zb, x,H,zb); }
  for(let y=0;y<=H+1e-6;y+=paso){ pts.push(-W,y,zb, W,y,zb); pts.push(-W,y,z0,-W,y,zb); pts.push(W,y,z0,W,y,zb); }
  const geo=new THREE.BufferGeometry(); geo.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
  g.add(new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0xeef3f8,transparent:true,opacity:0.5})));
}
/* tribuna simple (cuatro muros con gente puntual) para que no sea cancha flotando */
function _c3dTribuna(scene,hc,liviano){
  if(liviano) return;
  const g=new THREE.Group(), cem=(typeof _glMat==="function")?_glMat(0x171c26,{roughness:0.95}):new THREE.MeshStandardMaterial({color:0x171c26});
  const col=(hc&&hc[0])||"#2a3550";
  [[0,-60,150,10,0],[0,60,150,10,0]].forEach(m=>{ const w=new THREE.Mesh(new THREE.BoxGeometry(m[2],m[3],14),cem); w.position.set(m[0],m[3]/2-2,m[1]); w.rotation.x=m[1]<0?-0.32:0.32; g.add(w); });
  [[-42,0,14,10,120],[42,0,14,10,120]].forEach(m=>{ const w=new THREE.Mesh(new THREE.BoxGeometry(m[2],m[3],m[4]),cem); w.position.set(m[0],m[3]/2-2,m[1]); w.rotation.z=m[0]<0?0.32:-0.32; g.add(w); });
  /* manchas de público (instancia barata) */
  const n=1200, pub=new THREE.InstancedMesh(new THREE.BoxGeometry(0.5,0.6,0.5),new THREE.MeshLambertMaterial(),n), M=new THREE.Matrix4(), C=new THREE.Color();
  const cols=[new THREE.Color(col),new THREE.Color("#f4f4f4"),new THREE.Color("#d8d2c4"),new THREE.Color(col).multiplyScalar(0.7)];
  let k=0;
  for(let i=0;i<n;i++){
    const lado=i%4; let x,z;
    if(lado===0){ x=(Math.random()-0.5)*140; z=-56-Math.random()*9; }
    else if(lado===1){ x=(Math.random()-0.5)*140; z=56+Math.random()*9; }
    else if(lado===2){ x=-40-Math.random()*9; z=(Math.random()-0.5)*110; }
    else { x=40+Math.random()*9; z=(Math.random()-0.5)*110; }
    const y=3+Math.random()*7; M.makeTranslation(x,y,z); pub.setMatrixAt(k,M); pub.setColorAt(k,C.copy(cols[(Math.random()*cols.length)|0])); k++;
  }
  pub.count=k; pub.instanceMatrix.needsUpdate=true; if(pub.instanceColor) pub.instanceColor.needsUpdate=true; g.add(pub);
  scene.add(g);
}
/* un jugador: cuerpo (camiseta) + short + cabeza. Devuelve el grupo para moverlo cada cuadro. */
function _c3dJugador(scene,colCam,colShort,liviano){
  const g=new THREE.Group();
  const torso=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.24,0.95,8), new THREE.MeshLambertMaterial({color:new THREE.Color(colCam)}));
  torso.position.y=1.15; torso.castShadow=!liviano; g.add(torso);
  const short=new THREE.Mesh(new THREE.CylinderGeometry(0.26,0.22,0.5,8), new THREE.MeshLambertMaterial({color:new THREE.Color(colShort||"#20242c")}));
  short.position.y=0.55; short.castShadow=!liviano; g.add(short);
  const cab=new THREE.Mesh(new THREE.SphereGeometry(0.2,10,8), new THREE.MeshLambertMaterial({color:0xe8b48a}));
  cab.position.y=1.82; cab.castShadow=!liviano; g.add(cab);
  const nariz=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,0.14), new THREE.MeshLambertMaterial({color:0xdca379}));
  nariz.position.set(0,1.8,0.2); g.add(nariz);   /* da el "hacia dónde mira" */
  scene.add(g);
  return g;
}
/* sombra blanda bajo un objeto (plano con degradé) */
function _c3dSombraTex(){
  const c=document.createElement("canvas"); c.width=c.height=64; const x=c.getContext("2d");
  const r=x.createRadialGradient(32,32,2,32,32,32); r.addColorStop(0,"rgba(0,0,0,.55)"); r.addColorStop(1,"rgba(0,0,0,0)");
  x.fillStyle=r; x.fillRect(0,0,64,64); const t=new THREE.CanvasTexture(c); return t;
}

function montarCancha3D(host, P){
  if(C3D.est) detenerCancha3D();
  const liviano=(typeof _cvLiviano==="function"&&_cvLiviano());
  const canvas=document.createElement("canvas"); canvas.className="cancha3d"; canvas.setAttribute("aria-hidden","true");
  canvas.style.cssText="display:block;width:100%;height:100%";
  host.appendChild(canvas);
  let renderer;
  try{ renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:!liviano,powerPreference:"high-performance"}); }
  catch(e){ host.removeChild(canvas); return null; }
  renderer.outputEncoding=THREE.sRGBEncoding; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=!liviano; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(liviano?1:Math.min(1.6,window.devicePixelRatio||1));
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x0a1420);
  if(scene.fog!==undefined) scene.fog=new THREE.Fog(0x0a1420,120,230);
  _c3dLuces(scene,liviano);
  const col=(typeof _cvColores==="function")?_cvColores(P):{mio:"#eef3ff",riv:"#e5484d"};
  const hc=[col.mio,col.riv];
  _c3dCancha(scene,liviano);
  _c3dTribuna(scene,hc,liviano);
  /* 22 jugadores: 0..10 míos, 11..21 rivales (mismo orden que _cvSt.jug) */
  if(typeof _cvSeed==="function") _cvSeed(P);
  const st=(typeof _cvSt!=="undefined")?_cvSt:null;
  const figuras=[];
  for(let i=0;i<22;i++){
    const mio=i<11, gk=st&&st.jug[i]&&st.jug[i].rol==="gk";
    const base=mio?col.mio:col.riv;
    const camiseta=gk?( (typeof _cvSombra==="function")?_cvSombra(base,-0.35):base ):base;
    const short=gk?"#111418":(mio?(col.shortMio||"#20242c"):(col.shortRiv||"#20242c"));
    figuras.push(_c3dJugador(scene,camiseta,short,liviano));
  }
  /* pelota + su sombra */
  const bTex=(typeof _texPelota==="function")?_texPelota():null;
  const bola=new THREE.Mesh(new THREE.SphereGeometry(0.12,16,12), bTex?new THREE.MeshStandardMaterial({map:bTex,roughness:0.5}):new THREE.MeshStandardMaterial({color:0xf4f4f4}));
  bola.castShadow=!liviano; scene.add(bola);
  const sombraTex=_c3dSombraTex();
  const sombra=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.6),new THREE.MeshBasicMaterial({map:sombraTex,transparent:true,depthWrite:false}));
  sombra.rotation.x=-Math.PI/2; sombra.position.y=0.02; scene.add(sombra);
  /* cámara */
  const camGL=new THREE.PerspectiveCamera(CAM3D.fov,16/9,0.5,400);
  camGL.position.set(CAM3D.lado,CAM3D.alto,0); camGL.lookAt(0,1,0);
  const camPos=new THREE.Vector3().copy(camGL.position), mira=new THREE.Vector3(0,CAM3D.mira_alto,0);

  const est={ host:host, canvas:canvas, renderer:renderer, scene:scene, camGL:camGL, figuras:figuras, bola:bola, sombra:sombra,
    P:P, st:st, camPos:camPos, mira:mira, t0:performance.now(), raf:0, liviano:liviano, W0:0, H0:0 };
  C3D.est=est;

  function worldX(simY){ return (simY-0.5)*68; }
  function worldZ(simX){ return (simX-0.5)*105; }
  function sincronizar(dt){
    const S=est.st; if(!S) return;
    const b=S.ball, bx=worldX(b.y), bz=worldZ(b.x), by=Math.max(0.12,(b.z||0)*11+0.12);
    est.bola.position.set(bx,by,bz);
    est.bola.rotation.x+=dt*(2+by); est.bola.rotation.z+=dt*1.5;
    est.sombra.position.set(bx,0.02,bz); const s=0.5+by*0.08; est.sombra.scale.set(s,s,s); est.sombra.material.opacity=Math.max(0.1,0.5-by*0.03);
    S.jug.forEach((p,i)=>{ const f=est.figuras[i]; if(!f) return;
      const x=worldX(p.y), z=worldZ(p.x);
      f.position.x+=(x-f.position.x)*Math.min(1,dt*12); f.position.z+=(z-f.position.z)*Math.min(1,dt*12);
      const ang=(typeof p._ang==="number")?p._ang:0;
      /* _ang en el plano (x=largo, y=ancho): lo paso al mundo (z=largo, x=ancho) */
      f.rotation.y=-ang+Math.PI/2;
      const bob=Math.abs(Math.sin((p._paso||0)))*Math.min(0.12,(p._vel||0)*0.5);
      f.position.y=bob;
    });
    /* cámara de transmisión: banda lateral, elevada, sigue la pelota a lo largo (z) y un poco a lo ancho (x) */
    const destX=CAM3D.lado + bx*CAM3D.sigue_x;
    const destZ=bz*CAM3D.sigue_z;
    est.camPos.x+=(destX-est.camPos.x)*Math.min(1,dt*CAM3D.suave);
    est.camPos.y=CAM3D.alto;
    est.camPos.z+=(destZ-est.camPos.z)*Math.min(1,dt*CAM3D.suave);
    est.camGL.position.copy(est.camPos);
    est.mira.x+=(bx*0.5-est.mira.x)*Math.min(1,dt*CAM3D.suave);
    est.mira.z+=(bz*0.9-est.mira.z)*Math.min(1,dt*CAM3D.suave);
    est.mira.y=CAM3D.mira_alto;
    est.camGL.lookAt(est.mira);
  }
  est.sincronizar=sincronizar;

  let last=performance.now();
  const t0=last, tiempos=[];
  /* 7.9125 · si va lento NO se cambia solo a 2D: se ofrece (chip chico, "Seguir así" no vuelve a preguntar) */
  const vigilar=(ms,now)=>{ if(est.vigilado||now-t0<1500) return; tiempos.push(ms);
    if(tiempos.length<30) return; est.vigilado=true;
    const med=tiempos.slice().sort((a,b)=>a-b)[15]; est.msMediana=Math.round(med);
    if(med>50&&typeof ofrecerAliviar3D==="function") est.ofrecido=!!ofrecerAliviar3D(host,"🐢 La cancha 3D va lenta en este equipo ("+est.msMediana+" ms por cuadro).",function(){
      if(E){ if(!E.config) E.config={}; E.config.cancha3d=false; if(typeof guardar==="function") guardar(); }
      detenerCancha3D(); montarCanchaAuto(host,est.P); }); };
  function cuadro(){
    if(!canvas.isConnected){ detenerCancha3D(); return; }
    const now=performance.now(); let dtReal=now-last, dt=dtReal/1000; last=now; if(dt>0.1) dt=0.1;
    if(!document.hidden) vigilar(dtReal,now);
    if(document.hidden){ est.raf=requestAnimationFrame(cuadro); return; }
    const rc=canvas.getBoundingClientRect();
    if(rc.width&&(Math.abs(rc.width-est.W0)>0.5||Math.abs(rc.height-est.H0)>0.5)){
      est.W0=rc.width; est.H0=rc.height; renderer.setSize(rc.width,rc.height,false); camGL.aspect=rc.width/Math.max(1,rc.height); camGL.updateProjectionMatrix();
    }
    try{ if(typeof _cvStep==="function") _cvStep(est.P,dt); sincronizar(dt); renderer.render(scene,camGL); }
    catch(e){ if(window.console) console.error("cancha3d:",e); detenerCancha3D();
      if(typeof aviso==="function") aviso("La cancha 3D tuvo un error: este partido sigue en 2D (el 3D sigue prendido para el próximo).",5000);   /* 7.9125 · nunca sin avisar */
      if(typeof montarCancha==="function"){ const cv=document.createElement("canvas"); cv.className="cancha2d"; host.appendChild(cv); montarCancha(cv); } return; }
    est.raf=requestAnimationFrame(cuadro);
  }
  est.raf=requestAnimationFrame(cuadro);
  return est;
}
function detenerCancha3D(){
  const e=C3D.est; if(!e) return; C3D.est=null;
  try{ cancelAnimationFrame(e.raf); }catch(_){}
  try{ e.renderer.dispose(); e.renderer.forceContextLoss(); }catch(_){}
  try{ if(e.canvas&&e.canvas.parentNode) e.canvas.parentNode.removeChild(e.canvas); }catch(_){}
}
/* entrada única: monta 3D si corresponde (cargando Three si falta), sino cae al 2D. host = contenedor de la cancha. */
function montarCanchaAuto(host, P){
  if(!host) return;
  host.querySelectorAll(".cancha3d,.cancha2d").forEach(c=>{ try{ c.remove(); }catch(_){} });
  const al2D=()=>{ const cv=(typeof canchaReusable==="function"&&canchaReusable())||document.createElement("canvas");
    cv.className="cancha2d"; cv.setAttribute("aria-hidden","true"); host.appendChild(cv); if(typeof montarCancha==="function") montarCancha(cv); };
  if(!cancha3dActivo()){ al2D(); return; }
  if(typeof THREE!=="undefined"){ if(!montarCancha3D(host,P)) al2D(); return; }
  /* Three no cargó aún: 2D mientras baja, y cuando llega se cambia (si seguimos en el mismo partido) */
  al2D();
  if(typeof cargarThree==="function") cargarThree().then(ok=>{ if(ok&&host.isConnected&&cancha3dActivo()){
    host.querySelectorAll(".cancha2d").forEach(c=>{ try{ if(typeof detenerCancha==="function") detenerCancha(); c.remove(); }catch(_){} });
    if(!montarCancha3D(host,P)) al2D(); } });
}
