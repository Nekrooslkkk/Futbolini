"use strict";
/* ============================================================
   FUTBOLINI 3.0 · motor.js
   Estado, resolución de decisiones, economía, modificadores,
   eventos y paso del tiempo. No dibuja nada.
   ============================================================ */

let E=null;

const IND=[
 {k:"plantel",  n:"Plantel",  c:"#4fbf3f", d:"Nivel futbolístico real del equipo."},
 {k:"moral",    n:"Moral",    c:"#39b7e0", d:"Cómo está el camarín. Pesa tanto como el nivel."},
 {k:"hinchada", n:"Hinchada", c:"#e0563f", d:"Ánimo de la gente. Mueve taquilla y presión."},
 {k:"socios",   n:"Socios",   c:"#9a6fe0", d:"Base de socios: ingreso fijo y votos internos."},
 {k:"cantera",  n:"Cantera",  c:"#2fa87f", d:"Calidad del fútbol joven. Plantel y plata a futuro."},
 {k:"estadio",  n:"Estadio",  c:"#a5854a", d:"Estado del recinto. Aforo, seguridad y sanciones."},
 {k:"prestigio",n:"Prestigio",c:"#e0a92a", d:"Peso del nombre: sponsors, TV y atractivo."},
 {k:"riesgo",   n:"Riesgo",   c:"#c9392c", d:"Cuánta cuerda le estás dando al escándalo."}
];

const IND_BASE={
 CC:{plantel:78,moral:70,hinchada:84,socios:55,cantera:64,estadio:66,prestigio:80,riesgo:18},
 UCH:{plantel:58,moral:52,hinchada:80,socios:50,cantera:62,estadio:24,prestigio:56,riesgo:24},
 UC:{plantel:72,moral:66,hinchada:48,socios:56,cantera:78,estadio:70,prestigio:68,riesgo:14},
 PAL:{plantel:58,moral:58,hinchada:34,socios:34,cantera:54,estadio:42,prestigio:44,riesgo:18},
 LIM:{plantel:40,moral:62,hinchada:30,socios:20,cantera:34,estadio:26,prestigio:24,riesgo:12}
};
const CAJA_BASE={CC:{plata:900,deuda:2600},UCH:{plata:320,deuda:1400},UC:{plata:700,deuda:600},
 PAL:{plata:280,deuda:380},LIM:{plata:150,deuda:120}};

const CLUB_INFO={
 CC:{n:"Colo-Colo",esc:"⚪",est:"Estadio Monumental",dt:"Mirko Jozić",
  desc:"Campeón nacional 1989 y 1990. Entra a 1991 con un tricampeonato en juego, un estadio nuevo y una deuda que pesa."},
 UCH:{n:"Universidad de Chile",esc:"🔵",est:"Estadio Nacional (arrendado)",dt:"el cuerpo técnico",
  desc:"Vuelve del descenso de 1988. Hinchada enorme, caja chica y sin estadio propio."},
 UC:{n:"Universidad Católica",esc:"🔷",est:"San Carlos de Apoquindo",dt:"el cuerpo técnico",
  desc:"Estadio propio, cantera fuerte y administración ordenada."},
 PAL:{n:"Palestino",esc:"🟩",est:"Municipal de La Cisterna",dt:"el cuerpo técnico",
  desc:"Club de colonia con historia grande y presupuesto acotado."},
 LIM:{n:"Deportes Limache",esc:"🟨",est:"Estadio Lucio Fariña",dt:"el cuerpo técnico",
  desc:"Club provincial. Todo se juega a sobrevivir y crecer."}
};

