"use strict";
/* ============================================================
   FUTBOLINI 7.58 · data-formato2026.js
   Reglas reales 2026 (ANFP / Wikipedia / bases Copa Chile art. 81, sep 2026):
     · Copa de la Liga (nueva, solo Primera)
     · Supercopa Final Four (4 equipos)
     · Segunda: zonas Norte/Sur + liguilla
     · Primera B: 1° sube directo, 2°–8° liguilla, último baja
     · Primera: bajan los 2 últimos (2 suben de la B)
     · Copa Chile 2026 NO incluye Segunda (32 = 16 Primera + 16 B)
     · Cascada CONMEBOL: un club, un asiento. Extra de Libertadores/Sud
       no consume Chile 1–4; si el mismo club también es 1°, el 2° hereda.
   Cargar ÚLTIMO (después de data-historico.js).
   Nombres reales documentados; stats/resultados de carrera = el juego.
   NUNCA se inventa un torneo como si fuera oficial.
   ============================================================ */

const COPA_LIGA_GRUPOS_2026={
  A:["COQ","CC","HUA","DCO"],
  B:["UC","NUB","UDC","COB"],
  C:["OHI","EVE","LIM","PAL"],
  D:["CAL","AUD","UCH","LSE"]
};
const COPA_LIGA_FECHAS_2026=[
  {m:3,d:21},{m:3,d:25},{m:3,d:30},{m:5,d:3},{m:5,d:10},{m:6,d:6}
];
const COPA_LIGA_KO_FECHAS={
  Semifinal:[{m:7,d:8},{m:7,d:12}],
  FINAL:[{m:7,d:18}]
};
const COPA_LIGA_FINAL_SEDE="Estadio Elías Figueroa Brander";
const COPA_LIGA_PAREJA={A:"D",D:"A",B:"C",C:"B"};

const SUPERCOPA_2026={
  equipos:["COQ","UC","HUA","LIM"],
  sede:"Estadio Sausalito",
  semis:{
    HUA:{rival:"UC", f:{m:1,d:20}, real:"2-4"},
    UC:{rival:"HUA", f:{m:1,d:20}, real:"4-2"},
    COQ:{rival:"LIM",f:{m:1,d:21}, real:"3-2"},
    LIM:{rival:"COQ",f:{m:1,d:21}, real:"2-3"}
  },
  final:{f:{m:1,d:25}, real:"0-0 (8-7 pen COQ)"},
  campeonHist:"COQ",
  nota:"Supercopa Lanco 2026, Final Four en Sausalito. Campeón y subcampeón de Liga 2025 + finalistas de Copa Chile 2025. Histórico: Coquimbo campeón en penales vs Católica."
};

const ZONAL_C_FECHAS=[
  {m:3,d:22},{m:3,d:29},{m:4,d:5},{m:4,d:12},{m:4,d:19},{m:4,d:26},
  {m:5,d:3},{m:5,d:10},{m:5,d:17},{m:5,d:24},{m:5,d:31},{m:6,d:7}
];
const LIGUILLA_C_FECHAS=[
  {m:7,d:12},{m:7,d:19},{m:7,d:26},{m:8,d:2},{m:8,d:9},{m:8,d:16},
  {m:8,d:23},{m:8,d:30},{m:9,d:6},{m:9,d:13},{m:9,d:20},{m:9,d:27}
];
const LIGUILLA_B_FECHAS={
  Cuartos:[{m:11,d:4},{m:11,d:8}],
  Semifinal:[{m:11,d:15},{m:11,d:19}],
  FINAL:[{m:11,d:22},{m:11,d:26}]
};

if(typeof FORMAT_COPAS==="object"){
  FORMAT_COPAS.copaLiga2026="Copa de la Liga 2026 (1ª edición, Consejo de Presidentes 13 oct 2025). Solo los 16 de Primera. 4 grupos de 4, ida y vuelta. Clasifica ÚNICAMENTE el 1° de cada grupo a semifinales (A↔D, B↔C, ida/vuelta, sin gol de visita; empate a penales). Final a partido único en el Elías Figueroa (Valparaíso). El campeón obtiene el cupo Chile 3 a Libertadores del año siguiente. No es Copa Chile.";
  FORMAT_COPAS.supercopa2026="Supercopa 2026: primer año con 4 equipos (Final Four). Semis 20-21 ene y final 25 ene en Sausalito. COQ (campeón Liga 2025) vs LIM (subcampeón Copa Chile); HUA (campeón Copa Chile) vs UC (subcampeón Liga). Coquimbo campeón 0-0 (8-7 pen) vs Católica. 2027+: campeón y subcampeón de Liga + finalistas de Copa Chile / Copa de la Liga.";
  FORMAT_COPAS.segunda2026="Segunda División Profesional 2026: 14 clubes, zonas Norte/Sur de 7. Ida y vuelta en la zona (12 PJ, 2 fechas libres). Top 3 de cada zona a liguilla de título; bottom 3 a liguilla de permanencia. Los 4° se juegan un partido en cancha neutral: el ganador entra a la liguilla de ascenso, el perdedor a la de descenso. Liguillas de 7, ida y vuelta (12 PJ). El 1° de la liguilla de ascenso sube a Primera B. Los 2 últimos de la de descenso bajan a Tercera A (la Tercera no es jugable: el juego mueve 1 en la cadena B↔Segunda). Copa Chile 2026 NO incluye Segunda.";
  FORMAT_COPAS.primeraB2026="Liga de Ascenso / Primera B 2026: 16 clubes, todos contra todos ida y vuelta (30 fechas). El 1° es campeón y sube directo a Primera. Los que terminen 2° a 8° juegan liguilla por el segundo cupo: 2° espera en semis; 3° vs 8°, 4° vs 7° y 5° vs 6° ida y vuelta (local primero el peor de la regular). Empate en cuartos/semis: penales, sin alargue. Final: alargue y si sigue, penales. El último de la regular baja a Segunda. De Primera bajan los 2 últimos: 2 suben, 2 bajan.";
  FORMAT_COPAS.cupos2026="Libertadores 2027: Chile 1 = 1° de Liga; Chile 2 = 2° de Liga; Chile 3 = campeón Copa de la Liga; Chile 4 = repechaje 3° de Liga vs campeón Copa Chile (ganador a fase 2, perdedor a Sudamericana). Un club, un asiento: si ya tiene Libertadores (liga, Copa de la Liga o cupo CONMEBOL extra), el cupo lo hereda el siguiente. Campeón de Libertadores o Sudamericana entra a la siguiente Libertadores (cupo extra, no consume Chile 1–4). Si ese mismo club también es 1° de Liga, el 2° hereda Chile 1, el 3° hereda Chile 2 y el repechaje Chile 4 lo juega el 4°. Copa Chile (bases art. 81): si el campeón ya tiene Chile 1/2/3 o extra, el repechaje lo juega el subcampeón; si ese también está, el mejor de la tabla que no esté clasificado. Sudamericana: 4°, 5° y 6° de Liga + el que pierde el repechaje Chile 4 (si la tabla se corre, 5°–7°). Un club no va a Libertadores y Sudamericana el mismo año. La B no clasifica, salvo el campeón de Copa Chile que suba a Primera.";
}

function esClubPrimera2026(id){
  if(typeof esClubB==="function" && esClubB(id)) return false;
  if(typeof esClubC==="function" && esClubC(id)) return false;
  if(typeof LIGA_2026!=="undefined"){
    for(var i=0;i<LIGA_2026.length;i++) if(LIGA_2026[i].id===id) return true;
  }
  return false;
}

function _mkCopaPart(spec){
  var yo=(typeof clubLookup==="function")?clubLookup(spec.clubId):null;
  var riv=spec.rivalId&&typeof clubLookup==="function"?clubLookup(spec.rivalId):null;
  var sede=spec.sede||(spec.local?(yo&&yo.est)||"local":(riv&&riv.est)||"estadio rival");
  return {
    tipo:"copa", torneo:spec.torneo, ronda:spec.ronda,
    rivalId:spec.rivalId||null, rivalNombre:riv?riv.n:(spec.rival||"?"),
    fuerzaRival:riv?riv.fuerza:(spec.fuerza||70),
    local:!!spec.local, sede:sede, f:spec.f, jugado:false,
    clima:(typeof climaDeFecha==="function")?climaDeFecha(spec.f.m,(spec.torneo||"copa")+(spec.ronda||"")+(spec.f.d||0)):"despejado",
    real:spec.real||null, nota:spec.nota||null, notaId:spec.notaId||null,
    fase:spec.fase||null
  };
}
function _insertarYOrdenar(nuevos){
  if(!E||!nuevos||!nuevos.length) return;
  var actual=(E.calendario||[])[E.idx];
  nuevos.forEach(function(p){ E.calendario.push(p); });
  E.calendario.sort(function(a,b){
    var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
    var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
    return oa-ob;
  });
  if(actual && !actual.jugado){
    var i=E.calendario.indexOf(actual);
    if(i>=0) E.idx=i;
  } else {
    var j;
    for(j=0;j<E.calendario.length;j++) if(!E.calendario[j].jugado){ E.idx=j; break; }
  }
}
function _sacarTorneoPendiente(torneo){
  if(!E||!E.calendario) return;
  E.calendario=E.calendario.filter(function(p){
    return !(p.tipo==="copa"&&p.torneo===torneo&&!p.jugado);
  });
}
function _fuerzaId(id){
  var c=(typeof clubLookup==="function")?clubLookup(id):null;
  return (c&&c.fuerza)||50;
}
/* marcador ajeno estable (misma semilla = misma tabla al reabrir) */
function _marcadorEstable(idA, idB, localA, clave){
  var ca=(typeof clubLookup==="function")?clubLookup(idA):null;
  var cb=(typeof clubLookup==="function")?clubLookup(idB):null;
  var fa=(ca&&ca.fuerza)||50, fb=(cb&&cb.fuerza)||50;
  var rndFn=null;
  if(typeof azarFijo==="function"&&typeof semilla==="function"){
    rndFn=azarFijo(semilla((clave||"tab")+"|"+idA+"|"+idB+"|"+(localA?"L":"V")+"|"+((typeof E!=="undefined"&&E&&E.anio)||0)));
  }
  function rr(a,b){
    if(rndFn) return a+rndFn()*(b-a);
    if(typeof rnd==="function") return rnd(a,b);
    return (a+b)/2;
  }
  var a=fa+(localA?5:0)+rr(-8,8);
  var b=fb+rr(-8,8);
  var d=(a-b)/12;
  var ga=Math.max(0,Math.min(5,Math.round(1.15+d*0.55+rr(-1,1.2))));
  var gb=Math.max(0,Math.min(5,Math.round(1.05-d*0.55+rr(-1,1.2))));
  return [ga,gb];
}
function _jornadaZonaC(clubId, rivalId){
  var z=(typeof zonaSegDe==="function")?zonaSegDe(clubId):((typeof clubZona==="function")?clubZona(clubId):null);
  var fx=fixturesZonaC(z);
  var i,j,fecha,a,b;
  for(i=0;i<fx.length;i++){
    fecha=fx[i]||[];
    for(j=0;j<fecha.length;j++){
      a=fecha[j][0]; b=fecha[j][1];
      if((a===clubId&&b===rivalId)||(a===rivalId&&b===clubId)) return fecha.slice();
    }
  }
  return [[clubId,rivalId]];
}
function fixturesZonaC(z){
  var ids=idsZonaCDe(z);
  if(!ids.length) return [];
  if(typeof fixturesLiga==="function") return fixturesLiga(ids.map(function(id){ return {id:id}; }));
  return [];
}
function _aplicarFilaTabla(tab, idA, idB, ga, gb){
  if(!tab[idA]) tab[idA]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
  if(!tab[idB]) tab[idB]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
  var ta=tab[idA], tb=tab[idB], pv=(typeof puntosVictoria==="function")?puntosVictoria():3;
  ta.pj++; tb.pj++; ta.gf+=ga; ta.gc+=gb; tb.gf+=gb; tb.gc+=ga;
  if(ga>gb){ ta.pg++; ta.pts+=pv; tb.pp++; }
  else if(ga<gb){ tb.pg++; tb.pts+=pv; ta.pp++; }
  else { ta.pe++; tb.pe++; ta.pts++; tb.pts++; }
}
/* Rondas de bye (el jugador no juega): se simulan con Poisson para que
   todos cierren con 12 PJ, no con tablas raras de 11 vs 12. */
