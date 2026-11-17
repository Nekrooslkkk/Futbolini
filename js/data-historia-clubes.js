"use strict";
/* ============================================================
   FUTBOLINI · data-historia-clubes.js — 7.9133 · LA HISTORIA REAL DE LOS CLUBES (para aprender jugando)
   Pedido del autor (13 oct 2026): "armar la historia de los clubes, porque de Deportes Rengo ni idea, y la idea es al
   menos aprender; que sus capítulos no sean siempre los mismos. El de Colo-Colo tiene épica porque te dice cosas del club;
   el de Rengo es 'subir precio' y pura obviedad".
   Cómo se hace (scripts/historia_clubes.py, ver PATCHES 7.9133):
     1. HECHOS con fuente (scripts/historia/<ID>.json): solo lo que está escrito en la fuente, con la fecha de consulta.
     2. DeepSeek redacta hitos y arcos usando SOLO esos hechos; Claude lo revisa a mano (lo inventado se borra).
     3. Acá queda lo revisado: la LÍNEA (hechos públicos, en 3.ª persona) y los ARCOS (dilemas de HOY, ficción del juego,
        anclados en un hecho real que el jugador aprende al leer el contexto).
   Integridad: las personas reales solo aparecen como hechos, nunca hablan ni opinan. El doctor `historia_clubes` lo vigila.
   ============================================================ */
