"use strict";
/* ============================================================
   FUTBOLINI 7.33 · data-32.js
   Cargar ÚLTIMO (después de data-grok-beta.js).
   Copa Chile: octavos reales 2026 (A↔C / B↔D / E↔G / F↔H) si el club
   está en el cuadro ANFP; si no, procedural con esa misma pareja.
   Previa: gadget de clima Vista + canal de TV.
   Prensa atada a deuda/moral/hinchada/caja.
   Arcos B: CBL IQQ PMO MAG REC.
   Nombres reales OK; stats estimadas; NUNCA citas inventadas.
   ============================================================ */

function ciudadDeClub(id){
  var c=(typeof clubLookup==="function")?clubLookup(id):null;
  if(c&&c.ciudad) return c.ciudad;
  var pools=[],p,i;
  if(typeof LIGA_B_2026!=="undefined") pools.push(LIGA_B_2026);
  if(typeof LIGA_2026!=="undefined") pools.push(LIGA_2026);
  if(typeof LIGA91!=="undefined") pools.push(LIGA91);
  for(p=0;p<pools.length;p++){
    for(i=0;i<pools[p].length;i++) if(pools[p][i].id===id) return pools[p][i].ciudad||"";
  }
  return "";
}

function nombreTorneo(part){
  if(!part) return "Campeonato";
  if(part.tipo==="copa") return part.torneo||"Copa";
  if(part.torneo) return part.torneo;
  if(typeof E!=="undefined"&&E&&E.eraBase==="2026b") return "Liga de Ascenso";
  if(typeof E!=="undefined"&&E&&(E.anio||0)>=2010) return "Liga de Primera";
  return "Campeonato Nacional";
}

/* ---------- canal de TV (concesión / época, no un dato inventado de un partido real) ---------- */
function canalDelPartido(part){
  var anio=(typeof E!=="undefined"&&E&&E.anio)||2026;
  var prest=(typeof E!=="undefined"&&E&&E.ind&&E.ind.prestigio)||50;
  var copa=part&&part.tipo==="copa";
  var torneo=(part&&part.torneo)||"";
  var clasico=(typeof esClasico==="function")&&part?esClasico(part):false;
  if(anio<=1994){
    if(copa||clasico) return {n:"Canal 13",d:"Señal abierta. Sábado a la tarde, sin pay-per-view."};
    return {n:(prest>=55?"TVN":"Canal 13"),d:"Televisión abierta. Lo ve el que tiene antena."};
  }
  if(copa&&/Libertadores/i.test(torneo)) return {n:"ESPN",d:"Señal continental. Se ve en el resto de América."};
  if(copa&&/Sudamericana/i.test(torneo)) return {n:"ESPN / Disney+",d:"Señal continental. La Sudamericana también se ve."};
  if(copa&&/Chile/i.test(torneo)){
    if(prest>=62||clasico) return {n:"TNT Sports",d:"Señal premium. La Copa Chile también se pelea en la tele."};
    return {n:"TNT Sports 2",d:"Segundo canal. Se ve, pero no es horario estelar."};
  }
  if(clasico) return {n:"TNT Sports",d:"Clásico en señal premium. La concesión se nota."};
  if(prest>=70) return {n:"TNT Sports",d:"Horario estelar, relato de siempre."};
  if(prest>=50) return {n:"TNT Sports 2",d:"Señal 2. Lo ven los hinchas; el resto zapea."};
  return {n:"TNT Sports 3 / streaming",d:"Fondo de grilla. La concesión todavía no te pone en el primer canal."};
}

function widgetClima(part){
  var cl=(typeof CLIMAS!=="undefined"&&part&&CLIMAS[part.clima])||(typeof CLIMAS!=="undefined"?CLIMAS.despejado:{n:"despejado",ic:"☀️",desgaste:0,precision:1,d:""});
  var desg=Math.round(Math.min(100,18+(cl.desgaste||0)*42));
  var prec=Math.round((cl.precision||1)*100);
  var w=el("div","clima-vista clima-"+(part&&part.clima||"despejado"));
  w.innerHTML=
    '<div class="cv-sky"><span class="cv-ic">'+cl.ic+'</span><span class="cv-nom">'+cl.n+'</span></div>'+
    '<div class="cv-side">'+
      '<div class="cv-lab">Desgaste de piernas · '+desg+'</div>'+
      '<div class="barrita"><i style="width:'+desg+'%"></i></div>'+
      '<div class="cv-lab">Precisión de pase / remate · '+prec+'</div>'+
      '<div class="barrita"><i style="width:'+prec+'%"></i></div>'+
    '</div>'+
    '<div class="cv-d">'+cl.d+' El clima se fijó al armar el calendario; no es el parte del día real.</div>';
  return w;
}

