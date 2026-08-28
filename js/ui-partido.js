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

/* 6.31 · qué conviene tener listo antes de jugar (reconoce el estado real) */
function checklistPrevia(part,once){
  const items=[];
  const clasico=(typeof esClasico==="function")&&esClasico(part);
  if(clasico) items.push({warn:false,ok:true,t:"Hoy es CLÁSICO ante "+part.rivalNombre,d:"Vale doble para la gente. Es tu objetivo institucional del año."});
  /* decisiones urgentes sin resolver */
  const urgentes=(E.decPend||[]).filter(x=>x.peso==="alto").length;
  if(urgentes) items.push({warn:true,t:urgentes+" decisión"+(urgentes>1?"es":"")+" urgente"+(urgentes>1?"s":"")+" sin resolver",
    d:"El buzón tiene temas que hay que cerrar antes del partido.",accion:()=>irA("escritorio")});
  /* conferencia de prensa */
  const confHecha=E.flags["conf_"+E.idx];
  items.push({ok:!!confHecha,warn:false,t:confHecha?"Conferencia de prensa dada":"Conferencia de prensa pendiente",
    d:confHecha?"Ya hablaste con la prensa.":"Hablar suma o resta clima de prensa. Está abajo, en «Antes de salir»."});
  /* alineación / química */
  const manualOn=E.tactica.xiManual&&E.tactica.xiManual.length;
  items.push({ok:!!manualOn,warn:false,t:manualOn?"Alineación armada a mano":"Alineación automática",
    d:manualOn?"Elegiste vos el once.":"El juego pone el mejor once disponible. Podés cambiarlo abajo."});
  if(typeof quimicaEquipo==="function"){
    const qui=quimicaEquipo(once);
    if(qui.prom<50) items.push({warn:true,t:"Química baja ("+qui.prom+"/100)",
      d:"Hay jugadores que no congenian. Acomodá la pizarra para juntar a los que se llevan bien.",accion:()=>modalPizarra(part)});
    else items.push({ok:true,warn:false,t:"Química del equipo OK ("+qui.prom+"/100)",d:"El grupo se lleva bien sobre la cancha."});
  }
  /* piernas cansadas en el XI */
  const cansados=once.filter(j=>(j.cansancio||0)>=18);
  if(cansados.length>=2) items.push({warn:true,t:cansados.length+" titulares con las piernas pesadas",
    d:"Cansancio alto: "+cansados.slice(0,3).map(j=>j.n).join(", ")+(cansados.length>3?"…":"")+". Pensá en rotar o entrenar suave.",accion:()=>modalAlineacion(part)});
  /* lesionados que se pierden el partido */
  const les=E.plantel.filter(j=>j.lesion>0&&!j.vendido);
  if(les.length) items.push({warn:false,t:les.length+" jugador"+(les.length>1?"es":"")+" lesionado"+(les.length>1?"s":""),
    d:"No disponibles: "+les.slice(0,4).map(j=>j.n).join(", ")+(les.length>4?"…":"")+"."});
  /* barra caliente */
  if(part.local && E.barra && E.barra.roto) items.push({warn:true,t:"La barra está caliente con vos",
    d:"Rompiste un pacto: esperá silbidos de local y algún lío en la puerta."});
  return items;
}
function pantallaPrevia(part){
  const v=$("#vista"); v.innerHTML=""; v.dataset.sec="partido";
  const cab=panel(part.tipo==="copa"?("Copa Libertadores · "+part.ronda):("Campeonato Nacional · fecha "+part.fecha),
    part.tipo==="copa"?"🏆":"⚽", part.tipo==="copa"?"agua":"");
  cab.cuerpo.appendChild(el("h2","tit",(part.local?E.clubNombre+" vs "+part.rivalNombre:part.rivalNombre+" vs "+E.clubNombre)));
  cab.cuerpo.appendChild(el("p","mini",(part.local?"De local":"De visita")+" en "+part.sede+" · "+fechaTxt(part.f)+" de "+E.anio+
    (part.apodo?" · "+part.apodo:"")));
  v.appendChild(cab);

  /* 6.31 · checklist: qué conviene resolver ANTES de salir a jugar */
  const onceCk=onceIdeal();
  const items=checklistPrevia(part,onceCk);
  const hayPend=items.some(i=>i.warn);
  const pc=panel("Antes de salir a la cancha","✅",hayPend?"alerta":"agua");
  pc.cuerpo.appendChild(el("p","mini",hayPend?"Hay cosas que conviene resolver antes de jugar. No es obligación, pero te puede costar el partido.":"Todo en orden para salir a jugar. Igual revisá los últimos detalles."));
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
   ["estilo","Estilo",Object.keys(ESTILOS)],["presion","Presión",Object.keys(PRESIONES)]]
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
      (cnt.ofe>=6?"Muy volcado al ataque: vas a generar, pero quedás abierto atrás.":
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
  if(cl) p2.cuerpo.appendChild(el("p","mini",cl.ic+" Clima: "+cl.n+". "+cl.d));
  if(part.local) p2.cuerpo.appendChild(el("p","mini","Se espera buena taquilla: la gente está "+(E.ind.hinchada>65?"encendida":"tibia")+"."));
  if(part.local){
    const tq=ingresoPartidoLocal(part);
    p2.cuerpo.appendChild(fila("Taquilla proyectada",tq.gente.toLocaleString("es-CL")+" personas · "+plata(tq.ingreso)));
    p2.cuerpo.appendChild(el("p","mini","Ajustás el precio de cada sector en Finanzas."));
  }
  p2.cuerpo.appendChild(el("h3","sub","¿Cómo lo vivís?"));
  const bs=el("div");
  [["⚡ Simular","seguir","Lo ves en vivo. Adentro decidís: saltar al resultado al toque o seguirlo minuto a minuto."],
   ["🎯 Dirigir","dirigir","Intervenís en los momentos clave, con las barras de apoyo en vivo."]].forEach(([n,m,d])=>{
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
  const confHecha=E.flags["conf_"+E.idx];
  const bconf=el("button","btn-aqua ancho"+(confHecha?" gris":""),confHecha?"🎤 Ya diste la conferencia":"🎤 Conferencia de prensa");
  bconf.disabled=confHecha; bconf.onclick=()=>modalConferencia(part);
  p2.cuerpo.appendChild(bconf);
  p2.cuerpo.appendChild(el("p","mini","En el partido: barra espaciadora pausa · «⏩ Al resultado» lo termina al toque · Dirigir usa teclas 1 / 2 / 3."));
  rej.appendChild(p2);
  v.appendChild(rej);
  window.scrollTo({top:0});
}
/* ---------- pizarra libre (posicionar los 11 en la cancha) ---------- */
function apodoJug(n){ const p=(n||"").split(" "); return (p[p.length-1]||n).slice(0,9); }
function mismaGente(piz,once){ if(!piz||piz.length!==once.length) return false; const set=new Set(once.map(j=>j.n)); return piz.every(p=>set.has(p.n)); }
/* 6.8 · editor de alineación: armá tu XI a mano (meté suplentes, sacá titulares) */
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
        (sel.length>11?" · sacá "+(sel.length-11):"")+
        (sel.length<11?" · elegí "+(11-sel.length)+" más":"");
      c.appendChild(info);
      c.appendChild(el("p","mini","Tocá un jugador para meterlo o sacarlo del once. Los que no elijas van a la banca. 🩹 = lesionado (no disponible)."));
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
          b.onclick=()=>{ const i=sel.indexOf(j.n); if(i>=0) sel.splice(i,1); else { if(sel.length>=11){ aviso("Ya tenés 11. Sacá a alguien primero."); return; } sel.push(j.n); } pintar(); };
          cont.appendChild(b);
        });
        c.appendChild(cont);
      });
      const g=el("button","btn-aqua ancho verde","Guardar mi alineación"); g.disabled=!ok;
      g.onclick=()=>{ E.tactica.xiManual=sel.slice(); guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Alineación guardada"); };
      c.appendChild(g);
      const a=el("button","btn-aqua ancho gris","Volver a automático (el juego elige)"); a.style.marginTop="6px";
      a.onclick=()=>{ E.tactica.xiManual=null; guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Alineación automática"); };
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
        qbox.innerHTML="Química del equipo — <b style='color:"+col+"'>"+qui.prom+"</b>/100 · nivel <b>"+(qui.bono>=0?"+":"")+qui.bono.toFixed(1)+"</b>"+
          barrita(qui.prom,col)+
          (buenos.length?"<div class='mini'>💚 Se llevan bien: "+buenos.map(l=>apodoJug(l.a)+" & "+apodoJug(l.b)).join(", ")+"</div>":"")+
          (malos.length?"<div class='mini'>💢 Hay roce: "+malos.map(l=>apodoJug(l.a)+" & "+apodoJug(l.b)).join(", ")+"</div>":"")+
          "<div class='mini'>Líneas verdes = congenian; rojas punteadas = roce. Juntá a los que se llevan bien para subir el nivel.</div>";
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
 palo:{grupos:{hinchada:8,anfp:-6,prensa:-6},rep:{dureza:6,credibilidad:-2},ef:{},txt:"Calentaste la previa: la gente lo festeja, la ANFP y la prensa no."}
};
function preguntasConferencia(part){
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
  const L=[];
  if(perdioUlt) L.push({q:"Después de la caída ante "+ult.rivalNombre+", ¿sigue creyendo en el proceso o hay para preocuparse?",ops:[
     {t:"Bancar el proceso, la mano no tiembla",k:"calma"},{t:"Autocrítica: me hago cargo yo",k:"mea"},{t:"Palo: el que dude que se baje",k:"palo"}]});
  if(sinGanar>=3) L.push({q:"Son "+sinGanar+" fechas sin ganar. ¿Siente que su puesto está en discusión?",ops:[
     {t:"Poner el pecho, me hago cargo",k:"calma"},{t:"Pedir tiempo y respaldo",k:"confianza"},{t:"Calentar: acá el que trabaja soy yo",k:"palo"}]});
  if(prom) L.push({q:"Se comenta que le prometió un arreglo a "+prom.quien+". ¿Verdad o versión?",ops:[
     {t:"Confirmar y bancar al jugador",k:"confianza"},{t:"«De los temas internos no hablo»",k:"calma"},{t:"Negar todo de plano",k:"palo"}]});
  if(clasico) L.push({q:"Se viene el clásico ante "+part.rivalNombre+". ¿Qué mensaje le deja a la gente?",ops:[
     {t:"Paños fríos, foco en el fútbol",k:"calma"},{t:"Encender a la hinchada",k:"confianza"},{t:"Tirarle un palo al rival",k:"palo"}]});
  if(favorito) L.push({q:"Son favoritos claros ante "+part.rivalNombre+". ¿No los relaja la vara alta?",ops:[
     {t:"Humildad y respeto al rival",k:"calma"},{t:"Confianza total, vamos por todo",k:"confianza"},{t:"«Favorito se es en la cancha»",k:"palo"}]});
  if(bajoObj) L.push({q:"Están lejos del objetivo del año. ¿Le preocupa su continuidad?",ops:[
     {t:"Asumir la responsabilidad de frente",k:"mea"},{t:"Pedir que se banque el proyecto",k:"confianza"},{t:"Palo a la dirigencia por los refuerzos",k:"palo"}]});
  if(ganoUlt&&sinGanar===0) L.push({q:"Vienen encendidos tras ganarle a "+ult.rivalNombre+". ¿Hasta dónde sueñan?",ops:[
     {t:"Pies en la tierra, paso a paso",k:"calma"},{t:"Ilusionar a la gente",k:"confianza"},{t:"«El que quiera soñar, que sueñe»",k:"palo"}]});
  /* evergreen: siempre disponibles, para que la conferencia sea más larga y variada */
  L.push({q:"¿Cómo llega el equipo físicamente para este partido?",ops:[
     {t:"Bien, trabajamos fuerte la semana",k:"calma"},{t:"Enteros y con confianza",k:"confianza"},{t:"Mejor que el rival, seguro",k:"palo"}]});
  L.push({q:"¿Le preocupa algo puntual de "+part.rivalNombre+"?",ops:[
     {t:"Respeto total, hay que estar finos",k:"calma"},{t:"Nos preocupamos de lo nuestro",k:"confianza"},{t:"Que se preocupen ellos de nosotros",k:"palo"}]});
  L.push({q:"Un mensaje para la gente que va a ir a la cancha.",ops:[
     {t:"Que nos banque, lo vamos a dejar todo",k:"confianza"},{t:"Humildad y a alentar los 90",k:"calma"},{t:"Que vayan a ver una goleada",k:"palo"}]});
  L.push({q:"Previa ante "+part.rivalNombre+". ¿Con qué se queda de cara al partido?",ops:[
     {t:"Bajar el perfil y pedir humildad",k:"calma"},{t:"Salir con confianza total",k:"confianza"},{t:"Un palo al rival y a los árbitros",k:"palo"}]});
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
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🎤</span><span>Conferencia de prensa · '+(idx+1)+" de "+preguntas.length+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      const cl=(typeof climaPrensa==="function")?climaPrensa():{pct:50,etq:"neutral",col:"#e6c34a"};
      const bar=el("div","mini"); bar.style.margin="0 0 6px";
      bar.innerHTML="Clima de prensa para este partido: <b>"+cl.etq+"</b> <span class='mini'>(influye en cómo salís a la cancha)</span>"+
        "<div class='barrita' style='margin-top:3px'><i style='width:"+cl.pct+"%;--c:"+cl.col+"'></i></div>";
      c.appendChild(bar);
      const per=peris[idx]||eligePeri(), q=preguntas[idx];
      c.appendChild(el("div","resul mitad","<b>"+per.n+"</b> <span class='mini'>· "+per.m+"</span><br>"+q.q));
      const ops=el("div","ops");
      q.ops.forEach(o=>{
        const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div>';
        b.onclick=()=>{
          const a=CONF_ARQ[o.k]||CONF_ARQ.calma;
          if(a.grupos) aplicarGrupos(a.grupos); if(a.rep) aplicarRep(a.rep); if(a.ef) aplicarEfectos(a.ef);
          if(typeof postProc==="function") postProc("@"+per.m.replace(/\s/g,""),"prensa","«"+o.t+"», dijo el DT en conferencia ante "+part.rivalNombre+".","neutro");
          dichos.push(o.t);
          idx++;
          if(idx<preguntas.length){ pintar(); }
          else {
            E.flags["conf_"+E.idx]=true;
            notificar({t:"Conferencia de prensa dada",tipo:"neutro",bandeja:false,
              d:"Respondiste "+preguntas.length+" preguntas: «"+dichos.join("» · «")+"». El clima de prensa quedó "+
                ((typeof climaPrensa==="function"?climaPrensa().etq:"movido"))+" para el partido."});
            guardar(); cerrarModal(); pantallaPrevia(part); aviso("Conferencia terminada");
          }
        };
        ops.appendChild(b);
      });
      c.appendChild(ops);
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
  if(modo==="simular"){ correrHasta(P_ACTUAL,90); pintarPartido(); cerrarPartido(); return; }
  pintarPartido(); correrEnVivo();
}
function pintarPartido(){
  const P=P_ACTUAL; if(!P) return;
  const v=$("#vista"); v.innerHTML=""; v.dataset.sec="partido";
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
    /* saltar al resultado: la parte "instantánea" fusionada en el mismo partido */
    const bfin=el("button","btn-aqua chico verde","⏩ Al resultado"); bfin.style.marginLeft="4px";
    bfin.onclick=()=>{ clearInterval(TIMER); MOMENTO_OPS=[]; correrHasta(P,90); pintarPartido(); cerrarPartido(); };
    ctrl.appendChild(bfin);
    /* 6.18 · cambios con nombre */
    const bcam=el("button","btn-aqua chico","🔄 Cambio ("+(P.cambios||0)+"/"+(P.cambiosMax||3)+")"); bcam.style.marginLeft="4px";
    /* 6.25 · fix: no permitir cambio mientras hay una elección táctica pendiente (borraba las opciones) */
    bcam.disabled=(P.cambios||0)>=(P.cambiosMax||3) || (MOMENTO_OPS&&MOMENTO_OPS.length>0);
    bcam.onclick=modalCambio;
    ctrl.appendChild(bcam);
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
  /* 5.0 · barras de apoyo en vivo */
  if(P.modo!=="simular"){
    if(typeof actualizarApoyo==="function" && !P.apoyo) actualizarApoyo(P);
    if(P.apoyo){
      const ap=el("div","apoyo-live");
      const col=v=>v>=60?"#4fbf3f":(v>=35?"#e0a92a":"#c9392c");
      [["🎪 Ánimo hinchada",P.apoyo.hinchada],["👥 Confianza plantel",P.apoyo.plantel],["🧠 Criterio DT",P.apoyo.criterio]].forEach(([n,val])=>{
        const row=el("div","apoyo-row");
        row.innerHTML="<span class='apoyo-n'>"+n+"</span>"+barrita(val,col(val))+"<span class='apoyo-v'>"+Math.round(val)+"</span>";
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
    p.cuerpo.appendChild(el("h3","sub","📱 FutbolGram · en vivo"));
    const tk=el("div","ticker");
    P.ticker.slice(0,10).forEach(t=>{
      const d=el("div","tk "+(t.tono==="bueno"?"bien":(t.tono==="malo"?"mal":"")));
      d.innerHTML="<b>"+t.autor+"</b> <span class='mini'>"+t.m+"'</span><br>"+t.texto;
      tk.appendChild(d);
    });
    p.cuerpo.appendChild(tk);
  }
  const wrap=el("div","partido-wrap"); wrap.appendChild(p); v.appendChild(wrap);
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
  if(typeof actualizarApoyo==="function") actualizarApoyo(P);
  if(typeof tickerPost==="function") tickerPost(P,ev);
  if(typeof tickerAmbiente==="function" && (!ev||ev.tipo==="nada") && Math.random()<0.14) tickerAmbiente(P);   /* 6.36 · tuits del momento */
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
/* 6.18 · cambio manual con nombre durante el partido */
function modalCambio(){
  const P=P_ACTUAL; if(!P) return;
  if((P.cambios||0)>=(P.cambiosMax||3)){ aviso("Ya usaste todos los cambios"); return; }
  const wasPaused=PAUSADO; PAUSADO=true; clearInterval(TIMER);
  const banca=(typeof bancaPartido==="function")?bancaPartido(P):E.plantel.filter(j=>!j.vendido&&!j.cedido&&!(j.lesion>0)&&P.once.indexOf(j)<0);
  let sale=null;
  const reanudar=()=>{ cerrarModal(); PAUSADO=wasPaused; pintarPartido(); if(!PAUSADO&&!MOMENTO_OPS.length) correrEnVivo(); };
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🔄</span><span>Cambio '+((P.cambios||0)+1)+' / '+(P.cambiosMax||3)+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini","Elegí quién SALE y quién ENTRA. Al minuto "+P.min+"."));
      c.appendChild(el("h3","sub","Sale de la cancha"));
      const g1=el("div","align-grid");
      P.once.forEach(j=>{
        const b=el("button","align-jug"+(sale===j?" on":""));
        b.innerHTML="<b>"+(sale===j?"✓ ":"")+j.n+"</b><span class='mini'>"+j.pos+" · cansancio "+Math.round(j.cansancio||0)+"</span>";
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
          b.innerHTML="<b>"+j.n+"</b><span class='mini'>"+j.pos+" · niv "+j.nivel+" · forma "+Math.round(j.forma)+"</span>";
          b.onclick=()=>{ if(hacerCambio(P,sale,j)){ reanudar(); aviso(j.n+" entra por "+sale.n); } };
          g2.appendChild(b);
        });
        c.appendChild(g2);
      }
      const x=el("button","btn-aqua ancho gris","Cerrar sin cambiar"); x.style.marginTop="6px";
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
  const m=momentoActual(P);
  const esTrivia=m.tipo==="trivia";
  const p=panel(m.t,esTrivia?"🧮":"🧠","alerta");
  p.cuerpo.appendChild(el("p",null,m.d));
  if(esTrivia) p.cuerpo.appendChild(el("p",null,"<b>"+m.q+"</b>"));
  const ops=el("div","ops ops-part"); MOMENTO_OPS=[];
  m.op.forEach((o,i)=>{
    const b=el("button","op"+(o.doping?" op-doping":""));
    b.innerHTML='<div class="t"><span class="tecla">'+(i+1)+'</span> '+o.t+'</div>'+(o.d?'<div class="d">'+o.d+'</div>':"");
    b.onclick=()=>{
      MOMENTO_OPS=[];
      if(esTrivia){
        if(o.ok){
          P.empuje+=1.2; P.ataque+=1; P.orden+=0.5;
          if(Math.random()<0.28 && typeof anotaPropio==="function"){ anotaPropio(P,P.min); aviso("¡Correcto! Y encima cayó el gol 🎯"); }
          else aviso("¡Correcto! Se soltaron 🎯");
        } else { P.empuje-=0.8; P.orden-=0.5; aviso("Nada que ver… se pusieron nerviosos 😬"); }
        avanzarMomento(P); return;
      }
      if(o.doping){ confirmarDoping(P,o.costo); return; }   /* async */
      aplicarMomento(P,o.ef); avanzarMomento(P);
    };
    ops.appendChild(b); MOMENTO_OPS.push(b);
  });
  p.cuerpo.appendChild(ops);
  p.cuerpo.appendChild(el("p","mini",esTrivia?"Elegí la respuesta con 1 / 2 / 3.":"Elegí con 1 / 2 / 3 / 4 · flechas y Enter."));
  (document.querySelector(".partido-wrap")||$("#vista")).appendChild(p);
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
   Dibujás dónde va la pelota (tocás/arrastrás dentro del arco),
   elegís el efecto, y el arquero se tira cuando pateás. Diseñado
   para ser JUSTO: si apuntás a un rincón, la metés casi siempre;
   solo el centro flojo o apuntarle al arquero se atajan.
   ============================================================ */
/* geometría del arco (en coords del viewBox 0 0 320 210) */
const PEN_ARCO={x0:44,x1:276,y0:34,y1:150};
function penZona(x,y){
  const A=PEN_ARCO, w=A.x1-A.x0;
  const fuera = (x < A.x0-16) || (x > A.x1+16) || (y < A.y0-16);
  let cx=clamp(x,A.x0+6,A.x1-6), cy=clamp(y,A.y0+6,A.y1-2);
  const t=(cx-A.x0)/w;
  const tercio = t<0.34?"izq":(t<0.66?"centro":"der");
  const alt = cy < (A.y0+A.y1)/2 ? "alto":"bajo";
  return {tercio:tercio, alt:alt, fuera:fuera, cx:cx, cy:cy};
}
function penArqueroTira(aim,arqNivel){
  const lee=clamp(0.12+(arqNivel-70)*0.006,0.05,0.32);
  if(Math.random()<lee) return aim.tercio;               /* te leyó */
  return elige(["izq","izq","centro","der","der"]);      /* al bulto, poco centro */
}
function penResolver(aim,kdir,efecto,patNivel,arqNivel){
  if(aim.fuera) return {res:"afuera",p:0};
  const rincon=aim.tercio!=="centro", acerto=(kdir===aim.tercio);
  let g;
  if(efecto==="picadita"){
    g=(kdir!=="centro")?0.90:0.30;                        /* la pica: mata al que se tira */
    if(aim.alt==="alto") g+=0.05;
  } else {
    if(!acerto) g=rincon?0.95:0.86;
    else g=rincon?(aim.alt==="alto"?0.72:0.60):(aim.alt==="alto"?0.50:0.26);
    if(efecto==="potente") g+=0.06;
  }
  g+=(patNivel-70)*0.004-(arqNivel-70)*0.004;
  g=clamp(g,0.12,0.98);
  return {res:(Math.random()<g)?"gol":"atajado",p:g};
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
function minijuegoPenal(P,pateador){
  const arq=arqueroDe(P.rivalPlantel)||{n:"el arquero",nivel:70};
  let aim=null, efecto="colocado", tirado=false;
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">🥅</span><span>Penal · dibujá tu tiro</span>'));
    const c=el("div","cuerpo penal-mini"); box.appendChild(c);
    c.appendChild(el("p","mini","Patea <b>"+pateador.n+"</b> ante <b>"+arq.n+"</b>. Tocá dentro del arco dónde querés ponerla y apretá <b>¡Patear!</b>. Los rincones son casi imparables; al medio flojo te la atajan."));
    const NS="http://www.w3.org/2000/svg";
    const svg=document.createElementNS(NS,"svg");
    svg.setAttribute("viewBox","0 0 320 210"); svg.setAttribute("class","penal-svg");
    svg.style.cssText="width:100%;max-width:420px;display:block;margin:6px auto;touch-action:none;cursor:crosshair";
    svg.innerHTML=
      '<defs><linearGradient id="pgcielo" x1="0" y1="0" x2="0" y2="1">'+
      '<stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#eaf7ff"/></linearGradient>'+
      '<linearGradient id="pgpasto" x1="0" y1="0" x2="0" y2="1">'+
      '<stop offset="0" stop-color="#8fd06a"/><stop offset="1" stop-color="#5faf46"/></linearGradient></defs>'+
      '<rect x="0" y="0" width="320" height="150" fill="url(#pgcielo)"/>'+
      '<rect x="0" y="150" width="320" height="60" fill="url(#pgpasto)"/>'+
      /* red */
      '<rect x="44" y="34" width="232" height="116" fill="rgba(255,255,255,.18)" stroke="#f4f8ff" stroke-width="5"/>'+
      '<g stroke="rgba(255,255,255,.55)" stroke-width="1">'+
      '<line x1="80" y1="34" x2="80" y2="150"/><line x1="122" y1="34" x2="122" y2="150"/>'+
      '<line x1="160" y1="34" x2="160" y2="150"/><line x1="198" y1="34" x2="198" y2="150"/>'+
      '<line x1="240" y1="34" x2="240" y2="150"/>'+
      '<line x1="44" y1="72" x2="276" y2="72"/><line x1="44" y1="110" x2="276" y2="110"/></g>'+
      /* arquero */
      '<g id="pen-arq"><ellipse cx="160" cy="150" rx="20" ry="6" fill="rgba(0,0,0,.18)"/>'+
      '<rect x="146" y="96" width="28" height="52" rx="8" fill="#ffcf3f" stroke="#c98a1a" stroke-width="1.5"/>'+
      '<circle cx="160" cy="90" r="9" fill="#f2c9a0" stroke="#b98a63" stroke-width="1"/></g>'+
      /* linea de tiro punteada + marcador de puntería */
      '<line id="pen-linea" x1="160" y1="196" x2="160" y2="196" stroke="#e8453a" stroke-width="2.5" stroke-dasharray="5 4" opacity="0"/>'+
      '<circle id="pen-mira" cx="160" cy="90" r="8" fill="none" stroke="#e8453a" stroke-width="2.5" opacity="0"/>'+
      /* pelota */
      '<circle id="pen-bola" cx="160" cy="196" r="7" fill="#fff" stroke="#333" stroke-width="1"/>';
    c.appendChild(svg);
    const bola=svg.querySelector("#pen-bola"), mira=svg.querySelector("#pen-mira"),
          linea2=svg.querySelector("#pen-linea"), arqEl=svg.querySelector("#pen-arq");
    function aSVG(ev){
      const r=svg.getBoundingClientRect();
      const px=(ev.touches?ev.touches[0].clientX:ev.clientX)-r.left;
      const py=(ev.touches?ev.touches[0].clientY:ev.clientY)-r.top;
      return {x:px*320/r.width, y:py*210/r.height};
    }
    function marcar(pt){
      if(tirado) return;
      aim=penZona(pt.x,pt.y);
      mira.setAttribute("cx",aim.cx); mira.setAttribute("cy",aim.cy);
      mira.setAttribute("stroke",aim.fuera?"#f0a500":"#e8453a"); mira.setAttribute("opacity","1");
      linea2.setAttribute("x2",aim.cx); linea2.setAttribute("y2",aim.cy); linea2.setAttribute("opacity",".9");
      bpat.disabled=false;
      etiq.textContent=aim.fuera?"⚠ Le estás apuntando demasiado arriba/afuera…":
        ("Apuntás al "+(aim.alt==="alto"?"palo alto ":"")+(aim.tercio==="centro"?"centro":"rincón "+aim.tercio)+".");
    }
    svg.addEventListener("pointerdown",e=>{ e.preventDefault(); marcar(aSVG(e)); });
    svg.addEventListener("pointermove",e=>{ if(e.buttons||e.pressure){ e.preventDefault(); marcar(aSVG(e)); } });
    /* efecto */
    const efRow=el("div","penal-ef");
    [["colocado","🎯 Colocado","equilibrado, lo más seguro"],
     ["potente","💥 Potente","más difícil de atajar, aunque acierte"],
     ["picadita","🥄 Picadita","letal si el arquero se tira; muerte si se queda"]].forEach(([k,t,d])=>{
      const b=el("button","btn-aqua chico"+(efecto===k?"":" gris"),t); b.title=d;
      b.onclick=()=>{ efecto=k; [...efRow.children].forEach(x=>x.classList.add("gris")); b.classList.remove("gris"); };
      efRow.appendChild(b);
    });
    c.appendChild(efRow);
    const etiq=el("p","mini","Tocá el arco para elegir dónde ponerla."); c.appendChild(etiq);
    const bpat=el("button","btn-aqua ancho verde","¡Patear!"); bpat.disabled=true;
    bpat.onclick=()=>{
      if(!aim||tirado) return; tirado=true; bpat.disabled=true;
      const kdir=penArqueroTira(aim,arq.nivel||70);
      const out=penResolver(aim,kdir,efecto,pateador.nivel||70,arq.nivel||70);
      /* el arquero se tira */
      const dx=kdir==="izq"?-58:(kdir==="der"?58:0), rot=kdir==="izq"?-42:(kdir==="der"?42:0);
      arqEl.style.transition="transform .45s cubic-bezier(.2,.8,.2,1)";
      arqEl.style.transform="translate("+dx+"px,"+(kdir==="centro"?-6:14)+"px) rotate("+rot+"deg)";
      /* la pelota viaja a la puntería (o arriba si fue afuera) */
      const destY=out.res==="afuera"?18:aim.cy, destX=out.res==="afuera"?aim.cx:aim.cx;
      penTween(bola,{cx:destX,cy:destY},480,()=>{
        etiq.innerHTML="<b>"+(out.res==="gol"?"⚽ ¡GOOOL!":(out.res==="afuera"?"😵 Afuera…":"🧤 ¡Atajado!"))+"</b>";
        bola.setAttribute("fill",out.res==="gol"?"#5ec94f":"#fff");
        setTimeout(()=>{
          cerrarModal();
          penalEnPartido(P,true,null,pateador,out.res==="gol"?true:(out.res==="afuera"?"afuera":false));
          pintarPartido(); reanudarPronto();
        },780);
      });
    };
    c.appendChild(bpat);
  },{cerrarFuera:false});
  return true;   /* async: el caller NO debe seguir el partido todavía */
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
  let titulo="", opciones=[];
  if(ev.tipo==="penal"){
    titulo="¡Penal a favor! ¿Quién patea?";
    opciones=candidatosPenal(P).map(j=>({t:j.n+" · "+((j.rasgos&&j.rasgos.includes("penales"))?"especialista":"nivel "+j.nivel),
      run:()=> P.modo==="dirigir" ? minijuegoPenal(P,j) : penalEnPartido(P,true,null,j)}));
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
  const ops=el("div","ops ops-part"); MOMENTO_OPS=[];
  opciones.forEach((o,i)=>{
    const b=el("button","op");
    b.innerHTML='<div class="t"><span class="tecla">'+(i+1)+'</span> '+o.t+'</div>';
    b.onclick=()=>{ MOMENTO_OPS=[]; const async=o.run(); if(!async){ pintarPartido(); reanudarPronto(); } };
    ops.appendChild(b); MOMENTO_OPS.push(b);
  });
  p.cuerpo.appendChild(ops);
  p.cuerpo.appendChild(el("p","mini","Elegí con 1 / 2 / 3 · flechas y Enter."));
  (document.querySelector(".partido-wrap")||$("#vista")).appendChild(p);
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
  seccionPrensa(p,res,P);

  const b=el("button","btn-aqua ancho verde","Cerrar y seguir la semana");
  b.onclick=()=>{
    P_ACTUAL=null;
    if(typeof procesarSemanaPostPartido==="function"){
      const r=procesarSemanaPostPartido();
      if(r&&r.ev&&r.ev.tipo==="decision") return;
    }
    irA("escritorio");
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
 bancar:  {grupos:{camarin:8,prensa:3},rep:{publica:2},ef:{moral:4},txt:"Pusiste la cara por el grupo. El vestuario lo valora."},
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
     {t:"Con la humildad para seguir",k:"humilde"},{t:"Con el laburo del plantel",k:"elogio"},{t:"Con un palo para los que dudaban",k:"palo"}]});
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
      return;
    }
    const per=eligePeri();
    const q=elegirPreguntaPrensa(preguntasPostPartido(res,P));
    zonaPrensa.appendChild(el("div","resul mitad","<b>"+per.n+"</b> <span class='mini'>· "+per.m+"</span><br>"+q.q));
    const ops=el("div","ops");
    q.ops.forEach(o=>{
      const a=POST_ARQ[o.k]||POST_ARQ.foco;
      const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div>';
      b.onclick=()=>{
        if(a.ef) aplicarEfectos(a.ef); if(a.grupos) aplicarGrupos(a.grupos); if(a.rep) aplicarRep(a.rep);
        if(typeof postProc==="function") postProc("@"+per.m.replace(/\s/g,""),"prensa","«"+o.t+"», respondió el DT ante "+q.q.slice(0,40).replace(/«|»/g,"")+"…","neutro");
        notificar({t:"Declaraciones a "+per.n,tipo:"neutro",d:"«"+o.t+"». "+a.txt,bandeja:false});
        if(typeof recordar==="function"&&o.k==="palo") recordar("prensa","calentaste la sala de prensa después de "+(res.yo>res.otro?"ganarle":"jugar contra")+" a "+P.part.rivalNombre,{peso:"bajo"});
        guardar(); hecho=true; zonaPrensa.innerHTML=""; zonaPrensa.appendChild(el("div","resul bien","«"+o.t+"» — "+a.txt));
      };
      ops.appendChild(b);
    });
    zonaPrensa.appendChild(ops);
  }
  pintarZonaPrensa();
}
