"use strict";
/* ============================================================
   FUTBOLINI 5.0 · reputacion.js  (Bloque 1 · Vida 2.0)
   Perfil del DT (avatar orbe estilo MSN/Vista), Vida Social,
   Tinder/parejas (pool diverso y respetuoso), lujos, dinero
   personal que se mueve y Dinastía con nombre heredado.
   Todo ficción de juego, tono chileno pícaro. Sin burla a nadie.
   ============================================================ */

function edadDT(){
  const y=parseInt(String((E.perfil&&E.perfil.nacimiento)||"1988").slice(0,4),10)||1988;
  return Math.max(0, E.anio - y);
}
function apellidoDinastia(){
  const p=String((E.perfil&&E.perfil.nombre)||"DT").trim().split(/\s+/);
  return p.length>1?p[p.length-1]:"";
}
function relacionSucesor(gen){ return ["","fundador/a","hijo/a","nieto/a","bisnieto/a","tataranieto/a","chozno/a"][gen]||("generación "+gen); }
function romano(n){ const m=[[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]]; let r=""; for(let i=0;i<m.length;i++){ while(n>=m[i][0]){ r+=m[i][1]; n-=m[i][0]; } } return r; }
/* nombre heredado: Juan → Juan Jr. → Juan III → Juan IV … */
function nombreGeneracion(raiz,gen){ raiz=String(raiz||"DT").trim(); if(gen<=1) return raiz; if(gen===2) return raiz+" Jr."; return raiz+" "+romano(gen); }

/* dinero personal del DT: su sueldo del cargo (escala con prestigio y títulos) */
function ingresoPersonalSemanal(){
  if(!E.personal) return 0;
  if(E.flags.sinSueldoDT) return 0;
  const base=E.personal.sueldo||8;
  const extra=Math.round((E.ind.prestigio-50)*0.12 + (E.titulos?E.titulos.length:0)*1.2 + (E.dinastia?E.dinastia.generacion*0.5:0));
  return Math.max(2, base+extra);
}

/* ---------- avatares tipo MSN/Aero (esferas vidriosas 3D) ---------- */
const AVATARES=["😎","orb-azul","orb-verde","orb-celeste","orb-morado","orb-naranja","orb-rosa"];
const ORBES=["orb-azul","orb-verde","orb-celeste","orb-morado","orb-naranja","orb-rosa"];
function pintarAvatarBtn(btn,av){
  if(av==="😎"){ btn.className="aero-avatar"; btn.textContent="😎"; }
  else { btn.className="aero-avatar aero-orb "+(String(av).indexOf("orb-")===0?av:"orb-azul"); btn.textContent=""; }
}

/* ============================================================
   Vida social: salidas
   ============================================================ */
