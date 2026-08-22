"use strict";
/* ============================================================
   FUTBOLINI 3.0 · motor.js
   Estado, resolución de decisiones, economía, modificadores,
   eventos y paso del tiempo. No dibuja nada.
   ============================================================ */

let E=null;

const IND=[
 {k:"plantel",  n:"Plantel",  c:"#4fbf3f", d:"Nivel futbolístico real del equipo."},
 {k:"moral",    n:"Moral",    c:"#39b7e0", d:"Cómo está el camarín. Pesa tanto como el nivel."},
 {k:"hinchada", n:"Hinchada", c:"#e0563f", d:"Ánimo de la gente. Mueve taquilla y presión."},
 {k:"socios",   n:"Socios",   c:"#9a6fe0", d:"Base de socios: ingreso fijo y votos internos."},
 {k:"cantera",  n:"Cantera",  c:"#2fa87f", d:"Calidad del fútbol joven. Plantel y plata a futuro."},
 {k:"estadio",  n:"Estadio",  c:"#a5854a", d:"Estado del recinto. Aforo, seguridad y sanciones."},
 {k:"prestigio",n:"Prestigio",c:"#e0a92a", d:"Peso del nombre: sponsors, TV y atractivo."},
 {k:"riesgo",   n:"Riesgo",   c:"#c9392c", d:"Cuánta cuerda le estás dando al escándalo."}
];

const IND_BASE={
 CC:{plantel:78,moral:70,hinchada:84,socios:55,cantera:64,estadio:66,prestigio:80,riesgo:18},
 UCH:{plantel:58,moral:52,hinchada:80,socios:50,cantera:62,estadio:24,prestigio:56,riesgo:24},
 UC:{plantel:72,moral:66,hinchada:48,socios:56,cantera:78,estadio:70,prestigio:68,riesgo:14},
 PAL:{plantel:58,moral:58,hinchada:34,socios:34,cantera:54,estadio:42,prestigio:44,riesgo:18},
 LIM:{plantel:40,moral:62,hinchada:30,socios:20,cantera:34,estadio:26,prestigio:24,riesgo:12}
};
const CAJA_BASE={CC:{plata:900,deuda:2600},UCH:{plata:320,deuda:1400},UC:{plata:700,deuda:600},
 PAL:{plata:280,deuda:380},LIM:{plata:150,deuda:120}};

const CLUB_INFO={
 CC:{n:"Colo-Colo",esc:"⚪",est:"Estadio Monumental",dt:"Mirko Jozić",
  desc:"Campeón nacional 1989 y 1990. Entra a 1991 con un tricampeonato en juego, un estadio nuevo y una deuda que pesa."},
 UCH:{n:"Universidad de Chile",esc:"🔵",est:"Estadio Nacional (arrendado)",dt:"el cuerpo técnico",
  desc:"Vuelve del descenso de 1988. Hinchada enorme, caja chica y sin estadio propio."},
 UC:{n:"Universidad Católica",esc:"🔷",est:"San Carlos de Apoquindo",dt:"el cuerpo técnico",
  desc:"Estadio propio, cantera fuerte y administración ordenada."},
 PAL:{n:"Palestino",esc:"🟩",est:"Municipal de La Cisterna",dt:"el cuerpo técnico",
  desc:"Club de colonia con historia grande y presupuesto acotado."},
 LIM:{n:"Deportes Limache",esc:"🟨",est:"Estadio Lucio Fariña",dt:"el cuerpo técnico",
  desc:"Club provincial. Todo se juega a sobrevivir y crecer."}
};

/* ---------- época 2026 (datos APROXIMADOS, verificar) ---------- */
const CLUB_INFO_2026={
 CC:{n:"Colo-Colo",esc:"⚪",est:"Estadio Monumental",dt:"el cuerpo técnico",
  desc:"El club más popular de Chile en la era de las sociedades anónimas. Plantel caro, hinchada enorme y una deuda que siempre ronda."},
 UCH:{n:"Universidad de Chile",esc:"🔵",est:"Estadio Nacional (arrendado)",dt:"Fernando Gago",
  desc:"Volvió a pelear arriba tras años irregulares. Masa social gigante y todavía sin estadio propio."},
 UC:{n:"Universidad Católica",esc:"🔷",est:"Claro Arena",dt:"Daniel Garnero",
  desc:"Estrena estadio propio y arrastra una camada ganadora. Administración ordenada y cantera fuerte."},
 PAL:{n:"Palestino",esc:"🟩",est:"Municipal de La Cisterna",dt:"el cuerpo técnico",
  desc:"Club de colonia, competitivo y con buena formación, siempre peleando con presupuesto acotado."},
 LIM:{n:"Deportes Limache",esc:"🟨",est:"Estadio Lucio Fariña",dt:"Víctor Rivero",
  desc:"Recién ascendido a Primera. El objetivo es claro: aguantar la categoría y no morir en el intento."}
};
const IND_BASE_2026={
 CC:{plantel:80,moral:66,hinchada:88,socios:62,cantera:66,estadio:74,prestigio:84,riesgo:22},
 UCH:{plantel:79,moral:64,hinchada:86,socios:58,cantera:66,estadio:40,prestigio:78,riesgo:24},
 UC:{plantel:79,moral:68,hinchada:50,socios:55,cantera:74,estadio:82,prestigio:76,riesgo:14},
 PAL:{plantel:70,moral:62,hinchada:38,socios:40,cantera:62,estadio:48,prestigio:54,riesgo:16},
 LIM:{plantel:60,moral:60,hinchada:40,socios:26,cantera:42,estadio:30,prestigio:32,riesgo:14}
};
const CAJA_BASE_2026={CC:{plata:1200,deuda:3000},UCH:{plata:900,deuda:1800},UC:{plata:1000,deuda:900},
 PAL:{plata:520,deuda:480},LIM:{plata:300,deuda:200}};
/* Devuelve el set de datos de club según la época (1991 o 2026). */
function datosEra(base){
  return base===2026
   ? {info:CLUB_INFO_2026, ind:IND_BASE_2026, caja:CAJA_BASE_2026}
   : {info:CLUB_INFO, ind:IND_BASE, caja:CAJA_BASE};
}
function infoClub(clubId){ return datosEra(E?E.eraBase:1991).info[clubId] || CLUB_INFO[clubId]; }

/* ---------------- arranque ---------------- */
function parseMarcadorReal(real,local){
  if(!real) return null;
  const p=String(real).split(/[-–]/).map(n=>parseInt(n,10));
  if(p.length<2||isNaN(p[0])||isNaN(p[1])) return null;
  return local?{gf:p[0],gc:p[1]}:{gf:p[1],gc:p[0]};
}
/* Carga resultados ya jugados hasta el corte (18/08/2026) y la tabla de referencia.
   No inventa partidos: usa `real` del fixture. El resto de la tabla es semilla. */
