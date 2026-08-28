"use strict";
/* ============================================================
   FUTBOLINI · data-voz.js  (7.00 · voz PLOP / FutbolGram)
   Pools de texto + hooks blandos. NO toca tokens ni repartirDecisiones.
   Cargar ÚLTIMO en index.html (después de ui.js).
   Edición: sumá líneas a los arrays. No hace falta tocar el motor.
   ============================================================ */

/* ---------- handles de barrio (se mezclan con HANDLES_HINCHA) ---------- */
const HANDLES_BARRIO=[
  "@doña_clarita","@el_que_va_en_micro","@barra_del_fondo","@cuenta_troll",
  "@tio_del_asiento_12","@pibe_de_la_popular","@socio_que_paga","@el_del_completo",
  "@radio_del_taxi","@hincha_de_ley","@datofutbol","@cronica_barrial"
];
const NOMBRES_CANTERA=[
  "Benjamín Sepúlveda","Joaquín Núñez","Matías Alarcón","Cristóbal Henríquez","Ignacio Tapia",
  "Felipe Godoy","Lucas Saavedra","Diego Venegas","Nicolás Parra","Vicente Rojas",
  "Martín Cáceres","Tomás Lagos","Gabriel Muñoz","Simón Contreras","Agustín Riquelme",
  "Maximiliano Soto","Elías Poblete","Renato Vergara","Pablo Carmona","Javier Toledo"
];
const APODOS_CANTERA=["el Pitu","el Flaco","el Chino","el Coto","el Mago","el Nene","el Indio","el Cote","el Nano","el Loco"];
const PERIODISTAS_FICTICIOS=[
  "Rodrigo Palacios","Marcela Quiroz","Héctor Valdivia","Paula Henríquez","Daniel Cisternas",
  "Andrés Lira","Karina Soto","Mauricio Paredes","Claudia Venegas","Pedro Almazán"
];