const SALIDAS=[
 {t:"Cita a ciegas",d:"Te armaron una cita a ciegas con alguien que jura ser primo de un seleccionado."},
 {t:"Carrete de farándula",d:"Evento de farándula donde nadie sabe de fútbol pero todos opinan del VAR."},
 {t:"Noche de boliche",d:"Salida nocturna que se estira. Mañana hay práctica con lentes de sol puestos."},
 {t:"Cumbia en un local del centro",d:"Baile hasta que cierren. Alguien te reconoce y te pide una foto a media pista."},
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
    c.appendChild(el("p","mini","Bolsillo personal: "+plata(E.personal.bolsillo)+(E.perfil.pareja?(" · en pareja con "+E.perfil.pareja.n):"")+"."));
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
    /* una pareja estable te da imagen sana y baja el riesgo de escándalo */
    const probFuga=E.perfil.pareja?0.14:0.28;
    if(Math.random()<probFuga){
      aplicarRep({publica:-ri(6,12),credibilidad:-ri(2,6)}); aplicarGrupos({prensa:-6}); tono="malo";
      txt="Alguien te grabó y la salida terminó en portada. Escándalo nocturno servido.";
      if(typeof postProc==="function") postProc(elige(typeof HANDLES_PRENSA!=="undefined"?HANDLES_PRENSA:["@prensa"]),"prensa","El DT de "+E.clubNombre+" de fiesta hasta tarde. ¿Así se preparan los partidos?","malo");
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

/* ============================================================
   Tinder / parejas · pool diverso, escrito con respeto
   (todos son personas reales del abanico; la picardía es pareja
    para todos, nadie es el chiste)
   ============================================================ */
const CANDIDATOS=[
 {n:"Javiera",edad:29,id:"",bio:"Bailarina de cumbia. Busca a alguien que no hable de fútbol 24/7… pero te va a tocar igual."},
 {n:"Camilo",edad:33,id:"",bio:"Ingeniero e hincha del rival. Amor prohibido a la vista, tribuna en contra."},
 {n:"Antonia",edad:27,id:"mujer trans",bio:"Diseñadora y reina indiscutida del karaoke. Directa, sin vueltas ni medias tintas."},
 {n:"Sol",edad:25,id:"persona no binaria",bio:"Fotógrafa. Colecciona plantas y malas decisiones. Le da exactamente igual quién ganó el clásico."},
 {n:"Maca",edad:31,id:"travesti",bio:"Artista de cabaret, leyenda de la noche santiaguina. Si te presentás, te presentás en serio."},
 {n:"Benja",edad:28,id:"hombre trans",bio:"Profe de historia. Hace un asado de campeonato y discute de táctica mejor que tu ayudante."},
 {n:"Fran",edad:34,id:"",bio:"Periodista deportiva. Peligrosa: todo lo que digas puede terminar en la portada del lunes."},
 {n:"Ignacia",edad:26,id:"",bio:"Estudiante de medicina. Aguanta poco el carrete y muchísimo el drama."},
 {n:"Nico",edad:30,id:"",bio:"DJ, vive de noche. Sospechosamente compatible con tu horario de conferencias de prensa."},
 {n:"Vale",edad:32,id:"",bio:"Empresaria. Te va a invitar a cenar «sin compromiso». Ya sabés cómo termina eso."},
 {n:"Renata",edad:24,id:"mujer trans",bio:"Tatuadora y coleccionista de camisetas viejas. Te va a pedir la del ascenso del 86."},
 {n:"Tomás",edad:29,id:"",bio:"Chef. Cocina como los dioses y celebra los goles con postre. Riesgo de subir de peso."},
 {n:"Ale",edad:35,id:"persona no binaria",bio:"Arquitecta. Seria, tranquila, y con una paciencia santa para bancar tus malas rachas."},
 {n:"Pau",edad:27,id:"",bio:"Enfermera del turno noche. Los dos duermen de día: alma gemela horaria."},
 {n:"Coni",edad:30,id:"",bio:"Abogada. Si te metés en un lío dirigencial, mejor tenerla de tu lado que enfrente."},
 {n:"Dani",edad:23,id:"hombre trans",bio:"Estudiante de cine, sueña con dirigir el documental de tu dinastía. Optimista incurable."}
];
/* género aproximado del candidato (para el filtro de orientación) */
function generoCandidato(c){
  const id=(c.id||"").toLowerCase();
  if(id.indexOf("no binaria")>=0||id.indexOf("travesti")>=0) return "X";
  if(id.indexOf("mujer")>=0) return "F";
  if(id.indexOf("hombre")>=0) return "M";
  return (["Javiera","Fran","Ignacia","Vale","Pau","Coni"].indexOf(c.n)>=0)?"F":"M";
}
function candidatoPasaFiltro(c){
  const o=E.perfil.orientacion||"Libre", g=E.perfil.genero||"M", cg=generoCandidato(c);
  if(o==="Bi"||o==="Libre") return true;
  if(cg==="X") return true;               /* diverso aparece para todos */
  if(o==="Hetero") return cg!==g;
  if(o==="Gay") return cg===g;
  return true;
}
function generarTinder(){
  let pool=CANDIDATOS.filter(candidatoPasaFiltro);
  if(pool.length<3) pool=CANDIDATOS.slice();   /* fallback si el filtro deja pocos */
  return mezcla(pool).slice(0,6).map(c=>Object.assign({},c,{orb:elige(ORBES),afin:(Math.random()*0.25)}));
}
function modalTinder(){
  const cartas=generarTinder(); let i=0;
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">💘</span><span>Match · buscar pareja</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      if(E.perfil.pareja) c.appendChild(el("div","resul mitad","Estás en pareja con <b>"+E.perfil.pareja.n+"</b>. Coquetear por acá es jugar con fuego 🔥"));
      if(i>=cartas.length){
        c.appendChild(el("p","mini","No hay más perfiles por hoy. Volvé otra semana."));
        const x=el("button","btn-aqua ancho gris","Cerrar"); x.onclick=()=>{ cerrarModal(); render(); }; c.appendChild(x);
        return;
      }
      const cand=cartas[i];
      const card=el("div","tinder-card");
      card.innerHTML='<span class="aero-orb '+cand.orb+' orb-grande"></span>'+
        '<h3 class="tit centro" style="margin:6px 0 0">'+cand.n+", "+cand.edad+"</h3>"+
        (cand.id?'<div class="mini centro">'+cand.id+'</div>':'')+
        '<p style="margin-top:6px">'+cand.bio+'</p>';
      c.appendChild(card);
      const row=el("div","tinder-acc");
      const bp=el("button","btn-aqua ancho gris","✕ Paso"); bp.onclick=()=>{ i++; pintar(); };
      const bl=el("button","btn-aqua ancho verde","❤ Me gusta"); bl.onclick=()=>{ likeCandidato(cand); i++; pintar(); };
      row.appendChild(bp); row.appendChild(bl); c.appendChild(row);
      const x=el("button","btn-aqua ancho","Cerrar Tinder"); x.style.marginTop="6px"; x.onclick=()=>{ cerrarModal(); render(); }; c.appendChild(x);
    };
    pintar();
  });
}
function likeCandidato(cand){
  const prob=clamp(0.4+E.rep.publica/220+(cand.afin||0),0.15,0.92);
  if(Math.random()<prob){
    if(!E.perfil.tinder.matches.some(m=>m.n===cand.n))
      E.perfil.tinder.matches.unshift({n:cand.n,id:cand.id,bio:cand.bio,orb:cand.orb,afin:cand.afin||0,anio:E.anio});
    aplicarEfectos({moral:1});
    notificar({t:"¡Match con "+cand.n+"!",tipo:"bueno",d:"Hubo match. Podés invitarle a salir desde la sección Vida.",bandeja:false});
    if(typeof postProc==="function" && Math.random()<0.25) postProc(elige(typeof HANDLES_HINCHA!=="undefined"?HANDLES_HINCHA:["@hincha"]),"hincha","dicen que el DT anda en algo con alguien 👀 la novela sigue","neutro");
  } else {
    if(typeof aviso==="function") aviso("Sin match con "+cand.n+"… por ahora");
  }
  guardar();
}
function invitarSalir(match){
  const costo=ri(10,40); E.personal.bolsillo=Math.max(0,E.personal.bolsillo-costo);
  if(E.perfil.pareja){
    if(Math.random()<0.5){
      aplicarRep({publica:-ri(6,14),credibilidad:-ri(2,6)}); aplicarGrupos({prensa:-8}); aplicarEfectos({moral:-4});
      notificar({t:"Escándalo: infidelidad en portada",tipo:"malo",d:"Te pillaron saliendo con "+match.n+" teniendo pareja. La farándula hace fiesta y tu imagen paga el pato.",bandeja:false});
      if(typeof postProc==="function") postProc(elige(typeof HANDLES_PRENSA!=="undefined"?HANDLES_PRENSA:["@prensa"]),"prensa","BOMBA: el DT de "+E.clubNombre+" en pleno affaire. Se filtró todo.","malo");
    } else { aplicarEfectos({moral:2});
      notificar({t:"Salida discreta",tipo:"neutro",d:"Saliste con "+match.n+" sin que nadie se enterara. Peligroso, pero zafaste.",bandeja:false}); }
  } else {
    const prob=clamp(0.42+(match.afin||0)+E.rep.publica/300,0.2,0.85);
    if(Math.random()<prob){
      E.perfil.pareja={n:match.n,id:match.id,orb:match.orb,desde:E.anio,nivel:65,casades:false};
      E.perfil.tinder.matches=E.perfil.tinder.matches.filter(m=>m.n!==match.n);
      aplicarEfectos({moral:6});
      notificar({t:"¡De novios con "+match.n+"!",tipo:"bueno",d:"La cita salió redonda: ahora son pareja. Una relación estable te da paz y menos riesgo de escándalo.",bandeja:false});
    } else { aplicarEfectos({moral:1});
      notificar({t:"Linda cita con "+match.n,tipo:"neutro",d:"La pasaron bien, pero quedó ahí. A veces es solo una linda noche.",bandeja:false}); }
  }
  guardar(); render();
}
function romperPareja(){
  if(!E.perfil.pareja) return;
  const p=E.perfil.pareja; E.perfil.pareja=null;
  aplicarEfectos({moral:-4});
  notificar({t:"Se terminó con "+p.n,tipo:"malo",d:"Ruptura. Duele un poco y el ánimo lo siente, pero la vida sigue.",bandeja:false});
  guardar(); render();
}

/* ============================================================
   Lujos: propiedades y autos (mueven el bolsillo, dan estatus)
   ============================================================ */
/* Lujos que ESCALAN con el tamaño del club: mientras más prestigio, más
   excesos absurdos se te habilitan. req = prestigio mínimo para poder comprarlo. */
