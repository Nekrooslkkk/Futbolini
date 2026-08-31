"use strict";
/* ============================================================
   FUTBOLINI 3.0 · partido.js
   Motor de partido. Tres modos: simular, seguir y dirigir.
   No hay dado a la vista: pesa nivel, forma, moral, plan y rival.
   ============================================================ */

const FORMACIONES={
 "4-4-2":{def:4,vol:4,del:2,ef:{orden:2,ataque:0}},
 "4-3-3":{def:4,vol:3,del:3,ef:{orden:-1,ataque:4}},
 "4-5-1":{def:4,vol:5,del:1,ef:{orden:5,ataque:-2}},
 "5-3-2":{def:5,vol:3,del:2,ef:{orden:5,ataque:-3}},
 "5-4-1":{def:5,vol:4,del:1,ef:{orden:8,ataque:-5}},
 "3-5-2":{def:3,vol:5,del:2,ef:{orden:-2,ataque:3}},
 "3-4-3":{def:3,vol:4,del:3,ef:{orden:-3,ataque:6}},
 "4-2-4":{def:4,vol:2,del:4,ef:{orden:-5,ataque:7}}
};
/* 6.7 · MENTALIDAD (estilo Football Manager): sesgo global de riesgo del equipo.
   Más ofensivo = más ataque y desgaste pero menos orden y más exposición atrás. */
const MENTALIDADES={
 "Ultradefensivo":{ataque:-6,orden:8, desgaste:-2,expo:-6,recup:-3},
 "Defensivo":     {ataque:-3,orden:4, desgaste:-1,expo:-3,recup:-1},
 "Equilibrado":   {ataque:0, orden:0, desgaste:0, expo:0, recup:0},
 "Ofensivo":      {ataque:5, orden:-3,desgaste:2, expo:4, recup:3},
 "Ultraofensivo": {ataque:9, orden:-6,desgaste:4, expo:8, recup:5}
};
const ESTILOS={
 "Equilibrado":{ataque:1,orden:1,desgaste:1},
 "Presión alta":{ataque:4,orden:-2,desgaste:4},
 "Contragolpe":{ataque:1,orden:4,desgaste:1},
 "Control y toque":{ataque:2,orden:2,desgaste:2},
 "Pelotazo":{ataque:2,orden:0,desgaste:3}
};
/* recup = cuánto recuperas la pelota arriba (más peligro propio temprano) ·
   expo  = cuánto expones la defensa (más peligro rival, peor con el cansancio) */
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
function scoreOnce(j){
  const same=E.plantel.filter(x=>!x.vendido&&!x.cedido&&(x.lesion||0)<=0&&x.pos===j.pos)
    .sort((a,b)=>b.nivel-a.nivel);
  const i=same.findIndex(x=>x.n===j.n);
  const rolN=i>1?-7:(i===1?-2:0);
  return j.nivel*0.52+(j.forma||70)*0.20+(j.moral||70)*0.18-((j.cansancio||0)*0.35)+rolN;
}
function onceIdeal(){
  const disp=E.plantel.filter(j=>!j.vendido&&!j.cedido&&(j.lesion||0)<=0);
  /* 6.8 · XI manual: si el DT armó su once, se respeta (y se completa si alguno se lesionó/vendió) */
  if(E.tactica && Array.isArray(E.tactica.xiManual) && E.tactica.xiManual.length){
    let once=E.tactica.xiManual.map(n=>disp.find(j=>j.n===n)).filter(Boolean);
    if(once.length<11){
      const resto=disp.filter(j=>once.indexOf(j)<0).sort((a,b)=>scoreOnce(b)-scoreOnce(a));
      once=once.concat(resto.slice(0,11-once.length));
    }
    if(once.length>=11) return once.slice(0,11);
  }
  const f=FORMACIONES[E.tactica.form]||FORMACIONES["4-4-2"];
  const pick=(pos,n)=>disp.filter(j=>j.pos===pos).sort((a,b)=>scoreOnce(b)-scoreOnce(a)).slice(0,n);
  let once=pick("ARQ",1).concat(pick("DEF",f.def),pick("VOL",f.vol),pick("DEL",f.del));
  if(once.length<11){
    const resto=disp.filter(j=>!once.includes(j)).sort((a,b)=>scoreOnce(b)-scoreOnce(a));
    once=once.concat(resto.slice(0,11-once.length));
  }
  return once;
}
function esClasico(part){
  const grandes=["CC","UCH","UC"];
  const riv=part&&part.rivalId;
  if(grandes.indexOf(E.club)>=0 && grandes.indexOf(riv)>=0) return true;
  /* 7.00 · rivalidades regionales de los clubes nuevos */
  if(typeof esRivalidadRegional==="function" && esRivalidadRegional(E.club,riv)) return true;
  return false;
}
function fuerzaEquipo(once){
  if(!once.length) return 40;
  const base=once.reduce((s,j)=>s+j.nivel*0.68+j.forma*0.16+j.moral*0.10-(j.cansancio||0)*0.22,0)/once.length;
  const f=FORMACIONES[E.tactica.form]||FORMACIONES["4-4-2"];
  const es=ESTILOS[E.tactica.estilo]||ESTILOS["Equilibrado"];
  const pr=PRESIONES[E.tactica.presion]||PRESIONES["Media"];
  const me=MENTALIDADES[E.tactica.mentalidad]||MENTALIDADES["Equilibrado"];
  const libre=(E.tactica.pizarra&&E.tactica.pizarra.length)?formaLibre(E.tactica.pizarra):null;
  const shape=libre||f.ef;
  /* 6.13 · roles/duties por jugador (estilo FM): la suma de duties inclina al equipo */
  let rolA=0, rolO=0;
  if(E.tactica.roles){
    once.forEach(j=>{ const d=E.tactica.roles[j.n];
      if(d==="ofe"){ rolA+=1.3; rolO-=1.0; } else if(d==="def"){ rolA-=1.0; rolO+=1.3; } });
  }
  return {
    base:base,
    ataque:base+((shape.ataque||0)+es.ataque+pr.ataque+me.ataque)*1.2+(E.ind.moral-55)*0.08+(shape.ancho||0)*0.6+rolA*1.1,
    orden:base+((shape.orden||0)+es.orden+pr.orden+me.orden)*1.2+(E.ind.plantel-55)*0.05+rolO*1.1,
    desgaste:es.desgaste+pr.desgaste+me.desgaste
  };
}
/* 6.7 · detecta la formación desde la pizarra (incl. bizarras tipo 2-4-4) */
function formacionDetectada(piz){
  if(!piz||!piz.length) return null;
  const out=piz.filter(p=>p.pos!=="ARQ");
  if(out.length<9) return null;
  const def=out.filter(p=>p.r<=1).length;
  const del=out.filter(p=>p.r>=3).length;
  const vol=out.length-def-del;
  return def+"-"+vol+"-"+del;
}
/* ============================================================
   6.30 · QUÍMICA DEL EQUIPO
   Los que se llevan bien rinden más. La química de un par es
   determinística (edad, rasgos compartidos, de la casa, partidos
   juntos, y un "click/roce" fijo por par) → estable, no azar por
   partido. Se dibuja en la pizarra y suma/resta nivel real.
   ============================================================ */
