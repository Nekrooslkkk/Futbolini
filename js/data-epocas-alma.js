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
      {t:"Asegurar que el club llegue a fin de año",d:"Lo primero es no desaparecer en marzo."}]},
 {c:"OHI",a:2013,tipo:"gloria",t:"La primera estrella de Rancagua",
  ctx:"O'Higgins es campeón por primera vez en su historia y la ciudad se llena de bocinas hasta la madrugada. El club nunca administró una vitrina así: hay plata de sponsors nueva, ofertas por la mitad del plantel y una hinchada que quiere que esto no sea un año suelto.",
  op:[{t:"Reforzar para pelear la Libertadores",d:"Si hay estrella, que haya continental. Se paga una vez."},{t:"Sostener al plantel campeón",d:"Este grupo hizo historia junto. No se toca."},{t:"Vender arriba y capitalizar",d:"Nunca van a valer más que ahora mismo."}]},
 {c:"HUA",a:2012,tipo:"gloria",t:"El acero se corona en penales",
  ctx:"Huachipato ganó el Clausura en una definición que se decidió al último penal, en su propia casa. En Talcahuano la fiesta duró una semana; en las oficinas del club ya preguntan qué hacer con un plantel que de golpe tiene mercado.",
  op:[{t:"Ir por la Libertadores con todo",d:"El acero no todos los años sale campeón."},{t:"Blindar al plantel campeón",d:"Ganamos en penales con este grupo. Se cuida entero."},{t:"Vender antes que se acabe la ventana",d:"La siderúrgica no financia caprichos eternos."}]},
 {c:"COB",a:2015,tipo:"gloria",t:"El título que llegó entre aluviones",
  ctx:"Cobreloa festeja un título mientras el desierto todavía se seca de los aluviones que golpearon la región. En Calama el fútbol y la crisis conviven en la misma semana, y el club tiene que decidir qué hacer con un plantel que de golpe es noticia nacional.",
  op:[{t:"Reforzar y apuntar a la Libertadores",d:"Un título así no se administra: se aprovecha."},{t:"Sostener el plantel del título",d:"Ganamos con este grupo. Se mantiene."},{t:"Cuidar la caja de El Cobre",d:"La región tiene otras urgencias esta vez."}]},
 {c:"UDC",a:2018,tipo:"gloria",t:"Subcampeones a un paso de la gloria",
  ctx:"Universidad de Concepción terminó a un pelo del título, con 58 puntos que en cualquier otro año le hubieran alcanzado. La Libertadores del año que viene ya está asegurada, y el directorio duda entre estirar este envión o cuidar lo que se construyó.",
  op:[{t:"Reforzar para pelear el título",d:"Estuvimos a un paso. Falta empujar un poco más."},{t:"Sostener la base subcampeona",d:"Este plantel casi lo logra. Se mantiene junto."},{t:"Vender antes de la Libertadores",d:"La vitrina de este año no se va a repetir fácil."}]},
 {c:"CAL",a:2018,tipo:"gloria",t:"La Calera pelea arriba de verdad",
  ctx:"Unión La Calera está teniendo la mejor campaña de su historia moderna: le pasó por encima a un grande y se metió en zona de Sudamericana por primera vez. En un club acostumbrado a mirar la tabla desde abajo, nadie sabe bien cómo administrar estar arriba.",
  op:[{t:"Reforzar para sostener el lugar",d:"Si vamos a estar arriba, que sea de verdad."},{t:"Sostener el equipo tal cual está",d:"Nadie tocaría un andamiaje que está funcionando así."},{t:"Vender a la figura y capitalizar",d:"Este nivel de mercado no vuelve a golpear la puerta seguido."}]},
 {c:"NUB",a:2022,tipo:"gloria",t:"Ñublense nunca estuvo tan cerca",
  ctx:"Ñublense es subcampeón y jugará por primera vez la fase de grupos de la Libertadores. En Chillán la sensación es rara: el club siempre fue de pelear el descenso, y ahora hay que aprender a administrar un año histórico sin perder la cabeza.",
  op:[{t:"Reforzar para la Libertadores",d:"No se juega una fase de grupos así para hacer bulto."},{t:"Sostener al plantel subcampeón",d:"Este grupo llegó hasta acá junto. Que siga junto."},{t:"Vender y ordenar las cuentas",d:"El club chico que no capitaliza el pico, no vuelve a verlo."}]},
 {c:"EVE",a:2008,tipo:"gloria",t:"La remontada que hizo campeón a Everton",
  ctx:"Everton dio vuelta una serie que parecía perdida y salió campeón en Sausalito. Viña del Mar todavía no lo puede creer: el club le ganó la final a uno de los grandes, y ahora hay que decidir qué se hace con esa hazaña.",
  op:[{t:"Reforzar para ir por más",d:"Después de algo así, no se puede quedar en una noche."},{t:"Sostener al plantel campeón",d:"Este grupo remontó lo imposible. Se cuida entero."},{t:"Vender en el pico de valor",d:"Sausalito no siempre va a estar tan lleno de ofertas."}]},
 {c:"EVE",a:2012,tipo:"ascenso",t:"Everton vuelve por la puerta grande",
  ctx:"Everton se ganó la promoción y regresa a Primera después de dos años picando piedra en la B. En Sausalito nadie quiere repetir el mismo error que los mandó abajo, pero tampoco hay plata para hacer locuras.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si volvimos, que sea para quedarnos peleando arriba."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata de la promoción",d:"Dos años en la B enseñan a no volver a gastar de más."}]},
 {c:"AUD",a:2018,tipo:"gloria",t:"Audax se instala arriba",
  ctx:"Audax Italiano está teniendo una de sus mejores campañas modernas: pelea la parte alta de la tabla y se asoma a un cupo internacional. En La Florida se pregunta si esto es un salto real o apenas un año suelto.",
  op:[{t:"Reforzar para asegurar el cupo",d:"Si la clasificación está cerca, hay que ir a buscarla."},{t:"Sostener el andamiaje actual",d:"El equipo funciona. No hay que romperlo para probar algo nuevo."},{t:"Vender y ordenar la caja",d:"Capitalizar un buen año también es una forma de ganar."}]},
 {c:"LSE",a:2019,tipo:"ascenso",t:"La Serena se afirma arriba",
  ctx:"Deportes La Serena volvió a Primera y esta vez parece que llegó para quedarse: el plantel mezcla oficio con proyección y el club empieza a mirar la categoría con otros ojos. La duda es si conviene ir por más o consolidar primero.",
  op:[{t:"Reforzar para pelear arriba",d:"Si estamos consolidados, hay que ir por algo más que sobrevivir."},{t:"Afirmar el equipo actual",d:"La mezcla de experiencia y juventud está funcionando. No tocarla."},{t:"Cuidar la plata del club",d:"Consolidarse también es no gastar lo que no hay."}]},
 {c:"UES",a:2005,tipo:"gloria",t:"Santa Laura vuelve a ser fiesta",
  ctx:"Unión Española es campeón del Apertura y Santa Laura vive una tarde que hacía tiempo no se veía. La colonia hispana y el barrio de Independencia sienten que el club recuperó algo que se había perdido de vista.",
  op:[{t:"Reforzar para ir por más títulos",d:"Cuando Santa Laura se llena así, hay que aprovecharlo."},{t:"Sostener el plantel campeón",d:"Este grupo le devolvió la alegría al club. Se cuida."},{t:"Vender arriba y ordenar la caja",d:"Un título no tapa años de números difíciles."}]},
 {c:"IQQ",a:2014,tipo:"gloria",t:"El dragón se corona en Copa Chile",
  ctx:"Deportes Iquique gana la Copa Chile y el norte entero festeja el título más grande de su historia moderna. Tierra de Campeones ya no es solo un eslogan: hay una copa real en la vitrina y una ciudad que quiere que esto siga.",
  op:[{t:"Reforzar para ir por la Sudamericana",d:"El título abre la puerta continental. Hay que cruzarla."},{t:"Sostener al plantel campeón",d:"Este grupo le dio al club su copa más grande. Se cuida."},{t:"Vender y ordenar las cuentas",d:"El desierto no perdona un club que no capitaliza sus años buenos."}]},
 {c:"USF",a:2009,tipo:"gloria",t:"El año más grande del uni-uni",
  ctx:"Unión San Felipe se queda con la Copa Chile y el Clausura en el mismo año, algo que el club nunca había soñado. En el valle de Aconcagua nadie sabe bien cómo administrar dos títulos de golpe en un club chico.",
  op:[{t:"Reforzar para ir por todo",d:"Dos títulos en un año no se festejan: se aprovechan."},{t:"Sostener al plantel de los dos títulos",d:"Este grupo le dio al club algo que no tenía. Se cuida."},{t:"Vender y asegurar el futuro",d:"Un club chico que no capitaliza esto, se arriesga a no repetirlo nunca."}]},
 {c:"MAG",a:2023,tipo:"ultimo",t:"El más antiguo, de vuelta y con poco tiempo",
  ctx:"Deportes Magallanes está de vuelta en Primera con la historia más grande y la caja más chica de la categoría. Todo indica que este ciclo va a ser corto, y el club tiene que decidir si se juega el todo por el todo o si prefiere ordenar la casa antes de que se acabe.",
  op:[{t:"Jugarse el año a full",d:"Si esto se termina rápido, que se termine peleando algo."},{t:"Ordenar el club antes de que reviente",d:"Impopular, aburrido y probablemente lo único que sirve."},{t:"Aguantar con lo puesto",d:"Ni gastar ni cortar. Llegar a diciembre."}]},
 {c:"MAG",a:1933,tipo:"gloria",t:"El primer campeón del profesionalismo",
  ctx:"Magallanes se queda con el primer campeonato profesional de la historia de Chile. El club que empieza esta era como el más grande del país tiene que decidir cómo se construye una dinastía desde cero, sin nadie antes que haya hecho el camino.",
  op:[{t:"Armar el plantel más fuerte del profesionalismo",d:"Si el fútbol chileno empieza acá, que empiece con nosotros arriba."},{t:"Sostener el plantel campeón",d:"Ganamos el primer título de la historia. No se toca a la ligera."},{t:"Administrar con cabeza fría",d:"Ser el primero también es una responsabilidad institucional."}]},
 {c:"CUR",a:2017,tipo:"ascenso",t:"El Maule llega a Primera",
  ctx:"Curicó Unido debuta en Primera y toda la región maulina se sube al proyecto. El club sabe que la diferencia entre quedarse un ciclo o volver a bajar en un año se juega en estas primeras decisiones.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si vamos a estar, que sea peleando, no sobreviviendo."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, un ciclo entero por delante."},{t:"Guardar la plata del ascenso",d:"El Maule no tiene margen para gastar de más el primer año."}]},
 {c:"ANT",a:2018,tipo:"ascenso",t:"El puma no quiere ser sucursal",
  ctx:"Deportes Antofagasta juega en Primera y la ciudad del cobre quiere un club con identidad propia, no un furgón de paso de jugadores en tránsito. La distancia con Santiago pesa tanto como el calor del norte.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si vamos a jugar arriba, que se note en la cancha."},{t:"Afirmar la categoría con identidad propia",d:"El puma no es sucursal de nadie. Se construye desde acá."},{t:"Guardar la plata del club",d:"El norte enseña a no gastar lo que todavía no llegó."}]},
 {c:"SMO",a:1942,tipo:"gloria",t:"El chaguito se corona",
  ctx:"Santiago Morning es campeón de Primera y por una vez el club más chico de Independencia le gana la partida a los grandes de siempre. La hinchada del chaguito no sabe si va a volver a vivir un año así.",
  op:[{t:"Reforzar para sostener el nivel",d:"Si el chaguito puede pelear arriba, que siga peleando."},{t:"Sostener al plantel campeón",d:"Este grupo hizo algo que no se repite fácil. Se cuida."},{t:"Ordenar la caja del club",d:"Un club chico que gana también tiene que aprender a durar."}]},
 {c:"LSC",a:1969,tipo:"ascenso",t:"El carbón llega a Primera",
  ctx:"Lota Schwager juega en Primera y la cuenca del carbón tiene, por primera vez, a su club representándola en la elite del fútbol chileno. Los mineros que sostienen al club en las tribunas quieren ver que esto valió la pena.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si el carbón llegó arriba, que se note en la cancha."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata de la cuenca",d:"La minería no siempre da para gastar de más."}]},
 {c:"OSO",a:1991,tipo:"ultimo",t:"El Toro sureño, un año frágil",
  ctx:"Provincial Osorno juega el Campeonato Nacional y el sur tiene, por una vez, representación en la máxima categoría. El plantel es corto y la diferencia con los grandes se siente desde la primera fecha, aunque en el club todavía nadie quiere hablar de lo que puede pasar en diciembre.",
  op:[{t:"Jugarse el año a full",d:"Si esto es lo único que tenemos, que se juegue entero."},{t:"Ordenar el club a tiempo",d:"Impopular, aburrido y probablemente lo único que sirve."},{t:"Aguantar con lo puesto",d:"Ni gastar ni cortar. Llegar a diciembre como sea."}]},
 {c:"GVE",a:2017,tipo:"ascenso",t:"General Velásquez vuelve a ser profesional",
  ctx:"General Velásquez ganó Tercera A y regresa al fútbol profesional después de años en el amateurismo. El club tiene que decidir con qué cara entra a esta nueva etapa, sabiendo que la diferencia de nivel se siente desde la primera fecha.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Volver a ser profesional también es volver a competir en serio."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, un paso a la vez."},{t:"Guardar la plata del ascenso",d:"El profesionalismo trae gastos que antes no existían."}]},
 {c:"SCI",a:2024,tipo:"ascenso",t:"Santiago City entra al profesionalismo",
  ctx:"Santiago City ganó Tercera A y da el salto que todo club amateur sueña: ser profesional. La ciudad capital tiene un club nuevo compitiendo en serio, y el desafío es no perderse en la novedad.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si entramos al profesionalismo, que sea para competir."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, aprender la categoría."},{t:"Guardar la plata del ascenso",d:"El profesionalismo cuesta más de lo que parece desde afuera."}]},
 {c:"COL",a:2025,tipo:"ascenso",t:"Colina vuelve al profesionalismo",
  ctx:"Atlético Colina ganó Tercera A y el club vuelve a la categoría profesional después de años afuera. La comuna que siempre tuvo equipo amateur ahora tiene que aprender a administrar un club de verdad.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Volver al profesionalismo también es volver a exigirse."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, un paso a la vez."},{t:"Guardar la plata del ascenso",d:"Volver no significa que ya haya con qué gastar."}]},
 {c:"CNA",a:2023,tipo:"ascenso",t:"Concón entra al profesionalismo",
  ctx:"Concón National llega al fútbol profesional después de más de un siglo de historia amateur. El club más antiguo de la zona tiene, por fin, la chance de competir en serio, y no quiere desperdiciarla por apurarse.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Cien años de historia se merecen un primer año en serio."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, aprender la categoría."},{t:"Guardar la plata del club",d:"Un club centenario también sabe que la plata no sobra."}]},
 {c:"BSA",a:2024,tipo:"ascenso",t:"Las Brujas suben a Segunda",
  ctx:"Brujas de Salamanca asciende a Segunda y el pueblo del Choapa tiene, por primera vez, un club compitiendo en el profesionalismo. La distancia y el tamaño del pueblo son la primera pared que el club tiene que aprender a saltar.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si subimos, que sea para pelear, no para pasear."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del ascenso",d:"El Choapa no tiene margen para gastar de más."}]},
 {c:"RSJ",a:2021,tipo:"ascenso",t:"La Legua llega a Segunda",
  ctx:"Real San Joaquín asciende a Segunda y la escuela de fútbol de La Legua tiene, por primera vez, un equipo compitiendo en el profesionalismo. El barrio entero se sube al proyecto sabiendo que la categoría de arriba no regala nada.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si La Legua llegó, que sea para competir de verdad."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, un paso a la vez."},{t:"Guardar la plata del ascenso",d:"El barrio no tiene margen para gastar de más."}]},
 {c:"OVA",a:2023,tipo:"ascenso",t:"El Limarí llega al profesionalismo",
  ctx:"Provincial Ovalle ganó Tercera A y el valle del Limarí tiene, otra vez, un club compitiendo en el fútbol profesional. La ciudad que ya vivió ciclos de fútbol grande quiere que esta vuelta sea distinta.",
  op:[{t:"Reforzar para competir de igual a igual",d:"El Limarí ya vivió mejores días. Hay que ir a buscarlos."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, un paso a la vez."},{t:"Guardar la plata del ascenso",d:"El valle enseñó, a la mala, a no gastar de más."}]},
 {c:"TRA",a:2021,tipo:"ascenso",t:"Trasandino cruza a Segunda",
  ctx:"Trasandino asciende a Segunda y la ciudad de Los Andes, a los pies de la cordillera, tiene un club compitiendo en el profesionalismo. El desafío es sostener el salto sin que la novedad se apague en un año.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si cruzamos la cordillera, que sea para quedarnos."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del ascenso",d:"Los Andes no tiene margen para gastar de más."}]},
 {c:"REN",a:2015,tipo:"gloria",t:"Rengo se corona en la Copa Absoluta",
  ctx:"Deportes Rengo se queda con la Copa Absoluta ANFA después de golear a Real San Joaquín en la definición. Es el título más grande que el club amateur puede mostrar, y la pregunta es si esto alcanza para soñar con dar el salto al profesionalismo.",
  op:[{t:"Apostar por el profesionalismo",d:"Con un título así en la mano, hay que golpear la puerta de arriba."},{t:"Sostener la base que ganó",d:"Este equipo se ganó la copa junto. Que siga junto."},{t:"Cuidar la estructura amateur",d:"El profesionalismo cuesta plata que Rengo todavía no tiene."}]},
 {c:"LIN",a:1956,tipo:"origen",t:"Nace Deportes Linares",
  ctx:"En Linares se funda un club nuevo y todavía no hay casi nada construido: ni plantel armado, ni historia que contar, apenas una ciudad del Maule dispuesta a que esto empiece a existir. El Fiscal es, por ahora, más una promesa que una cancha llena.",
  op:[{t:"Soñar con el profesionalismo desde ya",d:"Si no apuntamos alto, ¿para qué fundamos un club?"},{t:"Construir de a poco, con la gente del Maule",d:"Primero raíces, después vitrina."},{t:"Asegurar que el club llegue a fin de año",d:"Lo primero es no desaparecer en marzo."}]},
 {c:"REC",a:2021,tipo:"ascenso",t:"Recoleta llega a la B",
  ctx:"Deportes Recoleta asciende a la Primera B y el barrio que siempre sostuvo al club en las buenas y en las malas tiene, por fin, un equipo compitiendo un poco más arriba. El estadio es chico, pero las ganas no.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si subimos, que sea para pelear, no para pasear."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del ascenso",d:"El barrio no tiene margen para gastar de más."}]},
 {c:"PMO",a:2025,tipo:"ascenso",t:"El Velero llega a la B",
  ctx:"Deportes Puerto Montt asciende a la Primera B y el sur lejano tiene, otra vez, un club compitiendo un poco más arriba. La lluvia de Chinquihue y la distancia con la capital son la primera pared que hay que aprender a remontar.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si el Velero navega, que sea para pelear arriba."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del ascenso",d:"El sur lejano no tiene margen para gastar de más."}]},
 {c:"SMA",a:2014,tipo:"ascenso",t:"Arica juega en honor",
  ctx:"San Marcos de Arica compite en Primera y la ciudad más al norte de Chile usa la distancia con Santiago como arma en vez de excusa. El Dittborn se llena para ver a un club que sabe que nadie le va a regalar nada.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si vamos a estar arriba, que se note en la cancha."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del club",d:"El extremo norte enseña a no gastar lo que no hay."}]},
 {c:"COP",a:2023,tipo:"ascenso",t:"Copiapó llega a honor",
  ctx:"Deportes Copiapó juega en Primera y Atacama deja de ser apenas una postal turística para el resto del país: ahora es un club compitiendo en serio. La región minera quiere ver que esto no es un capricho de un año.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si Atacama llegó arriba, que se note en la cancha."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del club",d:"El desierto enseña a no gastar lo que todavía no llegó."}]},
 {c:"SCR",a:2019,tipo:"ascenso",t:"Santa Cruz se afirma en la B",
  ctx:"Deportes Santa Cruz se consolida en la Primera B profesional y el pueblo quiere que el club sea representación real, no una vitrina de paso para jugadores que después se van a otro lado. El desafío es sostener eso con los pies en la tierra.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si nos afirmamos, que sea peleando, no sobreviviendo."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del pueblo",d:"Santa Cruz no tiene margen para gastar de más."}]},
 {c:"RAN",a:1969,tipo:"gloria",t:"El subcampeonato que Talca no olvida",
  ctx:"Rangers de Talca es subcampeón de Chile y la provincia entera se siente, por una vez, protagonista del fútbol nacional. El club maulino tiene que decidir si esto es apenas un año suelto o el principio de algo que se puede sostener.",
  op:[{t:"Reforzar para ir por el título",d:"Estuvimos a un paso. Vale la pena ir por más."},{t:"Sostener el plantel subcampeón",d:"Este grupo le dio a Talca su mejor año. Se cuida."},{t:"Ordenar la caja provincial",d:"Talca no tiene la billetera de Santiago. Hay que ser realistas."}]},
 {c:"SLQ",a:2015,tipo:"ascenso",t:"San Luis juega en honor",
  ctx:"San Luis de Quillota compite en Primera y el pueblo del Aconcagua tiene, otra vez, un club representándolo arriba. El Lucio Fariña se llena para ver a un equipo que sabe que la categoría no perdona a los distraídos.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si vamos a estar arriba, que sea peleando de verdad."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del club",d:"El Aconcagua enseña a no gastar lo que no hay."}]},
 {c:"DYJ",a:2020,tipo:"gloria",t:"El Halcón se corona en América",
  ctx:"Defensa y Justicia gana la Copa Sudamericana y se convierte, de golpe, en el club chico que le ganó una copa internacional a nombres mucho más grandes. En Florencio Varela nadie sabe bien qué se hace con semejante vitrina.",
  op:[{t:"Reforzar para ir por más copas",d:"Si el Halcón puede volar en América, que siga volando."},{t:"Sostener al plantel campeón",d:"Este grupo hizo historia continental. Se cuida entero."},{t:"Vender arriba y capitalizar",d:"Un club chico que gana una copa tiene que saber cobrarla."}]},
 {c:"ARG",a:1985,tipo:"gloria",t:"La Paternal es campeona de América",
  ctx:"Argentinos Juniors se corona campeón de América y el barrio de La Paternal vive la noche más grande de su historia. El club que siempre formó y vendió jugadores tiene, por una vez, la chance de pelear arriba con nombre propio.",
  op:[{t:"Reforzar para ir por más títulos",d:"Ser campeón de América no se repite fácil. Hay que aprovecharlo."},{t:"Sostener al plantel campeón",d:"Este grupo le dio al club su noche más grande. Se cuida."},{t:"Vender y capitalizar el título",d:"La Paternal siempre vivió de formar y vender. No hay que traicionar el modelo."}]},
 {c:"LAN",a:2013,tipo:"gloria",t:"El Granate se corona en Sudamericana",
  ctx:"Lanús gana la Copa Sudamericana y el barrio de Villa Diamante festeja el título internacional más importante de su historia. El club que siempre vivió entre la formación y la venta tiene que decidir qué hacer con este envión.",
  op:[{t:"Reforzar para ir por más",d:"El Granate está arriba. Hay que sostenerlo con refuerzos."},{t:"Sostener al plantel campeón",d:"Este grupo le dio la copa al club. Se cuida entero."},{t:"Vender y reinvertir en cantera",d:"El modelo del Granate es formar y vender. Hay que ser consecuentes."}]},
 {c:"NEW",a:1974,tipo:"gloria",t:"La Lepra se corona en el 74",
  ctx:"Newell's Old Boys es campeón del Nacional y Rosario tiene, por un rato, a la Lepra por encima de todos. El club tiene que decidir cómo se sostiene un título en una ciudad que también le presta atención al clásico de la vereda de enfrente.",
  op:[{t:"Reforzar para defender el título",d:"Un campeón se defiende, no se administra desde afuera."},{t:"Sostener al plantel campeón",d:"Este grupo le dio el título a la Lepra. Se cuida entero."},{t:"Vender y ordenar las cuentas",d:"Rosario también vive de vender bien en el momento justo."}]},
 {c:"ROS",a:1987,tipo:"gloria",t:"Arroyito se pone la corona",
  ctx:"Rosario Central es campeón y Arroyito vive una fiesta que va a quedar en la memoria de la ciudad. El clásico de siempre queda, por esta vez, del lado canalla, y el club tiene que decidir cómo se sostiene esa diferencia.",
  op:[{t:"Reforzar para ir por más",d:"Cuando Arroyito está arriba, hay que quedarse ahí."},{t:"Sostener al plantel campeón",d:"Este grupo le dio el título al club. Se cuida entero."},{t:"Vender y capitalizar el momento",d:"El título ya está. Ahora hay que asegurar el club."}]},
 {c:"HUR",a:1973,tipo:"gloria",t:"El Huracán de Menotti se corona",
  ctx:"Huracán es campeón del Metropolitano con una idea de juego que va a quedar en la memoria de Parque Patricios. El club chico que siempre convivió con los grandes de Buenos Aires tiene, por una vez, la vitrina más linda de todas.",
  op:[{t:"Reforzar para sostener la idea",d:"Un equipo así no se arma todos los años. Hay que cuidarlo."},{t:"Sostener al plantel campeón",d:"Este grupo jugó como nadie y ganó. Se cuida entero."},{t:"Vender y ordenar la caja",d:"Huracán siempre vivió con las cuentas ajustadas. Hay que ser realistas."}]},
 {c:"BAN",a:2009,tipo:"gloria",t:"El Taladro perfora la historia",
  ctx:"Banfield es campeón por primera vez en su historia y todo el sur del Gran Buenos Aires festeja como nunca. El Taladro tiene que decidir cómo administra un título que nadie en el club vio venir.",
  op:[{t:"Reforzar para ir por más",d:"El Taladro nunca había llegado tan arriba. Hay que seguir perforando."},{t:"Sostener al plantel campeón",d:"Este grupo le dio al club su primer título. Se cuida entero."},{t:"Vender y capitalizar la historia",d:"Un club como Banfield vive de saber vender en el momento justo."}]},
 {c:"BEL",a:2022,tipo:"ascenso",t:"El Pirata vuelve a Primera",
  ctx:"Belgrano asciende a Primera y todo el Alberdi cordobés vuelve a soñar en grande después de un tiempo afuera. El Pirata tiene plantel y presupuesto para no conformarse con sobrevivir la categoría.",
  op:[{t:"Reforzar para pelear arriba",d:"El Pirata no vuelve a Primera para hacer bulto."},{t:"Afirmar la categoría con lo nuestro",d:"Primero quedarse. Después se habla de otra cosa."},{t:"Guardar la plata del ascenso",d:"Córdoba también sabe lo que cuesta volver a bajar endeudado."}]},
 {c:"GME",a:2025,tipo:"ascenso",t:"Gimnasia de Mendoza llega a Primera",
  ctx:"Gimnasia de Mendoza consigue el ascenso a la Liga Profesional por tabla, un logro que se construyó a lo largo de toda la temporada. El club cuyano tiene que decidir con qué equipo se presenta en la categoría más exigente del país.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si llegamos arriba, que sea para pelear."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, un paso a la vez."},{t:"Guardar la plata del ascenso",d:"Mendoza no tiene margen para gastar de más el primer año."}]},
 {c:"ERC",a:2025,tipo:"ascenso",t:"Río Cuarto llega a Primera",
  ctx:"Estudiantes de Río Cuarto asciende a Primera y el interior profundo de Córdoba tiene un club compitiendo en la máxima categoría. La distancia con Buenos Aires es la primera adversidad que el club tiene que aprender a manejar.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si el interior llegó arriba, que se note en la cancha."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del ascenso",d:"El interior enseña a no gastar lo que no hay."}]},
 {c:"GLP",a:1929,tipo:"gloria",t:"El Lobo se corona en el amateurismo",
  ctx:"Gimnasia La Plata es campeón en una de las últimas temporadas grandes del fútbol amateur argentino. El Lobo platense tiene la vitrina más importante de su historia hasta ese momento, justo cuando el fútbol del país está por cambiar para siempre.",
  op:[{t:"Reforzar para sostener el nivel",d:"El Lobo está arriba. Hay que quedarse ahí."},{t:"Sostener al plantel campeón",d:"Este grupo le dio al club su año más grande. Se cuida."},{t:"Ordenar la institución",d:"El fútbol está por cambiar. Mejor llegar preparados."}]},
 {c:"TAL",a:2016,tipo:"ascenso",t:"Talleres vuelve y se afirma",
  ctx:"Talleres de Córdoba está de regreso en Primera y esta vez el club parece decidido a no ser un visitante de paso. Barrio Jardín quiere que esta vuelta sea el principio de algo más grande.",
  op:[{t:"Reforzar para pelear arriba",d:"Si volvimos, que sea para instalarnos, no para pasear."},{t:"Afirmar la categoría con lo nuestro",d:"Primero consolidarse. El resto viene después."},{t:"Guardar la plata del ascenso",d:"Volver a bajar endeudado sería el peor de los escenarios."}]},
 {c:"TUC",a:2009,tipo:"ascenso",t:"El Decano llega a Primera",
  ctx:"Atlético Tucumán asciende a Primera y todo el norte argentino tiene, otra vez, representación en la máxima categoría. La distancia con Buenos Aires pesa tanto como las ganas de no volver a bajar.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si el norte llegó arriba, que se note en la cancha."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del ascenso",d:"El norte enseña a no gastar lo que todavía no llegó."}]},
 {c:"RIE",a:2024,tipo:"ascenso",t:"Riestra se afirma en Primera",
  ctx:"Deportivo Riestra se consolida en Primera siendo, de lejos, el club más chico de la categoría: apenas unos miles de socios sostienen a un equipo que compite contra presupuestos gigantes. Villa Soldati quiere que esto no sea un espejismo.",
  op:[{t:"Reforzar para pelear arriba",d:"Si aguantamos hasta acá, hay que ir por más."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del club",d:"Riestra vive de la prudencia. No hay margen para otra cosa."}]},
 {c:"INS",a:2022,tipo:"ascenso",t:"La Gloria vuelve a Primera",
  ctx:"Instituto asciende a Primera y Córdoba tiene un club más compitiendo en la máxima categoría, apoyado en su cantera de siempre. El desafío es competir sin perder la identidad formadora que lo caracteriza.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si La Gloria volvió, que sea para pelear en serio."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, confiar en la cantera."},{t:"Guardar la plata del ascenso",d:"Instituto vive de formar. No hay que traicionar el modelo por apuro."}]},
 {c:"UNI",a:2019,tipo:"gloria",t:"El Tatengue incomoda en copa",
  ctx:"Unión de Santa Fe está teniendo un año de copa donde incomoda a cualquiera que se le cruce enfrente. El Tatengue nunca fue de los grandes nombres del continente, pero esta vez nadie lo quiere de rival.",
  op:[{t:"Reforzar para ir más lejos",d:"Si incomodamos así, hay que ir a buscar algo grande."},{t:"Sostener el equipo actual",d:"Este grupo está jugando su mejor fútbol. No hay que tocarlo."},{t:"Vender y ordenar la caja",d:"Santa Fe también vive de saber capitalizar los buenos años."}]},
 {c:"TIG",a:2019,tipo:"gloria",t:"Tigre se corona en la Superliga",
  ctx:"Tigre gana la Copa de la Superliga y Victoria tiene, por primera vez, un título de peso en la vitrina del club. La pregunta que recorre las oficinas es si este título alcanza para pensar en algo más grande.",
  op:[{t:"Reforzar para ir por más",d:"El título ya está. Ahora hay que ir por otro."},{t:"Sostener al plantel campeón",d:"Este grupo le dio a Tigre su copa más grande. Se cuida."},{t:"Vender y capitalizar el título",d:"Tigre siempre vivió de saber vender en el momento justo."}]},
 {c:"PLA",a:2021,tipo:"ascenso",t:"El Calamar vuelve después de 22 años",
  ctx:"Platense asciende a Primera después de 22 años de espera, y Vicente López tiene de vuelta a su club en la máxima categoría. Una generación entera de hinchas nunca había visto al Calamar jugar arriba.",
  op:[{t:"Reforzar para pelear arriba",d:"22 años de espera se merecen algo más que sobrevivir."},{t:"Afirmar la categoría con lo nuestro",d:"Primero quedarse. Después se sueña con otra cosa."},{t:"Guardar la plata del ascenso",d:"Volver a bajar después de 22 años sería demasiado doloroso."}]},
 {c:"CCO",a:2019,tipo:"ascenso",t:"Central Córdoba llega a Primera",
  ctx:"Central Córdoba de Santiago del Estero debuta en Primera y el interior del país tiene un club más compitiendo en la máxima categoría. El desafío es no perderse entre nombres mucho más grandes.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si llegamos arriba, que sea para pelear."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del ascenso",d:"El interior enseña a no gastar lo que no hay."}]},
 {c:"IRV",a:2023,tipo:"ascenso",t:"La Lepra mendocina vuelve a Primera",
  ctx:"Independiente Rivadavia asciende a Primera y Mendoza tiene, otra vez, dos clubes grandes compitiendo en la máxima categoría. La Lepra quiere demostrar que este ascenso no es solo para hacer número.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si volvimos arriba, que sea para pelear en serio."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del ascenso",d:"Mendoza enseña a no gastar lo que todavía no llegó."}]},
 {c:"SAR",a:2021,tipo:"ascenso",t:"El Verde se afirma en Primera",
  ctx:"Sarmiento de Junín se consolida en Primera después de un tiempo de idas y vueltas entre categorías. La ciudad bonaerense quiere que esta vez el club se quede arriba en serio, sin sustos de último momento.",
  op:[{t:"Reforzar para pelear arriba",d:"Si nos afirmamos, que sea para algo más que sobrevivir."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del club",d:"Junín ya vivió sustos de bajar. Mejor no arriesgar de más."}]},
 {c:"ALD",a:2015,tipo:"ascenso",t:"El Tiburón nada en Primera",
  ctx:"Aldosivi compite en Primera y Mar del Plata tiene, otra vez, representación en la máxima categoría, lejos del glamour porteño y cerca de la playa. El club sabe que la temporada de verano no dura para siempre.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si el Tiburón está arriba, que se note en la cancha."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del club",d:"La costa enseña a no gastar lo que no hay fuera de temporada."}]},
 {c:"BAR",a:2022,tipo:"ascenso",t:"El Guapo llega a Primera",
  ctx:"Barracas Central asciende a Primera y La Ribera tiene un club más compitiendo en la máxima categoría del fútbol argentino. El club más joven de la zona sur porteña sabe que el debut no perdona a los distraídos.",
  op:[{t:"Reforzar para competir de igual a igual",d:"Si El Guapo llegó arriba, que sea para pelear."},{t:"Afirmar la categoría con lo nuestro",d:"Plantel corto, cabeza clara, permanencia primero."},{t:"Guardar la plata del ascenso",d:"La Ribera enseña a no gastar lo que todavía no llegó."}]}
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
