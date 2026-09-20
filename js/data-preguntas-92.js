"use strict";
/* ============================================================
   FUTBOLINI · data-preguntas-92.js   (carril Claude)
   "Faltan preguntas, se repite mucho lo de siempre."

   RAÍZ DEL BUG: data-voz.js, data-historico.js, data-grok-beta.js y
   data-formato2026.js inyectan con `PREGUNTAS_VOZ.filter(...).slice(0,2)`.
   El filtro devuelve SIEMPRE el mismo orden → siempre las dos primeras.
   Acá se arregla en la raíz: `elegirPreguntas()` rota por semana, descarta
   lo ya preguntado en la temporada y respeta época, país y tamaño de club.

   Este archivo va ÚLTIMO en index.html (después de ui-jornada.js) y envuelve
   con flag propio `._p92`, SIN romper los wraps `._voz` / `._32` / `._hist`
   / `._beta` / `._fmt54` de adentro.

   NO toca: partido.js, ui-partido.js, mercado.js, util.js, nube.js,
   ventanas.js, federacion-poder.js ni ningún CSS de temas.
   ============================================================ */

/* ---------- atajos de opciones (el texto es único; la clave sigue el patrón) ---------- */
function _q92oc(a,b,c){ return [{t:a,k:"calma"},{t:b,k:"confianza"},{t:c,k:"palo"}]; }
function _q92om(a,b,c){ return [{t:a,k:"mea"},{t:b,k:"confianza"},{t:c,k:"palo"}]; }
function _q92oh(a,b,c){ return [{t:a,k:"humilde"},{t:b,k:"bancar"},{t:c,k:"palo"}]; }
function _q92oe(a,b,c){ return [{t:a,k:"elogio"},{t:b,k:"foco"},{t:c,k:"agrandado"}]; }
function _q92oa(a,b,c){ return [{t:a,k:"mea"},{t:b,k:"respaldo"},{t:c,k:"arbitro"}]; }

/* ============================================================
   A) BANCO GENERAL · situaciones que antes no existían
   Tono: periodista, seco, a veces mala leche. Sin insultos y sin burla.
   fase: "previa" (conferencia) | "post" (sala de prensa)
   dif:  "filosa" (club grande) | "amable" (club chico) | ausente (neutra)
   ============================================================ */