function aplicarCorte2026(){
  if(!E||E.anio!==2026) return;
  const corte=(typeof CORTE_2026!=="undefined")?CORTE_2026:{m:8,d:18};
  if(typeof TABLA_2026_CORTE==="object"){
    Object.keys(TABLA_2026_CORTE).forEach(id=>{
      if(E.tabla[id]) Object.assign(E.tabla[id], TABLA_2026_CORTE[id]);
    });
  }
  (E.calendario||[]).forEach(p=>{
    if((p.f.m*100+(p.f.d||1))>(corte.m*100+(corte.d||1))) return;
    if(!p.real) return;
    const sc=parseMarcadorReal(p.real,p.local);
    if(!sc) return;
    p.jugado=true; p.gf=sc.gf; p.gc=sc.gc;
  });
  const i=(E.calendario||[]).findIndex(p=>!p.jugado);
  E.idx=i<0?(E.calendario||[]).length:i;
  const yo=E.tabla[E.club];
  if(yo) E.temporada=Object.assign({sinGanar:0},yo);
  E.flags=E.flags||{}; E.flags.corte2026=true;
  if(typeof pushNotif==="function") pushNotif("Cortás en agosto","El campeonato ya se jugó hasta el 18/08. Los partidos anteriores están cargados. El próximo es el que sigue.","neutro");
}
function nuevaPartida(clubId,anio,modo,extra){
  const base=baseEra(anio);
  activarLiga(base);
  const D=datosEra(base);
  const info=D.info[clubId];
  E={
    v:4, club:clubId, eraBase:base, clubNombre:info.n, dt:info.dt, anio:anio, modo:modo||"historico",
    ind:Object.assign({},D.ind[clubId]),
    plata:D.caja[clubId].plata, deuda:D.caja[clubId].deuda,
    capital:45,
    rep:{publica:52,credibilidad:50,prensa:50,dureza:40},
    grupos:{}, estatutos:Object.assign({},ESTATUTO_INICIAL[clubId]),
    mods:[], flags:{}, plantel:[], calendario:[], idx:0,
    tabla:{}, decPend:[], decHechas:{}, bandeja:[], cronica:[], titulos:[],
    pendientesEncadenadas:[], notifs:[], ofertasPend:[], mercadoLog:{rechazadas:{},vendidos:[]},
    redes:[], promesas:[], historialAnual:[], ultimaFecha:[], prensaAuto:false,
    timeline:[], seguidores:Math.round((D.ind[clubId].hinchada+D.ind[clubId].prestigio)*280),
    tactica:{form:"4-4-2",estilo:"Equilibrado",presion:"Media"},
    precioEntrada:1, presupuesto:null, temporada:{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0,sinGanar:0},
    carrera:{club:clubId,desde:anio,despidos:0,clubes:[],evaluacion:null,fin:false},
    divergencias:[], coincidencias:[], staff:{deportivo:62,tesorero:60,prensa:58,cm:false}
  };
  GRUPOS.forEach(g=>{
    const poder=(PODER_CLUB[clubId]||{})[g.id]||45;
    const ap=((APROB_INICIAL[clubId]||{})[g.id])||0;
    E.grupos[g.id]={poder:poder,aprob:ap};
  });
  E.plantel=armarPlantel(clubId,anio,D.ind[clubId].plantel);
  /* 7.00 · época histórica de gloria (leyendas): sobrescribe identidad/indicadores/caja */
  if(extra&&extra.epoca){
    const ep=extra.epoca;
    if(ep.ind) E.ind=Object.assign(E.ind,ep.ind);
    if(ep.caja){ E.plata=ep.caja.plata; E.deuda=ep.caja.deuda; }
    if(ep.dt) E.dt=ep.dt;
    if(ep.etq) E.epocaEtq=ep.etq;
    E.epocaHist=ep.anio;
    E.seguidores=Math.round((E.ind.hinchada+E.ind.prestigio)*280);
  }
  E.calendario=construirCalendario(clubId,anio,true);
  E.precios=preciosDefault();
  reiniciarTabla();
  repartirDecisiones();
  normalizarEstado();
  if(extra&&extra.corte&&anio===2026) aplicarCorte2026();
  if(typeof sembrarRedes==="function") sembrarRedes();
  guardar();
}
function reiniciarTabla(){
  E.tabla={};
  LIGA_ACT.forEach(c=>E.tabla[c.id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0});
}
/* puntos por victoria según la época (2 en 1991, 3 en 2026) */
function puntosVictoria(){ return (E&&eraDe(E.eraBase)?eraDe(E.eraBase).puntosVictoria:2); }
/* Rellena campos nuevos en partidas guardadas de antes del roadmap 3.0.
   No sube la versión: solo agrega lo que falte sin tocar lo existente. */
function normalizarEstado(){
  if(!E) return;
  if(!E.eraBase) E.eraBase=baseEra(E.anio);
  if(typeof activarLiga==="function") activarLiga(E.eraBase);
  if(!E.flags) E.flags={};
  if(!Array.isArray(E.pendientesEncadenadas)) E.pendientesEncadenadas=[];
  if(!E.decProc||typeof E.decProc!=="object") E.decProc={};
  if(!E.temporada) E.temporada={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0,sinGanar:0};
  if(E.temporada.sinGanar===undefined) E.temporada.sinGanar=0;
  if(!Array.isArray(E.notifs)) E.notifs=[];
  if(!Array.isArray(E.ofertasPend)) E.ofertasPend=[];
  if(!E.mercadoLog) E.mercadoLog={rechazadas:{},vendidos:[]};
  if(!Array.isArray(E.redes)) E.redes=[];
  if(!Array.isArray(E.promesas)) E.promesas=[];
  if(!E.precios) E.precios=preciosDefault();
  if(!E.staff) E.staff={deportivo:62,tesorero:60,prensa:58,cm:false};
  if(E.staff.cm===undefined) E.staff.cm=false;
  if(!Array.isArray(E.historialAnual)) E.historialAnual=[];
  if(!Array.isArray(E.ultimaFecha)) E.ultimaFecha=[];
  if(E.prensaAuto===undefined) E.prensaAuto=false;
  if(!Array.isArray(E.timeline)) E.timeline=[];
  if(E.seguidores===undefined) E.seguidores=Math.round((E.ind.hinchada+E.ind.prestigio)*280);
  /* 5.0 · Bloque 1 — perfil, vida social, dinastía y patrimonio personal */
  if(!E.perfil) E.perfil={nombre:"DT",nacimiento:((E.anio||2026)-38)+"-05-12",avatar:"orb-azul",orientacion:"Libre",vidaSocial:{publica:true,agenda:[]}};
  if(!E.perfil.vidaSocial) E.perfil.vidaSocial={publica:true,agenda:[]};
  if(!Array.isArray(E.perfil.vidaSocial.agenda)) E.perfil.vidaSocial.agenda=[];
  if(!E.dinastia) E.dinastia={generacion:1,linaje:"Tu linaje",limiteAnio:2100,historial:[],sucesionPendiente:false};
  if(!Array.isArray(E.dinastia.historial)) E.dinastia.historial=[];
  if(!E.dinastia.raiz) E.dinastia.raiz=E.perfil.nombre||"DT";
  if(!E.personal) E.personal={bolsillo:50,propiedades:[],autos:[]};
  if(E.personal.sueldo===undefined) E.personal.sueldo=8;
  if(E.flags.desfalco===undefined) E.flags.desfalco=0;
  if(!E.config) E.config={autoPausa:true};
  if(E.config.spoiler===undefined) E.config.spoiler=(E.modo!=="libre");
  /* Vida 2.0: tinder/parejas y migración de avatar a orbes MSN (solo se mantiene 😎) */
  if(!E.perfil.tinder) E.perfil.tinder={matches:[]};
  if(!Array.isArray(E.perfil.tinder.matches)) E.perfil.tinder.matches=[];
  if(E.perfil.pareja===undefined) E.perfil.pareja=null;
  /* Vida 3.0: bienestar, familia y evolución de la relación */
  if(E.perfil.bienestar===undefined) E.perfil.bienestar=70;
  if(E.perfil.genero===undefined) E.perfil.genero="M";
  if(["Hetero","Gay","Bi","Libre"].indexOf(E.perfil.orientacion)<0) E.perfil.orientacion="Libre";
  if(!Array.isArray(E.perfil.hijos)) E.perfil.hijos=[];
  if(E.perfil.pareja && E.perfil.pareja.nivel===undefined){ E.perfil.pareja.nivel=65; E.perfil.pareja.casades=!!E.perfil.pareja.casades; }
  if(E.perfil.avatar && E.perfil.avatar!=="😎" && String(E.perfil.avatar).indexOf("orb-")!==0) E.perfil.avatar="orb-azul";
  /* 5.0 · bolsa de valores del club + finanzas avanzadas */
  if(typeof normalizarBolsa==="function") normalizarBolsa();
  /* v4: planteles viejos con nombres inventados tipo "Luis Aránguiz" */
  if((E.v||0)<4){
    const hayFantasma=(E.plantel||[]).some(j=>!j.real && j.n && j.n.indexOf("Canterano")!==0);
    if(hayFantasma && typeof armarPlantel==="function"){
      E.plantel=armarPlantel(E.club,E.anio,(E.ind&&E.ind.plantel)||60);
    }
    E.v=4;
  }
  /* 5.0 · objetivos de temporada */
  if(!Array.isArray(E.objetivos)||!E.objetivos.length){
    E.objetivos=(typeof generarObjetivos==="function")?generarObjetivos():[];
  }
  /* 6.0 · motor de memoria */
  if(typeof normalizarMemoria==="function") normalizarMemoria();
  /* 6.21 · mesa de la barra */
  if(typeof normalizarBarra==="function") normalizarBarra();
  if(typeof normalizarLogros==="function") normalizarLogros();
  if(typeof normalizarStorylines==="function") normalizarStorylines();
  /* 6.24 · estado del jugador: minutos, estado y pie (pie determinístico por nombre) */
  (E.plantel||[]).forEach(j=>{
    if(j.minutosTemporada===undefined) j.minutosTemporada=0;
    if(!j.estado) j.estado=j.vendido?"vendido":(j.cedido?"cedido":(j.lesion>0?"lesion":"banca"));
    if(!j.pie && typeof semilla==="function") j.pie=(semilla(j.n)%4===0)?"izquierdo":"derecho";
  });
  /* 6.3 · PLOP: usuario, verificados y likes */
  if(!E.plopVerif) E.plopVerif={};
  if(!Array.isArray(E.plopLikes)) E.plopLikes=[];
  /* 6.7 · táctica: mentalidad estilo FM y designados de balón parado */
  if(E.tactica){ if(!E.tactica.mentalidad) E.tactica.mentalidad="Equilibrado";
    if(E.tactica.penalista===undefined) E.tactica.penalista=null;
    if(E.tactica.tiroLibre===undefined) E.tactica.tiroLibre=null;
    if(E.tactica.corner===undefined) E.tactica.corner=null;
    if(E.tactica.xiManual===undefined) E.tactica.xiManual=null;
    if(!E.tactica.roles) E.tactica.roles={}; }
}
/* ---------- historial de temporadas (memoria a largo plazo) ---------- */
function tablaOrdenada(){
  const arr=LIGA_ACT.map(c=>Object.assign({id:c.id,n:c.n},E.tabla[c.id]));
  arr.sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf);
  return arr;
}
function guardarHistorial(pos,campeon,copaGanada){
  if(!E.historialAnual) E.historialAnual=[];
  const arr=tablaOrdenada();
  const gol=E.plantel.filter(j=>!j.vendido).slice().sort((a,b)=>b.goles-a.goles)[0];
  E.historialAnual.unshift({
    anio:E.anio, era:E.eraBase, club:E.club, clubNombre:E.clubNombre,
    pos:pos, campeon:campeon, copa:!!copaGanada,
    tabla:arr.map(c=>({id:c.id,n:c.n,pj:c.pj,pg:c.pg,pe:c.pe,pp:c.pp,gf:c.gf,gc:c.gc,pts:c.pts})),
    goleador:(gol&&gol.goles>0)?{n:gol.n,goles:gol.goles}:null
  });
  if(E.historialAnual.length>40) E.historialAnual.length=40;
}
/* ============================================================
   Centro de notificaciones: TODO lo importante deja un aviso
   persistente y explicado, que se puede revisar cuando quieras.
   `acc` marca los avisos accionables (ej: una oferta por un jugador).
   ============================================================ */
