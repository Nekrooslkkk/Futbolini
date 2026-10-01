"use strict";
/* ============================================================
   FUTBOLINI · partidas.js — 7.9125 · dónde viven tus partidas (y que "guardado" nunca mienta)

   Bug del autor (URGENTE): "aprieto Continuar en el inicio y no carga la partida anterior".
   Causa, reproducida en Chromium: una partida pesa ~0,5 MB después de una temporada (el 70 % son los planteles de
   los clubes CPU) y el navegador da ~5 MB de localStorage por sitio, con la partida abierta escrita DOS veces (su
   ranura + la clave vieja). Con ~9 partidas se llenaba: localStorage.setItem tiraba QuotaExceededError, el error
   se tragaba callado, el juego decía "guardado 14:14" y la ranura quedaba vacía (o con la versión vieja). Al volver,
   el botón de esa partida decía "No se pudo cargar esa partida".

   Ahora:
   · Las partidas viven en IndexedDB (cientos de MB, en el mismo equipo, sin internet ni cuenta). localStorage guarda
     solo la partida ABIERTA (la "copia rápida": se escribe sin esperar, y es lo que alcanza a quedar si cierras la
     pestaña de golpe), la lista de partidas y los ajustes.
   · Al abrir, las partidas que estaban en localStorage se mudan solas a IndexedDB (se verifica antes de borrar).
   · Se carga siempre la copia MÁS NUEVA que exista (IndexedDB, copia rápida o ranura vieja): cada guardado lleva su
     sello de tiempo (E._guardadoEn).
   · Si no se puede guardar, se dice fuerte (cartel con "Descargar partida") y el reloj de guardado no miente.
   · Una partida de la lista sin datos se muestra como tal (no como un botón muerto) y se puede quitar. Datos sin
     ficha en la lista (la lista se perdió o se pisó) vuelven solos a la lista.
   Sin IndexedDB (navegador viejo, algún modo privado): todo sigue en localStorage como antes, pero avisando.
   Doctor: guardado_honesto, partidas_inventario, continuar_carga (js/dev-banco.js). Prueba de punta a punta con el
   navegador de verdad: test/partidas.sh (va dentro de correr_dev.sh).
   ============================================================ */
const PARTIDAS={ bd:null, abriendo:null, sinBD:false, apagada:false, estado:null, ultimo:null, errLS:null,
  PREFIJO:"futbolini3_partida_", ESPERA_BD:4000, ESPERA_TX:8000 };

/* ---------- IndexedDB, sin librerías ---------- */
function _bdSoporta(){
  if(PARTIDAS.sinBD||PARTIDAS.apagada) return false;
  try{ return typeof indexedDB!=="undefined"&&!!indexedDB; }catch(e){ return false; }
}
function _esperarMs(ms){ return new Promise(r=>setTimeout(r,ms)); }
/* abre la base una vez. Si tarda más de 4 s (Safari a veces no contesta) esta llamada sigue sin BD, pero la apertura
   queda andando: si contesta después, los guardados siguientes ya la usan. Después de la primera espera larga, las
   siguientes esperan poco (si la base está colgada, cada guardado no puede pagar 4 s). */