var PREGUNTAS_92=[

  /* ---- post_empate ---- */
  {sit:"post_empate",fase:"post",dif:"filosa",q:"Empate en casa. ¿Punto sumado o dos que se regalaron?",
   ops:_q92oh("Se suma y se sigue, no hay drama","Dos perdidos, lo digo yo primero","El que quiera drama que lo arme afuera")},
  {sit:"post_empate",fase:"post",q:"Empataron con el partido controlado. ¿Qué le faltó al equipo para cerrarlo?",
   ops:_q92oh("Nos faltó el último pase, nada más","Faltó decisión y eso es mío","Faltó que algunos la metan, simple")},
  {sit:"post_empate",fase:"post",dif:"amable",q:"Para un club como este, ¿un empate así se festeja o se guarda callado?",
   ops:_q92oh("Se guarda y se trabaja el lunes","Se valora: este grupo compite","Acá nadie festeja empates")},
  {sit:"post_empate",fase:"post",dif:"filosa",q:"Tercer empate seguido. ¿Es carácter o es miedo a ganar?",
   ops:_q92oa("Es nuestro, no del plantel: yo no encontré la tecla","El grupo compite, lo banco entero","El partido también lo dirigieron otros")},
  {sit:"post_empate",fase:"post",q:"El empate deja la tabla igual. ¿Cambia algo de acá al próximo?",
   ops:_q92oe("Cambia poco, el trabajo es el mismo","Cambia el foco: el próximo es el partido","Cambia que ahora nos van a tener que aguantar")},

  /* ---- lesion_clave ---- */
  {sit:"lesion_clave",fase:"previa",q:"Se cae una pieza importante. ¿Rearma el equipo o mete al que estaba esperando?",
   ops:_q92oc("Se rearma con lo que hay, sin llorar","El que entra está para esto","El que entra va a hacer extrañar a nadie")},
  {sit:"lesion_clave",fase:"previa",dif:"filosa",q:"Un club de este tamaño, ¿puede permitirse depender de un solo jugador?",
   ops:_q92om("No debería, y es responsabilidad mía","Tenemos plantel, se va a ver","Pregúntele eso a los que arman el plantel")},
  {sit:"lesion_clave",fase:"post",q:"Se lesionó otro de los que venían jugando. ¿Es carga de partidos o mala suerte?",
   ops:_q92oh("Es el calendario, no busco culpables","Me hago cargo de la carga que les puse","El calendario lo arma otro, no yo")},
  {sit:"lesion_clave",fase:"previa",dif:"amable",q:"Sin él, la gente teme lo peor. ¿Qué le dice a la hinchada?",
   ops:_q92oc("Que confíe: el que entra se ganó el puesto","Que venga igual, este grupo no se cae","Que el que se caiga de ánimo se quede en casa")},
  {sit:"lesion_clave",fase:"previa",q:"¿La lesión cambia el sistema o solo cambia el nombre en la lista?",
   ops:_q92oc("Cambia el nombre, la idea es la misma","Cambia el sistema, es la ocasión de probar","Cambia lo que yo diga, esa es mi pega")},

  /* ---- rival_puntero ---- */
  {sit:"rival_puntero",fase:"previa",dif:"filosa",q:"Enfrente está el puntero. ¿Va a jugarle de igual a igual o a aguantar?",
   ops:_q92oc("A jugar el partido que toque, sin recetas","De igual a igual, no hay otra manera","Que aguanten ellos, nosotros vamos a ir")},
  {sit:"rival_puntero",fase:"previa",q:"¿Qué le copiaría al puntero, si tuviera que copiarle algo?",
   ops:_q92oc("La regularidad, eso cuesta más que jugar lindo","Nada: tenemos idea propia","Le copiaría el calendario, capaz")},
  {sit:"rival_puntero",fase:"previa",dif:"amable",q:"Nadie les pide nada este domingo. ¿Eso libera al plantel?",
   ops:_q92oc("Libera, pero igual se juega en serio","Libera y hay que aprovecharlo","Que no nos pidan nada es problema de ellos")},
  {sit:"rival_puntero",fase:"previa",q:"Si le ganan al puntero, ¿esto se convierte en otro campeonato para ustedes?",
   ops:_q92oc("Es un partido, no un campeonato","Sería un envión enorme, no lo escondo","Ganemos primero y después hablamos")},
  {sit:"rival_puntero",fase:"previa",dif:"filosa",q:"El puntero les sacó varios puntos. ¿Ya lo da por perdido el torneo?",
   ops:_q92om("Estamos lejos y eso es mío también","Falta mucho, lo digo en serio","Lo damos por perdido cuando no queden fechas")},

  /* ---- racha_ganadora ---- */
  {sit:"racha_ganadora",fase:"previa",q:"Vienen ganando seguido. ¿Cuándo empieza a preocuparle la racha?",
   ops:_q92oc("Cuando el equipo crea que es fácil","No me preocupa, me ocupa","Cuando alguien afuera la use en mi contra")},
  {sit:"racha_ganadora",fase:"previa",dif:"filosa",q:"La gente ya saca cuentas. ¿Usted también saca cuentas?",
   ops:_q92oc("Yo saco cuentas el último domingo","Sacar cuentas ilusiona y eso no es malo","Saco cuentas, sí, y me salen bien")},
  {sit:"racha_ganadora",fase:"previa",dif:"amable",q:"Para este club, una racha así no se ve todos los años. ¿Se lo dice al plantel?",
   ops:_q92oc("Se lo digo para que lo cuiden","Se lo digo para que lo disfruten","No se lo digo: que se enteren ganando")},
  {sit:"racha_ganadora",fase:"previa",q:"¿Toca el once en racha o el que gana no se toca?",
   ops:_q92oc("El que gana se toca si hace falta","Este once se ganó seguir","Toco lo que yo quiera, para eso estoy")},
  {sit:"racha_ganadora",fase:"previa",q:"¿La racha es del equipo o es de un par de nombres?",
   ops:_q92oc("Es del equipo, sin vueltas","Hay nombres finos, pero manda el grupo","Es de los que trabajan, y eso se nota")},

  /* ---- debut_juvenil ---- */
  {sit:"debut_juvenil",fase:"previa",dif:"amable",q:"Hay un cabro de la casa en la lista. ¿Debuta o lo va a llevar a mirar?",
   ops:_q92oc("Va a sumar minutos cuando corresponda","Está para jugar, por eso está","Está porque se lo ganó, no por la foto")},
  {sit:"debut_juvenil",fase:"previa",q:"¿Un debut en un partido como este es regalo o es responsabilidad?",
   ops:_q92oc("Es responsabilidad y lo sabe","Es una oportunidad y está listo","Acá no se regala nada")},
  {sit:"debut_juvenil",fase:"previa",dif:"filosa",q:"En este club debutar es entrar a una vitrina. ¿Lo protege o lo suelta?",
   ops:_q92oc("Lo protejo: tiene diecinueve años","Lo suelto, se gana jugando","Que aprenda rápido, acá el tiempo no sobra")},
  {sit:"debut_juvenil",fase:"post",q:"Debutó el juvenil. ¿Qué vio en él que no se ve en la planilla?",
   ops:_q92oe("Vi que no le tembló la mano","Vi trabajo de la cantera, no un milagro","Vi lo que yo venía diciendo hace meses")},
  {sit:"debut_juvenil",fase:"previa",q:"¿La cantera es un plan del club o es una urgencia del presupuesto?",
   ops:_q92om("Hoy es urgencia, y hay que decirlo","Es un plan, se viene trabajando","Pregúnteselo a los que firman los cheques")},

  /* ---- deuda_alta ---- */
  {sit:"deuda_alta",fase:"previa",dif:"filosa",q:"Los números del club están en todos lados. ¿Eso entra al camarín?",
   ops:_q92oc("No entra: el plantel cobra y trabaja","Entra, pero se habla de frente","Que entre a la oficina, no al camarín")},
  {sit:"deuda_alta",fase:"previa",q:"¿Le dijeron cuánto puede gastar o se enteró por el diario?",
   ops:_q92oc("Lo hablamos adentro, como corresponde","Sé lo que hay y trabajo con eso","Me entero de muchas cosas por el diario")},
  {sit:"deuda_alta",fase:"previa",dif:"amable",q:"Con la caja apretada, ¿se le pide más al plantel o se le pide menos?",
   ops:_q92oc("Se le pide lo mismo de siempre","Se le pide más y ellos responden","Se le pide al que maneja la plata")},
  {sit:"deuda_alta",fase:"previa",q:"Si hay que vender para pagar, ¿usted da el visto bueno?",
   ops:_q92om("Si hay que hacerlo, lo firmo y me hago cargo","Voy a pelear por que no pase","El que quiera vender, que lo explique él")},
  {sit:"deuda_alta",fase:"previa",q:"¿Un club endeudado puede pelear algo o eso es cuento?",
   ops:_q92oc("Se puede, con orden y paciencia","Se puede y lo vamos a demostrar","Se puede si dejan trabajar")},

  /* ---- hinchada_caliente ---- */
  {sit:"hinchada_caliente",fase:"previa",dif:"filosa",q:"La gente está caliente. ¿Se lo merecen o es injusto?",
   ops:_q92om("Se lo merecen y el primero soy yo","Es dura, pero es nuestra gente","Que se caliente con la cancha, no con la vereda")},
  {sit:"hinchada_caliente",fase:"previa",q:"Hubo silbidos el domingo pasado. ¿Le pidió algo al plantel sobre eso?",
   ops:_q92oc("Les pedí que lo entiendan, nada más","Les pedí que lo den vuelta jugando","Les pedí que no escuchen nada")},
  {sit:"hinchada_caliente",fase:"previa",dif:"amable",q:"¿Qué le pide a la gente para este domingo?",
   ops:_q92oc("Que venga, aunque sea a exigir","Que empuje: con ellos somos otros","Que exija, pero de este lado")},
  {sit:"hinchada_caliente",fase:"previa",q:"Se habló de un reclamo en el entrenamiento. ¿Pasó algo de lo que se dijo?",
   ops:_q92oc("De lo interno no hablo, y usted lo sabe","Hablamos de frente y se terminó ahí","Se dijo mucho más de lo que pasó")},
  {sit:"hinchada_caliente",fase:"post",dif:"filosa",q:"La gente se fue en silencio. ¿Le deja algo eso?",
   ops:_q92oa("Me deja que fallé yo","Me deja que hay que devolverles algo","Me deja que hoy también nos costó de arriba")},

  /* ---- mercado_caliente ---- */
  {sit:"mercado_caliente",fase:"previa",q:"Con el mercado abierto, ¿puede prometerle a la gente que no se va nadie?",
   ops:_q92oc("No prometo lo que no depende de mí","Hoy no se va nadie, eso sí lo digo","Se va el que yo diga que se puede ir")},
  {sit:"mercado_caliente",fase:"previa",dif:"filosa",q:"¿Cuántos jugadores pidió y cuántos llegaron?",
   ops:_q92oc("Eso queda adentro, no lo voy a ventilar","Llegó lo que se pudo y estoy conforme","Pedí varios. Cuente usted los que ve")},
  {sit:"mercado_caliente",fase:"previa",q:"¿El mercado le desarma la semana de trabajo?",
   ops:_q92oc("Algo se nota, pero se maneja","El grupo está enfocado, eso lo garantizo","Desarma a los que quieren irse, no a mí")},
  {sit:"mercado_caliente",fase:"previa",dif:"amable",q:"Un club chico, ¿puede decirle que no a una oferta grande?",
   ops:_q92oc("Puede, si el proyecto vale más","Puede y lo va a hacer si hace falta","Puede. Otra cosa es que quiera")},
  {sit:"mercado_caliente",fase:"previa",q:"Si llega una oferta el sábado, ¿el jugador juega el domingo?",
   ops:_q92oc("Juega si está con la cabeza acá","Juega, confío en ellos","Juega el que quiere estar. El resto, afuera")},

  /* ---- ultimo_partido_del_anio ---- */
  {sit:"ultimo_partido_del_anio",fase:"previa",q:"Último partido del año. ¿Hace balance ahora o lo deja para después?",
   ops:_q92oc("El balance después, primero se juega","Hay cosas buenas y las voy a defender","El balance lo hago yo, no la tribuna")},
  {sit:"ultimo_partido_del_anio",fase:"previa",dif:"filosa",q:"¿Se sienta a fin de año con la dirigencia sabiendo que sigue?",
   ops:_q92om("Me siento sabiendo lo que hice, bien y mal","Yo quiero seguir, lo digo claro","Me siento a hablar, no a pedir permiso")},
  {sit:"ultimo_partido_del_anio",fase:"previa",q:"¿Qué es lo primero que va a pedir para la próxima temporada?",
   ops:_q92oc("Tiempo de trabajo, nada más","Dos nombres y una idea clara","Que se cumpla lo que ya se prometió")},
  {sit:"ultimo_partido_del_anio",fase:"previa",dif:"amable",q:"¿Hay alguien del plantel que juega hoy su último partido en el club?",
   ops:_q92oc("Si pasa, lo vamos a despedir como corresponde","Prefiero no adelantar despedidas","Eso se sabrá cuando se firme")},
  {sit:"ultimo_partido_del_anio",fase:"post",q:"Cerró el año. En una frase: ¿qué se lleva?",
   ops:_q92oe("Me llevo el trabajo de este grupo","Me llevo lo que falta, que es bastante","Me llevo que aguantamos todo lo que vino")},

  /* ---- copa_internacional ---- */
  {sit:"copa_internacional",fase:"previa",q:"Se juega afuera del país. ¿El viaje pesa más que el rival?",
   ops:_q92oc("Pesa, pero es parte del asunto","El grupo está preparado para esto","Pesa para el que no está acostumbrado")},
  {sit:"copa_internacional",fase:"previa",dif:"filosa",q:"Un club de esta historia, ¿tiene que pasar de ronda o alcanza con competir?",
   ops:_q92om("Tiene que pasar, y si no, es mío","Vamos a pelearla hasta el final","La historia no juega. Juegan ellos")},
  {sit:"copa_internacional",fase:"previa",q:"¿Prioriza la copa o el campeonato si tiene que elegir?",
   ops:_q92oc("No elijo mientras se pueda con las dos","Vamos por las dos y lo sostengo","Elijo yo, cuando llegue el momento")},
  {sit:"copa_internacional",fase:"previa",dif:"amable",q:"Para este club, jugar un torneo internacional, ¿es premio o es examen?",
   ops:_q92oc("Es examen, y queremos aprobarlo","Es premio y lo vamos a disfrutar compitiendo","Es lo que corresponde, no un regalo")},
  {sit:"copa_internacional",fase:"post",q:"En el torneo internacional el nivel es otro. ¿Dónde se notó la diferencia?",
   ops:_q92oe("Se notó en los detalles, no en las ganas","Se notó en lo que nos falta como plantel","Se notó en cosas que no dependen de nosotros")},

  /* ---- vuelves_de_la_b ---- */
  {sit:"vuelves_de_la_b",fase:"previa",dif:"amable",q:"Volvieron a la categoría. ¿El objetivo es quedarse o se puede pedir más?",
   ops:_q92oc("Primero quedarse, después hablamos","Yo no le pongo techo a este grupo","El techo lo ponen otros, yo no")},
  {sit:"vuelves_de_la_b",fase:"previa",q:"¿Cuánto de lo que sirvió abajo sirve acá arriba?",
   ops:_q92oc("Sirve la cabeza; el resto hay que ajustarlo","Sirve casi todo: este grupo compite","Sirve lo que a mí me funciona")},
  {sit:"vuelves_de_la_b",fase:"previa",q:"¿El plantel del ascenso alcanza para esta categoría?",
   ops:_q92om("Alcanza a medias y lo dije adentro","Alcanza: se ganaron el derecho","Alcanza si llega lo que falta")},
  {sit:"vuelves_de_la_b",fase:"previa",dif:"amable",q:"La gente volvió a llenar. ¿Eso aprieta o empuja?",
   ops:_q92oc("Empuja, y hay que devolverlo","Empuja: es lo mejor que nos pasó","Aprieta al que no está a la altura")},
  {sit:"vuelves_de_la_b",fase:"previa",q:"¿Se olvida de la categoría de abajo o la usa como motor?",
   ops:_q92oc("No se olvida: enseñó mucho","La usamos de motor todos los días","No me gusta mirar para atrás")},

  /* ---- clasico_de_visita ---- */
  {sit:"clasico_de_visita",fase:"previa",dif:"filosa",q:"Clásico de visita. ¿Va a especular o va a proponer?",
   ops:_q92oc("Vamos a jugar el partido que nos convenga","Vamos a proponer, somos así","El que especula pierde. Punto")},
  {sit:"clasico_de_visita",fase:"previa",q:"En la cancha de ellos, ¿el ambiente cambia algo dentro del campo?",
   ops:_q92oc("Cambia el ruido, no el fútbol","Al grupo le gustan estos partidos","Cambia si te asustas. Nosotros no")},
  {sit:"clasico_de_visita",fase:"previa",q:"¿Prefiere jugar el clásico de visita?",
   ops:_q92oc("Se juega donde toque, no elijo","De visita a veces hay más espacio","Prefiero jugarlo y ganarlo, nada más")},
  {sit:"clasico_de_visita",fase:"previa",dif:"amable",q:"Para los más jóvenes del plantel, ¿es un partido o es una prueba?",
   ops:_q92oc("Es un partido. Grande, pero un partido","Es la prueba que querían tener","El que lo sienta prueba, que mire de afuera")},
  {sit:"clasico_de_visita",fase:"post",dif:"filosa",q:"Clásico afuera, resultado en la mano. ¿Qué se lleva del viaje?",
   ops:_q92oe("Me llevo cómo se pararon en un patio ajeno","Me llevo lo que corregimos en el entretiempo","Me llevo que acá nadie se escondió")},

  /* ---- arbitro_polemico ---- */
  {sit:"arbitro_polemico",fase:"post",q:"Hubo una jugada que se va a discutir toda la semana. ¿La vio?",
   ops:_q92oa("La vi y prefiero no alimentarla","La vi: mis jugadores no se quejaron y yo tampoco","La vi. Y la vio todo el estadio")},
  {sit:"arbitro_polemico",fase:"post",dif:"filosa",q:"¿Cree que hubo intención o fue un error como cualquiera?",
   ops:_q92oa("Fue un error y lo dejo ahí","No voy a hablar del árbitro, hablo de los míos","Errores así siempre caen para el mismo lado")},
  {sit:"arbitro_polemico",fase:"post",q:"¿Va a reclamar el club por escrito?",
   ops:_q92oa("Eso lo decide el club, no yo","Nosotros trabajamos, no reclamamos","Si hay que reclamar, se reclama")},
  {sit:"arbitro_polemico",fase:"post",dif:"amable",q:"A los clubes chicos siempre les toca discutir esto. ¿Le pesa?",
   ops:_q92oa("Me pesa, pero no me voy a esconder detrás","Me ocupa más lo nuestro","Pesa. Y a nadie parece importarle")},
  {sit:"arbitro_polemico",fase:"post",q:"Su jugador quedó expulsado. ¿Se le fue a él o lo provocaron?",
   ops:_q92oa("Se le fue y va a asumir la sanción","Lo voy a bancar igual, es de los nuestros","Pasaron cosas antes que nadie sancionó")},

  /* ---- dt_cuestionado ---- */
  {sit:"dt_cuestionado",fase:"previa",dif:"filosa",q:"Hay dirigentes que ya no lo nombran. ¿Se siente respaldado?",
   ops:_q92om("Respaldo se gana, no se pide","Yo trabajo igual, eso no cambia","El que tenga algo que decir, que me llame")},
  {sit:"dt_cuestionado",fase:"previa",q:"Si pierde el domingo, ¿sigue siendo el técnico?",
   ops:_q92oc("Eso no lo decido yo","Yo me veo trabajando el lunes","Yo no me voy a ir solo, eso lo aseguro")},
  {sit:"dt_cuestionado",fase:"previa",dif:"filosa",q:"Suena un nombre para reemplazarlo. ¿Lo escuchó?",
   ops:_q92oc("Se escuchan muchas cosas, es parte del oficio","Mientras esté acá, mando yo","Cuando quieran hablar conmigo, saben dónde estoy")},
  {sit:"dt_cuestionado",fase:"previa",q:"¿El camarín todavía le responde?",
   ops:_q92om("Si no responde, la culpa es mía","Me responde y se ve en la cancha","Pregúnteles a ellos, no a mí")},
  {sit:"dt_cuestionado",fase:"previa",q:"¿Cambia algo de lo suyo o se va con sus convicciones?",
   ops:_q92om("Cambio lo que haya que cambiar","Ajusto, pero la idea no se negocia","Me voy con lo mío, si tengo que irme")},

  /* ---- comodín de previa (cualquier situación) ---- */
  {sit:"*",fase:"previa",q:"¿Cuál fue la corrección más dura que hizo esta semana?",
   ops:_q92oc("Prefiero no exponer a nadie","Corregimos juntos, no hay nombres","La dura fue conmigo mismo")},
  {sit:"*",fase:"previa",q:"¿Qué tiene que pasar para que usted salga conforme del estadio?",
   ops:_q92oc("Que el equipo se reconozca en la cancha","Que ganemos, eso primero","Que nadie tenga nada que decir")},
  {sit:"*",fase:"previa",dif:"filosa",q:"¿Está dirigiendo el equipo que quiere o el que puede?",
   ops:_q92om("El que puedo, y también es mérito mío que no sea más","El que quiero, con lo que hay","Esa pregunta va para otra oficina")},
  {sit:"*",fase:"previa",dif:"amable",q:"¿Qué le diría al hincha que este domingo duda si ir a la cancha?",
   ops:_q92oc("Que venga: lo van a ver competir","Que venga, lo vamos a dejar todo","Que venga cuando quiera. Nosotros vamos igual")},
  {sit:"*",fase:"previa",q:"¿Le cambió algo la cabeza desde que llegó al club?",
   ops:_q92oc("Me cambió el tiempo: acá se corre distinto","Me cambió para bien, estoy cómodo","Me cambió la paciencia, que ya no tengo")},
  {sit:"*",fase:"previa",q:"¿Algo que quiera decir antes de irse, para variar?",
   ops:_q92oc("Gracias y a trabajar","Que nos acompañen el domingo","Que escriban lo que quieran. Nosotros jugamos")},

  /* ---- comodín de post ---- */
  {sit:"*",fase:"post",q:"Ya con el partido jugado, ¿qué se va a mirar dos veces mañana?",
   ops:_q92oe("Los últimos veinte minutos","Cómo salimos desde atrás","Lo que ya sabía y nadie quiso ver")},
  {sit:"*",fase:"post",q:"¿Hubo algo del plan que no salió como lo imaginó?",
   ops:_q92oe("Bastante, y es tarea mía","Salió casi todo, falta afinar","Salió lo que dependía de nosotros")},
  {sit:"*",fase:"post",dif:"filosa",q:"En este club se mide por resultados. ¿Le alcanza con lo de hoy?",
   ops:_q92oe("No me alcanza nunca","Me alcanza para seguir el camino","A mí me alcanza. A otros, nunca")},
  {sit:"*",fase:"post",dif:"amable",q:"¿Qué le dijo al plantel cuando terminó el partido?",
   ops:_q92oe("Que levanten la cabeza","Que esto se construye de a poco","Que el que no crea, que se baje")},
  {sit:"*",fase:"post",q:"¿Cambia algo para la próxima fecha después de esto?",
   ops:_q92oe("Cambia poco: el trabajo es el mismo","Cambia el ánimo y eso vale","Cambia lo que yo decida cambiar")},
  {sit:"*",fase:"post",q:"Una última: ¿le sobró o le faltó equipo hoy?",
   ops:_q92oe("Me faltó a mí, antes que al equipo","Equipo hubo. Faltó puntería","Sobró en la cancha. Faltó afuera")}
];

