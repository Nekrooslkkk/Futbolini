"use strict";
/* ============================================================
   FUTBOLINI 3.0 · ui-partido.js
   Pantallas de previa, partido en vivo y resumen.
   ============================================================ */
let P_ACTUAL=null, TIMER=null, PAUSADO=false, MOMENTO_OPS=[], VEL_PARTIDO=260;
/* 7.9003 · palancas rápidas: cambian el cálculo del SIGUIENTE tick, sin pausar. */
const HOT_SWAPS={
  bus:{n:"🚌 Autobús", ment:"Ultradefensivo", bloque:"Bajo", presion:"Baja"},
  eq: {n:"⚖️ Equilibrado", ment:"Equilibrado", bloque:"Medio", presion:"Media"},
  ata:{n:"⚔️ Ataque Total", ment:"Ultraofensivo", bloque:"Alto", presion:"Alta"}
};
function aplicarHotSwap(id, Popt){
  const P=Popt||P_ACTUAL;
  if(!P||P.terminado) return null;
  const hs=HOT_SWAPS[id]; if(!hs) return null;
  if(typeof E==="undefined"||!E) return null;
  E.tactica=E.tactica||{};
  if(E.tactica.mentalidad===hs.ment && E.tactica.bloque===hs.bloque && E.tactica.presion===hs.presion){
    P._hotSwap=id;
    return hs;
  }
  E.tactica.mentalidad=hs.ment;
  E.tactica.bloque=hs.bloque;
  E.tactica.presion=hs.presion;
  if(typeof reaplicarPlan==="function") reaplicarPlan(P);
  P._hotSwap=id;
  if(typeof linea==="function") linea(P,P.min,"Cambio en caliente: "+hs.n+". El equipo lo siente YA.","cambio");
  if(typeof guardar==="function") guardar();
  /* NO se pausa, NO se corta el intervalo: el siguiente tick ya usa el plan nuevo. */
  if(P===P_ACTUAL && typeof pintarPartido==="function") pintarPartido();
  return hs;
}
/* Atajos durante el partido: Espacio = pausa/reanuda · 1/2/3 = decidir */
function partidoTeclas(e){
  if(!P_ACTUAL||P_ACTUAL.terminado) return;
  if(e.code==="Space"||e.key===" "){
    if(P_ACTUAL.modo!=="simular"){ e.preventDefault(); PAUSADO=!PAUSADO; if(!MOMENTO_OPS.length) pintarPartido(); aviso(PAUSADO?"⏸ Pausa":"▶ Sigue"); }
    return;
  }
  if(MOMENTO_OPS.length){
    const n=parseInt(e.key,10);
    if(n>=1&&n<=MOMENTO_OPS.length){ e.preventDefault(); const b=MOMENTO_OPS[n-1]; MOMENTO_OPS=[]; if(b) b.click(); }
  }
}
document.addEventListener("keydown",partidoTeclas);

/* 6.31 · qué conviene tener listo antes de jugar (reconoce el estado real) */
function checklistPrevia(part,once){
  const items=[];
  const clasico=(typeof esClasico==="function")&&esClasico(part)&&part.tipo!=="amistoso";
  if(part.tipo==="amistoso") items.push({warn:false,ok:true,t:"Amistoso — bajo riesgo",d:"No cuenta para la tabla ni gasta la semana. Rueda minutos y sube la forma; podís probar el once tranquilo."});
  if(clasico) items.push({warn:false,ok:true,t:"Hoy es CLÁSICO ante "+part.rivalNombre,d:"Vale doble para la gente. Es tu objetivo institucional del año."});
  if(typeof arbitroDe==="function"){
    const arb=arbitroDe(part);
    const caseroContra=arb.casero&&!part.local;
    items.push({warn:!!caseroContra, ok:!caseroContra, t:"Dirige "+arb.n,
      d:"Tiene "+arb.desc+"."+(arb.casero?(part.local?" De local, eso te conviene.":" Juegas de visita: ojo, la puede cargar para ellos."):"")});
  }
  /* decisiones urgentes sin resolver */
  const urgentes=(E.decPend||[]).filter(x=>x.peso==="alto").length;
  if(urgentes) items.push({warn:true,t:urgentes+(urgentes>1?" decisiones":" decisión")+" urgente"+(urgentes>1?"s":"")+" sin resolver",
    d:"El buzón tiene temas que hay que cerrar antes del partido.",accion:()=>irA("escritorio")});
  /* conferencia de prensa */
  const confHecha=E.flags["conf_"+E.idx];
  items.push({ok:!!confHecha,warn:false,t:confHecha?"Conferencia de prensa dada":"Conferencia de prensa pendiente",
    d:confHecha?"Ya hablaste con la prensa.":"Hablar suma o resta clima de prensa. Está abajo, en «Antes de salir»."});
  /* alineación / química */
  const manualOn=E.tactica.xiManual&&E.tactica.xiManual.length;
  items.push({ok:!!manualOn,warn:false,t:manualOn?"Alineación armada a mano":"Alineación automática",
    d:manualOn?"Elegiste tú el once.":"El juego pone el mejor once disponible. Puedes cambiarlo abajo."});
  if(typeof quimicaEquipo==="function"){
    const qui=quimicaEquipo(once);
    const detalle=(qui.buenos||0)+" duplas que congenian · "+(qui.malos||0)+" con roce. Sube juntando en la pizarra a los que se llevan bien (edad parecida, mismos rasgos, ídolos de la casa, o que ya jugaron juntos).";
    if(qui.prom<50) items.push({warn:true,t:"Química baja ("+qui.prom+"/100) · nivel "+(qui.bono>=0?"+":"")+qui.bono.toFixed(1),
      d:detalle,accion:()=>modalPizarra(part)});
    else if(qui.prom>=72) items.push({ok:true,warn:false,t:"Química alta ("+qui.prom+"/100) · nivel +"+qui.bono.toFixed(1),
      d:"El grupo está enchufado y eso suma al partido. "+detalle,accion:()=>modalPizarra(part)});
    else items.push({ok:true,warn:false,t:"Química del equipo OK ("+qui.prom+"/100) · nivel "+(qui.bono>=0?"+":"")+qui.bono.toFixed(1),
      d:detalle,accion:()=>modalPizarra(part)});
  }
  /* piernas cansadas en el XI */
  const cansados=once.filter(j=>(j.cansancio||0)>=18);
  if(cansados.length>=2) items.push({warn:true,t:cansados.length+" titulares con las piernas pesadas",
    d:"Cansancio alto: "+cansados.slice(0,3).map(j=>j.n).join(", ")+(cansados.length>3?"…":"")+". Piensa en rotar o entrenar suave.",accion:()=>modalAlineacion(part)});
  /* lesionados que se pierden el partido */
  const les=E.plantel.filter(j=>j.lesion>0&&!j.vendido);
  if(les.length) items.push({warn:false,t:les.length+" jugador"+(les.length>1?"es":"")+" lesionado"+(les.length>1?"s":""),
    d:"No disponibles: "+les.slice(0,4).map(j=>j.n).join(", ")+(les.length>4?"…":"")+"."});
  /* 7.999 · lista de concentrados */
  if(typeof listaMaxEra==="function"){
    const cupo=listaMaxEra();
    const bancaN=typeof bancaMaxEra==="function"?bancaMaxEra():cupo-11;
    const manualB=E.tactica.bancaManual&&E.tactica.bancaManual.length;
    const cort=(typeof estrellasCortadas==="function")?estrellasCortadas(once):[];
    items.push({ok:!!manualB,warn:cort.length>0,t:manualB?"Lista de "+cupo+" armada a mano":"Lista de "+cupo+" automática ("+bancaN+" en la banca)",
      d:cort.length?("Quedó afuera: "+cort.slice(0,3).map(j=>j.n).join(", ")+(cort.length>3?"…":"")+". Se enoja. Tócalo en «Lista de concentrados»."):
        ("Concentrados: 11 titulares + "+bancaN+" suplentes. El resto ni se viste. ANFP/IFAB de la época."),
      accion:()=>modalLista(part)});
  }
  /* barra caliente */
  if(part.local && E.barra && E.barra.roto) items.push({warn:true,t:"La barra está caliente contigo",
    d:"Rompiste un pacto: espera silbidos de local y algún lío en la puerta."});
  return items;
}
/* 3.c · lectura en criollo del plan: qué efecto neto tiene y si las piezas
   (mentalidad + estilo + presión) apuntan al mismo lado o se pelean */
