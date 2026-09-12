"use strict";
/* ============================================================
   FUTBOLINI 7.84 · data-tarea-e.js
   GROK_SUPERPROMPT TAREA E horneada (barrido pre-8.0).
   Solo datos verificados. Planteles: NO se inventan (cantera).
   Cargar DESPUÉS de data-historico.js / data-superprompt-83.js.
   ============================================================ */

/* E-2 · clásicos reales y VARIADOS (no todos vs Colo-Colo).
   Se CONCATENAN a RIVALIDADES_2026. Pares ya existentes no se duplican. */
const RIVALIDADES_TAREA_E=[
  ["SW","EVE"],   /* Clásico Porteño · Wikipedia */
  ["CBL","ANT"],  /* Clásico del Norte (Calama–Antofagasta) */
  ["IQQ","SMA"],  /* norte extremo: Iquique–San Marcos */
  ["MAG","SMO"],  /* clásico de la chilenidad (los más antiguos de Santiago) */
  ["RAN","CUR"],  /* Maule: Rangers–Curicó */
  ["UES","PAL"],  /* clásico de colonias (hispano–árabe) */
  ["UES","AUD"],  /* colonias (hispano–italiano); AUD–PAL ya estaba */
  ["CBL","COB"],  /* clásico minero Cobreloa–Cobresal */
  ["PMO","OSO"],  /* sur: Puerto Montt–Osorno */
  ["TRA","SLQ"],  /* Aconcagua: Trasandino–San Luis */
  ["GVE","REN"],  /* O'Higgins: Velásquez–Rengo */
  ["SCR","CLC"],  /* Colchagua: Santa Cruz–Colchagua */
  ["TEM","HUA"],  /* sur: Temuco–Huachipato (cuando se cruzan) */
  ["BOC","RIV"],  /* Superclásico argentino */
  ["RAC","IND"],  /* Clásico de Avellaneda */
  ["ROS","NEW"],  /* Clásico rosarino */
  ["ELP","GLP"],  /* Clásico platense */
  ["TAL","BEL"],  /* Córdoba: Talleres–Belgrano */
  ["SLO","HUR"],  /* Boedo–Parque Patricios */
  ["LAN","BAN"]   /* sur del GBA: Lanús–Banfield */
];
(function mergeRivalesE(){
  if(typeof RIVALIDADES_2026==="undefined" || !Array.isArray(RIVALIDADES_2026)) return;
  RIVALIDADES_TAREA_E.forEach(function(par){
    var hay=RIVALIDADES_2026.some(function(p){
      return (p[0]===par[0]&&p[1]===par[1])||(p[0]===par[1]&&p[1]===par[0]);
    });
    if(!hay) RIVALIDADES_2026.push(par);
  });
})();

/* E-1 · situación propia (por qué juego a esto). Aproximado, no cifra real. */
const SITUACION_CLUB={
  CC:"El más grande. La masa no acepta media tabla; la concesionaria y la hinchada no tiran para el mismo lado.",
  UCH:"Masa enorme, sin estadio propio. El Nacional es prestado; la caja no acompaña al pueblo.",
  UC:"Orden y cantera, menos masa. Crecer sin volverse otro: esa es la tensión cruzada.",
  PAL:"La Cisterna chica, identidad pública. Presupuesto acotado, formación propia.",
  LIM:"Pueblo recién llegado a Primera. Sobrevivir ya es título.",
  EVE:"Cuando se acaba el verano, Sausalito se vacía. Pelea en Primera con plantel mixto.",
  COQ:"Campeón 2025 y supercampeón 2026. El norte no perdona si se afloja después de la estrella.",
  AUD:"La Florida, colonia, tabla del medio. Ilusionarse de más duele.",
  HUA:"Acero: forma, vende, pelea. El CAP no es adorno.",
  OHI:"Rancagua pide equipo de región, no sucursal de Santiago.",
  NUB:"Chillán, frío, poca vitrina. El Oyarzún lleno duele.",
  COB:"El Salvador, altura, viaje eterno. Localía brava, caja justa.",
  CAL:"Pueblo chico, puntos feos. Se hunde sin hacer ruido.",
  LSE:"Postal de playa y yo-yo de categoría.",
  DCO:"El León volvió a Primera. Historia, gente y miedo a caer otra vez.",
  UDC:"El Campanil se acomoda otra vez en honor. Cantera, no masa.",
  CBL:"Calama no acepta eternizarse en la B. Finalista de América en los 80.",
  SW:"El decano, Valparaíso. Años en la B: volver no es postal.",
  UES:"Santa Laura, colonia. Bajó: el 2026 es para no eternizarse abajo.",
  MAG:"El más antiguo, caja de B. San Bernardo, no Ñuñoa.",
  IQQ:"Dragones, Tierra de Campeones. Bajó: volver es la única meta.",
  SMO:"El chaguito, Segunda, La Pintana. Paredes en el banco; volver a la B.",
  LSC:"El minero del carbón. La cuenca es la bandera.",
  OSO:"Toro del sur, estadio grande para la categoría.",
  RIV:"El más grande de Argentina. El Monumental llena; el promedio acecha igual.",
  BOC:"La Bombonera no se negocia. El Superclásico manda la semana.",
  RAC:"La Academia. Avellaneda, Cilindro, no vivir de 1967.",
  IND:"Rey de Copas. El Rojo pide Europa otra vez, no nostalgia.",
  SLQ:"Quillota, yo-yo. El Lucio Fariña es de pueblo: pelea de ascenso, no de vitrina.",
  ANT:"El puma, calor, distancia. Odia que lo traten de sucursal minera.",
  REC:"Barrio, estadio chico. Llegar a la B ya fue título; quedarse es el trabajo.",
  PMO:"Chinquihue, lluvia, el sur lejos. El viaje cansa al rival.",
  SMA:"Arica, el Dittborn. La distancia es arma y cárcel.",
  COP:"Atacama, polvo, no postal. Copiapó pide no ser un verano en Primera.",
  TEM:"La Araucanía, el Becker. El sur pide continuidad, no otro reinicio.",
  USF:"Aconcagua, el uni-uni. El pueblo pide no vivir de 2009.",
  CUR:"Maule, La Granja. Volver a honor sin quemar la caja.",
  SCR:"Colchagua, pueblo. El estadio cabe la gente; el presupuesto, no.",
  RAN:"Talca, el piducano. Equipo de ciudad, no puente a Santiago.",
  LIN:"Albirrojo del Maule. Fiscal chico, pelea el salto a la B.",
  CLC:"San Fernando, valle. Volvió al profesionalismo: sobrevivir.",
  TRA:"Los Andes, la cordillera. Club de paso, no de capital.",
  COL:"Chacabuco, comuna al norte de Santiago. Club en crecimiento.",
  OVA:"El Ciclón del Limarí. Ovalle, Diaguita, zona Norte.",
  CNA:"Concón, 1914. Escribe su historia en Segunda; no tiene pasado grande.",
  BSA:"Salamanca, Choapa. Identidad de pueblo, caja de pueblo.",
  RSJ:"La Legua, escuela. Poco aforo, muchos cadetes.",
  SCI:"Lo Barnechea, proyecto joven. Negro y rosa; sin historia mayor.",
  GVE:"San Vicente, 1908. Los Verdes del secano.",
  REN:"Rengo, Cachapoal. Primero, sobrevivir.",
  VEL:"Liniers, el Fortín. Cantera y pelea de arriba.",
  SLO:"Boedo, el Ciclón. Identidad de barrio, no de marketing.",
  ELP:"El Pincharrata. El clásico platense manda.",
  ROS:"El Canalla, Arroyito. El clásico de Rosario no se negocia.",
  NEW:"La Lepra. Parque Independencia, historia de DT y cantera.",
  HUR:"El Globo, Parque Patricios. Clásico vs San Lorenzo.",
  LAN:"El Granate. Sur del GBA, pelea continental cuando ordena.",
  ARG:"La Paternal, cuna de Maradona. Cantera primero.",
  GLP:"El Lobo, 1887. El Bosque. Clásico platense.",
  BEL:"El Pirata de Córdoba. Clásico vs Talleres.",
  TAL:"La T. Kempes. Ambición de grande del interior.",
  TUC:"El Decano del norte. El viaje es un arma.",
  BAN:"El Taladro. Florencio Sola, clásico del sur vs Lanús.",
  PLA:"El Calamar. Vicente López: quedarse en Primera es el plan.",
  UNI:"El Tatengue. Santa Fe, interior que incomoda.",
  TIG:"El Matador. Victoria, yo-yo de categoría.",
  DYJ:"El Halcón de Varela. Club chico de copas: modelo raro y efectivo.",
  INS:"La Gloria de Córdoba. Cantera, no marketing porteño.",
  CCO:"Santiago del Estero. El norte argentino, no el chileno.",
  IRV:"Mendoza, la Lepra mendocina. El Cuyo en Primera.",
  SAR:"Junín, el Verde. Pueblo del interior bonaerense.",
  ALD:"Mar del Plata, el Tiburón. Verano y distancia.",
  GME:"El Lobo mendocino. Recién llegado a la Liga Profesional.",
  RIE:"Villa Soldati, 3.000 almas. Club chico de verdad.",
  ERC:"Río Cuarto. El interior profundo en Primera.",
  BAR:"La Ribera, el Guapo. Barrio, no marketing."
};

