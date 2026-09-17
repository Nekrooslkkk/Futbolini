"use strict";
/* ============================================================
   FUTBOLINI · nube.js — login opcional + respaldo en la nube
   ── GRATIS Y OPCIONAL ──
   Habla por `fetch` PURO contra Supabase (free tier): sin SDK, sin CDN,
   sin build. Si NUBE_CONFIG está vacío o no hay internet, el juego sigue
   funcionando 100% offline con localStorage, como siempre.

   Para encenderlo: creá un proyecto gratis en Supabase y pegá acá tu URL y
   tu anon key (la anon key es PÚBLICA, es seguro exponerla; la seguridad la
   da Row Level Security en la tabla). Pasos exactos en SETUP_NUBE.md.
   ============================================================ */

const NUBE_CONFIG = {
  url: "https://jtovotunboairatszhew.supabase.co",        /* proyecto Supabase de Futbolini */
  anonKey: "sb_publishable_QjD9L7SWCdfgYasuzIqQ2Q_ypj2g2-R"  /* llave PUBLICA (publishable) — segura en el repo; la seguridad la da RLS */
};

const NUBE_LLAVE_SESION = "futbolini_nube_sesion";
const NUBE_CFG_LLAVE    = "futbolini_nube_cfg";   /* config pegada en el juego (URL + anon) */

/* config efectiva: la baked en NUBE_CONFIG manda; si está vacía, se usa la que el
   admin pegó en Ajustes (guardada en ESTE navegador, nunca en el repo). */
function nubeConfig(){
  if(NUBE_CONFIG.url && NUBE_CONFIG.anonKey) return NUBE_CONFIG;
  try{ const v=localStorage.getItem(NUBE_CFG_LLAVE); if(v){ const c=JSON.parse(v); if(c&&c.url&&c.anonKey) return c; } }catch(e){}
  return NUBE_CONFIG;
}
function nubeGuardarConfig(url,anonKey){
  url=(url||"").trim().replace(/\/+$/,""); anonKey=(anonKey||"").trim();
  try{ if(url&&anonKey) localStorage.setItem(NUBE_CFG_LLAVE,JSON.stringify({url:url,anonKey:anonKey})); else localStorage.removeItem(NUBE_CFG_LLAVE); }catch(e){}
}
function nubeConfigManual(){ try{ return !!localStorage.getItem(NUBE_CFG_LLAVE); }catch(e){ return false; } }
/* prueba la conexión con los valores tipeados (antes de guardarlos) */
async function nubeProbar(url,anonKey){
  url=(url||"").trim().replace(/\/+$/,""); anonKey=(anonKey||"").trim();
  if(!url||!anonKey) return { ok:false, msg:"Falta la URL o la llave." };
  if(!/^https:\/\/.+\.supabase\.co$/i.test(url)) return { ok:false, msg:"La URL debería verse como https://xxxx.supabase.co" };
  try{
    const r=await fetch(url+"/auth/v1/settings",{ headers:{ apikey:anonKey } });
    if(r.ok) return { ok:true };
    return { ok:false, msg:"El servidor respondió "+r.status+". Revisa la anon key." };
  }catch(e){ return { ok:false, msg:"No se pudo conectar. ¿La URL está bien? ¿Hay internet?" }; }
}

function nubeActiva(){ const c=nubeConfig(); return !!(c.url && c.anonKey); }

/* ---------- sesión local (token guardado en este navegador) ---------- */
function nubeSesion(){
  try{ const v=localStorage.getItem(NUBE_LLAVE_SESION); return v?JSON.parse(v):null; }catch(e){ return null; }
}
function nubeGuardarSesion(s){
  try{ if(s) localStorage.setItem(NUBE_LLAVE_SESION,JSON.stringify(s)); else localStorage.removeItem(NUBE_LLAVE_SESION); }catch(e){}
}
function nubeLogueado(){ const s=nubeSesion(); return !!(s&&s.access_token); }
function nubeEmail(){ const s=nubeSesion(); return (s&&s.usuario&&s.usuario.email)||""; }

/* ---------- helpers de red ---------- */
function nubeHeaders(conAuth){
  const h={ "Content-Type":"application/json", "apikey":nubeConfig().anonKey };
  if(conAuth){ const s=nubeSesion(); if(s&&s.access_token) h["Authorization"]="Bearer "+s.access_token; }
  return h;
}
async function nubeFetch(ruta,opts){
  const c=nubeConfig();
  if(!c.url||!c.anonKey) throw new Error("La nube no está configurada.");
  const r=await fetch(c.url+ruta,opts);
  return r;
}

