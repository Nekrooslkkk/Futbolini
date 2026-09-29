"use strict";
/* ============================================================
   FUTBOLINI · cancha.js  (7.9047 · cancha cenital reconstruida)
   Antes: pixel-art de un buffer de 200 px (puntos que tiritaban).
   Ahora: vista cenital tipo transmisión/flash, vectorial y nítida.
   - El césped y las líneas se dibujan UNA vez en un canvas aparte
     (caché por tamaño); cada cuadro solo mueve jugadores y pelota.
   - La pelota tiene dueño y se mueve con pases de verdad; quién la
     tiene sale del dominio del motor (P.dom) y del empuje.
   - Cada gol se muestra como REPETICIÓN: la jugada que termina en la red.
   - 30 cuadros por segundo en modo liviano; se pausa si la pestaña no
     se ve; se detiene sola si el canvas sale del DOM.
   API pública (no cambiar): montarCancha(canvas), detenerCancha(),
   cvRepeticionGol(canvas, gol, lado). Estado en _cvSt.
   ============================================================ */

/* formación base de MI equipo (ataca hacia la derecha, x→1). mob = cuánto
   acompaña la línea de juego (los delanteros más, el arquero casi nada) */
const CANCHA_FORM=[
  {x:0.05,y:0.50,mob:0.05,rol:"gk"},
  {x:0.22,y:0.16,mob:0.40,rol:"def"},{x:0.20,y:0.38,mob:0.35,rol:"def"},
  {x:0.20,y:0.62,mob:0.35,rol:"def"},{x:0.22,y:0.84,mob:0.40,rol:"def"},
  {x:0.42,y:0.28,mob:0.60,rol:"mid"},{x:0.40,y:0.50,mob:0.55,rol:"mid"},{x:0.42,y:0.72,mob:0.60,rol:"mid"},
  {x:0.62,y:0.20,mob:0.80,rol:"fwd"},{x:0.66,y:0.50,mob:0.85,rol:"fwd"},{x:0.62,y:0.80,mob:0.80,rol:"fwd"}
];
let _cvSt=null, _cvRAF=0, _cvCanvas=null, _cvLast=0, _cvFondo=null;

