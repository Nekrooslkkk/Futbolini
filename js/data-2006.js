"use strict";
/* ============================================================
   FUTBOLINI 7.78 · data-2006.js
   PROMPT D · Modo histórico 2006 (Apertura + Clausura).
   19 clubes reales. Deportes Concepción FUE SUSPENDIDO 2006
   (problemas financieros) — no está. Wikipedia / ANFP.
   Plantel documentado: Colo-Colo (data-plantel.js) + UCH/AUD/UC (data-996.js).
   El resto: cantera. No se inventan nombres.
   Cargar DESPUÉS de liga-registrar.js y data-clubes-meta.js.
   ============================================================ */

/* 19 equipos. Cobreloa = CBL (no COB: en 2026 COB es Cobresal).
   Cobresal 2006 = CBS (id de 1991). */
const LIGA_2006=[
 /* fuente: Wikipedia Torneo Apertura 2006 (Chile) / Clausura 2006 */
 {id:"CC", n:"Colo-Colo",              c:"Colo-Colo",   fuerza:88, aforo:45000, est:"Estadio Monumental",            ciudad:"Santiago",      z:"A", esc:"⚫", fund:1925, dt:"Claudio Borghi"},
 {id:"UCH",n:"Universidad de Chile",   c:"U. de Chile", fuerza:80, aforo:47000, est:"Estadio Nacional",              ciudad:"Santiago",      z:"B", esc:"🔵", fund:1927},
 {id:"UC", n:"Universidad Católica",   c:"U. Católica", fuerza:78, aforo:20000, est:"San Carlos de Apoquindo",       ciudad:"Santiago",      z:"A", esc:"⚪", fund:1937},
 {id:"CBL",n:"Cobreloa",               c:"Cobreloa",    fuerza:77, aforo:12000, est:"Municipal de Calama",           ciudad:"Calama",        z:"A", esc:"🟠", fund:1977},
 {id:"AUD",n:"Audax Italiano",         c:"Audax",       fuerza:76, aforo:12000, est:"Municipal de La Florida",       ciudad:"Santiago",      z:"A", esc:"🟢", fund:1910},
 {id:"HUA",n:"Huachipato",             c:"Huachipato",  fuerza:75, aforo:10000, est:"Estadio CAP",                   ciudad:"Talcahuano",    z:"B", esc:"⚫", fund:1947},
 {id:"UDC",n:"Universidad de Concepción",c:"U. Concepción",fuerza:74,aforo:30000,est:"Estadio Collao",               ciudad:"Concepción",    z:"A", esc:"🟡", fund:1994},
 {id:"OHI",n:"O'Higgins",              c:"O'Higgins",   fuerza:73, aforo:14000, est:"Estadio El Teniente",           ciudad:"Rancagua",      z:"B", esc:"🟢", fund:1955},
 {id:"PMO",n:"Deportes Puerto Montt",  c:"Pto. Montt",  fuerza:70, aforo:10000, est:"Regional de Chinquihue",        ciudad:"Puerto Montt",  z:"B", esc:"🟢", fund:1983},
 {id:"COQ",n:"Coquimbo Unido",         c:"Coquimbo",    fuerza:69, aforo:18000, est:"Francisco Sánchez Rumoroso",    ciudad:"Coquimbo",      z:"B", esc:"🟡", fund:1958},
 {id:"SW", n:"Santiago Wanderers",     c:"Wanderers",   fuerza:68, aforo:18000, est:"Estadio Playa Ancha",           ciudad:"Valparaíso",    z:"A", esc:"🟢", fund:1892},
 {id:"UES",n:"Unión Española",         c:"U. Española", fuerza:67, aforo:18000, est:"Estadio Santa Laura",           ciudad:"Santiago",      z:"B", esc:"🔴", fund:1897},
 {id:"ANT",n:"Deportes Antofagasta",   c:"Antofagasta", fuerza:66, aforo:21000, est:"Regional Calvo y Bascuñán",    ciudad:"Antofagasta",   z:"B", esc:"🔵", fund:1966},
 {id:"EVE",n:"Everton",                c:"Everton",     fuerza:65, aforo:18000, est:"Estadio Sausalito",             ciudad:"Viña del Mar",  z:"B", esc:"🟡", fund:1909},
 {id:"LSE",n:"Deportes La Serena",     c:"La Serena",   fuerza:64, aforo:18000, est:"Estadio La Portada",            ciudad:"La Serena",     z:"B", esc:"🔴", fund:1955},
 {id:"CBS",n:"Cobresal",               c:"Cobresal",    fuerza:63, aforo:12000, est:"Estadio El Cobre",              ciudad:"El Salvador",   z:"A", esc:"🟠", fund:1979},
 {id:"RAN",n:"Rangers",                c:"Rangers",     fuerza:62, aforo:8000,  est:"Fiscal de Talca",               ciudad:"Talca",         z:"B", esc:"🔴", fund:1902},
 {id:"PAL",n:"Palestino",              c:"Palestino",   fuerza:61, aforo:8000,  est:"Municipal de La Cisterna",      ciudad:"Santiago",      z:"A", esc:"🟢", fund:1920},
 {id:"SMO",n:"Santiago Morning",       c:"S. Morning",  fuerza:58, aforo:5000,  est:"Santa Laura (arriendo)",        ciudad:"Santiago",      z:"A", esc:"⚫", fund:1909}
];

