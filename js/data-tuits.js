"use strict";
/* ============================================================
   FUTBOLINI · data-tuits.js  (7.11 · voz de las redes 2026, de Grok · aprobados)
   Tuits ESCRITOS Y APROBADOS: jerga chilena real de X/Twitter futbolero,
   memes y wordplay. Tokens {GOLEADOR}/{FIGURA}/{CAPITAN}/{ARQUERO}/{DT}
   se reemplazan por nombres reales del plantel.

   INTEGRACIÓN (7.11):
   1. PISA los tuits genéricos viejos: para cada contexto que Grok cubre acá,
      se sacan los del pool base (data-voz.js) y quedan SOLO estos. Así se ven
      tal cual. Los contextos que NO están acá (ej: analogia_dunk) no se tocan.
   2. APODOS_MEME: cuando ESE jugador está en cancha (su nombre aparece en el
      tuit ya resuelto), las cuentas troll lo bautizan con su apodo.
   3. Contextos nuevos que NO son evento de partido (descenso_peligro,
      rumor_fichaje, invicto) se disparan desde el ambiente del ticker.
   ============================================================ */
const TUITS_EXTRA = [
  { ctx:"gana_agonico", quien:"@barra_del_sur", txt:"EN EL ÚLTIMO MINUTO WN. ME MUERO. ME MUERO." },
  { ctx:"gana_agonico", quien:"@dona_del_canal13", txt:"ay hijito yo ya tenía el té servido pa llorar y mira ahora" },
  { ctx:"gana_agonico", quien:"@garrafal_cl", txt:"así se gana en chile: feo, tarde y con el alma en la garganta" },
  { ctx:"gana_agonico", quien:"@cuenta_troll", txt:"el rival se quedó esperando el pitazo. el pitazo nunca llegó ksksks" },
  { ctx:"gana_agonico", quien:"@datofutbol_cl", txt:"gol al 90+7. primer tanto de {GOLEADOR} después de los 90 este año." },
  { ctx:"gana_agonico", quien:"@hincha_rival_xd", txt:"robado. como siempre. nos vemos en tribunal po" },
  { ctx:"gana_agonico", quien:"@pibe_popular23", txt:"me paré en el living y grité como si estuviera en la galería. vecinos wrns" },
  { ctx:"gana_agonico", quien:"@RadioGolAM", txt:"Gol de {GOLEADOR} en tiempo añadido. El local se queda con los tres puntos." },
  { ctx:"gana_agonico", quien:"@weon_del_metro", txt:"grité el gol en la L1 y la tía de al lado me miró como si hubiera robado" },
  { ctx:"gana_agonico", quien:"@albo_insomne", txt:"estoy VIVO. no me hablen. estoy vivo." },
  { ctx:"gana_agonico", quien:"@dt_de_living", txt:"el {DT} no cambió a nadie y igual salió. esto no se explica" },
  { ctx:"gana_agonico", quien:"@socio_enojado", txt:"pagué la entrada pa casi infartarme. igual vuelvo la otra semana po" },
  { ctx:"gana_agonico", quien:"@el_del_tercer_tiempo", txt:"el 1 del rival ni se tiró. se quedó parado y igual casi ataja. SKKSKDKD" },
  { ctx:"gana_agonico", quien:"@viejo_del_bar", txt:"yo lo dije a los 80. esto se gana o se muere. no hay tercera" },
  { ctx:"gana_agonico", quien:"@DeporteTotal", txt:"Victoria agónica. {GOLEADOR} define y el estadio se viene abajo." },

  { ctx:"pierde_local", quien:"@barra_del_sur", txt:"EN CASA WN. EN CASA. NO PUEDE SER." },
  { ctx:"pierde_local", quien:"@dona_del_canal13", txt:"ay no hijito esto no se le hace a la gente que va todos los domingos" },
  { ctx:"pierde_local", quien:"@garrafal_cl", txt:"el césped de local también está en contra parece. no queda otra explicación" },
  { ctx:"pierde_local", quien:"@cuenta_troll", txt:"después van a decir que el árbitro. el árbitro no pateó esa wea" },
  { ctx:"pierde_local", quien:"@datofutbol_cl", txt:"0 tiros al arco en el segundo tiempo. local." },
  { ctx:"pierde_local", quien:"@hincha_rival_xd", txt:"fui de visita y me atendieron como en hotel 5 estrellas. gracias" },
  { ctx:"pierde_local", quien:"@pibe_popular23", txt:"la barra cantó más que el equipo jugó. resumen del año" },
  { ctx:"pierde_local", quien:"@RadioGolAM", txt:"El local cae en casa. Pocas ideas, nula profundidad." },
  { ctx:"pierde_local", quien:"@weon_del_metro", txt:"salí del estadio y la micro no venía. el día completo en contra" },
  { ctx:"pierde_local", quien:"@socio_enojado", txt:"pagué la entrada pa ver esto. nunca más. nunca más po" },
  { ctx:"pierde_local", quien:"@dt_de_living", txt:"el {DT} va a salir a hablar de proceso. el proceso es el problema" },
  { ctx:"pierde_local", quien:"@tia_del_grupo", txt:"apagué la tele al 70 y igual supe el resultado. se sentía" },
  { ctx:"pierde_local", quien:"@viejo_del_bar", txt:"esto no es un mal día. esto ya es identidad" },
  { ctx:"pierde_local", quien:"@el_del_tercer_tiempo", txt:"el 9 no pescó un centro en 90 minutos. uno. un centro." },
  { ctx:"pierde_local", quien:"@DeporteTotal", txt:"Derrota local. El visitante se llevó el partido con lo justo." },

  { ctx:"expulsion", quien:"@barra_del_sur", txt:"ROJA DIRECTA AL {CAPITAN}. SE ACABÓ EL PARTIDO AHÍ." },
  { ctx:"expulsion", quien:"@dona_del_canal13", txt:"ay pero si ni lo tocó hijito. ni lo tocó" },
  { ctx:"expulsion", quien:"@garrafal_cl", txt:"el {CAPITAN} se fue antes que el once. consistente al menos" },
  { ctx:"expulsion", quien:"@cuenta_troll", txt:"segunda amarilla por existir. el juez lo tenía fichado desde el himno" },
  { ctx:"expulsion", quien:"@datofutbol_cl", txt:"el {CAPITAN} suma su tercera expulsión en el torneo." },
  { ctx:"expulsion", quien:"@hincha_rival_xd", txt:"gracias {CAPITAN} por el manito. se agradece el gesto" },
  { ctx:"expulsion", quien:"@pibe_popular23", txt:"se picó el wn y ahora jugamos con 10. clásico" },
  { ctx:"expulsion", quien:"@RadioGolAM", txt:"Roja directa para {CAPITAN}. El partido se desarma." },
  { ctx:"expulsion", quien:"@weon_del_metro", txt:"vi la roja en el celu en la micro y grité. el chofer frenó" },
  { ctx:"expulsion", quien:"@dt_de_living", txt:"el {DT} lo dejó 10 minutos de más. lo vio venir todo el estadio" },
  { ctx:"expulsion", quien:"@albo_insomne", txt:"no puede ser. no puede ser. con 10 esto es funeral" },
  { ctx:"expulsion", quien:"@viejo_del_bar", txt:"cuando el capitán se va expulsado ya sabís cómo termina la película" },
  { ctx:"expulsion", quien:"@garrafal_cl", txt:"tarjeta roja: el único cambio que sí funcionó hoy" },
  { ctx:"expulsion", quien:"@cuenta_troll", txt:"el {CAPITAN} se fue a ducharse a los 40. privilegiado" },
  { ctx:"expulsion", quien:"@DeporteTotal", txt:"Expulsión de {CAPITAN}. Quedan con uno menos y el partido se complica." },

  { ctx:"hat_trick", quien:"@barra_del_sur", txt:"TRES {GOLEADOR}. TRES. QUE SE CALLE TODO EL MUNDO." },
  { ctx:"hat_trick", quien:"@dona_del_canal13", txt:"ay ese cabro {GOLEADOR} tiene ángel hijito. tiene ángel" },
  { ctx:"hat_trick", quien:"@garrafal_cl", txt:"{GOLEADOR} hoy cobró el sueldo del semestre en 70 minutos" },
  { ctx:"hat_trick", quien:"@cuenta_troll", txt:"el 1 del rival ya pidió cambio psicológico. tres veces la misma wea" },
  { ctx:"hat_trick", quien:"@datofutbol_cl", txt:"hat-trick de {GOLEADOR}. 3 goles, 4 remates, 1 asistencia." },
  { ctx:"hat_trick", quien:"@hincha_rival_xd", txt:"apaguen a {GOLEADOR} por favor. esto ya es abuso" },
  { ctx:"hat_trick", quien:"@pibe_popular23", txt:"{GOLEADOR} está en modo dios wn. no lo pescan ni con red" },
  { ctx:"hat_trick", quien:"@RadioGolAM", txt:"Hat-trick de {GOLEADOR}. Actuación determinante." },
  { ctx:"hat_trick", quien:"@weon_del_metro", txt:"el tercero lo grité tan fuerte que se me cayó el vaso en la micro" },
  { ctx:"hat_trick", quien:"@albo_insomne", txt:"{GOLEADOR} es de otro planeta wn" },
  { ctx:"hat_trick", quien:"@tia_del_grupo", txt:"mandé el audio al grupo familiar y ahora todos me odian. valió la pena" },
  { ctx:"hat_trick", quien:"@viejo_del_bar", txt:"hace rato que no veía un 9 que oliera el gol así. rato" },
  { ctx:"hat_trick", quien:"@el_del_tercer_tiempo", txt:"el segundo de taco. el tercero de rabia. artista ql" },
  { ctx:"hat_trick", quien:"@socio_enojado", txt:"pagué la entrada y por una vez no me arrepiento. anoten la fecha" },
  { ctx:"hat_trick", quien:"@DeporteTotal", txt:"Tres goles de {GOLEADOR}. El partido se le hizo estrecho al rival." },

  { ctx:"penal_errado", quien:"@barra_del_sur", txt:"EL PENAL WN. EL PENAL. ME QUIERO MORIR." },
  { ctx:"penal_errado", quien:"@dona_del_canal13", txt:"ay hijito lo tiró tan al medio que hasta yo lo atajaba" },
  { ctx:"penal_errado", quien:"@garrafal_cl", txt:"el penal más anunciado desde que inventaron los penales" },
  { ctx:"penal_errado", quien:"@cuenta_troll", txt:"lo mandó a buscar a la familia. llegó a la tribuna de visita" },
  { ctx:"penal_errado", quien:"@datofutbol_cl", txt:"{GOLEADOR} erra el 3er penal del torneo. 2 de 5 en el año." },
  { ctx:"penal_errado", quien:"@hincha_rival_xd", txt:"gracias {GOLEADOR} de verdad. te debemos una" },
  { ctx:"penal_errado", quien:"@pibe_popular23", txt:"se demoró tanto en patear que el arquero se alcanzó a aburrir" },
  { ctx:"penal_errado", quien:"@RadioGolAM", txt:"Penal errado de {GOLEADOR}. El arco se queda en cero." },
  { ctx:"penal_errado", quien:"@weon_del_metro", txt:"vi el penal en el celu y el wn del asiento se rió. lo iba a pescar" },
  { ctx:"penal_errado", quien:"@dt_de_living", txt:"quién le da el penal a ese wn. pregunta seria" },
  { ctx:"penal_errado", quien:"@albo_insomne", txt:"no puede ser. no puede ser. era el partido" },
  { ctx:"penal_errado", quien:"@viejo_del_bar", txt:"penal al ángulo... del segundo piso. talento hay" },
  { ctx:"penal_errado", quien:"@el_del_tercer_tiempo", txt:"el {ARQUERO} rival ni se tiró. se quedó parado y igual atajó. SKKSKDKD" },
  { ctx:"penal_errado", quien:"@cuenta_troll", txt:"ese penal lo patea mejor mi tía con chinelas" },
  { ctx:"penal_errado", quien:"@DeporteTotal", txt:"{GOLEADOR} desperdicia la pena máxima. Oportunidad clave." },

  { ctx:"goleada_favor", quien:"@barra_del_sur", txt:"GOLEADA. GOLEADA EN CASA. QUE LO ESCUCHE TODO CHILE." },
  { ctx:"goleada_favor", quien:"@dona_del_canal13", txt:"ay hijito por fin una tarde tranquila. hasta me hice otro té" },
  { ctx:"goleada_favor", quien:"@garrafal_cl", txt:"el rival vino a cumplir el fixture. misión cumplida diría yo" },
  { ctx:"goleada_favor", quien:"@cuenta_troll", txt:"apaguen esto por piedad. ya no es partido es contenido para tiktok" },
  { ctx:"goleada_favor", quien:"@datofutbol_cl", txt:"4-0 al descanso. 18 remates, 9 al arco. control total." },
  { ctx:"goleada_favor", quien:"@hincha_rival_xd", txt:"nos fuimos al segundo tiempo a comprar completo. prioridad" },
  { ctx:"goleada_favor", quien:"@pibe_popular23", txt:"{GOLEADOR} y {FIGURA} se están pasando la pelota como si fuera pichanga" },
  { ctx:"goleada_favor", quien:"@RadioGolAM", txt:"Goleada local. El partido se definió temprano." },
  { ctx:"goleada_favor", quien:"@weon_del_metro", txt:"voy llegando a la casa y ya van 3. la micro esta vez sirvió de algo" },
  { ctx:"goleada_favor", quien:"@albo_insomne", txt:"estoy VIVO y no es agónico. raro el sentimiento" },
  { ctx:"goleada_favor", quien:"@tia_del_grupo", txt:"mandé 14 audios al grupo. nadie me va a callar hoy" },
  { ctx:"goleada_favor", quien:"@viejo_del_bar", txt:"así da gusto. aunque después uno se acostumbra y duele más cuando no" },
  { ctx:"goleada_favor", quien:"@socio_enojado", txt:"hoy sí valió la entrada. anoten que lo dije" },
  { ctx:"goleada_favor", quien:"@el_del_tercer_tiempo", txt:"el 4 lo hizo {FIGURA} de chilena. innecesario y por eso bacán" },
  { ctx:"goleada_favor", quien:"@DeporteTotal", txt:"Contundente victoria. {GOLEADOR} y {FIGURA} marcaron la diferencia." },

  { ctx:"remontada", quien:"@barra_del_sur", txt:"ÍBAMOS PERDIENDO 2-0 WN. AHORA GANAMOS. AHORA GANAMOS." },
  { ctx:"remontada", quien:"@dona_del_canal13", txt:"ay yo ya había apagado la tele hijito. qué susto más rico" },
  { ctx:"remontada", quien:"@garrafal_cl", txt:"el plan era perder feo. el plan falló y ahora no sabemos qué hacer" },
  { ctx:"remontada", quien:"@cuenta_troll", txt:"el rival se confió en el 2-0. error de principiante. somos chile" },
  { ctx:"remontada", quien:"@datofutbol_cl", txt:"abajo 2-0 al 55. 3 goles en 18 minutos. remontada." },
  { ctx:"remontada", quien:"@hincha_rival_xd", txt:"teníamos 2-0 y se nos ocurrió jugar. nunca más" },
  { ctx:"remontada", quien:"@pibe_popular23", txt:"el {CAPITAN} se paró en el círculo y dijo weón ganamos esto. y ganaron" },
  { ctx:"remontada", quien:"@RadioGolAM", txt:"Remontada. De 0-2 a victoria. Partido de carácter." },
  { ctx:"remontada", quien:"@weon_del_metro", txt:"me bajé en una estación antes de gritar el 3-2. la gente me miró mal" },
  { ctx:"remontada", quien:"@albo_insomne", txt:"me quiero morir de la emoción. al revés que siempre" },
  { ctx:"remontada", quien:"@dt_de_living", txt:"los cambios del {DT} por una vez no fueron a buscar agua" },
  { ctx:"remontada", quien:"@viejo_del_bar", txt:"cuando iban 2-0 yo ya estaba en modo funeral. qué hincha más cobarde" },
  { ctx:"remontada", quien:"@el_del_tercer_tiempo", txt:"el segundo de la remontada fue un rebote de esos que son destino" },
  { ctx:"remontada", quien:"@socio_enojado", txt:"a los 50 estaba pidiendo la plata de la entrada. ahora pido disculpas" },
  { ctx:"remontada", quien:"@DeporteTotal", txt:"El equipo dio vuelta un 0-2. {GOLEADOR} puso el definitivo." },

  { ctx:"clasico_gana", quien:"@barra_del_sur", txt:"CLÁSICO NUESTRO. CLÁSICO NUESTRO. QUE LO ESCUCHEN ALLÁ." },
  { ctx:"clasico_gana", quien:"@dona_del_canal13", txt:"ay hijito el vecino de al lado no va a salir a barrer mañana" },
  { ctx:"clasico_gana", quien:"@garrafal_cl", txt:"el clásico se gana feo o no se gana. hoy se respetó la tradición" },
  { ctx:"clasico_gana", quien:"@cuenta_troll", txt:"los de allá van a decir que el árbitro. el árbitro no les atajó los centros" },
  { ctx:"clasico_gana", quien:"@datofutbol_cl", txt:"invicto de 4 clásicos. {FIGURA} fue el mejor del partido." },
  { ctx:"clasico_gana", quien:"@hincha_rival_xd", txt:"ya fue. nos vemos en 6 meses pa volver a sufrir. clientes frecuentes" },
  { ctx:"clasico_gana", quien:"@pibe_popular23", txt:"el bombo no paró. la calle tampoco. esto es lo que uno espera po" },
  { ctx:"clasico_gana", quien:"@RadioGolAM", txt:"El clásico se queda en casa. Partido trabado, definido por un detalle." },
  { ctx:"clasico_gana", quien:"@weon_del_metro", txt:"en la micro después del clásico hay dos tipos de gente. hoy éramos los otros" },
  { ctx:"clasico_gana", quien:"@albo_insomne", txt:"no voy a dormir. no quiero que se me pase" },
  { ctx:"clasico_gana", quien:"@tia_del_grupo", txt:"el cuñado es del otro. le mandé el marcador sin texto. suficiente" },
  { ctx:"clasico_gana", quien:"@viejo_del_bar", txt:"los clásicos no se juegan. se sobreviven. hoy sobrevivimos mejor" },
  { ctx:"clasico_gana", quien:"@el_del_tercer_tiempo", txt:"{CAPITAN} le ganó todos los duelos al 5 de ellos. personal" },
  { ctx:"clasico_gana", quien:"@socio_enojado", txt:"pagué más cara la entrada y igual vale. clásico no se discute" },
  { ctx:"clasico_gana", quien:"@DeporteTotal", txt:"Victoria en el clásico. {FIGURA} fue figura y {GOLEADOR} marcó." },

  { ctx:"arquero_figura", quien:"@barra_del_sur", txt:"{ARQUERO} ES INATAJABLE HOY. INATAJABLE." },
  { ctx:"arquero_figura", quien:"@dona_del_canal13", txt:"ay ese {ARQUERO} tiene las manos benditas hijito" },
  { ctx:"arquero_figura", quien:"@garrafal_cl", txt:"el resto jugó a las escondidas y {ARQUERO} bancó el sueldo de 11" },
  { ctx:"arquero_figura", quien:"@cuenta_troll", txt:"el 9 rival se fue a la casa a revisar si existía. {ARQUERO} lo borró" },
  { ctx:"arquero_figura", quien:"@datofutbol_cl", txt:"{ARQUERO}: 9 atajadas, 2 de ellas a quemarropa. 0 goles." },
  { ctx:"arquero_figura", quien:"@hincha_rival_xd", txt:"teníamos 4 claras y el wn volaba. filo. ya fue" },
  { ctx:"arquero_figura", quien:"@pibe_popular23", txt:"{ARQUERO} atajó una de esas que se celebran más que un gol. brígido" },
  { ctx:"arquero_figura", quien:"@RadioGolAM", txt:"Partido enorme de {ARQUERO}. Sostuvo el resultado." },
  { ctx:"arquero_figura", quien:"@weon_del_metro", txt:"vi la atajada del segundo tiempo en el celu 4 veces. la micro se me pasó" },
  { ctx:"arquero_figura", quien:"@albo_insomne", txt:"{ARQUERO} hoy es santo. no me importa la religión" },
  { ctx:"arquero_figura", quien:"@dt_de_living", txt:"el {DT} puede dormir tranquilo. el 1 le tapó todos los errores" },
  { ctx:"arquero_figura", quien:"@viejo_del_bar", txt:"un arquero así te da 8 puntos extras al año. hoy dio 3 de una" },
  { ctx:"arquero_figura", quien:"@el_del_tercer_tiempo", txt:"la última atajada fue con la cara. el hombre ya no tiene límites" },
  { ctx:"arquero_figura", quien:"@cuenta_troll", txt:"propongo que {ARQUERO} pague menos entrada. él es el espectáculo" },
  { ctx:"arquero_figura", quien:"@DeporteTotal", txt:"Gran jornada de {ARQUERO}. Evitó el empate en dos ocasiones." },

  { ctx:"empate_pobre", quien:"@barra_del_sur", txt:"EMPATE FOME. EMPATE FOME. PARA QUÉ JUGAMOS." },
  { ctx:"empate_pobre", quien:"@dona_del_canal13", txt:"ay hijito mejor me pongo a tejer. esto no avanza" },
  { ctx:"empate_pobre", quien:"@garrafal_cl", txt:"90 minutos pa empatar 0-0. el fútbol como experiencia de espera" },
  { ctx:"empate_pobre", quien:"@cuenta_troll", txt:"el 0-0 más trabajado del año. se nota el esfuerzo por no hacer nada" },
  { ctx:"empate_pobre", quien:"@datofutbol_cl", txt:"0-0. 3 remates al arco entre los dos. xG total: 0.41." },
  { ctx:"empate_pobre", quien:"@hincha_rival_xd", txt:"vinimos por un punto y nos fuimos contentos. nivel de ambos" },
  { ctx:"empate_pobre", quien:"@pibe_popular23", txt:"la barra cantó un himno y en la cancha nadie pescó un segundo piso" },
  { ctx:"empate_pobre", quien:"@RadioGolAM", txt:"Empate sin goles. Partido de escasas ocasiones." },
  { ctx:"empate_pobre", quien:"@weon_del_metro", txt:"me quedé dormido en la micro y me perdí el segundo tiempo. no me perdí nada" },
  { ctx:"empate_pobre", quien:"@socio_enojado", txt:"pagué la entrada pa ver un entrenamiento. nunca más po" },
  { ctx:"empate_pobre", quien:"@dt_de_living", txt:"el {DT} va a decir que el punto es bueno. el punto es un eufemismo" },
  { ctx:"empate_pobre", quien:"@viejo_del_bar", txt:"partidos así te hacen cuestionar el hobby. y uno vuelve igual" },
  { ctx:"empate_pobre", quien:"@tia_del_grupo", txt:"apagué al 60 y pregunté el resultado a las 10. 0-0. obvio" },
  { ctx:"empate_pobre", quien:"@el_del_tercer_tiempo", txt:"el único peligro fue un córner que se fue a córner. poesía" },
  { ctx:"empate_pobre", quien:"@DeporteTotal", txt:"Reparto de puntos. Poco fútbol, menos claridad." },

  { ctx:"gol_anulado_var", quien:"@barra_del_sur", txt:"EL VAR WN. EL VAR NOS ROBÓ EL GOL. NO PUEDE SER." },
  { ctx:"gol_anulado_var", quien:"@dona_del_canal13", txt:"ay pero si estaba adentro hijito. se veía adentro desde acá" },
  { ctx:"gol_anulado_var", quien:"@garrafal_cl", txt:"el var revisó 4 minutos pa anular un gol que todos vimos válido. oficio" },
  { ctx:"gol_anulado_var", quien:"@cuenta_troll", txt:"el offside era la sombra del 9. la sombra. estamos en 2026" },
  { ctx:"gol_anulado_var", quien:"@datofutbol_cl", txt:"gol anulado a {GOLEADOR} por posición adelantada. margen: 8 cm." },
  { ctx:"gol_anulado_var", quien:"@hincha_rival_xd", txt:"justicia. por una vez el var nos pescó a nosotros de bien" },
  { ctx:"gol_anulado_var", quien:"@pibe_popular23", txt:"celebré como idiota 20 segundos. 20 segundos de felicidad prestada" },
  { ctx:"gol_anulado_var", quien:"@RadioGolAM", txt:"El VAR anula el tanto de {GOLEADOR} por fuera de juego." },
  { ctx:"gol_anulado_var", quien:"@weon_del_metro", txt:"grité el gol en la L5 y a los 10 segundos tuve que bajar la voz. humillante" },
  { ctx:"gol_anulado_var", quien:"@albo_insomne", txt:"me quiero morir. lo dimos por hecho. lo dimos por hecho" },
  { ctx:"gol_anulado_var", quien:"@dt_de_living", txt:"el {DT} se quedó mirando el monitor como si pudiera apelarlo" },
  { ctx:"gol_anulado_var", quien:"@viejo_del_bar", txt:"antes el juez se equivocaba solo. ahora se equivocan entre 6. progreso" },
  { ctx:"gol_anulado_var", quien:"@el_del_tercer_tiempo", txt:"la raya la dibujaron con la pata. esa línea no es humana" },
  { ctx:"gol_anulado_var", quien:"@socio_enojado", txt:"después van a decir que el var. el var sí pateó esa wea" },
  { ctx:"gol_anulado_var", quien:"@DeporteTotal", txt:"Tanto anulado. El VAR determina posición adelantada de {GOLEADOR}." },

  { ctx:"autogol", quien:"@barra_del_sur", txt:"AUTOGOL DEL NUESTRO. AUTOGOL. ME MUERO." },
  { ctx:"autogol", quien:"@dona_del_canal13", txt:"ay hijito el pobre se quiso comer la pelota y se la comió mal" },
  { ctx:"autogol", quien:"@garrafal_cl", txt:"el único que definió con precisión hoy fue el defensa. al arco propio" },
  { ctx:"autogol", quien:"@cuenta_troll", txt:"asistencia del 2, definición del 2. química de ataque" },
  { ctx:"autogol", quien:"@datofutbol_cl", txt:"autogol a los 12'. primer tanto en contra del zaguero este torneo." },
  { ctx:"autogol", quien:"@hincha_rival_xd", txt:"ni lo pedimos. nos lo regalaron envuelto. gracias caballero" },
  { ctx:"autogol", quien:"@pibe_popular23", txt:"el wn la quiso despejar y le salió un centro atrás. talento invertido" },
  { ctx:"autogol", quien:"@RadioGolAM", txt:"Autogol que abre el marcador. Error defensivo grave." },
  { ctx:"autogol", quien:"@weon_del_metro", txt:"lo vi en el celu y me tapé la cara. la tía de al lado preguntó si era mío" },
  { ctx:"autogol", quien:"@albo_insomne", txt:"no puede ser. no puede ser. el año en un fotograma" },
  { ctx:"autogol", quien:"@dt_de_living", txt:"el {DT} se tapó la cara. por una vez coincidimos" },
  { ctx:"autogol", quien:"@viejo_del_bar", txt:"hay goles que te marcan. este te marca al revés" },
  { ctx:"autogol", quien:"@el_del_tercer_tiempo", txt:"el {ARQUERO} ni se movió. respetó la jugada del compañero. caballero" },
  { ctx:"autogol", quien:"@cuenta_troll", txt:"ese despeje sale en el highlight del rival y en nuestra pesadilla" },
  { ctx:"autogol", quien:"@DeporteTotal", txt:"Autogol tempranero. El local se pone en desventaja solo." },

  { ctx:"invicto", quien:"@barra_del_sur", txt:"SEGUIMOS SIN PERDER. SEGUIMOS SIN PERDER WN." },
  { ctx:"invicto", quien:"@dona_del_canal13", txt:"ay hijito ya van varias fechas así. no me acostumbro pero rico" },
  { ctx:"invicto", quien:"@garrafal_cl", txt:"invicto de los que se construyen sufriendo. muy nuestro" },
  { ctx:"invicto", quien:"@cuenta_troll", txt:"el invicto más penca y más valioso al mismo tiempo. especialidad de la casa" },
  { ctx:"invicto", quien:"@datofutbol_cl", txt:"12 partidos sin perder. 7G 5E. 8 goles en contra." },
  { ctx:"invicto", quien:"@hincha_rival_xd", txt:"invictos y igual juegan feo. respetable de cierta forma" },
  { ctx:"invicto", quien:"@pibe_popular23", txt:"no ganamos siempre pero no perdemos. el nuevo estándar chile" },
  { ctx:"invicto", quien:"@RadioGolAM", txt:"El equipo alarga el invicto. Suma importante de cara a la tabla." },
  { ctx:"invicto", quien:"@weon_del_metro", txt:"voy al estadio y salgo con un punto. ya no sé si es suerte o método" },
  { ctx:"invicto", quien:"@albo_insomne", txt:"estoy VIVO hace 12 fechas. el cuerpo no da más pero el alma sí" },
  { ctx:"invicto", quien:"@dt_de_living", txt:"el {DT} no inventó nada. el invicto se está aguantando solo" },
  { ctx:"invicto", quien:"@viejo_del_bar", txt:"los invictos en chile duran hasta que uno habla. ahí lo dije. sorry" },
  { ctx:"invicto", quien:"@socio_enojado", txt:"igual voy. el invicto no tapa que a veces jugamos para atrás" },
  { ctx:"invicto", quien:"@el_del_tercer_tiempo", txt:"{ARQUERO} es el pilar de este invicto. el resto se cuelga" },
  { ctx:"invicto", quien:"@DeporteTotal", txt:"Se mantiene el invicto. {FIGURA} otra vez entre los destacados." },

  { ctx:"descenso_peligro", quien:"@barra_del_sur", txt:"ABAJO OTRA VEZ. ABAJO. ESTO NO ES JUEGO." },
  { ctx:"descenso_peligro", quien:"@dona_del_canal13", txt:"ay hijito ya no duermo los sábados. esto pone vieja a una" },
  { ctx:"descenso_peligro", quien:"@garrafal_cl", txt:"somos clientes frecuentes del dolor. mesa 4 por favor" },
  { ctx:"descenso_peligro", quien:"@cuenta_troll", txt:"la tabla de abajo nos tiene de foto de perfil. íntimo" },
  { ctx:"descenso_peligro", quien:"@datofutbol_cl", txt:"3 puntos sobre el descenso. -8 de diferencia de gol. 7 fechas." },
  { ctx:"descenso_peligro", quien:"@hincha_rival_xd", txt:"los veo y me da cosa. después me acuerdo de ustedes en marzo y se me pasa" },
  { ctx:"descenso_peligro", quien:"@pibe_popular23", txt:"la barra canta igual. el equipo no. desbalance espiritual" },
  { ctx:"descenso_peligro", quien:"@RadioGolAM", txt:"El equipo sigue en zona de riesgo. Quedan pocas fechas." },
  { ctx:"descenso_peligro", quien:"@weon_del_metro", txt:"voy al partido y vuelvo en silencio. la micro se siente más larga" },
  { ctx:"descenso_peligro", quien:"@albo_insomne", txt:"me quiero morir. no es frase. es el campeonato" },
  { ctx:"descenso_peligro", quien:"@dt_de_living", txt:"el {DT} habla de mentalidad. la tabla habla de números. adivinen quién gana" },
  { ctx:"descenso_peligro", quien:"@viejo_del_bar", txt:"yo ya vi un descenso. no se lo deseo a nadie. ni al rival. casi" },
  { ctx:"descenso_peligro", quien:"@socio_enojado", txt:"pagué la anualidad pa esto. la dirigencia que se haga cargo po" },
  { ctx:"descenso_peligro", quien:"@el_del_tercer_tiempo", txt:"un punto hoy era oxígeno. empatamos y igual estamos ahogados" },
  { ctx:"descenso_peligro", quien:"@DeporteTotal", txt:"Sigue la urgencia en la parte baja. El calendario no perdona." },

  { ctx:"rumor_fichaje", quien:"@barra_del_sur", txt:"SI LLEGA ESE WN ARMO LA FIESTA EN LA POBLA." },
  { ctx:"rumor_fichaje", quien:"@dona_del_canal13", txt:"ay hijito ojalá sea verdad. ya me ilusioné y todo" },
  { ctx:"rumor_fichaje", quien:"@garrafal_cl", txt:"el rumor de siempre. mismo volante, distinta temporada, misma esperanza" },
  { ctx:"rumor_fichaje", quien:"@cuenta_troll", txt:"lo dieron por firmado en 4 cuentas. o sea está más lejos que nunca" },
  { ctx:"rumor_fichaje", quien:"@datofutbol_cl", txt:"el presunto refuerzo tiene 8 goles en 22 partidos. 29 años." },
  { ctx:"rumor_fichaje", quien:"@hincha_rival_xd", txt:"quédense con él. en serio. se los dejo" },
  { ctx:"rumor_fichaje", quien:"@pibe_popular23", txt:"si llega {FIGURA} cambio el wallpaper. si no llega cambio de equipo. mentira" },
  { ctx:"rumor_fichaje", quien:"@RadioGolAM", txt:"El club evalúa un delantero. Por ahora es solo una versión." },
  { ctx:"rumor_fichaje", quien:"@weon_del_metro", txt:"lo escuché en la micro. dos wns que no se conocían lo daban por hecho" },
  { ctx:"rumor_fichaje", quien:"@albo_insomne", txt:"no me ilusionen. cada enero me ilusionan. cada febrero lloro" },
  { ctx:"rumor_fichaje", quien:"@dt_de_living", txt:"el {DT} pidió un 9 y le van a traer un lateral. se viene el comunicado" },
  { ctx:"rumor_fichaje", quien:"@viejo_del_bar", txt:"ya vi mil rumores. el que llega de verdad no se tuitea tanto" },
  { ctx:"rumor_fichaje", quien:"@socio_enojado", txt:"si es verdad que pongan la plata. si es mentira que dejen de vender humo" },
  { ctx:"rumor_fichaje", quien:"@el_del_tercer_tiempo", txt:"el nombre ya está en las portadas y el wn todavía no sabe que lo queremos" },
  { ctx:"rumor_fichaje", quien:"@DeporteTotal", txt:"Versiones de un posible refuerzo. El club no confirma ni desmiente." }
];

