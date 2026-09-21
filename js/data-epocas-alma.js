"use strict";
/* ============================================================
   FUTBOLINI · data-epocas-alma.js   (7.9015 · las épocas dejan de arrancar vacías)

   HALLAZGO que originó este archivo (medido, no supuesto):
   el juego ofrece **84 arranques (club, época)** vía `EPOCAS_CLUB`, y las
   decisiones propias se filtran con `d.club===E.club && d.anio===E.anio`
   (motor.js:601, coincidencia EXACTA de año). Cruzando ambas cosas:
   solo **12** de esos 84 arranques tenían una decisión de su propio año.
   Los otros **72 empezaban sin una sola línea sobre el club en ese año**.
   Comprobado arrancando el juego: Palestino 1978 → E.anio=1978, 0 decisiones
   propias. Esa es, literal, la vara que pide el autor ("si me meto a Santiago
   Wanderers 2001, ¿veré cosas de ese año?").

   INTEGRIDAD (regla del repo). El ANCLA de cada decisión es el dato que ya vive
   en `EPOCAS_CLUB[id]`: `anio`, `etq`, `dt` y `desc`, escritos y verificados
   antes que este archivo. **Acá no se agrega ni un hecho histórico nuevo.**
   Lo que se escribe es el dilema de dirigencia que sale de ese hecho: ficción
   declarada, sobre ancla real. Nada de frases puestas en boca de personas
   reales, nada de nombres de jugadores inventados.
   ============================================================ */

/* Los cuatro arquetipos salen de leer las 72 épocas, no de la imaginación:
   gloria (estás en el año del título), ascenso (recién llegaste y hay que
   afirmarse), origen (el logro es existir) y ultimo (es el último ciclo bueno
   y el club todavía no lo sabe).
   En los cuatro, las opciones van SIEMPRE en el mismo orden:
   0 = apostar · 1 = sostener · 2 = resguardar la caja. */