/* E-11 / E-13 · épocas doradas que FALTABAN (hito real; plantel = cantera si no hay documentado).
   CONCAT, no pisar las que ya están (2011 U, 2019 UC, 2003 Cobreloa, etc.). */
const EPOCAS_TAREA_E={
  EVE:[{anio:2008,etq:"2008 · Apertura en Viña",
    desc:"Campeón del Apertura 2008 con Nelson Acosta. Sausalito en fiesta. (Plantel: el juego rellena; no se inventan nombres.)",
    dt:"Nelson Acosta",
    ind:{plantel:78,moral:84,hinchada:80,socios:58,cantera:52,estadio:74,prestigio:76,riesgo:20},
    caja:{plata:320,deuda:140}}],
  AUD:[{anio:2007,etq:"2007 · Libertadores",
    desc:"Audax de Raúl Toro: 3º del Apertura 2007 (44 pts) y 11 puntos en Libertadores, sin pasar. NO campeón: el Apertura lo ganó Colo-Colo. (Plantel: data-planteles-801.js.)",
    dt:"Raúl Toro",
    ind:{plantel:76,moral:82,hinchada:70,socios:52,cantera:56,estadio:58,prestigio:72,riesgo:22},
    caja:{plata:280,deuda:120}}],
  HUA:[{anio:2023,etq:"2023 · Tercera estrella",
    desc:"Campeón 2023 con Gustavo Álvarez. Última fecha en el CAP. (Plantel: cantera.)",
    dt:"Gustavo Álvarez",
    ind:{plantel:80,moral:84,hinchada:76,socios:54,cantera:72,estadio:62,prestigio:78,riesgo:18},
    caja:{plata:340,deuda:150}}],
  CBL:[{anio:1981,etq:"1981 · Final de América",
    desc:"Finalista de la Libertadores 1981 vs Flamengo. El norte se creyó grande de verdad. (Plantel: cantera.)",
    dt:"Vicente Cantatore",
    ind:{plantel:84,moral:88,hinchada:90,socios:58,cantera:50,estadio:68,prestigio:88,riesgo:16},
    caja:{plata:400,deuda:80}}],
  SW:[{anio:1968,etq:"1968 · La estrella del decano",
    desc:"Campeón nacional 1968. Historia más grande que varias tablas recientes. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:80,moral:86,hinchada:84,socios:56,cantera:50,estadio:70,prestigio:82,riesgo:18},
    caja:{plata:240,deuda:60}}],
  SMO:[{anio:1942,etq:"1942 · Campeón nacional",
    desc:"Santiago Morning campeón de Primera 1942. El chaguito fue grande. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:78,moral:84,hinchada:72,socios:50,cantera:48,estadio:46,prestigio:74,riesgo:22},
    caja:{plata:160,deuda:40}}],
  LSC:[{anio:1969,etq:"1969 · El minero en Primera",
    desc:"Lota Schwager en honor. La cuenca del carbón llegó a Primera. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:70,moral:78,hinchada:80,socios:46,cantera:44,estadio:50,prestigio:62,riesgo:28},
    caja:{plata:120,deuda:50}}],
  OSO:[{anio:1991,etq:"1991 · El Toro en el Nacional",
    desc:"Provincial Osorno jugó el Campeonato Nacional 1991 (19 pts, descendió con Wanderers). El sur en honor. (Plantel: cantera; el club actual es refundación 2012.)",
    dt:"el cuerpo técnico",
    ind:{plantel:66,moral:74,hinchada:76,socios:44,cantera:42,estadio:70,prestigio:58,riesgo:30},
    caja:{plata:140,deuda:70}}],
  GVE:[{anio:2017,etq:"2017 · Campeón de Tercera A",
    desc:"General Velásquez campeón de Tercera A 2017. Vuelve al profesionalismo. (Plantel: cantera.)",
    dt:"Ítalo Pinochet",
    ind:{plantel:62,moral:80,hinchada:70,socios:40,cantera:40,estadio:40,prestigio:50,riesgo:32},
    caja:{plata:80,deuda:30}}],
  SCI:[{anio:2024,etq:"2024 · Ascenso a Segunda",
    desc:"Santiago City campeón de Tercera A 2024. Entra al profesionalismo. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:58,moral:78,hinchada:50,socios:32,cantera:48,estadio:36,prestigio:44,riesgo:34},
    caja:{plata:90,deuda:40}}],
  COL:[{anio:2025,etq:"2025 · Campeón de Tercera A",
    desc:"Atlético Colina campeón de Tercera A 2025: vuelve al profesionalismo. (Plantel: cantera.)",
    dt:"Fernando Vergara",
    ind:{plantel:60,moral:80,hinchada:58,socios:36,cantera:46,estadio:42,prestigio:46,riesgo:32},
    caja:{plata:85,deuda:35}}],
  CNA:[{anio:2023,etq:"2023 · Subcampeón y el salto",
    desc:"Concón National subcampeón de Tercera A 2023: entra al profesionalismo. Fundado en 1914. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:58,moral:76,hinchada:52,socios:34,cantera:42,estadio:38,prestigio:44,riesgo:34},
    caja:{plata:75,deuda:30}}],
  BSA:[{anio:2024,etq:"2024 · Las Brujas al profesionalismo",
    desc:"Brujas de Salamanca sube a Segunda. Pueblo del Choapa. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:56,moral:78,hinchada:60,socios:32,cantera:38,estadio:36,prestigio:42,riesgo:36},
    caja:{plata:70,deuda:28}}],
  RSJ:[{anio:2021,etq:"2021 · Los chicos buenos suben",
    desc:"Real San Joaquín subcampeón de Tercera A 2021: llega a Segunda. Escuela de La Legua. (Plantel: cantera.)",
    dt:"Jaime Lizama",
    ind:{plantel:56,moral:76,hinchada:54,socios:30,cantera:50,estadio:34,prestigio:42,riesgo:36},
    caja:{plata:70,deuda:25}}],
  OVA:[{anio:2023,etq:"2023 · El Ciclón a Segunda",
    desc:"Provincial Ovalle campeón de Tercera A 2023. El Limarí al profesionalismo. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:58,moral:80,hinchada:62,socios:34,cantera:40,estadio:48,prestigio:46,riesgo:32},
    caja:{plata:80,deuda:30}}],
  TRA:[{anio:2021,etq:"2021 · Trasandino a Segunda",
    desc:"Trasandino campeón/ascenso a Segunda 2021. Los Andes, la cordillera. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:60,moral:78,hinchada:58,socios:36,cantera:42,estadio:44,prestigio:48,riesgo:32},
    caja:{plata:85,deuda:32}}],
  REN:[{anio:2015,etq:"2015 · Copa Absoluta ANFA",
    desc:"Deportes Rengo campeón de la Copa Absoluta ANFA 2015 (5-1 global a Real San Joaquín). Hito amateur documentado. (Plantel: cantera.)",
    dt:"Fred Gayoso",
    ind:{plantel:54,moral:76,hinchada:56,socios:30,cantera:38,estadio:36,prestigio:40,riesgo:36},
    caja:{plata:60,deuda:22}}],
  LIN:[{anio:1956,etq:"1956 · Nace el albirrojo",
    desc:"Deportes Linares se funda. El Maule, el Fiscal. Gloria de origen: existir. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:52,moral:70,hinchada:54,socios:32,cantera:40,estadio:40,prestigio:40,riesgo:34},
    caja:{plata:55,deuda:20}}],
  CLC:[{anio:1957,etq:"1957 · Nace Colchagua",
    desc:"Colchagua de San Fernando. Valle, no vitrina. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:52,moral:70,hinchada:52,socios:32,cantera:38,estadio:42,prestigio:40,riesgo:34},
    caja:{plata:55,deuda:20}}],
  REC:[{anio:2021,etq:"2021 · Recoleta a la B",
    desc:"Deportes Recoleta llega a la Primera B. Barrio, estadio chico. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:60,moral:78,hinchada:62,socios:38,cantera:44,estadio:40,prestigio:48,riesgo:32},
    caja:{plata:110,deuda:50}}],
  PMO:[{anio:2025,etq:"2025 · El Velero vuelve a la B",
    desc:"Puerto Montt asciende a Primera B. Chinquihue, lluvia, el sur lejos. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:62,moral:80,hinchada:70,socios:40,cantera:42,estadio:58,prestigio:50,riesgo:30},
    caja:{plata:130,deuda:60}}],
  SMA:[{anio:2014,etq:"2014 · Arica en Primera",
    desc:"San Marcos de Arica en honor. El Dittborn, la distancia como arma. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:66,moral:76,hinchada:74,socios:42,cantera:40,estadio:64,prestigio:56,riesgo:30},
    caja:{plata:160,deuda:80}}],
  COP:[{anio:2023,etq:"2023 · Copiapó en Primera",
    desc:"Deportes Copiapó llega a honor. Atacama, no postal. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:64,moral:78,hinchada:68,socios:40,cantera:40,estadio:52,prestigio:52,riesgo:32},
    caja:{plata:150,deuda:80}}],
  TEM:[{anio:2001,etq:"2001 · Temuco en honor",
    desc:"Uno de los últimos ciclos de Primera del siglo. La Araucanía, el Becker. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:66,moral:72,hinchada:74,socios:44,cantera:44,estadio:68,prestigio:56,riesgo:32},
    caja:{plata:170,deuda:90}}],
  SCR:[{anio:2019,etq:"2019 · Santa Cruz se afirma",
    desc:"Deportes Santa Cruz se afirma en la B profesional. Pueblo, no vitrina. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:58,moral:74,hinchada:60,socios:36,cantera:40,estadio:42,prestigio:46,riesgo:34},
    caja:{plata:100,deuda:45}}],
  RAN:[{anio:1969,etq:"1969 · Subcampeón nacional",
    desc:"Rangers de Talca subcampeón de Primera 1969. Memoria de grandeza provincial. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:76,moral:82,hinchada:78,socios:48,cantera:46,estadio:52,prestigio:70,riesgo:24},
    caja:{plata:180,deuda:50}}],
  SLQ:[{anio:2015,etq:"2015 · San Luis en Primera",
    desc:"San Luis de Quillota en honor. El Lucio Fariña, pueblo del Aconcagua. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:64,moral:74,hinchada:66,socios:40,cantera:42,estadio:54,prestigio:52,riesgo:32},
    caja:{plata:150,deuda:70}}],
  RIV:[{anio:2018,etq:"2018 · Libertadores",
    desc:"River campeón de América 2018 vs Boca (Madrid). Gallardo. (Plantel: cantera; no se inventan nombres.)",
    dt:"Marcelo Gallardo",
    ind:{plantel:90,moral:88,hinchada:92,socios:80,cantera:78,estadio:94,prestigio:94,riesgo:14},
    caja:{plata:900,deuda:400}}],
  BOC:[{anio:2007,etq:"2007 · Libertadores",
    desc:"Boca campeón de América 2007 vs Grêmio. La Bombonera. (Plantel: cantera.)",
    dt:"Miguel Ángel Russo",
    ind:{plantel:88,moral:86,hinchada:94,socios:78,cantera:70,estadio:90,prestigio:92,riesgo:16},
    caja:{plata:850,deuda:380}}],
  RAC:[{anio:1967,etq:"1967 · Intercontinental",
    desc:"Racing campeón del mundo 1967 vs Celtic. La Academia. (Plantel: cantera.)",
    dt:"Juan José Pizzuti",
    ind:{plantel:86,moral:90,hinchada:86,socios:70,cantera:64,estadio:80,prestigio:90,riesgo:14},
    caja:{plata:400,deuda:80}}],
  IND:[{anio:1984,etq:"1984 · Intercontinental",
    desc:"Independiente campeón del mundo 1984 vs Liverpool. El Rey de Copas. (Plantel: cantera.)",
    dt:"José Omar Pastoriza",
    ind:{plantel:86,moral:90,hinchada:88,socios:68,cantera:62,estadio:82,prestigio:92,riesgo:14},
    caja:{plata:420,deuda:90}}],
  VEL:[{anio:1994,etq:"1994 · Libertadores",
    desc:"Vélez campeón de América 1994 con Bianchi. (Plantel: cantera.)",
    dt:"Carlos Bianchi",
    ind:{plantel:84,moral:88,hinchada:80,socios:62,cantera:66,estadio:78,prestigio:86,riesgo:16},
    caja:{plata:380,deuda:100}}],
  SLO:[{anio:2014,etq:"2014 · Libertadores",
    desc:"San Lorenzo campeón de América 2014. El Ciclón. (Plantel: cantera.)",
    dt:"Edgardo Bauza",
    ind:{plantel:82,moral:86,hinchada:84,socios:64,cantera:60,estadio:76,prestigio:84,riesgo:18},
    caja:{plata:360,deuda:120}}],
  ELP:[{anio:2009,etq:"2009 · Libertadores",
    desc:"Estudiantes de La Plata campeón de América 2009. (Plantel: cantera.)",
    dt:"Alejandro Sabella",
    ind:{plantel:82,moral:86,hinchada:80,socios:58,cantera:70,estadio:72,prestigio:84,riesgo:16},
    caja:{plata:340,deuda:110}}],
  DYJ:[{anio:2020,etq:"2020 · Sudamericana",
    desc:"Defensa y Justicia campeón de la Copa Sudamericana 2020. Club chico de copas. (Plantel: cantera.)",
    dt:"Hernán Crespo",
    ind:{plantel:78,moral:86,hinchada:70,socios:42,cantera:58,estadio:48,prestigio:78,riesgo:22},
    caja:{plata:220,deuda:80}}],
  ARG:[{anio:1985,etq:"1985 · Libertadores",
    desc:"Argentinos Juniors campeón de América 1985. La Paternal. (Plantel: cantera.)",
    dt:"José Yudica",
    ind:{plantel:82,moral:86,hinchada:78,socios:52,cantera:74,estadio:60,prestigio:84,riesgo:16},
    caja:{plata:280,deuda:70}}],
  LAN:[{anio:2013,etq:"2013 · Sudamericana",
    desc:"Lanús campeón de la Sudamericana 2013. El Granate. (Plantel: cantera.)",
    dt:"Guillermo Barros Schelotto",
    ind:{plantel:80,moral:84,hinchada:76,socios:50,cantera:62,estadio:70,prestigio:80,riesgo:18},
    caja:{plata:260,deuda:90}}],
  NEW:[{anio:1974,etq:"1974 · Nacional",
    desc:"Newell's campeón del Nacional 1974. La Lepra. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:80,moral:84,hinchada:82,socios:56,cantera:70,estadio:68,prestigio:80,riesgo:18},
    caja:{plata:240,deuda:60}}],
  ROS:[{anio:1987,etq:"1987 · El Canalla campeón",
    desc:"Rosario Central campeón 1986/87. Arroyito. (Plantel: cantera.)",
    dt:"Ángel Tulio Zof",
    ind:{plantel:80,moral:86,hinchada:84,socios:58,cantera:64,estadio:74,prestigio:80,riesgo:18},
    caja:{plata:250,deuda:70}}],
  HUR:[{anio:1973,etq:"1973 · Metropolitano",
    desc:"Huracán campeón del Metropolitano 1973, el de Menotti. (Plantel: cantera.)",
    dt:"César Luis Menotti",
    ind:{plantel:82,moral:86,hinchada:80,socios:52,cantera:66,estadio:70,prestigio:82,riesgo:16},
    caja:{plata:230,deuda:50}}],
  BAN:[{anio:2009,etq:"2009 · Apertura",
    desc:"Banfield campeón del Apertura 2009. El Taladro. (Plantel: cantera.)",
    dt:"Julio César Falcioni",
    ind:{plantel:78,moral:84,hinchada:74,socios:48,cantera:60,estadio:62,prestigio:76,riesgo:20},
    caja:{plata:220,deuda:80}}],
  BEL:[{anio:2022,etq:"2022 · Vuelta a Primera",
    desc:"Belgrano asciende a Primera 2022. El Pirata vuelve. (Plantel: cantera.)",
    dt:"Guillermo Farré",
    ind:{plantel:70,moral:82,hinchada:80,socios:50,cantera:52,estadio:64,prestigio:62,riesgo:28},
    caja:{plata:180,deuda:70}}],
  GME:[{anio:2025,etq:"2025 · Ascenso a Primera",
    desc:"Gimnasia de Mendoza asciende a la Liga Profesional 2026. Hecho de tabla. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:64,moral:80,hinchada:70,socios:40,cantera:46,estadio:48,prestigio:52,riesgo:32},
    caja:{plata:140,deuda:60}}],
  ERC:[{anio:2025,etq:"2025 · Río Cuarto a Primera",
    desc:"Estudiantes de Río Cuarto asciende 2025. Interior profundo. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:62,moral:80,hinchada:66,socios:36,cantera:44,estadio:46,prestigio:50,riesgo:34},
    caja:{plata:130,deuda:55}}],
  GLP:[{anio:1929,etq:"1929 · El Lobo campeón",
    desc:"Gimnasia LP campeón 1929. El hito máximo amateur/profesional temprano. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:76,moral:84,hinchada:78,socios:50,cantera:52,estadio:60,prestigio:74,riesgo:20},
    caja:{plata:160,deuda:40}}],
  TAL:[{anio:2016,etq:"2016 · Talleres vuelve",
    desc:"Talleres de Córdoba vuelve a Primera 2016 y se afirma. (Plantel: cantera.)",
    dt:"Frank Darío Kudelka",
    ind:{plantel:72,moral:80,hinchada:82,socios:54,cantera:58,estadio:78,prestigio:68,riesgo:26},
    caja:{plata:220,deuda:90}}],
  TUC:[{anio:2009,etq:"2009 · El Decano en Primera",
    desc:"Atlético Tucumán llega a Primera. El norte argentino. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:68,moral:78,hinchada:76,socios:44,cantera:46,estadio:66,prestigio:58,riesgo:28},
    caja:{plata:170,deuda:70}}],
  RIE:[{anio:2024,etq:"2024 · Riestra en Primera",
    desc:"Deportivo Riestra se afirma en Primera. Villa Soldati, 3.000 almas. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:58,moral:74,hinchada:54,socios:28,cantera:40,estadio:30,prestigio:42,riesgo:36},
    caja:{plata:90,deuda:40}}]
};
(function mergeEpocasE(){
  if(typeof EPOCAS_CLUB!=="object") return;
  Object.keys(EPOCAS_TAREA_E).forEach(function(id){
    var add=EPOCAS_TAREA_E[id]||[];
    var cur=EPOCAS_CLUB[id]||[];
    add.forEach(function(ep){
      if(!cur.some(function(x){ return x.anio===ep.anio; })) cur.push(ep);
    });
    EPOCAS_CLUB[id]=cur;
  });
})();

