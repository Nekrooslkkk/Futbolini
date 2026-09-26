"use strict";
/* ============================================================
   FUTBOLINI · vida-real.js  (7.9062+)
   Tarea 15 del autor (Vida). Parte A:
   - El DT se llama "Yoni" por defecto (se cambia en Vida).
   - Vida social: el juego obliga una visita familiar al menos una vez por temporada
     (decisión bloqueante: la familia no espera). Pesa en bienestar, pareja y camarín.
   ============================================================ */
(function(){
  const o=window.nuevaPartida; if(typeof o!=="function"||o._vr) return;
  const w=function(){ const r=o.apply(this,arguments);
    try{ if(E&&E.perfil&&(!E.perfil.nombre||E.perfil.nombre==="DT")){ E.perfil.nombre="Yoni"; if(E.dinastia&&(!E.dinastia.raiz||E.dinastia.raiz==="DT")) E.dinastia.raiz="Yoni"; } }catch(e){}
    return r; };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._vr=true; window.nuevaPartida=w;
})();
/* ---------- visita familiar obligada (una por temporada) ---------- */
const VISITAS_FAMILIA=[
  {k:"cumple",t:"Los 70 de tu mamá",d:"Tu mamá cumple 70. Toda la familia va a estar. Justo cae el día antes de un partido."},
  {k:"matri",t:"El matrimonio de tu hermano",d:"Tu hermano se casa y te pidió que seas testigo. La fecha ya estaba antes que el fixture."},
  {k:"bautizo",t:"El bautizo de tu sobrino",d:"Eres el padrino. La ceremonia es un domingo a mediodía."},
  {k:"funeral",t:"Se murió tu tío",d:"El tío que te llevaba al estadio de niño. El velorio es mañana en tu ciudad."},
  {k:"once",t:"Once familiar de fin de mes",d:"Tu papá no está bien de salud y quiere verlos a todos. Nadie lo dice, pero todos lo saben."}
];
function vidaSocialEsteAnio(){ return (((E.perfil||{}).vidaSocial||{}).agenda||[]).some(a=>a&&a.anio===E.anio); }
function sembrarVisitaObligada(){
  if(!E||!E.perfil||!E.calendario) return null;
  E.flags=E.flags||{};
  if(E.flags["visitaObl_"+E.anio]) return null;
  const tot=E.calendario.length||1;
  if((E.idx||0)<tot*0.55) return null;                 /* pasada la mitad de la temporada */
  if(vidaSocialEsteAnio() && (E.idx||0)<tot*0.8) return null;   /* si ya saliste, se puede esperar un poco más */
  const ev=VISITAS_FAMILIA[(E.anio*7+(E.idx||0))%VISITAS_FAMILIA.length];
  const id="proc_visita_"+E.anio;
  E.decProc=E.decProc||{};
  E.decProc[id]={id:id,buzon:"gris",peso:"alto",t:ev.t,d:ev.d+" No es opcional: la familia no espera al fixture.",posturas:{},visita:ev.k,
    op:[
      {t:"Ir, aunque se pierda un entrenamiento",d:"La familia primero.",dif:25,vis:"ir",
        bien:{txt:"Estuviste. Nadie en tu familia se va a olvidar de eso. El ayudante sacó la práctica adelante.",ef:{moral:1}},
        mitad:{txt:"Fuiste a medias: llegaste tarde y te fuiste temprano. Algo es algo.",ef:{}},
        mal:{txt:"Fuiste, pero con la cabeza en el partido. Se notó en la mesa.",ef:{moral:-1}}},
      {t:"Ir un rato y volver al club",d:"Cumplir con los dos. No siempre se puede.",dif:40,vis:"rato",
        bien:{txt:"Saludaste, abrazaste, volviste a tiempo a la práctica.",ef:{}},
        mitad:{txt:"Te miraron raro cuando te fuiste antes del brindis.",ef:{}},
        mal:{txt:"Ni allá ni acá: la familia se quedó con gusto a poco y en el club llegaste tarde.",ef:{moral:-2}}},
      {t:"No ir: mandar un regalo y un audio",d:"El fixture manda.",dif:55,vis:"no",
        bien:{txt:"Te entendieron. O dijeron que te entendían.",ef:{}},
        mitad:{txt:"El audio lo escucharon en silencio.",ef:{}},
        mal:{txt:"No fuiste. Eso se recuerda en todas las reuniones familiares que vengan.",ef:{}}}
    ]};
  E.decPend=E.decPend||[];
  if(!E.decPend.some(x=>x.id===id)) E.decPend.push({id:id,clave:id,peso:"alto"});
  E.flags["visitaObl_"+E.anio]=true;
  return E.decProc[id];
}
/* efectos personales de la visita: bienestar, pareja y el bolsillo (visibles en el aviso) */
function efectoVisita(dec,op){
  const p=E.perfil; if(!p) return "";
  const antesB=Math.round(p.bienestar||70), antesP=p.pareja?Math.round(p.pareja.nivel||65):null;
  let dB=0,dP=0,costo=0;
  if(op.vis==="ir"){ dB=12; dP=8; costo=0.3; }
  else if(op.vis==="rato"){ dB=4; dP=2; costo=0.1; }
  else { dB=-10; dP=-10; costo=0.2; }
  if(dec.visita==="funeral"&&op.vis==="no"){ dB-=6; dP-=4; }
  const k=((typeof inflacionEra==="function")?inflacionEra():1)/1.4;
  costo=Math.round(costo*k*100)/100;
  p.bienestar=clamp((p.bienestar||70)+dB,0,100);
  if(p.pareja) p.pareja.nivel=clamp((p.pareja.nivel||65)+dP,0,100);
  if(E.personal) E.personal.bolsillo=Math.max(0,(E.personal.bolsillo||0)-costo);
  (p.vidaSocial=p.vidaSocial||{agenda:[]}).agenda=(p.vidaSocial.agenda||[]);
  p.vidaSocial.agenda.unshift({t:dec.t,modo:"familia",anio:E.anio,txt:op.t});
  if(typeof recordar==="function") recordar("familia",(op.vis==="no"?"no fuiste a ":"fuiste a ")+dec.t.toLowerCase(),{peso:"medio",tono:op.vis==="no"?"malo":"bueno"});
  return "Bienestar "+antesB+"→"+Math.round(p.bienestar)+(antesP!=null?" · pareja "+antesP+"→"+Math.round(p.pareja.nivel):"")+" · "+plata(costo)+" de tu bolsillo.";
}
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._vr) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._vr=true; window[nom]=w; };
  envolver("resolverDecision",o=>function(dec,idx){
    const op=dec&&dec.op&&dec.op[idx];
    const r=o.apply(this,arguments);
    try{ if(r&&dec&&dec.visita&&op){ const x=efectoVisita(dec,op); r.extra=(r.extra?r.extra+" ":"")+x; } }catch(e){}
    return r;
  });
  envolver("tickSemana",o=>function(){ const r=o.apply(this,arguments); try{ sembrarVisitaObligada(); }catch(e){} return r; });
})();

