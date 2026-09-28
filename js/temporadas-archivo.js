"use strict";
/* ============================================================
   FUTBOLINI · temporadas-archivo.js — 7.9088 · temporadas pasadas, repetición y resumen de simulación
   Pedido del autor: "se deberían poder ver con tranquilidad las temporadas antiguas (cuando se simulan no
   se puede ver cómo quedaron), y repetirlas como una animación fecha a fecha, lenta o rápida; y en la
   simulación, que el resumen de 6 temporadas sea de las 6, no otra cosa".
   1) REGISTRO: después de cada fecha de liga se anota qué partido se jugó y cómo salió, en formato
      compacto [local, visita, goles, goles] (~5 KB por temporada). Las 15 últimas quedan completas;
      las más viejas guardan solo la tabla final (localStorage no es infinito).
   2) VISOR (Calendario ▸ 📼 Temporadas, y E.archivo en cualquier época): elige un año y reprodúcelo.
      · Rápido: fecha a fecha, la tabla se reordena en cada fecha.
      · Lento (el exacto): partido a partido, minuto a minuto; los goles caen en su minuto y la tabla
        se mueve al final de cada fecha. Los dos usan los mismos resultados: ninguno inventa.
   3) SIMULACIÓN: al terminar varias temporadas sale el resumen de TODAS (año, club, puesto, campeón),
      cada una con su repetición; y el avance rápido suma "Simular 1 temporada" y la fecha en vivo.
   ============================================================ */
const ARCHIVO_COMPLETAS=15;

