"use strict";
/* ============================================================
   FUTBOLINI · plop-vivo.js — PLOP! QUE ENTIENDE Y QUE VIVE (7.9137)
   Pedido del autor: "Plop está bastante bugeado: si haces una publicación salen los botones antiguos, se traspasan; sigue
   sin entender lo que publicas (puse algo serio y respuestas nada que ver); déjalo más como el Twitter real pero 2007,
   versión PLOP: se refresca con tweets nuevos, pero las respuestas se generan dentro de eso: si te metes ahí ves otro
   tiempo real de ese tweet, solo si es necesario. Darle vida a eso". Y para el banco: "usa DeepSeek para generarlo".

   1. LOS BOTONES: cada post que se pinta adentro de PLOP! (los que llegan en vivo, los que se repintan cuando alguien te
      responde) toma el estilo 2009 (plopCardAntiguo de interfaz-aero.js). Antes solo los de la primera pintada.
   2. ENTIENDE EL TEMA: plopTema() reconoce de qué hablas (luto, violencia, una causa social, una lesión, disculpas, el
      árbitro, una despedida, un refuerzo, el clásico, un triunfo, una derrota, una promesa, la hinchada, las entradas, la
      directiva, la cantera, el trabajo, humor, una pregunta) y la gente contesta desde ESE cajón de PLOP_BANCO
      (js/data-plop-banco.js: redactado con DeepSeek por tema y tipo de cuenta, revisado a mano, cuentas ficticias). En los
      temas serios no hay trolls ni hinchas rivales. Si no reconoce el tema, contesta como siempre.
   3. LAS RESPUESTAS LLEGAN DE A POCO, DENTRO DEL POST: quedan en t.hiloPend con su hora y van entrando (2 a 7 s entre una
      y otra). En la línea de tiempo el post muestra solo "💬 N respuestas"; al entrar al post (la conversación) ves
      llegar las respuestas en vivo y puedes contestar ahí mismo.
   4. SE REFRESCA COMO TWITTER: los plops nuevos no te empujan el feed; arriba aparece "🔄 N plops nuevos" y los cargas
      cuando quieras.
   ============================================================ */
