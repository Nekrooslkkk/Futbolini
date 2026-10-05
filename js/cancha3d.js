"use strict";
/* ============================================================
   FUTBOLINI · cancha3d.js — PARTIDO EN 3D (cámara estilo FIFA) · 7.9122 esqueleto · 7.9126 reconstruida
   Pedido del autor: el partido en vivo con cámara 3D tipo FIFA, más cerca y suave, y que corra en celus flacos.

   CLAVE (no cambia): no es una animación aparte. Lee la MISMA simulación que el cenital (`_cvStep`/`_cvSt` de
   cancha.js): cada cuadro avanza el estado y pone cada jugador y la pelota donde están. Es una cámara de la simulación.

   7.9126 · lo que cambió (medido en Chromium):
   - SE REUSA: antes cada repintado del partido (gol, entretiempo, un evento) destruía y rearmaba la escena WebGL entera
     (4 veces en 15 s: un tirón cada vez y los jugadores volvían a la formación). Ahora el mismo renderer, la misma
     escena y la misma simulación siguen; solo se cambia de contenedor. Se libera 30 s después de salir del partido.
   - JUGADORES CON CUERPO: torso, short, franja, brazos y piernas que corren (rodilla que dobla), cabeza, pelo y piel
     distintos, medias y zapatos, con la camiseta real (KITS vía _cvColores). Todo instanciado: 22 jugadores = ~12
     llamadas de dibujo (antes ~90 solo con cilindros).
   - ARQUERO QUE SE TIRA Y ATRAPA: se lanza hacia el lado del remate (rueda el cuerpo, brazos arriba) y, si la ataja,
     la pelota queda en sus manos hasta que saca. Antes era un cilindro quieto ("se congela").
   - PELOTA CON FÍSICA DE REMATE (cancha.js): el tiro al arco entra bajo el travesaño y entre los palos; el desviado se
     va al lado o por arriba, queda afuera y hay saque de arco (antes volvía sola rodando al arquero).
   - CANCHA EN UNA TEXTURA: pasto con franjas de corte y todas las líneas (áreas, medialuna, córner) en 1 dibujo
     (antes ~60 mallas sueltas). Sombras de mancha baratas en vez de mapas de sombra.
   - RENDIMIENTO: calidad Auto ajusta la resolución para mantenerse fluido (lo dice Ajustes), tope 30 cps en liviano,
     no dibuja con la pestaña oculta. Calidad "Antigua": 3D de consola vieja (baja resolución, sin público, 30 cps)
     que se puede usar en Modo papa.
   Mundo en METROS: cancha 105×68 centrada; largo = eje Z (−52,5..52,5), ancho = eje X (−34..34).
   Mapeo desde la sim (0..1): worldZ=(st.x−0,5)*105 · worldX=(st.y−0,5)*68 · altura pelota = ball.z*11.
   ============================================================ */

/* una sola fuente de verdad para la cámara: así el autor (o el doctor) la afina sin cazar números por todo el archivo */
const CAM3D={ lado:23, alto:9.5, mira_alto:0.6, sigue_z:0.86, sigue_x:0.4, suave:3.0, fov:38, fov_area:32, adelanta:5,
  gol_lado:16, gol_alto:6.5, gol_fov:30 };
/* perfiles de calidad: pr = resolución (× píxeles de pantalla), publico = gente en la tribuna, tex = textura del pasto */
const C3D_PERFIL={
  alta:   {pr:1.6,  prMin:0.7,  aa:true,  publico:1800, tex:2048, fps:60, plano:false, sombras:true},
  media:  {pr:1.1,  prMin:0.6,  aa:false, publico:800,  tex:1536, fps:30, plano:false},
  antigua:{pr:0.5,  prMin:0.5,  aa:false, publico:0,    tex:512,  fps:30, plano:true}
};
const C3D={ est:null, montajes:0, reusos:0, pastos:{} };
/* colores de camiseta (sRGB) → lineal: sin esto el azul de Limache salía celeste y todo se veía lavado */
function c3dCol(hex,C){ return (C||new THREE.Color()).set(hex).convertSRGBToLinear(); }

function cancha3dSoportado(){ try{ return typeof webglDisponible==="function" && webglDisponible(); }catch(e){ return false; } }
function cancha3dPreferido(){
  try{
    if(typeof E!=="undefined"&&E&&E.config&&E.config.cancha3d!=null) return !!E.config.cancha3d;
    return false;   /* por ahora OFF por defecto: se prende en Ajustes mientras lo pulimos */
  }catch(e){ return false; }
}
/* ¿se usa el 3D para este partido? (preferencia + soporte + no Modo papa, salvo que el jugador pida el 3D antiguo) */
function cancha3dActivo(){
  if(!cancha3dPreferido()||!cancha3dSoportado()) return false;
  try{ if(document.documentElement.classList.contains("papa")&&!(E&&E.config&&E.config.cancha3dPapa)) return false; }catch(e){}
  return true;
}
/* "auto" (por defecto) · "alta" · "antigua". En Modo papa siempre antigua. */
function c3dCalidad(){
  try{ if(document.documentElement.classList.contains("papa")) return "antigua"; }catch(e){}
  const c=(typeof E!=="undefined"&&E&&E.config&&E.config.c3dCalidad)||"auto";
  if(c==="alta"||c==="antigua") return c;
  return (typeof _cvLiviano==="function"&&_cvLiviano())?"media":"alta";
}
function c3dAuto(){ return !((typeof E!=="undefined"&&E&&E.config&&E.config.c3dCalidad)&&E.config.c3dCalidad!=="auto"); }

/* ---------- cancha: pasto con franjas y TODAS las líneas en una sola textura ---------- */
const C3D_MARGEN=4;   /* metros de pasto alrededor de la cancha dentro de la textura */
function _c3dPastoCanvas(px){
  if(C3D.pastos[px]) return C3D.pastos[px];
  const LX=68+C3D_MARGEN*2, LZ=105+C3D_MARGEN*2, W=px, H=Math.round(px*LX/LZ), k=W/LZ;
  const c=document.createElement("canvas"); c.width=W; c.height=H; const x=c.getContext("2d");
  /* franjas de corte (a lo ancho, como en la tele) */
  const n=18;
  /* 7.9128 · verde de transmisión (más profundo; el de antes era pastel) */
  for(let i=0;i<n;i++){ x.fillStyle=i%2?"#2e7a2a":"#378a32"; x.fillRect(Math.floor((C3D_MARGEN+i*105/n)*k),0,Math.ceil(105/n*k)+1,H); }
  x.fillStyle="#2c7228"; x.fillRect(0,0,Math.ceil(C3D_MARGEN*k),H); x.fillRect(Math.floor((C3D_MARGEN+105)*k),0,Math.ceil(C3D_MARGEN*k)+1,H);
  /* grano: puntitos claros y oscuros (sin esto la franja se ve de plástico) */
  if(px>=1024){ for(let i=0;i<W*H/180;i++){ x.fillStyle=Math.random()<0.5?"rgba(0,0,0,.06)":"rgba(255,255,255,.05)"; x.fillRect(Math.random()*W,Math.random()*H,1.5,1.5); } }
  /* líneas: z (largo) → x del canvas, x (ancho) → y del canvas */
  const X=m=>(m+C3D_MARGEN)*k, Y=m=>(m+C3D_MARGEN)*k;
  x.strokeStyle="rgba(245,248,242,.92)"; x.lineWidth=Math.max(1.2,0.12*k); x.lineCap="square";
  const lin=(z1,w1,z2,w2)=>{ x.beginPath(); x.moveTo(X(z1),Y(w1)); x.lineTo(X(z2),Y(w2)); x.stroke(); };
  x.strokeRect(X(0),Y(0),105*k,68*k);
  lin(52.5,0,52.5,68);
  x.beginPath(); x.arc(X(52.5),Y(34),9.15*k,0,Math.PI*2); x.stroke();
  x.fillStyle=x.strokeStyle; x.beginPath(); x.arc(X(52.5),Y(34),Math.max(1.5,0.25*k),0,Math.PI*2); x.fill();
  [0,105].forEach(z0=>{
    const s=z0===0?1:-1;
    x.strokeRect(Math.min(X(z0),X(z0+s*16.5)),Y(34-20.16),16.5*k,40.32*k);
    x.strokeRect(Math.min(X(z0),X(z0+s*5.5)),Y(34-9.16),5.5*k,18.32*k);
    const pz=z0+s*11; x.beginPath(); x.arc(X(pz),Y(34),Math.max(1.5,0.22*k),0,Math.PI*2); x.fill();
    /* medialuna: el arco del círculo de 9,15 m que queda fuera del área */
    const a=Math.acos(5.5/9.15); x.beginPath();
    if(s>0) x.arc(X(pz),Y(34),9.15*k,-a,a); else x.arc(X(pz),Y(34),9.15*k,Math.PI-a,Math.PI+a);
    x.stroke();
    [0,68].forEach(w0=>{ x.beginPath(); x.arc(X(z0),Y(w0),1*k,0,Math.PI*2); x.stroke(); });   /* banderines */
  });
  C3D.pastos[px]=c;
  return c;
}
function _c3dCancha(scene,perfil){
  const g=new THREE.Group();
  const fondo=new THREE.Mesh(new THREE.PlaneGeometry(170,140),new THREE.MeshLambertMaterial({color:c3dCol(0x2f6e2a)}));
  fondo.rotation.x=-Math.PI/2; fondo.position.y=-0.02; g.add(fondo);
  const tex=new THREE.CanvasTexture(_c3dPastoCanvas(perfil.tex));
  tex.encoding=THREE.sRGBEncoding; tex.anisotropy=perfil.plano?1:8;
  if(perfil.plano){ tex.magFilter=THREE.NearestFilter; tex.generateMipmaps=false; tex.minFilter=THREE.LinearFilter; }
  /* el canvas va con el largo en x: el plano se rota para que el largo quede en el eje Z del mundo */
  const LX=68+C3D_MARGEN*2, LZ=105+C3D_MARGEN*2;
  const pasto=new THREE.Mesh(new THREE.PlaneGeometry(LZ,LX),new THREE.MeshLambertMaterial({map:tex}));
  pasto.rotation.x=-Math.PI/2; pasto.rotation.z=Math.PI/2; pasto.receiveShadow=!!perfil.sombras; g.add(pasto);
  [-1,1].forEach(sg=>_c3dArco(g,sg));
  scene.add(g);
  return g;
}
/* un arco en el fondo sg (±1): palos, travesaño y red en una sola malla de líneas */
function _c3dArco(g,sg){
  const W=3.66, H=2.44, z0=52.5*sg, zb=z0+2.0*sg;
  const mPalo=new THREE.MeshLambertMaterial({color:0xf8f8f8});
  const barra=(xa,ya,za,xb,yb,zb2)=>{ const a=new THREE.Vector3(xa,ya,za), b=new THREE.Vector3(xb,yb,zb2), len=a.distanceTo(b);
    const m=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,len,8),mPalo); m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize()); g.add(m); };
  barra(-W,0,z0,-W,H,z0); barra(W,0,z0,W,H,z0); barra(-W,H,z0,W,H,z0);
  const pts=[], paso=0.3;
  for(let x=-W;x<=W+1e-6;x+=paso){ pts.push(x,H,z0, x,H*0.85,zb); pts.push(x,H*0.85,zb, x,0,zb); }
  for(let y=0;y<=H*0.85+1e-6;y+=paso){ pts.push(-W,y,zb, W,y,zb); }
  for(let z=0;z<=2;z+=paso){ const zz=z0+z*sg, hh=H-(H*0.15)*z/2; pts.push(-W,0,zz,-W,hh,zz); pts.push(W,0,zz,W,hh,zz); pts.push(-W,hh,zz,W,hh,zz); }
  const geo=new THREE.BufferGeometry(); geo.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
  g.add(new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0xeef3f8,transparent:true,opacity:0.55})));
}
/* 7.9128 · público pintado (como en el PES 2006): una textura de gente sentada con los colores del local, sobre la
   rampa de cada tribuna. Más barata que 1800 cubos y se ve como una galería llena, no como cajas sueltas. */
