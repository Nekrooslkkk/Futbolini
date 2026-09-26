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
/* la pérdida de un hijo ya no es de golpe: ver Parte D (crisis con aviso y decisiones) */
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

/* ============================================================
   Parte C (7.9064): patrimonio que vive (se valoriza, se deprecia, arrienda, se vende)
   y apuestas deportivas a los partidos del juego, con cuotas del mismo motor.
   Precios 2026 en millones de CLP (portales inmobiliarios/automotrices, aprox.), escalados por época.
   ============================================================ */
/* val = valorización anual · mant = mantención anual (contribuciones, seguro, gastos comunes)
   renta = arriendo/utilidad anual · req = prestigio del club para que te lo ofrezcan */
const PATRIMONIO=[
 {id:"reloj",   t:"Reloj de colección",           tipo:"prop",costo:12,  val:0.02, mant:0.2, renta:0,  ef:{prestigio:1},d:"Se ve en la conferencia. Nadie pregunta cuánto costó; todos lo saben."},
 {id:"suv",     t:"SUV usado, 2021",               tipo:"auto",costo:22,  val:-0.12,mant:1.6, renta:0,  d:"Permiso, seguro, revisión técnica. El auto de un DT que todavía no la hizo."},
 {id:"cam4x4",  t:"Camioneta 4x4 nueva",           tipo:"auto",costo:48,  val:-0.15,mant:2.6, renta:0,  ef:{prestigio:1},d:"Pierde un cuarto de su valor el día que la sacas del concesionario."},
 {id:"deptoN",  t:"Departamento para arrendar en Ñuñoa",tipo:"prop",costo:165,val:0.03,mant:1.9,renta:7.2,d:"Dos dormitorios cerca del metro. Arriendo de unos 600 mil al mes, cuando hay arrendatario."},
 {id:"parcela", t:"Parcela de agrado en el sur",   tipo:"prop",costo:95,  val:0.04, mant:1.4, renta:0,  ef:{moral:3},d:"Cinco mil metros y un fogón. Para apagar el teléfono."},
 {id:"deport",  t:"Auto deportivo",                tipo:"auto",costo:165, val:-0.10,mant:6,   renta:0,  ef:{prestigio:1,riesgo:3},d:"La prensa lo fotografía en el estacionamiento después de cada derrota."},
 {id:"local",   t:"Local comercial en Providencia",tipo:"prop",costo:260, val:0.025,mant:3.2, renta:16, d:"Renta más que un departamento, pero si el local queda vacío, las contribuciones igual llegan."},
 {id:"deptoV",  t:"Departamento en Vitacura",      tipo:"prop",costo:390, val:0.03, mant:5.5, renta:0,  ef:{prestigio:2},d:"Piso alto, vista a la cordillera. Vives ahí: no renta, pero vale."},
 {id:"resto",   t:"Socio en un restaurante",       tipo:"negocio",costo:80,val:0,  mant:0,   renta:9,  riesgoNeg:0.12,d:"Te invita un ex jugador. La mitad de los restaurantes cierra antes de tres años."},
 {id:"chicureo",t:"Casa en Chicureo",              tipo:"prop",costo:480, val:0.035,mant:7.5, renta:0,  req:55,ef:{moral:2,prestigio:1},d:"Condominio, portón, piscina. Lejos del estadio y de todo."},
 {id:"yate",    t:"Lancha en Algarrobo",           tipo:"auto",costo:160, val:-0.08,mant:18,  renta:0,  req:55,ef:{prestigio:2,riesgo:5},d:"Marina, patrón y combustible. La hinchada la ve en las redes un lunes después de perder."},
 {id:"zapallar",t:"Casa en Zapallar",              tipo:"prop",costo:1250,val:0.04, mant:22,  renta:30, req:70,ef:{prestigio:3,riesgo:4},d:"Se arrienda en enero y febrero. El resto del año es tuya y del cuidador."},
 {id:"vina",    t:"Campo con viñedo en Colchagua", tipo:"negocio",costo:2600,val:0.03,mant:70,renta:130,riesgoNeg:0.05,req:70,ef:{moral:3,prestigio:2},d:"Vino con tu apellido. Una helada mala y el año se pierde."},
 {id:"heli",    t:"Helicóptero",                   tipo:"auto",costo:650, val:-0.07,mant:85,  renta:0,  req:85,ef:{prestigio:4,riesgo:8},d:"Llegas por el aire y el plantel en bus. Nadie en el camarín lo olvida."},
 {id:"estatua", t:"Tu estatua afuera del estadio", tipo:"ego", costo:90,  val:-1,   mant:0,   renta:0,  req:85,ef:{prestigio:5,riesgo:10},d:"Te la mandaste a hacer tú, en vida. No se vende: el día que te vayas, la sacan con grúa."}
];
function _kEra(){ return ((typeof inflacionEra==="function")?inflacionEra():1.4)/1.4; }
function _r2(x){ return Math.round(x*100)/100; }
function precioPatrimonio(a){ return _r2(a.costo*_kEra()); }
function _defPat(item){ return PATRIMONIO.find(a=>a.id===item.id)||PATRIMONIO.find(a=>a.t===item.t)||null; }
function bienesPropios(){
  const pe=E.personal||{}; const out=[];
  ["propiedades","autos"].forEach(k=>(pe[k]||[]).forEach(it=>out.push(it)));
  return out;
}
/* partidas viejas: los lujos no tenían valor → se estima desde el catálogo */
function migrarPatrimonio(){
  bienesPropios().forEach(it=>{
    if(typeof it.valor==="number") return;
    const d=_defPat(it);
    it.id=d?d.id:(it.id||"otro");
    it.valor=d&&d.val>-1?precioPatrimonio(d)*0.8:0;
    it.pagado=it.pagado||it.valor;
  });
}
function patrimonioTotal(){
  migrarPatrimonio();
  return _r2((E.personal&&E.personal.bolsillo||0)+bienesPropios().reduce((s,it)=>s+(it.valor||0),0));
}
comprarLujo=function(l){
  const d=l.id?l:(_defPat(l)||l);
  if(d.req && (E.ind.prestigio||0)<d.req){ aviso("Todavía no tienes el nivel de club para eso (prestigio "+d.req+")."); return; }
  const precio=d.val!==undefined?precioPatrimonio(d):l.costo;
  if((E.personal.bolsillo||0)<precio){ aviso("No te alcanza el bolsillo ("+plata(precio)+")."); return; }
  if(d.id&&bienesPropios().some(it=>it.id===d.id)&&(d.tipo==="ego"||d.id==="vina"||d.id==="heli")){ aviso("Ya tienes uno."); return; }
  E.personal.bolsillo=_r2(E.personal.bolsillo-precio);
  if(d.ef) aplicarEfectos(d.ef);
  (d.tipo==="auto"?E.personal.autos:E.personal.propiedades).push({id:d.id,t:d.t,anio:E.anio,pagado:precio,valor:d.val<=-1?0:precio});
  notificar({t:"Compraste: "+d.t,tipo:"neutro",bandeja:false,d:d.d+" Pagaste "+plata(precio)+"."+(d.mant?" Mantenerlo cuesta unos "+plata(_r2(d.mant*_kEra()))+" al año.":"")});
  guardar(); render();
};
function venderBien(item){
  const d=_defPat(item);
  if(d&&d.tipo==="ego"){ aviso("Nadie compra una estatua tuya."); return 0; }
  const neto=_r2((item.valor||0)*0.97);   /* corretaje/comisión ~3 % */
  ["propiedades","autos"].forEach(k=>{ E.personal[k]=(E.personal[k]||[]).filter(x=>x!==item); });
  E.personal.bolsillo=_r2((E.personal.bolsillo||0)+neto);
  const gan=_r2(neto-(item.pagado||0));
  notificar({t:"Vendiste: "+item.t,tipo:gan>=0?"bueno":"malo",bandeja:false,d:"Recibiste "+plata(neto)+" (descontado el 3 % de corretaje). "+(gan>=0?"Ganaste "+plata(gan)+" respecto de lo que pagaste.":"Perdiste "+plata(-gan)+" respecto de lo que pagaste.")});
  guardar(); render();
  return neto;
}
/* cierre anual: valorización, mantención, arriendos. Devuelve el balance para mostrarlo. */
function cierrePatrimonio(){
  migrarPatrimonio();
  const k=_kEra(), b={val:0,mant:0,renta:0,vacios:[],quiebras:[]};
  bienesPropios().slice().forEach(it=>{
    const d=_defPat(it); if(!d) return;
    const v0=it.valor||0;
    if(d.val>-1) it.valor=_r2(Math.max(0,v0*(1+d.val+(Math.random()-0.5)*0.04)));
    b.val+=it.valor-v0;
    b.mant+=d.mant*k;
    if(d.renta){
      if(d.riesgoNeg&&Math.random()<d.riesgoNeg){ b.quiebras.push(it.t); it.valor=_r2(it.valor*0.2); if(d.tipo==="negocio"&&d.id==="resto"){ ["propiedades","autos"].forEach(x=>{ E.personal[x]=E.personal[x].filter(y=>y!==it); }); } return; }
      if(d.tipo==="prop"&&Math.random()<0.12){ b.vacios.push(it.t); return; }
      b.renta+=d.renta*k*(d.tipo==="negocio"?(0.6+Math.random()*0.8):1);
    }
  });
  b.val=_r2(b.val); b.mant=_r2(b.mant); b.renta=_r2(b.renta);
  if(b.mant||b.renta||b.val){
    E.personal.bolsillo=_r2(Math.max(0,(E.personal.bolsillo||0)+b.renta-b.mant));
    E.personal.patHist=E.personal.patHist||[];
    E.personal.patHist.unshift({anio:E.anio,val:b.val,mant:b.mant,renta:b.renta,total:patrimonioTotal()});
    if(E.personal.patHist.length>12) E.personal.patHist.length=12;
    notificar({t:"Balance de tu patrimonio "+E.anio,tipo:(b.val+b.renta-b.mant)>=0?"bueno":"malo",bandeja:true,
      d:"Valorización "+(b.val>=0?"+":"")+plata(b.val)+" · arriendos y utilidades +"+plata(b.renta)+" · mantención −"+plata(b.mant)+"."+
        (b.vacios.length?" Sin arrendatario todo el año: "+b.vacios.join(", ")+".":"")+(b.quiebras.length?" Mal año para: "+b.quiebras.join(", ")+".":"")+
        " Patrimonio total: "+plata(patrimonioTotal())+"."});
  }
  return b;
}
function panelPatrimonio(){
  migrarPatrimonio();
  const pl=panel("Patrimonio","💎");
  const bienes=bienesPropios(), k=_kEra();
  const enBienes=_r2(bienes.reduce((s,it)=>s+(it.valor||0),0));
  const mantAnual=_r2(bienes.reduce((s,it)=>{ const d=_defPat(it); return s+(d?d.mant*k:0); },0));
  pl.cuerpo.appendChild(fila("Patrimonio total",plata(patrimonioTotal())));
  pl.cuerpo.appendChild(fila("Bolsillo · en bienes",plata(E.personal.bolsillo||0)+" · "+plata(enBienes)));
  if(mantAnual) pl.cuerpo.appendChild(fila("Mantención al año",plata(mantAnual)));
  if(bienes.length){
    pl.cuerpo.appendChild(el("div","lb","Lo que tienes"));
    bienes.forEach(it=>{
      const d=_defPat(it), dif=_r2((it.valor||0)-(it.pagado||0));
      const row=el("div","fila pat-bien");
      row.innerHTML="<span>"+escHtml(it.t)+" <span class='mini'>· desde "+(it.anio||"?")+"</span></span><b>"+(d&&d.tipo==="ego"?"no se vende":plata(it.valor||0)+" <span class='mini "+(dif>=0?"verde":"rojo")+"'>("+(dif>=0?"+":"")+plata(dif)+")</span>")+"</b>";
      if(!(d&&d.tipo==="ego")){ const b=el("button","btn-aqua chico","Vender"); b.onclick=()=>{ if(confirm("¿Vender "+it.t+" por "+plata(_r2((it.valor||0)*0.97))+"?")) venderBien(it); }; row.appendChild(b); }
      pl.cuerpo.appendChild(row);
    });
  }
  const h=(E.personal.patHist||[])[0];
  if(h) pl.cuerpo.appendChild(el("p","mini","Último balance ("+h.anio+"): valorización "+(h.val>=0?"+":"")+plata(h.val)+" · arriendos +"+plata(h.renta)+" · mantención −"+plata(h.mant)+"."));
  const det=el("details","pat-cat"); det.appendChild(el("summary",null,"Comprar ("+PATRIMONIO.length+" opciones)"));
  PATRIMONIO.forEach(a=>{
    const bloq=a.req&&(E.ind.prestigio||0)<a.req, precio=precioPatrimonio(a);
    const rasgos=[a.val>0?"se valoriza ~"+Math.round(a.val*100)+" %/año":(a.val<=-1?"no se revende":"se deprecia ~"+Math.round(-a.val*100)+" %/año"),
      a.mant?"mantención "+plata(_r2(a.mant*k))+"/año":"",a.renta?"renta ~"+plata(_r2(a.renta*k))+"/año":""].filter(Boolean).join(" · ");
    const b=el("button","op"+(bloq?" op-bloqueado":""));
    b.innerHTML='<div class="t">'+(bloq?"🔒 ":"")+escHtml(a.t)+' <span class="mini">· '+plata(precio)+'</span></div><div class="d">'+
      (bloq?"Con un club de prestigio ≥ "+a.req+" empiezan a ofrecértelo.":escHtml(a.d)+"<br><span class='mini'>"+rasgos+"</span>")+'</div>';
    b.disabled=!!bloq; if(!bloq) b.onclick=()=>comprarLujo(a);
    det.appendChild(b);
  });
  pl.cuerpo.appendChild(det);
  return pl;
}