const PLOP_TEMAS=[
  ["luto",/(falleci|muri[oó]\b|\bqepd\b|q\.e\.p\.d|descanse en paz|condolencia|p[eé]same|\bluto\b|se nos fue|nos dej[oó]|partida de nuestro|q\.?d\.?e\.?p)/],
  ["violencia",/(violencia|incidentes|barras? bravas?|agresi[oó]n|no al odio|estadio seguro|bengalas?|apu[ñn]al|heridos|desmanes)/],
  ["social",/(terremoto|incendio|inundaci|colecta|donaci|solidari|salud mental|inclusi[oó]n|femenino|damnificad|aluvi[oó]n|emergencia|campa[ñn]a de ayuda)/],
  ["lesion",/(lesi[oó]n|lesionad|se rompi[oó]|ligamento|cruzado|desgarro|pronta recuperaci|fuerza (campe[oó]n|crack|hermano|amigo|grande|\w+!))/],
  ["disculpas",/(perd[oó]n\b|disculpas|lo siento|me equivoqu|asumo (la|mi|toda)|mea culpa|pido perd)/],
  ["arbitro",/([aá]rbitro|\bvar\b|referee|nos robaron|\brobo\b|penal (no|que no)|no cobr|cobraron|\bjuez\b)/],
  ["despedida",/(despid|gracias por todo|hasta siempre|adi[oó]s|se va del club|se marcha|nuevo destino|[eé]xito en lo que viene)/],
  ["refuerzo",/(refuerzo|fichaje|bienvenid|nuevo jugador|se suma al|se incorpora|firm[oó] (con|por))/],
  ["clasico",/(cl[aá]sico|supercl[aá]sico|rival de siempre|derbi)/],
  ["triunfo",/(ganamos|triunfo|victoria|golazo|tres puntos|3 puntos|campeones|festej|qu[eé] partidazo|se gan[oó])/],
  ["derrota",/(perdimos|derrota|doli[oó]|nos ganaron|levantarnos|a levantarse|ca[ií]mos|golpe duro|no se dio)/],
  ["promesa",/(vamos a ganar|prometo|le vamos a ganar|ser campe|vamos a subir|ascender|vamos por el t[ií]tulo|lo vamos a lograr|te lo aseguro)/],
  ["hinchada",/(hinchada|aliento|galer[ií]a|los que viajan|nunca nos dejan|gracias a la gente|nuestra gente|la barra|hinchas)/],
  ["entradas",/(entradas|boleter[ií]a|estadio lleno|llenar el estadio|llenemos|los esperamos|vengan al|abonos?)/],
  ["directiva",/(directiva|directorio|presidente|dirigente|sociedad an[oó]nima|concesionaria|due[ñn]os del club|la plata del club|presupuesto)/],
  ["cantera",/(cantera|juveniles?|\bcabros\b|sub[- ]?(1[5-9]|2[0-3])\b|formaci[oó]n|canteranos?)/],
  ["trabajo",/(entren|pr[aá]ctica|concentraci[oó]n|trabajando|preparando|semana de trabajo|pretemporada)/],
  ["humor",/(jaja|jeje|\bxd\b|\bmeme\b|broma|chiste|😂|🤣)/],
  ["pregunta",/(\?\s*$|qu[eé] opinan|ustedes qu[eé]|qu[eé] dicen|qu[eé] once|cu[aá]l prefieren|ideas\?)/]
];
const PLOP_SERIOS=["luto","violencia","social","lesion"];
const PLOP_CRITICOS=["@el_verdadero_hincha","@critico_del_club","@memoria_de_hincha","@bancado_de_sillon","@socio_exigente"];
const PLOP_TROLLS=["@cuenta_troll","@el_que_sabe_todo","@opinologo_99","@humo_y_mas_humo"];
const PLOP_RIVALES=["@hincha_rival","@del_otro_lado","@rival_de_siempre"];
function plopTema(txt){
  const t=String(txt||"").toLowerCase();
  if(!t.trim()) return null;
  for(const x of PLOP_TEMAS){ if(x[1].test(t)) return x[0]; }
  return null;
}
function _plopElige(a){ return a[Math.floor(Math.random()*a.length)]; }
/* las respuestas de un tema, por tipo de cuenta (sin repetir dentro del mismo post) */
function plopRespuestasTema(tema,n,t){
  const B=(typeof PLOP_BANCO!=="undefined")&&PLOP_BANCO[tema]; if(!B) return null;
  const serio=PLOP_SERIOS.indexOf(tema)>=0;
  const pesos=serio?[["hincha",6],["prensa",2],["critico",1],["jugador",2]]:[["hincha",6],["critico",2],["prensa",2],["jugador",1],["troll",1],["rival",1]];
  const usadas={}; (t&&t.hilo||[]).concat(t&&t.hiloPend||[]).forEach(h=>{ usadas[h.texto]=1; });
  const club=(E&&E.clubNombre)||"el club", part=(typeof proximoPartido==="function")&&proximoPartido(), riv=(part&&part.rivalNombre)||"el rival";
  const out=[], tot=pesos.reduce((s,p)=>s+p[1],0);
  for(let i=0;i<n*3&&out.length<n;i++){
    let r=Math.random()*tot, tipo="hincha"; for(const p of pesos){ r-=p[1]; if(r<=0){ tipo=p[0]; break; } }
    const lista=(B[tipo]||[]).filter(x=>!usadas[x.replace(/\{CLUB\}/g,club).replace(/\{RIVAL\}/g,riv)]); if(!lista.length) continue;
    const texto=_plopElige(lista).replace(/\{CLUB\}/g,club).replace(/\{RIVAL\}/g,riv); usadas[texto]=1;
    const autor=tipo==="prensa"?_plopElige(typeof HANDLES_PRENSA!=="undefined"?HANDLES_PRENSA:["@RadioGolAM"])
      :(tipo==="critico"?_plopElige(PLOP_CRITICOS):(tipo==="troll"?_plopElige(PLOP_TROLLS):(tipo==="rival"?_plopElige(PLOP_RIVALES)
      :(tipo==="jugador"?((typeof handleJugador==="function")?handleJugador():"@jugador_oficial"):_plopElige(typeof HANDLES_HINCHA!=="undefined"?HANDLES_HINCHA:["@hincha_de_ley"])))));
    out.push({autor:autor, texto:texto, fecha:"ahora", tipo:tipo==="critico"||tipo==="troll"?"hincha":tipo, tema:tema});
  }
  return out;
}
/* las respuestas no caen todas juntas: cada una tiene su hora de llegada */
function plopProgramar(t,items){
  if(!t||!items||!items.length) return;
  t.hiloPend=t.hiloPend||[];
  let cuando=Date.now()+1500+Math.random()*2500;
  const ult=t.hiloPend.length?t.hiloPend[t.hiloPend.length-1].llega:0; if(ult>cuando) cuando=ult+1500;
  items.forEach(h=>{ h.llega=Math.round(cuando); t.hiloPend.push(h); cuando+=2000+Math.random()*5000; });
}
/* llegan las que tocan (ahora puede venir de afuera para probar) */
function plopLlegaRespuestas(ahora){
  ahora=ahora||Date.now();
  const llegados=[];
  ((E&&E.timeline)||[]).forEach(t=>{
    if(!t||!t.hiloPend||!t.hiloPend.length) return;
    while(t.hiloPend.length&&t.hiloPend[0].llega<=ahora){
      const h=t.hiloPend.shift(); delete h.llega; t.hilo=t.hilo||[]; t.hilo.push(h); t.replies=(t.replies||0)+1; llegados.push([t,h]); }
  });
  return llegados;
}
function _plopTick(){
  if(typeof E==="undefined"||!E||!E.timeline) return;
  const L=plopLlegaRespuestas(); if(!L.length) return;
  const vistos=new Set();
  L.forEach(([t,h])=>{
    if(PLOP_CONV.t===t) _plopConvAgregar(h,true);
    if(!vistos.has(t)){ vistos.add(t); try{ if(t._nodo&&t._nodo.isConnected&&typeof _repintarPost==="function") _repintarPost(t); }catch(e){} }
  });
  if(PLOP_CONV.t) _plopConvEscribiendo();
}
/* ---------- la conversación de un post: su propio tiempo real ---------- */
const PLOP_CONV={t:null, lista:null, esc:null};
function _plopFilaRespuesta(h,nueva){
  const f=el("div","plop-conv-fila"+(nueva?" nueva":"")+(h.mia?" mia":""));
  f.innerHTML=(typeof _plopAvatar==="function"?_plopAvatar(String(h.autor||"").replace(/^@/,"")):"")+
    '<div class="plop-conv-c"><b>'+escHtml(h.autor||"")+'</b> <span class="mini">· '+escHtml(h.fecha||"ahora")+'</span><div>'+escHtml(h.texto||"")+'</div></div>';
  return f;
}
function _plopConvAgregar(h,nueva){ if(!PLOP_CONV.lista||!PLOP_CONV.lista.isConnected) return; PLOP_CONV.lista.appendChild(_plopFilaRespuesta(h,nueva)); PLOP_CONV.lista.scrollTop=PLOP_CONV.lista.scrollHeight; }
function _plopConvEscribiendo(){ const t=PLOP_CONV.t, e=PLOP_CONV.esc; if(!e||!t) return;
  const n=(t.hiloPend||[]).length; e.textContent=n?"✍️ "+(n===1?"alguien está escribiendo…":n+" personas están escribiendo…"):""; }