function lecturaPlan(){
  const m=(typeof MENTALIDADES!=="undefined"&&MENTALIDADES[E.tactica.mentalidad])||{ataque:0,orden:0,expo:0,desgaste:0};
  const es=(typeof ESTILOS!=="undefined"&&ESTILOS[E.tactica.estilo])||{ataque:0,orden:0,desgaste:0};
  const pr=(typeof PRESIONES!=="undefined"&&PRESIONES[E.tactica.presion])||{ataque:0,orden:0,expo:0,desgaste:0};
  const bl=(typeof BLOQUES!=="undefined"&&BLOQUES[E.tactica.bloque])||{ataque:0,orden:0,desgaste:0};
  const rt=(typeof RITMOS!=="undefined"&&RITMOS[E.tactica.ritmo])||{ataque:0,orden:0,desgaste:0};
  const atk=m.ataque+es.ataque+pr.ataque+(bl.ataque||0)+(rt.ataque||0);
  const ord=m.orden+es.orden+pr.orden+(bl.orden||0)+(rt.orden||0);
  const desg=(m.desgaste||0)+(es.desgaste||0)+(pr.desgaste||0)+(bl.desgaste||0)+(rt.desgaste||0);
  let cara;
  if(atk>=8 && ord<=-2) cara="Vas con TODO al ataque pero quedas abierto atrás: generas harto y regalas también.";
  else if(atk>=6) cara="Plan ofensivo: buscas el arco rival, con algo de riesgo atrás.";
  else if(ord>=6 && atk<=1) cara="Plan de aguantar y salir de contra: firme atrás, poco arriba.";
  else if(ord>=4) cara="Plan cauto y ordenado: lo primero es no comerte goles.";
  else cara="Plan equilibrado: ni muy arriba ni muy atrás.";
  const s=x=>x>1?1:(x<-1?-1:0);
  const sig=[s(m.ataque-m.orden),s(es.ataque-es.orden),s(pr.ataque-pr.orden),s((bl.ataque||0)-(bl.orden||0)),s((rt.ataque||0)-(rt.orden||0))];
  const pos=sig.filter(x=>x>0).length, neg=sig.filter(x=>x<0).length;
  let coh;
  if(pos>=3&&neg===0) coh="✔ Combinas bien: bloque, ritmo, mentalidad y presión tiran todos para el ataque.";
  else if(neg>=3&&pos===0) coh="✔ Combinas bien: todo apunta a defender y salir de contra.";
  else if(pos&&neg) coh="⚠ Estás mezclando cosas que se pelean (una parte quiere atacar y otra defenderse): el equipo lo siente tibio.";
  else coh="Plan mesurado, sin extremos.";
  const fatiga=desg>=8?" 🥵 Ese ritmo cansa harto: cuida el segundo tiempo.":(desg<=-2?" 🐢 Ritmo tranquilo: llegas entero al final.":"");
  const extra=[];
  if(E.tactica.bloque==="Alto") extra.push("bloque alto");
  if(E.tactica.bloque==="Bajo") extra.push("bloque bajo");
  if(E.tactica.ritmo==="Vertiginoso") extra.push("ritmo vertiginoso");
  if(E.tactica.ritmo==="Pausado") extra.push("ritmo pausado");
  const extraTxt=extra.length?" ("+extra.join(" · ")+")":"";
  return cara+" "+coh+fatiga+extraTxt;
}
/* 7.36 · árbitro con sesgo visible (nombre ficticio + estilo). Determinista. */
function chipArbitro(part,arb){
  const a=arb||((typeof arbitroDe==="function"&&part)?arbitroDe(part):null);
  if(!a) return null;
  const d=el("span","chip-arb"+(a.casero?" casero":"")+(a.estilo==="tarjetero"?" tarj":"")+(a.estilo==="deja jugar"?" suave":""));
  d.innerHTML="🧑‍⚖️ <b>"+a.n+"</b> · "+a.estilo;
  d.title=a.desc+(a.casero?" · cobra para el local.":".");
  return d;
}
function celdaCans(j){
  const c=Math.round(j.cansancio||0);
  const cls=c>=18?"n cans-alto":(c>=10?"n cans-medio":"n");
  return "<td class='"+cls+"'>"+c+"</td>";
}
function pantallaPrevia(part){
  if(typeof partidoEnCurso==="function" && partidoEnCurso()){
    if(typeof volverAlPartido==="function") volverAlPartido();
    return;
  }
  const v=$("#vista"); v.innerHTML=""; v.dataset.sec="partido";
  document.body.classList.remove("en-partido","hay-momento");
  const ligaTit=E.eraBase==="2026b"?"Liga de Ascenso · fecha "+part.fecha
    :(E.eraBase==="2026c"?"Segunda División · fecha "+part.fecha
    :(E.anio>=2010?"Liga de Primera · fecha "+part.fecha:"Campeonato Nacional · fecha "+part.fecha));
  const copaTit=part.tipo==="copa"?((part.torneo||"Copa")+" · "+part.ronda):(part.tipo==="amistoso"?"🤝 Amistoso":ligaTit);
  const cab=panel(copaTit, part.tipo==="copa"?"🏆":(part.tipo==="amistoso"?"🤝":"⚽"), part.tipo==="copa"?"agua":"");
  if(part.tipo==="amistoso") cab.cuerpo.appendChild(el("p","mini","Amistoso: no cuenta para la tabla ni gasta la semana. Roda minutos, sube la forma y deja taquilla si eres local."));
  cab.cuerpo.appendChild(el("h2","tit",(part.local?E.clubNombre+" vs "+part.rivalNombre:part.rivalNombre+" vs "+E.clubNombre)));
  cab.cuerpo.appendChild(el("p","mini",(part.local?"De local":"De visita")+" en "+part.sede+" · "+fechaTxt(part.f)+" de "+E.anio+
    (part.apodo?" · "+part.apodo:"")));
  const meta=el("div","fila-meta");
  meta.appendChild(el("span","chip-meta",part.local?"🏠 Local":"✈️ Visita"));
  const ca=chipArbitro(part); if(ca) meta.appendChild(ca);
  cab.cuerpo.appendChild(meta);
  v.appendChild(cab);

  /* 7.36 · jugar YA: CTAs arriba, no enterrados bajo el once */
  const bar=el("div","barra-jugar");
  bar.setAttribute("role","group");
  bar.setAttribute("aria-label","Cómo vives el partido");
  [["📺 Ver en vivo","seguir","Lo ves minuto a minuto. Adentro puedes saltar al resultado."],
   ["🎯 Dirigir","dirigir","Tú mandas: plan en vivo, entretiempo, penales, cambios."]].forEach(([n,m,d])=>{
    const b=el("button","btn-aqua ancho cta-jugar"+(m==="dirigir"?" verde":""),
      n+" · <span class='cta-d'>"+d+"</span>");
    b.onclick=()=>arrancarPartido(part,m);
    bar.appendChild(b);
  });
  v.appendChild(bar);

  /* 6.31 · checklist: qué conviene resolver ANTES de salir a jugar */
  const onceCk=onceIdeal();
  const items=checklistPrevia(part,onceCk);
  const hayPend=items.some(i=>i.warn);
  const pc=panel("Antes de salir a la cancha","✅",hayPend?"alerta":"agua");
  pc.cuerpo.appendChild(el("p","mini",hayPend?"Hay cosas que conviene resolver antes de jugar. No es obligación, pero te puede costar el partido.":"Todo en orden para salir a jugar. Igual revisa los últimos detalles."));
  const ul=el("div","checklist");
  items.forEach(i=>{
    const row=el("div","chk"+(i.warn?" warn":(i.ok?" ok":"")));
    row.innerHTML="<span class='chk-ic'>"+(i.warn?"⚠️":(i.ok?"✅":"•"))+"</span><div><b>"+i.t+"</b>"+(i.d?"<div class='mini'>"+i.d+"</div>":"")+"</div>";
    if(i.accion){ row.style.cursor="pointer"; row.onclick=i.accion; }
    ul.appendChild(row);
  });
  pc.cuerpo.appendChild(ul);
  v.appendChild(pc);

  const rej=el("div","rejilla dos");
  /* --- plan --- */
  const p1=panel("Plan de partido","📋");
  [["form","Formación",Object.keys(FORMACIONES)],["mentalidad","Mentalidad",Object.keys(MENTALIDADES)],
   ["estilo","Estilo",Object.keys(ESTILOS)],["presion","Presión",Object.keys(PRESIONES)],
   ["bloque","Bloque",Object.keys(BLOQUES||{"Medio":1})],["ritmo","Ritmo",Object.keys(RITMOS||{"Normal":1})]]
   .forEach(([k,lab,ops])=>{
    p1.cuerpo.appendChild(el("label","lb",lab));
    const f=el("div","fichas");
    ops.forEach(o=>{
      const b=el("button","ficha",o);
      b.setAttribute("aria-pressed",E.tactica[k]===o?"true":"false");
      const tip=(k==="bloque"&&BLOQUES[o]&&BLOQUES[o].d)||(k==="ritmo"&&RITMOS[o]&&RITMOS[o].d);
      if(tip) b.title=tip;
      b.onclick=()=>{ E.tactica[k]=o; guardar(); pantallaPrevia(part); };
      f.appendChild(b);
    });
    p1.cuerpo.appendChild(f);
  });
  p1.cuerpo.appendChild(el("div","resul mitad","<b>Lectura del plan:</b> "+lecturaPlan()));
  p1.cuerpo.appendChild(el("p","mini","Este plan se siente en el ruedo. En <b>Dirigir</b> lo puedes cambiar en vivo y al descanso."));
  if(typeof fraseCuerpoTecnico==="function"){
    p1.cuerpo.appendChild(el("p","mini","<b>Ayudante:</b> «"+fraseCuerpoTecnico(part)+"»"));
  }
  const once=onceIdeal();
  p1.cuerpo.appendChild(el("h3","sub","Once titular"));
  const t=el("table","tabla-xi");
  t.innerHTML="<thead><tr><th>Jugador</th><th>Pos</th><th class='n'>Niv</th><th class='n'>For</th><th class='n'>Can</th></tr></thead>";
  const tb=el("tbody");
  once.forEach(j=>{
    const can=Math.round(j.cansancio||0);
    const tr=el("tr",can>=18?"cans-alto":(can>=10?"cans-medio":null),
      "<td>"+j.n+(j.real?" ●":"")+"</td><td>"+j.pos+"</td><td class='n'>"+j.nivel+"</td><td class='n'>"+Math.round(j.forma)+"</td>"+celdaCans(j));
    tb.appendChild(tr);
  });
  t.appendChild(tb); p1.cuerpo.appendChild(t);
  const les=E.plantel.filter(j=>j.lesion>0&&!j.vendido);
  if(les.length) p1.cuerpo.appendChild(el("p","mini","No disponibles: "+les.map(j=>j.n).join(", ")));
  /* 7.999 · banca de la lista (no todo el plantel) */
  const bancaPrev=(typeof bancaIdeal==="function")?bancaIdeal(once):[];
  const cupoL=typeof listaMaxEra==="function"?listaMaxEra():18;
  const cupoB=typeof bancaMaxEra==="function"?bancaMaxEra():7;
  p1.cuerpo.appendChild(el("h3","sub","Banca · "+bancaPrev.length+"/"+cupoB+"  <span class='mini'>lista de "+cupoL+"</span>"));
  if(bancaPrev.length){
    const tbanca=el("table","tabla-xi banca");
    tbanca.innerHTML="<thead><tr><th>Suplente</th><th>Pos</th><th class='n'>Niv</th><th class='n'>For</th></tr></thead>";
    const tbb=el("tbody");
    bancaPrev.forEach(j=>{
      tbb.appendChild(el("tr",null,"<td>"+j.n+(j.real?" ●":"")+"</td><td>"+j.pos+"</td><td class='n'>"+j.nivel+"</td><td class='n'>"+Math.round(j.forma)+"</td>"));
    });
    tbanca.appendChild(tbb); p1.cuerpo.appendChild(tbanca);
  }
  const cortPrev=(typeof estrellasCortadas==="function")?estrellasCortadas(once):[];
  const namesLista=once.concat(bancaPrev).map(j=>j.n);
  const fuera=dispPlantel().filter(j=>namesLista.indexOf(j.n)<0);
  if(fuera.length) p1.cuerpo.appendChild(el("p","fuera-lista",(cortPrev.length?"⚠️ ":"")+"Quedan fuera de la lista ("+fuera.length+"): "+fuera.map(j=>j.n+(cortPrev.some(c=>c.n===j.n)?" · se enoja":"")).join(", ")+"."));
  /* 6.7 · designados de balón parado (penal / tiro libre / córner) */
  p1.cuerpo.appendChild(el("h3","sub","Balón parado"));
  [["penalista","🎯 Penales"],["tiroLibre","🎯 Tiros libres"],["corner","🚩 Córners"]].forEach(([k,lab])=>{
    const row=el("div"); row.style.margin="4px 0";
    row.appendChild(el("label","lb",lab));
    const sel=document.createElement("select"); sel.className="entrada"; sel.style.width="100%";
    const auto=document.createElement("option"); auto.value=""; auto.textContent="Automático (el mejor disponible)"; sel.appendChild(auto);
    once.filter(j=>j.pos!=="ARQ").forEach(j=>{ const o=document.createElement("option"); o.value=j.n; o.textContent=j.n+" ("+j.pos+", niv "+j.nivel+")"; if(E.tactica[k]===j.n) o.selected=true; sel.appendChild(o); });
    sel.onchange=()=>{ E.tactica[k]=sel.value||null; guardar(); };
    row.appendChild(sel);
    p1.cuerpo.appendChild(row);
  });
  /* 6.13 · roles/duties por jugador (estilo FM), colapsable, con update local */
  const detRol=el("details"); detRol.className="rival-prev";
  detRol.appendChild(el("summary","","🎭 Roles de los jugadores · Defensivo / Equilibrado / Ofensivo"));
  const balance=el("p","mini");
  const refrescarBalance=()=>{
    const cnt={def:0,eq:0,ofe:0};
    once.filter(j=>j.pos!=="ARQ").forEach(j=>{ cnt[(E.tactica.roles&&E.tactica.roles[j.n])||"eq"]++; });
    balance.innerHTML="<b>Balance:</b> "+cnt.ofe+" ofensivos · "+cnt.eq+" equilibrados · "+cnt.def+" defensivos. "+
      (cnt.ofe>=6?"Muy volcado al ataque: vas a generar, pero quedas abierto atrás.":
       cnt.def>=6?"Muy replegado: seguro atrás, pero te va a costar crear.":"Reparto sano.");
  };
  once.filter(j=>j.pos!=="ARQ").forEach(j=>{
    const row=el("div","rol-row");
    row.appendChild(el("span","rol-n",j.n));
    const bg=el("div","rol-btns");
    [["def","DEF","Defensivo: cuida atrás"],["eq","EQ","Equilibrado"],["ofe","OFE","Ofensivo: pisa el área"]].forEach(([k,lab,ti])=>{
      const cur=(E.tactica.roles&&E.tactica.roles[j.n])||"eq";
      const b=el("button","rol-b"+(cur===k?" on":""),lab); b.title=ti;
      b.onclick=(e)=>{ e.preventDefault(); E.tactica.roles=E.tactica.roles||{}; E.tactica.roles[j.n]=k; guardar();
        [].forEach.call(bg.children,c=>c.classList.remove("on")); b.classList.add("on"); refrescarBalance(); };
      bg.appendChild(b);
    });
    row.appendChild(bg);
    detRol.appendChild(row);
  });
  refrescarBalance();
  detRol.appendChild(balance);
  p1.cuerpo.appendChild(detRol);
  const manualOn=E.tactica.xiManual&&E.tactica.xiManual.length;
  const bali=el("button","btn-aqua ancho"+(manualOn?" verde":""),
    "👥 Alinear el equipo · "+(manualOn?"manual":"automático"));
  bali.onclick=()=>modalAlineacion(part);
  p1.cuerpo.appendChild(bali);
  const blista=el("button","btn-aqua ancho"+(E.tactica.bancaManual&&E.tactica.bancaManual.length?" verde":""),
    "📋 Lista de concentrados · "+cupoL+(E.tactica.bancaManual&&E.tactica.bancaManual.length?" · manual":" · auto"));
  blista.style.marginTop="6px";
  blista.onclick=()=>modalLista(part);
  p1.cuerpo.appendChild(blista);
  const bpiz=el("button","btn-aqua ancho"+(E.tactica.pizarra&&E.tactica.pizarra.length?" verde":""),
    "🎯 Pizarra libre"+(E.tactica.pizarra&&E.tactica.pizarra.length?" · activa":""));
  bpiz.style.marginTop="6px";
  bpiz.onclick=()=>modalPizarra(part);
  p1.cuerpo.appendChild(bpiz);
  rej.appendChild(p1);

  /* --- lectura previa --- */
  const p2=panel("Antes de salir","🔍","agua");
  const fz=fuerzaEquipo(once);
  const lectura=fz.base>part.fuerzaRival+6?"Sobre el papel somos mejores, pero eso no se cobra en la cancha.":
    (fz.base>part.fuerzaRival-4?"Está parejo. Lo va a definir un detalle.":"El rival es superior. Hay que jugar perfecto.");
  p2.cuerpo.appendChild(el("p",null,"<b>"+E.dt+":</b> "+lectura));
  const cl=(typeof CLIMAS!=="undefined"&&CLIMAS[part.clima])||null;
  if(typeof widgetClima==="function") p2.cuerpo.appendChild(widgetClima(part));
  else if(cl) p2.cuerpo.appendChild(el("p","mini",cl.ic+" Clima: "+cl.n+". "+cl.d));
  if(typeof widgetCanal==="function") p2.cuerpo.appendChild(widgetCanal(part));
  if(part.local) p2.cuerpo.appendChild(el("p","mini","Se espera buena taquilla: la gente está "+(E.ind.hinchada>65?"encendida":"tibia")+"."));
  if(part.local){
    const tq=ingresoPartidoLocal(part);
    p2.cuerpo.appendChild(fila("Taquilla proyectada",tq.gente.toLocaleString("es-CL")+" personas · "+plata(tq.ingreso)));
    p2.cuerpo.appendChild(el("p","mini","Ajustas el precio de cada sector en Finanzas."));
  }
  p2.cuerpo.appendChild(el("h3","sub","Antes de salir"));
  if((part.ronda==="FINAL"||part.ronda==="Semifinal")&&typeof modalCharlaCapitan==="function"){
    const bc=el("button","btn-aqua ancho","🧑‍✈️ Charla con el capitán antes de salir");
    bc.onclick=modalCharlaCapitan;
    p2.cuerpo.appendChild(bc);
  }
  const confHecha=E.flags["conf_"+E.idx];
  const bconf=el("button","btn-aqua ancho"+(confHecha?" gris":""),confHecha?"🎤 Ya diste la conferencia":"🎤 Conferencia de prensa");
  bconf.disabled=confHecha; bconf.onclick=()=>modalConferencia(part);
  p2.cuerpo.appendChild(bconf);
  p2.cuerpo.appendChild(el("p","mini hint-teclado","Arriba eliges cómo vivir el partido. Adentro: barra espaciadora pausa · «⏩ Al resultado» lo termina al toque · Dirigir usa teclas 1 / 2 / 3."));
  rej.appendChild(p2);
  v.appendChild(rej);
  window.scrollTo({top:0});
}
/* ---------- pizarra libre (posicionar los 11 en la cancha) ---------- */
function apodoJug(n){ const p=(n||"").split(" "); return (p[p.length-1]||n).slice(0,9); }
function mismaGente(piz,once){ if(!piz||piz.length!==once.length) return false; const set=new Set(once.map(j=>j.n)); return piz.every(p=>set.has(p.n)); }
/* 6.8 · editor de alineación: arma tu XI a mano (mete suplentes, saca titulares) */
function modalAlineacion(part){
  const disp=E.plantel.filter(j=>!j.vendido&&!j.cedido&&(j.lesion||0)<=0)
    .sort((a,b)=>scoreOnce(b)-scoreOnce(a));
  let sel=(E.tactica.xiManual&&E.tactica.xiManual.length)
    ? E.tactica.xiManual.filter(n=>disp.find(j=>j.n===n))
    : onceIdeal().map(j=>j.n);
  const POS=[["ARQ","Arqueros"],["DEF","Defensas"],["VOL","Volantes"],["DEL","Delanteros"]];
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">👥</span><span>Alinear el equipo</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      const arqs=sel.filter(n=>{const j=disp.find(x=>x.n===n);return j&&j.pos==="ARQ";}).length;
      const ok=(sel.length===11&&arqs>=1);
      const info=el("div","resul "+(ok?"bien":"mitad"));
      info.innerHTML="<b>"+sel.length+" / 11</b> titulares"+
        (arqs<1?" · <b style='color:#c0392b'>falta un arquero</b>":"")+
        (sel.length>11?" · saca "+(sel.length-11):"")+
        (sel.length<11?" · elige "+(11-sel.length)+" más":"");
      c.appendChild(info);
      c.appendChild(el("p","mini","Toca un jugador para meterlo o sacarlo del once. Los que no elijas quedan para la lista de concentrados (la banca). 🩹 = lesionado (no disponible)."));
      POS.forEach(([p,lab])=>{
        const grupo=disp.filter(j=>j.pos===p);
        if(!grupo.length) return;
        const enPos=grupo.filter(j=>sel.indexOf(j.n)>=0).length;
        c.appendChild(el("h3","sub",lab+" · <span class='mini'>"+enPos+" en el XI</span>"));
        const cont=el("div","align-grid");
        grupo.forEach(j=>{
          const on=sel.indexOf(j.n)>=0;
          const b=el("button","align-jug"+(on?" on":""));
          b.innerHTML="<b>"+(on?"✓ ":"")+j.n+(j.real?" ●":"")+"</b><span class='mini'>niv "+j.nivel+" · forma "+Math.round(j.forma)+(j.rasgos&&j.rasgos.length?" · "+j.rasgos[0]:"")+"</span>";
          b.onclick=()=>{ const i=sel.indexOf(j.n); if(i>=0) sel.splice(i,1); else { if(sel.length>=11){ aviso("Ya tienes 11. Saca a alguien primero."); return; } sel.push(j.n); } pintar(); };
          cont.appendChild(b);
        });
        c.appendChild(cont);
      });
      const g=el("button","btn-aqua ancho verde","Guardar mi alineación"); g.disabled=!ok;
      g.onclick=()=>{ E.tactica.xiManual=sel.slice();
        if(Array.isArray(E.tactica.bancaManual)) E.tactica.bancaManual=E.tactica.bancaManual.filter(n=>sel.indexOf(n)<0);
        guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Alineación guardada"); };
      c.appendChild(g);
      const a=el("button","btn-aqua ancho gris","Volver a automático (el juego elige)"); a.style.marginTop="6px";
      a.onclick=()=>{ E.tactica.xiManual=null; guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Alineación automática"); };
      c.appendChild(a);
    };
    pintar();
  },{cerrarFuera:false});
}
/* 7.999 · lista de concentrados: 11 del XI + N suplentes. El resto ni se viste. */
function modalLista(part){
  const once=onceIdeal();
  const onceN=once.map(j=>j.n);
  const disp=dispPlantel().filter(j=>onceN.indexOf(j.n)<0)
    .sort((a,b)=>scoreOnce(b)-scoreOnce(a));
  const cupo=typeof bancaMaxEra==="function"?bancaMaxEra():7;
  const listaN=typeof listaMaxEra==="function"?listaMaxEra():18;
  let sel=(E.tactica.bancaManual&&E.tactica.bancaManual.length)
    ? E.tactica.bancaManual.filter(n=>disp.find(j=>j.n===n))
    : bancaIdeal(once).map(j=>j.n);
  const POS=[["ARQ","Arqueros"],["DEF","Defensas"],["VOL","Volantes"],["DEL","Delanteros"]];
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">📋</span><span>Lista de concentrados · '+listaN+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      const arqsB=sel.filter(n=>{const j=disp.find(x=>x.n===n);return j&&j.pos==="ARQ";}).length;
      const ok=sel.length===cupo;
      const info=el("div","resul "+(ok&&arqsB>=1?"bien":"mitad"));
      info.innerHTML="<b>"+sel.length+" / "+cupo+"</b> suplentes · lista "+(11+sel.length)+"/"+listaN+
        (arqsB<1?" · <b style='color:#c0392b'>falta un arquero en la banca</b>":"")+
        (sel.length>cupo?" · saca "+(sel.length-cupo):"")+
        (sel.length<cupo?" · elige "+(cupo-sel.length)+" más":"");
      c.appendChild(info);
      c.appendChild(el("p","mini","El once ya está. Acá armas la banca. El que no entra a la lista <b>ni se viste</b> y, si es figura, se enoja. "+
        (E.anio>=2020?"Desde 2020 la nómina es de 23 (11+12).":(E.anio>=1995?"En esta época la nómina es de 18 (11+7).":"Hasta 1994 la nómina es de 16 (11+5)."))));
      c.appendChild(el("p","mini","Titulares (fijos): "+once.map(j=>j.n.split(" ").pop()).join(", ")+"."));
      POS.forEach(([p,lab])=>{
        const grupo=disp.filter(j=>j.pos===p);
        if(!grupo.length) return;
        const enPos=grupo.filter(j=>sel.indexOf(j.n)>=0).length;
        c.appendChild(el("h3","sub",lab+" · <span class='mini'>"+enPos+" en la banca</span>"));
        const cont=el("div","align-grid");
        grupo.forEach(j=>{
          const on=sel.indexOf(j.n)>=0;
          const b=el("button","align-jug"+(on?" on":" fuera"));
          b.innerHTML="<b>"+(on?"✓ ":"")+j.n+(j.real?" ●":"")+"</b><span class='mini'>niv "+j.nivel+" · forma "+Math.round(j.forma)+((j.nivel>=74||(j.rasgos&&j.rasgos.indexOf("ídolo")>=0))?" · figura":"")+"</span>";
          b.onclick=()=>{ const i=sel.indexOf(j.n); if(i>=0) sel.splice(i,1); else { if(sel.length>=cupo){ aviso("La banca ya está llena ("+cupo+"). Saca a alguien primero."); return; } sel.push(j.n); } pintar(); };
          cont.appendChild(b);
        });
        c.appendChild(cont);
      });
      const g=el("button","btn-aqua ancho verde","Guardar la lista"); g.disabled=sel.length!==cupo;
      g.onclick=()=>{ E.tactica.bancaManual=sel.slice(); guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Lista de "+listaN+" guardada"); };
      c.appendChild(g);
      const a=el("button","btn-aqua ancho gris","Volver a automática (los siguientes mejores)"); a.style.marginTop="6px";
      a.onclick=()=>{ E.tactica.bancaManual=null; guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Lista automática"); };
      c.appendChild(a);
    };
    pintar();
  },{cerrarFuera:false});
}
/* 6.30 · dibuja las líneas de química sobre la pizarra (verde=congenia, rojo=roce) */
function dibujarLazos(grid,qui){
  const NS="http://www.w3.org/2000/svg";
  const viejo=grid.querySelector(".lazos-svg"); if(viejo) viejo.remove();
  requestAnimationFrame(()=>{
    const gr=grid.getBoundingClientRect();
    const svg=document.createElementNS(NS,"svg"); svg.setAttribute("class","lazos-svg");
    svg.style.cssText="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1";
    qui.lazos.forEach(l=>{
      if(!l.bueno && !l.malo) return;
      const ca=grid.querySelector('.chip[data-nombre="'+l.a.replace(/"/g,'')+'"]');
      const cb=grid.querySelector('.chip[data-nombre="'+l.b.replace(/"/g,'')+'"]');
      if(!ca||!cb) return;
      const ra=ca.getBoundingClientRect(), rb=cb.getBoundingClientRect();
      const ln=document.createElementNS(NS,"line");
      ln.setAttribute("x1",ra.left+ra.width/2-gr.left); ln.setAttribute("y1",ra.top+ra.height/2-gr.top);
      ln.setAttribute("x2",rb.left+rb.width/2-gr.left); ln.setAttribute("y2",rb.top+rb.height/2-gr.top);
      ln.setAttribute("stroke", l.bueno?"rgba(50,200,90,.75)":"rgba(220,70,60,.7)");
      ln.setAttribute("stroke-width", l.bueno?"3":"2");
      ln.setAttribute("stroke-linecap","round");
      if(l.malo) ln.setAttribute("stroke-dasharray","4 5");
      svg.appendChild(ln);
    });
    grid.style.position="relative";
    grid.insertBefore(svg, grid.firstChild);
  });
}
function modalPizarra(part){
  const once=onceIdeal();
  if(!E.tactica.pizarra || !mismaGente(E.tactica.pizarra,once)) E.tactica.pizarra=pizarraDesdeFormacion(once);
  modal(box=>{
    let drag=null;
    const celdaBajo=(x,y)=>{ const e=document.elementFromPoint(x,y); return e?e.closest(".celda"):null; };
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🎯</span><span>Pizarra táctica</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini","🖐️ Arrastrá a los jugadores por la cancha para acomodarlos. Se permiten esquemas asimétricos o bizarros. ⬆ arriba es el arco rival."));
      const grid=el("div","pizarra");
      for(let rr=PIZ_FILAS-1; rr>=0; rr--){
        for(let cc=0; cc<PIZ_COLS; cc++){
          const cell=el("div","celda"+(rr===0?" propia":(rr>=3?" ataque":"")));
          cell.dataset.r=rr; cell.dataset.c=cc;
          const ocup=E.tactica.pizarra.find(p=>p.r===rr&&p.c===cc);
          if(ocup){
            const chip=el("div","chip"+(ocup.pos==="ARQ"?" arq":"")+" arrastrable");
            chip.textContent=apodoJug(ocup.n);
            chip.dataset.nombre=ocup.n;   /* 6.30 · para dibujar los lazos de química */
            chip.style.touchAction="none";
            chip.addEventListener("pointerdown",ev=>{ ev.preventDefault();
              drag={entry:ocup,moved:false,sx:ev.clientX,sy:ev.clientY,ghost:null};
              try{ chip.setPointerCapture(ev.pointerId); }catch(_){}
            });
            chip.addEventListener("pointermove",ev=>{ if(!drag||drag.entry!==ocup) return;
              if(!drag.moved && Math.hypot(ev.clientX-drag.sx,ev.clientY-drag.sy)>5){ drag.moved=true;
                chip.classList.add("dragging");
                drag.ghost=document.createElement("div"); drag.ghost.className="chip-ghost"; drag.ghost.textContent=chip.textContent;
                document.body.appendChild(drag.ghost);
              }
              if(drag.moved){ drag.ghost.style.left=ev.clientX+"px"; drag.ghost.style.top=ev.clientY+"px";
                [].forEach.call(document.querySelectorAll(".celda.hover"),x=>x.classList.remove("hover"));
                const cl=celdaBajo(ev.clientX,ev.clientY); if(cl) cl.classList.add("hover");
              }
            });
            const soltar=ev=>{ if(!drag||drag.entry!==ocup) return;
              const wasMoved=drag.moved, ghost=drag.ghost;
              if(wasMoved){ const cl=celdaBajo(ev.clientX,ev.clientY);
                if(cl){ const rr2=+cl.dataset.r, cc2=+cl.dataset.c;
                  const otro=E.tactica.pizarra.find(p=>p.r===rr2&&p.c===cc2&&p!==ocup);
                  if(otro){ otro.r=ocup.r; otro.c=ocup.c; }   /* swap */
                  ocup.r=rr2; ocup.c=cc2; } }
              if(ghost) ghost.remove(); drag=null;
              if(wasMoved) pintar();
            };
            chip.addEventListener("pointerup",soltar);
            chip.addEventListener("pointercancel",soltar);
            cell.appendChild(chip);
          }
          grid.appendChild(cell);
        }
      }
      c.appendChild(grid);
      const forma=formaLibre(E.tactica.pizarra)||{ataque:0,orden:0,ancho:0};
      const detec=(typeof formacionDetectada==="function")?formacionDetectada(E.tactica.pizarra):null;
      c.appendChild(el("div","resul bien","Formación detectada: <b style='font-size:16px'>"+(detec||"—")+"</b>"+
        (detec&&["4-4-2","4-3-3","4-5-1","5-3-2","5-4-1","3-5-2","3-4-3","4-2-4"].indexOf(detec)<0?" <span class='mini'>(esquema no clásico: el equipo lo sentirá raro los primeros minutos)</span>":"")));
      c.appendChild(el("div","resul mitad","Efecto táctico — ataque <b>"+signo(Math.round(forma.ataque))+
        "</b> · orden <b>"+signo(Math.round(forma.orden))+"</b> · ancho <b>"+signo(Math.round(forma.ancho))+"</b>"));
      /* 6.30 · química del equipo: lazos dibujados + lectura */
      if(typeof quimicaEquipo==="function"){
        const qui=quimicaEquipo(once);
        const col=qui.prom>=64?"#3ac04f":(qui.prom>=48?"#d68a1f":"#c0392b");
        const buenos=qui.lazos.filter(l=>l.bueno).sort((a,b)=>b.q-a.q).slice(0,2);
        const malos=qui.lazos.filter(l=>l.malo).sort((a,b)=>a.q-b.q).slice(0,1);
        const qbox=el("div","resul mitad");
        qbox.innerHTML="Química del equipo — <b style='color:"+col+"'>"+qui.prom+"</b>/100 · nivel al partido <b>"+(qui.bono>=0?"+":"")+qui.bono.toFixed(1)+"</b>"+
          barrita(qui.prom,col)+
          "<div class='mini'>"+(qui.buenos||0)+" duplas conectadas que congenian · "+(qui.malos||0)+" con roce (de "+(qui.total||0)+" lazos)</div>"+
          (buenos.length?"<div class='mini'>💚 Se llevan bien: "+buenos.map(l=>apodoJug(l.a)+" & "+apodoJug(l.b)).join(", ")+"</div>":"")+
          (malos.length?"<div class='mini'>💢 Hay roce: "+malos.map(l=>apodoJug(l.a)+" & "+apodoJug(l.b)).join(", ")+"</div>":"")+
          "<div class='mini'>Líneas verdes = congenian; rojas punteadas = roce. <b>Sube la química</b> juntando (vecinos en la pizarra) a jugadores de <b>edad parecida</b>, con <b>rasgos en común</b>, dos <b>ídolos de la casa</b>, o que <b>ya jugaron juntos</b>.</div>";
        c.appendChild(qbox);
        dibujarLazos(grid,qui);
      }
      const g=el("button","btn-aqua ancho verde","Guardar pizarra");
      g.onclick=()=>{ guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Pizarra guardada"); };
      c.appendChild(g);
      const q=el("button","btn-aqua ancho gris","Volver a la formación clásica"); q.style.marginTop="6px";
      q.onclick=()=>{ E.tactica.pizarra=null; guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Formación clásica activada"); };
      c.appendChild(q);
    };
    pintar();
  });
}
/* Conferencia de prensa PRE-partido (Bloque 4): 3 respuestas que mueven prensa,
   credibilidad y moral, con contexto de favorito/underdog. Una por partido. */
/* 6.9 · conferencia de prensa VIVA: periodista con nombre + pregunta reactiva
   a lo que pasó (derrota, racha, promesa de la memoria, clásico, objetivo). */
/* mezcla de prensa deportiva chilena real (figuras públicas del rubro, que solo
   PREGUNTAN — el que declara es tu DT) con algunos nombres de relleno del juego. */
const PERIODISTAS=[
 {n:"Juan Cristóbal Guarello",m:"Radio ADN"},{n:"Danilo Díaz",m:"Radio Cooperativa"},
 {n:"Manuel de Tezanos",m:"Radio Agricultura"},{n:"Cristián Caamaño",m:"Redgol"},
 {n:"Rodrigo Herrera",m:"Chilevisión Deportes"},{n:"Fernando Solabarrieta",m:"TNT Sports"},
 {n:"Patricio Yáñez",m:"La Magia Azul"},{n:"Claudio Palma",m:"cabina de relato"},
 {n:"Tironi",m:"Deporte Total"},{n:"la Kari Fuentes",m:"Radio Gol"},
 {n:"el Chico Sotomayor",m:"El Balonazo"},{n:"Marcela Ríos",m:"Crónica FC"}
];
/* Periodistas de la época clásica (fútbol chileno ~1985-1995). Nombres reales, medios reales;
   lo que dicen en el juego es ficción. Grok amplía esta lista con más relatores/comentaristas de la era. */
const PERIODISTAS_CLASICOS=[
 {n:"Julio Martínez",m:"prensa deportiva"},{n:"Sergio Livingstone",m:"comentarios, Canal 13"},
 {n:"Vladimiro Mimica",m:"relato radial"},{n:"Pedro Carcuro",m:"TVN"},
 {n:"Alberto Fouillioux",m:"comentarista"}
];
/* pool de prensa según el año jugado: usa los periodistas REALES de la época (data-periodistas.js);
   si no está cargado, cae al seed clásico (pre-2008) o al pool moderno. */
function periodistasEra(){
  if(typeof bucketPeriodistas==="function" && typeof E!=="undefined" && E && E.anio){
    const b=bucketPeriodistas(E.anio); if(b&&b.length) return b;
  }
  return (typeof E!=="undefined"&&E&&E.anio<2008&&PERIODISTAS_CLASICOS.length)?PERIODISTAS_CLASICOS:PERIODISTAS;
}
/* elige un periodista evitando los últimos usados (que no salga siempre el mismo) */
let _ultPeris=[];
function fichaPeriodista(per, pregunta){
  const f=typeof fotoPeriodista==="function"?fotoPeriodista(per&&per.n):null;
  const cara=f?'<img class="foto-peri" src="'+f.src+'" alt="" width="48" height="48" onerror="this.style.display=\'none\'">':'';
  return cara+'<div><b>'+(per&&per.n||"")+'</b> <span class="mini">· '+(per&&per.m||"")+'</span><br>'+pregunta+'</div>';
}
function eligePeri(){
  const pool=periodistasEra();
  const libres=pool.filter(p=>_ultPeris.indexOf(p.n)<0);
  const p=elige(libres.length?libres:pool);
  _ultPeris.push(p.n); if(_ultPeris.length>Math.min(4,pool.length-1)) _ultPeris.shift();
  return p;
}
const CONF_ARQ={
 calma:{grupos:{prensa:6,camarin:4},rep:{credibilidad:4},ef:{moral:3},txt:"Bajaste el perfil. La prensa y el camarín lo valoran."},
 mea :{grupos:{prensa:8,camarin:-2},rep:{credibilidad:6},ef:{moral:1},txt:"La autocrítica te subió crédito, aunque el grupo quedó algo tocado."},
 confianza:{grupos:{hinchada:7,prensa:2},rep:{publica:3},ef:{moral:2},txt:"Saliste confiado. La hinchada se ilusiona."},
 palo:{grupos:{hinchada:8,anfp:-6,prensa:-6},rep:{dureza:6,credibilidad:-2},ef:{},txt:"Calentaste la previa: la gente lo festeja, la asociación y la prensa no."}
};
function _nomRivLimpio(p){
  const n=(p&&p.rivalNombre)||"el rival";
  return (typeof textoLimpio==="function")?textoLimpio(n,80):String(n);
}
function preguntasDeLiga(part){
  const riv=_nomRivLimpio(part);
  const pais=(typeof paisDeEra==="function")?paisDeEra(typeof E!=="undefined"&&E?E.eraBase:null):"chile";
  const custom=typeof E!=="undefined"&&E&&E.eraBase&&typeof esEraHardcode==="function"&&!esEraHardcode(E.eraBase);
  const copa=(typeof nombreCopaDomestica==="function" && custom)
    ? nombreCopaDomestica(E.eraBase)
    : ((typeof fedCopa==="function")?fedCopa():(pais==="argentina"?"Copa Argentina":"Copa Chile"));
  const fed=(typeof fedSigla==="function")?fedSigla():(pais==="argentina"?"AFA":"ANFP");
  const L=[];
  if(custom){
    L.push({q:"¿La "+copa+" entra en los planes o prioriza el campeonato?",ops:[
       {t:"El campeonato es la prioridad",k:"calma"},{t:"Vamos por las dos competencias",k:"confianza"},{t:"La copa también se pelea, punto",k:"palo"}]});
    L.push({q:"En esta liga el relato todavía se está armando. ¿Qué identidad quiere marcar ante "+riv+"?",ops:[
       {t:"Trabajo silencioso, que hablen los puntos",k:"calma"},{t:"Una idea propia, que se note",k:"confianza"},{t:"Que se enteren quién manda",k:"palo"}]});
    L.push({q:"El calendario de una liga que no es la de siempre. ¿Cómo lo toma el grupo?",ops:[
       {t:"Partido a partido, sin inventar",k:"calma"},{t:"Ilusión: es una página nueva",k:"confianza"},{t:"Que se adapten ellos a nosotros",k:"palo"}]});
  } else if(pais==="argentina"){
    L.push({q:"¿La "+copa+" entra en los planes o prioriza el campeonato?",ops:[
       {t:"El torneo local es la prioridad",k:"calma"},{t:"Vamos por las dos competencias",k:"confianza"},{t:"La copa también se pelea, punto",k:"palo"}]});
    L.push({q:"La "+fed+" mira de reojo el fixture. ¿El plantel llega a pelear las dos competencias?",ops:[
       {t:"Rotar con cabeza, no romper el equipo",k:"calma"},{t:"El grupo está para las dos",k:"confianza"},{t:"Que armen mejor el calendario",k:"palo"}]});
    L.push({q:"En el fútbol argentino el resultado manda. ¿Sale a buscar los tres puntos ante "+riv+" sí o sí?",ops:[
       {t:"Primero no perder, después ver",k:"calma"},{t:"A buscar el partido de entrada",k:"confianza"},{t:"Tres puntos o nada",k:"palo"}]});
  } else {
    L.push({q:"¿La "+copa+" entra en los planes o prioriza el campeonato?",ops:[
       {t:"El Nacional es la prioridad",k:"calma"},{t:"Vamos por las dos competencias",k:"confianza"},{t:"La copa también se pelea, punto",k:"palo"}]});
    L.push({q:"La "+fed+" y el fixture. ¿Le cierra el calendario o es demasiado?",ops:[
       {t:"Se trabaja con lo que hay",k:"calma"},{t:"El grupo está para aguantar",k:"confianza"},{t:"Que armen mejor las fechas",k:"palo"}]});
  }
  return L;
}
function preguntasConferencia(part){
  const riv=_nomRivLimpio(part);
  const fz=fuerzaEquipo(onceIdeal());
  const favorito=fz.base>part.fuerzaRival+6;
  const sinGanar=(E.temporada&&E.temporada.sinGanar)||0;
  const ult=(E.idx>0)?E.calendario[E.idx-1]:null, ultJugado=ult&&ult.jugado;
  const perdioUlt=ultJugado&&((ult.gf||0)<(ult.gc||0));
  const ganoUlt=ultJugado&&((ult.gf||0)>(ult.gc||0));
  const prom=(typeof promesaPendiente==="function")?promesaPendiente():null;
  const clasico=(typeof esClasico==="function")&&esClasico(part);
  const dep=(E.objetivos||[]).find(o=>o.tipo==="pos");
  const bajoObj=dep&&(typeof posicionEnTabla==="function")&&E.temporada.pj>4&&posicionEnTabla()>dep.meta+2;
  const L=preguntasDeLiga(part);
  if(perdioUlt) L.push({q:"Después de la caída ante "+_nomRivLimpio(ult)+", ¿sigue creyendo en el proceso o hay para preocuparse?",ops:[
     {t:"Bancar el proceso, la mano no tiembla",k:"calma"},{t:"Autocrítica: me hago cargo yo",k:"mea"},{t:"Palo: el que dude que se baje",k:"palo"}]});
  if(sinGanar>=3) L.push({q:"Son "+sinGanar+" fechas sin ganar. ¿Siente que su puesto está en discusión?",ops:[
     {t:"Poner el pecho, me hago cargo",k:"calma"},{t:"Pedir tiempo y respaldo",k:"confianza"},{t:"Calentar: acá el que trabaja soy yo",k:"palo"}]});
  if(prom) L.push({q:"Se comenta que le prometió un arreglo a "+prom.quien+". ¿Verdad o versión?",ops:[
     {t:"Confirmar y apoyar al jugador",k:"confianza"},{t:"«De los temas internos no hablo»",k:"calma"},{t:"Negar todo de plano",k:"palo"}]});
  if(clasico) L.push({q:"Se viene el clásico ante "+riv+". ¿Qué mensaje le deja a la gente?",ops:[
     {t:"Paños fríos, foco en el fútbol",k:"calma"},{t:"Encender a la hinchada",k:"confianza"},{t:"Tirarle un palo al rival",k:"palo"}]});
  if(favorito) L.push({q:"Son favoritos claros ante "+riv+". ¿No los relaja la vara alta?",ops:[
     {t:"Humildad y respeto al rival",k:"calma"},{t:"Confianza total, vamos por todo",k:"confianza"},{t:"«Favorito se es en la cancha»",k:"palo"}]});
  if(bajoObj) L.push({q:"Están lejos del objetivo del año. ¿Le preocupa su continuidad?",ops:[
     {t:"Asumir la responsabilidad de frente",k:"mea"},{t:"Pedir que se banque el proyecto",k:"confianza"},{t:"Palo a la dirigencia por los refuerzos",k:"palo"}]});
  if(ganoUlt&&sinGanar===0) L.push({q:"Vienen encendidos tras ganarle a "+_nomRivLimpio(ult)+". ¿Hasta dónde sueñan?",ops:[
     {t:"Pies en la tierra, paso a paso",k:"calma"},{t:"Ilusionar a la gente",k:"confianza"},{t:"«El que quiera soñar, que sueñe»",k:"palo"}]});
  /* evergreen: siempre disponibles, para que la conferencia sea más larga y variada */
  L.push({q:"¿Cómo llega el equipo físicamente para este partido?",ops:[
     {t:"Bien, trabajamos fuerte la semana",k:"calma"},{t:"Enteros y con confianza",k:"confianza"},{t:"Mejor que el rival, seguro",k:"palo"}]});
  L.push({q:"¿Le preocupa algo puntual de "+riv+"?",ops:[
     {t:"Respeto total, hay que estar finos",k:"calma"},{t:"Nos preocupamos de lo nuestro",k:"confianza"},{t:"Que se preocupen ellos de nosotros",k:"palo"}]});
  L.push({q:"Un mensaje para la gente que va a ir a la cancha.",ops:[
     {t:"Que nos banque, lo vamos a dejar todo",k:"confianza"},{t:"Humildad y a alentar los 90",k:"calma"},{t:"Que vayan a ver una goleada",k:"palo"}]});
  L.push({q:"Previa ante "+riv+". ¿Con qué se queda de cara al partido?",ops:[
     {t:"Bajar el perfil y pedir humildad",k:"calma"},{t:"Salir con confianza total",k:"confianza"},{t:"Un palo al rival y a los árbitros",k:"palo"}]});
  if(typeof estrellasCortadas==="function"){
    const cort=estrellasCortadas(onceIdeal());
    if(cort.length) L.unshift({q:cort[0].n+" se queda fuera de la lista. ¿Se lo explicó o se va a enterar por el diario?",ops:[
      {t:"Se lo dije en la cara, es una decisión táctica",k:"calma"},{t:"Confío en los que están. Punto",k:"confianza"},{t:"El que no rinde, mira de afuera",k:"palo"}]});
  }
  return L;
}
/* elige N preguntas distintas, priorizando las contextuales y sin repetir las de la última vez */
function elegirPreguntasConf(L,n){
  if(!E.flags.confVistas) E.flags.confVistas=[];
  const vistas=E.flags.confVistas;
  const contextuales=L.slice(0,-1), generica=L[L.length-1];
  let pool=contextuales.filter(q=>vistas.indexOf(q.q)<0);
  if(pool.length<n) pool=pool.concat(contextuales.filter(q=>pool.indexOf(q)<0));
  pool=mezcla(pool.slice());
  const elegidas=pool.slice(0,n);
  if(elegidas.length<n) elegidas.push(generica);   /* completa con la genérica */
  elegidas.forEach(q=>{ vistas.push(q.q); }); if(vistas.length>10) vistas.splice(0,vistas.length-10);
  return elegidas;
}
function modalConferencia(part){
  const L=preguntasConferencia(part);
  const preguntas=elegirPreguntasConf(L,2);          /* 6.33 · conferencia más larga: 2 preguntas */
  const peris=mezcla(periodistasEra().slice()).slice(0,preguntas.length);   /* distintos periodistas */
  let idx=0; const dichos=[];
  modal(box=>{
    const finalizar=()=>{
      E.flags["conf_"+E.idx]=true;
      notificar({t:"Conferencia de prensa dada",tipo:"neutro",bandeja:false,
        d:"Respondiste "+preguntas.length+" preguntas: «"+dichos.join("» · «")+"». El clima de prensa quedó "+
          ((typeof climaPrensa==="function"?climaPrensa().etq:"movido"))+" para el partido."});
      guardar(); cerrarModal(); pantallaPrevia(part); aviso("Conferencia terminada");
    };
    const avanzar=()=>{ idx++; if(idx<preguntas.length) pintar(); else finalizar(); };
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🎤</span><span>Conferencia de prensa · '+(idx+1)+" de "+preguntas.length+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      const cl=(typeof climaPrensa==="function")?climaPrensa():{pct:50,etq:"neutral",col:"#e6c34a"};
      const bar=el("div","mini"); bar.style.margin="0 0 6px";
      bar.innerHTML="Clima de prensa para este partido: <b>"+cl.etq+"</b> <span class='mini'>(influye en cómo sales a la cancha)</span>"+
        "<div class='barrita' style='margin-top:3px'><i style='width:"+cl.pct+"%;--c:"+cl.col+"'></i></div>";
      c.appendChild(bar);
      const per=peris[idx]||eligePeri(), q=preguntas[idx];
      c.appendChild(el("div","resul mitad peri-row", fichaPeriodista(per, q.q)));
      const ops=el("div","ops");
      q.ops.forEach(o=>{
        const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div>';
        b.onclick=()=>{
          const a=CONF_ARQ[o.k]||CONF_ARQ.calma;
          if(a.grupos) aplicarGrupos(a.grupos); if(a.rep) aplicarRep(a.rep); if(a.ef) aplicarEfectos(a.ef);
          if(typeof postProc==="function") postProc("@"+per.m.replace(/\s/g,""),"prensa","«"+o.t+"», dijo el DT en conferencia ante "+part.rivalNombre+".","neutro");
          dichos.push(o.t);
          avanzar();
        };
        ops.appendChild(b);
      });
      c.appendChild(ops);
      /* responder con TUS palabras: se interpreta local (sentimiento), sin gastar plata ni buscar palabra guardada */
      if(typeof analizarOffline==="function"){
        const wrap=el("div"); wrap.style.marginTop="8px";
        const ta=document.createElement("textarea"); ta.placeholder="…o contesta con tus propias palabras"; ta.maxLength=160;
        ta.style.cssText="display:block;width:100%;box-sizing:border-box;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,.15);min-height:44px;font-family:inherit;font-size:14px";
        const bl=el("button","btn-aqua chico verde","✍️ Contestar con lo mío");
        bl.onclick=()=>{
          const txt=(ta.value||"").trim(); if(!txt){ ta.focus(); return; }
          const an=analizarOffline(txt); const s=an.sentimiento||0;
          aplicarGrupos({hinchada:Math.round(s/8), prensa:Math.round(s/13)});
          if(Math.abs(s)>=6) aplicarEfectos({moral:Math.round(s/14)});
          if(typeof postProc==="function") postProc("@"+per.m.replace(/\s/g,""),"prensa","El DT respondió: «"+txt.slice(0,90)+"»", s>10?"bueno":(s<-10?"malo":"neutro"));
          dichos.push('"'+txt.slice(0,32)+(txt.length>32?"…":"")+'"');
          if(an.consecuencia) aviso(an.consecuencia);
          avanzar();
        };
        wrap.appendChild(ta); wrap.appendChild(bl);
        c.appendChild(wrap);
      }
      const x=el("button","btn-aqua ancho gris",idx===0?"No hablar con la prensa":"Cortar acá la conferencia"); x.style.marginTop="6px";
      x.onclick=()=>{ if(idx===0) aplicarGrupos({prensa:-4}); E.flags["conf_"+E.idx]=true; guardar(); cerrarModal(); pantallaPrevia(part); aviso(idx===0?"Te fuiste sin hablar":"Cortaste la conferencia"); };
      c.appendChild(x);
    };
    pintar();
  });
}
function arrancarPartido(part,modo){
  P_ACTUAL=iniciarPartido(part,modo);
  PAUSADO=false; MOMENTO_OPS=[];
  if(P_ACTUAL){ P_ACTUAL._holdUI=null; P_ACTUAL._holdKind=null; P_ACTUAL._holdEv=null; }
  if(typeof quitarHoldBar==="function") quitarHoldBar();
  if(modo==="simular"){ correrHasta(P_ACTUAL,90); pintarPartido(); cerrarPartido(); return; }
  pintarPartido(); correrEnVivo();
}
/* 7.9007 · el partido NO se borra si tocás otra sección: se pausa y vuelve con las decisiones. */
function partidoEnCurso(){
  return !!(typeof P_ACTUAL!=="undefined" && P_ACTUAL && !P_ACTUAL.terminado && !P_ACTUAL.cerrado);
}
function pintarHoldBar(){
  let bar=document.getElementById("partidoHold");
  if(!bar){
    bar=document.createElement("div");
    bar.id="partidoHold";
    bar.setAttribute("role","status");
    bar.setAttribute("aria-live","polite");
    const vista=document.getElementById("vista");
    if(vista&&vista.parentNode) vista.parentNode.insertBefore(bar, vista);
    else document.body.appendChild(bar);
  }
  if(!partidoEnCurso() || !P_ACTUAL._holdUI){
    bar.classList.add("oculto"); bar.setAttribute("hidden",""); bar.innerHTML="";
    return;
  }
  const P=P_ACTUAL;
  const riv=(P.part&&P.part.rivalNombre)||"";
  const Tfn=typeof T==="function"?T:function(k,d){ return d; };
  const esc=(typeof escHtml==="function")?escHtml:function(s){ return String(s==null?"":s); };
  bar.classList.remove("oculto"); bar.removeAttribute("hidden");
  bar.innerHTML='<div class="hold-copy"><div class="hold-t">'+esc(Tfn("hold_tit","Partido en pausa"))+' · '+esc(String(P.min||0))+"' vs "+esc(riv)
    +'</div><div class="hold-d">'+esc(Tfn("hold_txt","Las decisiones siguen ahí. Vuelve al partido cuando quieras."))+'</div></div>';
  const b=document.createElement("button");
  b.type="button"; b.className="btn-aqua verde hold-btn";
  b.textContent=Tfn("hold_btn","Vuelve al partido");
  b.onclick=function(){ volverAlPartido(); };
  bar.appendChild(b);
}
function quitarHoldBar(){
  const bar=document.getElementById("partidoHold");
  if(bar){ bar.classList.add("oculto"); bar.setAttribute("hidden",""); bar.innerHTML=""; }
}
function pausarPartidoHold(){
  if(!partidoEnCurso()) return;
  const P=P_ACTUAL;
  if(typeof TIMER!=="undefined" && TIMER){ try{ clearInterval(TIMER); }catch(e){} TIMER=null; }
  PAUSADO=true;
  if(!P._holdUI){
    P._holdUI={
      kind:P._holdKind||((typeof MOMENTO_OPS!=="undefined"&&MOMENTO_OPS&&MOMENTO_OPS.length)?"accion":"vivo"),
      ev:P._holdEv||null,
      pausado:true
    };
  }
  const varEl=document.querySelector(".var-lt");
  if(varEl&&varEl.parentNode) varEl.parentNode.removeChild(varEl);
  document.body.classList.remove("en-partido","hay-momento");
  pintarHoldBar();
}
function volverAlPartido(){
  if(!partidoEnCurso()){ quitarHoldBar(); return; }
  const P=P_ACTUAL;
  const hold=P._holdUI||{};
  P._holdUI=null;
  quitarHoldBar();
  PAUSADO=true;
  if(typeof pintarPartido==="function") pintarPartido();
  if(hold.kind==="accion" && hold.ev && typeof mostrarAccion==="function"){
    mostrarAccion(hold.ev);
  } else if(hold.kind==="momento" && typeof mostrarMomento==="function"){
    mostrarMomento();
  } else if(hold.kind==="var" && hold.ev && typeof mostrarVar==="function"){
    mostrarVar(P, hold.ev);
  } else if(hold.kind==="tanda" && typeof pasoTandaVivo==="function"){
    pasoTandaVivo(P);
  } else if(hold.kind==="ht" && typeof modalEntretiempo==="function"){
    modalEntretiempo();
  } else {
    PAUSADO=false;
    if(typeof correrEnVivo==="function") correrEnVivo();
  }
}
/* 7.10 · MODO DEV: forzar un evento puntual en el partido en curso, para probarlo */
function devForzarEvento(tipo){
  const P=P_ACTUAL;
  if(!P || P.terminado){ if(typeof aviso==="function") aviso("Entra a un partido en curso para probar esto"); return; }
  clearInterval(TIMER); MOMENTO_OPS=[];
  const min=P.min;
  if(tipo==="penal"||tipo==="tiroLibre"||tipo==="lesion"||tipo==="corner"){ if(typeof mostrarAccion==="function") mostrarAccion({tipo:tipo,min:min,aFavor:true}); return; }
  if(tipo==="penalRival"){ if(typeof resolverEventoAuto==="function") resolverEventoAuto(P,{tipo:"penalRival",min:min}); pintarPartido(); return; }
  if(tipo==="gol"){ if(typeof anotaPropio==="function") anotaPropio(P,min); pintarPartido(); return; }
  if(tipo==="golRival"){ if(typeof anotaRival==="function") anotaRival(P,min); pintarPartido(); return; }
  if(tipo==="roja"){
    const j=(P.once&&P.once.length)?elige(P.once):null;
    if(j){ P.once=P.once.filter(x=>x!==j); j.estado="banca"; P.empuje-=1; P.orden-=3; P.tuvoRoja=true;
      if(typeof linea==="function") linea(P,min,"¡ROJA para "+j.n+"! (forzada · dev)","grave"); }
    pintarPartido(); return;
  }
  if(tipo==="autogol"){
    if(P.part.local) P.gv++; else P.gl++;
    const d=(P.once&&P.once.filter(x=>x.pos==="DEF")[0])||null;
    if(typeof regGol==="function") regGol(P,min,(d&&d.n)||"un defensor",false,"autogol",null);
    if(typeof linea==="function") linea(P,min,"Autogol (forzado · dev). "+((typeof marcadorTxt==="function")?marcadorTxt(P):""),"grave");
    pintarPartido(); return;
  }
  if(tipo==="var"){ if(typeof polemicaArbitral==="function") polemicaArbitral(P); pintarPartido(); return; }
}
function modalDevPartido(){
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">🧪</span><span>Probar evento (modo dev)</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p","mini","Fuerza el evento AHORA en el partido en curso, para verlo funcionar."));
    const g=el("div","fichas");
    [["penal","Penal a favor"],["penalRival","Penal en contra"],["tiroLibre","Tiro libre"],["corner","Córner a favor"],["gol","Gol propio"],
     ["golRival","Gol rival"],["roja","Roja propia"],["autogol","Autogol"],["var","Polémica / VAR"],["lesion","Lesión"]].forEach(([k,n])=>{
      const b=el("button","ficha",n); b.onclick=()=>{ cerrarModal(); devForzarEvento(k); }; g.appendChild(b);
    });
    c.appendChild(g);
    const x=el("button","btn-aqua ancho gris","Cerrar"); x.style.marginTop="8px"; x.onclick=cerrarModal; c.appendChild(x);
  });
}
/* 7.10 · panel de estadísticas de transmisión (posesión, remates, al arco, córners) */
/* 7.9030 · "U. de Chile", no "Chile"; "Audax", no "Italiano" */
function _nomCortoStats(id,nombre){
  const c=(typeof clubMundo==="function"&&id)?clubMundo(id):null;
  const n=(c&&c.c)||nombre||"";
  return n.length>14?apodoJug(n):n;
}
/* ¿hay estadísticas de verdad? Los partidos simulados no las registran */
function statsReales(s){ return !!(s&&((s.remMio||0)+(s.remRiv||0)+(s.arcMio||0)+(s.arcRiv||0)+(s.corMio||0)+(s.corRiv||0))>0); }
function bloqueStats(P){
  const s=P.stats||{pos:0.5,remMio:0,remRiv:0,arcMio:0,arcRiv:0,corMio:0,corRiv:0};
  const posYo=Math.round(clamp(s.pos,0,1)*100), posRiv=100-posYo;
  const cont=el("div","stat-part");
  cont.innerHTML=
    "<div class='stat-pos'><b>"+posYo+"%</b><div class='pos-bar'><i style='width:"+posYo+"%'></i></div><b>"+posRiv+"%</b></div>"+
    "<div class='stat-pos-lb'><span>"+escHtml(_nomCortoStats(E.club,E.clubNombre))+"</span><span class='mini'>posesión</span><span>"+escHtml(_nomCortoStats(P.part.rivalId,P.part.rivalNombre))+"</span></div>"+
    "<div class='stat-grid'>"+
      "<div class='stn'>"+s.remMio+"</div><div class='stk'>Remates</div><div class='stn'>"+s.remRiv+"</div>"+
      "<div class='stn'>"+s.arcMio+"</div><div class='stk'>Al arco</div><div class='stn'>"+s.arcRiv+"</div>"+
      "<div class='stn'>"+s.corMio+"</div><div class='stk'>Córners</div><div class='stn'>"+s.corRiv+"</div>"+
    "</div>";
  return cont;
}
/* 7.79 · CELEBRACIÓN DE GOL. Detecta un cambio de marcador entre renders (así atrapa
   TODO gol: jugada, penal, tiro libre) y explota la pantalla una sola vez por gol. */
