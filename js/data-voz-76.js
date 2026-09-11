"use strict";
/* ============================================================
   FUTBOLINI 7.76 · data-voz-76.js
   Pool de lenguaje (TAREA D). Mitad neutro / mitad cl.
   Se hornea en FRASES y en noticias de la semana.
   Cargar DESPUÉS de idiomas.js y pulido.js.
   ============================================================ */
const VOZ_76=[
 {ctx:"escritorio",registro:"cl",k:"esc_atiende",txt:"Atiende esto antes de avanzar, po"},
 {ctx:"escritorio",registro:"neutro",k:"esc_atiende_txt",txt:"Hay cosas que conviene resolver antes de apretar Avanzar. Toca una y te digo qué hacer."},
 {ctx:"escritorio",registro:"cl",txt:"El escritorio no es un tutorial. Es la mesa: deuda, rival, camarín. Toca una."},
 {ctx:"escritorio",registro:"neutro",txt:"Si no hay crisis, igual hay algo: prensa, barra o cantera. El club no duerme."},
 {ctx:"atiende",registro:"cl",txt:"Si la meta es la deuda: vende al que no juega, no pidái más crédito, paga un tramo en Finanzas."},
 {ctx:"atiende",registro:"neutro",txt:"Meta en riesgo: entra a la sección que te marco y haz el paso concreto. Avanzar no la arregla."},
 {ctx:"atiende",registro:"cl",txt:"Si la meta es la tabla: ganá de local, no rotes de más, mira el calendario."},
 {ctx:"atiende",registro:"neutro",txt:"Hinchada baja: un resultado, precio de entrada o un gesto en la mesa de la barra."},
 {ctx:"meta_deuda",registro:"cl",txt:"La deuda no es un número, wn: es un tipo en traje que te llama el viernes."},
 {ctx:"meta_deuda",registro:"neutro",txt:"Ordenar finanzas: vender un prescindible, no firmar renovaciones caras, abonar un tramo. No pedir otro préstamo."},
 {ctx:"meta_deuda",registro:"cl",txt:"Un tramo ahora vale más que un discurso en conferencia. Finanzas, no redes."},
 {ctx:"meta_deuda",registro:"neutro",txt:"La cuota del socio no tapa un agujero. Tapa el agujero quien deja de gastar."},
 {ctx:"meta_pos",registro:"cl",txt:"La tabla no se arregla con un discurso. Se arregla ganando de local y no regalando la visita."},
 {ctx:"meta_pos",registro:"neutro",txt:"Para la posición: suma de local, no rotes de más en los que tienes que ganar, mira el calendario."},
 {ctx:"meta_pos",registro:"cl",txt:"Cada punto de acá al cierre vale temporada. No experimentís el domingo que duele."},
 {ctx:"meta_pos",registro:"neutro",txt:"La liguilla y el descenso se huelen con cinco fechas. No esperes la matemática."},
 {ctx:"meta_hinchada",registro:"cl",txt:"La gente no se compra con un lienzo. Se compra no vendiendo al ídolo y bajando la entrada un domingo."},
 {ctx:"meta_hinchada",registro:"neutro",txt:"Hinchada: un resultado, precio de entrada más bajo o un gesto en la mesa de la barra."},
 {ctx:"meta_hinchada",registro:"cl",txt:"Si la popular calla de local, perdiste antes del himno. Pactái o se nota."},
 {ctx:"meta_hinchada",registro:"neutro",txt:"Un ídolo vendido se siente dos años. Un descuento de entrada, un mes. Elegí."},
 {ctx:"ayudante",registro:"cl",txt:"Preguntame como mano derecha: ¿el domingo? ¿vendemos a alguien? ¿hablo con el capitán?"},
 {ctx:"ayudante",registro:"neutro",txt:"El ayudante lee el club. No es un tutorial. Preguntale del rival, la plata, el camarín."},
 {ctx:"ayudante",registro:"cl",txt:"¿El domingo? El rival y si somos favoritos. Nada de Libertadores si estamos en Segunda."},
 {ctx:"ayudante",registro:"neutro",txt:"Tres preguntas útiles: el próximo partido, un nombre que sobre, el capitán."},
 {ctx:"noticia_imp",registro:"neutro",txt:"La tabla se mueve arriba: un grande gana y el que está en Segunda ya sabe quién llega fuerte."},
 {ctx:"noticia_imp",registro:"cl",txt:"El banco llama otra vez. La deuda no espera al clásico."},
 {ctx:"noticia_imp",registro:"neutro",txt:"Copa Chile: 8 grupos, Primera + B. Segunda 2026 no entra (bases ANFP)."},
 {ctx:"noticia_imp",registro:"cl",txt:"En Calendario están las tablas de todo el país. Aunque no las juegues, se simulan."},
 {ctx:"noticia_chiste",registro:"cl",txt:"En conferencia dijeron que el plan se cumplió. El plan, aparentemente, era este."},
 {ctx:"noticia_chiste",registro:"neutro",txt:"El DT habló de proceso. El marcador habló de otra cosa."},
 {ctx:"noticia_chiste",registro:"cl",txt:"El VAR dibujó la raya con el codo. Cuatro minutos. El estadio ya había cambiado de humor."},
 {ctx:"noticia_chiste",registro:"neutro",txt:"Un dirigente pidió unidad y se peleó en el pasillo. Unidad de qué."},
 {ctx:"poder",registro:"cl",txt:"Las jugadas de poder no son un botón. Primero el grupo, después el capital. Si no, te explota."},
 {ctx:"poder",registro:"neutro",txt:"Una jugada por año. Si la ANFP te da la espalda, el lobby se da vuelta."},
 {ctx:"poder",registro:"cl",txt:"Si no tenís al directorio y a la barra, no hagas la jugada grande. Te cuelgan el lienzo."},
 {ctx:"poder",registro:"neutro",txt:"Capital político se gasta. No lo gastes en un comunicado."},
 {ctx:"grupo_directorio",registro:"cl",txt:"El directorio sube con puntos y caja sana. Baja si prometís y no cumplís."},
 {ctx:"grupo_directorio",registro:"neutro",txt:"Directorio: rinde cuentas, no gastes en silencio, cumplí la meta que ellos pusieron."},
 {ctx:"grupo_directorio",registro:"cl",txt:"Si la mesa pide tiempo y la tabla pide puntos, gana la tabla. Siempre."},
 {ctx:"grupo_directorio",registro:"neutro",txt:"Una asamblea sin números es un eslogan. Llevá el balance."},
 {ctx:"grupo_barra",registro:"cl",txt:"La mesa de la barra no es un slider. Pactái, cumplís, o te cuelgan un lienzo."},
 {ctx:"grupo_barra",registro:"neutro",txt:"Barra: reunite cada 4 fechas. Tres pactos en pie = caldera de local."},
 {ctx:"grupo_barra",registro:"cl",txt:"Sin la popular el estadio es un mall. Con ella, a veces, un lío. Pacta con cabeza."},
 {ctx:"grupo_barra",registro:"neutro",txt:"No ignores a la mesa. Tampoco le entregues el recinto. Hay un medio."},
 {ctx:"estatuto",registro:"cl",txt:"Cambiar identidad es lo más caro. Si comunidad y socios se te dan vuelta juntos, se parte el club."},
 {ctx:"estatuto",registro:"neutro",txt:"Cada estatuto cuesta capital y molesta a quien pierde. Empieza por uno chico."},
 {ctx:"estatuto",registro:"cl",txt:"Si cambiái la propiedad, la hinchada se va a enterar. Hablá antes, no después."},
 {ctx:"estatuto",registro:"neutro",txt:"Un estatuto por temporada. Dos es pelea. Tres es cisma."},
 {ctx:"mercado",registro:"cl",txt:"Ojear sale barato y te dice el techo. Comprar a ciegas es hobby de dirigente apurado."},
 {ctx:"mercado",registro:"neutro",txt:"Ventana ene-feb y jun-jul. Negociar es precio, sueldo y rol. A las 3 rondas se levantan."},
 {ctx:"mercado",registro:"cl",txt:"Si el representante sonríe, el hincha llora. Ley no escrita."},
 {ctx:"mercado",registro:"neutro",txt:"No vendas al único que juega para fichar tres que no."},
 {ctx:"cesion",registro:"cl",txt:"Cesión: el pibe se va un año, el otro le paga el sueldo, vuelve con más nivel. No cedái al titular."},
 {ctx:"cesion",registro:"neutro",txt:"Préstamo para pibes ≤23. Sirve si no entra en el once. No ceder al único arquero."},
 {ctx:"cesion",registro:"cl",txt:"Prestamo con opción: no estamos seguros y el otro tampoco. Leé la letra chica."},
 {ctx:"cesion",registro:"neutro",txt:"Si vuelve y no entra, al menos no le pagaste el sueldo. Eso también es caja."},
 {ctx:"calendario",registro:"cl",txt:"El calendario ahora tiene las tablas de todo el país. Aunque no las juegues, se simulan."},
 {ctx:"calendario",registro:"neutro",txt:"Primera, B, Segunda Norte/Sur, Copa Chile, Copa de la Liga y CONMEBOL. La tuya va marcada."},
 {ctx:"calendario",registro:"cl",txt:"Si jugái en Argentina, la tabla de la Liga Profesional es la tuya. No la Copa Chile."},
 {ctx:"calendario",registro:"neutro",txt:"Tablas se llenan al avanzar. Un grande que gana arriba ya te dice quién llega fuerte."},
 {ctx:"segunda",registro:"cl",txt:"Acá abajo cada punto vale doble. El viaje es eterno. El Monumental no es tu casa."},
 {ctx:"segunda",registro:"neutro",txt:"Zona de 7, 12 fechas, top 3 a liguilla. Segunda 2026 no juega Copa Chile."},
 {ctx:"segunda",registro:"cl",txt:"El municipal a las 4. El viento a las 4 y 1. Clásico de categoría."},
 {ctx:"segunda",registro:"neutro",txt:"Norte y Sur las armó la ANFP, no el mapa. San Joaquín y City juegan Norte siendo de Santiago."},
 {ctx:"copa_chile",registro:"neutro",txt:"Copa Chile: 8 grupos, Primera + B. Segunda no entra (bases ANFP 2026)."},
 {ctx:"copa_chile",registro:"cl",txt:"Si estás en Segunda no hay Copa Chile. El premio es subir, no soñar la tele nacional."},
 {ctx:"copa_chile",registro:"neutro",txt:"Copa de la Liga es solo Primera. 4 grupos, clasifica el 1°. El campeón es Chile 3 a Libertadores."},
 {ctx:"copa_chile",registro:"cl",txt:"Si jugái Copa Chile, el grupo se simula. Tu marcador vale; el resto, también."},
 {ctx:"conferencia",registro:"cl",txt:"El {DT} va a decir que el grupo está bien. Traducción: anota el próximo once."},
 {ctx:"conferencia",registro:"neutro",txt:"En conferencia se pide tiempo. En la tabla se pide un resultado."},
 {ctx:"conferencia",registro:"cl",txt:"Si se enoja con una pregunta buena, señal de que era buena."},
 {ctx:"conferencia",registro:"neutro",txt:"Doce minutos y ni un número. Oficio de sobreviviente."},
 {ctx:"gol",registro:"cl",txt:"Gol de {GOLEADOR}. El almacén se viene abajo y el domingo dura hasta el lunes."},
 {ctx:"gol",registro:"neutro",txt:"{GOLEADOR} marca y {CLUB} respira. Un gol que vale tabla, no solo el highlight."},
 {ctx:"gol",registro:"cl",txt:"Así se mata un partido. No con discurso. Con olfato."},
 {ctx:"gol",registro:"neutro",txt:"Un gol al 90+ vale tabla y corazón. Los dos."},
 {ctx:"derrota",registro:"cl",txt:"Se pierde y el {DT} habla de proceso. El proceso, wn, es el marcador."},
 {ctx:"derrota",registro:"neutro",txt:"Derrota: pocas ideas. La semana se juega en el camarín, no en la radio."},
 {ctx:"derrota",registro:"cl",txt:"Partidos así te hacen cuestionar el hobby. Y uno vuelve el domingo."},
 {ctx:"derrota",registro:"neutro",txt:"Cero tiros al arco no es mala noche. Es plan. Cámbialo."},
 {ctx:"directorio_cierre",registro:"cl",txt:"Al cierre te cobran las metas. No el discurso de marzo. Las metas."},
 {ctx:"directorio_cierre",registro:"neutro",txt:"El directorio evalúa al cierre. Una meta en riesgo se atiende ahora, no en noviembre."},
 {ctx:"directorio_cierre",registro:"cl",txt:"Si prometiste y no cumpliste, la mesa se te da vuelta. No hay comunicado que tape eso."},
 {ctx:"directorio_cierre",registro:"neutro",txt:"Cierre: puntos, caja, hinchada. En ese orden. El relato va después."}
];