const LUJOS=[
 /* --- accesibles siempre --- */
 {t:"Reloj de colección",tipo:"prop",costo:25,ef:{prestigio:1},d:"Un detalle que grita plata sin decir una palabra."},
 {t:"Camioneta 4x4",tipo:"auto",costo:35,ef:{prestigio:1},d:"Discreta, cómoda, sin escándalo."},
 {t:"Parcela de agrado en el sur",tipo:"prop",costo:45,ef:{moral:3},d:"Para desconectarse del ruido dirigencial."},
 {t:"Auto deportivo",tipo:"auto",costo:50,ef:{prestigio:2,riesgo:4},d:"Ruge en la salida del estadio. La prensa lo va a fotografiar."},
 {t:"Departamento en Vitacura",tipo:"prop",costo:60,ef:{prestigio:2},d:"Piso alto, vista a la cordillera. Estatus puro."},
 /* --- club mediano (prestigio ≥ 55): ya sos alguien --- */
 {t:"Palco VIP vitalicio",tipo:"prop",costo:80,req:55,ef:{prestigio:3},d:"Ves los partidos con champaña mientras la platea putea. Pura vida."},
 {t:"Yate en Algarrobo",tipo:"prop",costo:110,req:55,ef:{prestigio:3,riesgo:5},d:"Fotos en la revista del domingo garantizadas. La hinchada murmura."},
 {t:"Cava con sommelier de planta",tipo:"prop",costo:70,req:55,ef:{moral:4},d:"Un tipo cuyo único trabajo es decidir qué tomás. Absurdo y delicioso."},
 /* --- club grande (prestigio ≥ 70): el exceso ya es un deporte --- */
 {t:"Helicóptero para ir a los partidos",tipo:"auto",costo:220,req:70,ef:{prestigio:5,riesgo:8},d:"Llegás por el aire mientras el plantel viene en bus. Nada sutil."},
 {t:"Colección de autos clásicos",tipo:"auto",costo:180,req:70,ef:{prestigio:4},d:"Un galpón lleno de fierros que nunca vas a manejar. Perfecto."},
 {t:"Chef privado y nutricionista de lujo",tipo:"prop",costo:120,req:70,ef:{moral:5,prestigio:2},d:"Comés mejor que tus delanteros. Y se nota."},
 /* --- club enorme (prestigio ≥ 85): territorio de magnate delirante --- */
 {t:"Isla privada en el Pacífico",tipo:"prop",costo:400,req:85,ef:{prestigio:8,riesgo:6},d:"Tu propio pedazo de mundo. Ya no sos DT, sos un villano de James Bond."},
 {t:"Un tigre de mascota",tipo:"prop",costo:150,req:85,ef:{prestigio:4,riesgo:14},d:"Como cierto dueño de club. La comunidad y la SAG NO están felices."},
 {t:"Estatua tuya afuera del estadio",tipo:"prop",costo:300,req:85,ef:{prestigio:10,riesgo:10},d:"Te mandaste a hacer un monumento a vos mismo, en vida. La modestia murió."},
 {t:"Cohete privado para la pretemporada",tipo:"auto",costo:600,req:92,ef:{prestigio:14,riesgo:12},d:"Gira de pretemporada… en órbita. El delirio total. La ANFP no sabe ni qué decir."}
];
function comprarLujo(l){
  if(l.req && (E.ind.prestigio||0)<l.req){ if(typeof aviso==="function") aviso("Todavía no tenés el nivel de club para eso (prestigio "+l.req+")"); return; }
  if(E.personal.bolsillo<l.costo){ if(typeof aviso==="function") aviso("No te alcanza el bolsillo ("+plata(l.costo)+")"); return; }
  E.personal.bolsillo-=l.costo;
  if(l.ef) aplicarEfectos(l.ef);
  (l.tipo==="auto"?E.personal.autos:E.personal.propiedades).push({t:l.t,anio:E.anio});
  notificar({t:"Te diste un lujo: "+l.t,tipo:"neutro",d:l.d+" Costó "+plata(l.costo)+" de tu bolsillo.",bandeja:false});
  guardar(); render();
}

/* ============================================================
   Dinastía: retiro por edad (NO muerte) y sucesión con nombre heredado
   ============================================================ */
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
  E.dinastia.generacion++;
  const gen=E.dinastia.generacion;
  /* el heredero es tu hijo mayor si tuviste familia; si no, la sangre nueva del linaje */
  const hijo=(E.perfil.hijos&&E.perfil.hijos.length)?E.perfil.hijos[0]:null;
  E.perfil.nombre = hijo ? hijo.nombre : nombreGeneracion(E.dinastia.raiz, gen);
  E.perfil.nacimiento=(E.anio-ri(28,34))+"-06-15";
  if(E.dinastia.linaje==="Tu linaje"){ const ape=apellidoDinastia(); E.dinastia.linaje="Familia "+(ape||E.dinastia.raiz); }
  E.perfil.pareja=null; E.perfil.tinder={matches:[]}; E.perfil.hijos=[]; E.perfil.bienestar=72;
  let extra="";
  if(hijo){ E.capital=Math.min(200,(E.capital||0)+6); aplicarRep({publica:4}); extra=" Criado dentro del club, llega con respaldo y capital institucional."; }
  notificar({t:"Nueva generación al mando",tipo:"neutro",
    d:(hijo?"Tu "+relacionSucesor(gen)+" ":"")+E.perfil.nombre+" toma la posta de la "+E.dinastia.linaje+". Hereda el patrimonio y la historia; el club sigue su curso."+extra,bandeja:false});
  E.dinastia.sucesionPendiente=false;
  guardar(); render();
}
function pantallaSucesion(){
  const p=panel("Relevo generacional","🔄","alerta");
  const ultimo=E.dinastia.historial[E.dinastia.historial.length-1]||{};
  p.cuerpo.appendChild(el("h2","tit","Se retira una generación"));
  p.cuerpo.appendChild(el("p",null,(ultimo.nombre||"El DT")+" se retira por edad a los "+(ultimo.edad||"")+" años, tras "+(ultimo.titulos||0)+" títulos. La "+E.dinastia.linaje+" no se detiene: la sangre nueva toma la posta."));
  const hijo=(E.perfil.hijos&&E.perfil.hijos.length)?E.perfil.hijos[0]:null;
  const prox=hijo?hijo.nombre:nombreGeneracion(E.dinastia.raiz, E.dinastia.generacion+1);
  p.cuerpo.appendChild(fila("Linaje",E.dinastia.linaje));
  p.cuerpo.appendChild(fila("Al mando ahora",prox+" · "+relacionSucesor(E.dinastia.generacion+1)+(hijo?" (tu hijo, criado en el club)":"")));
  p.cuerpo.appendChild(fila("Patrimonio heredado",plata(E.personal.bolsillo)+" + "+(E.personal.propiedades.length)+" propiedades + "+(E.personal.autos.length)+" autos"));
  const b=el("button","btn-aqua ancho verde",(hijo?"Que tome el cargo "+hijo.nombre:"Asumir la sangre"));
  b.onclick=()=>elegirSucesor("hijo");
  p.cuerpo.appendChild(b);
  const be=el("button","btn-aqua ancho","Traer un DT de afuera");
  be.style.marginTop="6px"; be.onclick=()=>elegirSucesor("externo");
  p.cuerpo.appendChild(be);
  p.cuerpo.appendChild(el("p","mini","El de afuera no hereda el nombre. El club sigue; la familia cede el escritorio."));
  return p;
}

/* ============================================================
   UI · Vida (Perfil, Social, Tinder, Lujos, Casino, Dinastía)
   ============================================================ */
