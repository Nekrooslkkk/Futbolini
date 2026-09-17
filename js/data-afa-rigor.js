"use strict";
/* ============================================================
   FUTBOLINI · data-afa-rigor.js  (Claude · cierre de rigor AFA)
   Cada club argentino al listón Colo-Colo: una DECISIÓN PROPIA 2026 por club
   (26 cartas: los 23 que vivían de la bolsa genérica + Vélez/San Lorenzo/Estudiantes,
   que solo tenían la de su año de gloria), anclada en hechos ESTABLES y
   reales (estadio, barrio, identidad — los mismos datos que verificó Grok
   en LIGA_ARG_2026 / SITUACION_CLUB). Ficción de dirigencia sobre anclas
   reales: cero citas o hechos inventados como reales.

   Reusa los helpers de Grok (_d801/_o801) si están; si no, un builder mínimo
   local con la MISMA forma (sin duplicar su contenido). Registro idéntico:
   push a DECISIONES si el id no existe.

   Cargar DESPUÉS de data-rigor-801.js (de donde toma _d801/_o801).
   Coordinado en GROK_CAZA.md. NO toca ningún archivo de Grok.
   ============================================================ */

/* builder: usa el de Grok si existe (DRY); si no, uno equivalente mínimo */
var _oAfa = (typeof _o801==="function") ? _o801 : function(t,d,dif,g,b,m,w,x){
  x=x||{};
  return {t:t,d:d||"",dif:dif==null?45:dif,grupos:g||{},
    bien:{txt:b,ef:x.be||{}},
    mitad:{txt:m||b,ef:x.me||{}},
    mal:{txt:w,ef:x.we||{},grupos:x.wg||{}}};
};
var _dAfa = (typeof _d801==="function") ? _d801 : function(id,club,anio,buzon,peso,mes,t,d,ops,extra){
  var x={id:id,club:club,anio:anio,buzon:buzon,peso:peso||"medio",mes:mes||3,t:t,d:d,op:ops};
  if(extra) Object.keys(extra).forEach(function(k){ x[k]=extra[k]; });
  return x;
};

