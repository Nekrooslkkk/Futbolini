"use strict";
/* ============================================================
   FUTBOLINI 3.0 · ui.js
   Todo lo que se ve, más el arranque del juego.
   ============================================================ */
let SEC="escritorio";
let REDES_PEST="club";
const SECCIONES=[
 ["escritorio","🗂️","Escritorio"],["institucion","🏛️","Institución"],["finanzas","💰","Finanzas"],
 ["plantel","👥","Plantel"],["mercado","🧳","Mercado"],["redes","📱","Redes"],["calendario","📅","Calendario"],["historia","📚","Historia"],
 ["carrera","🎖️","Carrera"],["vida","🪪","Vida"],["avisos","🔔","Avisos"],["ajustes","⚙️","Ajustes"]
];
function irA(s){ SEC=s; render(); const v=$("#vista"); if(v){ v.classList.remove("fx-in"); void v.offsetWidth; v.classList.add("fx-in"); } window.scrollTo({top:0}); }

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
  if(typeof detenerPlopBots==="function") detenerPlopBots();
  pintarBarra(); pintarMenu();
  const v=$("#vista"); v.innerHTML=""; v.dataset.sec="full";
  $("#btnAvanzar").classList.toggle("oculto",!E);
  if(!E){ pantallaInicio(); return; }
  if(E.carrera.fin){ v.appendChild(pantallaFinCarrera()); return; }
  if(E.dinastia&&E.dinastia.sucesionPendiente){ v.appendChild(pantallaSucesion()); return; }
  if(E.carrera.enParo){ v.appendChild(pantallaSinClub()); return; }
  v.dataset.sec=SEC;   /* para el layout multi-columna en PC (evita scroll eterno) */
  ({escritorio:vistaEscritorio,institucion:vistaInstitucion,finanzas:vistaFinanzas,plantel:vistaPlantel,
    mercado:vistaMercado,redes:vistaRedes,calendario:vistaCalendario,historia:vistaHistoria,carrera:vistaCarrera,
    vida:vistaVida,avisos:vistaAvisos,ajustes:vistaAjustes}[SEC]||vistaEscritorio)();
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
  let base=1991, modo="historico", anioInicio=1991, corte=false;
  const anioDe=b=>b===2026?2026:anioInicio;
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      let D, info, ib, cb;
      try{
        D=datosEra(base);
        info=D.info[id];
        ib=D.ind[id]; cb=D.caja[id];
        if(!info||!ib||!cb) throw new Error("Club sin datos en época "+base+": "+id);
      }catch(err){
        box.appendChild(el("div","cab","Error"));
        const c=el("div","cuerpo"); box.appendChild(c);
        c.appendChild(el("p",null,"No se pudo armar el briefing: "+err.message));
        const bx=el("button","btn-aqua ancho","Cerrar"); bx.onclick=cerrarModal; c.appendChild(bx);
        console.error(err);
        return;
      }
      box.appendChild(el("div","cab",'<span class="ic">'+info.esc+'</span><span>'+info.n+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      try{

      c.appendChild(el("h3","sub","1 · Elegí época"));
      const fe=el("div","fichas");
      [[1991,"1991 · Fase A"],[2026,"2026 · actual"]].forEach(([b,n])=>{
        const btn=el("button","ficha",n);
        btn.setAttribute("aria-pressed",base===b?"true":"false");
        btn.onclick=()=>{ base=b; pintar(); };
        fe.appendChild(btn);
      });
      c.appendChild(fe);
      c.appendChild(el("p","mini",(ERA[base]&&ERA[base].desc)||""));
      c.appendChild(el("p",null,info.desc||""));

      /* punto de inicio histórico (solo Colo-Colo en la época 1991) */
      if(base===1991 && id==="CC"){
        c.appendChild(el("h3","sub","Punto de inicio"));
        const fp=el("div","fichas");
        [[1989,"1989 · La Reconstrucción"],[1991,"1991 · La Gloria Libertadores"]].forEach(([y,n])=>{
          const b=el("button","ficha",n); b.setAttribute("aria-pressed",anioInicio===y?"true":"false");
          b.onclick=()=>{ anioInicio=y; pintar(); }; fp.appendChild(b);
        });
        c.appendChild(fp);
        c.appendChild(el("p","mini",anioInicio===1989
          ? "Tomás el club en 1989: ordená el camarín, saneá las finanzas y armá la base para volver a la gloria. Tu carrera sigue año a año."
          : "Arrancás en 1991 con la base consagrada, lista para ir por la Copa Libertadores."));
      } else if(base===1991) { anioInicio=1991; }

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
      c.appendChild(fila("Época","Campeonato de "+(base===2026?LIGA_2026.length:LIGA91.length)+" equipos · victoria vale "+ERA[base].puntosVictoria+" puntos"));
      c.appendChild(fila("Deportivo","plantel "+ib.plantel+" · cantera "+ib.cantera));
      c.appendChild(fila("Económico",plata(cb.plata)+" en caja · "+plata(cb.deuda)+" de deuda"));
      c.appendChild(fila("Interno","hinchada "+ib.hinchada+" · socios "+ib.socios+" · riesgo "+ib.riesgo));
      if(base===2026){
        c.appendChild(el("div","resul mitad","<b>Aviso.</b> Los planteles 2026 son <b>aproximados</b> y pueden haber cambiado en el mercado. Stats estimadas."));
        c.appendChild(el("h3","sub","Punto de la temporada"));
        const fc=el("div","fichas");
        [["no","Temporada completa (enero)"],["si","Desde ahora (18 ago, resultados ya jugados)"]].forEach(([k,n])=>{
          const b=el("button","ficha",n);
          b.setAttribute("aria-pressed",(k==="si")===corte?"true":"false");
          b.onclick=()=>{ corte=(k==="si"); pintar(); };
          fc.appendChild(b);
        });
        c.appendChild(fc);
        if(corte) c.appendChild(el("p","mini","Se cargan los partidos ya jugados del fixture (con marcador real si está) y una tabla de referencia al 18/08. Seguis desde el próximo. Colo-Colo tiene el fixture completo; los otros clubes usan la misma tabla semilla."));
      }

      const go=el("button","btn-aqua ancho verde",base===2026&&corte?"Seguir desde agosto 2026":("Empezar en "+anioDe(base)));
      go.style.marginTop="12px";
      go.onclick=()=>{
        try{
          const anio=anioDe(base);
          nuevaPartida(id, anio, modo, base===2026&&corte?{corte:true}:null);
          if(!E || !E.club) throw new Error("nuevaPartida no dejó estado E");
          cerrarModal();
          SEC="escritorio";
          render();
          aviso("Empieza la temporada "+anio);
        }catch(err){
          console.error("Error al empezar partida:", err);
          aviso("Error al empezar: "+err.message, 6000);
          /* dejar el modal abierto para que se vea el fallo */
        }
      };
      c.appendChild(go);
      }catch(err){
        console.error(err);
        c.appendChild(el("div","resul mal","Error al armar el briefing: "+err.message));
      }
    };
    pintar();
  });
}
/* ---------------- escritorio ---------------- */
/* 6.6 · entrenamiento de la semana: mejora la forma del plantel con riesgo bajo de lesión */
function entrenarSemana(){
  if(E.flags["entreno_"+E.idx]){ aviso("Ya entrenaron fuerte esta semana"); return; }
  E.flags["entreno_"+E.idx]=true;
  const sanos=E.plantel.filter(j=>!j.vendido&&!j.cedido&&!(j.lesion>0));
  sanos.forEach(j=>{ j.forma=clamp(j.forma+ri(2,6),30,99); });
  aplicarEfectos({moral:2});
  let msg="El equipo llegó más fino al partido (+forma).";
  let tono="bueno";
  if(Math.random()<0.12 && sanos.length){
    const vv=elige(sanos); vv.lesion=ri(1,2); aplicarEfectos({moral:-2}); tono="malo";
    msg=vv.n+" se resintió en la práctica y queda "+vv.lesion+" fecha(s) afuera. Los riesgos del rigor físico.";
    if(typeof recordar==="function") recordar("entreno","forzaste la carga y "+vv.n+" se lesionó entrenando",{quien:vv.n,peso:"bajo",tono:"malo"});
  }
  notificar({t:"Entrenamiento de la semana",tipo:tono,d:msg,bandeja:false});
  guardar(); render(); aviso("🏃 "+msg.slice(0,54));
}
function vistaEscritorio(){
  const v=$("#vista");
  const rej=el("div","rejilla dos");
  const izq=el("div"), der=el("div");

  /* próximo compromiso */
  const part=proximoPartido();
  const p=panel("Próximo compromiso","📌",part&&part.tipo==="copa"?"agua":"");
  if(part){
    p.cuerpo.appendChild(el("h2","tit","Próximo partido con "+part.rivalNombre));
    p.cuerpo.appendChild(el("p","mini",(part.local?"De local":"De visita")+" · "+(part.tipo==="copa"?"Copa Libertadores · "+part.ronda:"Campeonato Nacional · fecha "+part.fecha)+
      " · "+fechaTxt(part.f)+" · "+part.sede));
    /* ver el once probable del rival antes de entrar */
    if(typeof plantelRival==="function"){
      const det=el("details"); det.className="rival-prev";
      det.appendChild(el("summary","","👁️ Ver el once probable de "+part.rivalNombre));
      try{
        const xi=plantelRival(part.rivalId||part.rivalNombre, part.fuerzaRival);
        const t=el("table"); t.innerHTML="<thead><tr><th>Rival</th><th>Pos</th><th class='n'>Nivel</th></tr></thead>";
        const tb=el("tbody");
        xi.forEach(j=>tb.appendChild(el("tr",null,"<td>"+(j.real?"● ":"")+j.n+"</td><td>"+j.pos+"</td><td class='n'>"+j.nivel+"</td>")));
        t.appendChild(tb); det.appendChild(t);
        det.appendChild(el("p","mini","● jugador real documentado. Es una lectura estimada: la formación final del rival puede cambiar."));
      }catch(e){ det.appendChild(el("p","mini","No se pudo leer el rival.")); }
      p.cuerpo.appendChild(det);
    }
    const b=el("button","btn-aqua ancho verde","Ir al partido");
    b.onclick=()=>{ if(bloqueoDecisiones()) return; pantallaPrevia(part); };
    p.cuerpo.appendChild(b);
    /* entrenamiento de la semana: mejora la forma, con riesgo bajo de lesión */
    const yaEntreno=E.flags["entreno_"+E.idx];
    const bent=el("button","btn-aqua ancho"+(yaEntreno?" gris":""),yaEntreno?"🏃 Ya entrenaron fuerte esta semana":"🏃 Entrenar fuerte · mejora la forma (riesgo bajo de lesión)");
    bent.disabled=yaEntreno; bent.style.marginTop="6px"; bent.onclick=entrenarSemana;
    p.cuerpo.appendChild(bent);
  } else {
    p.cuerpo.appendChild(el("p",null,"No quedan partidos. Toca cerrar la temporada "+E.anio+"."));
    const b=el("button","btn-aqua ancho verde","Cerrar temporada");
    b.onclick=cerrarTemporada;
    p.cuerpo.appendChild(b);
  }
  izq.appendChild(p);

  /* 5.0 · objetivos de temporada — lo que se espera de vos */
  if(Array.isArray(E.objetivos)&&E.objetivos.length&&typeof progresoObjetivo==="function"){
    const cumplidasN=E.objetivos.filter(o=>progresoObjetivo(o).cumplido).length;
    const po=panel("Lo que se espera de vos","📋",E.objetivos.some(o=>progresoObjetivo(o).estado==="riesgo")?"alerta":"agua");
    po.cuerpo.appendChild(el("p","mini","Las metas que te puso la dirigencia para "+E.anio+". Se evalúan al cierre de la temporada. Vas <b>"+cumplidasN+" de "+E.objetivos.length+"</b> en curso."));
    const CAT={deportivo:{ic:"⚽",n:"Deportivo",c:"#2f7dd0"},economico:{ic:"💰",n:"Económico",c:"#3aa049"},institucional:{ic:"🏛️",n:"Institucional",c:"#9a6fe0"}};
    const EST={cumplido:{n:"Cumplido",c:"#2fa84f"},encamino:{n:"En camino",c:"#d68a1f"},riesgo:{n:"En riesgo",c:"#c0392b"}};
    E.objetivos.forEach(o=>{
      const pr=progresoObjetivo(o), cat=CAT[o.cat]||CAT.deportivo, est=EST[pr.estado]||EST.encamino;
      const box=el("div","obj");
      box.innerHTML=
        "<div class='obj-top'><span class='obj-cat' style='background:"+cat.c+"'>"+cat.ic+" "+cat.n+"</span>"+
        "<span class='obj-est' style='color:"+est.c+"'>"+(pr.cumplido?"✓ ":"")+est.n+"</span></div>"+
        "<div class='obj-t'>"+o.t+"</div>"+
        barrita(pr.pct,est.c)+
        "<div class='obj-dato'>"+pr.txt+"</div>"+
        "<div class='obj-porque'>💡 "+o.porque+"</div>";
      po.cuerpo.appendChild(box);
    });
    izq.appendChild(po);
  }

  const cer=panel("Cerebro local","🧠");
  cer.cuerpo.appendChild(el("p","mini","Sin internet. Sin créditos. Lee caja, moral, tabla y el próximo rival."));
  cer.cuerpo.appendChild(el("p",null,typeof consejoLocal==="function"?consejoLocal():"…"));
  izq.appendChild(cer);

  /* decisiones */
  const pd=panel("Decisiones sobre la mesa","📥",E.decPend.some(x=>x.peso==="alto")?"alerta":"");
  if(!E.decPend.length) pd.cuerpo.appendChild(el("p","mini","Nada pendiente. Por ahora."));
  else pd.cuerpo.appendChild(el("p","mini",E.decPend.length+" sobre la mesa. Las urgentes van primero; el resto puede esperar."));
  const gridDec=el("div","grid-comodo");  /* 2 columnas en pantalla ancha: menos scroll */
  E.decPend.slice().sort((a,b)=>(b.peso==="alto")-(a.peso==="alto")).forEach(x=>{
    const d=decisionPorId(x.id); if(!d) return;
    const b=el("button","op");
    b.innerHTML='<div class="t">'+BUZONES[d.buzon].ic+" "+resolverTokens(d.t,E)+'</div>'+
      '<div class="d">'+BUZONES[d.buzon].n+(x.peso==="alto"?" · <b>hay que resolverla antes del próximo partido</b>":"")+'</div>';
    b.onclick=()=>abrirDecision(d,true);
    gridDec.appendChild(b);
  });
  pd.cuerpo.appendChild(gridDec);
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

  /* 6.0 · el club no olvida — memoria de tus decisiones */
  if(typeof memoriaReciente==="function"){
    const hechos=memoriaReciente(null,5);
    if(hechos.length){
      const pmem=panel("El club no olvida","🧵");
      pmem.cuerpo.appendChild(el("p","mini","Lo que hiciste queda. El vestuario, la prensa y la gente tienen memoria — y esto lleva tu firma."));
      const TONO={bueno:"#2fa84f",malo:"#c0392b",riesgo:"#d68a1f",neutro:"#5b7086"};
      hechos.forEach(m=>{
        const d=el("div","mem-item");
        d.innerHTML="<span class='mem-punto' style='background:"+(TONO[m.tono]||TONO.neutro)+"'></span>"+
          "<span class='mem-txt'>"+m.txt.charAt(0).toUpperCase()+m.txt.slice(1)+"</span>"+
          "<span class='mem-cuando'>"+cuandoMemoria(m)+"</span>";
        pmem.cuerpo.appendChild(d);
      });
      der.appendChild(pmem);
    }
  }

  rej.appendChild(izq); rej.appendChild(der); v.appendChild(rej);
}
function bloqueoDecisiones(){
  const b=decisionesBloqueantes();
  if(b.length){ aviso("Primero hay que resolver: "+resolverTokens(decisionPorId(b[0].id).t,E)); abrirDecision(decisionPorId(b[0].id),true); return true; }
  return false;
}
/* ---------------- decisión ---------------- */
function abrirDecision(d,enModal){
  const pintar=(cont)=>{
    cont.innerHTML="";
    const p=panel(BUZONES[d.buzon].n,BUZONES[d.buzon].ic,d.peso==="alto"?"alerta":"");
    p.classList.add("dec");
    if(typeof pilarDeBuzon==="function"){ const pil=pilarDeBuzon(d.buzon); p.cuerpo.appendChild(el("span","pilar "+pil.c,pil.id)); }
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
      if(d.historia && E.config && E.config.spoiler) p.cuerpo.appendChild(el("p","mini","<b>En la vida real:</b> "+d.historia));
      const b=el("button","btn-aqua ancho gris","Cerrar");
      b.onclick=()=>{ if(enModal){ cerrarModal(); render(); } else irA("escritorio"); };
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

  /* interacción directa con los actores del club (Bloque 4) */
  if(typeof INTERACCIONES!=="undefined"){
    const pi=panel("Interacción directa","🤝");
    pi.cuerpo.appendChild(el("p","mini","Movete en los pasillos: cada actor tiene su precio y su reacción."));
    INTERACCIONES.forEach((gr,gi)=>{
      pi.cuerpo.appendChild(el("h3","sub",gr.ic+" "+gr.g));
      gr.ops.forEach((op,oi)=>{
        const key="pasillo_"+gi+"_"+oi+"_"+E.anio;
        const usado=!op.soplo && !!(E.flags&&E.flags[key]);
        const b=el("button","op"); b.disabled=usado;
        const costo=op.capital?(Math.abs(op.capital)+" capital"):(op.plata?plata(Math.abs(op.plata)):"gratis");
        b.innerHTML='<div class="t">'+op.t+(usado?" · <span class='mini'>ya lo hiciste esta temporada</span>":"")+'</div><div class="d">'+(op.d||"")+' · <b>'+costo+'</b></div>';
        b.onclick=()=>{
          const r=aplicarInteraccion(op);
          if(!r.ok){ aviso(r.msg); return; }
          if(!op.soplo){ E.flags[key]=true; if(typeof recordar==="function") recordar("pasillo","moviste los pasillos: "+op.t.toLowerCase(),{peso:"bajo"}); }
          guardar();
          modalResultadoInteraccion(gr,op,r);
        };
        pi.cuerpo.appendChild(b);
      });
    });
    v.appendChild(pi);
  }
}
/* 6.2 · resultado visible de mover los pasillos (que se note que pasó algo) */
function modalResultadoInteraccion(gr,op,r){
  modal(box=>{
    box.classList.remove("panel");
    const p=panel(gr.ic+" "+gr.g,"🤝","agua"); p.classList.add("dec");
    p.cuerpo.appendChild(el("h2","tit",op.t));
    if(op.d) p.cuerpo.appendChild(el("p","ctx",op.d));
    if(r.soplo) p.cuerpo.appendChild(el("div","resul mitad","🕵️ <b>Soplo:</b> "+r.soplo));
    const dl=[];
    if(op.plata) dl.push((op.plata<0?"−":"+")+plata(Math.abs(op.plata))+" caja");
    if(op.capital) dl.push(signo(op.capital)+" capital");
    if(op.grupos) for(const k in op.grupos){ const g=GRUPO_POR_ID[k]; if(g) dl.push(g.ic+" "+g.n+" "+signo(op.grupos[k])); }
    if(op.ef) for(const k in op.ef){ dl.push(k.charAt(0).toUpperCase()+k.slice(1)+" "+signo(op.ef[k])); }
    if(op.rep) for(const k in op.rep){ dl.push("Reputación "+k+" "+signo(op.rep[k])); }
    if(dl.length) p.cuerpo.appendChild(el("div","resul bien","<b>Lo que se movió:</b> "+dl.join(" · ")));
    else if(!r.soplo) p.cuerpo.appendChild(el("div","resul mitad","Quedó registrado. Los efectos se ven en los grupos de interés."));
    const b=el("button","btn-aqua ancho verde","Listo"); b.onclick=()=>{ cerrarModal(); render(); };
    p.cuerpo.appendChild(b);
    box.appendChild(p);
  });
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
/* sparkline SVG de la cotización (sin librerías) */
function sparkNode(hist){
  const w=260,h=54,pad=3;
  const arr=(hist&&hist.length?hist:[1]).slice(-40);
  const min=Math.min.apply(null,arr), max=Math.max.apply(null,arr), rng=(max-min)||1;
  const dx=(w-pad*2)/Math.max(1,arr.length-1);
  const pts=arr.map((v,i)=>[pad+i*dx, h-pad-((v-min)/rng)*(h-pad*2)]);
  const d=pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
  const sube=arr[arr.length-1]>=arr[0];
  const col=sube?"#1e9e46":"#c0392b";
  const cont=el("div","spark");
  cont.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="'+h+'" preserveAspectRatio="none">'+
    '<path d="'+d+' L '+pts[pts.length-1][0].toFixed(1)+' '+(h-pad)+' L '+pad+' '+(h-pad)+' Z" fill="'+col+'22"/>'+
    '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="2" stroke-linejoin="round"/></svg>';
  return cont;
}
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
  const neto0=ingresoSemanal()-costoSemanal();
  const semanas=neto0>=0?99:Math.max(0,Math.floor((E.plata||0)/Math.max(1,-neto0)));
  if(semanas<8) p.cuerpo.appendChild(el("div","resul mal","Con este ritmo la caja dura ±"+semanas+" semanas. La planilla te come vivo."));
  else if(neto0<0) p.cuerpo.appendChild(el("p","mini","Estás en rojo semanal, pero hay colchón para un rato."));
  if(E.flags&&E.flags.sueldosAtrasados) p.cuerpo.appendChild(el("div","resul mal","⚠ Sueldos atrasados: la moral del plantel cae cada semana hasta que regularices la caja."));
  if(E.flags&&E.flags.clausura) p.cuerpo.appendChild(el("div","resul mal","⚠ Estadio con sectores clausurados por la deuda: perdés aforo y taquilla."));
  p.cuerpo.appendChild(el("p","mini","Los partidos de local suman taquilla aparte. Todos los montos están en millones de pesos de la época."));
  v.appendChild(p);

  /* --- flujo de caja semanal itemizado --- */
  if(typeof ingresosAnuales==="function" && typeof egresosAnuales==="function"){
    const ia=ingresosAnuales(), ea=egresosAnuales();
    const s=x=>Math.round(x/40); /* anual → semanal */
    const pf=panel("Flujo de caja semanal","📊","agua");
    const t=el("table"); t.className="flujo";
    t.innerHTML="<thead><tr><th>Concepto</th><th class='n'>Semanal</th></tr></thead>";
    const tb=el("tbody");
    const linea=(n,val,neg)=>{ const tr=el("tr"); tr.innerHTML="<td>"+n+"</td><td class='n' style='color:"+(neg?"#b23":"#178a3a")+"'>"+(neg?"−":"+")+plata(Math.abs(val))+"</td>"; tb.appendChild(tr); };
    linea("Derechos de TV",s(ia.tv)); linea("Sponsors",s(ia.sponsors)); linea("Socios/abonos",s(ia.socios));
    if(ia.digital) linea("Digital/redes",s(ia.digital));
    linea("Planilla (sueldos)",s(ea.planilla),true); linea("Operación/estadio",s(ea.operacion),true); linea("Intereses de deuda",s(ea.intereses),true);
    if(E.flags&&E.flags.feeTesoreroUlt) linea("Comisión del Tesorero",E.flags.feeTesoreroUlt,true);
    t.appendChild(tb); pf.cuerpo.appendChild(t);
    const neto2=ingresoSemanal()-costoSemanal();
    pf.cuerpo.appendChild(el("div","resul "+(neto2>=0?"bien":"mal"),"<b>Resultado neto semanal: "+(neto2>=0?"+":"−")+plata(Math.abs(neto2))+"</b>"));
    v.appendChild(pf);
  }

  /* --- bolsa de valores del club --- */
  if(E.bolsa){
    const pb=panel("Bolsa de valores — "+E.bolsa.sociedad,"📈",gananciaBolsa()<0?"alerta":"agua");
    const vr=variacionBolsa();
    const cot=el("div","cotiza");
    cot.innerHTML="<span class='precio'>"+plata(E.bolsa.precio)+"</span> <span class='var "+(vr>=0?"sube":"baja")+"'>"+(vr>=0?"▲ +":"▼ ")+vr+"%</span>";
    pb.cuerpo.appendChild(cot);
    pb.cuerpo.appendChild(sparkNode(E.bolsa.historia));
    pb.cuerpo.appendChild(el("p","mini","Vos sabés los resultados antes que el mercado. Ganar hace subir la acción; perder la hunde. Especulás con tu bolsillo personal."));
    pb.cuerpo.appendChild(fila("Bolsillo personal",plata(E.personal.bolsillo)));
    if(E.bolsa.acciones>0){
      pb.cuerpo.appendChild(fila("Tu tenencia",plata(valorTenencia())+" ("+(E.bolsa.acciones).toFixed(2)+" acc.)"));
      const g=gananciaBolsa();
      pb.cuerpo.appendChild(el("div","resul "+(g>=0?"bien":"mal"),"Ganancia latente: <b>"+(g>=0?"+":"−")+plata(Math.abs(Math.round(g)))+"</b> (invertido "+plata(Math.round(E.bolsa.invertido))+")"));
    }
    const compra=el("div"); compra.style.margin="6px 0";
    [["Invertir 10",10],["Invertir 25",25],["Invertir 50",50]].forEach(([n,m])=>{
      const b=el("button","btn-aqua chico verde"+(E.personal.bolsillo<m?" gris":"")); b.textContent=n; b.style.marginRight="5px";
      b.disabled=E.personal.bolsillo<m;
      b.onclick=()=>{ if(invertirBolsa(m)){ guardar(); render(); aviso("Compraste acciones por "+plata(m)); } };
      compra.appendChild(b);
    });
    pb.cuerpo.appendChild(compra);
    if(E.bolsa.acciones>0){
      const venta=el("div");
      [["Vender 25%",0.25],["Vender 50%",0.5],["Vender todo",1]].forEach(([n,f])=>{
        const b=el("button","btn-aqua chico rojo"); b.textContent=n; b.style.marginRight="5px";
        b.onclick=()=>{ const ing=liquidarBolsa(f); guardar(); render(); aviso("Liquidaste por "+plata(ing)); };
        venta.appendChild(b);
      });
      pb.cuerpo.appendChild(venta);
    }
    v.appendChild(pb);
  }

  /* --- precios por sector con sliders y proyección en vivo --- */
  const pe=panel("Precios de entradas","🎫","agua");
  pe.cuerpo.appendChild(el("p","mini","Fijá el precio de cada sector. Subir el precio deja más por entrada pero espanta público (la galería es la más sensible). La proyección se actualiza al instante."));
  const proy=el("div","resul mitad"); proy.id="proyTaq";
  const doc=el("div"); doc.id="docButacas";
  const setFill=(r,s)=>{ const pct=Math.round((r.value-s.min)/Math.max(1,(s.max-s.min))*100); r.style.setProperty("--fill",pct+"%"); };
  const refrescarProy=()=>{
    const r=proyeccionTaquilla(E.precios);
    const club=CLUB_POR_ID[E.club]||{aforo:30000};
    const ocupPct=Math.round(100*r.gente/Math.max(1,club.aforo*clausuraFactor()));
    proy.innerHTML="Partido de local tipo → <b>"+r.gente.toLocaleString("es-CL")+"</b> personas ("+ocupPct+"% del aforo) · ingreso <b>"+plata(r.ingreso)+"</b>"+
      (precioPromedioRatio()>1.3?"<br><span class='mini'>Precios altos: la hinchada se va a ir enojando.</span>":
       (precioPromedioRatio()<0.85?"<br><span class='mini'>Precios populares: la gente lo valora.</span>":""));
    /* tabla documentada de butacas: aforo, precio y ganancia estimada por sector */
    if(typeof taquillaPorSector==="function"){
      const sec=taquillaPorSector(proximoPartido());
      let html="<h3 class='sub'>Butacas del estadio · ganancia estimada por partido</h3>"+
        "<table class='butacas'><thead><tr><th>Sector</th><th class='n'>Butacas</th><th class='n'>Precio</th><th class='n'>Ocup.</th><th class='n'>Gana ~</th></tr></thead><tbody>";
      let tot=0;
      sec.forEach(x=>{ tot+=x.ingreso;
        html+="<tr><td>"+x.ic+" "+x.n+"</td><td class='n'>"+x.cap.toLocaleString("es-CL")+"</td><td class='n'>$"+x.precio.toLocaleString("es-CL")+"</td><td class='n'>"+x.ocup+"%</td><td class='n'>"+plata(x.ingreso)+"</td></tr>"; });
      html+="</tbody><tfoot><tr><td>Total taquilla</td><td class='n'></td><td class='n'></td><td class='n'></td><td class='n'>"+plata(tot)+"</td></tr></tfoot></table>"+
        "<p class='mini'>La galería es la más barata y la que más entra (55% del aforo); la marquesina es cara y chica (12%). Subir precios sube la ganancia por entrada pero baja la ocupación — y enoja a la hinchada.</p>";
      doc.innerHTML=html;
    }
  };
  SECTORES.forEach(s=>{
    pe.cuerpo.appendChild(el("label","lb",s.ic+" "+s.n+" — <b id='pr_"+s.id+"'>$"+(E.precios[s.id]||0).toLocaleString("es-CL")+"</b>"));
    const r=el("input"); r.type="range"; r.min=s.min; r.max=s.max; r.step=Math.max(50,Math.round(s.ref*0.05)); r.value=E.precios[s.id]||s.ref; r.className="rango";
    setFill(r,s);
    r.oninput=()=>{ E.precios[s.id]=parseInt(r.value,10); const lab=document.getElementById("pr_"+s.id); if(lab) lab.textContent="$"+E.precios[s.id].toLocaleString("es-CL"); setFill(r,s); refrescarProy(); };
    r.onchange=()=>{ if(typeof redesReaccion==="function") redesReaccion("precio",{ratio:precioPromedioRatio()}); guardar(); };
    pe.cuerpo.appendChild(r);
  });
  pe.cuerpo.appendChild(proy); pe.cuerpo.appendChild(doc); refrescarProy();
  v.appendChild(pe);

  /* --- inversiones de club --- */
  const pin=panel("Inversiones","🏗️");
  pin.cuerpo.appendChild(el("p","mini","Plata que sale hoy para tener un club más grande mañana. No hay atajos infinitos: cada mejora tiene un techo realista y se pone más cara a medida que subís."));
  const estTope=E.ind.estadio>=92, hinTope=E.ind.hinchada>=88;
  const costoEst=Math.round(420+E.ind.estadio*6), ganEst=Math.max(4,Math.round(14-E.ind.estadio/12));
  const inv=[
   {n:"Ampliar el estadio",costo:costoEst,disp:!estTope,
    desc:estTope?"El estadio ya es de primer nivel: no hay obra chica que lo mejore.":"+"+ganEst+" estado del estadio (más aforo, menos sanciones). Cada ampliación cuesta más y rinde menos.",
    fn:()=>aplicarEfectos({plata:-costoEst,estadio:ganEst})},
   {n:"Campaña de marketing",costo:250,disp:!hinTope,
    desc:hinTope?"La hinchada ya está a full: gastar en publicidad ahora es tirar la plata.":"+ hinchada, socios y algo de prestigio. Pierde efecto cuando la gente ya está prendida.",
    fn:()=>aplicarEfectos({plata:-250,hinchada:Math.max(2,Math.round((88-E.ind.hinchada)/6)),socios:4,prestigio:2})},
   E.staff.cm?{n:"Community Manager (contratado)",costo:0,disp:false,desc:"Ya tenés CM. Se maneja desde PLOP.",fn:null}
             :{n:"Contratar Community Manager",costo:180,disp:true,desc:"Profesionaliza la comunicación: + prestigio y desbloquea campañas en PLOP.",fn:()=>{ aplicarEfectos({plata:-180,prestigio:2}); E.staff.cm=true; }}
  ];
  inv.forEach(o=>{
    const d=el("div","resul mitad");
    d.innerHTML="<b>"+o.n+"</b> "+(o.costo?"· "+plata(o.costo):"")+"<br><span class='mini'>"+o.desc+"</span>";
    if(o.fn && o.disp){
      const sinCaja=E.plata<o.costo;
      const b=el("button","btn-aqua chico"+(sinCaja?" gris":" verde"),"Invertir"); b.style.marginTop="5px";
      b.disabled=sinCaja;
      b.onclick=()=>{ o.fn(); guardar(); render(); aviso(o.n+" · "+plata(o.costo)); };
      d.appendChild(b);
    } else if(!o.disp && o.n.indexOf("contratado")<0){
      d.appendChild(el("span","etq neu","Tope alcanzado"));
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
  /* préstamo estructurado: caja ahora a cambio de más deuda */
  if(typeof tomarPrestamo==="function"){
    pd.cuerpo.appendChild(el("p","mini","¿Necesitás caja ya? Pedí un crédito: entra plata al toque, pero la deuda sube con recargo (8%) y los intereses corren igual."));
    const pr=el("div");
    [300,600,1000].forEach(m=>{
      const b=el("button","btn-aqua chico amarillo","Pedir "+plata(m)); b.style.marginRight="6px";
      b.onclick=()=>{ tomarPrestamo(m); guardar(); render(); aviso("Crédito por "+plata(m)); };
      pr.appendChild(b);
    });
    pd.cuerpo.appendChild(pr);
  }
  /* delegar la gestión financiera al Tesorero */
  if(E.finanzas){
    const dl=el("div","resul mitad"); dl.style.marginTop="8px";
    dl.innerHTML="<b>Delegar caja al Tesorero</b><br><span class='mini'>Abona la deuda solo con el excedente y te saca la pega de encima, pero cobra una comisión semanal (más alta si es poco honesto).</span>";
    const b=el("button","btn-aqua chico "+(E.finanzas.delegado?"rojo":"verde"),E.finanzas.delegado?"Retomar el control":"Delegar al Tesorero");
    b.style.marginTop="5px";
    b.onclick=()=>{ E.finanzas.delegado=!E.finanzas.delegado; guardar(); render(); aviso(E.finanzas.delegado?"Delegaste la caja al Tesorero":"Retomaste el control de la caja"); };
    dl.appendChild(b);
    pd.cuerpo.appendChild(dl);
  }
  v.appendChild(pd);
  /* fondos desviados / redención (Bloque 2) */
  /* 6.10 · camarín descontento: reconquistar caras largas con plata */
  if(typeof jugadoresDescontentos==="function"){
    const desc=jugadoresDescontentos();
    if(desc.length){
      const pc=panel("Camarín descontento","😤","alerta");
      pc.cuerpo.appendChild(el("p","mini","Jugadores con la cara larga (poca moral, casi siempre por una negociación que salió mal). Un plus los reconquista y suma al grupo — si no, los vas perdiendo de a poco."));
      desc.slice(0,6).forEach(j=>{
        const costo=costoReconquista(j);
        const d=el("div","resul mitad");
        d.innerHTML="<b>"+j.n+"</b> <span class='mini'>· "+j.pos+" · nivel "+j.nivel+" · moral "+Math.round(j.moral)+"/100</span>";
        const b=el("button","btn-aqua chico"+(E.plata<costo?" gris":" verde"),"💵 Acercarlo al plantel · "+plata(costo));
        b.style.marginTop="5px"; b.disabled=E.plata<costo;
        b.onclick=()=>{ const r=reconquistarJugador(j); if(!r.ok){ aviso(r.msg); return; } guardar(); render(); aviso("Reconquistaste a "+j.n+" (+moral)"); };
        d.appendChild(b);
        pc.cuerpo.appendChild(d);
      });
      v.appendChild(pc);
    }
  }
  if(typeof panelDesfalco==="function"){ const pdf=panelDesfalco(); if(pdf) v.appendChild(pdf); }
}
/* ---------------- plantel ---------------- */
let PLANTEL_FILT="todos";
function rolProbable(j){
  if(j.lesion>0) return "lesionado";
  if(j.cedido) return "cedido";
  const same=E.plantel.filter(x=>!x.vendido&&!x.cedido&&x.pos===j.pos).sort((a,b)=>b.nivel-a.nivel);
  const i=same.findIndex(x=>x.n===j.n);
  if(i===0) return "titular";
  if(i===1) return "suplente";
  return "fondo";
}
function lecturaJugador(j){
  const bits=[];
  bits.push(j.real?"Nombre documentado de esa temporada. Nivel, sueldo y valor son estimación.":"No está en el plantel público: es relleno de cantera.");
  const rol=rolProbable(j);
  if(rol==="titular") bits.push("Hoy sería el primero en su puesto.");
  if(rol==="fondo") bits.push("Está atrás en la fila: si no juega, la moral se come sola.");
  if(j.moral<45) bits.push("Cortado. Una venta mal hecha o un banco largo te explota el camarín.");
  if(j.forma>=82) bits.push("En racha.");
  if(j.edad>=33) bits.push("El cuerpo ya no da para 40 partidos.");
  if(j.proy-j.nivel>=8 && j.edad<=23) bits.push("Todavía puede subir si suma minutos.");
  if(j.contrato.hasta<=E.anio) bits.push("El contrato se vence este año.");
  return bits.join(" ");
}
function renovarContrato(j){
  const extra=Math.max(8,Math.round(j.sueldo*0.12));
  if(E.fin.caja<extra){ aviso("No hay caja para el aumento ("+plata(extra)+")"); return false; }
  E.fin.caja-=extra;
  j.sueldo+=extra;
  j.contrato.hasta=Math.max(j.contrato.hasta,E.anio)+2;
  j.moral=clamp((j.moral||70)+8,0,100);
  if(typeof pushNotif==="function") pushNotif("Renové a "+j.n,j.n+" firmó hasta "+j.contrato.hasta+". Costó "+plata(extra)+" de caja.","bueno");
  guardar(); return true;
}
function charlaJugador(j,tipo){
  if(tipo==="banco"){ j.moral=clamp((j.moral||70)+7,0,100); if(E.ind) E.ind.moral=clamp((E.ind.moral||50)+1,0,100); aviso(j.n+" sale más tranquilo."); }
  else { j.forma=clamp((j.forma||70)+5,0,100); j.moral=clamp((j.moral||70)-5,0,100); aviso(j.n+" se queda pensando."); }
  guardar();
}
function vistaPlantel(){
  const v=$("#vista");
  const p=panel("Plantel "+E.anio,"👥");
  p.cuerpo.appendChild(el("p","mini","● nombre documentado. Sin punto: cantera / relleno. Stats estimadas."));
  const f=el("div","fichas");
  [["todos","Todos"],["ARQ","Arqueros"],["DEF","Defensas"],["VOL","Volantes"],["DEL","Delanteros"],["real","Documentados"],["fondo","Cantera"]].forEach(([k,n])=>{
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",PLANTEL_FILT===k?"true":"false");
    b.onclick=()=>{ PLANTEL_FILT=k; irA("plantel"); };
    f.appendChild(b);
  });
  p.cuerpo.appendChild(f);
  const t=el("table");
  t.innerHTML="<thead><tr><th>Jugador</th><th>Pos</th><th>Rol</th><th class='n'>Ed</th><th class='n'>Niv</th><th class='n'>For</th><th class='n'>Gol</th><th class='n'>Sueldo</th></tr></thead>";
  const tb=el("tbody");
  E.plantel.filter(j=>{
    if(j.vendido) return false;
    if(PLANTEL_FILT==="real") return !!j.real;
    if(PLANTEL_FILT==="fondo") return !j.real;
    if(PLANTEL_FILT!=="todos") return j.pos===PLANTEL_FILT;
    return true;
  }).sort((a,b)=>b.nivel-a.nivel).forEach(j=>{
    const tr=el("tr");
    const rol=rolProbable(j);
    tr.innerHTML="<td>"+(j.real?"● ":"")+j.n+(j.lesion>0?" 🩹":"")+(j.cedido?" 🔄":"")+"</td><td>"+j.pos+"</td><td class='mini'>"+rol+"</td><td class='n'>"+j.edad+
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
    box.appendChild(el("div","cab",'<span class="ic">👤</span><span>'+j.n+(j.real?"":" · cantera")+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p","mini",lecturaJugador(j)));
    c.appendChild(fila("Puesto",j.pos+" · "+j.edad+" años · "+rolProbable(j)));
    c.appendChild(fila("Nivel / proyección",j.nivel+" / "+j.proy+(j.real?" · aprox.":"")));
    c.appendChild(fila("Forma / moral",Math.round(j.forma)+" / "+Math.round(j.moral)));
    c.appendChild(fila("Sueldo anual",plata(j.sueldo)));
    c.appendChild(fila("Valor estimado",plata(j.valor)));
    c.appendChild(fila("Contrato","hasta "+j.contrato.hasta));
    if(j.rasgos.length) c.appendChild(el("p","mini","Rasgos: "+j.rasgos.join(", ")));
    /* 6.20 · qué hacen los rasgos con hook */
    const RASGOS_HOOK={
      "de la casa":"🏠 Símbolo del club: venderlo golpea a la hinchada; en el clásico se agranda.",
      "cabeza caliente":"🔥 Juega al límite: más riesgo de tarjeta pasado el minuto 60 y de una segunda amarilla.",
      "frio de definicion":"❄️ Falla mano a mano pero es letal desde el punto de penal.",
      "llegador":"🎯 Volante que pisa el área: llega al gol y reparte más asistencias."
    };
    const hooks=(j.rasgos||[]).filter(r=>RASGOS_HOOK[r]);
    if(hooks.length){ const box=el("div"); hooks.forEach(r=>box.appendChild(el("div","mini",RASGOS_HOOK[r]))); c.appendChild(box); }
    if(j.lesion>0) c.appendChild(el("p","mini","Lesionado: fuera unas "+j.lesion+" semanas."));
    if(j.cedido){ c.appendChild(el("div","resul mitad","🔄 Cedido a "+j.cedido.club+" hasta "+j.cedido.hasta+". Vuelve mejorado.")); }
    if(!j.cedido){
      const bch=el("button","btn-aqua chico","Hablar y bancar");
      bch.onclick=()=>{ charlaJugador(j,"banco"); cerrarModal(); render(); };
      const bex=el("button","btn-aqua chico","Exigir más"); bex.style.marginLeft="6px";
      bex.onclick=()=>{ charlaJugador(j,"exigir"); cerrarModal(); render(); };
      const brn=el("button","btn-aqua chico verde","Renovar (+2 años)"); brn.style.marginLeft="6px";
      brn.onclick=()=>{ if(renovarContrato(j)){ cerrarModal(); render(); } };
      c.appendChild(bch); c.appendChild(bex); c.appendChild(brn);
      const tieneOferta=E.ofertasPend&&E.ofertasPend.some(o=>o.jid===j.n);
      const bv=el("button","btn-aqua ancho verde"+(tieneOferta?" gris":""),tieneOferta?"Ya hay una oferta abierta":"Buscar comprador");
      bv.style.marginTop="8px";
      bv.disabled=tieneOferta; bv.onclick=()=>{ cerrarModal(); buscarComprador(j); };
      c.appendChild(bv);
      const br=el("button","btn-aqua ancho rojo","Rematar (~"+plata(Math.round(j.valor*0.47))+")"); br.style.marginTop="6px";
      br.onclick=()=>{ if(confirm("¿Rematar a "+j.n+"? El directorio no lo perdona.")){ ventaFlash(j); cerrarModal(); render(); } };
      c.appendChild(br);
      if(typeof puedeCeder==="function" && puedeCeder(j)){
        const bc=el("button","btn-aqua ancho","🔄 Ceder a préstamo"); bc.style.marginTop="6px";
        bc.onclick=()=>{ cederPrestamo(j); cerrarModal(); render(); };
        c.appendChild(bc);
      }
    }
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
      (c.local?"vs ":"a ")+c.rivalNombre+' <span class="mini">'+fechaTxt(c.f)+
      (c.tipo==="copa"?" · "+c.ronda:"")+(c.fecha?" · F"+c.fecha:"")+
      (!c.jugado&&c.real&&E.config&&E.config.spoiler?" · hist. "+c.real:"")+'</span></span>'+
      '<b class="etq '+est+'">'+marc+'</b>';
    p.cuerpo.appendChild(d);
  });
  v.appendChild(p);
  if(E.ultimaFecha&&E.ultimaFecha.length){
    const pr=panel("Resto de la fecha","⚽");
    E.ultimaFecha.forEach(x=>{
      pr.cuerpo.appendChild(el("div","fila","<span>"+x.a+" vs "+x.b+"</span><b>"+x.ga+"-"+x.gb+"</b>"));
    });
    pr.cuerpo.appendChild(el("p","mini","Se simula con la fuerza de cada club. Los cruce oficiales (CC/UCH/UC) se respetan; el resto es emparejamiento fijo de la fecha."));
    v.appendChild(pr);
  }

  const pt=panel("Tabla de posiciones","📊","agua");
  const arr=LIGA_ACT.map(c=>Object.assign({id:c.id,n:c.n},E.tabla[c.id]||{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}));
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
function pestañasRedes(cont){
  const f=el("div","fichas");
  [["club","Cuenta oficial del club"],["yo","Perfil personal del DT"]].forEach(([k,n])=>{
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",REDES_PEST===k?"true":"false");
    b.onclick=()=>{ REDES_PEST=k; irA("redes"); };
    f.appendChild(b);
  });
  cont.appendChild(f);
}
let REDES_TAB="inicio";
/* 6.3 · render de un post (reutilizable por el feed y por los bots que entran solos) */
function renderPostEl(t){
  const ic=t.tipo==="prensa"?"🎙️":(t.tipo==="jugador"?"⚽":(t.tipo==="club"?"🏟️":(t.tipo==="dt"?"🧑‍💼":(t.tipo==="rival"?"🆚":"👤"))));
  const verif=(typeof esVerificado==="function"&&esVerificado(t))?" <span class='verif' title='Cuenta verificada'>✔</span>":"";
  const d=el("div","resul "+(t.tono==="bueno"?"bien":(t.tono==="malo"?"mal":"mitad")));
  d.innerHTML="<b>"+ic+" "+t.autor+verif+"</b> <span class='mini'>· "+(t.fecha||"hoy")+" "+(t.anio||"")+"</span><br>"+t.texto+
    "<div class='mini' style='opacity:.6;margin-top:2px'>♡ "+(t.likes||0).toLocaleString("es-CL")+
    (t.rts?" · RT "+t.rts:"")+(t.replies?" · "+t.replies+" resp.":"")+"</div>";
  if(t.hilo&&t.hilo.length){
    t.hilo.slice(-3).forEach(h=>{ d.appendChild(el("p","mini","↳ <b>"+h.autor+"</b> "+h.texto)); });
  }
  const acc=el("div"); acc.style.marginTop="6px";
  [["like",t._like?"❤ Te gusta":"♡ Me gusta"],["rt",t._rt?"🔁 Reposteado":"RT"],["reply","Responder"],["report","🚩 Reportar"]].forEach(([k,n])=>{
    const b=el("button","btn-aqua chico"+(k==="report"?" gris":""),n); b.style.marginRight="5px"; b.style.marginTop="4px";
    b.onclick=()=>reaccionarPost(t,k);
    acc.appendChild(b);
  });
  d.appendChild(acc);
  return d;
}
/* bots que hacen que el feed se mueva solo, como en Twitter */
let PLOP_TIMER=null;
function detenerPlopBots(){ if(PLOP_TIMER){ clearInterval(PLOP_TIMER); PLOP_TIMER=null; } }
function arrancarPlopBots(){
  detenerPlopBots();
  if(!E || (E.config&&E.config.plopBots===false)) return;
  PLOP_TIMER=setInterval(()=>{
    if(!E || SEC!=="redes" || REDES_TAB!=="inicio"){ detenerPlopBots(); return; }
    const capa=$("#capa-modal"); if(capa&&capa.children.length) return; /* no molestar en un modal */
    if(typeof botPost!=="function") return;
    const item=botPost();
    const feedBox=$("#plopFeed");
    if(feedBox&&item){
      const node=renderPostEl(item); node.classList.add("plop-nuevo");
      const arriba=feedBox.scrollTop<30;            /* si está mirando lo último, se lo mostramos */
      const h0=feedBox.scrollHeight, s0=feedBox.scrollTop;
      feedBox.insertBefore(node, feedBox.firstChild);
      while(feedBox.children.length>60) feedBox.removeChild(feedBox.lastChild);
      if(!arriba) feedBox.scrollTop=s0+(feedBox.scrollHeight-h0);  /* no le movemos la vista al que lee */
    }
  }, 5000);
}
function reaccionarPost(t,tipo){
  t.likes=t.likes||0; t.rts=t.rts||0; t.replies=t.replies||0; t.hilo=t.hilo||[];
  const amistoso=(t.tipo==="hincha"||t.tipo==="club"||t.tipo==="jugador"||t.tono==="bueno");
  const hostil=(t.tipo==="rival"||t.tono==="malo");
  if(tipo==="like"){
    if(t._like) return aviso("Ya le diste like");
    t._like=true; t.likes+=ri(4,40);
    E.plopLikes=E.plopLikes||[]; if(E.plopLikes.indexOf(t.id)<0) E.plopLikes.push(t.id);
    if(amistoso){
      aplicarGrupos({hinchada:2}); moverSeguidores&&moverSeguidores(ri(20,120));
      /* la cuenta reacciona al like del DT: te acerca a la gente */
      t.replies++; t.hilo=t.hilo||[]; t.hilo.push({autor:t.autor,texto:elige(["¡Le gustó al mismísimo DT! 🙌","Nos leyó el técnico, grande.","Bancado desde arriba. Vamos."]),fecha:"ahora"});
      aviso("❤ Le llegó tu like — la hinchada lo festeja (+2)");
    } else if(hostil){
      aplicarRep({credibilidad:-2}); aplicarGrupos({hinchada:-2});
      aviso("😬 Le diste like a un hostil… mal mirado por la gente (−2 hinchada)");
    } else aviso("❤ Like");
  } else if(tipo==="rt"){
    if(t._rt) return aviso("Ya lo reposteaste");
    t._rt=true; t.rts=(t.rts||0)+1; t.likes+=ri(10,80);
    if(hostil){
      /* te auto-troleaste: amplificaste a un hostil */
      aplicarGrupos({hinchada:-6,prensa:-4}); aplicarRep({credibilidad:-6});
      if(typeof recordar==="function") recordar("plop","reposteaste a "+t.autor+", un hostil (te auto-troleaste)",{peso:"medio",tono:"malo"});
      if(typeof postProc==="function") postProc(handleDT(),"dt","RT "+t.autor+": "+(t.texto||"").slice(0,80),"malo");
      aviso("🤦 Reposteaste a un hostil. Te auto-troleaste: la gente y la prensa te caen encima.");
    } else {
      aplicarGrupos({hinchada:3}); aplicarRep({publica:2}); moverSeguidores&&moverSeguidores(ri(40,260));
      if(typeof postProc==="function") postProc(handleDT(),"dt","RT "+t.autor+": "+(t.texto||"").slice(0,80),"bueno");
      aviso("🔁 Repost al aire — sumás a los tuyos (+3 hinchada)");
    }
  } else if(tipo==="report"){
    if(t._report) return aviso("Ya lo reportaste");
    t._report=true; t.reportado=true;
    if(hostil){ aviso("🚩 Reportado. Le bajaste el alcance a un hostil."); moverSeguidores&&moverSeguidores(ri(5,40)); }
    else aviso("🚩 Reportado. Igual reportar a cualquiera no queda bien si no molestaba.");
    E.timeline=(E.timeline||[]).filter(x=>x!==t);
  } else {
    const r=prompt("Responder a "+t.autor,"");
    if(r===null) return;
    const txt=(r||"").trim()||elige(["Te leí.","Se trabaja.","Gracias por el banco."]);
    t.replies++;
    t.hilo.push({autor:handleDT(),texto:txt,fecha:"ahora"});
    if(typeof postProc==="function") postProc(handleDT(),"dt","@"+String(t.autor||"").replace(/^@/,"")+" "+txt,"neutro");
    aplicarRep({prensa:1});
  }
  guardar(); irA("redes");
}
/* quitar un me gusta: revierte parte del acercamiento */
function quitarLike(t){
  if(!t||!t._like) return;
  t._like=false; t.likes=Math.max(0,(t.likes||0)-ri(4,30));
  E.plopLikes=(E.plopLikes||[]).filter(id=>id!==t.id);
  const amistoso=(t.tipo==="hincha"||t.tipo==="club"||t.tipo==="jugador"||t.tono==="bueno");
  if(amistoso){ aplicarGrupos({hinchada:-1}); aviso("Quitaste el like. La gente lo nota (−1 hinchada)."); }
  else aviso("Like retirado.");
  guardar(); irA("redes");
}
/* impulsar tu cuenta con plata (crecer para comerte todo) */
function impulsarPlop(monto){
  if(E.plata<monto) return aviso("No te alcanza la caja");
  aplicarEfectos({plata:-monto});
  const nuevos=Math.round(monto*ri(90,160)); moverSeguidores&&moverSeguidores(nuevos);
  aplicarRep({publica:Math.round(monto/120)});
  if(typeof recordar==="function" && monto>=200) recordar("plop","metiste plata para inflar tu cuenta de PLOP",{peso:"bajo"});
  guardar(); render(); aviso("📈 +"+nuevos.toLocaleString("es-CL")+" seguidores por la campaña");
}
function vistaRedes(){
  if(typeof sembrarRedes==="function" && (!E.timeline||E.timeline.length<3)) sembrarRedes();
  const v=$("#vista");
  const cab=panel("PLOP! · 2008","🐦","agua");
  pestañasRedes(cab.cuerpo);
  const tabs=el("div","fichas");
  [["inicio","Inicio"],["menciones","Menciones"],["megusta","Me gusta"],["tendencias","Tendencias"]].forEach(([k,n])=>{
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",REDES_TAB===k?"true":"false");
    b.onclick=()=>{ REDES_TAB=k; irA("redes"); };
    tabs.appendChild(b);
  });
  cab.cuerpo.appendChild(tabs);
  cab.cuerpo.appendChild(el("p","mini",
    (E.seguidores||0).toLocaleString("es-CL")+" seguidores · "+
    (REDES_PEST==="club"?"cuenta @ oficial del club":"perfil personal del DT")));
  v.appendChild(cab);

  const p=panel(REDES_PEST==="club"?"Publicar como club":"Publicar como DT","✍️");
  const ta=el("textarea"); ta.className="entrada"; ta.rows=2; ta.maxLength=140;
  ta.placeholder=REDES_PEST==="club"?"Comunicado oficial… (140)":"Qué estás pensando… (140)";
  ta.style.width="100%";
  const cnt=el("p","mini","0 / 140");
  ta.oninput=()=>{ cnt.textContent=(ta.value||"").length+" / 140"; };
  p.cuerpo.appendChild(ta); p.cuerpo.appendChild(cnt);
  const bp=el("button","btn-aqua ancho verde",REDES_PEST==="club"?"Publicar en la cuenta oficial":"Publicar en tu perfil");
  bp.onclick=()=>{
    const txt=(ta.value||"").trim().slice(0,140); if(!txt){ aviso("Escribí algo primero"); return; }
    bp.disabled=true;
    evaluarPost(txt).then(ev=>{
      aplicarPost(txt,ev);
      if(typeof postProc==="function") postProc(REDES_PEST==="club"?handleClub():(handleDT()), REDES_PEST==="club"?"club":"dt", txt, ev.sentimiento>10?"bueno":(ev.sentimiento<-10?"malo":"neutro"));
      irA("redes");
    });
  };
  p.cuerpo.appendChild(bp);
  if(REDES_PEST==="club"){
    p.cuerpo.appendChild(el("h3","sub","Comunicados rápidos"));
    const fr=el("div","ops");
    POSTS_PREDEF.forEach(pp=>{
      const b=el("button","op");
      b.innerHTML='<div class="t">'+pp.t+'</div><div class="d">"'+pp.texto+'"</div>';
      b.onclick=()=>{ aplicarPost(pp.texto, Object.assign({},pp.ev)); irA("redes"); };
      fr.appendChild(b);
    });
    p.cuerpo.appendChild(fr);
  }
  v.appendChild(p);

  /* comunidad digital: seguidores, ingreso y campañas del CM */
  const pcd=panel("Comunidad digital","📈","agua");
  pcd.cuerpo.appendChild(fila("Seguidores",(E.seguidores||0).toLocaleString("es-CL")));
  const dig=(typeof ingresoDigital==="function")?ingresoDigital():0;
  pcd.cuerpo.appendChild(fila("Sponsor digital (al año)",E.staff&&E.staff.cm?plata(dig):"—"));
  if(E.staff&&E.staff.cm){
    pcd.cuerpo.appendChild(el("p","mini","Tu Community Manager puede lanzar campañas:"));
    const bh=el("button","btn-aqua chico","🎉 Campaña de humo");
    bh.onclick=()=>{ campanaCM("humo"); render(); };
    const bs=el("button","btn-aqua chico gris","📄 Comunicado serio"); bs.style.marginLeft="6px";
    bs.onclick=()=>{ campanaCM("serio"); render(); };
    pcd.cuerpo.appendChild(bh); pcd.cuerpo.appendChild(bs);
  } else {
    pcd.cuerpo.appendChild(el("div","resul mitad","Contratá un <b>Community Manager</b> en Finanzas para monetizar seguidores (sponsor digital) y lanzar campañas."));
  }
  /* tu identidad en PLOP: usuario y verificado */
  E.plopVerif=E.plopVerif||{};
  const miHandle=(typeof handleDT==="function")?handleDT():"@dt";
  const verifOwn=!!E.plopVerif[miHandle];
  pcd.cuerpo.appendChild(el("h3","sub","Tu cuenta: "+miHandle+(verifOwn?" ✔":"")));
  const inU=el("input"); inU.type="text"; inU.maxLength=16; inU.className="entrada"; inU.style.width="100%";
  inU.placeholder="Tu usuario (ej: @dtcrack)"; inU.value=(E.perfil&&E.perfil.plopUser)||"";
  const bU=el("button","btn-aqua chico verde","Guardar usuario"); bU.style.marginTop="5px";
  bU.onclick=()=>{ let u=(inU.value||"").trim().replace(/\s/g,"").replace(/^@*/,"@").slice(0,16); if(u.length<2){ aviso("Poné un usuario válido"); return; } E.perfil=E.perfil||{}; E.perfil.plopUser=u; guardar(); render(); aviso("Ahora firmás como "+u); };
  pcd.cuerpo.appendChild(inU); pcd.cuerpo.appendChild(bU);
  if(!verifOwn){
    const bV=el("button","btn-aqua chico"+(E.plata<150?" gris":""),"✔ Comprar verificado · "+plata(150)); bV.style.marginLeft="6px"; bV.style.marginTop="5px";
    bV.disabled=E.plata<150;
    bV.onclick=()=>{ if(E.plata<150) return aviso("No te alcanza"); aplicarEfectos({plata:-150}); E.plopVerif[handleDT()]=true; aplicarRep({publica:3}); moverSeguidores&&moverSeguidores(ri(300,1500)); guardar(); render(); aviso("✔ Cuenta verificada — más alcance y estatus"); };
    pcd.cuerpo.appendChild(bV);
  }
  /* crecer para comerte todo: impulsar la cuenta con plata */
  pcd.cuerpo.appendChild(el("p","mini","Impulsá tu cuenta: plata a cambio de alcance y seguidores. El que domina la conversación domina la calle."));
  const imp=el("div");
  [["Impulso chico",80],["Campaña",200],["Ofensiva total",500]].forEach(([n,m])=>{
    const b=el("button","btn-aqua chico"+(E.plata<m?" gris":" verde"),n+" · "+plata(m)); b.style.marginRight="5px"; b.style.marginTop="4px";
    b.disabled=E.plata<m; b.onclick=()=>impulsarPlop(m);
    imp.appendChild(b);
  });
  pcd.cuerpo.appendChild(imp);
  v.appendChild(pcd);

  if(REDES_TAB==="megusta"){
    const pl=panel("Tus Me gusta","❤");
    const ids=E.plopLikes||[];
    const likeados=(E.timeline||[]).filter(t=>t._like||ids.indexOf(t.id)>=0);
    if(!likeados.length) pl.cuerpo.appendChild(el("p","mini","Todavía no le diste me gusta a nada. Tus likes acercan (o alejan) a la gente: elegí bien a quién bancás."));
    likeados.forEach(t=>{
      const d=el("div","resul "+(t.tono==="bueno"?"bien":(t.tono==="malo"?"mal":"mitad")));
      d.innerHTML="<b>"+t.autor+"</b> <span class='mini'>· "+t.fecha+"</span><br>"+t.texto;
      const b=el("button","btn-aqua chico gris","Quitar me gusta"); b.style.marginTop="5px";
      b.onclick=()=>quitarLike(t);
      d.appendChild(b);
      pl.cuerpo.appendChild(d);
    });
    v.appendChild(pl);
    return;
  }
  if(REDES_TAB==="tendencias"){
    const pt=panel("Tendencias en Chile","#️⃣");
    (typeof tendencias==="function"?tendencias():[]).forEach((x,i)=>{
      pt.cuerpo.appendChild(el("div","fila","<span>"+(i+1)+". <b>"+x.tag+"</b></span><b class='mini'>"+x.n.toLocaleString("es-CL")+"</b>"));
    });
    pt.cuerpo.appendChild(el("p","mini","Se arma con el próximo rival, el club y el clima del camarín. No es una API real."));
    v.appendChild(pt);
    return;
  }
  const yo=String(handleDT()).toLowerCase().replace(/^@/,"");
  const feed=(E.timeline||[]).filter(t=>{
    if(REDES_TAB!=="menciones") return true;
    const tx=(t.texto||"").toLowerCase();
    return tx.indexOf("@"+yo.replace(/\s/g,""))>=0 || tx.indexOf("@dt")>=0 || t.tipo==="prensa";
  });
  const pt=panel(REDES_TAB==="menciones"?"Menciones y prensa":"Inicio","🐦");
  if(REDES_TAB==="inicio"){
    pt.cuerpo.appendChild(el("div","","<span class='envivo'>EN VIVO</span> <span class='mini'>· la gente postea en tiempo real. Scrolleá el feed acá abajo.</span>"));
  }
  const feedBox=el("div"); feedBox.id="plopFeed";
  if(!feed.length) feedBox.appendChild(el("p","mini","El feed está quieto. Jugá un partido o publicá algo."));
  feed.slice(0,40).forEach(t=>feedBox.appendChild(renderPostEl(t)));
  pt.cuerpo.appendChild(feedBox);
  v.appendChild(pt);
  if(REDES_TAB==="inicio" && typeof arrancarPlopBots==="function") arrancarPlopBots();

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
    ba.onclick=()=>{ if(typeof responderOferta==="function"){ responderOferta(n,"aceptar"); render(); } };
    const bc=el("button","btn-aqua chico","Pedir más plata"); bc.style.marginLeft="6px";
    bc.onclick=()=>{ if(typeof responderOferta==="function"){ responderOferta(n,"contra"); render(); } };
    const br=el("button","btn-aqua chico gris","Rechazar"); br.style.marginLeft="6px";
    br.onclick=()=>{ if(typeof responderOferta==="function"){ responderOferta(n,"rechazar"); render(); } };
    cont.appendChild(ba); cont.appendChild(bc); cont.appendChild(br);
    d.appendChild(cont);
  }
  return d;
}
/* ---------------- ajustes ---------------- */
function vistaAjustes(){
  const v=$("#vista");
  const don=panel("El proyecto","💚");
  don.cuerpo.appendChild(el("p",null,"Futbolini es gratis. Se sostiene con tiempo y, si alguien quiere, con donaciones para pagar IA y seguir construyendo."));
  don.cuerpo.appendChild(el("p","mini","Todavía no hay pasarela. Cuando esté, va a vivir en esta misma pantalla. Si querés ayudar ahora: compartí el juego o escribile al autor."));
  v.appendChild(don);
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
  p.cuerpo.appendChild(el("label","lb","Spoilers históricos"));
  const fs=el("div","fichas");
  [["si","Con spoiler (dice qué pasó)"],["no","Sin spoiler"]].forEach(([k,n])=>{
    const on=k==="si";
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",!!E.config.spoiler===on?"true":"false");
    b.onclick=()=>{ E.config.spoiler=on; guardar(); render(); };
    fs.appendChild(b);
  });
  p.cuerpo.appendChild(fs);
  p.cuerpo.appendChild(el("div","resul mitad","<b>Aviso.</b> Clubes, jugadores y dirigentes reales aparecen con su nombre. "+
    "Resultados, títulos y fechas se apoyan en registros públicos. Todo lo demás (conversaciones, negociaciones, conflictos internos, frases) "+
    "es ficción escrita para el juego."));
  const b1=el("button","btn-aqua chico","Guardar ahora"); b1.onclick=async()=>{ await guardar(); aviso("Partida guardada"); };
  const b2=el("button","btn-aqua chico rojo","Borrar partida"); b2.style.marginLeft="6px";
  b2.onclick=async()=>{ if(confirm("¿Borrar la partida guardada?")){ await Store.del(LLAVE); E=null; render(); } };
  p.cuerpo.appendChild(b1); p.cuerpo.appendChild(b2);
  v.appendChild(p);

  /* ---- Modo Dios (panel de cheats) ---- */
  const pg=panel("Modo Dios","😇","alerta");
  pg.cuerpo.appendChild(el("p","mini","Panel de trucos para jugar como quieras. Cambiá todo a mano; no hay reglas acá."));
  const tog=el("button","btn-aqua chico"+(E.flags.modoDios?"":" gris"),E.flags.modoDios?"Modo Dios: ON":"Activar Modo Dios");
  tog.onclick=()=>{ E.flags.modoDios=!E.flags.modoDios; guardar(); render(); };
  pg.cuerpo.appendChild(tog);
  if(E.flags.modoDios){
    const cheat=(label,fn)=>{ const b=el("button","btn-aqua chico"); b.textContent=label; b.style.margin="4px 4px 0 0"; b.onclick=()=>{ fn(); guardar(); render(); }; pg.cuerpo.appendChild(b); };
    pg.cuerpo.appendChild(el("h3","sub","Plata y club"));
    cheat("Caja club +1000",()=>aplicarEfectos({plata:1000}));
    cheat("Bolsillo +500",()=>{ E.personal.bolsillo+=500; });
    cheat("Capital +50",()=>{ E.capital=Math.min(999,(E.capital||0)+50); });
    cheat("Deuda = 0",()=>{ E.deuda=0; });
    cheat("Riesgo = 0",()=>{ E.ind.riesgo=0; });
    cheat("Desfalco = 0",()=>{ E.flags.desfalco=0; E.flags.investigacionAbierta=false; });
    pg.cuerpo.appendChild(el("h3","sub","Plantel y ánimo"));
    cheat("Plantel +5 nivel",()=>{ E.plantel.forEach(j=>{ if(!j.vendido) j.nivel=clamp(j.nivel+5,0,99); }); E.ind.plantel=clamp(Math.round(mediaPlantel()),0,100); });
    cheat("Moral / hinchada 90",()=>{ E.ind.moral=90; E.ind.hinchada=90; });
    cheat("Curar lesionados",()=>{ E.plantel.forEach(j=>j.lesion=0); });
    cheat("Todos los grupos +30",()=>{ GRUPOS.forEach(g=>{ E.grupos[g.id].aprob=clamp(E.grupos[g.id].aprob+30,-100,100); }); });
    cheat("Bienestar 100",()=>{ if(E.perfil) E.perfil.bienestar=100; });
    pg.cuerpo.appendChild(el("h3","sub","Inyectar eventos"));
    cheat("Decisión al azar",()=>{ if(typeof generarDecisionProc==="function"){ const d=generarDecisionProc(); if(d) E.decPend.push({id:d.id,clave:d.id+"_"+E.anio,peso:d.peso}); } });
    const bve=el("button","btn-aqua chico"); bve.textContent="Evento de vida"; bve.style.margin="4px 4px 0 0";
    bve.onclick=()=>{ if(typeof modalVidaProc==="function"&&typeof VIDA_PROC!=="undefined") modalVidaProc(elige(VIDA_PROC)); };
    pg.cuerpo.appendChild(bve);
    cheat("Sumar un título",()=>{ E.titulos.push("Título (Modo Dios) "+E.anio); });
  }
  v.appendChild(pg);
}
/* ---------------- avanzar ---------------- */
function procesarSemanaPostPartido(){
  const neto=tickSemana();
  if(typeof chequearDesfalco==="function") chequearDesfalco();
  repartirDecisiones();
  const ctx=eventosDeContexto();
  generarOfertasSemana();
  if(typeof sembrarDecisionProc==="function") sembrarDecisionProc();
  const ev=tirarEvento();
  if(ev&&ev.tipo==="decision"){ abrirEventoDecision(ev.ev); return {neto:neto,ctx:ctx,ev:ev}; }
  const vp=(typeof dispararVidaProc==="function")?dispararVidaProc():false;
  if(!vp && typeof dispararNegociacion==="function" && dispararNegociacion()) return {neto:neto,ctx:ctx,ev:ev};
  return {neto:neto,ctx:ctx,ev:ev,vp:vp};
}
function modalAvancePartido(part){
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">📅</span><span>Hay un partido en el calendario</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("h2","tit",(part.local?"vs ":"visita a ")+part.rivalNombre));
    c.appendChild(el("p","mini",(part.tipo==="copa"?"Copa Libertadores · "+part.ronda:"Campeonato Nacional · fecha "+part.fecha)+
      " · "+fechaTxt(part.f)+" · "+part.sede));
    c.appendChild(el("p",null,"Avanzar no salta fechas. O lo dirigís, o lo dejás al azar con la táctica que ya armaste."));
    const b1=el("button","btn-aqua ancho verde","Dirigir el partido");
    b1.onclick=()=>{ cerrarModal(); if(typeof pantallaPrevia==="function") pantallaPrevia(part); };
    const b2=el("button","btn-aqua ancho","Simular (dejar al azar)");
    b2.onclick=()=>{
      cerrarModal();
      if(typeof iniciarPartido==="function") iniciarPartido(part,"simular");
      else if(typeof pantallaPrevia==="function") pantallaPrevia(part);
    };
    const b3=el("button","btn-aqua ancho gris","Volver al escritorio");
    b3.style.marginTop="6px";
    b3.onclick=()=>{ cerrarModal(); irA("escritorio"); };
    c.appendChild(b1); c.appendChild(b2); c.appendChild(b3);
  },{cerrarFuera:false});
}
function avanzar(){
  if(!E||E.carrera.fin||E.carrera.enParo) return;
  const cr=crisisActiva();
  if(cr){ abrirCrisis(cr); return; }
  if(bloqueoDecisiones()) return;
  const part=proximoPartido();
  if(!part){ cerrarTemporada(); return; }
  if(!part.jugado){ modalAvancePartido(part); return; }
  const r=procesarSemanaPostPartido();
  irA("escritorio");
  if(r.ctx&&r.ctx.length) aviso(r.ctx[0]);
  else if(r.ev) aviso(r.ev.item?r.ev.item.t:"");
  else if(!r.vp) aviso("Semana · "+plata(r.neto));
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
/* 5.0 · negociación cara a cara con jugadores (Persuadir/Prometer/Forzar/Convencer) */
function modalNegociacion(neg){
  const OPCS=[
    {k:"persuadir",sev:"verde", t:"Persuadir",       d:"Apelás a la razón y al proyecto. Seguro, efecto moderado."},
    {k:"prometer", sev:"amarillo",t:"Prometer aumento",d:"Le tirás plata futura. Suele funcionar, pero pesa en la planilla."},
    {k:"forzar",   sev:"rojo",  t:"Forzar permanencia",d:"Sacás la chapa de autoridad. Alto riesgo si sale mal."},
    {k:"convencer",sev:"morado",t:"Convencer",       d:"Charla larga y personal. Impredecible: puede salir redondo o peor."}
  ];
  modal(box=>{
    box.classList.remove("panel");
    const p=panel("Cara a cara","🗣️","alerta"); p.classList.add("dec");
    p.cuerpo.appendChild(el("span","pilar per","PERSONAL"));
    p.cuerpo.appendChild(el("h2","tit",neg.j.n+" quiere hablar"));
    p.cuerpo.appendChild(el("div","ctx",neg.j.n+" ("+neg.j.pos+", "+neg.j.edad+" años) "+neg.tpl.pedido+". Lo tenés enfrente, hay que responder ahora."));
    const ops=el("div","ops");
    OPCS.forEach(o=>{
      const b=el("button","btn-aqua ancho "+o.sev);
      b.innerHTML='<b>'+o.t+'</b><br><span class="mini">'+o.d+'</span>';
      b.onclick=()=>{ const txt=resolverNegociacion(neg,o.k); cerrarModal(); render(); };
      ops.appendChild(b);
    });
    p.cuerpo.appendChild(ops);
    box.appendChild(p);
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
    /* 6.11 · lo que quedó del año: los momentos que dejaron huella (memoria) */
    if(typeof memoriaReciente==="function"){
      const delAnio=(E.memoria||[]).filter(m=>m.anio===E.anio && (m.peso==="alto"||m.peso==="medio")).slice(-4).reverse();
      if(delAnio.length){
        p.cuerpo.appendChild(el("h3","sub","Lo que quedó del año"));
        const ul=el("div");
        delAnio.forEach(m=>ul.appendChild(el("div","mini","• "+m.txt.charAt(0).toUpperCase()+m.txt.slice(1)+".")));
        p.cuerpo.appendChild(ul);
      }
    }
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
/* ---------- pantalla de arranque (que entrar no sea fome) ---------- */
function pantallaArranque(haySave){
  const ov=el("div",""); ov.id="arranque";
  const inner=el("div","arr-inner");
  inner.innerHTML=
    '<div class="arr-logo"><span class="arr-glifo">⚽</span><span class="arr-word">FUTBOLINI</span></div>'+
    '<div class="arr-sub">No manejás un equipo. Manejás una institución.</div>'+
    '<div class="arr-bar"><i></i></div>'+
    '<div class="arr-cargando">Preparando la cancha…</div>';
  const btns=el("div","arr-btns");
  const salir=cb=>{ ov.classList.add("fuera"); setTimeout(()=>{ if(ov.parentNode) ov.remove(); },430); if(cb) cb(); render(); };
  if(haySave){
    const sub=E&&E.clubNombre?(" · "+E.clubNombre+" "+E.anio):"";
    const bc=el("button","btn-aqua ancho verde arranque-btn"); bc.innerHTML="▶ Continuar mi carrera"+(sub?"<span class='arr-mini'>"+sub+"</span>":"");
    bc.onclick=()=>salir();
    const bn=el("button","btn-aqua ancho arranque-btn"); bn.textContent="Empezar de nuevo";
    bn.onclick=()=>salir(()=>{ E=null; });
    btns.appendChild(bc); btns.appendChild(bn);
  } else {
    const be=el("button","btn-aqua ancho verde arranque-btn"); be.textContent="▶ Entrar al juego";
    be.onclick=()=>salir();
    btns.appendChild(be);
  }
  inner.appendChild(btns);
  const hint=el("div","arr-hint"); hint.innerHTML="<b>Enter</b> para entrar · <b>← →</b> para elegir";
  inner.appendChild(hint);
  ov.appendChild(inner);
  document.body.appendChild(ov);
  const revelar=()=>{ if(ov.dataset.listo) return; ov.dataset.listo="1";
    ov.classList.add("listo"); const first=btns.querySelector(".arranque-btn"); if(first) first.focus(); };
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  setTimeout(revelar, reduce?60:1250);
  ov.addEventListener("keydown",e=>{ if(e.key==="Enter"&&!ov.dataset.listo){ e.preventDefault(); revelar(); } });
}

/* ---------- navegación por teclado: flechas para moverse, Enter para elegir ---------- */
function navContenedor(){
  const capa=$("#capa-modal"); if(capa&&capa.children.length) return capa;
  const arr=$("#arranque"); if(arr) return arr;
  return $("#vista");
}
function navegables(cont){
  if(!cont) return [];
  return Array.prototype.slice.call(
    cont.querySelectorAll(".op:not([disabled]),.icono:not([disabled]),.ficha:not([disabled]),.arranque-btn,.btn-aqua.ancho:not([disabled])")
  ).filter(b=>b.offsetParent!==null);
}
document.addEventListener("keydown",function(e){
  const tag=(e.target.tagName||"").toLowerCase();
  if(tag==="input"||tag==="textarea"||tag==="select") return;
  const k=e.key;
  if(k!=="ArrowDown"&&k!=="ArrowUp"&&k!=="ArrowLeft"&&k!=="ArrowRight"&&k!=="Enter") return;
  const items=navegables(navContenedor());
  if(!items.length) return;
  const cur=document.activeElement, idx=items.indexOf(cur);
  if(k==="Enter"){ if(idx>=0){ e.preventDefault(); cur.click(); } return; }
  e.preventDefault();
  if(idx<0){ items[0].focus(); return; }
  const fwd=(k==="ArrowDown"||k==="ArrowRight");
  items[(idx+(fwd?1:-1)+items.length)%items.length].focus();
});

(async function init(){
  burbujas();
  const t=await Store.get("futbolini3_tema");
  document.body.dataset.tema=t||"aero";
  const g=await cargar();
  const haySave=!!(g&&g.club);
  if(haySave){ E=g; normalizarEstado(); aplicarEstatutosMod(); }
  pantallaArranque(haySave);
})();
window.addEventListener("resize",()=>{ clearTimeout(window._rb); window._rb=setTimeout(burbujas,400); });