function plopAbrirConversacion(t){
  if(!t) return;
  modal(function(box){
    const cu=(typeof montarBarraSO==="function")?montarBarraSO(box,"PLOP! · Conversación","💬",function(){ PLOP_CONV.t=null; cerrarModal(); })
      :(function(){ box.appendChild(el("div","cab",'<span class="ic">💬</span><span>Conversación</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();
    cu.classList.add("plop-conv");
    const o=el("div","plop-conv-orig");
    o.innerHTML=(typeof _plopAvatar==="function"?_plopAvatar(String(t.autor||"").replace(/^@/,"")):"")+'<div><b>'+escHtml(t.autor||"")+'</b><div class="plop-conv-txt">'+escHtml(t.texto||"")+
      '</div><div class="mini">'+escHtml((t.fecha||"hoy")+" "+(t.anio||""))+" · ♡ "+(t.likes||0).toLocaleString("es-CL")+(t.rts?" · RT "+t.rts:"")+"</div></div>";
    cu.appendChild(o);
    const lista=el("div","plop-conv-lista"); (t.hilo||[]).forEach(h=>lista.appendChild(_plopFilaRespuesta(h,false)));
    if(!(t.hilo||[]).length&&!(t.hiloPend||[]).length) lista.appendChild(el("p","mini","Nadie respondió todavía."));
    cu.appendChild(lista);
    const esc=el("div","plop-conv-esc mini"); cu.appendChild(esc);
    const w=el("div","plop-conv-resp"), inp=el("input","entrada"); inp.type="text"; inp.maxLength=140; inp.placeholder="Responder a "+(t.autor||"")+"…"; inp.setAttribute("aria-label","Responder");
    const ok=el("button","btn-aqua chico verde","Responder");
    const enviar=function(){ const v=inp.value; if(!String(v||"").trim()) return; const n0=(t.hilo||[]).length;
      if(typeof enviarReply==="function") enviarReply(t,v); inp.value="";
      (t.hilo||[]).slice(n0).forEach(h=>{ h.mia=true; _plopConvAgregar(h,true); }); _plopConvEscribiendo(); };
    ok.onclick=enviar; inp.onkeydown=function(ev){ if(ev.key==="Enter"){ ev.preventDefault(); enviar(); } };
    w.appendChild(inp); w.appendChild(ok); cu.appendChild(w);
    PLOP_CONV.t=t; PLOP_CONV.lista=lista; PLOP_CONV.esc=esc; _plopConvEscribiendo();
    setTimeout(function(){ lista.scrollTop=lista.scrollHeight; },0);
  },{clase:"ventana-so plop-conv-win"});
}
/* ---------- enganches ---------- */
(function(){
  /* respuestas por tema, que llegan de a poco */
  const oh=window.responderHilo;
  if(typeof oh==="function"&&!oh._vivo){
    const w=function(t,txtYo){
      if(!t) return [];
      t.hilo=t.hilo||[];
      const n0=t.hilo.length, r0=t.replies||0, tema=plopTema(txtYo);
      let items=null;
      if(tema&&!(typeof textoSinSentido==="function"&&textoSinSentido(txtYo))) items=plopRespuestasTema(tema,(typeof ri==="function")?ri(4,6):5,t);
      if(!items||!items.length){ items=oh.apply(this,arguments)||[]; t.hilo.splice(n0); t.replies=r0; }
      if(tema) t.tema=tema;
      plopProgramar(t,items);
      return items;
    };
    Object.keys(oh).forEach(k=>w[k]=oh[k]); w._vivo=true; window.responderHilo=w;
  }
  /* el análisis del post sabe de qué hablaste (lo serio se recibe en serio) */
  const oa=window.analizarOffline;
  if(typeof oa==="function"&&!oa._vivo){
    const w=function(texto){
      const r=oa.apply(this,arguments)||{}, tema=plopTema(texto);
      if(tema){ r.tema=tema;
        if(tema==="luto"){ r.sentimiento=Math.max(r.sentimiento||0,12); r.promesa=null; r.consecuencia="La gente valora el gesto: en PLOP! se habla con respeto."; }
        else if(tema==="violencia"||tema==="social"){ r.sentimiento=Math.max(r.sentimiento||0,10); r.consecuencia="La gente que va al estadio en familia lo agradece; la prensa lo destaca."; }
        else if(tema==="disculpas"){ r.sentimiento=(r.sentimiento||0)+6; r.consecuencia="Reconocer el error baja la presión. La prensa toma nota, la galería también."; }
        else if(tema==="arbitro") r.consecuencia=(r.consecuencia||"")+" Reclamarle al árbitro en público queda registrado en la ANFP."; }
      return r;
    };
    Object.keys(oa).forEach(k=>w[k]=oa[k]); w._vivo=true; window.analizarOffline=w;
  }
  /* cada post de PLOP! sale con el estilo 2009 y, en la línea de tiempo, sin el hilo adentro: "💬 N respuestas" */
  const or=window.renderPostEl;
  if(typeof or==="function"&&!or._vivo){
    const w=function(t){
      const d=or.apply(this,arguments);
      try{
        if(typeof SEC!=="undefined"&&SEC==="redes"){
          d.querySelectorAll(".hilo-linea").forEach(x=>x.remove());
          [].slice.call(d.querySelectorAll("button")).forEach(b=>{ if(/^(Ver hilo|Cerrar hilo)/.test(b.textContent)) b.remove(); });
          const n=(t.hilo||[]).length, p=(t.hiloPend||[]).length;
          const c=el("button","plop-conv-link",(n?"💬 "+n+" respuesta"+(n>1?"s":""):"💬 Responder")+(p?" · ✍️ escribiendo…":"")+" · ver conversación");
          c.type="button"; c.onclick=function(ev){ if(ev) ev.stopPropagation(); plopAbrirConversacion(t); };
          const acc=[].slice.call(d.children).find(x=>x.tagName==="DIV"&&x.querySelector(":scope > .btn-aqua")&&!x.classList.contains("plop-cab"));
          d.insertBefore(c,acc||null);
          if(typeof plopCardAntiguo==="function") plopCardAntiguo(d);
        }
      }catch(e){}
      return d;
    };
    Object.keys(or).forEach(k=>w[k]=or[k]); w._vivo=true; window.renderPostEl=w;
  }
  /* los bots ya no empujan el feed: se juntan arriba en "🔄 N plops nuevos" */
  if(typeof arrancarPlopBots==="function"&&!arrancarPlopBots._vivo){
    arrancarPlopBots=function(){
      if(typeof detenerPlopBots==="function") detenerPlopBots();
      if(!E||(E.config&&E.config.plopBots===false)) return;
      PLOP_COLA.length=0;
      PLOP_TIMER=setInterval(function(){
        if(!E||SEC!=="redes"||REDES_TAB!=="inicio"){ detenerPlopBots(); return; }
        const capa=$("#capa-modal"); if(capa&&capa.children.length) return;
        if(typeof botPost!=="function") return;
        const item=botPost(); if(!item) return;
        PLOP_COLA.push(item); plopBarraNuevos();
      },5000);
    };
    arrancarPlopBots._vivo=true;
  }
  if(typeof window!=="undefined"&&!window._plopTickId) window._plopTickId=setInterval(function(){ try{ _plopTick(); }catch(e){} },1500);
})();
const PLOP_COLA=[];
function plopBarraNuevos(){
  const feed=document.getElementById("plopFeed"); if(!feed) return;
  let b=feed.parentNode.querySelector(".plop-nuevos");
  if(!b){ b=el("button","plop-nuevos"); b.type="button"; feed.parentNode.insertBefore(b,feed);
    b.onclick=function(){ const items=PLOP_COLA.splice(0); items.reverse().forEach(it=>{ const n=renderPostEl(it); n.classList.add("plop-nuevo"); feed.insertBefore(n,feed.firstChild); });
      while(feed.children.length>60) feed.removeChild(feed.lastChild); b.remove(); feed.scrollTop=0; }; }
  b.textContent="🔄 "+PLOP_COLA.length+" plop"+(PLOP_COLA.length>1?"s":"")+" nuevo"+(PLOP_COLA.length>1?"s":"");
}
if(typeof document!=="undefined"&&!document.getElementById("css-plop-vivo")){
  const st=document.createElement("style"); st.id="css-plop-vivo";
  st.textContent=
    ".plop-conv-link{display:block;background:none;border:0;padding:2px 0;margin:3px 0 0;color:#0084b4;font-size:12px;cursor:pointer;text-align:left}"+
    ".plop-conv-link:hover{text-decoration:underline}"+
    ".plop-nuevos{display:block;width:100%;margin:0 0 6px;padding:8px;border:1px solid #c0deed;border-radius:4px;background:linear-gradient(180deg,#fefefe,#e9f5fb);color:#0084b4;font:700 13px 'Lucida Grande',Tahoma,sans-serif;cursor:pointer}"+
    ".plop-nuevos:hover{background:#dff1fa}"+
    ".plop-conv{font-family:'Lucida Grande','Lucida Sans Unicode',Tahoma,Arial,sans-serif;color:#333}"+
    ".plop-conv-orig{display:grid;grid-template-columns:56px 1fr;gap:10px;padding:10px;border-bottom:1px solid #e1e8ed;background:#fff;border-radius:6px 6px 0 0}"+
    ".plop-conv-orig .plopt-av,.plop-conv-fila .plopt-av{display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:5px;color:#fff;font-weight:800}"+
    ".plop-conv-txt{font-size:18px;line-height:1.35;margin:4px 0}"+
    ".plop-conv-lista{max-height:46vh;overflow-y:auto;background:#fff;border-radius:0 0 6px 6px;padding:2px 10px}"+
    ".plop-conv-fila{display:grid;grid-template-columns:40px 1fr;gap:8px;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13.5px}"+
    ".plop-conv-fila .plopt-av{width:36px;height:36px;font-size:12px}"+
    ".plop-conv-fila b{color:#0084b4}.plop-conv-fila.mia{background:#f5fbff}"+
    ".plop-conv-fila.nueva{animation:plopLlega .6s ease-out}@keyframes plopLlega{from{background:#fff7c2;transform:translateY(-4px);opacity:.3}to{background:transparent;transform:none;opacity:1}}"+
    ".plop-conv-esc{min-height:18px;margin:6px 2px;color:#888;font-style:italic}"+
    ".plop-conv-resp{display:flex;gap:6px;margin-top:4px}.plop-conv-resp input{flex:1;min-width:0}";
  document.head.appendChild(st);
}