/* guarda el token que devuelve GoTrue en el formato local */
function nubeSetToken(j){
  if(!j||!j.access_token) return false;
  nubeGuardarSesion({ access_token:j.access_token, refresh_token:j.refresh_token||"",
    usuario:{ id:(j.user&&j.user.id)||"", email:(j.user&&j.user.email)||"" } });
  return true;
}

/* ---------- auth ---------- */
function nubeMsg(j, fallback){
  const raw=(j&&(j.msg||j.error_description||j.error||j.message))||"";
  const s=String(raw).toLowerCase();
  if(/invalid login|invalid credentials|invalid grant/.test(s)) return "Correo o clave incorrectos";
  if(/already registered|already been registered|user already/.test(s)) return "Ese correo ya tiene cuenta. Entra con tu clave.";
  if(/password/.test(s) && /(6|least|short)/.test(s)) return "La clave necesita al menos 6 caracteres";
  if(/email/.test(s) && /invalid/.test(s)) return "Ese correo no se ve válido";
  if(/otp|expired|invalid token|token has expired|invalid.*code/.test(s)) return "Código inválido o vencido. Pide otro.";
  if(/rate limit|too many|over_request/.test(s)) return "Demasiados intentos. Espera un minuto.";
  if(/network|failed to fetch|load failed/.test(s)) return "No hay red. El juego sigue igual, sin cuenta.";
  return raw||fallback||"No se pudo";
}
async function nubeRegistrar(email,pass){
  const r=await nubeFetch("/auth/v1/signup",{ method:"POST", headers:nubeHeaders(false),
    body:JSON.stringify({ email:email, password:pass }) });
  const j=await r.json().catch(()=>({}));
  if(!r.ok) return { ok:false, msg:nubeMsg(j, "Error "+r.status) };
  /* si el proyecto pide confirmar el mail, no viene access_token todavía */
  if(j.access_token){ nubeSetToken(j); return { ok:true, email:nubeEmail() }; }
  return { ok:true, confirmar:true, msg:"Cuenta creada. Revisa tu correo para confirmarla y después entra." };
}
async function nubeEntrar(email,pass){
  const r=await nubeFetch("/auth/v1/token?grant_type=password",{ method:"POST", headers:nubeHeaders(false),
    body:JSON.stringify({ email:email, password:pass }) });
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.access_token) return { ok:false, msg:nubeMsg(j, "Correo o clave incorrectos") };
  nubeSetToken(j); return { ok:true, email:nubeEmail() };
}
async function nubeRefrescar(){
  const s=nubeSesion(); if(!s||!s.refresh_token) return false;
  try{
    const r=await nubeFetch("/auth/v1/token?grant_type=refresh_token",{ method:"POST", headers:nubeHeaders(false),
      body:JSON.stringify({ refresh_token:s.refresh_token }) });
    const j=await r.json().catch(()=>({}));
    if(r.ok&&j.access_token){ nubeSetToken(j); return true; }
  }catch(e){}
  return false;
}
function nubeSalir(){
  try{
    const s=nubeSesion();
    if(s&&s.access_token){
      nubeFetch("/auth/v1/logout",{ method:"POST", headers:nubeHeaders(true) }).catch(function(){});
    }
  }catch(e){}
  nubeGuardarSesion(null);
}

/* Código de 6 dígitos al correo (OTP de GoTrue). Misma cuenta, sin clave.
   Cooldown de 60s en ESTE navegador para no spamear el proyecto. */