const FORMAT_2006={
  n:19,
  pts:3,
  nota:"Deportes Concepción suspendido 2006. 19 equipos (impar).",
  apertura:"Fase todos contra todos (18 fechas, un bye por club) + grupos + playoffs. Campeón: Colo-Colo vs U. de Chile (penales).",
  clausura:"Misma modalidad. Campeón: Colo-Colo 3-0 Audax Italiano (20 dic, Monumental).",
  descenso:"Tabla anual (Apertura+Clausura). Descendió Santiago Morning. Rangers y Palestino a liguilla de promoción.",
  copas:"Colo-Colo (Apertura) → Libertadores 2007. Huachipato y Colo-Colo → Sudamericana 2006.",
  goleadores:"Apertura: Humberto Suazo (CC) 19. Clausura: Leonardo Monje 17.",
  juego:"En el juego: Apertura 18 fechas (bye) + playoffs (repechaje a partido, luego cuartos/semis/final ida y vuelta). El Apertura regular NO entrega estrella: el título se define en los playoffs. Después, Clausura de otras 18 con tabla desde 0 y localías invertidas, otra vez con playoffs. Sin goles de visita: global empatado va a penales (en repechaje, clasifica el que trajo más puntos). Descenso: tabla anual. Planteles documentados: Colo-Colo, U. de Chile, Audax Italiano y Católica."
};

const HECHOS_2006={
  campeonA:"Colo-Colo (24° título) — final vs Universidad de Chile, penales. Goles de Matías Fernández en la vuelta.",
  campeonC:"Colo-Colo (25° título) — final 3-0 vs Audax Italiano (Fernández, Suazo, Meléndez).",
  dtCC:"Claudio Borghi. Empieza el tetracampeonato 2006-2007.",
  color:"Matías Fernández (falsa rabona) y Jorge Valdivia (tiro al vacío). Suazo goleador. Alexis Sánchez debuta en Primera con 17 años.",
  dco:"Deportes Concepción no juega 2006 por sanción económica. Vuelve en 2007."
};

const CLUB_INFO_2006={};
const IND_BASE_2006={};
const CAJA_BASE_2006={};
(function armar2006(){
  LIGA_2006.forEach(function(c){
    const f=c.fuerza||60;
    CLUB_INFO_2006[c.id]={
      n:c.n, esc:c.esc||"⚪", est:c.est, dt:c.dt||"el cuerpo técnico",
      ciudad:c.ciudad, colores:c.colores, fund:c.fund,
      desc:c.n+" en el Campeonato 2006 (Apertura y Clausura, 19 clubes). Stats aproximadas."
    };
    IND_BASE_2006[c.id]={
      plantel:Math.max(20,Math.min(95,Math.round(f))),
      moral:Math.round(55+(f-60)*0.2), hinchada:Math.round(40+(f-50)*0.7),
      socios:Math.round(30+(f-50)*0.5), cantera:Math.round(48+(f-60)*0.2),
      estadio:Math.round(40+(f-50)*0.4), prestigio:Math.round(40+(f-50)*0.8),
      riesgo:Math.round(50-(f-55)*0.2)
    };
    CAJA_BASE_2006[c.id]={ plata:Math.max(80,Math.round(200+(f-55)*8)), deuda:Math.max(40,Math.round(120+(f-55)*4)) };
  });
  CLUB_INFO_2006.CC.desc="Ciclo Borghi. Suazo, Mati Fernández, Valdivia, Vidal, Bravo, Alexis de 17. Campeón Apertura y Clausura 2006.";
  CLUB_INFO_2006.CC.dt="Claudio Borghi";
})();

function ids2006(){ return LIGA_2006.map(function(c){ return c.id; }); }
function esClub2006(id){ return ids2006().indexOf(id)>=0; }