/* ---------- A) tuits atados al MOMENTO ---------- */
const TUITS_MOMENTO=[
  /* gana_agonico */
  {ctx:"gana_agonico",quien:"@barra_del_fondo",txt:"EN EL ÚLTIMO MINUTO WN. ME MUERO. ME MUERO."},
  {ctx:"gana_agonico",quien:"@doña_clarita",txt:"casi me da un ataqui. el 9 no puede hacer eso a esta edad"},
  {ctx:"gana_agonico",quien:"@pibe_de_la_popular",txt:"EL CORAZÓN NO DA MÁS JAJAJAJ LA CAGÓ EL RIVAL AL FINAL"},
  {ctx:"gana_agonico",quien:"@el_que_va_en_micro",txt:"iba a tomar la micro y grité. el chofer me miró raro. 3 puntos igual"},
  {ctx:"gana_agonico",quien:"@hincha_de_ley",txt:"así se gana en chile: feo, tarde y con el alma en la garganta"},
  {ctx:"gana_agonico",quien:"@RadioGolAM",txt:"Gol sobre la hora. El estadio se vino abajo. Tres puntos que valen oro."},
  {ctx:"gana_agonico",quien:"@cuenta_troll",txt:"el dt no tenía idea y igual ganamos. el fútbol es una wea mística"},
  {ctx:"gana_agonico",quien:"@datofutbol",txt:"90+ y la metió. si no era gol mañana estábamos hablando de otro dt"},

  /* pierde_local */
  {ctx:"pierde_local",quien:"@barra_del_fondo",txt:"EN CASA. EN CASA PERDIMOS ESTA WEA. APAGUEN LA LUZ."},
  {ctx:"pierde_local",quien:"@doña_clarita",txt:"pagué la entrada pa ver esto. nunca más. nunca más po"},
  {ctx:"pierde_local",quien:"@bancado_de_sillon",txt:"localidad: vergüenza. el rival ni se esforzó y igual nos bailó"},
  {ctx:"pierde_local",quien:"@pibe_de_la_popular",txt:"silbidos desde el 20. el dt se hace el sordo. clásico"},
  {ctx:"pierde_local",quien:"@DeporteTotal",txt:"Caída de local. El plantel no encontró cómo lastimar y la gente se fue callada."},
  {ctx:"pierde_local",quien:"@cuenta_troll",txt:"el césped de local también está en contra parece. no queda otra explicación"},
  {ctx:"pierde_local",quien:"@el_verdadero_hincha",txt:"esto no es un mal día. esto ya es identidad"},
  {ctx:"pierde_local",quien:"@CronicaFC",txt:"Se perdió en casa y la tabla se pone cuesta arriba. El entorno pide respuestas."},

  /* expulsion */
  {ctx:"expulsion",quien:"@barra_del_fondo",txt:"ROJA INÚTIL WN. PARA QUÉ. PARA QUÉ."},
  {ctx:"expulsion",quien:"@doña_clarita",txt:"se fue el más caliente. siempre se va el más caliente. siempre"},
  {ctx:"expulsion",quien:"@cuenta_troll",txt:"diez hombres y cero ideas. al menos somos consistentes"},
  {ctx:"expulsion",quien:"@RadioGolAM",txt:"Roja directa. El partido se parte y el banco no tiene recambio de cabeza."},
  {ctx:"expulsion",quien:"@pibe_de_la_popular",txt:"la segunda amarilla era cantada. el wn no sabe ni contar hasta dos"},
  {ctx:"expulsion",quien:"@hincha_de_ley",txt:"ahora a sudar con diez. si ganamos esto es de himno"},
  {ctx:"expulsion",quien:"@datofutbol",txt:"expulsión +0 ideas. después van a decir que el árbitro. spoiler: no"},
  {ctx:"expulsion",quien:"@el_que_va_en_micro",txt:"se fue y yo todavía no entiendo la falta. típico domingo chileno"},

  /* hat_trick */
  {ctx:"hat_trick",quien:"@barra_del_fondo",txt:"EL 9 ESTÁ ROTO. TRES. TRES GOLAZos. DEJEN DE HABLAR."},
  {ctx:"hat_trick",quien:"@doña_clarita",txt:"ese pibe no puede irse en diciembre. si se va me cambio de país"},
  {ctx:"hat_trick",quien:"@pibe_de_la_popular",txt:"hattrick y el dt lo iba a sacar al 60 jajajajsj"},
  {ctx:"hat_trick",quien:"@DeporteTotal",txt:"Tres goles del 9. La noche es de él y el estadio lo está nombrando."},
  {ctx:"hat_trick",quien:"@cuenta_troll",txt:"el 9 se comió el partido y los otros 10 fueron extra en la foto"},
  {ctx:"hat_trick",quien:"@datofutbol",txt:"tres goles. si mañana sale oferta el directorio ya está haciendo la maleta"},
  {ctx:"hat_trick",quien:"@hincha_de_ley",txt:"así se mata un partido. no con discurso. con olfato"},
  {ctx:"hat_trick",quien:"@RadioGolAM",txt:"Hat-trick. El goleador se llevó el partido bajo el brazo."},

  /* penal_errado */
  {ctx:"penal_errado",quien:"@barra_del_fondo",txt:"LA MANDÓ A LA LUNA. PENAL. PENAL WN. ME RÍO PA NO LLORAR"},
  {ctx:"penal_errado",quien:"@doña_clarita",txt:"quién le da el penal a ese. quién. yo quiero nombres"},
  {ctx:"penal_errado",quien:"@cuenta_troll",txt:"el 1 del rival ni se tiró. se quedó parado y igual atajó. SKKSKDKD"},
  {ctx:"penal_errado",quien:"@pibe_de_la_popular",txt:"penal errado = temporada resumida. no hay más plot"},
  {ctx:"penal_errado",quien:"@CronicaFC",txt:"Penal desperdiciado. El estadio se hundió y el partido se le fue de las manos."},
  {ctx:"penal_errado",quien:"@el_verdadero_hincha",txt:"después van a decir que el árbitro. el árbitro no pateó esa wea"},
  {ctx:"penal_errado",quien:"@datofutbol",txt:"penal al medio sin fuerza. eso no es nervios. eso es no haber pateado uno en la semana"},
  {ctx:"penal_errado",quien:"@hincha_de_ley",txt:"si el 9 no lo patea nunca más. nunca más po"},

  /* remontada */
  {ctx:"remontada",quien:"@barra_del_fondo",txt:"ÍBAMOS PERDIENDO Y LOS DIO VUELTA. ESTO ES EL CLUB. ESTO."},
  {ctx:"remontada",quien:"@doña_clarita",txt:"yo ya me había parado. me tuve que sentar de nuevo. vieja but happy"},
  {ctx:"remontada",quien:"@pibe_de_la_popular",txt:"el rival se creyó el partido y se lo comimos. clásico chile"},
  {ctx:"remontada",quien:"@cuenta_troll",txt:"primera parte funeral. segunda parte videito culiao weno"},
  {ctx:"remontada",quien:"@DeporteTotal",txt:"Remontada. El equipo se encontró tarde, pero se encontró."},
  {ctx:"remontada",quien:"@hincha_de_ley",txt:"cuando esto pasa, se perdona hasta el 0-2 de las 6 de la tarde"},
  {ctx:"remontada",quien:"@el_que_va_en_micro",txt:"iba perdiendo y ahora vengo cantando en la micro. la gente me odia y tiene razón"},
  {ctx:"remontada",quien:"@RadioGolAM",txt:"Lo dio vuelta. Carácter. El banco se quedó sin voz."},

  /* goleada_favor */
  {ctx:"goleada_favor",quien:"@barra_del_fondo",txt:"BAILE. BAILE. QUE LO PASEN EN REPETICIÓN TODA LA SEMANA"},
  {ctx:"goleada_favor",quien:"@doña_clarita",txt:"así me gusta el domingo. café, sol y el rival pidiendo la hora"},
  {ctx:"goleada_favor",quien:"@cuenta_troll",txt:"el rival vino de turista. le cobramos la entrada en goles"},
  {ctx:"goleada_favor",quien:"@pibe_de_la_popular",txt:"goleada y igual el dt va a decir que hay que mejorar. déjame feliz un rato wn"},
  {ctx:"goleada_favor",quien:"@datofutbol",txt:"goleada. mañana el directorio se va a creer eterno. anoten"},
  {ctx:"goleada_favor",quien:"@DeporteTotal",txt:"Goleada y autoridad. El partido se cerró temprano y el estadio lo disfrutó."},
  {ctx:"goleada_favor",quien:"@hincha_de_ley",txt:"esto es lo que se le pide al más grande. o al que quiere serlo"},
  {ctx:"goleada_favor",quien:"@el_que_va_en_micro",txt:"voy a llegar tarde al trabajo mañana y va a valer la pena"},

  /* clasico_gana */
  {ctx:"clasico_gana",quien:"@barra_del_fondo",txt:"CLÁSICO NUESTRO. QUE LO ESCUCHE TODA LA CIUDAD."},
  {ctx:"clasico_gana",quien:"@doña_clarita",txt:"el vecino hincha del otro no va a salir a comprar el pan. yo sí"},
  {ctx:"clasico_gana",quien:"@pibe_de_la_popular",txt:"en el clásico no se juega bonito. se gana. y se ganó. punto"},
  {ctx:"clasico_gana",quien:"@cuenta_troll",txt:"CON ESTE CLUB NO SE JODE. anotenlo pa la próxima publicación bonita"},
  {ctx:"clasico_gana",quien:"@RadioGolAM",txt:"Clásico para casa. La ciudad se parte y esta mitad canta."},
  {ctx:"clasico_gana",quien:"@hincha_de_ley",txt:"esto no se olvida. el que lo duda que se dé una vuelta por la calle mañana"},
  {ctx:"clasico_gana",quien:"@datofutbol",txt:"clásico ganado. 3 puntos y 3 semanas de privilegio en el trabajo"},
  {ctx:"clasico_gana",quien:"@CronicaFC",txt:"El clásico se quedó en casa. La tabla y el barrio lo van a recordar."},

  /* arquero_figura */
  {ctx:"arquero_figura",quien:"@barra_del_fondo",txt:"QUÉ HACE EL 1 SKKSKDKD. NO ES HUMANO ESO"},
  {ctx:"arquero_figura",quien:"@doña_clarita",txt:"el arquero se comió el partido. los demás que le paguen el almuerzo"},
  {ctx:"arquero_figura",quien:"@cuenta_troll",txt:"atajó 3 y el 9 no metió 1. el 1 es el único profesional del recinto"},
  {ctx:"arquero_figura",quien:"@pibe_de_la_popular",txt:"el 1 voló. voló wn. dejen de hablar del 9 un rato"},
  {ctx:"arquero_figura",quien:"@DeporteTotal",txt:"El arquero sostuvo al equipo. Sin él, este partido era otra historia."},
  {ctx:"arquero_figura",quien:"@datofutbol",txt:"figura: el 1. si mañana suben un post de aura, recuerden cómo envejecen esos"},
  {ctx:"arquero_figura",quien:"@hincha_de_ley",txt:"cuando el 1 está así, se puede soñar hasta de visita en el norte"},
  {ctx:"arquero_figura",quien:"@el_que_va_en_micro",txt:"atajadón y yo aplaudí solo en la pieza. mi perro se asustó. weno igual"},

  /* analogia_dunk · voz de los tuits nuevos */
  {ctx:"analogia_dunk",quien:"@cuenta_troll",txt:"el dt explicando el 0-0 es como mostrarle la billetera a un millonario"},
  {ctx:"analogia_dunk",quien:"@barra_del_fondo",txt:"sacar al que estaba bien es como imprimir el informe en modo oscuro. PARA QUÉ"},
  {ctx:"analogia_dunk",quien:"@pibe_de_la_popular",txt:"iba a renovar al 9 y me saltó la cláusula??? re maléfico"},
  {ctx:"analogia_dunk",quien:"@doña_clarita",txt:"COMO VAS A TIRAR ESE CENTRO AL PRIMER PALO WN"},
  {ctx:"analogia_dunk",quien:"@el_que_va_en_micro",txt:"el comunicado del club y la realidad son dos países distintos"},
  {ctx:"analogia_dunk",quien:"@datofutbol",txt:"DESDE QUE SUBIERON EL POST DE AURA PASÓ LO SIGUIENTE: nos hicieron dos y el 1 pidió cambio"},
  {ctx:"analogia_dunk",quien:"@hincha_de_ley",txt:"106 años de club y todavía discutimos si el 6 sabe salir jugando. eso es identidad"},
  {ctx:"analogia_dunk",quien:"@cuenta_troll",txt:"echaron al que laburaba para hacer esta wea jajajajsj"}
];

