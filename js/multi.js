"use strict";
/* ============================================================
   FUTBOLINI · multi.js   (7.00 · Multijugador P2P · B1 conexión)
   Duelo contra un amigo SIN servidor ni cuentas: WebRTC DataChannel
   con señalización MANUAL (copia-pega de un código). Un STUN público
   solo sirve para descubrir la IP (no transmite datos del juego).
   Privacidad total: la conexión es directa entre los dos navegadores.
   Anfitrión = crea la sala; Visitante = se une con el código.
   ============================================================ */
const MP = {
  pc:null, dc:null, rol:null, conectado:false,
  yo:null, rival:null,           /* nombres de DT */
  miClub:null, rivalClub:null,   /* B2 · elección de club */
  miListo:false, rivalListo:false,
  serie:{g:0,e:0,p:0},           /* B4 · serie de duelos en esta conexión */
  duel:null, watchdog:null,      /* B5 · timeout de conexión */
  onMensaje:null,                /* callback para B2/B3 */
  ICE:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}]
};
/* los 16 clubes elegibles para el duelo (era 2026) */
function mpClubes(){
  const src=(typeof CLUB_INFO_2026!=="undefined")?CLUB_INFO_2026:(typeof CLUB_INFO!=="undefined"?CLUB_INFO:{});
  return Object.keys(src).map(function(id){ return {id:id, n:src[id].n, esc:src[id].esc}; });
}
function mpNombreClub(id){ const c=mpClubes().find(function(x){return x.id===id;}); return c?c.n:(id||"—"); }
function mpSoportado(){ return typeof RTCPeerConnection!=="undefined"; }
function mpReset(){
  if(MP.watchdog){ clearTimeout(MP.watchdog); MP.watchdog=null; }
  try{ if(MP.dc) MP.dc.close(); }catch(e){}
  try{ if(MP.pc) MP.pc.close(); }catch(e){}
  MP.pc=null; MP.dc=null; MP.rol=null; MP.conectado=false; MP.rival=null;
  MP.miClub=null; MP.rivalClub=null; MP.miListo=false; MP.rivalListo=false;
  MP.serie={g:0,e:0,p:0}; MP.duel=null;
}
/* B4 · registra el resultado del duelo en la serie de la conexión + un log persistente */
function duelRegistrarSerie(){
  const d=MP.duel; if(!d || d.registrado) return; d.registrado=true;
  const mc=duelMarcador();
  if(mc[0]>mc[1]) MP.serie.g++; else if(mc[0]===mc[1]) MP.serie.e++; else MP.serie.p++;
  try{
    const key="futbolini_duelos";
    const log=JSON.parse(localStorage.getItem(key)||"[]");
    log.push({rival:MP.rival||"amigo", yoClub:MP.miClub, rivalClub:MP.rivalClub, yo:mc[0], rival2:mc[1]});
    if(log.length>50) log.splice(0,log.length-50);
    localStorage.setItem(key, JSON.stringify(log));
  }catch(e){}
}
function serieTxt(){ const s=MP.serie; return s.g+" ganados · "+s.e+" empates · "+s.p+" perdidos"; }
/* espera a que junte los candidatos ICE (así el código lleva todo, sin trickle) */
function mpEsperarICE(pc){
  return new Promise(function(res){
    if(pc.iceGatheringState==="complete") return res();
    function chk(){ if(pc.iceGatheringState==="complete"){ pc.removeEventListener("icegatheringstatechange",chk); res(); } }
    pc.addEventListener("icegatheringstatechange",chk);
    setTimeout(res,3500);   /* fallback: no colgarse esperando candidatos lentos */
  });
}
function mpCodificar(desc){ return btoa(JSON.stringify({t:desc.type,s:desc.sdp})); }
function mpDecodificar(codigo){
  const o=JSON.parse(atob(codigo.trim()));
  return {type:o.t, sdp:o.s};
}
/* engancha los handlers del data channel */
function mpEngancharCanal(dc){
  MP.dc=dc;
  dc.onopen=function(){ MP.conectado=true;
    if(MP.watchdog){ clearTimeout(MP.watchdog); MP.watchdog=null; }
    mpEnviar({tipo:"hola", nombre:MP.yo||"DT"});   /* handshake */
    if(typeof mpAlConectar==="function") mpAlConectar();
  };
  dc.onclose=function(){ MP.conectado=false; if(typeof mpAlCaer==="function") mpAlCaer(); };
  dc.onmessage=function(ev){
    let m=null; try{ m=JSON.parse(ev.data); }catch(e){ return; }
    if(m&&m.tipo==="hola"){ MP.rival=m.nombre||"Rival"; if(typeof mpAlConectar==="function") mpAlConectar(); }
    if(typeof MP.onMensaje==="function") MP.onMensaje(m);
  };
}
function mpEnviar(obj){
  if(MP.dc && MP.dc.readyState==="open"){ try{ MP.dc.send(JSON.stringify(obj)); return true; }catch(e){} }
  return false;
}
/* ---- ANFITRIÓN: crea la sala y devuelve el código de invitación ---- */
async function mpCrearSala(){
  mpReset(); MP.rol="host";
  MP.pc=new RTCPeerConnection({iceServers:MP.ICE});
  const dc=MP.pc.createDataChannel("futbolini",{ordered:true});
  mpEngancharCanal(dc);
  const offer=await MP.pc.createOffer();
  await MP.pc.setLocalDescription(offer);
  await mpEsperarICE(MP.pc);
  return mpCodificar(MP.pc.localDescription);
}
/* el anfitrión pega el código de respuesta del visitante */
async function mpConfirmarSala(codigoRespuesta){
  const ans=mpDecodificar(codigoRespuesta);
  await MP.pc.setRemoteDescription(ans);
  /* watchdog: si en 20s no conectó, avisar (suele ser red muy cerrada) */
  if(MP.watchdog) clearTimeout(MP.watchdog);
  MP.watchdog=setTimeout(function(){ if(!MP.conectado && typeof mpAlFallo==="function") mpAlFallo(); }, 20000);
  return true;
}
/* ---- VISITANTE: se une con el código y devuelve el código de respuesta ---- */
async function mpUnirse(codigoInvitacion){
  mpReset(); MP.rol="guest";
  MP.pc=new RTCPeerConnection({iceServers:MP.ICE});
  MP.pc.ondatachannel=function(ev){ mpEngancharCanal(ev.channel); };
  const offer=mpDecodificar(codigoInvitacion);
  await MP.pc.setRemoteDescription(offer);
  const ans=await MP.pc.createAnswer();
  await MP.pc.setLocalDescription(ans);
  await mpEsperarICE(MP.pc);
  return mpCodificar(MP.pc.localDescription);
}

