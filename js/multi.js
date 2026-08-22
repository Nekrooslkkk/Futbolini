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
  try{ if(MP.dc) MP.dc.close(); }catch(e){}
  try{ if(MP.pc) MP.pc.close(); }catch(e){}
  MP.pc=null; MP.dc=null; MP.rol=null; MP.conectado=false; MP.rival=null;
  MP.miClub=null; MP.rivalClub=null; MP.miListo=false; MP.rivalListo=false;
}
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
        c.appendChild(el("p","mini","Jugá un duelo dirigido contra un amigo, sin cuentas ni servidor: se conectan copiando y pegando un código (por WhatsApp, Discord, lo que sea). La conexión es directa entre ustedes dos."));
        const bh=el("button","btn-aqua ancho verde","🧑‍✈️ Crear una sala (invitás vos)");
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
        est.innerHTML="<div class='duelo-lado"+(MP.miListo?" listo":"")+"'><div class='mini'>VOS</div><b>"+(MP.miClub?mpNombreClub(MP.miClub):"— elegí —")+"</b>"+(MP.miListo?" ✅":"")+"</div>"+
          "<div class='duelo-x'>VS</div>"+
          "<div class='duelo-lado"+(MP.rivalListo?" listo":"")+"'><div class='mini'>"+(MP.rival||"RIVAL")+"</div><b>"+(MP.rivalClub?mpNombreClub(MP.rivalClub):"eligiendo…")+"</b>"+(MP.rivalListo?" ✅":"")+"</div>";
        c.appendChild(est);
        /* grilla de clubes */
        c.appendChild(el("h3","sub","Elegí tu club"));
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
      /* ---------- duelo arrancando (transición a B3) ---------- */
      else if(pantalla==="arrancando"){
        c.appendChild(el("div","resul bien","⚽ <b>¡Arranca el duelo!</b> "+mpNombreClub(MP.miClub)+" vs "+mpNombreClub(MP.rivalClub)));
        c.appendChild(el("p","mini","(B3 · el partido dirigido entre los dos — en construcción. La conexión y el lobby ya funcionan.)"));
        const x=el("button","btn-aqua ancho gris","Cerrar"); x.style.marginTop="6px";
        x.onclick=cerrarModal; c.appendChild(x);
      }
      else if(pantalla==="error"){
        c.appendChild(el("div","resul mal","⚠ "+(datos.msg||"Algo salió mal con la conexión.")));
        c.appendChild(botonVolver(pintar));
      }
    };
    /* cuando el canal abre, saltamos al LOBBY */
    mpAlConectar=function(){ if(MP.conectado) pintar("lobby",{}); };
    mpAlCaer=function(){ pintar("error",{msg:"Se cortó la conexión con tu amigo."}); };
    /* mensajes del lobby (B2) */
    MP.onMensaje=function(m){
      if(!m) return;
      if(m.tipo==="club"){ MP.rivalClub=m.club; pintar("lobby",{}); }
      else if(m.tipo==="listo"){ MP.rivalListo=!!m.listo;
        if(MP.miListo && MP.rivalListo){ mpQuizasArrancar(); }
        pintar("lobby",{}); }
      else if(m.tipo==="arrancar"){ MP.rivalClub=m.rivalClub||MP.rivalClub; pintar("arrancando",{}); }
    };
    /* si ambos están listos, el ANFITRIÓN da la orden de arrancar */
    mpQuizasArrancar=function(){
      if(MP.miListo && MP.rivalListo && MP.rol==="host"){
        mpEnviar({tipo:"arrancar", rivalClub:MP.miClub});   /* al guest, "rivalClub" = el club del host */
        pintar("arrancando",{});
      } else if(MP.miListo && MP.rivalListo){
        /* el guest espera la orden del host, pero mostramos que ya está */
        pintar("lobby",{});
      }
    };
    function botonVolver(pintar){ const b=el("button","btn-aqua ancho gris","← Volver"); b.style.marginTop="8px";
      b.onclick=function(){ mpReset(); pintar("inicio",{}); }; return b; }
    pintar(MP.conectado?"lobby":"inicio",{});   /* si ya estás conectado, directo al lobby */
  },{cerrarFuera:false});
}
/* callbacks que la UI redefine */
var mpAlConectar=null, mpAlCaer=null, mpQuizasArrancar=null;
function mpCopiar(txt){
  try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt); return; } }catch(e){}
  try{ const ta=document.createElement("textarea"); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }catch(e){}
}