/* ---------- B) preguntas extra (el periodista SOLO pregunta) ---------- */
const PREGUNTAS_VOZ=[
  {sit:"previa_favorito",q:"¿El plantel siente el cartel de favorito o lo van a bajar a tierra en la charla?"},
  {sit:"previa_favorito",q:"Hay gente que ya da por ganado el domingo. ¿Eso ayuda o estorba?"},
  {sit:"post_derrota",q:"¿Dónde se les fue el partido: en el primer gol o en la reacción?"},
  {sit:"post_derrota",q:"La gente silbó. ¿Lo escucha o lo deja pasar?"},
  {sit:"racha_sin_ganar",q:"Llevan varias sin ganar. ¿En qué minuto se les empieza a notar la cabeza?"},
  {sit:"racha_sin_ganar",q:"¿Sigue confiando en el once o ya es momento de cortar de raíz?"},
  {sit:"clasico_previa",q:"En un clásico, ¿se gana con la idea o se gana con el carácter?"},
  {sit:"clasico_previa",q:"La ciudad se parte. ¿Usted desconecta al plantel de eso o lo usa?"},
  {sit:"post_goleada",q:"Goleada. ¿Es el techo o es el piso de lo que quiere ver?"},
  {sit:"post_goleada",q:"¿Qué detalle no le gustó, aunque el marcador sea ancho?"},
  {sit:"figura_juvenil",q:"El pibe se comió el partido. ¿Ya es titular o se dosifica?"},
  {sit:"rumor_venta",q:"Se habla de una oferta por un titular. ¿El club la escuchó o es ruido?"}
];

/* ---------- C) trivia extra ---------- */
const TRIVIA_VOZ=[
  {q:"¿Cuántos jugadores tiene un equipo en cancha, sin contar el banco?",op:["10","11","12"],sol:1},
  {q:"Si el balón cruza toda la línea de gol, ¿qué es?",op:["Córner","Gol","Saque de arco"],sol:1},
  {q:"Dos amarillas en el mismo partido se convierten en:",op:["Un penal","Roja y expulsión","Tiro libre"],sol:1},
  {q:"En Chile, ¿cuántos puntos da una victoria hoy en Primera?",op:["2","3","1"],sol:1},
  {q:"En 1991 la victoria en el Nacional chileno valía:",op:["2 puntos","3 puntos","1 punto"],sol:0},
  {q:"Único club chileno campeón de Copa Libertadores:",op:["Universidad de Chile","Colo-Colo","Universidad Católica"],sol:1},
  {q:"Esa Libertadores de Colo-Colo fue el año:",op:["1989","1991","1993"],sol:1},
  {q:"El clásico universitario enfrenta a:",op:["U. de Chile y U. Católica","Colo-Colo y la U","Católica y Palestino"],sol:0},
  {q:"El Superclásico de Santiago enfrenta a:",op:["Católica y Colo-Colo","Colo-Colo y U. de Chile","Audax y Palestino"],sol:1},
  {q:"Si el partido termina 0-0, cada equipo suma:",op:["0 puntos","1 punto","2 puntos"],sol:1},
  {q:"El arquero puede tomar el balón con la mano:",op:["En toda la cancha","Solo dentro de su área","Solo en córner"],sol:1}
];

/* ---------- F) logros extra ---------- */
const LOGROS_VOZ=[
  {id:"silencio_local",n:"Se fue la luz",d:"Perdé de local sin marcar un gol."},
  {id:"diez_visita",n:"Con uno menos, de visita",d:"Sumá de visita después de una roja propia."},
  {id:"no_se_jode",n:"Con este club no se jode",d:"Ganá un clásico."},
  {id:"micro_cantando",n:"El chofer me miró raro",d:"Ganá de visita en el último minuto (80+)."},
  {id:"luna_penal",n:"La mandó a la luna",d:"Errá un penal y aun así no pierdas el partido."},
  {id:"el_1_es_el_dt",n:"El 1 se comió el partido",d:"Terminá 0-0 de visita."},
  {id:"tres_del_9",n:"Dejen de hablar",d:"Un mismo delantero hace 3 goles en un partido."},
  {id:"pueblo_lleno",n:"Que quepa el pueblo",d:"Ganá de local con un club chico (LIM, CAL, COB, NUB)."}
];

