"use strict";
/* ============================================================
   FUTBOLINI 7.31 · data-grok-beta.js
   Pools de GROK_PROMPT_BETA (tandas 4–10). Cargar casi último
   (data-32.js va después).
   Nombres reales OK; stats estimadas; NUNCA citas inventadas
   atribuidas a una persona real.
   ============================================================ */

/* ---------- TANDA 4 · historia real por club/época ---------- */
const HISTORIA_BETA={
  CC:{
    actual:"Colo-Colo 2026 es SAD, hinchada más grande del país y deuda que siempre ronda. El Monumental sigue siendo su casa. Pelea arriba; el entorno no acepta media tabla.",
    "1991":"Bicampeón 89-90, estadio nuevo y Jozić. El 91 cierra el tricampeonato local y gana la Libertadores (3-0 a Olimpia en el Monumental, 5 de junio). Deuda grande, plantel de peso.",
    "1989":"Año de la reconstrucción post-tragedia institucional. Arranque de la era que termina en la Libertadores."
  },
  UCH:{
    actual:"La U 2026 sigue sin estadio propio: juega de local en el Nacional. Masa social enorme, pelea arriba, caja que no acompaña el tamaño de la hinchada.",
    "1991":"Vuelve del descenso de 1988. Campaña irregular, 13° puesto, estadio arrendado. La gente está; los puntos no.",
    "2011":"Era Sampaoli: presión alta, cantera y la Sudamericana invicta. Una de las mejores versiones modernas del club."
  },
  UC:{
    actual:"Católica estrena el Claro Arena (ex San Carlos). Administración ordenada, cantera fuerte, menos hinchada que los otros dos grandes.",
    "1991":"San Carlos propio, cantera y pelea de arriba (3°). El perfil institucional ya era el de club ordenado.",
    "2019":"Campeón del Nacional con Dituro, Aued, Fuenzalida. Cierre de una camada ganadora."
  },
  PAL:{
    actual:"Club de colonia, La Cisterna chica, competitivo con presupuesto acotado. Identidad palestina pública y formación propia.",
    "1991":"Media tabla, Municipal de La Cisterna, caja justa. Sin el brillo de los 70.",
    "1978":"Campeón nacional. Elías Figueroa de eje y Fabbiani goleador. Racha larga de invicto 1977-78. Dirigía Caupolicán Peña."
  },
  LIM:{
    actual:"Recién llegado a Primera (ascenso 2025). Objetivo: no volver a bajar. Estadio Ángel Navarrete Candia (municipal, 3.000). El Lucio Fariña es de San Luis."
  },
  EVE:{
    actual:"Sausalito, Viña y temporada larga. Cuando se acaba el verano el estadio se vacía. 2026 pelea en Primera con plantel mixto.",
    "2008":"Campeón del Apertura 2008 en Sausalito. Una de las alegrías grandes del club en el siglo.",
    "2012":"Vuelta a Primera vía promoción. Dos años en la B pesaron."
  },
  COQ:{
    actual:"Campeón 2025. Puerto, pecho y un título que todavía no acomoda. El norte no perdona si se afloja.",
    "1991":"Subcampeón nacional 1991, la mejor campaña clásica del pirata. Casi le saca el tricampeonato a Colo-Colo.",
    "2025":"Primera estrella del club. Histórico."
  },
  AUD:{actual:"La Florida, colonia italiana, tabla del medio. Club de barrio que a veces se ilusiona de más."},
  HUA:{
    actual:"Acero de Talcahuano. Forma, vende y pelea. El CAP no es adorno.",
    "2012":"Campeón nacional 2012. La estrella del acero.",
    "2023":"Otra pelea grande con plantel de casa y extranjeros puntuales."
  },
  OHI:{
    actual:"Rancagua, El Teniente, ganas de no ser sucursal de Santiago.",
    "2013":"Campeón del Apertura 2013. Calandria, Hernández, Barroso. La estrella de Rancagua.",
    "1991":"4° en el Nacional, pelea de arriba con plantel serio."
  },
  NUB:{
    actual:"Rojo de Chillán. Frío, región, poca vitrina. El Oyarzún lleno duele.",
    "2022":"Subcampeón 2022 y Libertadores. La mejor versión moderna."
  },
  COB:{
    actual:"El Salvador, altura, viaje eterno. Localía brava, caja justa. Cobresal (no Cobreloa).",
    "1991":"Media-baja tabla. El Cobre ya era localía difícil."
  },
  CAL:{
    actual:"Pueblo chico, estadio chico. Saca puntos feos o se hunde sin ruido.",
    "2018":"Animador: pelea arriba y 6-1 a la U. Brian Fernández en llamas."
  },
  LSE:{actual:"Postal de playa y yo-yo de categoría. La gente pide que deje de ser solo veraneo."},
  DCO:{
    actual:"El León volvió a Primera. Historia, gente y miedo a caer otra vez.",
    "1991":"Media tabla, Collao, plantel de región que incomodaba."
  },
  UDC:{
    actual:"El Campanil. Universidad, cantera, un regreso que todavía se acomoda.",
    "2018":"Subcampeón del Nacional. Libertadores al año siguiente."
  },
  CBL:{
    actual:"Descendió en 2024. En 2026 pelea el ascenso desde Calama con César Bravo. Zorros del Desierto, naranja y una hinchada que no acepta la B como casa."
  },
  SW:{
    actual:"Años en la B. En 2026 manda la tabla con Palladino. Playa Ancha / Elías Figueroa, decano de Chile, urgencia de volver a Primera.",
    "1991":"Último del Nacional 1991, descendió con Osorno. Campaña para el olvido."
  },
  UES:{
    actual:"Descendió en 2025. Santa Laura, Ronald Fuentes, colonia hispana. El 2026 es para no eternizarse en la B.",
    "1991":"Media tabla. Santa Laura ya era su casa."
  },
  IQQ:{actual:"Descendió en 2025. Tierra de Campeones, dragones, Hernán Peña. Volver es la única meta que la gente acepta."},
  ANT:{
    actual:"Puma del norte, Calvo y Bascuñán, Marcoleta. Pelea de ascenso con plantel mezclado de fichajes 2026.",
    "1991":"En Primera, media tabla. El Regional ya pesaba."
  },
  PAL_nota:"Palestino 1978 y 2026 ya cubiertos arriba."
};