function widgetCanal(part){
  var ch=canalDelPartido(part);
  var w=el("div","canal-tv");
  w.innerHTML='<span class="ch">'+ch.n+'</span><span>'+ch.d+'</span>';
  return w;
}

/* ---------- Copa Chile: tabla de grupo + llaves procedurales ---------- */
var COPA_CHILE_PAREJA={A:"C",C:"A",B:"D",D:"B",E:"G",G:"E",F:"H",H:"F"};
/* Cuadro ANFP 2026 (ida 22-24 sep, vuelta 25 sep-7 oct). 2° de grupo
   abre de local. Si el jugador clasifica con un club que NO está acá,
   se usa la pareja de grupos (procedural). */
var COPA_CHILE_OCTAVOS_2026={
  CBL:{rival:"COQ",idaLocal:true, ida:{m:9,d:22},vue:{m:10,d:7}},
  COQ:{rival:"CBL",idaLocal:false,ida:{m:9,d:22},vue:{m:10,d:7}},
  CAL:{rival:"UC", idaLocal:true, ida:{m:9,d:23},vue:{m:9,d:26}},
  UC: {rival:"CAL",idaLocal:false,ida:{m:9,d:23},vue:{m:9,d:26}},
  IQQ:{rival:"ANT",idaLocal:true, ida:{m:9,d:23},vue:{m:9,d:27}},
  ANT:{rival:"IQQ",idaLocal:false,ida:{m:9,d:23},vue:{m:9,d:27}},
  EVE:{rival:"UCH",idaLocal:true, ida:{m:9,d:24},vue:{m:9,d:27}},
  UCH:{rival:"EVE",idaLocal:false,ida:{m:9,d:24},vue:{m:9,d:27}},
  AUD:{rival:"CC", idaLocal:true, ida:{m:9,d:22},vue:{m:9,d:25}},
  CC: {rival:"AUD",idaLocal:false,ida:{m:9,d:22},vue:{m:9,d:25}},
  PMO:{rival:"NUB",idaLocal:true, ida:{m:9,d:22},vue:{m:9,d:26}},
  NUB:{rival:"PMO",idaLocal:false,ida:{m:9,d:22},vue:{m:9,d:26}},
  OHI:{rival:"SCR",idaLocal:true, ida:{m:9,d:24},vue:{m:9,d:27}},
  SCR:{rival:"OHI",idaLocal:false,ida:{m:9,d:24},vue:{m:9,d:27}},
  CUR:{rival:"DCO",idaLocal:true, ida:{m:9,d:23},vue:{m:9,d:27}},
  DCO:{rival:"CUR",idaLocal:false,ida:{m:9,d:23},vue:{m:9,d:27}}
};
var COPA_CHILE_KO_FECHAS={
  Octavos:[{m:9,d:22},{m:10,d:7}],
  Cuartos:[{m:10,d:21},{m:11,d:4}],
  Semifinal:[{m:11,d:18},{m:11,d:25}],
  FINAL:[{m:12,d:10}]
};

