"use strict";
/* ============================================================
   FUTBOLINI 3.0 · ui.js
   Todo lo que se ve, más el arranque del juego.
   ============================================================ */
let SEC="escritorio";
const SECCIONES=[
 ["escritorio","🗂️","Escritorio"],["institucion","🏛️","Institución"],["finanzas","💰","Finanzas"],
 ["plantel","👥","Plantel"],["mercado","🧳","Mercado"],["redes","📱","Redes"],["calendario","📅","Calendario"],["historia","📚","Historia"],
 ["carrera","🎖️","Carrera"],["avisos","🔔","Avisos"],["ajustes","⚙️","Ajustes"]
];
function irA(s){ SEC=s; render(); window.scrollTo({top:0}); }

/* ---------------- barra y menú ---------------- */
function pintarBarra(){
  const bd=$("#barraDatos"); bd.innerHTML="";
  const badge=$("#avisoBadge");
  if(!E){ $("#escudo").textContent="⚽"; if(badge) badge.classList.add("oculto"); return; }
  if(badge){ const n=notifsNoLeidas(); badge.textContent=n>9?"9+":String(n); badge.classList.toggle("oculto",!n); }
  $("#escudo").textContent=CLUB_INFO[E.club].esc;
  const part=proximoPartido();
  const datos=[
   ["Club",E.clubNombre],
   ["Fecha",(part?fechaTxt(part.f):"cierre")+" · "+E.anio],
   ["Caja",plata(E.plata),E.plata<100],
   ["Deuda",plata(E.deuda),E.deuda>3000],
   ["Capital inst.",E.capital+"/100",E.capital<15],
   ["Imagen",Math.round(E.rep.publica)+"/100",E.rep.publica<25]
  ];
  datos.forEach(([k,v,al])=>{
    bd.appendChild(el("div","bd"+(al?" alerta":""),'<div class="k">'+k+'</div><div class="v">'+v+'</div>'));
  });
}
function pintarMenu(){
  const m=$("#menu"); m.innerHTML="";
  if(!E){ m.classList.add("oculto"); return; }
  m.classList.remove("oculto");
  SECCIONES.forEach(([id,ic,n])=>{
    const b=el("button","mi",'<span>'+ic+'</span><span>'+n+'</span>');
    b.setAttribute("role","tab");
    b.setAttribute("aria-selected",SEC===id?"true":"false");
    if(id==="escritorio"&&E.decPend.length) b.appendChild(el("span","pip",String(E.decPend.length)));
    if(id==="avisos"&&notifsNoLeidas()) b.appendChild(el("span","pip",String(notifsNoLeidas())));
    b.onclick=()=>irA(id);
    m.appendChild(b);
  });
}
/* ---------------- render ---------------- */
function render(){
  pintarBarra(); pintarMenu();
  const v=$("#vista"); v.innerHTML="";
  $("#btnAvanzar").classList.toggle("oculto",!E);
  if(!E){ pantallaInicio(); return; }
  if(E.carrera.fin){ v.appendChild(pantallaFinCarrera()); return; }
  if(E.carrera.enParo){ v.appendChild(pantallaSinClub()); return; }
  ({escritorio:vistaEscritorio,institucion:vistaInstitucion,finanzas:vistaFinanzas,plantel:vistaPlantel,
    mercado:vistaMercado,redes:vistaRedes,calendario:vistaCalendario,historia:vistaHistoria,carrera:vistaCarrera,
    avisos:vistaAvisos,ajustes:vistaAjustes}[SEC]||vistaEscritorio)();
}
/* ---------------- inicio ---------------- */
function pantallaInicio(){
  const v=$("#vista");
  const p=panel("Futbolini 3.0","🏟️");
  p.cuerpo.appendChild(el("h2","tit","No manejas un equipo. Manejas una institución."));
  p.cuerpo.appendChild(el("p",null,"Gente con intereses distintos empujando para lados distintos, plata que se acaba, "+
   "reglas internas que podés cambiar si tenés el poder para hacerlo, y una historia real que podés seguir o romper."));
  p.cuerpo.appendChild(el("div","resul mitad",
   "<b>Antes de entrar.</b> Este juego usa nombres reales de clubes, jugadores y dirigentes del fútbol chileno. "+
   "Los resultados, títulos y fechas se apoyan en registros públicos, pero <b>todo lo demás es ficción</b>: "+
   "las conversaciones, las negociaciones, los conflictos internos y cualquier frase atribuida a alguien están inventados "+
   "para efectos del juego. Nada de lo que pase acá adentro ocurrió así en la vida real."));
  v.appendChild(p);

  const paso1=panel("1 · Elegí club","⚪");
  const g=el("div","iconos");
  Object.keys(CLUB_INFO).forEach(id=>{
    const c=CLUB_INFO[id];
    const b=el("button","icono",'<span class="g">'+c.esc+'</span><span class="n">'+c.n+'</span>');
    b.onclick=()=>elegirEpoca(id);
    g.appendChild(b);
  });
  paso1.cuerpo.appendChild(g);
  paso1.cuerpo.appendChild(el("p","mini","Después elegís época: 1991 (calendario real completo, Campeonato de 16 equipos y el camino verdadero de la Copa Libertadores de Colo-Colo) o 2026 (Primera División actual, con planteles aproximados y 3 puntos por victoria)."));
  v.appendChild(paso1);
}
function elegirEpoca(id){
  let base=1991, modo="historico";
  const anioDe=b=>b===2026?2026:1991;
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      const D=datosEra(base), info=D.info[id];
      box.appendChild(el("div","cab",'<span class="ic">'+info.esc+'</span><span>'+info.n+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);

      c.appendChild(el("h3","sub","1 · Elegí época"));
      const fe=el("div","fichas");
      [[1991,"1991 · Fase A"],[2026,"2026 · actual"]].forEach(([b,n])=>{
        const btn=el("button","ficha",n);
        btn.setAttribute("aria-pressed",base===b?"true":"false");
        btn.onclick=()=>{ base=b; pintar(); };
        fe.appendChild(btn);
      });
      c.appendChild(fe);
      c.appendChild(el("p","mini",ERA[base].desc));
      c.appendChild(el("p",null,info.desc));

      c.appendChild(el("h3","sub","2 · Elegí modo"));
      const f=el("div","fichas");
      [["historico","Histórico","Los hechos reales pasan igual, salvo que los cambies."],
       ["libre","Libre","La historia es solo el punto de partida."],
       ["caos","Caos","Eventos improbables activados. Acá pasa lo imposible."]].forEach(([k,n,d])=>{
        const b=el("button","ficha",n);
        b.title=d; b.setAttribute("aria-pressed",modo===k?"true":"false");
        b.onclick=()=>{ modo=k; pintar(); };
        f.appendChild(b);
      });
      c.appendChild(f);

      c.appendChild(el("h3","sub","3 · Briefing"));
      const ib=D.ind[id], cb=D.caja[id];
      c.appendChild(fila("Época","Campeonato de "+(base===2026?LIGA_2026.length:LIGA91.length)+" equipos · victoria vale "+ERA[base].puntosVictoria+" puntos"));
      c.appendChild(fila("Deportivo","plantel "+ib.plantel+" · cantera "+ib.cantera));
      c.appendChild(fila("Económico",plata(cb.plata)+" en caja · "+plata(cb.deuda)+" de deuda"));
      c.appendChild(fila("Interno","hinchada "+ib.hinchada+" · socios "+ib.socios+" · riesgo "+ib.riesgo));
      if(base===2026) c.appendChild(el("div","resul mitad","<b>Aviso.</b> Los planteles 2026 son <b>aproximados</b> y pueden haber cambiado en el mercado: verificá los nombres. Los tres grandes traen plantel de referencia; el resto se completa con jugadores generados."));

      const go=el("button","btn-aqua ancho verde","Empezar en "+anioDe(base));
      go.style.marginTop="12px";
      go.onclick=()=>{ cerrarModal(); nuevaPartida(id,anioDe(base),modo); SEC="escritorio"; render();
        aviso("Empieza la temporada "+anioDe(base)); };
      c.appendChild(go);
    };
    pintar();
  });
}
/* ---------------- escritorio ---------------- */
function vistaEscritorio(){
  const v=$("#vista");
  const rej=el("div","rejilla dos");
  const izq=el("div"), der=el("div");

  /* próximo compromiso */
  const part=proximoPartido();
  const p=panel("Próximo compromiso","📌",part&&part.tipo==="copa"?"agua":"");
  if(part){
    p.cuerpo.appendChild(el("h2","tit",(part.local?"vs ":"visita a ")+part.rivalNombre));
    p.cuerpo.appendChild(el("p","mini",(part.tipo==="copa"?"Copa Libertadores · "+part.ronda:"Campeonato Nacional · fecha "+part.fecha)+
      " · "+fechaTxt(part.f)+" · "+part.sede));
    const b=el("button","btn-aqua ancho verde","Ir al partido");
    b.onclick=()=>{ if(bloqueoDecisiones()) return; pantallaPrevia(part); };
    p.cuerpo.appendChild(b);
  } else {
    p.cuerpo.appendChild(el("p",null,"No quedan partidos. Toca cerrar la temporada "+E.anio+"."));
    const b=el("button","btn-aqua ancho verde","Cerrar temporada");
    b.onclick=cerrarTemporada;
    p.cuerpo.appendChild(b);
  }
  izq.appendChild(p);

  /* decisiones */
  const pd=panel("Decisiones sobre la mesa","📥",E.decPend.some(x=>x.peso==="alto")?"alerta":"");
  if(!E.decPend.length) pd.cuerpo.appendChild(el("p","mini","Nada pendiente. Por ahora."));
  E.decPend.forEach(x=>{
    const d=decisionPorId(x.id); if(!d) return;
    const b=el("button","op");
    b.innerHTML='<div class="t">'+BUZONES[d.buzon].ic+" "+resolverTokens(d.t,E)+'</div>'+
      '<div class="d">'+BUZONES[d.buzon].n+(x.peso==="alto"?" · <b>hay que resolverla antes del próximo partido</b>":"")+'</div>';
    b.onclick=()=>abrirDecision(d);
    pd.cuerpo.appendChild(b);
  });
  izq.appendChild(pd);

  /* bandeja de novedades */
  const pb=panel("Lo que pasó esta semana","📰");
  if(!E.bandeja.length) pb.cuerpo.appendChild(el("p","mini","Sin novedades."));
  E.bandeja.slice(0,7).forEach(it=>{
    const d=el("div","resul "+(it.tipo==="malo"?"mal":(it.tipo==="bueno"?"bien":"mitad")));
    d.innerHTML="<b>"+it.t+"</b><br>"+it.d+(it.extra?"<br><span class='mini'>"+it.extra+"</span>":"");
    pb.cuerpo.appendChild(d);
  });
  izq.appendChild(pb);

  /* estado */
  const pe=panel("Estado del club","📊","agua");
  IND.forEach(i=>{
    const v2=E.ind[i.k];
    pe.cuerpo.appendChild(el("div",null,'<div class="fila" style="border:none;padding:2px 0"><span>'+i.n+'</span><b>'+v2+'</b></div>'+barrita(v2,i.c)));
  });
  der.appendChild(pe);

  /* modificadores activos */
  const pm=panel("Modificadores activos","⏳");
  const activos=E.mods.filter(m=>m.hasta>=E.anio);
  if(!activos.length) pm.cuerpo.appendChild(el("p","mini","Ninguno."));
  activos.forEach(m=>pm.cuerpo.appendChild(fila(m.n,m.hasta>9000?"permanente":("hasta "+m.hasta))));
  der.appendChild(pm);

  /* temporada */
  const pt=panel("Temporada "+E.anio,"🏁");
  const t=E.temporada;
  pt.cuerpo.appendChild(fila("Campeonato","PJ "+t.pj+" · "+t.pg+"G "+t.pe+"E "+t.pp+"P"));
  pt.cuerpo.appendChild(fila("Puntos",t.pts+" · "+(t.pj?ordinal(posicionEnTabla())+" lugar":"—")));
  pt.cuerpo.appendChild(fila("Goles",t.gf+" a favor · "+t.gc+" en contra"));
  der.appendChild(pt);

  rej.appendChild(izq); rej.appendChild(der); v.appendChild(rej);
}
function bloqueoDecisiones(){
  const b=decisionesBloqueantes();
  if(b.length){ aviso("Primero hay que resolver: "+resolverTokens(decisionPorId(b[0].id).t,E)); abrirDecision(decisionPorId(b[0].id)); return true; }
  return false;
}
/* ---------------- decisión ---------------- */
function abrirDecision(d,enModal){
  const pintar=(cont)=>{
    cont.innerHTML="";
    const p=panel(BUZONES[d.buzon].n,BUZONES[d.buzon].ic,d.peso==="alto"?"alerta":"");
    p.classList.add("dec");
    p.cuerpo.appendChild(el("h2","tit",resolverTokens(d.t,E)));
    p.cuerpo.appendChild(el("div","ctx",resolverTokens(d.d,E)));
    if(d.posturas){
      const ps=el("div","posturas");
      Object.keys(d.posturas).forEach(k=>{
        const g=GRUPO_POR_ID[k]; if(!g) return;
        const e2=etiquetaPostura(d.posturas[k]);
        ps.appendChild(el("span","pos "+e2.c,g.ic+" <b>"+g.n+"</b> "+e2.t));
      });
      p.cuerpo.appendChild(ps);
    }
    if(d.consejo){
      const cal=(E.staff.deportivo+E.staff.tesorero+E.staff.prensa)/3;
      [["deportivo","Gerencia deportiva"],["tesorero","Tesorería"],["prensa","Jefatura de prensa"]].forEach(([k,n])=>{
        if(!d.consejo[k]) return;
        const c=el("div","consejo");
        c.innerHTML='<div class="quien">'+n+'</div>'+resolverTokens(d.consejo[k],E);
        p.cuerpo.appendChild(c);
      });
      if(cal<50) p.cuerpo.appendChild(el("p","mini","Tu equipo asesor no es de los mejores. Tomá sus lecturas con pinzas."));
    }
    const ya=E.decHechas[d.id+"_"+E.anio];
    if(ya){
      const r=el("div","resul "+(ya.tier==="bien"?"bien":ya.tier==="mitad"?"mitad":"mal"));
      r.innerHTML="<b>"+ya.t+"</b><br>"+ya.txt+(ya.extra?"<br><span class='mini'>"+ya.extra+"</span>":"");
      p.cuerpo.appendChild(r);
      if(d.historia) p.cuerpo.appendChild(el("p","mini","<b>En la vida real:</b> "+d.historia));
      const b=el("button","btn-aqua ancho gris","Cerrar");
      b.onclick=()=>{ if(enModal) cerrarModal(); else irA("escritorio"); };
      p.cuerpo.appendChild(b);
    } else {
      const ops=el("div","ops");
      d.op.forEach((o,i)=>{
        const chk=requisitoCumplido(o);
        const b=el("button","op");
        b.disabled=!chk.ok;
        b.innerHTML='<div class="t">'+resolverTokens(o.t,E)+'</div><div class="d">'+(o.d||"")+'</div>'+
          (textoRequisitos(o)?'<div class="req">'+textoRequisitos(o)+(chk.ok?"":" · <b>"+chk.txt+"</b>")+'</div>':"");
        b.onclick=()=>{
          const r=resolverDecision(d,i);
          if(!r) return;
          notificar({t:"Decisión: "+resolverTokens(d.t,E),
            tipo:r.tier==="bien"?"bueno":(r.tier==="mal"?"malo":"neutro"),
            d:"Elegiste «"+resolverTokens(o.t,E)+"». "+r.txt,extra:r.extra,bandeja:false});
          aviso(r.hist?"Seguiste el camino histórico":"Tu línea se separa de la historia");
          pintar(cont);
          pintarBarra(); pintarMenu();
        };
        ops.appendChild(b);
      });
      p.cuerpo.appendChild(ops);
    }
    cont.appendChild(p);
  };
  if(enModal){ modal(box=>{ box.classList.remove("panel"); pintar(box); }); }
  else { const v=$("#vista"); v.innerHTML=""; pintar(v); window.scrollTo({top:0}); }
}
/* ---------------- institución ---------------- */
function vistaInstitucion(){
  const v=$("#vista");
  const p=panel("Capital institucional","⚖️","agua");
  p.cuerpo.appendChild(el("h2","tit",E.capital>100?(E.capital+" 💪"):(E.capital+" / 100")));
  p.cuerpo.appendChild(el("div",null,barrita(E.capital,"#39b7e0")));
  p.cuerpo.appendChild(el("p","mini","Es lo que podés imponer sin que se te caiga el club encima. Se gasta forzando decisiones y cambiando estatutos."+
    (E.capital>100?" Pasaste los 100: tenés un poder político enorme para hacer lo que quieras.":"")+
    " Este año vas a generar aproximadamente <b>"+signo(capitalAnual())+"</b>."));
  v.appendChild(p);

  const pg=panel("Grupos de interés","👥");
  GRUPOS.forEach(g=>{
    const x=E.grupos[g.id];
    const d=el("div");
    d.innerHTML='<div class="fila" style="border:none;padding:3px 0"><span>'+g.ic+" <b>"+g.n+'</b> <span class="mini">poder '+x.poder+'</span></span>'+
      '<b>'+etiquetaAprobacion(x.aprob)+' ('+signo(x.aprob)+')</b></div>'+
      barrita(x.aprob+100,x.aprob>=0?"#4fbf3f":"#c9392c",200)+
      '<div class="mini" style="margin-top:3px">'+g.quiere+'</div>';
    if(x.aprob<-45) d.appendChild(el("div","mini","⚠ "+g.castigo));
    pg.cuerpo.appendChild(d);
  });
  v.appendChild(pg);

  const pe=panel("Estatutos del club","📜");
  pe.cuerpo.appendChild(el("p","mini","Cambiar un estatuto cuesta capital institucional y molesta a quien pierde con el cambio. Queda vigente hasta que lo vuelvas a tocar."));
  ESTATUTOS.forEach(cat=>{
    const actual=cat.op.find(o=>o.id===E.estatutos[cat.id]);
    const d=el("div");
    d.innerHTML='<div class="fila"><span>'+cat.ic+" "+cat.n+'</span><b>'+(actual?actual.n:"—")+'</b></div>';
    const f=el("div","fichas");
    cat.op.forEach(o=>{
      if(o.id===E.estatutos[cat.id]) return;
      const costo=cat.pesado?42:22;
      const b=el("button","ficha",o.n+" · "+costo);
      b.title=o.d;
      b.onclick=()=>cambiarEstatuto(cat,o,costo);
      f.appendChild(b);
    });
    d.appendChild(f);
    pe.cuerpo.appendChild(d);
  });
  v.appendChild(pe);
}
function cambiarEstatuto(cat,op,costo){
  if(E.capital<costo){ aviso("No te alcanza el capital institucional ("+costo+" necesarios)"); return; }
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">'+cat.ic+'</span><span>'+cat.n+" → "+op.n+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p",null,op.d));
    const ps=el("div","posturas");
    Object.keys(op.ef||{}).forEach(k=>{
      const g=GRUPO_POR_ID[k]; if(!g) return;
      const e2=etiquetaPostura(op.ef[k]);
      ps.appendChild(el("span","pos "+e2.c,g.ic+" <b>"+g.n+"</b> "+e2.t));
    });
    c.appendChild(ps);
    c.appendChild(el("p","mini","Cuesta "+costo+" de capital institucional. Tenés "+E.capital+"."));
    if(cat.pesado) c.appendChild(el("div","resul mal","Tocar la identidad del club es lo más caro que podés hacer. Si la comunidad y los socios se te dan vuelta al mismo tiempo, puede terminar en una ruptura institucional."));
    const b=el("button","btn-aqua ancho verde","Promulgar");
    b.onclick=()=>{
      E.capital-=costo;
      E.estatutos[cat.id]=op.id;
      aplicarGrupos(op.ef||{});
      aplicarEstatutosMod();
      cerrarModal(); guardar(); render();
      aviso("Nuevo estatuto: "+op.n);
    };
    c.appendChild(b);
    const x=el("button","btn-aqua ancho gris","Cancelar"); x.style.marginTop="6px"; x.onclick=cerrarModal;
    c.appendChild(x);
  });
}
/* ---------------- finanzas ---------------- */
function vistaFinanzas(){
  const v=$("#vista");
  const p=panel("Caja","💰");
  p.cuerpo.appendChild(fila("Disponible",plata(E.plata)));
  p.cuerpo.appendChild(fila("Deuda total",plata(E.deuda)));
  p.cuerpo.appendChild(fila("Planilla anual",plata(planillaAnual())));
  p.cuerpo.appendChild(fila("Entra por semana",plata(ingresoSemanal())));
  p.cuerpo.appendChild(fila("Sale por semana",plata(costoSemanal())));
  const neto=ingresoSemanal()-costoSemanal();
  p.cuerpo.appendChild(fila("Resultado semanal",plata(neto),neto<0?"":""));
  if(E.flags&&E.flags.sueldosAtrasados) p.cuerpo.appendChild(el("div","resul mal","⚠ Sueldos atrasados: la moral del plantel cae cada semana hasta que regularices la caja."));
  if(E.flags&&E.flags.clausura) p.cuerpo.appendChild(el("div","resul mal","⚠ Estadio con sectores clausurados por la deuda: perdés aforo y taquilla."));
  p.cuerpo.appendChild(el("p","mini","Los partidos de local suman taquilla aparte. Todos los montos están en millones de pesos de la época."));
  v.appendChild(p);

  /* --- precios por sector con sliders y proyección en vivo --- */
  const pe=panel("Precios de entradas","🎫","agua");
  pe.cuerpo.appendChild(el("p","mini","Fijá el precio de cada sector. Subir el precio deja más por entrada pero espanta público (la galería es la más sensible). La proyección se actualiza al instante."));
  const proy=el("div","resul mitad"); proy.id="proyTaq";
  const refrescarProy=()=>{
    const r=proyeccionTaquilla(E.precios);
    const club=CLUB_POR_ID[E.club]||{aforo:30000};
    const ocupPct=Math.round(100*r.gente/Math.max(1,club.aforo*clausuraFactor()));
    proy.innerHTML="Partido de local tipo → <b>"+r.gente.toLocaleString("es-CL")+"</b> personas ("+ocupPct+"% del aforo) · ingreso <b>"+plata(r.ingreso)+"</b>"+
      (precioPromedioRatio()>1.3?"<br><span class='mini'>Precios altos: la hinchada se va a ir enojando.</span>":
       (precioPromedioRatio()<0.85?"<br><span class='mini'>Precios populares: la gente lo valora.</span>":""));
  };
  SECTORES.forEach(s=>{
    pe.cuerpo.appendChild(el("label","lb",s.ic+" "+s.n+" — <b id='pr_"+s.id+"'>$"+(E.precios[s.id]||0).toLocaleString("es-CL")+"</b>"));
    const r=el("input"); r.type="range"; r.min=s.min; r.max=s.max; r.step=Math.max(50,Math.round(s.ref*0.05)); r.value=E.precios[s.id]||s.ref; r.className="rango";
    r.oninput=()=>{ E.precios[s.id]=parseInt(r.value,10); const lab=document.getElementById("pr_"+s.id); if(lab) lab.textContent="$"+E.precios[s.id].toLocaleString("es-CL"); refrescarProy(); };
    r.onchange=()=>{ guardar(); };
    pe.cuerpo.appendChild(r);
  });
  pe.cuerpo.appendChild(proy); refrescarProy();
  v.appendChild(pe);

  /* --- inversiones de club --- */
  const pin=panel("Inversiones","🏗️");
  pin.cuerpo.appendChild(el("p","mini","Plata que sale hoy para tener un club más grande mañana."));
  const inv=[
   ["Mejorar el estadio",350,"+ estado del estadio (más aforo y menos sanciones)",()=>{ aplicarEfectos({plata:-350,estadio:12}); }],
   ["Campaña de propaganda",180,"+ hinchada y socios (más gente, más ingreso fijo)",()=>{ aplicarEfectos({plata:-180,hinchada:6,socios:4,prestigio:2}); }],
   E.staff.cm?["Community Manager (contratado)",0,"Ya tenés CM. Se maneja desde Redes.",null]
            :["Contratar Community Manager",120,"Profesionaliza la comunicación: + prestigio y desbloquea campañas en Redes",()=>{ aplicarEfectos({plata:-120,prestigio:2}); E.staff.cm=true; }]
  ];
  inv.forEach(([n,costo,desc,fn])=>{
    const d=el("div","resul mitad");
    d.innerHTML="<b>"+n+"</b> "+(costo?"· "+plata(costo):"")+"<br><span class='mini'>"+desc+"</span>";
    if(fn){
      const b=el("button","btn-aqua chico"+(E.plata<costo?" gris":" verde"),"Invertir"); b.style.marginTop="5px";
      b.disabled=E.plata<costo;
      b.onclick=()=>{ fn(); guardar(); render(); aviso(n+" · "+plata(costo)); };
      d.appendChild(b);
    }
    pin.cuerpo.appendChild(d);
  });
  v.appendChild(pin);

  const pd=panel("Deuda","🏦",E.deuda>3000?"grave":"");
  pd.cuerpo.appendChild(el("p","mini","Los intereses se pagan todas las semanas y no perdonan. Podés abonar cuando tengas caja."));
  [200,500,1000].forEach(m=>{
    const b=el("button","btn-aqua chico"+(E.plata<m?" gris":""),"Abonar "+plata(m));
    b.style.marginRight="6px";
    b.disabled=E.plata<m||E.deuda<=0;
    b.onclick=()=>{ const pagar=Math.min(m,E.deuda); aplicarEfectos({plata:-pagar,deuda:-pagar});
      aplicarGrupos({directorio:3}); guardar(); render(); aviso("Abonaste "+plata(pagar)); };
    pd.cuerpo.appendChild(b);
  });
  v.appendChild(pd);
}
/* ---------------- plantel ---------------- */
function vistaPlantel(){
  const v=$("#vista");
  const p=panel("Plantel "+E.anio,"👥");
  p.cuerpo.appendChild(el("p","mini","● son jugadores reales de esa temporada. Nivel, forma, sueldo y valor son estimaciones del juego."));
  const t=el("table");
  t.innerHTML="<thead><tr><th>Jugador</th><th>Pos</th><th class='n'>Ed</th><th class='n'>Niv</th><th class='n'>For</th><th class='n'>Gol</th><th class='n'>Sueldo</th></tr></thead>";
  const tb=el("tbody");
  E.plantel.filter(j=>!j.vendido).sort((a,b)=>b.nivel-a.nivel).forEach(j=>{
    const tr=el("tr");
    tr.innerHTML="<td>"+(j.real?"● ":"")+j.n+(j.lesion>0?" 🩹":"")+"</td><td>"+j.pos+"</td><td class='n'>"+j.edad+
      "</td><td class='n'>"+j.nivel+"</td><td class='n'>"+Math.round(j.forma)+"</td><td class='n'>"+j.goles+
      "</td><td class='n'>"+plata(j.sueldo)+"</td>";
    tr.style.cursor="pointer";
    tr.onclick=()=>fichaJugador(j);
    tb.appendChild(tr);
  });
  t.appendChild(tb); p.cuerpo.appendChild(t);
  v.appendChild(p);
}
function fichaJugador(j){
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">👤</span><span>'+j.n+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(fila("Posición / edad",j.pos+" · "+j.edad+" años"));
    c.appendChild(fila("Nivel / proyección",j.nivel+" / "+j.proy));
    c.appendChild(fila("Forma / moral",Math.round(j.forma)+" / "+Math.round(j.moral)));
    c.appendChild(fila("Sueldo anual",plata(j.sueldo)));
    c.appendChild(fila("Valor estimado",plata(j.valor)));
    c.appendChild(fila("Contrato","hasta "+j.contrato.hasta));
    if(j.rasgos.length) c.appendChild(el("p","mini","Rasgos: "+j.rasgos.join(", ")));
    if(j.lesion>0) c.appendChild(el("p","mini","Lesionado: fuera unas "+j.lesion+" semanas."));
    const tieneOferta=E.ofertasPend&&E.ofertasPend.some(o=>o.jid===j.n);
    const bv=el("button","btn-aqua ancho verde"+(tieneOferta?" gris":""),tieneOferta?"Ya hay una oferta abierta":"Buscar comprador");
    bv.disabled=tieneOferta;
    bv.onclick=()=>{ cerrarModal(); buscarComprador(j); };
    c.appendChild(bv);
    const b=el("button","btn-aqua ancho gris","Cerrar"); b.style.marginTop="6px"; b.onclick=cerrarModal; c.appendChild(b);
  });
}
/* ---------------- calendario ---------------- */
function vistaCalendario(){
  const v=$("#vista");
  const p=panel("Calendario "+E.anio,"📅");
  E.calendario.forEach((c,i)=>{
    const d=el("div","fila");
    const marc=c.jugado?(c.gf+"-"+c.gc):"—";
    const est=c.jugado?(c.gf>c.gc?"ok":(c.gf<c.gc?"mal":"neu")):"neu";
    d.innerHTML='<span>'+(i===E.idx?"▶ ":"")+(c.tipo==="copa"?"🏆 ":"")+
      (c.local?"vs ":"a ")+c.rivalNombre+' <span class="mini">'+fechaTxt(c.f)+(c.tipo==="copa"?" · "+c.ronda:"")+'</span></span>'+
      '<b class="etq '+est+'">'+marc+'</b>';
    p.cuerpo.appendChild(d);
  });
  v.appendChild(p);

  const pt=panel("Tabla de posiciones","📊","agua");
  const arr=LIGA91.map(c=>Object.assign({id:c.id,n:c.n},E.tabla[c.id]));
  arr.sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc));
  const t=el("table");
  t.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>G</th><th class='n'>E</th><th class='n'>P</th><th class='n'>GF</th><th class='n'>GC</th><th class='n'>Pts</th></tr></thead>";
  const tb=el("tbody");
  arr.forEach((c,i)=>{
    const tr=el("tr",c.id===E.club?"yo":"");
    tr.innerHTML="<td class='n'>"+(i+1)+"</td><td>"+c.n+"</td><td class='n'>"+c.pj+"</td><td class='n'>"+c.pg+
      "</td><td class='n'>"+c.pe+"</td><td class='n'>"+c.pp+"</td><td class='n'>"+c.gf+"</td><td class='n'>"+c.gc+"</td><td class='n'>"+c.pts+"</td>";
    tb.appendChild(tr);
  });
  t.appendChild(tb); pt.cuerpo.appendChild(t);
  pt.cuerpo.appendChild(el("p","mini","Época "+ERA[E.eraBase].n+": la victoria vale "+ERA[E.eraBase].puntosVictoria+" puntos. Campeonato de "+LIGA_ACT.length+" equipos."));
  v.appendChild(pt);
}
/* ---------------- historia ---------------- */
function vistaHistoria(){
  const v=$("#vista");
  if(E.eraBase===2026){
    const p2=panel("Época 2026","📚","agua");
    p2.cuerpo.appendChild(el("p",null,ERA[2026].desc));
    p2.cuerpo.appendChild(el("div","resul mitad","<b>Aviso.</b> El plantel y los clubes de 2026 usan nombres reales de referencia, pero los datos son <b>aproximados</b> y pueden haber cambiado. Todo lo dramatizado (conversaciones, conflictos, frases) es ficción del juego."));
    p2.cuerpo.appendChild(el("p","mini","No hay una \"tabla histórica\" fija para 2026: la estás escribiendo vos temporada a temporada."));
    v.appendChild(p2);
  } else {
    const p=panel("Temporada 1991 · lo que pasó de verdad","📚");
    Object.keys(HECHOS_91).forEach(k=>{
      const n={campeon:"Campeón",goleador:"Goleador",descendidos:"Descendieron",publico:"Público",cierre:"Cierre"}[k];
      p.cuerpo.appendChild(fila(n,HECHOS_91[k]));
    });
    p.cuerpo.appendChild(el("p","mini","La Copa Libertadores 1991 la ganó Colo-Colo: primero del Grupo 2, eliminó a Universitario de Lima, a Nacional de Montevideo y a Boca Juniors, y venció a Olimpia en la final (0-0 en Asunción y 3-0 en el Monumental el 5 de junio)."));
    v.appendChild(p);

    const pt=panel("Tabla final histórica 1991","📋","agua");
    const t=el("table"); t.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>Pts</th></tr></thead>";
    const tb=el("tbody");
    TABLA_REAL_91.forEach((r,i)=>tb.appendChild(el("tr",r[0]===E.clubNombre?"yo":"", "<td class='n'>"+(i+1)+"</td><td>"+r[0]+"</td><td class='n'>"+r[1]+"</td>")));
    t.appendChild(tb); pt.cuerpo.appendChild(t);
    v.appendChild(pt);
  }

  const pd=panel("Tu línea","🧭");
  pd.cuerpo.appendChild(fila("Decisiones iguales a la historia",E.coincidencias.length));
  pd.cuerpo.appendChild(fila("Decisiones que se separan",E.divergencias.length));
  const tot=E.coincidencias.length+E.divergencias.length;
  if(tot){
    const pct=Math.round(E.coincidencias.length*100/tot);
    pd.cuerpo.appendChild(el("div",null,barrita(pct,"#e0a92a")));
    pd.cuerpo.appendChild(el("p","mini","Fidelidad histórica: "+pct+"%. "+(pct<50?"Ya estás en una línea propia: desde acá el contenido es ficción del juego.":"Vas pegado a lo que pasó.")));
  }
  E.divergencias.slice(-8).reverse().forEach(d=>pd.cuerpo.appendChild(fila(d.anio+" · "+d.t,d.elegido)));
  v.appendChild(pd);

  /* historial de temporadas jugadas (tablas guardadas) */
  const ph=panel("Temporadas jugadas","🗄️","agua");
  if(!E.historialAnual||!E.historialAnual.length) ph.cuerpo.appendChild(el("p","mini","Todavía no cerraste ninguna temporada. Cuando termine un año, su tabla final queda guardada acá."));
  (E.historialAnual||[]).forEach(h=>{
    const b=el("button","op");
    const remate=h.copa?"🏆 Campeón de América":(h.campeon?"🥇 Campeón nacional":ordinal(h.pos)+" en la tabla");
    b.innerHTML='<div class="t">'+h.anio+' · '+remate+'</div>'+
      '<div class="d">'+(h.goleador?("Goleador del plantel: "+h.goleador.n+" ("+h.goleador.goles+")"):"")+'</div>';
    b.onclick=()=>modalTablaHistorica(h);
    ph.cuerpo.appendChild(b);
  });
  v.appendChild(ph);
}
function modalTablaHistorica(h){
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">🗄️</span><span>Tabla final '+h.anio+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    const t=el("table");
    t.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>G</th><th class='n'>E</th><th class='n'>P</th><th class='n'>GF</th><th class='n'>GC</th><th class='n'>Pts</th></tr></thead>";
    const tb=el("tbody");
    (h.tabla||[]).forEach((r,i)=>tb.appendChild(el("tr",r.id===h.club?"yo":"",
      "<td class='n'>"+(i+1)+"</td><td>"+r.n+"</td><td class='n'>"+r.pj+"</td><td class='n'>"+r.pg+"</td><td class='n'>"+r.pe+"</td><td class='n'>"+r.pp+"</td><td class='n'>"+r.gf+"</td><td class='n'>"+r.gc+"</td><td class='n'>"+r.pts+"</td>")));
    t.appendChild(tb); c.appendChild(t);
    if(h.goleador) c.appendChild(el("p","mini","Goleador de tu plantel: "+h.goleador.n+" con "+h.goleador.goles+" goles."));
    const b=el("button","btn-aqua ancho gris","Cerrar"); b.onclick=cerrarModal; c.appendChild(b);
  });
}
/* ---------------- carrera ---------------- */
function vistaCarrera(){
  const v=$("#vista");
  const p=panel("Tu reputación","🎖️","agua");
  REPUTACION.forEach(r=>{
    const val=E.rep[r.id];
    p.cuerpo.appendChild(el("div",null,'<div class="fila" style="border:none;padding:2px 0"><span>'+r.ic+" "+r.n+'</span><b>'+Math.round(val)+'</b></div>'+
      barrita(val,val>50?"#4fbf3f":"#e0a92a")+'<div class="mini">'+r.d+'</div>'));
  });
  if(E.rep.publica<25) p.cuerpo.appendChild(el("div","resul mal","Tu imagen pública está en el suelo. Si sigue cayendo, ningún club del fútbol chileno te va a querer contratar."));
  v.appendChild(p);

  const pm=panel("Mandato","📌");
  const ex=expectativa();
  pm.cuerpo.appendChild(fila("Lo que te piden",ex.txt));
  pm.cuerpo.appendChild(fila("Directorio",etiquetaAprobacion(E.grupos.directorio.aprob)));
  if(E.carrera.evaluacion) pm.cuerpo.appendChild(el("div","resul "+(E.carrera.evaluacion.nivel==="excelente"||E.carrera.evaluacion.nivel==="cumplido"?"bien":"mal"),
    "<b>Evaluación "+E.carrera.evaluacion.anio+":</b> "+E.carrera.evaluacion.txt));
  if(riesgoDestitucion()) pm.cuerpo.appendChild(el("div","resul mal","Estás a un paso de la destitución."));
  v.appendChild(pm);

  const pt=panel("Trayectoria","🗂️");
  pt.cuerpo.appendChild(fila("Club actual",E.clubNombre+" (desde "+E.carrera.desde+")"));
  pt.cuerpo.appendChild(fila("Destituciones",E.carrera.despidos));
  E.carrera.clubes.forEach(c=>pt.cuerpo.appendChild(fila(CLUB_INFO[c.club].n,c.desde+"-"+c.hasta+" · "+c.titulos.length+" títulos")));
  if(E.titulos.length){
    pt.cuerpo.appendChild(el("h3","sub","Vitrina"));
    E.titulos.forEach(t=>pt.cuerpo.appendChild(fila("🏆",t)));
  }
  v.appendChild(pt);
}
function pantallaSinClub(){
  const p=panel("Estás sin club","🚪","alerta");
  p.cuerpo.appendChild(el("h2","tit","Te destituyeron"));
  p.cuerpo.appendChild(el("p",null,E.carrera.motivo));
  const ofertas=ofertasDeTrabajo();
  if(estadoCarrera()!=="ok"||!ofertas.length){
    p.cuerpo.appendChild(el("div","resul mal","Nadie te quiere contratar. Tu nombre está quemado en el fútbol chileno."));
    const b=el("button","btn-aqua ancho rojo","Terminar la carrera");
    b.onclick=()=>{ finDeCarrera("Nadie volvió a llamarte."); render(); };
    p.cuerpo.appendChild(b);
  } else {
    p.cuerpo.appendChild(el("h3","sub","Ofertas sobre la mesa"));
    ofertas.forEach(o=>{
      const b=el("button","op");
      b.innerHTML='<div class="t">'+CLUB_INFO[o.id].esc+" "+o.n+'</div><div class="d">'+CLUB_INFO[o.id].desc+'</div>';
      b.onclick=()=>{ aceptarClub(o.id); SEC="escritorio"; render(); aviso("Nuevo desafío: "+o.n); };
      p.cuerpo.appendChild(b);
    });
    const b=el("button","btn-aqua ancho gris","Retirarme del fútbol");
    b.onclick=()=>{ finDeCarrera("Decidiste no seguir."); render(); };
    p.cuerpo.appendChild(b);
  }
  return p;
}
function pantallaFinCarrera(){
  const p=panel("Fin de la carrera","🏁");
  p.cuerpo.appendChild(el("h2","tit","Se termina el camino"));
  p.cuerpo.appendChild(el("p",null,E.carrera.motivoFin||""));
  p.cuerpo.appendChild(fila("Años en el fútbol",(E.anio-E.carrera.clubes.reduce((m,c)=>Math.min(m,c.desde),E.carrera.desde))));
  p.cuerpo.appendChild(fila("Títulos",E.titulos.length));
  E.titulos.forEach(t=>p.cuerpo.appendChild(fila("🏆",t)));
  const b=el("button","btn-aqua ancho verde","Empezar de nuevo");
  b.onclick=async()=>{ await Store.del(LLAVE); E=null; render(); };
  p.cuerpo.appendChild(b);
  return p;
}
/* ---------------- redes del club + roleo ---------------- */
const POSTS_PREDEF=[
 {t:"Bancar al plantel a muerte", texto:"Banco a este grupo a muerte. Van a dejar todo en la cancha.",
  ev:{sentimiento:34, consecuencia:"El camarín siente el respaldo público."}},
 {t:"Prometer pelear el título", texto:"Vamos a pelear este campeonato hasta la última fecha, con todo.",
  ev:{sentimiento:26, consecuencia:"La hinchada se ilusiona con la promesa."}},
 {t:"Pedir calma y paciencia", texto:"Pido calma y paciencia: esto es un proceso y hay que sostenerlo.",
  ev:{sentimiento:2, grupos:{prensa:6,hinchada:-3}, consecuencia:"Bajás la euforia; la prensa lo valora, la tribuna menos."}},
 {t:"Salir a criticar el arbitraje", texto:"Nos están perjudicando y lo vamos a decir con nombre y apellido.",
  ev:{sentimiento:8, grupos:{hinchada:8,anfp:-12,prensa:-6}, ef:{riesgo:4}, consecuencia:"La hinchada te aplaude; la ANFP toma nota."}},
 {t:"«Gano el próximo o me voy»", texto:"Les prometo algo: o ganamos el próximo o me voy a mi casa.",
  ev:{sentimiento:30, promesa:{hay:true,tipo:"ganarProximoGrande",castigo:"destitucion",texto:"Ganar el próximo partido o dejar el cargo"},
      consecuencia:"Pusiste tu cargo sobre la mesa en público."}}
];
function vistaRedes(){
  const v=$("#vista");
  const p=panel("Red del club","📱","agua");
  p.cuerpo.appendChild(el("p","mini","Lo que publiques mueve la moral del camarín, el ánimo de la hinchada y tu relación con la prensa. "+
    (iaDisponible()?"IA conectada.":"Modo offline: análisis por palabras clave + frases con efecto conocido.")));
  const ta=el("textarea"); ta.className="entrada"; ta.rows=2; ta.placeholder="Escribí un posteo (ej: «Vamos con todo, este grupo tiene alma»)…";
  ta.style.width="100%";
  p.cuerpo.appendChild(ta);
  const bp=el("button","btn-aqua ancho verde","Publicar");
  bp.onclick=()=>{
    const txt=(ta.value||"").trim(); if(!txt){ aviso("Escribí algo primero"); return; }
    bp.disabled=true;
    evaluarPost(txt).then(ev=>{ aplicarPost(txt,ev); irA("redes"); });
  };
  p.cuerpo.appendChild(bp);
  p.cuerpo.appendChild(el("h3","sub","Publicaciones rápidas"));
  const fr=el("div","ops");
  POSTS_PREDEF.forEach(pp=>{
    const b=el("button","op");
    b.innerHTML='<div class="t">'+pp.t+'</div><div class="d">"'+pp.texto+'"</div>';
    b.onclick=()=>{ aplicarPost(pp.texto, Object.assign({},pp.ev)); irA("redes"); };
    fr.appendChild(b);
  });
  p.cuerpo.appendChild(fr);
  v.appendChild(p);

  /* roleo con el capitán */
  const pc=panel("Charla con el capitán","🧑‍✈️");
  const part=proximoPartido();
  const esFinal=part&&(part.ronda==="FINAL"||part.ronda==="Semifinal");
  pc.cuerpo.appendChild(el("p","mini",esFinal?"Se viene un partido grande. Una buena charla puede cambiar el ánimo del grupo.":"Podés hablar con el referente del plantel para mover la moral antes del próximo partido."));
  const bc=el("button","btn-aqua ancho"+(esFinal?" verde":""),"Hablar con el capitán");
  bc.onclick=modalCharlaCapitan;
  pc.cuerpo.appendChild(bc);
  v.appendChild(pc);

  /* promesas activas */
  if(E.promesas&&E.promesas.length){
    const pp=panel("Promesas en juego","⏳","alerta");
    E.promesas.forEach(pr=>pp.cuerpo.appendChild(el("div","resul mitad","<b>"+pr.texto+"</b><br><span class='mini'>Se juega en el próximo partido. Si no la cumplís, "+(pr.castigo==="destitucion"?"te cuesta el cargo.":"golpea tu credibilidad.")+"</span>")));
    v.appendChild(pp);
  }

  /* feed */
  const pf=panel("Tu muro","🗒️");
  if(!E.redes||!E.redes.length) pf.cuerpo.appendChild(el("p","mini","Todavía no publicaste nada."));
  (E.redes||[]).forEach(r=>{
    const d=el("div","resul "+(r.s>15?"bien":(r.s<-15?"mal":"mitad")));
    d.innerHTML="<div class='mini' style='opacity:.7'>"+r.fecha+" · "+r.anio+(r.ia?" · IA":"")+"</div>«"+r.texto+"»<br><span class='mini'>"+r.cons+(r.promesa?" · Promesa: "+r.promesa:"")+"</span>";
    pf.cuerpo.appendChild(d);
  });
  v.appendChild(pf);
}
function modalCharlaCapitan(){
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">🧑‍✈️</span><span>Charla con el capitán</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p",null,"El referente del plantel te escucha. El tono correcto depende de cómo está el ánimo del grupo (moral actual: "+E.ind.moral+")."));
    const ops=el("div","ops");
    [["arenga","Arenga encendida","Subir la temperatura y salir a matar."],
     ["calma","Bajar la ansiedad","Tranquilizar y ordenar la cabeza."],
     ["exigencia","Exigir y marcar autoridad","Dejar claro qué se espera de cada uno."]].forEach(([k,n,d])=>{
      const b=el("button","op");
      b.innerHTML='<div class="t">'+n+'</div><div class="d">'+d+'</div>';
      b.onclick=()=>{ const r=charlaCapitan(k); cerrarModal(); render(); aviso(r.txt); };
      ops.appendChild(b);
    });
    c.appendChild(ops);
    const x=el("button","btn-aqua ancho gris","Dejarlo para después"); x.style.marginTop="6px"; x.onclick=cerrarModal;
    c.appendChild(x);
  });
}
/* ---------------- avisos (centro de notificaciones) ---------------- */
function claseTipo(t){ return t==="bueno"?"bien":(t==="malo"?"mal":"mitad"); }
function icoTipo(t){ return t==="bueno"?"✅":(t==="malo"?"⚠️":(t==="mercado"?"🧳":"📌")); }
function vistaAvisos(){
  const v=$("#vista");
  const acc=notifsAccionables();
  if(acc.length){
    const pa=panel("Requieren tu respuesta","📨","alerta");
    acc.forEach(n=>pa.cuerpo.appendChild(tarjetaAviso(n,true)));
    v.appendChild(pa);
  }
  const p=panel("Todos los avisos","🔔","agua");
  const barra=el("div"); barra.style.marginBottom="8px";
  const bl=el("button","btn-aqua chico gris","Marcar todo leído");
  bl.onclick=()=>{ marcarLeidas(); guardar(); render(); };
  const bb=el("button","btn-aqua chico rojo","Vaciar leídos"); bb.style.marginLeft="6px";
  bb.onclick=()=>{ E.notifs=(E.notifs||[]).filter(n=>!n.leido||(n.acc&&!n.acc.resuelta)); guardar(); render(); };
  barra.appendChild(bl); barra.appendChild(bb);
  p.cuerpo.appendChild(barra);
  const lista=(E.notifs||[]);
  if(!lista.length) p.cuerpo.appendChild(el("p","mini","Todavía no hay avisos. Todo lo importante que pase va a quedar registrado acá."));
  lista.forEach(n=>{ if(n.acc&&!n.acc.resuelta) return; p.cuerpo.appendChild(tarjetaAviso(n,false)); });
  v.appendChild(p);
  /* al entrar, se dan por leídos (los accionables siguen visibles arriba) */
  if(notifsNoLeidas()){ marcarLeidas(); pintarBarra(); pintarMenu(); guardar(); }
}
function tarjetaAviso(n,conAcciones){
  const d=el("div","resul "+claseTipo(n.tipo)+(n.leido?"":" nuevo"));
  d.innerHTML="<div class='mini' style='opacity:.7'>"+icoTipo(n.tipo)+" "+n.fecha+" · "+n.anio+(n.leido?"":" · <b>nuevo</b>")+"</div>"+
    "<b>"+n.t+"</b><br>"+n.d+(n.extra?"<br><span class='mini'>"+n.extra+"</span>":"");
  if(conAcciones&&n.acc&&n.acc.tipo==="ofertaJugador"){
    const cont=el("div"); cont.style.marginTop="6px";
    const ba=el("button","btn-aqua chico verde","Aceptar venta");
    ba.onclick=()=>{ if(typeof responderOferta==="function"){ responderOferta(n,true); render(); } };
    const br=el("button","btn-aqua chico gris","Rechazar"); br.style.marginLeft="6px";
    br.onclick=()=>{ if(typeof responderOferta==="function"){ responderOferta(n,false); render(); } };
    cont.appendChild(ba); cont.appendChild(br);
    d.appendChild(cont);
  }
  return d;
}
/* ---------------- ajustes ---------------- */
function vistaAjustes(){
  const v=$("#vista");
  const p=panel("Ajustes","⚙️");
  p.cuerpo.appendChild(el("label","lb","Tema visual"));
  const f=el("div","fichas");
  [["aero","Frutiger Aero"],["negro","Negro"],["claro","Claro"],["insano","Insano"]].forEach(([k,n])=>{
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",document.body.dataset.tema===k?"true":"false");
    b.onclick=()=>{ document.body.dataset.tema=k; Store.set("futbolini3_tema",k); render(); };
    f.appendChild(b);
  });
  p.cuerpo.appendChild(f);
  p.cuerpo.appendChild(el("div","resul mitad","<b>Aviso.</b> Clubes, jugadores y dirigentes reales aparecen con su nombre. "+
    "Resultados, títulos y fechas se apoyan en registros públicos. Todo lo demás (conversaciones, negociaciones, conflictos internos, frases) "+
    "es ficción escrita para el juego."));
  const b1=el("button","btn-aqua chico","Guardar ahora"); b1.onclick=async()=>{ await guardar(); aviso("Partida guardada"); };
  const b2=el("button","btn-aqua chico rojo","Borrar partida"); b2.style.marginLeft="6px";
  b2.onclick=async()=>{ if(confirm("¿Borrar la partida guardada?")){ await Store.del(LLAVE); E=null; render(); } };
  p.cuerpo.appendChild(b1); p.cuerpo.appendChild(b2);
  v.appendChild(p);
}
/* ---------------- avanzar ---------------- */
function avanzar(){
  if(!E||E.carrera.fin||E.carrera.enParo) return;
  const cr=crisisActiva();
  if(cr){ abrirCrisis(cr); return; }
  if(bloqueoDecisiones()) return;
  const part=proximoPartido();
  if(!part){ cerrarTemporada(); return; }
  const neto=tickSemana();
  repartirDecisiones();
  const ctx=eventosDeContexto();
  generarOfertasSemana();
  const ev=tirarEvento();
  if(ev&&ev.tipo==="decision"){ abrirEventoDecision(ev.ev); return; }
  irA("escritorio");
  if(ctx.length) aviso(ctx[0]);
  else if(ev) aviso(ev.item.t);
  else aviso("Semana tranquila · "+plata(neto));
}
function abrirEventoDecision(ev){
  const d={id:"ev_"+ev.id,buzon:"institucional",t:ev.t,d:ev.d,op:ev.op,posturas:ev.posturas,consejo:ev.consejo};
  modal(box=>{
    box.classList.remove("panel");
    const cont=el("div"); box.appendChild(cont);
    const p=panel("Novedad","📨","alerta"); p.classList.add("dec");
    p.cuerpo.appendChild(el("h2","tit",resolverTokens(ev.t,E)));
    p.cuerpo.appendChild(el("div","ctx",resolverTokens(ev.d,E)));
    const ops=el("div","ops");
    ev.op.forEach((o,i)=>{
      const chk=requisitoCumplido(o);
      const b=el("button","op"); b.disabled=!chk.ok;
      b.innerHTML='<div class="t">'+o.t+'</div>'+(textoRequisitos(o)?'<div class="req">'+textoRequisitos(o)+'</div>':"");
      b.onclick=()=>{
        const fake={id:d.id,buzon:"institucional",op:ev.op,posturas:ev.posturas||{}};
        const r=resolverDecision(fake,i);
        cerrarModal();
        if(r){ notificar({t:ev.t,d:"Elegiste «"+o.t+"». "+r.txt,extra:r.extra,tipo:r.tier==="bien"?"bueno":(r.tier==="mal"?"malo":"neutro")}); }
        irA("escritorio");
      };
      ops.appendChild(b);
    });
    p.cuerpo.appendChild(ops);
    cont.appendChild(p);
  },{cerrarFuera:false});
}
function abrirCrisis(cr){
  modal(box=>{
    box.classList.remove("panel");
    const p=panel("CRISIS","🚨","grave"); p.classList.add("dec");
    p.cuerpo.appendChild(el("h2","tit",cr.t));
    p.cuerpo.appendChild(el("div","ctx",resolverTokens(cr.d,E)));
    p.cuerpo.appendChild(el("p","mini","Esto no se puede postergar."));
    const ops=el("div","ops");
    cr.op.forEach((o,i)=>{
      const chk=requisitoCumplido(o);
      const b=el("button","op"); b.disabled=!chk.ok;
      b.innerHTML='<div class="t">'+o.t+'</div>'+(textoRequisitos(o)?'<div class="req">'+textoRequisitos(o)+(chk.ok?"":" · "+chk.txt)+'</div>':"");
      b.onclick=()=>{
        const fake={id:"crisis_"+cr.id,buzon:"institucional",op:cr.op,posturas:{}};
        const r=resolverDecision(fake,i);
        E.flags["crisis_"+cr.id]=true;
        cerrarModal();
        if(r) notificar({t:"CRISIS: "+cr.t,d:"Elegiste «"+o.t+"». "+r.txt,extra:r.extra,tipo:r.tier==="bien"?"bueno":"malo"});
        guardar(); irA("escritorio");
      };
      ops.appendChild(b);
    });
    p.cuerpo.appendChild(ops);
    box.appendChild(p);
  },{cerrarFuera:false});
}
/* ---------------- cierre de temporada ---------------- */
function cerrarTemporada(){
  const r=finDeTemporada();
  modal(box=>{
    box.classList.remove("panel");
    const p=panel("Balance "+E.anio,"🏁",r.campeon||r.copa?"":"alerta");
    p.cuerpo.appendChild(el("div","centro",'<div style="font-size:44px">'+(r.copa?"🏆":(r.campeon?"🥇":(r.pos<=3?"🥈":"📉")))+'</div>'));
    p.cuerpo.appendChild(el("h2","tit centro",r.copa?"Campeón de América":(r.campeon?"Campeón nacional":ordinal(r.pos)+" en el Campeonato Nacional")));
    p.cuerpo.appendChild(fila("Puntos",E.temporada.pts+" en "+E.temporada.pj+" partidos"));
    p.cuerpo.appendChild(fila("Premios de competencia",plata(r.premio)));
    p.cuerpo.appendChild(fila("Caja al cierre",plata(E.plata)));
    p.cuerpo.appendChild(fila("Deuda",plata(E.deuda)));
    p.cuerpo.appendChild(el("div","resul "+(r.ev.nivel==="excelente"||r.ev.nivel==="cumplido"?"bien":"mal"),"<b>El directorio:</b> "+r.ev.txt));
    const tot=E.coincidencias.length+E.divergencias.length;
    if(tot) p.cuerpo.appendChild(el("p","mini","Fidelidad histórica del año: "+Math.round(E.coincidencias.length*100/tot)+"%."));
    if(riesgoDestitucion()){
      const b=el("button","btn-aqua ancho rojo","Ver qué decidió el directorio");
      b.onclick=()=>{ cerrarModal(); destituir("Después de la temporada "+E.anio+", el directorio decidió terminar el ciclo. "+r.ev.txt); render(); };
      p.cuerpo.appendChild(b);
    } else {
      const b=el("button","btn-aqua ancho verde","Continuar a "+(E.anio+1));
      b.onclick=()=>{ cerrarModal(); nuevoAnio(); SEC="escritorio"; render(); aviso("Temporada "+E.anio); };
      p.cuerpo.appendChild(b);
    }
    box.appendChild(p);
  },{cerrarFuera:false});
}
/* ---------------- arranque ---------------- */
$("#btnAvanzar").onclick=avanzar;
$("#btnAvisos").onclick=()=>{ if(E) irA("avisos"); };
$("#btnTemas").onclick=()=>{
  const orden=["aero","negro","claro","insano"];
  const i=(orden.indexOf(document.body.dataset.tema)+1)%orden.length;
  document.body.dataset.tema=orden[i]; Store.set("futbolini3_tema",orden[i]); render();
};
(async function init(){
  burbujas();
  const t=await Store.get("futbolini3_tema");
  document.body.dataset.tema=t||"aero";
  const g=await cargar();
  if(g&&g.club&&g.v===3){ E=g; normalizarEstado(); aplicarEstatutosMod(); }
  render();
})();
window.addEventListener("resize",()=>{ clearTimeout(window._rb); window._rb=setTimeout(burbujas,400); });
