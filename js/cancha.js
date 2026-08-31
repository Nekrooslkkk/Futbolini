"use strict";
/* ============================================================
   FUTBOLINI · cancha.js  (7.10 · cancha animada del partido)
   Canvas 2D puro (SIN librerías). Dibuja los dos equipos como puntos
   que se mueven según el empuje y el marcador del partido en vivo, con
   la pelota siguiendo la línea de juego. Las posiciones viven en este
   módulo, así que sobreviven a los re-render de pintarPartido().
   Se auto-detiene cuando el partido termina o el canvas sale del DOM.
   ============================================================ */

/* formación base de MI equipo (ataca hacia la derecha, x→1). mob = cuánto
   se desplaza con la línea de juego (los delanteros más, el arquero casi nada) */
const CANCHA_FORM=[
  {x:0.08,y:0.50,mob:0.10,rol:"gk"},
  {x:0.22,y:0.20,mob:0.35,rol:"def"},{x:0.22,y:0.40,mob:0.35,rol:"def"},
  {x:0.22,y:0.60,mob:0.35,rol:"def"},{x:0.22,y:0.80,mob:0.35,rol:"def"},
  {x:0.42,y:0.28,mob:0.60,rol:"mid"},{x:0.42,y:0.50,mob:0.60,rol:"mid"},{x:0.42,y:0.72,mob:0.60,rol:"mid"},
  {x:0.62,y:0.25,mob:0.85,rol:"fwd"},{x:0.62,y:0.50,mob:0.85,rol:"fwd"},{x:0.62,y:0.75,mob:0.88,rol:"fwd"}
];
let _cvSt=null, _cvRAF=0, _cvCanvas=null, _cvLast=0;

