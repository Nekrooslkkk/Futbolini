"use strict";
/* ============================================================
   FUTBOLINI 8.01 · rigor vs Colo-Colo (TAREA E, club por club)
   El listón de CC 1991 no es el plantel: es que CADA semana te
   llega una carta QUE SOLO EXISTE EN ESE CLUB. El resto de
   equipos vivía de la BOLSA genérica. Acá cada club 2026 tiene
   al menos una decisión propia (estadio, ciudad, conflicto reales).
   Glorias: CBL 1981 / UCH 1994 / SW 2001 / UES 2013 / BOC 2007 /
   RIV 2018 también ganan cartas de su año.

   Hechos públicos. Cero citas inventadas. Cero Monumental si el
   club no es Colo-Colo (o River/Tucumán). Stats de efecto = juego.
   Cargar ÚLTIMO (después de data-planteles-800.js).
   ============================================================ */

function _o801(t,d,dif,g,b,m,w,x){
  x=x||{};
  var o={t:t,d:d||"",dif:dif==null?45:dif,grupos:g||{},
    bien:{txt:b,ef:x.be||{}},
    mitad:{txt:m||b,ef:x.me||{}},
    mal:{txt:w,ef:x.we||{},grupos:x.wg||{}}};
  if(x.hist) o.hist=true;
  if(x.mods) o.bien.mods=x.mods;
  if(x.rep) o.rep=x.rep;
  return o;
}
function _d801(id,club,anio,buzon,peso,mes,t,d,ops,extra){
  var x={id:id,club:club,anio:anio,buzon:buzon,peso:peso||"medio",mes:mes||3,t:t,d:d,op:ops};
  if(extra) Object.keys(extra).forEach(function(k){ x[k]=extra[k]; });
  return x;
}