function hashStr(s){ let h=0; for(let i=0;i<(s||"").length;i++){ h=(h*31+s.charCodeAt(i))|0; } return h; }
function quimicaPar(a,b){
  if(!a||!b||a===b) return 50;
  const key=a.n<b.n?a.n+"|"+b.n:b.n+"|"+a.n;
  let q=52;
  const de=Math.abs((a.edad||25)-(b.edad||25));
  q+= de<=3?12:(de<=6?4:(de>=10?-10:0));
  const rs=(a.rasgos||[]).filter(r=>(b.rasgos||[]).indexOf(r)>=0).length;
  q+= rs*6;
  if((a.rasgos||[]).indexOf("de la casa")>=0 && (b.rasgos||[]).indexOf("de la casa")>=0) q+=10;
  q+= Math.min(10,(Math.min(a.partidos||0,b.partidos||0))/8);
  q+= (Math.abs(hashStr(key))%25)-12;   /* click (+) o roce (−) fijo del par */
  return clamp(Math.round(q),5,99);
}
/* pares "conectados": vecinos en la pizarra (dist<=2) o, si no hay, misma línea */
function paresConectados(once){
  const piz=E.tactica&&E.tactica.pizarra;
  const posDe={};
  if(piz){ piz.forEach(p=>{ posDe[p.n]={r:p.r,c:p.c}; }); }
  const pares=[];
  for(let i=0;i<once.length;i++) for(let j=i+1;j<once.length;j++){
    const a=once[i],b=once[j]; let conecta=false;
    if(piz && posDe[a.n] && posDe[b.n]){
      const d=Math.abs(posDe[a.n].r-posDe[b.n].r)+Math.abs(posDe[a.n].c-posDe[b.n].c);
      conecta=d<=2;
    } else { conecta=(a.pos===b.pos); }
    if(conecta) pares.push([a,b]);
  }
  return pares;
}
function quimicaEquipo(once){
  const pares=paresConectados(once);
  const lazos=pares.map(([a,b])=>{ const q=quimicaPar(a,b); return {a:a.n,b:b.n,q:q,bueno:q>=64,malo:q<=42}; });
  const prom=lazos.length?Math.round(lazos.reduce((s,l)=>s+l.q,0)/lazos.length):55;
  const bono=clamp((prom-55)/7,-3,5);
  return {prom:prom,bono:bono,lazos:lazos};
}
/* 7.10 · árbitro con nombre (ficticio) y sesgo visible. Determinista por fixture
   para que la previa y el partido muestren el mismo. NUNCA usa nombres de árbitros reales. */
const ARB_ESTILOS=[
  {k:"parejo",      d:"la lleva pareja, cobra lo justo",   cartas:1.0,  casero:0},
  {k:"casero",      d:"fama de cobrar para el local",       cartas:1.0,  casero:1},
  {k:"tarjetero",   d:"saca tarjeta por cualquier cosa",    cartas:1.5,  casero:0},
  {k:"estricto",    d:"riguroso, no deja pasar una",        cartas:1.25, casero:0},
  {k:"deja jugar",  d:"guarda las tarjetas, deja jugar",    cartas:0.7,  casero:0}
];
function arbitroDe(part){
  const key="arb"+((part&&part.fecha)||"x")+((part&&(part.rivalId||part.rivalNombre))||"")+((typeof E!=="undefined"&&E&&E.anio)||"");
  const rr=azarFijo(semilla(key));
  const pila=NOMBRES_PILA[Math.floor(rr()*NOMBRES_PILA.length)];
  const ape=APELLIDOS[Math.floor(rr()*APELLIDOS.length)];
  const est=ARB_ESTILOS[Math.floor(rr()*ARB_ESTILOS.length)];
  return {n:pila+" "+ape, estilo:est.k, desc:est.d, cartas:est.cartas, casero:est.casero};
}
function iniciarPartido(part,modo){
  const once=onceIdeal();
  const fz=fuerzaEquipo(once);
  const qui=quimicaEquipo(once);   /* 6.30 · la química suma nivel real */
  let bonoLocal=part.local?4.5+modSuma("local"):-2;
  let bonoTorneo=part.tipo==="copa"?modSuma("copa"):modSuma("liga");
  const arb=modSuma("arbitraje");
  const rivalBase=part.fuerzaRival+(part.local?0:3);
  const cl=(typeof CLIMAS!=="undefined"&&CLIMAS[part.clima])||{desgaste:0,precision:1};
  const pr=PRESIONES[E.tactica.presion]||PRESIONES["Media"];
  const me=MENTALIDADES[E.tactica.mentalidad]||MENTALIDADES["Equilibrado"];
  const P={
    part:part, modo:modo||"simular", min:0, gl:0, gv:0, once:once, rivalPlantel:plantelRival(part.rivalNombre||part.rivalId,part.fuerzaRival),
    ataque:fz.ataque+bonoLocal+bonoTorneo+arb, orden:fz.orden+bonoLocal*0.6+bonoTorneo+arb,
    desgaste:fz.desgaste+(cl.desgaste||0), cansancio:0, rival:rivalBase, empuje:0, riesgoPlan:0,
    recup:(pr.recup||0)+(me.recup||0), expo:(pr.expo||0)+(me.expo||0),
    precClima:cl.precision||1, arb:arb,
    lineas:[], goleadores:[], tarjetas:[], lesionados:[], ticker:[], terminado:false,
    momentos:momentosPartido(part), momentoIdx:0, fase:"equilibrio",
    clasico:esClasico(part), var:((E&&E.anio)||0)>=2016,
    cambios:0, cambiosMax:((E&&E.anio)||2026)>=2010?3:2   /* 6.18 · tope de cambios por era */
  };
  P.once.forEach(j=>{ j.estado="once"; });
  P.stats={pos:0.5, remMio:0, remRiv:0, arcMio:0, arcRiv:0, corMio:0, corRiv:0};   /* 7.10 · stats de transmisión */
  P.arbitro=arbitroDe(part);   /* 7.10 · árbitro con sesgo visible */
  if(P.arbitro.casero){ if(part.local){ P.ataque+=2.5; P.orden+=1.5; } else { P.rival+=2.5; } }
  P.quimica=qui; P.empuje+=qui.bono; P.orden+=qui.bono*0.5;   /* 6.30 · química al ruedo */
  /* 6.33 · el clima de prensa (lo que dejaste en la conferencia) empuja o pesa */
  if(E.grupos && E.grupos.prensa){ P.empuje+=clamp(E.grupos.prensa.aprob/90,-0.7,0.7); }
  if(P.clasico){ P.empuje+=1.4; P.desgaste+=1.2; P.rival+=1.5;
    const casa=P.once.filter(j=>j.rasgos&&j.rasgos.indexOf("de la casa")>=0).length;   /* 6.20 · los de la casa se agrandan en el clásico */
    if(casa) P.empuje+=Math.min(4,casa*2);
    /* 6.21 · barra contenta (3 pactos) = caldera de local, pero más riesgo de incidente */
    if(part.local && typeof barraContenta==="function" && barraContenta()){ P.empuje+=2; aplicarEfectos({riesgo:4}); }
  }
  /* 6.21 · pacto roto: la barra silba y el equipo lo siente los primeros minutos */
  if(part.local && E.barra && E.barra.roto){ P.empuje-=1.5; P.barraSilba=true; }
  if(part.tipo==="copa"){ P.empuje+=0.8; P.desgaste+=0.6; }
  return P;
}
/* 6.18 · banca disponible (los que no están en el once, sanos) */
function bancaPartido(P){ return E.plantel.filter(j=>!j.vendido&&!j.cedido&&!(j.lesion>0)&&P.once.indexOf(j)<0); }
/* 6.18 · cambio manual con nombre: sale X, entra Y. El relato deja de citar a X (sale del once) */
function hacerCambio(P,sale,entra){
  if(!sale||!entra) return false;
  if((P.cambios||0)>=(P.cambiosMax||3)) return false;
  if(P.once.indexOf(sale)<0 || P.once.indexOf(entra)>=0) return false;
  P.once=P.once.map(x=>x===sale?entra:x);
  entra.estado="once"; sale.estado="banca";
  sale.minutosTemporada=(sale.minutosTemporada||0)+(P.min-(sale.minEntrada||0));   /* 6.24 · minutos del que sale */
  entra.minEntrada=P.min;                                                          /* el que entra arranca su cuenta acá */
  entra.cansancio=Math.max(0,(entra.cansancio||0)-3);
  P.cambios=(P.cambios||0)+1;
  linea(P,P.min,entra.n+" entra por "+sale.n+".","cambio");
  return true;
}
function recambioPorLesion(P,sale){
  const banca=E.plantel.filter(j=>!j.vendido&&!j.cedido&&!(j.lesion>0)&&P.once.indexOf(j)<0);
  const entra=banca.filter(j=>j.pos===sale.pos)[0]||banca.sort((a,b)=>(b.nivel||0)-(a.nivel||0))[0];
  if(!entra) return null;
  P.once=P.once.map(x=>x===sale?entra:x);
  entra.forma=clamp((entra.forma||70)-8,20,99);
  entra.cansancio=Math.max(entra.cansancio||0,5);
  sale.moral=clamp((sale.moral||70)-4,0,100);
  linea(P,P.min,entra.n+" entra frío por "+sale.n+". El cambio cuesta.","grave");
  return entra;
}
function actualizarFase(P){
  const [yo,el]=typeof miMarcador==="function"?miMarcador(P):[P.gl,P.gv];
  const pl=peligro(P);
  const prev=P.fase||"equilibrio";
  let fase="equilibrio";
  if(pl.yo>pl.el*1.18 && yo>=el) fase="dominio";
  else if(pl.el>pl.yo*1.18 || yo<el) fase="ahogo";
  P.fase=fase;
  if(fase!==prev && P.min>8){
    if(fase==="dominio") linea(P,P.min,E.clubNombre+" se come el partido. El rival no sale.");
    else if(fase==="ahogo") linea(P,P.min,"El partido se va para el otro lado. Hay que aguantar.","grave");
    else linea(P,P.min,"Se equilibra. Nadie tiene el control.");
  }
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
  if(pateador) p+=((pateador.nivel||70)-70)*0.006+((pateador.rasgos&&pateador.rasgos.includes("penales"))?0.06:0)
    +((pateador.rasgos&&pateador.rasgos.indexOf("frio de definicion")>=0)?0.15:0);   /* 6.20 · frío en jugada, letal de penal */
  if(arquero)  p-=((arquero.nivel||70)-70)*0.005;
  return Math.random()<clamp(p,0.55,0.94);
}
/* forzado: si viene definido, salta el RNG (lo decide el minijuego).
   true = gol · false = atajado · "afuera" = tiro desviado */
