"use strict";
/* ============================================================
   FUTBOLINI · multi.js — 7.9116 · DUELOS EN SALA (tipo Gartic / Haxball)
   Pedido del autor: "el duelo no funciona, es engorrosísimo: debería ser una sala tipo pinturillo, gartic,
   haxball, más simple, con contraseña. Ordenado e igual que los partidos normales. Y como está separado del
   juego, que viva en Ajustes y ahí decides en qué sección aparece".
   · SALA: el que crea recibe un código de 5 letras (ej. K7QZP) y, si quiere, pone contraseña. El otro escribe el
     código (o abre el link ?sala=K7QZP) y la contraseña. Nada de copiar códigos gigantes.
   · Cómo se encuentran: PeerJS (js/vendor/peerjs.min.js, MIT) usa un buzón público gratuito SOLO para presentar
     a los dos navegadores; el juego viaja directo entre ustedes (WebRTC, cifrado). Sin servidor propio.
     Si el buzón no responde: "Conexión directa" (el copia-pega de antes) sigue en Opciones avanzadas.
   · Seguridad: la contraseña nunca viaja (va su hash con el código de sala); 6 claves malas y la sala se cierra;
     todo lo que llega del rival se valida (tipos, números, clubes de la lista) y los textos se escapan.
   · El duelo: 9 jugadas de un partido (min 10 a 90). En cada una eliges cómo la juegas; hay 15 s y si no eliges
     va "equilibrado". El anfitrión calcula con la fuerza real de cada club. Marcador, cancha y relato como en
     los partidos normales.
   ============================================================ */
const MP = {
  peer:null, conn:null, pc:null, dc:null, via:null, rol:null, conectado:false,
  yo:null, rival:null, codigo:null, claveHash:null, intentosMalos:0,
  miClub:null, rivalClub:null, miListo:false, rivalListo:false,
  serie:{g:0,e:0,p:0}, duel:null, watchdog:null, onMensaje:null, ritmo:{n:0,t:0},
  ICE:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}]
};
const SALA_PREFIJO="futbolini-v1-";
const SALA_ALFABETO="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DUELO_SEG=15;          /* segundos para elegir en cada jugada */
const DUELO_MAX_MALAS=6;     /* claves equivocadas antes de cerrar la sala */

/* ---------- clubes del duelo (era 2026) ---------- */
function mpClubes(){
  const src=(typeof CLUB_INFO_2026!=="undefined")?CLUB_INFO_2026:(typeof CLUB_INFO!=="undefined"?CLUB_INFO:{});
  return Object.keys(src).map(function(id){ return {id:id, n:src[id].n, esc:src[id].esc}; });
}
function mpEsClub(id){ return typeof id==="string" && mpClubes().some(function(c){ return c.id===id; }); }
function mpNombreClub(id){ const c=mpClubes().find(function(x){ return x.id===id; }); return c?c.n:"—"; }
function _mpEsc(s){ return (typeof escHtml==="function")?escHtml(String(s==null?"":s)):String(s==null?"":s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]; }); }
function _mpNombreLimpio(s){ const t=(typeof textoLimpio==="function")?textoLimpio(String(s||""),24):String(s||"").replace(/[<>]/g,"").slice(0,24); return t.trim()||"DT"; }
function mpSoportado(){ return typeof RTCPeerConnection!=="undefined"; }
function mpSalasDisponibles(){ return mpSoportado() && !(typeof navigator!=="undefined" && navigator.onLine===false); }
/* PeerJS (93 KB) se baja recién al abrir Duelos, no al abrir el juego */
let _mpCargaPeer=null;
function cargarPeerJS(){
  if(typeof Peer==="function") return Promise.resolve(true);
  if(_mpCargaPeer) return _mpCargaPeer;
  _mpCargaPeer=new Promise(function(res){
    const s=document.createElement("script"); s.src="js/vendor/peerjs.min.js"; s.async=true;
    s.onload=function(){ res(typeof Peer==="function"); }; s.onerror=function(){ _mpCargaPeer=null; res(false); };
    document.head.appendChild(s);
  });
  return _mpCargaPeer;
}

/* ---------- códigos y contraseña ---------- */
function mpCodigoNuevo(){
  let s=""; const a=SALA_ALFABETO;
  const r=(typeof crypto!=="undefined"&&crypto.getRandomValues)?crypto.getRandomValues(new Uint32Array(5)):null;
  for(let i=0;i<5;i++) s+=a[(r?r[i]:Math.floor(Math.random()*1e9))%a.length];
  return s;
}
function mpCodigoValido(c){ return typeof c==="string" && /^[A-HJ-NP-Z2-9]{5}$/.test(c); }
function mpNormalizarCodigo(c){ return String(c||"").toUpperCase().replace(/[^A-Z0-9]/g,"").replace(/[O]/g,"0").replace(/[I]/g,"1").replace(/[01]/g,"").slice(0,5); }
async function mpHashClave(codigo,clave){
  const txt="futbolini|"+codigo+"|"+String(clave||"");
  try{ if(typeof crypto!=="undefined"&&crypto.subtle&&typeof TextEncoder!=="undefined"){
    const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(txt));
    return Array.from(new Uint8Array(b)).map(function(x){ return x.toString(16).padStart(2,"0"); }).join(""); } }catch(e){}
  let h=5381; for(let i=0;i<txt.length;i++) h=((h*33)^txt.charCodeAt(i))>>>0; return "d"+h.toString(16);   /* sin crypto.subtle (http plano) */
}
function _mpIguales(a,b){ a=String(a||""); b=String(b||""); if(a.length!==b.length) return false; let d=0; for(let i=0;i<a.length;i++) d|=a.charCodeAt(i)^b.charCodeAt(i); return d===0; }

