"use strict";
/* ============================================================
   FUTBOLINI 5.0 · reputacion.js  (Bloque 1)
   Perfil del DT (estilo Frutiger Aero / Vista), Vida Social
   (citas y salidas satíricas) y Dinastía (sucesión hasta 2100).
   Todo ficción de juego, tono chileno. Cuelga de E.perfil / E.dinastia / E.personal.
   ============================================================ */

function edadDT(){
  const y=parseInt(String((E.perfil&&E.perfil.nacimiento)||"1988").slice(0,4),10)||1988;
  return Math.max(0, E.anio - y);
}
function apellidoDinastia(){
  const p=String((E.perfil&&E.perfil.nombre)||"DT").trim().split(/\s+/);
  return p.length>1?p[p.length-1]:"";
}
function relacionSucesor(gen){ return ["","fundador/a","hijo/a","nieto/a","bisnieto/a","tataranieto/a"][gen]||("generación "+gen); }

/* ---------- Vida Social: citas y salidas ---------- */
const SALIDAS=[
 {t:"Cita a ciegas",d:"Te armaron una cita a ciegas con alguien que jura ser primo de un seleccionado."},
 {t:"Carrete de farándula",d:"Evento de farándula donde nadie sabe de fútbol pero todos opinan del VAR."},
 {t:"Noche de boliche",d:"Salida nocturna que se estira. Mañana hay práctica con lentes de sol puestos."},
 {t:"Match en la app",d:"Hiciste match con alguien cuya bio dice: «hincha de corazón, busco algo serio»."},
 {t:"Asado con amigos",d:"Asado tranquilo que termina en debate acalorado sobre el mejor DT de la historia."},
 {t:"Gala benéfica",d:"Cena de beneficencia con foto obligada. Si te portás bien, es buena imagen."},
 {t:"Escapada a la playa",d:"Fin de semana en la costa para despejar la cabeza del vestuario."},
 {t:"Cena de negocios",d:"Un empresario te invita a cenar «sin compromiso». Nadie invita sin compromiso."}
];
function salir(){
  const ev=elige(SALIDAS);
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">🌙</span><span>'+ev.t+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p",null,ev.d));
    c.appendChild(el("p","mini","Bolsillo personal: "+plata(E.personal.bolsillo)+"."));
    const bp=el("button","btn-aqua ancho verde","Salida pública (prensa + popularidad, riesgo de filtración)");
    bp.onclick=()=>resolverSalida(ev,"publica");
    const bv=el("button","btn-aqua ancho","Salida privada (cuesta plata, sin prensa)"); bv.style.marginTop="6px";
    bv.onclick=()=>resolverSalida(ev,"privada");
    const x=el("button","btn-aqua ancho gris","Quedarme en casa"); x.style.marginTop="6px"; x.onclick=cerrarModal;
    c.appendChild(bp); c.appendChild(bv); c.appendChild(x);
  });
}
function resolverSalida(ev,modo){
  let txt="", tono="neutro";
  if(modo==="publica"){
    aplicarRep({publica:ri(2,6),prensa:ri(1,4)}); aplicarEfectos({moral:1});
    if(Math.random()<0.28){
      /* filtración: escándalo nocturno */
      aplicarRep({publica:-ri(6,12),credibilidad:-ri(2,6)}); aplicarGrupos({prensa:-6}); tono="malo";
      txt="Alguien te grabó y la salida terminó en portada. Escándalo nocturno servido.";
      if(typeof postProc==="function") postProc(elige(typeof HANDLES_PRENSA!=="undefined"?HANDLES_PRENSA:["@prensa"]),"prensa","🚨 El DT de "+E.clubNombre+" de fiesta hasta tarde. ¿Así se preparan los partidos?","malo");
    } else {
      tono="bueno";
      txt="Te vieron, te sacaron fotos y saliste bien parado. Buena imagen pública.";
      if(typeof postProc==="function") postProc(elige(typeof HANDLES_HINCHA!=="undefined"?HANDLES_HINCHA:["@hincha"]),"hincha","El DT haciéndola en la noche 😎 crack dentro y fuera de la cancha","bueno");
    }
  } else {
    const costo=ri(5,22);
    E.personal.bolsillo=Math.max(0,E.personal.bolsillo-costo);
    aplicarEfectos({moral:2}); tono="neutro";
    txt="Salida tranquila y sin cámaras. Te costó "+plata(costo)+" del bolsillo, pero la prensa ni se enteró.";
  }
  E.perfil.vidaSocial.agenda.unshift({t:ev.t,modo:modo,txt:txt,anio:E.anio});
  if(E.perfil.vidaSocial.agenda.length>20) E.perfil.vidaSocial.agenda.length=20;
  notificar({t:"Vida social: "+ev.t,tipo:tono,d:txt,bandeja:false});
  guardar(); cerrarModal(); render();
}

