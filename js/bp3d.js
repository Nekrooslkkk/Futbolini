"use strict";
/* ============================================================
   FUTBOLINI · bp3d.js — 7.9127 · PENAL, TIRO LIBRE Y CÓRNER DENTRO DE LA CANCHA 3D
   Pedido del autor: "penal/córner dentro de la cancha 3D" (antes se abría una escena aparte en una ventana).

   Con la cancha 3D prendida y dirigiendo, el balón parado se juega en LA MISMA cancha del partido: la vista se agranda,
   la cámara se pone detrás del pateador (o del banderín), los 22 se acomodan (área llena, barrera a 9,15 m, arquero en
   su línea), apuntas sobre el arco de verdad y le pegas.
   - Celu: arrastra para apuntar y toca ¡Patear! para parar la línea (gris flojo, verde bien, amarillo fuerte, rojo se eleva).
   - PC: mouse o flechas apuntan; la línea de potencia va y viene sola y la paras con Espacio/click (7.9128).
   El RESULTADO lo deciden las mismas funciones de siempre (penZona, penArqueroTira, penResolver, tlClasificar,
   cornerResolver, paloEntra, penalEnPartido): las probabilidades no cambian, solo dónde se juega. El doctor
   `bp3d_misma_ley` lo vigila. Sin 3D (o en 2D) sigue el balón parado de siempre.
   Siempre hay salida: "✕ Que se juegue solo" y un vigilante que cierra la jugada si algo se corta.
   ============================================================ */
const BP3D={ activo:null, ARCO:{ancho:3.66, alto:2.44, z:52.5}, TECLA:{x:0,y:1.2,paso:0.35} };

/* 7.9128 · el autor: "la potencia debe ser una línea que se mueve: en verde se tira bien, en roja muy fuerte".
   Medidor de golf: la aguja va y viene sola, la paras en el momento (Espacio, click o toque) y la dirección la da la mira.
   El pateador bueno tiene la aguja más lenta; la presión (tanda, final del partido) la acelera. */
const MEDIDOR_ZONAS=[{hasta:0.3,k:"flojo",t:"Flojo"},{hasta:0.6,k:"bien",t:"Bien"},{hasta:0.92,k:"fuerte",t:"Fuerte"},{hasta:1,k:"bestia",t:"¡A lo bestia!"}];
function medidorZona(v){ return MEDIDOR_ZONAS.find(z=>v<=z.hasta)||MEDIDOR_ZONAS[MEDIDOR_ZONAS.length-1]; }
/* vuelta completa (ida y vuelta) en segundos: nivel 60 → 2,4 s · nivel 85 → 3,4 s; con presión −15 % */
function medidorPeriodo(nivel,presion){ return Math.max(1.6,Math.min(3.8,2.4+((nivel||70)-60)*0.04))*(presion?0.85:1); }
function medidorValor(seg,periodo){ const u=((seg/periodo)*2)%2; return u<1?u:2-u; }
function medidorPotencia(nivel,presion){
  const T=medidorPeriodo(nivel,presion), t0=performance.now();
  const el_=document.createElement("div"); el_.className="bp3d-med";
  el_.innerHTML='<div class="bp3d-med-t"><span>Potencia</span><b>—</b></div><div class="bp3d-med-b">'+
    MEDIDOR_ZONAS.map((z,i)=>'<span class="z '+z.k+'" style="left:'+((i?MEDIDOR_ZONAS[i-1].hasta:0)*100)+'%;width:'+((z.hasta-(i?MEDIDOR_ZONAS[i-1].hasta:0))*100)+'%"></span>').join("")+
    '<i class="aguja"></i></div>';
  const ag=el_.querySelector(".aguja"), lab=el_.querySelector(".bp3d-med-t b");
  const m={el:el_, periodo:T, parado:null,
    valor:()=>m.parado!=null?m.parado:medidorValor((performance.now()-t0)/1000,T),
    pintar:()=>{ const v=m.valor(), z=medidorZona(v); ag.style.left=(v*100).toFixed(2)+"%"; lab.textContent=z.t; lab.className=z.k; },
    parar:()=>{ if(m.parado==null){ m.parado=m.valor(); el_.classList.add("parado"); m.pintar(); } return m.parado; } };
  m.pintar();
  return m;
}
/* ¿se puede jugar en la cancha 3D? (3D prendido, montado y a la vista) */
function bp3dDisponible(){
  try{
    if(typeof C3D==="undefined"||!C3D.est||typeof THREE==="undefined") return false;
    const e=C3D.est; if(!e.canvas||!e.canvas.isConnected||!e.st) return false;
    if(typeof cancha3dActivo==="function"&&!cancha3dActivo()) return false;
    return !(typeof E!=="undefined"&&E&&E.config&&E.config.bp3d===false);
  }catch(e){ return false; }
}
/* del punto en el arco (metros, mirando desde el pateador) a la mira de siempre (viewBox 360×240 de ui-partido.js)
   La derecha de la pantalla es −x del mundo (la cámara mira hacia +z). */
function bp3dALegado(xm,ym){
  const A=PEN_ARCO, mitad=(A.x1-A.x0)/2, cx=(A.x0+A.x1)/2;
  return {x:cx-xm*mitad/BP3D.ARCO.ancho, y:A.y1-ym*(A.y1-A.y0)/BP3D.ARCO.alto};
}
function bp3dDesdeLegado(lx,ly){
  const A=PEN_ARCO, mitad=(A.x1-A.x0)/2, cx=(A.x0+A.x1)/2;
  return {x:-(lx-cx)*BP3D.ARCO.ancho/mitad, y:(A.y1-ly)*BP3D.ARCO.alto/(A.y1-A.y0)};
}
const _bpSX=z=>z/105+0.5, _bpSY=x=>x/68+0.5, _bpWX=y=>(y-0.5)*68, _bpWZ=x=>(x-0.5)*105;
function _bpPoner(p,x,z){ p.x=_bpSX(z); p.y=_bpSY(x); p._vel=0; p._dive=0; p.vx=p.vy=0; }   /* quieto y parado (el arquero venía tirado de la jugada anterior) */
function _bpMirar(p,x,z){ const dx=(_bpSX(z)-p.x)*105, dy=(_bpSY(x)-p.y)*68; p._ang=Math.atan2(dy,dx); }

/* acomoda a los 22 para la jugada; devuelve índices útiles */
function _bpAcomodar(S,tipo,bola){
  const mios=[], rivs=[]; let gkR=-1, gkM=-1;
  S.jug.forEach((p,i)=>{ if(p.rol==="gk"){ if(p.mio) gkM=i; else gkR=i; } else (p.mio?mios:rivs).push(i); });
  const Z=BP3D.ARCO.z;
  if(gkR>=0) _bpPoner(S.jug[gkR],tipo==="tl"?bola.gkX:0,Z-0.4);
  if(gkM>=0) _bpPoner(S.jug[gkM],0,-Z+6);
  const pat=mios.slice().sort((a,b)=>Math.abs(S.jug[b].x-1)-Math.abs(S.jug[a].x-1))[0];
  const resto=mios.filter(i=>i!==pat);
  if(tipo==="penal"){
    /* todos afuera del área y de la medialuna, abiertos a los lados (no se meten delante de la cámara) */
    resto.concat(rivs).forEach((i,k)=>{ const lado=k%2?1:-1; _bpPoner(S.jug[i],lado*(9+((k*3.7)%11)),Z-17.5-((k*1.3)%5)); });
  } else if(tipo==="tl"){
    /* barrera: 4 rivales a 9,15 m, en la línea pelota → centro del arco */
    const dx=-bola.x, dz=Z-bola.z, d=Math.hypot(dx,dz), ux=dx/d, uz=dz/d, px=-uz, pz=ux;
    const bx=bola.x+ux*9.15, bz=bola.z+uz*9.15;
    rivs.slice(0,4).forEach((i,k)=>{ const o=(k-1.5)*0.62+bola.lado*0.4; _bpPoner(S.jug[i],bx+px*o,bz+pz*o); });
    rivs.slice(4).forEach((i,k)=>{ _bpPoner(S.jug[i],((k*5.3)%18)-9,Z-6-((k*2.1)%8)); });
    resto.forEach((i,k)=>{ _bpPoner(S.jug[i],((k*4.7)%20)-10,Z-8-((k*3.1)%10)); });
  } else {
    /* córner: los míos van al área, cada rival marca a uno */
    const area=[[-3,-8],[0,-10.5],[3,-7],[-6,-12],[5,-11],[1,-5.5],[-2,-14]];
    resto.forEach((i,k)=>{ const a=area[k%area.length]; _bpPoner(S.jug[i],a[0]+((k*0.7)%1),Z+a[1]); });
    rivs.forEach((i,k)=>{ const a=area[k%area.length]; _bpPoner(S.jug[i],a[0]+0.7,Z+a[1]+0.9); });
  }
  S.jug.forEach(p=>_bpMirar(p,bola.x,bola.z));
  return {pat:pat, gkR:gkR, rivs:rivs, mios:mios};
}

