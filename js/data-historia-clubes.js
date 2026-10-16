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
      {anio:2019,hito:"Dos clubes, un nombre",txt:"Para 2019 dos equipos paralelos presentaron sus cuadernos de cargos ante la ANFA con el nombre del club."}
    ],
    arcos:[
      {id:"lsc_h_a1",t:"Doble camiseta",desc:"El club sigue partido en dos y hoy debes decidir quién firma.",capitulos:[{id:"lsc_h_a1_1",t:"La firma ausente",ctx:"En 2019 dos equipos paralelos presentaron cuadernos de cargos ante la ANFA. Hoy los dos directorios siguen peleando el control y la ANFA exige una sola firma para inscribir al plantel.",ops:[{t:"Respaldar al directorio histórico",d:"Ganas apoyo de socios, pero espantas a los nuevos inversores.",ef:{plata:-10,moral:2,prestigio:1},grupos:{socios:8,directorio:4,sponsors:-6},mem:"respaldaste al directorio histórico y los socios te lo reconocieron",va:"lsc_h_a1_2"},{t:"Darle el mando a los nuevos",d:"Entra plata fresca, pero los socios se sienten traicionados.",ef:{plata:20,moral:-2,prestigio:-1},grupos:{socios:-8,sponsors:10,directorio:-4,hinchada:-2},mem:"le abriste la puerta a los nuevos gestores y la hinchada te miró feo",va:"lsc_h_a1_2"},{t:"Exigir mediación de la ANFA",d:"Te pones neutral, pero todos desconfían.",ef:{plata:-5,prestigio:2},grupos:{anfp:6,prensa:4,socios:-2,sponsors:-2},mem:"pediste que la ANFA mediara y quedaste marcado como tibio",va:"lsc_h_a1_2"}]},{id:"lsc_h_a1_2",t:"El estadio en disputa",ctx:"El club fue fundado en 1966 y juega en el Estadio Municipal Federico Schwager. Hoy el municipio exige un contrato firmado por el directorio legal, pero los dos bandos se pelean por quién firma y el arriendo vence esta semana.",ops:[{t:"Firmar con el directorio histórico",d:"El municipio acepta, pero los nuevos cortan el financiamiento.",ef:{plata:-15,moral:1},grupos:{socios:6,directorio:5,sponsors:-8,comunidad:2},mem:"firmaste con el directorio histórico y los nuevos congelaron sus aportes",va:"lsc_h_a1_3"},{t:"Firmar con los nuevos gestores",d:"Llega el dinero, pero los socios amenazan con tomas y marchas.",ef:{plata:25,moral:-3,prestigio:-2},grupos:{sponsors:10,directorio:-6,socios:-7,hinchada:-4,comunidad:-3},mem:"firmaste con los nuevos y los socios salieron a la calle",va:"lsc_h_a1_3"},{t:"Pedir prórroga al municipio",d:"Ganas tiempo, pero la ANFA aprieta con el plazo.",ef:{plata:-5,prestigio:-1},grupos:{comunidad:3,anfp:-5,socios:2},mem:"pediste una prórroga y la ANFA te marcó la fecha límite",va:"lsc_h_a1_3"}]},{id:"lsc_h_a1_3",t:"Un solo escudo",ctx:"En 2019 dos equipos paralelos presentaron cuadernos de cargos ante la ANFA. La ANFA exige una directiva legal antes del cierre de inscripciones; los dos bandos aceptan sentarse solo si tú cedes algo.",ops:[{t:"Impulsar una fusión de directorios",d:"Logras la unidad, pero cedes poder y quedas en deuda con ambos.",ef:{plata:10,moral:4,prestigio:3,capital:-2},grupos:{socios:5,sponsors:5,directorio:4,hinchada:3,anfp:4},mem:"impulsaste la fusión y el club volvió a tener un solo escudo",cierra:true},{t:"Elegir un interventor externo",d:"La ANFA aprueba, pero tu autoridad queda reducida.",ef:{plata:-20,moral:2,prestigio:4},grupos:{anfp:8,prensa:5,socios:-4,sponsors:-4,directorio:-6},mem:"entregaste el club a un interventor y perdiste el control",cierra:true},{t:"Convocar una asamblea popular",d:"La comunidad decide, pero el proceso es lento y caótico.",ef:{moral:5,prestigio:-2,capital:-4},grupos:{hinchada:10,comunidad:8,socios:4,sponsors:-6,directorio:-4},mem:"convocaste a la asamblea popular y el ruido se comió la cancha",cierra:true}]}]},
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
      {id:"lin_h_a1",t:"La herencia del 2020",desc:"El peso de la denuncia por desvío de fondos y el brote de covid no se borra.",capitulos:[{id:"lin_h_a1_1",t:"El comprobante",ctx:"En 2020 se denunció que el gerente usó para fines personales dineros de la Conmebol. Hoy, ordenando cajas viejas, encuentras un comprobante sin rendir de esa época. ¿Qué haces con él?",ops:[{t:"Denunciar a la fiscalía",d:"Expones el comprobante. Ganas transparencia, pero arriesgas sanciones económicas.",ef:{plata:-20,moral:4,prestigio:3,capital:-2},grupos:{hinchada:8,prensa:6,directorio:-8,sponsors:-5,comunidad:4,socios:5},mem:"guardaste el comprobante y fuiste a la fiscalía",va:"lin_h_a1_2"},{t:"Quemar el comprobante",d:"Destruyes el papel para evitar el escándalo. Proteges al club, pero la culpa te corroe.",ef:{moral:-6,prestigio:-4,capital:2},grupos:{directorio:10,socios:-5,hinchada:-6,prensa:-8,comunidad:-5,sponsors:5},mem:"quemaste el comprobante en el patio del estadio",va:"lin_h_a1_2"}]},{id:"lin_h_a1_2",t:"El parte médico",ctx:"El brote de covid de 2020 dejó secuelas en el plantel. Hoy un volante clave pide dos semanas más de recuperación; el cuerpo médico dice que puede jugar el domingo.",ops:[{t:"Respetar la licencia",d:"Das descanso al jugador. El camarín lo agradece, pero el equipo pierde presencia en la cancha.",ef:{plata:-5,moral:5,prestigio:-2,capital:1},grupos:{camarin:12,tecnico:-8,hinchada:-4,prensa:-2},mem:"priorizaste la salud del volante",va:"lin_h_a1_3"},{t:"Exigir que juegue",d:"Lo pones en la citación. El técnico respira, pero el plantel te mira con desconfianza.",ef:{plata:5,moral:-5,prestigio:-2,capital:-1},grupos:{tecnico:12,camarin:-10,hinchada:-2,prensa:2},mem:"obligaste al volante a jugar con dolor",va:"lin_h_a1_3"}]},{id:"lin_h_a1_3",t:"El reparto del premio",ctx:"En 2022 el club fue campeón de Tercera A antes de la última fecha. Hoy la dirigencia discute cómo usar el premio: pagar deudas o invertir en el plantel.",ops:[{t:"Pagar deudas antiguas",d:"Saldas compromisos pendientes. Ganas estabilidad, pero el plantel se queda sin refuerzos.",ef:{plata:10,moral:3,prestigio:4,capital:4},grupos:{directorio:12,socios:6,hinchada:-4,camarin:-8,sponsors:4,comunidad:2},mem:"destinaste el premio a sanear las cuentas",cierra:true},{t:"Invertir en refuerzos",d:"Contratas dos jugadores de jerarquía. La hinchada sueña, pero las arcas quedan al límite.",ef:{plata:-15,moral:4,prestigio:6,capital:-3},grupos:{hinchada:12,camarin:8,directorio:-6,socios:-4,sponsors:-2,tecnico:6},mem:"gastaste el premio en refuerzos",cierra:true}]}]},
      {id:"lin_h_a2",t:"La exigencia de la tribuna",desc:"Después de dos títulos, la hinchada no acepta otra cosa que pelear arriba.",capitulos:[{id:"lin_h_a2_1",t:"Armar el plantel",ctx:"En 2019 el club fue campeón de Tercera A y ascendió al profesionalismo. Hoy la dirigencia te exige armar un plantel competitivo, pero el presupuesto es el de un club de barrio.",ops:[{t:"Apostar por juveniles",d:"Das minutos a los cadetes. Ahorras plata, pero la experiencia brilla por su ausencia.",ef:{plata:15,moral:2,prestigio:-2,capital:3},grupos:{camarin:4,hinchada:-6,directorio:6,socios:2,tecnico:-4,comunidad:6},mem:"apostaste por los cadetes del club",va:"lin_h_a2_2"},{t:"Traer veteranos libres",d:"Firmas a dos jugadores de 33 años sin contrato. Sumas oficio, pero el camarín se llena de egos.",ef:{plata:-10,moral:-2,prestigio:2,capital:-2},grupos:{camarin:-6,hinchada:6,directorio:-4,socios:2,tecnico:8,prensa:3},mem:"trajiste veteranos libres",va:"lin_h_a2_2"}]},{id:"lin_h_a2_2",t:"La tentación de vender",ctx:"En 2022 el club fue campeón de Tercera A antes de la última fecha. Hoy la barra te exige pelear el ascenso a Primera B, pero tres titulares quieren irse a clubes más grandes.",ops:[{t:"Vender al mejor postor",d:"Aceptas la oferta por el goleador. Entra plata, pero la hinchada te trata de vendido.",ef:{plata:40,moral:-3,prestigio:-3,capital:2},grupos:{hinchada:-12,directorio:10,socios:4,camarin:-8,sponsors:5,tecnico:-6},mem:"vendiste al goleador en plena pretemporada",va:"lin_h_a2_3"},{t:"Retener a los titulares",d:"Renegocias contratos al alza. Mantienes la base, pero el presupuesto queda en rojo.",ef:{plata:-30,moral:5,prestigio:4,capital:-2},grupos:{hinchada:12,camarin:10,directorio:-8,socios:-4,sponsors:-2,tecnico:6},mem:"retuviste a los titulares a costo de deuda",va:"lin_h_a2_3"}]},{id:"lin_h_a2_3",t:"El partido clave",ctx:"En 2010 el club tuvo que jugar un partido de definición con Deportes Quilicura. Hoy el fixture te regala una fecha clave contra el puntero: si ganas, quedas a un paso del título.",ops:[{t:"Salir a atacar",d:"Planteas un 4-3-3 ofensivo. Ganas respeto, pero te expones a la contra.",ef:{plata:-5,moral:3,prestigio:3,capital:-1},grupos:{hinchada:8,tecnico:6,camarin:2,prensa:4,directorio:-4},mem:"saliste a atacar al puntero",cierra:true},{t:"Cerrar el arco",d:"Paras el bus. Sumas un punto, pero la tribuna silba y el camarín se divide.",ef:{plata:5,moral:-3,prestigio:-2,capital:1},grupos:{hinchada:-8,tecnico:8,camarin:-4,prensa:-4,directorio:6},mem:"cerraste el arco ante el puntero",cierra:true}]}]}
    ]
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