function _simularRondasZonaHasta(hastaRonda){
  if(typeof E==="undefined"||!E||E.eraBase!=="2026c") return;
  var z=(typeof zonaSegDe==="function")?zonaSegDe(E.club):((typeof clubZona==="function")?clubZona(E.club):null);
  var fx=fixturesZonaC(z);
  if(!fx.length) return;
  E.flags=E.flags||{};
  E.flags.zonaCSim=E.flags.zonaCSim||{};
  if(!E.tabla) E.tabla={};
  var r, fecha, i, par, a, b, goles, clubId=E.club;
  var tope=(hastaRonda==null)?(fx.length-1):hastaRonda;
  for(r=0;r<=tope&&r<fx.length;r++){
    if(E.flags.zonaCSim[r]) continue;
    fecha=fx[r]||[];
    var playerIn=fecha.some(function(p){ return p[0]===clubId||p[1]===clubId; });
    if(playerIn){ E.flags.zonaCSim[r]=1; continue; }
    for(i=0;i<fecha.length;i++){
      par=fecha[i];
      if(par[0]===clubId||par[1]===clubId) continue;
      a=(typeof clubLookup==="function")?clubLookup(par[0]):null;
      b=(typeof clubLookup==="function")?clubLookup(par[1]):null;
      if(!a||!b) continue;
      goles=(typeof _golesSimulados==="function")?_golesSimulados(a,b,"zC|"+r+"|"+a.id+"|"+b.id):[1,1];
      _aplicarFilaTabla(E.tabla, a.id, b.id, goles[0], goles[1]);
    }
    E.flags.zonaCSim[r]=1;
  }
  try{ if(typeof mundoAlcanzarRonda==="function") mundoAlcanzarRonda(tope+1); }catch(e){}
}
function _simularRondasLiguillaHasta(hastaRonda){
  if(typeof E==="undefined"||!E||!E.flags||!E.flags.liguillaCIds) return;
  var ids=E.flags.liguillaCIds;
  var fx=(typeof fixturesLiga==="function")?fixturesLiga(ids.map(function(id){ return {id:id}; })):[];
  if(!fx.length) return;
  if(!E.tablaLiguilla){
    E.tablaLiguilla={};
    ids.forEach(function(id){ E.tablaLiguilla[id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  }
  E.flags.liguillaCSim=E.flags.liguillaCSim||{};
  var r, fecha, i, par, a, b, goles, clubId=E.club;
  var tope=(hastaRonda==null)?(fx.length-1):hastaRonda;
  for(r=0;r<=tope&&r<fx.length;r++){
    if(E.flags.liguillaCSim[r]) continue;
    fecha=fx[r]||[];
    var playerIn=fecha.some(function(p){ return p[0]===clubId||p[1]===clubId; });
    if(playerIn){ E.flags.liguillaCSim[r]=1; continue; }
    for(i=0;i<fecha.length;i++){
      par=fecha[i];
      if(par[0]===clubId||par[1]===clubId) continue;
      a=(typeof clubLookup==="function")?clubLookup(par[0]):null;
      b=(typeof clubLookup==="function")?clubLookup(par[1]):null;
      if(!a||!b) continue;
      goles=(typeof _golesSimulados==="function")?_golesSimulados(a,b):[1,1];
      _aplicarFilaTabla(E.tablaLiguilla, a.id, b.id, goles[0], goles[1]);
    }
    E.flags.liguillaCSim[r]=1;
  }
}

/* ---------- Copa de la Liga ---------- */
function grupoCopaLigaDe(clubId, anio){
  if(anio===2026){
    var g, arr, i;
    for(g in COPA_LIGA_GRUPOS_2026){
      arr=COPA_LIGA_GRUPOS_2026[g];
      for(i=0;i<arr.length;i++) if(arr[i]===clubId) return {letra:g, ids:arr};
    }
    return null;
  }
  var pr=(typeof E!=="undefined"&&E&&E.ligaMod&&E.ligaMod[2026])?E.ligaMod[2026].slice():((typeof LIGA_2026!=="undefined")?LIGA_2026.map(function(c){return c.id;}):[]);
  if(pr.indexOf(clubId)<0) return null;
  var seed=(typeof azarFijo==="function"&&typeof semilla==="function")?azarFijo(semilla("copaliga"+anio+clubId)):Math.random;
  var rest=pr.filter(function(id){ return id!==clubId; });
  var pick=[];
  for(var k=0;k<3&&rest.length;k++) pick.push(rest.splice(Math.floor(seed()*rest.length),1)[0]);
  return {letra:String.fromCharCode(65+(Math.abs((anio+clubId.length))%4)), ids:[clubId].concat(pick)};
}
function partidosCopaLigaGrupo(clubId, anio){
  var g=grupoCopaLigaDe(clubId, anio||2026);
  if(!g) return [];
  var rivales=g.ids.filter(function(id){ return id!==clubId; });
  if(rivales.length<3) return [];
  var out=[], i, riv, local, f, yo, elotro;
  var orden=[[0,true],[1,false],[2,true],[0,false],[1,true],[2,false]];
  for(i=0;i<orden.length;i++){
    riv=rivales[orden[i][0]];
    local=orden[i][1];
    yo=(typeof clubLookup==="function")?clubLookup(clubId):null;
    elotro=(typeof clubLookup==="function")?clubLookup(riv):null;
    if(!yo||!elotro) continue;
    f=COPA_LIGA_FECHAS_2026[i]||{m:4,d:1+i};
    out.push(_mkCopaPart({
      clubId:clubId, torneo:"Copa de la Liga", ronda:"Grupo "+g.letra,
      rivalId:riv, local:local, f:f,
      nota:anio===2026?"Grupo real Copa de la Liga 2026 (ANFP, 8 ene 2026). Clasifica solo el 1°.":"Grupo sorteado por el juego (Copa de la Liga "+anio+").",
      notaId:"CL"+(anio||26)+"-"+g.letra+"-"+i
    }));
  }
  return out;
}
function tablaGrupoCopaLiga(letra, clubId){
  var ids=(COPA_LIGA_GRUPOS_2026[letra])||[];
  if(!ids.length){
    ids=[clubId];
    (E.calendario||[]).forEach(function(p){
      if(p.tipo==="copa"&&p.torneo==="Copa de la Liga"&&p.ronda==="Grupo "+letra&&p.rivalId&&ids.indexOf(p.rivalId)<0) ids.push(p.rivalId);
    });
  }
  if(typeof mundoFilasCopa==="function" && typeof E!=="undefined" && E && E.mundo){
    var fil=mundoFilasCopa("copaLiga", letra);
    if(fil && fil.length) return fil;
  }
  var t={};
  ids.forEach(function(id){ t[id]={id:id,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  function app(a,b,ga,gb){
    if(!t[a]||!t[b]) return;
    t[a].pj++; t[b].pj++; t[a].gf+=ga; t[a].gc+=gb; t[b].gf+=gb; t[b].gc+=ga;
    if(ga>gb){ t[a].pg++; t[a].pts+=3; t[b].pp++; }
    else if(ga<gb){ t[b].pg++; t[b].pts+=3; t[a].pp++; }
    else { t[a].pe++; t[b].pe++; t[a].pts++; t[b].pts++; }
  }
  (E.calendario||[]).forEach(function(p){
    if(p.tipo!=="copa"||p.torneo!=="Copa de la Liga"||p.ronda!=="Grupo "+letra||!p.jugado) return;
    app(clubId, p.rivalId, p.gf||0, p.gc||0);
  });
  if(typeof tablaViva==="function") return tablaViva(ids, t);
  var arr=ids.map(function(id){ return Object.assign({id:id}, t[id]); });
  arr.sort(function(x,y){
    if(y.pts!==x.pts) return y.pts-x.pts;
    var dx=x.gf-x.gc, dy=y.gf-y.gc;
    if(dy!==dx) return dy-dx;
    return (y.gf||0)-(x.gf||0);
  });
  return arr;
}
function _mejorDeGrupoCL(letra, skip){
  var ids=COPA_LIGA_GRUPOS_2026[letra]||[];
  var pool=ids.filter(function(id){ return (skip||[]).indexOf(id)<0 && id!==E.club; });
  pool.sort(function(a,b){
    var fa=(typeof clubLookup==="function"&&clubLookup(a)||{}).fuerza||0;
    var fb=(typeof clubLookup==="function"&&clubLookup(b)||{}).fuerza||0;
    return fb-fa;
  });
  return pool[0]||null;
}
function resolverCopaLiga(part, yo, otro){
  var ronda=part.ronda||"";
  if(ronda.indexOf("Grupo ")===0){
    var letra=ronda.replace("Grupo ","");
    var idx=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo==="Copa de la Liga"&&p.ronda===ronda; });
    if(idx.filter(function(p){ return p.jugado; }).length<idx.length) return;
    var tab=tablaGrupoCopaLiga(letra, E.club);
    var pos=-1, i;
    for(i=0;i<tab.length;i++) if(tab[i].id===E.club) pos=i+1;
    var etq=tab.map(function(x,n){
      var c=(typeof clubLookup==="function"&&clubLookup(x.id))||{};
      return (n+1)+". "+(c.c||c.n||x.id)+" "+x.pts+" pts";
    }).join(" · ");
    if(pos!==1){
      _sacarTorneoPendiente("Copa de la Liga");
      notificar({t:"Eliminado de la Copa de la Liga",tipo:"malo",
        d:"El grupo "+letra+" quedó así (tus partidos; el resto se simula por fuerza, no es la tabla real 2026): "+etq+". Quedaste "+pos+"° y no clasificas. En este torneo solo pasa el 1°."});
      if(typeof aplicarEfectos==="function") aplicarEfectos({moral:-2,prestigio:-1});
    } else {
      notificar({t:"1° de grupo · Copa de la Liga",tipo:"bueno",
        d:"Ganaste el grupo "+letra+". "+etq+". Semifinal contra el 1° del grupo "+(COPA_LIGA_PAREJA[letra]||"?")+" (formato ANFP 2026)."});
      if(typeof aplicarEfectos==="function") aplicarEfectos({moral:5,prestigio:2,plata:50});
      E.flags.copaLigaGrupo=letra;
      var riv=_mejorDeGrupoCL(COPA_LIGA_PAREJA[letra]||"D", [E.club]);
      if(riv){
        var fs=COPA_LIGA_KO_FECHAS.Semifinal;
        _insertarYOrdenar([
          _mkCopaPart({clubId:E.club,torneo:"Copa de la Liga",ronda:"Semifinal",rivalId:riv,local:true,f:fs[0],nota:"Semifinal ida. Procedural: el rival es el 1° estimado del grupo pareja."}),
          _mkCopaPart({clubId:E.club,torneo:"Copa de la Liga",ronda:"Semifinal",rivalId:riv,local:false,f:fs[1]})
        ]);
      }
    }
    return;
  }
  E.flags.copaAcum=E.flags.copaAcum||{};
  var k="CL-"+ronda;
  var acc=E.flags.copaAcum[k]||{gf:0,gc:0,j:0};
  acc.gf+=yo; acc.gc+=otro; acc.j++;
  E.flags.copaAcum[k]=acc;
  var idxRonda=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo==="Copa de la Liga"&&p.ronda===ronda; });
  if(idxRonda.filter(function(p){ return p.jugado; }).length<idxRonda.length) return;
  var pasa, pens=false;
  if(ronda==="FINAL"){
    if(yo>otro) pasa=true;
    else if(yo<otro) pasa=false;
    else { pasa=Math.random()<0.5; pens=true; }
  } else {
    pasa=acc.gf>acc.gc||(acc.gf===acc.gc&&Math.random()<0.5);
    if(acc.gf===acc.gc) pens=true;
  }
  var penalTxt=pens?" Se definió en penales (el juego no inventa el 4-3: solo quién pasa).":"";
  if(!pasa){
    if(ronda==="FINAL" && part && part.rivalId) E.flags.copaLigaCampeonClub=part.rivalId;
    _sacarTorneoPendiente("Copa de la Liga");
    notificar({t:ronda==="FINAL"?"Subcampeón de la Copa de la Liga":"Eliminado de la Copa de la Liga",tipo:ronda==="FINAL"?"neutro":"malo",
      d:"Fuera en "+ronda+" ("+acc.gf+"-"+acc.gc+")."+(ronda==="FINAL"?" Si el campeón ya tiene Libertadores, el Chile 3 lo hereda el siguiente de la tabla.":"")+penalTxt});
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:-4,prestigio:-2});
  } else if(ronda==="FINAL"){
    E.flags.copaLigaCampeon=true;
    if(E.club) E.flags.copaLigaCampeonClub=E.club;
    notificar({t:"Campeón de la Copa de la Liga",tipo:"bueno",
      d:"El club gana la Copa de la Liga "+E.anio+". Es un torneo de Primera (no Copa Chile). El campeón se lleva el cupo Chile 3 a Libertadores, salvo que ya tenga Libertadores (liga o CONMEBOL): entonces el Chile 3 lo hereda el siguiente de la tabla."+penalTxt});
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:8,prestigio:6,plata:220});
    if(typeof aplicarGrupos==="function") aplicarGrupos({hinchada:12,camarin:10,directorio:10,sponsors:8});
    if(E.titulos&&E.titulos.indexOf(E.anio+" · Copa de la Liga")<0) E.titulos.push(E.anio+" · Copa de la Liga");
  } else {
    if(typeof aplicarEfectos==="function") aplicarEfectos({plata:70,moral:4,prestigio:2});
    notificar({t:"Final de Copa de la Liga",tipo:"bueno",
      d:"Supera semifinal ("+acc.gf+"-"+acc.gc+")."+penalTxt+" La final es a partido único en el Elías Figueroa."});
    var skip=E.flags.copaLigaRivales||[];
    var letra=E.flags.copaLigaGrupo||"A";
    var otroG=(letra==="A"||letra==="D")?"B":"A";
    var rivF=_mejorDeGrupoCL(otroG, skip.concat([E.club, part.rivalId]));
    if(!rivF) rivF=_mejorDeGrupoCL(COPA_LIGA_PAREJA[otroG]||"C", skip.concat([E.club]));
    if(rivF){
      _insertarYOrdenar([_mkCopaPart({
        clubId:E.club, torneo:"Copa de la Liga", ronda:"FINAL", rivalId:rivF,
        local:false, f:COPA_LIGA_KO_FECHAS.FINAL[0], sede:COPA_LIGA_FINAL_SEDE,
        nota:"Final a partido único. Sede 2026: Elías Figueroa, Valparaíso (ANFP). Empate: penales."
      })]);
    }
  }
}

/* ---------- Supercopa ---------- */
function partidosSupercopaDe(clubId, anio){
  if(anio===2026){
    var s=SUPERCOPA_2026.semis[clubId];
    if(!s) return [];
    return [_mkCopaPart({
      clubId:clubId, torneo:"Supercopa", ronda:"Semifinal", rivalId:s.rival,
      local:false, f:s.f, sede:SUPERCOPA_2026.sede, real:s.real,
      nota:SUPERCOPA_2026.nota, notaId:"SC26-SF"
    })];
  }
  if(anio>=2027 && typeof E!=="undefined" && E && E.flags && E.flags.superCopaCupo){
    var pool=(typeof LIGA_2026!=="undefined")?LIGA_2026.map(function(c){return c.id;}):[];
    pool=pool.filter(function(id){ return id!==clubId; });
    var riv=pool[Math.abs(((typeof semilla==="function")?semilla("sc"+anio+clubId):7))%pool.length];
    return [_mkCopaPart({
      clubId:clubId, torneo:"Supercopa", ronda:"Semifinal", rivalId:riv,
      local:false, f:{m:1,d:21}, sede:"Estadio Nacional",
      nota:"Supercopa "+anio+" (Final Four: campeón y subcampeón de Liga + finalistas de Copa Chile). El rival lo arma el juego.",
      notaId:"SC"+anio+"-SF"
    })];
  }
  return [];
}
function resolverSupercopa(part, yo, otro){
  var ronda=part.ronda||"";
  var pasa, pens=false;
  if(yo>otro) pasa=true;
  else if(yo<otro) pasa=false;
  else { pasa=Math.random()<0.5; pens=true; }
  var penalTxt=pens?" Se definió en penales (el juego no inventa el marcador: solo quién pasa).":"";
  if(ronda==="Semifinal"){
    if(!pasa){
      _sacarTorneoPendiente("Supercopa");
      notificar({t:"Fuera de la Supercopa",tipo:"malo",
        d:"Caíste en semifinal ante "+part.rivalNombre+" "+yo+"-"+otro+"."+penalTxt+" No hay partido por el tercer puesto."});
      if(typeof aplicarEfectos==="function") aplicarEfectos({moral:-2});
    } else {
      notificar({t:"Final de Supercopa",tipo:"bueno",
        d:"Pasaste la semi ante "+part.rivalNombre+"."+penalTxt});
      if(typeof aplicarEfectos==="function") aplicarEfectos({moral:4,plata:40});
      var otroSemi=null;
      if(E.anio===2026){
        if(E.club==="COQ"||E.club==="LIM") otroSemi="UC";
        else otroSemi="COQ";
      } else {
        var pool=(typeof LIGA_2026!=="undefined")?LIGA_2026.map(function(c){return c.id;}):[];
        otroSemi=pool.filter(function(id){ return id!==E.club&&id!==part.rivalId; })[0]||"CC";
      }
      _insertarYOrdenar([_mkCopaPart({
        clubId:E.club, torneo:"Supercopa", ronda:"FINAL", rivalId:otroSemi,
        local:false, f:E.anio===2026?SUPERCOPA_2026.final.f:{m:1,d:25},
        sede:E.anio===2026?SUPERCOPA_2026.sede:"Estadio Nacional",
        real:E.anio===2026&&(E.club==="COQ"||E.club==="UC")?SUPERCOPA_2026.final.real:null,
        nota:E.anio===2026?SUPERCOPA_2026.nota:"Final Four. Sede neutral."
      })]);
    }
    return;
  }
  if(ronda==="FINAL"){
    if(!pasa){
      notificar({t:"Subcampeón de Supercopa",tipo:"neutro",
        d:"La final se fue "+yo+"-"+otro+" ante "+part.rivalNombre+"."+penalTxt});
      if(typeof aplicarEfectos==="function") aplicarEfectos({moral:-1,prestigio:2,plata:40});
    } else {
      E.flags.superCopaCampeon=true;
      notificar({t:"Campeón de la Supercopa",tipo:"bueno",
        d:"El club gana la Supercopa "+E.anio+". Es el primer título del año."+penalTxt});
      if(typeof aplicarEfectos==="function") aplicarEfectos({moral:8,prestigio:5,plata:120,hinchada:8});
      if(E.titulos&&E.titulos.indexOf(E.anio+" · Supercopa")<0) E.titulos.push(E.anio+" · Supercopa");
    }
  }
}