const HISTORIA_CLUBES={
  /* ---------- DEPORTES RENGO · "Oro y Cielo", "El Bravo entre los Bravos" ----------
     Fuente: https://es.wikipedia.org/wiki/Club_de_Deportes_Rengo (consultado 2026-10-13); 2024: https://en.wikipedia.org/wiki/Deportes_Rengo */
  REN:{
    fuente:"https://es.wikipedia.org/wiki/Club_de_Deportes_Rengo", consultado:"2026-10-13",
    apodos:["Oro y Cielo","El Bravo entre los Bravos"],
    hitos:[
      {anio:1984,hito:"Fundación",txt:"18 de marzo. Nace bajo la Asociación de Fútbol de Rengo para juntar a los clubes de la comuna en un solo equipo en la Tercera de ANFA, con los colores de la selección comunal."},
      {anio:1986,hito:"Apertura de Tercera",txt:"Campeón del Apertura de Tercera División: final con Comercio de Llay-Llay (1-1 en casa, 2-0 de visita). Lo sostienen las fábricas de la comuna: Viamaxi, Temsa y Bticino."},
      {anio:1996,hito:"Semillero tricampeón",txt:"El club es la base de las selecciones de Rengo campeonas nacionales amateur en 1986 (Valdivia), 1989 (Curicó) y 1996, en casa."},
      {anio:1997,hito:"Se van las fábricas",txt:"Cierran de a poco las fábricas que lo bancaban. Termina último de su grupo y baja a su asociación de origen: años de torneos locales."},
      {anio:2010,hito:"El regreso",txt:"Con apoyo municipal y jugadores que le facilita O'Higgins vuelve al fútbol amateur nacional (Tercera B): termina tercero. Sus juveniles ganan el Torneo de Novatos sub-18."},
      {anio:2013,hito:"Sube de Cuarta",txt:"Asciende en el Clausura de Cuarta División, junto a Deportes Limache, Estrella del Huasco, Deportivo Estación Central y Provincial Marga Marga."},
      {anio:2015,hito:"Copa Absoluta",txt:"Campeón de la nueva Copa Absoluta de ANFA (Tercera A y B), con Fred Gayoso en la banca: 5-1 en el global a Real San Joaquín."},
      {anio:2017,hito:"Por un gol",txt:"Queda a nada del profesionalismo en la Tercera A: el ascenso se lo lleva Fernández Vial por diferencia de goles."},
      {anio:2022,hito:"La noche de Puente Alto",txt:"Empata la última fecha y el ascenso directo se escapa. ANFA abre un cupo: 4 de diciembre, 1-1 con Deportes Colina y 7-6 en penales. Cristóbal Lecaros ataja el último: primer ascenso al profesionalismo."},
      {anio:2023,hito:"Local en San Fernando",txt:"Mientras remodelan el Guillermo Guzmán Díaz (de los años 60, 3.000 personas) juega de local en San Fernando. Le hace 5-0 a Deportes Concepción, su mayor goleada en Segunda."},
      {anio:2024,hito:"Cuarto en Segunda",txt:"Termina cuarto en la Segunda División Profesional."}
    ],
    /* dilemas de HOY (ficción del juego) anclados en esos hechos. Redactados con DeepSeek desde los hechos y revisados. */
    arcos:[{
      id:"ren_h_casa", t:"La casa del Bravo", desc:"El estadio es municipal, la remodelación costó y la Segunda exige: ¿quién manda en la casa?",
      capitulos:[
        {id:"ren_h_casa_1", t:"El patio prestado", ctx:"El Guillermo Guzmán Díaz es de la Municipalidad, de los años 60, y tras el ascenso de 2022 hubo que remodelarlo: en 2023 fuiste local en San Fernando. Hoy el municipio te pide el estadio dos días a la semana para actividades de la comuna.",
         ops:[
          {t:"Ceder los días que piden", d:"El municipio queda contento; el pasto lo paga.", ef:{plata:-5,moral:-2}, grupos:{comunidad:8,hinchada:-3,directorio:-4}, mem:"le abriste el estadio a la comuna aunque se te rompiera el pasto", va:"ren_h_casa_2"},
          {t:"Negarte: el calendario es del club", d:"Cuidas la cancha y te peleas con el alcalde.", ef:{prestigio:1}, grupos:{hinchada:3,directorio:3,comunidad:-8}, mem:"le cerraste el estadio a la comuna", va:"ren_h_casa_2"},
          {t:"Convenio con arriendo de por medio", d:"Todo por escrito. Y pagas.", ef:{plata:-15,prestigio:2}, grupos:{directorio:2,comunidad:3,sponsors:2}, mem:"firmaste un convenio caro con el municipio por tu propia casa", va:"ren_h_casa_2"}
         ]},
        {id:"ren_h_casa_2", t:"La cancha se cae", ctx:"Las obras que en 2023 te mandaron a San Fernando terminaron, pero la cancha no drena y el pasto se levanta en cada lluvia. Las bases de la Segunda piden un mínimo y el informe del veedor llega en dos fechas.",
         ops:[
          {t:"Drenaje nuevo, cueste lo que cueste", d:"Te descapitalizas, pero la cancha queda de profesional.", ef:{plata:-30,prestigio:3,capital:2}, grupos:{hinchada:4,anfp:3,directorio:-3}, mem:"pagaste el drenaje aunque la caja no daba", va:"ren_h_casa_3"},
          {t:"Parche con arena y a rezar", d:"Te ahorras la obra; la ANFP te anota y la hinchada lo ve.", ef:{plata:10,moral:-2,prestigio:-3}, grupos:{anfp:-6,hinchada:-3}, mem:"parchaste la cancha con arena y la ANFP te anotó", va:"ren_h_casa_3"},
          {t:"Que lo pague la Municipalidad", d:"Lo pagan ellos. La cuenta te la cobran en la próxima.", ef:{plata:5}, grupos:{comunidad:-4,directorio:-3,anfp:-1}, mem:"le pasaste la cuenta de la cancha al municipio", va:"ren_h_casa_3"}
         ]},
        {id:"ren_h_casa_3", t:"Localía en venta", ctx:"En Tercera tu alternativa era el Municipal de Rosario; en 2023 te recibió San Fernando. Hoy la Municipalidad de Rengo no firma la concesión larga y San Fernando ofrece su estadio por dos años.",
         ops:[
          {t:"Firmar con San Fernando", d:"Estabilidad. El hincha de Rengo deja de viajar.", ef:{plata:-10,moral:-2}, grupos:{hinchada:-6,comunidad:-5,anfp:3}, mem:"mandaste al Bravo a jugar de local fuera de Rengo", cierra:true},
          {t:"Volver a Rosario, más barato", d:"Ahorras, pero la cancha chica no levanta.", ef:{plata:6,moral:-3,prestigio:-2}, grupos:{hinchada:-6,sponsors:-2}, mem:"te fuiste a Rosario para ahorrar", cierra:true},
          {t:"Plantarte por la concesión en Rengo", d:"Te juegas la relación con el municipio por la casa.", ef:{plata:-8,moral:2,prestigio:3}, grupos:{hinchada:6,comunidad:5,directorio:-5}, mem:"te plantaste para que el Bravo juegue en Rengo", cierra:true}
         ]}
      ]
    },{
      id:"ren_h_cantera", t:"La cantera brava", desc:"El club fue semillero de tres selecciones campeonas. Hoy el semillero pide plata y paciencia.",
      capitulos:[
        {id:"ren_h_cantera_1", t:"Los cabros del oro", ctx:"Este club fue la base de las selecciones de Rengo campeonas nacionales amateur en 1986, 1989 y 1996, y en 2010 sus juveniles ganaron el Torneo de Novatos. Hoy tres juveniles piden contrato profesional y un club grande pregunta por ellos.",
         ops:[
          {t:"Contrato profesional a los tres", d:"Retienes talento; la planilla sube.", ef:{plata:-20,moral:3,prestigio:2}, grupos:{camarin:5,hinchada:4,directorio:-2}, mem:"le hiciste contrato a los cabros de Rengo", va:"ren_h_cantera_2"},
          {t:"Venderlos ahora", d:"Haces caja; la hinchada te dice vendido.", ef:{plata:25,moral:-3,prestigio:-2}, grupos:{hinchada:-7,camarin:-5,directorio:4}, mem:"vendiste a los cabros de la cantera apenas pidieron contrato", va:"ren_h_cantera_2"},
          {t:"Prestarlos para que se fogueen", d:"No gastas, pero se te pueden ir libres.", ef:{plata:-2}, grupos:{camarin:1,hinchada:-2}, mem:"mandaste a los juveniles a foguearse afuera", va:"ren_h_cantera_2"}
         ]},
        {id:"ren_h_cantera_2", t:"El convenio con O'Higgins", ctx:"En 2010 O'Higgins le facilitó jugadores al club para volver al fútbol nacional. Hoy te ofrecen un convenio: tres sub-21 a préstamo sin costo, con la condición de que jueguen. Tu técnico quiere elegir él.",
         ops:[
          {t:"Aceptar el convenio", d:"Plantel barato; el camarín y el técnico se molestan.", ef:{plata:10,moral:-2,prestigio:2}, grupos:{camarin:-5,tecnico:-4,directorio:3}, mem:"aceptaste los préstamos de O'Higgins con cláusula de titular", va:"ren_h_cantera_3"},
          {t:"Rechazarlo y confiar en los tuyos", d:"Identidad; faltan piernas.", ef:{plata:-5,moral:3,capital:-2}, grupos:{camarin:4,tecnico:3,hinchada:5,directorio:-2}, mem:"rechazaste el convenio y confiaste en tu cantera", va:"ren_h_cantera_3"},
          {t:"Uno solo, sin exigencias, y pagando", d:"Consigues uno, a tu manera.", ef:{plata:-8,moral:1}, grupos:{tecnico:2,camarin:1,directorio:-1}, mem:"negociaste un solo préstamo con O'Higgins, sin condiciones", va:"ren_h_cantera_3"}
         ]},
        {id:"ren_h_cantera_3", t:"Las raíces del Bravo", ctx:"Las selecciones tricampeonas salieron de las canchas de Rengo. Hoy los apoderados de la sub-15 te exigen prioridad y amenazan con llevarse a sus hijos a otro club de la zona.",
         ops:[
          {t:"Invertir en la sub-15", d:"La comunidad te sigue; el primer equipo se aprieta.", ef:{plata:-15,moral:2,prestigio:2,capital:2}, grupos:{comunidad:8,hinchada:4,directorio:-2}, mem:"apostaste por la sub-15 de Rengo", cierra:true},
          {t:"Cerrar la sub-15 por costos", d:"Ahorras y te ganas el rencor del pueblo.", ef:{plata:8,moral:-3,prestigio:-4,capital:-2}, grupos:{comunidad:-10,hinchada:-6,directorio:3}, mem:"cerraste la sub-15 para ahorrar", cierra:true},
          {t:"Cobrarles cuota a los apoderados", d:"Se mantiene, pero pierdes a los que no pueden pagar.", ef:{plata:5,moral:-1,prestigio:-1}, grupos:{comunidad:-5,hinchada:-2,directorio:2}, mem:"le cobraste a los apoderados y se te fueron los cabros que no podían pagar", cierra:true}
         ]}
      ]
    }]
  },
  /* ---------- LOTA SCHWAGER · "Lamparita" ----------
     Fuente: https://es.wikipedia.org/wiki/Club_de_Deportes_Lota_Schwager (consultado 2026-10-16). Hechos verificados con citas textuales (scripts/historia/LSC.json);
     redactado con DeepSeek y revisado a mano (7.9141). */
  LSC:{
    fuente:"https://es.wikipedia.org/wiki/Club_de_Deportes_Lota_Schwager", consultado:"2026-10-16",
    apodos:["Lamparita"],
    hitos:[
      {anio:1966,hito:"Fusión carbonífera",txt:"Se fundó el 10 de mayo de 1966 con la fusión de Minas Lota y Federico Schwager, los equipos de las dos empresas del carbón. Le dicen «Lamparita», por la lámpara minera."},
      {anio:1969,hito:"Ascenso y debut",txt:"Ascendió a Primera División en 1969 y debutó en Primera en 1970. Su mejor ubicación fue un sexto lugar."},
      {anio:1975,hito:"Final Copa Chile",txt:"Llegó a la final de la Copa Chile de 1975 y cayó ante Palestino."},
      {anio:1980,hito:"Descenso a Segunda",txt:"Descendió a Segunda en 1980."},
      {anio:1986,hito:"Campeón Segunda",txt:"Fue campeón de Segunda en 1986."},
      {anio:1987,hito:"Descenso otra vez",txt:"Volvió a bajar al terminar 1987."},
      {anio:1994,hito:"Caída y receso",txt:"En 1994 descendió por primera vez en su historia a Tercera División. En 1995 la dirigencia vendió el cupo y el club quedó en receso."},
      {anio:2001,hito:"Resurrección amateur",txt:"El 14 de febrero de 2001, después de 7 años de desaparición, renació como club amateur; ese mismo año ganó la Tercera División."},
      {anio:2017,hito:"Sanción y descenso",txt:"En 2017, por sueldos impagos, fue sancionado con la resta de 3 puntos y descendió a Tercera División A."},
      {anio:2019,hito:"Dos clubes, un nombre",txt:"Para 2019 dos equipos paralelos presentaron sus cuadernos de cargos ante la ANFA con el nombre del club. En octubre de 2020 acordaron fusionarse y compitieron como un solo club."}
    ],
    arcos:[
      {id:"lsc_h_a1",t:"Doble camiseta",desc:"El club sigue partido en dos y hoy debes decidir quién firma.",capitulos:[{id:"lsc_h_a1_1",t:"La firma ausente",ctx:"En 2019 dos equipos paralelos presentaron cuadernos de cargos ante la ANFA, y en octubre de 2020 acordaron fusionarse. En tu club la fusión no cuajó: hoy los dos directorios siguen peleando el control y la ANFA exige una sola firma para inscribir al plantel.",ops:[{t:"Respaldar al directorio histórico",d:"Ganas apoyo de socios, pero espantas a los nuevos inversores.",ef:{plata:-10,moral:2,prestigio:1},grupos:{socios:8,directorio:4,sponsors:-6},mem:"respaldaste al directorio histórico y los socios te lo reconocieron",va:"lsc_h_a1_2"},{t:"Darle el mando a los nuevos",d:"Entra plata fresca, pero los socios se sienten traicionados.",ef:{plata:20,moral:-2,prestigio:-1},grupos:{socios:-8,sponsors:10,directorio:-4,hinchada:-2},mem:"le abriste la puerta a los nuevos gestores y la hinchada te miró feo",va:"lsc_h_a1_2"},{t:"Exigir mediación de la ANFA",d:"Te pones neutral, pero todos desconfían.",ef:{plata:-5,prestigio:2},grupos:{anfp:6,prensa:4,socios:-2,sponsors:-2},mem:"pediste que la ANFA mediara y quedaste marcado como tibio",va:"lsc_h_a1_2"}]},{id:"lsc_h_a1_2",t:"El estadio en disputa",ctx:"El club fue fundado en 1966 y juega en el Estadio Municipal Federico Schwager. Hoy el municipio exige un contrato firmado por el directorio legal, pero los dos bandos se pelean por quién firma y el arriendo vence esta semana.",ops:[{t:"Firmar con el directorio histórico",d:"El municipio acepta, pero los nuevos cortan el financiamiento.",ef:{plata:-15,moral:1},grupos:{socios:6,directorio:5,sponsors:-8,comunidad:2},mem:"firmaste con el directorio histórico y los nuevos congelaron sus aportes",va:"lsc_h_a1_3"},{t:"Firmar con los nuevos gestores",d:"Llega el dinero, pero los socios amenazan con tomas y marchas.",ef:{plata:25,moral:-3,prestigio:-2},grupos:{sponsors:10,directorio:-6,socios:-7,hinchada:-4,comunidad:-3},mem:"firmaste con los nuevos y los socios salieron a la calle",va:"lsc_h_a1_3"},{t:"Pedir prórroga al municipio",d:"Ganas tiempo, pero la ANFA aprieta con el plazo.",ef:{plata:-5,prestigio:-1},grupos:{comunidad:3,anfp:-5,socios:2},mem:"pediste una prórroga y la ANFA te marcó la fecha límite",va:"lsc_h_a1_3"}]},{id:"lsc_h_a1_3",t:"Un solo escudo",ctx:"En 2019 dos equipos paralelos presentaron cuadernos de cargos ante la ANFA. La ANFA exige una directiva legal antes del cierre de inscripciones; los dos bandos aceptan sentarse solo si tú cedes algo.",ops:[{t:"Impulsar una fusión de directorios",d:"Logras la unidad, pero cedes poder y quedas en deuda con ambos.",ef:{plata:10,moral:4,prestigio:3,capital:-2},grupos:{socios:5,sponsors:5,directorio:4,hinchada:3,anfp:4},mem:"impulsaste la fusión y el club volvió a tener un solo escudo",cierra:true},{t:"Elegir un interventor externo",d:"La ANFA aprueba, pero tu autoridad queda reducida.",ef:{plata:-20,moral:2,prestigio:4},grupos:{anfp:8,prensa:5,socios:-4,sponsors:-4,directorio:-6},mem:"entregaste el club a un interventor y perdiste el control",cierra:true},{t:"Convocar una asamblea popular",d:"La comunidad decide, pero el proceso es lento y caótico.",ef:{moral:5,prestigio:-2,capital:-4},grupos:{hinchada:10,comunidad:8,socios:4,sponsors:-6,directorio:-4},mem:"convocaste a la asamblea popular y el ruido se comió la cancha",cierra:true}]}]},
      {id:"lsc_h_a2",t:"Sueldos al día",desc:"Evita otra resta de puntos por sueldos impagos.",capitulos:[{id:"lsc_h_a2_1",t:"La planilla roja",ctx:"En 2017, por sueldos impagos, el club perdió 3 puntos y bajó a Tercera A. Hoy las cuentas otra vez están en rojo y el plantel no cobra hace dos meses.",ops:[{t:"Vender al juvenil estrella",d:"Entra plata, pero el camarín se resiente.",ef:{plata:40,moral:-3,prestigio:-2,capital:2},grupos:{camarin:-8,tecnico:-4,hinchada:-3,sponsors:5,directorio:4},mem:"vendiste al juvenil estrella y el camarín quedó partido",va:"lsc_h_a2_2"},{t:"Pedir un adelanto a los sponsors",d:"Llega algo de plata, pero quedas hipotecado.",ef:{plata:15,prestigio:1,capital:-3},grupos:{sponsors:-5,directorio:3,hinchada:1,prensa:2},mem:"pediste un adelanto a los sponsors y quedaste hipotecado",va:"lsc_h_a2_2"},{t:"Negociar una quita con el plantel",d:"Los jugadores aceptan cobrar menos, pero la confianza se quiebra.",ef:{plata:5,moral:-2,capital:1},grupos:{camarin:-6,tecnico:2,directorio:-2,prensa:-3},mem:"negociaste una quita con el plantel y el vestuario quedó helado",va:"lsc_h_a2_2"}]},{id:"lsc_h_a2_2",t:"El fantasma de 2017",ctx:"En 2017, por sueldos impagos, el club perdió 3 puntos. Hoy la ANFP revisa los contratos y exige finiquitos al día. La hinchada está dividida entre exigir pagos y salvar la temporada.",ops:[{t:"Organizar una colecta en la cuenca",d:"La comunidad aporta, pero los grandes ausentes se notan.",ef:{plata:12,moral:4,prestigio:2},grupos:{comunidad:10,hinchada:6,socios:3,sponsors:-2,directorio:1},mem:"organizaste la colecta en la cuenca del carbón y la comunidad respondió",va:"lsc_h_a2_3"},{t:"Aceptar el apoyo municipal",d:"Llega plata a cambio de ceder el estadio por eventos.",ef:{plata:20,prestigio:-1,capital:2},grupos:{comunidad:5,hinchada:-2,socios:-1,sponsors:3,directorio:4},mem:"aceptaste el apoyo municipal y cediste el estadio por eventos",va:"lsc_h_a2_3"},{t:"Tomar un préstamo de un directivo",d:"Pagas al día, pero el control se va de tus manos.",ef:{plata:30,moral:-2,prestigio:-3,capital:-5},grupos:{directorio:-6,camarin:4,hinchada:1,prensa:-2,anfp:3},mem:"tomaste el préstamo del directivo y ahora te cobra con cargos",va:"lsc_h_a2_3"}]},{id:"lsc_h_a2_3",t:"La última cuota",ctx:"En 2017, la resta de 3 puntos por sueldos impagos lo mandó a Tercera A. El plazo para pagar sueldos vence hoy; si no pagas, la ANFP restará puntos y volverás a caer.",ops:[{t:"Pagar todo y quedar en cero",d:"Salvas la temporada, pero no queda plata para refuerzos.",ef:{plata:-50,moral:6,prestigio:4,capital:-2},grupos:{camarin:8,hinchada:7,anfp:6,sponsors:3,directorio:2},mem:"pagaste todo y quedaste en cero, pero el equipo sigue en pie",cierra:true},{t:"Pagar solo lo mínimo y arriesgar",d:"Queda plata, pero la ANFP abre investigación.",ef:{plata:-20,moral:-2,prestigio:-3,capital:1},grupos:{anfp:-7,camarin:-5,hinchada:-3,directorio:2,sponsors:1},mem:"pagaste lo mínimo y la ANFP abrió carpeta",cierra:true},{t:"No pagar y asumir la resta",d:"Te restan puntos y te arriesgas a bajar, pero guardas plata para rearmarte.",ef:{plata:10,moral:-6,prestigio:-5,capital:4},grupos:{hinchada:-10,camarin:-8,anfp:-5,comunidad:-4,tecnico:-6},mem:"no pagaste, te restaron puntos y guardaste la caja",cierra:true}]}]}
    ]
  },
  /* ---------- DEPORTES LINARES · "Depo", "Albirrojos", "Toros" ----------
     Fuente: https://es.wikipedia.org/wiki/Club_de_Deportes_Linares (consultado 2026-10-16). Hechos verificados con citas textuales (scripts/historia/LIN.json);
     redactado con DeepSeek y revisado a mano (7.9141). */
  LIN:{
    fuente:"https://es.wikipedia.org/wiki/Club_de_Deportes_Linares", consultado:"2026-10-16",
    apodos:["Depo","Albirrojos","Toros"],
    hitos:[
      {anio:1955,hito:"Fundación como Lister Rossel",txt:"El 19 de noviembre de 1955 se funda como Club Deportivo Lister Rossel, fusión de tres clubes amateurs de Linares. Lister Rossel era un médico pediatra linarense, deportista y delegado del fútbol amateur."},
      {anio:1957,hito:"Debut y descenso",txt:"Debuta en Segunda División en 1957 y desciende ese mismo año."},
      {anio:1964,hito:"Subcampeón de Segunda",txt:"Termina segundo en Segunda, a 4 puntos de O'Higgins, que asciende."},
      {anio:1974,hito:"Cambio de nombre",txt:"El club cambia su nombre a Club de Deportes Linares."},
      {anio:1991,hito:"Descenso a Tercera",txt:"Tras una muy mala campaña desciende a Tercera División en 1991."},
      {anio:2001,hito:"Último en Primera B",txt:"Termina último en la Primera B 2001 y vuelve a Tercera. En 2006 pasa a llamarse oficialmente Linares Unido."},
      {anio:2011,hito:"Campeón de Tercera B",txt:"En 2010 cae a Tercera B tras una definición con Deportes Quilicura; en 2011 es campeón de Tercera B tras vencer 4-1 a Jugendland."},
      {anio:2019,hito:"Campeón y ascenso",txt:"En 2019 es campeón de Tercera A y asciende al profesionalismo."},
      {anio:2020,hito:"Escándalo y covid",txt:"Se denuncia que el gerente de entonces usó para fines personales dineros enviados por la Conmebol, y el plantel sufre un gran brote de coronavirus."},
      {anio:2022,hito:"Campeón anticipado",txt:"En 2022 es campeón de Tercera A antes de la última fecha."}
    ],
    arcos:[
      {id:"lin_h_a1",t:"La herencia del 2020",desc:"El peso de la denuncia por desvío de fondos y el brote de covid no se borra.",capitulos:[{id:"lin_h_a1_1",t:"El comprobante",ctx:"En 2020 se denunció que el gerente usó para fines personales dineros de la Conmebol. Hoy, ordenando cajas viejas, encuentras un comprobante sin rendir de esa época. ¿Qué haces con él?",ops:[{t:"Denunciar a la fiscalía",d:"Expones el comprobante. Ganas transparencia, pero arriesgas sanciones económicas.",ef:{plata:-20,moral:4,prestigio:3,capital:-2},grupos:{hinchada:8,prensa:6,directorio:-8,sponsors:-5,comunidad:4,socios:5},mem:"guardaste el comprobante y fuiste a la fiscalía",va:"lin_h_a1_2"},{t:"Quemar el comprobante",d:"Destruyes el papel para evitar el escándalo. Proteges al club, pero la culpa te corroe.",ef:{moral:-6,prestigio:-4,capital:2},grupos:{directorio:10,socios:-5,hinchada:-6,prensa:-8,comunidad:-5,sponsors:5},mem:"quemaste el comprobante en el patio del estadio",va:"lin_h_a1_2"}]},{id:"lin_h_a1_2",t:"El parte médico",ctx:"En 2020 el plantel sufrió un gran brote de coronavirus. Hoy un volante clave pide dos semanas más de recuperación; el cuerpo médico dice que puede jugar el domingo.",ops:[{t:"Respetar la licencia",d:"Das descanso al jugador. El camarín lo agradece, pero el equipo pierde presencia en la cancha.",ef:{plata:-5,moral:5,prestigio:-2,capital:1},grupos:{camarin:12,tecnico:-8,hinchada:-4,prensa:-2},mem:"priorizaste la salud del volante",va:"lin_h_a1_3"},{t:"Exigir que juegue",d:"Lo pones en la citación. El técnico respira, pero el plantel te mira con desconfianza.",ef:{plata:5,moral:-5,prestigio:-2,capital:-1},grupos:{tecnico:12,camarin:-10,hinchada:-2,prensa:2},mem:"obligaste al volante a jugar con dolor",va:"lin_h_a1_3"}]},{id:"lin_h_a1_3",t:"El reparto del premio",ctx:"En 2022 el club fue campeón de Tercera A antes de la última fecha. Hoy la dirigencia discute cómo usar el premio: pagar deudas o invertir en el plantel.",ops:[{t:"Pagar deudas antiguas",d:"Saldas compromisos pendientes. Ganas estabilidad, pero el plantel se queda sin refuerzos.",ef:{plata:10,moral:3,prestigio:4,capital:4},grupos:{directorio:12,socios:6,hinchada:-4,camarin:-8,sponsors:4,comunidad:2},mem:"destinaste el premio a sanear las cuentas",cierra:true},{t:"Invertir en refuerzos",d:"Contratas dos jugadores de jerarquía. La hinchada sueña, pero las arcas quedan al límite.",ef:{plata:-15,moral:4,prestigio:6,capital:-3},grupos:{hinchada:12,camarin:8,directorio:-6,socios:-4,sponsors:-2,tecnico:6},mem:"gastaste el premio en refuerzos",cierra:true}]}]},
      {id:"lin_h_a2",t:"La exigencia de la tribuna",desc:"Después de dos títulos, la hinchada no acepta otra cosa que pelear arriba.",capitulos:[{id:"lin_h_a2_1",t:"Armar el plantel",ctx:"En 2019 el club fue campeón de Tercera A y ascendió al profesionalismo. Hoy la dirigencia te exige armar un plantel competitivo, pero el presupuesto es el de un club de barrio.",ops:[{t:"Apostar por juveniles",d:"Das minutos a los cadetes. Ahorras plata, pero la experiencia brilla por su ausencia.",ef:{plata:15,moral:2,prestigio:-2,capital:3},grupos:{camarin:4,hinchada:-6,directorio:6,socios:2,tecnico:-4,comunidad:6},mem:"apostaste por los cadetes del club",va:"lin_h_a2_2"},{t:"Traer veteranos libres",d:"Firmas a dos jugadores de 33 años sin contrato. Sumas oficio, pero el camarín se llena de egos.",ef:{plata:-10,moral:-2,prestigio:2,capital:-2},grupos:{camarin:-6,hinchada:6,directorio:-4,socios:2,tecnico:8,prensa:3},mem:"trajiste veteranos libres",va:"lin_h_a2_2"}]},{id:"lin_h_a2_2",t:"La tentación de vender",ctx:"En 2022 el club fue campeón de Tercera A antes de la última fecha. Hoy la barra te exige pelear el ascenso a Primera B, pero tres titulares quieren irse a clubes más grandes.",ops:[{t:"Vender al mejor postor",d:"Aceptas la oferta por el goleador. Entra plata, pero la hinchada te trata de vendido.",ef:{plata:40,moral:-3,prestigio:-3,capital:2},grupos:{hinchada:-12,directorio:10,socios:4,camarin:-8,sponsors:5,tecnico:-6},mem:"vendiste al goleador en plena pretemporada",va:"lin_h_a2_3"},{t:"Retener a los titulares",d:"Renegocias contratos al alza. Mantienes la base, pero el presupuesto queda en rojo.",ef:{plata:-30,moral:5,prestigio:4,capital:-2},grupos:{hinchada:12,camarin:10,directorio:-8,socios:-4,sponsors:-2,tecnico:6},mem:"retuviste a los titulares a costo de deuda",va:"lin_h_a2_3"}]},{id:"lin_h_a2_3",t:"El partido clave",ctx:"En 2010 el club tuvo que jugar un partido de definición con Deportes Quilicura. Hoy el fixture te regala una fecha clave contra el puntero: si ganas, quedas a un paso del título.",ops:[{t:"Salir a atacar",d:"Planteas un 4-3-3 ofensivo. Ganas respeto, pero te expones a la contra.",ef:{plata:-5,moral:3,prestigio:3,capital:-1},grupos:{hinchada:8,tecnico:6,camarin:2,prensa:4,directorio:-4},mem:"saliste a atacar al puntero",cierra:true},{t:"Cerrar el arco",d:"Paras el bus. Sumas un punto, pero la tribuna silba y el camarín se divide.",ef:{plata:5,moral:-3,prestigio:-2,capital:1},grupos:{hinchada:-8,tecnico:8,camarin:-4,prensa:-4,directorio:6},mem:"cerraste el arco ante el puntero",cierra:true}]}]}
    ]
  },
  /* ---------- UNIVERSIDAD DE CHILE · "La U", "el Chuncho", "Azules", "cuadro laico" ----------
     Fuente: https://es.wikipedia.org/wiki/Club_Universidad_de_Chile (consultado 2026-11-17). Hechos verificados contra el texto de la página
     (scripts/historia/UCH.json); redactado a mano desde los hechos (7.9151). La fecha de fundación está en disputa en la propia fuente. */
  UCH:{
    fuente:"https://es.wikipedia.org/wiki/Club_Universidad_de_Chile", consultado:"2026-11-17",
    apodos:["La U","el Chuncho","Azules","cuadro laico"],
    hitos:[
      {anio:1927,hito:"Fundación en disputa",txt:"El club dice haber nacido el 24 de mayo de 1927. Distintos autores señalan el 25 de marzo de 1911, fecha en que se fundó el Club Atlético Internado, con su rama de fútbol, el Internado Football Club."},
      {anio:1934,hito:"Se viste de azul",txt:"La Universidad de Chile se apropia del Club Universitario de Deportes, que pasa a llamarse Club Deportivo de la Universidad de Chile. Ese año la camiseta titular pasa de blanca a azul."},
      {anio:1938,hito:"Debut profesional",txt:"Hay cupo para un solo equipo universitario en Primera. La U empata 1-1 con Audax Italiano y pierde por «muerte súbita», pero conforma a los dirigentes. Debuta el 29 de mayo: 1-3 con Magallanes."},
      {anio:1962,hito:"El Ballet Azul",txt:"En los años 60 la prensa la apoda el «Ballet Azul» por su buen juego. Es el lustro con más títulos de su historia: campeón en 1962, 1964, 1965, 1967 y 1969, además de 1959."},
      {anio:1980,hito:"Corfuch se va de la universidad",txt:"Tras la crisis de los años 70, la rama de fútbol pasa a ser una corporación que el 1 de septiembre de 1980 se desvincula de la universidad y conserva solo el nombre y los emblemas."},
      {anio:1989,hito:"Primer descenso",txt:"El 15 de enero cae por primera vez a Segunda tras empatar 2-2 con Cobresal, en la última fecha del torneo de 1988. Gana la Segunda en 1989 (5-4 en penales a Palestino) y sube."},
      {anio:1994,hito:"Fin de la sequía",txt:"Tras 25 años sin títulos, empata 1-1 con Cobresal el 18 de diciembre y gana su octavo campeonato. A cuatro fechas del final le había ganado 1-0 el Clásico Universitario a la Católica."},
      {anio:2006,hito:"Quiebra",txt:"La Corte de Apelaciones de Santiago decreta la quiebra del club por deudas cercanas a 5700 millones de pesos con la Tesorería General de la República. En 2007 una sociedad anónima toma la concesión por 30 años."},
      {anio:2011,hito:"El triplete",txt:"Gana la Copa Sudamericana de manera invicta, el único equipo chileno que la ha ganado, y con el Apertura y el Clausura logra el primer triplete de títulos oficiales del fútbol chileno."},
      {anio:2014,hito:"El estadio que no llega",txt:"En abril se anuncia un estadio propio en Laguna Carén; en septiembre, complicado ese proyecto, se acuerda una promesa de compra por 12 hectáreas en La Pintana. Sigue de local en el Nacional, del Estado."},
      {anio:2021,hito:"Milagro de Rancagua",txt:"En la última fecha pierde 0-2 con Unión La Calera hasta el minuto 84 y gana 3-2 para seguir en Primera. Era su peor momento futbolístico desde 1991."}
    ],
    arcos:[{
      id:"uch_h_casa", t:"La casa prestada", desc:"El estadio es del Estado, el estadio propio nunca llegó y la localía se negocia fecha a fecha.",
      capitulos:[
        {id:"uch_h_casa_1", t:"El Nacional no es tuyo", ctx:"El Estadio Nacional, inaugurado en 1938, es propiedad del Estado de Chile y lo opera el Instituto Nacional de Deportes: ahí ejerce de local la U. Hoy el Instituto te avisa que en dos fechas el recinto se ocupa para otro evento y te pide ceder tu calendario.",
         ops:[
          {t:"Ceder las dos fechas", d:"Evitas la pelea con el Instituto; la hinchada pierde su casa.", ef:{moral:-2}, grupos:{anfp:3,hinchada:-5,directorio:2}, mem:"le cediste al Instituto dos fechas en el Nacional", va:"uch_h_casa_2"},
          {t:"Exigir tu calendario", d:"El Nacional es tu casa: defiendes las fechas y te peleas.", ef:{prestigio:1}, grupos:{hinchada:6,directorio:2,anfp:-4,comunidad:-3}, mem:"te plantaste por tus fechas en el Nacional", va:"uch_h_casa_2"},
          {t:"Pedir una fecha de compensación", d:"Cedes, pero con un partido grande asegurado en el Nacional.", ef:{plata:-5,prestigio:1}, grupos:{hinchada:2,directorio:-1,anfp:1}, mem:"cediste las fechas a cambio de una compensación", va:"uch_h_casa_2"}
         ]},
        {id:"uch_h_casa_2", t:"El terreno de La Pintana", ctx:"En abril de 2014 se anunció un estadio propio en Laguna Carén; en septiembre, complicado ese proyecto, se acordó una promesa de compra por 12 hectáreas en La Pintana, con un plazo de tres años. Hoy el estadio propio vuelve a la mesa y te ofrecen un terreno.",
         ops:[
          {t:"Firmar la promesa de compra", d:"Te comprometes con plata que aún no tienes.", ef:{plata:-25,prestigio:2,capital:3}, grupos:{hinchada:8,directorio:-4,comunidad:3}, mem:"firmaste la promesa de compra de un terreno para el estadio propio", va:"uch_h_casa_3"},
          {t:"Seguir de arrendatario en el Nacional", d:"Cero riesgo y cero casa propia.", ef:{plata:6,prestigio:-2}, grupos:{hinchada:-5,directorio:3}, mem:"decidiste seguir de arrendatario en el Nacional", va:"uch_h_casa_3"},
          {t:"Buscar un socio para el terreno", d:"Compartes la cuenta y también el control.", ef:{plata:-10,capital:2}, grupos:{sponsors:4,directorio:-3,hinchada:2}, mem:"buscaste un socio para el terreno del estadio", va:"uch_h_casa_3"}
         ]},
        {id:"uch_h_casa_3", t:"Sin Nacional un domingo", ctx:"Desde 2014, cuando se anunció un estadio propio que no llegó, la U depende de recintos ajenos: el Nacional, el Santa Laura (de Unión Española) y, como tercera opción, El Teniente de Rancagua. Hoy el Nacional no está disponible para el clásico.",
         ops:[
          {t:"Jugar en el Santa Laura", d:"Sigues en Santiago, pero en la casa de otro club.", ef:{plata:-8,moral:1}, grupos:{hinchada:3,directorio:-2,anfp:1}, mem:"llevaste el clásico a la casa de Unión Española", cierra:true},
          {t:"Jugar en El Teniente, en Rancagua", d:"Más lejos: la hinchada viaja o no va.", ef:{plata:5,moral:-2}, grupos:{hinchada:-6,comunidad:-2,directorio:2}, mem:"mandaste el clásico a Rancagua", cierra:true},
          {t:"Presionar para que te devuelvan el Nacional", d:"Haces ruido y el Instituto se acuerda de ti.", ef:{prestigio:2,plata:-3}, grupos:{anfp:-3,prensa:2,hinchada:4}, mem:"presionaste para recuperar el Nacional", cierra:true}
         ]}
      ]
    },{
      id:"uch_h_plata", t:"Deudas azules", desc:"La U vendió figuras para pagar y se quebró en 2006. Hoy la plata vuelve a mandar.",
      capitulos:[
        {id:"uch_h_plata_1", t:"La figura a México", ctx:"En los años 80, con la rama de fútbol desvinculada de la universidad desde 1980, varias figuras de la U fueron transferidas al fútbol mexicano, principalmente para pagar las deudas del club. Hoy llega una oferta por tu mejor jugador.",
         ops:[
          {t:"Vender y pagar deudas", d:"Alivias la caja; el camarín queda sin su figura.", ef:{plata:30,moral:-3,prestigio:-2}, grupos:{camarin:-6,hinchada:-5,directorio:5,tecnico:-3}, mem:"vendiste a tu figura para pagar deudas", va:"uch_h_plata_2"},
          {t:"No venderlo", d:"La figura se queda; la deuda también.", ef:{plata:-12,moral:3,prestigio:2}, grupos:{hinchada:6,camarin:5,directorio:-4}, mem:"te negaste a vender a tu figura aunque la caja lo pedía", va:"uch_h_plata_2"},
          {t:"Vender con cláusula de recompra", d:"Menos plata hoy y una puerta abierta.", ef:{plata:15,moral:-1}, grupos:{directorio:2,hinchada:-2,camarin:-2}, mem:"vendiste a tu figura con cláusula de recompra", va:"uch_h_plata_2"}
         ]},
        {id:"uch_h_plata_2", t:"La deuda con el Fisco", ctx:"En 2006 la Corte de Apelaciones de Santiago decretó la quiebra del club por deudas cercanas a 5700 millones de pesos con la Tesorería General de la República. Hoy hay que ordenar los pagos antes de fin de año y la caja alcanza solo para una parte.",
         ops:[
          {t:"Pagar primero a la Tesorería", d:"Evitas el riesgo mayor; se atrasan los sueldos.", ef:{plata:-25,moral:-3,prestigio:2}, grupos:{anfp:4,camarin:-6,directorio:3}, mem:"pagaste primero a la Tesorería y atrasaste los sueldos", va:"uch_h_plata_3"},
          {t:"Pagar primero los sueldos", d:"El camarín contento; la deuda crece.", ef:{plata:-15,moral:4}, grupos:{camarin:6,tecnico:3,anfp:-5,directorio:-3}, mem:"pagaste primero los sueldos y dejaste crecer la deuda", va:"uch_h_plata_3"},
          {t:"Plan de pagos con todos", d:"A todos un poco: tiempo a cambio de intereses.", ef:{plata:-8,prestigio:-1,capital:2}, grupos:{directorio:2,camarin:-2,anfp:-1,prensa:-2}, mem:"armaste un plan de pagos con todos los acreedores", va:"uch_h_plata_3"}
         ]},
        {id:"uch_h_plata_3", t:"El plan B si bajas", ctx:"En 2021 la U llegó a la última fecha con opciones claras de descender y se salvó con el «Milagro de Rancagua»; en 2022 quedó a tres puntos de perder la categoría. Hoy, otra vez en la parte baja, hay que decidir el presupuesto de contingencia.",
         ops:[
          {t:"Guardar plata para la Primera B", d:"Prudencia, pero el plantel lo lee como rendición.", ef:{plata:12,moral:-4,prestigio:-2,capital:2}, grupos:{camarin:-6,hinchada:-4,directorio:6}, mem:"guardaste plata para la Primera B y el camarín lo tomó como rendición", cierra:true},
          {t:"Gastar todo en salvarse", d:"Refuerzos ahora; si bajas, no queda nada.", ef:{plata:-30,moral:5,prestigio:2}, grupos:{camarin:6,hinchada:7,directorio:-6,tecnico:3}, mem:"gastaste todo en salvar la categoría", cierra:true},
          {t:"Fichar poco y tirar de cantera", d:"Un camino intermedio.", ef:{plata:-8,moral:1,capital:2}, grupos:{comunidad:3,hinchada:2,tecnico:-2}, mem:"apostaste por la cantera para salvar la categoría", cierra:true}
         ]}
      ]
    }]
  },
  /* ---------- UNIVERSIDAD CATÓLICA · "Los Cruzados", "UC", "La Franja" ----------
     Fuente: https://es.wikipedia.org/wiki/Club_Deportivo_Universidad_Católica_(fútbol) (consultado 2026-11-17). Hechos verificados contra el texto
     de la página (scripts/historia/UC.json); redactado a mano desde los hechos (7.9151). */
  UC:{
    fuente:"https://es.wikipedia.org/wiki/Club_Deportivo_Universidad_Católica_(fútbol)", consultado:"2026-11-17",
    apodos:["Los Cruzados","UC","La Franja"],
    hitos:[
      {anio:1937,hito:"Fundación oficial",txt:"El 21 de abril un grupo de deportistas de la Pontificia Universidad Católica se escinde del Club Universitario de Deportes y funda oficialmente la rama de fútbol."},
      {anio:1938,hito:"Un solo cupo universitario",txt:"La Asociación Central de Fútbol solo podía recibir a un equipo universitario en Primera. La Católica pierde 6-2 con Colo-Colo en el Apertura y su ingreso se posterga hasta 1939."},
      {anio:1949,hito:"Primer título",txt:"El 27 de noviembre gana 2-1 a Audax Italiano y consigue su primer torneo oficial de Primera, con Sergio Livingstone y José Manuel Moreno, llegado ese año desde River Plate."},
      {anio:1956,hito:"Primer descenso",txt:"Cae a Segunda, un hecho inédito para la institución. El 10 de noviembre gana 3-2 a Deportes La Serena el título de Segunda y vuelve a la Serie de Honor."},
      {anio:1971,hito:"Se vende Independencia",txt:"La Pontificia Universidad Católica vende el Estadio Independencia para saldar sus deudas (debía las imposiciones de sus funcionarios) y el estadio es demolido. En 1973 el equipo desciende por segunda vez."},
      {anio:1987,hito:"La Máquina",txt:"Campeón con un equipo formado exclusivamente por jugadores chilenos, al que llaman «La Máquina» o «Aplanadora Cruzada»: 10 puntos de ventaja sobre Colo-Colo."},
      {anio:1988,hito:"San Carlos de Apoquindo",txt:"El 4 de septiembre se inaugura el estadio propio, cuyo primer proyecto era de 1972. Tras la venta de Independencia, el club había arrendado otros recintos."},
      {anio:1993,hito:"Final de Libertadores",txt:"Pierde la final de la Copa Libertadores con São Paulo: cae 5-1 en Brasil y gana 2-0 en Santiago (5-3 en el global para los brasileños). Es uno de los cuatro equipos chilenos que han jugado una final y el último en hacerlo."},
      {anio:2009,hito:"Cruzados SADP",txt:"Se crea Cruzados SADP, concesionaria que asume por cuarenta años, renovables, los derechos comerciales y financieros del fútbol profesional y formativo de la Universidad Católica."},
      {anio:2010,hito:"Campeón del Bicentenario",txt:"Colo-Colo le sacaba 7 puntos a pocas fechas del final y la Católica remonta: 4-2 a la U y 3-2 a Cobreloa. El 5 de diciembre golea 5-0 a Everton y es el «Campeón del Bicentenario»."},
      {anio:2021,hito:"Tetracampeón",txt:"Gana su estrella número 16 y es el primer club en ganar cuatro torneos largos consecutivos (2018-2021). Después viene una baja en su desempeño."},
      {anio:2025,hito:"Claro Arena",txt:"El 23 de agosto reinaugura San Carlos de Apoquindo, llamado Claro Arena por patrocinio, tras tres años de remodelación. Su capacidad queda en 20 249 espectadores."}
    ],
    arcos:[{
      id:"uc_h_casa", t:"La casa de la Franja", desc:"Un estadio vendido en 1971, otro inaugurado en 1988 y uno remodelado con nombre de auspiciador.",
      capitulos:[
        {id:"uc_h_casa_1", t:"Independencia en venta", ctx:"En 1971 la Pontificia Universidad Católica vendió el Estadio Independencia para saldar sus deudas: debía las imposiciones de sus funcionarios y la dirigencia estaba dividida sobre cómo afrontar el momento. Hoy la universidad, que aún tiene parte del patrimonio del club, te pide vender un terreno del complejo de entrenamiento.",
         ops:[
          {t:"Vender el terreno", d:"Resuelves el hoyo de la universidad; el club pierde un activo.", ef:{plata:25,prestigio:-2,capital:-3}, grupos:{directorio:4,hinchada:-6,comunidad:-3}, mem:"vendiste un terreno del club para ayudar a la universidad", va:"uc_h_casa_2"},
          {t:"Negarte", d:"Proteges el patrimonio; la universidad se enoja.", ef:{prestigio:2,capital:2}, grupos:{hinchada:5,directorio:-6,comunidad:2}, mem:"te negaste a vender el terreno del club", va:"uc_h_casa_2"},
          {t:"Arrendarlo con opción de compra", d:"Cobras hoy sin perder el terreno; arriendas tu propia casa.", ef:{plata:10,capital:-1}, grupos:{directorio:1,hinchada:-2,sponsors:2}, mem:"arrendaste el terreno del club con opción de compra", va:"uc_h_casa_2"}
         ]},
        {id:"uc_h_casa_2", t:"Tres años de obras", ctx:"San Carlos de Apoquindo se inauguró en 1988 y fue remodelado durante tres años hasta agosto de 2025; el aforo subió de 14 000 a 20 249. Hoy las obras de una tribuna se atrasan y el calendario no espera.",
         ops:[
          {t:"Jugar de local en otra cancha", d:"Pagas arriendo y pierdes el calor de tu gente.", ef:{plata:-10,moral:-2}, grupos:{hinchada:-5,anfp:2,directorio:3}, mem:"mandaste al equipo a jugar de local en otra cancha por las obras", va:"uc_h_casa_3"},
          {t:"Acelerar las obras con recargo", d:"Pagas por apurar y vuelves antes.", ef:{plata:-20,prestigio:2}, grupos:{hinchada:6,sponsors:3,directorio:-4}, mem:"pagaste un recargo para terminar antes las obras", va:"uc_h_casa_3"},
          {t:"Jugar con la obra a medio terminar", d:"Aforo reducido y riesgo de sanción.", ef:{plata:5,prestigio:-2}, grupos:{anfp:-6,hinchada:2,comunidad:-2}, mem:"jugaste con la tribuna a medio terminar y la ANFP te miró mal", va:"uc_h_casa_3"}
         ]},
        {id:"uc_h_casa_3", t:"El nombre del estadio", ctx:"En 2022 se anunció un contrato de naming rights con Claro y desde agosto de 2025 el estadio se llama Claro Arena. Hoy un nuevo auspiciador ofrece mucha más plata si rebautizas las tribunas que llevan nombres de ídolos del club.",
         ops:[
          {t:"Aceptar el rebautizo", d:"Entra plata fresca; la hinchada lo siente como una venta.", ef:{plata:30,prestigio:-3}, grupos:{sponsors:8,directorio:4,hinchada:-9,comunidad:-3}, mem:"rebautizaste las tribunas históricas por plata", cierra:true},
          {t:"Rechazar: las tribunas se quedan", d:"Cuidas la memoria; la caja lo paga.", ef:{plata:-10,prestigio:2}, grupos:{hinchada:8,comunidad:4,sponsors:-6}, mem:"rechazaste cambiar los nombres de las tribunas", cierra:true},
          {t:"Auspicio sin tocar los nombres", d:"Menos plata y el mismo respeto.", ef:{plata:12}, grupos:{sponsors:3,hinchada:2,directorio:-2}, mem:"aceptaste el auspicio sin tocar los nombres de las tribunas", cierra:true}
         ]}
      ]
    },{
      id:"uc_h_maquina", t:"La Máquina", desc:"Un equipo de campeones que envejece, una cantera que reclama minutos y un fichaje de nombre grande.",
      capitulos:[
        {id:"uc_h_maquina_1", t:"Después del tetra", ctx:"Tras el tetracampeonato de 2018-2021 comenzó una baja en el desempeño: en 2022 la Católica perdió la final de la Supercopa con Colo-Colo y terminó séptima, y en 2023 y 2024 quedó eliminada en la primera fase de la Sudamericana. Hoy la hinchada pide renovar el plantel campeón.",
         ops:[
          {t:"Renovar el plantel campeón", d:"Sangre nueva; se van los que ganaron todo.", ef:{plata:-15,moral:-3,prestigio:2,capital:2}, grupos:{camarin:-5,hinchada:-2,tecnico:3,prensa:3}, mem:"renovaste el plantel campeón y se fueron los de siempre", va:"uc_h_maquina_2"},
          {t:"Reforzar a los de siempre", d:"Cuidas el camarín; el ciclo envejece.", ef:{plata:-10,moral:4}, grupos:{camarin:6,hinchada:3,prensa:-4,directorio:-2}, mem:"reforzaste a los campeones en vez de renovarlos", va:"uc_h_maquina_2"},
          {t:"Vender a los más caros", d:"Caja hoy y menos equipo mañana.", ef:{plata:30,moral:-4,prestigio:-3}, grupos:{directorio:5,camarin:-7,hinchada:-6}, mem:"vendiste a los más caros del plantel campeón", va:"uc_h_maquina_2"}
         ]},
        {id:"uc_h_maquina_2", t:"Todos chilenos", ctx:"El campeón de 1987 se recuerda por ser un equipo formado exclusivamente por jugadores chilenos, la «Aplanadora Cruzada», con 10 puntos de ventaja sobre Colo-Colo. Hoy el técnico pide dos extranjeros y la cantera reclama minutos.",
         ops:[
          {t:"Priorizar la cantera", d:"Minutos para los de casa.", ef:{plata:5,moral:2,prestigio:-1,capital:3}, grupos:{comunidad:4,hinchada:3,tecnico:-4}, mem:"le diste los minutos a la cantera en vez de fichar", va:"uc_h_maquina_3"},
          {t:"Fichar los dos extranjeros", d:"El técnico los tiene; la cantera espera.", ef:{plata:-18,prestigio:2}, grupos:{tecnico:6,camarin:-3,comunidad:-3,hinchada:2}, mem:"fichaste dos extranjeros y la cantera quedó esperando", va:"uc_h_maquina_3"},
          {t:"Uno y uno", d:"Un fichaje y un debut de la cantera.", ef:{plata:-8,moral:1}, grupos:{tecnico:2,comunidad:1,camarin:-1}, mem:"fichaste a un extranjero y debutaste a uno de la cantera", va:"uc_h_maquina_3"}
         ]},
        {id:"uc_h_maquina_3", t:"Las estrellas de nombre grande", ctx:"En 1994, un año después de perder la final de la Copa Libertadores 1993, el directorio fichó a dos figuras de renombre mundial, seleccionados de Argentina y campeones de la Copa América 1993. Hoy te ofrecen dos veteranos de nombre grande, con sueldos que desordenan la planilla.",
         ops:[
          {t:"Firmarlos", d:"Prensa, estadio lleno y una planilla desordenada.", ef:{plata:-30,prestigio:4,moral:2}, grupos:{hinchada:8,prensa:6,sponsors:4,camarin:-6,directorio:-5}, mem:"firmaste a dos veteranos de nombre grande y se desordenó la planilla", cierra:true},
          {t:"Decir que no", d:"Orden en la planilla; la ilusión se enfría.", ef:{plata:8,prestigio:-2}, grupos:{directorio:5,hinchada:-5,prensa:-3}, mem:"dijiste que no a los veteranos de nombre grande", cierra:true},
          {t:"Uno solo, con sueldo atado a resultados", d:"Un nombre grande con el riesgo repartido.", ef:{plata:-12,prestigio:2}, grupos:{hinchada:3,camarin:-2,directorio:1}, mem:"fichaste a un solo veterano con el sueldo atado a resultados", cierra:true}
         ]}
      ]
    }]
  },
  /* ---------- COBRELOA · "Zorros del Desierto", "Loínos", "Mineros", "Naranjas" ----------
     Fuente: https://es.wikipedia.org/wiki/Club_de_Deportes_Cobreloa (consultado 2026-11-17). Hechos verificados contra el texto de la página
     (scripts/historia/CBL.json); redactado a mano desde los hechos (7.9151). CBL es Cobreloa; Cobresal es COB. */
  CBL:{
    fuente:"https://es.wikipedia.org/wiki/Club_de_Deportes_Cobreloa", consultado:"2026-11-17",
    apodos:["Zorros del Desierto","Loínos","Mineros","Naranjas"],
    hitos:[
      {anio:1977,hito:"Ahora o nunca",txt:"Tras postulaciones rechazadas por la lejanía de Calama, el 7 de enero la ACF aprueba su ingreso a Segunda con 38 votos a favor. Nace sobre el amateur Deportes El Loa, con el apoyo de Codelco."},
      {anio:1978,hito:"Debut y subcampeón",txt:"Debuta en Primera el 5 de marzo en Calama y le gana 4-2 a Colo-Colo. Termina segundo con 49 puntos, cuatro menos que el campeón, Palestino."},
      {anio:1980,hito:"Primer título",txt:"Campeón de Primera por primera vez, tras pelear el título con la Universidad de Chile hasta la última fecha, cuando golea 3-0 a Lota Schwager."},
      {anio:1981,hito:"Final con Flamengo",txt:"Subcampeón de América: pierde la final de la Libertadores con Flamengo en tres partidos (1-2, 1-0 y 0-2 en el desempate de Montevideo)."},
      {anio:1982,hito:"Otra final, otro título",txt:"Pierde la final de la Libertadores con Peñarol (0-0 y 0-1 en el último minuto) y ese año es campeón nacional por segunda vez, al golear 5-0 a Deportes La Serena."},
      {anio:1985,hito:"Récord de localía",txt:"Entre 1980 y 1985 estuvo invicto 91 partidos oficiales de local, un récord en Chile. Se corta el 22 de septiembre con un 2-3 ante Cobresal, y ese año gana su tercera estrella."},
      {anio:1992,hito:"Quinta estrella",txt:"Campeón por quinta vez, con una racha de 26 partidos invicto en la temporada, y le quita a Colo-Colo el tetracampeonato."},
      {anio:2015,hito:"Primer descenso",txt:"El 30 de abril desciende «por secretaría», tras un fallo del Tribunal de Disciplina de la ANFP que le resta tres puntos, después de 38 temporadas en Primera. Sigue una crisis, con dos directivas paralelas."},
      {anio:2022,hito:"A las puertas",txt:"Con 20 triunfos y un 67 % de rendimiento, el ascenso se le escapa en la última fecha y pierde 5-0 en casa el playoff con Deportes Copiapó. En 2018 había perdido otra final con Cobresal."},
      {anio:2023,hito:"Campeón de la B",txt:"El 15 de octubre, en Talca, gana 2-1 a Rangers con un gol en el minuto 96 y vuelve a Primera tras ocho años y medio. Es campeón de la Primera B por primera vez."},
      {anio:2024,hito:"Segundo descenso",txt:"De vuelta en Primera termina 15.º con 31 puntos y 17 derrotas, y desciende por segunda vez en su historia."}
    ],
    arcos:[{
      id:"cbl_h_ahora", t:"Ahora o nunca", desc:"El club nació de una campaña de toda la ciudad y de la plata de la minera. Hoy esa deuda con Calama se cobra.",
      capitulos:[
        {id:"cbl_h_ahora_1", t:"La minera y la camiseta", ctx:"En 1976 Calama y Chuquicamata se movilizaron con el comité «Pro Ingreso al Fútbol Rentado» y Codelco apoyaría íntegramente la iniciativa; en 1977 nació Cobreloa. Hoy una empresa contratista de la minería ofrece un auspicio grande a cambio de que su marca ocupe todo el frente de la camiseta.",
         ops:[
          {t:"Aceptar el auspicio completo", d:"Plata para la temporada; la hinchada lo ve como una venta.", ef:{plata:30,prestigio:-2}, grupos:{sponsors:8,directorio:4,hinchada:-7,comunidad:-3}, mem:"le vendiste todo el frente de la camiseta a una contratista minera", va:"cbl_h_ahora_2"},
          {t:"Rechazarlo", d:"Mantienes la camiseta; la caja se queda corta.", ef:{plata:-8,prestigio:2}, grupos:{hinchada:7,comunidad:4,sponsors:-6}, mem:"rechazaste un auspicio grande para cuidar la camiseta", va:"cbl_h_ahora_2"},
          {t:"Negociar solo una parte del frente", d:"Un espacio para la marca y el resto para el club.", ef:{plata:14}, grupos:{sponsors:3,hinchada:-2,directorio:2}, mem:"negociaste solo una parte del frente de la camiseta", va:"cbl_h_ahora_2"}
         ]},
        {id:"cbl_h_ahora_2", t:"La casa en Calama", ctx:"El Estadio Municipal de Calama, inaugurado en 1952, es de la Municipalidad y no tenía certificación para recibir partidos internacionales de alta convocatoria: la vuelta de la final de la Libertadores de 1982 se jugó en el Estadio Nacional, en Santiago. Hoy una llave de copa internacional te obliga a elegir sede.",
         ops:[
          {t:"Jugarla en Calama igual", d:"Tu gente en tu cancha; la certificación se discute.", ef:{prestigio:-2}, grupos:{hinchada:8,comunidad:4,anfp:-5}, mem:"te empeñaste en jugar la copa en Calama", va:"cbl_h_ahora_3"},
          {t:"Irte a otra ciudad", d:"Cumples la norma; la hinchada se queda sin partido.", ef:{plata:-10,moral:-2,prestigio:1}, grupos:{anfp:4,hinchada:-7,comunidad:-3}, mem:"sacaste la copa de Calama para cumplir la norma", va:"cbl_h_ahora_3"},
          {t:"Pagar las mejoras que piden", d:"El municipio pone la cancha y tú pones la plata.", ef:{plata:-20,prestigio:2,capital:2}, grupos:{anfp:4,comunidad:4,directorio:-4}, mem:"pagaste las mejoras del estadio municipal para poder jugar en casa", va:"cbl_h_ahora_3"}
         ]},
        {id:"cbl_h_ahora_3", t:"Lejos de todo", ctx:"En 1967 Calama volvió a postular al profesionalismo y fue rechazada por la misma razón de siempre: la lejanía con la capital. Hoy el fixture te manda a cuatro viajes largos seguidos y el presupuesto de pasajes no alcanza.",
         ops:[
          {t:"Viajar con el plantel completo", d:"Más cansancio y más gasto, ningún riesgo deportivo.", ef:{plata:-15,moral:2}, grupos:{camarin:4,tecnico:3,directorio:-3}, mem:"viajaste con el plantel completo pese al gasto", cierra:true},
          {t:"Viajar liviano con juveniles", d:"Ahorras; el técnico se queja y el resultado se arriesga.", ef:{plata:10,moral:-2,prestigio:-1}, grupos:{tecnico:-5,camarin:-2,directorio:3,comunidad:2}, mem:"mandaste a los juveniles de viaje para ahorrar", cierra:true},
          {t:"Pedir a la ANFP agrupar los viajes", d:"Calama de nuevo pidiendo permiso.", ef:{prestigio:1,plata:-3}, grupos:{anfp:3,prensa:2,hinchada:-1}, mem:"le pediste a la ANFP que agrupara los viajes de Calama", cierra:true}
         ]}
      ]
    },{
      id:"cbl_h_caida", t:"Caída y regreso", desc:"Un descenso por secretaría, una temporada con cuatro técnicos y un regreso que duró un año.",
      capitulos:[
        {id:"cbl_h_caida_1", t:"El fallo de secretaría", ctx:"El 30 de abril de 2015 Cobreloa descendió por primera vez «por secretaría»: la Segunda Sala del Tribunal de Disciplina de la ANFP le restó tres puntos, tras 38 temporadas en Primera. Hoy el Tribunal abre un expediente por la inscripción de uno de tus jugadores a pocas fechas del final.",
         ops:[
          {t:"Apelar y pelear en la ANFP", d:"Defiendes el cupo; gastas en abogados y quedas marcado.", ef:{plata:-10,prestigio:-1}, grupos:{anfp:-5,prensa:3,hinchada:5,directorio:2}, mem:"peleaste el expediente en la ANFP hasta el final", va:"cbl_h_caida_2"},
          {t:"Sacar al jugador y acatar", d:"Pierdes al jugador, no pierdes puntos.", ef:{moral:-3,prestigio:2}, grupos:{anfp:5,camarin:-4,tecnico:-3}, mem:"sacaste al jugador observado para no perder puntos", va:"cbl_h_caida_2"},
          {t:"Revisar toda la planilla de inscripciones", d:"Cuesta plata y tiempo, pero duermes tranquilo.", ef:{plata:-8,capital:3}, grupos:{anfp:3,directorio:2,camarin:-1}, mem:"revisaste una por una las inscripciones del plantel", va:"cbl_h_caida_2"}
         ]},
        {id:"cbl_h_caida_2", t:"Cuatro técnicos", ctx:"En el torneo 2016-17, ya en la Primera B, Cobreloa tuvo cuatro entrenadores en una sola temporada; uno de ellos duró cuatro fechas. Hoy, tras cuatro partidos sin ganar, el directorio te pide cortar al técnico.",
         ops:[
          {t:"Cortar al técnico", d:"Respuesta rápida; repites el ciclo.", ef:{plata:-8,moral:-3}, grupos:{directorio:5,hinchada:3,tecnico:-6,prensa:2}, mem:"cortaste al técnico a las cuatro fechas", va:"cbl_h_caida_3"},
          {t:"Respaldarlo", d:"Aguantas la presión; si no resulta, es tu cabeza.", ef:{moral:3,prestigio:-1}, grupos:{tecnico:6,camarin:4,hinchada:-5,directorio:-4}, mem:"respaldaste al técnico contra el directorio", va:"cbl_h_caida_3"},
          {t:"Fijarle un plazo de ocho fechas", d:"Das aire, pero con reloj.", ef:{moral:1}, grupos:{tecnico:2,directorio:2,hinchada:-2}, mem:"le pusiste un plazo de ocho fechas al técnico", va:"cbl_h_caida_3"}
         ]},
        {id:"cbl_h_caida_3", t:"El año después de subir", ctx:"En 2023 Cobreloa fue campeón de la Primera B y volvió a Primera tras ocho años y medio; en 2024 terminó 15.º con 31 puntos y volvió a descender. Hoy, recién ascendido, tienes que decidir cuánto gastar en el plantel.",
         ops:[
          {t:"Gastar fuerte en refuerzos", d:"Plantel de Primera; si falla, el hoyo es profundo.", ef:{plata:-30,moral:3,prestigio:3}, grupos:{hinchada:7,tecnico:4,directorio:-6,sponsors:2}, mem:"gastaste fuerte en refuerzos tras el ascenso", cierra:true},
          {t:"Confiar en el plantel campeón", d:"Lealtad con los que subieron; Primera es otro nivel.", ef:{plata:5,moral:4,prestigio:-3}, grupos:{camarin:6,hinchada:2,tecnico:-2,prensa:-4}, mem:"confiaste en el plantel que subió a Primera", cierra:true},
          {t:"Armar un plantel mixto", d:"Unos cuantos refuerzos y la base campeona.", ef:{plata:-14,moral:2,capital:2}, grupos:{tecnico:3,camarin:2,directorio:-2}, mem:"armaste un plantel mixto con la base que ascendió", cierra:true}
         ]}
      ]
    }]
  }
};
/* se suma a lo que ya hay: hitos en la LÍNEA (el del mismo año y nombre se reemplaza por el de acá, más completo) y arcos
   en ARCOS_EQUIPO (sin duplicar ids). Corre una vez al cargar, después de data-historico.js y data-storylines.js. */
