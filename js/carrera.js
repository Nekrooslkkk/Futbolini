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
function evaluarMandato(pos,campeon,copa){
  const ex=expectativa();
  let nivel;
  if(campeon||copa) nivel="excelente";
  else if(pos<=ex.pos) nivel="cumplido";
  else if(pos<=ex.pos+3) nivel="insuficiente";
  else nivel="fracaso";
  const texto={
    excelente:"El directorio no tiene nada que reclamar. Este año quedó en la historia del club.",
    cumplido:"Se cumplió lo que se pedía: "+ex.txt+". Nadie sale a aplaudir, pero nadie pide tu cabeza.",
    insuficiente:"No se cumplió el objetivo de "+ex.txt+". Hay paciencia, pero se está acabando.",
    fracaso:"Fracaso deportivo. El objetivo era "+ex.txt+" y quedó muy lejos."
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