/* ---------- la jugada ---------- */
function bp3dJugar(tipo,P,opts){
  opts=opts||{};
  const est=C3D.est, S=est.st, host=est.host;
  const Z=BP3D.ARCO.z;
  /* dónde está la pelota */
  const bola={x:0,z:Z-11,lado:Math.random()<0.5?-1:1,gkX:0};
  if(tipo==="tl"){ bola.z=Z-_bpRnd(18,25); bola.x=_bpRnd(-11,11); bola.gkX=bola.x>0?-1.8:1.8; }
  if(tipo==="corner"){ bola.x=bola.lado*33.6; bola.z=Z-0.6; }
  const idx=_bpAcomodar(S,tipo,bola);
  const gk=idx.gkR>=0?S.jug[idx.gkR]:null, pj=idx.pat>=0?S.jug[idx.pat]:null;
  /* el que patea: 1,8 m detrás de la pelota, mirando el arco */
  /* el que patea toma carrera en diagonal (como un diestro de verdad): no tapa la pelota ni el arco.
     7.9129 · parte 3–3,6 m atrás (antes 1,8 m) para que la carrera dure lo que dura en la cancha */
  const haciaArco=tipo==="corner"?{x:-bola.x,z:(Z-8)-bola.z}:{x:-bola.x,z:Z-bola.z};
  const car=_bpCarrera(bola,haciaArco,tipo==="corner"?2.6:(tipo==="tl"?3.6:3.0),tipo==="corner"?1.2:(tipo==="tl"?1.8:1.5));
  if(pj){ _bpPoner(pj,car.ini.x,car.ini.z); _bpMirar(pj,bola.x,bola.z); }
  S.ball.x=_bpSX(bola.z); S.ball.y=_bpSY(bola.x); S.ball.z=0; S.ball.vx=S.ball.vy=S.ball.vz=0;
  S.own=-1; S.pase=null; S.saque=null; S.atajada=null; S.persigue=null;
  /* cámara: detrás de la pelota (en el córner, detrás del banderín y alto) */
  const cam=new THREE.Vector3(), mira=new THREE.Vector3(0,1.2,Z);
  /* (adentro del estadio: detrás del banderín pero antes de la tribuna) */
  /* 7.9129 · más cerca y un poco más baja: el área llena la pantalla (antes los jugadores se veían chicos arriba a la derecha) */
  if(tipo==="corner"){ cam.set(bola.lado*32,7,Z+3.4); mira.set(bola.lado*2,0.2,Z-9.5); }
  else { const dx=bola.x, dz=bola.z-Z, d=Math.hypot(dx,dz)||1, lejos=tipo==="tl"?9.5:9; cam.set(bola.x+dx/d*lejos-0.6,tipo==="tl"?3.1:2.3,bola.z+dz/d*lejos); }
  /* la escena se agranda: capa sobre la página con el mismo canvas del partido */
  const capa=document.createElement("div"); capa.className="bp3d-capa"; capa.setAttribute("role","dialog");
  capa.setAttribute("aria-label",{penal:"Penal",tl:"Tiro libre",corner:"Córner"}[tipo]);
  const escena=document.createElement("div"); escena.className="bp3d-escena";
  const hud=document.createElement("div"); hud.className="bp3d-hud";
  capa.appendChild(escena); capa.appendChild(hud); document.body.appendChild(capa);
  escena.appendChild(est.canvas);
  const ARQ=(typeof arqueroDe==="function"&&arqueroDe(P.rivalPlantel))||{n:"el arquero",nivel:70};
  let pat=opts.pateador||((typeof pateadorDe==="function")?pateadorDe(P.once):null)||{n:"el pateador",nivel:70,rasgos:[]};
  if(tipo==="corner"&&typeof E!=="undefined"&&E&&E.tactica&&E.tactica.corner){ const d=P.once.find(x=>x.n===E.tactica.corner); if(d) pat=d; }
  const cabeceador=(P.once.filter(x=>x.rasgos&&x.rasgos.indexOf("juego aéreo")>=0)[0])||(P.once.filter(x=>x.pos==="DEL"||x.pos==="MED")[0])||pat;
  /* textos de siempre */
  const tit=document.createElement("div"); tit.className="bp3d-tit";
  const etq=(typeof introBalonParado==="function")?introBalonParado(tipo,P,tipo==="corner"?cabeceador:pat,ARQ):"";
  tit.innerHTML=(opts.tanda?"Tanda · patea <b>"+escHtml(pat.n)+"</b>":etq)+"<span class='bp3d-instr'>"+(("ontouchstart" in window)?"Arrastra el dedo para apuntar · toca ¡Patear! cuando la línea esté en verde":"Click donde quieres la pelota (o flechas) · Espacio o ¡Patear! para la línea: verde bien, roja muy fuerte")+"</span>";
  hud.appendChild(tit);
  const presion=!!opts.tanda||((P.min||0)>=85&&Math.abs((P.gl||0)-(P.gv||0))<=1);
  const med=medidorPotencia((tipo==="corner"?(pat&&pat.nivel):(pat&&pat.nivel))||70,presion);
  const barra=med.el;
  const fila=document.createElement("div"); fila.className="bp3d-fila";
  let efecto="normal";
  if(tipo==="penal"){ const bPic=el("button","btn-aqua chico gris"); bPic.type="button"; bPic.textContent="Picadita";
    bPic.title="Con la línea en gris o verde la pica por arriba del arquero";
    bPic.onclick=()=>{ efecto=efecto==="picadita"?"normal":"picadita"; bPic.classList.toggle("gris",efecto!=="picadita"); }; fila.appendChild(bPic); }
  const bSolo=el("button","btn-aqua chico gris"); bSolo.type="button"; bSolo.textContent="✕ Que se juegue solo";
  const bPat=el("button","btn-aqua verde bp3d-patear"); bPat.type="button"; bPat.textContent=tipo==="corner"?"¡Cobrar!":"¡Patear!";
  fila.appendChild(bSolo);
  hud.appendChild(barra); hud.appendChild(fila); hud.appendChild(bPat);
  /* la mira: un aro sobre el arco (o en el área, en el córner) */
  const mat=new THREE.MeshBasicMaterial({color:0xffe14a,transparent:true,opacity:0.95,depthTest:false});
  const aro=new THREE.Mesh(new THREE.RingGeometry(0.22,0.32,24),mat); aro.renderOrder=10;
  const punto=new THREE.Mesh(new THREE.CircleGeometry(0.06,12),mat); punto.renderOrder=10;
  est.scene.add(aro); est.scene.add(punto);
  const matG=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.35,depthTest:false});
  const aroG=new THREE.Mesh(new THREE.RingGeometry(0.2,0.27,24),matG); aroG.renderOrder=9; aroG.visible=false; est.scene.add(aroG);
  const mira3={x:tipo==="corner"?0:0, y:tipo==="corner"?1.8:1.2, z:tipo==="corner"?Z-8:Z};
  const ponerMira=()=>{ aro.position.set(mira3.x,mira3.y,mira3.z-0.02); punto.position.copy(aro.position); aro.lookAt(est.camPos); punto.lookAt(est.camPos);
    const g=jug&&jug.guia; aroG.visible=!!(g&&jug.guiaVisible&&!jug.tirado&&Math.hypot(g.x-mira3.x,g.y-mira3.y,g.z-mira3.z)>0.25);
    if(aroG.visible){ aroG.position.set(g.x,g.y,g.z-0.02); aroG.lookAt(est.camPos); } };
  BP3D.TECLA.x=0; BP3D.TECLA.y=mira3.y;
  const jug={tipo:tipo, P:P, opts:opts, est:est, S:S, capa:capa, bola:bola, idx:idx, pat:pat, ARQ:ARQ, cabeceador:cabeceador, mira:mira3,
    tirado:false, fin:false, anim:null, t:0, aro:aro, punto:punto, aroG:aroG, carga:null};
  BP3D.activo=jug;
  /* ⏩ Adelantar: la misma jugada, 5 veces más rápido (pasos chicos: la física no cambia) */
  est.bp={cam:{pos:cam, mira:mira, fov:tipo==="corner"?31:40, suave:3.5}, paso:function(dt){ const n=jug.rapido?5:1; for(let i=0;i<n&&!jug.fin;i++) _bpPaso(jug,dt); ponerMira(); }};
  ponerMira();
  /* apuntar con el dedo / mouse: rayo desde la cámara hasta el plano del arco (o de la altura de cabeza en el córner) */
  const ray=new THREE.Raycaster(), v2=new THREE.Vector2();
  const plano=tipo==="corner"?new THREE.Plane(new THREE.Vector3(0,1,0),-1.8):new THREE.Plane(new THREE.Vector3(0,0,1),-Z);
  /* del puntero a un punto del arco (o del área en el córner), dentro de los límites de siempre */
  const _bpRayo=(ev)=>{
    const r=est.canvas.getBoundingClientRect(); v2.set(((ev.clientX-r.left)/r.width)*2-1,-((ev.clientY-r.top)/r.height)*2+1);
    ray.setFromCamera(v2,est.camGL); const q=new THREE.Vector3(); if(!ray.ray.intersectPlane(plano,q)) return null;
    if(tipo==="corner") return {x:Math.max(-12,Math.min(12,q.x)), y:1.8, z:Math.max(Z-17,Math.min(Z-1,q.z))};
    return {x:Math.max(-6,Math.min(6,q.x)), y:Math.max(0.1,Math.min(3.6,q.y)), z:Z};
  };
  const apuntar=(ev)=>{ const q=_bpRayo(ev); if(!q) return; mira3.x=q.x; mira3.y=q.y; mira3.z=q.z; };
  /* apuntar · 7.9129 · EL BUG DEL CÓRNER QUE SIEMPRE SE IBA AFUERA: la mira seguía al mouse, y al ir hacia "¡Cobrar!" se
     cruzaba la parte de abajo de la cancha: la mira se iba con él hasta el banderín. Ahora:
     - pasar el mouse solo mueve una mira FANTASMA (transparente): muestra dónde quedaría;
     - CLICK en la cancha fija la mira ahí (el dedo: arrastrar); las flechas la mueven;
     - Espacio, Enter o "¡Patear!" paran la línea y le pegan hacia la mira fija. Nada de lo que pase en el camino la mueve. */
  let apretado=false;
  const guia={x:mira3.x,y:mira3.y,z:mira3.z};
  const fantasma=(ev)=>{ const g=_bpRayo(ev); if(g){ guia.x=g.x; guia.y=g.y; guia.z=g.z; jug.guiaVisible=true; } };
  escena.addEventListener("pointerleave",()=>{ jug.guiaVisible=false; });
  escena.addEventListener("pointerdown",ev=>{ if(jug.tirado) return; ev.preventDefault(); apretado=true; apuntar(ev); });
  escena.addEventListener("pointermove",ev=>{ if(jug.tirado) return;
    if(apretado) apuntar(ev); else if(ev.pointerType==="mouse") fantasma(ev); });
  escena.addEventListener("pointerup",()=>{ apretado=false; });
  escena.addEventListener("pointercancel",()=>{ apretado=false; });
  jug.guia=guia; jug.bPat=bPat; jug.bSolo=bSolo;
  bPat.onclick=()=>_bpPatear(jug,med.parar(),efecto);
  bSolo.onclick=()=>_bpCerrar(jug,"solo");
  /* teclado (PC) */
  jug.tecla=function(e){
    if(BP3D.activo===jug&&jug.tirado&&(e.key==="Escape"||e.key==="Enter")){ e.preventDefault(); e.stopPropagation(); jug.rapido=true; return; }   /* ya pateaste: adelantar */
    if(BP3D.activo!==jug||jug.tirado) return;
    const k=e.key, T=BP3D.TECLA;
    const mov={ArrowLeft:[1,0],ArrowRight:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[k];
    if(mov){ e.preventDefault(); e.stopPropagation();
      if(tipo==="corner"){
        /* 7.9129 · las flechas mueven la mira como se ve en la pantalla (antes "arriba" la movía hacia la izquierda) */
        const d=_bpFlechaSuelo(est.camGL,-mov[0],mov[1]);
        mira3.x=Math.max(-12,Math.min(12,mira3.x+d.x*0.9)); mira3.z=Math.max(Z-17,Math.min(Z-1,mira3.z+d.z*0.9)); }
      else { mira3.x=Math.max(-6,Math.min(6,mira3.x+mov[0]*T.paso)); mira3.y=Math.max(0.1,Math.min(3.6,mira3.y+mov[1]*T.paso*0.7)); }
      return; }
    if(k===" "){ e.preventDefault(); e.stopPropagation(); if(!e.repeat) bPat.click(); return; }
    if(k==="Enter"){ e.preventDefault(); e.stopPropagation(); bPat.click(); }
    if(k==="Escape"){ e.preventDefault(); _bpCerrar(jug,"solo"); }
  };
  jug.teclaArriba=function(e){ if(BP3D.activo===jug&&e.key===" "){ e.preventDefault(); e.stopPropagation(); } };
  document.addEventListener("keydown",jug.tecla,true); document.addEventListener("keyup",jug.teclaArriba,true);
  jug.med=med; jug.hudTit=tit; jug.hud=hud;
  /* vigilante: si algo se corta, la jugada se cierra sola y el partido sigue */
  jug.vigila=setTimeout(function(){ if(!jug.fin) _bpCerrar(jug,"solo"); },60000);
  return true;
}
function _bpRnd(a,b){ return a+Math.random()*(b-a); }
/* una flecha en la pantalla → una dirección sobre el pasto (derecha/arriba de la cámara, aplanadas al suelo) */
function _bpFlechaSuelo(cam,dx,dy){
  const f=new THREE.Vector3(); cam.getWorldDirection(f); f.y=0; f.normalize();
  const r=new THREE.Vector3(-f.z,0,f.x);   /* derecha de la pantalla (mirando f, con y arriba) */
  const x=r.x*dx+f.x*dy, z=r.z*dx+f.z*dy, n=Math.hypot(x,z)||1;
  return {x:x/n, z:z/n};
}
/* la física del remate: velocidad según el golpe y la parábola que llega a (D metros, y de alto) */
/* m/s de verdad: centro ~20, tiro libre colocado ~21 (sube y cae sobre la barrera), penal colocado ~23, a lo bestia ~29 */
/* con la línea en gris (flojo) la pelota sale a tres cuartos de velocidad */
function _bpVel(tipo,efecto,pot){ const v=tipo==="corner"?20:(efecto==="potente"?29:(efecto==="picadita"?11:(tipo==="tl"?21:23))); return (pot!=null&&pot<0.3)?v*0.75:v; }
function _bpVuelo(D,y,v){
  const T=Math.max(0.35,D/v), g=9.81, vy=(y-0.11+0.5*g*T*T)/T;
  return {T:T, vy:vy, altura:u=>{ const t=u*T; return 0.11+vy*t-0.5*g*t*t; }};
}