/* E-9 · HISTORIA argentina + huecos de Segunda (fundaciones documentadas). */
const HISTORIA_TAREA_E={
  RIV:[
    {anio:1901,hito:"Fundación",txt:"River Plate nace en 1901, La Boca; después se muda a Núñez. El más grande de Argentina en masa."},
    {anio:1986,hito:"Libertadores",txt:"Campeón de América 1986. Ciclo de grandeza continental."},
    {anio:2018,hito:"Libertadores",txt:"Campeón de América vs Boca, final en Madrid. Gallardo."},
    {anio:2026,hito:"Hoy",txt:"Liga Profesional (AFA). El Monumental llena; el promedio acecha igual."}
  ],
  BOC:[
    {anio:1905,hito:"Fundación",txt:"Boca Juniors nace en 1905 en La Boca. Azul y oro, la Bombonera."},
    {anio:1977,hito:"Libertadores",txt:"Primera Libertadores. Empieza la leyenda continental."},
    {anio:2007,hito:"Libertadores",txt:"Campeón de América 2007 vs Grêmio."},
    {anio:2026,hito:"Hoy",txt:"La Bombonera no se negocia. El Superclásico manda la semana."}
  ],
  RAC:[
    {anio:1903,hito:"Fundación",txt:"Racing Club, Avellaneda. La Academia."},
    {anio:1967,hito:"Intercontinental",txt:"Campeón del mundo vs Celtic. El hito máximo."},
    {anio:2026,hito:"Hoy",txt:"El Cilindro. No vivir de 1967: pelea arriba en la Liga Profesional."}
  ],
  IND:[
    {anio:1905,hito:"Fundación",txt:"Independiente de Avellaneda. El Rojo, Rey de Copas."},
    {anio:1984,hito:"Intercontinental",txt:"Campeón del mundo vs Liverpool."},
    {anio:2026,hito:"Hoy",txt:"Libertadores de América. El clásico de Avellaneda define la semana."}
  ],
  VEL:[
    {anio:1910,hito:"Fundación",txt:"Vélez Sarsfield. Liniers, el Fortín."},
    {anio:1994,hito:"Libertadores",txt:"Campeón de América con Bianchi."},
    {anio:2026,hito:"Hoy",txt:"José Amalfitani. Cantera y pelea de arriba."}
  ],
  SLO:[
    {anio:1908,hito:"Fundación",txt:"San Lorenzo de Almagro. El Ciclón, Boedo."},
    {anio:2014,hito:"Libertadores",txt:"Campeón de América 2014."},
    {anio:2026,hito:"Hoy",txt:"Pedro Bidegain. Identidad de barrio, no de marketing."}
  ],
  ELP:[
    {anio:1905,hito:"Fundación",txt:"Estudiantes de La Plata. El Pincharrata."},
    {anio:2009,hito:"Libertadores",txt:"Campeón de América 2009 con Sabella."},
    {anio:2026,hito:"Hoy",txt:"El clásico platense vs Gimnasia manda."}
  ],
  ROS:[
    {anio:1889,hito:"Fundación",txt:"Rosario Central, 1889. El Canalla, Arroyito."},
    {anio:2026,hito:"Hoy",txt:"Clásico rosarino vs Newell's. Liga Profesional, AFA."}
  ],
  NEW:[
    {anio:1903,hito:"Fundación",txt:"Newell's Old Boys. La Lepra, Parque Independencia."},
    {anio:2026,hito:"Hoy",txt:"El clásico de Rosario no se negocia."}
  ],
  HUR:[
    {anio:1908,hito:"Fundación",txt:"Huracán. El Globo, Parque Patricios."},
    {anio:2026,hito:"Hoy",txt:"Clásico vs San Lorenzo. Tomás Adolfo Ducó."}
  ],
  LAN:[
    {anio:1915,hito:"Fundación",txt:"Lanús. El Granate."},
    {anio:2026,hito:"Hoy",txt:"Sur del GBA. Pelea continental cuando ordena."}
  ],
  ARG:[
    {anio:1904,hito:"Fundación",txt:"Argentinos Juniors. La Paternal, cuna de Maradona."},
    {anio:2026,hito:"Hoy",txt:"Diego Armando Maradona (estadio). Cantera primero."}
  ],
  GLP:[
    {anio:1887,hito:"Fundación",txt:"Gimnasia y Esgrima La Plata, 1887. El Lobo."},
    {anio:2026,hito:"Hoy",txt:"Clásico platense vs Estudiantes. El Bosque."}
  ],
  BEL:[
    {anio:1905,hito:"Fundación",txt:"Belgrano de Córdoba. El Pirata."},
    {anio:2026,hito:"Hoy",txt:"Clásico cordobés vs Talleres."}
  ],
  TAL:[
    {anio:1913,hito:"Fundación",txt:"Talleres de Córdoba. La T."},
    {anio:2026,hito:"Hoy",txt:"Kempes. Ambición de grande del interior."}
  ],
  TUC:[
    {anio:1902,hito:"Fundación",txt:"Atlético Tucumán. El Decano del norte."},
    {anio:2026,hito:"Hoy",txt:"José Fierro. El viaje es un arma."}
  ],
  BAN:[
    {anio:1896,hito:"Fundación",txt:"Banfield. El Taladro."},
    {anio:2026,hito:"Hoy",txt:"Florencio Sola. Clásico del sur vs Lanús."}
  ],
  PLA:[
    {anio:1905,hito:"Fundación",txt:"Platense. El Calamar, Vicente López."},
    {anio:2026,hito:"Hoy",txt:"Quedarse en Primera es el plan."}
  ],
  UNI:[
    {anio:1907,hito:"Fundación",txt:"Unión de Santa Fe. El Tatengue."},
    {anio:2026,hito:"Hoy",txt:"15 de Abril. Interior que incomoda."}
  ],
  TIG:[
    {anio:1902,hito:"Fundación",txt:"Tigre. Victoria, el Matador."},
    {anio:2026,hito:"Hoy",txt:"Dellagiovanna. Yo-yo de categoría."}
  ],
  DYJ:[
    {anio:1935,hito:"Fundación",txt:"Defensa y Justicia. Varela, el Halcón."},
    {anio:2020,hito:"Sudamericana",txt:"Campeón de la Sudamericana 2020."},
    {anio:2026,hito:"Hoy",txt:"Club chico de copas. Modelo raro y efectivo."}
  ],
  INS:[
    {anio:1918,hito:"Fundación",txt:"Instituto de Córdoba. La Gloria."},
    {anio:2026,hito:"Hoy",txt:"Juan Domingo Perón. Cantera cordobesa."}
  ],
  CCO:[
    {anio:1919,hito:"Fundación",txt:"Central Córdoba de Santiago del Estero."},
    {anio:2026,hito:"Hoy",txt:"Madre de Ciudades. El norte argentino, no el chileno."}
  ],
  IRV:[
    {anio:1913,hito:"Fundación",txt:"Independiente Rivadavia, Mendoza. La Lepra mendocina."},
    {anio:2026,hito:"Hoy",txt:"Bautista Gargantini. El Cuyo en Primera."}
  ],
  SAR:[
    {anio:1911,hito:"Fundación",txt:"Sarmiento de Junín. El Verde."},
    {anio:2026,hito:"Hoy",txt:"Eva Perón. Pueblo del interior bonaerense."}
  ],
  ALD:[
    {anio:1913,hito:"Fundación",txt:"Aldosivi, Mar del Plata. El Tiburón."},
    {anio:2026,hito:"Hoy",txt:"Minella. Verano y distancia."}
  ],
  GME:[
    {anio:1908,hito:"Fundación",txt:"Gimnasia de Mendoza. El Lobo mendocino. Ascendió 2025."},
    {anio:2026,hito:"Hoy",txt:"Legrotaglie. Recién llegado a la Liga Profesional."}
  ],
  RIE:[
    {anio:1931,hito:"Fundación",txt:"Deportivo Riestra. El Malevo, Villa Soldati."},
    {anio:2026,hito:"Hoy",txt:"Guillermo Laza, 3.000 almas. Club chico de verdad."}
  ],
  ERC:[
    {anio:1912,hito:"Fundación",txt:"Estudiantes de Río Cuarto. Ascendió 2025."},
    {anio:2026,hito:"Hoy",txt:"Antonio Candini. El interior profundo en Primera."}
  ],
  BAR:[
    {anio:1904,hito:"Fundación",txt:"Barracas Central. El Guapo, La Ribera."},
    {anio:2026,hito:"Hoy",txt:"Chiqui Tapia (estadio). Barrio, no marketing."}
  ],
  /* Segunda: fundaciones que estaban solo en «Hoy» */
  LIN:[
    {anio:1956,hito:"Fundación",txt:"Deportes Linares, 1956. Albirrojo del Maule, Fiscal Tucapel Bustamante."},
    {anio:2026,hito:"Hoy",txt:"Segunda, zona Sur. Pelea el salto a la B."}
  ],
  CLC:[
    {anio:1957,hito:"Fundación",txt:"Colchagua de San Fernando, 1957. Valle, no vitrina."},
    {anio:2026,hito:"Hoy",txt:"Estadio Jorge Silva. Volvió al profesionalismo."}
  ],
  OVA:[
    {anio:1942,hito:"Fundación",txt:"Provincial Ovalle: 1 de junio de 1942 como Club Deportivo Socos. El Ciclón del Limarí."},
    {anio:2023,hito:"Ascenso",txt:"Campeón de Tercera A 2023: entra a Segunda."},
    {anio:2026,hito:"Hoy",txt:"Estadio Diaguita. Zona Norte."}
  ],
  CNA:[
    {anio:1914,hito:"Fundación",txt:"Concón National, 8 de mayo de 1914 (ASIFUCH / ANFP). Litoral de Valparaíso."},
    {anio:2023,hito:"Ascenso",txt:"Subcampeón de Tercera A 2023: entra al profesionalismo."},
    {anio:2026,hito:"Hoy",txt:"Estadio Atlético Municipal. Escribe su propia historia en Segunda."}
  ],
  BSA:[
    {anio:2015,hito:"Fundación",txt:"Brujas de Salamanca, 24 de enero de 2015. Pueblo del Choapa."},
    {anio:2024,hito:"Ascenso",txt:"Sube a Segunda División Profesional."},
    {anio:2026,hito:"Hoy",txt:"Municipal de Salamanca. Identidad de pueblo."}
  ],
  RSJ:[
    {anio:1998,hito:"Fundación",txt:"15 de diciembre de 1998, escuela Bam Bam Zamorano en La Legua. Hoy Real San Joaquín."},
    {anio:2021,hito:"Ascenso",txt:"Subcampeón de Tercera A: llega a Segunda."},
    {anio:2026,hito:"Hoy",txt:"Municipal de San Joaquín. Club-escuela, poco aforo, muchos cadetes."}
  ],
  SCI:[
    {anio:2020,hito:"Fundación",txt:"Santiago City: fuentes 2020 (EN wiki) vs 2022 (prensa local). Colores negro y rosa documentados. Año de fundación: sin verificar unánime."},
    {anio:2024,hito:"Ascenso",txt:"Campeón de Tercera A 2024: entra a Segunda."},
    {anio:2026,hito:"Hoy",txt:"Municipal de Lo Barnechea. Proyecto joven de la capital."}
  ],
  GVE:[
    {anio:1908,hito:"Fundación",txt:"General Velásquez, 8 de enero de 1908, San Vicente de Tagua Tagua. Los Verdes."},
    {anio:2017,hito:"Tercera A",txt:"Campeón de Tercera A 2017: vuelve al profesionalismo."},
    {anio:2026,hito:"Hoy",txt:"Augusto Rodríguez. Club de pueblo del secano."}
  ],
  REN:[
    {anio:1984,hito:"Fundación",txt:"Deportes Rengo, 18 de marzo de 1984. Oro y Cielo."},
    {anio:2015,hito:"Copa Absoluta",txt:"Campeón de la Copa Absoluta ANFA 2015 vs Real San Joaquín."},
    {anio:2026,hito:"Hoy",txt:"Municipal Guillermo Guzmán Díaz. Primero, sobrevivir."}
  ],
  COL:[
    {anio:2014,hito:"Fundación",txt:"Atlético Colina, 27 de noviembre de 2014. El Gigante de Chacabuco."},
    {anio:2025,hito:"Ascenso",txt:"Campeón de Tercera A 2025: vuelve al profesionalismo."},
    {anio:2026,hito:"Hoy",txt:"Municipal Manuel Rojas. Comuna al norte de Santiago."}
  ]
};
(function mergeHistoriaE(){
  if(typeof HISTORIA_LINEA!=="object") return;
  Object.keys(HISTORIA_TAREA_E).forEach(function(id){
    var add=HISTORIA_TAREA_E[id];
    var cur=HISTORIA_LINEA[id];
    if(!cur || cur.length<=1){ HISTORIA_LINEA[id]=add; return; }
    add.forEach(function(h){
      if(!cur.some(function(x){ return x.anio===h.anio && x.hito===h.hito; })){
        var i=cur.length;
        for(var k=0;k<cur.length;k++){ if(cur[k].hito==="Hoy"){ i=k; break; } }
        if(h.hito==="Hoy"){ cur[i]=h; }
        else cur.splice(i,0,h);
      }
    });
  });
})();