function _c3dPublicoTex(col,px){
  const W=px, H=Math.round(px/4), c=document.createElement("canvas"); c.width=W; c.height=H; const x=c.getContext("2d");
  x.fillStyle="#141821"; x.fillRect(0,0,W,H);
  const filas=10, alto=H/filas, ancho=alto*0.62, cols=[col,col,col,"#f2f2f2","#d9d2c3","#2b3140","#8a1f1f",col];
  const pieles=["#e8b98f","#c99067","#8d5a3b","#5a3a28","#f1cfae"];
  for(let f=0;f<filas;f++){ const y0=f*alto;
    x.fillStyle=f%2?"#1b2029":"#171b24"; x.fillRect(0,y0,W,alto);
    for(let cx=(f%2)*ancho*0.5;cx<W;cx+=ancho*(0.95+Math.random()*0.25)){
      if(Math.random()<0.07) continue;   /* algún asiento vacío */
      const w=ancho*0.72, xx=cx+(Math.random()-0.5)*2;
      x.fillStyle=cols[(Math.random()*cols.length)|0]; x.beginPath(); x.ellipse(xx+w/2,y0+alto*0.84,w/2,alto*0.42,0,Math.PI,0); x.fill();
      x.fillStyle=pieles[(Math.random()*pieles.length)|0]; x.beginPath(); x.arc(xx+w/2,y0+alto*0.36,alto*0.19,0,Math.PI*2); x.fill();
      if(Math.random()<0.12){ x.fillStyle=col; x.fillRect(xx+w*0.1,y0+alto*0.02,w*0.18,alto*0.3); }   /* brazos/bandera arriba */
    } }
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.wrapS=THREE.RepeatWrapping; return t;
}
/* estadio: tribunas en escalones, techo en las laterales, carteles, torres de luz y público */
function _c3dEstadio(scene,hc,perfil){
  const g=new THREE.Group(), cem=new THREE.MeshLambertMaterial({color:c3dCol(0x2a303c)}), cem2=new THREE.MeshLambertMaterial({color:c3dCol(0x353c4a)});
  const grada=(cx,cz,largo,lateral,rotY)=>{
    for(let t=0;t<4;t++){ const m=new THREE.Mesh(new THREE.BoxGeometry(largo,1.6+t*1.6,3.2),t%2?cem:cem2);
      const off=t*3.2+1.6; m.position.set(cx+(lateral?Math.sign(cx)*off:0),(1.6+t*1.6)/2,cz+(lateral?0:Math.sign(cz)*off)); m.rotation.y=rotY; g.add(m); }
  };
  grada(0,-58,124,false,0); grada(0,58,124,false,0);
  grada(-40,0,96,true,Math.PI/2); grada(40,0,96,true,Math.PI/2);
  if(!perfil.plano){ [-1,1].forEach(s=>{ const techo=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.5,100),cem); techo.position.set(s*53,14,0); g.add(techo);
    const t2=new THREE.Mesh(new THREE.BoxGeometry(14,0.3,100),new THREE.MeshLambertMaterial({color:c3dCol(0x1b2029)})); t2.position.set(s*47,13.6,0); t2.rotation.z=-s*0.1; g.add(t2); }); }
  /* carteles alrededor de la cancha (la misma textura LED del balón parado si está) */
  const ptex=(typeof _texPublicidad==="function")?_texPublicidad():null;
  if(ptex){ ptex.wrapS=THREE.RepeatWrapping; ptex.repeat.set(8,1); }
  const mCartel=ptex?new THREE.MeshBasicMaterial({map:ptex}):new THREE.MeshBasicMaterial({color:0x123a7a});
  [[0,-56.5,112,0],[0,56.5,112,Math.PI],[-37.5,0,104,Math.PI/2],[37.5,0,104,-Math.PI/2]].forEach(c=>{
    const m=new THREE.Mesh(new THREE.PlaneGeometry(c[2],0.9),mCartel); m.position.set(c[0],0.45,c[1]); m.rotation.y=c[3]; g.add(m); });
  /* torres de luz con focos que brillan */
  const mFoco=new THREE.MeshBasicMaterial({color:0xfff6d8});
  [[-46,-62],[46,-62],[-46,62],[46,62]].forEach(p=>{
    const poste=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.5,30,6),cem); poste.position.set(p[0],15,p[1]); g.add(poste);
    const panel=new THREE.Mesh(new THREE.BoxGeometry(5,3,0.4),mFoco); panel.position.set(p[0],31,p[1]); panel.lookAt(0,0,0); g.add(panel);
  });
  /* público: la galería pintada sobre la rampa de cada tribuna (4 escalones de 3,2 × 1,6 m) */
  const n=perfil.publico;
  if(n>0&&!perfil.cubos){
    const col=(hc&&hc[0])||"#2a3550", tex=_c3dPublicoTex(col,perfil.tex>=2048?2048:1024);
    /* la rampa pasa por el borde de arriba de cada escalón: de (0 m, 1,6 m) a (9,6 m, 6,4 m) desde la base */
    const largoR=Math.hypot(9.6,4.8)+1.2, ang=Math.atan2(1.6,3.2);
    [[0,-58,124,false],[0,58,124,false],[-40,0,96,true],[40,0,96,true]].forEach(g0=>{
      const t2=tex.clone(); t2.needsUpdate=true; t2.repeat.set(g0[2]/14,1);
      const m=new THREE.Mesh(new THREE.PlaneGeometry(g0[2],largoR),new THREE.MeshLambertMaterial({map:t2}));
      const sg=g0[3]?Math.sign(g0[0]):Math.sign(g0[1]), off=4.8, alto=4.0+0.12;
      if(g0[3]){ m.rotation.order="YXZ"; m.rotation.y=-sg*Math.PI/2; m.rotation.x=-(Math.PI/2-ang); m.position.set(g0[0]+sg*off,alto,0); }
      else { m.rotation.order="YXZ"; m.rotation.y=sg>0?Math.PI:0; m.rotation.x=-(Math.PI/2-ang); m.position.set(0,alto,g0[1]+sg*off); }
      g.add(m); });
  } else if(n>0){
    const pub=new THREE.InstancedMesh(new THREE.BoxGeometry(0.45,0.7,0.45),new THREE.MeshLambertMaterial(),n), M=new THREE.Matrix4(), C=new THREE.Color();
    const col=(hc&&hc[0])||"#2a3550";
    const cols=[c3dCol(col),c3dCol(col),c3dCol("#f4f4f4"),c3dCol("#d8d2c4"),c3dCol("#3a4152"),c3dCol(col).multiplyScalar(0.45)];
    for(let i=0;i<n;i++){
      const lado=i%4, t=(Math.random()*4)|0, off=t*3.2+1.6+(Math.random()-0.5)*2.2, y=1.6+t*1.6+0.35;
      let x,z;
      if(lado<2){ x=(Math.random()-0.5)*120; z=(lado?1:-1)*(58+off); } else { z=(Math.random()-0.5)*92; x=(lado===2?-1:1)*(40+off); }
      M.makeTranslation(x,y,z); pub.setMatrixAt(i,M); pub.setColorAt(i,C.copy(cols[(Math.random()*cols.length)|0]));
    }
    pub.instanceMatrix.needsUpdate=true; if(pub.instanceColor) pub.instanceColor.needsUpdate=true; g.add(pub);
  }
  scene.add(g);
  return g;
}
function _c3dCielo(scene,perfil){
  if(perfil.plano){ scene.background=new THREE.Color(0x1b2a44); return; }
  const c=document.createElement("canvas"); c.width=4; c.height=256; const x=c.getContext("2d");
  const gr=x.createLinearGradient(0,0,0,256); gr.addColorStop(0,"#0b1630"); gr.addColorStop(0.55,"#24406e"); gr.addColorStop(1,"#4d6f9c");
  x.fillStyle=gr; x.fillRect(0,0,4,256); const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; scene.background=t;
}

/* ---------- jugadores: un "esqueleto" barato, todo instanciado ---------- */
/* medidas en metros, pies en y=0, mirando a +Z.
   7.9128 · el autor: "se ve muy robótico, nada parecido al PES 2006". Cuerpo con forma (torso que se angosta en la
   cintura, hombros, cuello, manos, botines redondeados; brazos y piernas en cápsula: sin cortes en codo y rodilla). */