function notificar(n){
  if(!E) return null;
  if(!E.notifs) E.notifs=[];
  const part=proximoPartido();
  const item={
    id:"n"+(E._nid=(E._nid||0)+1),
    t:n.t, d:n.d||"", extra:n.extra||"", tipo:n.tipo||"neutro",
    anio:E.anio, fecha:(part&&part.f?fechaTxt(part.f):"cierre de temporada"),
    leido:false, acc:n.acc||null
  };
  E.notifs.unshift(item);
  if(E.notifs.length>80) E.notifs.length=80;
  /* también entra a la bandeja semanal del escritorio, salvo que se pida lo contrario */
  if(n.bandeja!==false){
    E.bandeja.unshift({t:item.t,d:item.d,extra:item.extra,tipo:item.tipo,anio:E.anio});
    if(E.bandeja.length>20) E.bandeja.length=20;
  }
  return item;
}
/* ---------- 5.0 · Bloque 4 — interacción institucional ---------- */
function aplicarInteraccion(op){
  if(op.capital && E.capital+op.capital<0) return {ok:false,msg:"No te alcanza el capital institucional."};
  if(op.plata && E.plata+op.plata<0) return {ok:false,msg:"No te alcanza la caja."};
  if(op.capital) aplicarEfectos({capital:op.capital});
  if(op.plata) aplicarEfectos({plata:op.plata});
  if(op.ef) aplicarEfectos(op.ef);
  if(op.grupos) aplicarGrupos(op.grupos);
  if(op.rep) aplicarRep(op.rep);
  if(op.flags) for(const k in op.flags) E.flags[k]=op.flags[k];
  if(op.soplo){ const s=soploAnonimo(); guardar(); return {ok:true,soplo:s}; }
  notificar({t:"Interacción: "+op.t,tipo:"neutro",d:op.d||"",bandeja:false});
  guardar(); return {ok:true};
}
function soploAnonimo(){
  const r=Math.random();
  if(r<0.4){
    agregarMod({id:"soplo_ventaja",n:"Data del rival",anios:1,ef:{liga:2}});
    notificar({t:"Soplo útil",tipo:"bueno",d:"El informante te pasó debilidades de los próximos rivales. Pequeña ventaja este año.",bandeja:false});
    return "útil";
  } else if(r<0.7){
    notificar({t:"Soplo sin valor",tipo:"neutro",d:"Puro humo. El tipo hablaba de memoria.",bandeja:false});
    return "humo";
  }
  E.ind.riesgo=clamp(E.ind.riesgo+6,0,100);
  notificar({t:"Soplo envenenado",tipo:"malo",d:"El «informante» quería sacarte plata y quedó dando vueltas con lo que le contaste. Sube el riesgo.",bandeja:false});
  return "trampa";
}
function notifsNoLeidas(){ return (E.notifs||[]).filter(n=>!n.leido).length; }
function notifsAccionables(){ return (E.notifs||[]).filter(n=>n.acc&&!n.acc.resuelta); }
function marcarLeidas(){ (E.notifs||[]).forEach(n=>{ n.leido=true; }); }
/* ---------------- helpers de estado ---------------- */
function modSuma(k){ let s=0; E.mods.forEach(m=>{ if(m.ef&&m.ef[k]) s+=m.ef[k]; }); return s; }
function agregarMod(m){
  const ex=E.mods.find(x=>x.id===m.id);
  if(ex){ ex.hasta=Math.max(ex.hasta,E.anio+(m.anios||1)); return; }
  E.mods.push({id:m.id,n:m.n,hasta:E.anio+(m.anios||1),ef:m.ef||{}});
}
function limpiarMods(){ E.mods=E.mods.filter(m=>m.hasta>=E.anio); }
function aplicarEfectos(ef){
  if(!ef) return;
  for(const k in ef){
    const v=ef[k];
    if(k==="plata") E.plata+=v;
    else if(k==="deuda") E.deuda=Math.max(0,E.deuda+v);
    else if(k==="capital") E.capital=Math.max(0,E.capital+v);   /* sin tope superior */
    else if(E.ind[k]!==undefined) E.ind[k]=clamp(E.ind[k]+v,0,100);
  }
  if(E.plata<0){ E.deuda+=Math.abs(E.plata)*1.2; E.plata=0; E.ind.riesgo=clamp(E.ind.riesgo+3,0,100); }
}
function aplicarGrupos(g){ if(!g) return; for(const k in g){ if(E.grupos[k]) E.grupos[k].aprob=clamp(E.grupos[k].aprob+g[k],-100,100); } }
function aplicarRep(r){ if(!r) return; for(const k in r){ if(E.rep[k]!==undefined) E.rep[k]=clamp(E.rep[k]+r[k],0,100); } }
/* ---------- banderas y efecto mariposa ----------
   Una opción o un desenlace puede dejar una bandera (`flag`/`flags`) que otros
   eventos leen fechas después, y puede `encadena`r una decisión más adelante. */
