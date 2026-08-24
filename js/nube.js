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
  url: "",        /* ej: https://abcdefgh.supabase.co  (sin barra final) */
  anonKey: ""     /* anon / public key del proyecto */
};

const NUBE_LLAVE_SESION = "futbolini_nube_sesion";

function nubeActiva(){ return !!(NUBE_CONFIG.url && NUBE_CONFIG.anonKey); }

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
  const h={ "Content-Type":"application/json", "apikey":NUBE_CONFIG.anonKey };
  if(conAuth){ const s=nubeSesion(); if(s&&s.access_token) h["Authorization"]="Bearer "+s.access_token; }
  return h;
}
async function nubeFetch(ruta,opts){
  if(!nubeActiva()) throw new Error("La nube no está configurada.");
  const r=await fetch(NUBE_CONFIG.url+ruta,opts);
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
async function nubeRegistrar(email,pass){
  const r=await nubeFetch("/auth/v1/signup",{ method:"POST", headers:nubeHeaders(false),
    body:JSON.stringify({ email:email, password:pass }) });
  const j=await r.json().catch(()=>({}));
  if(!r.ok) return { ok:false, msg:(j&&(j.msg||j.error_description||j.error))||("Error "+r.status) };
  /* si el proyecto pide confirmar el mail, no viene access_token todavía */
  if(j.access_token){ nubeSetToken(j); return { ok:true, email:nubeEmail() }; }
  return { ok:true, confirmar:true, msg:"Cuenta creada. Revisá tu correo para confirmarla y después entrá." };
}
async function nubeEntrar(email,pass){
  const r=await nubeFetch("/auth/v1/token?grant_type=password",{ method:"POST", headers:nubeHeaders(false),
    body:JSON.stringify({ email:email, password:pass }) });
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.access_token) return { ok:false, msg:(j&&(j.msg||j.error_description||j.error))||"Correo o clave incorrectos" };
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
function nubeSalir(){ nubeGuardarSesion(null); }

/* ---------- sync de partida (tabla 'saves', una fila por usuario) ---------- */
async function nubeSubir(estado){
  if(!nubeLogueado()) return { ok:false, msg:"Entrá a tu cuenta primero." };
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
  if(!nubeLogueado()) return { ok:false, msg:"Entrá a tu cuenta primero." };
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