function _fx2006(){
  const clubs=LIGA_2006.slice();
  if(clubs.length%2) clubs.push({id:"_BYE",n:"(libre)",fuerza:0,est:"",ciudad:""});
  return {clubs:clubs, fx:(typeof fixturesLiga==="function")?fixturesLiga(clubs):[]};
}
function _cal2006Rueda(clubId, ruedaFx, torneo, fase, fechas){
  const cal=[];
  ruedaFx.forEach(function(fecha,i){
    const pares=fecha.filter(function(p){ return p[0]!=="_BYE" && p[1]!=="_BYE" && p[0]!=="__BYE__" && p[1]!=="__BYE__"; });
    const mio=pares.find(function(p){ return p[0]===clubId||p[1]===clubId; });
    if(!mio) return;
    const local=mio[0]===clubId, rival=local?mio[1]:mio[0];
    const riv=LIGA_2006.filter(function(c){ return c.id===rival; })[0]
      || (typeof clubMundo==="function"?clubMundo(rival):null);
    if(!riv) return;
    const yo=LIGA_2006.filter(function(c){ return c.id===clubId; })[0];
    const f=fechas[i]||{m:Math.min(12, (fase==="clausura"?7:2)+Math.floor(i/4)), d:1+(i%4)*7};
    cal.push({tipo:"liga", torneo:torneo, fase:fase, fecha:i+1, rivalId:rival,
      rivalNombre:riv.n, fuerzaRival:riv.fuerza, local:local,
      sede:local?((yo&&yo.est)||"local"):riv.est,
      f:f, jugado:false,
      clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,"06"+fase+clubId+i):"despejado",
      jornada:pares});
  });
  return cal;
}
function tablaAnual2006(){
  if(typeof E==="undefined"||!E) return [];
  const a=E.tablaApertura||{}, b=E.tabla||{};
  const arr=LIGA_2006.map(function(c){
    const x=a[c.id]||{}, y=b[c.id]||{};
    return {
      id:c.id, n:c.n,
      pj:(x.pj||0)+(y.pj||0), pg:(x.pg||0)+(y.pg||0), pe:(x.pe||0)+(y.pe||0), pp:(x.pp||0)+(y.pp||0),
      gf:(x.gf||0)+(y.gf||0), gc:(x.gc||0)+(y.gc||0), pts:(x.pts||0)+(y.pts||0)
    };
  });
  arr.sort(function(p,q){ return q.pts-p.pts||((q.gf-q.gc)-(p.gf-p.gc))||q.gf-p.gf; });
  return arr;
}

/* ============================================================
   Playoffs 2006 estilo México.
   Fuente: Wikipedia «Torneo Apertura 2006 (Chile)» y «Torneo Clausura
   2006 (Chile)», consultadas 17 sep 2026.
   Modalidad: 4 grupos (3 de 5 + 1 de 4). Top 2 de cada grupo. Si un
   3° trae MÁS puntos que un 2° de otro grupo, repechaje a partido
   único en casa del mejor puntaje; empate → clasifica el de más pts.
   Cuartos/semis/final: ida y vuelta, 1° vs 8° según tabla general.
   El peor seed es local en la ida. SIN goles de visita; global
   empatado → penales.
   ============================================================ */