let _nubeOtpHasta=0;
function nubePuedePedirCodigo(){ return Date.now()>=_nubeOtpHasta; }
function nubeSegundosCodigo(){ return Math.max(0, Math.ceil((_nubeOtpHasta-Date.now())/1000)); }
async function nubePedirCodigo(email){
  email=String(email||"").trim();
  if(typeof mailOk==="function" && !mailOk(email)) return { ok:false, msg:"Ese correo no se ve válido" };
  if(!nubePuedePedirCodigo()) return { ok:false, msg:"Espera "+nubeSegundosCodigo()+" s para pedir otro código" };
  try{
    const r=await nubeFetch("/auth/v1/otp",{ method:"POST", headers:nubeHeaders(false),
      body:JSON.stringify({ email:email, create_user:true }) });
    const j=await r.json().catch(()=>({}));
    if(!r.ok) return { ok:false, msg:nubeMsg(j,"No se pudo enviar el código") };
    _nubeOtpHasta=Date.now()+60000;
    if(typeof nubeRecordarMail==="function") nubeRecordarMail(email);
    return { ok:true, msg:"Te mandamos un código de 6 dígitos. Revisa bandeja y spam." };
  }catch(e){ return { ok:false, msg:nubeMsg({message:e&&e.message},"No hay red. El juego sigue igual, sin cuenta.") }; }
}
async function nubeVerificarCodigo(email, token){
  email=String(email||"").trim();
  token=String(token||"").replace(/\D/g,"");
  if(typeof mailOk==="function" && !mailOk(email)) return { ok:false, msg:"Ese correo no se ve válido" };
  if(typeof codigoOk==="function" ? !codigoOk(token) : !/^\d{6}$/.test(token)) return { ok:false, msg:"El código son 6 números" };
  const probar=async function(tipo){
    const r=await nubeFetch("/auth/v1/verify",{ method:"POST", headers:nubeHeaders(false),
      body:JSON.stringify({ type:tipo, email:email, token:token }) });
    const j=await r.json().catch(()=>({}));
    return { r:r, j:j };
  };
  try{
    let x=await probar("email");
    if(!(x.r.ok&&x.j.access_token)) x=await probar("signup");
    if(!(x.r.ok&&x.j.access_token)) return { ok:false, msg:nubeMsg(x.j,"Código inválido o vencido") };
    nubeSetToken(x.j);
    if(typeof nubeRecordarMail==="function") nubeRecordarMail(email);
    return { ok:true, email:nubeEmail() };
  }catch(e){ return { ok:false, msg:nubeMsg({message:e&&e.message},"No hay red") }; }
}

/* ---------- sync de partida (tabla 'saves', una fila por usuario) ---------- */
async function nubeSubir(estado){
  if(!nubeLogueado()) return { ok:false, msg:"Entra a tu cuenta primero." };
  const s=nubeSesion();
  const cuerpo=[{ user_id:s.usuario.id, data:estado, updated_at:new Date().toISOString() }];
  const pedir=()=>nubeFetch("/rest/v1/saves",{ method:"POST",
    headers:Object.assign(nubeHeaders(true),{ "Prefer":"resolution=merge-duplicates,return=minimal" }),
    body:JSON.stringify(cuerpo) });
  let r=await pedir();
  if(r.status===401 && await nubeRefrescar()) r=await pedir();
  if(!r.ok){ const j=await r.json().catch(()=>({})); return { ok:false, msg:(j&&j.message)||("Error "+r.status) }; }
  return { ok:true };
}
async function nubeBajar(){
  if(!nubeLogueado()) return { ok:false, msg:"Entra a tu cuenta primero." };
  const s=nubeSesion();
  const pedir=()=>nubeFetch("/rest/v1/saves?user_id=eq."+encodeURIComponent(s.usuario.id)+"&select=data,updated_at",
    { method:"GET", headers:nubeHeaders(true) });
  let r=await pedir();
  if(r.status===401 && await nubeRefrescar()) r=await pedir();
  if(!r.ok){ const j=await r.json().catch(()=>({})); return { ok:false, msg:(j&&j.message)||("Error "+r.status) }; }
  const filas=await r.json().catch(()=>[]);
  if(!filas||!filas.length||!filas[0].data) return { ok:false, vacio:true, msg:"No hay ninguna partida guardada en la nube todavía." };
  return { ok:true, estado:filas[0].data, cuando:filas[0].updated_at };
}

/* ---------- auto-respaldo (solo SUBE, nunca pisa tu partida) ----------
   Se dispara solo tras cada guardado. Es un colchón para que nadie pierda
   su partida por limpiar el navegador. Nunca baja ni reemplaza nada solo:
   bajar sigue siendo manual y con confirmación. */
const NUBE_AUTO_LLAVE="futbolini_nube_auto";     /* on/off del auto-respaldo */
const NUBE_ULT_LLAVE ="futbolini_nube_ult";      /* timestamp del último respaldo OK */
let _nubeAutoTimer=null, _nubeAutoEnCurso=false, _nubeAutoPend=null;