const C3D_CUERPO={ cadera:0.93, muslo:0.44, pierna:0.43, hombro:1.47, brazo:0.29, antebrazo:0.29, ancho_cad:0.1, ancho_hom:0.235, torso:0.6 };
function _c3dTorsoGeo(seg){
  /* perfil (radio, alto) de cintura a cuello, achatado de adelante hacia atrás */
  const pf=[[0.0,-0.3],[0.155,-0.3],[0.165,-0.18],[0.19,0.0],[0.215,0.16],[0.205,0.25],[0.13,0.3],[0.0,0.31]].map(q=>new THREE.Vector2(q[0],q[1]));
  return new THREE.LatheGeometry(pf,seg).scale(1,1,0.66);
}
function _c3dPiezas(scene,perfil){
  const lam=()=>new THREE.MeshLambertMaterial({flatShading:!!perfil.plano});
  const seg=perfil.plano?6:12, cs=perfil.plano?2:4;
  const P={};
  const im=(nombre,geo,n)=>{ const m=new THREE.InstancedMesh(geo,lam(),n); m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled=false;
    m.castShadow=!perfil.plano; scene.add(m); P[nombre]=m; return m; };
  const caps=(r,l)=>new THREE.CapsuleGeometry(r,Math.max(0.01,l-2*r),cs,seg);
  im("torso",_c3dTorsoGeo(seg),22);
  im("franja",new THREE.BoxGeometry(1,1,1),22);
  im("short",new THREE.LatheGeometry([[0,0.14],[0.17,0.14],[0.195,0.02],[0.205,-0.2],[0,-0.2]].map(q=>new THREE.Vector2(q[0],q[1])),seg).scale(1,1,0.8),22);
  im("hombro",new THREE.SphereGeometry(0.082,seg,Math.max(4,seg/2)),44);
  im("cuello",new THREE.CylinderGeometry(0.06,0.07,0.1,seg),22);
  im("manga",caps(0.068,C3D_CUERPO.brazo+0.06),44);
  im("antebrazo",caps(0.05,C3D_CUERPO.antebrazo+0.05),44);
  im("mano",new THREE.SphereGeometry(0.052,seg,Math.max(4,seg/2)),44);
  im("muslo",caps(0.085,C3D_CUERPO.muslo+0.08),44);
  im("media",caps(0.06,C3D_CUERPO.pierna+0.06),44);
  im("zapato",new THREE.CapsuleGeometry(0.048,0.17,cs,seg).rotateX(Math.PI/2).scale(1.1,0.8,1),44);
  im("cabeza",new THREE.SphereGeometry(0.122,seg+2,seg).scale(0.9,1.1,1),22);
  im("pelo",new THREE.SphereGeometry(0.13,seg+2,Math.max(4,seg/2),0,Math.PI*2,0,Math.PI*0.5).scale(0.93,1.05,1.03),22);
  im("guante",new THREE.BoxGeometry(0.12,0.15,0.08),4);
  return P;
}
/* colores de cada pieza para los 22 (camiseta real, arquero distinto, piel y pelo de cada uno) */
function _c3dPintar(est){
  const P=est.piezas, st=est.st, col=(typeof _cvColores==="function")?_cvColores(est.P):{mio:"#eef3ff",riv:"#e5484d"};
  const C=new THREE.Color(), lejos=(a,b)=>(typeof _cvLejos==="function")?_cvLejos(a,b):999;
  const arqueroDe=(base)=>["#1f9d55","#f5c518","#7a3fd1","#ff7a1a","#18a0c8"].find(c=>lejos(c,col.mio)>140&&lejos(c,col.riv)>140&&lejos(c,base)>140)||"#222428";
  const arqMio=arqueroDe(col.mio), arqRiv=arqueroDe(arqMio);
  est.franjas=[];
  for(let i=0;i<22;i++){
    const p=st&&st.jug[i]; if(!p) continue;
    const mio=i<11, gk=p.rol==="gk";
    const cam=gk?(mio?arqMio:arqRiv):(mio?col.mio:col.riv);
    const sh=gk?"#1b1d22":((mio?col.shortMio:col.shortRiv)||"#20242c");
    const med=gk?cam:((mio?col.mediasMio:col.mediasRiv)||cam);
    const look=(typeof _cvLook==="function")?_cvLook(p,i):{piel:"#e0ac7e",pelo:"#1b1410",pelado:false};
    P.torso.setColorAt(i,c3dCol(cam,C)); P.short.setColorAt(i,c3dCol(sh,C));
    P.cabeza.setColorAt(i,c3dCol(look.piel,C)); P.pelo.setColorAt(i,c3dCol(look.pelo,C));
    const fr=gk?null:(mio?col.franjaMio:col.franjaRiv), frc=gk?null:(mio?col.franjaColorMio:col.franjaColorRiv);
    est.franjas[i]=fr&&frc?fr:null; P.franja.setColorAt(i,c3dCol(frc||cam,C));
    P.cuello.setColorAt(i,c3dCol(look.piel,C));
    for(let k=0;k<2;k++){ const j=i*2+k;
      P.hombro.setColorAt(j,c3dCol(cam,C)); P.mano.setColorAt(j,c3dCol(look.piel,C));
      P.manga.setColorAt(j,c3dCol(cam,C)); P.antebrazo.setColorAt(j,c3dCol(look.piel,C)); P.muslo.setColorAt(j,c3dCol(look.piel,C));
      P.media.setColorAt(j,c3dCol(med,C)); P.zapato.setColorAt(j,c3dCol(gk?"#f2f2f2":"#15161a",C)); }
    est.pelados[i]=!!look.pelado;
  }
  for(let k=0;k<4;k++) P.guante.setColorAt(k,c3dCol("#f3f6fa",C));
  Object.keys(P).forEach(n=>{ if(P[n].instanceColor) P[n].instanceColor.needsUpdate=true; });
}
/* matrices de trabajo (sin crear objetos por cuadro) */
let _C3M=null;
function _c3dM(){ if(!_C3M) _C3M={W:new THREE.Matrix4(), B:new THREE.Matrix4(), T:new THREE.Matrix4(), R:new THREE.Matrix4(), S:new THREE.Matrix4(),
  e:new THREE.Euler(0,0,0,"YXZ"), v:new THREE.Vector3(), cero:new THREE.Matrix4().makeScale(0,0,0)}; return _C3M; }
function _c3dT(m,x,y,z){ const K=_C3M; K.T.makeTranslation(x,y,z); return m.multiply(K.T); }
function _c3dR(m,x,y,z){ const K=_C3M; K.e.set(x,y||0,z||0,"YXZ"); K.R.makeRotationFromEuler(K.e); return m.multiply(K.R); }
function _c3dS(m,x,y,z){ const K=_C3M; K.S.makeScale(x,y,z); return m.multiply(K.S); }
/* una pierna (muslo, media, zapato) o un brazo (manga, antebrazo, mano/guante) desde su articulación */
function _c3dMiembro(P,a,b,c,idx,B,jx,jy,jz,ang1,abd,ang2,l1,l2,cIdx,pie){
  const K=_C3M;
  K.W.copy(B); _c3dT(K.W,jx,jy,jz); _c3dR(K.W,ang1,0,abd); _c3dT(K.W,0,-l1/2,0); P[a].setMatrixAt(idx,K.W);
  _c3dT(K.W,0,-l1/2,0); _c3dR(K.W,ang2,0,0); _c3dT(K.W,0,-l2/2,0); P[b].setMatrixAt(idx,K.W);
  if(c){ _c3dT(K.W,0,-l2/2-0.035,c==="zapato"?0.05:0); if(c==="zapato") _c3dR(K.W,-ang1-ang2+(pie||0),0,0); P[c].setMatrixAt(cIdx!=null?cIdx:idx,K.W); }
}
/* ---------- 7.9128 · GESTOS: carrera de verdad + acciones (patear, controlar, cabecear, disputar) ----------
   Un gesto = ángulos del cuerpo: {lift, roll, pitch (tronco adelante), twist, nod, legs:[{t,k,a}], arms:[{s,a,e}]}.
   pierna: t = muslo (− adelante), k = rodilla, a = abrir · brazo: s = hombro (− adelante/arriba), a = abrir, e = codo.
   La pierna 0 es la DERECHA del jugador (mira a +Z: su derecha es −X): con esa patea. */
function _c3dGestoVacio(){ return {lift:0,roll:0,pitch:0,twist:0,nod:0,lean:0,pelvis:0,legs:[{t:0,k:0,a:0,p:0},{t:0,k:0,a:0,p:0}],arms:[{s:0,a:0,e:0},{s:0,a:0,e:0}]}; }
function _c3dMezcla(o,g,w){
  if(w<=0) return o; if(w>1) w=1; const L=(a,b)=>a+(b-a)*w;
  ["lift","roll","pitch","twist","nod","lean","pelvis"].forEach(k=>{ o[k]=L(o[k]||0,g[k]||0); });
  for(let k=0;k<2;k++){ ["t","k","a","p"].forEach(q=>{ o.legs[k][q]=L(o.legs[k][q],g.legs[k][q]); }); ["s","a","e"].forEach(q=>{ o.arms[k][q]=L(o.arms[k][q],g.arms[k][q]); }); }
  return o;
}
/* carrera · 7.9129 (el autor: "que los esqueletos sean más smooth, todavía hay robotismo"):
   - Los brazos van contra las piernas (pierna derecha adelante → brazo izquierdo adelante). En 7.9126 iban del mismo
     lado, como camina un robot; ya estaba bien desde 7.9128 y ahora el doctor (movimiento_suave) lo vigila.
   - Todo depende de la velocidad, sin cortes: quieto → caminar → trotar → picar se mezclan suave (antes había un "si
     va lento, pose de parado" que saltaba de golpe). Caminando no hay rebote ni vuelo; corriendo, sí.
   - El ritmo de los pasos lo da la velocidad (fase propia en _c3dSincronizar): 1,6 pasos/s caminando hasta 4,6 picando.
   - La cadera gira con el paso y los hombros contra ella; el pie empuja al despegar; el cuerpo se inclina en las curvas
     (lean) y la cabeza se queda derecha aunque el tronco se incline (en _c3dPose). */
