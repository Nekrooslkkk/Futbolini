"use strict";
/* ============================================================
   FUTBOLINI · interfaz-aero.js  (7.9071+) · Etapa 4A (interfaz)
   Pedidos del autor:
   - "El botón de avanzar debería volver a donde estaba y quita el de arriba (ese es fome, feo y
     chico)": el botón grande de abajo (el del celular) vuelve también en PC; el de la barra se va.
   - Chat en vivo del partido: completo, con burbujas, y las pistas marcadas con sutileza.
   ============================================================ */
function _accionAvanzar(){
  const part=(typeof proximoPartido==="function")?proximoPartido():null;
  const jugar=!!(part&&!part.jugado);
  if(typeof crisisActiva==="function"&&crisisActiva()){ if(typeof avanzar==="function") avanzar(); return; }
  if(typeof bloqueoDecisiones==="function"&&bloqueoDecisiones()) return;
  if(jugar&&typeof pantallaPrevia==="function"){ pantallaPrevia(part); return; }
  if(typeof avanzar==="function") avanzar();
}
function textoAvanzar(){
  const part=(typeof proximoPartido==="function")?proximoPartido():null;
  if(!part) return {t:"🏁 "+((typeof T==="function")?T("av_cierre","Cerrar temporada"):"Cerrar temporada"), sub:""};
  if(!part.jugado){
    const riv=part.rivalNombre||"";
    return {t:"⚽ "+((typeof T==="function")?T("av_jugar","Jugar"):"Jugar"), sub:(part.local?"vs ":"visita a ")+riv+(typeof fechaTxt==="function"&&part.f?" · "+fechaTxt(part.f):"")};
  }
  return {t:"⏩ "+((typeof T==="function")?T("av_semana","Avanzar semana"):"Avanzar semana"), sub:""};
}
/* en PC: el botón gordo abajo, centrado en el contenido (en celular ya vive en el dock) */
function pintarAvanceGrande(){
  let b=document.getElementById("avanceGrande");
  const movil=(typeof esMovil==="function")&&esMovil();
  const ver=!!(typeof E!=="undefined"&&E)&&!movil&&!document.body.classList.contains("en-partido")&&!(E.carrera&&(E.carrera.enParo||E.carrera.fin));
  document.body.classList.toggle("con-avance",ver);
  if(!ver){ if(b) b.classList.add("oculto"); return; }
  if(!b){
    b=document.createElement("button"); b.id="avanceGrande"; b.type="button"; b.className="dock-avanza avance-grande";
    b.onclick=_accionAvanzar; document.body.appendChild(b);
  }
  const tx=textoAvanzar();
  b.innerHTML='<span class="ag-t">'+tx.t+'</span>'+(tx.sub?'<span class="ag-s">'+escHtml(tx.sub)+'</span>':"");
  b.title=tx.sub||tx.t;
  b.classList.remove("oculto");
}
(function(){
  const o=window.pintarBarra; if(typeof o!=="function"||o._ia) return;
  const w=function(){ const r=o.apply(this,arguments); try{ pintarAvanceGrande(); }catch(e){} return r; };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._ia=true; window.pintarBarra=w;
})();
/* al abrirse una decisión, el chat se acomoda para que se vean los mensajes marcados */
function chatMostrarPistas(){
  const box=document.querySelector(".chat-vivo"), lista=box&&box.querySelector(".chat-lista"), pista=lista&&lista.querySelector(".pista");
  if(!box||!lista||!pista) return false;
  lista.scrollTop=Math.max(0,pista.offsetTop-lista.offsetTop-6);
  /* 7.9105 · la página ya NO baja al chat (en el celu te sacaba de la cancha y la pregunta): el chat se acomoda por
     dentro y la pregunta trae un botón para ir a leer las pistas si quieres */
  const mom=document.querySelector(".momento-vivo");
  if(mom&&!mom.querySelector(".mv-ir-chat")&&!(document.body.classList.contains("pv-2col"))){
    const b=document.createElement("button"); b.type="button"; b.className="mv-ir-chat"; b.textContent="💬 Lo que dice la gente ↓";
    b.onclick=function(){ const r=box.getBoundingClientRect(); try{ window.scrollBy({top:r.top-58,behavior:"auto"}); }catch(e){ window.scrollBy(0,r.top-58); } };
    const cab=mom.querySelector(".cab"); (cab||mom).appendChild(b);
  }
  return true;
}
(function(){
  const o=window.mostrarMomento; if(typeof o!=="function"||o._ia) return;
  const w=function(){ const r=o.apply(this,arguments); try{ requestAnimationFrame(chatMostrarPistas); }catch(e){} return r; };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._ia=true; window.mostrarMomento=w;
})();
/* ============================================================
   7.9072 · PLOP! como el Twitter de 2009, dentro de la ventana de Internet Explorer (Aero / Vista / XP):
   cielo con nubes, encabezado con la palabra "plop!" y la navegación, columna blanca con
   "¿Qué está pasando?" y la línea de tiempo (avatar cuadrado, nombre en negrita, "hace x · desde web"),
   y barra lateral celeste con tu perfil, la comunidad y las tendencias. La lógica no se toca.
   ============================================================ */
