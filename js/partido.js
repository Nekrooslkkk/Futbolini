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
const PRESIONES={"Baja":{desgaste:-2,orden:2,ataque:-1},"Media":{desgaste:0,orden:0,ataque:0},"Alta":{desgaste:3,orden:-1,ataque:3}};

function onceIdeal(){
  const disp=E.plantel.filter(j=>!j.vendido&&j.lesion<=0);
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
  return {
    base:base,
    ataque:base+(f.ef.ataque+es.ataque+pr.ataque)*1.2+(E.ind.moral-55)*0.08,
    orden:base+(f.ef.orden+es.orden+pr.orden)*1.2+(E.ind.plantel-55)*0.05,
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
  return {
    part:part, modo:modo||"simular", min:0, gl:0, gv:0, once:once, rivalPlantel:plantelRival(part.rivalNombre||part.rivalId,part.fuerzaRival),
    ataque:fz.ataque+bonoLocal+bonoTorneo+arb, orden:fz.orden+bonoLocal*0.6+bonoTorneo+arb,
    desgaste:fz.desgaste, cansancio:0, rival:rivalBase, empuje:0, riesgoPlan:0,
    lineas:[], goleadores:[], tarjetas:[], lesionados:[], terminado:false,
    momentos:momentosPartido(part), momentoIdx:0
  };
}
function momentosPartido(part){
  const base=[12,32,46,58,70,82];
  if(part.ronda==="FINAL"||part.tipo==="copa") base.push(88);
  return base;
}
function linea(P,min,txt,clase){ P.lineas.push({m:min,t:txt,c:clase||""}); }
function anotaPropio(P,min){
  const cand=P.once.filter(j=>j.pos==="DEL").concat(P.once.filter(j=>j.pos==="VOL"));
  const j=eligePeso(cand,x=>(x.pos==="DEL"?3:1)*(x.nivel/50))||elige(P.once);
  j.goles++; P.goleadores.push(j.n);
  if(P.part.local) P.gl++; else P.gv++;
  linea(P,min,"¡Gol de "+j.n+"! "+marcadorTxt(P),"gol");
}
function anotaRival(P,min){
  const j=elige(P.rivalPlantel.filter(x=>x.pos!=="ARQ"));
  if(P.part.local) P.gv++; else P.gl++;
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
  return {yo:Math.max(0.22,1.30+d*0.42), el:Math.max(0.22,1.30-d*0.42)};
}
function correrHasta(P,hasta){
  const pasos=18;
  while(P.min<hasta&&!P.terminado){
    P.min+=ri(3,6);
    if(P.min>hasta) P.min=hasta;
    P.cansancio+=P.desgaste*0.05;
    const pl=peligro(P);
    const r=Math.random();
    if(r<pl.yo/pasos){ anotaPropio(P,P.min); }
    else if(r<(pl.yo+pl.el)/pasos){ anotaRival(P,P.min); }
    else if(r<0.10){
      linea(P,P.min,elige(["Tiro de media distancia que se va apenas afuera.",
        "El arquero rival manda al córner una que iba adentro.",
        "Se pierde una clarísima en el área chica.",
        P.part.rivalNombre+" avisa con un cabezazo que pasa cerca.",
        "Se salva en la línea. El estadio se agarra la cabeza."]));
    } else if(r<0.135){
      const j=elige(P.once); j.tarjetas++; P.tarjetas.push(j.n);
      linea(P,P.min,"Amarilla para "+j.n+".",P.min>70?"grave":"");
    } else if(r<0.145&&P.min>25){
      const j=elige(P.once.filter(x=>x.pos!=="ARQ"));
      if(j){ j.lesion=ri(2,5); P.lesionados.push(j.n); linea(P,P.min,j.n+" se resiente y no puede seguir.","grave"); }
    } else if(r<0.175){
      linea(P,P.min,elige(["Juego trabado en la mitad de la cancha.",
        "El árbitro cobra falta y la tribuna reclama.",
        "Cambio de ritmo: el partido se abrió.",
        "Se juega con el balón parado como única arma.",
        "Momento de estudio: nadie quiere equivocarse."]));
    }
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
  part.jugado=true; part.gf=yo; part.gc=otro;
  P.once.forEach(j=>{ j.partidos++; j.forma=clamp(j.forma+(yo>otro?4:(yo<otro?-4:0))+ri(-3,3),30,99); });

  let caja=0,gente=0;
  if(part.local){ const t=ingresoPartidoLocal(part); caja=t.ingreso; gente=t.gente; aplicarEfectos({plata:caja}); }
  part.publico=gente; part.caja=caja;

  if(part.tipo==="liga"){
    const t=E.temporada; t.pj++; t.gf+=yo; t.gc+=otro;
    if(yo>otro){ t.pg++; t.pts+=2; } else if(yo===otro){ t.pe++; t.pts+=1; } else t.pp++;
    const mi=E.tabla[E.club]; mi.pj++; mi.gf+=yo; mi.gc+=otro;
    if(yo>otro){ mi.pg++; mi.pts+=2; } else if(yo===otro){ mi.pe++; mi.pts++; } else mi.pp++;
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
  E.idx++;
  guardar();
  return {yo:yo,otro:otro,caja:caja,gente:gente};
}
/* los otros 7 partidos de la fecha */
function simularResto(part){
  if(!part.jornada) return;
  part.jornada.forEach(par=>{
    if(par[0]===E.club||par[1]===E.club) return;
    const a=CLUB_POR_ID[par[0]],b=CLUB_POR_ID[par[1]];
    const fa=a.fuerza+5+rnd(-9,9), fb=b.fuerza+rnd(-9,9);
    const d=(fa-fb)/12;
    let ga=clamp(Math.round(1.25+d*0.6+rnd(-1,1.3)),0,6);
    let gb=clamp(Math.round(1.05-d*0.6+rnd(-1,1.3)),0,6);
    const ta=E.tabla[a.id], tb=E.tabla[b.id];
    ta.pj++;tb.pj++;ta.gf+=ga;ta.gc+=gb;tb.gf+=gb;tb.gc+=ga;
    if(ga>gb){ta.pg++;ta.pts+=2;tb.pp++;} else if(ga<gb){tb.pg++;tb.pts+=2;ta.pp++;}
    else {ta.pe++;tb.pe++;ta.pts++;tb.pts++;}
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
    E.bandeja.unshift({t:"Eliminado de la Copa Libertadores",d:"El club queda fuera en "+k+" ("+acc.gf+"-"+acc.gc+" en la llave).",tipo:"malo",anio:E.anio});
    aplicarEfectos({moral:-5,prestigio:-2});
  } else if(k==="FINAL"){
    E.flags.copaCampeon=true;
    E.bandeja.unshift({t:"CAMPEÓN DE AMÉRICA",d:"El club gana la Copa Libertadores "+E.anio+".",tipo:"bueno",anio:E.anio});
    aplicarGrupos({hinchada:22,socios:14,camarin:18,directorio:20,prensa:14,comunidad:10,anfp:6,sponsors:16,tecnico:15});
    aplicarRep({publica:25,credibilidad:15});
  } else {
    aplicarEfectos({plata:130});
    E.bandeja.unshift({t:"Avanza en la Copa",d:"El club supera "+k+" ("+acc.gf+"-"+acc.gc+"). Entran "+plata(130)+" por premios.",tipo:"bueno",anio:E.anio});
    aplicarEfectos({moral:5,prestigio:3});
  }
}