/* ============================================================
   UI · "Duelo con un amigo" (B1: conectar y saludarse)
   ============================================================ */
function nombreDTLocal(){ return (E&&E.perfil&&E.perfil.nombre)||(E&&E.dt)||"DT"; }
function modalDuelo(){
  if(!mpSoportado()){ if(typeof aviso==="function") aviso("Tu navegador no soporta el duelo P2P"); return; }
  MP.yo=nombreDTLocal();
  modal(function(box){
    const pintar=function(pantalla, datos){
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🎮</span><span>Duelo con un amigo</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      /* ---------- elegir rol ---------- */
      if(pantalla==="inicio"){
        c.appendChild(el("p","mini","Juega un duelo dirigido contra un amigo, sin cuentas ni servidor: se conectan copiando y pegando un código (por WhatsApp, Discord, lo que sea). La conexión es directa entre ustedes dos."));
        const bh=el("button","btn-aqua ancho verde","🧑‍✈️ Crear una sala (invitas vos)");
        bh.onclick=async function(){ bh.disabled=true; bh.textContent="Generando código…";
          try{ const cod=await mpCrearSala(); pintar("host",{cod:cod}); }
          catch(e){ pintar("error",{msg:e.message}); } };
        c.appendChild(bh);
        const bg=el("button","btn-aqua ancho","🔗 Unirme a una sala (tengo un código)"); bg.style.marginTop="6px";
        bg.onclick=function(){ pintar("guest",{}); };
        c.appendChild(bg);
        const x=el("button","btn-aqua ancho gris","Cerrar"); x.style.marginTop="8px";
        x.onclick=function(){ mpReset(); cerrarModal(); };
        c.appendChild(x);
      }
      /* ---------- anfitrión: mostrar código + pegar respuesta ---------- */
      else if(pantalla==="host"){
        c.appendChild(el("h3","sub","1 · Pasale este código a tu amigo"));
        const ta=el("textarea","entrada"); ta.value=datos.cod; ta.readOnly=true; ta.rows=3; ta.style.width="100%"; ta.style.fontSize="10px";
        c.appendChild(ta);
        const bc=el("button","btn-aqua chico","📋 Copiar código"); bc.style.marginTop="4px";
        bc.onclick=function(){ mpCopiar(ta.value); bc.textContent="✓ Copiado"; };
        c.appendChild(bc);
        c.appendChild(el("h3","sub","2 · Pegá acá la RESPUESTA que te devuelve"));
        const rt=el("textarea","entrada"); rt.rows=3; rt.style.width="100%"; rt.style.fontSize="10px"; rt.placeholder="Pegá acá el código de respuesta de tu amigo…";
        c.appendChild(rt);
        const bcon=el("button","btn-aqua ancho verde","Conectar"); bcon.style.marginTop="6px";
        bcon.onclick=async function(){ if(!rt.value.trim()) return; bcon.disabled=true; bcon.textContent="Conectando…";
          try{ await mpConfirmarSala(rt.value); pintar("esperando",{}); }
          catch(e){ pintar("error",{msg:"Código de respuesta inválido"}); } };
        c.appendChild(bcon);
        c.appendChild(botonVolver(pintar));
      }
      /* ---------- visitante: pegar invitación, generar respuesta ---------- */
      else if(pantalla==="guest"){
        c.appendChild(el("h3","sub","1 · Pegá el código que te pasaron"));
        const it=el("textarea","entrada"); it.rows=3; it.style.width="100%"; it.style.fontSize="10px"; it.placeholder="Pegá acá el código de invitación…";
        c.appendChild(it);
        const bg=el("button","btn-aqua ancho verde","Generar mi respuesta"); bg.style.marginTop="6px";
        bg.onclick=async function(){ if(!it.value.trim()) return; bg.disabled=true; bg.textContent="Generando…";
          try{ const resp=await mpUnirse(it.value); pintar("guestResp",{resp:resp}); }
          catch(e){ pintar("error",{msg:"Código de invitación inválido"}); } };
        c.appendChild(bg);
        c.appendChild(botonVolver(pintar));
      }
      else if(pantalla==="guestResp"){
        c.appendChild(el("div","resul bien","Casi listo. Pasale ESTA respuesta a tu amigo y esperá a que apriete «Conectar»."));
        c.appendChild(el("h3","sub","2 · Devolvele este código"));
        const ta=el("textarea","entrada"); ta.value=datos.resp; ta.readOnly=true; ta.rows=3; ta.style.width="100%"; ta.style.fontSize="10px";
        c.appendChild(ta);
        const bc=el("button","btn-aqua chico","📋 Copiar respuesta");
        bc.onclick=function(){ mpCopiar(ta.value); bc.textContent="✓ Copiado"; };
        c.appendChild(bc);
        c.appendChild(el("p","mini","Esperando que tu amigo confirme la conexión…"));
      }
      else if(pantalla==="esperando"){
        c.appendChild(el("p",null,"⏳ Estableciendo la conexión… (si tu amigo ya pegó su respuesta, debería conectar en segundos)"));
      }
      /* ---------- LOBBY (B2): elegir club y ponerse listos ---------- */
      else if(pantalla==="lobby"){
        c.appendChild(el("div","resul bien","🔗 Conectado con <b>"+(MP.rival||"tu amigo")+"</b>. Elijan su club y aprieten «Listo»."));
        /* estado de ambos */
        const est=el("div","duelo-vs");
        est.innerHTML="<div class='duelo-lado"+(MP.miListo?" listo":"")+"'><div class='mini'>VOS</div><b>"+(MP.miClub?mpNombreClub(MP.miClub):"— elige —")+"</b>"+(MP.miListo?" ✅":"")+"</div>"+
          "<div class='duelo-x'>VS</div>"+
          "<div class='duelo-lado"+(MP.rivalListo?" listo":"")+"'><div class='mini'>"+(MP.rival||"RIVAL")+"</div><b>"+(MP.rivalClub?mpNombreClub(MP.rivalClub):"eligiendo…")+"</b>"+(MP.rivalListo?" ✅":"")+"</div>";
        c.appendChild(est);
        /* grilla de clubes */
        c.appendChild(el("h3","sub","Elige tu club"));
        const grid=el("div","duelo-clubes");
        mpClubes().forEach(function(cl){
          const b=el("button","duelo-club"+(MP.miClub===cl.id?" sel":""));
          b.innerHTML="<span class='g'>"+cl.esc+"</span><span class='n'>"+cl.n+"</span>";
          b.onclick=function(){
            if(MP.miListo) return;   /* no cambiar si ya diste listo */
            MP.miClub=cl.id; mpEnviar({tipo:"club", club:cl.id});
            pintar("lobby",{});
          };
          grid.appendChild(b);
        });
        c.appendChild(grid);
        /* botón listo */
        const bl=el("button","btn-aqua ancho verde",MP.miListo?"⏳ Esperando al rival…":"✅ Listo");
        bl.disabled=!MP.miClub;
        bl.onclick=function(){
          MP.miListo=!MP.miListo; mpEnviar({tipo:"listo", listo:MP.miListo});
          if(MP.miListo && MP.rivalListo){ mpQuizasArrancar(); }
          pintar("lobby",{});
        };
        c.appendChild(bl);
        const x=el("button","btn-aqua ancho gris","Salir del duelo"); x.style.marginTop="6px";
        x.onclick=function(){ mpReset(); cerrarModal(); }; c.appendChild(x);
      }
      /* ---------- EL DUELO (B3) ---------- */
      else if(pantalla==="duelo"){
        const d=MP.duel||{n:0,total:DUELO_RONDAS,fase:"espera"};
        const mc=duelMarcador();
        /* marcador tipo scoreboard */
        const marc=el("div","marcador");
        marc.innerHTML='<div class="eq">'+mpNombreClub(MP.miClub)+'</div><div class="go">'+mc[0]+" - "+mc[1]+'</div><div class="eq">'+mpNombreClub(MP.rivalClub)+'</div>';
        c.appendChild(marc);
        const minuto=Math.min(90,Math.round((d.n/d.total)*90));
        c.appendChild(el("div","reloj","Jugada "+d.n+" de "+d.total+" · min "+minuto));
        /* resultado de la ronda anterior */
        if(d.fase==="resultado" && d.ultimo){
          const yoGol = MP.rol==="host"?d.ultimo.golH:d.ultimo.golG;
          const rivGol= MP.rol==="host"?d.ultimo.golG:d.ultimo.golH;
          let txt = yoGol&&rivGol?"⚽ ¡Los dos marcaron! Ida y vuelta puro.":
                    yoGol?"⚽ ¡GOL TUYO! La metiste.":
                    rivGol?"😱 Te marcaron. A recuperarse.":"🧱 Ronda trabada, no se rompió el cero de la jugada.";
          c.appendChild(el("div","resul "+(yoGol&&!rivGol?"bien":(rivGol&&!yoGol?"mal":"mitad")),txt));
          c.appendChild(el("p","mini","Preparando la próxima jugada…"));
        }
        /* elegir postura */
        else if(d.fase==="eligiendo"){
          c.appendChild(el("h3","sub","¿Cómo la juegas?"));
          const ops=el("div","ops");
          DUELO_OPS.forEach(function(o,i){
            const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div><div class="d">'+o.d+'</div>';
            b.onclick=function(){ duelMiPick(i); };
            ops.appendChild(b);
          });
          c.appendChild(ops);
        }
        else if(d.fase==="esperando"){
          c.appendChild(el("div","resul mitad","⏳ Elegiste. Esperando la decisión de tu rival…"));
        }
        else { c.appendChild(el("p","mini","Preparando el duelo…")); }
      }
      /* ---------- final del duelo (B4 preview) ---------- */
      else if(pantalla==="fin"){
        const d=MP.duel, mc=duelMarcador();
        const gane=mc[0]>mc[1], emp=mc[0]===mc[1];
        c.appendChild(el("h2","tit",(gane?"🏆 ¡Ganaste el duelo!":(emp?"🤝 Empate":"😔 Perdiste el duelo"))));
        const marc=el("div","marcador"); marc.style.margin="8px 0";
        marc.innerHTML='<div class="eq">'+mpNombreClub(MP.miClub)+'</div><div class="go">'+mc[0]+" - "+mc[1]+'</div><div class="eq">'+mpNombreClub(MP.rivalClub)+'</div>';
        c.appendChild(marc);
        c.appendChild(el("p","mini",gane?"Le ganaste a "+(MP.rival||"tu amigo")+". Que se aguante.":(emp?"Iguales. Va a haber que desempatar en la revancha.":"Esta vez fue de "+(MP.rival||"tu amigo")+". Revancha ya.")));
        /* B4 · serie de la conexión */
        if((MP.serie.g+MP.serie.e+MP.serie.p)>1){
          c.appendChild(el("div","resul mitad","📊 <b>Serie vs "+(MP.rival||"tu amigo")+":</b> "+serieTxt()));
        }
        if(MP.rol==="host"){
          const br=el("button","btn-aqua ancho verde","🔁 Revancha");
          br.onclick=function(){ MP.miListo=false; MP.rivalListo=false; MP.miClub=null; MP.rivalClub=null; MP.duel=null; mpEnviar({tipo:"revancha"}); pintar("lobby",{}); };
          c.appendChild(br);
        } else {
          c.appendChild(el("p","mini","Esperá a que el anfitrión proponga la revancha, o cierra."));
        }
        const x=el("button","btn-aqua ancho gris","Cerrar"); x.style.marginTop="6px";
        x.onclick=function(){ mpReset(); cerrarModal(); }; c.appendChild(x);
      }
      else if(pantalla==="error"){
        c.appendChild(el("div","resul mal","⚠ "+(datos.msg||"Algo salió mal con la conexión.")));
        c.appendChild(botonVolver(pintar));
      }
    };
    /* cuando el canal abre, saltamos al LOBBY */
    mpAlConectar=function(){ if(MP.conectado) pintar("lobby",{}); };
    mpAlCaer=function(){ pintar("error",{msg:"Se cortó la conexión con tu amigo."}); };
    mpAlFallo=function(){ pintar("error",{msg:"No se pudo conectar. Suele pasar en redes muy cerradas (algún wifi corporativo o de datos móviles). Prueba de nuevo, o que el otro cree la sala."}); };
    /* la UI del duelo se repinta desde acá */
    duelRepintar=function(){ if(MP.duel){ if(MP.duel.fase==="fin") pintar("fin",{}); else pintar("duelo",{}); } };
    /* mensajes (lobby B2 + duelo B3) */
    MP.onMensaje=function(m){
      if(!m) return;
      /* --- lobby --- */
      if(m.tipo==="club"){ MP.rivalClub=m.club; pintar("lobby",{}); }
      else if(m.tipo==="listo"){ MP.rivalListo=!!m.listo;
        if(MP.miListo && MP.rivalListo){ mpQuizasArrancar(); }
        pintar("lobby",{}); }
      else if(m.tipo==="arrancar"){ MP.rivalClub=m.rivalClub||MP.rivalClub;
        MP.duel={n:0,total:DUELO_RONDAS,gHost:0,gGuest:0,fase:"espera",ultimo:null}; pintar("duelo",{}); }
      /* --- duelo (host recibe picks del guest) --- */
      else if(m.tipo==="duelo_pick"){ if(MP.duel){ MP.duel.pickGuest=m.idx; duelChequearResolver(); } }
      /* --- duelo (guest recibe del host) --- */
      else if(m.tipo==="duelo_ronda"){ if(MP.duel){ MP.duel.n=m.n; MP.duel.total=m.total; MP.duel.fase="eligiendo"; MP.duel.ultimo=null; duelRepintar(); } }
      else if(m.tipo==="duelo_res"){ if(MP.duel){ MP.duel.gHost=m.gHost; MP.duel.gGuest=m.gGuest; MP.duel.ultimo=m; MP.duel.fase="resultado"; duelRepintar(); } }
      else if(m.tipo==="duelo_fin"){ if(MP.duel){ MP.duel.gHost=m.gHost; MP.duel.gGuest=m.gGuest; MP.duel.fase="fin"; duelRegistrarSerie(); duelRepintar(); } }
      else if(m.tipo==="revancha"){ MP.miListo=false; MP.rivalListo=false; MP.miClub=null; MP.rivalClub=null; MP.duel=null; pintar("lobby",{}); }
    };
    /* si ambos están listos, el ANFITRIÓN arranca el duelo */
    mpQuizasArrancar=function(){
      if(MP.miListo && MP.rivalListo && MP.rol==="host"){
        mpEnviar({tipo:"arrancar", rivalClub:MP.miClub});   /* al guest, "rivalClub" = el club del host */
        duelIniciar(); pintar("duelo",{});
      }
    };
    function botonVolver(pintar){ const b=el("button","btn-aqua ancho gris","← Volver"); b.style.marginTop="8px";
      b.onclick=function(){ mpReset(); pintar("inicio",{}); }; return b; }
    pintar(MP.conectado?"lobby":"inicio",{});   /* si ya estás conectado, directo al lobby */
  },{cerrarFuera:false});
}
/* ============================================================
   B3 · EL DUELO (por rondas head-to-head, anfitrión autoritativo)
   Cada ronda los dos eligen postura; el host calcula con la fuerza
   real de cada club + azar y actualiza el marcador. Sincroniza por
   turnos (robusto ante lag). El host manda las rondas y los resultados.
   ============================================================ */