/* ---------- Dinastía: envejecer y suceder ---------- */
/* Se llama en nuevoAnio(): el DT envejece; puede retirarse/fallecer. */
function chequearSucesion(){
  if(!E.dinastia) return;
  const edad=edadDT();
  if(E.anio>E.dinastia.limiteAnio){ if(typeof finDeCarrera==="function") finDeCarrera("Se llegó al horizonte del año "+E.dinastia.limiteAnio+". La dinastía cierra su ciclo tras "+E.dinastia.generacion+" generaciones."); return; }
  let fin=false;
  if(edad>=90) fin=true;
  else if(edad>=74 && Math.random()<(edad-72)*0.045) fin=true;
  if(fin){
    E.dinastia.historial.push({generacion:E.dinastia.generacion,nombre:E.perfil.nombre,hasta:E.anio,edad:edad,titulos:(E.titulos||[]).length});
    E.dinastia.sucesionPendiente=true;
    guardar();
  }
}
function asumirSucesor(){
  const ape=apellidoDinastia();
  const nom=(typeof NOMBRES_PILA!=="undefined"?elige(NOMBRES_PILA):"Nuevo");
  const nuevoApe=ape||(typeof APELLIDOS!=="undefined"?elige(APELLIDOS):"Fútbol");
  E.dinastia.generacion++;
  E.perfil.nombre=nom+" "+nuevoApe;
  E.perfil.nacimiento=(E.anio-ri(28,34))+"-06-15";
  if(E.dinastia.linaje==="Tu linaje") E.dinastia.linaje="Familia "+nuevoApe;
  /* el patrimonio personal se hereda; el club sigue con su historia */
  notificar({t:"Nueva generación al mando",tipo:"neutro",
    d:E.perfil.nombre+" ("+relacionSucesor(E.dinastia.generacion)+") toma la conducción del club y de la "+E.dinastia.linaje+". El patrimonio y la historia se conservan.",bandeja:false});
  E.dinastia.sucesionPendiente=false;
  guardar(); render();
}
function pantallaSucesion(){
  const p=panel("Sucesión dinástica","⚱️","alerta");
  const ultimo=E.dinastia.historial[E.dinastia.historial.length-1]||{};
  p.cuerpo.appendChild(el("h2","tit","Se cierra una etapa"));
  p.cuerpo.appendChild(el("p",null,(ultimo.nombre||"El DT")+" deja la conducción a los "+(ultimo.edad||"")+" años, tras "+(ultimo.titulos||0)+" títulos. La "+E.dinastia.linaje+" no se detiene: alguien de la familia toma la posta."));
  const ape=apellidoDinastia();
  p.cuerpo.appendChild(fila("Linaje",E.dinastia.linaje));
  p.cuerpo.appendChild(fila("Nueva generación",relacionSucesor(E.dinastia.generacion+1)));
  p.cuerpo.appendChild(fila("Patrimonio heredado",plata(E.personal.bolsillo)+" + "+(E.personal.propiedades.length)+" propiedades"));
  const b=el("button","btn-aqua ancho verde","Asumir la conducción");
  b.onclick=asumirSucesor;
  p.cuerpo.appendChild(b);
  return p;
}

/* ============================================================
   UI · Perfil, Vida Social y Dinastía (Frutiger Aero)
   ============================================================ */
