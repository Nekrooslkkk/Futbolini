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
    const res=orig.apply(this,arguments);
    try{ _jorGuardar((P&&P.part)||(P&&P.partido)||null,res,antes); }catch(e){}
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

/* ---------- enganche con el escritorio ---------- */
function _jorInsertar(){
  if(typeof SEC!=="undefined"&&SEC!=="escritorio") return;
  const rej=document.querySelector("#vista .rejilla.dos");
  const izq=rej&&rej.children[0], der=rej&&rej.children[1];
  if(!rej) return;
  const pp=panelParte();
  if(pp&&izq) izq.insertBefore(pp,izq.firstChild);
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