function celebrarGolSiCorresponde(P, marcEl){
  if(!P || P.modo==="simular") return;
  const tot=P.gl+P.gv;
  if(P._golPrev===undefined){ P._golPrev=tot; P._glPrev=P.gl; P._gvPrev=P.gv; return; }
  if(tot>P._golPrev){
    const propio = P.part.local ? (P.gl>P._glPrev) : (P.gv>P._gvPrev);
    const quien=(P.goleadores&&P.goleadores.length)?P.goleadores[P.goleadores.length-1]:null;
    try{ celebrarGol(P, propio, quien, marcEl); }catch(e){}
  }
  P._golPrev=tot; P._glPrev=P.gl; P._gvPrev=P.gv;
}
function celebrarGol(P, propio, quien, marcEl){
  /* el marcador late */
  if(marcEl){ const go=marcEl.querySelector(".go"); if(go){ go.classList.remove("pulso"); void go.offsetWidth; go.classList.add("pulso"); } }
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  const perf=document.body.classList.contains("perf");
  const ov=el("div","gol-cel"+(propio?"":" rival"));
  const grito=propio?"¡GOOOOL!":"Gol de "+(P.part.rivalNombre||"el rival");
  const wrap=el("div","wrap",
    '<div class="big">'+(propio?"⚽ ¡GOOOL!":"GOL "+ (P.part.rivalNombre||"rival"))+'</div>'+
    (propio&&quien?'<div class="quien">de '+quien+'</div>':(!propio?'<div class="quien">nos empataron la alegría…</div>':''))+
    '<div class="marc-mini">'+(P.part.local?E.clubNombre:P.part.rivalNombre)+" "+P.gl+" - "+P.gv+" "+(P.part.local?P.part.rivalNombre:E.clubNombre)+'</div>');
  ov.appendChild(wrap);
  /* confeti (no en modo liviano ni reduce) */
  if(!perf && !reduce){
    const cols=propio?["#38d66a","#eaffef","#ffd23f","#4fb0ff"]:["#e8563f","#ffd0c8","#ffffff"];
    for(let i=0;i<16;i++){
      const c=el("i");
      c.style.left=(Math.random()*100)+"vw";
      c.style.background=cols[i%cols.length];
      c.style.animationDelay=(Math.random()*0.35)+"s";
      c.style.transform="translateY(0) rotate("+(Math.random()*180)+"deg)";
      ov.appendChild(c);
    }
  }
  document.body.appendChild(ov);
  const dur=(perf||reduce)?1000:1750;
  setTimeout(()=>{ if(ov&&ov.parentNode) ov.parentNode.removeChild(ov); }, dur);
}
/* 7.9003 · zócalo VAR estilo Aero (lower-third). Pausa 2s, después valida o anula. */
function varDuracionMs(){
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  const perf=document.body&&document.body.classList.contains("perf");
  return (perf||reduce)?600:5200;   /* 7.9042 · la revisión que existe, tarda: tensión */
}
function mostrarVar(P, ev){
  if(!P||!ev) return;
  P._holdKind="var"; P._holdEv=ev;
  P._varHold=true;
  if(typeof TIMER!=="undefined" && TIMER) clearInterval(TIMER);
  const viejo=document.querySelector(".var-lt");
  if(viejo&&viejo.parentNode) viejo.parentNode.removeChild(viejo);
  const esPenal=ev.kind==="penal"||ev.kind==="penalRival";
  const propio=ev.kind==="gol"||ev.kind==="penal";
  const club=propio?((typeof E!=="undefined"&&E&&E.clubNombre)||"nosotros"):((P.part&&P.part.rivalNombre)||"el rival");
  const ov=el("div","var-lt");
  const badge=el("div","var-badge","VAR");
  const body=el("div","var-body");
  const kicker=el("div","var-kicker","Revisando");
  const title=el("div","var-title", esPenal?"Posible penal":"Jugada de gol");
  const sub=el("div","var-sub", club+" · el juez va al monitor");
  body.appendChild(kicker); body.appendChild(title); body.appendChild(sub);
  ov.appendChild(badge); ov.appendChild(body);
  document.body.appendChild(ov);
  const VR=(typeof VAR_REVISION!=="undefined")?VAR_REVISION:{anulaGol:0.38,anulaPenal:0.30};
  const anula=Math.random()<(esPenal?VR.anulaPenal:VR.anulaGol);
  const dur=varDuracionMs();
  /* 7.9042 · la espera se cuenta en etapas: nadie grita todavía. */
  const etapas=esPenal?["El juez se lleva la mano a la oreja…","Van al monitor. Cámara lenta del contacto.","Otra toma. El estadio en silencio."]
    :["El juez se lleva la mano a la oreja…","Trazan la línea del offside.","Otra toma. Nadie grita todavía."];
  if(dur>1000) etapas.forEach(function(tx,i){ setTimeout(function(){ if(ov.parentNode&&!ov.classList.contains("ok")&&!ov.classList.contains("anula")) sub.textContent=club+" · "+tx; }, Math.round(dur*i/etapas.length)); });
  setTimeout(function(){
    ov.classList.add(anula?"anula":"ok");
    kicker.textContent=anula?"Decisión":"Confirmado";
    if(anula){
      title.textContent=esPenal?"NO HAY PENAL":"GOL ANULADO";
      sub.textContent="El VAR corta la alegría.";
      if(typeof linea==="function"){
        linea(P,ev.min, esPenal
          ?("VAR: no hay penal"+(propio?"":" en contra")+". El juez se corrige.")
          :("VAR: se ANULA el gol de "+club+". Fuera de juego milimétrico."), "grave");
      }
      if(typeof resetInercia==="function") resetInercia(P);
    } else {
      title.textContent=esPenal?"PENAL CONFIRMADO":"GOL VALIDADO";
      sub.textContent=esPenal?"El juez señala el punto.":"La jugada queda. Se grita.";
      if(typeof linea==="function"){
        linea(P,ev.min, esPenal
          ?("VAR: penal "+(propio?"a favor":"en contra")+" confirmado.")
          :("VAR: gol de "+club+" VALIDADO."), esPenal?"":"gol");
      }
    }
    const after=dur<=400?200:800;
    setTimeout(function(){
      if(ov&&ov.parentNode) ov.parentNode.removeChild(ov);
      P._varHold=false;
      if(anula){
        if(typeof pintarPartido==="function") pintarPartido();
        if(!PAUSADO && !(MOMENTO_OPS&&MOMENTO_OPS.length) && typeof correrEnVivo==="function") correrEnVivo();
        return;
      }
      aplicarVarValidado(P, ev);
    }, after);
  }, dur);
}
function aplicarVarValidado(P, ev){
  if(!P||!ev) return;
  const kind=ev.kind;
  if(kind==="gol"){
    if(typeof anotaPropio==="function") anotaPropio(P, ev.min);
    if(typeof actualizarStats==="function") actualizarStats(P,{tipo:"gol",min:ev.min});
    if(typeof pintarPartido==="function") pintarPartido();
    if(!PAUSADO && !(MOMENTO_OPS&&MOMENTO_OPS.length) && typeof correrEnVivo==="function") correrEnVivo();
    return;
  }
  if(kind==="golRival"){
    if(typeof anotaRival==="function") anotaRival(P, ev.min);
    if(typeof actualizarStats==="function") actualizarStats(P,{tipo:"golRival",min:ev.min});
    if(typeof pintarPartido==="function") pintarPartido();
    if(!PAUSADO && !(MOMENTO_OPS&&MOMENTO_OPS.length) && typeof correrEnVivo==="function") correrEnVivo();
    return;
  }
  const tipo=kind==="penal"?"penal":"penalRival";
  const acc={tipo:tipo, min:ev.min, aFavor:kind==="penal"};
  if(tipo==="penalRival"){
    if(typeof resolverEventoAuto==="function") resolverEventoAuto(P, acc);
    if(typeof pintarPartido==="function") pintarPartido();
    if(!PAUSADO && typeof correrEnVivo==="function") correrEnVivo();
    return;
  }
  const autoP=!E.config||E.config.autoPausa!==false;
  if(P.modo==="dirigir"&&autoP && typeof mostrarAccion==="function"){
    if(typeof pintarPartido==="function") pintarPartido();
    mostrarAccion(acc);
    return;
  }
  if(typeof resolverEventoAuto==="function") resolverEventoAuto(P, acc);
  if(typeof pintarPartido==="function") pintarPartido();
  if(!PAUSADO && !(MOMENTO_OPS&&MOMENTO_OPS.length) && typeof correrEnVivo==="function") correrEnVivo();
}
/* 7.9038 · "Autobús, velocidad, pausa, cancha… y se pierde el relato": cada botón repinta la
   pantalla desde cero; al vaciarla la página se achicaba y el scroll (y el del relato) volvía a 0.
   Se sostiene el alto mientras se repinta y se vuelve exactamente a donde estabas. */