function _c3dCarrera(o,v,fase,t,i){
  const q=_c3dSuave(Math.min(1,v/0.7)), run=_c3dSuave(Math.max(0,Math.min(1,(v-2.1)/1.5))), a=Math.min(1,v/8.5), w=1-run;
  const amp=w*(0.17+0.07*Math.min(v,2.5))+run*(0.3+0.52*a);
  const rodVuelo=w*0.5+run*(0.55+1.25*a), rodBase=w*0.07+run*0.2;
  const brazo=w*(0.16+0.06*Math.min(v,2.5))+run*(0.3+0.6*a), codo=w*0.32+run*(0.95+0.5*a);
  o.pitch=(w*0.03+run*(0.06+0.15*a))*q; o.lift=run*Math.abs(Math.sin(fase))*0.05*(0.4+a);
  o.twist=Math.sin(fase)*(0.06+0.09*run)*q; o.pelvis=-Math.sin(fase)*(0.05+0.06*run)*q;
  for(let k=0;k<2;k++){
    const ph=fase+(k?Math.PI:0), sw=Math.sin(ph), atras=Math.max(0,-Math.cos(ph));
    const L=o.legs[k], A=o.arms[k];
    L.t=(-sw*amp+0.04*run)*q; L.k=(rodBase+rodVuelo*atras)*q; L.a=(k?1:-1)*0.03; L.p=0.3*atras*run*q;
    /* el brazo de este lado va para atrás cuando la pierna de este lado va adelante */
    A.s=(sw*brazo+0.05)*q; A.a=(k?1:-1)*(0.08+0.06*run); A.e=-(0.25+codo*(0.75+0.25*Math.max(0,-sw)))*q;
  }
  if(q<1){   /* parado: atento, rodillas apenas dobladas, respira (se mezcla según cuán quieto está) */
    const r=Math.sin(t*2.1+i*1.7)*0.02, w2=1-q;
    o.pitch+=(0.06+r)*w2;
    for(let k=0;k<2;k++){ o.legs[k].k+=0.16*w2; o.legs[k].t+=-0.05*w2; o.arms[k].e+=-0.45*w2; o.arms[k].s+=(0.05+r)*w2; o.arms[k].a+=(k?1:-1)*0.1*w2; }
  }
  return o;
}
const _c3dSuave=u=>u<=0?0:(u>=1?1:u*u*(3-2*u));
/* claves de una acción en el tiempo u (0..1): interpola entre poses [u0, gesto] */
function _c3dCopia(d,o){
  d.lift=o.lift; d.roll=o.roll; d.pitch=o.pitch; d.twist=o.twist; d.nod=o.nod; d.lean=o.lean||0; d.pelvis=o.pelvis||0;
  for(let k=0;k<2;k++){ const a=d.legs[k], b=o.legs[k]; a.t=b.t; a.k=b.k; a.a=b.a; a.p=b.p; const c=d.arms[k], e=o.arms[k]; c.s=e.s; c.a=e.a; c.e=e.e; }
  return d;
}
let _C3G=null;   /* gesto de trabajo (sin crear objetos por cuadro: en el compu papa eso traba) */
function _c3dClave(claves,u){
  let a=claves[0], b=claves[claves.length-1];
  for(let k=0;k<claves.length-1;k++){ if(u>=claves[k][0]&&u<=claves[k+1][0]){ a=claves[k]; b=claves[k+1]; break; } }
  const w=_c3dSuave((u-a[0])/Math.max(1e-4,b[0]-a[0]));
  if(!_C3G) _C3G=_c3dGestoVacio();
  return _c3dMezcla(_c3dCopia(_C3G,a[1]),b[1],w);
}
function _c3dG(d){ const g=_c3dGestoVacio(); Object.keys(d).forEach(k=>{ if(k==="L0") Object.assign(g.legs[0],d[k]); else if(k==="L1") Object.assign(g.legs[1],d[k]);
  else if(k==="A0") Object.assign(g.arms[0],d[k]); else if(k==="A1") Object.assign(g.arms[1],d[k]); else g[k]=d[k]; }); return g; }
/* poses clave de cada acción (pierna 0 = derecha, la que patea) */
const C3D_ACCIONES={
  patada:[[0,_c3dG({pitch:0.05,L1:{k:0.25},A0:{s:0.2,a:-0.35,e:-0.5},A1:{s:-0.2,a:0.45,e:-0.5}})],
          [0.35,_c3dG({pitch:0.0,L0:{t:0.65,k:1.5},L1:{t:-0.05,k:0.35},A0:{s:0.3,a:-0.5,e:-0.4},A1:{s:-0.4,a:0.6,e:-0.4}})],
          [0.55,_c3dG({pitch:-0.05,L0:{t:-0.95,k:0.15,p:-0.2},L1:{t:0.05,k:0.3},A0:{s:-0.3,a:-0.6,e:-0.4},A1:{s:0.3,a:0.5,e:-0.4},twist:-0.15})],
          [1,_c3dG({pitch:0.05,L0:{t:-0.25,k:0.4},L1:{k:0.25}})]],
  remate:[[0,_c3dG({pitch:0.12,L1:{k:0.3},A0:{s:0.3,a:-0.4,e:-0.5},A1:{s:-0.3,a:0.5,e:-0.5}})],
          [0.35,_c3dG({pitch:0.1,L0:{t:0.95,k:1.85},L1:{t:-0.1,k:0.45},A0:{s:0.45,a:-0.7,e:-0.4},A1:{s:-0.6,a:0.8,e:-0.4},twist:0.2})],
          [0.52,_c3dG({pitch:-0.12,L0:{t:-1.35,k:0.05,p:-0.3},L1:{t:0.1,k:0.25},A0:{s:-0.5,a:-0.8,e:-0.3},A1:{s:0.4,a:0.7,e:-0.4},twist:-0.3,lift:0.04})],
          [1,_c3dG({pitch:0.1,L0:{t:-0.4,k:0.6},L1:{k:0.3}})]],
  control:[[0,_c3dG({pitch:0.08,L1:{k:0.3}})],[0.45,_c3dG({pitch:0.12,L0:{t:-0.45,k:0.55,a:-0.25,p:0.3},L1:{k:0.4},A0:{a:-0.4,e:-0.6},A1:{a:0.4,e:-0.6}})],[1,_c3dG({pitch:0.08,L1:{k:0.25}})]],
  muslo:[[0,_c3dG({pitch:0.05})],[0.4,_c3dG({pitch:-0.05,L0:{t:-1.35,k:1.45},L1:{k:0.25},A0:{a:-0.6,e:-0.5},A1:{a:0.6,e:-0.5}})],[1,_c3dG({pitch:0.06,L0:{t:-0.2,k:0.5}})]],
  pecho:[[0,_c3dG({pitch:0})],[0.35,_c3dG({pitch:-0.4,nod:0.35,L0:{t:-0.1,k:0.4},L1:{t:0.1,k:0.45},A0:{s:-0.3,a:-1.0,e:-0.7},A1:{s:-0.3,a:1.0,e:-0.7}})],[1,_c3dG({pitch:0.05})]],
  cabeza:[[0,_c3dG({pitch:0.05,L0:{k:0.6},L1:{k:0.6},A0:{s:0.5,e:-0.6},A1:{s:0.5,e:-0.6}})],
          [0.25,_c3dG({pitch:-0.15,L0:{t:-0.15,k:0.9},L1:{t:0.1,k:1.2},A0:{s:-2.0,a:-0.3,e:-0.6},A1:{s:-1.9,a:0.3,e:-0.6},nod:-0.35})],
          [0.5,_c3dG({pitch:0.25,L0:{t:0.05,k:0.6},L1:{t:0.15,k:0.9},A0:{s:-1.2,a:-0.6,e:-0.5},A1:{s:-1.1,a:0.6,e:-0.5},nod:0.55})],
          [1,_c3dG({pitch:0.06,L0:{k:0.3},L1:{k:0.3}})]],
  salto:[[0,_c3dG({L0:{k:0.6},L1:{k:0.6}})],[0.3,_c3dG({pitch:-0.1,L0:{t:-0.1,k:0.9},L1:{t:0.05,k:1.1},A0:{s:-1.8,a:-0.4,e:-0.5},A1:{s:-1.6,a:0.4,e:-0.5}})],[1,_c3dG({L0:{k:0.3},L1:{k:0.3}})]],
  dividida:[[0,_c3dG({pitch:0.15})],[0.4,_c3dG({pitch:0.25,roll:0.12,L0:{t:-0.85,k:0.3,a:-0.15},L1:{t:0.2,k:0.7},A0:{s:0.2,a:-0.9,e:-0.4},A1:{s:-0.4,a:0.5,e:-0.8}})],[1,_c3dG({pitch:0.12,L0:{k:0.3},L1:{k:0.3}})]],
  entrada:[[0,_c3dG({pitch:0.2})],[0.35,_c3dG({pitch:0.35,lift:-0.18,L0:{t:-1.15,k:0.1,a:-0.2},L1:{t:0.35,k:1.35},A0:{s:0.1,a:-1.0,e:-0.3},A1:{s:-0.5,a:0.8,e:-0.5}})],[1,_c3dG({pitch:0.15,L0:{k:0.3},L1:{k:0.4}})]],
  atrapa:[[0,_c3dG({pitch:0.05})],[0.35,_c3dG({pitch:-0.05,A0:{s:-1.6,a:-0.15,e:-0.5},A1:{s:-1.6,a:0.15,e:-0.5},L0:{k:0.3},L1:{k:0.3}})],[1,_c3dG({pitch:0.1,A0:{s:-1.2,a:0.35,e:-1.0},A1:{s:-1.2,a:-0.35,e:-1.0}})]]
};
const C3D_QUIETO=_c3dGestoVacio();
C3D_ACCIONES.centro=C3D_ACCIONES.remate; C3D_ACCIONES.despeje=C3D_ACCIONES.remate;
/* el gesto de un jugador en este cuadro: carrera mezclada con la acción (entra y sale suave, nada de saltos de pose) */
function _c3dGesto(o,p,v,t,i,fase){
  _c3dCarrera(o,v,fase!=null?fase:(p._paso||0),t,i);
  const ac=p._acc, cl=ac&&C3D_ACCIONES[ac.tipo];
  if(cl){
    const u=Math.min(1,ac.t/Math.max(0.05,ac.dur)), w=Math.min(1,u/0.15,(1-u)/0.18+0.15);
    const g=_c3dClave(cl,u);
    if(ac.salto){ g.lift+=ac.salto*Math.sin(Math.PI*Math.min(1,u/0.8)); }
    _c3dMezcla(o,g,Math.max(0,w));
  }
  return o;
}
/* pone a un jugador: o = gesto + {x,z,yaw,brazos:"arriba"|"abrazo"|null} */
function _c3dPose(est,i,o){
  const P=est.piezas, K=_c3dM(), B=K.B, c=C3D_CUERPO;
  if(!o.legs) _c3dCarrera(Object.assign(o,_c3dGestoVacio()),0,0,0,i);
  B.makeTranslation(o.x,o.lift||0,o.z); _c3dR(B,0,o.yaw,0);
  if(o.lean) _c3dR(B,0,0,o.lean);   /* 7.9129 · se inclina en la curva (desde los pies, como en la cancha) */
  if(o.roll){ _c3dT(B,0,c.cadera,0); _c3dR(B,0,0,o.roll); _c3dT(B,0,-c.cadera,0); }
  /* tronco: gira desde la cadera (inclinación y torsión); hombros, cuello, cabeza y brazos cuelgan de él */
  const TR=K.T2||(K.T2=new THREE.Matrix4());
  TR.copy(B); _c3dT(TR,0,c.cadera+0.04,0); _c3dR(TR,o.pitch||0,o.twist||0,0);
  K.W.copy(TR); _c3dT(K.W,0,0.33,0); P.torso.setMatrixAt(i,K.W);
  const fr=est.franjas[i];
  if(fr==="horizontal"){ K.W.copy(TR); _c3dT(K.W,0,0.39,0); _c3dS(K.W,0.42,0.12,0.3); P.franja.setMatrixAt(i,K.W); }
  else if(fr==="vertical"){ K.W.copy(TR); _c3dT(K.W,0,0.33,0); _c3dS(K.W,0.11,0.56,0.3); P.franja.setMatrixAt(i,K.W); }
  else if(fr==="banda"){ K.W.copy(TR); _c3dT(K.W,0,0.35,0); _c3dR(K.W,0,0,0.75); _c3dS(K.W,0.1,0.62,0.3); P.franja.setMatrixAt(i,K.W); }
  else P.franja.setMatrixAt(i,K.cero);
  /* la cadera gira con el paso: el short y las piernas salen de ella */
  const BL=K.BL||(K.BL=new THREE.Matrix4()); BL.copy(B); if(o.pelvis) _c3dR(BL,0,o.pelvis,0);
  K.W.copy(BL); _c3dT(K.W,0,c.cadera-0.04,0); P.short.setMatrixAt(i,K.W);
  K.W.copy(TR); _c3dT(K.W,0,0.66,0.0); P.cuello.setMatrixAt(i,K.W);
  /* la cabeza se queda derecha mirando al frente aunque el tronco se incline o gire (como en la cancha) */
  K.W.copy(TR); _c3dT(K.W,0,0.69,0); _c3dR(K.W,(o.nod||0)-(o.pitch||0)*0.7,-(o.twist||0)*0.6,0); _c3dT(K.W,0,0.12,0.015); P.cabeza.setMatrixAt(i,K.W);
  _c3dT(K.W,0,0.03,-0.012); if(est.pelados[i]) _c3dS(K.W,0,0,0); P.pelo.setMatrixAt(i,K.W);
  /* piernas (desde la cadera, sin la inclinación del tronco) */
  for(let k=0;k<2;k++){
    const s=k?1:-1, L=o.legs[k];
    _c3dMiembro(P,"muslo","media","zapato",i*2+k,BL,s*c.ancho_cad,c.cadera,0,L.t,s*0.02+L.a,L.k,c.muslo,c.pierna,null,L.p);
  }
  /* brazos */
  const esArq=est.gk[i]>=0, hy=c.hombro-c.cadera-0.04;
  for(let k=0;k<2;k++){
    const s=k?1:-1, A=o.arms[k];
    let hom=A.s, abd=A.a, codo=A.e;
    if(o.brazos==="arriba"){ hom=-2.75; abd=s*0.25; codo=-0.15; }
    else if(o.brazos==="abrazo"){ hom=-1.25; abd=-s*0.35; codo=-0.9; }
    K.W.copy(TR); _c3dT(K.W,s*c.ancho_hom,hy,0); P.hombro.setMatrixAt(i*2+k,K.W);
    _c3dMiembro(P,"manga","antebrazo",esArq?"guante":"mano",i*2+k,TR,s*c.ancho_hom,hy,0,hom,abd,codo,c.brazo,c.antebrazo,esArq?est.gk[i]*2+k:null);
    if(esArq) P.mano.setMatrixAt(i*2+k,K.cero);
  }
}