/* ---------------- arranque ---------------- */
function nuevaPartida(clubId,anio,modo){
  const info=CLUB_INFO[clubId];
  E={
    v:3, club:clubId, clubNombre:info.n, dt:info.dt, anio:anio, modo:modo||"historico",
    ind:Object.assign({},IND_BASE[clubId]),
    plata:CAJA_BASE[clubId].plata, deuda:CAJA_BASE[clubId].deuda,
    capital:45,
    rep:{publica:52,credibilidad:50,prensa:50,dureza:40},
    grupos:{}, estatutos:Object.assign({},ESTATUTO_INICIAL[clubId]),
    mods:[], flags:{}, plantel:[], calendario:[], idx:0,
    tabla:{}, decPend:[], decHechas:{}, bandeja:[], cronica:[], titulos:[],
    tactica:{form:"4-4-2",estilo:"Equilibrado",presion:"Media"},
    precioEntrada:1, presupuesto:null, temporada:{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0},
    carrera:{club:clubId,desde:anio,despidos:0,clubes:[],evaluacion:null,fin:false},
    divergencias:[], coincidencias:[], staff:{deportivo:62,tesorero:60,prensa:58}
  };
  GRUPOS.forEach(g=>{
    const poder=(PODER_CLUB[clubId]||{})[g.id]||45;
    const ap=((APROB_INICIAL[clubId]||{})[g.id])||0;
    E.grupos[g.id]={poder:poder,aprob:ap};
  });
  E.plantel=armarPlantel(clubId,anio,IND_BASE[clubId].plantel);
  E.calendario=construirCalendario(clubId,anio,true);
  reiniciarTabla();
  repartirDecisiones();
  guardar();
}
function reiniciarTabla(){
  E.tabla={};
  LIGA91.forEach(c=>E.tabla[c.id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0});
}
/* ---------------- helpers de estado ---------------- */
function modSuma(k){ let s=0; E.mods.forEach(m=>{ if(m.ef&&m.ef[k]) s+=m.ef[k]; }); return s; }
function agregarMod(m){
  const ex=E.mods.find(x=>x.id===m.id);
  if(ex){ ex.hasta=Math.max(ex.hasta,E.anio+(m.anios||1)); return; }
  E.mods.push({id:m.id,n:m.n,hasta:E.anio+(m.anios||1),ef:m.ef||{}});
}
function limpiarMods(){ E.mods=E.mods.filter(m=>m.hasta>=E.anio); }
function aplicarEfectos(ef){
  if(!ef) return;
  for(const k in ef){
    const v=ef[k];
    if(k==="plata") E.plata+=v;
    else if(k==="deuda") E.deuda=Math.max(0,E.deuda+v);
    else if(k==="capital") E.capital=clamp(E.capital+v,0,100);
    else if(E.ind[k]!==undefined) E.ind[k]=clamp(E.ind[k]+v,0,100);
  }
  if(E.plata<0){ E.deuda+=Math.abs(E.plata)*1.2; E.plata=0; E.ind.riesgo=clamp(E.ind.riesgo+3,0,100); }
}
function aplicarGrupos(g){ if(!g) return; for(const k in g){ if(E.grupos[k]) E.grupos[k].aprob=clamp(E.grupos[k].aprob+g[k],-100,100); } }
function aplicarRep(r){ if(!r) return; for(const k in r){ if(E.rep[k]!==undefined) E.rep[k]=clamp(E.rep[k]+r[k],0,100); } }
function apoyoPonderado(posturas){
  if(!posturas) return 0;
  let num=0,den=0;
  for(const k in posturas){
    const g=E.grupos[k]; if(!g) continue;
    num+=posturas[k]*(g.poder/100)*(1+g.aprob/200); den+=g.poder/100;
  }
  return den?num/den:0;
}
function aprobacionMedia(){
  let s=0,p=0;
  GRUPOS.forEach(g=>{ const x=E.grupos[g.id]; s+=x.aprob*x.poder; p+=x.poder; });
  return p?s/p:0;
}
/* ---------------- decisiones ---------------- */
function decisionesDisponibles(){
  const propias=DECISIONES.filter(d=>d.club===E.club&&d.anio===E.anio);
  const bolsa=BOLSA.filter(d=>!d.cuando||d.cuando(E));
  return propias.concat(bolsa);
}
function repartirDecisiones(){
  const ya=new Set(E.decPend.map(x=>x.id));
  decisionesDisponibles().forEach(d=>{
    const clave=d.id+"_"+E.anio;
    if(E.decHechas[clave]||ya.has(clave)) return;
    const mesActual=E.calendario[E.idx]?E.calendario[E.idx].f.m:2;
    if(d.mes && d.mes>mesActual) return;
    E.decPend.push({id:d.id,clave:clave,peso:d.peso||"medio"});
  });
}
function requisitoCumplido(op){
  const r=op.req; if(!r) return {ok:true,txt:""};
  const faltan=[];
  if(r.plata&&E.plata<r.plata) faltan.push("faltan "+plata(r.plata-E.plata));
  if(r.capital&&E.capital<r.capital) faltan.push("falta capital institucional");
  if(r.grupo){ const g=E.grupos[r.grupo[0]]; if(!g||g.aprob<r.grupo[1]) faltan.push("necesitas apoyo de "+GRUPO_POR_ID[r.grupo[0]].n); }
  if(r.estatuto&&E.estatutos[r.estatuto[0]]!==r.estatuto[1]) faltan.push("requiere otro estatuto");
  return {ok:faltan.length===0,txt:faltan.join(" · ")};
}
function textoRequisitos(op){
  const r=op.req; if(!r) return "";
  const p=[];
  if(r.plata) p.push(plata(r.plata));
  if(r.capital) p.push(r.capital+" de capital institucional");
  if(r.grupo) p.push("apoyo de "+GRUPO_POR_ID[r.grupo[0]].n);
  return p.length?("Requiere: "+p.join(" · ")):"";
}
/* Resolución oculta: pesa el estado, no el dado */
function resolverDecision(dec,idx){
  const op=dec.op[idx];
  const chk=requisitoCumplido(op); if(!chk.ok) return null;
  let score=58;
  score-=(op.dif||40)*0.55;
  const rel={institucional:E.capital,refuerzos:E.ind.prestigio,finanzas:100-clamp(E.deuda/40,0,70),
    camarin:E.ind.moral,preparacion:E.ind.plantel,hinchada:E.ind.hinchada,cantera:E.ind.cantera,
    prensa:E.rep.prensa,gris:E.rep.dureza};
  const base=rel[dec.buzon]!=null?rel[dec.buzon]:55;
  score+=(base-50)*0.30;
  score+=(E.capital-45)*0.12;
  score+=apoyoPonderado(dec.posturas)*0.10;
  score+=(E.rep.credibilidad-50)*0.10;
  score-=Math.max(0,E.ind.riesgo-45)*0.20;
  score+=rnd(-11,11);
  const tier=score>=58?"bien":(score>=40?"mitad":"mal");
  const res=op[tier]||op.mitad||op.bien;

  if(op.ef) aplicarEfectos(op.ef);
  if(op.grupos) aplicarGrupos(op.grupos);
  if(op.rep) aplicarRep(op.rep);
  if(res.ef) aplicarEfectos(res.ef);
  if(res.grupos) aplicarGrupos(res.grupos);
  if(res.rep) aplicarRep(res.rep);
  (res.mods||[]).forEach(agregarMod);
  const accion=res.accion||op.accion;
  let extra=accion?ejecutarAccion(accion):"";

  if(dec.op.some(o=>o.hist)){
    if(op.hist) E.coincidencias.push({anio:E.anio,t:dec.t});
    else E.divergencias.push({anio:E.anio,t:dec.t,elegido:op.t});
  }
  E.decHechas[dec.id+"_"+E.anio]={op:idx,tier:tier,txt:res.txt,t:op.t,hist:!!op.hist,extra:extra};
  E.decPend=E.decPend.filter(x=>x.id!==dec.id);
  guardar();
  return {tier:tier,txt:res.txt,extra:extra,hist:!!op.hist};
}
/* ---------------- acciones especiales ---------------- */
function ejecutarAccion(a){
  const [nombre,arg]=a.split(":");
  switch(nombre){
    case "lesionAlAzar":{
      const sanos=E.plantel.filter(j=>!j.lesion&&!j.vendido);
      if(!sanos.length) return "";
      const j=elige(sanos); j.lesion=ri(2,6);
      return j.n+" queda fuera unas semanas por lesión.";
    }
    case "venderTitular":{
      const l=E.plantel.filter(j=>!j.vendido).sort((a,b)=>b.valor-a.valor);
      if(!l.length) return "";
      const j=l[ri(0,Math.min(2,l.length-1))];
      return venderJugador(j);
    }
    case "venderToken":{
      const j=jugadorPorToken(arg,E); if(!j) return "";
      return venderJugador(j);
    }
    case "marcarVentaFutura":{
      const j=jugadorPorToken(arg,E); if(!j) return "";
      j.ventaFin=true; return j.n+" seguirá hasta fin de temporada y después se va.";
    }
    case "mejorarToken":{
      const j=jugadorPorToken(arg,E); if(!j) return "";
      j.sueldo=Math.round(j.sueldo*1.4); j.moral=clamp(j.moral+15,0,100);
      return j.n+" renovó con mejor contrato.";
    }
    case "ficharTres":{
      return "Refuerzos incorporados al plantel.";
    }
    case "ficharLibre":{
      const rr=azarFijo(semilla("libre"+E.anio+E.idx));
      const j=generarJugador(rr,E.ind.plantel+4,elige(["DEF","VOL","DEL"]),ri(26,32));
      j.contrato.hasta=E.anio+2; E.plantel.push(j);
      return "Se incorpora "+j.n+" ("+j.pos+", nivel "+j.nivel+").";
    }
    case "subirJuvenil":{
      const rr=azarFijo(semilla("juv"+E.anio+E.idx));
      const j=generarJugador(rr,E.ind.cantera*0.8+10,elige(["DEF","VOL","DEL"]),ri(17,20));
      j.proy=clamp(j.proy+12,40,96); j.contrato.hasta=E.anio+4; j.rasgos=["de la cantera"];
      E.plantel.push(j);
      return "Sube al primer equipo "+j.n+" ("+j.edad+" años, proyección "+j.proy+").";
    }
    case "perderPuntos":{ E.temporada.pts=Math.max(0,E.temporada.pts-2); return "Se pierde una fecha por no presentarse."; }
    case "cisma":{
      E.flags.cisma=true;
      aplicarEfectos({socios:-25,hinchada:-20,prestigio:-10});
      return "Un grupo de socios funda un club nuevo con el nombre y los colores originales. Desde ahora son tus enemigos.";
    }
  }
  return "";
}
function venderJugador(j){
  const monto=Math.round(j.valor*rnd(.75,1.2));
  j.vendido=true; E.plata+=monto;
  E.ind.plantel=clamp(E.ind.plantel-Math.round(j.nivel/14),0,100);
  return "Se vende a "+j.n+" por "+plata(monto)+".";
}
/* ---------------- economía ---------------- */
function planillaAnual(){ return E.plantel.filter(j=>!j.vendido).reduce((s,j)=>s+j.sueldo,0); }
function ingresoPartidoLocal(part){
  const precioTab=[900,1500,2500][E.precioEntrada];
  const club=CLUB_POR_ID[E.club]||{aforo:30000};
  let ocup=0.22+E.ind.hinchada/220+E.ind.estadio/500;
  if(part.tipo==="copa") ocup+=0.22;
  if(part.ronda==="FINAL"||part.ronda==="Semifinal") ocup+=0.18;
  ocup+=(E.temporada.pts>E.temporada.pj*1.6?0.08:0);
  ocup-=[0.05,0,0.12][E.precioEntrada];
  ocup+=modSuma("local")/100;
  ocup*=(1+(modSuma("taquilla")||0));
  ocup=clamp(ocup,0.06,0.98);
  const gente=Math.round(club.aforo*ocup*(E.ind.estadio/100*0.5+0.5));
  const ingreso=gente*precioTab/1000000;
  return {gente:gente,ingreso:Math.round(ingreso)};
}
function ingresosAnuales(){
  const tv=(120+E.ind.prestigio*3)*(1+(modSuma("tv")||0));
  const spo=(90+E.ind.prestigio*3.5)*(1+(modSuma("sponsor")||0));
  const soc=(E.ind.socios*10)*(1+(modSuma("ingresoSocios")||0));
  return {tv:Math.round(tv),sponsors:Math.round(spo),socios:Math.round(soc)};
}
function egresosAnuales(){
  const planilla=planillaAnual();
  const oper=Math.round(100+E.ind.prestigio*2+E.ind.estadio*5+E.ind.hinchada*2);
  const inter=Math.round(E.deuda*(0.16+modSuma("interes")));
  return {planilla:planilla,operacion:oper,intereses:inter};
}
function costoSemanal(){
  const e=egresosAnuales();
  return Math.round((e.planilla+e.operacion+e.intereses)/40);
}
function ingresoSemanal(){
  const i=ingresosAnuales();
  return Math.round((i.tv+i.sponsors+i.socios)/40);
}
function aplicarEstatutosMod(){
  ESTATUTOS.forEach(cat=>{
    const opId=E.estatutos[cat.id]; if(!opId) return;
    const op=cat.op.find(o=>o.id===opId); if(!op||!op.mod) return;
    for(const k in op.mod){
      const id="est_"+cat.id;
      let m=E.mods.find(x=>x.id===id);
      if(!m){ m={id:id,n:"Estatuto: "+op.n,hasta:9999,ef:{}}; E.mods.push(m); }
      m.n="Estatuto: "+op.n; m.ef=Object.assign({},op.mod);
    }
  });
}
/* ---------------- paso del tiempo ---------------- */
function decisionesBloqueantes(){
  return E.decPend.filter(x=>x.peso==="alto");
}
function proximoPartido(){ return E.calendario[E.idx]||null; }
function tickSemana(){
  /* plata que entra y sale entre partido y partido */
  const neto=ingresoSemanal()-costoSemanal();
  aplicarEfectos({plata:neto});
  E.plantel.forEach(j=>{ if(j.lesion>0) j.lesion--; });
  /* deriva natural */
  if(E.ind.riesgo>0&&Math.random()<0.3) E.ind.riesgo=clamp(E.ind.riesgo-1,0,100);
  return neto;
}
function tirarEvento(){
  const posibles=EVENTOS.filter(ev=>ev.peso(E)>0);
  if(!posibles.length||Math.random()>0.42) return null;
  const ev=eligePeso(posibles,x=>x.peso(E));
  if(!ev) return null;
  if(ev.op) return {tipo:"decision",ev:ev};
  if(ev.ef) aplicarEfectos(ev.ef);
  if(ev.grupos) aplicarGrupos(ev.grupos);
  if(ev.rep) aplicarRep(ev.rep);
  let extra=ev.accion?ejecutarAccion(ev.accion):"";
  const txt=resolverTokens(ev.d,E).replace("{JUGADOR}",(elige(E.plantel.filter(j=>!j.vendido))||{n:"un jugador"}).n);
  const item={t:ev.t,d:txt,extra:extra,tipo:ev.tipo,anio:E.anio};
  E.bandeja.unshift(item);
  return {tipo:"aviso",item:item};
}
function crisisActiva(){
  for(const c of CRISIS){ if(!E.flags["crisis_"+c.id]&&c.dispara(E)) return c; }
  return null;
}
/* ---------------- fin de temporada ---------------- */
function finDeTemporada(){
  const t=E.temporada;
  const pos=posicionEnTabla();
  const campeon=pos===1;
  /* premios */
  let premio=[0,420,260,180,120][Math.min(4,pos)]||70;
  aplicarEfectos({plata:premio});
  if(campeon){ E.titulos.push(E.anio+" · Campeón del Campeonato Nacional"); aplicarEfectos({prestigio:7,hinchada:7,moral:6}); aplicarRep({publica:8,credibilidad:6}); }
  /* copa */
  const copa=E.calendario.filter(p=>p.tipo==="copa");
  const copaGanada=E.flags.copaCampeon;
  if(copaGanada){ E.titulos.push(E.anio+" · Copa Libertadores"); aplicarEfectos({prestigio:14,plata:600,hinchada:10}); aplicarRep({publica:14,credibilidad:10}); }
  /* evaluación del mandato */
  const ev=evaluarMandato(pos,campeon,copaGanada);
  /* balance y crónica */
  E.cronica.unshift({anio:E.anio,pos:pos,pts:t.pts,campeon:campeon,copa:copaGanada?"Campeón":null,
    plata:Math.round(E.plata),deuda:Math.round(E.deuda),ev:ev});
  return {pos:pos,campeon:campeon,copa:copaGanada,premio:premio,ev:ev};
}
function posicionEnTabla(){
  const arr=LIGA91.map(c=>({id:c.id,...E.tabla[c.id]}));
  arr.sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf);
  return arr.findIndex(x=>x.id===E.club)+1;
}
function nuevoAnio(){
  E.anio++;
  limpiarMods();
  /* envejecer plantel y aplicar salidas */
  E.plantel=E.plantel.filter(j=>!j.vendido&&!j.ventaFin);
  E.plantel.forEach(j=>{
    j.edad++;
    if(j.edad<=25) j.nivel=clamp(j.nivel+ri(0,4),20,97);
    else if(j.edad>=30) j.nivel=clamp(j.nivel-ri(1,4),20,97);
    j.goles=0;j.partidos=0;j.tarjetas=0;j.lesion=0;j.forma=68;
  });
  while(E.plantel.length<20){
    const rr=azarFijo(semilla("relleno"+E.anio+E.plantel.length));
    E.plantel.push(generarJugador(rr,E.ind.plantel-6,elige(["DEF","VOL","DEL","ARQ"])));
  }
  E.ind.plantel=clamp(Math.round(mediaPlantel()),0,100);
  E.ind.moral=clamp(Math.round(E.ind.moral+(55-E.ind.moral)*0.25),0,100);
  E.capital=clamp(Math.round(E.capital+capitalAnual()),0,100);
  /* el fútbol olvida: nadie te quiere ni te odia para siempre */
  for(const k in E.rep) E.rep[k]=Math.round(E.rep[k]+(50-E.rep[k])*0.12);
  GRUPOS.forEach(g=>{ const x=E.grupos[g.id]; x.aprob=Math.round(x.aprob*0.72); });
  E.temporada={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
  E.idx=0; E.decPend=[]; E.bandeja=[]; E.flags.copaCampeon=false;
  E.calendario=construirCalendario(E.club,E.anio,E.anio===1992);
  reiniciarTabla();
  repartirDecisiones();
  guardar();
}
function mediaPlantel(){
  const l=E.plantel.filter(j=>!j.vendido).sort((a,b)=>b.nivel-a.nivel).slice(0,14);
  return l.reduce((s,j)=>s+j.nivel,0)/Math.max(1,l.length);
}
function capitalAnual(){
  let c=6;
  c+=aprobacionMedia()/12;
  c+=(E.ind.prestigio-55)/12;
  c+=(E.rep.credibilidad-50)/14;
  c+=modSuma("capitalAnual");
  return Math.round(clamp(c,-14,22));
}
/* ---------------- guardado ---------------- */
async function guardar(){
  if(!E) return;
  await Store.set(LLAVE,E);
  const n=(typeof document!=="undefined")?document.getElementById("guardadoTxt"):null;
  if(n) n.textContent="guardado "+new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"});
}
async function cargar(){ return await Store.get(LLAVE); }
