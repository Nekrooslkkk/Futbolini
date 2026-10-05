"use strict";
/* ============================================================
   FUTBOLINI · modelo3d.js — 7.9130 · JUGADORES CON CUERPO DE VERDAD (maniquí CC0 animado)
   Pedido del autor: "que los esqueletos sean más smooth, más suaves, realistas: todavía hay robotismo"; "si descargas
   modelos, sería genial (PES 2006)".
   - El cuerpo es UNA malla continua con esqueleto (65 huesos): se dobla en codos y rodillas sin cortes. Sale del paquete
     "Universal Animation Library" de Quaternius, licencia CC0 (dominio público), preparado por scripts/modelo_jugador.py
     (img/modelos/jugador.glb, ~0,7 MB, se guarda para jugar sin internet).
   - Corre con las ANIMACIONES DEL PAQUETE (quieto, caminar, trotar, piquear; hechas en Blender por Quaternius: la
     fuente no dice que sean de captura de movimiento, así que no lo decimos) mezcladas según la velocidad y con los pasos
     sincronizados (los pies no patinan); los gestos del fútbol (patada, pecho, cabezazo, quite, arquero) van ENCIMA,
     rotando los huesos con las mismas poses de C3D_ACCIONES.
   - Los colores del club se pintan por zona del cuerpo (piel, camiseta con franjas, short, medias, botines, pelo).
   - Lector glTF propio y chico (sin librerías nuevas: se mantiene solo). Si algo falla, la cancha sigue con los
     jugadores de siempre (el doctor `modelo_jugador` lo vigila).
   ============================================================ */
const MODELO3D={ url:"img/modelos/jugador.glb", estado:"nada", datos:null, error:null, promesa:null,
  /* velocidad de cada animación (m/s) medida con el desplazamiento real del paquete (UAL1_Standard_RM.glb) */
  vel:{Walk_Loop:0.975, Jog_Fwd_Loop:5.36, Sprint_Loop:8.25},
  /* mezcla por velocidad: anclas de velocidad → peso de cada animación (interpolado) */
  anclas:[0, 0.4, 1.5, 2.8, 5.4, 7.4, 9.5],
  pesos:{Idle_Loop:[1,0,0,0,0,0,0], Walk_Loop:[0,1,1,0,0,0,0], Jog_Fwd_Loop:[0,0,0,1,1,0,0], Sprint_Loop:[0,0,0,0,0,1,1]} };
const M3D_LOCO=["Walk_Loop","Jog_Fwd_Loop","Sprint_Loop"];
/* 7.9131 · el crédito que ve el jugador (Ajustes ▸ Jugadores 3D). Integridad: solo lo que dice la fuente (quaternius.com:
   CC0, hecho en Blender). Antes decía "movimientos capturados de personas" y eso no está en ninguna parte: el doctor lo vigila */
const MODELO3D_CREDITO="las animaciones del paquete «Universal Animation Library» de Quaternius (licencia libre CC0)";