const GRUPOS_2006={
  apertura:{
    A:["UDC","AUD","UC","CBS","SW"],
    B:["UCH","LSE","EVE","COQ","SMO"],
    C:["CC","CBL","UES","ANT","PMO"],
    D:["HUA","OHI","PAL","RAN"]
  },
  clausura:{
    A:["CBL","CC","SW","PAL","CBS"],
    B:["OHI","COQ","RAN","HUA","UES"],
    C:["PMO","AUD","UDC","LSE","SMO"],
    D:["UC","UCH","ANT","EVE"]
  }
};
const FECHAS_PO_2006={
  apertura:{ repechaje:{m:6,d:9}, cuartos:[{m:6,d:13},{m:6,d:18}], semis:[{m:6,d:21},{m:6,d:25}], final:[{m:6,d:28},{m:7,d:2}] },
  clausura:{ repechaje:{m:11,d:22}, cuartos:[{m:11,d:25},{m:12,d:3}], semis:[{m:12,d:9},{m:12,d:16}], final:[{m:12,d:20},{m:12,d:23}] }
};
function _club06(id){
  var i, c;
  for(i=0;i<LIGA_2006.length;i++) if(LIGA_2006[i].id===id) return LIGA_2006[i];
  c=(typeof clubLookup==="function")?clubLookup(id):null;
  return c||{id:id,n:id,c:id,fuerza:50,est:""};
}
function _nom06(id){ var c=_club06(id); return c.c||c.n||id; }
function _fue06(id){ return _club06(id).fuerza||50; }
function _fila06(tab,id){
  var t=(tab&&tab[id])||{};
  return {id:id, pts:t.pts||0, gf:t.gf||0, gc:t.gc||0, pj:t.pj||0, pg:t.pg||0, pe:t.pe||0, pp:t.pp||0};
}
function _cmp06(a,b){
  if((b.pts||0)!==(a.pts||0)) return (b.pts||0)-(a.pts||0);
  var da=(a.gf||0)-(a.gc||0), db=(b.gf||0)-(b.gc||0);
  if(db!==da) return db-da;
  if((b.gf||0)!==(a.gf||0)) return (b.gf||0)-(a.gf||0);
  return _fue06(b.id)-_fue06(a.id);
}
function filasGrupo2006(letra, rueda, tab){
  var g=(GRUPOS_2006[rueda]||GRUPOS_2006.apertura)[letra]||[];
  var t=tab||((typeof E!=="undefined"&&E&&E.tabla)||{});
  var arr=g.map(function(id){
    var f=_fila06(t,id), c=_club06(id);
    f.n=c.n; f.c=c.c;
    return f;
  });
  arr.sort(_cmp06);
  return arr;
}
function clasificarPlayoffs2006(tab, rueda){
  tab=tab||{};
  rueda=rueda||"apertura";
  var letras=["A","B","C","D"];
  var primeros=[], segundos=[], terceros=[], i, fil, s, t;
  for(i=0;i<letras.length;i++){
    fil=filasGrupo2006(letras[i], rueda, tab);
    if(fil[0]) primeros.push(fil[0].id);
    if(fil[1]) segundos.push(fil[1].id);
    if(fil[2]) terceros.push(fil[2].id);
  }
  function asFila(id){ return _fila06(tab,id); }
  segundos.sort(function(a,b){ return _cmp06(asFila(a), asFila(b)); });
  terceros.sort(function(a,b){ return _cmp06(asFila(a), asFila(b)); });
  var segPeor=segundos.slice().reverse();
  var repechaje=[], usadosSeg={}, usadosTer={};
  for(i=0;i<segPeor.length && i<terceros.length;i++){
    s=segPeor[i]; t=terceros[i];
    if(!s||!t||usadosSeg[s]||usadosTer[t]) continue;
    if((asFila(t).pts||0)>(asFila(s).pts||0)){
      /* t (3°) tiene más pts que s (2°): t es local */
      repechaje.push({local:t, visita:s});
      usadosSeg[s]=1; usadosTer[t]=1;
    }
  }
  var directos=primeros.concat(segundos.filter(function(id){ return !usadosSeg[id]; }));
  return {primeros:primeros, segundos:segundos, terceros:terceros, directos:directos, repechaje:repechaje};
}
function _marcPO06(idLocal, idVisita, clave){
  if(typeof _marcadorEstable==="function") return _marcadorEstable(idLocal, idVisita, true, clave);
  if(typeof simularMarcadorFuerza==="function") return simularMarcadorFuerza(_fue06(idLocal), _fue06(idVisita), true);
  return [1,0];
}
function _penalesPO06(idA, idB, clave){
  var fa=_fue06(idA), fb=_fue06(idB), pA, r;
  if(typeof azarFijo==="function"&&typeof semilla==="function") r=azarFijo(semilla("po06pen|"+clave+"|"+idA+"|"+idB))();
  else r=Math.random();
  pA=0.5+(fa-fb)/220;
  return r<pA?idA:idB;
}
function _insertarPO06(nuevos){
  if(typeof _insertarYOrdenar==="function"){ _insertarYOrdenar(nuevos); return; }
  if(!E||!E.calendario||!nuevos) return;
  nuevos.forEach(function(p){ E.calendario.push(p); });
  E.calendario.sort(function(a,b){
    var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
    var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
    return oa-ob;
  });
  var j;
  for(j=0;j<E.calendario.length;j++) if(!E.calendario[j].jugado){ E.idx=j; break; }
}
function _partPO06(clubId, rivalId, local, f, rueda, ronda, fechaN){
  var yo=_club06(clubId), riv=_club06(rivalId);
  if(!yo||!riv||!rivalId) return null;
  return {
    tipo:"copa",
    torneo:rueda==="clausura"?"Playoffs Clausura 2006":"Playoffs Apertura 2006",
    ronda:ronda,
    fecha:fechaN||null,
    rivalId:rivalId, rivalNombre:riv.n, fuerzaRival:riv.fuerza||50,
    local:!!local, sede:local?(yo.est||"local"):(riv.est||""),
    f:f, jugado:false,
    clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,"po06"+rueda+ronda+clubId+(fechaN||0)):"despejado",
    fase:rueda==="clausura"?"playoffClausura":"playoffApertura"
  };
}
function _sembrarLlaveJugador06(rivalId, rueda, ronda, fechas, seedYo, seedRiv){
  var yoMejor=seedYo<seedRiv;
  var idaLocal=!yoMejor;
  var p1=_partPO06(E.club, rivalId, idaLocal, fechas[0], rueda, ronda, 1);
  var p2=_partPO06(E.club, rivalId, !idaLocal, fechas[1], rueda, ronda, 2);
  _insertarPO06([p1,p2].filter(Boolean));
}
function _seeds08(ids, tab){
  var arr=ids.map(function(id){ return _fila06(tab,id); });
  arr.sort(_cmp06);
  return arr.map(function(x){ return x.id; });
}
function _simLlave06(idMejor, idPeor, clave){
  /* peor seed local en la ida */
  var ida=_marcPO06(idPeor, idMejor, clave+"|ida");
  var vue=_marcPO06(idMejor, idPeor, clave+"|vue");
  var gPeor=ida[0]+vue[1], gMejor=ida[1]+vue[0], pens=false, gana;
  if(gMejor>gPeor) gana=idMejor;
  else if(gPeor>gMejor) gana=idPeor;
  else { pens=true; gana=_penalesPO06(idMejor, idPeor, clave); }
  return {ida:ida, vue:vue, gPeor:gPeor, gMejor:gMejor, gana:gana, pens:pens, localIda:idPeor, localVue:idMejor};
}
function _poSt(){
  if(typeof E==="undefined"||!E) return null;
  E.flags=E.flags||{};
  return E.flags.playoff2006||null;
}
function _tabRueda06(rueda){
  if(typeof E==="undefined"||!E) return {};
  if(rueda==="apertura" && E.tablaApertura && E.flags && E.flags.fase2006==="clausura") return E.tablaApertura;
  return E.tabla||{};
}