var ALMA_TIPOS={
  gloria:{
    buzon:"institucional", peso:"alto",
    posturas:{hinchada:30,directorio:-10,prensa:20,tecnico:15},
    consejo:{
      tesorero:"Un año grande es la única ventana en que entra plata de verdad. Si no se aprovecha ahora, no se aprovecha.",
      deportivo:"El plantel está en su punto. Tocarlo de más es romper algo que funciona.",
      prensa:"Después de un título todo lo que digas se mide con otra vara. Cuidado con prometer."},
    mec:[
      {dif:55, ef:{plata:-120,prestigio:6,moral:6}, grupos:{hinchada:14,tecnico:10,directorio:-10},
       bien:"La apuesta sale: el club se sube al envión y la gente siente que esto recién empieza.",
       mitad:"Se refuerza algo, pero no lo suficiente para cambiar de escala. Queda la duda.",
       mal:"Se gastó de más sobre un equipo que ya andaba, y el envión se diluyó en presión."},
      {dif:40, grupos:{camarin:10,hinchada:6,directorio:4}, ef:{moral:4},
       bien:"El grupo campeón sigue junto. En el camarín se nota que el club les creyó.",
       mitad:"Se sostiene casi todo. Un par de salidas dolieron más de lo previsto.",
       mal:"Quedarse quieto también es una decisión: el rival se movió y vos no."},
      {dif:32, ef:{plata:180}, grupos:{directorio:14,sponsors:8,hinchada:-14,camarin:-8},
       bien:"Se vendió caro y en el mejor momento. La caja queda sana; la gente no lo va a olvidar.",
       mitad:"Entró plata, se fue una pieza querida y el equipo perdió algo que no estaba en la planilla.",
       mal:"Vender en el pico se leyó como traición justo cuando el club era feliz."}
    ]},
  ascenso:{
    buzon:"institucional", peso:"alto",
    posturas:{hinchada:25,directorio:10,prensa:5,tecnico:15},
    consejo:{
      tesorero:"El ascenso trae plata nueva y gastos nuevos. Los segundos llegan más rápido.",
      deportivo:"La categoría de arriba castiga al que llega a mirar. O competimos, o volvemos.",
      prensa:"Nadie te exige campeonar. Te exigen no hacer el ridículo."},
    mec:[
      {dif:58, ef:{plata:-110,moral:6}, grupos:{hinchada:14,tecnico:8,directorio:-10},
       bien:"Los refuerzos rinden y el club compite de igual a igual desde la primera fecha.",
       mitad:"Se reforzó, pero la diferencia de categoría se sigue notando en los detalles.",
       mal:"Se gastó lo que no había y el equipo igual sufre. Ahora sufre endeudado."},
      {dif:38, grupos:{directorio:8,camarin:8,hinchada:4},
       bien:"Plan claro: afirmarse. El plantel entiende el mensaje y el club no se marea.",
       mitad:"Se sostiene la categoría a fuerza de oficio, sin brillo y sin desastre.",
       mal:"Conformarse temprano bajó la vara, y el equipo jugó a no perder desde marzo."},
      {dif:30, ef:{plata:140}, grupos:{directorio:12,hinchada:-10},
       bien:"La caja queda blindada. Si esto sale mal, al menos el club sigue de pie.",
       mitad:"Se ahorró, se compitió poco y la gente lo notó antes que el balance.",
       mal:"Se cuidó la plata y se regaló la temporada. Volver abajo sale más caro que reforzar."}
    ]},
  origen:{
    buzon:"institucional", peso:"medio",
    posturas:{hinchada:20,comunidad:30,directorio:-5,prensa:0},
    consejo:{
      tesorero:"No hay caja que administrar todavía. Hay que inventarla.",
      deportivo:"Sin plantel hecho, lo único que se puede construir es un modo de jugar.",
      prensa:"Nadie los conoce. Eso también es una ventaja."},
    mec:[
      {dif:55, ef:{prestigio:6,capital:-6}, grupos:{comunidad:14,hinchada:12,directorio:-8},
       bien:"Apuntar alto desde el día uno le dio al club una identidad antes que una vitrina.",
       mitad:"La ambición entusiasma, pero todavía no hay con qué sostenerla.",
       mal:"Prometer grandeza sin estructura dejó al club debiendo antes de empezar."},
      {dif:35, grupos:{comunidad:12,socios:10,hinchada:6}, ef:{cantera:6},
       bien:"Paso a paso y con la gente del lugar: así se hacen los clubes que duran.",
       mitad:"Se avanza lento. Lento también es avanzar, aunque no entusiasme a nadie.",
       mal:"Ir despacio sin rumbo es simplemente no ir."},
      {dif:30, ef:{plata:90}, grupos:{directorio:12,comunidad:-8},
       bien:"Con los números en orden, el club existe el año que viene. No es poco.",
       mitad:"Se junta plata y se pierde impulso. Habrá que reconquistar a la gente.",
       mal:"Un club que solo cuida la caja no le importa a nadie, y eso también se paga."}
    ]},
  ultimo:{
    buzon:"institucional", peso:"alto",
    posturas:{hinchada:20,directorio:-15,prensa:10,socios:15},
    consejo:{
      tesorero:"Los números no mienten y vienen avisando hace rato. Esto no se arregla con una campaña.",
      deportivo:"Todavía hay equipo. Dentro de dos años puede que no.",
      prensa:"Nadie quiere escuchar que el ciclo se termina. Por eso hay que decirlo ahora."},
    mec:[
      {dif:62, ef:{plata:-130,moral:8}, grupos:{hinchada:16,tecnico:10,directorio:-14},
       bien:"Se jugó el todo por el todo y el club tuvo un año que la gente va a contar por décadas.",
       mitad:"La apuesta alcanzó para competir, no para cambiar el destino del club.",
       mal:"Se quemaron las naves y después no quedó ni barco ni puerto."},
      {dif:36, ef:{plata:60}, grupos:{directorio:12,socios:8,hinchada:-6}, rep:{credibilidad:4},
       bien:"Ordenar a tiempo es la decisión más impopular y la única que salva clubes.",
       mitad:"Se ordena algo. Tarde, pero algo.",
       mal:"Se ordenó la caja y se desordenó todo lo demás."},
      {dif:40, grupos:{camarin:6,directorio:4},
       bien:"Con lo puesto y sin ruido, el club aguantó otro año en la categoría.",
       mitad:"Se aguanta. Se aguanta cada vez con menos.",
       mal:"Aguantar sin hacer nada es la forma lenta de bajar."}
    ]}
};

