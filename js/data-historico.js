"use strict";
/* ============================================================
   FUTBOLINI 7.44 · data-historico.js
   GROK_PROMPT_HISTORIAS ejecutado. Cargar ÚLTIMO (después de data-36.js).
   Épocas + línea de tiempo real + escenarios futuros + arcos que faltaban + voz.
   Nombres reales OK; stats estimadas; NUNCA citas inventadas.
   Planteles de épocas nuevas: si no hay documentado, armarPlantel rellena cantera.
   ============================================================ */

/* ---------- A.2 · línea de tiempo (hechos públicos) ---------- */
var HISTORIA_LINEA={
  CC:[
    {anio:1925,hito:"Fundación",txt:"19 de abril de 1925, Estadio El Llano (San Miguel). Escisión de Magallanes: «Ancha es la puerta». David Arellano capitán."},
    {anio:1973,hito:"El Monumental",txt:"Se inaugura el estadio en Macul. La casa propia marca la escala del club."},
    {anio:1989,hito:"Reconstrucción",txt:"Tras años duros, arranca el ciclo que termina en la Libertadores."},
    {anio:1991,hito:"Libertadores",txt:"Campeón de América: 3-0 a Olimpia en el Monumental el 5 de junio. Tricampeón local."},
    {anio:2006,hito:"SAD",txt:"Pasa a sociedad anónima. La concesionaria y la hinchada no siempre tiran para el mismo lado."},
    {anio:2026,hito:"Hoy",txt:"Sigue siendo el más grande en masa. El entorno no acepta media tabla; la deuda ronda."}
  ],
  UCH:[
    {anio:1927,hito:"Fundación",txt:"Nace ligada a la Universidad de Chile. Azul, cantera y una hinchada que se cree pueblo."},
    {anio:1969,hito:"Ballet azul",txt:"Una de las mejores versiones de la historia: fútbol de toque y títulos."},
    {anio:1988,hito:"Descenso",txt:"Cae a Segunda. Herida que la gente no olvida."},
    {anio:2011,hito:"Sudamericana",txt:"Campeón invicto de la Copa Sudamericana con Sampaoli. Presión alta y cantera."},
    {anio:2026,hito:"Hoy",txt:"Sigue sin estadio propio: local en el Nacional. Masa enorme, caja que no acompaña."}
  ],
  UC:[
    {anio:1937,hito:"Fundación",txt:"Nace en la Universidad Católica. Orden, cantera y menos masa que los otros dos grandes."},
    {anio:1997,hito:"San Carlos",txt:"El estadio propio es sello: cuentas y casa, no arriendo eterno."},
    {anio:2019,hito:"Nacional",txt:"Campeón 2019. Base del tetra 2018-2021 con Quinteros y una camada ganadora."},
    {anio:2025,hito:"Claro Arena",txt:"Se estrena el nuevo estadio (ex San Carlos). La casa cambia de nombre, no de barrio."},
    {anio:2026,hito:"Hoy",txt:"Administración ordenada, cantera fuerte, hinchada más chica que Colo y la U."}
  ],
  PAL:[
    {anio:1920,hito:"Fundación",txt:"Club de la colonia palestina en Santiago. Identidad pública, no disfraz."},
    {anio:1978,hito:"Estrella",txt:"Campeón nacional. Figueroa de eje, Fabbiani goleador, racha larga de invicto."},
    {anio:1991,hito:"Media tabla",txt:"Municipal de La Cisterna, caja justa, sin el brillo de los 70."},
    {anio:2026,hito:"Hoy",txt:"La Cisterna chica, competitivo con presupuesto acotado. Formación propia."}
  ],
  LIM:[
    {anio:2010,hito:"Fundación",txt:"Club joven de Limache. Pueblo, no marca de capital."},
    {anio:2025,hito:"Ascenso",txt:"Sube a Primera. El objetivo del 2026 es no volver a bajar."},
    {anio:2026,hito:"Hoy",txt:"Localía en el Ángel Navarrete Candia (3.000, municipal). El Lucio Fariña es de San Luis de Quillota."}
  ],
  EVE:[
    {anio:1909,hito:"Fundación",txt:"Everton de Viña del Mar. Nombre inglés, club de puerto y veraneo."},
    {anio:1950,hito:"Estrellas tempranas",txt:"Títulos en la primera mitad del siglo. Historia más grande que la tabla de algunos años."},
    {anio:2008,hito:"Apertura",txt:"Campeón del Apertura 2008 en Sausalito, con Nelson Acosta."},
    {anio:2026,hito:"Hoy",txt:"Cuando se acaba el verano el estadio se vacía. Pelea en Primera con plantel mixto."}
  ],
  COQ:[
    {anio:1958,hito:"Fundación",txt:"Coquimbo Unido. Puerto, pecho y un club que vivió años de comparsa."},
    {anio:1991,hito:"Subcampeón",txt:"La mejor campaña clásica: casi le saca el tricampeonato a Colo-Colo."},
    {anio:2025,hito:"Primera estrella",txt:"Campeón de la Liga de Primera. Histórico en 67 años."},
    {anio:2026,hito:"Hoy",txt:"El título todavía no acomoda. El norte no perdona si se afloja."}
  ],
  AUD:[
    {anio:1910,hito:"Fundación",txt:"Audax Italiano. Colonia, La Florida, camiseta verde."},
    {anio:1936,hito:"Títulos pioneros",txt:"Grandeza temprana del amateurismo/profesionalismo inicial."},
    {anio:2026,hito:"Hoy",txt:"Tabla del medio. Club de barrio que a veces se ilusiona de más."}
  ],
  HUA:[
    {anio:1947,hito:"Fundación",txt:"Huachipato nace con el acero de Talcahuano. Club de trabajadores y cantera."},
    {anio:1974,hito:"Primera estrella",txt:"Campeón nacional. El CAP no es adorno."},
    {anio:2012,hito:"Clausura",txt:"Campeón del Clausura 2012 con Pellicer. Final a penales ante Unión Española."},
    {anio:2023,hito:"Tercera estrella",txt:"Campeón 2023 con Gustavo Álvarez. Última fecha en el CAP."},
    {anio:2026,hito:"Hoy",txt:"Forma, vende y pelea. El modelo del acero sigue."}
  ],
  OHI:[
    {anio:1955,hito:"Fundación",txt:"O'Higgins de Rancagua. Cobre, El Teniente, ganas de no ser sucursal."},
    {anio:2013,hito:"Primera estrella",txt:"Campeón del Apertura 2013 con Berizzo. Calandria y Hernández."},
    {anio:2026,hito:"Hoy",txt:"Rancagua pide un equipo de región, no un puente a Santiago."}
  ],
  NUB:[
    {anio:1916,hito:"Fundación",txt:"Ñublense es Chillán: frío, región, poca vitrina."},
    {anio:2022,hito:"Subcampeón",txt:"Subcampeón 2022 y fase de grupos de Libertadores. La mejor versión moderna."},
    {anio:2026,hito:"Hoy",txt:"El Oyarzún lleno duele. Quedarse en Primera con dignidad."}
  ],
  COB:[
    {anio:1979,hito:"Fundación",txt:"Cobresal nace en El Salvador. Altura, viaje eterno, pueblo minero. No es Cobreloa."},
    {anio:2015,hito:"Milagro",txt:"Campeón del Clausura 2015 con Giovagnoli. Primer título, entre aluviones y El Cobre."},
    {anio:2026,hito:"Hoy",txt:"Localía brava, caja justa. Llegar y quedarse es el partido de la semana."}
  ],
  CAL:[
    {anio:1954,hito:"Fundación",txt:"Unión La Calera. Pueblo chico, estadio chico, puntos feos."},
    {anio:2018,hito:"Animador",txt:"Pelea arriba, 6-1 a la U, Sudamericana. Brian Fernández en llamas."},
    {anio:2026,hito:"Hoy",txt:"Saca puntos o se hunde sin ruido. No es vitrina."}
  ],
  LSE:[
    {anio:1955,hito:"Fundación",txt:"Deportes La Serena. La Portada es postal; el club, a veces, parece de veraneo."},
    {anio:2019,hito:"Vuelta",txt:"Retorno consolidado a Primera."},
    {anio:2026,hito:"Hoy",txt:"Yo-yo de categoría. La gente pide que deje de ser solo verano."}
  ],
  DCO:[
    {anio:1916,hito:"Fundación",txt:"Deportes Concepción. El León, Collao, historia de región."},
    {anio:1991,hito:"Primera",txt:"Media tabla, plantel de región que incomodaba."},
    {anio:2026,hito:"Hoy",txt:"Volvió a Primera. Historia, gente y miedo a caer otra vez."}
  ],
  UDC:[
    {anio:1994,hito:"Fundación",txt:"Universidad de Concepción. El Campanil nace de una universidad."},
    {anio:2018,hito:"Subcampeón",txt:"58 puntos, a un paso de la UC, Libertadores al año."},
    {anio:2026,hito:"Hoy",txt:"Cantera, un regreso que todavía se acomoda."}
  ],
  CBL:[
    {anio:1977,hito:"Fundación",txt:"Cobreloa nace en Calama. Naranja, desierto, ambición de grande."},
    {anio:1981,hito:"Libertadores",txt:"Finalista de América. El norte se creyó grande de verdad."},
    {anio:2003,hito:"Bicampeón",txt:"Apertura y Clausura. Último ciclo de título grande."},
    {anio:2024,hito:"Descenso",txt:"Cae a la B. La hinchada no acepta eternizarse abajo."},
    {anio:2026,hito:"Hoy",txt:"Pelea el ascenso desde el Zorros del Desierto con César Bravo."}
  ],
  SW:[
    {anio:1892,hito:"Fundación",txt:"Santiago Wanderers. El decano de Chile, Valparaíso, Playa Ancha."},
    {anio:1968,hito:"Estrella",txt:"Campeón nacional. Historia más grande que varias tablas recientes."},
    {anio:1991,hito:"Descenso",txt:"Último del Nacional 1991, bajó con Osorno."},
    {anio:2026,hito:"Hoy",txt:"Años en la B. Palladino, urgencia de volver a Primera."}
  ],
  SLQ:[
    {anio:1980,hito:"Fundación",txt:"San Luis de Quillota. Yo-yo entre Primera y la B, pueblo del Aconcagua."},
    {anio:2015,hito:"Primera",txt:"Ciclo en honor. No se consolidó."},
    {anio:2026,hito:"Hoy",txt:"B, Lucio Fariña compartido a veces, pelea de ascenso de pueblo."}
  ],
  ANT:[
    {anio:1966,hito:"Fundación",txt:"Deportes Antofagasta. El puma, calor, distancia."},
    {anio:1991,hito:"Primera",txt:"Media tabla. El Regional ya pesaba."},
    {anio:2026,hito:"Hoy",txt:"Pelea de ascenso. Odia que lo traten de sucursal minera."}
  ],
  MAG:[
    {anio:1897,hito:"Fundación",txt:"Magallanes. El más antiguo de Chile. Hoy juega en San Bernardo."},
    {anio:1930,hito:"Pionero",txt:"Títulos del profesionalismo inicial. Historia enorme, caja chica."},
    {anio:2023,hito:"Primera breve",txt:"Volvió a honor y no se quedó. El más antiguo, presupuesto de B."},
    {anio:2026,hito:"Hoy",txt:"San Bernardo, mancha carabelera, pelea de ascenso."}
  ],
  UES:[
    {anio:1897,hito:"Fundación",txt:"Unión Española. Colonia hispana, Santa Laura."},
    {anio:2005,hito:"Apertura",txt:"Campeón del Apertura 2005. Uno de los saltos modernos."},
    {anio:2025,hito:"Descenso",txt:"Bajó. El 2026 es para no eternizarse en la B."},
    {anio:2026,hito:"Hoy",txt:"Santa Laura, Ronald Fuentes, colonia que se cree grande cuando la tabla no acompaña."}
  ],
  REC:[
    {anio:2014,hito:"Fundación",txt:"Deportes Recoleta. Club joven de barrio, estadio chico, gente cerca."},
    {anio:2021,hito:"Ascenso a la B",txt:"Llegar a la profesional ya es un título para el pueblo."},
    {anio:2026,hito:"Hoy",txt:"Sobrevivir en la B sin volverse marca neutra."}
  ],
  PMO:[
    {anio:1983,hito:"Fundación",txt:"Puerto Montt. El Velero, Chinquihue, lluvia, el sur lejos."},
    {anio:2025,hito:"Ascenso a la B",txt:"Volvió. Ilusión de pueblo, caja que no da para soñar en voz alta."},
    {anio:2026,hito:"Hoy",txt:"El viaje cansa al rival. Quedarse es el plan."}
  ],
  SMA:[
    {anio:1978,hito:"Fundación",txt:"San Marcos de Arica. El norte extremo, Carlos Dittborn."},
    {anio:2014,hito:"Primera",txt:"Ciclo en honor. La distancia es arma y cárcel."},
    {anio:2026,hito:"Hoy",txt:"B otra vez. Arica pide que no sea turismo de un verano."}
  ],
  COP:[
    {anio:1999,hito:"Fundación",txt:"Deportes Copiapó. Atacama, calor, club de región reciente en el profesionalismo grande."},
    {anio:2023,hito:"Primera",txt:"Llegó a honor. No se quedó."},
    {anio:2026,hito:"Hoy",txt:"B. El norte chico no es postal: es viaje y polvo."}
  ],
  TEM:[
    {anio:1960,hito:"Fundación",txt:"Deportes Temuco (y sus refundaciones). La Araucanía, frío, Germán Becker."},
    {anio:2001,hito:"Primera",txt:"Últimos ciclos de honor del siglo. Después, yo-yo y crisis."},
    {anio:2026,hito:"Hoy",txt:"B con Astorga. El sur pide continuidad, no otro reinicio."}
  ],
  IQQ:[
    {anio:1978,hito:"Fundación",txt:"Deportes Iquique. Dragones, Tierra de Campeones, desierto costero."},
    {anio:2014,hito:"Copa Chile",txt:"Campeón de Copa Chile. El título más recordado de la era moderna."},
    {anio:2025,hito:"Descenso",txt:"Bajó. Volver es la única meta que la gente acepta."},
    {anio:2026,hito:"Hoy",txt:"Hernán Peña, Tierra de Campeones, urgencia."}
  ],
  USF:[
    {anio:1956,hito:"Fundación",txt:"Unión San Felipe. Aconcagua, pueblo, Municipal."},
    {anio:2009,hito:"Copa Chile y Clausura",txt:"Doble salto: copa y título de Clausura. El año más grande del uni-uni."},
    {anio:2026,hito:"Hoy",txt:"B. Juan José Luvera. El pueblo pide no vivir de 2009."}
  ],
  CUR:[
    {anio:1973,hito:"Fundación",txt:"Curicó Unido. Maule, La Granja, albos de provincia."},
    {anio:2017,hito:"Primera",txt:"El primer ciclo largo en honor. Se fue después de varios años."},
    {anio:2026,hito:"Hoy",txt:"B. Volver sin quemar la caja."}
  ],
  SCR:[
    {anio:1913,hito:"Fundación",txt:"Deportes Santa Cruz. Colchagua, pueblo, club chico de verdad."},
    {anio:2019,hito:"B estable",txt:"Se afirmó en la profesional. No es vitrina."},
    {anio:2026,hito:"Hoy",txt:"Dalcio Giovagnoli. El pueblo cabe en el estadio; el presupuesto, no."}
  ],
  RAN:[
    {anio:1902,hito:"Fundación",txt:"Rangers de Talca. El piducano, Fiscal, yo-yo eterno."},
    {anio:1969,hito:"Subcampeón",txt:"Cerca del título nacional. Memoria de grandeza provincial."},
    {anio:2026,hito:"Hoy",txt:"B. Talca pide un equipo de ciudad, no un puente a Santiago."}
  ],
  SMO:[
    {anio:1909,hito:"Fundación",txt:"Santiago Morning nace el 16 de agosto de 1909. El chaguito, bohemio de Santiago."},
    {anio:2005,hito:"Primera",txt:"Ciclos en honor. Camiseta con pasado grande; el presente no siempre acompaña."},
    {anio:2025,hito:"Descenso",txt:"Baja de la B a Segunda. El TAS confirmó el descuento de puntos que definió la tabla."},
    {anio:2026,hito:"Hoy",txt:"Segunda, zona Sur, Municipal de La Pintana. Esteban Paredes en el banco. Pelea por volver a la B."}
  ],
  LSC:[
    {anio:1966,hito:"Fundación",txt:"Lota Schwager nace de la fusión minera en la cuenca del carbón (Coronel)."},
    {anio:2026,hito:"Hoy",txt:"Vuelve al profesionalismo. Estadio Federico Schwager. La cuenca lo siente como bandera."}
  ],
  OSO:[
    {anio:1983,hito:"Fundación",txt:"Provincial Osorno. El toro del sur. Estuvo en Primera: el Campeonato Nacional 1991 lo tiene en la tabla."},
    {anio:1991,hito:"Primera",txt:"Jugó el Nacional 1991 (19 pts, descendió junto a Wanderers). Hecho de tabla, no de leyenda."},
    {anio:2026,hito:"Hoy",txt:"Segunda, zona Sur. Rubén Marcos Peralta (~12.000). Estadio grande para la categoría."}
  ],
  LIN:[
    {anio:2026,hito:"Hoy",txt:"Deportes Linares, albirrojo del Maule. Fiscal Tucapel Bustamante. Zona Sur, pelea el salto a la B."}
  ],
  CLC:[
    {anio:2026,hito:"Hoy",txt:"Colchagua de San Fernando. Estadio Jorge Silva. Volvió al profesionalismo. Valle de Colchagua, no vitrina."}
  ],
  TRA:[
    {anio:1906,hito:"Fundación",txt:"Trasandino de Los Andes. Club de cordillera, cerca del paso a Argentina."},
    {anio:2026,hito:"Hoy",txt:"Segunda, zona Norte. Regional de Los Andes. Pelea el ascenso a la B."}
  ],
  COL:[
    {anio:2025,hito:"Ascenso",txt:"Atlético Colina campeón de Tercera A: vuelve al profesionalismo."},
    {anio:2026,hito:"Hoy",txt:"Zona Norte. Municipal de Colina. Comuna al norte de Santiago, club en crecimiento."}
  ],
  OVA:[
    {anio:2026,hito:"Hoy",txt:"Provincial Ovalle, Limarí, Cuarta Región. Estadio Diaguita. Zona Norte."}
  ],
  CNA:[
    {anio:2026,hito:"Hoy",txt:"Concón National. Club joven del litoral. Sin pasado en divisiones mayores: escribe el propio."}
  ],
  BSA:[
    {anio:2026,hito:"Hoy",txt:"Brujas de Salamanca, Choapa. Identidad de pueblo. Zona Norte."}
  ],
  RSJ:[
    {anio:2026,hito:"Hoy",txt:"Real San Joaquín. Club-escuela de Santiago, formador. Poco aforo, muchos cadetes."}
  ],
  SCI:[
    {anio:2026,hito:"Hoy",txt:"Santiago City. Municipal de Lo Barnechea. Proyecto joven de la capital. Sin historia en categorías mayores."}
  ],
  GVE:[
    {anio:2026,hito:"Hoy",txt:"General Velásquez de San Vicente de Tagua Tagua. Augusto Rodríguez. Club de pueblo del secano. Zona Sur."}
  ],
  REN:[
    {anio:2026,hito:"Hoy",txt:"Deportes Rengo, valle de Cachapoal. Municipal Guillermo Guzmán Díaz. Primero, sobrevivir."}
  ]
};

