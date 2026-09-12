"use strict";
/* ============================================================
   FUTBOLINI 7.996 · el partido se siente + 2006 al listón
   8.00 sigue RESERVADA.

   1) Planteles 2006 documentados (finalistas + Católica):
      UCH  solofutbol Apertura 2006 + EMOL 13 jun 2006 (XI vs UC)
      AUD  Wikipedia final Clausura 2006 + ESPN squad 2006 + TM vs UCH 3/9/2006
      UC   EMOL 13 jun 2006 (XI) + Wikipedia Temporada 2006 UC (goleadores)
      DT: Gustavo Huerta (UCH), Raúl Toro (AUD), Jorge Pellicer (UC).
   2) El XI rival de un año histórico YA NO hereda 2026 ni 1991.
   Stats ESTIMADAS. No se inventa nadie. Cargar ÚLTIMO.
   ============================================================ */

function _pj996(n,pos,edad,niv,ras){
  if(typeof _pj==="function") return _pj(n,pos,edad,niv,ras);
  var p=Math.min(niv+6,90);
  return [n,pos,edad,niv,p, Math.max(8,Math.round(niv*niv/120)), Math.max(12,Math.round(niv*niv/18)), ras||[]];
}
var S996=_pj996;

/* Universidad de Chile · Apertura 2006 (finalista vs Colo-Colo).
   Fuente: solofutbol.cl plantel Apertura + EMOL 13/06/2006 XI. */
const PLANTEL_UCH_2006=[
  S996("Miguel Pinto","ARQ",23,82,["seguro bajo los tres palos","ídolo"]),
  S996("Hernán Caputto","ARQ",32,72,["recambio","veterano"]),
  S996("Waldo Ponce","DEF",24,80,["marca","juego aéreo"]),
  S996("José Rojas","DEF",23,78,["marca","canterano"]),
  S996("Julio César Moreyra","DEF",25,76,["marca","extranjero"]),
  S996("Adrián Rojas","DEF",29,74,["lateral","veterano"]),
  S996("Rodrigo Jara","DEF",21,70,["lateral","joven"]),
  S996("Nicolás Larrondo","DEF",19,66,["joven","canterano"]),
  S996("Manuel Iturra","VOL",22,80,["contención","pulmón","ídolo"]),
  S996("Máyer Candelo","VOL",29,82,["enganche","extranjero","cerebro"]),
  S996("Patricio Ormazábal","VOL",27,76,["orden"]),
  S996("Luis Pedro Figueroa","VOL",23,78,["desequilibrio","llegador"]),
  S996("Hugo Droguett","VOL",24,76,["desequilibrio","llegador"]),
  S996("Esteban Valencia","VOL",34,74,["veterano","ídolo"]),
  S996("Marcelo Díaz","VOL",20,68,["joven","canterano","contención"]),
  S996("Christian Martínez","VOL",23,70,["recambio"]),
  S996("Marcelo Salas","DEL",32,88,["ídolo","goleador","definición","capitán"]),
  S996("Herly Alcázar","DEL",30,80,["goleador","extranjero"]),
  S996("Cristian Canío","DEL",25,74,["desequilibrio"])
];

/* Audax Italiano · finalista Clausura 2006 (perdió 6-2 global vs Colo-Colo).
   XI de la final Wikipedia + ESPN squad 2006. NO campeón. */
const PLANTEL_AUD_2006=[
  S996("Nicolás Peric","ARQ",28,82,["seguro bajo los tres palos","ídolo"]),
  S996("Luis Marín","ARQ",23,70,["recambio"]),
  S996("Carlos Garrido","DEF",29,80,["marca","ídolo","liderazgo"]),
  S996("Juan González","DEF",31,76,["marca","veterano"]),
  S996("Jorge Carrasco","DEF",25,74,["marca"]),
  S996("Roberto Cereceda","DEF",22,76,["lateral","joven"]),
  S996("Boris Rieloff","DEF",22,80,["lateral ofensivo","ídolo"]),
  S996("César Santis","DEF",28,70,["polivalente","recambio"]),
  S996("Enzo Cabrera","VOL",22,72,["pulmón"]),
  S996("Miguel Ángel Romero","VOL",32,78,["veterano","orden","extranjero"]),
  S996("Carlos Villanueva","VOL",20,86,["ídolo","enganche","tiro libre","proyección europea"]),
  S996("Gustavo Paruolo","VOL",26,72,["llegador","extranjero"]),
  S996("Franco Di Santo","DEL",17,76,["joven","goleador","proyección europea","extranjero"]),
  S996("Jaime González","DEL",27,74,["goleador"]),
  S996("Arístides Masi","DEL",28,70,["recambio"]),
  S996("Fabián Orellana","DEL",20,72,["desequilibrio","joven","proyección europea"]),
  S996("Matías Campos","DEL",17,64,["joven","canterano"])
];