/* apellido normalizado (sin tildes, minúscula) → apodos de meme */
const APODOS_MEME = {
  "bolados": ["Bolasex", "Sexolados"],
  "cepeda": ["Sexpeda"],
  "vidal": ["Rey Arturo", "King", "King Arturo"],
  "medel": ["Pitbull"],
  "sanchez": ["Niño Maravilla"],
  "zamorano": ["Bam Bam"],
  "salas": ["Matador"],
  "valdivia": ["Mago", "Maguito"],
  "isla": ["Huaso"],
  "fuenzalida": ["Chapa"],
  "lepe": ["Lenguado"],
  "tapia": ["Cabeza de Muela"],
  "vargas": ["Superman", "TurboMan"],
  "rojas": ["Condor"],
  "navia": ["Choro"],
  "paredes": ["Tanque"],
  "opazo": ["Torta"],
  "palacios": ["La Joya", "Facha", "Pala"],
  "zampedri": ["Toro"],
  "falcon": ["Peluca"]
};

/* ---------- apodos: las cuentas troll bautizan al jugador en cancha ---------- */
const HANDLES_APODO = ["@cuenta_troll","@garrafal_cl","@el_del_tercer_tiempo","@pibe_popular23","@barra_del_sur","@hincha_rival_xd"];
function _sinTilde(s){ return (s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(); }
/* txt YA viene con los tokens resueltos (nombres reales). Si el nombre de un
   jugador del plantel aparece y su apellido tiene apodo, la cuenta troll lo
   reemplaza por el apodo. Devuelve el texto (memeado o igual). */
function apodarTuit(txt, quien, E){
  try{
    if(!txt || !E || !Array.isArray(E.plantel)) return txt;
    if(HANDLES_APODO.indexOf(quien)<0) return txt;
    if(Math.random()>0.55) return txt;
    const cands=[];
    E.plantel.filter(function(j){return !j.vendido;}).forEach(function(j){
      if(!j.n) return;
      const partes=j.n.split(/\s+/);
      const ap=_sinTilde(partes[partes.length-1]);
      if(APODOS_MEME[ap] && txt.indexOf(j.n)>=0) cands.push({nombre:j.n, apodos:APODOS_MEME[ap]});
    });
    if(!cands.length) return txt;
    const c=cands[Math.floor(Math.random()*cands.length)];
    const apodo=c.apodos[Math.floor(Math.random()*c.apodos.length)];
    return txt.split(c.nombre).join(apodo);
  }catch(e){ return txt; }
}

/* ---------- merge: PISA los genéricos viejos, deja SOLO los aprobados ---------- */
(function(){ try{
  if(typeof TUITS_MOMENTO!=="undefined" && Array.isArray(TUITS_EXTRA)){
    const ctxNuevos={};
    TUITS_EXTRA.forEach(function(t){ ctxNuevos[t.ctx]=true; });
    /* saca del pool base los contextos que Grok ya cubrió (analogia_dunk y
       cualquier otro no cubierto se quedan intactos) */
    for(var i=TUITS_MOMENTO.length-1;i>=0;i--){ if(ctxNuevos[TUITS_MOMENTO[i].ctx]) TUITS_MOMENTO.splice(i,1); }
    TUITS_EXTRA.forEach(function(t){ TUITS_MOMENTO.push(t); });
  }
}catch(e){} })();

/* ---------- wrap de apodos sobre la resolución de tokens del ticker ---------- */
(function(){
  /* engancha el apodo en el punto donde data-voz.js resuelve el texto: se hace
     vía empujarTicker, que recibe (P, autor, texto YA resuelto, tono, m). */
  if(typeof empujarTicker==="function" && !empujarTicker._apodo){
    const origE=empujarTicker;
    empujarTicker=function(P, autor, texto, tono, m){
      let t=texto;
      try{ if(typeof E!=="undefined" && E) t=apodarTuit(texto, autor, E); }catch(e){}
      return origE(P, autor, t, tono, m);
    };
    empujarTicker._apodo=true;
  }
})();

/* ---------- contextos que NO son evento de partido: se inyectan en el ambiente ---------- */
(function(){
  if(typeof tickerAmbiente!=="function" || tickerAmbiente._voz2) return;
  const origA=tickerAmbiente;
  tickerAmbiente=function(P){
    /* antes de Twitter (2008) no hay tuits en el partido */
    if(typeof E!=="undefined" && E && (E.anio||2026)<2008) return origA(P);
    try{
      if(P && typeof tuitDeCtx==="function" && typeof empujarTicker==="function"){
        const temp=(typeof E!=="undefined"&&E&&E.temporada)||{};
        const pj=temp.pj||0;
        const resolver=function(t){ return (typeof resolverTokens==="function"&&typeof E!=="undefined"&&E)?resolverTokens(t.txt,E):t.txt; };
        /* descenso_peligro: club en zona de descenso, ya avanzado el torneo */
        if(pj>=4 && typeof posicionEnTabla==="function" && typeof LIGA_ACT!=="undefined"){
          const pos=posicionEnTabla(), n=LIGA_ACT.length;
          if(pos>=n-1 && Math.random()<0.22){
            const t=tuitDeCtx("descenso_peligro");
            if(t){ empujarTicker(P, t.quien, resolver(t), "malo", P.min||0); return; }
          }
        }
        /* invicto: racha larga sin perder */
        if((temp.sinPerder||0)>=5 && Math.random()<0.18){
          const t=tuitDeCtx("invicto");
          if(t){ empujarTicker(P, t.quien, resolver(t), "bueno", P.min||0); return; }
        }
        /* rumor_fichaje: chismerío de mercado, baja frecuencia */
        if(Math.random()<0.07){
          const t=tuitDeCtx("rumor_fichaje");
          if(t){ empujarTicker(P, t.quien, resolver(t), "neutro", P.min||0); return; }
        }
      }
    }catch(e){}
    return origA(P);
  };
  tickerAmbiente._voz2=true;
})();