const DUELO_OPS=[
  {t:"🗡️ Salir al ataque", d:"Más peligro arriba, pero quedas abierto.", aggr:1},
  {t:"⚖️ Jugar equilibrado", d:"Ni muy arriba ni muy atrás.", aggr:0},
  {t:"🛡️ Meterse atrás", d:"Defendés bien, pero te cuesta llegar.", aggr:-1}
];
const DUELO_RONDAS=9;   /* ~9 jugadas clave = un partido comprimido */
function fuerzaClub(id){
  if(typeof IND_BASE_2026!=="undefined" && IND_BASE_2026[id]) return IND_BASE_2026[id].plantel||60;
  return 60;
}
function duelChance(fX,fY,aX,aY){
  let p=0.20 + (fX-fY)*0.007 + aX*0.06;
  if(aY<0) p-=0.10; else if(aY>0) p+=0.03;   /* rival atrás baja tu chance; rival abierto la sube */
  return clamp(p,0.05,0.55);
}
var duelRepintar=null;   /* la UI la define */
/* ---- HOST ---- */
function duelIniciar(){
  MP.duel={ n:0, total:DUELO_RONDAS, gHost:0, gGuest:0,
    fHost:fuerzaClub(MP.miClub), fGuest:fuerzaClub(MP.rivalClub),
    pickHost:null, pickGuest:null, fase:"eligiendo", ultimo:null };
  duelRondaNueva();
}
function duelRondaNueva(){
  const d=MP.duel; d.n++; d.pickHost=null; d.pickGuest=null; d.fase="eligiendo"; d.ultimo=null;
  mpEnviar({tipo:"duelo_ronda", n:d.n, total:d.total});
  if(typeof duelRepintar==="function") duelRepintar();
}
function duelChequearResolver(){
  const d=MP.duel;
  if(d && d.pickHost!=null && d.pickGuest!=null) duelResolver();
}
function duelResolver(){
  const d=MP.duel;
  const aH=DUELO_OPS[d.pickHost].aggr, aG=DUELO_OPS[d.pickGuest].aggr;
  const golH=Math.random()<duelChance(d.fHost,d.fGuest,aH,aG);
  const golG=Math.random()<duelChance(d.fGuest,d.fHost,aG,aH);
  if(golH) d.gHost++; if(golG) d.gGuest++;
  const res={n:d.n, gHost:d.gHost, gGuest:d.gGuest, golH:golH, golG:golG};
  d.ultimo=res; d.fase="resultado";
  mpEnviar(Object.assign({tipo:"duelo_res"}, res));
  if(typeof duelRepintar==="function") duelRepintar();
  setTimeout(function(){
    if(!MP.duel) return;
    if(MP.duel.n>=MP.duel.total) duelFin(); else duelRondaNueva();
  }, 2100);
}
function duelFin(){
  const d=MP.duel; d.fase="fin";
  duelRegistrarSerie();
  mpEnviar({tipo:"duelo_fin", gHost:d.gHost, gGuest:d.gGuest});
  if(typeof duelRepintar==="function") duelRepintar();
}
/* ---- común: registrar mi pick ---- */
function duelMiPick(idx){
  const d=MP.duel; if(!d || d.fase!=="eligiendo") return;
  if(MP.rol==="host"){ d.pickHost=idx; } else { d.pickGuest=idx; mpEnviar({tipo:"duelo_pick", n:d.n, idx:idx}); }
  d.fase="esperando";
  if(typeof duelRepintar==="function") duelRepintar();
  if(MP.rol==="host") duelChequearResolver();
}
/* marcador desde MI perspectiva (yo vs rival) */
function duelMarcador(){
  const d=MP.duel; if(!d) return [0,0];
  return MP.rol==="host" ? [d.gHost,d.gGuest] : [d.gGuest,d.gHost];
}

/* callbacks que la UI redefine */
var mpAlConectar=null, mpAlCaer=null, mpQuizasArrancar=null, mpAlFallo=null;
function mpCopiar(txt){
  try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt); return; } }catch(e){}
  try{ const ta=document.createElement("textarea"); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }catch(e){}
}