/* E-7 · línea de formatos Chile 2009→2026 (cambios REALES, no ficción). */
(function lineaFormatosE(){
  if(typeof FORMAT_CHILE_LINEA==="undefined" || !Array.isArray(FORMAT_CHILE_LINEA)) return;
  var extra=[
    {anio:2009, n:18, pts:3, forma:"Apertura/Clausura con playoffs, 18 clubes",
      desc:"Baja de 20 a 18. Siguen los playoffs. Universidad de Chile campeón del Apertura."},
    {anio:2013, n:18, pts:3, forma:"Apertura 2013 / Clausura 2014 (transición de calendario)",
      desc:"Se desfasó el año. O'Higgins campeón del Apertura 2013 (primera estrella)."},
    {anio:2018, n:16, pts:3, forma:"torneo largo anual, 16 clubes",
      desc:"Vuelve un solo campeón por año. Católica arranca el tetra 2018-2021."},
    {anio:2020, n:16, pts:3, forma:"torneo COVID (calendario excepcional)",
      desc:"Pandemia. Formato excepcional. Hecho: no se simula igual que un año normal."},
    {anio:2023, n:16, pts:3, forma:"Liga de Primera (anual), 16 clubes",
      desc:"Huachipato campeón. El molde actual de 16."},
    {anio:2026, n:16, pts:3, forma:"Liga de Primera 16 + Copa de la Liga (1ª) + Supercopa Final Four",
      desc:"2 descensos. Copa Chile. Copa de la Liga solo Primera. Segunda: zonas Norte/Sur + liguilla."}
  ];
  extra.forEach(function(x){
    if(!FORMAT_CHILE_LINEA.some(function(y){ return y.anio===x.anio; })) FORMAT_CHILE_LINEA.push(x);
  });
  FORMAT_CHILE_LINEA.sort(function(a,b){ return a.anio-b.anio; });
})();