/* ---------- lo que llega del rival se valida SIEMPRE ---------- */
const MP_TIPOS=["entrar","bienvenida","rechazo","hola","club","listo","arrancar","duelo_pick","duelo_ronda","duelo_res","duelo_fin","revancha","chao"];
function mpValidarMsg(raw){
  if(typeof raw!=="string"||raw.length>2000) return null;
  let m; try{ m=JSON.parse(raw); }catch(e){ return null; }
  if(!m||typeof m!=="object"||MP_TIPOS.indexOf(m.tipo)<0) return null;
  const ent=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
  const o={tipo:m.tipo};
  switch(m.tipo){
    case "entrar": if(typeof m.clave!=="string"||m.clave.length>80) return null; o.clave=m.clave; o.nombre=_mpNombreLimpio(m.nombre); break;
    case "bienvenida": case "hola": o.nombre=_mpNombreLimpio(m.nombre); break;
    case "rechazo": o.motivo=["clave","llena","cerrada"].indexOf(m.motivo)>=0?m.motivo:"cerrada"; break;
    case "club": if(!mpEsClub(m.club)) return null; o.club=m.club; break;
    case "listo": o.listo=m.listo===true; break;
    case "arrancar": if(!mpEsClub(m.rivalClub)) return null; o.rivalClub=m.rivalClub; break;
    case "duelo_pick": if(!ent(m.n,1,30)||!ent(m.idx,0,2)) return null; o.n=m.n; o.idx=m.idx; break;
    case "duelo_ronda": if(!ent(m.n,1,30)||!ent(m.total,1,30)) return null; o.n=m.n; o.total=m.total; break;
    case "duelo_res": if(!ent(m.n,1,30)||!ent(m.gHost,0,30)||!ent(m.gGuest,0,30)||!ent(m.pH,0,2)||!ent(m.pG,0,2)) return null;
      o.n=m.n; o.gHost=m.gHost; o.gGuest=m.gGuest; o.golH=m.golH===true; o.golG=m.golG===true; o.pH=m.pH; o.pG=m.pG; break;
    case "duelo_fin": if(!ent(m.gHost,0,30)||!ent(m.gGuest,0,30)) return null; o.gHost=m.gHost; o.gGuest=m.gGuest; break;
  }
  return o;
}
/* nadie te congela la pantalla mandando mensajes sin parar: 25 por segundo como tope */
function _mpRitmoOk(){ const t=Date.now(); if(t-MP.ritmo.t>1000){ MP.ritmo.t=t; MP.ritmo.n=0; } return ++MP.ritmo.n<=25; }

