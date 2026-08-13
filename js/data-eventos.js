"use strict";
/* ============================================================
   FUTBOLINI 3.0 · data-eventos.js
   El mundo vivo: cosas que pasan solas entre fecha y fecha.
   peso(E) devuelve cuánta probabilidad tiene ese evento según
   el estado del club. Si devuelve 0, no puede ocurrir.
   Los que traen "op" se transforman en una decisión rápida.
   ============================================================ */

const EVENTOS=[
/* ---- deportivos ---- */
{id:"ev_lesion",tipo:"malo",peso:E=>3+(E.mods.some(m=>m.ef&&m.ef.desgaste)?3:0),
 t:"Lesión en el entrenamiento",d:"{JUGADOR} se resintió y estará fuera unas semanas.",accion:"lesionAlAzar"},
{id:"ev_racha",tipo:"bueno",peso:E=>E.ind.moral>65?2.5:0.6,
 t:"El equipo está fino",d:"El grupo entrena a un ritmo que hace rato no se veía.",ef:{plantel:2,moral:3}},
{id:"ev_juvenil",tipo:"bueno",peso:E=>E.ind.cantera>60?2.2:0.5,
 t:"Aparece un juvenil",d:"En las inferiores hay un cabro que ya no tiene nada que aprender ahí.",accion:"subirJuvenil"},
{id:"ev_pelea",tipo:"malo",peso:E=>E.ind.moral<50?2.6:0.5,
 t:"Pelea en el camarín",d:"Dos jugadores llegaron a las manos después del entrenamiento. Alguien filtró la historia.",
 ef:{moral:-8,riesgo:6},grupos:{prensa:-6}},
/* ---- institucionales ---- */
{id:"ev_dirigente",tipo:"neutro",peso:E=>1.4,
 t:"Renuncia un dirigente",d:"Un director del club renuncia por razones personales y deja una vacante incómoda.",
 grupos:{directorio:-6},ef:{capital:-4}},
{id:"ev_asamblea",tipo:"neutro",peso:E=>E.grupos.socios.aprob<-20?2.4:0.4,
 t:"Los socios piden asamblea extraordinaria",d:"Un grupo de socios juntó firmas para exigir explicaciones públicas.",
 ef:{capital:-8},grupos:{socios:-4,prensa:5}},
{id:"ev_anfp",tipo:"malo",peso:E=>E.grupos.anfp.aprob<-25?2.2:0.3,
 t:"Calendario en contra",d:"La programación te dejó tres partidos de visita seguidos y un viaje al norte a mitad de semana.",
 ef:{plantel:-2,moral:-3}},
{id:"ev_multa",tipo:"malo",peso:E=>E.ind.riesgo>45?2.4:0.4,
 t:"Multa del Tribunal de Disciplina",d:"Sanción económica por incidentes en el último partido de local.",
 ef:{plata:-90,riesgo:-4}},
/* ---- económicos ---- */
{id:"ev_sponsor",tipo:"bueno",peso:E=>E.ind.prestigio>60?2:0.8,
 t:"Una marca quiere entrar",d:"Aparece una empresa interesada en poner su nombre en la camiseta alterna.",
 ef:{plata:140},grupos:{sponsors:8}},
{id:"ev_proveedor",tipo:"malo",peso:E=>E.deuda>1500?2.6:0.4,
 t:"Un proveedor corta el crédito",d:"La empresa que abastece al club dejó de despachar hasta que se pague lo atrasado.",
 ef:{plata:-120,riesgo:6},grupos:{directorio:-8}},
{id:"ev_taquilla",tipo:"bueno",peso:E=>E.ind.hinchada>70?2:0.6,
 t:"Récord de público",d:"El último partido de local llenó el estadio y la recaudación superó todo lo previsto.",
 ef:{plata:120,hinchada:3}},
{id:"ev_gira",tipo:"neutro",peso:E=>E.ind.prestigio>65?1.8:0.4,
 t:"Invitación a una gira",d:"Ofrecen partidos amistosos pagados en el extranjero, justo en medio del calendario.",
 op:[
  {t:"Aceptar la gira",dif:34,bien:{txt:"Buena caja y vitrina internacional.",ef:{plata:220,prestigio:3,plantel:-2}},
   mitad:{txt:"Se cobró, pero el plantel volvió fundido.",ef:{plata:160,plantel:-4,moral:-3}},
   mal:{txt:"Viajes eternos, un lesionado y un camarín furioso.",ef:{plata:140,plantel:-6,moral:-8}}},
  {t:"Rechazarla",dif:12,bien:{txt:"El plantel agradece la semana de trabajo tranquilo.",ef:{moral:4,plantel:2}},
   mitad:{txt:"Se dejó pasar plata fácil.",ef:{}},mal:{txt:"El directorio no perdonó dejar ese dinero sobre la mesa.",ef:{},grupos:{directorio:-10}}}
 ]},
/* ---- hinchada y calle ---- */
{id:"ev_lienzo",tipo:"malo",peso:E=>E.grupos.hinchada.aprob<-25?2.8:0.3,
 t:"Lienzos en contra",d:"Aparecieron lienzos con tu nombre en la entrada del complejo deportivo.",
 ef:{moral:-4},rep:{publica:-5}},
{id:"ev_fiesta",tipo:"bueno",peso:E=>E.grupos.hinchada.aprob>35?2:0.4,
 t:"Fiesta en la tribuna",d:"La hinchada armó un recibimiento que dio la vuelta a los noticieros.",
 ef:{hinchada:5,moral:4},grupos:{prensa:5}},
{id:"ev_incidentes",tipo:"malo",peso:E=>E.ind.riesgo>50?2.6:0.4,
 t:"Incidentes en el estadio",d:"Hubo desmanes en el último partido y la ANFP abrió un sumario.",
 ef:{riesgo:8,plata:-70},grupos:{anfp:-10,prensa:-8}},
/* ---- prensa y país ---- */
{id:"ev_portada",tipo:"neutro",peso:E=>2,
 t:"Portada para {IDOLO}",d:"Una revista le dedicó la portada al ídolo del plantel. En el camarín hay quienes sonríen y quienes no.",
 ef:{prestigio:2,moral:-1}},
{id:"ev_rumor",tipo:"neutro",peso:E=>1.8,
 t:"Rumor de cambio de técnico",d:"Una radio aseguró que el club ya busca reemplazante. Nadie sabe de dónde salió.",
 grupos:{tecnico:-8},ef:{moral:-3}},
{id:"ev_elogio",tipo:"bueno",peso:E=>E.rep.prensa>60?2:0.6,
 t:"Buena prensa",d:"Una columna te trata de la administración más seria del fútbol chileno.",
 rep:{publica:5,credibilidad:4},ef:{capital:5}},
{id:"ev_pais",tipo:"neutro",peso:E=>1.2,
 t:"El país se mete en la cancha",d:"La contingencia nacional se comió toda la agenda y el fútbol pasó a segundo plano esta semana.",
 ef:{plata:-40,hinchada:-2}},
{id:"ev_clima",tipo:"neutro",peso:E=>1,
 t:"Temporal",d:"Un frente de mal tiempo dejó la cancha impracticable y obligó a reprogramar.",
 ef:{plata:-50}},
/* ---- oportunidades ---- */
{id:"ev_libre",tipo:"bueno",peso:E=>1.6,
 t:"Un jugador queda libre",d:"Un futbolista con recorrido quedó sin club por un conflicto de contrato y está disponible.",
 op:[
  {t:"Contratarlo",dif:30,req:{plata:80},ef:{plata:-80},
   bien:{txt:"Llegó con hambre y se ganó un lugar de inmediato.",ef:{plantel:5},accion:"ficharLibre"},
   mitad:{txt:"Aporta desde el banco, sin más.",ef:{plantel:2},accion:"ficharLibre"},
   mal:{txt:"Llegó pasado de peso y peleado con medio mundo.",ef:{plantel:1,moral:-5},accion:"ficharLibre"}},
  {t:"Dejarlo pasar",dif:8,bien:{txt:"Se fue a otro club y no pasó nada.",ef:{}},
   mitad:{txt:"Terminó jugando en un rival directo.",ef:{}},mal:{txt:"Terminó siendo figura en un rival directo.",ef:{},grupos:{prensa:-5}}}
 ]},
{id:"ev_agente",tipo:"neutro",peso:E=>E.ind.riesgo>30?1.8:0.8,
 t:"Un agente ofrece un negocio",d:"Un representante propone triangular un pase con un club chico y repartir la diferencia.",
 op:[
  {t:"Rechazar y avisar",dif:22,rep:{credibilidad:8},grupos:{prensa:8},
   bien:{txt:"Se cortó de raíz y quedó registro.",ef:{riesgo:-8}},
   mitad:{txt:"Se cortó, pero el tipo sigue dando vueltas.",ef:{}},
   mal:{txt:"El agente se fue a hablar mal de ti a todos lados.",ef:{},grupos:{directorio:-8}}},
  {t:"Aceptar",dif:56,ef:{plata:180,riesgo:18},rep:{credibilidad:-10},
   bien:{txt:"Entró plata que nadie va a poder explicar en el balance.",ef:{}},
   mitad:{txt:"Entró menos de lo prometido y quedó un cabo suelto.",ef:{plata:-60,riesgo:8}},
   mal:{txt:"El triangulado quedó documentado en un fax que alguien guardó.",ef:{riesgo:20},grupos:{prensa:-12}}}
 ]},
{id:"ev_juicio",tipo:"malo",peso:E=>E.ind.riesgo>60?2.5:0.2,
 t:"Citación judicial",d:"Un ex funcionario del club declaró ante la fiscalía sobre pagos irregulares.",
 ef:{riesgo:10,plata:-140},rep:{publica:-10},grupos:{directorio:-12,prensa:-10}},
{id:"ev_donacion",tipo:"bueno",peso:E=>E.grupos.comunidad.aprob>30?2:0.3,
 t:"Aporte de la comunidad",d:"La comunidad que sostiene al club organizó una colecta y entregó los fondos a la tesorería.",
 ef:{plata:160},grupos:{comunidad:6}},
{id:"ev_museo",tipo:"bueno",peso:E=>E.ind.prestigio>70?1.4:0.3,
 t:"El club como patrimonio",d:"Una universidad propone armar el archivo histórico del club con acceso público.",
 ef:{prestigio:4},rep:{publica:4},grupos:{socios:8,comunidad:8}},
/* ---- eventos que leen banderas dejadas por decisiones anteriores (efecto mariposa) ---- */
{id:"ev_pintas",tipo:"malo",peso:E=>E.flags.barraDolida?3.2:0,
 t:"Pintas contra la dirigencia",d:"Aparecieron rayados con tu nombre en los muros del estadio. Es la respuesta de la barra a la mano dura de hace unas semanas.",
 ef:{hinchada:-6,moral:-3},rep:{publica:-4},accion:"limpiaBandera:barraDolida"},
{id:"ev_barra_aliento",tipo:"bueno",peso:E=>E.flags.barraAliada?2.8:0,
 t:"La barra copa el estadio",d:"Después del acuerdo, la barra armó un recibimiento que empujó al plantel los noventa minutos.",
 ef:{hinchada:5,moral:4},grupos:{hinchada:6},accion:"limpiaBandera:barraAliada"},
{id:"ev_dt_firme",tipo:"bueno",peso:E=>E.flags.dtFirme?2.4:0,
 t:"Plantel motivado por un DT firme",d:"La postura dura del cuerpo técnico prendió al camarín: se entrena distinto desde que quedó claro quién manda.",
 ef:{moral:6,plantel:2},accion:"limpiaBandera:dtFirme"}
];

