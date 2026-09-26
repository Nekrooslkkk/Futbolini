"use strict";
/* ============================================================
   FUTBOLINI · ui-jornada.js  (7.9011 · "que se sienta movido")
   La liga deja de ser una lista estática: la fecha se JUEGA delante tuyo.
   - captura la tabla antes/después de cada partido tuyo (wrap de terminarPartido)
   - jornadaEnVivo(): los otros partidos aparecen uno a uno y la tabla se mueve
   - panelJornada(): en el escritorio, "la liga se movió" (fecha + subidas/bajadas + mundo)
   - parteSemana(): el resumen de la semana al Avanzar, en vez de un toast pelado
   Carril Claude: NO toca partido.js / ui-partido.js / mercado.js / util.js / nube.js.
   ============================================================ */

/* ---------- helpers ---------- */
function _jorSinAnim(){
  try{
    if(document.body.classList.contains("perf")) return true;
    if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches) return true;
  }catch(e){}
  return false;
}
function _jorT(k,d){ return (typeof T==="function")?T(k,d):d; }
/* posición de cada club en la tabla, hoy */
function _jorPosMapa(){
  const m={};
  try{
    if(typeof tablaOrdenada!=="function") return m;
    tablaOrdenada().forEach(function(c,i){ if(c&&c.id) m[c.id]={pos:i+1,n:c.n||c.id,pts:c.pts||0}; });
  }catch(e){}
  return m;
}

/* 7.9013 · foto de la tabla completa, para saber qué le pasó a CADA club en la fecha */
function _jorTablaSnap(){
  const m={};
  try{
    Object.keys((E&&E.tabla)||{}).forEach(function(id){
      const t=E.tabla[id]||{};
      m[id]={pj:t.pj||0,pts:t.pts||0,gf:t.gf||0,gc:t.gc||0};
    });
  }catch(e){}
  return m;
}
/* Racha real de cada club: se deduce del delta de su fila de tabla en esta fecha.
   No hace falta tocar el motor ni guardar partido por partido. */
function _jorForma(antesTab){
  if(!E) return;
  if(!E.forma||typeof E.forma!=="object") E.forma={};
  const pv=(typeof puntosVictoria==="function")?puntosVictoria():3;
  Object.keys(E.tabla||{}).forEach(function(id){
    const t=E.tabla[id]||{}, a=antesTab[id];
    if(!a) return;
    if((t.pj||0)-(a.pj||0)!==1) return;                 /* no jugó esta fecha */
    const dpts=(t.pts||0)-(a.pts||0);
    const r=(dpts>=pv)?"V":(dpts===1?"E":"D");
    const arr=E.forma[id]||(E.forma[id]=[]);
    arr.push({r:r,gf:(t.gf||0)-(a.gf||0),gc:(t.gc||0)-(a.gc||0),anio:E.anio,f:E.idx||0});
    if(arr.length>5) arr.splice(0,arr.length-5);
  });
}
/* Últimos 5 de un club, del más nuevo al más viejo. */
function formaClub(id){
  const arr=(E&&E.forma&&E.forma[id])||[];
  return arr.slice(-5).reverse();
}
/* ¿Cómo te fue la última vez contra este rival, este año? */
function ultimoCruce(rivalId,rivalNombre){
  const cal=(E&&E.calendario)||[];
  for(let i=cal.length-1;i>=0;i--){
    const c=cal[i];
    if(!c||!c.jugado) continue;
    const mismo=(rivalId&&c.rivalId===rivalId)||(rivalNombre&&c.rivalNombre===rivalNombre);
    if(!mismo) continue;
    return {gf:c.gf||0,gc:c.gc||0,local:!!c.local};
  }
  return null;
}
/* 7.9025 · INVARIANTE: `E.idx` apunta SIEMPRE al primer compromiso sin jugar.
   `terminarPartido` hace un `E.idx++` ciego. Si una inserción ordenada por fecha
   dejó un partido YA jugado justo después (caso real medido: la Liguilla de la B
   tiene la semifinal el 15/11 y la fecha 30 regular es el 16/11, así que el sort
   la mete antes), el índice aterriza en un partido jugado, `avanzar()` procesa
   semanas sin moverse y el juego queda pegado PARA SIEMPRE. Esta red salta los ya
   jugados. Corre también en simulación masiva: ahí el cuelgue era igual. */
