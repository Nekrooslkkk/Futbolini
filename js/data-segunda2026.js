"use strict";
/* ============================================================
   FUTBOLINI 7.49 · data-segunda2026.js
   SEGUNDA DIVISIÓN PROFESIONAL 2026 (14 clubes, 3er nivel del fútbol
   chileno). Datos: Wikipedia / ANFP, sep 2026. Se carga DESPUÉS de
   data-b2026.js y ANTES de partido.js.

   La 2ª Profesional 2026 se juega en dos zonas (Norte/Sur) con liguilla
   por el ascenso a Primera B. En el juego, por ahora, se juega como liga
   corrida (round-robin); el formato exacto grupos+liguilla queda como
   refinamiento de reglas. La zona real queda guardada en `z` para eso.

   Nombres de clubes/ciudades/estadios: reales documentados (Wikipedia /
   ANFP, sep 2026). DTs 2026: los de la ficha pública de la Liga de Segunda
   (Paredes, Viale, Ramos, etc.). Planteles: cantera (armarPlantel rellena);
   NUNCA se inventa un jugador como real.

   IDs nuevos (no chocan con Primera ni Primera B):
   COL Atlético Colina · BSA Brujas de Salamanca · CNA Concón National ·
   OVA Provincial Ovalle · RSJ Real San Joaquín · SCI Santiago City ·
   TRA Trasandino · CLC Colchagua · LIN Deportes Linares · REN Deportes Rengo ·
   GVE General Velásquez · LSC Lota Schwager · OSO Provincial Osorno ·
   SMO Santiago Morning.
   ============================================================ */

const LIGA_C_2026=[
 /* --- Zona Norte --- */
 {id:"TRA",n:"Trasandino",            c:"Trasandino",   fuerza:48, aforo:3500, est:"Estadio Regional de Los Andes",   ciudad:"Los Andes",  z:"norte"},
 {id:"COL",n:"Atlético Colina",       c:"A. Colina",    fuerza:47, aforo:4000, est:"Estadio Municipal Manuel Rojas",  ciudad:"Colina",     z:"norte"},
 {id:"OVA",n:"Provincial Ovalle",     c:"Ovalle",       fuerza:46, aforo:5160, est:"Estadio Diaguita",                ciudad:"Ovalle",     z:"norte"},
 {id:"CNA",n:"Concón National",       c:"Concón Nat.",  fuerza:46, aforo:3000, est:"Estadio Atlético Municipal",      ciudad:"Concón",     z:"norte"},
 {id:"BSA",n:"Brujas de Salamanca",   c:"Salamanca",    fuerza:45, aforo:3000, est:"Estadio Municipal de Salamanca",  ciudad:"Salamanca",  z:"norte"},
 {id:"RSJ",n:"Real San Joaquín",      c:"San Joaquín",  fuerza:45, aforo:2000, est:"Estadio Municipal de San Joaquín",ciudad:"Santiago",   z:"norte"},
 {id:"SCI",n:"Santiago City",         c:"Santiago City",fuerza:45, aforo:2500, est:"Estadio Municipal de Lo Barnechea",ciudad:"Santiago",  z:"norte"},
 /* --- Zona Sur --- */
 {id:"SMO",n:"Santiago Morning",      c:"S. Morning",   fuerza:54, aforo:5000, est:"Estadio Municipal de La Pintana", ciudad:"Santiago",   z:"sur"},
 {id:"LSC",n:"Lota Schwager",         c:"Lota Schwager",fuerza:50, aforo:4000, est:"Estadio Federico Schwager",       ciudad:"Coronel",    z:"sur"},
 {id:"OSO",n:"Provincial Osorno",     c:"Osorno",       fuerza:49, aforo:12000,est:"Estadio Rubén Marcos Peralta",    ciudad:"Osorno",     z:"sur"},
 {id:"LIN",n:"Deportes Linares",      c:"Linares",      fuerza:48, aforo:4000, est:"Estadio Fiscal Tucapel Bustamante",ciudad:"Linares",   z:"sur"},
 {id:"CLC",n:"Colchagua",             c:"Colchagua",    fuerza:47, aforo:7200, est:"Estadio Jorge Silva Valenzuela",  ciudad:"San Fernando",z:"sur"},
 {id:"GVE",n:"General Velásquez",     c:"Gral. Velásquez",fuerza:45,aforo:3000,est:"Estadio Municipal Augusto Rodríguez",ciudad:"San Vicente",z:"sur"},
 {id:"REN",n:"Deportes Rengo",        c:"Rengo",        fuerza:44, aforo:3000, est:"Estadio Municipal Guillermo Guzmán Díaz",ciudad:"Rengo",z:"sur"}
];
function idsSegunda(){ return LIGA_C_2026.map(function(c){ return c.id; }); }
function esClubC(id){ return idsSegunda().indexOf(id)>=0; }
function clubZona(id){ for(var i=0;i<LIGA_C_2026.length;i++){ if(LIGA_C_2026[i].id===id) return LIGA_C_2026[i].z; } return null; }

