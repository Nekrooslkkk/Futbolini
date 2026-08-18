"use strict";
/* ============================================================
   FUTBOLINI · data-proc.js
   MOTOR DE DECISIONES PROCEDURALES: genera situaciones variadas
   tomando jugadores al azar del plantel + plantillas, para que el
   menú NO muestre siempre lo mismo. Cada instancia es única.
   Se guardan en E.decProc[id]; decisionPorId las encuentra.
   ============================================================ */

function jugAzar(filtro){
  const l=(E.plantel||[]).filter(j=>!j.vendido&&!j.cedido&&(!filtro||filtro(j)));
  return l.length?elige(l):null;
}
function otroClub(){ return (typeof CLUBES_COMPRADORES!=="undefined")?elige(CLUBES_COMPRADORES):"un club de afuera"; }

/* Cada plantilla: gen() devuelve {t,d,posturas,op} usando un jugador al azar, o null. */
const DEC_PROC=[
 /* renovación */
 {buzon:"camarin",peso:"medio",gen:function(){
   const j=jugAzar(x=>x.nivel>=66); if(!j) return null;
   return {t:j.n+" pide renovar contrato",
     d:j.n+" ("+j.pos+", "+j.edad+" años) siente que rinde más de lo que gana. Su representante deja caer que hay interés de afuera.",
     posturas:{camarin:32,directorio:-18},
     op:[
      {t:"Mejorarle el contrato",dif:26,req:{plata:80},ef:{plata:-80},grupos:{camarin:12,directorio:-8},
       bien:{txt:j.n+" firma feliz y contagia al grupo.",ef:{moral:8}},
       mitad:{txt:"Firma, pero los demás ya arman fila con el mismo pedido.",ef:{moral:3,deuda:40}},
       mal:{txt:"Firmó y bajó el rendimiento. Clásico.",ef:{moral:1}}},
      {t:"Premios por objetivos",dif:40,grupos:{camarin:4},
       bien:{txt:"Aceptó el desafío y se lo tomó a pecho.",ef:{moral:4,plantel:2}},
       mitad:{txt:"Firmó sin entusiasmo.",ef:{moral:-2}},
       mal:{txt:"Se sintió poco valorado y lo dijo en la radio.",ef:{moral:-8},grupos:{camarin:-12,prensa:-6}}},
      {t:"Congelar y bancar la pulseada",dif:52,grupos:{directorio:12,camarin:-14},rep:{dureza:6},
       bien:{txt:"Aguantó y siguió a la orden.",ef:{}},
       mitad:{txt:"Sigue, pero mirando la puerta.",ef:{moral:-5}},
       mal:{txt:"Forzó su salida y se fue caliente.",ef:{plantel:-5,moral:-8},grupos:{camarin:-14}}}
     ]};
 }},
 /* rumor de salida a Europa */
 {buzon:"refuerzos",peso:"medio",gen:function(){
   const j=jugAzar(x=>x.proy>=x.nivel+3||x.valor>=200); if(!j) return null;
   const club=otroClub();
   return {t:"Rumor: "+club+" sigue a "+j.n,
     d:"Una versión fuerte dice que "+club+" mandó ojeadores por "+j.n+". El jugador no desmiente y el entorno se ilusiona.",
     posturas:{hinchada:15,directorio:-10,prensa:10},
     op:[
      {t:"Blindarlo y subir su cláusula",dif:34,grupos:{hinchada:8,directorio:-6},
       bien:{txt:"Queda claro que no se vende barato. La gente lo festeja.",ef:{prestigio:2},mods:[{id:"pieza_clave",n:j.n+" es intransferible",anios:1,ef:{}}]},
       mitad:{txt:"Se blindó, pero el ruido sigue.",ef:{}},
       mal:{txt:"Se sintió atado y bajó las revoluciones.",ef:{moral:-4}}},
      {t:"Ponerle precio y escuchar ofertas",dif:30,grupos:{directorio:12,hinchada:-10},
       bien:{txt:"Abrís la puerta a un ingreso grande si llega la oferta.",ef:{},flags:{enVenta:true}},
       mitad:{txt:"El jugador se distrae pensando en irse.",ef:{plantel:-2}},
       mal:{txt:"Lo desestabilizaste y no llegó ninguna oferta seria.",ef:{moral:-5}}},
      {t:"Desmentir todo con firmeza",dif:24,grupos:{prensa:6},rep:{credibilidad:4},
       bien:{txt:"Cortaste el rumor de raíz.",ef:{moral:2}},
       mitad:{txt:"Bajó el ruido a medias.",ef:{}},
       mal:{txt:"Desmentiste y a la semana salió la oferta. Quedaste expuesto.",ef:{},rep:{credibilidad:-6}}}
     ]};
 }},
 /* conflicto entre dos jugadores */
 {buzon:"camarin",peso:"medio",gen:function(){
   const a=jugAzar(); const b=jugAzar(x=>a&&x!==a); if(!a||!b) return null;
   return {t:"Pelea entre "+a.n+" y "+b.n,
     d:a.n+" y "+b.n+" llegaron a los gritos en el entrenamiento. Alguien filtró la historia.",
     posturas:{camarin:0,tecnico:15,prensa:-10},
     op:[
      {t:"Reunión de los tres, de frente",dif:36,
       bien:{txt:"Se aclararon y hasta terminaron abrazados.",ef:{moral:10}},
       mitad:{txt:"Se dieron la mano sin ganas.",ef:{moral:2}},
       mal:{txt:"La reunión terminó peor.",ef:{moral:-6},grupos:{prensa:-8}}},
      {t:"Sentar al que empezó",dif:44,grupos:{camarin:-8,tecnico:10},rep:{dureza:8},
       bien:{txt:"El mensaje llegó: acá manda uno solo.",ef:{moral:4}},
       mitad:{txt:"Se calmó, con rencor guardado.",ef:{moral:-2}},
       mal:{txt:"Sentaste al equivocado y el grupo se dividió.",ef:{moral:-8},grupos:{camarin:-10}}},
      {t:"Dejar que lo arreglen ellos",dif:56,rep:{credibilidad:-4},
       bien:{txt:"Con el tiempo se les pasó.",ef:{moral:3}},
       mitad:{txt:"Siguió el clima raro.",ef:{moral:-3}},
       mal:{txt:"Escaló hasta la cancha.",ef:{moral:-10,plantel:-3}}}
     ]};
 }},
 /* indisciplina */
 {buzon:"camarin",peso:"bajo",gen:function(){
   const j=jugAzar(); if(!j) return null;
   return {t:j.n+" llegó tarde (otra vez)",
     d:j.n+" apareció tarde al entrenamiento y con cara de trasnoche. No es la primera vez.",
     posturas:{tecnico:20,camarin:-5},
     op:[
      {t:"Multa y a entrenar aparte",dif:28,grupos:{tecnico:10},rep:{dureza:6},
       bien:{txt:"Entendió el mensaje y se puso las pilas.",ef:{moral:3,plata:8}},
       mitad:{txt:"Pagó la multa y siguió igual.",ef:{plata:6}},
       mal:{txt:"Se ofendió y contaminó al grupo.",ef:{moral:-5},grupos:{camarin:-8}}},
      {t:"Hablar en privado",dif:34,
       bien:{txt:"Se sinceró: tenía un problema personal. Lo bancaste y respondió.",ef:{moral:5}},
       mitad:{txt:"Prometió cambiar. Veremos.",ef:{}},
       mal:{txt:"Le entró por un oído y salió por el otro.",ef:{moral:-3}}},
      {t:"Hacer la vista gorda",dif:40,grupos:{camarin:4,tecnico:-10},
       bien:{txt:"El grupo agradeció la flexibilidad.",ef:{moral:2}},
       mitad:{txt:"Nadie dijo nada, pero se notó.",ef:{}},
       mal:{txt:"Cundió el descontrol: todos empezaron a llegar tarde.",ef:{moral:-6,plantel:-2}}}
     ]};
 }},
 /* juvenil pide minutos */
 {buzon:"cantera",peso:"bajo",gen:function(){
   const j=jugAzar(x=>x.edad<=21&&(x.proy>=x.nivel+2)); if(!j) return null;
   return {t:j.n+" pide una oportunidad",
     d:"El juvenil "+j.n+" ("+j.edad+" años, proyección "+j.proy+") viene rompiéndola en las inferiores y pide minutos en el primer equipo.",
     posturas:{comunidad:15,tecnico:-5},
     op:[
      {t:"Darle rodaje de a poco",dif:30,grupos:{comunidad:10},
       bien:{txt:"Respondió con creces. Nació un jugador.",ef:{cantera:6,plantel:2,moral:3}},
       mitad:{txt:"Cumplió, con altibajos de pibe.",ef:{cantera:3}},
       mal:{txt:"Le quedó grande y se frustró.",ef:{moral:-2}}},
      {t:"Mandarlo a préstamo a foguearse",dif:26,
       bien:{txt:"Vuelve el año que viene hecho un jugador.",ef:{cantera:4}},
       mitad:{txt:"Sumó minutos afuera, nada más.",ef:{}},
       mal:{txt:"En el otro club ni jugó.",ef:{cantera:-2}}},
      {t:"Que espere su turno",dif:22,grupos:{comunidad:-8},
       bien:{txt:"Maduró con paciencia.",ef:{}},
       mitad:{txt:"Se impacientó.",ef:{cantera:-2}},
       mal:{txt:"Se cansó de esperar y pidió irse gratis.",ef:{cantera:-6},grupos:{comunidad:-8}}}
     ]};
 }},
 /* marca quiere al jugador de imagen */
 {buzon:"finanzas",peso:"bajo",gen:function(){
   const j=jugAzar(x=>x.nivel>=72||x.rasgos&&x.rasgos.includes("ídolo")); if(!j) return null;
   return {t:"Una marca quiere a "+j.n+" de imagen",
     d:"Una empresa quiere a "+j.n+" para una campaña publicitaria. Deja plata al club y expone al jugador.",
     posturas:{sponsors:15,directorio:10},
     op:[
      {t:"Cerrar el acuerdo",dif:24,ef:{plata:120},grupos:{sponsors:10},
       bien:{txt:"Entró buena plata y el jugador quedó feliz con el bono.",ef:{moral:3}},
       mitad:{txt:"Entró plata, pero le comió tiempo de entrenamiento.",ef:{plantel:-1}},
       mal:{txt:"Se farandulizó y descuidó lo futbolístico.",ef:{plantel:-3,moral:-2}}},
      {t:"Negociar una versión más chica",dif:32,
       bien:{txt:"Menos plata, cero distracción.",ef:{plata:60}},
       mitad:{txt:"Quedó en el medio.",ef:{plata:40}},
       mal:{txt:"La marca se ofendió y se cayó todo.",ef:{},grupos:{sponsors:-8}}},
      {t:"Rechazar para cuidar el foco",dif:20,grupos:{tecnico:8,sponsors:-8},
       bien:{txt:"El plantel valoró que se priorice la cancha.",ef:{moral:2}},
       mitad:{txt:"Gesto correcto, plata que no entró.",ef:{}},
       mal:{txt:"El directorio no perdonó dejar esa plata.",ef:{},grupos:{directorio:-10}}}
     ]};
 }},
 /* bajón de forma de un referente */
 {buzon:"preparacion",peso:"bajo",gen:function(){
   const j=jugAzar(x=>x.nivel>=70); if(!j) return null;
   return {t:j.n+" está en un bajón",
     d:j.n+" viene jugando por debajo de su nivel y la tribuna empezó a marcarlo.",
     posturas:{hinchada:-10,camarin:10},
     op:[
      {t:"Bancarlo en público",dif:30,grupos:{camarin:10,hinchada:-4},
       bien:{txt:"El respaldo lo devolvió a la vida.",ef:{moral:5,plantel:2}},
       mitad:{txt:"Agradeció el apoyo, sin reacción todavía.",ef:{moral:2}},
       mal:{txt:"La tribuna igual lo silbó y se hundió más.",ef:{moral:-3}}},
      {t:"Sentarlo unos partidos",dif:36,grupos:{camarin:-6},
       bien:{txt:"Descansó, se despejó y volvió enchufado.",ef:{plantel:2}},
       mitad:{txt:"El descanso no cambió mucho.",ef:{}},
       mal:{txt:"Lo interpretó como castigo y se cerró.",ef:{moral:-5}}},
      {t:"Ponerle un psicólogo deportivo",dif:28,ef:{plata:-30},
       bien:{txt:"Le hizo un clic. Volvió a sonreír.",ef:{moral:6,plantel:2}},
       mitad:{txt:"Ayudó de a poco.",ef:{moral:2}},
       mal:{txt:"No enganchó con el proceso.",ef:{}}}
     ]};
 }},
 /* la barra pide por un ídolo/canterano */
 {buzon:"hinchada",peso:"bajo",gen:function(){
   const j=jugAzar(x=>x.rasgos&&(x.rasgos.includes("ídolo")||x.rasgos.includes("de la cantera"))); if(!j) return null;
   return {t:"La hinchada canta por "+j.n,
     d:"En la tribuna sólo se escucha el nombre de "+j.n+". Piden que sea titular y bandera del proyecto.",
     posturas:{hinchada:35,tecnico:-10},
     op:[
      {t:"Hacerlo estandarte del equipo",dif:34,grupos:{hinchada:15,tecnico:-8},
       bien:{txt:"Se puso el equipo al hombro. La gente enloqueció.",ef:{hinchada:6,moral:5}},
       mitad:{txt:"Cumplió el rol con altibajos.",ef:{moral:2}},
       mal:{txt:"Le pesó la mochila del ídolo.",ef:{moral:-4}}},
      {t:"Usarlo con criterio, sin forzar",dif:26,
       bien:{txt:"Dosificado, rindió parejo todo el año.",ef:{plantel:2}},
       mitad:{txt:"Ni fu ni fa.",ef:{}},
       mal:{txt:"La hinchada leyó que no lo valorás.",ef:{},grupos:{hinchada:-10}}},
      {t:"Bajar la expectativa públicamente",dif:40,grupos:{hinchada:-12,prensa:6},rep:{dureza:4},
       bien:{txt:"Le sacaste presión y lo agradeció.",ef:{moral:3}},
       mitad:{txt:"Mensaje frío, recibido a medias.",ef:{}},
       mal:{txt:"La tribuna lo tomó como desprecio a su ídolo.",ef:{hinchada:-4},grupos:{hinchada:-12}}}
     ]};
 }}
];

