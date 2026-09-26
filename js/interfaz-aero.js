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