const DECISIONES_801=[
/* ========== COLO-COLO 2026 · el más grande, ahora ========== */
_d801("cc26_concesionaria","CC",2026,"institucional","alto",2,
  "Blanco y Negro y la calle",
  "Colo-Colo es sociedad anónima desde 2006. La concesionaria quiere exprimir la marca; la hinchada del Monumental no acepta que el Cacique se venda como shampoo. El 2026 no es 1991: la copa no está encima de la mesa, la masa sí.",
  [
    _o801("Bancar la identidad popular","Menos naming, más pueblo.",36,{hinchada:14,comunidad:10,sponsors:-8,directorio:-6},
      "La Galería Norte se siente dueña otra vez. El directorio aprieta los dientes.",
      "Gesto tibio: aplausos un domingo, carpetazo el lunes.",
      "La concesionaria te marca la cancha. Quedaste en el medio.",
      {be:{prestigio:4},we:{prestigio:-2},wg:{directorio:-8}}),
    _o801("Exprimir la marca","Plata ahora, recelo después.",52,{sponsors:14,directorio:10,hinchada:-12},
      "Entra un cheque grueso. En Macul silban el anuncio.",
      "Plata sí, hinchada a media máquina.",
      "Un audio de la barra te deja como gerente, no como del Cacique.",
      {be:{plata:140},me:{plata:70},we:{plata:40,riesgo:6}})
  ],
  {historia:"Blanco y Negro S.A. administra Colo-Colo desde 2006. Hecho público, no cita."}),
_d801("cc26_monumental","CC",2026,"hinchada","alto",3,
  "El Monumental de semana",
  "El David Arellano cabe ~47 mil. Se llena cuando hay clásico o visita grande; el resto, Cordillera y Océano a media. La Garra Blanca pide precio de pueblo. El directorio pide taquilla.",
  [
    _o801("Bajar la popular y llenar","Caja chica, ruido alto.",34,{hinchada:12,comunidad:10,directorio:-6},
      "Macul se oye de verdad un miércoles. El tesorero bufa.",
      "Llegó gente, no la que soñabas.",
      "La platea se quejó y la popular igual llegó tarde.",
      {be:{plata:-25,moral:4},me:{plata:-15},we:{plata:-20,moral:-2}}),
    _o801("Cobrar el partido grande","Más por cabeza.",48,{sponsors:8,hinchada:-8},
      "Taquilla de clásico. La Norte protesta con cánticos, no con sillas vacías.",
      "Plata limpia, ambiente más frío.",
      "Se vio en tele: gradas con huecos en un partido de Colo-Colo.",
      {be:{plata:90},me:{plata:50},we:{plata:30},wg:{prensa:-6}})
  ]),
_d801("cc26_clasico","CC",2026,"camarin","alto",4,
  "Semana de Superclásico",
  "Universidad de Chile no es un rival más. En Macul se juega otra cosa: la masa mide al plantel por este partido, no por la tabla. El técnico pide foco; la calle pide pecho.",
  [
    _o801("Cerrar el predio y trabajar","Menos himno, más entrenamiento.",40,{tecnico:10,camarin:8,hinchada:-4},
      "El plantel llegó entero. El clásico se jugó con cabeza.",
      "Hubo concentración y también un audio de más.",
      "La gente lo leyó como miedo. El vestuario se tensó.",
      {be:{moral:5},we:{moral:-4}}),
    _o801("Dejar que la masa empuje","Pecho afuera.",50,{hinchada:14,camarin:-6},
      "El Monumental empujó y el plantel respondió.",
      "Ruido sí, fútbol a ratos.",
      "Se jugó con el corazón y se perdió la cabeza. Un rojo temprano.",
      {be:{moral:6,prestigio:2},we:{moral:-6,riesgo:4},wg:{prensa:-8}})
  ]),

/* ========== UNIVERSIDAD DE CHILE 2026 ========== */
_d801("uch26_nacional","UCH",2026,"institucional","alto",2,
  "Otra temporada en cancha prestada",
  "La U sigue sin estadio propio. Local en el Nacional Julio Martínez Prádanos: aforo de selección, arriendo de inquilino. La masa es enorme; cada fecha se negocia con otro.",
  [
    _o801("Impulsar de nuevo el proyecto de casa","Bandera del hincha. Duele la caja.",42,{hinchada:14,socios:10,directorio:-8},
      "La gente se prende. El directorio pide números, no himnos.",
      "Se armó una comisión. Nadie vio una pala.",
      "Otra carpeta en un cajón. La tribuna Norte te lo cobra.",
      {be:{capital:-6,prestigio:4},we:{prestigio:-4},wg:{hinchada:-10}}),
    _o801("Aceptar el Nacional y negociar mejor el arriendo","Prudente. Frío.",38,{directorio:8,hinchada:-8},
      "El arriendo baja un poco. La calle lo lee como rendición.",
      "Se juega igual. El tema queda para el año que viene.",
      "Un recorte de cancha prestada salió en la prensa. Dolió.",
      {be:{plata:50},me:{plata:20},we:{plata:10},wg:{prensa:-6}})
  ]),
_d801("uch26_masa","UCH",2026,"hinchada","medio",3,
  "La masa no cabe en la caja",
  "La U es pueblo y es déficit: hinchada de grande, cuentas que no acompañan. Te piden un gesto (entradas, abonos) cuando el tesorero muestra números rojos.",
  [
    _o801("Abono popular, aunque duela","Tribuna llena, caja flaca.",36,{hinchada:12,comunidad:8,directorio:-8},
      "El Nacional se oye azul. El tesorero no duerme.",
      "Llegó gente; no la que cubre el agujero.",
      "Se llenó un rato y después el gesto se leyó como populismo.",
      {be:{plata:-40,moral:4},we:{plata:-30,moral:-2}}),
    _o801("Cuidar la caja primero","Orden. Silbidos.",50,{directorio:10,hinchada:-10},
      "Las cuentas respiran. La Norte no te perdona el domingo.",
      "Ni tan orden ni tan bronca.",
      "Un lienzo te acusó de administrar un club ajeno.",
      {be:{plata:80},we:{plata:20,riesgo:4}})
  ]),

/* ========== UNIVERSIDAD CATÓLICA 2026 ========== */
_d801("uc26_claro","UC",2026,"institucional","alto",2,
  "El Claro Arena ya no es San Carlos",
  "En 2025 se estrenó el Claro Arena (ex San Carlos de Apoquindo). Casa propia, nombre de sponsor. Los puristas cruzados no tragan el naming; la administración dice que así se paga el recinto.",
  [
    _o801("Defender que se siga diciendo San Carlos adentro","Identidad. El sponsor se pica.",40,{hinchada:10,comunidad:8,sponsors:-10},
      "En las tribunas se canta San Carlos. El contrato sigue, más tenso.",
      "Gesto simbólico. El letrero no se mueve.",
      "El sponsor amenazó con revisar el aporte. El directorio te llama.",
      {be:{prestigio:3},we:{plata:-30},wg:{sponsors:-8}}),
    _o801("Abrazar el naming: la casa se paga así","Plata y recelo.",48,{sponsors:12,directorio:8,hinchada:-8},
      "El cheque llega. En la tribuna Mario Lepe se murmura.",
      "Ni tan cheque ni tan himno.",
      "Un grupo de socios pidió asamblea por «vender el nombre».",
      {be:{plata:90},me:{plata:40},we:{plata:20},wg:{socios:-8}})
  ],
  {historia:"El estadio de Católica pasó a llamarse Claro Arena en 2025 (ex San Carlos de Apoquindo). Hecho público."}),
_d801("uc26_cantera","UC",2026,"cantera","medio",4,
  "Modelo cruzado: formar o fichar",
  "La UC vive de orden y cantera, con menos masa que Colo y la U. Aparece la tentación de gastar como grande para no quedar tercera en Santiago.",
  [
    _o801("Priorizar la casa","Menos nombres, más sello.",38,{cantera:10,comunidad:8,directorio:-4},
      "Debutaron dos cadetes. El clásico se juega con cara propia.",
      "Buena intención, nivel inestable.",
      "Se notó la falta de oficio un domingo feo.",
      {be:{moral:3},we:{moral:-3}}),
    _o801("Fichar para no ser comparsa de los otros dos","Ilusión rápida.",54,{prensa:8,camarin:6,comunidad:-6},
      "Un nombre prendió la platea. La cantera se sentó a mirar.",
      "Se reforzó. No cambió el techo.",
      "El refuerzo no rindió y salió caro en el vestuario.",
      {be:{plata:-80,plantel:3},we:{plata:-80,moral:-4}})
  ]),

/* ========== PALESTINO / COQUIMBO / EVERTON / HUA / OHI ========== */
_d801("pal26_cisterna","PAL",2026,"institucional","medio",3,
  "La Cisterna no se disfraza",
  "El Municipal de La Cisterna es chico y es bandera. Un fondo quiere «profesionalizar la marca palestina». La colonia pide domingo en casa, no marketing.",
  [
    _o801("El club se queda en La Cisterna","Identidad. Menos vitrina.",36,{comunidad:14,hinchada:10,sponsors:-6},
      "La colonia aplaude. El cheque se enfría.",
      "Se quedó el barrio; el plantel pide más.",
      "Un dirigente habló de «techo de comuna» en off.",
      {be:{prestigio:3},we:{prestigio:-2}}),
    _o801("Abrir la marca","Plata, recelo.",50,{sponsors:10,directorio:8,comunidad:-10},
      "Entra un sponsor. En la popular se canta más bajo.",
      "Plata chica, ruido chico.",
      "La colonia se sintió vendida.",
      {be:{plata:70},we:{plata:20},wg:{hinchada:-8}})
  ]),
_d801("coq26_estrella","COQ",2026,"institucional","alto",2,
  "Después de la primera estrella",
  "Coquimbo Unido fue campeón de la Liga de Primera 2025: primera estrella en 67 años. El Rumoroso todavía no acomoda el título. El norte no perdona si se afloja.",
  [
    _o801("Bajar el pecho y trabajar","Menos himno, más predio.",38,{camarin:10,hinchada:4,prensa:-4},
      "El plantel entendió que el 2025 no se cobra dos veces.",
      "Hay seriedad y también nostalgia.",
      "La gente lo leyó como miedo a ser grande.",
      {be:{moral:4},we:{moral:-3}}),
    _o801("Vender el aura pirata","La ciudad se agranda.",52,{hinchada:12,sponsors:8,camarin:-4},
      "El puerto se cree grande. El rival se pica.",
      "Camisetas sí, puntos a ratos.",
      "Se relajaron. Un 0-3 de local dolió como resaca.",
      {be:{plata:60,prestigio:3},we:{moral:-6,prestigio:-3}})
  ],
  {historia:"Coquimbo Unido campeón de la Liga de Primera 2025. Primera estrella del club."}),
_d801("eve26_sausalito","EVE",2026,"hinchada","medio",3,
  "Cuando se acaba el verano en Sausalito",
  "Viña se llena en enero. En marzo el Sausalito se vacía y Everton deja de ser postal. El directorio quiere la marca turística; la hinchada de toda la vida quiere un club de los doce meses.",
  [
    _o801("Bancar al hincha de marzo","Menos brillo, más barrio.",36,{hinchada:12,comunidad:10,sponsors:-6},
      "Sausalito de semana se oye. El turismo no pone el himno.",
      "Gesto local. La platea de verano no volvió.",
      "La marca Viña se enojó y el barrio no llenó igual.",
      {be:{plata:-20,moral:3},we:{plata:-15}}),
    _o801("Exprimir el verano","Taquilla de sol.",50,{sponsors:12,directorio:8,hinchada:-8},
      "Enero fue una fiesta. Marzo, sillas.",
      "Plata de temporada. El resto, lo de siempre.",
      "Un lienzo: «No somos postal».",
      {be:{plata:80},we:{plata:30},wg:{comunidad:-8}})
  ]),
_d801("hua26_cap","HUA",2026,"cantera","medio",3,
  "El CAP no es adorno",
  "Huachipato forma y vende. El estadio CAP Acero de Talcahuano es fábrica, no vitrina. Aparece una oferta por un cabro de la casa que el pueblo todavía no vio debutar bien.",
  [
    _o801("Retenerlo un año y que juegue los domingos","El CAP se ilusiona.",42,{hinchada:12,camarin:8,directorio:-8},
      "El pibe debutó. El cheque se enfría, la tribuna no.",
      "Jugó a ratos. El ojeador sigue ahí.",
      "Se lesionó un mes. El directorio te cobra el «no».",
      {be:{moral:4},we:{moral:-3}}),
    _o801("Vender y clavar el porcentaje en inferiores","El modelo del acero.",48,{directorio:10,hinchada:-8},
      "Caja sana y dos cadetes nuevos. La popular silbó igual.",
      "Plata sí, ilusión a media.",
      "Se fue y al mes estaba de titular en otro lado. Dolió.",
      {be:{plata:150},me:{plata:90},we:{plata:90},wg:{hinchada:-10}})
  ]),
_d801("ohi26_teniente","OHI",2026,"institucional","medio",3,
  "El Teniente no es sucursal",
  "Rancagua pide un O'Higgins de región, no un puente a Santiago. Un sábado de partido, un evento privado ofrece plata por la cancha.",
  [
    _o801("El estadio es para el fútbol","La gente aplaude; la caja no.",36,{hinchada:12,comunidad:8,sponsors:-8},
      "El Teniente se quedó en domingo. El pueblo lo nota.",
      "Se jugó. El evento se fue a otro lado sin tanto drama.",
      "El directorio lo leyó como capricho.",
      {be:{prestigio:3},we:{plata:-20}}),
    _o801("Ceder el sábado y cobrar","Cancha marcada, plata limpia.",50,{sponsors:10,directorio:8,hinchada:-8},
      "El cheque entra. El césped queda para el miércoles.",
      "Plata chica, bronca chica.",
      "Se jugó en una cancha marcada. Un gol anulado por el bote.",
      {be:{plata:70},we:{plata:40,moral:-3}})
  ]),

/* ========== RESTO PRIMERA 2026 ========== */
_d801("nub26_oyarzun","NUB",2026,"hinchada","medio",4,
  "El Oyarzún de invierno",
  "Chillán: frío, región, poca vitrina. El Nelson Oyarzún lleno duele. Te piden precio de pueblo o dos refuerzos.",
  [
    _o801("Meter plata al estadio y a la entrada","La gente lo vive todos los domingos.",40,{hinchada:10,comunidad:10},
      "El rojo de Ñuble se oye. El refuerzo espera.",
      "Llegó gente con bufanda. El nivel es el mismo.",
      "Hizo frío y igual no llenó. Doble gasto.",
      {be:{plata:-40,prestigio:3},we:{plata:-40}}),
    _o801("Dos refuerzos y el estadio después","El presente manda.",52,{camarin:8,comunidad:-6},
      "El plantel se siente más. El Oyarzún sigue igual de frío.",
      "Un refuerzo rindió, el otro no.",
      "Se gastó y se perdió de local. Chillán no perdona.",
      {be:{plata:-80,plantel:2},we:{plata:-80,moral:-4}})
  ]),
_d801("cob26_salvador","COB",2026,"institucional","medio",3,
  "El Salvador no es postal",
  "Cobresal juega en El Cobre, El Salvador. Altura, viaje eterno, pueblo minero. No es Cobreloa. Un sponsor santiaguino ofrece visibilidad si «bajan» más partidos al centro.",
  [
    _o801("Hacer de la altura un arma","Puntos feos, casa propia.",38,{hinchada:12,camarin:8,sponsors:-6},
      "El rival llega mareado. El Salvador se siente club.",
      "Localía sí, taquilla no.",
      "El plantel también sufre el viaje de vuelta. Moral baja.",
      {be:{moral:3},we:{moral:-3}}),
    _o801("Aceptar más fechas en el centro","Cómodo. Menos identidad.",50,{sponsors:10,comunidad:-10},
      "Se viaja menos. El pueblo se siente abandonado.",
      "Un partido en el centro, el resto igual.",
      "Un lienzo en El Cobre: «Acá se juega».",
      {be:{plata:50},we:{plata:20},wg:{hinchada:-10}})
  ]),
_d801("cal26_chahuan","CAL",2026,"hinchada","medio",4,
  "Pueblo chico, puntos feos",
  "Unión La Calera. El Nicolás Chahuán es de pueblo: se saca puntos o se hunde sin ruido. Un grande quiere usar la plaza como sucursal de juveniles.",
  [
    _o801("El club es de La Calera","Identidad. Menos nombres.",36,{comunidad:14,hinchada:10,sponsors:-6},
      "El pueblo se siente dueño. El once es más chico.",
      "Se dijo que no. El grande no insistió.",
      "Quedaste con menos plantel y la misma tabla.",
      {be:{prestigio:2},we:{plantel:-2}}),
    _o801("Aceptar el puente","Plata, alma ajena.",50,{directorio:8,comunidad:-10},
      "Entran juveniles y un cheque. La tribuna no canta igual.",
      "Convenio tibio.",
      "La Calera se leyó como filiar. Dolió en el almacén.",
      {be:{plata:55},we:{plata:25},wg:{hinchada:-8}})
  ]),
_d801("lse26_portada","LSE",2026,"institucional","medio",3,
  "La Portada no es solo verano",
  "Deportes La Serena. Postal de playa, yo-yo de categoría. La gente pide que el club deje de ser veraneo.",
  [
    _o801("Plan de doce meses, no de enero","Aburrido y serio.",40,{socios:8,camarin:8,hinchada:4},
      "Se armó un calendario de abonos de invierno. Poca tapa, más piso.",
      "Buena intención. Enero sigue mandando.",
      "El directorio lo vio lento. Te piden resultados ya.",
      {be:{prestigio:3},we:{moral:-2}}),
    _o801("Cobrar el verano a todo trapo","Taquilla de sol.",50,{sponsors:10,hinchada:-6},
      "Enero llenó La Portada. Junio, viento.",
      "Plata de temporada.",
      "Un columnista escribió «club de veraneo». Pegó.",
      {be:{plata:70},we:{plata:25},wg:{prensa:-6}})
  ]),
_d801("dco26_collao","DCO",2026,"institucional","alto",2,
  "El León volvió: no ser turismo",
  "Deportes Concepción volvió a Primera. El Ester Roa (Collao) es grande de región: orgullo si se llena, vacío si no. El miedo es caer otra vez.",
  [
    _o801("Armar para quedarse, no para un verano","Lento. Honesto.",40,{camarin:10,socios:8,hinchada:-4},
      "El León habla de piso. La gente pide fiesta igual.",
      "Plantel serio, ilusión a media.",
      "Se leyó como miedo a soñar.",
      {be:{prestigio:4},we:{moral:-3}}),
    _o801("Todo al presente, a pelear ya","Heroico y frágil.",54,{hinchada:12,directorio:-6},
      "Collao se prende. La caja avisa.",
      "Ruido de Primera. Plantel corto.",
      "Se apostó y un mes malo asustó a todo el Biobío.",
      {be:{moral:5},we:{moral:-6,riesgo:4}})
  ]),
_d801("udc26_campanil","UDC",2026,"cantera","medio",4,
  "El Campanil: universidad o Primera a secas",
  "Universidad de Concepción nace de una universidad. Comparte ciudad (y a veces cancha) con el León. Formar no es eslogan: es el origen.",
  [
    _o801("Priorizar cantera universitaria","Identidad. Nivel inestable.",38,{comunidad:12,directorio:-4},
      "Debutó un universitario. El sello se nota.",
      "Buena foto, puntos justos.",
      "Se sufrió de más. El directorio pide oficio.",
      {be:{prestigio:3},we:{moral:-3}}),
    _o801("Fichar para no sufrir","Más puntos, menos sello.",50,{camarin:8,comunidad:-6},
      "El once se ve de Primera. El origen se diluye.",
      "Un refuerzo rindió.",
      "Se gastó y el clásico penquista se perdió igual.",
      {be:{plata:-60,plantel:2},we:{plata:-60}})
  ]),
_d801("lim26_pueblo","LIM",2026,"institucional","alto",2,
  "Pueblo recién llegado a Primera",
  "Limache subió. Club joven (2010). Sobrevivir ya es título. Local en el Ángel Navarrete Candia: municipal de pueblo, no el Lucio Fariña (ese es de San Luis).",
  [
    _o801("Hablar claro: primero afirmarse","Honesto. Poco épico.",34,{socios:8,directorio:6,hinchada:-4},
      "El pueblo entiende el tamaño. Menos himno, más domingo.",
      "Mensaje tibio.",
      "La gente quería soñar y se enojó.",
      {be:{prestigio:2},we:{moral:-3}}),
    _o801("Prometer que Limache se queda","La ciudad se prende.",56,{hinchada:12,prensa:6,directorio:-6},
      "Ilusión de pueblo. Si se cae, duele el doble.",
      "Ruido un mes.",
      "Una goleada de visitante apagó la frase.",
      {be:{moral:5},we:{moral:-6}})
  ]),
_d801("aud26_florida","AUD",2026,"institucional","medio",3,
  "La Florida, colonia, tabla del medio",
  "Audax Italiano. Bicentenario de La Florida, colonia, ni miedo ni fiesta. Un fondo quiere masificar la marca itálica.",
  [
    _o801("El club se queda en el barrio","Menos ruido, más casa.",36,{comunidad:14,hinchada:8,sponsors:-6},
      "Domingo en familia. El cheque se va.",
      "Barrio sí, techo igual.",
      "El directorio lo vio chico.",
      {be:{prestigio:2},we:{plata:-10}}),
    _o801("Abrir la marca Itálico","Entra plata; la colonia se tensa.",50,{sponsors:10,directorio:8,comunidad:-8},
      "Sponsor nuevo. La camiseta verde se siente menos de casa.",
      "Plata chica.",
      "Un socio histórico devolvió el carnet en la sede.",
      {be:{plata:70},we:{plata:25},wg:{socios:-8}})
  ]),

/* ========== PRIMERA B 2026 ========== */
_d801("cbl26_calama","CBL",2026,"institucional","alto",2,
  "Calama no acepta eternizarse en la B",
  "Cobreloa descendió en 2024. El Zorros del Desierto quema y la hinchada naranja no negocia quedarse abajo. No es Cobresal: esto es Calama, no El Salvador.",
  [
    _o801("Todo al ascenso ahora","Heroico. La caja avisa.",48,{hinchada:14,directorio:-6},
      "Calama se prende. El plantel siente el peso naranja.",
      "Ruido de ascenso. Un tropiezo asusta.",
      "Se apostó y un empate de local se leyó como crisis.",
      {be:{moral:6},we:{moral:-6,riesgo:5}}),
    _o801("Armar para quedarse arriba, no para un playoff","Lento. Serio.",40,{camarin:10,socios:8,hinchada:-4},
      "Plan de piso. La gente pide ya.",
      "Plantel serio, tribuna impaciente.",
      "Un lienzo te acusó de administrar el descenso.",
      {be:{prestigio:3},we:{prestigio:-3}})
  ],
  {historia:"Cobreloa descendió a Primera B en 2024. Hecho de tabla."}),
_d801("cbl26_zorros","CBL",2026,"hinchada","medio",4,
  "El Zorros de semana",
  "Cuando llega un grande de la B se llena. El resto, calor y sillas. La distancia es arma si el rival no viaja entero.",
  [
    _o801("Precios para el que vive en Calama","Tribuna local.",36,{comunidad:12,hinchada:10},
      "El naranja de semana se oye. Taquilla chica.",
      "Llegó gente del turno. No el lleno.",
      "Bajaste el precio y igual sopló viento.",
      {be:{plata:-18,moral:3},we:{plata:-18}}),
    _o801("Cobrar la marca desierto","Caja de turismo minero.",50,{sponsors:10,comunidad:-8},
      "El partido grande deja plata. El de semana, no.",
      "Taquilla de visita.",
      "Calama se sintió postal. La popular protestó.",
      {be:{plata:55},we:{plata:20},wg:{hinchada:-8}})
  ]),
_d801("sw26_decano","SW",2026,"institucional","alto",2,
  "El decano, años en la B",
  "Santiago Wanderers. Elías Figueroa Brander, Playa Ancha, Valparaíso. Historia más grande que la tabla. Volver no es postal.",
  [
    _o801("Sello porteño, menos nombres de afuera","Casa. Oficio a construir.",40,{comunidad:12,hinchada:10,directorio:-4},
      "Playa Ancha se siente dueña. El once es más caturro.",
      "Identidad sí, puntos justos.",
      "Se notó la falta de oficio un sábado feo.",
      {be:{prestigio:3},we:{moral:-3}}),
    _o801("Traer nombres para salir ya","Ilusión rápida.",54,{hinchada:8,comunidad:-6,prensa:6},
      "Un refuerzo prendió el puerto. La raíz se diluye.",
      "Se reforzó. El puerto pide más.",
      "Caro y flojo. Valparaíso no perdona el postureo.",
      {be:{plata:-70,plantel:2},we:{plata:-70,moral:-4}})
  ]),
_d801("ues26_laura","UES",2026,"institucional","alto",2,
  "Santa Laura, colonia, urgencia",
  "Unión Española bajó en 2025. Santa Laura, colonia hispana. El 2026 es para no eternizarse en la B. La Furia pide Primera; la caja pide calma.",
  [
    _o801("Hablar claro: primero la B, después el pecho","Honesto.",38,{socios:8,directorio:6,hinchada:-6},
      "El mensaje llega. La tribuna quería himno.",
      "Seriedad. Poca fiesta.",
      "Un sector de la colonia lo leyó como rendición.",
      {be:{prestigio:2},we:{moral:-3}}),
    _o801("Prometer el retorno este año","La gente se prende.",56,{hinchada:14,directorio:-8},
      "Santa Laura se ilusiona. Si no se sube, el año es funeral.",
      "Ruido un mes.",
      "Un tropiezo con un chico de la B dolió como 2025 otra vez.",
      {be:{moral:6},we:{moral:-8,riesgo:5}})
  ]),
_d801("mag26_antiguo","MAG",2026,"institucional","medio",3,
  "El más antiguo, caja de B",
  "Magallanes, 1897. Hoy juega en San Bernardo (Luis Navarro Avilés), no en Ñuñoa. Historia enorme, presupuesto de B. La mancha carabelera no se apaga.",
  [
    _o801("Ser club de San Bernardo de verdad","Casa nueva, raíz vieja.",36,{comunidad:12,hinchada:8,sponsors:-4},
      "El barrio se acerca. La historia cabe en un municipal chico.",
      "Gesto local. La masa histórica no volvió entera.",
      "Ni San Bernardo ni la gloria: a medias.",
      {be:{prestigio:2},we:{prestigio:-2}}),
    _o801("Vender nostalgia de pionero","Camisetas, presente flaco.",50,{sponsors:10,camarin:-6},
      "Se vendió el 1897. El domingo sigue siendo de B.",
      "Plata de merch.",
      "Un hincha viejo escribió: «Historia no es taquilla».",
      {be:{plata:45},we:{plata:15},wg:{comunidad:-8}})
  ]),
_d801("ant26_puma","ANT",2026,"institucional","medio",3,
  "El puma no es sucursal minera",
  "Deportes Antofagasta. Regional Calvo y Bascuñán, calor, distancia. Odia que lo traten de sucursal de la minería o de Calama.",
  [
    _o801("Armar sello de ciudad, no de faena","Menos nombres, más casa.",38,{comunidad:12,hinchada:10},
      "Antofagasta se siente dueña. El puma no pide permiso a Calama.",
      "Identidad. Nivel justito.",
      "Se quedó corto de oficio.",
      {be:{prestigio:3},we:{moral:-2}}),
    _o801("Aceptar el puente minero","Plata, recelo.",50,{sponsors:10,comunidad:-10},
      "Entra un aporte. La tribuna murmura «sucursal».",
      "Cheque chico.",
      "Un lienzo te igualó con el naranja. Guerra declarada.",
      {be:{plata:60},we:{plata:20},wg:{hinchada:-8}})
  ]),
_d801("slq26_quillota","SLQ",2026,"institucional","medio",3,
  "Quillota no es sucursal",
  "San Luis. Lucio Fariña, pueblo del Aconcagua, yo-yo. Un grande quiere usar la plaza. Quillota pide un club propio.",
  [
    _o801("El club es de Quillota","Identidad. Menos nombres.",36,{comunidad:14,hinchada:10,sponsors:-6},
      "El Fariña se siente pueblo. El puente se cae.",
      "Se dijo que no.",
      "Plantel más corto.",
      {be:{prestigio:2},we:{plantel:-2}}),
    _o801("Aceptar el puente","Plata, alma ajena.",50,{directorio:8,comunidad:-10},
      "Cheque y juveniles. Quillota se siente escala.",
      "Convenio tibio.",
      "La gente lo leyó como rendición de comuna.",
      {be:{plata:50},we:{plata:20},wg:{hinchada:-8}})
  ]),
_d801("iqq26_dragones","IQQ",2026,"institucional","alto",2,
  "Tierra de Campeones, única meta: volver",
  "Deportes Iquique bajó en 2025. Dragones, desierto costero. Volver es lo único que la gente acepta.",
  [
    _o801("Plan de piso, no de fiesta","Serio.",40,{camarin:10,socios:8,hinchada:-4},
      "Se habla de construir. La tribuna pide ya.",
      "Orden. Poca épica.",
      "Un sector te acusó de administrar el descenso.",
      {be:{prestigio:3},we:{moral:-3}}),
    _o801("Todo al retorno","Heroico.",56,{hinchada:14,directorio:-6},
      "Iquique se prende. Si no se sube, el año quema.",
      "Ruido de dragón.",
      "Un tropiezo de local se leyó como 2025 otra vez.",
      {be:{moral:6},we:{moral:-7,riesgo:5}})
  ]),
_d801("pmo26_lluvia","PMO",2026,"hinchada","medio",4,
  "Chinquihue, lluvia, el sur lejos",
  "Puerto Montt. El viaje cansa al rival. También al plantel. Recién en la B: quedarse es el plan.",
  [
    _o801("Hacer de la lluvia un arma","Puntos feos.",38,{hinchada:10,camarin:8},
      "El rival resbala. Chinquihue se siente fortín.",
      "Localía sí, fútbol a ratos.",
      "El plantel también se empapó y rindió mal.",
      {be:{moral:3},we:{moral:-2}}),
    _o801("Pedir más fechas en el centro","Cómodo, menos identidad.",50,{sponsors:8,comunidad:-10},
      "Se viaja menos. El sur se siente abandonado.",
      "Un partido menos al sur.",
      "La gente lo leyó como huir de casa.",
      {be:{plata:40},we:{plata:15},wg:{hinchada:-8}})
  ]),
_d801("sma26_dittborn","SMA",2026,"institucional","medio",3,
  "Arica no es turismo",
  "San Marcos. Carlos Dittborn, frontera. Cuando llega un grande se llena; el resto, sillas y viento. La distancia es arma y cárcel.",
  [
    _o801("Precios para el que vive acá","Tribuna local.",36,{comunidad:12,hinchada:10},
      "El Dittborn de semana se oye. Caja chica.",
      "Llegó gente de Arica. No el lleno de visita.",
      "Bajaste y igual sopló el viento.",
      {be:{plata:-16,moral:3},we:{plata:-16}}),
    _o801("Cobrar la marca frontera","Caja de turismo.",50,{sponsors:10,comunidad:-8},
      "El partido grande deja plata. El de semana, no.",
      "Taquilla de visita.",
      "Arica se sintió postal.",
      {be:{plata:45},we:{plata:15},wg:{hinchada:-8}})
  ]),
_d801("tem26_becker","TEM",2026,"institucional","medio",3,
  "Temuco no es otro reinicio",
  "Deportes Temuco. Germán Becker, Araucanía. La gente está harta de refundaciones. El sur pide continuidad.",
  [
    _o801("Plan de cuatro años, por escrito","Aburrido y serio.",40,{socios:10,directorio:4,hinchada:4},
      "Hay papel, hay piso. Poca tapa.",
      "Se anunció. Nadie lo enmarcó.",
      "La gente no se emocionó. Te piden puntos ya.",
      {be:{prestigio:4},we:{moral:-2}}),
    _o801("Ilusión de un mercado más","La gente se prende un mes.",52,{hinchada:10,prensa:6,directorio:-4},
      "Un nombre. Un mes. Después, lo de siempre.",
      "Ruido corto.",
      "Otro reinicio. El Becker bostezó.",
      {be:{moral:4},we:{moral:-5,prestigio:-3}})
  ]),
_d801("cop26_atacama","COP",2026,"institucional","medio",3,
  "Copiapó es polvo y orgullo",
  "Deportes Copiapó tocó Primera y volvió. Atacama no es vitrina. El peligro es vivir de la foto.",
  [
    _o801("Construir para volver con piso","Menos fiesta, más predio.",38,{camarin:10,socios:8},
      "Se trabaja. La foto de Primera se queda en la sede, no en la lona.",
      "Seriedad. Poca ilusión.",
      "La gente quería pecho.",
      {be:{prestigio:3},we:{moral:-2}}),
    _o801("Cobrar la nostalgia de Primera","Plata ahora.",50,{sponsors:8,camarin:-6},
      "Se vendió la camiseta de honor. El domingo es de B.",
      "Merch sí.",
      "Un hincha: «La foto no sube».",
      {be:{plata:45},we:{plata:15},wg:{hinchada:-6}})
  ]),
_d801("usf26_2009","USF",2026,"institucional","medio",3,
  "No vivir de 2009",
  "Unión San Felipe. Copa Chile y Clausura 2009: el año más grande del uni-uni. El peligro es la foto enmarcada.",
  [
    _o801("Respetar la foto y trabajar el ahora","Himno adentro, barro afuera.",38,{camarin:8,hinchada:6,comunidad:6},
      "2009 se nombra con respeto, no con cheque.",
      "Equilibrio tibio.",
      "El vestuario se cansó de oír el mismo año.",
      {be:{prestigio:3},we:{moral:-2}}),
    _o801("Vender nostalgia a todo trapo","Camisetas, presente flaco.",50,{sponsors:8,camarin:-8},
      "Se vendió el 2009. El domingo no se parece.",
      "Plata de merch.",
      "Un cadete preguntó qué pasó ese año. Dolió.",
      {be:{plata:50},we:{plata:20},wg:{hinchada:-6}})
  ]),
_d801("cur26_granja","CUR",2026,"hinchada","medio",4,
  "La Granja llena, el resto no",
  "Curicó Unido. Maule. Cuando hay visita grande el pueblo se desarma; el resto, no. Llegó a Primera y se fue. El Maule pide no quemar el ciclo.",
  [
    _o801("Precios de semana para llenar","Caja chica, ruido alto.",36,{hinchada:12,comunidad:8},
      "La Granja se oye un miércoles. El tesorero bufa.",
      "Llegó gente. No el lleno.",
      "Bajaste y igual sobraron sillas.",
      {be:{plata:-18,moral:3},we:{plata:-18}}),
    _o801("Cobrar el partido grande","Más por cabeza.",48,{sponsors:8,hinchada:-6},
      "Taquilla de visita. Ambiente más frío el resto.",
      "Plata de un domingo.",
      "Se vio huecos en un partido que el pueblo esperaba.",
      {be:{plata:40},we:{plata:15},wg:{prensa:-4}})
  ]),
_d801("ran26_talca","RAN",2026,"institucional","medio",3,
  "Talca no es puente",
  "Rangers. Fiscal de Talca, piducano. Santiago mira a Talca como escala. La ciudad pide club propio.",
  [
    _o801("Sello local","Menos nombres, más casa.",38,{comunidad:12,hinchada:10,directorio:-4},
      "El piducano se siente dueño.",
      "Identidad. Oficio justito.",
      "Se notó la falta de nombres un sábado.",
      {be:{prestigio:3},we:{moral:-2}}),
    _o801("Traer nombres de afuera","Ilusión rápida.",52,{hinchada:6,comunidad:-6},
      "Un refuerzo. Un mes. La raíz se diluye.",
      "Se reforzó.",
      "Caro y flojo. Talca no es sucursal y te lo dijo.",
      {be:{plata:-45,plantel:2},we:{plata:-45}})
  ]),
_d801("scr26_pueblo","SCR",2026,"institucional","medio",4,
  "Santa Cruz cabe en su cancha",
  "Deportes Santa Cruz. Colchagua, pueblo, presupuesto chico. Aparece un inversionista que habla de «marca Colchagua».",
  [
    _o801("El club es de Santa Cruz","Casa.",36,{comunidad:14,hinchada:10,sponsors:-6},
      "El municipal se siente pueblo. El inversionista se va.",
      "Se dijo que no.",
      "Caja más flaca.",
      {be:{prestigio:2},we:{plata:-15}}),
    _o801("Abrir la marca","Plata, recelo.",50,{sponsors:10,comunidad:-10},
      "Entra un cheque. El pueblo mira de reojo.",
      "Convenio tibio.",
      "Santa Cruz se sintió marca, no club.",
      {be:{plata:40},we:{plata:15},wg:{hinchada:-8}})
  ]),
_d801("rec26_barrio","REC",2026,"hinchada","medio",4,
  "Barrio, estadio chico",
  "Deportes Recoleta. Club joven. Llegar a la B ya fue título; quedarse es el trabajo. El municipal es chico y cerca.",
  [
    _o801("Llenarlo con el barrio","Precios bajos.",34,{hinchada:12,comunidad:10},
      "Recoleta se oye. Taquilla de pueblo.",
      "Llegó gente de la comuna.",
      "Bajaste y igual caben todos de sobra.",
      {be:{plata:-12,moral:3},we:{plata:-12}}),
    _o801("Buscar una cancha más grande","Más aforo, menos casa.",50,{sponsors:6,comunidad:-8},
      "Se habla de mudanza. El barrio se enfría.",
      "Quedó en carpeta.",
      "La gente lo leyó como huir.",
      {be:{plata:25},we:{plata:10},wg:{hinchada:-8}})
  ]),

/* ========== SEGUNDA 2026 · ninguno hereda Colo-Colo 1991 ========== */
_d801("smo26_pintana","SMO",2026,"institucional","alto",2,
  "La Pintana, no Macul",
  "Santiago Morning bajó a Segunda. Municipal de La Pintana, zona Sur. Esteban Paredes en el banco. Camiseta con pasado; el presente es pelear el salto a la B. Esto no es el Monumental ni 1991.",
  [
    _o801("Hablar claro: primero la B, sin fantasía de Primera","Honesto.",36,{socios:8,directorio:6,hinchada:-4},
      "El chaguito entiende el tamaño. Se trabaja en lodazal, no en revista.",
      "Mensaje tibio.",
      "Un sector quería pecho de Primera y se enojó.",
      {be:{prestigio:2},we:{moral:-3}}),
    _o801("Vender la camiseta grande en Segunda","Nostalgia. Presente flaco.",52,{sponsors:8,camarin:-6},
      "Se vendió historia. El domingo es de zona Sur.",
      "Merch sí.",
      "Un cadete preguntó por la Libertadores. No es de acá. Quedó raro.",
      {be:{plata:35},we:{plata:10},wg:{hinchada:-6}})
  ]),
_d801("lsc26_carbon","LSC",2026,"institucional","medio",3,
  "El minero del carbón",
  "Lota Schwager. Federico Schwager, Coronel, cuenca del carbón. Vuelve al profesionalismo. La cuenca lo siente como bandera, no como sucursal de Concepción.",
  [
    _o801("El club es de la cuenca","Bandera. Menos vitrina.",36,{comunidad:14,hinchada:10,sponsors:-6},
      "Coronel se siente dueño. El carbón no se disfraza.",
      "Identidad. Caja chica.",
      "Plantel corto.",
      {be:{prestigio:3},we:{plata:-10}}),
    _o801("Abrirse a la marca Biobío","Más mercado, menos mina.",50,{sponsors:8,comunidad:-8},
      "Entra un aporte. La cuenca murmura.",
      "Cheque chico.",
      "Un lienzo: «Somos Lota, no vitrina».",
      {be:{plata:40},we:{plata:15},wg:{hinchada:-6}})
  ]),
_d801("oso26_sur","OSO",2026,"hinchada","medio",3,
  "Estadio grande para la categoría",
  "Provincial Osorno. Rubén Marcos Peralta (~11.000). El toro del sur. Si llena, incomoda; si no, es un recinto de Primera en Segunda.",
  [
    _o801("Precios de Segunda y llenar el Peralta","Caja chica, ruido de ciudad.",38,{hinchada:12,comunidad:10},
      "Osorno se oye. El tesorero bufa.",
      "Llegó gente. No los 11 mil.",
      "Bajaste y el viento del sur igual se comió las gradas.",
      {be:{plata:-20,moral:3},we:{plata:-20}}),
    _o801("Cobrar como si fuera Primera","Más por cabeza, menos pueblo.",50,{sponsors:8,hinchada:-8},
      "Taquilla de visita. El resto, huecos.",
      "Un domingo caro.",
      "Se vio un estadio grande vacío. La foto duele.",
      {be:{plata:35},we:{plata:10},wg:{prensa:-4}})
  ]),
_d801("lin26_maule","LIN",2026,"institucional","medio",3,
  "Albirrojo del Maule",
  "Deportes Linares. Fiscal Tucapel Bustamante. Zona Sur, pelea el salto a la B. No es Talca ni Curicó: es Linares.",
  [
    _o801("Sello de Linares, no puente al Maule","Casa.",36,{comunidad:12,hinchada:8},
      "El albirrojo se siente de acá.",
      "Identidad. Oficio justito.",
      "Se quedó corto de nombres.",
      {be:{prestigio:2},we:{moral:-2}}),
    _o801("Traer un nombre de la B","Ilusión de salto.",52,{prensa:6,comunidad:-4},
      "Un refuerzo. Un mes.",
      "Se habló.",
      "Caro para Segunda y no rindió.",
      {be:{plata:-35,plantel:1},we:{plata:-35}})
  ]),
_d801("clc26_valle","CLC",2026,"institucional","medio",3,
  "San Fernando, valle, no vitrina",
  "Colchagua. Jorge Silva Valenzuela. Volvió al profesionalismo. Valle de Colchagua, no sucursal de Santa Cruz ni de Santiago.",
  [
    _o801("Quedarse valle","Pueblo. Menos cheque.",36,{comunidad:12,hinchada:8,sponsors:-4},
      "San Fernando se siente dueño.",
      "Identidad.",
      "Caja flaca.",
      {be:{prestigio:2},we:{plata:-10}}),
    _o801("Abrir marca Colchagua","Vino, turismo, recelo.",50,{sponsors:8,comunidad:-8},
      "Entra un aporte de valle. El club se siente marca.",
      "Cheque chico.",
      "El pueblo lo leyó como disfraz.",
      {be:{plata:30},we:{plata:10},wg:{hinchada:-6}})
  ]),
_d801("tra26_andes","TRA",2026,"institucional","medio",3,
  "Los Andes, la cordillera",
  "Trasandino. Regional de Los Andes, cerca del paso. Club de cordillera, no de capital. Zona Norte de Segunda.",
  [
    _o801("Hacer de la cordillera un arma","Viaje feo para el rival.",38,{hinchada:10,camarin:6},
      "El rival llega mareado de altura de valle. Puntos feos.",
      "Localía de pueblo.",
      "El plantel también sufre el viento.",
      {be:{moral:3},we:{moral:-2}}),
    _o801("Pedir más fechas abajo","Cómodo.",50,{sponsors:6,comunidad:-8},
      "Se viaja menos. Los Andes se siente escala.",
      "Un partido menos en casa.",
      "La gente lo leyó como huir.",
      {be:{plata:25},we:{plata:8},wg:{hinchada:-6}})
  ]),
_d801("ova26_limari","OVA",2026,"institucional","medio",3,
  "El Ciclón del Limarí",
  "Provincial Ovalle. Diaguita. Zona Norte. Campeón de Tercera A 2023: está escribiendo el profesionalismo, no cobrando una vitrina.",
  [
    _o801("Construir piso en Segunda","Serio.",38,{camarin:8,socios:8},
      "Ovalle habla de quedarse. Poca tapa.",
      "Orden.",
      "La gente quería salto ya.",
      {be:{prestigio:2},we:{moral:-2}}),
    _o801("Todo al salto a la B","Heroico.",54,{hinchada:10,directorio:-4},
      "El Limarí se prende. Si se cae, duele.",
      "Ruido un mes.",
      "Un tropiezo de zona apagó la frase.",
      {be:{moral:4},we:{moral:-5}})
  ]),
_d801("cna26_litoral","CNA",2026,"institucional","medio",3,
  "Concón escribe su historia",
  "Concón National, 1914. Litoral de Valparaíso. Sin pasado en divisiones mayores: no hay Libertadores que cobrar. Se escribe ahora.",
  [
    _o801("Aceptar que se está fundando el relato","Honesto.",34,{socios:8,comunidad:8},
      "El litoral entiende: esto empieza acá.",
      "Humildad. Poca fiesta.",
      "Un sector quería historia prestada.",
      {be:{prestigio:2},we:{moral:-2}}),
    _o801("Pedirle al club que se crea grande ya","Pecho. Frágil.",52,{hinchada:8,directorio:-4},
      "Ilusión de pueblo costero. Si se cae, no hay vitrina que tape.",
      "Ruido corto.",
      "Se pidió de más. El municipal no perdonó.",
      {be:{moral:3},we:{moral:-4}})
  ]),
_d801("gve26_verdes","GVE",2026,"institucional","medio",3,
  "Los Verdes del secano",
  "General Velásquez. San Vicente de Tagua Tagua, 1908. Augusto Rodríguez. Club de pueblo, no de Rancagua.",
  [
    _o801("El club es de San Vicente","Casa.",36,{comunidad:12,hinchada:8},
      "El secano se siente dueño.",
      "Identidad.",
      "Caja de pueblo.",
      {be:{prestigio:2},we:{plata:-8}}),
    _o801("Acercarse a la marca O'Higgins","Puente. Recelo.",50,{sponsors:6,comunidad:-8},
      "Más visibilidad. Menos pueblo.",
      "Gesto tibio.",
      "San Vicente se sintió sucursal de Rancagua.",
      {be:{plata:28},we:{plata:10},wg:{hinchada:-6}})
  ]),
_d801("ren26_rengo","REN",2026,"institucional","medio",4,
  "Rengo, primero sobrevivir",
  "Deportes Rengo. Oro y Cielo. Municipal Guillermo Guzmán Díaz. Cachapoal. Primero, no desaparecer.",
  [
    _o801("Austeridad y quedarse","Poco épico. Sano.",34,{directorio:8,socios:6,hinchada:-4},
      "Se recorta. El club sigue. La gente bostezó.",
      "Caja justa.",
      "Se leyó como falta de ambición.",
      {be:{plata:25},we:{moral:-3}}),
    _o801("Apostar un refuerzo de la B","Ilusión. Riesgo.",54,{hinchada:8,directorio:-6},
      "Un nombre. Un mes de ruido.",
      "Se habló en el pueblo.",
      "No rindió y la caja quedó en rojo de Segunda.",
      {be:{plata:-30,moral:3},we:{plata:-30,moral:-4}})
  ]),
_d801("col26_chacabuco","COL",2026,"institucional","medio",3,
  "El Gigante de Chacabuco",
  "Atlético Colina, 2014. Campeón de Tercera A 2025: vuelve al profesionalismo. Comuna al norte de Santiago, no sucursal de un grande de la capital.",
  [
    _o801("Club de Colina, no de Santiago","Casa.",36,{comunidad:12,hinchada:8,sponsors:-4},
      "La comuna se siente dueña.",
      "Identidad de pueblo-santiago.",
      "Caja chica.",
      {be:{prestigio:2},we:{plata:-10}}),
    _o801("Abrirse a un grande de la capital","Puente. Recelo.",50,{directorio:8,comunidad:-10},
      "Juveniles y un cheque. Colina se siente escala.",
      "Convenio tibio.",
      "El pueblo lo leyó como filiar.",
      {be:{plata:35},we:{plata:12},wg:{hinchada:-8}})
  ]),
_d801("bsa26_choapa","BSA",2026,"institucional","medio",3,
  "Salamanca, identidad de pueblo",
  "Brujas de Salamanca. Choapa. Municipal de pueblo, caja de pueblo. Zona Norte. No hay vitrina que cobrar.",
  [
    _o801("El club es de Salamanca","Bandera.",34,{comunidad:14,hinchada:8},
      "El Choapa se siente dueño.",
      "Pueblo. Puntos feos.",
      "Plantel corto.",
      {be:{prestigio:2},we:{plata:-8}}),
    _o801("Buscar un sponsor de la minería del valle","Plata, recelo.",50,{sponsors:8,comunidad:-6},
      "Entra un aporte. La bruja se siente marca.",
      "Cheque chico.",
      "El pueblo mira el logo nuevo con recelo.",
      {be:{plata:32},we:{plata:10}})
  ]),
_d801("rsj26_legua","RSJ",2026,"cantera","medio",3,
  "La Legua, escuela, poco aforo",
  "Real San Joaquín nace de la escuela de Iván Zamorano (1998). Club-formador. Poco aforo, muchos cadetes. No es un grande disfrazado.",
  [
    _o801("Priorizar cadetes aunque duela la tabla","Sello de escuela.",36,{comunidad:10,directorio:-4},
      "Debutaron dos pibes. El sello se nota.",
      "Formación. Puntos justos.",
      "Se sufrió de más un domingo.",
      {be:{prestigio:3},we:{moral:-3}}),
    _o801("Fichar dos veteranos para no sufrir","Oficio. Menos escuela.",50,{camarin:8,comunidad:-6},
      "El once se ve más de Segunda. Los cadetes se sientan.",
      "Un veterano rindió.",
      "Se gastó la plata de formador en sueldos.",
      {be:{plata:-28,plantel:1},we:{plata:-28}})
  ]),
_d801("sci26_barnechea","SCI",2026,"institucional","medio",3,
  "Proyecto joven, negro y rosa",
  "Santiago City. Municipal de Lo Barnechea. Proyecto joven de la capital. Sin historia en categorías mayores: no hay 1991 que heredar.",
  [
    _o801("Escribir el relato propio","Honesto.",34,{socios:8,comunidad:6},
      "Se acepta que se está partiendo. Sin disfraz de grande.",
      "Humildad.",
      "Un sector quería historia prestada.",
      {be:{prestigio:2},we:{moral:-2}}),
    _o801("Pedirle al proyecto que se crea grande ya","Marketing. Frágil.",52,{sponsors:8,hinchada:-4},
      "Hay ruido de marca. El municipal no acompaña.",
      "Campaña en redes.",
      "Se pidió de más. Lo Barnechea no es una final.",
      {be:{plata:20,moral:2},we:{moral:-4}})
  ]),

/* ========== AFA 2026 ========== */
_d801("boc26_bombonera","BOC",2026,"hinchada","alto",3,
  "La Bombonera no se negocia",
  "Boca Juniors. La Bombonera es la semana. El Superclásico manda; el promedio acecha igual. Esto no es el Monumental de Macul ni la ANFP.",
  [
    _o801("Cerrar concentrados, sin teatro","Cabeza. La calle pide pecho.",40,{tecnico:10,camarin:8,hinchada:-4},
      "El plantel llegó entero al Fortín.",
      "Concentración y un audio de más.",
      "La gente lo leyó como miedo.",
      {be:{moral:5},we:{moral:-4}}),
    _o801("Dejar que la Bombonera empuje","Pecho afuera.",52,{hinchada:14,camarin:-6},
      "La Doce empuja y el plantel responde.",
      "Ruido sí, fútbol a ratos.",
      "Se jugó con el corazón y se perdió la cabeza.",
      {be:{moral:6},we:{moral:-6,riesgo:4}})
  ]),
_d801("riv26_monumental","RIV",2026,"institucional","alto",2,
  "El Monumental llena; el promedio acecha",
  "River Plate. El Monumental de Núñez (no el de Macul) se llena. Ser el más grande de Argentina no te salva el promedio. El Superclásico manda la semana.",
  [
    _o801("Foco en el promedio, sin teatro","Serio. Poco épico.",38,{directorio:8,camarin:8,hinchada:-4},
      "Se habla de puntos. La tribuna quería himno.",
      "Orden. Poca fiesta.",
      "Un sector lo leyó como miedo a ser River.",
      {be:{prestigio:2},we:{moral:-3}}),
    _o801("Jugar a ser el más grande todas las fechas","Pecho. Desgaste.",54,{hinchada:12,camarin:-6},
      "Núñez se cree final. El plantel se gasta.",
      "Ruido de grande.",
      "Un tropiezo de local se leyó como crisis.",
      {be:{moral:5,prestigio:2},we:{moral:-6}})
  ]),
_d801("rac26_avellaneda","RAC",2026,"institucional","medio",3,
  "La Academia, no vivir de 1967",
  "Racing. Cilindro de Avellaneda. El clásico no es de Buenos Aires capital: es Avellaneda. 1967 está en la vitrina; el presente pide otra cosa.",
  [
    _o801("Respetar la vitrina y trabajar el ahora","Himno adentro.",38,{camarin:8,hinchada:6},
      "Se nombra 1967 con respeto, no con cheque.",
      "Equilibrio.",
      "El vestuario se cansó del mismo cuadro.",
      {be:{prestigio:3},we:{moral:-2}}),
    _o801("Vender la Academia a todo trapo","Marca. Recelo.",50,{sponsors:10,camarin:-6},
      "Se cobra la historia. El domingo es otra cosa.",
      "Merch.",
      "Un hincha: «La Academia se juega, no se vende».",
      {be:{plata:70},we:{plata:25},wg:{hinchada:-6}})
  ]),
_d801("ind26_rojo","IND",2026,"institucional","medio",3,
  "Rey de Copas, Avellaneda",
  "Independiente. El Rojo pide Europa otra vez, no nostalgia. El clásico de Avellaneda manda. Esto no es Copa Chile ni Quilín.",
  [
    _o801("Construir para volver a copas","Lento.",40,{camarin:10,socios:8,hinchada:-4},
      "Se habla de piso. La gente pide Libertadores ya.",
      "Orden.",
      "Se leyó como falta de pecho.",
      {be:{prestigio:3},we:{moral:-3}}),
    _o801("Prometer Europa este ciclo","Heroico. Frágil.",56,{hinchada:12,directorio:-6},
      "El Rojo se prende. Si no llega, duele de verdad.",
      "Ruido un mes.",
      "Un tropiezo apagó la frase.",
      {be:{moral:5},we:{moral:-6}})
  ]),

/* ========== GLORIAS (mismo listón que CC 1991: cartas del AÑO) ========== */
_d801("cbl81_final","CBL",1981,"institucional","alto",11,
  "La final de América",
  "Cobreloa llega a la final de la Libertadores 1981 vs Flamengo. Ida en el Maracaná, vuelta en el Nacional de Santiago (Calama no da el aforo). Vicente Cantatore en el banco. Mario Soto capitán. El norte se creyó grande de verdad.",
  [
    _o801("Prioridad absoluta a la Copa","Todo el club se ordena alrededor de Flamengo.",38,{tecnico:12,hinchada:12,directorio:-4},
      "El plantel entra enchufado. Calama respira otra cosa aunque se juegue en Santiago.",
      "Hay foco y también la sensación de que el local se regala.",
      "La apuesta pública tensa al vestuario.",
      {hist:true,be:{moral:8,prestigio:4},me:{moral:3},we:{moral:-5}}),
    _o801("Ir por el doblete, sin soltar el Nacional","Los dos frentes.",62,{hinchada:8,camarin:-6},
      "El plantel se hace cargo de los dos lados.",
      "Se compite, el desgaste se nota.",
      "Correr dos carreras dejó al naranja a medio camino.",
      {be:{moral:4},we:{moral:-6}}),
    _o801("El torneo local primero","Los puntos de Chile pagan el mes.",30,{directorio:12,tecnico:-20,hinchada:-12},
      "Caja sana, Copa con lo justo.",
      "Se asegura la tabla a cambio de mirar la Copa de vereda.",
      "Cantatore se siente desautorizado.",
      {be:{plata:100},we:{moral:-8},wg:{tecnico:-16}})
  ],
  {historia:"Cobreloa finalista 1981 vs Flamengo: 2-1 Maracaná, 1-0 Nacional (Santiago), 0-2 playoff en el Centenario. Merello marcó en ida y vuelta. DT Vicente Cantatore."}),
_d801("cbl81_nacional","CBL",1981,"hinchada","alto",11,
  "La «localía» en el Nacional",
  "La vuelta se juega en el Estadio Nacional de Santiago, no en Calama. 61 mil personas. El naranja pide que el recinto se sienta de Cobreloa; Santiago no es el desierto.",
  [
    _o801("Llenar de naranja el Nacional","Viaje de Calama, precio de pueblo.",40,{hinchada:14,comunidad:10,directorio:-6},
      "El Nacional se oye naranja. El tesorero bufa por los buses.",
      "Llegó gente del norte. No los 61 mil.",
      "El viaje cansó y la hinchada local no empujó igual.",
      {hist:true,be:{plata:-40,moral:6},we:{plata:-40,moral:-2}}),
    _o801("Cobrar como final de Santiago","Taquilla de capital.",50,{directorio:8,hinchada:-8},
      "Plata de final. El color naranja se diluye entre santiaguinos.",
      "Taquilla sí, alma a media.",
      "Calama se sintió visitante en «su» vuelta.",
      {be:{plata:80},we:{plata:30},wg:{comunidad:-10}})
  ],
  {historia:"Vuelta 20 nov 1981: Cobreloa 1-0 Flamengo en el Nacional de Santiago. 61.721 espectadores. Gol de Víctor Merello."}),
_d801("uch94_sequia","UCH",1994,"institucional","alto",2,
  "25 años sin títulos",
  "La U no es campeón nacional desde 1969. Jorge Socías en el banco. El Ballet es memoria; el presente pide cortar la sequía. El Salvador, 18 de diciembre, va a ser el escenario.",
  [
    _o801("Todo al título, sin plan B","La masa no acepta otro año vacío.",40,{hinchada:14,tecnico:10,directorio:-4},
      "El plantel siente el peso azul. Musrri ordena.",
      "Hay foco y también ansiedad.",
      "La apuesta tensa a los jóvenes (Salas, Valencia).",
      {hist:true,be:{moral:8,prestigio:3},we:{moral:-5}}),
    _o801("Construir y que el título llegue si llega","Prudente. La calle no perdona.",52,{directorio:8,hinchada:-10},
      "Se juega con cabeza. La Norte pide pecho.",
      "Equilibrio.",
      "Un sector lo leyó como miedo a los 25 años.",
      {be:{prestigio:2},we:{moral:-6},wg:{hinchada:-8}})
  ],
  {historia:"Universidad de Chile campeón 1994. 1-1 a Cobresal en El Salvador (penal de Mardones). 25 años de sequía. Salas 27 goles. DT Jorge Socías."}),
_d801("sw01_estrella","SW",2001,"institucional","alto",2,
  "33 años después",
  "Santiago Wanderers no es campeón nacional desde 1968. Jorge Garcés. Silvio Fernández, Riveros, Villarroel. El Nacional va a ser la fiesta si se gana: 4-2 a Audax, 50 mil.",
  [
    _o801("Prioridad absoluta al título","El puerto no acepta otra sequía.",38,{hinchada:14,tecnico:10},
      "Playa Ancha se cree campeón antes de serlo. El plantel responde.",
      "Foco y ansiedad porteña.",
      "La apuesta tensa al vestuario.",
      {hist:true,be:{moral:8,prestigio:4},we:{moral:-5}}),
    _o801("Ir partido a partido, sin cartel","Serio. Poco épico.",46,{camarin:8,hinchada:-6},
      "Se trabaja. El puerto pide himno.",
      "Orden.",
      "Valparaíso lo leyó como falta de pecho.",
      {be:{moral:3},we:{moral:-4}})
  ],
  {historia:"Wanderers campeón 2001. 4-2 a Audax Italiano en el Nacional. DT Jorge Garcés. Silvio Fernández 17 goles."}),
_d801("ues13_transicion","UES",2013,"institucional","alto",11,
  "La última fecha en Santa Laura",
  "Transición 2013. José Luis Sierra. Ampuero capitán. La última es vs Colo-Colo: un 1-0 da la séptima estrella. Santa Laura no es el Monumental: es colonia y Furia Roja.",
  [
    _o801("Cerrar el predio y jugar la final adelantada","Cabeza.",36,{tecnico:12,camarin:10},
      "El plantel llegó entero. Santa Laura empujó sin teatro de más.",
      "Concentración y un audio.",
      "Se jugó tenso. Un joven se comió la ansiedad.",
      {hist:true,be:{moral:7,prestigio:3},we:{moral:-4}}),
    _o801("Dejar que la Furia empuje","Pecho. La calle manda.",50,{hinchada:14,camarin:-6},
      "Santa Laura se viene abajo. El once responde.",
      "Ruido sí.",
      "Se perdió la cabeza un rato. Un amarillo tonto.",
      {be:{moral:5},we:{moral:-5,riesgo:3}})
  ],
  {historia:"Unión Española campeón del Transición 2013. 1-0 a Colo-Colo en la última. DT José Luis Sierra. Séptima estrella."}),
_d801("boc07_libertadores","BOC",2007,"institucional","alto",5,
  "Otra vez América",
  "Boca va por la Libertadores 2007 vs Grêmio. Miguel Ángel Russo. Riquelme figura, Palermo capitán. La Bombonera pide la sexta. Barros Schelotto ya no está (baja en abril).",
  [
    _o801("Prioridad absoluta a la Copa","Todo alrededor de Grêmio.",36,{tecnico:12,hinchada:12},
      "La Bombonera se ordena. Riquelme es el eje.",
      "Foco y desgaste local.",
      "La apuesta tensa a los que no juegan.",
      {hist:true,be:{moral:8,prestigio:4},we:{moral:-4}}),
    _o801("Doblete, sin soltar el local","Los dos frentes.",60,{hinchada:8,camarin:-6},
      "Se compite en los dos lados.",
      "Desgaste de mayo.",
      "Ni Copa ni local a fondo.",
      {be:{moral:4},we:{moral:-6}})
  ],
  {historia:"Boca campeón de América 2007 vs Grêmio (3-0 y 2-0). DT Miguel Ángel Russo. Riquelme goleador xeneize del certamen."}),
_d801("riv18_madrid","RIV",2018,"institucional","alto",11,
  "La final se va a Madrid",
  "River vs Boca, Libertadores 2018. La vuelta no se juega en el Monumental de Núñez: se va a Madrid. Gallardo. Ponzio capitán. Pratto. El club tiene que decidir cómo se vive un clásico en otro continente.",
  [
    _o801("Tratarlo como final de club, no como circo","Cabeza. Menos marketing.",40,{tecnico:10,camarin:10,sponsors:-6},
      "El plantel viaja serio. Madrid es una cancha, no un estudio.",
      "Foco y también el ruido que no se puede apagar.",
      "El circo igual se metió al hotel.",
      {hist:true,be:{moral:6,prestigio:3},we:{moral:-3}}),
    _o801("Abrazar el escenario mundial","Marca River. Desgaste.",52,{sponsors:12,hinchada:6,camarin:-6},
      "El mundo mira. El vestuario se llena de cámaras.",
      "Ruido de final.",
      "Se jugó el show y se tensó de más.",
      {be:{plata:80,prestigio:4},we:{moral:-5}})
  ],
  {historia:"River campeón de América 2018 vs Boca. Final en Madrid. DT Marcelo Gallardo. Pratto marca en la vuelta."}),

_d801("aud07_libertadores","AUD",2007,"institucional","alto",2,
  "Animar no es ser campeón",
  "Audax Italiano de Raúl Toro anima el Apertura 2007 (3º, 44 pts) y juega la Libertadores. NO es campeón: el Apertura lo ganó Colo-Colo. Villanueva, Orellana, Di Santo. La Florida no se disfraza de Macul.",
  [
    _o801("Aceptar el tamaño: pelear arriba, sin robarle la estrella a nadie","Honesto.",36,{camarin:8,comunidad:8,hinchada:-4},
      "El Itálico se cree animador, no campeón prestado. Se trabaja.",
      "Humildad. La gente pide más.",
      "Un sector quería el pecho de un título que no es de acá.",
      {hist:true,be:{prestigio:3},we:{moral:-3}}),
    _o801("Pedirle al plantel que se crea campeón","Pecho. Frágil.",54,{hinchada:10,camarin:-4},
      "La Florida se ilusiona. Si no llega, duele de verdad.",
      "Ruido un mes.",
      "Se pidió de más. El Apertura era de otro.",
      {be:{moral:4},we:{moral:-6}})
  ],
  {historia:"Apertura 2007: campeón Colo-Colo. Audax 3º (44 pts), 11 puntos en el grupo de Libertadores, no pasa. DT Raúl Toro."}),
_d801("vel94_copa","VEL",1994,"institucional","alto",6,
  "La Copa de Bianchi",
  "Vélez va por la Libertadores 1994 vs São Paulo. Carlos Bianchi. Chilavert. Trotta capitán. El Fortín de Liniers no es la Bombonera ni el Monumental de Núñez.",
  [
    _o801("Prioridad absoluta a la Copa","Todo alrededor de São Paulo.",36,{tecnico:12,hinchada:10},
      "Liniers se ordena. Chilavert es el eje.",
      "Foco y desgaste local.",
      "La apuesta tensa a los que no juegan.",
      {hist:true,be:{moral:8,prestigio:4},we:{moral:-4}}),
    _o801("Doblete, sin soltar el local","Los dos frentes.",60,{hinchada:8,camarin:-6},
      "Se compite en los dos lados.",
      "Desgaste.",
      "Ni Copa ni local a fondo.",
      {be:{moral:4},we:{moral:-6}})
  ],
  {historia:"Vélez campeón de América 1994 vs São Paulo (penales) e Intercontinental vs Milan. DT Carlos Bianchi. Trotta capitán."}),
_d801("slo14_copa","SLO",2014,"institucional","alto",7,
  "El Ciclón a América",
  "San Lorenzo va por la Libertadores 2014 vs Nacional. Edgardo Bauza. Romagnoli. Ortigoza. Boedo, no el Superclásico de la otra orilla.",
  [
    _o801("Cerrar el predio y tratarlo como final","Cabeza.",38,{tecnico:12,camarin:10},
      "El Ciclón llega entero. Boedo empuja sin circo de más.",
      "Concentración.",
      "Se jugó tenso.",
      {hist:true,be:{moral:7,prestigio:3},we:{moral:-4}}),
    _o801("Dejar que Boedo empuje","Pecho.",50,{hinchada:14,camarin:-6},
      "El Gasómetro se viene abajo.",
      "Ruido sí.",
      "Se perdió la cabeza un rato.",
      {be:{moral:5},we:{moral:-5,riesgo:3}})
  ],
  {historia:"San Lorenzo campeón de América 2014 vs Nacional (1-1 / 1-0). DT Edgardo Bauza."}),
_d801("rac67_inter","RAC",1967,"institucional","alto",10,
  "La Intercontinental",
  "Racing, campeón de América, juega la Intercontinental 1967 vs Celtic. Playoff en Montevideo. Juan José Pizzuti. Oscar Martín capitán. Cárdenas. Avellaneda, no Buenos Aires capital.",
  [
    _o801("Prioridad absoluta a la Intercontinental","Todo el club se ordena.",36,{tecnico:12,hinchada:12},
      "La Academia se juega el mundo. El Cilindro espera.",
      "Foco y ansiedad.",
      "La apuesta tensa al vestuario.",
      {hist:true,be:{moral:8,prestigio:4},we:{moral:-4}}),
    _o801("No soltar el local argentino","Los dos frentes.",58,{directorio:8,camarin:-6},
      "Se compite en los dos lados.",
      "Desgaste.",
      "Ni copa ni local a fondo.",
      {be:{moral:3},we:{moral:-6}})
  ],
  {historia:"Racing campeón Intercontinental 1967 vs Celtic (playoff Montevideo). DT Juan José Pizzuti. Gol de Cárdenas. Capitán Oscar Martín."}),
_d801("ind84_tokio","IND",1984,"institucional","alto",11,
  "Tokio, no nostalgia",
  "Independiente juega la Intercontinental 1984 en Tokio. José Omar Pastoriza. Trossero capitán. Percudani. Bochini. El Rey de Copas pide el partido, no el cuadro de la vitrina.",
  [
    _o801("Tratarlo como final de club, no como gira","Cabeza.",38,{tecnico:12,camarin:10},
      "El Rojo viaja serio. Tokio es una cancha.",
      "Foco y el jet lag.",
      "El viaje cansó de más.",
      {hist:true,be:{moral:7,prestigio:3},we:{moral:-3}}),
    _o801("Abrazar el escenario mundial","Marca. Desgaste.",52,{sponsors:10,hinchada:6,camarin:-6},
      "El mundo mira. El vestuario se llena de cámaras.",
      "Ruido de final.",
      "Se jugó el show.",
      {be:{plata:40,prestigio:3},we:{moral:-5}})
  ],
  {historia:"Independiente campeón Intercontinental 1984 vs Liverpool en Tokio. DT Pastoriza. Percudani gol. Trossero capitán."}),
_d801("elp09_copa","ELP",2009,"institucional","alto",6,
  "Verón alza la Copa",
  "Estudiantes va por la Libertadores 2009. Alejandro Sabella. Juan Sebastián Verón capitán. Boselli goleador. El pincharrata, no el Superclásico de la capital.",
  [
    _o801("Prioridad absoluta a la Copa","Todo alrededor de América.",36,{tecnico:12,hinchada:10},
      "El Bosque se ordena. Verón es el eje.",
      "Foco y desgaste local.",
      "La apuesta tensa a los que no juegan.",
      {hist:true,be:{moral:8,prestigio:4},we:{moral:-4}}),
    _o801("Doblete","Los dos frentes.",60,{hinchada:8,camarin:-6},
      "Se compite en los dos lados.",
      "Desgaste.",
      "Ni Copa ni local a fondo.",
      {be:{moral:4},we:{moral:-6}})
  ],
  {historia:"Estudiantes campeón de América 2009. DT Alejandro Sabella. Verón alza la copa. Boselli 8 goles."})
];