function bdAbrir(){
  if(!_bdSoporta()) return Promise.resolve(null);
  if(PARTIDAS.bd) return Promise.resolve(PARTIDAS.bd);
  const espera=PARTIDAS.tardia?300:PARTIDAS.ESPERA_BD;
  if(!PARTIDAS.abriendo){
    PARTIDAS.abriendo=new Promise(res=>{
      try{
        const rq=indexedDB.open("futbolini",1);
        rq.onupgradeneeded=()=>{ try{ rq.result.createObjectStore("partidas"); }catch(e){} };
        rq.onsuccess=()=>{
          const db=rq.result;
          db.onversionchange=()=>{ try{ db.close(); }catch(e){} PARTIDAS.bd=null; PARTIDAS.abriendo=null; };
          PARTIDAS.bd=db; res(db);
        };
        rq.onerror=()=>{ PARTIDAS.sinBD=true; PARTIDAS.abriendo=null; res(null); };
      }catch(e){ PARTIDAS.sinBD=true; PARTIDAS.abriendo=null; res(null); }
    });
  }
  return Promise.race([PARTIDAS.abriendo, _esperarMs(espera).then(()=>{ if(!PARTIDAS.bd) PARTIDAS.tardia=true; return PARTIDAS.bd||null; })]);
}
/* una transacción con tope de tiempo: nunca deja colgado al que espera (guardar, cambiar de partida) */
function _bdTx(modo,hacer){
  return bdAbrir().then(db=>{
    if(!db) return {ok:false, err:"sin IndexedDB"};
    return new Promise(res=>{
      let listo=false, rq=null;
      const fin=r=>{ if(listo) return; listo=true; clearTimeout(reloj); res(r); };
      const reloj=setTimeout(()=>fin({ok:false, err:"IndexedDB no contestó"}),PARTIDAS.ESPERA_TX);
      try{
        const tx=db.transaction("partidas",modo);
        rq=hacer(tx.objectStore("partidas"));
        tx.oncomplete=()=>fin({ok:true, val:rq?rq.result:undefined});
        tx.onerror=()=>fin({ok:false, err:tx.error});
        tx.onabort=()=>fin({ok:false, err:tx.error});
      }catch(e){
        if(e&&e.name==="InvalidStateError"){ PARTIDAS.bd=null; PARTIDAS.abriendo=null; }   /* conexión cerrada: se reabre la próxima */
        fin({ok:false, err:e});
      }
    });
  });
}
function bdLeer(id){ return _bdTx("readonly",st=>st.get(String(id))).then(r=>r.ok?(r.val||null):null); }
function bdEscribir(id,reg){ return _bdTx("readwrite",st=>st.put(reg,String(id))).then(r=>r.ok); }
/* escribe solo si lo que hay es más viejo (la mudanza no puede pisar un guardado que llegó entre medio) */
function bdEscribirSiMasNueva(id,reg){
  return _bdTx("readwrite",st=>{
    const g=st.get(String(id));
    g.onsuccess=()=>{ const cur=g.result; if(!cur||(+cur.t||0)<(+reg.t||0)) st.put(reg,String(id)); };
    return g;
  }).then(r=>r.ok);
}
function bdBorrar(id){ return _bdTx("readwrite",st=>st.delete(String(id))).then(r=>r.ok); }
function bdVaciar(){ return _bdTx("readwrite",st=>st.clear()).then(r=>r.ok); }
function bdLlaves(){ return _bdTx("readonly",st=>st.getAllKeys()).then(r=>r.ok?(r.val||[]).map(String):null); }

/* ---------- localStorage (lo chico y la copia rápida) ---------- */
function _lsTxt(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function _lsQuitar(k){ try{ localStorage.removeItem(k); }catch(e){} }
function _lsPoner(k,txt){ try{ localStorage.setItem(k,txt); return true; }catch(e){ PARTIDAS.errLS=e; return false; } }
function _lsLlavesPartida(){
  const out=[];
  try{ for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k&&k.indexOf(PARTIDAS.PREFIJO)===0) out.push(k); } }catch(e){}
  return out;
}
/* caracteres usados en localStorage (el tope del navegador va por ahí: ~5,2 millones en Chrome) */
function partidasUsoLS(){
  let n=0;
  try{ for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i)||""; n+=k.length+(localStorage.getItem(k)||"").length; } }catch(e){}
  return n;
}
function _jsonPartida(txt){
  if(!txt) return null;
  try{ const o=JSON.parse(txt); return (o&&typeof o==="object"&&o.club)?o:null; }catch(e){ return null; }
}
function _hayStorageExterno(){ return typeof window!=="undefined"&&!!(window.storage&&window.storage.set&&window.storage.get); }
function _selloDe(est){ return (est&&+est._guardadoEn)||0; }
function _errTxt(e){
  if(!e) return "";
  if(e.name==="QuotaExceededError"||/quota/i.test(String(e.message||e))) return "el navegador no tiene más espacio";
  return String(e.message||e.name||e).slice(0,120);
}
function slotMasNuevo(lista){
  return (lista||[]).slice().sort((a,b)=>((+b.t||+b.guardado||0)-(+a.t||+a.guardado||0)))[0]||null;
}