/* ---------- apuestas deportivas: los partidos de tu liga, con cuotas del motor ---------- */
const MARGEN_CASA=0.07;   /* las casas chilenas cobran ~6–8 % sobre la probabilidad justa */
function _poisPMF(l,k){ let p=Math.exp(-l); for(let i=1;i<=k;i++) p*=l/i; return p; }
function probabilidades1X2(a,b){
  const fa=(a.fuerza||55)+3.2+(typeof _formaClub==="function"?_formaClub(a.id):0);
  const fb=(b.fuerza||55)+(typeof _formaClub==="function"?_formaClub(b.id):0);
  const d=(fa-fb)/24;
  const lh=clamp(1.38+d*0.72,0.35,2.9), la=clamp(1.08-d*0.72,0.35,2.9);
  let L=0,X=0,V=0;
  for(let i=0;i<=5;i++) for(let j=0;j<=5;j++){
    const p=(i===5?1-[0,1,2,3,4].reduce((s,k)=>s+_poisPMF(lh,k),0):_poisPMF(lh,i))*(j===5?1-[0,1,2,3,4].reduce((s,k)=>s+_poisPMF(la,k),0):_poisPMF(la,j));
    if(i>j) L+=p; else if(i===j) X+=p; else V+=p;
  }
  return {L:L,X:X,V:V};
}
function cuotas1X2(a,b){
  const p=probabilidades1X2(a,b), c={};
  ["L","X","V"].forEach(k=>c[k]=Math.max(1.03,Math.round(100/(p[k]*(1+MARGEN_CASA)))/100));
  return c;
}
function _clubApu(id){
  const c=(typeof CLUB_POR_ID!=="undefined"&&CLUB_POR_ID[id])||(typeof clubLookup==="function"&&clubLookup(id));
  return (c&&c.id)?c:{id:id,n:id,c:id,fuerza:60};
}
/* la próxima fecha de liga con sus partidos (los mismos que después simula simularResto) */
function fechaApostable(){
  const cal=E.calendario||[]; let idx=-1;
  for(let i=E.idx||0;i<cal.length;i++){ if(cal[i]&&!cal[i].jugado&&cal[i].tipo==="liga"){ idx=i; break; } }
  const part=cal[idx];
  if(!part) return null;
  const especial=["liguillaAscenso","liguillaDescenso","apertura","clausura","zonal"].indexOf(part.fase)>=0;
  if(!part.jornada&&!especial&&typeof emparejarFecha==="function") part.jornada=emparejarFecha(E.anio,part.fecha,E.club,part.rivalId);
  const pares=[];
  const yo=[part.local?E.club:part.rivalId, part.local?part.rivalId:E.club];
  if(part.rivalId) pares.push({a:yo[0],b:yo[1],mio:true});
  (part.jornada||[]).forEach(p=>{ if(!p||p[0]===E.club||p[1]===E.club||p[0]==="__BYE__"||p[1]==="__BYE__") return; pares.push({a:p[0],b:p[1],mio:false}); });
  return {part:part, idx:idx, pares:pares};
}
function apostar(par,pick,monto,cuota,idx){
  monto=_r2(Math.max(0.01,Math.min(monto,E.personal.bolsillo||0)));
  if(!(monto>0)){ aviso("No tienes plata en el bolsillo."); return null; }
  const a=_clubApu(par.a), b=_clubApu(par.b);
  E.personal.bolsillo=_r2(E.personal.bolsillo-monto);
  const ap={anio:E.anio,idx:(typeof idx==='number'?idx:E.idx),a:par.a,b:par.b,na:a.c||a.n,nb:b.c||b.n,pick:pick,monto:monto,cuota:cuota,mio:!!par.mio};
  E.personal.apuestas=E.personal.apuestas||[]; E.personal.apuestas.push(ap);
  /* apostar a tu propio partido: prohibido por reglamento. Si te pillan, es un escándalo. */
  if(par.mio){
    const contra=(pick==="L"&&par.a!==E.club)||(pick==="V"&&par.b!==E.club);
    ap.contra=contra;
    if(Math.random()<(contra?0.45:0.2)){
      aplicarRep({credibilidad:contra?-18:-8,publica:contra?-12:-5}); aplicarEfectos({riesgo:contra?18:8});
      if(typeof aplicarGrupos==="function") aplicarGrupos({prensa:-8,anfp:contra?-14:-6,plantel:contra?-12:-2});
      E.flags=E.flags||{}; E.flags.apuestaPropia=(E.flags.apuestaPropia||0)+1;
      notificar({t:contra?"Apostaste contra tu propio equipo, y se supo":"Te pillaron apostando a tu propio partido",tipo:"malo",bandeja:true,
        d:contra?"Un operador de la casa de apuestas filtró el movimiento. La ANFP abre investigación por posible amaño y el camarín ya no te mira igual."
                :"La casa de apuestas reporta el movimiento a la ANFP. El reglamento lo prohíbe aunque apuestes a ganar. La prensa te pregunta en cada conferencia."});
      if(typeof recordar==="function") recordar("escandalo",contra?"apostaste contra tu equipo":"apostaste a tu propio partido",{peso:"alto",tono:"malo"});
    }
  }
  guardar();
  return ap;
}
function _resultadoDe(ap){
  const part=(E.calendario||[])[ap.idx];
  if(ap.mio){
    if(!part||!part.jugado||typeof part.gf!=="number") return null;
    const gl=part.local?part.gf:part.gc, gv=part.local?part.gc:part.gf;
    return [gl,gv];
  }
  if(!part||!part.jugado) return null;
  const f=(E.ultimaFecha||[]).find(x=>x.a===ap.na&&x.b===ap.nb);
  return f?[f.ga,f.gb]:"sinDato";
}
function resolverApuestas(){
  const lista=(E.personal&&E.personal.apuestas)||[]; if(!lista.length) return [];
  const hechas=[], quedan=[];
  lista.forEach(ap=>{
    const r=(ap.anio!==E.anio)?"sinDato":_resultadoDe(ap);
    if(r===null){ quedan.push(ap); return; }
    if(r==="sinDato"){ E.personal.bolsillo=_r2(E.personal.bolsillo+ap.monto); hechas.push({ap:ap,neto:0,txt:"anulada (devuelta)"}); return; }
    const sal=r[0]>r[1]?"L":(r[0]===r[1]?"X":"V");
    const gano=sal===ap.pick, pago=gano?_r2(ap.monto*ap.cuota):0;
    E.personal.bolsillo=_r2(E.personal.bolsillo+pago);
    hechas.push({ap:ap,neto:_r2(pago-ap.monto),txt:ap.na+" "+r[0]+"-"+r[1]+" "+ap.nb});
  });
  E.personal.apuestas=quedan;
  if(hechas.length){
    const neto=_r2(hechas.reduce((s,h)=>s+h.neto,0));
    E.personal.apuHist=E.personal.apuHist||{jug:0,neto:0}; E.personal.apuHist.jug+=hechas.length; E.personal.apuHist.neto=_r2(E.personal.apuHist.neto+neto);
    notificar({t:"Apuestas de la fecha: "+(neto>=0?"+":"")+plata(neto),tipo:neto>=0?"bueno":"malo",bandeja:false,
      d:hechas.map(h=>h.txt+" → "+(h.neto>0?"+"+plata(h.neto):(h.neto<0?"−"+plata(-h.neto):"0"))).join(" · ")+
        ". En total llevas "+(E.personal.apuHist.neto>=0?"+":"")+plata(E.personal.apuHist.neto)+" en "+E.personal.apuHist.jug+" apuestas."});
  }
  return hechas;
}
function panelApuestas(){
  const p=panel("Apuestas deportivas","🎟️");
  const f=fechaApostable(), pend=(E.personal.apuestas||[]);
  p.cuerpo.appendChild(el("p","mini","Cuotas con el "+Math.round(MARGEN_CASA*100)+" % de margen de la casa, como las de verdad: a la larga, pierdes. Apostar a tu propio partido está prohibido por reglamento."+
    (E.personal.apuHist?" Llevas "+(E.personal.apuHist.neto>=0?"+":"")+plata(E.personal.apuHist.neto)+" en "+E.personal.apuHist.jug+" apuestas.":"")));
  if(pend.length) p.cuerpo.appendChild(el("div","resul mitad","En juego: "+pend.map(a=>escHtml(a.na+"–"+a.nb)+" ("+({L:"local",X:"empate",V:"visita"})[a.pick]+", "+plata(a.monto)+" a "+a.cuota.toFixed(2)+")").join(" · ")));
  if(!f){ p.cuerpo.appendChild(el("p","mini","No hay una fecha de liga por delante para apostar.")); return p; }
  let monto=_r2(Math.min(1,Math.max(0.1,(E.personal.bolsillo||0)/10)));
  const maxB=Math.max(0.1,_r2(E.personal.bolsillo||0));
  const lb=el("label","lb","Monto por apuesta: <b>"+plata(monto)+"</b>"); p.cuerpo.appendChild(lb);
  const row=el("div"); row.style.cssText="display:flex;gap:8px;align-items:center";
  const sm=el("input"); sm.type="range"; sm.min=0.1; sm.max=maxB; sm.step=0.1; sm.value=monto; sm.className="rango"; sm.style.flex="1";
  const nm=el("input"); nm.type="number"; nm.min=0.1; nm.max=maxB; nm.step=0.1; nm.value=monto; nm.className="apu-monto"; nm.style.cssText="width:88px;padding:7px;border-radius:8px;border:1px solid rgba(0,0,0,.15)";
  const sync=v=>{ monto=_r2(Math.max(0.1,Math.min(parseFloat(v)||0.1,maxB))); sm.value=monto; nm.value=monto; lb.querySelector("b").textContent=plata(monto); };
  sm.oninput=()=>sync(sm.value); nm.onchange=()=>sync(nm.value);
  row.appendChild(sm); row.appendChild(nm); p.cuerpo.appendChild(row);
  const tab=el("div","apu-lista");
  f.pares.forEach(par=>{
    const a=_clubApu(par.a), b=_clubApu(par.b), c=cuotas1X2(a,b);
    const ya=pend.some(x=>x.idx===f.idx&&x.a===par.a&&x.b===par.b);
    const r=el("div","apu-fila"+(par.mio?" mio":""));
    r.appendChild(el("span","apu-par",escHtml((a.c||a.n)+" – "+(b.c||b.n))+(par.mio?" <span class='mini rojo'>tu partido</span>":"")));
    ["L","X","V"].forEach(k=>{
      const bt=el("button","btn-aqua chico apu-cuota",({L:"1",X:"X",V:"2"})[k]+" · "+c[k].toFixed(2));
      bt.disabled=ya||(E.personal.bolsillo||0)<=0;
      bt.onclick=()=>{
        if(par.mio&&!confirm("Apostar a tu propio partido está prohibido por el reglamento de la ANFP. Si se sabe, es un escándalo. ¿Apostar igual?")) return;
        const ap=apostar(par,k,monto,c[k],f.idx); if(ap){ aviso("Apostaste "+plata(ap.monto)+" a "+c[k].toFixed(2)+" · si sale, cobras "+plata(_r2(ap.monto*ap.cuota))+"."); render(); }
      };
      r.appendChild(bt);
    });
    tab.appendChild(r);
  });
  p.cuerpo.appendChild(tab);
  return p;
}
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._vrC) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._vrC=true; window[nom]=w; };
  envolver("terminarPartido",o=>function(){ const r=o.apply(this,arguments); try{ resolverApuestas(); }catch(e){} return r; });
  envolver("finDeTemporada",o=>function(){ try{ cierrePatrimonio(); resolverApuestas(); }catch(e){} return o.apply(this,arguments); });
})();
if(typeof document!=="undefined"&&!document.getElementById("css-vida-c")){
  const st=document.createElement("style"); st.id="css-vida-c";
  st.textContent=".apu-lista{display:flex;flex-direction:column;gap:6px;margin-top:8px}"+
    ".apu-fila{display:grid;grid-template-columns:1fr repeat(3,auto);gap:6px;align-items:center;padding:6px 8px;border-radius:8px;background:rgba(0,0,0,.04)}"+
    ".apu-fila.mio{background:rgba(200,40,40,.08);outline:1px solid rgba(200,40,40,.25)}"+
    ".apu-par{font-size:13px;min-width:0;overflow:hidden;text-overflow:ellipsis}"+
    ".apu-cuota{min-width:64px;font-variant-numeric:tabular-nums}"+
    "@media (max-width:560px){.apu-fila{grid-template-columns:repeat(3,1fr)}.apu-par{grid-column:1/-1}}"+
    ".pat-cat summary{cursor:pointer;font-weight:600;margin:8px 0 4px}"+
    ".fila.pat-bien{flex-wrap:wrap;gap:6px}.fila.pat-bien>span{flex:1 1 55%;min-width:0}.fila.pat-bien>button{flex:0 0 auto}";
  document.head.appendChild(st);
}

