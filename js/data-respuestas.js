"use strict";
/* ============================================================
   FUTBOLINI · data-respuestas.js  (7.9065)
   Pedido del autor: "respuestas que calcen con la pregunta".
   Las 156 preguntas de PREGUNTAS_VOZ (voz, beta, histórico, formato 2026) no traían respuestas:
   caían en tres comodines ("Bajar el perfil / Salir con confianza / Un palo y a la cancha")
   que no contestaban nada. Acá cada pregunta tiene sus tres respuestas, dichas por el DT.
   Formato: "texto|tono". Tonos de previa: calma, confianza, palo, mea.
   Tonos de post: humilde, bancar, elogio, foco, agrandado, arbitro, respaldo, palo, mea.
   (Los dos juegos de tonos se entienden en las dos salas: ver prensa-real.js.)
   Si agregas una pregunta a PREGUNTAS_VOZ, agrégale sus respuestas acá: el doctor
   `prensa_real` cuenta las que quedan sin respuesta propia.
   ============================================================ */
const RESPUESTAS_VOZ={
/* ---- previa_favorito ---- */
"¿El plantel siente el cartel de favorito o lo van a bajar a tierra en la charla?":["Lo bajamos a tierra: el cartel no suma puntos|calma","Lo sienten, y está bien: somos mejores y lo saben|confianza","El cartel lo ponen ustedes, nosotros ni lo leemos|palo"],
"Hay gente que ya da por ganado el domingo. ¿Eso ayuda o estorba?":["Estorba. Los partidos ganados antes de jugarse se pierden|calma","Ayuda si lo usamos como obligación, no como regalo|confianza","Que opinen tranquilos, el que juega soy yo|palo"],
"En el papel son más. ¿Se lo dice al plantel o se lo guarda?":["Me lo guardo. En el papel no se juega|calma","Se lo digo: tienen que salir sabiendo que son mejores|confianza","El papel se lo dejo a los periodistas|palo"],
"¿Cambia el once porque el rival es de menos nombre?":["No. El once se arma por cómo estamos, no por el rival|calma","Algún cambio para dar minutos, pero sale un equipo fuerte|confianza","Si con este rival no juegan los que están bien, ¿cuándo?|palo"],
"La gente ya pide goleada. ¿Usted también?":["Yo pido ganar. Si es por uno, lo firmo|calma","Si se dan las condiciones, vamos a buscar más goles|confianza","La goleada se la dejo a la gente, yo cobro por puntos|palo"],
"¿Hay riesgo de subestimar a un rival que no tiene nada que perder?":["Siempre. Por eso lo trabajamos toda la semana|calma","No con este grupo, está muy metido|confianza","El que lo subestime no juega, así de simple|palo"],
/* ---- post_derrota ---- */
"¿Dónde se les fue el partido: en el primer gol o en la reacción?":["En la reacción. Después del gol nos desordenamos|mea","En el primer gol; después el equipo lo intentó|bancar","Se nos fue en un error que no es del sistema, es de ejecución|palo"],
"La gente silbó. ¿Lo escucha o lo deja pasar?":["Lo escucho, y tienen razón|mea","Lo escucho. El grupo lo va a revertir|bancar","El silbido es parte, no me cambia lo que pienso|foco"],
"¿El plan se cumplió y falló la definición, o el plan no estaba?":["El plan no funcionó, y el plan es mío|mea","El plan estaba; nos faltó el último metro|bancar","Tuvimos las ocasiones. Hoy no entró, nada más|foco"],
"¿Va a tocar el once o banca el mismo grupo?":["Algo voy a tocar, no puedo mirar para el lado|mea","Banco a los mismos, se lo ganaron antes|bancar","Lo decido en la semana, no en caliente|foco"],
"Hay caras largas. ¿Se habla adentro o se deja pasar la noche?":["Hoy se deja pasar. Mañana se habla con video|foco","Ya hablé. Les dije que los banco|bancar","Se habla hoy. Hay cosas que no pueden esperar|mea"],
"¿Qué le responde al socio que pagó la entrada y se fue callado?":["Que tiene razón y que le debemos una|mea","Que el domingo que viene lo vamos a hacer gritar|bancar","Que yo también me fui callado. Nadie está más dolido que nosotros|humilde"],
/* ---- racha_sin_ganar ---- */
"Llevan varias sin ganar. ¿En qué minuto se les empieza a notar la cabeza?":["Después del gol en contra. Ahí nos cuesta|mea","No es la cabeza: es un detalle que se va a dar vuelta|confianza","La cabeza la tienen ustedes con la racha, nosotros no|palo"],
"¿Sigue confiando en el once o ya es momento de cortar de raíz?":["Confío, pero van a entrar caras nuevas|calma","Confío en ellos, nos sacaron de peores|confianza","El que no esté a la altura, sale. Sin nombres|palo"],
"¿Siente que el equipo está trabado de cabeza más que de fútbol?":["Un poco de las dos. Lo estamos trabajando|calma","El fútbol está. Falta que entre una|confianza","Yo veo fútbol trabado, no cabezas|palo"],
"¿Hay nombres intocables en esta racha?":["No. Nadie tiene el puesto comprado|calma","Hay líderes que me van a sacar de esto|confianza","El único intocable es el escudo|palo"],
"El directorio lo sigue bancando. ¿Eso alcanza o falta un resultado ya?":["Falta un resultado, lo sé mejor que nadie|mea","Alcanza para trabajar tranquilo, y el resultado va a llegar|confianza","Mi trabajo no depende de un comunicado|palo"],
"¿Cambia el sistema o cambia las caras?":["Las caras. El sistema lo entienden|calma","Ninguna de las dos: insistir es lo que nos va a sacar|confianza","Cambio lo que haga falta, aunque duela|palo"],
/* ---- clasico_previa ---- */
"En un clásico, ¿se gana con la idea o se gana con el carácter?":["Con la idea. El carácter se da por descontado|calma","Con las dos, y este grupo tiene las dos|confianza","Con carácter. La idea no sirve si te pasan por encima|palo"],
"La ciudad se parte. ¿Usted desconecta al plantel de eso o lo usa?":["Los desconecto. El ruido no juega|calma","Lo uso. Que sientan lo que significa|confianza","Que el ruido lo sienta el rival|palo"],
"¿Se puede dormir alguien de su lado la noche de un clásico?":["Yo no duermo. A ellos les pido que sí|calma","Duermen tranquilos: saben lo que tienen que hacer|confianza","Duermen bien. Los que no duermen son los del frente|palo"],
"Hay historial reciente. ¿Lo usa en la charla o lo esconde?":["No lo uso. Cada clásico es otro partido|calma","Lo uso: que se acuerden de cómo se siente ganarlo|confianza","Lo uso, y ellos también lo saben|palo"],
"¿Prioriza no perderlo o ir a ganarlo?":["Primero no perderlo; después vamos por él|calma","Ir a ganarlo. En casa no se especula|confianza","El que sale a empatar un clásico no merece dirigirlo|palo"],
"La ciudad se parte. ¿El plantel está autorizado a mirar redes?":["Les pedí que las dejen hasta el lunes|calma","Son grandes. Saben qué leer y qué no|confianza","Que miren, así se enteran de lo que dicen del otro lado|palo"],
/* ---- post_goleada ---- */
"Goleada. ¿Es el techo o es el piso de lo que quiere ver?":["Ni techo ni piso: es un buen día y hay que repetirlo|humilde","Es el piso. Este grupo da para más|agrandado","El mérito es del plantel, que lo jugó en serio|elogio"],
"¿Qué detalle no le gustó, aunque el marcador sea ancho?":["Los últimos quince minutos, nos relajamos|humilde","La pelota parada en contra, hay que corregirla|foco","Ninguno. Hoy no le busco la quinta pata|agrandado"],
"¿El rival se quedó corto o ustedes estuvieron un escalón arriba?":["El rival tuvo un mal día; no lo vamos a humillar|humilde","Estuvimos un escalón arriba, y se trabajó para eso|elogio","Estuvimos dos escalones arriba|agrandado"],
"¿Repite el once el domingo o rota para no inflarse?":["Veo las cargas y decido. Nadie se infla acá|foco","Repito. El que juega así se gana seguir|elogio","Si pudiera, repito los once y el marcador|agrandado"],
"La gente pide que esto sea la norma. ¿Es justo pedirlo?":["No. Las goleadas no son la norma en ninguna liga|humilde","Es justo pedir esta intensidad, no este marcador|foco","Sí. Con este plantel, es justo|agrandado"],
"¿Hay algo que corregir aunque el marcador sea ancho?":["Siempre. El lunes lo vemos con video|foco","Poco. Hoy hay que felicitar al grupo|elogio","Que no nos crean invencibles, eso nomás|humilde"],
/* ---- figura_juvenil ---- */
"El cabro se comió el partido. ¿Ya es titular o se dosifica?":["Se dosifica. Tiene 19 años y una carrera por delante|humilde","Se ganó jugar el domingo, simple|elogio","Es titular. Lo que hizo hoy no se enseña|agrandado"],
"¿El cabro pide más minutos o todavía se dosifica?":["Pide, y está bien que pida. Yo decido cuándo|foco","Pide con la pelota, que es como se pide|elogio","Que siga así y los minutos llegan solos|humilde"],
"Hay ojeadores en la tribuna. ¿El club lo protege o deja que se vea?":["Lo protegemos. Primero tiene que consolidarse acá|humilde","Que lo vean. Un jugador así tiene que mostrarse|elogio","El que lo quiera, que traiga la plata que vale|agrandado"],
"¿Ya es de primer equipo o sigue con un pie en juveniles?":["Entrena con nosotros; el resto se lo gana|foco","Es de primer equipo, se lo ganó hoy|elogio","Con un pie y medio acá|humilde"],
"La gente lo pide de titular. ¿Usted también?":["La gente pide con el corazón; yo tengo que cuidarlo|humilde","Yo lo pido desde hace un mes|elogio","Que lo pidan. Yo ya lo tengo en la cabeza|foco"],
"¿Le pone techo para que no se agrande, o le suelta la rienda?":["Techo no. Pero sí los pies en la tierra|humilde","Le suelto la rienda, se la ganó|elogio","Los que se agrandan acá duran poco, y él lo sabe|palo"],
/* ---- rumor_venta ---- */
"Se habla de una oferta por un titular. ¿El club la escuchó o es ruido?":["Si hay algo, lo sabe el directorio. Yo dirijo|calma","A mí nadie me dijo nada, y el jugador está enfocado|confianza","El club escucha todo. Vender a mis titulares, no|palo"],
"Si llega una cifra seria, ¿el club escucha o cierra la puerta?":["El club escucha, es su trabajo. Yo opino del reemplazo|calma","Si se va, que sea por lo que vale|confianza","Yo cierro la puerta. Después que discutan arriba|palo"],
"El jugador, ¿pidió salir o es ruido de afuera?":["No me pidió nada. Entrena como siempre|calma","Ruido. Está feliz acá|confianza","Si quiere salir, que me lo diga a mí, no a la prensa|palo"],
"¿Hay una cláusula que deje al club vendido de antemano?":["No conozco los contratos al detalle; eso es de la gerencia|calma","Hasta donde sé, el club tiene la última palabra|confianza","Si la hay, la firmó alguien que no era yo|palo"],
"La hinchada ya eligió: que no se venda. ¿Eso pesa?":["Pesa, y lo entiendo. Pero hay números que no controlo|calma","Pesa. Y yo estoy con la hinchada|confianza","Que no se venda. Lo digo acá y lo digo arriba|palo"],
"¿Hoy puede decir que se queda hasta diciembre?":["No puedo prometer lo que no depende de mí|mea","Hoy se queda, y lo va a jugar todo|confianza","Si lo venden, que me busquen reemplazo en serio|palo"],
/* ---- previa_favorito (beta) ---- */
"¿Cómo evitas que el plantel se relaje siendo favorito?":["Con video de los partidos que perdimos siendo favoritos|calma","No hace falta: este grupo no se relaja|confianza","Con la banca. El que se relaja, mira|palo"],
"El rival viene a cerrarse. ¿Tienes un plan B si no entra el primer gol?":["Sí: paciencia y amplitud. No hay que desesperarse|calma","Tenemos B y C. Lo trabajamos toda la semana|confianza","El plan B es no necesitar plan B|palo"],
"¿Le pidió algo puntual al 9 para partidos que se traban?":["Que no se desespere y que ataque el primer palo|calma","Que siga igual: sus goles llegan en estos partidos|confianza","Que haga goles. Para eso está|palo"],
"La gente ya lo dio por ganado. ¿Eso ayuda o estorba?":["Estorba. Yo no doy nada por ganado|calma","Ayuda si nos exige, no si nos adormece|confianza","A mí me da lo mismo lo que den por ganado|palo"],
"¿Hay rotación o sales con el once de siempre?":["Algo de rotación: el calendario lo pide|calma","Los de siempre. Están bien y en ritmo|confianza","Sale el que esté mejor, no el de siempre|palo"],
"¿Te preocupa que el rival te reciba de contra?":["Sí. Por eso los centrales no suben en las pelotas paradas|calma","Lo tenemos estudiado; los volantes cierran|confianza","Si nos agarran de contra, es porque no la tuvimos|palo"],
"Tres puntos de locales contra este rival: ¿obligación o partido más?":["Ningún partido es un trámite en esta liga|calma","Es una obligación, y la asumimos|confianza","Obligación. Y el que no la sienta, que no se ponga la camiseta|palo"],
"¿Hablaste con el camarín sobre no subestimar al de abajo?":["Sí, con los números de los últimos años|calma","No hizo falta, lo saben|confianza","Les dije que el de abajo le ganó al de arriba la fecha pasada|palo"],
/* ---- post_derrota (beta) ---- */
"¿Qué le pasó al equipo en el segundo tiempo?":["Nos quedamos sin piernas y lo leí tarde|mea","Bajamos, pero el equipo no se entregó|bancar","Nos cobraron dos cosas que cambiaron el partido|arbitro"],
"¿Fue un problema de plan o de ejecución?":["De plan. Me equivoqué yo|mea","De ejecución; el plan estaba y lo sabían|bancar","Un poco de las dos. Lo vemos en la semana|foco"],
"¿El rival te sorprendió en algo que no habías visto?":["Sí, la salida por la izquierda. No lo tenía|mea","No. Lo sabíamos y no pudimos pararlo|bancar","No me sorprendió nada; nos faltó a nosotros|foco"],
"¿Mantienes el once para la próxima o hay cambios?":["Va a haber cambios. Tiene que haber|mea","Mantengo la base, el grupo lo merece|bancar","Lo decido después de ver el partido de nuevo|foco"],
"La gente se fue callada. ¿Qué les dirías si pudieras?":["Perdón. Y que vamos a responder|mea","Que este grupo no los va a dejar solos|bancar","Que estén el domingo, los necesitamos más que nunca|humilde"],
"¿Sentiste que el equipo se desordenó después del gol?":["Sí, y eso es falta de trabajo mío|mea","Un rato. Después se ordenó y lo buscó|bancar","Nos desordenó más un cobro que el gol|arbitro"],
"¿Hay algo que no se vio en la tele y sí en el camarín?":["Que están dolidos, y eso es bueno|bancar","Lo del camarín queda en el camarín|foco","Hubo cosas que se van a hablar puertas adentro|mea"],
"¿Asumes la derrota o hay atenuantes que quieras marcar?":["La asumo entera. Sin atenuantes|mea","La asumo, pero el grupo dejó todo|bancar","La asumo, y hubo cobros que también pesaron|arbitro"],
/* ---- racha_sin_ganar (beta) ---- */
"¿Cuánto más puede aguantar este ciclo sin una victoria?":["No mucho, y soy el primero en saberlo|mea","El que tiene que aguantar es el grupo, y aguanta|confianza","Eso lo decide el directorio, no la prensa|palo"],
"¿El camarín sigue contigo o ya hay caras largas?":["Hay caras largas, como en todo equipo que no gana|calma","Está conmigo. Lo veo todos los días|confianza","El que tenga cara larga, que me lo diga en la cara|palo"],
"¿Cambias el sistema o insistes con la misma idea?":["Voy a hacer ajustes, no una revolución|calma","Insisto. La idea es buena y se va a ver|confianza","Cambio lo que haya que cambiar, empezando por nombres|palo"],
"La tabla se complica. ¿Sigues pensando en el objetivo de marzo?":["Hoy pienso en el próximo partido, nada más|calma","Sí. Queda mucho y el objetivo sigue|confianza","El objetivo no lo cambia una racha|palo"],
"¿Pediste refuerzos o hay que arreglarlo con lo que hay?":["Se arregla con lo que hay. Es mi trabajo|mea","Con lo que hay alcanza, confío en ellos|confianza","Pedí, y se sabe lo que pedí|palo"],
"¿Hay un partido que veas como el corte de la racha?":["El próximo. No miro más allá|calma","El domingo. Lo siento así|confianza","Todos. No estamos para elegir|palo"],
"¿La presión externa está llegando adentro?":["Algo llega, es inevitable. Lo manejamos|calma","No. El grupo está blindado|confianza","Llega lo que ustedes escriben, y no ayuda|palo"],
"¿Descartas que esto termine en crisis institucional?":["Lo descarto. Esto es fútbol, se arregla ganando|calma","Lo descarto. El club está ordenado|confianza","La crisis la inventan afuera|palo"],
/* ---- clasico_previa (beta) ---- */
"En un clásico, ¿privilegias el resultado o la forma?":["El resultado. La forma se discute el lunes|calma","Las dos. Queremos ganar jugando|confianza","El resultado. Nadie se acuerda de cómo se ganó|palo"],
"¿Hay alguna consigna especial para no calentarse?":["Sí: el que se calienta, sale al entretiempo|calma","Son profesionales, saben manejarlo|confianza","Que se calienten ellos|palo"],
"El rival también llega necesitado. ¿Eso cambia el plan?":["No. Nos preparamos igual|calma","Nos sirve: van a tener que abrirse|confianza","Mejor. Que lleguen necesitados y se vayan peor|palo"],
"¿Le diste alguna instrucción extra a los laterales?":["Que no se vayan los dos al mismo tiempo|calma","Que ataquen: por ahí les hacemos daño|confianza","Eso se ve el domingo, no lo cuento acá|palo"],
"¿Temes que el árbitro se vuelva protagonista?":["No. Confío en que haga su trabajo|calma","Si jugamos bien, el árbitro no va a importar|confianza","Espero que no se repita lo del último clásico|palo"],
"La hinchada pide pelea. ¿Cómo traduces eso a la cancha sin rojas?":["Con intensidad, no con patadas|calma","En cada pelota dividida, y con cabeza|confianza","Pelea sí; la roja, que la saquen ellos|palo"],
"¿Hay un jugador del otro lado que te quite el sueño?":["Tienen dos o tres muy buenos; los respetamos|calma","Ninguno. Me preocupo del mío|confianza","Me quita el sueño el árbitro, no un jugador|palo"],
"¿Este clásico vale por tres en la tabla o vale por la historia?":["Vale tres puntos. Lo demás, después|calma","Vale por los dos, y lo vamos a jugar así|confianza","Vale por la historia. Los puntos se recuperan; un clásico perdido, no|palo"],
/* ---- post_goleada (beta) ---- */
"¿Esperabas un margen tan amplio?":["No. Uno trabaja para ganar, no para golear|humilde","Sí, por cómo se entrenó la semana|elogio","Con este grupo, espero cualquier cosa|agrandado"],
"¿Qué fue lo que más te gustó además de los goles?":["La presión tras pérdida, fue de libro|elogio","Que nadie dejó de correr con el partido ganado|humilde","Que el rival nunca supo qué hacer|agrandado"],
"¿Cuidas que esto no se les suba a la cabeza?":["Sí. El lunes a trabajar como si hubiéramos perdido|humilde","No hace falta, es un grupo maduro|elogio","Que se les suba un poco, se lo ganaron|agrandado"],
"¿El 9 está en su mejor momento o todavía puede dar más?":["Puede dar más, y se lo pido|foco","Está en su mejor momento, y lo merece|elogio","Es el mejor 9 de la liga, lo dije hace meses|agrandado"],
"¿Rotas ahora que hay margen o insistes con los mismos?":["Roto por cargas, no por el marcador|foco","Insisto. Ganaron el derecho|elogio","Los que entran también golean, ya van a ver|agrandado"],
"El rival se desarmó. ¿Fue mérito tuyo o error de ellos?":["Mérito del plantel. Yo no hice ningún gol|elogio","Un poco de las dos, siendo honesto|humilde","Mérito nuestro. Lo desarmamos nosotros|agrandado"],
"¿Hay algo que igual corrijas pese al resultado?":["Sí, dos pelotas paradas que nos pudieron costar|foco","Detalles. Hoy es día de felicitar|elogio","Los primeros veinte minutos, fueron flojos|humilde"],
"¿Esta goleada cambia el objetivo de la semana?":["No. El objetivo es el próximo partido|foco","Nos da confianza para lo que viene|elogio","Cambia lo que la gente espera, y que así sea|agrandado"],
/* ---- figura_juvenil (beta) ---- */
"El pibe de la cantera fue figura. ¿Lo ves para titular fijo?":["Paso a paso. Tiene que sostenerlo|humilde","Se ganó el puesto, hoy lo veo titular|elogio","Es el mejor proyecto que he visto en años|agrandado"],
"¿Cómo lo cuidas para que no se queme en dos meses?":["Con minutos dosificados y la familia cerca|humilde","Con el grupo: los grandes lo cuidan|elogio","Lo cuido yo. Nadie me lo va a quemar|palo"],
"¿Ya hay llamados de afuera por el juvenil?":["Eso lo sabe la gerencia. Yo lo quiero acá|foco","Seguro, y es lógico con lo que muestra|elogio","Que llamen. No sale barato|agrandado"],
"¿El camarín lo resguarda o lo dejan solo con la fama?":["Lo resguarda. Tiene referentes buenos al lado|elogio","Lo cuidamos todos, empezando por mí|respaldo","Si alguien lo deja solo, se las ve conmigo|palo"],
"¿Minutos de a poco o se gana el puesto y se queda?":["De a poco, aunque me lo pidan todos|humilde","Se ganó el puesto. Se queda|elogio","El puesto se lo gana cada semana, como todos|foco"],
"¿Le hablaste después del partido o lo dejaste disfrutar?":["Lo dejé disfrutar. Mañana hablamos|humilde","Le di un abrazo, se lo merecía|respaldo","Le dije dos cosas que hizo mal. Así se crece|foco"],
"¿La cantera está dando más de lo que el presupuesto permite?":["La cantera es lo mejor que tiene este club|elogio","Da lo que se trabaja. Hay gente buena atrás|humilde","Da más de lo que le invierten, eso es seguro|palo"],
"¿Hay más de su camada que merezca chance?":["Hay dos o tres más. Van a llegar|elogio","Los estoy mirando, sin apuro|foco","Sí, y no me van a obligar a esperarlos|agrandado"],
/* ---- rumor_venta (beta) ---- */
"Circula que hay oferta por un titular. ¿Confirmas algo?":["No confirmo nada, no me corresponde|calma","No hay nada. El plantel está completo|confianza","Si la hay, no pasó por mí|palo"],
"Si llega una cifra importante, ¿el club vende sí o sí?":["El club decide. Yo pido que no a mitad de año|calma","Vende si hay reemplazo, así lo conversamos|confianza","Sí o sí no. Esto no es una feria|palo"],
"¿El jugador te pidió salir o es ruido de afuera?":["No me pidió nada|calma","Ruido. Está comprometido|confianza","Si me lo pide, lo va a hacer en mi oficina|palo"],
"¿Cómo le explicas a la gente una venta a mitad de año?":["No me toca explicarlo a mí, pero lo entiendo|calma","Con un reemplazo que esté a la altura|confianza","No se explica. Por eso no quiero ventas|palo"],
"¿Hay cláusula que te ate las manos?":["Los contratos los maneja la gerencia|calma","Hasta donde sé, no|confianza","Si la hay, no la firmé yo|palo"],
"¿Preferirías reponer en el mismo puesto o reciclar el once?":["Reponer en el puesto. Es lo más sano|calma","Tengo alternativas en el plantel|confianza","Preferiría que no se fuera nadie|palo"],
"La prensa ya lo dio por vendido. ¿Eso te complica el camarín?":["Un poco. Por eso hablé con él|calma","No. El camarín sabe lo que pasa y lo que no|confianza","Lo complica la prensa, no el jugador|palo"],
"¿El directorio te consulta o te informa después?":["Me consulta. Tenemos buena comunicación|calma","Me consulta, y yo doy mi opinión|confianza","A veces me entero por ustedes|palo"],
/* ---- promesa_incumplida ---- */
"Prometiste algo al entorno y no se cumplió. ¿Qué pasó?":["Me equivoqué al prometerlo. Lo asumo|mea","Pasaron cosas que no dependían de mí, pero sigue en pie|confianza","Se cumplió a medias, y eso nadie lo dice|palo"],
"¿Fue una promesa tuya o del directorio que te dejó mal parado?":["Mía. No voy a culpar a nadie|mea","Fue conversada, y la vamos a cumplir|confianza","Yo prometí lo que me dijeron que se podía|palo"],
"La gente tiene memoria. ¿Cómo reconstruyes esa palabra?":["Con hechos, no con otra promesa|mea","Cumpliendo la próxima|confianza","Mi palabra está intacta. Lo demás es ruido|palo"],
"¿Vas a volver a comprometerte en público o ya no?":["Ya no. Aprendí|mea","Sí, pero con cosas que dependan de mí|confianza","Me comprometo con el trabajo, no con titulares|palo"],
"¿El camarín te reclamó esa promesa?":["Sí, y con razón|mea","Lo conversamos y quedó claro|confianza","El camarín sabe cómo son las cosas|palo"],
"¿Hay una fecha nueva o se cayó del todo?":["No voy a dar otra fecha. Cuando esté, se sabrá|mea","Hay fecha, y la vamos a cumplir|confianza","No se cayó. Se atrasó|palo"],
"¿Asumes el costo o sientes que te usaron de vocero?":["Asumo el costo. Lo dije yo|mea","Lo asumo, y sigo confiando en el club|confianza","Algo de las dos. Y no va a volver a pasar|palo"],
"¿Esto cambia tu relación con los socios?":["Me obliga a ganármela de nuevo|mea","No. Saben que trabajo para ellos|confianza","Mi relación con los socios se mide en la cancha|palo"],
/* ---- arbitro ---- */
"¿El árbitro incidió en el resultado o fue un partido más?":["No me escondo en el árbitro. Perdimos nosotros|mea","Hubo cobros discutibles, pero el partido lo definimos nosotros|foco","Incidió, y lo digo con todas sus letras|arbitro"],
"¿Viste el VAR y sigues pensando lo mismo?":["Lo vi y puedo estar equivocado|humilde","No lo vi todavía. Prefiero no opinar en caliente|foco","Lo vi y pienso peor|arbitro"],
"¿Vas a apelar algo o lo dejas pasar?":["Lo dejo pasar. No gano nada apelando|humilde","Lo decide el club, yo mando el informe|foco","Vamos a apelar. Hay imágenes|arbitro"],
"¿Sentiste un criterio distinto para cada camiseta?":["No, fue parejo para los dos|humilde","Hubo cosas que se cobraron de un lado y del otro no|foco","Sí. Y no es la primera vez|arbitro"],
"La gente silbó al juez. ¿Compartes el enojo o lo bajarías?":["Lo bajaría. El árbitro también se equivoca|humilde","Entiendo el enojo, pero hay que seguir|foco","Lo comparto. Tienen razón|arbitro"],
"¿Hay un lance puntual que quieras marcar sin quemarte con el colegio?":["No. Hablo de mi equipo|humilde","El penal del segundo tiempo. Lo dejo ahí|foco","Hay tres, y los voy a mandar por escrito|arbitro"],
"¿El cuarto hombre te dijo algo que no se escuchó?":["Nada que valga la pena contar|humilde","Me pidió calma y se la di|foco","Me dijo cosas que no correspondían|arbitro"],
"¿Prefieres no hablar del árbitro y quedarte en tu equipo?":["Sí. El árbitro no juega|humilde","Prefiero hablar de lo que podemos controlar|foco","Hoy no puedo no hablar del árbitro|arbitro"],
/* ---- post_empate ---- */
"¿Punto ganado o dos perdidos?":["Punto ganado. Hay que valorarlo|humilde","Dos perdidos. Lo tuvimos|mea","Punto ganado con dos cobros en contra|arbitro"],
"¿El equipo mereció más o el empate es justo?":["Es justo. Los dos tuvimos lo nuestro|humilde","Merecimos más, y el grupo lo dejó todo|bancar","Merecimos ganar, y lo digo sin vueltas|agrandado"],
"¿Cambia el plan de la semana o se insiste con la misma idea?":["Se insiste. La idea funcionó a ratos|foco","Algo cambia: no podemos regalar segundos tiempos|mea","Se insiste. Este equipo va a ganar así|bancar"],
/* ---- post_clasico ---- */
"En un clásico, ¿el resultado borra todo lo demás?":["Sí. En un clásico solo cuenta el resultado|humilde","No. Hay cosas que rescatar y cosas que corregir|foco","Hoy sí, y hay que disfrutarlo|agrandado"],
"¿Qué le diría a la gente que se quedó con la bronca?":["Que la entiendo, y que la comparto|mea","Que el grupo lo dejó todo|bancar","Que en el próximo clásico nos cobramos esta|palo"],
"¿El clásico se juega distinto o es un partido más con más ruido?":["Es distinto. Se siente en todo|humilde","Es un partido más, y así lo preparamos|foco","Es distinto, y nosotros lo jugamos mejor|agrandado"],
/* ---- previa_copa ---- */
"¿Cambia el once para la copa o sales con los mismos de la liga?":["Hay cambios: la liga es la prioridad|calma","Salen los mejores. La copa también es un título|confianza","El que juega la copa se gana la liga, así de claro|palo"],
"La gente pide copa. ¿Usted también o primero la tabla?":["Primero la tabla, pero la copa no se regala|calma","Las dos. Tenemos plantel para las dos|confianza","Yo pido las dos. El que se conforma, que se baje|palo"],
"¿Hay rotación o esto se juega como final?":["Rotación con cabeza; el once que sale compite|calma","Se juega como final|confianza","Todo partido es final para el que quiere jugar|palo"],
"El rival viene de otra división. ¿Eso ayuda o es trampa?":["Es trampa si no lo respetamos|calma","Ayuda si imponemos la diferencia de categoría|confianza","Es trampa para el que salga dormido|palo"],
"¿Le pidió algo puntual al equipo para no relajarse en copa?":["Que lo juegue como un partido de liga|calma","No hace falta pedir nada, están motivados|confianza","Que se acuerden de las eliminaciones de otros años|palo"],
"Si sale mal, ¿pesa más que un domingo de liga?":["Pesa distinto: una copa no te da revancha|calma","No va a salir mal|confianza","Pesa más. Una eliminación no se borra|palo"],
/* ---- descenso_en_juego ---- */
"¿El plantel siente la tabla de abajo o usted se lo esconde?":["La sienten. No se le puede esconder a nadie|calma","La sienten, y eso los está haciendo más fuertes|confianza","El que no la sienta, no sabe dónde está parado|palo"],
"¿Hay margen para rotar o esto es de los mismos once?":["Los mismos once, con alguna excepción física|calma","Hay margen: el plantel está entero|confianza","Juega el que tenga piernas y cabeza fría|palo"],
"La gente pide pelea fea. ¿Eso es el plan?":["El plan es sumar. Si es feo, que sea feo|calma","El plan es jugar y ganar; la pelea viene incluida|confianza","Sí. No estamos para jugar lindo|palo"],
"¿Qué le dice a un jugador que ya está con la cabeza en la B?":["Que todavía no bajamos, y que lo necesito|calma","Que estamos vivos, y que se lo demuestre|confianza","Que si está en la B, no está en mi lista|palo"],
"¿Asume que este partido vale por dos?":["Sí. Son seis puntos en juego|calma","Vale por dos y lo vamos a ganar|confianza","Vale por dos para ellos también|palo"],
"¿Pidió calma al entorno o prefiere que empuje con bronca?":["Calma. La bronca no nos ayuda ahora|calma","Que empuje. Los necesitamos a todos|confianza","Que empuje con bronca, pero contra el rival|palo"],
/* ---- ascenso_en_juego ---- */
"¿Se juega a cerrar el ascenso o a no pensarlo?":["A no pensarlo. Se juega este partido|calma","A cerrarlo. Lo merecemos|confianza","A cerrarlo hoy, en casa|palo"],
"La ciudad ya festeja. ¿Eso ayuda o estorba?":["Estorba. No se festeja lo que no se ganó|calma","Ayuda: se siente el cariño|confianza","Que festejen el domingo, cuando esté hecho|palo"],
"¿Hay que ganar feo o quiere que se note el salto de categoría?":["Ganar como sea. El salto se ve en Primera|calma","Quiero que se note: jugamos como equipo de Primera|confianza","Ganar feo, y que después nos critiquen en Primera|palo"],
"¿Le pidió al camarín que no se ponga a contar puntos?":["Sí. Contar puntos da miedo|calma","No hace falta. Están concentrados|confianza","Los puntos los cuento yo. Ellos juegan|palo"],
"Si no sale hoy, ¿queda alguna fecha de verdad?":["Quedan, pero hoy es la mejor|calma","Va a salir hoy|confianza","No pienso en otra fecha|palo"],
"¿Promete Primera o prefiere no hablar de eso todavía?":["No prometo nada. Trabajo|calma","Prometo que vamos a dejar todo para subir|confianza","Prometo Primera. Pónganlo en el titular|palo"],
/* ---- copa_liga ---- */
"¿La Copa de la Liga es un título o un trámite para minutos?":["Es un título. Lo vamos a jugar en serio|calma","Es un título y una vitrina para los que juegan menos|confianza","Trámite para el que no quiera ganar nada|palo"],
"Solo pasa el 1° de grupo. ¿Eso cambia cómo arma el once?":["Sí: no hay margen para perder puntos|calma","Salgo a ganar el grupo desde la primera fecha|confianza","Arma el once el que tenga que ganar el grupo: yo|palo"],
"El campeón se lleva Chile 3. ¿El plantel lo tiene claro?":["Se los expliqué. Es un cupo internacional|calma","Lo tienen claro, y los motiva|confianza","Si no lo tenían claro, ahora lo saben|palo"],
"Si ya están en Libertadores, el Chile 3 lo hereda otro. ¿Se lo explicas al plantel o lo dejas pasar?":["Se lo explico, y se juega igual por el título|calma","Lo sabemos. El título es lo que importa|confianza","Lo dejo pasar. Un título es un título|palo"],
"¿Prioriza la liga o este torneo nuevo que la gente todavía nombra mal?":["La liga, pero este torneo se juega en serio|calma","Los dos. Tenemos plantel para los dos|confianza","El nombre da lo mismo; el trofeo pesa igual|palo"],
/* ---- supercopa ---- */
"Enero, Final Four, cancha neutral. ¿Se puede llegar bien a la liga después de esto?":["Con buena planificación, sí|calma","Se llega mejor: con un título en el bolsillo|confianza","Se llega bien si se gana|palo"],
"¿La Supercopa es el primer título del año o un amistoso caro?":["Es un título, y así lo vamos a jugar|calma","Es el primero, y lo queremos|confianza","Amistoso caro para el que la pierde|palo"],
"No hay tercer puesto. ¿Eso suelta al que pierde la semi?":["Lo suelta de un partido, no de la presión|calma","No vamos a perder la semi|confianza","Al que pierde lo suelta de la vitrina, nada más|palo"],
/* ---- liguilla ---- */
"¿El plantel entiende que acá se sube o se baja, no se «hace campaña»?":["Lo entiende. Se los repito todos los días|calma","Lo entiende perfecto. Llegamos para subir|confianza","El que quiera hacer campaña, que se vaya a la política|palo"],
"¿Cambia el once para la liguilla o banca a los que llegaron?":["Banco a los que llegaron, con algún ajuste|calma","Banco a los que llegaron. Se lo ganaron|confianza","Juega el que está mejor hoy, no el que llegó|palo"],
"Hay dos fechas libres en la zonal. ¿Eso se nota en las piernas o en la cabeza?":["En la cabeza. Por eso se entrena como si se jugara|calma","Se nota en las piernas, para bien: llegamos frescos|confianza","Se nota en el que no se cuida en la fecha libre|palo"],
/* ---- liguilla_b ---- */
"El 1° ya subió. ¿Esta liguilla es un título o un repechaje?":["Es un repechaje. Y se juega a muerte|calma","Para nosotros es un título|confianza","Es la única puerta que queda. La vamos a tirar abajo|palo"],
"Local primero el peor de la regular. ¿Eso le pesa al plantel o lo prende?":["Lo sabemos. No cambia la preparación|calma","Lo prende: cerramos en casa|confianza","Que pese a los que jugaron peor la regular|palo"],
"Sin gol de visita, a penales si empatan. ¿Arma el once para no irse a los 12 pasos?":["Lo armo para ganar en los noventa, pero practicamos penales|calma","Lo armo para ganar. Si hay penales, los tenemos|confianza","Si llegamos a penales, tenemos al mejor arquero de la categoría|palo"],
"De Primera bajan dos. ¿El vestuario entiende que hay dos asientos, no uno?":["Lo entiende. Pero primero hay que ganar esta llave|calma","Lo entiende, y quiere uno de esos asientos|confianza","Hay dos asientos. Uno es nuestro|palo"],
/* ---- zonal ---- */
"¿El clásico de zona pesa más que un partido contra un grande de visita?":["Pesan igual en la tabla|calma","El clásico pesa más para la gente, y lo sabemos|confianza","El clásico pesa más. Siempre|palo"],
"Top 3 clasifica. ¿Sale a ser 1° o a no quedar 4°?":["A sumar partido a partido|calma","A ser primeros|confianza","El que sale a no quedar cuarto, queda cuarto|palo"],
/* ---- segunda ---- */
"Segunda no juega Copa Chile 2026. ¿Eso libera el calendario o humilla al club?":["Libera el calendario, y lo vamos a aprovechar|calma","Nos da una sola meta: subir|confianza","Humilla. Por eso hay que salir de acá este año|palo"]
};
/* se pegan las respuestas a sus preguntas (las que ya traen ops propias no se tocan) */
function aplicarRespuestasVoz(){
  if(typeof PREGUNTAS_VOZ==="undefined"||!Array.isArray(PREGUNTAS_VOZ)) return 0;
  let n=0;
  PREGUNTAS_VOZ.forEach(p=>{
    if(!p||!p.q||(Array.isArray(p.ops)&&p.ops.length>=3)) return;
    const r=RESPUESTAS_VOZ[p.q]; if(!r) return;
    p.ops=r.map(s=>{ const i=s.lastIndexOf("|"); return {t:s.slice(0,i),k:s.slice(i+1)}; });
    n++;
  });
  return n;
}