/* ---------- E) arcos que faltaban (2026) ---------- */
const ARCOS_NUEVOS={
  EVE:[{id:"eve_vina",t:"Sausalito y la ciudad de veraneo",desc:"Everton vive entre la postal de Viña y un club que quiere ser de verdad, no de temporada.",
    capitulos:[
      {id:"eve_1",t:"¿Club de ciudad o de verano?",ctx:"Viña se llena en enero y el Sausalito se viste de postal. El directorio quiere vender la marca turística; la hinchada de toda la vida quiere un equipo que no desaparezca en marzo.",
       ops:[{t:"Bancar al hincha de todos los meses",d:"Menos brillo, más barrio.",grupos:{hinchada:12,comunidad:10,sponsors:-6},mem:"pusiste a Everton del lado de su gente y no del verano",va:"eve_2"},
            {t:"Subir la marca Viña al máximo",d:"Entra plata de turismo.",ef:{plata:80},grupos:{sponsors:12,directorio:8,hinchada:-8},mem:"exprimiste la marca Viña por sobre el barrio de Everton",va:"eve_2"}]},
      {id:"eve_2",t:"Sausalito de semana",ctx:"El estadio se llena cuando hay sol y visita grande. El resto del año, sillas vacías.",
       ops:[{t:"Bajar entradas entre semana y llenar",d:"Caja chica, tribuna viva.",ef:{plata:-30},grupos:{hinchada:10,comunidad:8},mem:"llenaste Sausalito bajando el precio",va:"eve_3"},
            {t:"Cobrar caro y cuidar la platea",d:"Más ingreso por cabeza, menos pueblo.",ef:{plata:50},grupos:{sponsors:8,hinchada:-8},mem:"cuidaste la platea de Everton y vaciaste la popular",va:"eve_3"}]},
      {id:"eve_3",t:"El ruletero con techo",ctx:"Everton tiene historia de títulos cortos y sequías largas. Te piden un plan de cinco años, no un verano más.",
       ops:[{t:"Plan de cantera y continuidad",d:"Aburrido y serio.",ef:{prestigio:8},grupos:{camarin:8,socios:10,directorio:4},mem:"le diste a Everton un plan largo y no un verano",cierra:true},
            {t:"Todo al presente, a pelear ya",d:"La gente se ilusiona; el futuro se hipoteca.",grupos:{hinchada:12,directorio:-6},mem:"apostaste el presente de Everton y dejaste el después para después",cierra:true}]}
    ]}],
  COQ:[{id:"coq_pirata",t:"El puerto que se cree grande",desc:"Coquimbo dejó de ser comparsa. Ahora el problema es no volver a serlo.",
    capitulos:[
      {id:"coq_1",t:"Aura de puerto",ctx:"El club se llenó de pecho después de pelear arriba. La ciudad lo siente. El predio pide trabajo sucio.",
       ops:[{t:"Bajar el pecho y trabajar",d:"Menos himno, más entrenamiento.",grupos:{camarin:10,prensa:-4,hinchada:4},mem:"bajaste el pecho pirata y lo volviste trabajo",va:"coq_2"},
            {t:"Subir la mística y venderla",d:"La ciudad se agranda; el rival se pica.",ef:{prestigio:4},grupos:{hinchada:12,sponsors:8,camarin:-4},mem:"vendiste el aura de Coquimbo a todo trapo",va:"coq_2"}]},
      {id:"coq_2",t:"El norte no es Santiago",ctx:"Un sponsor santiaguino ofrece plata si el club se «profesionaliza» a su imagen.",
       ops:[{t:"Quedarse puerto, con su gente",d:"Identidad firme, menos vitrina.",grupos:{comunidad:14,hinchada:10,sponsors:-8},mem:"defendiste que Coquimbo se quede puerto",va:"coq_3"},
            {t:"Abrir la marca a Santiago",d:"Plata y recelo en las gradas.",ef:{plata:90},grupos:{sponsors:12,directorio:8,comunidad:-10},mem:"abriste Coquimbo a la marca santiaguina",va:"coq_3"}]},
      {id:"coq_3",t:"No volver a ser comparsa",ctx:"El peligro de un club que recién tocó el cielo es relajarse.",
       ops:[{t:"Invertir en plantel y cantera",d:"Duele la caja; sostiene el ciclo.",ef:{plata:-70,prestigio:6},grupos:{camarin:10,hinchada:8},mem:"invertiste para que Coquimbo no vuelva a ser comparsa",cierra:true},
            {t:"Cobrar el ciclo y vender piezas",d:"Caja sana, hinchada en alerta.",ef:{plata:120},grupos:{directorio:10,hinchada:-12},mem:"cobraste el ciclo pirata vendiendo piezas",cierra:true}]}
    ]}],
  AUD:[{id:"aud_italico",t:"La Florida y la colonia",desc:"Audax es club de barrio italiano y de tabla chica. Crecer sin perder la casa.",
    capitulos:[
      {id:"aud_1",t:"Barrio o vitrina",ctx:"La Florida no es vitrina. Un fondo quiere llevar al Itálico a otro nivel de marketing. La colonia pide domingo en familia.",
       ops:[{t:"El club se queda en el barrio",d:"Menos ruido, más casa.",grupos:{comunidad:14,hinchada:8,sponsors:-6},mem:"dejaste a Audax en su barrio",va:"aud_2"},
            {t:"Abrir la marca Itálico",d:"Entra plata; la colonia se tensa.",ef:{plata:70},grupos:{sponsors:10,directorio:8,comunidad:-8},mem:"abriste la marca de Audax más allá de La Florida",va:"aud_2"}]},
      {id:"aud_2",t:"Siempre en el medio",ctx:"Audax vive en la mitad de la tabla: ni miedo ni fiesta.",
       ops:[{t:"Pedir un salto ahora",d:"Ambicioso. Si no llega, duele.",grupos:{directorio:8,hinchada:6,camarin:-6},mem:"le exigiste a Audax un salto de tabla",va:"aud_3"},
            {t:"Aceptar el medio y construir",d:"Poco épico, más sano.",grupos:{camarin:8,directorio:-4,socios:6},mem:"aceptaste el medio de la tabla para construir Audax",va:"aud_3"}]},
      {id:"aud_3",t:"La camiseta verde",ctx:"La identidad italiana es orgullo y también techo.",
       ops:[{t:"Celebrar la colonia y el barrio",d:"La gente se emociona.",ef:{prestigio:6},grupos:{comunidad:12,hinchada:8},mem:"celebraste la identidad de Audax",logro:"de_la_comunidad",cierra:true},
            {t:"Marca neutra, más mercado",d:"Más venta, menos alma.",ef:{plata:60},grupos:{sponsors:10,comunidad:-10},mem:"neutralizaste la identidad de Audax por mercado",cierra:true}]}
    ]}],
  HUA:[{id:"hua_acero",t:"El acero de Talcahuano",desc:"Huachipato es club de trabajadores y de cantera. El CAP no es un adorno.",
    capitulos:[
      {id:"hua_1",t:"Fábrica de jugadores",ctx:"Huachipato forma y vende. Aparece una oferta grande por un cabro de la casa.",
       ops:[{t:"Retenerlo un año más",d:"El CAP se ilusiona.",grupos:{hinchada:12,camarin:8,directorio:-8},mem:"retuviste a la joya de Huachipato un año más",va:"hua_2"},
            {t:"Vender y reinvertir en inferiores",d:"El modelo del acero.",ef:{plata:140},grupos:{directorio:10,hinchada:-8},mem:"vendiste a la joya y reinvertiste en la fábrica de Huachipato",va:"hua_2"}]},
      {id:"hua_2",t:"Ciudad de puerto y humo",ctx:"Talcahuano no es vitrina de revista. Un sponsor quiere limpiar la imagen del club.",
       ops:[{t:"Quedarse puerto y acero",d:"Identidad dura, menos brillo.",grupos:{comunidad:14,hinchada:8,sponsors:-6},mem:"dejaste a Huachipato oliendo a su puerto",va:"hua_3"},
            {t:"Aceptar la imagen limpia",d:"Más plata, menos calle.",ef:{plata:80},grupos:{sponsors:12,comunidad:-8},mem:"le diste a Huachipato una imagen más de vitrina",va:"hua_3"}]},
      {id:"hua_3",t:"Título o fábrica",ctx:"El club puede soñar un campeonato o aceptar que su destino es formar.",
       ops:[{t:"Soñar el campeonato con lo puesto",d:"Heroico y frágil.",grupos:{hinchada:14,camarin:8,directorio:-6},mem:"le pediste a Huachipato que sueñe el título",cierra:true},
            {t:"Ser la mejor fábrica de Chile",d:"Menos copa, más futuro.",ef:{prestigio:6},grupos:{directorio:8,comunidad:8},mem:"hiciste de Huachipato una fábrica antes que un candidato",cierra:true}]}
    ]}],
  OHI:[{id:"ohi_rancagua",t:"Rancagua no es Santiago",desc:"O'Higgins carga con el cobre, El Teniente y las ganas de no ser sucursal.",
    capitulos:[
      {id:"ohi_1",t:"Regional de verdad",ctx:"Santiago a veces mira a Rancagua como un club de paso. La gente está harta de ser sucursal.",
       ops:[{t:"Armar plantel con sello local",d:"Menos nombres, más casa.",grupos:{comunidad:12,hinchada:10,directorio:-4},mem:"le diste a O'Higgins un sello de Rancagua",va:"ohi_2"},
            {t:"Traer nombres de afuera",d:"Ilusión rápida, raíz débil.",ef:{plata:-60,prestigio:4},grupos:{hinchada:6,comunidad:-6},mem:"llenaste O'Higgins de nombres de afuera",va:"ohi_2"}]},
      {id:"ohi_2",t:"El Teniente de semana",ctx:"Un evento privado quiere tomar el estadio un sábado de partido. Plata versus cancha.",
       ops:[{t:"El estadio es para el fútbol",d:"La gente aplaude; la caja no.",grupos:{hinchada:12,comunidad:8,sponsors:-8},mem:"defendiste El Teniente para el fútbol",va:"ohi_3"},
            {t:"Ceder el sábado y cobrar",d:"Cancha marcada, plata limpia.",ef:{plata:70},grupos:{sponsors:10,directorio:8,hinchada:-8},mem:"cediste El Teniente por un evento pagado",va:"ohi_3"}]},
      {id:"ohi_3",t:"No ser sucursal",ctx:"¿Se pelea de igual a igual o se acepta el rol de club de medio pelo?",
       ops:[{t:"Pelearle a los grandes",d:"Ambicioso. Te lo cobran si no hay puntos.",ef:{prestigio:6},grupos:{hinchada:12,directorio:-4},mem:"prometiste que O'Higgins no iba a ser sucursal",cierra:true},
            {t:"Ser sólidos y de región",d:"Menos tapa, más respeto local.",grupos:{comunidad:10,socios:8},mem:"afirmaste a O'Higgins como club sólido de región",cierra:true}]}
    ]}],
  NUB:[{id:"nub_chillan",t:"El rojo de Ñuble",desc:"Ñublense es Chillán: frío, orgullo de región y poco flash.",
    capitulos:[
      {id:"nub_1",t:"Chillán no pide permiso",ctx:"El club creció y aparecieron ojeadores. La ciudad teme que el rojo se vuelva un equipo de paso.",
       ops:[{t:"Pacto de identidad con la ciudad",d:"Gestos, precios, cantera local.",grupos:{comunidad:14,hinchada:10,directorio:-4},mem:"amarraste a Ñublense con Chillán",va:"nub_2"},
            {t:"Abrir el club a nombres de afuera",d:"Más nivel, menos cara de barrio.",ef:{plata:-40,prestigio:4},grupos:{camarin:6,comunidad:-8},mem:"llenaste Ñublense de caras nuevas",va:"nub_2"}]},
      {id:"nub_2",t:"El Nelson Oyarzún de invierno",ctx:"El frío de Chillán es un jugador más. ¿Estadio o dos refuerzos?",
       ops:[{t:"Meter plata al estadio",d:"La gente lo vive todos los domingos.",ef:{plata:-50,prestigio:4},grupos:{hinchada:10,comunidad:10},mem:"invertiste en el Oyarzún antes que en un refuerzo",va:"nub_3"},
            {t:"Dos refuerzos y el estadio después",d:"El presente manda.",ef:{plata:-80},grupos:{camarin:8,hinchada:4,comunidad:-6},mem:"priorizaste refuerzos por sobre el estadio de Chillán",va:"nub_3"}]},
      {id:"nub_3",t:"Quedarse en Primera con dignidad",ctx:"Para Ñublense, salvarse no es un fracaso si se hace con la cara sucia y la gente adentro.",
       ops:[{t:"Pelea fea y de región",d:"Puntos, barro, respeto.",grupos:{hinchada:12,camarin:8},mem:"hiciste de Ñublense un equipo feo y de Primera",cierra:true},
            {t:"Traer un nombre de media tabla santiaguina",d:"Ruido. Si no rinde, papelón.",ef:{plata:-90},grupos:{prensa:6,comunidad:-4},mem:"apostaste un nombre santiaguino para salvar a Ñublense",cierra:true}]}
    ]}],
  COB:[{id:"cob_salvador",t:"El Salvador no es una postal",desc:"Cobresal juega en el desierto. Llegar, quedarse y que la gente no se sienta sola.",
    capitulos:[
      {id:"cob_1",t:"Viajar al fin del mundo",ctx:"El rival odia ir a El Salvador. Eso es ventaja. También es un club lejos de todo.",
       ops:[{t:"Hacer de la altura y el viaje un arma",d:"Localía brava, poco marketing.",grupos:{hinchada:10,camarin:8,prensa:-4},mem:"hiciste de El Salvador un arma y no una queja",va:"cob_2"},
            {t:"Pedir jugar más cerca de Copiapó",d:"Más cómodo, menos identidad.",grupos:{sponsors:8,comunidad:-12,hinchada:-8},mem:"sacaste a Cobresal de su casa por comodidad",va:"cob_2"}]},
      {id:"cob_2",t:"Plantel que aguante el desierto",ctx:"No todos quieren vivir allá. Se paga más o se busca gente que sí lo sienta.",
       ops:[{t:"Pagar el aislamiento",d:"Sueldos más altos, camarín estable.",ef:{plata:-70},grupos:{camarin:12,directorio:-6},mem:"pagaste el aislamiento para retener el plantel de Cobresal",va:"cob_3"},
            {t:"Armar con los que sí quieren estar",d:"Menos nivel, más pata.",grupos:{comunidad:10,camarin:6},mem:"armaste Cobresal con los que aguantan el desierto",va:"cob_3"}]},
      {id:"cob_3",t:"Minería y fútbol",ctx:"El pueblo depende de un mundo que no es la pelota. El club es la otra bandera.",
       ops:[{t:"El club es de El Salvador",d:"Identidad de pueblo minero.",ef:{prestigio:6},grupos:{comunidad:14,hinchada:10},mem:"afirmaste que Cobresal es de El Salvador",logro:"de_la_comunidad",cierra:true},
            {t:"Administrarlo como negocio nómade",d:"Sano y frío.",ef:{plata:50},grupos:{directorio:10,comunidad:-12},mem:"trataste a Cobresal como un negocio nómade",cierra:true}]}
    ]}],
  CAL:[{id:"cal_pueblo",t:"Unión La Calera, pueblo chico",desc:"La Calera no tiene aforo de grande. Tiene un pueblo que se conoce de nombre.",
    capitulos:[
      {id:"cal_1",t:"El Nicolás Chahuán cabe o no cabe",ctx:"Cuando llega un grande, el pueblo se desarma. El directorio quiere agrandar.",
       ops:[{t:"Quedarse pueblo y llenarlo",d:"Menos plata, más casa.",grupos:{comunidad:14,hinchada:10,sponsors:-6},mem:"dejaste a La Calera siendo pueblo",va:"cal_2"},
            {t:"Empujar un estadio más grande",d:"Sueño caro.",ef:{capital:-6},grupos:{directorio:8,hinchada:6,comunidad:-4},mem:"empujaste un estadio más grande en La Calera",va:"cal_2"}]},
      {id:"cal_2",t:"El 0-0 que da puntos",ctx:"La Calera históricamente saca puntos feos. ¿La abrazás o la tirás?",
       ops:[{t:"Abrazar el fútbol feo que suma",d:"La gente de afuera putea; los puntos llegan.",grupos:{camarin:8,prensa:-6,hinchada:6},mem:"abrazaste el fútbol feo de La Calera",va:"cal_3"},
            {t:"Jugar más abierto, atraer gente nueva",d:"Bonito y frágil.",grupos:{prensa:6,hinchada:4,camarin:-4},mem:"le pediste a La Calera que juegue más abierto",va:"cal_3"}]},
      {id:"cal_3",t:"No ser comparsa de los grandes",ctx:"Cada año un grande quiere usar a La Calera de puente.",
       ops:[{t:"Dejar de ser sucursal de nadie",d:"Más dignidad, menos nombres.",grupos:{comunidad:12,directorio:-4,hinchada:8},mem:"sacaste a La Calera del rol de sucursal",cierra:true},
            {t:"Aceptar el puente y aprovecharlo",d:"Nombres a préstamo, alma ajena.",ef:{plata:40},grupos:{directorio:8,comunidad:-8},mem:"aceptaste que La Calera sea puente de los grandes",cierra:true}]}
    ]}],
  LSE:[{id:"lse_portada",t:"La Serena entre la playa y la tabla",desc:"La Portada es postal. El club, a veces, parece de veraneo.",
    capitulos:[
      {id:"lse_1",t:"Postal o puntos",ctx:"La Serena vende sol. El fútbol pide barro. Un sponsor turístico ofrece camiseta si el club se ve linda ciudad.",
       ops:[{t:"Puntos primero, postal después",d:"Menos brillo, más partido.",grupos:{camarin:10,hinchada:8,sponsors:-6},mem:"pusiste los puntos de La Serena por sobre la postal",va:"lse_2"},
            {t:"Vestir al club de ciudad turística",d:"Plata de verano.",ef:{plata:70},grupos:{sponsors:12,comunidad:4,camarin:-4},mem:"vestiste a La Serena de ciudad turística",va:"lse_2"}]},
      {id:"lse_2",t:"El yo-yo",ctx:"La Serena conoce el ascenso y el descenso. La gente tiene memoria corta y heridas largas.",
       ops:[{t:"Hablar claro: el objetivo es no bajar",d:"Honesto. Poco épico.",grupos:{socios:8,hinchada:-4,directorio:6},mem:"hablaste claro: La Serena primero no baja",va:"lse_3"},
            {t:"Prometer pelea arriba",d:"La gente se prende; el margen es fino.",grupos:{hinchada:12,prensa:6,directorio:-6},mem:"prometiste que La Serena iba a pelear arriba",va:"lse_3"}]},
      {id:"lse_3",t:"La Portada de los domingos",ctx:"¿El estadio es de los que viven en Serena todo el año o de los que bajan en enero?",
       ops:[{t:"Precios para el que vive acá",d:"Tribuna local.",ef:{plata:-25},grupos:{comunidad:12,hinchada:10},mem:"cuidaste al hincha que vive en La Serena todo el año",cierra:true},
            {t:"Precios de temporada alta",d:"Caja de verano, invierno vacío.",ef:{plata:55},grupos:{sponsors:8,comunidad:-10},mem:"cobraste La Portada como si fuera enero todo el año",cierra:true}]}
    ]}],
  DCO:[{id:"dco_leon",t:"El León de Collao vuelve",desc:"Deportes Concepción es historia, gente y un regreso que no puede ser turismo.",
    capitulos:[
      {id:"dco_1",t:"Volver no basta",ctx:"El club está de vuelta en Primera. La ciudad se emociona. El directorio quiere cobrar la emoción en camisetas.",
       ops:[{t:"Construir para quedarse",d:"Menos fiesta, más predio.",grupos:{camarin:10,socios:8,hinchada:6},mem:"construiste para que Concepción se quede en Primera",va:"dco_2"},
            {t:"Cobrar la fiesta del regreso",d:"Plata ahora, riesgo después.",ef:{plata:80},grupos:{sponsors:10,directorio:8,camarin:-6},mem:"cobraste la fiesta del regreso de Concepción",va:"dco_2"}]},
      {id:"dco_2",t:"Collao / Ester Roa",ctx:"Jugar en un estadio grande de región es orgullo y es vacío si no se llena.",
       ops:[{t:"Horario de gente de a pie",d:"Domingo, entrada barata.",ef:{plata:-20},grupos:{comunidad:12,hinchada:10},mem:"pusiste a Concepción en horario de gente de a pie",va:"dco_3"},
            {t:"Horario de televisión",d:"Plata de TV, tribuna a media máquina.",ef:{plata:60},grupos:{sponsors:10,anfp:6,hinchada:-6},mem:"entregaste el horario de Concepción a la tele",va:"dco_3"}]},
      {id:"dco_3",t:"No ser un recuerdo",ctx:"Concepción tiene memoria de grandeza. El peligro es vivir de eso y no de los 90 minutos.",
       ops:[{t:"Himno adentro, trabajo afuera",d:"Respeto a la historia, pies en el barro.",ef:{prestigio:6},grupos:{hinchada:10,camarin:8,comunidad:8},mem:"respetaste la historia de Concepción sin vivir de ella",cierra:true},
            {t:"Vender nostalgia a todo trapo",d:"Camisetas retro, presente flaco.",ef:{plata:70},grupos:{sponsors:10,hinchada:4,camarin:-8},mem:"vendiste la nostalgia de Concepción",cierra:true}]}
    ]}],
  UDC:[{id:"udc_campanil",t:"El Campanil entre la U y la pelota",desc:"Universidad de Concepción nace de una universidad. Formar no es un eslogan: es el origen.",
    capitulos:[
      {id:"udc_1",t:"Alumnos o refuerzos",ctx:"El Campanil puede ser vitrina de universitarios o un club más que ficha.",
       ops:[{t:"Priorizar cantera universitaria",d:"Identidad pura, nivel inestable.",grupos:{comunidad:12,directorio:-4,hinchada:6},mem:"priorizaste la cantera universitaria del Campanil",va:"udc_2"},
            {t:"Fichar para no sufrir",d:"Más puntos, menos sello.",ef:{plata:-70},grupos:{camarin:8,directorio:6,comunidad:-6},mem:"fichaste para que el Campanil no sufra",va:"udc_2"}]},
      {id:"udc_2",t:"La ciudad tiene dos clubes",ctx:"Concepción no es de uno solo. Compartir ciudad obliga a elegir: ¿guerra o convivencia?",
       ops:[{t:"Guerra sana de ciudad",d:"Clásico regional, tribuna caliente.",grupos:{hinchada:12,prensa:6,comunidad:4},mem:"calentaste el clásico de Concepción",va:"udc_3"},
            {t:"Convivir y no regalar el pecho",d:"Menos pica, más gestión.",grupos:{directorio:6,anfp:4,hinchada:-6},mem:"enfriaste la pica de ciudad del Campanil",va:"udc_3"}]},
      {id:"udc_3",t:"Qué es el Campanil",ctx:"¿Club universitario o club de Primera que nació ahí?",
       ops:[{t:"Seguir siendo de la Universidad",d:"Sello. Techo posible.",ef:{prestigio:6},grupos:{comunidad:12,socios:8},mem:"afirmaste al Campanil como club de la Universidad",logro:"de_la_comunidad",cierra:true},
            {t:"Ser un club de Primera a secas",d:"Más mercado, menos origen.",ef:{plata:50},grupos:{sponsors:10,directorio:8,comunidad:-10},mem:"volviste al Campanil un club de Primera a secas",cierra:true}]}
    ]}]
};