function simularMarcadorFuerza(fa,fb,localA){
  var a=(fa||60)+(localA?5:0)+(typeof rnd==="function"?rnd(-8,8):0);
  var b=(fb||60)+(typeof rnd==="function"?rnd(-8,8):0);
  var d=(a-b)/12;
  var ga=(typeof clamp==="function")?clamp(Math.round(1.15+d*0.55+(typeof rnd==="function"?rnd(-1,1.2):0)),0,5):1;
  var gb=(typeof clamp==="function")?clamp(Math.round(1.05-d*0.55+(typeof rnd==="function"?rnd(-1,1.2):0)),0,5):1;
  return [ga,gb];
}
function aplicarResultadoTablaCC(t,a,b,ga,gb){
  if(!t[a]||!t[b]) return;
  t[a].pj++; t[b].pj++; t[a].gf+=ga; t[a].gc+=gb; t[b].gf+=gb; t[b].gc+=ga;
  if(ga>gb){ t[a].pg++; t[a].pts+=3; t[b].pp++; }
  else if(ga<gb){ t[b].pg++; t[b].pts+=3; t[a].pp++; }
  else { t[a].pe++; t[b].pe++; t[a].pts++; t[b].pts++; }
}
function ordenarTablaCC(t,ids){
  var arr=ids.map(function(id){ return t[id]; });
  arr.sort(function(x,y){
    if(y.pts!==x.pts) return y.pts-x.pts;
    var dx=x.gf-x.gc, dy=y.gf-y.gc;
    if(dy!==dx) return dy-dx;
    if(y.gf!==x.gf) return y.gf-x.gf;
    var fx=(typeof clubLookup==="function"&&clubLookup(x.id)||{}).fuerza||0;
    var fy=(typeof clubLookup==="function"&&clubLookup(y.id)||{}).fuerza||0;
    return fy-fx;
  });
  return arr;
}
function tablaGrupoCopaChile(letra, clubId){
  var ids=(typeof COPA_CHILE_GRUPOS_2026!=="undefined"&&COPA_CHILE_GRUPOS_2026[letra])||[];
  var t={}, i, j;
  ids.forEach(function(id){ t[id]={id:id,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  (E.calendario||[]).forEach(function(p){
    if(p.tipo!=="copa"||p.torneo!=="Copa Chile"||p.ronda!=="Grupo "+letra||!p.jugado) return;
    aplicarResultadoTablaCC(t, clubId, p.rivalId, p.gf||0, p.gc||0);
  });
  for(i=0;i<ids.length;i++) for(j=i+1;j<ids.length;j++){
    var a=ids[i], b=ids[j];
    if(a===clubId||b===clubId) continue;
    var ca=(typeof clubLookup==="function")?clubLookup(a):null;
    var cb=(typeof clubLookup==="function")?clubLookup(b):null;
    var m1=simularMarcadorFuerza(ca&&ca.fuerza, cb&&cb.fuerza, true);
    aplicarResultadoTablaCC(t,a,b,m1[0],m1[1]);
    var m2=simularMarcadorFuerza(cb&&cb.fuerza, ca&&ca.fuerza, true);
    aplicarResultadoTablaCC(t,b,a,m2[0],m2[1]);
  }
  return ordenarTablaCC(t, ids);
}
function tablaGrupoCopaChileEstimada(letra){
  var ids=(typeof COPA_CHILE_GRUPOS_2026!=="undefined"&&COPA_CHILE_GRUPOS_2026[letra])||[];
  var t={}, i, j;
  ids.forEach(function(id){ t[id]={id:id,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; });
  for(i=0;i<ids.length;i++) for(j=i+1;j<ids.length;j++){
    var a=ids[i], b=ids[j];
    var ca=(typeof clubLookup==="function")?clubLookup(a):null;
    var cb=(typeof clubLookup==="function")?clubLookup(b):null;
    var m1=simularMarcadorFuerza(ca&&ca.fuerza, cb&&cb.fuerza, true);
    aplicarResultadoTablaCC(t,a,b,m1[0],m1[1]);
    var m2=simularMarcadorFuerza(cb&&cb.fuerza, ca&&ca.fuerza, true);
    aplicarResultadoTablaCC(t,b,a,m2[0],m2[1]);
  }
  return ordenarTablaCC(t, ids);
}
function sacarCopaChilePendiente(){
  if(!E||!E.calendario) return;
  E.calendario=E.calendario.filter(function(p){
    return !(p.tipo==="copa"&&p.torneo==="Copa Chile"&&!p.jugado);
  });
}
function insertarCopaChileYOrdenar(nuevos){
  if(!E||!nuevos||!nuevos.length) return;
  var actual=(E.calendario||[])[E.idx];
  nuevos.forEach(function(p){ E.calendario.push(p); });
  E.calendario.sort(function(a,b){
    var oa=(typeof ordenFecha==="function")?ordenFecha(a.f):(a.f.m*100+(a.f.d||1));
    var ob=(typeof ordenFecha==="function")?ordenFecha(b.f):(b.f.m*100+(b.f.d||1));
    return oa-ob;
  });
  if(actual){
    var i=E.calendario.indexOf(actual);
    if(i>=0) E.idx=i;
  }
}
function partidoCopaChileKO(ronda, rivalId, f, local, extra){
  var yo=(typeof clubLookup==="function")?clubLookup(E.club):null;
  var elotro=(typeof clubLookup==="function")?clubLookup(rivalId):null;
  if(!yo||!elotro) return null;
  extra=extra||{};
  return {
    tipo:"copa", torneo:"Copa Chile", ronda:ronda,
    rivalId:rivalId, rivalNombre:elotro.n, fuerzaRival:elotro.fuerza,
    local:!!local, sede: extra.sede||(local?yo.est:elotro.est),
    f:f, jugado:false,
    clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,"copaChileKO"+ronda+rivalId+(f.d||0)):"despejado",
    real:null, apodo:null, notaId:"CC26-KO-"+ronda+"-"+rivalId+"-"+(local?"L":"V")
  };
}
function rivalOctavosCopaChile(letra, pos){
  var pareja=COPA_CHILE_PAREJA[letra];
  var tab=tablaGrupoCopaChileEstimada(pareja);
  if(!tab.length) return null;
  var riv=pos===1?(tab[1]||tab[0]):(tab[0]||tab[1]);
  if(!riv||riv.id===E.club) riv=tab.filter(function(x){ return x.id!==E.club; })[0];
  return riv?{id:riv.id, grupo:pareja}:null;
}
function mejorDeGruposCC(letras, skip){
  skip=skip||[];
  skip.push(E.club);
  var cands=[];
  letras.forEach(function(L){
    var tab=tablaGrupoCopaChileEstimada(L);
    var k;
    for(k=0;k<tab.length;k++){
      if(skip.indexOf(tab[k].id)<0){ cands.push(tab[k]); break; }
    }
  });
  cands.sort(function(a,b){
    var fa=(typeof clubLookup==="function"&&clubLookup(a.id)||{}).fuerza||0;
    var fy=(typeof clubLookup==="function"&&clubLookup(b.id)||{}).fuerza||0;
    return fy-fa;
  });
  return cands[0]?cands[0].id:null;
}
function sembrarLlaveCopaChile(ronda, rivalId, posPropia){
  if(!rivalId) return;
  E.flags.copaChileRivales=E.flags.copaChileRivales||[];
  if(E.flags.copaChileRivales.indexOf(rivalId)<0) E.flags.copaChileRivales.push(rivalId);
  var fechas=COPA_CHILE_KO_FECHAS[ronda]||[{m:10,d:15}];
  var nuevos=[], p;
  if(ronda==="FINAL"){
    p=partidoCopaChileKO(ronda, rivalId, fechas[0], false, {sede:"Estadio Nacional"});
    if(p){
      p.nota="Final a partido único. Sede típica de Copa Chile (Nacional); no es un dato confirmado del 2026 real.";
      nuevos.push(p);
    }
  } else {
    var idaLocal=posPropia===2; /* el mejor semilla cierra de local */
    p=partidoCopaChileKO(ronda, rivalId, fechas[0], idaLocal);
    if(p) nuevos.push(p);
    p=partidoCopaChileKO(ronda, rivalId, fechas[1]||{m:fechas[0].m,d:(fechas[0].d||1)+14}, !idaLocal);
    if(p) nuevos.push(p);
  }
  insertarCopaChileYOrdenar(nuevos);
}
function sembrarOctavosCopaChile(letra, pos){
  if(E.anio===2026 && typeof COPA_CHILE_OCTAVOS_2026==="object" && COPA_CHILE_OCTAVOS_2026[E.club]){
    var br=COPA_CHILE_OCTAVOS_2026[E.club];
    E.flags.copaChileRivales=E.flags.copaChileRivales||[];
    if(E.flags.copaChileRivales.indexOf(br.rival)<0) E.flags.copaChileRivales.push(br.rival);
    var nuevos=[], p;
    p=partidoCopaChileKO("Octavos", br.rival, br.ida, br.idaLocal);
    if(p){ p.nota="Cuadro real de octavos Copa Chile 2026 (ANFP, septiembre 2026). Clasificaste en el juego; el rival es el cruce documentado."; nuevos.push(p); }
    p=partidoCopaChileKO("Octavos", br.rival, br.vue, !br.idaLocal);
    if(p) nuevos.push(p);
    insertarCopaChileYOrdenar(nuevos);
    return;
  }
  var riv=rivalOctavosCopaChile(letra, pos);
  if(!riv) return;
  sembrarLlaveCopaChile("Octavos", riv.id, pos);
}
function bloquesCuartos(letra){
  if("AC".indexOf(letra)>=0) return ["B","D"];
  if("BD".indexOf(letra)>=0) return ["A","C"];
  if("EG".indexOf(letra)>=0) return ["F","H"];
  return ["E","G"];
}
function sembrarSiguienteCopaChile(ronda){
  var g=E.flags.copaChileGrupo||"A";
  var skip=E.flags.copaChileRivales||[];
  var rival=null, next=null, pos=1;
  if(ronda==="Octavos"){ next="Cuartos"; rival=mejorDeGruposCC(bloquesCuartos(g), skip.slice()); }
  else if(ronda==="Cuartos"){
    next="Semifinal";
    rival=mejorDeGruposCC(("ABCD".indexOf(g)>=0)?["E","F","G","H"]:["A","B","C","D"], skip.slice());
  } else if(ronda==="Semifinal"){
    next="FINAL";
    rival=mejorDeGruposCC(("ABCD".indexOf(g)>=0)?["E","F","G","H"]:["A","B","C","D"], skip.slice());
  }
  if(next&&rival) sembrarLlaveCopaChile(next, rival, pos);
}

function resolverCopaChile32(part, yo, otro){
  var ronda=part.ronda||"";
  if(ronda.indexOf("Grupo ")===0){
    var letra=ronda.replace("Grupo ","");
    var idx=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo==="Copa Chile"&&p.ronda===ronda; });
    if(idx.filter(function(p){ return p.jugado; }).length<idx.length) return;
    var tab=tablaGrupoCopaChile(letra, E.club);
    var pos=-1, i;
    for(i=0;i<tab.length;i++) if(tab[i].id===E.club) pos=i+1;
    var etq=tab.map(function(x,n){
      var c=(typeof clubLookup==="function"&&clubLookup(x.id))||{};
      return (n+1)+". "+(c.c||c.n||x.id)+" "+x.pts+" pts";
    }).join(" · ");
    if(pos>2||pos<1){
      sacarCopaChilePendiente();
      notificar({t:"Eliminado de la Copa Chile",tipo:"malo",
        d:"El grupo "+letra+" quedó así (el juego simula los otros partidos por fuerza; no es la tabla real 2026): "+etq+". Quedaste "+pos+"° y no clasificas. La Copa Chile se acaba acá."});
      aplicarEfectos({moral:-3,prestigio:-1});
    } else {
      notificar({t:"Clasificado a octavos de Copa Chile",tipo:"bueno",
        d:"Saliste "+pos+"° del grupo "+letra+". "+etq+". "+(E.anio===2026&&COPA_CHILE_OCTAVOS_2026[E.club]?"El cruce de octavos es el real 2026 (ANFP).":"El cuadro de octavos usa la pareja A↔C / B↔D / E↔G / F↔H (formato 2026). Si tu club no estaba en el cuadro real, el rival se estima.")});
      aplicarEfectos({moral:4,prestigio:2,plata:40});
      E.flags.copaChileGrupo=letra;
      E.flags.copaChilePos=pos;
      E.flags.copaChileRivales=E.flags.copaChileRivales||[];
      sembrarOctavosCopaChile(letra, pos);
    }
    return;
  }
  E.flags.copaAcum=E.flags.copaAcum||{};
  var k=ronda;
  var acc=E.flags.copaAcum["CC-"+k]||{gf:0,gc:0,j:0};
  acc.gf+=yo; acc.gc+=otro; acc.j++;
  E.flags.copaAcum["CC-"+k]=acc;
  var idxRonda=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo==="Copa Chile"&&p.ronda===k; });
  if(idxRonda.filter(function(p){ return p.jugado; }).length<idxRonda.length) return;
  var pasa, pens=false;
  if(k==="FINAL"){
    if(yo>otro) pasa=true;
    else if(yo<otro) pasa=false;
    else { pasa=Math.random()<0.5; pens=true; }
  } else {
    pasa=acc.gf>acc.gc||(acc.gf===acc.gc&&Math.random()<0.5);
    if(acc.gf===acc.gc) pens=true;
  }
  var penalTxt=pens?" Se definió en penales (el juego no inventa el 4-3: solo quién pasa).":"";
  if(!pasa){
    sacarCopaChilePendiente();
    notificar({t:"Eliminado de la Copa Chile",tipo:"malo",
      d:"Fuera en "+k+" ("+acc.gf+"-"+acc.gc+(k==="FINAL"?"":" en la llave")+")."+penalTxt});
    aplicarEfectos({moral:-4,prestigio:-2});
  } else if(k==="FINAL"){
    E.flags.copaChileCampeon=true;
    notificar({t:"Campeón de Copa Chile",tipo:"bueno",
      d:"El club gana la Copa Chile "+E.anio+". No es Libertadores: es la copa local. Estalla la hinchada y entra un premio."+penalTxt});
    aplicarEfectos({moral:8,prestigio:6,plata:180});
    if(typeof aplicarGrupos==="function") aplicarGrupos({hinchada:16,camarin:12,directorio:12,sponsors:10});
  } else {
    aplicarEfectos({plata:60,moral:4,prestigio:2});
    notificar({t:"Avanza en la Copa Chile",tipo:"bueno",
      d:"Supera "+k+" ("+acc.gf+"-"+acc.gc+")."+penalTxt+" Entran "+(typeof plata==="function"?plata(60):"$60")+" y se arma la siguiente ronda (procedural, no el cuadro real 2026)."});
    sembrarSiguienteCopaChile(k);
  }
}