/* ---------- A.1 · épocas jugables que faltaban (sin inventar planteles) ---------- */
var EPOCAS_EXTRA={
  LIM:[{anio:2025,etq:"2025 · El ascenso",desc:"Limache sube a Primera. Pueblo, plantel corto, el objetivo es no volver a bajar.",
    dt:"Víctor Rivero",ind:{plantel:62,moral:78,hinchada:70,socios:42,cantera:48,estadio:50,prestigio:48,riesgo:38},caja:{plata:180,deuda:80}}],
  CBL:[{anio:2003,etq:"2003 · Bicampeón",desc:"Cobreloa campeón de Apertura y Clausura. Último ciclo de título grande en Calama. (Plantel: el juego rellena; no se inventan nombres.)",
    dt:"Luis Musrri",ind:{plantel:84,moral:86,hinchada:88,socios:60,cantera:55,estadio:70,prestigio:86,riesgo:18},caja:{plata:420,deuda:160}}],
  SW:[{anio:2019,etq:"2019 · Vuelta a Primera",desc:"Wanderers en honor. Playa Ancha, decano, la obligación de no ser postal.",
    dt:"el cuerpo técnico",ind:{plantel:68,moral:72,hinchada:76,socios:52,cantera:50,estadio:70,prestigio:64,riesgo:32},caja:{plata:220,deuda:140}}],
  UES:[{anio:2005,etq:"2005 · Apertura",desc:"Unión Española campeón del Apertura. Santa Laura en fiesta.",
    dt:"el cuerpo técnico",ind:{plantel:80,moral:84,hinchada:74,socios:58,cantera:62,estadio:68,prestigio:78,riesgo:20},caja:{plata:340,deuda:120}}],
  IQQ:[{anio:2014,etq:"2014 · Copa Chile",desc:"Iquique campeón de Copa Chile. Tierra de Campeones, el título moderno del dragón.",
    dt:"Jaime Vera",ind:{plantel:74,moral:82,hinchada:80,socios:50,cantera:48,estadio:72,prestigio:72,riesgo:26},caja:{plata:260,deuda:110}}],
  USF:[{anio:2009,etq:"2009 · Copa y Clausura",desc:"San Felipe gana la Copa Chile y el Clausura. El año más grande del uni-uni.",
    dt:"Ivo Basay",ind:{plantel:76,moral:88,hinchada:82,socios:48,cantera:50,estadio:55,prestigio:74,riesgo:24},caja:{plata:200,deuda:70}}],
  MAG:[{anio:2023,etq:"2023 · Primera breve",desc:"El más antiguo vuelve a honor. No se queda. Historia enorme, caja chica.",
    dt:"el cuerpo técnico",ind:{plantel:64,moral:70,hinchada:68,socios:44,cantera:46,estadio:52,prestigio:60,riesgo:36},caja:{plata:160,deuda:90}}],
  CUR:[{anio:2017,etq:"2017 · El salto",desc:"Curicó Unido llega a Primera para quedarse un ciclo. Maule en honor.",
    dt:"Luis Marcoleta",ind:{plantel:66,moral:76,hinchada:74,socios:46,cantera:48,estadio:58,prestigio:56,riesgo:34},caja:{plata:180,deuda:100}}],
  ANT:[{anio:2018,etq:"2018 · Primera norte",desc:"Antofagasta en honor. Distancia, calor, el puma no quiere ser sucursal.",
    dt:"el cuerpo técnico",ind:{plantel:68,moral:70,hinchada:66,socios:48,cantera:44,estadio:62,prestigio:58,riesgo:30},caja:{plata:210,deuda:120}}]
};

