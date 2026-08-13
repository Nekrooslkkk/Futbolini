"use strict";
/* ============================================================
   FUTBOLINI 3.0 · ui-partido.js
   Pantallas de previa, partido en vivo y resumen.
   ============================================================ */
let P_ACTUAL=null, TIMER=null, PAUSADO=false, MOMENTO_OPS=[];
/* Atajos de teclado durante el partido:
   Espacio = pausa/reanuda (modo Seguir) · 1/2/3 = orden rápida (modo Dirigir) */
function partidoTeclas(e){
  if(!P_ACTUAL||P_ACTUAL.terminado) return;
  if(e.code==="Space"||e.key===" "){
    if(P_ACTUAL.modo==="seguir"){ e.preventDefault(); PAUSADO=!PAUSADO; aviso(PAUSADO?"⏸ Pausa":"▶ Sigue"); }
    return;
  }
  if(P_ACTUAL.modo==="dirigir"&&MOMENTO_OPS.length){
    const n=parseInt(e.key,10);
    if(n>=1&&n<=MOMENTO_OPS.length){ e.preventDefault(); const b=MOMENTO_OPS[n-1]; MOMENTO_OPS=[]; if(b) b.click(); }
  }
}
document.addEventListener("keydown",partidoTeclas);

function pantallaPrevia(part){
  const v=$("#vista"); v.innerHTML="";
  const cab=panel(part.tipo==="copa"?("Copa Libertadores · "+part.ronda):("Campeonato Nacional · fecha "+part.fecha),
    part.tipo==="copa"?"🏆":"⚽", part.tipo==="copa"?"agua":"");
  cab.cuerpo.appendChild(el("h2","tit",(part.local?E.clubNombre+" vs "+part.rivalNombre:part.rivalNombre+" vs "+E.clubNombre)));
  cab.cuerpo.appendChild(el("p","mini",(part.local?"De local":"De visita")+" en "+part.sede+" · "+fechaTxt(part.f)+" de "+E.anio+
    (part.apodo?" · "+part.apodo:"")));
  v.appendChild(cab);

  const rej=el("div","rejilla dos");
  /* --- plan --- */
  const p1=panel("Plan de partido","📋");
  [["form","Formación",Object.keys(FORMACIONES)],["estilo","Estilo",Object.keys(ESTILOS)],["presion","Presión",Object.keys(PRESIONES)]]
   .forEach(([k,lab,ops])=>{
    p1.cuerpo.appendChild(el("label","lb",lab));
    const f=el("div","fichas");
    ops.forEach(o=>{
      const b=el("button","ficha",o);
      b.setAttribute("aria-pressed",E.tactica[k]===o?"true":"false");
      b.onclick=()=>{ E.tactica[k]=o; guardar(); pantallaPrevia(part); };
      f.appendChild(b);
    });
    p1.cuerpo.appendChild(f);
  });
  const once=onceIdeal();
  p1.cuerpo.appendChild(el("h3","sub","Once titular"));
  const t=el("table");
  t.innerHTML="<thead><tr><th>Jugador</th><th>Pos</th><th class='n'>Nivel</th><th class='n'>Forma</th></tr></thead>";
  const tb=el("tbody");
  once.forEach(j=>tb.appendChild(el("tr",null,"<td>"+j.n+(j.real?" ●":"")+"</td><td>"+j.pos+"</td><td class='n'>"+j.nivel+"</td><td class='n'>"+Math.round(j.forma)+"</td>")));
  t.appendChild(tb); p1.cuerpo.appendChild(t);
  const les=E.plantel.filter(j=>j.lesion>0&&!j.vendido);
  if(les.length) p1.cuerpo.appendChild(el("p","mini","No disponibles: "+les.map(j=>j.n).join(", ")));
  rej.appendChild(p1);

  /* --- lectura previa --- */
  const p2=panel("Antes de salir","🔍","agua");
  const fz=fuerzaEquipo(once);
  const lectura=fz.base>part.fuerzaRival+6?"Sobre el papel somos mejores, pero eso no se cobra en la cancha.":
    (fz.base>part.fuerzaRival-4?"Está parejo. Lo va a definir un detalle.":"El rival es superior. Hay que jugar perfecto.");
  p2.cuerpo.appendChild(el("p",null,"<b>"+E.dt+":</b> "+lectura));
  const cl=(typeof CLIMAS!=="undefined"&&CLIMAS[part.clima])||null;
  if(cl) p2.cuerpo.appendChild(el("p","mini",cl.ic+" Clima: "+cl.n+". "+cl.d));
  if(part.local) p2.cuerpo.appendChild(el("p","mini","Se espera buena taquilla: la gente está "+(E.ind.hinchada>65?"encendida":"tibia")+"."));
  p2.cuerpo.appendChild(fila("Precio de la entrada",["Popular","Normal","Alto"][E.precioEntrada]));
  const cambia=el("button","btn-aqua chico gris","Cambiar precio");
  cambia.onclick=()=>{ E.precioEntrada=(E.precioEntrada+1)%3; guardar(); pantallaPrevia(part); };
  p2.cuerpo.appendChild(cambia);
  p2.cuerpo.appendChild(el("h3","sub","¿Cómo lo vivís?"));
  const bs=el("div");
  [["Simular","simular","Resultado y crónica corta."],
   ["Seguir","seguir","El partido en vivo, sin intervenir."],
   ["Dirigir","dirigir","Vos decidís en los momentos clave."]].forEach(([n,m,d])=>{
    const b=el("button","btn-aqua ancho"+(m==="dirigir"?" verde":""),n+" · <span style='font-weight:400;font-size:11.5px'>"+d+"</span>");
    b.style.marginBottom="7px";
    b.onclick=()=>arrancarPartido(part,m);
    bs.appendChild(b);
  });
  p2.cuerpo.appendChild(bs);
  p2.cuerpo.appendChild(el("p","mini","Seguir: barra espaciadora para pausar. Dirigir: teclas 1 / 2 / 3 en cada decisión."));
  rej.appendChild(p2);
  v.appendChild(rej);
  window.scrollTo({top:0});
}
function arrancarPartido(part,modo){
  P_ACTUAL=iniciarPartido(part,modo);
  PAUSADO=false; MOMENTO_OPS=[];
  if(modo==="dirigir"){ pintarPartido(); pedirMomento(); }
  else if(modo==="seguir"){ pintarPartido(); correrEnVivo(); }
  else { correrHasta(P_ACTUAL,90); pintarPartido(); cerrarPartido(); }
}
function pintarPartido(){
  const P=P_ACTUAL, v=$("#vista"); v.innerHTML="";
  const [yo,otro]=miMarcador(P);
  const p=panel(P.part.tipo==="copa"?("Copa Libertadores · "+P.part.ronda):("Fecha "+P.part.fecha),"🎙️",P.part.tipo==="copa"?"agua":"");
  const marc=el("div","marcador");
  marc.innerHTML='<div class="eq">'+(P.part.local?E.clubNombre:P.part.rivalNombre)+'</div>'+
    '<div class="go">'+P.gl+" - "+P.gv+'</div>'+
    '<div class="eq">'+(P.part.local?P.part.rivalNombre:E.clubNombre)+'</div>';
  p.cuerpo.appendChild(marc);
  p.cuerpo.appendChild(el("div","reloj",P.terminado?"Final del partido":("Minuto "+P.min)));
  const rel=el("div","relato");
  P.lineas.slice().reverse().forEach(l=>rel.appendChild(el("div","rel "+l.c,'<span class="m">'+l.m+"'</span><span>"+l.t+"</span>")));
  if(!P.lineas.length) rel.appendChild(el("div","rel","<span class='m'>0'</span><span>Rueda la pelota en "+P.part.sede+".</span>"));
  p.cuerpo.appendChild(rel);
  v.appendChild(p);
  $("#vista").appendChild(el("div","",""));
}
function correrEnVivo(){
  clearInterval(TIMER);
  TIMER=setInterval(()=>{
    if(PAUSADO) return;
    const P=P_ACTUAL;
    if(!P){ clearInterval(TIMER); return; }
    correrHasta(P,Math.min(90,P.min+ri(6,11)));
    pintarPartido();
    if(P.min>=90){ clearInterval(TIMER); cerrarPartido(); }
  },700);
}
function pedirMomento(){
  const P=P_ACTUAL;
  if(P.momentoIdx>=P.momentos.length){ correrHasta(P,90); pintarPartido(); cerrarPartido(); return; }
  const objetivo=P.momentos[P.momentoIdx];
  correrHasta(P,objetivo);
  pintarPartido();
  if(P.min>=90){ cerrarPartido(); return; }
  const m=momentoActual(P);
  const p=panel(m.t,"🧠","alerta");
  p.cuerpo.appendChild(el("p",null,m.d));
  const ops=el("div","ops");
  MOMENTO_OPS=[];
  m.op.forEach((o,i)=>{
    const b=el("button","op");
    b.innerHTML='<div class="t"><span class="tecla">'+(i+1)+'</span> '+o.t+'</div>';
    b.onclick=()=>{ MOMENTO_OPS=[]; aplicarMomento(P,o.ef); P.momentoIdx++; pedirMomento(); };
    ops.appendChild(b);
    MOMENTO_OPS.push(b);
  });
  p.cuerpo.appendChild(ops);
  p.cuerpo.appendChild(el("p","mini","Atajos: teclas 1 / 2 / 3 para decidir sin soltar el teclado."));
  $("#vista").appendChild(p);
}
function cerrarPartido(){
  const P=P_ACTUAL;
  const res=terminarPartido(P);
  const p=panel("Final del partido","📄",res.yo>res.otro?"":"alerta");
  p.cuerpo.appendChild(el("h2","tit",(res.yo>res.otro?"Victoria ":(res.yo<res.otro?"Derrota ":"Empate "))+res.yo+"-"+res.otro+" ante "+P.part.rivalNombre));
  if(P.goleadores.length) p.cuerpo.appendChild(el("p","mini","Goles: "+P.goleadores.join(", ")));
  if(P.lesionados.length) p.cuerpo.appendChild(el("p","mini","Lesionados: "+P.lesionados.join(", ")));
  if(P.part.local) p.cuerpo.appendChild(fila("Público / taquilla",res.gente.toLocaleString("es-CL")+" personas · "+plata(res.caja)));
  if(P.part.real){
    p.cuerpo.appendChild(el("h3","sub","En la línea histórica"));
    p.cuerpo.appendChild(el("p","mini","Ese partido terminó "+P.part.real+"."+
      (P.part.real===res.yo+"-"+res.otro?" Coincide con lo que acabás de jugar.":" Tu partida ya va por otro lado.")));
    const nota=NOTAS_COPA[P.part.notaId];
    if(nota) p.cuerpo.appendChild(el("p","mini",nota));
  }
  const b=el("button","btn-aqua ancho verde","Volver al escritorio");
  b.onclick=()=>{ P_ACTUAL=null; irA("escritorio"); };
  p.cuerpo.appendChild(b);
  $("#vista").appendChild(p);
  window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
}
