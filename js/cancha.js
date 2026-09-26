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
    return;
  }
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
  const dx=tx-p.x, dy=ty-p.y, d=Math.hypot(dx,dy), paso=vmax*dt;
  if(d<=paso||d<1e-5){ p.x=tx; p.y=ty; return; }
  const k=paso/d*Math.min(1,0.35+d*6);
  p.x+=dx*k; p.y+=dy*k;
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
    else if(i===st.own){ tx=_cvX(p.mio,_cvCl(_cvA(p,p.x)+0.08,0,0.86)); ty=p.y+(0.5-p.y)*0.15; v=0.08; }
    else if(i===pres && st.own>=0){ tx=b.x; ty=b.y; v=0.17; }
    else if(st.pase && i===st.pase.to){ tx=st.pase.x1; ty=st.pase.y1; v=0.2; }
    _cvMover(p,tx,ty,v,dt);
  });
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
  st.t+=dt;
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
function _cvSombra(hex,f){
  const c=_cvHex(hex), k=x=>Math.max(0,Math.round(x*(1-f)));
  return "rgb("+k(c[0])+","+k(c[1])+","+k(c[2])+")";
}
function _cvClaro(hex){ const c=_cvHex(hex); return (c[0]*0.3+c[1]*0.59+c[2]*0.11)>150; }
/* ---------- geometría: la cancha deja margen para los arcos ---------- */
function _cvGeo(w,h){
  const mx=Math.round(w*0.035), my=Math.round(h*0.05);
  const fw=w-2*mx, fh=h-2*my;
  return {w:w,h:h,x0:mx,y0:my,fw:fw,fh:fh,sx:fw/105,sy:fh/68,
    X:x=>mx+x*fw, Y:y=>my+y*fh};
}
/* el fondo (césped, líneas, arcos) se pinta una vez por tamaño */
function _cvPintarFondo(w,h){
  if(_cvFondo && _cvFondo.w===w && _cvFondo.h===h) return _cvFondo.c;
  const c=document.createElement("canvas"); c.width=w; c.height=h;
  const g=c.getContext("2d"), G=_cvGeo(w,h);
  g.fillStyle="#2f7d3a"; g.fillRect(0,0,w,h);
  const franjas=14;
  for(let i=0;i<franjas;i++){ g.fillStyle=i%2?"#3d9a48":"#358c40"; g.fillRect(G.x0+i*G.fw/franjas,G.y0,G.fw/franjas+1,G.fh); }
  const luz=g.createRadialGradient(w/2,h*0.45,h*0.1,w/2,h/2,w*0.7);
  luz.addColorStop(0,"rgba(255,255,255,.07)"); luz.addColorStop(1,"rgba(0,0,0,.18)");
  g.fillStyle=luz; g.fillRect(0,0,w,h);
  const lw=Math.max(1.5,h/190);
  g.strokeStyle="rgba(255,255,255,.92)"; g.lineWidth=lw; g.lineJoin="round";
  const m=(xm,ym)=>[G.x0+xm*G.sx, G.y0+ym*G.sy];
  g.strokeRect(G.x0,G.y0,G.fw,G.fh);
  g.beginPath(); g.moveTo(G.x0+G.fw/2,G.y0); g.lineTo(G.x0+G.fw/2,G.y0+G.fh); g.stroke();
  const elipse=(cx,cy,rx,ry,a0,a1)=>{ g.beginPath(); g.ellipse(cx,cy,rx,ry,0,a0,a1); g.stroke(); };
  elipse(G.x0+G.fw/2,G.y0+G.fh/2,9.15*G.sx,9.15*G.sy,0,Math.PI*2);
  const punto=(x,y,r)=>{ g.beginPath(); g.ellipse(x,y,r,r,0,0,Math.PI*2); g.fillStyle="rgba(255,255,255,.92)"; g.fill(); };
  punto(G.x0+G.fw/2,G.y0+G.fh/2,lw*1.3);
  [0,1].forEach(lado=>{
    const sx=lado?-1:1, bx=lado?G.x0+G.fw:G.x0;
    const [ax,ay]=m(0,(68-40.32)/2), [cx,cy]=m(0,(68-18.32)/2);
    g.strokeRect(lado?bx-16.5*G.sx:bx,ay,16.5*G.sx,40.32*G.sy);
    g.strokeRect(lado?bx-5.5*G.sx:bx,cy,5.5*G.sx,18.32*G.sy);
    const px=bx+sx*11*G.sx, py=G.y0+G.fh/2;
    punto(px,py,lw*1.2);
    const ang=Math.acos(5.5/9.15);
    elipse(px,py,9.15*G.sx,9.15*G.sy,lado?Math.PI-ang:-ang,lado?Math.PI+ang:ang);
    /* arco con red, afuera de la línea */
    const gy0=G.y0+(68-7.32)/2*G.sy, gh=7.32*G.sy, gd=Math.max(G.x0*0.8,2.2*G.sx);
    const gx=lado?bx:bx-gd;
    g.fillStyle="rgba(255,255,255,.14)"; g.fillRect(gx,gy0,gd,gh);
    g.strokeStyle="rgba(255,255,255,.35)"; g.lineWidth=Math.max(0.6,lw*0.45);
    for(let k=1;k<5;k++){ g.beginPath(); g.moveTo(gx,gy0+gh*k/5); g.lineTo(gx+gd,gy0+gh*k/5); g.stroke(); }
    for(let k=1;k<3;k++){ g.beginPath(); g.moveTo(gx+gd*k/3,gy0); g.lineTo(gx+gd*k/3,gy0+gh); g.stroke(); }
    g.strokeStyle="#ffffff"; g.lineWidth=lw*1.4; g.strokeRect(gx,gy0,gd,gh);
    g.strokeStyle="rgba(255,255,255,.92)"; g.lineWidth=lw;
  });
  [[0,0],[1,0],[0,1],[1,1]].forEach(([a,b])=>{ const x=a?G.x0+G.fw:G.x0, y=b?G.y0+G.fh:G.y0, r=1*G.sx;
    elipse(x,y,r,r*G.sy/G.sx,a?(b?Math.PI:Math.PI/2):(b?-Math.PI/2:0),a?(b?Math.PI*1.5:Math.PI):(b?0:Math.PI/2)); });
  _cvFondo={w:w,h:h,c:c};
  return c;
}
function _cvDraw(ctx,w,h,stOpc,P){
  const st=stOpc||_cvSt; if(!st) return;
  const G=_cvGeo(w,h);
  ctx.drawImage(_cvPintarFondo(w,h),0,0);
  /* la red tiembla en el gol */
  if(st.redVibra>0){
    const lado=st.redLado>0, gy0=G.y0+(68-7.32)/2*G.sy, gh=7.32*G.sy, gd=Math.max(G.x0*0.8,2.2*G.sx);
    const gx=lado?G.x0+G.fw:G.x0-gd, j=Math.sin(st.t*50)*st.redVibra*gd*0.25;
    ctx.fillStyle="rgba(255,255,255,"+(0.35*st.redVibra).toFixed(2)+")";
    ctx.fillRect(gx+(lado?j:-j),gy0,gd,gh);
  }
  const col=_cvColores(P||(typeof P_ACTUAL!=="undefined"?P_ACTUAL:null));
  const r=Math.max(4.5,G.fh*0.028);
  const fuente="700 "+Math.round(r*1.05)+"px system-ui,sans-serif";
  const conNum=r>=7;
  ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.font=fuente;
  st.jug.forEach((p,i)=>{
    const x=G.X(p.x), y=G.Y(p.y);
    const camiseta=p.rol==="gk"?(p.mio?"#f2c230":"#2fb5a9"):(p.mio?col.mio:col.riv);
    ctx.fillStyle="rgba(0,0,0,.28)"; ctx.beginPath(); ctx.ellipse(x+r*0.25,y+r*0.35,r*0.95,r*0.7,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=camiseta; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.lineWidth=Math.max(1,r*0.18); ctx.strokeStyle=_cvSombra(camiseta,0.45); ctx.stroke();
    if(i===st.own){ ctx.lineWidth=Math.max(1,r*0.16); ctx.strokeStyle="rgba(255,255,255,.85)"; ctx.beginPath(); ctx.arc(x,y,r*1.45,0,Math.PI*2); ctx.stroke(); }
    if(conNum){ ctx.fillStyle=_cvClaro(camiseta)?"#1b2230":"#ffffff"; ctx.fillText(String(p.num),x,y+0.5); }
  });
  /* pelota con sombra: si va por el aire, la sombra se separa */
  const b=st.ball, bx=G.X(b.x), by=G.Y(b.y), br=Math.max(2.6,r*0.48), z=(b.z||0)*G.fh*0.08;
  ctx.fillStyle="rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(bx+z*0.4,by+z*0.6+br*0.3,br,br*0.7,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#ffffff"; ctx.beginPath(); ctx.arc(bx,by-z,br*(1+(b.z||0)*0.35),0,Math.PI*2); ctx.fill();
  ctx.lineWidth=Math.max(0.8,br*0.25); ctx.strokeStyle="#1b1b1b"; ctx.stroke();
  /* cartel de repetición */
  if(st.seq&&st.seq.tipo==="gol"){
    const pad=Math.round(h*0.03), fs=Math.max(10,Math.round(h*0.055));
    ctx.font="800 "+fs+"px system-ui,sans-serif"; ctx.textAlign="left";
    const txt="REPETICIÓN"+(st.seq.cartel?"  ·  "+st.seq.cartel:"");
    const tw=ctx.measureText(txt).width;
    ctx.fillStyle=st.seq.mio?"rgba(12,80,36,.85)":"rgba(110,24,24,.85)";
    ctx.fillRect(pad,pad,tw+pad*1.6,fs*1.6);
    ctx.fillStyle="#fff"; ctx.fillText(txt,pad*1.8,pad+fs*0.82);
  }
}
function _cvSize(canvas){
  const disp=(canvas.parentNode&&canvas.parentNode.clientWidth)||canvas.clientWidth||320;
  /* 105×68 real. En PC se limita el alto y el ancho acompaña (no se estira ni se aplasta). */
  const tope=Math.min(360,Math.round((window.innerHeight||800)*0.42));
  let cssW=disp, cssH=Math.round(cssW*68/105);
  if(cssH>tope){ cssH=tope; cssW=Math.round(cssH*105/68); }
  const dpr=Math.min(2,window.devicePixelRatio||1);
  if(canvas._w!==cssW || canvas._h!==cssH){
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
  const minDt=_cvLiviano()?1/30:0;
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
  const s=_cvSize(canvas);
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(reduce){ _cvStep(P_ACTUAL,0.016); _cvDraw(canvas.getContext("2d"),s.w,s.h,null,P_ACTUAL); _cvRAF=0; return; }
  _cvLast=performance.now(); _cvRAF=requestAnimationFrame(_cvFrame);
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