/* ---------- patear: resolver con las reglas de siempre y animar con física ---------- */
function _bpPatear(jug,pot,efectoBoton){
  if(jug.tirado||jug.fin) return; jug.tirado=true;
  const ef=(typeof efectoConPotencia==="function")?efectoConPotencia({curl:0,picada:false},pot):{efecto:pot>=0.6?"potente":"colocado",pasado:pot>0.92};
  if(efectoBoton==="picadita"&&pot<A3_POT.potente) ef.efecto="picadita";
  jug.pot=pot; jug.zona=medidorZona(pot).k;
  /* el HUD cambia: ya no se cobra; "Que se juegue solo" (que resolvería otra vez lo que ya pateaste) pasa a ⏩ Adelantar */
  if(jug.bPat){ jug.bPat.disabled=true; jug.bPat.textContent=jug.tipo==="corner"?"Va el centro…":"Va el remate…"; }
  if(jug.bSolo){ jug.bSolo.textContent="⏩ Adelantar"; jug.bSolo.onclick=function(){ jug.rapido=true; jug.bSolo.disabled=true; }; }
  const m=jug.mira, Z=BP3D.ARCO.z;
  if(ef.pasado&&jug.tipo!=="corner") m.y+=0.6+(pot-A3_POT.pasado)*8;   /* a lo bestia, se eleva */
  jug.aro.visible=false; jug.punto.visible=false; if(jug.aroG) jug.aroG.visible=false;
  const out=_bpResolver(jug,ef.efecto);
  jug.out=out;
  _bpAnimar(jug,out,ef.efecto);
}
/* pegarle flojo (línea en gris) le regala tiempo al arquero: −10 al nivel del pateador */
function _bpFlojo(jug){ return (jug.pot!=null&&jug.pot<0.3&&jug.tipo!=="corner")?10:0; }
function _bpResolver(jug,efecto){
  const m=jug.mira, P=jug.P, ARQ=jug.ARQ;
  if(jug.tipo==="corner"){
    /* el centro: muy alto se va, muy pegado al arquero o muy bajo lo despejan; en el área decide cornerResolver */
    /* 7.9129 · el área mide 40 m de ancho: un centro al segundo palo (x hasta ±12) es un centro, no "se fue largo".
       Afuera solo si le pegas a lo bestia (línea roja) o si la mandas fuera del área; pegado al arco lo descuelga el arquero */
    const Z=BP3D.ARCO.z, lejos=Z-m.z, lado=jug.bola.lado, xl=m.x*lado;
    const zona=xl>(lejos<6?1.5:3)?"primer":(xl<-(lejos<6?1.5:3)?"segundo":"penal");
    if(Math.abs(m.x)>20.16||lejos>16.5) return {res:"afuera",motivo:"El centro se fue fuera del área",zona:zona};
    if(lejos<1.2) return {res:"defensa",motivo:"Al arco: el arquero sale y la descuelga",zona:zona,arquero:true};
    if(efecto==="potente"&&lejos<3) return {res:"defensa",motivo:"Muy pegado: el arquero la saca",zona:zona,arquero:true};
    /* la línea manda: flojo no pasa el primer palo, a lo bestia se va largo */
    if(jug.pot!=null&&jug.pot<0.3) return {res:"defensa",motivo:"Centro flojo: lo saca el primero",zona:zona};
    if(jug.pot!=null&&jug.pot>0.92) return {res:"afuera",motivo:"Le pegaste a lo bestia: se fue largo",zona:zona};
    const iner=(P.iner&&P.iner.cor)||0;
    const r=cornerResolver(zona,jug.cabeceador,ARQ,iner);
    return {res:r.res,zona:zona,kdir:penArqueroTira({tercio:"centro",alt:"alto"},ARQ.nivel||70)};
  }
  const L=bp3dALegado(m.x,m.y), aim=penZona(L.x,L.y);
  jug.aim=aim;
  if(jug.tipo==="tl"){
    const cl=tlClasificar({cx:aim.cx,cy:aim.cy,fuera:aim.fuera,tercio:aim.tercio,alt:aim.alt});
    /* la barrera también es física: si la línea pelota→mira pasa bajo 2,1 m por donde está la barrera, pega */
    /* la altura sale de la MISMA parábola que se anima (la pelota sube y baja): para pasarla hay que apuntar alto o por el lado */
    const b=jug.bola, Z=BP3D.ARCO.z, k=9.15/Math.max(9.2,Math.hypot(b.x,Z-b.z)), xb=b.x+(m.x-b.x)*k;
    const yb=_bpVuelo(Math.hypot(m.x-b.x,Z-b.z),Math.max(0.12,m.y),_bpVel("tl",efecto,jug.pot)).altura(k);
    const wallX=b.x+(-b.x)*k+b.lado*0.4, tapa=Math.abs(xb-wallX)<1.45&&yb<2.0;
    jug.barrera={yb:yb,dx:xb-wallX};
    if(cl.res==="afuera") return {res:"afuera",motivo:cl.motivo};
    if(cl.res==="palo") return {res:"palo",motivo:cl.motivo};
    if(tapa||cl.res==="barrera") return {res:"barrera",motivo:"La barrera la tapó"};
    const kdir=penArqueroTira(aim,ARQ.nivel||70), spec=jug.pat.rasgos&&jug.pat.rasgos.indexOf("tiro libre")>=0;
    const o=penResolver(aim,kdir,spec?"potente":efecto,(jug.pat.nivel||70)+(spec?6:0)-_bpFlojo(jug),ARQ.nivel||70);
    return {res:o.res==="gol"?"gol":(o.res==="palo"?"palo":(o.res==="afuera"?"afuera":"atajado")),kdir:kdir};
  }
  const kdir=penArqueroTira(aim,ARQ.nivel||70);
  const o=penResolver(aim,kdir,efecto,(jug.pat.nivel||70)-_bpFlojo(jug),ARQ.nivel||70);
  return {res:o.res,kdir:kdir};
}
/* ---------- 7.9129 · CARRERA, VUELO, DESENLACE Y LA JUGADA QUE SIGUE ----------
   Pedidos del autor: "la jugada termina cuando la sacan de ahí, porque puede haber un gol si es que la agarran (muy poco
   probable, pero pasa en el fútbol de verdad)"; "tiros libres: que se tire para donde va el balón y se encargue de
   sacarla, palo, etc."; "darle tiempo, que no sea tan rápido todo".
   1) CARRERA: el pateador parte 3–4 m atrás y llega a la pelota en ~1 s (antes 0,55 s desde 1,8 m: se veía apurado);
      la patada empieza 0,23 s antes del contacto.
   2) VUELO: la pelota con gravedad hasta su destino. En el tiro libre y el córner el arquero reacciona A LA PELOTA
      (0,16 s de reflejo); en el penal adivina un lado, como en la realidad.
   3) DESENLACE con física: el arquero retiene o da rebote (o la manda al córner), el palo devuelve, la barrera desvía,
      el primero despeja, el arquero sale a descolgar.
   4) LA JUGADA SIGUE con los 22 (la misma simulación del partido) hasta que la despejan, el arquero la retiene, sale,
      se rearma o hay GOL DE REBOTE (st.bpVivo: solo ahí un remate puede entrar). En la tanda no hay rebote (reglamento).
   El resultado del remate lo siguen decidiendo las funciones de siempre (doctor bp3d_misma_ley); el rebote, el doctor
   bp3d_jugada_sigue. */
