"use strict";
/* ============================================================
   FUTBOLINI · arco3d.js  (7.9068)
   Pedido del autor (etapa 3, tarea 18): penal, tiro libre y córner "nivel Score Hero / FIFA 16",
   estadio más real y que la escena no crezca sola.

   RECONSTRUCCIÓN DEL DIBUJO, NO DE LA LÓGICA:
   - Antes el arco se dibujaba 2:1 (uno real es 3:1), la tribuna era un plano y la cancha no tenía
     líneas en perspectiva. Ahora todo se proyecta con una cámara de verdad (metros → pantalla):
     arco 7,32 × 2,44 con red de 2 m de fondo, área chica, área grande, punto penal y medialuna,
     franjas de corte de pasto, carteles LED, fotógrafos, tribuna de dos bandejas con techo y torres
     de luz, barrera a 9,15 m, jugadores escalados por distancia.
   - La lógica (penZona, tlClasificar, cornerClasificar, penResolver…) sigue en sus coordenadas de
     siempre (arco 50..310 × 38..168). Esta capa traduce: el dedo → coordenadas viejas, y las
     animaciones (pelota, arquero, mira) → pantalla. Así no cambia ninguna probabilidad.
   - Cámaras: penal a 1,8 m de alto (ojo de jugador), tiro libre a 3 m (transmisión), córner a 2,2 m.
     Las tres dejan el arco en el mismo lugar de la pantalla: la puntería se siente igual.
   - La pelota vuela con perspectiva correcta (se achica según 1/distancia), curva, estela, sombra en
     el pasto y la red se infla donde entra.
   - La escena no crece: el dibujo vive en una capa absoluta; el tamaño lo pone solo el escenario.
   ============================================================ */
const ARCO3D={gyLinea:150, fDc:33, pxMetro:54.6, bolaY:216, bolaR:0.11};
ARCO3D.gx0=180-ARCO3D.fDc*3.66; ARCO3D.gx1=180+ARCO3D.fDc*3.66;
/* cámara: h = altura, Zb = distancia de la pelota al arco. Se despeja la distancia de la cámara
   para que el arco quede fijo en pantalla y la pelota abajo al centro. */
