"use strict";
/* ============================================================
   FUTBOLINI 3.0 · ui-partido.js
   Pantallas de previa, partido en vivo y resumen.
   ============================================================ */
let P_ACTUAL=null, TIMER=null, PAUSADO=false, MOMENTO_OPS=[], VEL_PARTIDO=260;
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
  const bpiz=el("button","btn-aqua ancho"+(E.tactica.pizarra&&E.tactica.pizarra.length?" verde":""),
    "🎯 Pizarra libre"+(E.tactica.pizarra&&E.tactica.pizarra.length?" · activa":""));
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
  if(cl) p2.cuerpo.appendChild(el("p","mini",cl.ic+" Clima: "+cl.n+". "+cl.d));
  if(part.local) p2.cuerpo.appendChild(el("p","mini","Se espera buena taquilla: la gente está "+(E.ind.hinchada>65?"encendida":"tibia")+"."));
  if(part.local){
    const tq=ingresoPartidoLocal(part);
    p2.cuerpo.appendChild(fila("Taquilla proyectada",tq.gente.toLocaleString("es-CL")+" personas · "+plata(tq.ingreso)));
    p2.cuerpo.appendChild(el("p","mini","Ajustás el precio de cada sector en Finanzas."));
  }
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
  if((part.ronda==="FINAL"||part.ronda==="Semifinal")&&typeof modalCharlaCapitan==="function"){
    const bc=el("button","btn-aqua ancho","🧑‍✈️ Charla con el capitán antes de salir");
    bc.onclick=modalCharlaCapitan;
    p2.cuerpo.appendChild(bc);
  }
  p2.cuerpo.appendChild(el("p","mini","Seguir: barra espaciadora para pausar. Dirigir: teclas 1 / 2 / 3 en cada decisión."));
  rej.appendChild(p2);
  v.appendChild(rej);
  window.scrollTo({top:0});
}
/* ---------- pizarra libre (posicionar los 11 en la cancha) ---------- */
function apodoJug(n){ const p=(n||"").split(" "); return (p[p.length-1]||n).slice(0,9); }
function mismaGente(piz,once){ if(!piz||piz.length!==once.length) return false; const set=new Set(once.map(j=>j.n)); return piz.every(p=>set.has(p.n)); }
function modalPizarra(part){
  const once=onceIdeal();
  if(!E.tactica.pizarra || !mismaGente(E.tactica.pizarra,once)) E.tactica.pizarra=pizarraDesdeFormacion(once);
  let sel=null;
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🎯</span><span>Pizarra libre</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini","Tocá un jugador y después una celda para moverlo. Se permiten esquemas asimétricos o bizarros. ⬆ arriba es el arco rival."));
      const grid=el("div","pizarra");
      for(let rr=PIZ_FILAS-1; rr>=0; rr--){
        for(let cc=0; cc<PIZ_COLS; cc++){
          const cell=el("div","celda"+(rr===0?" propia":(rr>=3?" ataque":"")));
          const ocup=E.tactica.pizarra.find(p=>p.r===rr&&p.c===cc);
          if(ocup){
            const chip=el("div","chip"+(sel===ocup?" sel":"")+(ocup.pos==="ARQ"?" arq":""));
            chip.textContent=apodoJug(ocup.n);
            chip.onclick=(e)=>{ e.stopPropagation(); sel=(sel===ocup?null:ocup); pintar(); };
            cell.appendChild(chip);
          }
          cell.onclick=()=>{ if(sel){ const otro=E.tactica.pizarra.find(p=>p.r===rr&&p.c===cc&&p!==sel);
            if(otro){ otro.r=sel.r; otro.c=sel.c; } sel.r=rr; sel.c=cc; sel=null; pintar(); } };
          grid.appendChild(cell);
        }
      }
      c.appendChild(grid);
      const forma=formaLibre(E.tactica.pizarra)||{ataque:0,orden:0,ancho:0};
      c.appendChild(el("div","resul mitad","Forma resultante — ataque <b>"+signo(Math.round(forma.ataque))+
        "</b> · orden <b>"+signo(Math.round(forma.orden))+"</b> · ancho <b>"+signo(Math.round(forma.ancho))+"</b>"));
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
function arrancarPartido(part,modo){
  P_ACTUAL=iniciarPartido(part,modo);
  PAUSADO=false; MOMENTO_OPS=[];
  if(modo==="simular"){ correrHasta(P_ACTUAL,90); pintarPartido(); cerrarPartido(); return; }
  pintarPartido(); correrEnVivo();
}
function pintarPartido(){
  const P=P_ACTUAL; if(!P) return;
  const v=$("#vista"); v.innerHTML="";
  const [yo,otro]=miMarcador(P);
  const p=panel(P.part.tipo==="copa"?("Copa Libertadores · "+P.part.ronda):("Fecha "+P.part.fecha),"🎙️",P.part.tipo==="copa"?"agua":"");
  const marc=el("div","marcador");
  marc.innerHTML='<div class="eq">'+(P.part.local?E.clubNombre:P.part.rivalNombre)+'</div>'+
    '<div class="go">'+P.gl+" - "+P.gv+'</div>'+
    '<div class="eq">'+(P.part.local?P.part.rivalNombre:E.clubNombre)+'</div>';
  p.cuerpo.appendChild(marc);
  const tramo=P.min<=45?"1T":(P.min<90?"2T":"FT");
  p.cuerpo.appendChild(el("div","reloj",P.terminado?"Final del partido":((PAUSADO?"⏸ ":"")+"Minuto "+P.min+" · "+tramo)));
  if(!P.terminado&&P.modo!=="simular"){
    const ctrl=el("div","ctrlPartido");
    const bp=el("button","btn-aqua chico",PAUSADO?"▶ Seguir":"⏸ Pausa");
    bp.onclick=()=>{ PAUSADO=!PAUSADO; if(!MOMENTO_OPS.length) pintarPartido(); };
    ctrl.appendChild(bp);
    [["1x",420],["2x",240],["4x",110]].forEach(([n,vv])=>{
      const b=el("button","btn-aqua chico"+(VEL_PARTIDO===vv?"":" gris"),n);
      b.onclick=()=>{ VEL_PARTIDO=vv; if(!MOMENTO_OPS.length&&!PAUSADO) correrEnVivo(); pintarPartido(); };
      ctrl.appendChild(b);
    });
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
  }
  const rel=el("div","relato");
  P.lineas.slice().reverse().forEach(l=>rel.appendChild(el("div","rel "+l.c,'<span class="m">'+l.m+"'</span><span>"+l.t+"</span>")));
  if(!P.lineas.length) rel.appendChild(el("div","rel","<span class='m'>0'</span><span>Rueda la pelota en "+P.part.sede+".</span>"));
  p.cuerpo.appendChild(rel);
  /* ticker de redes en vivo (FutbolGram) */
  if(P.modo!=="simular" && P.ticker && P.ticker.length){
    p.cuerpo.appendChild(el("h3","sub","📱 FutbolGram · en vivo"));
    const tk=el("div","ticker");
    P.ticker.slice(0,10).forEach(t=>{
      const d=el("div","tk "+(t.tono==="bueno"?"bien":(t.tono==="malo"?"mal":"")));
      d.innerHTML="<b>"+t.autor+"</b> <span class='mini'>"+t.m+"'</span><br>"+t.texto;
      tk.appendChild(d);
    });
    p.cuerpo.appendChild(tk);
  }
  v.appendChild(p);
  $("#vista").appendChild(el("div","",""));
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
  if(P.terminado||P.min>=90){ clearInterval(TIMER); pintarPartido(); cerrarPartido(); return; }
  /* momento táctico programado (solo dirigir) */
  if(P.modo==="dirigir" && P.momentoIdx<P.momentos.length && P.min>=P.momentos[P.momentoIdx]){
    clearInterval(TIMER); pintarPartido(); mostrarMomento(); return;
  }
  const ev=tickPartido(P);
  if(typeof tickerPost==="function") tickerPost(P,ev);
  if(ev.tipo==="penalRival"){ resolverEventoAuto(P,ev); pintarPartido(); return; }
  if(ev.tipo==="penal"||ev.tipo==="lesion"||ev.tipo==="tiroLibre"){
    const autoP=!E.config||E.config.autoPausa!==false;
    if(P.modo==="dirigir"&&autoP){ clearInterval(TIMER); pintarPartido(); mostrarAccion(ev); return; }
    resolverEventoAuto(P,ev);
  }
  pintarPartido();
}
function reanudarPronto(){
  setTimeout(()=>{ if(!P_ACTUAL) return;
    if(P_ACTUAL.terminado||P_ACTUAL.min>=90){ cerrarPartido(); }
    else correrEnVivo();
  }, 650);
}
/* momento táctico (charla/cambio de plan) */
function mostrarMomento(){
  const P=P_ACTUAL;
  const m=momentoActual(P);
  const p=panel(m.t,"🧠","alerta");
  p.cuerpo.appendChild(el("p",null,m.d));
  const ops=el("div","ops"); MOMENTO_OPS=[];
  m.op.forEach((o,i)=>{
    const b=el("button","op");
    b.innerHTML='<div class="t"><span class="tecla">'+(i+1)+'</span> '+o.t+'</div>';
    b.onclick=()=>{ MOMENTO_OPS=[]; aplicarMomento(P,o.ef); P.momentoIdx++; correrEnVivo(); };
    ops.appendChild(b); MOMENTO_OPS.push(b);
  });
  p.cuerpo.appendChild(ops);
  p.cuerpo.appendChild(el("p","mini","Decidí con 1 / 2 / 3 / 4."));
  $("#vista").appendChild(p);
}
/* jugada de peligro que el DT resuelve en el acto */
function candidatosPenal(P){
  const c=P.once.filter(j=>j.pos!=="ARQ");
  const punt=j=>(j.nivel||60)+((j.rasgos&&j.rasgos.includes("penales"))?30:0)+((j.rasgos&&j.rasgos.includes("definición"))?12:0);
  return c.slice().sort((a,b)=>punt(b)-punt(a)).slice(0,3);
}
function centroTiroLibre(P){
  const aereo=P.once.filter(j=>j.rasgos&&j.rasgos.includes("juego aéreo"))[0]||elige(P.once.filter(j=>j.pos==="DEF"||j.pos==="DEL"))||P.once[0];
  linea(P,P.min,"Centro al área, sube "+(aereo?aereo.n:"la defensa")+" a cabecear…");
  const prob=clamp(0.14+((aereo&&aereo.rasgos&&aereo.rasgos.includes("juego aéreo"))?0.10:0),0.06,0.28);
  if(Math.random()<prob){ if(aereo){aereo.goles++;P.goleadores.push(aereo.n);regGol(P,P.min,aereo.n,true,"cabeza");} if(P.part.local)P.gl++;else P.gv++;
    linea(P,P.min,"¡Gol de cabeza"+(aereo?" de "+aereo.n:"")+"! "+marcadorTxt(P),"gol"); }
  else linea(P,P.min,"Despeja la defensa rival de cabeza.");
}
function mostrarAccion(ev){
  const P=P_ACTUAL;
  let titulo="", opciones=[];
  if(ev.tipo==="penal"){
    titulo="¡Penal a favor! ¿Quién patea?";
    opciones=candidatosPenal(P).map(j=>({t:j.n+" · "+((j.rasgos&&j.rasgos.includes("penales"))?"especialista":"nivel "+j.nivel),
      run:()=>penalEnPartido(P,true,null,j)}));
  } else if(ev.tipo==="tiroLibre"){
    titulo="Tiro libre peligroso";
    opciones=[
      {t:"Al arco, buscar el golazo",run:()=>tiroLibreAuto(P)},
      {t:"Centro al área",run:()=>centroTiroLibre(P)},
      {t:"Jugarla en corto, sin riesgo",run:()=>linea(P,P.min,"La juegan en corto y rearman con paciencia.")}
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
  const ops=el("div","ops"); MOMENTO_OPS=[];
  opciones.forEach((o,i)=>{
    const b=el("button","op");
    b.innerHTML='<div class="t"><span class="tecla">'+(i+1)+'</span> '+o.t+'</div>';
    b.onclick=()=>{ MOMENTO_OPS=[]; o.run(); pintarPartido(); reanudarPronto(); };
    ops.appendChild(b); MOMENTO_OPS.push(b);
  });
  p.cuerpo.appendChild(ops);
  p.cuerpo.appendChild(el("p","mini","Decidí con 1 / 2 / 3."));
  $("#vista").appendChild(p);
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
  const res=terminarPartido(P);
  const gano=res.yo>res.otro;
  const p=panel("Final del partido","📄",gano?"":"alerta");
  p.cuerpo.appendChild(el("h2","tit",(gano?"Victoria ":(res.yo<res.otro?"Derrota ":"Empate "))+res.yo+"-"+res.otro+" ante "+P.part.rivalNombre));

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
      (P.part.real===res.yo+"-"+res.otro?" Coincide con lo que acabás de jugar.":" Tu partida ya va por otro lado.")));
    const nota=NOTAS_COPA[P.part.notaId];
    if(nota) p.cuerpo.appendChild(el("p","mini",nota));
  }

  /* rueda de prensa: manual (mini-decisión) o automática (ayudante) */
  seccionPrensa(p,res);

  const b=el("button","btn-aqua ancho verde","Volver al escritorio");
  b.onclick=()=>{ P_ACTUAL=null; irA("escritorio"); };
  p.cuerpo.appendChild(b);
  $("#vista").appendChild(p);
  window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
}
/* ---------- rueda de prensa post-partido ---------- */
function opcionesPrensa(res){
  if(res.yo>res.otro) return [
   {t:"Elogiar al plantel y bajar el perfil",ef:{},grupos:{camarin:6,prensa:5},rep:{publica:3},d:"Mensaje sobrio: el camarín lo agradece y la prensa te trata bien."},
   {t:"Agrandarse y prometer más",ef:{hinchada:4},grupos:{hinchada:6,prensa:-4},rep:{credibilidad:-3},d:"La hinchada se prende, pero pusiste la vara alta y la prensa toma nota."},
   {t:"Mandarle un recado al rival",ef:{},grupos:{hinchada:5,anfp:-6,prensa:-3},rep:{dureza:4},d:"Calentaste la previa del próximo; algunos lo aplauden, otros no."}
  ];
  if(res.yo<res.otro) return [
   {t:"Poner la cara y bancar al grupo",ef:{moral:4},grupos:{camarin:8,prensa:3},rep:{publica:2},d:"Diste la cara: el vestuario lo valora."},
   {t:"Autocrítica pública",ef:{moral:-2},grupos:{prensa:6},rep:{credibilidad:6},d:"Sinceridad que suma credibilidad, aunque duela hacia adentro."},
   {t:"Apuntar al árbitro",ef:{hinchada:4},grupos:{hinchada:6,anfp:-8,prensa:-6},rep:{dureza:5,publica:-3},d:"La hinchada compra el complot; la ANFP y la prensa, no."}
  ];
  return [
   {t:"Rescatar lo bueno",ef:{moral:2},grupos:{prensa:3},d:"Un empate se puede vender bien si sabés hablar."},
   {t:"Mostrar bronca por los puntos perdidos",ef:{},grupos:{camarin:-3,prensa:4},rep:{dureza:3},d:"Marcaste exigencia; el camarín siente la presión."}
  ];
}
function seccionPrensa(p,res){
  p.cuerpo.appendChild(el("h3","sub","Rueda de prensa"));
  const tog=el("div","mini");
  tog.innerHTML="Modo: <b>"+(E.prensaAuto?"automático (ayudante)":"manual (vos hablás)")+"</b>";
  p.cuerpo.appendChild(tog);
  const bt=el("button","btn-aqua chico gris",E.prensaAuto?"Pasar a manual":"Delegar en el ayudante");
  bt.onclick=()=>{ E.prensaAuto=!E.prensaAuto; guardar(); tog.innerHTML="Modo: <b>"+(E.prensaAuto?"automático (ayudante)":"manual (vos hablás)")+"</b>"; bt.textContent=E.prensaAuto?"Pasar a manual":"Delegar en el ayudante"; zonaPrensa.innerHTML=""; pintarZonaPrensa(); };
  p.cuerpo.appendChild(bt);
  const zonaPrensa=el("div"); p.cuerpo.appendChild(zonaPrensa);
  let hecho=false;
  function pintarZonaPrensa(){
    zonaPrensa.innerHTML="";
    if(hecho) return;
    if(E.prensaAuto){
      const r=res.yo>res.otro?{grupos:{prensa:3,camarin:2}}:res.yo<res.otro?{grupos:{prensa:1,camarin:1}}:{grupos:{prensa:1}};
      aplicarGrupos(r.grupos);
      notificar({t:"El ayudante habló con la prensa",tipo:"neutro",d:"Se ocupó de la rueda de prensa sin sobresaltos. Declaraciones tibias, cero polémica.",bandeja:false});
      guardar(); hecho=true;
      zonaPrensa.appendChild(el("div","resul mitad","El ayudante se encargó: sin polémica."));
    } else {
      const ops=el("div","ops");
      opcionesPrensa(res).forEach(o=>{
        const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div>';
        b.onclick=()=>{
          if(o.ef) aplicarEfectos(o.ef); if(o.grupos) aplicarGrupos(o.grupos); if(o.rep) aplicarRep(o.rep);
          notificar({t:"Declaraciones a la prensa",tipo:"neutro",d:o.d,bandeja:false});
          guardar(); hecho=true; zonaPrensa.innerHTML=""; zonaPrensa.appendChild(el("div","resul bien",o.d));
        };
        ops.appendChild(b);
      });
      zonaPrensa.appendChild(ops);
    }
  }
  pintarZonaPrensa();
}
