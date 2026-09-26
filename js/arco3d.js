"use strict";
/* ============================================================
   FUTBOLINI · arco3d.js  (7.9068 · 7.9070)
   Pedido del autor (etapa 3, tarea 18 + respuestas de cierre): penal, tiro libre y córner "nivel
   Score Hero / FIFA 16 / Soccer Champs", estadio real, escena que no crece, pateador de espalda,
   festejo con repetición, cámara de córner más certera y tiro por deslizamiento.

   RECONSTRUCCIÓN DEL DIBUJO, NO DE LA LÓGICA:
   - La lógica (penZona, tlClasificar, cornerClasificar, penResolver…) sigue en sus coordenadas de
     siempre (arco 50..310 × 38..168). Esta capa traduce: el dedo → coordenadas viejas (arcoS2L) y
     las animaciones → pantalla (arcoL2S). Ninguna probabilidad cambia por el dibujo.
   - Cámara general: posición, hacia dónde mira (giro) e inclinación. Penal (1,7 m) y tiro libre
     (2,8 m) miran de frente al arco; el córner usa una cámara alta en diagonal desde el lado del
     córner: el arco se ve de tres cuartos y primer palo, punto penal y segundo palo quedan separados.
   - Todo polígono se recorta contra la cámara antes de proyectarse (nada se da vuelta).
   - Tiro por deslizamiento: desliza desde la pelota; rápido = potente, corto y suave = picada, la
     curva del trazo es la comba del vuelo. También se puede tocar el arco y apretar el botón.
   - Pateador de espalda con carrera; festejo con papel picado y repetición en cámara lenta.
   - La escena no crece: el dibujo vive en una capa absoluta; el tamaño lo pone solo el escenario.
   ============================================================ */