/* E-8 · aforo Osorno 12.000 → 11.000 (Wikipedia Rubén Marcos Peralta). */
const ESTADIO_FIX_84=[
  {id:"OSO", campo:"aforo", de:12000, a:11000, fuente:"Wikipedia Estadio Rubén Marcos Peralta"}
];
(function fixEstadios84(){
  if(typeof ESTADIOS_DATA!=="object") return;
  ESTADIO_FIX_84.forEach(function(f){
    if(ESTADIOS_DATA[f.id] && ESTADIOS_DATA[f.id][f.campo]===f.de)
      ESTADIOS_DATA[f.id][f.campo]=f.a;
  });
  if(typeof LIGA_C_2026!=="undefined"){
    LIGA_C_2026.forEach(function(c){ if(c.id==="OSO" && c.aforo===12000) c.aforo=11000; });
  }
})();

/* E-3 · caja Segunda: tope para que no parezcan un grande. Aproximado. */
(function cajaSegunda84(){
  if(typeof CAJA_BASE_2026!=="object") return;
  var ids=(typeof idsSegunda==="function")?idsSegunda():[];
  ids.forEach(function(id){
    var c=CAJA_BASE_2026[id]; if(!c) return;
    if(c.plata>180) c.plata=180;
    if(c.deuda>90) c.deuda=90;
  });
})();