if(typeof LIGAS==="object") LIGAS["2026c"]=LIGA_C_2026;
if(typeof ERA==="object" && ERA[2026]) ERA["2026c"]=ERA[2026];

/* ---------- identidad / indicadores / caja / estatuto / poder ---------- */
(function integrarSegunda2026(){
  if(typeof CLUB_INFO_2026!=="undefined") Object.assign(CLUB_INFO_2026,{
    SMO:{n:"Santiago Morning",esc:"⚫",est:"Estadio Municipal de La Pintana",dt:"Esteban Paredes",
      desc:"El chaguito, bohemio de Santiago y de larga historia. Bajó a Segunda y en 2026 pelea por volver a la B. Camiseta con pasado grande, presente de pelea."},
    LSC:{n:"Lota Schwager",esc:"⚫",est:"Estadio Federico Schwager",dt:"Renato Ramos",
      desc:"El minero del carbón, de Coronel. Vuelve al profesionalismo tras años abajo. La cuenca lo siente como bandera."},
    OSO:{n:"Provincial Osorno",esc:"🔴",est:"Estadio Rubén Marcos Peralta",dt:"Jeremías Viale",
      desc:"El toro del sur. Osorno y un estadio grande para la categoría: si llena, incomoda a cualquiera."},
    LIN:{n:"Deportes Linares",esc:"🔵",est:"Estadio Fiscal Tucapel Bustamante",dt:"Rodrigo Meléndez",
      desc:"El albirrojo del Maule. Club de región con hinchada fiel y ganas de dar el salto a la B."},
    CLC:{n:"Colchagua",esc:"🟡",est:"Estadio Jorge Silva Valenzuela",dt:"Raúl González",
      desc:"El de San Fernando, valle de Colchagua. Volvió tras años afuera y quiere quedarse arriba."},
    TRA:{n:"Trasandino",esc:"🟢",est:"Estadio Regional de Los Andes",dt:"Fernando Gutiérrez",
      desc:"El de Los Andes, cerca de la cordillera. Club chico de tradición que pelea el ascenso a la B."},
    COL:{n:"Atlético Colina",esc:"🔵",est:"Estadio Municipal Manuel Rojas",dt:"Fernando Vergara",
      desc:"Recién campeón de la Tercera A, vuelve al profesionalismo. Comuna en crecimiento al norte de Santiago."},
    OVA:{n:"Provincial Ovalle",esc:"🟠",est:"Estadio Diaguita",dt:"Víctor Quintanilla",
      desc:"El del Limarí. Club de la cuarta región que busca hacerse un nombre en el profesionalismo."},
    CNA:{n:"Concón National",esc:"🔵",est:"Estadio Atlético Municipal",dt:"Orlando Gutiérrez",
      desc:"Club joven de Concón, litoral central. Sin pasado en divisiones mayores: todo por construir."},
    BSA:{n:"Brujas de Salamanca",esc:"🟣",est:"Estadio Municipal de Salamanca",dt:"Felipe Cornejo",
      desc:"Las brujas del Choapa. Salamanca y su leyenda: club chico de identidad fuerte."},
    RSJ:{n:"Real San Joaquín",esc:"⚪",est:"Estadio Municipal de San Joaquín",dt:"Jaime Lizama",
      desc:"Club-escuela de Santiago, formador. Poco aforo, mucho cabro con proyección."},
    SCI:{n:"Santiago City",esc:"🔵",est:"Estadio Municipal de Lo Barnechea",dt:"Cristian Febre",
      desc:"Proyecto joven de la capital. Sin historia en categorías mayores: escribe la propia."},
    GVE:{n:"General Velásquez",esc:"🔴",est:"Estadio Municipal Augusto Rodríguez",dt:"Matías Garrido",
      desc:"El de San Vicente de Tagua Tagua. Club de pueblo del secano, de aguante en la categoría."},
    REN:{n:"Deportes Rengo",esc:"🟢",est:"Estadio Municipal Guillermo Guzmán Díaz",dt:"Víctor Fuentes",
      desc:"El de Rengo, valle de Cachapoal. Recién llegado al profesionalismo, a sobrevivir primero."}
  });
  if(typeof IND_BASE_2026!=="undefined") Object.assign(IND_BASE_2026,{
    SMO:{plantel:54,moral:52,hinchada:58,socios:40,cantera:50,estadio:44,prestigio:56,riesgo:44},
    LSC:{plantel:50,moral:56,hinchada:52,socios:34,cantera:44,estadio:48,prestigio:48,riesgo:42},
    OSO:{plantel:49,moral:54,hinchada:50,socios:36,cantera:42,estadio:60,prestigio:46,riesgo:40},
    LIN:{plantel:48,moral:52,hinchada:48,socios:34,cantera:44,estadio:46,prestigio:44,riesgo:42},
    CLC:{plantel:47,moral:54,hinchada:42,socios:30,cantera:40,estadio:42,prestigio:40,riesgo:44},
    TRA:{plantel:48,moral:50,hinchada:44,socios:32,cantera:46,estadio:44,prestigio:42,riesgo:44},
    COL:{plantel:47,moral:58,hinchada:40,socios:28,cantera:44,estadio:34,prestigio:38,riesgo:46},
    OVA:{plantel:46,moral:50,hinchada:44,socios:30,cantera:42,estadio:40,prestigio:40,riesgo:46},
    CNA:{plantel:46,moral:52,hinchada:34,socios:26,cantera:44,estadio:32,prestigio:32,riesgo:46},
    BSA:{plantel:45,moral:52,hinchada:40,socios:28,cantera:42,estadio:36,prestigio:38,riesgo:46},
    RSJ:{plantel:45,moral:50,hinchada:32,socios:24,cantera:52,estadio:30,prestigio:34,riesgo:44},
    SCI:{plantel:45,moral:50,hinchada:30,socios:24,cantera:46,estadio:32,prestigio:32,riesgo:46},
    GVE:{plantel:45,moral:48,hinchada:42,socios:30,cantera:40,estadio:38,prestigio:38,riesgo:48},
    REN:{plantel:44,moral:48,hinchada:38,socios:28,cantera:38,estadio:36,prestigio:34,riesgo:48}
  });
  if(typeof CAJA_BASE_2026!=="undefined") Object.assign(CAJA_BASE_2026,{
    SMO:{plata:120,deuda:120}, LSC:{plata:90,deuda:60},  OSO:{plata:110,deuda:70},
    LIN:{plata:90,deuda:55},   CLC:{plata:80,deuda:50},  TRA:{plata:85,deuda:55},
    COL:{plata:80,deuda:40},   OVA:{plata:80,deuda:50},  CNA:{plata:70,deuda:40},
    BSA:{plata:70,deuda:45},   RSJ:{plata:65,deuda:35},  SCI:{plata:70,deuda:40},
    GVE:{plata:70,deuda:45},   REN:{plata:65,deuda:45}
  });
  var estatutoC={propiedad:"club_social",modelo:"vendedor",identidad:"regional",barra:"tolerancia",finanzas:"austeridad",anfp:"bloque_chicos"};
  if(typeof ESTATUTO_INICIAL!=="undefined"){
    var est={};
    LIGA_C_2026.forEach(function(c){ est[c.id]=Object.assign({},estatutoC); });
    est.SMO.identidad="popular"; est.LSC.identidad="popular"; est.RSJ.identidad="barrial"; est.SCI.identidad="barrial";
    Object.assign(ESTATUTO_INICIAL,est);
  }
  if(typeof PODER_CLUB!=="undefined"){
    var pod={};
    LIGA_C_2026.forEach(function(c){
      pod[c.id]={directorio:48,socios:40,hinchada:48,camarin:52,tecnico:48,prensa:36,anfp:38,sponsors:34,comunidad:60};
    });
    pod.SMO.hinchada=58; pod.OSO.hinchada=52; pod.LSC.hinchada=54;
    Object.assign(PODER_CLUB,pod);
  }
})();
