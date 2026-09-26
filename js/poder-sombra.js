"use strict";
/* ============================================================
   FUTBOLINI · poder-sombra.js  (7.9081) · Poder y corrupción
   La idea del juego: "sobre la mierda que podés llegar a ser manejando poder, y lo que eso le hace
   a tu vida personal". La corrupción ya existía, repartida (desfalco, sospecha en la ANFP, pactos
   con la barra, doping, apostar a tu partido), pero pegaba en el club, casi nunca en tu casa.
   1) LA SOMBRA: un solo número (0–100) de lo que hiciste, con su desglose. Mezcla lo vivo
      (desfalco en curso, sospecha en la asociación, pactos en pie) con un registro que no se borra
      (E.sombra.log: doping, apuestas, favores aceptados…) que se va apagando con los años.
   2) LA SOMBRA ENTRA A TU CASA: con sombra alta pasan cosas en tu vida: tu pareja pregunta,
      a tu hijo lo molestan en el colegio, dejas de dormir, los amigos de verdad se alejan; si hay
      investigación, allanan tu casa y el abogado sale de tu bolsillo.
   3) LOS FAVORES DEL PODER: con poder, llegan tentaciones con nombre y apellido de rol (nunca de
      personas reales): el reloj del representante, el cuñado que quiere un puesto, la universidad
      del hijo a cambio de un titular. Aceptar suma sombra; rechazar tiene su costo.
   Tono: realista, sin moralina ni caricatura. Nadie te castiga por ser malo: te pasan cosas.
   ============================================================ */