function pintarPartido(){
  const P=P_ACTUAL; if(!P) return;
  const v0=$("#vista"), eraPartido=!!(v0&&v0.dataset.sec==="partido");
  const y=window.scrollY||0, alto=v0?v0.offsetHeight:0;
  const rel0=v0&&v0.querySelector(".relato"), relTop=rel0?rel0.scrollTop:0;
  /* ancla: si el relato estaba en pantalla, queda en el mismo lugar aunque arriba cambie algo (cancha ON/OFF) */
  const r0=rel0&&rel0.getBoundingClientRect(), ancla=(r0&&r0.top<innerHeight&&r0.bottom>0)?r0.top:null;
  try{ _pintarPartidoCuerpo(P); }
  finally{
    const v=$("#vista"); if(v) v.style.minHeight="";
    if(eraPartido){
      const rel=v&&v.querySelector(".relato"); if(rel&&relTop) rel.scrollTop=relTop;
      if(!document.body.classList.contains("con-modal")){
        if(ancla!=null&&rel){ const d=rel.getBoundingClientRect().top-ancla; if(Math.abs(d)>2) try{ window.scrollBy(0,d); }catch(e){} }
        else if(Math.abs((window.scrollY||0)-y)>2){ try{ window.scrollTo(0,y); }catch(e){} }
      }
    }
  }
}
function _pintarPartidoCuerpo(P){
  const v=$("#vista");
  if(v.dataset.sec==="partido"&&v.offsetHeight) v.style.minHeight=v.offsetHeight+"px";
  v.innerHTML=""; v.dataset.sec="partido";
  document.body.classList.add("en-partido");
  document.body.classList.remove("con-dock","hay-momento");
  if(typeof pintarDock==="function") pintarDock();
  const [yo,otro]=miMarcador(P);
  const liveTit=P.part.tipo==="copa"
    ? ((P.part.torneo||"Copa")+" · "+P.part.ronda)
    : ((typeof nombreTorneo==="function"?nombreTorneo(P.part):"Campeonato")+" · fecha "+P.part.fecha);
  const p=panel(liveTit,"🎙️",P.part.tipo==="copa"?"agua":"");
  /* 7.22 · momentazo: flash grande cuando cae un gol / roja / penal. Se detecta
     comparando el marcador (y las líneas graves nuevas) entre renders. */
  (function(){
    let txt=null, tono=null;
    if(P._lastMarc){
      if(yo>P._lastMarc[0]){ txt="⚽ ¡GOOOL de "+(E.clubNombre||"nosotros")+"!"; tono="bueno"; }
      else if(otro>P._lastMarc[1]){ txt="Gol de "+P.part.rivalNombre; tono="malo"; }
    }
    const nl=P.lineas.length;
    if(!txt && P._lastN!=null && nl>P._lastN){
      const nuevas=P.lineas.slice(P._lastN).reverse();
      const g=nuevas.find(l=>l.c==="grave" && /ROJA|[Pp]enal|anulad|Autogol|nubes/.test(l.t));
      if(g){ txt=g.t; tono=/ROJA|Autogol|anulad|nubes/.test(g.t)?"malo":"neutro"; }
    }
    P._lastMarc=[yo,otro]; P._lastN=nl;
    if(txt){ P._flash={txt:txt,tono:tono}; P._flashN=6; }
    if(P._flash && P._flashN>0 && P.modo!=="simular"){
      const fb=el("div"); fb.textContent=P._flash.txt;
      const t=P._flash.tono;
      fb.style.cssText="text-align:center;font-weight:800;font-size:19px;padding:10px 8px;margin:0 0 8px;border-radius:10px;letter-spacing:.4px;line-height:1.2;"+
        (t==="bueno"?"background:#0f7a33;color:#eafff0;box-shadow:0 0 0 2px #1fae52 inset;":
         (t==="malo"?"background:#8f1d1d;color:#ffecec;box-shadow:0 0 0 2px #c9392c inset;":
                     "background:#243044;color:#eef3ff;box-shadow:0 0 0 2px #3a4a63 inset;"));
      p.cuerpo.appendChild(fb);
      P._flashN--;
    }
  })();
  const marc=el("div","marcador marcador-vivo");
  const minTxt=(typeof textoReloj==="function")?textoReloj(P,false).replace(/^⏸ /,""):("Minuto "+P.min);
  marc.innerHTML='<div class="eq">'+(P.part.local?E.clubNombre:P.part.rivalNombre)+'</div>'+
    '<div class="go-wrap"><div class="go">'+P.gl+" - "+P.gv+'</div><div class="go-min">'+minTxt+'</div></div>'+
    '<div class="eq">'+(P.part.local?P.part.rivalNombre:E.clubNombre)+'</div>';
  p.cuerpo.appendChild(marc);
  celebrarGolSiCorresponde(P, marc);   /* 7.79 · explota la pantalla cuando cae un gol */
  let canchaCv=null;
  const verCancha=!(E.config&&E.config.verCancha===false);
  if(P.modo!=="simular"){
    const hud=el("div","partido-hud");
    if(verCancha){
      const colC=el("div","partido-cancha");
      canchaCv=el("canvas","cancha2d"); canchaCv.setAttribute("aria-hidden","true");
      colC.appendChild(canchaCv); hud.appendChild(colC);
    }
    const colS=el("div","partido-stats");
    colS.appendChild(bloqueStats(P));
    hud.appendChild(colS);
    p.cuerpo.appendChild(hud);
  }
  const tramoTxt=(typeof textoReloj==="function")?textoReloj(P,PAUSADO):(P.terminado?"Final del partido":((PAUSADO?"⏸ ":"")+"Minuto "+P.min+" · "+(P.min<=45?"1T":(P.min<90?"2T":"FT"))));
  p.cuerpo.appendChild(el("div","reloj"+(P._descDicho&&!P.terminado?" desc":""),tramoTxt));
  if(P.arbitro){
    const filaA=el("div","fila-meta centro");
    const ca=chipArbitro(P.part,P.arbitro); if(ca) filaA.appendChild(ca);
    p.cuerpo.appendChild(filaA);
  }
  if(typeof canalDelPartido==="function"){
    const ch=canalDelPartido(P.part);
    p.cuerpo.appendChild(el("div","mini centro canal-live","📺 "+ch.n+" · "+ch.d));
  }
  if(!P.terminado&&P.modo!=="simular"){
    const hsRow=el("div","hot-swap");
    hsRow.setAttribute("role","group");
    hsRow.setAttribute("aria-label","Mentalidad en caliente");
    Object.keys(HOT_SWAPS).forEach(function(id){
      const hs=HOT_SWAPS[id];
      const on=!!(E.tactica && E.tactica.mentalidad===hs.ment && E.tactica.bloque===hs.bloque);
      const b=el("button","hot-b"+(on?" on":""), hs.n);
      b.type="button";
      b.setAttribute("aria-pressed", on?"true":"false");
      b.title=hs.n+" · se siente en el próximo minuto, sin pausar";
      b.disabled=!!(MOMENTO_OPS&&MOMENTO_OPS.length);
      b.onclick=function(){ aplicarHotSwap(id); };
      hsRow.appendChild(b);
    });
    p.cuerpo.appendChild(hsRow);
    if(P.iner && (P.iner.cor>=2 || P.iner.ataj>=2 || P.iner.falta>=2)){
      const bits=[];
      if(P.iner.cor>=2) bits.push(P.iner.cor+" córners seguidos");
      if(P.iner.ataj>=2) bits.push(P.iner.ataj+" atajadas seguidas");
      if(P.iner.falta>=2) bits.push(P.iner.falta+" faltas seguidas");
      p.cuerpo.appendChild(el("div","mini hot-iner","🔥 Inercia: "+bits.join(" · ")+". El próximo tiro pesa más."));
    }
    if(P.tanda){
      const tb=el("div","tanda-bar");
      const yoN=(E&&E.clubNombre)||"nosotros", elN=(P.part&&P.part.rivalNombre)||"rival";
      function dots(lado){
        return (P.tanda.seq||[]).filter(function(x){ return x.lado===lado; }).map(function(x){ return x.gol?"⚽":"❌"; }).join(" ")
          || "—";
      }
      tb.appendChild(el("div","tanda-row","<b>"+((typeof escHtml==="function")?escHtml(yoN):yoN)+"</b> <span>"+dots("yo")+"</span> <b>"+P.tanda.yo+"</b>"));
      tb.appendChild(el("div","tanda-row","<b>"+((typeof escHtml==="function")?escHtml(elN):elN)+"</b> <span>"+dots("el")+"</span> <b>"+P.tanda.el+"</b>"));
      p.cuerpo.appendChild(tb);
    }
    const ctrl=el("div","ctrlPartido");
    const main=el("div","ctrl-main");
    const bp=el("button","btn-aqua chico",PAUSADO?"▶ Seguir":"⏸ Pausa");
    bp.onclick=()=>{ PAUSADO=!PAUSADO; if(!MOMENTO_OPS.length) pintarPartido(); };
    main.appendChild(bp);
    const bfin=el("button","btn-aqua chico verde",'⏩ <span class="ctrl-full">Al </span>resultado');
    bfin.setAttribute("aria-label","Saltar al resultado");
    bfin.onclick=()=>{ clearInterval(TIMER); MOMENTO_OPS=[]; correrHasta(P,90); pintarPartido(); cerrarPartido(); };
    main.appendChild(bfin);
    ctrl.appendChild(main);
    const sec=el("div","ctrl-sec");
    [["1x",420],["2x",240],["4x",110]].forEach(([n,vv])=>{
      const b=el("button","btn-aqua chico"+(VEL_PARTIDO===vv?"":" gris"),n);
      b.onclick=()=>{ VEL_PARTIDO=vv; if(!MOMENTO_OPS.length&&!PAUSADO) correrEnVivo(); pintarPartido(); };
      sec.appendChild(b);
    });
    const maxC=P.cambiosMax||3;
    const maxV=P.ventanasMax||99;
    const quedanC=Math.max(0,maxC-(P.cambios||0));
    const quedanV=maxV>=99?null:Math.max(0,maxV-(P.ventanas||0));
    const camLabel=quedanV!=null
      ?('🔄 <span class="ctrl-full">Cambio </span>'+(P.cambios||0)+"/"+maxC+' <span class="mini">· '+(typeof bancaPartido==="function"?bancaPartido(P).length:0)+' banca</span>')
      :('🔄 <span class="ctrl-full">Cambio (</span>'+(P.cambios||0)+"/"+maxC+'<span class="ctrl-full">)</span>');
    const bcam=el("button","btn-aqua chico",camLabel);
    bcam.setAttribute("aria-label","Cambio de jugadores. Quedan "+quedanC);
    bcam.title=quedanV!=null
      ?("IFAB: "+maxC+" cambios en "+maxV+" paradas (el entretiempo no cuenta). Banca de la lista: "+((typeof bancaPartido==="function")?bancaPartido(P).length:0)+". Quedan "+quedanC+" cambios y "+quedanV+" paradas.")
      :"Cambio de jugadores ("+(P.cambios||0)+" de "+maxC+"). Banca: "+((typeof bancaPartido==="function")?bancaPartido(P).length:0)+".";
    bcam.disabled=quedanC<=0 || (quedanV===0 && !P._ventanaAbierta) || (MOMENTO_OPS&&MOMENTO_OPS.length>0);
    bcam.onclick=modalCambio;
    sec.appendChild(bcam);
    const bplan=el("button","btn-aqua chico",'📋<span class="ctrl-full"> Plan</span>');
    bplan.setAttribute("aria-label","Cambiar el plan táctico");
    bplan.title="Mentalidad, presión, bloque y ritmo. Se siente en el ruedo.";
    bplan.disabled=!!(MOMENTO_OPS&&MOMENTO_OPS.length);
    bplan.onclick=modalPlanVivo;
    sec.appendChild(bplan);
    const bcv=el("button","btn-aqua chico"+(verCancha?"":" gris"),verCancha?'🎥<span class="ctrl-full"> Cancha ON</span>':'🎥<span class="ctrl-full"> Cancha OFF</span>');
    bcv.setAttribute("aria-label",verCancha?"Ocultar cancha":"Mostrar cancha");
    bcv.title=verCancha?"Cancha ON":"Cancha OFF";
    bcv.onclick=()=>{ if(!E.config)E.config={}; E.config.verCancha=!verCancha; guardar(); pintarPartido(); };
    sec.appendChild(bcv);
    if(typeof devOn==="function" && devOn()){
      const bdv=el("button","btn-aqua chico morado",'🧪<span class="ctrl-full"> Probar</span>');
      bdv.setAttribute("aria-label","Probar eventos");
      bdv.onclick=()=>{ if(typeof modalDevPartido==="function") modalDevPartido(); };
      sec.appendChild(bdv);
    }
    ctrl.appendChild(sec);
    p.cuerpo.appendChild(ctrl);
    if(P.modo==="dirigir"){
      if(!E.config) E.config={autoPausa:true};
      const bap=el("button","btn-aqua chico"+(E.config.autoPausa?"":" gris"),
        E.config.autoPausa?"⏸ Auto-pausa: ON":"▶ Auto-pausa: OFF");
      bap.title="Si está OFF, las jugadas (penal/tiro libre/lesión) se resuelven solas sin frenar el partido";
      bap.onclick=()=>{ E.config.autoPausa=!E.config.autoPausa; guardar(); pintarPartido(); };
      p.cuerpo.appendChild(bap);
    }
    const stam=clamp(100-P.cansancio*6,0,100);
    p.cuerpo.appendChild(el("div","mini","Físico del equipo"));
    p.cuerpo.appendChild(el("div",null,barrita(stam,stam>50?"#4fbf3f":(stam>25?"#e0a92a":"#c9392c"))));
    const cansados=(P.once||[]).filter(j=>(j.cansancio||0)>=16).sort((a,b)=>(b.cansancio||0)-(a.cansancio||0));
    if(cansados.length){
      p.cuerpo.appendChild(el("div","strip-cans","🥵 Piernas pesadas: "+cansados.slice(0,4).map(j=>j.n+" "+Math.round(j.cansancio)).join(" · ")+(cansados.length>4?"…":"")));
    }
  }
  /* 5.0 · barras de apoyo en vivo */
  if(P.modo!=="simular"){
    if(typeof actualizarApoyo==="function" && !P.apoyo) actualizarApoyo(P);
    if(P.apoyo){
      const ap=el("div","apoyo-live");
      const col=v=>v>=60?"#4fbf3f":(v>=35?"#e0a92a":"#c9392c");
      [["🎪 Ánimo hinchada",P.apoyo.hinchada,"Cómo está la gente: silba, empuja o se cae según el marcador y lo que haces."],
       ["👥 Confianza plantel",P.apoyo.plantel,"Si el camarín te cree. Baja con derrota o cambios raros; sube si el plan funciona."],
       ["🧠 Criterio DT",P.apoyo.criterio,"Tu lectura táctica en vivo. Sube cuando aciertas un momento; baja si improvisas al revés."]].forEach(([n,val,tip])=>{
        const row=el("div","apoyo-row");
        row.title=tip;
        row.innerHTML="<span class='apoyo-n' title='"+tip.replace(/'/g,"")+"'>"+n+"</span>"+barrita(val,col(val))+"<span class='apoyo-v'>"+Math.round(val)+"</span>";
        ap.appendChild(row);
      });
      p.cuerpo.appendChild(ap);
    }
  }
  const rel=el("div","relato");
  P.lineas.slice().reverse().forEach(l=>rel.appendChild(el("div","rel "+l.c,'<span class="m">'+l.m+"'</span><span>"+l.t+"</span>")));
  if(!P.lineas.length) rel.appendChild(el("div","rel","<span class='m'>0'</span><span>Rueda la pelota en "+P.part.sede+".</span>"));
  p.cuerpo.appendChild(rel);
  /* ticker de redes en vivo (FutbolGram) */
  if(P.modo!=="simular" && P.ticker && P.ticker.length){
    p.cuerpo.appendChild(el("h3","sub","📱 Plop! · en vivo"));
    const tk=el("div","ticker");
    P.ticker.slice(0,10).forEach(t=>{
      const d=el("div","tk "+(t.tono==="bueno"?"bien":(t.tono==="malo"?"mal":"")));
      d.innerHTML="<b>"+((typeof escHtml==="function")?escHtml(t.autor):t.autor)+"</b> <span class='mini'>"+(t.m||"?")+"'</span><br>"+((typeof escHtml==="function")?escHtml(t.texto):t.texto);
      tk.appendChild(d);
    });
    p.cuerpo.appendChild(tk);
  }
  const wrap=el("div","partido-wrap"); wrap.appendChild(p); v.appendChild(wrap);
  if(canchaCv && typeof montarCancha==="function"){ requestAnimationFrame(()=>montarCancha(canchaCv)); }
}
/* Loop fluido: el reloj corre y se auto-pausa SOLO cuando hay una jugada de
   peligro que decidir (penal, tiro libre, lesión) o un momento táctico. */
function correrEnVivo(){
  clearInterval(TIMER);
  TIMER=setInterval(pasoEnVivo, VEL_PARTIDO);
}
function pasoEnVivo(){
  if(PAUSADO) return;
  const P=P_ACTUAL; if(!P){ clearInterval(TIMER); return; }
  if(P._varHold) return;
  if(P.tanda && !P.tanda.done) return;
  if(P.terminado || (P.tanda && P.tanda.done)){ clearInterval(TIMER); pintarPartido(); cerrarPartido(); return; }
  /* momento táctico (solo dirigir). Nunca tape el descanso: si todavía no hubo
     45', solo dispara momentos del primer tiempo (12, 32). */
  if(P.modo==="dirigir" && P.momentoIdx<P.momentos.length && P.min>=P.momentos[P.momentoIdx]
     && (P._htDicho || P.min<45) && !P.prorroga && !P.tanda){
    clearInterval(TIMER); pintarPartido(); mostrarMomento(); return;
  }
  const ev=tickPartido(P);
  if(ev && ev.tipo==="varCheck"){
    if(typeof tickerPost==="function") tickerPost(P,ev);
    if(typeof mostrarVar==="function"){ mostrarVar(P, ev); return; }
  }
  if(typeof actualizarStats==="function") actualizarStats(P,ev);
  if(typeof actualizarApoyo==="function") actualizarApoyo(P);
  if(typeof tickerPost==="function") tickerPost(P,ev);
  if(typeof tickerAmbiente==="function" && (!ev||ev.tipo==="nada") && Math.random()<0.14) tickerAmbiente(P);   /* 6.36 · tuits del momento */
  if(ev.tipo==="fin" || ev.tipo==="tandaFin"){ clearInterval(TIMER); pintarPartido(); cerrarPartido(); return; }
  if(ev.tipo==="tanda"){
    clearInterval(TIMER); pintarPartido();
    if(P.modo==="simular"){ if(typeof simularTanda==="function") simularTanda(P); pintarPartido(); cerrarPartido(); return; }
    pasoTandaVivo(P); return;
  }
  if(ev.tipo==="prorroga"||ev.tipo==="prorrogaHT"){ pintarPartido(); return; }
  if(ev.tipo==="penalRival"){ resolverEventoAuto(P,ev); pintarPartido(); return; }
  if(ev.tipo==="entretiempo"){
    pintarPartido();
    if(P.modo!=="simular" && typeof modalEntretiempo==="function"){
      clearInterval(TIMER); modalEntretiempo(); return;
    }
  }
  if(ev.tipo==="penal"||ev.tipo==="lesion"||ev.tipo==="tiroLibre"){
    const autoP=!E.config||E.config.autoPausa!==false;
    if(P.modo==="dirigir"&&autoP){ clearInterval(TIMER); pintarPartido(); mostrarAccion(ev); return; }
    resolverEventoAuto(P,ev);
  }
  if(ev.tipo==="corner" && ev.aFavor!==false && P.modo==="dirigir" && (!E.config||E.config.autoPausa!==false)){
    clearInterval(TIMER); pintarPartido(); mostrarAccion(ev); return;
  }
  pintarPartido();
}
function registrarTandaKick(P, aFavor, gol, pateador){
  const t=P&&P.tanda; if(!t) return;
  t.seq.push({lado:aFavor?"yo":"el", gol:!!gol, n:pateador&&pateador.n});
  if(gol){ if(aFavor) t.yo++; else t.el++; }
  if(typeof linea==="function"){
    linea(P,P.min,
      ((pateador&&pateador.n)||(aFavor?"tu pateador":"el rival"))+" " +(gol?"la manda adentro.":"falla.")+" Tanda "+t.yo+"-"+t.el+".",
      gol?"gol":"grave");
  }
  if(typeof tandaPuedeCortar==="function" && tandaPuedeCortar(t) && typeof cerrarTanda==="function") cerrarTanda(P);
}
function pasoTandaVivo(P){
  P=P||P_ACTUAL;
  if(P){ P._holdKind="tanda"; P._holdEv=null; }
  if(!P||!P.tanda){ if(P) cerrarPartido(); return; }
  if(P.tanda.done){ pintarPartido(); cerrarPartido(); return; }
  const t=P.tanda;
  const nYo=t.seq.filter(function(x){ return x.lado==="yo"; }).length;
  const nEl=t.seq.filter(function(x){ return x.lado==="el"; }).length;
  const tocaYo=nYo<=nEl;
  pintarPartido();
  if(tocaYo && P.modo==="dirigir"){
    const pat=t.mios[nYo % Math.max(1,(t.mios||[]).length)]||{n:"tu pateador",nivel:70};
    minijuegoPenal(P, pat, {tanda:true, onRes:function(gol){
      registrarTandaKick(P, true, gol, pat);
      setTimeout(function(){ pasoTandaVivo(P); }, 480);
    }});
    return;
  }
  setTimeout(function(){
    if(typeof cobrarTandaAuto==="function") cobrarTandaAuto(P, tocaYo);
    if(typeof tandaPuedeCortar==="function" && tandaPuedeCortar(t) && typeof cerrarTanda==="function") cerrarTanda(P);
    pasoTandaVivo(P);
  }, 700);
}
function reanudarPronto(){
  setTimeout(()=>{ if(!P_ACTUAL) return;
    if(P_ACTUAL.tanda && !P_ACTUAL.tanda.done){ pasoTandaVivo(P_ACTUAL); return; }
    if(P_ACTUAL.terminado||(P_ACTUAL.tanda&&P_ACTUAL.tanda.done)){ cerrarPartido(); }
    else correrEnVivo();
  }, 650);
}
/* momento táctico (charla/cambio de plan) */
/* 7.99952 · pizarra en vivo: el DT cambia mentalidad / presión / bloque / ritmo ahora. */
function modalPlanVivo(){
  const P=P_ACTUAL; if(!P||P.terminado) return;
  const wasPaused=PAUSADO; PAUSADO=true; clearInterval(TIMER);
  const keys=[
    ["mentalidad","Mentalidad",typeof MENTALIDADES!=="undefined"?Object.keys(MENTALIDADES):["Equilibrado"]],
    ["estilo","Estilo",typeof ESTILOS!=="undefined"?Object.keys(ESTILOS):["Equilibrado"]],
    ["presion","Presión",typeof PRESIONES!=="undefined"?Object.keys(PRESIONES):["Media"]],
    ["bloque","Bloque",typeof BLOQUES!=="undefined"?Object.keys(BLOQUES):["Medio"]],
    ["ritmo","Ritmo",typeof RITMOS!=="undefined"?Object.keys(RITMOS):["Normal"]]
  ];
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      const cuerpo=(typeof montarBarraSO==="function")
        ? montarBarraSO(box,"Plan en el "+P.min+"'","📋",function(){ reanudar(); })
        : (function(){ box.appendChild(el("div","cab",'<span class="ic">📋</span><span>Plan en vivo</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();
      cuerpo.appendChild(el("p","mini","Cambiás ahora y se siente YA. Más de dos retoques marean al equipo (baja el orden)."));
      if(typeof lecturaPlan==="function") cuerpo.appendChild(el("div","resul mitad","<b>Lectura:</b> "+lecturaPlan()));
      keys.forEach(function(row){
        const k=row[0], lab=row[1], ops=row[2];
        cuerpo.appendChild(el("label","lb",lab+" · <b>"+(E.tactica[k]||"—")+"</b>"));
        const f=el("div","fichas");
        ops.forEach(function(o){
          const b=el("button","ficha",o);
          b.setAttribute("aria-pressed",E.tactica[k]===o?"true":"false");
          const tip=(k==="bloque"&&BLOQUES[o]&&BLOQUES[o].d)||(k==="ritmo"&&RITMOS[o]&&RITMOS[o].d);
          if(tip) b.title=tip;
          b.onclick=function(){
            if(E.tactica[k]===o) return;
            E.tactica[k]=o;
            if(typeof reaplicarPlan==="function") reaplicarPlan(P);
            if(typeof linea==="function") linea(P,P.min,"El DT cambia: "+lab.toLowerCase()+" → "+o+".","cambio");
            if(typeof guardar==="function") guardar();
            pintar();
          };
          f.appendChild(b);
        });
        cuerpo.appendChild(f);
      });
      const n=P._ajustes||0;
      if(n>=2) cuerpo.appendChild(el("p","mini","⚠ Ya retocaste "+n+" veces. El camarín empieza a no entender."));
      const x=el("button","btn-aqua ancho verde","Seguir con este plan");
      x.style.marginTop="8px";
      x.onclick=reanudar;
      cuerpo.appendChild(x);
    };
    const reanudar=()=>{ cerrarModal(); PAUSADO=wasPaused; pintarPartido(); if(!PAUSADO&&!MOMENTO_OPS.length) correrEnVivo(); };
    pintar();
  },{cerrarFuera:false,clase:"ventana-so"});
}
/* 7.99952 · charla de entretiempo: pep talk + opción de cambiar el plan. */
function modalEntretiempo(){
  const P=P_ACTUAL; if(!P) return;
  P._holdKind="ht"; P._holdEv=null;
  PAUSADO=true; clearInterval(TIMER);
  const [yo,otro]=typeof miMarcador==="function"?miMarcador(P):[P.gl,P.gv];
  const diff=yo-otro;
  const clima=diff>0?"Vas ganando. No se duerman.":(diff<0?"Van abajo. Hay que hablar claro.":"Empate. El segundo tiempo decide.");
  modal(box=>{
    const cuerpo=(typeof montarBarraSO==="function")
      ? montarBarraSO(box,"Entretiempo · "+P.gl+"-"+P.gv,"☕",function(){ salir(); })
      : (function(){ box.appendChild(el("div","cab",'<span class="ic">☕</span><span>Entretiempo</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();
    cuerpo.appendChild(el("p",null,clima));
    cuerpo.appendChild(el("p","mini","Quince minutos. Lo que digas acá mueve empuje y orden. Después puedes retocar el plan."));
    const ops=[
      {t:"Los reto: esto no se aguanta",d:"Orden y bronca. Sube el orden, cansa un poco.",ef:{orden:2.4,empuje:0.6,desgaste:0.8}},
      {t:"Tranquilos, el plan está",d:"No tocar nada. Confianza.",ef:{orden:1.2,empuje:0.4}},
      {t:"Segundo tiempo de infarto",d:"Todos arriba. Generás, te abrís.",ef:{ataque:2.6,riesgoPlan:2,orden:-1.6,desgaste:1.4}},
      {t:"Aguanten atrás y salgan de contra",d:"Bus estacionado. Esperan el error.",ef:{orden:2.8,ataque:-0.6,riesgoPlan:-1}}
    ];
    ops.forEach(function(o){
      const b=el("button","btn-aqua ancho");
      b.innerHTML="<b>"+o.t+"</b><div class='mini'>"+o.d+"</div>";
      b.style.marginTop="6px";
      b.onclick=function(){
        if(typeof aplicarMomento==="function") aplicarMomento(P,o.ef);
        else { P.ataque+=(o.ef.ataque||0); P.orden+=(o.ef.orden||0); P.desgaste+=(o.ef.desgaste||0); }
        if(o.ef.empuje) P.empuje=(P.empuje||0)+o.ef.empuje;
        if(typeof linea==="function") linea(P,45,"Charla: «"+o.t+"».","cambio");
        aviso("El camarín escuchó");
        cerrarModal();
        PAUSADO=false;
        modalPlanVivo();
      };
      cuerpo.appendChild(b);
    });
    const skip=el("button","btn-aqua ancho gris","Sin charla · a la cancha");
    skip.style.marginTop="10px";
    skip.onclick=salir;
    cuerpo.appendChild(skip);
    function salir(){ cerrarModal(); PAUSADO=false; pintarPartido(); if(!MOMENTO_OPS.length) correrEnVivo(); }
  },{cerrarFuera:false,clase:"ventana-so"});
}
/* 6.18 · cambio manual con nombre durante el partido */
function modalCambio(){
  const P=P_ACTUAL; if(!P) return;
  const maxC=P.cambiosMax||3;
  const maxV=P.ventanasMax||99;
  if((P.cambios||0)>=maxC){ aviso("Ya usaste todos los cambios"); return; }
  const enHT=P.min>=45&&P.min<=47;
  if(maxV<99 && !enHT && !P._ventanaAbierta && (P.ventanas||0)>=maxV){
    aviso("Ya usaste las "+maxV+" paradas de cambio (el entretiempo no cuenta)"); return;
  }
  const wasPaused=PAUSADO; PAUSADO=true; clearInterval(TIMER);
  const banca=(typeof bancaPartido==="function")?bancaPartido(P):E.plantel.filter(j=>!j.vendido&&!j.cedido&&!(j.lesion>0)&&P.once.indexOf(j)<0);
  let sale=null;
  const reanudar=()=>{ P._ventanaAbierta=false; cerrarModal(); PAUSADO=wasPaused; pintarPartido(); if(!PAUSADO&&!MOMENTO_OPS.length) correrEnVivo(); };
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      const quedanV=maxV>=99?null:Math.max(0,maxV-(P.ventanas||0));
      const cabTxt="Cambio "+((P.cambios||0)+1)+" / "+maxC+(quedanV!=null?" · parada "+Math.min(maxV,(P.ventanas||0)+(P._ventanaAbierta||enHT?0:1))+" / "+maxV:"");
      box.appendChild(el("div","cab",'<span class="ic">🔄</span><span>'+cabTxt+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini","Quién SALE y quién ENTRA. Minuto "+P.min+(P.min>=90?" (descuento)":"")+"."+(maxV<99?" Varios cambios en la misma parada cuentan como una sola.":"")));
      if(maxV<99) c.appendChild(el("p","mini",(P._ventanaAbierta?"Parada abierta: puedes meter otro ahora sin gastar otra.":(enHT?"Entretiempo: no gasta parada.":"Te quedan "+quedanV+" parada"+(quedanV===1?"":"s")+"."))));
      c.appendChild(el("h3","sub","Sale de la cancha"));
      const g1=el("div","align-grid");
      P.once.slice().sort((a,b)=>(b.cansancio||0)-(a.cansancio||0)).forEach(j=>{
        const cans=Math.round(j.cansancio||0);
        const b=el("button","align-jug"+(sale===j?" on":"")+(cans>=16?" cans-alto":""));
        b.innerHTML="<b>"+(sale===j?"✓ ":"")+j.n+"</b><span class='mini'>"+j.pos+" · cansancio "+cans+(cans>=16?" · piernas pesadas":"")+"</span>";
        b.onclick=()=>{ sale=(sale===j?null:j); pintar(); };
        g1.appendChild(b);
      });
      c.appendChild(g1);
      if(sale){
        c.appendChild(el("h3","sub","Entra por "+sale.n));
        if(!banca.length){ c.appendChild(el("p","mini","No quedan suplentes disponibles.")); }
        const g2=el("div","align-grid");
        banca.slice().sort((a,b)=>((b.pos===sale.pos)-(a.pos===sale.pos))||(b.nivel-a.nivel)).forEach(j=>{
          const b=el("button","align-jug");
          const mismo=j.pos===sale.pos;
          b.innerHTML="<b>"+j.n+"</b><span class='mini'>"+j.pos+(mismo?" · mismo puesto":" · recambio")+" · niv "+j.nivel+" · forma "+Math.round(j.forma)+"</span>";
          b.onclick=()=>{
            if(hacerCambio(P,sale,j)){
              aviso(j.n+" entra por "+sale.n);
              sale=null;
              if((P.cambios||0)>=maxC){ reanudar(); return; }
              pintar();
            }
          };
          g2.appendChild(b);
        });
        c.appendChild(g2);
      }
      const x=el("button","btn-aqua ancho gris",P._ventanaAbierta?"Cerrar parada":"Cerrar sin cambiar"); x.style.marginTop="6px";
      x.onclick=reanudar;
      c.appendChild(x);
    };
    pintar();
  },{cerrarFuera:false});
}
function avanzarMomento(P){
  P.momentoIdx++;
  if(P.apoyo){ P.apoyo.momentos=(P.apoyo.momentos||0)+1; P.apoyo.criterio=clamp(P.apoyo.criterio+6,0,99); }
  correrEnVivo();
}
function mostrarMomento(){
  const P=P_ACTUAL;
  if(P){ P._holdKind="momento"; P._holdEv=null; }
  const m=momentoActual(P);
  const esTrivia=m.tipo==="trivia";
  const p=panel(m.t,esTrivia?"🧮":"🧠","alerta");
  p.classList.add("momento-vivo");
  document.body.classList.add("hay-momento");
  p.cuerpo.appendChild(el("p",null,m.d));
  if(esTrivia) p.cuerpo.appendChild(el("p",null,"<b>"+m.q+"</b>"));
  /* 7.10 · en decisiones tácticas, FutbolGram opina como PISTA (leé el consenso) */
  let rec=null;
  if(!esTrivia && typeof direccionRecomendada==="function"){
    rec=direccionRecomendada(P);
    const opin=(typeof opinionesTactica==="function")?opinionesTactica(rec):[];
    if(opin.length){
      const fg=el("div","fg-opina");
      fg.appendChild(el("div","fg-cab","📱 Plop! opina · lee a la gente"));
      const handles=(typeof HANDLES_HINCHA!=="undefined"&&HANDLES_HINCHA.length)?HANDLES_HINCHA:["@hincha_de_ley","@barra_del_fondo","@pibe_popular23"];
      opin.forEach(op=>{
        const h=elige(handles);
        fg.appendChild(el("div","fg-op","<b>"+h+"</b> "+((typeof escHtml==="function")?escHtml(op.t):op.t)));
        if(P.ticker) P.ticker.unshift({autor:h, texto:op.t, tono:"neutro", m:P.min||0});
      });
      p.cuerpo.appendChild(fg);
    }
  }
  const ops=el("div","ops ops-part"); MOMENTO_OPS=[];
  m.op.forEach((o,i)=>{
    const b=el("button","op"+(o.doping?" op-doping":""));
    b.innerHTML='<div class="t"><span class="tecla">'+(i+1)+'</span> '+o.t+'</div>'+(o.d?'<div class="d">'+o.d+'</div>':"");
    b.onclick=()=>{
      MOMENTO_OPS=[];
      if(esTrivia){
        const fac=m.factor||1;
        if(o.ok){
          P.empuje+=1.2*fac; P.ataque+=1*fac; P.orden+=0.5;
          if(Math.random()<clamp(0.20+fac*0.08,0.2,0.42) && typeof anotaPropio==="function"){ anotaPropio(P,P.min); aviso("¡Correcto! Y encima cayó el gol 🎯"); }
          else aviso("¡Correcto! Se soltaron 🎯");
        } else { P.empuje-=0.8; P.orden-=0.5; aviso("Nada que ver… se pusieron nerviosos 😬"); }
        avanzarMomento(P); return;
      }
      if(o.doping){ confirmarDoping(P,o.costo); return; }   /* async */
      /* leíste el consenso de la gente → el equipo se siente respaldado */
      if(rec && typeof direccionOpcion==="function" && direccionOpcion(o.ef)===rec){
        P.empuje+=0.9; if(typeof aplicarEfectos==="function") aplicarEfectos({moral:2});
        aviso("Leíste a la gente: el equipo siente el respaldo 📣");
      }
      aplicarMomento(P,o.ef); avanzarMomento(P);
    };
    ops.appendChild(b); MOMENTO_OPS.push(b);
  });
  p.cuerpo.appendChild(ops);
  p.cuerpo.appendChild(el("p","mini hint-teclado",esTrivia?"Elige la respuesta con 1 / 2 / 3.":"Elige con 1 / 2 / 3 / 4 · flechas y Enter."));
  (document.querySelector(".partido-wrap")||$("#vista")).appendChild(p);
  try{ p.scrollIntoView({block:"end",behavior:"instant"}); }catch(e){ try{ p.scrollIntoView(false); }catch(e2){} }
}
/* confirmación del doping: caro y turbio, se pregunta aparte */
function confirmarDoping(P,costo){
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">💉</span><span>¿Repartir el «preparado especial»?</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p",null,"Cuesta <b>"+plata(costo)+"</b> y es de lo más turbio que hay. Por lo que queda de partido el equipo se agranda muchísimo… pero si te agarran, es multa, escándalo en la prensa y hasta un jugador que se descompensa. Queda en tu prontuario."));
    const ir=el("button","btn-aqua ancho verde","Sí, que jueguen «recargados»");
    ir.onclick=()=>{ cerrarModal(); if(typeof doparEquipo==="function") doparEquipo(P,costo); aviso("El equipo salió otra vez, recargado… 💉"); avanzarMomento(P); };
    const no=el("button","btn-aqua ancho gris","No, así no"); no.style.marginTop="6px";
    no.onclick=()=>{ cerrarModal(); mostrarMomento(); };   /* vuelve a la charla, no gastó el momento */
    c.appendChild(ir); c.appendChild(no);
  },{cerrarFuera:false});
}
/* jugada de peligro que el DT resuelve en el acto */
function candidatosPenal(P){
  const c=P.once.filter(j=>j.pos!=="ARQ");
  const punt=j=>(j.nivel||60)+((j.rasgos&&j.rasgos.includes("penales"))?30:0)+((j.rasgos&&j.rasgos.includes("definición"))?12:0);
  let lista=c.slice().sort((a,b)=>punt(b)-punt(a)).slice(0,3);
  /* 6.7 · el pateador designado en la previa va primero si está en cancha */
  const des=E.tactica&&E.tactica.penalista;
  if(des){ const dj=P.once.find(j=>j.n===des); if(dj){ lista=[dj].concat(lista.filter(j=>j.n!==des)).slice(0,3); } }
  return lista;
}
/* ============================================================
   6.27 · MINIJUEGO DE PENAL
   Dibujás dónde va la pelota (tocas/arrastras dentro del arco),
   eliges el efecto, y el arquero se tira cuando pateas. Diseñado
   para ser JUSTO: si apuntas a un rincón, la metes casi siempre;
   solo el centro flojo o apuntarle al arquero se atajan.
   ============================================================ */
/* geometría del arco (viewBox 0 0 360 240) · 7.9004 transmisión */
const PEN_ARCO={x0:50,x1:310,y0:38,y1:168};
const ARCO_VIVO={x0:50,x1:310,y0:38,y1:168, wall:{x0:142,x1:218,y0:102,y1:168}};
function penZona(x,y){
  const A=PEN_ARCO, w=A.x1-A.x0;
  const fuera = (x < A.x0-18) || (x > A.x1+18) || (y < A.y0-18);
  let cx=clamp(x,A.x0+6,A.x1-6), cy=clamp(y,A.y0+6,A.y1-2);
  const t=(cx-A.x0)/w;
  const tercio = t<0.34?"izq":(t<0.66?"centro":"der");
  const alt = cy < (A.y0+A.y1)/2 ? "alto":"bajo";
  return {tercio:tercio, alt:alt, fuera:fuera, cx:cx, cy:cy};
}
function tlClasificar(aim){
  const A=ARCO_VIVO;
  if(!aim) return {res:"afuera",motivo:"Sin puntería."};
  if(aim.fuera || aim.cy < A.y0-10) return {res:"afuera",motivo:"Se fue por arriba del travesaño."};
  if(aim.cy < A.y0) return {res:"palo",motivo:"Al travesaño."};
  const W=A.wall;
  if(aim.cx>=W.x0 && aim.cx<=W.x1 && aim.cy>=W.y0) return {res:"barrera",motivo:"La barrera la tapó."};
  return {res:"arco"};
}
function cornerClasificar(aim){
  const A=ARCO_VIVO;
  if(!aim) return {res:"afuera",motivo:"Centro largo, se fue."};
  if(aim.fuera || aim.cy < A.y0-8) return {res:"afuera",motivo:"El centro se fue por arriba."};
  if(aim.cy > 162) return {res:"defensa",motivo:"Muy bajo: el primero la saca."};
  const zona = aim.cx<118?"primer":(aim.cx>242?"segundo":"penal");
  return {res:"aire", zona:zona};
}
/* 7.9009 · el minijuego de córner NO usa penResolver (eso daba gol ~siempre
   porque sumaba iner*40 al nivel). Misma banda que centroCorner: 0.06–0.30. */
function cornerResolver(zona, j, arq, iner){
  zona=zona||"penal";
  const aereoOk=j&&j.rasgos&&j.rasgos.indexOf("juego aéreo")>=0;
  let p=0.10+((iner||0)*0.04)+(aereoOk?0.08:0)+(((j&&j.nivel)||70)-70)*0.003;
  if(zona==="primer") p+=0.01;
  else if(zona==="segundo") p+=(aereoOk?0.04:0);
  p-=((((arq&&arq.nivel)||70)-70)*0.002);
  p=clamp(p,0.06,0.30);
  const r=Math.random();
  if(r<p) return {res:"gol",p:p,zona:zona};
  if(r<p+0.05) return {res:"palo",p:p,zona:zona};
  if(r<p+0.18) return {res:"atajado",p:p,zona:zona};
  return {res:"defensa",p:p,zona:zona};
}
function paloEntra(aim, efecto){
  let p=0.30;
  if(efecto==="potente") p+=0.08;
  if(aim && aim.alt==="alto") p+=0.06;
  if(aim && aim.tercio==="centro") p+=0.04;
  return Math.random()<clamp(p,0.18,0.50);
}
function _rebotePalo(svg, bolaG, destX, destY, aim, efecto, cb){
  if(svg) svg.classList.add("arco-alpalo");
  const entra=paloEntra(aim, efecto);
  const bx=entra?(180*0.55+destX*0.45):destX+(destX<180?-36:36);
  const by=entra?Math.min(150, destY+28):destY-22;
  _animBola(bolaG, destX, destY, bx, by, 280, function(){ cb(entra); });
}
function penArqueroTira(aim,arqNivel){
  const lee=clamp(0.12+(arqNivel-70)*0.006,0.05,0.32);
  if(Math.random()<lee) return aim.tercio;
  return elige(["izq","izq","centro","der","der"]);
}
function penResolver(aim,kdir,efecto,patNivel,arqNivel){
  if(aim.fuera) return {res:"afuera",p:0};
  const rincon=aim.tercio!=="centro", acerto=(kdir===aim.tercio);
  let g;
  if(efecto==="picadita"){
    g=(kdir!=="centro")?0.90:0.30;
    if(aim.alt==="alto") g+=0.05;
  } else {
    if(!acerto) g=rincon?0.95:0.86;
    else g=rincon?(aim.alt==="alto"?0.72:0.60):(aim.alt==="alto"?0.50:0.26);
    if(efecto==="potente") g+=0.06;
  }
  g+=(patNivel-70)*0.004-(arqNivel-70)*0.004;
  g=clamp(g,0.12,0.98);
  const cx=aim.cx, cy=aim.cy;
  const nearPalo=(cx!=null&&(cx<62||cx>298))||(aim.alt==="alto"&&cy!=null&&cy<52);
  const r=Math.random();
  if(nearPalo && r<0.10) return {res:"palo",p:g};
  if(r<g) return {res:"gol",p:g};
  if(nearPalo && r<g+0.12) return {res:"palo",p:g};
  return {res:"atajado",p:g};
}
function penTween(el,attrs,ms,cb){
  const ini={}, fin={};
  for(const k in attrs){ ini[k]=parseFloat(el.getAttribute(k))||0; fin[k]=attrs[k]; }
  const t0=performance.now();
  (function paso(t){
    const u=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-u,3);
    for(const k in attrs) el.setAttribute(k,(ini[k]+(fin[k]-ini[k])*e).toFixed(1));
    if(u<1) requestAnimationFrame(paso); else if(cb) cb();
  })(performance.now());
}
function _kitDe(id, fb){
  fb=fb||["#1a6ad4","#111827"];
  try{
    const info=(typeof clubLookup==="function"&&clubLookup(id))
      || (typeof CLUB_INFO_2026!=="undefined"&&CLUB_INFO_2026[id])
      || (typeof CLUB_INFO!=="undefined"&&CLUB_INFO[id])
      || (typeof CLUB_META!=="undefined"&&CLUB_META[id]);
    const c=info&&(info.colores||(info.meta&&info.meta.colores));
    if(c&&c[0]) return [c[0], c[1]||"#111827"];
  }catch(e){}
  return fb;
}
/* 7.9027 · el arco se reconstruye: gente con proporciones de gente,
   arco con fondo (red en perspectiva), tribuna que se mueve.
   Todo SVG propio, sin assets externos: se juega igual sin red.
   Figuras con origen en los pies (0,0); escala 1 = ~100 de alto. */