function nubeAutoActivo(){
  try{ const v=localStorage.getItem(NUBE_AUTO_LLAVE); return v===null?true:v==="1"; }catch(e){ return true; }
}
function nubeAutoSet(b){ try{ localStorage.setItem(NUBE_AUTO_LLAVE,b?"1":"0"); }catch(e){} }
function nubeUltimoRespaldo(){
  try{ const v=localStorage.getItem(NUBE_ULT_LLAVE); return v?+v:0; }catch(e){ return 0; }
}
function _nubeMarcarRespaldo(){ try{ localStorage.setItem(NUBE_ULT_LLAVE,String(Date.now())); }catch(e){} }

/* llamado desde guardar(): agenda una subida con debounce de ~5s y coalescing */
function nubeAutoRespaldo(estado){
  if(!nubeActiva()||!nubeLogueado()||!nubeAutoActivo()) return;
  if(!estado||!estado.club) return;
  _nubeAutoPend=estado;                                   /* siempre sube el estado más nuevo */
  if(_nubeAutoTimer||_nubeAutoEnCurso) return;            /* ya hay una subida agendada/corriendo */
  _nubeAutoTimer=setTimeout(_nubeAutoDisparar,5000);
}
async function _nubeAutoDisparar(){
  _nubeAutoTimer=null;
  if(_nubeAutoEnCurso||!_nubeAutoPend) return;
  _nubeAutoEnCurso=true;
  const est=_nubeAutoPend; _nubeAutoPend=null;
  try{
    const r=await nubeSubir(est);
    if(r&&r.ok){
      _nubeMarcarRespaldo();
      if(typeof document!=="undefined"){ const n=document.getElementById("nubeAutoTxt"); if(n) n.textContent="respaldado recién"; }
    }
  }catch(e){}
  _nubeAutoEnCurso=false;
  if(_nubeAutoPend&&!_nubeAutoTimer) _nubeAutoTimer=setTimeout(_nubeAutoDisparar,5000); /* algo cambió mientras subía */
}

/* ---------- presencia: quién está con el juego abierto ----------
   Latido cada ~25s a /api/presencia. Si no hay servidor (Pages, file://),
   cuenta 1: vos. El panel de Ajustes pinta "Hay x personas jugando ahora". */
const PRESENCIA_ID_LLAVE="futbolini_presencia_id";
const PRESENCIA_MAIL_LLAVE="futbolini_nube_email";
let _presenciaTimer=null, _presenciaN=1, _presenciaOk=false;

function presenciaId(){
  try{
    var id=sessionStorage.getItem(PRESENCIA_ID_LLAVE);
    if(!id){
      id=(typeof crypto!=="undefined"&&crypto.randomUUID)?crypto.randomUUID()
        :("p"+Date.now().toString(36)+Math.random().toString(36).slice(2,10));
      sessionStorage.setItem(PRESENCIA_ID_LLAVE,id);
    }
    return id;
  }catch(e){ return "p"+Date.now(); }
}
function presenciaN(){ return Math.max(1, _presenciaN|0); }
function presenciaRuta(){
  try{
    if(typeof location==="undefined") return "/api/presencia";
    /* iframe /juego → mismo origen del preview */
    return "/api/presencia";
  }catch(e){ return "/api/presencia"; }
}
async function presenciaLatido(){
  try{
    const r=await fetch(presenciaRuta(),{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({id:presenciaId()}),
      cache:"no-store"
    });
    if(!r.ok) throw new Error("http "+r.status);
    const j=await r.json().catch(()=>({}));
    const n=Math.max(1, parseInt(j&&j.n,10)||1);
    _presenciaN=n; _presenciaOk=true;
    presenciaPintar();
    return n;
  }catch(e){
    _presenciaOk=false; _presenciaN=1; presenciaPintar();
    return 1;
  }
}
function presenciaPintar(){
  const n=presenciaN();
  const txt=document.getElementById("presenciaTxt");
  if(txt) txt.innerHTML="Hay <b>"+n+"</b> persona"+(n===1?"":"s")+" jugando ahora";
  const btn=document.getElementById("presenciaVivo");
  if(btn) btn.setAttribute("aria-label", n+" en línea");
}
function presenciaArrancar(){
  if(_presenciaTimer) return;
  presenciaLatido();
  _presenciaTimer=setInterval(presenciaLatido, 25000);
  try{ document.addEventListener("visibilitychange", function(){ if(!document.hidden) presenciaLatido(); }); }catch(e){}
}
function nubeMailRecordado(){
  try{ return localStorage.getItem(PRESENCIA_MAIL_LLAVE)||""; }catch(e){ return ""; }
}
function nubeRecordarMail(m){
  try{ if(m) localStorage.setItem(PRESENCIA_MAIL_LLAVE,m); }catch(e){}
}