function aplicarBanderas(o){
  if(!o) return;
  if(typeof o.flag==="string") E.flags[o.flag]=true;
  if(o.flags) for(const k in o.flags) E.flags[k]=o.flags[k];
}
/* encadena:"idDecision"  ó  encadena:{id:"idDecision",en:3,peso:"alto"} */
function agendarEncadena(enc){
  if(!enc) return;
  const cfg=(typeof enc==="string")?{id:enc}:enc;
  if(!cfg.id) return;
  const fecha=E.idx+(cfg.en||3);
  const ya=E.pendientesEncadenadas.some(p=>p.id===cfg.id)
        || E.decPend.some(x=>x.id===cfg.id)
        || E.decHechas[cfg.id+"_"+E.anio];
  if(ya) return;
  E.pendientesEncadenadas.push({id:cfg.id,fecha:fecha,peso:cfg.peso||"medio"});
}
/* Se llama al avanzar: madura la cola de encadenados. Los que tienen `op` van a
   la bandeja de decisiones; los simples (solo efectos) se aplican al toque. */
function procesarEncadenadas(){
  if(!E.pendientesEncadenadas||!E.pendientesEncadenadas.length) return [];
  const listos=[], quedan=[];
  E.pendientesEncadenadas.forEach(p=>{ (p.fecha<=E.idx?listos:quedan).push(p); });
  E.pendientesEncadenadas=quedan;
  const disparadas=[];
  listos.forEach(p=>{
    const d=decisionPorId(p.id); if(!d) return;
    const clave=d.id+"_"+E.anio;
    if(E.decHechas[clave]||E.decPend.some(x=>x.id===d.id)) return;
    if(d.op){
      E.decPend.push({id:d.id,clave:clave,peso:p.peso||d.peso||"medio"});
      disparadas.push(d);
    } else {
      if(d.ef) aplicarEfectos(d.ef);
      if(d.grupos) aplicarGrupos(d.grupos);
      if(d.rep) aplicarRep(d.rep);
      aplicarBanderas(d);
      const extra=d.accion?ejecutarAccion(d.accion,d):"";
      const item=notificar({t:d.t,d:resolverTokens(d.d||"",E),extra:extra,tipo:d.tipo||"neutro"});
      disparadas.push(item);
    }
  });
  return disparadas;
}
/* Contexto que se evalúa cada semana: mala racha y oferta de medianoche.
   Devuelve una lista de novedades para avisar al jugador. */