function _cvRnd(a,b){ return a+Math.random()*(b-a); }
function _cvCl(v,a,b){ return v<a?a:(v>b?b:v); }
function _cvMarcador(P){
  if(typeof miMarcador==="function"){ const m=miMarcador(P); return {yo:m[0],otro:m[1]}; }
  return P.part&&P.part.local!==false ? {yo:P.gl,otro:P.gv} : {yo:P.gv,otro:P.gl};
}
/* la formación que elegiste (4-3-3, 5-3-2…) se ve en la cancha */
function _cvFormacion(){
  const f=(typeof E!=="undefined"&&E&&E.tactica&&E.tactica.form)||"4-4-2";
  const n=String(f).split("-").map(x=>parseInt(x,10)).filter(x=>x>0);
  if(n.reduce((a,b)=>a+b,0)!==10) return CANCHA_FORM;
  const xs=n.length===3?[0.21,0.41,0.63]:[0.21,0.36,0.50,0.64];
  const mobs=n.length===3?[0.36,0.58,0.84]:[0.36,0.52,0.66,0.84];
  const rol=i=>i===0?"def":(i===n.length-1?"fwd":"mid");
  const out=[CANCHA_FORM[0]];
  n.forEach((k,i)=>{ for(let j=0;j<k;j++){ const y=k===1?0.5:0.14+0.72*j/(k-1); out.push({x:xs[i]+(Math.abs(y-0.5)>0.3&&i===0?0.02:0),y:y,mob:mobs[i],rol:rol(i)}); } });
  return out;
}
function _cvNuevoEstado(P){
  const form=_cvFormacion(), jug=[];
  form.forEach((f,i)=>jug.push({x:f.x,y:f.y,hx:f.x,hy:f.y,mob:f.mob,rol:f.rol,mio:true,num:i+1}));
  CANCHA_FORM.forEach((f,i)=>jug.push({x:1-f.x,y:1-f.y,hx:f.x,hy:1-f.y,mob:f.mob*0.9,rol:f.rol,mio:false,num:i+1}));
  const mk=P?_cvMarcador(P):{yo:0,otro:0};
  return { jug:jug, ball:{x:0.5,y:0.5,z:0}, own:9, pase:null, prox:0.8, t:0,
    lastYo:mk.yo, lastOtro:mk.otro, seq:null, redVibra:0, redLado:0,
    penalSeq:0, penalDive:0, penalSeen:0, cartel:null };
}
function _cvSeed(P){ _cvSt=_cvNuevoEstado(P); }
/* dominio actual (−1..1) desde el motor: quién tiene más la pelota */
function _cvDominio(P){
  if(!P) return 0;
  const d=(P.dom&&P.dom.length)?P.dom[P.dom.length-1].v:0;
  return _cvCl(d+((typeof P.empuje==="number")?P.empuje*0.02:0),-1,1);
}
/* coordenada "de ataque" de un equipo: 0 = su arco, 1 = el arco rival */
function _cvA(p,x){ return p.mio?x:1-x; }
function _cvX(mio,a){ return mio?a:1-a; }
function _cvPasar(st,to,x1,y1,vel){
  const b=st.ball, d=Math.hypot(x1-b.x,(y1-b.y)*0.65);
  st.pase={x0:b.x,y0:b.y,x1:x1,y1:y1,t:0,dur:_cvCl(d/(vel||0.62),0.22,1.2),to:to};
  st.own=-1;
}
function _cvMasCercano(st,mio,x,y,sinArq){
  let best=-1, bd=9;
  st.jug.forEach((p,i)=>{ if(p.mio!==mio||(sinArq&&p.rol==="gk")) return; const d=Math.hypot(p.x-x,(p.y-y)*0.65); if(d<bd){ bd=d; best=i; } });
  return best;
}
/* el dueño decide: pase (con chance de intercepción) o remate si está cerca del arco */
function _cvDecidir(st,P){
  const o=st.jug[st.own]; if(!o) return;
  const dom=_cvDominio(P)*(o.mio?1:-1);
  const a=_cvA(o,o.x);
  if(a>0.8 && Math.random()<0.45){
    const gk=_cvMasCercano(st,!o.mio,_cvX(o.mio,1),0.5,false);
    const afuera=Math.random()<0.4;
    _cvPasar(st,gk,_cvX(o.mio,afuera?1.02:0.985),0.5+_cvRnd(afuera?0.08:-0.05,afuera?0.14:0.05)*(Math.random()<0.5?-1:1),1.3);
    if(st.pase) st.pase.tiro=true;   /* 7.9111 · el arquero se estira a buscarla */
    return;
  }
  /* 7.9111 · a veces encara: conduce hacia adelante un rato en vez de soltarla al tiro */
  if(a<0.74 && !(st.conduce>0) && Math.random()<0.3){ st.conduce=_cvRnd(0.7,1.5); st.prox=st.conduce+0.05; st._zig=Math.random()*6; return; }
  const comp=st.jug.map((p,i)=>({p:p,i:i})).filter(c=>c.p.mio===o.mio&&c.i!==st.own&&c.p.rol!=="gk");
  const peso=c=>{ const da=_cvA(c.p,c.p.x)-a, dist=Math.hypot(c.p.x-o.x,(c.p.y-o.y)*0.65);
    return Math.exp(da*3.2)*(dist<0.06?0.2:1)*(dist>0.42?0.3:1); };
  let tot=0; comp.forEach(c=>{ c.w=peso(c); tot+=c.w; });
  let r=Math.random()*tot, elegido=comp[0];
  for(const c of comp){ r-=c.w; if(r<=0){ elegido=c; break; } }
  if(!elegido) return;
  const pInt=_cvCl(0.17-dom*0.1,0.05,0.32);
  if(Math.random()<pInt){
    const mx=(o.x+elegido.p.x)/2, my=(o.y+elegido.p.y)/2;
    _cvPasar(st,_cvMasCercano(st,!o.mio,mx,my,true),mx,my);
  } else _cvPasar(st,elegido.i,elegido.p.x+(o.mio?0.02:-0.02),elegido.p.y);
}
/* velocidad tope: nadie se teletransporta ni tirita */
function _cvMover(p,tx,ty,vmax,dt){
  const x0=p.x, y0=p.y;
  const dx=tx-p.x, dy=ty-p.y, d=Math.hypot(dx,dy), paso=vmax*dt;
  if(d<=paso||d<1e-5){ p.x=tx; p.y=ty; }
  else { const k=paso/d*Math.min(1,0.35+d*6); p.x+=dx*k; p.y+=dy*k; }
  _cvAnimar(p,x0,y0,dt);
}
/* 7.9111 · para el dibujo cenital: hacia dónde mira, qué tan rápido va y en qué parte de la zancada está */
function _cvAnimar(p,x0,y0,dt){
  if(!(dt>0)) return;
  const mx=(p.x-x0)*105, my=(p.y-y0)*68, m=Math.hypot(mx,my), v=m/dt;   /* metros y m/s */
  p._vel=(p._vel||0)*0.8+Math.min(9,v)*0.2*0.14;
  p._paso=((p._paso||0)+m*2.4)%(Math.PI*2);
  if(m>0.004){ const a=Math.atan2(my,mx), da=Math.atan2(Math.sin(a-(p._ang||0)),Math.cos(a-(p._ang||0))); p._ang=(p._ang||0)+da*Math.min(1,dt*9); }
}
function _cvJuego(st,P,dt){
  const b=st.ball;
  /* pelota: en vuelo o pegada al pie del dueño */
  if(st.pase){
    const s=st.pase; s.t+=dt;
    const k=_cvCl(s.t/s.dur,0,1), e=1-Math.pow(1-k,2);
    b.x=s.x0+(s.x1-s.x0)*e; b.y=s.y0+(s.y1-s.y0)*e; b.z=Math.sin(k*Math.PI)*(s.dur>0.7?0.5:0.15);
    if(k>=1){ st.own=s.to>=0?s.to:_cvMasCercano(st,true,b.x,b.y,false); st.pase=null; b.z=0; st.prox=_cvRnd(0.7,1.5); }
  } else if(st.own>=0){
    const o=st.jug[st.own];
    b.x+=(o.x+_cvX(o.mio,0.012)-b.x)*Math.min(1,dt*10); b.y+=(o.y-b.y)*Math.min(1,dt*10); b.z=0;
    st.prox-=dt; if(st.prox<=0) _cvDecidir(st,P);
  } else { st.own=_cvMasCercano(st,true,b.x,b.y,true); }
  const dueno=st.own>=0?st.jug[st.own]:null;
  const ataca=dueno?dueno.mio:(st.pase?(st.jug[st.pase.to]||{}).mio:true);
  const presT=!ataca, pres=_cvMasCercano(st,presT,b.x,b.y,true);
  st.jug.forEach((p,i)=>{
    const bA=_cvA(p,b.x), suyo=(p.mio===ataca);
    let a=p.hx*0.86+(bA-0.5)*0.55*p.mob+(suyo?0.07:-0.03);
    let y=p.hy+(b.y-0.5)*0.32;
    if(p.rol==="gk"){ a=_cvCl(0.03+(bA<0.3?0.03:0),0.02,0.08); y=0.5+(b.y-0.5)*0.35; }
    let tx=_cvX(p.mio,_cvCl(a,0.02,0.95)), ty=_cvCl(y,0.05,0.95), v=0.13;
    if(i===st.own && p.rol==="gk"){ tx=p.x; ty=p.y; v=0; if(st.prox>0.7) st.prox=0.7; }
    else if(i===st.own && st.conduce>0){ tx=_cvX(p.mio,_cvCl(_cvA(p,p.x)+0.16,0,0.9)); ty=_cvCl(p.y+Math.sin(st.t*3+(st._zig||0))*0.05+(0.5-p.y)*0.1,0.06,0.94); v=0.15; }
    else if(i===st.own){ tx=_cvX(p.mio,_cvCl(_cvA(p,p.x)+0.08,0,0.86)); ty=p.y+(0.5-p.y)*0.15; v=0.08; }
    else if(st.pase && st.pase.tiro && i===st.pase.to && p.rol==="gk"){ tx=p.x; ty=_cvCl(st.pase.y1,0.42,0.58); v=0.34; p._dive=Math.min(1,(p._dive||0)+dt*5); }
    else if(i===pres && st.own>=0){ tx=b.x; ty=b.y; v=0.17; }
    else if(st.pase && i===st.pase.to){ tx=st.pase.x1; ty=st.pase.y1; v=0.2; }
    if(p._dive>0&&!(st.pase&&st.pase.tiro&&i===st.pase.to)) p._dive=Math.max(0,p._dive-dt*1.6);
    _cvMover(p,tx,ty,v,dt);
  });
  if(st.conduce>0) st.conduce-=dt;
  if(st.own<0||st.pase) st.conduce=0;
  _cvSeparar(st.jug,dt);
}
/* nadie se para encima de otro: empuje suave entre jugadores muy juntos */
function _cvSeparar(J,dt){
  const min=0.032;
  for(let i=0;i<J.length;i++) for(let j=i+1;j<J.length;j++){
    const a=J[i], b=J[j], dx=b.x-a.x, dy=(b.y-a.y)*0.65, d=Math.hypot(dx,dy);
    if(d>=min) continue;
    const k=(min-(d||0.001))*Math.min(1,dt*6)*0.5, ux=d?dx/d:1, uy=d?dy/d:0;
    a.x-=ux*k; a.y-=uy*k/0.65; b.x+=ux*k; b.y+=uy*k/0.65;
  }
}
/* ---------- REPETICIÓN del gol: la jugada que termina en la red ---------- */
function _cvArmarGol(st,lado,quien,min){
  const mio=lado>0, J=st.jug;
  const del=J.map((p,i)=>({p:p,i:i})).filter(c=>c.p.mio===mio&&c.p.rol!=="gk");
  const porRol=r=>del.filter(c=>c.p.rol===r);
  const A=(porRol("mid")[0]||del[0]).i, B=(porRol("fwd")[0]||del[1]).i, C=(porRol("fwd")[1]||porRol("fwd")[0]||del[2]).i;
  const ala=Math.random()<0.5?0.17:0.83, fin=0.47+Math.random()*0.06, dur=mio?3.4:2.6;
  const W=[{a:0.52,y:0.5},{a:0.76,y:ala},{a:0.86,y:0.5+(Math.random()-0.5)*0.12},{a:1.012,y:fin}];
  st.seq={tipo:"gol",lado:lado,t:0,dur:dur,mio:mio,A:A,B:B,C:C,W:W,
    cartel:(mio?"⚽ ":"Gol rival · ")+(quien||"")+(min?" "+min+"'":"")};
  const pA=J[A]; pA.x=_cvX(mio,W[0].a); pA.y=W[0].y;
  st.ball.x=pA.x; st.ball.y=pA.y; st.pase=null; st.own=-1;
}
function _cvPasoGol(st,dt){
  const s=st.seq, J=st.jug, b=st.ball, mio=s.mio; s.t+=dt;
  const T=s.t/s.dur*3.2;                         /* tramos: 0–1 pase, 1–1,9 centro, 1,9–2,3 remate, resto festejo */
  const W=s.W, P=(w)=>({x:_cvX(mio,w.a),y:w.y});
  const lerp=(p,q,k)=>({x:p.x+(q.x-p.x)*k,y:p.y+(q.y-p.y)*k});
  const w0=P(W[0]),w1=P(W[1]),w2=P(W[2]),w3=P(W[3]);
  let pos;
  if(T<1){ pos=lerp(w0,w1,T); b.z=Math.sin(T*Math.PI)*0.12; }
  else if(T<1.9){ const k=(T-1)/0.9; pos=lerp(w1,w2,k); b.z=Math.sin(k*Math.PI)*0.45; }
  else if(T<2.3){ const k=(T-1.9)/0.4; pos=lerp(w2,w3,k); b.z=0.05; }
  else { pos=w3; b.z=0; if(!s.red){ s.red=true; st.redVibra=1; st.redLado=mio?1:-1; } }
  b.x=pos.x; b.y=pos.y;
  _cvMover(J[s.B],w1.x,w1.y,0.34,dt);
  _cvMover(J[s.C],w2.x,w2.y,0.3,dt);
  const gk=_cvMasCercano(st,!mio,_cvX(!mio,0.03),0.5,false);
  if(gk>=0){ const g=J[gk]; const ty=T>1.95?b.y+(b.y>0.5?-0.06:0.06):0.5+(b.y-0.5)*0.4; _cvMover(g,_cvX(!mio,0.035),ty,T>1.95?0.5:0.15,dt); }
  J.forEach((p,i)=>{ if(i===s.B||i===s.C||i===gk) return;
    const bA=_cvA(p,b.x); _cvMover(p,_cvX(p.mio,_cvCl(p.hx*0.85+(bA-0.5)*0.5*p.mob+(p.mio===mio?0.08:-0.06),0.03,0.93)),_cvCl(p.hy+(b.y-0.5)*0.3,0.05,0.95),0.14,dt); });
  if(s.t>=s.dur){ st.seq=null; if(!s.sinSaque) _cvSaqueDelMedio(st,!mio); }
}
function _cvSaqueDelMedio(st,mioSaca){
  st.jug.forEach(p=>{ p.x=_cvX(p.mio,Math.min(p.hx,0.46)); p.y=p.hy; });
  const del=st.jug.findIndex(p=>p.mio===mioSaca&&p.rol==="fwd");
  st.ball.x=0.5; st.ball.y=0.5; st.ball.z=0; st.pase=null;
  if(del>=0){ st.jug[del].x=_cvX(mioSaca,0.49); st.jug[del].y=0.5; st.own=del; }
  st.prox=0.9;
}
/* ---------- penal: la pelota al punto y el arquero se lanza ---------- */
function _cvPasoPenal(st,dt){
  const lado=st.penalSeen>0, b=st.ball;
  st.penalDive=Math.max(0,st.penalDive-dt);
  const k=1-st.penalDive/1.6;
  const spot=_cvX(lado,0.895);
  if(k<0.45){ b.x=spot; b.y=0.5; }
  else { const e=Math.min(1,(k-0.45)/0.3); b.x=spot+(_cvX(lado,1.0)-spot)*e; b.y=0.5+(st._penY||0.06)*e; }
  const gk=_cvMasCercano(st,!lado,_cvX(!lado,0.03),0.5,false);
  if(gk>=0){ const g=st.jug[gk]; g.x=_cvX(!lado,0.03); if(k>0.45) g.y+=((0.5-(st._penY||0.06)*1.4)-g.y)*Math.min(1,dt*8); }
  if(st.penalDive<=0){ st.own=gk; st.pase=null; }
}
function _cvStep(P,dt,stOpc){
  const st=stOpc||_cvSt; if(!st) return;
  st.t+=dt; st._dtCam=dt;
  if(st._avisoCam>0) st._avisoCam-=dt;
  const bx0=st.ball.x, by0=st.ball.y;
  if(st.redVibra>0) st.redVibra=Math.max(0,st.redVibra-dt*1.1);
  if(P && !stOpc){
    const mk=_cvMarcador(P);
    const ult=(P.golesDetalle||[]).slice(-1)[0]||{};
    if(mk.yo>st.lastYo) _cvArmarGol(st,1,ult.quien,ult.min);
    else if(mk.otro>st.lastOtro) _cvArmarGol(st,-1,ult.quien,ult.min);
    st.lastYo=mk.yo; st.lastOtro=mk.otro;
    if(P._penalSeq && st.penalSeq!==P._penalSeq && !st.seq){
      st.penalSeq=P._penalSeq; st.penalSeen=P._penalCancha||1; st.penalDive=1.6; st._penY=(Math.random()<0.5?-1:1)*_cvRnd(0.03,0.07);
    }
  }
  if(st.seq) _cvPasoGol(st,dt);
  else if(st.penalDive>0) _cvPasoPenal(st,dt);
  else _cvJuego(st,P,dt);
  /* los quietos miran la pelota (no quedan de espaldas a la jugada) */
  st.jug.forEach(p=>{ if((p._vel||0)<0.05){ const a=Math.atan2((st.ball.y-p.y)*68,(st.ball.x-p.x)*105), da=Math.atan2(Math.sin(a-(p._ang||0)),Math.cos(a-(p._ang||0))); p._ang=(p._ang||0)+da*Math.min(1,dt*4); } });
  st._rodado=((st._rodado||0)+Math.hypot((st.ball.x-bx0)*105,(st.ball.y-by0)*68)*1.6)%(Math.PI*2);
}
/* ---------- colores de camiseta (si chocan, el rival va de alternativa) ---------- */
function _cvHex(c){ let s=String(c||"").replace("#",""); if(s.length===3) s=s[0]+s[0]+s[1]+s[1]+s[2]+s[2]; const n=parseInt(s,16); return isNaN(n)?[200,200,200]:[(n>>16)&255,(n>>8)&255,n&255]; }
function _cvColores(P){
  let mio="#eef3ff", riv="#e5484d";
  try{ const ic=(typeof infoClub==="function")&&infoClub(E.club); if(ic&&ic.color) mio=ic.color; }catch(e){}
  try{ const rid=P&&P.part&&P.part.rivalId; const ir=rid&&(typeof infoClub==="function")&&infoClub(rid); if(ir&&ir.color) riv=ir.color; }catch(e){}
  const a=_cvHex(mio), b=_cvHex(riv);
  if(Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])<120) riv=(a[0]+a[1]+a[2]>420)?"#1d2a44":"#f4f4f4";
  return {mio:mio, riv:riv};
}
/* 7.9107 · memorizados: se pedían para cada jugador en cada cuadro (22 × 60 por segundo, parseando el color) */
const _CV_MEMO={};
function _cvSombra(hex,f){
  const key="s"+hex+"|"+f; if(_CV_MEMO[key]!==undefined) return _CV_MEMO[key];
  const c=_cvHex(hex), k=x=>Math.min(255,Math.max(0,Math.round(x*(1-f))));   /* f<0 aclara */
  return (_CV_MEMO[key]="rgb("+k(c[0])+","+k(c[1])+","+k(c[2])+")");
}
function _cvClaro(hex){ const key="c"+hex; if(_CV_MEMO[key]!==undefined) return _CV_MEMO[key]; const c=_cvHex(hex); return (_CV_MEMO[key]=(c[0]*0.3+c[1]*0.59+c[2]*0.11)>150); }
/* ============================================================
   7.9111 · CÁMARA CENITAL TIPO GTA 1/2, DIBUJO TIPO PES (pedido del autor)
   La cámara mira desde arriba y sigue la pelota con suavidad (como el auto en GTA); tocando la cancha se alterna
   con la vista completa. El mundo está en METROS (105×68 + tribuna); la simulación no cambió: solo el dibujo.
   - La textura del estadio (pasto cortado a franjas, líneas, carteles, tribuna con gente) se pinta UNA vez por
     resolución en un canvas aparte; cada cuadro recorta el pedazo que ve la cámara.
   - Jugadores vistos desde arriba: sombras de los focos, piernas y brazos que se mueven al correr, hombros con la
     camiseta, número en la espalda y la cabeza con pelo. Miran hacia donde corren (o hacia la pelota).
   - Pelota con gajos que giran, altura con sombra corrida; arcos con red que se infla con el gol, travesaño por
     encima de los jugadores. Radar abajo a la derecha y el nombre del que lleva la pelota.
   ============================================================ */