/* ---------- montaje (se arma UNA vez y se reusa entre repintados del partido) ---------- */
function _c3dConstruir(host,P){
  const calidad=c3dCalidad(), perfil=C3D_PERFIL[calidad];
  const canvas=document.createElement("canvas"); canvas.className="cancha3d"+(perfil.plano?" c3d-antigua":""); canvas.setAttribute("aria-hidden","true");
  canvas.style.cssText="display:block;width:100%;height:100%";
  let renderer;
  try{ renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:perfil.aa,powerPreference:"high-performance"}); }
  catch(e){ return null; }
  renderer.outputEncoding=THREE.sRGBEncoding; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.0;
  /* 7.9128 · en Alta, sombras de verdad del foco (los jugadores proyectan su silueta como en el PES); en Media y Antigua,
     sombras de mancha (mucho más baratas) */
  renderer.shadowMap.enabled=!!perfil.sombras; if(perfil.sombras) renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const pr0=Math.min(perfil.pr,(window.devicePixelRatio||1)*(perfil.plano?0.5:1));
  renderer.setPixelRatio(pr0);
  const scene=new THREE.Scene();
  _c3dCielo(scene,perfil);
  if(!perfil.plano) scene.fog=new THREE.Fog(0x24406e,140,260);
  scene.add(new THREE.HemisphereLight(0xe4efff,0x2b3a22,0.85));
  const sol=new THREE.DirectionalLight(0xfff4e0,0.9); sol.position.set(30,60,25); scene.add(sol);
  if(perfil.sombras){ sol.castShadow=true; sol.shadow.mapSize.set(2048,2048); const sc=sol.shadow.camera; sc.left=-62; sc.right=62; sc.top=45; sc.bottom=-45; sc.near=10; sc.far=160;
    sol.shadow.bias=-0.0006; sol.shadow.normalBias=0.02; sc.updateProjectionMatrix(); }
  const col=(typeof _cvColores==="function")?_cvColores(P):{mio:"#eef3ff",riv:"#e5484d"};
  _c3dCancha(scene,perfil);
  _c3dEstadio(scene,[P&&P.part&&P.part.local===false?col.riv:col.mio],perfil);
  const piezas=_c3dPiezas(scene,perfil);
  /* sombras de mancha: 22 jugadores + pelota */
  const sTex=(function(){ const c=document.createElement("canvas"); c.width=c.height=64; const x=c.getContext("2d");
    const r=x.createRadialGradient(32,32,2,32,32,32); r.addColorStop(0,"rgba(0,0,0,.5)"); r.addColorStop(1,"rgba(0,0,0,0)");
    x.fillStyle=r; x.fillRect(0,0,64,64); return new THREE.CanvasTexture(c); })();
  const sombras=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:sTex,transparent:true,depthWrite:false}),23);
  sombras.instanceMatrix.setUsage(THREE.DynamicDrawUsage); sombras.frustumCulled=false; scene.add(sombras);
  const bTex=(typeof _texPelota==="function")?_texPelota():null;
  const bola=new THREE.Mesh(new THREE.SphereGeometry(0.15,perfil.plano?8:16,perfil.plano?6:12), bTex?new THREE.MeshLambertMaterial({map:bTex}):new THREE.MeshLambertMaterial({color:0xf4f4f4}));
  scene.add(bola);
  const camGL=new THREE.PerspectiveCamera(CAM3D.fov,16/9,0.5,420);
  camGL.position.set(CAM3D.lado,CAM3D.alto,0); camGL.lookAt(0,1,0);
  const hud=document.createElement("div"); hud.className="c3d-hud"; hud.setAttribute("aria-live","polite");
  const est={ host:null, canvas:canvas, hud:hud, renderer:renderer, scene:scene, camGL:camGL, piezas:piezas, sombras:sombras, bola:bola,
    P:null, st:null, camPos:new THREE.Vector3(CAM3D.lado,CAM3D.alto,0), mira:new THREE.Vector3(0,CAM3D.mira_alto,0), fov:CAM3D.fov,
    calidad:calidad, perfil:perfil, pr:pr0, raf:0, W0:0, H0:0, franjas:[], pelados:[], gk:[], ultT:0, dtProm:16, prAjuste:0, carteles:"" };
  C3D.montajes++;
  return est;
}
/* la partida que se ve: semilla de la simulación (solo si cambió el partido) y colores */
function _c3dPartido(est,P){
  if(!_cvSt||_cvSt._P!==P){ if(typeof _cvSeed==="function") _cvSeed(P); if(_cvSt) _cvSt._P=P; }
  est.P=P; est.st=_cvSt;
  est.gk=[]; let n=0; for(let i=0;i<22;i++){ const p=est.st&&est.st.jug[i]; est.gk[i]=(p&&p.rol==="gk"&&n<2)?n++:-1; }
  _c3dPintar(est);
}
function montarCancha3D(host, P){
  let est=C3D.est;
  /* mismo partido y misma calidad: se reusa todo (el repintado del partido no rearma la escena) */
  if(est&&est.calidad!==c3dCalidad()){ detenerCancha3D(); est=null; }
  if(est){ C3D.reusos++; clearTimeout(est.liberar); }
  else { est=_c3dConstruir(host,P); if(!est) return null; C3D.est=est; }
  if(est.P!==P||est.st!==_cvSt) _c3dPartido(est,P);
  est.host=host;
  if(getComputedStyle(host).position==="static") host.style.position="relative";
  /* 7.9127 · con un balón parado 3D en juego el canvas vive en la capa grande: no se lo robamos (vuelve al cerrar) */
  if(!est.bp) host.appendChild(est.canvas);
  host.appendChild(est.hud);
  _c3dCuadroUno(est);   /* nunca se ve un canvas vacío */
  if(!est.raf){ est.ultT=performance.now(); est.raf=requestAnimationFrame(t=>_c3dCuadro(est,t)); }
  return est;
}
/* ---------- cada cuadro: avanzar la simulación (_cvStep) y leer _cvSt ---------- */
function _c3dSincronizar(est,dt){
  const S=est.st=_cvSt||est.st; if(!S) return;
  const wx=y=>(y-0.5)*68, wz=x=>(x-0.5)*105;   /* sim → metros: 105 de largo, 68 de ancho */
  const K=_c3dM(), M=K.W, sombras=est.sombras;
  let manos=null;
  const tAhora=performance.now()/1000;
  est.giro=est.giro||[];
  const fr=_c3dFotoNueva(est,dt);   /* 7.9129 · la grabadora de la repetición (-1 si este cuadro no se guarda) */
  S.jug.forEach((p,i)=>{
    const x=wx(p.y), z=wz(p.x);
    /* 7.9128 · el cuerpo gira suave hacia donde mira (antes daba vuelta de golpe: muy robótico) */
    const ang=(typeof p._ang==="number")?p._ang:0, g0=est.giro[i]!=null?est.giro[i]:ang, dg=Math.atan2(Math.sin(ang-g0),Math.cos(ang-g0));
    const giro=est.giro[i]=g0+dg*Math.min(1,dt*(p._acc?16:9));
    const v=(p._vel||0)/0.14;   /* _vel es la velocidad suavizada ×0,14 (cancha.js _cvAnimar) */
    /* 7.9129 · el ritmo de los pasos sale de la velocidad (1,6 pasos/s caminando → 4,6 picando) y la inclinación de la
       curva, de cuánto gira yendo rápido */
    est.fase=est.fase||[]; est.giroV=est.giroV||[];
    est.fase[i]=((est.fase[i]||i*0.7)+dt*Math.PI*(v<0.15?0:Math.min(4.6,1.6+0.34*v)))%(Math.PI*200);
    const gv=(est.giroV[i]||0)+((dt>0?dg*Math.min(1,dt*(p._acc?16:9))/dt:0)-(est.giroV[i]||0))*Math.min(1,dt*6); est.giroV[i]=gv;
    est.gestos=est.gestos||[]; const o=_c3dGesto(_c3dCopia(est.gestos[i]||(est.gestos[i]=_c3dGestoVacio()),C3D_QUIETO),p,v,tAhora,i,est.fase[i]);
    o.x=x; o.z=z; o.yaw=giro; o.brazos=null; o.lean=Math.max(-0.3,Math.min(0.3,-gv*v*0.035));
    if(p.rol==="gk"){
      const pase=S.pase;
      if((p._dive||0)>0.05){
        const destX=pase&&pase.tiro?wx(pase.y1):wx(S.ball.y), lado=Math.sign(destX-x)||1;
        const d=Math.min(1,p._dive), lat=Math.cos(ang)*lado;   /* hacia qué lado queda en SU marco */
        o.roll=-Math.sign(lat||1)*d*1.25; o.lift=Math.sin(d*Math.PI)*0.35; o.x=x+lado*d*0.7; o.brazos="arriba";
        o.legs[0].k=o.legs[1].k=0.2; o.legs[0].t=-0.1; o.legs[1].t=0.25; o.pitch=0; o.lean=0; o.pelvis=0;
      } else if(S.atajada&&S.atajada.gk===i&&S.own===i){ o.brazos="abrazo"; }
    }
    _c3dPose(est,i,o);
    if(fr>=0) _c3dGrabarJug(est.grab.buf,fr,i,o);
    const sl=Math.max(0,o.lift); M.makeTranslation(o.x,0.02,o.z); _c3dS(M,(1.1+sl)*(est.perfil.sombras?0.75:1),1,(1.1+sl)*(est.perfil.sombras?0.75:1)); sombras.setMatrixAt(i,M);
    if(o.brazos==="abrazo"){ K.v.set(0,1.15,0.32).applyMatrix4(K.B); manos=K.v.clone(); }
    p._yaw3d=giro;
  });
  const b=S.ball, bx=wx(b.y), bz=wz(b.x), by=Math.max(0.15,(b.z||0)*11+0.15);
  if(manos) est.bola.position.copy(manos); else est.bola.position.set(bx,by,bz);
  /* 7.9128 · la pelota rueda hacia donde va (eje perpendicular al movimiento, ángulo = distancia / radio) y en el aire
     sigue girando con el efecto que traía; antes giraba sobre ejes fijos, fuera para donde fuera */
  const bp=est.bola.position, ult=est.bolaUlt||(est.bolaUlt=bp.clone()), ddx=bp.x-ult.x, ddz=bp.z-ult.z, dist=Math.hypot(ddx,ddz);
  if(dist>1e-4&&dist<3){ const ax=K.v.set(ddz,0,-ddx).normalize(); est.bola.rotateOnWorldAxis(ax,dist/0.15); est.bolaGiro=(est.bolaGiro||new THREE.Vector3()).copy(ax).multiplyScalar(dist/0.15/Math.max(dt,1e-3)); }
  else if(est.bolaGiro&&bp.y>0.3){ const w=est.bolaGiro.length(); if(w>0.01) est.bola.rotateOnWorldAxis(K.v.copy(est.bolaGiro).normalize(),w*dt); }
  ult.copy(bp);
  if(fr>=0) _c3dGrabarBola(est.grab.buf,fr,est.bola);
  /* gol del partido (la jugada armada de cancha.js): cuando termina, va la repetición */
  if(S.seq&&S.seq.tipo==="gol"){ if(S.seq.red&&est.golSeq!==S.seq){ est.golSeq=S.seq; est.golSeqT=0; } }
  if(est.golSeq){ est.golSeqT+=dt; if(S.seq!==est.golSeq||est.golSeqT>1.6){ est.golSeq=null; est.repPendiente=0.25; } }
  const s=0.55+by*0.06; M.makeTranslation(est.bola.position.x,0.021,est.bola.position.z); _c3dS(M,s,1,s); sombras.setMatrixAt(22,M);
  Object.keys(est.piezas).forEach(n=>{ est.piezas[n].instanceMatrix.needsUpdate=true; });
  sombras.instanceMatrix.needsUpdate=true;
  /* 7.9127 · balón parado en la cancha (bp3d.js): la cámara la manda la jugada (detrás del pateador o del banderín) */
  if(est.bp&&est.bp.cam){
    const c=est.bp.cam, kb=Math.min(1,dt*(c.suave||4));
    est.camPos.lerp(c.pos,kb); est.mira.lerp(c.mira,kb);
    if(Math.abs((c.fov||45)-est.fov)>0.05){ est.fov+=((c.fov||45)-est.fov)*kb; est.camGL.fov=est.fov; est.camGL.updateProjectionMatrix(); }
    est.camGL.position.copy(est.camPos); est.camGL.lookAt(est.mira);
    if(est.carteles){ est.carteles=""; est.hud.textContent=""; est.hud.classList.remove("on"); }
    return;
  }
  /* cámara de transmisión: banda lateral, elevada, sigue la pelota y mira un poco hacia donde se ataca */
  const k=Math.min(1,dt*CAM3D.suave), gol=!!S.seq;
  const dueno=S.own>=0?S.jug[S.own]:null, dir=dueno?(dueno.mio?1:-1):0;
  const lado=gol?CAM3D.gol_lado:CAM3D.lado, alto=gol?CAM3D.gol_alto:CAM3D.alto;
  est.camPos.x+=(lado+Math.max(0,bx)*CAM3D.sigue_x-est.camPos.x)*k;
  est.camPos.y+=(alto-est.camPos.y)*k;
  est.camPos.z+=(Math.max(-38,Math.min(38,bz*CAM3D.sigue_z))-est.camPos.z)*k;
  /* la mira no sale del campo: con la pelota afuera por el fondo (saque de arco) miraba la tribuna de atrás del arco */
  const cl=(v,a)=>Math.max(-a,Math.min(a,v));
  est.mira.x+=(cl(bx*0.6,20)-est.mira.x)*k;
  est.mira.z+=(cl(bz+dir*CAM3D.adelanta,45)-est.mira.z)*k*0.8;
  est.mira.y=CAM3D.mira_alto;
  const fovObj=gol?CAM3D.gol_fov:(Math.abs(bz)>34?CAM3D.fov_area:CAM3D.fov);
  if(Math.abs(fovObj-est.fov)>0.05){ est.fov+=(fovObj-est.fov)*k*0.6; est.camGL.fov=est.fov; est.camGL.updateProjectionMatrix(); }
  est.camGL.position.copy(est.camPos); est.camGL.lookAt(est.mira);
  /* cartel del gol (el mismo texto que el cenital) */
  const txt=S.seq&&S.seq.cartel?S.seq.cartel:"";
  if(txt!==est.carteles){ est.carteles=txt; est.hud.textContent=txt; est.hud.classList.toggle("on",!!txt); }
}
/* ---------- 7.9129 · REPETICIÓN DEL GOL ----------
   Pedido del autor: "repeticiones buenas, darle tiempo, que no sea tan rápido todo; si es gol, nomás repetición; tener
   3 cámaras". La cancha 3D GRABA lo que dibuja (los 22 con su pose, la pelota con su giro) en los últimos 12 s. Cuando hay
   gol —del partido o de un balón parado 3D— la jugada se pasa otra vez, en cámara lenta, con tres cámaras:
   1) Transmisión (la de la tele, más cerrada) · 2) Detrás del arco · 3) A ras del pasto, siguiendo la pelota.
   El reloj del partido espera (P._celHasta) y "⏭ Saltar" corta. Solo los goles se repiten. */