const DECISIONES_AFA=[
/* ROSARIO CENTRAL · Gigante de Arroyito · el clásico manda */
_dAfa("ros26_clasico","ROS",2026,"hinchada","alto",4,
  "Semana de clásico en Arroyito",
  "Se viene Newell's. En Rosario esa semana no se trabaja de otra cosa: la ciudad se parte al medio y el Gigante quiere sangre. La barra pide un banderazo caro; el plantel necesita concentrarse, no rodearse de circo.",
  [
    _oAfa("Bancar el banderazo","La gente al frente.",40,{hinchada:12,comunidad:6,directorio:-5},
      "Arroyito arde de fondo canalla. Los jugadores lo sienten en las piernas.",
      "Show lindo, un par de incidentes menores. Nada grave.",
      "Se prende una bengala de más y la fecha te llega con multa.",
      {be:{moral:5},we:{plata:-40}}),
    _oAfa("Concentrar y blindar","Menos ruido, más fútbol.",44,{tecnico:8,directorio:6,hinchada:-8},
      "El grupo llega enchufado y sin distracciones. La barra putea, pero el equipo responde.",
      "Semana tranquila. La previa quedó fría.",
      "La hinchada lo lee como desprecio y el clásico se juega con el estadio a media máquina.",
      {be:{moral:4}}) ]),

/* TALLERES · Kempes · ambición de grande del interior */
_dAfa("tal26_interior","TAL",2026,"institucional","alto",3,
  "La T quiere sentarse en la mesa grande",
  "Talleres dejó de ser sorpresa: en el Kempes se pide pelear arriba de igual a igual con los cinco grandes de Buenos Aires. Eso cuesta plata y paciencia. El directorio duda entre apostar fuerte ahora o crecer sin endeudarse.",
  [
    _oAfa("Apostar a competir ya","Refuerzo de jerarquía.",52,{directorio:8,hinchada:10,sponsors:6},
      "Cae un nombre que en Córdoba ilusiona. La vara sube y ya no hay excusas.",
      "Llega un refuerzo correcto, no el bombazo. Alcanza para ilusionarse.",
      "El fichaje no rinde y la deuda quedó igual. El interior otra vez espera.",
      {be:{prestigio:6},we:{deuda:120,plata:-80}}),
    _oAfa("Crecer sin hipotecarse","Paso a paso.",34,{directorio:10,socios:6,hinchada:-6},
      "Las cuentas quedan sanas y la base se sostiene. Córdoba refunfuña pero entiende.",
      "Temporada de transición ordenada.",
      "La cautela se lee como falta de ambición y algún crack pide salir.",
      {be:{capital:4}}) ]),

/* HURACÁN · Ducó · Parque Patricios */
_dAfa("hur26_duco","HUR",2026,"institucional","medio",5,
  "El Ducó pide plata",
  "El Tomás A. Ducó es historia viva de Parque Patricios, pero la historia tiene goteras. Hay que elegir entre poner plata en el estadio o en el plantel, y en Huracán las dos cosas son urgentes.",
  [
    _oAfa("Arreglar la casa","El Ducó primero.",42,{comunidad:10,socios:8,tecnico:-6},
      "El estadio recupera dignidad y el socio lo agradece en la boletería.",
      "Se tapan las goteras más urgentes. El resto, para el año que viene.",
      "La obra se estira, cuesta más de lo previsto y el plantel quedó flaco.",
      {be:{estadio:6},we:{plata:-60}}),
    _oAfa("Reforzar el equipo","La tabla no espera.",46,{tecnico:8,hinchada:8,comunidad:-6},
      "El Globo suma piezas y respira en la tabla. El Ducó aguanta un poco más.",
      "Un refuerzo puntual. Se emparcha lo deportivo.",
      "El estadio empeora y una tribuna queda clausurada. Mal momento.",
      {we:{estadio:-6}}) ]),

/* LANÚS · el Granate · continental */
_dAfa("lan26_continental","LAN",2026,"institucional","medio",6,
  "Sudamericana o liga",
  "Lanús se ordena y otra vez huele a copa. Pero el calendario aprieta: priorizar la Sudamericana puede costar puntos en el torneo, y el sur del Gran Buenos Aires no perdona quedarse sin nada.",
  [
    _oAfa("Ir por la copa","La vitrina internacional.",50,{hinchada:10,sponsors:8,directorio:-4},
      "El Granate se enchufa con la copa y sueña de verdad. El torneo pasa a segundo plano.",
      "Se prioriza la copa a medias. Ni fu ni fa.",
      "Te quedás afuera de la copa Y perdés terreno en la liga. Lo peor de los dos mundos.",
      {be:{prestigio:6},we:{moral:-6}}),
    _oAfa("Priorizar la liga","Lo seguro primero.",40,{directorio:8,tecnico:6,hinchada:-6},
      "El equipo suma de a tres y se afirma. La copa se juega con los pibes.",
      "Campaña sólida en el torneo, copa secundaria.",
      "Ni la liga ni la copa: la mesura salió cara.",
      {}) ]),

/* ARGENTINOS JRS · La Paternal · cuna de Maradona · cantera */
_dAfa("arg26_cantera","ARG",2026,"cantera","alto",7,
  "Otra joya de La Paternal en la vidriera",
  "Argentinos es fábrica: en el semillero de La Paternal siempre hay un pibe que Europa mira. Llega una oferta grande por la última joya. Vender sostiene el club; retener alimenta el sueño de una campaña.",
  [
    _oAfa("Vender y reinvertir","Es el modelo.",30,{directorio:10,socios:8,hinchada:-10},
      "Entra una cifra que ordena las cuentas por dos años. En el barrio duele, pero es el ADN.",
      "Se vende bien y se reinvierte a medias.",
      "Se vende barato por apuro y el pibe explota afuera. Clásico y doloroso.",
      {be:{plata:200,capital:5},we:{plata:120}}),
    _oAfa("Retenerlo un semestre","Bancarse el sueño.",48,{hinchada:12,tecnico:8,directorio:-8},
      "La Paternal estalla: el pibe se queda y tira del equipo. Media temporada de ilusión.",
      "Se queda, rinde a ratos. La oferta quizá vuelva.",
      "Se lesiona o baja su valor y la próxima oferta es la mitad.",
      {be:{moral:6}}) ]),

/* NEWELL'S · La Lepra · Parque Independencia · escuela de DT */
_dAfa("new26_escuela","NEW",2026,"institucional","medio",4,
  "La sombra de la escuela rosarina",
  "En Newell's todo entrenador carga con el fantasma de Bielsa y la idea de la casa: jugar bien y de abajo. Aparece un técnico pragmático que asegura puntos pero no seduce. La Lepra debate entre resultado e identidad.",
  [
    _oAfa("Sostener la idea de la casa","Escuela antes que atajo.",46,{hinchada:12,cantera:8,directorio:-6},
      "El Parque se identifica y los pibes tienen lugar. El proceso convence.",
      "Se mantiene el estilo con altibajos.",
      "El romanticismo cuesta puntos y la paciencia se agota rápido.",
      {be:{cantera:6}}),
    _oAfa("Pragmatismo y resultados","Puntos ya.",42,{directorio:8,tecnico:6,hinchada:-8},
      "El equipo suma y se acomoda. La tribuna aplaude el resultado aunque extrañe el juego.",
      "Resultados grises, identidad diluida.",
      "Ni juego ni puntos: lo peor para una hinchada exigente.",
      {}) ]),

/* BELGRANO · el Pirata · Córdoba */
_dAfa("bel26_pirata","BEL",2026,"hinchada","alto",8,
  "El Pirata quiere su clásico",
  "Belgrano vive para el clásico cordobés con Talleres. La hinchada del Gigante de Alberdi pide que el club se plante como el más grande de Córdoba, con todo lo que eso implica de gasto y de presión.",
  [
    _oAfa("Plantarse como el más grande","Barrio Alberdi de pie.",50,{hinchada:14,comunidad:8,directorio:-6},
      "El Pirata se para de manos y la ciudad lo nota. La previa es una fiesta celeste.",
      "Se hace ruido, se compite. El clásico queda abierto.",
      "La ambición no se sostiene con la caja y el golpe con Talleres duele el doble.",
      {be:{prestigio:6},we:{moral:-6}}),
    _oAfa("Pies en la tierra","Sin agrandarse.",36,{directorio:8,socios:6,hinchada:-8},
      "Cuentas sanas, expectativas medidas. Alberdi refunfuña.",
      "Temporada correcta, clásico con humildad.",
      "La mesura enfría a la gente en la semana más caliente del año.",
      {}) ]),

/* DEFENSA Y JUSTICIA · el Halcón · Florencio Varela · club de copas */
_dAfa("dyj26_modelo","DYJ",2026,"refuerzos","medio",6,
  "El modelo Halcón bajo presión",
  "Defensa hizo de la nada un club de copas: comprar barato, potenciar, vender caro. Ahora llega una oferta por el goleador justo cuando el equipo ilusiona. Vender es el ADN; retener sería cambiar de piel.",
  [
    _oAfa("Vender y volver a empezar","El modelo, otra vez.",30,{directorio:10,socios:8,hinchada:-8},
      "Entra plata fuerte y el scouting ya trae al reemplazo. Varela confía en la máquina.",
      "Buena venta, reemplazo dudoso.",
      "Se vende y el reemplazo no aparece: el equipo se cae.",
      {be:{plata:180,capital:4},we:{moral:-6}}),
    _oAfa("Retener y jugarse la campaña","Por una vez, soñar.",50,{hinchada:12,tecnico:8,directorio:-10},
      "El Halcón mantiene el bloque y va por algo grande. El barrio lo abraza.",
      "Se lo banca a medias.",
      "La apuesta sale mal y encima el pase se enfría. Doble pérdida.",
      {be:{moral:6}}) ]),

/* INSTITUTO · La Gloria · Córdoba · cantera */
_dAfa("ins26_gloria","INS",2026,"cantera","medio",5,
  "La Gloria se aferra a su cantera",
  "Instituto se sostiene con lo que produce Alta Córdoba, no con marketing porteño. Un empresario ofrece plata a cambio de meter mano en las inferiores. Es tentador y es un riesgo para la identidad.",
  [
    _oAfa("Cuidar la cantera propia","Alta Córdoba manda.",44,{cantera:12,hinchada:8,sponsors:-6},
      "El semillero sigue siendo del club y la gente lo valora. Menos plata, más raíces.",
      "Se acepta ayuda acotada, sin ceder el control.",
      "El apuro por plata mete ruido y un juvenil clave se va enojado.",
      {be:{cantera:8}}),
    _oAfa("Aceptar el capital externo","Plata para crecer.",46,{sponsors:12,directorio:8,cantera:-8},
      "Entra inversión y llegan recursos que la Gloria no tenía. Alta Córdoba desconfía.",
      "Acuerdo tibio, algo de plata.",
      "El inversor manda más de lo pactado y la identidad se resiente.",
      {be:{plata:120},we:{capital:-4}}) ]),

/* UNIÓN · el Tatengue · Santa Fe */
_dAfa("uni26_interior","UNI",2026,"institucional","medio",4,
  "Santa Fe que incomoda",
  "Unión se hace fuerte en el 15 de Abril y le gusta ser el interior que le arruina la fiesta a los grandes. Pero sostener ese perfil competitivo lejos de Buenos Aires cuesta: viajes, arbitrajes cuesta arriba, plantel corto.",
  [
    _oAfa("Perfil competitivo y molesto","El Tatengue no se achica.",48,{hinchada:12,tecnico:8,directorio:-6},
      "Unión se planta y le complica la vida a cualquiera en el 15 de Abril.",
      "Compite de local, sufre de visita.",
      "El plantel corto se queda sin nafta a mitad de año.",
      {be:{moral:5},we:{moral:-6}}),
    _oAfa("Administrar y sobrevivir","Sin locuras.",34,{directorio:10,socios:6,hinchada:-6},
      "Cuentas ordenadas, objetivos medidos. Santa Fe quiere más, pero aguanta.",
      "Temporada gris y prolija.",
      "La resignación se contagia y la localía pierde peso.",
      {}) ]),

/* GIMNASIA (LP) · el Lobo · El Bosque · 1887 */
_dAfa("glp26_bosque","GLP",2026,"hinchada","alto",5,
  "El Bosque, patrimonio del Lobo",
  "Gimnasia es de 1887 y su cancha en El Bosque es identidad pura. Hay presión para modernizarla o incluso mudarse por seguridad, y la hinchada más fiel del país no quiere ni escuchar la palabra 'mudanza'.",
  [
    _oAfa("Modernizar sin mover el alma","El Bosque se queda.",46,{hinchada:14,comunidad:8,directorio:-6},
      "Se remoza el estadio sin traicionar la mística. La gente lo festeja como un triunfo.",
      "Mejoras parciales, la mudanza queda descartada.",
      "La obra se traba y la cancha queda a medio hacer, con capacidad reducida.",
      {be:{estadio:6,moral:4},we:{estadio:-4}}),
    _oAfa("Escuchar la oferta de mudanza","Frío pero rentable.",52,{sponsors:10,directorio:8,hinchada:-16},
      "En los papeles cierra. En la calle es una declaración de guerra con el hincha.",
      "Se estudia sin decidir. Igual hay malestar.",
      "La sola idea incendia a la hinchada y estalla el conflicto.",
      {wg:{hinchada:-12}}) ]),

/* ATLÉTICO TUCUMÁN · el Decano del norte · el viaje */
_dAfa("tuc26_viaje","TUC",2026,"preparacion","medio",6,
  "El norte y sus 1.200 kilómetros",
  "Ser de Tucumán se paga en horas de micro y de avión. El Decano puede hacer del viaje un arma —localía brava, rival cansado— o que el desgaste se lo coma a él. La logística de la temporada se define ahora.",
  [
    _oAfa("Convertir la distancia en fortaleza","Que sufran ellos.",44,{tecnico:10,comunidad:8,directorio:-4},
      "El Monumental de Tucumán se vuelve una pesadilla para el que baja del avión.",
      "La localía pesa, la visita cuesta.",
      "El plan de viajes falla y el desgaste te golpea a vos primero.",
      {be:{moral:5},we:{moral:-6}}),
    _oAfa("Invertir en logística","Menos micro, más avión.",40,{tecnico:8,directorio:-6,socios:-4},
      "El plantel llega descansado a todos lados. Cuesta plata, rinde en piernas.",
      "Mejora parcial en los viajes.",
      "El gasto extra no se nota en la cancha y el balance queda tocado.",
      {we:{plata:-50}}) ]),

/* TIGRE · el Matador · Victoria */
_dAfa("tig26_yoyo","TIG",2026,"institucional","alto",7,
  "Cortar el yo-yo de una vez",
  "Tigre sube y baja, sube y baja. En Victoria están cansados del ascensor. Se puede armar un plantel para pelear tranquilo la permanencia o arriesgar por una campaña que ilusione, sabiendo que caer otra vez sería durísimo.",
  [
    _oAfa("Asegurar la categoría","Nada de aventuras.",38,{directorio:10,socios:8,hinchada:-6},
      "El Matador arma un equipo sólido para no sufrir. Aburrido, pero a salvo.",
      "Permanencia trabajada sin sobresaltos.",
      "El cálculo falla y hasta lo seguro se complica.",
      {be:{capital:4}}),
    _oAfa("Ilusionar a Victoria","Soñar con algo más.",50,{hinchada:12,tecnico:6,directorio:-8},
      "Tigre se anima y la gente vuelve a Victoria con expectativa.",
      "Campaña irregular con destellos.",
      "La apuesta sale mal y el fantasma del descenso vuelve.",
      {we:{moral:-6}}) ]),

/* BANFIELD · el Taladro · Florencio Sola · cantera */
_dAfa("ban26_taladro","BAN",2026,"cantera","medio",5,
  "El Taladro y su fábrica de juveniles",
  "Banfield es cantera y bandera del sur. La Sola siempre tiene un pibe listo para debutar, pero el cuerpo técnico duda entre tirarlos a la pileta ya o esperar a que maduren para no quemarlos.",
  [
    _oAfa("Tirar a los pibes a la cancha","La Sola quiere verlos.",42,{cantera:12,hinchada:8,tecnico:-4},
      "Debutan dos juveniles y el sur se ilusiona. El futuro es hoy.",
      "Un pibe se afirma, otro necesita más horno.",
      "Se los expone antes de tiempo y un error los golpea la confianza.",
      {be:{cantera:8}}),
    _oAfa("Cocinarlos con paciencia","Sin apuro.",40,{tecnico:8,directorio:6,cantera:-4},
      "Los juveniles maduran de a poco, sin presión. El Taladro juega con oficio.",
      "Desarrollo prudente.",
      "La paciencia aburre y algún talento pide minutos afuera.",
      {}) ]),

/* PLATENSE · el Calamar · Vicente López */
_dAfa("pla26_permanencia","PLA",2026,"institucional","medio",6,
  "El Calamar, con los pies en Primera",
  "Platense volvió a la elite y en Vicente López lo saben: cada año en Primera es una pequeña hazaña. La discusión es si gastar la caja en asegurar la permanencia o guardarla para cuando venga la mala.",
  [
    _oAfa("Gastar en la permanencia","Ahora es ahora.",44,{tecnico:8,hinchada:10,directorio:-6},
      "El plantel se refuerza y el Calamar respira en la tabla.",
      "Un par de caras nuevas, permanencia trabajada.",
      "Se gasta la caja y ni así alcanza: temporada al límite.",
      {be:{moral:5},we:{plata:-70}}),
    _oAfa("Guardar para la tormenta","Colchón por las dudas.",34,{directorio:10,socios:8,hinchada:-8},
      "La caja queda blindada para el futuro. La hinchada teme que sea poca ambición.",
      "Prudencia financiera, plantel justo.",
      "El plantel corto sufre y el colchón se usa igual, en pánico.",
      {be:{capital:4}}) ]),

/* CENTRAL CÓRDOBA (SdE) · Santiago del Estero · Madre de Ciudades */
_dAfa("cco26_norte","CCO",2026,"institucional","medio",5,
  "Santiago del Estero en la mesa grande",
  "Central Córdoba metió al norte profundo en Primera y estrena un estadio moderno, el Madre de Ciudades. La pregunta es cómo aprovecharlo: convertirlo en fortín ferroviario o alquilarlo para eventos y sumar caja.",
  [
    _oAfa("Fortín ferroviario","La cancha es del hincha.",42,{hinchada:12,comunidad:8,sponsors:-4},
      "El Madre de Ciudades se llena de gente del club y se hace respetar.",
      "Localía sólida, algún evento suelto.",
      "El fervor no alcanza para llenarlo y se ve medio vacío por TV.",
      {be:{estadio:5,moral:4}}),
    _oAfa("Alquilarlo para eventos","Que la cancha rinda plata.",40,{sponsors:12,directorio:8,hinchada:-6},
      "Recitales y partidos de selección dejan caja fresca. El hincha lo siente menos suyo.",
      "Algún evento, algo de plata.",
      "Tanto uso ajeno deja el campo de juego en mal estado.",
      {be:{plata:90},we:{estadio:-5}}) ]),

/* INDEPENDIENTE RIVADAVIA · la Lepra mendocina · Cuyo en Primera */
_dAfa("irv26_cuyo","IRV",2026,"hinchada","medio",6,
  "Cuyo quiere quedarse en Primera",
  "Independiente Rivadavia subió y Mendoza entera empujó. Mantenerse es la obsesión. La Lepra mendocina puede jugarse a un plantel regional con identidad o traer nombres de Buenos Aires que aseguren categoría.",
  [
    _oAfa("Identidad regional","Con los nuestros.",46,{hinchada:12,cantera:8,directorio:-4},
      "El Gargantini abraza a un equipo con sabor mendocino. Orgullo cuyano.",
      "Mezcla justa de regionales y algún refuerzo.",
      "Le falta jerarquía y el sueño de la permanencia se complica.",
      {be:{cantera:6}}),
    _oAfa("Jerarquía porteña","Nombres para no sufrir.",44,{tecnico:10,directorio:6,hinchada:-6},
      "Llegan futbolistas de recorrido que dan resto en la tabla.",
      "Un refuerzo de peso, el resto local.",
      "Los de afuera no se adaptan al Cuyo y el vestuario se parte.",
      {we:{moral:-6}}) ]),

/* SARMIENTO (Junín) · el Verde */
_dAfa("sar26_pueblo","SAR",2026,"finanzas","medio",5,
  "Junín, con lo justo",
  "Sarmiento es club de pueblo del interior bonaerense: caja chica, hinchada fiel, cada peso pesa. Se puede estirar el presupuesto para reforzar o cuidar cada centavo y confiar en el sentido de pertenencia.",
  [
    _oAfa("Estirar el presupuesto","Un esfuerzo grande.",48,{tecnico:8,hinchada:8,directorio:-8},
      "El Verde suma un par de piezas que en Junín ilusionan.",
      "Refuerzo puntual dentro de lo posible.",
      "El esfuerzo desequilibra la caja y aparece la tensión financiera.",
      {be:{moral:4},we:{deuda:90}}),
    _oAfa("Cuidar cada peso","Pertenencia antes que plata.",34,{directorio:10,socios:8,hinchada:-6},
      "Cuentas sanas y un equipo de sentido de pertenencia. Modesto pero de pie.",
      "Prudencia y plantel corto.",
      "La falta de refuerzos se nota y la fidelidad no alcanza en la cancha.",
      {be:{capital:4}}) ]),

/* ALDOSIVI · el Tiburón · Mar del Plata · verano */
_dAfa("ald26_verano","ALD",2026,"finanzas","medio",1,
  "El verano marplatense como negocio",
  "Aldosivi vive en una ciudad que se llena en verano y se vacía en invierno. El Tiburón puede montar amistosos y eventos de temporada alta para hacer caja, o concentrarse solo en lo deportivo y no distraerse.",
  [
    _oAfa("Aprovechar la temporada alta","Mar del Plata llena.",42,{sponsors:12,comunidad:8,tecnico:-4},
      "Amistosos de verano con estadio lleno de turistas: entra plata fresca.",
      "Un par de eventos, caja moderada.",
      "El circo veraniego distrae al plantel y arranca frío el torneo.",
      {be:{plata:90},we:{moral:-4}}),
    _oAfa("Foco deportivo","Nada de circo.",40,{tecnico:10,directorio:6,sponsors:-6},
      "El Tiburón arranca enchufado, sin distracciones de temporada.",
      "Pretemporada seria, algo de caja resignada.",
      "Se deja pasar el negocio del verano y la caja lo extraña después.",
      {}) ]),

/* GIMNASIA (Mza) · el Lobo mendocino · recién llegado */
_dAfa("gme26_debut","GME",2026,"institucional","alto",3,
  "Primer año del Lobo mendocino en la elite",
  "Gimnasia de Mendoza llegó por primera vez a la Liga Profesional y todo es nuevo: estructura, exigencias, rivales de otro peso. La prioridad number uno es sobrevivir sin perder la esencia que los trajo hasta acá.",
  [
    _oAfa("Sostener la base del ascenso","Los que subieron se quedan.",44,{hinchada:12,cantera:6,directorio:-4},
      "El grupo del ascenso se mantiene y el mendocino se identifica. Riesgoso pero con alma.",
      "Se conserva la base con un par de retoques.",
      "A la base le queda grande la categoría y sufre de entrada.",
      {be:{moral:5},we:{moral:-6}}),
    _oAfa("Reforzar con experiencia","Gente de Primera.",46,{tecnico:10,directorio:6,hinchada:-6},
      "Llegan jugadores de categoría que dan resto para el salto de nivel.",
      "Un refuerzo con recorrido, resto de la base.",
      "Se rompe el grupo que subió y el vestuario nuevo no cuaja.",
      {we:{capital:-4}}) ]),

/* DEPORTIVO RIESTRA · Villa Soldati · club chico de verdad */
_dAfa("rie26_chico","RIE",2026,"gris","medio",6,
  "El club más chico, en la máxima",
  "Riestra llegó a Primera desde Villa Soldati siendo, de verdad, un club chico: poca hinchada, estructura mínima, presupuesto de otra dimensión. Aparecen ayudas de origen dudoso que resolverían la caja pero podrían atar al club.",
  [
    _oAfa("Rechazar la ayuda turbia","Chicos pero derechos.",46,{comunidad:10,socios:6,directorio:-6},
      "El club se mantiene limpio y humilde. Menos plata, la frente en alto.",
      "Se rechaza lo peor, se acepta lo transparente.",
      "Sin esa plata, la estructura mínima cruje y algo se cae.",
      {be:{capital:5},we:{plata:-40}}),
    _oAfa("Tomar la plata","Sobrevivir es sobrevivir.",44,{sponsors:12,directorio:8,comunidad:-8},
      "La caja respira y el club aguanta en Primera. El origen queda en veremos.",
      "Se toma con reparos y algún control.",
      "La ayuda viene con condiciones y el club queda atado de manos.",
      {be:{plata:110},we:{riesgo:8}}) ]),

/* ESTUDIANTES (RC) · Río Cuarto · interior profundo */
_dAfa("erc26_interior","ERC",2026,"institucional","medio",4,
  "Río Cuarto, lejos de todo",
  "Estudiantes de Río Cuarto representa al interior profundo cordobés, lejos de los focos y de la plata grande. El club debate si invertir en visibilidad —prensa, marketing— o poner todo en lo futbolístico y dejar que los resultados hablen.",
  [
    _oAfa("Invertir en visibilidad","Que se nos vea.",44,{prensa:10,sponsors:8,tecnico:-4},
      "Río Cuarto empieza a sonar y llegan interesados en el club.",
      "Algo de exposición, algún sponsor nuevo.",
      "La plata en marketing no vuelve y el plantel se resiente.",
      {be:{prestigio:5},we:{plata:-50}}),
    _oAfa("Todo al fútbol","Que hablen los puntos.",42,{tecnico:10,directorio:6,prensa:-4},
      "El equipo mejora y los resultados traen la atención solos.",
      "Foco deportivo, exposición limitada.",
      "Sin difusión, ni una buena campaña se entera nadie.",
      {}) ]),

/* BARRACAS CENTRAL · La Ribera · el Guapo */
_dAfa("bar26_barrio","BAR",2026,"hinchada","medio",5,
  "El Guapo y su identidad de barrio",
  "Barracas Central es un club de barrio en La Ribera que llegó a Primera. Con el crecimiento aparecen presiones para 'modernizar' la imagen y despegarse del sello barrial. La hinchada quiere que el Guapo siga siendo el Guapo.",
  [
    _oAfa("Fiel al barrio","La Ribera no se negocia.",42,{hinchada:12,comunidad:10,sponsors:-6},
      "Barracas se planta en su identidad barrial y la gente lo abraza.",
      "Se cuida el sello sin cerrarse del todo.",
      "El rechazo a modernizarse espanta a algún sponsor y aprieta la caja.",
      {be:{capital:4},we:{plata:-30}}),
    _oAfa("Modernizar la imagen","Crecer también es esto.",44,{sponsors:10,directorio:8,hinchada:-8},
      "Imagen más profesional, más acuerdos comerciales. El barrio lo mira de reojo.",
      "Cambios de forma, esencia intacta.",
      "El maquillaje corporativo choca con el hincha de toda la vida.",
      {be:{plata:80},we:{moral:-4}}) ])
];