const ARCO_PIELES=["#f2c9a0","#e0ae84","#c68b5e","#9c6641","#6e4429"];
const ARCO_PELOS=["#1b1410","#2e1f14","#4a3020","#0e0e10","#6b4a2a"];
function _arcoHash(s){ s=String(s||""); let h=7; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))|0; return Math.abs(h); }
function _figPersona(o){
  o=o||{};
  const kit=o.kit||["#c0392b","#1a1a28"], piel=o.piel||ARCO_PIELES[0], pelo=o.pelo||ARCO_PELOS[0];
  const pose=o.pose||"parado", arq=pose==="arq";
  /* pies, rodillas, cadera y brazos según la pose */
  const P={
    arq:{pie:12,rod:10,cad:6, codo:[24,-62], mano:[28,-50]},
    muro:{pie:5,rod:5,cad:5, codo:[11,-60], mano:[3,-52]},
    parado:{pie:7,rod:7,cad:5, codo:[17,-61], mano:[18,-47]}
  }[pose]||{pie:7,rod:7,cad:5, codo:[17,-61], mano:[18,-47]};
  const media=arq?kit[0]:(o.media||"#f4f4f4");
  const botin="#15171c";
  function pierna(s){
    return '<path d="M'+(s*P.cad)+',-46 L'+(s*P.rod)+',-24" stroke="'+piel+'" stroke-width="8.5" stroke-linecap="round" fill="none"/>'+
      '<path d="M'+(s*P.rod)+',-25 L'+(s*P.pie)+',-4" stroke="'+media+'" stroke-width="7" stroke-linecap="round" fill="none"/>'+
      '<ellipse cx="'+(s*(P.pie+1.5))+'" cy="-2.2" rx="5" ry="2.6" fill="'+botin+'"/>';
  }
  function brazo(s, lado){
    const manga=arq?kit[0]:kit[0], ante=arq?kit[0]:piel;
    const id=arq?' id="arco-brazo-'+lado+'"':"";
    const glove=arq?_figMano(lado, P.mano[0]*s, P.mano[1]):'<circle cx="'+(s*P.mano[0])+'" cy="'+P.mano[1]+'" r="2.9" fill="'+piel+'"/>';
    return '<g'+id+' class="arco-brazo">'+
      '<path d="M'+(s*14)+',-76 L'+(s*P.codo[0])+','+P.codo[1]+'" stroke="'+manga+'" stroke-width="6.4" stroke-linecap="round" fill="none"/>'+
      '<path d="M'+(s*P.codo[0])+','+P.codo[1]+' L'+(s*P.mano[0])+','+P.mano[1]+'" stroke="'+ante+'" stroke-width="5.4" stroke-linecap="round" fill="none"/>'+
      glove+'</g>';
  }
  const torso='M-14.5,-78 Q0,-82.5 14.5,-78 L12,-50 L-12,-50 Z';
  const cabeza=o.espalda
    ? '<ellipse cx="0" cy="-92" rx="7.4" ry="8.4" fill="'+pelo+'"/>'+
      '<ellipse cx="-7" cy="-91" rx="1.6" ry="2.4" fill="'+piel+'"/><ellipse cx="7" cy="-91" rx="1.6" ry="2.4" fill="'+piel+'"/>'
    : '<ellipse cx="0" cy="-92" rx="7.2" ry="8.4" fill="'+piel+'"/>'+
      '<path d="M-7.3,-93 Q-7.6,-101.5 0,-101.2 Q7.6,-101.5 7.3,-93 Q4,-97.5 0,-97.4 Q-4,-97.5 -7.3,-93 Z" fill="'+pelo+'"/>'+
      '<ellipse cx="0" cy="-88" rx="5.6" ry="4.2" fill="rgba(0,0,0,.08)"/>';
  const numero=o.espalda&&o.num?'<text x="0" y="-58" text-anchor="middle" font-size="11" font-weight="800" font-family="system-ui,sans-serif" fill="'+kit[1]+'" opacity=".92">'+o.num+'</text>':"";
  const escudo=(!o.espalda)?'<path d="M-5,-80 L0,-74 L5,-80" stroke="'+kit[1]+'" stroke-width="1.6" fill="none"/>':"";
  const guantes=arq?'<rect x="-12" y="-50" width="24" height="3" fill="rgba(0,0,0,.18)"/>':"";
  return ''+
    '<ellipse cx="0" cy="0" rx="'+(arq?19:14)+'" ry="3.6" fill="rgba(0,0,0,.34)"/>'+
    pierna(-1)+pierna(1)+
    '<path d="M-12.5,-52 L12.5,-52 L13.5,-36 L2,-36 L0,-41 L-2,-36 L-13.5,-36 Z" fill="'+kit[1]+'"/>'+
    '<path d="'+torso+'" fill="'+kit[0]+'"/>'+
    '<path d="'+torso+'" fill="url(#arcoVolumen)"/>'+
    escudo+numero+guantes+
    '<rect x="-3" y="-86" width="6" height="7" rx="2" fill="'+piel+'"/>'+
    cabeza+
    brazo(-1,"izq")+brazo(1,"der");
}
function _figJugador(x,y,kit,cls,o){
  o=o||{};
  kit=kit||["#c0392b","#1a1a28"];
  cls=cls||"arco-muro";
  const esc=o.escala||0.72, i=o.i||0;
  return '<g transform="translate('+x+' '+y+') scale('+esc+')">'+
    '<g class="'+cls+'">'+
      _figPersona({kit:kit, pose:o.pose||(cls==="arco-muro"?"muro":"parado"), espalda:!!o.espalda, num:o.num,
        piel:ARCO_PIELES[(i*3+1)%ARCO_PIELES.length], pelo:ARCO_PELOS[i%ARCO_PELOS.length]})+
    '</g></g>';
}
function _figMano(lado, x, y){
  const s=lado==="izq"?-1:1;
  const id=lado==="izq"?"arco-mano-izq":"arco-mano-der";
  x=x!=null?x:s*28; y=y!=null?y:-50;
  return '<g id="'+id+'" class="arco-mano" transform="translate('+x+' '+y+')">'+
    '<rect x="-4.4" y="-3.4" width="8.8" height="9.6" rx="3.4" fill="#f4f7fb" stroke="#7d8da0" stroke-width=".6"/>'+
    '<rect x="-4.4" y="3.6" width="8.8" height="2.6" rx="1" fill="#c6f13a"/>'+
    '<ellipse cx="'+(s*-4.6)+'" cy="1.4" rx="1.9" ry="3.2" fill="#f4f7fb" stroke="#7d8da0" stroke-width=".5" transform="rotate('+(s*-24)+' '+(s*-4.6)+' 1.4)"/>'+
  '</g>';
}
/* la pelota viaja hacia el arco y se achica (se aleja); la sombra queda en el pasto */
function _animBola(bolaG, x0,y0, x1,y1, ms, cb, s1){
  const s0=parseFloat(bolaG.getAttribute("data-s"))||1;
  if(s1==null) s1=(y1<y0-40)?0.5:s0;
  const svg=bolaG.ownerSVGElement, sombra=svg&&svg.querySelector("#arco-bola-sombra");
  const piso0=s0<0.8?Math.min(170,y0+12):y0+7, piso1=s1<0.8?170:y1+7;
  const t0=performance.now();
  (function paso(t){
    const u=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-u,3);
    const lift=Math.sin(u*Math.PI)*18;
    const x=x0+(x1-x0)*e, s=s0+(s1-s0)*e;
    bolaG.setAttribute("transform","translate("+x.toFixed(1)+" "+(y0+(y1-y0)*e-lift).toFixed(1)+") rotate("+(u*420).toFixed(0)+") scale("+s.toFixed(3)+")");
    if(sombra){
      sombra.setAttribute("cx",x.toFixed(1)); sombra.setAttribute("cy",(piso0+(piso1-piso0)*e).toFixed(1));
      sombra.setAttribute("rx",(7*s).toFixed(1)); sombra.setAttribute("ry",(2.6*s).toFixed(1));
    }
    if(u<1) requestAnimationFrame(paso);
    else { bolaG.setAttribute("data-s",s1); if(cb) cb(); }
  })(performance.now());
}
function _arcoHinchada(opts){
  const cols=(opts.hinchada&&opts.hinchada.length)?opts.hinchada:["#c0392b","#f4f4f4","#1a4a9c"];
  const pal=[cols[0],cols[1]||"#f4f4f4",cols[0],"#2a2f3a",cols[2]||cols[0],"#e8e2d0"];
  function tile(id,w,h,r,sh){
    let g='<pattern id="'+id+'" width="'+w+'" height="'+h+'" patternUnits="userSpaceOnUse">';
    const n=5;
    for(let i=0;i<n;i++){
      const x=(i+0.5)*w/n, y=h*0.45+((i*7)%3)-1;
      g+='<rect x="'+(x-r*1.3).toFixed(1)+'" y="'+(y+r*0.7).toFixed(1)+'" width="'+(r*2.6).toFixed(1)+'" height="'+(h*0.5).toFixed(1)+'" rx="'+r+'" fill="'+pal[(i*sh+1)%pal.length]+'"/>'+
         '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" fill="'+ARCO_PIELES[(i*2+sh)%ARCO_PIELES.length]+'"/>';
    }
    return g+'</pattern>';
  }
  return tile("arcoGenteLejos",20,7,1.3,1)+tile("arcoGenteCerca",30,11,2.1,2)+tile("arcoGenteCerca2",30,11,2.1,3);
}
function htmlArcoVivo(opts){
  opts=opts||{};
  const barrera=!!opts.barrera;
  const arqX=opts.arqX!=null?opts.arqX:180;
  const modo=opts.modo||(barrera?"tl":"penal");
  const kitArq=opts.kitArq||["#1a6ad4","#111827"];
  const kitWall=opts.kitWall||["#c0392b","#1a1a28"];
  const kitAtk=opts.kitAtk||["#f4f4f4","#111111"];
  const bolaX=opts.bolaX!=null?opts.bolaX:180;
  const bolaY=opts.bolaY!=null?opts.bolaY:220;
  const hc=opts.hinchada||[kitAtk[0],kitAtk[1]];
  const sem=_arcoHash(opts.semilla||kitArq.join(""));
  let wall="";
  if(barrera){
    wall='<g id="arco-wall">'+[151,169,187,205].map(function(x,i){
      return _figJugador(x,182, i%2?[kitWall[0],kitWall[1]]:kitWall, "arco-muro", {escala:0.8, i:i+sem});
    }).join("")+'</g>';
  }
  let area="";
  if(modo==="corner"){
    const esc=function(fy){ return 0.76+(fy-150)*0.006; };
    area='<g id="arco-area">'+
      _figJugador(118,160,kitWall,"arco-def",{escala:esc(160),i:sem+1})+
      _figJugador(210,158,kitWall,"arco-def",{escala:esc(158),i:sem+2})+
      _figJugador(180,150,kitWall,"arco-def",{escala:esc(150),i:sem+3})+
      _figJugador(96,168,kitAtk,"arco-atk",{escala:esc(168),i:sem+4,espalda:true,num:4})+
      _figJugador(248,166,kitAtk,"arco-atk",{escala:esc(166),i:sem+5,espalda:true,num:2})+
      _figJugador(168,174,kitAtk,"arco-atk",{escala:esc(174),i:sem+6,espalda:true,num:9})+
    '</g>'+
    '<g id="arco-flag" transform="translate('+(opts.lado==="der"?326:34)+' 232)">'+
      '<rect x="-1" y="-34" width="2" height="34" fill="#f4f4f4"/>'+
      '<polygon points="1,-34 20,-28 1,-21" fill="#f0c419"/>'+
    '</g>';
  }
  /* estadio: techo, dos bandejas, lienzos, publicidad, pasto de fondo */
  const lienzos='<g opacity=".92">'+
    '<rect x="22" y="84" width="74" height="20" fill="'+hc[0]+'"/><rect x="22" y="91" width="74" height="6" fill="'+(hc[1]||"#fff")+'"/>'+
    '<rect x="252" y="80" width="88" height="22" fill="'+(hc[1]||"#fff")+'"/><rect x="252" y="80" width="88" height="7" fill="'+hc[0]+'"/><rect x="252" y="95" width="88" height="7" fill="'+hc[0]+'"/>'+
  '</g>';
  const publi='<g id="arco-publi">'+
    '<rect x="-10" y="112" width="380" height="28" fill="#0b1220"/>'+
    '<rect x="-10" y="112" width="380" height="2" fill="#2b3a55"/>'+
    '<text x="180" y="131" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="12" letter-spacing="5" fill="#9fe7ff" opacity=".85">FUTBOLINI · FÚTBOL CHILENO · FUTBOLINI</text>'+
  '</g>';
  let pasto='';
  [240,222,206,193,182,173,166,160,154,149,145].reduce(function(prev,y,i){
    if(i%2) pasto+='<rect x="-10" y="'+y+'" width="380" height="'+(prev-y)+'" fill="#0d3d18" opacity=".17"/>';
    return y;
  });
  const spot=(modo==="penal")?'<ellipse cx="180" cy="226" rx="5" ry="1.8" fill="#fff" opacity=".9"/>':"";
  /* arco en perspectiva: marco adelante, fondo más chico hacia el punto de fuga */
  const bx0=69.5, bx1=290.5, by0=43.8, by1=154;
  const red=''+
    '<polygon points="'+bx0+','+by0+' '+bx1+','+by0+' '+bx1+','+by1+' '+bx0+','+by1+'" fill="url(#arcoMalla)"/>'+
    '<polygon points="50,38 '+bx0+','+by0+' '+bx0+','+by1+' 50,168" fill="url(#arcoMalla)" opacity=".85"/>'+
    '<polygon points="310,38 '+bx1+','+by0+' '+bx1+','+by1+' 310,168" fill="url(#arcoMalla)" opacity=".85"/>'+
    '<polygon points="50,38 310,38 '+bx1+','+by0+' '+bx0+','+by0+'" fill="url(#arcoMalla)" opacity=".7"/>'+
    '<polygon points="50,168 310,168 '+bx1+','+by1+' '+bx0+','+by1+'" fill="rgba(0,0,0,.14)"/>'+
    '<g stroke="rgba(200,212,226,.55)" stroke-width="1.1" fill="none">'+
      '<path d="M50,38 L'+bx0+','+by0+' L'+bx0+','+by1+' L50,168"/>'+
      '<path d="M310,38 L'+bx1+','+by0+' L'+bx1+','+by1+' L310,168"/>'+
      '<path d="M'+bx0+','+by1+' L'+bx1+','+by1+'"/>'+
    '</g>';
  return ''+
    '<defs>'+
      '<linearGradient id="arcoCielo" x1="0" y1="0" x2="0" y2="1">'+
        '<stop offset="0" stop-color="#050b18"/><stop offset="1" stop-color="#0d1c34"/>'+
      '</linearGradient>'+
      '<linearGradient id="arcoTribuna" x1="0" y1="0" x2="0" y2="1">'+
        '<stop offset="0" stop-color="#1a2233"/><stop offset="1" stop-color="#262e3c"/>'+
      '</linearGradient>'+
      '<linearGradient id="arcoPasto" x1="0" y1="0" x2="0" y2="1">'+
        '<stop offset="0" stop-color="#1f6b2e"/><stop offset=".35" stop-color="#2f8a3c"/><stop offset="1" stop-color="#3f9f47"/>'+
      '</linearGradient>'+
      '<linearGradient id="arcoPalo" x1="0" y1="0" x2="1" y2="0">'+
        '<stop offset="0" stop-color="#b9c6d4"/><stop offset=".35" stop-color="#ffffff"/><stop offset="1" stop-color="#8f9fb1"/>'+
      '</linearGradient>'+
      '<linearGradient id="arcoPaloH" x1="0" y1="0" x2="0" y2="1">'+
        '<stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e3eaf2"/><stop offset="1" stop-color="#8f9fb1"/>'+
      '</linearGradient>'+
      '<linearGradient id="arcoVolumen" x1="0" y1="0" x2="1" y2="0">'+
        '<stop offset="0" stop-color="rgba(255,255,255,.2)"/><stop offset=".45" stop-color="rgba(255,255,255,0)"/><stop offset="1" stop-color="rgba(0,0,0,.28)"/>'+
      '</linearGradient>'+
      '<radialGradient id="arcoFoco" cx=".5" cy=".5" r=".5">'+
        '<stop offset="0" stop-color="rgba(255,248,215,.55)"/><stop offset="1" stop-color="rgba(255,248,215,0)"/>'+
      '</radialGradient>'+
      '<radialGradient id="arcoVineta" cx=".5" cy=".62" r=".75">'+
        '<stop offset=".6" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,0,.42)"/>'+
      '</radialGradient>'+
      '<pattern id="arcoMalla" width="7" height="7" patternUnits="userSpaceOnUse">'+
        '<rect width="7" height="7" fill="rgba(215,230,245,.05)"/>'+
        '<path d="M0,3.5 L3.5,0 L7,3.5 L3.5,7 Z" fill="none" stroke="rgba(235,244,255,.42)" stroke-width=".55"/>'+
      '</pattern>'+
      _arcoHinchada({hinchada:hc})+
    '</defs>'+
    '<rect x="-20" y="-420" width="400" height="300" fill="url(#arcoCielo)"/>'+
    '<g id="arco-crowd">'+
      '<rect x="-20" y="-84" width="400" height="106" fill="url(#arcoTribuna)"/>'+
      '<rect class="arco-hinchas-a" x="-20" y="-80" width="400" height="98" fill="url(#arcoGenteLejos)" opacity=".62"/>'+
      '<rect x="-20" y="18" width="400" height="12" fill="#39414f"/>'+
      '<rect x="-20" y="28" width="400" height="84" fill="url(#arcoTribuna)"/>'+
      '<rect class="arco-hinchas-b" x="-20" y="30" width="400" height="82" fill="url(#arcoGenteCerca)" opacity=".86"/>'+
      '<rect class="arco-hinchas-c" x="-5" y="35" width="400" height="77" fill="url(#arcoGenteCerca2)" opacity=".5"/>'+
      lienzos+
    '</g>'+
    '<rect x="-20" y="-90" width="400" height="7" fill="#0a0f19"/>'+
    '<circle cx="44" cy="-100" r="40" fill="url(#arcoFoco)"/><circle cx="316" cy="-100" r="40" fill="url(#arcoFoco)"/>'+
    '<rect x="32" y="-104" width="24" height="8" rx="2" fill="#fff7d6"/><rect x="304" y="-104" width="24" height="8" rx="2" fill="#fff7d6"/>'+
    publi+
    '<rect x="-20" y="140" width="400" height="120" fill="url(#arcoPasto)"/>'+
    '<g>'+pasto+'</g>'+
    '<polygon points="50,168 310,168 350,196 10,196" fill="rgba(0,0,0,.10)"/>'+
    '<line x1="-20" y1="168" x2="380" y2="168" stroke="#fff" stroke-width="2" opacity=".85"/>'+
    '<line x1="-20" y1="195" x2="380" y2="195" stroke="#fff" stroke-width="2.2" opacity=".6"/>'+
    spot+
    red+
    '<rect id="arco-poste-izq" x="46" y="34" width="8" height="136" fill="url(#arcoPalo)"/>'+
    '<rect id="arco-poste-der" x="306" y="34" width="8" height="136" fill="url(#arcoPalo)"/>'+
    '<rect id="arco-travesano" x="46" y="32" width="268" height="8" fill="url(#arcoPaloH)"/>'+
    '<g id="arco-arq" transform="translate('+arqX+' 166) scale('+(modo==="penal"?1:0.86)+')" data-x="'+arqX+'" data-esc="'+(modo==="penal"?1:0.86)+'">'+
      '<g class="arq-idle">'+
        _figPersona({kit:kitArq, pose:"arq", piel:ARCO_PIELES[sem%ARCO_PIELES.length], pelo:ARCO_PELOS[(sem>>3)%ARCO_PELOS.length]})+
      '</g>'+
    '</g>'+
    wall+
    area+
    '<rect x="-20" y="-420" width="400" height="680" fill="url(#arcoVineta)" pointer-events="none"/>'+
    '<path id="arco-linea" d="M'+bolaX+','+bolaY+'" fill="none" stroke="#ffd54a" stroke-width="1.8" stroke-dasharray="5 5" stroke-linecap="round" opacity="0"/>'+
    '<g id="arco-mira" opacity="0" transform="translate(180 90)">'+
      '<circle r="5" fill="rgba(255,255,255,.35)" stroke="rgba(255,255,255,.7)" stroke-width=".8"/>'+
      '<circle class="mira-aro" r="11" fill="none" stroke="#ffd54a" stroke-width="2.2"/>'+
      '<path class="mira-aro" d="M-17,0 L-12,0 M12,0 L17,0 M0,-17 L0,-12 M0,12 L0,17" stroke="#ffd54a" stroke-width="2" stroke-linecap="round"/>'+
    '</g>'+
    '<ellipse id="arco-bola-sombra" cx="'+bolaX+'" cy="'+(bolaY+7)+'" rx="7" ry="2.6" fill="rgba(0,0,0,.35)"/>'+
    '<g id="arco-bola" data-s="1" transform="translate('+bolaX+' '+bolaY+')">'+
      '<circle r="8" fill="#fff" stroke="#2a2a2a" stroke-width="1"/>'+
      '<polygon points="0,-3.2 3,-1 1.9,2.6 -1.9,2.6 -3,-1" fill="#222"/>'+
      '<path d="M0,-3.2 L0,-7.6 M3,-1 L7.2,-2.4 M1.9,2.6 L4.4,6.3 M-1.9,2.6 L-4.4,6.3 M-3,-1 L-7.2,-2.4" stroke="#333" stroke-width=".9"/>'+
      '<circle r="8" fill="url(#arcoVolumen)"/>'+
    '</g>';
}
/* la tribuna es del que juega de local */
function _arcoHinchadaDe(P){
  const loc=P&&P.part&&P.part.local!==false;
  const id=loc?(typeof E!=="undefined"&&E&&E.club):(P&&P.part&&P.part.rivalId);
  return _kitDe(id, ["#c0392b","#f4f4f4"]);
}
/* el SVG ocupa todo el ancho siempre; lo que sobra de alto es tribuna */
function _arcoVista(svg){
  if(!svg||!svg.parentNode) return;
  const r=svg.parentNode.getBoundingClientRect();
  let W=360, H=240;
  if(r.width>0&&r.height>0){
    /* en celu (vertical) se acerca la cámara: el arco manda, no la tribuna */
    if(r.height/r.width>0.9) W=300;
    H=Math.max(240, Math.min(340, W*r.height/r.width));
  }
  /* 7.9037 · en PC la escena crecía sola (~1 px cada 250 ms): el alto del escenario seguía al
     dibujo y el dibujo se recalculaba con ese alto; el redondeo subía una décima por vuelta.
     El escenario toma el alto de su ancho (CSS) y acá se ignoran cambios chicos. */
  const vb=(svg.getAttribute("viewBox")||"").split(/\s+/).map(Number);
  if(vb.length===4 && vb[2]===W && Math.abs(vb[3]-H)<1.5) return;
  svg.setAttribute("viewBox",((360-W)/2)+" "+(240-H).toFixed(1)+" "+W+" "+H.toFixed(1));
}
function _arcoMontarSvg(esc, html){
  const NS="http://www.w3.org/2000/svg";
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 360 240"); svg.setAttribute("class","penal-svg arco-svg e3d-svg");
  svg.setAttribute("preserveAspectRatio","xMidYMax meet");
  svg.innerHTML=html;
  esc.world.appendChild(svg);
  _arcoVista(svg);
  if(typeof ResizeObserver==="function"){
    const ro=new ResizeObserver(function(){ if(!svg.isConnected){ ro.disconnect(); return; } _arcoVista(svg); });
    ro.observe(esc.stage);
  }
  return svg;
}
/* del dedo a coordenadas del SVG, respetando viewBox y letterbox */
function _arcoPunto(svg, ev){
  const cx=ev.touches?ev.touches[0].clientX:ev.clientX, cy=ev.touches?ev.touches[0].clientY:ev.clientY;
  const m=svg.getScreenCTM&&svg.getScreenCTM();
  if(m&&svg.createSVGPoint){
    const pt=svg.createSVGPoint(); pt.x=cx; pt.y=cy;
    const q=pt.matrixTransform(m.inverse());
    return {x:q.x, y:q.y};
  }
  const r=svg.getBoundingClientRect();
  return {x:(cx-r.left)*360/r.width, y:(cy-r.top)*240/r.height};
}
/* mira + trayectoria curva desde la pelota */
function _arcoMira(svg, aim, x0, y0){
  const mira=svg.querySelector("#arco-mira"), tray=svg.querySelector("#arco-linea");
  if(mira){
    mira.setAttribute("transform","translate("+aim.cx.toFixed(1)+" "+aim.cy.toFixed(1)+")");
    mira.setAttribute("opacity","1");
    [].forEach.call(mira.querySelectorAll(".mira-aro"),function(a){ a.setAttribute("stroke",aim.fuera?"#ff8a3d":"#ffd54a"); });
  }
  if(tray){
    const mx=(x0+aim.cx)/2, my=Math.min(y0,aim.cy)-34;
    tray.setAttribute("d","M"+x0+","+y0+" Q"+mx.toFixed(1)+","+my.toFixed(1)+" "+aim.cx.toFixed(1)+","+aim.cy.toFixed(1));
    tray.setAttribute("stroke",aim.fuera?"#ff8a3d":"#ffd54a");
    tray.setAttribute("opacity",".85");
  }
}
function _arcoOcultarMira(svg){
  const mira=svg.querySelector("#arco-mira"), tray=svg.querySelector("#arco-linea");
  if(mira) mira.setAttribute("opacity","0");
  if(tray) tray.setAttribute("opacity","0");
}
/* ¡Patear! apagado dice por qué: primero se apunta */
function _arcoBotonTiro(txt){
  const b=el("button","btn-aqua ancho verde",_tt("arco_apunta","Tocá el arco para apuntar"));
  b.disabled=true;
  b._listo=function(){ if(b.disabled){ b.disabled=false; b.textContent=txt; } };
  return b;
}
function _tt(k, fb){ return (typeof T==="function")?T(k,fb):fb; }
function _etiquetaArco(res){
  if(res==="gol") return {t:_tt("arco_gol","⚽ GOL"), cls:"gol"};
  if(res==="palo_in") return {t:_tt("arco_palo_in","⚽ PALO ADENTRO"), cls:"gol"};
  if(res==="palo") return {t:_tt("arco_palo","🪵 TRAVESAÑO"), cls:"palo"};
  if(res==="barrera") return {t:_tt("arco_barrera","🧱 LA BARRERA"), cls:"barrera"};
  if(res==="afuera") return {t:_tt("arco_afuera","↑ AFUERA"), cls:"afuera"};
  if(res==="defensa") return {t:_tt("arco_defensa","🛡️ DESPEJA"), cls:"defensa"};
  return {t:_tt("arco_ataja","🧤 ATAJADA"), cls:"ataja"};
}
function _hudArco(c, tipo, P){
  const hud=el("div","arco-hud");
  const lab=tipo==="penal"?_tt("arco_hud_pen","PENAL"):(tipo==="corner"?_tt("arco_hud_cor","CÓRNER"):_tt("arco_hud_tl","TIRO LIBRE"));
  const min=(P&&P.min!=null)?(P.min+"'"):"";
  hud.innerHTML='<span class="arco-badge">'+lab+'</span>'+(min?'<span class="arco-min">'+min+'</span>':"");
  c.appendChild(hud);
  return hud;
}
/* 7.9027 · el arquero se TIRA: gira desde la cadera, estira los brazos
   por sobre la cabeza y busca un punto. Si acertó el lado pero no llega,
   queda a centímetros (la pelota entra por el guante, no por magia). */