function _jorSaltarJugados(){
  if(!E||!Array.isArray(E.calendario)) return 0;
  let n=0;
  while(E.idx<E.calendario.length && E.calendario[E.idx] && E.calendario[E.idx].jugado){ E.idx++; n++; }
  return n;
}
/* ---------- captura de la jornada ---------- */
/* Corre alrededor de terminarPartido: antes anota dónde estaba cada club,
   después compara. Así sabemos QUIÉN subió y quién bajó por esta fecha. */
function _jorGuardar(part,res,antes){
  if(!E||E._bulkSim) return;
  const desp=_jorPosMapa();
  const mov=[];
  Object.keys(desp).forEach(function(id){
    const a=antes[id]; if(!a) return;
    if(a.pos!==desp[id].pos) mov.push({id:id,n:desp[id].n,de:a.pos,a:desp[id].pos});
  });
  mov.sort(function(x,y){ return Math.abs(y.de-y.a)-Math.abs(x.de-x.a); });
  E.ultimaJornada={
    anio:E.anio, idx:E.idx,
    fecha:(part&&part.fecha)||null,
    torneo:(part&&part.torneo)||"",
    mio:{ yo:(res&&res.yo)||0, otro:(res&&res.otro)||0,
          rival:(part&&part.rivalNombre)||"", local:!!(part&&part.local),
          club:(E.clubNombre||""), pos:(desp[E.club]&&desp[E.club].pos)||null,
          posAntes:(antes[E.club]&&antes[E.club].pos)||null },
    otros:(E.ultimaFecha||[]).slice(0,12),
    mov:mov.slice(0,8),
    mundo:((E.mundo&&E.mundo.pais)||[]).slice(-5),
    vista:false
  };
}
(function(){
  if(typeof terminarPartido!=="function"||terminarPartido._jor10) return;
  const orig=terminarPartido;
  window.terminarPartido=function(P){
    const antes=_jorPosMapa();
    const antesTab=_jorTablaSnap();
    const res=orig.apply(this,arguments);
    try{ _jorSaltarJugados(); }catch(e){}
    try{ _jorGuardar((P&&P.part)||(P&&P.partido)||null,res,antes); }catch(e){}
    try{ if(!E||!E._bulkSim) _jorForma(antesTab); }catch(e){}
    return res;
  };
  window.terminarPartido._jor10=true;
})();

/* ---------- la fecha, en vivo ---------- */
/* Los otros partidos van cayendo uno a uno, como cuando escuchabas la radio
   y las canchas iban cerrando. Se puede saltar. */
