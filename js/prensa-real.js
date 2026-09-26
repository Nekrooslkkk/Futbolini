"use strict";
/* ============================================================
   FUTBOLINI · prensa-real.js  (7.9065)
   Pedidos del autor (etapa 3, tarea 16):
   - Conferencias: más preguntas, respuestas que calcen, sin texto libre, sin delegar a la mitad.
     (El cambio de cantidad y la sala viven en ui-partido.js; las respuestas en data-respuestas.js.)
   - Trivia: matemática variada (no siempre la misma suma), menos fútbol chileno de memoria,
     nada de "¿cuánto nivel tiene?", y más de una por partido.
   - Clima con utilidad real: cambia qué plan conviene, cuánta gente va y cuánto se lesiona.
   ============================================================ */

/* ---------- prensa: los tonos se entienden en las dos salas ---------- */
(function(){
  if(typeof CONF_ARQ!=="undefined"){
    const a={humilde:"calma",foco:"calma",bancar:"confianza",elogio:"confianza",respaldo:"confianza",agrandado:"palo",arbitro:"palo"};
    Object.keys(a).forEach(k=>{ if(!CONF_ARQ[k]) CONF_ARQ[k]=CONF_ARQ[a[k]]; });
  }
  if(typeof POST_ARQ!=="undefined"){
    const b={calma:"humilde",confianza:"bancar"};
    Object.keys(b).forEach(k=>{ if(!POST_ARQ[k]) POST_ARQ[k]=POST_ARQ[b[k]]; });
  }
  if(typeof aplicarRespuestasVoz==="function") aplicarRespuestasVoz();
})();
/* ---------- 7.9069 · cuántas preguntas: según el partido ---------- */
/* un clásico, una final, una copa internacional o un DT en la cuerda floja llenan la sala */
function partidoPesado(part){
  if(!part) return {pesa:false,porque:""};
  const r=[];
  try{ if(typeof esClasico==="function"&&esClasico(part)) r.push("clásico"); }catch(e){}
  if(part.ronda==="FINAL"||part.ronda==="Semifinal") r.push(part.ronda==="FINAL"?"final":"semifinal");
  if(part.tipo==="copa"&&/Libertadores|Sudamericana/i.test(part.torneo||"")) r.push("copa internacional");
  if(/Liguilla|Playoff/i.test((part.ronda||"")+" "+(part.torneo||""))) r.push("liguilla");
  if(((E.temporada&&E.temporada.sinGanar)||0)>=3) r.push("racha sin ganar");
  try{ if(typeof riesgoDestitucion==="function"&&riesgoDestitucion()) r.push("tu puesto en duda"); }catch(e){}
  if(E.calendario&&E.calendario.indexOf(part)===E.calendario.length-1) r.push("último partido del año");
  return {pesa:r.length>0, porque:r.join(", ")};
}
function nPreguntasConf(part){
  if(part&&part.tipo==="amistoso") return 2;
  const p=partidoPesado(part);
  return p.pesa?Math.min(6,CONF_N_PREGUNTAS+2+(p.porque.split(",").length>1?1:0)):CONF_N_PREGUNTAS;
}
function nPreguntasPost(res,P){
  const part=P&&P.part;
  if(part&&part.tipo==="amistoso") return 1;
  const dif=res?Math.abs((res.yo||0)-(res.otro||0)):0;
  const pesa=partidoPesado(part).pesa||dif>=3||(P&&(P.tuvoRoja||P.abajo2));
  return pesa?POST_N_PREGUNTAS+2:POST_N_PREGUNTAS;
}
/* preguntas que siguen sin respuesta propia (para el doctor) */
function preguntasSinRespuesta(){
  if(typeof PREGUNTAS_VOZ==="undefined") return [];
  if(typeof aplicarRespuestasVoz==="function") aplicarRespuestasVoz();
  return PREGUNTAS_VOZ.filter(p=>p&&p.q&&!(Array.isArray(p.ops)&&p.ops.length>=3)).map(p=>p.q);
}

