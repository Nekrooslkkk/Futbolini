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
  let mio="#eef3ff", riv="#e5484d";
  try{ const ic=(typeof infoClub==="function")&&infoClub(E.club); if(ic&&ic.color) mio=ic.color; }catch(e){}
  return {mio:mio, riv:riv};
}
/* oscurece un color hex un factor (0..1) para dar sombra pixel */
function _cvSombra(hex,f){
  try{
    let s=String(hex).replace("#","");
    if(s.length===3) s=s[0]+s[0]+s[1]+s[1]+s[2]+s[2];
    const r=parseInt(s.slice(0,2),16), g=parseInt(s.slice(2,4),16), b=parseInt(s.slice(4,6),16);
    const k=x=>Math.max(0,Math.round(x*(1-f)));
    return "rgb("+k(r)+","+k(g)+","+k(b)+")";
  }catch(e){ return hex; }
}
/* buffer de BAJA resolución: dibujamos acá y después escalamos con nearest-neighbor
   (imageSmoothingEnabled=false) para que se vea pixel-art de verdad. */
let _cvBuf=null;
function _cvBuffer(w,h){
  const pw=Math.max(96,Math.min(220,Math.round(w/4)));   /* ~4 px reales por pixel del juego */
  const ph=Math.round(pw*(h/w));
  if(!_cvBuf || _cvBuf.w!==pw || _cvBuf.h!==ph){
    const c=document.createElement("canvas"); c.width=pw; c.height=ph;
    _cvBuf={c:c, ctx:c.getContext("2d"), w:pw, h:ph};
  }
  return _cvBuf;
}
function _cvSprite(g,px,py,shirt,sombra){
  /* jugadorcito ~4x5 px: cabeza, camiseta y una fila de sombra */
  g.fillStyle="#1c1c22"; g.fillRect(px-2,py+3,4,1);            /* sombra al piso */
  g.fillStyle=sombra;    g.fillRect(px-1,py-1,3,4);            /* contorno/short oscuro */
  g.fillStyle=shirt;     g.fillRect(px-1,py-1,3,2);            /* camiseta */
  g.fillStyle="#e6b17e"; g.fillRect(px,  py-3,1,2);            /* cabeza */
}
function _cvDraw(ctx,w,h){
  const st=_cvSt; if(!st) return;
  const buf=_cvBuffer(w,h), g=buf.ctx, bw=buf.w, bh=buf.h;
  const X=x=>Math.round(x*bw), Y=y=>Math.round(y*bh);
  /* césped a franjas pixeladas */
  for(let i=0;i<10;i++){ g.fillStyle=i%2?"#3aa049":"#2f8f3f"; g.fillRect(Math.round(i*bw/10),0,Math.ceil(bw/10)+1,bh); }
  /* líneas blancas (1 px del buffer = chunky al escalar) */
  const line="#dff0df"; g.fillStyle=line;
  const m=Math.round(bw*0.03);
  const rect=(x,y,ww,hh)=>{ g.fillRect(x,y,ww,1); g.fillRect(x,y+hh-1,ww,1); g.fillRect(x,y,1,hh); g.fillRect(x+ww-1,y,1,hh); };
  rect(m,m,bw-2*m,bh-2*m);                                    /* borde */
  g.fillRect(Math.round(bw/2),m,1,bh-2*m);                    /* mitad */
  /* círculo central pixelado */
  const cr=Math.round(bh*0.16), cx=Math.round(bw/2), cy=Math.round(bh/2);
  for(let a=0;a<64;a++){ const an=a/64*Math.PI*2; g.fillRect(cx+Math.round(Math.cos(an)*cr), cy+Math.round(Math.sin(an)*cr),1,1); }
  g.fillRect(cx,cy,1,1);
  /* áreas */
  const ah=Math.round(bh*0.46), aw=Math.round(bw*0.12);
  rect(m,Math.round((bh-ah)/2),aw,ah); rect(bw-m-aw,Math.round((bh-ah)/2),aw,ah);
  /* arcos */
  const gh=Math.round(bh*0.16);
  g.fillStyle="#ffffff";
  g.fillRect(m-2,Math.round((bh-gh)/2),2,gh); g.fillRect(bw-m,Math.round((bh-gh)/2),2,gh);
  /* jugadores como sprites */
  const col=_cvColores();
  const shMio=_cvSombra(col.mio,0.45), shRiv=_cvSombra(col.riv,0.45);
  st.jug.forEach(p=>_cvSprite(g, X(p.x), Y(p.y), p.mio?col.mio:col.riv, p.mio?shMio:shRiv));
  /* pelota: cuadradito blanco con un pixel de sombra */
  const b=st.ball, bx=X(b.x), by=Y(b.y);
  g.fillStyle="#12140f"; g.fillRect(bx,by+1,2,1);
  g.fillStyle="#ffffff"; g.fillRect(bx,by-1,2,2);
  /* escalar el buffer al canvas real SIN suavizado → pixel-art */
  ctx.imageSmoothingEnabled=false; ctx.msImageSmoothingEnabled=false;
  ctx.clearRect(0,0,w,h);
  ctx.drawImage(buf.c,0,0,bw,bh,0,0,w,h);
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
