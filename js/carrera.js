"use strict";
/* ============================================================
   FUTBOLINI 3.0 · carrera.js
   Tu carrera personal: reputación, mandato, destitución y
   ofertas de otros clubes. Se pierde la partida solo si tu
   imagen pública queda por el suelo y nadie te quiere contratar.
   ============================================================ */

function expectativa(){
  /* qué esperan de ti según el tamaño del club y lo que venías haciendo */
  const p=E.ind.prestigio;
  if(p>=75) return {pos:2,txt:"pelear el título"};
  if(p>=60) return {pos:5,txt:"clasificar a torneo internacional"};
  if(p>=45) return {pos:9,txt:"terminar en la mitad de arriba"};
  return {pos:13,txt:"mantener la categoría"};
}
/* ============================================================
   5.0 · OBJETIVOS DE TEMPORADA — que el jugador sepa a qué juega.
   La dirigencia fija metas concretas en 3 frentes (deportivo,
   económico, institucional). Se ven en el escritorio con su
   progreso en vivo y se evalúan al cierre. Esto hace el juego
   estratégico (hay un plan que perseguir) y enseñable (cada meta
   dice QUÉ se pide y POR QUÉ importa).
   ============================================================ */
function generarObjetivos(){
  const objs=[], p=E.ind.prestigio;
  /* 1 · deportivo (siempre) — según el tamaño del club */
  if(p>=75) objs.push({id:"dep",cat:"deportivo",tipo:"pos",meta:1,
    t:"Pelear el título", detalle:"Salir campeón del torneo.",
    porque:"En un grande, salir segundo ya duele. Te contrataron para ganar."});
  else if(p>=60) objs.push({id:"dep",cat:"deportivo",tipo:"pos",meta:4,
    t:"Clasificar a la Libertadores", detalle:"Terminar entre los primeros 4.",
    porque:"La copa deja plata y prestigio: es la vara con la que te miden."});
  else if(p>=45) objs.push({id:"dep",cat:"deportivo",tipo:"pos",meta:8,
    t:"Meterte en la mitad de arriba", detalle:"Terminar entre los primeros 8.",
    porque:"Un club que se ordena mira para arriba, no para abajo."});
  else objs.push({id:"dep",cat:"deportivo",tipo:"pos",meta:14,
    t:"Mantener la categoría", detalle:"No caer a los puestos de descenso.",
    porque:"Sin Primera no hay proyecto. Sobrevivir ya es ganar."});
  /* 1b · deportivo · victorias (siempre) — identidad ganadora, atada a E.temporada.pg */
  const metaVic = p>=75?16 : p>=60?13 : p>=45?11 : 9;
  objs.push({id:"vic",cat:"deportivo",tipo:"victorias",meta:metaVic,
    t:"Sumar "+metaVic+" triunfos", detalle:"Ganar al menos "+metaVic+" partidos de liga en el año.",
    porque:"Los puntos se hacen ganando. Un equipo que gana seguido no discute al técnico."});
  /* 2 · económico — según cómo esté la caja */
  if(E.deuda>800){
    const meta=Math.max(200,Math.round(E.deuda*0.75));
    objs.push({id:"eco",cat:"economico",tipo:"deuda",meta:meta, base:E.deuda,
      t:"Ordenar las finanzas", detalle:"Bajar la deuda por debajo de "+plata(meta)+".",
      porque:"La deuda te ata las manos en el mercado y calienta al directorio."});
  } else {
    objs.push({id:"eco",cat:"economico",tipo:"caja",meta:0,
      t:"Cerrar el año en azul", detalle:"Terminar la temporada sin números rojos.",
      porque:"Un club sano no vive de prestado. La caja es tu libertad."});
  }
  /* 2b · económico · sponsors (siempre) — mantener contento al que paga la cuenta */
  objs.push({id:"spo",cat:"economico",tipo:"grupo",grupo:"sponsors",meta:40,
    t:"Tener a los sponsors de tu lado", detalle:"Mantener la aprobación de los sponsors sobre 40.",
    porque:"Los sponsors bancan sueldos y refuerzos. Si se enojan, se cierra la billetera."});
  /* 3 · institucional · clásico (SIEMPRE, y con uno alcanza) */
  objs.push({id:"clasico",cat:"institucional",tipo:"clasico",meta:1,
    t:"Ganar un clásico", detalle:"Ganar al menos un clásico en el año. Con uno basta.",
    porque:"Un clásico ganado tapa muchas fechas grises. Es la meta que la gente nunca perdona fallar."});
  /* 3b · institucional · contextual (hinchada o directorio) */
  if(E.ind.hinchada<55){
    objs.push({id:"inst",cat:"institucional",tipo:"hinchada",meta:60, base:E.ind.hinchada,
      t:"Reconquistar a la gente", detalle:"Levantar el ánimo de la hinchada por encima de 60.",
      porque:"Sin hinchada no hay taquilla ni respaldo cuando venga la mala."});
  } else {
    objs.push({id:"inst",cat:"institucional",tipo:"directorio",meta:0,
      t:"Mantener el respaldo del directorio", detalle:"No perder al directorio (aprobación sobre cero).",
      porque:"El directorio firma tu continuidad. Perderlos es empezar a hacer las valijas."});
  }
  return objs;
}
/* progreso en vivo de un objetivo → {pct, txt, cumplido, estado} */
function progresoObjetivo(o){
  let pct=0, txt="", cumplido=false, estado="encamino";
  if(o.tipo==="pos"){
    const pos=posicionEnTabla(), n=(typeof LIGA_ACT!=="undefined"?LIGA_ACT.length:16);
    cumplido=pos<=o.meta;
    pct=Math.round(clamp((n-pos)/(n-1)*100,0,100));
    txt="Vas "+ordinal(pos)+" · meta "+ordinal(o.meta);
    estado=cumplido?"cumplido":(pos<=o.meta+2?"encamino":"riesgo");
  } else if(o.tipo==="deuda"){
    cumplido=E.deuda<=o.meta;
    pct=Math.round(clamp((o.base-E.deuda)/Math.max(1,o.base-o.meta)*100,0,100));
    txt="Deuda "+plata(E.deuda)+" · meta ≤ "+plata(o.meta);
    estado=cumplido?"cumplido":(E.deuda<=o.meta*1.25?"encamino":"riesgo");
  } else if(o.tipo==="caja"){
    const neto=(typeof ingresoSemanal==="function")?(ingresoSemanal()-costoSemanal()):0;
    cumplido=E.plata>0;
    pct=E.plata>0?(neto>=0?100:70):0;
    txt="Caja "+plata(E.plata)+" · flujo "+(neto>=0?"+":"")+plata(neto)+"/sem";
    estado=(E.plata>0&&neto>=0)?"cumplido":(E.plata>0?"encamino":"riesgo");
  } else if(o.tipo==="hinchada"){
    cumplido=E.ind.hinchada>=o.meta;
    pct=Math.round(clamp(E.ind.hinchada,0,100));
    txt="Hinchada "+Math.round(E.ind.hinchada)+" · meta "+o.meta;
    estado=cumplido?"cumplido":(E.ind.hinchada>=o.meta-12?"encamino":"riesgo");
  } else if(o.tipo==="clasico"){
    cumplido=!!(E.flags&&E.flags.clasicoGanado);
    pct=cumplido?100:20;
    txt=cumplido?"Clásico ganado ✓":"Todavía sin ganar el clásico";
    estado=cumplido?"cumplido":"encamino";
  } else if(o.tipo==="victorias"){
    const pg=(E.temporada&&E.temporada.pg)||0;
    const totalLiga=(E.calendario||[]).filter(x=>x.tipo==="liga").length||30;
    const restan=Math.max(0,totalLiga-((E.temporada&&E.temporada.pj)||0));
    cumplido=pg>=o.meta;
    pct=Math.round(clamp(pg/o.meta*100,0,100));
    txt="Ganados "+pg+" · meta "+o.meta;
    estado=cumplido?"cumplido":((pg+restan>=o.meta)?"encamino":"riesgo");
  } else if(o.tipo==="grupo"){
    const g=E.grupos&&E.grupos[o.grupo], v=g?g.aprob:0;
    cumplido=v>=o.meta;
    pct=Math.round(clamp((v+100)/2,0,100));
    txt=(GRUPO_POR_ID&&GRUPO_POR_ID[o.grupo]?GRUPO_POR_ID[o.grupo].n:o.grupo)+" "+signo(Math.round(v))+" · meta "+o.meta;
    estado=cumplido?"cumplido":(v>=o.meta-18?"encamino":"riesgo");
  } else if(o.tipo==="directorio"){
    const d=E.grupos.directorio.aprob;
    cumplido=d>=o.meta;
    pct=Math.round(clamp((d+100)/2,0,100));
    txt="Directorio "+signo(Math.round(d));
    estado=d>=0?"cumplido":(d>=-25?"encamino":"riesgo");
  }
  return {pct:pct,txt:txt,cumplido:cumplido,estado:estado};
}
/* loop de aprendizaje: el partido avisa cuando te mete o te saca de la zona de tu meta */
function avisoObjetivoPartido(posAntes,posDespues){
  if(!E.objetivos||!posAntes||!posDespues||posAntes===posDespues) return;
  const dep=E.objetivos.find(o=>o.tipo==="pos"); if(!dep) return;
  const antesOk=posAntes<=dep.meta, ahoraOk=posDespues<=dep.meta;
  if(!antesOk&&ahoraOk)
    notificar({t:"Zona de objetivo",tipo:"bueno",bandeja:false,
      d:"Trepás al "+ordinal(posDespues)+" y entras en zona de tu meta: «"+dep.t+"». Si lo sostienes, la temporada va bien encaminada."});
  else if(antesOk&&!ahoraOk)
    notificar({t:"Te sales de la zona",tipo:"malo",bandeja:false,
      d:"Caés al "+ordinal(posDespues)+" y te quedas afuera de «"+dep.t+"». Ojo, porque esto es lo que te va a evaluar el directorio."});
}
function evaluarMandato(pos,campeon,copa){
  const objs=(E.objetivos&&E.objetivos.length)?E.objetivos:generarObjetivos();
  let puntos=0, total=0, cumplidos=0, detalle=[];
  objs.forEach(o=>{
    const peso=(o.cat==="deportivo")?2:1; total+=peso;
    let ok;
    if(o.tipo==="pos") ok=(campeon||copa)?true:(pos<=o.meta);
    else ok=progresoObjetivo(o).cumplido;
    if(ok){ puntos+=peso; cumplidos++; }
    detalle.push({t:o.t, ok:ok});
  });
  const ratio=total?puntos/total:0;
  let nivel;
  if(campeon||copa||ratio>=0.85) nivel="excelente";
  else if(ratio>=0.5) nivel="cumplido";
  else if(ratio>=0.25) nivel="insuficiente";
  else nivel="fracaso";
  const resumen="Cumpliste "+cumplidos+" de "+objs.length+" metas — "+
    detalle.map(d=>(d.ok?"✓ ":"✗ ")+d.t).join(" · ")+".";
  const texto={
    excelente:"Temporada para el recuerdo. "+resumen,
    cumplido:"Se cumplió lo esencial. "+resumen+" Nadie sale a aplaudir, pero tu silla está firme.",
    insuficiente:"Quedaste corto. "+resumen+" Hay paciencia, pero se está acabando.",
    fracaso:"Fracaso rotundo. "+resumen+" El directorio ya mira para otro lado."
  }[nivel];
  const efectos={excelente:{dir:18,rep:12,cap:12},cumplido:{dir:6,rep:4,cap:5},
    insuficiente:{dir:-14,rep:-8,cap:-8},fracaso:{dir:-28,rep:-16,cap:-14}}[nivel];
  aplicarGrupos({directorio:efectos.dir,socios:Math.round(efectos.dir*0.6),hinchada:Math.round(efectos.dir*0.8)});
  aplicarRep({publica:efectos.rep,credibilidad:Math.round(efectos.rep*0.6)});
  E.capital=Math.max(0,E.capital+efectos.cap);
  E.carrera.evaluacion={nivel:nivel,txt:texto,anio:E.anio,pos:pos};
  E.carrera.malos=(nivel==="insuficiente"||nivel==="fracaso")?(E.carrera.malos||0)+1:0;
  return {nivel:nivel,txt:texto};
}
function riesgoDestitucion(){
  const dir=E.grupos.directorio.aprob;
  if(E.carrera.malos>=2) return true;
  if(dir<-65) return true;
  if(dir<-45&&E.carrera.malos>=1) return true;
  if(E.deuda>4500&&dir<-25) return true;
  return false;
}
function destituir(motivo){
  E.carrera.despidos++;
  E.carrera.clubes.push({club:E.club,desde:E.carrera.desde,hasta:E.anio,titulos:E.titulos.slice()});
  aplicarRep({publica:-10,credibilidad:-6});
  E.carrera.enParo=true;
  E.carrera.motivo=motivo;
  guardar();
}
/* Ofertas de otros clubes según tu imagen pública */
function ofertasDeTrabajo(){
  const rep=E.rep.publica, cred=E.rep.credibilidad;
  const puntaje=rep*0.7+cred*0.3+(E.titulos.length*4);
  const posibles=[];
  Object.keys(CLUB_INFO).forEach(id=>{
    if(id===E.club) return;
    const base=IND_BASE[id].prestigio;
    /* los clubes grandes solo llaman si tu nombre pesa */
    if(puntaje>=base*0.95) posibles.push({id:id,n:CLUB_INFO[id].n,exigencia:base});
  });
  if(E.flags.cisma) return [];
  return posibles;
}
function aceptarClub(id){
  const prev=E.rep, carrera=E.carrera, titulos=E.titulos, cronica=E.cronica;
  const anio=E.anio, modo=E.modo;
  nuevaPartida(id,anio,modo);
  E.rep=prev; E.carrera=carrera; E.carrera.club=id; E.carrera.desde=anio;
  E.carrera.enParo=false; E.carrera.malos=0;
  E.titulos=titulos; E.cronica=cronica;
  aplicarGrupos({directorio:10,prensa:5});
  guardar();
}
function finDeCarrera(motivo){
  E.carrera.fin=true; E.carrera.motivoFin=motivo;
  guardar();
}
function estadoCarrera(){
  if(E.flags.cisma&&E.rep.publica<20) return "enemigo";
  if(E.rep.publica<12) return "enemigo";
  return "ok";
}