function jornadaEnVivo(alCerrar){
  const J=E&&E.ultimaJornada;
  if(!J){ if(typeof alCerrar==="function") alCerrar(); return; }
  modal(function(box){
    const cuerpo=(typeof montarBarraSO==="function")
      ? montarBarraSO(box,_jorT("jor_tit","La fecha se juega"),"📻",function(){ _jorCerrar(alCerrar); })
      : (function(){ box.appendChild(el("div","cab",'<span class="ic">📻</span><span>'+_jorT("jor_tit","La fecha se juega")+'</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();

    const mio=J.mio||{};
    cuerpo.appendChild(el("p","arco-score",escHtml(mio.club||"")+"  "+mio.yo+" – "+mio.otro+"  "+escHtml(mio.rival||"")));
    cuerpo.appendChild(el("p","mini",_jorT("jor_resto","Mientras tanto, en las otras canchas:")));

    const lista=el("div","jor-lista");
    cuerpo.appendChild(lista);
    const pie=el("div"); cuerpo.appendChild(pie);

    const filas=(J.otros||[]).map(function(x){
      const f=el("div","jor-row");
      const gan=x.ga>x.gb?"a":(x.gb>x.ga?"b":"");
      f.innerHTML="<span"+(gan==="a"?" class='jor-gana'":"")+">"+escHtml(x.a)+"</span>"+
                  "<b class='jor-marca'>"+x.ga+" - "+x.gb+"</b>"+
                  "<span"+(gan==="b"?" class='jor-gana'":"")+">"+escHtml(x.b)+"</span>";
      return f;
    });

    let i=0, tmr=null;
    function cerrarFin(){
      if(tmr){ clearTimeout(tmr); tmr=null; }
      while(i<filas.length){ filas[i].classList.add("jor-in"); lista.appendChild(filas[i]); i++; }
      if(btnSalta) btnSalta.remove();
      _jorTabla(pie);
      _jorBotones(pie,alCerrar);
    }
    function paso(){
      if(i>=filas.length){ cerrarFin(); return; }
      lista.appendChild(filas[i]);
      /* el reflow es lo que dispara la animación de entrada */
      void filas[i].offsetWidth;
      filas[i].classList.add("jor-in");
      i++;
      tmr=setTimeout(paso,340);
    }
    let btnSalta=null;
    if(!filas.length){ cerrarFin(); }
    else if(_jorSinAnim()){ cerrarFin(); }
    else {
      btnSalta=el("button","btn-aqua chico gris","⏩ "+_jorT("jor_saltar","Saltar a los resultados"));
      btnSalta.onclick=cerrarFin;
      cuerpo.appendChild(btnSalta);
      paso();
    }
  },{cerrarFuera:false,clase:"ventana-so"});
}
function _jorCerrar(cb){
  if(E&&E.ultimaJornada) E.ultimaJornada.vista=true;
  if(typeof guardar==="function") guardar();
  cerrarModal();
  if(typeof cb==="function") cb(); else if(typeof irA==="function") irA("escritorio");
}
/* cómo quedó la tabla después de la fecha */
function _jorTabla(cont){
  const J=E&&E.ultimaJornada; if(!J) return;
  const mio=J.mio||{};
  cont.appendChild(el("h3","sub",_jorT("jor_tabla","Cómo quedó la tabla")));
  if(mio.pos){
    const dif=(mio.posAntes||mio.pos)-mio.pos;
    const flecha=dif>0?("▲ "+dif):(dif<0?("▼ "+Math.abs(dif)):"=");
    cont.appendChild(el("p",null,"<b>"+escHtml(mio.club||"")+"</b> · "+
      (typeof ordinal==="function"?ordinal(mio.pos):mio.pos+"°")+" "+
      "<span class='jor-mov "+(dif>0?"sube":(dif<0?"baja":""))+"'>"+flecha+"</span>"));
  }
  const mov=(J.mov||[]).filter(function(m){ return m.id!==E.club; }).slice(0,5);
  if(mov.length){
    mov.forEach(function(m){
      const dif=m.de-m.a;
      cont.appendChild(el("div","fila","<span>"+escHtml(m.n)+"</span><b class='jor-mov "+(dif>0?"sube":"baja")+"'>"+
        (dif>0?"▲":"▼")+" "+(typeof ordinal==="function"?ordinal(m.de):m.de+"°")+" → "+
        (typeof ordinal==="function"?ordinal(m.a):m.a+"°")+"</b>"));
    });
  } else cont.appendChild(el("p","mini",_jorT("jor_quieta","La tabla no se movió con esta fecha.")));
  const mundo=(J.mundo||[]).slice(-3);
  if(mundo.length){
    cont.appendChild(el("h3","sub",_jorT("jor_mundo","Mientras tanto, afuera")));
    mundo.forEach(function(x){
      cont.appendChild(el("div","fila mini","<span>"+escHtml((x.liga?x.liga+" · ":"")+x.a+" vs "+x.b)+"</span><b>"+x.ga+"-"+x.gb+"</b>"));
    });
  }
}
function _jorBotones(cont,cb){
  const b1=el("button","btn-aqua ancho verde",_jorT("jor_tabla_ver","Ver la tabla completa"));
  b1.onclick=function(){ _jorCerrar(function(){ if(typeof irA==="function") irA("calendario"); }); };
  const b2=el("button","btn-aqua ancho",_jorT("jor_esc","Al escritorio"));
  b2.style.marginTop="6px";
  b2.onclick=function(){ _jorCerrar(cb); };
  cont.appendChild(b1); cont.appendChild(b2);
}

/* ---------- panel de escritorio: la liga se movió ---------- */
function panelJornada(){
  const J=E&&E.ultimaJornada;
  if(!J||(!((J.otros||[]).length)&&!((J.mov||[]).length))) return null;
  const p=panel(_jorT("jor_panel","La liga se movió"),"📻","agua");
  if(!J.vista){
    const b=el("button","btn-aqua ancho verde","▶ "+_jorT("jor_ver","Ver cómo se jugó la fecha"));
    b.onclick=function(){ jornadaEnVivo(function(){ if(typeof render==="function") render(); }); };
    p.cuerpo.appendChild(b);
  }
  (J.otros||[]).slice(0,5).forEach(function(x){
    p.cuerpo.appendChild(el("div","fila","<span>"+escHtml(x.a+" vs "+x.b)+"</span><b>"+x.ga+"-"+x.gb+"</b>"));
  });
  const mov=(J.mov||[]).slice(0,3);
  mov.forEach(function(m){
    const dif=m.de-m.a;
    p.cuerpo.appendChild(el("div","fila mini","<span>"+escHtml(m.n)+"</span><b class='jor-mov "+(dif>0?"sube":"baja")+"'>"+
      (dif>0?"▲":"▼")+" "+(typeof ordinal==="function"?ordinal(m.a):m.a+"°")+"</b>"));
  });
  /* 7.9013 · si mandas la asociación, el escritorio lo dice en una línea */
  try{
    const lnFed=(typeof fedLineaEscritorio==="function")?fedLineaEscritorio():null;
    if(lnFed) p.cuerpo.appendChild(el("div","fila mini","<span>"+escHtml(lnFed)+"</span>"));
  }catch(e){}
  const bc=el("button","btn-aqua chico",_jorT("jor_cal","Ir al calendario"));
  bc.onclick=function(){ if(typeof irA==="function") irA("calendario"); };
  p.cuerpo.appendChild(bc);
  if(J.vista){
    const br=el("button","btn-aqua chico gris","↻ "+_jorT("jor_repetir","Repetir la fecha"));
    br.style.marginLeft="6px";
    br.onclick=function(){ jornadaEnVivo(function(){ if(typeof render==="function") render(); }); };
    p.cuerpo.appendChild(br);
  }
  return p;
}

/* ---------- 7.9046 · LLAVES EN VIVO (liguilla / copas) ----------
   Pedido del autor: "quiero VER los cuartos antes de la semi". Las llaves ajenas se
   resolvían de un golpe y solo llegaba un aviso. Ahora la vuelta se juega delante tuyo:
   reloj, goles en su minuto, global que se mueve y, si empata, penales. */
function _llNom(id){ return (typeof _nomClub==="function")?_nomClub(id):id; }
function _llMinutos(n, clave){
  const rng=(typeof _mAzar==="function")?_mAzar("vivo|"+clave):Math.random;
  const out=[]; let g=0;
  while(out.length<n && g++<200){ const m=1+Math.floor(rng()*90); if(out.indexOf(m)<0) out.push(m); }
  return out.sort((a,b)=>a-b);
}
/* marca la ronda para que el escritorio ofrezca verla (una vez por ronda) */
function marcarLlavesParaVer(tor, ronda){
  if(!E) return;
  E.llavesVer={tor:tor, ronda:ronda, anio:E.anio, vista:false};
}
function _llLista(){
  const L=E&&E.llavesVer; if(!L||L.anio!==E.anio) return null;
  if(L.tor==="ligB"){ const lb=E.mundo&&E.mundo.ligB; return lb&&lb.rondas[L.ronda]?lb.rondas[L.ronda]:null; }
  const pack=E.mundo&&E.mundo.copas&&E.mundo.copas[L.tor];
  return pack&&pack.ko&&pack.ko.rondas[L.ronda]?pack.ko.rondas[L.ronda]:null;
}
function llavesEnVivo(alCerrar){
  const L=E&&E.llavesVer, lista=_llLista();
  if(!L||!lista||!lista.length){ if(typeof alCerrar==="function") alCerrar(); return; }
  const nomTor=L.tor==="ligB"?"Liguilla de Ascenso":(L.tor==="chile"?"Copa Chile":"Copa de la Liga");
  modal(function(box){
    const cuerpo=(typeof montarBarraSO==="function")
      ? montarBarraSO(box,nomTor+" · "+L.ronda+" en vivo","📺",function(){ fin(true); })
      : (function(){ box.appendChild(el("div","cab",'<span class="ic">📺</span><span>'+nomTor+" · "+L.ronda+'</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();
    const reloj=el("div","ll-reloj","0'");
    cuerpo.appendChild(el("p","mini","Se juegan las vueltas al mismo tiempo. El global suma la ida; si empata, penales"+(L.ronda==="FINAL"?" (antes, alargue)":"")+"."));
    cuerpo.appendChild(reloj);
    const filas=lista.map(function(t){
      const ida=t.unica?null:t.legs[0], vta=t.unica?t.legs[0]:t.legs[1];
      const locV=t.unica?t.a:t.b, visV=locV===t.a?t.b:t.a;
      const f=el("div","ll-row"+((E.club===t.a||E.club===t.b)?" ll-mia":""));
      f.innerHTML="<div class='ll-cab'><span>"+escHtml(_llNom(locV))+"</span><b class='ll-marc'>0 - 0</b><span>"+escHtml(_llNom(visV))+"</span></div>"+
        "<div class='ll-pie mini'>"+(ida?"Ida: "+escHtml(_llNom(t.a))+" "+ida.ga+"-"+ida.gb+" "+escHtml(_llNom(t.b))+" · ":"")+"<span class='ll-glob'></span></div>";
      cuerpo.appendChild(f);
      const mins={l:vta?_llMinutos(vta.ga,t.a+t.b+"l"):[], v:vta?_llMinutos(vta.gb,t.a+t.b+"v"):[]};
      return {t:t, f:f, vta:vta, locV:locV, mins:mins};
    });
    const pie=el("div","ll-final"); cuerpo.appendChild(pie);
    let m=0, tmr=null, listo=false;
    function pintarMin(min){
      reloj.textContent=min>=90?"Final":(min+"'");
      filas.forEach(function(x){
        if(!x.vta) return;
        const gl=x.mins.l.filter(k=>k<=min).length, gv=x.mins.v.filter(k=>k<=min).length;
        const mEl=x.f.querySelector(".ll-marc"), prev=mEl.textContent;
        mEl.textContent=gl+" - "+gv;
        if(prev!==mEl.textContent && min>0){ mEl.classList.remove("ll-gol"); void mEl.offsetWidth; mEl.classList.add("ll-gol"); }
        const ida=x.t.unica?{ga:0,gb:0}:(x.t.legs[0]||{ga:0,gb:0});
        const ga=ida.ga+(x.locV===x.t.a?gl:gv), gb=ida.gb+(x.locV===x.t.a?gv:gl);
        x.f.querySelector(".ll-glob").textContent=x.t.unica?"":("Global: "+_llNom(x.t.a)+" "+ga+"-"+gb+" "+_llNom(x.t.b));
      });
    }
    function fin(cerrar){
      if(tmr){ clearTimeout(tmr); tmr=null; }
      if(!listo){
        listo=true; pintarMin(90);
        filas.forEach(function(x){
          const g=x.t.gana; if(!g) return;
          x.f.classList.add("ll-hecha");
          const extra=x.t.pens?(x.t.alargueGoles?" · alargue y penales":" · por penales"):"";
          x.f.querySelector(".ll-pie").insertAdjacentHTML("beforeend"," · <b class='ll-pasa'>Pasa "+escHtml(_llNom(g))+extra+"</b>");
        });
        const pasan=filas.map(x=>x.t.gana).filter(Boolean).map(_llNom);
        if(pasan.length) pie.appendChild(el("p",null,"<b>Pasan:</b> "+pasan.map(escHtml).join(" · ")));
        const sig=(typeof mundoLlaveLigB==="function"&&L.tor==="ligB")?mundoLlaveLigB(L.ronda==="Cuartos"?"Semifinal":"FINAL"):null;
        if(sig){ const riv=sig.a===E.club?sig.b:sig.a; pie.appendChild(el("p","ll-tuyo","👉 Tu rival en la "+(L.ronda==="Cuartos"?"semifinal":"final")+": <b>"+escHtml(_llNom(riv))+"</b>")); }
        const ok=el("button","btn-aqua ancho verde","Listo"); ok.onclick=function(){ fin(true); }; pie.appendChild(ok);
        if(salta) salta.remove();
        L.vista=true; if(typeof guardar==="function") guardar();
      }
      if(cerrar){ cerrarModal(); if(typeof alCerrar==="function") alCerrar(); }
    }
    function paso(){ m=Math.min(90,m+3); pintarMin(m); if(m>=90){ fin(false); return; } tmr=setTimeout(paso,160); }
    let salta=null;
    if(_jorSinAnim()){ fin(false); }
    else { salta=el("button","btn-aqua chico gris","⏩ Ver resultados"); salta.onclick=function(){ fin(false); }; cuerpo.appendChild(salta); pintarMin(0); tmr=setTimeout(paso,400); }
  },{cerrarFuera:false,clase:"ventana-so"});
}
function panelLlaves(){
  const L=E&&E.llavesVer, lista=_llLista();
  if(!L||!lista) return null;
  const pend=(E.calendario||[]).slice(E.idx||0).find(p=>p&&!p.jugado);
  if(L.vista && !(pend&&pend.torneo==="Liguilla de Ascenso")) return null;   /* ya la viste y pasó la ronda */
  const nomTor=L.tor==="ligB"?"Liguilla":"Copa";
  const p=panel(nomTor+" · "+L.ronda+(L.vista?"":" · se jugaron"),"📺","agua");
  if(!L.vista){
    p.cuerpo.appendChild(el("p","mini","Mientras tanto se jugaron las otras llaves. Tu próximo rival sale de acá."));
    const b=el("button","btn-aqua ancho verde","▶ Ver los "+L.ronda.toLowerCase()+" en vivo");
    b.onclick=function(){ llavesEnVivo(function(){ if(typeof render==="function") render(); }); };
    p.cuerpo.appendChild(b);
  } else {
    lista.forEach(function(t){ const g=(typeof _mGlobal==="function")?_mGlobal(t):[0,0];
      p.cuerpo.appendChild(el("div","fila mini","<span>"+escHtml(_llNom(t.a)+" vs "+_llNom(t.b))+"</span><b>"+g[0]+"-"+g[1]+(t.gana?" · "+escHtml(_llNom(t.gana)):"")+"</b>")); });
    const r=el("button","btn-aqua chico gris","↻ Volver a verlos");
    r.onclick=function(){ llavesEnVivo(function(){ if(typeof render==="function") render(); }); };
    p.cuerpo.appendChild(r);
  }
  return p;
}

/* ---------- parte de la semana (lo que pasó mientras avanzabas) ---------- */
function parteSemana(lineas){
  if(!E) return;
  E._parte={anio:E.anio,idx:E.idx,l:(lineas||[]).filter(Boolean).slice(0,5)};
}
function panelParte(){
  const P=E&&E._parte;
  if(!P||!P.l||!P.l.length) return null;
  if(P.anio!==E.anio||P.idx!==E.idx) return null;   /* solo la semana en curso */
  const p=panel(_jorT("sem_tit","Parte de la semana"),"🗞️");
  p.classList.add("parte-semana");
  P.l.forEach(function(t){ p.cuerpo.appendChild(el("div","fila mini","<span>"+escHtml(t)+"</span>")); });
  return p;
}

/* 7.9020 · tope de avisos apilados. En celular se juntaban hasta 7 toasts y
   tapaban media pantalla (visto en captura a 390px). `aviso()` vive en util.js,
   que es de Grok, así que se envuelve en vez de editarlo: se deja el más nuevo
   y se recortan los viejos. */
(function(){
  if(typeof aviso!=="function"||aviso._tope) return;
  const orig=aviso;
  const TOPE=3;
  aviso=function(){
    const r=orig.apply(this,arguments);
    try{
      const cont=document.getElementById("avisos");
      if(cont){ while(cont.children.length>TOPE) cont.removeChild(cont.firstChild); }
    }catch(e){}
    return r;
  };
  try{ Object.keys(orig).forEach(function(k){ aviso[k]=orig[k]; }); }catch(e){}
  aviso._tope=true;
})();
/* ---------- enganche con el escritorio ---------- */
function _jorInsertar(){
  if(typeof SEC!=="undefined"&&SEC!=="escritorio") return;
  const rej=document.querySelector("#vista .rejilla.dos");
  const izq=rej&&rej.children[0], der=rej&&rej.children[1];
  if(!rej) return;
  const pp=panelParte();
  if(pp&&izq) izq.insertBefore(pp,izq.firstChild);
  const pl=panelLlaves();   /* 7.9046 · las llaves ajenas, arriba: tu rival sale de ahí */
  if(pl&&izq) izq.insertBefore(pl,izq.firstChild);
  const pj=panelJornada();
  if(pj) (der||izq||rej).appendChild(pj);
}
(function(){
  if(typeof vistaEscritorio!=="function"||vistaEscritorio._jor10) return;
  const orig=vistaEscritorio;
  window.vistaEscritorio=function(){
    const r=orig.apply(this,arguments);
    try{ _jorInsertar(); }catch(e){}
    return r;
  };
  window.vistaEscritorio._jor10=true;
  window.vistaEscritorio._sit84=true;   /* el wrap viejo ya corrió: no rearmar */
})();