/* ---------- trivia: matemática variada ---------- */
function _opsCon(correcto, errores){
  const set=[correcto];
  (errores||[]).forEach(e=>{ if(set.length<3&&e!==correcto&&set.indexOf(e)<0&&e>=0) set.push(e); });
  let k=1; while(set.length<3){ const d=correcto+(k%2?k:-k)*(correcto>20?Math.ceil(correcto/20):1); if(d>=0&&set.indexOf(d)<0) set.push(d); k++; }
  const arr=mezcla(set.slice());
  const fmt=v=>(Math.round(v)===v?v:v.toFixed(1)).toLocaleString("es-CL");
  return {op:arr.map(fmt), sol:arr.indexOf(correcto)};
}
const TRIVIA_MATE=[
  /* aritmética mental con errores típicos como distractores */
  ()=>{ const a=ri(23,89), b=ri(14,67); const r=a+b; return {q:"¿Cuánto es "+a+" + "+b+"?", o:_opsCon(r,[r+10,r-10,r+1])}; },
  ()=>{ const a=ri(51,140), b=ri(17,49); const r=a-b; return {q:"¿Cuánto es "+a+" − "+b+"?", o:_opsCon(r,[r+10,r-10,r+2])}; },
  ()=>{ const a=ri(6,15), b=ri(6,12); const r=a*b; return {q:"¿Cuánto es "+a+" × "+b+"?", o:_opsCon(r,[r+a,r-b,r+10])}; },
  ()=>{ const b=ri(3,9), r=ri(4,14), a=b*r; return {q:"¿Cuánto es "+a+" ÷ "+b+"?", o:_opsCon(r,[r+1,r-1,r+2])}; },
  ()=>{ const a=ri(2,9), b=ri(2,6), c=ri(2,6); const r=a+b*c; return {q:"Ojo con el orden: ¿cuánto es "+a+" + "+b+" × "+c+"?", o:_opsCon(r,[(a+b)*c,r+1,r-c])}; },
  ()=>{ const n=ri(11,19); return {q:"¿Cuánto es "+n+" al cuadrado?", o:_opsCon(n*n,[n*2,n*n+n,n*n-10])}; },
  ()=>{ const p=elige([10,20,25,50,75]), b=elige([80,120,200,240,360,400,480]); const r=b*p/100; return {q:"¿Cuánto es el "+p+" % de "+b+"?", o:_opsCon(r,[r*2,r+p,b-r])}; },
  ()=>{ const a=ri(2,6), s=[a,a*2,a*4,a*8]; return {q:"Sigue la serie: "+s.join(", ")+", …", o:_opsCon(a*16,[a*10,a*12,a*9])}; },
  ()=>{ const a=ri(3,9), d=ri(3,7), s=[a,a+d,a+2*d,a+3*d]; return {q:"Sigue la serie: "+s.join(", ")+", …", o:_opsCon(a+4*d,[a+5*d,a+3*d+1,a+4*d+2])}; },
  /* problemas de cancha: la cuenta que un DT hace de verdad */
  ()=>{ const g=ri(4,14), e=ri(2,8); const r=g*3+e; return {q:"Un equipo ganó "+g+" y empató "+e+". ¿Cuántos puntos tiene?", o:_opsCon(r,[g*2+e,(g+e)*3,g*3])}; },
  ()=>{ const f=ri(3,9); const r=f*3; return {q:"Quedan "+f+" fechas. ¿Cuántos puntos quedan en juego para un equipo?", o:_opsCon(r,[f*2,r+3,r-3])}; },
  ()=>{ const gf=ri(18,45), gc=ri(12,40); const r=gf-gc; if(r<0) return {q:"Hizo "+gc+" goles y recibió "+gf+". ¿Diferencia de gol?", o:_opsCon(-r,[gf+gc,-r+2,-r-1])}; return {q:"Hizo "+gf+" goles y recibió "+gc+". ¿Diferencia de gol?", o:_opsCon(r,[gf+gc,r+2,Math.max(0,r-1)])}; },
  ()=>{ const m=ri(55,84), d=ri(3,7); const r=90-m+d; return {q:"Vamos en el minuto "+m+" y el cuarto árbitro levanta "+d+" de descuento. ¿Cuántos minutos quedan?", o:_opsCon(r,[90-m,r+1,r-2])}; },
  ()=>{ const miles=ri(8,32), p=elige([5,6,8,10,12]); const r=miles*p; return {q:"Van "+miles+" mil personas a $"+p+" mil cada una. ¿Cuántos millones entran?", o:_opsCon(r,[miles+p,r+10,r*10])}; },
  ()=>{ const pj=elige([10,12,15,20]), g=pj*elige([1,2]); const r=g/pj; return {q:"Hizo "+g+" goles en "+pj+" partidos. ¿Cuántos goles por partido promedia?", o:_opsCon(r,[r+0.5,r*2,Math.max(0,r-0.5)])}; },
  ()=>{ const s=elige([3,4,5,6,8,12]); const r=s*12; return {q:"Un jugador gana $"+s+" millones al mes. ¿Cuánto es al año?", o:_opsCon(r,[s*10,r+s,s*52])}; },
  ()=>{ const cap=elige([20000,40000,45000,15000]), pct=elige([25,50,75]); const r=cap*pct/100/1000; return {q:"El estadio es para "+(cap/1000)+" mil personas y está al "+pct+" %. ¿Cuántos miles hay?", o:_opsCon(r,[r*2,cap/1000-r+1,r+5])}; }
];
function triviaMate(){
  const g=elige(TRIVIA_MATE)(), o=g.o;
  return {q:"Concentración: "+g.q, op:o.op, sol:o.sol};
}
/* ---------- trivia: cultura general y fútbol del mundo (no solo Chile) ----------
   desde = año en que el dato empieza a ser cierto (no se pregunta antes). */