/* E-12 · 1925: nada moderno (VAR, sponsors, bolsa). */
(function wrap1925mas(){
  if(typeof SECCIONES_OCULTAS_1925!=="undefined"){
    ["bolsa","casino"].forEach(function(s){
      if(SECCIONES_OCULTAS_1925.indexOf(s)<0) SECCIONES_OCULTAS_1925.push(s);
    });
  }
  if(typeof ERA==="object" && ERA[1925]){
    ERA[1925].secciones_ocultas=(typeof SECCIONES_OCULTAS_1925!=="undefined")?SECCIONES_OCULTAS_1925:["redes","mercado"];
    ERA[1925].var=false;
    ERA[1925].pts=2;
  }
})();

/* E-10 · Plop: titulares AFA / Segunda / clásico porteño. Sin voseo argentino. */
const PRENSA_TAREA_E=[
  {ctx:"titular", registro:"neutro", txt:"Clásico Porteño: Wanderers y Everton se miran de nuevo."},
  {ctx:"titular", registro:"cl", txt:"VALPO SE PRENDE. El clásico del puerto no es el de Santiago, po."},
  {ctx:"titular", registro:"neutro", txt:"Cobreloa–Antofagasta: el clásico del Norte, no un trámite."},
  {ctx:"titular", registro:"neutro", txt:"Liga Profesional (AFA): el Superclásico define la fecha en Argentina."},
  {ctx:"titular", registro:"neutro", txt:"Avellaneda: Racing e Independiente, el clásico que no es de Buenos Aires capital."},
  {ctx:"titular", registro:"cl", txt:"EN SEGUNDA EL VIAJE ES EL RIVAL. Ovalle, Osorno, Salamanca: la plata se va en bus."},
  {ctx:"titular", registro:"neutro", txt:"Segunda: zonas Norte y Sur, después liguilla de 7. No es la B."},
  {ctx:"clasico", registro:"cl", txt:"Si te toca el porteño, no es un partido más. Es Valparaíso contra Viña."}
];
(function mixPrensaE(){
  if(typeof TUITS_MOMENTO!=="object") return;
  PRENSA_TAREA_E.forEach(function(t){
    var ctx=t.ctx||"titular";
    TUITS_MOMENTO[ctx]=TUITS_MOMENTO[ctx]||[];
    TUITS_MOMENTO[ctx].push(t);
  });
})();