function penalEnPartido(P,aFavor,motivo,patElegido,forzado){
  const min=P.min;
  if(aFavor){
    const pat=patElegido||pateadorDe(P.once), arq=arqueroDe(P.rivalPlantel);
    linea(P,min,(motivo||"Penal para "+E.clubNombre+".")+" Toma la pelota "+pat.n+"…");
    const gol=(forzado===undefined)?cobrarPenal(pat,arq):(forzado===true);
    if(forzado==="afuera"){
      linea(P,min,"¡"+pat.n+" la manda a las nubes! El penal se fue afuera.","grave"); P.empuje-=0.4;
      P.penalErrado=true; vozPenalErrado(P,min);   /* 7.00 · tuit de voz + flag para logro */
    } else if(gol){
      pat.goles++; P.goleadores.push(pat.n); regGol(P,min,pat.n,true,"penal"); if(P.part.local)P.gl++; else P.gv++;
      linea(P,min,"¡Gol de penal de "+pat.n+"! "+marcadorTxt(P),"gol");
      if(pat.pos==="ARQ" && typeof desbloquear==="function") desbloquear("arquero_penal");   /* 6.25 · logro */
    } else { linea(P,min,"¡Atajadón! "+(arq?arq.n:"el arquero")+" le contiene el penal a "+pat.n+".","grave"); P.empuje-=0.4;
      P.penalErrado=true; vozPenalErrado(P,min); }
  } else {
    const pat=elige(P.rivalPlantel.filter(x=>x.pos!=="ARQ"))||P.rivalPlantel[0], arq=arqueroDe(P.once);
    linea(P,min,(motivo||"Penal para "+P.part.rivalNombre+".")+" Va a patear "+pat.n+"…");
    if(cobrarPenal(pat,arq)){
      if(P.part.local)P.gv++; else P.gl++; regGol(P,min,pat.n,false,"penal");
      linea(P,min,"Gol de penal de "+P.part.rivalNombre+": "+pat.n+". "+marcadorTxt(P),"gol");
    } else { linea(P,min,"¡"+(arq?arq.n:"el arquero")+" le ataja el penal! El estadio explota.","gol"); P.empuje+=0.5; }
  }
}
/* 7.00 · emite un tuit de "penal errado" al ticker si la voz (data-voz.js) está cargada */
function vozPenalErrado(P,min){
  if(typeof tuitDeCtx!=="function"||typeof empujarTicker!=="function") return;
  const t=tuitDeCtx("penal_errado"); if(t) empujarTicker(P,t.quien,t.txt,"malo",min);
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
function regGol(P,min,quien,propio,tipo,asist){ P.golesDetalle=P.golesDetalle||[]; P.golesDetalle.push({min:min,quien:quien,propio:!!propio,tipo:tipo||"jugada",asist:asist||null}); }
function tieneRasgo(j,r){ return j&&j.rasgos&&j.rasgos.indexOf(r)>=0; }
function anotaPropio(P,min){
  const cand=P.once.filter(j=>j.pos==="DEL").concat(P.once.filter(j=>j.pos==="VOL"));
  /* 6.20 · rasgos: "llegador" (VOL que pisa el área) suma peso · "frio de definicion" (DEL) convierte menos */
  const j=eligePeso(cand,x=>(x.pos==="DEL"?3:1)*(x.nivel/50)*(tieneRasgo(x,"llegador")?1.8:1)*(tieneRasgo(x,"frio de definicion")?0.75:1))||elige(P.once);
  /* asistencia en ~60% de los goles de jugada; "llegador" asiste más */
  let asist=null;
  if(Math.random()<0.6){ const otros=P.once.filter(x=>x!==j&&x.pos!=="ARQ"); const a=eligePeso(otros,x=>(x.pos==="VOL"?2:1)*(tieneRasgo(x,"llegador")?1.7:1))||elige(otros); asist=a?a.n:null; }
  j.goles++; P.goleadores.push(j.n); regGol(P,min,j.n,true,"jugada",asist);
  if(P.part.local) P.gl++; else P.gv++;
  linea(P,min,"¡Gol de "+j.n+"!"+(asist?" (asistencia de "+asist+")":"")+" "+marcadorTxt(P),"gol");
}
function anotaRival(P,min){
  const j=elige(P.rivalPlantel.filter(x=>x.pos!=="ARQ"));
  if(P.part.local) P.gv++; else P.gl++;
  regGol(P,min,j.n,false,"jugada",null);
  linea(P,min,"Gol de "+P.part.rivalNombre+": "+j.n+". "+marcadorTxt(P),"gol");
  const m=miMarcador(P); if(m[1]-m[0]>=2) P.abajo2=true;   /* 6.25 · para el logro de remontada */
}
function marcadorTxt(P){
  const yo=P.part.local?P.gl:P.gv, otro=P.part.local?P.gv:P.gl;
  return "("+E.clubNombre+" "+yo+" - "+otro+" "+P.part.rivalNombre+")";
}
function miMarcador(P){ return P.part.local?[P.gl,P.gv]:[P.gv,P.gl]; }
/* 5.0 · barras de apoyo en vivo: Ánimo Hinchada / Confianza Plantel / Criterio DT.
   Se recalculan cada minuto persiguiendo un objetivo según marcador, físico y decisiones. */
function actualizarApoyo(P){
  if(!P.apoyo){
    P.apoyo={
      hinchada:clamp(E.ind.hinchada||60,8,95),
      plantel: clamp(E.ind.moral||60,8,95),
      criterio:clamp(48+(((E.staff&&E.staff.deportivo)||60)-60)/2,20,82),
      momentos:0
    };
  }
  const a=P.apoyo, [yo,otro]=miMarcador(P), diff=yo-otro;
  const fatiga=clamp((P.cansancio||0)*6,0,60);
  const tarde=(P.min>75);
  const tHin=clamp((E.ind.hinchada||60) + diff*13 + (tarde&&diff<0?-8:0) + (tarde&&diff>0?5:0), 3,99);
  const tPla=clamp((E.ind.moral||60) + diff*11 - fatiga*0.4, 3,99);
  const tCri=clamp(48 + diff*7 + a.momentos*5 + (((E.staff&&E.staff.deportivo)||60)-60)/3, 3,99);
  a.hinchada+=(tHin-a.hinchada)*0.25;
  a.plantel +=(tPla-a.plantel )*0.25;
  a.criterio+=(tCri-a.criterio)*0.20;
}

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
  P.cansancio+=P.desgaste*0.011*paso;
  (P.once||[]).forEach(j=>{ j.cansancio=clamp((j.cansancio||0)+P.desgaste*0.009*paso,0,30); });
  const min=P.min;
  /* 6.21 · silbidos de la barra por un pacto roto */
  if(P.barraSilba && min>=15 && !P.silbidoDicho){ P.silbidoDicho=true;
    linea(P,min,"Silbidos desde la tribuna: la barra no le perdona el pacto roto a la dirigencia.","grave");
    return {tipo:"nada",min:min}; }
  const pl=peligro(P);
  if(P.precClima&&P.precClima!==1){ pl.yo*=P.precClima; pl.el*=P.precClima; }
  actualizarFase(P);
  let N=28;
  if(P.fase==="dominio"){ N=23; pl.yo*=1.08; }
  if(P.fase==="ahogo"){ N=25; pl.el*=1.08; }
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
  /* autogol (raro), en cualquiera de los dos arcos */
  if(Math.random()<0.004){
    if(Math.random()<0.5){ /* el rival se la mete solo → gol propio */
      const rd=elige(P.rivalPlantel.filter(x=>x.pos!=="ARQ"))||{n:"un defensor rival"};
      if(P.part.local)P.gl++; else P.gv++; regGol(P,min,rd.n,true,"autogol",null);
      linea(P,min,"¡AUTOGOL de "+rd.n+" ("+P.part.rivalNombre+")! Regalo insólito. "+marcadorTxt(P),"gol");
      return {tipo:"gol",min:min};
    } else { /* uno tuyo la manda a tu propia red → gol rival */
      const md=elige(P.once.filter(x=>x.pos==="DEF"))||elige(P.once)||{n:"un defensor"};
      if(P.part.local)P.gv++; else P.gl++; regGol(P,min,md.n,false,"autogol",null);
      linea(P,min,"Autogol de "+md.n+"… se la mandó a su propio arco. "+marcadorTxt(P),"grave");
      return {tipo:"golRival",min:min};
    }
  }
  /* polémica en el tramo caliente */
  const pPol=(P.clasico||P.var)?0.018:0.012;
  if(min>60&&Math.random()<pPol){ polemicaArbitral(P); return {tipo:"polemica",min:min}; }
  /* tarjeta · 6.20 · "cabeza caliente": post-60' arriesga más (mitad si viene ganando); 2ª amarilla = roja */
  if(Math.random()<0.03*((P.arbitro&&P.arbitro.cartas)||1)){
    const ganando=(P.part.local?P.gl>P.gv:P.gv>P.gl);
    const calientes=P.once.filter(x=>x.rasgos&&x.rasgos.indexOf("cabeza caliente")>=0);
    let j;
    if(min>60 && calientes.length && Math.random()<(ganando?0.06:0.12)+0.4) j=elige(calientes);
    else j=elige(P.once);
    const caliente=j.rasgos&&j.rasgos.indexOf("cabeza caliente")>=0;
    P.amar=P.amar||{}; P.amar[j.n]=(P.amar[j.n]||0)+1; j.tarjetas++; P.tarjetas.push(j.n);
    if(caliente && P.amar[j.n]>=2 && Math.random()<0.25){
      P.once=P.once.filter(x=>x!==j); j.estado="banca"; P.empuje-=1; P.orden-=3; P.tuvoRoja=true;   /* 6.25 · logro roja+gana */
      linea(P,min,"¡ROJA para "+j.n+"! Segunda amarilla: se le calentó la cabeza y deja a los suyos con diez.","grave");
      return {tipo:"roja",min:min};
    }
    linea(P,min,min>75?("Amarilla para "+j.n+". En este tramo duele más.")
      :("Amarilla para "+j.n+(caliente?", que juega siempre al límite.":".")),min>70?"grave":"");
    return {tipo:"tarjeta",min:min}; }
  /* chance perdida — con contexto de marcador y minuto */
  if(Math.random()<0.14){
    linea(P,min,fraseChance(P,min));
    return {tipo:"chance",min:min};
  }
  /* color / relato — más denso, menos “nada” */
  if(Math.random()<0.18){
    linea(P,min,fraseRelato(P,min));
    return {tipo:"relato",min:min};
  }
  return {tipo:"nada",min:min};
}
/* 7.10 · estadísticas en vivo (posesión, remates, al arco, córners).
   Se llama después de cada tick con el evento devuelto. */