/* ---------- lectura del GLB ---------- */
function _m3dLeerGLB(ab){
  const dv=new DataView(ab);
  if(dv.getUint32(0,true)!==0x46546C67||dv.getUint32(4,true)!==2) throw new Error("no es un GLB 2.0");
  const jl=dv.getUint32(12,true), j=JSON.parse(new TextDecoder().decode(new Uint8Array(ab,20,jl)));
  const bl=dv.getUint32(20+jl,true), bin=ab.slice(28+jl,28+jl+bl);
  const N={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16}, T={5126:Float32Array,5123:Uint16Array,5121:Uint8Array,5125:Uint32Array};
  const acc=(i)=>{ const a=j.accessors[i], v=j.bufferViews[a.bufferView], n=N[a.type], C=T[a.componentType], sz=C.BYTES_PER_ELEMENT;
    const off=(v.byteOffset||0)+(a.byteOffset||0), stride=v.byteStride||n*sz;
    if(stride===n*sz) return new C(bin.slice(off,off+a.count*n*sz));
    const out=new C(a.count*n), src=new DataView(bin);   /* intercalado: se copia elemento por elemento */
    const get={5126:(o)=>src.getFloat32(o,true),5123:(o)=>src.getUint16(o,true),5121:(o)=>src.getUint8(o),5125:(o)=>src.getUint32(o,true)}[a.componentType];
    for(let k=0;k<a.count;k++) for(let q=0;q<n;q++) out[k*n+q]=get(off+k*stride+q*sz);
    return out; };
  /* la malla: posición, normal, huesos, pesos, zona del uniforme (en dos grupos de 3 para elegir el color sin mezclas raras) */
  const pr=j.meshes[0].primitives[0], at=pr.attributes, geo=new THREE.BufferGeometry();
  geo.setAttribute("position",new THREE.BufferAttribute(acc(at.POSITION),3));
  geo.setAttribute("normal",new THREE.BufferAttribute(acc(at.NORMAL),3));
  const jt=acc(at.JOINTS_0); geo.setAttribute("skinIndex",new THREE.BufferAttribute(jt instanceof Uint8Array?new Uint16Array(jt):jt,4));
  geo.setAttribute("skinWeight",new THREE.BufferAttribute(acc(at.WEIGHTS_0),4));
  /* zona: 0 piel · 1 camiseta · 2 short · 3 medias · 4 botines · 5 pelo · 6 manos (guantes del arquero) */
  const z=at._KIT!=null?acc(at._KIT):new Uint8Array(geo.attributes.position.count), kA=new Float32Array(z.length*4), kB=new Float32Array(z.length*4);
  for(let k=0;k<z.length;k++){ const r=Math.min(7,z[k]); if(r<4) kA[k*4+r]=1; else kB[k*4+(r-4)]=1; }
  geo.setAttribute("kitA",new THREE.BufferAttribute(kA,4)); geo.setAttribute("kitB",new THREE.BufferAttribute(kB,4));
  geo.setIndex(new THREE.BufferAttribute(acc(pr.indices),1));
  geo.computeBoundingSphere();
  const skin=j.skins[0], ibm=acc(skin.inverseBindMatrices), inversas=skin.joints.map((_,k)=>new THREE.Matrix4().fromArray(ibm,k*16));
  /* las animaciones como clips de three (pista "<hueso>.quaternion" / ".position") */
  const clips={};
  (j.animations||[]).forEach(an=>{
    const pistas=[];
    an.channels.forEach(ch=>{ const s=an.samplers[ch.sampler], nodo=j.nodes[ch.target.node].name, t=acc(s.input), v=acc(s.output);
      if(ch.target.path==="rotation") pistas.push(new THREE.QuaternionKeyframeTrack(nodo+".quaternion",t,v));
      else if(ch.target.path==="translation") pistas.push(new THREE.VectorKeyframeTrack(nodo+".position",t,v)); });
    clips[an.name]=new THREE.AnimationClip(an.name,-1,pistas);
  });
  return {j:j, geo:geo, juntas:skin.joints, inversas:inversas, clips:clips, malla:j.nodes.findIndex(n=>n.mesh!=null)};
}
/* baja el modelo una vez (queda guardado por el service worker: img/ es caché primero) */
function modelo3dCargar(){
  if(MODELO3D.promesa) return MODELO3D.promesa;
  if(typeof THREE==="undefined"||typeof fetch!=="function"){ MODELO3D.estado="error"; MODELO3D.error="sin THREE"; return Promise.resolve(false); }
  MODELO3D.estado="cargando";
  const v=(typeof VERSION!=="undefined")?"?v="+VERSION:"";
  /* con servidor: el .glb; con file:// (o si el fetch falla) la misma cosa en base64 dentro de un .js, que sí carga */
  const desdeScript=()=>new Promise((ok,mal)=>{
    if(window.MODELO3D_GLB) return ok(window.MODELO3D_GLB);
    const sc=document.createElement("script"); sc.src=MODELO3D.url.replace(/\.glb$/,".js")+v;
    sc.onload=function(){ if(window.MODELO3D_GLB) ok(window.MODELO3D_GLB); else mal(new Error("el .js del modelo vino vacío")); };
    sc.onerror=function(){ mal(new Error("no se pudo cargar el modelo")); };
    document.head.appendChild(sc);
  }).then(b64=>{ const bin=atob(b64), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); MODELO3D.via="js"; return u.buffer; });
  const porFetch=()=>fetch(MODELO3D.url+v).then(r=>{ if(!r.ok) throw new Error("HTTP "+r.status); MODELO3D.via="glb"; return r.arrayBuffer(); });
  MODELO3D.promesa=(location.protocol==="file:"?desdeScript():porFetch().catch(desdeScript))
    .then(ab=>{ const D=_m3dLeerGLB(ab); _m3dFasesPie(D); MODELO3D.datos=D; MODELO3D.estado="listo"; return true; })
    .catch(e=>{ MODELO3D.estado="error"; MODELO3D.error=String(e&&e.message||e); MODELO3D.promesa=null; return false; });
  return MODELO3D.promesa;
}

