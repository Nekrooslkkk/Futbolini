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
  if(/árbitro|arbitro|robo|nos robaron/.test(t)) s+=4;
  if(/directorio|blanco|plata|sueldo/.test(t)) s-=6;
  if(/cantera|pibe|joven/.test(t)) s+=5;
  if(/[A-ZÁÉÍÓÚÑ]{6,}/.test(texto||"")) s+=(s>=0?6:-6);
  if(E&&E.ind&&E.ind.moral<40 && s>0) s-=8;
  if(E&&E.ind&&E.ind.hinchada>70 && s>0) s+=6;
  s=clamp(s,-70,70);
  let promesa=null;
  const irse=/(o me voy|si no.*(me voy|renunci)|renuncio si no|dejo el cargo)/.test(t);
  const ganar=/(gano|ganamos|vamos a ganar|le ganamos|campe|prometo|aseguro)/.test(t);
  if(irse) promesa={hay:true, tipo:"ganarProximoGrande", castigo:"destitucion",
    texto:"Ganar el próximo partido o dejar el cargo"};
  else if(ganar && s>18) promesa={hay:true, tipo:"noPerderProximo", castigo:"reputacion",
    texto:"No perder el próximo partido"};
  const part=typeof proximoPartido==="function"?proximoPartido():null;
  let cons=s>20?"La gente se prende con el mensaje.":(s<-20?"El mensaje cae mal y la prensa lo toma.":"Repercusión tibia, sin grandes olas.");
  if(part&&/clásico|u de chile|colo/.test(t)) cons+=" Con un clásico encima, cada palabra pesa doble.";
  return { sentimiento:s, promesa:promesa, consecuencia:cons, offline:true };
}
function consejoLocal(){
  if(!E) return "Sin partida.";
  const bits=[];
  const part=typeof proximoPartido==="function"?proximoPartido():null;
  if((E.plata||0)<80) bits.push("La caja está flaca: no firmés renovaciones caras esta semana.");
  if((E.deuda||0)>(E.plata||0)*3) bits.push("La deuda te come. Un préstamo más y el directorio se pone nervioso.");
  if(E.ind&&E.ind.moral<45) bits.push("El camarín está cortado. Una charla o un once que no sea de castigo.");
  if(E.ind&&E.ind.hinchada<40) bits.push("La hinchada se está yendo. Un resultado o un precio de entrada más bajo.");
  if(part) bits.push("Siguiente: "+(part.local?"vs ":"en ")+part.rivalNombre+(part.real?" (hist. "+part.real+")":"")+".");
  const yo=E.tabla&&E.tabla[E.club];
  if(yo&&yo.pj>=5){
    const arr=typeof tablaOrdenada==="function"?tablaOrdenada():[];
    const pos=arr.findIndex(c=>c.id===E.club)+1;
    if(pos) bits.push("Vas "+pos+"° con "+yo.pts+" pts.");
  }
  if(E.perfil&&E.perfil.pareja&&(E.perfil.pareja.nivel||65)<40) bits.push("En casa está cortado. Una cita o se te arma otra crisis.");
  if(E.perfil&&E.perfil.hijos&&E.perfil.hijos.some(h=>!h.enPlantel&&((E.anio-h.nacido)>=17))) bits.push("Tenés un hijo en edad de firmar en cantera.");
  if(!bits.length) bits.push("No hay fuego. Podés mover un estatuto o mirar el mercado.");
  return bits.join(" ");
}
function pensarOffline(tarea,ctx){
  ctx=ctx||{};
  if(tarea==="tinder"){
    if((ctx.pts||0)>=20) return "Cerebro local: hubo química. No prometas titularidad en la primera cita.";
    if((ctx.pts||0)>=8) return "Cerebro local: todavía se puede. No hables del directorio.";
    return "Cerebro local: esa charla no sumó. Mejor otra semana.";
  }
  if(tarea==="sucesor") return "Cerebro local: el hijo llega con capital; el de afuera llega sin el apellido y sin perdón.";
  return consejoLocal();
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