function _cvRnd(a,b){ return a+Math.random()*(b-a); }
function _cvMarcador(P){
  if(typeof miMarcador==="function"){ const m=miMarcador(P); return {yo:m[0],otro:m[1]}; }
  return P.part&&P.part.local!==false ? {yo:P.gl,otro:P.gv} : {yo:P.gv,otro:P.gl};
}
function _cvSeed(P){
  const jug=[];
  CANCHA_FORM.forEach(f=>{ jug.push({x:f.x,y:f.y,tx:f.x,ty:f.y,mob:f.mob,rol:f.rol,mio:true}); });
  CANCHA_FORM.forEach(f=>{ const x=1-f.x; jug.push({x:x,y:1-f.y,tx:x,ty:1-f.y,mob:f.mob*0.85,rol:f.rol,mio:false}); });
  _cvSt={ jug:jug, lop:0.5, surge:0, ball:{x:0.5,y:0.5,tx:0.5,ty:0.5},
    lastYo:P?_cvMarcador(P).yo:0, lastOtro:P?_cvMarcador(P).otro:0, t:0,
    ballHold:0, ballGoal:0.5 };
}
function _cvStep(P,dt){
  const st=_cvSt; if(!st) return;
  st.t+=dt;
  /* goles → la pelota vuela al arco correcto y la línea de juego se empuja */
  if(P){
    const mk=_cvMarcador(P);
    if(mk.yo>st.lastYo){ st.surge=1; st.ballHold=1.4; st.ballGoal=0.95; }    /* mi gol → arco rival (derecha) */
    if(mk.otro>st.lastOtro){ st.surge=-1; st.ballHold=1.4; st.ballGoal=0.05; } /* gol rival → mi arco (izquierda) */
    st.lastYo=mk.yo; st.lastOtro=mk.otro;
  }
  st.surge*=Math.pow(0.5,dt);
  if(st.ballHold>0) st.ballHold-=dt;
  /* línea de juego: sesgo suave por empuje + surge + vaivén LENTO (sin ruido por frame) */
  const empuje=(P&&typeof P.empuje==="number")?P.empuje:0;
  const bias=Math.max(-0.24,Math.min(0.24, empuje*0.02));
  const vaiven=Math.sin(st.t*0.4)*0.09;
  const lopT=Math.max(0.22,Math.min(0.78, 0.5+bias+vaiven+st.surge*0.22));
  st.lop += (lopT-st.lop)*Math.min(1,dt*1.1);
  const desp=st.lop-0.5;
  st.jug.forEach((p,i)=>{
    const f=CANCHA_FORM[i%CANCHA_FORM.length];
    const homeX=p.mio?f.x:(1-f.x), homeY=p.mio?f.y:(1-f.y);
    p.tx=Math.max(0.03,Math.min(0.97, homeX + desp*p.mob*1.4));
    p.ty=Math.max(0.06,Math.min(0.94, homeY + Math.sin(st.t*0.6+i)*0.015));
    /* SOLO easing, sin sumar ruido cada frame → deja de tiritar */
    p.x += (p.tx-p.x)*Math.min(1,dt*1.6);
    p.y += (p.ty-p.y)*Math.min(1,dt*1.6);
  });
  /* pelota: en un gol vuela al arco y se queda; si no, acompaña la línea de juego suave */
  const b=st.ball;
  if(st.ballHold>0){ b.tx=st.ballGoal; b.ty=0.5+Math.sin(st.t*3)*0.03; }
  else { b.tx=st.lop + Math.sin(st.t*0.8)*0.02; b.ty=0.5 + Math.sin(st.t*0.5+2)*0.12; }
  const kb=st.ballHold>0?6:2.4;
  b.x += (b.tx-b.x)*Math.min(1,dt*kb);
  b.y += (b.ty-b.y)*Math.min(1,dt*kb);
}
function _cvColores(){
  let mio="#f4f7ff", riv="#ff5a5a";
  try{ const ic=(typeof infoClub==="function")&&infoClub(E.club); if(ic&&ic.color) mio=ic.color; }catch(e){}
  return {mio:mio, riv:riv};
}
function _cvDraw(ctx,w,h){
  const st=_cvSt; if(!st) return;
  const X=x=>Math.round(x*w), Y=y=>Math.round(y*h);
  /* césped con franjas */
  ctx.fillStyle="#2f9e3a"; ctx.fillRect(0,0,w,h);
  for(let i=0;i<8;i++){ ctx.fillStyle=i%2?"#33ab3f":"#2c9636"; ctx.fillRect(Math.round(i*w/8),0,Math.ceil(w/8),h); }
  /* líneas */
  ctx.strokeStyle="rgba(255,255,255,.85)"; ctx.lineWidth=Math.max(1,w*0.004);
  const m=w*0.03;
  ctx.strokeRect(m,m,w-2*m,h-2*m);
  ctx.beginPath(); ctx.moveTo(w/2,m); ctx.lineTo(w/2,h-m); ctx.stroke();
  ctx.beginPath(); ctx.arc(w/2,h/2,h*0.13,0,Math.PI*2); ctx.stroke();
  /* áreas */
  const ah=h*0.44, aw=w*0.13;
  ctx.strokeRect(m,(h-ah)/2,aw,ah); ctx.strokeRect(w-m-aw,(h-ah)/2,aw,ah);
  /* arcos */
  ctx.fillStyle="rgba(255,255,255,.9)";
  ctx.fillRect(m-w*0.012,(h-h*0.16)/2,w*0.012,h*0.16);
  ctx.fillRect(w-m,(h-h*0.16)/2,w*0.012,h*0.16);
  /* jugadores */
  const col=_cvColores(), r=Math.max(3,w*0.011);
  st.jug.forEach(p=>{
    ctx.beginPath(); ctx.arc(X(p.x),Y(p.y),r,0,Math.PI*2);
    ctx.fillStyle=p.mio?col.mio:col.riv; ctx.fill();
    ctx.lineWidth=1; ctx.strokeStyle="rgba(0,0,0,.55)"; ctx.stroke();
  });
  /* pelota */
  const b=st.ball;
  ctx.beginPath(); ctx.arc(X(b.x),Y(b.y),Math.max(2.2,r*0.7),0,Math.PI*2);
  ctx.fillStyle="#fff"; ctx.fill(); ctx.strokeStyle="rgba(0,0,0,.7)"; ctx.lineWidth=1; ctx.stroke();
}
function _cvSize(canvas){
  const cssW=canvas.clientWidth||canvas.parentNode&&canvas.parentNode.clientWidth||320;
  const cssH=Math.min(200,Math.round(cssW*0.42));
  const dpr=Math.min(2,window.devicePixelRatio||1);
  if(canvas._w!==cssW){ canvas.style.height=cssH+"px"; canvas.width=Math.round(cssW*dpr); canvas.height=Math.round(cssH*dpr); canvas._w=cssW; }
  return {w:canvas.width, h:canvas.height};
}
function _cvFrame(ts){
  const canvas=_cvCanvas;
  if(!canvas || canvas!==_cvCanvas) return;
  if(!canvas.isConnected || !P_ACTUAL){ _cvRAF=0; return; }
  const dt=Math.min(0.05,(ts-_cvLast)/1000||0.016); _cvLast=ts;
  const P=P_ACTUAL;
  _cvStep(P,dt);
  _cvSize(canvas);
  _cvDraw(canvas.getContext("2d"), canvas.width, canvas.height);
  if(!P.terminado) _cvRAF=requestAnimationFrame(_cvFrame);
  else _cvRAF=0;
}
/* API: montar el canvas en el partido actual (llamado desde pintarPartido) */
function montarCancha(canvas){
  if(!canvas || typeof P_ACTUAL==="undefined") return;
  if(!_cvSt || _cvSt._P!==P_ACTUAL){ _cvSeed(P_ACTUAL); if(_cvSt) _cvSt._P=P_ACTUAL; }
  _cvCanvas=canvas;
  if(_cvRAF) cancelAnimationFrame(_cvRAF);
  _cvSize(canvas);
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(reduce){ _cvStep(P_ACTUAL,0.016); _cvDraw(canvas.getContext("2d"),canvas.width,canvas.height); _cvRAF=0; return; }
  _cvLast=performance.now(); _cvRAF=requestAnimationFrame(_cvFrame);
}
function detenerCancha(){ if(_cvRAF) cancelAnimationFrame(_cvRAF); _cvRAF=0; _cvCanvas=null; _cvSt=null; }