const ARCO3D={gyLinea:150, fDc:33, pxMetro:54.6, bolaY:216, bolaR:0.11};
ARCO3D.gx0=180-ARCO3D.fDc*3.66; ARCO3D.gx1=180+ARCO3D.fDc*3.66;
/* ---------- cámaras ---------- */
function _camMirando(C,T,F,cy){
  const dx=T.x-C.x, dz=T.z-C.z, L=Math.hypot(dx,dz)||1, fx=dx/L, fz=dz/L;
  const phi=Math.atan2(C.y-(T.y||0),L);
  return {C:C, fx:fx, fz:fz, rx:-fz, rz:fx, c:Math.cos(phi), s:Math.sin(phi), F:F, cy:cy};
}
function camaraArco(modo,lado){
  if(modo==="corner"){
    const sg=lado==="der"?1:-1;
    const cam=_camMirando({x:28*sg,y:12,z:26},{x:2*sg,y:0,z:5},520,118);
    cam.modo="corner"; cam.lado=lado==="der"?"der":"izq"; cam.sg=sg; cam.frontal=false; cam.Zb=11;
    return cam;
  }
  const c={penal:{h:1.7,Zb:11}, tl:{h:2.8,Zb:20}}[modo]||{h:1.7,Zb:11};
  const Dc=c.Zb+ARCO3D.fDc*c.h*c.Zb/(ARCO3D.bolaY-ARCO3D.gyLinea), f=ARCO3D.fDc*Dc;
  return {modo:modo==="tl"?"tl":"penal", frontal:true, h:c.h, Zb:c.Zb, Dc:Dc, f:f, HZ:ARCO3D.gyLinea-ARCO3D.fDc*c.h,
    C:{x:0,y:c.h,z:Dc}, fx:0, fz:-1, rx:1, rz:0, c:1, s:0, F:f, cy:ARCO3D.gyLinea-ARCO3D.fDc*c.h};
}
/* mundo (metros) → espacio de cámara */
function _aCam(cam,X,Y,Z){
  const ax=X-cam.C.x, ay=Y-cam.C.y, az=Z-cam.C.z, al=ax*cam.fx+az*cam.fz;
  return {xc:ax*cam.rx+az*cam.rz, yc:al*cam.s+ay*cam.c, d:al*cam.c-ay*cam.s};
}
function _pCam(cam,v){ const d=Math.max(0.35,v.d); return {x:180+cam.F*v.xc/d, y:cam.cy-cam.F*v.yc/d, k:cam.F/d}; }
function proyectar(cam,X,Y,Z){ return _pCam(cam,_aCam(cam,X,Y,Z)); }
/* rayo desde la cámara por un punto de la pantalla, cortado con un plano */
function _rayo(cam,xs,ys){
  const xc=(xs-180)/cam.F, yc=-(ys-cam.cy)/cam.F, al=cam.c+yc*cam.s, ay=-cam.s+yc*cam.c;
  return {dx:al*cam.fx+xc*cam.rx, dy:ay, dz:al*cam.fz+xc*cam.rz};
}
function _cortaPlano(cam,r,eje,valor){
  const o={x:cam.C.x,y:cam.C.y,z:cam.C.z}, dir={x:r.dx,y:r.dy,z:r.dz};
  const t=(valor-o[eje])/(dir[eje]||1e-9);
  return {t:t, x:o.x+dir.x*t, y:o.y+dir.y*t, z:o.z+dir.z*t};
}
/* la cámara viaja dentro del dibujo: cualquier svg armado con htmlArcoVivo sabe traducirse */
function _camDe(svg){
  if(!svg) return null;
  if(svg._cam) return svg._cam;
  const g=svg.querySelector&&svg.querySelector("#arco-cam");
  if(!g) return null;
  const v=(g.getAttribute("data-cam")||"").split(",").map(Number);
  const cam=camaraArco(g.getAttribute("data-modo")||"penal", g.getAttribute("data-lado")||"izq");
  cam.lbx=v[0]; cam.lby=v[1]; cam.sbx=v[2]; cam.sby=v[3]; cam.sbs=v[4]||1;
  svg._cam=cam; return cam;
}
/* coordenadas viejas (lógica) → mundo */
function _legadoAMundo(cam,xL,yL){
  if(!cam.frontal){
    /* córner: x = a lo largo de la línea (primer palo a la izquierda), y = distancia a la línea */
    const Xr=(xL-50)/260*7.32-3.66, Z=(yL-30)*13/132;
    return {X:cam.sg<0?Xr:-Xr, Y:1.9, Z:Z};
  }
  const X=(xL-180)*7.32/260;
  if(yL<=168) return {X:X, Y:(168-yL)*2.44/130, Z:0};
  const lby=cam.lby||220;
  return {X:X, Y:0, Z:Math.min(cam.Dc-0.6,(yL-168)/Math.max(1,lby-168)*cam.Zb)};
}
function arcoL2S(svg,xL,yL){
  const cam=_camDe(svg)||camaraArco("penal");
  if(cam.lbx!=null&&Math.abs(xL-cam.lbx)<3&&Math.abs(yL-cam.lby)<3) return {x:cam.sbx, y:cam.sby, k:cam.sbs*8/ARCO3D.bolaR};
  const w=_legadoAMundo(cam,xL,yL);
  return proyectar(cam,w.X,w.Y,w.Z);
}
/* pantalla → coordenadas viejas (el dedo) */
function arcoS2L(svg,xs,ys){
  const cam=_camDe(svg)||camaraArco("penal"), r=_rayo(cam,xs,ys);
  if(!cam.frontal){
    let p=_cortaPlano(cam,r,"y",1.9);
    if(!(p.t>0)) p={x:cam.sg*-40,z:60};
    const Xr=cam.sg<0?p.x:-p.x;
    return {x:50+(Xr+3.66)/7.32*260, y:30+p.z*132/13};
  }
  if(ys<=ARCO3D.gyLinea){ const p=_cortaPlano(cam,r,"z",0); return {x:180+p.x*260/7.32, y:168-p.y*130/2.44}; }
  const p=_cortaPlano(cam,r,"y",0);
  return {x:180+p.x*260/7.32, y:168+p.z/cam.Zb*((cam.lby||220)-168)};
}
/* ---------- polígonos recortados contra la cámara ---------- */
function _poly(cam,pts,attrs){
  const v=pts.map(p=>_aCam(cam,p[0],p[1],p[2])), N=0.6, out=[];
  for(let i=0;i<v.length;i++){
    const a=v[i], b=v[(i+1)%v.length], ain=a.d>=N, bin=b.d>=N;
    if(ain) out.push(a);
    if(ain!==bin){ const t=(N-a.d)/(b.d-a.d); out.push({xc:a.xc+(b.xc-a.xc)*t, yc:a.yc+(b.yc-a.yc)*t, d:N}); }
  }
  if(out.length<3) return "";
  return '<polygon points="'+out.map(q=>{ const p=_pCam(cam,q); return p.x.toFixed(1)+","+p.y.toFixed(1); }).join(" ")+'" '+attrs+'/>';
}
function _seg(cam,A,B,ancho,attrs){
  let a=_aCam(cam,A[0],A[1],A[2]), b=_aCam(cam,B[0],B[1],B[2]); const N=0.7;
  if(a.d<N&&b.d<N) return "";
  if(a.d<N){ const t=(N-a.d)/(b.d-a.d); a={xc:a.xc+(b.xc-a.xc)*t,yc:a.yc+(b.yc-a.yc)*t,d:N}; }
  if(b.d<N){ const t=(N-b.d)/(a.d-b.d); b={xc:b.xc+(a.xc-b.xc)*t,yc:b.yc+(a.yc-b.yc)*t,d:N}; }
  const p=_pCam(cam,a), q=_pCam(cam,b);
  const w=ancho?Math.min(2.4,Math.max(0.5,ancho*(p.k+q.k)/2)):null;
  return '<line x1="'+p.x.toFixed(1)+'" y1="'+p.y.toFixed(1)+'" x2="'+q.x.toFixed(1)+'" y2="'+q.y.toFixed(1)+'"'+(w?' stroke-width="'+w.toFixed(2)+'"':'')+(attrs?" "+attrs:"")+'/>';
}
/* ---------- estadio ---------- */
function _a3Pal(hc){ return [hc[0],hc[1]||"#f4f4f4",hc[0],"#23293a",hc[2]||hc[0],"#e8e2d0","#3a4050",hc[1]||"#f4f4f4"]; }
function _a3PatronGente(id,paso,pal,sem){
  let g='<pattern id="'+id+'" width="'+(paso*6).toFixed(2)+'" height="'+(paso*1.6).toFixed(2)+'" patternUnits="userSpaceOnUse">';
  for(let i=0;i<6;i++){
    const x=(i+0.5)*paso+((i*7+sem)%3-1)*paso*0.08, cab=paso*0.2, y=paso*0.55+((i*5+sem)%3-1)*paso*0.05;
    g+='<rect x="'+(x-paso*0.32).toFixed(2)+'" y="'+(y+cab*0.9).toFixed(2)+'" width="'+(paso*0.64).toFixed(2)+'" height="'+(paso*0.9).toFixed(2)+'" rx="'+(paso*0.18).toFixed(2)+'" fill="'+pal[(i*3+sem)%pal.length]+'"/>'+
       '<circle cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="'+cab.toFixed(2)+'" fill="'+ARCO_PIELES[(i*2+sem)%ARCO_PIELES.length]+'"/>';
  }
  return g+'</pattern>';
}
/* una tribuna: filas de gradería (rake 42°) a lo largo de un eje; "fondo" = detrás del arco, "lado" = costado lejano */
function _a3Tribuna(cam,hc,sem){
  const pal=_a3Pal(hc); let defs="", svg="", n=0;
  const fila=(cuatro,conGente,fill,clase)=>{
    const cen=cuatro.reduce((s,p)=>[s[0]+p[0]/4,s[1]+p[1]/4,s[2]+p[2]/4],[0,0,0]);
    const k=proyectar(cam,cen[0],cen[1],cen[2]).k;
    let s=_poly(cam,cuatro,'fill="'+(fill||"#1d2433")+'"');
    if(s&&conGente){ const id="a3g"+(n++), paso=Math.max(1.1,0.44*k); defs+=_a3PatronGente(id,paso,pal,sem+n); s+=_poly(cam,cuatro,'class="'+clase+'" fill="url(#'+id+')"'); }
    return s;
  };
  const fondo=(H0,H1,conGente,fill,clase)=>{ const z0=-8-H0*0.9, z1=-8-H1*0.9; return fila([[-70,H0,z0],[70,H0,z0],[70,H1,z1],[-70,H1,z1]],conGente,fill,clase); };
  let inf="", sup="";
  for(let H=0;H<7;H+=1) inf+=fondo(H,H+1,true,null,"arco-hinchas-b");
  const balcon=fondo(7,8.2,false,"#2c3445");
  for(let H=8.2;H<16;H+=1.1) sup+=fondo(H,H+1.1,true,null,"arco-hinchas-a");
  const techo=_poly(cam,[[-70,17.5,-23.75],[70,17.5,-23.75],[70,24,-30],[-70,24,-30]],'fill="#0a0e17"')+_seg(cam,[-70,17.5,-23.75],[70,17.5,-23.75],0,'stroke="#2a3346" stroke-width="2"');
  /* costado lejano (solo lo ve la cámara del córner) */
  let lado="";
  if(!cam.frontal){
    const sx=-cam.sg;
    for(let H=0;H<12;H+=1.2){ const x0=sx*(42+H*0.9), x1=sx*(42+(H+1.2)*0.9); lado+=fila([[x0,H,-12],[x0,H,70],[x1,H+1.2,70],[x1,H+1.2,-12]],true,null,"arco-hinchas-c"); }
  }
  /* lienzos de la barra en la bandeja baja del fondo */
  const lienzos='<g opacity=".93">'+
    _poly(cam,[[-26,2.2,-10],[-12,2.2,-10],[-12,3.4,-11.1],[-26,3.4,-11.1]],'fill="'+hc[0]+'"')+
    _poly(cam,[[-26,2.6,-10.35],[-12,2.6,-10.35],[-12,3.0,-10.7],[-26,3.0,-10.7]],'fill="'+(hc[1]||"#fff")+'"')+
    _poly(cam,[[10,2.0,-9.8],[27,2.0,-9.8],[27,3.6,-11.2],[10,3.6,-11.2]],'fill="'+(hc[1]||"#fff")+'"')+
    _poly(cam,[[10,3.1,-10.8],[27,3.1,-10.8],[27,3.6,-11.2],[10,3.6,-11.2]],'fill="'+hc[0]+'"')+
  '</g>';
  let luces="";
  [-60,-36,-12,12,36,60].forEach((X,i)=>{
    const p=proyectar(cam,X,17.6,-23.8); if(_aCam(cam,X,17.6,-23.8).d<1) return;
    luces+='<rect x="'+(p.x-7)+'" y="'+(p.y-3).toFixed(1)+'" width="14" height="5" rx="1.5" fill="#fffbe6"/>'+
      '<circle class="a3-foco" cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="26" fill="url(#a3Glow)" style="animation-delay:'+(i*0.37).toFixed(2)+'s"/>';
  });
  let flashes="";
  for(let i=0;i<10;i++){
    const H=1+((i*37+sem)%13), X=-60+((i*83+sem*11)%120), p=proyectar(cam,X,H,-8-H*0.9);
    if(_aCam(cam,X,H,-8-H*0.9).d<1) continue;
    flashes+='<circle class="a3-flash" cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="1.3" fill="#fff" style="animation-delay:'+((i*0.73)%4.4).toFixed(2)+'s"/>';
  }
  defs+='<linearGradient id="a3Bruma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(4,8,18,.55)"/><stop offset=".7" stop-color="rgba(6,12,26,.28)"/><stop offset="1" stop-color="rgba(6,12,26,.12)"/></linearGradient>'+
    '<filter id="a3Foco" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".45"/></filter>';
  return {defs:defs, svg:'<g id="arco-crowd" class="a3-gradas"><g class="a3-desenfoque" filter="url(#a3Foco)">'+techo+sup+balcon+inf+lado+lienzos+'</g>'+flashes+luces+'</g>'};
}
function _a3Carteles(cam){
  const sp=(typeof SPONSORS_CL!=="undefined"&&SPONSORS_CL.length)?SPONSORS_CL.slice(0,6):["Futbolini","Fútbol chileno"];
  const txt=(sp.join("  ·  ")+"  ·  ").toUpperCase();
  let s='<g id="arco-publi">'+_poly(cam,[[-70,0,-4],[70,0,-4],[70,0.9,-4],[-70,0.9,-4]],'fill="url(#a3Led)"');
  if(cam.frontal){
    const a=proyectar(cam,0,0.9,-4), b=proyectar(cam,0,0,-4), h=b.y-a.y, fs=Math.max(5,h*0.5);
    s+='<g class="a3-led"><text x="0" y="'+(a.y+h*0.72).toFixed(1)+'" font-family="system-ui,sans-serif" font-weight="900" font-size="'+fs.toFixed(1)+'" letter-spacing="2" fill="#cfefff">'+escHtml(txt+txt+txt)+'</text></g>';
  } else {
    const sx=-cam.sg*37;
    s+=_poly(cam,[[sx,0,-4],[sx,0,60],[sx,0.9,60],[sx,0.9,-4]],'fill="url(#a3Led)"');
  }
  return s+'</g>';
}
function _a3Fotografos(cam,sem){
  let s='<g class="a3-fotos">';
  [-12,-10.5,-8.6,8.2,9.9,11.8].forEach((X,i)=>{
    if(_aCam(cam,X,0,-2.6).d<1) return;
    const p=proyectar(cam,X,0,-2.6), k=p.k/ARCO3D.pxMetro;
    s+='<g transform="translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+') scale('+k.toFixed(3)+')">'+
      '<rect x="-12" y="-44" width="24" height="40" rx="9" fill="'+["#20242e","#3a3f4c","#15181f"][(i+sem)%3]+'"/>'+
      '<circle cx="0" cy="-52" r="9" fill="'+ARCO_PIELES[(i*2+sem)%ARCO_PIELES.length]+'"/>'+
      '<rect x="'+(X<0?4:-22)+'" y="-50" width="18" height="11" rx="2" fill="#0b0d12"/><circle cx="'+(X<0?22:-22)+'" cy="-44.5" r="4" fill="#233" stroke="#6af" stroke-width="1"/>'+
    '</g>';
  });
  return s+'</g>';
}
function _a3Pasto(cam){
  let s=_poly(cam,[[-80,0,-8],[80,0,-8],[80,0,120],[-80,0,120]],'fill="#2d8a3b"');
  for(let Z=-4,i=0;Z<90;Z+=5,i++) if(i%2) s+=_poly(cam,[[-70,0,Z],[70,0,Z],[70,0,Z+5],[-70,0,Z+5]],'fill="rgba(0,40,10,.16)"');
  return s;
}
function _a3Lineas(cam){
  const L=(pts)=>{ let s=""; for(let i=0;i+1<pts.length;i++) s+=_seg(cam,[pts[i][0],0,pts[i][1]],[pts[i+1][0],0,pts[i+1][1]],0.12); return s; };
  let s='<g class="a3-cal" stroke="rgba(255,255,255,.85)" stroke-linecap="butt" fill="none">';
  s+=L([[-34,0],[34,0]])+L([[-9.16,0],[-9.16,5.5],[9.16,5.5],[9.16,0]])+L([[-20.16,0],[-20.16,16.5],[20.16,16.5],[20.16,0]]);
  const arco=[]; for(let a=-53;a<=53;a+=6){ const r=a*Math.PI/180; arco.push([9.15*Math.sin(r),11+9.15*Math.cos(r)]); }
  s+=L(arco);
  if(!cam.frontal){ s+=L([[-34,0],[-34,40]])+L([[34,0],[34,40]]); }
  s+='</g>';
  if(_aCam(cam,0,0,11).d>0.8){ const p=proyectar(cam,0,0,11); s+='<ellipse cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" rx="'+(0.09*p.k).toFixed(2)+'" ry="'+(0.035*p.k).toFixed(2)+'" fill="#fff" opacity=".92"/>'; }
  return s;
}
function _a3Arco(cam){
  const W=3.66, H=2.44, Zt=-1.0, Zb=-2.0;
  let red='<g id="arco-red">';
  red+=_poly(cam,[[-W,0,0],[W,0,0],[W,0,Zb],[-W,0,Zb]],'fill="rgba(0,0,0,.18)"');
  red+=_poly(cam,[[-W,H,Zt],[W,H,Zt],[W,0,Zb],[-W,0,Zb]],'fill="url(#arcoMalla)" opacity=".55"');
  red+='<g stroke="rgba(236,244,255,.34)" stroke-width=".45" fill="none">';
  for(let X=-W;X<=W+0.01;X+=0.3) red+=_seg(cam,[X,H,Zt],[X,0,Zb]);
  for(let t=0;t<=1.001;t+=0.1){ const Y=H*(1-t), Z=Zt+(Zb-Zt)*t; red+=_seg(cam,[-W,Y,Z],[W,Y,Z]); }
  for(let X=-W;X<=W+0.01;X+=0.3) red+=_seg(cam,[X,H,0],[X,H,Zt],0,'opacity=".6"');
  [-W,W].forEach(X=>{
    for(let t=0;t<=1.001;t+=0.125){ const Y=H*(1-t), Z=Zt+(Zb-Zt)*t; red+=_seg(cam,[X,Y,0],[X,Y,Z]); }
    for(let Z=0;Z>=Zb-0.01;Z-=0.3){ const Y=Z>Zt?H:H*(Z-Zb)/(Zt-Zb); red+=_seg(cam,[X,0,Z],[X,Math.max(0,Y),Z]); }
  });
  red+='</g>';
  red+='<g stroke="#9aa7b6" stroke-width="1" fill="none" opacity=".8">'+_seg(cam,[-W,H,0],[-W,H,Zt])+_seg(cam,[-W,H,Zt],[-W,0,Zb])+_seg(cam,[W,H,0],[W,H,Zt])+_seg(cam,[W,H,Zt],[W,0,Zb])+_seg(cam,[-W,0,Zb],[W,0,Zb])+'</g>';
  red+='</g>';
  /* palos: cilindros de 12 cm; el travesaño es una línea (se ve inclinado desde el córner) */
  const g=(X)=>Math.max(1.2,0.12*proyectar(cam,X,0,0).k);
  const poste=(id,X)=>{ const a=proyectar(cam,X,0,0), b=proyectar(cam,X,H,0), w=g(X);
    return '<rect id="'+id+'" x="'+(a.x-w/2).toFixed(1)+'" y="'+(b.y-w/2).toFixed(1)+'" width="'+w.toFixed(2)+'" height="'+(a.y-b.y+w/2).toFixed(1)+'" fill="url(#arcoPalo)"/>'; };
  const tl=proyectar(cam,-W,H,0), tr=proyectar(cam,W,H,0);
  const palos=poste("arco-poste-izq",-W)+poste("arco-poste-der",W)+
    '<path id="arco-travesano" d="M'+tl.x.toFixed(1)+','+tl.y.toFixed(1)+' L'+tr.x.toFixed(1)+','+tr.y.toFixed(1)+'" stroke="url(#arcoPaloH)" stroke-width="'+((g(-W)+g(W))/2).toFixed(2)+'" stroke-linecap="round" fill="none"/>'+
    '<path d="M'+tl.x.toFixed(1)+','+tl.y.toFixed(1)+' L'+tr.x.toFixed(1)+','+tr.y.toFixed(1)+'" stroke="#fff" stroke-width="'+((g(-W)+g(W))/4).toFixed(2)+'" opacity=".9" fill="none"/>';
  return {red:red, palos:palos};
}
function _a3Figura(cam,X,Z,kit,cls,o){
  const p=proyectar(cam,X,0,Z), k=p.k/ARCO3D.pxMetro;
  return {k:k, svg:_figJugador(p.x,p.y,kit,cls,Object.assign({escala:k},o||{}))};
}
/* ---------- figura mejorada: sombra suave, cuello, puños, medias con franja y botines con brillo ---------- */
function _figPersona(o){
  o=o||{};
  const kit=o.kit||["#c0392b","#1a1a28"], piel=o.piel||ARCO_PIELES[0], pelo=o.pelo||ARCO_PELOS[0];
  const pose=o.pose||"parado", arq=pose==="arq";
  const P={
    arq:{pie:12,rod:10,cad:6, codo:[24,-62], mano:[28,-50]},
    muro:{pie:5,rod:5,cad:5, codo:[11,-60], mano:[3,-52]},
    parado:{pie:7,rod:7,cad:5, codo:[17,-61], mano:[18,-47]},
    corre:{pie:13,rod:9,cad:5, codo:[19,-64], mano:[22,-54]}
  }[pose]||{pie:7,rod:7,cad:5, codo:[17,-61], mano:[18,-47]};
  const media=arq?kit[0]:(o.media||"#f4f4f4"), franja=arq?kit[1]:kit[0];
  const botin="#15171c";
  function pierna(s){
    return '<path d="M'+(s*P.cad)+',-46 L'+(s*P.rod)+',-24" stroke="'+piel+'" stroke-width="8.5" stroke-linecap="round" fill="none"/>'+
      '<path d="M'+(s*P.cad+s*2.6)+',-44 L'+(s*P.rod+s*2.4)+',-26" stroke="rgba(0,0,0,.16)" stroke-width="2.6" stroke-linecap="round" fill="none"/>'+
      '<path d="M'+(s*P.rod)+',-25 L'+(s*P.pie)+',-4" stroke="'+media+'" stroke-width="7" stroke-linecap="round" fill="none"/>'+
      '<path d="M'+(s*(P.rod+(P.pie-P.rod)*0.18))+',-21 L'+(s*(P.rod+(P.pie-P.rod)*0.3))+',-17" stroke="'+franja+'" stroke-width="7.2" fill="none"/>'+
      '<ellipse cx="'+(s*(P.pie+1.5))+'" cy="-2.2" rx="5.2" ry="2.7" fill="'+botin+'"/>'+
      '<ellipse cx="'+(s*(P.pie+0.5))+'" cy="-3.3" rx="2.2" ry=".8" fill="rgba(255,255,255,.35)"/>';
  }
  function brazo(s, lado){
    const manga=kit[0], ante=arq?kit[0]:piel;
    const id=arq?' id="arco-brazo-'+lado+'"':"";
    const glove=arq?_figMano(lado, P.mano[0]*s, P.mano[1]):'<circle cx="'+(s*P.mano[0])+'" cy="'+P.mano[1]+'" r="2.9" fill="'+piel+'"/>';
    return '<g'+id+' class="arco-brazo">'+
      '<path d="M'+(s*14)+',-76 L'+(s*P.codo[0])+','+P.codo[1]+'" stroke="'+manga+'" stroke-width="6.4" stroke-linecap="round" fill="none"/>'+
      (arq?"":'<path d="M'+(s*(14+(P.codo[0]-14)*0.72))+','+(-76+(P.codo[1]+76)*0.72)+' L'+(s*(14+(P.codo[0]-14)*0.9))+','+(-76+(P.codo[1]+76)*0.9)+'" stroke="'+kit[1]+'" stroke-width="6.6" fill="none"/>')+
      '<path d="M'+(s*P.codo[0])+','+P.codo[1]+' L'+(s*P.mano[0])+','+P.mano[1]+'" stroke="'+ante+'" stroke-width="5.4" stroke-linecap="round" fill="none"/>'+
      glove+'</g>';
  }
  const torso='M-14.5,-78 Q0,-82.5 14.5,-78 L12,-50 L-12,-50 Z';
  const cabeza=o.espalda
    ? '<ellipse cx="0" cy="-92" rx="7.4" ry="8.4" fill="'+pelo+'"/>'+
      '<ellipse cx="-7" cy="-91" rx="1.6" ry="2.4" fill="'+piel+'"/><ellipse cx="7" cy="-91" rx="1.6" ry="2.4" fill="'+piel+'"/>'+
      '<path d="M-5,-84 Q0,-82 5,-84 L5,-80 L-5,-80 Z" fill="'+piel+'"/>'
    : '<ellipse cx="0" cy="-92" rx="7.2" ry="8.4" fill="'+piel+'"/>'+
      '<path d="M-7.3,-93 Q-7.6,-101.5 0,-101.2 Q7.6,-101.5 7.3,-93 Q4,-97.5 0,-97.4 Q-4,-97.5 -7.3,-93 Z" fill="'+pelo+'"/>'+
      '<ellipse cx="-7.2" cy="-91" rx="1.3" ry="2.2" fill="'+piel+'"/><ellipse cx="7.2" cy="-91" rx="1.3" ry="2.2" fill="'+piel+'"/>'+
      '<ellipse cx="0" cy="-88" rx="5.6" ry="4.2" fill="rgba(0,0,0,.08)"/>';
  const numero=o.espalda&&o.num?'<text x="0" y="-57" text-anchor="middle" font-size="12" font-weight="900" font-family="system-ui,sans-serif" fill="'+kit[1]+'" opacity=".95">'+o.num+'</text>':"";
  const cuello=o.espalda?'<path d="M-5,-80.5 Q0,-78.5 5,-80.5" stroke="'+kit[1]+'" stroke-width="1.6" fill="none"/>':'<path d="M-5,-80 L0,-74 L5,-80" stroke="'+kit[1]+'" stroke-width="1.8" fill="none"/>';
  const guantes=arq?'<rect x="-12" y="-50" width="24" height="3" fill="rgba(0,0,0,.18)"/>':"";
  return ''+
    '<ellipse cx="0" cy="0" rx="'+(arq?20:15)+'" ry="4" fill="rgba(0,0,0,.26)"/><ellipse cx="0" cy="0" rx="'+(arq?13:10)+'" ry="2.6" fill="rgba(0,0,0,.22)"/>'+
    pierna(-1)+pierna(1)+
    '<path d="M-12.5,-52 L12.5,-52 L13.5,-36 L2,-36 L0,-41 L-2,-36 L-13.5,-36 Z" fill="'+kit[1]+'"/>'+
    '<path d="M-13.2,-44 L-12.4,-37 M13.2,-44 L12.4,-37" stroke="'+kit[0]+'" stroke-width="1.4" opacity=".8"/>'+
    '<path d="'+torso+'" fill="'+kit[0]+'"/>'+
    '<path d="'+torso+'" fill="url(#arcoVolumen)"/>'+
    '<path d="M-6,-64 Q-2,-60 -7,-54 M7,-66 Q3,-61 8,-55" stroke="rgba(0,0,0,.12)" stroke-width="1.1" fill="none"/>'+
    cuello+numero+guantes+
    '<rect x="-3" y="-86" width="6" height="7" rx="2" fill="'+piel+'"/>'+
    cabeza+
    brazo(-1,"izq")+brazo(1,"der");
}
/* ---------- la escena completa (mismos ids que antes: la lógica y los tests los usan) ---------- */
function htmlArcoVivo(opts){
  opts=opts||{};
  const barrera=!!opts.barrera, modo=opts.modo||(barrera?"tl":"penal"), lado=opts.lado==="der"?"der":"izq";
  const cam=camaraArco(modo,lado);
  const kitArq=opts.kitArq||["#1a6ad4","#111827"], kitWall=opts.kitWall||["#c0392b","#1a1a28"];
  const kitAtk=opts.kitAtk||((typeof _kitDe==="function"&&typeof E!=="undefined"&&E&&E.club)?_kitDe(E.club,["#f4f4f4","#111111"]):["#f4f4f4","#111111"]);
  const hc=opts.hinchada||[kitAtk[0],kitAtk[1]];
  const sem=_arcoHash(opts.semilla||kitArq.join(""));
  const lbx=opts.bolaX!=null?opts.bolaX:180, lby=opts.bolaY!=null?opts.bolaY:220;
  let sbx=180, sby=ARCO3D.bolaY, bolaS;
  if(cam.frontal){ bolaS=ARCO3D.bolaR*(cam.F/(cam.Dc-cam.Zb))/8; }
  else { sbx=lado==="der"?318:42; sby=224; bolaS=1.05; }
  const trib=_a3Tribuna(cam,hc,sem), arco=_a3Arco(cam);
  /* arquero en la línea (en el córner, un paso hacia el segundo palo) */
  const Xk=cam.frontal?((opts.arqX!=null?opts.arqX:180)-180)*7.32/260:-cam.sg*0.8;
  const pa=proyectar(cam,Xk,0,cam.frontal?0:0.4), escArq=pa.k/ARCO3D.pxMetro;
  const arq='<g id="arco-arq" transform="translate('+pa.x.toFixed(1)+' '+pa.y.toFixed(1)+') scale('+escArq.toFixed(3)+')" data-x="'+pa.x.toFixed(1)+'" data-y="'+pa.y.toFixed(1)+'" data-esc="'+escArq.toFixed(3)+'">'+
    '<g class="arq-idle">'+_figPersona({kit:kitArq, pose:"arq", piel:ARCO_PIELES[sem%ARCO_PIELES.length], pelo:ARCO_PELOS[(sem>>3)%ARCO_PELOS.length]})+'</g></g>';
  let wall="", spray="";
  if(barrera){
    const Zw=cam.Zb-9.15, d=cam.Dc-Zw;
    const xs=[151,169,187,205].map(x=>ARCO3D.gx0+(x-50)*(ARCO3D.gx1-ARCO3D.gx0)/260);
    wall='<g id="arco-wall">'+xs.map((x,i)=>_a3Figura(cam,(x-180)*d/cam.F,Zw,i%2?[kitWall[0],kitWall[1]]:kitWall,"arco-muro",{i:i+sem,pose:"muro"}).svg).join("")+'</g>';
    spray='<g stroke="#fff" stroke-dasharray="2 2.5" opacity=".75">'+_seg(cam,[-2.2,0,Zw-0.35],[2.2,0,Zw-0.35],0.08)+'</g>';
  }
  let area="";
  if(!cam.frontal){
    const s=cam.sg;
    const figs=[
      _a3Figura(cam,s*2.6,3.4,kitWall,"arco-def",{i:sem+1}), _a3Figura(cam,-s*1.2,4.2,kitWall,"arco-def",{i:sem+2}), _a3Figura(cam,s*0.2,8.6,kitWall,"arco-def",{i:sem+3}),
      _a3Figura(cam,s*3.1,4.8,kitAtk,"arco-atk",{i:sem+4,espalda:true,num:4}), _a3Figura(cam,-s*2.8,5.6,kitAtk,"arco-atk",{i:sem+5,espalda:true,num:2}), _a3Figura(cam,-s*0.4,10.2,kitAtk,"arco-atk",{i:sem+6,espalda:true,num:9})
    ].sort((a,b)=>a.k-b.k);
    area='<g id="arco-area">'+figs.map(f=>f.svg).join("")+'</g>'+
      '<g id="arco-flag" transform="translate('+(lado==="der"?344:16)+' 236)"><rect x="-1" y="-42" width="2.2" height="42" fill="#f4f4f4"/><polygon points="1.2,-42 22,-35 1.2,-27" fill="#f0c419"/></g>';
  }
  /* el que patea, de espalda: corre a la pelota cuando se patea */
  let pat="";
  if(cam.frontal){
    const pp=proyectar(cam,cam.modo==="tl"?-2.8:-1.9,0,cam.Zb+1.1), kk=pp.k/ARCO3D.pxMetro;
    pat='<g id="a3-pateador" transform="translate('+pp.x.toFixed(1)+' '+pp.y.toFixed(1)+') scale('+kk.toFixed(3)+')" data-x="'+pp.x.toFixed(1)+'" data-y="'+pp.y.toFixed(1)+'" data-esc="'+kk.toFixed(3)+'">'+
      '<g class="a3-pat">'+_figPersona({kit:kitAtk, pose:"parado", espalda:true, num:opts.dorsal||10, piel:ARCO_PIELES[(sem+3)%ARCO_PIELES.length], pelo:ARCO_PELOS[(sem+2)%ARCO_PELOS.length]})+'</g></g>';
  } else {
    const kk=1.05, px=lado==="der"?sbx+20:sbx-20;
    pat='<g id="a3-pateador" transform="translate('+px+' 256) scale('+kk+')" data-x="'+px+'" data-y="256" data-esc="'+kk+'">'+
      '<g class="a3-pat">'+_figPersona({kit:kitAtk, pose:"parado", espalda:true, num:opts.dorsal||7, piel:ARCO_PIELES[(sem+3)%ARCO_PIELES.length], pelo:ARCO_PELOS[(sem+2)%ARCO_PELOS.length]})+'</g></g>';
  }
  return ''+
    '<g id="arco-cam" data-modo="'+cam.modo+'" data-lado="'+lado+'" data-cam="'+[lbx,lby,sbx,sby,bolaS.toFixed(3)].join(",")+'" data-hc="'+hc.join(",")+'"></g>'+
    '<defs>'+
      '<linearGradient id="arcoCielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03060e"/><stop offset=".7" stop-color="#0b1730"/><stop offset="1" stop-color="#15294a"/></linearGradient>'+
      '<linearGradient id="a3Pasto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c6a2c"/><stop offset=".45" stop-color="#2d8a3b"/><stop offset="1" stop-color="#3fa449"/></linearGradient>'+
      '<linearGradient id="a3Led" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1a33"/><stop offset=".5" stop-color="#10264a"/><stop offset="1" stop-color="#081225"/></linearGradient>'+
      '<linearGradient id="arcoPalo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#aebbc9"/><stop offset=".35" stop-color="#ffffff"/><stop offset="1" stop-color="#8393a6"/></linearGradient>'+
      '<linearGradient id="arcoPaloH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e3eaf2"/><stop offset="1" stop-color="#8f9fb1"/></linearGradient>'+
      '<linearGradient id="arcoVolumen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(255,255,255,.2)"/><stop offset=".45" stop-color="rgba(255,255,255,0)"/><stop offset="1" stop-color="rgba(0,0,0,.3)"/></linearGradient>'+
      '<radialGradient id="a3Glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(255,250,225,.75)"/><stop offset=".35" stop-color="rgba(255,248,215,.22)"/><stop offset="1" stop-color="rgba(255,248,215,0)"/></radialGradient>'+
      '<radialGradient id="arcoVineta" cx=".5" cy=".62" r=".78"><stop offset=".58" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,0,.5)"/></radialGradient>'+
      '<radialGradient id="a3Bola" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#e9edf2"/><stop offset="1" stop-color="#9aa4b0"/></radialGradient>'+
      '<radialGradient id="a3Bulto" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(255,255,255,.55)"/><stop offset=".6" stop-color="rgba(255,255,255,.12)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></radialGradient>'+
      '<pattern id="arcoMalla" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="rgba(215,230,245,.04)"/><path d="M0,2.5 L2.5,0 L5,2.5 L2.5,5 Z" fill="none" stroke="rgba(235,244,255,.35)" stroke-width=".4"/></pattern>'+
      trib.defs+
    '</defs>'+
    '<rect x="-60" y="-600" width="480" height="900" fill="url(#arcoCielo)"/>'+
    _a3Pasto(cam)+
    trib.svg+
    _a3Carteles(cam)+
    _a3Fotografos(cam,sem)+
    _a3Lineas(cam)+
    arco.red+
    '<circle id="arco-bulto" cx="180" cy="110" r="14" fill="url(#a3Bulto)" opacity="0"/>'+
    arq+
    arco.palos+
    spray+wall+area+
    '<rect x="-60" y="-600" width="480" height="900" fill="url(#arcoVineta)" pointer-events="none"/>'+
    '<path id="a3-trazo" d="M0,0" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>'+
    '<path id="arco-linea" d="M'+sbx+','+sby+'" fill="none" stroke="#ffd54a" stroke-width="1.8" stroke-dasharray="5 5" stroke-linecap="round" opacity="0"/>'+
    '<g id="arco-mira" opacity="0" transform="translate(180 110)">'+
      '<circle r="4.5" fill="rgba(255,255,255,.3)" stroke="rgba(255,255,255,.75)" stroke-width=".8"/>'+
      '<circle class="mira-aro" r="10" fill="none" stroke="#ffd54a" stroke-width="2.2"/>'+
      '<path class="mira-aro" d="M-16,0 L-11,0 M11,0 L16,0 M0,-16 L0,-11 M0,11 L0,16" stroke="#ffd54a" stroke-width="2" stroke-linecap="round"/>'+
    '</g>'+
    '<g id="arco-rastro"></g>'+
    '<ellipse id="arco-bola-sombra" cx="'+sbx+'" cy="'+(sby+8*bolaS).toFixed(1)+'" rx="'+(8*bolaS).toFixed(1)+'" ry="'+(2.8*bolaS).toFixed(1)+'" fill="rgba(0,0,0,.38)"/>'+
    '<g id="arco-bola" data-s="'+bolaS.toFixed(3)+'" transform="translate('+sbx+' '+sby+') scale('+bolaS.toFixed(3)+')">'+
      '<circle r="8" fill="url(#a3Bola)" stroke="#2a2a2a" stroke-width=".8"/>'+
      '<polygon points="0,-3.2 3,-1 1.9,2.6 -1.9,2.6 -3,-1" fill="#1d2230"/>'+
      '<path d="M0,-3.2 L0,-7.6 M3,-1 L7.2,-2.4 M1.9,2.6 L4.4,6.3 M-1.9,2.6 L-4.4,6.3 M-3,-1 L-7.2,-2.4" stroke="#333" stroke-width=".8"/>'+
      '<circle r="8" fill="url(#arcoVolumen)"/>'+
    '</g>'+
    pat+
    '<g id="a3-papel"></g>';
}
/* ---------- traducción de dedo, mira, pelota y arquero ---------- */
function _arcoPunto(svg, ev){
  const cx=ev.touches?ev.touches[0].clientX:ev.clientX, cy=ev.touches?ev.touches[0].clientY:ev.clientY;
  let s;
  const m=svg.getScreenCTM&&svg.getScreenCTM();
  if(m&&svg.createSVGPoint){ const pt=svg.createSVGPoint(); pt.x=cx; pt.y=cy; const q=pt.matrixTransform(m.inverse()); s={x:q.x,y:q.y}; }
  else { const r=svg.getBoundingClientRect(); s={x:(cx-r.left)*360/r.width, y:(cy-r.top)*240/r.height}; }
  return _camDe(svg)?arcoS2L(svg,s.x,s.y):s;
}
function _arcoMira(svg, aim, x0, y0){
  const mira=svg.querySelector("#arco-mira"), tray=svg.querySelector("#arco-linea");
  const a=arcoL2S(svg,x0,y0), b=arcoL2S(svg,aim.cx,aim.cy), col=aim.fuera?"#ff8a3d":"#ffd54a";
  if(mira){
    mira.setAttribute("transform","translate("+b.x.toFixed(1)+" "+b.y.toFixed(1)+")");
    mira.setAttribute("opacity","1");
    [].forEach.call(mira.querySelectorAll(".mira-aro"),function(x){ x.setAttribute("stroke",col); });
  }
  if(tray){
    const sw=svg._swipe, curl=sw?sw.curl*60:(b.x-a.x)*0.12;
    const mx=(a.x+b.x)/2+curl, my=Math.min(a.y,b.y)-22-Math.abs(a.y-b.y)*0.25;
    tray.setAttribute("d","M"+a.x.toFixed(1)+","+a.y.toFixed(1)+" Q"+mx.toFixed(1)+","+my.toFixed(1)+" "+b.x.toFixed(1)+","+b.y.toFixed(1));
    tray.setAttribute("stroke",col); tray.setAttribute("opacity",".85");
  }
}
/* vuelo con perspectiva: tamaño según 1/distancia, comba (la del trazo, si hubo), estela y sombra */
function _vueloBola(svg,bolaG,a,b,s0,sEnd,enArco,ms,cb){
  const sombra=svg.querySelector("#arco-bola-sombra"), rastro=svg.querySelector("#arco-rastro");
  const piso0={x:a.x,y:a.y+8*s0}, piso1=enArco?{x:b.x,y:b.pisoY!=null?b.pisoY:b.y+8*sEnd}:{x:b.x,y:b.y+8*sEnd};
  const dist=Math.hypot(b.x-a.x,b.y-a.y), lift=Math.min(42,10+dist*0.14);
  const sw=svg._swipe, curl=sw?sw.curl*70:(b.x-a.x)*0.16;
  const cx=(a.x+b.x)/2+curl, cy=Math.min(a.y,b.y)-lift*(sw&&sw.picada?1.8:1);
  const quieto=document.body&&document.body.classList.contains("perf");
  const ghosts=[];
  if(rastro&&!quieto){ rastro.innerHTML=""; for(let i=0;i<4;i++){ const c=document.createElementNS("http://www.w3.org/2000/svg","circle"); c.setAttribute("r","0"); c.setAttribute("fill","rgba(255,255,255,"+(0.28-i*0.06)+")"); rastro.appendChild(c); ghosts.push(c); } }
  const hist=[], t0=performance.now();
  (function paso(t){
    const u=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-u,2.2);
    const x=(1-e)*(1-e)*a.x+2*(1-e)*e*cx+e*e*b.x, y=(1-e)*(1-e)*a.y+2*(1-e)*e*cy+e*e*b.y;
    const s=1/((1-e)/s0+e/sEnd);
    bolaG.setAttribute("transform","translate("+x.toFixed(1)+" "+y.toFixed(1)+") rotate("+(u*540).toFixed(0)+") scale("+s.toFixed(3)+")");
    if(sombra){
      sombra.setAttribute("cx",(piso0.x+(piso1.x-piso0.x)*e).toFixed(1)); sombra.setAttribute("cy",(piso0.y+(piso1.y-piso0.y)*e).toFixed(1));
      sombra.setAttribute("rx",(8*s).toFixed(1)); sombra.setAttribute("ry",(2.8*s).toFixed(1));
    }
    hist.unshift([x,y,s]); if(hist.length>12) hist.pop();
    ghosts.forEach((g,i)=>{ const h=hist[(i+1)*2]; if(!h) return; g.setAttribute("cx",h[0].toFixed(1)); g.setAttribute("cy",h[1].toFixed(1)); g.setAttribute("r",(7.5*h[2]*(1-i*0.12)).toFixed(1)); });
    if(u<1) requestAnimationFrame(paso);
    else { bolaG.setAttribute("data-s",sEnd.toFixed(3)); if(rastro) rastro.innerHTML=""; if(cb) cb(); }
  })(performance.now());
}
function _animBola(bolaG, x0,y0, x1,y1, ms, cb, s1){
  const svg=bolaG.ownerSVGElement, cam=_camDe(svg);
  const a=arcoL2S(svg,x0,y0), b=arcoL2S(svg,x1,y1);
  const s0=parseFloat(bolaG.getAttribute("data-s"))||1;
  const sEnd=s1!=null?s1:Math.max(0.18,ARCO3D.bolaR*b.k/8);
  const enArco=cam?(cam.frontal?y1<=168:true):y1<=168;
  if(cam&&enArco){ if(cam.frontal) b.pisoY=ARCO3D.gyLinea+2; else { const w=_legadoAMundo(cam,x1,y1); b.pisoY=proyectar(cam,w.X,0,w.Z).y; } }
  const bulto=svg.querySelector("#arco-bulto");
  if(bulto&&enArco){ bulto.setAttribute("cx",b.x.toFixed(1)); bulto.setAttribute("cy",b.y.toFixed(1)); bulto.setAttribute("r",(10+18*sEnd).toFixed(1)); }
  /* el primer tiro sale de la pelota quieta: primero corre el pateador */
  const primero=!svg._pateado&&cam&&Math.abs(x0-cam.lbx)<3&&Math.abs(y0-cam.lby)<3;
  if(primero){
    svg._pateado=true;
    svg._ultimoTiro={a:{x:a.x,y:a.y},b:{x:b.x,y:b.y,pisoY:b.pisoY},s0:s0,sEnd:sEnd,enArco:enArco,ms:ms};
    _correPateador(svg,function(){ _vueloBola(svg,bolaG,a,b,s0,sEnd,enArco,ms,cb); });
    return;
  }
  _vueloBola(svg,bolaG,a,b,s0,sEnd,enArco,ms,cb);
}
const A3_CARRERA=340;
function _correPateador(svg,cb){
  const g=svg.querySelector("#a3-pateador"), bola=svg.querySelector("#arco-bola");
  const quieto=document.body&&document.body.classList.contains("perf");
  if(!g||!bola||quieto){ if(cb) cb(); return; }
  const x0=parseFloat(g.getAttribute("data-x")), y0=parseFloat(g.getAttribute("data-y")), k=parseFloat(g.getAttribute("data-esc"));
  const cam=_camDe(svg), bx=cam.sbx, by=cam.sby;
  const x1=cam.frontal?bx-26*k/1.4:(cam.lado==="der"?bx+16:bx-16), y1=cam.frontal?by+10:y0-6;
  const t0=performance.now();
  (function paso(t){
    const u=Math.min(1,(t-t0)/A3_CARRERA), e=u*u*(3-2*u), salto=-Math.abs(Math.sin(u*Math.PI*3))*5;
    g.setAttribute("transform","translate("+(x0+(x1-x0)*e).toFixed(1)+" "+(y0+(y1-y0)*e+salto).toFixed(1)+") scale("+k+") rotate("+(e*8).toFixed(1)+")");
    if(u<1) requestAnimationFrame(paso); else { g.classList.add("a3-pateo"); if(cb) cb(); }
  })(performance.now());
}
/* el arquero espera la carrera del pateador (si la hay) y se tira en pantalla */
(function(){
  const o=window._animArq; if(typeof o!=="function"||o._a3) return;
  const w=function(arqEl,kdir,ms,opts){
    const svg=arqEl&&arqEl.ownerSVGElement, self=this, args=arguments;
    if(svg){ svg._ultimoArq={kdir:kdir,ms:ms,opts:opts,tr:svg._arqT0||(svg._arqT0=arqEl.getAttribute("transform"))}; }
    const espera=svg&&!svg._pateado&&svg.querySelector("#a3-pateador")&&!(document.body&&document.body.classList.contains("perf"));
    if(espera){ setTimeout(function(){ o.apply(self,args); }, A3_CARRERA); return; }
    return o.apply(this,arguments);
  };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._a3=true; window._animArq=w;
})();
function _arqDestino(arqEl, kdir, opts){
  const svg=arqEl.ownerSVGElement;
  const x0=parseFloat(arqEl.getAttribute("data-x"))||180, y0=parseFloat(arqEl.getAttribute("data-y"))||ARCO3D.gyLinea;
  const esc=parseFloat(arqEl.getAttribute("data-esc"))||0.52;
  const aim=opts.aim, cad={x:x0, y:y0-46*esc};
  const L=(xL,yL)=>arcoL2S(svg,xL,yL);
  let tx, ty;
  if(kdir==="centro"){
    if(aim&&aim.tercio==="centro"){ const p=L(aim.cx,aim.cy); tx=p.x; ty=p.y; }
    else { tx=x0; ty=L(180,70).y; }
  } else if(aim&&aim.tercio===kdir&&!aim.fuera){ const p=L(aim.cx,aim.cy); tx=p.x; ty=p.y; }
  else { const p=L(kdir==="izq"?64:296,(aim&&aim.cy!=null)?aim.cy:(60+Math.random()*80)); tx=p.x; ty=p.y; }
  const brazo=kdir==="centro"?128:150;
  const lado=tx>=x0?"der":"izq";
  const gl=_arqGuanteLocal(lado, brazo);
  const vx=tx-cad.x, vy=ty-cad.y, d=Math.hypot(vx,vy)||1;
  let rot=(Math.atan2(vx,-vy)-Math.atan2(gl.x,-gl.y))*180/Math.PI;
  if(rot>180) rot-=360; if(rot<-180) rot+=360;
  const tope=kdir==="centro"?24:112;
  rot=Math.max(-tope,Math.min(tope,rot));
  const escala=esc/0.6;
  const alcance=Math.hypot(gl.x,gl.y)*esc, corto=(!opts.ataja&&aim&&kdir===aim.tercio)?18*escala:0;
  const mov=Math.max(0,Math.min((kdir==="centro"?14:90)*escala, d-alcance-corto));
  return {x0:x0, y0:y0, esc:esc, dx:vx/d*mov, dy:vy/d*mov, rot:rot, brazo:brazo};
}
/* ---------- tiro por deslizamiento (FIFA / Score Hero / Soccer Champs) ---------- */
function efectoDeTrazo(pts){
  if(!pts||pts.length<2) return null;
  const a=pts[0], b=pts[pts.length-1], dx=b.x-a.x, dy=b.y-a.y, cuerda=Math.hypot(dx,dy)||1;
  let largo=0, dev=0;
  for(let i=1;i<pts.length;i++){ largo+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);
    const p=pts[i], d=((p.x-a.x)*dy-(p.y-a.y)*dx)/cuerda; if(Math.abs(d)>Math.abs(dev)) dev=d; }
  const ms=Math.max(1,b.t-a.t), vel=largo/ms;
  const curl=clamp(-dev/cuerda*2.2,-1,1);
  let efecto="colocado";
  if(vel>1.1) efecto="potente";
  else if(cuerda<95&&vel<0.45) efecto="picadita";
  return {efecto:efecto, curl:curl, vel:vel, cuerda:cuerda, picada:efecto==="picadita"};
}
function _a3Deslizar(stage,svg){
  let pts=null;
  const trazo=svg.querySelector("#a3-trazo");
  const loc=e=>{ const m=svg.getScreenCTM(); if(!m) return null; const q=svg.createSVGPoint(); q.x=e.clientX; q.y=e.clientY; const r=q.matrixTransform(m.inverse()); return {x:r.x,y:r.y,t:performance.now()}; };
  stage.addEventListener("pointerdown",function(e){ if(svg._pateado) return; const p=loc(e); if(!p) return; pts=[p]; svg._swipe=null; },true);
  stage.addEventListener("pointermove",function(e){
    if(!pts) return; const p=loc(e); if(!p) return; pts.push(p); if(pts.length>80) pts.splice(1,1);
    if(trazo){ trazo.setAttribute("d","M"+pts.map(q=>q.x.toFixed(1)+","+q.y.toFixed(1)).join(" L")); trazo.setAttribute("opacity",".8"); }
    if(pts.length>4){ const ef=efectoDeTrazo(pts); if(ef&&ef.cuerda>40) svg._swipe=ef; }
  },true);
  stage.addEventListener("pointerup",function(){
    if(!pts) return;
    const ef=efectoDeTrazo(pts); pts=null;
    if(trazo) setTimeout(function(){ trazo.setAttribute("opacity","0"); },220);
    if(!ef||ef.cuerda<40){ svg._swipe=null; return; }
    svg._swipe=ef;
    /* el efecto del trazo aprieta el botón que corresponde (la lógica sigue siendo la misma) */
    const modal=stage.closest(".modal"), bs=modal?modal.querySelectorAll(".penal-ef button"):[];
    const idx={colocado:0,potente:1,picadita:2}[ef.efecto];
    if(bs[idx]) bs[idx].click();
    const h=stage.querySelector(".a3-hint"); if(h) h.classList.add("oculto");
  },true);
}
/* ---------- festejo con papel picado y repetición en cámara lenta ---------- */
let _A3_FEST=null;
function _a3Festejo(svg){
  if(_A3_FEST&&_A3_FEST.svg===svg) return;
  const stage=svg.closest(".e3d-stage"), modal=svg.closest(".modal");
  const quieto=document.body&&document.body.classList.contains("perf");
  const dur=quieto?900:2900;
  _A3_FEST={svg:svg, modal:modal, hasta:performance.now()+dur};
  const cam=_camDe(svg), hc=((svg.querySelector("#arco-cam")||{getAttribute:()=>""}).getAttribute("data-hc")||"#ffffff").split(",");
  /* el cabezazo del córner termina adentro */
  if(cam&&!cam.frontal){
    const bola=svg.querySelector("#arco-bola"), w=proyectar(cam,cam.sg*1.2,1.4,-0.6), m=/translate\(([-\d.]+) ([-\d.]+)\)/.exec(bola.getAttribute("transform")||"");
    if(m) _vueloBola(svg,bola,{x:+m[1],y:+m[2]},{x:w.x,y:w.y,pisoY:proyectar(cam,cam.sg*1.2,0,-0.6).y},parseFloat(bola.getAttribute("data-s"))||0.4,ARCO3D.bolaR*w.k/8,true,260,null);
  }
  if(quieto) return;
  /* papel picado */
  const papel=svg.querySelector("#a3-papel"), vb=(svg.getAttribute("viewBox")||"0 0 360 240").split(/\s+/).map(Number);
  if(papel){
    let s=""; const cols=hc.concat(["#ffffff","#ffe27a"]);
    for(let i=0;i<46;i++){
      const x=vb[0]+Math.random()*vb[2], y=vb[1]-10-Math.random()*40, c=cols[i%cols.length];
      s+='<rect class="a3-papel" x="'+x.toFixed(0)+'" y="'+y.toFixed(0)+'" width="'+(2+Math.random()*2.5).toFixed(1)+'" height="'+(3+Math.random()*3).toFixed(1)+'" fill="'+c+'" style="animation-duration:'+(1.6+Math.random()*1.4).toFixed(2)+'s;animation-delay:'+(Math.random()*0.6).toFixed(2)+'s;--caida:'+(vb[3]+60).toFixed(0)+'px"/>';
    }
    papel.innerHTML=s;
  }
  /* el que hizo el gol sale corriendo a festejar hacia el córner (y deja ver la repetición) */
  const pat=svg.querySelector("#a3-pateador");
  if(pat){
    pat.classList.add("a3-festeja");
    const m=/translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)/.exec(pat.getAttribute("transform")||""), lejos=(cam&&!cam.frontal&&cam.lado==="der")?1:-1;
    if(m){ const x0=+m[1], y0=+m[2], k=+m[3], t0=performance.now();
      (function paso(t){ const u=Math.min(1,(t-t0)/750), e=u*u;
        pat.setAttribute("transform","translate("+(x0+lejos*170*e).toFixed(1)+" "+(y0+14*e).toFixed(1)+") scale("+k+")");
        if(u<1) requestAnimationFrame(paso); })(performance.now()); }
  }
  /* repetición: zoom al arco y el tiro otra vez, lento */
  const tiro=svg._ultimoTiro;
  if(!tiro||!stage) return;
  setTimeout(function(){
    if(!svg.isConnected) return;
    const badge=document.createElement("div"); badge.className="a3-repe"; badge.textContent="⟲ REPETICIÓN"; stage.appendChild(badge);
    const vb0=svg.getAttribute("viewBox"), v=vb0.split(/\s+/).map(Number);
    const zw=v[2]*0.62, zh=v[3]*0.62, zx=clamp(tiro.b.x-zw/2,v[0],v[0]+v[2]-zw), zy=clamp(tiro.b.y-zh*0.55,v[1],v[1]+v[3]-zh);
    _a3Zoom(svg,v,[zx,zy,zw,zh],320,function(){
      const bola=svg.querySelector("#arco-bola");
      bola.setAttribute("transform","translate("+tiro.a.x+" "+tiro.a.y+") scale("+tiro.s0+")"); bola.setAttribute("data-s",tiro.s0);
      const arq=svg.querySelector("#arco-arq"), ua=svg._ultimoArq;
      if(arq&&ua){ arq.setAttribute("transform",ua.tr); ["#arco-brazo-izq","#arco-brazo-der"].forEach(q=>{ const b=arq.querySelector(q); if(b) b.removeAttribute("transform"); });
        setTimeout(function(){ if(typeof _animArq==="function") _animArq(arq,ua.kdir,ua.ms*2.2,ua.opts); },60); }
      _vueloBola(svg,bola,tiro.a,tiro.b,tiro.s0,tiro.sEnd,tiro.enArco,tiro.ms*2.4,function(){
        setTimeout(function(){ _a3Zoom(svg,[zx,zy,zw,zh],v,280,function(){ badge.remove(); }); },220);
      });
    });
  },quieto?0:780);
}
function _a3Zoom(svg,a,b,ms,cb){
  const t0=performance.now();
  (function paso(t){
    const u=Math.min(1,(t-t0)/ms), e=u*u*(3-2*u);
    svg.setAttribute("viewBox",[0,1,2,3].map(i=>(a[i]+(b[i]-a[i])*e).toFixed(1)).join(" "));
    if(u<1) requestAnimationFrame(paso); else if(cb) cb();
  })(performance.now());
}
function festejoArcoActivo(){ return !!(_A3_FEST&&_A3_FEST.svg.isConnected&&performance.now()<_A3_FEST.hasta); }
/* mientras dura el festejo, la ventana no se cierra y el partido no se reanuda (después sí, solos) */
(function(){
  const c=window.cerrarModal;
  if(typeof c==="function"&&!c._a3){
    const w=function(){
      if(festejoArcoActivo()){
        const f=_A3_FEST, resta=f.hasta-performance.now();
        setTimeout(function(){ if(f.svg.isConnected) c(); }, resta+40);
        return;
      }
      return c.apply(this,arguments);
    };
    Object.keys(c).forEach(k=>w[k]=c[k]); w._a3=true; window.cerrarModal=w;
  }
  const r=window.reanudarPronto;
  if(typeof r==="function"&&!r._a3){
    const w2=function(){
      if(festejoArcoActivo()){ const self=this, args=arguments; setTimeout(function(){ r.apply(self,args); }, _A3_FEST.hasta-performance.now()+60); return; }
      return r.apply(this,arguments);
    };
    Object.keys(r).forEach(k=>w2[k]=r[k]); w2._a3=true; window.reanudarPronto=w2;
  }
})();
/* ---------- montaje: el dibujo en capa absoluta, el trazo y el festejo ---------- */
(function(){
  const o=window._abrirEscenaArco; if(typeof o!=="function"||o._a3) return;
  const w=function(){ const r=o.apply(this,arguments);
    try{ if(r&&r.stage){ r.stage.classList.add("e3d-v2"); const h=document.createElement("div"); h.className="a3-hint"; h.textContent="Desliza desde la pelota: rápido = potente · con curva = comba · corto y suave = picada. O toca el arco y aprieta el botón."; r.stage.appendChild(h); setTimeout(function(){ h.classList.add("oculto"); },5200); } }catch(e){}
    return r; };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._a3=true; window._abrirEscenaArco=w;
})();
(function(){
  const o=window._arcoMontarSvg; if(typeof o!=="function"||o._a3) return;
  const w=function(esc,html){
    const svg=o.apply(this,arguments);
    try{
      if(esc&&esc.stage) _a3Deslizar(esc.stage,svg);
      if(typeof MutationObserver==="function"){
        const mo=new MutationObserver(function(){ if(!svg.isConnected){ mo.disconnect(); return; } if(svg.classList.contains("arco-golazo")){ mo.disconnect(); _a3Festejo(svg); } });
        mo.observe(svg,{attributes:true,attributeFilter:["class"]});
      }
    }catch(e){ console.error("arco3d:",e); }
    return svg;
  };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._a3=true; window._arcoMontarSvg=w;
})();
if(typeof document!=="undefined"&&!document.getElementById("css-arco3d")){
  const st=document.createElement("style"); st.id="css-arco3d";
  st.textContent=
    ".escena-3d .e3d-stage{contain:layout paint}"+
    ".escena-3d .e3d-world{position:absolute !important;inset:0 !important;width:auto !important;height:auto !important}"+
    ".escena-3d .e3d-world>svg{position:absolute;inset:0;width:100% !important;height:100% !important}"+
    "@media (max-width:760px){html body .modal.escena-3d .e3d-stage.e3d-v2{flex:1 1 auto !important;aspect-ratio:auto !important;min-height:250px !important;max-height:none !important;margin:0 !important}}"+
    ".e3d-stage .a3-hint{position:absolute;left:8px;right:8px;top:8px;padding:6px 10px;border-radius:10px;background:rgba(5,12,24,.62);color:#e8f4ff;font-size:12px;line-height:1.35;pointer-events:none;transition:opacity .4s}"+
    ".e3d-stage .a3-hint.oculto{opacity:0}"+
    ".e3d-stage .a3-repe{position:absolute;top:10px;left:10px;padding:4px 10px;border-radius:6px;background:#d6262f;color:#fff;font-weight:900;font-size:12px;letter-spacing:1.5px;animation:a3Repe 1s ease-in-out infinite alternate}"+
    "@keyframes a3Repe{from{opacity:.75}to{opacity:1}}"+
    ".arco-svg .a3-led{animation:a3Led 26s linear infinite}"+
    "@keyframes a3Led{from{transform:translateX(0)}to{transform:translateX(-360px)}}"+
    ".arco-svg .a3-flash{opacity:0;animation:a3Flash 4.4s steps(1) infinite}"+
    "@keyframes a3Flash{0%{opacity:0}3%{opacity:1}6%{opacity:0}}"+
    ".arco-svg .a3-foco{animation:a3Foco 3.2s ease-in-out infinite alternate}"+
    "@keyframes a3Foco{from{opacity:.75}to{opacity:1}}"+
    ".arco-svg.arco-golazo #arco-bulto{animation:a3Bulto .75s ease-out}"+
    "@keyframes a3Bulto{0%{opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.4)}30%{opacity:1;transform:scale(1.15)}100%{opacity:0;transform:scale(1.6)}}"+
    ".arco-svg.arco-golazo .a3-flash{animation-duration:.6s}"+
    ".arco-svg .a3-papel{animation:a3Cae 2s linear forwards}"+
    "@keyframes a3Cae{from{transform:translateY(0) rotate(0)}to{transform:translateY(var(--caida,300px)) rotate(540deg)}}"+
    ".arco-svg #a3-pateador.a3-festeja .a3-pat{animation:a3Festeja .5s ease-in-out 5 alternate}"+
    "@keyframes a3Festeja{from{transform:translate(0,0)}to{transform:translate(-26px,-16px)}}"+
    ".arco-svg #a3-pateador.a3-festeja .arco-brazo{transform:rotate(-150deg);transform-box:fill-box;transform-origin:top}"+
    "body.perf .arco-svg .a3-desenfoque{filter:none}"+
    "body.perf .arco-svg .a3-led,body.perf .arco-svg .a3-flash,body.perf .arco-svg .a3-foco{animation:none}"+
    "@media (prefers-reduced-motion:reduce){.arco-svg .a3-led,.arco-svg .a3-flash,.arco-svg .a3-foco,.arco-svg .a3-papel{animation:none}}";
  document.head.appendChild(st);
}