/* ---------- un jugador: su esqueleto, su malla (geometría compartida) y su mezclador de animaciones ---------- */
function modelo3dInstancia(mat,D){
  D=D||MODELO3D.datos; const j=D.j, obj=[];
  const esJunta=new Set(D.juntas);
  j.nodes.forEach((n,k)=>{
    const o=esJunta.has(k)?new THREE.Bone():new THREE.Object3D(); o.name=n.name||("n"+k);
    if(n.translation) o.position.fromArray(n.translation);
    if(n.rotation) o.quaternion.fromArray(n.rotation);
    if(n.scale) o.scale.fromArray(n.scale);
    obj[k]=o; });
  j.nodes.forEach((n,k)=>{ (n.children||[]).forEach(c=>obj[k].add(obj[c])); });
  const raiz=new THREE.Group(); j.scenes[j.scene||0].nodes.forEach(k=>raiz.add(obj[k]));
  const malla=new THREE.SkinnedMesh(D.geo,mat); malla.frustumCulled=false;
  obj[D.malla].add(malla);
  const huesos=D.juntas.map(k=>obj[k]);
  raiz.updateMatrixWorld(true);
  malla.bind(new THREE.Skeleton(huesos,D.inversas),new THREE.Matrix4());
  const H={}; obj.forEach(o=>{ H[o.name]=o; });   /* todos los nodos por nombre (la raíz del esqueleto trae el giro de −90°) */
  const mezcla=new THREE.AnimationMixer(raiz), acciones={};
  Object.keys(D.clips).forEach(k=>{ const a=mezcla.clipAction(D.clips[k]); a.play(); a.setEffectiveWeight(0); acciones[k]=a; });
  /* el reposo de cada hueso que tocan los gestos (para sumarles rotaciones encima de la animación) */
  return {raiz:raiz, malla:malla, H:H, mezcla:mezcla, acciones:acciones, fase:Math.random(), tIdle:Math.random()*2.5};
}
/* ---------- material con los colores del club por zona (camiseta con franjas) ---------- */
function modelo3dMaterial(colores){
  const m=new THREE.MeshLambertMaterial({color:0xffffff});
  const U={uKit:{value:[0,1,2,3,4,5,6,7].map(()=>new THREE.Color())}, uFranja:{value:0}, uFranjaCol:{value:new THREE.Color()}};
  m.userData.u=U;
  m.onBeforeCompile=function(sh){
    Object.assign(sh.uniforms,U);
    sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\nattribute vec4 kitA;\nattribute vec4 kitB;\nvarying vec4 vKitA;\nvarying vec4 vKitB;\nvarying vec3 vReposo;")
      .replace("#include <begin_vertex>","#include <begin_vertex>\nvKitA=kitA; vKitB=kitB; vReposo=position;");
    sh.fragmentShader=sh.fragmentShader.replace("#include <common>","#include <common>\nuniform vec3 uKit[8];\nuniform float uFranja;\nuniform vec3 uFranjaCol;\nvarying vec4 vKitA;\nvarying vec4 vKitB;\nvarying vec3 vReposo;")
      .replace("vec4 diffuseColor = vec4( diffuse, opacity );",
        /* la zona que más pesa en este punto (borde nítido entre camiseta y piel, sin mezclas raras) */
        "float kz=0.0; float km=vKitA.x;\n"+
        "if(vKitA.y>km){km=vKitA.y;kz=1.0;} if(vKitA.z>km){km=vKitA.z;kz=2.0;} if(vKitA.w>km){km=vKitA.w;kz=3.0;}\n"+
        "if(vKitB.x>km){km=vKitB.x;kz=4.0;} if(vKitB.y>km){km=vKitB.y;kz=5.0;} if(vKitB.z>km){km=vKitB.z;kz=6.0;} if(vKitB.w>km){km=vKitB.w;kz=7.0;}\n"+
        "vec3 kc=kz<0.5?uKit[0]:(kz<1.5?uKit[1]:(kz<2.5?uKit[2]:(kz<3.5?uKit[3]:(kz<4.5?uKit[4]:(kz<5.5?uKit[5]:(kz<6.5?uKit[6]:uKit[7]))))));\n"+
        "if(kz>0.5&&kz<1.5&&uFranja>0.5){ float f=0.0;\n"+
        "  if(uFranja<1.5) f=step(0.5,fract(vReposo.y*5.5));\n"+
        "  else if(uFranja<2.5) f=step(0.5,fract(vReposo.x*7.0+0.25));\n"+
        "  else f=1.0-step(0.075,abs(vReposo.x+(vReposo.y-1.3)*0.85));\n"+
        "  kc=mix(kc,uFranjaCol,f); }\n"+
        "vec4 diffuseColor = vec4( diffuse*kc, opacity );");
  };
  m.customProgramCacheKey=function(){ return "m3dkit"; };
  if(colores) modelo3dPintar(m,colores);
  return m;
}
/* colores: {piel, camiseta, short, medias, botines, pelo, manos, franja:"horizontal"|"vertical"|"banda"|null, franjaCol} */
function modelo3dPintar(m,c){
  const U=m.userData.u, col=(typeof c3dCol==="function")?c3dCol:((h,C)=>C.set(h));
  [c.piel,c.camiseta,c.short,c.medias,c.botines,c.pelo,c.manos||c.piel,c.piel].forEach((h,k)=>col(h||"#888888",U.uKit.value[k]));
  U.uFranja.value=c.franja==="horizontal"?1:(c.franja==="vertical"?2:(c.franja==="banda"?3:0));
  col(c.franjaCol||c.camiseta||"#ffffff",U.uFranjaCol.value);
}

