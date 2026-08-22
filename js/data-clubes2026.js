"use strict";
/* ============================================================
   FUTBOLINI · data-clubes2026.js
   Datos aportados por Grok (ago 2026) para hacer MANEJABLES los 11
   clubes que faltaban de Primera 2026: identidad, indicadores, caja,
   estatuto inicial, poder de grupos y rivalidades (clásicos).
   Los PLANTELES ya viven en data-grok.js (PLANTELES_REALES).
   Se carga DESPUÉS de motor.js y data-grupos.js y se enchufa por
   MUTACIÓN (Object.assign) — const solo impide reasignar, no mutar.
   Nombres reales de referencia; stats estimadas del juego.
   ============================================================ */
(function integrarClubes2026(){
  /* 1 · identidad para el briefing / selección */
  if(typeof CLUB_INFO_2026!=="undefined") Object.assign(CLUB_INFO_2026,{
    EVE:{n:"Everton de Viña del Mar",esc:"🟡",est:"Sausalito",dt:"Walter Ribonetto",desc:"Club de Viña, de Sausalito y de temporada larga. Cuando el verano se va, el estadio se vacía y el trabajo se pone serio."},
    COQ:{n:"Coquimbo Unido",esc:"🟡",est:"Francisco Sánchez Rumoroso",dt:"Hernán Caputto",desc:"Puerto, pecho y un título reciente que todavía pesa. El norte no perdona si se aflojan."},
    AUD:{n:"Audax Italiano",esc:"🟢",est:"Bicentenario de La Florida",dt:"el cuerpo técnico",desc:"La Florida, colonia italiana y tabla del medio. Club de barrio que a veces se ilusiona de más."},
    HUA:{n:"Huachipato",esc:"⚫",est:"Huachipato-CAP Acero",dt:"Jaime García",desc:"Acero de Talcahuano. Forma, vende y pelea con lo que tiene. El CAP no es adorno."},
    OHI:{n:"O'Higgins",esc:"🟢",est:"El Teniente",dt:"Lucas Bovaglio",desc:"Rancagua, cobre y ganas de no ser sucursal de Santiago. Cuando se ordena, incomoda."},
    NUB:{n:"Ñublense",esc:"🔴",est:"Nelson Oyarzún Arenas",dt:"Juan José Ribera",desc:"El rojo de Chillán. Frío, región y poca vitrina. Si se llena el Oyarzún, duele jugar ahí."},
    COB:{n:"Cobresal",esc:"🟠",est:"El Cobre",dt:"Gustavo Huerta",desc:"El Salvador, altura y viaje eterno. Localía brava; caja siempre justa."},
    CAL:{n:"Unión La Calera",esc:"🔴",est:"Nicolás Chahuán Nazar",dt:"Martín Cicotello",desc:"Pueblo chico, estadio chico. Saca puntos feos o se hunde sin hacer ruido."},
    LSE:{n:"Deportes La Serena",esc:"🔴",est:"La Portada",dt:"Felipe Gutiérrez",desc:"Postal de playa y yo-yo de categoría. La gente pide que deje de ser solo veraneo."},
    DCO:{n:"Deportes Concepción",esc:"🟣",est:"Ester Roa Rebolledo",dt:"Fernando Díaz",desc:"El León de Collao volvió a Primera. Historia, gente y el miedo a volver a caer."},
    UDC:{n:"Universidad de Concepción",esc:"🟡",est:"Ester Roa Rebolledo",dt:"el cuerpo técnico",desc:"El Campanil. Universidad, cantera y un regreso que todavía se está acomodando."}
  });
  /* 2 · indicadores base */
  if(typeof IND_BASE_2026!=="undefined") Object.assign(IND_BASE_2026,{
    EVE:{plantel:68,moral:62,hinchada:58,socios:55,cantera:52,estadio:72,prestigio:60,riesgo:42},
    COQ:{plantel:72,moral:65,hinchada:70,socios:58,cantera:48,estadio:68,prestigio:68,riesgo:38},
    AUD:{plantel:64,moral:55,hinchada:48,socios:50,cantera:55,estadio:55,prestigio:52,riesgo:48},
    HUA:{plantel:62,moral:58,hinchada:52,socios:48,cantera:70,estadio:58,prestigio:55,riesgo:45},
    OHI:{plantel:70,moral:58,hinchada:55,socios:52,cantera:62,estadio:62,prestigio:58,riesgo:44},
    NUB:{plantel:60,moral:62,hinchada:60,socios:50,cantera:50,estadio:58,prestigio:52,riesgo:46},
    COB:{plantel:55,moral:52,hinchada:45,socios:40,cantera:48,estadio:50,prestigio:45,riesgo:55},
    CAL:{plantel:52,moral:48,hinchada:42,socios:40,cantera:45,estadio:48,prestigio:42,riesgo:62},
    LSE:{plantel:58,moral:55,hinchada:50,socios:45,cantera:48,estadio:65,prestigio:48,riesgo:52},
    DCO:{plantel:58,moral:68,hinchada:72,socios:55,cantera:50,estadio:78,prestigio:55,riesgo:50},
    UDC:{plantel:56,moral:52,hinchada:48,socios:50,cantera:65,estadio:78,prestigio:50,riesgo:55}
  });
  /* 3 · caja inicial */
  if(typeof CAJA_BASE_2026!=="undefined") Object.assign(CAJA_BASE_2026,{
    EVE:{plata:420,deuda:180}, COQ:{plata:480,deuda:120}, AUD:{plata:350,deuda:150},
    HUA:{plata:300,deuda:160}, OHI:{plata:400,deuda:140}, NUB:{plata:280,deuda:100},
    COB:{plata:220,deuda:90},  CAL:{plata:180,deuda:140}, LSE:{plata:260,deuda:130},
    DCO:{plata:240,deuda:110}, UDC:{plata:250,deuda:100}
  });
  /* 4 · estatuto inicial (identidad institucional) */
  if(typeof ESTATUTO_INICIAL!=="undefined") Object.assign(ESTATUTO_INICIAL,{
    EVE:{propiedad:"corporacion",modelo:"mixto",identidad:"regional",barra:"tolerancia",finanzas:"apalancamiento",anfp:"neutral"},
    COQ:{propiedad:"corporacion",modelo:"mixto",identidad:"regional",barra:"tolerancia",finanzas:"apalancamiento",anfp:"bloque_chicos"},
    AUD:{propiedad:"club_social",modelo:"mixto",identidad:"colonia",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"},
    HUA:{propiedad:"corporacion",modelo:"cantera",identidad:"regional",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"},
    OHI:{propiedad:"corporacion",modelo:"mixto",identidad:"regional",barra:"tolerancia",finanzas:"apalancamiento",anfp:"neutral"},
    NUB:{propiedad:"club_social",modelo:"mixto",identidad:"regional",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"},
    COB:{propiedad:"corporacion",modelo:"mixto",identidad:"regional",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"},
    CAL:{propiedad:"club_social",modelo:"mixto",identidad:"barrial",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"},
    LSE:{propiedad:"corporacion",modelo:"mixto",identidad:"regional",barra:"tolerancia",finanzas:"apalancamiento",anfp:"bloque_chicos"},
    DCO:{propiedad:"club_social",modelo:"mixto",identidad:"popular",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"},
    UDC:{propiedad:"corporacion",modelo:"cantera",identidad:"universitaria",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"}
  });
  /* 5 · poder de los grupos por club (Grok lo mandó como GRUPOS_BASE) */
  if(typeof PODER_CLUB!=="undefined") Object.assign(PODER_CLUB,{
    EVE:{directorio:55,socios:52,hinchada:58,camarin:60,tecnico:58,prensa:50,anfp:50,sponsors:55,comunidad:55},
    COQ:{directorio:60,socios:55,hinchada:70,camarin:62,tecnico:60,prensa:55,anfp:48,sponsors:58,comunidad:65},
    AUD:{directorio:52,socios:50,hinchada:48,camarin:55,tecnico:52,prensa:48,anfp:50,sponsors:50,comunidad:58},
    HUA:{directorio:50,socios:48,hinchada:52,camarin:58,tecnico:60,prensa:48,anfp:50,sponsors:48,comunidad:60},
    OHI:{directorio:55,socios:52,hinchada:55,camarin:58,tecnico:55,prensa:50,anfp:52,sponsors:55,comunidad:55},
    NUB:{directorio:52,socios:50,hinchada:60,camarin:58,tecnico:55,prensa:48,anfp:48,sponsors:45,comunidad:62},
    COB:{directorio:50,socios:42,hinchada:45,camarin:52,tecnico:58,prensa:42,anfp:48,sponsors:40,comunidad:55},
    CAL:{directorio:45,socios:40,hinchada:42,camarin:48,tecnico:48,prensa:40,anfp:45,sponsors:38,comunidad:50},
    LSE:{directorio:50,socios:45,hinchada:50,camarin:52,tecnico:50,prensa:45,anfp:48,sponsors:50,comunidad:52},
    DCO:{directorio:52,socios:55,hinchada:72,camarin:65,tecnico:62,prensa:52,anfp:48,sponsors:45,comunidad:70},
    UDC:{directorio:55,socios:52,hinchada:48,camarin:52,tecnico:50,prensa:48,anfp:50,sponsors:48,comunidad:58}
  });
})();

/* 6 · rivalidades regionales para esClasico (pares, cualquier orden) */
const RIVALIDADES_2026=[
  ["DCO","UDC"],  /* clásico penquista */
  ["COQ","LSE"],  /* norte chico */
  ["HUA","DCO"],  /* Biobío */
  ["HUA","UDC"],  /* Biobío / acero vs Campanil */
  ["AUD","PAL"],  /* clásico de colonias */
  ["CAL","LIM"]   /* zona del Aconcagua / Quinta chica */
];
function esRivalidadRegional(a,b){
  if(!a||!b) return false;
  return RIVALIDADES_2026.some(function(par){
    return (par[0]===a&&par[1]===b)||(par[0]===b&&par[1]===a);
  });
}