function eventosDeContexto(){
  const avisos=[];
  procesarEncadenadas();
  /* mala racha: 4 partidos sin ganar → la prensa pide tu cabeza */
  if((E.temporada.sinGanar||0)>=4 && !E.flags.rachaLiquida
     && typeof ENCADENADAS!=="undefined" && decisionPorId("enc_racha")){
    E.flags.rachaLiquida=true;
    if(!E.decPend.some(x=>x.id==="enc_racha") && !E.decHechas["enc_racha_"+E.anio]){
      E.decPend.push({id:"enc_racha",clave:"enc_racha_"+E.anio,peso:"alto"});
      avisos.push("La prensa se te tiró encima por la racha");
    }
  }
  /* oferta de medianoche: la noche previa a una semifinal o final */
  const part=proximoPartido();
  if(part && (part.ronda==="FINAL"||part.ronda==="Semifinal")
     && !E.flags["medianoche_"+E.idx] && Math.random()<0.5
     && typeof ENCADENADAS!=="undefined" && decisionPorId("enc_medianoche")){
    E.flags["medianoche_"+E.idx]=true;
    if(!E.decPend.some(x=>x.id==="enc_medianoche") && !E.decHechas["enc_medianoche_"+E.anio]){
      E.decPend.push({id:"enc_medianoche",clave:"enc_medianoche_"+E.anio,peso:"alto"});
      avisos.push("Alguien te busca la noche antes del partido grande");
    }
  }
  return avisos;
}
function apoyoPonderado(posturas){
  if(!posturas) return 0;
  let num=0,den=0;
  for(const k in posturas){
    const g=E.grupos[k]; if(!g) continue;
    num+=posturas[k]*(g.poder/100)*(1+g.aprob/200); den+=g.poder/100;
  }
  return den?num/den:0;
}
function aprobacionMedia(){
  let s=0,p=0;
  GRUPOS.forEach(g=>{ const x=E.grupos[g.id]; s+=x.aprob*x.poder; p+=x.poder; });
  return p?s/p:0;
}
/* ---------------- decisiones ---------------- */
function decisionesDisponibles(){
  const propias=DECISIONES.filter(d=>d.club===E.club&&d.anio===E.anio);
  const bolsa=BOLSA.filter(d=>!d.cuando||d.cuando(E));
  return propias.concat(bolsa);
}
function repartirDecisiones(){
  const ya=new Set(E.decPend.map(x=>x.id));
  decisionesDisponibles().forEach(d=>{
    const clave=d.id+"_"+E.anio;
    if(E.decHechas[clave]||ya.has(d.id)) return;   /* FIX: dedup por id (antes comparaba id-set vs clave, no coincidía nunca → duplicaba) */
    const mesActual=E.calendario[E.idx]?E.calendario[E.idx].f.m:2;
    if(d.mes && d.mes>mesActual) return;
    E.decPend.push({id:d.id,clave:clave,peso:d.peso||"medio"});
  });
}
function requisitoCumplido(op){
  const r=op.req; if(!r) return {ok:true,txt:""};
  const faltan=[];
  if(r.plata&&E.plata<r.plata) faltan.push("faltan "+plata(r.plata-E.plata));
  if(r.capital&&E.capital<r.capital) faltan.push("falta capital institucional");
  if(r.grupo){ const g=E.grupos[r.grupo[0]]; if(!g||g.aprob<r.grupo[1]) faltan.push("necesitas apoyo de "+GRUPO_POR_ID[r.grupo[0]].n); }
  if(r.estatuto&&E.estatutos[r.estatuto[0]]!==r.estatuto[1]) faltan.push("requiere otro estatuto");
  return {ok:faltan.length===0,txt:faltan.join(" · ")};
}
function textoRequisitos(op){
  const r=op.req; if(!r) return "";
  const p=[];
  if(r.plata) p.push(plata(r.plata));
  if(r.capital) p.push(r.capital+" de capital institucional");
  if(r.grupo) p.push("apoyo de "+GRUPO_POR_ID[r.grupo[0]].n);
  return p.length?("Requiere: "+p.join(" · ")):"";
}
/* Resolución oculta: pesa el estado, no el dado */
function resolverDecision(dec,idx){
  const op=dec.op[idx];
  const chk=requisitoCumplido(op); if(!chk.ok) return null;
  let score=58;
  score-=(op.dif||40)*0.55;
  const capEf=Math.min(120,E.capital);   /* el capital ya no tiene tope, pero su efecto sí */
  const rel={institucional:capEf,refuerzos:E.ind.prestigio,finanzas:100-clamp(E.deuda/40,0,70),
    camarin:E.ind.moral,preparacion:E.ind.plantel,hinchada:E.ind.hinchada,cantera:E.ind.cantera,
    prensa:E.rep.prensa,gris:E.rep.dureza};
  const base=rel[dec.buzon]!=null?rel[dec.buzon]:55;
  score+=(base-50)*0.30;
  score+=(capEf-45)*0.12;
  score+=apoyoPonderado(dec.posturas)*0.10;
  score+=(E.rep.credibilidad-50)*0.10;
  score-=Math.max(0,E.ind.riesgo-45)*0.20;
  score+=rnd(-11,11);
  const tier=score>=58?"bien":(score>=40?"mitad":"mal");
  const res=op[tier]||op.mitad||op.bien;

  if(op.ef) aplicarEfectos(op.ef);
  if(op.grupos) aplicarGrupos(op.grupos);
  if(op.rep) aplicarRep(op.rep);
  if(res.ef) aplicarEfectos(res.ef);
  if(res.grupos) aplicarGrupos(res.grupos);
  if(res.rep) aplicarRep(res.rep);
  (res.mods||[]).forEach(agregarMod);
  aplicarBanderas(op); aplicarBanderas(res);
  agendarEncadena(op.encadena); agendarEncadena(res.encadena);
  const accion=res.accion||op.accion;
  let extra=accion?ejecutarAccion(accion,dec):"";

  if(dec.op.some(o=>o.hist)){
    if(op.hist) E.coincidencias.push({anio:E.anio,t:dec.t});
    else E.divergencias.push({anio:E.anio,t:dec.t,elegido:op.t});
  }
  E.decHechas[dec.id+"_"+E.anio]={op:idx,tier:tier,txt:res.txt,t:op.t,hist:!!op.hist,extra:extra};
  E.decPend=E.decPend.filter(x=>x.id!==dec.id);
  if(E.decProc&&E.decProc[dec.id]) delete E.decProc[dec.id];
  guardar();
  return {tier:tier,txt:res.txt,extra:extra,hist:!!op.hist};
}
/* ---------------- acciones especiales ---------------- */
/* 6.17 · ata el nombre del jugador a la carta para que la consecuencia toque a ESE jugador */
function atarFicha(dec,j){ if(dec&&j) dec.ficha={n:j.n}; return dec; }
function ejecutarAccion(a,dec){
  const [nombre,arg]=a.split(":");
  switch(nombre){
    case "venderFicha":{  /* vende al jugador que NOMBRA la carta (ficha snapshoteada), no al más caro */
      const nom=(dec&&dec.ficha&&dec.ficha.n)||arg;
      const j=(E.plantel||[]).find(x=>x.n===nom&&!x.vendido);
      if(!j) return "";
      return venderJugador(j);
    }
    case "venderNombre":{  /* nombre baked en la acción (venderNombre:Iván Román) */
      const j=(E.plantel||[]).find(x=>x.n===arg&&!x.vendido);
      if(!j) return "";
      return venderJugador(j);
    }
    case "lesionFicha":{  /* lesiona al jugador que nombra la carta (ficha) */
      const nom=dec&&dec.ficha&&dec.ficha.n;
      const j=(E.plantel||[]).find(x=>x.n===nom&&!x.vendido);
      if(!j) return ""; j.lesion=ri(2,4);
      return j.n+" volvió tocado y queda unas semanas afuera.";
    }
    case "cansarFicha":{  /* el jugador de la ficha vuelve con la forma baja */
      const nom=dec&&dec.ficha&&dec.ficha.n;
      const j=(E.plantel||[]).find(x=>x.n===nom&&!x.vendido);
      if(!j) return ""; j.forma=clamp((j.forma||70)-12,20,99);
      return j.n+" volvió cansado de la gira, con la forma justa.";
    }
    case "lesionAlAzar":{
      const sanos=E.plantel.filter(j=>!j.lesion&&!j.vendido);
      if(!sanos.length) return "";
      const j=elige(sanos); j.lesion=ri(2,6);
      return j.n+" queda fuera unas semanas por lesión.";
    }
    case "lesionAToken":{  /* lesiona al MISMO jugador que nombra el texto (continuidad) */
      let j=jugadorPorToken(arg,E);
      if(!j||j.vendido){ const sanos=E.plantel.filter(x=>!x.lesion&&!x.vendido); if(!sanos.length) return ""; j=elige(sanos); }
      j.lesion=ri(3,7);
      return j.n+" recayó y queda fuera unas semanas. Te lo habían advertido.";
    }
    case "venderTitular":{
      const l=E.plantel.filter(j=>!j.vendido).sort((a,b)=>b.valor-a.valor);
      if(!l.length) return "";
      const j=l[ri(0,Math.min(2,l.length-1))];
      return venderJugador(j);
    }
    case "venderToken":{
      const j=jugadorPorToken(arg,E); if(!j) return "";
      return venderJugador(j);
    }
    case "marcarVentaFutura":{
      const j=jugadorPorToken(arg,E); if(!j) return "";
      j.ventaFin=true; return j.n+" seguirá hasta fin de temporada y después se va.";
    }
    case "mejorarToken":{
      const j=jugadorPorToken(arg,E); if(!j) return "";
      j.sueldo=Math.round(j.sueldo*1.4); j.moral=clamp(j.moral+15,0,100);
      return j.n+" renovó con mejor contrato.";
    }
    case "ficharTres":{
      return "Refuerzos incorporados al plantel.";
    }
    case "ficharLibre":{
      const rr=azarFijo(semilla("libre"+E.anio+E.idx));
      const j=generarJugador(rr,E.ind.plantel+4,elige(["DEF","VOL","DEL"]),ri(26,32));
      j.contrato.hasta=E.anio+2; E.plantel.push(j);
      return "Se incorpora "+j.n+" ("+j.pos+", nivel "+j.nivel+").";
    }
    case "subirJuvenil":{
      const rr=azarFijo(semilla("juv"+E.anio+E.idx));
      const j=generarJugador(rr,E.ind.cantera*0.8+10,elige(["DEF","VOL","DEL"]),ri(17,20));
      j.proy=clamp(j.proy+12,40,96); j.contrato.hasta=E.anio+4; j.rasgos=["de la cantera"];
      E.plantel.push(j);
      return "Sube al primer equipo "+j.n+" ("+j.edad+" años, proyección "+j.proy+").";
    }
    case "perderPuntos":{ E.temporada.pts=Math.max(0,E.temporada.pts-2); return "Se pierde una fecha por no presentarse."; }
    case "cisma":{
      E.flags.cisma=true;
      aplicarEfectos({socios:-25,hinchada:-20,prestigio:-10});
      return "Un grupo de socios funda un club nuevo con el nombre y los colores originales. Desde ahora son tus enemigos.";
    }
    case "limpiaBandera":{
      if(arg) delete E.flags[arg];
      return "";
    }
    case "limpiaDesfalco":{
      E.flags.desfalco=0; E.flags.investigacionAbierta=false;
      return "Se regularizaron los fondos y se cierra la causa.";
    }
    case "cierraInvestigacion":{
      E.flags.investigacionAbierta=false;
      return "La investigación se archiva por ahora.";
    }
    case "camadaBorghi":{
      E.flags.camadaBorghi=true;
      E.ind.cantera=clamp(E.ind.cantera+8,0,100);
      if(typeof PLANTEL_CC_2006==="undefined") return "Aparece una generación dorada en las inferiores.";
      const joyas=["Matías Fernández","Arturo Vidal","Alexis Sánchez","Jorge Valdivia","Humberto Suazo"];
      const sumados=[];
      PLANTEL_CC_2006.filter(a=>joyas.indexOf(a[0])>=0).forEach(a=>{
        if(E.plantel.some(j=>j.n===a[0]&&!j.vendido)) return;
        const j=jugadorDesde(a); j.contrato.hasta=E.anio+4; j.real=true; E.plantel.push(j); sumados.push(j.n);
      });
      return sumados.length?("Irrumpen desde las inferiores: "+sumados.join(", ")+". Proyección de venta al extranjero.") :"Aparece una generación dorada en las inferiores.";
    }
  }
  return "";
}
/* 6.10 · caras largas: reconquistar jugadores descontentos con plata */
function jugadoresDescontentos(){
  return E.plantel.filter(j=>!j.vendido&&!j.cedido&&(j.moral||70)<55).sort((a,b)=>(a.moral||70)-(b.moral||70));
}
function costoReconquista(j){ return Math.round(30+(j.valor||100)*0.05+(j.nivel||60)*0.6); }
function reconquistarJugador(j){
  const costo=costoReconquista(j);
  if(E.plata<costo) return {ok:false,msg:"No te alcanza la caja ("+plata(costo)+")"};
  aplicarEfectos({plata:-costo});
  j.moral=clamp((j.moral||70)+ri(22,32),0,100);
  aplicarGrupos({camarin:4});
  if(typeof recordar==="function") recordar("camarin","le pusiste un plus para reconquistar a "+j.n,{quien:j.n,peso:"bajo",tono:"bueno"});
  E.flags.reconquistas=(E.flags.reconquistas||0)+1;
  if(E.flags.reconquistas>=3 && typeof desbloquear==="function") desbloquear("reconquista");
  return {ok:true,costo:costo};
}
function venderJugador(j,monto){
  monto=monto||Math.round(j.valor*rnd(.75,1.2));
  j.vendido=true; j.estado="vendido";
  E.plata+=monto;
  E.ind.plantel=clamp(E.ind.plantel-Math.round(j.nivel/14),0,100);
  E.mercadoLog=E.mercadoLog||{}; E.mercadoLog.vendidos=E.mercadoLog.vendidos||[];
  E.mercadoLog.vendidos.push({n:j.n,monto:monto,anio:E.anio});
  const simbolo=j.rasgos&&(j.rasgos.indexOf("ídolo")>=0||j.rasgos.indexOf("de la casa")>=0);
  if(simbolo){
    aplicarGrupos({hinchada:-12});
    if(typeof postProc==="function"&&typeof HANDLES_HINCHA!=="undefined")
      postProc(elige(HANDLES_HINCHA),"hincha","Venden a "+j.n+", un símbolo del club. A la gente esto no le entra.","malo");
    /* 6.21 · si le habías jurado a la barra que no lo vendías, rompés el pacto */
    if(typeof romperPacto==="function") romperPacto("Vendiste a "+j.n+", que habías jurado no tocar.",j.n);
  }
  if(typeof recordar==="function") recordar("venta","vendiste a "+j.n+" por "+plata(monto),
    {quien:j.n,peso:(simbolo||j.nivel>=80)?"alto":"medio",tono:"riesgo"});
  if(typeof notificar==="function") notificar({t:"Se fue "+j.n,tipo:"malo",bandeja:true,
    d:"Se vendió a "+j.n+" ("+j.pos+") por "+plata(monto)+". "+(simbolo?"Un símbolo del club: la hinchada lo va a sentir.":"El plantel pierde una pieza.")});
  return "Se fue "+j.n+" por "+plata(monto)+".";
}
/* ---------------- economía ---------------- */
function planillaAnual(){ return E.plantel.filter(j=>!j.vendido&&!j.cedido).reduce((s,j)=>s+j.sueldo,0); }