/* ---------- A.3 · escenarios FUTUROS (no son hechos) ---------- */
var ESCENARIOS_FUTURO=[
  {era:"cercano",t:"VAR con IA",txt:"El arbitraje ahora lo asiste una máquina. La hinchada desconfía más que antes.",ef:{riesgo:3},grupos:{anfp:-4,prensa:6}},
  {era:"cercano",t:"Noches por el calor",txt:"Los partidos de verano se van a las 22:00. El agua en el estadio se raciona.",grupos:{hinchada:-4,comunidad:4}},
  {era:"cercano",t:"Se acaba el cable",txt:"La TV abierta pierde la pelota. Todo es streaming: socios sí, abuela no.",ef:{plata:-40},grupos:{sponsors:-6,socios:6}},
  {era:"cercano",t:"Tope de sueldos ANFP",txt:"Imponen un techo. Los grandes gritan; los chicos respiran.",grupos:{anfp:8,directorio:-6}},
  {era:"cercano",t:"DT mujer, nadie se asombra",txt:"Deja de ser noticia. El camarín ya no hace chiste.",grupos:{prensa:4,camarin:2}},
  {era:"cercano",t:"Hinchada híbrida",txt:"La mitad del estadio es holograma pagado. La popular odia el silencio.",grupos:{hinchada:-8,sponsors:8}},
  {era:"cercano",t:"Viajes en hidrógeno",txt:"Los buses del plantel cambian de motor. Llegan tarde igual.",ef:{plata:-15}},
  {era:"cercano",t:"Clásico con detector",txt:"Prohíben bengalas con sensores. La barra se inventa otra cosa.",grupos:{anfp:6,hinchada:-5}},
  {era:"cercano",t:"Agua en el césped",txt:"Regar de día es multa. Se juega en pasto más seco, más feo.",grupos:{comunidad:4}},
  {era:"cercano",t:"Cantera con chip",txt:"Los cadetes firman con reloj de carga. Los papás discuten el contrato a los 14.",grupos:{directorio:4,comunidad:-6}},
  {era:"medio",t:"Estadio flotante",txt:"Valparaíso prueba una cancha sobre pontones. El mar gana un córner.",ef:{prestigio:4},grupos:{sponsors:8}},
  {era:"medio",t:"Fusión del desierto",txt:"Hablan de juntar clubes mineros. Calama y El Salvador no se saludan.",grupos:{comunidad:-10,directorio:6}},
  {era:"medio",t:"Los Andes cerrados",txt:"El paso a Argentina se corta por el clima. Se acabó el refuerzo exprés.",ef:{plata:-25},grupos:{camarin:-4}},
  {era:"medio",t:"Socios en cripto",txt:"La cuota se paga en una moneda que nadie entiende. El tesorero reza.",ef:{plata:30,riesgo:8}},
  {era:"medio",t:"Clon de cantera",txt:"Aparece un juvenil «idéntico» a un ídolo. La ANFP no sabe si es legal.",grupos:{anfp:-8,prensa:10}},
  {era:"medio",t:"Santiago sin césped",txt:"Los grandes juegan en el norte en verano. La capital se queda sin localía.",grupos:{hinchada:-6}},
  {era:"medio",t:"Liga del Cono Sur",txt:"Hablan de mezclar Chile, Argentina y Bolivia. El clásico nacional se diluye.",grupos:{anfp:4,hinchada:-8}},
  {era:"medio",t:"Barra con sindicato",txt:"Negocian como gremio. El pacto ya no es un café.",ef:{capital:-4},grupos:{hinchada:6,directorio:-6}},
  {era:"medio",t:"Arbitraje remoto",txt:"El silbante está en un galpón de Pudahuel. En la cancha solo hay un tablet.",grupos:{prensa:6,hinchada:-4}},
  {era:"medio",t:"Nieve en el Maule",txt:"Curicó y Talca juegan con calefacción bajo la cancha. Sale caro.",ef:{plata:-35}},
  {era:"lejano",t:"Final orbital",txt:"La CONMEBOL sueña una final en estación. El pasaje lo pone un sponsor marciano.",ef:{prestigio:8},grupos:{sponsors:12,comunidad:-6}},
  {era:"lejano",t:"Patagonia League",txt:"Nace una liga del sur extremo. El viaje es un mes.",grupos:{anfp:4}},
  {era:"lejano",t:"Androides, no",txt:"Prohíben porteros sintéticos. El 1 de carne vuelve a ser ídolo.",grupos:{hinchada:10,anfp:6}},
  {era:"lejano",t:"Agua como moneda",txt:"La cuota de socio incluye litros. El tesorero mide en bidones.",ef:{plata:20}},
  {era:"lejano",t:"Club-ciudad",txt:"El equipo es el gobierno local. El DT firma decretos.",ef:{capital:8},grupos:{directorio:8,comunidad:8}},
  {era:"lejano",t:"Silencio de tribuna",txt:"Prohíben gritar por «salud auditiva». La gente silba con las manos.",grupos:{hinchada:-14}},
  {era:"lejano",t:"Césped de laboratorio",txt:"Ya no hay tierra. La pelota pica igual en Iquique y en Punta Arenas.",grupos:{sponsors:6}},
  {era:"lejano",t:"Memoria implantada",txt:"Venden recuerdos de la Libertadores 91 a quien no estaba. Los viejos se enojan.",grupos:{comunidad:-8,prensa:8}},
  {era:"lejano",t:"El clásico en la luna",txt:"Un amistoso de marketing. Nadie sabe si cuenta.",ef:{plata:90},grupos:{sponsors:14,hinchada:-4}},
  {era:"lejano",t:"Descenso a Marte",txt:"La B se juega en otra gravedad. El chiste se acaba cuando toca viajar.",grupos:{directorio:-6}}
];

