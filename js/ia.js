"use strict";
/* ============================================================
   FUTBOLINI 3.0 · ia.js
   Redes del club y roleo con el plantel.
   ── FUNCIONA OFFLINE por defecto ──
   Análisis heurístico de texto + frases predefinidas con efecto real.
   NO necesita conexión ni gasta nada.

   ── HOOK DE API (APAGADO) ──
   Para enchufar una IA de verdad más adelante, poné:
     IA_CONFIG.activa   = true
     IA_CONFIG.endpoint = "https://tu-backend/evaluar"
   Tu backend recibe {tarea, club, texto, contexto} y debe devolver JSON:
     { sentimiento: -100..100, promesa: {hay, texto, tipo, castigo} | null,
       consecuencia: "texto corto" }
   Mientras IA_CONFIG.activa sea false, jamás se llama a la red.
   (Ver PATCHES.md → "Encender la IA".)
   ============================================================ */

const IA_CONFIG = { activa:false, endpoint:null, modelo:"claude-sonnet-5" };
function iaDisponible(){ return !!(IA_CONFIG.activa && IA_CONFIG.endpoint); }

/* Contrato de la API. No se ejecuta salvo que actives IA_CONFIG. */
async function evaluarPostAPI(texto){
  const ctx={ moral:E.ind.moral, hinchada:E.ind.hinchada, prestigio:E.ind.prestigio,
    proximo:(proximoPartido()||{}).rivalNombre, ronda:(proximoPartido()||{}).ronda };
  const r=await fetch(IA_CONFIG.endpoint,{ method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ tarea:"post_red_club", club:E.clubNombre, texto:texto, contexto:ctx })});
  if(!r.ok) throw new Error("IA HTTP "+r.status);
  return await r.json();
}

/* ---------- análisis OFFLINE (heurístico) ---------- */
const IA_POS=["vamos","orgullo","campe","ganar","ganamos","fuerza","arriba","confío","confio","gloria",
 "corazón","corazon","juntos","creo","podemos","gracias","garra","huevos","alma","fe","unidos"];
const IA_NEG=["verg","renunci","crisis","fracaso","basta","harto","culpa","desastre","no va mas",
 "no va más","asco","traici","ridícul","ridicul","vendido"];
function analizarOffline(texto){
  const t=(texto||"").toLowerCase();
  let s=0;
  IA_POS.forEach(w=>{ if(t.includes(w)) s+=12; });
  IA_NEG.forEach(w=>{ if(t.includes(w)) s-=14; });
  if(/[A-ZÁÉÍÓÚÑ]{6,}/.test(texto||"")) s+=(s>=0?6:-6);   // gritar amplifica el tono
  s=clamp(s,-60,60);
  let promesa=null;
  const irse=/(o me voy|si no.*(me voy|renunci)|renuncio si no|dejo el cargo)/.test(t);
  const ganar=/(gano|ganamos|vamos a ganar|le ganamos|campe|prometo|aseguro)/.test(t);
  if(irse) promesa={hay:true, tipo:"ganarProximoGrande", castigo:"destitucion",
    texto:"Ganar el próximo partido o dejar el cargo"};
  else if(ganar && s>18) promesa={hay:true, tipo:"noPerderProximo", castigo:"reputacion",
    texto:"No perder el próximo partido"};
  return { sentimiento:s, promesa:promesa,
    consecuencia: s>20?"La gente se prende con el mensaje.":(s<-20?"El mensaje cae mal y la prensa lo toma.":"Repercusión tibia, sin grandes olas.") };
}

/* devuelve siempre una promesa que resuelve a {sentimiento, promesa, consecuencia} */
async function evaluarPost(texto){
  if(iaDisponible()){ try{ return await evaluarPostAPI(texto); }catch(e){ /* si falla, cae a offline */ } }
  return analizarOffline(texto);
}

