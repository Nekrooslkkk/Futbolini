"use strict";
/* ============================================================
   FUTBOLINI 3.0 · partido.js
   Motor de partido. Tres modos: simular, seguir y dirigir.
   No hay dado a la vista: pesa nivel, forma, moral, plan y rival.
   ============================================================ */

const FORMACIONES={
 "4-4-2":{def:4,vol:4,del:2,ef:{orden:2,ataque:0}},
 "4-3-3":{def:4,vol:3,del:3,ef:{orden:-1,ataque:4}},
 "5-3-2":{def:5,vol:3,del:2,ef:{orden:5,ataque:-3}},
 "3-5-2":{def:3,vol:5,del:2,ef:{orden:-2,ataque:3}},
 "4-2-4":{def:4,vol:2,del:4,ef:{orden:-5,ataque:7}}
};
const ESTILOS={
 "Equilibrado":{ataque:1,orden:1,desgaste:1},
 "Presión alta":{ataque:4,orden:-2,desgaste:4},
 "Contragolpe":{ataque:1,orden:4,desgaste:1},
 "Control y toque":{ataque:2,orden:2,desgaste:2},
 "Pelotazo":{ataque:2,orden:0,desgaste:3}
};
/* recup = cuánto recuperás la pelota arriba (más peligro propio temprano) ·
   expo  = cuánto exponés la defensa (más peligro rival, peor con el cansancio) */
const PRESIONES={
 "Baja": {desgaste:-2,orden:3, ataque:-1,recup:-1,expo:-3},
 "Media":{desgaste:0, orden:0, ataque:0, recup:0, expo:0},
 "Alta": {desgaste:5, orden:-2,ataque:4, recup:4, expo:4}
};

/* ---------- pizarra libre ----------
   La cancha es una grilla de 5 columnas (0=izq … 4=der) × 5 filas
   (0=nuestra defensa … 4=ataque rival). Cada titular ocupa una celda.
   De la distribución se deduce la forma táctica (ataque/orden/ancho),
   permitiendo esquemas asimétricos o bizarros. */