function eraFuturoDe(anio){
  if(anio<2030) return null;
  if(anio<2050) return "cercano";
  if(anio<2120) return "medio";
  return "lejano";
}
function dispararEscenarioFuturo(){
  if(typeof E==="undefined"||!E) return;
  var era=eraFuturoDe(E.anio);
  if(!era) return;
  if(Math.random()>0.45) return;
  var pool=ESCENARIOS_FUTURO.filter(function(s){ return s.era===era; });
  var ya=E.flags.escenariosFut||[];
  pool=pool.filter(function(s){ return ya.indexOf(s.t)<0; });
  if(!pool.length) return;
  var s=pool[Math.floor(Math.random()*pool.length)];
  ya.push(s.t); E.flags.escenariosFut=ya;
  if(s.ef && typeof aplicarEfectos==="function") aplicarEfectos(s.ef);
  if(s.grupos && typeof aplicarGrupos==="function") aplicarGrupos(s.grupos);
  if(typeof notificar==="function") notificar({t:"El mundo cambió · "+s.t,tipo:"neutro",bandeja:true,
    d:s.txt+" No es un hecho histórico: es un escenario del modo futuro."});
}

/* ---------- B · arcos que faltaban (B 2026) ---------- */
var ARCOS_HIST={
  SLQ:[{id:"slq_quillota",t:"Quillota no es sucursal",desc:"San Luis es pueblo del Aconcagua. El yo-yo cansa.",
    capitulos:[
      {id:"slq_1",t:"Pueblo o puente",ctx:"Un grande quiere usar a San Luis de sucursal. Quillota pide un club propio.",
       ops:[{t:"El club es de Quillota",d:"Identidad. Menos nombres.",grupos:{comunidad:14,hinchada:10,sponsors:-6},mem:"dejaste a San Luis en Quillota",va:"slq_2"},
            {t:"Aceptar el puente",d:"Plata, alma ajena.",ef:{plata:55},grupos:{directorio:8,comunidad:-10},mem:"aceptaste que San Luis sea puente",va:"slq_2"}]},
      {id:"slq_2",t:"El yo-yo",ctx:"Subir y bajar es la biografía. La gente tiene memoria corta y heridas largas.",
       ops:[{t:"Hablar claro: primero afirmarse",d:"Honesto. Poco épico.",grupos:{socios:8,directorio:6,hinchada:-4},mem:"hablaste claro en San Luis: primero afirmarse",cierra:true},
            {t:"Prometer Primera ya",d:"La ciudad se prende.",grupos:{hinchada:12,prensa:6,directorio:-6},mem:"prometiste Primera rápido con San Luis",cierra:true}]}
    ]}],
  SMA:[{id:"sma_arica",t:"Arica no es turismo",desc:"San Marcos vive al final del mapa. El viaje es un arma si no te rinde.",
    capitulos:[
      {id:"sma_1",t:"El Dittborn de semana",ctx:"Cuando llega un grande se llena. El resto, sillas y viento.",
       ops:[{t:"Precios para el que vive acá",d:"Tribuna local.",ef:{plata:-16},grupos:{comunidad:12,hinchada:10},mem:"cuidaste al hincha de Arica",va:"sma_2"},
            {t:"Cobrar la marca frontera",d:"Caja de turismo.",ef:{plata:40},grupos:{sponsors:10,comunidad:-8},mem:"cobraste San Marcos como postal de frontera",va:"sma_2"}]},
      {id:"sma_2",t:"Lejos de todo",ctx:"El rival sufre el viaje. También el plantel.",
       ops:[{t:"Hacer de la distancia un arma",d:"Puntos feos.",grupos:{hinchada:10,camarin:8},mem:"hiciste de Arica un arma",cierra:true},
            {t:"Pedir más fechas en el centro",d:"Cómodo, menos identidad.",grupos:{sponsors:8,comunidad:-10},mem:"sacaste a San Marcos de su casa por comodidad",cierra:true}]}
    ]}],
  COP:[{id:"cop_atacama",t:"Copiapó es polvo y orgullo",desc:"Atacama no es vitrina. El club recién tocó Primera y volvió.",
    capitulos:[
      {id:"cop_1",t:"El año en honor",ctx:"Quedó la foto de Primera. Ahora toca no vivir de ella.",
       ops:[{t:"Construir para volver con piso",d:"Menos fiesta, más predio.",grupos:{camarin:10,socios:8},mem:"construiste Copiapó para volver con piso",va:"cop_2"},
            {t:"Cobrar la nostalgia de Primera",d:"Plata ahora.",ef:{plata:45},grupos:{sponsors:8,camarin:-6},mem:"cobraste la foto de Copiapó en Primera",va:"cop_2"}]},
      {id:"cop_2",t:"El norte chico",ctx:"Calor, viaje, caja chica.",
       ops:[{t:"El club es de Copiapó",d:"Pueblo.",grupos:{comunidad:14,hinchada:8},mem:"afirmaste que Copiapó es de su gente",cierra:true,logro:"de_la_comunidad"},
            {t:"Administrarlo como escala",d:"Sano y frío.",ef:{plata:40},grupos:{directorio:8,comunidad:-10},mem:"trataste a Copiapó como una escala",cierra:true}]}
    ]}],
  TEM:[{id:"tem_araucania",t:"Temuco no es otro reinicio",desc:"La Araucanía está harta de refundaciones. El Becker pide continuidad.",
    capitulos:[
      {id:"tem_1",t:"Basta de empezar de cero",ctx:"Cada ciclo nuevo borra al anterior. La gente ya no se emociona de entrada.",
       ops:[{t:"Plan de cuatro años, por escrito",d:"Aburrido y serio.",ef:{prestigio:6},grupos:{socios:10,directorio:4,hinchada:4},mem:"le diste a Temuco un plan largo",va:"tem_2"},
            {t:"Ilusión de un mercado más",d:"La gente se prende un mes.",grupos:{hinchada:10,prensa:6,directorio:-4},mem:"le vendiste a Temuco otra ilusión corta",va:"tem_2"}]},
      {id:"tem_2",t:"El sur es cancha",ctx:"El frío es un jugador. ¿Se abraza o se huye?",
       ops:[{t:"Jugar con el invierno a favor",d:"Localía brava.",grupos:{hinchada:10,camarin:6},mem:"hiciste del invierno de Temuco un arma",cierra:true},
            {t:"Horarios de tele y chaqueta",d:"Cómodo.",ef:{plata:30},grupos:{sponsors:8,hinchada:-6},mem:"sacaste a Temuco del frío por la tele",cierra:true}]}
    ]}],
  USF:[{id:"usf_aconcagua",t:"No vivir de 2009",desc:"San Felipe tuvo su año más grande. El peligro es la foto enmarcada.",
    capitulos:[
      {id:"usf_1",t:"La vitrina",ctx:"Copa Chile y Clausura 2009. La gente la nombra cada mes.",
       ops:[{t:"Respetar la foto y trabajar el ahora",d:"Himno adentro, barro afuera.",grupos:{camarin:8,hinchada:6,comunidad:6},mem:"respetaste 2009 sin vivir de él en San Felipe",va:"usf_2"},
            {t:"Vender nostalgia a todo trapo",d:"Camisetas, presente flaco.",ef:{plata:50},grupos:{sponsors:8,camarin:-8},mem:"vendiste la nostalgia de San Felipe",va:"usf_2"}]},
      {id:"usf_2",t:"Pueblo del valle",ctx:"El Aconcagua no es mercado de capital.",
       ops:[{t:"Cantera y gente del valle",d:"Sello.",grupos:{comunidad:12,hinchada:8},mem:"armaste San Felipe con el valle",cierra:true,logro:"de_la_comunidad"},
            {t:"Nombres de afuera",d:"Ilusión rápida.",ef:{plata:-50},grupos:{prensa:6,comunidad:-6},mem:"llenaste San Felipe de nombres de afuera",cierra:true}]}
    ]}],
  CUR:[{id:"cur_maule",t:"Curicó quiere piso",desc:"Llegó a Primera, se fue. El Maule pide no volver a quemar el ciclo.",
    capitulos:[
      {id:"cur_1",t:"La Granja llena",ctx:"Cuando hay visita grande, el pueblo se desarma. El resto, no.",
       ops:[{t:"Precios de semana para llenar",d:"Caja chica, ruido alto.",ef:{plata:-18},grupos:{hinchada:12,comunidad:8},mem:"llenaste La Granja bajando el precio",va:"cur_2"},
            {t:"Cobrar el partido grande",d:"Más por cabeza.",ef:{plata:40},grupos:{sponsors:8,hinchada:-6},mem:"cobraste caro el partido grande de Curicó",va:"cur_2"}]},
      {id:"cur_2",t:"Volver sin quemarse",ctx:"El recuerdo de Primera empuja. La caja avisa.",
       ops:[{t:"Armar para quedarse, no para subir un año",d:"Lento.",grupos:{camarin:10,socios:8,directorio:4},mem:"armaste Curicó para quedarse, no para un verano",cierra:true},
            {t:"Todo al ascenso ahora",d:"Heroico y frágil.",grupos:{hinchada:12,directorio:-6},mem:"apostaste todo el ascenso de Curicó ahora",cierra:true}]}
    ]}],
  SCR:[{id:"scr_colchagua",t:"Santa Cruz cabe en su cancha",desc:"Pueblo, presupuesto chico, Giovagnoli. No es vitrina y no quiere serlo.",
    capitulos:[
      {id:"scr_1",t:"Club de pueblo",ctx:"Aparece un inversionista que habla de «marca Colchagua».",
       ops:[{t:"El club es de Santa Cruz",d:"Casa.",grupos:{comunidad:14,hinchada:10,sponsors:-6},mem:"dejaste Santa Cruz en su pueblo",va:"scr_2"},
            {t:"Abrir la marca",d:"Plata, recelo.",ef:{plata:40},grupos:{sponsors:10,comunidad:-10},mem:"abriste Santa Cruz como marca",va:"scr_2"}]},
      {id:"scr_2",t:"Cancha chica",ctx:"El municipal no da para más. ¿Se crece o se cuida?",
       ops:[{t:"Llenarlo con el pueblo",d:"Precios bajos.",ef:{plata:-10},grupos:{hinchada:12,comunidad:10},mem:"llenaste Santa Cruz con su gente",cierra:true,logro:"de_la_comunidad"},
            {t:"Buscar una cancha más grande",d:"Más aforo, menos casa.",grupos:{sponsors:6,comunidad:-8},mem:"sacaste a Santa Cruz de su cancha chica",cierra:true}]}
    ]}],
  RAN:[{id:"ran_talca",t:"Talca no es puente",desc:"Rangers carga historia piducana y un yo-yo que cansa.",
    capitulos:[
      {id:"ran_1",t:"Ciudad o sucursal",ctx:"Santiago mira a Talca como escala. El piducano pide club de ciudad.",
       ops:[{t:"Sello local",d:"Menos nombres, más casa.",grupos:{comunidad:12,hinchada:10,directorio:-4},mem:"le diste a Rangers un sello de Talca",va:"ran_2"},
            {t:"Traer nombres de afuera",d:"Ilusión rápida.",ef:{plata:-45},grupos:{hinchada:6,comunidad:-6},mem:"llenaste Rangers de nombres de afuera",va:"ran_2"}]},
      {id:"ran_2",t:"El Fiscal de domingo",ctx:"¿Horario de gente de a pie o de tele?",
       ops:[{t:"Domingo, entrada barata",d:"Tribuna viva.",ef:{plata:-20},grupos:{comunidad:12,hinchada:10},mem:"pusiste a Rangers en horario de gente de a pie",cierra:true},
            {t:"Horario de televisión",d:"Plata de TV.",ef:{plata:50},grupos:{sponsors:10,hinchada:-6},mem:"entregaste el horario de Rangers a la tele",cierra:true}]}
    ]}]
};