/* ---------- aplicar el post al estado ---------- */
function aplicarPost(texto, ev){
  const s=ev.sentimiento||0;
  aplicarEfectos({moral:Math.round(s*0.06), hinchada:Math.round(s*0.05)});
  aplicarRep({publica:Math.round(s*0.05)});
  aplicarGrupos({prensa:Math.round(s*0.06), hinchada:Math.round(s*0.05), camarin:Math.round(s*0.04)});
  /* las frases predefinidas pueden traer efectos a medida */
  if(ev.ef) aplicarEfectos(ev.ef);
  if(ev.grupos) aplicarGrupos(ev.grupos);
  if(ev.rep) aplicarRep(ev.rep);
  if(ev.promesa && ev.promesa.hay) registrarPromesa(ev.promesa);
  const part=proximoPartido();
  E.redes=E.redes||[];
  E.redes.unshift({texto:texto, s:s, cons:ev.consecuencia||"", promesa:ev.promesa&&ev.promesa.hay?ev.promesa.texto:null,
    anio:E.anio, fecha:(part&&part.f?fechaTxt(part.f):"cierre"), ia:iaDisponible()});
  if(E.redes.length>30) E.redes.length=30;
  if(typeof postProc==="function") postProc((typeof handleClub==="function"?handleClub():"@club"),"dt",texto,s>15?"bueno":(s<-15?"malo":"neutro"));
  notificar({t:"Publicaste en la red del club", tipo:s>15?"bueno":(s<-15?"malo":"neutro"),
    d:"«"+texto+"» — "+ (ev.consecuencia||"") + (ev.promesa&&ev.promesa.hay?" Quedó registrada una promesa pública: "+ev.promesa.texto+".":""), bandeja:false});
  guardar();
}

/* ---------- promesas públicas con condición ---------- */
function registrarPromesa(p){
  E.promesas=E.promesas||[];
  /* la promesa apunta al PRÓXIMO partido sin jugar */
  E.promesas.push({tipo:p.tipo, texto:p.texto, castigo:p.castigo||"reputacion", objetivoIdx:E.idx, creada:E.idx});
}
/* Se llama al terminar cada partido, antes de avanzar el índice. */
function chequearPromesas(yo,otro){
  if(!E.promesas||!E.promesas.length) return;
  const quedan=[];
  E.promesas.forEach(p=>{
    if(p.objetivoIdx!==E.idx){ quedan.push(p); return; }
    const gano=yo>otro, noPerdio=yo>=otro;
    const cumplida = p.tipo==="ganarProximoGrande"?gano:(p.tipo==="noPerderProximo"?noPerdio:true);
    if(cumplida){
      aplicarRep({publica:8,credibilidad:10}); aplicarGrupos({hinchada:8,camarin:6,prensa:6});
      notificar({t:"Cumpliste tu promesa", tipo:"bueno",
        d:"Habías prometido: "+p.texto+". Se cumplió en la cancha. Tu palabra vale más y la gente lo valora.",bandeja:false});
    } else if(p.castigo==="destitucion"){
      aplicarRep({publica:-14,credibilidad:-16});
      notificar({t:"Rompiste tu palabra en público", tipo:"malo",
        d:"Dijiste «"+p.texto+"» y no se cumplió. El directorio te tomó la palabra: se termina el ciclo.",bandeja:false});
      if(typeof destituir==="function") destituir("Prometiste públicamente «"+p.texto+"» y no lo cumpliste. No hubo vuelta atrás.");
    } else {
      aplicarRep({publica:-8,credibilidad:-12}); aplicarGrupos({prensa:-8,hinchada:-6});
      notificar({t:"No cumpliste lo que prometiste", tipo:"malo",
        d:"Dijiste «"+p.texto+"» y quedó en nada. Tu credibilidad se resiente.",bandeja:false});
    }
  });
  E.promesas=quedan;
}

/* ---------- roleo con el capitán antes de una final ---------- */
/* Offline: tres tonos, evaluados según el estado real del camarín. */
function charlaCapitan(tono){
  const moral=E.ind.moral;
  let ef={}, txt="";
  if(tono==="arenga"){
    if(moral>=60){ ef={moral:8,plantel:2}; txt="La arenga prendió al grupo: salieron a comerse la cancha."; }
    else { ef={moral:-3}; txt="Con el ánimo bajo, la arenga sonó a exigencia y apretó de más."; }
  } else if(tono==="calma"){
    if(moral<55){ ef={moral:7}; txt="Bajar la ansiedad fue justo lo que el grupo necesitaba."; }
    else { ef={moral:2}; txt="El mensaje de calma ordenó, aunque al grupo le sobraba energía para más."; }
  } else { /* exigencia */
    if(E.rep.dureza>50){ ef={moral:4,plantel:3}; txt="Tu autoridad pesa: el mensaje duro se recibió como respeto."; }
    else { ef={moral:-5}; txt="Sin espalda de mano dura, la exigencia se leyó como desconfianza."; }
  }
  aplicarEfectos(ef);
  notificar({t:"Charla con el capitán", tipo:(ef.moral||0)>=4?"bueno":((ef.moral||0)<0?"malo":"neutro"),
    d:txt, bandeja:false});
  guardar();
  return {txt:txt, ef:ef};
}