/* ============================================================
   Parte B (7.9063): Match realista, primera cita, hijos con embarazo, familia en la previa.
   ============================================================ */
const PERSONAS_MATCH={mala:0.15,normal:0.6,genial:0.25};
function _personaDe(m){
  if(!m.persona){ const r=Math.random(); m.persona=r<PERSONAS_MATCH.mala?"mala":(r<PERSONAS_MATCH.mala+PERSONAS_MATCH.normal?"normal":"genial"); }
  return m.persona;
}
const SENALES_CHAT={
  mala:["Te pregunta cuánto ganas antes que cómo te llamas.","Al tercer mensaje te pide entradas para 10 amigos.","Habla mal de todos sus ex. De todos.","Te manda un audio de 4 minutos pidiendo que le deposites «hasta el lunes»."],
  normal:["Contesta a su ritmo, sin apuro. Normal.","Te cuenta de su pega con cansancio honesto.","Se ríe de tus chistes malos, a veces."],
  genial:["Te pregunta cómo te fue en la semana y se acuerda de lo que le dijiste.","Te manda un meme del rival que te hace reír de verdad.","No sabe nada de fútbol y no finge: te cae bien igual."]
};
const CHARLAS_EXTRA=[
 {q:"¿Hijos? ¿Quieres, tienes, ni loco?",op:[{t:"Algún día, con calma.",n:10},{t:"Ya tengo mis cosas armadas.",n:6},{t:"Ni loco.",n:2}]},
 {q:"¿Qué te gusta hacer cuando no es fútbol?",op:[{t:"Cocinar para gente que quiero.",n:12},{t:"Nada: todo es fútbol.",n:1},{t:"Caminar sin teléfono.",n:10}]},
 {q:"Última vez que lloraste",op:[{t:"Con una película, sin vergüenza.",n:11},{t:"Con un descenso, y no me arrepiento.",n:7},{t:"No lloro.",n:2}]},
 {q:"¿Qué no perdonas?",op:[{t:"La mentira.",n:9},{t:"Que me dejen plantado.",n:7},{t:"Que no me pregunten cómo estoy.",n:12}]},
 {q:"¿Tu familia sabe que estás en esta app?",op:[{t:"Mi mamá me la instaló.",n:12},{t:"No, y que siga así.",n:5},{t:"Ni sé qué es mi familia.",n:1}]}
];
/* el chat del Match: más preguntas y una señal de cómo es de verdad */
chatMatch=function(match){
  asegurarTinder();
  const persona=_personaDe(match);
  let i=0, pts=0;
  const pool=(typeof mezcla==="function"?mezcla:(a=>a))(CHARLAS_MATCH.concat(CHARLAS_EXTRA).slice());
  const preguntas=pool.slice(0,4);
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">💬</span><span>Charla con '+escHtml(match.n)+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      if(i>=preguntas.length){
        const senal=elige(SENALES_CHAT[persona]);
        c.appendChild(el("p",null,pts>=26?escHtml(match.n)+" se ríe: «ok, invítame ya».":(pts>=14?escHtml(match.n)+" queda a medias. Todavía se puede.":escHtml(match.n)+" se enfría. «escríbeme otro día».")));
        c.appendChild(el("div","resul mitad","🔎 <b>Lo que notas:</b> "+escHtml(senal)));
        match.charla=pts; match.senal=senal;
        if(pts>=14){ const b=el("button","btn-aqua ancho verde","Invitar a una primera cita"); b.onclick=()=>{ cerrarModal(); primeraCita(match); }; c.appendChild(b); }
        const x=el("button","btn-aqua ancho gris","Cerrar"); x.style.marginTop="6px"; x.onclick=()=>{ guardar(); cerrarModal(); render(); }; c.appendChild(x);
        return;
      }
      const q=preguntas[i];
      c.appendChild(el("p",null,"<b>"+escHtml(q.q)+"</b>"));
      c.appendChild(el("p","mini","Pregunta "+(i+1)+" de "+preguntas.length));
      q.op.forEach(o=>{ const b=el("button","op",'<div class="t">'+escHtml(o.t)+'</div>'); b.onclick=()=>{ pts+=o.n; i++; pintar(); }; c.appendChild(b); });
    };
    pintar();
  });
};
/* primera cita: tres decisiones; la persona real aparece */
function primeraCita(match){
  const persona=_personaDe(match), k=((typeof inflacionEra==="function")?inflacionEra():1)/1.4;
  const LUGARES=[["picada","Una picada con completos",0.03,4],["restaurante","Restaurante caro en Vitacura",0.15,2],["paseo","Caminar por el cerro",0,6]];
  const TEMAS=[["escuchar","Preguntar y escuchar",8],["futbol","Hablar del partido del domingo",-4],["honesto","Contar algo honesto de ti",6]];
  const FINAL=[["segunda","Proponer una segunda cita",0],["casa","Invitar a tu casa",-2],["taxi","Pedirle un taxi y despedirse",2]];
  let paso=0, pts=match.charla||14, costo=0;
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🌹</span><span>Primera cita con '+escHtml(match.n)+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      const listas=[LUGARES,TEMAS,FINAL], tits=["¿Dónde?","¿De qué hablan?","¿Cómo termina?"];
      if(paso<3){
        c.appendChild(el("p",null,"<b>"+tits[paso]+"</b>"));
        listas[paso].forEach(o=>{ const b=el("button","op",'<div class="t">'+escHtml(o[1])+'</div>'+(paso===0&&o[2]?'<div class="d">'+plata(Math.round(o[2]*k*100)/100)+'</div>':''));
          b.onclick=()=>{ if(paso===0){ costo=Math.round(o[2]*k*100)/100; pts+=o[3]; } else pts+=o[2]; paso++; pintar(); }; c.appendChild(b); });
        return;
      }
      /* desenlace según quién es de verdad */
      E.personal.bolsillo=Math.max(0,(E.personal.bolsillo||0)-costo);
      let txt="", tipo="neutro";
      if(persona==="mala"){
        const r=Math.random();
        if(r<0.4){ const pide=Math.round(0.5*k*10)/10; E.personal.bolsillo=Math.max(0,E.personal.bolsillo-pide); txt="Al postre te pidió plata «prestada» para un tema urgente. Se la diste ("+plata(pide)+"). No vuelve a contestar."; tipo="malo"; }
        else if(r<0.75){ aplicarRep({publica:-4}); txt="Al día siguiente la cita estaba en un portal de farándula, con fotos. La fuente, obvio, era tu cita."; tipo="malo"; }
        else { txt="Nunca llegó. Te dejó plantado en la mesa, con la gente mirando."; E.perfil.bienestar=clamp((E.perfil.bienestar||70)-6,0,100); tipo="malo"; }
        E.perfil.tinder.matches=E.perfil.tinder.matches.filter(m=>m.n!==match.n);
      } else {
        const umbral=persona==="genial"?20:30;
        if(pts>=umbral && !E.perfil.pareja){
          E.perfil.pareja={n:match.n,orb:match.orb,desde:E.anio,nivel:persona==="genial"?78:62,casades:false,persona:persona};
          E.perfil.tinder.matches=E.perfil.tinder.matches.filter(m=>m.n!==match.n);
          aplicarEfectos({moral:4}); E.perfil.bienestar=clamp((E.perfil.bienestar||70)+8,0,100);
          txt=persona==="genial"?"Cerraron el local. Se ríen de lo mismo. Esto va en serio: ahora son pareja.":"Estuvo bien. Sin fuegos artificiales, pero hay algo: deciden seguir viéndose.";
          tipo="bueno";
        } else if(E.perfil.pareja){
          if(Math.random()<0.5){ aplicarRep({publica:-8,credibilidad:-4}); aplicarGrupos({prensa:-6}); E.perfil.pareja.nivel=clamp((E.perfil.pareja.nivel||65)-25,0,100);
            txt="Te pillaron. Tenías pareja y la foto de la cita llegó primero a su teléfono que a la prensa."; tipo="malo"; }
          else txt="Nadie se enteró. Esta vez.";
        } else { txt="Fue una linda noche, pero quedó ahí. Se desean suerte."; }
      }
      c.appendChild(el("div","resul "+(tipo==="bueno"?"bien":(tipo==="malo"?"mal":"mitad")),txt+(costo?" <span class='mini'>La cita costó "+plata(costo)+".</span>":"")));
      if(typeof recordar==="function"&&tipo!=="neutro") recordar("amor",tipo==="bueno"?"empezaste una relación con "+match.n:"una cita con "+match.n+" salió mal",{peso:"bajo",tono:tipo==="bueno"?"bueno":"malo"});
      const x=el("button","btn-aqua ancho","Cerrar"); x.onclick=()=>{ guardar(); cerrarModal(); render(); }; c.appendChild(x);
    };
    pintar();
  });
}
invitarSalir=function(match){ primeraCita(match); };
/* ---------- hijos: embarazo de 9 meses, uno a la vez ---------- */
const SEMANAS_EMBARAZO=36;
tenerHijo=function(){
  const p=E.perfil;
  if(!p.pareja){ aviso("Primero necesitas pareja."); return; }
  if((p.pareja.nivel||0)<55){ aviso("La relación necesita estar más sólida para dar ese paso."); return; }
  if(p.embarazo){ aviso("Ya viene uno en camino: "+Math.max(0,SEMANAS_EMBARAZO-p.embarazo.semanas)+" semanas para el parto."); return; }
  if((p.hijos||[]).filter(h=>!h.fallecido).length>=4){ aviso("Ya tienen una familia numerosa."); return; }
  if(p.ultimoParto&&E.anio-p.ultimoParto<1){ aviso("El último nació hace nada. Esperen al menos un año."); return; }
  p.embarazo={semanas:0, desde:E.anio};
  p.pareja.nivel=clamp(p.pareja.nivel+6,0,100); p.bienestar=clamp((p.bienestar||70)+4,0,100);
  notificar({t:"Viene un bebé en camino",tipo:"bueno",bandeja:false,d:"Nueve meses (unas "+SEMANAS_EMBARAZO+" semanas de juego). Van a ser semanas con controles, sustos y cansancio."});
  guardar(); render();
};
function nacerHijo(){
  const p=E.perfil; p.embarazo=null; p.ultimoParto=E.anio;
  let nombre;
  const vivos=(p.hijos||[]).filter(h=>!h.fallecido);
  if(!vivos.length) nombre=nombreGeneracion(E.dinastia.raiz, E.dinastia.generacion+1);
  else { const nom=(typeof NOMBRES_PILA!=="undefined")?elige(NOMBRES_PILA):"Nuevo"; nombre=nom+" "+(apellidoDinastia()||E.dinastia.raiz); }
  const k=((typeof inflacionEra==="function")?inflacionEra():1)/1.4, costo=Math.round(1.5*k*10)/10;
  E.personal.bolsillo=Math.max(0,(E.personal.bolsillo||0)-costo);
  p.hijos.push({nombre:nombre,nacido:E.anio});
  aplicarEfectos({moral:4}); p.bienestar=clamp((p.bienestar||70)+10,0,100);
  if(p.pareja) p.pareja.nivel=clamp((p.pareja.nivel||65)+8,0,100);
  notificar({t:"Nació "+nombre,tipo:"bueno",bandeja:true,d:"Parto sin complicaciones. La clínica y lo primero costaron "+plata(costo)+". Van a ser noches largas."});
  if(typeof recordar==="function") recordar("familia","nació "+nombre,{peso:"alto",tono:"bueno"});
}
/* pérdida de un hijo: muy rara, pero existe. El juego no la esconde. */
function chequearPerdidaHijo(){
  const p=E.perfil; if(!p||!p.hijos) return;
  p.hijos.forEach(h=>{
    if(h.fallecido||h.enPlantel) return;
    const ed=(E.anio||2026)-(h.nacido||E.anio);
    if(ed>12) return;
    if(Math.random()<0.004){
      h.fallecido=E.anio;
      p.bienestar=clamp((p.bienestar||70)-45,0,100);
      if(p.pareja) p.pareja.nivel=clamp((p.pareja.nivel||65)-15,0,100);
      aplicarEfectos({moral:-8});
      E.flags=E.flags||{}; E.flags.duelo={anio:E.anio,idx:E.idx,n:h.nombre};
      notificar({t:"Murió "+h.nombre,tipo:"malo",bandeja:true,d:"No hay forma de escribir esto bien. El club te da los días que necesites. El plantel viste brazalete negro el domingo."});
      if(typeof recordar==="function") recordar("familia","murió tu hijo "+h.nombre,{peso:"alto",tono:"malo"});
    }
  });
}
/* ---------- familia en la previa: pesa y se ve ---------- */
const FAMILIA_PREVIA=[
  {t:"Tu hijo amaneció con fiebre alta",d:"Tu pareja está en la clínica con él. El partido es en tres horas.",req:"hijo"},
  {t:"Acto del colegio",d:"Tu hija baila en el acto de fin de año. Justo a la hora del partido.",req:"hijo"},
  {t:"Aniversario",d:"Hoy es el aniversario. Tu pareja reservó hace un mes. El partido cambió de horario.",req:"pareja"},
  {t:"Tu papá está hospitalizado",d:"Nada grave, dicen. Pero pregunta por ti.",req:null}
];
function familiaPrevia(part, seguir){
  const p=E.perfil||{};
  const hijosVivos=(p.hijos||[]).filter(h=>!h.fallecido).length;
  const pool=FAMILIA_PREVIA.filter(f=>!f.req||(f.req==="hijo"&&hijosVivos)||(f.req==="pareja"&&p.pareja));
  const ev=elige(pool);
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">👨‍👩‍👧</span><span>'+escHtml(ev.t)+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p",null,escHtml(ev.d)));
    const ops=[
      {t:"Quedarte con tu familia",d:"El ayudante dirige el partido (no lo diriges tú). +bienestar, +pareja, el camarín lo entiende.",
        fx:{bien:+14,par:+12,moral:+1}, modo:"simular"},
      {t:"Ir al partido y llamar en el entretiempo",d:"Diriges tú. La familia lo nota.",fx:{bien:-8,par:-10,moral:0},modo:null},
      {t:"Ir al partido y apagar el teléfono",d:"Cabeza en la cancha. En casa no te lo van a perdonar fácil.",fx:{bien:-12,par:-18,moral:+1},modo:null}
    ];
    ops.forEach(o=>{
      const b=el("button","op",'<div class="t">'+escHtml(o.t)+'</div><div class="d">'+escHtml(o.d)+' <b>(bienestar '+(o.fx.bien>0?"+":"")+o.fx.bien+(p.pareja?", pareja "+(o.fx.par>0?"+":"")+o.fx.par:"")+")</b></div>");
      b.onclick=()=>{
        const b0=Math.round(p.bienestar||70), p0=p.pareja?Math.round(p.pareja.nivel||65):null;
        p.bienestar=clamp((p.bienestar||70)+o.fx.bien,0,100);
        if(p.pareja) p.pareja.nivel=clamp((p.pareja.nivel||65)+o.fx.par,0,100);
        if(o.fx.moral) aplicarEfectos({moral:o.fx.moral});
        if(typeof recordar==="function") recordar("familia",(o.modo?"te quedaste con tu familia en vez de dirigir ante ":"fuiste a dirigir ante ")+(part.rivalNombre||"el rival"),{peso:"medio",tono:o.modo?"bueno":"malo"});
        aviso("Bienestar "+b0+"→"+Math.round(p.bienestar)+(p0!=null?" · pareja "+p0+"→"+Math.round(p.pareja.nivel):""));
        part._familiaHecha=true; if(o.modo) part._forzarSimular=true;
        guardar(); cerrarModal(); seguir();
      };
      c.appendChild(b);
    });
  },{cerrarFuera:false});
}
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._vrB) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._vrB=true; window[nom]=w; };
  envolver("tickSemana",o=>function(){ const r=o.apply(this,arguments);
    try{ const p=E.perfil; if(p&&p.embarazo){ p.embarazo.semanas=(p.embarazo.semanas||0)+1; if(p.embarazo.semanas>=SEMANAS_EMBARAZO) nacerHijo(); } }catch(e){}
    return r; });
  envolver("finDeTemporada",o=>function(){ try{ chequearPerdidaHijo(); }catch(e){} return o.apply(this,arguments); });
  envolver("pantallaPrevia",o=>function(part){
    const self=this, args=arguments;
    try{
      const p=E&&E.perfil;
      const tiene=p&&((p.hijos||[]).some(h=>!h.fallecido)||p.pareja);
      if(part&&!part._familiaHecha&&part.tipo!=="amistoso"&&tiene&&!E._bulkSim&&Math.random()<0.07){
        familiaPrevia(part,()=>o.apply(self,args)); return;
      }
    }catch(e){}
    return o.apply(this,arguments);
  });
  /* si te quedaste con la familia, el partido lo dirige el ayudante */
  envolver("iniciarPartido",o=>function(part,modo){
    if(part&&part._forzarSimular){ const P=o.call(this,part,"simular"); if(P&&typeof linea==="function") linea(P,0,"El DT no está: se quedó con su familia. Dirige el ayudante.","grave"); return P; }
    return o.apply(this,arguments);
  });
})();