/* Universidad Católica · 2006 (Pellicer). XI EMOL 13/06/2006 + goleadores wiki temporada.
   Conca jugó el Apertura (documentado). Mirosevic NO: estaba en Racing/Beitar. */
const PLANTEL_UC_2006=[
  S996("José María Buljubasich","ARQ",35,84,["seguro bajo los tres palos","ídolo","veterano"]),
  S996("Rainer Wirth","ARQ",24,72,["recambio"]),
  S996("Paulo Garcés","ARQ",22,68,["joven","canterano"]),
  S996("Jaime Rubilar","DEF",28,76,["marca"]),
  S996("Facundo Imboden","DEF",26,76,["marca","extranjero"]),
  S996("Eros Pérez","DEF",30,76,["lateral","veterano"]),
  S996("Claudio Muñoz","DEF",22,72,["marca","joven"]),
  S996("Mauricio Zenteno","DEF",22,72,["marca"]),
  S996("Marcos González","DEF",26,76,["marca","juego aéreo"]),
  S996("Gary Medel","DEF",18,70,["joven","canterano","carácter","proyección europea"]),
  S996("Miguel Ponce","DEF",35,70,["veterano","recambio"]),
  S996("Jorge Ormeño","VOL",29,78,["contención","ídolo"]),
  S996("Alejandro Osorio","VOL",30,76,["orden"]),
  S996("Francisco Arrué","VOL",29,80,["llegador","tiro libre"]),
  S996("Darío Conca","VOL",23,82,["enganche","desequilibrio","extranjero","proyección europea"]),
  S996("Diego Rosende","VOL",20,68,["joven","lateral"]),
  S996("Iván Vásquez","VOL",21,70,["contención","joven"]),
  S996("Jorge Quinteros","DEL",32,84,["goleador","ídolo","definición"]),
  S996("Luis Núñez","DEL",24,76,["goleador"]),
  S996("Eduardo Rubio","DEL",23,76,["desequilibrio","goleador"]),
  S996("José Pedro Fuenzalida","DEL",21,74,["joven","canterano","desequilibrio"]),
  S996("Juan Manuel Aróstegui","DEL",27,72,["recambio","extranjero"])
];

(function reg996(){
  if(typeof PLANTELES_REALES!=="object") return;
  PLANTELES_REALES.UCH=PLANTELES_REALES.UCH||{};
  PLANTELES_REALES.UCH[2006]=PLANTEL_UCH_2006;
  PLANTELES_REALES.AUD=PLANTELES_REALES.AUD||{};
  PLANTELES_REALES.AUD[2006]=PLANTEL_AUD_2006;
  PLANTELES_REALES.UC=PLANTELES_REALES.UC||{};
  PLANTELES_REALES.UC[2006]=PLANTEL_UC_2006;
})();

(function info2006_996(){
  if(typeof CLUB_INFO_2006!=="object") return;
  if(CLUB_INFO_2006.UCH){
    CLUB_INFO_2006.UCH.dt="Gustavo Huerta";
    CLUB_INFO_2006.UCH.desc="La U de Huerta, finalista del Apertura 2006 vs Colo-Colo. Salas, Alcázar, Iturra, Candelo, Pinto. Stats aproximadas.";
  }
  if(CLUB_INFO_2006.AUD){
    CLUB_INFO_2006.AUD.dt="Raúl Toro";
    CLUB_INFO_2006.AUD.desc="Audax de Raúl Toro, finalista del Clausura 2006 (perdió 6-2 global vs Colo-Colo). Villanueva, Di Santo, Rieloff, Peric. NO campeón.";
  }
  if(CLUB_INFO_2006.UC){
    CLUB_INFO_2006.UC.dt="Jorge Pellicer";
    CLUB_INFO_2006.UC.desc="Católica de Pellicer 2006. Quinteros goleador, Conca, Arrué, Buljubasich, Medel de 18. Stats aproximadas.";
  }
})();