/* VÉLEZ · el Fortín · Liniers · cantera y pelea de arriba
   (tenían decisión de gloria pero no de 2026 — se completa la temporada actual) */
DECISIONES_AFA.push(
_dAfa("vel26_fortin","VEL",2026,"cantera","medio",5,
  "El Fortín entre la cantera y la urgencia",
  "Vélez hizo escuela formando y vendiendo, pero la gente de Liniers también pide pelear arriba ya. Aparece la disyuntiva de siempre: subir pibes de la cantera al Amalfitani o gastar en un refuerzo para competir de inmediato.",
  [
    _oAfa("Confiar en la cantera","El Fortín se forma solo.",44,{cantera:12,hinchada:8,directorio:-4},
      "Debutan juveniles del predio y Liniers se ilusiona con lo propio.",
      "Un pibe se afirma, el resto madura.",
      "Se los expone antes de tiempo y el equipo paga la inexperiencia.",
      {be:{cantera:8}}),
    _oAfa("Comprar para competir","Pelear arriba ahora.",48,{tecnico:10,directorio:6,cantera:-6},
      "Llega jerarquía y el Fortín pelea de igual a igual.",
      "Un refuerzo puntual, la cantera espera.",
      "El gasto no rinde y encima frenó a los pibes.",
      {we:{plata:-70}}) ]));