const PLOPT_LADO=/Comunidad digital|Tendencias|Promesas en juego|Tus Me gusta/i;
function _plopAvatar(txt){
  const h=(typeof _arcoHash==="function")?_arcoHash(txt||"x"):7, cols=["#2f7fd6","#d6452f","#2f9d57","#8a4fd6","#d68a2f","#2fa6b8","#b8412f","#4a5a70"];
  const ini=String(txt||"@?").replace(/[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/g,"").slice(0,2).toUpperCase()||"?";
  return '<span class="plopt-av" style="background:'+cols[h%cols.length]+'">'+escHtml(ini)+'</span>';
}
function plopAntiguo(){
  const win=document.querySelector("#vista .plop-ie"), cu=win&&win.querySelector(".plop-ie-cuerpo");
  if(!cu||cu.querySelector(".plopt")) return false;
  const paneles=[].slice.call(cu.querySelectorAll(":scope > .panel"));
  if(!paneles.length) return false;
  const tit=p=>{ const s=p.querySelectorAll(":scope > .cab > span"); return s.length?s[s.length-1].textContent.trim():""; };
  const cab=paneles.find(p=>/^PLOP!/.test(tit(p)));
  const pub=paneles.find(p=>/^Publicar/.test(tit(p)));
  const root=el("div","plopt");
  /* encabezado: palabra "plop!" + navegación (las mismas pestañas de siempre) */
  const top=el("div","plopt-top");
  top.appendChild(el("div","plopt-marca",(typeof logoPlop==="function"?logoPlop(30):"")+'<span class="plopt-palabra">plop!</span>'));
  const nav=el("div","plopt-nav");
  if(cab){ [].slice.call(cab.querySelectorAll(".fichas button, .ficha")).forEach(b=>{ if(!nav.contains(b)) nav.appendChild(b); }); }
  top.appendChild(nav);
  root.appendChild(top);
  const cols=el("div","plopt-cols"), main=el("div","plopt-main"), lado=el("div","plopt-lado");
  cols.appendChild(main); cols.appendChild(lado); root.appendChild(cols);
  /* "¿Qué está pasando?" arriba de la línea de tiempo */
  if(pub){
    const q=el("div","plopt-que");
    q.appendChild(el("div","plopt-que-t",REDES_PEST==="club"?"¿Qué está pasando en el club?":"¿Qué estás pensando?"));
    const c=pub.cuerpo||pub.querySelector(".cuerpo"); [].slice.call(c.childNodes).forEach(n=>q.appendChild(n));
    main.appendChild(q);
  }
  paneles.forEach(p=>{
    if(p===cab||p===pub) return;
    const t=tit(p);
    if(PLOPT_LADO.test(t)){ p.classList.add("plopt-caja"); lado.appendChild(p); }
    else { p.classList.add("plopt-sec"); main.appendChild(p); }
  });
  /* perfil arriba de la barra lateral: seguidores y cuenta */
  if(cab){
    const pf=el("div","plopt-perfil");
    const txt=(cab.cuerpo||cab.querySelector(".cuerpo")).textContent.replace(/\s+/g," ").trim();
    const nom=REDES_PEST==="club"?(E.clubNombre||"El club"):((E.perfil&&E.perfil.nombre)||"DT");
    pf.innerHTML=_plopAvatar(nom)+'<div><b>'+escHtml(nom)+'</b><div class="mini">'+escHtml(txt.slice(0,120))+'</div></div>';
    lado.insertBefore(pf,lado.firstChild);
  }
  cu.innerHTML=""; cu.appendChild(root);
  /* cada post: avatar cuadrado y "hace x · desde web" */
  root.querySelectorAll(".plop-card").forEach(card=>{
    if(card.querySelector(".plopt-av")) return;
    const aut=(card.querySelector(".plop-cab b")||{}).textContent||"";
    card.insertAdjacentHTML("afterbegin",_plopAvatar(aut.replace(/^\S+\s/,"")));
    card.classList.add("plopt-tw");
    /* las acciones (me gusta, RT, responder) a la derecha, como en 2009 */
    [].slice.call(card.children).forEach(ch=>{ if(ch.tagName==="DIV"&&ch.querySelector(":scope > .btn-aqua")&&!ch.classList.contains("plop-cab")) ch.classList.add("plopt-acc"); });
  });
  return true;
}
(function(){
  const o=window.vistaRedes; if(typeof o!=="function"||o._plopt) return;
  const w=function(){ const r=o.apply(this,arguments); try{ plopAntiguo(); }catch(e){ console.error("plop antiguo:",e); } return r; };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._plopt=true; window.vistaRedes=w;
})();
if(typeof document!=="undefined"&&!document.getElementById("css-interfaz-aero")){
  const st=document.createElement("style"); st.id="css-interfaz-aero";
  st.textContent=
    /* el Avanzar de la barra se va (en todas las pantallas) */
    "#btnAvanzar{display:none !important}"+
    /* botón gordo abajo, estilo Aero (mismo que el del celular) */
    ".avance-grande{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:60;min-width:min(520px,70vw);max-width:92vw;min-height:58px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;border-radius:14px;border:1px solid rgba(20,90,20,.55);cursor:pointer;"+
      "background:linear-gradient(180deg,#8ff07a 0%,#3fbf3a 46%,#2a9a2a 52%,#3cc03a 100%);color:#fff;text-shadow:0 1px 2px rgba(0,60,0,.55);box-shadow:0 6px 18px rgba(0,40,0,.35),inset 0 1px 0 rgba(255,255,255,.7)}"+
    ".avance-grande:hover{filter:brightness(1.06)}.avance-grande:active{transform:translateX(-50%) translateY(1px)}"+
    ".avance-grande .ag-t{font-weight:900;font-size:19px;letter-spacing:.3px}.avance-grande .ag-s{font-size:12px;opacity:.95}"+
    "body.nav-lateral .avance-grande{left:calc(50% + 82px)}"+
    "body.con-avance #vista{padding-bottom:88px}"+
    "body.con-avance #avisos{bottom:88px}"+
    "body.con-modal .avance-grande,body.en-partido .avance-grande{display:none}"+
    "@media (max-width:760px){body.hay-momento .momento-vivo{max-height:55vh !important;overflow-y:auto !important}}"+
    /* chat en vivo */
    ".chat-vivo{margin-top:8px;border-radius:12px;overflow:hidden;border:1px solid rgba(80,140,210,.35);background:linear-gradient(180deg,rgba(236,246,255,.92),rgba(214,232,250,.88))}"+
    ".chat-cab{display:flex;align-items:center;gap:6px;padding:6px 10px;font-size:13px;color:#0d2c4d;background:linear-gradient(180deg,#f7fbff,#d7e8f8);border-bottom:1px solid rgba(80,140,210,.3)}"+
    ".chat-cab .mini{margin-left:auto}"+
    ".chat-punto{width:9px;height:9px;border-radius:50%;background:#e0262f;box-shadow:0 0 6px #ff4b4b;animation:chatPunto 1.2s ease-in-out infinite alternate}"+
    "@keyframes chatPunto{from{opacity:.55}to{opacity:1}}"+
    ".chat-lista{max-height:300px !important;padding:6px;gap:5px !important;overscroll-behavior:contain;background:transparent}"+
    ".ticker .tk.chat-b{display:flex;gap:8px;align-items:flex-start;padding:6px 8px;border-radius:10px;border:1px solid rgba(120,160,210,.28);border-left:3px solid #39b7e0;background:rgba(255,255,255,.8);color:#10263d}"+
    ".ticker .tk.chat-b.bien{border-left-color:#4fbf3f}.ticker .tk.chat-b.mal{border-left-color:#e0563f}.ticker .tk.chat-b.rival{background:rgba(255,240,238,.85)}"+
    /* la pista: apenas un brillo dorado, sin texto que la delate */
    ".ticker .tk.chat-b.pista{outline:none;box-shadow:inset 0 0 0 1px rgba(224,169,42,.55),0 0 8px rgba(224,169,42,.25)}"+
    ".chat-av{flex:0 0 26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10.5px;font-weight:800;box-shadow:inset 0 1px 0 rgba(255,255,255,.4)}"+
    ".chat-c{min-width:0;flex:1}.chat-h{font-size:12px;color:#1c4d82}.chat-h b{color:#123e6e}.chat-v{color:#1d9bf0;font-size:10px}"+
    ".chat-t{font-size:13.5px;line-height:1.35;word-wrap:break-word}.chat-l{opacity:.55;margin-top:1px}"+
    "body[data-tema=negro] .chat-vivo,body[data-tema=aero] .chat-vivo{background:linear-gradient(180deg,rgba(14,32,56,.9),rgba(9,22,40,.9));border-color:rgba(120,170,240,.25)}"+
    "body[data-tema=negro] .chat-cab,body[data-tema=aero] .chat-cab{background:linear-gradient(180deg,#1e3c64,#12294a);color:#e3f0ff}"+
    "body[data-tema=negro] .ticker .tk.chat-b,body[data-tema=aero] .ticker .tk.chat-b{background:rgba(22,44,74,.85);color:#dbe9fb;border-color:rgba(120,170,240,.18)}"+
    "body[data-tema=negro] .chat-h,body[data-tema=aero] .chat-h,body[data-tema=negro] .chat-h b,body[data-tema=aero] .chat-h b{color:#8fd0ff}"+
    "body[data-tema=aero] .ticker .tk.chat-b.rival,body[data-tema=negro] .ticker .tk.chat-b.rival{background:rgba(70,30,34,.8)}";
  document.head.appendChild(st);
}
if(typeof document!=="undefined"&&!document.getElementById("css-plop-antiguo")){
  const st=document.createElement("style"); st.id="css-plop-antiguo";
  st.textContent=
    ".plop-ie .plop-ie-cuerpo{padding:0 !important;background:#9ad3ee url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='520' height='220'%3E%3Cg fill='%23ffffff' opacity='.55'%3E%3Cellipse cx='90' cy='60' rx='70' ry='22'/%3E%3Cellipse cx='140' cy='48' rx='50' ry='26'/%3E%3Cellipse cx='380' cy='150' rx='80' ry='20'/%3E%3Cellipse cx='430' cy='136' rx='46' ry='22'/%3E%3C/g%3E%3C/svg%3E\") repeat-x top/520px auto !important}"+
    ".plopt{font-family:'Lucida Grande','Lucida Sans Unicode',Tahoma,Arial,sans-serif;color:#333;padding:10px 12px 16px}"+
    ".plopt-top{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px}"+
    ".plopt-marca{display:flex;align-items:center;gap:6px}.plopt-palabra{font:900 30px/1 'Trebuchet MS',Arial,sans-serif;color:#fff;letter-spacing:-1px;text-shadow:0 2px 0 #4a9fd0,0 3px 6px rgba(0,60,120,.35)}"+
    ".plopt-nav{display:flex;flex-wrap:wrap;gap:4px;margin-left:auto}"+
    ".plopt-nav .ficha{background:linear-gradient(180deg,rgba(255,255,255,.95),rgba(220,238,250,.9));border:1px solid #9cc8e3;color:#0084b4;font-weight:700;border-radius:14px;padding:5px 11px;font-size:12.5px;box-shadow:inset 0 1px 0 #fff}"+
    ".plopt-nav .ficha[aria-pressed=true]{background:linear-gradient(180deg,#e9f6ff,#bfe0f5);color:#004f73;border-color:#63aee0}"+
    ".plopt-cols{display:grid;grid-template-columns:minmax(0,1fr) 270px;gap:0;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,60,110,.25)}"+
    "@media (max-width:820px){.plopt-cols{grid-template-columns:1fr}.plopt-lado{border-left:0;border-top:1px solid #c0deed}}"+
    ".plopt-main{background:#fff;padding:14px 16px;min-width:0}"+
    ".plopt-lado{background:#ddeef6;border-left:1px solid #c0deed;padding:12px;font-size:12.5px}"+
    ".plopt-que{border-bottom:1px solid #e6e6e6;padding-bottom:12px;margin-bottom:6px}"+
    ".plopt-que-t{font-size:20px;color:#333;margin-bottom:6px;font-weight:400}"+
    ".plopt-que textarea{border:1px solid #aaa !important;border-radius:4px !important;background:#fff !important;font-size:14px !important;box-shadow:inset 0 1px 3px rgba(0,0,0,.12) !important}"+
    ".plopt-que .btn-aqua{background:linear-gradient(180deg,#ffffff,#dcdcdc) !important;color:#333 !important;border:1px solid #aaa !important;border-radius:4px !important;text-shadow:none !important;font-weight:700;width:auto !important;float:right;padding:6px 16px !important;min-height:0 !important}"+
    ".plopt-que::after{content:'';display:block;clear:both}"+
    ".plopt .panel.plopt-sec,.plopt .panel.plopt-caja{background:transparent !important;border:0 !important;box-shadow:none !important;margin:0 0 10px !important;backdrop-filter:none !important}"+
    ".plopt .panel.plopt-sec>.cab{background:none !important;color:#333 !important;border-bottom:1px solid #e6e6e6;padding:6px 0 !important;font-size:15px}"+
    ".plopt .panel.plopt-caja>.cab{background:none !important;color:#333 !important;padding:4px 0 !important;font-size:13px;font-weight:700}"+
    ".plopt .panel>.cuerpo{background:transparent !important;padding:0 !important;border:0 !important}"+
    ".plopt .plop-card.plopt-tw{position:relative;border:0 !important;border-bottom:1px solid #e6e6e6 !important;border-radius:0 !important;background:#fff !important;padding:10px 6px 8px 64px !important;margin:0 !important;box-shadow:none !important;color:#333}"+
    ".plopt .plop-card.plopt-tw:hover{background:#f5fbff !important}"+
    ".plopt .plopt-tw .plopt-av{position:absolute;left:6px;top:10px;width:48px;height:48px;border-radius:5px;font-size:15px}"+
    ".plopt-av{display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:800;box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 1px 2px rgba(0,0,0,.25)}"+
    ".plopt .plopt-tw .plop-cab b{color:#0084b4 !important}.plopt .plopt-tw .plop-cab .mini{color:#999 !important}"+
    ".plopt .plopt-tw .plop-txt{font-size:14px;line-height:1.4;color:#333}"+
    ".plopt .plopt-tw .plopt-acc{position:absolute;right:4px;top:6px;margin:0 !important;display:flex;gap:2px}"+
    "@media (max-width:560px){.plopt .plopt-tw .plopt-acc{position:static;margin-top:2px !important}}"+
    ".plopt .panel.plopt-caja>.cab .ic{display:none}"+
    ".plopt .plopt-tw .btn-aqua{background:none !important;border:0 !important;box-shadow:none !important;color:#0084b4 !important;text-shadow:none !important;font-size:11.5px !important;padding:2px 6px !important;min-height:0 !important;font-weight:400 !important;opacity:.0;transition:opacity .15s}"+
    ".plopt .plopt-tw:hover .btn-aqua,.plopt .plopt-tw:focus-within .btn-aqua{opacity:1}"+
    "@media (hover:none){.plopt .plopt-tw .btn-aqua{opacity:.85}}"+
    ".plopt-perfil{display:flex;gap:10px;align-items:center;padding-bottom:10px;margin-bottom:10px;border-bottom:1px solid #c0deed}"+
    ".plopt-perfil .plopt-av{width:48px;height:48px;border-radius:5px;flex:0 0 48px;font-size:16px}"+
    ".plopt-perfil b{color:#333;font-size:14px}"+
    ".plopt-lado .fila{border-color:#c0deed !important}"+
    ".plopt-lado .resul{background:rgba(255,255,255,.6) !important}";
  document.head.appendChild(st);
}

/* ============================================================
   7.9073 · Calendario con cariño Aero (Vista / 7): el orden de SofaScore, el vidrio de Windows.
   Buscador tipo Vista, pestañas de vidrio, tarjetas con fecha de hoja de calendario, marcadores
   brillantes, tabla con franjas de zona y posiciones en esferas, forma en bolitas de vidrio.
   ============================================================ */
if(typeof document!=="undefined"&&!document.getElementById("css-cal-aero")){
  const st=document.createElement("style"); st.id="css-cal-aero";
  st.textContent=
    "#vista .cs .cs-buscar .pick-buscar{border-radius:14px;border:1px solid #7da2c8;background:linear-gradient(180deg,#fff,#f2f7fc);box-shadow:inset 0 2px 3px rgba(0,40,90,.14),0 1px 0 rgba(255,255,255,.8);padding-right:38px;"+
      "background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'%3E%3Ccircle cx='7.5' cy='7.5' r='5' fill='none' stroke='%232b6fb3' stroke-width='2'/%3E%3Cpath d='M11.5 11.5 L16 16' stroke='%232b6fb3' stroke-width='2.4' stroke-linecap='round'/%3E%3C/svg%3E\"),linear-gradient(180deg,#fff,#f2f7fc);background-repeat:no-repeat;background-position:right 12px center,0 0}"+
    "#vista .cs .cs-buscar .pick-buscar:focus{border-color:#3d8fe0;box-shadow:0 0 0 3px rgba(61,143,224,.25),inset 0 2px 3px rgba(0,40,90,.12)}"+
    "#vista .cs .cs-tabs{background:linear-gradient(180deg,rgba(255,255,255,.6),rgba(190,220,245,.42) 50%,rgba(160,200,235,.45) 51%,rgba(200,228,250,.55));border:1px solid rgba(255,255,255,.75);box-shadow:0 2px 8px rgba(0,50,100,.18),inset 0 1px 0 rgba(255,255,255,.9);padding:5px}"+
    "#vista .cs .cs-tab{color:#0b2a4a;font-weight:700;text-shadow:0 1px 0 rgba(255,255,255,.7)}"+
    "#vista .cs .cs-tab:hover{background:rgba(255,255,255,.45)}"+
    "#vista .cs .cs-tab.on{background:linear-gradient(180deg,#8ecbff 0%,#3d8fe0 48%,#1f6fc0 52%,#3b8ee2 100%);color:#fff;text-shadow:0 1px 1px rgba(0,30,70,.5);box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 2px 6px rgba(0,50,110,.35)}"+
    "#vista .cs .cs-mes{display:flex;align-items:center;gap:8px;color:#1d5f9e}#vista .cs .cs-mes::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(29,95,158,.45),transparent)}"+
    "#vista .cs .cs-fila{background:linear-gradient(180deg,#ffffff,#f1f7fd);border:1px solid #c9dcef;box-shadow:0 1px 3px rgba(0,40,90,.1),inset 0 1px 0 #fff;border-radius:12px}"+
    "#vista .cs .cs-fila.clic:hover{background:linear-gradient(180deg,#f7fbff,#e3f0fc);border-color:#8ec0ea}"+
    "#vista .cs .cs-fila.prox{border:2px solid #3d8fe0;box-shadow:0 0 0 3px rgba(61,143,224,.18)}"+
    /* la fecha como hoja de calendario de escritorio */
    "#vista .cs .cs-cuando{background:linear-gradient(180deg,#fff,#eef3f8);border:1px solid #b9c9da;border-top:7px solid #d2322d;border-radius:6px;padding:3px 2px 4px;box-shadow:0 1px 2px rgba(0,0,0,.12);font-weight:700;color:#253545}"+
    /* marcador de vidrio oscuro */
    "#vista .cs .cs-marc{background:linear-gradient(180deg,#4b5d72,#1c2a3a 55%,#101b27);color:#fff;border-radius:9px;padding:2px 0;min-width:30px;box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 1px 2px rgba(0,0,0,.25)}"+
    /* tabla: cabecera brillante, filas de vidrio, posiciones en esferas de color por zona */
    "#vista .cs .cs-tabla th{background:linear-gradient(180deg,#f4f9ff,#d6e7f7);color:#2a4a6a;border-bottom:1px solid #9fc0e0}"+
    "#vista .cs .cs-tabla tbody tr:nth-child(even) td{background:rgba(225,238,250,.45)}"+
    "#vista .cs .cs-tabla tbody tr:hover td{background:rgba(142,203,255,.25)}"+
    "#vista .cs .cs-tabla tr.yo td{background:linear-gradient(180deg,rgba(190,245,200,.7),rgba(140,225,160,.55))}"+
    "#vista .cs .cs-tabla td.pos{display:table-cell !important;border-radius:0 !important;border:0 !important;box-shadow:none !important;text-align:center !important;padding:0 !important;width:36px;min-width:36px;line-height:26px;color:#fff;font-size:12px;text-shadow:0 1px 1px rgba(0,0,0,.45);"+
      "background:radial-gradient(circle at 50% 32%,rgba(255,255,255,.9) 0,rgba(255,255,255,0) 38%),radial-gradient(circle,#8a9aad 0,#5d6e82 62%,transparent 64%) !important;background-size:26px 26px !important;background-position:center !important;background-repeat:no-repeat !important}"+
    "#vista .cs .cs-tabla tr.z-camp td.pos{background:radial-gradient(circle at 50% 32%,rgba(255,255,255,.9) 0,rgba(255,255,255,0) 38%),radial-gradient(circle,#f3c742 0,#c88a0e 62%,transparent 64%) !important;background-size:26px 26px !important;background-position:center !important;background-repeat:no-repeat !important}"+
    "#vista .cs .cs-tabla tr.z-lib td.pos{background:radial-gradient(circle at 50% 32%,rgba(255,255,255,.9) 0,rgba(255,255,255,0) 38%),radial-gradient(circle,#4fdc78 0,#1d9a45 62%,transparent 64%) !important;background-size:26px 26px !important;background-position:center !important;background-repeat:no-repeat !important}"+
    "#vista .cs .cs-tabla tr.z-sud td.pos{background:radial-gradient(circle at 50% 32%,rgba(255,255,255,.9) 0,rgba(255,255,255,0) 38%),radial-gradient(circle,#5aa6ef 0,#1f5fae 62%,transparent 64%) !important;background-size:26px 26px !important;background-position:center !important;background-repeat:no-repeat !important}"+
    "#vista .cs .cs-tabla tr.z-desc td.pos{background:radial-gradient(circle at 50% 32%,rgba(255,255,255,.9) 0,rgba(255,255,255,0) 38%),radial-gradient(circle,#f06a5a 0,#b32618 62%,transparent 64%) !important;background-size:26px 26px !important;background-position:center !important;background-repeat:no-repeat !important}"+
    "#vista .cs .cs-tabla tr.z-perm td.pos{background:radial-gradient(circle at 50% 32%,rgba(255,255,255,.9) 0,rgba(255,255,255,0) 38%),radial-gradient(circle,#f2b04a 0,#c06f10 62%,transparent 64%) !important;background-size:26px 26px !important;background-position:center !important;background-repeat:no-repeat !important}"+
    "@media (max-width:600px){#vista .cs .cs-chips{display:flex;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;gap:6px;padding-bottom:2px}#vista .cs .cs-chips::-webkit-scrollbar{display:none}#vista .cs .cs-chips .ficha{flex:0 0 auto}}"+
    "#vista .cs .fd{box-shadow:inset 0 -1px 1px rgba(0,0,0,.25),inset 0 1px 1px rgba(255,255,255,.7)}"+
    "#vista .cs .fd.fG{background:radial-gradient(circle at 40% 30%,#a8f5bd,#1fae52 60%)}#vista .cs .fd.fE{background:radial-gradient(circle at 40% 30%,#e3e9ef,#8a97a5 60%)}#vista .cs .fd.fP{background:radial-gradient(circle at 40% 30%,#ffb3a8,#d23b2a 60%)}"+
    "#vista .cs .cs-grupo{background:linear-gradient(180deg,#fff,#f1f7fd);border-color:#c9dcef;box-shadow:0 1px 3px rgba(0,40,90,.1)}"+
    "#vista .cs .cs-equipo-cab{background:linear-gradient(180deg,#2a5d93 0%,#123e6e 48%,#0b2c52 52%,#123e6e 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 2px 8px rgba(0,30,70,.3)}"+
    "#vista .cs .cs-prox-card .cs-vs{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;color:#fff;background:radial-gradient(circle at 50% 30%,#9fd4ff,#2f7dd0 60%,#174f93);box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 2px 5px rgba(0,40,90,.3)}"+
    "body[data-tema=negro] #vista .cs .cs-fila,body[data-tema=negro] #vista .cs .cs-grupo{background:linear-gradient(180deg,#1f3247,#172636);border-color:#2a3d52}"+
    "body[data-tema=negro] #vista .cs .cs-tabla th{background:linear-gradient(180deg,#223a55,#172a3f);color:#cfe3f7}"+
    "body[data-tema=negro] #vista .cs .cs-tabla tbody tr:nth-child(even) td{background:rgba(40,60,85,.35)}"+
    "body[data-tema=negro] #vista .cs .cs-cuando{background:linear-gradient(180deg,#27394d,#1c2b3b);color:#e3f0ff;border-color:#34495f;border-top-color:#d2322d}";
  document.head.appendChild(st);
}
/* ============================================================
   7.9075 · Orden de pantallas en PC (auditoría visual de la etapa 4):
   - Finanzas y Vida viven en una ventana que quedaba atrapada en una columna de 580 px (media
     pantalla vacía): la ventana ocupa todo el ancho y reparte sus paneles en columnas adentro.
   - Estadio: el dibujo flotaba en una caja oscura con franjas vacías y la foto ocupaba la pantalla.
   ============================================================ */
if(typeof document!=="undefined"&&!document.getElementById("css-orden-pc")){
  const st=document.createElement("style"); st.id="css-orden-pc";
  st.textContent=
    "@media (min-width:1000px){"+
      "#vista.con-ventana{column-count:1 !important}"+   /* sin :has(): Chrome no siempre lo reevalúa tras muchos cambios del DOM (medido en 7.9078) */
      "#vista > .ventana-so.in-vista{width:100% !important;max-width:none !important}"+
      "#vista > .ventana-so.in-vista :is(.so-cuerpo,.window-body){column-count:2;column-gap:14px}"+
      "#vista > .ventana-so.in-vista :is(.so-cuerpo,.window-body) > *{break-inside:avoid;margin:0 0 14px !important}"+
      "#vista > .ventana-so.in-vista :is(.so-cuerpo,.window-body) > :not(.panel){column-span:all}"+
    "}"+
    "@media (min-width:1560px){#vista > .ventana-so.in-vista :is(.so-cuerpo,.window-body){column-count:3}}"+
    ".estadio-dibujo{background:linear-gradient(180deg,#8ec5f0,#e2f1fb) !important}.estadio-dibujo.completo{background:linear-gradient(180deg,#0b1733,#1d3b73) !important}"+
    ".estadio-dibujo svg{display:block;width:100% !important;height:auto;max-height:420px;margin:0 auto}"+
    ".estadio-dibujo .ed-pie{background:rgba(6,20,40,.78)}"+
    ".foto-est{max-height:220px !important}";
  document.head.appendChild(st);
}
/* ============================================================
   7.9076 · Partido en vivo en PC: dos columnas. A la izquierda el partido (marcador, cancha,
   controles, barras); a la derecha, fija al hacer scroll, la decisión (si hay), el chat en vivo y el
   relato. Antes el chat quedaba al fondo de una columna larga y la derecha vacía. Celular: igual.
   ============================================================ */
function partidoDosColumnas(){
  const v=document.getElementById("vista");
  if(!v||v.dataset.sec!=="partido") return false;
  const ancho=window.innerWidth>=1100;
  document.body.classList.toggle("pv-2col",ancho);
  const moms=[].slice.call(v.querySelectorAll(".momento-vivo"));
  moms.forEach(m=>m.classList.add("mv-compacto"));
  if(!ancho){
    /* 7.9105 · celu y tablet: la pregunta va justo bajo la cancha (antes era una hoja fija que tapaba media pantalla y
       la página se iba al fondo): marcador, cancha y pregunta se ven juntos. */
    const hud=v.querySelector(".partido-wrap .partido-hud")||v.querySelector(".partido-wrap .marcador-vivo");
    moms.forEach(mom=>{ if(hud&&hud.parentNode&&mom.previousElementSibling!==hud) hud.insertAdjacentElement("afterend",mom); });
    return false;
  }
  let der=v.querySelector(":scope > .pv-der");
  if(!der){ der=el("div","pv-der"); v.appendChild(der); }
  /* 7.9105 · PC: la pregunta arriba en la columna derecha, al lado de la cancha (antes iba bajo el marcador y
     empujaba la cancha fuera de la pantalla). Compacta: título + efecto por opción, sin cortarse. */
  moms.forEach(mom=>{ if(mom.parentNode!==der||der.firstElementChild!==mom) der.insertBefore(mom,der.firstChild); });
  const chat=v.querySelector(".partido-wrap .chat-vivo"), rel=v.querySelector(".partido-wrap .relato");
  if(chat&&chat.parentNode!==der) der.appendChild(chat);
  if(rel&&rel.parentNode!==der){ const caja=el("div","pv-relato"); caja.appendChild(el("div","pv-relato-t","🎙️ Relato")); caja.appendChild(rel); der.appendChild(caja); }
  return true;
}
/* 7.9105 · al aparecer la pregunta, la vista vuelve al marcador (antes scrollIntoView la mandaba al fondo) */
function _pvEncuadrar(){
  const v=document.getElementById("vista"); if(!v||v.dataset.sec!=="partido") return;
  const marc=v.querySelector(".marcador-vivo"); if(!marc) return;
  const y=Math.max(0,marc.getBoundingClientRect().top+window.scrollY-58);
  try{ window.scrollTo(0,y); }catch(e){}
}
(function(){
  ["pintarPartido","mostrarMomento","mostrarAccion"].forEach(nom=>{
    const o=window[nom]; if(typeof o!=="function"||o._pv) return;
    const w=function(){ const r=o.apply(this,arguments); try{ partidoDosColumnas(); if(nom!=="pintarPartido"&&document.querySelector(".momento-vivo")) _pvEncuadrar(); }catch(e){} return r; };
    Object.keys(o).forEach(k=>w[k]=o[k]); w._pv=true; w._orig=o; window[nom]=w;
  });
})();
/* 7.9083 · el partido arranca arriba (venía con el scroll de la previa y se veía la mitad de abajo) */
(function(){
  const o=window.arrancarPartido; if(typeof o!=="function"||o._arriba) return;
  const w=function(){ const r=o.apply(this,arguments); const arriba=()=>{ try{ window.scrollTo(0,0); }catch(e){} };
    arriba(); requestAnimationFrame(arriba); setTimeout(arriba,120); return r; };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._arriba=true; w._orig=o; window.arrancarPartido=w;
})();
if(typeof document!=="undefined"&&!document.getElementById("css-partido-2col")){
  const st=document.createElement("style"); st.id="css-partido-2col";
  st.textContent=
    "@media (min-width:1100px){"+
      "body.pv-2col #vista[data-sec=partido]{display:grid !important;grid-template-columns:minmax(0,1fr) minmax(380px,440px);gap:14px;align-items:start;max-width:1500px}"+
      "body.pv-2col #vista[data-sec=partido] > .partido-wrap{min-width:0}"+
      "body.pv-2col .pv-der{position:sticky;top:62px;display:flex;flex-direction:column;gap:10px;max-height:calc(100vh - 74px);overflow-y:auto;overscroll-behavior:contain;padding-bottom:6px}"+
      "body.pv-2col .pv-der .chat-vivo{margin-top:0}"+
      "body.pv-2col .pv-der .chat-lista{max-height:min(46vh,420px) !important}"+
      "body.pv-2col .pv-relato{border-radius:12px;overflow:hidden;border:1px solid rgba(80,140,210,.35);background:rgba(236,246,255,.9)}"+
      "body.pv-2col .pv-relato-t{padding:6px 10px;font:700 13px system-ui;color:#0d2c4d;background:linear-gradient(180deg,#f7fbff,#d7e8f8);border-bottom:1px solid rgba(80,140,210,.3)}"+
      "body.pv-2col .pv-relato .relato{max-height:240px;overflow-y:auto;margin:0;padding:4px 8px}"+
      "body[data-tema=aero].pv-2col .pv-relato,body[data-tema=negro].pv-2col .pv-relato{background:rgba(12,28,50,.9);border-color:rgba(120,170,240,.25)}"+
      "body[data-tema=aero].pv-2col .pv-relato-t,body[data-tema=negro].pv-2col .pv-relato-t{background:linear-gradient(180deg,#1e3c64,#12294a);color:#e3f0ff}"+
      "body[data-tema=aero].pv-2col .pv-relato .rel,body[data-tema=negro].pv-2col .pv-relato .rel{color:#dbe9fb;border-bottom-color:rgba(120,170,240,.18)}"+
      "body[data-tema=aero].pv-2col .pv-relato .rel .m,body[data-tema=negro].pv-2col .pv-relato .rel .m{color:#8fd0ff;opacity:.85}"+
      "body[data-tema=aero].pv-2col .pv-relato .rel.gol,body[data-tema=negro].pv-2col .pv-relato .rel.gol{color:#9ff0b0}"+
      "body[data-tema=aero].pv-2col .pv-relato .rel.grave,body[data-tema=negro].pv-2col .pv-relato .rel.grave{color:#ffb0a6}"+
    "}";
  document.head.appendChild(st);
}

/* 7.9078 · marca explícita (no solo :has, que en algún entorno no se reevalúa): la sección vive en una ventana */
function marcarVistaConVentana(){
  const v=document.getElementById("vista"); if(!v) return;
  const hay=!!v.querySelector(":scope > .ventana-so.in-vista");
  v.classList.toggle("con-ventana",hay);
  /* estilo en línea: Chrome a veces no recalcula #vista tras las reglas con :has() de pulido.css
     (medido: clase puesta, regla !important que calza, y column-count seguía en 2) */
  if(hay) v.style.setProperty("column-count","1","important"); else v.style.removeProperty("column-count");
}
(function(){
  const o=window.envolverVistaSO;
  if(typeof o==="function"&&!o._cv){ const w=function(){ const r=o.apply(this,arguments); try{ marcarVistaConVentana(); }catch(e){} return r; }; Object.keys(o).forEach(k=>w[k]=o[k]); w._cv=true; w._orig=o; window.envolverVistaSO=w; }
  const r=window.render;
  if(typeof r==="function"&&!r._cv){ const w=function(){ const x=r.apply(this,arguments); try{ marcarVistaConVentana(); }catch(e){} return x; }; Object.keys(r).forEach(k=>w[k]=r[k]); w._cv=true; w._orig=r; window.render=w; }
})();

/* 7.9105 · pregunta del partido compacta (como antes, con las mismas preguntas y descripciones). Este bloque manda sobre
   las capas viejas (movil.css, pulido.css, interfaz-aero 144): hoja fija, 62vh, padding del fondo. */
if(typeof document!=="undefined"&&!document.getElementById("css-partido-orden")){
  const st=document.createElement("style"); st.id="css-partido-orden";
  st.textContent=
    "html body .momento-vivo.mv-compacto{position:static !important;left:auto !important;right:auto !important;bottom:auto !important;max-height:none !important;overflow:visible !important;margin:8px 0 !important;z-index:auto !important;box-shadow:0 2px 10px rgba(0,0,0,.18) !important}"+
    "html body.hay-momento .partido-wrap{padding-bottom:12px !important}"+
    "html body .marcador-vivo .eq{display:flex;flex-direction:column;align-items:center;gap:4px}html body .marcador-vivo .eq-esc{display:block;line-height:0}"+
    "@media (max-width:420px){html body .marcador-vivo .eq-esc svg,html body .marcador-vivo .eq-esc img{width:24px !important;height:24px !important}}"+
    /* el chat en vivo se repinta cada rato: el anclaje de scroll de Chrome lo seguía y mandaba la página al fondo */
    "html:has(body.en-partido),html body.en-partido,html body.en-partido #vista{overflow-anchor:none !important}"+
    "html body .mv-compacto .cab{display:flex;align-items:center;gap:6px}"+
    "html body .mv-compacto .mv-ir-chat{margin-left:auto;font:600 11.5px system-ui;padding:3px 8px;border-radius:999px;border:1px solid rgba(40,90,160,.35);background:rgba(255,255,255,.75);color:#0d2c4d;cursor:pointer;white-space:nowrap}"+
    "html body .mv-compacto .cuerpo{padding:8px 10px !important}"+
    "html body .mv-compacto .cuerpo > p{margin:0 0 6px !important;font-size:13px !important;line-height:1.35}"+
    "html body .mv-compacto .ops-part{display:grid !important;grid-template-columns:1fr 1fr !important;gap:5px !important}"+
    "html body .mv-compacto .op-grupo{grid-column:1/-1;margin:4px 0 0 !important;padding:0 !important;font-size:10.5px !important;letter-spacing:.06em;opacity:.8}"+
    "html body .mv-compacto .ops-part .op{min-height:0 !important;padding:6px 8px !important;margin:0 !important;text-align:left}"+
    "html body .mv-compacto .ops-part .op::before{display:none !important}"+
    "html body .mv-compacto .op .t{font-size:13.5px !important;line-height:1.25 !important;font-weight:700}"+
    "html body .mv-compacto .op .d{font-size:11.5px !important;line-height:1.25 !important;margin-top:2px;opacity:.85}"+
    "html body .mv-compacto .op .ef-linea{font-size:11px !important;line-height:1.25 !important;margin-top:2px}"+
    "html body .mv-compacto .op .tecla{font-size:10px;padding:0 4px;min-width:0}"+
    "html body .mv-compacto .hint-teclado{margin:6px 0 0 !important;font-size:11px !important}"+
    /* en celu, mientras hay pregunta: fuera las estadísticas de al lado (vuelven al responder) y la barra de control */
    "@media (max-width:1099px){html body.hay-momento .partido-wrap .partido-stats{display:none !important}"+
      "}"+   /* 7.9111 · el alto de la cancha con pregunta lo fija _cvSize (sin aplastar el dibujo) */
    "@media (max-width:420px){html body .mv-compacto .op .t{font-size:13px !important}}"+
    /* balón parado en el celu: si el escenario no llena el alto (córner), el contenido va centrado y no queda un hoyo */
    "@media (max-width:760px){html body .modal.escena-3d :is(.cuerpo,.so-cuerpo,.window-body){display:flex !important;flex-direction:column !important;justify-content:center !important}}"+
    /* barra de control del celu: 6 botones secundarios en una fila (antes 5 columnas y la cámara quedaba sola abajo) */
    "@media (max-width:760px){html body .ctrlPartido{gap:5px !important;padding:6px 8px calc(8px + env(safe-area-inset-bottom,0px)) !important}"+
      "html body .ctrlPartido .ctrl-sec{grid-template-columns:repeat(6,minmax(0,1fr)) !important;gap:4px !important}"+
      "html body .ctrlPartido .ctrl-main .btn-aqua{min-height:40px !important}"+
      "html body .ctrlPartido .ctrl-sec .btn-aqua{min-height:36px !important;font-size:12px !important;padding:4px 2px !important}}"+
    "@media (max-width:1099px) and (max-height:720px){html body.hay-momento .partido-wrap .marcador-vivo{padding-top:4px !important;padding-bottom:4px !important}}"+
    /* PC: en la columna derecha va de a una opción por fila (es angosta) */
    "html body.pv-2col .pv-der .mv-compacto .ops-part{grid-template-columns:1fr !important}"+
    "html body.pv-2col .pv-der .mv-compacto{margin:0 !important}";
  document.head.appendChild(st);
}