const PIZ_FILAS=5, PIZ_COLS=5;
/* Posiciones por defecto a partir de una formación clásica. */
function pizarraDesdeFormacion(once){
  const f=FORMACIONES[E.tactica.form]||FORMACIONES["4-4-2"];
  const piz=[];
  const arq=once.filter(j=>j.pos==="ARQ").slice(0,1);
  const resto=once.filter(j=>!arq.includes(j));
  const filaDe=(idx)=>{ // reparte por líneas def/vol/del
    if(idx<f.def) return 1;
    if(idx<f.def+f.vol) return 2;
    return 3;
  };
  const porFila={1:[],2:[],3:[]};
  resto.forEach((j,i)=>{ (porFila[filaDe(i)]=porFila[filaDe(i)]||[]).push(j); });
  if(arq[0]) piz.push({n:arq[0].n,pos:"ARQ",r:0,c:2});
  [1,2,3].forEach(r=>{
    const linea=porFila[r]||[];
    linea.forEach((j,i)=>{
      const c=linea.length===1?2:Math.round(i*(PIZ_COLS-1)/(linea.length-1));
      piz.push({n:j.n,pos:j.pos,r:r,c:c});
    });
  });
  return piz;
}
/* Deduce la forma táctica desde las celdas ocupadas. */
function formaLibre(piz){
  if(!piz||!piz.length) return null;
  const out=piz.filter(p=>p.pos!=="ARQ");
  if(!out.length) return null;
  const avgR=out.reduce((s,p)=>s+p.r,0)/out.length;                 // 0..4
  const def=out.filter(p=>p.r<=1).length, atk=out.filter(p=>p.r>=3).length;
  const cols=out.map(p=>p.c), meanC=cols.reduce((a,b)=>a+b,0)/cols.length;
  const spread=Math.sqrt(cols.reduce((s,c)=>s+(c-meanC)*(c-meanC),0)/cols.length);
  const asim=Math.abs(meanC-(PIZ_COLS-1)/2);
  return {
    ataque:(avgR-2)*3 + (atk-2)*2,
    orden:(2-avgR)*2.5 + (def-3)*2 - asim*1.6,
    ancho:(spread-1.3)*2
  };
}
function onceIdeal(){
  const disp=E.plantel.filter(j=>!j.vendido&&!j.cedido&&j.lesion<=0);
  const f=FORMACIONES[E.tactica.form]||FORMACIONES["4-4-2"];
  const pick=(pos,n)=>disp.filter(j=>j.pos===pos).sort((a,b)=>(b.nivel*0.75+b.forma*0.25)-(a.nivel*0.75+a.forma*0.25)).slice(0,n);
  let once=pick("ARQ",1).concat(pick("DEF",f.def),pick("VOL",f.vol),pick("DEL",f.del));
  if(once.length<11){
    const resto=disp.filter(j=>!once.includes(j)).sort((a,b)=>b.nivel-a.nivel);
    once=once.concat(resto.slice(0,11-once.length));
  }
  return once;
}
function fuerzaEquipo(once){
  if(!once.length) return 40;
  const base=once.reduce((s,j)=>s+j.nivel*0.72+j.forma*0.18+j.moral*0.10,0)/once.length;
  const f=FORMACIONES[E.tactica.form]||FORMACIONES["4-4-2"];
  const es=ESTILOS[E.tactica.estilo]||ESTILOS["Equilibrado"];
  const pr=PRESIONES[E.tactica.presion]||PRESIONES["Media"];
  const libre=(E.tactica.pizarra&&E.tactica.pizarra.length)?formaLibre(E.tactica.pizarra):null;
  const shape=libre||f.ef;
  return {
    base:base,
    ataque:base+((shape.ataque||0)+es.ataque+pr.ataque)*1.2+(E.ind.moral-55)*0.08+(shape.ancho||0)*0.6,
    orden:base+((shape.orden||0)+es.orden+pr.orden)*1.2+(E.ind.plantel-55)*0.05,
    desgaste:es.desgaste+pr.desgaste
  };
}
function iniciarPartido(part,modo){
  const once=onceIdeal();
  const fz=fuerzaEquipo(once);
  let bonoLocal=part.local?4.5+modSuma("local"):-2;
  let bonoTorneo=part.tipo==="copa"?modSuma("copa"):modSuma("liga");
  const arb=modSuma("arbitraje");
  const rivalBase=part.fuerzaRival+(part.local?0:3);
  const cl=(typeof CLIMAS!=="undefined"&&CLIMAS[part.clima])||{desgaste:0,precision:1};
  const pr=PRESIONES[E.tactica.presion]||PRESIONES["Media"];
  return {
    part:part, modo:modo||"simular", min:0, gl:0, gv:0, once:once, rivalPlantel:plantelRival(part.rivalNombre||part.rivalId,part.fuerzaRival),
    ataque:fz.ataque+bonoLocal+bonoTorneo+arb, orden:fz.orden+bonoLocal*0.6+bonoTorneo+arb,
    desgaste:fz.desgaste+(cl.desgaste||0), cansancio:0, rival:rivalBase, empuje:0, riesgoPlan:0,
    recup:pr.recup||0, expo:pr.expo||0,
    precClima:cl.precision||1, arb:arb,
    lineas:[], goleadores:[], tarjetas:[], lesionados:[], terminado:false,
    momentos:momentosPartido(part), momentoIdx:0
  };
}
/* ---------- penales y polémica arbitral ---------- */
function arqueroDe(lista){ return (lista&&(lista.find(j=>j.pos==="ARQ")||lista[0]))||null; }
function pateadorDe(once){
  const c=once.filter(j=>j.pos!=="ARQ");
  const puntaje=j=>(j.nivel||60)+((j.rasgos&&j.rasgos.includes("penales"))?30:0)+((j.rasgos&&j.rasgos.includes("definición"))?12:0);
  return c.slice().sort((a,b)=>puntaje(b)-puntaje(a))[0]||once[0];
}
/* ~78% base, corregido por nivel del pateador vs temple (nivel) del arquero */
function cobrarPenal(pateador,arquero){
  let p=0.78;
  if(pateador) p+=((pateador.nivel||70)-70)*0.006+((pateador.rasgos&&pateador.rasgos.includes("penales"))?0.06:0);
  if(arquero)  p-=((arquero.nivel||70)-70)*0.005;
  return Math.random()<clamp(p,0.55,0.92);
}
function penalEnPartido(P,aFavor,motivo,patElegido){
  const min=P.min;
  if(aFavor){
    const pat=patElegido||pateadorDe(P.once), arq=arqueroDe(P.rivalPlantel);
    linea(P,min,(motivo||"Penal para "+E.clubNombre+".")+" Toma la pelota "+pat.n+"…");
    if(cobrarPenal(pat,arq)){
      pat.goles++; P.goleadores.push(pat.n); regGol(P,min,pat.n,true); if(P.part.local)P.gl++; else P.gv++;
      linea(P,min,"¡Gol de penal de "+pat.n+"! "+marcadorTxt(P),"gol");
    } else { linea(P,min,"¡Atajadón! "+(arq?arq.n:"el arquero")+" le contiene el penal a "+pat.n+".","grave"); P.empuje-=0.4; }
  } else {
    const pat=elige(P.rivalPlantel.filter(x=>x.pos!=="ARQ"))||P.rivalPlantel[0], arq=arqueroDe(P.once);
    linea(P,min,(motivo||"Penal para "+P.part.rivalNombre+".")+" Va a patear "+pat.n+"…");
    if(cobrarPenal(pat,arq)){
      if(P.part.local)P.gv++; else P.gl++; regGol(P,min,pat.n,false);
      linea(P,min,"Gol de penal de "+P.part.rivalNombre+": "+pat.n+". "+marcadorTxt(P),"gol");
    } else { linea(P,min,"¡"+(arq?arq.n:"el arquero")+" le ataja el penal! El estadio explota.","gol"); P.empuje+=0.5; }
  }
}
/* polémica en minutos calientes: penal dudoso o gol anulado, con sesgo según
   el modificador de arbitraje (pactos oscuros inclinan la balanza a tu favor). */