const TRIVIA_GENERAL=[
  {q:"¿Qué país ganó más Copas del Mundo?",op:["Brasil","Alemania","Italia"],sol:0,desde:2002},
  {q:"¿Dónde se jugó el primer Mundial, en 1930?",op:["Uruguay","Italia","Brasil"],sol:0},
  {q:"¿En qué año se jugó un Mundial en Chile?",op:["1962","1970","1978"],sol:0,desde:1962},
  {q:"¿A cuántos metros se pone la barrera en un tiro libre?",op:["9,15","7,32","11"],sol:0},
  {q:"¿Cuánto mide de ancho un arco reglamentario?",op:["7,32 m","6 m","8,5 m"],sol:0},
  {q:"¿Cuánto mide de alto un arco reglamentario?",op:["2,44 m","2 m","2,80 m"],sol:0},
  {q:"En una tanda de penales, ¿cuántos patea cada equipo antes de la muerte súbita?",op:["Cinco","Tres","Seis"],sol:0},
  {q:"¿Qué selección ganó el Mundial 2022?",op:["Argentina","Francia","Croacia"],sol:0,desde:2022},
  {q:"¿Dónde se jugó el Mundial 2014?",op:["Brasil","Sudáfrica","Rusia"],sol:0,desde:2014},
  {q:"¿Qué selección ganó el Mundial 2010?",op:["España","Holanda","Alemania"],sol:0,desde:2010},
  {q:"Chile ganó la Copa América en…",op:["2015 y 2016","2011 y 2013","2019 y 2021"],sol:0,desde:2016},
  {q:"¿Contra qué selección fue «la mano de Dios» de Maradona?",op:["Inglaterra","Alemania","Italia"],sol:0,desde:1986},
  {q:"¿De qué país es Pelé?",op:["Brasil","Argentina","Uruguay"],sol:0},
  {q:"¿En qué deporte se juega Wimbledon?",op:["Tenis","Golf","Polo"],sol:0},
  {q:"¿Cuántos jugadores tiene en cancha un equipo de básquetbol?",op:["Cinco","Seis","Siete"],sol:0},
  {q:"¿Cada cuántos años hay Juegos Olímpicos de verano?",op:["Cuatro","Dos","Cinco"],sol:0},
  {q:"¿Cuál es el cerro más alto de América?",op:["Aconcagua","Ojos del Salado","Huascarán"],sol:0},
  {q:"¿Qué océano baña la costa de Chile?",op:["Pacífico","Atlántico","Índico"],sol:0},
  {q:"¿Cuál es el río más caudaloso del mundo?",op:["Amazonas","Nilo","Misisipi"],sol:0},
  {q:"¿Qué idioma se habla oficialmente en Brasil?",op:["Portugués","Español","Francés"],sol:0},
  {q:"¿Cuál es la capital de Perú?",op:["Lima","Cusco","Arequipa"],sol:0},
  {q:"¿Cuál es la capital de Uruguay?",op:["Montevideo","Punta del Este","Salto"],sol:0},
  {q:"¿Cuál es el planeta más grande del sistema solar?",op:["Júpiter","Saturno","Neptuno"],sol:0},
  {q:"¿A qué temperatura hierve el agua a nivel del mar?",op:["100 °C","90 °C","120 °C"],sol:0},
  {q:"¿Qué órgano bombea la sangre?",op:["El corazón","El hígado","El pulmón"],sol:0},
  {q:"¿Cuántos lados tiene un hexágono?",op:["Seis","Ocho","Cinco"],sol:0},
  {q:"¿Cuántos días tiene un año bisiesto?",op:["366","365","364"],sol:0},
  {q:"¿Quién pintó la Mona Lisa?",op:["Leonardo da Vinci","Miguel Ángel","Picasso"],sol:0},
  {q:"Gabriela Mistral ganó el Premio Nobel de…",op:["Literatura","la Paz","Medicina"],sol:0,desde:1945},
  {q:"Pablo Neruda ganó el Premio Nobel de Literatura en…",op:["1971","1945","1990"],sol:0,desde:1971},
  {q:"¿Qué músculo se lesiona más en el fútbol?",op:["Isquiotibiales","Bíceps","Deltoides"],sol:0},
  {q:"¿Qué se recomienda tomar para recuperarse después de un partido?",op:["Agua y carbohidratos","Solo café","Nada hasta el otro día"],sol:0},
  {q:"En un 4-3-3, ¿cuántos delanteros hay?",op:["Tres","Cuatro","Dos"],sol:0},
  {q:"Si un jugador está en offside pero no participa en la jugada, ¿se cobra?",op:["No","Sí, siempre","Solo en el área"],sol:0},
  {q:"¿Puede un gol hacerse directo desde un saque de banda?",op:["No","Sí","Solo con el pie"],sol:0},
  {q:"¿Puede hacerse un gol directo de córner?",op:["Sí","No","Solo en el alargue"],sol:0}
];
function _triviaCulta(){
  const anio=(E&&E.anio)||2026;
  const pool=TRIVIA_GENERAL.filter(t=>!t.desde||anio>=t.desde);
  const t=elige(pool); const ops=t.op.map((x,i)=>({x:x,ok:i===t.sol})); const m=mezcla(ops);
  return {q:t.q, op:m.map(o=>o.x), sol:m.findIndex(o=>o.ok)};
}
function _triviaFutbolMezclada(){
  const t=elige(TRIVIA_FUTBOL); const ops=t.op.map((x,i)=>({x:x,ok:i===t.sol})); const m=mezcla(ops);
  return {q:t.q, op:m.map(o=>o.x), sol:m.findIndex(o=>o.ok)};
}
/* triviaProc sin "¿cuánto nivel tiene?": el nivel es un número del juego, no algo que un DT sepa */
(function(){
  if(typeof triviaProc!=="function"||triviaProc._pr) return;
  const o=triviaProc;
  triviaProc=function(P){
    for(let i=0;i<6;i++){ const r=o(P); if(!r||!/nivel/i.test(r.q)) return r; }
    return null;
  };
  triviaProc._pr=true;
})();
/* reparto: 35 % matemática, 30 % tu club, 20 % cultura general, 15 % fútbol */
function momentoTrivia(P){
  if(!Array.isArray(E.triviaVistas)) E.triviaVistas=[];
  let base=null;
  for(let intento=0;intento<8&&!base;intento++){
    const r=Math.random();
    const b=r<0.35?triviaMate():(r<0.65?triviaProc(P):(r<0.85?_triviaCulta():_triviaFutbolMezclada()));
    if(!b||!b.op||b.sol<0) continue;
    if(intento<7&&E.triviaVistas.indexOf(b.q)>=0) continue;
    base=b;
  }
  if(!base) base=triviaMate();
  E.triviaVistas.push(base.q);
  if(E.triviaVistas.length>40) E.triviaVistas.shift();
  P._nTrivia=(P._nTrivia||0)+1;
  const factor=clamp(0.7+((E.ind&&E.ind.plantel)||60)/100,0.7,1.7);
  return {tipo:"trivia", t:"Test rápido de pizarra 🧮", factor:factor,
    d:"Minuto "+P.min+". Les tiras una pregunta para sacarlos del nervio. Si aciertan, se sueltan; si no, se traban.",
    q:base.q, sol:base.sol, op:base.op.map((t,i)=>({t:t, ok:i===base.sol}))};
}
/* más trivias por partido: al menos 2 si hay momentos (una antes del 45', otra después) */
const TRIVIAS_MIN=2;
(function(){
  if(typeof momentoActual!=="function"||momentoActual._pr) return;
  const o=momentoActual;
  momentoActual=function(P){
    try{
      const n=P._nTrivia||0;
      const debe=P.min>=5&&!P._triviaReciente&&((P.min>=30&&n<1)||(P.min>=60&&n<TRIVIAS_MIN)||(Math.random()<0.12));
      if(debe){ P._triviaReciente=true; return momentoTrivia(P); }
    }catch(e){}
    return o.apply(this,arguments);
  };
  momentoActual._pr=true;
})();