function actualizarStats(P,ev){
  if(!P.stats) P.stats={pos:0.5,remMio:0,remRiv:0,arcMio:0,arcRiv:0,corMio:0,corRiv:0};
  const s=P.stats;
  const posT=clamp(0.5+((P.ataque||0)-(P.rival||0))*0.006+(P.fase==="dominio"?0.12:(P.fase==="ahogo"?-0.12:0))+(P.empuje||0)*0.008,0.22,0.78);
  s.pos+=(posT-s.pos)*0.08;
  if(ev) switch(ev.tipo){
    case "gol": s.remMio++; s.arcMio++; break;
    case "golRival": s.remRiv++; s.arcRiv++; break;
    case "penal": case "tiroLibre": s.remMio++; s.arcMio++; break;
    case "penalRival": s.remRiv++; s.arcRiv++; break;
    case "chance": s.remMio++; if(Math.random()<0.5) s.arcMio++; if(Math.random()<0.35) s.corMio++; break;
    case "polemica": if(Math.random()<0.5) s.remMio++; break;
  }
  if(Math.random()<0.014) s.corRiv++;
  if(Math.random()<0.010) s.remRiv++;
}
/* frases de chance según marcador y tramo */
function fraseChance(P,min){
  const [yo,otro]=miMarcador(P);
  const dif=yo-otro;
  const riv=P.part.rivalNombre||"el rival";
  if(dif<0&&min>60) return elige([
    "Ocasión clara y se va afuera. El empate estaba ahí.",
    "El arquero rival saca un milagro. La tribuna se agarra la cabeza.",
    "Se pierde una mano a mano. El partido se está yendo.",
    riv+" se salva en la línea. Parecía el  gol del empate."
  ]);
  if(dif>0&&min>70) return elige([
    "Casi el segundo que lo liquida. Se fue rozando el palo.",
    "Contraataque limpio y el delantero la manda afuera. Sigue vivo el rival.",
    "El arquero rival vuela otra vez. Todavía no está cerrado."
  ]);
  return elige([
    "Tiro de media distancia que se va apenas afuera.",
    "El arquero rival manda al córner una que iba adentro.",
    "Se pierde una clarísima en el área chica.",
    riv+" avisa con un cabezazo que pasa cerca.",
    "Se salva en la línea. El estadio se agarra la cabeza.",
    "Centro peligroso y nadie llega al remate. Se pierde la chance."
  ]);
}
/* color del partido según cansancio, minuto y clima */
function fraseRelato(P,min){
  const cans=P.cansancio||0;
  const riv=P.part.rivalNombre||"el rival";
  const j=(elige(P.once)||{}).n;
  const modo=(E&&E.modo)||"historico";
  if(P.clasico&&min<20) return elige([
    "Clásico. La platea no perdona un error.",
    "Cada falta se discute como si fuera la final."
  ]);
  if(modo==="caos"&&Math.random()<0.25) return elige([
    "Pasa algo raro en la banda. Nadie entiende.",
    "El partido se desordena de un saque."
  ]);
  if(j&&min>20) return elige([
    j+" pide la pelota y no se la dan.",
    j+" recupera y la juega simple.",
    j+" se queda corto. El físico ya pesa.",
    "La tribuna canta el nombre de "+j+"."
  ]);
  if(min<15) return elige([
    "El partido recién arranca. Los dos se estudian.",
    "Primeros toques, todavía sin profundidad.",
    "La tribuna empuja desde el primer minuto."
  ]);
  if(cans>7) return elige([
    "Se nota el desgaste. Las piernas ya no responden igual.",
    "El ritmo bajó. El físico empieza a mandar.",
    "Hay más errores por cansancio que por falta de ideas."
  ]);
  if(min>75) return elige([
    "Último tramo. Cada pelota parece la definitiva.",
    "El árbitro mira el reloj. La tensión sube en la platea.",
    "Se juega con el corazón más que con la cabeza."
  ]);
  if(P.precClima&&P.precClima<0.95) return elige([
    "El clima complica. La pelota no corre limpia.",
    "Cancha pesada. Cuesta encontrar espacios.",
    "El viento desvía un centro. El partido se pone trabado."
  ]);
  return elige([
    "Juego trabado en la mitad de la cancha.",
    "El árbitro cobra falta y la tribuna reclama.",
    "Cambio de ritmo: el partido se abrió.",
    "Se juega con el balón parado como única arma.",
    "Momento de estudio: nadie quiere equivocarse.",
    riv+" recupera y tira un pelotazo largo. Se diluye la jugada.",
    "Buen intercambio de pases, pero sin llegada clara."
  ]);
}
function lesionEnPartido(P){
  const j=elige(P.once.filter(x=>x.pos!=="ARQ"));
  if(j){
    j.lesion=ri(2,5); P.lesionados.push(j.n);
    linea(P,P.min,j.n+" se resiente y no puede seguir.","grave");
    recambioPorLesion(P,j);
  }
  return j;
}
function tiroLibreAuto(P){
  const j=pateadorDe(P.once);
  linea(P,P.min,"Tiro libre peligroso para "+E.clubNombre+", lo toma "+j.n+"…");
  const prob=clamp(0.11+((j.nivel||70)-70)*0.004+((j.rasgos&&j.rasgos.includes("tiro libre"))?0.10:0),0.05,0.32);
  if(Math.random()<prob){ j.goles++; P.goleadores.push(j.n); regGol(P,P.min,j.n,true,"tiro libre"); if(P.part.local)P.gl++; else P.gv++;
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
/* Pools tácticos grandes por situación. momentoActual elige 4 al azar
   cada vez → variedad real, no siempre las mismas opciones. */
const TACTICAS_INICIO=[
 {t:"Salir a comerse el partido",ef:{ataque:3,riesgoPlan:2}},
 {t:"Empezar de menos a más",ef:{orden:3,ataque:-1}},
 {t:"Recordarles lo que está en juego",ef:{ataque:1.5,orden:1.5,desgaste:1}},
 {t:"Presión alta desde el pitazo",ef:{ataque:2,riesgoPlan:2,desgaste:3}},
 {t:"Orden atrás y salir de contra",ef:{orden:3,ataque:1,desgaste:-1}},
 {t:"Pelota al piso y paciencia",ef:{orden:2,ataque:1,desgaste:1}},
 {t:"Meterle huevo y aguante físico",ef:{ataque:1,orden:1,desgaste:2}},
 {t:"Confiar en el plan y no tocar nada",ef:{orden:1}}
];
const TACTICAS_ABAJO=[
 {t:"Meter otro delantero y tirarse encima",ef:{ataque:5,riesgoPlan:3,desgaste:2}},
 {t:"Sostener el orden y esperar el error",ef:{orden:3,ataque:1}},
 {t:"Cambiar el sistema completo",ef:{ataque:3,orden:-1,riesgoPlan:1.5}},
 {t:"Volcar el juego por las bandas",ef:{ataque:3,desgaste:1}},
 {t:"Buscarlo por arriba, centros al área",ef:{ataque:2,orden:-1,riesgoPlan:1}},
 {t:"Meter un gambeteador para romper",ef:{ataque:4,riesgoPlan:2,desgaste:1}},
 {t:"Presión asfixiante, todo o nada",ef:{ataque:3,riesgoPlan:4,desgaste:4,orden:-2}},
 {t:"No alterar el plan: aguantar la idea",ef:{orden:1.5}}
];
const TACTICAS_ARRIBA=[
 {t:"Cerrarse atrás y aguantar",ef:{orden:4,ataque:-3,riesgoPlan:-1}},
 {t:"Ir por otro para liquidarlo",ef:{ataque:4,riesgoPlan:2}},
 {t:"Manejar el partido con la pelota",ef:{orden:2,ataque:1,desgaste:-1}},
 {t:"Congelar el ritmo y quemar tiempo",ef:{orden:3,ataque:-2,desgaste:-1}},
 {t:"Refrescar piernas atrás",ef:{orden:2,desgaste:-2}},
 {t:"Bajar un volante de contención",ef:{orden:3,ataque:-1}},
 {t:"Salir de contra con los rápidos",ef:{ataque:3,orden:1,riesgoPlan:1}},
 {t:"Confiar en lo que viene funcionando",ef:{orden:1,desgaste:-0.5}}
];
const TACTICAS_EMPATE=[
 {t:"Meter un cambio ofensivo",ef:{ataque:4,riesgoPlan:2}},
 {t:"Refrescar el mediocampo",ef:{orden:2,ataque:1,desgaste:-2}},
 {t:"Arriesgar con doble nueve",ef:{ataque:5,orden:-2,riesgoPlan:2}},
 {t:"Jugar por las bandas y tirar centros",ef:{ataque:3,desgaste:1}},
 {t:"Pedir intensidad y presión",ef:{ataque:2,riesgoPlan:2,desgaste:2}},
 {t:"Ordenarse y esperar el momento",ef:{orden:3,ataque:-1}},
 {t:"Dejarlo como está",ef:{}},
 {t:"Una consigna corta y seguir",ef:{orden:1,ataque:0.5}}
];
/* 6.28 · trivia de pizarra: preguntas REALES de fútbol y de matemática simple.
   Si respondes bien, el equipo se agranda (más chance) y hasta puede caer un gol;
   si erras, se ponen nerviosos. Es absurdo y a propósito. */
const TRIVIA_FUTBOL=[
 {q:"Rápido, ¿cuántos jugadores tiene un equipo en la cancha?",op:["10","11","12"],sol:1},
 {q:"¿Cuántos minutos dura cada tiempo reglamentario?",op:["40","45","50"],sol:1},
 {q:"Hoy en el fútbol, ganar un partido, ¿cuántos puntos da?",op:["2","3","4"],sol:1},
 {q:"¿Con cuántas tarjetas amarillas te expulsan?",op:["Dos","Tres","Cuatro"],sol:0},
 {q:"La Copa Libertadores, ¿de qué continente es?",op:["Europa","Sudamérica","Asia"],sol:1},
 {q:"¿Cuántos jueces de línea hay habitualmente por partido?",op:["Uno","Dos","Cuatro"],sol:1},
 {q:"Un hat-trick, ¿cuántos goles son?",op:["Dos","Tres","Cinco"],sol:1},
 {q:"¿Desde qué distancia se patea un penal, aprox.?",op:["9 metros","11 metros","16 metros"],sol:1},
 {q:"¿De qué color es la tarjeta de expulsión?",op:["Amarilla","Roja","Azul"],sol:1},
 {q:"¿Cuántos cambios suele permitir hoy el reglamento?",op:["Tres","Cinco","Siete"],sol:1},
 {q:"¿Cómo se reanuda el juego si la pelota sale por la línea lateral?",op:["Córner","Saque de banda","Tiro libre"],sol:1},
 {q:"El único título de Copa Libertadores del fútbol chileno, ¿de qué club es?",op:["U. de Chile","Colo-Colo","U. Católica"],sol:1},
 {q:"¿De qué ciudad es Cobreloa?",op:["Antofagasta","Calama","Iquique"],sol:1},
 {q:"¿Cuántos puntos suma un empate?",op:["Cero","Uno","Dos"],sol:1},
 {q:"Si el defensa manda la pelota afuera por su línea de fondo, ¿qué se cobra?",op:["Saque de meta","Córner","Penal"],sol:1},
 {q:"¿Cuántos tiempos tiene un partido reglamentario (sin alargue)?",op:["Uno","Dos","Tres"],sol:1},
 {q:"La posición adelantada se llama…",op:["Offside","Handball","Falta"],sol:0},
 {q:"¿Con qué parte del cuerpo NO puede tocar la pelota el arquero fuera del área?",op:["El pie","La cabeza","La mano"],sol:2},
 {q:"El clásico universitario chileno lo juegan la U y…",op:["Colo-Colo","U. Católica","Everton"],sol:1},
 {q:"¿Cada cuántos años se juega el Mundial de fútbol?",op:["Dos","Cuatro","Seis"],sol:1},
 {q:"El campeonato de Primera en Chile, ¿en qué división es?",op:["Segunda","Primera","Tercera"],sol:1},
 {q:"¿Cuántos jugadores como mínimo debe tener un equipo para seguir jugando?",op:["Seis","Siete","Ocho"],sol:1},
 {q:"El palo horizontal del arco se llama…",op:["Travesaño","Poste","Red"],sol:0},
 {q:"¿Qué gana el equipo que mete más goles?",op:["El partido","Un córner","Una amarilla"],sol:0},
 {q:"El árbitro que corre por la banda con la bandera es el…",op:["Juez de línea","Cuarto árbitro","VAR"],sol:0},
 {q:"¿De qué región es el clásico penquista (Concepción)?",op:["Biobío","Valparaíso","Coquimbo"],sol:0},
 {q:"Un tiro desde la esquina se llama…",op:["Penal","Córner","Saque de meta"],sol:1}
];
function triviaMate(){
  const a=ri(3,12), b=ri(2,9), op=elige(["+","−","×"]);
  const r=op==="+"?a+b:(op==="−"?a-b:a*b);
  const set=new Set([r]); while(set.size<3){ set.add(r+ri(-4,4)); }
  const ops=[...set].sort(()=>Math.random()-0.5);
  return {q:"Concentración: ¿cuánto es "+a+" "+op+" "+b+"?",op:ops.map(String),sol:ops.indexOf(r)};
}
/* opciones numéricas alrededor del valor correcto (distintas, sin negativos) */
function _opsNum(correcto, spread){
  const set=new Set([correcto]); let g=0;
  while(set.size<3 && g++<40){ const d=correcto+ri(-spread,spread); if(d>=0) set.add(d); }
  let k=1; while(set.size<3){ set.add(correcto+k); k++; }
  const arr=[...set].sort(()=>Math.random()-0.5);
  return {op:arr.map(String), sol:arr.indexOf(correcto)};
}
/* opciones de texto: la correcta + 2 distractores */
function _opsTxt(correcto, pool){
  const otros=(pool||[]).filter(x=>x&&x!==correcto);
  const arr=[correcto].concat(mezcla(otros).slice(0,2));
  while(arr.length<3) arr.push("—");
  const mez=arr.sort(()=>Math.random()-0.5);
  return {op:mez, sol:mez.indexOf(correcto)};
}
/* trivia PROCEDURAL: preguntas inventadas sobre TU club con respuesta real */
function triviaProc(P){
  const cand=[];
  const p=(E.plantel||[]).filter(j=>!j.vendido&&!j.cedido);
  const gol=p.filter(j=>j.pos==="DEL").sort((a,b)=>b.goles-a.goles)[0];
  if(gol){ const o=_opsNum(gol.goles||0,3); cand.push({q:"¿Cuántos goles lleva "+gol.n+" esta temporada?",op:o.op,sol:o.sol}); }
  const fig=p.slice().sort((a,b)=>b.nivel-a.nivel)[0];
  if(fig){ const o=_opsNum(fig.edad,3); cand.push({q:"Concentración: ¿qué edad tiene "+fig.n+"?",op:o.op,sol:o.sol}); }
  if(E.temporada&&E.temporada.pts!=null){ const o=_opsNum(E.temporada.pts,4); cand.push({q:"¿Cuántos puntos llevas en el torneo?",op:o.op,sol:o.sol}); }
  if(P.part&&P.part.rivalNombre){
    const rivales=(typeof LIGA_ACT!=="undefined"?LIGA_ACT.map(c=>c.n):[]).filter(n=>n!==E.clubNombre);
    const o=_opsTxt(P.part.rivalNombre, rivales.length?rivales:["el rival de turno","un equipo grande","un chico"]);
    cand.push({q:"Rápido: ¿contra quién juegan hoy?",op:o.op,sol:o.sol});
  }
  const est=(typeof estadioNombre==="function")&&estadioNombre(E.club);
  if(est&&typeof ESTADIOS_DATA!=="undefined"){
    const otros=Object.keys(ESTADIOS_DATA).map(k=>ESTADIOS_DATA[k].nombre).filter(n=>n!==est);
    const o=_opsTxt(est, otros);
    cand.push({q:"¿Cómo se llama tu estadio de local?",op:o.op,sol:o.sol});
  }
  const cap=p.filter(j=>j.rasgos&&j.rasgos.indexOf("capitán")>=0)[0]||fig;
  if(cap){ const o=_opsNum(Math.round(cap.nivel/10)*10,10); cand.push({q:"Al ojo: ¿de cuánto es el nivel de "+cap.n+"?",op:o.op,sol:o.sol}); }
  /* más variedad: estado de la temporada (respuesta calculada) */
  if(typeof posicionEnTabla==="function"){ try{ const pos=posicionEnTabla(); if(pos>=1){ const o=_opsNum(pos,3); cand.push({q:"¿En qué puesto va "+(E.clubNombre||"tu club")+" en la tabla?",op:o.op,sol:o.sol}); } }catch(e){} }
  if(E.temporada){
    const o1=_opsNum(E.temporada.pg||0,3); cand.push({q:"¿Cuántos partidos ganaste este año?",op:o1.op,sol:o1.sol});
    const o2=_opsNum(E.temporada.gf||0,4); cand.push({q:"¿Cuántos goles hizo tu equipo este año?",op:o2.op,sol:o2.sol});
    const o3=_opsNum(E.temporada.pj||0,3); cand.push({q:"¿Cuántas fechas van jugadas del torneo?",op:o3.op,sol:o3.sol});
  }
  const veterano=p.slice().sort((a,b)=>b.edad-a.edad)[0];
  if(veterano){ const o=_opsNum(veterano.edad,3); cand.push({q:"El más veterano del plantel, "+veterano.n+", ¿qué edad tiene?",op:o.op,sol:o.sol}); }
  return cand.length?elige(cand):null;
}
/* elige una trivia evitando las ya vistas en la carrera (no se repite semana a semana ni entre temporadas) */
function momentoTrivia(P){
  if(!Array.isArray(E.triviaVistas)) E.triviaVistas=[];
  let base=null;
  for(let intento=0;intento<7 && !base;intento++){
    const r=Math.random();
    const b=(r<0.42)?triviaProc(P):(r<0.72?triviaMate():elige(TRIVIA_FUTBOL));
    if(!b) continue;
    if(intento<6 && E.triviaVistas.indexOf(b.q)>=0) continue;   /* ya la vio → probar otra */
    base=b;
  }
  if(!base) base=triviaMate();
  E.triviaVistas.push(base.q);
  if(E.triviaVistas.length>26) E.triviaVistas.shift();   /* cubre más de una temporada de trivias */
  const factor=clamp(0.7+((E.ind&&E.ind.plantel)||60)/100,0.7,1.7);
  return {tipo:"trivia", t:"Test rápido de pizarra 🧮", factor:factor,
    d:"Minuto "+P.min+". Les tiras una pregunta para sacarlos del nervio. Si aciertan, se sueltan; si no, se traban.",
    q:base.q, sol:base.sol,
    op:base.op.map((t,i)=>({t:t, ok:i===base.sol}))};
}
/* ¿hay un momento crítico donde tiene sentido ofrecer el 'preparado especial'? */
function momentoCritico(P){
  const [yo,otro]=miMarcador(P);
  return P.min>=62 && Math.abs(yo-otro)<=1 && !P.doping;
}
function opcionDoping(P){
  const costo=Math.max(60, Math.round((E.plata||0)*0.18));
  return {t:"💉 Repartir un «preparado especial»", doping:true, costo:costo,
    d:"Muy caro ("+plata(costo)+") y muy turbio: los agranda un montón por lo que queda, pero si estalla, estalla feo."};
}
function momentoActual(P){
  const [yo,otro]=miMarcador(P);
  const dif=yo-otro;
  /* de vez en cuando, en vez de la charla, cae una trivia (nunca en la previa) */
  if(P.min>=5 && !P._triviaReciente && Math.random()<0.28){ P._triviaReciente=true; return momentoTrivia(P); }
  P._triviaReciente=false;
  let t,d,pool;
  if(P.min<5){ t="Antes de salir a la cancha"; d="Última charla en el camarín. El plan está armado, falta el mensaje."; pool=TACTICAS_INICIO; }
  else if(dif<0){ t="Vas abajo en el marcador"; d="Minuto "+P.min+". El partido se está yendo y en la tribuna ya hay murmullo."; pool=TACTICAS_ABAJO; }
  else if(dif>0){ t="Vas arriba"; d="Minuto "+P.min+". Hay ventaja, pero el rival empujó los últimos minutos."; pool=TACTICAS_ARRIBA; }
  else { t="Está empatado"; d="Minuto "+P.min+". El partido está para cualquiera."; pool=TACTICAS_EMPATE; }
  const op=mezcla(pool).slice(0,4);
  if(momentoCritico(P) && (E.plata||0)>=60){ op[3]=opcionDoping(P); }   /* 4ª opción: dopar en momento clave */
  return {t:t, d:d, op:op};
}
/* aplica el doping: efecto fuerte por lo que queda, cobra caro, siembra el riesgo */
function doparEquipo(P,costo){
  aplicarEfectos({plata:-costo});
  P.doping=true; P.ataque+=5; P.orden+=2; P.empuje+=1.6; P.desgaste=Math.max(0,(P.desgaste||0)-3);
  linea(P,P.min,"Algo cambió: el equipo salió recargado, con los ojos como platos. Corren como si recién empezara.","gol");
  if(typeof recordar==="function") recordar("doping","recurriste a un «preparado especial» para ganar un partido",{peso:"alto",tono:"malo"});
}
/* 7.10 · FutbolGram como PISTA en las decisiones tácticas:
   clasifica cada opción por su intención y la gente opina apuntando a una dirección. */
function direccionOpcion(ef){
  if(!ef) return "equilibrio";
  if((ef.riesgoPlan||0)>=3.5) return "riesgo";
  if((ef.ataque||0)>=4) return "ataque";
  if((ef.orden||0)>0 && (ef.ataque||0)<=1.5) return "aguantar";
  return "equilibrio";
}
function direccionRecomendada(P){
  const [yo,ot]=miMarcador(P); const dif=yo-ot;
  if(dif<0) return "ataque";
  if(dif>0) return P.min>=70?"aguantar":"equilibrio";
  return "equilibrio";
}
const OPINIONES_TACTICA={
  ataque:["echen toda la carne al asador","métanle otro delantero, hay que ir a buscarlo","no se puede especular perdiendo, ¡arriba!","que se vengan encima, no hay nada que cuidar","paren de tocar al costado y vayan al arco"],
  aguantar:["ordenados atrás y a cuidar esto","no regalen nada, aguanten la ventaja","a meterlo en el bolsillo y defender","paren la pelota, tranquilos, sin volverse locos","cierren el partido, no lo abran"],
  equilibrio:["con paciencia, sin desesperarse","jueguen como saben, sin locuras","pie firme, que el gol llega solo","ni tan tan ni muy muy, tranquilos"],
  riesgo:["a todo o nada, ¡qué más da!","tírense con todo aunque quedemos expuestos","es esto o nada, jueguensela"]
};
/* devuelve 3 opiniones: mayoría del consenso + 1 disidente (el jugador lee la general) */
function opinionesTactica(dir){
  const base=OPINIONES_TACTICA[dir]||OPINIONES_TACTICA.equilibrio;
  const otras=Object.keys(OPINIONES_TACTICA).filter(k=>k!==dir);
  const disPool=OPINIONES_TACTICA[elige(otras)]||[];
  const consenso=mezcla(base.slice()).slice(0,2).map(t=>({t:t,consenso:true}));
  const dis={t:elige(disPool),consenso:false};
  return mezcla(consenso.concat(dis));
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
  part.goleadores=(P.goleadores||[]).slice();   /* 6.19 · para que los tuits citen al goleador real */
  P.once.forEach(j=>{
    j.partidos++;
    j.minutosTemporada=(j.minutosTemporada||0)+(90-(j.minEntrada||0));   /* 6.24 · minutos jugados en la temporada */
    j.minEntrada=0;
    j.forma=clamp(j.forma+(yo>otro?4:(yo<otro?-4:0))+ri(-3,3),30,99);
    j.cansancio=clamp((j.cansancio||0)+4,0,30);
  });
  E.plantel.forEach(j=>{
    if(P.once.indexOf(j)<0) j.cansancio=clamp((j.cansancio||0)-3,0,30);
  });

  let caja=0,gente=0;
  if(part.local){ const t=ingresoPartidoLocal(part); caja=t.ingreso; gente=t.gente; aplicarEfectos({plata:caja}); }
  part.publico=gente; part.caja=caja;

  if(part.tipo==="liga"){
    const pv=puntosVictoria();
    const t=E.temporada; t.pj++; t.gf+=yo; t.gc+=otro;
    if(yo>otro){ t.pg++; t.pts+=pv; } else if(yo===otro){ t.pe++; t.pts+=1; } else t.pp++;
    const mi=E.tabla[E.club];
    if(mi){ mi.pj++; mi.gf+=yo; mi.gc+=otro; if(yo>otro){ mi.pg++; mi.pts+=pv; } else if(yo===otro){ mi.pe++; mi.pts++; } else mi.pp++; }
    const riv=part.rivalId&&E.tabla[part.rivalId];
    if(riv){ riv.pj++; riv.gf+=otro; riv.gc+=yo; if(otro>yo){ riv.pg++; riv.pts+=pv; } else if(otro===yo){ riv.pe++; riv.pts++; } else riv.pp++; }
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
  if(typeof golpeBolsa==="function") golpeBolsa(yo>otro?1:(yo<otro?-1:0));
  /* 6.25 · logros de partido */
  if(typeof desbloquear==="function"){
    if(yo>otro && P.abajo2) desbloquear("remontada");
    if(yo>otro && P.tuvoRoja) desbloquear("roja_gana");
    if(yo>otro && esClasico(part)){
      const casa=P.once.filter(j=>j.rasgos&&j.rasgos.indexOf("de la casa")>=0).length;
      if(casa>=3) desbloquear("clasico_casa");
      if(yo-otro>=4) desbloquear("goleada_clasico");
    }
    /* 7.00 · hooks de los logros que dejó Grok (LOGROS_VOZ) */
    if(typeof LOGRO_POR_ID!=="undefined"){
      const clasico=esClasico(part);
      /* hat-trick de un mismo delantero propio */
      const cnt={}; (P.goleadores||[]).forEach(n=>{ cnt[n]=(cnt[n]||0)+1; });
      const hatTrick=Object.keys(cnt).some(n=>cnt[n]>=3);
      /* minuto del último gol propio (para el agónico de visita) */
      const golesProp=(P.golesDetalle||[]).filter(g=>g.propio);
      const ultMin=golesProp.length?Math.max.apply(null,golesProp.map(g=>g.min||0)):0;
      if(LOGRO_POR_ID.no_se_jode && clasico && yo>otro) desbloquear("no_se_jode");
      if(LOGRO_POR_ID.tres_del_9 && hatTrick) desbloquear("tres_del_9");
      if(LOGRO_POR_ID.diez_visita && !part.local && P.tuvoRoja && yo>=otro) desbloquear("diez_visita");
      if(LOGRO_POR_ID.micro_cantando && !part.local && yo>otro && ultMin>=80) desbloquear("micro_cantando");
      if(LOGRO_POR_ID.luna_penal && P.penalErrado && yo>=otro) desbloquear("luna_penal");
      if(LOGRO_POR_ID.el_1_es_el_dt && !part.local && yo===0 && otro===0) desbloquear("el_1_es_el_dt");
      if(LOGRO_POR_ID.silencio_local && part.local && yo<otro && yo===0) desbloquear("silencio_local");
      if(LOGRO_POR_ID.pueblo_lleno && part.local && yo>otro && ["LIM","CAL","COB","NUB"].indexOf(E.club)>=0) desbloquear("pueblo_lleno");
    }
  }
  if(typeof esClasico==="function" && esClasico(part)){
    if(yo>otro){
      const primera=!E.flags.clasicoGanado; E.flags.clasicoGanado=true;
      if(typeof recordar==="function") recordar("clasico","le ganaste el clásico a "+part.rivalNombre+" "+yo+"-"+otro,{peso:"alto",tono:"bueno"});
      if(primera && E.objetivos && E.objetivos.some(o=>o.tipo==="clasico"))
        notificar({t:"¡Meta cumplida!",tipo:"bueno",d:"Ganaste el clásico: cumpliste tu objetivo institucional del año.",bandeja:false});
    } else if(yo<otro && typeof recordar==="function"){
      recordar("clasico","perdiste el clásico con "+part.rivalNombre+" "+otro+"-"+yo,{peso:"alto",tono:"malo"});
    }
  }
  /* goleadas memorables (para bien y para mal) */
  if(typeof recordar==="function"){
    if(yo-otro>=3) recordar("goleada","goleaste "+yo+"-"+otro+" a "+part.rivalNombre,{peso:"medio",tono:"bueno"});
    else if(otro-yo>=3) recordar("paliza","te golearon "+otro+"-"+yo+" de visita ante "+part.rivalNombre,{peso:"medio",tono:"malo"});
  }
  /* 6.28 · consecuencias del doping: puede estallar el escándalo o caerse un titular */
  if(P.doping){
    const r=Math.random();
    if(r<0.35){
      aplicarGrupos({prensa:-18,hinchada:-10,anfp:-16,comunidad:-8,directorio:-10});
      aplicarRep({credibilidad:-16,publica:-10});
      const multa=80; aplicarEfectos({plata:-multa,prestigio:-6});
      if(E.flags) E.flags.dopingEscandalos=(E.flags.dopingEscandalos||0)+1;
      notificar({t:"ESCÁNDOLO DE DOPAJE",tipo:"malo",
        d:"Un control dio positivo. Estalla el escándalo: multa de "+plata(multa)+", cae tu credibilidad y la prensa te destroza. Esto queda en tu prontuario."});
      if(typeof recordar==="function") recordar("doping","te estalló un caso de dopaje encima",{peso:"alto",tono:"malo"});
      if(typeof desbloquear==="function") desbloquear("quimico");
    } else if(r<0.55){
      const victima=elige(P.once.filter(j=>j.pos!=="ARQ"))||P.once[0];
      if(victima){ victima.lesion=Math.max(victima.lesion||0,3); victima.estado="lesion";
        notificar({t:"Se descompensó "+victima.n,tipo:"malo",
          d:"Después del partido, "+victima.n+" terminó descompensado y con una lesión. El «preparado» pasó la cuenta: afuera unas fechas."}); }
    } else {
      notificar({t:"Zafaste… esta vez",tipo:"neutro",bandeja:false,
        d:"Nadie controló nada. El «preparado especial» hizo su trabajo y nadie se enteró. Pero la próxima puede no salir tan barata."});
    }
    P.doping=false;
  }
  /* loop de aprendizaje: avisar si el resultado te acerca o aleja de tu meta deportiva */
  if(typeof avisoObjetivoPartido==="function") avisoObjetivoPartido(posAntes,posDespues);
  /* post-partido: siempre asegura al menos una decisión DEPORTIVA sobre la mesa */
  if(typeof sembrarDecisionProcDeCategoria==="function" && typeof pilarDeBuzon==="function"){
    const hayDep=(E.decPend||[]).some(x=>{ const d=(E.decProc&&E.decProc[x.id])||(typeof decisionPorId==="function"&&decisionPorId(x.id)); return d&&pilarDeBuzon(d.buzon).id==="DEPORTIVO"; });
    if(!hayDep) sembrarDecisionProcDeCategoria("DEPORTIVO");
  }
  E.idx++;
  guardar();
  return {yo:yo,otro:otro,caja:caja,gente:gente,posAntes:posAntes,posDespues:posDespues,
    golesDetalle:(P.golesDetalle||[]),tarjetas:(P.tarjetas||[]),lesionados:(P.lesionados||[]),esLiga:part.tipo==="liga"};
}
/* los otros 7 partidos de la fecha (se guardan para mostrarlos en el resumen) */
function simularResto(part){
  E.ultimaFecha=[];
  if(!part.jornada||!part.jornada.length){
    if(typeof emparejarFecha==="function") part.jornada=emparejarFecha(E.anio,part.fecha,E.club,part.rivalId);
  }
  if(!part.jornada) return;
  part.jornada.forEach(par=>{
    if(par[0]===E.club||par[1]===E.club) return;
    const a=CLUB_POR_ID[par[0]],b=CLUB_POR_ID[par[1]];
    const fa=a.fuerza+5+rnd(-9,9), fb=b.fuerza+rnd(-9,9);
    const d=(fa-fb)/12;
    let ga=clamp(Math.round(1.25+d*0.6+rnd(-1,1.3)),0,6);
    let gb=clamp(Math.round(1.05-d*0.6+rnd(-1,1.3)),0,6);
    if(!E.tabla[a.id]) E.tabla[a.id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
    if(!E.tabla[b.id]) E.tabla[b.id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
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