const VOZ_NOTICIAS_76=[
 {tipo:"imp",t:"📰 La tabla de arriba se mueve",d:"Aunque no la juegues, se simula. En Calendario ves quién manda en Primera, B y copas."},
 {tipo:"imp",t:"📰 El banco no espera al clásico",d:"La deuda es un tipo en traje. Finanzas: un tramo, no otro crédito."},
 {tipo:"chiste",t:"😄 El plan se cumplió",d:"Lo dijeron en conferencia. El plan, aparentemente, era este."},
 {tipo:"chiste",t:"😄 El VAR dibujó la raya con el codo",d:"Cuatro minutos de revisión. El estadio ya había cambiado de humor."},
 {tipo:"club",t:"📰 El ayudante no es un tutorial",d:"Preguntale ¿el domingo? ¿vendemos a alguien? ¿hablo con el capitán?"},
 {tipo:"club",t:"📰 Segunda es zona, no Libertadores",d:"12 fechas, top 3 a liguilla. El Monumental no es tu casa si no eres Colo-Colo."},
 {tipo:"imp",t:"📰 Argentina también tiene tabla",d:"Si manejas un club de la Liga Profesional, Calendario muestra la de 30, no la Copa Chile."},
 {tipo:"chiste",t:"😄 El tesorero faltó a la asamblea",d:"El único que tenía un número. El resto trajo eslóganes."},
 {tipo:"club",t:"📰 Esteban Paredes en Morning",d:"El chaguito, Segunda 2026, DT documentado. Cantera si falta plantel: no se inventa."},
 {tipo:"imp",t:"📰 Osorno ya estuvo en Primera",d:"Nacional 1991, 19 pts, bajó con Wanderers. Hecho de tabla, no de leyenda."}
];

(function hornearVoz76(){
  if(typeof FRASES==="object"){
    VOZ_76.forEach(function(v){
      if(!v.k) return;
      if(!FRASES[v.registro]) FRASES[v.registro]={};
      if(FRASES[v.registro][v.k]==null) FRASES[v.registro][v.k]=v.txt;
    });
  }
  if(typeof titularesSemana!=="function"||titularesSemana._voz76) return;
  const orig=titularesSemana;
  titularesSemana=function(){
    const out=orig()||[];
    try{
      VOZ_NOTICIAS_76.forEach(function(n,i){
        if((i+((typeof E!=="undefined"&&E&&E.idx)||0))%3===0) out.push({t:n.t,d:n.d,tipo:n.tipo});
      });
    }catch(e){}
    return out.slice(0,10);
  };
  titularesSemana._voz76=true;
})();