function _archE(){
  if(!E) return null;
  E.archivo=E.archivo||{temps:[],actual:null};
  E.archivo.temps=E.archivo.temps||[];
  return E.archivo;
}
function _archNom(id){ return (typeof _nomClub==="function"&&_nomClub(id))||((typeof clubLookup==="function"&&clubLookup(id))||{}).c||id; }
function _archNomLiga(){
  const c=(E.calendario||[]).find(p=>p.tipo==="liga");
  return (c&&c.torneo)||"Liga";
}
/* nace al empezar la temporada: la tabla de ese momento es el punto de partida de las diferencias */
function archivoActual(desdeCero){
  const A=_archE(); if(!A) return null;
  if(!A.actual||A.actual.anio!==E.anio||A.actual.club!==E.club){
    /* si nace a mitad de temporada (partida de una versión vieja), anota desde la fecha siguiente y lo dice */
    const yaJugadas=Math.max(0,...Object.keys(E.tabla||{}).map(id=>(E.tabla[id]||{}).pj||0));
    const ids=((typeof clubesLigaActual==="function")?clubesLigaActual():[]).map(c=>c.id);
    A.actual={anio:E.anio, club:E.club, clubNombre:E.clubNombre||E.club, liga:_archNomLiga(),
      pv:(typeof puntosVictoria==="function")?puntosVictoria():3, ids:ids, noms:{}, fechas:[], prev:{}};
    ids.forEach(id=>{ A.actual.noms[id]=_archNom(id); });
    Object.keys(E.tabla||{}).forEach(id=>{ const t=E.tabla[id]; A.actual.prev[id]=[t.pj,t.gf]; });
    if(yaJugadas&&!desdeCero) A.actual.desde=yaJugadas+1;
  }
  return A.actual;
}
function _archIdx(act,id){
  let i=act.ids.indexOf(id);
  if(i<0){ act.ids.push(id); act.noms[id]=_archNom(id); if(!act.prev[id]) act.prev[id]=[0,0]; i=act.ids.length-1; }
  return i;
}
/* se llama después de que la fecha completa quedó en E.tabla (tu partido + el resto) */
function archivoAnotarFecha(part){
  if(!part||part.tipo!=="liga"||!E||!E.tabla) return false;
  /* las liguillas (ascenso/permanencia) no son la tabla de la temporada: se suman un momento y se revierten */
  if(/liguilla|playoff/i.test(part.fase||"")) return false;   /* 7.9093 · el playoff de 4° tampoco (Segunda) */
  const act=archivoActual(); if(!act) return false;
  /* la lista de la liga puede no estar lista cuando nace la partida: se completa con la liga vigente */
  ((typeof clubesLigaActual==="function")?clubesLigaActual():[]).forEach(c=>{ if(c&&c.id&&act.ids.indexOf(c.id)<0){ act.ids.push(c.id); act.noms[c.id]=_archNom(c.id); } });
  const pares=(part.jornada||[]).filter(p=>p&&p[0]&&p[1]&&p[0]!=="__BYE__"&&p[1]!=="__BYE__");
  const plano=[];
  pares.forEach(([a,b])=>{
    if(act.ids.indexOf(a)<0||act.ids.indexOf(b)<0) return;   /* solo tu liga / tu zona */
    const ta=E.tabla[a], tb=E.tabla[b]; if(!ta||!tb) return;
    const pa=act.prev[a]||[0,0], pb=act.prev[b]||[0,0];
    if(ta.pj===pa[0]||tb.pj===pb[0]) return;          /* ese par no se jugó en esta fecha */
    plano.push(_archIdx(act,a),_archIdx(act,b),ta.gf-pa[1],tb.gf-pb[1]);
  });
  Object.keys(E.tabla).forEach(id=>{ const t=E.tabla[id]; act.prev[id]=[t.pj,t.gf]; });
  if(!plano.length) return false;
  act.fechas.push({f:part.fecha||act.fechas.length+1, p:plano});
  return true;
}
/* al cerrar el año: la temporada pasa al archivo con su tabla final */
function archivoCerrar(){
  const A=_archE(); if(!A||!A.actual||!A.actual.fechas.length) return null;
  const act=A.actual;
  const fin=tablaDeArchivo(act,act.fechas.length);
  /* control: la tabla reconstruida tiene que ser la real (si no, el registro se perdió una fecha) */
  const descuadres=act.desde?0:fin.filter(r=>{ const x=E.tabla&&E.tabla[r.id]; return !x||x.pts!==r.pts||x.gf!==r.gf||x.gc!==r.gc; }).length;
  const mia=fin.findIndex(r=>r.id===act.club);
  const t={anio:act.anio, club:act.club, clubNombre:act.clubNombre, liga:act.liga, pv:act.pv, ids:act.ids, noms:act.noms,
    fechas:act.fechas, campeon:fin[0]?fin[0].id:null, desde:act.desde||null, descuadres:descuadres, tuPos:mia+1, n:fin.length,
    final:fin.map(r=>[act.ids.indexOf(r.id),r.pj,r.pg,r.pe,r.pp,r.gf,r.gc,r.pts])};
  A.temps=A.temps.filter(x=>!(x.anio===t.anio&&x.club===t.club));
  A.temps.push(t);
  /* las viejas se quedan con la tabla final (sin fecha a fecha) */
  A.temps.forEach((x,i)=>{ if(i<A.temps.length-ARCHIVO_COMPLETAS) x.fechas=null; });
  A.actual=null;
  return t;
}
/* tabla después de k fechas (recalculada desde los resultados: no se guarda, se reconstruye) */
function tablaDeArchivo(t,k){
  if(!t) return [];
  if(!t.fechas){
    return (t.final||[]).map(r=>({id:t.ids[r[0]],pj:r[1],pg:r[2],pe:r[3],pp:r[4],gf:r[5],gc:r[6],pts:r[7]}));
  }
  const T={}, pv=t.pv||3;
  t.ids.forEach(id=>T[id]={id:id,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0});
  t.fechas.slice(0,k).forEach(f=>{
    for(let i=0;i<f.p.length;i+=4){
      const a=T[t.ids[f.p[i]]], b=T[t.ids[f.p[i+1]]], ga=f.p[i+2], gb=f.p[i+3]; if(!a||!b) continue;
      a.pj++; b.pj++; a.gf+=ga; a.gc+=gb; b.gf+=gb; b.gc+=ga;
      if(ga>gb){ a.pg++; a.pts+=pv; b.pp++; } else if(ga<gb){ b.pg++; b.pts+=pv; a.pp++; } else { a.pe++; b.pe++; a.pts++; b.pts++; }
    }
  });
  return Object.keys(T).map(id=>T[id]).filter(r=>r.pj>0||k===0)
    .sort((x,y)=>(y.pts-x.pts)||((y.gf-y.gc)-(x.gf-x.gc))||(y.gf-x.gf)||String(x.id).localeCompare(String(y.id)));
}
function temporadasArchivadas(){
  const A=_archE(); if(!A) return [];
  const lista=A.temps.slice().reverse();
  const act=A.actual;
  if(act&&act.fechas&&act.fechas.length) lista.unshift(Object.assign({enCurso:true},act));
  return lista;
}