/* ---------- leer ---------- */
/* todas las copias que existen de una partida, la más nueva primero */
async function partidaCopias(id){
  id=String(id);
  const out=[];
  const sumar=(est,donde)=>{ if(est&&est.club){ est._slot=id; out.push({est:est, t:_selloDe(est), donde:donde}); } };
  if(_hayStorageExterno()){
    sumar(await Store.get(slotKey(id)),"storage");
    const j=await Store.get(LLAVE); if(j&&j._slot===id) sumar(j,"rapida");
  } else {
    sumar(_jsonPartida(_lsTxt(slotKey(id))),"ls");
    const j=_jsonPartida(_lsTxt(LLAVE)); if(j&&j._slot===id) sumar(j,"rapida");
    const r=await bdLeer(id); if(r&&r.txt) sumar(_jsonPartida(r.txt),"bd");
  }
  const pref={bd:0, storage:0, ls:1, rapida:2};
  out.sort((a,b)=>(b.t-a.t)||(pref[a.donde]-pref[b.donde]));
  return out;
}
async function partidaLeer(id){ const c=await partidaCopias(id); return c.length?c[0].est:null; }
/* al abrir el juego: la partida activa SIN esperar a IndexedDB, solo si la copia rápida (o la ranura vieja) es tan
   nueva como dice la lista. Si no, null: el botón de inicio la carga de la base (la más nueva). */
async function partidaRapidaInicio(id,lista){
  if(!id) return null;
  lista=lista||[];
  const meta=lista.find(s=>s.id===id);
  if(lista.length&&!meta) return null;   /* una partida borrada no vuelve por la copia rápida */
  if(_hayStorageExterno()){ const s=await Store.get(slotKey(id)); return (s&&s.club)?s:null; }
  const cand=[];
  const j=_jsonPartida(_lsTxt(LLAVE)); if(j&&j._slot===id) cand.push(j);
  const l=_jsonPartida(_lsTxt(slotKey(id))); if(l){ l._slot=id; cand.push(l); }
  cand.sort((a,b)=>_selloDe(b)-_selloDe(a));
  const g=cand[0]||null;
  return (g&&_selloDe(g)>=((meta&&+meta.t)||0))?g:null;
}

/* ---------- escribir ---------- */
/* copia rápida (síncrona) + copia durable (IndexedDB, o la ranura de localStorage si no hay base).
   Devuelve {ok, parcial, donde[], err}: ok = quedó una copia durable; parcial = solo quedó la copia rápida. */
async function partidaEscribir(est,txt){
  const id=String(est._slot), t=_selloDe(est)||Date.now();
  const res={ok:false, parcial:false, donde:[], err:"", t:t, kb:Math.round(txt.length/1024), id:id};
  if(_hayStorageExterno()){
    try{ await window.storage.set(slotKey(id),txt); await window.storage.set(LLAVE,txt); res.ok=true; res.donde.push("storage"); }
    catch(e){ res.err=_errTxt(e)||"no se pudo guardar"; }
    PARTIDAS.ultimo=res; return res;
  }
  PARTIDAS.errLS=null;
  /* 1) copia rápida: ANTES de cualquier await (al cerrar la pestaña es la única que alcanza a quedar) */
  const rapida=_lsPoner(LLAVE,txt);
  /* 2) copia durable */
  let bd=false;
  if(_bdSoporta()) bd=await bdEscribir(id,{id:id, t:t, club:est.club, anio:est.anio, txt:txt});
  if(bd){ res.donde.push("bd"); _lsQuitar(slotKey(id)); }   /* la ranura vieja de localStorage ya sobra */
  else if(_lsPoner(slotKey(id),txt)) res.donde.push("ls");
  if(rapida) res.donde.push("rapida");
  res.ok=bd||res.donde.indexOf("ls")>=0;
  res.parcial=!res.ok&&rapida;
  /* una copia rápida que no se pudo escribir quedó con datos viejos: si la durable sí quedó, se borra para que nadie
     la confunda con la buena (si no quedó ninguna, se deja: puede ser lo único que hay de esta partida) */
  if(!rapida&&res.ok) _lsQuitar(LLAVE);
  if(!res.ok) res.err=_errTxt(PARTIDAS.errLS)||"el navegador no dejó guardar";
  PARTIDAS.ultimo=res;
  return res;
}
/* la partida abierta pasa a ser la copia rápida (al cargar otra partida) */
async function partidaCopiaRapida(est){
  if(!est) return false;
  if(_hayStorageExterno()){ await Store.set(LLAVE,est); return true; }
  let ok=false; try{ ok=_lsPoner(LLAVE,JSON.stringify(est)); }catch(e){}
  if(!ok) _lsQuitar(LLAVE);   /* mejor sin copia rápida que con la de otra partida */
  return ok;
}
/* guarda YA la partida abierta (sin agrupar: eso lo hace rendimiento.js) */
async function partidaGuardarYa(){
  if(!E||E._bulkSim) return null;
  const est=E;
  est.saveVer=SAVE_VER;
  if(!est._slot) est._slot=nuevoSlotId();
  if(typeof saneaEstado==="function") saneaEstado(est);
  est._guardadoEn=Math.max(Date.now(),_selloDe(est)+1);
  const txt=JSON.stringify(est);
  const res=await partidaEscribir(est,txt);
  _ram[LLAVE]=est;
  if(res.ok||res.parcial){
    try{ await slotFijarActivo(est._slot); }catch(e){}
    try{ await slotActualizarIndice(est); }catch(e){}
  }
  avisoGuardado(res);
  if(res.ok&&typeof nubeAutoRespaldo==="function"){ try{ nubeAutoRespaldo(est); }catch(e){} }
  if(res.ok) partidasPedirPersistencia();
  return res;
}
async function partidaBorrarDatos(id){
  id=String(id);
  if(_hayStorageExterno()){ await Store.del(slotKey(id)); return; }
  _lsQuitar(slotKey(id)); delete _ram[slotKey(id)];
  if(_bdSoporta()) await bdBorrar(id);
}