(function mergeDec801(){
  if(typeof DECISIONES==="undefined"||!Array.isArray(DECISIONES)) return;
  DECISIONES_801.forEach(function(d){
    if(!DECISIONES.some(function(x){ return x.id===d.id; })) DECISIONES.push(d);
  });
})();

/* Marcas de cancha: una decisión de Calama no sale en El Salvador, etc. */
(function marcas801(){
  if(typeof decisionCabeEnClub!=="function") return;
  var orig=decisionCabeEnClub;
  if(orig._r801) return;
  decisionCabeEnClub=function(d){
    if(!orig(d)) return false;
    if(!d||typeof E==="undefined"||!E) return true;
    var club=E.club;
    var blob="";
    try{ blob=((d.t||"")+" "+(d.d||"")).toLowerCase(); }catch(e){ return true; }
    var extra=[
      {re:/la pintana/, ok:["SMO"]},
      {re:/federico schwager|cuenca del carbón|cuenca del carbon/, ok:["LSC"]},
      {re:/zorros del desierto/, ok:["CBL"]},
      {re:/el salvador|el cobre/, ok:["COB","CBS"]},
      {re:/lucio fariña|lucio farina/, ok:["SLQ"]},
      {re:/navarrete candia/, ok:["LIM"]},
      {re:/chinquihue/, ok:["PMO"]},
      {re:/carlos dittborn/, ok:["SMA"]},
      {re:/tierra de campeones/, ok:["IQQ"]},
      {re:/nelson oyarzún|nelson oyarzun/, ok:["NUB"]},
      {re:/nicolás chahuán|nicolas chahuan/, ok:["CAL"]},
      {re:/la portada/, ok:["LSE"]},
      {re:/claro arena|san carlos de apoquindo/, ok:["UC"]},
      {re:/julio martínez|nacional de santiago|cancha prestada/, ok:["UCH","CBL"]},
      {re:/cap acero/, ok:["HUA"]},
      {re:/elías figueroa|elias figueroa/, ok:["SW"]},
      {re:/germán becker|german becker/, ok:["TEM"]},
      {re:/la granja/, ok:["CUR"]},
      {re:/diaguita/, ok:["OVA"]},
      {re:/jorge silva/, ok:["CLC"]},
      {re:/tucapel bustamante/, ok:["LIN"]},
      {re:/augusto rodríguez|augusto rodriguez/, ok:["GVE"]},
      {re:/lo barnechea/, ok:["SCI"]},
      {re:/la legua/, ok:["RSJ"]},
      {re:/blanco y negro/, ok:["CC"]},
      {re:/fortín de liniers|fortin de liniers/, ok:["VEL"]},
      {re:/boedo|el gasómetro|el gasometro/, ok:["SLO"]},
      {re:/el cilindro/, ok:["RAC"]},
      {re:/el bosque/, ok:["ELP"]}
    ];
    for(var i=0;i<extra.length;i++){
      if(extra[i].re.test(blob) && extra[i].ok.indexOf(club)<0) return false;
    }
    return true;
  };
  decisionCabeEnClub._r801=true;
})();