/* ============================================================
   B) BANCO POR PAÍS · el DT de Boca no recibe preguntas de Chile
   pais: "CL" | "AR". liga opcional (no se usa como filtro duro).
   Solo se activa en épocas de país conocido (no en ligas clonadas ni 1925).
   ============================================================ */
var PREGUNTAS_PAIS=[

  /* ---------- CHILE ---------- */
  {pais:"CL",sit:"*",fase:"previa",q:"En la ANFP se está discutiendo el formato otra vez. ¿Le preguntaron a algún técnico?",
   ops:_q92oc("Supongo que a alguno, yo no soy quién","Ojalá nos escuchen alguna vez","A los técnicos nos avisan cuando ya está firmado")},
  {pais:"CL",sit:"*",fase:"previa",q:"¿La Copa Chile es una oportunidad o es una fecha más en el calendario?",
   ops:_q92oc("Es una competencia y se respeta","Es una oportunidad concreta y la queremos","Es una fecha más para los que ya están clasificados")},
  {pais:"CL",sit:"*",fase:"previa",dif:"filosa",q:"El descenso en Chile se define de maneras raras. ¿Usted entiende el reglamento?",
   ops:_q92oc("Lo entiendo y lo respeto","Lo entiendo: mi trabajo es no mirarlo","Lo entiendo hasta que lo cambian a mitad de año")},
  {pais:"CL",sit:"*",fase:"previa",q:"¿Le parece que el campeonato chileno se juega mejor o peor que hace unos años?",
   ops:_q92oc("Se juega distinto, no me gusta comparar","Hay buenos planteles, se ve","Se juega con menos cancha y más excusas")},
  {pais:"CL",sit:"rival_puntero",fase:"previa",q:"Los grandes de Santiago siempre marcan la agenda. ¿A usted le molesta?",
   ops:_q92oc("Es así en todos lados, no me quita el sueño","Nosotros hacemos ruido en la cancha","Molesta cuando también les marcan el arbitraje")},
  {pais:"CL",sit:"copa_internacional",fase:"previa",q:"El fútbol chileno viene pagando caro afuera. ¿Es nivel o es preparación?",
   ops:_q92oc("Es preparación y es tiempo de trabajo","Es nivel, y se recupera compitiendo","Es cómo llegamos: eso lo arma el calendario")},
  {pais:"CL",sit:"deuda_alta",fase:"previa",q:"Varios clubes chilenos arrastran números difíciles. ¿Es un problema del fútbol o del club?",
   ops:_q92oc("Es del fútbol entero, no de uno solo","Nosotros nos ocupamos de lo nuestro","Es de quienes administraron, sean quienes sean")},
  {pais:"CL",sit:"hinchada_caliente",fase:"previa",q:"Acá la gente exige como en pocos lados. ¿Eso le gusta?",
   ops:_q92oc("Me gusta: significa que les importa","Me gusta y la necesito el domingo","Me gusta si exigen de frente")},
  {pais:"CL",sit:"*",fase:"post",q:"El fútbol chileno se mira mucho a sí mismo. ¿Este partido dice algo del torneo?",
   ops:_q92oe("Dice lo que dice cualquier domingo","Dice que hay equipos que compiten","Dice más de lo que van a escribir")},
  {pais:"CL",sit:"ultimo_partido_del_anio",fase:"previa",q:"En Chile los planteles se arman tarde. ¿Ya sabe con quién cuenta para el próximo año?",
   ops:_q92oc("Sé algo, no todo. Es la costumbre de acá","Estamos trabajándolo desde hace semanas","Me gustaría saberlo antes que los agentes")},
  {pais:"CL",sit:"arbitro_polemico",fase:"post",q:"En el fútbol chileno se habla mucho del arbitraje. ¿Usted quiere entrar a ese tema?",
   ops:_q92oa("No quiero, ya se habla demasiado","Quiero hablar de mis jugadores","Voy a entrar cuando dejen de mirar para el lado")},
  {pais:"CL",sit:"mercado_caliente",fase:"previa",q:"Los clubes chilenos venden apenas aparece la oferta. ¿Se puede sostener un proyecto así?",
   ops:_q92oc("Se puede si se reemplaza bien","Se puede: vendemos y seguimos compitiendo","Se sostiene poco, seamos honestos")},

  /* ---------- ARGENTINA ---------- */
  {pais:"AR",sit:"*",fase:"previa",q:"En la AFA los formatos cambian seguido. ¿Alcanzó a entender el de este año?",
   ops:_q92oc("Lo entiendo, uno se adapta","Lo entiendo y no me cambia el trabajo","Lo entiendo el día que lo explican dos veces")},
  {pais:"AR",sit:"*",fase:"previa",q:"¿La Copa Argentina entra en los planes o es un ruido más en el calendario?",
   ops:_q92oc("Entra: es una competencia corta y traicionera","Entra y la queremos jugar en serio","Entra si alguien nos deja llegar enteros")},
  {pais:"AR",sit:"*",fase:"previa",dif:"filosa",q:"Acá se vive del Superclásico aunque falten meses. ¿Usted también?",
   ops:_q92oc("Yo vivo del próximo partido","Es un partido enorme, pero es uno","Yo vivo del domingo. El resto es relleno")},
  {pais:"AR",sit:"*",fase:"previa",q:"La tabla anual manda para las copas. ¿La mira o la esconde?",
   ops:_q92oc("La miro, es parte del trabajo","La miramos y es una motivación","La miro cuando me conviene, como todos")},
  {pais:"AR",sit:"rival_puntero",fase:"previa",q:"En Argentina cualquier equipo te complica. ¿Eso es virtud o desorden?",
   ops:_q92oc("Es virtud: acá se compite de verdad","Es lo que hace lindo este torneo","Es desorden, pero es el que tenemos")},
  {pais:"AR",sit:"copa_internacional",fase:"previa",q:"Los clubes argentinos llegan lejos afuera. ¿Ese peso acompaña o exige?",
   ops:_q92oc("Exige, y hay que estar a la altura","Acompaña: se juega distinto","Exige a los jugadores. A los dirigentes, menos")},
  {pais:"AR",sit:"hinchada_caliente",fase:"previa",q:"La hinchada argentina no perdona dos partidos malos. ¿Lo asume?",
   ops:_q92oc("Lo asumo, es parte del oficio","Lo asumo y lo prefiero así","Lo asumo. Otros no asumen nada")},
  {pais:"AR",sit:"vuelves_de_la_b",fase:"previa",q:"Volver de la categoría de abajo en Argentina cuesta años. ¿Cómo se sostiene?",
   ops:_q92oc("Con orden y sin promesas grandes","Con este grupo, que ya demostró","Sosteniendo lo que se prometió arriba")},
  {pais:"AR",sit:"mercado_caliente",fase:"previa",q:"El jugador argentino se va cada vez más joven. ¿Se puede armar un equipo así?",
   ops:_q92oc("Se puede, pero hay que formar todo el tiempo","Se puede: la cantera responde","Se puede si no venden también al que queda")},
  {pais:"AR",sit:"*",fase:"post",q:"En Argentina el resultado tapa todo. ¿Hoy tapó algo?",
   ops:_q92oe("Hoy no tapa nada, hay cosas que corregir","Hoy el resultado fue justo","Hoy tapa lo que algunos querían contar")},
  {pais:"AR",sit:"arbitro_polemico",fase:"post",q:"Acá el arbitraje es un tema semanal. ¿Suma hablar de eso?",
   ops:_q92oa("No suma, y por eso no lo hago","Prefiero hablar de lo que hicimos nosotros","Suma cuando nadie más lo dice")},
  {pais:"AR",sit:"dt_cuestionado",fase:"previa",dif:"filosa",q:"En Argentina un técnico dura lo que dura la racha. ¿Lo tiene asumido?",
   ops:_q92om("Asumido desde el primer día","Yo trabajo como si me quedara mucho","Dura lo que dura el que lo contrató")}
];