(function wrapCopaChile32(){
  if(typeof resolverCopa!=="function"||resolverCopa._32) return;
  var orig=resolverCopa;
  resolverCopa=function(part,yo,otro){
    if(part&&part.torneo==="Copa Chile"){ resolverCopaChile32(part,yo,otro); return; }
    var keep=(E.calendario||[]).filter(function(p){ return p.tipo==="copa"&&p.torneo==="Copa Chile"&&!p.jugado; });
    orig(part,yo,otro);
    keep.forEach(function(p){ if(E.calendario.indexOf(p)<0) E.calendario.push(p); });
  };
  resolverCopa._32=true;
})();

(function wrapNotifTorneo32(){
  if(typeof terminarPartido!=="function"||terminarPartido._32) return;
  var orig=terminarPartido;
  terminarPartido=function(P){
    var res=orig(P);
    try{
      var part=P&&P.part;
      if(part&&part.tipo==="copa"&&E.notifs&&E.notifs[0]){
        var n=E.notifs[0], torneo=part.torneo||"Copa";
        if(n.d&&n.d.indexOf("Copa Libertadores")>=0&&torneo!=="Copa Libertadores"){
          n.d=n.d.replace("Copa Libertadores", torneo);
        }
      }
    }catch(e){}
    return res;
  };
  terminarPartido._32=true;
})();