function vistaVida(){
  const v=$("#vista");
  /* --- Perfil (aero-window) --- */
  const p=panel("Perfil del DT","🪪","agua");
  const win=el("div","aero-window");
  const av=el("button","aero-avatar"); av.title="Cambiar avatar (estilo MSN)";
  pintarAvatarBtn(av, E.perfil.avatar);
  if(E.perfil.avatarImg){ av.textContent=""; av.style.backgroundImage="url("+E.perfil.avatarImg+")"; av.style.backgroundSize="cover"; av.style.backgroundPosition="center"; }
  av.onclick=()=>{ if(E.perfil.avatarImg) return; const i=(AVATARES.indexOf(E.perfil.avatar)+1)%AVATARES.length; E.perfil.avatar=AVATARES[i]; guardar(); render(); };
  win.appendChild(av);
  const info=el("div","aero-info");
  const inNombre=el("input"); inNombre.className="entrada"; inNombre.value=E.perfil.nombre; inNombre.style.width="100%"; inNombre.placeholder="Tu nombre";
  inNombre.onchange=()=>{ const val=inNombre.value.trim()||"DT"; E.perfil.nombre=val; if(E.dinastia.generacion<=1) E.dinastia.raiz=val; guardar(); };
  info.appendChild(el("label","lb","Nombre"+(E.dinastia.generacion>1?" (heredado)":"")));
  info.appendChild(inNombre);
  const inNac=el("input"); inNac.type="date"; inNac.className="entrada"; inNac.value=(E.perfil.nacimiento||"1988-05-12"); inNac.style.width="100%";
  inNac.onchange=()=>{ if(inNac.value){ E.perfil.nacimiento=inNac.value; guardar(); render(); } };
  info.appendChild(el("label","lb","Fecha de nacimiento (edad "+edadDT()+")"));
  info.appendChild(inNac);
  info.appendChild(el("label","lb","Género"));
  const fg=el("div","fichas");
  [["M","Hombre"],["F","Mujer"]].forEach(([k,n])=>{
    const b=el("button","ficha",n); b.setAttribute("aria-pressed",(E.perfil.genero||"M")===k?"true":"false");
    b.onclick=()=>{ E.perfil.genero=k; guardar(); render(); }; fg.appendChild(b);
  });
  info.appendChild(fg);
  info.appendChild(el("label","lb","Orientación (filtra el Match)"));
  const fo=el("div","fichas");
  ["Hetero","Gay","Bi","Libre"].forEach(k=>{
    const b=el("button","ficha",k); b.setAttribute("aria-pressed",(E.perfil.orientacion||"Libre")===k?"true":"false");
    b.onclick=()=>{ E.perfil.orientacion=k; guardar(); render(); }; fo.appendChild(b);
  });
  info.appendChild(fo);
  win.appendChild(info);
  p.cuerpo.appendChild(win);
  p.cuerpo.appendChild(fila("Bolsillo personal",plata(E.personal.bolsillo)));
  p.cuerpo.appendChild(fila("Sueldo del cargo","+"+plata(ingresoPersonalSemanal())+" por semana"));
  p.cuerpo.appendChild(fila("Pareja",E.perfil.pareja?(E.perfil.pareja.n+" (desde "+E.perfil.pareja.desde+")"):"soltero"));
  p.cuerpo.appendChild(fila("Dinastía",E.dinastia.linaje+" · "+relacionSucesor(E.dinastia.generacion)+" (gen. "+E.dinastia.generacion+")"));
  /* bienestar / estrés */
  const bien=E.perfil.bienestar||70;
  p.cuerpo.appendChild(el("div",null,'<div class="fila" style="border:none;padding:2px 0"><span>Bienestar '+(bien<30?"(quemado 🥵)":bien<55?"(cansado)":"(pleno)")+'</span><b>'+Math.round(bien)+'/100</b></div>'+barrita(bien,bien>55?"#4fbf3f":(bien>30?"#e0a92a":"#c9392c"))));
  const bresp=el("button","btn-aqua chico","🏝️ Tomarse un respiro"); bresp.onclick=tomarRespiro;
  p.cuerpo.appendChild(bresp);
  /* subir tu propia foto de avatar (se achica a 96px para no pesar en el guardado) */
  const upWrap=el("div"); upWrap.style.marginTop="6px";
  const fileIn=el("input"); fileIn.type="file"; fileIn.accept="image/*"; fileIn.style.display="none";
  fileIn.onchange=()=>{ const f=fileIn.files&&fileIn.files[0]; if(!f) return;
    const rd=new FileReader(); rd.onload=e=>{ const img=new Image(); img.onload=()=>{
      const c=document.createElement("canvas"); c.width=c.height=96; const g=c.getContext("2d");
      const s=Math.min(img.width,img.height); g.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,96,96);
      try{ E.perfil.avatarImg=c.toDataURL("image/jpeg",0.82); guardar(); render(); aviso("Foto de perfil actualizada"); }
      catch(err){ aviso("No se pudo procesar la imagen"); } }; img.src=e.target.result; }; rd.readAsDataURL(f); };
  const bUp=el("button","btn-aqua chico","📷 Subir foto"); bUp.style.marginLeft="6px"; bUp.onclick=()=>fileIn.click();
  upWrap.appendChild(bUp); upWrap.appendChild(fileIn);
  if(E.perfil.avatarImg){ const bx=el("button","btn-aqua chico gris","Quitar foto"); bx.style.marginLeft="6px"; bx.onclick=()=>{ delete E.perfil.avatarImg; guardar(); render(); }; upWrap.appendChild(bx); }
  p.cuerpo.appendChild(upWrap);
  v.appendChild(p);

  /* --- Changas honestas: ganar plata sin depender del casino --- */
  const pin=panel("Changas honestas","💼","agua");
  pin.cuerpo.appendChild(el("p","mini","Plata honesta para tu bolsillo, aparte del sueldo. Cada una se puede hacer una vez por semana; algunas piden que tengas nombre (imagen pública)."));
  const CHANGAS=[
    {id:"columna",t:"Columna en un diario",d:"Escribís de fútbol. Pagan poco, pero es fijo.",pago:[3,8],req:0},
    {id:"clinica",t:"Clínica de fútbol para chicos",d:"Un día enseñando. Suma cariño de la comunidad y algo de plata.",pago:[5,12],req:0},
    {id:"charla",t:"Charla motivacional en una empresa",d:"Liderazgo y trabajo en equipo. Buena plata por un rato.",pago:[10,22],req:35},
    {id:"tv",t:"Comentar un partido en la tele",d:"Panelista por una noche. Necesitás algo de figura.",pago:[7,16],req:40},
    {id:"publicidad",t:"Publicidad de una marca",d:"Prestás tu cara. Cuanto más conocido, más pagan.",pago:[12,28],req:55}
  ];
  CHANGAS.forEach(ch=>{
    const hecha=E.flags["changa_"+ch.id]===(E.anio+"-"+E.idx);   /* 6.25 · fix: keyear por año+idx (antes colisionaba en el 2do año) */
    const faltaFama=(E.rep.publica||50)<ch.req;
    const d=el("div","resul mitad");
    d.innerHTML="<b>"+ch.t+"</b><br><span class='mini'>"+ch.d+(ch.req?" · pide "+ch.req+" de imagen pública":"")+"</span>";
    const b=el("button","btn-aqua chico"+(hecha||faltaFama?" gris":" verde"), hecha?"Ya lo hiciste esta semana":(faltaFama?"Te falta figura":"Aceptar")); b.style.marginTop="5px";
    b.disabled=hecha||faltaFama;
    b.onclick=()=>{
      const pago=ri(ch.pago[0],ch.pago[1]); E.personal.bolsillo+=pago; E.flags["changa_"+ch.id]=(E.anio+"-"+E.idx);
      if(ch.id==="clinica") aplicarGrupos({comunidad:3});
      if(ch.id==="tv"||ch.id==="publicidad") aplicarRep({publica:2});
      if(typeof recordar==="function"&&pago>=15) recordar("changa","te hiciste unos pesos: "+ch.t.toLowerCase(),{peso:"bajo"});
      guardar(); render(); aviso("💵 +"+plata(pago)+" al bolsillo");
    };
    d.appendChild(b);
    pin.cuerpo.appendChild(d);
  });
  v.appendChild(pin);

  /* --- Vida Social --- */
  const ps=panel("Vida social","🌙");
  ps.cuerpo.appendChild(el("p","mini","Salí a despejarte. En público subís prensa y popularidad, pero te podés filtrar. En privado gastás plata pero nadie te ve. Una pareja estable baja el riesgo de escándalo."));
  const bs=el("button","btn-aqua ancho verde","Salir esta semana"); bs.onclick=salir;
  ps.cuerpo.appendChild(bs);
  if(E.perfil.vidaSocial.agenda.length){
    ps.cuerpo.appendChild(el("h3","sub","Agenda reciente"));
    E.perfil.vidaSocial.agenda.slice(0,6).forEach(a=>{
      const d=el("div","resul mitad");
      d.innerHTML="<b>"+a.t+"</b> <span class='mini'>· "+a.modo+" · "+a.anio+"</span><br>"+a.txt;
      ps.cuerpo.appendChild(d);
    });
  }
  v.appendChild(ps);

  /* --- Tinder / parejas --- */
  const pt=panel("Vida amorosa","💘","agua");
  if(E.perfil.pareja){
    const par=E.perfil.pareja; const niv=par.nivel||65;
    const d=el("div","resul "+(niv>=50?"bien":"mal"));
    d.innerHTML='<span class="aero-orb '+(par.orb||"orb-rosa")+' orb-chico"></span> <b>'+par.n+'</b>'+(par.id?" <span class='mini'>("+par.id+")</span>":"")+
      (par.casades?" 💍":"")+"<br>"+(par.casades?"Casades":"En pareja")+" desde "+par.desde+". "+
      (niv<30?"La relación está en crisis: si no la cuidás, se termina.":niv<55?"La relación necesita atención.":"Relación sólida: menos escándalos, más paz.")+
      '<div style="margin-top:4px"><span class="mini">Relación</span>'+barrita(niv,niv>50?"#e0563f":"#c9392c")+'</div>';
    pt.cuerpo.appendChild(d);
    const bc=el("button","btn-aqua chico verde","💕 Cita romántica"); bc.onclick=citaConPareja; pt.cuerpo.appendChild(bc);
    if(!par.casades){ const bm=el("button","btn-aqua chico"); bm.textContent="💍 Casarse"; bm.style.marginLeft="6px"; bm.onclick=casarse; pt.cuerpo.appendChild(bm); }
    if(E.perfil.hijos.length<4){ const bh=el("button","btn-aqua chico"); bh.textContent="👶 Tener un hijo"; bh.style.marginLeft="6px"; bh.onclick=tenerHijo; pt.cuerpo.appendChild(bh); }
    const br=el("button","btn-aqua chico rojo","Terminar"); br.style.marginLeft="6px"; br.onclick=romperPareja; pt.cuerpo.appendChild(br);
  } else {
    pt.cuerpo.appendChild(el("p","mini","Soltere y a la búsqueda. Deslizá en el Match: si hay química, después le invitás a salir."));
  }
  /* hijos (futura dinastía) */
  if(E.perfil.hijos && E.perfil.hijos.length){
    pt.cuerpo.appendChild(el("h3","sub","Familia"));
    E.perfil.hijos.forEach(h=>{
      const ed=typeof edadHijo==="function"?edadHijo(h):(E.anio-h.nacido);
      const extra=(E.perfil.hijos[0]===h?" · heredero":"")+(h.enPlantel?" · en el plantel":"");
      pt.cuerpo.appendChild(fila("👶 "+h.nombre,ed+" años · nacido "+h.nacido+extra));
      if(ed>=17 && !h.enPlantel){
        const bh=el("button","btn-aqua chico","Firmarlo en cantera");
        bh.onclick=()=>incorporarHijoCantera(h);
        pt.cuerpo.appendChild(bh);
      }
    });
  }
  const bt=el("button","btn-aqua ancho verde","💘 Abrir Match (Tinder)"); bt.style.marginTop="6px"; bt.onclick=modalTinder;
  pt.cuerpo.appendChild(bt);
  const ms=E.perfil.tinder.matches||[];
  if(ms.length){
    pt.cuerpo.appendChild(el("h3","sub","Tus matches"));
    ms.slice(0,8).forEach(m=>{
      const row=el("div","fila");
      row.innerHTML='<span><span class="aero-orb '+(m.orb||"orb-azul")+' orb-chico"></span> '+m.n+(m.id?" <span class='mini'>("+m.id+")</span>":"")+'</span>';
      const b=el("button","btn-aqua chico","Charlar"); b.onclick=()=>chatMatch(m);
      row.appendChild(b); pt.cuerpo.appendChild(row);
    });
  }
  v.appendChild(pt);

  /* --- Lujos (escalan con el tamaño del club) --- */
  const pl=panel("Lujos y patrimonio","💎");
  pl.cuerpo.appendChild(el("p","mini","Gastá tu plata personal en estatus. Mientras más grande el club, más delirante lo que se te habilita. Bolsillo: <b>"+plata(E.personal.bolsillo)+"</b> · prestigio del club: <b>"+Math.round(E.ind.prestigio)+"</b>."));
  LUJOS.forEach(l=>{
    const bloqueado=l.req && (E.ind.prestigio||0)<l.req;
    const b=el("button","op"+(bloqueado?" op-bloqueado":""));
    b.innerHTML='<div class="t">'+(bloqueado?"🔒 ":"")+l.t+' <span class="mini">· '+plata(l.costo)+'</span></div>'+
      '<div class="d">'+(bloqueado?"Necesitás un club con prestigio ≥ "+l.req+" para darte este gusto.":l.d)+'</div>';
    b.disabled=bloqueado;
    if(!bloqueado) b.onclick=()=>comprarLujo(l);
    pl.cuerpo.appendChild(b);
  });
  const tengo=(E.personal.propiedades.length+E.personal.autos.length);
  if(tengo) pl.cuerpo.appendChild(el("p","mini","Tenés "+E.personal.propiedades.length+" propiedades y "+E.personal.autos.length+" autos."));
  v.appendChild(pl);

  /* --- Casino (Bloque 2) --- */
  if(typeof panelCasino==="function") v.appendChild(panelCasino());

  /* --- Dinastía --- */
  const pd=panel("Dinastía","👑","agua");
  pd.cuerpo.appendChild(el("p","mini","Tu carrera cruza generaciones hasta el año "+E.dinastia.limiteAnio+". Cuando el DT se retira por edad (no muere), un familiar toma la posta con tu nombre heredado (Jr., III, IV…) y conserva patrimonio e historia."));
  pd.cuerpo.appendChild(fila("Generación actual",relacionSucesor(E.dinastia.generacion)+" (nº "+E.dinastia.generacion+")"));
  pd.cuerpo.appendChild(fila("Edad del DT",edadDT()+" años"));
  pd.cuerpo.appendChild(fila("Próximo heredero",nombreGeneracion(E.dinastia.raiz, E.dinastia.generacion+1)));
  if(E.dinastia.historial.length){
    pd.cuerpo.appendChild(el("h3","sub","Generaciones anteriores"));
    E.dinastia.historial.forEach(h=>pd.cuerpo.appendChild(fila(relacionSucesor(h.generacion)+" · "+h.nombre,"hasta "+h.hasta+" · "+h.titulos+" títulos")));
  }
  v.appendChild(pd);
}