function polemicaArbitral(P){
  const sesgo=clamp(0.5+(P.arb||0)*0.04,0.15,0.85);
  const aFavor=Math.random()<sesgo;
  if(Math.random()<0.5){
    penalEnPartido(P,aFavor,aFavor?("Penal muy dudoso para "+E.clubNombre+". El rival protesta."):("Penal dudosísimo para "+P.part.rivalNombre+". La banca salta furiosa."));
    aplicarEfectos({moral:aFavor?1:-2});
  } else if(aFavor){
    linea(P,P.min,"Le anulan un gol al rival por un offside milimétrico. Se salva "+E.clubNombre+".","gol");
    aplicarEfectos({moral:1}); P.empuje+=0.3;
  } else {
    linea(P,P.min,"¡Gol anulado a "+E.clubNombre+"! El línea levantó la bandera y nadie entendió por qué.","grave");
    aplicarEfectos({moral:-2}); P.empuje-=0.3;
  }
}
function momentosPartido(part){
  const base=[12,32,46,58,70,82];
  if(part.ronda==="FINAL"||part.tipo==="copa") base.push(88);
  return base;
}
function linea(P,min,txt,clase){ P.lineas.push({m:min,t:txt,c:clase||""}); }
/* registra un gol con minuto y autor, para la caja de resumen (efemérides) */
function regGol(P,min,quien,propio){ P.golesDetalle=P.golesDetalle||[]; P.golesDetalle.push({min:min,quien:quien,propio:!!propio}); }
function anotaPropio(P,min){
  const cand=P.once.filter(j=>j.pos==="DEL").concat(P.once.filter(j=>j.pos==="VOL"));
  const j=eligePeso(cand,x=>(x.pos==="DEL"?3:1)*(x.nivel/50))||elige(P.once);
  j.goles++; P.goleadores.push(j.n); regGol(P,min,j.n,true);
  if(P.part.local) P.gl++; else P.gv++;
  linea(P,min,"¡Gol de "+j.n+"! "+marcadorTxt(P),"gol");
}
function anotaRival(P,min){
  const j=elige(P.rivalPlantel.filter(x=>x.pos!=="ARQ"));
  if(P.part.local) P.gv++; else P.gl++;
  regGol(P,min,j.n,false);
  linea(P,min,"Gol de "+P.part.rivalNombre+": "+j.n+". "+marcadorTxt(P),"gol");
}
function marcadorTxt(P){
  const yo=P.part.local?P.gl:P.gv, otro=P.part.local?P.gv:P.gl;
  return "("+E.clubNombre+" "+yo+" - "+otro+" "+P.part.rivalNombre+")";
}
function miMarcador(P){ return P.part.local?[P.gl,P.gv]:[P.gv,P.gl]; }

