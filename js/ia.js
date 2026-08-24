"use strict";
/* ============================================================
   FUTBOLINI 3.0 · ia.js
   Redes del club y roleo con el plantel.
   ── 100% OFFLINE, GRATIS Y SIN SERVIDOR ──
   Cerebro local por heurística: analiza el texto y el estado real (E) y
   devuelve sentimiento, promesa y consecuencia. Nunca toca la red, nunca
   gasta un peso, nunca depende de una IA de pago. Ese es el trato del juego:
   que lo pueda jugar todo el mundo sin costo.
   Para darle más vida, se SUMAN palabras y reglas a las tablas de abajo.
   ============================================================ */

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
/* ============================================================
   6.35 · CEREBRO LOCAL (la idea que dejó Grok, ahora desarrollada)
   Sin internet, sin créditos: lee el estado real del club y arma
   un análisis PRIORIZADO con lo que importa esta semana. Devuelve
   insights categorizados; el escritorio los pinta lindos.
   ============================================================ */
function cerebroLocal(){
  if(!E) return [];
  const ins=[];
  const part=typeof proximoPartido==="function"?proximoPartido():null;
  /* 1 · lectura del próximo partido (lo más importante) */
  if(part && typeof fuerzaEquipo==="function" && typeof onceIdeal==="function"){
    const fz=fuerzaEquipo(onceIdeal()).base, dif=fz-part.fuerzaRival;
    let lec,tip;
    if(dif>6){ lec="Sos favorito ante "+part.rivalNombre+"."; tip="Presioná arriba y buscá el arco temprano; no lo dejes crecer."; }
    else if(dif<-6){ lec=part.rivalNombre+" llega más fuerte."; tip="Ordenate atrás, aguantá y salí de contra con los rápidos."; }
    else { lec="Está parejo con "+part.rivalNombre+"."; tip="Lo define un detalle: pelota parada y no regalar el mediocampo."; }
    ins.push({cat:"partido",ic:"⚽",prio:9,t:lec,d:tip});
  }
  /* 2 · química del equipo */
  if(typeof quimicaEquipo==="function" && typeof onceIdeal==="function"){
    const q=quimicaEquipo(onceIdeal());
    if(q.prom<50) ins.push({cat:"tactica",ic:"🔗",prio:7,t:"Química floja ("+q.prom+"/100)",d:"Hay jugadores que no congenian. Acomodá la pizarra para juntar a los que se llevan bien."});
    else if(q.prom>=70) ins.push({cat:"tactica",ic:"🔗",prio:3,t:"El grupo está enchufado ("+q.prom+"/100)",d:"Buena química: es momento de sostener el equipo y no tocar mucho."});
  }
  /* 3 · objetivos en riesgo */
  if(Array.isArray(E.objetivos) && typeof progresoObjetivo==="function"){
    const enRiesgo=E.objetivos.map(o=>({o:o,pr:progresoObjetivo(o)})).filter(x=>x.pr.estado==="riesgo");
    if(enRiesgo.length) ins.push({cat:"objetivo",ic:"🎯",prio:8,t:"Meta en riesgo: "+enRiesgo[0].o.t,
      d:enRiesgo[0].pr.txt+". "+(enRiesgo.length>1?"(y "+(enRiesgo.length-1)+" más). ":"")+"El directorio evalúa esto al cierre."});
  }
  /* 4 · plata y deuda */
  if((E.plata||0)<80) ins.push({cat:"plata",ic:"💰",prio:6,t:"Caja flaca ("+plata(E.plata||0)+")",d:"No firmés renovaciones caras esta semana; primero equilibrá el flujo."});
  if((E.deuda||0)>(E.plata||0)*3) ins.push({cat:"plata",ic:"💰",prio:6,t:"La deuda te come",d:"Un préstamo más y el directorio se pone nervioso. Pensá en vender un prescindible."});
  /* 5 · camarín y hinchada */
  if(E.ind&&E.ind.moral<45) ins.push({cat:"camarin",ic:"👥",prio:5,t:"Camarín cortado (moral "+Math.round(E.ind.moral)+")",d:"Una charla o un once que no sea de castigo. Ganar cura casi todo."});
  if(E.ind&&E.ind.hinchada<40) ins.push({cat:"hinchada",ic:"🚩",prio:5,t:"La hinchada se está yendo",d:"Un resultado, un precio de entrada más bajo o un gesto con la barra."});
  /* 6 · piernas cansadas */
  if(typeof onceIdeal==="function"){
    const cans=onceIdeal().filter(j=>(j.cansancio||0)>=18);
    if(cans.length>=2) ins.push({cat:"fisico",ic:"🏃",prio:4,t:cans.length+" titulares con las piernas pesadas",d:"Pensá en rotar o entrenar suave; forzar es pedir una lesión."});
  }
  /* 7 · racha */
  const sinGanar=(E.temporada&&E.temporada.sinGanar)||0;
  if(sinGanar>=3) ins.push({cat:"racha",ic:"📉",prio:6,t:sinGanar+" fechas sin ganar",d:"Hay que cortar la mala. Un plan simple y sólido antes que inventar."});
  /* 8 · mercado */
  if((E.plata||0)>250 && E.temporada && E.temporada.pj>=3){
    ins.push({cat:"mercado",ic:"🛒",prio:2,t:"Hay caja para moverse",d:"El mercado está abierto: un refuerzo puntual puede cambiarte la temporada."});
  }
  ins.sort((a,b)=>b.prio-a.prio);
  return ins.slice(0,5);
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

/* devuelve siempre una promesa que resuelve a {sentimiento, promesa, consecuencia}.
   Cerebro local: sin red, sin costo. Se mantiene async por compatibilidad con quien lo llama. */
async function evaluarPost(texto){
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
    anio:E.anio, fecha:(part&&part.f?fechaTxt(part.f):"cierre"), ia:false});
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