(function wrapPrensaIndicadores32(){
  if(typeof preguntasConferencia!=="function"||preguntasConferencia._32) return;
  var origC=preguntasConferencia;
  preguntasConferencia=function(part){
    var L=origC(part)||[];
    try{
      var deuda=(E&&E.deuda)||0, caja=(E&&E.plata)||0;
      var moral=(E&&E.ind&&E.ind.moral)||50, hin=(E&&E.ind&&E.ind.hinchada)||50;
      if(deuda>=180) L.unshift({q:"La deuda del club da para un titular. ¿Cómo se paga esto sin vender el alma?",ops:[
        {t:"Hablar claro: hay plan y se cumple",k:"calma"},{t:"Pedir paciencia a la gente",k:"confianza"},{t:"La dirigencia que responda, no yo",k:"palo"}]});
      if(caja<80) L.unshift({q:"La caja está justa. ¿Se nota en el plantel o es un tema de la dirigencia?",ops:[
        {t:"Bajar el perfil, el plantel está cubierto",k:"calma"},{t:"Pedir un refuerzo igual",k:"confianza"},{t:"Palo a los que manejan la plata",k:"palo"}]});
      if(moral<42) L.unshift({q:"El camarín se ve apagado. ¿Hay roce interno o es la tabla?",ops:[
        {t:"Me hago cargo yo, no el grupo",k:"mea"},{t:"El grupo está entero, es un mal rato",k:"confianza"},{t:"El que no esté, que se vaya",k:"palo"}]});
      if(hin<40) L.unshift({q:"La hinchada está tibia. ¿Qué les dice para que vuelvan a la cancha?",ops:[
        {t:"Pedir tiempo y trabajo",k:"calma"},{t:"Prometer que esto se da vuelta",k:"confianza"},{t:"El que no banque, que no venga",k:"palo"}]});
      if(hin>=75) L.unshift({q:"La gente está encima. ¿Eso suma o los pone nerviosos?",ops:[
        {t:"Que alienten, nosotros jugamos",k:"calma"},{t:"Con esta hinchada se puede todo",k:"confianza"},{t:"Que exijan, pero con respeto",k:"palo"}]});
    }catch(e){}
    return L;
  };
  preguntasConferencia._32=true;
  preguntasConferencia._voz=!!origC._voz||true;
})();