/* avanza el reloj hasta 'hasta' generando eventos.
   Modelo: se calcula cuánto peligro genera cada lado por partido
   (algo parecido a goles esperados) y se reparte minuto a minuto. */
function peligro(P){
  const mio=P.ataque+P.empuje-P.cansancio*1.6;
  const suyo=P.rival+P.riesgoPlan*1.4-(P.orden-P.rival)*0.16;
  const d=clamp((mio-suyo)/11,-2.1,2.1);
  /* la presión se aplica FUERA del clamp para que pese aun contra rivales
     saturados: recuperar arriba (se apaga con el cansancio) sube tu peligro;
     exponer la defensa (peor cansado) sube el del rival. */
  const recup=(P.recup||0)*Math.max(0,1-P.cansancio*0.09);
  const expo=(P.expo||0)*(0.3+P.cansancio*0.06);
  return {
    yo:Math.max(0.20,1.30+d*0.42+recup*0.06),
    el:Math.max(0.20,1.30-d*0.42+expo*0.06)
  };
}
/* Un tick avanza el reloj un poco y devuelve UN evento. Los eventos simples
   (gol, chance, tarjeta, color) se aplican acá; los de acción (penal, tiro
   libre, lesión) se devuelven SIN resolver para que el modo dirigir pueda
   auto-pausar y pedir una decisión. En simular se resuelven en automático. */