/* SAN LORENZO · el Ciclón · Boedo · identidad de barrio
   (la Vuelta a Boedo es un anhelo real y documentado del club) */
DECISIONES_AFA.push(
_dAfa("slo26_boedo","SLO",2026,"institucional","alto",4,
  "La Vuelta a Boedo",
  "San Lorenzo sueña con volver a tener su estadio en Boedo, el barrio del que lo sacaron. El proyecto es identidad pura, pero también una obra enorme que compite con las urgencias del plantel. Boedo empuja; la caja frena.",
  [
    _oAfa("Empujar la Vuelta a Boedo","El barrio primero.",50,{hinchada:16,comunidad:10,directorio:-6},
      "El Ciclón pone la ilusión de Boedo en el centro y la gente responde como nunca.",
      "Se avanza a medias en el proyecto. La ilusión sigue viva.",
      "La obra se traba, la plata no aparece y el ánimo se enfría.",
      {be:{prestigio:6,moral:4},we:{deuda:120}}),
    _oAfa("Primero lo deportivo","El sueño puede esperar.",40,{tecnico:8,directorio:8,hinchada:-10},
      "El plantel se refuerza y el equipo mejora. Boedo protesta que se posterga el sueño.",
      "Foco en la cancha, proyecto en pausa.",
      "Ni gran campaña ni avance en Boedo: la hinchada se siente traicionada.",
      {}) ]));