/* ---------- caminar/trotar/piquear: pesos por velocidad y pasos sincronizados ---------- */
function _m3dPeso(nombre,v){
  const A=MODELO3D.anclas, P=MODELO3D.pesos[nombre]; if(!P) return 0;
  if(v<=A[0]) return P[0]; if(v>=A[A.length-1]) return P[P.length-1];
  for(let k=0;k<A.length-1;k++) if(v<=A[k+1]){ const u=(v-A[k])/(A[k+1]-A[k]); return P[k]+(P[k+1]-P[k])*u; }
  return 0;
}
/* en qué momento de cada animación el pie izquierdo va más adelante: con eso las tres arrancan el paso juntas */
function _m3dFasesPie(D){
  D.fasePie={};
  try{
    const mat=new THREE.MeshBasicMaterial(), I=modelo3dInstancia(mat,D);
    M3D_LOCO.forEach(k=>{ const c=D.clips[k]; if(!c) return; const a=I.mezcla.clipAction(c); a.play(); a.setEffectiveWeight(1);
      let mejor=0, mz=-1e9, v=new THREE.Vector3();
      for(let s=0;s<48;s++){ a.time=s/48*c.duration; I.mezcla.update(0); I.raiz.updateMatrixWorld(true);
        const zi=I.H.foot_l.getWorldPosition(v).z, zd=I.H.foot_r.getWorldPosition(v).z; if(zi-zd>mz){ mz=zi-zd; mejor=s/48; } }
      a.stop(); D.fasePie[k]=mejor; });
  }catch(e){ D.fasePie={}; }
}
/* v en m/s; dt en segundos. Devuelve la fase (0..1) para grabarla en la repetición */
function modelo3dAndar(I,v,dt,fase){
  const D=MODELO3D.datos, A=I.acciones;
  let largo=0, suma=0;
  M3D_LOCO.forEach(k=>{ const w=_m3dPeso(k,v); if(w>0&&MODELO3D.vel[k]&&D.clips[k]){ largo+=w*MODELO3D.vel[k]*D.clips[k].duration; suma+=w; } });
  if(fase!=null) I.fase=fase;
  else if(suma>0.001){ largo/=suma; I.fase=(I.fase+dt*v/Math.max(0.3,largo))%1; }
  I.tIdle=(I.tIdle+dt)%1000;
  const pl=I.pesoLoco!=null?I.pesoLoco:1;
  Object.keys(A).forEach(k=>{
    const a=A[k], c=a.getClip(); let w=0;
    if(k==="Idle_Loop"){ w=_m3dPeso(k,v)*pl+(1-pl); a.time=I.tIdle%c.duration; }
    else if(M3D_LOCO.indexOf(k)>=0){ w=_m3dPeso(k,v)*pl; a.time=((I.fase+((D.fasePie&&D.fasePie[k])||0))%1)*c.duration; }
    a.enabled=w>0.001; a.setEffectiveWeight(w);   /* la que no pesa ni se calcula */
  });
  I.mezcla.update(0);
  return I.fase;
}

