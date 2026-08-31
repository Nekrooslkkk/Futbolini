"use strict";
/* ============================================================
   FUTBOLINI · logros.js   (Section: Logros / achievements)
   Logros bizarros pero reales y logrables. Se desbloquean desde
   hooks en el partido/temporada. E.logros = {id: {anio}}.
   ============================================================ */
const LOGROS=[
 {id:"arquero_penal", n:"Bomba de hidrógeno vs bomba de hidrógeno", d:"Hacé patear un penal a tu arquero y que lo meta. Si lo marca, te llevas el oro."},
 {id:"clasico_casa",  n:"El pueblo unido",          d:"Gana un clásico con 3 o más jugadores de la casa en el once."},
 {id:"remontada",     n:"Nunca bajar los brazos",   d:"Gana un partido después de ir perdiendo por dos goles."},
 {id:"gol_defensa",   n:"El defensor que soñó con ser 9", d:"Que un defensor te haga un gol de cabeza."},
 {id:"roja_gana",     n:"Con uno menos y con el alma", d:"Gana un partido después de quedar con diez por una roja."},
 {id:"pacto_cumplido",n:"Palabra de dirigente",     d:"Tené 3 pactos en pie con la barra al mismo tiempo."},
 {id:"traidor",       n:"A la barra no se le miente",d:"Rompé un pacto que le juraste a la barra. No es un orgullo, pero cuenta."},
 {id:"campeon_chico", n:"David le ganó a Goliat",   d:"Salí campeón con un club de poco prestigio."},
 {id:"influencer",    n:"El DT que rompió PLOP",     d:"Superá el millón de seguidores en PLOP."},
 {id:"reconquista",   n:"El que sabe, sabe",         d:"Reconquistá a 3 jugadores descontentos con plata."},
 {id:"goleada_clasico",n:"Baile en el patio grande", d:"Ganale un clásico por 4 goles o más de diferencia."},
 {id:"caja_sana",     n:"Manos limpias",             d:"Termina una temporada con la caja en azul y sin desfalco."},
 {id:"quimico",       n:"El químico",                 d:"Recurrí a un «preparado especial»… y que te estalle el escándalo encima. No estás orgulloso."},
 {id:"arquitecto",    n:"El que construyó la casa",   d:"Saca adelante el estadio propio en la historia de la U."},
 {id:"de_la_comunidad",n:"Esto es más que fútbol",    d:"Cierra una historia poniendo la identidad de tu club por delante de la caja."},
 {id:"novelero",      n:"Culebrón de primera",        d:"Completa 3 historias de equipo (arcos propios de tu club)."}
];
const LOGRO_POR_ID={}; LOGROS.forEach(l=>LOGRO_POR_ID[l.id]=l);
function normalizarLogros(){ if(E && (!E.logros||typeof E.logros!=="object")) E.logros={}; }
function tieneLogro(id){ return !!(E&&E.logros&&E.logros[id]); }
function desbloquear(id){
  if(!E) return false;
  normalizarLogros();
  if(E.logros[id]) return false;
  const l=LOGRO_POR_ID[id]; if(!l) return false;
  E.logros[id]={anio:E.anio};
  if(typeof notificar==="function") notificar({t:"🏆 Logro desbloqueado: "+l.n,tipo:"bueno",bandeja:true,d:l.d});
  if(typeof aviso==="function") aviso("🏆 Logro: "+l.n);
  if(typeof recordar==="function") recordar("logro","desbloqueaste el logro «"+l.n+"»",{peso:"medio",tono:"bueno"});
  if(typeof guardar==="function") guardar();
  return true;
}