/* ---------- helpers ---------- */
let _ultTuits=[];
function tuitDeCtx(ctx){
  const pool=TUITS_MOMENTO.filter(x=>x.ctx===ctx);
  if(!pool.length) return null;
  const libres=pool.filter(x=>_ultTuits.indexOf(x.txt)<0);
  const usar=libres.length?libres:pool;
  const t=(typeof elige==="function")?elige(usar):usar[Math.floor(Math.random()*usar.length)];
  if(t){ _ultTuits.push(t.txt); if(_ultTuits.length>14) _ultTuits.shift(); }
  return t;
}
function tonoDeCtx(ctx){
  if(/gana|hat_trick|remontada|goleada|clasico_gana|arquero/.test(ctx)) return "bueno";
  if(/pierde|expulsion|penal_errado/.test(ctx)) return "malo";
  return "neutro";
}
function ctxDeEvento(P, ev){
  if(!P||!ev) return null;
  const m=ev.min||P.min||0;
  const [yo,ot]=(typeof miMarcador==="function")?miMarcador(P):[(P.gl||0),(P.gv||0)];
  const dif=yo-ot;
  const local=!(!P.part||P.part.local===false);
  const clas=(typeof esClasico==="function")&&P.part?esClasico(P.part):false;
  const tipo=ev.tipo;
  if(tipo==="gol"){
    const gd=(P.golesDetalle||[]).filter(g=>g.propio);
    const last=gd.length?gd[gd.length-1].quien:null;
    const n=last?gd.filter(g=>g.quien===last).length:0;
    if(n>=3) return "hat_trick";
    if(clas&&dif>0) return "clasico_gana";
    if(dif>=3) return "goleada_favor";
    if(m>=80&&dif>0) return "gana_agonico";
    if(P._ibaAbajo) return "remontada";
    return null;
  }
  if(tipo==="golRival"){
    if(local&&dif<0&&m>=55) return "pierde_local";
    return null;
  }
  /* fix integración: la roja es su propio evento (tipo:"roja"), y el penal errado
     lo marca el motor con ev.penalErrado / P._penalErrado (ver partido.js). */
  if(tipo==="roja"||(tipo==="tarjeta"&&(ev.roja||ev.color==="roja"||ev.rojaDirecta))) return "expulsion";
  if((tipo==="penal"||tipo==="penalRival")&&(ev.penalErrado||ev.err||ev.errado||ev.fallo)) return "penal_errado";
  if(ev.penalErrado) return "penal_errado";
  if((tipo==="atajada"||tipo==="save"||ev.arqueroFigura||(tipo==="chance"&&ev.lado==="rival"))&&Math.random()<0.45) return "arquero_figura";
  return null;
}
function empujarTicker(P, autor, texto, tono, m){
  if(!P) return;
  P.ticker=P.ticker||[];
  P.ticker.unshift({m:m||P.min||0, autor:autor, texto:texto, tono:tono||"neutro"});
  if(P.ticker.length>18) P.ticker.length=18;
}