/* ---------- visor ---------- */
const REPE={t:null,k:0,timer:null,modo:null,minuto:0};
function _repeParar(){ clearTimeout(REPE.timer); REPE.timer=null; REPE.modo=null; }
/* minuto (1–90) en que cae cada gol: fijo por partido, así la repetición siempre muestra lo mismo */
function _repeMinutos(t,fi,pi,goles){
  const out=[]; let h=((t.anio||0)*131+fi*977+pi*61+7)|0;
  for(let g=0;g<goles;g++){ h=(h*1103515245+12345)&0x7fffffff; out.push(1+(h%90)); }
  return out.sort((a,b)=>a-b);
}
function _repeFilasFecha(t,k,minuto){
  const f=t.fechas&&t.fechas[k-1]; if(!f) return [];
  const out=[];
  for(let i=0,pi=0;i<f.p.length;i+=4,pi++){
    const a=t.ids[f.p[i]], b=t.ids[f.p[i+1]], ga=f.p[i+2], gb=f.p[i+3];
    let va=ga, vb=gb;
    if(minuto!=null){
      va=_repeMinutos(t,k,pi*2,ga).filter(m=>m<=minuto).length;
      vb=_repeMinutos(t,k,pi*2+1,gb).filter(m=>m<=minuto).length;
    }
    out.push({a:a,b:b,ga:va,gb:vb,fin:minuto==null||minuto>=90});
  }
  return out;
}
function _repeTablaHTML(t,k){
  const ahora=tablaDeArchivo(t,k), antes=k>1?tablaDeArchivo(t,k-1):[];
  const posAntes={}; antes.forEach((r,i)=>posAntes[r.id]=i+1);
  let h="<table class='cs-tabla repe-tabla'><thead><tr><th></th><th></th><th class='izq'>Equipo</th><th class='n'>PJ</th><th class='n'>G</th><th class='n'>E</th><th class='n'>P</th><th class='n'>GF</th><th class='n'>GC</th><th class='n'>DG</th><th class='n'>Pts</th></tr></thead><tbody>";
  ahora.forEach((r,i)=>{
    const pa=posAntes[r.id], mov=!pa?"":(pa>i+1?"<span class='sube'>▲</span>":(pa<i+1?"<span class='baja'>▼</span>":"<span class='igual'>=</span>"));
    h+="<tr class='"+(r.id===t.club?"yo":"")+"'><td class='n pos'>"+(i+1)+"</td><td class='n'>"+mov+"</td><td class='izq'>"+escHtml((t.noms&&t.noms[r.id])||_archNom(r.id))+"</td><td class='n'>"+r.pj+"</td><td class='n'>"+r.pg+"</td><td class='n'>"+r.pe+"</td><td class='n'>"+r.pp+"</td><td class='n'>"+r.gf+"</td><td class='n'>"+r.gc+"</td><td class='n'>"+((r.gf-r.gc)>0?"+":"")+(r.gf-r.gc)+"</td><td class='n pts'>"+r.pts+"</td></tr>";
  });
  return h+"</tbody></table>";
}
function pintarRepeticion(host,t,k,minuto){
  if(!host) return;
  if(!host.isConnected&&REPE.modo) return _repeParar();   /* salió de pantalla a mitad de la repetición */
  const n=t.fechas?t.fechas.length:0;
  host.innerHTML="";
  const cab=el("div","repe-cab");
  cab.innerHTML="<b>"+escHtml(t.liga||"Liga")+" "+t.anio+"</b> · "+escHtml(t.clubNombre||t.club)+(t.desde?" · <span class='mini'>anotada desde la fecha "+t.desde+"</span>":"")+
    (t.enCurso?" · <span class='mini'>en curso</span>":"")+"<span class='repe-fecha'>"+(n?("Fecha "+k+" de "+n):"Solo tabla final")+(minuto!=null&&minuto<90?" · min "+minuto+"'":"")+"</span>";
  host.appendChild(cab);
  if(n){
    const ctr=el("div","repe-ctr");
    const bt=(txt,tit,fn,cls)=>{ const b=el("button","btn-aqua chico "+(cls||"gris"),txt); b.type="button"; b.title=tit; b.onclick=fn; ctr.appendChild(b); return b; };
    bt("⏮","Primera fecha",()=>{ _repeParar(); pintarRepeticion(host,t,1); });
    bt("◀","Fecha anterior",()=>{ _repeParar(); pintarRepeticion(host,t,Math.max(1,k-1)); });
    bt("▶","Fecha siguiente",()=>{ _repeParar(); pintarRepeticion(host,t,Math.min(n,k+1)); });
    bt("⏭","Tabla final",()=>{ _repeParar(); pintarRepeticion(host,t,n); });
    bt(REPE.modo==="lento"?"⏸ Pausa":"🐢 Lento (exacto)","Partido a partido, minuto a minuto: los goles caen en su minuto",()=>{
      if(REPE.modo){ _repeParar(); return pintarRepeticion(host,t,k); }
      REPE.modo="lento"; _repeLento(host,t,k>=n?1:k,0); },"verde");
    bt(REPE.modo==="rapido"?"⏸ Pausa":"⏩ Rápido","Fecha a fecha: la tabla se reordena en cada fecha",()=>{
      if(REPE.modo){ _repeParar(); return pintarRepeticion(host,t,k); }
      REPE.modo="rapido"; _repeRapido(host,t,k>=n?1:k); });
    const r=el("input"); r.type="range"; r.min=1; r.max=n; r.value=k; r.className="repe-rango"; r.setAttribute("aria-label","Fecha");
    r.oninput=()=>{ _repeParar(); pintarRepeticion(host,t,+r.value); };
    ctr.appendChild(r);
    host.appendChild(ctr);
    host.appendChild(el("p","mini","🐢 Lento: ves cada partido minuto a minuto y la tabla se mueve al final de la fecha. ⏩ Rápido: fecha a fecha. Los dos muestran exactamente lo que pasó."));
    const res=el("div","repe-res");
    _repeFilasFecha(t,k,minuto).forEach(m=>{
      res.appendChild(el("div","repe-p"+(m.a===t.club||m.b===t.club?" yo":"")+(m.fin?"":" vivo"),
        "<span class='l'>"+escHtml((t.noms&&t.noms[m.a])||_archNom(m.a))+"</span><b>"+m.ga+" – "+m.gb+"</b><span class='v'>"+escHtml((t.noms&&t.noms[m.b])||_archNom(m.b))+"</span>"));
    });
    host.appendChild(res);
  }
  const tb=el("div","repe-tabla-wrap"); tb.innerHTML=_repeTablaHTML(t,(minuto!=null&&minuto<90)?k-1:(n?k:0)); host.appendChild(tb);
}
function _repeRapido(host,t,k){
  if(REPE.modo!=="rapido") return;
  pintarRepeticion(host,t,k);
  if(k>=t.fechas.length){ REPE.modo=null; return pintarRepeticion(host,t,k); }
  REPE.timer=setTimeout(()=>_repeRapido(host,t,k+1),650);
}
function _repeLento(host,t,k,min){
  if(REPE.modo!=="lento") return;
  pintarRepeticion(host,t,k,min);
  if(min<90){ REPE.timer=setTimeout(()=>_repeLento(host,t,k,Math.min(90,min+5)),220); return; }
  if(k>=t.fechas.length){ REPE.modo=null; return pintarRepeticion(host,t,k); }
  REPE.timer=setTimeout(()=>_repeLento(host,t,k+1,0),1100);
}
/* lista + visor: sirve inline (Calendario) o en ventana */
function panelTemporadas(cont,elegida){
  const lista=temporadasArchivadas();
  const p=panel("Temporadas","📼","agua");
  if(!lista.length){
    p.cuerpo.appendChild(el("p","mini","Todavía no hay temporadas guardadas. Desde esta versión, cada fecha de liga queda anotada: juega o simula y acá vas a poder repetir la temporada fecha a fecha."));
    cont.appendChild(p); return p;
  }
  const sel=el("div","repe-lista");
  let t=elegida!=null?lista.find(x=>x.anio===elegida)||lista[0]:lista[0];
  lista.forEach(x=>{
    const b=el("button","ficha"+(x===t?" on":""),x.anio+" · "+escHtml(x.clubNombre||x.club)+(x.enCurso?" (en curso)":" · "+(x.tuPos?x.tuPos+"°":"")));
    b.setAttribute("aria-pressed",x===t?"true":"false");
    b.onclick=()=>{ _repeParar(); cont.innerHTML=""; panelTemporadas(cont,x.anio); };
    sel.appendChild(b);
  });
  p.cuerpo.appendChild(sel);
  if(t&&!t.enCurso&&t.campeon) p.cuerpo.appendChild(el("p","mini","Campeón: <b>"+escHtml((t.noms&&t.noms[t.campeon])||_archNom(t.campeon))+"</b> · "+escHtml(t.clubNombre||t.club)+" terminó <b>"+t.tuPos+"°</b> de "+t.n+"."));
  const host=el("div","repe"); p.cuerpo.appendChild(host);
  cont.appendChild(p);
  _repeParar();
  pintarRepeticion(host,t,t.fechas?t.fechas.length:0);
  return p;
}
function abrirTemporadas(anio){
  if(typeof abrirSeccion!=="function") return;
  const c=abrirSeccion("Temporadas — "+(E.clubNombre||""),"📼");
  panelTemporadas(c,anio);
}

