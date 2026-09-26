"use strict";
/* ============================================================
   FUTBOLINI · calendario-sofa.js  (7.9059)
   Pedido del autor: Calendario "nivel SofaScore": ordenado, búsqueda por equipo, ver
   cualquier equipo como si lo manejaras, tablas gruesas, copas con llaves, sin botones
   de más, sin lentitud. Reconstrucción de la VISTA (los datos siguen en mundo.js).
   - Solo en las épocas con universo (mundoEra2026); 1991/2006 siguen con su vista.
   - Pestañas: Partidos · Tablas · Copas · Resultados (+ ficha de equipo).
   - Solo se dibuja la pestaña activa.
   Estado de UI en E.uiCal = {tab, liga, copa, equipo, sub, filtro}.
   ============================================================ */
function _csUI(){ if(!E.uiCal) E.uiCal={tab:"partidos",liga:null,copa:null,equipo:null,sub:"partidos",filtro:"todos"}; return E.uiCal; }
function _csNom(id){ return (typeof _nomClub==="function")?_nomClub(id):id; }
function _csNomLargo(id){ const c=(typeof clubMundo==="function")&&clubMundo(id); return (c&&(c.n||c.c))||_csNom(id); }
function _csEsc(id){ return (typeof escudoChip==="function")?escudoChip(id):""; }
const _CS_LIGAS={"2026":"Primera","2026b":"Primera B","2026cN":"Segunda · Norte","2026cS":"Segunda · Sur","arg2026A":"Argentina · Zona A","arg2026B":"Argentina · Zona B"};
function _csLigas(){
  const L=(E.mundo&&E.mundo.ligas)||{}, propia=(typeof _ligaKeyJugador==="function")?_ligaKeyJugador():null;
  const ks=Object.keys(L).filter(k=>L[k]&&L[k].ids&&L[k].ids.length);
  ks.sort((a,b)=>(a===propia?-1:(b===propia?1:0))||Object.keys(_CS_LIGAS).indexOf(a)-Object.keys(_CS_LIGAS).indexOf(b));
  return ks.map(k=>({k:k,n:_CS_LIGAS[k]||L[k].nom||k,propia:k===propia}));
}
function _csLigaDe(id){ const L=(E.mundo&&E.mundo.ligas)||{}; return Object.keys(L).find(k=>L[k]&&(L[k].ids||[]).indexOf(id)>=0)||null; }
/* resultados de una ronda de liga (los guardados; si la partida es vieja, se recalculan igual: son deterministas) */
function _csResRonda(key,r){
  const L=E.mundo.ligas[key]; if(!L||!L.fx||r>=(L.ronda||0)) return [];
  if(L.res&&L.res[r]) return L.res[r];
  const out=[];
  (L.fx[r]||[]).forEach(par=>{
    if(E.club&&(par[0]===E.club||par[1]===E.club)) return;
    const a=clubMundo(par[0]), b=clubMundo(par[1]); if(!a||!b||par[0]===par[1]) return;
    const g=_golesM(a,b,"liga|"+key+"|"+r+"|"+a.id+"|"+b.id); out.push([a.id,b.id,g[0],g[1]]);
  });
  (L.res=L.res||{})[r]=out;
  return out;
}
/* partidos de liga de un equipo: ronda, rival, localía y resultado si ya se jugó */
function _csPartidosEquipo(id){
  const key=_csLigaDe(id); if(!key) return [];
  const L=E.mundo.ligas[key], mios=(E.calendario||[]).filter(p=>p&&p.tipo==="liga"&&!p.fase);
  return (L.fx||[]).map((ronda,r)=>{
    const par=(ronda||[]).find(x=>x[0]===id||x[1]===id); if(!par||par[0]===par[1]) return null;
    const local=par[0]===id, rival=local?par[1]:par[0];
    const o={r:r,local:local,rival:rival,jugado:false};
    if(E.club&&(id===E.club||rival===E.club)){
      const p=mios.find(x=>x.fecha===r+1)||mios[r];
      if(p&&p.jugado){ o.jugado=true; const yo=p.gf||0, el=p.gc||0; if(id===E.club){ o.gf=yo; o.gc=el; } else { o.gf=el; o.gc=yo; } }
      if(p&&p.f) o.f=p.f;
    } else if(r<(L.ronda||0)){
      const res=_csResRonda(key,r).find(x=>(x[0]===id||x[1]===id));
      if(res){ o.jugado=true; o.gf=res[0]===id?res[2]:res[3]; o.gc=res[0]===id?res[3]:res[2]; }
    }
    return o;
  }).filter(Boolean);
}
function _csForma(id){
  return _csPartidosEquipo(id).filter(p=>p.jugado).slice(-5).map(p=>p.gf>p.gc?"G":(p.gf<p.gc?"P":"E"));
}
/* zonas de la tabla (aprox. a las bases vigentes) */
function _csZona(key,pos,n){
  if(key==="2026"){ if(pos===1) return ["z-camp","Campeón · Libertadores"]; if(pos<=4) return ["z-lib","Libertadores"]; if(pos<=8) return ["z-sud","Sudamericana"]; if(pos>n-2) return ["z-desc","Descenso"]; }
  if(key==="2026b"){ if(pos===1) return ["z-camp","Ascenso directo"]; if(pos<=8) return ["z-sud","Liguilla de ascenso"]; if(pos===n) return ["z-desc","Descenso"]; }
  if(/^2026c/.test(key)){ if(pos<=3) return ["z-sud","Liguilla de ascenso"]; if(pos>n-3) return ["z-perm","Liguilla de permanencia"]; }
  if(/^arg/.test(key)){ if(pos<=8) return ["z-sud","Playoffs"]; }
  return ["",""];
}
function _csTabla(key,opts){
  opts=opts||{};
  const filas=(typeof mundoFilasLiga==="function")?mundoFilasLiga(key):[];
  const wrap=el("div","cs-tabla-wrap");
  const t=el("table","cs-tabla tabla-liga");
  t.innerHTML="<thead><tr><th></th><th class='izq'>Equipo</th><th class='n'>PJ</th><th class='n cs-oc'>G</th><th class='n cs-oc'>E</th><th class='n cs-oc'>P</th><th class='n'>DG</th><th class='n'>Pts</th><th class='cs-forma-h'>Forma</th></tr></thead>";
  const tb=el("tbody"), zonas={};
  filas.forEach((c,i)=>{
    const z=_csZona(key,i+1,filas.length); if(z[0]) zonas[z[0]]=z[1];
    const tr=el("tr",(c.id===E.club?"yo ":"")+(c.id===opts.marca?"marca ":"")+z[0]);
    const forma=_csForma(c.id).map(x=>"<i class='fd f"+x+"' title='"+x+"'></i>").join("");
    tr.innerHTML="<td class='n pos'>"+(i+1)+"</td><td class='izq'>"+_csEsc(c.id)+"<span class='cs-eq'>"+escHtml(c.n||_csNom(c.id))+"</span></td><td class='n'>"+c.pj+
      "</td><td class='n cs-oc'>"+c.pg+"</td><td class='n cs-oc'>"+c.pe+"</td><td class='n cs-oc'>"+c.pp+"</td><td class='n'>"+((c.gf-c.gc)>0?"+":"")+(c.gf-c.gc)+
      "</td><td class='n pts'>"+c.pts+"</td><td class='cs-forma'>"+forma+"</td>";
    tr.onclick=()=>{ const u=_csUI(); u.equipo=c.id; u.tab="equipo"; u.sub="partidos"; irA("calendario"); };
    tb.appendChild(tr);
  });
  t.appendChild(tb); wrap.appendChild(t);
  const ley=Object.keys(zonas);
  if(ley.length) wrap.appendChild(el("div","cs-leyenda",ley.map(z=>"<span><i class='cs-z "+z+"'></i>"+zonas[z]+"</span>").join("")));
  return wrap;
}
/* una fila de partido estilo SofaScore */
function _csFila(o){
  const d=el("div","cs-fila"+(o.res?" r"+o.res:"")+(o.proximo?" prox":"")+(o.click?" clic":""));
  d.innerHTML="<div class='cs-cuando'>"+(o.cuando||"")+"</div>"+
    "<div class='cs-eqs'><div class='cs-l'>"+_csEsc(o.a)+"<span>"+escHtml(o.na||_csNom(o.a))+"</span></div><div class='cs-l'>"+_csEsc(o.b)+"<span>"+escHtml(o.nb||_csNom(o.b))+"</span></div></div>"+
    "<div class='cs-marc'>"+(o.ga!=null?"<b>"+o.ga+"</b><b>"+o.gb+"</b>":"<span class='mini'>"+(o.hora||"—")+"</span>")+"</div>"+
    (o.tag?"<div class='cs-tag'>"+escHtml(o.tag)+"</div>":"");
  if(o.click) d.onclick=o.click;
  return d;
}
const _CS_MESES=["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
function _csTagComp(c){ return c.tipo==="liga"?("Fecha "+(c.fecha||"")):(c.tipo==="amistoso"?"Amistoso":((c.torneo||"Copa")+(c.ronda?" · "+c.ronda:""))); }
/* ---------- pestaña: mis partidos ---------- */
function _csPartidos(cont){
  const u=_csUI(), prox=proximoPartido();
  /* próximo compromiso: la tarjeta grande (único botón de acción) */
  const pp=panel(T("cal_prox","Próximo compromiso"),"📌",prox&&prox.tipo==="copa"?"agua":"");
  if(prox){
    const loc=prox.local?E.club:prox.rivalId, vis=prox.local?prox.rivalId:E.club;
    const card=el("div","cs-prox-card");
    card.innerHTML="<div class='cs-prox-comp'>"+escHtml(_csTagComp(prox))+" · "+(typeof nombreDiaDe==="function"?nombreDiaDe(prox)+" ":"")+(prox.f?fechaTxt(prox.f):"")+(prox.hora?" · "+prox.hora:"")+"</div>"+
      "<div class='cs-prox-eqs'><div>"+_csEsc(loc)+"<b>"+escHtml(prox.local?E.clubNombre:prox.rivalNombre)+"</b></div><span class='cs-vs'>vs</span><div>"+_csEsc(vis)+"<b>"+escHtml(prox.local?prox.rivalNombre:E.clubNombre)+"</b></div></div>"+
      "<div class='mini'>"+(prox.local?"De local":"De visita")+(prox.sede?" · "+escHtml(prox.sede):"")+"</div>";
    pp.cuerpo.appendChild(card);
    const b=el("button","btn-aqua ancho verde",T("cal_ir","Ir al partido"));
    b.onclick=()=>{ if(typeof bloqueoDecisiones==="function"&&bloqueoDecisiones()) return; pantallaPrevia(prox); };
    pp.cuerpo.appendChild(b);
  } else pp.cuerpo.appendChild(el("p","mini",T("cal_sinprox","No hay más partidos este año.")));
  const jug=(E.calendario||[]).filter(c=>c.jugado).length, tot=(E.calendario||[]).length;
  if(tot){ pp.cuerpo.appendChild(el("p","mini cs-prog",T("cal_prog","Temporada")+" "+E.anio+" · <b>"+jug+"</b> "+T("cal_de","de")+" <b>"+tot+"</b>")); pp.cuerpo.appendChild(el("div",null,barrita(jug,"#2f7dd0",tot))); }
  cont.appendChild(pp);
  /* lista por mes con filtro */
  const pl=panel(T("cal_sig","Lo que viene")+" y lo jugado","📅");
  const f=el("div","fichas cs-chips");
  [["todos","Todos"],["liga","Liga"],["copas","Copas"]].forEach(([k,n])=>{ const b=el("button","ficha",n); b.setAttribute("aria-pressed",u.filtro===k?"true":"false"); b.onclick=()=>{ u.filtro=k; irA("calendario"); }; f.appendChild(b); });
  if(typeof modalAmistoso==="function"){ const ba=el("button","ficha","🤝 Amistoso"); ba.onclick=()=>modalAmistoso(); f.appendChild(ba); }
  pl.cuerpo.appendChild(f);
  const lista=(E.calendario||[]).map((c,i)=>({c:c,i:i})).filter(x=>u.filtro==="todos"||(u.filtro==="liga"?x.c.tipo==="liga":x.c.tipo!=="liga"));
  const mesHoy=prox&&prox.f?prox.f.m:12;
  let mesAnt=-1, viejos=null;
  lista.forEach(({c,i})=>{
    const m=c.f?c.f.m:0;
    const dest=(m<mesHoy-1)?(viejos||(viejos=el("details","cs-viejos"),viejos.appendChild(el("summary",null,"Meses anteriores")),viejos)):pl.cuerpo;
    if(m!==mesAnt){ mesAnt=m; dest.appendChild(el("div","cs-mes",_CS_MESES[m]||"")); }
    const loc=c.local?E.club:c.rivalId, vis=c.local?c.rivalId:E.club;
    const res=c.jugado?(c.gf>c.gc?"G":(c.gf<c.gc?"P":"E")):null;
    dest.appendChild(_csFila({a:loc,b:vis,na:c.local?E.clubNombre:c.rivalNombre,nb:c.local?c.rivalNombre:E.clubNombre,
      ga:c.jugado?(c.local?c.gf:c.gc):null, gb:c.jugado?(c.local?c.gc:c.gf):null, res:res, proximo:c===prox,
      cuando:(c.f?c.f.d+"/"+c.f.m:"")+(typeof nombreDiaDe==="function"&&c.f?"<br><span class='mini'>"+nombreDiaDe(c).slice(0,3)+"</span>":""),
      hora:c.hora||"", tag:_csTagComp(c),
      click:c.jugado&&typeof modalRepeticion==="function"?(()=>modalRepeticion(c)):null}));
  });
  if(viejos) pl.cuerpo.insertBefore(viejos,pl.cuerpo.children[1]||null);
  cont.appendChild(pl);
}
/* ---------- pestaña: tablas ---------- */
function _csTablas(cont){
  const u=_csUI(), ligas=_csLigas();
  if(!ligas.length){ cont.appendChild(el("p","mini","No hay ligas en esta época.")); return; }
  if(!u.liga||!ligas.some(x=>x.k===u.liga)) u.liga=(ligas.find(x=>x.propia)||ligas[0]).k;
  const f=el("div","fichas cs-chips");
  ligas.forEach(x=>{ const b=el("button","ficha",x.n+(x.propia?" ★":"")); b.setAttribute("aria-pressed",u.liga===x.k?"true":"false"); b.onclick=()=>{ u.liga=x.k; irA("calendario"); }; f.appendChild(b); });
  cont.appendChild(f);
  const L=E.mundo.ligas[u.liga], pu=(typeof mundoPuntero==="function")?mundoPuntero(u.liga):null;
  const p=panel((ligas.find(x=>x.k===u.liga)||{}).n+" "+E.anio,"📊","agua");
  p.cuerpo.appendChild(el("p","mini",(L?("Fecha "+Math.min(L.fx.length,(L.ronda||0))+" de "+L.fx.length):"")+(pu&&pu.pj>0?" · puntero "+escHtml(_csNom(pu.id))+" ("+pu.pts+")":"")+" · toca un equipo para ver su ficha."));
  p.cuerpo.appendChild(_csTabla(u.liga));
  cont.appendChild(p);
}
/* ---------- pestaña: copas ---------- */
function _csCopasDisponibles(){
  const C=(E.mundo&&E.mundo.copas)||{}, out=[], arg=E.eraBase==="arg2026";   /* un club argentino no ve las copas chilenas */
  if(!arg&&C.chile&&C.chile.grupos&&Object.keys(C.chile.grupos).length) out.push(["chile","Copa Chile"]);
  if(!arg&&C.copaLiga&&C.copaLiga.grupos&&Object.keys(C.copaLiga.grupos).length) out.push(["copaLiga","Copa de la Liga"]);
  if(E.mundo&&E.mundo.ligB) out.push(["ligB","Liguilla de Ascenso"]);
  if(C.lib&&C.lib.grupos&&Object.keys(C.lib.grupos).length) out.push(["lib","Libertadores"]);
  if(C.sud&&C.sud.grupos&&Object.keys(C.sud.grupos).length) out.push(["sud","Sudamericana"]);
  return out;
}
function _csGrupos(tor){
  const pack=E.mundo.copas[tor], box=el("div","cs-grupos");
  Object.keys(pack.grupos||{}).forEach(letra=>{
    const filas=(tor==="lib"||tor==="sud")?mundoFilasConmebol(tor,letra):mundoFilasCopa(tor,letra);
    const g=el("div","cs-grupo"+(filas.some(c=>c.id===E.club)?" mio":""));
    g.appendChild(el("div","cs-grupo-t","Grupo "+letra));
    const t=el("table","cs-tabla cs-mini");
    t.innerHTML="<thead><tr><th></th><th class='izq'>Equipo</th><th class='n'>PJ</th><th class='n'>DG</th><th class='n'>Pts</th></tr></thead>";
    const tb=el("tbody");
    filas.forEach((c,i)=>{ const tr=el("tr",(c.id===E.club?"yo ":"")+(i<2?"z-sud":""));
      tr.innerHTML="<td class='n pos'>"+(i+1)+"</td><td class='izq'>"+_csEsc(c.id)+"<span class='cs-eq'>"+escHtml(c.n||_csNom(c.id))+"</span></td><td class='n'>"+c.pj+"</td><td class='n'>"+((c.gf-c.gc)>0?"+":"")+(c.gf-c.gc)+"</td><td class='n pts'>"+c.pts+"</td>";
      tb.appendChild(tr); });
    t.appendChild(tb); g.appendChild(t); box.appendChild(g);
  });
  return box;
}
function _csCopas(cont){
  const u=_csUI(), copas=_csCopasDisponibles();
  if(!copas.length){ cont.appendChild(el("p","mini","No hay copas en juego esta temporada.")); return; }
  if(!u.copa||!copas.some(x=>x[0]===u.copa)) u.copa=copas[0][0];
  const f=el("div","fichas cs-chips");
  copas.forEach(([k,n])=>{ const b=el("button","ficha",n); b.setAttribute("aria-pressed",u.copa===k?"true":"false"); b.onclick=()=>{ u.copa=k; irA("calendario"); }; f.appendChild(b); });
  cont.appendChild(f);
  if(u.copa==="ligB"){ const plb=(typeof mundoPanelLiguillaB==="function")?mundoPanelLiguillaB():null; if(plb) cont.appendChild(plb); return; }
  const pack=E.mundo.copas[u.copa];
  if(typeof panelCuadroConmebol==="function" && (u.copa==="lib"||u.copa==="sud")){ const pk=panelCuadroConmebol(u.copa); if(pk) cont.appendChild(pk); }
  else if(pack&&pack.ko){ const pk=mundoPanelLlaves(u.copa); if(pk) cont.appendChild(pk); }
  const pg=panel((copas.find(x=>x[0]===u.copa)||[])[1]+" · grupos","🏆","agua");
  pg.cuerpo.appendChild(el("p","mini",u.copa==="chile"?"Clasifican 1° y 2° de cada grupo.":(u.copa==="copaLiga"?"Clasifica solo el 1° de cada grupo.":"Pasan los dos primeros de cada grupo (y los mejores terceros si faltan cupos).")));
  pg.cuerpo.appendChild(_csGrupos(u.copa));
  cont.appendChild(pg);
}
/* ---------- pestaña: resultados del país ---------- */
function _csResultados(cont){
  const p=panel("Resultados","⚽","agua");
  const lista=((E.mundo&&E.mundo.pais)||[]).slice(-30).reverse();
  if(!lista.length) p.cuerpo.appendChild(el("p","mini","Todavía no hay fechas jugadas."));
  let liga=null;
  lista.forEach(x=>{
    if(x.liga!==liga){ liga=x.liga; p.cuerpo.appendChild(el("div","cs-mes",escHtml(liga||"—"))); }
    p.cuerpo.appendChild(_csFila({a:x.idA,b:x.idB,na:x.a,nb:x.b,ga:x.ga,gb:x.gb,cuando:"FT"}));
  });
  cont.appendChild(p);
}
/* ---------- ficha de un equipo: como si lo manejaras ---------- */
function _csEquipo(cont){
  const u=_csUI(), id=u.equipo; if(!id){ u.tab="partidos"; return _csPartidos(cont); }
  const key=_csLigaDe(id), filas=key?mundoFilasLiga(key):[], pos=filas.findIndex(x=>x.id===id), fila=filas[pos]||{};
  const info=(typeof CLUB_INFO_2026==="object"&&CLUB_INFO_2026[id])||{};
  const cab=el("div","cs-equipo-cab");
  cab.innerHTML="<div class='cs-equipo-esc'>"+_csEsc(id)+"</div><div><h2>"+escHtml(_csNomLargo(id))+(id===E.club?" <span class='mini'>(tu club)</span>":"")+"</h2>"+
    "<div class='mini'>"+escHtml(key?(_CS_LIGAS[key]||key):"")+(pos>=0?" · "+(pos+1)+"° con "+(fila.pts||0)+" pts":"")+
    (info.dt?" · DT "+escHtml(info.dt):"")+((typeof estadioNombre==="function"&&estadioNombre(id))?" · "+escHtml(estadioNombre(id)):"")+"</div>"+
    "<div class='cs-forma grande'>"+_csForma(id).map(x=>"<i class='fd f"+x+"'></i>").join("")+"</div></div>";
  const volver=el("button","btn-aqua chico gris","← Volver"); volver.onclick=()=>{ u.equipo=null; u.tab="tablas"; irA("calendario"); };
  cab.appendChild(volver);
  cont.appendChild(cab);
  const f=el("div","fichas cs-chips");
  [["partidos","Partidos"],["tabla","Tabla"],["plantel","Plantel"]].forEach(([k,n])=>{ const b=el("button","ficha",n); b.setAttribute("aria-pressed",u.sub===k?"true":"false"); b.onclick=()=>{ u.sub=k; irA("calendario"); }; f.appendChild(b); });
  cont.appendChild(f);
  if(u.sub==="tabla"&&key){ const p=panel(_CS_LIGAS[key]||key,"📊","agua"); p.cuerpo.appendChild(_csTabla(key,{marca:id})); cont.appendChild(p); return; }
  if(u.sub==="plantel"){
    const p=panel("Plantel de "+_csNom(id),"👥");
    const pl=((typeof cpuPlantel==="function")?cpuPlantel(id):[]).filter(j=>!j.vendido).slice();
    const ORD={ARQ:0,DEF:1,VOL:2,DEL:3};
    pl.sort((a,b)=>(ORD[a.pos]-ORD[b.pos])||(b.nivel-a.nivel));
    if(!pl.length) p.cuerpo.appendChild(el("p","mini","Sin plantel cargado."));
    const t=el("table","cs-tabla");
    t.innerHTML="<thead><tr><th class='izq'>Jugador</th><th>Pos</th><th class='n'>Edad</th><th class='n'>Niv</th><th class='n cs-oc'>Valor</th></tr></thead>";
    const tb=el("tbody");
    pl.forEach(j=>{ const tr=el("tr"); tr.innerHTML="<td class='izq'>"+(j.real?"● ":"")+escHtml(j.n)+"</td><td>"+j.pos+"</td><td class='n'>"+j.edad+"</td><td class='n pts'>"+j.nivel+"</td><td class='n cs-oc'>"+plata(j.valor||0)+"</td>"; tb.appendChild(tr); });
    t.appendChild(tb); p.cuerpo.appendChild(t);
    p.cuerpo.appendChild(el("p","mini","● nombre documentado. Niveles aproximados."));
    cont.appendChild(p); return;
  }
  const p=panel("Partidos de "+_csNom(id),"📅");
  const ps=_csPartidosEquipo(id);
  if(!ps.length) p.cuerpo.appendChild(el("p","mini","Sin fixture de liga para este equipo."));
  ps.forEach(x=>{
    const a=x.local?id:x.rival, b=x.local?x.rival:id;
    p.cuerpo.appendChild(_csFila({a:a,b:b,ga:x.jugado?(x.local?x.gf:x.gc):null,gb:x.jugado?(x.local?x.gc:x.gf):null,
      res:x.jugado?(x.gf>x.gc?"G":(x.gf<x.gc?"P":"E")):null, cuando:"F"+(x.r+1), tag:null}));
  });
  cont.appendChild(p);
}
/* ---------- buscador de equipos ---------- */
function _csIndiceEquipos(){
  const out=[], visto={};
  _csLigas().forEach(l=>{ (E.mundo.ligas[l.k].ids||[]).forEach(id=>{ if(visto[id]) return; visto[id]=1; out.push({id:id,n:_csNomLargo(id),c:_csNom(id),liga:l.n}); }); });
  return out;
}
function _csBuscador(cont){
  const box=el("div","cs-buscar");
  const inp=el("input","pick-buscar"); inp.type="search"; inp.placeholder="🔎 Buscar equipo (Primera, B, Segunda…)"; inp.setAttribute("aria-label","Buscar equipo");
  const res=el("div","cs-buscar-res");
  const idx=_csIndiceEquipos();
  const norm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g," ").trim();
  inp.oninput=()=>{
    const q=norm(inp.value); res.innerHTML="";
    if(!q){ res.classList.remove("on"); return; }
    const hits=idx.filter(x=>norm(x.n).indexOf(q)>=0||norm(x.c).indexOf(q)>=0).slice(0,8);
    hits.forEach(x=>{ const b=el("button","cs-hit",_csEsc(x.id)+"<span>"+escHtml(x.n)+"</span><span class='mini'>"+escHtml(x.liga)+"</span>");
      b.onclick=()=>{ const u=_csUI(); u.equipo=x.id; u.tab="equipo"; u.sub="partidos"; irA("calendario"); }; res.appendChild(b); });
    if(!hits.length) res.appendChild(el("div","mini cs-nada","Ningún equipo con ese nombre."));
    res.classList.add("on");
  };
  box.appendChild(inp); box.appendChild(res);
  cont.appendChild(box);
}
function vistaCalendarioSofa(){
  const v=$("#vista"), u=_csUI();
  const cont=el("div","cs");
  _csBuscador(cont);
  const tabs=el("div","cs-tabs"); tabs.setAttribute("role","tablist");
  const TABS=[["partidos","Partidos"],["tablas","Tablas"],["copas","Copas"],["resultados","Resultados"]];
  if(u.equipo) TABS.push(["equipo",_csNom(u.equipo)]);
  TABS.forEach(([k,n])=>{ const b=el("button","cs-tab"+(u.tab===k?" on":""),escHtml(n)); b.setAttribute("role","tab"); b.setAttribute("aria-selected",u.tab===k?"true":"false");
    b.onclick=()=>{ u.tab=k; irA("calendario"); }; tabs.appendChild(b); });
  cont.appendChild(tabs);
  const cuerpo=el("div","cs-cuerpo"); cont.appendChild(cuerpo);
  try{
    ({partidos:_csPartidos,tablas:_csTablas,copas:_csCopas,resultados:_csResultados,equipo:_csEquipo}[u.tab]||_csPartidos)(cuerpo);
  }catch(e){ cuerpo.appendChild(el("p","mini","No se pudo dibujar: "+e.message)); }
  v.appendChild(cont);
}
(function(){
  if(typeof vistaCalendario!=="function"||vistaCalendario._sofa) return;
  const orig=vistaCalendario;
  vistaCalendario=function(){
    if(!(typeof mundoEra2026==="function"&&mundoEra2026()&&E&&E.mundo&&E.mundo.ver===2)) return orig.apply(this,arguments);
    return vistaCalendarioSofa();
  };
  Object.keys(orig).forEach(k=>vistaCalendario[k]=orig[k]);
  vistaCalendario._sofa=true;
})();
