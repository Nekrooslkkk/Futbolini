"use strict";
/* ============================================================
   FUTBOLINI 3.0 · data-grupos.js
   Grupos de interés, estatutos del club y reputación personal.
   El poder de cada grupo cambia según el club: hay clubes donde
   los socios deciden y otros donde no los pesca nadie.
   ============================================================ */

const GRUPOS=[
 {id:"directorio", n:"Directorio",        ic:"🎩", quiere:"Estabilidad, caja sana y mantenerse en el cargo.",
  castigo:"Te bloquea estatutos, te fuerza a vender y puede destituirte."},
 {id:"socios",     n:"Socios",            ic:"🗳️", quiere:"Ser escuchados y que el club siga siendo de ellos.",
  castigo:"Vota en contra, exige asamblea y puede revocar al directorio."},
 {id:"hinchada",   n:"Hinchada",          ic:"📣", quiere:"Que se gane, entradas baratas y que no se venda a los ídolos.",
  castigo:"Funas, lienzos, incidentes y estadio vacío."},
 {id:"camarin",    n:"Camarín",           ic:"👕", quiere:"Sueldos al día, premios y respeto al grupo.",
  castigo:"Paro, filtraciones y rendimiento en el piso."},
 {id:"tecnico",    n:"Cuerpo técnico",    ic:"📋", quiere:"Autoridad, los refuerzos que pidió y continuidad.",
  castigo:"Renuncia pública y se lleva a su gente."},
 {id:"prensa",     n:"Prensa",            ic:"🎙️", quiere:"Acceso, declaraciones y material.",
  castigo:"Campaña en contra y presión permanente sobre el plantel."},
 {id:"anfp",       n:"ANFP",              ic:"🏛️", quiere:"Que votes con ellos y que no hagas ruido.",
  castigo:"Calendario malo, sanciones y aislamiento en las votaciones."},
 {id:"sponsors",   n:"Sponsors y TV",     ic:"💼", quiere:"Imagen limpia, audiencia y estabilidad.",
  castigo:"Se bajan del contrato o lo renegocian a la baja."},
 {id:"comunidad",  n:"Comunidad",         ic:"🏘️", quiere:"Que el club siga representando a los suyos.",
  castigo:"Corta el aporte, rompe con el club y empuja al cisma."}
];
const GRUPO_POR_ID={}; GRUPOS.forEach(g=>GRUPO_POR_ID[g.id]=g);

/* poder inicial por club: así de distinto es cada casa */
const PODER_CLUB={
  CC:{directorio:70,socios:30,hinchada:85,camarin:60,tecnico:65,prensa:70,anfp:60,sponsors:55,comunidad:35},
  UCH:{directorio:60,socios:45,hinchada:80,camarin:55,tecnico:55,prensa:65,anfp:40,sponsors:45,comunidad:50},
  UC:{directorio:75,socios:40,hinchada:45,camarin:50,tecnico:60,prensa:50,anfp:70,sponsors:60,comunidad:65},
  PAL:{directorio:55,socios:50,hinchada:35,camarin:50,tecnico:50,prensa:35,anfp:35,sponsors:35,comunidad:85},
  LIM:{directorio:50,socios:45,hinchada:40,camarin:45,tecnico:45,prensa:25,anfp:20,sponsors:25,comunidad:70}
};
const APROB_INICIAL={
  CC:{directorio:20,socios:5,hinchada:35,camarin:15,tecnico:25,prensa:10,anfp:0,sponsors:15,comunidad:5}
};

function etiquetaPostura(v){
  if(v>=35) return {c:"p2",t:"apoya fuerte"};
  if(v>=12) return {c:"p1",t:"apoya"};
  if(v>-12) return {c:"p0",t:"le da lo mismo"};
  if(v>-35) return {c:"m1",t:"se opone"};
  return {c:"m2",t:"se opone fuerte"};
}
function etiquetaAprobacion(v){
  if(v>=60) return "devoción";
  if(v>=30) return "a favor";
  if(v>=10) return "conforme";
  if(v>-10) return "indiferente";
  if(v>-30) return "molesto";
  if(v>-60) return "en contra";
  return "en pie de guerra";
}