/* Arcos de Segunda: el «por qué juego a esto» en capítulos. */
const ARCOS_801={
  SMO:[{id:"smo_pintana",t:"El chaguito en Segunda",desc:"Morning bajó. La Pintana, Paredes en el banco, pelea por volver a la B. No es 1991 ni Macul.",
    capitulos:[
      {id:"smo_1",t:"Tamaño real",ctx:"La camiseta tiene pasado de Primera. El presente es Segunda, zona Sur, Municipal de La Pintana.",
       ops:[{t:"Hablar claro: primero la B",d:"Honesto.",grupos:{socios:8,directorio:6,hinchada:-4},mem:"le dijiste a Morning la verdad: primero la B",va:"smo_2"},
            {t:"Vender la camiseta grande",d:"Nostalgia.",ef:{plata:30},grupos:{sponsors:8,camarin:-6},mem:"vendiste la historia de Morning en Segunda",va:"smo_2"}]},
      {id:"smo_2",t:"La Pintana de domingo",ctx:"¿Se llena con precio de pueblo o se cobra como si fuera Santa Laura?",
       ops:[{t:"Precio de pueblo y llenar",d:"Caja chica, ruido.",ef:{plata:-12},grupos:{hinchada:12,comunidad:10},mem:"llenaste La Pintana con precio de pueblo",cierra:true},
            {t:"Cobrar de más",d:"Huecos.",ef:{plata:20},grupos:{sponsors:6,hinchada:-8},mem:"cobraste de más en La Pintana",cierra:true}]}
    ]}],
  LSC:[{id:"lsc_carbon",t:"La cuenca es la bandera",desc:"Lota Schwager vuelve. El carbón no se disfraza.",
    capitulos:[
      {id:"lsc_1",t:"Mina o vitrina",ctx:"Un aporte de afuera quiere limpiar la imagen de cuenca.",
       ops:[{t:"Quedarse carbón",d:"Identidad dura.",grupos:{comunidad:14,hinchada:8,sponsors:-6},mem:"dejaste a Lota oliendo a su cuenca",cierra:true,logro:"de_la_comunidad"},
            {t:"Abrir la marca Biobío",d:"Plata, recelo.",ef:{plata:40},grupos:{sponsors:8,comunidad:-8},mem:"abriste Lota como marca del Biobío",cierra:true}]}
    ]}],
  OSO:[{id:"oso_peralta",t:"El sur no es turismo",desc:"Osorno tiene estadio grande para la categoría. Si no se llena, la foto duele.",
    capitulos:[
      {id:"oso_1",t:"¿Fortín o recinto vacío?",ctx:"11 mil asientos en Segunda. Precio de pueblo o huecos.",
       ops:[{t:"Llenar el Peralta",d:"Caja chica.",ef:{plata:-20},grupos:{hinchada:12,comunidad:10},mem:"llenaste el Peralta con precio de Osorno",cierra:true},
            {t:"Cobrar como Primera",d:"Foto vacía.",ef:{plata:30},grupos:{sponsors:6,hinchada:-8},mem:"cobraste el Peralta como si fuera Primera",cierra:true}]}
    ]}],
  LIN:[{id:"lin_linares",t:"Linares no es Talca",desc:"El albirrojo del Maule pide club de ciudad.",
    capitulos:[
      {id:"lin_1",t:"Ciudad o puente",ctx:"Talca queda cerca. Linares no quiere ser escala.",
       ops:[{t:"Sello de Linares",d:"Casa.",grupos:{comunidad:12,hinchada:8},mem:"le diste a Linares un sello propio",cierra:true},
            {t:"Traer un nombre de la B",d:"Ilusión.",ef:{plata:-35},grupos:{prensa:6,comunidad:-4},mem:"apostaste un nombre para que Linares salte",cierra:true}]}
    ]}],
  CLC:[{id:"clc_valle",t:"El valle no es vitrina",desc:"Colchagua de San Fernando. Pueblo, no marca de vino disfrazada.",
    capitulos:[
      {id:"clc_1",t:"Valle o marca",ctx:"Hablan de «Colchagua» como si fuera turismo.",
       ops:[{t:"Quedarse San Fernando",d:"Pueblo.",grupos:{comunidad:12,hinchada:8,sponsors:-4},mem:"dejaste Colchagua en San Fernando",cierra:true,logro:"de_la_comunidad"},
            {t:"Abrir la marca",d:"Plata.",ef:{plata:30},grupos:{sponsors:8,comunidad:-8},mem:"abriste Colchagua como marca de valle",cierra:true}]}
    ]}],
  TRA:[{id:"tra_andes",t:"La cordillera es el rival",desc:"Trasandino vive del paso y del viento.",
    capitulos:[
      {id:"tra_1",t:"Casa o centro",ctx:"El viaje cansa. También es el arma.",
       ops:[{t:"Hacer de Los Andes un arma",d:"Puntos feos.",grupos:{hinchada:10,camarin:6},mem:"hiciste de Los Andes un arma",cierra:true},
            {t:"Pedir fechas abajo",d:"Cómodo.",ef:{plata:25},grupos:{sponsors:6,comunidad:-8},mem:"sacaste a Trasandino de su casa por comodidad",cierra:true}]}
    ]}],
  OVA:[{id:"ova_limari",t:"El Ciclón escribe el profesionalismo",desc:"Ovalle no cobra vitrina: la está construyendo.",
    capitulos:[
      {id:"ova_1",t:"Piso o salto",ctx:"Tercera A 2023 quedó atrás. Ahora toca no volver.",
       ops:[{t:"Construir piso",d:"Serio.",grupos:{camarin:8,socios:8},mem:"le diste piso a Ovalle en Segunda",cierra:true},
            {t:"Todo al salto",d:"Heroico.",grupos:{hinchada:10,directorio:-4},mem:"apostaste el salto de Ovalle ya",cierra:true}]}
    ]}],
  CNA:[{id:"cna_concon",t:"Concón no hereda a nadie",desc:"1914 en el litoral. Sin pasado de Primera. Se escribe ahora.",
    capitulos:[
      {id:"cna_1",t:"Relato propio",ctx:"No hay 1991 que poner en el mural.",
       ops:[{t:"Aceptar que se está partiendo",d:"Honesto.",grupos:{socios:8,comunidad:8},mem:"le dijiste a Concón que el relato empieza ahora",cierra:true},
            {t:"Pedirle que se crea grande",d:"Frágil.",grupos:{hinchada:8,directorio:-4},mem:"le pediste a Concón que se crea grande ya",cierra:true}]}
    ]}],
  GVE:[{id:"gve_secano",t:"San Vicente no es Rancagua",desc:"Los Verdes del secano. 1908. Pueblo.",
    capitulos:[
      {id:"gve_1",t:"Pueblo o puente",ctx:"O'Higgins queda cerca en el mapa y lejos en el alma.",
       ops:[{t:"El club es de San Vicente",d:"Casa.",grupos:{comunidad:12,hinchada:8},mem:"dejaste a Velásquez en San Vicente",cierra:true,logro:"de_la_comunidad"},
            {t:"Acercarse a Rancagua",d:"Visibilidad.",ef:{plata:28},grupos:{sponsors:6,comunidad:-8},mem:"acercaste a Velásquez a Rancagua",cierra:true}]}
    ]}],
  REN:[{id:"ren_rengo",t:"Primero, sobrevivir",desc:"Rengo. Oro y Cielo. Caja de Segunda de verdad.",
    capitulos:[
      {id:"ren_1",t:"Austeridad o ilusión",ctx:"Un refuerzo de la B vale un mes de sueldos.",
       ops:[{t:"Austeridad y quedarse",d:"Sano.",ef:{plata:20},grupos:{directorio:8,hinchada:-4},mem:"cuidaste la caja de Rengo",cierra:true},
            {t:"Apostar un nombre",d:"Ilusión.",ef:{plata:-30},grupos:{hinchada:8,directorio:-6},mem:"apostaste un nombre en Rengo",cierra:true}]}
    ]}],
  COL:[{id:"col_chacabuco",t:"Colina no es sucursal",desc:"Campeón de Tercera A 2025. Comuna al norte de Santiago.",
    capitulos:[
      {id:"col_1",t:"Comuna o capital",ctx:"Un grande de Santiago ofrece juveniles.",
       ops:[{t:"Club de Colina",d:"Casa.",grupos:{comunidad:12,hinchada:8,sponsors:-4},mem:"dejaste a Colina en su comuna",cierra:true},
            {t:"Aceptar el puente",d:"Cheque.",ef:{plata:35},grupos:{directorio:8,comunidad:-10},mem:"aceptaste que Colina sea puente de un grande",cierra:true}]}
    ]}],
  BSA:[{id:"bsa_salamanca",t:"Las brujas del Choapa",desc:"Pueblo, caja de pueblo. No hay vitrina.",
    capitulos:[
      {id:"bsa_1",t:"Pueblo o minería",ctx:"Un sponsor del valle quiere el nombre.",
       ops:[{t:"El club es de Salamanca",d:"Bandera.",grupos:{comunidad:14,hinchada:8},mem:"dejaste Salamanca en su pueblo",cierra:true,logro:"de_la_comunidad"},
            {t:"Aceptar el sponsor",d:"Plata.",ef:{plata:32},grupos:{sponsors:8,comunidad:-6},mem:"le pusiste un sponsor minero a Salamanca",cierra:true}]}
    ]}],
  RSJ:[{id:"rsj_escuela",t:"Escuela, no grande disfrazado",desc:"La Legua. Cadetes. Poco aforo.",
    capitulos:[
      {id:"rsj_1",t:"Formar o no sufrir",ctx:"La tabla de Segunda no espera a los pibes.",
       ops:[{t:"Cadetes aunque duela",d:"Sello.",grupos:{comunidad:10,directorio:-4},mem:"priorizaste los cadetes de San Joaquín",cierra:true},
            {t:"Dos veteranos",d:"Oficio.",ef:{plata:-28},grupos:{camarin:8,comunidad:-6},mem:"fichaste veteranos en San Joaquín para no sufrir",cierra:true}]}
    ]}],
  SCI:[{id:"sci_city",t:"Sin 1991 que heredar",desc:"Santiago City. Lo Barnechea. Proyecto joven. Negro y rosa.",
    capitulos:[
      {id:"sci_1",t:"Relato propio",ctx:"No hay estrella que poner en el mural.",
       ops:[{t:"Escribir el propio",d:"Honesto.",grupos:{socios:8,comunidad:6},mem:"le dijiste a Santiago City que el relato empieza ahora",cierra:true},
            {t:"Pedirle que se crea grande",d:"Marketing.",ef:{plata:20},grupos:{sponsors:8,hinchada:-4},mem:"le pediste a Santiago City que se crea grande ya",cierra:true}]}
    ]}]
};
(function mergeArcos801(){
  if(typeof ARCOS_EQUIPO!=="object") return;
  Object.keys(ARCOS_801).forEach(function(k){
    if(!ARCOS_EQUIPO[k]) ARCOS_EQUIPO[k]=ARCOS_801[k];
  });
})();