function _arqPose(arqEl, x, y, esc, rot, brazo){
  arqEl.setAttribute("transform","translate("+x.toFixed(1)+" "+y.toFixed(1)+") scale("+esc+") rotate("+rot.toFixed(1)+" 0 -46)");
  const bi=arqEl.querySelector("#arco-brazo-izq"), bd=arqEl.querySelector("#arco-brazo-der");
  if(bi) bi.setAttribute("transform","rotate("+brazo.toFixed(1)+" -14 -76)");
  if(bd) bd.setAttribute("transform","rotate("+(-brazo).toFixed(1)+" 14 -76)");
}
/* dónde queda el guante (respecto de la cadera) con el brazo levantado */
function _arqGuanteLocal(lado, brazo){
  const s=lado==="izq"?-1:1, a=(lado==="izq"?brazo:-brazo)*Math.PI/180;
  const hx=s*28-s*14, hy=-50+76;
  return {x:s*14+hx*Math.cos(a)-hy*Math.sin(a), y:-76+hx*Math.sin(a)+hy*Math.cos(a)+46};
}
function _arqDestino(arqEl, kdir, opts){
  const x0=parseFloat(arqEl.getAttribute("data-x"))||180, esc=parseFloat(arqEl.getAttribute("data-esc"))||1;
  const aim=opts.aim, cad={x:x0, y:166-46*esc};
  let tx, ty;
  if(kdir==="centro"){
    if(aim&&aim.tercio==="centro"){ tx=aim.cx; ty=aim.cy; }
    else { tx=x0; ty=70; }
  } else if(aim&&aim.tercio===kdir&&!aim.fuera){ tx=aim.cx; ty=aim.cy; }
  else { tx=kdir==="izq"?64:296; ty=(aim&&aim.cy!=null)?aim.cy:(60+Math.random()*80); }
  const brazo=kdir==="centro"?128:150;
  const lado=kdir==="der"||(kdir==="centro"&&tx>x0)?"der":"izq";
  const gl=_arqGuanteLocal(lado, brazo);
  const vx=tx-cad.x, vy=ty-cad.y, d=Math.hypot(vx,vy)||1;
  /* girar el cuerpo para que el guante (no la cabeza) apunte a la pelota */
  let rot=(Math.atan2(vx,-vy)-Math.atan2(gl.x,-gl.y))*180/Math.PI;
  if(rot>180) rot-=360; if(rot<-180) rot+=360;
  const tope=kdir==="centro"?24:112;
  rot=Math.max(-tope,Math.min(tope,rot));
  const alcance=Math.hypot(gl.x,gl.y)*esc, corto=(!opts.ataja&&aim&&kdir===aim.tercio)?18:0;
  const mov=Math.max(0,Math.min(kdir==="centro"?14:90, d-alcance-corto));
  return {x0:x0, y0:166, esc:esc, dx:vx/d*mov, dy:vy/d*mov, rot:rot, brazo:brazo};
}
function _animArq(arqEl, kdir, ms, opts){
  if(!arqEl) return;
  opts=opts||{};
  const idle=arqEl.querySelector(".arq-idle");
  if(idle) idle.classList.add("arq-vuela");
  const D=_arqDestino(arqEl, kdir, opts);
  const quieto=(typeof document!=="undefined")&&document.body&&document.body.classList.contains("perf");
  if(quieto||typeof requestAnimationFrame!=="function"){ _arqPose(arqEl, D.x0+D.dx, D.y0+D.dy, D.esc, D.rot, D.brazo); return; }
  const t0=performance.now();
  (function paso(t){
    const u=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-u,2.6);
    const salto=kdir==="centro"?0:-Math.sin(u*Math.PI)*10;
    _arqPose(arqEl, D.x0+D.dx*e, D.y0+D.dy*e+salto, D.esc, D.rot*e, D.brazo*Math.min(1,u*1.6));
    if(u<1) requestAnimationFrame(paso);
  })(performance.now());
}
function _botonesEfecto(c, inicial){
  let efecto=inicial||"colocado";
  const efRow=el("div","penal-ef");
  [["colocado",_tt("arco_colocado","Colocado"),"equilibrado, lo más seguro"],
   ["potente",_tt("arco_potente","Potente"),"más difícil de atajar"],
   ["picadita",_tt("arco_picadita","Picadita"),"mata al que se tira; muerte si se queda"]].forEach(function(row){
    const k=row[0], t=row[1], d=row[2];
    const b=el("button","btn-aqua chico"+(efecto===k?"":" gris"),t); b.title=d;
    b.onclick=function(){ efecto=k; [].forEach.call(efRow.children,function(x){ x.classList.add("gris"); }); b.classList.remove("gris"); };
    efRow.appendChild(b);
  });
  c.appendChild(efRow);
  return function(){ return efecto; };
}
/* 7.9024 · la cancha ES la decisión. Sin formulario a un costado. */
function _abrirEscenaArco(box, tit, ic){
  box.classList.add("ventana-so","escena-3d");
  const cuerpo=(typeof montarBarraSO==="function")
    ? montarBarraSO(box, tit, ic, null)
    : (function(){ box.appendChild(el("div","cab",'<span class="ic">'+ic+'</span><span>'+tit+'</span>')); const x=el("div","cuerpo"); box.appendChild(x); return x; })();
  cuerpo.classList.add("penal-mini","arco-vivo","e3d-cuerpo");
  const min=box.querySelector(".so-btn.min"), max=box.querySelector(".so-btn.max");
  if(min) min.style.display="none";
  if(max) max.style.display="none";
  const stage=el("div","e3d-stage");
  const world=el("div","e3d-world");
  stage.appendChild(world);
  return {cuerpo:cuerpo, stage:stage, world:world};
}
function _chipsPateador(host, lista, actual, onPick){
  let cur=actual;
  if(!lista||!lista.length) return {get:function(){ return cur; }};
  const row=el("div","e3d-chips");
  lista.forEach(function(j){
    if(!j) return;
    const spec=j.rasgos&&(j.rasgos.indexOf("penales")>=0||j.rasgos.indexOf("tiro libre")>=0||j.rasgos.indexOf("juego aéreo")>=0);
    const ape=(j.n||"").split(" ").slice(-1)[0]||j.n;
    const b=el("button","e3d-chip"+(cur&&j.n===cur.n?" on":""), ape+(spec?" ★":""));
    b.type="button";
    b.title=(j.n||"")+" · nivel "+(j.nivel||"?");
    b.onclick=function(ev){ if(ev) ev.stopPropagation(); cur=j; [].forEach.call(row.querySelectorAll(".e3d-chip"),function(x){ x.classList.remove("on"); }); b.classList.add("on"); if(onPick) onPick(j); };
    row.appendChild(b);
  });
  host.appendChild(row);
  return {get:function(){ return cur; }};
}
function minijuegoPenal(P,pateador,opts){
  opts=opts||{};
  const arq=arqueroDe(P.rivalPlantel)||{n:"el arquero",nivel:70};
  const kit=_kitDe(P.part&&P.part.rivalId, ["#1a6ad4","#111827"]);
  let aim=null, tirado=false;
  const hinchada=_arcoHinchadaDe(P);
  modal(box=>{
    const esc=_abrirEscenaArco(box, opts.tanda?_tt("tanda_tit","Tanda · tu penal"):_tt("arco_pen_tit","Penal"), "🥅");
    const c=esc.cuerpo;
    _hudArco(c,"penal",P);
    let pat=pateador;
    const cands=(opts.cands&&opts.cands.length)?opts.cands:[pateador];
    const chips=_chipsPateador(c, cands, pateador, function(j){ pat=j; etiq.innerHTML="Patea <b>"+j.n+"</b>. Arrastrá al rincón y soltá."; });
    const etiq=el("p","mini e3d-etiq","Patea <b>"+pateador.n+"</b> ante <b>"+arq.n+"</b>. Arrastrá al arco y soltá. El centro flojo se ataja.");
    c.appendChild(etiq);
    c.appendChild(esc.stage);
    const svg=_arcoMontarSvg(esc, htmlArcoVivo({arqX:180, modo:"penal", kitArq:kit, hinchada:hinchada, semilla:P.part&&P.part.rivalId}));
    const bolaG=svg.querySelector("#arco-bola");
    const arqEl=svg.querySelector("#arco-arq");
    function aSVG(ev){ return _arcoPunto(svg, ev); }
    function marcar(pt){
      if(tirado) return;
      aim=penZona(pt.x,pt.y);
      _arcoMira(svg, aim, 180, 220);
      bpat._listo();
      etiq.textContent=aim.fuera?"Cuidado: vas demasiado arriba o afuera.":
        ("Apuntas al "+(aim.alt==="alto"?"alto del ":"")+(aim.tercio==="centro"?"centro":"rincón "+aim.tercio)+".");
    }
    svg.addEventListener("pointerdown",e=>{ e.preventDefault(); marcar(aSVG(e)); });
    svg.addEventListener("pointermove",e=>{ if(e.buttons||e.pressure){ e.preventDefault(); marcar(aSVG(e)); } });
    const pie=(typeof montarPieSO==="function")?montarPieSO(box):c;
    const getEf=_botonesEfecto(c,"colocado");
    const bpat=_arcoBotonTiro("¡Patear!");
    function disparar(){
      if(!aim||tirado) return; tirado=true; bpat.disabled=true;
      pateador=chips.get()||pat||pateador;
      const kdir=penArqueroTira(aim,arq.nivel||70);
      const out=penResolver(aim,kdir,getEf(),pateador.nivel||70,arq.nivel||70);
      _arcoOcultarMira(svg); _animArq(arqEl, kdir, 420, {ataja:out.res==="atajado", aim:aim});
      const paloX=aim.tercio==="izq"?50:(aim.tercio==="der"?310:180);
      const destY=out.res==="afuera"?16:(out.res==="palo"?38:aim.cy);
      const destX=out.res==="palo"?paloX:aim.cx;
      function fin(){
        const lab=_etiquetaArco(out.res);
        etiq.innerHTML="";
        const ban=el("div","arco-res "+lab.cls); ban.textContent=lab.t;
        c.insertBefore(ban, etiq);
        if((out.res==="gol"||out.res==="palo_in") && svg) svg.classList.add("arco-golazo");
        if(out.res==="palo" && svg) svg.classList.add("arco-alpalo");
        setTimeout(()=>{
          cerrarModal();
          const esGol=out.res==="gol"||out.res==="palo_in";
          if(typeof opts.onRes==="function"){ opts.onRes(esGol); return; }
          const forz=esGol?true:(out.res==="afuera"?"afuera":(out.res==="palo"?"palo":false));
          penalEnPartido(P,true,null,pateador,forz);
          pintarPartido(); reanudarPronto();
        },820);
      }
      _animBola(bolaG,180,220,destX,destY,480,function(){
        if(out.res==="palo"){
          _rebotePalo(svg, bolaG, destX, destY, aim, getEf(), function(entra){
            if(entra) out.res="palo_in";
            fin();
          });
          return;
        }
        fin();
      });
    }
    svg.addEventListener("pointerup",function(e){ e.preventDefault(); if(aim&&!tirado) disparar(); });
    bpat.onclick=disparar;
    pie.appendChild(bpat);
  },{cerrarFuera:false});
  return true;
}
function minijuegoTiroLibre(P){
  const j=((typeof pateadorDe==="function")?pateadorDe(P.once):(P.once&&P.once[0]))||{n:"el tirador",nivel:70,rasgos:[]};
  const kp=Math.random()<0.5?0:1;
  const arqX=kp?236:124;
  const kit=_kitDe(P.part&&P.part.rivalId, ["#1a6ad4","#111827"]);
  const kitAtk=_kitDe(typeof E!=="undefined"&&E&&E.club, ["#f4f4f4","#111111"]);
  let aim=null, tirado=false;
  modal(box=>{
    const esc=_abrirEscenaArco(box, _tt("arco_tl_tit","Tiro libre"), "🎯");
    const c=esc.cuerpo;
    _hudArco(c,"tl",P);
    const etiq=el("p","mini e3d-etiq","Patea <b>"+j.n+"</b>. La barrera tapa el centro bajo. Arrastrá por arriba o al costado y soltá.");
    c.appendChild(etiq);
    c.appendChild(esc.stage);
    const svg=_arcoMontarSvg(esc, htmlArcoVivo({barrera:true, arqX:arqX, modo:"tl", kitArq:kit, kitWall:kit, kitAtk:kitAtk, hinchada:_arcoHinchadaDe(P), semilla:P.part&&P.part.rivalId}));
    const bolaG=svg.querySelector("#arco-bola");
    const arqEl=svg.querySelector("#arco-arq");
    const wall=svg.querySelector("#arco-wall");
    function aSVG(ev){ return _arcoPunto(svg, ev); }
    function marcar(pt){
      if(tirado) return;
      const z=penZona(pt.x,pt.y);
      aim={x:z.cx,y:z.cy,cx:z.cx,cy:z.cy,fuera:z.fuera,tercio:z.tercio,alt:z.alt};
      _arcoMira(svg, aim, 180, 220);
      bpat._listo();
      const pre=tlClasificar(aim);
      etiq.textContent=pre.res==="barrera"?"Ahí te come la barrera.":(aim.fuera?"Vas afuera.":"Apuntas ahí. Dale a ¡Patear!");
    }
    svg.addEventListener("pointerdown",e=>{ e.preventDefault(); marcar(aSVG(e)); });
    svg.addEventListener("pointermove",e=>{ if(e.buttons||e.pressure){ e.preventDefault(); marcar(aSVG(e)); } });
    const pie=(typeof montarPieSO==="function")?montarPieSO(box):c;
    const getEf=_botonesEfecto(c,"colocado");
    const bpat=_arcoBotonTiro("¡Patear!");
    const bcorto=el("button","btn-aqua chico gris","En corto");
    bcorto.onclick=function(){ if(tirado) return; tirado=true; cerrarModal(); if(typeof linea==="function") linea(P,P.min,"La juegan en corto y rearman con paciencia."); pintarPartido(); reanudarPronto(); };
    function dispararTL(){
      if(!aim||tirado) return; tirado=true; bpat.disabled=true; _arcoOcultarMira(svg);
      const cl=tlClasificar(aim);
      let res=cl.res, motivo=cl.motivo||"";
      const arq=arqueroDe(P.rivalPlantel)||{n:"el arquero",nivel:70};
      if(res==="arco"){
        const kdir=penArqueroTira(aim,arq.nivel||70);
        const spec=(j.rasgos&&j.rasgos.indexOf("tiro libre")>=0);
        const ef=getEf();
        const out=penResolver(aim,kdir,spec?"potente":ef,(j.nivel||70)+(spec?6:0),arq.nivel||70);
        res=out.res==="gol"?"gol":(out.res==="palo"?"palo":(out.res==="afuera"?"afuera":"atajado"));
        _animArq(arqEl, kdir, 420, {ataja:res==="atajado", aim:aim});
      } else if(res==="barrera"){
        if(wall){
          wall.querySelectorAll(".arco-muro").forEach(function(g,i){
            g.style.transition="transform .28s cubic-bezier(.2,.9,.3,1)";
            g.style.transform="translateY(-18px)";
            setTimeout(function(){ g.style.transform="translateY(0)"; }, 320+i*30);
          });
        }
      }
      const destY=(res==="afuera"||res==="palo")?14:(res==="barrera"?aim.cy+28:aim.cy);
      const destX=res==="barrera"?aim.cx+(aim.cx>180?-18:18):(res==="palo"?(aim.tercio==="izq"?50:(aim.tercio==="der"?310:aim.cx)):aim.cx);
      _animBola(bolaG,180,220,destX,destY,460,function(){
        if(res==="palo"){
          _rebotePalo(svg, bolaG, destX, destY, aim, (typeof getEf==="function"?getEf():"colocado"), function(entra){
            if(entra){ res="palo_in"; motivo="El palo la manda adentro."; }
            pintarResTL();
          });
          return;
        }
        pintarResTL();
      });
      function pintarResTL(){
        const lab=_etiquetaArco(res);
        etiq.innerHTML="";
        const ban=el("div","arco-res "+lab.cls); ban.textContent=lab.t+(motivo?" · "+motivo.replace(/\.$/,""):"");
        c.insertBefore(ban, etiq);
        if(res==="gol"||res==="palo_in") svg.classList.add("arco-golazo");
        setTimeout(function(){
          cerrarModal();
          if(res==="gol"||res==="palo_in"){
            j.goles++; P.goleadores.push(j.n);
            if(typeof regGol==="function") regGol(P,P.min,j.n,true,"tiro libre");
            if(P.part.local)P.gl++; else P.gv++;
            if(typeof linea==="function") linea(P,P.min,(res==="palo_in"?"¡PALO ADENTRO de ":"¡GOLAZO de tiro libre de ")+j.n+"! "+((typeof marcadorTxt==="function")?marcadorTxt(P):""),"gol");
          } else if(typeof linea==="function"){
            const txt=res==="barrera"?("Tiro libre de "+j.n+": la barrera la desvía.")
              :(res==="palo"?("Tiro libre de "+j.n+" al travesaño.")
              :(res==="afuera"?("Tiro libre de "+j.n+" por arriba del arco.")
              :("Tiro libre de "+j.n+": el arquero la saca.")));
            linea(P,P.min,txt);
          }
          pintarPartido(); reanudarPronto();
        },820);
      }
    }
    svg.addEventListener("pointerup",function(e){ e.preventDefault(); if(aim&&!tirado) dispararTL(); });
    bpat.onclick=dispararTL;
    pie.appendChild(bcorto);
    pie.appendChild(bpat);
  },{cerrarFuera:false});
  return true;
}
function minijuegoCorner(P){
  const j=((E.tactica&&E.tactica.corner&&P.once&&P.once.find(function(x){ return x.n===E.tactica.corner; }))
    || (P.once&&P.once.filter(function(x){ return x.rasgos&&x.rasgos.indexOf("juego aéreo")>=0; })[0])
    || (P.once&&P.once.filter(function(x){ return x.pos==="DEL"||x.pos==="MED"; })[0])
    || (P.once&&P.once[0])
    || {n:"el cabeceador",nivel:70,rasgos:[]});
  const lado=Math.random()<0.5?"izq":"der";
  const bolaX=lado==="izq"?40:320;
  const kit=_kitDe(P.part&&P.part.rivalId, ["#c0392b","#1a1a28"]);
  const kitAtk=_kitDe(typeof E!=="undefined"&&E&&E.club, ["#f4f4f4","#111111"]);
  const arqX=lado==="izq"?236:124;
  let aim=null, tirado=false;
  modal(box=>{
    const esc=_abrirEscenaArco(box, _tt("arco_cor_tit","Córner"), "🚩");
    const c=esc.cuerpo;
    _hudArco(c,"corner",P);
    const etiq=el("p","mini e3d-etiq","Cobra <b>"+(j.n)+"</b>. Arrastrá el centro: primer palo, punto penal o segundo palo. Soltá para cobrar.");
    c.appendChild(etiq);
    c.appendChild(esc.stage);
    const svg=_arcoMontarSvg(esc, htmlArcoVivo({modo:"corner", arqX:arqX, kitArq:kit, kitWall:kit, kitAtk:kitAtk, bolaX:bolaX, bolaY:222, lado:lado, hinchada:_arcoHinchadaDe(P), semilla:P.part&&P.part.rivalId}));
    const bolaG=svg.querySelector("#arco-bola");
    const arqEl=svg.querySelector("#arco-arq");
    function aSVG(ev){ return _arcoPunto(svg, ev); }
    function marcar(pt){
      if(tirado) return;
      const z=penZona(pt.x,pt.y);
      aim={cx:z.cx,cy:z.cy,fuera:z.fuera,tercio:z.tercio,alt:z.alt};
      _arcoMira(svg, aim, bolaX, 222);
      bpat._listo();
      const pre=cornerClasificar(aim);
      etiq.textContent=pre.res==="defensa"?"Muy bajo: el primero la saca.":
        (pre.res==="afuera"?"Se va larga.":
        ("Centro al "+(pre.zona==="primer"?"primer palo":pre.zona==="segundo"?"segundo palo":"punto penal")+"."));
    }
    svg.addEventListener("pointerdown",e=>{ e.preventDefault(); marcar(aSVG(e)); });
    svg.addEventListener("pointermove",e=>{ if(e.buttons||e.pressure){ e.preventDefault(); marcar(aSVG(e)); } });
    const pie=(typeof montarPieSO==="function")?montarPieSO(box):c;
    const bpat=_arcoBotonTiro("¡Cobrar!");
    const bcorto=el("button","btn-aqua chico gris","En corto");
    bcorto.onclick=function(){ if(tirado) return; tirado=true; cerrarModal(); if(typeof linea==="function") linea(P,P.min,"Córner en corto. Rearman sin apuro."); pintarPartido(); reanudarPronto(); };
    function dispararCor(){
      if(!aim||tirado) return; tirado=true; bpat.disabled=true; _arcoOcultarMira(svg);
      const cl=cornerClasificar(aim);
      let res=cl.res, motivo=cl.motivo||"";
      const arq=arqueroDe(P.rivalPlantel)||{n:"el arquero",nivel:70};
      if(res==="aire"){
        const kdir=penArqueroTira(aim,arq.nivel||70);
        const iner=((P.iner&&P.iner.cor)||0);
        const out=cornerResolver(cl.zona, j, arq, iner);
        res=out.res;
        if(res==="atajado"||res==="palo") _animArq(arqEl, kdir, 380, {ataja:res==="atajado", aim:aim});
        const atks=svg.querySelectorAll(".arco-atk");
        if(atks&&atks.length){
          const tgt=atks[cl.zona==="primer"?0:(cl.zona==="segundo"?1:2)]||atks[0];
          tgt.style.transition="transform .32s cubic-bezier(.2,.9,.3,1)";
          tgt.style.transform="translateY(-22px)";
        }
      } else if(res==="defensa"){
        const defs=svg.querySelectorAll(".arco-def");
        if(defs&&defs[0]){
          defs[0].style.transition="transform .28s ease-out";
          defs[0].style.transform="translateY(-10px)";
        }
      }
      const destY=(res==="afuera")?12:(res==="defensa"?aim.cy+20:(res==="palo"?38:aim.cy));
      const destX=res==="palo"?(cl.zona==="primer"?54:(cl.zona==="segundo"?306:aim.cx)):aim.cx;
      function finCor(){
        const lab=_etiquetaArco(res);
        etiq.innerHTML="";
        const ban=el("div","arco-res "+lab.cls); ban.textContent=lab.t+(motivo?" · "+motivo.replace(/\.$/,""):"");
        c.insertBefore(ban, etiq);
        if(res==="gol"||res==="palo_in") svg.classList.add("arco-golazo");
        if(res==="palo") svg.classList.add("arco-alpalo");
        setTimeout(function(){
          cerrarModal();
          if(res==="gol"||res==="palo_in"){
            j.goles=(j.goles||0)+1; P.goleadores.push(j.n);
            if(typeof regGol==="function") regGol(P,P.min,j.n,true,"cabeza");
            if(P.part.local)P.gl++; else P.gv++;
            if(typeof linea==="function") linea(P,P.min,(res==="palo_in"?"¡PALO ADENTRO de cabeza de ":"¡GOL de cabeza de córner de ")+j.n+"! "+((typeof marcadorTxt==="function")?marcadorTxt(P):""),"gol");
          } else if(typeof linea==="function"){
            const txt=res==="defensa"?("Córner: el primero despeja el centro de "+j.n+".")
              :(res==="afuera"?("Córner de "+j.n+": el centro se fue largo.")
              :(res==="palo"?("Córner de "+j.n+": el cabezazo se estrella en el palo.")
              :("Córner de "+j.n+": el arquero se queda con la pelota.")));
            linea(P,P.min,txt);
          }
          pintarPartido(); reanudarPronto();
        },820);
      }
      _animBola(bolaG,bolaX,222,destX,destY,520,function(){
        if(res==="palo"){
          _rebotePalo(svg, bolaG, destX, destY, aim, "colocado", function(entra){
            if(entra){ res="palo_in"; motivo="El palo la manda adentro."; }
            finCor();
          });
          return;
        }
        finCor();
      });
    }
    svg.addEventListener("pointerup",function(e){ e.preventDefault(); if(aim&&!tirado) dispararCor(); });
    bpat.onclick=dispararCor;
    pie.appendChild(bcorto);
    pie.appendChild(bpat);
  },{cerrarFuera:false});
  return true;
}
function centroTiroLibre(P){
  /* 6.7 · el ejecutante de tiro libre designado tira si está en cancha */
  const desTL=E.tactica&&E.tactica.tiroLibre&&P.once.find(j=>j.n===E.tactica.tiroLibre);
  const ejecuta=desTL||P.once.filter(j=>j.rasgos&&(j.rasgos.includes("tiro libre")||j.rasgos.includes("desequilibrio")))[0];
  const aereo=P.once.filter(j=>j.rasgos&&j.rasgos.includes("juego aéreo"))[0]||elige(P.once.filter(j=>j.pos==="DEF"||j.pos==="DEL"))||P.once[0];
  if(ejecuta&&ejecuta.rasgos&&ejecuta.rasgos.includes("tiro libre")){
    linea(P,P.min,"Tiro libre para "+ejecuta.n+", especialista, se para sobre la pelota…");
    const pd=clamp(0.16+(ejecuta.nivel-70)/200,0.08,0.30);
    if(Math.random()<pd){ ejecuta.goles++; P.goleadores.push(ejecuta.n); regGol(P,P.min,ejecuta.n,true,"tiro libre"); if(P.part.local)P.gl++;else P.gv++;
      linea(P,P.min,"¡GOLAZO de tiro libre de "+ejecuta.n+"! "+marcadorTxt(P),"gol"); return; }
  }
  linea(P,P.min,"Centro al área"+(ejecuta?" de "+ejecuta.n:"")+", sube "+(aereo?aereo.n:"la defensa")+" a cabecear…");
  const prob=clamp(0.14+((aereo&&aereo.rasgos&&aereo.rasgos.includes("juego aéreo"))?0.10:0),0.06,0.28);
  if(Math.random()<prob){ if(aereo){aereo.goles++;P.goleadores.push(aereo.n);regGol(P,P.min,aereo.n,true,"cabeza"); if(aereo.pos==="DEF"&&typeof desbloquear==="function") desbloquear("gol_defensa");} if(P.part.local)P.gl++;else P.gv++;
    linea(P,P.min,"¡Gol de cabeza"+(aereo?" de "+aereo.n:"")+"! "+marcadorTxt(P),"gol"); }
  else linea(P,P.min,"Despeja la defensa rival de cabeza.");
}
function mostrarAccion(ev){
  const P=P_ACTUAL;
  if(P){ P._holdKind="accion"; P._holdEv=ev; }
  let titulo="", opciones=[];
  if(ev.tipo==="penal"){
    if(P){ P._penalCancha=1; P._penalSeq=(P._penalSeq||0)+1; }
    if(P && P.modo==="dirigir"){
      const lista=candidatosPenal(P);
      return minijuegoPenal(P, (lista&&lista[0])||{n:"el pateador",nivel:70}, {cands:lista});
    }
    titulo="¡Penal a favor! ¿Quién patea?";
    opciones=candidatosPenal(P).map(j=>({t:j.n+" · "+((j.rasgos&&j.rasgos.includes("penales"))?"especialista":"nivel "+j.nivel),
      run:()=> P.modo==="dirigir" ? minijuegoPenal(P,j) : penalEnPartido(P,true,null,j)}));
  } else if(ev.tipo==="tiroLibre"){
    if(P && P.modo==="dirigir") return minijuegoTiroLibre(P);
    titulo="Tiro libre peligroso";
    opciones=[
      {t:"⚽ Pegarle yo (dibujar el remate)",run:()=> P.modo==="dirigir" ? minijuegoTiroLibre(P) : tiroLibreAuto(P)},
      {t:"Al arco, que salga solo",run:()=>tiroLibreAuto(P)},
      {t:"Centro al área",run:()=>centroTiroLibre(P)},
      {t:"Jugarla en corto, sin riesgo",run:()=>linea(P,P.min,"La juegan en corto y rearman con paciencia.")}
    ];
  } else if(ev.tipo==="corner"){
    if(P && P.modo==="dirigir") return minijuegoCorner(P);
    titulo="Córner a favor";
    opciones=[
      {t:"🚩 Cobrar yo (dibujar el centro)",run:()=> P.modo==="dirigir" ? minijuegoCorner(P) : (typeof centroCorner==="function"?centroCorner(P):null)},
      {t:"Centro al área, que salga solo",run:()=> (typeof centroCorner==="function"?centroCorner(P):linea(P,P.min,"Centro al área."))},
      {t:"Corto, armar de nuevo",run:()=>linea(P,P.min,"Córner en corto. Rearman sin apuro.")}
    ];
  } else { /* lesión */
    const j=lesionEnPartido(P);
    titulo="Lesión de "+(j?j.n:"un jugador");
    opciones=[
      {t:"Meter un recambio fresco",run:()=>{ P.empuje+=0.2; linea(P,P.min,"Entra sangre nueva por el lesionado."); }},
      {t:"Aguantar y reordenar",run:()=>{ P.orden+=1; P.cansancio+=0.6; linea(P,P.min,"El equipo se reacomoda con lo puesto."); }}
    ];
  }
  const p=panel(titulo,"⚡","alerta");
  p.classList.add("momento-vivo");
  document.body.classList.add("hay-momento");
  const ops=el("div","ops ops-part"); MOMENTO_OPS=[];
  opciones.forEach((o,i)=>{
    const b=el("button","op");
    b.innerHTML='<div class="t"><span class="tecla">'+(i+1)+'</span> '+o.t+'</div>';
    b.onclick=()=>{ MOMENTO_OPS=[]; const async=o.run(); if(!async){ pintarPartido(); reanudarPronto(); } };
    ops.appendChild(b); MOMENTO_OPS.push(b);
  });
  p.cuerpo.appendChild(ops);
  p.cuerpo.appendChild(el("p","mini hint-teclado","Elige con 1 / 2 / 3 · flechas y Enter."));
  (document.querySelector(".partido-wrap")||$("#vista")).appendChild(p);
  try{ p.scrollIntoView({block:"end",behavior:"instant"}); }catch(e){ try{ p.scrollIntoView(false); }catch(e2){} }
}
function hitosPartido(res){
  const h=[], yo=res.yo, otro=res.otro, dif=Math.abs(yo-otro);
  if(yo>=5) h.push("🎩 Manita: "+yo+" goles en un partido.");
  else if(dif>=4&&yo>otro) h.push("💥 Goleada histórica.");
  if(yo>0&&otro===0) h.push("🧤 Valla invicta.");
  const cuenta={};
  (res.golesDetalle||[]).forEach(g=>{ if(g.propio) cuenta[g.quien]=(cuenta[g.quien]||0)+1; });
  for(const k in cuenta){ if(cuenta[k]>=3) h.push("⚽ ¡Hat-trick de "+k+"!"); else if(cuenta[k]===2) h.push("⚽ Doblete de "+k+"."); }
  (res.golesDetalle||[]).forEach(g=>{ if(g.propio&&(cuenta[g.quien]||0)<2){ const j=E.plantel.find(x=>x.n===g.quien); if(j&&j.edad<=20) h.push("🌱 Gol del juvenil "+j.n+" ("+j.edad+" años)."); } });
  return h;
}
function cerrarPartido(){
  const P=P_ACTUAL; if(!P||P.cerrado) return;
  P.cerrado=true; clearInterval(TIMER); MOMENTO_OPS=[];
  P._holdUI=null; P._holdKind=null; P._holdEv=null;
  if(typeof quitarHoldBar==="function") quitarHoldBar();
  document.body.classList.remove("hay-momento");
  if(typeof detenerCancha==="function") detenerCancha();
  const res=terminarPartido(P);
  if(typeof persistirTicker==="function") persistirTicker(P,res);  /* 7.12 · el partido queda en el feed de Plop! */
  const ganoPens=res.penales && res.penales.gano;
  const perdioPens=res.penales && !res.penales.gano;
  const gano=ganoPens || res.yo>res.otro;
  const p=panel("Final del partido","📄",gano?"":"alerta");
  const tit=res.penales
    ? ((ganoPens?"Victoria":"Derrota")+" en penales "+res.yo+"-"+res.otro+" ("+res.penales.yo+"-"+res.penales.el+") ante "+P.part.rivalNombre)
    : ((gano?"Victoria ":(res.yo<res.otro?"Derrota ":"Empate "))+res.yo+"-"+res.otro+" ante "+P.part.rivalNombre);
  p.cuerpo.appendChild(el("h2","tit",tit));

  /* caja de resumen: goles con minuto, tarjetas, lesiones */
  const cajita=el("div","resul mitad");
  let html="";
  const goles=(res.golesDetalle||[]).slice().sort((a,b)=>a.min-b.min);
  if(goles.length) html+="<b>Goles</b><br>"+goles.map(g=>g.min+"' "+(g.propio?"":"("+P.part.rivalNombre+") ")+g.quien+
    (g.tipo&&g.tipo!=="jugada"?" <span class='mini'>["+g.tipo+"]</span>":"")+
    (g.asist?" <span class='mini'>(asist. "+g.asist+")</span>":"")).join("<br>")+"<br>";
  else html+="<b>Sin goles.</b><br>";
  if(res.tarjetas&&res.tarjetas.length) html+="<span class='mini'>Amarillas: "+res.tarjetas.join(", ")+"</span><br>";
  if(res.lesionados&&res.lesionados.length) html+="<span class='mini'>Lesionados: "+res.lesionados.join(", ")+"</span><br>";
  if(res.penales) html+="<b>Penales:</b> "+res.penales.yo+"-"+res.penales.el+(res.penales.gano?" · pasamos":" · fuera")+"<br>";
  cajita.innerHTML=html;
  p.cuerpo.appendChild(cajita);

  /* hitos / efemérides */
  const hitos=hitosPartido(res);
  if(hitos.length) p.cuerpo.appendChild(el("div","resul "+(gano?"bien":"mitad"),hitos.join("<br>")));

  if(P.part.local) p.cuerpo.appendChild(fila("Público / taquilla",res.gente.toLocaleString("es-CL")+" personas · "+plata(res.caja)));

  /* salto de posición + otros resultados de la fecha (solo liga) */
  if(res.esLiga){
    if(res.posAntes&&res.posDespues){
      const delta=res.posAntes-res.posDespues;
      p.cuerpo.appendChild(fila("Posición en la tabla",ordinal(res.posDespues)+(delta>0?" ▲ (subiste "+delta+")":(delta<0?" ▼ (bajaste "+(-delta)+")":" (sin cambios)"))));
    }
    if(E.ultimaFecha&&E.ultimaFecha.length){
      p.cuerpo.appendChild(el("h3","sub","Otros resultados de la fecha"));
      E.ultimaFecha.forEach(r=>p.cuerpo.appendChild(el("div","fila","<span>"+r.a+"</span><b>"+r.ga+" - "+r.gb+"</b><span>"+r.b+"</span>")));
    }
    /* mini tabla en vivo: top 5 + tu posición */
    const arr=tablaOrdenada();
    const t=el("table"); t.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>Pts</th></tr></thead>";
    const tb=el("tbody");
    arr.forEach((c,i)=>{ if(i<5||c.id===E.club) tb.appendChild(el("tr",c.id===E.club?"yo":"", "<td class='n'>"+(i+1)+"</td><td>"+c.n+"</td><td class='n'>"+c.pj+"</td><td class='n'>"+c.pts+"</td>")); });
    t.appendChild(tb);
    p.cuerpo.appendChild(el("h3","sub","Tabla al día")); p.cuerpo.appendChild(t);
  }

  if(P.part.real){
    p.cuerpo.appendChild(el("h3","sub","En la línea histórica"));
    p.cuerpo.appendChild(el("p","mini","Ese partido terminó "+P.part.real+"."+
      (P.part.real===res.yo+"-"+res.otro?" Coincide con lo que acabas de jugar.":" Tu partida ya va por otro lado.")));
    const nota=NOTAS_COPA[P.part.notaId];
    if(nota) p.cuerpo.appendChild(el("p","mini",nota));
  }

  /* rueda de prensa: manual (mini-decisión) o automática (ayudante) */
  seccionPrensa(p,res,P);

  const esAmistoso=P.part&&P.part.amistoso;
  const b=el("button","btn-aqua ancho verde",esAmistoso?"Volver al club":"Cerrar y seguir la semana");
  b.onclick=()=>{
    P_ACTUAL=null;
    if(!esAmistoso && typeof procesarSemanaPostPartido==="function"){
      const r=procesarSemanaPostPartido();
      if(r&&r.ev&&r.ev.tipo==="decision") return;
    }
    irA(esAmistoso?"plantel":"escritorio");   /* 7.74 · el amistoso no gasta la semana */
  };
  p.cuerpo.appendChild(b);
  $("#vista").appendChild(p);
  window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
}
/* ---------- rueda de prensa post-partido (6.26 · viva, reactiva, con memoria) ----------
   Ya no son 3 preguntas fijas: un periodista con nombre pregunta según lo que pasó EN
   la cancha (goleada, remontada, roja, figura, clásico) y también según lo que hiciste
   antes (promesas, ventas, pactos con la barra). No se repite la misma pregunta seguido. */