/* ---------- transporte: sala (PeerJS) o conexión directa (copia-pega) ---------- */
function mpEnviar(obj){
  const s=JSON.stringify(obj);
  try{
    if(MP.conn&&MP.conn.open){ MP.conn.send(s); return true; }
    if(MP.dc&&MP.dc.readyState==="open"){ MP.dc.send(s); return true; }
  }catch(e){}
  return false;
}
function _mpRecibir(raw){
  if(!_mpRitmoOk()) return;
  const m=mpValidarMsg(typeof raw==="string"?raw:"");
  if(!m) return;
  /* portero de la sala: el que entra tiene que dar la clave antes de cualquier otra cosa */
  if(MP.rol==="host"&&MP.via==="sala"&&!MP.conectado){
    if(m.tipo!=="entrar") return;
    if(!_mpIguales(m.clave,MP.claveHash)){
      MP.intentosMalos++;
      mpEnviar({tipo:"rechazo",motivo:MP.intentosMalos>=DUELO_MAX_MALAS?"cerrada":"clave"});
      const c=MP.conn; MP.conn=null; setTimeout(function(){ try{ c&&c.close(); }catch(e){} },300);
      if(MP.intentosMalos>=DUELO_MAX_MALAS){ mpReset(); if(typeof mpAlFallo==="function") mpAlFallo("Alguien probó "+DUELO_MAX_MALAS+" contraseñas malas: cerramos la sala por seguridad. Crea otra."); }
      return;
    }
    MP.rival=m.nombre; MP.conectado=true;
    if(MP.watchdog){ clearTimeout(MP.watchdog); MP.watchdog=null; }
    mpEnviar({tipo:"bienvenida",nombre:MP.yo});
    if(typeof mpAlConectar==="function") mpAlConectar();
    return;
  }
  if(m.tipo==="bienvenida"&&MP.rol==="guest"){ MP.rival=m.nombre; MP.conectado=true; if(MP.watchdog){ clearTimeout(MP.watchdog); MP.watchdog=null; } if(typeof mpAlConectar==="function") mpAlConectar(); return; }
  if(m.tipo==="rechazo"){ const txt={clave:"Contraseña equivocada.",llena:"Esa sala ya tiene dos jugadores.",cerrada:"La sala se cerró."}[m.motivo]; mpReset(); if(typeof mpAlFallo==="function") mpAlFallo(txt); return; }
  if(m.tipo==="hola"){ MP.rival=m.nombre; if(typeof mpAlConectar==="function") mpAlConectar(); return; }
  if(m.tipo==="chao"){ if(typeof mpAlCaer==="function") mpAlCaer("Tu rival salió de la sala."); mpReset(); return; }
  if(typeof MP.onMensaje==="function") MP.onMensaje(m);
}
function _mpEngancharConn(conn){
  conn.on("data",function(d){ _mpRecibir(d); });
  conn.on("close",function(){ if(MP.conn===conn){ const era=MP.conectado; MP.conectado=false; MP.conn=null; if(era&&typeof mpAlCaer==="function") mpAlCaer(); } });
  conn.on("error",function(){});
}
function mpReset(){
  if(MP.watchdog){ clearTimeout(MP.watchdog); MP.watchdog=null; }
  if(MP.duel&&MP.duel.reloj){ clearInterval(MP.duel.reloj); }
  try{ if(MP.conn){ MP.conn.close(); } }catch(e){}
  try{ if(MP.peer){ MP.peer.destroy(); } }catch(e){}
  try{ if(MP.dc) MP.dc.close(); }catch(e){}
  try{ if(MP.pc) MP.pc.close(); }catch(e){}
  MP.peer=null; MP.conn=null; MP.pc=null; MP.dc=null; MP.via=null; MP.rol=null; MP.conectado=false; MP.rival=null;
  MP.codigo=null; MP.claveHash=null; MP.intentosMalos=0;
  MP.miClub=null; MP.rivalClub=null; MP.miListo=false; MP.rivalListo=false;
  MP.serie={g:0,e:0,p:0}; MP.duel=null;
  if(typeof _duelCancha!=="undefined"&&_duelCancha){ try{ _duelCancha.parar(); }catch(e){} _duelCancha=null; }
}
async function _mpPeer(id){
  if(!(await cargarPeerJS())) throw new Error("sin_peerjs");
  return new Promise(function(res,rej){
    let p; try{ p=id?new Peer(id,{debug:0}):new Peer({debug:0}); }catch(e){ return rej(e); }
    const t=setTimeout(function(){ try{ p.destroy(); }catch(e){} rej(new Error("sin_buzon")); },12000);
    p.on("open",function(){ clearTimeout(t); res(p); });
    p.on("error",function(e){ clearTimeout(t); try{ p.destroy(); }catch(x){} rej(e); });
  });
}
/* ANFITRIÓN: crea la sala y queda esperando */
async function mpCrearSalaCodigo(clave){
  mpReset(); MP.rol="host"; MP.via="sala";
  for(let i=0;i<4;i++){
    const cod=mpCodigoNuevo();
    try{
      const p=await _mpPeer(SALA_PREFIJO+cod);
      MP.peer=p; MP.codigo=cod; MP.claveHash=await mpHashClave(cod,clave);
      p.on("connection",function(conn){
        if(MP.conn&&MP.conn.open){ conn.on("open",function(){ try{ conn.send(JSON.stringify({tipo:"rechazo",motivo:"llena"})); }catch(e){} setTimeout(function(){ try{ conn.close(); }catch(e){} },300); }); return; }
        MP.conn=conn; _mpEngancharConn(conn);
      });
      p.on("error",function(){});
      p.on("disconnected",function(){ try{ p.reconnect(); }catch(e){} });
      return cod;
    }catch(e){ if(e&&e.type==="unavailable-id") continue; throw e; }
  }
  throw new Error("sin_codigo");
}
/* VISITANTE: entra con código y contraseña */
async function mpEntrarSala(codigo,clave){
  mpReset(); MP.rol="guest"; MP.via="sala";
  const cod=mpNormalizarCodigo(codigo);
  if(!mpCodigoValido(cod)) throw new Error("codigo");
  const p=await _mpPeer(null); MP.peer=p; MP.codigo=cod;
  const hash=await mpHashClave(cod,clave);
  return new Promise(function(res,rej){
    const conn=p.connect(SALA_PREFIJO+cod,{reliable:true});
    const t=setTimeout(function(){ rej(new Error("no_existe")); },12000);
    p.on("error",function(e){ clearTimeout(t); rej(e&&e.type==="peer-unavailable"?new Error("no_existe"):e); });
    conn.on("open",function(){ clearTimeout(t); MP.conn=conn; _mpEngancharConn(conn);
      conn.send(JSON.stringify({tipo:"entrar",clave:hash,nombre:MP.yo}));
      MP.watchdog=setTimeout(function(){ if(!MP.conectado&&typeof mpAlFallo==="function") mpAlFallo("La sala no respondió."); },10000);
      res(true); });
  });
}
/* ---------- CONEXIÓN DIRECTA (plan B sin buzón): el copia-pega de antes ---------- */
function mpEsperarICE(pc){
  return new Promise(function(res){
    if(pc.iceGatheringState==="complete") return res();
    function chk(){ if(pc.iceGatheringState==="complete"){ pc.removeEventListener("icegatheringstatechange",chk); res(); } }
    pc.addEventListener("icegatheringstatechange",chk); setTimeout(res,3500);
  });
}
function mpCodificar(desc){ return btoa(JSON.stringify({t:desc.type,s:desc.sdp})); }
function mpDecodificar(codigo){
  const o=JSON.parse(atob(String(codigo).trim()));
  if(!o||(o.t!=="offer"&&o.t!=="answer")||typeof o.s!=="string"||o.s.length>20000) throw new Error("codigo");
  return {type:o.t, sdp:o.s};
}
function _mpCanalDirecto(dc){
  MP.dc=dc;
  dc.onopen=function(){ MP.conectado=true; if(MP.watchdog){ clearTimeout(MP.watchdog); MP.watchdog=null; } mpEnviar({tipo:"hola",nombre:MP.yo}); if(typeof mpAlConectar==="function") mpAlConectar(); };
  dc.onclose=function(){ const era=MP.conectado; MP.conectado=false; if(era&&typeof mpAlCaer==="function") mpAlCaer(); };
  dc.onmessage=function(ev){ _mpRecibir(ev.data); };
}
async function mpCrearSala(){
  mpReset(); MP.rol="host"; MP.via="directa";
  MP.pc=new RTCPeerConnection({iceServers:MP.ICE});
  _mpCanalDirecto(MP.pc.createDataChannel("futbolini",{ordered:true}));
  await MP.pc.setLocalDescription(await MP.pc.createOffer());
  await mpEsperarICE(MP.pc);
  return mpCodificar(MP.pc.localDescription);
}
async function mpConfirmarSala(resp){
  await MP.pc.setRemoteDescription(mpDecodificar(resp));
  MP.watchdog=setTimeout(function(){ if(!MP.conectado&&typeof mpAlFallo==="function") mpAlFallo(); },20000);
  return true;
}
async function mpUnirse(inv){
  mpReset(); MP.rol="guest"; MP.via="directa";
  MP.pc=new RTCPeerConnection({iceServers:MP.ICE});
  MP.pc.ondatachannel=function(ev){ _mpCanalDirecto(ev.channel); };
  await MP.pc.setRemoteDescription(mpDecodificar(inv));
  await MP.pc.setLocalDescription(await MP.pc.createAnswer());
  await mpEsperarICE(MP.pc);
  return mpCodificar(MP.pc.localDescription);
}

/* ============================================================
   EL DUELO (anfitrión autoritativo, por jugadas)
   ============================================================ */