const C3D_REP={hz:40, seg:12, camaras:[
  {n:"Transmisión", desde:-3.6, hasta:0.9, vel:0.8},
  {n:"Detrás del arco", desde:-2.0, hasta:0.7, vel:0.55},
  {n:"A ras del pasto", desde:-1.5, hasta:0.6, vel:0.42}]};
const C3D_FJ=26, C3D_FB=8, C3D_FT=1+C3D_FB+22*C3D_FJ;   /* datos por jugador · por pelota · por foto */
function _c3dFotoNueva(est,dt){
  let g=est.grab;
  if(!g){ const cap=C3D_REP.hz*C3D_REP.seg; g=est.grab={buf:new Float32Array(cap*C3D_FT), cap:cap, n:0, cab:0, t:0, ult:-1}; }
  g.t+=dt;
  if(g.ult>=0&&g.t-g.ult<1/C3D_REP.hz*0.95) return -1;
  g.ult=g.t; const i=g.cab; g.cab=(g.cab+1)%g.cap; g.n=Math.min(g.cap,g.n+1);
  const off=i*C3D_FT; g.buf[off]=g.t; return off;
}
function _c3dGrabarJug(B,off,i,o){
  let k=off+1+C3D_FB+i*C3D_FJ;
  B[k++]=o.x; B[k++]=o.z; B[k++]=o.yaw; B[k++]=o.lift||0; B[k++]=o.roll||0; B[k++]=o.pitch||0; B[k++]=o.twist||0; B[k++]=o.nod||0;
  for(let q=0;q<2;q++){ const L=o.legs[q]; B[k++]=L.t; B[k++]=L.k; B[k++]=L.a; B[k++]=L.p||0; }
  for(let q=0;q<2;q++){ const A=o.arms[q]; B[k++]=A.s; B[k++]=A.a; B[k++]=A.e; }
  B[k++]=o.brazos==="arriba"?1:(o.brazos==="abrazo"?2:0); B[k++]=1; B[k++]=o.lean||0; B[k++]=o.pelvis||0;
}
function _c3dGrabarBola(B,off,bola){
  let k=off+1; const p=bola.position, q=bola.quaternion;
  B[k++]=p.x; B[k++]=p.y; B[k++]=p.z; B[k++]=q.x; B[k++]=q.y; B[k++]=q.z; B[k++]=q.w; B[k++]=0;
}
/* las fotos en orden (de la más vieja a la más nueva) */
function _c3dFotos(g){ const out=[]; for(let j=0;j<g.n;j++){ const i=(g.cab-g.n+j+g.cap)%g.cap; out.push(i*C3D_FT); } return out; }
/* ¿dónde está el gol en la grabación? la última vez que la pelota cruzó la línea entre los palos y bajo el travesaño */
function _c3dGolEnGrabacion(g){
  const F=_c3dFotos(g), B=g.buf;
  for(let j=F.length-1;j>0;j--){
    const a=F[j-1], b=F[j], za=Math.abs(B[a+3]), zb=Math.abs(B[b+3]);
    if(zb>=52.5&&za<52.5&&Math.abs(B[b+1])<3.9&&B[b+2]<2.7) return {t:B[b], lado:Math.sign(B[b+3])||1, x:B[b+1], j:j};
  }
  return null;
}
/* el plan (puro, lo usa el doctor): dónde está el gol y qué tramo muestra cada cámara, a qué velocidad */
function _c3dRepPlan(g){
  if(!g||g.n<20) return null;
  const gol=_c3dGolEnGrabacion(g); if(!gol) return null;
  const F=_c3dFotos(g), t0=g.buf[F[0]], t1=g.buf[F[F.length-1]];
  const plan=C3D_REP.camaras.map((c,k)=>({k:k, n:c.n, vel:c.vel, a:Math.max(t0,gol.t+c.desde), b:Math.min(t1,gol.t+c.hasta)})).filter(c=>c.b-c.a>0.6);
  if(!plan.length) return null;
  return {gol:gol, plan:plan, fotos:F, total:plan.reduce((s2,c)=>s2+(c.b-c.a)/c.vel,0)};
}
/* arranca la repetición del último gol grabado; op.alTerminar se llama al final (o al saltarla) */
function c3dRepetir(est,op){
  op=op||{};
  if(!est||est.rep||!est.grab) return false;
  const pl=_c3dRepPlan(est.grab); if(!pl) return false;   /* sin gol en la grabación no hay repetición: solo los goles */
  const gol=pl.gol, plan=pl.plan, total=pl.total;
  est.rep={gol:gol, plan:plan, c:0, t:plan[0].a, fotos:pl.fotos, op:op, cam:null, total:total, inicio:performance.now()};
  /* el reloj del partido espera toda la repetición (se libera al terminar o al saltar) */
  if(est.P){ est.P._celHasta=Math.max(est.P._celHasta||0,Date.now()+total*1000+1500); est.P._repGol=true; }
  _c3dRepHud(est);
  C3D.repeticiones=(C3D.repeticiones||0)+1;
  return true;
}
function _c3dRepHud(est){
  if(!est.repHud){
    const h=document.createElement("div"); h.className="c3d-rep";
    h.innerHTML='<div class="c3d-rep-barra a"></div><div class="c3d-rep-barra b"></div><div class="c3d-rep-tag"><b>⟲ REPETICIÓN</b><span></span></div><button type="button" class="c3d-rep-saltar">⏭ Saltar</button>';
    h.querySelector(".c3d-rep-saltar").onclick=function(ev){ ev.stopPropagation(); _c3dRepFin(est,true); };
    est.repHud=h;
  }
  const r=est.rep, c=r&&r.plan[r.c];
  if(c) est.repHud.querySelector("span").textContent="Cámara "+(c.k+1)+" · "+c.n;
  const padre=est.canvas.parentNode; if(padre&&est.repHud.parentNode!==padre) padre.appendChild(est.repHud);
  est.repHud.classList.remove("corte"); void est.repHud.offsetWidth; est.repHud.classList.add("on","corte");
}
function _c3dRepFin(est,saltada){
  const r=est.rep; if(!r) return; est.rep=null;
  if(est.repHud){ est.repHud.classList.remove("on"); const h=est.repHud; setTimeout(function(){ if(!est.rep&&h.parentNode) h.parentNode.removeChild(h); },300); }
  if(est.P){ est.P._celHasta=Date.now()+250; est.P._repGol=false; }
  est.bolaUlt=null;
  if(saltada) C3D.repSaltadas=(C3D.repSaltadas||0)+1;
  try{ if(typeof r.op.alTerminar==="function") r.op.alTerminar(); }catch(e){ if(window.console) console.error("repetición:",e); }
}
/* una foto intermedia (para la cámara lenta): mezcla dos fotos guardadas */
function _c3dRepFoto(est,t){
  const r=est.rep, F=r.fotos, B=est.grab.buf;
  let j=1; while(j<F.length-1&&B[F[j]]<t) j++;
  const a=F[j-1], b=F[j], ta=B[a], tb=B[b], u=tb>ta?Math.max(0,Math.min(1,(t-ta)/(tb-ta))):0;
  return {a:a, b:b, u:u};
}
function _c3dRepPintar(est,dt){
  const r=est.rep, c=r.plan[r.c], B=est.grab.buf, K=_c3dM(), M=K.W;
  /* el reloj espera MIENTRAS dure (se renueva cada cuadro: en un equipo lento la repetición tarda más de lo calculado) */
  if(est.P) est.P._celHasta=Math.max(est.P._celHasta||0,Date.now()+1200);
  r.t+=dt*c.vel;
  if(r.t>c.b){ r.c++; if(r.c>=r.plan.length){ _c3dRepFin(est,false); return; } r.t=r.plan[r.c].a; r.cam=null; _c3dRepHud(est); return _c3dRepPintar(est,0); }
  const f=_c3dRepFoto(est,r.t), L=(i)=>B[f.a+i]+(B[f.b+i]-B[f.a+i])*f.u;
  const ang=(i)=>{ const x=B[f.a+i], y=B[f.b+i], d=Math.atan2(Math.sin(y-x),Math.cos(y-x)); return x+d*f.u; };
  est.gestos=est.gestos||[];
  for(let i=0;i<22;i++){
    const o=est.gestos[i]||(est.gestos[i]=_c3dGestoVacio()), k=1+C3D_FB+i*C3D_FJ;
    o.x=L(k); o.z=L(k+1); o.yaw=ang(k+2); o.lift=L(k+3); o.roll=L(k+4); o.pitch=L(k+5); o.twist=L(k+6); o.nod=L(k+7);
    for(let q=0;q<2;q++){ const g=o.legs[q], kk=k+8+q*4; g.t=L(kk); g.k=L(kk+1); g.a=L(kk+2); g.p=L(kk+3); }
    for(let q=0;q<2;q++){ const g=o.arms[q], kk=k+16+q*3; g.s=L(kk); g.a=L(kk+1); g.e=L(kk+2); }
    const br=B[(f.u<0.5?f.a:f.b)+k+22]; o.brazos=br===1?"arriba":(br===2?"abrazo":null); o.lean=L(k+24); o.pelvis=L(k+25);
    _c3dPose(est,i,o);
    const sl=Math.max(0,o.lift); M.makeTranslation(o.x,0.02,o.z); _c3dS(M,(1.1+sl)*(est.perfil.sombras?0.75:1),1,(1.1+sl)*(est.perfil.sombras?0.75:1)); est.sombras.setMatrixAt(i,M);
  }
  /* la pelota: posición y giro grabados (el giro mezclado suave) */
  const bx=L(1), by=L(2), bz=L(3); est.bola.position.set(bx,by,bz);
  const qa=K.qa||(K.qa=new THREE.Quaternion()), qb=K.qb||(K.qb=new THREE.Quaternion());
  qa.set(B[f.a+4],B[f.a+5],B[f.a+6],B[f.a+7]); qb.set(B[f.b+4],B[f.b+5],B[f.b+6],B[f.b+7]); est.bola.quaternion.copy(qa).slerp(qb,f.u);
  const s2=0.55+by*0.06; M.makeTranslation(bx,0.021,bz); _c3dS(M,s2,1,s2); est.sombras.setMatrixAt(22,M);
  Object.keys(est.piezas).forEach(n=>{ est.piezas[n].instanceMatrix.needsUpdate=true; });
  est.sombras.instanceMatrix.needsUpdate=true;
  _c3dRepCamara(est,dt,c,bx,by,bz);
  const padre=est.canvas.parentNode; if(padre&&est.repHud&&est.repHud.parentNode!==padre) padre.appendChild(est.repHud);
}
/* el que le pegó: el último cuadro (antes del gol) en que la pelota acelera de golpe, y el jugador más cerca de ella ahí */
function _c3dRepTirador(est){
  const r=est.rep, g=r.gol, F=r.fotos, B=est.grab.buf;
  let best=-1, jT=g.j;
  for(let j=Math.min(g.j,F.length-1);j>1;j--){
    const a=F[j-2], b=F[j-1], c=F[j], dt1=Math.max(1e-3,B[b]-B[a]), dt2=Math.max(1e-3,B[c]-B[b]);
    const v1=Math.hypot(B[b+1]-B[a+1],B[b+3]-B[a+3])/dt1, v2=Math.hypot(B[c+1]-B[b+1],B[c+3]-B[b+3])/dt2;
    if(v2-v1>6&&v2>9){ jT=j-1; break; }
    if(g.t-B[c]>3.2) break;
  }
  /* solo los del equipo que hizo el gol: el mío ataca hacia +z (jugadores 0–10), el rival hacia −z (11–21) */
  const f=F[jT], i0=g.lado>0?0:11; let dm=1e9;
  for(let i=i0;i<i0+11;i++){ const k=f+1+C3D_FB+i*C3D_FJ, d=Math.hypot(B[k]-B[f+1],B[k+1]-B[f+3]); if(d<dm){ dm=d; best=i; } }
  const k=f+1+C3D_FB+best*C3D_FJ, dx=g.x-B[k], dz=g.lado*52.5-B[k+1], n=Math.hypot(dx,dz)||1;
  return {i:best, dir:{x:dx/n,z:dz/n}};
}
/* las tres cámaras de la repetición */
function _c3dRepCamara(est,dt,c,bx,by,bz){
  const r=est.rep, g=r.gol, cam=est.camGL;
  let pos, mira, fov;
  if(c.k===0){ pos=[Math.max(bx+14,13), 6, bz*0.92]; mira=[bx,Math.max(0.5,by*0.7),bz]; fov=27; }
  else if(c.k===1){ pos=[g.x*0.35, 4.4, g.lado*56.1]; mira=[bx*0.85,Math.max(0.4,by*0.7),bz-g.lado*2]; fov=34; }   /* sobre la red: el travesaño no tapa */
  else {
    /* a ras del pasto: detrás y al costado del que le pegó, a la altura del pecho, mirando al arco: se ve el remate y
       la pelota entrando (el que le pegó = el más cerca de la pelota cuando la pelota salió disparada) */
    if(!r.tirador) r.tirador=_c3dRepTirador(est);
    const T=r.tirador, k0=1+C3D_FB+T.i*C3D_FJ, F=_c3dRepFoto(est,r.t), B=est.grab.buf;
    const px=B[F.a+k0]+(B[F.b+k0]-B[F.a+k0])*F.u, pz=B[F.a+k0+1]+(B[F.b+k0+1]-B[F.a+k0+1])*F.u;
    const d=T.dir, sx=-d.z, sz=d.x;
    pos=[px-d.x*4.6+sx*2.4, 1.45, pz-d.z*4.6+sz*2.4];
    const w=Math.min(1,Math.hypot(bx-px,bz-pz)/14);   /* al principio mira al jugador; cuando la pelota se va, la sigue */
    mira=[px+(bx-px)*(0.35+0.5*w), Math.max(0.6,by*0.6+0.5), pz+(bz-pz)*(0.35+0.5*w)]; fov=33;
  }
  if(!r.cam){ r.cam={p:new THREE.Vector3(pos[0],pos[1],pos[2]), m:new THREE.Vector3(mira[0],mira[1],mira[2])}; }
  const k=1-Math.exp(-dt*(c.k===1?3:5));
  r.cam.p.x+=(pos[0]-r.cam.p.x)*k; r.cam.p.y+=(pos[1]-r.cam.p.y)*k; r.cam.p.z+=(pos[2]-r.cam.p.z)*k;
  r.cam.m.x+=(mira[0]-r.cam.m.x)*k; r.cam.m.y+=(mira[1]-r.cam.m.y)*k; r.cam.m.z+=(mira[2]-r.cam.m.z)*k;
  if(Math.abs(cam.fov-fov)>0.05){ cam.fov=fov; est.fov=fov; cam.updateProjectionMatrix(); }
  cam.position.copy(r.cam.p); cam.lookAt(r.cam.m);
  est.camPos.copy(r.cam.p); est.mira.copy(r.cam.m);
}
function _c3dTam(est){
  const rc=est.canvas.getBoundingClientRect();
  if(rc.width&&(Math.abs(rc.width-est.W0)>0.5||Math.abs(rc.height-est.H0)>0.5)){
    est.W0=rc.width; est.H0=rc.height; est.renderer.setSize(rc.width,rc.height,false);
    est.camGL.aspect=rc.width/Math.max(1,rc.height); est.camGL.updateProjectionMatrix();
  }
}
function _c3dCuadroUno(est){ try{ _c3dTam(est); _c3dSincronizar(est,0.016); est.renderer.render(est.scene,est.camGL); }catch(e){} }
/* calidad Auto: si el equipo no llega, baja la resolución (no se cambia a 2D); si sobra, la sube */
function _c3dAjusteAuto(est,dtReal){
  est.dtProm=est.dtProm*0.92+dtReal*0.08;
  if(!c3dAuto()||performance.now()-est.prAjuste<1200) return;
  const p=est.perfil; let pr=est.pr;
  if(est.dtProm>26&&pr>p.prMin) pr=Math.max(p.prMin,pr*0.85);
  else if(est.dtProm<15&&pr<Math.min(p.pr,window.devicePixelRatio||1)) pr=Math.min(p.pr,pr*1.1);
  if(Math.abs(pr-est.pr)>0.01){ est.pr=pr; est.renderer.setPixelRatio(pr); est.W0=0; est.prAjuste=performance.now(); }
}
function _c3dCuadro(est,t){
  est.raf=0;
  if(C3D.est!==est) return;
  if(!est.canvas.isConnected){
    /* salimos del partido (o se está repintando): se deja de dibujar; si nadie lo vuelve a montar, se libera */
    clearTimeout(est.liberar); est.liberar=setTimeout(function(){ if(C3D.est===est&&!est.canvas.isConnected) detenerCancha3D(); },30000);
    return;
  }
  est.raf=requestAnimationFrame(t2=>_c3dCuadro(est,t2));
  if(document.hidden) return;
  const dtReal=t-est.ultT;
  if(est.perfil.fps<=30&&dtReal<1000/31) return;   /* 30 cuadros por segundo en liviano/antigua */
  est.ultT=t;
  const dt=Math.min(0.1,Math.max(0,dtReal/1000));
  _c3dVigilar(est,dtReal);
  _c3dAjusteAuto(est,dtReal);
  try{ _c3dTam(est);
    if(est.repPendiente!=null&&!est.rep){ est.repPendiente-=dt; if(est.repPendiente<=0){ est.repPendiente=null; c3dRepetir(est,{}); } }
    if(est.rep) _c3dRepPintar(est,dt);   /* 7.9129 · repetición del gol: el partido y la simulación esperan */
    else {
      if(est.bp&&est.bp.paso) est.bp.paso(dt);   /* balón parado: la jugada mueve a todos, la simulación espera */
      else if(typeof _cvStep==="function"&&!(est.P&&est.P.terminado&&!(_cvSt&&_cvSt.seq))) _cvStep(est.P,dt);
      _c3dSincronizar(est,dt);
    }
    est.renderer.render(est.scene,est.camGL); }
  catch(e){
    if(window.console) console.error("cancha3d:",e);
    const host=est.host; detenerCancha3D();
    if(typeof aviso==="function") aviso("La cancha 3D tuvo un error: este partido sigue en 2D (el 3D sigue prendido para el próximo).",5000);   /* 7.9125 · nunca sin avisar */
    if(host&&typeof montarCancha==="function"){ const cv=document.createElement("canvas"); cv.className="cancha2d"; host.appendChild(cv); montarCancha(cv); }
  }
}
/* 7.9125 · si va lento NO se cambia solo a 2D: primero baja la resolución (Auto) y, si ni así, se ofrece (chip chico) */
function _c3dVigilar(est,ms){
  if(est.vigilado) return;
  est.tiempos=est.tiempos||[]; est.t0v=est.t0v||performance.now();
  if(performance.now()-est.t0v<4000) return;
  est.tiempos.push(ms); if(est.tiempos.length<45) return;
  est.vigilado=true;
  const med=est.tiempos.slice().sort((a,b)=>a-b)[22]; est.msMediana=Math.round(med);
  const tope=est.perfil.fps<=30?75:50;
  if(med>tope&&typeof ofrecerAliviar3D==="function") est.ofrecido=!!ofrecerAliviar3D(est.host,"🐢 La cancha 3D va lenta en este equipo ("+est.msMediana+" ms por cuadro).",function(){
    const host=est.host, P=est.P;
    if(E){ if(!E.config) E.config={}; E.config.cancha3d=false; if(typeof guardar==="function") guardar(); }
    detenerCancha3D(); montarCanchaAuto(host,P); });
}
function detenerCancha3D(){
  const e=C3D.est; if(!e) return; C3D.est=null;
  try{ cancelAnimationFrame(e.raf); }catch(_){}
  clearTimeout(e.liberar);
  try{ e.scene.traverse(o=>{ if(o.geometry) o.geometry.dispose(); const m=o.material; if(m){ (Array.isArray(m)?m:[m]).forEach(x=>{ if(x.map) x.map.dispose(); x.dispose(); }); } }); }catch(_){}
  try{ e.renderer.dispose(); e.renderer.forceContextLoss(); }catch(_){}
  try{ if(e.canvas&&e.canvas.parentNode) e.canvas.parentNode.removeChild(e.canvas); if(e.hud&&e.hud.parentNode) e.hud.parentNode.removeChild(e.hud); }catch(_){}
}
/* entrada única: monta 3D si corresponde (cargando Three si falta), sino cae al 2D. host = contenedor de la cancha. */
function montarCanchaAuto(host, P){
  if(!host) return;
  host.querySelectorAll(".cancha3d,.cancha2d,.c3d-hud").forEach(c=>{ try{ c.remove(); }catch(_){} });
  const al2D=()=>{ const cv=(typeof canchaReusable==="function"&&canchaReusable())||document.createElement("canvas");
    cv.className="cancha2d"; cv.setAttribute("aria-hidden","true"); host.appendChild(cv); if(typeof montarCancha==="function") montarCancha(cv); };
  if(!cancha3dActivo()){ if(C3D.est) detenerCancha3D(); al2D(); return; }
  if(typeof THREE!=="undefined"){ if(!montarCancha3D(host,P)) al2D(); return; }
  /* Three no cargó aún: 2D mientras baja, y cuando llega se cambia (si seguimos en el mismo partido) */
  al2D();
  if(typeof cargarThree==="function") cargarThree().then(ok=>{ if(ok&&host.isConnected&&cancha3dActivo()){
    host.querySelectorAll(".cancha2d").forEach(c=>{ try{ if(typeof detenerCancha==="function") detenerCancha(); c.remove(); }catch(_){} });
    if(!montarCancha3D(host,P)) al2D(); } });
}
if(typeof document!=="undefined"&&!document.getElementById("css-cancha3d")){
  const st=document.createElement("style"); st.id="css-cancha3d";
  st.textContent=
    ".c3d-hud{position:absolute;left:50%;top:10px;transform:translateX(-50%);max-width:92%;padding:5px 14px;border-radius:999px;"+
      "background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06) 50%,rgba(0,0,0,.2) 51%),rgba(12,40,80,.78);"+
      "color:#fff;font:800 13px/1.3 system-ui,sans-serif;letter-spacing:.3px;border:1px solid rgba(255,255,255,.45);"+
      "box-shadow:0 2px 10px rgba(0,0,0,.35);opacity:0;transition:opacity .25s;pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"+
    ".c3d-hud.on{opacity:1}"+
    "canvas.cancha3d.c3d-antigua{image-rendering:pixelated}"+
    /* 7.9129 · repetición: franjas de cine, cartel de la cámara, botón para saltar y un corte al cambiar de cámara */
    ".c3d-rep{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s;z-index:3}.c3d-rep.on{opacity:1}"+
    ".c3d-rep-barra{position:absolute;left:0;right:0;height:7%;background:#000}.c3d-rep-barra.a{top:0}.c3d-rep-barra.b{bottom:0}"+
    ".c3d-rep-tag{position:absolute;left:14px;top:calc(7% + 10px);display:flex;gap:10px;align-items:center;padding:5px 12px;border-radius:999px;"+
      "background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06) 50%,rgba(0,0,0,.2) 51%),rgba(150,20,30,.85);color:#fff;"+
      "font:800 12px/1.2 system-ui,sans-serif;letter-spacing:.4px;border:1px solid rgba(255,255,255,.5);box-shadow:0 2px 10px rgba(0,0,0,.4)}"+
    ".c3d-rep-tag span{font-weight:600;opacity:.9}"+
    ".c3d-rep-saltar{position:absolute;right:14px;bottom:calc(7% + 10px);pointer-events:auto;padding:8px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.55);"+
      "background:linear-gradient(180deg,rgba(255,255,255,.3),rgba(255,255,255,.06) 50%,rgba(0,0,0,.25) 51%),rgba(10,40,80,.85);color:#fff;font:700 13px system-ui,sans-serif;cursor:pointer}"+
    ".c3d-rep.corte::after{content:'';position:absolute;inset:0;background:#fff;animation:c3dCorte .35s ease-out forwards}"+
    "@keyframes c3dCorte{from{opacity:.55}to{opacity:0}}";
  document.head.appendChild(st);
}