/* ---------- TANDA 5 · relato de partido ---------- */
const RELATO_BETA=[
  {m:"inicio",x:"El partido recién arranca. Los dos se estudian."},
  {m:"inicio",x:"Primeros toques, todavía sin profundidad."},
  {m:"inicio",x:"La tribuna empuja desde el primer minuto."},
  {m:"inicio",x:"Saque al medio y la pelota se queda en el círculo. Nadie quiere el error temprano."},
  {m:"inicio",x:"Centro tempranero, fácil para el arquero. El partido pide calma."},
  {m:"inicio",x:"Presión alta de entrada. El rival la saca como puede."},
  {m:"inicio",x:"Falta tonta a los dos minutos. El árbitro marca el criterio: corto."},
  {m:"inicio",x:"La banda ya canta. En la cancha todavía es ajedrez."},
  {m:"dominio",x:"La tiene y la mueve. El rival corre atrás de la pelota."},
  {m:"dominio",x:"Tercer córner seguido. El área rival no descansa."},
  {m:"dominio",x:"La juegan entre líneas y el 5 no llega. Se viene."},
  {m:"dominio",x:"Atacan por la derecha, cierran por la izquierda. El rival se desarma."},
  {m:"dominio",x:"La hinchada lo siente: este tramo es de uno solo."},
  {m:"dominio",x:"Pase filtrado que no conectan. Dominio sin diente todavía."},
  {m:"dominio",x:"El volante de contención se quedó solo. Hay que apurarlo."},
  {m:"dominio",x:"La pelota no le llega al 9. Dominan, no lastiman."},
  {m:"equilibrio",x:"Se pelean cada pelota en el medio, nadie afloja."},
  {m:"equilibrio",x:"Ida y vuelta. Un gol acá vale por dos."},
  {m:"equilibrio",x:"La mitad de la cancha es un mar de piernas."},
  {m:"equilibrio",x:"Recupera uno, recupera el otro. El partido no se decide."},
  {m:"equilibrio",x:"Falta acá, falta allá. El árbitro no deja jugar dos pases."},
  {m:"equilibrio",x:"Centro de un lado, despeje del otro. Tablas en todo."},
  {m:"equilibrio",x:"Nadie se anima a soltar un hombre. Está trabado a propósito."},
  {m:"equilibrio",x:"Buen fútbol de ambos, sin el último pase."},
  {m:"ahogo",x:"El rival no sale. Cada pelota es un córner o un susto."},
  {m:"ahogo",x:"La defensa pide aire. El 9 rival se queda de 9 y de 10."},
  {m:"ahogo",x:"Remate, despeje, remate. No hay descanso."},
  {m:"ahogo",x:"El arquero grita y nadie lo pesca. Se viene el segundo."},
  {m:"ahogo",x:"Línea de cinco y igual la pelota entra al área."},
  {m:"ahogo",x:"El técnico ya tiene el cambio en la mano. Esto no da para más."},
  {m:"ahogo",x:"Un pelotazo largo sería un lujo. No pueden sacarla."},
  {m:"ahogo",x:"La tribuna rival se para. Huelen sangre."},
  {m:"aguanta",x:"Cierra filas. Cada despeje es un premio."},
  {m:"aguanta",x:"Falta táctica, tiempo, falta otra. El reloj es aliado."},
  {m:"aguanta",x:"El 2 gana de arriba otra vez. Que siga así."},
  {m:"aguanta",x:"La sacan como sea. Hoy no es noche de toque."},
  {m:"aguanta",x:"El 9 baja a defender de lateral. Así se sufren los partidos."},
  {m:"aguanta",x:"Córner rival. Todos adentro, hasta el que no salta."},
  {m:"aguanta",x:"El arquero se come los minutos con el saque. Legal y necesario."},
  {m:"aguanta",x:"Aguantan con las uñas. Un contra y se acaba el trámite."},
  {m:"cansancio",x:"Se nota el desgaste. Las piernas ya no responden igual."},
  {m:"cansancio",x:"El ritmo bajó. El físico empieza a mandar."},
  {m:"cansancio",x:"Hay más errores por cansancio que por falta de ideas."},
  {m:"cansancio",x:"El 8 pide el cambio con la mirada. No da más."},
  {m:"cansancio",x:"Control malo, pase corto. Las piernas mandan más que la cabeza."},
  {m:"cansancio",x:"El calor (o el frío) hizo lo suyo. Se juega a durar."},
  {m:"cansancio",x:"Un pelotazo menos vergonzoso que intentar el toque."},
  {m:"cansancio",x:"El banquillo ya calienta. Esto pide sangre nueva."},
  {m:"llega_local",x:"Se viene el local. El área rival se achica tarde."},
  {m:"llega_local",x:"Centro atrás y el 9 no llega por un pelo."},
  {m:"llega_local",x:"Remate desviado. La platea se queda con la boca abierta."},
  {m:"llega_local",x:"La triangulan al borde del área. Falta el disparo."},
  {m:"llega_local",x:"El lateral se manda. Hay dos contra uno si sale el pase."},
  {m:"llega_local",x:"Cabezazo que se va arriba. Estuvo."},
  {m:"llega_local",x:"El arquero rival vuela. Lo mejor del partido de ese lado."},
  {m:"llega_local",x:"Pared, habilitación, el 10 queda cara a cara… y la pisa."},
  {m:"llega_rival",x:"Cuidado. El rival encontró el hueco."},
  {m:"llega_rival",x:"Contra rápida. El 4 no llega al tapón."},
  {m:"llega_rival",x:"Centro al segundo palo. El zaguero aclara milagroso."},
  {m:"llega_rival",x:"Mano a mano que el arquero gana. Suspiro de la gente."},
  {m:"llega_rival",x:"La defensa se desordenó. Un pase más y es gol."},
  {m:"llega_rival",x:"Tiro desviado por un pelo. El palo estuvo más cerca que el 2."},
  {m:"llega_rival",x:"Piden penal. El árbitro sigue. La visita se enoja."},
  {m:"llega_rival",x:"El 9 rival cabecea y se va afuera. Advertencia."}
];