function _sembrarPlayoffs2006(rueda){
  if(typeof E==="undefined"||!E||E.eraBase!==2006) return;
  rueda=rueda||"apertura";
  var tab=_tabRueda06(rueda);
  var cl=clasificarPlayoffs2006(tab, rueda);
  var fechas=FECHAS_PO_2006[rueda]||FECHAS_PO_2006.apertura;
  E.flags=E.flags||{};
  if(rueda==="clausura" && E.flags.playoff2006 && E.flags.playoff2006.campeon){
    E.flags.campeonApertura2006=E.flags.playoff2006.campeon;
  }
  E.flags.fase2006=rueda==="clausura"?"playoffClausura":"playoffApertura";
  E.flags.playoff2006={
    rueda:rueda, directos:cl.directos.slice(), repechaje:cl.repechaje.slice(),
    repGanadores:[], clasificados:null, llaves:{}, campeon:null, ronda:"repechaje"
  };
  var yo=E.club;
  var enDir=cl.directos.indexOf(yo)>=0;
  var miRep=null, i, pair, gana, m, localSoy, p, txtDir, txtRep;
  txtDir=cl.directos.map(_nom06).join(", ");
  txtRep=cl.repechaje.map(function(x){ return _nom06(x.local)+" vs "+_nom06(x.visita); }).join(" · ");
  if(typeof notificar==="function"){
    notificar({t:"Playoffs "+(rueda==="clausura"?"Clausura":"Apertura")+" 2006", tipo:enDir||cl.repechaje.some(function(x){ return x.local===yo||x.visita===yo; })?"bueno":"neutro",
      d:"Clasifican directo: "+txtDir+"."+(cl.repechaje.length?(" Repechaje: "+txtRep+" (partido único, casa del de más puntos; empate → más pts de la regular)."):" Sin repechaje.")+" Sin goles de visita en las llaves. Fuente: Wikipedia 17 sep 2026."});
  }
  if(cl.repechaje.length){
    for(i=0;i<cl.repechaje.length;i++){
      pair=cl.repechaje[i];
      if(pair.local===yo||pair.visita===yo){ miRep=pair; continue; }
      m=_marcPO06(pair.local, pair.visita, "po06rep|"+rueda+"|"+pair.local+"|"+pair.visita);
      if(m[0]!==m[1]) gana=m[0]>m[1]?pair.local:pair.visita;
      else gana=pair.local; /* empate: el local trajo más pts */
      E.flags.playoff2006.repGanadores.push(gana);
    }
    if(miRep){
      localSoy=miRep.local===yo;
      p=_partPO06(yo, localSoy?miRep.visita:miRep.local, localSoy, fechas.repechaje, rueda, "Repechaje", 1);
      if(p) _insertarPO06([p]);
      return;
    }
  }
  _cerrarRepechaje06();
}
function _cerrarRepechaje06(){
  var st=_poSt(); if(!st) return;
  var rueda=st.rueda||"apertura";
  var ids=st.directos.concat(st.repGanadores||[]);
  var uniq=[], seen={}, i;
  for(i=0;i<ids.length;i++) if(ids[i]&&!seen[ids[i]]){ seen[ids[i]]=1; uniq.push(ids[i]); }
  uniq=uniq.slice(0,8);
  while(uniq.length<8){
    /* no debería pasar: relleno con 3°s restantes por tabla */
    break;
  }
  st.clasificados=_seeds08(uniq, _tabRueda06(rueda));
  st.ronda="cuartos";
  _sembrarCuartos06();
}
function _emparejar08(seeds){
  /* 1v8, 4v5, 2v7, 3v6 */
  var s=seeds||[];
  function par(a,b){ return {mejor:s[a], peor:s[b], seedMejor:a+1, seedPeor:b+1}; }
  return [par(0,7), par(3,4), par(1,6), par(2,5)].filter(function(p){ return p.mejor&&p.peor; });
}
function _sembrarRondaKO06(nombre, keyLlave, fechas, siguiente){
  var st=_poSt(); if(!st||!st.clasificados) return;
  if(st.llaves[keyLlave] && st.llaves[keyLlave].length && !st.llaves[keyLlave].some(function(x){ return x.pendiente; })){
    if(typeof siguiente==="function") siguiente();
    return;
  }
  var rueda=st.rueda||"apertura";
  var pares, i, par, sim, yoPar=null;
  if(nombre==="Cuartos") pares=_emparejar08(st.clasificados);
  else if(nombre==="Semifinal"){
    var qf=(st.llaves.cuartos||[]);
    /* winner 1v8 vs winner 4v5 ; winner 2v7 vs winner 3v6 */
    pares=[];
    if(qf[0]&&qf[1]) pares.push({mejor:qf[0].gana, peor:qf[1].gana, seedMejor:qf[0].seedGana||1, seedPeor:qf[1].seedGana||4});
    if(qf[2]&&qf[3]) pares.push({mejor:qf[2].gana, peor:qf[3].gana, seedMejor:qf[2].seedGana||2, seedPeor:qf[3].seedGana||3});
    pares.forEach(function(p){
      if(!p.mejor||!p.peor) return;
      if((p.seedMejor||99)>(p.seedPeor||99)){
        var tmp=p.mejor; p.mejor=p.peor; p.peor=tmp;
        tmp=p.seedMejor; p.seedMejor=p.seedPeor; p.seedPeor=tmp;
      }
    });
  } else {
    var sf=(st.llaves.semis||[]);
    var a=sf[0]&&sf[0].gana, b=sf[1]&&sf[1].gana;
    var sa=sf[0]&&sf[0].seedGana||1, sb=sf[1]&&sf[1].seedGana||2;
    if(a&&b){
      if(sa<sb) pares=[{mejor:a, peor:b, seedMejor:sa, seedPeor:sb}];
      else pares=[{mejor:b, peor:a, seedMejor:sb, seedPeor:sa}];
    } else pares=[];
  }
  st.llaves[keyLlave]=[];
  st.ronda=keyLlave;
  for(i=0;i<pares.length;i++){
    par=pares[i];
    if(par.mejor===E.club||par.peor===E.club){ yoPar=par; st.llaves[keyLlave].push({pendiente:true, mejor:par.mejor, peor:par.peor, seedMejor:par.seedMejor, seedPeor:par.seedPeor}); continue; }
    sim=_simLlave06(par.mejor, par.peor, "po06|"+rueda+"|"+nombre+"|"+par.mejor+"|"+par.peor);
    sim.seedGana=sim.gana===par.mejor?par.seedMejor:par.seedPeor;
    sim.mejor=par.mejor; sim.peor=par.peor;
    st.llaves[keyLlave].push(sim);
  }
  if(yoPar){
    var seedYo=yoPar.mejor===E.club?yoPar.seedMejor:yoPar.seedPeor;
    var seedRiv=yoPar.mejor===E.club?yoPar.seedPeor:yoPar.seedMejor;
    var riv=yoPar.mejor===E.club?yoPar.peor:yoPar.mejor;
    _sembrarLlaveJugador06(riv, rueda, nombre, fechas, seedYo, seedRiv);
    return;
  }
  /* el jugador no está en esta ronda: ya están simuladas → seguir */
  if(typeof siguiente==="function") siguiente();
}
function _sembrarCuartos06(){ var st=_poSt(); if(!st) return; var f=FECHAS_PO_2006[st.rueda]||FECHAS_PO_2006.apertura; _sembrarRondaKO06("Cuartos","cuartos", f.cuartos, _sembrarSemis06); }
function _sembrarSemis06(){ var st=_poSt(); if(!st) return; var f=FECHAS_PO_2006[st.rueda]||FECHAS_PO_2006.apertura; _sembrarRondaKO06("Semifinal","semis", f.semis, _sembrarFinal06); }
function _sembrarFinal06(){ var st=_poSt(); if(!st) return; var f=FECHAS_PO_2006[st.rueda]||FECHAS_PO_2006.apertura; _sembrarRondaKO06("Final","final", f.final, function(){ var ll=st.llaves.final||[]; _coronarPlayoff2006(st.rueda, ll[0]&&ll[0].gana); }); }