/* XI rival: un año histórico no hereda el plantel 2026 ni el de 1991. */
(function wrapRival996(){
  if(typeof plantelRival!=="function" || plantelRival._p996) return;
  var orig=plantelRival;
  plantelRival=function(idOrNombre,fuerza){
    var anio=(typeof E!=="undefined"&&E&&E.anio)||2026;
    var id=(typeof idClubDe==="function")?idClubDe(idOrNombre):idOrNombre;
    var pack=id&&typeof PLANTELES_REALES==="object"&&PLANTELES_REALES[id];
    var same=pack&&pack[anio];
    if(same&&same.length>=11) return orig(idOrNombre,fuerza);
    if(anio>=2024) return orig(idOrNombre,fuerza);
    var tag, pos, rol;
    if(id&&typeof CLUB_POR_ID==="object"&&CLUB_POR_ID[id]) tag=CLUB_POR_ID[id].c||CLUB_POR_ID[id].n;
    else tag=String(idOrNombre||"rival");
    pos=["ARQ","DEF","DEF","DEF","DEF","VOL","VOL","VOL","DEL","DEL","DEL"];
    rol=["el 1","el 2","el 3","el 4","el 5","el 6","el 8","el 10","el 7","el 9","el 11"];
    return pos.map(function(p,i){
      return {
        n:rol[i]+" de "+tag, pos:p, edad:25, nivel:typeof clamp==="function"?clamp((fuerza||60)-4,40,86):(fuerza||60),
        proy:70, sueldo:40, valor:80, rasgos:[], forma:70, moral:70, real:false,
        contrato:{hasta:0}, lesion:0, goles:0, partidos:0, tarjetas:0, cansancio:0
      };
    });
  };
  plantelRival._p996=true;
})();

(function relato996(){
  if(typeof RELATO_BETA==="undefined" || !Array.isArray(RELATO_BETA)) return;
  [
    {m:"clasico",x:"Clásico. Acá un error se hereda tres generaciones."},
    {m:"clasico",x:"La platea no pide fútbol. Pide carácter."},
    {m:"clasico",x:"Cada falta parece final. El árbitro ya no existe: existe la tribuna."},
    {m:"inicio",x:"Saque al medio. El 5 pide calma. La bandeja pide sangre."},
    {m:"inicio",x:"Primer pelotazo largo de prueba. Nadie gana la dividida todavía."},
    {m:"penal",x:"Los doce pasos. El arquero baila en la línea. El estadio se calla."},
    {m:"penal",x:"El pateador pone el balón, retrocede, y el tiempo se estira."},
    {m:"dominio",x:"La tienen, la giran, y el 9 todavía no huele el área."},
    {m:"aguanta",x:"Todos atrás, hasta el que no salta. El reloj es titular."}
  ].forEach(function(r){
    if(!RELATO_BETA.some(function(x){ return x.x===r.x; })) RELATO_BETA.push(r);
  });
})();

/* 7.997 · enganches que data-2006 no puede hacer al parsear (partido.js carga después). */
(function wrap997(){
  if(typeof _hookFase2006==="function") _hookFase2006();
  if(typeof filasTablaActual==="function" && !filasTablaActual._e06){
    var origT=filasTablaActual;
    filasTablaActual=function(){
      if(typeof E!=="undefined"&&E&&E.eraBase===2006){
        var ids=(typeof LIGA_2006!=="undefined")?LIGA_2006.map(function(c){ return c.id; }):[];
        var fase=E.flags&&E.flags.fase2006;
        var nota=fase==="clausura"
          ?"Clausura 2006 (18 fechas, tabla desde 0, localías invertidas). El Apertura regular ya cerró sin estrella — los playoffs estilo México no se juegan todavía. Descenso: tabla anual."
          :"Apertura 2006 (18 fechas, 19 clubes, un bye). Al cerrar la rueda arranca el Clausura desde cero. Playoffs estilo México: documentados, no jugables.";
        return {ids:ids, nota:nota, titulo:fase==="clausura"?"Tabla · Clausura 2006":"Tabla · Apertura 2006", filas:null};
      }
      return origT.apply(this, arguments);
    };
    filasTablaActual._e06=true;
  }
})();