/* ---------- TANDA 6 · cuerpo técnico ---------- */
const FRASES_CUERPO=[
  {ctx:"favorito",x:"Favoritos en el papel, profe. Si no los pasamos, la gente no va a mirar el papel."},
  {ctx:"favorito",x:"Que no se relajen. Estos partidos se pierden cuando alguien se cree más de lo que es."},
  {ctx:"favorito",x:"El rival viene a cerrarse. Primer gol y se abre; si no, va a ser largo."},
  {ctx:"favorito",x:"Hoy el único rival somos nosotros. Si salimos serios, se gana."},
  {ctx:"favorito",x:"Nada de lucirse en el primer tiempo. Tres puntos y a la casa."},
  {ctx:"favorito",x:"La tribuna ya los dio por ganados. Ojalá el plantel no se la crea."},
  {ctx:"parejo",x:"Está parejo. El que sienta el partido a los 20 lo gana."},
  {ctx:"parejo",x:"No hay que inventar. Primer gol y después vemos."},
  {ctx:"parejo",x:"Ellos también tienen miedo. Que se note quién quiere más."},
  {ctx:"parejo",x:"Medio punto para cada uno hasta que alguien se mande. Que seamos nosotros."},
  {ctx:"parejo",x:"Si empata de visita, bueno. Si pierde de local, malo. Así de simple."},
  {ctx:"parejo",x:"Ojo con el pelotazo largo. En estos partidos gana el segundo palo."},
  {ctx:"desventaja",x:"Venimos de visita y más chicos. Orden primero, después el golpe."},
  {ctx:"desventaja",x:"Si nos abrimos temprano nos golean. Aguantar y una contra limpia."},
  {ctx:"desventaja",x:"Nadie nos va a regalar nada. Que corran como si les fuera el puesto."},
  {ctx:"desventaja",x:"Un punto acá es premio. Tres, un milagro. Igual se sale a buscarlo."},
  {ctx:"desventaja",x:"Que no miren la camiseta del otro. Se juega, no se pide autógrafo."},
  {ctx:"desventaja",x:"El 5 tiene que ser un muro. Si se adelanta, nos comen."},
  {ctx:"clasico",x:"Hoy no se especula, profe. O los pasamos por arriba o nos comen."},
  {ctx:"clasico",x:"Clásico no se juega, se pelea. Que salgan con el pecho, no con la cabeza en otra parte."},
  {ctx:"clasico",x:"La gente no va a perdonar un 0-0 tibio. Tampoco una locura de más."},
  {ctx:"clasico",x:"Ojo con las rojas. En el clásico el árbitro busca un protagonista."},
  {ctx:"clasico",x:"El primero que se enoje, pierde. Que se enojen ellos."},
  {ctx:"clasico",x:"Hoy el resultado pesa más que el fútbol. Que lo tengan claro."},
  {ctx:"racha_mala",x:"Llevamos rato sin ganar. Hoy se corta o se pone peor. No hay tercera."},
  {ctx:"racha_mala",x:"Que no salgan asustados. El miedo se nota a los cinco minutos."},
  {ctx:"racha_mala",x:"Un gol temprano y se les va el fantasma. Hay que buscarlo, no esperarlo."},
  {ctx:"racha_mala",x:"La prensa ya escribió la crónica. Que la desmientan en la cancha."},
  {ctx:"racha_mala",x:"Hoy no se experimenta. Lo simple, lo que sabemos, y a morder."},
  {ctx:"racha_mala",x:"Si alguien no está para pelear, que lo diga ahora. Después no."},
  {ctx:"meta_cerca",x:"Estamos a un paso. Hoy no se regala. Ni un córner."},
  {ctx:"meta_cerca",x:"La meta se ve. El que se ponga nervioso, al banco."},
  {ctx:"meta_cerca",x:"Tres puntos y dormimos más tranquilos. Uno y seguimos sufriendo."},
  {ctx:"meta_cerca",x:"Que no se pongan a contar. Se cuenta después, con el silbato."},
  {ctx:"meta_cerca",x:"El rival sabe lo que nos jugamos. Van a morder. Hay que morder más."},
  {ctx:"meta_cerca",x:"Hoy es de los que aguantan. El talentoso que espere su minuto."}
];

function fraseCuerpoTecnico(part){
  var ctx="parejo";
  try{
    var yo=(typeof E!=="undefined"&&E&&typeof clubLookup==="function")?clubLookup(E.club):null;
    var riv=part&&(clubLookup(part.rivalId)||{fuerza:60});
    var fYo=yo?yo.fuerza:60, fRiv=riv.fuerza||60;
    if(typeof esClasico==="function" && part && esClasico(part)) ctx="clasico";
    else if(typeof E!=="undefined"&&E&&E.temporada&&E.temporada.sinGanar>=3) ctx="racha_mala";
    else if(typeof E!=="undefined"&&E&&E.temporada&&E.temporada.pts>=(puntosVictoria?puntosVictoria()*12:36)) ctx="meta_cerca";
    else if(fYo>=fRiv+8) ctx="favorito";
    else if(fRiv>=fYo+8) ctx="desventaja";
  }catch(e){}
  var pool=FRASES_CUERPO.filter(function(f){ return f.ctx===ctx; });
  if(!pool.length) pool=FRASES_CUERPO;
  return pool[Math.floor(Math.random()*pool.length)].x;
}