const BP3D_VIVO={pGol:0.3, tope:9, despeje:24};   /* pGol: chance de un remate de rebote a 6 m (baja con la distancia) */
/* dónde parte la carrera y dónde pisa al pegarle (a la izquierda de la pelota: es diestro) */
function _bpCarrera(bola,dir,lejos,costado){
  const n=Math.hypot(dir.x,dir.z)||1, ux=dir.x/n, uz=dir.z/n, lx=uz, lz=-ux;   /* izquierda del que mira hacia u */
  return {ini:{x:bola.x-ux*lejos+lx*costado, z:bola.z-uz*lejos+lz*costado}, pie:{x:bola.x-ux*0.42+lx*0.28, z:bola.z-uz*0.42+lz*0.28}};
}
function _bpAnimar(jug,out,efecto){
  const S=jug.S, b=jug.bola, m=jug.mira, Z=BP3D.ARCO.z, gk=jug.idx.gkR>=0?S.jug[jug.idx.gkR]:null;
  let dest;
  if(jug.tipo==="corner") dest={x:m.x, y:1.9, z:m.z};
  else if(out.res==="palo"){ const lado=m.x>=0?1:-1; dest=Math.abs(m.x)>2.6?{x:lado*BP3D.ARCO.ancho,y:Math.min(Math.max(m.y,0.3),2.2),z:Z}:{x:m.x,y:BP3D.ARCO.alto,z:Z}; }
  else if(out.res==="barrera"){ const k=9.15/Math.max(9.2,Math.hypot(b.x,Z-b.z)); dest={x:b.x+(m.x-b.x)*k,y:1.7,z:b.z+(Z-b.z)*k}; }
  else dest={x:m.x,y:Math.max(0.12,m.y),z:Z};
  const D=Math.hypot(dest.x-b.x,dest.z-b.z), V=_bpVuelo(D,dest.y,_bpVel(jug.tipo,efecto,jug.pot)), T=V.T, vy=V.vy;
  /* el arquero: en el penal adivina (penArqueroTira); en el tiro libre y el córner va a la pelota. Si ataja, llega justo;
     si es gol o palo, se estira y no llega; a la barrera apenas se mueve */
  const reacciona=jug.tipo!=="penal";
  const ataja=!!gk&&(out.res==="atajado"||(jug.tipo==="corner"&&!!out.arquero));
  let kx;
  if(ataja) kx=dest.x;
  else if(reacciona) kx=(out.res==="gol"||out.res==="palo")?dest.x*0.62:(out.res==="barrera"?dest.x*0.25:dest.x*0.4);
  else kx=out.kdir==="izq"?2.4:(out.kdir==="der"?-2.4:0);
  const A=jug.anim={t:0, T:T, x0:b.x, z0:b.z, dest:dest, vy:vy, kx:kx, gk:gk, ataja:ataja, fase:"carrera", reaccion:reacciona?0.16:0, post:0, tc:0};
  /* la carrera: desde donde está parado hasta pisar al lado de la pelota, a ritmo de 3–4 pasos (≈1 s) */
  const pj=jug.idx.pat>=0?S.jug[jug.idx.pat]:null;
  if(pj){ const c=_bpCarrera(b,{x:dest.x-b.x,z:dest.z-b.z},0.42,0.28);
    A.c0={x:_bpWX(pj.y), z:_bpWZ(pj.x)}; A.c1=c.pie; A.tRun=Math.max(0.6,Math.min(1.35,Math.hypot(A.c1.x-A.c0.x,A.c1.z-A.c0.z)/3.3)); }
  else A.tRun=0.4;
  /* córner: va a cabecear el compañero más cerca del punto; el rival que lo marca salta con él; el arquero sale si va a él */
  if(jug.tipo==="corner"){ const cerca=(mio)=>{ let best=-1, bd=1e9; S.jug.forEach((p,i)=>{ if(p.mio!==mio||p.rol==="gk"||i===jug.idx.pat) return; const dd=Math.hypot(_bpWX(p.y)-dest.x,_bpWZ(p.x)-dest.z); if(dd<bd){ bd=dd; best=i; } }); return best; };
    jug.cab=cerca(true); jug.marca=cerca(false); if(jug.cab<0) jug.cab=null; if(jug.marca<0) jug.marca=null; }
  if(gk) S.pase={tiro:true, to:jug.idx.gkR, y1:_bpSY(kx), x1:_bpSX(Z), afuera:out.res==="afuera"};
}
function _bpPaso(jug,dt){
  const S=jug.S, A=jug.anim;
  if(jug.med) jug.med.pintar();
  /* los gestos (patada, cabezazo) avanzan aunque la simulación del partido esté quieta (en la jugada viva los avanza ella) */
  if(!A||(A.fase!=="vivo"&&A.fase!=="fin")) S.jug.forEach(p=>{ if(p._acc){ p._acc.t+=dt; if(p._acc.t>=p._acc.dur) p._acc=null; } });
  if(!A) return;
  const b=S.ball, pj=jug.idx.pat>=0?S.jug[jug.idx.pat]:null;
  if(A.fase==="carrera"){
    A.tc+=dt; const u=Math.min(1,A.tc/A.tRun), f=u*u*(3-2*u);
    if(pj&&A.c0){ const x0=_bpWX(pj.y), z0=_bpWZ(pj.x), x=A.c0.x+(A.c1.x-A.c0.x)*f, z=A.c0.z+(A.c1.z-A.c0.z)*f;
      pj.x=_bpSX(z); pj.y=_bpSY(x); const v=Math.hypot(x-x0,z-z0)/Math.max(dt,1e-3);
      pj._vel=Math.min(9,v)*0.14; pj._paso=(pj._paso||0)+Math.hypot(x-x0,z-z0)*2.4; _bpMirar(pj,jug.bola.x,jug.bola.z); }
    /* la patada empieza un poco antes del contacto (el gesto tiene su vuelta atrás) */
    if(pj&&!A.pateo&&A.tRun-A.tc<=0.23){ A.pateo=true; pj._acc={tipo:jug.tipo==="corner"?"centro":(jug.pot>=0.6?"remate":"patada"),t:0.1,dur:0.6}; }
    if(u>=1) A.fase="vuelo";
    return;
  }
  if(A.fase==="vuelo"){
    A.t+=dt; const u=Math.min(1,A.t/A.T), d=A.dest;
    const x=A.x0+(d.x-A.x0)*u, z=A.z0+(d.z-A.z0)*u, y=Math.max(0.11,0.11+A.vy*A.t-0.5*9.81*A.t*A.t);
    b.x=_bpSX(z); b.y=_bpSY(x); b.z=(y-0.11)/11;
    if(A.gk&&A.t>=A.reaccion){ A.gk._dive=Math.min(1,(A.gk._dive||0)+dt*(jug.tipo==="corner"?1.5:3.2));
      const gx=_bpWX(A.gk.y), k=Math.min(1,dt*(jug.tipo==="corner"?1.5:3)); A.gk.y=_bpSY(gx+(A.kx*0.55-gx)*k);
      if(jug.tipo==="corner"&&A.ataja){ const gz=_bpWZ(A.gk.x); A.gk.x=_bpSX(gz+((d.z+0.3)-gz)*k); } }
    if(pj) pj._vel=Math.max(0,(pj._vel||0)-dt*1.2);
    /* córner: el que va a cabecear corre al punto y salta cuando la pelota llega; el que lo marca salta con él */
    if(jug.tipo==="corner"){
      [[jug.cab,0],[jug.marca,0.9]].forEach(([ci,off])=>{ if(ci==null) return; const c=S.jug[ci], cx=_bpWX(c.y), cz=_bpWZ(c.x), k=Math.min(1,dt*2.2);
        c.x=_bpSX(cz+((d.z-off)-cz)*k); c.y=_bpSY(cx+((d.x+off*0.4)-cx)*k); c._vel=0.7; c._paso=(c._paso||0)+dt*11; c._ang=Math.atan2(d.x-cx,d.z-cz);
        if(!c._acc&&A.T-A.t<0.32) c._acc={tipo:off?"salto":"cabeza",t:0,dur:0.7,salto:off?0.25:0.35}; }); }
    if(u>=1) _bpDesenlace(jug);
    return;
  }
  if(A.fase==="sigue"){
    /* la pelota sigue con física (gol a la red, o en la tanda, el rebote que ya no vale) */
    A.post+=dt;
    if(typeof _cvFisicaPelota==="function") _cvFisicaPelota(S,dt);
    if(A.red&&_bpWZ(b.x)>BP3D.ARCO.z+1.6){ b.x=_bpSX(BP3D.ARCO.z+1.6); b.vx=0; b.vy*=0.3; }
    if(A.post>(A.red?2.2:1.6)&&!jug.fin) _bpTerminar(jug);
    return;
  }
  if(A.fase==="vivo"){
    const r=_bpVivoPaso(jug.vivo,S,dt); _bpVivoCamara(jug,dt);
    if(r){ jug.vivo.fin=r; A.fase="fin"; A.post=0; _bpCartel(jug,BP3D_FINES[r]||""); }
    return;
  }
  if(A.fase==="fin"){
    /* un respiro para ver cómo terminó (el gol de rebote, más) */
    A.post+=dt; _bpVivoCamara(jug,dt);
    if(jug.vivo&&jug.vivo.fin==="gol"&&typeof _cvFisicaPelota==="function"){ _cvFisicaPelota(S,dt); if(_bpWZ(b.x)>BP3D.ARCO.z+1.6){ b.x=_bpSX(BP3D.ARCO.z+1.6); b.vx=0; } }
    if(A.post>(jug.vivo&&jug.vivo.fin==="gol"?2.2:1.2)&&!jug.fin) _bpTerminar(jug);
  }
}
const BP3D_FINES={gol:"¡GOL DE REBOTE!", atrapa:"La retiene el arquero", despeje:"La saca la defensa", corner:"Al córner",
  lateral:"Lateral", arco:"Saque de arco", rearma:"Se rearma desde atrás", tiempo:"Se enfría la jugada"};