/* ---------- resumen de la simulación de varias temporadas ---------- */
function resumenSimulacion(desde){
  const A=_archE(); if(!A) return;
  const temps=A.temps.filter(t=>t.anio>=desde);
  if(!temps.length) return;
  modal(function(box){
    box.appendChild(el("div","cab",'<span class="ic">⏭️</span><span>Resumen de la simulación · '+temps.length+' temporada'+(temps.length!==1?"s":"")+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p","mini","Esto pasó en las temporadas que simulaste. Toca una para verla fecha a fecha."));
    const t=el("table","cs-tabla repe-resumen");
    let h="<thead><tr><th class='izq'>Año</th><th class='izq'>Club</th><th class='izq'>Liga</th><th class='n'>Puesto</th><th class='izq'>Campeón</th><th></th></tr></thead><tbody>";
    temps.forEach((x,i)=>{ h+="<tr><td>"+x.anio+"</td><td>"+escHtml(x.clubNombre||x.club)+"</td><td>"+escHtml(x.liga||"")+"</td><td class='n'><b>"+x.tuPos+"°</b>/"+x.n+"</td><td>"+(x.campeon===x.club?"🏆 ":"")+escHtml((x.noms&&x.noms[x.campeon])||_archNom(x.campeon))+"</td><td><button class='btn-aqua chico' data-i='"+i+"'>📼 Ver</button></td></tr>"; });
    t.innerHTML=h+"</tbody>"; c.appendChild(t);
    t.querySelectorAll("button[data-i]").forEach(b=>b.onclick=()=>{ const x=temps[+b.dataset.i]; cerrarModal(); abrirTemporadas(x.anio); });
    const ok=el("button","btn-aqua ancho verde","Seguir"); ok.style.marginTop="8px"; ok.onclick=cerrarModal; c.appendChild(ok);
  });
}

/* ---------- enganches ---------- */
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._arch) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._arch=true; w._orig=o; window[nom]=w; };
  envolver("simularResto",o=>function(part){ const r=o.apply(this,arguments); try{ archivoAnotarFecha(part); }catch(e){ console.error("archivo:",e); } return r; });
  envolver("nuevoAnio",o=>function(){ try{ archivoCerrar(); }catch(e){ console.error("archivo:",e); }
    const r=o.apply(this,arguments); try{ if(E&&E.archivo) E.archivo.actual=null; archivoActual(true); }catch(e){} return r; });
  /* cambiar de club (oferta, despido, rescate) arma una partida nueva: el archivo viaja contigo, como los títulos */
  envolver("aceptarClub",o=>function(){ let A=null; try{ archivoCerrar(); A=E&&E.archivo; }catch(e){}
    const r=o.apply(this,arguments); try{ if(E&&A){ A.actual=null; E.archivo=A; archivoActual(true); } }catch(e){} return r; });
  envolver("nuevaPartida",o=>function(){ const r=o.apply(this,arguments); try{ if(E){ E.archivo={temps:[],actual:null}; archivoActual(true); } }catch(e){} return r; });
  /* épocas sin el calendario 2026 (1991, histórico): el visor va al final de la sección */
  envolver("vistaCalendario",o=>function(){ const r=o.apply(this,arguments);
    try{ const v=document.getElementById("vista"); if(v&&!v.querySelector(".cs")&&!v.querySelector(".repe")) panelTemporadas(v); }catch(e){}
    return r; });
  envolver("simularTemporadasAsync",o=>function(){
    const desde=E?E.anio:0, r=o.apply(this,arguments);
    const esperar=()=>{ if(!E) return; if(E._bulkSim) return setTimeout(esperar,400);
      if(E.anio>desde) setTimeout(()=>{ try{ resumenSimulacion(desde); }catch(e){} },300); };
    setTimeout(esperar,600);
    return r;
  });
  /* avance rápido: + "Simular 1 temporada" y la fecha simulada se ve en vivo */
  envolver("modalAvanceRapido",o=>function(){
    const r=o.apply(this,arguments);
    try{
      const cc=document.querySelector("#capa-modal .modal .cuerpo"); if(!cc) return r;
      const bs=[].slice.call(cc.querySelectorAll("button"));
      const b5=bs.find(b=>/5 temporadas/.test(b.textContent)), b1=bs.find(b=>/próxima fecha/.test(b.textContent));
      if(b5&&!cc.querySelector(".sim-1t")){
        const b=el("button","btn-aqua ancho sim-1t","⏭️ Simular 1 temporada"); b.style.marginTop="6px";
        b.onclick=()=>{ cerrarModal(); if(typeof simularTemporadasAsync==="function") simularTemporadasAsync(1); };
        b5.insertAdjacentElement("beforebegin",b);
      }
      if(b1){
        const viejo=b1.onclick;
        b1.textContent="⏩ Simular la próxima fecha (en vivo)";
        b1.onclick=function(){ const act=archivoActual(), n0=act?act.fechas.length:0; viejo.apply(this,arguments);
          try{ const a2=archivoActual(); if(a2&&a2.fechas.length>n0) fechaEnVivo(a2,a2.fechas.length); }catch(e){} };
      }
    }catch(e){}
    return r;
  });
})();
/* la fecha recién simulada, en vivo (el modo lento de una sola fecha) */
function fechaEnVivo(t,k){
  modal(function(box){
    box.appendChild(el("div","cab",'<span class="ic">📺</span><span>'+((t.fechas[k-1]&&t.fechas[k-1].f)==="libre"?"Fecha libre (descansaste)":"Fecha "+(t.fechas[k-1]&&t.fechas[k-1].f||k))+' en vivo</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    const host=el("div","repe"); c.appendChild(host);
    const ok=el("button","btn-aqua ancho verde","Seguir"); ok.style.marginTop="8px"; ok.onclick=()=>{ _repeParar(); cerrarModal(); }; c.appendChild(ok);
    _repeParar(); REPE.modo="lento";
    const solo=Object.assign({},t,{fechas:t.fechas.slice(0,k)});
    _repeLento(host,solo,k,0);
  });
}