const DUELO_OPS=[
  {t:"🗡️ Al ataque", d:"Más peligro arriba, pero quedas abierto.", aggr:1, rel:"salió a buscarlo"},
  {t:"⚖️ Equilibrado", d:"Ni muy arriba ni muy atrás.", aggr:0, rel:"la jugó con calma"},
  {t:"🛡️ Atrás", d:"Defiendes bien, pero te cuesta llegar.", aggr:-1, rel:"se metió atrás"}
];
const DUELO_RONDAS=9;
function fuerzaClub(id){
  if(typeof IND_BASE_2026!=="undefined"&&IND_BASE_2026[id]) return IND_BASE_2026[id].plantel||60;
  return 60;
}
function duelChance(fX,fY,aX,aY){
  let p=0.20+(fX-fY)*0.007+aX*0.06;
  if(aY<0) p-=0.10; else if(aY>0) p+=0.03;
  return clamp(p,0.05,0.55);
}
var duelRepintar=null, _duelCancha=null;
function duelMinuto(n,total){ return Math.round(n/(total||DUELO_RONDAS)*90); }
function duelIniciar(){
  MP.duel={n:0,total:DUELO_RONDAS,gHost:0,gGuest:0,fHost:fuerzaClub(MP.miClub),fGuest:fuerzaClub(MP.rivalClub),
    pickHost:null,pickGuest:null,fase:"eligiendo",ultimo:null,relato:[],hasta:0};
  duelRondaNueva();
}
function _duelReloj(){
  const d=MP.duel; if(!d) return;
  if(d.reloj) clearInterval(d.reloj);
  d.hasta=Date.now()+DUELO_SEG*1000;
  d.reloj=setInterval(function(){
    if(!MP.duel||MP.duel!==d){ clearInterval(d.reloj); return; }
    const falta=Math.max(0,Math.ceil((d.hasta-Date.now())/1000));
    const r=document.querySelector(".duelo-reloj b"); if(r) r.textContent=falta+" s";
    if(falta<=0){
      /* se acabó el tiempo: equilibrado (mío). El anfitrión además asume "equilibrado" del rival si no llegó. */
      if(d.fase==="eligiendo") duelMiPick(1);
      if(MP.rol==="host"&&d.pickGuest==null&&Date.now()>d.hasta+2500){ d.pickGuest=1; duelChequearResolver(); }
      if(d.fase!=="eligiendo"&&d.fase!=="esperando") clearInterval(d.reloj);
    }
  },250);
}
function duelRondaNueva(){
  const d=MP.duel; d.n++; d.pickHost=null; d.pickGuest=null; d.fase="eligiendo"; d.ultimo=null;
  mpEnviar({tipo:"duelo_ronda",n:d.n,total:d.total});
  _duelReloj();
  if(typeof duelRepintar==="function") duelRepintar();
}
function duelChequearResolver(){ const d=MP.duel; if(d&&d.fase!=="resultado"&&d.pickHost!=null&&d.pickGuest!=null) duelResolver(); }
function duelResolver(){
  const d=MP.duel;
  const aH=DUELO_OPS[d.pickHost].aggr, aG=DUELO_OPS[d.pickGuest].aggr;
  const golH=Math.random()<duelChance(d.fHost,d.fGuest,aH,aG);
  const golG=Math.random()<duelChance(d.fGuest,d.fHost,aG,aH);
  if(golH) d.gHost++; if(golG) d.gGuest++;
  const res={n:d.n,gHost:d.gHost,gGuest:d.gGuest,golH:golH,golG:golG,pH:d.pickHost,pG:d.pickGuest};
  mpEnviar(Object.assign({tipo:"duelo_res"},res));
  _duelAplicarRes(res);
  setTimeout(function(){ if(!MP.duel) return; if(MP.duel.n>=MP.duel.total) duelFin(); else duelRondaNueva(); },2600);
}
/* lo mismo en los dos lados: marcador, relato y la cancha */
function _duelAplicarRes(r){
  const d=MP.duel; if(!d) return;
  if(d.reloj) clearInterval(d.reloj);
  d.gHost=r.gHost; d.gGuest=r.gGuest; d.ultimo=r; d.fase="resultado";
  const host=MP.rol==="host";
  const yoN=mpNombreClub(MP.miClub), rivN=mpNombreClub(MP.rivalClub);
  const pYo=host?r.pH:r.pG, pRiv=host?r.pG:r.pH, golYo=host?r.golH:r.golG, golRiv=host?r.golG:r.golH;
  const min=duelMinuto(r.n,d.total);
  let txt=yoN+" "+DUELO_OPS[pYo].rel+" y "+rivN+" "+DUELO_OPS[pRiv].rel+". ";
  txt+=golYo&&golRiv?"¡Ida y vuelta: gol de los dos!":(golYo?"¡Gol de "+yoN+"!":(golRiv?"Gol de "+rivN+".":"Nada: se cierra la jugada."));
  d.relato=(d.relato||[]).concat([{min:min,txt:txt,tono:golYo&&!golRiv?"bien":(golRiv&&!golYo?"mal":"")}]).slice(-12);
  if(_duelCancha){
    _duelCancha.dominio(((pYo===0?0.5:pYo===2?-0.4:0)-(pRiv===0?0.4:pRiv===2?-0.3:0)));
    if(golYo) _duelCancha.gol(1,yoN,min); else if(golRiv) _duelCancha.gol(-1,rivN,min);
  }
  if(typeof duelRepintar==="function") duelRepintar();
}
function duelFin(){
  const d=MP.duel; d.fase="fin"; if(d.reloj) clearInterval(d.reloj);
  duelRegistrarSerie();
  mpEnviar({tipo:"duelo_fin",gHost:d.gHost,gGuest:d.gGuest});
  if(typeof duelRepintar==="function") duelRepintar();
}
function duelMiPick(idx){
  const d=MP.duel; if(!d||d.fase!=="eligiendo") return;
  if(MP.rol==="host") d.pickHost=idx; else { d.pickGuest=idx; mpEnviar({tipo:"duelo_pick",n:d.n,idx:idx}); }
  d.fase="esperando";
  if(typeof duelRepintar==="function") duelRepintar();
  if(MP.rol==="host") duelChequearResolver();
}
function duelMarcador(){ const d=MP.duel; if(!d) return [0,0]; return MP.rol==="host"?[d.gHost,d.gGuest]:[d.gGuest,d.gHost]; }
function duelRegistrarSerie(){
  const d=MP.duel; if(!d||d.registrado) return; d.registrado=true;
  const mc=duelMarcador();
  if(mc[0]>mc[1]) MP.serie.g++; else if(mc[0]===mc[1]) MP.serie.e++; else MP.serie.p++;
  try{ const key="futbolini_duelos", log=JSON.parse(localStorage.getItem(key)||"[]");
    log.push({rival:MP.rival||"amigo",yoClub:MP.miClub,rivalClub:MP.rivalClub,yo:mc[0],rival2:mc[1],t:Date.now()});
    if(log.length>50) log.splice(0,log.length-50); localStorage.setItem(key,JSON.stringify(log)); }catch(e){}
}
function serieTxt(){ const s=MP.serie; return s.g+" ganados · "+s.e+" empates · "+s.p+" perdidos"; }
var mpAlConectar=null, mpAlCaer=null, mpQuizasArrancar=null, mpAlFallo=null;
function mpCopiar(txt){
  try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt); return; } }catch(e){}
  try{ const ta=document.createElement("textarea"); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }catch(e){}
}

