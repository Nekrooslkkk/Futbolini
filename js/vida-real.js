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
