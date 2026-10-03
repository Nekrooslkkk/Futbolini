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
  alta:   {pr:1.6,  prMin:0.7,  aa:true,  publico:1800, tex:2048, fps:60, plano:false},
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
  for(let i=0;i<n;i++){ x.fillStyle=i%2?"#3f8f38":"#46a03f"; x.fillRect(Math.floor((C3D_MARGEN+i*105/n)*k),0,Math.ceil(105/n*k)+1,H); }
  x.fillStyle="#3a8634"; x.fillRect(0,0,Math.ceil(C3D_MARGEN*k),H); x.fillRect(Math.floor((C3D_MARGEN+105)*k),0,Math.ceil(C3D_MARGEN*k)+1,H);
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
  pasto.rotation.x=-Math.PI/2; pasto.rotation.z=Math.PI/2; g.add(pasto);
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
/* estadio: tribunas en escalones, techo en las laterales, carteles, torres de luz y público instanciado */
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
  /* público: cubos instanciados en los escalones, colores del local */
  const n=perfil.publico;
  if(n>0){
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
/* medidas en metros, pies en y=0, mirando a +Z */
const C3D_CUERPO={ cadera:0.93, muslo:0.44, pierna:0.43, hombro:1.5, brazo:0.29, antebrazo:0.31, ancho_cad:0.11, ancho_hom:0.3 };
function _c3dPiezas(scene,perfil){
  const lam=()=>new THREE.MeshLambertMaterial({flatShading:!!perfil.plano});
  const seg=perfil.plano?5:8;
  const P={};
  const im=(nombre,geo,n)=>{ const m=new THREE.InstancedMesh(geo,lam(),n); m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled=false; scene.add(m); P[nombre]=m; return m; };
  im("torso",new THREE.CylinderGeometry(0.25,0.2,0.62,seg),22);
  im("franja",new THREE.BoxGeometry(1,1,1),22);
  im("short",new THREE.CylinderGeometry(0.215,0.2,0.27,seg),22);
  im("manga",new THREE.CylinderGeometry(0.075,0.068,C3D_CUERPO.brazo,seg),44);
  im("antebrazo",new THREE.CylinderGeometry(0.058,0.05,C3D_CUERPO.antebrazo,seg),44);
  im("muslo",new THREE.CylinderGeometry(0.088,0.074,C3D_CUERPO.muslo,seg),44);
  im("media",new THREE.CylinderGeometry(0.07,0.055,C3D_CUERPO.pierna,seg),44);
  im("zapato",new THREE.BoxGeometry(0.11,0.08,0.26),44);
  im("cabeza",new THREE.SphereGeometry(0.15,perfil.plano?6:12,perfil.plano?5:9),22);
  im("pelo",new THREE.SphereGeometry(0.158,perfil.plano?6:12,perfil.plano?3:5,0,Math.PI*2,0,Math.PI*0.55),22);
  im("guante",new THREE.BoxGeometry(0.12,0.14,0.07),4);
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
    for(let k=0;k<2;k++){ const j=i*2+k;
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
/* una pierna (muslo, media, zapato) o un brazo (manga, antebrazo, guante) desde su articulación */
function _c3dMiembro(P,a,b,c,idx,B,jx,jy,jz,ang1,abd,ang2,l1,l2,cIdx){
  const K=_C3M;
  K.W.copy(B); _c3dT(K.W,jx,jy,jz); _c3dR(K.W,ang1,0,abd); _c3dT(K.W,0,-l1/2,0); P[a].setMatrixAt(idx,K.W);
  _c3dT(K.W,0,-l1/2,0); _c3dR(K.W,ang2,0,0); _c3dT(K.W,0,-l2/2,0); P[b].setMatrixAt(idx,K.W);
  if(c){ _c3dT(K.W,0,-l2/2-0.03,c==="zapato"?0.06:0); if(c==="zapato") _c3dR(K.W,-ang1-ang2,0,0); P[c].setMatrixAt(cIdx!=null?cIdx:idx,K.W); }
}
/* pone a un jugador: o = {x,z,yaw,fase,amp,roll,lift,brazos:"correr"|"arriba"|"abrazo"} */
function _c3dPose(est,i,o){
  const P=est.piezas, K=_c3dM(), B=K.B;
  B.makeTranslation(o.x,o.lift||0,o.z); _c3dR(B,0,o.yaw,0);
  if(o.roll){ _c3dT(B,0,C3D_CUERPO.cadera,0); _c3dR(B,0,0,o.roll); _c3dT(B,0,-C3D_CUERPO.cadera,0); }
  const c=C3D_CUERPO, f=o.fase||0, a=o.amp||0;
  /* tronco */
  K.W.copy(B); _c3dT(K.W,0,1.24,0); _c3dR(K.W,a*0.12,0,0); P.torso.setMatrixAt(i,K.W);
  const fr=est.franjas[i];
  if(fr==="horizontal"){ K.W.copy(B); _c3dT(K.W,0,1.3,0); _c3dS(K.W,0.5,0.13,0.45); P.franja.setMatrixAt(i,K.W); }
  else if(fr==="vertical"){ K.W.copy(B); _c3dT(K.W,0,1.24,0); _c3dS(K.W,0.13,0.6,0.47); P.franja.setMatrixAt(i,K.W); }
  else if(fr==="banda"){ K.W.copy(B); _c3dT(K.W,0,1.26,0); _c3dR(K.W,0,0,0.75); _c3dS(K.W,0.12,0.72,0.47); P.franja.setMatrixAt(i,K.W); }
  else P.franja.setMatrixAt(i,K.cero);
  K.W.copy(B); _c3dT(K.W,0,0.86,0); P.short.setMatrixAt(i,K.W);
  K.W.copy(B); _c3dT(K.W,0,1.71,a*0.03); P.cabeza.setMatrixAt(i,K.W);
  K.W.copy(B); _c3dT(K.W,0,1.74,a*0.03-0.01); if(est.pelados[i]) _c3dS(K.W,0,0,0); P.pelo.setMatrixAt(i,K.W);
  /* piernas: la que va adelante se estira, la que vuelve dobla la rodilla */
  for(let k=0;k<2;k++){
    const s=k?1:-1, ph=f+(k?Math.PI:0), muslo=Math.sin(ph)*0.75*a, rod=a*(0.25+0.95*Math.max(0,-Math.cos(ph)));
    const quieto=o.brazos==="arriba"?(k?0.35:0.85):0;
    _c3dMiembro(P,"muslo","media","zapato",i*2+k,B,s*c.ancho_cad,c.cadera,0,-muslo-quieto*0.4,s*0.04,rod+quieto*0.6,c.muslo,c.pierna);
  }
  /* brazos */
  for(let k=0;k<2;k++){
    const s=k?1:-1, ph=f+(k?0:Math.PI);
    let hom=Math.sin(ph)*0.6*a, abd=s*0.12, codo=-(0.35+0.4*a);
    if(o.brazos==="arriba"){ hom=-2.75; abd=s*0.25; codo=-0.15; }
    else if(o.brazos==="abrazo"){ hom=-1.25; abd=-s*0.35; codo=-0.9; }
    const esArq=est.gk[i]>=0;
    _c3dMiembro(P,"manga","antebrazo",esArq?"guante":null,i*2+k,B,s*c.ancho_hom,c.hombro,0,hom,abd,codo,c.brazo,c.antebrazo,esArq?est.gk[i]*2+k:null);
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
  renderer.outputEncoding=THREE.sRGBEncoding; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=false;   /* sombras de mancha: mucho más baratas y en la tele se ven así */
  const pr0=Math.min(perfil.pr,(window.devicePixelRatio||1)*(perfil.plano?0.5:1));
  renderer.setPixelRatio(pr0);
  const scene=new THREE.Scene();
  _c3dCielo(scene,perfil);
  if(!perfil.plano) scene.fog=new THREE.Fog(0x24406e,140,260);
  scene.add(new THREE.HemisphereLight(0xe4efff,0x2b3a22,1.0));
  const sol=new THREE.DirectionalLight(0xfff4e0,0.9); sol.position.set(30,60,25); scene.add(sol);
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
  S.jug.forEach((p,i)=>{
    const x=wx(p.y), z=wz(p.x), ang=(typeof p._ang==="number")?p._ang:0;
    const vel=p._vel||0, amp=Math.min(1,vel/0.55);
    const o={x:x, z:z, yaw:ang, fase:p._paso||0, amp:amp, roll:0, lift:0, brazos:"correr"};
    if(p.rol==="gk"){
      const pase=S.pase;
      if((p._dive||0)>0.05){
        const destX=pase&&pase.tiro?wx(pase.y1):wx(S.ball.y), lado=Math.sign(destX-x)||1;
        const d=Math.min(1,p._dive), lat=Math.cos(ang)*lado;   /* hacia qué lado queda en SU marco */
        o.roll=-Math.sign(lat||1)*d*1.25; o.lift=Math.sin(d*Math.PI)*0.35; o.x=x+lado*d*0.7; o.brazos="arriba"; o.amp=0;
      } else if(S.atajada&&S.atajada.gk===i&&S.own===i){ o.brazos="abrazo"; o.amp=0; }
    }
    _c3dPose(est,i,o);
    M.makeTranslation(o.x,0.02,o.z); _c3dS(M,1.1+o.lift,1,1.1+o.lift); sombras.setMatrixAt(i,M);
    if(o.brazos==="abrazo"){ K.v.set(0,1.15,0.32).applyMatrix4(K.B); manos=K.v.clone(); }
  });
  const b=S.ball, bx=wx(b.y), bz=wz(b.x), by=Math.max(0.15,(b.z||0)*11+0.15);
  if(manos) est.bola.position.copy(manos); else est.bola.position.set(bx,by,bz);
  const rod=S._rodado||0; est.bola.rotation.set(rod*2.2,0,rod*0.7);
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
    if(est.bp&&est.bp.paso) est.bp.paso(dt);   /* balón parado: la jugada mueve a todos, la simulación espera */
    else if(typeof _cvStep==="function"&&!(est.P&&est.P.terminado&&!(_cvSt&&_cvSt.seq))) _cvStep(est.P,dt);
    _c3dSincronizar(est,dt); est.renderer.render(est.scene,est.camGL); }
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
    "canvas.cancha3d.c3d-antigua{image-rendering:pixelated}";
  document.head.appendChild(st);
}
