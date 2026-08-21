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
 }},
 /* 6.0 · CALLBACK DE MEMORIA: la promesa que te cobran (existe por lo que vos hiciste) */
 {buzon:"camarin",peso:"medio",gen:function(){
   if(typeof promesaPendiente!=="function") return null;
   const m=promesaPendiente(); if(!m) return null;
   const quien=m.quien; m.usado=(m.usado||0)+1; /* no la vuelve a disparar */
   const j=(E.plantel||[]).find(x=>x.n===quien);
   return {t:quien+" te cobra la promesa",
     d:cuandoMemoria(m).charAt(0).toUpperCase()+cuandoMemoria(m).slice(1)+" "+m.txt+". "+quien+" no se olvidó: lo pregunta en el camarín, delante de todos. La memoria del grupo es larga y esto lleva tu firma.",
     posturas:{camarin:22,directorio:-12},
     op:[
      {t:"Cumplir lo prometido",dif:24,req:{plata:60},ef:{plata:-60,moral:6},grupos:{camarin:14,directorio:-8},
       bien:{txt:"Cumpliste tu palabra. "+quien+" y el grupo lo registran: con vos se puede confiar.",ef:{moral:4},rep:{credibilidad:6}},
       mitad:{txt:"Cumpliste, aunque tarde. Quedó saldado sin aplausos.",ef:{}},
       mal:{txt:"Cumpliste, pero el resto ya arma fila con el mismo reclamo.",ef:{deuda:40}}},
      {t:"Pedir un poco más de tiempo",dif:44,grupos:{camarin:-6},
       bien:{txt:quien+" lo entendió: sabe que la caja está justa.",ef:{}},
       mitad:{txt:"Aceptó a regañadientes. La cuenta sigue abierta.",ef:{moral:-2}},
       mal:{txt:"Sintió que le diste el vamos y ahora te esquiva.",ef:{moral:-6},grupos:{camarin:-10}}},
      {t:"Negar que lo hayas prometido",dif:58,grupos:{camarin:-16,prensa:-8},rep:{credibilidad:-8,dureza:4},
       bien:{txt:"Te hiciste el desentendido y por ahora zafaste.",ef:{}},
       mitad:{txt:quien+" no te cree, pero se la guarda.",ef:{moral:-5}},
       mal:{txt:"Lo negaste y salió a contarlo. Quedaste como alguien que no cumple.",ef:{moral:-8},grupos:{camarin:-14,prensa:-10},rep:{credibilidad:-6}}}
     ]};
 }},
 /* 6.12 · MERCADO con variedad: distintos tipos de operación, distinto jugador cada vez */
 /* préstamo con opción de compra por un joven */
 {buzon:"refuerzos",peso:"bajo",gen:function(){
   const j=jugAzar(x=>x.edad<=23&&x.nivel>=64); if(!j) return null;
   const club=otroClub();
   return {t:club+" quiere a "+j.n+" a préstamo",
     d:club+" ofrece llevarse a "+j.n+" ("+j.edad+" años) cedido por un año, con opción de compra. Se foguea afuera, pero lo perdés esta temporada.",
     posturas:{directorio:8,comunidad:-6},
     op:[
      {t:"Cederlo con opción",dif:24,grupos:{directorio:8},
       bien:{txt:"Vuelve rodado y revalorizado. Buen negocio.",ef:{cantera:4},flags:{}},
       mitad:{txt:"Sumó minutos, nada del otro mundo.",ef:{}},
       mal:{txt:"Casi no jugó y volvió frío.",ef:{cantera:-2}}},
      {t:"Cederlo sin opción (te lo asegurás)",dif:30,
       bien:{txt:"Se fogueó y vuelve tuyo, más caro.",ef:{cantera:5}},
       mitad:{txt:"Rodó a medias, pero es tuyo.",ef:{}},
       mal:{txt:"No jugó y encima se resintió.",ef:{cantera:-2}}},
      {t:"No, lo quiero acá",dif:20,grupos:{comunidad:6},
       bien:{txt:"Le diste minutos vos y explotó en casa.",ef:{cantera:4,plantel:2}},
       mitad:{txt:"Jugó poco, se quedó en el molde.",ef:{}},
       mal:{txt:"No sumó y se frustró en la banca.",ef:{moral:-3}}}
     ]};
 }},
 /* intercambio propuesto (dos jugadores) */
 {buzon:"refuerzos",peso:"medio",gen:function(){
   const sale=jugAzar(x=>x.nivel>=66); const club=otroClub(); if(!sale) return null;
   return {t:"Propuesta de intercambio por "+sale.n,
     d:club+" propone un trueque: te llevan a "+sale.n+" ("+sale.pos+", nivel "+sale.nivel+") y te mandan un jugador de su plantel de nivel parecido. Cambia caras sin mover plata.",
     posturas:{directorio:10,camarin:-8,hinchada:sale.rasgos&&sale.rasgos.includes("ídolo")?-15:-4},
     op:[
      {t:"Aceptar el trueque",dif:34,grupos:{directorio:8,camarin:-6},
       bien:{txt:"El que llegó rinde más. Salió el cambio.",ef:{plantel:2}},
       mitad:{txt:"Cambio neutro: ni mejor ni peor.",ef:{}},
       mal:{txt:"El que llegó no encajó y perdiste a un querido.",ef:{plantel:-3,moral:-5},grupos:{hinchada:-6}}},
      {t:"Pedir que sumen plata",dif:44,grupos:{directorio:10},
       bien:{txt:"Aceptaron poner diferencia. Trueque + caja.",ef:{plata:120}},
       mitad:{txt:"Regatearon y quedó en nada.",ef:{}},
       mal:{txt:"Se ofendieron y cerraron la puerta.",ef:{}}},
      {t:"Rechazar, acá no se cambia gente",dif:22,grupos:{camarin:8,hinchada:5},rep:{dureza:3},
       bien:{txt:"El grupo valoró que bancaste a los tuyos.",ef:{moral:3}},
       mitad:{txt:"Quedó ahí, sin ruido.",ef:{}},
       mal:{txt:"El jugador quería irse y quedó dolido.",ef:{moral:-3}}}
     ]};
 }},
 /* 6.22 · EVENTOS LOCALES con sabor chileno (token/lugar + 1 mundo + 1 semilla) */
 {buzon:"institucional",peso:"medio",gen:function(){
   return {t:"Consejo de Presidentes en Quilín",
     d:"La ANFP cita a todos los clubes a votar el formato del próximo torneo y el reparto de la TV. Cada voto se cobra o se agradece después.",
     posturas:{directorio:10,prensa:6},
     op:[
      {t:"Votar con los grandes",dif:30,grupos:{directorio:10},
       bien:{txt:"Quedaste bien con los que mandan. El año que viene te devuelven la mano.",flags:{votoConsejo:"grandes"},mods:[{id:"favor_tv",n:"Favor de TV",anios:1,ef:{sponsor:0.05}}]},
       mitad:{txt:"Voto útil, sin réditos claros.",flags:{votoConsejo:"grandes"}},
       mal:{txt:"Los regionales te marcaron la cancha.",grupos:{comunidad:-6},flags:{votoConsejo:"grandes"}}},
      {t:"Votar con los regionales",dif:34,grupos:{comunidad:12,directorio:-6},
       bien:{txt:"Ganaste aliados en provincias. Solidaridad que vuelve.",flags:{votoConsejo:"regionales"}},
       mitad:{txt:"Voto testimonial.",flags:{votoConsejo:"regionales"}},
       mal:{txt:"Los grandes tomaron nota de tu rebeldía.",grupos:{anfp:-8},flags:{votoConsejo:"regionales"}}},
      {t:"Abstenerte y no comprometerte",dif:24,rep:{credibilidad:-2},
       bien:{txt:"No te mojaste: nadie te debe, nadie te reclama.",flags:{votoConsejo:"neutro"}},
       mitad:{txt:"Quedaste como tibio.",flags:{votoConsejo:"neutro"}},
       mal:{txt:"Los dos bandos te miran con desconfianza.",grupos:{directorio:-4},flags:{votoConsejo:"neutro"}}}
     ]};
 }},
 {buzon:"camarin",peso:"medio",gen:function(){
   const j=jugAzar(x=>x.nivel>=76); if(!j) return null;
   return {t:"La Roja convoca a "+j.n, ficha:{n:j.n},
     d:"Fecha FIFA: la selección llama a "+j.n+". Es un orgullo, pero vuelve cansado (y con riesgo de lesión) justo antes de una fecha clave.",
     posturas:{hinchada:12,prensa:8,tecnico:-10},
     op:[
      {t:"Cederlo, es un honor",dif:26,grupos:{hinchada:10,prensa:6},
       bien:{txt:j.n+" volvió entero y enchufado. Todo bien.",ef:{moral:2}},
       mitad:{txt:"Volvió con la forma justa, hay que dosificarlo.",accion:"cansarFicha"},
       mal:{txt:j.n+" volvió tocado de la gira. Mala suerte.",accion:"lesionFicha"}},
      {t:"Pedir que no lo lleven (excusa médica)",dif:48,grupos:{prensa:-10,anfp:-8},rep:{credibilidad:-4},
       bien:{txt:"Zafó de la gira y lo tenés fresco. La prensa refunfuña.",ef:{}},
       mitad:{txt:"Se filtró la maniobra y quedaste expuesto.",grupos:{prensa:-8}},
       mal:{txt:"La ANFP te sancionó por no liberar al jugador.",ef:{riesgo:6},grupos:{anfp:-12}}}
     ]};
 }},
 {buzon:"finanzas",peso:"bajo",gen:function(){
   return {t:"El CDF quiere el clásico a las 21:30",
     d:"La señal pide mover el partido grande al horario central del domingo. Deja plata extra de TV, pero jugar de noche y con la previa larga desgasta más al plantel.",
     posturas:{sponsors:12,camarin:-8},
     op:[
      {t:"Aceptar el horario y cobrar",dif:22,ef:{plata:100},grupos:{sponsors:10,camarin:-6},
       bien:{txt:"Entró la plata de TV.",mods:[{id:"trasnoche",n:"Partido nocturno pesado",anios:1,ef:{}}]},
       mitad:{txt:"Cobrás, pero el plantel llega justo.",ef:{}},
       mal:{txt:"El equipo acusó el trasnoche y el desgaste.",ef:{moral:-3}}},
      {t:"Exigir horario de tarde",dif:40,grupos:{sponsors:-10},
       bien:{txt:"Respetan al hincha y al futbolista. Buena imagen.",grupos:{hinchada:6}},
       mitad:{txt:"Negociación tensa, quedó a medias.",ef:{}},
       mal:{txt:"La señal se enojó y te bajó exposición.",ef:{plata:-40}}}
     ]};
 }},
 {buzon:"institucional",peso:"bajo",gen:function(){
   return {t:"El municipio pide el estadio para un concierto",
     d:"El alcalde quiere el recinto el sábado previo a tu partido de local. Deja arriendo, pero la cancha queda marcada para el domingo.",
     posturas:{directorio:10,tecnico:-12},
     op:[
      {t:"Alquilar, la plata sirve",dif:20,ef:{plata:70},grupos:{directorio:8,tecnico:-8},
       bien:{txt:"Entró plata de arriendo.",mods:[{id:"cancha_marcada",n:"Cancha en mal estado",anios:1,ef:{local:-4}}]},
       mitad:{txt:"La cancha quedó pesada, se jugó como se pudo.",ef:{}},
       mal:{txt:"Un pozo en el área casi te cuesta un gol. Papelón.",grupos:{tecnico:-6}}},
      {t:"Cuidar la cancha y decir que no",dif:32,grupos:{tecnico:10,comunidad:-6},
       bien:{txt:"El campo impecable, el técnico feliz.",ef:{}},
       mitad:{txt:"El alcalde lo tomó a mal.",grupos:{comunidad:-4}},
       mal:{txt:"Te ganaste un enemigo político.",grupos:{comunidad:-10}}}
     ]};
 }},
 {buzon:"hinchada",peso:"medio",gen:function(){
   return {t:"Lienzo contra el directorio en el entrenamiento",
     d:"Aparecieron con un trapo contra la dirigencia en pleno entrenamiento a puertas abiertas. Los jugadores miraron de reojo. Hay que decidir cómo se maneja.",
     posturas:{directorio:-10,prensa:12},
     op:[
      {t:"Bajarlo con seguridad",dif:30,grupos:{directorio:8,hinchada:-8},rep:{dureza:4},
       bien:{txt:"Se descolgó sin incidentes.",ef:{}},
       mitad:{txt:"Volaron insultos, pero se bajó.",ef:{}},
       mal:{txt:"Forcejeo, foto fea y más bronca.",grupos:{hinchada:-8}}},
      {t:"Dejarlo, es su libertad",dif:26,grupos:{directorio:-8,hinchada:6},
       bien:{txt:"La barra valoró que no reprimiste.",ef:{}},
       mitad:{txt:"El directorio se sintió desprotegido.",grupos:{directorio:-6}},
       mal:{txt:"Se llenó de lienzos y fue un circo.",grupos:{directorio:-10,prensa:-6}}},
      {t:"Encaminar el reclamo a la mesa de la barra",dif:34,
       bien:{txt:"Le diste un canal al reclamo. Ganaste tiempo.",ef:{}},
       mitad:{txt:"Aceptaron hablar, sin garantías.",ef:{}},
       mal:{txt:"Sintieron que los usás y se cerraron.",grupos:{hinchada:-6}}}
     ]};
 }},
 {buzon:"finanzas",peso:"bajo",gen:function(){
   return {t:"Llega el impuesto de la SAD",
     d:"La sociedad anónima debe pagar un tributo que aprieta la caja. Podés pagar, hacer lobby para diferirlo, o revisar el estatuto para blindarte a futuro.",
     posturas:{directorio:10,socios:-8},
     op:[
      {t:"Pagar y no dar que hablar",dif:20,req:{plata:90},ef:{plata:-90},grupos:{directorio:6},
       bien:{txt:"Cuentas al día, cero ruido.",ef:{}},
       mitad:{txt:"Pagaste, la caja quedó justa.",ef:{}},
       mal:{txt:"El pago te dejó corto para el mercado.",ef:{}}},
      {t:"Lobby para diferirlo",dif:44,grupos:{anfp:6},rep:{credibilidad:-2},
       bien:{txt:"Conseguiste plazo. Aire para la caja.",ef:{deuda:60}},
       mitad:{txt:"Diferido a medias, con intereses.",ef:{deuda:120}},
       mal:{txt:"El lobby se filtró y quedó feo.",grupos:{prensa:-8}}}
     ]};
 }},
 {buzon:"gris",peso:"medio",gen:function(){
   return {t:"Un dirigente filtró el camarín a la prensa",
     d:"Salió en la radio información interna que solo manejaba la mesa chica. Hay un topo en el directorio. Cómo lo manejes marca el clima de todo el año.",
     posturas:{directorio:-10,prensa:8,camarin:-12},
     op:[
      {t:"Echarlo y limpiar la interna",dif:44,req:{capital:8},ef:{capital:-8},grupos:{camarin:12,directorio:-10},rep:{dureza:6},
       bien:{txt:"Cortaste la filtración de raíz. El camarín lo agradeció.",ef:{moral:5}},
       mitad:{txt:"Se fue, pero dejó ruido político.",ef:{}},
       mal:{txt:"Armó quilombo y dividió al directorio.",grupos:{directorio:-12}}},
      {t:"Usarlo a tu favor (contrafiltrar)",dif:40,grupos:{prensa:6},rep:{dureza:4,credibilidad:-4},ef:{riesgo:8},
       bien:{txt:"Le diste vuelta la información y quedaste un paso adelante.",ef:{}},
       mitad:{txt:"Jugada arriesgada, resultado dudoso.",ef:{}},
       mal:{txt:"Se te volvió en contra y quedaste como intrigante.",grupos:{prensa:-8}}},
      {t:"Desmentir todo públicamente",dif:28,grupos:{prensa:-4},
       bien:{txt:"Bajaste el tema con un desmentido firme.",ef:{}},
       mitad:{txt:"Nadie te creyó del todo.",ef:{}},
       mal:{txt:"A la semana salió la prueba y quedaste expuesto.",rep:{credibilidad:-6}}}
     ]};
 }},
 /* 6.21 · EVENTO DE PUERTA: germina cuando le rompés un pacto a la barra */
 {buzon:"gris",peso:"medio",gen:function(){
   if(E.flags.puertaBarra==null || (E.idx-E.flags.puertaBarra)>4) return null;
   delete E.flags.puertaBarra;   /* se consume la semilla */
   return {t:"Tensión en la puerta 8",
     d:"Después del pacto roto, la barra apareció caldeada en la puerta del estadio. Piden reunión de urgencia; seguridad quiere desalojar. Vos tenés la última palabra.",
     posturas:{hinchada:-20,anfp:-10,prensa:10},
     op:[
      {t:"Bajar a hablar y recomponer",dif:40,req:{capital:6},ef:{capital:-6},grupos:{hinchada:12},
       bien:{txt:"Diste la cara, la escuchaste y bajaste la tensión. Con eso el lienzo se descolgó.",ef:{},flags:{barraCalmada:true}},
       mitad:{txt:"Se calmó a medias, pero la desconfianza quedó.",ef:{moral:-2}},
       mal:{txt:"No te creyeron y quedaste más expuesto.",ef:{moral:-4},grupos:{hinchada:-6}}},
      {t:"Mano dura y seguridad reforzada",dif:34,grupos:{hinchada:-14,anfp:8,prensa:-6},rep:{dureza:8},ef:{riesgo:-6},
       bien:{txt:"Se despejó la puerta sin incidentes graves. Frío, pero funcionó.",ef:{}},
       mitad:{txt:"Hubo empujones y una foto fea en los medios.",ef:{riesgo:4}},
       mal:{txt:"Terminó en incidentes, sumario y multa.",ef:{riesgo:12,plata:-80},grupos:{anfp:-12,prensa:-12}}},
      {t:"Desentenderte y que lo maneje el club",dif:26,grupos:{hinchada:-8,directorio:-6},
       bien:{txt:"Pasó sin mayor ruido, de pura suerte.",ef:{}},
       mitad:{txt:"Quedó la sensación de que mirás para el costado.",ef:{moral:-3}},
       mal:{txt:"La cosa escaló y la culpa recayó en tu ausencia.",ef:{riesgo:8,moral:-5},grupos:{hinchada:-10,prensa:-8}}}
     ]};
 }},
 /* 6.17 · OFERTA FORMAL CON NOMBRE: vende EXACTAMENTE al jugador que nombra la carta (ficha) */
 {buzon:"refuerzos",peso:"medio",gen:function(){
   const j=jugAzar(x=>x.nivel>=66); if(!j) return null;
   const club=otroClub();
   const simbolo=j.rasgos&&(j.rasgos.indexOf("ídolo")>=0||j.rasgos.indexOf("de la casa")>=0);
   return {t:"Oferta formal por "+j.n, ficha:{n:j.n},
     d:club+" pone una oferta formal sobre la mesa por "+j.n+" ("+j.pos+", nivel "+j.nivel+", valor estimado "+plata(j.valor)+"). La plata ordena el año, pero perdés a un jugador"+(simbolo?" que la gente quiere":"")+".",
     posturas:{directorio:22,hinchada:simbolo?-25:-8,camarin:-8},
     op:[
      {t:"Aceptar y vender a "+j.n,dif:28,grupos:{directorio:15,hinchada:-10},
       bien:{txt:"Entró la plata y el club la aprovecha.",accion:"venderFicha"},
       mitad:{txt:"Se vendió, aunque el reemplazo todavía no aparece.",ef:{plantel:-2},accion:"venderFicha"},
       mal:{txt:"Se vendió en mal momento y el equipo lo siente.",ef:{plantel:-3,moral:-4},accion:"venderFicha"}},
      {t:"Pedir más plata",dif:46,grupos:{directorio:8},
       bien:{txt:"Mejoraron la oferta y cerraste una gran venta.",ef:{plata:120},accion:"venderFicha"},
       mitad:{txt:"Regatearon y quedó en nada. "+j.n+" se queda.",ef:{}},
       mal:{txt:"Se ofendieron y retiraron la oferta.",ef:{}}},
      {t:"Rechazar, "+j.n+" no se vende",dif:34,req:{plata:60},ef:{plata:-60},grupos:{hinchada:15,camarin:10},rep:{dureza:4},
       bien:{txt:j.n+" se queda y el mensaje caló hondo.",ef:{moral:5}},
       mitad:{txt:"Se queda, con la cabeza en otro lado.",ef:{moral:-2}},
       mal:{txt:j.n+" quería irse y quedó dolido.",ef:{moral:-4}}}
     ]};
 }},
 /* sondeo de un grande por tu joya */
 {buzon:"refuerzos",peso:"medio",gen:function(){
   const j=jugAzar(x=>x.edad<=22&&(x.proy>=x.nivel+4)); if(!j) return null;
   const club=otroClub();
   return {t:club+" sondea a la joya "+j.n, ficha:{n:j.n},
     d:club+" mandó a preguntar por "+j.n+" ("+j.edad+" años, proyección "+j.proy+"). Todavía no hay oferta formal, pero el entorno del pibe ya se ilusiona.",
     posturas:{hinchada:8,directorio:-6,prensa:8},
     op:[
      {t:"Ponerle una cláusula alta y blindarlo",dif:32,req:{plata:60},ef:{plata:-60},grupos:{hinchada:10},
       bien:{txt:"Blindado y contento. Si se va, se va carísimo.",ef:{prestigio:2}},
       mitad:{txt:"Firmó, pero el ruido sigue.",ef:{}},
       mal:{txt:"Se sintió una mercancía y bajó el rendimiento.",ef:{moral:-4}}},
      {t:"Dejar correr, si llega la oferta se ve",dif:26,grupos:{directorio:6},
       bien:{txt:"Llegó una oferta grande por "+j.n+" y la aceptaste: entra la plata.",accion:"venderFicha"},
       mitad:{txt:"Quedó en sondeo, nada concreto.",ef:{}},
       mal:{txt:"El pibe se distrajo pensando en irse.",ef:{plantel:-2,moral:-3}}}
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
  const setMoral=d=>{ if(j) j.moral=clamp((j.moral||70)+d,0,100); };
  if(approach==="persuadir"){
    if(Math.random()<clamp(0.45+carisma/250,0.3,0.85)){ aplicarEfectos({moral:3}); aplicarGrupos({camarin:6}); setMoral(15); txt=j.n+" entró en razón. Clima recompuesto."; tono="bueno"; }
    else { setMoral(-8); txt=j.n+" escuchó, pero no quedó del todo convencido. Quedó con la cara larga."; }
  } else if(approach==="prometer"){
    if(Math.random()<clamp(0.7+carisma/400,0.5,0.92)){ aplicarEfectos({moral:5,deuda:60}); aplicarGrupos({camarin:8,directorio:-6}); setMoral(20); txt=j.n+" firma feliz, pero la planilla pesa más."; tono="bueno"; E.flags["prometido_"+j.n]=E.idx;
      if(typeof recordar==="function") recordar("promesa","le prometiste un aumento a "+j.n,{quien:j.n,peso:"alto",tono:"riesgo"}); }
    else { aplicarEfectos({moral:-2}); setMoral(-12); txt="No alcanzó ni con la promesa. Sigue incómodo."; }
  } else if(approach==="forzar"){
    if(Math.random()<clamp(0.4+E.rep.dureza/200,0.25,0.8)){ aplicarEfectos({plantel:2}); aplicarGrupos({tecnico:6,camarin:-4}); setMoral(-6); txt=j.n+" agachó la cabeza. Quedó claro quién manda, pero no contento."; }
    else { aplicarEfectos({moral:-6}); aplicarGrupos({camarin:-12,prensa:-6}); setMoral(-24); txt=j.n+" explotó y el vestuario tomó nota. Quedó dolido."; tono="malo"; }
  } else { /* convencer: impredecible (morado) */
    const r=Math.random();
    if(r<0.4){ aplicarEfectos({moral:8,plantel:2}); aplicarGrupos({camarin:12}); setMoral(25); txt=j.n+" salió más motivado que nunca. Redondo."; tono="bueno"; }
    else if(r<0.72){ txt="Charla larga de resultado incierto. Habrá que ver."; }
    else { aplicarEfectos({moral:-5}); aplicarGrupos({camarin:-8}); setMoral(-18); txt="Se malinterpretó todo y "+j.n+" quedó peor que antes."; tono="malo"; }
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