const AVATARES=["🧑‍💼","👩‍💼","🧔","👨‍🦱","👩‍🦰","🧑‍🦳","😎","🤵","👴","👵"];
function vistaVida(){
  const v=$("#vista");
  /* --- Perfil (aero-window) --- */
  const p=panel("Perfil del DT","🪪","agua");
  const win=el("div","aero-window");
  const av=el("button","aero-avatar",E.perfil.avatar||"🧑‍💼");
  av.title="Cambiar avatar";
  av.onclick=()=>{ const i=(AVATARES.indexOf(E.perfil.avatar)+1)%AVATARES.length; E.perfil.avatar=AVATARES[i]; guardar(); render(); };
  win.appendChild(av);
  const info=el("div","aero-info");
  const inNombre=el("input"); inNombre.className="entrada"; inNombre.value=E.perfil.nombre; inNombre.style.width="100%"; inNombre.placeholder="Tu nombre";
  inNombre.onchange=()=>{ E.perfil.nombre=inNombre.value.trim()||"DT"; guardar(); };
  info.appendChild(el("label","lb","Nombre"));
  info.appendChild(inNombre);
  const inNac=el("input"); inNac.type="date"; inNac.className="entrada"; inNac.value=(E.perfil.nacimiento||"1988-05-12"); inNac.style.width="100%";
  inNac.onchange=()=>{ if(inNac.value){ E.perfil.nacimiento=inNac.value; guardar(); render(); } };
  info.appendChild(el("label","lb","Fecha de nacimiento (edad "+edadDT()+")"));
  info.appendChild(inNac);
  const inOri=el("input"); inOri.className="entrada"; inOri.value=E.perfil.orientacion||"Libre"; inOri.style.width="100%"; inOri.placeholder="Libre";
  inOri.onchange=()=>{ E.perfil.orientacion=inOri.value.trim()||"Libre"; guardar(); };
  info.appendChild(el("label","lb","Orientación / estilo de vida"));
  info.appendChild(inOri);
  win.appendChild(info);
  p.cuerpo.appendChild(win);
  p.cuerpo.appendChild(fila("Bolsillo personal",plata(E.personal.bolsillo)));
  p.cuerpo.appendChild(fila("Dinastía",E.dinastia.linaje+" · "+relacionSucesor(E.dinastia.generacion)+" (gen. "+E.dinastia.generacion+")"));
  v.appendChild(p);

  /* --- Vida Social --- */
  const ps=panel("Vida social","🌙");
  ps.cuerpo.appendChild(el("p","mini","Salí a despejarte. En público subís prensa y popularidad, pero te podés filtrar. En privado gastás plata pero nadie te ve."));
  const bs=el("button","btn-aqua ancho verde","Salir esta semana");
  bs.onclick=salir;
  ps.cuerpo.appendChild(bs);
  if(E.perfil.vidaSocial.agenda.length){
    ps.cuerpo.appendChild(el("h3","sub","Agenda reciente"));
    E.perfil.vidaSocial.agenda.slice(0,8).forEach(a=>{
      const d=el("div","resul mitad");
      d.innerHTML="<b>"+a.t+"</b> <span class='mini'>· "+a.modo+" · "+a.anio+"</span><br>"+a.txt;
      ps.cuerpo.appendChild(d);
    });
  }
  v.appendChild(ps);

  /* --- Casino (Bloque 2) --- */
  if(typeof panelCasino==="function") v.appendChild(panelCasino());

  /* --- Dinastía --- */
  const pd=panel("Dinastía","👑","agua");
  pd.cuerpo.appendChild(el("p","mini","Tu carrera cruza generaciones hasta el año "+E.dinastia.limiteAnio+". Cuando el DT se retira o fallece, un familiar toma la posta y conserva el patrimonio y la historia."));
  pd.cuerpo.appendChild(fila("Generación actual",relacionSucesor(E.dinastia.generacion)+" (nº "+E.dinastia.generacion+")"));
  pd.cuerpo.appendChild(fila("Edad del DT",edadDT()+" años"));
  if(E.dinastia.historial.length){
    pd.cuerpo.appendChild(el("h3","sub","Generaciones anteriores"));
    E.dinastia.historial.forEach(h=>pd.cuerpo.appendChild(fila(relacionSucesor(h.generacion)+" · "+h.nombre,"hasta "+h.hasta+" · "+h.titulos+" títulos")));
  }
  v.appendChild(pd);
}