/* ---------- que se note cuando NO se guardó ---------- */
function avisoGuardado(res){
  if(typeof document==="undefined"||!res) return;
  const n=document.getElementById("guardadoTxt");
  let hora=""; try{ hora=new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"}); }catch(e){}
  if(n){
    n.textContent=res.ok?"guardado "+hora:(res.parcial?"⚠️ guardado a medias":"⚠️ SIN GUARDAR");
    n.classList.toggle("guardado-mal",!res.ok);
  }
  let b=document.getElementById("guardadoFallo");
  if(res.ok){ if(b) b.remove(); return; }
  if(!b){ b=document.createElement("div"); b.id="guardadoFallo"; b.className="guardado-fallo"; b.setAttribute("role","alert"); document.body.appendChild(b); }
  b.innerHTML="";
  const tit=document.createElement("b"); tit.textContent=res.parcial?"⚠️ Tu partida quedó guardada a medias":"⚠️ No se pudo guardar tu partida";
  const txt=document.createElement("span");
  txt.textContent=res.parcial
    ?"El navegador no tiene más espacio: solo quedó la copia rápida de esta pestaña. Descárgala para no perderla, o borra partidas viejas en Ajustes ▸ Mis partidas."
    :"Motivo: "+(res.err||"el navegador no dejó guardar")+". Descárgala ahora: si cierras, se pierde lo último.";
  const bd=el("button","btn-aqua chico verde"); bd.textContent="💾 Descargar partida";
  bd.onclick=function(){ if(typeof descargarPartida==="function") descargarPartida(); };
  const bp=el("button","btn-aqua chico"); bp.textContent="🗂️ Mis partidas";
  bp.onclick=function(){ if(typeof abrirAjustes==="function") abrirAjustes(); };
  const bx=el("button","btn-aqua chico"); bx.textContent="✕"; bx.title="Ocultar"; bx.setAttribute("aria-label","Ocultar aviso");
  bx.onclick=function(){ b.remove(); };
  b.appendChild(tit); b.appendChild(txt); b.appendChild(bd); b.appendChild(bp); b.appendChild(bx);
}
/* que el navegador no borre las partidas cuando le falte espacio. Sin preguntar solo si el juego está instalado como
   app (Chrome/Safari lo conceden sin cartel); en el resto lo pide el jugador desde Mis partidas. */
let _persistPedida=false;
function partidasPedirPersistencia(aMano){
  if(_persistPedida&&!aMano) return Promise.resolve(null);
  try{
    if(!navigator.storage||!navigator.storage.persist) return Promise.resolve(null);
    const app=!!(window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches);
    if(!aMano&&!app) return Promise.resolve(null);
    _persistPedida=true;
    return navigator.storage.persist().catch(()=>false);
  }catch(e){ return Promise.resolve(null); }
}

/* ---------- mantenimiento al abrir: mudanza, inventario y rescate ---------- */
async function partidasMantener(){
  const rep={bd:false, movidas:0, quedanLS:0, recuperadas:[], sinDatos:[], conDatos:new Set(), total:0, enBD:0, usoLS:0, errores:[]};
  if(_hayStorageExterno()){ PARTIDAS.estado=rep; return rep; }
  const db=await bdAbrir(); rep.bd=!!db;
  /* 1) mudanza: ranuras de localStorage → IndexedDB (verificada antes de borrar) */
  if(db){
    for(const k of _lsLlavesPartida()){
      const id=k.slice(PARTIDAS.PREFIJO.length), txt=_lsTxt(k);
      const est=_jsonPartida(txt); if(!est) continue;   /* lo que no se entiende no se toca */
      const t=_selloDe(est);
      let ok=await bdEscribirSiMasNueva(id,{id:id, t:t, club:est.club, anio:est.anio, txt:txt});
      if(ok){ const v=await bdLeer(id); ok=!!(v&&v.txt&&(+v.t||0)>=t); }
      if(ok){ _lsQuitar(k); rep.movidas++; } else rep.errores.push("no se pudo mudar "+id);
    }
    /* 2) la copia rápida también queda en la base si es más nueva (por si la base no alcanzó al cerrar) */
    const jt=_lsTxt(LLAVE), j=_jsonPartida(jt);
    if(j&&j._slot) await bdEscribirSiMasNueva(j._slot,{id:j._slot, t:_selloDe(j), club:j.club, anio:j.anio, txt:jt});
  }
  /* 3) inventario: qué partidas tienen datos */
  _lsLlavesPartida().forEach(k=>{ rep.conDatos.add(k.slice(PARTIDAS.PREFIJO.length)); rep.quedanLS++; });
  if(db){ const ll=await bdLlaves(); (ll||[]).forEach(id=>rep.conDatos.add(id)); rep.enBD=(ll||[]).length; }
  const j=_jsonPartida(_lsTxt(LLAVE)); if(j&&j._slot) rep.conDatos.add(j._slot);
  /* 4) rescate: datos sin ficha en la lista vuelven a la lista */
  const lista=await slotsLista(), enLista=new Set(lista.map(s=>s.id));
  for(const id of rep.conDatos){
    if(enLista.has(id)) continue;
    const est=await partidaLeer(id); if(!est||!est.club) continue;
    const m=slotMetaDe(est); m.guardado=_selloDe(est)||m.guardado; m.recuperada=true;
    lista.push(m); rep.recuperadas.push(id);
  }
  if(rep.recuperadas.length) await slotsGuardarLista(lista);
  /* 5) fichas sin datos: se marcan (no se borran solas: decide el jugador) */
  rep.sinDatos=lista.filter(s=>!rep.conDatos.has(s.id)).map(s=>s.id);
  rep.total=lista.length;
  rep.usoLS=partidasUsoLS();
  PARTIDAS.estado=rep;
  return rep;
}
/* texto para Mis partidas: dónde están y cuánto ocupan */
function partidasResumenTxt(){
  const r=PARTIDAS.estado; if(!r) return "";
  const mb=Math.round(r.usoLS/104857.6)/10;
  return (r.bd?"Tus partidas viven en la base del navegador (IndexedDB): caben muchas, sin internet. ":"Este navegador no deja usar IndexedDB: las partidas van en localStorage (caben ~8). ")+
    "Copia rápida y ajustes: "+mb+" MB de ~5 MB.";
}
/* descargar CUALQUIER partida de la lista (no solo la abierta): sirve para rescatar una que no abre */
async function descargarPartidaDe(id){
  const est=await partidaLeer(id);
  if(!est){ if(typeof aviso==="function") aviso("Esa partida no tiene datos guardados"); return false; }
  const paquete={app:"futbolini", saveVer:(typeof SAVE_VER==="number"?SAVE_VER:est.saveVer||1), guardado:Date.now(), E:est};
  const blob=new Blob([JSON.stringify(paquete)],{type:"application/json"}), url=URL.createObjectURL(blob);
  const nombre="futbolini-"+String(est.clubNombre||est.club||"club").toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+(est.anio||"")+".fut";
  const a=el("a"); a.href=url; a.download=nombre; document.body.appendChild(a); a.click();
  setTimeout(()=>{ a.remove(); URL.revokeObjectURL(url); },200);
  return true;
}