/* E-1 · panel de situación en el Escritorio (2026), sin tocar 1925/2006 (epoca-intro). */
(function wrapSit84(){
  if(typeof vistaEscritorio!=="function" || vistaEscritorio._sit84) return;
  var orig=vistaEscritorio;
  vistaEscritorio=function(){
    orig();
    try{
      if(!E || (E.eraBase===1925 || E.eraBase===2006)) return;
      var sit=SITUACION_CLUB[E.club]; if(!sit) return;
      var v=document.getElementById("vista"); if(!v || v.querySelector(".sit-club")) return;
      var p=panel("🎯 Tu situación","🎯","agua");
      p.classList.add("sit-club");
      p.cuerpo.appendChild(el("p","mini",sit));
      var clas="";
      if(typeof RIVALIDADES_2026!=="undefined"){
        var pares=RIVALIDADES_2026.filter(function(par){ return par[0]===E.club||par[1]===E.club; });
        if(pares.length){
          clas=pares.map(function(par){
            var o=par[0]===E.club?par[1]:par[0];
            var n=(typeof clubMundo==="function"&&clubMundo(o)&&clubMundo(o).n)||o;
            return n;
          }).join(", ");
          p.cuerpo.appendChild(el("p","mini","<b>Clásico(s):</b> "+clas));
        }
      }
      v.insertBefore(p, v.firstChild);
    }catch(e){}
  };
  vistaEscritorio._sit84=true;
})();

/* ============================================================
   7.86 · lo que TAREA E todavía tenía hueco (auditoría en vivo)
   · E-3 River/Boca con caja de Segunda (registrarLiga _cajaDeFuerza)
   · E-8 ESTADIOS_DATA solo cubría Primera
   · E-2 clásicos que seguían huérfanos (OHI, NUB, clásico mendocino…)
   · E-11/13 9 argentinos sin botón dorado
   · E-7 FORMAT_CHILE_LINEA no se aplicaba al pasar de año
   · E-12 trivia con VAR en 1925
   Planteles Segunda/Argentina: SIGUEN sin inventarse.
   ============================================================ */

const CAJA_ARG_86={
  RIV:{plata:1800,deuda:900}, BOC:{plata:1700,deuda:880},
  RAC:{plata:950,deuda:420}, IND:{plata:900,deuda:450},
  VEL:{plata:850,deuda:380}, SLO:{plata:800,deuda:400},
  ELP:{plata:720,deuda:320}, ROS:{plata:680,deuda:300},
  NEW:{plata:650,deuda:290}, TAL:{plata:720,deuda:340},
  HUR:{plata:600,deuda:280}, LAN:{plata:620,deuda:270},
  ARG:{plata:580,deuda:250}, GLP:{plata:500,deuda:240},
  BEL:{plata:520,deuda:230}, DYJ:{plata:480,deuda:200},
  INS:{plata:420,deuda:180}, UNI:{plata:400,deuda:170},
  TUC:{plata:380,deuda:160}, TIG:{plata:360,deuda:170},
  BAN:{plata:450,deuda:190}, PLA:{plata:340,deuda:150},
  CCO:{plata:320,deuda:140}, IRV:{plata:300,deuda:130},
  SAR:{plata:280,deuda:120}, ALD:{plata:300,deuda:140},
  GME:{plata:260,deuda:110}, RIE:{plata:180,deuda:80},
  ERC:{plata:240,deuda:100}, BAR:{plata:220,deuda:90}
};
const IND_ARG_86={
  RIV:{hinchada:95,socios:88,estadio:95,prestigio:94,plantel:86,moral:70,cantera:78,riesgo:22},
  BOC:{hinchada:96,socios:86,estadio:90,prestigio:93,plantel:84,moral:68,cantera:72,riesgo:24},
  RAC:{hinchada:82,socios:70,estadio:84,prestigio:82,plantel:80},
  IND:{hinchada:84,socios:68,estadio:82,prestigio:84,plantel:78},
  VEL:{hinchada:76,socios:62,estadio:80,prestigio:80,plantel:77},
  SLO:{hinchada:80,socios:64,estadio:76,prestigio:80,plantel:76}
};
(function economiaArg86(){
  if(typeof CAJA_BASE_2026==="object"){
    Object.keys(CAJA_ARG_86).forEach(function(id){
      CAJA_BASE_2026[id]=Object.assign({}, CAJA_BASE_2026[id]||{}, CAJA_ARG_86[id]);
    });
  }
  if(typeof IND_BASE_2026==="object"){
    Object.keys(IND_ARG_86).forEach(function(id){
      IND_BASE_2026[id]=Object.assign({}, IND_BASE_2026[id]||{}, IND_ARG_86[id]);
    });
  }
})();