/* ============================================================
   5.0 · Vida 3.0 — relación que evoluciona, familia, bienestar
   y eventos de vida personales (más profundo que cualquier manager)
   ============================================================ */
function citaConPareja(){
  if(!E.perfil.pareja) return;
  E.perfil.pareja.semanasSinCita=0;
  if(Math.random()<0.62 && typeof dilemaCita==="function"){ dilemaCita(); return; }
  const costo=ri(8,30); E.personal.bolsillo=Math.max(0,E.personal.bolsillo-costo);
  E.perfil.pareja.nivel=clamp((E.perfil.pareja.nivel||65)+15,0,100);
  aplicarEfectos({moral:3}); E.perfil.bienestar=clamp((E.perfil.bienestar||70)+6,0,100);
  notificar({t:"Cita con "+E.perfil.pareja.n,tipo:"bueno",d:"Una noche linda: la relación se fortalece y recargás energía. Costó "+plata(costo)+".",bandeja:false});
  guardar(); render();
}
function casarse(){
  if(!E.perfil.pareja || E.perfil.pareja.casades) return;
  if((E.perfil.pareja.nivel||0)<60){ if(typeof aviso==="function") aviso("La relación aún no está para tanto: fortalecela con citas."); return; }
  const costo=ri(25,70);
  if(E.personal.bolsillo<costo){ if(typeof aviso==="function") aviso("No te alcanza para el casorio ("+plata(costo)+")"); return; }
  E.personal.bolsillo-=costo; E.perfil.pareja.casades=true; E.perfil.pareja.nivel=clamp(E.perfil.pareja.nivel+15,0,100);
  aplicarEfectos({moral:8}); aplicarRep({publica:5}); E.perfil.bienestar=clamp((E.perfil.bienestar||70)+10,0,100);
  notificar({t:"Te casaste con "+E.perfil.pareja.n,tipo:"bueno",d:"Bodón del año. La relación se afianza (se enfría más lento) y tu imagen pública lo agradece.",bandeja:false});
  if(typeof postProc==="function") postProc(elige(typeof HANDLES_PRENSA!=="undefined"?HANDLES_PRENSA:["@prensa"]),"prensa","El DT de "+E.clubNombre+" pasó por el altar. Farándula en fiesta.","bueno");
  guardar(); render();
}
function tenerHijo(){
  if(!E.perfil.pareja){ if(typeof aviso==="function") aviso("Primero necesitás pareja."); return; }
  if((E.perfil.pareja.nivel||0)<55){ if(typeof aviso==="function") aviso("La relación necesita estar más sólida para dar ese paso."); return; }
  if(E.perfil.hijos.length>=4){ if(typeof aviso==="function") aviso("Ya tenés una familia numerosa."); return; }
  const costo=ri(10,30); E.personal.bolsillo=Math.max(0,E.personal.bolsillo-costo);
  var nombre;
  if(E.perfil.hijos.length===0) nombre=nombreGeneracion(E.dinastia.raiz, E.dinastia.generacion+1);
  else { const nom=(typeof NOMBRES_PILA!=="undefined")?elige(NOMBRES_PILA):"Nuevo"; nombre=nom+" "+(apellidoDinastia()||E.dinastia.raiz); }
  E.perfil.hijos.push({nombre:nombre,nacido:E.anio});
  aplicarEfectos({moral:5}); E.perfil.bienestar=clamp((E.perfil.bienestar||70)+8,0,100);
  E.perfil.pareja.nivel=clamp(E.perfil.pareja.nivel+8,0,100);
  notificar({t:"Nació "+nombre,tipo:"bueno",d:"Sumás un integrante a la familia. El día de mañana podría tomar la posta de la dinastía. Costó "+plata(costo)+" y te llena el alma.",bandeja:false});
  guardar(); render();
}
function tomarRespiro(){
  const costo=ri(15,40);
  if(E.personal.bolsillo<costo){ if(typeof aviso==="function") aviso("No te alcanza para el respiro ("+plata(costo)+")"); return; }
  E.personal.bolsillo-=costo; E.perfil.bienestar=clamp((E.perfil.bienestar||70)+22,0,100); aplicarEfectos({moral:2});
  notificar({t:"Te tomaste un respiro",tipo:"bueno",d:"Unos días para vos: bajás el estrés y volvés con la cabeza fresca. Costó "+plata(costo)+".",bandeja:false});
  guardar(); render();
}
/* eventos de vida personales (procedurales) */
const VIDA_PROC=[
 {t:"Un viejo amigo te pide plata",d:"Un amigo de toda la vida te pide un préstamo para salir de un apuro.",
  op:[
   {t:"Prestarle sin dudar",run:function(){ const m=ri(20,50); E.personal.bolsillo=Math.max(0,E.personal.bolsillo-m); aplicarEfectos({moral:3}); return "Le prestaste "+plata(m)+". Los amigos son los amigos."; }},
   {t:"Ayudarlo con la mitad",run:function(){ const m=ri(10,25); E.personal.bolsillo=Math.max(0,E.personal.bolsillo-m); return "Le diste una mano parcial ("+plata(m)+")."; }},
   {t:"Decirle que no",run:function(){ E.perfil.bienestar=clamp((E.perfil.bienestar||70)-4,0,100); return "Le dijiste que no. Quedó raro, pero es tu plata."; }}
  ]},
 {t:"Reaparece un amor del pasado",d:"Un ex de otra época te escribe de la nada. La nostalgia golpea.",
  op:[
   {t:"Reconectar o cerrar la puerta",run:function(){ if(E.perfil.pareja){ E.perfil.pareja.nivel=clamp((E.perfil.pareja.nivel||65)+8,0,100); aplicarEfectos({moral:2}); return "Cerraste la puerta por respeto a tu pareja. Lo valora."; } aplicarEfectos({moral:3}); E.perfil.bienestar=clamp((E.perfil.bienestar||70)+6,0,100); return "Sin pareja, reconectaron. La ilusión revive."; }},
   {t:"Dejarlo en visto",run:function(){ return "Ni fu ni fa. La vida sigue."; }}
  ]},
 {t:"Los paparazzi te persiguen",d:"Un fotógrafo te sigue buscando la nota del fin de semana.",
  op:[
   {t:"Sonreír y posar",run:function(){ aplicarRep({publica:5,prensa:3}); return "Saliste simpático en las fotos. Buena prensa."; }},
   {t:"Escaparte",run:function(){ if(Math.random()<0.5){ aplicarRep({publica:-4}); return "Igual sacaron una foto fea."; } return "Zafaste sin fotos."; }}
  ]},
 {t:"Susto de salud",d:"Un dolor te manda al médico de urgencia. Nada grave, pero un aviso.",
  op:[
   {t:"Hacerte todos los chequeos",run:function(){ const m=ri(10,30); E.personal.bolsillo=Math.max(0,E.personal.bolsillo-m); E.perfil.bienestar=clamp((E.perfil.bienestar||70)+12,0,100); return "Te cuidaste ("+plata(m)+"). El cuerpo lo agradece."; }},
   {t:"Ignorarlo y seguir",run:function(){ E.perfil.bienestar=clamp((E.perfil.bienestar||70)-10,0,100); return "Lo dejaste pasar. El estrés va a pasar la cuenta."; }}
  ]},
 {t:"Premio a la trayectoria",d:"Una revista te elige entre las personalidades del año del deporte.",
  op:[
   {t:"Ir a recibirlo con orgullo",run:function(){ aplicarRep({publica:8,credibilidad:4}); aplicarEfectos({moral:3}); return "Discurso emotivo y buena imagen. Bien merecido."; }},
   {t:"Mandar a alguien en tu lugar",run:function(){ aplicarRep({publica:2}); return "No fuiste. Gesto humilde… o desinterés, según quién lo cuente."; }}
  ]},
 {t:"Un familiar necesita ayuda",d:"Un familiar la está pasando mal y recurre a vos.",
  op:[
   {t:"Estar presente y bancarlo",run:function(){ const m=ri(15,35); E.personal.bolsillo=Math.max(0,E.personal.bolsillo-m); aplicarEfectos({moral:4}); E.perfil.bienestar=clamp((E.perfil.bienestar||70)+4,0,100); return "La familia primero. Diste una mano ("+plata(m)+")."; }},
   {t:"Estar poco por el trabajo",run:function(){ E.perfil.bienestar=clamp((E.perfil.bienestar||70)-6,0,100); return "El fútbol te comió el tiempo. Te quedó la culpa."; }}
  ]},
 {t:"Te ofrecen un negocio",d:"Un conocido te propone invertir en un negocio que «no puede fallar».",
  op:[
   {t:"Meterle plata",run:function(){ const m=ri(30,70); if(E.personal.bolsillo<m) return "No te alcanzaba, quedó en nada."; E.personal.bolsillo-=m; if(Math.random()<0.45){ const g=Math.round(m*(1.4+Math.random())); E.personal.bolsillo+=g; return "¡Salió bien! Recuperaste "+plata(g)+"."; } return "Se fue todo al tacho. Adiós "+plata(m)+"."; }},
   {t:"Pasar, huele a humo",run:function(){ return "Mejor no. La plata en el bolsillo."; }}
  ]},
 {t:"Crisis de la mediana edad",d:"Te da por replantearte todo. ¿Y si te das ese capricho?",
  op:[
   {t:"Darte el gusto",run:function(){ const m=ri(20,50); E.personal.bolsillo=Math.max(0,E.personal.bolsillo-m); E.perfil.bienestar=clamp((E.perfil.bienestar||70)+10,0,100); return "Te diste el gusto ("+plata(m)+"). Terapia cara pero efectiva."; }},
   {t:"Aguantar y meditar",run:function(){ E.perfil.bienestar=clamp((E.perfil.bienestar||70)+4,0,100); return "Respiraste hondo y se pasó. Gratis."; }}
  ]},
 {t:"Un perro te elige en el refugio",d:"En un refugio te mira un perro con cara de «llevame».",
  op:[
   {t:"Adoptarlo",run:function(){ aplicarEfectos({moral:4}); E.perfil.bienestar=clamp((E.perfil.bienestar||70)+10,0,100); return "Nuevo mejor amigo. La casa se llena de alegría."; }},
   {t:"Ahora no",run:function(){ return "Lo dejaste pasar. Igual te quedaste pensando."; }}
  ]}
];
function dispararVidaProc(){
  if(!E.perfil) return false;
  if(Math.random()>0.14) return false;
  modalVidaProc(elige(VIDA_PROC));
  return true;
}
function modalVidaProc(ev){
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">🎭</span><span>Vida personal</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("h3","sub",ev.t)); c.appendChild(el("p",null,ev.d));
    const ops=el("div","ops");
    ev.op.forEach(o=>{
      const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div>';
      b.onclick=()=>{ const txt=(o.run&&o.run())||""; notificar({t:"Vida personal: "+ev.t,tipo:"neutro",d:txt,bandeja:false}); guardar(); cerrarModal(); render(); };
      ops.appendChild(b);
    });
    c.appendChild(ops);
  },{cerrarFuera:false});
}