var ARCOS_GENERICOS_HIST=[
  {id:"gen_horario_tele",t:"La tele pide la hora",desc:"Un canal ofrece plata si mueves el partido a un horario imposible para la gente de a pie.",
    capitulos:[
      {id:"gt_1",t:"¿Domingo o lunes a las 21?",ctx:"La tele pone plata. El trabajador que va al estadio no llega a las 21 de un lunes. El directorio mira el cheque.",
       ops:[
        {t:"Dejarlo domingo, para la gente",d:"Menos plata, tribuna viva.",grupos:{hinchada:12,comunidad:10,sponsors:-8,anfp:-4},mem:"defendiste el horario de la gente contra la tele",cierra:true},
        {t:"Cobrar el horario de la tele",d:"Caja. Sillas vacías.",ef:{plata:70},grupos:{sponsors:12,anfp:6,hinchada:-10},mem:"entregaste el horario del club a la tele",cierra:true},
        {t:"Negociar a medias: sábado 18:00",d:"Ni tan pueblo ni tan cheque.",ef:{plata:25},grupos:{sponsors:4,hinchada:2},mem:"negociaste un horario a medias con la tele",cierra:true}
       ]}
    ]},
  {id:"gen_cantera_venta",t:"La joya de 17",desc:"Un europeo ofrece un cheque por el cabro de la casa. El pueblo todavía no lo vio debutar bien.",
    cond:function(E){ return (E.ind&&E.ind.cantera||50)>=45; },
    capitulos:[
      {id:"gc_1",t:"¿Se vende ahora?",ctx:"El ojeador ya se sentó en la platea. El directorio habla de «el modelo». La hinchada habla de traición.",
       ops:[
        {t:"Retenerlo un año y que debuten los domingos",d:"El pueblo lo ve. El cheque se enfría.",grupos:{hinchada:12,camarin:8,directorio:-8},mem:"retuviste a la joya de la cantera un año más",va:"gc_2"},
        {t:"Vender y clavar el porcentaje",d:"El modelo. Caja sana.",ef:{plata:160},grupos:{directorio:12,hinchada:-10},mem:"vendiste a la joya de la cantera apenas apareció Europa",cierra:true}
       ]},
      {id:"gc_2",t:"El año que pediste",ctx:"El cabro jugó. Ahora el cheque es más grande… o se lesionó y ya no llama nadie.",
       ops:[
        {t:"Vender más caro, con la gente de testigo",d:"Duele menos.",ef:{plata:220},grupos:{directorio:8,hinchada:-4},mem:"vendiste a la joya después de dejar que el pueblo lo viera",cierra:true},
        {t:"Aún no: es de acá",d:"Heroico. El directorio no perdona.",grupos:{hinchada:14,directorio:-12},mem:"te negaste a vender a la joya de la cantera",cierra:true}
       ]}
    ]},
  {id:"gen_asamblea_bronca",t:"Asamblea con palos",desc:"Socios e hinchada piden cabeza. Todavía no es moción de censura, pero se huele.",
    cond:function(E){ var g=E.grupos||{}; return ((g.socios&&g.socios.aprob)||0)<-20 && ((g.hinchada&&g.hinchada.aprob)||0)<-15; },
    capitulos:[
      {id:"ga_1",t:"La sede está caliente",ctx:"Hay gritos en la asamblea. Puedes salir a dar la cara, mandar al presidente o esconderte en el predio.",
       ops:[
        {t:"Dar la cara, sin teatro",d:"Respeto. Te pueden echar igual.",ef:{capital:-4},grupos:{socios:8,hinchada:6},rep:{credibilidad:6},mem:"diste la cara en una asamblea caliente",cierra:true},
        {t:"Mandar al presidente a apagar el incendio",d:"Tú te salvas; él no.",grupos:{directorio:-8,socios:4},rep:{dureza:4},mem:"mandaste al presidente a apagar la asamblea",cierra:true},
        {t:"No ir",d:"Frío. Se lee como desprecio.",grupos:{socios:-12,hinchada:-8},rep:{credibilidad:-6},mem:"faltaste a una asamblea caliente",cierra:true}
       ]}
    ]},
  {id:"gen_sponsor_nombre",t:"Le ponen el nombre al estadio",desc:"Un sponsor quiere el naming de la cancha. Plata gruesa. El hincha viejo no traga.",
    capitulos:[
      {id:"gn_1",t:"¿Se vende el nombre?",ctx:"El cheque alcanza para dos refuerzos o para pintar el estadio. A cambio, el recinto se llama como una marca.",
       ops:[
        {t:"Rechazar: el estadio se llama como se llama",d:"La gente aplaude. La caja no.",grupos:{hinchada:14,comunidad:10,sponsors:-12},mem:"rechazaste el naming del estadio",cierra:true},
        {t:"Aceptar el naming",d:"Plata. Silbidos el día del anuncio.",ef:{plata:120},grupos:{sponsors:14,directorio:8,hinchada:-12},mem:"le vendiste el nombre al estadio",cierra:true},
        {t:"Naming chico: solo la tribuna nueva",d:"A medias.",ef:{plata:50},grupos:{sponsors:6,hinchada:-4},mem:"cediste el nombre de una tribuna, no del estadio",cierra:true}
       ]}
    ]}
];