/* ---------- CRISIS: interrumpen y hay que resolverlas sí o sí ---------- */
const CRISIS=[
{id:"cr_paro",dispara:E=>E.grupos.camarin.aprob<-55,
 t:"El plantel se declara en paro",
 d:"Los jugadores no entrenan hasta que se resuelvan los sueldos y el trato. El sindicato ya emitió un comunicado.",
 op:[
  {t:"Pagar todo ahora, cueste lo que cueste",dif:20,req:{plata:250},ef:{plata:-250},
   grupos:{camarin:35},bien:{txt:"Se levanta el paro y el grupo vuelve a entrenar.",ef:{moral:10}},
   mitad:{txt:"Vuelven, con la confianza rota.",ef:{moral:2}},mal:{txt:"Volvieron por obligación y no por ganas.",ef:{moral:-4}}},
  {t:"Negociar un calendario de pagos",dif:44,grupos:{camarin:10},
   bien:{txt:"Se acordó un calendario y el plantel lo aceptó.",ef:{moral:4,deuda:120}},
   mitad:{txt:"Aceptaron a medias y siguen las filtraciones.",ef:{moral:-4,deuda:120}},
   mal:{txt:"No hubo acuerdo: el paro sigue y se pierde una fecha por no presentarse.",ef:{moral:-14,riesgo:14},accion:"perderPuntos"}},
  {t:"Romper el paro con juveniles",dif:64,grupos:{camarin:-30,hinchada:-10},rep:{dureza:15,publica:-8},
   bien:{txt:"Los cabros jugaron y el club no perdió la fecha. El camarín no te lo perdona.",ef:{cantera:6,moral:-10}},
   mitad:{txt:"Se jugó con juveniles y se perdió feo.",ef:{plantel:-4,moral:-12}},
   mal:{txt:"Papelón deportivo y quiebre total con el plantel profesional.",ef:{plantel:-8,moral:-18},grupos:{camarin:-20}}}
 ]},
{id:"cr_embargo",dispara:E=>E.deuda>3200,
 t:"Embargo de la recaudación",
 d:"Un acreedor consiguió una orden para retener los ingresos de taquilla hasta cubrir la deuda.",
 op:[
  {t:"Vender activos y pagar",dif:26,grupos:{directorio:10,hinchada:-15},
   bien:{txt:"Se levantó el embargo con una venta dolorosa pero efectiva.",ef:{deuda:-900,plantel:-6},accion:"venderTitular"},
   mitad:{txt:"Se levantó parcialmente.",ef:{deuda:-500,plantel:-6},accion:"venderTitular"},
   mal:{txt:"Se vendió mal y el embargo sigue en parte.",ef:{deuda:-300,plantel:-8},accion:"venderTitular"}},
  {t:"Convenio judicial",dif:48,
   bien:{txt:"Se firma un convenio y el club respira.",ef:{deuda:-200,plata:-100}},
   mitad:{txt:"Convenio caro y con garantías.",ef:{deuda:100,plata:-150}},
   mal:{txt:"Rechazado. El embargo se amplía a los ingresos de televisión.",ef:{plata:-300,riesgo:14}}},
  {t:"Pelearlo en tribunales",dif:62,rep:{dureza:8},
   bien:{txt:"Se ganó tiempo con un recurso.",ef:{riesgo:6}},
   mitad:{txt:"Se perdió en primera instancia.",ef:{plata:-200}},
   mal:{txt:"Se perdió con costas y el club quedó peor que antes.",ef:{plata:-320,riesgo:16},grupos:{directorio:-15}}}
 ]},
{id:"cr_escandalo",dispara:E=>E.ind.riesgo>80,
 t:"Estalla el escándalo",
 d:"Todo lo que se venía acumulando salió publicado el mismo día: contratos, comisiones y nombres.",
 op:[
  {t:"Dar la cara y renunciar a los cargos comprometidos",dif:30,rep:{credibilidad:12,publica:6},
   grupos:{prensa:15,socios:10,directorio:-20},
   bien:{txt:"Se corta el hilo por lo más delgado y el club sobrevive.",ef:{riesgo:-45,prestigio:-6}},
   mitad:{txt:"Alcanzó para frenar la sangría, no para limpiar la imagen.",ef:{riesgo:-30,prestigio:-10}},
   mal:{txt:"La renuncia se leyó como confesión y siguieron saliendo cosas.",ef:{riesgo:-15,prestigio:-16},rep:{publica:-10}}},
  {t:"Negar todo",dif:58,rep:{credibilidad:-12},grupos:{prensa:-20},
   bien:{txt:"Nadie pudo probar nada y el tema se enfrió.",ef:{riesgo:-20}},
   mitad:{txt:"Se enfrió a medias y quedó la mancha.",ef:{riesgo:-8,prestigio:-8},rep:{publica:-8}},
   mal:{txt:"Salieron documentos y quedaste como mentiroso en cadena nacional.",
     ef:{riesgo:-5,prestigio:-18},rep:{publica:-20,credibilidad:-15}}},
  {t:"Comprar silencios",dif:70,req:{plata:400},ef:{plata:-400},rep:{credibilidad:-8},
   bien:{txt:"Se apagó el incendio con plata. Por ahora.",ef:{riesgo:-25}},
   mitad:{txt:"Se apagó una parte y la otra sigue quemando.",ef:{riesgo:-10}},
   mal:{txt:"Alguien grabó la conversación en la que se ofrecía la plata.",
     ef:{riesgo:15},rep:{publica:-25,credibilidad:-20},grupos:{prensa:-25}}}
 ]},
{id:"cr_cisma",dispara:E=>E.grupos.comunidad.aprob<-70&&E.grupos.socios.aprob<-45,
 t:"Ruptura institucional",
 d:"Un grupo grande de socios anunció que si el club sigue por este camino, se van a fundar otro club con el nombre y los colores originales.",
 op:[
  {t:"Dar marcha atrás y reunificar",dif:34,req:{capital:25},ef:{capital:-25},
   grupos:{socios:35,comunidad:40,hinchada:20},rep:{credibilidad:-6},
   bien:{txt:"Se frenó la ruptura con una reforma de estatutos y una asamblea abierta.",ef:{prestigio:-4}},
   mitad:{txt:"Se frenó a medias: se fueron algunos, pero el club no se partió.",ef:{socios:-8}},
   mal:{txt:"Fue tarde. La ruptura siguió su curso.",accion:"cisma"}},
  {t:"Seguir adelante, cueste lo que cueste",dif:70,rep:{dureza:20,publica:-25},
   grupos:{socios:-30,comunidad:-40},
   bien:{txt:"El club siguió su camino con un costo humano enorme.",ef:{socios:-20,hinchada:-20},accion:"cisma"},
   mitad:{txt:"El quiebre fue total.",ef:{socios:-25,hinchada:-25},accion:"cisma"},
   mal:{txt:"El quiebre fue total y te transformaste en enemigo público del fútbol chileno.",
     ef:{socios:-30,hinchada:-30},rep:{publica:-30},accion:"cisma"}}
 ]}
];