/* ---------- TANDA 7 · prensa ---------- */
const PREGUNTAS_BETA=[
  {sit:"previa_favorito",q:"¿Cómo evitas que el plantel se relaje siendo favorito?"},
  {sit:"previa_favorito",q:"El rival viene a cerrarse. ¿Tienes un plan B si no entra el primer gol?"},
  {sit:"previa_favorito",q:"¿Le pediste algo puntual al 9 para partidos que se traban?"},
  {sit:"previa_favorito",q:"La gente ya lo dio por ganado. ¿Eso ayuda o estorba?"},
  {sit:"previa_favorito",q:"¿Hay rotación o sales con el once de siempre?"},
  {sit:"previa_favorito",q:"¿Te preocupa que el rival te reciba de contra?"},
  {sit:"previa_favorito",q:"Tres puntos de locales contra este rival: ¿obligación o partido más?"},
  {sit:"previa_favorito",q:"¿Hablaste con el camarín sobre no subestimar al de abajo?"},
  {sit:"post_derrota",q:"¿Qué le pasó al equipo en el segundo tiempo?"},
  {sit:"post_derrota",q:"¿Fue un problema de plan o de ejecución?"},
  {sit:"post_derrota",q:"¿El rival te sorprendió en algo que no habías visto?"},
  {sit:"post_derrota",q:"¿Mantienes el once para la próxima o hay cambios?"},
  {sit:"post_derrota",q:"La gente se fue callada. ¿Qué les dirías si pudieras?"},
  {sit:"post_derrota",q:"¿Sentiste que el equipo se desordenó después del gol?"},
  {sit:"post_derrota",q:"¿Hay algo que no se vio en la tele y sí en el camarín?"},
  {sit:"post_derrota",q:"¿Asumes la derrota o hay atenuantes que quieras marcar?"},
  {sit:"racha_sin_ganar",q:"¿Cuánto más puede aguantar este ciclo sin una victoria?"},
  {sit:"racha_sin_ganar",q:"¿El camarín sigue contigo o ya hay caras largas?"},
  {sit:"racha_sin_ganar",q:"¿Cambias el sistema o insistes con la misma idea?"},
  {sit:"racha_sin_ganar",q:"La tabla se complica. ¿Sigues pensando en el objetivo de marzo?"},
  {sit:"racha_sin_ganar",q:"¿Pediste refuerzos o hay que arreglarlo con lo que hay?"},
  {sit:"racha_sin_ganar",q:"¿Hay un partido que veas como el corte de la racha?"},
  {sit:"racha_sin_ganar",q:"¿La presión externa está llegando adentro?"},
  {sit:"racha_sin_ganar",q:"¿Descartas que esto termine en crisis institucional?"},
  {sit:"clasico_previa",q:"En un clásico, ¿privilegias el resultado o la forma?"},
  {sit:"clasico_previa",q:"¿Hay alguna consigna especial para no calentarse?"},
  {sit:"clasico_previa",q:"El rival también llega necesitado. ¿Eso cambia el plan?"},
  {sit:"clasico_previa",q:"¿Le diste alguna instrucción extra a los laterales?"},
  {sit:"clasico_previa",q:"¿Temes que el árbitro se vuelva protagonista?"},
  {sit:"clasico_previa",q:"La hinchada pide pelea. ¿Cómo traduces eso a la cancha sin rojas?"},
  {sit:"clasico_previa",q:"¿Hay un jugador del otro lado que te quite el sueño?"},
  {sit:"clasico_previa",q:"¿Este clásico vale por tres en la tabla o vale por la historia?"},
  {sit:"post_goleada",q:"¿Esperabas un margen tan amplio?"},
  {sit:"post_goleada",q:"¿Qué fue lo que más te gustó además de los goles?"},
  {sit:"post_goleada",q:"¿Cuidas que esto no se les suba a la cabeza?"},
  {sit:"post_goleada",q:"¿El 9 está en su mejor momento o todavía puede dar más?"},
  {sit:"post_goleada",q:"¿Rotas ahora que hay margen o insistes con los mismos?"},
  {sit:"post_goleada",q:"El rival se desarmó. ¿Fue mérito tuyo o error de ellos?"},
  {sit:"post_goleada",q:"¿Hay algo que igual corrijas pese al resultado?"},
  {sit:"post_goleada",q:"¿Esta goleada cambia el objetivo de la semana?"},
  {sit:"figura_juvenil",q:"El pibe de la cantera fue figura. ¿Lo ves para titular fijo?"},
  {sit:"figura_juvenil",q:"¿Cómo lo cuidas para que no se queme en dos meses?"},
  {sit:"figura_juvenil",q:"¿Ya hay llamados de afuera por el juvenil?"},
  {sit:"figura_juvenil",q:"¿El camarín lo resguarda o lo dejan solo con la fama?"},
  {sit:"figura_juvenil",q:"¿Minutos de a poco o se gana el puesto y se queda?"},
  {sit:"figura_juvenil",q:"¿Le hablaste después del partido o lo dejaste disfrutar?"},
  {sit:"figura_juvenil",q:"¿La cantera está dando más de lo que el presupuesto permite?"},
  {sit:"figura_juvenil",q:"¿Hay más de su camada que merezca chance?"},
  {sit:"rumor_venta",q:"Circula que hay oferta por un titular. ¿Confirmas algo?"},
  {sit:"rumor_venta",q:"Si llega una cifra importante, ¿el club vende sí o sí?"},
  {sit:"rumor_venta",q:"¿El jugador te pidió salir o es ruido de afuera?"},
  {sit:"rumor_venta",q:"¿Cómo le explicas a la gente una venta a mitad de año?"},
  {sit:"rumor_venta",q:"¿Hay cláusula que te ate las manos?"},
  {sit:"rumor_venta",q:"¿Preferirías reponer en el mismo puesto o reciclar el once?"},
  {sit:"rumor_venta",q:"La prensa ya lo dio por vendido. ¿Eso te complica el camarín?"},
  {sit:"rumor_venta",q:"¿El directorio te consulta o te informa después?"},
  {sit:"promesa_incumplida",q:"Prometiste algo al entorno y no se cumplió. ¿Qué pasó?"},
  {sit:"promesa_incumplida",q:"¿Fue una promesa tuya o del directorio que te dejó mal parado?"},
  {sit:"promesa_incumplida",q:"La gente tiene memoria. ¿Cómo reconstruyes esa palabra?"},
  {sit:"promesa_incumplida",q:"¿Vas a volver a comprometerte en público o ya no?"},
  {sit:"promesa_incumplida",q:"¿El camarín te reclamó esa promesa?"},
  {sit:"promesa_incumplida",q:"¿Hay una fecha nueva o se cayó del todo?"},
  {sit:"promesa_incumplida",q:"¿Asumes el costo o sientes que te usaron de vocero?"},
  {sit:"promesa_incumplida",q:"¿Esto cambia tu relación con los socios?"},
  {sit:"arbitro",q:"¿El árbitro incidió en el resultado o fue un partido más?"},
  {sit:"arbitro",q:"¿Viste el VAR y sigues pensando lo mismo?"},
  {sit:"arbitro",q:"¿Vas a apelar algo o lo dejas pasar?"},
  {sit:"arbitro",q:"¿Sentiste un criterio distinto para cada camiseta?"},
  {sit:"arbitro",q:"La gente silbó al juez. ¿Compartes el enojo o lo bajarías?"},
  {sit:"arbitro",q:"¿Hay un lance puntual que quieras marcar sin quemarte con el colegio?"},
  {sit:"arbitro",q:"¿El cuarto hombre te dijo algo que no se escuchó?"},
  {sit:"arbitro",q:"¿Prefieres no hablar del árbitro y quedarte en tu equipo?"}
];