/* ============================================================
   Parte D (7.9069): la pérdida de un hijo llega con aviso.
   Pedido del autor: "con aviso antes". Un hijo chico se enferma o tiene un accidente; hay semanas de
   seguimiento y dos decisiones tuyas cambian el riesgo. El final no está escrito: puede salir adelante.
   (Riesgos base moderados; los tratamientos serios los bajan, la terapia milagrosa de redes los sube.)
   ============================================================ */
const CRISIS_HIJO=[
  {id:"neumonia",  n:"una neumonía grave",       semanas:4,  riesgo:0.10, d:"Empezó como un resfrío. Ahora está internado con oxígeno."},
  {id:"meningitis",n:"una meningitis",           semanas:5,  riesgo:0.18, d:"Fiebre, el cuello rígido y un médico que habla despacio. Está en la UCI pediátrica."},
  {id:"accidente", n:"un accidente de tránsito", semanas:4,  riesgo:0.22, d:"Iba en el auto con la familia de un compañero. Está en la UCI, estable pero grave."},
  {id:"leucemia",  n:"una leucemia",             semanas:10, riesgo:0.15, d:"Los exámenes de rutina salieron mal. La quimioterapia empieza la próxima semana."}
];
const CRISIS_PROB_SEMANA=0.00035;   /* por hijo de hasta 12 años: ~1,2 % por temporada */
function _k14(){ return ((typeof inflacionEra==="function")?inflacionEra():1.4)/1.4; }
function iniciarCrisisHijo(h,tipoId){
  const p=E.perfil; if(!p||!h||p.crisisHijo) return null;
  const t=CRISIS_HIJO.find(x=>x.id===tipoId)||elige(CRISIS_HIJO);
  p.crisisHijo={nombre:h.nombre, tipo:t.id, n:t.n, semana:0, total:t.semanas, riesgo:t.riesgo, anio:E.anio, fase:0, licencia:0};
  p.bienestar=clamp((p.bienestar||70)-15,0,100);
  notificar({t:h.nombre+": "+t.n,tipo:"malo",bandeja:true,d:t.d+" Van a ser unas "+t.semanas+" semanas. Lo que decidas cuenta."});
  if(typeof recordar==="function") recordar("familia",h.nombre+" enfrentó "+t.n,{peso:"alto",tono:"malo"});
  _sembrarDecisionCrisis(1);
  return p.crisisHijo;
}
function _sembrarDecisionCrisis(fase){
  const c=E.perfil.crisisHijo; if(!c) return null;
  const k=_k14(), id="proc_crisis_"+E.anio+"_"+(E.idx||0)+"_"+fase;
  const ok=(txt)=>({txt:txt,ef:{}});
  const ops=fase===1?[
    {t:"Pedir licencia: el ayudante dirige los próximos 3 partidos",d:"Estar ahí. El club lo entiende; los resultados, no siempre.",dif:10,cr:{riesgo:-0.03,bien:6,par:10,licencia:3},
      bien:ok("Pediste licencia. En la clínica te ven llegar todos los días."),mitad:ok("Pediste licencia. El directorio lo acepta con cara larga."),mal:ok("Pediste licencia. En el club ya hay quien habla de reemplazo.")},
    {t:"Seguir dirigiendo y dormir en la clínica",d:"Los dos frentes a la vez. El cuerpo pasa la cuenta.",dif:30,cr:{bien:-10,par:-4},
      bien:ok("Aguantas. No sabes cómo, pero aguantas."),mitad:ok("Dormiste cuatro horas en una semana."),mal:ok("Te quedaste dormido en la charla técnica.")},
    {t:"Dejarlo en manos de tu pareja y enfocarte en el club",d:"Alguien tiene que seguir trabajando. O eso te dices.",dif:40,cr:{bien:-6,par:-18},
      bien:ok("Tu pareja no dijo nada. No hacía falta."),mitad:ok("En la clínica preguntan por ti."),mal:ok("Tu hijo preguntó por ti tres días seguidos.")}
  ]:[
    {t:"Trasladarlo a una clínica privada con especialista",d:"La mejor opción que hay. Cuesta "+plata(Math.round(35*k*10)/10)+" de tu bolsillo.",dif:15,cr:{riesgo:-0.08,costo:Math.round(35*k*10)/10,bien:2},
      bien:ok("El especialista cambió el tratamiento el primer día."),mitad:ok("La clínica es buena. La cuenta también."),mal:ok("El traslado fue duro, pero ya está.")},
    {t:"Seguir en el hospital público: lo están haciendo bien",d:"Médicos que ven esto todos los días. Sin costo.",dif:25,cr:{riesgo:-0.02,bien:1},
      bien:ok("La doctora de turno lo conoce por su nombre."),mitad:ok("Hay espera, pero lo atienden bien."),mal:ok("Faltan camas, pero lo están cuidando.")},
    {t:"Probar la terapia que un conocido promociona en redes",d:"Te la juran milagrosa. Cuesta "+plata(Math.round(8*k*10)/10)+".",dif:60,cr:{riesgo:0.06,costo:Math.round(8*k*10)/10},
      bien:ok("No le hizo nada. Por suerte, tampoco daño."),mitad:ok("El médico te pidió que no le dieras nada más sin preguntarle."),mal:ok("Tuvieron que suspenderla: le hizo mal.")}
  ];
  E.decProc=E.decProc||{};
  E.decProc[id]={id:id,buzon:"gris",peso:"alto",crisisHijo:fase,posturas:{},
    t:(fase===1?c.nombre+" está grave":"El médico propone opciones para "+c.nombre),
    d:(fase===1?"Te llaman de la clínica: "+c.n+". ¿Cómo te organizas estas semanas?":"Van "+c.semana+" semanas. El tratamiento puede cambiar."), op:ops};
  E.decPend=E.decPend||[];
  E.decPend.push({id:id,clave:id,peso:"alto"});
  c.fase=fase;
  return E.decProc[id];
}
function efectoCrisis(dec,op){
  const p=E.perfil, c=p&&p.crisisHijo, cr=op&&op.cr; if(!c||!cr) return "";
  const b0=Math.round(p.bienestar||70), p0=p.pareja?Math.round(p.pareja.nivel||65):null;
  let pagado=1;
  if(cr.costo){ const bol=(E.personal&&E.personal.bolsillo)||0; pagado=Math.min(1,bol/cr.costo); E.personal.bolsillo=Math.max(0,bol-cr.costo); }
  if(cr.riesgo) c.riesgo=clamp(c.riesgo+cr.riesgo*(cr.riesgo<0?pagado:1),0.02,0.6);
  if(cr.bien) p.bienestar=clamp((p.bienestar||70)+cr.bien,0,100);
  if(cr.par&&p.pareja) p.pareja.nivel=clamp((p.pareja.nivel||65)+cr.par,0,100);
  if(cr.licencia) c.licencia=cr.licencia;
  return "Bienestar "+b0+"→"+Math.round(p.bienestar)+(p0!=null?" · pareja "+p0+"→"+Math.round(p.pareja.nivel):"")+(cr.costo?" · pagaste "+plata(Math.round(cr.costo*pagado*10)/10)+(pagado<1?" (no alcanzó para todo)":""):"")+".";
}
/* una semana más de clínica; al final, el desenlace */
function tickCrisisHijo(forzar){
  const p=E.perfil, c=p&&p.crisisHijo; if(!c) return null;
  c.semana++;
  p.bienestar=clamp((p.bienestar||70)-2,0,100);
  if(c.fase===1&&c.semana>=Math.max(2,Math.floor(c.total/2))) _sembrarDecisionCrisis(2);
  if(c.semana<c.total) return null;
  const h=(p.hijos||[]).find(x=>x.nombre===c.nombre&&!x.fallecido);
  const muere=forzar!=null?forzar:(Math.random()<c.riesgo);
  p.crisisHijo=null;
  if(!h) return null;
  if(muere){
    h.fallecido=E.anio;
    p.bienestar=clamp((p.bienestar||70)-45,0,100);
    if(p.pareja) p.pareja.nivel=clamp((p.pareja.nivel||65)-15,0,100);
    aplicarEfectos({moral:-8});
    E.flags=E.flags||{}; E.flags.duelo={anio:E.anio,idx:E.idx,n:h.nombre};
    notificar({t:"Murió "+h.nombre,tipo:"malo",bandeja:true,d:"Después de "+c.total+" semanas, "+c.n+" pudo más. No hay forma de escribir esto bien. El club te da los días que necesites. El plantel viste brazalete negro el domingo."});
    if(typeof recordar==="function") recordar("familia","murió tu hijo "+h.nombre,{peso:"alto",tono:"malo"});
    return "murio";
  }
  p.bienestar=clamp((p.bienestar||70)+18,0,100);
  if(p.pareja) p.pareja.nivel=clamp((p.pareja.nivel||65)+8,0,100);
  notificar({t:h.nombre+" salió adelante",tipo:"bueno",bandeja:true,d:"Le dieron el alta después de "+c.total+" semanas. Vuelve a la casa. Vas a mirar distinto cada partido que venga."});
  if(typeof recordar==="function") recordar("familia",h.nombre+" salió adelante de "+c.n,{peso:"alto",tono:"bueno"});
  return "salio";
}
/* sin muertes de golpe: cada semana, una chance chica de que empiece una crisis con aviso */
function chequearCrisisHijo(){
  const p=E&&E.perfil; if(!p||p.crisisHijo||!p.hijos||E._bulkSim) return null;
  const chicos=p.hijos.filter(h=>!h.fallecido&&!h.enPlantel&&((E.anio||2026)-(h.nacido||E.anio))<=12);
  for(const h of chicos){ if(Math.random()<CRISIS_PROB_SEMANA) return iniciarCrisisHijo(h); }
  return null;
}
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._vrD) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._vrD=true; window[nom]=w; };
  envolver("tickSemana",o=>function(){ const r=o.apply(this,arguments); try{ if(E.perfil&&E.perfil.crisisHijo) tickCrisisHijo(); else chequearCrisisHijo(); }catch(e){} return r; });
  envolver("resolverDecision",o=>function(dec,idx){
    const op=dec&&dec.op&&dec.op[idx];
    const r=o.apply(this,arguments);
    try{ if(r&&dec&&dec.crisisHijo&&op){ const x=efectoCrisis(dec,op); r.extra=(r.extra?r.extra+" ":"")+x; } }catch(e){}
    return r;
  });
  /* licencia: el ayudante dirige los próximos partidos */
  envolver("pantallaPrevia",o=>function(part){
    try{ const c=E.perfil&&E.perfil.crisisHijo; if(part&&c&&c.licencia>0&&part.tipo!=="amistoso"&&!part._licencia){ part._licencia=true; part._forzarSimular=true; part._familiaHecha=true; c.licencia--; } }catch(e){}
    return o.apply(this,arguments);
  });
})();