/* ---------- los gestos del fútbol encima de los huesos ----------
   Un gesto (cancha3d.js, C3D_ACCIONES) son ángulos del cuerpo: muslo/rodilla/pie por pierna, hombro/abrir/codo por
   brazo, inclinación y giro del tronco, cabeza. Se suman como rotaciones en el espacio del jugador (X = su izquierda,
   Y = arriba, Z = adelante), desde la cadera hacia las puntas, con un peso (entra y sale suave). */
const _M3={q:null,qp:null,qa:null,v:null,ej:null};
function _m3dRot(I,nombre,cadena,ax,ay,az,ang){
  const b=I.H[nombre]; if(!b||!ang) return;
  if(!_M3.q){ _M3.q=new THREE.Quaternion(); _M3.qp=new THREE.Quaternion(); _M3.qa=new THREE.Quaternion(); _M3.v=new THREE.Vector3(); }
  /* rotación del padre en el espacio del jugador: producto de la cadena desde la raíz del esqueleto */
  const qp=_M3.qp.set(0,0,0,1); for(let k=0;k<cadena.length;k++){ const h=I.H[cadena[k]]; if(h) qp.multiply(h.quaternion); }
  const eje=_M3.v.set(ax,ay,az).applyQuaternion(_M3.q.copy(qp).invert()).normalize();
  _M3.qa.setFromAxisAngle(eje,ang); b.quaternion.premultiply(_M3.qa);
}
const M3D_CADENAS={
  pelvis:["root"], spine_01:["root","pelvis"], spine_02:["root","pelvis","spine_01"], spine_03:["root","pelvis","spine_01","spine_02"],
  neck_01:["root","pelvis","spine_01","spine_02","spine_03"], Head:["root","pelvis","spine_01","spine_02","spine_03","neck_01"],
  thigh_l:["root","pelvis"], thigh_r:["root","pelvis"], calf_l:["root","pelvis","thigh_l"], calf_r:["root","pelvis","thigh_r"],
  foot_l:["root","pelvis","thigh_l","calf_l"], foot_r:["root","pelvis","thigh_r","calf_r"],
  upperarm_l:["root","pelvis","spine_01","spine_02","spine_03","clavicle_l"], upperarm_r:["root","pelvis","spine_01","spine_02","spine_03","clavicle_r"],
  lowerarm_l:["root","pelvis","spine_01","spine_02","spine_03","clavicle_l","upperarm_l"], lowerarm_r:["root","pelvis","spine_01","spine_02","spine_03","clavicle_r","upperarm_r"]
};
/* g = gesto (como en cancha3d.js), w = cuánto pesa (0..1) */
function modelo3dGesto(I,g,w){
  if(!g||w<=0.001) return;
  const C=M3D_CADENAS, r=(n,ax,ay,az,ang)=>_m3dRot(I,n,C[n]||[],ax,ay,az,ang*w);
  /* tronco: inclinación (X) y giro (Y) repartidos en la columna; la cabeza asiente */
  ["spine_01","spine_02","spine_03"].forEach(n=>{ r(n,1,0,0,(g.pitch||0)/3); r(n,0,1,0,(g.twist||0)/3); });
  r("Head",1,0,0,(g.nod||0)-(g.pitch||0)*0.5);
  /* piernas: 0 = derecha (−X), 1 = izquierda (+X). Muslo (− = adelante), abrir, rodilla, pie */
  [["r",0],["l",1]].forEach(([s,k])=>{ const L=g.legs[k]; r("thigh_"+s,1,0,0,L.t); r("thigh_"+s,0,0,1,L.a||0); r("calf_"+s,1,0,0,L.k); r("foot_"+s,1,0,0,L.p||0); });
  /* brazos: hombro (− = adelante/arriba), abrir hacia afuera, codo */
  [["r",0],["l",1]].forEach(([s,k])=>{ const A=g.arms[k]; r("upperarm_"+s,1,0,0,A.s); r("upperarm_"+s,0,0,1,(A.a||0)); r("lowerarm_"+s,1,0,0,A.e); });
}
/* la mano (para la pelota del arquero): posición en el mundo */
function modelo3dMano(I,lado,v){ const b=I.H[lado==="l"?"hand_l":"hand_r"]; return b?b.getWorldPosition(v):null; }