/* ============================================================
   UI · la ventana de duelos
   ============================================================ */
function nombreDTLocal(){ return _mpNombreLimpio((typeof E!=="undefined"&&E&&E.perfil&&E.perfil.nombre)||(typeof E!=="undefined"&&E&&E.dt)||"DT"); }
function _mpLink(cod){ try{ return location.origin+location.pathname+"?sala="+cod; }catch(e){ return "?sala="+cod; } }
function modalDuelo(opts){
  opts=opts||{};
  if(!mpSoportado()){ if(typeof aviso==="function") aviso("Tu navegador no soporta duelos (WebRTC)."); return; }
  MP.yo=MP.yo||nombreDTLocal();
  modal(function(box){
    box.classList.add("duelo-modal");
    const pintar=function(pantalla,datos){
      datos=datos||{};
      if(pantalla!=="duelo"&&_duelCancha){ _duelCancha.parar(); _duelCancha=null; }
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🎮</span><span>Duelos</span>'+(MP.codigo?'<span class="duelo-cod-mini">Sala '+_mpEsc(MP.codigo)+'</span>':"")));
      const c=el("div","cuerpo"); box.appendChild(c);
      const boton=(txt,cls,fn)=>{ const b=el("button","btn-aqua ancho "+(cls||""),txt); b.type="button"; b.onclick=fn; c.appendChild(b); return b; };
      const campo=(etq,attrs)=>{ const w=el("label","duelo-campo"); w.appendChild(el("span","mini",etq)); const i=el("input","entrada"); Object.keys(attrs||{}).forEach(k=>i.setAttribute(k,attrs[k])); w.appendChild(i); c.appendChild(w); return i; };
      const salir=()=>{ mpEnviar({tipo:"chao"}); mpReset(); cerrarModal(); };
      if(pantalla==="inicio"){
        c.appendChild(el("p","mini","Un duelo dirigido contra un amigo: cada uno maneja su club y el partido se decide jugada a jugada. Crea una sala, pasa el código de 5 letras (y la contraseña si le pusiste) y listo."));
        if(!mpSalasDisponibles()) c.appendChild(el("div","resul mitad","Las salas necesitan internet. Sin conexión puedes usar la <b>conexión directa</b> (abajo)."));
        const nom=campo("Tu nombre en la sala",{maxlength:"24",value:MP.yo});
        nom.onchange=()=>{ MP.yo=_mpNombreLimpio(nom.value); nom.value=MP.yo; };
        const fila=el("div","duelo-dos"); c.appendChild(fila);
        const b1=el("button","btn-aqua verde duelo-grande","🏟️ Crear sala"); b1.type="button"; b1.onclick=()=>{ MP.yo=_mpNombreLimpio(nom.value); pintar("crear"); };
        const b2=el("button","btn-aqua duelo-grande","🔑 Entrar a una sala"); b2.type="button"; b2.onclick=()=>{ MP.yo=_mpNombreLimpio(nom.value); pintar("unirse",{cod:opts.codigo||""}); };
        if(!mpSalasDisponibles()){ b1.disabled=true; b2.disabled=true; }
        fila.appendChild(b1); fila.appendChild(b2);
        const det=el("details","duelo-avanzado"); det.appendChild(el("summary",null,"Opciones avanzadas · conexión directa sin buzón"));
        det.appendChild(el("p","mini","Para cuando las salas no responden: se conectan copiando un código largo por WhatsApp o Discord, ida y vuelta."));
        const d1=el("button","btn-aqua chico","Crear (directa)"); d1.onclick=async()=>{ d1.disabled=true; try{ pintar("dHost",{cod:await mpCrearSala()}); }catch(e){ pintar("error",{msg:"No se pudo preparar la conexión."}); } };
        const d2=el("button","btn-aqua chico","Unirme (directa)"); d2.style.marginLeft="6px"; d2.onclick=()=>pintar("dGuest");
        det.appendChild(d1); det.appendChild(d2); c.appendChild(det);
        const log=(function(){ try{ return JSON.parse(localStorage.getItem("futbolini_duelos")||"[]"); }catch(e){ return []; } })();
        if(log.length){ c.appendChild(el("h3","sub","Tus últimos duelos"));
          log.slice(-4).reverse().forEach(x=>{ c.appendChild(el("div","fila","<span>vs "+_mpEsc(x.rival)+" · "+_mpEsc(mpNombreClub(x.yoClub))+" – "+_mpEsc(mpNombreClub(x.rivalClub))+"</span><b>"+(x.yo|0)+"-"+(x.rival2|0)+"</b>")); }); }
        boton("Cerrar","gris",salir).style.marginTop="8px";
      }
      else if(pantalla==="crear"){
        c.appendChild(el("h3","sub","Nueva sala"));
        const cl=campo("Contraseña (opcional, para que no entre cualquiera)",{maxlength:"40",type:"password",autocomplete:"new-password"});
        const b=boton("Crear sala","verde",async()=>{ b.disabled=true; b.textContent="Abriendo la sala…";
          try{ const cod=await mpCrearSalaCodigo(cl.value); pintar("esperando",{conClave:!!cl.value}); }
          catch(e){ pintar("error",{msg:"No se pudo abrir la sala (el buzón de salas no responde). Prueba en un rato o usa la conexión directa en Opciones avanzadas."}); } });
        boton("← Volver","gris",()=>{ mpReset(); pintar("inicio"); }).style.marginTop="6px";
      }
      else if(pantalla==="esperando"){
        const cod=MP.codigo;
        c.appendChild(el("p","mini","Pásale este código a tu amigo"+(datos.conClave?" junto con la contraseña":"")+":"));
        c.appendChild(el("div","duelo-codigo",_mpEsc(cod)+(datos.conClave?' <span title="con contraseña">🔒</span>':"")));
        const f=el("div","duelo-dos"); c.appendChild(f);
        const bc=el("button","btn-aqua","📋 Copiar código"); bc.onclick=()=>{ mpCopiar(cod); bc.textContent="✓ Copiado"; };
        const bl=el("button","btn-aqua","🔗 Copiar link"); bl.onclick=()=>{ mpCopiar(_mpLink(cod)); bl.textContent="✓ Link copiado"; };
        f.appendChild(bc); f.appendChild(bl);
        c.appendChild(el("div","resul mitad duelo-espera","⏳ Esperando a tu rival…"));
        boton("Cerrar la sala","gris",salir).style.marginTop="8px";
      }
      else if(pantalla==="unirse"){
        c.appendChild(el("h3","sub","Entrar a una sala"));
        const ci=campo("Código de la sala (5 letras)",{maxlength:"7",autocapitalize:"characters",autocomplete:"off",spellcheck:"false",value:datos.cod||""});
        ci.classList.add("duelo-cod-input"); ci.oninput=()=>{ ci.value=mpNormalizarCodigo(ci.value); };
        const cl=campo("Contraseña (si la tiene)",{maxlength:"40",type:"password",autocomplete:"off"});
        const b=boton("Entrar","verde",async()=>{
          const cod=mpNormalizarCodigo(ci.value); if(!mpCodigoValido(cod)){ ci.focus(); if(typeof aviso==="function") aviso("El código tiene 5 letras o números."); return; }
          b.disabled=true; b.textContent="Buscando la sala…";
          try{ await mpEntrarSala(cod,cl.value); c.appendChild(el("p","mini","Entrando…")); }
          catch(e){ pintar("error",{msg:e&&e.message==="no_existe"?"No existe una sala con ese código (o ya se cerró).":"No se pudo entrar a la sala."}); } });
        boton("← Volver","gris",()=>{ mpReset(); pintar("inicio"); }).style.marginTop="6px";
      }
      else if(pantalla==="dHost"){
        c.appendChild(el("h3","sub","1 · Pásale este código a tu amigo"));
        const ta=el("textarea","entrada duelo-ta"); ta.value=datos.cod; ta.readOnly=true; c.appendChild(ta);
        const bc=el("button","btn-aqua chico","📋 Copiar"); bc.onclick=()=>{ mpCopiar(ta.value); bc.textContent="✓ Copiado"; }; c.appendChild(bc);
        c.appendChild(el("h3","sub","2 · Pega la respuesta que te devuelve"));
        const rt=el("textarea","entrada duelo-ta"); c.appendChild(rt);
        const b=boton("Conectar","verde",async()=>{ if(!rt.value.trim()) return; b.disabled=true; try{ await mpConfirmarSala(rt.value); c.appendChild(el("p","mini","Conectando…")); }catch(e){ pintar("error",{msg:"Respuesta inválida."}); } });
        boton("← Volver","gris",()=>{ mpReset(); pintar("inicio"); }).style.marginTop="6px";
      }
      else if(pantalla==="dGuest"){
        c.appendChild(el("h3","sub","1 · Pega el código que te pasaron"));
        const it=el("textarea","entrada duelo-ta"); c.appendChild(it);
        const b=boton("Generar mi respuesta","verde",async()=>{ if(!it.value.trim()) return; b.disabled=true;
          try{ const r=await mpUnirse(it.value); c.innerHTML=""; c.appendChild(el("h3","sub","2 · Devuélvele esta respuesta"));
            const ta=el("textarea","entrada duelo-ta"); ta.value=r; ta.readOnly=true; c.appendChild(ta);
            const bc=el("button","btn-aqua chico","📋 Copiar"); bc.onclick=()=>{ mpCopiar(r); bc.textContent="✓ Copiado"; }; c.appendChild(bc);
            c.appendChild(el("p","mini","Esperando que tu amigo aprete «Conectar»…")); }
          catch(e){ pintar("error",{msg:"Código inválido."}); } });
        boton("← Volver","gris",()=>{ mpReset(); pintar("inicio"); }).style.marginTop="6px";
      }
      else if(pantalla==="lobby"){
        const esc=id=>id&&typeof escudoHTML==="function"?escudoHTML(id,34,""):"";
        const vs=el("div","duelo-vs");
        vs.innerHTML="<div class='duelo-lado"+(MP.miListo?" listo":"")+"'>"+esc(MP.miClub)+"<div class='mini'>"+_mpEsc(MP.yo)+" (tú)</div><b>"+(MP.miClub?_mpEsc(mpNombreClub(MP.miClub)):"— elige —")+"</b>"+(MP.miListo?" ✅":"")+"</div>"+
          "<div class='duelo-x'>VS</div>"+
          "<div class='duelo-lado"+(MP.rivalListo?" listo":"")+"'>"+esc(MP.rivalClub)+"<div class='mini'>"+_mpEsc(MP.rival||"Rival")+"</div><b>"+(MP.rivalClub?_mpEsc(mpNombreClub(MP.rivalClub)):"eligiendo…")+"</b>"+(MP.rivalListo?" ✅":"")+"</div>";
        c.appendChild(vs);
        const bus=el("input","entrada pick-buscar"); bus.type="search"; bus.placeholder="Buscar club…"; bus.value=datos.q||""; c.appendChild(bus);
        const grid=el("div","duelo-clubes"); c.appendChild(grid);
        const pintaGrid=()=>{ grid.innerHTML=""; const q=bus.value.trim().toLowerCase();
          mpClubes().filter(cl=>!q||cl.n.toLowerCase().indexOf(q)>=0).forEach(cl=>{
            const b=el("button","duelo-club"+(MP.miClub===cl.id?" sel":""),"<span class='g'>"+(esc(cl.id)||_mpEsc(cl.esc||""))+"</span><span class='n'>"+_mpEsc(cl.n)+"</span>");
            b.type="button"; b.disabled=MP.miListo;
            b.onclick=()=>{ if(MP.miListo) return; MP.miClub=cl.id; mpEnviar({tipo:"club",club:cl.id}); pintar("lobby",{q:bus.value}); };
            grid.appendChild(b); }); };
        bus.oninput=pintaGrid; pintaGrid();
        const bl=boton(MP.miListo?"⏳ Esperando al rival… (tocar para cambiar)":"✅ Listo","verde",()=>{
          MP.miListo=!MP.miListo; mpEnviar({tipo:"listo",listo:MP.miListo}); if(MP.miListo&&MP.rivalListo) mpQuizasArrancar(); pintar("lobby",{q:bus.value}); });
        bl.disabled=!MP.miClub;
        boton("Salir de la sala","gris",salir).style.marginTop="6px";
      }
      else if(pantalla==="duelo"){
        const d=MP.duel||{n:0,total:DUELO_RONDAS,fase:"espera",relato:[]};
        const mc=duelMarcador(), min=duelMinuto(d.n,d.total);
        const esc=id=>typeof escudoHTML==="function"?'<span class="eq-esc">'+escudoHTML(id,30,"")+'</span>':"";
        const marc=el("div","marcador marcador-vivo");
        marc.innerHTML='<div class="eq">'+esc(MP.miClub)+_mpEsc(mpNombreClub(MP.miClub))+'</div><div class="go-wrap"><div class="go">'+mc[0]+" - "+mc[1]+'</div><div class="go-min">Minuto '+min+" · jugada "+d.n+"/"+d.total+'</div></div><div class="eq">'+esc(MP.rivalClub)+_mpEsc(mpNombreClub(MP.rivalClub))+'</div>';
        c.appendChild(marc);
        /* la misma cancha de los partidos (se reutiliza entre repintados: nunca queda en blanco) */
        let cv=box._duelCv;
        if(!cv){ cv=el("canvas","cancha2d"); box._duelCv=cv; }
        const hud=el("div","partido-cancha"); hud.appendChild(cv); c.appendChild(hud);
        if(!_duelCancha&&typeof cvDueloMontar==="function") _duelCancha=cvDueloMontar(cv,{clubMio:MP.miClub,part:{rivalId:MP.rivalClub,local:MP.rol==="host"}});
        if(d.fase==="eligiendo"){
          c.appendChild(el("div","duelo-reloj","¿Cómo juegas esta jugada? <b>"+Math.max(0,Math.ceil(((d.hasta||Date.now())-Date.now())/1000))+" s</b>"));
          const ops=el("div","ops ops-part mv-compacto duelo-ops");
          DUELO_OPS.forEach((o,i)=>{ const b=el("button","op",'<div class="t">'+o.t+'</div><div class="d">'+o.d+'</div>'); b.type="button"; b.onclick=()=>duelMiPick(i); ops.appendChild(b); });
          c.appendChild(ops);
        } else if(d.fase==="esperando") c.appendChild(el("div","resul mitad","⏳ Elegiste. Esperando a "+_mpEsc(MP.rival||"tu rival")+"…"));
        else if(d.fase==="resultado"&&d.ultimo) c.appendChild(el("p","mini","Siguiente jugada en un momento…"));
        const rel=el("div","relato duelo-relato");
        (d.relato||[]).slice().reverse().forEach(x=>rel.appendChild(el("div","linea "+(x.tono||""),"<b class='mini'>"+x.min+"'</b> "+_mpEsc(x.txt))));
        if(!(d.relato||[]).length) rel.appendChild(el("div","linea mini","Arranca el duelo. Elige cómo juega tu equipo en cada jugada."));
        c.appendChild(rel);
      }
      else if(pantalla==="fin"){
        const mc=duelMarcador(), gane=mc[0]>mc[1], emp=mc[0]===mc[1];
        c.appendChild(el("h2","tit",gane?"🏆 ¡Ganaste el duelo!":(emp?"🤝 Empate":"😔 Perdiste el duelo")));
        const marc=el("div","marcador"); marc.innerHTML='<div class="eq">'+_mpEsc(mpNombreClub(MP.miClub))+'</div><div class="go">'+mc[0]+" - "+mc[1]+'</div><div class="eq">'+_mpEsc(mpNombreClub(MP.rivalClub))+'</div>'; c.appendChild(marc);
        if((MP.serie.g+MP.serie.e+MP.serie.p)>1) c.appendChild(el("div","resul mitad","📊 <b>Serie vs "+_mpEsc(MP.rival||"tu amigo")+":</b> "+serieTxt()));
        if(MP.rol==="host") boton("🔁 Revancha","verde",()=>{ MP.miListo=false; MP.rivalListo=false; MP.duel=null; mpEnviar({tipo:"revancha"}); pintar("lobby"); });
        else c.appendChild(el("p","mini","El que creó la sala propone la revancha."));
        boton("Salir de la sala","gris",salir).style.marginTop="6px";
      }
      else if(pantalla==="error"){
        c.appendChild(el("div","resul mal","⚠ "+_mpEsc(datos.msg||"Algo salió mal con la conexión.")));
        boton("← Volver","gris",()=>{ mpReset(); pintar("inicio"); }).style.marginTop="8px";
      }
    };
    mpAlConectar=function(){ if(MP.conectado) pintar("lobby"); };
    mpAlCaer=function(msg){ pintar("error",{msg:msg||"Se cortó la conexión con tu rival."}); };
    mpAlFallo=function(msg){ pintar("error",{msg:msg||"No se pudo conectar. Suele pasar en redes muy cerradas: prueba que el otro cree la sala."}); };
    duelRepintar=function(){ if(MP.duel){ pintar(MP.duel.fase==="fin"?"fin":"duelo"); } };
    MP.onMensaje=function(m){
      if(m.tipo==="club"){ MP.rivalClub=m.club; if(!MP.duel) pintar("lobby"); }
      else if(m.tipo==="listo"){ MP.rivalListo=m.listo; if(MP.miListo&&MP.rivalListo) mpQuizasArrancar(); if(!MP.duel) pintar("lobby"); }
      else if(m.tipo==="arrancar"&&MP.rol==="guest"){ MP.rivalClub=m.rivalClub; MP.duel={n:0,total:DUELO_RONDAS,gHost:0,gGuest:0,fase:"espera",relato:[]}; pintar("duelo"); }
      else if(m.tipo==="duelo_pick"&&MP.rol==="host"){ if(MP.duel&&m.n===MP.duel.n&&MP.duel.pickGuest==null){ MP.duel.pickGuest=m.idx; duelChequearResolver(); } }
      else if(m.tipo==="duelo_ronda"&&MP.rol==="guest"){ if(MP.duel){ MP.duel.n=m.n; MP.duel.total=m.total; MP.duel.fase="eligiendo"; MP.duel.ultimo=null; _duelReloj(); duelRepintar(); } }
      else if(m.tipo==="duelo_res"&&MP.rol==="guest"){ if(MP.duel) _duelAplicarRes(m); }
      else if(m.tipo==="duelo_fin"&&MP.rol==="guest"){ if(MP.duel){ MP.duel.gHost=m.gHost; MP.duel.gGuest=m.gGuest; MP.duel.fase="fin"; if(MP.duel.reloj) clearInterval(MP.duel.reloj); duelRegistrarSerie(); duelRepintar(); } }
      else if(m.tipo==="revancha"&&MP.rol==="guest"){ MP.miListo=false; MP.rivalListo=false; MP.duel=null; pintar("lobby"); }
    };
    mpQuizasArrancar=function(){
      if(MP.miListo&&MP.rivalListo&&MP.rol==="host"&&!MP.duel){ mpEnviar({tipo:"arrancar",rivalClub:MP.miClub}); duelIniciar(); pintar("duelo"); }
    };
    if(MP.conectado) pintar(MP.duel?(MP.duel.fase==="fin"?"fin":"duelo"):"lobby");
    else if(opts.codigo) pintar("unirse",{cod:opts.codigo});
    else pintar("inicio");
  },{cerrarFuera:false});
}