/* ============================================================
   C) BANCO DE ÉPOCA · lo que se preguntaba en cada era jugable
   era: "1991" | "2006" | "2026". Nada anacrónico entra al otro lado.
   ============================================================ */
var PREGUNTAS_EPOCA=[

  /* ---------- 1991 ---------- */
  {era:"1991",sit:"*",fase:"previa",q:"La radio va a transmitir el partido. ¿Le molesta que se cuente jugada a jugada?",
   ops:_q92oc("No me molesta, es lo que hay","La radio acerca a la gente que no puede venir","Cuenten lo que quieran, yo dirijo igual")},
  {era:"1991",sit:"*",fase:"previa",q:"Con dos puntos por partido ganado, ¿empatar afuera es buen negocio?",
   ops:_q92oc("Depende del partido, no hay regla","Nosotros salimos a ganar siempre","Buen negocio es ganar. Lo demás es cuento")},
  {era:"1991",sit:"*",fase:"previa",q:"La cancha viene pesada por la lluvia. ¿Eso los perjudica?",
   ops:_q92oc("Es la misma para los dos","Nos acomoda: somos de pelear","Perjudica al que quiere jugar bonito")},
  {era:"1991",sit:"*",fase:"previa",dif:"amable",q:"Viajan en bus toda la noche. ¿Llega bien un plantel así?",
   ops:_q92oc("Llega como siempre, estamos acostumbrados","Llega entero, el grupo es duro","Llega como puede. Ojalá alguien lo note")},
  {era:"1991",sit:"*",fase:"previa",dif:"filosa",q:"El pase del jugador lo tiene el club. ¿Eso le da tranquilidad o le trae problemas?",
   ops:_q92oc("Tranquilidad para trabajar, nada más","Me da plantel para el año entero","Trae problemas cuando alguien quiere irse igual")},
  {era:"1991",sit:"*",fase:"previa",q:"¿Cuánto vio del rival antes de este partido?",
   ops:_q92oc("Lo que se pudo: informes y un par de partidos","Lo suficiente para saber cómo juega","Vi lo que me dejaron ver")},
  {era:"1991",sit:"*",fase:"post",q:"Los diarios de mañana van a titular fuerte. ¿Los va a leer?",
   ops:_q92oe("Los leo, es parte del trabajo","Los leo el lunes, con calma","Los leo para saber quién escribe qué")},
  {era:"1991",sit:"*",fase:"previa",q:"El fútbol chileno acaba de vivir un año grande en el continente. ¿Eso levanta la vara?",
   ops:_q92oc("Levanta la vara para todos, y está bien","Ojalá nos empuje a competir mejor","La vara la levantan los que ganan, no los que hablan")},
  {era:"1991",sit:"*",fase:"previa",dif:"amable",q:"El estadio se llena aunque no haya televisión. ¿Qué dice eso de la gente?",
   ops:_q92oc("Dice que el fútbol se ve en la cancha","Dice que tenemos una hinchada enorme","Dice más de ellos que de nosotros")},
  {era:"1991",sit:"*",fase:"post",q:"No hubo cámaras en varias jugadas. ¿Confía en lo que vio desde el banco?",
   ops:_q92oa("Confío a medias: desde el banco se ve poco","Confío en mis jugadores, que estaban ahí","Confío en lo que vi, y vi bastante")},
  {era:"1991",sit:"*",fase:"previa",q:"Se habla de un refuerzo que llega de afuera. ¿Ya lo tiene en la cabeza?",
   ops:_q92oc("Cuando llegue, hablamos","Si llega, suma. Mientras tanto, los que están","Yo trabajo con los que se ponen la camiseta hoy")},
  {era:"1991",sit:"*",fase:"previa",dif:"filosa",q:"Con dos cambios por partido, ¿se puede corregir algo a mitad de camino?",
   ops:_q92oc("Se corrige hablando, no cambiando","Se corrige con los que entran, bien elegidos","Se corrige poco. Por eso hay que arrancar bien")},

  /* ---------- 2006 ---------- */
  {era:"2006",sit:"*",fase:"previa",q:"Con Apertura y Clausura, ¿un mal arranque ya es media temporada perdida?",
   ops:_q92oc("Es corto, hay que sumar rápido","Estamos a tiempo, faltan fechas","Es corto para nosotros y largo para las excusas")},
  {era:"2006",sit:"*",fase:"previa",dif:"filosa",q:"El torneo se define en play-offs. ¿Eso premia al regular o al que llega caliente?",
   ops:_q92oc("Premia al que llega mejor, y es válido","A nosotros nos sirve: somos de partidos grandes","Premia al que tiene suerte en dos partidos")},
  {era:"2006",sit:"*",fase:"previa",q:"La fase de grupos deja cuentas raras. ¿Ya sabe con qué clasifica?",
   ops:_q92oc("Sé lo que necesito: ganar","No hago cuentas, hago partidos","Las cuentas las hacen otros. Yo hago el equipo")},
  {era:"2006",sit:"*",fase:"previa",q:"El cable transmite casi todo. ¿Se dirige distinto sabiendo que hay cámaras?",
   ops:_q92oc("Se dirige igual, uno se olvida","La cámara no juega, no me condiciona","Se dirige igual. Lo que cambia es cómo lo cuentan")},
  {era:"2006",sit:"*",fase:"previa",dif:"amable",q:"Muchos chicos se van a Europa apenas rinden. ¿Le cambia el plan?",
   ops:_q92oc("Cambia el plan y hay que rehacerlo","El club necesita vender, lo entiendo","Cambia el plan de los que se quedan, que son más")},
  {era:"2006",sit:"*",fase:"previa",q:"¿Cuánto le sirve el video del rival para preparar un partido?",
   ops:_q92oc("Sirve, pero no reemplaza la cancha","Sirve mucho: vemos todo lo que podemos","Sirve si el que lo mira sabe qué buscar")},
  {era:"2006",sit:"*",fase:"post",q:"El partido se va a repetir toda la noche en la televisión. ¿Le incomoda?",
   ops:_q92oe("No me incomoda, se ve lo que pasó","Prefiero que lo vean: fuimos justos","Que lo repitan. Ojalá repitan todo")},
  {era:"2006",sit:"*",fase:"previa",q:"El torneo internacional de mitad de año aprieta el calendario. ¿Rota o no rota?",
   ops:_q92oc("Roto lo justo, sin romper el equipo","Tengo plantel y lo voy a usar","Roto yo, cuando yo diga")},
  {era:"2006",sit:"*",fase:"previa",dif:"filosa",q:"Los clubes pasaron a manejarse como empresa. ¿Eso le quita o le suma al técnico?",
   ops:_q92oc("Suma orden si está bien hecho","A mí me dejan trabajar, no me quejo","Quita cuando el que decide no vio nunca un entrenamiento")},
  {era:"2006",sit:"*",fase:"previa",q:"Con tres puntos por victoria, ¿el empate quedó devaluado?",
   ops:_q92oc("Quedó devaluado y está bien","Nosotros salimos por los tres","Quedó devaluado para el que sale a no perder")},
  {era:"2006",sit:"*",fase:"post",q:"Los mensajes de texto ya andan circulando con versiones. ¿Le llega ese ruido?",
   ops:_q92oe("Algo llega, no le doy pelota","Yo hablo acá, no por ahí","Llega. Y sé de dónde sale")},
  {era:"2006",sit:"*",fase:"previa",dif:"amable",q:"Con tres cambios por partido, ¿alcanza para mover un partido trabado?",
   ops:_q92oc("Alcanza si se eligen bien","Alcanza: tengo banco para eso","Alcanza poco, pero es lo que hay")},

  /* ---------- 2026 ---------- */
  {era:"2026",sit:"*",fase:"previa",q:"¿El plantel tiene permitido mirar redes sociales la semana del partido?",
   ops:_q92oc("Son grandes, no soy el papá de nadie","Confío en ellos, ya lo hablamos","Que miren. Total, ahí no se juega")},
  {era:"2026",sit:"*",fase:"post",dif:"filosa",q:"Hubo una revisión del VAR que va a dar que hablar. ¿Le explicaron algo en cancha?",
   ops:_q92oa("Me explicaron poco y prefiero dejarlo ahí","Confío en que se revisó bien","Me explicaron tanto como al público: nada")},
  {era:"2026",sit:"*",fase:"previa",q:"El VAR alarga los partidos y enfría a la gente. ¿Le gusta como está?",
   ops:_q92oc("Me gusta que se acierte, aunque cueste","Si sirve para cobrar bien, vale la pena","No me gusta. Pero nadie nos preguntó")},
  {era:"2026",sit:"*",fase:"previa",q:"Los datos físicos del plantel andan circulando. ¿Los usa para el once?",
   ops:_q92oc("Los uso como una parte, no como la verdad","Los usamos: ayudan a cuidar al plantel","Los uso yo. No los que los publican")},
  {era:"2026",sit:"*",fase:"previa",dif:"amable",q:"Un club chico hoy compite contra presupuestos enormes. ¿Es pelea pareja?",
   ops:_q92oc("No es pareja, pero se juega igual","Se compite con ideas, no solo con plata","Pareja no es. Y todos lo saben")},
  {era:"2026",sit:"*",fase:"previa",dif:"filosa",q:"Un post del club encendió a la hinchada. ¿Usted sabía que iba a salir?",
   ops:_q92oc("De comunicación no opino, no es mi área","Lo hablamos, estamos alineados","Me enteré igual que usted")},
  {era:"2026",sit:"*",fase:"previa",q:"Con cinco cambios se puede cambiar medio equipo. ¿Eso mejoró el juego?",
   ops:_q92oc("Mejoró el cuidado del jugador, sobre todo","Nos da más partido para manejar","Mejoró para el que tiene plantel largo")},
  {era:"2026",sit:"*",fase:"previa",q:"Los agentes hoy mueven todo. ¿Con quién negocia usted: con el jugador o con su representante?",
   ops:_q92oc("Yo hablo con el jugador. Lo otro es del club","Hablo con quien haga falta, sin problema","Hablo con el que se pone la camiseta")},
  {era:"2026",sit:"*",fase:"post",q:"El resumen se va a cortar en diez segundos y se va a viralizar. ¿Le preocupa?",
   ops:_q92oe("No me preocupa: el partido son noventa minutos","Que se vea lo bueno, también hubo","Me preocupa que alguien crea que eso fue el partido")},
  {era:"2026",sit:"*",fase:"previa",q:"Se habla de una cláusula de salida en uno de sus titulares. ¿Eso le condiciona el once?",
   ops:_q92oc("No condiciona nada, juega el que está mejor","Está con nosotros y responde","Condiciona al que la firmó, no a mí")},
  {era:"2026",sit:"*",fase:"previa",dif:"filosa",q:"Hoy un técnico responde también por lo que pasa fuera de la cancha. ¿Le parece justo?",
   ops:_q92om("Es parte del cargo, lo asumo","Me ocupo de todo lo que pueda controlar","Justo sería que respondan todos, no solo uno")},
  {era:"2026",sit:"*",fase:"post",q:"En un rato va a estar todo comentado en las redes. ¿Lo va a mirar?",
   ops:_q92oe("No, prefiero ver el partido de nuevo","Miro poco, prefiero hablar con el plantel","Voy a mirar. Después de todo, escriben de nosotros")}
];