/* Nombres de clubes que aparecen como compradores en el mercado */
const CLUBES_COMPRADORES=[
 "Boca Juniors","River Plate","São Paulo","Cruzeiro","América de Cali","Nacional de Montevideo",
 "Peñarol","Independiente","Vélez Sarsfield","Standard de Lieja","Real Valladolid","Toulouse",
 "Racing Club","Universidad Católica","Cobreloa","Unión Española","Puebla","Necaxa"
];

/* ============================================================
   ENCADENADAS: decisiones que NO aparecen solas. Las dispara la
   cola de encadenados (campo `encadena` de otra decisión) o el
   contexto (mala racha, oferta de medianoche). Misma estructura
   que las decisiones normales: el motor las resuelve igual.
   ============================================================ */
const ENCADENADAS=[
{id:"enc_racha",buzon:"prensa",peso:"alto",tipo:"malo",
 t:"La racha ya es tema de portada",
 d:"Cuatro partidos sin ganar y la prensa dejó de preguntar por el equipo para preguntar por vos. En la radio ya pusieron la fecha de tu salida. El directorio mira de reojo.",
 posturas:{prensa:-20,directorio:-25,hinchada:-15},
 consejo:{deportivo:"Necesito respaldo público o el camarín va a jugar cagado de miedo.",
   tesorero:"Un cambio de técnico ahora nos cuesta plata que no tenemos.",
   prensa:"Si salís a pelearte con todos, mañana sos el enemigo. Si no decís nada, sos el que no da la cara."},
 op:[
  {t:"Dar la cara y bancar al plantel en público",dif:40,
   grupos:{camarin:12,prensa:5,directorio:-4},rep:{credibilidad:6},
   bien:{txt:"El mensaje ordenó el camarín: salieron a jugarse el puesto por vos.",ef:{moral:10}},
   mitad:{txt:"Calmó las aguas un par de días, nada más.",ef:{moral:3}},
   mal:{txt:"Sonó a excusa y la prensa lo hizo pedazos.",ef:{moral:-4},grupos:{prensa:-10}}},
  {t:"Prometer un golpe de timón y cambios",dif:52,
   grupos:{directorio:10,camarin:-10},
   bien:{txt:"El directorio compró la promesa y te dio un respiro. Ahora hay que cumplirla.",ef:{},grupos:{directorio:8}},
   mitad:{txt:"Te dieron una fecha más, con el reloj corriendo.",ef:{moral:-3}},
   mal:{txt:"Prometiste y ni tu propio camarín te creyó.",ef:{moral:-8},grupos:{directorio:-12,camarin:-10}}},
  {t:"Encerrarte a trabajar y no hablar con nadie",dif:34,rep:{dureza:6,prensa:-8},
   bien:{txt:"El silencio se leyó como temple y el equipo cortó la racha de puro amor propio.",ef:{moral:5,plantel:2}},
   mitad:{txt:"Ni bien ni mal: el ruido siguió afuera, el equipo adentro.",ef:{}},
   mal:{txt:"El vacío lo llenó la prensa con la versión que quiso.",ef:{moral:-6},grupos:{prensa:-14,directorio:-10}}}
 ]},

{id:"enc_medianoche",buzon:"gris",peso:"alto",tipo:"neutro",
 t:"Oferta de medianoche",
 d:"La noche antes del partido más grande del año suena el teléfono del hotel. Del otro lado, una voz conocida en los pasillos ofrece «un arreglo para que no haya sorpresas mañana». No da nombres. Deja un número y una hora.",
 historia:"Situación dramatizada del juego; no reconstruye ningún hecho documentado.",
 posturas:{prensa:-30,anfp:-25,directorio:-10},
 consejo:{deportivo:"Yo mañana pongo el equipo. Lo demás no lo quiero ni escuchar.",
   tesorero:"Sea lo que sea, no pasa por caja y no lo firma nadie.",
   prensa:"Si se sabe que atendiste esa llamada, el título vale cero."},
 op:[
  {t:"Cortar y denunciarlo apenas amanezca",dif:36,
   grupos:{anfp:12,prensa:15,directorio:-6},rep:{publica:10,credibilidad:12},
   bien:{txt:"Quedó registro de que llamaste a la puerta correcta. Se juega limpio y con la conciencia liviana.",ef:{riesgo:-10,moral:4}},
   mitad:{txt:"Denunciaste, nadie investigó, pero tu palabra quedó parada.",ef:{riesgo:-4}},
   mal:{txt:"Te trataron de alarmista y encima el rival se hizo la víctima.",ef:{},grupos:{anfp:-8}}},
  {t:"Colgar y no decir nada",dif:26,
   bien:{txt:"No hubo trato ni escándalo. Vos y tu almohada saben que colgaste.",ef:{riesgo:2}},
   mitad:{txt:"Colgaste, pero la duda te acompañó hasta el pitazo inicial.",ef:{moral:-2}},
   mal:{txt:"El silencio dejó la puerta entornada: volvieron a llamar.",ef:{riesgo:8}}},
  {t:"Escuchar qué ofrecen",dif:64,rep:{publica:-12,credibilidad:-12},
   bien:{txt:"Aparecieron «facilidades» al día siguiente. Nadie dijo nada. Todavía.",
     ef:{riesgo:30,arbitraje:4},mods:[{id:"pacto_sucio",n:"Compromiso impagable",anios:8,ef:{arbitraje:5,crisis:0.35}}],
     encadena:{id:"enc_factura",en:3}},
   mitad:{txt:"Escuchaste de más y ahora ese tipo tiene con qué apretarte.",ef:{riesgo:36},encadena:{id:"enc_factura",en:2}},
   mal:{txt:"Alguien grabó la conversación del hotel.",ef:{riesgo:44},grupos:{prensa:-20,anfp:-18},rep:{publica:-18},encadena:{id:"enc_factura",en:2}}}
 ]},

{id:"enc_factura",buzon:"gris",peso:"alto",tipo:"malo",
 t:"Llegó la factura",
 d:"El favor de aquella vez volvió con intereses. El mismo intermediario reaparece: ahora pide que le devuelvas la mano, y deja claro que si no, hay material que puede terminar en un fiscal.",
 posturas:{prensa:-30,anfp:-25,directorio:-15},
 consejo:{deportivo:"Yo esto no lo escuché.",tesorero:"Lo que pida, no sale de mis libros.",
   prensa:"Cualquier cosa que hagas ahora, la estás haciendo con una grabación colgando encima."},
 op:[
  {t:"Cortar por lo sano y blanquearlo vos primero",dif:48,
   grupos:{prensa:18,socios:8,directorio:-15},rep:{credibilidad:14,publica:8},
   bien:{txt:"Te adelantaste al escándalo y lo contaste con tus palabras. Duele, pero controlaste el incendio.",ef:{riesgo:-25,prestigio:-4}},
   mitad:{txt:"Blanqueaste una parte y la otra igual salió por otro lado.",ef:{riesgo:-10,prestigio:-8}},
   mal:{txt:"Tu versión llegó tarde: ya la habían contado por vos.",ef:{riesgo:-4,prestigio:-12},rep:{publica:-10}}},
  {t:"Pagar el favor y que se termine",dif:60,req:{plata:250},ef:{plata:-250},rep:{credibilidad:-10},
   bien:{txt:"Se saldó la deuda. El tipo desapareció. Por ahora.",ef:{riesgo:-6}},
   mitad:{txt:"Pagaste y aún así quedó un cabo suelto dando vueltas.",ef:{riesgo:8}},
   mal:{txt:"Pagaste, y el pago mismo quedó documentado.",ef:{riesgo:20},grupos:{prensa:-18},rep:{publica:-15}}},
  {t:"Plantarte y que haga lo que quiera",dif:66,rep:{dureza:14},
   bien:{txt:"Le jugaste al farol y no tenía tanto como decía. Se fue con las manos vacías.",ef:{riesgo:-8}},
   mitad:{txt:"Filtró algo, no todo. Dos días feos y a seguir.",ef:{riesgo:6},grupos:{prensa:-10}},
   mal:{txt:"Tenía todo. Salió publicado y ahora hay una causa abierta.",ef:{riesgo:24,plata:-140},rep:{publica:-18},grupos:{directorio:-18,prensa:-15}}}
 ]}
];