/* Genera una decisión concreta y única; la guarda en E.decProc. */
function generarDecisionProc(){
  E.decProc=E.decProc||{};
  const orden=mezcla(DEC_PROC);
  for(let i=0;i<orden.length;i++){
    let cont=null; try{ cont=orden[i].gen(); }catch(e){ cont=null; }
    if(!cont) continue;
    const id="proc_"+(E._procId=(E._procId||0)+1);
    const dec=Object.assign({id:id,buzon:orden[i].buzon,peso:orden[i].peso||"medio"},cont);
    E.decProc[id]=dec;
    return dec;
  }
  return null;
}
/* Cada semana puede sembrar una decisión procedural (sin floodear). */
function sembrarDecisionProc(){
  if(!E.decPend) return null;
  E.decProc=E.decProc||{};
  const pendProc=E.decPend.filter(x=>String(x.id).indexOf("proc_")===0).length;
  if(pendProc>=2) return null;
  if(Math.random()>0.55) return null;
  const dec=generarDecisionProc(); if(!dec) return null;
  E.decPend.push({id:dec.id,clave:dec.id+"_"+E.anio,peso:dec.peso});
  return dec;
}

/* ============================================================
   5.0 · 3 PILARES DE DECISIÓN (color) + NEGOCIACIÓN CARA A CARA
   ============================================================ */