/* Una entrada por época huérfana. `ctx` PARTE del `desc` real de EPOCAS_CLUB,
   no lo repite; las opciones son cortas porque el arquetipo pone la mecánica. */
var ALMA_EPOCA=[
 {c:"UCH",a:2011,tipo:"gloria",t:"Campeones de América y ahora qué",
  ctx:"La U acaba de ganar la Sudamericana invicta y el mundo entero pregunta el precio de cada jugador de este plantel. En el club hay dos relojes corriendo: el de la gente, que quiere más, y el de los representantes, que ya están en la puerta.",
  op:[{t:"Traer un refuerzo de jerarquía",d:"Si este equipo es histórico, que se note también en el mercado."},
      {t:"Blindar al plantel campeón",d:"Renovaciones y cláusulas. Que no se vaya nadie por poca plata."},
      {t:"Vender ahora, que nunca van a valer más",d:"La caja de la U no se arma con recuerdos."}]},
 {c:"UC",a:2019,tipo:"gloria",t:"El dominio y la costumbre de ganar",
  ctx:"La UC campeonó de punta a punta y ya nadie festeja como la primera vez. El directorio pregunta qué se hace con un club acostumbrado a ganar: si se estira el ciclo o se aprovecha para vender caro y rearmar.",
  op:[{t:"Estirar el ciclo con un refuerzo puntual",d:"Un nombre más y esta base pelea todo otra vez."},
      {t:"Mantener la base tal cual",d:"No tocar lo que funciona. El orden cruzado es el activo."},
      {t:"Vender a la figura y rearmar",d:"Plata fresca ahora, con la vitrina llena."}]},
 {c:"PAL",a:1978,tipo:"gloria",t:"La estrella árabe y la colonia",
  ctx:"Palestino es campeón del Nacional y la colectividad quiere que el club sea la bandera de algo más grande que el fútbol. Hay plata disponible como nunca, y también gente pidiendo que esa plata se gaste fuera de la cancha.",
  op:[{t:"Reforzar para ir por América",d:"El título abre la puerta continental. Hay que cruzarla."},
      {t:"Sostener el plantel del título",d:"Este grupo hizo algo irrepetible. Se cuida."},
      {t:"Invertir en la sede y la colectividad",d:"El club es más que el primer equipo, y eso también se construye."}]},
 {c:"COQ",a:2025,tipo:"gloria",t:"La primera estrella en 67 años",
  ctx:"Coquimbo es campeón por primera vez en su historia y la ciudad no durmió. El club nunca administró un año así: llegan sponsors nuevos, la Libertadores y una presión que en La Portada no se conocía.",
  op:[{t:"Armar un equipo para la Libertadores",d:"Si vamos, vamos en serio. Se paga una vez en la vida."},
      {t:"Cuidar al grupo que hizo historia",d:"Renovar y sostener. La gente quiere ver a estos mismos."},
      {t:"Capitalizar el título",d:"Vender bien, ordenar el club y dejarlo parado para diez años."}]},
 {c:"HUA",a:2023,tipo:"gloria",t:"La tercera estrella y la usina",
  ctx:"Huachipato dio la vuelta en la última fecha y el CAP fue una fiesta. En Talcahuano saben que lo que viene es el desfile de ofertas: un club que forma y vende es un club que gana y se desarma.",
  op:[{t:"Bancar el plantel para la Libertadores",d:"Una vez cada tanto se puede elegir no vender."},
      {t:"Renovar a los pilares y dejar ir al resto",d:"Equilibrio: sostener el esqueleto, soltar lo demás."},
      {t:"Vender y reinvertir en la cantera",d:"El modelo del club es ese, y hay que ser consecuente."}]},
 {c:"CBL",a:2003,tipo:"gloria",t:"Bicampeón en el desierto",
  ctx:"Cobreloa ganó Apertura y Clausura y Calama vive en la cancha. Pero la minera que sostiene todo mira los números y pregunta hasta cuándo se puede bancar un plantel de este nivel a dos mil metros y a mil kilómetros de todo.",
  op:[{t:"Reforzar para ganar América",d:"El bicampeonato pide una noche grande en Calama."},
      {t:"Sostener el plantel y la estructura",d:"Lo difícil no es llegar: es quedarse acá arriba."},
      {t:"Vender antes de que baje el precio",d:"En el desierto la plata se cuida distinto."}]},
 {c:"LIM",a:2025,tipo:"ascenso",t:"Limache en Primera y el pueblo entero mirando",
  ctx:"Limache sube y de golpe el pueblo aparece en la TV todas las semanas. El plantel es corto, el presupuesto también, y el único objetivo que nadie dice en voz alta es no volver a bajar.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si vamos a estar, que sea peleando."},
      {t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia."},
      {t:"Guardar la plata del ascenso",d:"Si bajamos, que el club no baje con deudas."}]},
 {c:"SW",a:2019,tipo:"ascenso",t:"El decano vuelve a honor",
  ctx:"Wanderers está de vuelta en Primera y Playa Ancha no acepta que el club más antiguo sea un equipo de paso. La obligación no es campeonar: es dejar de ser una postal de lo que fue.",
  op:[{t:"Armar un equipo para pelear arriba",d:"El decano no sube para mirar."},
      {t:"Afirmarse primero, soñar después",d:"Un año tranquilo y recién ahí se habla."},
      {t:"Ordenar la casa antes que el equipo",d:"Wanderers se cae por adentro, no por la tabla."}]},
 {c:"SW",a:1968,tipo:"gloria",t:"La estrella del decano",
  ctx:"Wanderers es campeón nacional y Valparaíso tiene el trofeo que le faltaba. El puerto pide que esto sea el principio de algo; los dirigentes saben lo que cuesta sostener a un campeón en una ciudad que vive de los ciclos.",
  op:[{t:"Reforzar para repetir",d:"Un campeón se defiende, no se administra."},
      {t:"Sostener al grupo campeón",d:"Estos hombres ya demostraron. Se los cuida."},
      {t:"Asegurar el futuro del club",d:"La estrella ya está. Ahora, que el club dure."}]},
 {c:"TEM",a:2001,tipo:"ultimo",t:"El último tren de la Araucanía",
  ctx:"Temuco está en Primera y el Germán Becker se llena, pero adentro del club todos saben que las cuentas vienen mal hace rato. Este puede ser el último año en que todavía se puede elegir.",
  op:[{t:"Jugarse el año a full",d:"Si esto se termina, que se termine peleando algo."},
      {t:"Ordenar el club antes de que reviente",d:"Impopular, aburrido y probablemente lo único que sirve."},
      {t:"Aguantar con lo puesto",d:"Ni gastar ni cortar. Llegar a diciembre."}]},
 {c:"DCO",a:2010,tipo:"ultimo",t:"El León antes del bajón",
  ctx:"Deportes Concepción sigue en Primera y Collao todavía empuja, pero el club arrastra una fragilidad institucional que nadie quiere nombrar. Lo que se decida este año define si hay club en cinco.",
  op:[{t:"Ir por una campaña grande",d:"Un buen año tapa muchos agujeros. Por un rato."},
      {t:"Sanear la institución ahora",d:"Menos equipo, más club. La única salida real."},
      {t:"Sostener lo que hay",d:"Sin movimientos bruscos. A ver qué pasa."}]},
 {c:"CLC",a:1957,tipo:"origen",t:"Nace Colchagua",
  ctx:"En San Fernando se funda un club y todavía no hay casi nada: ni cancha propia, ni plantel, ni historia que contar. Lo único que hay es un valle entero dispuesto a que esto exista.",
  op:[{t:"Soñar con el profesionalismo desde ya",d:"Si no apuntamos alto, ¿para qué fundamos un club?"},
      {t:"Construir de a poco, con la gente del valle",d:"Primero raíces, después vitrina."},
      {t:"Asegurar que el club llegue a fin de año",d:"Lo primero es no desaparecer en marzo."}]}
];

