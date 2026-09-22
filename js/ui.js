"use strict";
/* ============================================================
   FUTBOLINI 3.0 · ui.js
   Todo lo que se ve, más el arranque del juego.
   ============================================================ */
let SEC="escritorio";
let REDES_PEST="club";
const SECCIONES=[
 ["escritorio","🗂️","Escritorio"],["institucion","🏛️","Institución"],["finanzas","💰","Finanzas"],
 ["plantel","👥","Plantel"],["mercado","🧳","Mercado"],["estadio","🏟️","Estadio"],["redes","📱","Redes"],["calendario","📅","Calendario"],["historia","📚","Historia"],
 ["carrera","🎖️","Carrera"],["vida","🪪","Vida"],["avisos","🔔","Avisos"],["ajustes","⚙️","Ajustes"]
];
function irA(s){
  if(typeof partidoEnCurso==="function" && partidoEnCurso() && typeof pausarPartidoHold==="function"){
    pausarPartidoHold();
  }
  SEC=s; render(); const v=$("#vista"); if(v){ v.classList.remove("fx-in"); void v.offsetWidth; v.classList.add("fx-in"); } window.scrollTo(0,0);
}
function esMovil(){ return !!(window.matchMedia&&window.matchMedia("(max-width:720px)").matches); }
function encajarScrollMovil(box){
  if(!box) return;
  const c=box._cuerpo||box.querySelector(".so-cuerpo, .window-body, .cuerpo");
  if(!c) return;
  c.style.overflowY="scroll";
  c.style.webkitOverflowScrolling="touch";
  c.style.touchAction="pan-y";
  c.style.flex="1 1 0%";
  c.style.minHeight="0";
  c.style.height="auto";
}
const DOCK_IDS=["escritorio","plantel","calendario","mercado"];
function dockMasOn(){ return !!(document.body&&document.body.classList.contains("dock-mas")); }
function idsDockMovil(){
  const compact=dockMasOn();
  const ids=compact?DOCK_IDS.slice():SECCIONES.map(function(s){ return s[0]; });
  return ids.filter(function(id){
    if(id==="ajustes") return false; /* ⚙️ vive en la barra */
    if(id==="redes" && typeof redesDisponibles==="function" && !redesDisponibles()) return false;
    return true;
  });
}
function pintarDock(){
  const d=$("#dock"); if(!d) return;
  const partido=document.body.classList.contains("en-partido");
  const on=!!(E&&esMovil()&&!partido);
  document.body.classList.toggle("con-dock", on);
  if(!on){ d.classList.add("oculto"); d.innerHTML=""; return; }
  d.classList.remove("oculto");
  d.innerHTML="";
  const compact=dockMasOn();
  d.classList.toggle("dock-cinta", !compact);
  const part=typeof proximoPartido==="function"?proximoPartido():null;
  const jugar=!!(part&&!part.jugado);
  const av=el("button","dock-avanza",jugar?"⚽ Jugar":"Avanzar");
  av.type="button";
  av.setAttribute("aria-label",jugar?("Jugar "+(part.local?"vs ":"en ")+(part.rivalNombre||"el próximo")):"Avanzar la semana");
  if(jugar&&part&&part.rivalNombre) av.title=(part.local?"vs ":"visita a ")+part.rivalNombre;
  av.onclick=function(){
    if(typeof crisisActiva==="function"&&crisisActiva()){ if(typeof avanzar==="function") avanzar(); return; }
    if(typeof bloqueoDecisiones==="function"&&bloqueoDecisiones()) return;
    if(jugar&&typeof pantallaPrevia==="function"){ pantallaPrevia(part); return; }
    if(typeof avanzar==="function") avanzar();
  };
  d.appendChild(av);
  const row=el("div","dock-tabs");
  const porId={};
  SECCIONES.forEach(function(s){ porId[s[0]]=s; });
  idsDockMovil().forEach(function(id){
    const s=porId[id]; if(!s) return;
    const b=el("button","dock-tab"+(SEC===id?" on":""),'<span class="ic">'+s[1]+'</span><span>'+s[2]+'</span>');
    b.type="button"; b.setAttribute("aria-current",SEC===id?"page":"false");
    if(id==="escritorio"&&E.decPend&&E.decPend.length) b.appendChild(el("span","pip",String(E.decPend.length)));
    if(id==="avisos"&&typeof notifsNoLeidas==="function"&&notifsNoLeidas()) b.appendChild(el("span","pip",notifsNoLeidas()>9?"9+":String(notifsNoLeidas())));
    b.onclick=function(){ irA(id); };
    row.appendChild(b);
  });
  if(compact){
    const masOn=DOCK_IDS.indexOf(SEC)<0;
    const mas=el("button","dock-tab"+(masOn?" on":""),'<span class="ic">⋯</span><span>Más</span>');
    mas.type="button"; mas.setAttribute("aria-label","Más secciones");
    const nAvis=typeof notifsNoLeidas==="function"?notifsNoLeidas():0;
    if(nAvis) mas.appendChild(el("span","pip",nAvis>9?"9+":String(nAvis)));
    mas.onclick=abrirMasMovil;
    row.appendChild(mas);
  }
  d.appendChild(row);
  const onTab=row.querySelector(".dock-tab.on");
  if(onTab) try{ onTab.scrollIntoView({inline:"center",block:"nearest"}); }catch(e){}
}
function abrirMasMovil(){
  modal(function(box){
    box.classList.add("modal-mas");
    box.appendChild(el("div","cab",'<span class="ic">⋯</span><span>Más del club</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p","mini","Institución, plata, redes y el resto. Avanzar y el partido siguen abajo, al alcance del pulgar."));
    const g=el("div","mas-grid");
    SECCIONES.forEach(function(s){
      const id=s[0], ic=s[1], n=s[2];
      if(DOCK_IDS.indexOf(id)>=0) return;
      /* 7.9020 · Ajustes SÍ va acá. Estaba excluido "porque está en la barra",
         pero a 390px la barra lo cortaba fuera de pantalla: quedaba inalcanzable
         en celular. La cinta deslizable lo arregla; esto es la red de seguridad. */
      if(id==="redes"&&!redesDisponibles()) return;
      const b=el("button","mas-item"+(SEC===id?" on":""),'<span class="ic">'+ic+'</span><span>'+n+'</span>');
      b.type="button";
      if(id==="avisos"&&typeof notifsNoLeidas==="function"&&notifsNoLeidas()) b.appendChild(el("span","pip",String(notifsNoLeidas())));
      b.onclick=function(){ cerrarModal(); irA(id); };
      g.appendChild(b);
    });
    c.appendChild(g);
    const acc=el("div"); acc.style.marginTop="12px";
    /* 7.9020 · Cuenta al alcance del pulgar (en la barra se cortaba en celular) */
    const bcu=el("button","btn-aqua ancho","👤 "+T("mas_cuenta","Cuenta"));
    bcu.onclick=function(){ cerrarModal(); const b=$("#btnCuenta"); if(b) b.click(); };
    acc.appendChild(bcu);
    const br=el("button","btn-aqua ancho","⏩ Avance rápido");
    br.onclick=function(){ cerrarModal(); if(typeof modalAvanceRapido==="function") modalAvanceRapido(); };
    acc.appendChild(br);
    const bt=el("button","btn-aqua ancho","◐ Cambiar tema"); bt.style.marginTop="6px";
    bt.onclick=function(){ cerrarModal(); const b=$("#btnTemas"); if(b) b.click(); };
    acc.appendChild(bt);
    const bc=el("button","btn-aqua ancho gris","Cerrar"); bc.style.marginTop="6px"; bc.onclick=cerrarModal;
    acc.appendChild(bc);
    c.appendChild(acc);
  },{clase:"modal-mas"});
}
/* 7.10 · modo desarrollador (clave: peomojon). Solo para probar cada cosa. */
let DEV_ON=false;
function devOn(){ return DEV_ON || !!(typeof E!=="undefined"&&E&&E.flags&&E.flags.dev); }
/* Chirp/redes recién existe con Twitter: antes de 2008 el fútbol vivía en radio y diarios. */
function redesDisponibles(){ return !!(E && (E.anio||2026)>=2008); }

/* ---------------- barra y menú ---------------- */
function pintarBarra(){
  pintarBtnCuenta(); pintarCampana();
  const bd=$("#barraDatos"); bd.innerHTML="";
  const badge=$("#avisoBadge");
  if(!E){
    $("#escudo").textContent="⚽";
    if(badge) badge.classList.add("oculto");
    if(bd){
      bd.appendChild(el("div","bd",'<div class="k">Versión</div><div class="v">'+(typeof VERSION!=="undefined"?VERSION:"")+'</div>'));
      bd.appendChild(el("div","bd",'<div class="k">Estado</div><div class="v">Elige club</div>'));
    }
    return;
  }
  if(badge){ const n=notifsNoLeidas(); badge.textContent=n>9?"9+":String(n); badge.classList.toggle("oculto",!n); }
  const ic=(typeof infoClub==="function"&&infoClub(E.club))||(CLUB_INFO&&CLUB_INFO[E.club])||{esc:"⚽"};
  const _es=(typeof escudoHTML==="function")?escudoHTML(E.club,24,""):"";
  if(_es) $("#escudo").innerHTML=_es; else $("#escudo").textContent=(ic&&ic.esc)||"⚽";
  const orb=$("#escudo");
  if(orb && !orb._orbBind){
    orb._orbBind=true;
    orb.title="Escritorio";
    orb.setAttribute("role","button");
    orb.onclick=function(){ if(E && typeof irA==="function") irA("escritorio"); };
  }
  const part=proximoPartido();
  const datos=[
   ["Club",E.clubNombre,false,"bd-club"],
   ["Fecha",(part?fechaTxt(part.f):"cierre")+" · "+E.anio,false,"bd-fecha"],
   ["Caja",plata(E.plata),E.plata<100],
   ["Tu plata",plata((E.personal&&E.personal.bolsillo)||0),(E.personal&&E.personal.bolsillo<0),"bd-sec"],
   ["Deuda",plata(E.deuda),E.deuda>3000],
   ["Capital",E.capital+"/100",E.capital<15,"bd-sec"],
   ["Imagen",Math.round(E.rep.publica)+"/100",E.rep.publica<25,"bd-sec"]
  ];
  datos.forEach(([k,v,al,cls])=>{
    bd.appendChild(el("div","bd"+(al?" alerta":"")+(cls?" "+cls:""),'<div class="k">'+k+'</div><div class="v">'+v+'</div>'));
  });
}
function pintarMenu(){
  const m=$("#menu"); m.innerHTML="";
  if(!E){ m.classList.add("oculto"); return; }
  m.classList.remove("oculto");
  SECCIONES.forEach(([id,ic,n])=>{
    if(id==="ajustes") return; /* 7.9004 · Ajustes vive solo como ⚙️ en la barra */
    if(id==="redes" && !redesDisponibles()) return;   /* sin redes sociales en épocas pre-Twitter */
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
  /* 7.9007 · cualquier render a mitad del partido lo pausa: las decisiones no desaparecen. */
  if(typeof partidoEnCurso==="function" && partidoEnCurso() && P_ACTUAL && !P_ACTUAL._holdUI && typeof pausarPartidoHold==="function"){
    pausarPartidoHold();
  }
  document.body.classList.remove("en-partido","hay-momento");
  document.body.classList.toggle("con-juego", !!E);   /* 7.68 · lateral sólo corre el contenido si hay partida */
  pintarBarra(); pintarMenu();
  if(typeof pintarHoldBar==="function") pintarHoldBar();
  const v=$("#vista"); v.innerHTML=""; v.dataset.sec="full";
  $("#btnAvanzar").classList.toggle("oculto",!E);
  /* 7.9011 · el botón dice QUÉ va a pasar si lo apretás (jugar / semana / cierre).
     7.9014 · con el nombre largo del rival la barra se desbordaba entre 720 y 990 px
     (el dock de móvil tapaba el problema): va el nombre CORTO y recortado, y el
     nombre completo queda en el title. */
  if(E){
    const _bav=$("#btnAvanzar");
    const _pa=(typeof proximoPartido==="function")?proximoPartido():null;
    if(!_pa){ _bav.textContent="🏁 "+T("av_cierre","Cerrar temporada"); _bav.title=""; }
    else if(!_pa.jugado){
      const _riv=_nomCortoRival(_pa);
      /* barra angosta (721–819 px): el rival se lee en el escritorio y en el title;
         acá solo estorba y empuja los datos fuera de pantalla. */
      _bav.textContent=_riv?("⚽ "+T("av_jugar","Jugar")+" "+(_pa.local?"vs ":"@ ")+_riv):("⚽ "+T("av_jugar","Jugar"));
      _bav.title=(_pa.local?"vs ":"@ ")+(_pa.rivalNombre||"")+" · "+
        (typeof etqCompromiso==="function"?etqCompromiso(_pa):"")+" · "+(typeof fechaTxt==="function"?fechaTxt(_pa.f):"");
    } else {
      _bav.textContent="⏩ "+T("av_semana","Avanzar semana");
      _bav.title=(typeof fechaTxt==="function"?fechaTxt(_pa.f):"");
    }
  }
  { const br=document.getElementById("btnRapido"); if(br) br.classList.toggle("oculto",!E); }
  if(!E){
    /* 7.61 · Ajustes accesibles SIN partida activa: borrar guardados, tema,
       cargar respaldo, sin tener que entrar a un club primero. */
    if(SEC==="ajustes"){ v.dataset.sec="full"; vistaAjustes(); if(typeof pintarDock==="function") pintarDock(); return; }
    pantallaInicio(); if(typeof pintarDock==="function") pintarDock(); return;
  }
  if(E.carrera.fin){ v.appendChild(pantallaFinCarrera()); if(typeof pintarDock==="function") pintarDock(); return; }
  if(E.dinastia&&E.dinastia.sucesionPendiente){ v.appendChild(pantallaSucesion()); if(typeof pintarDock==="function") pintarDock(); return; }
  if(E.carrera.enParo){ v.appendChild(pantallaSinClub()); if(typeof pintarDock==="function") pintarDock(); return; }
  if(SEC==="redes" && !redesDisponibles()) SEC="escritorio";   /* no caer en Chirp en épocas sin redes */
  v.dataset.sec=SEC;   /* para el layout multi-columna en PC (evita scroll eterno) */
  ({escritorio:vistaEscritorio,institucion:vistaInstitucion,finanzas:vistaFinanzas,plantel:vistaPlantel,
    mercado:vistaMercado,estadio:vistaEstadio,redes:vistaRedes,calendario:vistaCalendario,historia:vistaHistoria,carrera:vistaCarrera,
    vida:vistaVida,avisos:vistaAvisos,ajustes:vistaAjustes}[SEC]||vistaEscritorio)();
  if(typeof pintarDock==="function") pintarDock();
  if(typeof pintarHoldBar==="function") pintarHoldBar();
}
/* ---------------- inicio ---------------- */
/* 7.68 · picker de clubes: filtros por división + buscador + cards animadas.
   Reemplaza la pared de botones por algo navegable y liviano. */
function pickerClubes(cont){
  const lista=[], visto={};
  const add=(id,info,div,clasico)=>{
    if(!info||visto[id]) return; visto[id]=1;
    lista.push({id:id, n:info.n||id, esc:info.esc,
      ciu:(info.ciudad||((typeof ciudadDeClub==="function")?ciudadDeClub(id):""))||"",
      div:div, clasico:!!clasico});
  };
  const idsB=(typeof idsPrimeraB==="function")?idsPrimeraB():((typeof LIGA_B_2026!=="undefined")?LIGA_B_2026.map(c=>c.id):[]);
  const idsC=(typeof idsSegunda==="function")?idsSegunda():((typeof LIGA_C_2026!=="undefined")?LIGA_C_2026.map(c=>c.id):[]);
  const idsA=(typeof idsArgentina==="function")?idsArgentina():((typeof LIGA_ARG_2026!=="undefined")?LIGA_ARG_2026.map(c=>c.id):[]);
  if(typeof CLUB_INFO!=="undefined") Object.keys(CLUB_INFO).forEach(id=>{
    const jugo=(typeof clubJugoNacional91==="function")&&clubJugoNacional91(id);
    add(id,CLUB_INFO[id],"Primera",!!jugo);
  });
  if(typeof CLUB_INFO_2026!=="undefined") Object.keys(CLUB_INFO_2026)
    .filter(id=>(typeof CLUB_INFO==="undefined"||!CLUB_INFO[id]) && idsB.indexOf(id)<0 && idsC.indexOf(id)<0 && idsA.indexOf(id)<0
      && !(typeof eraCustomDeClub==="function" && eraCustomDeClub(id)))
    .forEach(id=>add(id,CLUB_INFO_2026[id],"Primera",false));
  if(typeof LIGA_B_2026!=="undefined") LIGA_B_2026.forEach(c=>add(c.id,(typeof CLUB_INFO_2026!=="undefined"&&CLUB_INFO_2026[c.id])||c,"Primera B",false));
  if(typeof LIGA_C_2026!=="undefined") LIGA_C_2026.forEach(c=>add(c.id,(typeof CLUB_INFO_2026!=="undefined"&&CLUB_INFO_2026[c.id])||c,"Segunda",false));
  if(typeof LIGA_ARG_2026!=="undefined") LIGA_ARG_2026.forEach(c=>add(c.id,(typeof CLUB_INFO_2026!=="undefined"&&CLUB_INFO_2026[c.id])||c,"Argentina",false));
  const extraLigas=[];
  if(typeof LIGAS==="object" && typeof esEraHardcode==="function"){
    Object.keys(LIGAS).forEach(function(k){
      if(esEraHardcode(k)||esEraHardcode(+k)) return;
      const L=LIGAS[k]; if(!L||!L.length) return;
      const nom=(typeof ERA==="object"&&ERA[k]&&ERA[k].n)||k;
      extraLigas.push({k:k, n:nom});
      L.forEach(function(c){ add(c.id, (typeof CLUB_INFO_2026!=="undefined"&&CLUB_INFO_2026[c.id])||c, nom, false); });
    });
  }

  const _T=(typeof T==="function")?T:((k,d)=>d);
  /* 7.9014 · listones al mismo nivel: Primera → AFA → Primera B → Segunda. */
  const filtros=[["todos",_T("ini_f_todos","Todos")],["Primera","Primera"],["Argentina","Argentina"],["Primera B","Primera B"],["Segunda","Segunda"],["clasico",_T("ini_f_clasicos","Clásicos '91")]];
  extraLigas.forEach(function(x){ filtros.push([x.n, x.n]); });
  let fAct="todos", q="";
  const barra=el("div","picker-barra");
  const tabs=el("div","picker-tabs"); barra.appendChild(tabs);
  const inp=el("input","pick-buscar"); inp.type="search"; inp.placeholder=_T("ini_buscar","Buscar club o ciudad…"); inp.setAttribute("aria-label","Buscar club");
  barra.appendChild(inp);
  const cont2=el("span","pick-cont",""); barra.appendChild(cont2);
  const grid=el("div","iconos picker-grid");
  const tabBtns={};
  filtros.forEach(([k,n])=>{
    const t=el("button","pick-tab",n); t.type="button"; t.setAttribute("aria-pressed",k==="todos"?"true":"false");
    t.onclick=()=>{ fAct=k; Object.keys(tabBtns).forEach(x=>tabBtns[x].setAttribute("aria-pressed",x===k?"true":"false")); pinta(); };
    tabBtns[k]=t; tabs.appendChild(t);
  });
  function pinta(){
    grid.innerHTML="";
    const qq=q.trim().toLowerCase();
    const vis=lista.filter(c=>(fAct==="todos"||(fAct==="clasico"?c.clasico:c.div===fAct))
      && (!qq || c.n.toLowerCase().indexOf(qq)>=0 || (c.ciu||"").toLowerCase().indexOf(qq)>=0));
    function card(c,i){
      const esc=(typeof escudoHTML==="function")?escudoHTML(c.id,36,c.esc||"⚪"):(c.esc||"⚪");
      const b=el("button","icono card-in",'<span class="g">'+esc+'</span><span class="n">'+c.n+'</span>'+(c.ciu?'<span class="ciu">'+c.ciu+'</span>':''));
      const col=(typeof colorDeClub==="function")?colorDeClub(c.id):(c.colores&&c.colores[0]);
      if(col) b.style.borderLeft="4px solid "+col;
      b.style.animationDelay=Math.min(i*20,340)+"ms";
      b.title=c.n+(c.ciu?" · "+c.ciu:"")+" · "+c.div;
      b.onclick=()=>elegirEpoca(c.id);
      return b;
    }
    const ORDEN=["Primera","Argentina","Primera B","Segunda"];
    extraLigas.forEach(function(x){ if(ORDEN.indexOf(x.n)<0) ORDEN.push(x.n); });
    const ETQ={Primera:"Primera División", Argentina:"Argentina · AFA", "Primera B":"Primera B", Segunda:"Segunda División"};
    if(fAct==="todos" && !qq){
      let i=0;
      ORDEN.forEach(function(div){
        const chunk=vis.filter(function(c){ return c.div===div; });
        if(!chunk.length) return;
        const lis=el("div","picker-liston");
        lis.textContent=ETQ[div]||div;
        grid.appendChild(lis);
        chunk.forEach(function(c){ grid.appendChild(card(c,i++)); });
      });
      const resto=vis.filter(function(c){ return ORDEN.indexOf(c.div)<0; });
      if(resto.length){
        const lis=el("div","picker-liston"); lis.textContent=_T("ini_f_otros","Otros");
        grid.appendChild(lis);
        resto.forEach(function(c){ grid.appendChild(card(c,i++)); });
      }
    } else {
      vis.forEach(function(c,i){ grid.appendChild(card(c,i)); });
    }
    if(!vis.length) grid.appendChild(el("p","mini","No hay clubes con ese filtro/búsqueda."));
    cont2.textContent=vis.length+" club"+(vis.length===1?"":"es");
  }
  inp.oninput=()=>{ q=inp.value; pinta(); };
  cont.appendChild(barra); cont.appendChild(grid); pinta();
}
function pantallaInicio(){
  const v=$("#vista");
  const host=(typeof envolverVistaSO==="function")?envolverVistaSO(esMovil()?"Futbolini":("Futbolini "+(typeof VERSION!=="undefined"?VERSION:"")),"⚽"):v;
  const _T=(typeof T==="function")?T:((k,d)=>d);
  host.appendChild(el("h2","tit ini-tit",_T("ini_headline","No manejas un equipo. Manejas una institución.")));
  host.appendChild(el("p","ini-bajada",_T("ini_bajada","Gente con intereses distintos empujando para lados distintos, plata que se acaba, reglas internas que puedes cambiar si tienes el poder, y una historia real que puedes seguir o romper.")));
  const legal=el("details","ini-legal");
  legal.appendChild(el("summary",null,"Antes de entrar · ficción"));
  legal.appendChild(el("p","mini",
   "Este juego usa nombres reales de clubes, jugadores y dirigentes del fútbol chileno. "+
   "Los resultados, títulos y fechas se apoyan en registros públicos, pero <b>todo lo demás es ficción</b>: "+
   "las conversaciones, las negociaciones, los conflictos internos y cualquier frase atribuida a alguien están inventados "+
   "para efectos del juego. Nada de lo que pase acá adentro ocurrió así en la vida real."));
  host.appendChild(legal);

  host.appendChild(el("h3","sub",_T("ini_elige","1 · Elige club")));
  pickerClubes(host);
  host.appendChild(el("p","mini","Los clásicos se pueden jugar en 1991 (calendario real, Copa Libertadores de Colo-Colo) o en 2026. Primera B arranca en la Liga de Ascenso y Segunda en su zona (Norte/Sur). Planteles documentados donde hay; el resto se rellena con cantera."));

  /* 7.9014 · Apoyar / aviso de anuncios vive en Ajustes, no acá. */

  /* 7.00 · duelo P2P contra un amigo */
  if(typeof modalDuelo==="function"){
    const pm=panel(_T("ini_amigo_tit","… o juega contra un amigo"),"🎮","agua");
    pm.cuerpo.appendChild(el("p","mini",_T("ini_amigo_txt","Un duelo dirigido, en vivo, sin cuentas ni servidor: se conectan con un código y cada uno maneja su club.")));
    const bm=el("button","btn-aqua ancho verde",_T("ini_amigo_btn","🎮 Duelo con un amigo"));
    bm.onclick=()=>modalDuelo();
    pm.cuerpo.appendChild(bm);
    host.appendChild(pm);
  }
}
function elegirEpoca(id){
  /* 7.98 · 1991 solo si el club JUGÓ ese Nacional (Limache 2010 no entra). */
  const jugo91=(typeof clubJugoNacional91==="function")&&clubJugoNacional91(id);
  const solo2026=!jugo91 || (typeof CLUB_INFO==="undefined"||!CLUB_INFO[id]);
  const esB=(typeof esClubB==="function")?esClubB(id):false;
  const esC=(typeof esClubC==="function")?esClubC(id):false;
  const esArg=(typeof esClubArg==="function")?esClubArg(id):false;
  let modo="historico", corte=false;
  const glorias=(typeof epocasDe==="function")?epocasDe(id):[];
  /* 7.10 · UN solo selector de "cuándo empezar": épocas base + glorias unificadas,
     sin dos selectores peleando (arregla el bug de perder continuidad al elegir gloria). */
  const puntos=[];
  if(esArg){
    puntos.push({k:"barg",tipo:"base",base:"arg2026",anio:2026,etq:"2026 · Liga Profesional"});
  } else if(esC){
    puntos.push({k:"b2026c",tipo:"base",base:"2026c",anio:2026,etq:"2026 · Segunda División"});
  } else if(esB){
    if(typeof esClub1925==="function" && esClub1925(id))
      puntos.push({k:"b1925",tipo:"base",base:1925,anio:1925,etq:"1925 · Amateur"});
    puntos.push({k:"b2026b",tipo:"base",base:"2026b",anio:2026,etq:"2026 · Primera B"});
  } else if(id==="CC"){
    puntos.push({k:"cc25",tipo:"base",base:1925,anio:1925,etq:"1925 · Nacimiento (amateur)"});
    puntos.push({k:"cc89",tipo:"base",base:1991,anio:1989,etq:"1989 · La Reconstrucción"});
    puntos.push({k:"cc91",tipo:"base",base:1991,anio:1991,etq:"1991 · La Gloria (Libertadores)",gloria:true});
    puntos.push({k:"cc06",tipo:"base",base:2006,anio:2006,etq:"2006 · Borghi"});
    puntos.push({k:"b2026",tipo:"base",base:2026,anio:2026,etq:"2026 · Actual"});
  } else if(solo2026){
    if(typeof esClub1925==="function" && esClub1925(id))
      puntos.push({k:"b1925",tipo:"base",base:1925,anio:1925,etq:"1925 · Amateur"});
    if(typeof esClub2006==="function" && esClub2006(id))
      puntos.push({k:"b2006",tipo:"base",base:2006,anio:2006,etq:"2006 · Apertura/Clausura"});
    puntos.push({k:"b2026",tipo:"base",base:2026,anio:2026,etq:"2026 · Actual"});
  } else {
    puntos.push({k:"b1991",tipo:"base",base:1991,anio:1991,etq:"1991 · Fase A"});
    if(typeof esClub2006==="function" && esClub2006(id))
      puntos.push({k:"b2006",tipo:"base",base:2006,anio:2006,etq:"2006 · Apertura/Clausura"});
    puntos.push({k:"b2026",tipo:"base",base:2026,anio:2026,etq:"2026 · Actual"});
  }
  glorias.forEach((ep,i)=>{
    let b=(typeof baseEra==="function"?baseEra(ep.anio):(ep.anio>=2010?2026:1991));
    /* 7.13 · si el club no existe en esa era (ej: Palestino 1978 → liga 91),
       se juega en 2026 con la identidad histórica encima. No romper.
       7.98 · Segunda/B/AFA se quedan en SU división, no heredan Primera 1991. */
    if(typeof datosEra==="function" && !(datosEra(b).info||{})[id]){
      if(esC) b="2026c";
      else if(esB) b="2026b";
      else if(esArg) b="arg2026";
      else b=2026;
    }
    puntos.push({k:"g"+i,tipo:"gloria",base:b,anio:ep.anio,etq:"🏆 "+ep.etq,ep:ep});
  });
  let sel=puntos[0];
  function datosPunto(pt){
    const D=datosEra(pt.base);
    let info=D.info[id], ind=D.ind[id], caja=D.caja[id];
    if(pt.tipo==="gloria"&&pt.ep){
      ind=Object.assign({},ind||{},pt.ep.ind||{});
      caja=Object.assign({},caja||{},pt.ep.caja||{});
    }
    return {info:info,ind:ind,caja:caja};
  }
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      let dp;
      try{
        dp=datosPunto(sel);
        if(!dp.info||!dp.ind||!dp.caja) throw new Error("Club sin datos: "+id+" @ "+sel.anio);
      }catch(err){
        if(typeof montarBarraSO==="function"){
          const c=montarBarraSO(box,"Error","⚠️",cerrarModal);
          c.appendChild(el("p",null,"No se pudo armar el briefing: "+err.message));
          const pie=(typeof montarPieSO==="function")?montarPieSO(box):c;
          const bx=el("button","btn-aqua ancho","Cerrar"); bx.onclick=cerrarModal; pie.appendChild(bx);
        }else{
          box.appendChild(el("div","cab","Error"));
          const c=el("div","cuerpo"); box.appendChild(c);
          c.appendChild(el("p",null,"No se pudo armar el briefing: "+err.message));
          const bx=el("button","btn-aqua ancho","Cerrar"); bx.onclick=cerrarModal; c.appendChild(bx);
        }
        console.error(err); return;
      }
      const info=dp.info, ib=dp.ind, cb=dp.caja;
      let c;
      if(typeof montarBarraSO==="function"){
        c=montarBarraSO(box, info.n, info.esc, cerrarModal);
      }else{
        box.appendChild(el("div","cab",'<span class="ic">'+info.esc+'</span><span>'+info.n+'</span>'));
        c=el("div","cuerpo"); box.appendChild(c);
      }
      try{
      c.appendChild(el("h3","sub","1 · Elige cuándo empezar"));
      const fe=el("div","fichas fichas-epoca");
      puntos.forEach(pt=>{
        const btn=el("button","ficha"+(pt.tipo==="gloria"||pt.gloria?" ficha-gloria":""),pt.etq);
        btn.setAttribute("aria-pressed",sel.k===pt.k?"true":"false");
        btn.onclick=()=>{ sel=pt; corte=false; pintar(); };
        fe.appendChild(btn);
      });
      c.appendChild(fe);
      if(sel.tipo==="gloria"&&sel.ep){
        c.appendChild(el("div","resul mitad","<b>"+sel.ep.etq+".</b> "+(sel.ep.desc||"")+(sel.ep.dt?" · DT <b>"+sel.ep.dt+"</b>":"")));
      }else{
        if(esArg) c.appendChild(el("p","mini","Este club juega en la Liga Profesional Argentina 2026 (AFA, 30 clubes). Apertura y Clausura en zonas de 15 (14 PJ + 1 bye). Victoria vale 3 puntos. Copa Argentina a partido único. La federación es la AFA, no la ANFP."));
        else if(sel.base===1925) c.appendChild(el("p","mini",id==="CC"
          ?"1925: amateur. Liga Metropolitana de Deportes. No hay redes, ni Libertadores, ni mercado millonario. Victoria vale 2 puntos. Plantel de Colo-Colo documentado (Arellano y los Rebeldes)."
          :"1925: amateur. Liga Metropolitana de Deportes. No hay redes, ni Libertadores, ni mercado millonario. Victoria vale 2 puntos. El plantel documentado de esa temporada es el de Colo-Colo; el de este club se arma con cantera."));
        else if(sel.base===2006) c.appendChild(el("p","mini",id==="CC"
          ?"2006: Apertura (18 fechas + playoffs) y Clausura (otras 18 + playoffs). 19 clubes (Concepción suspendido). Plantel de Colo-Colo documentado (Borghi, Suazo, Mati, Valdivia, Alexis). El regular NO entrega estrella: el título se juega en cuartos/semis/final."
          :id==="UCH"?"2006: Apertura y Clausura (18+18) con playoffs estilo México. Plantel de la U documentado (Huerta, Salas, Alcázar, Iturra, Pinto). En la historia fue finalista del Apertura vs Colo-Colo."
          :id==="AUD"?"2006: Apertura y Clausura (18+18) con playoffs. Plantel de Audax documentado (Raúl Toro, Villanueva, Di Santo, Peric). En la historia fue finalista del Clausura — NO campeón."
          :id==="UC"?"2006: Apertura y Clausura (18+18) con playoffs. Plantel de Católica documentado (Pellicer, Quinteros, Conca, Arrué, Buljubasich, Medel de 18)."
          :"2006: Apertura y Clausura (18+18, tabla del Clausura desde 0) + playoffs estilo México. 19 clubes (Concepción suspendido). Planteles documentados: Colo-Colo, la U, Audax y Católica; el resto, cantera."));
        else if(esC) c.appendChild(el("p","mini","Este club juega en la Segunda División Profesional 2026 (3er nivel). Victoria vale 3 puntos. El objetivo es ascender a la Primera B."));
        else if(esB) c.appendChild(el("p","mini","Este club juega en la Primera B 2026 (Liga de Ascenso). Victoria vale 3 puntos. Copa Chile con grupos reales."));
        else if(solo2026) c.appendChild(el("p","mini","Este club juega en la Primera División 2026."));
        else {
          const eraObj=(typeof eraDe==="function"?eraDe(sel.base):ERA[sel.base])||ERA[2026];
          if(eraObj&&eraObj.desc) c.appendChild(el("p","mini",eraObj.desc));
        }
        if(info.desc) c.appendChild(el("p",null,info.desc));
        if(typeof HISTORIA_BETA==="object"){
          const hid=(typeof idClubCanon==="function")?idClubCanon(id,sel.base):id;
          const hx=HISTORIA_BETA[hid]||HISTORIA_BETA[id];
          if(hx){
            const txt=hx[String(sel.anio)]||((sel.anio>=2018||sel.base===2026||sel.base==="2026b"||sel.base==="2026c"||sel.base==="arg2026")?hx.actual:null);
            if(txt) c.appendChild(el("div","resul mitad","<b>Contexto real.</b> "+txt+" <span class='mini'>Hechos públicos; lo que pasa adentro es ficción del juego.</span>"));
          }
        }
      }

      c.appendChild(el("h3","sub","2 · Elige modo"));
      const f=el("div","fichas fichas-modo");
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
      const eraObj2=(typeof eraDe==="function"?eraDe(sel.base):ERA[sel.base])||ERA[2026];
      const ligaN=sel.base==="arg2026"?(typeof LIGA_ARG_2026!=="undefined"?LIGA_ARG_2026.length:30)
        :(sel.base===2006?(typeof LIGA_2006!=="undefined"?LIGA_2006.length:19)
        :(sel.base===1925?(typeof LIGA_1925!=="undefined"?LIGA_1925.length:12)
        :(sel.base==="2026c"?(typeof LIGA_C_2026!=="undefined"?LIGA_C_2026.length:14)
        :(sel.base==="2026b"?(typeof LIGA_B_2026!=="undefined"?LIGA_B_2026.length:16)
        :(sel.base===2026?LIGA_2026.length:LIGA91.length)))));
      c.appendChild(fila("Época","Campeonato "+sel.anio+" · "+ligaN+" equipos · victoria vale "+eraObj2.puntosVictoria+" puntos"));
      c.appendChild(fila("Deportivo","plantel "+ib.plantel+" · cantera "+ib.cantera));
      c.appendChild(fila("Económico",plata(cb.plata)+" en caja · "+plata(cb.deuda)+" de deuda"));
      c.appendChild(fila("Interno","hinchada "+ib.hinchada+" · socios "+ib.socios+" · riesgo "+ib.riesgo));
      /* E-1 · la situación del club: por qué te metes en esto (Grok TAREA E / Claude 7.86) */
      if(typeof SITUACION_CLUB==="object" && SITUACION_CLUB[id])
        c.appendChild(el("p","mini","<b>La situación:</b> "+SITUACION_CLUB[id]));
      /* corte 18/08 solo en la temporada 2026 actual (no en glorias históricas) */
      if((sel.base===2026) && sel.tipo!=="gloria" && !esB){
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
        if(corte) c.appendChild(el("p","mini","Se cargan los partidos ya jugados del fixture (con marcador real si está) y una tabla de referencia al 18/08. Sigues desde el próximo. Colo-Colo tiene el fixture completo; los otros clubes usan la misma tabla semilla."));
      }

      const go=el("button","btn-aqua ancho verde",
        sel.tipo==="gloria"?("Revivir "+sel.ep.etq):(sel.base===2026&&corte?"Seguir desde agosto 2026":("Empezar en "+sel.anio)));
      go.onclick=()=>{
        try{
          /* 7.13 · solo se redirige la era a 2026 si el club NO existe en la era
             de su año histórico (ej: Palestino 1978 → liga 91). La U 2011 y demás
             quedan igual. El año-etiqueta histórico viaja aparte en la época. */
          let anio=sel.anio;
          if(sel.tipo==="gloria"){
            const ob=(typeof baseEra==="function")?baseEra(sel.anio):(sel.anio>=2010?2026:1991);
            if(typeof datosEra==="function" && !(datosEra(ob).info||{})[id]) anio=2026;
          }
          const extra=sel.tipo==="gloria"?{epoca:sel.ep}
            :(sel.base===2026&&corte?{corte:true}:null);
          let extra2=extra;
          if(esB||sel.base==="2026b") extra2=Object.assign(extra||{},{categoria:"B"});
          if(esC||sel.base==="2026c") extra2=Object.assign(extra||{},{categoria:"C"});
          if(esArg||sel.base==="arg2026") extra2=Object.assign(extra||{},{categoria:"ARG"});
          if(sel.base===2006) extra2=Object.assign(extra2||extra||{},{categoria:"2006"});
          if(sel.base===1925) extra2=Object.assign(extra2||extra||{},{categoria:"1925"});
          nuevaPartida(id, anio, modo, extra2);
          if(!E || !E.club) throw new Error("nuevaPartida no dejó estado E");
          cerrarModal(); SEC="escritorio"; render();
          aviso(sel.tipo==="gloria"?("Reviviste: "+sel.ep.etq):("Empieza la temporada "+anio));
        }catch(err){
          console.error("Error al empezar partida:", err);
          aviso("Error al empezar: "+err.message, 6000);
        }
      };
      if(typeof montarPieSO==="function"){
        const pie=montarPieSO(box); pie.appendChild(go);
      }else{
        const pie=el("div","so-pie modal-pie"); pie.appendChild(go); box.appendChild(pie);
      }
      try{ encajarScrollMovil(box); }catch(e){}
      }catch(err){
        console.error(err);
        c.appendChild(el("div","resul mal","Error al armar el briefing: "+err.message));
      }
    };
    pintar();
  },{clase:"ventana-so"});
}
/* ---------------- escritorio ---------------- */
/* 6.6 · entrenamiento de la semana: mejora la forma del plantel con riesgo bajo de lesión */
function entrenarSemana(){
  if(E.flags["entreno_"+E.anio+"_"+E.idx]){ aviso("Ya entrenaron fuerte esta semana"); return; }
  E.flags["entreno_"+E.anio+"_"+E.idx]=true;
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
/* 7.9013 · tira de pasado del próximo rival: V-E-D de los últimos 5, puesto en la
   tabla y el último cruce del año. Sin inventar: si falta el dato, lo dice. */
function _pasadoRival(part){
  const caja=el("div","riv-pasado");
  const id=part&&part.rivalId, nom=(part&&part.rivalNombre)||"";
  const forma=((typeof formaClub==="function"&&id)?formaClub(id):[]).filter(function(x){
    return x && (x.r==="V"||x.r==="E"||x.r==="D");
  });
  const otra=(part&&part.tipo==="copa") || (id && typeof _enMiLiga==="function" && !_enMiLiga(id));
  const pj=(id&&E.tabla&&E.tabla[id]&&(E.tabla[id].pj||0))||0;
  if(forma.length){
    const tira=el("div","riv-tira");
    tira.appendChild(el("span","mini",T("riv_racha","Cómo viene")+": "));
    forma.forEach(function(x){
      const b=el("span","riv-r riv-"+x.r,x.r);
      b.title=x.gf+"-"+x.gc;
      tira.appendChild(b);
    });
    caja.appendChild(tira);
  } else if(otra){
    caja.appendChild(el("p","mini",T("riv_otra","Juega en otro torneo: no comparten tabla.")));
  }
  if(id&&pj>0&&typeof tablaOrdenada==="function"){
    const arr=tablaOrdenada(), i=arr.findIndex(function(c){ return c.id===id; });
    if(i>=0) caja.appendChild(el("p","mini",T("riv_puesto","En la tabla va")+" <b>"+ordinal(i+1)+"</b> · "+(arr[i].pts||0)+" pts."));
  }
  const ult=(typeof ultimoCruce==="function")?ultimoCruce(id,nom):null;
  if(ult){
    const t=ult.gf>ult.gc?T("riv_ult_yo","La última vez le ganaste."):(ult.gf<ult.gc?T("riv_ult","La última vez te ganó."):T("riv_ult_e","La última vez empataron."));
    caja.appendChild(el("p","mini",t+" ("+ult.gf+"-"+ult.gc+")"));
  } else if(!forma.length && !otra){
    caja.appendChild(el("p","mini",T("riv_nuevo","Todavía no jugó esta temporada.")));
  } else if(forma.length || pj>0){
    caja.appendChild(el("p","mini",T("riv_sin","Primera vez que se cruzan este año.")));
  }
  if(!caja.childNodes.length){
    caja.appendChild(el("p","mini",T("riv_nuevo","Todavía no jugó esta temporada.")));
  }
  return caja;
}
/* 7.9014 · ¿el rival juega MI torneo? Para no decirle "todavía no jugó" a un
   rival de copa que sí está jugando lo suyo en otra parte. */
/* OJO: los partidos de copa vienen con `rivalId:null` (solo `rivalNombre`), así que
   el tipo del compromiso manda antes que el id. */
function _enMiLiga(id){
  if(!id) return false;
  try{
    const pool=(typeof clubesLigaActual==="function")?clubesLigaActual():(typeof LIGA_ACT!=="undefined"?LIGA_ACT:[]);
    return (pool||[]).some(function(c){ return c&&c.id===id; });
  }catch(e){ return false; }
}
/* 7.9014 · nombre corto del rival para la barra: el `c` del club si existe, y
   recortado según el ancho de la ventana (entre 720 y 990 px la barra es angosta
   y un nombre largo la desbordaba). El nombre completo va siempre en el title. */
function _nomCortoRival(part){
  if(!part) return "";
  let n="";
  try{
    const id=part.rivalId;
    const c=id&&((typeof CLUB_POR_ID!=="undefined"&&CLUB_POR_ID[id])||(typeof clubLookup==="function"&&clubLookup(id))||(typeof clubMundo==="function"&&clubMundo(id)));
    n=(c&&(c.c||c.n))||"";
  }catch(e){}
  if(!n) n=part.rivalNombre||"";
  const w=(typeof window!=="undefined"&&window.innerWidth)||1280;
  if(w<820) return "";                 /* sin nombre: no cabe sin romper la barra */
  const tope=w<1000?12:16;
  return n.length>tope?(n.slice(0,tope-1).trim()+"…"):n;
}
function vistaEscritorio(){
  const v=$("#vista");
  if(typeof sembrarStoryline==="function") sembrarStoryline();   /* 7.0 · intenta abrir un arco de equipo (1 vez por semana) */
  const rej=el("div","rejilla dos esc-aero");   /* 7.9006 · entrada Vista de la sección (scoped aero) */
  const izq=el("div"), der=el("div");

  /* 7.36 · el partido es LA cosa: primero el compromiso, después lo que atiende */
  const part=proximoPartido();
  const p=panel("Próximo compromiso","📌","agua");
  if(part){
    p.cuerpo.appendChild(el("h2","tit","Próximo partido con "+part.rivalNombre));
    p.cuerpo.appendChild(el("p","mini",(part.local?"De local":"De visita")+" · "+(typeof etqCompromiso==="function"?etqCompromiso(part):(part.tipo==="copa"?(part.torneo||"Copa")+" · "+part.ronda:"fecha "+part.fecha))+
      " · "+fechaTxt(part.f)+" · "+part.sede));
    /* 7.9013 · el rival tiene pasado: racha, puesto y cómo terminó el último cruce.
       Todo derivado (E.forma la arma ui-jornada.js). Si no hay dato, se dice. */
    p.cuerpo.appendChild(_pasadoRival(part));
    const b=el("button","btn-aqua ancho verde cta-jugar","Ir al partido");
    b.onclick=()=>{ if(bloqueoDecisiones()) return; pantallaPrevia(part); };
    p.cuerpo.appendChild(b);
    if(typeof plantelRival==="function"){
      const det=el("details"); det.className="rival-prev";
      det.appendChild(el("summary","","👁️ "+T("esc_once_ver","Once probable de ")+part.rivalNombre));
      try{
        const xi=plantelRival(part.rivalId||part.rivalNombre, part.fuerzaRival);
        /* 7.9013 · informe GRATIS: útil, y un club chico puede pedirlo todas las semanas. */
        const SCOUT_COSTO=0;
        window.SCOUT_COSTO=SCOUT_COSTO;
        const claveScout=(E.club||"")+"|"+(part.rivalId||part.rivalNombre)+"|"+E.idx;
        if(!E.flags) E.flags={}; if(!E.flags.scouting) E.flags.scouting={};
        const pagado=!!E.flags.scouting[claveScout];
        /* sin informe: solo los 4 más obvios. El resto, niebla — se revela al pedir. */
        const revelados=xi.slice().sort((a,b)=>(b.nivel||0)-(a.nivel||0)).slice(0,4);
        const ve=j=>pagado||revelados.indexOf(j)>=0;
        const t=el("table"); t.innerHTML="<thead><tr><th>"+T("scout_rival","Rival")+"</th><th>"+T("scout_pos","Pos")+"</th><th class='n'>"+T("scout_nivel","Nivel")+"</th></tr></thead>";
        const tb=el("tbody");
        xi.forEach(j=>{
          const nom=ve(j)?((j.real?"● ":"")+j.n):"???????";
          const niv=pagado?j.nivel:(revelados.indexOf(j)>=0?("~"+(Math.round((j.nivel||60)/4)*4)):"—");
          tb.appendChild(el("tr",ve(j)?null:"scout-niebla","<td>"+nom+"</td><td>"+j.pos+"</td><td class='n'>"+niv+"</td>"));
        });
        t.appendChild(tb); det.appendChild(t);
        if(pagado){
          det.appendChild(el("p","mini","● "+T("scout_real","jugador real documentado")+". "+T("scout_estim","Es una lectura estimada: la formación final puede cambiar.")));
        } else {
          det.appendChild(el("p","mini",T("scout_niebla","Ves a los conocidos; el resto es niebla. Pide el informe y ves el once completo — no cuesta caja.")));
          const bi=el("button","btn-aqua chico verde");
          bi.textContent="🔎 "+T("scout_btn","Informe completo")+" · "+T("scout_gratis","gratis");
          bi.onclick=()=>{
            E.flags.scouting[claveScout]=1;
            guardar(); aviso("🔎 "+T("scout_listo","Informe listo")+": "+part.rivalNombre);
            render();
          };
          det.appendChild(bi);
        }
      }catch(e){ det.appendChild(el("p","mini","No se pudo leer el rival.")); }
      p.cuerpo.appendChild(det);
    }
    const yaEntreno=E.flags["entreno_"+E.anio+"_"+E.idx];
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

  const pend=(typeof pendientesAtender==="function")?pendientesAtender():[];
  if(pend.length){
    const pa=panel("Atiende antes de avanzar","⚠️","alerta");
    pa.cuerpo.appendChild(el("p","mini","Hay cosas que conviene resolver antes de apretar Avanzar. Toca una para ir a resolverla:"));
    pend.forEach(it=>{
      const b=el("button","op"+(it.fuerte?" op-alerta":"")); b.innerHTML='<div class="t">'+it.ic+" "+it.t+'</div>'+(it.d?'<div class="req">'+it.d+'</div>':"");
      b.onclick=()=>atenderPendiente(it);
      pa.cuerpo.appendChild(b);
    });
    izq.appendChild(pa);
  }

  /* 7.0 · historia del club (arco de equipo) si hay un capítulo abierto */
  if(typeof panelStoryline==="function"){ const ps=panelStoryline(); if(ps) izq.appendChild(ps); }

  /* 5.0 · objetivos de temporada — lo que se espera de ti
     6.29 · pestañas por sección (menos scroll) + tarjetas compactas movibles */
  if(Array.isArray(E.objetivos)&&E.objetivos.length&&typeof progresoObjetivo==="function"){
    const cumplidasN=E.objetivos.filter(o=>progresoObjetivo(o).cumplido).length;
    const po=panel("Lo que se espera de ti","📋",E.objetivos.some(o=>progresoObjetivo(o).estado==="riesgo")?"alerta":"agua");
    po.cuerpo.appendChild(el("p","mini","Metas de la dirigencia para "+E.anio+", atadas a cómo va el club. Se evalúan al cierre. Vas <b>"+cumplidasN+" de "+E.objetivos.length+"</b> en curso."));
    const CAT={deportivo:{ic:"⚽",n:"Deportivo",c:"#2f7dd0"},economico:{ic:"💰",n:"Económico",c:"#3aa049"},institucional:{ic:"🏛️",n:"Institucional",c:"#9a6fe0"}};
    const EST={cumplido:{n:"Cumplido",c:"#2fa84f"},encamino:{n:"En camino",c:"#d68a1f"},riesgo:{n:"En riesgo",c:"#c0392b"}};
    const tabs=el("div","obj-tabs");
    const cont=el("div","obj-grid grid-comodo");
    if(!E.uiObjTab) E.uiObjTab="todo";
    const secciones=[["todo","Todo","📋"]].concat(
      ["deportivo","economico","institucional"].filter(c=>E.objetivos.some(o=>o.cat===c))
        .map(c=>[c,CAT[c].n,CAT[c].ic]));
    function pintarObjs(){
      cont.innerHTML="";
      E.objetivos.filter(o=>E.uiObjTab==="todo"||o.cat===E.uiObjTab).forEach(o=>{
        const pr=progresoObjetivo(o), cat=CAT[o.cat]||CAT.deportivo, est=EST[pr.estado]||EST.encamino;
        const box=el("div","obj obj-mini");
        box.setAttribute("data-meta", o.id||o.t);
        box.innerHTML=
          "<div class='obj-top'><span class='obj-cat' style='background:"+cat.c+"'>"+cat.ic+" "+cat.n+"</span>"+
          "<span class='obj-est' style='color:"+est.c+"'>"+(pr.cumplido?"✓ ":"")+est.n+"</span></div>"+
          "<div class='obj-t'>"+o.t+"</div>"+
          barrita(pr.pct,est.c)+
          "<div class='obj-dato'>"+pr.txt+"</div>"+
          "<div class='obj-porque oculto'>💡 "+o.porque+"</div>";
        box.style.cursor="pointer"; box.title=T("meta_ir","Toca para ir a trabajar esta meta");
        box.onclick=()=>{ metaNavegar(o, pr); };
        /* el 💡 "por qué" queda en un chevron secundario, no roba el click principal */
        const chev=el("button","obj-chev","💡"); chev.title=T("meta_porque","Por qué importa");
        chev.onclick=(e)=>{ e.stopPropagation(); const pq=box.querySelector(".obj-porque"); if(pq) pq.classList.toggle("oculto"); };
        box.appendChild(chev);
        cont.appendChild(box);
      });
    }
    secciones.forEach(([id,nom,ic])=>{
      const t=el("button","obj-tab"+(E.uiObjTab===id?" on":""),ic+" "+nom);
      t.onclick=()=>{ E.uiObjTab=id; [...tabs.children].forEach(x=>x.classList.remove("on")); t.classList.add("on"); pintarObjs(); guardar(); };
      tabs.appendChild(t);
    });
    po.cuerpo.appendChild(tabs);
    po.cuerpo.appendChild(cont);
    pintarObjs();
    izq.appendChild(po);
  }

  const cer=panel("Ayudante","🧑‍🏫","agua");
  cer.cuerpo.appendChild(el("p","mini","Tu mano derecha, gratis y sin servidor: lee el club de verdad, arma un informe y te responde en chileno. Pregúntale lo que quieras."));
  if(typeof informeSemanal==="function"){
    cer.cuerpo.appendChild(el("p",null,informeSemanal()));
  }
  const insights=(typeof cerebroLocal==="function")?cerebroLocal():[];
  if(insights.length){
    const cl=el("div","cerebro");
    insights.forEach(i=>{
      const d=el("div","cere-row cere-"+i.cat);
      d.innerHTML="<span class='cere-ic'>"+i.ic+"</span><div><b>"+i.t+"</b><div class='mini'>"+i.d+"</div></div>";
      cl.appendChild(d);
    });
    cer.cuerpo.appendChild(cl);
  } else {
    cer.cuerpo.appendChild(el("p",null,typeof consejoLocal==="function"?consejoLocal():"Todo tranquilo. Puedes mover un estatuto o mirar el mercado."));
  }
  /* 4.b · preguntarle al ayudante en texto libre */
  if(typeof preguntarAyudante==="function"){
    const qbox=el("div"); qbox.style.marginTop="8px";
    const resp=el("div","resul mitad"); resp.hidden=true;
    const inp=el("input"); inp.type="text"; inp.id="ay-input"; inp.placeholder=T("ay_ph","Preguntale al ayudante… (rival, once, plata, camarín, meta, mercado…)");
    inp.style.cssText="display:block;width:100%;box-sizing:border-box;padding:9px 11px;border-radius:8px;border:1px solid rgba(0,0,0,.15)";
    const responder=()=>{
      const q=inp.value.trim(); if(!q){ inp.focus(); return; }
      const r=(typeof ayudanteResponde==="function")?ayudanteResponde(q):{txt:String(preguntarAyudante(q)||""),acc:[],chips:[]};
      resp.hidden=false; resp.innerHTML="";
      const b=el("b"); b.textContent="🧑‍🏫 "+T("esc_ayudante","Ayudante")+":";
      resp.appendChild(b);
      resp.appendChild(document.createTextNode(" "+(r.txt||"")));
      if(r.acc && r.acc.length){
        const fa=el("div","fichas"); fa.style.marginTop="6px";
        r.acc.forEach(a=>{ const ba=el("button","btn-aqua chico",a.t); ba.onclick=()=>{ try{ if(a.go) a.go(); }catch(e){} }; fa.appendChild(ba); });
        resp.appendChild(fa);
      }
      if(r.chips && r.chips.length){
        const fc=el("div","fichas"); fc.style.marginTop="6px";
        r.chips.forEach(txt=>{ const c=el("button","ficha",txt); c.onclick=()=>{ inp.value=txt; responder(); }; fc.appendChild(c); });
        resp.appendChild(fc);
      }
    };
    inp.onkeydown=e=>{ if(e.key==="Enter"){ e.preventDefault(); responder(); } };
    const bq=el("button","btn-aqua chico",T("ay_preguntar","Preguntar")); bq.id="ay-btn"; bq.style.marginTop="6px"; bq.onclick=responder;
    const chips=el("div","fichas"); chips.style.marginTop="6px";
    [T("chip_domingo","¿El domingo?"),T("chip_rival","¿Cómo viene el rival?"),T("chip_plata","¿Cómo estamos de plata?"),T("ay_c_les","los lesionados"),T("chip_meta","¿Qué hago con la meta?")].forEach(txt=>{
      const c=el("button","ficha",txt); c.onclick=()=>{ inp.value=txt; responder(); }; chips.appendChild(c);
    });
    qbox.appendChild(inp); qbox.appendChild(bq); qbox.appendChild(chips); qbox.appendChild(resp);
    cer._responder=responder; cer._inp=inp;   /* para precargar desde una meta (punto 5C) */
    cer.cuerpo.appendChild(qbox);
  }
  izq.appendChild(cer);

  /* decisiones */
  const pd=panel("Decisiones sobre la mesa","📥",E.decPend.some(x=>x.peso==="alto")?"alerta":"");
  if(!E.decPend.length) pd.cuerpo.appendChild(el("p","mini","Nada pendiente. Por ahora."));
  else pd.cuerpo.appendChild(el("p","mini",E.decPend.length+" sobre la mesa. Las urgentes van primero; el resto puede esperar."));
  /* 7.9006 · ordenadas y AGRUPADAS por naturaleza (no por siembra random):
     Partido / Institución / Plata. Urgentes primero dentro de cada grupo. */
  const GRUPO_DEC=[
    {k:"partido",   n:T("dec_g_partido","⚽ Partido"),     bz:["preparacion"]},
    {k:"plata",     n:T("dec_g_plata","💰 Plata"),         bz:["finanzas","refuerzos"]},
    {k:"institucion",n:T("dec_g_inst","🏛️ Institución"),  bz:["institucional","camarin","hinchada","cantera","prensa","gris"]}
  ];
  const _grupoDe=bz=>{ for(const g of GRUPO_DEC){ if(g.bz.indexOf(bz)>=0) return g.k; } return "institucion"; };
  const porGrupo={};
  E.decPend.slice().sort((a,b)=>(b.peso==="alto")-(a.peso==="alto")).forEach(x=>{
    const d=decisionPorId(x.id); if(!d) return;
    const gk=_grupoDe(d.buzon); (porGrupo[gk]=porGrupo[gk]||[]).push({x,d});
  });
  GRUPO_DEC.forEach(g=>{
    const items=porGrupo[g.k]; if(!items||!items.length) return;
    pd.cuerpo.appendChild(el("h3","sub dec-grupo",g.n));
    const gridDec=el("div","grid-comodo");
    items.forEach(({x,d})=>{
      const b=el("button","op"+(x.peso==="alto"?" dec-urgente":""));
      b.innerHTML='<div class="t">'+BUZONES[d.buzon].ic+" "+resolverTokens(d.t,E)+'</div>'+
        '<div class="d">'+BUZONES[d.buzon].n+(x.peso==="alto"?" · <b>"+T("dec_urg","hay que resolverla antes del próximo partido")+"</b>":"")+'</div>';
      b.onclick=()=>abrirDecision(d,true);
      gridDec.appendChild(b);
    });
    pd.cuerpo.appendChild(gridDec);
  });
  izq.appendChild(pd);

  /* bandeja de novedades */
  const pb=panel("Lo que pasó esta semana","📰");
  if(!E.bandeja.length) pb.cuerpo.appendChild(el("p","mini","Sin novedades de tu club esta semana. Igual, el fútbol no para:"));
  E.bandeja.slice(0,7).forEach(it=>{
    const d=el("div","resul "+(it.tipo==="malo"?"mal":(it.tipo==="bueno"?"bien":"mitad")));
    d.innerHTML="<b>"+it.t+"</b><br>"+it.d+(it.extra?"<br><span class='mini'>"+it.extra+"</span>":"");
    pb.cuerpo.appendChild(d);
  });
  /* 6.34 · titulares de la liga: noticias relevantes atadas al estado real */
  if(typeof titularesSemana==="function"){
    const tits=titularesSemana();
    if(tits.length){
      pb.cuerpo.appendChild(el("h3","sub","Titulares de la liga"));
      tits.forEach(n=>{
        const d=el("div","titular");
        d.innerHTML="<b>"+n.t+"</b><div class='mini'>"+n.d+"</div>";
        pb.cuerpo.appendChild(d);
      });
    }
  }
  izq.appendChild(pb);

  /* E-1 · la situación del club ya NO vive acá (era un párrafo genérico con ventana
     propia). Se movió a Historia → capítulo 2026 "Hoy" (ver vistaHistoria). */

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
/* puntúa una opción por su efecto neto sobre el club (para la pista del ayudante) */
function puntajeOpcion(o){
  let s=0; const ef=o.ef||{};
  s+=(ef.plata||0)*0.02 + (ef.moral||0) + (ef.prestigio||0)*1.4 + (ef.capital||0)*1.2 - (ef.riesgo||0)*1.2 - (ef.deuda||0)*0.02;
  const gr=o.grupos||{}; Object.keys(gr).forEach(k=>{ s+=gr[k]*0.8; });
  const rp=o.rep||{}; Object.keys(rp).forEach(k=>{ s+=rp[k]*0.6; });
  return s;
}
function abrirDecision(d,enModal){
  let pistaOn=false;   /* el ayudante ya dio su lectura en esta decisión */
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
      /* 7.9006 · las temperaturas 🔥😐🧊 SIEMPRE se ven (es lectura del club, no un
         poder). El botón del ayudante marca UNA opción: la que él se jugaría. */
      const scores=d.op.map(puntajeOpcion); const mx=Math.max.apply(null,scores), mn=Math.min.apply(null,scores);
      let idxElige=-1, mejor=-Infinity;
      d.op.forEach((o,i)=>{ if(requisitoCumplido(o).ok && scores[i]>mejor){ mejor=scores[i]; idxElige=i; } });
      const bp=el("button","btn-aqua chico"+(pistaOn?" gris":""));
      bp.textContent="🧑‍🏫 "+(pistaOn?T("dec_elige_ya","El ayudante ya marcó su opción"):T("dec_elige","Él elegiría esta"));
      bp.disabled=pistaOn || idxElige<0;
      bp.onclick=()=>{ pistaOn=true; pintar(cont); };
      p.cuerpo.appendChild(bp);
      if(pistaOn) p.cuerpo.appendChild(el("p","mini","🧑‍🏫 "+T("dec_elige_txt","El ayudante se la jugaría acá. Decides tú.")));
      const ops=el("div","ops");
      d.op.forEach((o,i)=>{
        const chk=requisitoCumplido(o);
        const b=el("button","op"+(pistaOn && i===idxElige?" op-elegida":""));
        b.disabled=!chk.ok;
        let temp="";
        if(mx!==mn){ temp=scores[i]===mx?" <span class='etq ok'>🔥</span>":(scores[i]===mn?" <span class='etq mal'>🧊</span>":" <span class='etq neu'>😐</span>"); }
        const marca=(pistaOn && i===idxElige)?" <span class='etq ok'>🧑‍🏫 "+T("dec_elige_badge","él elegiría")+"</span>":"";
        b.innerHTML='<div class="t">'+resolverTokens(o.t,E)+temp+marca+'</div><div class="d">'+resolverTokens(o.d||"",E)+'</div>'+
          (textoRequisitos(o)?'<div class="req">'+textoRequisitos(o)+(chk.ok?"":" · <b>"+chk.txt+"</b>")+'</div>':"");
        b.onclick=()=>{
          const r=resolverDecision(d,i);
          if(!r) return;
          notificar({t:"Decisión: "+resolverTokens(d.t,E),
            tipo:r.tier==="bien"?"bueno":(r.tier==="mal"?"malo":"neutro"),
            d:"Elegiste «"+resolverTokens(o.t,E)+"». "+resolverTokens(r.txt||"",E),extra:r.extra,bandeja:false});
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
/* jugadas de poder: gastas capital para arriesgarte a un premio grande o a que te explote.
   Tu credibilidad baja el riesgo de que salga mal. */
const JUGADAS_PODER=[
 {id:"lobby_anfp",n:"Lobby en la ANFP",ic:"🤝",costo:18,prob:0.42,
  desc:"Mueves tus contactos para pelear mejor reparto de TV y un fixture más amable.",
  bueno:{ef:{plata:180},grupos:{anfp:6},msg:"Conseguiste un guiño: más plata de TV y calendario amigable."},
  malo:{grupos:{anfp:-12,prensa:-6},ef:{riesgo:4},msg:"Se filtró la movida: la ANFP se ofende y la prensa habla de tráfico de influencias."}},
 {id:"golpe_camarin",n:"Golpe de autoridad",ic:"✊",costo:12,prob:0.4,
  desc:"Paras el camarín en seco: reglas nuevas, disciplina de hierro.",
  bueno:{ef:{moral:8},grupos:{camarin:8},msg:"El grupo entendió el mensaje: se ordenan y tiran para el mismo lado."},
  malo:{ef:{moral:-10},grupos:{camarin:-12},msg:"Se resintieron: un referente filtró que eres un dictador."}},
 {id:"sponsor_agresivo",n:"Exprimir a los sponsors",ic:"💼",costo:15,prob:0.45,
  desc:"Renegocias los contratos con la marca al límite.",
  bueno:{ef:{plata:150},grupos:{sponsors:5},msg:"Sacaste más plata sin romper la relación."},
  malo:{grupos:{sponsors:-14},rep:{credibilidad:-6},msg:"Un sponsor se fue con un portazo público."}},
 {id:"purga_directorio",n:"Purga en el directorio",ic:"🪑",costo:25,prob:0.5,
  desc:"Corres a los que te hacen sombra y pones gente tuya.",
  bueno:{grupos:{directorio:10},ef:{capital:12},msg:"Consolidaste poder: el directorio ahora te responde."},
  malo:{grupos:{directorio:-16,socios:-8},ef:{riesgo:5},msg:"Se armó una interna: te quedaste con enemigos adentro."}},
 {id:"presion_arbitral",n:"Apretar al arbitraje",ic:"🧑‍⚖️",costo:16,prob:0.5,
  desc:"Mandas un mensaje fuerte de cara al próximo partido.",
  bueno:{mod:{id:"favor_arb",n:"Guiño arbitral",ef:{arbitraje:3},anios:1},msg:"El próximo pito parece mirarte con mejores ojos."},
  malo:{grupos:{anfp:-10},rep:{credibilidad:-5},ef:{riesgo:4},msg:"Te expusiste: ahora el arbitraje te va a mirar con lupa."}}
];
function probMalaJugada(j){ return clamp(j.prob-(((E.rep&&E.rep.credibilidad)||50)-50)/200,0.1,0.85); }
function hacerJugadaPoder(j){
  if((E.capital||0)<j.costo){ aviso("No te alcanza el capital institucional ("+j.costo+" necesarios)"); return; }
  if(!confirm(j.n+" — cuesta "+j.costo+" de capital y hay ~"+Math.round(probMalaJugada(j)*100)+"% de que salga mal. ¿Jugártela?")) return;
  E.capital-=j.costo;
  const malo=Math.random()<probMalaJugada(j);
  const res=malo?j.malo:j.bueno;
  if(res.ef) aplicarEfectos(res.ef);
  if(res.grupos) aplicarGrupos(res.grupos);
  if(res.rep) aplicarRep(res.rep);
  if(res.mod) E.mods.push({id:res.mod.id,n:res.mod.n,hasta:E.anio+(res.mod.anios||1),ef:res.mod.ef||{}});
  if(typeof recordar==="function") recordar("poder","te la jugaste con «"+j.n+"» y "+(malo?"te salió mal":"te salió bien"),{peso:"medio",tono:malo?"malo":"bueno"});
  notificar({t:(malo?"❌ ":"✅ ")+"Jugada de poder: "+j.n,tipo:malo?"malo":"bueno",bandeja:false,d:res.msg});
  aviso((malo?"❌ ":"✅ ")+res.msg);
  guardar(); render();
}
function vistaInstitucion(){
  const v=$("#vista");
  const p=panel("Capital institucional","⚖️","agua");
  p.cuerpo.appendChild(el("h2","tit",E.capital>100?(E.capital+" 💪"):(E.capital+" / 100")));
  p.cuerpo.appendChild(el("div",null,barrita(E.capital,"#39b7e0")));
  p.cuerpo.appendChild(el("p","mini","Es lo que puedes imponer sin que se te caiga el club encima. Se gasta forzando decisiones y cambiando estatutos."+
    (E.capital>100?" Pasaste los 100: tienes un poder político enorme para hacer lo que quieras.":"")+
    " Este año vas a generar aproximadamente <b>"+signo(capitalAnual())+"</b>."));
  v.appendChild(p);

  /* jugadas de poder (arriesgarse con el capital) */
  const pp=panel("Jugadas de poder","♟️","alerta");
  pp.cuerpo.appendChild(el("p","mini","Movidas fuertes: gastas capital para ir por un premio grande… o que te explote. Tu credibilidad ("+Math.round((E.rep&&E.rep.credibilidad)||50)+"/100) baja el riesgo de que salga mal."));
  const _locFed=(typeof localizarFed==="function")?localizarFed:(x=>x);   /* ANFP→AFA en liga extranjera */
  JUGADAS_PODER.forEach(j=>{
    const b=el("button","op"); b.disabled=(E.capital||0)<j.costo;
    const pm=Math.round(probMalaJugada(j)*100);
    b.innerHTML=_locFed('<div class="t">'+j.ic+" "+j.n+" · "+j.costo+' cap.</div><div class="d">'+j.desc+" <span class='mini'>(riesgo de que salga mal: ~"+pm+"%)</span></div>");
    b.onclick=()=>hacerJugadaPoder(j);
    pp.cuerpo.appendChild(b);
  });
  v.appendChild(pp);

  const pg=panel("Grupos de interés","👥");
  GRUPOS.forEach(g=>{
    const x=E.grupos[g.id];
    const d=el("div","grupo-fila");
    d.innerHTML='<div class="fila" style="border:none;padding:8px 0"><span>'+g.ic+" <b>"+g.n+'</b> <span class="mini">poder '+x.poder+'</span></span>'+
      '<b>'+etiquetaAprobacion(x.aprob)+' ('+signo(x.aprob)+')</b></div>'+
      barrita(x.aprob+100,x.aprob>=0?"#4fbf3f":"#c9392c",200)+
      '<div class="mini" style="margin-top:3px"><b>Quiere:</b> '+g.quiere+'</div>'+
      '<div class="mini">'+(x.aprob>=0?("<b>Si te banca:</b> "+(g.banca||"te deja trabajar.")):"<b>Si te corta:</b> "+g.castigo)+'</div>';
    if(x.aprob<-45) d.appendChild(el("div","mini","⚠ "+g.castigo));
    pg.cuerpo.appendChild(d);
  });
  v.appendChild(pg);

  const pe=panel("Estatutos del club","📜");
  pe.cuerpo.appendChild(el("p","mini","Cambiar un estatuto cuesta capital institucional y molesta a quien pierde con el cambio. Queda vigente hasta que lo vuelvas a tocar."));
  ESTATUTOS.forEach(cat=>{
    const actual=cat.op.find(o=>o.id===E.estatutos[cat.id]);
    const d=el("div");
    d.innerHTML='<div class="fila"><span>'+cat.ic+" "+cat.n+'</span><b>'+_locFed(actual?actual.n:"—")+'</b></div>';
    const f=el("div","fichas");
    cat.op.forEach(o=>{
      if(o.id===E.estatutos[cat.id]) return;
      const costo=cat.pesado?42:22;
      const b=el("button","ficha",_locFed(o.n)+" · "+costo);
      b.title=_locFed(o.d);
      b.onclick=()=>cambiarEstatuto(cat,o,costo);
      f.appendChild(b);
    });
    d.appendChild(f);
    pe.cuerpo.appendChild(d);
  });
  v.appendChild(pe);

  /* 6.21 · mesa de la barra (interlocutor con memoria) */
  if(typeof panelMesaBarra==="function"){ const pmb=panelMesaBarra(); if(pmb) v.appendChild(pmb); }
  /* interacción directa con los actores del club (Bloque 4) */
  if(typeof INTERACCIONES!=="undefined"){
    const pi=panel("Interacción directa","🤝");
    pi.cuerpo.appendChild(el("p","mini","Anda por los pasillos: cada actor tiene su precio y su reacción."));
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
/* 6.21 · Mesa de la barra: interlocutor con memoria (pactos que se cobran) */
function abrirMesaBarra(){
  if(typeof normalizarBarra==="function") normalizarBarra();
  modal(box=>{
    box.classList.remove("panel");
    const p=panel("Mesa con la barra","🚩","alerta"); p.classList.add("dec");
    p.cuerpo.appendChild(el("h2","tit","Los referentes de la barra piden reunión"));
    p.cuerpo.appendChild(el("p","ctx","La mesa no es un trámite: lo que acuerdas queda, y si lo rompes te lo cobran. Pactos en pie: "+pactosVigentes()+"/3"+(barraContenta()?" — la barra está de tu lado.":".")));
    const vig=E.barra.pactos.filter(x=>!x.roto);
    if(vig.length){ p.cuerpo.appendChild(el("h3","sub","Pactos en pie")); vig.forEach(x=>p.cuerpo.appendChild(el("div","mini","🤝 "+x.resumen))); }
    if(E.barra.lienzos.length) p.cuerpo.appendChild(el("div","resul mal","🚩 Lienzo en contra: "+E.barra.lienzos[E.barra.lienzos.length-1].t));
    const ops=el("div","ops");
    pactosBarra().forEach(o=>{
      const yaTiene=E.barra.pactos.some(x=>!x.roto && x.tipo===o.tipo && (!o.quien||x.quien===o.quien));
      const b=el("button","op"); b.disabled=yaTiene||(o.costo&&E.plata<o.costo);
      b.innerHTML='<div class="t">'+o.t+(yaTiene?" · <span class='mini'>ya pactado</span>":(o.costo?" · <b>"+plata(o.costo)+"</b>":""))+'</div><div class="d">'+o.d+'</div>';
      b.onclick=()=>{ if(pactar(o)){ cerrarModal(); render(); aviso("Pacto cerrado con la barra"); } };
      ops.appendChild(b);
    });
    p.cuerpo.appendChild(ops);
    const x=el("button","btn-aqua ancho gris","Cerrar la reunión"); x.style.marginTop="6px"; x.onclick=cerrarModal;
    p.cuerpo.appendChild(x);
    box.appendChild(p);
  });
}
function panelMesaBarra(){
  if(typeof pactosVigentes!=="function"||!E.barra) return null;
  const pb=panel("Mesa con la barra","🚩",E.barra.roto?"grave":"agua");
  pb.cuerpo.appendChild(el("p","mini","La barra tiene memoria. <b>"+pactosVigentes()+"/3</b> pactos en pie."+
    (barraContenta()?" Están de tu lado: caldera en el clásico de local.":"")+
    (E.barra.roto?" ⚠ Hay un pacto roto: te silban y bajan al equipo.":"")));
  const puede=(typeof puedeMesaBarra==="function")&&puedeMesaBarra();
  const b=el("button","btn-aqua ancho"+(puede?" verde":" gris"),puede?"🚩 Reunirte con la mesa":"🚩 La mesa espera unas fechas más");
  b.disabled=!puede; b.onclick=abrirMesaBarra;
  pb.cuerpo.appendChild(b);
  return pb;
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
    c.appendChild(el("p","mini","Cuesta "+costo+" de capital institucional. Tienes "+E.capital+"."));
    if(cat.pesado) c.appendChild(el("div","resul mal","Tocar la identidad del club es lo más caro que puedes hacer. Si la comunidad y los socios se te dan vuelta al mismo tiempo, puede terminar en una ruptura institucional."));
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
  const v=(typeof envolverVistaSO==="function")
    ? envolverVistaSO("Banco · "+((typeof nombreSociedad==="function")?nombreSociedad():"Sociedad"),"🏦")
    : $("#vista");
  if(typeof bolsilloDT==="function") bolsilloDT();
  if(typeof normalizarBolsa==="function") normalizarBolsa();
  /* 7.9991 · "banco": las cuentas de un vistazo, como ventanilla Aero */
  const banco=el("div","banco-cuentas");
  const accs=[
    {k:"Caja del club", ir:"Banco ·", v:plata(E.plata), cls:"corriente", d:"Cuenta corriente del club. Con esto se pagan sueldos e intereses."},
    {k:"Deuda", ir:"Deuda", v:plata(E.deuda), cls:(E.deuda||0)>1500?"pasivo mal":"pasivo", d:"Pasivo. Cada semana come intereses."},
    {k:"Tu bolsillo", ir:"Bolsa de valores", v:plata((E.personal&&E.personal.bolsillo)||0), cls:"personal", d:"Plata tuya. No es de la tesorería."},
    {k:"Acciones", ir:"Bolsa de valores", v:(E.bolsa&&typeof valorTenencia==="function")?plata(Math.round(valorTenencia())):"—", cls:"inversion", d:"Lo que tienes en la sociedad anónima del club."}
  ];
  /* 7.9013 · eran 4 <button> sin handler: ahora llevan al panel que explican. */
  accs.forEach(a=>{
    const chip=el("button","banco-cta "+a.cls);
    chip.type="button";
    chip.title=a.d;
    chip.innerHTML="<span class='k'>"+a.k+"</span><b class='v'>"+a.v+"</b>";
    chip.onclick=()=>{ _irAPanel(a.ir); aviso(a.d); };
    banco.appendChild(chip);
  });
  v.appendChild(banco);

  const p=panel("Banco · "+((typeof nombreSociedad==="function")?nombreSociedad():"Sociedad Anónima"),"💰","agua");
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
  if(E.flags&&E.flags.clausura) p.cuerpo.appendChild(el("div","resul mal","⚠ Estadio con sectores clausurados por la deuda: pierdes aforo y taquilla."));
  if(E.flags&&E.flags.tribunaCerrada) p.cuerpo.appendChild(el("div","resul mal","⚠ Popular clausurada por el clima de la hinchada: baja el aforo hasta que se calme."));
  p.cuerpo.appendChild(el("p","mini","Los partidos de local suman taquilla aparte. Todos los montos están en millones de pesos de la época."));
  v.appendChild(p);

  /* --- 7.15 · EXPLICADOR: qué pasa con la plata, por qué, y qué hacer paso a paso --- */
  (function(){
    const neto=ingresoSemanal()-costoSemanal();
    const semanas=neto>=0?99:Math.max(0,Math.floor((E.plata||0)/Math.max(1,-neto)));
    const atras=!!(E.flags&&E.flags.sueldosAtrasados), claus=!!(E.flags&&E.flags.clausura);
    const trib=!!(E.flags&&E.flags.tribunaCerrada);
    const dir=(E.grupos&&E.grupos.directorio&&E.grupos.directorio.aprob)||0;
    const deuda=E.deuda||0;
    let nivel, verd;
    if(atras||claus||trib||semanas<4||(deuda>4500&&dir<-15)){ nivel="rojo"; verd="🔴 Alerta: la plata está apretando."; }
    else if(neto<0||deuda>1500||semanas<12){ nivel="amarillo"; verd="🟡 Ojo con la caja, pero hay margen."; }
    else { nivel="verde"; verd="🟢 Finanzas sanas."; }
    const pe=panel("¿Cómo estamos de plata?","🧭",nivel==="rojo"?"grave":(nivel==="amarillo"?"alerta":"agua"));
    pe.cuerpo.appendChild(el("div","resul "+(nivel==="verde"?"bien":(nivel==="rojo"?"mal":"mitad")),"<b>"+verd+"</b>"));
    const por=[];
    if(neto<0) por.push("Cada semana <b>sale más de lo que entra</b> ("+plata(-neto)+" en rojo). Con este ritmo la caja dura ±"+semanas+" semanas.");
    else por.push("Cada semana te quedan <b>+"+plata(neto)+"</b>: por flujo, la caja no corre peligro.");
    let ingBase=0; try{ if(typeof ingresosAnuales==="function"){ const ia=ingresosAnuales(); ingBase=(ia.tv||0)+(ia.sponsors||0)+(ia.socios||0); } }catch(e){}
    if(ingBase && planillaAnual()>ingBase) por.push("La <b>planilla</b> (sueldos) es lo que más te pesa: sola ya supera lo que entra por TV+sponsors+socios.");
    if(deuda>3000) por.push("La <b>deuda</b> ("+plata(deuda)+") es alta: los intereses te comen caja cada semana y calientan al directorio.");
    else if(deuda>0) por.push("Tienes una deuda de "+plata(deuda)+" pagando intereses todas las semanas.");
    if(atras) por.push("🔴 <b>Sueldos atrasados</b>: la moral del plantel cae cada semana hasta que regularices la caja.");
    if(claus) por.push("🔴 <b>Sectores clausurados</b> por la deuda: pierdes aforo y taquilla en cada partido de local.");
    if(trib) por.push("🔴 <b>Popular cerrada</b>: la hinchada está caliente y baja el aforo.");
    const ul=el("div","mini"); ul.style.lineHeight="1.5"; ul.innerHTML=por.map(x=>"• "+x).join("<br>"); pe.cuerpo.appendChild(ul);
    const pasos=[];
    if(atras||claus||trib) pasos.push("Consigue caja YA y baja la deuda: vende un jugador en <b>Mercado</b> (la plata más sana), o pide un <b>crédito</b> acá abajo si es urgente.");
    if(E.plata>=200 && deuda>0) pasos.push("Tienes "+plata(E.plata)+" disponible: <b>abona a la deuda</b> (botones abajo) para pagar menos intereses cada semana.");
    if(E.plata<200 && (neto<0||deuda>0)) pasos.push("Poca caja: lo más sano es <b>vender o no renovar</b> un sueldo alto en <b>Mercado</b>. El <b>crédito</b> te salva hoy pero sube la deuda 8%.");
    if(neto<0) pasos.push("Para dejar de perder cada semana: baja <b>planilla</b> (vender/no renovar) o sube ingresos (precio de <b>entradas</b> en Estadio, sponsors, contratar CM).");
    if(nivel==="verde") pasos.push("Vas bien. Si quieres soltar las manos en el mercado, abona deuda; si sobra, invierte en el club.");
    if(!pasos.length) pasos.push("No hay nada urgente. Mantén el flujo positivo y abona deuda cuando sobre.");
    pe.cuerpo.appendChild(el("h3","sub","Qué hacer, paso a paso"));
    pasos.forEach((s,i)=>pe.cuerpo.appendChild(el("div","resul mitad","<b>"+(i+1)+".</b> "+s)));
    pe.cuerpo.appendChild(el("p","mini","Regla de oro: siempre hay salida. Si te quedas sin caja, un crédito te da aire (sube la deuda) y vender un jugador es la forma más sana de ordenar."));
    v.appendChild(pe);
  })();

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
    if(typeof canvasBolsa==="function") pb.cuerpo.appendChild(canvasBolsa(E.bolsa.historia));
    else pb.cuerpo.appendChild(sparkNode(E.bolsa.historia));
    const h=E.bolsa.historia||[];
    if(h.length>1){
      const ult=h.slice(-6);
      const mov=el("p","mini");
      mov.innerHTML="Movimientos: "+ult.slice(1).map(function(p,i){
        const a=ult[i]; const d=a?((p-a)/a*100):0;
        return (d>=0?"↑ +":"↓ ")+d.toFixed(1)+"%";
      }).join(" · ");
      pb.cuerpo.appendChild(mov);
    }
    pb.cuerpo.appendChild(el("p","mini","Tú sabes los resultados antes que el mercado. Ganar hace subir la acción; perder la hunde. Especulas con tu bolsillo personal."));
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

  /* --- precios de entradas: ahora viven en la sección Estadio 🏟️ --- */
  const pev=panel("Entradas y estadio","🎫","agua");
  pev.cuerpo.appendChild(el("p","mini","Los precios por sector y las obras del estadio se manejan en su propia sección."));
  const beg=el("button","btn-aqua chico verde","Ir al Estadio"); beg.onclick=()=>irA("estadio");
  pev.cuerpo.appendChild(beg);
  v.appendChild(pev);

  /* --- inversiones de club --- */
  const pin=panel("Inversiones","🏗️");
  pin.cuerpo.appendChild(el("p","mini","Plata que sale hoy para tener un club más grande mañana. No hay atajos infinitos: cada mejora tiene un techo realista y se pone más cara a medida que subes."));
  const hinTope=E.ind.hinchada>=88;
  const inv=[
   {n:"Campaña de marketing",costo:250,disp:!hinTope,
    desc:hinTope?"La hinchada ya está a full: gastar en publicidad ahora es tirar la plata.":"+ hinchada, socios y algo de prestigio. Pierde efecto cuando la gente ya está prendida.",
    fn:()=>aplicarEfectos({plata:-250,hinchada:Math.max(2,Math.round((88-E.ind.hinchada)/6)),socios:4,prestigio:2})},
   E.staff.cm?{n:"Community Manager (contratado)",costo:0,disp:false,desc:"Ya tienes CM. Se maneja desde PLOP.",fn:null}
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
  pd.cuerpo.appendChild(el("p","mini","Los intereses se pagan todas las semanas y no perdonan. Puedes abonar cuando tengas caja."));
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
    pd.cuerpo.appendChild(el("p","mini","¿Necesitas caja ya? Pide un crédito: entra plata al toque, pero la deuda sube con recargo (8%) y los intereses corren igual."));
    const pr=el("div");
    [300,600,1000].forEach(m=>{
      const b=el("button","btn-aqua chico amarillo","Pedir "+plata(m)); b.style.marginRight="6px";
      b.onclick=()=>{ tomarPrestamo(m); guardar(); render(); aviso("Crédito por "+plata(m)); };
      pr.appendChild(b);
    });
    pd.cuerpo.appendChild(pr);
  }
  /* 7.58 · refinanciar: baja el interés semanal estirando el total (explicado) */
  if(typeof refinanciarDeuda==="function" && typeof previewRefinanciar==="function"){
    const pv=previewRefinanciar();
    if(typeof estaRefinanciado==="function" && estaRefinanciado()){
      pd.cuerpo.appendChild(el("div","resul mitad","<b>Deuda refinanciada</b> — el interés semanal está más bajo por unos años. No se puede volver a refinanciar mientras esté activo."));
    } else {
      pd.cuerpo.appendChild(el("p","mini","¿La deuda te ahoga cada semana? <b>Refinanciar</b> baja el interés semanal a cambio de estirar el total (te sale más caro en total, pero respiras ahora)."));
      const br=el("button","btn-aqua chico"+(pv.puede?"":" gris"),"🔁 Refinanciar la deuda");
      br.disabled=!pv.puede;
      br.title=pv.puede?"":"Necesitas al menos "+plata(300)+" de deuda para que valga la pena.";
      br.onclick=()=>{
        modal(box=>{
          box.appendChild(el("div","cab",'<span class="ic">🔁</span><span>Refinanciar la deuda</span>'));
          const c=el("div","cuerpo"); box.appendChild(c);
          c.appendChild(el("p","mini","Es un cambio grande. Mirá qué pasa, paso a paso, antes de confirmar:"));
          c.appendChild(el("div","resul mitad","<b>1.</b> Tu interés semanal baja de <b>"+plata(pv.interesAntes)+"</b> a <b>"+plata(pv.interesDesp)+"</b> por semana. Respiras en la caja."));
          c.appendChild(el("div","resul mitad","<b>2.</b> A cambio, la deuda total sube de <b>"+plata(pv.deudaAntes)+"</b> a <b>"+plata(pv.deudaDesp)+"</b> (cuesta "+plata(pv.costo)+" por estirar el plazo)."));
          c.appendChild(el("div","resul mitad","<b>3.</b> Dura unos años. Mientras esté activa no puedes volver a refinanciar. Al directorio no le encanta estirar deuda."));
          c.appendChild(el("p","mini","En una línea: <b>menos presión cada semana ahora, más caro en total.</b> Sirve si estás ahogado; no si ya vas holgado."));
          const bok=el("button","btn-aqua ancho verde","Sí, refinanciar"); bok.style.marginTop="8px";
          bok.onclick=()=>{ const r=refinanciarDeuda(); cerrarModal(); if(!r.ok){ aviso(r.msg); return; } guardar(); render(); aviso("Deuda refinanciada: interés semanal más bajo, total más alto."); };
          const bno=el("button","btn-aqua ancho gris","Mejor no"); bno.style.marginTop="6px"; bno.onclick=cerrarModal;
          c.appendChild(bok); c.appendChild(bno);
        });
      };
      pd.cuerpo.appendChild(br);
    }
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
  const anclaBanco=v.querySelector(".banco-cuentas");
  if(anclaBanco) v.insertBefore(pd, anclaBanco.nextSibling);
  else v.appendChild(pd);
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
  if(typeof clausulaDe==="function"){
    j.contrato.clausula=Math.round((clausulaDe(j)||j.valor||80)*1.18);
  }
  j.moral=clamp((j.moral||70)+8,0,100);
  if(typeof pushNotif==="function") pushNotif("Renové a "+j.n,j.n+" firmó "+(typeof etqContrato==="function"?etqContrato(j):("hasta "+j.contrato.hasta))+". Costó "+plata(extra)+" de caja.","bueno");
  guardar(); return true;
}
function charlaJugador(j,tipo){
  if(tipo==="banco"){ j.moral=clamp((j.moral||70)+7,0,100); if(E.ind) E.ind.moral=clamp((E.ind.moral||50)+1,0,100); aviso(j.n+" sale más tranquilo."); }
  else { j.forma=clamp((j.forma||70)+5,0,100); j.moral=clamp((j.moral||70)-5,0,100); aviso(j.n+" se queda pensando."); }
  guardar();
}
function vistaPlantel(){
  const v=$("#vista");
  const once=(typeof onceIdeal==="function")?onceIdeal():[];
  const pOnce=panel((typeof T==="function"?T("pla_once","Once probable"):"Once probable"),"📋");
  if(once&&once.length){
    const form=(E.tactica&&E.tactica.form)||"4-4-2";
    pOnce.cuerpo.appendChild(el("p","mini",(typeof T==="function"?T("pla_form","Formación"):"Formación")+" <b>"+form+"</b>. "+
      (typeof T==="function"?T("pla_pizarra_hint","La pizarra se arma en la previa del partido."):"La pizarra se arma en la previa del partido.")));
    const tOnce=el("table","tabla-plantel");
    tOnce.innerHTML="<thead><tr><th>Jugador</th><th>Pos</th><th class='n'>Niv</th><th class='n'>For</th></tr></thead>";
    const tbO=el("tbody");
    once.forEach(j=>{
      const tr=el("tr");
      const nom=(j.real?"● ":"")+(typeof escHtml==="function"?escHtml(j.n):j.n)+(j.lesion>0?" 🩹":"");
      tr.innerHTML="<td>"+nom+"</td><td>"+j.pos+"</td><td class='n'>"+j.nivel+"</td><td class='n'>"+Math.round(j.forma||0)+"</td>";
      tr.style.cursor="pointer";
      tr.onclick=()=>fichaJugador(j);
      tbO.appendChild(tr);
    });
    tOnce.appendChild(tbO); pOnce.cuerpo.appendChild(tOnce);
    const bp=el("button","btn-aqua ancho verde",(typeof T==="function"?T("pla_ir_pizarra","Ir a la previa / pizarra"):"Ir a la previa / pizarra"));
    bp.onclick=()=>{
      const part=typeof proximoPartido==="function"?proximoPartido():null;
      if(part && typeof pantallaPrevia==="function") pantallaPrevia(part);
      else if(typeof aviso==="function") aviso(typeof T==="function"?T("pla_sinpart","No hay partido para armar la pizarra."):"No hay partido para armar la pizarra.");
    };
    pOnce.cuerpo.appendChild(bp);
  } else {
    pOnce.cuerpo.appendChild(el("p","mini",(typeof T==="function"?T("pla_sinpart","No hay partido para armar la pizarra."):"No hay once disponible.")));
  }
  v.appendChild(pOnce);
  const p=panel("Plantel "+E.anio,"👥");
  p.cuerpo.appendChild(el("p","mini","● nombre documentado. Sin punto: cantera / relleno. Stats estimadas."));
  const f=el("div","fichas cinta-agua");
  [["todos","Todos"],["ARQ","Arqueros"],["DEF","Defensas"],["VOL","Volantes"],["DEL","Delanteros"],["real","Documentados"],["fondo","Cantera"]].forEach(([k,n])=>{
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",PLANTEL_FILT===k?"true":"false");
    b.onclick=()=>{ PLANTEL_FILT=k; irA("plantel"); };
    f.appendChild(b);
  });
  p.cuerpo.appendChild(f);
  const t=el("table","tabla-plantel tabla-full");
  t.innerHTML="<thead><tr><th>Jugador</th><th>Pos</th><th>Rol</th><th class='n'>Ed</th><th class='n'>Niv</th><th class='n'>For</th><th class='n'>Can</th><th class='n'>Gol</th><th class='n'>Sueldo</th></tr></thead>";
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
    const can=Math.round(j.cansancio||0);
    if(can>=18) tr.className="cans-alto";
    else if(can>=10) tr.className="cans-medio";
    tr.innerHTML="<td>"+(j.real?"● ":"")+(typeof escHtml==="function"?escHtml(j.n):j.n)+(j.lesion>0?" 🩹":"")+(j.cedido?" 🔄":"")+"</td><td>"+j.pos+"</td><td class='mini'>"+rol+"</td><td class='n'>"+j.edad+
      "</td><td class='n'>"+j.nivel+"</td><td class='n'>"+Math.round(j.forma)+"</td>"+
      (typeof celdaCans==="function"?celdaCans(j):("<td class='n'>"+can+"</td>"))+
      "<td class='n'>"+j.goles+"</td><td class='n'>"+plata(j.sueldo)+"</td>";
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
    c.appendChild(fila("Cansancio",Math.round(j.cansancio||0)+((j.cansancio||0)>=18?" · piernas pesadas":((j.cansancio||0)>=10?" · un poco cargado":" · fresco"))));
    c.appendChild(fila("Sueldo anual",plata(j.sueldo)));
    c.appendChild(fila("Valor estimado",plata(j.valor)));
    c.appendChild(fila("Minutos en la temporada",(j.minutosTemporada||0)+"' en "+(j.partidos||0)+" partidos"+(j.pie?" · pie "+j.pie:"")));
    c.appendChild(fila("Contrato",typeof etqContrato==="function"?etqContrato(j):("hasta "+j.contrato.hasta)));
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
      const bch=el("button","btn-aqua chico","Hablar y apoyar");
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
/* 7.997 · repetición: relato, stats, árbitro, goles con minuto */
function modalRepeticion(c){
  modal(box=>{
    const gano=c.gf>c.gc, emp=c.gf===c.gc;
    const faseEtq=c.fase==="clausura"?"Clausura":(c.fase==="apertura"?"Apertura":(c.tipo==="copa"?"Copa · "+(c.ronda||""):"Fecha "+(c.fecha||"—")));
    box.innerHTML="";
    const cc=(typeof montarBarraSO==="function")
      ? montarBarraSO(box,"Repetición · "+faseEtq,"🎞️",function(){ cerrarModal(); })
      : (function(){ box.appendChild(el("div","cab",'<span class="ic">🎞️</span><span>Repetición · '+faseEtq+'</span>')); const x=el("div","cuerpo"); box.appendChild(x); return x; })();
    const marc=el("div","marcador");
    marc.innerHTML='<div class="eq">'+escHtml(c.local?E.clubNombre:c.rivalNombre)+'</div>'+
      '<div class="go">'+(c.local?c.gf+" - "+c.gc:c.gc+" - "+c.gf)+'</div>'+
      '<div class="eq">'+escHtml(c.local?c.rivalNombre:E.clubNombre)+'</div>';
    cc.appendChild(marc);
    cc.appendChild(el("p","mini",(c.local?"De local":"De visita")+" en "+(c.sede||"—")+" · "+fechaTxt(c.f)+" · "+
      (gano?"Victoria":(emp?"Empate":"Derrota"))+
      (c.torneo?" · "+c.torneo:"")+
      (c.arbitro&&c.arbitro.n?" · Árbitro: "+c.arbitro.n+(c.arbitro.estilo?" ("+c.arbitro.estilo+")":""):"")+"."));
    if(c.stats && typeof bloqueStats==="function"){
      cc.appendChild(bloqueStats({stats:c.stats, part:c}));
    }
    const gd=(c.golesDetalle||[]).slice().sort((a,b)=>(a.min||0)-(b.min||0));
    if(gd.length){
      cc.appendChild(el("h3","sub","⚽ Goles"));
      gd.forEach(g=>{
        cc.appendChild(el("div","fila","<span>"+(g.min||"?")+"' "+(g.propio?"":"("+(c.rivalNombre||"rival")+") ")+(g.quien||"?")+
          (g.tipo&&g.tipo!=="jugada"?" <span class='mini'>["+g.tipo+"]</span>":"")+
          (g.asist?" <span class='mini'>(asist. "+g.asist+")</span>":"")+"</span>"));
      });
    } else {
      const gs=c.goleadores||[];
      if(gs.length){
        const cuenta={}; gs.forEach(n=>{ cuenta[n]=(cuenta[n]||0)+1; });
        cc.appendChild(el("h3","sub","⚽ Goles de "+E.clubNombre));
        Object.keys(cuenta).forEach(n=>{
          cc.appendChild(el("div","fila","<span>"+n+"</span><b>"+(cuenta[n]>1?cuenta[n]+" goles":"1 gol")+"</b>"));
        });
      } else {
        cc.appendChild(el("p","mini",c.gf>0?"No quedó registro de los goleadores de este partido.":"Tu equipo no marcó en este partido."));
      }
    }
    if(c.tarjetas&&c.tarjetas.length) cc.appendChild(el("p","mini","Amarillas: "+c.tarjetas.join(", ")));
    if(c.lesionados&&c.lesionados.length) cc.appendChild(el("p","mini","Lesionados: "+c.lesionados.join(", ")));
    const rel=c.lineas||[];
    if(rel.length){
      cc.appendChild(el("h3","sub","🎙️ Relato"));
      const caja=el("div","relato relato-rep");
      rel.forEach(l=>{
        caja.appendChild(el("div","rel "+(l.c||""),'<span class="m">'+(l.m||0)+"'</span><span>"+(l.t||"")+"</span>"));
      });
      cc.appendChild(caja);
    }
    const tw=(c.ticker||[]).filter(t=>t&&t.texto);
    if(tw.length){
      cc.appendChild(el("h3","sub","📣 Desde la grada"));
      tw.forEach(t=>{
        cc.appendChild(el("div","rep-ticker","<b>"+(t.autor||"@hincha")+"</b> "+t.texto));
      });
    }
    if(c.real) cc.appendChild(el("div","resul mitad","<b>En la historia real:</b> ese partido terminó "+c.real+"."));
    const b=el("button","btn-aqua ancho gris","Cerrar"); b.onclick=cerrarModal; cc.appendChild(b);
  },{clase:"ventana-so"});
}
/* 7.71 · Recorrido de copa(s) del año, ronda por ronda, con global y estado.
   Todo se deriva del calendario + E.flags.copaAcum + copaCampeon (Copa Chile incluida). */
function panelCopas(v){
  const copaMatches=(E.calendario||[]).filter(p=>p.tipo==="copa");
  if(!copaMatches.length){
    const why=(typeof esEraHardcode==="function" && !esEraHardcode(E.eraBase))
      ?"La copa de esta liga se arma con el calendario. Si no aparece, arranca una partida nueva."
      :(E.eraBase==="2026c")
      ?"En 2026 la Segunda no juega Copa Chile (bases ANFP). Tampoco hay cupo CONMEBOL por esta categoría. Igual el resto del país las juega: las ves abajo."
      :(E.eraBase===1925)
        ?"1925 es amateur: no hay Copa Chile ni Libertadores."
        :"Este año no hay copas en TU calendario (todavía no clasificas, o el formato de la época no las arma). El resto del país sí las juega: abajo está el cuadro.";
    const pc=panel("Copas del año","🏆");
    pc.cuerpo.appendChild(el("p","mini",why));
    v.appendChild(pc);
  } else {
  /* agrupar por torneo, preservando el orden de aparición */
  const torneos=[], porTorneo={};
  copaMatches.forEach(m=>{ const t=m.torneo||"Copa"; if(!porTorneo[t]){ porTorneo[t]=[]; torneos.push(t); } porTorneo[t].push(m); });
  const acum=(E.flags&&E.flags.copaAcum)||{};
  const campeonTorneo=E.flags&&E.flags.copaCampeon?(E.flags.copaCampeonTorneo||null):null;
  torneos.forEach(t=>{
    const ms=porTorneo[t];
    const jugados=ms.filter(m=>m.jugado);
    const esCampeon=(campeonTorneo===t);
    const icono=/Chile/i.test(t)?"🇨🇱":(/Libertadores/i.test(t)?"🏆":(/Sudamericana/i.test(t)?"🥈":"🏆"));
    const pc=panel(icono+" "+t,"🏆",esCampeon?"agua":"");
    if(esCampeon) pc.cuerpo.appendChild(el("div","resul bien","<b>🏆 ¡CAMPEÓN!</b> "+E.clubNombre+" levantó "+t+" "+E.anio+". Quedó en la vitrina."));
    /* rondas en orden */
    const rondas=[], porRonda={};
    ms.forEach(m=>{ const r=m.ronda||"Fase"; if(!porRonda[r]){ porRonda[r]=[]; rondas.push(r); } porRonda[r].push(m); });
    rondas.forEach(r=>{
      const partidos=porRonda[r];
      const jug=partidos.filter(x=>x.jugado);
      const ac=acum[r];
      const cab=el("div","cr-ronda");
      let estado="";
      if(jug.length===partidos.length){
        if(ac){ const gd=ac.gf-ac.gc; estado=esCampeon&&r==="FINAL"?"🏆 título":(gd>0?"✓ avanza":(gd===0?"= definió":"✗ eliminado")); }
      } else estado="· en curso";
      cab.innerHTML='<b>'+r+'</b>'+(ac?' <span class="mini">global '+ac.gf+'-'+ac.gc+'</span>':'')+(estado?' <span class="mini">'+estado+'</span>':'');
      pc.cuerpo.appendChild(cab);
      partidos.forEach(m=>{
        const marc=m.jugado?(m.gf+"-"+m.gc):"—";
        const est=m.jugado?(m.gf>m.gc?"ok":(m.gf<m.gc?"mal":"neu")):"neu";
        const _ec=(typeof escudoChip==="function")?escudoChip(m.rivalId):"";
        const fila=el("div","fila"+(m.jugado?" fila-click":""));
        fila.innerHTML='<span>'+(m.local?"vs ":"a ")+_ec+escHtml(m.rivalNombre||"Rival")+' <span class="mini">'+fechaTxt(m.f)+(m.sede?" · "+escHtml(m.sede):"")+(m.jugado?" · ▶ ver repetición":"")+'</span></span><b class="etq '+est+'">'+marc+'</b>';
        if(m.jugado){ fila.style.cursor="pointer"; fila.onclick=()=>modalRepeticion(m); }
        pc.cuerpo.appendChild(fila);
      });
      if(/^Grupo /.test(r)){
        const letra=r.replace(/^Grupo\s+/i,"");
        let tabG=null;
        const torKey=/Sudamericana/i.test(t)?"sud":(/Libertadores/i.test(t)?"lib":(/Copa Chile/i.test(t)?"chile":(/Copa de la Liga/i.test(t)?"copaLiga":null)));
        if(/Libertadores|Sudamericana/i.test(t) && typeof tablaGrupoContinental==="function")
          tabG=tablaGrupoContinental(t, r, E.club);
        else if(/Copa Chile/i.test(t) && typeof tablaGrupoCopaChile==="function")
          tabG=tablaGrupoCopaChile(letra, E.club);
        else if(/Copa de la Liga/i.test(t) && typeof tablaGrupoCopaLiga==="function")
          tabG=tablaGrupoCopaLiga(letra, E.club);
        if(tabG&&tabG.length){
          const tg=el("table","tabla-liga tabla-mini");
          tg.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>Pts</th><th class='n'>DG</th></tr></thead>";
          const tgb=el("tbody");
          tabG.forEach((c,i)=>{
            const tr=el("tr",c.id===E.club?"yo":"");
            tr.innerHTML="<td class='n'>"+(i+1)+"</td><td>"+(c.n||c.id)+"</td><td class='n'>"+(c.pj||0)+"</td><td class='n'>"+(c.pts||0)+"</td><td class='n'>"+((c.gf||0)-(c.gc||0))+"</td>";
            tgb.appendChild(tr);
          });
          tg.appendChild(tgb);
          pc.cuerpo.appendChild(tg);
          pc.cuerpo.appendChild(el("p","mini","Tabla viva: solo lo jugado. El resto del grupo se llena ronda a ronda con la misma física Poisson. Nadie aparece con 6 PJ cuando tú tienes 1."));
        }
        /* 7.9022 · el otro hueco reportado: la tabla estaba, los partidos no.
           Se agrega el resto del grupo (sin repetir los tuyos, ya listados arriba). */
        if(torKey && typeof copaGrupoFixture==="function"){
          const fix=copaGrupoFixture(torKey, letra);
          const resto=fix.filas.filter(function(f){ return !f.mia; });
          if(resto.length){
            pc.cuerpo.appendChild(el("h3","sub",T("cop_resto_grupo","Resto del grupo")));
            resto.forEach(function(f){
              const marc=f.jugado?(f.ga+"-"+f.gb):"—";
              const est=f.jugado?(f.ga>f.gb?"ok":(f.ga<f.gb?"mal":"neu")):"neu";
              pc.cuerpo.appendChild(el("div","fila mini","<span>"+escHtml(f.nA)+" vs "+escHtml(f.nB)+"</span><b class='etq "+est+"'>"+marc+"</b>"));
            });
            if(fix.cerrado) pc.cuerpo.appendChild(el("p","mini",T("cop_sorteo_pendiente","Los grupos del país ya terminaron su fase. La fase eliminatoria del resto del país no está modelada; seguí las tablas de arriba.")));
          }
        }
      }
    });
    /* resumen abajo */
    const gTot=jugados.reduce((s,m)=>s+(m.gf||0),0), gcTot=jugados.reduce((s,m)=>s+(m.gc||0),0);
    const g=jugados.filter(m=>m.gf>m.gc).length, e=jugados.filter(m=>m.gf===m.gc).length, pe=jugados.filter(m=>m.gf<m.gc).length;
    pc.cuerpo.appendChild(el("p","mini","Recorrido: "+jugados.length+" jugados · "+g+"G "+e+"E "+pe+"P · goles "+gTot+":"+gcTot+
      (esCampeon?" · <b>Campeón</b> 🏆":(jugados.length&&!copaMatches.some(x=>x.torneo===t&&!x.jugado)?" · eliminado":" · en carrera"))));
    v.appendChild(pc);
  });
  }
  if(typeof panelCopasPais==="function") panelCopasPais(v);
}
/* 7.99952 · Copas del país aunque no las juegues: resultados + punteros. */
function panelCopasPais(v){
  if(!E || E.eraBase===1925) return;
  if(typeof esEraHardcode==="function" && !esEraHardcode(E.eraBase)){
    const nom=(typeof nombreCopaDomestica==="function")?nombreCopaDomestica(E.eraBase):"la copa";
    const pc=panel("Copas de esta liga","🌎","agua");
    pc.cuerpo.appendChild(el("p","mini",nom+" se juega en tu calendario, con los clubes de esta liga. No es la Copa Chile."));
    v.appendChild(pc);
    return;
  }
  if(!E.mundo && typeof mundoInit==="function"){ try{ mundoInit(); }catch(e){} }
  const pc=panel("Copas del país · se juegan igual","🌎","agua");
  pc.cuerpo.appendChild(el("p","mini","Aunque no clasificaste, las copas corren. Tablas vivas arriba (Mundo). Acá, los últimos partidos y quién manda en cada cuadro."));
  if(E.eraBase==="2026c") pc.cuerpo.appendChild(el("p","mini","Segunda 2026 no entra a Copa Chile (bases ANFP). El cuadro de Primera y B igual se ve."));
  const pais=((E.mundo&&E.mundo.pais)||[]).filter(function(x){
    return x&&x.liga&&/copa|libertadores|sudamericana|conmebol|argentina/i.test(x.liga);
  }).slice(-14).reverse();
  if(pais.length){
    pc.cuerpo.appendChild(el("h3","sub","Últimos partidos de copa"));
    pais.forEach(function(x){
      pc.cuerpo.appendChild(el("div","fila","<span><span class='mini'>"+x.liga+" · </span>"+x.a+" vs "+x.b+"</span><b>"+x.ga+"-"+x.gb+"</b>"));
    });
  } else {
    pc.cuerpo.appendChild(el("p","mini","Todavía no se jugó una fecha de copa en el país. Avanzá o jugá la tuya y acá se llena."));
  }
  /* 7.9022 · el hueco que reportó el autor: acá SOLO se veía lo jugado.
     Ahora también se ve lo que viene, con "—" como ya hace panelCopas. */
  if(typeof copasPaisProximos==="function"){
    const viene=copasPaisProximos(6);
    if(viene.length){
      pc.cuerpo.appendChild(el("h3","sub",T("cop_viene","Cruces que vienen en el país")));
      viene.forEach(function(x){
        pc.cuerpo.appendChild(el("div","fila","<span><span class='mini'>"+escHtml(x.liga)+" · </span>"+escHtml(x.a)+" vs "+escHtml(x.b)+"</span><b class='etq neu'>—</b>"));
      });
    } else if(typeof copasPaisConPendientes==="function" && !copasPaisConPendientes()){
      pc.cuerpo.appendChild(el("p","mini",T("cop_sorteo_pendiente","Los grupos del país ya terminaron su fase. La fase eliminatoria del resto del país no está modelada; seguí las tablas de arriba.")));
    }
  }
  if(E.mundo&&E.mundo.copas){
    const bits=[];
    const ch=E.mundo.copas.chile;
    if(ch&&ch.grupos&&typeof mundoFilasCopa==="function"){
      const letras=Object.keys(ch.grupos);
      const lead=[];
      letras.forEach(function(L){
        const fil=mundoFilasCopa("chile",L);
        if(fil&&fil[0]&&fil[0].pj>0) lead.push("G"+L+" "+(fil[0].n||fil[0].id));
      });
      if(lead.length) bits.push("Copa Chile · punteros: "+lead.slice(0,4).join(" · ")+(lead.length>4?"…":""));
    }
    const cl=E.mundo.copas.copaLiga;
    if(cl&&cl.grupos&&typeof mundoFilasCopa==="function"){
      const lead=[];
      Object.keys(cl.grupos).forEach(function(L){
        const fil=mundoFilasCopa("copaLiga",L);
        if(fil&&fil[0]&&fil[0].pj>0) lead.push("G"+L+" "+(fil[0].n||fil[0].id));
      });
      if(lead.length) bits.push("Copa de la Liga · 1° de grupo: "+lead.join(" · "));
    }
    bits.forEach(function(t){ pc.cuerpo.appendChild(el("p","mini",t)); });
  }
  const argP=E.mundo&&E.mundo.copas&&E.mundo.copas.arg;
  if(argP&&argP.partidos&&argP.partidos.length && (E.anio||0)>=2026){
    const ult=argP.partidos.slice(-6).reverse();
    pc.cuerpo.appendChild(el("h3","sub","🇦🇷 Copa Argentina"));
    pc.cuerpo.appendChild(el("p","mini","Se juega en el mismo mundo. Cruces documentados (sorteo 10 dic 2025)."));
    ult.forEach(function(x){
      pc.cuerpo.appendChild(el("div","fila","<span><span class='mini'>"+(x.ronda||"")+" · </span>"+x.a+" vs "+x.b+"</span><b>"+x.ga+"-"+x.gb+"</b>"));
    });
  }
  v.appendChild(pc);
}
/* 7.74 · AMISTOSOS jugables (pretemporada / cuando quieras). No cuentan para la
   tabla ni gastan la semana: rueda minutos, sube forma y deja taquilla si eres local. */
function jugarAmistoso(rivalId){
  const m=(typeof clubMapaTodos==="function")?clubMapaTodos():{};
  const riv=m[rivalId]||CLUB_POR_ID[rivalId];
  if(!riv){ aviso("No encontré ese rival"); return; }
  const local=Math.random()<0.6;
  const yoEst=(CLUB_POR_ID[E.club]&&CLUB_POR_ID[E.club].est)||"tu estadio";
  const prox=(typeof proximoPartido==="function"&&proximoPartido());
  const fmes=(prox&&prox.f&&prox.f.m)||6;
  const part={ tipo:"amistoso", amistoso:true, rivalId:rivalId, rivalNombre:riv.n||riv.c||rivalId,
    fuerzaRival:(riv.fuerza||55), local:local, sede:local?yoEst:(riv.est||"cancha neutral"),
    f:{m:fmes,d:15}, clima:"despejado", jugado:false, torneo:"Amistoso" };
  if(typeof cerrarModal==="function") cerrarModal();
  SEC="partido";
  if(typeof pantallaPrevia==="function") pantallaPrevia(part);
}
function modalAmistoso(){
  if(!E||!E.club){ aviso("Primero entra a un club"); return; }
  const m=(typeof clubMapaTodos==="function")?clubMapaTodos():{};
  const ids=Object.keys(m).filter(id=>id!==E.club);
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">🤝</span><span>Elegir rival de amistoso</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p","mini","Un amistoso contra quien quieras (de cualquier división). No cuenta para la tabla ni gasta la semana: sirve para rodar minutos y subir la forma."));
    const inp=el("input","pick-buscar"); inp.type="search"; inp.placeholder="Buscar club o ciudad…"; inp.style.marginBottom="8px"; c.appendChild(inp);
    const grid=el("div","iconos"); c.appendChild(grid);
    const pinta=()=>{
      grid.innerHTML="";
      const q=(inp.value||"").trim().toLowerCase();
      let vis=ids.map(id=>({id:id,c:m[id]})).filter(x=>x.c && (!q || (x.c.n||"").toLowerCase().indexOf(q)>=0 || (x.c.ciudad||"").toLowerCase().indexOf(q)>=0));
      vis=vis.sort((a,b)=>(b.c.fuerza||0)-(a.c.fuerza||0)).slice(0,60);
      vis.forEach(x=>{
        const esc=(typeof escudoHTML==="function")?escudoHTML(x.id,30,x.c.esc||"⚪"):(x.c.esc||"⚪");
        const b=el("button","icono",'<span class="g">'+esc+'</span><span class="n">'+(x.c.n||x.id)+'</span>'+(x.c.ciudad?'<span class="ciu">'+x.c.ciudad+'</span>':''));
        b.onclick=()=>jugarAmistoso(x.id);
        grid.appendChild(b);
      });
      if(!vis.length) grid.appendChild(el("p","mini","Nada con esa búsqueda."));
    };
    inp.oninput=pinta; pinta();
  });
}
function filaCalendario(c,i){
  const d=el("div","fila"+(c.jugado?" fila-click":""));
  const marc=c.jugado?(c.gf+"-"+c.gc):"—";
  const est=c.jugado?(c.gf>c.gc?"ok":(c.gf<c.gc?"mal":"neu")):"neu";
  const _ecal=(typeof escudoChip==="function")?escudoChip(c.rivalId):"";
  const faseTxt=c.fase==="clausura"?" · Clausura":(c.fase==="apertura"?" · Apertura":"");
  d.innerHTML='<span>'+(i===E.idx?"▶ ":"")+(c.tipo==="copa"?"🏆 ":"")+
    (c.local?"vs ":"a ")+_ecal+escHtml(c.rivalNombre)+' <span class="mini">'+fechaTxt(c.f)+
    (c.tipo==="copa"?" · "+c.ronda:"")+faseTxt+(c.fecha?" · F"+c.fecha:"")+
    (c.jugado?" · ▶ ver repetición":"")+
    (!c.jugado&&c.real&&E.config&&E.config.spoiler?" · hist. "+c.real:"")+'</span></span>'+
    '<b class="etq '+est+'">'+marc+'</b>';
  if(c.jugado){ d.style.cursor="pointer"; d.onclick=()=>modalRepeticion(c); }
  return d;
}
function _nomPo06(id){
  if(!id) return "—";
  if(typeof _nom06==="function") return _nom06(id);
  const c=(typeof clubLookup==="function"&&clubLookup(id))||{};
  return c.c||c.n||id;
}
function _lineaLlave06(ll){
  if(!ll) return "";
  if(ll.pendiente) return _nomPo06(ll.mejor)+" vs "+_nomPo06(ll.peor)+" · se juega";
  if(ll.ida && ll.vue){
    const a=_nomPo06(ll.localIda||ll.peor), b=_nomPo06(ll.localVue||ll.mejor);
    return a+" "+ll.ida[0]+"-"+ll.ida[1]+" · "+b+" "+ll.vue[0]+"-"+ll.vue[1]+(ll.pens?" · penales":"");
  }
  if(ll.mejor&&ll.peor) return _nomPo06(ll.mejor)+" vs "+_nomPo06(ll.peor);
  return "";
}
function panelCuadro2006(v, st, titulo){
  if(!st||!v) return;
  const p=panel(titulo||"Cuadro de playoffs","🌳","agua");
  p.cuerpo.appendChild(el("p","mini","Aunque no estés en una llave, el cuadro es de todo el país. Sin goles de visita."));
  if(st.repechaje&&st.repechaje.length){
    p.cuerpo.appendChild(el("h3","sub","Repechaje"));
    (st.repechaje||[]).forEach(r=>{
      const g=(st.repGanadores||[]).filter(x=>x===r.local||x===r.visita)[0];
      p.cuerpo.appendChild(el("div","fila","<span>"+_nomPo06(r.local)+" vs "+_nomPo06(r.visita)+"</span><b>"+(g?("pasa "+_nomPo06(g)):"—")+"</b>"));
    });
  }
  [["cuartos","Cuartos"],["semis","Semifinal"],["final","Final"]].forEach(par=>{
    const arr=(st.llaves&&st.llaves[par[0]])||[];
    if(!arr.length) return;
    p.cuerpo.appendChild(el("h3","sub",par[1]));
    arr.forEach(ll=>{
      p.cuerpo.appendChild(el("div","fila","<span>"+_lineaLlave06(ll)+"</span><b>"+(ll.gana?_nomPo06(ll.gana):(ll.pendiente?"en juego":"—"))+"</b>"));
    });
  });
  if(st.campeon) p.cuerpo.appendChild(el("div","resul bien","Campeón: <b>"+_nomPo06(st.campeon)+"</b>"));
  v.appendChild(p);
}
function vistaCalendario(){
  const v=$("#vista");
  const partProx=typeof proximoPartido==="function"?proximoPartido():null;
  const px=panel((typeof T==="function"?T("cal_prox","Próximo compromiso"):"Próximo compromiso"),"📌",partProx&&partProx.tipo==="copa"?"agua":"");
  if(partProx){
    px.cuerpo.appendChild(el("h2","tit",(partProx.local?"":"@ ")+(partProx.rivalNombre||"—")));
    px.cuerpo.appendChild(el("p","mini",(partProx.local?"De local":"De visita")+
      " · "+(typeof etqCompromiso==="function"?etqCompromiso(partProx):(partProx.tipo==="copa"?(partProx.torneo||"Copa"):"fecha "+(partProx.fecha||"")))+
      (typeof fechaTxt==="function"&&partProx.f?" · "+fechaTxt(partProx.f):"")+
      (partProx.sede?" · "+partProx.sede:"")));
    const b=el("button","btn-aqua ancho verde",(typeof T==="function"?T("cal_ir","Ir al partido"):"Ir al partido"));
    b.onclick=()=>{ if(typeof bloqueoDecisiones==="function"&&bloqueoDecisiones()) return; if(typeof pantallaPrevia==="function") pantallaPrevia(partProx); };
    px.cuerpo.appendChild(b);
  } else {
    px.cuerpo.appendChild(el("p","mini",(typeof T==="function"?T("cal_sinprox","No hay más partidos este año."):"No hay más partidos este año.")));
  }
  /* 7.9013 · pulso de la temporada: cuánto llevas y qué se viene, con el puesto del rival */
  const _jug=(E.calendario||[]).filter(c=>c.jugado).length, _tot=(E.calendario||[]).length;
  if(_tot){
    px.cuerpo.appendChild(el("p","mini",T("cal_prog","Temporada")+" "+E.anio+" · <b>"+_jug+"</b> "+T("cal_de","de")+" <b>"+_tot+"</b>"));
    px.cuerpo.appendChild(el("div",null,barrita(_jug,"#2f7dd0",_tot)));
  }
  const _sig=(E.calendario||[]).filter(c=>!c.jugado);
  const _resto=_sig.filter(function(c,i){ return partProx?i>0:true; }).slice(0,3);
  if(_resto.length){
    px.cuerpo.appendChild(el("h3","sub",T("cal_sig","Lo que viene")));
    const _ord=(typeof tablaOrdenada==="function")?tablaOrdenada():[];
    _resto.forEach(function(c){
      const i=c.rivalId?_ord.findIndex(function(x){ return x.id===c.rivalId; }):-1;
      const pos=(i>=0&&E.tabla[c.rivalId]&&(E.tabla[c.rivalId].pj||0)>0)?(" · "+ordinal(i+1)):"";
      px.cuerpo.appendChild(el("div","fila mini cal-prox-fila",
        "<span>"+(c.local?"":"@ ")+escHtml(c.rivalNombre||"—")+pos+"</span><b>"+
        (typeof fechaTxt==="function"&&c.f?fechaTxt(c.f):(c.fecha?("f "+c.fecha):""))+"</b>"));
    });
  }
  v.appendChild(px);
  if(E.eraBase===2006){
    const ape=panel("Calendario · Apertura 2006","📅");
    E.calendario.forEach((c,i)=>{ if(c.tipo==="liga"&&(c.fase==="apertura"||!c.fase)) ape.cuerpo.appendChild(filaCalendario(c,i)); });
    v.appendChild(ape);
    const poA=(E.calendario||[]).filter(c=>c.torneo==="Playoffs Apertura 2006");
    if(poA.length){
      const ppo=panel("Playoffs Apertura 2006","🏆","agua");
      ppo.cuerpo.appendChild(el("p","mini","Repechaje a partido único. Cuartos, semis y final ida y vuelta. Sin goles de visita: el global empatado se va a penales. El regular no entrega estrella."));
      E.calendario.forEach((c,i)=>{ if(c.torneo==="Playoffs Apertura 2006") ppo.cuerpo.appendChild(filaCalendario(c,i)); });
      const camp=(E.flags&&E.flags.campeonApertura2006)||(E.flags&&E.flags.playoff2006&&E.flags.playoff2006.rueda==="apertura"&&E.flags.playoff2006.campeon);
      if(camp) ppo.cuerpo.appendChild(el("div","resul bien","Campeón: <b>"+(typeof _nom06==="function"?_nom06(camp):camp)+"</b>"));
      v.appendChild(ppo);
    }
    const stA=(E.flags&&E.flags.cuadroApertura2006)||(E.flags&&E.flags.playoff2006&&E.flags.playoff2006.rueda==="apertura"&&E.flags.playoff2006);
    if(stA) panelCuadro2006(v, stA, "Cuadro Apertura 2006");
    if(E.calendario.some(c=>c.tipo==="liga"&&c.fase==="clausura")){
      const cla=panel("Calendario · Clausura 2006","📅","agua");
      E.calendario.forEach((c,i)=>{ if(c.tipo==="liga"&&c.fase==="clausura") cla.cuerpo.appendChild(filaCalendario(c,i)); });
      v.appendChild(cla);
    }
    const poC=(E.calendario||[]).filter(c=>c.torneo==="Playoffs Clausura 2006");
    if(poC.length){
      const ppc=panel("Playoffs Clausura 2006","🏆","agua");
      ppc.cuerpo.appendChild(el("p","mini","Misma modalidad que el Apertura: repechaje, cuartos, semis, final. Sin goles de visita."));
      E.calendario.forEach((c,i)=>{ if(c.torneo==="Playoffs Clausura 2006") ppc.cuerpo.appendChild(filaCalendario(c,i)); });
      v.appendChild(ppc);
    }
    const stC=(E.flags&&E.flags.cuadroClausura2006)||(E.flags&&E.flags.playoff2006&&E.flags.playoff2006.rueda==="clausura"&&E.flags.playoff2006);
    if(stC) panelCuadro2006(v, stC, "Cuadro Clausura 2006");
    const otros06=(E.calendario||[]).filter(c=>c.tipo!=="liga"&&c.torneo!=="Playoffs Apertura 2006"&&c.torneo!=="Playoffs Clausura 2006");
    if(otros06.length){
      const po=panel("Otros compromisos "+E.anio,"📅");
      E.calendario.forEach((c,i)=>{ if(c.tipo!=="liga"&&c.torneo!=="Playoffs Apertura 2006"&&c.torneo!=="Playoffs Clausura 2006") po.cuerpo.appendChild(filaCalendario(c,i)); });
      v.appendChild(po);
    }
  } else {
    const ligaN=(typeof ERA==="object"&&ERA[E.eraBase]&&ERA[E.eraBase].n)||"";
    const p=panel("Calendario "+E.anio+(ligaN?" · "+ligaN:""),"📅");
    E.calendario.forEach((c,i)=>p.cuerpo.appendChild(filaCalendario(c,i)));
    v.appendChild(p);
  }
  if(E.ultimaFecha&&E.ultimaFecha.length){
    const pr=panel("Resto de la fecha","⚽");
    E.ultimaFecha.forEach(x=>{
      pr.cuerpo.appendChild(el("div","fila","<span>"+x.a+" vs "+x.b+"</span><b>"+x.ga+"-"+x.gb+"</b>"));
    });
    pr.cuerpo.appendChild(el("p","mini","Se simula con la fuerza de cada club. Los cruce oficiales (CC/UCH/UC) se respetan; el resto es emparejamiento fijo de la fecha."));
    /* 7.9011 · quién subió y quién bajó con esta fecha + repetirla en vivo */
    const _mv=(E.ultimaJornada&&E.ultimaJornada.mov)||[];
    if(_mv.length){
      pr.cuerpo.appendChild(el("h3","sub",T("jor_tabla","Cómo quedó la tabla")));
      _mv.slice(0,6).forEach(function(m){
        const d=m.de-m.a;
        pr.cuerpo.appendChild(el("div","fila mini","<span>"+escHtml(m.n)+"</span><b class='jor-mov "+(d>0?"sube":"baja")+"'>"+
          (d>0?"▲":"▼")+" "+ordinal(m.de)+" → "+ordinal(m.a)+"</b>"));
      });
    }
    if(typeof jornadaEnVivo==="function"&&E.ultimaJornada){
      const brj=el("button","btn-aqua chico","📻 "+T("jor_repetir","Repetir la fecha"));
      brj.onclick=function(){ jornadaEnVivo(function(){ irA("calendario"); }); };
      pr.cuerpo.appendChild(brj);
    }
    v.appendChild(pr);
  }
  /* 7.71 · Copa(s) del año con TODO el detalle: por torneo, ronda por ronda,
     resultado, global de la llave y estado (avanza / eliminado / CAMPEÓN). */
  panelCopas(v);
  /* 7.74 · amistosos: jugá uno cuando quieras (pretemporada / poner a punto la forma) */
  const pa=panel("🤝 Amistosos","🤝","agua");
  pa.cuerpo.appendChild(el("p","mini","Un partido amistoso contra el rival que elijas. No cuenta para la tabla ni gasta la semana: rueda minutos y sube la forma del plantel."));
  const ba=el("button","btn-aqua ancho verde","🤝 Jugar un amistoso");
  ba.onclick=()=>{ if(typeof modalAmistoso==="function") modalAmistoso(); };
  pa.cuerpo.appendChild(ba);
  v.appendChild(pa);

  const _clubesTabla=(typeof clubesLigaActual==="function")?clubesLigaActual():LIGA_ACT;
  const _esSeg=(E.eraBase==="2026c");
  const _zTxt=_esSeg&&typeof zonaSegDe==="function"&&typeof nombreZona==="function"?(" · Zona "+nombreZona(zonaSegDe(E.club))):"";
  const _fase06=E.eraBase===2006&&E.flags&&E.flags.fase2006;
  const _titTabla=_fase06==="clausura"||_fase06==="playoffClausura"?"Tabla · Clausura 2006":(_fase06==="apertura"||_fase06==="playoffApertura"?"Tabla · Apertura 2006":"Tabla de posiciones"+_zTxt);
  const pt=panel(_titTabla,"📊","agua");
  const arr=_clubesTabla.map(c=>Object.assign({id:c.id,n:c.n},E.tabla[c.id]||{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}));
  arr.sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc));
  const t=el("table","tabla-liga");
  t.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>G</th><th class='n'>E</th><th class='n'>P</th><th class='n'>GF</th><th class='n'>GC</th><th class='n'>Pts</th></tr></thead>";
  const tb=el("tbody");
  arr.forEach((c,i)=>{
    const tr=el("tr",c.id===E.club?"yo":"");
    const _ec=(typeof escudoChip==="function")?escudoChip(c.id):"";
    tr.innerHTML="<td class='n'>"+(i+1)+"</td><td>"+_ec+c.n+"</td><td class='n'>"+c.pj+"</td><td class='n'>"+c.pg+
      "</td><td class='n'>"+c.pe+"</td><td class='n'>"+c.pp+"</td><td class='n'>"+c.gf+"</td><td class='n'>"+c.gc+"</td><td class='n'>"+c.pts+"</td>";
    tb.appendChild(tr);
  });
  t.appendChild(tb); pt.cuerpo.appendChild(t);
  const _eraObj=((typeof eraDe==="function"?eraDe(E.eraBase):ERA[E.eraBase])||ERA[2026]);
  pt.cuerpo.appendChild(el("p","mini","Época "+_eraObj.n+": la victoria vale "+_eraObj.puntosVictoria+" puntos. "+
    (_esSeg?("Zona de "+arr.length+" clubes (Norte/Sur, 12 PJ + 2 byes). Top 3 de cada zona van a la liguilla de ascenso de 7 (ida y vuelta, se parte de 0; el 1° sube a la B). Los 4°s se cruzan. Bottom 3, liguilla de permanencia. Volver a cruzar rivales de tu zona en la liguilla es el formato real.")
    :(E.eraBase===2006
      ?(_fase06==="clausura"
        ?"Clausura 2006: tabla desde 0 (18 fechas, localías invertidas). El título se define en playoffs (repechaje + cuartos/semis/final). Descenso: tabla anual."
        :(_fase06==="playoffApertura"||_fase06==="playoffClausura"
          ?"Playoffs 2006: 8 clubes. Repechaje a partido (empate → más pts de la regular). Llaves ida y vuelta, sin goles de visita, penales si empata el global."
          :"Apertura 2006: 18 fechas (bye) + 4 grupos. Al terminar, playoffs estilo México por el título. El regular no entrega estrella."))
      :("Campeonato de "+LIGA_ACT.length+" equipos.")))));
  v.appendChild(pt);
  if(E.eraBase===2006 && typeof filasGrupo2006==="function"){
    const ruedaG=(_fase06==="clausura"||_fase06==="playoffClausura")?"clausura":"apertura";
    const pg=panel("Grupos "+(ruedaG==="clausura"?"Clausura":"Apertura")+" 2006","🔠");
    pg.cuerpo.appendChild(el("p","mini","La fase regular es todos contra todos. Los grupos solo ordenan quién entra a playoffs: 2 mejores de cada uno. Si un 3° trae más puntos que un 2° de otro grupo, hay repechaje. Fuente: Wikipedia 17 sep 2026."));
    ["A","B","C","D"].forEach(letra=>{
      const fil=filasGrupo2006(letra, ruedaG, E.tabla)||[];
      if(!fil.length) return;
      pg.cuerpo.appendChild(el("h3","sub","Grupo "+letra));
      const tg=el("table","tabla-liga tabla-mini");
      tg.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>Pts</th><th class='n'>PJ</th><th class='n'>DG</th></tr></thead>";
      const tgb=el("tbody");
      fil.forEach((c,i)=>{
        const tr=el("tr",c.id===E.club?"yo":"");
        const _ec=(typeof escudoChip==="function")?escudoChip(c.id):"";
        tr.innerHTML="<td class='n'>"+(i+1)+"</td><td>"+_ec+(c.c||c.n||c.id)+"</td><td class='n'>"+(c.pts||0)+"</td><td class='n'>"+(c.pj||0)+"</td><td class='n'>"+((c.gf||0)-(c.gc||0))+"</td>";
        tgb.appendChild(tr);
      });
      tg.appendChild(tgb); pg.cuerpo.appendChild(tg);
    });
    v.appendChild(pg);
  }
  if(E.eraBase===2006 && typeof tablaAnual2006==="function" && E.tablaApertura){
    const anual=tablaAnual2006();
    if(anual&&anual.length){
      const panAnual=panel("Tabla anual 2006 (Apertura + Clausura)","📉");
      panAnual.cuerpo.appendChild(el("p","mini","Suma de las dos ruedas. En 2006 bajó Santiago Morning por esta tabla; Rangers y Palestino fueron a promoción. El título de cada rueda se juega en playoffs."));
      const ta=el("table","tabla-liga");
      ta.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>G</th><th class='n'>E</th><th class='n'>P</th><th class='n'>GF</th><th class='n'>GC</th><th class='n'>Pts</th></tr></thead>";
      const tba=el("tbody");
      anual.forEach((c,i)=>{
        const tr=el("tr",c.id===E.club?"yo":"");
        const _ec=(typeof escudoChip==="function")?escudoChip(c.id):"";
        tr.innerHTML="<td class='n'>"+(i+1)+"</td><td>"+_ec+(c.n||c.id)+"</td><td class='n'>"+(c.pj||0)+"</td><td class='n'>"+(c.pg||0)+
          "</td><td class='n'>"+(c.pe||0)+"</td><td class='n'>"+(c.pp||0)+"</td><td class='n'>"+(c.gf||0)+"</td><td class='n'>"+(c.gc||0)+"</td><td class='n'>"+(c.pts||0)+"</td>";
        tba.appendChild(tr);
      });
      ta.appendChild(tba); panAnual.cuerpo.appendChild(ta);
      v.appendChild(panAnual);
    }
  }
  if(typeof filasTablaActual==="function"){
    const ft=filasTablaActual();
    if(ft&&ft.filas&&ft.filas.length && _esSeg && E.flags && (E.flags.segundaFase==="liguillaAscenso"||E.flags.segundaFase==="liguillaDescenso")){
      const pl=panel(ft.titulo||"Liguilla","🏆","agua");
      pl.classList.add("tabla-liguilla-c");
      if(ft.nota) pl.cuerpo.appendChild(el("p","mini",ft.nota));
      const tl=el("table","tabla-liga");
      tl.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>G</th><th class='n'>E</th><th class='n'>P</th><th class='n'>GF</th><th class='n'>GC</th><th class='n'>Pts</th></tr></thead>";
      const tbl=el("tbody");
      ft.filas.forEach((c,i)=>{
        const nom=(typeof clubLookup==="function"&&clubLookup(c.id))||{};
        const tr=el("tr",c.id===E.club?"yo":"");
        const _ec=(typeof escudoChip==="function")?escudoChip(c.id):"";
        tr.innerHTML="<td class='n'>"+(i+1)+"</td><td>"+_ec+(nom.n||c.n||c.id)+"</td><td class='n'>"+(c.pj||0)+"</td><td class='n'>"+(c.pg||0)+
          "</td><td class='n'>"+(c.pe||0)+"</td><td class='n'>"+(c.pp||0)+"</td><td class='n'>"+(c.gf||0)+"</td><td class='n'>"+(c.gc||0)+"</td><td class='n'>"+(c.pts||0)+"</td>";
        tbl.appendChild(tr);
      });
      tl.appendChild(tbl); pl.cuerpo.appendChild(tl);
      v.appendChild(pl);
    }
  }
}
/* ---------------- historia ---------------- */
function _idHistoriaClub(){
  return (typeof idClubCanon==="function")?idClubCanon(E.club,E.eraBase):E.club;
}
function _lineaHistoriaPropia(hid){
  const arr=(typeof HISTORIA_LINEA==="object" && HISTORIA_LINEA[hid])||[];
  return arr.filter(function(h){
    const blob=((h&&h.txt)||"")+" "+((h&&h.hito)||"");
    if(typeof textoHistoriaAjeno==="function") return !textoHistoriaAjeno(blob, hid);
    return true;
  });
}
function vistaHistoria(){
  const v=$("#vista");
  const hid=_idHistoriaClub();
  /* 7.97/7.98 · línea de ESTE club, nunca la de otro (COB 1991 → CBL; Segunda ≠ CC 1991) */
  const linea=_lineaHistoriaPropia(hid);
  if(linea.length){
    const ph=panel("Línea de "+(E.clubNombre||"club"),"📜","agua");
    linea.forEach(h=>{
      const row=el("div","hito-linea");
      const tit=el("b"); tit.textContent=(h.anio||"")+" · "+(h.hito||"");
      const mini=el("div","mini"); mini.textContent=h.txt||"";
      row.appendChild(tit); row.appendChild(mini);
      ph.cuerpo.appendChild(row);
    });
    ph.cuerpo.appendChild(el("p","mini","Hechos públicos de este club. Lo que pasa adentro de la partida es ficción del juego."));
    v.appendChild(ph);
  }
  const base=E.eraBase;
  const esC=base==="2026c";
  const esB=base==="2026b";
  const moderna=(base===2026||base==="2026b"||base==="2026c"||base==="arg2026");
  if(moderna){
    const tit=esC?"Época 2026 · Segunda División"
      :esB?"Época 2026 · Primera B"
      :base==="arg2026"?"Época 2026 · Liga Profesional (AFA)"
      :"Época 2026 · Primera División";
    const p2=panel(tit,"📚","agua");
    const eraObj=(typeof eraDe==="function"?eraDe(esC?2026:base):ERA[2026])||ERA[2026];
    if(eraObj&&eraObj.desc && base!==1991) p2.cuerpo.appendChild(el("p",null,eraObj.desc));
    /* 7.9006 · "El club hoy" vive acá ahora: por qué diriges a ESTE club, en su historia.
       Reusa SITUACION_CLUB (no inventa hechos). Antes tenía ventana propia en el escritorio. */
    if(typeof SITUACION_CLUB==="object" && SITUACION_CLUB[E.club]){
      p2.cuerpo.appendChild(el("div","resul mitad","<b>"+T("hist_hoy","El club hoy")+".</b> "+SITUACION_CLUB[E.club]));
    }
    if(typeof HISTORIA_BETA==="object" && HISTORIA_BETA[hid] && HISTORIA_BETA[hid].actual){
      const ctx=HISTORIA_BETA[hid].actual;
      if(!(typeof textoHistoriaAjeno==="function" && textoHistoriaAjeno(ctx, hid)))
        p2.cuerpo.appendChild(el("div","resul mitad","<b>Contexto real.</b> "+ctx));
    }
    if(esC){
      p2.cuerpo.appendChild(el("p","mini","Segunda División Profesional: 14 clubes, zonas Norte/Sur (12 PJ + 2 byes). Top 3 de cada zona a liguilla de ascenso de 7 (ida y vuelta, se parte de 0; volver a cruzar rivales de tu zona es el formato real). El 1° de esa liguilla sube a la B. No hay una final de 3 botones. Copa Chile no incluye Segunda (bases ANFP: 32 = Primera + B). Si subes, el año que viene juegas Copa Chile. No hay Libertadores por liga. Esta pantalla no es la de Colo-Colo 1991."));
    } else if(esB){
      p2.cuerpo.appendChild(el("p","mini","Liga de Ascenso: 16 clubes, 3 puntos por victoria. Copa Chile (Primera + B). No se inventan octavos: hay que clasificar. La B no clasifica a Libertadores por liga. Si subes a Primera, el año que viene entra Copa de la Liga."));
    } else if(base==="arg2026"){
      p2.cuerpo.appendChild(el("p","mini","Liga Profesional Argentina 2026 (AFA, no ANFP). 30 clubes, Apertura y Clausura en zonas de 15 (14 PJ + 1 bye; el Clausura parte de cero). Copa Argentina a partido único. No se juega Copa Chile ni el Campeonato Nacional chileno de 1991."));
    } else {
      p2.cuerpo.appendChild(el("p","mini","Primera División de Chile. Victoria vale 3 puntos. Copa Chile y Copa de la Liga. El descenso te saca de Copa de la Liga; Copa Chile se sigue jugando en la B."));
    }
    p2.cuerpo.appendChild(el("div","resul mitad","<b>Aviso.</b> El plantel y los clubes de 2026 usan nombres reales de referencia, pero los datos son <b>aproximados</b> y pueden haber cambiado. Todo lo dramatizado (conversaciones, conflictos, frases) es ficción del juego."));
    p2.cuerpo.appendChild(el("p","mini","No hay una \"tabla histórica\" fija para 2026: la estás escribiendo tú temporada a temporada."));
    v.appendChild(p2);
  } else if(base===1991){
    const p=panel("Temporada 1991 · Campeonato Nacional","📚");
    Object.keys(HECHOS_91).forEach(k=>{
      const n={campeon:"Campeón",goleador:"Goleador",descendidos:"Descendieron",publico:"Público",cierre:"Cierre"}[k];
      p.cuerpo.appendChild(fila(n,HECHOS_91[k]));
    });
    if(E.club==="CC"){
      p.cuerpo.appendChild(el("p","mini","La Copa Libertadores 1991 la ganó Colo-Colo: primero del Grupo 2, eliminó a Universitario de Lima, a Nacional de Montevideo y a Boca Juniors, y venció a Olimpia en la final (0-0 en Asunción y 3-0 en el Monumental el 5 de junio)."));
    } else {
      p.cuerpo.appendChild(el("p","mini","Hechos del Campeonato Nacional 1991 (16 clubes, 2 puntos por victoria). La Copa Libertadores de ese año es de Colo-Colo; acá está la tabla local de tu club."));
    }
    v.appendChild(p);
    if(typeof clubJugoNacional91!=="function" || clubJugoNacional91(E.club)){
      const pt=panel("Tabla final histórica 1991","📋","agua");
      const t=el("table"); t.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>Pts</th></tr></thead>";
      const tb=el("tbody");
      TABLA_REAL_91.forEach((r,i)=>tb.appendChild(el("tr",r[0]===E.clubNombre?"yo":"", "<td class='n'>"+(i+1)+"</td><td>"+r[0]+"</td><td class='n'>"+r[1]+"</td>")));
      t.appendChild(tb); pt.cuerpo.appendChild(t);
      v.appendChild(pt);
    }
  } else if(base===1925){
    const p=panel("Temporada 1925 · Liga Metropolitana","📚","agua");
    if(typeof FORMAT_1925==="object"){
      if(FORMAT_1925.juego) p.cuerpo.appendChild(el("p",null,FORMAT_1925.juego));
      if(E.club==="CC"){
        if(FORMAT_1925.campeon) p.cuerpo.appendChild(el("p","mini","<b>Campeón histórico:</b> "+FORMAT_1925.campeon));
        if(FORMAT_1925.debut) p.cuerpo.appendChild(el("p","mini","<b>Debut:</b> "+FORMAT_1925.debut));
      } else {
        p.cuerpo.appendChild(el("p","mini","Esta época es de "+(E.clubNombre||"este club")+" en la Liga Metropolitana amateur. El campeón de 1925 fue Colo-Colo; eso no es la historia de tu club."));
      }
    } else {
      p.cuerpo.appendChild(el("p",null,"Fútbol amateur de 1925. Victoria vale 2 puntos. Sin redes, mercado millonario ni Libertadores."));
    }
    if(E.club!=="CC") p.cuerpo.appendChild(el("p","mini","Esta época no es la Libertadores 1991 de Colo-Colo. Es la Liga Metropolitana amateur."));
    v.appendChild(p);
  } else if(base===2006){
    const p=panel("Temporada 2006 · Apertura/Clausura","📚","agua");
    if(typeof FORMAT_2006==="object"){
      if(FORMAT_2006.apertura) p.cuerpo.appendChild(el("p","mini","<b>Apertura:</b> "+FORMAT_2006.apertura));
      if(FORMAT_2006.clausura) p.cuerpo.appendChild(el("p","mini","<b>Clausura:</b> "+FORMAT_2006.clausura));
      if(FORMAT_2006.juego) p.cuerpo.appendChild(el("p",null,FORMAT_2006.juego));
    } else {
      p.cuerpo.appendChild(el("p",null,"Apertura y Clausura 2006. 19 clubes. No es el Nacional 1991."));
    }
    v.appendChild(p);
  } else {
    /* gloria u otra época: NUNCA volcar Colo-Colo 1991 */
    const p=panel("Época "+(E.anio||base)+" · "+(E.clubNombre||""),"📚","agua");
    const eps=(typeof epocasDe==="function"?epocasDe(E.club):[])||[];
    const ep=eps.find(x=>x.anio===E.anio)||eps[0];
    if(ep) p.cuerpo.appendChild(el("div","resul mitad","<b>"+(ep.etq||ep.anio)+".</b> "+(ep.desc||"")));
    if(typeof HISTORIA_BETA==="object" && HISTORIA_BETA[hid]){
      const txt=HISTORIA_BETA[hid][String(E.anio)]||HISTORIA_BETA[hid].actual;
      if(txt && !(typeof textoHistoriaAjeno==="function" && textoHistoriaAjeno(txt, hid)))
        p.cuerpo.appendChild(el("div","resul mitad","<b>Contexto real.</b> "+txt));
    }
    p.cuerpo.appendChild(el("p","mini","Esta época es de "+(E.clubNombre||"este club")+". No se mezcla con la historia de otro."));
    v.appendChild(p);
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

  /* 7.0 · saga del club: los arcos de equipo que resolviste */
  if(typeof panelSagaClub==="function"){ const ps=panelSagaClub(); if(ps) v.appendChild(ps); }

  /* historial de temporadas jugadas (tablas guardadas) */
  const ph=panel("Temporadas jugadas","🗄️","agua");
  if(!E.historialAnual||!E.historialAnual.length) ph.cuerpo.appendChild(el("p","mini","Todavía no cerraste ninguna temporada. Cuando termine un año, su tabla final queda guardada acá."));
  (E.historialAnual||[]).forEach(h=>{
    const b=el("button","op");
    const remate=h.copa?("🏆 "+((h.copa===true||h.copa==="Campeón")?"Campeón de copa":h.copa)):(h.campeon?"🥇 Campeón nacional":ordinal(h.pos)+" en la tabla");
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
    const t=el("table","tabla-liga");
    t.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>G</th><th class='n'>E</th><th class='n'>P</th><th class='n'>GF</th><th class='n'>GC</th><th class='n'>Pts</th></tr></thead>";
    const tb=el("tbody");
    (h.tabla||[]).forEach((r,i)=>tb.appendChild(el("tr",r.id===h.club?"yo":"",
      "<td class='n'>"+(i+1)+"</td><td>"+((typeof escudoChip==="function")?escudoChip(r.id):"")+r.n+"</td><td class='n'>"+r.pj+"</td><td class='n'>"+r.pg+"</td><td class='n'>"+r.pe+"</td><td class='n'>"+r.pp+"</td><td class='n'>"+r.gf+"</td><td class='n'>"+r.gc+"</td><td class='n'>"+r.pts+"</td>")));
    t.appendChild(tb); c.appendChild(t);
    if(h.goleador) c.appendChild(el("p","mini","Goleador de tu plantel: "+h.goleador.n+" con "+h.goleador.goles+" goles."));
    const b=el("button","btn-aqua ancho gris","Cerrar"); b.onclick=cerrarModal; c.appendChild(b);
  });
}
/* ---------------- carrera ---------------- */
function vistaCarrera(){
  const v=$("#vista");
  const pm=panel("Mandato","📌");
  const ex=expectativa();
  pm.cuerpo.appendChild(fila("Lo que te piden",ex.txt));
  pm.cuerpo.appendChild(fila("Directorio",etiquetaAprobacion(E.grupos.directorio.aprob)));
  if(E.carrera.evaluacion) pm.cuerpo.appendChild(el("div","resul "+(E.carrera.evaluacion.nivel==="excelente"||E.carrera.evaluacion.nivel==="cumplido"?"bien":"mal"),
    "<b>Evaluación "+E.carrera.evaluacion.anio+":</b> "+E.carrera.evaluacion.txt));
  if(riesgoDestitucion()) pm.cuerpo.appendChild(el("div","resul mal","Estás a un paso de la destitución."));
  v.appendChild(pm);

  const p=panel("Tu reputación","🎖️","agua");
  REPUTACION.forEach(r=>{
    const val=E.rep[r.id];
    p.cuerpo.appendChild(el("div",null,'<div class="fila" style="border:none;padding:2px 0"><span>'+r.ic+" "+r.n+'</span><b>'+Math.round(val)+'</b></div>'+
      barrita(val,val>50?"#4fbf3f":"#e0a92a")+'<div class="mini">'+r.d+'</div>'));
  });
  if(E.rep.publica<25) p.cuerpo.appendChild(el("div","resul mal","Tu imagen pública está en el suelo. Si sigue cayendo, ningún club del fútbol chileno te va a querer contratar."));
  v.appendChild(p);
  /* 6.25 · Logros */
  if(typeof LOGROS!=="undefined"){
    const conseg=LOGROS.filter(l=>tieneLogro(l.id)).length;
    const pl=panel("Logros","🏆","agua");
    pl.cuerpo.appendChild(el("p","mini","<b>"+conseg+" / "+LOGROS.length+"</b> desbloqueados. Bizarros, pero reales."));
    LOGROS.forEach(l=>{
      const on=tieneLogro(l.id);
      const d=el("div","logro"+(on?" on":""));
      d.innerHTML="<span class='logro-ic'>"+(on?"🏆":"🔒")+"</span><div><b>"+l.n+"</b><div class='mini'>"+(on?l.d:"???  —  "+l.d)+"</div></div>";
      pl.cuerpo.appendChild(d);
    });
    v.appendChild(pl);
  }

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
  const _info=id=>((typeof CLUB_INFO_2026!=="undefined"&&CLUB_INFO_2026[id])||CLUB_INFO[id]||{n:id,esc:"⚽",desc:""});
  const btn=(id,anioForz)=>{ const inf=_info(id); const b=el("button","op");
    b.innerHTML='<div class="t">'+(inf.esc||"⚽")+" "+inf.n+'</div>'+(inf.desc?'<div class="d">'+inf.desc+'</div>':'');
    b.onclick=()=>{ aceptarClub(id,anioForz); SEC="escritorio"; render(); aviso("Nuevo desafío: "+inf.n); }; return b; };
  const quemado=(estadoCarrera()!=="ok");
  const ofertas=quemado?[]:ofertasDeTrabajo();
  if(ofertas.length){
    p.cuerpo.appendChild(el("h3","sub","Ofertas sobre la mesa"));
    ofertas.forEach(o=>p.cuerpo.appendChild(btn(o.id)));
  }
  /* 7.59 · SIEMPRE hay salida por abajo: la división más baja te da una chance.
     Nunca hay game over forzado; retirarse es una decisión tuya, no un castigo. */
  const rescate=(typeof ofertaDeRescate==="function")?ofertaDeRescate():[];
  if(rescate.length){
    p.cuerpo.appendChild(el("h3","sub",ofertas.length?"… o volver a empezar desde abajo":"Empezar de nuevo desde abajo"));
    p.cuerpo.appendChild(el("p","mini",quemado
      ?"Tu nombre está quemado arriba, pero en la Segunda División te dan la oportunidad de reconstruirte. De acá para arriba."
      :"Si quieres el desafío de subir desde el fondo, la Segunda te espera."));
    rescate.forEach(o=>p.cuerpo.appendChild(btn(o.id,2026)));
  }
  const b=el("button","btn-aqua ancho gris","Retirarme del fútbol");
  b.style.marginTop="8px";
  b.onclick=()=>{ if(confirm("¿Seguro que quieres retirarte? Puedes seguir dirigiendo desde la Segunda División en vez de terminar la carrera.")){ finDeCarrera("Decidiste no seguir."); render(); } };
  p.cuerpo.appendChild(b);
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
  ev:{sentimiento:2, grupos:{prensa:6,hinchada:-3}, consecuencia:"Bajas la euforia; la prensa lo valora, la tribuna menos."}},
 {t:"Salir a criticar el arbitraje", texto:"Nos están perjudicando y lo vamos a decir con nombre y apellido.",
  ev:{sentimiento:8, grupos:{hinchada:8,anfp:-12,prensa:-6}, ef:{riesgo:4}, consecuencia:"La hinchada te aplaude; la ANFP toma nota."}},
 {t:"«Gano el próximo o me voy»", texto:"Les prometo algo: o ganamos el próximo o me voy a mi casa.",
  ev:{sentimiento:30, promesa:{hay:true,tipo:"ganarProximoGrande",castigo:"destitucion",texto:"Ganar el próximo partido o dejar el cargo"},
      consecuencia:"Pusiste tu cargo sobre la mesa en público."}}
];
/* 6 · comunicados oficiales EXTENSOS, redactados por el CM (solo con CM contratado) */
const COMUNICADOS_CM=[
 {t:"Respaldo institucional al plantel", texto:"COMUNICADO OFICIAL. El club expresa su total respaldo al cuerpo técnico y a cada uno de los jugadores. Entendemos el momento, valoramos el compromiso del plantel y pedimos a nuestra gente acompañar al equipo con la altura que caracteriza a esta institución. Estamos todos en el mismo barco.",
  ev:{sentimiento:24, grupos:{camarin:8,hinchada:4,prensa:3}, consecuencia:"Un mensaje ordenado y firme: el camarín lo agradece y la prensa lo valora."}},
 {t:"Llamado a la unidad de la hinchada", texto:"COMUNICADO OFICIAL. En semanas decisivas, el club convoca a su hinchada a ser el jugador número doce. La historia de esta institución se escribió con la gente en las tribunas. Los necesitamos, hoy más que nunca, del primer al último minuto.",
  ev:{sentimiento:22, grupos:{hinchada:9,socios:4}, consecuencia:"La convocatoria prende a la tribuna: se espera un buen marco."}},
 {t:"Transparencia en lo económico", texto:"COMUNICADO OFICIAL. Ante versiones que circulan, el club informa que trabaja con responsabilidad y transparencia en el ordenamiento de sus finanzas. Cada decisión apunta a la sustentabilidad del proyecto deportivo. Seguiremos comunicando con seriedad, sin especular.",
  ev:{sentimiento:8, grupos:{prensa:8,directorio:5,hinchada:-2}, ef:{}, consecuencia:"Bajas el ruido: la prensa y el directorio valoran la seriedad, la tribuna queda tibia."}},
 {t:"Postura firme ante el arbitraje", texto:"COMUNICADO OFICIAL. El club manifiesta su profunda preocupación por el criterio arbitral de las últimas fechas y solicita a las autoridades del fútbol las garantías que todo competidor merece. Defenderemos a nuestra institución por las vías que correspondan, siempre con respeto.",
  ev:{sentimiento:12, grupos:{hinchada:10,anfp:-10,prensa:-4}, ef:{riesgo:3}, consecuencia:"La hinchada te aplaude la firmeza; la ANFP toma nota."}},
 {t:"Compromiso con la cantera", texto:"COMUNICADO OFICIAL. El club reafirma que las divisiones menores son el corazón de su proyecto. Seguiremos apostando por los jóvenes de la casa, dándoles la confianza y los minutos para crecer. Ese es el sello que nos identifica y que no vamos a negociar.",
  ev:{sentimiento:18, grupos:{hinchada:6,comunidad:8,directorio:-2}, consecuencia:"Un mensaje identitario: la gente y la comunidad lo abrazan."}}
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
let REDES_FILT_TAG="";
/* 6.3 · render de un post (reutilizable por el feed y por los bots que entran solos) */
function renderPostEl(t){
  const ic=t.tipo==="prensa"?"🎙️":(t.tipo==="jugador"?"⚽":(t.tipo==="club"?"🏟️":(t.tipo==="dt"?"🧑‍💼":(t.tipo==="rival"?"🆚":"👤"))));
  const d=el("div","resul plop-card "+(t.tono==="bueno"?"bien":(t.tono==="malo"?"mal":"mitad")));
  t._nodo=d;
  const cab=el("div","plop-cab");
  const aut=el("b"); aut.textContent=ic+" "+(t.autor||"");
  cab.appendChild(aut);
  if(typeof esVerificado==="function"&&esVerificado(t)){
    const vf=el("span","verif"); vf.title="Cuenta verificada"; vf.textContent="✔"; cab.appendChild(vf);
  }
  const meta=el("span","mini"); meta.textContent=" · "+(t.fecha||"hoy")+" "+(t.anio||"");
  cab.appendChild(meta);
  d.appendChild(cab);
  const tx=el("div","plop-txt"); tx.textContent=t.texto||""; d.appendChild(tx);
  const st=el("div","mini"); st.style.opacity=".6"; st.style.marginTop="2px";
  st.textContent="♡ "+(t.likes||0).toLocaleString("es-CL")+(t.rts?" · RT "+t.rts:"")+(t.replies?" · "+t.replies+" resp.":"");
  d.appendChild(st);
  if(t.hilo&&t.hilo.length){
    const ver=t._hiloOpen?t.hilo:t.hilo.slice(-6);
    ver.forEach(h=>{
      const ln=el("p","mini hilo-linea");
      const ba=el("b"); ba.textContent=h.autor||"";
      ln.appendChild(document.createTextNode("↳ "));
      ln.appendChild(ba);
      ln.appendChild(document.createTextNode(" "+(h.texto||"")));
      d.appendChild(ln);
    });
    if(t.hilo.length>6){
      const mas=el("button","btn-aqua chico gris",t._hiloOpen?"Cerrar hilo":("Ver hilo ("+t.hilo.length+")"));
      mas.style.marginTop="4px";
      mas.onclick=function(ev){ if(ev) ev.stopPropagation(); t._hiloOpen=!t._hiloOpen; _repintarPost(t); };
      d.appendChild(mas);
    }
  }
  const acc=el("div"); acc.style.marginTop="6px";
  [["like",t._like?"❤ Te gusta":"♡ Me gusta"],["rt",t._rt?"🔁 Reposteado":"RT"],["reply","Responder"],["report","🚩 Reportar"]].forEach(([k,n])=>{
    const b=el("button","btn-aqua chico"+(k==="report"?" gris":""),n); b.style.marginRight="5px"; b.style.marginTop="4px";
    b.onclick=()=>reaccionarPost(t,k);
    acc.appendChild(b);
  });
  d.appendChild(acc);
  if(t._replyOpen){
    const wrap=el("div","plop-reply");
    const inp=el("input","entrada"); inp.type="text"; inp.maxLength=140; inp.placeholder="Responder…"; inp.setAttribute("aria-label","Responder");
    const ok=el("button","btn-aqua chico verde","Enviar");
    ok.onclick=function(ev){ if(ev) ev.stopPropagation(); enviarReply(t, inp.value); };
    inp.onkeydown=function(ev){ if(ev.key==="Enter"){ ev.preventDefault(); enviarReply(t, inp.value); } };
    wrap.appendChild(inp); wrap.appendChild(ok); d.appendChild(wrap);
    setTimeout(function(){ try{ inp.focus(); }catch(e){} }, 30);
  }
  return d;
}
function _repintarPost(t){
  try{
    const host=t&&t._nodo;
    if(host&&host.parentNode){ const neu=renderPostEl(t); host.parentNode.replaceChild(neu,host); return; }
  }catch(e){}
  if(typeof irA==="function") irA("redes");
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
  /* 6 · un hincha propio crítico ("colocolino en rojo") NO es un hostil: es de los tuyos.
     Solo el RIVAL (o cuentas rivales) te puede joder de verdad. */
  const esRival=(t.tipo==="rival");
  const esPropioCritico=((t.tipo==="hincha"||t.tipo==="jugador")&&t.tono==="malo");
  const amistoso=((t.tipo==="hincha"||t.tipo==="jugador")&&t.tono!=="malo")||t.tipo==="club"||t.tono==="bueno";
  const hostil=esRival;
  if(tipo==="like"){
    if(t._like) return aviso("Ya le diste like");
    t._like=true; t.likes+=ri(4,40);
    E.plopLikes=E.plopLikes||[]; if(E.plopLikes.indexOf(t.id)<0) E.plopLikes.push(t.id);
    if(amistoso){
      aplicarGrupos({hinchada:2}); moverSeguidores&&moverSeguidores(ri(20,120));
      /* la cuenta reacciona al like del DT: te acerca a la gente */
      t.replies++; t.hilo=t.hilo||[]; t.hilo.push({autor:t.autor,texto:elige(["¡Le gustó al mismísimo DT! 🙌","Nos leyó el técnico, grande.","Bancado desde arriba. Vamos."]),fecha:"ahora"});
      aviso("❤ Le llegó tu like — la hinchada lo festeja (+2)");
    } else if(esRival){
      aplicarRep({credibilidad:-2}); aplicarGrupos({hinchada:-2});
      aviso("😬 Le diste like a una cuenta rival… mal visto por la gente (−2 hinchada)");
    } else if(esPropioCritico){
      /* darle like a un hincha tuyo enojado: escuchar no está mal, no hay castigo */
      t.replies++; t.hilo.push({autor:t.autor,texto:elige(["Al menos el DT escucha…","Uh, me leyó. A ver si cambia algo.","Ojalá le sirva la crítica."]),fecha:"ahora"});
      aviso("👂 Le diste like a un hincha picado. Escuchar a los tuyos no te resta.");
    } else aviso("❤ Like");
  } else if(tipo==="rt"){
    if(t._rt) return aviso("Ya lo reposteaste");
    t._rt=true; t.rts=(t.rts||0)+1; t.likes+=ri(10,80);
    if(esRival){
      /* te auto-troleaste: amplificaste a un rival */
      aplicarGrupos({hinchada:-6,prensa:-4}); aplicarRep({credibilidad:-6});
      if(typeof recordar==="function") recordar("plop","reposteaste a "+t.autor+", una cuenta rival (te auto-troleaste)",{peso:"medio",tono:"malo"});
      if(typeof postProc==="function") postProc(handleDT(),"dt","RT "+t.autor+": "+(t.texto||"").slice(0,80),"malo");
      aviso("🤦 Reposteaste a una cuenta rival. Te auto-troleaste: la gente y la prensa te caen encima.");
    } else if(esPropioCritico){
      /* repostear a un hincha propio enojado contigo: autocrítica, raro pero no te funa */
      if(typeof postProc==="function") postProc(handleDT(),"dt","RT "+t.autor+": "+(t.texto||"").slice(0,80),"neutro");
      aviso("🔁 Reposteaste a un hincha picado contigo. Mostrar autocrítica no está mal, pero no esperes aplausos.");
    } else {
      aplicarGrupos({hinchada:3}); aplicarRep({publica:2}); moverSeguidores&&moverSeguidores(ri(40,260));
      if(typeof postProc==="function") postProc(handleDT(),"dt","RT "+t.autor+": "+(t.texto||"").slice(0,80),"bueno");
      aviso("🔁 Repost al aire — sumas a los tuyos (+3 hinchada)");
    }
  } else if(tipo==="report"){
    if(t._report) return aviso("Ya lo reportaste");
    /* 6 · reportar es más difícil: mientras tu imagen esté baja, no te dan bola */
    const pop=(E.rep&&E.rep.publica)||50;
    if(pop<55){ aviso("🚩 Reportaste… pero con tu poca llegada, la plataforma ni te pesca. Ganate a la gente primero (imagen "+Math.round(pop)+"/100)."); return; }
    if(esRival){
      t._report=true; t.reportado=true;
      aviso("🚩 Reportado. Con tu peso, le bajaste el alcance a una cuenta rival."); moverSeguidores&&moverSeguidores(ri(5,40));
      E.timeline=(E.timeline||[]).filter(x=>x!==t);
    } else if(esPropioCritico){
      aviso("🚩 ¿Reportar a un hincha tuyo por quejarse? La gente lo nota y no le gusta (−2 hinchada)."); aplicarGrupos({hinchada:-2});
    } else {
      aviso("🚩 Reportar a alguien que no molestaba te hace quedar mal (−1 credibilidad)."); aplicarRep({credibilidad:-1});
    }
  } else {
    t._replyOpen=!t._replyOpen;
    _repintarPost(t);
    return;
  }
  guardar();
  _repintarPost(t);
}
function enviarReply(t, raw){
  const txt=(typeof textoLimpio==="function")?textoLimpio(raw,140):String(raw||"").replace(/<[^>]*>/g,"").trim().slice(0,140);
  if(!txt){ aviso("Escribe algo"); return; }
  t._replyOpen=false;
  t.replies=(t.replies||0)+1;
  t.hilo=t.hilo||[];
  t.hilo.push({autor:handleDT(),texto:txt,fecha:"ahora"});
  if(typeof postProc==="function") postProc(handleDT(),"dt","@"+String(t.autor||"").replace(/^@/,"")+" "+txt,"neutro");
  if(typeof responderHilo==="function") responderHilo(t, txt);
  aplicarRep({prensa:1});
  guardar();
  _repintarPost(t);
}
/* quitar un me gusta: revierte parte del acercamiento */
function quitarLike(t){
  if(!t||!t._like) return;
  t._like=false; t.likes=Math.max(0,(t.likes||0)-ri(4,30));
  E.plopLikes=(E.plopLikes||[]).filter(id=>id!==t.id);
  const amistoso=(t.tipo==="hincha"||t.tipo==="club"||t.tipo==="jugador"||t.tono==="bueno");
  if(amistoso){ aplicarGrupos({hinchada:-1}); aviso("Quitaste el like. La gente lo nota (−1 hinchada)."); }
  else aviso("Like retirado.");
  guardar(); _repintarPost(t);
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
  const cab=panel("PLOP! · "+(E.anio||2008),"🐦","agua");
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
    const txt=(typeof textoLimpio==="function")?textoLimpio(ta.value,140):String(ta.value||"").trim().slice(0,140); if(!txt){ aviso("Escribe algo primero"); return; }
    bp.disabled=true;
    evaluarPost(txt).then(ev=>{
      aplicarPost(txt,ev);
      let item=null;
      if(typeof postProc==="function") item=postProc(REDES_PEST==="club"?handleClub():(handleDT()), REDES_PEST==="club"?"club":"dt", txt, ev.sentimiento>10?"bueno":(ev.sentimiento<-10?"malo":"neutro"));
      if(item && typeof responderAlPostPropio==="function") responderAlPostPropio(item, txt);
      irA("redes");
    });
  };
  p.cuerpo.appendChild(bp);
  if(REDES_PEST!=="club" && typeof POSTS_PREDEF!=="undefined"){
    p.cuerpo.appendChild(el("h3","sub","Borradores (tú, no el club)"));
    const fr=el("div","ops");
    POSTS_PREDEF.forEach(pp=>{
      const b=el("button","op");
      b.innerHTML='<div class="t">'+pp.t+'</div><div class="d">"'+pp.texto+'"</div>';
      b.onclick=()=>{ aplicarPost(pp.texto, Object.assign({},pp.ev||{})); if(typeof postProc==="function") postProc(handleDT(),"dt",pp.texto,pp.ev&&pp.ev.sentimiento<0?"malo":"bueno"); if(typeof responderAlPostPropio==="function"){ const it=(E.timeline||[])[0]; if(it) responderAlPostPropio(it, pp.texto); } irA("redes"); };
      fr.appendChild(b);
    });
    p.cuerpo.appendChild(fr);
  }
  if(REDES_PEST==="club"){
    if(E.staff&&E.staff.cm){
      /* 6 · comunicados oficiales EXTENSOS, solo con CM contratado */
      p.cuerpo.appendChild(el("h3","sub","📄 Comunicados oficiales (redacta el CM)"));
      const fr=el("div","ops");
      COMUNICADOS_CM.forEach(pp=>{
        const b=el("button","op");
        b.innerHTML='<div class="t">'+pp.t+'</div><div class="d">"'+pp.texto+'"</div>';
        b.onclick=()=>{ aplicarPost(pp.texto, Object.assign({},pp.ev)); if(typeof postProc==="function") postProc(handleClub(),"club",pp.texto,pp.ev&&pp.ev.sentimiento<0?"malo":"bueno"); irA("redes"); };
        fr.appendChild(b);
      });
      p.cuerpo.appendChild(fr);
    } else {
      p.cuerpo.appendChild(el("div","resul mitad","📄 Los <b>comunicados oficiales</b> los redacta un <b>Community Manager</b>. Contrata uno en Finanzas y acá te van a aparecer comunicados largos y bien escritos para la cuenta del club."));
    }
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
    pcd.cuerpo.appendChild(el("div","resul mitad","Contrata un <b>Community Manager</b> en Finanzas para monetizar seguidores (sponsor digital) y lanzar campañas."));
  }
  /* tu identidad en PLOP: usuario y verificado */
  E.plopVerif=E.plopVerif||{};
  const miHandle=(typeof handleDT==="function")?handleDT():"@dt";
  const verifOwn=!!E.plopVerif[miHandle];
  const titCta=el("h3","sub"); titCta.textContent="Tu cuenta: "+miHandle+(verifOwn?" ✔":"");
  pcd.cuerpo.appendChild(titCta);
  const inU=el("input"); inU.type="text"; inU.maxLength="16"; inU.className="entrada"; inU.style.width="100%";
  inU.placeholder="Tu usuario (ej: @dtcrack)"; inU.value=(E.perfil&&E.perfil.plopUser)||"";
  const bU=el("button","btn-aqua chico verde","Guardar usuario"); bU.style.marginTop="5px";
  bU.onclick=()=>{
    let u=(inU.value||"").trim().replace(/\s/g,"").replace(/[<>"'`]/g,"").replace(/^@*/,"@").slice(0,16);
    if(u.length<2){ aviso("Pon un usuario válido"); return; }
    E.perfil=E.perfil||{}; E.perfil.plopUser=u; guardar(); render(); aviso("Ahora firmas como "+u);
  };
  pcd.cuerpo.appendChild(inU); pcd.cuerpo.appendChild(bU);
  if(!verifOwn){
    const bV=el("button","btn-aqua chico"+(E.plata<150?" gris":""),"✔ Comprar verificado · "+plata(150)); bV.style.marginLeft="6px"; bV.style.marginTop="5px";
    bV.disabled=E.plata<150;
    bV.onclick=()=>{ if(E.plata<150) return aviso("No te alcanza"); aplicarEfectos({plata:-150}); E.plopVerif[handleDT()]=true; aplicarRep({publica:3}); moverSeguidores&&moverSeguidores(ri(300,1500)); guardar(); render(); aviso("✔ Cuenta verificada — más alcance y estatus"); };
    pcd.cuerpo.appendChild(bV);
  }
  /* crecer para comerte todo: impulsar la cuenta con plata */
  pcd.cuerpo.appendChild(el("p","mini","Impulsa tu cuenta: plata a cambio de alcance y seguidores. El que domina la conversación domina la calle."));
  const imp=el("div");
  [["Impulso chico",80],["Campaña",200],["Ofensiva total",500]].forEach(([n,m])=>{
    const b=el("button","btn-aqua chico"+(E.plata<m?" gris":" verde"),n+" · "+plata(m)); b.style.marginRight="5px"; b.style.marginTop="4px";
    b.disabled=E.plata<m; b.onclick=()=>impulsarPlop(m);
    imp.appendChild(b);
  });
  pcd.cuerpo.appendChild(imp);
  /* 7.9012 · no pintar comunidad antes del feed: se anexa después de cada tab */

  if(REDES_TAB==="megusta"){
    const pl=panel("Tus Me gusta","❤");
    const ids=E.plopLikes||[];
    const likeados=(E.timeline||[]).filter(t=>t._like||ids.indexOf(t.id)>=0);
    if(!likeados.length) pl.cuerpo.appendChild(el("p","mini","Todavía no le diste me gusta a nada. Tus likes acercan (o alejan) a la gente: elige bien a quién apoyas."));
    likeados.forEach(t=>{
      pl.cuerpo.appendChild(renderPostEl(t));
    });
    v.appendChild(pl);
    v.appendChild(pcd);
    return;
  }
  if(REDES_TAB==="tendencias"){
    const pt=panel("Tendencias","#️⃣");
    (typeof tendencias==="function"?tendencias():[]).forEach((x,i)=>{
      const row=el("button","fila op");
      row.style.width="100%"; row.style.textAlign="left";
      row.innerHTML="<span>"+(i+1)+". <b>"+x.tag+"</b></span><b class='mini'>"+x.n.toLocaleString("es-CL")+"</b>";
      row.onclick=()=>{ REDES_FILT_TAG=x.tag; REDES_TAB="inicio"; irA("redes"); };
      pt.cuerpo.appendChild(row);
    });
    pt.cuerpo.appendChild(el("p","mini","Toca un tag para filtrar el feed. Se arma con el próximo rival, el club y el clima del camarín. No es una API real."));
    v.appendChild(pt);
    v.appendChild(pcd);
    return;
  }
  const yo=String(handleDT()).toLowerCase().replace(/^@/,"");
  const clubH=(typeof handleClub==="function"?handleClub():"@club").toLowerCase().replace(/^@/,"");
  const clubNom=String(E.clubNombre||"").toLowerCase();
  const feed=(E.timeline||[]).filter(t=>{
    if(REDES_TAB!=="menciones"){
      if(REDES_FILT_TAG){
        const needle=String(REDES_FILT_TAG).replace(/^#/,"").toLowerCase();
        const blob=((t.texto||"")+" "+(t.autor||"")).toLowerCase();
        return blob.indexOf(needle)>=0 || blob.indexOf("#"+needle)>=0;
      }
      return true;
    }
    /* 7.9012 · menciones = te nombraron. Ya no se vuelca toda la prensa. */
    const tx=(t.texto||"").toLowerCase();
    if(tx.indexOf("@"+yo.replace(/\s/g,""))>=0) return true;
    if(yo && yo!=="dt" && tx.indexOf(yo)>=0) return true;
    if(clubH && tx.indexOf("@"+clubH)>=0) return true;
    if(clubNom && clubNom.length>4 && tx.indexOf(clubNom)>=0) return true;
    return false;
  });
  const pt=panel(REDES_TAB==="menciones"?"Menciones y prensa":(REDES_FILT_TAG?("Inicio · "+REDES_FILT_TAG):"Inicio"),"🐦");
  if(REDES_TAB==="inicio"){
    if(REDES_FILT_TAG){
      const limpia=el("button","btn-aqua chico gris","Quitar filtro "+REDES_FILT_TAG);
      limpia.onclick=()=>{ REDES_FILT_TAG=""; irA("redes"); };
      pt.cuerpo.appendChild(limpia);
    }
    pt.cuerpo.appendChild(el("div","","<span class='envivo'>EN VIVO</span> <span class='mini'>· la gente postea en tiempo real. El feed está acá abajo.</span>"));
  }
  const feedBox=el("div"); feedBox.id="plopFeed";
  if(!feed.length) feedBox.appendChild(el("p","mini","El feed está quieto. Juega un partido o publica algo."));
  feed.slice(0,40).forEach(t=>feedBox.appendChild(renderPostEl(t)));
  pt.cuerpo.appendChild(feedBox);
  v.appendChild(pt);
  if(REDES_TAB==="inicio") v.appendChild(pcd);
  else if(REDES_TAB==="menciones") v.appendChild(pcd);
  if(REDES_TAB==="inicio" && typeof arrancarPlopBots==="function") arrancarPlopBots();

  /* roleo con el capitán */
  const pc=panel("Charla con el capitán","🧑‍✈️");
  const part=proximoPartido();
  const esFinal=part&&(part.ronda==="FINAL"||part.ronda==="Semifinal");
  pc.cuerpo.appendChild(el("p","mini",esFinal?"Se viene un partido grande. Una buena charla puede cambiar el ánimo del grupo.":"Puedes hablar con el referente del plantel para mover la moral antes del próximo partido."));
  const bc=el("button","btn-aqua ancho"+(esFinal?" verde":""),"Hablar con el capitán");
  bc.onclick=modalCharlaCapitan;
  pc.cuerpo.appendChild(bc);
  v.appendChild(pc);

  /* promesas activas */
  if(E.promesas&&E.promesas.length){
    const pp=panel("Promesas en juego","⏳","alerta");
    E.promesas.forEach(pr=>pp.cuerpo.appendChild(el("div","resul mitad","<b>"+pr.texto+"</b><br><span class='mini'>Se juega en el próximo partido. Si no la cumples, "+(pr.castigo==="destitucion"?"te cuesta el cargo.":"golpea tu credibilidad.")+"</span>")));
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
/* campana flotante (esquina inferior derecha) + su badge */
function pintarCampana(){
  const b=document.getElementById("campanaAvisos"); if(!b) return;
  if(!E){ b.classList.add("oculto"); return; }
  b.classList.remove("oculto");
  const bg=document.getElementById("campanaBadge");
  if(bg){ const n=notifsNoLeidas(); bg.textContent=n>9?"9+":String(n); bg.classList.toggle("oculto",!n); }
}
/* avisos como ventana encima (fondo blureado por .modal-fondo) */
function modalAvisos(){
  if(!E) return;
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">🔔</span><span>Avisos</span>'));
    const cc=el("div","cuerpo"); box.appendChild(cc);
    const acc=notifsAccionables();
    if(acc.length){
      cc.appendChild(el("h3","sub","📨 Requieren tu respuesta"));
      acc.forEach(n=>cc.appendChild(tarjetaAviso(n,true)));
    }
    cc.appendChild(el("h3","sub","Todos los avisos"));
    const lista=(E.notifs||[]).filter(n=>!(n.acc&&!n.acc.resuelta));
    if(!lista.length) cc.appendChild(el("p","mini","Todavía no hay avisos. Todo lo importante que pase queda registrado acá."));
    lista.slice(0,40).forEach(n=>cc.appendChild(tarjetaAviso(n,false)));
    const bl=el("button","btn-aqua chico gris","Marcar todo leído"); bl.style.marginTop="8px";
    bl.onclick=()=>{ marcarLeidas(); guardar(); cerrarModal(); render(); };
    const bx=el("button","btn-aqua chico gris","Cerrar"); bx.style.marginLeft="6px";
    bx.onclick=cerrarModal;
    cc.appendChild(bl); cc.appendChild(bx);
    /* al abrir se dan por leídos (los accionables siguen arriba) */
    if(notifsNoLeidas()){ marcarLeidas(); pintarBarra(); pintarMenu(); guardar(); }
  });
}
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
/* ---------------- estadio ---------------- */
function vistaEstadio(){
  const v=$("#vista");
  const nom=(typeof estadioNombre==="function"&&estadioNombre(E.club))||((CLUB_POR_ID[E.club]||{}).est)||"Estadio";
  const aforo=(typeof aforoActual==="function")?aforoActual():((CLUB_POR_ID[E.club]||{aforo:0}).aforo);
  /* --- cabecera: recinto y estado --- */
  const ph=panel(nom,"🏟️");
  const foto=(typeof fotoEstadioDe==="function")?fotoEstadioDe(E.club):null;
  if(foto&&foto.src){
    const fig=el("figure","foto-est-wrap");
    const im=el("img","foto-est");
    im.src=foto.src; im.alt=nom; im.loading="lazy";
    im.onerror=function(){ fig.style.display="none"; };
    const cap=el("figcaption","foto-est-cred");
    const pd=/dominio p[uú]blico|public domain/i.test(foto.lic||"");
    cap.textContent=pd
      ? ("Dominio público · Wikimedia Commons")
      : ("Foto: "+(foto.autor||"autor")+" · "+foto.lic+" · Wikimedia Commons");
    fig.appendChild(im); fig.appendChild(cap);
    ph.cuerpo.appendChild(fig);
  }
  ph.cuerpo.appendChild(fila("Aforo",aforo.toLocaleString("es-CL")+" personas"));
  ph.cuerpo.appendChild(el("label","lb","Estado del recinto"));
  ph.cuerpo.appendChild(el("div",null,barrita(E.ind.estadio,"#a5854a")));
  ph.cuerpo.appendChild(el("p","mini","Mejor estado = más aforo utilizable, menos sanciones y más gente en la cancha."));
  if(E.flags&&E.flags.clausura) ph.cuerpo.appendChild(el("div","resul mal","⚠ Hay sectores clausurados por la deuda: pierdes aforo y taquilla hasta ordenar la caja."));
  if(E.flags&&E.flags.tribunaCerrada) ph.cuerpo.appendChild(el("div","resul mal","⚠ Popular clausurada por el clima de la hinchada: baja el aforo hasta que se calme."));
  v.appendChild(ph);

  /* --- obras: arreglar / mejorar y verlo avanzar --- */
  const po=panel("Obras","🚧");
  if(E.obras){
    const plan=(typeof OBRAS_PLAN!=="undefined"&&OBRAS_PLAN[E.obras.tipo])||{n:"Obra",ic:"🔧"};
    const hechas=E.obras.semanas-E.obras.resta, pct=Math.round(100*hechas/Math.max(1,E.obras.semanas));
    po.cuerpo.appendChild(el("div","resul mitad","<b>"+plan.ic+" "+plan.n+"</b> · en marcha"));
    po.cuerpo.appendChild(el("div",null,barrita(pct,"#5ec94f")));
    po.cuerpo.appendChild(el("p","mini","Avanza cada semana. Faltan <b>"+E.obras.resta+"</b> semana(s) para terminar. No puedes empezar otra obra hasta que esta cierre."));
  }else{
    po.cuerpo.appendChild(el("p","mini","Invierte en el estadio y velo mejorar semana a semana. La obra descuenta la caja ahora y el efecto llega cuando termina."));
    ["mantencion","remodelacion","ampliacion"].forEach(tipo=>{
      const plan=OBRAS_PLAN[tipo]; if(!plan) return;
      const costo=(typeof costoObra==="function")?costoObra(tipo):0;
      const d=el("div","resul mitad");
      d.innerHTML="<b>"+plan.ic+" "+plan.n+"</b> · "+plata(costo)+" · "+plan.semanas+" semanas<br><span class='mini'>"+plan.desc+" (+"+plan.gEstadio+" estado"+(plan.gAforo?", +"+plan.gAforo+" aforo":"")+")</span>";
      const sinCaja=E.plata<costo, tope=E.ind.estadio>=98;
      const b=el("button","btn-aqua chico"+((sinCaja||tope)?" gris":" verde"),tope?"Estadio impecable":"Empezar obra");
      b.style.marginTop="5px"; b.disabled=sinCaja||tope;
      b.onclick=()=>{ const r=iniciarObra(tipo); if(r.ok){ aviso("Obra iniciada · "+plata(r.costo)); render(); } else aviso(r.msg); };
      d.appendChild(b); po.cuerpo.appendChild(d);
    });
  }
  v.appendChild(po);

  /* --- precios de entradas por sector real, con proyección en vivo --- */
  const sects=(typeof sectoresActuales==="function")?sectoresActuales():[];
  const pe=panel("Precios de entradas","🎫","agua");
  pe.cuerpo.appendChild(el("p","mini","Fija el precio de cada sector. Subir el precio deja más por entrada pero espanta público (la galería es la más sensible). La proyección se actualiza al instante."));
  const proy=el("div","resul mitad"); proy.id="proyTaq";
  const doc=el("div"); doc.id="docButacas";
  const setFill=(r,s)=>{ const pct=Math.round((r.value-s.min)/Math.max(1,(s.max-s.min))*100); r.style.setProperty("--fill",pct+"%"); };
  const refrescarProy=()=>{
    const r=proyeccionTaquilla(E.precios);
    const ocupPct=Math.round(100*r.gente/Math.max(1,aforo*clausuraFactor()));
    proy.innerHTML="Partido de local tipo → <b>"+r.gente.toLocaleString("es-CL")+"</b> personas ("+ocupPct+"% del aforo) · ingreso <b>"+plata(r.ingreso)+"</b>"+
      (precioPromedioRatio()>1.3?"<br><span class='mini'>Precios altos: la hinchada se va a ir enojando.</span>":
       (precioPromedioRatio()<0.85?"<br><span class='mini'>Precios populares: la gente lo valora.</span>":""));
    if(typeof taquillaPorSector==="function"){
      const sec=taquillaPorSector(proximoPartido());
      let html="<h3 class='sub'>Butacas del estadio · ganancia estimada por partido</h3>"+
        "<table class='butacas'><thead><tr><th>Sector</th><th class='n'>Butacas</th><th class='n'>Precio</th><th class='n'>Ocup.</th><th class='n'>Gana ~</th></tr></thead><tbody>";
      let tot=0;
      sec.forEach(x=>{ tot+=x.ingreso;
        html+="<tr><td>"+x.ic+" "+x.n+"</td><td class='n'>"+x.cap.toLocaleString("es-CL")+"</td><td class='n'>$"+x.precio.toLocaleString("es-CL")+"</td><td class='n'>"+x.ocup+"%</td><td class='n'>"+plata(x.ingreso)+"</td></tr>"; });
      html+="</tbody><tfoot><tr><td>Total taquilla</td><td class='n'></td><td class='n'></td><td class='n'></td><td class='n'>"+plata(tot)+"</td></tr></tfoot></table>"+
        "<p class='mini'>Los sectores populares son los más baratos y los que más llenan; los premium rinden más por entrada pero son chicos. Subir precios sube la ganancia por cabeza pero baja la ocupación — y enoja a la hinchada.</p>";
      doc.innerHTML=html;
    }
  };
  sects.forEach(s=>{
    pe.cuerpo.appendChild(el("label","lb",s.ic+" "+s.n+" — <b id='pr_"+s.id+"'>$"+(E.precios[s.id]||s.ref).toLocaleString("es-CL")+"</b>"));
    const r=el("input"); r.type="range"; r.min=s.min; r.max=s.max; r.step=Math.max(50,Math.round(s.ref*0.05)); r.value=E.precios[s.id]||s.ref; r.className="rango";
    setFill(r,s);
    r.oninput=()=>{ E.precios[s.id]=parseInt(r.value,10); const lab=document.getElementById("pr_"+s.id); if(lab) lab.textContent="$"+E.precios[s.id].toLocaleString("es-CL"); setFill(r,s); refrescarProy(); };
    r.onchange=()=>{ if(typeof redesReaccion==="function") redesReaccion("precio",{ratio:precioPromedioRatio()}); guardar(); };
    pe.cuerpo.appendChild(r);
  });
  pe.cuerpo.appendChild(proy); pe.cuerpo.appendChild(doc); refrescarProy();
  v.appendChild(pe);
}
/* ---------------- respaldo de partida (archivo) ---------------- */
function descargarPartida(){
  if(!E||!E.club){ aviso("No hay partida para descargar"); return; }
  const paquete={ app:"futbolini", saveVer:(typeof SAVE_VER==="number"?SAVE_VER:E.saveVer||1), guardado:Date.now(), E:E };
  const txt=JSON.stringify(paquete);
  const blob=new Blob([txt],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const nombre="futbolini-"+((E.clubNombre||E.club||"club").toLowerCase().replace(/[^a-z0-9]+/g,"-"))+"-"+(E.anio||"")+".fut";
  const a=el("a"); a.href=url; a.download=nombre; document.body.appendChild(a); a.click();
  setTimeout(()=>{ a.remove(); URL.revokeObjectURL(url); },200);
  aviso("Partida descargada");
}
function cargarPartidaArchivo(f){
  const lector=new FileReader();
  lector.onload=async()=>{
    let dato=null;
    try{ dato=JSON.parse(lector.result); }catch(e){ aviso("El archivo no es una partida válida"); return; }
    const nuevo=(dato&&dato.E&&dato.E.club)?dato.E:((dato&&dato.club)?dato:null);
    if(!nuevo){ aviso("El archivo no es una partida de Futbolini"); return; }
    if(dato&&typeof dato.saveVer==="number"&&(!nuevo.saveVer||dato.saveVer>nuevo.saveVer)) nuevo.saveVer=dato.saveVer;
    if(E&&E.club && !confirm("Esto reemplaza tu partida actual por la del archivo. ¿Seguir?")) return;
    E=nuevo; normalizarEstado(); if(typeof aplicarEstatutosMod==="function") aplicarEstatutosMod();
    await guardar(); aviso("Partida cargada"); SEC="escritorio"; render();
  };
  lector.onerror=()=>aviso("No se pudo leer el archivo");
  lector.readAsText(f);
}
/* ---------------- mis partidas (varios slots) ---------------- */
async function cambiarDeClub(){
  if(E&&E.club){ await guardar(); }        /* guarda la actual en su slot antes de salir */
  E=null; SEC="escritorio"; render();       /* render con E=null → pantallaInicio (elegir club) */
  aviso("Elige el club de tu nueva partida");
}
async function continuarPartida(id){
  if(E&&E._slot===id){ aviso("Ya estás en esa partida"); return; }
  if(E&&E.club){ await guardar(); }
  const ok=await cargarPartida(id);
  if(ok){ SEC="escritorio"; render(); aviso("Partida cargada"); } else aviso("No se pudo cargar esa partida");
}
async function borrarPartidaUI(id,nombre){
  if(!confirm("¿Borrar la partida de "+(nombre||"este club")+"? No se puede deshacer.")) return;
  const eraActual=(E&&E._slot===id);
  await borrarPartida(id);
  if(eraActual){ E=null; SEC="escritorio"; }
  render(); aviso("Partida borrada");
}
function panelMisPartidas(v){
  const pm=panel("Mis partidas","🗂️");
  pm.cuerpo.appendChild(el("p","mini","Puedes tener varias carreras a la vez. Cambia de club cuando quieras: la partida actual se guarda sola en su propia ranura."));
  const cont=el("div"); pm.cuerpo.appendChild(cont);
  cont.appendChild(el("p","mini","Cargando partidas…"));
  const bNueva=el("button","btn-aqua chico verde","➕ Nueva partida (elegir otro club)"); bNueva.style.marginTop="8px";
  bNueva.onclick=cambiarDeClub;
  pm.cuerpo.appendChild(bNueva);
  v.appendChild(pm);
  slotsLista().then(lista=>{
    cont.innerHTML="";
    if(!lista.length){ cont.appendChild(el("p","mini","Todavía no hay partidas guardadas.")); return; }
    const ord=lista.slice().sort((a,b)=>(b.guardado||0)-(a.guardado||0));
    ord.forEach(s=>{
      const esAct=(E&&E._slot===s.id);
      const fila=el("div","fila");
      const etq=(s.epoca||("Año "+s.anio))+(s.gen>1?" · gen "+s.gen:"");
      const cuando=s.guardado?fechaCorta(s.guardado):"";
      const sp=el("span");
      if(esAct) sp.appendChild(document.createTextNode("▶ "));
      const bn=el("b"); bn.textContent=s.clubNombre||s.club||"";
      sp.appendChild(bn);
      const mini=el("span","mini"); mini.textContent=" "+etq+(cuando?" · "+cuando:"")+(esAct?" · actual":"");
      sp.appendChild(mini);
      fila.appendChild(sp);
      const acc=el("span","");
      if(!esAct){
        const bc=el("button","btn-aqua chico","Continuar"); bc.onclick=()=>continuarPartida(s.id); acc.appendChild(bc);
      }
      const bd=el("button","btn-aqua chico rojo"); bd.textContent="🗑"; bd.title="Borrar"; bd.style.marginLeft="6px";
      bd.onclick=()=>borrarPartidaUI(s.id,s.clubNombre||s.club); acc.appendChild(bd);
      fila.appendChild(acc);
      cont.appendChild(fila);
    });
  }).catch(()=>{ cont.innerHTML=""; cont.appendChild(el("p","mini","No se pudieron leer las partidas.")); });
}
function fechaCorta(ts){
  try{ return new Date(ts).toLocaleDateString("es-CL",{day:"2-digit",month:"2-digit"}); }catch(e){ return ""; }
}
/* ---------------- en línea (Ajustes) ---------------- */
function panelEnLinea(v){
  const p=panel("En este momento","🟢","agua");
  const linea=el("div","presencia-linea");
  const btn=el("button","presencia-vivo");
  btn.type="button"; btn.id="presenciaVivo";
  btn.setAttribute("aria-label","Jugadores en línea");
  btn.title="En línea";
  const txt=el("span","presencia-txt");
  txt.id="presenciaTxt";
  const n=(typeof presenciaN==="function")?presenciaN():1;
  txt.innerHTML="Hay <b>"+n+"</b> persona"+(n===1?"":"s")+" jugando ahora";
  linea.appendChild(btn); linea.appendChild(txt);
  p.cuerpo.appendChild(linea);
  p.cuerpo.appendChild(el("p","mini","Quien tenga el juego abierto cuenta. El punto verde parpadea mientras hay gente."));
  v.appendChild(p);
  if(typeof presenciaLatido==="function") presenciaLatido();
}
/* ---------------- ajustes ---------------- */
function _inpNubeCss(){
  return "display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,.18);font-size:15px";
}
function pintarSesionNube(cc, opts){
  opts=opts||{};
  const mail=(typeof nubeEmail==="function"&&nubeEmail())||"tu cuenta";
  const p=el("p"); p.appendChild(document.createTextNode("Sesión de "));
  const b=el("b"); b.textContent=mail; p.appendChild(b);
  p.appendChild(document.createTextNode(". La partida te sigue a otro celular o computadora."));
  cc.appendChild(p);
  const bSub=el("button","btn-aqua chico","☁️ Subir partida");
  bSub.onclick=async()=>{ if(!E||!E.club){ aviso("No hay partida abierta"); return; } bSub.disabled=true; const r=await nubeSubir(E); bSub.disabled=false; aviso(r.ok?"Partida subida a la nube":("No se pudo subir: "+(r.msg||""))); };
  const bBaj=el("button","btn-aqua chico"); bBaj.textContent="⬇️ Bajar partida"; bBaj.style.marginLeft="6px";
  bBaj.onclick=async()=>{
    bBaj.disabled=true; const r=await nubeBajar(); bBaj.disabled=false;
    if(!r.ok){ aviso(r.msg); return; }
    if(E&&E.club && !confirm("Esto reemplaza tu partida actual por la de la nube. ¿Seguir?")) return;
    E=r.estado; normalizarEstado(); if(typeof aplicarEstatutosMod==="function") aplicarEstatutosMod();
    await guardar(); if(opts.cerrar&&typeof cerrarModal==="function") cerrarModal();
    aviso("Partida bajada de la nube"); SEC="escritorio"; render();
  };
  cc.appendChild(bSub); cc.appendChild(bBaj);
  const bOut=el("button","btn-aqua chico gris"); bOut.textContent="Cerrar sesión"; bOut.style.marginLeft="6px";
  bOut.onclick=()=>{ nubeSalir(); if(opts.cerrar&&typeof cerrarModal==="function") cerrarModal(); if(typeof pintarBtnCuenta==="function") pintarBtnCuenta(); aviso("Sesión cerrada"); if(!opts.cerrar) render(); };
  cc.appendChild(bOut);
}
function pintarFormularioCuenta(cc, opts){
  opts=opts||{};
  let modo=opts.modo||"clave";
  const caja=el("div","nube-login");
  const estilo=_inpNubeCss();
  caja.appendChild(el("p","mini","Correo y clave, o un código de 6 dígitos al mail. Es opcional: sin cuenta el juego sigue igual, en este navegador."));
  const tabs=el("div","fichas");
  const bClave=el("button","ficha","Clave"); const bCod=el("button","ficha","Código al correo");
  tabs.appendChild(bClave); tabs.appendChild(bCod); caja.appendChild(tabs);
  caja.appendChild(el("label","lb","Correo"));
  const iMail=el("input"); iMail.type="email"; iMail.placeholder="tu@correo.com"; iMail.autocomplete="email"; iMail.style.cssText=estilo;
  if(typeof nubeMailRecordado==="function") iMail.value=nubeMailRecordado();
  caja.appendChild(iMail);
  const wrapClave=el("div","nube-clave");
  wrapClave.appendChild(el("label","lb","Clave"));
  const wrap=el("div","clave-wrap");
  const iPass=el("input"); iPass.type="password"; iPass.placeholder="mínimo 6 caracteres"; iPass.autocomplete="current-password"; iPass.style.cssText=estilo; iPass.style.paddingRight="72px";
  const tog=el("button","clave-ver"); tog.type="button"; tog.textContent="ver"; tog.setAttribute("aria-label","Mostrar clave");
  tog.onclick=()=>{ const on=iPass.type==="password"; iPass.type=on?"text":"password"; tog.textContent=on?"ocultar":"ver"; };
  wrap.appendChild(iPass); wrap.appendChild(tog); wrapClave.appendChild(wrap);
  caja.appendChild(wrapClave);
  const wrapCod=el("div","nube-codigo"); wrapCod.hidden=true;
  wrapCod.appendChild(el("p","mini nube-modo","Te mandamos 6 números. Vence en unos minutos. Revisa spam."));
  const iCod=el("input","codigo-in"); iCod.type="text"; iCod.inputMode="numeric"; iCod.autocomplete="one-time-code"; iCod.maxLength=6; iCod.placeholder="000000"; iCod.setAttribute("aria-label","Código de 6 dígitos");
  wrapCod.appendChild(iCod); caja.appendChild(wrapCod);
  const err=el("p","mini"); err.style.color="#b23"; caja.appendChild(err);
  const acc=el("div"); acc.style.marginTop="8px"; caja.appendChild(acc);
  function setErr(t){ err.textContent=t||""; }
  function sync(){
    bClave.setAttribute("aria-pressed",modo==="clave"?"true":"false");
    bCod.setAttribute("aria-pressed",modo==="codigo"?"true":"false");
    wrapClave.hidden=modo!=="clave"; wrapCod.hidden=modo!=="codigo";
    acc.innerHTML="";
    if(modo==="clave"){
      const bIn=el("button","btn-aqua chico verde","Entrar");
      const bReg=el("button","btn-aqua chico"); bReg.textContent="Crear cuenta"; bReg.style.marginLeft="6px";
      bIn.onclick=async()=>{
        const mail=(iMail.value||"").trim(), pass=iPass.value||"";
        if(typeof mailOk==="function" && !mailOk(mail)){ setErr("Ese correo no se ve válido"); return; }
        if(!mail||!pass){ setErr("Completa correo y clave"); return; }
        bIn.disabled=true; setErr("");
        const r=await nubeEntrar(mail,pass); bIn.disabled=false;
        if(!r.ok){ setErr(r.msg||"No se pudo entrar"); return; }
        if(typeof nubeRecordarMail==="function") nubeRecordarMail(mail);
        if(r.confirmar){ setErr(r.msg||"Revisa el correo"); modo="codigo"; sync(); return; }
        if(opts.cerrar&&typeof cerrarModal==="function") cerrarModal();
        if(typeof pintarBtnCuenta==="function") pintarBtnCuenta();
        aviso(r.email?("Hola, "+r.email):"Listo");
        if(!opts.cerrar) render();
      };
      bReg.onclick=async()=>{
        const mail=(iMail.value||"").trim(), pass=iPass.value||"";
        if(typeof mailOk==="function" && !mailOk(mail)){ setErr("Ese correo no se ve válido"); return; }
        if(!mail||!pass){ setErr("Completa correo y clave"); return; }
        if(pass.length<6){ setErr("La clave necesita al menos 6 caracteres"); return; }
        bReg.disabled=true; setErr("");
        const r=await nubeRegistrar(mail,pass); bReg.disabled=false;
        if(!r.ok){ setErr(r.msg||"No se pudo crear"); return; }
        if(typeof nubeRecordarMail==="function") nubeRecordarMail(mail);
        if(r.confirmar){ aviso(r.msg||"Revisa el correo"); modo="codigo"; sync(); return; }
        if(opts.cerrar&&typeof cerrarModal==="function") cerrarModal();
        if(typeof pintarBtnCuenta==="function") pintarBtnCuenta();
        aviso("Cuenta creada"); if(!opts.cerrar) render();
      };
      iPass.onkeydown=function(ev){ if(ev.key==="Enter"){ ev.preventDefault(); bIn.click(); } };
      acc.appendChild(bIn); acc.appendChild(bReg);
    }else{
      const bPedir=el("button","btn-aqua chico","Enviar código");
      const bVer=el("button","btn-aqua chico verde"); bVer.textContent="Verificar"; bVer.style.marginLeft="6px";
      function pintarCooldown(){
        if(typeof nubePuedePedirCodigo!=="function") return;
        if(!nubePuedePedirCodigo()){
          bPedir.disabled=true;
          bPedir.textContent="Espera "+nubeSegundosCodigo()+" s";
        }else{
          bPedir.disabled=false; bPedir.textContent="Enviar código";
        }
      }
      pintarCooldown();
      bPedir.onclick=async()=>{
        const mail=(iMail.value||"").trim();
        if(typeof mailOk==="function" && !mailOk(mail)){ setErr("Ese correo no se ve válido"); return; }
        bPedir.disabled=true; setErr("");
        const r=await nubePedirCodigo(mail);
        if(!r.ok){ bPedir.disabled=false; setErr(r.msg||"No se pudo enviar"); return; }
        aviso(r.msg); iCod.focus(); pintarCooldown();
        var iv=setInterval(function(){ pintarCooldown(); if(typeof nubePuedePedirCodigo==="function"&&nubePuedePedirCodigo()) clearInterval(iv); },1000);
      };
      bVer.onclick=async()=>{
        const mail=(iMail.value||"").trim(), tok=(iCod.value||"").replace(/\D/g,"");
        if(typeof mailOk==="function" && !mailOk(mail)){ setErr("Ese correo no se ve válido"); return; }
        if(typeof codigoOk==="function" ? !codigoOk(tok) : tok.length!==6){ setErr("El código son 6 números"); return; }
        bVer.disabled=true; setErr("");
        const r=await nubeVerificarCodigo(mail,tok); bVer.disabled=false;
        if(!r.ok){ setErr(r.msg||"Código inválido"); return; }
        if(opts.cerrar&&typeof cerrarModal==="function") cerrarModal();
        if(typeof pintarBtnCuenta==="function") pintarBtnCuenta();
        aviso(r.email?("Hola, "+r.email):"Listo"); if(!opts.cerrar) render();
      };
      iCod.onkeydown=function(ev){ if(ev.key==="Enter"){ ev.preventDefault(); bVer.click(); } };
      iCod.oninput=function(){ iCod.value=String(iCod.value||"").replace(/\D/g,"").slice(0,6); };
      acc.appendChild(bPedir); acc.appendChild(bVer);
    }
  }
  bClave.onclick=()=>{ modo="clave"; sync(); };
  bCod.onclick=()=>{ modo="codigo"; sync(); };
  iMail.onkeydown=function(ev){ if(ev.key==="Enter"){ ev.preventDefault(); if(modo==="clave") iPass.focus(); else iCod.focus(); } };
  sync();
  cc.appendChild(caja);
  setTimeout(function(){ try{ (iMail.value?(modo==="codigo"?iCod:iPass):iMail).focus(); }catch(e){} }, 40);
}
function vistaAjustes(){
  const v=$("#vista");
  panelEnLinea(v);
  const don=panel("El proyecto","💚");
  don.cuerpo.appendChild(el("p",null,"Futbolini es gratis y siempre lo va a ser. Corre 100% en tu navegador, sin servidor obligatorio: el ayudante es un compositor local (lee el club y arma frases), no una IA de pago."));
  don.cuerpo.appendChild(el("p","mini","Si quieres ayudar: comparte el juego, o invitale un café al autor. Nada se bloquea si no donas."));
  if(typeof botonDonar==="function") don.cuerpo.appendChild(botonDonar("btn-aqua ancho verde"));
  /* 7.9014 · el aviso (hueco de anuncio a futuro) vive acá, en Ajustes. La gente decide apretar. */
  don.cuerpo.appendChild(el("h3","sub", typeof T==="function"?T("don_aviso_hint","Apoyar gratis: das atención, no plata."):"Apoyar gratis"));
  don.cuerpo.appendChild(el("p","mini", typeof T==="function"?T("don_aviso_txt","Un día acá puede salir un anuncio. Hoy es una pausa de 6 segundos. Nadie te obliga."):"Un día acá puede salir un anuncio. Hoy es una pausa. Nadie te obliga."));
  const ba=el("button","btn-aqua ancho verde", typeof T==="function"?T("don_aviso_btn","Ver un aviso · apoyar sin plata"):"Ver un aviso · apoyar sin plata");
  ba.style.marginTop="4px";
  ba.onclick=function(){ if(typeof donarVerAviso==="function") donarVerAviso(don.cuerpo, ba); };
  don.cuerpo.appendChild(ba);
  const nVistos=(typeof donarAvisosVistos==="function")?donarAvisosVistos():0;
  if(nVistos) don.cuerpo.appendChild(el("p","mini",(typeof T==="function"?T("don_aviso_n","Avisos vistos esta partida"):"Avisos vistos")+": <b>"+nVistos+"</b>"));
  v.appendChild(don);
  panelMisPartidas(v);
  const p=panel("Ajustes","⚙️");
  p.cuerpo.appendChild(el("label","lb","Tema visual"));
  const f=el("div","fichas");
  [["aero","Frutiger Aero"],["negro","Negro"],["claro","Claro"],["insano","Insano"]].forEach(([k,n])=>{
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",document.body.dataset.tema===k?"true":"false");
    b.onclick=()=>{ if(typeof aplicarTema==="function") aplicarTema(k); else { document.body.setAttribute("data-tema",k); document.body.dataset.tema=k; } Store.set("futbolini3_tema",k); render(); };
    f.appendChild(b);
  });
  p.cuerpo.appendChild(f);
  /* 7.9015 · Navegación: PC y celular en el MISMO panel, no 3 ventanas */
  p.cuerpo.appendChild(el("label","lb", typeof T==="function"?T("aj_nav","Navegación"):"Navegación"));
  p.cuerpo.appendChild(el("p","mini", typeof T==="function"?T("aj_nav_pc","En el computador"):"En el computador"));
  const fnav=el("div","fichas");
  const lateralOn=document.body.classList.contains("nav-lateral");
  [[true,"Barra lateral (Wii)"],[false,"Pestañas arriba"]].forEach(([on,n])=>{
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",lateralOn===on?"true":"false");
    b.onclick=()=>{ document.body.classList.toggle("nav-lateral",on); Store.set("futbolini3_lateral",on); render(); };
    fnav.appendChild(b);
  });
  p.cuerpo.appendChild(fnav);
  p.cuerpo.appendChild(el("p","mini", typeof T==="function"?T("aj_nav_cel","En el celular"):"En el celular"));
  const fdock=el("div","fichas");
  const compact=document.body.classList.contains("dock-mas");
  [[false, typeof T==="function"?T("aj_nav_cinta","Cinta (todas las secciones)"):"Cinta (todas las secciones)"],
   [true, typeof T==="function"?T("aj_nav_mas","Compacto (4 + Más)"):"Compacto (4 + Más)"]].forEach(([on,n])=>{
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",compact===on?"true":"false");
    b.onclick=()=>{ document.body.classList.toggle("dock-mas",on); Store.set("futbolini3_dockmas",on); if(typeof pintarDock==="function") pintarDock(); render(); };
    fdock.appendChild(b);
  });
  p.cuerpo.appendChild(fdock);
  p.cuerpo.appendChild(el("p","mini", typeof T==="function"?T("aj_nav_txt","Computador: barra a la izquierda (como la Wii) o pestañas arriba. Celular: la cinta de abajo se desliza con el dedo. El modo compacto deja cuatro atajos y un Más. Ajustes siempre está en ⚙️, no en el menú."):"Computador: barra a la izquierda o pestañas arriba. Celular: la cinta de abajo se desliza. El compacto deja cuatro atajos y un Más. Ajustes siempre está en ⚙️."));
  /* 7.68 · modo rendimiento (para que corra en cualquier equipo) */
  p.cuerpo.appendChild(el("label","lb","Rendimiento"));
  const fperf=el("div","fichas");
  const perfOn=document.body.classList.contains("perf");
  [[false,"✨ Full efectos"],[true,"⚡ Modo liviano"]].forEach(([on,n])=>{
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",perfOn===on?"true":"false");
    b.onclick=()=>{ document.body.classList.toggle("perf",on); Store.set("futbolini3_perf",on); if(typeof burbujas==="function"&&!on) burbujas(); render(); };
    fperf.appendChild(b);
  });
  p.cuerpo.appendChild(fperf);
  p.cuerpo.appendChild(el("p","mini","El modo liviano apaga burbujas, desenfoques y animaciones pesadas: el juego vuela en equipos lentos o celulares viejos. Se autoenciende solo si detecta un equipo flaco."));
  /* 7.69 · idioma / registro (neutro · chilensis · português) */
  if(typeof IDIOMAS_DISPONIBLES!=="undefined" && typeof setIdioma==="function"){
    p.cuerpo.appendChild(el("label","lb",(typeof T==="function"?T("aj_idioma","Idioma"):"Idioma")));
    const fidi=el("div","fichas");
    IDIOMAS_DISPONIBLES.forEach(([k,n])=>{
      const b=el("button","ficha",n);
      b.setAttribute("aria-pressed",(typeof idiomaActual==="function"&&idiomaActual()===k)?"true":"false");
      b.onclick=()=>{ setIdioma(k); Store.set("futbolini3_idioma",k); render(); };
      fidi.appendChild(b);
    });
    p.cuerpo.appendChild(fidi);
    p.cuerpo.appendChild(el("p","mini",(typeof T==="function"?T("aj_idioma_txt","Cambia el registro de los textos del juego. Lo que aún no esté traducido se muestra en español neutro."):"")));
  }
  p.cuerpo.appendChild(el("div","resul mitad","<b>Aviso.</b> Clubes, jugadores y dirigentes reales aparecen con su nombre. "+
    "Resultados, títulos y fechas se apoyan en registros públicos. Todo lo demás (conversaciones, negociaciones, conflictos internos, frases) "+
    "es ficción escrita para el juego."));
  if(E){
    const b1=el("button","btn-aqua chico","Guardar ahora"); b1.onclick=async()=>{ await guardar(); aviso("Partida guardada"); };
    const b2=el("button","btn-aqua chico rojo","Borrar esta partida"); b2.style.marginLeft="6px";
    b2.onclick=async()=>{
      if(E&&E._slot){ borrarPartidaUI(E._slot,E.clubNombre); }
      else if(confirm("¿Borrar la partida guardada?")){ await Store.del(LLAVE); E=null; render(); }
    };
    p.cuerpo.appendChild(b1); p.cuerpo.appendChild(b2);
  } else {
    p.cuerpo.appendChild(el("p","mini","Estás en Ajustes sin una partida abierta. Desde acá puedes borrar guardados (arriba), cambiar el tema o cargar un respaldo — sin tener que entrar a un club."));
  }
  v.appendChild(p);

  /* ---- Respaldo de partida (archivo, 100% offline) ---- */
  const pr=panel("Respaldo de partida","💾");
  pr.cuerpo.appendChild(el("p","mini","Descarga tu partida como archivo y guárdala donde quieras (Drive, mail, WhatsApp a ti mismo). En otro equipo la cargas y sigues donde ibas. No necesita internet ni cuenta."));
  if(E){ const bDesc=el("button","btn-aqua chico","Descargar partida"); bDesc.onclick=()=>descargarPartida(); pr.cuerpo.appendChild(bDesc); }
  const bCarg=el("button","btn-aqua chico"); bCarg.textContent="Cargar partida"; if(E) bCarg.style.marginLeft="6px";
  const inp=el("input"); inp.type="file"; inp.accept="application/json,.json,.fut"; inp.style.display="none";
  inp.onchange=e=>{ const f=e.target.files&&e.target.files[0]; if(f) cargarPartidaArchivo(f); inp.value=""; };
  bCarg.onclick=()=>inp.click();
  pr.cuerpo.appendChild(bCarg); pr.cuerpo.appendChild(inp);
  v.appendChild(pr);
  if(!E){
    const bv=el("button","btn-aqua ancho verde","← Volver al inicio");
    bv.onclick=()=>{ SEC="escritorio"; render(); };
    v.appendChild(bv);
  }

  /* ---- Cuenta en la nube (opcional) ---- */
  if(typeof nubeActiva==="function"){
    const pn=panel("Cuenta en la nube","☁️");
    if(!nubeActiva()){
      /* aún sin configurar: formulario para pegar URL + anon key (admin) */
      pn.cuerpo.appendChild(el("p","mini","Para prender el login (gratis, con Supabase) pega acá la <b>URL</b> y la <b>llave pública (anon)</b> de tu proyecto. Los pasos para crear el proyecto están en <b>SETUP_NUBE.md</b>. La llave anon es <b>pública a propósito</b>: es seguro dejarla acá. La que NUNCA se pega es la <i>service_role</i>."));
      const estiloCfg="display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:9px 11px;border-radius:10px;border:1px solid rgba(0,0,0,.15);font-size:13px";
      const cfg0=(typeof nubeConfig==="function")?nubeConfig():{url:"",anonKey:""};
      const iUrl=el("input"); iUrl.type="url"; iUrl.placeholder="https://xxxx.supabase.co"; iUrl.value=cfg0.url||""; iUrl.style.cssText=estiloCfg; iUrl.spellcheck=false;
      const iKey=el("input"); iKey.type="text"; iKey.placeholder="anon key (empieza con eyJ...)"; iKey.value=cfg0.anonKey||""; iKey.style.cssText=estiloCfg; iKey.spellcheck=false;
      pn.cuerpo.appendChild(iUrl); pn.cuerpo.appendChild(iKey);
      const bProbar=el("button","btn-aqua chico","Probar conexión"); bProbar.style.marginTop="6px";
      bProbar.onclick=async()=>{ bProbar.disabled=true; const r=await nubeProbar(iUrl.value,iKey.value); bProbar.disabled=false; aviso(r.ok?"✅ Conexión OK, ya puedes guardar":("❌ "+r.msg)); };
      const bGuardar=el("button","btn-aqua chico verde","Guardar y activar"); bGuardar.style.marginLeft="6px";
      bGuardar.onclick=async()=>{
        const r=await nubeProbar(iUrl.value,iKey.value);
        if(!r.ok){ if(!confirm("La prueba falló ("+r.msg+"). ¿Guardar igual?")) return; }
        nubeGuardarConfig(iUrl.value,iKey.value); aviso("Nube configurada. Ya puedes crear tu cuenta."); render();
      };
      pn.cuerpo.appendChild(bProbar); pn.cuerpo.appendChild(bGuardar);
      pn.cuerpo.appendChild(el("p","mini","Esto queda guardado en <b>este navegador</b> (no en el repo). Para que tus amigos tengan login en la página publicada, la llave anon va en <code>js/nube.js</code> — avisame y lo dejo listo."));
    }else if(nubeLogueado()){
      pintarSesionNube(pn.cuerpo, {});
      /* auto-respaldo: solo sube, nunca baja ni pisa tu partida sin permiso */
      const autoOn=(typeof nubeAutoActivo==="function")?nubeAutoActivo():false;
      pn.cuerpo.appendChild(el("label","lb","Respaldo automático"));
      const fa=el("div","fichas");
      [["si","Automático (recomendado)"],["no","Solo manual"]].forEach(([k,n])=>{
        const on=k==="si";
        const b=el("button","ficha",n);
        b.setAttribute("aria-pressed",autoOn===on?"true":"false");
        b.onclick=()=>{ if(typeof nubeAutoSet==="function") nubeAutoSet(on); aviso(on?"Auto-respaldo activado":"Auto-respaldo desactivado"); render(); };
        fa.appendChild(b);
      });
      pn.cuerpo.appendChild(fa);
      const ult=(typeof nubeUltimoRespaldo==="function")?nubeUltimoRespaldo():0;
      const cuando=ult?("último respaldo: "+new Date(ult).toLocaleString("es-CL",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})):"todavía sin respaldo automático";
      pn.cuerpo.appendChild(el("p","mini",(autoOn
        ? "Con auto-respaldo, tu partida se sube sola a la nube cada vez que el juego guarda: aunque limpies el navegador o cambies de equipo, no la pierdes. <span id=\"nubeAutoTxt\">"+cuando+"</span>."
        : "Modo manual: sube después de jugar y baja al empezar en otro equipo. Bajar SIEMPRE es manual y con confirmación, para que nunca pierdas una partida sin querer.")));
    }else{
      pintarFormularioCuenta(pn.cuerpo, {});
    }
    /* si la config se pegó a mano en el juego, dejar reconfigurar/borrar */
    if(nubeActiva() && typeof nubeConfigManual==="function" && nubeConfigManual()){
      const bReconf=el("button","btn-aqua chico gris","Cambiar conexión a la nube"); bReconf.style.marginTop="8px";
      bReconf.onclick=()=>{ if(confirm("¿Borrar la URL y la llave guardadas en este navegador? (No borra tu cuenta ni tu partida en la nube.)")){ if(typeof nubeSalir==="function") nubeSalir(); nubeGuardarConfig("",""); aviso("Conexión borrada"); render(); } };
      pn.cuerpo.appendChild(bReconf);
    }
    v.appendChild(pn);
  }

  /* ---- Modo Dios y modo dev: solo con partida abierta ---- */
  if(!E) return;

  /* ---- Modo Dios (panel de cheats) ---- */
  const pg=panel("Modo Dios","😇","alerta");
  pg.cuerpo.appendChild(el("p","mini","Panel de trucos: cambias todo a mano. <b>Ojo:</b> apenas lo activas, esta partida <b>deja de dar logros</b> (no vale hacer trampa). Puedes seguir jugando igual."));
  if(E.flags.modoDiosUsado) pg.cuerpo.appendChild(el("div","resul mitad","🔒 En esta partida los logros están <b>bloqueados</b> porque usaste Modo Dios."));
  const tog=el("button","btn-aqua chico"+(E.flags.modoDios?"":" gris"),E.flags.modoDios?"Modo Dios: ON":"Activar Modo Dios");
  tog.onclick=()=>{
    if(!E.flags.modoDios && !E.flags.modoDiosUsado){
      if(!confirm("Activar Modo Dios va a BLOQUEAR los logros de esta partida para siempre (no se puede deshacer). ¿Seguro?")) return;
      E.flags.modoDiosUsado=true;
    }
    E.flags.modoDios=!E.flags.modoDios; guardar(); render();
  };
  pg.cuerpo.appendChild(tog);
  if(E.flags.modoDios){
    const cheat=(label,fn)=>{ const b=el("button","btn-aqua chico"); b.textContent=label; b.style.margin="4px 4px 0 0"; b.onclick=()=>{ fn(); guardar(); render(); }; pg.cuerpo.appendChild(b); };
    pg.cuerpo.appendChild(el("h3","sub","Plata y club"));
    cheat("Caja club +1000",()=>aplicarEfectos({plata:1000}));
    cheat("Caja club MAX",()=>{ E.plata=99999; });
    cheat("Bolsillo +500",()=>{ E.personal.bolsillo+=500; });
    cheat("Bolsillo +100.000",()=>{ E.personal.bolsillo+=100000; });
    cheat("Capital +50",()=>{ E.capital=Math.min(999,(E.capital||0)+50); });
    cheat("Deuda = 0",()=>{ E.deuda=0; });
    cheat("Riesgo = 0",()=>{ E.ind.riesgo=0; });
    cheat("Desfalco = 0",()=>{ E.flags.desfalco=0; E.flags.investigacionAbierta=false; });
    pg.cuerpo.appendChild(el("h3","sub","Plantel y ánimo"));
    cheat("Plantel +5 nivel",()=>{ E.plantel.forEach(j=>{ if(!j.vendido) j.nivel=clamp(j.nivel+5,0,99); }); E.ind.plantel=clamp(Math.round(mediaPlantel()),0,100); });
    cheat("Plantel de crack (nivel 90)",()=>{ E.plantel.forEach(j=>{ if(!j.vendido) j.nivel=Math.max(j.nivel,90); }); E.ind.plantel=clamp(Math.round(mediaPlantel()),0,100); });
    cheat("Moral / hinchada 90",()=>{ E.ind.moral=90; E.ind.hinchada=90; });
    cheat("Todo el club 90",()=>{ Object.keys(E.ind).forEach(k=>{ if(k!=="riesgo") E.ind[k]=Math.max(E.ind[k],90); }); E.ind.riesgo=Math.min(E.ind.riesgo,15); });
    cheat("Curar lesionados",()=>{ E.plantel.forEach(j=>j.lesion=0); });
    cheat("Quitar cansancio",()=>{ E.plantel.forEach(j=>j.cansancio=0); });
    cheat("Todos los grupos +30",()=>{ GRUPOS.forEach(g=>{ E.grupos[g.id].aprob=clamp(E.grupos[g.id].aprob+30,-100,100); }); });
    cheat("Todos los grupos contentos",()=>{ GRUPOS.forEach(g=>{ E.grupos[g.id].aprob=Math.max(E.grupos[g.id].aprob,60); }); });
    pg.cuerpo.appendChild(el("h3","sub","Imagen y vida"));
    cheat("Imagen pública 90",()=>{ E.rep.publica=90; E.rep.credibilidad=Math.max(E.rep.credibilidad,80); });
    cheat("Bienestar 100",()=>{ if(E.perfil) E.perfil.bienestar=100; });
    cheat("Pareja feliz",()=>{ if(E.perfil&&E.perfil.pareja) E.perfil.pareja.nivel=100; });
    pg.cuerpo.appendChild(el("h3","sub","Resultados y eventos"));
    cheat("Ganar el próximo (forzar)",()=>{ E.flags.diosGana=true; aviso("El próximo partido lo tienes ganado."); });
    cheat("Sumar un título",()=>{ E.titulos.push("Título (Modo Dios) "+E.anio); });
    cheat("Decisión al azar",()=>{ if(typeof generarDecisionProc==="function"){ const d=generarDecisionProc(); if(d) E.decPend.push({id:d.id,clave:d.id+"_"+E.anio,peso:d.peso}); } });
    const bve=el("button","btn-aqua chico"); bve.textContent="Evento de vida"; bve.style.margin="4px 4px 0 0";
    bve.onclick=()=>{ if(typeof modalVidaProc==="function"&&typeof VIDA_PROC!=="undefined") modalVidaProc(elige(VIDA_PROC)); };
    pg.cuerpo.appendChild(bve);
    const bst=el("button","btn-aqua chico"); bst.textContent="Historia del club"; bst.style.margin="4px 4px 0 0";
    bst.onclick=()=>{ if(typeof sembrarStoryline==="function"){ E.slCooldown=0; sembrarStoryline(); render(); } };
    pg.cuerpo.appendChild(bst);
  }
  v.appendChild(pg);

  /* ---- Modo desarrollador (clave) : para probar CADA cosa ---- */
  const pdev=panel("Modo desarrollador","🧪","alerta");
  if(!devOn()){
    pdev.cuerpo.appendChild(el("p","mini","Panel oculto para probar cada mecánica del juego (penales, tiros libres, eventos…). Pide la clave."));
    const bu=el("button","btn-aqua chico","🔒 Desbloquear");
    bu.onclick=()=>{
      const cl=prompt("Clave de desarrollador:");
      if(cl==="peomojon"){ DEV_ON=true; if(!E.flags)E.flags={}; E.flags.dev=true; guardar(); render(); aviso("Modo desarrollador ON 🧪"); }
      else if(cl!=null) aviso("Clave incorrecta");
    };
    pdev.cuerpo.appendChild(bu);
  }else{
    pdev.cuerpo.appendChild(el("p","mini","Activo. En un partido en curso aparece el botón <b>🧪 Probar</b> para forzar penal, tiro libre, roja, gol, autogol, VAR, etc."));
    const bp=el("button","btn-aqua chico verde","▶ Partido de prueba ya");
    bp.onclick=()=>{
      const part=(typeof proximoPartido==="function")?proximoPartido():null;
      if(!part){ aviso("No hay partido próximo en el calendario"); return; }
      if(typeof arrancarPartido==="function"){ arrancarPartido(part,"dirigir"); }
    };
    pdev.cuerpo.appendChild(bp);
    const cheatd=(label,fn)=>{ const b=el("button","btn-aqua chico"); b.textContent=label; b.style.margin="4px 4px 0 0"; b.onclick=()=>{ fn(); guardar(); render(); }; pdev.cuerpo.appendChild(b); };
    /* 7.9021 · lo primero del panel: COMPROBAR, no hacer trampa. */
    pdev.cuerpo.appendChild(el("h3","sub","🩺 Doctor · revisar que todo esté sano"));
    pdev.cuerpo.appendChild(el("p","mini","Corre los invariantes del motor, la tabla, el contenido y la interfaz sobre esta partida. Los pesados simulan sobre una copia y la restauran."));
    const bdoc=el("button","btn-aqua ancho verde","🩺 Revisar todo (doctor)");
    bdoc.onclick=function(){
      if(typeof devDoctor!=="function"){ aviso("El doctor no cargó."); return; }
      const res=devDoctor();
      modal(function(box){
        const cu=(typeof montarBarraSO==="function")
          ? montarBarraSO(box,"🩺 Doctor · "+res.veredicto,"🩺",cerrarModal)
          : (function(){ box.appendChild(el("div","cab",'<span class="ic">🩺</span><span>Doctor</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();
        if(typeof devPintarDoctor==="function") devPintarDoctor(cu);
      },{clase:"ventana-so dev-editor"});
    };
    pdev.cuerpo.appendChild(bdoc);
    pdev.cuerpo.appendChild(el("h3","sub","Avanzar / simular"));
    cheatd("Avanzar semana",()=>{ if(typeof avanzar==="function") avanzar(); });
    cheatd("Simular 5 fechas",()=>{ if(typeof avanzarRapido==="function"){ for(let i=0;i<5;i++) avanzarRapido(false); } });
    cheatd("Simular temporada",()=>{ if(typeof avanzarRapido==="function") avanzarRapido(true); });
    cheatd("Saltar de año",()=>{ if(typeof nuevoAnio==="function") nuevoAnio(); });
    pdev.cuerpo.appendChild(el("h3","sub","Inyectar / probar"));
    cheatd("Forzar decisión",()=>{ if(typeof generarDecisionProc==="function"){ const d=generarDecisionProc(); if(d) E.decPend.push({id:d.id,clave:d.id+"_"+E.anio,peso:d.peso}); } });
    cheatd("Negociación",()=>{ if(typeof generarNegociacion==="function"&&typeof modalNegociacion==="function"){ const n=generarNegociacion(); if(n) modalNegociacion(n); } });
    cheatd("Storyline",()=>{ if(typeof sembrarStoryline==="function"){ E.slCooldown=0; sembrarStoryline(); render(); } });
    cheatd("Lesionar a uno",()=>{ const vivos=E.plantel.filter(j=>!j.vendido&&!(j.lesion>0)); if(vivos.length){ const j=elige(vivos); j.lesion=ri(2,5); aviso(j.n+" lesionado "+j.lesion+" fechas"); } });
    pdev.cuerpo.appendChild(el("h3","sub","Logros / datos"));
    cheatd("Desbloquear TODOS los logros",()=>{ if(typeof LOGROS!=="undefined"){ const bloq=E.flags&&E.flags.modoDiosUsado; if(bloq){ aviso("Los logros están bloqueados (usaste Modo Dios)"); return; } E.logros=E.logros||{}; LOGROS.forEach(l=>{ if(!E.logros[l.id]) E.logros[l.id]={anio:E.anio}; }); aviso("Todos los logros marcados (dev)"); } });
    cheatd("Ver estado (consola)",()=>{ try{ console.log("E=",E); aviso("Volcado E en la consola (F12)"); }catch(e){} });
    cheatd("+1000 caja",()=>{ if(typeof aplicarEfectos==="function") aplicarEfectos({plata:1000}); });
    const bo=el("button","btn-aqua chico rojo","Apagar modo dev"); bo.style.margin="8px 4px 0 0";
    bo.onclick=()=>{ DEV_ON=false; if(E.flags) E.flags.dev=false; guardar(); render(); aviso("Modo dev OFF"); };
    pdev.cuerpo.appendChild(bo);
  }
  v.appendChild(pdev);
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
    const cuerpo=(typeof montarBarraSO==="function")
      ? montarBarraSO(box,"Próximo partido","📅",cerrarModal)
      : (function(){ box.appendChild(el("div","cab",'<span class="ic">📅</span><span>Hay un partido en el calendario</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();
    cuerpo.appendChild(el("h2","tit",(part.local?"vs ":"visita a ")+escHtml(part.rivalNombre)));
    cuerpo.appendChild(el("p","mini",(typeof etqCompromiso==="function"?etqCompromiso(part):(part.tipo==="copa"?(part.torneo||"Copa")+" · "+part.ronda:"fecha "+part.fecha))+
      " · "+fechaTxt(part.f)+" · "+escHtml(part.sede||"")));
    const once=(typeof onceIdeal==="function")?onceIdeal():[];
    const cans=(once||[]).filter(function(j){ return (j.cansancio||0)>=16; }).length;
    const bits=[];
    if(part.tipo==="copa") bits.push("Copa: no es un amistoso.");
    if(typeof esClasico==="function"&&esClasico(part)) bits.push("Clásico. Vale doble para la gente.");
    if(cans) bits.push(cans+" con las piernas pesadas.");
    const ment=(E.tactica&&E.tactica.mentalidad)||"Equilibrado";
    bits.push("Plan actual: "+ment+".");
    if(part.clima) bits.push("Clima: "+part.clima+".");
    if(part.fuerzaRival) bits.push("Rival a ojo: "+part.fuerzaRival+".");
    cuerpo.appendChild(el("p",null,bits.join(" ")));
    cuerpo.appendChild(el("p","mini","Avanzar no salta fechas. Lo diriges tú, o lo dejas al plan que ya armaste — ves el marcador al toque."));
    const b1=el("button","btn-aqua ancho verde cta-jugar","Dirigir el partido");
    b1.onclick=()=>{ cerrarModal(); if(typeof pantallaPrevia==="function") pantallaPrevia(part); };
    const b2=el("button","btn-aqua ancho","Simular con este plan");
    b2.onclick=()=>{
      cerrarModal();
      if(typeof simularDesdeAvance==="function") simularDesdeAvance(part);
      else if(typeof arrancarPartido==="function") arrancarPartido(part,"simular");
    };
    const b3=el("button","btn-aqua ancho gris","Volver al escritorio");
    b3.style.marginTop="6px";
    b3.onclick=()=>{ cerrarModal(); irA("escritorio"); };
    cuerpo.appendChild(b1); cuerpo.appendChild(b2); cuerpo.appendChild(b3);
  },{cerrarFuera:false,clase:"ventana-so"});
}
function simularDesdeAvance(part){
  if(!part||typeof iniciarPartido!=="function") return;
  const P=iniciarPartido(part,"simular");
  if(typeof correrHasta==="function") correrHasta(P,90);
  const res=(typeof terminarPartido==="function")?terminarPartido(P):{yo:0,otro:0};
  if(typeof persistirTicker==="function") try{ persistirTicker(P,res); }catch(e){}
  if(typeof guardar==="function") guardar();
  modal(function(box){
    const gano=res.yo>res.otro;
    const empate=res.yo===res.otro;
    const cuerpo=(typeof montarBarraSO==="function")
      ? montarBarraSO(box,"Final · simulado",gano?"⚽":"📄",function(){ cerrarModal(); irA("escritorio"); })
      : (function(){ box.appendChild(el("div","cab",'<span class="ic">📄</span><span>Final del partido</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();
    const yoN=(typeof E!=="undefined"&&E&&E.clubNombre)||"Tú";
    const rivN=part.rivalNombre||"rival";
    cuerpo.appendChild(el("h2","tit arco-marcador",(gano?"Victoria":(empate?"Empate":"Derrota"))));
    cuerpo.appendChild(el("p","arco-score",escHtml(yoN)+"  "+res.yo+" – "+res.otro+"  "+escHtml(rivN)));
    cuerpo.appendChild(el("p","mini",(part.local?"Local":"Visita")+" · "+(typeof etqCompromiso==="function"?etqCompromiso(part):(part.torneo||"Liga"))+" · plan "+((E.tactica&&E.tactica.mentalidad)||"Equilibrado")+"."));
    const goles=(res.golesDetalle||[]).slice().sort(function(a,b){ return a.min-b.min; });
    if(goles.length){
      cuerpo.appendChild(el("p","mini","Goles: "+goles.map(function(g){ return g.min+"' "+g.quien+(g.propio?"":" (ellos)")+(g.tipo&&g.tipo!=="jugada"?" ["+g.tipo+"]":""); }).join(" · ")));
    } else cuerpo.appendChild(el("p","mini","Sin goles."));
    const bits=[];
    if(res.tarjetas&&res.tarjetas.length) bits.push("Amarillas: "+res.tarjetas.join(", "));
    if(res.lesionados&&res.lesionados.length) bits.push("Lesionados: "+res.lesionados.join(", "));
    if(P.stats){
      const pos=Math.round((P.stats.pos||0.5)*100);
      bits.push("Posesión "+pos+"% · remates "+(P.stats.remMio||0)+"-"+(P.stats.remRiv||0)+" · córners "+(P.stats.corMio||0)+"-"+(P.stats.corRiv||0));
    }
    if(bits.length) cuerpo.appendChild(el("p","mini",bits.join(" · ")));
    const prox=(typeof proximoPartido==="function")?proximoPartido():null;
    if(prox&&!prox.jugado) cuerpo.appendChild(el("p","mini","Siguiente: "+(prox.local?"vs ":"visita a ")+escHtml(prox.rivalNombre||"")+" · "+(typeof fechaTxt==="function"?fechaTxt(prox.f):"")));
    /* 7.9011 · el partido tuyo no es todo: la fecha sigue y se ve. */
    const nOtros=((E.ultimaJornada&&E.ultimaJornada.otros)||E.ultimaFecha||[]).length;
    const bx=el("button","btn-aqua ancho verde",nOtros?("📻 "+T("jor_ver","Ver cómo se jugó la fecha")):T("jor_esc","Al escritorio"));
    bx.onclick=function(){
      if(nOtros&&typeof jornadaEnVivo==="function"){ cerrarModal(); jornadaEnVivo(function(){ irA("escritorio"); }); return; }
      cerrarModal(); irA("escritorio");
    };
    cuerpo.appendChild(bx);
    if(nOtros){
      const bs=el("button","btn-aqua ancho gris",T("jor_esc","Al escritorio"));
      bs.style.marginTop="6px";
      bs.onclick=function(){ cerrarModal(); irA("escritorio"); };
      cuerpo.appendChild(bs);
    }
  },{cerrarFuera:false,clase:"ventana-so"});
}
function modalCierreTemporada(){
  modal(function(box){
    const cuerpo=(typeof montarBarraSO==="function")
      ? montarBarraSO(box,"Cierre de temporada","🏁",cerrarModal)
      : (function(){ box.appendChild(el("div","cab",'<span class="ic">🏁</span><span>Cierre de temporada</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();
    cuerpo.appendChild(el("p",null,"Se acabó el calendario "+E.anio+". Al cerrar se reparte plata, se juegan los ascensos y descensos, y saltas al año siguiente. No se puede deshacer."));
    const ok=el("button","btn-aqua ancho verde","Cerrar la temporada");
    ok.onclick=function(){ cerrarModal(); if(typeof cerrarTemporada==="function") cerrarTemporada(); };
    const no=el("button","btn-aqua ancho gris","Todavía no");
    no.style.marginTop="6px"; no.onclick=cerrarModal;
    cuerpo.appendChild(ok); cuerpo.appendChild(no);
  },{cerrarFuera:false,clase:"ventana-so"});
}
/* 4.c · cosas que conviene atender antes de avanzar (no bloqueantes).
   `fuerte:true` = amerita un aviso antes de avanzar; el resto solo se lista. */
/* 7.9006 · resalta 2s un elemento recién renderizado (para "atiende" y metas). */
function _resaltar(elm){
  if(!elm) return;
  try{ elm.scrollIntoView({behavior:"smooth",block:"center"}); }catch(e){ try{ elm.scrollIntoView(); }catch(e2){} }
  elm.classList.add("resaltado");
  setTimeout(function(){ try{ elm.classList.remove("resaltado"); }catch(e){} },2100);
}
/* 7.9013 · lleva la vista al panel cuya cabecera contiene `txt` y lo resalta. */
function _irAPanel(txt){
  if(!txt){ return; }
  const t=String(txt).toLowerCase();
  const ps=document.querySelectorAll("#vista .panel");
  for(let i=0;i<ps.length;i++){
    const cab=ps[i].querySelector(".cab");
    if(cab && (cab.textContent||"").toLowerCase().indexOf(t)>=0){ _resaltar(ps[i]); return; }
  }
  if(ps.length) _resaltar(ps[0]);
}
function _buscarMarcar(sel,valor){
  setTimeout(function(){
    const cards=document.querySelectorAll("#vista "+sel);
    for(let i=0;i<cards.length;i++){ if(valor==null || cards[i].getAttribute("data-meta")===String(valor)){ _resaltar(cards[i]); return; } }
    const pnl=document.querySelector("#vista .panel"); if(pnl) _resaltar(pnl);
  },70);
}
/* 7.9006 · click en una meta = ACCIÓN, no un párrafo. Deportiva → previa/pizarra;
   económica → Finanzas; institucional → Institución. En riesgo → el ayudante da la
   lectura Y el botón para ir a trabajarla (un cerebro, dos entradas). */
function metaNavegar(o, pr){
  if(pr && pr.cumplido){ aviso(T("meta_ok","Meta cumplida. El directorio la da por buena.")); return; }
  if(pr && pr.estado==="riesgo"){ _ayudanteMeta(o); return; }
  const cat=o&&o.cat;
  if(cat==="economico"){ irA("finanzas"); _buscarMarcar(".panel", null); }
  else if(cat==="institucional"){ irA("institucion"); _buscarMarcar(".panel", null); }
  else { irA("escritorio"); _buscarMarcar(".cta-jugar", null); }
}
function _ayudanteMeta(o){
  irA("escritorio");
  setTimeout(function(){
    const inp=document.getElementById("ay-input"), btn=document.getElementById("ay-btn");
    if(inp){
      inp.value=T("meta_pregunta","¿Qué hago con la meta")+": "+((o&&o.t)||"")+"?";
      if(btn) btn.click();
      _resaltar(inp.closest?(inp.closest(".panel")||inp):inp);
    }
  },90);
}
/* Un solo cerebro para "Atiende": abre la decisión, lleva a la meta o a la sección y MARCA. */
function atenderPendiente(it){
  if(!it) return;
  if(it.abre==="decision" && typeof decisionPorId==="function"){
    const d=decisionPorId(it.decId);
    if(d){ abrirDecision(d,true); return; }
  }
  if(it.abre==="meta"){
    irA("escritorio");
    _buscarMarcar("[data-meta]", it.metaId);
    return;
  }
  irA(it.ir);
  if(it.ir==="finanzas"||it.ir==="institucion"||it.ir==="avisos") _buscarMarcar(".panel", null);
}
function pendientesAtender(){
  const p=[]; if(!E) return p;
  const urg=(E.decPend||[]).filter(x=>x.peso==="alto");
  if(urg.length) p.push({ic:"📥",fuerte:true,t:urg.length===1?"1 decisión urgente sin resolver":(urg.length+" decisiones urgentes sin resolver"),d:"Toca para abrir la primera.",abre:"decision",decId:urg[0].id,ir:"escritorio"});
  if(typeof notifsAccionables==="function"){ const a=notifsAccionables(); if(a.length) p.push({ic:"📨",fuerte:true,t:a.length+" aviso"+(a.length>1?"s":"")+" que requiere"+(a.length>1?"n":"")+" tu respuesta",d:"Ofertas o pedidos esperando.",ir:"avisos"}); }
  if(Array.isArray(E.objetivos) && typeof progresoObjetivo==="function"){ const r=E.objetivos.filter(o=>progresoObjetivo(o).estado==="riesgo"); if(r.length) p.push({ic:"🎯",t:"Meta en riesgo: "+r[0].t,d:"Toca para ir a resolverla.",abre:"meta",metaId:r[0].id||r[0].t,ir:"escritorio"}); }
  if(typeof quimicaEquipo==="function" && typeof onceIdeal==="function"){ const q=quimicaEquipo(onceIdeal()); if(q.prom<48) p.push({ic:"🔗",t:"Química floja ("+q.prom+"/100)",d:"Acomoda la pizarra antes del partido.",ir:"escritorio"}); }
  if(E.ind && E.ind.moral<42) p.push({ic:"👥",t:"Camarín cortado (moral "+Math.round(E.ind.moral)+")",d:"Puedes reconquistarlos en Finanzas.",ir:"institucion"});
  if(E.flags && E.flags.sueldosAtrasados) p.push({ic:"💸",fuerte:true,t:"Sueldos atrasados",d:"El camarín se resiente cada semana.",ir:"finanzas"});
  if(E.flags && E.flags.tribunaCerrada) p.push({ic:"🚧",fuerte:true,t:"Popular clausurada",d:"La hinchada está caliente. Baja el aforo hasta que el clima mejore.",ir:"institucion"});
  return p;
}
function modalAtiende(pend){
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">⚠️</span><span>Atiende antes de avanzar</span>'));
    const cc=el("div","cuerpo"); box.appendChild(cc);
    cc.appendChild(el("p","mini","Tienes cosas sin resolver. Toca una para ir a atenderla, o avanza igual:"));
    pend.forEach(it=>{ const b=el("button","op"+(it.fuerte?" op-alerta":"")); b.innerHTML='<div class="t">'+it.ic+" "+it.t+'</div>'+(it.d?'<div class="req">'+it.d+'</div>':""); b.onclick=()=>{ cerrarModal(); atenderPendiente(it); }; cc.appendChild(b); });
    const bx=el("button","btn-aqua ancho gris","Avanzar igual"); bx.style.marginTop="8px"; bx.onclick=()=>{ cerrarModal(); avanzar(); };
    cc.appendChild(bx);
  },{cerrarFuera:false});
}
/* 5 · AVANCE RÁPIDO: delegar todo y simular sin jugar en vivo (partidas rápidas / videos).
   Reusa el motor headless (iniciarPartido→correrHasta(90)→terminarPartido, todo state-puro). */
function delegarDecisionesPendientes(){
  let n=0;
  const pend=(E.decPend||[]).slice();   /* snapshot: resolverDecision muta E.decPend */
  pend.forEach(x=>{
    try{
      const d=(typeof decisionPorId==="function")?decisionPorId(x.id):null;
      if(!d||!d.op||!d.op.length) return;
      let idx=0;
      for(let i=0;i<d.op.length;i++){ const ok=(typeof requisitoCumplido==="function")?requisitoCumplido(d.op[i]).ok:true; if(ok){ idx=i; break; } }
      resolverDecision(d,idx); n++;
    }catch(e){}
  });
  return n;
}
function procesarSemanaRapido(){
  const neto=tickSemana();
  if(typeof chequearDesfalco==="function") chequearDesfalco();
  repartirDecisiones();
  if(typeof eventosDeContexto==="function") eventosDeContexto();
  if(typeof generarOfertasSemana==="function") generarOfertasSemana();
  if(typeof sembrarDecisionProc==="function") sembrarDecisionProc();
  return neto;   /* en rápido NO se disparan eventos/vida/negociación con modal */
}
function avanzarRapido(hastaFin){
  if(!E||E.carrera.fin||E.carrera.enParo) return {fechas:0,partidos:0,ganados:0,freno:"sin partida activa"};
  let fechas=0,partidos=0,ganados=0,freno=null;
  const tope=hastaFin?400:1;
  while(fechas<tope){
    if(E.carrera.fin){ freno="fin de la carrera"; break; }
    if(E.carrera.enParo){ freno="quedaste sin club"; break; }
    if(E.dinastia&&E.dinastia.sucesionPendiente){ freno="hay una sucesión que resolver"; break; }
    if(typeof crisisActiva==="function" && crisisActiva()){ freno="hay una crisis que atender — resolvela y seguí"; break; }
    delegarDecisionesPendientes();
    const part=proximoPartido();
    if(!part){ freno="fin de la temporada — apretá Avanzar para el cierre"; break; }
    if(!part.jugado){
      const antes=(E.temporada&&E.temporada.pg)||0;
      const P=iniciarPartido(part,"simular");
      correrHasta(P,90);
      terminarPartido(P);                 /* state-puro: idx++, tabla, plata, notifs */
      partidos++;
      if(((E.temporada&&E.temporada.pg)||0)>antes) ganados++;
    }
    procesarSemanaRapido();
    fechas++;
    if(!hastaFin) break;
  }
  if(!E._bulkSim){
    if(typeof render==="function"){ SEC="escritorio"; render(); }
    if(typeof guardar==="function") guardar();
  }
  return {fechas:fechas,partidos:partidos,ganados:ganados,freno:freno};
}
/* 7.9022 · avanzarRapido(true) juega una temporada ENTERA de un tirón (hasta
   400 fechas), bloqueando el hilo: el overlay de "Simular N temporadas" solo
   podía pintar ENTRE temporadas, nunca fecha a fecha (pedido del autor: "que
   se vea qué está pasando... que no se ralentice, se pueda ver incluso").
   Misma lógica de avanzarRapido, en lotes chicos que ceden el hilo con
   setTimeout: el navegador puede repintar entre lotes sin frenar la corrida
   real (mismo E._bulkSim, mismas condiciones de freno). avanzarRapido() queda
   intacto: lo siguen usando los botones de una sola fecha / una temporada. */
function avanzarRapidoLote(onProgreso, onListo){
  if(!E||E.carrera.fin||E.carrera.enParo){ onListo({fechas:0,partidos:0,ganados:0}); return; }
  let fechas=0, partidos=0, ganados=0;
  const LOTE=4;
  function paso(){
    if(!E||E._bulkCancel){ onListo({fechas:fechas,partidos:partidos,ganados:ganados}); return; }
    let enLote=0;
    while(enLote<LOTE){
      if(E.carrera.fin||E.carrera.enParo) return onListo({fechas:fechas,partidos:partidos,ganados:ganados});
      if(E.dinastia&&E.dinastia.sucesionPendiente) return onListo({fechas:fechas,partidos:partidos,ganados:ganados});
      if(typeof crisisActiva==="function" && crisisActiva()) return onListo({fechas:fechas,partidos:partidos,ganados:ganados});
      delegarDecisionesPendientes();
      const part=proximoPartido();
      if(!part) return onListo({fechas:fechas,partidos:partidos,ganados:ganados});   /* temporada completa */
      if(!part.jugado){
        const antes=(E.temporada&&E.temporada.pg)||0;
        const P=iniciarPartido(part,"simular");
        correrHasta(P,90);
        terminarPartido(P);
        partidos++;
        if(((E.temporada&&E.temporada.pg)||0)>antes) ganados++;
      }
      procesarSemanaRapido();
      fechas++; enLote++;
    }
    if(onProgreso) onProgreso({fechas:fechas,partidos:partidos,ganados:ganados});
    setTimeout(paso,0);
  }
  setTimeout(paso,0);
}
/* Texto del overlay de simulación: UNA sola función, la usa la UI real y el
   Doctor (chequeo "sim_progreso_visible") para no tener dos versiones que
   puedan desalinearse. ctx: {temp,tope,anio,club,fecha,totFechas,pos,campeonAnterior}. */
function _simTextoProgreso(ctx){
  ctx=ctx||{};
  const Tf=typeof T==="function"?T:function(k,d){ return d; };
  const partes=[Tf("sim_prog","Temporada ")+ctx.temp+Tf("sim_de"," de ")+ctx.tope+" · "+ctx.anio+" · "+(ctx.club||"")];
  if(ctx.fecha!=null) partes.push(Tf("sim_fecha","fecha")+" "+ctx.fecha+(ctx.totFechas?"/"+ctx.totFechas:""));
  if(ctx.pos) partes.push(Tf("sim_pos","posición")+" "+(typeof ordinal==="function"?ordinal(ctx.pos):ctx.pos+"°"));
  if(ctx.campeonAnterior) partes.push(Tf("sim_ultcamp","último campeón")+": "+ctx.campeonAnterior);
  return partes.join(" · ");
}
/* 7.67 · SIMULAR VARIAS TEMPORADAS (testeo hasta el final). Juega lo que queda de
   la temporada, la cierra sola (finDeTemporada), juega la liguilla si toca (postura
   equilibrada), y si te echan toma un club de rescate para seguir. Deja el historial
   lleno "como si hubieras jugado" — el resultado lo decide el juego, no un truco. */
function simularTemporadas(nTemps){
  return simularTemporadasSync(nTemps);
}
function simularTemporadasSync(nTemps){
  if(!E||E.carrera.fin){ return {temps:0,freno:"sin partida activa",anio:E&&E.anio}; }
  let temps=0, freno=null;
  const tope=Math.max(1,Math.min(nTemps||1,60));
  const prevBulk=!!E._bulkSim;
  E._bulkSim=true;
  if(!E._simSal) E._simSal=String(Date.now())+"-"+Math.floor(Math.random()*1e9);
  try{
    for(let s=0;s<tope;s++){
      if(E.carrera.fin){ freno="fin de la carrera"; break; }
      avanzarRapido(true);
      if(typeof proximoPartido==="function" && proximoPartido()){
        freno="se frenó antes del cierre (crisis/sucesión: resolvela y seguí)"; break;
      }
      if(typeof finDeTemporada==="function") finDeTemporada();
      if(E.liguillaPend){
        const sim=(typeof simularLiguilla==="function")?simularLiguilla(E.liguillaPend.rival,0):{gano:Math.random()<0.5};
        if(typeof liguillaResolverAscenso==="function") liguillaResolverAscenso(sim.gano);
      }
      if(typeof riesgoDestitucion==="function" && riesgoDestitucion()){
        if(typeof destituir==="function") destituir("Simulación: el directorio cerró el ciclo tras "+E.anio+".");
        const of=(typeof ofertaDeRescate==="function")?ofertaDeRescate():[];
        if(of.length && typeof aceptarClub==="function"){ aceptarClub(of[0].id, E.anio+1); }
        else { if(typeof finDeCarrera==="function") finDeCarrera("Sin club para seguir dirigiendo."); else E.carrera.fin=true; freno="sin club para seguir"; break; }
      } else if(typeof nuevoAnio==="function"){ nuevoAnio(); }
      temps++;
    }
  } finally {
    E._bulkSim=prevBulk;
    if(!E._bulkSim) delete E._simSal;
  }
  if(!E._bulkSim){
    if(typeof mundoInit==="function"){ try{ mundoInit(); }catch(e){} }
    if(typeof render==="function"){ SEC="escritorio"; render(); }
    if(typeof guardar==="function") guardar();
  }
  return {temps:temps, freno:freno, anio:E&&E.anio};
}
function pintarSimOverlay(tit, sub, cancelable){
  let o=document.getElementById("simOverlay");
  if(!o){
    o=document.createElement("div"); o.id="simOverlay";
    document.body.appendChild(o);
  }
  o.classList.remove("oculto"); o.removeAttribute("hidden");
  const esc=(typeof escHtml==="function")?escHtml:function(s){ return String(s==null?"":s); };
  o.innerHTML='<div class="sim-box"><div class="sim-t">'+esc(tit)+'</div><div class="sim-d">'+esc(sub)+'</div>'
    +(cancelable?'<button type="button" class="btn-aqua" id="simCancel">'+(typeof T==="function"?T("sim_cancel","Cancelar y volver al año de origen"):"Cancelar y volver al año de origen")+'</button>':'')
    +'</div>';
  const b=document.getElementById("simCancel");
  if(b) b.onclick=function(){ if(E) E._bulkCancel=true; };
}
function cerrarSimOverlay(){
  const o=document.getElementById("simOverlay");
  if(o){ o.classList.add("oculto"); o.setAttribute("hidden",""); o.innerHTML=""; }
}
function simularTemporadasAsync(nTemps){
  if(!E||E.carrera.fin){ if(typeof aviso==="function") aviso("No hay una partida activa"); return; }
  if(E._bulkSim){ if(typeof aviso==="function") aviso("Ya hay una simulación en curso"); return; }
  const tope=Math.max(1,Math.min(nTemps||1,60));
  const snap=(typeof clonarPartida==="function")?clonarPartida(E):null;
  const anio0=E.anio;
  E._bulkSim=true; E._bulkCancel=false;
  E._simSal=String(Date.now())+"-"+Math.floor(Math.random()*1e9);
  let temps=0, freno=null, cancelado=false, ultimoCampeon=null;
  const Tfn=typeof T==="function"?T:function(k,d){ return d; };
  pintarSimOverlay(
    Tfn("sim_tit","Simulando temporadas"),
    Tfn("sim_txt","El club sigue, no se trabó.")+" "+Tfn("sim_backhint","Si cancelas, volvemos al año de origen.")+" "+anio0+".",
    true
  );
  /* 7.9022 · se ve fecha a fecha (año, fecha, posición), no solo el año entre
     temporadas. avanzarRapidoLote cede el hilo cada 4 fechas: el overlay
     repinta de verdad, la corrida no se ralentiza. */
  function progresoFecha(r){
    const pos=(typeof posicionEnTabla==="function")?posicionEnTabla():0;
    pintarSimOverlay(
      Tfn("sim_tit","Simulando temporadas"),
      _simTextoProgreso({temp:temps+1,tope:tope,anio:E.anio,club:E.clubNombre||E.club,
        fecha:r.fechas,totFechas:(E.calendario||[]).length,pos:pos,campeonAnterior:ultimoCampeon}),
      true
    );
  }
  function pasoTemporada(){
    if(!E||E._bulkCancel){
      cancelado=true;
      freno="cancelaste";
      return fin();
    }
    if(E.carrera.fin){ freno="fin de la carrera"; return fin(); }
    if(temps>=tope) return fin();
    try{
      avanzarRapidoLote(progresoFecha, function(){
      if(E._bulkCancel){ cancelado=true; freno="cancelaste"; return fin(); }
      if(typeof proximoPartido==="function" && proximoPartido()){
        freno="se frenó antes del cierre (crisis/sucesión: resolvela y seguí)";
        return fin();
      }
      /* el campeón del año que CIERRA, antes de reiniciar la tabla (si no,
         se pierde: nuevoAnio()→reiniciarTabla() la deja en cero) */
      try{
        const tabla=(typeof tablaOrdenada==="function")?tablaOrdenada():[];
        if(tabla[0]) ultimoCampeon=(tabla[0].n||tabla[0].id)+" ("+(tabla[0].pts||0)+" pts)";
      }catch(e){}
      if(typeof finDeTemporada==="function") finDeTemporada();
      if(E.liguillaPend){
        const sim=(typeof simularLiguilla==="function")?simularLiguilla(E.liguillaPend.rival,0):{gano:Math.random()<0.5};
        if(typeof liguillaResolverAscenso==="function") liguillaResolverAscenso(sim.gano);
      }
      if(typeof riesgoDestitucion==="function" && riesgoDestitucion()){
        if(typeof destituir==="function") destituir("Simulación: el directorio cerró el ciclo tras "+E.anio+".");
        const of=(typeof ofertaDeRescate==="function")?ofertaDeRescate():[];
        if(of.length && typeof aceptarClub==="function"){ aceptarClub(of[0].id, E.anio+1); }
        else { if(typeof finDeCarrera==="function") finDeCarrera("Sin club para seguir dirigiendo."); else E.carrera.fin=true; freno="sin club para seguir"; return fin(); }
      } else if(typeof nuevoAnio==="function"){ nuevoAnio(); }
      temps++;
      pintarSimOverlay(
        Tfn("sim_tit","Simulando temporadas"),
        _simTextoProgreso({temp:temps,tope:tope,anio:E.anio,club:E.clubNombre||E.club,campeonAnterior:ultimoCampeon})+
          ". "+Tfn("sim_ok","No se trabó; el juego sigue."),
        true
      );
      setTimeout(pasoTemporada, 0);
      });
    }catch(err){
      freno="se cortó: "+(err&&err.message?err.message:"error");
      return fin();
    }
  }
  function fin(){
    if(cancelado && snap && typeof restaurarPartida==="function"){
      restaurarPartida(snap);
    }
    if(E){ E._bulkSim=false; E._bulkCancel=false; delete E._simSal; }
    cerrarSimOverlay();
    if(typeof mundoInit==="function"){ try{ mundoInit(); }catch(e){} }
    if(typeof render==="function"){ SEC="escritorio"; render(); }
    if(typeof guardar==="function") guardar();
    if(typeof aviso==="function"){
      if(cancelado){
        aviso(Tfn("sim_back","Volviste a ")+(E&&E.anio)+Tfn("sim_back2",". Esta corrida no quedó: la próxima va a ser distinta."), 6500);
      } else {
        aviso("⏭️ "+temps+" temporada"+(temps!==1?"s":"")+" · ahora "+(E&&E.anio)+(freno?" · "+freno:""), 6500);
      }
    }
  }
  setTimeout(pasoTemporada, 30);
}
function modalAvanceRapido(){
  if(!E||E.carrera.fin||E.carrera.enParo){ aviso("No hay una partida activa"); return; }
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">⏩</span><span>Avance rápido</span>'));
    const cc=el("div","cuerpo"); box.appendChild(cc);
    cc.appendChild(el("p","mini","Delego todo por ti: resuelvo las decisiones con criterio, simulo los partidos al toque y avanzo. Ideal para ir rápido o hacer videos. Puedes volver a dirigir cuando quieras."));
    const correr=(hastaFin)=>{ cerrarModal(); const r=avanzarRapido(hastaFin);
      aviso("⏩ "+r.partidos+" partido"+(r.partidos!==1?"s":"")+" simulado"+(r.partidos!==1?"s":"")+" · "+r.ganados+" ganado"+(r.ganados!==1?"s":"")+(r.freno?" · "+r.freno:""),4500); };
    const b1=el("button","btn-aqua ancho verde","⏩ Simular la próxima fecha"); b1.onclick=()=>correr(false);
    const b2=el("button","btn-aqua ancho","⏭️ Simular hasta fin de temporada"); b2.style.marginTop="6px";
    b2.onclick=()=>{ if(confirm("Voy a simular todos los partidos que quedan de la temporada, delegando las decisiones. ¿Seguir?")) correr(true); };
    /* 7.9007 · 40 temporadas ya no traban: overlay + cancelar. */
    cc.appendChild(el("p","mini",(typeof T==="function"?T("sim_ayuda","Para probar el juego a fondo: simulo temporadas enteras. Ves el año en pantalla; no se traba. Si cancelas, volvemos al año de origen — la próxima corrida sale distinta."):"Para probar el juego a fondo: simulo temporadas enteras. Ves el año en pantalla; no se traba. Si cancelas, volvemos al año de origen — la próxima corrida sale distinta.")));
    const correrN=(n,txt)=>{ if(!confirm(txt)) return; cerrarModal(); if(typeof simularTemporadasAsync==="function") simularTemporadasAsync(n); else simularTemporadas(n); };
    const b3=el("button","btn-aqua ancho","⏭️⏭️ Simular 5 temporadas"); b3.style.marginTop="6px";
    b3.onclick=()=>correrN(5,(typeof T==="function"?T("sim_conf5","Voy a simular 5 temporadas. Vas a ver el progreso; si cancelas, volvemos al año de origen. ¿Seguir?"):"Voy a simular 5 temporadas. Vas a ver el progreso; si cancelas, volvemos al año de origen. ¿Seguir?"));
    const b4=el("button","btn-aqua ancho","🏁 Simular hasta el final (máx 40)"); b4.style.marginTop="6px";
    b4.onclick=()=>correrN(40,(typeof T==="function"?T("sim_conf40","Voy a simular hasta 40 temporadas. No se traba. Cancelar te devuelve al año de origen; la próxima corrida no sale igual. ¿Seguir?"):"Voy a simular hasta 40 temporadas. No se traba. Cancelar te devuelve al año de origen; la próxima corrida no sale igual. ¿Seguir?"));
    const b5=el("button","btn-aqua ancho gris","Cancelar"); b5.style.marginTop="6px"; b5.onclick=cerrarModal;
    cc.appendChild(b1); cc.appendChild(b2); cc.appendChild(b3); cc.appendChild(b4); cc.appendChild(b5);
  });
}
function avanzar(){
  if(!E||E.carrera.fin||E.carrera.enParo) return;
  if(typeof partidoEnCurso==="function" && partidoEnCurso()){
    if(typeof volverAlPartido==="function") volverAlPartido();
    if(typeof aviso==="function") aviso(typeof T==="function"?T("hold_avanza","Hay un partido en curso. Vuelve a terminarlo."):"Hay un partido en curso. Vuelve a terminarlo.");
    return;
  }
  const cr=crisisActiva();
  if(cr){ abrirCrisis(cr); return; }
  if(bloqueoDecisiones()) return;
  /* 4.c · nudge suave una vez por semana si hay cosas fuertes sin atender */
  const kf="pendAviso_"+E.anio+"_"+E.idx;
  if(E.flags && !E.flags[kf]){
    const fuertes=pendientesAtender().filter(x=>x.fuerte);
    if(fuertes.length){ E.flags[kf]=true; modalAtiende(fuertes); return; }
  }
  const part=proximoPartido();
  if(!part){
    /* 7.52 / 7.9004 · cierre con modal, no con confirm() del navegador. */
    if(typeof modalCierreTemporada==="function"){ modalCierreTemporada(); return; }
    if(typeof cerrarTemporada==="function") cerrarTemporada();
    return;
  }
  if(!part.jugado){ modalAvancePartido(part); return; }
  const r=procesarSemanaPostPartido();
  if(typeof chequearTinderMentira==="function") chequearTinderMentira();
  /* 7.9011 · la semana deja un parte visible en el escritorio, no un toast que se va. */
  if(typeof parteSemana==="function"){
    const ln=[T("sem_caja","Caja de la semana")+": "+plata(r.neto)];
    (r.ctx||[]).slice(0,2).forEach(function(t){ ln.push(t); });
    if(r.ev&&r.ev.item&&r.ev.item.t) ln.push(r.ev.item.t);
    const nj=((E.ultimaJornada&&E.ultimaJornada.otros)||[]).length;
    if(nj) ln.push(T("sem_otros","Otros partidos de la fecha")+": "+nj);
    parteSemana(ln);
  }
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
    {k:"persuadir",sev:"verde", t:"Persuadir",       d:"Apelas a la razón y al proyecto. Seguro, efecto moderado."},
    {k:"prometer", sev:"amarillo",t:"Prometer aumento",d:"Le tiras plata futura. Suele funcionar, pero pesa en la planilla."},
    {k:"forzar",   sev:"rojo",  t:"Forzar permanencia",d:"Sacas la chapa de autoridad. Alto riesgo si sale mal."},
    {k:"convencer",sev:"morado",t:"Convencer",       d:"Charla larga y personal. Impredecible: puede salir redondo o peor."}
  ];
  modal(box=>{
    box.classList.remove("panel");
    const p=panel("Cara a cara","🗣️","alerta"); p.classList.add("dec");
    p.cuerpo.appendChild(el("span","pilar per","PERSONAL"));
    p.cuerpo.appendChild(el("h2","tit",neg.j.n+" quiere hablar"));
    p.cuerpo.appendChild(el("div","ctx",neg.j.n+" ("+neg.j.pos+", "+neg.j.edad+" años) "+neg.tpl.pedido+". Lo tienes enfrente, hay que responder ahora."));
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
    p.cuerpo.appendChild(el("h2","tit centro",r.copa?("Campeón — "+(r.copaNom||"Copa")):(r.campeon?"Campeón nacional":ordinal(r.pos)+" en el Campeonato Nacional")));
    p.cuerpo.appendChild(fila("Puntos",E.temporada.pts+" en "+E.temporada.pj+" partidos"));
    p.cuerpo.appendChild(fila("Premios de competencia",plata(r.premio)));
    p.cuerpo.appendChild(fila("Caja al cierre",plata(E.plata)));
    p.cuerpo.appendChild(fila("Deuda",plata(E.deuda)));
    p.cuerpo.appendChild(el("div","resul "+(r.ev.nivel==="excelente"||r.ev.nivel==="cumplido"?"bien":"mal"),"<b>El directorio:</b> "+r.ev.txt));
    if(r.asc){
      const nd=(typeof _nombreDiv==="function")?_nombreDiv:(t=>String(t));
      const nl=(typeof _nombresLista==="function")?_nombresLista:(a=>(a||[]).join(", "));
      const otrosB=(r.asc.bajan||[]).filter(id=>id!==E.club), otrosS=(r.asc.suben||[]).filter(id=>id!==E.club);
      if(r.asc.tipo==="liguilla") p.cuerpo.appendChild(el("div","resul bien","<b>🏆 Clasificaste a la liguilla de 7.</b> Esa liguilla ya se jugó partido a partido. El 1° de esa tabla sube a Primera B — no hay una final de 3 botones."));
      else if(r.asc.tipo==="ascenso") p.cuerpo.appendChild(el("div","resul bien","<b>🎉 ¡ASCENSO!</b> "+E.clubNombre+" sube a "+nd(r.asc.up)+(otrosS.length?" junto a "+nl(otrosS):"")+". Baja "+nl(r.asc.bajan)+". El año que viene, arriba."));
      else if(r.asc.tipo==="descenso") p.cuerpo.appendChild(el("div","resul mal","<b>📉 DESCENSO.</b> "+E.clubNombre+" pierde la categoría y baja a "+nd(r.asc.lo)+(otrosB.length?" junto a "+nl(otrosB):"")+". Sube "+nl(r.asc.suben)+". El año que viene, a pelear el ascenso."));
      else if(r.asc.tipo==="otros") p.cuerpo.appendChild(el("p","mini","🔁 En "+nd(r.asc.lo)+": subió <b>"+nl(r.asc.suben)+"</b> y bajó <b>"+nl(r.asc.bajan)+"</b>."));
    }
    if(E.flags&&E.flags.cupoSud) p.cuerpo.appendChild(el("div","resul bien","<b>🥈 Sudamericana "+(E.anio+1)+".</b> Clasificaste por la tabla (4°–6° o el repechaje Chile 4). El grupo lo sortea el juego."));
    else if(E.flags&&E.flags.cupoLib) p.cuerpo.appendChild(el("div","resul bien","<b>🏆 Libertadores "+(E.anio+1)+".</b> El grupo lo sortea el juego (no es el sorteo CONMEBOL)."));
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
    const _seguir=()=>{ nuevoAnio(); SEC="escritorio"; render(); aviso("Temporada "+E.anio); };
    if(r.asc && r.asc.tipo==="liguilla" && r.asc.pend && E.eraBase!=="2026c"){
      /* legado: 1-vs-1 solo si NO es Segunda 2026 (ahí la liguilla de 7 ya se jugó) */
      const b=el("button","btn-aqua ancho verde","🏆 Jugar la liguilla de ascenso");
      b.onclick=()=>{ cerrarModal(); liguillaJugable(r.asc.pend, _seguir); };
      p.cuerpo.appendChild(b);
    } else if(riesgoDestitucion()){
      const b=el("button","btn-aqua ancho rojo","Ver qué decidió el directorio");
      b.onclick=()=>{ cerrarModal(); destituir("Después de la temporada "+E.anio+", el directorio decidió terminar el ciclo. "+r.ev.txt); render(); };
      p.cuerpo.appendChild(b);
    } else {
      const b=el("button","btn-aqua ancho verde","Continuar a "+(E.anio+1));
      b.onclick=()=>{ cerrarModal(); _seguir(); };
      p.cuerpo.appendChild(b);
    }
    box.appendChild(p);
  },{cerrarFuera:false});
}
/* ---------------- liguilla de ascenso (jugable) ---------------- */
function liguillaJugable(pend, onDone){
  const rival=pend&&pend.rival;
  const rivalN=rival?(typeof nombreDeClub==="function"?nombreDeClub(rival):rival):"el campeón de la otra zona";
  modal(box=>{
    box.classList.remove("panel");
    const p=panel("Liguilla de ascenso","🏆","agua");
    p.cuerpo.appendChild(el("div","centro",'<div style="font-size:40px">🥊</div>'));
    p.cuerpo.appendChild(el("h2","tit centro",E.clubNombre+" vs "+rivalN));
    p.cuerpo.appendChild(el("p","mini centro","Final a ida y vuelta por el ascenso a Primera B. Elige cómo la juegas: el planteamiento inclina el cruce."));
    const cont=el("div"); cont.style.marginTop="10px";
    const posturas=[["🛡️ Aguantar",-1,"Te paras firme atrás y sales de contra. Menos riesgo, menos gol."],
                    ["⚖️ Equilibrado",0,"Ni muy arriba ni muy atrás. La fuerza real manda."],
                    ["⚔️ Ir al frente",1,"Presión alta y a buscarlo. Más gol tuyo… y más expuesto."]];
    posturas.forEach(([et,val,desc])=>{
      const b=el("button","btn-aqua ancho","");
      b.innerHTML='<b>'+et+'</b>';
      b.style.marginTop="6px"; b.title=desc;
      b.onclick=()=>{ _liguillaResultado(pend, val, onDone); };
      cont.appendChild(b);
      cont.appendChild(el("p","mini",desc));
    });
    p.cuerpo.appendChild(cont);
    box.appendChild(p);
  },{cerrarFuera:false});
}
function _liguillaResultado(pend, postura, onDone){
  const sim=(typeof simularLiguilla==="function")?simularLiguilla(pend.rival, postura):{ida:[0,0],vuelta:[0,0],gm:0,gr:0,gano:Math.random()<0.5,penales:null,rival:pend.rival};
  if(typeof liguillaResolverAscenso==="function") liguillaResolverAscenso(sim.gano);
  const rivalN=(typeof nombreDeClub==="function"?nombreDeClub(pend.rival):pend.rival);
  modal(box=>{
    box.classList.remove("panel");
    const p=panel("Resultado de la liguilla","🏆",sim.gano?"":"alerta");
    p.cuerpo.appendChild(el("div","centro",'<div style="font-size:44px">'+(sim.gano?"🎉":"😞")+'</div>'));
    p.cuerpo.appendChild(el("h2","tit centro",sim.gano?"¡ASCENSO a Primera B!":"Se quedó en Segunda"));
    p.cuerpo.appendChild(fila("Ida ("+E.clubNombre+" local)",sim.ida[0]+" - "+sim.ida[1]));
    p.cuerpo.appendChild(fila("Vuelta (en "+rivalN+")",sim.vuelta[1]+" - "+sim.vuelta[0]));
    p.cuerpo.appendChild(fila("Global",sim.gm+" - "+sim.gr+(sim.penales?" · "+sim.penales:"")));
    p.cuerpo.appendChild(el("div","resul "+(sim.gano?"bien":"mal"),
      sim.gano?("<b>🎉 ¡Campeón de la liguilla!</b> "+E.clubNombre+" le ganó a "+rivalN+" y sube a Primera B. El año que viene, el ascenso.")
              :("<b>Se escapó.</b> "+rivalN+" ganó la final y sube. "+E.clubNombre+" pelea otro año en Segunda.")));
    const b=el("button","btn-aqua ancho verde","Continuar a "+(E.anio+1));
    b.onclick=()=>{ cerrarModal(); if(typeof onDone==="function") onDone(); };
    p.cuerpo.appendChild(b);
    box.appendChild(p);
  },{cerrarFuera:false});
}
/* ---------------- cuenta en la barra ---------------- */
function pintarBtnCuenta(){
  const b=document.getElementById("btnCuenta"); if(!b) return;
  b.classList.remove("oculto");
  const nube=(typeof nubeActiva==="function" && nubeActiva());
  const dentro=nube && typeof nubeLogueado==="function" && nubeLogueado();
  b.innerHTML='<span aria-hidden="true">👤</span><span class="cta-txt">Cuenta</span>';
  b.classList.toggle("verde",!!dentro);
  b.title=dentro?("Tu cuenta · "+((typeof nubeEmail==="function"&&nubeEmail())||"conectada")):"Tu cuenta";
  b.setAttribute("aria-label","Tu cuenta");
}
function modalCuenta(){
  if(typeof nubeActiva!=="function" || !nubeActiva()){
    SEC="ajustes"; render();
    aviso("La cuenta está en Ajustes. El ⚙️ de la barra te deja entrar o crear una.");
    return;
  }
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">☁️</span><span>Tu cuenta</span>'));
    const cc=el("div","cuerpo"); box.appendChild(cc);
    if(nubeLogueado()) pintarSesionNube(cc, {cerrar:true});
    else pintarFormularioCuenta(cc, {cerrar:true});
    const bx=el("button","btn-aqua chico gris ancho","Cerrar"); bx.style.marginTop="10px"; bx.onclick=cerrarModal; cc.appendChild(bx);
  });
}
/* ---------------- arranque ---------------- */
$("#btnAvanzar").onclick=avanzar;
$("#btnRapido").onclick=modalAvanceRapido;
$("#btnCuenta").onclick=modalCuenta;
if(typeof presenciaArrancar==="function") try{ presenciaArrancar(); }catch(e){}
$("#btnAvisos").onclick=()=>{ if(E) modalAvisos(); };
{ const _c=document.getElementById("campanaAvisos"); if(_c) _c.onclick=()=>{ if(E) modalAvisos(); }; }
$("#btnTemas").onclick=()=>{
  const orden=["aero","negro","claro","insano"];
  const i=(orden.indexOf(document.body.dataset.tema)+1)%orden.length;
  const k=orden[i];
  if(typeof aplicarTema==="function") aplicarTema(k); else { document.body.setAttribute("data-tema",k); document.body.dataset.tema=k; }
  Store.set("futbolini3_tema",k); render();
};
/* 7.61 · botón de Ajustes SIEMPRE en la barra (también sin partida): así se
   pueden borrar guardados / cambiar tema / cargar respaldo sin entrar a un club.
   Inyectado por JS para no depender de editar index.html. */
(function(){
  const acc=document.querySelector(".barra-acc");
  if(acc && !document.getElementById("btnAjustes")){
    const b=document.createElement("button");
    b.className="btn-aqua chico"; b.id="btnAjustes"; b.title="Ajustes"; b.setAttribute("aria-label","Ajustes"); b.textContent="⚙️";
    b.onclick=()=>{ SEC="ajustes"; render(); };
    const temas=document.getElementById("btnTemas");
    if(temas) acc.insertBefore(b, temas); else acc.appendChild(b);
  }
  if(acc && !document.getElementById("btnApoyar")){
    const d=document.createElement("button");
    d.className="btn-aqua chico verde"; d.id="btnApoyar"; d.title="Apoyar Futbolini"; d.setAttribute("aria-label","Apoyar");
    d.textContent="₿";
    d.onclick=function(){ if(typeof abrirDonar==="function") abrirDonar(); };
    const aj=document.getElementById("btnAjustes")||document.getElementById("btnTemas");
    if(aj) acc.insertBefore(d, aj); else acc.appendChild(d);
  }
})();
/* ---------- pantalla de arranque (que entrar no sea fome) ---------- */
function pantallaArranque(haySave,slots){
  slots=slots||[];
  const ov=el("div",""); ov.id="arranque";
  const inner=el("div","arr-inner");
  inner.innerHTML=
    '<div class="arr-logo"><span class="arr-glifo">⚽</span><span class="arr-word">FUTBOLINI</span></div>'+
    '<div class="arr-sub">No manejas un equipo. Manejas una institución.</div>'+
    '<div class="arr-bar"><i></i></div>'+
    '<div class="arr-cargando">Preparando la cancha…</div>';
  const btns=el("div","arr-btns");
  const salir=cb=>{ ov.classList.add("fuera"); setTimeout(()=>{ if(ov.parentNode) ov.remove(); },430); if(cb) cb(); render(); };
  if(slots.length){
    const act=(E&&E._slot)||null;
    const ord=slots.slice().sort((a,b)=>(b.guardado||0)-(a.guardado||0));
    ord.forEach((s,i)=>{
      const esAct=s.id===act;
      const b=el("button","btn-aqua ancho arranque-btn"+((i===0)?" verde":""));
      const etq=s.epoca||("Año "+s.anio)+(s.gen>1?" · generación "+s.gen:"");
      b.innerHTML="▶ "+(esAct?"Continuar · ":"")+(s.clubNombre||s.club)+"<span class='arr-mini'>"+etq+"</span>";
      b.onclick=async()=>{ if(esAct){ salir(); return; } const ok=await cargarPartida(s.id); if(ok) salir(); else aviso("No se pudo cargar esa partida"); };
      btns.appendChild(b);
    });
    const bn=el("button","btn-aqua ancho arranque-btn"); bn.innerHTML="➕ Nueva partida<span class='arr-mini'>elegir otro club</span>";
    bn.onclick=()=>salir(()=>{ E=null; });
    btns.appendChild(bn);
  } else if(haySave){
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
  /* frases de carga con onda (rotan mientras aparece el botón; se auto-detiene al revelar) */
  const cargas=["Inflando la pelota…","Regando la cancha…","Pintando las rayas…","Ordenando el camarín…",
    "Contando la caja…","Colgando los lienzos…","Avisándole a la barra…","Afinando la pizarra…",
    "Calentando el asado de la previa…","Buscando el micro de la visita…","Sacando el pasto de las tacas…",
    "Prendiendo la tele del partido…","Mojando la esponja…","Revisando la pizarra del ayudante…",
    "Contando las lucas de la taquilla…","Avisándole al relator…"];
  const elCarga=inner.querySelector(".arr-cargando");
  let _ci=0, _cargaTimer=null;
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(elCarga && !reduce){ _cargaTimer=setInterval(()=>{
    if(ov.dataset.listo){ clearInterval(_cargaTimer); return; }
    elCarga.textContent=cargas[_ci++ % cargas.length];
  }, 320); }
  setTimeout(revelar, reduce?60:1300);
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
  /* versión única en badge y footer */
  if(typeof VERSION!=="undefined"){
    const vb=$("#verBadge"); if(vb) vb.textContent=VERSION;
    const pt=$("#pieTxt"); if(pt) pt.textContent="Futbolini "+VERSION+" · dramatización · Frutiger Aero · Apoyar";
    try{ document.title="Futbolini "+VERSION+" — Conducción de clubes chilenos"; }catch(e){}
  }
  const t=await Store.get("futbolini3_tema");
  if(typeof aplicarTema==="function") aplicarTema(t||"aero");
  else { document.body.setAttribute("data-tema", t||"aero"); document.body.dataset.tema=t||"aero"; }
  /* 7.62 · navegación lateral tipo Wii en PC (por defecto encendida; conmutable en Ajustes) */
  try{ const nl=await Store.get("futbolini3_lateral"); document.body.classList.toggle("nav-lateral", nl!==false); }
  catch(e){ document.body.classList.add("nav-lateral"); }
  /* 7.9015 · dock del celu: cinta por defecto; compacto (4+Más) opcional */
  try{ const dm=await Store.get("futbolini3_dockmas"); document.body.classList.toggle("dock-mas", dm===true); }
  catch(e){}
  /* 7.68 · modo rendimiento: si nunca se eligió, se autoenciende en equipos flacos
     (pocos núcleos / poca RAM) para que corra en cualquier cosa. Conmutable en Ajustes. */
  try{
    let pf=await Store.get("futbolini3_perf");
    if(pf===undefined||pf===null){
      const flaco=(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||(navigator.deviceMemory&&navigator.deviceMemory<=4);
      pf=!!flaco;
    }
    document.body.classList.toggle("perf", !!pf);
  }catch(e){}
  /* 7.69 · idioma/registro (neutro por defecto; conmutable en Ajustes) */
  try{ const idi=await Store.get("futbolini3_idioma"); if(idi && typeof setIdioma==="function") setIdioma(idi); }catch(e){}
  let lista=[]; try{ lista=await migrarSlots(); }catch(e){ console.error("No se pudo migrar slots:",e); }
  let g=null;
  try{
    let actId=await slotActivoId();
    if(!actId && lista.length) actId=lista[lista.length-1].id;
    if(actId) g=await Store.get(slotKey(actId));
    if(!g||!g.club) g=await cargar();   /* fallback al save legacy */
  }catch(e){ console.error("No se pudo leer el save:",e); }
  let haySave=!!(g&&g.club);
  if(haySave){
    try{ E=g; if(!E._slot && lista.length) E._slot=lista[lista.length-1].id; normalizarEstado(); aplicarEstatutosMod(); }
    catch(e){ console.error("Save dañado, empiezo limpio:",e); E=null; haySave=false; aviso("La partida guardada estaba dañada. Se empieza de nuevo.",5000); }
  }
  pantallaArranque(haySave,lista);
})();
window.addEventListener("resize",()=>{ clearTimeout(window._rb); window._rb=setTimeout(function(){ burbujas(); if(typeof pintarDock==="function") pintarDock(); },400); });
if(window.matchMedia){
  const mqMov=window.matchMedia("(max-width:720px)");
  const onMov=function(){ if(typeof pintarDock==="function") pintarDock(); if(typeof burbujas==="function") burbujas(); };
  if(mqMov.addEventListener) mqMov.addEventListener("change",onMov);
  else if(mqMov.addListener) mqMov.addListener(onMov);
}