/* ---------- TANDA 8 · tuits Plop ---------- */
const TUITS_BETA=[
  {ctx:"gana_agonico",quien:"@barra_del_fondo",txt:"EN EL ÚLTIMO MINUTO. ME MUERO. ME MUERO."},
  {ctx:"gana_agonico",quien:"@doña_clarita",txt:"casi me da un ataqui. a esta edad no se puede"},
  {ctx:"gana_agonico",quien:"@pibe_de_la_popular",txt:"EL CORAZÓN NO DA MÁS JAJAJA la cagó el rival al final"},
  {ctx:"gana_agonico",quien:"@el_que_va_en_micro",txt:"iba a tomar la micro y grité. el chofer me miró raro. 3 puntos"},
  {ctx:"gana_agonico",quien:"@hincha_de_ley",txt:"así se gana en chile: feo, tarde y con el alma en la garganta"},
  {ctx:"gana_agonico",quien:"@RadioGolAM",txt:"Gol sobre la hora. El estadio se vino abajo."},
  {ctx:"gana_agonico",quien:"@cuenta_troll",txt:"el dt no tenía idea y igual ganamos. el fútbol es místico"},
  {ctx:"gana_agonico",quien:"@datofutbol",txt:"90+ y la metió. si no era gol mañana había otro dt"},
  {ctx:"pierde_local",quien:"@barra_del_fondo",txt:"EN CASA. EN CASA PERDIMOS. APAGUEN LA LUZ."},
  {ctx:"pierde_local",quien:"@doña_clarita",txt:"pagué la entrada pa ver esto. nunca más po"},
  {ctx:"pierde_local",quien:"@bancado_de_sillon",txt:"localidad: vergüenza. el rival ni se esforzó"},
  {ctx:"pierde_local",quien:"@pibe_de_la_popular",txt:"silbidos desde el 20. el dt se hace el sordo"},
  {ctx:"pierde_local",quien:"@DeporteTotal",txt:"Caída de local. El plantel no encontró cómo lastimar."},
  {ctx:"pierde_local",quien:"@cuenta_troll",txt:"el césped de local también está en contra parece"},
  {ctx:"pierde_local",quien:"@el_verdadero_hincha",txt:"esto no es un mal día. esto ya es identidad"},
  {ctx:"pierde_local",quien:"@CronicaFC",txt:"Se perdió en casa y la tabla se pone cuesta arriba."},
  {ctx:"expulsion",quien:"@barra_del_fondo",txt:"ROJA INÚTIL. PARA QUÉ. PARA QUÉ."},
  {ctx:"expulsion",quien:"@doña_clarita",txt:"el cabezón ese no puede ver una pelota dividida"},
  {ctx:"expulsion",quien:"@cuenta_troll",txt:"roja + 10 hombres + el dt con cara de póker. clásico"},
  {ctx:"expulsion",quien:"@pibe_de_la_popular",txt:"se calentó al pedo. ahora corremos hasta el 90"},
  {ctx:"expulsion",quien:"@RadioGolAM",txt:"Expulsión que deja al equipo con uno menos en un momento clave."},
  {ctx:"expulsion",quien:"@hincha_de_ley",txt:"la roja inútil es el sello de este campeonato"},
  {ctx:"expulsion",quien:"@el_que_va_en_micro",txt:"roja a los 30 y todavía falta el segundo tiempo. gracias"},
  {ctx:"expulsion",quien:"@datofutbol",txt:"con 10 es otro partido. el plan se fue a la basura"},
  {ctx:"hat_trick",quien:"@barra_del_fondo",txt:"HAT TRICK DEL 9. BESENLE LOS PIES."},
  {ctx:"hat_trick",quien:"@doña_clarita",txt:"tres goles. el niño está endemoniado hoy"},
  {ctx:"hat_trick",quien:"@pibe_de_la_popular",txt:"el 9 se está comiendo el campeonato él solito"},
  {ctx:"hat_trick",quien:"@RadioGolAM",txt:"Hat-trick. La noche es de un solo nombre."},
  {ctx:"hat_trick",quien:"@cuenta_troll",txt:"el 9 hizo tres y el dt igual lo va a sacar al 80. genio"},
  {ctx:"hat_trick",quien:"@datofutbol",txt:"tres goles. la cláusula se acaba de inflar solita"},
  {ctx:"hat_trick",quien:"@hincha_de_ley",txt:"así se mata un partido. no con pelotazos"},
  {ctx:"hat_trick",quien:"@CronicaFC",txt:"Noche de hat-trick. El delantero se llevó la platea."},
  {ctx:"penal_errado",quien:"@barra_del_fondo",txt:"EL PENAL. AFUERA. NO PUEDE SER."},
  {ctx:"penal_errado",quien:"@doña_clarita",txt:"tiró el penal a la galaxia. me quiero morir"},
  {ctx:"penal_errado",quien:"@cuenta_troll",txt:"penal errado = temporada resumida en un gif"},
  {ctx:"penal_errado",quien:"@pibe_de_la_popular",txt:"el 10 no patea más. se lo doy al arquero"},
  {ctx:"penal_errado",quien:"@RadioGolAM",txt:"Penal desviado. Una chance de oro que se escapa."},
  {ctx:"penal_errado",quien:"@el_que_va_en_micro",txt:"falló el penal y ahora todos somos técnicos"},
  {ctx:"penal_errado",quien:"@hincha_de_ley",txt:"los penales se patean al ángulo, no al arco iris"},
  {ctx:"penal_errado",quien:"@datofutbol",txt:"penal errado y el rival todavía no festeja. se viene el 1-1"},
  {ctx:"remontada",quien:"@barra_del_fondo",txt:"ÍBAMOS PERDIENDO Y AHORA GANAMOS. LOCOS."},
  {ctx:"remontada",quien:"@doña_clarita",txt:"remontada de las que se cuentan en el almacén"},
  {ctx:"remontada",quien:"@pibe_de_la_popular",txt:"el rival se durmió y le cobramos hasta los intereses"},
  {ctx:"remontada",quien:"@RadioGolAM",txt:"Remontada completa. El partido cambió de dueño."},
  {ctx:"remontada",quien:"@cuenta_troll",txt:"el dt iba a hacer tres cambios defensivos. menos mal no alcanzó"},
  {ctx:"remontada",quien:"@hincha_de_ley",txt:"así se quiere a esta camiseta. de atrás y con bronca"},
  {ctx:"remontada",quien:"@el_que_va_en_micro",txt:"iba 0-1 y salí a comprar pan. volví 2-1. nunca más me muevo"},
  {ctx:"remontada",quien:"@CronicaFC",txt:"De abajo hacia arriba. Carácter que la tabla no mide."},
  {ctx:"goleada_favor",quien:"@barra_del_fondo",txt:"GOLEADA. QUE SIGA EL BAILE."},
  {ctx:"goleada_favor",quien:"@doña_clarita",txt:"hoy sí pagué la entrada a gusto"},
  {ctx:"goleada_favor",quien:"@pibe_de_la_popular",txt:"el rival quiere que piten. nosotros queremos cinco más"},
  {ctx:"goleada_favor",quien:"@RadioGolAM",txt:"Goleada. El partido se acabó mucho antes del 90."},
  {ctx:"goleada_favor",quien:"@cuenta_troll",txt:"goleada y igual va a haber un hincha enojado por el quinto"},
  {ctx:"goleada_favor",quien:"@hincha_de_ley",txt:"así se recuerdan las tardes. no con 1-0 robados"},
  {ctx:"goleada_favor",quien:"@datofutbol",txt:"diferencia de tres o más. la tabla se pone linda"},
  {ctx:"goleada_favor",quien:"@el_del_completo",txt:"hasta el de la salsita está feliz y el no es hincha"},
  {ctx:"clasico_gana",quien:"@barra_del_fondo",txt:"CLÁSICO NUESTRO. QUE LO ESCUCHEN HASTA EN LA LUNA."},
  {ctx:"clasico_gana",quien:"@doña_clarita",txt:"ganamos el clásico. esta semana va a ser rica"},
  {ctx:"clasico_gana",quien:"@pibe_de_la_popular",txt:"el otro lado calladito. música"},
  {ctx:"clasico_gana",quien:"@RadioGolAM",txt:"El clásico se queda en casa. Noche larga para el ganador."},
  {ctx:"clasico_gana",quien:"@cuenta_troll",txt:"ganamos el clásico y igual vamos a pelear entre nosotros. tradición"},
  {ctx:"clasico_gana",quien:"@hincha_de_ley",txt:"el clásico no se juega, se gana. punto"},
  {ctx:"clasico_gana",quien:"@el_que_va_en_micro",txt:"mañana en el trabajo va a haber silencio en la otra cubeta"},
  {ctx:"clasico_gana",quien:"@CronicaFC",txt:"Clásico para un lado. La ciudad se parte otra vez."},
  {ctx:"arquero_figura",quien:"@barra_del_fondo",txt:"EL ARQUERO HOY FUE SANTO. TRES TAPADAS DE OTRO MUNDO."},
  {ctx:"arquero_figura",quien:"@doña_clarita",txt:"el portero se comió el partido. le debo un completo"},
  {ctx:"arquero_figura",quien:"@pibe_de_la_popular",txt:"vuelo, palomita y el palo. el 1 está endemoniado"},
  {ctx:"arquero_figura",quien:"@RadioGolAM",txt:"El arquero sostuvo al equipo cuando el resto no llegó."},
  {ctx:"arquero_figura",quien:"@cuenta_troll",txt:"el 1 atajó lo atajable y lo inatajable. el 9 no le da ni las gracias"},
  {ctx:"arquero_figura",quien:"@hincha_de_ley",txt:"los partidos feos los ganan los arqueros. hoy tocó"},
  {ctx:"arquero_figura",quien:"@datofutbol",txt:"sin el 1 esto era 0-2 fácil. figura de la noche"},
  {ctx:"arquero_figura",quien:"@el_del_completo",txt:"el arquero se merecía el asiento de platea él solito"},
  {ctx:"aburrido",quien:"@doña_clarita",txt:"Este partido da más sueño que la micro un lunes"},
  {ctx:"aburrido",quien:"@barra_del_fondo",txt:"45 minutos y ni un susto. piten y vámonos"},
  {ctx:"aburrido",quien:"@pibe_de_la_popular",txt:"esto no es fútbol, es una reunión de consorcio"},
  {ctx:"aburrido",quien:"@cuenta_troll",txt:"el VAR se durmió y nadie lo notó. resumen del partido"},
  {ctx:"aburrido",quien:"@el_que_va_en_micro",txt:"vine, vi, bostecé. 0-0 eterno"},
  {ctx:"aburrido",quien:"@RadioGolAM",txt:"Trámite trabado. Pocas llegadas, menos ideas."},
  {ctx:"aburrido",quien:"@hincha_de_ley",txt:"si esto es el plan, que alguien avise pa ir a la feria"},
  {ctx:"aburrido",quien:"@datofutbol",txt:"posesión alta, remates bajos. el gráfico da vergüenza"},
  {ctx:"autogol",quien:"@barra_del_fondo",txt:"AUTOGOL. NO. NO. NO."},
  {ctx:"autogol",quien:"@doña_clarita",txt:"el zaguero se la comió. pobrecito y rabia al mismo tiempo"},
  {ctx:"autogol",quien:"@pibe_de_la_popular",txt:"autogol de los que se ven 40 veces en el resumen"},
  {ctx:"autogol",quien:"@cuenta_troll",txt:"el 2 le regaló un gol al rival. detalle"},
  {ctx:"autogol",quien:"@RadioGolAM",txt:"Autogol. El partido se inclina por un error propio."},
  {ctx:"autogol",quien:"@hincha_de_ley",txt:"estos goles duelen más. son de nosotros para ellos"},
  {ctx:"autogol",quien:"@el_que_va_en_micro",txt:"autogol y ahora todos somos defensas en el grupo de whatsapp"},
  {ctx:"autogol",quien:"@CronicaFC",txt:"Gol en contra que cambia el trámite. Error no forzado."},
  {ctx:"var",quien:"@barra_del_fondo",txt:"EL VAR. OTRA VEZ EL VAR. SÁQUENLO."},
  {ctx:"var",quien:"@doña_clarita",txt:"cuánto demoran. el completo se me enfrió"},
  {ctx:"var",quien:"@pibe_de_la_popular",txt:"var pa todo menos pa lo que nos cobraron mal a nosotros"},
  {ctx:"var",quien:"@cuenta_troll",txt:"el var revisa, revisa, y decide según el lado de la cama"},
  {ctx:"var",quien:"@RadioGolAM",txt:"Revisión VAR. El partido se detiene y el estadio discute."},
  {ctx:"var",quien:"@hincha_de_ley",txt:"si el var no aclara, que no llame. nos deja peor"},
  {ctx:"var",quien:"@datofutbol",txt:"minuto 70 y el partido está en un monitor. bienvenido a 2026"},
  {ctx:"var",quien:"@el_del_completo",txt:"el var es el único que trabaja más que el vendedor de la platea"}
];