function _resolverPlayoffJugador2006(part, yo, otro){
  var st=_poSt(); if(!st||!part) return;
  var rueda=st.rueda||((part.fase==="playoffClausura")?"clausura":"apertura");
  var ronda=part.ronda||"";
  var riv=part.rivalId;
  var mismos=(E.calendario||[]).filter(function(p){
    return p.tipo==="copa"&&p.torneo===part.torneo&&p.ronda===ronda&&p.rivalId===riv;
  });
  if(mismos.some(function(p){ return !p.jugado; })){
    if(typeof notificar==="function") notificar({t:"Ida de "+ronda, tipo:"neutro",
      d:"Terminó "+yo+"-"+otro+". La llave se define en la vuelta. Sin goles de visita."});
    return;
  }
  var gf=0, gc=0;
  mismos.forEach(function(p){ gf+=p.gf||0; gc+=p.gc||0; });
  var gana=false, pens=false, motivo="";
  if(ronda==="Repechaje"){
    if(gf>gc){ gana=true; motivo="ganaste "+gf+"-"+gc; }
    else if(gf<gc){ gana=false; motivo="perdiste "+gf+"-"+gc; }
    else {
      /* empate: clasifica el de más pts en la regular (el local del repechaje) */
      var tab=_tabRueda06(rueda);
      gana=_cmp06(_fila06(tab,E.club), _fila06(tab,riv))<0;
      motivo="empataron "+gf+"-"+gc+". Clasifica el que trajo más puntos en la fase regular: "+(gana?_nom06(E.club):_nom06(riv));
    }
  } else {
    if(gf>gc){ gana=true; motivo="global "+gf+"-"+gc; }
    else if(gf<gc){ gana=false; motivo="global "+gf+"-"+gc; }
    else {
      pens=true;
      gana=_penalesPO06(E.club, riv, rueda+"|"+ronda+"|"+E.club+"|"+riv)===E.club;
      motivo="global "+gf+"-"+gc+". Sin goles de visita: se fue a penales. "+(gana?"Los ganaste.":"Los perdiste.");
    }
  }
  if(ronda==="Repechaje"){
    st.repGanadores=st.repGanadores||[];
    st.repGanadores.push(gana?E.club:riv);
    if(typeof notificar==="function") notificar({t:gana?"A cuartos":"Fuera en el repechaje", tipo:gana?"bueno":"malo", d:motivo+"."});
    _cerrarRepechaje06();
    if(!gana){
      /* el jugador quedó fuera: el cuadro CPU ya se simula en _sembrarCuartos → final */
    }
    return;
  }
  /* anotar la llave del jugador */
  var key=ronda==="Cuartos"?"cuartos":(ronda==="Semifinal"?"semis":"final");
  var arr=st.llaves[key]||[];
  var slot=null, i;
  for(i=0;i<arr.length;i++) if(arr[i].pendiente) slot=arr[i];
  if(slot){
    slot.pendiente=false;
    slot.gana=gana?E.club:riv;
    slot.seedGana=gana?(slot.mejor===E.club?slot.seedMejor:slot.seedPeor):(slot.mejor===riv?slot.seedMejor:slot.seedPeor);
    slot.gYo=gf; slot.gRiv=gc; slot.pens=pens;
  }
  if(typeof notificar==="function"){
    if(ronda==="Final"){
      /* corona abajo */
    } else {
      notificar({t:gana?("A "+(ronda==="Cuartos"?"semifinales":"la final")):("Eliminado en "+ronda), tipo:gana?"bueno":"malo", d:motivo+"."});
    }
  }
  if(ronda==="Cuartos"){
    if(gana) _sembrarSemis06();
    else _sembrarSemis06();
  } else if(ronda==="Semifinal"){
    _sembrarFinal06();
  } else if(ronda==="Final"){
    _coronarPlayoff2006(rueda, gana?E.club:riv);
  }
}
function _completarCuadro06(key){
  if(key==="semis") _sembrarSemis06();
  else if(key==="final") _sembrarFinal06();
}
function _coronarPlayoff2006(rueda, campeonId){
  if(typeof E==="undefined"||!E) return;
  E.flags=E.flags||{};
  E.flags.playoff2006=E.flags.playoff2006||{};
  if(E.flags.playoff2006._coronado) return;
  E.flags.playoff2006._coronado=true;
  E.flags.playoff2006.campeon=campeonId||null;
  rueda=rueda||E.flags.playoff2006.rueda||"apertura";
  try{
    var snap=JSON.parse(JSON.stringify(E.flags.playoff2006));
    if(rueda==="apertura") E.flags.cuadroApertura2006=snap;
    else E.flags.cuadroClausura2006=snap;
  }catch(e){}
  var etq=rueda==="clausura"?(E.anio+" · Clausura"):(E.anio+" · Apertura");
  var nom=_nom06(campeonId);
  if(campeonId && campeonId===E.club){
    if(E.titulos && E.titulos.indexOf(etq)<0) E.titulos.push(etq);
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:10,prestigio:8,plata:220});
    if(typeof notificar==="function") notificar({t:"🏆 CAMPEÓN del "+(rueda==="clausura"?"Clausura":"Apertura")+" 2006", tipo:"bueno",
      d:E.clubNombre+" levantó el "+(rueda==="clausura"?"Clausura":"Apertura")+" en playoffs. El regular no entregaba estrella: esta sí cuenta."});
  } else if(campeonId){
    if(typeof notificar==="function") notificar({t:"Campeón: "+nom, tipo:"neutro",
      d:nom+" se quedó con el "+(rueda==="clausura"?"Clausura":"Apertura")+" 2006 en los playoffs."});
  }
  if(rueda==="apertura") _sembrarClausura2006();
  else {
    E.flags.fase2006="cerrado";
    if(typeof notificar==="function") notificar({t:"Se acabó el 2006", tipo:"neutro",
      d:"Cerró el Clausura. El descenso se mira en la tabla anual (Apertura + Clausura). En la historia bajó Santiago Morning."});
  }
}