/* ---------- C · más voz ---------- */
var RELATO_HIST=[
  {m:"inicio",x:"Saque, dos toques, y ya se siente el rigor de la localía."},
  {m:"inicio",x:"El 5 pide la pelota al 1. Quiere calmar el partido a su manera."},
  {m:"inicio",x:"Hay más humo que fútbol. El árbitro espera que se aclare."},
  {m:"inicio",x:"Un pelotazo largo de prueba. Nadie gana la primera dividida."},
  {m:"inicio",x:"La banda ya está de pie. En la cancha todavía se miden."},
  {m:"inicio",x:"Falta de atrás a los tres minutos. El criterio va a ser corto."},
  {m:"dominio",x:"La tienen, la giran, y el rival se cansa de correr atrás."},
  {m:"dominio",x:"Tercer centro seguido. El área no descansa."},
  {m:"dominio",x:"Filtran entre líneas. El 5 rival llega tarde."},
  {m:"dominio",x:"Dominio sin diente: la pelota no le llega al 9."},
  {m:"dominio",x:"Piden el cambio de ritmo desde la bandeja."},
  {m:"dominio",x:"El lateral se come la raya. Hay espacio y no lo usan."},
  {m:"equilibrio",x:"Se ganan cada pelota como si fuera la última."},
  {m:"equilibrio",x:"Ida y vuelta, sin lujo. Un gol acá vale doble."},
  {m:"equilibrio",x:"Nadie suelta un hombre. Está trabado a propósito."},
  {m:"equilibrio",x:"El medio es un mar de piernas."},
  {m:"equilibrio",x:"Recupera uno, recupera el otro. Tablas en todo."},
  {m:"equilibrio",x:"Falta acá, falta allá. El partido no encuentra ritmo."},
  {m:"ahogo",x:"No salen. Cada pelota que pierden es una amenaza."},
  {m:"ahogo",x:"El área propia es un pasillo. Falta un despeje de verdad."},
  {m:"ahogo",x:"Piden el cambio a gritos. Esto no da para más."},
  {m:"ahogo",x:"El arquero es el más claro. Y eso no es cumplido."},
  {m:"ahogo",x:"Se come el reloj como puede. El rival no deja."},
  {m:"ahogo",x:"Un córner más. La gente se tapa la cara."},
  {m:"aguanta",x:"Aguantan con lo puesto. El reloj es un jugador más."},
  {m:"aguanta",x:"Despeje largo, respirar, otra vez atrás."},
  {m:"aguanta",x:"El 2 se tira al piso y gana el segundo palo."},
  {m:"aguanta",x:"No es lindo. Es un punto, si sale."},
  {m:"aguanta",x:"La bandeja pide que la coman afuera."},
  {m:"aguanta",x:"Falta táctica. El árbitro deja seguir. El DT se enoja."},
  {m:"cansancio",x:"Las piernas ya no responden. Se juega a durar."},
  {m:"cansancio",x:"Un control malo, un pase corto. Manda el físico."},
  {m:"cansancio",x:"El 8 pide el cambio con la mirada."},
  {m:"cansancio",x:"Hay más errores que ideas."},
  {m:"cansancio",x:"El calor (o el frío) hizo lo suyo."},
  {m:"cansancio",x:"El banquillo calienta. Esto pide sangre nueva."},
  {m:"llega_local",x:"La tribuna se para. Se viene el centro."},
  {m:"llega_local",x:"Mano a mano. El estadio pide el gol."},
  {m:"llega_local",x:"Remate desviado por poco. El arquero rival no llegaba."},
  {m:"llega_local",x:"Piden penal. El árbitro sigue. Reclamo en masa."},
  {m:"llega_local",x:"Cabezazo que se va apenas. Advertencia."},
  {m:"llega_local",x:"La peinan y no llega nadie. Se pierde la chance."},
  {m:"llega_rival",x:"El área propia se achica. Todos atrás."},
  {m:"llega_rival",x:"El 9 rival gira. Hay que taparlo ya."},
  {m:"llega_rival",x:"Remate que se va cerca. El 1 no salió."},
  {m:"llega_rival",x:"Piden penal. El árbitro sigue. La visita se enoja."},
  {m:"llega_rival",x:"Centro atrás. Nadie peina. Se salvan."},
  {m:"llega_rival",x:"El arquero vuela. El estadio aplaude al 1."}
];
var FRASES_HIST=[
  {ctx:"favorito",x:"Favoritos en el papel. Si no los pasamos, la gente no va a mirar el papel."},
  {ctx:"favorito",x:"Que no se la crean. Estos se pierden cuando alguien se relaja."},
  {ctx:"favorito",x:"Primer gol y se abre. Si no, va a ser largo y feo."},
  {ctx:"favorito",x:"Hoy el único rival somos nosotros."},
  {ctx:"favorito",x:"Nada de lucirse. Tres puntos y a la micro."},
  {ctx:"parejo",x:"Está parejo. El que sienta el partido a los 20 lo gana."},
  {ctx:"parejo",x:"No hay que inventar. Primer gol y después vemos."},
  {ctx:"parejo",x:"Ellos también tienen miedo. Que se note quién quiere más."},
  {ctx:"parejo",x:"Ojo con el segundo palo. En estos gana el rebote."},
  {ctx:"parejo",x:"Un punto de visita es bueno. Perder de local, no."},
  {ctx:"desventaja",x:"De visita y más chicos. Orden primero, después el golpe."},
  {ctx:"desventaja",x:"Si nos abrimos temprano nos golean."},
  {ctx:"desventaja",x:"Que corran como si les fuera el puesto."},
  {ctx:"desventaja",x:"Un punto acá es premio. Tres, un milagro. Igual se busca."},
  {ctx:"desventaja",x:"Que no miren la camiseta del otro."},
  {ctx:"clasico",x:"Hoy no se especula. O los pasamos o nos comen."},
  {ctx:"clasico",x:"Clásico se pelea. Pecho, no cabeza en otra parte."},
  {ctx:"clasico",x:"La gente no perdona un 0-0 tibio. Tampoco una locura de más."},
  {ctx:"clasico",x:"Ojo con las rojas. El árbitro busca protagonista."},
  {ctx:"clasico",x:"El primero que se enoje, pierde."},
  {ctx:"racha_mala",x:"Hoy se corta o se pone peor. No hay tercera."},
  {ctx:"racha_mala",x:"Que no salgan asustados. El miedo se nota a los cinco."},
  {ctx:"racha_mala",x:"Un gol temprano y se les va el fantasma."},
  {ctx:"racha_mala",x:"Hoy no se experimenta. Lo simple, y a morder."},
  {ctx:"racha_mala",x:"Si alguien no está para pelear, que lo diga ahora."},
  {ctx:"meta_cerca",x:"Estamos a un paso. Hoy no se regala ni un córner."},
  {ctx:"meta_cerca",x:"Que no se pongan a contar. Se cuenta con el silbato."},
  {ctx:"meta_cerca",x:"El rival sabe lo que nos jugamos. Van a morder más."},
  {ctx:"meta_cerca",x:"Hoy es de los que aguantan."},
  {ctx:"meta_cerca",x:"Tres puntos y dormimos. Uno y seguimos sufriendo."}
];
var PREGUNTAS_HIST=[
  {sit:"previa_copa",q:"¿Cambia el once para la copa o sales con los mismos de la liga?"},
  {sit:"previa_copa",q:"La gente pide copa. ¿Usted también o primero la tabla?"},
  {sit:"previa_copa",q:"¿Hay rotación o esto se juega como final?"},
  {sit:"previa_copa",q:"El rival viene de otra división. ¿Eso ayuda o es trampa?"},
  {sit:"previa_copa",q:"¿Le pediste algo puntual al equipo para no relajarse en copa?"},
  {sit:"previa_copa",q:"Si sale mal, ¿pesa más que un domingo de liga?"},
  {sit:"descenso_en_juego",q:"¿El plantel siente la tabla de abajo o usted se lo esconde?"},
  {sit:"descenso_en_juego",q:"¿Hay margen para rotar o esto es de los mismos once?"},
  {sit:"descenso_en_juego",q:"La gente pide pelea fea. ¿Eso es el plan?"},
  {sit:"descenso_en_juego",q:"¿Qué le dice a un jugador que ya está con la cabeza en la B?"},
  {sit:"descenso_en_juego",q:"¿Asume que este partido vale por dos?"},
  {sit:"descenso_en_juego",q:"¿Pidió calma al entorno o prefiere que empuje con bronca?"},
  {sit:"ascenso_en_juego",q:"¿Se juega a cerrar el ascenso o a no pensarlo?"},
  {sit:"ascenso_en_juego",q:"La ciudad ya festeja. ¿Eso ayuda o estorba?"},
  {sit:"ascenso_en_juego",q:"¿Hay que ganar feo o quiere que se note el salto de categoría?"},
  {sit:"ascenso_en_juego",q:"¿Le pidió al camarín que no se ponga a contar puntos?"},
  {sit:"ascenso_en_juego",q:"Si no sale hoy, ¿queda alguna fecha de verdad?"},
  {sit:"ascenso_en_juego",q:"¿Promete Primera o prefiere no hablar de eso todavía?"}
];
var TUITS_HIST=[
  {ctx:"ascenso",quien:"@hincha_de_ley",txt:"si subimos me tatuo el escudo. si no, igual. pero subamos"},
  {ctx:"ascenso",quien:"@doña_clarita",txt:"la ciudad ya compró el pasaje a primera. que no nos dejen en el andén"},
  {ctx:"ascenso",quien:"@pibe_de_la_popular",txt:"ASCENSO ASCENSO ASCENSO. el resto es ruido"},
  {ctx:"ascenso",quien:"@barra_del_fondo",txt:"esto no se especula. se mata en cada pelota"},
  {ctx:"ascenso",quien:"@RadioGolAM",txt:"Partido de ascenso. La tabla manda más que el trámite."},
  {ctx:"ascenso",quien:"@cuenta_troll",txt:"ya se sienten de primera y todavía falta el silbato"},
  {ctx:"ascenso",quien:"@el_que_va_en_micro",txt:"si subimos el lunes la micro va a ser un carnaval"},
  {ctx:"ascenso",quien:"@datofutbol",txt:"un punto de estos vale por tres de marzo"},
  {ctx:"descenso",quien:"@hincha_de_ley",txt:"la tabla de abajo no se mira. se pelea"},
  {ctx:"descenso",quien:"@doña_clarita",txt:"estos partidos se sufren con el completo en la mano y el alma afuera"},
  {ctx:"descenso",quien:"@pibe_de_la_popular",txt:"si bajamos no vuelvo. mentira, vuelvo. pero duele"},
  {ctx:"descenso",quien:"@barra_del_fondo",txt:"pelea fea. no quiero lindo, quiero puntos"},
  {ctx:"descenso",quien:"@RadioGolAM",txt:"Partido de permanencia. El trámite es nervioso."},
  {ctx:"descenso",quien:"@cuenta_troll",txt:"ya se sienten de la b y el partido no termina"},
  {ctx:"descenso",quien:"@el_del_completo",txt:"el vendedor grita más que la tribuna. mal síntoma"},
  {ctx:"descenso",quien:"@CronicaFC",txt:"Tres puntos que valen categoría. El resto es cuento."},
  {ctx:"copa_chile",quien:"@hincha_de_ley",txt:"copa chile es final desde octavos. el que no lo siente, que se quede en la casa"},
  {ctx:"copa_chile",quien:"@doña_clarita",txt:"hoy juega el que está en otra división. no se relajen"},
  {ctx:"copa_chile",quien:"@pibe_de_la_popular",txt:"LA COPA. el domingo es liga, hoy es gloria"},
  {ctx:"copa_chile",quien:"@barra_del_fondo",txt:"un globo, un cántico, y a comerse al rival"},
  {ctx:"copa_chile",quien:"@RadioGolAM",txt:"Copa Chile. Llave que no perdona."},
  {ctx:"copa_chile",quien:"@cuenta_troll",txt:"rotaron de más. se nota"},
  {ctx:"copa_chile",quien:"@datofutbol",txt:"el que gana copa chile se mete en el mapa continental"},
  {ctx:"copa_chile",quien:"@el_que_va_en_micro",txt:"entre semana y de copa. el que va, va de verdad"},
  {ctx:"libertadores",quien:"@hincha_de_ley",txt:"libertadores. se juega con otra cara. se nota en el himno"},
  {ctx:"libertadores",quien:"@doña_clarita",txt:"hoy la tele es de todo el continente. que no nos carguen"},
  {ctx:"libertadores",quien:"@pibe_de_la_popular",txt:"CONMEBOL. el que no se ponga la camiseta, al banco"},
  {ctx:"libertadores",quien:"@barra_del_fondo",txt:"esto no es liga. esto es copa. otra sangre"},
  {ctx:"libertadores",quien:"@RadioGolAM",txt:"Copa Libertadores. Trámite de otra jerarquía."},
  {ctx:"libertadores",quien:"@cuenta_troll",txt:"ya se sienten de madrid y todavía es fase de grupos"},
  {ctx:"libertadores",quien:"@datofutbol",txt:"tres puntos acá valen más que un clásico de abril"},
  {ctx:"libertadores",quien:"@CronicaFC",txt:"Noche continental. El rival no perdona el primer error."}
];