function camaraArco(modo){
  const c={penal:{h:1.7,Zb:11}, tl:{h:2.8,Zb:20}, corner:{h:4.5,Zb:11}}[modo]||{h:1.7,Zb:11};
  const Dc=c.Zb+ARCO3D.fDc*c.h*c.Zb/(ARCO3D.bolaY-ARCO3D.gyLinea);
  return {modo:modo, h:c.h, Zb:c.Zb, Dc:Dc, f:ARCO3D.fDc*Dc, HZ:ARCO3D.gyLinea-ARCO3D.fDc*c.h};
}
function proyectar(cam,X,Y,Z){
  const d=Math.max(0.35,cam.Dc-Z);
  return {x:180+cam.f*X/d, y:cam.HZ+cam.f*(cam.h-Y)/d, k:cam.f/d};
}
/* la cámara viaja dentro del dibujo (así cualquier svg armado con htmlArcoVivo sabe traducirse) */
function _camDe(svg){
  if(!svg) return null;
  if(svg._cam) return svg._cam;
  const g=svg.querySelector&&svg.querySelector("#arco-cam");
  if(!g) return null;
  const v=(g.getAttribute("data-cam")||"").split(",").map(Number);
  const cam=camaraArco(g.getAttribute("data-modo")||"penal");
  cam.lbx=v[0]; cam.lby=v[1]; cam.sbx=v[2]; cam.sby=v[3];
  svg._cam=cam; return cam;
}
/* coordenadas viejas (lógica) → pantalla */
function arcoL2S(svg,xL,yL){
  const cam=_camDe(svg)||camaraArco("penal");
  if(cam.lbx!=null&&Math.abs(xL-cam.lbx)<3&&Math.abs(yL-cam.lby)<3){
    const kb=cam.f/(cam.Dc-cam.Zb); return {x:cam.sbx, y:cam.sby, k:kb};
  }
  const X=(xL-180)*7.32/260;
  if(yL<=168){ return proyectar(cam,X,(168-yL)*2.44/130,0); }
  const lby=cam.lby||220, Z=Math.min(cam.Dc-0.6,(yL-168)/Math.max(1,lby-168)*cam.Zb);
  return proyectar(cam,X,0,Z);
}
/* pantalla → coordenadas viejas (para el dedo) */
function arcoS2L(svg,xs,ys){
  const cam=_camDe(svg)||camaraArco("penal");
  if(ys<=ARCO3D.gyLinea){
    const X=(xs-180)*cam.Dc/cam.f, Y=cam.h-(ys-cam.HZ)*cam.Dc/cam.f;
    return {x:180+X*260/7.32, y:168-Y*130/2.44};
  }
  const d=cam.f*cam.h/Math.max(0.5,ys-cam.HZ), Z=cam.Dc-d, X=(xs-180)*d/cam.f;
  return {x:180+X*260/7.32, y:168+Z/cam.Zb*((cam.lby||220)-168)};
}
/* ---------- piezas del estadio ---------- */
function _a3Pal(hc){ return [hc[0],hc[1]||"#f4f4f4",hc[0],"#23293a",hc[2]||hc[0],"#e8e2d0","#3a4050",hc[1]||"#f4f4f4"]; }
function _a3PatronGente(id,paso,pal,sem){
  /* una fila de gente: torso con color, cabeza con piel; el tile se escala con la distancia */
  let g='<pattern id="'+id+'" width="'+(paso*6).toFixed(2)+'" height="'+(paso*1.6).toFixed(2)+'" patternUnits="userSpaceOnUse">';
  for(let i=0;i<6;i++){
    const x=(i+0.5)*paso+((i*7+sem)%3-1)*paso*0.08, cab=paso*0.2, y=paso*0.55+((i*5+sem)%3-1)*paso*0.05;
    g+='<rect x="'+(x-paso*0.32).toFixed(2)+'" y="'+(y+cab*0.9).toFixed(2)+'" width="'+(paso*0.64).toFixed(2)+'" height="'+(paso*0.9).toFixed(2)+'" rx="'+(paso*0.18).toFixed(2)+'" fill="'+pal[(i*3+sem)%pal.length]+'"/>'+
       '<circle cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="'+cab.toFixed(2)+'" fill="'+ARCO_PIELES[(i*2+sem)%ARCO_PIELES.length]+'"/>';
  }
  return g+'</pattern>';
}
function _a3Tribuna(cam,hc,sem){
  /* filas de gradería: cada metro de alto, 0,9 m más atrás (rake 42°), desde 8 m detrás del arco */
  const pal=_a3Pal(hc); let defs="", filas="", n=0;
  const banda=(H0,H1,clase,conGente,fill)=>{
    const a=proyectar(cam,0,H0,-8-H0*0.9), b=proyectar(cam,0,H1,-8-H1*0.9);
    const y0=Math.min(a.y,b.y), y1=Math.max(a.y,b.y);
    if(y1<-420||y0>260) return "";
    let s='<rect x="-40" y="'+y0.toFixed(1)+'" width="440" height="'+(y1-y0+0.6).toFixed(1)+'" fill="'+(fill||"#1d2433")+'"/>';
    if(conGente){
      const id="a3g"+(n++), paso=Math.max(1.1,0.44*a.k);
      defs+=_a3PatronGente(id,paso,pal,sem+n);
      s+='<rect class="'+clase+'" x="-40" y="'+(y0-paso*0.25).toFixed(1)+'" width="440" height="'+(y1-y0+paso*0.25).toFixed(1)+'" fill="url(#'+id+')"/>';
    }
    return s;
  };
  let inf="", sup="";
  for(let H=0;H<7;H+=1) inf+=banda(H,H+1,"arco-hinchas-b",true);
  const balcon=banda(7,8.2,"",false,"#2c3445");
  for(let H=8.2;H<16;H+=1.1) sup+=banda(H,H+1.1,"arco-hinchas-a",true);
  const techo0=proyectar(cam,0,17.5,-8-17.5*0.9), techo1=proyectar(cam,0,22,-8-15*0.9-6);
  /* lienzos de la barra en la bandeja baja */
  const l=proyectar(cam,0,2.2,-8-2.2*0.9), l2=proyectar(cam,0,3.4,-8-3.4*0.9), lh=Math.max(4,l.y-l2.y);
  const lienzos='<g opacity=".93">'+
    '<rect x="18" y="'+(l2.y).toFixed(1)+'" width="86" height="'+lh.toFixed(1)+'" fill="'+hc[0]+'"/><rect x="18" y="'+(l2.y+lh*0.36).toFixed(1)+'" width="86" height="'+(lh*0.28).toFixed(1)+'" fill="'+(hc[1]||"#fff")+'"/>'+
    '<rect x="252" y="'+(l2.y-lh*0.2).toFixed(1)+'" width="96" height="'+(lh*1.1).toFixed(1)+'" fill="'+(hc[1]||"#fff")+'"/><rect x="252" y="'+(l2.y-lh*0.2).toFixed(1)+'" width="96" height="'+(lh*0.34).toFixed(1)+'" fill="'+hc[0]+'"/>'+
  '</g>';
  /* techo con cercha y torres de luz en el borde */
  let luces="";
  [-150,-90,-30,30,90,150].forEach((x,i)=>{
    const lx=180+x*0.95, ly=techo0.y+2;
    luces+='<rect x="'+(lx-7)+'" y="'+(ly-3).toFixed(1)+'" width="14" height="5" rx="1.5" fill="#fffbe6"/>'+
      '<circle class="a3-foco" cx="'+lx+'" cy="'+(ly).toFixed(1)+'" r="26" fill="url(#a3Glow)" style="animation-delay:'+(i*0.37).toFixed(2)+'s"/>';
  });
  const techo='<rect x="-40" y="'+(techo1.y-40).toFixed(1)+'" width="440" height="'+(techo0.y-techo1.y+40).toFixed(1)+'" fill="#0a0e17"/>'+
    '<path d="'+Array.from({length:12},(_,i)=>"M"+(-40+i*40)+","+techo0.y.toFixed(1)+" L"+(-20+i*40)+","+(techo1.y-20).toFixed(1)).join(" ")+'" stroke="#1c2433" stroke-width="1.2"/>'+
    '<rect x="-40" y="'+(techo0.y-2).toFixed(1)+'" width="440" height="3" fill="#2a3346"/>';
  /* flashes de cámaras de la gente (se apagan en modo liviano) */
  let flashes="";
  for(let i=0;i<9;i++){
    const H=1+((i*37+sem)%13), p=proyectar(cam,0,H,-8-H*0.9);
    flashes+='<circle class="a3-flash" cx="'+(((i*83+sem*11)%360)).toFixed(0)+'" cy="'+p.y.toFixed(1)+'" r="1.3" fill="#fff" style="animation-delay:'+((i*0.73)%4.4).toFixed(2)+'s"/>';
  }
  const bruma='<rect x="-40" y="'+(techo1.y-40).toFixed(1)+'" width="440" height="'+(proyectar(cam,0,0,-8).y-techo1.y+40).toFixed(1)+'" fill="url(#a3Bruma)" pointer-events="none"/>';
  defs+='<linearGradient id="a3Bruma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(4,8,18,.55)"/><stop offset=".7" stop-color="rgba(6,12,26,.28)"/><stop offset="1" stop-color="rgba(6,12,26,.12)"/></linearGradient>'+
    '<filter id="a3Foco" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".45"/></filter>';
  return {defs:defs, svg:'<g id="arco-crowd" class="a3-gradas"><g class="a3-desenfoque" filter="url(#a3Foco)">'+techo+sup+balcon+inf+lienzos+'</g>'+bruma+flashes+luces+'</g>'};
}
function _a3Carteles(cam){
  /* LED a 4 m detrás de la línea, 0,9 m de alto, con texto que corre */
  const a=proyectar(cam,0,0.9,-4), b=proyectar(cam,0,0,-4), h=b.y-a.y;
  const sp=(typeof SPONSORS_CL!=="undefined"&&SPONSORS_CL.length)?SPONSORS_CL.slice(0,6):["Futbolini","Fútbol chileno"];
  const txt=(sp.join("  ·  ")+"  ·  ").toUpperCase();
  const fs=Math.max(5,h*0.5);
  return '<g id="arco-publi">'+
    '<rect x="-40" y="'+a.y.toFixed(1)+'" width="440" height="'+h.toFixed(1)+'" fill="url(#a3Led)"/>'+
    '<g class="a3-led"><text x="0" y="'+(a.y+h*0.72).toFixed(1)+'" font-family="system-ui,sans-serif" font-weight="900" font-size="'+fs.toFixed(1)+'" letter-spacing="2" fill="#cfefff">'+escHtml(txt+txt+txt)+'</text></g>'+
    '<rect x="-40" y="'+(b.y-1).toFixed(1)+'" width="440" height="1.2" fill="rgba(0,0,0,.45)"/>'+
  '</g>';
}
function _a3Fotografos(cam,sem){
  let s='<g class="a3-fotos">';
  [-12,-10.5,-8.6,8.2,9.9,11.8].forEach((X,i)=>{
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
  const lim=cam.Dc-0.6, top=proyectar(cam,0,0,-4).y;
  let s='<rect x="-40" y="'+top.toFixed(1)+'" width="440" height="'+(300-top).toFixed(1)+'" fill="url(#a3Pasto)"/>';
  /* franjas de corte cada 5 m (paralelas a la línea de gol) */
  for(let Z=-4,i=0;Z<lim;Z+=5,i++){
    const a=proyectar(cam,0,0,Z), b=proyectar(cam,0,0,Math.min(lim,Z+5));
    if(i%2) s+='<rect x="-40" y="'+a.y.toFixed(1)+'" width="440" height="'+(b.y-a.y).toFixed(1)+'" fill="rgba(0,40,10,.16)"/>';
  }
  return s;
}
function _a3Linea(cam,pts){
  /* línea de cal en el pasto: cada tramo con su ancho según la distancia */
  let s="";
  for(let i=0;i+1<pts.length;i++){
    const A=pts[i], B=pts[i+1];
    if(A[1]>cam.Dc-0.7&&B[1]>cam.Dc-0.7) continue;
    const a=proyectar(cam,A[0],0,Math.min(A[1],cam.Dc-0.7)), b=proyectar(cam,B[0],0,Math.min(B[1],cam.Dc-0.7));
    const w=Math.min(2.2,Math.max(0.6,0.12*(a.k+b.k)/2));
    s+='<line x1="'+a.x.toFixed(1)+'" y1="'+a.y.toFixed(1)+'" x2="'+b.x.toFixed(1)+'" y2="'+b.y.toFixed(1)+'" stroke-width="'+w.toFixed(2)+'"/>';
  }
  return s;
}
function _a3Lineas(cam,modo){
  let s='<g class="a3-cal" stroke="rgba(255,255,255,.85)" stroke-linecap="butt" fill="none">';
  s+=_a3Linea(cam,[[-40,0],[40,0]]);
  s+=_a3Linea(cam,[[-9.16,0],[-9.16,5.5],[9.16,5.5],[9.16,0]]);
  s+=_a3Linea(cam,[[-20.16,0],[-20.16,16.5],[20.16,16.5],[20.16,0]]);
  const arco=[]; for(let a=-53;a<=53;a+=6){ const r=a*Math.PI/180; arco.push([9.15*Math.sin(r),11+9.15*Math.cos(r)]); }
  s+=_a3Linea(cam,arco);
  s+='</g>';
  if(cam.Dc-11>0.8&&modo!=="tl"){ const p=proyectar(cam,0,0,11); s+='<ellipse cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" rx="'+(0.09*p.k).toFixed(2)+'" ry="'+(0.03*p.k).toFixed(2)+'" fill="#fff" opacity=".92"/>'; }
  return s;
}
function _a3Arco(cam){
  const P=(X,Y,Z)=>proyectar(cam,X,Y,Z), q=(p)=>p.x.toFixed(1)+","+p.y.toFixed(1);
  const W=3.66, H=2.44, Zt=-1.0, Zb=-2.0;
  const fl=P(-W,0,0), fr=P(W,0,0), tl=P(-W,H,0), tr=P(W,H,0);
  const btl=P(-W,H,Zt), btr=P(W,H,Zt), bbl=P(-W,0,Zb), bbr=P(W,0,Zb);
  let red='<g id="arco-red">';
  /* sombra del arco en el pasto */
  red+='<polygon points="'+[fl,fr,bbr,bbl].map(q).join(" ")+'" fill="rgba(0,0,0,.18)"/>';
  red+='<polygon points="'+[btl,btr,bbr,bbl].map(q).join(" ")+'" fill="url(#arcoMalla)" opacity=".55"/>';
  red+='<g stroke="rgba(236,244,255,.34)" stroke-width=".45" fill="none">';
  for(let X=-W;X<=W+0.01;X+=0.3){ red+='<line x1="'+P(X,H,Zt).x.toFixed(1)+'" y1="'+P(X,H,Zt).y.toFixed(1)+'" x2="'+P(X,0,Zb).x.toFixed(1)+'" y2="'+P(X,0,Zb).y.toFixed(1)+'"/>'; }
  for(let t=0;t<=1.001;t+=0.1){ const Y=H*(1-t), Z=Zt+(Zb-Zt)*t; red+='<line x1="'+P(-W,Y,Z).x.toFixed(1)+'" y1="'+P(-W,Y,Z).y.toFixed(1)+'" x2="'+P(W,Y,Z).x.toFixed(1)+'" y2="'+P(W,Y,Z).y.toFixed(1)+'"/>'; }
  /* techo y costados de la red */
  for(let X=-W;X<=W+0.01;X+=0.3){ red+='<line x1="'+P(X,H,0).x.toFixed(1)+'" y1="'+P(X,H,0).y.toFixed(1)+'" x2="'+P(X,H,Zt).x.toFixed(1)+'" y2="'+P(X,H,Zt).y.toFixed(1)+'" opacity=".6"/>'; }
  [-W,W].forEach(X=>{
    for(let t=0;t<=1.001;t+=0.125){ const Y=H*(1-t), Z=Zt+(Zb-Zt)*t; red+='<line x1="'+P(X,Y,0).x.toFixed(1)+'" y1="'+P(X,Y,0).y.toFixed(1)+'" x2="'+P(X,Y,Z).x.toFixed(1)+'" y2="'+P(X,Y,Z).y.toFixed(1)+'"/>'; }
    for(let Z=0;Z>=Zb-0.01;Z-=0.3){ const Y=Z>Zt?H:H*(Z-Zb)/(Zt-Zb); red+='<line x1="'+P(X,0,Z).x.toFixed(1)+'" y1="'+P(X,0,Z).y.toFixed(1)+'" x2="'+P(X,Math.max(0,Y),Z).x.toFixed(1)+'" y2="'+P(X,Math.max(0,Y),Z).y.toFixed(1)+'"/>'; }
  });
  red+='</g>';
  /* fierros de atrás */
  red+='<path d="M'+q(tl)+' L'+q(btl)+' L'+q(bbl)+' M'+q(tr)+' L'+q(btr)+' L'+q(bbr)+' M'+q(bbl)+' L'+q(bbr)+'" stroke="#9aa7b6" stroke-width="1" fill="none" opacity=".8"/>';
  red+='</g>';
  const g=0.12*fl.k/2;
  const palos='<rect id="arco-poste-izq" x="'+(fl.x-g).toFixed(1)+'" y="'+(tl.y-g).toFixed(1)+'" width="'+(2*g).toFixed(2)+'" height="'+(fl.y-tl.y+g).toFixed(1)+'" fill="url(#arcoPalo)"/>'+
    '<rect id="arco-poste-der" x="'+(fr.x-g).toFixed(1)+'" y="'+(tr.y-g).toFixed(1)+'" width="'+(2*g).toFixed(2)+'" height="'+(fr.y-tr.y+g).toFixed(1)+'" fill="url(#arcoPalo)"/>'+
    '<rect id="arco-travesano" x="'+(tl.x-g).toFixed(1)+'" y="'+(tl.y-g).toFixed(1)+'" width="'+(tr.x-tl.x+2*g).toFixed(1)+'" height="'+(2*g).toFixed(2)+'" fill="url(#arcoPaloH)"/>';
  return {red:red, palos:palos};
}
function _a3Figura(cam,X,Z,kit,cls,o){
  const p=proyectar(cam,X,0,Z), k=p.k/ARCO3D.pxMetro;
  return {z:Z, svg:_figJugador(p.x,p.y,kit,cls,Object.assign({escala:k},o||{}))};
}
/* ---------- la escena completa (mismos ids que antes: la lógica y los tests los usan) ---------- */
function htmlArcoVivo(opts){
  opts=opts||{};
  const barrera=!!opts.barrera, modo=opts.modo||(barrera?"tl":"penal");
  const cam=camaraArco(modo);
  const kitArq=opts.kitArq||["#1a6ad4","#111827"], kitWall=opts.kitWall||["#c0392b","#1a1a28"], kitAtk=opts.kitAtk||["#f4f4f4","#111111"];
  const hc=opts.hinchada||[kitAtk[0],kitAtk[1]];
  const sem=_arcoHash(opts.semilla||kitArq.join(""));
  const lbx=opts.bolaX!=null?opts.bolaX:180, lby=opts.bolaY!=null?opts.bolaY:220;
  /* pelota: al centro abajo; en el córner, en la esquina */
  let sbx=180, sby=ARCO3D.bolaY;
  if(modo==="corner"){ sbx=opts.lado==="der"?312:48; sby=226; }
  const kb=cam.f/(cam.Dc-cam.Zb), bolaS=(ARCO3D.bolaR*kb/8)*(modo==="corner"?1.05:1);
  const trib=_a3Tribuna(cam,hc,sem), arco=_a3Arco(cam);
  /* arquero en la línea */
  const arqXL=opts.arqX!=null?opts.arqX:180, pa=proyectar(cam,(arqXL-180)*7.32/260,0,0), escArq=pa.k/ARCO3D.pxMetro;
  const arq='<g id="arco-arq" transform="translate('+pa.x.toFixed(1)+' '+pa.y.toFixed(1)+') scale('+escArq.toFixed(3)+')" data-x="'+pa.x.toFixed(1)+'" data-y="'+pa.y.toFixed(1)+'" data-esc="'+escArq.toFixed(3)+'">'+
    '<g class="arq-idle">'+_figPersona({kit:kitArq, pose:"arq", piel:ARCO_PIELES[sem%ARCO_PIELES.length], pelo:ARCO_PELOS[(sem>>3)%ARCO_PELOS.length]})+'</g></g>';
  /* barrera a 9,15 m de la pelota: cubre lo mismo que la zona de barrera de la lógica */
  let wall="", spray="";
  if(barrera){
    const Zw=cam.Zb-9.15, d=cam.Dc-Zw;
    const xs=[151,169,187,205].map(x=>ARCO3D.gx0+(x-50)*(ARCO3D.gx1-ARCO3D.gx0)/260);
    wall='<g id="arco-wall">'+xs.map((x,i)=>_a3Figura(cam,(x-180)*d/cam.f,Zw,i%2?[kitWall[0],kitWall[1]]:kitWall,"arco-muro",{i:i+sem,pose:"muro"}).svg).join("")+'</g>';
    const s0=proyectar(cam,-2.2,0,Zw-0.35), s1=proyectar(cam,2.2,0,Zw-0.35);
    spray='<line x1="'+s0.x.toFixed(1)+'" y1="'+s0.y.toFixed(1)+'" x2="'+s1.x.toFixed(1)+'" y2="'+s1.y.toFixed(1)+'" stroke="#fff" stroke-width="'+(0.08*s0.k).toFixed(2)+'" stroke-dasharray="2 2.5" opacity=".75"/>';
  }
  /* área en el córner: marcadores de frente, los tuyos de espalda (lejos primero) */
  let area="";
  if(modo==="corner"){
    const figs=[
      _a3Figura(cam,-2.9,3.2,kitWall,"arco-def",{i:sem+1}), _a3Figura(cam,2.4,3.6,kitWall,"arco-def",{i:sem+2}), _a3Figura(cam,0.3,6.4,kitWall,"arco-def",{i:sem+3}),
      _a3Figura(cam,-3.8,4.6,kitAtk,"arco-atk",{i:sem+4,espalda:true,num:4}), _a3Figura(cam,3.6,5.2,kitAtk,"arco-atk",{i:sem+5,espalda:true,num:2}), _a3Figura(cam,-0.8,7.6,kitAtk,"arco-atk",{i:sem+6,espalda:true,num:9})
    ].sort((a,b)=>a.z-b.z);
    area='<g id="arco-area">'+figs.map(f=>f.svg).join("")+'</g>'+
      '<g id="arco-flag" transform="translate('+(opts.lado==="der"?326:34)+' 238)"><rect x="-1" y="-40" width="2.2" height="40" fill="#f4f4f4"/><polygon points="1.2,-40 22,-33 1.2,-25" fill="#f0c419"/></g>'+
      '<path d="M'+(opts.lado==="der"?340:20)+',226 A 16 9 0 0 '+(opts.lado==="der"?0:1)+' '+(opts.lado==="der"?324:36)+',240" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/>';
  }
  const cien=proyectar(cam,0,0,-4).y;
  return ''+
    '<g id="arco-cam" data-modo="'+modo+'" data-cam="'+[lbx,lby,sbx,sby].join(",")+'"></g>'+
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
    '<rect x="-40" y="-520" width="440" height="'+(520+cien).toFixed(0)+'" fill="url(#arcoCielo)"/>'+
    trib.svg+
    _a3Carteles(cam)+
    _a3Pasto(cam)+
    _a3Fotografos(cam,sem)+
    _a3Lineas(cam,modo)+
    arco.red+
    '<circle id="arco-bulto" cx="180" cy="110" r="14" fill="url(#a3Bulto)" opacity="0"/>'+
    arq+
    arco.palos+
    spray+wall+area+
    '<rect x="-40" y="-520" width="440" height="820" fill="url(#arcoVineta)" pointer-events="none"/>'+
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
    '</g>';
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
    const mx=(a.x+b.x)/2+(b.x-a.x)*0.12, my=Math.min(a.y,b.y)-22-Math.abs(a.y-b.y)*0.25;
    tray.setAttribute("d","M"+a.x.toFixed(1)+","+a.y.toFixed(1)+" Q"+mx.toFixed(1)+","+my.toFixed(1)+" "+b.x.toFixed(1)+","+b.y.toFixed(1));
    tray.setAttribute("stroke",col); tray.setAttribute("opacity",".85");
  }
}
/* la pelota vuela con perspectiva: tamaño según 1/distancia, curva, estela y sombra en el pasto */
function _animBola(bolaG, x0,y0, x1,y1, ms, cb, s1){
  const svg=bolaG.ownerSVGElement;
  const a=arcoL2S(svg,x0,y0), b=arcoL2S(svg,x1,y1);
  const s0=parseFloat(bolaG.getAttribute("data-s"))||1;
  const sEnd=s1!=null?s1:Math.max(0.18,ARCO3D.bolaR*b.k/8);
  const sombra=svg&&svg.querySelector("#arco-bola-sombra"), rastro=svg&&svg.querySelector("#arco-rastro");
  const enArco=(y1<=168), piso0={x:a.x,y:a.y+8*s0}, piso1=enArco?{x:b.x,y:ARCO3D.gyLinea+2}:{x:b.x,y:b.y+8*sEnd};
  const dist=Math.hypot(b.x-a.x,b.y-a.y), lift=Math.min(42,10+dist*0.14), curl=(b.x-a.x)*0.16;
  const cx=(a.x+b.x)/2+curl, cy=Math.min(a.y,b.y)-lift;
  const quieto=(typeof document!=="undefined")&&document.body&&document.body.classList.contains("perf");
  const ghosts=[];
  if(rastro&&!quieto){ rastro.innerHTML=""; for(let i=0;i<4;i++){ const c=document.createElementNS("http://www.w3.org/2000/svg","circle"); c.setAttribute("r","0"); c.setAttribute("fill","rgba(255,255,255,"+(0.28-i*0.06)+")"); rastro.appendChild(c); ghosts.push(c); } }
  const hist=[];
  const bulto=svg&&svg.querySelector("#arco-bulto");
  if(bulto&&enArco){ bulto.setAttribute("cx",b.x.toFixed(1)); bulto.setAttribute("cy",b.y.toFixed(1)); bulto.setAttribute("r",(10+18*sEnd).toFixed(1)); }
  const t0=performance.now();
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
/* el arquero se tira en pantalla: el guante (no la cabeza) va a la pelota */
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
  const lado=kdir==="der"||(kdir==="centro"&&tx>x0)?"der":"izq";
  const gl=_arqGuanteLocal(lado, brazo);
  const vx=tx-cad.x, vy=ty-cad.y, d=Math.hypot(vx,vy)||1;
  let rot=(Math.atan2(vx,-vy)-Math.atan2(gl.x,-gl.y))*180/Math.PI;
  if(rot>180) rot-=360; if(rot<-180) rot+=360;
  const tope=kdir==="centro"?24:112;
  rot=Math.max(-tope,Math.min(tope,rot));
  const escala=(ARCO3D.gx1-ARCO3D.gx0)/260;
  const alcance=Math.hypot(gl.x,gl.y)*esc, corto=(!opts.ataja&&aim&&kdir===aim.tercio)?18*escala:0;
  const mov=Math.max(0,Math.min((kdir==="centro"?14:90)*escala, d-alcance-corto));
  return {x0:x0, y0:y0, esc:esc, dx:vx/d*mov, dy:vy/d*mov, rot:rot, brazo:brazo};
}
/* ---------- el escenario no crece: el dibujo vive en una capa absoluta ---------- */
if(typeof document!=="undefined"&&!document.getElementById("css-arco3d")){
  const st=document.createElement("style"); st.id="css-arco3d";
  st.textContent=
    ".escena-3d .e3d-stage{contain:layout paint}"+
    ".escena-3d .e3d-world{position:absolute !important;inset:0 !important;width:auto !important;height:auto !important}"+
    ".escena-3d .e3d-world>svg{position:absolute;inset:0;width:100% !important;height:100% !important}"+
    "@media (max-width:760px){html body .modal.escena-3d .e3d-stage.e3d-v2{flex:1 1 auto !important;aspect-ratio:auto !important;min-height:250px !important;max-height:none !important;margin:0 !important}}"+
    ".arco-svg .a3-led{animation:a3Led 26s linear infinite}"+
    "@keyframes a3Led{from{transform:translateX(0)}to{transform:translateX(-360px)}}"+
    ".arco-svg .a3-flash{opacity:0;animation:a3Flash 4.4s steps(1) infinite}"+
    "@keyframes a3Flash{0%{opacity:0}3%{opacity:1}6%{opacity:0}}"+
    ".arco-svg .a3-foco{animation:a3Foco 3.2s ease-in-out infinite alternate}"+
    "@keyframes a3Foco{from{opacity:.75}to{opacity:1}}"+
    ".arco-svg.arco-golazo #arco-bulto{animation:a3Bulto .75s ease-out}"+
    "@keyframes a3Bulto{0%{opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.4)}30%{opacity:1;transform:scale(1.15)}100%{opacity:0;transform:scale(1.6)}}"+
    ".arco-svg.arco-golazo .a3-flash{animation-duration:.6s}"+
    "body.perf .arco-svg .a3-desenfoque{filter:none}"+
    "body.perf .arco-svg .a3-led,body.perf .arco-svg .a3-flash,body.perf .arco-svg .a3-foco{animation:none}"+
    "@media (prefers-reduced-motion:reduce){.arco-svg .a3-led,.arco-svg .a3-flash,.arco-svg .a3-foco{animation:none}}";
  document.head.appendChild(st);
}
/* marca el escenario nuevo (para la regla de celular) sin tocar _abrirEscenaArco por dentro */
(function(){
  const o=window._abrirEscenaArco; if(typeof o!=="function"||o._a3) return;
  const w=function(){ const r=o.apply(this,arguments); try{ if(r&&r.stage) r.stage.classList.add("e3d-v2"); }catch(e){} return r; };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._a3=true; window._abrirEscenaArco=w;
})();