/* ============================================================
   D) ÉPOCA · nada anacrónico
   Cada término tiene el año DESDE el que es posible nombrarlo. Se aplica
   a TODO el banco (incluido PREGUNTAS_VOZ), que es donde estaba el hueco:
   en 1991 salía «¿el plantel está autorizado a mirar redes?».
   ============================================================ */
var TERMINOS_EPOCA=[
  {re:/\bVAR\b|videoarbitraje|video\s?arbitraje/i,                       desde:2018},
  {re:/TikTok|Instagram|streaming/i,                                     desde:2012},
  {re:/redes sociales|\bredes\b|Twitter|hashtag|\btuit|viral|YouTube|WhatsApp/i, desde:2007},
  {re:/internet|p[áa]gina web|correo electr[óo]nico/i,                   desde:1998},
  {re:/celular|mensajes? de texto/i,                                     desde:2000},
  {re:/Copa Sudamericana/i,                                              desde:2002},
  {re:/Copa de la Liga|Supercopa/i,                                      desde:2013},
  {re:/fair play financiero/i,                                           desde:2011},
  {re:/\bGPS\b|datos f[íi]sicos|anal[íi]tica/i,                          desde:2010},
  {re:/pandemia|videollamada/i,                                          desde:2020},
  {re:/Liga Profesional/i,                                               desde:2020},
  {re:/Copa Argentina/i,                                                 desde:2011},
  {re:/\bapp\b|aplicaci[óo]n del club/i,                                 desde:2010},
  {re:/Mundial de Clubes/i,                                              desde:2000},
  {re:/multipropiedad/i,                                                 desde:2015},
  {re:/sociedad an[óo]nima|\bSADP\b/i,                                   desde:2006},
  {re:/cl[áa]usula de (salida|rescisi[óo]n)/i,                           desde:1996},
  {re:/cinco cambios|quinto cambio/i,                                    desde:2020},
  {re:/pantalla gigante/i,                                               desde:1995},
  {re:/play-?offs?|playoffs?/i,                                          desde:1996}
];