function pilarDeBuzon(b){
  const dep=["camarin","preparacion","cantera"];
  const per=["prensa","gris","hinchada"];
  if(dep.indexOf(b)>=0) return {id:"DEPORTIVO",c:"dep"};
  if(per.indexOf(b)>=0) return {id:"PERSONAL",c:"per"};
  return {id:"EJECUTIVO",c:"eje"};
}
/* siembra una decisión procedural de una categoría concreta (post-partido exige DEPORTIVO) */
function sembrarDecisionProcDeCategoria(cat){
  if(!E.decPend) return null;
  E.decProc=E.decProc||{};
  const orden=mezcla(DEC_PROC.filter(t=>pilarDeBuzon(t.buzon).id===cat));
  for(let i=0;i<orden.length;i++){
    let cont=null; try{ cont=orden[i].gen(); }catch(e){ cont=null; }
    if(!cont) continue;
    const id="proc_"+(E._procId=(E._procId||0)+1);
    const dec=Object.assign({id:id,buzon:orden[i].buzon,peso:orden[i].peso||"medio"},cont);
    E.decProc[id]=dec; E.decPend.push({id:id,clave:id+"_"+E.anio,peso:dec.peso});
    return dec;
  }
  return null;
}

/* ---- negociación directa con jugadores (Persuadir/Prometer/Forzar/Convencer) ---- */
const NEGOCIACIONES=[
 {tipo:"titularidad",pedido:"te encara: exige ser titular sí o sí",filtro:x=>x.nivel>=68},
 {tipo:"renovacion",pedido:"pide renovar con mejor sueldo, cara a cara",filtro:x=>x.nivel>=66},
 {tipo:"salida",pedido:"te dice a la cara que quiere irse a fin de año",filtro:x=>x.valor>=200||x.proy>x.nivel+3}
];
function generarNegociacion(){
  const t=elige(NEGOCIACIONES); const j=jugAzar(t.filtro);
  return j?{j:j,tpl:t}:null;
}
/* proporcionalidad lógica: efectos ponderados, sin castigos catastróficos */
function resolverNegociacion(neg,approach){
  const j=neg.j; const carisma=(E.rep.publica+E.rep.credibilidad)/2;
  let txt="", tono="neutro";
  if(approach==="persuadir"){
    if(Math.random()<clamp(0.45+carisma/250,0.3,0.85)){ aplicarEfectos({moral:3}); aplicarGrupos({camarin:6}); txt=j.n+" entró en razón. Clima recompuesto."; tono="bueno"; }
    else txt=j.n+" escuchó, pero no quedó del todo convencido.";
  } else if(approach==="prometer"){
    if(Math.random()<clamp(0.7+carisma/400,0.5,0.92)){ aplicarEfectos({moral:5,deuda:60}); aplicarGrupos({camarin:8,directorio:-6}); txt=j.n+" firma feliz, pero la planilla pesa más."; tono="bueno"; E.flags["prometido_"+j.n]=E.idx; }
    else { aplicarEfectos({moral:-2}); txt="No alcanzó ni con la promesa. Sigue incómodo."; }
  } else if(approach==="forzar"){
    if(Math.random()<clamp(0.4+E.rep.dureza/200,0.25,0.8)){ aplicarEfectos({plantel:2}); aplicarGrupos({tecnico:6,camarin:-4}); txt=j.n+" agachó la cabeza. Quedó claro quién manda."; }
    else { aplicarEfectos({moral:-6}); aplicarGrupos({camarin:-12,prensa:-6}); txt=j.n+" explotó y el vestuario tomó nota."; tono="malo"; }
  } else { /* convencer: impredecible (morado) */
    const r=Math.random();
    if(r<0.4){ aplicarEfectos({moral:8,plantel:2}); aplicarGrupos({camarin:12}); txt=j.n+" salió más motivado que nunca. Redondo."; tono="bueno"; }
    else if(r<0.72){ txt="Charla larga de resultado incierto. Habrá que ver."; }
    else { aplicarEfectos({moral:-5}); aplicarGrupos({camarin:-8}); txt="Se malinterpretó todo y quedó peor que antes."; tono="malo"; }
  }
  notificar({t:"Cara a cara con "+j.n,tipo:tono,d:txt,bandeja:false});
  guardar(); return txt;
}
function dispararNegociacion(){
  if(!E||!E.plantel) return false;
  if(Math.random()>0.11) return false;
  const neg=generarNegociacion(); if(!neg) return false;
  if(typeof modalNegociacion==="function"){ modalNegociacion(neg); return true; }
  return false;
}
