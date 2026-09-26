"use strict";
/* ============================================================
   FUTBOLINI · historia-carrera.js  (7.9066)
   Pedido del autor (etapa 3, tarea 17): "Historia y Carrera con cariño, que funcionen con
   cualquier club" y "Avisos como un registro".
   - Historia: ficha del club (ciudad, fundación, estadio, colores, clásicos) armada con los datos
     que hay para CUALQUIER club, tu era en el club (números, gráfico de posiciones, récords,
     goleadores) y lo que el club recuerda de ti.
   - Carrera: tu carrera en números, club por club, y cómo se movió tu reputación año a año.
   - Avisos: un registro filtrable (buenos/malos, tema, búsqueda), compacto, con el detalle al tocar.
   Registros que se llevan desde esta versión: E.records (por club) y E.repHist (por temporada).
   ============================================================ */
function nomClubCualquiera(id){
  if(!id) return "—";
  const f=[typeof CLUB_INFO_2026!=="undefined"&&CLUB_INFO_2026[id], typeof CLUB_INFO!=="undefined"&&CLUB_INFO[id],
    typeof CLUB_POR_ID!=="undefined"&&CLUB_POR_ID[id]];
  for(const c of f){ if(c&&c.n) return c.n; }
  if(typeof _nomClub==="function"){ try{ const n=_nomClub(id); if(n) return n; }catch(e){} }
  return id;
}
function fichaClub(id){
  const meta=(typeof CLUB_META!=="undefined"&&CLUB_META[id])||{};
  const inf=(typeof CLUB_INFO_2026!=="undefined"&&CLUB_INFO_2026[id])||(typeof CLUB_INFO!=="undefined"&&CLUB_INFO[id])||{};
  const est=(typeof ESTADIOS_DATA!=="undefined"&&ESTADIOS_DATA[id])||null;
  const cp=(typeof CLUB_POR_ID!=="undefined"&&CLUB_POR_ID[id])||{};
  const rivales=(typeof RIVALIDADES_2026!=="undefined"?RIVALIDADES_2026:[]).filter(p=>p[0]===id||p[1]===id).map(p=>p[0]===id?p[1]:p[0]);
  if(["CC","UCH","UC"].indexOf(id)>=0) ["CC","UCH","UC"].forEach(g=>{ if(g!==id&&rivales.indexOf(g)<0) rivales.push(g); });
  return {id:id, n:nomClubCualquiera(id), ciudad:meta.ciudad||inf.ciudad||null, fund:meta.fund||inf.fund||null,
    colores:meta.colores||inf.colores||null, estadio:(est&&est.nombre)||cp.est||null, aforo:(est&&est.aforo)||cp.aforo||null,
    rivales:rivales};
}
/* ---------- registros que se llevan partido a partido ---------- */
function _recClub(id){
  E.records=E.records||{porClub:{},rachaAct:0,rachaMax:0};
  const r=E.records.porClub[id]=E.records.porClub[id]||{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,goles:{},mayorGol:null,peorDer:null,rachaAct:0,rachaMax:0,desde:E.anio};
  return r;
}
function registrarPartidoHistoria(part,yo,otro,goleadores){
  if(!E||!part||part.tipo==="amistoso"||!E.club) return;
  const r=_recClub(E.club), riv=part.rivalNombre||nomClubCualquiera(part.rivalId);
  r.pj++; r.gf+=yo; r.gc+=otro;
  if(yo>otro){ r.pg++; r.rachaAct=(r.rachaAct||0)+1; r.rachaMax=Math.max(r.rachaMax||0,r.rachaAct); }
  else { r.rachaAct=0; if(yo===otro) r.pe++; else r.pp++; }
  const dif=yo-otro, reg={gf:yo,gc:otro,riv:riv,anio:E.anio,torneo:part.torneo||(part.tipo==="liga"?"Liga":"Copa")};
  if(dif>0&&(!r.mayorGol||dif>r.mayorGol.gf-r.mayorGol.gc||(dif===r.mayorGol.gf-r.mayorGol.gc&&yo>r.mayorGol.gf))) r.mayorGol=reg;
  if(dif<0&&(!r.peorDer||dif<r.peorDer.gf-r.peorDer.gc)) r.peorDer=reg;
  (goleadores||[]).forEach(n=>{ if(n) r.goles[n]=(r.goles[n]||0)+1; });
}
function registrarRepTemporada(){
  if(!E||!E.rep) return;
  E.repHist=E.repHist||[];
  if(E.repHist.some(h=>h.anio===E.anio)) return;
  E.repHist.push({anio:E.anio,club:E.club,publica:Math.round(E.rep.publica||0),credibilidad:Math.round(E.rep.credibilidad||0),dureza:Math.round(E.rep.dureza||0)});
  if(E.repHist.length>60) E.repHist.shift();
}
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._hc) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._hc=true; window[nom]=w; };
  envolver("terminarPartido",o=>function(P){
    const r=o.apply(this,arguments);
    try{ if(P&&P.part&&P.part.jugado) registrarPartidoHistoria(P.part,P.part.gf||0,P.part.gc||0,P.goleadores); }catch(e){}
    return r;
  });
  envolver("finDeTemporada",o=>function(){ try{ registrarRepTemporada(); }catch(e){} return o.apply(this,arguments); });
})();
/* ---------- números de liga por temporada (sale del historial guardado + la actual) ---------- */
function temporadasEnClub(id){
  const out=[];
  (E.historialAnual||[]).slice().reverse().forEach(h=>{
    if(h.club!==id) return;
    const f=(h.tabla||[]).find(x=>x.id===id)||{};
    out.push({anio:h.anio,pos:h.pos,campeon:!!h.campeon,copa:!!h.copa,pj:f.pj||0,pg:f.pg||0,pe:f.pe||0,pp:f.pp||0,gf:f.gf||0,gc:f.gc||0,pts:f.pts||0,equipos:(h.tabla||[]).length});
  });
  if(E.club===id&&E.tabla&&E.tabla[id]&&!out.some(x=>x.anio===E.anio)){
    const t=E.tabla[id];
    let pos=null; try{ pos=posicionEnTabla(); }catch(e){}
    out.push({anio:E.anio,pos:pos,actual:true,pj:t.pj||0,pg:t.pg||0,pe:t.pe||0,pp:t.pp||0,gf:t.gf||0,gc:t.gc||0,pts:t.pts||0,equipos:Object.keys(E.tabla).length});
  }
  return out;
}
function _sumar(ts){
  return ts.reduce((s,t)=>{ ["pj","pg","pe","pp","gf","gc","pts"].forEach(k=>s[k]+=t[k]||0); return s; },{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0});
}
/* gráfico de línea chico (SVG, sin librerías) */
function svgLineaSimple(pts,opt){
  opt=opt||{}; const W=320,H=opt.h||120,pad=22;
  if(!pts.length) return "";
  const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
  const x0=Math.min.apply(null,xs), x1=Math.max.apply(null,xs);
  const y0=opt.min!=null?opt.min:Math.min.apply(null,ys), y1=opt.max!=null?opt.max:Math.max.apply(null,ys);
  const X=x=>pad+(x1===x0?(W-2*pad)/2:(x-x0)/(x1-x0)*(W-2*pad));
  const Y=y=>{ const t=(y1===y0)?0.5:(y-y0)/(y1-y0); return opt.invertir?pad/2+t*(H-pad*1.5):H-pad+ -t*(H-pad*1.5); };
  const d=pts.map((p,i)=>(i?"L":"M")+X(p.x).toFixed(1)+" "+Y(p.y).toFixed(1)).join(" ");
  let s='<svg class="hc-graf" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+escHtml(opt.titulo||"gráfico")+'">';
  s+='<line x1="'+pad+'" y1="'+(H-pad+4)+'" x2="'+(W-pad)+'" y2="'+(H-pad+4)+'" class="hc-eje"/>';
  s+='<path d="'+d+'" class="hc-linea" style="stroke:'+(opt.color||"#2f8f4e")+'"/>';
  pts.forEach(p=>{ s+='<circle cx="'+X(p.x).toFixed(1)+'" cy="'+Y(p.y).toFixed(1)+'" r="'+(p.marca?5:3)+'" class="hc-pt'+(p.marca?" marca":"")+'"><title>'+escHtml(p.etq||(p.x+": "+p.y))+'</title></circle>';
    if(p.marca) s+='<text x="'+X(p.x).toFixed(1)+'" y="'+(Y(p.y)-8).toFixed(1)+'" text-anchor="middle" class="hc-marca">🏆</text>'; });
  const etqX=pts.length>8?[pts[0],pts[pts.length-1]]:pts;
  etqX.forEach(p=>{ s+='<text x="'+X(p.x).toFixed(1)+'" y="'+(H-4)+'" text-anchor="middle" class="hc-tx">'+p.x+'</text>'; });
  if(opt.etqY) s+='<text x="4" y="12" class="hc-tx">'+escHtml(opt.etqY)+'</text>';
  return s+"</svg>";
}
/* ---------- Historia ---------- */
function panelFichaClub(){
  const f=fichaClub(E.club), p=panel("Ficha de "+escHtml(f.n),"🛡️","agua");
  p.classList.add("hc-ficha");
  const cab=el("div","hc-cab");
  cab.innerHTML=((typeof escudoChip==="function")?escudoChip(E.club):"")+'<div><b>'+escHtml(f.n)+'</b><div class="mini">'+
    [f.ciudad,f.fund?("fundado en "+f.fund+" · "+Math.max(0,(E.anio||2026)-f.fund)+" años"):null].filter(Boolean).map(escHtml).join(" · ")+'</div></div>'+
    (f.colores?'<span class="hc-colores">'+f.colores.map(c=>'<i style="background:'+escHtml(c)+'"></i>').join("")+'</span>':"");
  p.cuerpo.appendChild(cab);
  if(f.estadio) p.cuerpo.appendChild(fila("Estadio",escHtml(f.estadio)+(f.aforo?" · "+Number(f.aforo).toLocaleString("es-CL"):"")));
  if(f.rivales.length) p.cuerpo.appendChild(fila("Clásicos",f.rivales.map(nomClubCualquiera).map(escHtml).join(", ")));
  const div=(typeof divisionDeClub==="function")?divisionDeClub(E.club):null;
  if(div) p.cuerpo.appendChild(fila("Juega en",escHtml(typeof div==="number"?(["","Primera División","Primera B","Segunda División"][div]||("División "+div)):String(div))));
  if(!f.ciudad&&!f.fund&&!f.estadio) p.cuerpo.appendChild(el("p","mini","De este club no hay ficha documentada todavía: lo que se ve abajo lo escribes tú."));
  return p;
}
function panelEraEnClub(){
  const ts=temporadasEnClub(E.club), tot=_sumar(ts), r=(E.records&&E.records.porClub&&E.records.porClub[E.club])||null;
  const p=panel("Tu era en "+escHtml(E.clubNombre||nomClubCualquiera(E.club)),"📈");
  if(!ts.length&&!r){ p.cuerpo.appendChild(el("p","mini","Todavía no juegas en este club. Cada partido va quedando acá.")); return p; }
  const rend=tot.pj?Math.round(100*(tot.pg*3+tot.pe)/(tot.pj*3)):0;
  const g=el("div","hc-nums");
  [["Temporadas",ts.filter(t=>!t.actual).length+(ts.some(t=>t.actual)?" + la actual":"")],["PJ (liga)",tot.pj],["G-E-P",tot.pg+"-"+tot.pe+"-"+tot.pp],["Goles",tot.gf+" : "+tot.gc],["Rendimiento",rend+" %"],
   ["Títulos",(E.titulos||[]).length]].forEach(([k,v])=>{ const d=el("div","hc-num"); d.innerHTML="<b>"+escHtml(String(v))+"</b><span>"+k+"</span>"; g.appendChild(d); });
  p.cuerpo.appendChild(g);
  const conPos=ts.filter(t=>t.pos);
  if(conPos.length>=2){
    const w=el("div","hc-graf-wrap"); w.innerHTML='<div class="mini">Posición final por temporada (arriba es mejor)</div>'+
      svgLineaSimple(conPos.map(t=>({x:t.anio,y:t.pos,marca:t.campeon||t.copa,etq:t.anio+": "+t.pos+"°"+(t.actual?" (en curso)":"")})),{invertir:true,min:1,max:Math.max.apply(null,conPos.map(t=>t.equipos||t.pos)),titulo:"posiciones"});
    p.cuerpo.appendChild(w);
  } else if(conPos.length===1) p.cuerpo.appendChild(el("p","mini","Con una temporada más aparece el gráfico de posiciones."));
  if(ts.length){
    const best=conPos.slice().sort((a,b)=>a.pos-b.pos)[0], worst=conPos.slice().sort((a,b)=>b.pos-a.pos)[0];
    if(best) p.cuerpo.appendChild(fila("Mejor campaña",best.anio+" · "+best.pos+"°"+(best.campeon?" (campeón)":"")));
    if(worst&&worst!==best) p.cuerpo.appendChild(fila("Peor campaña",worst.anio+" · "+worst.pos+"°"));
  }
  if(r){
    if(r.mayorGol) p.cuerpo.appendChild(fila("Mayor goleada",r.mayorGol.gf+"-"+r.mayorGol.gc+" a "+escHtml(r.mayorGol.riv)+" ("+r.mayorGol.anio+")"));
    if(r.peorDer) p.cuerpo.appendChild(fila("Peor derrota",r.peorDer.gf+"-"+r.peorDer.gc+" con "+escHtml(r.peorDer.riv)+" ("+r.peorDer.anio+")"));
    if(r.rachaMax>=2) p.cuerpo.appendChild(fila("Mejor racha","ganaste "+r.rachaMax+" seguidos"));
    const gol=Object.keys(r.goles||{}).map(n=>[n,r.goles[n]]).sort((a,b)=>b[1]-a[1]).slice(0,5);
    if(gol.length){
      p.cuerpo.appendChild(el("h3","sub","Goleadores de tu era"));
      gol.forEach((x,i)=>p.cuerpo.appendChild(fila((i+1)+". "+escHtml(x[0]),x[1]+" gol"+(x[1]===1?"":"es"))));
    }
    p.cuerpo.appendChild(el("p","mini","Récords y goleadores contados desde "+r.desde+" (todos los partidos oficiales, no amistosos)."));
  }
  return p;
}
function panelMemoriaClub(){
  const mem=(E.memoria||[]).filter(m=>m&&(m.peso==="alto"||m.peso==="medio")).slice(-14).reverse();
  if(!mem.length) return null;
  const p=panel("Lo que el club recuerda de ti","🧠","agua");
  let anio=null;
  mem.forEach(m=>{
    if(m.anio!==anio){ anio=m.anio; p.cuerpo.appendChild(el("div","hc-anio",String(anio))); }
    const d=el("div","hc-mem "+(m.tono==="bueno"?"bien":(m.tono==="malo"?"mal":"")));
    d.textContent=(m.txt||"").charAt(0).toUpperCase()+(m.txt||"").slice(1)+".";
    p.cuerpo.appendChild(d);
  });
  return p;
}
(function(){
  const o=window.vistaHistoria; if(typeof o!=="function"||o._hc) return;
  const w=function(){
    const r=o.apply(this,arguments);
    try{
      const v=$("#vista"); if(!v||!E) return r;
      const pan=[panelFichaClub(),panelEraEnClub(),panelMemoriaClub()].filter(Boolean);
      for(let i=pan.length-1;i>=0;i--) v.insertBefore(pan[i],v.firstChild);
    }catch(e){ console.error("historia:",e); }
    return r;
  };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._hc=true; window.vistaHistoria=w;
})();
/* ---------- Carrera ---------- */
function clubesDeCarrera(){
  const lista=(E.carrera&&E.carrera.clubes||[]).map(c=>({club:c.club,desde:c.desde,hasta:c.hasta,titulos:(c.titulos||[]).length,actual:false}));
  if(E.club&&!(E.carrera&&E.carrera.enParo)) lista.push({club:E.club,desde:(E.carrera&&E.carrera.desde)||E.anio,hasta:E.anio,titulos:null,actual:true});
  return lista;
}
function panelCarreraNumeros(){
  const todos=(E.historialAnual||[]).map(h=>{ const f=(h.tabla||[]).find(x=>x.id===h.club)||{}; return {pj:f.pj||0,pg:f.pg||0,pe:f.pe||0,pp:f.pp||0,gf:f.gf||0,gc:f.gc||0,pts:f.pts||0}; });
  const act=(E.club&&E.tabla&&E.tabla[E.club])?E.tabla[E.club]:null;
  if(act&&!(E.historialAnual||[]).some(h=>h.anio===E.anio&&h.club===E.club)) todos.push(act);
  const tot=_sumar(todos), clubes=clubesDeCarrera();
  const desde=clubes.reduce((m,c)=>Math.min(m,c.desde||E.anio),E.anio);
  const rend=tot.pj?Math.round(100*(tot.pg*3+tot.pe)/(tot.pj*3)):0;
  const p=panel("Tu carrera en números","🧾","agua");
  const g=el("div","hc-nums");
  [["Años",Math.max(1,E.anio-desde+1)],["Clubes",new Set(clubes.map(c=>c.club)).size],["PJ (liga)",tot.pj],["G-E-P",tot.pg+"-"+tot.pe+"-"+tot.pp],
   ["Rendimiento",rend+" %"],["Títulos",(E.titulos||[]).length],["Despidos",(E.carrera&&E.carrera.despidos)||0]]
    .forEach(([k,v])=>{ const d=el("div","hc-num"); d.innerHTML="<b>"+escHtml(String(v))+"</b><span>"+k+"</span>"; g.appendChild(d); });
  p.cuerpo.appendChild(g);
  p.cuerpo.appendChild(el("h3","sub","Club por club"));
  clubes.slice().reverse().forEach(c=>{
    const ts=temporadasEnClub(c.club).filter(t=>t.anio>=c.desde&&t.anio<=c.hasta), s=_sumar(ts);
    const best=ts.filter(t=>t.pos).sort((a,b)=>a.pos-b.pos)[0];
    const d=el("div","hc-club"+(c.actual?" actual":""));
    d.innerHTML=((typeof escudoChip==="function")?escudoChip(c.club):"")+'<div><b>'+escHtml(nomClubCualquiera(c.club))+'</b> <span class="mini">'+c.desde+"–"+(c.actual?"hoy":c.hasta)+'</span>'+
      '<div class="mini">'+(s.pj?s.pj+" PJ · "+s.pg+"-"+s.pe+"-"+s.pp:"sin temporadas cerradas")+(best?" · mejor: "+best.pos+"°":"")+(c.titulos?" · "+c.titulos+" título(s)":"")+'</div></div>';
    p.cuerpo.appendChild(d);
  });
  const rh=(E.repHist||[]).slice();
  if(E.rep) rh.push({anio:E.anio+(rh.some(h=>h.anio===E.anio)?0.5:0),publica:Math.round(E.rep.publica),credibilidad:Math.round(E.rep.credibilidad),hoy:true});
  if(rh.length>=2){
    const w=el("div","hc-graf-wrap");
    w.innerHTML='<div class="mini">Tu imagen pública por temporada (0–100)</div>'+
      svgLineaSimple(rh.map(h=>({x:Math.floor(h.anio),y:h.publica,etq:Math.floor(h.anio)+": imagen "+h.publica+", credibilidad "+h.credibilidad+(h.hoy?" (hoy)":"")})),{min:0,max:100,color:"#2a6fb8",titulo:"imagen pública"});
    p.cuerpo.appendChild(w);
  } else p.cuerpo.appendChild(el("p","mini","Al cerrar la temporada queda guardada tu reputación y aparece la curva año a año."));
  return p;
}
(function(){
  const o=window.vistaCarrera; if(typeof o!=="function"||o._hc) return;
  const w=function(){
    const r=o.apply(this,arguments);
    try{ const v=$("#vista"); if(v&&E) v.insertBefore(panelCarreraNumeros(),v.firstChild); }catch(e){ console.error("carrera:",e); }
    return r;
  };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._hc=true; window.vistaCarrera=w;
})();
/* ---------- Avisos como registro ---------- */
const AVISO_TEMAS=[
  ["plata","💰","Plata",/caja|plata|millon|sueldo|taquilla|balance econ|venta|vendi|deuda|sponsor|patrimonio|apuesta|casino|bolsillo|finanz/i],
  ["plantel","⚽","Plantel",/lesi|jugador|fichaj|contrato|renov|cantera|plantel|juvenil|prést|libre|DT|capitán/i],
  ["prensa","🎙️","Prensa y redes",/prensa|conferencia|declar|plop|redes|periodista|portal|filtr/i],
  ["club","🏛️","Club",/directorio|estatut|barra|estadio|obra|socios|ANFP|federación|asamblea|elección|presidente/i],
  ["vida","❤️","Vida",/bebé|pareja|cita|familia|hijo|hija|visita|salud|bienestar|casa|compraste/i],
  ["partido","🏆","Resultados",/campe|gol|fecha|resultado|ganaste|perdiste|empate|ascen|descen|copa|liguilla|final|balance \d/i],
  ["historia","📜","Historia",/historia|leyenda|aniversario|capítulo/i]
];
function temaAviso(n){
  /* primero manda el título; el detalle solo desempata */
  const m=AVISO_TEMAS.find(x=>x[3].test(n.t||""))||AVISO_TEMAS.find(x=>x[3].test(n.d||""));
  return m?m[0]:"otro";
}
let AVISOS_FILTRO={tono:"todos",tema:"todos",q:"",n:60};
(function(){
  const o=window.vistaAvisos; if(typeof o!=="function"||o._hc) return;
  const w=function(){
    const v=$("#vista");
    const acc=(typeof notifsAccionables==="function")?notifsAccionables():[];
    if(acc.length){
      const pa=panel("Requieren tu respuesta","📨","alerta");
      acc.forEach(n=>pa.cuerpo.appendChild(tarjetaAviso(n,true)));
      v.appendChild(pa);
    }
    const p=panel("Registro","🔔","agua"); p.classList.add("av-log");
    const lista=(E.notifs||[]).filter(n=>!(n.acc&&!n.acc.resuelta));
    /* filtros */
    const barra=el("div","av-filtros");
    const chip=(grupo,k,txt)=>{ const b=el("button","ficha",txt); b.setAttribute("aria-pressed",AVISOS_FILTRO[grupo]===k?"true":"false");
      b.onclick=()=>{ AVISOS_FILTRO[grupo]=k; AVISOS_FILTRO.n=60; render(); }; return b; };
    const f1=el("div","fichas");
    [["todos","Todos"],["bueno","✅ Buenos"],["malo","⚠️ Malos"],["noleido","● Sin leer"]].forEach(x=>f1.appendChild(chip("tono",x[0],x[1])));
    const f2=el("div","fichas");
    f2.appendChild(chip("tema","todos","Todo tema"));
    AVISO_TEMAS.forEach(x=>{ const n=lista.filter(a=>temaAviso(a)===x[0]).length; if(n) f2.appendChild(chip("tema",x[0],x[1]+" "+x[2]+" · "+n)); });
    const q=el("input","av-buscar"); q.type="search"; q.placeholder="Buscar en el registro…"; q.value=AVISOS_FILTRO.q;
    q.oninput=()=>{ AVISOS_FILTRO.q=q.value; pintarLista(); };
    barra.appendChild(f1); barra.appendChild(f2); barra.appendChild(q);
    p.cuerpo.appendChild(barra);
    const acciones=el("div","av-acc");
    const bl=el("button","btn-aqua chico gris","Marcar todo leído"); bl.onclick=()=>{ marcarLeidas(); guardar(); render(); };
    const bb=el("button","btn-aqua chico rojo","Vaciar leídos"); bb.onclick=()=>{ if(confirm("¿Borrar del registro todos los avisos leídos?")){ E.notifs=(E.notifs||[]).filter(n=>!n.leido||(n.acc&&!n.acc.resuelta)); guardar(); render(); } };
    acciones.appendChild(bl); acciones.appendChild(bb); p.cuerpo.appendChild(acciones);
    const cont=el("div","av-lista"); p.cuerpo.appendChild(cont);
    function pintarLista(){
      cont.innerHTML="";
      const qq=(AVISOS_FILTRO.q||"").toLowerCase().trim();
      const fil=lista.filter(n=>{
        if(AVISOS_FILTRO.tono==="bueno"&&n.tipo!=="bueno") return false;
        if(AVISOS_FILTRO.tono==="malo"&&n.tipo!=="malo") return false;
        if(AVISOS_FILTRO.tono==="noleido"&&n.leido) return false;
        if(AVISOS_FILTRO.tema!=="todos"&&temaAviso(n)!==AVISOS_FILTRO.tema) return false;
        if(qq&&((n.t||"")+" "+(n.d||"")).toLowerCase().indexOf(qq)<0) return false;
        return true;
      });
      if(!fil.length){ cont.appendChild(el("p","mini",lista.length?"Nada con ese filtro.":"Todavía no hay avisos. Todo lo importante que pase queda registrado acá.")); return; }
      let grupo=null;
      fil.slice(0,AVISOS_FILTRO.n).forEach(n=>{
        const g=n.anio+" · "+n.fecha;
        if(g!==grupo){ grupo=g; cont.appendChild(el("div","av-fecha",escHtml(g))); }
        const row=el("details","av-fila "+claseTipo(n.tipo)+(n.leido?"":" nuevo"));
        const tm=AVISO_TEMAS.find(x=>x[0]===temaAviso(n));
        row.innerHTML='<summary><span class="av-ic">'+(tm?tm[1]:icoTipo(n.tipo))+'</span><span class="av-t">'+n.t+'</span>'+(n.leido?'':'<span class="av-nuevo">nuevo</span>')+'</summary>'+
          '<div class="av-d">'+(n.d||"")+(n.extra?'<div class="mini">'+n.extra+'</div>':'')+'</div>';
        cont.appendChild(row);
      });
      if(fil.length>AVISOS_FILTRO.n){ const b=el("button","btn-aqua chico","Ver "+Math.min(60,fil.length-AVISOS_FILTRO.n)+" más ("+(fil.length-AVISOS_FILTRO.n)+" quedan)"); b.onclick=()=>{ AVISOS_FILTRO.n+=60; pintarLista(); }; cont.appendChild(b); }
    }
    pintarLista();
    v.appendChild(p);
    if(typeof notifsNoLeidas==="function"&&notifsNoLeidas()){ marcarLeidas(); if(typeof pintarBarra==="function") pintarBarra(); if(typeof pintarMenu==="function") pintarMenu(); guardar(); }
  };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._hc=true; window.vistaAvisos=w;
})();
if(typeof document!=="undefined"&&!document.getElementById("css-hc")){
  const st=document.createElement("style"); st.id="css-hc";
  st.textContent=
    ".hc-cab{display:flex;align-items:center;gap:10px;margin-bottom:6px}.hc-cab>div{flex:1;min-width:0}"+
    ".hc-colores{display:flex;gap:3px}.hc-colores i{width:16px;height:16px;border-radius:50%;border:1px solid rgba(0,0,0,.25);display:inline-block}"+
    ".hc-nums{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px;margin:4px 0 8px}"+
    ".hc-num{background:rgba(0,0,0,.05);border-radius:8px;padding:6px 8px;text-align:center}.hc-num b{display:block;font-size:17px;font-variant-numeric:tabular-nums}.hc-num span{font-size:11px;opacity:.75}"+
    ".hc-graf-wrap{margin:6px 0 8px}.hc-graf{width:100%;height:auto;max-height:180px;display:block}"+
    ".hc-linea{fill:none;stroke-width:2.5;stroke-linejoin:round}.hc-eje{stroke:rgba(0,0,0,.2)}.hc-pt{fill:#fff;stroke:#2f8f4e;stroke-width:2}.hc-pt.marca{fill:#f2c230}"+
    ".hc-tx{font-size:10px;fill:currentColor;opacity:.7}.hc-marca{font-size:11px}"+
    ".hc-anio{font-weight:700;margin:8px 0 2px;opacity:.8}.hc-mem{padding:4px 8px;border-left:3px solid rgba(0,0,0,.2);margin:2px 0;font-size:13px}.hc-mem.bien{border-color:#4fbf3f}.hc-mem.mal{border-color:#d9534f}"+
    ".hc-club{display:flex;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid rgba(0,0,0,.06)}.hc-club.actual b{color:#2f8f4e}"+
    ".av-filtros .fichas{margin-bottom:4px;flex-wrap:wrap}.av-buscar{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid rgba(0,0,0,.15);margin:4px 0 6px;font-size:14px}"+
    ".av-acc{display:flex;gap:6px;margin-bottom:6px}.av-fecha{font-size:11px;font-weight:700;text-transform:uppercase;opacity:.6;margin:10px 0 2px}"+
    ".av-fila{border-radius:8px;margin:2px 0;background:rgba(0,0,0,.035)}.av-fila>summary{display:flex;gap:8px;align-items:center;padding:6px 8px;cursor:pointer;list-style:none}.av-fila>summary::-webkit-details-marker{display:none}"+
    ".av-t{flex:1;min-width:0;font-size:13.5px}.av-fila.mal .av-t{color:#a8322d}.av-fila.bien .av-t{color:#2d7a34}.av-nuevo{font-size:10px;background:#e0a92a;color:#fff;border-radius:6px;padding:1px 5px}"+
    ".av-d{padding:0 10px 8px 34px;font-size:13px;line-height:1.4}";
  document.head.appendChild(st);
}