function _bpCartel(jug,txt,cls){
  if(!txt||!jug.capa) return;
  jug.capa.querySelectorAll(".bp3d-res").forEach(n=>n.remove());
  const ban=document.createElement("div"); ban.className="bp3d-res arco-res "+(cls||(txt.indexOf("GOL")>=0?"gol":"")); ban.textContent=txt; jug.capa.appendChild(ban);
}
function _bpDesenlace(jug){
  const S=jug.S, A=jug.anim, out=jug.out, b=S.ball, d=A.dest, gkI=jug.idx.gkR;
  const pat=(v)=>{ if(typeof _cvPatear==="function") _cvPatear(S,v[0],v[1],v[2]); else { b.vx=v[0]; b.vy=v[1]; b.vz=v[2]; } };
  let res=out.res;
  if(res==="palo"&&typeof paloEntra==="function"&&paloEntra(jug.aim||{},"colocado")){ res="palo_in"; }
  out.final=res;
  const gol=res==="gol"||res==="palo_in", sx=d.x>=0?1:-1;
  S.pase=null; S.own=-1; S.persigue=null; S.atajada=null;
  /* velocidades en el plano de la sim: vx a lo largo (+ = hacia el arco), vy a lo ancho (+ = x del mundo) */
  let det="";
  if(gol){ A.red=true; pat([16,(d.x-A.x0)*0.3,-1]); }
  else if(res==="atajado"){
    /* la retiene, la da al medio o la manda al córner (en el penal casi siempre da rebote: viene muy fuerte) */
    const r=Math.random(), retiene=r<(jug.tipo==="penal"?0.3:(jug.tipo==="tl"?0.5:0.65));
    if(retiene&&gkI>=0){ S.own=gkI; S.atajada={gk:gkI,t:3,z:0.12}; b.vx=b.vy=b.vz=0; det="retiene"; }
    else if(Math.random()<0.3){ pat([_bpRnd(1.5,3),sx*_bpRnd(5,8),_bpRnd(2.5,4)]); det="al córner"; }
    else { pat([-_bpRnd(4,9),sx*_bpRnd(2,7)*(Math.random()<0.75?1:-1),_bpRnd(0.5,3)]); det="rebote"; }
    S.ultToque=false;
  }
  else if(res==="palo"){
    /* el palo la devuelve a la cancha o la manda afuera; en el penal, el que pateó no puede tocarla primero */
    if(Math.random()<0.65){ pat([-_bpRnd(6,11),-sx*_bpRnd(1,5),_bpRnd(0.5,3)]); det="rebote"; } else { pat([_bpRnd(3,6),sx*_bpRnd(2,5),_bpRnd(1,3)]); det="afuera"; }
    S.ultToque=true; if(jug.tipo==="penal") S.noToca=jug.idx.pat;
  }
  else if(res==="barrera"){
    const r=Math.random(); S.ultToque=false;
    if(r<0.5){ pat([-_bpRnd(5,10),_bpRnd(-5,5),_bpRnd(1,4)]); det="rebote"; }
    else if(r<0.75){ pat([_bpRnd(4,8),(Math.random()<0.5?-1:1)*_bpRnd(3,6),_bpRnd(2,4)]); det="desvío"; }
    else { pat([-_bpRnd(10,16),_bpRnd(-4,4),_bpRnd(4,8)]); det="despeje"; }
  }
  else if(res==="defensa"){
    S.ultToque=false;
    if(out.arquero&&gkI>=0&&Math.random()<0.6){ S.own=gkI; S.atajada={gk:gkI,t:3,z:0.15}; b.vx=b.vy=b.vz=0; det="retiene"; }
    else { pat([-_bpRnd(11,17),_bpRnd(-6,6),_bpRnd(5,9)]); det="despeje"; }
  }
  else { pat([14,(d.x-A.x0)*0.2,1]); S.ultToque=true; det="afuera"; }   /* afuera: sigue de largo */
  out.det=det;
  /* cartel del resultado (el mismo texto de siempre) */
  const lab=(typeof _etiquetaArco==="function")?_etiquetaArco(res==="defensa"?"defensa":res):{t:res,cls:""};
  _bpCartel(jug,lab.t,lab.cls||"");
  if(gol||jug.opts.tanda){ A.fase="sigue"; A.post=0; return; }
  _bpVivoIniciar(jug); A.fase="vivo";
}
/* ---------- la jugada viva (pura: sin DOM ni WebGL, la usa también el doctor) ---------- */
function _bpVivoIniciar(jug){
  const S=jug.S;
  S.bpVivo={equipo:true, pGol:BP3D_VIVO.pGol*(jug.tipo==="penal"?0.85:0.55)}; S.golDentro=false; S.golDe=null; S.saque=null; S.seq=null;
  if(S.own>=0) S.prox=Math.max(S.prox||0,0.8);
  else S.persigue=[_cvMasCercano(S,true,S.ball.x,S.ball.y,true),_cvMasCercano(S,false,S.ball.x,S.ball.y,true)];
  S.jug.forEach(p=>{ if(p.rol!=="gk") p._dive=0; p.vx=p.vy=0; });
  jug.vivo={t:0, equipo:true};
}
function _bpVivoPaso(V,S,dt){
  V.t+=dt;
  _cvStep(null,dt,S);
  const b=S.ball, dGol=(1-b.x)*CV_FIS.L;   /* los del balón parado atacan hacia x=1 */
  if(S.golDentro){ if(V.golDe==null) V.golDe=S.golDe; V.tGol=(V.tGol||0)+dt; return V.tGol>0.35?"gol":null; }
  if(S.saque){ const q=S.saque; return q.tipo==="corner"?(q.equipo===V.equipo?"corner":"despeje"):(q.tipo==="lateral"?"lateral":"arco"); }
  const o=S.own>=0?S.jug[S.own]:null;
  if(o&&o.rol==="gk"&&o.mio!==V.equipo){ V.tArq=(V.tArq||0)+dt; if(V.tArq>0.7) return "atrapa"; } else V.tArq=0;
  if(dGol>BP3D_VIVO.despeje) return o&&o.mio===V.equipo?"rearma":"despeje";
  if(o&&o.mio!==V.equipo){ V.tDef=(V.tDef||0)+dt; if(V.tDef>1.8) return "despeje"; } else V.tDef=0;
  if(o&&o.mio===V.equipo&&dGol>18){ V.tAtq=(V.tAtq||0)+dt; if(V.tAtq>2.2) return "rearma"; } else V.tAtq=0;
  if(V.t>BP3D_VIVO.tope) return "tiempo";
  return null;
}
/* la cámara de la jugada viva: detrás de la pelota, mirando al arco, como la toma abierta de la tele */
function _bpVivoCamara(jug,dt){
  const c=jug.est&&jug.est.bp&&jug.est.bp.cam; if(!c) return;
  const b=jug.S.ball, bx=_bpWX(b.y), bz=_bpWZ(b.x), by=(b.z||0)*11, k=Math.min(1,dt*2.2);
  c.mira.x+=(bx-c.mira.x)*k; c.mira.y+=(Math.max(0.6,by*0.6)-c.mira.y)*k; c.mira.z+=(bz-c.mira.z)*k;
  const tx=bx*0.85, tz=Math.min(BP3D.ARCO.z-6,bz-14), ty=6.5;
  c.pos.x+=(tx-c.pos.x)*k*0.6; c.pos.y+=(ty-c.pos.y)*k*0.6; c.pos.z+=(tz-c.pos.z)*k*0.6; c.fov=42;
}
/* el jugador de verdad que hizo el gol de rebote: el pateador o el cabeceador si fue él; si no, uno del once según su puesto */
function _bpJugadorReal(jug,i){
  if(i===jug.idx.pat) return jug.pat;
  if(jug.tipo==="corner"&&i===jug.cab) return jug.cabeceador;
  const p=i!=null&&i>=0?jug.S.jug[i]:null, pos={fwd:"DEL",mid:"MED",def:"DEF"}[p&&p.rol]||"DEL";
  const once=(jug.P.once||[]).filter(j=>j&&j.pos!=="ARQ"&&!j.expulsado);
  const del=once.filter(j=>j.pos===pos);
  const l=del.length?del:once;
  return l.length?l[(Math.random()*l.length)|0]:{n:"un compañero",goles:0};
}
/* termina: si hubo gol, primero la repetición (cancha3d.js c3dRepetir); después se anota y la cancha vuelve */
function _bpTerminar(jug){
  if(jug.terminando||jug.fin) return; jug.terminando=true;
  const gol=!!(jug.out&&(jug.out.final==="gol"||jug.out.final==="palo_in"))||!!(jug.vivo&&jug.vivo.fin==="gol");
  if(gol&&!jug.opts.tanda&&typeof c3dRepetir==="function"&&c3dRepetir(jug.est,{alTerminar:function(){ _bpCerrar(jug,"listo"); }})) return;
  _bpCerrar(jug,"listo");
}
/* ---------- cerrar: anota el resultado igual que el balón parado de siempre y devuelve la cancha ---------- */
function _bpCerrar(jug,modo){
  if(jug.fin) return; jug.fin=true; clearTimeout(jug.vigila);
  document.removeEventListener("keydown",jug.tecla,true); document.removeEventListener("keyup",jug.teclaArriba,true);
  const est=jug.est, P=jug.P, S=jug.S;
  try{ est.scene.remove(jug.aro); est.scene.remove(jug.punto); jug.aro.geometry.dispose(); jug.punto.geometry.dispose(); jug.aro.material.dispose();
    if(jug.aroG){ est.scene.remove(jug.aroG); jug.aroG.geometry.dispose(); jug.aroG.material.dispose(); } }catch(e){}
  est.bp=null; BP3D.activo=null;
  /* la cancha vuelve a su lugar en la pantalla del partido */
  if(est.host&&est.host.isConnected){ est.host.appendChild(est.canvas); est.W0=0; }
  if(jug.capa.parentNode) jug.capa.remove();
  S.pase=null; S.bpVivo=null; S.golDentro=false; S.noToca=null;
  const res=jug.out?(jug.out.final||jug.out.res):null, esGol=res==="gol"||res==="palo_in";
  const V=jug.vivo, fin=modo==="solo"?null:(V&&V.fin), rebote=fin==="gol";
  let cadena=false;
  try{
    if(modo==="solo"||!res){
      /* "que se juegue solo": lo resuelve el partido como si no dirigieras */
      if(jug.tipo==="penal"){ if(typeof jug.opts.onRes==="function"){ jug.opts.onRes(typeof cobrarPenal==="function"?cobrarPenal(jug.pat,jug.ARQ):false); return; } penalEnPartido(P,true,null,jug.pat); }
      else if(jug.tipo==="tl"){ if(typeof tiroLibreAuto==="function") tiroLibreAuto(P); }
      else if(typeof centroCorner==="function") centroCorner(P);
    } else if(jug.tipo==="penal"){
      if(typeof jug.opts.onRes==="function"){ jug.opts.onRes(esGol); return; }
      const forz=esGol?true:(res==="afuera"?"afuera":(res==="palo"?"palo":false));
      penalEnPartido(P,true,null,jug.pat,forz);
    } else {
      const j=jug.tipo==="corner"?jug.cabeceador:jug.pat, tl=jug.tipo==="tl";
      if(esGol){
        j.goles=(j.goles||0)+1; P.goleadores.push(j.n);
        if(typeof regGol==="function") regGol(P,P.min,j.n,true,tl?"tiro libre":"cabeza");
        if(P.part.local)P.gl++; else P.gv++;
        if(typeof linea==="function") linea(P,P.min,(res==="palo_in"?"¡PALO ADENTRO de ":(tl?"¡GOLAZO de tiro libre de ":"¡GOL de cabeza de córner de "))+j.n+"! "+((typeof marcadorTxt==="function")?marcadorTxt(P):""),"gol");
      } else if(typeof linea==="function"){
        const txt=tl?(res==="barrera"?("Tiro libre de "+j.n+": la barrera la desvía."):(res==="palo"?("Tiro libre de "+j.n+" al palo."):(res==="afuera"?("Tiro libre de "+j.n+" por arriba del arco."):("Tiro libre de "+j.n+": el arquero la saca."))))
          :(res==="defensa"?(jug.out.arquero?("Córner de "+jug.pat.n+": sale el arquero y la descuelga."):("Córner: el primero despeja el centro de "+jug.pat.n+".")):(res==="afuera"?("Córner de "+jug.pat.n+": el centro se fue largo."):(res==="palo"?("Córner: el cabezazo de "+j.n+" se estrella en el palo."):("Córner: el arquero ataja el cabezazo de "+j.n+"."))));
        linea(P,P.min,txt);
      }
    }
    /* la jugada que siguió: gol de rebote (raro) o cómo terminó */
    if(modo!=="solo"&&!esGol&&fin){
      if(rebote){
        const g=_bpJugadorReal(jug,V.golDe);
        g.goles=(g.goles||0)+1; P.goleadores.push(g.n);
        if(typeof regGol==="function") regGol(P,P.min,g.n,true,"rebote");
        if(P.part.local)P.gl++; else P.gv++;
        if(typeof linea==="function") linea(P,P.min,"¡GOL de rebote de "+g.n+"! Nadie la sacaba y la empujó. "+((typeof marcadorTxt==="function")?marcadorTxt(P):""),"gol");
      } else if(typeof linea==="function"){
        const t={atrapa:"El arquero se queda con la segunda pelota.", despeje:"La defensa saca la segunda pelota.", corner:"La desvían: córner.",
          lateral:"La segunda pelota se va al lateral.", arco:"Se va por el fondo: saque de arco.", rearma:"Se rearma la jugada desde atrás.", tiempo:"La jugada se enfría."}[fin];
        if(t) linea(P,P.min,t);
        cadena=fin==="corner"&&(P._bpCadena||0)<2;
      }
    }
  } finally {
    const golFinal=esGol||rebote;
    /* el gol ya se vio en la cancha: que la simulación no lo repita como jugada, y saque del medio */
    if(S){ const mk=(typeof _cvMarcador==="function")?_cvMarcador(P):null; if(mk){ S.lastYo=mk.yo; S.lastOtro=mk.otro; }
      if(golFinal&&typeof _cvSaqueDelMedio==="function") _cvSaqueDelMedio(S,false);
      S.jug.forEach(p=>{ p._dive=0; }); }
    P._bpCadena=cadena?(P._bpCadena||0)+1:0;
    /* en la tanda manda onRes (él llama al próximo penal): reanudar acá patearía dos veces seguidas */
    if(typeof jug.opts.onRes!=="function"){
      if(typeof pintarPartido==="function") pintarPartido();
      /* la desviaron al córner: se cobra el córner (como en la cancha), si no se reanuda el partido */
      if(cadena&&typeof mostrarAccion==="function") setTimeout(function(){ if(P_ACTUAL===P&&!P.terminado) mostrarAccion({tipo:"corner",aFavor:true}); else if(typeof reanudarPronto==="function") reanudarPronto(); },700);
      else if(typeof reanudarPronto==="function") reanudarPronto();
    }
  }
}