/* ---------- clima con utilidad real ---------- */
/* qué le hace el clima a TU plan (el rival juega con lo suyo): cada regla dice por qué */
const CLIMA_PLAN={
  calor:[
    {si:t=>t.presion==="Alta",       ef:{desgaste:2.5},        txt:"Presión alta con calor: el equipo se funde en el segundo tiempo."},
    {si:t=>t.ritmo==="Vertiginoso",  ef:{desgaste:2},          txt:"Ritmo vertiginoso a pleno sol: plomo en las piernas."},
    {si:t=>t.ritmo==="Pausado",      ef:{desgaste:-1,orden:1}, txt:"Ritmo pausado: llegas más entero que el rival."},
    {si:t=>t.bloque==="Bajo",        ef:{orden:1},             txt:"Bloque bajo: corres menos y el calor pesa menos."}
  ],
  lluvia:[
    {si:t=>t.estilo==="Control y toque", ef:{ataque:-2},         txt:"Cancha pesada: el toque corto se frena en los charcos."},
    {si:t=>t.estilo==="Pelotazo",        ef:{ataque:1.5},        txt:"Pelotazo con lluvia: la pelota patina y los defensas resbalan."},
    {si:t=>t.presion==="Alta",           ef:{ataque:1,recup:1.5},txt:"Presión alta en cancha mojada: el rival se equivoca más al salir."},
    {si:t=>t.estilo==="Contragolpe",     ef:{ataque:0.5},        txt:"Contragolpe: la pelota corre rápido en el pasto mojado."}
  ],
  viento:[
    {si:t=>t.estilo==="Pelotazo",        ef:{ataque:-2},         txt:"Pelotazo contra el viento: la pelota no llega o se va larga."},
    {si:t=>t.estilo==="Control y toque", ef:{ataque:1,orden:0.5},txt:"Juego por abajo: el viento no te afecta."},
    {si:t=>t.bloque==="Alto",            ef:{expo:1},            txt:"Línea alta con viento: los balones largos del rival son un sorteo."}
  ],
  frio:[
    {si:t=>t.ritmo==="Pausado",      ef:{ataque:-0.5},         txt:"Frío y ritmo lento: el equipo se enfría."},
    {si:t=>t.presion==="Alta",       ef:{orden:0.5},           txt:"Presión alta con frío: mantiene el cuerpo caliente."}
  ],
  despejado:[]
};
/* más lesiones musculares con frío o calor; la gente se queda en la casa si llueve */
const CLIMA_LESION={frio:1.5,calor:1.25,lluvia:1.2,viento:1,despejado:1};
const CLIMA_PUBLICO={lluvia:0.82,frio:0.9,calor:0.96,viento:0.97,despejado:1};
function efectosClimaPlan(clima,tac){
  tac=tac||(E&&E.tactica)||{};
  return (CLIMA_PLAN[clima]||[]).filter(r=>{ try{ return r.si(tac); }catch(e){ return false; } });
}
function recomendacionClima(clima){
  return ({calor:"Presión media o baja y ritmo pausado. Guarda un cambio para el minuto 60.",
    lluvia:"Pelotazo o contragolpe, y presión alta: el que sale jugando pierde la pelota.",
    viento:"Juego por abajo. Nada de pelotazos; la línea, media.",
    frio:"Ritmo normal o rápido para no enfriarse. Ojo con los músculos: más riesgo de lesión.",
    despejado:"Sin excusas: juega tu plan."})[clima]||"";
}
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._clR) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._clR=true; window[nom]=w; };
  envolver("iniciarPartido",o=>function(part){
    const P=o.apply(this,arguments);
    try{
      if(P&&part&&part.clima){
        const reglas=efectosClimaPlan(part.clima);
        reglas.forEach(r=>Object.keys(r.ef).forEach(k=>{ P[k]=(P[k]||0)+r.ef[k]; }));
        P.lesionClima=CLIMA_LESION[part.clima]||1;
        P.climaReglas=reglas.map(r=>r.txt);
      }
    }catch(e){}
    return P;
  });
  envolver("ocupBase",o=>function(part){
    const b=o.apply(this,arguments);
    try{ if(part&&part.clima&&!(part.ronda==="FINAL")) return b*(CLIMA_PUBLICO[part.clima]||1); }catch(e){}
    return b;
  });
  envolver("widgetClima",o=>function(part){
    const w=o.apply(this,arguments);
    try{
      const c=part&&part.clima||"despejado", reglas=efectosClimaPlan(c);
      const box=el("div","clima-plan");
      box.innerHTML="<b>Con tu plan:</b> "+(reglas.length?reglas.map(r=>escHtml(r.txt)).join(" "):"el clima no cambia nada de lo que armaste.")+
        "<br><b>Conviene:</b> "+escHtml(recomendacionClima(c))+
        ((CLIMA_PUBLICO[c]||1)<1?" <span class='mini'>Va menos gente: −"+Math.round((1-CLIMA_PUBLICO[c])*100)+" % de público.</span>":"")+
        ((CLIMA_LESION[c]||1)>1?" <span class='mini'>Riesgo de lesión ×"+String(CLIMA_LESION[c]).replace(".",",")+".</span>":"");
      w.appendChild(box);
      const d=w.querySelector(".cv-d"); if(d) d.textContent=d.textContent.replace(" El clima se fijó al armar el calendario; no es el parte del día real.","");
    }catch(e){}
    return w;
  });
})();
if(typeof document!=="undefined"&&!document.getElementById("css-prensa-real")){
  const st=document.createElement("style"); st.id="css-prensa-real";
  st.textContent=".clima-plan{grid-column:1/-1;font-size:12.5px;line-height:1.4;margin-top:6px;padding:6px 8px;border-radius:8px;background:rgba(0,0,0,.05)}"+
    ".conf-ef{margin:0 0 6px;color:#2b6a3a}";
  document.head.appendChild(st);
}