/* ---------- ESTATUTOS ---------- */
const ESTATUTOS=[
 {id:"propiedad", n:"Propiedad", ic:"📜",
  op:[
   {id:"club_social",n:"Club social y deportivo",d:"Los socios son dueños. Lento, pero tuyo.",
    ef:{socios:8,sponsors:-5},mod:{ingresoSponsor:-0.05,poderSocios:15}},
   {id:"corporacion",n:"Corporación",d:"Estructura mixta con directorio profesional.",
    ef:{directorio:6},mod:{ingresoSponsor:0.05}},
   {id:"sa_deportiva",n:"Sociedad anónima deportiva",d:"Entra capital externo. Te exigen rentabilidad todos los años.",
    ef:{socios:-30,hinchada:-15,directorio:20,sponsors:20},mod:{ingresoSponsor:0.28,capitalAnual:-5,poderSocios:-25}},
   {id:"cooperativa",n:"Cooperativa de hinchas",d:"La hinchada pone y la hinchada manda. Cero fondos externos.",
    ef:{socios:30,hinchada:25,sponsors:-20,directorio:-15},mod:{ingresoSponsor:-0.2,ingresoSocios:0.35}}
  ]},
 {id:"modelo", n:"Modelo deportivo", ic:"⚽",
  op:[
   {id:"cantera",n:"Fábrica de canteranos",d:"Se forma y se vende. Barato y lento.",ef:{camarin:-5,comunidad:10},mod:{cantera:0.3,gastoPlanilla:-0.15}},
   {id:"vendedor",n:"Vendedor",d:"Un jugador grande por año se va sí o sí.",ef:{hinchada:-12,directorio:12},mod:{ventas:0.3}},
   {id:"comprador",n:"Comprador",d:"Se refuerza con plata. Caro y exigente.",ef:{hinchada:12,camarin:8,directorio:-10},mod:{gastoPlanilla:0.25,nivelFichajes:0.2}},
   {id:"mixto",n:"Mixto",d:"Ni tanto ni tan poco.",ef:{},mod:{}}
  ]},
 {id:"identidad", n:"Identidad institucional", ic:"🛡️", pesado:true,
  op:[
   {id:"popular",n:"Popular nacional",d:"El club es del pueblo y de todo Chile.",ef:{hinchada:15,socios:8},mod:{ingresoTaquilla:0.12}},
   {id:"barrial",n:"Barrial",d:"El club es de su comuna y de su gente.",ef:{comunidad:20,hinchada:8},mod:{ingresoSocios:0.15,ingresoSponsor:-0.1}},
   {id:"colonia",n:"De colonia",d:"El club representa a una comunidad específica.",ef:{comunidad:25},mod:{ingresoSocios:0.2}},
   {id:"universitaria",n:"Universitaria",d:"El club es el brazo deportivo de una casa de estudios.",ef:{comunidad:18,socios:10},mod:{cantera:0.15}},
   {id:"corporativa",n:"Corporativa global",d:"El club es una marca. La identidad es un activo más.",
    ef:{comunidad:-45,hinchada:-30,socios:-25,sponsors:30},mod:{ingresoSponsor:0.4,ingresoTaquilla:-0.15}}
  ]},
 {id:"barra", n:"Relación con la barra", ic:"🚩",
  op:[
   {id:"prohibicion",n:"Prohibición",d:"Cero trato. Desalojo y denuncia.",ef:{hinchada:-25,prensa:12,anfp:10},mod:{riesgo:-0.25,ingresoTaquilla:-0.08}},
   {id:"tolerancia",n:"Tolerancia",d:"Se mira para el lado.",ef:{},mod:{}},
   {id:"alianza",n:"Alianza",d:"Se les da algo a cambio de orden.",ef:{hinchada:18,prensa:-8},mod:{riesgo:0.15,ingresoTaquilla:0.08}},
   {id:"cogobierno",n:"Cogobierno de tribuna",d:"Deciden con vos. Peligroso.",ef:{hinchada:32,prensa:-20,anfp:-15,directorio:-15},mod:{riesgo:0.4,ingresoTaquilla:0.15}}
  ]},
 {id:"finanzas", n:"Política financiera", ic:"💰",
  op:[
   {id:"austeridad",n:"Austeridad",d:"No se gasta lo que no hay.",ef:{directorio:12,camarin:-8,hinchada:-8},mod:{gastoPlanilla:-0.2,interes:-0.02}},
   {id:"apalancamiento",n:"Apalancamiento",d:"Se pide prestado para competir hoy.",ef:{hinchada:10,camarin:8,directorio:-10},mod:{gastoPlanilla:0.2,interes:0.03}},
   {id:"capital_externo",n:"Capital externo",d:"Entra plata de afuera con condiciones.",ef:{socios:-18,sponsors:15},mod:{ingresoSponsor:0.2}},
   {id:"socios_primero",n:"Autofinanciamiento por socios",d:"La caja la ponen los socios.",ef:{socios:20},mod:{ingresoSocios:0.3}}
  ]},
 {id:"anfp", n:"Puertas afuera", ic:"🤝",
  op:[
   {id:"neutral",n:"Neutral en la ANFP",d:"No te metes en nada.",ef:{},mod:{}},
   {id:"bloque_grandes",n:"Bloque de los grandes",d:"Los que llevan gente mandan.",ef:{anfp:15,prensa:-5},mod:{ingresoTV:0.15}},
   {id:"bloque_chicos",n:"Bloque con los provinciales",d:"Reparto parejo y muchos votos.",ef:{anfp:10,comunidad:10},mod:{ingresoTV:-0.05,capitalAnual:4}},
   {id:"ruptura",n:"Ruptura",d:"Negociás tu propia televisión.",ef:{anfp:-45,sponsors:20},mod:{ingresoTV:0.35,capitalAnual:-6}}
  ]}
];
const ESTATUTO_INICIAL={
  CC:{propiedad:"club_social",modelo:"mixto",identidad:"popular",barra:"tolerancia",finanzas:"apalancamiento",anfp:"bloque_grandes"},
  UCH:{propiedad:"corporacion",modelo:"cantera",identidad:"universitaria",barra:"tolerancia",finanzas:"austeridad",anfp:"neutral"},
  UC:{propiedad:"corporacion",modelo:"cantera",identidad:"universitaria",barra:"prohibicion",finanzas:"austeridad",anfp:"bloque_grandes"},
  PAL:{propiedad:"club_social",modelo:"vendedor",identidad:"colonia",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"},
  LIM:{propiedad:"corporacion",modelo:"cantera",identidad:"barrial",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"}
};
function estatutoOpcion(catId,opId){
  const c=ESTATUTOS.find(e=>e.id===catId); if(!c) return null;
  return c.op.find(o=>o.id===opId)||null;
}
/* ---------- REPUTACIÓN PERSONAL (tu carrera, no la del club) ---------- */
const REPUTACION=[
 {id:"publica",     n:"Imagen pública", ic:"🌐", d:"Cómo te ve la gente de fútbol en general. Si llega a cero, sos inempleable."},
 {id:"credibilidad",n:"Credibilidad",   ic:"📌", d:"Si tu palabra vale. Sube cumpliendo, baja prometiendo al voleo."},
 {id:"prensa",      n:"Trato con la prensa", ic:"🎤", d:"Cuánto te cubren las espaldas cuando se pone fea."},
 {id:"dureza",      n:"Mano dura",      ic:"✊", d:"Fama de imponerte. Sirve con el camarín, asusta a los socios."}
];

/* ---------- 5.0 · Bloque 4 — Interacción institucional directa ---------- */
const INTERACCIONES=[
 {g:"Barra brava",ic:"🚩",ops:[
   {t:"Darles entradas y viajes",d:"Un gesto que garantiza aliento… y ata al club a un grupo que no rinde cuentas.",plata:-60,grupos:{hinchada:10,prensa:-5},ef:{riesgo:6}},
   {t:"Mano dura con la barra",d:"Cero privilegios, desalojo si hace falta.",grupos:{hinchada:-12,prensa:8,anfp:6},ef:{riesgo:-8},rep:{dureza:6}}
 ]},
 {g:"Directorio",ic:"🎩",ops:[
   {t:"Rendir cuentas con transparencia",d:"Abrir los números y ordenar la casa.",capital:-6,grupos:{directorio:12,socios:6},rep:{credibilidad:5}},
   {t:"Prometer refuerzos de peso",d:"Ilusionar a la mesa con nombres grandes.",grupos:{directorio:8},flags:{prometioRefuerzos:true}}
 ]},
 {g:"Prensa",ic:"🎙️",ops:[
   {t:"Off the record con los periodistas",d:"Darles material y cercanía a cambio de buena onda.",grupos:{prensa:12},rep:{prensa:6,credibilidad:-3}},
   {t:"Cerrarles la puerta",d:"Ni una declaración. Que escriban lo que quieran.",grupos:{prensa:-15},rep:{dureza:6}}
 ]},
 {g:"Ex-jugadores",ic:"🎖️",ops:[
   {t:"Invitar a un ídolo a la práctica",d:"Un histórico que le habla al plantel. La mística no se compra… casi.",plata:-30,ef:{moral:6,hinchada:4},grupos:{hinchada:6,comunidad:4}}
 ]},
 {g:"Anónimos",ic:"🕵️",ops:[
   {t:"Escuchar a un informante anónimo",d:"Alguien que dice tener data del vestuario rival o de los pasillos de la ANFP.",soplo:true}
 ]}
];