/* Sectores con nombre de tribuna (no «Popular» genérico) para B.
   Nombres geográficos de recinto, no apodos de barra inventados. */
(function estadios801(){
  if(typeof ESTADIOS_DATA!=="object") return;
  function set(id, nombre, aforo, sectores){
    var cur=ESTADIOS_DATA[id]||{};
    if(nombre) cur.nombre=cur.nombre||nombre;
    if(aforo && !cur.aforo) cur.aforo=aforo;
    if(sectores && (!cur.sectores || cur.aproximado)){
      cur.sectores=sectores;
      cur.aproximado=true;
    }
    ESTADIOS_DATA[id]=cur;
  }
  set("SW","Estadio Elías Figueroa Brander",20575,[
    {n:"Galería Playa Ancha",tipo:"popular",cuota:0.30,precio:7000},
    {n:"Tribuna Andes",tipo:"tribuna",cuota:0.28,precio:14000},
    {n:"Tribuna Pacífico",tipo:"tribuna",cuota:0.24,precio:18000},
    {n:"Palco",tipo:"premium",cuota:0.18,precio:35000}]);
  set("CBL","Estadio Zorros del Desierto",20352,[
    {n:"Galería Calama",tipo:"popular",cuota:0.32,precio:7000},
    {n:"Tribuna Andes",tipo:"tribuna",cuota:0.30,precio:15000},
    {n:"Tribuna Pacífico",tipo:"tribuna",cuota:0.22,precio:18000},
    {n:"Palco",tipo:"premium",cuota:0.16,precio:32000}]);
  set("UES","Estadio Santa Laura",19000,[
    {n:"Galería Sur",tipo:"popular",cuota:0.28,precio:8000},
    {n:"Galería Norte",tipo:"popular",cuota:0.24,precio:8000},
    {n:"Tribuna",tipo:"tribuna",cuota:0.30,precio:16000},
    {n:"Palco Oficial",tipo:"premium",cuota:0.18,precio:32000}]);
  set("ANT","Estadio Regional Calvo y Bascuñán",21178,[
    {n:"Galería",tipo:"popular",cuota:0.32,precio:7000},
    {n:"Tribuna Andes",tipo:"tribuna",cuota:0.30,precio:15000},
    {n:"Tribuna Pacífico",tipo:"tribuna",cuota:0.22,precio:18000},
    {n:"Preferencial",tipo:"premium",cuota:0.16,precio:30000}]);
  set("IQQ","Estadio Tierra de Campeones",13171,[
    {n:"Galería",tipo:"popular",cuota:0.36,precio:6000},
    {n:"Tribuna",tipo:"tribuna",cuota:0.40,precio:13000},
    {n:"Preferencial",tipo:"premium",cuota:0.24,precio:26000}]);
  set("SMA","Estadio Carlos Dittborn",14200,[
    {n:"Galería",tipo:"popular",cuota:0.36,precio:6000},
    {n:"Tribuna",tipo:"tribuna",cuota:0.40,precio:13000},
    {n:"Preferencial",tipo:"premium",cuota:0.24,precio:25000}]);
  set("PMO","Estadio Regional de Chinquihue",10000,[
    {n:"Galería",tipo:"popular",cuota:0.38,precio:5000},
    {n:"Tribuna",tipo:"tribuna",cuota:0.40,precio:11000},
    {n:"Preferencial",tipo:"premium",cuota:0.22,precio:22000}]);
  set("TEM","Estadio Germán Becker",18413,[
    {n:"Galería Norte",tipo:"popular",cuota:0.30,precio:6000},
    {n:"Galería Sur",tipo:"popular",cuota:0.24,precio:6000},
    {n:"Tribuna",tipo:"tribuna",cuota:0.28,precio:14000},
    {n:"Marquesina",tipo:"premium",cuota:0.18,precio:28000}]);
  set("CUR","Estadio La Granja",8278,[
    {n:"Galería",tipo:"popular",cuota:0.38,precio:5000},
    {n:"Tribuna",tipo:"tribuna",cuota:0.40,precio:11000},
    {n:"Preferencial",tipo:"premium",cuota:0.22,precio:22000}]);
  set("RAN","Estadio Fiscal de Talca",8234,[
    {n:"Galería",tipo:"popular",cuota:0.38,precio:5000},
    {n:"Tribuna",tipo:"tribuna",cuota:0.40,precio:11000},
    {n:"Preferencial",tipo:"premium",cuota:0.22,precio:22000}]);
  set("MAG","Estadio Luis Navarro Avilés",3500,[
    {n:"Popular",tipo:"popular",cuota:0.45,precio:5000},
    {n:"Tribuna",tipo:"tribuna",cuota:0.40,precio:10000},
    {n:"Preferencial",tipo:"premium",cuota:0.15,precio:20000}]);
  set("SMO","Estadio Municipal de La Pintana",5000,[
    {n:"Popular",tipo:"popular",cuota:0.45,precio:4000},
    {n:"Tribuna",tipo:"tribuna",cuota:0.40,precio:8000},
    {n:"Preferencial",tipo:"premium",cuota:0.15,precio:16000}]);
})();