/* ---------- merge + wrap (se corre al cargar el script) ---------- */
(function aplicarVoz(){
  try{
    if(typeof ARCOS_EQUIPO!=="undefined"){
      Object.keys(ARCOS_NUEVOS).forEach(function(k){
        if(!ARCOS_EQUIPO[k]) ARCOS_EQUIPO[k]=ARCOS_NUEVOS[k];
      });
    }
    if(typeof LOGROS!=="undefined"){
      LOGROS_VOZ.forEach(function(l){
        if(!LOGROS.some(function(x){return x.id===l.id;})){
          LOGROS.push(l);
          if(typeof LOGRO_POR_ID!=="undefined") LOGRO_POR_ID[l.id]=l;
        }
      });
    }
    if(typeof TRIVIA_FUTBOL!=="undefined"){
      TRIVIA_VOZ.forEach(function(t){
        if(!TRIVIA_FUTBOL.some(function(x){return x.q===t.q;})) TRIVIA_FUTBOL.push(t);
      });
    }
    if(typeof HANDLES_HINCHA!=="undefined"){
      HANDLES_BARRIO.forEach(function(h){
        if(HANDLES_HINCHA.indexOf(h)<0) HANDLES_HINCHA.push(h);
      });
    }
    if(typeof PERIODISTAS!=="undefined"){
      PERIODISTAS_FICTICIOS.forEach(function(n){
        if(!PERIODISTAS.some(function(p){return p.n===n;})) PERIODISTAS.push({n:n,m:"radio local"});
      });
    }
  }catch(e){}

  if(typeof tickerPost==="function" && !tickerPost._voz){
    const orig=tickerPost;
    tickerPost=function(P, ev){
      /* antes de Twitter (2008) no hay tuits en el partido: solo relato clásico */
      if(typeof E!=="undefined" && E && (E.anio||2026)<2008) return orig(P, ev);
      try{
        if(P && ev && ev.tipo==="gol"){
          const [yo,ot]=(typeof miMarcador==="function")?miMarcador(P):[P.gl||0,P.gv||0];
          if(yo<=ot) P._ibaAbajo=true;
        }
        const ctx=ctxDeEvento(P, ev);
        if(ctx && Math.random()<0.72){
          const t=tuitDeCtx(ctx);
          if(t){ empujarTicker(P, t.quien, (typeof resolverTokens==="function"&&typeof E!=="undefined"&&E?resolverTokens(t.txt,E):t.txt), tonoDeCtx(ctx), ev.min||P.min||0); return; }
        }
      }catch(e){}
      return orig(P, ev);
    };
    tickerPost._voz=true;
  }

  if(typeof tickerAmbiente==="function" && !tickerAmbiente._voz){
    const origA=tickerAmbiente;
    tickerAmbiente=function(P){
      if(typeof E!=="undefined" && E && (E.anio||2026)<2008) return origA(P);
      try{
        if(P && Math.random()<0.28){
          const t=tuitDeCtx("analogia_dunk");
          if(t){ empujarTicker(P, t.quien, (typeof resolverTokens==="function"&&typeof E!=="undefined"&&E?resolverTokens(t.txt,E):t.txt), "neutro", P.min||0); return; }
        }
      }catch(e){}
      return origA(P);
    };
    tickerAmbiente._voz=true;
  }

  if(typeof preguntasConferencia==="function" && !preguntasConferencia._voz){
    const origC=preguntasConferencia;
    preguntasConferencia=function(part){
      const L=origC(part)||[];
      try{
        const sinGanar=(typeof E!=="undefined"&&E.temporada&&E.temporada.sinGanar)||0;
        const clas=(typeof esClasico==="function")&&part?esClasico(part):false;
        const sit=clas?"clasico_previa":(sinGanar>=3?"racha_sin_ganar":"previa_favorito");
        const extra=PREGUNTAS_VOZ.filter(function(p){return p.sit===sit;});
        extra.slice(0,2).forEach(function(p){
          L.unshift({q:p.q,ops:[
            {t:"Bajar el perfil",k:"calma"},
            {t:"Salir con confianza",k:"confianza"},
            {t:"Un palo y a la cancha",k:"palo"}
          ]});
        });
      }catch(e){}
      return L;
    };
    preguntasConferencia._voz=true;
  }
})();
