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
    fuente:"https://es.wikipedia.org/wiki/Club_de_Deportes_Rengo", consultado:"2026-11-15",
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
      {anio:2023,hito:"Obras y San Fernando",txt:"Mientras remodelan el Guillermo Guzmán Díaz (de los años 60, 3.000 personas) se anuncia que será local en San Fernando. Le hace 5-0 a Deportes Concepción, su mayor goleada en Segunda."},
      {anio:2024,hito:"Cuarto en Segunda",txt:"Termina cuarto en la Segunda División Profesional."}
    ],
    /* dilemas de HOY (ficción del juego) anclados en esos hechos. Redactados con DeepSeek desde los hechos y revisados. */
    arcos:[{
      id:"ren_h_casa", t:"La casa del Bravo", desc:"El estadio es municipal, la remodelación costó y la Segunda exige: ¿quién manda en la casa?",
      capitulos:[
        {id:"ren_h_casa_1", t:"El patio prestado", ctx:"El Guillermo Guzmán Díaz es de la Municipalidad, de los años 60, y tras el ascenso de 2022 hubo que remodelarlo: para 2023 se anunció que serías local en San Fernando. Hoy el municipio te pide el estadio dos días a la semana para actividades de la comuna.",
         ops:[
          {t:"Ceder los días que piden", d:"El municipio queda contento; el pasto lo paga.", ef:{plata:-5,moral:-2}, grupos:{comunidad:8,hinchada:-3,directorio:-4}, mem:"le abriste el estadio a la comuna aunque se te rompiera el pasto", va:"ren_h_casa_2"},
          {t:"Negarte: el calendario es del club", d:"Cuidas la cancha y te peleas con el alcalde.", ef:{prestigio:1}, grupos:{hinchada:3,directorio:3,comunidad:-8}, mem:"le cerraste el estadio a la comuna", va:"ren_h_casa_2"},
          {t:"Convenio con arriendo de por medio", d:"Todo por escrito. Y pagas.", ef:{plata:-15,prestigio:2}, grupos:{directorio:2,comunidad:3,sponsors:2}, mem:"firmaste un convenio caro con el municipio por tu propia casa", va:"ren_h_casa_2"}
         ]},
        {id:"ren_h_casa_2", t:"La cancha se cae", ctx:"Las obras de 2023, por las que se anunció San Fernando como casa alterna, terminaron, pero la cancha no drena y el pasto se levanta en cada lluvia. Las bases de la Segunda piden un mínimo y el informe del veedor llega en dos fechas.",
         ops:[
          {t:"Drenaje nuevo, cueste lo que cueste", d:"Te descapitalizas, pero la cancha queda de profesional.", ef:{plata:-30,prestigio:3,capital:2}, grupos:{hinchada:4,anfp:3,directorio:-3}, mem:"pagaste el drenaje aunque la caja no daba", va:"ren_h_casa_3"},
          {t:"Parche con arena y a rezar", d:"Te ahorras la obra; la ANFP te anota y la hinchada lo ve.", ef:{plata:10,moral:-2,prestigio:-3}, grupos:{anfp:-6,hinchada:-3}, mem:"parchaste la cancha con arena y la ANFP te anotó", va:"ren_h_casa_3"},
          {t:"Que lo pague la Municipalidad", d:"Lo pagan ellos. La cuenta te la cobran en la próxima.", ef:{plata:5}, grupos:{comunidad:-4,directorio:-3,anfp:-1}, mem:"le pasaste la cuenta de la cancha al municipio", va:"ren_h_casa_3"}
         ]},
        {id:"ren_h_casa_3", t:"Localía en venta", ctx:"En Tercera tu alternativa era el Municipal de Rosario; para 2023 se anunció San Fernando. Hoy la Municipalidad de Rengo no firma la concesión larga y San Fernando ofrece su estadio por dos años.",
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
    fuente:"https://es.wikipedia.org/wiki/Club_de_Deportes_Lota_Schwager", consultado:"2026-11-15",
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
      {anio:2017,hito:"Traspaso y sanción",txt:"En mayo de 2017 las acciones de la sociedad del club pasan a nuevos dueños. Más tarde, por sueldos impagos, es sancionado con la resta de 3 puntos y desciende a Tercera A."},
      {anio:2019,hito:"Dos clubes, un nombre",txt:"Para 2019 dos equipos paralelos presentaron sus cuadernos de cargos ante la ANFA con el nombre del club."},
      {anio:2020,hito:"Se fusionan",txt:"En octubre los dos equipos con el nombre de Lota Schwager acuerdan fusionarse y compiten en Tercera A como un solo club, con inversión de una empresa pesquera."},
      {anio:2022,hito:"Baja a Tercera B",txt:"No le gana a Provincial Osorno en la última fecha y desciende a Tercera B: por primera vez en su historia, jugando de local."},
      {anio:2023,hito:"Invitado por cautelar",txt:"Por un litigio con la ANFA entra a la Tercera B como invitado, por una medida cautelar. En la liguilla de ascenso «ningún club se presentó a jugar» con él; termina tercero y no sube."},
      {anio:2024,hito:"Vuelve a Tercera A",txt:"Gana el grupo sur de Tercera B: en la última fecha, de local, vence 2-0 a Naval y supera a Malleco Unido por diferencia de goles."},
      {anio:2025,hito:"Vuelve al profesionalismo",txt:"Cae en semifinales del play-off ante Comunal Cabrero, pero un cupo extra por la desafiliación de Deportes Melipilla se define 0-0 y en penales: regresa al profesionalismo tras 9 años."}
    ],
    arcos:[
      {id:"lsc_h_a1",t:"Una sola camiseta",desc:"Los dos Lota Schwager se fusionaron en 2020: ¿quién manda ahora?",capitulos:[
        {id:"lsc_h_a1_1",t:"El socio de la pesca",ctx:"En octubre de 2020 los dos equipos que usaban el nombre Lota Schwager se fusionaron en un solo club, con inversión de una empresa pesquera. Hoy esa inversión pide más voz: quiere opinar sobre el técnico y sobre dos refuerzos.",
         ops:[
          {t:"Darle voz en los fichajes", d:"Más plata ahora, menos mando mañana.", ef:{plata:25,moral:-1}, grupos:{sponsors:8,camarin:-6,tecnico:-5,directorio:2}, mem:"le diste voz en los fichajes al socio que puso la plata", va:"lsc_h_a1_2"},
          {t:"Plata sí, cancha no", d:"Aceptas el aporte y le cierras el camarín.", ef:{plata:10,prestigio:1}, grupos:{sponsors:-4,tecnico:5,camarin:3,directorio:-2}, mem:"aceptaste la plata del socio y le cerraste el camarín", va:"lsc_h_a1_2"},
          {t:"Un comité con socios y empresa", d:"Todo conversado, nada rápido.", ef:{plata:-5,prestigio:1}, grupos:{socios:6,directorio:3,sponsors:2,tecnico:-3}, mem:"armaste un comité entre socios y empresa para decidir", va:"lsc_h_a1_2"}
         ]},
        {id:"lsc_h_a1_2",t:"El litigio",ctx:"En 2023 un litigio con la ANFA dejó al club entrando a la Tercera B como invitado, por una medida cautelar. Hoy otro trámite pendiente puede dejarte sin inscribir al plantel, y el abogado pide plata para apelar.",
         ops:[
          {t:"Pagar y apelar", d:"Defiendes el cupo con un abogado caro.", ef:{plata:-25,prestigio:1}, grupos:{directorio:3,anfp:-5,prensa:2,socios:3}, mem:"pagaste al abogado para apelar otra vez ante la ANFA", va:"lsc_h_a1_3"},
          {t:"Aceptar el fallo y adaptarte", d:"Pierdes tiempo, ganas paz con la ANFA.", ef:{plata:-5,moral:-2}, grupos:{anfp:6,directorio:-3,hinchada:-5,socios:-3}, mem:"aceptaste el fallo para no seguir peleando con la ANFA", va:"lsc_h_a1_3"},
          {t:"Pedir apoyo a la Municipalidad", d:"Te respaldan, y quedas debiendo un favor.", ef:{plata:5,capital:-2}, grupos:{comunidad:7,directorio:2,anfp:-3,prensa:-2}, mem:"le pediste apoyo a la Municipalidad para el litigio", va:"lsc_h_a1_3"}
         ]},
        {id:"lsc_h_a1_3",t:"Nueve años después",ctx:"En 2025 Lota Schwager volvió al profesionalismo tras 9 años, gracias a un cupo extra que se definió en penales. Hoy el club tiene que demostrar que sabe vivir en profesional: planilla en regla, estadio con lo que piden las bases y sueldos al día.",
         ops:[
          {t:"Invertir en estadio y planilla", d:"Te vacías la caja para quedarte arriba.", ef:{plata:-35,prestigio:3,capital:2}, grupos:{anfp:6,hinchada:5,directorio:-4,comunidad:3}, mem:"invertiste en el estadio y la planilla para sostener la vuelta", cierra:true},
          {t:"Hacer lo mínimo que piden las bases", d:"La plata dura, el roce con la ANFP también.", ef:{plata:10,prestigio:-2}, grupos:{anfp:-5,directorio:4,hinchada:-3,prensa:-2}, mem:"hiciste lo mínimo que exigían las bases del profesionalismo", cierra:true},
          {t:"Pedir una prórroga por escrito", d:"Ganas tiempo, y una nota en tu carpeta.", ef:{plata:-5,capital:-1}, grupos:{anfp:-3,directorio:2,comunidad:2,prensa:1}, mem:"pediste una prórroga a la ANFP para cumplir con las bases", cierra:true}
         ]}
      ]},
      {id:"lsc_h_a2",t:"Sueldos al día",desc:"Evita otra resta de puntos por sueldos impagos.",capitulos:[{id:"lsc_h_a2_1",t:"La planilla roja",ctx:"Tras el traspaso de 2017, por sueldos impagos, el club fue sancionado con 3 puntos menos y bajó a Tercera A. Hoy las cuentas otra vez están en rojo y el plantel no cobra hace dos meses.",ops:[{t:"Vender al juvenil estrella",d:"Entra plata, pero el camarín se resiente.",ef:{plata:40,moral:-3,prestigio:-2,capital:2},grupos:{camarin:-8,tecnico:-4,hinchada:-3,sponsors:5,directorio:4},mem:"vendiste al juvenil estrella y el camarín quedó partido",va:"lsc_h_a2_2"},{t:"Pedir un adelanto a los sponsors",d:"Llega algo de plata, pero quedas hipotecado.",ef:{plata:15,prestigio:1,capital:-3},grupos:{sponsors:-5,directorio:3,hinchada:1,prensa:2},mem:"pediste un adelanto a los sponsors y quedaste hipotecado",va:"lsc_h_a2_2"},{t:"Negociar una quita con el plantel",d:"Los jugadores aceptan cobrar menos, pero la confianza se quiebra.",ef:{plata:5,moral:-2,capital:1},grupos:{camarin:-6,tecnico:2,directorio:-2,prensa:-3},mem:"negociaste una quita con el plantel y el vestuario quedó helado",va:"lsc_h_a2_2"}]},{id:"lsc_h_a2_2",t:"El fantasma de 2017",ctx:"Tras el traspaso de 2017, por sueldos impagos, el club perdió 3 puntos. Hoy la ANFP revisa los contratos y exige finiquitos al día. La hinchada está dividida entre exigir pagos y salvar la temporada.",ops:[{t:"Organizar una colecta en la cuenca",d:"La comunidad aporta, pero los grandes ausentes se notan.",ef:{plata:12,moral:4,prestigio:2},grupos:{comunidad:10,hinchada:6,socios:3,sponsors:-2,directorio:1},mem:"organizaste la colecta en la cuenca del carbón y la comunidad respondió",va:"lsc_h_a2_3"},{t:"Aceptar el apoyo municipal",d:"Llega plata a cambio de ceder el estadio por eventos.",ef:{plata:20,prestigio:-1,capital:2},grupos:{comunidad:5,hinchada:-2,socios:-1,sponsors:3,directorio:4},mem:"aceptaste el apoyo municipal y cediste el estadio por eventos",va:"lsc_h_a2_3"},{t:"Tomar un préstamo de un directivo",d:"Pagas al día, pero el control se va de tus manos.",ef:{plata:30,moral:-2,prestigio:-3,capital:-5},grupos:{directorio:-6,camarin:4,hinchada:1,prensa:-2,anfp:3},mem:"tomaste el préstamo del directivo y ahora te cobra con cargos",va:"lsc_h_a2_3"}]},{id:"lsc_h_a2_3",t:"La última cuota",ctx:"Tras el traspaso de 2017, la resta de 3 puntos por sueldos impagos lo mandó a Tercera A. El plazo para pagar sueldos vence hoy; si no pagas, la ANFP restará puntos y volverás a caer.",ops:[{t:"Pagar todo y quedar en cero",d:"Salvas la temporada, pero no queda plata para refuerzos.",ef:{plata:-50,moral:6,prestigio:4,capital:-2},grupos:{camarin:8,hinchada:7,anfp:6,sponsors:3,directorio:2},mem:"pagaste todo y quedaste en cero, pero el equipo sigue en pie",cierra:true},{t:"Pagar solo lo mínimo y arriesgar",d:"Queda plata, pero la ANFP abre investigación.",ef:{plata:-20,moral:-2,prestigio:-3,capital:1},grupos:{anfp:-7,camarin:-5,hinchada:-3,directorio:2,sponsors:1},mem:"pagaste lo mínimo y la ANFP abrió carpeta",cierra:true},{t:"No pagar y asumir la resta",d:"Te restan puntos y te arriesgas a bajar, pero guardas plata para rearmarte.",ef:{plata:10,moral:-6,prestigio:-5,capital:4},grupos:{hinchada:-10,camarin:-8,anfp:-5,comunidad:-4,tecnico:-6},mem:"no pagaste, te restaron puntos y guardaste la caja",cierra:true}]}]}
    ]
  },
  /* ---------- DEPORTES LINARES · "Depo", "Albirrojos", "Toros" ----------
     Fuente: https://es.wikipedia.org/wiki/Club_de_Deportes_Linares (consultado 2026-10-16). Hechos verificados con citas textuales (scripts/historia/LIN.json);
     redactado con DeepSeek y revisado a mano (7.9141). */
  LIN:{
    fuente:"https://es.wikipedia.org/wiki/Club_de_Deportes_Linares", consultado:"2026-11-15",
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
  },
  /* ---------- COLCHAGUA · "La Herradura", "Gigante de San Fernando" ----------
     Fuente: https://es.wikipedia.org/wiki/Colchagua_Club_de_Deportes (consultado 2026-11-15). Hechos verificados con fragmentos textuales (scripts/historia/CLC.json); redactado a mano (7.9149). */
  CLC:{
    fuente:"https://es.wikipedia.org/wiki/Colchagua_Club_de_Deportes", consultado:"2026-11-15",
    apodos:["La Herradura", "Gigante de San Fernando"],
    hitos:[
      {anio:1939,hito:"Estadio municipal",txt:"Se inaugura el Estadio Municipal Jorge Silva Valenzuela, de San Fernando, con capacidad para 6.000 personas según la fuente. La cancha es de la ciudad, no del club."},
      {anio:1957,hito:"Fundación",txt:"23 de enero. Nace en San Fernando como Club Deportivo San Fernando, de la fusión de dos clubes de la ciudad: Unión Comercial y Tomás Lawrence."},
      {anio:1960,hito:"Club de Deportes Colchagua",txt:"Cambia su nombre a Club de Deportes Colchagua."},
      {anio:1982,hito:"Final del Apertura",txt:"Llega a la final del Campeonato de Apertura de Segunda División y la pierde ante Everton."},
      {anio:1983,hito:"Baja a Tercera",txt:"Al año siguiente desciende a Tercera División."},
      {anio:1987,hito:"Primer título",txt:"Campeón de Tercera: golea 4-1 a Juventud Ferro de Chimbarongo en el partido definitorio, jugado en Rengo."},
      {anio:1995,hito:"Nombre actual",txt:"Adopta su denominación actual: Colchagua Club de Deportes."},
      {anio:1998,hito:"Otro título de Tercera",txt:"Gana el torneo de Tercera División."},
      {anio:2007,hito:"Final con Arica",txt:"Llega a la final del campeonato con San Marcos de Arica: 2-1 para Arica en la ida y 1-1 en San Fernando. Gana Arica."},
      {anio:2014,hito:"Campeón y profesional",txt:"Campeón de Tercera A por tercera vez en su historia: sube a la Segunda División Profesional."},
      {anio:2019,hito:"A un punto",txt:"En la Liguilla de Ascenso queda a un punto de ascender."},
      {anio:2021,hito:"Colista",txt:"Termina último con 18 puntos y vuelve a Tercera División."},
      {anio:2025,hito:"Vuelve a Segunda",txt:"El 30 de noviembre le gana 4-1 a Comunal Cabrero la final de los playoffs y regresa a la Segunda División Profesional."}
    ],
    arcos:[
      {id:"clc_h_herradura",t:"Un punto, una herradura",desc:"Entre subir y caer: cada decisión se paga en la tabla.",capitulos:[
        {id:"clc_h_herradura_1",t:"A un punto",ctx:"En 2019 Colchagua quedó a un punto de ascender en la Liguilla de Ascenso. Hoy, en la parte de arriba de la tabla, un grupo de hinchas te pide que «esta vez no se escape» y que contrates a dos refuerzos de nombre.",
         ops:[
          {t:"Fichar a dos de nombre", d:"Sale en los diarios. La caja lo siente.", ef:{plata:-35,moral:2,prestigio:2}, grupos:{hinchada:8,prensa:4,directorio:-6}, mem:"firmaste a dos nombres para no quedarte otra vez a un punto", va:"clc_h_herradura_2"},
          {t:"Confiar en el plantel que subió", d:"Sin refuerzos: apuestas por lo que ya tienes.", ef:{plata:5,moral:3}, grupos:{camarin:8,hinchada:-4,prensa:-3}, mem:"le diste la confianza al plantel que ya estaba", va:"clc_h_herradura_2"},
          {t:"Reforzar solo la banca", d:"Profundidad barata, titulares de siempre.", ef:{plata:-10,prestigio:1}, grupos:{tecnico:3,directorio:2,hinchada:-2,camarin:-2}, mem:"reforzaste la banca y no el once", va:"clc_h_herradura_2"}
         ]},
        {id:"clc_h_herradura_2",t:"Colista",ctx:"En 2021 el club terminó último, con 18 puntos, y bajó a Tercera. Hoy una mala racha te devuelve al fondo de la tabla y en la dirigencia ya se habla de «cambiar todo» como aquel año.",
         ops:[
          {t:"Cambiar de técnico ya", d:"Cortas la racha o la empeoras.", ef:{moral:-3,prestigio:-1}, grupos:{tecnico:-8,hinchada:5,directorio:4}, mem:"cortaste al técnico en plena racha mala", va:"clc_h_herradura_3"},
          {t:"Aguantar con el técnico", d:"Confías, y la tribuna lo anota.", ef:{moral:2}, grupos:{tecnico:6,hinchada:-6,prensa:-4,directorio:-3}, mem:"aguantaste al técnico en la racha mala", va:"clc_h_herradura_3"},
          {t:"Mover solo al ayudante", d:"Un cambio de forma, no de fondo.", ef:{plata:-3}, grupos:{camarin:2,prensa:2,tecnico:-3,hinchada:-2}, mem:"cambiaste al ayudante y dejaste todo lo demás igual", va:"clc_h_herradura_3"}
         ]},
        {id:"clc_h_herradura_3",t:"Quedarse",ctx:"El 30 de noviembre de 2025 Colchagua le ganó 4-1 a Comunal Cabrero la final de los playoffs y volvió a la Segunda Profesional. Hoy el directorio te pide armar el club «para quedarse» y el hincha te pide armarlo «para subir».",
         ops:[
          {t:"Armar para quedarse", d:"Planilla corta, cantera y paciencia.", ef:{plata:-20,prestigio:2,capital:1}, grupos:{socios:6,comunidad:5,hinchada:-3,directorio:2}, mem:"armaste el club para quedarse en la categoría", cierra:true},
          {t:"Armar para subir a la B", d:"Todo a una carta. Si sale, se canta.", ef:{plata:-30,moral:2}, grupos:{hinchada:8,sponsors:3,directorio:-6,socios:-2}, mem:"jugaste el club a subir y no a quedarse", cierra:true},
          {t:"Vender a quien se pueda", d:"Entra plata, sale el que más rinde.", ef:{plata:35,moral:-3}, grupos:{directorio:6,camarin:-8,hinchada:-5}, mem:"vendiste a tus mejores para sostener la caja", cierra:true}
         ]}
      ]},
      {id:"clc_h_casa",t:"La cancha es de la ciudad",desc:"Un estadio municipal, un clásico y un nombre que cambió.",capitulos:[
        {id:"clc_h_casa_1",t:"La casa prestada",ctx:"El Estadio Municipal Jorge Silva Valenzuela se inauguró en 1939 y es de la ciudad, no del club. Hoy la Municipalidad te pide ceder la cancha una semana de partido para un evento y ofrece arreglar el pasto a cambio.",
         ops:[
          {t:"Ceder la semana", d:"Pasto nuevo, y esa fecha la juegas en otra parte.", ef:{plata:8,moral:-2}, grupos:{comunidad:8,hinchada:-4,camarin:-3}, mem:"le cediste la cancha a la Municipalidad a cambio del pasto", va:"clc_h_casa_2"},
          {t:"Negarte: la cancha es del partido", d:"Cuidas la fecha y te peleas con el municipio.", ef:{prestigio:1}, grupos:{hinchada:4,camarin:3,comunidad:-7,directorio:-2}, mem:"le dijiste que no al municipio por tu cancha", va:"clc_h_casa_2"},
          {t:"Convenio por escrito", d:"Ceden un día y tú pones las reglas.", ef:{plata:-5,prestigio:2}, grupos:{directorio:3,comunidad:3,anfp:2,hinchada:-1}, mem:"firmaste un convenio con la Municipalidad por la cancha", va:"clc_h_casa_2"}
         ]},
        {id:"clc_h_casa_2",t:"El Clásico Huaso",ctx:"Colchagua nació en 1957 como Club Deportivo San Fernando y hoy la fecha que más marca la gente es el clásico con Curicó Unido. La policía pide cerrar un sector de la tribuna y la barra local lo toma como un castigo.",
         ops:[
          {t:"Cerrar el sector y explicar", d:"Seguridad primero, y te cae la barra.", ef:{prestigio:2,moral:-1}, grupos:{anfp:4,comunidad:3,hinchada:-6}, mem:"cerraste un sector de la tribuna por seguridad en el clásico", va:"clc_h_casa_3"},
          {t:"Negociar con la barra", d:"Piden gestos a cambio de portarse bien.", ef:{plata:-8}, grupos:{hinchada:6,anfp:-5,comunidad:-2}, mem:"negociaste con la barra antes del clásico", va:"clc_h_casa_3"},
          {t:"Pedir más policías y pagar", d:"Todo abierto, con la cuenta a tu nombre.", ef:{plata:-18,prestigio:1}, grupos:{anfp:3,hinchada:4,directorio:-4}, mem:"pagaste más policías para abrir toda la tribuna", va:"clc_h_casa_3"}
         ]},
        {id:"clc_h_casa_3",t:"San Fernando o Colchagua",ctx:"En 1960 el club pasó de Club Deportivo San Fernando a Club de Deportes Colchagua. Hoy los alcaldes de dos comunas vecinas piden que el club juegue una fecha en su estadio, y los socios de San Fernando se oponen.",
         ops:[
          {t:"Jugar una fecha en la otra comuna", d:"Entran familias nuevas, sale una fecha de casa.", ef:{plata:15,moral:-1}, grupos:{comunidad:6,sponsors:4,socios:-8,hinchada:-4}, mem:"llevaste una fecha de Colchagua a otra comuna", cierra:true},
          {t:"Quedarte en San Fernando", d:"La casa es la casa.", ef:{prestigio:1}, grupos:{socios:7,hinchada:5,comunidad:-5,sponsors:-3}, mem:"dejaste a Colchagua en San Fernando", cierra:true},
          {t:"Invitar a las escuelas de las comunas", d:"Entradas gratis y pasto lleno de niños.", ef:{plata:-12,prestigio:1}, grupos:{comunidad:8,socios:-2,directorio:-3}, mem:"abriste la cancha a las escuelas de la provincia", cierra:true}
         ]}
      ]}
    ]
  },
  /* ---------- SANTIAGO MORNING · "Los Bohemios" ----------
     Fuente: https://es.wikipedia.org/wiki/Club_de_Deportes_Santiago_Morning (consultado 2026-11-15). Hechos verificados con fragmentos textuales (scripts/historia/SMO.json); redactado a mano (7.9149). */
  SMO:{
    fuente:"https://es.wikipedia.org/wiki/Club_de_Deportes_Santiago_Morning", consultado:"2026-11-15",
    apodos:["Los Bohemios"],
    hitos:[
      {anio:1903,hito:"Fundación",txt:"16 de octubre. Alumnos del Liceo Valentín Letelier fundan el Santiago Football Club, el origen del club."},
      {anio:1936,hito:"Santiago Morning",txt:"Se fusionan el Club de Deportes Santiago y Morning Star y nace el Club de Deportes Santiago Morning. Mantiene 1903 como fecha de fundación."},
      {anio:1942,hito:"Campeón de Primera",txt:"Gana el campeonato nacional de Primera División en la última fecha: su mayor logro."},
      {anio:1956,hito:"Primer descenso",txt:"Cae por primera vez a la Segunda División."},
      {anio:1959,hito:"Campeón de Segunda",txt:"Gana la Segunda División y los bohemios regresan a Primera."},
      {anio:1996,hito:"Campeón de Tercera",txt:"Campeón de Tercera División: sube a la Primera B."},
      {anio:1999,hito:"Sube con la liguilla",txt:"Gana la Liguilla de Promoción a Provincial Osorno y vuelve a Primera División."},
      {anio:2000,hito:"Final de Copa Chile",txt:"Llega a la final de la Copa Chile y la pierde 2-1 con Universidad de Chile."},
      {anio:2002,hito:"Baja a Primera B",txt:"Desciende otra vez a la Primera B."},
      {anio:2005,hito:"Sube directo",txt:"Primero de la Primera B: sube directamente a Primera División."},
      {anio:2008,hito:"Batacazo al Nacional",txt:"Gana 2-1 a Universidad de Chile en el Estadio Nacional, en el Torneo de Apertura."},
      {anio:2011,hito:"Baja en la última fecha",txt:"Desciende a la Primera B tras caer 2-1 en la última fecha."},
      {anio:2025,hito:"Primera vez en Segunda",txt:"Desciende por primera vez a la Segunda División Profesional. Juega en el Estadio Municipal de La Pintana."}
    ],
    arcos:[
      {id:"smo_h_bohemios",t:"Los bohemios y el 42",desc:"Un título viejo, caídas repetidas y una Copa Chile que no se olvida.",capitulos:[
        {id:"smo_h_bohemios_1",t:"La copa del 42",ctx:"Santiago Morning ganó el campeonato nacional de Primera en 1942, en la última fecha. Hoy ese título es lo más grande que tiene el club y un auspiciador local quiere usarlo en una campaña con la camiseta antigua.",
         ops:[
          {t:"Aceptar la campaña", d:"Plata fresca y el pasado como vitrina.", ef:{plata:15,prestigio:1}, grupos:{sponsors:6,socios:-4,prensa:3}, mem:"le prestaste el título del 42 a una campaña de auspiciador", va:"smo_h_bohemios_2"},
          {t:"Negarte: el 42 no se vende", d:"Cuidas la historia, la caja lo nota.", ef:{plata:-5,prestigio:2}, grupos:{socios:7,hinchada:4,sponsors:-6}, mem:"le dijiste que no al auspiciador por el título del 42", va:"smo_h_bohemios_2"},
          {t:"Hacer una muestra en el club", d:"Gratis, con la gente adentro.", ef:{plata:-8,prestigio:1}, grupos:{comunidad:7,socios:5,directorio:-2}, mem:"armaste una muestra con el título del 42 para la gente del club", va:"smo_h_bohemios_2"}
         ]},
        {id:"smo_h_bohemios_2",t:"Caer y volver",ctx:"El club cayó a Segunda en 1956 y volvió campeón en 1959. Hoy, después del descenso de 2025, un grupo de socios antiguos pide «hacerlo como en el 59»: plantel corto, cantera y poca plata.",
         ops:[
          {t:"Cantera y cero refuerzos", d:"Aprenden jugando. Los puntos se pagan.", ef:{plata:10,moral:2,prestigio:-1}, grupos:{socios:7,hinchada:-5,camarin:4,tecnico:-3}, mem:"le diste la camiseta a la cantera para volver a subir", va:"smo_h_bohemios_3"},
          {t:"Refuerzos y a subir ya", d:"Caro, rápido y con riesgo.", ef:{plata:-35,moral:2}, grupos:{hinchada:8,directorio:-6,socios:-3,prensa:3}, mem:"gastaste en refuerzos para salir de Segunda de una vez", va:"smo_h_bohemios_3"},
          {t:"Mitad y mitad", d:"Cuatro experimentados y los juveniles.", ef:{plata:-15,prestigio:1}, grupos:{camarin:5,tecnico:3,hinchada:-1,directorio:-2}, mem:"mezclaste experiencia y cantera para el regreso", va:"smo_h_bohemios_3"}
         ]},
        {id:"smo_h_bohemios_3",t:"La final del 2000",ctx:"En 2000 Santiago Morning perdió la final de la Copa Chile 2-1 con la U, y en 2008 le ganó 2-1 en el Nacional. Hoy la Copa Chile te pone frente a un grande y el técnico quiere guardar a los titulares para la liga.",
         ops:[
          {t:"Jugarla con todo", d:"Un partido grande vale más que tres puntos.", ef:{moral:3,prestigio:2}, grupos:{hinchada:7,prensa:5,tecnico:-4,camarin:-2}, mem:"jugaste la Copa Chile con todos los titulares", cierra:true},
          {t:"Guardar a los titulares", d:"La liga manda; la copa es un premio.", ef:{plata:5,prestigio:-2}, grupos:{tecnico:5,directorio:3,hinchada:-8,prensa:-3}, mem:"guardaste a los titulares y mandaste una copa a medias", cierra:true},
          {t:"Rotar a mitad de equipo", d:"Ni todo ni nada.", ef:{moral:1}, grupos:{camarin:4,tecnico:2,hinchada:-2}, mem:"rotaste a medio equipo en la Copa Chile", cierra:true}
         ]}
      ]},
      {id:"smo_h_pintana",t:"Casa en La Pintana",desc:"Un estadio municipal, un descenso en la última fecha y un sello de siglo.",capitulos:[
        {id:"smo_h_pintana_1",t:"Casa municipal",ctx:"Tras el descenso de 2025 el club juega en el Estadio Municipal de La Pintana. La Municipalidad te pide dos fechas libres al año para actividades de la comuna y las bases de la Segunda aprietan por el estado de la cancha.",
         ops:[
          {t:"Aceptar las dos fechas", d:"Buen trato con el municipio; pierdes ingresos.", ef:{plata:-10,moral:-1}, grupos:{comunidad:8,hinchada:-3,directorio:-3}, mem:"le cediste dos fechas al municipio de La Pintana", va:"smo_h_pintana_2"},
          {t:"Negociar solo una", d:"Un punto medio, nadie contento.", ef:{plata:-4}, grupos:{comunidad:2,directorio:2,hinchada:-1}, mem:"negociaste solo una fecha libre con el municipio", va:"smo_h_pintana_2"},
          {t:"Decirle que no", d:"Te quedas con tus fechas.", ef:{prestigio:1}, grupos:{hinchada:4,directorio:3,comunidad:-8}, mem:"le negaste las fechas al municipio de La Pintana", va:"smo_h_pintana_2"}
         ]},
        {id:"smo_h_pintana_2",t:"La última fecha",ctx:"En 2011 el club cayó 2-1 en la última fecha y bajó a la Primera B. Hoy llegas a otra recta final con el descenso en juego y el técnico quiere debutar a un juvenil de 17 años en el partido que decide todo.",
         ops:[
          {t:"Debutar al juvenil", d:"Un riesgo que puede ser leyenda.", ef:{moral:2,prestigio:1}, grupos:{socios:4,hinchada:-3,tecnico:3,camarin:-3}, mem:"debutaste a un juvenil en la fecha que decidía la categoría", va:"smo_h_pintana_3"},
          {t:"Jugar con los de siempre", d:"Seguro, aunque ya no den más.", ef:{moral:-1}, grupos:{camarin:3,tecnico:-2,hinchada:2,prensa:-2}, mem:"saliste con los de siempre en la fecha que decidía todo", va:"smo_h_pintana_3"},
          {t:"Dejarle la decisión al técnico", d:"Si sale mal, es de él.", ef:{capital:-1}, grupos:{tecnico:6,directorio:-4,camarin:2,prensa:1}, mem:"le dejaste la decisión del once al técnico", va:"smo_h_pintana_3"}
         ]},
        {id:"smo_h_pintana_3",t:"Dos clubes en uno",ctx:"El club nació en 1903 y se fusionó en 1936 con Morning Star. Hoy un grupo de socios quiere recuperar el nombre de Morning Star para el segundo uniforme y otro grupo quiere dejar solo Santiago Morning.",
         ops:[
          {t:"Sumar el nombre Morning Star", d:"Un guiño al origen; la camiseta cambia.", ef:{plata:-8,prestigio:1}, grupos:{socios:7,hinchada:3,sponsors:-3,directorio:-2}, mem:"sumaste el nombre de Morning Star al segundo uniforme", cierra:true},
          {t:"Dejar solo Santiago Morning", d:"La marca de siempre, sin discusiones.", ef:{plata:3}, grupos:{sponsors:3,directorio:3,socios:-7,hinchada:-2}, mem:"dejaste solo el nombre de Santiago Morning", cierra:true},
          {t:"Abrir la votación entre socios", d:"Que decidan ellos, y se quedan con la cuenta.", ef:{plata:-5,capital:1}, grupos:{socios:8,directorio:-4,prensa:2,hinchada:2}, mem:"le diste la votación del uniforme a los socios", cierra:true}
         ]}
      ]}
    ]
  },
  /* ---------- PROVINCIAL OSORNO · "Toros", "Provi" ----------
     Fuente: https://es.wikipedia.org/wiki/Provincial_Osorno (club refundado en 2012) y https://es.wikipedia.org/wiki/Club_Deportivo_Provincial_Osorno (club antiguo, 1983-2012), consultados 2026-11-15. Fragmentos textuales en scripts/historia/OSO.json; redactado a mano (7.9149). */
  OSO:{
    fuente:"https://es.wikipedia.org/wiki/Provincial_Osorno", consultado:"2026-11-15",
    apodos:["Toros", "Provi"],
    hitos:[
      {anio:1983,hito:"Nace el club",txt:"5 de junio. Se funda el Club Deportivo Provincial Osorno, el club antiguo, anterior al actual."},
      {anio:1991,hito:"Primera y vuelta",txt:"Sube a Primera el 6 de enero de 1991, en el Jorge Silva Valenzuela, pero termina penúltimo en la tabla anual y vuelve a la Primera B."},
      {anio:1992,hito:"Campeón del ascenso",txt:"Gana el segundo título nacional del ascenso."},
      {anio:1996,hito:"Su mejor lugar",txt:"Entre 1993 y 1998 está seis años seguidos en Primera. Su mejor lugar es el 6.º, en 1996."},
      {anio:1998,hito:"Pierde la liguilla",txt:"Baja de Primera al perder la Liguilla de Promoción con Santiago Morning."},
      {anio:2003,hito:"A la Sudamericana",txt:"Clasifica a la Copa Sudamericana. Según la fuente, es el primer equipo de Primera B en jugar un torneo continental."},
      {anio:2007,hito:"Campeón de Primera B",txt:"Gana por tercera vez en su historia la Primera B."},
      {anio:2010,hito:"Pierde la categoría",txt:"El 2 de octubre cae en la serie de descenso y deja el profesionalismo por primera vez en su historia."},
      {anio:2012,hito:"Desafiliado y refundado",txt:"La ANFP desafilia al club antiguo por una deuda millonaria. El 3 de diciembre socios e hinchas fundan Deportes Provincial Osorno."},
      {anio:2016,hito:"Campeón de Tercera A",txt:"El club nuevo sube de Tercera B a Tercera A (2015) y gana la Tercera A 2016: asciende a la Segunda División."},
      {anio:2017,hito:"Último en Segunda",txt:"Compite como Club de Deportes Osorno, termina último con 16 puntos y baja. En 2018 vuelve a llamarse Provincial Osorno."},
      {anio:2019,hito:"Sin Estadio Seguro",txt:"El Rubén Marcos Peralta no recibe la aprobación del plan Estadio Seguro por falencias estructurales y de seguridad: juega la Copa Chile en Valdivia."},
      {anio:2021,hito:"Pandemia y sanción",txt:"En 2020 descarta jugar la Tercera A por la pandemia. En 2021 una sanción de la ANFA le resta tres puntos y queda eliminado en la primera fase."},
      {anio:2022,hito:"Vuelve a Segunda",txt:"En noviembre regresa al profesionalismo tras 5 años de ausencia, con un empate de Rengo en la última fecha."}
    ],
    arcos:[
      {id:"oso_h_dos",t:"Dos clubes, un nombre",desc:"El club que se fue en 2012 y el que nació de su hinchada.",capitulos:[
        {id:"oso_h_dos_1",t:"El archivo del club",ctx:"En 2012 la ANFP desafilió al Club Deportivo Provincial Osorno por una deuda millonaria y ese mismo año socios e hinchas fundaron Deportes Provincial Osorno. Hoy un ex dirigente del club antiguo te pide las copas y camisetas viejas «para guardarlas bien».",
         ops:[
          {t:"Entregarlas todas", d:"El pasado vuelve a sus dueños; te quedas sin vitrina.", ef:{prestigio:-1}, grupos:{socios:-3,comunidad:5,hinchada:-2}, mem:"entregaste las copas del club antiguo a su ex dirigente", va:"oso_h_dos_2"},
          {t:"Quedártelas en el club", d:"La historia vive donde está la hinchada.", ef:{prestigio:2}, grupos:{socios:6,hinchada:5,comunidad:-5}, mem:"te quedaste con las copas del club antiguo", va:"oso_h_dos_2"},
          {t:"Convenio de exhibición", d:"Se muestran juntas y cada uno guarda lo suyo.", ef:{plata:-6,prestigio:2}, grupos:{comunidad:6,directorio:2,socios:2}, mem:"firmaste un convenio para exhibir las copas entre los dos", va:"oso_h_dos_2"}
         ]},
        {id:"oso_h_dos_2",t:"Seis años seguidos",ctx:"Entre 1993 y 1998 el club antiguo estuvo seis años seguidos en Primera, con un 6.º lugar en 1996. Hoy la hinchada compara y te exige «volver a ser grande» con un plantel de Segunda.",
         ops:[
          {t:"Pedir paciencia por escrito", d:"Un compromiso de tres años, públicos.", ef:{prestigio:1,moral:-1}, grupos:{socios:5,hinchada:-6,prensa:2,directorio:2}, mem:"le pediste paciencia por tres años a la hinchada", va:"oso_h_dos_3"},
          {t:"Prometer ascenso este año", d:"Ilusión hoy, deuda con la tribuna mañana.", ef:{plata:-20,moral:2}, grupos:{hinchada:8,prensa:3,directorio:-5,socios:-2}, mem:"le prometiste el ascenso a la hinchada", va:"oso_h_dos_3"},
          {t:"Hablar de proceso con cifras", d:"Menos épica, más números.", ef:{prestigio:2}, grupos:{directorio:4,socios:3,hinchada:-3,prensa:-2}, mem:"le explicaste el proceso a la hinchada con cifras", va:"oso_h_dos_3"}
         ]},
        {id:"oso_h_dos_3",t:"Con otro nombre",ctx:"En 2017, como Club de Deportes Osorno, el equipo terminó último con 16 puntos y bajó; en 2018 volvió a llamarse Provincial Osorno. Hoy un auspiciador ofrece mucha plata si el club lleva su marca en el nombre.",
         ops:[
          {t:"Aceptar el nombre de la marca", d:"Plata grande hoy; la identidad se mueve.", ef:{plata:40,prestigio:-2}, grupos:{sponsors:8,directorio:5,socios:-8,hinchada:-6}, mem:"le pusiste a la marca en el nombre del club", cierra:true},
          {t:"Aceptar solo el estadio", d:"La marca va en la cancha, no en el club.", ef:{plata:15,prestigio:1}, grupos:{sponsors:4,directorio:2,hinchada:-2,socios:1}, mem:"vendiste el nombre del estadio y no el del club", cierra:true},
          {t:"Rechazar", d:"El nombre se queda como volvió en 2018.", ef:{plata:-5,prestigio:2}, grupos:{socios:7,hinchada:5,sponsors:-5,directorio:-3}, mem:"le dijiste que no a la marca por el nombre del club", cierra:true}
         ]}
      ]},
      {id:"oso_h_cancha",t:"Un estadio con papeles",desc:"El Rubén Marcos Peralta, la pandemia y una última fecha.",capitulos:[
        {id:"oso_h_cancha_1",t:"Estadio Seguro",ctx:"En 2019 el Rubén Marcos Peralta no recibió la aprobación del plan Estadio Seguro por falencias estructurales y de seguridad, y el club jugó la Copa Chile en Valdivia. Hoy la inspección llega en tres semanas y la lista de obras es larga.",
         ops:[
          {t:"Pagar las obras urgentes", d:"Cumples a tiempo y la caja se resiente.", ef:{plata:-30,prestigio:3}, grupos:{anfp:5,hinchada:4,comunidad:3,directorio:-4}, mem:"pagaste las obras urgentes para pasar la inspección", va:"oso_h_cancha_2"},
          {t:"Pedir prórroga y usar otra cancha", d:"Ganas tiempo, y la tribuna viaja.", ef:{plata:-10,moral:-2}, grupos:{anfp:-3,hinchada:-6,directorio:2,comunidad:-2}, mem:"pediste una prórroga y jugaste en otra cancha", va:"oso_h_cancha_2"},
          {t:"Que el municipio cubra las obras", d:"Se lo piden entre dos y quedan debiendo.", ef:{plata:10,capital:-2}, grupos:{comunidad:-3,directorio:3,anfp:2}, mem:"le pasaste las obras al municipio", va:"oso_h_cancha_2"}
         ]},
        {id:"oso_h_cancha_2",t:"La temporada que no fue",ctx:"En 2020 el club descartó participar en la Tercera A por la pandemia y en 2021 una sanción de la ANFA le restó tres puntos y quedó eliminado en la primera fase. Hoy un brote en el camarín te obliga a decidir si juegas con un plantel incompleto.",
         ops:[
          {t:"Jugar con los juveniles", d:"Cumples el calendario y juegas con chicos.", ef:{moral:-2,prestigio:-1}, grupos:{anfp:4,socios:3,camarin:-4,hinchada:-3}, mem:"jugaste con juveniles por un brote en el camarín", va:"oso_h_cancha_3"},
          {t:"Pedir postergación", d:"Ganas días y pierdes la buena cara.", ef:{plata:-5}, grupos:{anfp:-5,tecnico:2,camarin:3,prensa:-2}, mem:"pediste postergar el partido por el brote", va:"oso_h_cancha_3"},
          {t:"Asumir el W.O.", d:"Un partido perdido, el plantel cuidado.", ef:{prestigio:-2,moral:3}, grupos:{camarin:8,hinchada:-6,anfp:-3,directorio:-2}, mem:"preferiste perder por W.O. a poner a un plantel enfermo", va:"oso_h_cancha_3"}
         ]},
        {id:"oso_h_cancha_3",t:"Otro empate ajeno",ctx:"En noviembre de 2022 el club volvió a Segunda tras cinco años gracias a un empate de Rengo en la última fecha. Hoy llegas a otra recta final con la categoría dependiendo de resultados ajenos.",
         ops:[
          {t:"Concentrarte solo en lo tuyo", d:"Controlas lo que puedes controlar.", ef:{moral:3,prestigio:1}, grupos:{camarin:5,tecnico:3,prensa:-2,hinchada:-1}, mem:"le pediste al plantel que mirara solo su partido", cierra:true},
          {t:"Hablar con la hinchada", d:"Mostrar la cuenta completa, sin adornos.", ef:{moral:1}, grupos:{hinchada:6,socios:3,prensa:2,tecnico:-3}, mem:"le explicaste a la hinchada de quién dependía la categoría", cierra:true},
          {t:"Contratar apoyo psicológico", d:"Plata en cabeza antes del final.", ef:{plata:-12,moral:4}, grupos:{camarin:6,tecnico:2,directorio:-3,prensa:1}, mem:"pusiste un psicólogo deportivo antes de la última fecha", cierra:true}
         ]}
      ]}
    ]
  },
  /* ---------- TRASANDINO · "El Cóndor", "T-R-A" ----------
     Fuente: https://es.wikipedia.org/wiki/Trasandino_de_Los_Andes (consultado 2026-11-15). Hechos verificados con fragmentos textuales (scripts/historia/TRA.json); redactado a mano (7.9149). */
  TRA:{
    fuente:"https://es.wikipedia.org/wiki/Trasandino_de_Los_Andes", consultado:"2026-11-15",
    apodos:["El Cóndor", "T-R-A"],
    hitos:[
      {anio:1906,hito:"Los ferroviarios",txt:"1 de abril. Trabajadores del Ferrocarril Trasandino Los Andes-Mendoza fundan el club en Los Andes."},
      {anio:1952,hito:"Fundador de la Segunda",txt:"Es uno de los fundadores de la Segunda División profesional chilena."},
      {anio:1982,hito:"Sube a Primera",txt:"Asciende a Primera División ante Malleco Unido, en el Estadio Ferroviario, con 7.530 espectadores."},
      {anio:1984,hito:"Baja en el desempate",txt:"Pierde 0-3 el desempate por la permanencia y desciende a Segunda División."},
      {anio:1985,hito:"Campeón y Cobreandino",txt:"Gana la Segunda División. Ese año Codelco asume la administración y el club pasa a llamarse Cobreandino de Los Andes."},
      {anio:1992,hito:"Deportes Los Andes",txt:"El 18 de diciembre, tras una fusión ordenada por la ANFA, nace Deportes Los Andes."},
      {anio:1998,hito:"Vuelve el nombre",txt:"Los socios optan por renombrar al club como Club Deportivo Trasandino de Los Andes."},
      {anio:2006,hito:"Cien años",txt:"En abril cumple 100 años, con celebraciones en la comunidad."},
      {anio:2012,hito:"Vuelve a ser profesional",txt:"Gana la Tercera A y regresa al profesionalismo después de 21 años en el amateurismo."},
      {anio:2017,hito:"Último y a amateur",txt:"Termina último el Campeonato 2016-17 de la Segunda División Profesional y vuelve al fútbol amateur."},
      {anio:2021,hito:"Campeón de Tercera A",txt:"En julio el 70 % de las acciones pasa a nuevos dueños. El 18 de diciembre se corona campeón de la Tercera A y asciende."}
    ],
    arcos:[
      {id:"tra_h_tren",t:"Del ferrocarril a la mina",desc:"Un club de obreros que cambió de nombre y volvió a elegirlo.",capitulos:[
        {id:"tra_h_tren_1",t:"El nombre prestado",ctx:"En 1985 Codelco asumió la administración y el club pasó a llamarse Cobreandino de Los Andes; en 1998 los socios optaron por volver a Trasandino. Hoy una empresa minera ofrece un auspicio grande con una cláusula: su marca en el nombre del club.",
         ops:[
          {t:"Aceptar con la marca en el nombre", d:"Plata de verdad, y la identidad otra vez a la venta.", ef:{plata:40,prestigio:-2}, grupos:{sponsors:8,directorio:5,socios:-9,hinchada:-6}, mem:"aceptaste una marca en el nombre del club por la plata", va:"tra_h_tren_2"},
          {t:"Aceptar el auspicio sin el nombre", d:"La mitad de la plata, el nombre intacto.", ef:{plata:18,prestigio:-1}, grupos:{sponsors:3,directorio:2,socios:4,hinchada:2}, mem:"aceptaste el auspicio sin tocar el nombre", va:"tra_h_tren_2"},
          {t:"Rechazar", d:"El nombre se queda donde lo votaron en 1998.", ef:{plata:-5,prestigio:2}, grupos:{socios:8,hinchada:6,sponsors:-6,directorio:-3}, mem:"le dijiste que no a la empresa por el nombre del club", va:"tra_h_tren_2"}
         ]},
        {id:"tra_h_tren_2",t:"La asamblea",ctx:"En 1998 fueron los socios los que votaron el nombre del club. Hoy el directorio quiere cambiar el estatuto para que las decisiones grandes ya no pasen por la asamblea, «para ir más rápido».",
         ops:[
          {t:"Defender la asamblea", d:"Más lento, pero la votan los socios.", ef:{prestigio:1,moral:1}, grupos:{socios:8,hinchada:3,directorio:-6,sponsors:-3}, mem:"defendiste que los socios sigan votando las decisiones grandes", va:"tra_h_tren_3"},
          {t:"Aprobar el cambio con un tope", d:"Solo lo urgente sin voto; lo grande, con voto.", ef:{capital:-1}, grupos:{directorio:4,socios:-2,sponsors:2,prensa:-1}, mem:"aprobaste un cambio al estatuto con un tope", va:"tra_h_tren_3"},
          {t:"Aprobar el cambio completo", d:"El directorio manda y la gente mira.", ef:{plata:5,prestigio:-2}, grupos:{directorio:8,sponsors:3,socios:-9,hinchada:-4}, mem:"le sacaste las decisiones grandes a la asamblea", va:"tra_h_tren_3"}
         ]},
        {id:"tra_h_tren_3",t:"Veintiún años afuera",ctx:"En 2012 el club volvió al profesionalismo después de 21 años en el amateurismo, y en 2017 terminó último de la Segunda y volvió a bajar. Hoy te tienta repetir la receta de 2012: traer a medio equipo de afuera y pagar bien.",
         ops:[
          {t:"Traer a medio equipo", d:"Rápido y caro. Si falla, falla bien caro.", ef:{plata:-35,moral:1}, grupos:{hinchada:6,prensa:3,directorio:-6,camarin:-3}, mem:"trajiste a medio equipo de afuera para subir rápido", cierra:true},
          {t:"Apostar por la gente de Los Andes", d:"Más lento, más barato, más propio.", ef:{plata:5,moral:2}, grupos:{comunidad:7,socios:5,hinchada:-4,tecnico:-2}, mem:"armaste el equipo con jugadores de Los Andes", cierra:true},
          {t:"Mixto con tope de sueldos", d:"Pocos de afuera y todos con límite.", ef:{plata:-12,prestigio:1}, grupos:{directorio:4,camarin:-3,hinchada:-1,tecnico:2}, mem:"mezclaste jugadores de afuera con gente de la zona y un tope", cierra:true}
         ]}
      ]},
      {id:"tra_h_ferro",t:"El Ferroviario",desc:"Una tarde con 7.530 personas y un club que depende de otros.",capitulos:[
        {id:"tra_h_ferro_1",t:"Siete mil quinientos",ctx:"En 1982 el club subió a Primera ante Malleco Unido, en el Estadio Ferroviario y con 7.530 espectadores. Hoy juegas en el Estadio Regional de Los Andes, con menos de la mitad de lugares que aquella tarde, y un partido grande te deja gente afuera.",
         ops:[
          {t:"Instalar una tribuna provisoria", d:"Cabe más gente, cuesta plata y seguridad.", ef:{plata:-20,prestigio:1}, grupos:{hinchada:7,comunidad:3,anfp:-3,directorio:-3}, mem:"instalaste una tribuna provisoria para el partido grande", va:"tra_h_ferro_2"},
          {t:"Jugarlo en otra ciudad", d:"Más aforo, pero lejos de casa.", ef:{plata:15,moral:-2}, grupos:{hinchada:-8,sponsors:3,directorio:3,comunidad:-3}, mem:"llevaste un partido grande a otra ciudad", va:"tra_h_ferro_2"},
          {t:"Cupos solo para socios", d:"Los de siempre entran; los de afuera, no.", ef:{prestigio:1}, grupos:{socios:8,hinchada:-3,comunidad:-4,sponsors:-2}, mem:"reservaste el partido grande para los socios", va:"tra_h_ferro_2"}
         ]},
        {id:"tra_h_ferro_2",t:"El nuevo dueño",ctx:"En 1985 el club ganó la Segunda y ese mismo año Codelco asumió la administración. Hoy un socio nuevo con mucho peso quiere meter a dos jugadores de su confianza en el once.",
         ops:[
          {t:"Aceptar a los dos", d:"Te sostiene la caja y el camarín te lo cobra.", ef:{plata:20,moral:-3}, grupos:{directorio:5,sponsors:4,camarin:-8,tecnico:-5}, mem:"aceptaste a dos jugadores del socio nuevo en el once", va:"tra_h_ferro_3"},
          {t:"Que compitan por el puesto", d:"Pueden jugar si se lo ganan.", ef:{plata:5,moral:1}, grupos:{tecnico:5,camarin:3,directorio:-3,sponsors:-2}, mem:"les dijiste a los del socio que el puesto se gana", va:"tra_h_ferro_3"},
          {t:"Decirle que no", d:"La cancha no se negocia.", ef:{plata:-5,prestigio:2}, grupos:{camarin:7,tecnico:5,directorio:-6,sponsors:-5}, mem:"le cerraste el once al socio nuevo", va:"tra_h_ferro_3"}
         ]},
        {id:"tra_h_ferro_3",t:"La fusión",ctx:"El 18 de diciembre de 1992, por una fusión ordenada por la ANFA, nació Deportes Los Andes. Hoy otro organismo te pide fusionarte con un club vecino para ahorrar costos, y tu hinchada lo vive como un robo de identidad.",
         ops:[
          {t:"Aceptar la fusión", d:"Ahorras, pierdes camiseta.", ef:{plata:25,prestigio:-2}, grupos:{directorio:5,anfp:4,socios:-9,hinchada:-8}, mem:"aceptaste fusionar el club para ahorrar costos", cierra:true},
          {t:"Resistir con los socios", d:"Mantienes el nombre y el costo.", ef:{plata:-12,prestigio:2}, grupos:{socios:8,hinchada:7,anfp:-5,directorio:-4}, mem:"te negaste a fusionar el club junto con los socios", cierra:true},
          {t:"Proponer un convenio de cantera", d:"Compartes juveniles sin perder el club.", ef:{plata:-5,prestigio:1}, grupos:{comunidad:5,anfp:2,directorio:2,socios:-2}, mem:"propusiste un convenio de cantera en lugar de la fusión", cierra:true}
         ]}
      ]}
    ]
  },
  /* ---------- PROVINCIAL OVALLE · "Ciclón del Limarí" ----------
     Fuente: https://es.wikipedia.org/wiki/Provincial_Ovalle (consultado 2026-11-15). Hechos verificados con fragmentos textuales (scripts/historia/OVA.json); redactado a mano (7.9149). */
  OVA:{
    fuente:"https://es.wikipedia.org/wiki/Provincial_Ovalle", consultado:"2026-11-15",
    apodos:["Ciclón del Limarí", "Ciclón"],
    hitos:[
      {anio:1942,hito:"Deportivo Socos",txt:"Se funda el Club Deportivo Socos, el club del que viene el actual Provincial Ovalle."},
      {anio:2015,hito:"Nace el Ciclón",txt:"En julio, después de goleadas por 6-0 y 6-1 en la liga local, nace el apodo «Ciclón»."},
      {anio:2016,hito:"Campeón de Tercera B",txt:"Ya como Provincial Ovalle gana la Tercera División B y asciende a la Tercera A."},
      {anio:2017,hito:"Debut en Tercera A",txt:"El 23 de abril debuta en Tercera A con un 0-1 a Estación Central."},
      {anio:2018,hito:"Su primera Copa Chile",txt:"Es invitado por primera vez a la Copa Chile y cae ante Cobreloa en la primera fase."},
      {anio:2019,hito:"Quinto",txt:"Termina quinto en la tabla general de Tercera A y no asciende en la liguilla."},
      {anio:2022,hito:"Tercera fase",txt:"En la Copa Chile llega a la tercera fase y cae ante Unión Española."},
      {anio:2023,hito:"Campeón y profesional",txt:"Le gana 2-0 a Unión Compañías en un Estadio Diaguita repleto, asciende al profesionalismo y se corona campeón de Tercera A."},
      {anio:2024,hito:"Su primera Segunda",txt:"Primera temporada en la Segunda División. Su mayor goleada ahí: 4-0 a Real San Joaquín."}
    ],
    arcos:[
      {id:"ova_h_ciclon",t:"El Ciclón",desc:"Un apodo nacido de dos goleadas y un club que cambió de nombre.",capitulos:[
        {id:"ova_h_ciclon_1",t:"Un apodo con permiso",ctx:"El apodo «Ciclón» nació en julio de 2015, después de goleadas por 6-0 y 6-1 en la liga local de Ovalle. Hoy un auspiciador te pide una camiseta especial con un ciclón gigante y su logo en el pecho.",
         ops:[
          {t:"Aceptar la camiseta especial", d:"Se vende bien; la marca se queda con el pecho.", ef:{plata:20,prestigio:-1}, grupos:{sponsors:7,hinchada:3,socios:-4,directorio:3}, mem:"aceptaste una camiseta del ciclón con el logo de un auspiciador", va:"ova_h_ciclon_2"},
          {t:"Hacerla sin logo en el pecho", d:"Menos plata, el apodo se respeta.", ef:{plata:5,prestigio:1}, grupos:{hinchada:6,socios:4,sponsors:-4}, mem:"hiciste la camiseta del ciclón sin logo en el pecho", va:"ova_h_ciclon_2"},
          {t:"Dejar el apodo para la gente", d:"El ciclón es de los hinchas, no de las marcas.", ef:{plata:-5,prestigio:2}, grupos:{hinchada:7,comunidad:4,sponsors:-6,directorio:-2}, mem:"dejaste el apodo del ciclón fuera de la publicidad", va:"ova_h_ciclon_2"}
         ]},
        {id:"ova_h_ciclon_2",t:"Socos y Provincial",ctx:"El club nació en 1942 como Deportivo Socos y en 2016 ya se llamaba Provincial Ovalle cuando ganó la Tercera B. Hoy los socios más antiguos reclaman que el origen de Socos no figure en ninguna parte y piden un lugar en el escudo.",
         ops:[
          {t:"Poner Socos en el escudo", d:"Un guiño al origen; el escudo cambia.", ef:{plata:-8,prestigio:1}, grupos:{socios:8,hinchada:3,sponsors:-3,directorio:-2}, mem:"pusiste el nombre de Socos en el escudo del club", va:"ova_h_ciclon_3"},
          {t:"Un museo con la historia de Socos", d:"El escudo queda; la historia tiene sala.", ef:{plata:-12,prestigio:2}, grupos:{socios:6,comunidad:4,directorio:-3}, mem:"armaste una sala con la historia de Socos", va:"ova_h_ciclon_3"},
          {t:"Dejar el escudo como está", d:"Es el escudo de la gente de hoy.", ef:{plata:3}, grupos:{directorio:3,sponsors:2,socios:-7,hinchada:-1}, mem:"dejaste el escudo sin tocar el origen de Socos", va:"ova_h_ciclon_3"}
         ]},
        {id:"ova_h_ciclon_3",t:"El clásico de la división",ctx:"En 2023 el ascenso se selló con un 2-0 a Unión Compañías, su clásico rival de la división, en un Estadio Diaguita repleto. Hoy el sorteo te vuelve a poner enfrente de ese rival en una fecha que decide un cupo.",
         ops:[
          {t:"Armar una semana de clásico", d:"Actividades, banderas y entradas para los niños.", ef:{plata:-15,prestigio:1}, grupos:{hinchada:8,comunidad:6,sponsors:2,directorio:-3}, mem:"armaste una semana entera de clásico en Ovalle", cierra:true},
          {t:"Pedir cancha neutral", d:"Menos riesgo, menos ambiente.", ef:{plata:-5,moral:-2}, grupos:{anfp:4,hinchada:-8,comunidad:-3,directorio:2}, mem:"pediste cancha neutral para el clásico", cierra:true},
          {t:"Cuidar solo lo deportivo", d:"Entrenamiento a puertas cerradas.", ef:{moral:3}, grupos:{tecnico:5,camarin:4,hinchada:-3,prensa:-3}, mem:"cerraste los entrenamientos del clásico a los hinchas", cierra:true}
         ]}
      ]},
      {id:"ova_h_escalon",t:"Escalón por escalón",desc:"Cada categoría llegó con un partido distinto.",capitulos:[
        {id:"ova_h_escalon_1",t:"Quinto en 2019",ctx:"En 2019 el club quedó quinto en la tabla general de la Tercera A y no ascendió en la liguilla. Hoy estás en una posición parecida y un grupo de dirigentes quiere «aprovechar el momento» con cuatro refuerzos caros.",
         ops:[
          {t:"Los cuatro refuerzos", d:"Todo a una carta.", ef:{plata:-40,moral:2}, grupos:{hinchada:7,prensa:3,directorio:-7,camarin:-3}, mem:"firmaste cuatro refuerzos por una liguilla", va:"ova_h_escalon_2"},
          {t:"Dos refuerzos y cantera", d:"Un paso más, con menos riesgo.", ef:{plata:-18,moral:2}, grupos:{camarin:5,tecnico:3,hinchada:2,directorio:-2}, mem:"firmaste dos refuerzos y le diste lugar a la cantera", va:"ova_h_escalon_2"},
          {t:"No gastar y esperar", d:"El año que viene será otro.", ef:{plata:10,moral:-2}, grupos:{directorio:5,hinchada:-6,camarin:-3,prensa:-2}, mem:"decidiste no gastar para esperar otro año", va:"ova_h_escalon_2"}
         ]},
        {id:"ova_h_escalon_2",t:"Una tarde en la Copa",ctx:"En 2022 el club llegó a la tercera fase de la Copa Chile y cayó ante Unión Española. Hoy la Copa te cruza con un equipo de Primera, justo antes de una fecha de liga clave.",
         ops:[
          {t:"Poner a los titulares", d:"La copa vale más que una fecha.", ef:{moral:2,prestigio:2}, grupos:{hinchada:6,prensa:4,tecnico:-3,camarin:-3}, mem:"jugaste la Copa con tus titulares antes de una fecha clave", va:"ova_h_escalon_3"},
          {t:"Rotar a media formación", d:"Ni todo ni nada.", ef:{moral:1}, grupos:{camarin:4,tecnico:2,hinchada:-2,prensa:-1}, mem:"rotaste a la mitad del equipo en la Copa", va:"ova_h_escalon_3"},
          {t:"Guardar a todos para la liga", d:"La Copa es de paso.", ef:{plata:4,prestigio:-2}, grupos:{tecnico:4,directorio:3,hinchada:-7,prensa:-3}, mem:"guardaste a los titulares y regalaste la Copa", va:"ova_h_escalon_3"}
         ]},
        {id:"ova_h_escalon_3",t:"De Tercera a profesional",ctx:"En 2023 el club ascendió al profesionalismo y en 2024 jugó su primera temporada en la Segunda. Hoy la ANFP te pide cumplir las bases: planilla en regla, estadio con los permisos y un cuerpo técnico con licencia.",
         ops:[
          {t:"Cumplir todo desde el primer día", d:"Caro y sin discusión.", ef:{plata:-30,prestigio:3,capital:1}, grupos:{anfp:6,directorio:-4,hinchada:2,prensa:2}, mem:"cumpliste las bases del profesionalismo desde el primer día", cierra:true},
          {t:"Cumplir en dos etapas", d:"Un plan, plazos y una carta.", ef:{plata:-12,prestigio:1}, grupos:{anfp:1,directorio:2,tecnico:-2,hinchada:-1}, mem:"pediste dos etapas para cumplir las bases", cierra:true},
          {t:"Cumplir lo mínimo", d:"La plata dura más, la ANFP te mira.", ef:{plata:8,prestigio:-3}, grupos:{anfp:-6,directorio:3,hinchada:-3,prensa:-2}, mem:"cumpliste solo lo mínimo de las bases", cierra:true}
         ]}
      ]}
    ]
  },
  /* ---------- CONCÓN NATIONAL · "Aurinegros" ----------
     Fuente: https://es.wikipedia.org/wiki/Concón_National (consultado 2026-11-15). Hechos verificados con fragmentos textuales (scripts/historia/CNA.json); redactado a mano (7.9149). */
  CNA:{
    fuente:"https://es.wikipedia.org/wiki/Concón_National", consultado:"2026-11-15",
    apodos:["Aurinegros"],
    hitos:[
      {anio:1914,hito:"Fundación",txt:"8 de mayo. Nace el club, con los colores amarillo y negro y franjas verticales: los Aurinegros."},
      {anio:1946,hito:"Sección femenina",txt:"Se funda la sección femenina de fútbol del club."},
      {anio:1982,hito:"Primera vez a nivel nacional",txt:"Participa por primera vez en competición nacional, en la Tercera División de 1982."},
      {anio:2001,hito:"Campeón de Cuarta",txt:"Gana el Campeonato Nacional de Cuarta División: 5-2 a Cristo Salva el 2 de diciembre, en el Estadio Municipal de Puente Alto."},
      {anio:2005,hito:"Deportes Concón S.A.",txt:"Cambia su nombre a Deportes Concón S.A.; el proyecto fracasa y pierde todos los derechos para mantenerse en Tercera División."},
      {anio:2007,hito:"Recupera el club",txt:"A mediados de mayo recupera su razón social original y retoma sus proyectos deportivos."},
      {anio:2022,hito:"Sube a Tercera A",txt:"Logra el ascenso a la Tercera División A por la vía de la Liguilla Final."},
      {anio:2023,hito:"Subcampeón y profesional",txt:"Subcampeón de Tercera A: derrota 2-0 como local a Deportes Colina y asciende a la Segunda División Profesional."},
      {anio:2024,hito:"Primera Segunda",txt:"Juega su primera temporada profesional, en la Segunda División."}
    ],
    arcos:[
      {id:"cna_h_siglo",t:"Más de cien años",desc:"Un club de 1914 que perdió su nombre y lo recuperó.",capitulos:[
        {id:"cna_h_siglo_1",t:"Amarillo y negro",ctx:"El club se fundó el 8 de mayo de 1914 con los colores amarillo y negro y franjas verticales. Hoy un auspiciador te pide cambiar la camiseta a una versión toda negra con su marca grande, «más moderna».",
         ops:[
          {t:"Aceptar la camiseta nueva", d:"Mejor trato, se pierde la franja.", ef:{plata:18,prestigio:-1}, grupos:{sponsors:7,directorio:3,socios:-6,hinchada:-5}, mem:"aceptaste una camiseta toda negra con una marca grande", va:"cna_h_siglo_2"},
          {t:"Mantener las franjas", d:"Menos plata, pero la franja sigue.", ef:{plata:-5,prestigio:2}, grupos:{socios:7,hinchada:6,sponsors:-5,directorio:-2}, mem:"mantuviste las franjas amarillas y negras", va:"cna_h_siglo_2"},
          {t:"Una tercera camiseta moderna", d:"La moderna sale, la franja se queda.", ef:{plata:8}, grupos:{sponsors:4,hinchada:1,socios:-1,directorio:2}, mem:"sacaste una tercera camiseta para el auspiciador", va:"cna_h_siglo_2"}
         ]},
        {id:"cna_h_siglo_2",t:"La sociedad anónima",ctx:"En 2005 el club cambió su nombre por Deportes Concón S.A. y el proyecto fracasó: perdió los derechos para mantenerse en Tercera. En 2007 recuperó su razón social. Hoy un grupo te ofrece volver a una sociedad anónima con plata nueva.",
         ops:[
          {t:"Aceptar la sociedad", d:"Plata nueva, control compartido.", ef:{plata:35,prestigio:-1,capital:-2}, grupos:{directorio:5,sponsors:5,socios:-8,hinchada:-3}, mem:"aceptaste una sociedad anónima con plata nueva", va:"cna_h_siglo_3"},
          {t:"Aceptarla con un tope", d:"Una parte de las acciones y el voto de los socios.", ef:{plata:15,capital:-1}, grupos:{directorio:2,socios:3,sponsors:2,hinchada:-1}, mem:"aceptaste la sociedad con un tope y voto de los socios", va:"cna_h_siglo_3"},
          {t:"Rechazarla", d:"Sin plata nueva, sin ataduras.", ef:{plata:-8,prestigio:2}, grupos:{socios:8,hinchada:5,directorio:-5,sponsors:-4}, mem:"rechazaste volver a una sociedad anónima", va:"cna_h_siglo_3"}
         ]},
        {id:"cna_h_siglo_3",t:"Desde 1946",ctx:"El club fundó su sección femenina en 1946. Hoy el fútbol femenino te pide una cancha de entrenamiento propia y una técnica a tiempo completo; el presupuesto es el de un club chico.",
         ops:[
          {t:"Pagar la técnica y la cancha", d:"El presupuesto se resiente; el club gana.", ef:{plata:-25,prestigio:3}, grupos:{comunidad:8,socios:4,directorio:-5,hinchada:2}, mem:"le diste cancha y técnica a la sección femenina", cierra:true},
          {t:"Compartir cancha con el municipio", d:"Se hace con lo que hay.", ef:{plata:-8,prestigio:1}, grupos:{comunidad:5,directorio:2,socios:1}, mem:"le diste a la sección femenina una cancha compartida", cierra:true},
          {t:"Dejarla como está", d:"Sin plata, sin conflicto, con la deuda de 1946.", ef:{plata:3,prestigio:-2}, grupos:{directorio:3,comunidad:-6,socios:-4,prensa:-2}, mem:"dejaste a la sección femenina sin cambios", cierra:true}
         ]}
      ]},
      {id:"cna_h_ascenso",t:"El ascenso del puerto",desc:"Del barro de Puente Alto a la Segunda profesional.",capitulos:[
        {id:"cna_h_ascenso_1",t:"Final en cancha ajena",ctx:"El 2 de diciembre de 2001 el club ganó 5-2 la final de la Cuarta División en el Estadio Municipal de Puente Alto, lejos de casa. Hoy llegas a una definición fuera de Concón y la barra pide organizar un viaje en bus.",
         ops:[
          {t:"Organizar el viaje", d:"Pagas la mitad; llena el bus.", ef:{plata:-12,moral:2}, grupos:{hinchada:8,comunidad:4,directorio:-3}, mem:"pusiste buses para que la gente fuera a la definición", va:"cna_h_ascenso_2"},
          {t:"Que viajen por su cuenta", d:"Más barato, menos gente.", ef:{plata:2}, grupos:{hinchada:-5,directorio:2,comunidad:-2}, mem:"dejaste que la gente viajara por su cuenta", va:"cna_h_ascenso_2"},
          {t:"Transmitirlo en la plaza", d:"Se ve en una pantalla en Concón.", ef:{plata:-6,prestigio:1}, grupos:{comunidad:6,hinchada:2,sponsors:3,directorio:-1}, mem:"pusiste una pantalla en la plaza para ver la definición", va:"cna_h_ascenso_2"}
         ]},
        {id:"cna_h_ascenso_2",t:"La Liguilla Final",ctx:"En 2022 el club logró, por la vía de la Liguilla Final, el ascenso a la Tercera A; en 2023 fue subcampeón y subió a la Segunda. Hoy la liguilla te exige rotar a un plantel corto en tres partidos seguidos.",
         ops:[
          {t:"Rotar con cuidado", d:"Reparte minutos y reparte riesgos.", ef:{moral:2}, grupos:{camarin:5,tecnico:2,hinchada:-2,prensa:-1}, mem:"rotaste el plantel cuidando a los más cargados", va:"cna_h_ascenso_3"},
          {t:"Jugar con los titulares", d:"Todo por el ascenso, con el cuerpo al límite.", ef:{moral:-2,prestigio:1}, grupos:{hinchada:6,tecnico:-3,camarin:-5,prensa:2}, mem:"jugaste con los titulares tres partidos seguidos", va:"cna_h_ascenso_3"},
          {t:"Fichar dos refuerzos de emergencia", d:"Sin tiempo ni plata.", ef:{plata:-22,moral:1}, grupos:{camarin:-3,tecnico:3,directorio:-5,hinchada:3}, mem:"fichaste dos refuerzos de emergencia para la liguilla", va:"cna_h_ascenso_3"}
         ]},
        {id:"cna_h_ascenso_3",t:"La primera temporada",ctx:"En 2024 el club jugó su primera temporada profesional en la Segunda División. Hoy el Estadio Atlético Municipal, con unas 3.000 plazas, tiene que cumplir lo que piden las bases y las obras cuestan más de lo presupuestado.",
         ops:[
          {t:"Terminar las obras ahora", d:"Cumples ahora y pagas con otras cuentas.", ef:{plata:-30,prestigio:2,capital:1}, grupos:{anfp:5,hinchada:4,directorio:-5,comunidad:3}, mem:"terminaste las obras del estadio para cumplir las bases", cierra:true},
          {t:"Pedir apoyo al municipio", d:"Plata pública, favor político.", ef:{plata:15,capital:-2}, grupos:{comunidad:5,directorio:2,anfp:-2,prensa:-1}, mem:"le pediste apoyo al municipio para las obras", cierra:true},
          {t:"Jugar en otra cancha unas fechas", d:"Ganas tiempo, la gente viaja.", ef:{plata:-8,moral:-2}, grupos:{anfp:2,hinchada:-7,comunidad:-3,directorio:2}, mem:"jugaste unas fechas en otra cancha mientras terminabas las obras", cierra:true}
         ]}
      ]}
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