const CV_MUNDO={x0:-9, y0:-9, x1:114, y1:77};      /* metros: cancha 0..105 × 0..68 y su alrededor */
const CV_VISTA_SEGUIR=34;                           /* metros de largo que ve la cámara que sigue (GTA: cerca) */
function _cvCamModo(){ return (typeof E!=="undefined"&&E&&E.config&&E.config.camCancha==="completa")?"completa":"seguir"; }
/* textura del estadio en metros → píxeles (pxm px por metro), cacheada por resolución */
function _cvRuido(){
  if(_cvRuido.c) return _cvRuido.c;
  const c=document.createElement("canvas"); c.width=c.height=64; const g=c.getContext("2d");
  let sem=11; const rnd=()=>{ sem=(sem*1664525+1013904223)>>>0; return sem/4294967296; };
  for(let i=0;i<900;i++){ const v=rnd(); g.fillStyle=v<0.5?"rgba(0,0,0,"+(0.05+rnd()*0.07)+")":"rgba(255,255,240,"+(0.03+rnd()*0.06)+")"; g.fillRect(rnd()*64,rnd()*64,1+rnd()*1.5,1+rnd()*2.5); }
  return (_cvRuido.c=c);
}
function _cvTextura(pxm){
  if(_cvFondo && _cvFondo.pxm===pxm && _cvFondo.v===4) return _cvFondo;
  const M=CV_MUNDO, W=Math.round((M.x1-M.x0)*pxm), H=Math.round((M.y1-M.y0)*pxm);
  const c=document.createElement("canvas"); c.width=W; c.height=H;
  const g=c.getContext("2d");
  const X=m=>(m-M.x0)*pxm, Y=m=>(m-M.y0)*pxm;
  let sem=7; const rnd=()=>{ sem=(sem*1664525+1013904223)>>>0; return sem/4294967296; };
  /* tribuna: cemento con gente vista desde arriba (cabezas de colores, más densa cerca de la cancha) */
  g.fillStyle="#2b2f37"; g.fillRect(0,0,W,H);
  const cols=["#c8102e","#f4efe6","#1d4fa0","#e0a92a","#f4efe6","#20242c","#8a8f99","#d9d2c3"];
  const nGente=Math.round(W*H/(pxm*pxm)*1.6);
  for(let i=0;i<nGente;i++){
    const x=rnd()*W, y=rnd()*H, mx=x/pxm+M.x0, my=y/pxm+M.y0;
    if(mx>-6.2&&mx<111.2&&my>-6.2&&my<74.2) continue;
    g.fillStyle=cols[Math.floor(rnd()*cols.length)]; g.globalAlpha=0.55+rnd()*0.45;
    g.beginPath(); g.arc(x,y,Math.max(1,pxm*0.22),0,Math.PI*2); g.fill();
  }
  g.globalAlpha=1;
  /* escalones de la tribuna (líneas de sombra paralelas a la cancha) */
  g.strokeStyle="rgba(0,0,0,.35)"; g.lineWidth=Math.max(1,pxm*0.12);
  for(let k=1;k<4;k++){ const d=6.2+k*0.9; g.strokeRect(X(-d),Y(-d),(105+2*d)*pxm,(68+2*d)*pxm); }
  /* pista alrededor del pasto (el "run-off" más oscuro) */
  g.fillStyle="#2a6b33"; g.fillRect(X(-6),Y(-6),117*pxm,80*pxm);
  /* carteles LED a 4,5 m: franjas de colores con "letras" */
  const colsC=["#0a5ad6","#f0b429","#1fae52","#e0262b","#101820","#f4f4f4"];
  const cartel=(x,y,w,h,vert)=>{ const n=Math.max(1,Math.round((vert?h:w)/(9*pxm)));
    for(let k=0;k<n;k++){ const col=colsC[k%colsC.length]; g.fillStyle=col;
      if(vert) g.fillRect(x,y+k*h/n,w,h/n-1); else g.fillRect(x+k*w/n,y,w/n-1,h);
      g.fillStyle=col==="#f4f4f4"?"rgba(20,20,20,.8)":"rgba(255,255,255,.85)";
      if(vert) g.fillRect(x+w*0.3,y+k*h/n+h/n*0.2,w*0.4,h/n*0.6); else g.fillRect(x+k*w/n+w/n*0.2,y+h*0.3,w/n*0.6,h*0.4); } };
  const tc=0.8*pxm;
  cartel(X(0),Y(-5.3),105*pxm,tc,false); cartel(X(0),Y(72.5),105*pxm,tc,false);
  cartel(X(-5.3),Y(8),tc,17*pxm,true); cartel(X(-5.3),Y(43),tc,17*pxm,true);
  cartel(X(109.5),Y(8),tc,17*pxm,true); cartel(X(109.5),Y(43),tc,17*pxm,true);
  /* sombra que tiran los carteles sobre el pasto */
  g.fillStyle="rgba(0,0,0,.18)"; g.fillRect(X(0),Y(-4.5),105*pxm,0.5*pxm);
  /* el pasto: cortado a franjas (a lo ancho) + damero suave a lo largo, como las canchas de TV */
  const fr=18, fw=105/fr;
  for(let i=0;i<fr;i++){ g.fillStyle=i%2?"#43a551":"#327f3c"; g.fillRect(X(i*fw),Y(-3),fw*pxm+1,74*pxm); }
  g.fillStyle="rgba(255,255,255,.035)";
  for(let j=0;j<8;j++) if(j%2) g.fillRect(X(-3),Y(j*8.5),111*pxm,8.5*pxm);
  g.fillStyle=g.createPattern(_cvRuido(),"repeat"); g.fillRect(X(-6),Y(-6),117*pxm,80*pxm);
  /* luz de los 4 focos: más claro al centro de cada cuarto, más oscuro en los bordes */
  [[25,17],[80,17],[25,51],[80,51]].forEach(q=>{ const r=g.createRadialGradient(X(q[0]),Y(q[1]),0,X(q[0]),Y(q[1]),42*pxm);
    r.addColorStop(0,"rgba(255,255,220,.07)"); r.addColorStop(1,"rgba(255,255,220,0)"); g.fillStyle=r; g.fillRect(0,0,W,H); });
  const vig=g.createRadialGradient(X(52.5),Y(34),30*pxm,X(52.5),Y(34),72*pxm);
  vig.addColorStop(0,"rgba(0,0,0,0)"); vig.addColorStop(1,"rgba(0,0,0,.28)"); g.fillStyle=vig; g.fillRect(0,0,W,H);
  /* desgaste: el área chica y el punto penal pelados */
  [[5.5,34],[99.5,34],[11,34],[94,34]].forEach(q=>{ const r=g.createRadialGradient(X(q[0]),Y(q[1]),0,X(q[0]),Y(q[1]),4*pxm);
    r.addColorStop(0,"rgba(120,100,60,.22)"); r.addColorStop(1,"rgba(120,100,60,0)"); g.fillStyle=r; g.fillRect(X(q[0]-4),Y(q[1]-4),8*pxm,8*pxm); });
  /* líneas FIFA (12 cm, un poco más gruesas para que se lean) */
  g.strokeStyle="rgba(255,255,255,.92)"; g.lineWidth=Math.max(1.2,pxm*0.16); g.lineJoin="round";
  const rect=(x,y,w,h)=>g.strokeRect(X(x),Y(y),w*pxm,h*pxm);
  const arco=(cx,cy,r,a0,a1)=>{ g.beginPath(); g.arc(X(cx),Y(cy),r*pxm,a0,a1); g.stroke(); };
  rect(0,0,105,68);
  g.beginPath(); g.moveTo(X(52.5),Y(0)); g.lineTo(X(52.5),Y(68)); g.stroke();
  arco(52.5,34,9.15,0,Math.PI*2);
  const punto=(x,y,r)=>{ g.fillStyle="rgba(255,255,255,.92)"; g.beginPath(); g.arc(X(x),Y(y),r*pxm,0,Math.PI*2); g.fill(); };
  punto(52.5,34,0.3);
  const ang=Math.acos(5.5/9.15);
  [0,1].forEach(l=>{
    const bx=l?105:0, sg=l?-1:1;
    rect(l?105-16.5:0,13.84,16.5,40.32); rect(l?105-5.5:0,24.84,5.5,18.32);
    punto(bx+sg*11,34,0.24);
    arco(bx+sg*11,34,9.15,l?Math.PI-ang:-ang,l?Math.PI+ang:ang);
    [0,68].forEach(cy=>{ arco(bx,cy,1,0,Math.PI*2); });
  });
  /* banderines del córner */
  [[0,0],[105,0],[0,68],[105,68]].forEach(q=>{ g.fillStyle="rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(X(q[0])+pxm*0.5,Y(q[1])+pxm*0.3,pxm*0.5,pxm*0.2,0,0,Math.PI*2); g.fill();
    g.fillStyle="#f2d21b"; g.fillRect(X(q[0])-pxm*0.08,Y(q[1])-pxm*0.5,pxm*0.55,pxm*0.35); g.fillStyle="#fff"; g.beginPath(); g.arc(X(q[0]),Y(q[1]),pxm*0.12,0,Math.PI*2); g.fill(); });
  _cvFondo={pxm:pxm,c:c,v:4};
  return _cvFondo;
}
/* cámara: sigue la pelota con retardo (o muestra todo); nunca sale del estadio */
function _cvCamara(st,w,h){
  const modo=_cvCamModo(), b=st.ball;
  const cam=st.cam||(st.cam={x:b.x*105,y:b.y*68,modo:modo});
  let vista=modo==="completa"?111:CV_VISTA_SEGUIR;
  if(modo!=="completa"&&st.seq) vista=CV_VISTA_SEGUIR*0.85;              /* la repetición, más cerca */
  if(modo!=="completa"&&st.penalDive>0) vista=CV_VISTA_SEGUIR*0.8;
  let S=w/vista; if(modo==="completa") S=Math.min(w/111,h/74);
  let tx=b.x*105+(st.pase?(st.pase.x1-st.pase.x0)*105*0.25:0), ty=b.y*68;
  if(modo==="completa"){ tx=52.5; ty=34; }
  const k=cam.modo!==modo?1:Math.min(1,(st._dtCam||0.016)*3.2);
  cam.modo=modo; cam.x+=(tx-cam.x)*k; cam.y+=(ty-cam.y)*k;
  const mw=w/S/2, mh=h/S/2, M=CV_MUNDO;
  if(mw*2<M.x1-M.x0) cam.x=_cvCl(cam.x,M.x0+mw,M.x1-mw); else cam.x=52.5;
  if(mh*2<M.y1-M.y0) cam.y=_cvCl(cam.y,M.y0+mh,M.y1-mh); else cam.y=34;
  return {S:S, sx:m=>(m-cam.x)*S+w/2, sy:m=>(m-cam.y)*S+h/2, cam:cam, modo:modo};
}
/* arco visto desde arriba: red (se infla con el gol), postes y travesaño por encima de todo */
function _cvArcoTop(ctx,C,lado,vib,t){
  const S=C.S, gx=lado?105:0, sg=lado?1:-1, y0=34-3.66, y1=34+3.66, prof=2.1;
  const bolsa=vib?(0.5+Math.sin(t*28)*0.25)*vib*1.4:0;
  const xa=C.sx(gx), xb=C.sx(gx+sg*(prof+bolsa)), ya=C.sy(y0), yb=C.sy(y1);
  ctx.fillStyle="rgba(0,0,0,.25)"; ctx.fillRect(Math.min(xa,xb)+S*0.6,ya+S*0.4,Math.abs(xb-xa),yb-ya);
  ctx.fillStyle="rgba(235,240,245,.10)"; ctx.fillRect(Math.min(xa,xb),ya,Math.abs(xb-xa),yb-ya);
  ctx.strokeStyle="rgba(235,240,245,.55)"; ctx.lineWidth=Math.max(0.6,S*0.05);
  ctx.beginPath();
  const paso=0.45;
  for(let y=y0;y<=y1+0.01;y+=paso){ const yy=C.sy(y), curva=bolsa*Math.sin((y-y0)/(y1-y0)*Math.PI);
    ctx.moveTo(xa,yy); ctx.lineTo(C.sx(gx+sg*(prof+curva)),yy); }
  for(let d=0;d<=prof+0.01;d+=paso){ const xx=C.sx(gx+sg*d); ctx.moveTo(xx,ya); ctx.lineTo(xx+(bolsa?sg*S*bolsa*0.5:0),C.sy(34)); ctx.lineTo(xx,yb); }
  ctx.stroke();
  ctx.strokeStyle="rgba(250,250,250,.9)"; ctx.lineWidth=Math.max(1,S*0.12);
  ctx.beginPath(); ctx.moveTo(xa,ya); ctx.lineTo(xb,ya); ctx.lineTo(xb,yb); ctx.lineTo(xa,yb); ctx.stroke();
  /* travesaño (2,44 m arriba): se corre hacia la luz y tapa lo que pasa abajo */
  ctx.fillStyle="rgba(0,0,0,.3)"; ctx.fillRect(xa+S*0.5-S*0.09,ya+S*0.35,S*0.18,yb-ya);
  ctx.fillStyle="#fbfbfb"; ctx.fillRect(xa-S*0.1,ya-S*0.1,S*0.2,yb-ya+S*0.2);
  ctx.beginPath(); ctx.arc(xa,ya,S*0.16,0,Math.PI*2); ctx.arc(xa,yb,S*0.16,0,Math.PI*2); ctx.fill();
}
/* piel y pelo: fijos por jugador (no cambian de un cuadro a otro) */
const CV_PIEL=["#f1c9a5","#e0ac7e","#c68b5c","#a86e42","#8a5634","#5e3a22"], CV_PELO=["#1b1410","#2e2016","#4a3020","#6b4a2a","#c9a15a","#101010","#3a2a20"];
function _cvLook(p,i){ if(!p._look){ const h=(i*2654435761)>>>0; p._look={piel:CV_PIEL[h%CV_PIEL.length],pelo:CV_PELO[(h>>5)%CV_PELO.length],pelado:((h>>9)%11)===0}; } return p._look; }
/* jugador visto desde arriba: sombras de focos, piernas, brazos, hombros con camiseta, número, cabeza */
function _cvJugadorTop(ctx,C,p,i,camiseta,short,medias,conNum,dueno){
  const S=Math.max(C.S*2.1,C.modo==="completa"?13:7);                     /* GTA: los monos más grandes que la escala real, para leerlos (y visibles en la vista completa) */
  const x=C.sx(p.x*105), y=C.sy(p.y*68);
  const look=_cvLook(p,i);
  /* dos sombras de focos cruzados, suaves */
  ctx.fillStyle="rgba(0,0,0,.22)";
  ctx.beginPath(); ctx.ellipse(x+S*0.28,y+S*0.22,S*0.36,S*0.24,0.6,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="rgba(0,0,0,.12)";
  ctx.beginPath(); ctx.ellipse(x-S*0.24,y+S*0.2,S*0.32,S*0.2,-0.6,0,Math.PI*2); ctx.fill();
  const ang=p._ang||0, vel=p._vel||0;
  const zanc=Math.sin(p._paso||0)*Math.min(1,vel*1.6);
  ctx.save(); ctx.translate(x,y); ctx.rotate(ang);
  /* piernas (medias y botines) que se cruzan al correr */
  const lg=S*0.34;
  ctx.fillStyle=medias;
  ctx.beginPath(); ctx.ellipse(zanc*lg,-S*0.11,S*0.13,S*0.075,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-zanc*lg,S*0.11,S*0.13,S*0.075,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#141414";
  ctx.beginPath(); ctx.arc(zanc*lg+S*0.12,-S*0.11,S*0.06,0,Math.PI*2); ctx.arc(-zanc*lg+S*0.12,S*0.11,S*0.06,0,Math.PI*2); ctx.fill();
  /* short */
  ctx.fillStyle=short; ctx.beginPath(); ctx.ellipse(-S*0.02,0,S*0.14,S*0.2,0,0,Math.PI*2); ctx.fill();
  /* brazos: van al revés que las piernas (el arquero que se estira los lleva adelante, con guantes) */
  ctx.fillStyle=look.piel;
  if(p._dive>0.15){ const e=p._dive;
    ctx.fillStyle=camiseta;
    ctx.beginPath(); ctx.ellipse(S*0.22*e,-S*0.2,S*0.2*e+S*0.08,S*0.065,-0.25,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S*0.22*e,S*0.2,S*0.2*e+S*0.08,S*0.065,0.25,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#f4f4f4"; ctx.beginPath(); ctx.arc(S*0.45*e+S*0.05,-S*0.25,S*0.07,0,Math.PI*2); ctx.arc(S*0.45*e+S*0.05,S*0.25,S*0.07,0,Math.PI*2); ctx.fill();
  } else {
  ctx.beginPath(); ctx.ellipse(-zanc*S*0.18,-S*0.31,S*0.12,S*0.065,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(zanc*S*0.18,S*0.31,S*0.12,S*0.065,0,0,Math.PI*2); ctx.fill();
  }
  /* hombros con la camiseta: degradé de luz y costura */
  const gr=ctx.createLinearGradient(-S*0.2,-S*0.3,S*0.2,S*0.3);
  gr.addColorStop(0,_cvSombra(camiseta,-0.25)); gr.addColorStop(0.55,camiseta); gr.addColorStop(1,_cvSombra(camiseta,0.35));
  ctx.fillStyle=gr; ctx.beginPath(); ctx.ellipse(0,0,S*0.17,S*0.31,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=_cvSombra(camiseta,0.5); ctx.lineWidth=Math.max(0.6,S*0.025); ctx.stroke();
  /* número en la espalda (se lee de costado: se endereza) */
  if(conNum){ ctx.save(); ctx.rotate(-ang); ctx.fillStyle=_cvClaro(camiseta)?"#1b2230":"#fff";
    ctx.font="800 "+Math.round(S*0.26)+"px system-ui,sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(String(p.num),-S*0.02,S*0.02); ctx.restore(); }
  /* cabeza con pelo (o pelada) */
  ctx.fillStyle=look.piel; ctx.beginPath(); ctx.arc(S*0.02,0,S*0.115,0,Math.PI*2); ctx.fill();
  if(!look.pelado){ ctx.fillStyle=look.pelo; ctx.beginPath(); ctx.arc(-S*0.01,0,S*0.1,Math.PI*0.35,Math.PI*1.65); ctx.fill(); }
  ctx.restore();
  if(dueno){ ctx.strokeStyle="rgba(255,255,255,.85)"; ctx.lineWidth=Math.max(1,S*0.04);
    ctx.beginPath(); ctx.ellipse(x,y,S*0.46,S*0.46,0,0,Math.PI*2); ctx.stroke(); }
}
/* nombres del XI en el orden de la formación (ARQ, DEF, VOL, DEL) para rotular al que lleva la pelota */
function _cvNombres(P){
  if(!P||!Array.isArray(P.once)) return null;
  if(P._cvNom&&P._cvNom.n===P.once) return P._cvNom.l;
  const ord={ARQ:0,DEF:1,VOL:2,DEL:3};
  const l=P.once.slice().sort((a,b)=>(ord[a&&a.pos]??2)-(ord[b&&b.pos]??2)).map(j=>{ const n=String((j&&j.n)||""); const pz=n.split(" "); return pz.length>1?pz.slice(1).join(" "):n; });
  P._cvNom={n:P.once,l:l}; return l;
}
function _cvPelota(ctx,C,st){
  const b=st.ball, S=C.S, z=(b.z||0)*7;                 /* altura en metros */
  const x=C.sx(b.x*105), y=C.sy(b.y*68), r=Math.max(2,S*0.3*(1+z*0.09));
  ctx.fillStyle="rgba(0,0,0,"+(0.38-Math.min(0.2,z*0.03))+")";
  ctx.beginPath(); ctx.ellipse(x+z*S*0.45+S*0.12,y+z*S*0.35+S*0.1,S*0.28,S*0.2,0,0,Math.PI*2); ctx.fill();
  const gr=ctx.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r);
  gr.addColorStop(0,"#ffffff"); gr.addColorStop(1,"#c9ced6");
  ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  /* gajos que giran con lo que rueda */
  const rot=st._rodado||0;
  ctx.fillStyle="#1d1f24";
  for(let k=0;k<3;k++){ const a=rot+k*2.094; ctx.beginPath(); ctx.arc(x+Math.cos(a)*r*0.5,y+Math.sin(a)*r*0.5,r*0.26,0,Math.PI*2); ctx.fill(); }
  ctx.lineWidth=Math.max(0.5,r*0.12); ctx.strokeStyle="rgba(20,20,20,.55)"; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
}
function _cvRadar(ctx,w,h,st,col){
  const rw=Math.round(w*0.24), rh=Math.round(rw*68/105), m=Math.round(w*0.02), x0=w-rw-m, y0=h-rh-m;
  ctx.fillStyle="rgba(10,30,14,.62)"; ctx.fillRect(x0,y0,rw,rh);
  ctx.strokeStyle="rgba(255,255,255,.6)"; ctx.lineWidth=1; ctx.strokeRect(x0+0.5,y0+0.5,rw-1,rh-1);
  ctx.beginPath(); ctx.moveTo(x0+rw/2,y0); ctx.lineTo(x0+rw/2,y0+rh); ctx.stroke();
  const d=Math.max(1.5,rw/55);
  st.jug.forEach(p=>{ ctx.fillStyle=p.mio?col.mio:col.riv; ctx.beginPath(); ctx.arc(x0+p.x*rw,y0+p.y*rh,d,0,Math.PI*2); ctx.fill(); });
  ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(x0+st.ball.x*rw,y0+st.ball.y*rh,d*1.1,0,Math.PI*2); ctx.fill();
  if(st.cam){ const vw=CV_VISTA_SEGUIR/105*rw, vh=vw*h/w; ctx.strokeStyle="rgba(255,255,255,.8)"; ctx.strokeRect(x0+st.cam.x/105*rw-vw/2,y0+st.cam.y/68*rh-vh/2,vw,vh); }
}
function _cvRotulo(ctx,x,y,txt,fs,fondo){
  ctx.font="700 "+fs+"px system-ui,sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
  const tw=ctx.measureText(txt).width+fs*0.9;
  ctx.fillStyle=fondo; if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x-tw/2,y-fs*0.75,tw,fs*1.5,fs*0.4); ctx.fill(); } else ctx.fillRect(x-tw/2,y-fs*0.75,tw,fs*1.5);
  ctx.fillStyle="#fff"; ctx.fillText(txt,x,y);
}
function _cvDraw(ctx,w,h,stOpc,P){
  const st=stOpc||_cvSt; if(!st) return;
  const C=_cvCamara(st,w,h);
  /* textura a la resolución que pide esta cámara (tope 18 px/m: una cancha de 2,2 MP) */
  const pxm=_cvCl(Math.ceil(Math.max(w/CV_VISTA_SEGUIR,C.S)),4,18);
  const T=_cvTextura(pxm), M=CV_MUNDO;
  const vx0=C.cam.x-w/2/C.S, vy0=C.cam.y-h/2/C.S;
  ctx.fillStyle="#2b2f37"; ctx.fillRect(0,0,w,h);
  ctx.imageSmoothingEnabled=true;
  ctx.drawImage(T.c,(vx0-M.x0)*pxm,(vy0-M.y0)*pxm,w/C.S*pxm,h/C.S*pxm,0,0,w,h);
  const col=_cvColores(P||(typeof P_ACTUAL!=="undefined"?P_ACTUAL:null));
  const conNum=Math.max(C.S*2.1,C.modo==="completa"?13:7)*0.26>=6.5;
  /* orden: primero lo que está más arriba (los de abajo se ven "encima", como en GTA) */
  const vibIzq=(st.redVibra>0&&st.redLado<0)?st.redVibra:0, vibDer=(st.redVibra>0&&st.redLado>0)?st.redVibra:0;
  st.jug.forEach((p,i)=>{
    const qx=C.sx(p.x*105), qy=C.sy(p.y*68); if(qx<-40||qx>w+40||qy<-40||qy>h+40) return;
    const camiseta=p.rol==="gk"?(p.mio?"#f2c230":"#2fb5a9"):(p.mio?col.mio:col.riv);
    const short=p.rol==="gk"?_cvSombra(camiseta,0.55):(p.mio?(col.shortMio||_cvSombra(camiseta,0.65)):(col.shortRiv||_cvSombra(camiseta,0.65)));
    _cvJugadorTop(ctx,C,p,i,camiseta,short,_cvSombra(camiseta,0.2),conNum,i===st.own);
  });
  _cvPelota(ctx,C,st);
  _cvArcoTop(ctx,C,0,vibIzq,st.t); _cvArcoTop(ctx,C,1,vibDer,st.t);
  /* quién lleva la pelota */
  const due=st.own>=0?st.jug[st.own]:null, fs=Math.max(9,Math.round(h*0.045));
  if(due&&C.modo==="seguir"&&!st.seq){
    const noms=due.mio?_cvNombres(P||(typeof P_ACTUAL!=="undefined"?P_ACTUAL:null)):null;
    const idx=st.jug.indexOf(due)%11, nom=(noms&&noms[idx])||("#"+due.num);
    _cvRotulo(ctx,C.sx(due.x*105),C.sy(due.y*68)-C.S*1.6,nom,fs,due.mio?"rgba(12,70,32,.82)":"rgba(90,20,20,.82)");
  }
  if(C.modo==="seguir") _cvRadar(ctx,w,h,st,col);
  /* cartel de repetición */
  if(st.seq&&st.seq.tipo==="gol"){
    const pad=Math.round(h*0.03), f2=Math.max(10,Math.round(h*0.055));
    ctx.font="800 "+f2+"px system-ui,sans-serif"; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
    const txt="REPETICIÓN"+(st.seq.cartel?"  ·  "+st.seq.cartel:"");
    const tw=ctx.measureText(txt).width;
    ctx.fillStyle=st.seq.mio?"rgba(12,80,36,.88)":"rgba(110,24,24,.88)";
    ctx.fillRect(pad,pad,tw+pad*1.6,f2*1.6);
    ctx.fillStyle="#fff"; ctx.fillText(txt,pad*1.8,pad+f2*1.1);
  }
  if(st._avisoCam>0){ _cvRotulo(ctx,w/2,h-fs*1.4,C.modo==="seguir"?"Cámara que sigue · toca para ver toda la cancha":"Cancha completa · toca para seguir la pelota",Math.max(9,Math.round(fs*0.85)),"rgba(0,0,0,.6)"); }
}
/* 7.9107 · el ancho del contenedor se guarda con un ResizeObserver: leer clientWidth en CADA cuadro obligaba al navegador
   a recalcular la página 60 veces por segundo mientras el partido cambiaba el relato y el chat (tirones de 1,6 s en un
   celu barato). Ahora se mide una vez al montar y solo se vuelve a medir si el contenedor cambia de tamaño. */
function _cvAncho(canvas){
  const par=canvas.parentNode;
  /* 7.9111 · el canvas se reutiliza entre repintados: si cambió de contenedor, se vuelve a medir y a observar */
  if(canvas._roAncho===undefined||canvas._roPar!==par){
    if(canvas._ro){ try{ canvas._ro.disconnect(); }catch(e){} canvas._ro=null; }
    canvas._roPar=par;
    canvas._roAncho=(par&&par.clientWidth)||canvas.clientWidth||320;
    if(par&&typeof ResizeObserver==="function"){ try{ const ro=new ResizeObserver(function(es){ if(!canvas.isConnected){ ro.disconnect(); return; } const r=es[es.length-1]; const w=Math.round(r.contentRect.width); if(w>0) canvas._roAncho=w; }); ro.observe(par); canvas._ro=ro; }catch(e){} }
    else canvas._roFijo=true;
  }
  if(canvas._roFijo) canvas._roAncho=(par&&par.clientWidth)||canvas._roAncho;
  return canvas._roAncho;
}
function _cvSize(canvas){
  const disp=_cvAncho(canvas);
  /* 105×68 real. En PC se limita el alto y el ancho acompaña (no se estira ni se aplasta). */
  if(_cvSize._alto===undefined){ _cvSize._alto=window.innerHeight||800; window.addEventListener("resize",function(){ _cvSize._alto=window.innerHeight||800; }); }
  let tope=Math.min(360,Math.round(_cvSize._alto*0.42));   /* 7.9107 · innerHeight también forzaba layout en cada cuadro */
  /* 7.9111 · con pregunta abierta en el celu la cancha baja de alto AQUÍ (manteniendo 105×68), no con un max-height de CSS
     que la aplastaba y la estiraba de vuelta en cada pregunta (eso era parte del parpadeo) */
  try{ if(document.body.classList.contains("hay-momento")&&(window.innerWidth||1200)<1100) tope=Math.min(tope,_cvSize._alto<=720?140:190); }catch(e){}
  let cssW=disp, cssH=Math.round(cssW*68/105);
  if(cssH>tope){ cssH=tope; cssW=Math.round(cssH*105/68); }
  /* modo liviano o equipo de ≤2 GB: densidad 1 (un cuarto de los píxeles; en pantalla chica casi no se nota) */
  const flaco=_cvLiviano()||(typeof navigator!=="undefined"&&navigator.deviceMemory&&navigator.deviceMemory<=2);
  const dpr=flaco?1:Math.min(2,window.devicePixelRatio||1);
  if(canvas._w!==cssW || canvas._h!==cssH || canvas._dpr!==dpr){ canvas._dpr=dpr;
    canvas.style.width=cssW+"px"; canvas.style.height=cssH+"px";
    canvas.width=Math.round(cssW*dpr);
    canvas.height=Math.round(cssH*dpr);
    canvas._w=cssW; canvas._h=cssH;
  }
  return {w:canvas.width, h:canvas.height};
}
function _cvLiviano(){
  try{ return document.body.classList.contains("perf"); }catch(e){ return false; }
}
function _cvFrame(ts){
  const canvas=_cvCanvas;
  if(!canvas || canvas!==_cvCanvas) return;
  if(!canvas.isConnected || !P_ACTUAL){
    if(_cvRAF) cancelAnimationFrame(_cvRAF);
    _cvRAF=0; _cvCanvas=null;
    return;
  }
  /* pestaña oculta o modo liviano a 30 cps: no se gasta batería en lo que no se ve */
  const minDt=_cvLiviano()?1/31:0;
  const dtCrudo=(ts-_cvLast)/1000||0.016;
  if(document.hidden || dtCrudo<minDt){ _cvRAF=requestAnimationFrame(_cvFrame); return; }
  const dt=Math.min(0.05,dtCrudo); _cvLast=ts;
  const P=P_ACTUAL;
  _cvStep(P,dt);
  const s=_cvSize(canvas);
  _cvDraw(canvas.getContext("2d"), s.w, s.h, null, P);
  if(!P.terminado || (_cvSt&&_cvSt.seq)) _cvRAF=requestAnimationFrame(_cvFrame);
  else { if(_cvRAF) cancelAnimationFrame(_cvRAF); _cvRAF=0; }
}
/* API: montar el canvas en el partido actual (llamado desde pintarPartido) */
function montarCancha(canvas){
  if(!canvas || typeof P_ACTUAL==="undefined") return;
  if(!_cvSt || _cvSt._P!==P_ACTUAL){ _cvSeed(P_ACTUAL); if(_cvSt) _cvSt._P=P_ACTUAL; }
  _cvCanvas=canvas;
  if(_cvRAF) cancelAnimationFrame(_cvRAF);
  if(!canvas._cvToque){ canvas._cvToque=true;
    canvas.addEventListener("click",function(){ if(typeof E==="undefined"||!E) return; E.config=E.config||{};
      E.config.camCancha=_cvCamModo()==="seguir"?"completa":"seguir"; if(_cvSt) _cvSt._avisoCam=2.2;
      if(!_cvRAF&&_cvSt&&_cvCanvas){ const s2=_cvSize(_cvCanvas); _cvDraw(_cvCanvas.getContext("2d"),s2.w,s2.h,null,P_ACTUAL); } }); }
  if(_cvSt&&_cvSt._avisoCam===undefined) _cvSt._avisoCam=3;
  /* 7.9111 · se dibuja YA: un canvas recién puesto nunca se muestra vacío (el parpadeo verde del celu) */
  const s=_cvSize(canvas);
  _cvDraw(canvas.getContext("2d"),s.w,s.h,null,P_ACTUAL);
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(reduce){ _cvRAF=0; return; }
  _cvLast=performance.now()-34; _cvRAF=requestAnimationFrame(_cvFrame);
}
/* 7.9111 · el canvas de la cancha se reutiliza entre repintados del partido (mismo dibujo, mismo tamaño, sin blanco) */
function canchaReusable(){
  const c=_cvCanvas;
  return (c&&_cvSt&&typeof P_ACTUAL!=="undefined"&&_cvSt._P===P_ACTUAL)?c:null;
}
function detenerCancha(){ if(_cvRAF) cancelAnimationFrame(_cvRAF); _cvRAF=0; _cvCanvas=null; _cvSt=null; }

/* ---------- repetición de un gol ya jugado (Calendario → ver repetición) ---------- */
let _cvRepRAF=0;
function cvRepeticionGol(canvas, gol, info){
  if(!canvas) return;
  if(_cvRepRAF) cancelAnimationFrame(_cvRepRAF);
  const st=_cvNuevoEstado(null), lado=gol&&gol.propio?1:-1;
  _cvArmarGol(st,lado,gol&&gol.quien,gol&&gol.min);
  st.seq.sinSaque=true;   /* la repetición termina con la pelota en la red */
  const Pfalso={part:{rivalId:info&&info.rivalId}};
  let last=performance.now();
  const frame=function(ts){
    if(!canvas.isConnected){ _cvRepRAF=0; return; }
    const dt=Math.min(0.05,(ts-last)/1000||0.016); last=ts;
    if(st.seq) _cvPasoGol(st,dt);
    const s=_cvSize(canvas);
    _cvDraw(canvas.getContext("2d"),s.w,s.h,st,Pfalso);
    if(st.seq || st.redVibra>0) _cvRepRAF=requestAnimationFrame(frame); else _cvRepRAF=0;
  };
  _cvRepRAF=requestAnimationFrame(frame);
}