/* ---------- Segunda: zonal + liguilla ---------- */
function _ligaCPart(clubId, rivalId, local, f, fase, fechaN, ronda){
  var yo=(typeof clubLookup==="function")?clubLookup(clubId):null;
  var riv=(typeof clubLookup==="function")?clubLookup(rivalId):null;
  if(!yo||!riv) return null;
  var p={
    tipo:"liga", torneo:"Segunda División", ronda:ronda||null,
    fecha:fechaN||null, rivalId:rivalId, rivalNombre:riv.n, fuerzaRival:riv.fuerza,
    local:!!local, sede:local?yo.est:riv.est, f:f, jugado:false,
    clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,"seg"+clubId+fase+(f.d||0)):"despejado",
    fase:fase, zona:(typeof zonaSegDe==="function")?zonaSegDe(clubId):((typeof clubZona==="function")?clubZona(clubId):null)
  };
  /* playoff/liguilla no son una fecha de zona: no simular el resto de la rueda.
     zonal: solo pares de la misma zona (7 equipos, 1 fecha libre) */
  if(fase==="playoff4"||fase==="liguillaAscenso"||fase==="liguillaDescenso") p.jornada=[[clubId,rivalId]];
  else if(fase==="zonal") p.jornada=_jornadaZonaC(clubId, rivalId);
  return p;
}
function idsZonaCDe(z){
  var ids, zonaDe;
  if(!z) return [];
  if(typeof E!=="undefined" && E && E.ligaMod && E.ligaMod["2026c"]) ids=E.ligaMod["2026c"].slice();
  else if(typeof LIGA_C_2026!=="undefined") ids=LIGA_C_2026.map(function(c){ return c.id; });
  else return [];
  zonaDe=(typeof zonaSegDe==="function")?zonaSegDe:(typeof clubZona==="function"?clubZona:function(){ return null; });
  return ids.filter(function(id){ return zonaDe(id)===z; });
}
function partidosZonalesC(clubId){
  var z=(typeof zonaSegDe==="function")?zonaSegDe(clubId):((typeof clubZona==="function")?clubZona(clubId):null);
  if(!z) return [];
  var fx=fixturesZonaC(z);
  var out=[], r, fecha, i, mio, local, riv, p, n=0;
  var fechasCal=ZONAL_C_FECHAS.concat([
    {m:6,d:14},{m:6,d:21}
  ]);
  for(r=0;r<fx.length;r++){
    fecha=fx[r]||[];
    mio=null;
    for(i=0;i<fecha.length;i++){
      if(fecha[i][0]===clubId||fecha[i][1]===clubId) mio=fecha[i];
    }
    if(!mio) continue;
    local=mio[0]===clubId;
    riv=local?mio[1]:mio[0];
    p=_ligaCPart(clubId, riv, local, fechasCal[n]||{m:4,d:1+n}, "zonal", n+1, "Zona "+(z==="norte"?"Norte":"Sur"));
    if(p){ p.jornada=fecha.slice(); p.fxRonda=r; out.push(p); n++; }
  }
  return out;
}
function tablaZonaC(z, clubId){
  var ids=idsZonaCDe(z);
  var zMia=(typeof zonaSegDe==="function")?zonaSegDe(clubId|| (typeof E!=="undefined"&&E&&E.club) ):null;
  var arr, key;
  /* la zona del jugador: E.tabla (Poisson de cada fecha, no un estimado aparte) */
  if(z===zMia && typeof E!=="undefined"&&E&&E.tabla){
    arr=ids.map(function(id){
      var t=E.tabla[id]||{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
      return Object.assign({id:id}, t);
    });
    arr.sort(function(x,y){
      if(y.pts!==x.pts) return y.pts-x.pts;
      var dx=x.gf-x.gc, dy=y.gf-y.gc;
      if(dy!==dx) return dy-dx;
      return (y.gf||0)-(x.gf||0);
    });
    return arr;
  }
  /* la otra zona: el país (mundo.js), misma física, ronda a ronda — no un RR inventado de 12 PJ */
  key=z==="norte"?"2026cN":"2026cS";
  if(typeof E!=="undefined"&&E&&E.mundo&&E.mundo.ligas&&E.mundo.ligas[key]&&typeof mundoFilasLiga==="function"){
    arr=mundoFilasLiga(key);
    if(arr&&arr.length) return arr;
  }
  if(typeof tablaViva==="function") return tablaViva(ids, {});
  var t0={};
  ids.forEach(function(id){ t0[id]={id:id,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  return ids.map(function(id){ return t0[id]; });
}
function tablaLiguillaC(fase, clubId){
  var lig=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&p.fase===fase; });
  var ids=(E.flags&&E.flags.liguillaCIds)||[];
  if(!ids.length){
    ids=[clubId];
    lig.forEach(function(p){ if(p.rivalId&&ids.indexOf(p.rivalId)<0) ids.push(p.rivalId); });
  }
  /* tabla viva: Poisson de cada fecha (wrapTerminar54 la cosecha a E.tablaLiguilla) */
  if(E.tablaLiguilla && ids.some(function(id){ return E.tablaLiguilla[id]; })){
    if(typeof tablaViva==="function") return tablaViva(ids, E.tablaLiguilla);
    var live=ids.map(function(id){
      var t=E.tablaLiguilla[id]||{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
      return Object.assign({id:id}, t);
    });
    live.sort(function(x,y){
      if(y.pts!==x.pts) return y.pts-x.pts;
      var dx=x.gf-x.gc, dy=y.gf-y.gc;
      if(dy!==dx) return dy-dx;
      return (y.gf||0)-(x.gf||0);
    });
    return live;
  }
  var t={};
  ids.forEach(function(id){ t[id]={id:id,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  function app(a,b,ga,gb){
    if(!t[a]||!t[b]) return;
    t[a].pj++; t[b].pj++; t[a].gf+=ga; t[a].gc+=gb; t[b].gf+=gb; t[b].gc+=ga;
    if(ga>gb){ t[a].pg++; t[a].pts+=3; t[b].pp++; }
    else if(ga<gb){ t[b].pg++; t[b].pts+=3; t[a].pp++; }
    else { t[a].pe++; t[b].pe++; t[a].pts++; t[b].pts++; }
  }
  lig.forEach(function(p){
    if(!p.jugado) return;
    app(clubId, p.rivalId, p.gf||0, p.gc||0);
  });
  if(typeof tablaViva==="function") return tablaViva(ids, t);
  var arr=ids.map(function(id){ return t[id]; });
  arr.sort(function(x,y){
    if(y.pts!==x.pts) return y.pts-x.pts;
    var dx=x.gf-x.gc, dy=y.gf-y.gc;
    if(dy!==dx) return dy-dx;
    return (y.gf||0)-(x.gf||0);
  });
  return arr;
}
function _estimarLiguillaC(tipo, clubId, zona, posZonal, ganoPlayoff){
  var zMia=zona, zOtra=zMia==="norte"?"sur":"norte";
  var tabMia=tablaZonaC(zMia, clubId);
  var tabOtra=tablaZonaC(zOtra, clubId);
  /* si la otra zona todavía no tiene PJ (mundo no tickeó), ordená por fuerza SOLO para armar el cupo — la tabla que se pinta sigue viva */
  if(tabOtra.length && tabOtra.every(function(x){ return !x.pj; })){
    tabOtra=tabOtra.slice().sort(function(a,b){
      return ((typeof clubLookup==="function"&&clubLookup(b.id)||{}).fuerza||0)-((typeof clubLookup==="function"&&clubLookup(a.id)||{}).fuerza||0);
    });
  }
  var ids=[];
  function top(tab, n){ return tab.slice(0,n).map(function(x){ return x.id; }); }
  if(tipo==="ascenso"){
    ids=top(tabMia,3).concat(top(tabOtra,3));
    var cuartoOtra=tabOtra[3]&&tabOtra[3].id;
    if(posZonal<=3){ if(cuartoOtra) ids.push(cuartoOtra); }
    else if(ganoPlayoff && cuartoOtra){ /* el 4° rival perdió: entra el jugador, no el 4° otro */ }
    else if(ganoPlayoff){ /* ok */ }
    ids=ids.filter(function(id){ return id!==clubId; });
    if(ids.indexOf(clubId)<0) ids.push(clubId);
  } else {
    ids=tabMia.slice(4).map(function(x){ return x.id; }).concat(tabOtra.slice(4).map(function(x){ return x.id; }));
    var cuartoOtra2=tabOtra[3]&&tabOtra[3].id;
    if(posZonal>=5){ if(cuartoOtra2) ids.push(cuartoOtra2); }
    ids=ids.filter(function(id){ return id!==clubId; });
    if(ids.indexOf(clubId)<0) ids.push(clubId);
  }
  var uniq=[], seen={};
  ids.forEach(function(id){ if(!seen[id]){ seen[id]=1; uniq.push(id); } });
  uniq=uniq.filter(function(id){ return id!==clubId; }).slice(0,6);
  return uniq;
}
function _sembrarLiguillaC(tipo, rivales){
  var pool=[E.club].concat(rivales||[]);
  var ids=[], seen={};
  pool.forEach(function(id){ if(id&&!seen[id]){ seen[id]=1; ids.push(id); } });
  ids=ids.slice(0,7);
  E.flags=E.flags||{};
  E.flags.liguillaCIds=ids;
  E.tablaLiguilla={};
  ids.forEach(function(id){ E.tablaLiguilla[id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  var fx=(typeof fixturesLiga==="function")?fixturesLiga(ids.map(function(id){ return {id:id}; })):[];
  var out=[], r, fecha, i, mio, local, riv, p, n=0;
  var ronda=tipo==="ascenso"?"Liguilla de ascenso":"Liguilla de permanencia";
  var fase=tipo==="ascenso"?"liguillaAscenso":"liguillaDescenso";
  for(r=0;r<fx.length;r++){
    fecha=fx[r]||[];
    mio=null;
    for(i=0;i<fecha.length;i++){
      if(fecha[i][0]===E.club||fecha[i][1]===E.club) mio=fecha[i];
    }
    if(!mio) continue;
    local=mio[0]===E.club;
    riv=local?mio[1]:mio[0];
    p=_ligaCPart(E.club, riv, local, LIGUILLA_C_FECHAS[n]||{m:7,d:12+n*7}, fase, 20+n, ronda);
    if(p){ p.jornada=fecha.slice(); p.fxRonda=r; out.push(p); n++; }
  }
  _insertarYOrdenar(out);
}
function avanzarFaseSegunda(part){
  if(!E||E.eraBase!=="2026c"||!part||part.tipo!=="liga") return;
  E.flags=E.flags||{};
  var fase=part.fase||E.flags.segundaFase||"zonal";
  if(fase==="zonal"||!part.fase){
    var zon=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&(p.fase==="zonal"||!p.fase); });
    if(zon.filter(function(p){ return p.jugado; }).length<zon.length){
      if(part&&part.fxRonda!=null) try{ _simularRondasZonaHasta(part.fxRonda); }catch(e){}
      return;
    }
    try{ _simularRondasZonaHasta(null); }catch(e){}
    var z=(typeof clubZona==="function")?clubZona(E.club):"sur";
    var tab=tablaZonaC(z, E.club);
    var pos=0, i;
    for(i=0;i<tab.length;i++) if(tab[i].id===E.club) pos=i+1;
    E.flags.segundaZona=z;
    E.flags.segundaPosZonal=pos;
    var etq=tab.map(function(x,n){
      var c=clubLookup(x.id)||{};
      return (n+1)+". "+(c.c||c.n||x.id)+" "+x.pts+" pts";
    }).join(" · ");
    if(pos>=1&&pos<=3){
      E.flags.segundaFase="liguillaAscenso";
      notificar({t:"Liguilla de ascenso",tipo:"bueno",
        d:"Terminaste "+pos+"° de la Zona "+(z==="norte"?"Norte":"Sur")+". "+etq+". Top 3 va a la liguilla por el título y el ascenso a Primera B."});
      _sembrarLiguillaC("ascenso", _estimarLiguillaC("ascenso", E.club, z, pos, false));
    } else if(pos===4){
      E.flags.segundaFase="playoff4";
      var zOtra=z==="norte"?"sur":"norte";
      var tabO=tablaZonaC(zOtra, E.club);
      var riv4=tabO[3]?tabO[3].id:(tabO[0]&&tabO[0].id);
      notificar({t:"Playoff de cuartos",tipo:"neutro",
        d:"4° de la Zona "+(z==="norte"?"Norte":"Sur")+". "+etq+". Un partido en cancha neutral contra el 4° de la otra zona: el ganador entra a la liguilla de ascenso, el perdedor a la de permanencia."});
      if(riv4){
        var po=_ligaCPart(E.club, riv4, false, {m:6,d:14}, "playoff4", 13, "Playoff de 4°");
        if(po){ po.sede="Estadio Nacional"; _insertarYOrdenar([po]); }
      }
    } else {
      E.flags.segundaFase="liguillaDescenso";
      notificar({t:"Liguilla de permanencia",tipo:"malo",
        d:"Terminaste "+pos+"° de la Zona "+(z==="norte"?"Norte":"Sur")+". "+etq+". Bottom 3 va a la liguilla de permanencia: los 2 últimos bajan a Tercera A (en el juego, el último de esa liguilla pierde la categoría)."});
      _sembrarLiguillaC("descenso", _estimarLiguillaC("descenso", E.club, z, pos, false));
    }
    return;
  }
  if(fase==="playoff4"){
    var yo=part.gf||0, otro=part.gc||0;
    var gana=yo>otro||(yo===otro&&Math.random()<0.5);
    var pens=yo===otro;
    E.flags.segundaGanoPlayoff=gana;
    if(gana){
      E.flags.segundaFase="liguillaAscenso";
      notificar({t:"A la liguilla de ascenso",tipo:"bueno",
        d:"Ganaste el playoff de 4°"+(pens?" en penales":"")+". Entras a la liguilla por el título."});
      _sembrarLiguillaC("ascenso", _estimarLiguillaC("ascenso", E.club, E.flags.segundaZona, 4, true));
    } else {
      E.flags.segundaFase="liguillaDescenso";
      notificar({t:"A la liguilla de permanencia",tipo:"malo",
        d:"Perdiste el playoff de 4°"+(pens?" en penales":"")+". Vas a la liguilla de permanencia."});
      _sembrarLiguillaC("descenso", _estimarLiguillaC("descenso", E.club, E.flags.segundaZona, 4, false));
    }
    return;
  }
  if(fase==="liguillaAscenso"||fase==="liguillaDescenso"){
    try{ _simularRondasLiguillaHasta(part&&part.fxRonda); }catch(e){}
    var lig=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&p.fase===fase; });
    if(lig.filter(function(p){ return p.jugado; }).length<lig.length) return;
    var tabL=tablaLiguillaC(fase, E.club);
    var posL=0, k;
    for(k=0;k<tabL.length;k++) if(tabL[k].id===E.club) posL=k+1;
    var etqL=tabL.map(function(x,n){
      var c=(typeof clubLookup==="function"&&clubLookup(x.id))||{};
      return (n+1)+". "+(c.c||c.n||x.id)+" "+x.pts+" pts";
    }).join(" · ");
    if(fase==="liguillaAscenso"){
      if(posL===1){
        E.flags.ligaCCampeon=true;
        notificar({t:"Campeón de Segunda · ASCENSO",tipo:"bueno",
          d:"1° de la liguilla de ascenso. "+etqL+". Subís a Primera B. La liguilla se jugó partido a partido (12 PJ, se partió de 0)."});
        if(typeof aplicarEfectos==="function") aplicarEfectos({moral:8,prestigio:5,plata:120});
      } else {
        notificar({t:"Se acabó la liguilla de ascenso",tipo:"neutro",
          d:"Cerraste "+posL+"° de la liguilla. "+etqL+". No alcanzaste el 1°. Te quedás en Segunda."});
      }
    } else {
      if(posL===tabL.length || posL===0){
        E.flags.ligaCBaja=true;
        notificar({t:"Descenso a Tercera A",tipo:"malo",
          d:"Último de la liguilla de permanencia. "+etqL+". Perdés la categoría. En el juego la cadena mueve 1 a la B (la Tercera A no es jugable)."});
      } else {
        notificar({t:"Salvaste la categoría",tipo:"bueno",
          d:"Liguilla de permanencia: "+posL+"° de "+tabL.length+". "+etqL+". Te quedás en Segunda."});
      }
    }
  }
}

/* ---------- Primera B: liguilla 2°–8° (bases ANFP 2026, art. 85) ---------- */
function _posRegularB(id){
  var ids=(E.flags&&E.flags.liguillaBTabla)||[];
  var i=ids.indexOf(id);
  return i<0?99:i+1;
}
function _ganadorQFB(a,b){
  if(a===E.club||b===E.club) return E.club;
  return _fuerzaId(a)>=_fuerzaId(b)?a:b;
}
function _winnersQFB(tabIds){
  var pares=[[2,7],[3,6],[4,5]];
  var w=[];
  pares.forEach(function(par){
    var a=tabIds[par[0]], b=tabIds[par[1]];
    if(a&&b) w.push(_ganadorQFB(a,b));
  });
  return w;
}
function _rivalSemiB(tabIds){
  var w=_winnersQFB(tabIds);
  var pos=_posRegularB(E.club);
  if(pos===2){
    w.sort(function(a,b){ return _posRegularB(b)-_posRegularB(a); });
    return w[0]||tabIds[7];
  }
  var three=[E.club].concat(w.filter(function(id){ return id!==E.club; }));
  three.sort(function(a,b){ return _posRegularB(b)-_posRegularB(a); });
  if(three[0]===E.club) return tabIds[1];
  return three.filter(function(id){ return id!==E.club&&id!==three[0]; })[0]||tabIds[1];
}
function _rivalFinalB(tabIds, semiRival){
  var w=_winnersQFB(tabIds);
  var four=[tabIds[1]].concat(w);
  var seen={}, uniq=[];
  four.forEach(function(id){ if(id&&!seen[id]){ seen[id]=1; uniq.push(id); } });
  var other=uniq.filter(function(id){ return id!==E.club&&id!==semiRival; });
  other.sort(function(a,b){ return _fuerzaId(b)-_fuerzaId(a); });
  return other[0]||tabIds[2];
}
function _sembrarLlaveB(ronda, rivalId, fs){
  if(!rivalId) return;
  var yoPeor=_posRegularB(E.club)>_posRegularB(rivalId);
  _insertarYOrdenar([
    _mkCopaPart({
      clubId:E.club, torneo:"Liguilla de Ascenso", ronda:ronda, rivalId:rivalId,
      local:yoPeor, f:fs[0], fase:"liguillaB",
      nota:"Liguilla de la B (bases ANFP 2026). Ida: local el peor de la fase regular. Sin gol de visita. Cuartos/semis empatados: penales, sin alargue. Final: alargue y si sigue, penales.",
      notaId:"LB-"+ronda
    }),
    _mkCopaPart({
      clubId:E.club, torneo:"Liguilla de Ascenso", ronda:ronda, rivalId:rivalId,
      local:!yoPeor, f:fs[1], fase:"liguillaB"
    })
  ]);
}
function avanzarLiguillaB(part){
  if(!E||E.eraBase!=="2026b") return;
  E.flags=E.flags||{};
  if(part&&part.torneo==="Liguilla de Ascenso") return;
  if(E.flags.liguillaBListo) return;
  if(!part||part.tipo!=="liga") return;
  var liga=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&!p.fase; });
  if(!liga.length) return;
  if(liga.filter(function(p){ return p.jugado; }).length<liga.length) return;
  var tab=(typeof tablaOrdenada==="function")?tablaOrdenada():[];
  if(!tab.length) return;
  var ids=tab.map(function(x){ return x.id; });
  var pos=0, i;
  for(i=0;i<ids.length;i++) if(ids[i]===E.club) pos=i+1;
  E.flags.liguillaBListo=true;
  E.flags.ligaBPos=pos;
  E.flags.liguillaBTabla=ids;
  var etq=tab.slice(0,8).map(function(x,n){
    var c=(typeof clubLookup==="function"&&clubLookup(x.id))||{};
    return (n+1)+". "+(c.c||c.n||x.id)+" "+(x.pts||0)+" pts";
  }).join(" · ");
  if(pos===1){
    E.flags.ligaBCampeon=true;
    notificar({t:"Campeón de la B · ASCENSO DIRECTO",tipo:"bueno",
      d:"1° de la fase regular. "+etq+". Subís directo a Primera. El segundo cupo lo define la liguilla (2°–8°)."});
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:8,prestigio:6,plata:200});
    return;
  }
  if(pos===16||pos===ids.length){
    E.flags.ligaBBaja=true;
    notificar({t:"Descenso a Segunda",tipo:"malo",
      d:"Último de la Liga de Ascenso. Bajás a Segunda División. El 1° de Segunda sube a la B."});
    return;
  }
  if(pos>=9){
    notificar({t:"Fuera de la liguilla",tipo:"neutro",
      d:"Terminaste "+pos+"°. "+etq+". A la liguilla entran 2° a 8°. El 1° ya subió; el último baja. Te quedás en la B."});
    return;
  }
  E.flags.liguillaBFase=true;
  if(pos===2){
    notificar({t:"Liguilla: bye a semis",tipo:"bueno",
      d:"2° de la regular. "+etq+". Esperás en semifinales. 3°–8°, 4°–7° y 5°–6° se cruzan; te toca el peor clasificado de los que pasen."});
    var rivS=_rivalSemiB(ids);
    _sembrarLlaveB("Semifinal", rivS, LIGUILLA_B_FECHAS.Semifinal);
  } else {
    var cruce={3:7,4:6,5:5,6:4,7:3,8:2};
    var rivQ=ids[cruce[pos]]||ids[8-pos+1];
    notificar({t:"Liguilla de ascenso",tipo:"bueno",
      d:pos+"° de la regular. "+etq+". Cuartos ida y vuelta contra el "+(_posRegularB(rivQ))+"°. Local primero el peor. El 2° espera en semis."});
    _sembrarLlaveB("Cuartos", rivQ, LIGUILLA_B_FECHAS.Cuartos);
  }
}
function resolverLiguillaB(part, yo, otro){
  var ronda=part.ronda||"";
  E.flags=E.flags||{};
  E.flags.copaAcum=E.flags.copaAcum||{};
  var k="LB-"+ronda;
  var acc=E.flags.copaAcum[k]||{gf:0,gc:0,j:0};
  acc.gf+=yo; acc.gc+=otro; acc.j++;
  E.flags.copaAcum[k]=acc;
  var idxRonda=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo==="Liguilla de Ascenso"&&p.ronda===ronda; });
  if(idxRonda.filter(function(p){ return p.jugado; }).length<idxRonda.length) return;
  var pasa, pens=false, extra=false;
  if(acc.gf>acc.gc) pasa=true;
  else if(acc.gf<acc.gc) pasa=false;
  else {
    pasa=Math.random()<0.5;
    pens=true;
    if(ronda==="FINAL") extra=true;
  }
  var penalTxt=pens?(extra?" Empate en el global: alargue y después penales (el juego no inventa el marcador: solo quién pasa).":" Empate en el global: a penales, sin alargue (bases ANFP)."):"";
  var tabIds=E.flags.liguillaBTabla||[];
  if(!pasa){
    _sacarTorneoPendiente("Liguilla de Ascenso");
    notificar({t:"Fuera de la liguilla de ascenso",tipo:"malo",
      d:"Caíste en "+ronda+" ("+acc.gf+"-"+acc.gc+")."+penalTxt+" El segundo cupo se lo lleva otro. Te quedás en la B."});
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:-4,prestigio:-2});
    return;
  }
  if(ronda==="FINAL"){
    E.flags.ligaBLiguilla=true;
    notificar({t:"¡ASCENSO por liguilla!",tipo:"bueno",
      d:"Ganaste la liguilla de la B ("+acc.gf+"-"+acc.gc+")."+penalTxt+" El campeón de la fase regular ya tiene el primer cupo; vos sos el segundo a Primera."});
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:8,prestigio:6,plata:180});
    if(typeof aplicarGrupos==="function") aplicarGrupos({hinchada:14,camarin:12,directorio:12});
    if(E.titulos&&E.titulos.indexOf(E.anio+" · Liguilla de Ascenso")<0) E.titulos.push(E.anio+" · Liguilla de Ascenso");
    return;
  }
  if(ronda==="Semifinal"){
    if(typeof aplicarEfectos==="function") aplicarEfectos({moral:4,plata:50});
    notificar({t:"Final de la liguilla",tipo:"bueno",
      d:"Supera semifinal ("+acc.gf+"-"+acc.gc+")."+penalTxt+" La final es ida y vuelta. Si empatan hay alargue."});
    var rivF=_rivalFinalB(tabIds, part.rivalId);
    _sembrarLlaveB("FINAL", rivF, LIGUILLA_B_FECHAS.FINAL);
    return;
  }
  if(typeof aplicarEfectos==="function") aplicarEfectos({moral:3,plata:30});
  notificar({t:"Semifinal de la liguilla",tipo:"bueno",
    d:"Supera cuartos ("+acc.gf+"-"+acc.gc+")."+penalTxt+" El 2° de la regular espera. El cruce de semis: el 2° vs el peor clasificado de los 3 que pasaron."});
  var rivS=_rivalSemiB(tabIds);
  _sembrarLlaveB("Semifinal", rivS, LIGUILLA_B_FECHAS.Semifinal);
}
function _estimarGanadorLiguillaB(ids){
  var pool=(ids||[]).slice(0,8);
  pool.sort(function(a,b){ return _fuerzaId(b)-_fuerzaId(a); });
  return pool[0]||null;
}