/* Bucket de época jugable a partir del año en curso. */
function eraDePregunta(anio){
  anio=anio||((typeof E!=="undefined"&&E&&E.anio)||2026);
  if(anio<=1930) return "1925";
  if(anio<=1995) return "1991";
  if(anio<=2015) return "2006";
  return "2026";
}
/* ¿el texto nombra algo que todavía no existía ese año? */
function textoAnacronico(txt,anio){
  if(!txt) return false;
  anio=anio||((typeof E!=="undefined"&&E&&E.anio)||2026);
  for(var i=0;i<TERMINOS_EPOCA.length;i++){
    var t=TERMINOS_EPOCA[i];
    if(anio<t.desde && t.re.test(txt)) return true;
  }
  return false;
}
function _q92EraOk(p,anio){
  if(!p||!p.q) return false;
  if(textoAnacronico(p.q,anio)) return false;
  if(Array.isArray(p.ops) && p.ops.some(function(o){ return textoAnacronico(o&&o.t,anio); })) return false;
  if(p.era && String(p.era)!==eraDePregunta(anio)) return false;
  if(p.desde!=null && anio<p.desde) return false;
  if(p.hasta!=null && anio>p.hasta) return false;
  return true;
}

/* ============================================================
   E) PAÍS · de qué liga es el club que dirijo
   Devuelve "CL" | "AR" | null (null = liga clonada o época sin país claro:
   ahí solo se usa el banco genérico, para no meterle la ANFP a un club danés).
   ============================================================ */
function paisDeBanco(){
  if(typeof E==="undefined"||!E) return null;
  var base=E.eraBase;
  if(typeof esEraHardcode==="function" && !esEraHardcode(base) && !esEraHardcode(+base)) return null;
  if(base===1925||base==="1925") return null;
  var p=(typeof paisDeEra==="function")?paisDeEra(base):"chile";
  if(p==="argentina") return "AR";
  if(p==="chile") return "CL";
  return null;
}
function _q92PaisOk(p){
  if(!p||!p.pais) return true;
  return p.pais===paisDeBanco();
}

/* ============================================================
   F) DIFICULTAD POR TAMAÑO DE CLUB
   Colo-Colo, la U, la UC, Boca, River: preguntas más filosas y una más
   por rueda. Club chico: más amables. Sale de E.ind (prestigio manda).
   ============================================================ */
function presionClub(){
  if(typeof E==="undefined"||!E||!E.ind) return 50;
  var pres=E.ind.prestigio!=null?E.ind.prestigio:50;
  var hin=E.ind.hinchada!=null?E.ind.hinchada:50;
  return Math.round(pres*0.75+hin*0.25);
}
function durezaClub(){
  var p=presionClub();
  return p>=64?"grande":(p<=44?"chico":"medio");
}
/* cuántas preguntas se inyectan por rueda (el grande aguanta una más) */
function preguntasPorRueda(){ return durezaClub()==="grande"?3:2; }
/* puntaje determinista: primero lo que corresponde al tamaño del club */
function _q92Puntaje(p){
  var d=durezaClub();
  if(d==="grande") return p.dif==="filosa"?0:(p.dif==="amable"?2:1);
  if(d==="chico")  return p.dif==="amable"?0:(p.dif==="filosa"?2:1);
  return p.dif?1:0;
}