const RIVALIDADES_86=[
  ["DCO","FV"],   /* clásico penquista tradicional (Vial es 1991) */
  ["OHI","RAN"],  /* O'Higgins–Rangers, región */
  ["NUB","TEM"],  /* Ñuble–Araucanía */
  ["GME","IRV"],  /* clásico mendocino */
  ["ARG","PLA"],  /* Paternal–Vicente López */
  ["TIG","PLA"],  /* zona norte GBA */
  ["INS","TAL"]   /* Córdoba: Instituto–Talleres */
];
(function rivales86(){
  if(typeof RIVALIDADES_2026==="undefined") return;
  RIVALIDADES_86.forEach(function(par){
    var hay=RIVALIDADES_2026.some(function(p){
      return (p[0]===par[0]&&p[1]===par[1])||(p[0]===par[1]&&p[1]===par[0]);
    });
    if(!hay) RIVALIDADES_2026.push(par);
  });
})();

const EPOCAS_86={
  INS:[{anio:2022,etq:"2022 · La Gloria vuelve",
    desc:"Instituto asciende a Primera 2022. Córdoba, cantera. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:66,moral:80,hinchada:74,socios:44,cantera:58,estadio:60,prestigio:56,riesgo:30},
    caja:{plata:200,deuda:90}}],
  UNI:[{anio:2019,etq:"2019 · Sudamericana",
    desc:"Unión de Santa Fe en copa. El Tatengue incomoda. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:70,moral:76,hinchada:72,socios:46,cantera:50,estadio:58,prestigio:60,riesgo:28},
    caja:{plata:220,deuda:100}}],
  TIG:[{anio:2019,etq:"2019 · Copa de la Superliga",
    desc:"Tigre campeón de la Copa de la Superliga 2019. (Plantel: cantera.)",
    dt:"Néstor Gorosito",
    ind:{plantel:74,moral:84,hinchada:76,socios:48,cantera:50,estadio:62,prestigio:68,riesgo:24},
    caja:{plata:260,deuda:110}}],
  PLA:[{anio:2021,etq:"2021 · El Calamar vuelve",
    desc:"Platense asciende a Primera 2021, 22 años después. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:64,moral:80,hinchada:70,socios:40,cantera:46,estadio:54,prestigio:52,riesgo:32},
    caja:{plata:180,deuda:80}}],
  CCO:[{anio:2019,etq:"2019 · Primera vez",
    desc:"Central Córdoba (SdE) llega a Primera. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:62,moral:78,hinchada:68,socios:36,cantera:42,estadio:70,prestigio:50,riesgo:32},
    caja:{plata:160,deuda:70}}],
  IRV:[{anio:2023,etq:"2023 · La Lepra en Primera",
    desc:"Independiente Rivadavia asciende a Primera 2023. Mendoza. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:64,moral:80,hinchada:72,socios:40,cantera:44,estadio:56,prestigio:52,riesgo:30},
    caja:{plata:170,deuda:75}}],
  SAR:[{anio:2021,etq:"2021 · El Verde en Primera",
    desc:"Sarmiento de Junín se afirma en Primera. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:62,moral:76,hinchada:66,socios:36,cantera:42,estadio:50,prestigio:48,riesgo:32},
    caja:{plata:150,deuda:70}}],
  ALD:[{anio:2015,etq:"2015 · El Tiburón en honor",
    desc:"Aldosivi en Primera. Mar del Plata, verano y distancia. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:64,moral:74,hinchada:68,socios:38,cantera:42,estadio:66,prestigio:50,riesgo:32},
    caja:{plata:170,deuda:80}}],
  BAR:[{anio:2022,etq:"2022 · El Guapo en Primera",
    desc:"Barracas Central llega a Primera 2022. La Ribera. (Plantel: cantera.)",
    dt:"el cuerpo técnico",
    ind:{plantel:60,moral:76,hinchada:58,socios:32,cantera:40,estadio:36,prestigio:46,riesgo:34},
    caja:{plata:140,deuda:60}}]
};
(function epocas86(){
  if(typeof EPOCAS_CLUB!=="object") return;
  Object.keys(EPOCAS_86).forEach(function(id){
    var add=EPOCAS_86[id]||[];
    var cur=EPOCAS_CLUB[id]||[];
    add.forEach(function(ep){
      if(!cur.some(function(x){ return x.anio===ep.anio; })) cur.push(ep);
    });
    EPOCAS_CLUB[id]=cur;
  });
})();

/* E-8 · ESTADIOS_DATA para B / Segunda / Argentina (nombre+aforo del array de liga).
   Sectores genéricos marcados como aproximación. No se inventa el estadio. */
(function estadios86(){
  if(typeof ESTADIOS_DATA!=="object") return;
  function gen(aforo){
    var p=Math.max(4000, Math.round((aforo||10000)/15)*100);
    return [
      {n:"Popular", tipo:"popular", cuota:0.40, precio:p},
      {n:"Tribuna", tipo:"tribuna", cuota:0.40, precio:p*2},
      {n:"Preferencial", tipo:"premium", cuota:0.20, precio:p*4}
    ];
  }
  function carga(arr){
    if(!arr) return;
    arr.forEach(function(c){
      if(!c||!c.id) return;
      if(ESTADIOS_DATA[c.id]){
        if(c.aforo && !ESTADIOS_DATA[c.id].aforo) ESTADIOS_DATA[c.id].aforo=c.aforo;
        return;
      }
      ESTADIOS_DATA[c.id]={
        nombre:c.est||("Estadio de "+(c.ciudad||c.n)),
        aforo:c.aforo||8000,
        aproximado:true,
        sectores:gen(c.aforo)
      };
    });
  }
  if(typeof LIGA_B_2026!=="undefined") carga(LIGA_B_2026);
  if(typeof LIGA_C_2026!=="undefined") carga(LIGA_C_2026);
  if(typeof LIGA_ARG_2026!=="undefined") carga(LIGA_ARG_2026);
})();

/* E-7 · al pasar de año, los pts de la línea real (1995=3, 1991=2). El n de clubes
   lo arma Claude: cambiar el tamaño de la liga rompe tablas. */
(function wrapFormato86(){
  if(typeof nuevoAnio!=="function" || nuevoAnio._e86) return;
  var orig=nuevoAnio;
  nuevoAnio=function(){
    orig();
    try{
      if(!E || typeof FORMAT_CHILE_LINEA==="undefined") return;
      if(!(E.eraBase===2026||E.eraBase===1991||E.eraBase===2006)) return;
      var f=null;
      FORMAT_CHILE_LINEA.forEach(function(x){ if(x.anio<=E.anio) f=x; });
      if(f && typeof ERA==="object" && ERA[E.eraBase] && f.pts)
        ERA[E.eraBase].puntosVictoria=f.pts;
    }catch(e){}
  };
  nuevoAnio._e86=true;
})();

/* E-12 · en 1925 el VAR no existe: se saca de la trivia. */
(function trivia1925(){
  if(typeof TRIVIA_FUT==="undefined" || !Array.isArray(TRIVIA_FUT)) return;
  if(typeof nuevaPartida!=="function" || nuevaPartida._e86triv) return;
  var ORIG=TRIVIA_FUT.slice();
  var orig=nuevaPartida;
  nuevaPartida=function(club, year, modo, extra){
    var r=orig(club, year, modo, extra);
    try{
      var src=ORIG;
      if(E && E.eraBase===1925){
        src=ORIG.filter(function(t){
          var q=(t.q||"")+" "+(t.op||[]).join(" ");
          return !/VAR|Cinco|Libertadores/i.test(q);
        });
      }
      TRIVIA_FUT.length=0;
      src.forEach(function(t){ TRIVIA_FUT.push(t); });
    }catch(e){}
    return r;
  };
  nuevaPartida._e86triv=true;
})();