function filasTablaActual(){
  var ids, fase, nota, computed=null;
  if(typeof E==="undefined"||!E){
    ids=(typeof LIGA_ACT!=="undefined")?LIGA_ACT.map(function(c){ return c.id; }):[];
    return {ids:ids, nota:null, titulo:"Tabla de posiciones", filas:null};
  }
  if(E.eraBase==="2026b"){
    ids=(typeof LIGA_ACT!=="undefined")?LIGA_ACT.map(function(c){ return c.id; }):[];
    nota="Liga de Ascenso 2026: 1° sube directo a Primera. 2°–8° juegan liguilla por el segundo cupo. El último baja a Segunda. De Primera bajan 2.";
    if(E.flags&&E.flags.liguillaBFase) nota+=" La liguilla es otro cuadro: estos puntos son de la fase regular.";
    return {ids:ids, nota:nota, titulo:"Tabla · Liga de Ascenso", filas:null};
  }
  if(E.eraBase==="arg2026"){
    var zA=(typeof zonaArgDe==="function")?zonaArgDe(E.club):"A";
    var clubsA=(typeof clubsZonaArg==="function")?clubsZonaArg(zA):[];
    ids=clubsA.map(function(c){ return c.id; });
    if(!ids.length && typeof LIGA_ACT!=="undefined") ids=LIGA_ACT.map(function(c){ return c.id; });
    var faseA=E.flags&&E.flags.argFase;
    computed=(typeof tablaViva==="function")?tablaViva(ids, E.tabla||{}):null;
    nota=faseA==="clausura"
      ?"Clausura · Zona "+zA+" (15 clubes, 14 PJ, tabla desde 0). El Apertura ya cerró. Copa Argentina a partido único."
      :"Apertura 2026 · Zona "+zA+" (sorteo AFA: 15 clubes, 14 PJ + 1 bye). Top de zona pelea el título. Copa Argentina en paralelo.";
    return {ids:ids, nota:nota, titulo:(faseA==="clausura"?"Clausura":"Apertura")+" · Zona "+zA, filas:computed};
  }
  if(E.eraBase!=="2026c"){
    ids=(typeof LIGA_ACT!=="undefined")?LIGA_ACT.map(function(c){ return c.id; }):[];
    nota=(E.eraBase===2026||E.eraBase==="2026")?"Liga de Primera 2026: 30 fechas. Bajan los 2 últimos. Libertadores: 1° y 2° + Copa de la Liga (Chile 3) + repechaje 3° vs Copa Chile (Chile 4). Si un club ya está en Libertadores, el cupo lo hereda el siguiente. Si el campeón de Liga también gana Libertadores, el 2° hereda Chile 1. Sudamericana: 4°–6° y el que pierde el repechaje. Un club no va a las dos.":null;
    return {ids:ids, nota:nota, titulo:"Tabla de posiciones", filas:null};
  }
  fase=E.flags&&E.flags.segundaFase;
  var z=(typeof clubZona==="function")?clubZona(E.club):"sur";
  if(!fase||fase==="zonal"||fase==="playoff4"){
    computed=tablaZonaC(z, E.club);
    ids=computed.map(function(x){ return x.id; });
    nota="Zona "+(z==="norte"?"Norte":"Sur")+" (formato real 2026: 7 clubes, 12 PJ + 2 byes). Tus partidos + el resto de cada fecha, misma física Poisson. Top 3 → liguilla de ascenso (7, se parte de cero). 4°s se cruzan. Bottom 3 → permanencia.";
    return {ids:ids, nota:nota, titulo:"Tabla · Zona "+(z==="norte"?"Norte":"Sur"), filas:computed};
  }
  var lig=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"&&(p.fase==="liguillaAscenso"||p.fase==="liguillaDescenso"); });
  computed=tablaLiguillaC(fase, E.club);
  ids=computed.map(function(x){ return x.id; });
  if(!ids.length){
    ids=[E.club];
    lig.forEach(function(p){ if(p.rivalId&&ids.indexOf(p.rivalId)<0) ids.push(p.rivalId); });
  }
  nota=fase==="liguillaAscenso"
    ?"Liguilla de ascenso: 7 clubes, ida y vuelta, puntaje desde 0 (no arrastra la zonal). Volvés a cruzar rivales de tu zona: es el formato real, no un bug. El 1° sube a Primera B. Esta tabla se juega partido a partido."
    :"Liguilla de permanencia: 7 clubes, tabla nueva. Los últimos pierden la categoría.";
  return {ids:ids, nota:nota, titulo:fase==="liguillaAscenso"?"Liguilla de ascenso · 7 clubes":"Liguilla de permanencia · 7 clubes", filas:computed};
}