/* ESTUDIANTES (LP) · el Pincha · el clásico platense */
DECISIONES_AFA.push(
_dAfa("elp26_pincha","ELP",2026,"hinchada","alto",8,
  "Semana de clásico platense",
  "Estudiantes vive para ganarle a Gimnasia. En La Plata el clásico define el humor del año entero. El Pincha debate entre volcar todo a la previa del clásico o mantener la cabeza fría para no descuidar el torneo.",
  [
    _oAfa("Todo al clásico","Ganarle al Lobo es todo.",48,{hinchada:14,comunidad:8,tecnico:-4},
      "La ciudad se tiñe de rojo y blanco. El Pincha llega con el cuchillo entre los dientes.",
      "Clásico caliente, resto de la semana normal.",
      "Tanta carga emocional le pasa factura y llega tenso al partido.",
      {be:{moral:5},we:{moral:-6}}),
    _oAfa("Cabeza fría","El torneo también cuenta.",42,{tecnico:8,directorio:6,hinchada:-8},
      "El equipo encara el clásico como una fecha más y no descuida el torneo.",
      "Enfoque equilibrado.",
      "La frialdad se lee como tibieza en la semana más caliente y la gente se enoja.",
      {}) ]));

/* registro: mismo patrón que mergeDec801 — push si el id no existe */
(function mergeDecAfa(){
  if(typeof DECISIONES==="undefined" || !Array.isArray(DECISIONES)) return;
  DECISIONES_AFA.forEach(function(d){
    if(!DECISIONES.some(function(x){ return x.id===d.id; })) DECISIONES.push(d);
  });
})();