/* ---------- TANDA 9 · canteranos / apodos ---------- */
const CANTERA_BETA=[
  ["Benjamín Opazo","DEF",17,42,72,0.5,18,["canterano","proyección"]],
  ["Joaquín Farías","VOL",18,44,74,0.5,22,["canterano","enganche"]],
  ["Matías Henríquez","DEL",19,48,76,0.5,28,["canterano","velocidad"]],
  ["Cristóbal Saavedra","ARQ",18,40,70,0.5,16,["canterano"]],
  ["Ignacio Venegas","DEF",16,38,74,0.5,15,["canterano","proyección"]],
  ["Felipe Alarcón","VOL",20,50,72,0.5,24,["canterano","contención"]],
  ["Lucas Poblete","DEL",17,41,75,0.5,20,["canterano","frio de definicion"]],
  ["Diego Núñez","DEF",19,46,70,0.5,20,["canterano"]],
  ["Nicolás Godoy","VOL",18,43,73,0.5,19,["canterano","llegador"]],
  ["Vicente Parra","DEL",16,36,78,0.5,18,["canterano","proyección"]],
  ["Martín Lagos","ARQ",19,44,68,0.5,14,["canterano"]],
  ["Tomás Riquelme","DEF",17,40,72,0.5,16,["canterano","juego aéreo"]],
  ["Gabriel Toledo","VOL",20,49,70,0.5,22,["canterano"]],
  ["Simón Cáceres","DEL",18,45,74,0.5,24,["canterano","desequilibrio"]],
  ["Agustín Soto","DEF",16,37,73,0.5,14,["canterano"]],
  ["Maximiliano Rojas","VOL",19,47,71,0.5,20,["canterano","tiro libre"]],
  ["Elías Muñoz","DEL",17,42,76,0.5,22,["canterano","velocidad"]],
  ["Renato Tapia","DEF",18,44,70,0.5,18,["canterano"]],
  ["Pablo Vergara","VOL",16,35,74,0.5,14,["canterano","proyección"]],
  ["Javier Carmona","ARQ",17,39,71,0.5,12,["canterano"]],
  ["Benjamín Paredes","DEL",20,51,69,0.5,22,["canterano"]],
  ["Joaquín Sepúlveda","DEF",19,46,72,0.5,20,["canterano","contención"]],
  ["Matías Donoso","VOL",18,43,75,0.5,21,["canterano","enganche"]],
  ["Cristóbal Leiva","DEL",16,38,77,0.5,17,["canterano","proyección"]],
  ["Ignacio Bravo","DEF",20,50,68,0.5,20,["canterano"]],
  ["Felipe Carrasco","VOL",17,41,73,0.5,16,["canterano"]],
  ["Lucas Aravena","DEL",19,47,74,0.5,24,["canterano","llegador"]],
  ["Diego Fuentes","ARQ",18,42,70,0.5,14,["canterano"]],
  ["Nicolás Olivares","DEF",16,36,75,0.5,15,["canterano","proyección"]],
  ["Vicente Sandoval","VOL",20,48,71,0.5,22,["canterano","contención"]]
];
const NOMBRES_CANTERA_BETA=CANTERA_BETA.map(function(a){ return a[0]; }).concat([
  "Benjamín Ortiz","Joaquín Palma","Matías Quiroz","Cristóbal Vega","Ignacio Molina",
  "Felipe Navarro","Lucas Henríquez","Diego Carrera","Nicolás Pino","Vicente Salas"
]);
const APODOS_BETA=[
  "el Pitu","el Flaco","el Chino","el Coto","el Mago","el Nene","el Indio","el Cote","el Nano","el Loco",
  "el Gato","el Conejo","el Toro","el Rata","el Pollo","el Chino 2","el Cabezón","el Zurdo","el Negro","el Rubio",
  "el Pibe","el Jefe","el Profe","el Cacha","el Mumo","el Tata","el Chico","el Grande","el Rápido","el Lento",
  "el 10","el 9","el Muro","el Caño","el Fantasma","el Bicho","el León","el Puma","el Zorro","el Halcón"
];