/* ============================================================
   DÓNDE VIVE EL DUELO: siempre en Ajustes, y un acceso rápido donde tú digas
   ============================================================ */
const DUELO_LUGARES=[["inicio","Inicio (al elegir club)"],["escritorio","Escritorio"],["carrera","Carrera"],["redes","Redes"],["ajustes","Solo en Ajustes"]];
function dueloLugar(){ try{ const v=localStorage.getItem("futbolini_duelo_en"); if(DUELO_LUGARES.some(x=>x[0]===v)) return v; }catch(e){} return "inicio"; }
function panelDuelos(enAjustes){
  const p=panel("Duelos con amigos","🎮","agua");
  p.cuerpo.appendChild(el("p","mini","Una sala con código de 5 letras y contraseña, como Gartic o Haxball. Cada uno maneja su club; el partido se decide jugada a jugada. Va aparte de tu partida: no la toca."));
  const b=el("button","btn-aqua ancho verde","🎮 Abrir duelos"); b.onclick=()=>modalDuelo(); p.cuerpo.appendChild(b);
  if(enAjustes){
    p.cuerpo.appendChild(el("label","lb","Acceso rápido a los duelos en"));
    const f=el("div","fichas"), act=dueloLugar();
    DUELO_LUGARES.forEach(([k,n])=>{ const x=el("button","ficha",n); x.setAttribute("aria-pressed",act===k?"true":"false");
      x.onclick=()=>{ try{ localStorage.setItem("futbolini_duelo_en",k); }catch(e){} if(typeof render==="function") render(); if(typeof aviso==="function") aviso("Duelos: acceso rápido en "+n); }; f.appendChild(x); });
    p.cuerpo.appendChild(f);
  }
  return p;
}
function _duelHost(){ const v=document.getElementById("vista"); return (v&&v.querySelector(":scope > .ventana-so.in-vista :is(.so-cuerpo,.window-body)"))||v; }
(function(){
  if(typeof window==="undefined") return;
  /* ya envuelta en cualquier capa de la cadena → no se envuelve de nuevo (quedaría por FUERA del organizador de pestañas) */
  const yaEsta=function(f){ for(let g=f,k=0;g&&k<40;g=g._orig,k++) if(g._duelo) return true; return false; };
  const envolver=function(nom,cuando){ const o=window[nom]; if(typeof o!=="function"||yaEsta(o)) return;
    /* Ajustes se pinta en su propia ventana (vistaAjustes(host)): el panel va ahí, no en #vista */
    const w=function(host){ const r=o.apply(this,arguments); try{ if(cuando()){ const h=(nom==="vistaAjustes"&&host&&host.appendChild)?host:_duelHost(); if(h) h.appendChild(panelDuelos(nom==="vistaAjustes")); } }catch(e){ console.error("duelos:",e); } return r; };
    Object.keys(o).forEach(k=>w[k]=o[k]); w._duelo=true; w._orig=o; window[nom]=w; };
  /* vistaAjustes: AHORA (antes que js/ajustes-real.js, que reparte los paneles en pestañas) */
  envolver("vistaAjustes",()=>true);
  const instalar=function(){
    envolver("vistaEscritorio",()=>dueloLugar()==="escritorio");
    envolver("vistaCarrera",()=>dueloLugar()==="carrera");
    envolver("vistaRedes",()=>dueloLugar()==="redes");
  };
  instalar();
  window.addEventListener("DOMContentLoaded",instalar);
  /* link ?sala=K7QZP: abre la ventana de duelos con el código puesto */
  window.addEventListener("load",function(){ try{
    const q=new URLSearchParams(location.search).get("sala"); const cod=mpNormalizarCodigo(q);
    if(mpCodigoValido(cod)) setTimeout(function(){ modalDuelo({codigo:cod}); },900);
  }catch(e){} });
})();