/* Sectores del estadio: cada uno con su cuota de aforo, precio de referencia y
   elasticidad (la galería es la más sensible al precio; la marquesina, la que
   menos). El jugador fija el precio de cada sector con sliders en Finanzas. */
const SECTORES=[
 {id:"galeria",   n:"Galería popular", ic:"🎉", cuota:0.55, ref:1200, elast:1.5, min:300,  max:5000},
 {id:"tribuna",   n:"Tribuna",         ic:"🪑", cuota:0.33, ref:2500, elast:1.0, min:800,  max:9000},
 {id:"marquesina",n:"Marquesina",      ic:"🥂", cuota:0.12, ref:6000, elast:0.6, min:2000, max:22000}
];
function preciosDefault(){
  const f=(typeof inflacionEra==="function"&&E)?inflacionEra():1;
  const o={}; SECTORES.forEach(s=>o[s.id]=Math.round(s.ref*f)); return o;
}
function ocupBase(part){
  let o=0.30+E.ind.hinchada/220+E.ind.estadio/500;
  if(part){ if(part.tipo==="copa") o+=0.20; if(part.ronda==="FINAL"||part.ronda==="Semifinal") o+=0.18; }
  if(E.temporada&&E.temporada.pts>E.temporada.pj*1.6) o+=0.08;
  o+=modSuma("local")/100;
  o*=(1+(modSuma("taquilla")||0));
  return o;
}
/* deuda alta → se clausuran sectores del estadio y cae el aforo disponible */
function clausuraFactor(){ return E.deuda>4000?0.75:(E.deuda>3000?0.90:1); }
function taquilla(part){
  const club=CLUB_POR_ID[E.club]||{aforo:30000};
  const base=ocupBase(part);
  const infl=(typeof inflacionEra==="function")?inflacionEra():1;
  const precios=E.precios||preciosDefault();
  const clau=clausuraFactor();
  let gente=0, ingreso=0;
  SECTORES.forEach(s=>{
    const cap=Math.round(club.aforo*s.cuota*clau*(E.ind.estadio/100*0.4+0.6));
    const precio=precios[s.id]||Math.round(s.ref*infl);
    const factorPrecio=Math.pow((s.ref*infl)/Math.max(1,precio), s.elast);
    const ocup=clamp(base*factorPrecio, 0.04, 0.99);
    const g=Math.round(cap*ocup);
    gente+=g; ingreso+=g*precio;
  });
  return {gente:gente, ingreso:Math.round(ingreso/1000000)};
}
/* 6.3 · desglose por butaca (para documentar aforo, precio y ganancia estimada de cada sector) */
function taquillaPorSector(part){
  const club=CLUB_POR_ID[E.club]||{aforo:30000};
  const base=ocupBase(part);
  const infl=(typeof inflacionEra==="function")?inflacionEra():1;
  const precios=E.precios||preciosDefault();
  const clau=clausuraFactor();
  return SECTORES.map(s=>{
    const cap=Math.round(club.aforo*s.cuota*clau*(E.ind.estadio/100*0.4+0.6));
    const precio=precios[s.id]||Math.round(s.ref*infl);
    const factorPrecio=Math.pow((s.ref*infl)/Math.max(1,precio), s.elast);
    const ocup=clamp(base*factorPrecio, 0.04, 0.99);
    const g=Math.round(cap*ocup);
    return {id:s.id, n:s.n, ic:s.ic, cap:cap, precio:precio, gente:g, ocup:Math.round(ocup*100),
      ingreso:Math.round(g*precio/1000000)};
  });
}
function ingresoPartidoLocal(part){ return taquilla(part); }
/* proyección para la UI: taquilla de un partido de local "tipo" con precios dados */
function proyeccionTaquilla(precios){
  const guard=E.precios; if(precios) E.precios=precios;
  const r=taquilla({tipo:"liga"});
  E.precios=guard; return r;
}
function precioPromedioRatio(){
  const infl=(typeof inflacionEra==="function")?inflacionEra():1;
  const precios=E.precios||preciosDefault();
  let num=0,den=0; SECTORES.forEach(s=>{ num+=(precios[s.id]/(s.ref*infl))*s.cuota; den+=s.cuota; });
  return den?num/den:1;
}
function ingresosAnuales(){
  const tv=(120+E.ind.prestigio*3)*(1+(modSuma("tv")||0));
  const spo=(90+E.ind.prestigio*3.5)*(1+(modSuma("sponsor")||0));
  const soc=(E.ind.socios*10)*(1+(modSuma("ingresoSocios")||0));
  const dig=(typeof ingresoDigital==="function")?ingresoDigital():0;
  return {tv:Math.round(tv),sponsors:Math.round(spo),socios:Math.round(soc),digital:dig};
}
function egresosAnuales(){
  const planilla=planillaAnual();
  const oper=Math.round(100+E.ind.prestigio*2+E.ind.estadio*5+E.ind.hinchada*2);
  const inter=Math.round(E.deuda*(0.16+modSuma("interes")));
  return {planilla:planilla,operacion:oper,intereses:inter};
}
function costoSemanal(){
  const e=egresosAnuales();
  return Math.round((e.planilla+e.operacion+e.intereses)/40);
}
function ingresoSemanal(){
  const i=ingresosAnuales();
  return Math.round((i.tv+i.sponsors+i.socios+(i.digital||0))/40);
}
function aplicarEstatutosMod(){
  ESTATUTOS.forEach(cat=>{
    const opId=E.estatutos[cat.id]; if(!opId) return;
    const op=cat.op.find(o=>o.id===opId); if(!op||!op.mod) return;
    for(const k in op.mod){
      const id="est_"+cat.id;
      let m=E.mods.find(x=>x.id===id);
      if(!m){ m={id:id,n:"Estatuto: "+op.n,hasta:9999,ef:{}}; E.mods.push(m); }
      m.n="Estatuto: "+op.n; m.ef=Object.assign({},op.mod);
    }
  });
}
/* ---------------- paso del tiempo ---------------- */
function decisionesBloqueantes(){
  return E.decPend.filter(x=>x.peso==="alto");
}
function proximoPartido(){ return E.calendario[E.idx]||null; }
function tickSemana(){
  /* plata que entra y sale entre partido y partido */
  const neto=ingresoSemanal()-costoSemanal();
  aplicarEfectos({plata:neto});
  if(typeof actualizarBolsa==="function") actualizarBolsa();
  if(typeof gestionTesorero==="function") gestionTesorero();
  /* plata personal del DT: entra su sueldo del cargo (menos si renunció por redención) */
  if(E.personal && typeof ingresoPersonalSemanal==="function"){ E.personal.bolsillo=Math.max(0,Math.round(E.personal.bolsillo+ingresoPersonalSemanal())); }
  /* Vida 3.0: la relación se enfría si no la cuidás; el bienestar deriva y sufre con la mala racha */
  if(E.perfil){
    if(E.perfil.pareja) E.perfil.pareja.nivel=clamp((E.perfil.pareja.nivel||65)-(E.perfil.pareja.casades?0.4:0.9),0,100);
  if(typeof tickFamilia==="function") tickFamilia();
    if(E.perfil.bienestar===undefined) E.perfil.bienestar=70;
    E.perfil.bienestar=clamp(E.perfil.bienestar+(58-E.perfil.bienestar)*0.05-((E.temporada&&E.temporada.sinGanar>=3)?1.5:0),0,100);
  }
  E.plantel.forEach(j=>{ if(j.lesion>0) j.lesion--; });
  /* deriva natural */
  if(E.ind.riesgo>0&&Math.random()<0.3) E.ind.riesgo=clamp(E.ind.riesgo-1,0,100);
  /* impacto tangible de las finanzas: sueldos atrasados y estadio clausurado */
  if(E.plata<50 && E.deuda>1500){
    aplicarEfectos({moral:-2});
    if(!E.flags.sueldosAtrasados){ E.flags.sueldosAtrasados=true;
      notificar({t:"Sueldos atrasados",tipo:"malo",d:"La caja no cubre la planilla. El plantel lo siente: la moral baja semana a semana hasta que se regularice.",bandeja:false}); }
  } else if(E.flags.sueldosAtrasados && E.plata>200){ E.flags.sueldosAtrasados=false;
    notificar({t:"Sueldos al día",tipo:"bueno",d:"Se regularizaron los pagos. El camarín respira.",bandeja:false}); }
  if(E.deuda>4000 && !E.flags.clausura){ E.flags.clausura=true;
    notificar({t:"Clausura parcial del estadio",tipo:"malo",d:"Con la deuda por las nubes, se clausuraron sectores por garantías impagas: baja el aforo disponible y la taquilla.",bandeja:false}); }
  else if(E.deuda<=3500 && E.flags.clausura){ E.flags.clausura=false; }
  /* precios: caros molestan a la hinchada, baratos la enamoran (de a poco) */
  const ratio=precioPromedioRatio();
  if(ratio>1.35 && Math.random()<0.5) E.ind.hinchada=clamp(E.ind.hinchada-1,0,100);
  else if(ratio<0.8 && Math.random()<0.5) E.ind.hinchada=clamp(E.ind.hinchada+1,0,100);
  const gh=E.grupos&&E.grupos.hinchada, gs=E.grupos&&E.grupos.socios;
  if(gh&&gs&&gh.aprob<-45&&gs.aprob<-45){
    E.flags.semanasCensura=(E.flags.semanasCensura||0)+1;
    if(E.flags.semanasCensura===1){
      notificar({t:"Asamblea extraordinaria",tipo:"malo",
        d:"Hinchada y socios están juntos en contra. Si no revertís el clima en dos semanas, hay moción de censura.",bandeja:true});
    } else if(E.flags.semanasCensura>=3 && typeof destituir==="function"){
      destituir("moción de censura de socios e hinchada");
    }
  } else E.flags.semanasCensura=0;
  return neto;
}
function umbralEvento(){
  /* histórico: mundo más estable · libre: ruido medio · caos: casi no hay semana muerta */
  const m=(E&&E.modo)||"historico";
  if(m==="caos") return 0.18;
  if(m==="libre") return 0.32;
  return 0.48;
}
function tirarEvento(){
  const posibles=EVENTOS.filter(ev=>ev.peso(E)>0);
  if(!posibles.length||Math.random()>umbralEvento()) return null;
  const ev=eligePeso(posibles,x=>x.peso(E));
  if(!ev) return null;
  if(ev.op) return {tipo:"decision",ev:ev};
  if(ev.ef) aplicarEfectos(ev.ef);
  if(ev.grupos) aplicarGrupos(ev.grupos);
  if(ev.rep) aplicarRep(ev.rep);
  let extra=ev.accion?ejecutarAccion(ev.accion,ev):"";
  const txt=resolverTokens(ev.d,E).replace("{JUGADOR}",(elige(E.plantel.filter(j=>!j.vendido))||{n:"un jugador"}).n);
  const item=notificar({t:ev.t,d:txt,extra:extra,tipo:ev.tipo});
  return {tipo:"aviso",item:item};
}
function crisisActiva(){
  for(const c of CRISIS){ if(!E.flags["crisis_"+c.id]&&c.dispara(E)) return c; }
  return null;
}
/* ---------------- fin de temporada ---------------- */
function finDeTemporada(){
  const t=E.temporada;
  const pos=posicionEnTabla();
  const campeon=pos===1;
  if(typeof dividendoBolsa==="function") dividendoBolsa(pos);
  if(typeof desbloquear==="function"){
    if(campeon && E.ind.prestigio<55) desbloquear("campeon_chico");
    if(E.plata>0 && (E.flags.desfalco||0)<=0) desbloquear("caja_sana");
  }
  /* premios */
  let premio=[0,420,260,180,120][Math.min(4,pos)]||70;
  aplicarEfectos({plata:premio});
  if(campeon){ E.titulos.push(E.anio+" · Campeón del Campeonato Nacional"); aplicarEfectos({prestigio:7,hinchada:7,moral:6}); aplicarRep({publica:8,credibilidad:6});
    if(typeof recordar==="function") recordar("titulo","saliste campeón nacional en "+E.anio,{peso:"alto",tono:"bueno"}); }
  /* copa */
  const copa=E.calendario.filter(p=>p.tipo==="copa");
  const copaGanada=E.flags.copaCampeon;
  if(copaGanada){ E.titulos.push(E.anio+" · Copa Libertadores"); aplicarEfectos({prestigio:14,plata:600,hinchada:10}); aplicarRep({publica:14,credibilidad:10});
    if(typeof recordar==="function") recordar("titulo","levantaste la Copa Libertadores con "+E.clubNombre,{peso:"alto",tono:"bueno"}); }
  /* evaluación del mandato */
  const ev=evaluarMandato(pos,campeon,copaGanada);
  /* balance y crónica */
  guardarHistorial(pos,campeon,copaGanada);
  E.cronica.unshift({anio:E.anio,pos:pos,pts:t.pts,campeon:campeon,copa:copaGanada?"Campeón":null,
    plata:Math.round(E.plata),deuda:Math.round(E.deuda),ev:ev});
  notificar({t:"Balance "+E.anio+": "+(copaGanada?"Campeón de América":campeon?"Campeón nacional":ordinal(pos)+" en el Nacional"),
    tipo:(campeon||copaGanada)?"bueno":(pos<=5?"neutro":"malo"),
    d:"Terminó la temporada "+E.anio+" en el "+ordinal(pos)+" lugar con "+t.pts+" puntos ("+t.pg+"G "+t.pe+"E "+t.pp+"P). "+
      "Premios de competencia: "+plata(premio)+". "+ev.txt,bandeja:false});
  return {pos:pos,campeon:campeon,copa:copaGanada,premio:premio,ev:ev};
}
function posicionEnTabla(){
  const arr=LIGA_ACT.map(c=>({id:c.id,...E.tabla[c.id]}));
  arr.sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf);
  return arr.findIndex(x=>x.id===E.club)+1;
}
function nuevoAnio(){
  E.anio++;
  limpiarMods();
  /* envejecer plantel y aplicar salidas
     6.32 · el desarrollo SIGUE LO QUE HICISTE: un joven que jugó mucho y bien crece
     hacia su proyección; uno al que no le diste minutos (banca, lesiones, mal rendimiento)
     se estanca o baja. Nada queda congelado: la decisión de hacerlo jugar tiene consecuencia. */
  E.plantel=E.plantel.filter(j=>!j.vendido&&!j.ventaFin);
  const evol=[];
  E.plantel.forEach(j=>{
    j.edad++;
    const min=j.minutosTemporada||0, formaFin=j.forma||60, proy=j.proy||j.nivel;
    const margen=proy-j.nivel;                    /* cuánto le queda por crecer */
    const jugoMucho=min>=1200, jugoAlgo=min>=400;  /* ~13+ / ~4+ partidos completos */
    let delta=0;
    if(j.edad<=23){
      if(jugoMucho) delta=ri(2,5)+(formaFin>=72?2:0)+(margen>4?1:0);
      else if(jugoAlgo) delta=ri(0,3);
      else delta=ri(-3,1);                         /* casi no jugó → se estanca o retrocede */
      if(formaFin<55) delta-=2;                    /* le fue mal → crece mucho menos */
      delta=Math.min(delta,Math.max(0,margen)+2);  /* no se dispara sobre su techo */
    } else if(j.edad<=28){
      delta=jugoMucho?ri(-1,2):ri(-3,0);
    } else if(j.edad>=30){
      delta=-ri(1,4)-(jugoMucho?0:1);              /* veterano que no sumó minutos, cae más */
    } else {
      delta=jugoMucho?ri(-1,1):ri(-2,0);
    }
    const antes=j.nivel;
    j.nivel=clamp(j.nivel+delta,20,97);
    if(j.edad<=24 && Math.abs(j.nivel-antes)>=3) evol.push({n:j.n,d:j.nivel-antes,niv:j.nivel,min:min});
    j.goles=0;j.partidos=0;j.tarjetas=0;j.lesion=0;j.forma=68;j.minutosTemporada=0;
  });
  /* contale al jugador que el desarrollo tuvo que ver con lo que hizo */
  const sube=evol.filter(x=>x.d>0).sort((a,b)=>b.d-a.d)[0];
  const baja=evol.filter(x=>x.d<0).sort((a,b)=>a.d-b.d)[0];
  if(sube||baja){
    let d="";
    if(sube) d+="📈 "+sube.n+" dio el salto (+"+sube.d+" → "+sube.niv+"): los minutos que le diste rindieron. ";
    if(baja) d+="📉 "+baja.n+" retrocedió ("+baja.d+" → "+baja.niv+"): "+(baja.min<400?"casi no jugó y se estancó.":"le costó el año.");
    notificar({t:"Cómo maduraron los jóvenes",tipo:"neutro",bandeja:false,d:d.trim()});
  }
  /* vuelven los cedidos, mejorados por el rodaje */
  const vueltos=[];
  E.plantel.forEach(j=>{
    if(j.cedido && j.cedido.hasta<=E.anio){
      const boost=ri(3,8); j.nivel=clamp(j.nivel+boost,20,97); j.proy=clamp(Math.max(j.proy,j.nivel+2),28,97);
      vueltos.push(j.n+" (+"+boost+" → "+j.nivel+")"); j.cedido=null;
    }
  });
  if(vueltos.length) notificar({t:"Vuelven los cedidos",tipo:"bueno",d:"Regresan del préstamo con más rodaje: "+vueltos.join(", ")+".",bandeja:false});
  /* retiros: los muy veteranos cuelgan los botines y suben regens de la cantera */
  const retirados=E.plantel.filter(j=>j.edad>=37);
  if(retirados.length){
    E.plantel=E.plantel.filter(j=>j.edad<37);
    retirados.forEach(j=>{
      const rr=azarFijo(semilla("regen"+E.anio+j.n));
      const joven=generarJugador(rr, E.ind.cantera*0.8+12, j.pos, ri(17,20));
      joven.proy=clamp(joven.proy+10,40,95); joven.rasgos=["de la cantera"]; joven.contrato.hasta=E.anio+4;
      E.plantel.push(joven);
    });
    notificar({t:"Retiros y relevo generacional",tipo:"neutro",
      d:"Colgaron los botines: "+retirados.map(j=>j.n+" ("+j.edad+" años)").join(", ")+
        ". Suben juveniles de la cantera para ocupar su lugar.",bandeja:false});
  }
  while(E.plantel.length<20){
    const rr=azarFijo(semilla("relleno"+E.anio+E.plantel.length));
    E.plantel.push(generarJugador(rr,E.ind.plantel-6,elige(["DEF","VOL","DEL","ARQ"])));
  }
  E.ind.plantel=clamp(Math.round(mediaPlantel()),0,100);
  E.ind.moral=clamp(Math.round(E.ind.moral+(55-E.ind.moral)*0.25),0,100);
  E.capital=Math.max(0,Math.round(E.capital+capitalAnual()));
  /* el fútbol olvida: nadie te quiere ni te odia para siempre */
  for(const k in E.rep) E.rep[k]=Math.round(E.rep[k]+(50-E.rep[k])*0.12);
  GRUPOS.forEach(g=>{ const x=E.grupos[g.id]; x.aprob=Math.round(x.aprob*0.72); });
  E.temporada={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0,sinGanar:0};
  E.idx=0; E.decPend=[]; E.bandeja=[]; E.pendientesEncadenadas=[]; E.decProc={}; E.mercado=null; E.flags.copaCampeon=false;
  E.ofertasPend=[]; E.mercadoLog={rechazadas:{},vendidos:[]}; E.promesas=[];
  /* 5.0 · nuevas metas de la dirigencia para el año que arranca */
  E.flags.clasicoGanado=false;
  if(typeof generarObjetivos==="function") E.objetivos=generarObjetivos();
  notificar({t:"Arranca la temporada "+E.anio,tipo:"neutro",
    d:"Nuevo año, nuevo campeonato. El plantel se renovó, los objetivos se reajustan y la caja arranca de cero en lo semanal.",bandeja:false});
  /* banderas que solo valen dentro de una temporada */
  E.flags.rachaLiquida=false;
  /* 6.25 · limpiar TODOS los flags por-semana/idx (evita bugs de botones "ya usado" al reiniciar idx en el nuevo año) */
  ["medianoche_","conf_","entreno_","changa_","pasillo_","prometido_","tinderMentira","puertaBarra","feeTesoreroUlt"].forEach(pref=>{
    Object.keys(E.flags).forEach(k=>{ if(k.indexOf(pref)===0) delete E.flags[k]; });
  });
  E.calendario=construirCalendario(E.club,E.anio,E.anio===1992);
  reiniciarTabla();
  repartirDecisiones();
  if(typeof chequearSucesion==="function") chequearSucesion();
  guardar();
}
function mediaPlantel(){
  const l=E.plantel.filter(j=>!j.vendido&&!j.cedido).sort((a,b)=>b.nivel-a.nivel).slice(0,14);
  return l.reduce((s,j)=>s+j.nivel,0)/Math.max(1,l.length);
}
function capitalAnual(){
  let c=6;
  c+=aprobacionMedia()/12;
  c+=(E.ind.prestigio-55)/12;
  c+=(E.rep.credibilidad-50)/14;
  c+=modSuma("capitalAnual");
  return Math.round(clamp(c,-14,22));
}
/* ---------------- guardado ---------------- */
async function guardar(){
  if(!E) return;
  await Store.set(LLAVE,E);
  const n=(typeof document!=="undefined")?document.getElementById("guardadoTxt"):null;
  if(n) n.textContent="guardado "+new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"});
}
async function cargar(){ return await Store.get(LLAVE); }