/* ============================================================
   G) EL ELEGIDOR · acá se arregla la repetición
   Rota por semana (E.anio*100+E.idx), descarta lo ya preguntado ESTA
   temporada y es determinista: la misma semana da siempre lo mismo
   (si no, el guardado mostraría preguntas distintas al recargar).
   ============================================================ */
function _q92Semana(){
  if(typeof E==="undefined"||!E) return 0;
  return ((E.anio||0)*100)+(E.idx||0);
}
function _q92Hash(s){
  s=String(s||""); var h=5381;
  for(var i=0;i<s.length;i++){ h=((h*33)^s.charCodeAt(i))>>>0; }
  return h.toString(36);
}
function _q92Clave(p){ return (p&&p.id)?String(p.id):_q92Hash((p&&p.sit||"")+"|"+(p&&p.q||"")); }
function _q92Usadas(){
  if(typeof E==="undefined"||!E) return {};
  if(!E.flags) E.flags={};
  if(!E.flags.qUsadas||typeof E.flags.qUsadas!=="object") E.flags.qUsadas={};
  return E.flags.qUsadas;
}
/* limpia el registro (arranque de temporada): el banco vuelve entero */
function limpiarPreguntasUsadas(){ if(typeof E!=="undefined"&&E&&E.flags) E.flags.qUsadas={}; }

/* De lo que queda libre, primero lo que de verdad corresponde:
   1) la pregunta escrita PARA esa situación (antes que el comodín),
   2) el filo que pide el tamaño del club (A5: grande = filosa, chico = amable).
   Si no alcanza para llenar la rueda, se abre la mano. */
function _q92Preferidas(libres,sit,n){
  var esp=(sit&&sit!=="*")?libres.filter(function(p){ return p.sit===sit; }):[];
  var base=esp.length>=n?esp:libres;
  var d=durezaClub();
  if(d==="grande"||d==="chico"){
    var t=(d==="grande")?"filosa":"amable";
    var tier=base.filter(function(p){ return p.dif===t; });
    if(tier.length>=n) return tier;
  }
  return base;
}
/* elegirPreguntas(pool, sit, n) — el corazón del parche.
   pool: banco de preguntas · sit: situación ("*" = comodín) · n: cuántas.
   Determinista por semana, sin repetir dentro de la temporada. */
function elegirPreguntas(pool,sit,n,fase,estricto,excluir){
  n=n||2;
  if(!Array.isArray(pool)||!pool.length) return [];
  var anio=(typeof E!=="undefined"&&E&&E.anio)||2026;
  var cand=pool.filter(function(p){
    if(!p||!p.q) return false;
    if(sit && p.sit!=null && p.sit!==sit && p.sit!=="*") return false;
    if(fase && p.fase && p.fase!==fase) return false;
    if(!_q92PaisOk(p)) return false;
    if(excluir&&excluir[_q92Clave(p)]) return false;
    return _q92EraOk(p,anio);
  });
  if(!cand.length) return [];
  cand=cand.map(function(p,i){ return {p:p,i:i,s:_q92Puntaje(p)}; })
           .sort(function(a,b){ return (a.s-b.s)||(a.i-b.i); })
           .map(function(x){ return x.p; });
  var us=_q92Usadas(), sem=_q92Semana();
  /* lo ya preguntado ESTA temporada sale del sorteo; lo de esta misma semana
     se queda (si no, volver a abrir la conferencia daría otras preguntas). */
  var libres=cand.filter(function(p){ var k=_q92Clave(p); return us[k]==null||us[k]===sem; });
  if(!libres.length){
    if(estricto) return [];                        /* que responda otro banco */
    libres=cand;                                   /* banco agotado: se libera */
  }
  libres=_q92Preferidas(libres,sit,n);
  var out=[], vistos={};
  for(var i=0;i<libres.length&&out.length<n;i++){
    var p=libres[(sem*7+i)%libres.length], k=_q92Clave(p);
    if(vistos[k]) continue;
    vistos[k]=true; out.push(p);
  }
  out.forEach(function(x){ us[_q92Clave(x)]=sem; });
  var ks=Object.keys(us);
  if(ks.length>400) ks.slice(0,ks.length-400).forEach(function(k){ delete us[k]; });
  return out;
}

/* el banco genérico completo (lo viejo + lo nuevo), sin el banco de país */
function bancoPreguntas(){
  var pool=[];
  if(typeof PREGUNTAS_VOZ!=="undefined"&&Array.isArray(PREGUNTAS_VOZ)) pool=pool.concat(PREGUNTAS_VOZ);
  return pool.concat(PREGUNTAS_92,PREGUNTAS_EPOCA);
}
/* 1 del país + 1 genérica, nunca dos del mismo banco seguidas */
function elegirMezclado(sit,n,fase){
  n=n||2;
  var nPais=paisDeBanco()?Math.ceil(n/2):0;
  /* el banco de país es estricto: si ya se usó todo, contesta el genérico
     en vez de repetir (esa era la queja del autor). */
  var pais=nPais?elegirPreguntas(PREGUNTAS_PAIS,sit,nPais,fase,true):[];
  var gen=elegirPreguntas(bancoPreguntas(),sit,n-pais.length,fase);
  var out=[], i=0, j=0, turnoPais=pais.length>0;
  while(out.length<n&&(i<pais.length||j<gen.length)){
    if(turnoPais&&i<pais.length) out.push(pais[i++]);
    else if(!turnoPais&&j<gen.length) out.push(gen[j++]);
    else if(i<pais.length) out.push(pais[i++]);
    else if(j<gen.length) out.push(gen[j++]);
    turnoPais=!turnoPais;
  }
  return out;
}
/* recorre las situaciones detectadas hasta juntar n preguntas */
/* Reparte los cupos de la rueda: alterna banco de país / banco genérico
   (nunca dos seguidas del mismo) y va rotando la situación, para que la
   conferencia no quede entera sobre el mismo tema. Nada se marca como usado
   si no se usa: `vistos` se pasa como exclusión, no se descarta después. */
function elegirPorSits(sits,n,fase){
  var out=[], vistos={};
  var lista=(sits||[]).slice(); lista.push("*");
  var hayPais=!!paisDeBanco(), sitUsado={};
  /* pasada 0: situaciones que todavía no dieron pregunta propia en esta rueda.
     pasada 1: se repite situación antes que quedarse sin pregunta. */
  function buscar(pool,estricto){
    for(var pasada=0;pasada<2;pasada++){
      for(var k=0;k<lista.length;k++){
        var sit=lista[k];
        if(pasada===0&&sitUsado[sit]) continue;
        var r=elegirPreguntas(pool,sit,1,fase,estricto,vistos);
        if(!r.length) continue;
        if(r[0].sit===sit) sitUsado[sit]=true;     /* el comodín no gasta la situación */
        return r[0];
      }
    }
    return null;
  }
  for(var slot=0;slot<n;slot++){
    var turnoPais=hayPais&&(slot%2===0);
    var p=turnoPais?buscar(PREGUNTAS_PAIS,true):null;
    if(!p) p=buscar(bancoPreguntas(),false);       /* si el país no tiene, el genérico contesta */
    if(!p&&!turnoPais&&hayPais) p=buscar(PREGUNTAS_PAIS,true);
    if(!p) break;
    vistos[_q92Clave(p)]=true; out.push(p);
  }
  return out;
}

/* ============================================================
   H) SITUACIONES · de qué se pregunta hoy
   ============================================================ */