/* ============================================================
   5.1m · Tinder con charla, citas con dilema, hijos que crecen
   ============================================================ */
const CHARLAS_MATCH=[
 {q:"¿El fútbol es trabajo o religión?",
  op:[{t:"Trabajo. A las 7 corto.","n":8},{t:"Religión. Perdón.","n":2},{t:"Los dos, y me va a matar.","n":12}]},
 {q:"Si perdés un clásico, ¿aparecés a cenar?",
  op:[{t:"Aparezco, aunque esté mudo.","n":14},{t:"Me escondo dos días.","n":0},{t:"Te invito igual y pago yo.","n":10}]},
 {q:"¿Qué hacés con un domingo libre?",
  op:[{t:"Cancha, asado, siesta.","n":6},{t:"Te lo dedico entero.","n":14},{t:"Duermo y no hablo.","n":4}]}
];
const DILEMAS_CITA=[
 {t:"Llegás tarde de la conferencia",d:"Te espera hace 40 minutos. La cara no es de chiste.",
  op:[{t:"Pedir perdón y apagar el teléfono",ok:12},{t:"Contar el partido en detalle",ok:-6},{t:"Invitar postre y callarte",ok:8}]},
 {t:"Quiere ir al clásico con vos",d:"Platea, cámaras, la hinchada del otro lado.",
  op:[{t:"Llevarle y presentarle",ok:10},{t:"Conseguirle un palco discreto",ok:6},{t:"Decirle que es mala idea",ok:-8}]},
 {t:"Un hincha te pide una foto en la cita",d:"El momento se corta. Tu pareja te mira.",
  op:[{t:"Una foto y volvés a la mesa",ok:4},{t:"«Hoy no, estoy ocupado»",ok:10},{t:"Te quedás charlando cinco minutos",ok:-10}]}
];
function chatMatch(match){
  let i=0, pts=0;
  /* 6.23 · pregunta del CLUB con opción de mentir (si mentís, se filtra a la prensa) */
  const joven=(E.plantel||[]).filter(j=>!j.vendido&&!j.cedido&&j.edad<=23&&j.proy>=j.nivel+2).sort((a,b)=>b.proy-a.proy)[0];
  const preguntas=[];
  if(joven) preguntas.push({q:"Entre nosotros… ¿es verdad que vas a vender a "+joven.n+"?", club:true, quien:joven.n,
    op:[{t:"La verdad: capaz, si llega una oferta grande.",n:6,miente:false},
        {t:"Jamás, es intocable. Palabra.",n:11,miente:true},
        {t:"No hablo de laburo ni en la cama.",n:8,miente:false}]});
  CHARLAS_MATCH.forEach(q=>preguntas.push(q));
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">💬</span><span>Charla con '+match.n+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      if(i>=preguntas.length){
        const txt=typeof pensarOffline==="function"?pensarOffline("tinder",{n:match.n,pts:pts}):"";
        c.appendChild(el("p",null,pts>=20?match.n+" se ríe: «ok, invítame ya».":(pts>=8?match.n+" queda a medias. Todavía se puede.":match.n+" se enfría. «escribime otro día».")));
        if(txt) c.appendChild(el("p","mini",txt));
        match.charla=pts;
        if(pts>=8){
          const b=el("button","btn-aqua ancho verde","Invitar a salir");
          b.onclick=()=>{ cerrarModal(); invitarSalir(match); };
          c.appendChild(b);
        }
        const x=el("button","btn-aqua ancho gris","Cerrar"); x.style.marginTop="6px";
        x.onclick=()=>{ guardar(); cerrarModal(); render(); }; c.appendChild(x);
        return;
      }
      const q=preguntas[i];
      c.appendChild(el("p",null,q.q));
      if(q.club) c.appendChild(el("p","mini","Ojo: lo que digas en la intimidad también se filtra."));
      q.op.forEach(o=>{
        const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div>';
        b.onclick=()=>{ pts+=o.n; if(q.club&&o.miente){ E.flags.tinderMentira={quien:q.quien,con:match.n,idx:E.idx}; } i++; pintar(); };
        c.appendChild(b);
      });
    };
    pintar();
  });
}
/* 6.23 · a las ~4 fechas de mentir en una cita, se filtra a la prensa */
function chequearTinderMentira(){
  const m=E&&E.flags&&E.flags.tinderMentira;
  if(!m) return false;
  if((E.idx-(m.idx||0))<3) return false;
  delete E.flags.tinderMentira;
  aplicarRep({credibilidad:-4}); aplicarGrupos({prensa:-4});
  if(typeof postProc==="function"&&typeof HANDLES_PRENSA!=="undefined")
    postProc(elige(HANDLES_PRENSA),"prensa","Trascendió que el DT le juró a alguien, en la intimidad, que "+m.quien+" era intocable. En el club nadie lo confirma… ni lo desmiente. 👀","malo");
  if(typeof recordar==="function") recordar("prensa","se filtró que le mentiste sobre "+m.quien+" en una cita",{peso:"medio",tono:"malo"});
  if(typeof notificar==="function") notificar({t:"Se filtró tu vida privada",tipo:"malo",bandeja:false,
    d:"Algo que dijiste en una cita sobre "+m.quien+" llegó a la prensa. Golpe a tu credibilidad. Con la vida pública, hasta la almohada habla."});
  guardar();
  return true;
}
function dilemaCita(){
  if(!E.perfil.pareja) return;
  const ev=elige(DILEMAS_CITA);
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">💕</span><span>Cita con '+E.perfil.pareja.n+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("h3","sub",ev.t)); c.appendChild(el("p",null,ev.d));
    ev.op.forEach(o=>{
      const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div>';
      b.onclick=()=>{
        const costo=ri(8,28); E.personal.bolsillo=Math.max(0,E.personal.bolsillo-costo);
        E.perfil.pareja.nivel=clamp((E.perfil.pareja.nivel||65)+o.ok,0,100);
        E.perfil.bienestar=clamp((E.perfil.bienestar||70)+(o.ok>0?5:-2),0,100);
        aplicarEfectos({moral:o.ok>0?2:-1});
        notificar({t:"Cita: "+ev.t,tipo:o.ok>=0?"bueno":"malo",
          d:(o.ok>=0?E.perfil.pareja.n+" lo toma bien.":E.perfil.pareja.n+" se queda callada.")+" Costó "+plata(costo)+".",bandeja:false});
        guardar(); cerrarModal(); render();
      };
      c.appendChild(b);
    });
  });
}
function edadHijo(h){ return Math.max(0,(E.anio||2026)-(h.nacido||E.anio)); }
function incorporarHijoCantera(h){
  if(h.enPlantel){ if(typeof aviso==="function") aviso(h.nombre+" ya está en el plantel."); return; }
  const pos=elige(["VOL","DEL","DEF"]);
  E.plantel.push({
    n:h.nombre, pos:pos, edad:edadHijo(h)||17, nivel:58, proy:84,
    sueldo:18, valor:80, rasgos:["de la cantera","dinastía"], forma:70, moral:80,
    real:false, contrato:{hasta:(E.anio||2026)+4}, lesion:0, goles:0, partidos:0, tarjetas:0, cansancio:0
  });
  h.enPlantel=true; h.cantera=true;
  aplicarEfectos({moral:3,cantera:2});
  notificar({t:h.nombre+" firma con el club",tipo:"bueno",
    d:"Entra a la cantera. Nivel bajo, techo alto. Si lo quemás, la familia te lo cobra.",bandeja:false});
  guardar(); render();
}
function tickFamilia(){
  if(!E||!E.perfil) return;
  (E.perfil.hijos||[]).forEach(h=>{
    const ed=edadHijo(h);
    if(ed===17 && !h.aviso17){
      h.aviso17=true;
      notificar({t:h.nombre+" cumple 17",tipo:"neutro",
        d:"Puede entrar a la cantera del club. Está en Vida → Familia.",bandeja:true});
    }
  });
  if(E.perfil.pareja){
    E.perfil.pareja.semanasSinCita=(E.perfil.pareja.semanasSinCita||0)+1;
    if(E.perfil.pareja.semanasSinCita>=5){
      E.perfil.pareja.nivel=clamp((E.perfil.pareja.nivel||65)-3,0,100);
    }
    if((E.perfil.pareja.nivel||65)<22 && Math.random()<0.35) romperPareja();
  }
}
function elegirSucesor(tipo){
  if(tipo==="hijo"){ asumirSucesor(); return; }
  if(tipo==="externo"){
    E.dinastia.historial.push({generacion:E.dinastia.generacion,nombre:E.perfil.nombre,hasta:E.anio,edad:edadDT(),titulos:(E.titulos||[]).length,nota:"la sangre no tomó el cargo"});
    E.dinastia.generacion++;
    E.perfil.nombre=elige(["Andrea","Ricardo","Elena","Martín"])+" "+(apellidoDinastia()||"López");
    E.perfil.nacimiento=(E.anio-ri(38,46))+"-03-20";
    E.perfil.pareja=null; E.perfil.tinder={matches:[]}; E.perfil.hijos=[]; E.perfil.bienestar=68;
    E.dinastia.sucesionPendiente=false;
    aplicarRep({publica:-3}); aplicarEfectos({capital:-8});
    notificar({t:"Llegó un DT de afuera",tipo:"neutro",d:E.perfil.nombre+" toma el cargo. La familia cede el escritorio, no el linaje.",bandeja:false});
    guardar(); render();
  }
}