function sitPreviaHist(part){
  try{
    if(part&&part.tipo==="copa") return "previa_copa";
    if(typeof E==="undefined"||!E||!E.temporada) return null;
    var t=E.temporada, pv=(typeof puntosVictoria==="function")?puntosVictoria():3;
    var restan=Math.max(0, 30-(t.pj||0));
    if(E.eraBase==="2026b" && (t.pts||0) >= pv*10) return "ascenso_en_juego";
    if((E.eraBase===2026||E.eraBase==="2026b") && restan<=8 && (t.pts||0) <= pv*8) return "descenso_en_juego";
  }catch(e){}
  return null;
}

(function integrarHistorico(){
  /* épocas: CONCAT, no pisar */
  if(typeof EPOCAS_CLUB==="object"){
    Object.keys(EPOCAS_EXTRA).forEach(function(id){
      var add=EPOCAS_EXTRA[id]||[];
      var cur=EPOCAS_CLUB[id]||[];
      add.forEach(function(ep){
        if(!cur.some(function(x){ return x.anio===ep.anio; })) cur.push(ep);
      });
      EPOCAS_CLUB[id]=cur;
    });
  }
  /* historia string keys extra */
  if(typeof HISTORIA_BETA==="object"){
    Object.keys(HISTORIA_LINEA).forEach(function(id){
      if(!HISTORIA_BETA[id]) HISTORIA_BETA[id]={};
      var linea=HISTORIA_LINEA[id];
      var hoy=linea.filter(function(h){ return h.anio>=2024; }).pop();
      if(hoy && !HISTORIA_BETA[id].actual) HISTORIA_BETA[id].actual=hoy.txt;
      linea.forEach(function(h){
        var k=String(h.anio);
        if(!HISTORIA_BETA[id][k]) HISTORIA_BETA[id][k]=h.txt;
      });
    });
  }
  /* arcos club */
  if(typeof ARCOS_EQUIPO==="object"){
    Object.keys(ARCOS_HIST).forEach(function(k){
      if(!ARCOS_EQUIPO[k]) ARCOS_EQUIPO[k]=ARCOS_HIST[k];
    });
  }
  if(typeof ARCOS_GENERICOS!=="undefined" && Array.isArray(ARCOS_GENERICOS)){
    ARCOS_GENERICOS_HIST.forEach(function(a){
      if(!ARCOS_GENERICOS.some(function(x){ return x.id===a.id; })) ARCOS_GENERICOS.push(a);
    });
  }
  /* voz */
  if(typeof RELATO_BETA!=="undefined" && Array.isArray(RELATO_BETA)){
    RELATO_HIST.forEach(function(r){ RELATO_BETA.push(r); });
  }
  if(typeof FRASES_CUERPO!=="undefined" && Array.isArray(FRASES_CUERPO)){
    FRASES_HIST.forEach(function(f){ FRASES_CUERPO.push(f); });
  }
  if(typeof PREGUNTAS_BETA!=="undefined" && Array.isArray(PREGUNTAS_BETA)){
    PREGUNTAS_HIST.forEach(function(p){ PREGUNTAS_BETA.push(p); });
  }
  if(typeof PREGUNTAS_VOZ!=="undefined" && Array.isArray(PREGUNTAS_VOZ)){
    PREGUNTAS_HIST.forEach(function(p){ PREGUNTAS_VOZ.push(p); });
  }
  if(typeof TUITS_MOMENTO!=="undefined" && Array.isArray(TUITS_MOMENTO)){
    TUITS_HIST.forEach(function(t){ TUITS_MOMENTO.push(t); });
  }

  if(typeof nuevoAnio==="function" && !nuevoAnio._hist){
    var origA=nuevoAnio;
    nuevoAnio=function(){
      origA.apply(this, arguments);
      try{ dispararEscenarioFuturo(); }catch(e){}
    };
    nuevoAnio._hist=true;
  }

  if(typeof preguntasConferencia==="function" && !preguntasConferencia._hist){
    var origC=preguntasConferencia;
    preguntasConferencia=function(part){
      var L=origC(part)||[];
      try{
        var sit=sitPreviaHist(part);
        if(sit){
          var pool=(typeof PREGUNTAS_VOZ!=="undefined"?PREGUNTAS_VOZ:PREGUNTAS_HIST).filter(function(p){ return p.sit===sit; });
          pool.slice(0,2).forEach(function(p,i){
            L.unshift({id:"hist_"+sit+"_"+i, prio:8, q:p.q, ops:[
              {t:"Hablar claro",k:"humilde"},
              {t:"Subir el pecho",k:"bancar"},
              {t:"Cortar corto",k:"palo"}
            ]});
          });
        }
      }catch(e){}
      return L;
    };
    preguntasConferencia._hist=true;
    preguntasConferencia._voz=!!origC._voz||true;
    preguntasConferencia._32=!!origC._32||true;
    preguntasConferencia._beta=!!origC._beta||true;
  }

  if(typeof ctxDeEvento==="function" && !ctxDeEvento._hist){
    var origX=ctxDeEvento;
    ctxDeEvento=function(P,ev){
      var c=origX(P,ev);
      if(c) return c;
      try{
        if(P&&P.part&&P.part.tipo==="copa"){
          var tor=P.part.torneo||"";
          if(/Libertadores/i.test(tor)) return "libertadores";
          if(/Sudamericana/i.test(tor)) return "libertadores";
          if(/Chile/i.test(tor)) return "copa_chile";
        }
        if(typeof E!=="undefined"&&E&&E.eraBase==="2026b"){
          var pv=(typeof puntosVictoria==="function")?puntosVictoria():3;
          if(E.temporada && (E.temporada.pts||0)>=pv*10) return "ascenso";
          if(E.temporada && (E.temporada.pts||0)<=pv*6) return "descenso";
        }
      }catch(e){}
      return c;
    };
    ctxDeEvento._hist=true;
  }
})();