/* ---------- wraps ---------- */
(function wrapCalendario54(){
  if(typeof construirCalendario!=="function"||construirCalendario._fmt54) return;
  var orig=construirCalendario;
  construirCalendario=function(clubId, anio, conCopa){
    var cal=orig(clubId, anio, conCopa)||[];
    var esC=(typeof E!=="undefined"&&E&&E.eraBase==="2026c");
    var esB=(typeof E!=="undefined"&&E&&E.eraBase==="2026b");
    var esP=(typeof E!=="undefined"&&E&&(E.eraBase===2026||E.eraBase==="2026"));
    /* 8.00 · copas según la categoría VIGENTE, no la de 2026 original */
    if(!esP){
      cal=cal.filter(function(p){ return !(p.tipo==="copa"&&p.torneo==="Copa de la Liga"); });
    }
    if(esC){
      cal=cal.filter(function(p){ return !(p.tipo==="copa"&&p.torneo==="Copa Chile"); });
      cal=cal.filter(function(p){ return p.tipo!=="liga"; });
      partidosZonalesC(clubId).forEach(function(p){ cal.push(p); });
    }
    if(esP && anio>=2026 && (typeof juegaCopaDeLaLiga!=="function" || juegaCopaDeLaLiga(clubId, anio))){
      partidosCopaLigaGrupo(clubId, anio).forEach(function(p){ cal.push(p); });
      partidosSupercopaDe(clubId, anio).forEach(function(p){ cal.push(p); });
    }
    cal.sort(function(a,b){
      var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
      var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
      return oa-ob;
    });
    return cal;
  };
  construirCalendario._fmt54=true;
  if(orig._copas33) construirCalendario._copas33=orig._copas33;
  if(orig._hist) construirCalendario._hist=orig._hist;
})();

(function wrapResolver54(){
  if(typeof resolverCopa!=="function"||resolverCopa._fmt54) return;
  var orig=resolverCopa;
  resolverCopa=function(part, yo, otro){
    if(part&&part.torneo==="Copa de la Liga"){ resolverCopaLiga(part, yo, otro); return; }
    if(part&&part.torneo==="Supercopa"){ resolverSupercopa(part, yo, otro); return; }
    if(part&&part.torneo==="Liguilla de Ascenso"){ resolverLiguillaB(part, yo, otro); return; }
    var keep=(E.calendario||[]).filter(function(p){
      return p.tipo==="copa"&&(p.torneo==="Copa de la Liga"||p.torneo==="Supercopa"||p.torneo==="Liguilla de Ascenso"||p.torneo==="Copa Chile")&&!p.jugado;
    });
    orig(part, yo, otro);
    keep.forEach(function(p){ if(E.calendario.indexOf(p)<0) E.calendario.push(p); });
  };
  resolverCopa._fmt54=true;
  if(orig._32) resolverCopa._32=orig._32;
  if(orig._33) resolverCopa._33=orig._33;
})();