/* ---------- enganche: con la cancha 3D, el balón parado dirigido se juega adentro ---------- */
(function(){
  const envolver=(nombre,tipo,args)=>{
    const o=window[nombre]; if(typeof o!=="function"||o._bp3d) return;
    const w=function(P,a,b){
      /* un repintado vuelve a pedir la misma jugada: si ya se está jugando en 3D, no se abre otra (contaba doble) */
      if(BP3D.activo&&P&&BP3D.activo.P===P) return true;
      if(bp3dDisponible()&&P){
        try{ return bp3dJugar(tipo,P,tipo==="penal"?Object.assign({},b||{},{pateador:a}):{}); }
        catch(e){ console.error("bp3d:",e); try{ if(BP3D.activo) _bpCerrar(BP3D.activo,"solo"); }catch(_){ } return true; }
      }
      /* sin 3D (o en 2D) sigue el balón parado de siempre: su escena aparte con _abrirEscenaArco */
      return o.apply(this,arguments);
    };
    Object.keys(o).forEach(k=>w[k]=o[k]); w._bp3d=true; w._orig=o; window[nombre]=w;
  };
  envolver("minijuegoPenal","penal");
  envolver("minijuegoTiroLibre","tl");
  envolver("minijuegoCorner","corner");
})();
if(typeof document!=="undefined"&&!document.getElementById("css-bp3d")){
  const st=document.createElement("style"); st.id="css-bp3d";
  st.textContent=
    ".bp3d-capa{position:fixed;inset:0;z-index:9000;background:#05101e;display:flex;flex-direction:column}"+
    ".bp3d-escena{position:relative;flex:1 1 auto;min-height:0;touch-action:none;cursor:crosshair}"+
    ".bp3d-escena>canvas{position:absolute;inset:0;width:100% !important;height:100% !important}"+
    ".bp3d-hud{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));"+
      "background:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.03) 50%,rgba(0,0,0,.2) 51%),#0d2a52;border-top:1px solid rgba(255,255,255,.35)}"+
    ".bp3d-tit{flex:1 1 100%;color:#eaf4ff;font-size:13px;line-height:1.35}.bp3d-tit b{color:#fff}"+
    ".bp3d-instr{display:block;opacity:.75;font-size:11.5px;margin-top:2px}"+
    ".bp3d-med{flex:1 1 260px;max-width:420px;padding:6px 10px 8px;border-radius:14px;background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.05) 48%,rgba(0,0,0,.18) 52%),rgba(8,30,62,.75);border:1px solid rgba(255,255,255,.45);box-shadow:inset 0 1px 0 rgba(255,255,255,.5)}"+
    ".bp3d-med-t{display:flex;justify-content:space-between;font:800 10px system-ui;letter-spacing:1px;color:#cfe6ff;text-transform:uppercase;margin-bottom:4px}"+
    ".bp3d-med-t b{letter-spacing:.5px}.bp3d-med-t b.flojo{color:#c9d3df}.bp3d-med-t b.bien{color:#8ef07c}.bp3d-med-t b.fuerte{color:#ffd166}.bp3d-med-t b.bestia{color:#ff7b6b}"+
    ".bp3d-med-b{position:relative;height:18px;border-radius:9px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.6)}"+
    ".bp3d-med-b .z{position:absolute;top:0;bottom:0}.bp3d-med-b .z.flojo{background:linear-gradient(180deg,#9aa7b6,#5f6b7a)}.bp3d-med-b .z.bien{background:linear-gradient(180deg,#b4f5a6,#3fbf3a 55%,#2f9e2c)}"+
    ".bp3d-med-b .z.fuerte{background:linear-gradient(180deg,#ffe9a6,#f0a020 55%,#d98a10)}.bp3d-med-b .z.bestia{background:linear-gradient(180deg,#ffb3a8,#d8352a 55%,#b52a20)}"+
    ".bp3d-med-b .aguja{position:absolute;top:-2px;bottom:-2px;width:4px;margin-left:-2px;background:#fff;border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.55),0 0 10px rgba(255,255,255,.9)}"+
    ".bp3d-med.parado .aguja{width:6px;margin-left:-3px;background:#fffbe0}"+
    ".bp3d-fila{display:flex;gap:6px;flex-wrap:wrap}"+
    ".bp3d-patear{flex:1 1 160px;min-height:46px;font-size:1.05rem}"+
    ".bp3d-res{position:absolute;left:50%;top:18%;transform:translateX(-50%);font-size:clamp(22px,6vw,40px);padding:6px 18px;border-radius:14px;z-index:2}";
  document.head.appendChild(st);
}