function _q92Racha(){                                /* triunfos al hilo */
  if(typeof E==="undefined"||!E||!E.calendario) return 0;
  var n=0;
  for(var i=(E.idx||0)-1;i>=0;i--){
    var p=E.calendario[i];
    if(!p||!p.jugado||p.tipo==="amistoso") continue;
    if((p.gf||0)>(p.gc||0)) n++; else break;
  }
  return n;
}
function _q92PosRival(part){
  try{
    if(!part||!part.rivalId||typeof tablaOrdenada!=="function") return 0;
    var t=tablaOrdenada();
    for(var i=0;i<t.length;i++){ if(t[i]&&t[i].id===part.rivalId) return i+1; }
  }catch(e){}
  return 0;
}
function _q92VuelveDeLaB(){
  try{
    if(!E||!Array.isArray(E.memoria)) return false;
    if((E.idx||0)>8) return false;
    return E.memoria.some(function(m){ return m&&m.tipo==="categoria"&&/ascend/i.test(m.txt||"")&&m.anio===(E.anio-1); });
  }catch(e){}
  return false;
}
/* situaciones de PREVIA (conferencia), de la más específica a la más general */
function sitsPrevia(part){
  var s=[];
  try{
    if(typeof E==="undefined"||!E) return s;
    var clas=(typeof esClasico==="function")&&part?esClasico(part):false;
    var sinGanar=(E.temporada&&E.temporada.sinGanar)||0;
    var racha=_q92Racha();
    var posRiv=_q92PosRival(part);
    var ultima=E.calendario&&((E.idx||0)>=E.calendario.length-1);
    var inter=part&&part.tipo==="copa"&&/Libertadores|Sudamericana|CONMEBOL|Intercontinental|Recopa/i.test(part.torneo||"");
    if(clas&&part&&!part.local) s.push("clasico_de_visita");
    if(inter) s.push("copa_internacional");
    if(ultima) s.push("ultimo_partido_del_anio");
    if(sinGanar>=4||((E.grupos&&E.grupos.directorio&&E.grupos.directorio.aprob)||0)<=-30) s.push("dt_cuestionado");
    if(_q92VuelveDeLaB()) s.push("vuelves_de_la_b");
    if(posRiv&&posRiv<=2) s.push("rival_puntero");
    if(racha>=3) s.push("racha_ganadora");
    if((E.deuda||0)>=180) s.push("deuda_alta");
    if(((E.ind&&E.ind.hinchada)||50)<42||((E.grupos&&E.grupos.hinchada&&E.grupos.hinchada.aprob)||0)<=-30) s.push("hinchada_caliente");
    if(typeof mercadoAbierto==="function"&&mercadoAbierto()) s.push("mercado_caliente");
    if(Array.isArray(E.plantel)){
      if(E.plantel.some(function(j){ return j&&j.lesion&&(j.lesion.fechas||j.lesion)>0&&(j.nivel||0)>=70; })) s.push("lesion_clave");
      if(E.plantel.some(function(j){ return j&&(j.edad||99)<=19&&(j.minutosTemporada||0)>0; })) s.push("debut_juvenil");
    }
    /* las situaciones que ya existían en el banco viejo siguen vivas */
    if(clas&&part&&part.local) s.push("clasico_previa");
    if(sinGanar>=3) s.push("racha_sin_ganar");
    var fav=false;
    try{
      if(part&&typeof fuerzaEquipo==="function"&&typeof onceIdeal==="function")
        fav=fuerzaEquipo(onceIdeal()).base>(part.fuerzaRival||55)+6;
    }catch(e2){}
    if(fav) s.push("previa_favorito");
  }catch(e){}
  return s;
}
/* situaciones de POST (sala de prensa) */
function sitsPost(res,P){
  var s=[];
  try{
    if(typeof E==="undefined"||!E) return s;
    var yo=(res&&res.yo)||0, otro=(res&&res.otro)||0;
    var part=P&&P.part;
    var clas=(typeof esClasico==="function")&&part?esClasico(part):false;
    if(P&&(P.tuvoRoja||P.rojas)) s.push("arbitro_polemico");
    if(yo===otro) s.push("post_empate");
    if(res&&res.lesionados&&res.lesionados.length) s.push("lesion_clave");
    if(clas&&part&&!part.local) s.push("clasico_de_visita");
    if(part&&part.tipo==="copa"&&/Libertadores|Sudamericana|CONMEBOL/i.test(part.torneo||"")) s.push("copa_internacional");
    if(E.calendario&&(E.idx||0)>=E.calendario.length-1) s.push("ultimo_partido_del_anio");
    if(_q92Racha()>=3) s.push("racha_ganadora");
    if(((E.ind&&E.ind.hinchada)||50)<42) s.push("hinchada_caliente");
    /* las situaciones que ya existían en el banco viejo siguen vivas */
    if(yo<otro) s.push("post_derrota");
    if(yo>otro&&(yo-otro)>=3) s.push("post_goleada");
    if(clas) s.push("post_clasico");
    if((E.temporada&&E.temporada.sinGanar||0)>=3) s.push("racha_sin_ganar");
    try{
      var fig=(typeof figuraPartido==="function")?figuraPartido(P):null;
      if(fig&&Array.isArray(E.plantel)&&E.plantel.some(function(j){ return j&&j.n===fig.n&&(j.edad||99)<=21; })) s.push("figura_juvenil");
    }catch(e3){}
  }catch(e){}
  return s;
}

/* ============================================================
   I) WRAPS · se saca lo que inyectaron los slice(0,2) y se pone lo bueno
   ============================================================ */
function _q92TextosVoz(){
  var m={};
  if(typeof PREGUNTAS_VOZ!=="undefined"&&Array.isArray(PREGUNTAS_VOZ))
    PREGUNTAS_VOZ.forEach(function(p){ if(p&&p.q) m[p.q]=true; });
  return m;
}
/* saca de la lista lo inyectado por los wraps rotos (voz/hist/beta/p92) */
function _q92Limpiar(L){
  var vozTxt=_q92TextosVoz();
  return (L||[]).filter(function(x){
    if(!x) return false;
    if(x.id&&/^(voz|hist|beta|p92)_/.test(String(x.id))) return false;
    if(x.q&&vozTxt[x.q]) return false;
    return true;
  });
}
function _q92OpsPrevia(){
  return _q92oc(_q92T("q92_calma","Bajar el perfil"),_q92T("q92_confianza","Salir con confianza"),_q92T("q92_palo","Un palo y a la cancha"));
}
function _q92OpsPost(){
  return _q92oh(_q92T("q92_humilde","Bajar el perfil"),_q92T("q92_bancar","Bancarlo de frente"),_q92T("q92_palo2","Un palo y a la siguiente"));
}
function _q92T(k,d){ return (typeof T==="function")?T(k,d):d; }
function _q92Item(p,fase){
  var ops=(p&&Array.isArray(p.ops)&&p.ops.length>=3)?p.ops:(fase==="post"?_q92OpsPost():_q92OpsPrevia());
  return {id:"p92_"+_q92Clave(p), prio:8, q:p.q, ops:ops, _p92:true, _sit:p.sit||"*"};
}

(function wrapConferencia92(){
  if(typeof preguntasConferencia!=="function"||preguntasConferencia._p92) return;
  var orig=preguntasConferencia;
  preguntasConferencia=function(part){
    var L=orig.apply(this,arguments)||[];
    try{
      L=_q92Limpiar(L);
      var els=elegirPorSits(sitsPrevia(part),preguntasPorRueda(),"previa");
      for(var i=els.length-1;i>=0;i--) L.unshift(_q92Item(els[i],"previa"));
    }catch(e){}
    return L;
  };
  preguntasConferencia._p92=true;
  /* patrón del repo: los guardas de los wraps de adentro se sostienen en el de
     afuera, para que nadie vuelva a envolver lo mismo dos veces. */
  ["_voz","_32","_hist","_beta","_fmt54"].forEach(function(f){ preguntasConferencia[f]=true; });
})();

(function wrapPostPartido92(){
  if(typeof preguntasPostPartido!=="function"||preguntasPostPartido._p92) return;
  var orig=preguntasPostPartido;
  preguntasPostPartido=function(res,P){
    var L=orig.apply(this,arguments)||[];
    try{
      L=_q92Limpiar(L);
      var els=elegirPorSits(sitsPost(res,P),preguntasPorRueda(),"post");
      for(var i=els.length-1;i>=0;i--) L.unshift(_q92Item(els[i],"post"));
    }catch(e){}
    return L;
  };
  preguntasPostPartido._p92=true;
  ["_voz","_beta"].forEach(function(f){ preguntasPostPartido[f]=true; });
})();

/* club grande = una pregunta más por rueda (A5). Solo la conferencia:
   la sala de prensa sigue pidiendo las 2 de siempre. */
(function wrapConfN92(){
  if(typeof elegirPreguntasConf!=="function"||elegirPreguntasConf._p92) return;
  var orig=elegirPreguntasConf;
  elegirPreguntasConf=function(L,n){
    var extra=0;
    try{ extra=(durezaClub()==="grande")?1:0; }catch(e){}
    return orig.call(this,L,(n||2)+extra);
  };
  elegirPreguntasConf._p92=true;
})();

/* al cerrar la temporada el banco vuelve entero */
(function wrapAnio92(){
  if(typeof nuevoAnio!=="function"||nuevoAnio._p92) return;
  var orig=nuevoAnio;
  nuevoAnio=function(){
    var r=orig.apply(this,arguments);
    try{ limpiarPreguntasUsadas(); }catch(e){}
    return r;
  };
  nuevoAnio._p92=true;
  ["_hist"].forEach(function(f){ nuevoAnio[f]=true; });
})();