(function sumarHistoriaClubes(){
  Object.keys(HISTORIA_CLUBES).forEach(function(id){
    const H=HISTORIA_CLUBES[id];
    if(typeof HISTORIA_LINEA==="object"&&H.hitos){
      if(!HISTORIA_LINEA[id]) HISTORIA_LINEA[id]=[];
      const L=HISTORIA_LINEA[id];
      H.hitos.forEach(function(h){
        const i=L.findIndex(function(x){ return x&&x.anio===h.anio&&(x.hito===h.hito||x.anio!==2026); });
        if(i>=0&&L[i].hito!=="Hoy") L[i]={anio:h.anio,hito:h.hito,txt:h.txt,fuente:H.fuente}; else if(i<0) L.push({anio:h.anio,hito:h.hito,txt:h.txt,fuente:H.fuente});
      });
    }
    /* los arcos con historia real van PRIMERO: storylines.js arcoElegible toma el primero que no se jugó, y lo primero que
       el jugador vive con el club tiene que enseñarle algo verdadero (antes salía el genérico "Rengo a no bajar") */
    if(typeof ARCOS_EQUIPO==="object"&&H.arcos){
      if(!ARCOS_EQUIPO[id]) ARCOS_EQUIPO[id]=[];
      const nuevos=H.arcos.filter(function(a){ return !ARCOS_EQUIPO[id].some(function(x){ return x.id===a.id; }); });
      ARCOS_EQUIPO[id]=nuevos.concat(ARCOS_EQUIPO[id]);
    }
  });
})();