function _sombraE(){ if(!E) return null; E.sombra=E.sombra||{log:[],vistos:{},ultEvento:-99,ultFavor:-99}; E.sombra.log=E.sombra.log||[]; E.sombra.vistos=E.sombra.vistos||{}; return E.sombra; }
function anotarSombra(tipo,peso,txt){
  const s=_sombraE(); if(!s) return;
  s.log.push({tipo:tipo,peso:peso,txt:txt||"",anio:E.anio,idx:E.idx||0});
  if(s.log.length>80) s.log.shift();
}
/* cuánto pesa hoy cada fuente (el registro se apaga un 35 % por temporada) */
function sombraDesglose(){
  const s=_sombraE(); if(!s) return [];
  const out=[];
  const desf=(E.flags&&E.flags.desfalco)||0;
  if(desf>0) out.push({k:"desfalco",n:"Plata del club en tu bolsillo",v:Math.min(40,desf/12),d:plata(desf)+" desviados"+(E.flags.investigacionAbierta?" · hay investigación":"")});
  const sos=(E.fed&&E.fed.sospecha)||0;
  if(sos>0) out.push({k:"fed",n:"Sospechas en la asociación",v:Math.min(35,sos*0.4),d:"sospecha "+Math.round(sos)+"/100"});
  const pv=(typeof pactosVigentes==="function")?pactosVigentes():0;
  if(pv>0) out.push({k:"barra",n:"Pactos con la barra",v:pv*6,d:pv+" en pie"});
  const porTipo={};
  s.log.forEach(x=>{ const edad=Math.max(0,(E.anio||0)-(x.anio||0)); const v=x.peso*Math.pow(0.65,edad); porTipo[x.tipo]=(porTipo[x.tipo]||{v:0,n:0}); porTipo[x.tipo].v+=v; porTipo[x.tipo].n++; });
  const NOM={doping:"Preparados especiales",apuesta:"Apuestas a tu propio partido",favor:"Favores aceptados",soplo:"Datos comprados",desvio:"Desvíos de caja"};
  Object.keys(porTipo).forEach(k=>{ if(k==="desvio"&&desf>0) return; out.push({k:k,n:NOM[k]||k,v:porTipo[k].v,d:porTipo[k].n+(porTipo[k].n===1?" vez":" veces")}); });
  return out.filter(x=>x.v>=0.5).sort((a,b)=>b.v-a.v);
}
function sombraActual(){ return clamp(Math.round(sombraDesglose().reduce((t,x)=>t+x.v,0)),0,100); }
function etiquetaSombra(v){ return v>=70?"la gente habla de ti en voz baja":(v>=45?"hay cosas que no puedes contar":(v>=20?"tienes un par de cosas guardadas":"limpio, por ahora")); }
/* ---------- registro: envolver los actos que ya existían ---------- */
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._sb) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._sb=true; w._orig=o; window[nom]=w; };
  envolver("doparEquipo",o=>function(){ const r=o.apply(this,arguments); try{ anotarSombra("doping",22,"preparado especial"); }catch(e){} return r; });
  envolver("desviarFondos",o=>function(monto){ const d0=(E.flags&&E.flags.desfalco)||0; const r=o.apply(this,arguments); try{ if(((E.flags&&E.flags.desfalco)||0)>d0) anotarSombra("desvio",8,"desvío de caja"); }catch(e){} return r; });
  envolver("apostar",o=>function(par){ const r=o.apply(this,arguments); try{ if(r&&par&&par.mio) anotarSombra("apuesta",r.contra?26:14,r.contra?"apuesta contra tu equipo":"apuesta a tu partido"); }catch(e){} return r; });
})();
/* ---------- la sombra entra a tu casa ---------- */
const SOMBRA_CASA=[
  {id:"pareja_pregunta",req:p=>!!p.pareja,min:25,t:"«¿De dónde salió esa plata?»",
   d:"Tu pareja vio el estado de cuenta, o el auto nuevo, o te escuchó hablando por teléfono en el patio. Te lo pregunta en la cocina, bajito, para que no escuchen los niños.",
   op:[["Contarle todo","Lo que hiciste, sin adornos. Lo que pase después es de los dos.",{par:-8,bien:-4,sombra:-4,rep:{credibilidad:2}}],
       ["Mentirle con una historia creíble","Un bono, un préstamo, un negocio de un amigo.",{par:-2,bien:-6}],
       ["«No es tema tuyo»","Cierras la conversación. Se cierra algo más.",{par:-16,bien:-3}]]},
  {id:"hijo_colegio",req:p=>(p.hijos||[]).some(h=>!h.fallecido&&(E.anio-(h.nacido||E.anio))>=6&&(E.anio-(h.nacido||E.anio))<=17),min:40,t:"A tu hijo lo molestan en el colegio",
   d:"Salió tu nombre en la prensa y en el colegio le dicen «el hijo del ladrón». Llegó callado, con la mochila rota. No quiere volver mañana.",
   op:[["Hablar con él de verdad","Decirle lo que es cierto y lo que no. Aunque te mire distinto.",{bien:-6,hijo:"habla",rep:{credibilidad:1}}],
       ["Cambiarlo a un colegio privado","Plata para que no tenga que escuchar. El problema viaja con él.",{bolsillo:-6,bien:-2}],
       ["Decirle que son envidias","Proteges tu imagen delante de él.",{bien:-3,hijo:"miente"}]]},
  {id:"insomnio",req:()=>true,min:35,t:"No duermes",
   d:"Tres de la mañana y estás mirando el techo. Cada vez que suena el teléfono pensás que es un periodista o un fiscal. El médico del club te ve cara de nada y pregunta.",
   op:[["Ir al psicólogo","Una hora a la semana. Hablar con alguien que no quiere nada de ti.",{bien:10,bolsillo:-1}],
       ["Pastillas para dormir","Duermes. Lo demás sigue ahí.",{bien:4}],
       ["Aguantar","El DT no se quiebra. Eso dicen.",{bien:-8}]]},
  {id:"amigos",req:()=>true,min:50,t:"Los amigos de verdad ya no llaman",
   d:"El asado de fin de mes se hizo sin ti. Nadie te avisó. En cambio, tu teléfono está lleno de números nuevos que siempre quieren algo.",
   op:[["Llamar tú al de siempre","Pedirle un café. Sin excusas.",{bien:6,par:2}],
       ["Rodearte de los nuevos","Tienen plata, contactos y nunca preguntan nada.",{bien:-4,sombra:4}],
       ["Encerrarte en el trabajo","El club te llena el día. La noche es otra cosa.",{bien:-6}]]},
  {id:"allanamiento",req:()=>!!(E.flags&&E.flags.investigacionAbierta),min:30,alto:true,t:"Allanan tu casa a las seis de la mañana",
   d:"La PDI toca el timbre con una orden. Se llevan el computador, carpetas, el teléfono. Tus hijos miran desde la escalera. Tu pareja no te habla mientras los detectives revisan los cajones.",
   op:[["Colaborar y contratar un buen abogado","Caro, pero serio. Ya no hay nada que esconder, o eso dices.",{bolsillo:-25,par:-8,bien:-12,abogado:true}],
       ["Abogado del club, que pague el club","Tu problema pasa a ser del club.",{par:-10,bien:-10,club:{plata:-40},grupos:{directorio:-14,socios:-10}}],
       ["Salir a la prensa a decir que es persecución","Te victimizas antes de que te pregunten.",{par:-12,bien:-8,rep:{credibilidad:-6,publica:4},grupos:{hinchada:6,prensa:-8}}]]}
];
function _sombraAplicar(o){
  const p=E.perfil||{}, antes={b:Math.round(p.bienestar||70), pa:p.pareja?Math.round(p.pareja.nivel||65):null, bol:(E.personal&&E.personal.bolsillo)||0};
  const k=((typeof inflacionEra==="function")?inflacionEra():1.4)/1.4;
  if(o.bien) p.bienestar=clamp((p.bienestar||70)+o.bien,0,100);
  if(o.par&&p.pareja) p.pareja.nivel=clamp((p.pareja.nivel||65)+o.par,0,100);
  if(o.bolsillo&&E.personal) E.personal.bolsillo=Math.max(0,(E.personal.bolsillo||0)+o.bolsillo*k);
  if(o.rep) aplicarRep(o.rep);
  if(o.grupos) aplicarGrupos(o.grupos);
  if(o.club) aplicarEfectos(o.club);
  if(o.sombra) anotarSombra("favor",o.sombra,"decisión personal");
  if(o.abogado){ const s=_sombraE(); s.abogado=(E.anio||0); }
  if(o.hijo) (E.flags=E.flags||{})["hijoSabe_"+o.hijo]=E.anio;
  const bits=["bienestar "+antes.b+"→"+Math.round(p.bienestar||70)];
  if(antes.pa!=null) bits.push("pareja "+antes.pa+"→"+Math.round(p.pareja.nivel));
  if(o.bolsillo) bits.push("bolsillo "+(o.bolsillo<0?"−":"+")+plata(Math.abs(o.bolsillo*k)));
  return bits.join(" · ");
}
function sembrarSombraCasa(forzarId){
  const s=_sombraE(); if(!s||!E.perfil) return null;
  const v=sombraActual(), p=E.perfil;
  if(!forzarId&&((E.idx||0)-s.ultEvento<5||E._bulkSim)) return null;
  const pool=SOMBRA_CASA.filter(x=>(forzarId?x.id===forzarId:(v>=x.min&&!s.vistos[x.id+"_"+E.anio]))&&x.req(p));
  if(!pool.length) return null;
  /* con investigación abierta, el allanamiento va primero */
  const ev=pool.find(x=>x.alto)||elige(pool);
  const id="proc_sombra_"+ev.id+"_"+E.anio+"_"+(E.idx||0);
  E.decProc=E.decProc||{};
  E.decProc[id]={id:id,buzon:"gris",peso:ev.alto?"alto":"medio",t:ev.t,d:ev.d,posturas:{},sombraCasa:ev.id,
    op:ev.op.map(o=>({t:o[0],d:o[1],dif:30,so:o[2],bien:{txt:"Lo hiciste.",ef:{}},mitad:{txt:"Lo hiciste, a medias.",ef:{}},mal:{txt:"Lo hiciste y salió peor de lo que pensabas.",ef:{}}}))};
  E.decPend=E.decPend||[];
  E.decPend.push({id:id,clave:id,peso:ev.alto?"alto":"medio"});
  s.vistos[ev.id+"_"+E.anio]=true; s.ultEvento=E.idx||0;
  return E.decProc[id];
}
/* ---------- los favores del poder (tentaciones) ---------- */
const FAVORES_PODER=[
  {id:"reloj",t:"Un regalo del representante",d:"Llega a tu casa una caja con un reloj que vale lo que gana un utilero en tres años. La tarjeta es de un representante con tres jugadores que quiere colocar en el club.",
   op:[["Quedártelo","Es solo un reloj. Nadie te pidió nada todavía.",{sombra:10,bolsillo:12,rep:{credibilidad:-2}}],
       ["Devolverlo con una nota educada","Sin portazo, sin deuda.",{grupos:{prensa:2},rep:{credibilidad:3}}],
       ["Devolverlo y contarlo en el directorio","Que quede escrito.",{grupos:{directorio:6},rep:{credibilidad:5,dureza:2}}]]},
  {id:"cunado",t:"Tu cuñado quiere trabajar en el club",d:"Está sin pega hace meses y tu pareja te lo pide en la cena del domingo. El club tiene un puesto en el área comercial. Él no sabe nada de fútbol, pero es buena persona.",
   op:[["Hacerle el puesto","La familia primero. Nadie tiene por qué enterarse.",{sombra:8,par:8,grupos:{directorio:-4}}],
       ["Mandarlo a postular como todos","Si queda, queda.",{par:-4,rep:{credibilidad:2}}],
       ["Decir que no, de frente","Te cuesta la paz en la casa.",{par:-10,rep:{credibilidad:3}}]]},
  {id:"universidad",t:"La universidad de tu hijo",d:"Un empresario que auspicia al club te ofrece pagar la universidad de tu hijo. En la misma conversación menciona a un juvenil que él representa y que no está jugando.",
   req:p=>(p.hijos||[]).some(h=>!h.fallecido),
   op:[["Aceptar y poner al chico","Tu hijo estudia tranquilo. El juvenil juega.",{sombra:16,bolsillo:20,grupos:{camarin:-6}}],
       ["Aceptar la beca, no el trato","Le dices que el juvenil juega si se lo gana. Él sonríe.",{sombra:8,bolsillo:20}],
       ["No aceptar nada","Tu hijo va a estudiar con crédito, como tantos.",{rep:{credibilidad:4},bien:-2}]]},
  {id:"contrato_tv",t:"«No mires ese contrato»",d:"Un dirigente de la asociación te pide que, cuando se vote, no preguntes por un contrato de TV. A cambio, el calendario de tu club va a salir más amable.",
   req:()=>!!(E.fed&&E.fed.presidente)||(E.capital||0)>=50,
   op:[["No mirar","El calendario ayuda. La conciencia, menos.",{sombra:14,club:{capital:6},grupos:{anfp:10}}],
       ["Preguntar igual en la votación","Te ganas un enemigo con cargo.",{grupos:{anfp:-12,prensa:6},rep:{credibilidad:5,dureza:3}}],
       ["Filtrarlo a un periodista","Sin tu nombre. Por ahora.",{grupos:{anfp:-6,prensa:10},sombra:4}]]},
  {id:"fiesta",t:"La fiesta del auspiciador",d:"Un auspiciador te invita a una fiesta privada en la playa. Van dirigentes, un par de jugadores de otros clubes y gente que nunca sale en las fotos. Tu pareja no está invitada.",
   op:[["Ir solo","Es parte del trabajo, dices.",{sombra:6,par:-8,grupos:{sponsors:8}}],
       ["Ir con tu pareja aunque no esté invitada","Te miran raro. Te vas temprano.",{grupos:{sponsors:2},par:4}],
       ["No ir","Mañana hay entrenamiento.",{grupos:{sponsors:-4},bien:2}]]}
];
function _hayPoder(){ return (E.ind&&E.ind.prestigio>=60)||(E.capital||0)>=45||!!(E.fed&&E.fed.presidente); }
function sembrarFavor(forzarId){
  const s=_sombraE(); if(!s||!E.perfil) return null;
  if(!forzarId&&(E._bulkSim||!_hayPoder()||(E.idx||0)-s.ultFavor<8)) return null;
  const pool=FAVORES_PODER.filter(x=>(forzarId?x.id===forzarId:!s.vistos["fav_"+x.id])&&(!x.req||x.req(E.perfil)));
  if(!pool.length) return null;
  const ev=elige(pool);
  const id="proc_favor_"+ev.id+"_"+E.anio+"_"+(E.idx||0);
  E.decProc=E.decProc||{};
  E.decProc[id]={id:id,buzon:"gris",peso:"medio",t:ev.t,d:ev.d,posturas:{},favorPoder:ev.id,
    op:ev.op.map(o=>({t:o[0],d:o[1],dif:30,so:o[2],bien:{txt:"Hecho.",ef:{}},mitad:{txt:"Hecho, con dudas.",ef:{}},mal:{txt:"Hecho. No te dejó tranquilo.",ef:{}}}))};
  E.decPend=E.decPend||[];
  E.decPend.push({id:id,clave:id,peso:"medio"});
  s.vistos["fav_"+ev.id]=true; s.ultFavor=E.idx||0;
  return E.decProc[id];
}
/* abogado: mientras dure la investigación, sale de tu bolsillo */
function cobrarAbogado(){
  const s=_sombraE(); if(!s||s.abogado==null) return 0;
  if(!(E.flags&&E.flags.investigacionAbierta)){ s.abogado=null; return 0; }
  const k=((typeof inflacionEra==="function")?inflacionEra():1.4)/1.4, c=Math.round(0.8*k*100)/100;
  E.personal.bolsillo=Math.max(0,(E.personal.bolsillo||0)-c);
  return c;
}
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._sb2) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._sb2=true; w._orig=o; window[nom]=w; };
  envolver("resolverDecision",o=>function(dec,idx){
    const op=dec&&dec.op&&dec.op[idx];
    const r=o.apply(this,arguments);
    try{ if(r&&dec&&(dec.sombraCasa||dec.favorPoder)&&op&&op.so){ const x=_sombraAplicar(op.so); r.extra=(r.extra?r.extra+" ":"")+x+".";
      if(typeof recordar==="function") recordar(dec.favorPoder?"poder":"familia",(dec.favorPoder?"frente a «"+dec.t+"» elegiste: ":"cuando pasó «"+dec.t+"» elegiste: ")+op.t.toLowerCase(),{peso:"medio",tono:(op.so.sombra||0)>0?"malo":"neutro"}); } }catch(e){}
    return r;
  });
  envolver("tickSemana",o=>function(){ const r=o.apply(this,arguments);
    try{ cobrarAbogado();
      const v=sombraActual(), p=Math.min(0.35,v/100*0.45);
      if(Math.random()<p) sembrarSombraCasa();
      else if(_hayPoder()&&Math.random()<0.1) sembrarFavor();
    }catch(e){}
    return r; });
})();
/* ---------- panel: tu sombra (Vida y Carrera) ---------- */
function panelSombra(){
  const v=sombraActual(), des=sombraDesglose();
  const p=panel("Tu sombra","🌑");
  const col=v>=70?"#8e1b1b":(v>=45?"#c0392b":(v>=20?"#d68a1f":"#2f8f4e"));
  p.cuerpo.appendChild(el("div","sombra-cab","<b style='color:"+col+"'>"+v+"/100</b> <span class='mini'>· "+escHtml(etiquetaSombra(v))+"</span>"));
  p.cuerpo.appendChild(el("div",null,barrita(v,col)));
  if(!des.length) p.cuerpo.appendChild(el("p","mini","Nada que esconder. El poder todavía no te pidió nada que no pudieras contar en tu casa."));
  else {
    p.cuerpo.appendChild(el("p","mini","Lo que pesa hoy (lo viejo se va apagando, no desaparece):"));
    des.forEach(x=>p.cuerpo.appendChild(fila(escHtml(x.n),Math.round(x.v)+" · <span class='mini'>"+escHtml(x.d)+"</span>")));
    p.cuerpo.appendChild(el("p","mini","Con la sombra alta pasan cosas en tu casa: preguntas en la cocina, un hijo que no quiere ir al colegio, noches sin dormir."));
  }
  if(E.sombra&&E.sombra.abogado!=null&&E.flags&&E.flags.investigacionAbierta) p.cuerpo.appendChild(el("div","resul mal","⚖️ Pagas abogado cada semana mientras siga la investigación."));
  return p;
}
(function(){
  ["vistaVida","vistaCarrera"].forEach(nom=>{
    const o=window[nom]; if(typeof o!=="function"||o._sb) return;
    const w=function(){ const r=o.apply(this,arguments); try{
      const v=document.getElementById("vista"), host=(v&&v.querySelector(":scope > .ventana-so.in-vista :is(.so-cuerpo,.window-body)"))||v;
      if(host&&E&&(nom==="vistaCarrera"||sombraActual()>0||(E.sombra&&E.sombra.log&&E.sombra.log.length))){ const ps=panelSombra(); if(nom==="vistaCarrera") host.insertBefore(ps,host.children[1]||null); else host.appendChild(ps); }
    }catch(e){ console.error("sombra:",e); } return r; };
    Object.keys(o).forEach(k=>w[k]=o[k]); w._sb=true; w._orig=o; window[nom]=w;
  });
})();