function tickPartido(P){
  if(P.terminado||P.min>=90){ P.min=Math.min(90,P.min); return {tipo:"fin",min:90}; }
  const paso=ri(2,4);
  P.min=Math.min(90,P.min+paso);
  P.cansancio+=P.desgaste*0.011*paso;   /* ~5-6 al final con presión alta */
  const min=P.min;
  const pl=peligro(P);
  if(P.precClima&&P.precClima!==1){ pl.yo*=P.precClima; pl.el*=P.precClima; }
  const N=28;
  const r=Math.random();
  if(r<pl.yo/N){ anotaPropio(P,min); return {tipo:"gol",min:min}; }
  if(r<(pl.yo+pl.el)/N){ anotaRival(P,min); return {tipo:"golRival",min:min}; }
  /* acción: penal */
  if(Math.random()<0.006){ const aFavor=Math.random()<clamp(0.5+(P.ataque-P.rival)*0.004,0.2,0.8);
    return {tipo:aFavor?"penal":"penalRival",min:min,aFavor:aFavor}; }
  /* acción: lesión */
  if(min>20&&Math.random()<0.006){ return {tipo:"lesion",min:min}; }
  /* acción: tiro libre peligroso propio */
  if(Math.random()<0.010){ return {tipo:"tiroLibre",min:min}; }
  /* polémica en el tramo caliente */
  if(min>60&&Math.random()<0.012){ polemicaArbitral(P); return {tipo:"polemica",min:min}; }
  /* tarjeta */
  if(Math.random()<0.03){ const j=elige(P.once); j.tarjetas++; P.tarjetas.push(j.n);
    linea(P,min,"Amarilla para "+j.n+".",min>70?"grave":""); return {tipo:"tarjeta",min:min}; }
  /* chance perdida */
  if(Math.random()<0.13){ linea(P,min,elige(["Tiro de media distancia que se va apenas afuera.",
    "El arquero rival manda al córner una que iba adentro.","Se pierde una clarísima en el área chica.",
    P.part.rivalNombre+" avisa con un cabezazo que pasa cerca.","Se salva en la línea. El estadio se agarra la cabeza."]));
    return {tipo:"chance",min:min}; }
  /* color */
  if(Math.random()<0.12){ linea(P,min,elige(["Juego trabado en la mitad de la cancha.",
    "El árbitro cobra falta y la tribuna reclama.","Cambio de ritmo: el partido se abrió.",
    "Se juega con el balón parado como única arma.","Momento de estudio: nadie quiere equivocarse."]));
    return {tipo:"relato",min:min}; }
  return {tipo:"nada",min:min};
}
function lesionEnPartido(P){
  const j=elige(P.once.filter(x=>x.pos!=="ARQ"));
  if(j){ j.lesion=ri(2,5); P.lesionados.push(j.n); linea(P,P.min,j.n+" se resiente y no puede seguir.","grave"); }
  return j;
}
function tiroLibreAuto(P){
  const j=pateadorDe(P.once);
  linea(P,P.min,"Tiro libre peligroso para "+E.clubNombre+", lo toma "+j.n+"…");
  const prob=clamp(0.11+((j.nivel||70)-70)*0.004+((j.rasgos&&j.rasgos.includes("tiro libre"))?0.10:0),0.05,0.32);
  if(Math.random()<prob){ j.goles++; P.goleadores.push(j.n); regGol(P,P.min,j.n,true); if(P.part.local)P.gl++; else P.gv++;
    linea(P,P.min,"¡GOLAZO de tiro libre de "+j.n+"! "+marcadorTxt(P),"gol"); return true; }
  linea(P,P.min,elige(["La barrera la desvía al córner.","¡Al travesaño! Por un pelo.",
    "El arquero vuela y la manda al córner.","Se fue rozando el palo."])); return false;
}
function resolverEventoAuto(P,ev){
  if(ev.tipo==="penal") penalEnPartido(P,true);
  else if(ev.tipo==="penalRival") penalEnPartido(P,false);
  else if(ev.tipo==="lesion") lesionEnPartido(P);
  else if(ev.tipo==="tiroLibre") tiroLibreAuto(P);
}
/* Corrida en bloque (simular y para completar tramos). */
function correrHasta(P,hasta){
  let guard=0;
  while(P.min<hasta&&!P.terminado&&guard++<600){
    const ev=tickPartido(P);
    if(ev.tipo==="fin") break;
    if(ev.tipo==="penal"||ev.tipo==="penalRival"||ev.tipo==="lesion"||ev.tipo==="tiroLibre") resolverEventoAuto(P,ev);
  }
  if(P.min>=90&&!P.terminado) P.min=90;
}
/* momentos de decisión del modo dirigir */
function momentoActual(P){
  const [yo,otro]=miMarcador(P);
  const dif=yo-otro;
  if(P.min<5) return {
    t:"Antes de salir a la cancha",
    d:"Última charla en el camarín. El plan está armado, falta el mensaje.",
    op:[
     {t:"Salir a comerse el partido",ef:{ataque:3,riesgoPlan:2}},
     {t:"Empezar de menos a más",ef:{orden:3,ataque:-1}},
     {t:"Recordarles lo que está en juego",ef:{ataque:1.5,orden:1.5,desgaste:1}}
    ]};
  if(dif<0) return {
    t:"Vas abajo en el marcador",
    d:"Minuto "+P.min+". El partido se está yendo y en la tribuna ya se escucha el murmullo.",
    op:[
     {t:"Meter otro delantero y tirarse encima",ef:{ataque:5,riesgoPlan:3,desgaste:2}},
     {t:"Sostener el orden y esperar el error",ef:{orden:3,ataque:1}},
     {t:"Cambiar el sistema completo",ef:{ataque:3,orden:-1,riesgoPlan:1.5}}
    ]};
  if(dif>0) return {
    t:"Vas arriba",
    d:"Minuto "+P.min+". Hay ventaja, pero el rival empujó los últimos diez minutos.",
    op:[
     {t:"Cerrarse atrás y aguantar",ef:{orden:4,ataque:-3,riesgoPlan:-1}},
     {t:"Ir por otro para liquidarlo",ef:{ataque:4,riesgoPlan:2}},
     {t:"Manejar el partido con la pelota",ef:{orden:2,ataque:1,desgaste:-1}}
    ]};
  return {
    t:"Está empatado",
    d:"Minuto "+P.min+". El partido está para cualquiera.",
    op:[
     {t:"Meter un cambio ofensivo",ef:{ataque:4,riesgoPlan:2}},
     {t:"Refrescar el mediocampo",ef:{orden:2,ataque:1,desgaste:-2}},
     {t:"Dejarlo como está",ef:{}}
    ]};
}
function aplicarMomento(P,ef){
  if(!ef) return;
  P.ataque+=ef.ataque||0; P.orden+=ef.orden||0;
  P.riesgoPlan+=ef.riesgoPlan||0; P.desgaste+=ef.desgaste||0;
  P.empuje+=(ef.ataque||0)*0.3;
}
/* cierre del partido: tabla, moral, taquilla, historia */
function terminarPartido(P){
  P.terminado=true;
  const part=P.part;
  const [yo,otro]=miMarcador(P);
  const posAntes=(part.tipo==="liga")?posicionEnTabla():null;
  part.jugado=true; part.gf=yo; part.gc=otro;
  P.once.forEach(j=>{ j.partidos++; j.forma=clamp(j.forma+(yo>otro?4:(yo<otro?-4:0))+ri(-3,3),30,99); });

  let caja=0,gente=0;
  if(part.local){ const t=ingresoPartidoLocal(part); caja=t.ingreso; gente=t.gente; aplicarEfectos({plata:caja}); }
  part.publico=gente; part.caja=caja;

  if(part.tipo==="liga"){
    const pv=puntosVictoria();
    const t=E.temporada; t.pj++; t.gf+=yo; t.gc+=otro;
    if(yo>otro){ t.pg++; t.pts+=pv; } else if(yo===otro){ t.pe++; t.pts+=1; } else t.pp++;
    const mi=E.tabla[E.club]; mi.pj++; mi.gf+=yo; mi.gc+=otro;
    if(yo>otro){ mi.pg++; mi.pts+=pv; } else if(yo===otro){ mi.pe++; mi.pts++; } else mi.pp++;
    simularResto(part);
  } else {
    resolverCopa(part,yo,otro);
  }
  /* efectos anímicos */
  if(yo>otro){ aplicarEfectos({moral:3,hinchada:2}); aplicarGrupos({hinchada:4,camarin:3,directorio:2,tecnico:2}); }
  else if(yo<otro){ aplicarEfectos({moral:-3,hinchada:-2}); aplicarGrupos({hinchada:-4,camarin:-2,directorio:-3,prensa:-2}); }
  else { aplicarGrupos({hinchada:-1}); }
  /* racha para el efecto mariposa: ganar corta la cuenta y rehabilita el aviso */
  if(E.temporada.sinGanar===undefined) E.temporada.sinGanar=0;
  if(yo>otro){ E.temporada.sinGanar=0; E.flags.rachaLiquida=false; }
  else E.temporada.sinGanar++;
  if(typeof chequearPromesas==="function") chequearPromesas(yo,otro);
  notificar({
    t:(yo>otro?"Victoria ":(yo<otro?"Derrota ":"Empate "))+yo+"-"+otro+" ante "+part.rivalNombre,
    tipo:(yo>otro?"bueno":(yo<otro?"malo":"neutro")),
    d:(part.tipo==="copa"?"Copa Libertadores · "+part.ronda:"Campeonato Nacional · fecha "+part.fecha)+", "+
      (part.local?"de local":"de visita")+" en "+part.sede+". "+
      (P.goleadores.length?("Goles: "+P.goleadores.join(", ")+". "):"")+
      (part.local?("Fueron "+(part.publico||0).toLocaleString("es-CL")+" personas; taquilla "+plata(part.caja||0)+". "):"")+
      (yo>otro?"Suben moral e hinchada.":(yo<otro?"Bajan moral e hinchada; el vestuario queda sensible.":"Reparto de puntos.")),
    bandeja:false});
  const posDespues=(part.tipo==="liga")?posicionEnTabla():null;
  if(typeof redesReaccion==="function") redesReaccion("partido",{yo:yo,otro:otro,rival:part.rivalNombre});
  E.idx++;
  guardar();
  return {yo:yo,otro:otro,caja:caja,gente:gente,posAntes:posAntes,posDespues:posDespues,
    golesDetalle:(P.golesDetalle||[]),tarjetas:(P.tarjetas||[]),lesionados:(P.lesionados||[]),esLiga:part.tipo==="liga"};
}
/* los otros 7 partidos de la fecha (se guardan para mostrarlos en el resumen) */
function simularResto(part){
  E.ultimaFecha=[];
  if(!part.jornada) return;
  part.jornada.forEach(par=>{
    if(par[0]===E.club||par[1]===E.club) return;
    const a=CLUB_POR_ID[par[0]],b=CLUB_POR_ID[par[1]];
    const fa=a.fuerza+5+rnd(-9,9), fb=b.fuerza+rnd(-9,9);
    const d=(fa-fb)/12;
    let ga=clamp(Math.round(1.25+d*0.6+rnd(-1,1.3)),0,6);
    let gb=clamp(Math.round(1.05-d*0.6+rnd(-1,1.3)),0,6);
    const ta=E.tabla[a.id], tb=E.tabla[b.id];
    const pv=puntosVictoria();
    ta.pj++;tb.pj++;ta.gf+=ga;ta.gc+=gb;tb.gf+=gb;tb.gc+=ga;
    if(ga>gb){ta.pg++;ta.pts+=pv;tb.pp++;} else if(ga<gb){tb.pg++;tb.pts+=pv;ta.pp++;}
    else {ta.pe++;tb.pe++;ta.pts++;tb.pts++;}
    E.ultimaFecha.push({a:a.c||a.n, b:b.c||b.n, ga:ga, gb:gb});
  });
}
/* copa: al terminar una llave se decide si sigue o se acaba */
function resolverCopa(part,yo,otro){
  E.flags.copaAcum=E.flags.copaAcum||{};
  const k=part.ronda;
  const acc=E.flags.copaAcum[k]||{gf:0,gc:0,j:0};
  acc.gf+=yo; acc.gc+=otro; acc.j++;
  E.flags.copaAcum[k]=acc;
  const idxRonda=E.calendario.filter(p=>p.tipo==="copa"&&p.ronda===k);
  const jugados=idxRonda.filter(p=>p.jugado).length;
  if(jugados<idxRonda.length) return;
  let pasa;
  if(k==="Grupo 2"){ pasa=(acc.gf-acc.gc)>=-1; }
  else { pasa=acc.gf>acc.gc||(acc.gf===acc.gc&&Math.random()<0.5); }
  if(!pasa){
    E.calendario=E.calendario.filter(p=>!(p.tipo==="copa"&&!p.jugado));
    notificar({t:"Eliminado de la Copa Libertadores",d:"El club queda fuera en "+k+" ("+acc.gf+"-"+acc.gc+" en la llave). Se resiente la moral y baja algo de prestigio.",tipo:"malo"});
    aplicarEfectos({moral:-5,prestigio:-2});
  } else if(k==="FINAL"){
    E.flags.copaCampeon=true;
    notificar({t:"CAMPEÓN DE AMÉRICA",d:"El club gana la Copa Libertadores "+E.anio+". Estalla la hinchada, se dispara el prestigio y entran premios grandes.",tipo:"bueno"});
    aplicarGrupos({hinchada:22,socios:14,camarin:18,directorio:20,prensa:14,comunidad:10,anfp:6,sponsors:16,tecnico:15});
    aplicarRep({publica:25,credibilidad:15});
  } else {
    aplicarEfectos({plata:130});
    notificar({t:"Avanza en la Copa",d:"El club supera "+k+" ("+acc.gf+"-"+acc.gc+"). Entran "+plata(130)+" por premios y sube la moral.",tipo:"bueno"});
    aplicarEfectos({moral:5,prestigio:3});
  }
}