const POST_ARQ={
 elogio:  {grupos:{camarin:6,prensa:5},rep:{publica:3},txt:"Repartiste el crédito al plantel. El camarín y la prensa te lo devuelven."},
 humilde: {grupos:{prensa:6,camarin:3},rep:{credibilidad:4},txt:"Bajaste el perfil. Sumaste crédito y el grupo lo agradeció."},
 agrandado:{grupos:{hinchada:7,prensa:-4},rep:{credibilidad:-3},ef:{hinchada:3},txt:"Te agrandaste. La hinchada se prende, pero pusiste la vara altísima."},
 palo:    {grupos:{hinchada:6,anfp:-6,prensa:-4},rep:{dureza:5},txt:"Tiraste un palo. Unos lo festejan, la ANFP y la prensa toman nota."},
 mea:     {grupos:{prensa:6,camarin:-1},rep:{credibilidad:6},ef:{moral:-1},txt:"Autocrítica pública: duele, pero suma credibilidad."},
 apoyar:  {grupos:{camarin:8,prensa:3},rep:{publica:2},ef:{moral:4},txt:"Pusiste la cara por el grupo. El vestuario lo valora."},
 bancar:  {grupos:{camarin:8,prensa:2},rep:{publica:2},ef:{moral:3},txt:"Pusiste el pecho. El vestuario lo nota."},
 arbitro: {grupos:{hinchada:6,anfp:-8,prensa:-6},rep:{dureza:5,publica:-3},ef:{hinchada:4},txt:"Apuntaste al árbitro. La hinchada compra el complot; la ANFP y la prensa, no."},
 respaldo:{grupos:{camarin:7},rep:{publica:2},ef:{moral:2},txt:"Lo bancaste en público. Adentro se nota."},
 foco:    {grupos:{camarin:4,prensa:3},txt:"Pusiste el foco en lo que viene. Mensaje sobrio, cero polémica."}
};
/* cuenta cuántas veces aparece cada goleador → figura del partido */
function figuraPartido(P){
  const c={}; (P.goleadores||[]).forEach(n=>{ c[n]=(c[n]||0)+1; });
  let mejor=null,max=0; for(const n in c){ if(c[n]>max){ max=c[n]; mejor=n; } }
  return mejor?{n:mejor,goles:max}:null;
}
function preguntasPostPartido(res,P){
  const part=P.part, yo=res.yo, otro=res.otro, dif=Math.abs(yo-otro);
  const gano=yo>otro, perdio=yo<otro, riv=part.rivalNombre;
  const fig=figuraPartido(P);
  const clasico=(typeof esClasico==="function")&&esClasico(part);
  const sinGanar=(E.temporada&&E.temporada.sinGanar)||0;
  const lesion=(res.lesionados&&res.lesionados[0])||null;
  const prom=(typeof promesaPendiente==="function")?promesaPendiente():null;
  const mem=(typeof citarMemoria==="function")?citarMemoria(m=>((E.idx||0)-(m.idx||0))>=2 && m.tipo!=="partido"):null;
  const L=[];
  /* --- memoria: lo que hiciste ANTES vuelve --- */
  if(prom) L.push({id:"prom",prio:9,q:"Se sigue hablando de que le prometió un arreglo a "+prom.quien+". ¿Sigue en pie después de hoy?",ops:[
     {t:"Le doy mi palabra de nuevo, en público",k:"respaldo"},{t:"«De los temas internos no hablo»",k:"foco"},{t:"Son rumores, nada firmado",k:"palo"}]});
  if(mem) L.push({id:"mem_"+mem.id,prio:7,q:"Todavía se comenta que "+mem.txt+" ("+(typeof cuandoMemoria==="function"?cuandoMemoria(mem):"hace un tiempo")+"). ¿Le pesó hoy?",ops:[
     {t:"Doy la cara, fue mi decisión",k:"bancar"},{t:"Me hago cargo si me equivoqué",k:"mea"},{t:"Eso ya es pasado, hablemos del partido",k:"foco"}]});
  /* --- lo que pasó EN la cancha --- */
  if(gano&&fig&&fig.goles>=3) L.push({id:"hat",prio:8,q:"«"+fig.n+"» se llevó la pelota con "+fig.goles+" goles. ¿Nace una figura o fue la tarde?",ops:[
     {t:"Mérito de él y del grupo entero",k:"elogio"},{t:"Ganó el equipo, no un nombre",k:"humilde"},{t:"Es de otra categoría, se los avisé",k:"agrandado"}]});
  else if(gano&&fig&&fig.goles===2) L.push({id:"doblete",prio:6,q:fig.n+" hizo un doblete. ¿Qué le está pidiendo a él este año?",ops:[
     {t:"Que siga humilde, va bien",k:"elogio"},{t:"Es un jugador más del plantel",k:"humilde"},{t:"Que sueñe en grande, da para eso",k:"agrandado"}]});
  if(gano&&P.abajo2) L.push({id:"remont",prio:8,q:"Iban abajo por dos y lo dieron vuelta. ¿De dónde salió esa reacción?",ops:[
     {t:"Del carácter de este grupo",k:"bancar"},{t:"Del trabajo de la semana",k:"humilde"},{t:"Del que nunca dudó acá: yo",k:"palo"}]});
  if(gano&&P.tuvoRoja) L.push({id:"roja",prio:7,q:"Ganaron con uno menos. ¿Qué les dijo cuando quedaron en desventaja numérica?",ops:[
     {t:"Que se dejaran el alma, y lo hicieron",k:"bancar"},{t:"Nada especial, ellos lo resolvieron",k:"humilde"},{t:"Que el que se cansa, sale",k:"palo"}]});
  if(clasico&&gano) L.push({id:"clas_g",prio:8,q:"Le ganaron el clásico a "+riv+". ¿A quién le dedica esta?",ops:[
     {t:"A la gente, con respeto al rival",k:"humilde"},{t:"A los que dudaban de nosotros",k:"agrandado"},{t:"Al rival, que hable un poco menos",k:"palo"}]});
  if(clasico&&perdio) L.push({id:"clas_p",prio:8,q:"Perdieron el clásico y la gente quedó caliente. ¿Qué mensaje deja?",ops:[
     {t:"Pongo la cara yo, el equipo no se toca",k:"bancar"},{t:"Me hago cargo, fallamos en todo",k:"mea"},{t:"El árbitro también jugó, y no para nosotros",k:"arbitro"}]});
  if(gano&&dif>=3&&!clasico) L.push({id:"goleada",prio:6,q:"Golearon "+yo+"-"+otro+". ¿Se permite disfrutar o ya piensa en lo que viene?",ops:[
     {t:"Disfrutar poco, esto sigue",k:"humilde"},{t:"Todo el mérito es del plantel",k:"elogio"},{t:"Cuando estamos finos, somos así",k:"agrandado"}]});
  if(perdio&&(otro-yo)>=3) L.push({id:"paliza",prio:8,q:"Fue una goleada en contra. ¿Le pasa por la cabeza dar un paso al costado?",ops:[
     {t:"Doy la cara, este equipo es mío",k:"bancar"},{t:"El único responsable soy yo",k:"mea"},{t:"Acá el que trabaja no se baja",k:"palo"}]});
  if(lesion) L.push({id:"lesion",prio:7,q:"Se lesionó "+lesion+". ¿Cómo queda el plantel de acá en más?",ops:[
     {t:"Lo vamos a esperar, es importante",k:"respaldo"},{t:"Hay plantel para reemplazarlo",k:"foco"},{t:"Ojalá no sea grave, pero hay que seguir",k:"mea"}]});
  if((perdio||yo===otro)&&sinGanar>=3) L.push({id:"racha",prio:7,q:"Son "+sinGanar+" fechas sin ganar. ¿Siente que su puesto está en discusión?",ops:[
     {t:"Pongo el pecho, me hago cargo",k:"bancar"},{t:"Pido tiempo y respaldo",k:"mea"},{t:"Acá el que labura soy yo",k:"palo"}]});
  /* --- genéricas por resultado (fallback) --- */
  if(gano) L.push({id:"gen_g",prio:2,q:"Tres puntos ante "+riv+". ¿Con qué se queda de esta tarde?",ops:[
     {t:"Con la humildad para seguir",k:"humilde"},{t:"Con el pega del plantel",k:"elogio"},{t:"Con un palo para los que dudaban",k:"palo"}]});
  else if(perdio) L.push({id:"gen_p",prio:2,q:"Cayeron con "+riv+". ¿Qué explicación le encuentra?",ops:[
     {t:"Pongo la cara, es responsabilidad mía",k:"bancar"},{t:"Autocrítica: jugamos mal",k:"mea"},{t:"El arbitraje no ayudó",k:"arbitro"}]});
  else L.push({id:"gen_e",prio:2,q:"Repartieron puntos con "+riv+". ¿Punto ganado o dos perdidos?",ops:[
     {t:"Se rescata, seguimos de pie",k:"foco"},{t:"Dos perdidos, exijo más",k:"mea"},{t:"Nos robaron dos, hay que decirlo",k:"palo"}]});
  return L;
}
/* elige la pregunta de mayor prioridad que no se haya visto hace poco */
function elegirPreguntaPrensa(L){
  if(!E.flags.prensaVistas) E.flags.prensaVistas=[];
  const vistas=E.flags.prensaVistas;
  let cand=L.filter(x=>vistas.indexOf(x.id)<0);
  if(!cand.length) cand=L;                       /* si ya vio todas, se libera */
  const maxp=Math.max.apply(null,cand.map(x=>x.prio));
  const top=cand.filter(x=>x.prio===maxp);
  const q=elige(top);
  vistas.push(q.id); if(vistas.length>8) vistas.splice(0,vistas.length-8);
  return q;
}
function elegirPreguntasPrensa(L,n){
  n=n||2;
  const out=[], seen={};
  const lista=(L||[]).slice();
  for(let i=0;i<n;i++){
    const rest=lista.filter(x=>x&&!seen[x.id]);
    if(!rest.length) break;
    const q=elegirPreguntaPrensa(rest);
    if(!q) break;
    seen[q.id]=true;
    out.push(q);
  }
  return out;
}
function climaPrensa(){
  const v=(E.grupos&&E.grupos.prensa)?E.grupos.prensa.aprob:0;
  const pct=Math.round((v+100)/2);
  const etq=v>=45?"a favor":(v>=15?"tibia":(v>=-15?"neutral":(v>=-45?"picada":"en tu contra")));
  const col=v>=15?"#5ec94f":(v>=-15?"#e6c34a":"#e07a4a");
  return {pct:pct,etq:etq,col:col};
}
function seccionPrensa(p,res,P){
  P=P||P_ACTUAL;
  p.cuerpo.appendChild(el("h3","sub","Sala de prensa"));
  /* barra de clima de prensa del momento */
  const cl=climaPrensa();
  const bar=el("div","mini"); bar.style.margin="2px 0 6px";
  bar.innerHTML="Clima de prensa: <b>"+cl.etq+"</b>"+
    "<div class='barrita' style='margin-top:3px'><i style='width:"+cl.pct+"%;--c:"+cl.col+"'></i></div>";
  p.cuerpo.appendChild(bar);
  const tog=el("div","mini");
  tog.innerHTML="Modo: <b>"+(E.prensaAuto?"automático (ayudante)":"manual (tú hablas)")+"</b>";
  p.cuerpo.appendChild(tog);
  const bt=el("button","btn-aqua chico gris",E.prensaAuto?"Pasar a manual":"Delegar en el ayudante");
  bt.onclick=()=>{ E.prensaAuto=!E.prensaAuto; guardar(); tog.innerHTML="Modo: <b>"+(E.prensaAuto?"automático (ayudante)":"manual (tú hablas)")+"</b>"; bt.textContent=E.prensaAuto?"Pasar a manual":"Delegar en el ayudante"; zonaPrensa.innerHTML=""; pintarZonaPrensa(); };
  p.cuerpo.appendChild(bt);
  const zonaPrensa=el("div"); p.cuerpo.appendChild(zonaPrensa);
  let hecho=false, qi=0, qs=null, dichos=[];
  function pintarZonaPrensa(){
    zonaPrensa.innerHTML="";
    if(hecho) return;
    if(!qs) qs=(typeof elegirPreguntasPrensa==="function")
      ?elegirPreguntasPrensa(preguntasPostPartido(res,P),2)
      :[elegirPreguntaPrensa(preguntasPostPartido(res,P))].filter(Boolean);
    if(E.prensaAuto){
      const r=res.yo>res.otro?{grupos:{prensa:3,camarin:2}}:res.yo<res.otro?{grupos:{prensa:1,camarin:1}}:{grupos:{prensa:1}};
      aplicarGrupos(r.grupos);
      notificar({t:"El ayudante habló con la prensa",tipo:"neutro",d:"Se ocupó de las "+(qs.length||2)+" preguntas sin sobresaltos. Declaraciones tibias, cero polémica.",bandeja:false});
      guardar(); hecho=true;
      zonaPrensa.appendChild(el("div","resul mitad","El ayudante cubrió la sala ("+(qs.length||2)+" preguntas). Sin polémica."));
      return;
    }
    if(!qs.length){ zonaPrensa.appendChild(el("p","mini","La sala se despobló.")); return; }
    const q=qs[qi];
    const per=eligePeri();
    zonaPrensa.appendChild(el("p","mini","Pregunta "+(qi+1)+" de "+qs.length));
    zonaPrensa.appendChild(el("div","resul mitad peri-row", fichaPeriodista(per, q.q)));
    const ops=el("div","ops");
    q.ops.forEach(o=>{
      const a=POST_ARQ[o.k]||POST_ARQ.foco;
      const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div>';
      b.onclick=()=>{
        if(a.ef) aplicarEfectos(a.ef); if(a.grupos) aplicarGrupos(a.grupos); if(a.rep) aplicarRep(a.rep);
        if(typeof postProc==="function") postProc("@"+per.m.replace(/\s/g,""),"prensa","«"+o.t+"», respondió el DT ante "+q.q.slice(0,40).replace(/«|»/g,"")+"…","neutro");
        notificar({t:"Declaraciones a "+per.n,tipo:"neutro",d:"«"+o.t+"». "+a.txt,bandeja:false});
        if(typeof recordar==="function"&&o.k==="palo") recordar("prensa","calentaste la sala de prensa después de "+(res.yo>res.otro?"ganarle":"jugar contra")+" a "+P.part.rivalNombre,{peso:"bajo"});
        dichos.push(o.t);
        guardar();
        qi++;
        if(qi<qs.length) pintarZonaPrensa();
        else {
          hecho=true; zonaPrensa.innerHTML="";
          zonaPrensa.appendChild(el("div","resul bien",dichos.map(t=>"«"+t+"»").join("<br>")+" — "+a.txt));
        }
      };
      ops.appendChild(b);
    });
    zonaPrensa.appendChild(ops);
  }
  pintarZonaPrensa();
}