function _sembrarClausura2006(){
  if(typeof E==="undefined"||!E||E.eraBase!==2006) return;
  E.flags=E.flags||{};
  if(E.flags.fase2006==="clausura") return;
  E.flags.fase2006="clausura";
  E.tablaApertura=E.tabla?JSON.parse(JSON.stringify(E.tabla)):{};
  E.tabla={};
  LIGA_2006.forEach(function(c){ E.tabla[c.id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  E.temporadaApertura=E.temporada?JSON.parse(JSON.stringify(E.temporada)):null;
  if(E.temporada){
    E.temporada.pj=0; E.temporada.pg=0; E.temporada.pe=0; E.temporada.pp=0;
    E.temporada.gf=0; E.temporada.gc=0; E.temporada.pts=0;
  }
  const pack=_fx2006();
  const vuelta=pack.fx.slice(Math.max(0, pack.clubs.length-1));
  const fechas=(typeof fechasSemanales==="function")?fechasSemanales(9,9,20,12):[];
  const parts=_cal2006Rueda(E.club, vuelta, "Clausura 2006", "clausura", fechas);
  if(typeof _insertarYOrdenar==="function") _insertarYOrdenar(parts);
  else if(E.calendario){
    parts.forEach(function(p){ E.calendario.push(p); });
    E.calendario.sort(function(a,b){
      const oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
      const ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
      return oa-ob;
    });
    let j;
    for(j=0;j<E.calendario.length;j++) if(!E.calendario[j].jugado){ E.idx=j; break; }
  }
  if(typeof notificar==="function") notificar({t:"Arranca el Clausura 2006",tipo:"neutro",
    d:"Cerraron los playoffs del Apertura. La tabla parte de cero. Otras 18 fechas, localías invertidas, y al final otra vez playoffs por el título. El descenso se mira en la tabla anual."});
}
function avanzarFase2006(part){
  if(typeof E==="undefined"||!E||E.eraBase!==2006||!part||part.tipo!=="liga") return;
  E.flags=E.flags||{};
  const fase=part.fase||E.flags.fase2006||"apertura";
  if(fase==="apertura"||!part.fase){
    const ape=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&(p.fase==="apertura"||!p.fase); });
    if(ape.filter(function(p){ return p.jugado; }).length<ape.length) return;
    if(E.flags.fase2006==="playoffApertura"||E.flags.fase2006==="clausura"||E.flags.fase2006==="playoffClausura") return;
    _sembrarPlayoffs2006("apertura");
    return;
  }
  if(fase==="clausura"){
    const cla=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&p.fase==="clausura"; });
    if(cla.filter(function(p){ return p.jugado; }).length<cla.length) return;
    if(E.flags.fase2006==="playoffClausura"||E.flags.fase2006==="cerrado") return;
    _sembrarPlayoffs2006("clausura");
  }
}
function _hookFase2006(){
  if(typeof terminarPartido==="function" && !terminarPartido._e06fase){
    const orig=terminarPartido;
    terminarPartido=function(P){
      const res=orig.apply(this, arguments);
      try{ avanzarFase2006(P&&P.part); }catch(e){}
      return res;
    };
    terminarPartido._e06fase=true;
  }
  if(typeof resolverCopa==="function" && !resolverCopa._e06po){
    const origC=resolverCopa;
    resolverCopa=function(part,yo,otro){
      if(part && /Playoffs (Apertura|Clausura) 2006/.test(part.torneo||"")){
        try{ _resolverPlayoffJugador2006(part,yo,otro); }catch(e){}
        return;
      }
      return origC.apply(this, arguments);
    };
    resolverCopa._e06po=true;
  }
  return typeof terminarPartido==="function" && !!terminarPartido._e06fase;
}