(function wrapTerminar54(){
  if(typeof terminarPartido!=="function"||terminarPartido._fmt54) return;
  var orig=terminarPartido;
  terminarPartido=function(P){
    var part=P&&P.part;
    var skip=part&&part.tipo==="liga"&&(part.fase==="playoff4"||part.fase==="liguillaAscenso"||part.fase==="liguillaDescenso");
    var snap=null;
    if(skip&&typeof E!=="undefined"&&E&&E.tabla){
      try{ snap=JSON.parse(JSON.stringify(E.tabla)); }catch(e){ snap=null; }
    }
    var res=orig(P);
    if(skip&&snap){
      /* cosecha Poisson de ESTA fecha a la tabla de liguilla, sin ensuciar la zonal */
      try{
        if(!E.tablaLiguilla) E.tablaLiguilla={};
        var ids={};
        Object.keys(E.tabla||{}).forEach(function(id){ ids[id]=1; });
        Object.keys(snap).forEach(function(id){ ids[id]=1; });
        Object.keys(ids).forEach(function(id){
          var now=E.tabla[id]||{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
          var old=snap[id]||{pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
          var dPj=(now.pj||0)-(old.pj||0);
          if(dPj<=0) return;
          if(!E.tablaLiguilla[id]) E.tablaLiguilla[id]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};
          var t=E.tablaLiguilla[id];
          t.pj+=dPj;
          t.pg+=(now.pg||0)-(old.pg||0);
          t.pe+=(now.pe||0)-(old.pe||0);
          t.pp+=(now.pp||0)-(old.pp||0);
          t.gf+=(now.gf||0)-(old.gf||0);
          t.gc+=(now.gc||0)-(old.gc||0);
          t.pts+=(now.pts||0)-(old.pts||0);
        });
        if(part&&part.fxRonda!=null){
          E.flags=E.flags||{};
          E.flags.liguillaCSim=E.flags.liguillaCSim||{};
          E.flags.liguillaCSim[part.fxRonda]=1;
        }
      }catch(e){}
      E.tabla=snap;
    }
    try{ avanzarFaseSegunda(P&&P.part); }catch(e){}
    try{ avanzarLiguillaB(P&&P.part); }catch(e){}
    return res;
  };
  terminarPartido._fmt54=true;
})();

(function wrapAscenso54(){
  if(typeof procesarAscensoDescenso!=="function"||procesarAscensoDescenso._fmt54) return;
  var orig=procesarAscensoDescenso;
  procesarAscensoDescenso=function(){
    if(typeof E==="undefined"||!E||!(E.eraBase===2026||E.eraBase==="2026"||E.eraBase==="2026b"||E.eraBase==="2026c"))
      return orig();
    if(typeof initLigaMod==="function") initLigaMod();
    if(!E.ligaMod) return orig();
    var orden={};
    var tiers=[2026,"2026b"];
    if(E.ligaMod["2026c"]) tiers.push("2026c");
    tiers.forEach(function(t){
      var ids=(E.ligaMod[t]||[]).slice();
      orden[t]=(E.eraBase===t||(t===2026&&(E.eraBase===2026||E.eraBase==="2026")))
        ?((typeof _ordenRealDiv==="function")?_ordenRealDiv(ids):ids)
        :((typeof _ordenSimDiv==="function")?_ordenSimDiv(ids):ids);
    });
    if(E.eraBase==="2026c"&&E.tabla&&E.tabla[E.club]){
      if(E.flags&&E.flags.ligaCCampeon) E.tabla[E.club].pts=999;
      else if(E.flags&&E.flags.ligaCBaja) E.tabla[E.club].pts=-999;
      orden["2026c"]=(typeof _ordenRealDiv==="function")?_ordenRealDiv((E.ligaMod["2026c"]||[]).slice()):orden["2026c"];
    }
    var pr=orden[2026]||[];
    var b=orden["2026b"]||[];
    var c=orden["2026c"]||[];
    var baja1=pr[pr.length-1], baja2=pr[pr.length-2];
    var sube1, sube2;
    if(E.eraBase==="2026b"){
      if(E.flags&&E.flags.ligaBCampeon){
        sube1=E.club;
        sube2=_estimarGanadorLiguillaB(b.filter(function(id){ return id!==E.club; }).slice(0,7));
      } else if(E.flags&&E.flags.ligaBLiguilla){
        sube1=(b[0]===E.club)?b[1]:b[0];
        sube2=E.club;
      } else {
        sube1=b[0];
        sube2=(b[1]===E.club)?b[2]:b[1];
      }
    } else {
      sube1=b[0];
      sube2=b[1];
    }
    if(sube1===sube2) sube2=b.filter(function(id){ return id!==sube1; })[0]||sube2;
    var cambios=[];
    function pushCambio(up,lo,baja,sube){
      if(baja&&sube&&baja!==sube) cambios.push({up:up,lo:lo,baja:baja,sube:sube});
    }
    pushCambio(2026,"2026b",baja1,sube1);
    if(baja2&&baja2!==baja1&&sube2&&sube2!==sube1) pushCambio(2026,"2026b",baja2,sube2);
    if(c.length){
      var bajaB=b[b.length-1];
      if(E.eraBase==="2026b"&&E.flags&&E.flags.ligaBBaja) bajaB=E.club;
      if(bajaB===sube1||bajaB===sube2) bajaB=b.filter(function(id){ return id!==sube1&&id!==sube2; }).pop();
      var subeC=null;
      /* 7.993 · la liguilla de 7 ES el torneo. El 1° de esa tabla sube.
         Ya no hay final de 3 botones contra el campeón de la otra zona. */
      if(E.eraBase==="2026c"&&E.flags&&E.flags.ligaCCampeon) subeC=E.club;
      else {
        var poolC=(c||[]).filter(function(id){ return id!==E.club; });
        subeC=(typeof _ordenSimDiv==="function")?_ordenSimDiv(poolC)[0]:poolC[0];
      }
      if(subeC) pushCambio("2026b","2026c",bajaB,subeC);
    }
    E.liguillaPend=null;
    if(!cambios.length){
      if(E.liguillaPend){ var lm0={tipo:"liguilla",pend:E.liguillaPend}; E.ascensoMsg=lm0; return lm0; }
      return orig();
    }
    cambios.forEach(function(ch){
      E.ligaMod[ch.up]=E.ligaMod[ch.up].filter(function(id){ return id!==ch.baja; }).concat([ch.sube]);
      E.ligaMod[ch.lo]=E.ligaMod[ch.lo].filter(function(id){ return id!==ch.sube; }).concat([ch.baja]);
      if(ch.lo==="2026c" && typeof _zonaSegInit==="function"){
        var zs=_zonaSegInit();
        var zLibre=zs[ch.sube]||"norte";
        delete zs[ch.sube];
        if(ch.baja) zs[ch.baja]=zLibre;
      }
    });
    var msg=null;
    cambios.forEach(function(ch){
      if(ch.sube===E.club){ E.eraBase=ch.up; msg={tipo:"ascenso",baja:ch.baja,sube:ch.sube,up:ch.up,lo:ch.lo}; }
      else if(ch.baja===E.club){ E.eraBase=ch.lo; msg={tipo:"descenso",baja:ch.baja,sube:ch.sube,up:ch.up,lo:ch.lo}; }
    });
    if(!msg) msg={tipo:"otros",baja:cambios[0].baja,sube:cambios[0].sube,up:cambios[0].up,lo:cambios[0].lo,todos:cambios};
    msg.bajan=cambios.filter(function(ch){ return ch.up===2026||ch.up==="2026"; }).map(function(ch){ return ch.baja; });
    msg.suben=cambios.filter(function(ch){ return ch.up===2026||ch.up==="2026"; }).map(function(ch){ return ch.sube; });
    if(!msg.bajan.length) msg.bajan=cambios.map(function(ch){ return ch.baja; });
    if(!msg.suben.length) msg.suben=cambios.map(function(ch){ return ch.sube; });
    E.ascensoMsg=msg;
    if(typeof activarLiga==="function") activarLiga(E.eraBase);
    function nom(id){ return (typeof nombreDeClub==="function")?nombreDeClub(id):id; }
    function ndiv(t){ return (typeof _nombreDiv==="function")?_nombreDiv(t):(t===2026?"Primera":(t==="2026b"?"Primera B":"Segunda")); }
    if(typeof notificar==="function"){
      if(msg.tipo==="ascenso") notificar({t:"🎉 ¡ASCENSO a "+ndiv(msg.up)+"!",tipo:"bueno",bandeja:true,d:E.clubNombre+" sube. Bajó "+nom(msg.baja)+". El año que viene se juega en "+ndiv(msg.up)+"."});
      else if(msg.tipo==="descenso") notificar({t:"📉 Descenso a "+ndiv(msg.lo),tipo:"malo",bandeja:true,d:E.clubNombre+" perdió la categoría. Subió "+nom(msg.sube)+". El año que viene se pelea el ascenso en "+ndiv(msg.lo)+"."});
      else {
        var txt=cambios.map(function(ch){ return nom(ch.sube)+" sube a "+ndiv(ch.up)+" · baja "+nom(ch.baja); }).join(". ");
        notificar({t:"Ascensos y descensos",tipo:"neutro",bandeja:false,d:txt+" Primera mueve 2 (el 1° de la B y el ganador de la liguilla)."});
      }
    }
    if(typeof recordar==="function" && msg.tipo!=="otros") recordar("categoria",(msg.tipo==="ascenso"?"ascendiste a "+ndiv(msg.up)+" con ":"descendiste a "+ndiv(msg.lo)+" con ")+E.clubNombre,{peso:"alto",tono:msg.tipo==="ascenso"?"bueno":"malo"});
    if(E.liguillaPend){ var lm={tipo:"liguilla",pend:E.liguillaPend}; E.ascensoMsg=lm; return lm; }
    return msg;
  };
  procesarAscensoDescenso._fmt54=true;
})();

/* ---------- cupos CONMEBOL 2026+ (cascada: un club, un asiento) ---------- */
function _estimaRepechajeChile4(pos){
  /* 3° de Liga es favorito. El campeón de Copa Chile gana el extra si terminó cerca (4°–6°). */
  return (pos||99)<=6;
}
function _posClubTabla(id){
  if(!id || typeof tablaOrdenada!=="function") return 99;
  var t=tablaOrdenada()||[];
  if(!t.length) return 99;
  var played=false, i;
  for(i=0;i<t.length;i++) if((t[i].pj||0)>0 || (t[i].pts||0)>0){ played=true; break; }
  if(!played) return 99;
  for(i=0;i<t.length;i++) if(t[i].id===id) return i+1;
  return 99;
}
function cuposChileDesde(pos, copaChile, b){
  var flags=(typeof E!=="undefined"&&E&&E.flags)||{};
  var era=(typeof E!=="undefined"&&E)?E.eraBase:null;
  var anio=(typeof E!=="undefined"&&E&&E.anio)||2026;
  var next=anio+1;
  var yo=(typeof E!=="undefined"&&E&&E.club)||null;
  if(era==="2026c") return {lib:false,sud:false,via:"",detalle:"Segunda no clasifica a copas CONMEBOL.",vias:[]};
  var promoB=!!(b&&(flags.ligaBCampeon||flags.ligaBLiguilla));
  if(b&&!promoB){
    return {lib:false,sud:false,via:"",detalle:"La B no clasifica a Libertadores ni Sudamericana. El premio es subir. Si ganás Copa Chile y no subís, no hay repechaje Chile 4: hay que estar en Primera el año siguiente.",vias:[]};
  }
  var vias=[], lib=false, sud=false;
  var defLib=!!flags.copaCampeon, defSud=!!flags.copaSudCampeon;
  var extra=defLib||defSud;
  var copaLiga=!!flags.copaLigaCampeon;
  var cc=!!(copaChile||flags.copaChileCampeon);
  var ccSub=!!flags.copaChileSubcampeon;
  var npcLib=flags.copaCampeonClub&&flags.copaCampeonClub!==yo?flags.copaCampeonClub:null;
  var npcSud=flags.copaSudCampeonClub&&flags.copaSudCampeonClub!==yo?flags.copaSudCampeonClub:null;
  var npcCL=flags.copaLigaCampeonClub&&flags.copaLigaCampeonClub!==yo?flags.copaLigaCampeonClub:null;
  var npcCC=flags.copaChileCampeonClub&&flags.copaChileCampeonClub!==yo?flags.copaChileCampeonClub:null;
  var primeroExtra=_posClubTabla(npcLib)===1||_posClubTabla(npcSud)===1;
  var tablaCorrida=!!((extra&&pos===1)||primeroExtra);
  if(!b){
    if(defLib){ lib=true; vias.push("campeón de Libertadores "+anio+" (cupo CONMEBOL extra: no consume Chile 1–4)"); }
    if(defSud){ lib=true; vias.push("campeón de Sudamericana "+anio+" (entra a Libertadores "+next+" como cupo extra: no consume Chile 1–4)"); }
    if(pos===1){
      if(extra) vias.push("Chile 1: ya tenés Libertadores por el cupo extra, el 2° hereda Chile 1 (el 3° hereda Chile 2; el repechaje Chile 4 lo juega el 4°)");
      else { lib=true; vias.push("Chile 1 · campeón de Liga"); }
    }
    if(pos===2){
      if(extra) vias.push("Chile 2: ya tenés Libertadores por el cupo extra, el siguiente de la tabla hereda Chile 2");
      else if(primeroExtra){ lib=true; vias.push("Chile 1 · subcampeón: el campeón ya está por cupo CONMEBOL extra, heredás Chile 1"); }
      else { lib=true; vias.push("Chile 2 · subcampeón de Liga"); }
    }
    if(copaLiga){
      if(lib) vias.push("Copa de la Liga: ya tenés Libertadores, el Chile 3 lo hereda el siguiente de la tabla que no esté clasificado");
      else { lib=true; vias.push("Chile 3 · campeón Copa de la Liga"); }
    }
    var clNpcYaLib=_posClubTabla(npcCL)===1||_posClubTabla(npcCL)===2||(npcCL&&(npcCL===npcLib||npcCL===npcSud));
    if(!copaLiga&&clNpcYaLib&&!lib){
      var heredaCL=tablaCorrida?4:3;
      if(pos===heredaCL){ lib=true; vias.push("Chile 3 · lo hereda el siguiente de la tabla (el campeón de Copa de la Liga ya tiene Libertadores)"); }
    }
    if(pos===3&&tablaCorrida&&!lib){
      lib=true; vias.push("Chile 2 · 3° de Liga: el campeón ya está por cupo CONMEBOL extra y el 2° heredó Chile 1");
    }
    if(pos===3&&extra) vias.push("Chile 4: ya tenés Libertadores por el cupo extra, el repechaje lo juega el 4°");
  }
  var yaLib=lib;
  var playoffTerceroPos=(tablaCorrida&&!copaLiga)?4:3;
  if(!b&&pos===3&&yaLib) playoffTerceroPos=4;
  var soyPlayoffTercero=!b&&pos===playoffTerceroPos&&!yaLib;
  var ccLibre=cc&&!yaLib;
  var ccSubLibre=false;
  if(ccSub&&!cc&&!yaLib){
    var champPos=_posClubTabla(npcCC);
    var champYaLib=champPos===1||champPos===2||(tablaCorrida&&champPos===3)||(npcCC&&(npcCC===npcCL||npcCC===npcLib||npcCC===npcSud));
    if(champYaLib) ccSubLibre=true;
  }
  if(cc&&yaLib) vias.push("Copa Chile: el repechaje Chile 4 lo juega el subcampeón (bases ANFP art. 81: el campeón ya tiene Libertadores)");
  if(ccSubLibre) vias.push("subcampeón de Copa Chile: el campeón ya tiene Libertadores, heredás el repechaje Chile 4 (bases ANFP art. 81)");
  if(soyPlayoffTercero&&(ccLibre||ccSubLibre)){
    lib=true;
    vias.push(playoffTerceroPos===3
      ?"Chile 4 · 3° de Liga y campeón Copa Chile (sin repechaje)"
      :"Chile 4 · "+playoffTerceroPos+"° de Liga y campeón Copa Chile (el 3° ya está en Libertadores; sin repechaje)");
  } else if(soyPlayoffTercero){
    lib=true;
    vias.push(playoffTerceroPos===3
      ?"Chile 4 · 3° de Liga (repechaje vs campeón Copa Chile; se estima a tu favor, no se juega el extra)"
      :"Chile 4 · "+playoffTerceroPos+"° de Liga (el 3° ya está en Libertadores; repechaje estimado vs Copa Chile, a tu favor)");
  } else if(ccLibre||ccSubLibre){
    if(_estimaRepechajeChile4(b?4:pos)){
      lib=true;
      vias.push("Chile 4 · ganaste el repechaje estimado vs el "+playoffTerceroPos+"° de Liga (por Copa Chile"+(ccSubLibre?" · como subcampeón":"")+")");
    } else {
      sud=true;
      vias.push("Chile 4 Sudamericana · el "+playoffTerceroPos+"° de Liga se estima que gana el repechaje");
    }
  }
  var sud0=tablaCorrida?5:4;
  if(!lib&&!sud&&!b&&pos>=sud0&&pos<=sud0+2){
    sud=true;
    vias.push("Sudamericana Chile "+(pos-sud0+1)+" · "+pos+"° de Liga");
  }
  if(lib) sud=false;
  var detalle;
  if(lib) detalle="Libertadores "+next+": "+vias.join(". ")+". Un club no va a Libertadores y Sudamericana el mismo año. El grupo lo sortea el juego.";
  else if(sud) detalle="Sudamericana "+next+": "+vias.join(". ")+".";
  else detalle=b?"La B no clasifica a copas CONMEBOL.":"Sin cupo CONMEBOL "+next+". Hay que pelearlo en la liga, Copa de la Liga o Copa Chile.";
  return {lib:!!lib,sud:!!sud,via:vias.join(" · "),detalle:detalle,vias:vias};
}

(function wrapCupos54(){
  if(typeof cuposDesdeTemporada!=="function"||cuposDesdeTemporada._fmt54) return;
  var orig=cuposDesdeTemporada;
  cuposDesdeTemporada=function(pos, copaChile, b){
    var era=(typeof E!=="undefined"&&E)?E.eraBase:null;
    var anio=(typeof E!=="undefined"&&E&&E.anio)||0;
    if(era==="2026c"||era==="2026b"||((era===2026||era==="2026")&&anio>=2026))
      return cuposChileDesde(pos, copaChile, b||era==="2026b");
    var c=orig(pos, copaChile, b);
    if(typeof E!=="undefined"&&E&&E.flags&&E.flags.copaLigaCampeon) c.lib=true;
    return c;
  };
  cuposDesdeTemporada._fmt54=true;
})();

(function wrapFin54(){
  if(typeof finDeTemporada!=="function"||finDeTemporada._fmt54) return;
  var orig=finDeTemporada;
  finDeTemporada=function(){
    var r=orig();
    try{
      if(E&&E.flags){
        if(E.eraBase==="2026c"){
          if(E.flags.ligaCCampeon){
            r.campeon=true; r.pos=1;
            if(E.titulos&&E.titulos.indexOf(E.anio+" · Campeón de Segunda División")<0)
              E.titulos.push(E.anio+" · Campeón de Segunda División");
          } else if(E.flags.ligaCBaja){
            r.campeon=false;
            r.pos=(typeof LIGA_ACT!=="undefined"&&LIGA_ACT.length)?LIGA_ACT.length:14;
          }
        }
        if(E.eraBase==="2026b"){
          if(E.flags.ligaBCampeon){
            r.campeon=true; r.pos=1;
            if(E.titulos&&E.titulos.indexOf(E.anio+" · Campeón de Primera B")<0)
              E.titulos.push(E.anio+" · Campeón de Primera B");
          } else if(E.flags.ligaBBaja){
            r.pos=(typeof LIGA_ACT!=="undefined"&&LIGA_ACT.length)?LIGA_ACT.length:16;
          }
        }
        var pos=r&&r.pos;
        E.flags.superCopaCupo=false;
        if((E.eraBase===2026||E.eraBase==="2026") && (pos===1||pos===2)) E.flags.superCopaCupo=true;
        if(E.flags.copaChileCampeon) E.flags.superCopaCupo=true;
        if(E.flags.copaLigaCampeon) E.flags.superCopaCupo=true;
      }
    }catch(e){}
    return r;
  };
  finDeTemporada._fmt54=true;
  if(orig._33) finDeTemporada._33=orig._33;
})();

(function wrapNuevoAnio56(){
  if(typeof nuevoAnio!=="function"||nuevoAnio._fmt56) return;
  var orig=nuevoAnio;
  nuevoAnio=function(){
    orig.apply(this, arguments);
    if(!E||!E.flags) return;
    var keepSC=!!E.flags.superCopaCupo;
    var keepLib=E.flags.cupoLib, keepSud=E.flags.cupoSud;
    [
      "ligaBCampeon","ligaBLiguilla","ligaBBaja","liguillaBListo","liguillaBFase","ligaBPos","liguillaBTabla",
      "ligaCCampeon","ligaCBaja","segundaFase","segundaZona","segundaPosZonal","segundaGanoPlayoff",
      "liguillaCIds","zonaCSim","liguillaCSim",
      "copaLigaCampeon","copaLigaGrupo","copaLigaRivales","copaLigaCampeonClub",
      "superCopaCampeon","copaAcum","copaChileSubcampeon","copaChileCampeonClub",
      "copaCampeonClub","copaSudCampeonClub","cupoVia"
    ].forEach(function(k){ delete E.flags[k]; });
    E.flags.superCopaCupo=keepSC;
    if(keepLib) E.flags.cupoLib=keepLib;
    if(keepSud) E.flags.cupoSud=keepSud;
    E.tablaLiguilla=null;
    E.liguillaPend=null;
  };
  nuevoAnio._fmt56=true;
  if(orig._hist) nuevoAnio._hist=orig._hist;
  if(orig._33) nuevoAnio._33=orig._33;
})();

(function wrapNombreTorneo54(){
  if(typeof nombreTorneo!=="function"||nombreTorneo._fmt54) return;
  var orig=nombreTorneo;
  nombreTorneo=function(part){
    if(part&&part.tipo==="copa") return part.torneo||"Copa";
    if(typeof E!=="undefined"&&E&&E.eraBase==="2026c"){
      if(part&&part.ronda) return "Segunda División · "+part.ronda;
      return "Segunda División";
    }
    if(typeof E!=="undefined"&&E&&E.eraBase==="2026b") return "Liga de Ascenso";
    return orig(part);
  };
  nombreTorneo._fmt54=true;
})();

(function wrapCanal54(){
  if(typeof canalDelPartido!=="function"||canalDelPartido._fmt54) return;
  var orig=canalDelPartido;
  canalDelPartido=function(part){
    var t=(part&&part.torneo)||"";
    if(/Copa de la Liga/i.test(t)) return {n:"TNT Sports",d:"Copa de la Liga. Solo Primera: grupos y después Final Four."};
    if(/Supercopa/i.test(t)) return {n:"TNT Sports",d:"Supercopa. Final Four, cancha neutral, primer título del año."};
    if(/Liguilla de Ascenso/i.test(t)) return {n:"TNT Sports / CDF",d:"Liguilla de la B. Ida y vuelta. Acá se define el segundo cupo a Primera."};
    if(typeof E!=="undefined"&&E&&E.eraBase==="2026c") return {n:"streaming / CDF 2",d:"Segunda División. Poco primer canal, mucho pueblo."};
    if(typeof E!=="undefined"&&E&&E.eraBase==="2026b") return {n:"TNT Sports / CDF",d:"Liga de Ascenso. 30 fechas, después liguilla 2°–8°."};
    return orig(part);
  };
  canalDelPartido._fmt54=true;
})();

(function wrapExpectativa55(){
  if(typeof expectativa!=="function"||expectativa._fmt55) return;
  var orig=expectativa;
  expectativa=function(){
    var b=typeof E!=="undefined"&&E&&E.eraBase==="2026b";
    var p=(E&&E.ind&&E.ind.prestigio)||50;
    if(b) return p>=60?{pos:2,txt:"pelear el ascenso (1° directo, 2°–8° liguilla)"}:{pos:8,txt:"entrar a la liguilla de ascenso"};
    return orig();
  };
  expectativa._fmt55=true;
})();

/* ---------- arcos Segunda (huecos) ---------- */
(function arcosSegunda54(){
  if(typeof ARCOS_EQUIPO!=="object") return;
  function put(id, arco){ if(!ARCOS_EQUIPO[id]) ARCOS_EQUIPO[id]=[arco]; }
  put("SMO",{id:"smo_chaguito",t:"El chaguito no es Tercera",desc:"Santiago Morning tiene historia de Primera y está en Segunda. La Pintana pide que no se acostumbren.",
    capitulos:[
      {id:"smo_1",t:"Historia vs categoría",ctx:"El chaguito jugó Primera. Hoy pelea zonas en Segunda. La gente nombra 1942; la caja nombra 2026.",
       ops:[{t:"Hablar claro: primero volver a la B",d:"Honesto. Poco épico.",grupos:{socios:8,directorio:6,hinchada:-4},mem:"hablaste claro en Morning: primero volver a la B",va:"smo_2"},
            {t:"Prometer Primera en dos años",d:"La Pintana se prende.",grupos:{hinchada:12,prensa:6,directorio:-6},mem:"prometiste Primera rápido con Morning",va:"smo_2"}]},
      {id:"smo_2",t:"La Pintana de domingo",ctx:"¿El municipal es de los de siempre o de la postal del descenso?",
       ops:[{t:"Precios para el barrio",d:"Tribuna local.",ef:{plata:-12},grupos:{comunidad:12,hinchada:10},mem:"cuidaste al hincha de La Pintana",cierra:true,logro:"de_la_comunidad"},
            {t:"Cobrar la marca bohemia",d:"Caja de nostalgia.",ef:{plata:35},grupos:{sponsors:8,comunidad:-8},mem:"cobraste Morning como postal bohemia",cierra:true}]}
    ]});
  put("LSC",{id:"lsc_minero",t:"La lamparita no se apaga",desc:"Lota Schwager es carbón, Coronel y un pueblo que ya vio al club desaparecer.",
    capitulos:[
      {id:"lsc_1",t:"Volver a existir",ctx:"El club volvió al profesionalismo. La cuenca pide que no sea un verano.",
       ops:[{t:"El club es de la cuenca",d:"Identidad de pueblo.",grupos:{comunidad:14,hinchada:10,sponsors:-4},mem:"afirmaste que Lota es de la cuenca",va:"lsc_2"},
            {t:"Administrarlo como marca minero",d:"Plata, recelo.",ef:{plata:30},grupos:{sponsors:8,comunidad:-8},mem:"trataste a Lota como marca minero",va:"lsc_2"}]},
      {id:"lsc_2",t:"El Schwager de semana",ctx:"Cuando hay visita se llena. El resto, viento y recuerdos.",
       ops:[{t:"Precios de pueblo",d:"Caja chica, ruido alto.",ef:{plata:-10},grupos:{hinchada:12,comunidad:10},mem:"llenaste el Schwager con su gente",cierra:true,logro:"de_la_comunidad"},
            {t:"Cobrar el partido grande",d:"Más por cabeza.",ef:{plata:28},grupos:{sponsors:6,hinchada:-6},mem:"cobraste caro el partido grande de Lota",cierra:true}]}
    ]});
  put("LIN",{id:"lin_maule",t:"Linares no es sucursal",desc:"El albirrojo del Maule subió de Tercera A. El peligro es que lo usen de puente.",
    capitulos:[
      {id:"lin_1",t:"Pueblo o puente",ctx:"Un grande quiere usar a Linares de sucursal. El Fiscal pide club propio.",
       ops:[{t:"El club es de Linares",d:"Identidad.",grupos:{comunidad:14,hinchada:10,sponsors:-6},mem:"dejaste a Linares en Linares",va:"lin_2"},
            {t:"Aceptar el puente",d:"Plata, alma ajena.",ef:{plata:40},grupos:{directorio:8,comunidad:-10},mem:"aceptaste que Linares sea puente",va:"lin_2"}]},
      {id:"lin_2",t:"El salto",ctx:"La liguilla de ascenso se ve cerca o se ve lejos, según el mes.",
       ops:[{t:"Armar para quedarse, no para un verano",d:"Lento.",grupos:{camarin:10,socios:8},mem:"armaste Linares para quedarse",cierra:true},
            {t:"Todo al ascenso ahora",d:"Heroico y frágil.",grupos:{hinchada:12,directorio:-6},mem:"apostaste todo el ascenso de Linares ahora",cierra:true}]}
    ]});
  put("CLC",{id:"clc_huaso",t:"Colchagua no es postal de vino",desc:"San Fernando, valle, herradura. El club volvió y no quiere ser souvenir.",
    capitulos:[
      {id:"clc_1",t:"Valle o marca",ctx:"Aparece un inversionista que habla de «marca Colchagua».",
       ops:[{t:"El club es de San Fernando",d:"Casa.",grupos:{comunidad:14,hinchada:10,sponsors:-6},mem:"dejaste Colchagua en San Fernando",va:"clc_2"},
            {t:"Abrir la marca del valle",d:"Plata, recelo.",ef:{plata:36},grupos:{sponsors:10,comunidad:-10},mem:"abriste Colchagua como marca de vino",va:"clc_2"}]},
      {id:"clc_2",t:"Huaso de verdad",ctx:"¿Se llena el municipal o se cobra la postal?",
       ops:[{t:"Precios de pueblo",d:"Tribuna viva.",ef:{plata:-10},grupos:{hinchada:12,comunidad:10},mem:"llenaste Colchagua con su gente",cierra:true,logro:"de_la_comunidad"},
            {t:"Cobrar el enoturismo",d:"Caja de fin de semana.",ef:{plata:32},grupos:{sponsors:8,hinchada:-6},mem:"cobraste Colchagua como postal de valle",cierra:true}]}
    ]});
  put("TRA",{id:"tra_condor",t:"Los Andes no es paso",desc:"Trasandino es cordillera y un club de 1906. El peligro es ser escala de Santiago.",
    capitulos:[
      {id:"tra_1",t:"Cóndor o sucursal",ctx:"Santiago mira Los Andes como paso. El pueblo pide club de ciudad.",
       ops:[{t:"Sello de cordillera",d:"Menos nombres, más casa.",grupos:{comunidad:12,hinchada:10,directorio:-4},mem:"le diste a Trasandino un sello de Los Andes",va:"tra_2"},
            {t:"Traer nombres de afuera",d:"Ilusión rápida.",ef:{plata:-40},grupos:{hinchada:6,comunidad:-6},mem:"llenaste Trasandino de nombres de afuera",va:"tra_2"}]},
      {id:"tra_2",t:"El Regional de domingo",ctx:"¿Horario de gente de a pie o de tele?",
       ops:[{t:"Domingo, entrada barata",d:"Tribuna viva.",ef:{plata:-14},grupos:{comunidad:12,hinchada:10},mem:"pusiste a Trasandino en horario de gente de a pie",cierra:true},
            {t:"Horario de televisión",d:"Plata de TV.",ef:{plata:40},grupos:{sponsors:8,hinchada:-6},mem:"entregaste el horario de Trasandino a la tele",cierra:true}]}
    ]});
  put("COL",{id:"col_chacabuco",t:"Colina recién llega",desc:"Campeón de Tercera A 2025. Comuna en crecimiento, club sin vitrina.",
    capitulos:[
      {id:"col_1",t:"Sobrevivir primero",ctx:"El profesionalismo come clubes nuevos. La gente pide milagro; la caja pide piso.",
       ops:[{t:"Afirmarse, no soñar en voz alta",d:"Honesto.",grupos:{socios:8,camarin:8,hinchada:-4},mem:"afirmaste a Colina sin vender humo",va:"col_2"},
            {t:"Vender el salto ya",d:"La comuna se prende.",grupos:{hinchada:12,prensa:6,directorio:-6},mem:"prometiste el salto rápido con Colina",va:"col_2"}]},
      {id:"col_2",t:"Club de comuna",ctx:"Colina crece. ¿El club crece con ella o se alquila?",
       ops:[{t:"Cantera y gente de Chacabuco",d:"Sello.",grupos:{comunidad:12,hinchada:8},mem:"armaste Colina con su comuna",cierra:true,logro:"de_la_comunidad"},
            {t:"Nombres de Santiago",d:"Ilusión de capital.",ef:{plata:-35},grupos:{prensa:6,comunidad:-6},mem:"llenaste Colina de nombres de Santiago",cierra:true}]}
    ]});
  put("OVA",{id:"ova_limari",t:"Ovalle no es escala del norte",desc:"El Ciclón del Limarí pelea abajo. La cuarta región pide club, no sucursal.",
    capitulos:[
      {id:"ova_1",t:"Lejos de todo",ctx:"El rival sufre el viaje. También el plantel.",
       ops:[{t:"Hacer de la distancia un arma",d:"Puntos feos.",grupos:{hinchada:10,camarin:8},mem:"hiciste de Ovalle un arma",va:"ova_2"},
            {t:"Pedir más fechas en el centro",d:"Cómodo, menos identidad.",grupos:{sponsors:8,comunidad:-10},mem:"sacaste a Ovalle de su casa por comodidad",va:"ova_2"}]},
      {id:"ova_2",t:"Pueblo del Limarí",ctx:"Caja chica, calor, orgullo.",
       ops:[{t:"El club es de Ovalle",d:"Pueblo.",grupos:{comunidad:14,hinchada:8},mem:"afirmaste que Ovalle es de su gente",cierra:true,logro:"de_la_comunidad"},
            {t:"Administrarlo como escala",d:"Sano y frío.",ef:{plata:32},grupos:{directorio:8,comunidad:-10},mem:"trataste a Ovalle como una escala",cierra:true}]}
    ]});
  put("CNA",{id:"cna_litoral",t:"Concón no es Viña",desc:"Club antiguo con presente chico. El litoral pide identidad propia, no postal.",
    capitulos:[
      {id:"cna_1",t:"Litoral o sucursal porteña",ctx:"Viña y Valpo tiran la manta. Concón quiere su propio himno.",
       ops:[{t:"Club de Concón",d:"Casa.",grupos:{comunidad:14,hinchada:10,sponsors:-4},mem:"afirmaste que National es de Concón",va:"cna_2"},
            {t:"Colgarse de la costa",d:"Plata de veraneo.",ef:{plata:30},grupos:{sponsors:8,comunidad:-8},mem:"colgaste a Concón de la postal del litoral",va:"cna_2"}]},
      {id:"cna_2",t:"Proyecto joven",ctx:"Sin pasado en divisiones mayores. Se escribe ahora.",
       ops:[{t:"Cantera y paciencia",d:"Lento.",grupos:{camarin:8,socios:8},mem:"armaste Concón con paciencia",cierra:true},
            {t:"Fichajes para la liguilla",d:"Ahora o nunca.",grupos:{hinchada:10,directorio:-6},mem:"apostaste la liguilla de Concón a fichajes",cierra:true}]}
    ]});
  put("BSA",{id:"bsa_brujas",t:"Salamanca no es leyenda de folleto",desc:"Las Brujas del Choapa. Pueblo, leyenda, camiseta que no se vende en Santiago.",
    capitulos:[
      {id:"bsa_1",t:"Leyenda o marketing",ctx:"Un sponsor quiere «las brujas» en cada producto. El pueblo las siente de otro modo.",
       ops:[{t:"La leyenda se queda en el pueblo",d:"Identidad.",grupos:{comunidad:14,hinchada:10,sponsors:-6},mem:"cuidaste la leyenda de Salamanca en el pueblo",va:"bsa_2"},
            {t:"Vender la marca Brujas",d:"Plata, recelo.",ef:{plata:38},grupos:{sponsors:12,comunidad:-8},mem:"vendiste la marca Brujas",va:"bsa_2"}]},
      {id:"bsa_2",t:"Zona Norte de pelea",ctx:"Salamanca encabezó la zonal. La liguilla no perdona el pecho.",
       ops:[{t:"Seguir con el sello local",d:"Menos nombres.",grupos:{comunidad:10,camarin:8},mem:"manteniste el sello de Salamanca en la liguilla",cierra:true},
            {t:"Traer un 9 de afuera",d:"Ilusión de gol.",ef:{plata:-45},grupos:{hinchada:8,comunidad:-4},mem:"trajiste un 9 de afuera a Salamanca",cierra:true}]}
    ]});
  put("RSJ",{id:"rsj_escuela",t:"San Joaquín forma, no ficha",desc:"Club-escuela de Santiago. Poco aforo, mucho cabro. El peligro es venderlos todos.",
    capitulos:[
      {id:"rsj_1",t:"Formar o vender",ctx:"Un europeo mira a un cabro de 17. El pueblo todavía no lo vio debutar.",
       ops:[{t:"Que debuten los domingos",d:"El pueblo lo ve.",grupos:{hinchada:12,camarin:8,directorio:-8},mem:"hiciste debutar a la cantera de San Joaquín",va:"rsj_2"},
            {t:"Vender y clavar el porcentaje",d:"El modelo. Caja sana.",ef:{plata:90},grupos:{directorio:12,hinchada:-10},mem:"vendiste la joya de San Joaquín apenas apareció",cierra:true}]},
      {id:"rsj_2",t:"Poco aforo",ctx:"El municipal no da para más. ¿Se crece o se cuida la escuela?",
       ops:[{t:"Seguir siendo escuela",d:"Identidad.",grupos:{comunidad:12,hinchada:8},mem:"cuidaste a San Joaquín como escuela",cierra:true,logro:"de_la_comunidad"},
            {t:"Buscar cancha más grande",d:"Más aforo, menos casa.",grupos:{sponsors:6,comunidad:-8},mem:"sacaste a San Joaquín de su cancha chica",cierra:true}]}
    ]});
  put("SCI",{id:"sci_city",t:"Santiago City escribe la primera página",desc:"Proyecto joven de la capital. Sin pasado en categorías mayores.",
    capitulos:[
      {id:"sci_1",t:"Nombre de franquicia",ctx:"«City» suena a importado. La gente de Las Condes no llena si no hay alma.",
       ops:[{t:"Arraigarse en la comuna",d:"Paciencia.",grupos:{comunidad:12,hinchada:8,sponsors:-4},mem:"trataste de arraigar a Santiago City",va:"sci_2"},
            {t:"Marca capital, marketing arriba",d:"Plata de imagen.",ef:{plata:40},grupos:{sponsors:12,comunidad:-8},mem:"trataste a Santiago City como marca capital",va:"sci_2"}]},
      {id:"sci_2",t:"Liguilla sin historia",ctx:"Se escribe ahora. No hay 1942 que citar.",
       ops:[{t:"Ganar con cabros de casa",d:"Sello.",grupos:{camarin:8,comunidad:10},mem:"armaste Santiago City con cabros de casa",cierra:true},
            {t:"Fichar experiencia de B",d:"Piso ahora.",ef:{plata:-50},grupos:{directorio:6,comunidad:-4},mem:"llenaste Santiago City de experiencia de B",cierra:true}]}
    ]});
  put("GVE",{id:"gve_huaso",t:"San Vicente no se alquila",desc:"General Velásquez, 1908, Tagua Tagua. Club de pueblo del secano.",
    capitulos:[
      {id:"gve_1",t:"Pueblo o puente",ctx:"Rancagua queda cerca. Alguien ofrece «usar el club».",
       ops:[{t:"El club es de San Vicente",d:"Casa.",grupos:{comunidad:14,hinchada:10,sponsors:-6},mem:"dejaste a Velásquez en San Vicente",va:"gve_2"},
            {t:"Abrir a plata de afuera",d:"Caja, recelo.",ef:{plata:34},grupos:{directorio:8,comunidad:-10},mem:"abriste Velásquez a plata de afuera",va:"gve_2"}]},
      {id:"gve_2",t:"Cuarto de la zonal",ctx:"El playoff de 4tos define el año.",
       ops:[{t:"Jugarlo como final",d:"Carácter.",grupos:{hinchada:10,camarin:8},mem:"jugaste el playoff de Velásquez como final",cierra:true},
            {t:"No quemar al plantel",d:"Fresco, menos épica.",grupos:{camarin:6,hinchada:-4},mem:"cuidaste el plantel de Velásquez y aflojaste el playoff",cierra:true}]}
    ]});
  put("REN",{id:"ren_rengo",t:"Rengo a no bajar",desc:"Valle de Cachapoal. Recién llegado al profesionalismo: primero sobrevivir.",
    capitulos:[
      {id:"ren_1",t:"No ser un verano",ctx:"Subir es la foto. Quedarse es el trabajo.",
       ops:[{t:"Plan de tres años, por escrito",d:"Aburrido y serio.",ef:{prestigio:4},grupos:{socios:10,directorio:4},mem:"le diste a Rengo un plan largo",va:"ren_2"},
            {t:"Ilusión de un mercado más",d:"La gente se prende un mes.",grupos:{hinchada:10,prensa:6,directorio:-4},mem:"le vendiste a Rengo otra ilusión corta",va:"ren_2"}]},
      {id:"ren_2",t:"Permanencia",ctx:"La liguilla de abajo no perdona el pecho.",
       ops:[{t:"Orden y gente del valle",d:"Sello.",grupos:{comunidad:12,camarin:8},mem:"armaste Rengo para no bajar",cierra:true,logro:"de_la_comunidad"},
            {t:"Fichar desesperados",d:"Pánico de mercado.",ef:{plata:-40},grupos:{directorio:-4,hinchada:4},mem:"fichaste de pánico en Rengo",cierra:true}]}
    ]});
})();

/* ---------- voz: copas nuevas, Segunda, liguilla B, huecos de repetición ---------- */
(function vozFormato54(){
  var tuits=[
    {ctx:"copa_liga",quien:"@barra_del_fondo",txt:"COPA DE LA LIGA WN. NO ES COPA CHILE. APRENDAN EL NOMBRE."},
    {ctx:"copa_liga",quien:"@doña_clarita",txt:"otro torneo. otro domingo. otra entrada. y después se quejan que no va gente"},
    {ctx:"copa_liga",quien:"@cuenta_troll",txt:"la ANFP inventó un torneo pa llenar la grilla y ahora es el Chile 3. chile."},
    {ctx:"copa_liga",quien:"@RadioGolAM",txt:"Copa de la Liga: solo Primera, cuatro grupos, pasa el 1°. El campeón se lleva cupo continental."},
    {ctx:"copa_liga",quien:"@datofutbol",txt:"si ganás la Liga y la Libertadores, el Chile 1 se lo queda el 2°. un club, un asiento. no es invento"},
    {ctx:"copa_liga",quien:"@RadioGolAM",txt:"Cascada ANFP: si el campeón de Copa Chile ya está en Libertadores, el repechaje Chile 4 lo juega el subcampeón."},
    {ctx:"copa_liga",quien:"@pibe_de_la_popular",txt:"el dt dijo que es «para sumar minutos». traducido: no la siente"},
    {ctx:"supercopa",quien:"@barra_del_fondo",txt:"SUPERCOPA. FINAL FOUR. EL AÑO EMPIEZA ACÁ O EMPIEZA CON CARA LARGA."},
    {ctx:"supercopa",quien:"@doña_clarita",txt:"enero y ya estamos sufriendo. no me pidan serenidad"},
    {ctx:"supercopa",quien:"@cuenta_troll",txt:"antes era un partido. ahora son tres. la ANFP descubrió que se puede cobrar más entradas"},
    {ctx:"supercopa",quien:"@RadioGolAM",txt:"Supercopa en Sausalito. Cuatro equipos, sin tercer puesto. El que pierde la semi se va a la playa."},
    {ctx:"supercopa",quien:"@hincha_de_ley",txt:"el primer título del año no se regala. aunque sea enero"},
    {ctx:"supercopa",quien:"@datofutbol",txt:"Coquimbo la levantó en 2026 desde el punto penal. Eso ya es dato. Lo de ahora lo escribís tú"},
    {ctx:"liguilla",quien:"@barra_del_fondo",txt:"LIGUILLA. ACÁ SE SUBE O SE LLORA. NO HAY MEDIA TABLA QUE VALGA."},
    {ctx:"liguilla",quien:"@doña_clarita",txt:"ya no es «vamos a ver». ahora cada pelota es un año"},
    {ctx:"liguilla",quien:"@pibe_de_la_popular",txt:"el 4° se juega un partido y se le va la vida. formato enfermo. me encanta"},
    {ctx:"liguilla",quien:"@CronicaFC",txt:"Zonas Norte y Sur, después liguilla. El 1° sube a la B. Abajo, dos a Tercera."},
    {ctx:"liguilla",quien:"@cuenta_troll",txt:"el dt dijo «fase a fase». hermano estamos en la fase donde te echan del pueblo"},
    {ctx:"liguilla",quien:"@el_que_va_en_micro",txt:"viajo 6 horas a Osorno por 3 puntos de liguilla. esto es amor o es enfermedad"},
    {ctx:"liguilla_b",quien:"@barra_del_fondo",txt:"LIGUILLA DE LA B. EL 1° YA SUBIÓ. ESTO ES POR EL SEGUNDO ASIENTO EN PRIMERA."},
    {ctx:"liguilla_b",quien:"@doña_clarita",txt:"noviembre y todavía no se acaba. el corazón no está para 120 minutos"},
    {ctx:"liguilla_b",quien:"@pibe_de_la_popular",txt:"el 2° espera. nosotros nos jugamos la vida en cuartos. formato enfermo. firmado"},
    {ctx:"liguilla_b",quien:"@RadioGolAM",txt:"Liguilla Liga de Ascenso: 3°–8°, 4°–7°, 5°–6°. Sin gol de visita. Empate: penales, salvo la final."},
    {ctx:"liguilla_b",quien:"@cuenta_troll",txt:"el dt dijo «respetar la regular». hermano la regular se acabó, ahora es cuchillo"},
    {ctx:"liguilla_b",quien:"@datofutbol",txt:"de Primera bajan 2. de la B suben 2. si no lo tenés claro, anotalo en la mano"},
    {ctx:"liguilla_b",quien:"@hincha_de_ley",txt:"local primero el que salió peor. justicia poética o trampa, según quién seas"},
    {ctx:"zonal",quien:"@hincha_de_ley",txt:"en la zona se juega contra el vecino. el clásico de pueblo duele más que un grande"},
    {ctx:"zonal",quien:"@doña_clarita",txt:"ida y vuelta con el de al lado. el almacén ya tomó bando"},
    {ctx:"zonal",quien:"@RadioGolAM",txt:"Fase zonal: 12 partidos, dos fechas libres. Después se parte el torneo en dos."},
    {ctx:"segunda",quien:"@barra_del_fondo",txt:"TERCER NIVEL Y LA GENTE IGUAL LLENA. ESO NO SE COMPRA CON SPONSOR"},
    {ctx:"segunda",quien:"@cuenta_troll",txt:"no hay copa chile pa Segunda. la ANFP dijo «gracias, no». anoten el desprecio"},
    {ctx:"segunda",quien:"@datofutbol",txt:"Copa Chile 2026: 16+16 B. Segunda afuera. No es un olvido: está en las bases"}
  ];
  if(typeof TUITS_MOMENTO!=="undefined" && Array.isArray(TUITS_MOMENTO)){
    tuits.forEach(function(t){ TUITS_MOMENTO.push(t); });
  }
  var preg=[
    {sit:"copa_liga",q:"¿La Copa de la Liga es un título o un trámite para minutos?"},
    {sit:"copa_liga",q:"Solo pasa el 1° de grupo. ¿Eso cambia cómo arma el once?"},
    {sit:"copa_liga",q:"El campeón se lleva Chile 3. ¿El plantel lo tiene claro?"},
    {sit:"copa_liga",q:"Si ya están en Libertadores, el Chile 3 lo hereda otro. ¿Se lo explicás al plantel o lo dejás pasar?"},
    {sit:"copa_liga",q:"¿Prioriza la liga o este torneo nuevo que la gente todavía nombra mal?"},
    {sit:"supercopa",q:"Enero, Final Four, cancha neutral. ¿Se puede llegar bien a la liga después de esto?"},
    {sit:"supercopa",q:"¿La Supercopa es el primer título del año o un amistoso caro?"},
    {sit:"supercopa",q:"No hay tercer puesto. ¿Eso suelta al que pierde la semi?"},
    {sit:"liguilla",q:"¿El plantel entiende que acá se sube o se baja, no se «hace campaña»?"},
    {sit:"liguilla",q:"¿Cambia el once para la liguilla o banca a los que llegaron?"},
    {sit:"liguilla",q:"Hay dos fechas libres en la zonal. ¿Eso se nota en las piernas o en la cabeza?"},
    {sit:"liguilla_b",q:"El 1° ya subió. ¿Esta liguilla es un título o un repechaje?"},
    {sit:"liguilla_b",q:"Local primero el peor de la regular. ¿Eso le pesa al plantel o lo prende?"},
    {sit:"liguilla_b",q:"Sin gol de visita, a penales si empatan. ¿Arma el once para no irse a los 12 pasos?"},
    {sit:"liguilla_b",q:"De Primera bajan dos. ¿El vestuario entiende que hay dos asientos, no uno?"},
    {sit:"zonal",q:"¿El clásico de zona pesa más que un partido contra un grande de visita?"},
    {sit:"zonal",q:"Top 3 clasifica. ¿Sale a ser 1° o a no quedar 4°?"},
    {sit:"segunda",q:"Segunda no juega Copa Chile 2026. ¿Eso libera el calendario o humilla al club?"}
  ];
  if(typeof PREGUNTAS_VOZ!=="undefined" && Array.isArray(PREGUNTAS_VOZ)) preg.forEach(function(p){ PREGUNTAS_VOZ.push(p); });
  if(typeof PREGUNTAS_BETA!=="undefined" && Array.isArray(PREGUNTAS_BETA)) preg.forEach(function(p){ PREGUNTAS_BETA.push(p); });
  var trivia=[
    {q:"La Copa de la Liga de Chile se creó para la temporada:",op:["2024","2025","2026"],sol:2},
    {q:"En Copa de la Liga 2026, de cada grupo clasifica:",op:["El 1° y el 2°","Solo el 1°","Los 3 primeros"],sol:1},
    {q:"El campeón de la Copa de la Liga obtiene:",op:["Sudamericana","Chile 3 a Libertadores","Nada, solo el trofeo"],sol:1},
    {q:"Si el campeón de Liga también gana la Libertadores, Chile 1 lo hereda:",op:["Nadie, se pierde","El 2° de la tabla","El campeón de Copa Chile"],sol:1},
    {q:"El campeón vigente de Libertadores entra al año siguiente:",op:["Consumiendo Chile 1","Como cupo CONMEBOL extra","Solo si termina entre los 4"],sol:1},
    {q:"Si el campeón de Copa Chile ya tiene Libertadores, el repechaje Chile 4 lo juega:",op:["Nadie","El subcampeón de Copa Chile","El 8° de la tabla"],sol:1},
    {q:"La Supercopa 2026 se jugó con:",op:["2 equipos","4 equipos","8 equipos"],sol:1},
    {q:"Campeón de la Supercopa 2026:",op:["Universidad Católica","Coquimbo Unido","Huachipato"],sol:1},
    {q:"Sede de la Supercopa 2026:",op:["Nacional","Sausalito","Monumental"],sol:1},
    {q:"La Segunda División 2026 se juega en:",op:["Una liga corrida de 14","Zonas Norte y Sur de 7","Tres grupos de 5"],sol:1},
    {q:"De cada zona de Segunda, a la liguilla de título van:",op:["El 1°","Los 3 primeros","Los 4 primeros"],sol:1},
    {q:"Los 4° de cada zona de Segunda:",op:["Quedan libres","Se juegan un partido entre ellos","Bajan directo"],sol:1},
    {q:"Copa Chile 2026 incluye a Segunda División:",op:["Sí","No","Solo al campeón"],sol:1},
    {q:"Cuántos clubes tiene la Segunda Profesional 2026:",op:["12","14","16"],sol:1},
    {q:"El campeón de Segunda 2026 sube a:",op:["Primera División","Primera B","Nada, hay promoción"],sol:1},
    {q:"En la Primera B 2026, ¿quién sube directo?",op:["El 1° de la regular","Los 2 primeros","El ganador de la liguilla"],sol:0},
    {q:"La liguilla de la B 2026 la juegan:",op:["2° a 5°","2° a 8°","3° a 10°"],sol:1},
    {q:"En cuartos de la liguilla de la B, si empatan el global:",op:["Alargue y penales","Penales, sin alargue","Gol de visita"],sol:1},
    {q:"De la Liga de Primera 2026 bajan:",op:["El último","Los 2 últimos","Los 3 últimos"],sol:1},
    {q:"El 2° de la B en la liguilla:",op:["Juega cuartos","Espera en semis","Sube directo también"],sol:1}
  ];
  if(typeof TRIVIA_VOZ!=="undefined" && Array.isArray(TRIVIA_VOZ)) trivia.forEach(function(t){ TRIVIA_VOZ.push(t); });
  var relato=[
    {m:"inicio",x:"Copa de la Liga: el grupo no perdona. Solo el 1° sigue."},
    {m:"inicio",x:"Supercopa, cancha neutral. El año se abre acá."},
    {m:"inicio",x:"Zona chica, clásico de pueblo. Acá el vecino duele más."},
    {m:"inicio",x:"Liguilla. Cada pelota vale un año de categoría."},
    {m:"inicio",x:"Liguilla de la B. El 1° ya subió. Esto es por el segundo asiento."},
    {m:"meta_cerca",x:"Un punto más y es liguilla de título. El banco ya no parpadea."},
    {m:"meta_cerca",x:"Abajo se huele Tercera. Arriba se huele la B. No hay media."},
    {m:"meta_cerca",x:"8° entra a la liguilla. 9° se va a casa. Cuenten bien."},
    {m:"clasico",x:"No es el Superclásico. Es el de la zona. Duele igual."},
    {m:"aguanta",x:"En Segunda se sufre con menos cámara y más pueblo."},
    {m:"aguanta",x:"Noviembre en la B. Las piernas pesan. El pueblo no perdona aflojar."}
  ];
  if(typeof RELATO_BETA!=="undefined" && Array.isArray(RELATO_BETA)) relato.forEach(function(r){ RELATO_BETA.push(r); });
  var frases=[
    {ctx:"copa_liga",x:"Solo el 1° pasa, profe. Acá no hay segundo premio. Que salgan a ser primeros."},
    {ctx:"copa_liga",x:"La gente todavía le dice Copa Chile. Que el plantel no se confunda: esto es otro torneo."},
    {ctx:"supercopa",x:"Enero y ya es final. Que no jueguen como amistoso de pretemporada."},
    {ctx:"supercopa",x:"Cancha neutral, Final Four. El que se enoje, pierde. Que se enojen ellos."},
    {ctx:"liguilla",x:"Se acabó la zonal. Ahora cada error es categoría. No hay que explicarlo dos veces."},
    {ctx:"liguilla",x:"El 4° se jugó la vida en un partido. Nosotros no tenemos derecho a aflojar."},
    {ctx:"liguilla_b",x:"El campeón de la regular ya subió. Nosotros vamos por el otro cupo. Que no salgan a administrar."},
    {ctx:"liguilla_b",x:"Sin gol de visita. Si empatan, penales. Que no dejen el partido para los 12 pasos."},
    {ctx:"liguilla_b",x:"Local primero el que salió peor. Si nos toca ir a su cancha de ida, que duela."},
    {ctx:"segunda",x:"No hay Copa Chile pa nosotros. El calendario es este. Que lo sientan como final cada domingo."},
    {ctx:"meta_cerca",x:"Top 3 clasifica. 4° es ruleta. 5° es liguilla de abajo. Que cuenten bien."}
  ];
  if(typeof FRASES_CUERPO!=="undefined" && Array.isArray(FRASES_CUERPO)) frases.forEach(function(f){ FRASES_CUERPO.push(f); });
})();

(function historiaSegunda54(){
  if(typeof HISTORIA_BETA!=="object") return;
  if(typeof HISTORIA_C!=="object") return;
  Object.keys(HISTORIA_C).forEach(function(id){
    if(!HISTORIA_BETA[id]) HISTORIA_BETA[id]={};
    var linea=HISTORIA_C[id]||[];
    var hoy=linea.filter(function(h){ return h.anio>=2024; }).pop();
    if(hoy && !HISTORIA_BETA[id].actual) HISTORIA_BETA[id].actual=hoy.txt;
    linea.forEach(function(h){
      var k=String(h.anio);
      if(!HISTORIA_BETA[id][k]) HISTORIA_BETA[id][k]=h.txt;
    });
  });
})();

(function sitPrevia54(){
  if(typeof preguntasConferencia!=="function"||preguntasConferencia._fmt54) return;
  var orig=preguntasConferencia;
  preguntasConferencia=function(part){
    var L=orig(part)||[];
    try{
      var t=(part&&part.torneo)||"";
      var extra=[];
      if(/Copa de la Liga/i.test(t) && typeof PREGUNTAS_VOZ!=="undefined") extra=PREGUNTAS_VOZ.filter(function(p){ return p.sit==="copa_liga"; });
      else if(/Supercopa/i.test(t) && typeof PREGUNTAS_VOZ!=="undefined") extra=PREGUNTAS_VOZ.filter(function(p){ return p.sit==="supercopa"; });
      else if(/Liguilla de Ascenso/i.test(t) && typeof PREGUNTAS_VOZ!=="undefined") extra=PREGUNTAS_VOZ.filter(function(p){ return p.sit==="liguilla_b"; });
      else if(part&&(/Liguilla|Playoff/i.test(part.ronda||"")) && typeof PREGUNTAS_VOZ!=="undefined") extra=PREGUNTAS_VOZ.filter(function(p){ return p.sit==="liguilla"; });
      else if(part&&part.fase==="zonal" && typeof PREGUNTAS_VOZ!=="undefined") extra=PREGUNTAS_VOZ.filter(function(p){ return p.sit==="zonal"; });
      extra.slice(0,2).forEach(function(p){ L.push(p); });
    }catch(e){}
    return L;
  };
  preguntasConferencia._fmt54=true;
})();

(function wrapFraseCuerpo54(){
  if(typeof fraseCuerpoTecnico!=="function"||fraseCuerpoTecnico._fmt54) return;
  var orig=fraseCuerpoTecnico;
  fraseCuerpoTecnico=function(part){
    var ctx=null, t=(part&&part.torneo)||"", r=(part&&part.ronda)||"";
    if(/Copa de la Liga/i.test(t)) ctx="copa_liga";
    else if(/Supercopa/i.test(t)) ctx="supercopa";
    else if(/Liguilla de Ascenso/i.test(t)) ctx="liguilla_b";
    else if(/Liguilla|Playoff/i.test(r)) ctx="liguilla";
    else if(typeof E!=="undefined"&&E&&E.eraBase==="2026c") ctx="segunda";
    if(ctx && typeof FRASES_CUERPO!=="undefined"){
      var pool=FRASES_CUERPO.filter(function(f){ return f.ctx===ctx; });
      if(pool.length) return pool[Math.floor(Math.random()*pool.length)].x;
    }
    return orig(part);
  };
  fraseCuerpoTecnico._fmt54=true;
})();

if(typeof RIVALIDADES_2026!=="undefined" && Array.isArray(RIVALIDADES_2026)){
  [["SMO","SCI"],["SMO","RSJ"],["TRA","COL"],["CLC","REN"],["CLC","GVE"],
   ["LIN","REN"],["LSC","OSO"],["BSA","OVA"],["CNA","TRA"]].forEach(function(par){
    RIVALIDADES_2026.push(par);
  });
}