/* Clásicos que NO existen dentro de esta liga: se declara la AUSENCIA JUSTIFICADA
   (el rival histórico juega en otra categoría). Así el auditor de rigor no exige
   inventar una rivalidad — regla inviolable: nada inventado como real. El nombre
   del rival real es un dato público. Alimenta DEV_SIN_DATO (del auditor de Claude). */
var CLASICOS_AFA_JUSTIFICADOS={
  "VEL.clasico":"El clásico de Vélez es Ferro (Liniers), hoy fuera de esta liga.",
  "UNI.clasico":"El clásico de Unión es Colón de Santa Fe, hoy fuera de esta liga.",
  "TUC.clasico":"El clásico de Atlético Tucumán es San Martín de Tucumán, fuera de esta liga.",
  "CCO.clasico":"Central Córdoba (SdE) no tiene un clásico histórico con un rival de esta liga.",
  "SAR.clasico":"El clásico de Sarmiento es Rivadavia de Junín, fuera de esta liga.",
  "ALD.clasico":"El clásico de Aldosivi es Alvarado (Mar del Plata), fuera de esta liga.",
  "RIE.clasico":"Deportivo Riestra no tiene un clásico histórico con un rival de esta liga.",
  "ERC.clasico":"Estudiantes de Río Cuarto no tiene un clásico histórico en esta liga.",
  "BAR.clasico":"Barracas Central no tiene un clásico histórico con un rival de esta liga.",
  "DYJ.clasico":"Defensa y Justicia, club joven, no tiene un clásico histórico en esta liga."
};
if(typeof DEV_SIN_DATO==="object"){ try{ Object.assign(DEV_SIN_DATO, CLASICOS_AFA_JUSTIFICADOS); }catch(e){} }