/* ---------- por qué hace falta `epoca:` además de `anio:` ----------
   `nuevaPartida` a veces NO puede dejarte en el año pedido: si el club no jugó
   el Nacional de esa era (Temuco 2001, Colchagua 1957), la era se redirige a la
   moderna y `E.anio` termina en 2026. Comprobado corriendo el juego:
   TEM con su época 2001 → E.anio=2026, **E.epocaHist=2001**.
   Como el filtro del motor es `d.anio===E.anio`, una decisión marcada 2001 ahí
   no dispara nunca. Por eso cada entrada lleva también `epoca`, y un wrap de
   `decisionesDisponibles` la admite por `E.epocaHist`. Así las 84 épocas
   jugables sirven, se caiga o no el año. */
/* ---------- constructor: la mecánica la pone el arquetipo ---------- */
function _almaEpocaDecision(e){
  var T=ALMA_TIPOS[e.tipo]||ALMA_TIPOS.ascenso;
  var nom=(function(){
    try{ var c=(typeof clubMundo==="function"&&clubMundo(e.c))||(typeof CLUB_POR_ID!=="undefined"&&CLUB_POR_ID[e.c]); return (c&&(c.n||c.c))||e.c; }catch(x){ return e.c; }
  })();
  return {
    id:"ep_"+e.c.toLowerCase()+"_"+e.a, club:e.c, anio:e.a, epoca:e.a,
    /* mes 1: es la decisión que ABRE la época. Con mes 2 quedaba retenida en las
       ligas que arrancan en enero (medido: Cobreloa 2003 y Temuco 2001 empiezan
       en enero y no la veían hasta febrero). */
    buzon:T.buzon, peso:T.peso, mes:1,
    t:e.t, d:e.ctx,
    posturas:T.posturas, consejo:T.consejo,
    op:e.op.map(function(o,i){
      var m=T.mec[i]||T.mec[T.mec.length-1];
      var out={t:o.t, d:o.d, dif:m.dif};
      if(m.ef) out.ef=m.ef;
      if(m.grupos) out.grupos=m.grupos;
      if(m.rep) out.rep=m.rep;
      out.bien={txt:m.bien, ef:m.ef||{}};
      out.mitad={txt:m.mitad, ef:{}};
      out.mal={txt:m.mal, ef:{}};
      return out;
    }),
    _epocaDe:nom
  };
}
/* ---------- registro (no pisa lo que ya existe) ---------- */
(function mergeAlmaEpoca(){
  if(typeof DECISIONES==="undefined"||!Array.isArray(DECISIONES)) return;
  ALMA_EPOCA.forEach(function(e){
    try{
      var d=_almaEpocaDecision(e);
      if(!DECISIONES.some(function(x){ return x.id===d.id; })) DECISIONES.push(d);
    }catch(x){}
  });
})();
/* ---------- wrap: la decisión de época también entra por E.epocaHist ---------- */
(function(){
  if(typeof decisionesDisponibles!=="function"||decisionesDisponibles._epAlma) return;
  var orig=decisionesDisponibles;
  decisionesDisponibles=function(){
    var base=orig.apply(this,arguments)||[];
    try{
      if(E&&E.epocaHist){
        var ya={}; base.forEach(function(d){ if(d&&d.id) ya[d.id]=1; });
        DECISIONES.forEach(function(d){
          if(!d||!d.epoca||d.club!==E.club||d.epoca!==E.epocaHist||ya[d.id]) return;
          if(typeof decisionCabeEnClub==="function"&&!decisionCabeEnClub(d)) return;
          base=base.concat([d]);
        });
      }
    }catch(x){}
    return base;
  };
  try{ Object.keys(orig).forEach(function(k){ decisionesDisponibles[k]=orig[k]; }); }catch(x){}
  decisionesDisponibles._epAlma=true;
})();
/* ---------- auditor: qué épocas siguen arrancando vacías ---------- */
function epocasHuerfanas(){
  var out=[];
  try{
    Object.keys(EPOCAS_CLUB||{}).forEach(function(id){
      (EPOCAS_CLUB[id]||[]).forEach(function(e){
        var a=e.anio||e.a; if(!a) return;
        if(!DECISIONES.some(function(d){ return d.club===id && d.anio===a; })) out.push({club:id,anio:a,etq:e.etq||""});
      });
    });
  }catch(x){}
  return out;
}