if(typeof LIGAS==="object") LIGAS[2006]=LIGA_2006;
if(typeof ERA==="object"){
  ERA[2006]={n:"2006", puntosVictoria:3, inflacion:1.15, cuposInternacional:4,
    desc:"Apertura y Clausura 2006: 19 clubes (Concepción suspendido). Se juegan las dos ruedas (18+18) y los playoffs estilo México (repechaje + cuartos/semis/final). Victoria vale 3. Colo-Colo bicampeón real del año."};
}

const PRENSA_2006=[
  {ctx:"titular", registro:"neutro", txt:"COLO-COLO BICAMPEÓN: Borghi cierra el año con dos estrellas."},
  {ctx:"titular", registro:"cl", txt:"EL CACIQUE SE MANDÓ EL AÑO COMPLETO. Apertura, Clausura y Suazo que no perdona."},
  {ctx:"titular", registro:"neutro", txt:"Suazo, 19 goles en el Apertura. El goleador de Chile es albo."},
  {ctx:"titular", registro:"cl", txt:"LA FALSA RABONA DE MATI FERNÁNDEZ: el pibe de 20 años se pasa a todo el país."},
  {ctx:"titular", registro:"neutro", txt:"Concepción no juega en 2006: sanción económica. El torneo queda con 19."},
  {ctx:"titular", registro:"cl", txt:"MORNING SE VA A LA B. El chaguito no aguantó la tabla anual."},
  {ctx:"titular", registro:"neutro", txt:"Audax Italiano, finalista del Clausura. La Florida casi toca el cielo."},
  {ctx:"titular", registro:"cl", txt:"ALEXIS SÁNCHEZ, 17 AÑOS, YA ESTÁ EN PRIMERA. Acuérdense de este cabro."}
];

(function wrap2006(){
  if(typeof construirCalendario==="function" && !construirCalendario._e06){
    const orig=construirCalendario;
    construirCalendario=function(clubId,anio,conCopa){
      if(typeof E!=="undefined" && E && E.eraBase===2006){
        const pack=_fx2006();
        const ida=pack.fx.slice(0, Math.max(0, pack.clubs.length-1));
        const fechas=(typeof fechasTemporada==="function")?fechasTemporada():[];
        return _cal2006Rueda(clubId, ida, "Apertura 2006", "apertura", fechas);
      }
      return orig(clubId,anio,conCopa);
    };
    construirCalendario._e06=true;
  }
  if(typeof nuevaPartida==="function" && !nuevaPartida._e06){
    const origN=nuevaPartida;
    nuevaPartida=function(clubId,anio,modo,extra){
      const r=origN.apply(this, arguments);
      if(typeof E!=="undefined"&&E&&E.eraBase===2006){
        E.flags=E.flags||{};
        if(!E.flags.fase2006) E.flags.fase2006="apertura";
      }
      return r;
    };
    nuevaPartida._e06=true;
  }
  _hookFase2006();
  try{ if(typeof _mapaTodosCache!=="undefined") _mapaTodosCache=null; }catch(e){}
})();