/* ---------- arcos B 2026 (identidad, sin citas inventadas) ---------- */
(function arcosB2026(){
  if(typeof ARCOS_EQUIPO!=="object") return;
  if(!ARCOS_EQUIPO.CBL) ARCOS_EQUIPO.CBL=[{id:"cbl_desierto",t:"El naranja no se queda en la B",
    desc:"Cobreloa descendió en 2024. Calama, Zorros del Desierto y una hinchada que no negocia eternizarse abajo.",
    capitulos:[
      {id:"cbl_1",t:"Calama no es sucursal",ctx:"Un inversionista del centro ofrece plata a cambio de mover decisiones lejos del desierto. La gente de Calama pide que el club se quede acá, con el calor y con ellos.",
       ops:[{t:"El club se queda en Calama",d:"Identidad firme. Menos marketing.",grupos:{comunidad:14,hinchada:12,sponsors:-6},mem:"dejaste a Cobreloa en Calama y no lo empujaste al centro",va:"cbl_2"},
            {t:"Abrir a plata de afuera",d:"Caja ahora, recelo en el norte.",ef:{plata:80},grupos:{directorio:8,comunidad:-10},mem:"abriste Cobreloa a plata de afuera",va:"cbl_2"}]},
      {id:"cbl_2",t:"Volver o acomodarse",ctx:"La B se puede volver casa si te acomodas. El naranja no lo perdona.",
       ops:[{t:"Todo por el ascenso",d:"Ambición. Si no sales, duele.",ef:{prestigio:6},grupos:{hinchada:12,camarin:8,directorio:-4},mem:"prometiste que Cobreloa no se iba a acomodar en la B",cierra:true},
            {t:"Armar para no volver a caer",d:"Menos fiesta, más predio.",grupos:{camarin:10,socios:8},mem:"construiste a Cobreloa para no volver a caer",cierra:true,logro:"de_la_comunidad"}]}
    ]}];
  if(!ARCOS_EQUIPO.IQQ) ARCOS_EQUIPO.IQQ=[{id:"iqq_dragones",t:"Volver de Tierra de Campeones",
    desc:"Iquique bajó en 2025. El desierto, el estadio y la obligación de no eternizarse en la B.",
    capitulos:[
      {id:"iqq_1",t:"El descenso todavía arde",ctx:"Hay gente que todavía no procesa la caída. Un sector pide paciencia; otro, cabezas.",
       ops:[{t:"Hablar claro: esto duele y se trabaja",d:"Honesto. Poco épico.",grupos:{socios:8,directorio:6,hinchada:-4},mem:"hablaste claro del descenso de Iquique",va:"iqq_2"},
            {t:"Prometer el retorno ya",d:"La ciudad se prende.",grupos:{hinchada:12,prensa:6,directorio:-6},mem:"prometiste el retorno rápido de Iquique",va:"iqq_2"}]},
      {id:"iqq_2",t:"El viaje es un arma",ctx:"El rival sufre el norte. Eso es ventaja. También es un club lejos de todo.",
       ops:[{t:"Hacer de la localía un infierno",d:"Puntos feos, poco marketing.",grupos:{hinchada:10,camarin:8,prensa:-4},mem:"hiciste de Tierra de Campeones un arma",cierra:true},
            {t:"Pedir más fechas en el centro",d:"Cómodo, menos identidad.",grupos:{sponsors:8,comunidad:-10},mem:"sacaste a Iquique de su casa por comodidad",cierra:true}]}
    ]}];
  if(!ARCOS_EQUIPO.PMO) ARCOS_EQUIPO.PMO=[{id:"pmo_velero",t:"El sur no es postal",
    desc:"Puerto Montt subió en 2025. Chinquihue, lluvia y un viaje que cansa al rival.",
    capitulos:[
      {id:"pmo_1",t:"Recién llegado",ctx:"El Velero volvió a la B. Hay ilusión de pueblo y una caja que no da para soñar en voz alta.",
       ops:[{t:"Construir para quedarse",d:"Menos fiesta, más predio.",grupos:{camarin:10,socios:8},mem:"construiste para que Puerto Montt se quede",va:"pmo_2"},
            {t:"Cobrar la fiesta del ascenso",d:"Plata ahora.",ef:{plata:55},grupos:{sponsors:10,camarin:-6},mem:"cobraste la fiesta de Puerto Montt",va:"pmo_2"}]},
      {id:"pmo_2",t:"Chinquihue de invierno",ctx:"¿El estadio es de los locales de toda la vida o de la postal del sur?",
       ops:[{t:"Precios para el que vive acá",d:"Tribuna local.",ef:{plata:-18},grupos:{comunidad:12,hinchada:10},mem:"cuidaste al hincha de Chinquihue",cierra:true,logro:"de_la_comunidad"},
            {t:"Cobrar la marca sur",d:"Caja de turismo.",ef:{plata:45},grupos:{sponsors:10,comunidad:-8},mem:"cobraste Puerto Montt como postal del sur",cierra:true}]}
    ]}];
  if(!ARCOS_EQUIPO.MAG) ARCOS_EQUIPO.MAG=[{id:"mag_carabela",t:"El más antiguo, presupuesto de B",
    desc:"Magallanes es historia enorme y caja chica. Hoy juega en San Bernardo.",
    capitulos:[
      {id:"mag_1",t:"Historia o vitrina",ctx:"Un fondo quiere usar la camiseta más antigua de Chile como marca. La mancha carabelera pide que el club siga siendo de su gente.",
       ops:[{t:"El club es de su historia",d:"Orgullo, menos caja.",grupos:{comunidad:14,hinchada:8,sponsors:-6},mem:"defendiste que Magallanes siga siendo de su historia",va:"mag_2"},
            {t:"Abrir la marca",d:"Plata, recelo.",ef:{plata:70},grupos:{sponsors:12,comunidad:-10},mem:"abriste Magallanes más allá de su mancha",va:"mag_2"}]},
      {id:"mag_2",t:"San Bernardo de semana",ctx:"El estadio se llena con visita grande. El resto, sillas vacías.",
       ops:[{t:"Bajar entradas y llenar",d:"Caja chica, tribuna viva.",ef:{plata:-20},grupos:{hinchada:10,comunidad:8},mem:"llenaste Navarro Avilés bajando el precio",cierra:true},
            {t:"Cobrar caro la platea",d:"Más por cabeza, menos pueblo.",ef:{plata:40},grupos:{sponsors:8,hinchada:-8},mem:"cuidaste la platea de Magallanes y vaciaste la popular",cierra:true}]}
    ]}];
  if(!ARCOS_EQUIPO.REC) ARCOS_EQUIPO.REC=[{id:"rec_barrio",t:"Recoleta no pide permiso",
    desc:"Club joven de barrio, estadio chico y gente cerca. Sobrevivir en la B ya es un título para el pueblo.",
    capitulos:[
      {id:"rec_1",t:"Barrio o negocio",ctx:"Aparece un inversionista. Recoleta es barrio: si se vuelve marca neutra, la gente se queda en la casa.",
       ops:[{t:"El club es del barrio",d:"Identidad. Menos vitrina.",grupos:{comunidad:14,hinchada:10,sponsors:-6},mem:"dejaste Recoleta en su barrio",va:"rec_2"},
            {t:"Abrir a plata de afuera",d:"Caja, recelo.",ef:{plata:50},grupos:{directorio:8,comunidad:-10},mem:"abriste Recoleta a plata de afuera",va:"rec_2"}]},
      {id:"rec_2",t:"Cancha chica, pueblo grande",ctx:"El municipal no da para más. Hay que decidir si se crece o se cuida lo que hay.",
       ops:[{t:"Llenarlo con el barrio",d:"Precios bajos, ruido alto.",ef:{plata:-12},grupos:{hinchada:12,comunidad:10},mem:"llenaste Recoleta con su gente",cierra:true,logro:"de_la_comunidad"},
            {t:"Buscar una cancha más grande",d:"Más aforo, menos casa.",grupos:{sponsors:8,comunidad:-8},mem:"sacaste a Recoleta de su cancha chica",cierra:true}]}
    ]}];
})();
