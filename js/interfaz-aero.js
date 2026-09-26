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
  const movil=(typeof esMovil==="function")&&esMovil();
  const r=box.getBoundingClientRect();
  if(movil||r.top<0||r.bottom>window.innerHeight){ try{ window.scrollBy({top:r.top-(movil?58:90),behavior:"auto"}); }catch(e){ window.scrollBy(0,r.top-60); } }
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