/* ---------- TANDA 10 · imágenes (lista, no archivos oficiales) ---------- */
const IMG_PEDIDOS=[
  "img/clubes/{id}.svg — escudo ESTILIZADO genérico por club (no calcar el oficial)",
  "img/estadios/{id}.jpg — foto de tribuna/cancha, uso libre o placeholder",
  "img/periodistas/{slug}.jpg — retrato genérico, no foto de persona real sin permiso",
  "Los archivos los sube el usuario a public/juego/img/. Acá solo la lista."
];

/* ---------- hooks ---------- */
(function integrarBeta(){
  if(typeof NOMBRES_CANTERA!=="undefined" && Array.isArray(NOMBRES_CANTERA)){
    NOMBRES_CANTERA_BETA.forEach(function(n){
      if(NOMBRES_CANTERA.indexOf(n)<0) NOMBRES_CANTERA.push(n);
    });
  }
  if(typeof APODOS_CANTERA!=="undefined" && Array.isArray(APODOS_CANTERA)){
    APODOS_BETA.forEach(function(a){
      if(APODOS_CANTERA.indexOf(a)<0) APODOS_CANTERA.push(a);
    });
  }
  if(typeof PREGUNTAS_VOZ!=="undefined" && Array.isArray(PREGUNTAS_VOZ)){
    PREGUNTAS_BETA.forEach(function(p){ PREGUNTAS_VOZ.push(p); });
  }
  if(typeof TUITS_MOMENTO!=="undefined" && Array.isArray(TUITS_MOMENTO)){
    TUITS_BETA.forEach(function(t){ TUITS_MOMENTO.push(t); });
  }

  if(typeof fraseRelato==="function" && !fraseRelato._beta){
    var orig=fraseRelato;
    fraseRelato=function(P,min){
      try{
        if(RELATO_BETA.length && Math.random()<0.72){
          var momento="equilibrio";
          var cans=P&&P.cansancio||0;
          if(min<12) momento="inicio";
          else if(cans>7) momento="cansancio";
          else if(P&&P.fase==="dominio") momento="dominio";
          else if(P&&P.fase==="ahogo") momento="ahogo";
          else if(P&&P.fase==="aguanta") momento="aguanta";
          else if(min>75) momento="cansancio";
          var pool=RELATO_BETA.filter(function(r){ return r.m===momento; });
          if(!pool.length) pool=RELATO_BETA;
          return pool[Math.floor(Math.random()*pool.length)].x;
        }
      }catch(e){}
      return orig(P,min);
    };
    fraseRelato._beta=true;
  }

  if(typeof preguntasPostPartido==="function" && !preguntasPostPartido._beta){
    var origP=preguntasPostPartido;
    preguntasPostPartido=function(res,P){
      var L=origP(res,P)||[];
      try{
        var sits=[];
        if(typeof E!=="undefined"&&E&&Array.isArray(E.promesas)&&E.promesas.some(function(x){ return x&&x.rota; })) sits.push("promesa_incumplida");
        if(P&&(P.var||P.rojas||(P.lineas||[]).some(function(l){ return /árbitro|VAR|penal/i.test(l.t||""); }))) sits.push("arbitro");
        sits.forEach(function(sit){
          PREGUNTAS_BETA.filter(function(p){ return p.sit===sit; }).slice(0,2).forEach(function(p,i){
            L.unshift({id:"beta_"+sit+"_"+i, prio:7, q:p.q, ops:[
              {t:"Bajar el perfil",k:"humilde"},
              {t:"Bancarlo de frente",k:"bancar"},
              {t:"Un palo y a la siguiente",k:"palo"}
            ]});
          });
        });
      }catch(e){}
      return L;
    };
    preguntasPostPartido._beta=true;
    preguntasPostPartido._voz=!!origP._voz || true;
  }
})();
