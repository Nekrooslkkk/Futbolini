"use strict";
/* ============================================================
   FUTBOLINI · dev-doctor.js   (7.9021 · el modo dev deja de ser solo trampas)

   El panel dev tenía botones para HACER cosas (dar plata, lesionar, saltar año)
   pero ninguno para COMPROBAR que el juego está sano. Esto es lo segundo:
   corre diagnósticos sobre la partida de verdad y da un veredicto.

   REGLA DEL REPO (CLAUDE.md): cada parche deja el doctor mejor que como estaba.
   Si arreglás un bug, el chequeo que lo habría cazado se agrega ACÁ, no solo en
   los tests: los tests corren en CI, el doctor corre sobre la partida del jugador.

   Cómo se agrega un chequeo nuevo: `devDoctorRegistrar({id, area, n, fn})`.
   `fn()` devuelve {ok:bool, txt:"qué pasó", detalle:[...]} o lanza.
   ============================================================ */

var DOCTOR_CHECKS=[];
function devDoctorRegistrar(c){
  if(!c||!c.id||typeof c.fn!=="function") return false;
  if(DOCTOR_CHECKS.some(function(x){ return x.id===c.id; })) return false;
  DOCTOR_CHECKS.push({id:c.id, area:c.area||"general", n:c.n||c.id, fn:c.fn, pesado:!!c.pesado});
  return true;
}
function _dok(txt,detalle){ return {ok:true, txt:txt||"", detalle:detalle||[]}; }
function _dmal(txt,detalle){ return {ok:false, txt:txt||"", detalle:detalle||[]}; }
function _dnum(v){ return typeof v==="number" && isFinite(v); }

/* ============ ÁREA: MOTOR Y TABLAS ============
   Acá van los invariantes que SIEMPRE tienen que cumplirse. Si uno falla, la
   tabla que ve el jugador está mintiendo. */

/* pj = pg+pe+pp, y pts = pg*puntosVictoria + pe, para todos los clubes */
devDoctorRegistrar({id:"tabla_coherente", area:"motor", n:"La tabla cuadra consigo misma", fn:function(){
  if(!E||!E.tabla) return _dok("sin partida");
  var pv=(typeof puntosVictoria==="function")?puntosVictoria():3, malos=[];
  Object.keys(E.tabla).forEach(function(id){
    var t=E.tabla[id]||{};
    if(!_dnum(t.pj)||!_dnum(t.pts)||!_dnum(t.gf)||!_dnum(t.gc)){ malos.push(id+": números rotos"); return; }
    if((t.pg||0)+(t.pe||0)+(t.pp||0)!==t.pj) malos.push(id+": PJ "+t.pj+" ≠ "+(t.pg||0)+"+"+(t.pe||0)+"+"+(t.pp||0));
    var esp=(t.pg||0)*pv+(t.pe||0);
    if(esp!==t.pts) malos.push(id+": pts "+t.pts+" ≠ "+esp+" (victoria vale "+pv+")");
  });
  return malos.length?_dmal(malos.length+" club(es) con la fila mal",malos):_dok(Object.keys(E.tabla).length+" filas cuadran");
}});

/* los goles a favor de la liga tienen que igualar los goles en contra */
devDoctorRegistrar({id:"goles_cuadran", area:"motor", n:"Los goles de la liga cuadran", fn:function(){
  if(!E||!E.tabla) return _dok("sin partida");
  var pool=(typeof clubesLigaActual==="function")?clubesLigaActual():[];
  var gf=0, gc=0, pj=0;
  (pool||[]).forEach(function(c){ var t=E.tabla[c.id]; if(!t) return; gf+=t.gf||0; gc+=t.gc||0; pj+=t.pj||0; });
  if(gf!==gc) return _dmal("GF "+gf+" ≠ GC "+gc+" (diferencia "+(gf-gc)+"): hay partidos contados a medias");
  if(pj%2!==0) return _dmal("suma de PJ impar ("+pj+"): algún partido quedó contado una sola vez");
  return _dok("GF=GC="+gf+" · PJ total "+pj);
}});

/* nadie puede quedarse sin jugar mientras el resto juega */
devDoctorRegistrar({id:"nadie_sin_jugar", area:"motor", n:"Ningún club queda sin jugar", fn:function(){
  if(!E||!E.tabla) return _dok("sin partida");
  var pool=(typeof clubesLigaActual==="function")?clubesLigaActual():[];
  if(!pool||pool.length<2) return _dok("liga sin pool");
  var pjs=pool.map(function(c){ return (E.tabla[c.id]&&E.tabla[c.id].pj)||0; });
  var max=Math.max.apply(null,pjs), min=Math.min.apply(null,pjs);
  if(max===0) return _dok("todavía no se juega nada");
  var rezagados=pool.filter(function(c){ return ((E.tabla[c.id]&&E.tabla[c.id].pj)||0)<=max-2; })
                    .map(function(c){ return (c.n||c.id)+" ("+((E.tabla[c.id]&&E.tabla[c.id].pj)||0)+" de "+max+")"; });
  return rezagados.length?_dmal(rezagados.length+" club(es) atrasados 2+ fechas",rezagados)
                         :_dok("todos entre "+min+" y "+max+" PJ");
}});

/* el calendario del jugador no puede tener huecos ni rivales fantasma */
devDoctorRegistrar({id:"calendario_sano", area:"motor", n:"El calendario no tiene huecos", fn:function(){
  if(!E||!E.calendario) return _dok("sin partida");
  var malos=[];
  E.calendario.forEach(function(c,i){
    if(!c){ malos.push("fecha "+i+": vacía"); return; }
    if(!c.rivalNombre) malos.push("fecha "+i+": sin rival");
    if(c.jugado && (!_dnum(c.gf)||!_dnum(c.gc))) malos.push("fecha "+i+" ("+c.rivalNombre+"): jugado sin marcador");
    if(c.rivalId && c.rivalId===E.club) malos.push("fecha "+i+": el club juega contra sí mismo");
  });
  return malos.length?_dmal(malos.length+" problema(s) en el calendario",malos.slice(0,12))
                     :_dok(E.calendario.length+" compromisos, "+E.calendario.filter(function(c){return c.jugado;}).length+" jugados");
}});

/* 7.9025 · el cuelgue de la Liguilla de la B: el índice apuntando a un partido ya
   jugado deja al jugador apretando Avanzar para siempre. */
devDoctorRegistrar({id:"idx_no_pegado", area:"motor", n:"El próximo partido no está ya jugado", fn:function(){
  if(!E||!E.calendario) return _dok("sin partida");
  var p=E.calendario[E.idx];
  if(!p) return _dok("temporada terminada");
  if(p.jugado) return _dmal("E.idx="+E.idx+" apunta a un partido YA jugado ("+(p.torneo||p.tipo)+" vs "+p.rivalNombre+"): Avanzar no avanza");
  /* y el orden: ningún partido jugado después de uno sin jugar (salvo el propio idx) */
  var desorden=[];
  for(var i=E.idx+1;i<E.calendario.length;i++){ if(E.calendario[i].jugado) desorden.push(i+": "+(E.calendario[i].torneo||E.calendario[i].tipo)+" vs "+E.calendario[i].rivalNombre); }
  return desorden.length?_dmal(desorden.length+" partido(s) jugados DESPUÉS del próximo (inserción mal fechada)",desorden)
                        :_dok("apunta a "+(p.torneo||p.tipo)+" vs "+p.rivalNombre);
}});
/* la tabla ordenada tiene que ser consistente con los puntos */
devDoctorRegistrar({id:"orden_tabla", area:"motor", n:"El orden de la tabla respeta los puntos", fn:function(){
  if(typeof tablaOrdenada!=="function") return _dok("sin tabla");
  var arr=tablaOrdenada(), malos=[];
  for(var i=1;i<arr.length;i++){
    if((arr[i].pts||0)>(arr[i-1].pts||0)) malos.push(arr[i].n+" ("+arr[i].pts+") va debajo de "+arr[i-1].n+" ("+arr[i-1].pts+")");
  }
  return malos.length?_dmal("la tabla está mal ordenada",malos):_dok(arr.length+" equipos en orden");
}});

/* 7.9025 · los precios de entrada de Argentina estaban en otra escala (aforo × 6,67:
   popular de Boca a 360.000). Cualquier sector fuera de la banda de precios reales
   chilenos del repo es sospechoso: la plata va en millones de pesos chilenos. */
devDoctorRegistrar({id:"precios_entrada", area:"motor", n:"Precios de entrada en escala", fn:function(){
  if(typeof ESTADIOS_DATA!=="object") return _dok("sin estadios");
  var fuera=[];
  Object.keys(ESTADIOS_DATA).forEach(function(id){
    ((ESTADIOS_DATA[id]||{}).sectores||[]).forEach(function(s){
      var pr=s.precio||0;
      if(pr && (pr<2000 || pr>80000)) fuera.push(id+" · "+s.n+": "+pr);
    });
  });
  return fuera.length?_dmal(fuera.length+" sector(es) con precio fuera de escala (2.000–80.000)",fuera.slice(0,20))
                     :_dok(Object.keys(ESTADIOS_DATA).length+" estadios con precios en escala");
}});
/* y el efecto: ninguna taquilla de local puede ser 20× la mediana de la liga */
devDoctorRegistrar({id:"taquilla_escala", area:"motor", n:"La taquilla del club no está desbocada", fn:function(){
  if(!E||typeof taquilla!=="function") return _dok("sin partida");
  var t=taquilla({tipo:"liga",local:true}).ingreso;
  var sem=(typeof ingresoSemanal==="function")?ingresoSemanal():0;
  if(t>40*Math.max(1,sem)) return _dmal("una taquilla de local ("+t+") vale más de 40 semanas de ingresos ("+sem+"/sem)");
  return _dok("taquilla de local "+t+" · ingresos semanales "+sem);
}});
/* 7.9026 · la taquilla de una temporada cubría 7× los costos anuales de Colo-Colo: la
   caja subía sola y la plata dejaba de importar. Con la calibración queda en ~1,6×. */
devDoctorRegistrar({id:"taquilla_vs_costos", area:"motor", n:"La taquilla no aplasta al resto de la economía", fn:function(){
  if(!E||typeof taquilla!=="function"||typeof egresosAnuales!=="function") return _dok("sin partida");
  var locales=(E.calendario||[]).filter(function(p){ return p.local && !p.amistoso; }).length;
  var tq=taquilla({tipo:"liga",local:true}).ingreso*locales;
  var eg=egresosAnuales(), costos=0; Object.keys(eg).forEach(function(k){ costos+=eg[k]||0; });
  var ratio=costos?tq/costos:0;
  var txt="taquilla estimada "+Math.round(tq)+" ("+locales+" de local) · costos "+Math.round(costos)+" · ×"+(Math.round(ratio*10)/10);
  return ratio>3?_dmal(txt+": la taquilla sola paga 3+ años de costos, la plata deja de importar"):_dok(txt);
}});
/* ============ ÁREA: SIMULACIÓN ============ */
/* Corre temporadas COMPLETAS sobre una copia y revisa que al final todo cierre.
   Usa el snapshot de Grok (clonarPartida/restaurarPartida) para no tocar la
   partida real del jugador. Es el chequeo pesado. */
function devSimularYRevisar(temporadas, opts2){
  temporadas=Math.max(1,Math.min(10,temporadas||2));
  if(!E) return _dmal("no hay partida abierta");
  var snap=(typeof clonarPartida==="function")?clonarPartida(E):null;
  if(!snap) return _dmal("no se pudo respaldar la partida (no se simula nada)");
  var problemas=[], detalle=[], t0=Date.now();
  try{
    E._bulkSim=true;
    for(var s=0;s<temporadas;s++){
      var anio=E.anio, vueltas=0;
      while(typeof proximoPartido==="function" && proximoPartido() && vueltas<200){
        var p=proximoPartido();
        if(!p.jugado){
          var P=iniciarPartido(p,"simular");
          if(typeof correrHasta==="function") correrHasta(P,90);
          terminarPartido(P);
          /* 7.9029 · cerrar la semana como el avance rápido real: sin esto el
             harness no cobraba sueldos ni costos y todo club "se hacía rico" */
          if(!P.amistoso && typeof procesarSemanaRapido==="function"){ try{ procesarSemanaRapido(); }catch(e){ problemas.push("procesarSemanaRapido explotó: "+e.message); } }
        } else if(typeof procesarSemanaPostPartido==="function"){ procesarSemanaPostPartido(); }
        vueltas++;
      }
      if(vueltas>=200) problemas.push("temporada "+anio+": el calendario no termina nunca (200 vueltas)");
      /* invariantes al cierre */
      ["tabla_coherente","goles_cuadran","nadie_sin_jugar","orden_tabla"].forEach(function(id){
        var c=DOCTOR_CHECKS.filter(function(x){ return x.id===id; })[0];
        if(!c) return;
        var r=c.fn();
        if(!r.ok) problemas.push("temporada "+anio+" · "+c.n+": "+r.txt);
      });
      var camp=(typeof tablaOrdenada==="function")?tablaOrdenada()[0]:null;
      var tOrd=(typeof tablaOrdenada==="function")?tablaOrdenada():[];
      var miPos=tOrd.findIndex(function(f){ return f.id===E.club; })+1;
      detalle.push("temporada "+anio+": "+vueltas+" compromisos · puntero "+((camp&&camp.n)||"?")+" ("+((camp&&camp.pts)||0)+" pts)"+
        " · tu club "+(miPos||"?")+"° · caja "+Math.round(E.plata||0)+" · deuda "+Math.round(E.deuda||0));
      if(opts2&&opts2.registro) opts2.registro.push({anio:anio, campeon:camp&&camp.id, pos:miPos, plata:Math.round(E.plata||0), deuda:Math.round(E.deuda||0)});
      /* OJO (aprendido a los golpes): NO se llama `cerrarTemporada()` acá.
         Esa función hace `finDeTemporada()` y después abre un MODAL; el año
         avanza recién cuando el jugador aprieta el botón (ui.js `_seguir`),
         que es quien llama a `nuevoAnio()` → `reiniciarTabla()`.
         Llamándola desde un harness, el estado queda a mitad de camino: la
         tabla mezcla filas de la temporada vieja con el plantel de ligas ya
         ascendidas/descendidas. Eso NO es un bug del motor — es un transitorio
         que el jugador nunca ve — pero hacía que este doctor reportara
         "GF ≠ GC" y "cerrar no avanzó el año" en falso. Se usa el camino sin UI. */
      if(typeof finDeTemporada==="function"){ try{ finDeTemporada(); }catch(e){ problemas.push("temporada "+anio+": finDeTemporada explotó — "+e.message); } }
      if(typeof nuevoAnio==="function"){ try{ nuevoAnio(); }catch(e){ problemas.push("temporada "+anio+": nuevoAnio explotó — "+e.message); } }
      if(E.anio===anio) problemas.push("temporada "+anio+": el año no avanzó al cerrar");
      /* tras reiniciarTabla, el pool y las filas tienen que corresponderse */
      var pool2=(typeof clubesLigaActual==="function")?clubesLigaActual():[];
      var sinFila=(pool2||[]).filter(function(c){ return !E.tabla[c.id]; }).map(function(c){ return c.id; });
      /* en ligas zonales (Segunda, Argentina) la tabla trae las dos zonas a propósito:
         lo que sobra se mide contra la liga entera, no contra tu zona (7.9029) */
      var ligaEntera=(typeof LIGA_ACT!=="undefined"&&LIGA_ACT)?LIGA_ACT:pool2;
      var sobran=Object.keys(E.tabla||{}).filter(function(id){ return !(ligaEntera||[]).some(function(c){ return c.id===id; }); });
      if(sinFila.length) problemas.push("temporada "+anio+": tras cerrar, "+sinFila.length+" club(es) del torneo sin fila ("+sinFila.slice(0,6).join(",")+")");
      if(sobran.length) problemas.push("temporada "+anio+": tras cerrar, "+sobran.length+" fila(s) de clubes que ya no están ("+sobran.slice(0,6).join(",")+")");
    }
  }catch(e){ problemas.push("EXCEPCIÓN simulando: "+e.message); }
  var ms=Date.now()-t0;
  try{ if(typeof restaurarPartida==="function") restaurarPartida(snap); }catch(e){ problemas.push("no se pudo restaurar la partida: "+e.message); }
  detalle.push("tiempo: "+ms+" ms ("+Math.round(ms/temporadas)+" ms por temporada)");
  if(ms/temporadas>9000) problemas.push("va lento: "+Math.round(ms/temporadas)+" ms por temporada");
  return problemas.length?_dmal(problemas.length+" problema(s) simulando "+temporadas+" temporada(s)",problemas.concat(detalle))
                         :_dok(temporadas+" temporada(s) simuladas y cerradas sin romper nada",detalle);
}
devDoctorRegistrar({id:"sim_temporadas", area:"simulacion", n:"Simular temporadas y revisar el cierre", pesado:true,
  fn:function(){ return devSimularYRevisar(2); }});

/* ============ ÁREA: CONTENIDO ============ */
devDoctorRegistrar({id:"cobertura", area:"contenido", n:"Ningún club sin alma propia", fn:function(){
  if(typeof devInformeCobertura!=="function") return _dok("auditor no cargado");
  var inf=devInformeCobertura();
  var txt=inf.total+" dirigibles · "+inf.ricos.length+" ricos · "+inf.medios.length+" medios · "+inf.pobres.length+" pobres";
  return inf.pobres.length?_dmal(txt,inf.pobres.map(function(c){ return c.id+" ("+c.total+" ítems)"; })):_dok(txt);
}});
devDoctorRegistrar({id:"epocas", area:"contenido", n:"Ninguna época arranca vacía", fn:function(){
  if(typeof epocasHuerfanas!=="function") return _dok("auditor de épocas no cargado");
  var h=epocasHuerfanas();
  return h.length?_dmal(h.length+" época(s) sin decisión propia",h.map(function(x){ return x.club+" "+x.anio+" · "+x.etq; }))
                 :_dok("las 84 épocas tienen contenido propio");
}});
/* 7.9017 · el error de "La Portada": un club nombrando el estadio de otro */
devDoctorRegistrar({id:"estadios_cruzados", area:"contenido", n:"Nadie nombra el estadio de otro club", fn:function(){
  if(typeof ALMA_EPOCA==="undefined") return _dok("sin contenido de época");
  var estDe={};
  [typeof LIGA_2026!=="undefined"?LIGA_2026:[], typeof LIGA_B_2026!=="undefined"?LIGA_B_2026:[],
   typeof LIGA_C_2026!=="undefined"?LIGA_C_2026:[], typeof LIGA_ARG_2026!=="undefined"?LIGA_ARG_2026:[],
   typeof LIGA91!=="undefined"?LIGA91:[]].forEach(function(L){
    (L||[]).forEach(function(c){ if(c&&c.id&&c.est) (estDe[c.id]=estDe[c.id]||[]).push(String(c.est).replace(/^Estadio\s+/i,"").toLowerCase()); });
  });
  var AMB=["nacional","el cobre","municipal"], cruces=[];
  function distintivo(e){ return e.split(/\s+/).length>=2 && e.length>=10 && AMB.indexOf(e)<0; }
  ALMA_EPOCA.forEach(function(x){
    var txt=[x.t,x.ctx].concat((x.op||[]).map(function(o){ return o.t+" "+o.d; })).join(" ").toLowerCase();
    var propios=estDe[x.c]||[];
    Object.keys(estDe).forEach(function(otro){
      if(otro===x.c) return;
      estDe[otro].forEach(function(e){
        if(!distintivo(e)||propios.indexOf(e)>=0) return;
        if(txt.indexOf(e)>=0) cruces.push(x.c+" "+x.a+' dice "'+e+'" (es de '+otro+")");
      });
    });
  });
  return cruces.length?_dmal(cruces.length+" cruce(s) de estadio",cruces):_dok("sin cruces");
}});
/* 7.9013 · el mundo de fondo no puede ser anacrónico */
devDoctorRegistrar({id:"mundo_epoca", area:"contenido", n:"El mundo de fondo respeta el año", fn:function(){
  if(!E||!E.mundo) return _dok("sin mundo");
  var anio=E.anio||2026;
  if(anio>=2010) return _dok(anio+": era moderna, el mundo modelado corresponde");
  var txt=JSON.stringify({p:E.mundo.pais||[],v:E.mundo.vida||[],n:E.mundo.noticias||[]});
  var mal=["Sudamericana","Copa de la Liga","Copa Argentina","Libertadores"].filter(function(w){ return txt.indexOf(w)>=0; });
  return mal.length?_dmal(anio+" nombra torneos que no existían: "+mal.join(", "))
                   :_dok(anio+": el mundo de fondo está podado, sin anacronismos");
}});

/* ============ ÁREA: INTERFAZ ============ */
/* Barre todas las secciones buscando botones muertos, paneles vacíos y desborde
   horizontal. Es lo que yo venía haciendo a mano con sondas; ahora vive acá. */
devDoctorRegistrar({id:"ui_secciones", area:"interfaz", n:"Secciones sin botones muertos ni desborde", pesado:true, fn:function(){
  if(typeof render!=="function"||typeof SEC==="undefined") return _dok("sin UI");
  var secOrig=SEC, problemas=[], vistas=0;
  var secs=["escritorio","institucion","finanzas","plantel","mercado","estadio","calendario","historia","carrera","vida"];
  try{
    secs.forEach(function(s){
      try{ SEC=s; render(); if(typeof cerrarModal==="function") cerrarModal(); }
      catch(e){ problemas.push(s+": EXPLOTA al renderizar — "+e.message); return; }
      vistas++;
      var v=document.getElementById("vista"); if(!v) return;
      var bs=v.querySelectorAll("button"), mudos=0;
      for(var i=0;i<bs.length;i++){ if(!bs[i].disabled && typeof bs[i].onclick!=="function" && !bs[i].getAttribute("onclick")) mudos++; }
      if(mudos) problemas.push(s+": "+mudos+" botón(es) sin acción");
      var ps=v.querySelectorAll(".panel");
      for(var j=0;j<ps.length;j++){
        var cu=ps[j].querySelector(".cuerpo");
        if(cu && (cu.textContent||"").trim().length<3){
          var cab=(ps[j].querySelector(".cab")||{}).textContent||"?";
          problemas.push(s+": panel vacío «"+cab.trim().slice(0,28)+"»");
        }
      }
      var d=document.documentElement;
      var over=d.scrollWidth-d.clientWidth;
      if(over>2) problemas.push(s+": desborde horizontal de "+over+"px");
    });
  } finally { try{ SEC=secOrig; render(); }catch(e){} }
  return problemas.length?_dmal(problemas.length+" problema(s) en "+vistas+" secciones",problemas)
                         :_dok(vistas+" secciones limpias: sin botones muertos, paneles vacíos ni desborde");
}});
/* 7.9020 · nada de la barra puede quedar fuera de alcance */
devDoctorRegistrar({id:"barra_alcanzable", area:"interfaz", n:"Todo lo de la barra se puede tocar", fn:function(){
  var br=document.getElementById("barra"); if(!br) return _dok("sin barra");
  var cs=getComputedStyle(br), desborda=br.scrollWidth-br.clientWidth;
  if(desborda<=2) return _dok("la barra entra completa");
  if(cs.overflowX==="auto"||cs.overflowX==="scroll") return _dok("sobran "+desborda+"px pero la barra se desliza");
  return _dmal("sobran "+desborda+"px y la barra NO se desliza (overflow-x:"+cs.overflowX+"): hay botones inalcanzables");
}});
/* 7.9022 · bug reportado por el autor: las copas del país solo mostraban lo
   YA jugado (20 filas, 0 con "—"). El jugador nunca veía qué se venía. */
devDoctorRegistrar({id:"copas_proximos", area:"interfaz", n:"Las copas del país muestran lo que viene, no solo lo jugado", fn:function(){
  if(!E||!E.mundo||!E.mundo.copas) return _dok("sin mundo de copas");
  if(typeof copasPaisProximos!=="function"||typeof copasPaisConPendientes!=="function") return _dmal("copas-vivas.js no está cargado");
  if(!copasPaisConPendientes()) return _dok("todas las copas de grupo ya terminaron su fase; nada pendiente que mostrar");
  var prox=copasPaisProximos(20);
  return prox.length?_dok(prox.length+' cruce(s) pendiente(s) listados, con "—"'):
    _dmal("hay copas con rondas por jugar pero el panel no muestra ningún cruce sin jugar");
}});
/* los sub-paneles "Grupo X" (Copa Chile / CONMEBOL) dibujaban la tabla del
   grupo con CERO filas de partidos: no se veía quién jugaba contra quién. */
devDoctorRegistrar({id:"copas_grupo_partidos", area:"interfaz", n:"Los paneles de grupo muestran sus partidos", fn:function(){
  if(!E||!E.mundo||!E.mundo.copas) return _dok("sin mundo de copas");
  if(typeof copaGrupoFixture!=="function") return _dmal("copaGrupoFixture no está cargado");
  var vacios=[], grupos=0;
  ["chile","copaLiga","lib","sud"].forEach(function(tk){
    var pack=E.mundo.copas[tk]; if(!pack||!pack.grupos) return;
    Object.keys(pack.grupos).forEach(function(L){
      grupos++;
      var r=copaGrupoFixture(tk,L);
      if(!r||!r.filas||!r.filas.length) vacios.push(tk+" "+L);
    });
  });
  if(!grupos) return _dok("sin grupos de copa este año");
  return vacios.length?_dmal(vacios.length+" de "+grupos+" grupo(s) sin ningún partido listado",vacios)
                      :_dok("los "+grupos+" grupos de copa tienen su lista de partidos");
}});
/* 7.9022 · pedido del autor: que se VEA qué está pasando al simular varias
   temporadas (fecha, posición, campeón anterior), no solo el año; y que la
   corrida ceda el hilo (no trabe la UI). Se prueba la MISMA función que usa
   la pantalla real (_simTextoProgreso), no una copia que se puede desalinear. */
devDoctorRegistrar({id:"sim_progreso_visible", area:"interfaz", n:"Simular temporadas muestra fecha, posición y campeón anterior", fn:function(){
  if(typeof _simTextoProgreso!=="function") return _dmal("_simTextoProgreso no está cargado");
  var txt=_simTextoProgreso({temp:2,tope:5,anio:2027,club:"Club de Prueba",fecha:8,totFechas:30,pos:3,campeonAnterior:"Otro Club (60 pts)"});
  var falta=[];
  if(txt.indexOf("8")<0||txt.indexOf("30")<0) falta.push("el texto no muestra la fecha (8/30)");
  if(txt.indexOf(typeof ordinal==="function"?ordinal(3):"3°")<0) falta.push("el texto no muestra la posición");
  if(txt.indexOf("Otro Club")<0) falta.push("el texto no muestra el campeón anterior");
  if(typeof avanzarRapidoLote!=="function") falta.push("avanzarRapidoLote no existe (la corrida quedaría bloqueante)");
  else if(avanzarRapidoLote.toString().indexOf("setTimeout")<0) falta.push("avanzarRapidoLote no cede el hilo (no usa setTimeout): volvería a trabar la UI");
  return falta.length?_dmal(falta.length+" problema(s)",falta)
                     :_dok("el overlay puede mostrar fecha, posición y campeón anterior; la corrida cede el hilo entre lotes");
}});
/* 7.9025 · el penal no puede volver a ser un formulario de 3 botones */
devDoctorRegistrar({id:"arco_escena_3d", area:"interfaz", n:"Penal, tiro libre y córner se patean en la cancha", fn:function(){
  var falta=[];
  if(typeof _abrirEscenaArco!=="function") falta.push("_abrirEscenaArco no está");
  if(typeof minijuegoPenal!=="function"||String(minijuegoPenal).indexOf("_abrirEscenaArco")<0) falta.push("el penal no abre la escena");
  if(typeof minijuegoTiroLibre!=="function"||String(minijuegoTiroLibre).indexOf("_abrirEscenaArco")<0) falta.push("el tiro libre no abre la escena");
  if(typeof minijuegoCorner!=="function"||String(minijuegoCorner).indexOf("_abrirEscenaArco")<0) falta.push("el córner no abre la escena");
  if(typeof mostrarAccion!=="function") falta.push("mostrarAccion no está");
  else {
    var src=String(mostrarAccion);
    if(src.indexOf("minijuegoPenal")<0) falta.push("dirigir un penal no entra al minijuego");
    var iDir=src.indexOf('P.modo==="dirigir"');
    var iForm=src.indexOf("¿Quién patea");
    if(iDir<0) falta.push("no hay atajo dirigir → escena");
    if(iForm>=0 && iDir>=0 && iForm<iDir) falta.push("el formulario de 3 sale ANTES que la cancha");
  }
  var svg=(typeof htmlArcoVivo==="function")?htmlArcoVivo({modo:"penal"}):"";
  if(!/arco-arq/.test(svg)) falta.push("el arco no trae arquero");
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("se abre la escena 3d con arco y arquero, no un listado");
}});

/* 7.9027 · el arco se ve como un arco: el arquero mide lo que mide una persona,
   la cámara no recorta los palos y el guante llega a la pelota cuando ataja */
function _docArcoSvg(){
  var NS="http://www.w3.org/2000/svg", svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 360 240"); svg.setAttribute("width","360"); svg.setAttribute("height","240");
  svg.style.cssText="position:absolute;left:-9999px;top:0;visibility:hidden";
  svg.innerHTML=htmlArcoVivo({modo:"penal"});
  document.body.appendChild(svg);
  return svg;
}
/* cada medida en un SVG nuevo: Chromium cachea la matriz si ya se midió (getBBox) */
function _docArcoGuante(aim, ataja){
  var svg=_docArcoSvg(), arq=svg.querySelector("#arco-arq");
  var D=_arqDestino(arq,"izq",{aim:aim,ataja:ataja});
  _arqPose(arq, D.x0+D.dx, D.y0+D.dy, D.esc, D.rot, D.brazo);
  var c=svg.querySelector("#arco-mano-izq").getCTM();
  svg.remove();
  return Math.hypot(c.e-aim.cx, c.f-aim.cy);
}
function _docArcoMedir(){
  if(typeof document==="undefined"||!document.body||typeof htmlArcoVivo!=="function") return null;
  var r={};
  try{
    var svg=_docArcoSvg();
    r.altoArq=svg.querySelector("#arco-arq").getBBox().height; r.altoArco=168-38;
    svg.remove();
    var aim={cx:70,cy:60,tercio:"izq",alt:"alto",fuera:false};
    r.distAtaja=_docArcoGuante(aim,true);
    r.distGol=_docArcoGuante(aim,false);
  }catch(e){ r.error=e.message; }
  return r;
}
devDoctorRegistrar({id:"arco_arte", area:"interfaz", n:"El arco se ve como un arco (arquero, cámara, atajada)", fn:function(){
  var falta=[];
  var html=(typeof htmlArcoVivo==="function")?htmlArcoVivo({modo:"penal"}):"";
  if(!/arco-brazo-izq/.test(html)||!/arco-brazo-der/.test(html)) falta.push("el arquero no tiene brazos que se estiren");
  if(!/arcoMalla/.test(html)) falta.push("el arco no tiene red con fondo");
  if(!/arco-bola-sombra/.test(html)) falta.push("la pelota no tiene sombra en el pasto");
  if(typeof _arcoMontarSvg!=="function"||/slice/.test(String(_arcoMontarSvg))) falta.push("la cámara recorta (slice): en celu se pierden los palos");
  if(typeof _arcoPunto!=="function"||String(_arcoPunto).indexOf("getScreenCTM")<0) falta.push("el dedo no se traduce con la matriz real del SVG");
  var m=_docArcoMedir();
  if(m&&m.error) falta.push("medición falló: "+m.error);
  else if(m){
    var prop=m.altoArq/m.altoArco;
    if(!(prop>0.62&&prop<0.9)) falta.push("el arquero mide "+Math.round(prop*100)+"% del arco (una persona real: ~75%)");
    if(!(m.distAtaja<12)) falta.push("cuando ataja, el guante queda a "+Math.round(m.distAtaja)+" de la pelota");
    if(!(m.distGol>10)) falta.push("cuando es gol por su lado, el guante igual toca la pelota ("+Math.round(m.distGol)+")");
  }
  return falta.length?_dmal(falta.length+" problema(s)",falta)
    :_dok(m?("arquero "+Math.round(m.altoArq/m.altoArco*100)+"% del arco; guante a "+Math.round(m.distAtaja)+" cuando ataja, a "+Math.round(m.distGol)+" cuando no llega"):"arte presente (sin DOM para medir)");
}});

/* 7.9027 · Ajustes es una ventana: ⚙️ la abre, todo se pinta ADENTRO (las envolturas
   de otros archivos no pueden tirarlo a #vista) y la cuenta ofrece el código al correo */
devDoctorRegistrar({id:"ajustes_ventana", area:"interfaz", n:"Ajustes abre como ventana y trae el login por código", fn:function(){
  var falta=[];
  if(typeof abrirAjustes!=="function") falta.push("abrirAjustes no existe");
  if(typeof document!=="undefined"){
    var b=document.getElementById("btnAjustes");
    if(b && String(b.onclick).indexOf("abrirAjustes")<0) falta.push("el ⚙️ no abre la ventana");
    if(typeof vistaAjustes==="function"){
      var vista=document.getElementById("vista"), antes=vista?vista.innerHTML.length:0;
      var host=document.createElement("div");
      try{ vistaAjustes(host); }catch(e){ falta.push("vistaAjustes explota: "+e.message); }
      var despues=vista?vista.innerHTML.length:0;
      if(!host.querySelector(".panel")) falta.push("vistaAjustes no pinta en la ventana");
      if(despues!==antes) falta.push("algo de Ajustes se pintó en #vista en vez de la ventana (una envoltura sin host)");
      if(typeof nubeActiva==="function"&&nubeActiva()&&!(typeof nubeLogueado==="function"&&nubeLogueado())){
        if(!/Código al correo/.test(host.textContent)) falta.push("la cuenta no ofrece código al correo");
        var foco=host.querySelector(".nube-login");
        if(!foco) falta.push("no aparece el formulario de cuenta");
      }
    }
  }
  if(typeof nubePedirCodigo!=="function"||typeof nubeVerificarCodigo!=="function") falta.push("falta el flujo OTP en nube.js");
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("⚙️ abre ventana; todo se pinta adentro; código al correo disponible");
}});

/* 7.9027 · prueba el login por código de punta a punta SIN red ni correos:
   simula el servidor, pide código, prueba uno malo y uno bueno, y deja todo como estaba. */
function devProbarLoginCodigo(){
  var t0=Date.now(), falta=[];
  if(typeof nubePedirCodigo!=="function"||typeof nubeVerificarCodigo!=="function")
    return Promise.resolve({ok:false, txt:"falta el flujo OTP", detalle:["nubePedirCodigo/nubeVerificarCodigo"]});
  var fetchOrig=window.fetch, sesion=null, llamadas=[];
  try{ sesion=localStorage.getItem(NUBE_LLAVE_SESION); }catch(e){}
  var hastaOrig=_nubeOtpHasta;
  window.fetch=function(u,o){
    u=String(u); llamadas.push(u);
    function J(st,j){ return Promise.resolve(new Response(JSON.stringify(j),{status:st,headers:{"Content-Type":"application/json"}})); }
    if(u.indexOf("/auth/v1/otp")>=0) return J(200,{});
    if(u.indexOf("/auth/v1/verify")>=0){
      var bd={}; try{ bd=JSON.parse(o.body); }catch(e){}
      return bd.token==="424242"?J(200,{access_token:"t",refresh_token:"r",expires_in:3600,user:{id:"dev",email:bd.email}}):J(400,{msg:"Token has expired or is invalid"});
    }
    return J(200,[]);
  };
  _nubeOtpHasta=0;
  var mail="doctor@futbolini.test";
  function restaurar(){
    window.fetch=fetchOrig; _nubeOtpHasta=hastaOrig;
    try{ if(sesion) localStorage.setItem(NUBE_LLAVE_SESION,sesion); else localStorage.removeItem(NUBE_LLAVE_SESION); }catch(e){}
  }
  return nubePedirCodigo(mail).then(function(r){
    if(!r.ok) falta.push("pedir código falla: "+r.msg);
    if(!llamadas.some(function(u){ return u.indexOf("/auth/v1/otp")>=0; })) falta.push("no llama a /auth/v1/otp");
    return nubePedirCodigo(mail);
  }).then(function(r2){
    if(r2.ok) falta.push("deja pedir otro código al tiro (sin espera de 60 s)");
    return nubeVerificarCodigo(mail,"000000");
  }).then(function(r3){
    if(r3.ok) falta.push("acepta un código malo");
    return nubeVerificarCodigo(mail,"424242");
  }).then(function(r4){
    if(!r4.ok) falta.push("rechaza el código bueno: "+r4.msg);
    else if(!(typeof nubeLogueado==="function"&&nubeLogueado())) falta.push("verificó pero no quedó la sesión");
    else if(nubeEmail()!==mail) falta.push("la sesión quedó con otro correo");
  }).catch(function(e){ falta.push("explotó: "+(e&&e.message)); })
  .then(function(){
    restaurar();
    return {ok:!falta.length, ms:Date.now()-t0, detalle:falta,
      txt:falta.length?(falta.length+" problema(s)"):"pide, espera 60 s, rechaza el malo, entra con el bueno; sesión restaurada"};
  });
}

/* 7.9029 · radiografía económica: abre cada club de una época (sobre una copia)
   y mide planilla, ingresos fijos, taquilla estimada y el balance del año.
   Sirve para calibrar: si todos ganan plata sin hacer nada, no hay juego. */
function devEconomiaClubes(anio, base){
  anio=anio||2026;
  var snap=(typeof E!=="undefined"&&E&&typeof clonarPartida==="function")?clonarPartida(E):null;
  var out=[];
  try{
    activarLiga(base||baseEra(anio));
    var D=datosEra(base||baseEra(anio)), ids=Object.keys(D.info||{});
    ids.forEach(function(id){
      try{
        if(nuevaPartida(id,anio,"historico")===false) return;
        var ing=ingresosAnuales(), eg=egresosAnuales();
        var locales=(E.calendario||[]).filter(function(p){ return p.local&&!p.amistoso; }).length;
        var taq=taquilla({tipo:"liga",local:true}).ingreso*locales;
        var fijos=ing.tv+ing.sponsors+ing.socios+(ing.digital||0);
        var nivel=(typeof mediaPlantel==="function")?Math.round(mediaPlantel()):0;
        out.push({id:id, n:E.clubNombre, nivel:nivel, planilla:eg.planilla, operacion:eg.operacion,
          fijos:Math.round(fijos), taquilla:Math.round(taq), balance:Math.round(fijos+taq-eg.planilla-eg.operacion-eg.intereses)});
      }catch(e){ out.push({id:id, error:e.message}); }
    });
  } finally {
    if(snap&&typeof restaurarPartida==="function") restaurarPartida(snap);
  }
  return out.sort(function(a,b){ return (b.nivel||0)-(a.nivel||0); });
}

/* 7.9029 · ¿tus partidos responden a la fuerza igual que los de la IA?
   Juega N partidos del motor del jugador (sin tocar la partida: copia y
   restaura) contra rivales con diferencia de fuerza controlada, y compara
   ganados/empates/perdidos contra el modelo de la IA (_golesSimulados).
   Si el motor amplifica diferencias, el club que controlás gana todo o se hunde. */
/* 7.9037 · "Calibrar motor vs IA" congelaba la página: 1.500 partidos y, antes de cada uno, se
   clonaba el juego entero (200+ KB de JSON). Un partido simulado solo toca plantel, indicadores y
   memoria: se guarda y restaura eso. El botón corre por tandas (progreso y cancelar). Azar
   sembrado: números estables entre corridas (no idénticos: el relato recuerda frases usadas). */
var _CAL_CLAVES=["plantel","ind","memoria","logros","_memId"];
function _calFoto(){ var f={}; _CAL_CLAVES.forEach(function(k){ f[k]=(k in E)?JSON.stringify(E[k]):undefined; }); return f; }
function _calVolver(f){ _CAL_CLAVES.forEach(function(k){ if(f[k]===undefined) delete E[k]; else E[k]=JSON.parse(f[k]); }); }
function _calNuevo(n, difs){
  n=n||120; difs=difs||[-12,-6,0,6,12];
  if(!E||typeof iniciarPartido!=="function") return null;
  var st={n:n, difs:difs, out:[], esc:[], i:0, j:0, hechos:0, total:n*difs.length*2, snap:clonarPartida(E), mathR:Math.random, rnd:null};
  if(typeof azarFijo==="function"&&typeof semilla==="function") st.rnd=azarFijo(semilla("calibrar|"+(E.club||"")+"|"+n+"|"+difs.join(",")));
  st.molde=(E.calendario||[]).filter(function(p){ return p.tipo==="liga"; })[0];
  E._bulkSim=true;
  var fz=fuerzaEquipo(onceIdeal()); st.mio=(fz.ataque+fz.orden)/2;
  difs.forEach(function(d){ [true,false].forEach(function(local){ st.esc.push({d:d,local:local,w:0,e:0,l:0,wi:0,ei:0,li:0}); }); });
  st.foto=_calFoto();
  return st;
}
function _calPaso(st, cuantos){
  if(st.rnd) Math.random=st.rnd;
  try{
    while(cuantos-- > 0 && st.i<st.esc.length){
      var s=st.esc[st.i], d=s.d, local=s.local;
      var part=Object.assign({},st.molde,{local:local, fuerzaRival:Math.round(st.mio-d), jugado:false, tipo:"liga"});
      var P=iniciarPartido(part,"simular"); correrHasta(P,90);
      var gm=local?P.gl:P.gv, gr=local?P.gv:P.gl;
      if(gm>gr) s.w++; else if(gm===gr) s.e++; else s.l++;
      _calVolver(st.foto);
      var a={id:"_a",fuerza:st.mio}, b={id:"_b",fuerza:st.mio-d};
      var g=local?_golesSimulados(a,b):_golesSimulados(b,a);
      var ga=local?g[0]:g[1], gb=local?g[1]:g[0];
      if(ga>gb) s.wi++; else if(ga===gb) s.ei++; else s.li++;
      st.hechos++;
      if(++st.j>=st.n){
        var ptsM=(3*s.w+s.e)/st.n, ptsI=(3*s.wi+s.ei)/st.n;
        st.out.push({dif:d, local:local, motor:[s.w,s.e,s.l], ia:[s.wi,s.ei,s.li], ptsMotor:Math.round(ptsM*100)/100, ptsIA:Math.round(ptsI*100)/100, brecha:Math.round((ptsM-ptsI)*100)/100});
        st.i++; st.j=0;
      }
    }
  } finally { Math.random=st.mathR; }
  return st.i>=st.esc.length;
}
function _calCerrar(st){ Math.random=st.mathR; restaurarPartida(st.snap); }
function devCalibrarMotor(n, difs){
  var st=_calNuevo(n, difs); if(!st) return null;
  try{ _calPaso(st, Infinity); } finally { _calCerrar(st); }
  return st.out;
}
function devCalibrarMotorAsync(n, difs, onProgreso, onListo){
  var st=_calNuevo(n, difs); if(!st){ if(onListo) onListo(null); return null; }
  var ctl={cancelar:false};
  function paso(){
    var fin=false;
    try{ fin=ctl.cancelar||(E&&E._bulkCancel)||_calPaso(st, 40); }
    catch(e){ _calCerrar(st); if(onListo) onListo(null, e); return; }
    if(onProgreso) onProgreso(st.hechos, st.total);
    if(fin){ var canc=ctl.cancelar||(E&&E._bulkCancel); _calCerrar(st); if(E) delete E._bulkCancel; if(onListo) onListo(canc?null:st.out); return; }
    setTimeout(paso, 0);
  }
  setTimeout(paso, 0);
  return ctl;
}

/* 7.9029 · tres chequeos del equilibrio. Todos corren sobre copias y restauran. */
devDoctorRegistrar({id:"fuerza_calibrada", area:"motor", pesado:true, n:"Tu once rinde lo que dice la tabla (no hay ventaja por ser el jugador)", fn:function(){
  if(typeof nuevaPartida!=="function"||typeof fuerzaEquipo!=="function") return _dok("sin motor");
  var snap=(E&&typeof clonarPartida==="function")?clonarPartida(E):null, falta=[], det=[];
  try{
    ["CC","AUD","LIM"].forEach(function(id){
      if(nuevaPartida(id,2026,"historico")===false) return;
      var fz=fuerzaEquipo(onceIdeal()), ef=(fz.ataque+fz.orden)/2, t=fuerzaTablaPropia();
      var dif=Math.round((ef-t)*10)/10;
      det.push(id+": tabla "+t+" · tu once "+Math.round(ef*10)/10+" · dif "+dif);
      if(Math.abs(dif)>2) falta.push(id+" juega "+dif+" puntos distinto de lo que es en la tabla");
    });
  } finally { if(snap) restaurarPartida(snap); }
  return falta.length?_dmal(falta.length+" club(es) descalibrados",falta.concat(det)):_dok("tu once = fuerza de tabla (±2)",det);
}});
devDoctorRegistrar({id:"economia_escala", area:"motor", pesado:true, n:"Nadie se hace rico (ni quiebra) solo por ser grande o chico", fn:function(){
  if(typeof devEconomiaClubes!=="function") return _dok("sin radiografía");
  var r=devEconomiaClubes(2026).filter(function(x){ return !x.error; });
  if(!r.length) return _dmal("no se pudo medir ningún club");
  var bal=r.map(function(x){ return x.balance; }), max=Math.max.apply(null,bal), min=Math.min.apply(null,bal);
  var top=r.filter(function(x){ return x.balance===max; })[0], bot=r.filter(function(x){ return x.balance===min; })[0];
  var txt="balance anual sin gestionar: de "+min+" ("+bot.id+") a +"+max+" ("+top.id+")";
  var falta=[];
  if(max>1200) falta.push(top.id+" gana "+max+" al año sin hacer nada: la plata deja de importar");
  if(min<-900) falta.push(bot.id+" pierde "+(-min)+" al año hagas lo que hagas");
  if(max-min>2000) falta.push("la brecha entre clubes ("+(max-min)+") hace el juego trivial arriba e imposible abajo");
  return falta.length?_dmal(txt,falta):_dok(txt);
}});
devDoctorRegistrar({id:"motor_vs_ia", area:"simulacion", pesado:true, n:"Tus partidos responden a la fuerza igual que los de la IA", fn:function(){
  if(typeof devCalibrarMotor!=="function"||!E) return _dok("sin partida");
  if(E._fuerzaV!==2) return _dok("partida con escala vieja (anterior a 7.9029): no aplica");
  var r=devCalibrarMotor(120,[-10,0,10]);
  var m=r.reduce(function(s,x){ return s+x.brecha; },0)/r.length;
  var det=r.map(function(x){ return "dif "+x.dif+(x.local?" L":" V")+": motor "+x.ptsMotor+" pts vs IA "+x.ptsIA; });
  var txt="brecha media "+(Math.round(m*100)/100)+" pts/partido";
  return Math.abs(m)>0.2?_dmal(txt+(m>0?": el club del jugador saca ventaja":": el club del jugador queda castigado"),det):_dok(txt,det);
}});

/* 7.9030 · el juego tiene que poder vivir sin internet, y el navegador no puede
   servir JS viejo: los ?v= de index.html tienen que ser la VERSION actual
   (estuvieron clavados en 7.9024 durante 5 parches). */
devDoctorRegistrar({id:"offline_listo", area:"interfaz", n:"Se juega sin internet y no se sirve código viejo", fn:function(){
  if(typeof document==="undefined") return _dok("sin DOM");
  var falta=[], det=[];
  var v=(typeof VERSION!=="undefined")?VERSION:"?";
  var viejos=[].slice.call(document.querySelectorAll("script[src],link[rel=stylesheet][href]")).map(function(n){ return n.getAttribute("src")||n.getAttribute("href"); })
    .filter(function(u){ return u && !/^(https?:)?\/\//.test(u) && /\?v=/.test(u) && u.split("?v=")[1]!==v; });
  if(viejos.length) falta.push(viejos.length+" archivo(s) con ?v= distinto de "+v+" (el navegador puede servir código viejo): "+viejos.slice(0,3).join(", "));
  if(!document.querySelector('link[rel=manifest]')) falta.push("falta el manifiesto (no se puede instalar como app)");
  if(typeof offlineRegistrar!=="function"||typeof panelOffline!=="function") falta.push("falta offline.js");
  if(typeof offlineSoportado==="function"&&offlineSoportado()){
    var ctl=navigator.serviceWorker&&navigator.serviceWorker.controller;
    det.push(ctl?"service worker activo":"service worker todavía no controla la página (recargá una vez)");
    if(typeof OFFLINE!=="undefined"&&OFFLINE.estado) det.push(OFFLINE.estado.archivos+" archivos guardados · v"+OFFLINE.estado.version);
    if(typeof OFFLINE!=="undefined"&&OFFLINE.estado&&OFFLINE.estado.version!==v) falta.push("la copia offline es de v"+OFFLINE.estado.version+", el juego es v"+v);
  } else det.push("abierto como archivo o sin soporte: el modo sin internet se activa al jugarlo desde la web");
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat(det)):_dok("versiones al día"+(det.length?" · "+det[0]:""),det);
}});

/* 7.9030 · el Calendario dice la verdad: tu liga = tabla real (no una copia que el
   avance rápido dejaba en 0) y las repeticiones no inventan estadísticas en cero */
devDoctorRegistrar({id:"calendario_vivo", area:"interfaz", n:"El Calendario muestra tu tabla real y repeticiones honestas", fn:function(){
  if(!E||typeof mundoFilasLiga!=="function"||typeof _ligaKeyJugador!=="function") return _dok("sin partida");
  if(!E.mundo&&typeof mundoInit==="function") mundoInit();
  var k=_ligaKeyJugador(), falta=[];
  if(k&&E.mundo&&E.mundo.ligas&&E.mundo.ligas[k]&&E.tabla&&E.tabla[E.club]){
    var fila=mundoFilasLiga(k).filter(function(f){ return f.id===E.club; })[0], t=E.tabla[E.club];
    if(!fila) falta.push("tu club no aparece en la tabla del Calendario");
    else if(fila.pj!==t.pj||fila.pts!==t.pts) falta.push("el Calendario dice "+fila.pj+" PJ / "+fila.pts+" pts y la tabla real "+t.pj+" / "+t.pts);
  }
  if(typeof modalRepeticion==="function"&&String(modalRepeticion).indexOf("statsReales")<0)
    falta.push("la repetición muestra estadísticas aunque estén en cero (se ven rotas en partidos simulados)");
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("tabla del Calendario = tabla real; repeticiones sin datos inventados");
}});

/* 7.9035 · UN SOLO UNIVERSO. Bug reportado por el autor jugando con Rangers: ascendían
   Wanderers y Cobreloa y el Calendario los mostraba de nuevo en la B; la liguilla de la B
   no se jugaba si no eras vos (subía el 2° sin jugar); la Copa de la Liga decía 0 PJ. */
function _docMismo(a,b){ a=(a||[]).slice().sort(); b=(b||[]).slice().sort(); return a.length===b.length&&a.every(function(x,i){ return x===b[i]; }); }
devDoctorRegistrar({id:"universo_ligas", area:"motor", n:"El país del Calendario es el que se juega (ascensos incluidos)", fn:function(){
  if(!E||!E.mundo) return _dok("sin partida");
  if(!(E.eraBase===2026||E.eraBase==="2026"||E.eraBase==="2026b"||E.eraBase==="2026c")) return _dok("esta época no usa ascensos entre divisiones");
  if(E.mundo.ver!==2) return _dmal("el registro del país es el viejo (dos universos): se rearma al jugar la próxima fecha");
  var falta=[], L=E.mundo.ligas||{}, M=E.ligaMod||{};
  if(L["2026"]&&M[2026]&&!_docMismo(L["2026"].ids,M[2026])) falta.push("Primera del Calendario ≠ Primera vigente ("+L["2026"].ids.filter(function(id){ return M[2026].indexOf(id)<0; }).join(",")+" sobran)");
  if(L["2026b"]&&M["2026b"]&&!_docMismo(L["2026b"].ids,M["2026b"])) falta.push("la B del Calendario ≠ la B vigente ("+L["2026b"].ids.filter(function(id){ return M["2026b"].indexOf(id)<0; }).join(",")+" sobran)");
  if(M["2026c"]&&(L["2026cN"]||L["2026cS"])){
    var c=((L["2026cN"]||{}).ids||[]).concat((L["2026cS"]||{}).ids||[]);
    if(!_docMismo(c,M["2026c"])) falta.push("la Segunda del Calendario ≠ la Segunda vigente");
  }
  var w=[["resolverCopa",typeof resolverCopa==="function"&&resolverCopa._uni],["finDeTemporada",typeof finDeTemporada==="function"&&finDeTemporada._uni],
    ["procesarAscensoDescenso",typeof procesarAscensoDescenso==="function"&&procesarAscensoDescenso._uni],["_ordenSimDiv",typeof _ordenSimDiv==="function"&&_ordenSimDiv._uni]];
  w.forEach(function(x){ if(!x[1]) falta.push(x[0]+" no está enganchado al registro único"); });
  return falta.length?_dmal(falta.length+" descuadre(s)",falta):_dok("ligas del Calendario = divisiones vigentes; copas y cierre enganchados");
}});
devDoctorRegistrar({id:"universo_copas_jugador", area:"motor", n:"Tus partidos de copa están en las tablas y cuadros del país", fn:function(){
  if(!E||!E.mundo||E.mundo.ver!==2||!E.calendario) return _dok("sin registro único todavía");
  var falta=[], n=0;
  E.calendario.forEach(function(p){
    if(!p||!p.jugado||p.tipo!=="copa") return;
    var tor=p.torneo==="Copa Chile"?"chile":(p.torneo==="Copa de la Liga"?"copaLiga":(p.torneo==="Liguilla de Ascenso"?"ligB":null));
    if(!tor) return;
    n++;
    var a=p.local?E.club:p.rivalId, b=p.local?p.rivalId:E.club, ok=false;
    if(/^Grupo /.test(p.ronda||"")){
      var g=E.mundo.copas[tor]&&E.mundo.copas[tor].grupos&&E.mundo.copas[tor].grupos[(p.ronda||"").replace(/^Grupo\s+/,"")];
      if(!g){ falta.push(p.torneo+" "+p.ronda+": el grupo no existe en el país"); return; }
      ok=Object.keys(g.res||{}).some(function(k){ var x=k.split("|"); return x[1]===a&&x[2]===b; });
    } else {
      var L=(typeof mundoLlaveDe==="function")?mundoLlaveDe(p):null;
      ok=!!(L&&L.t.legs[L.i]);
    }
    if(!ok) falta.push(p.torneo+" "+p.ronda+" vs "+(p.rivalNombre||p.rivalId)+" ("+(p.f?p.f.d+"/"+p.f.m:"")+") no está en el registro");
  });
  if(!n) return _dok("todavía no jugaste copa este año");
  return falta.length?_dmal(falta.length+" de "+n+" partido(s) tuyos no cuentan en el país",falta):_dok("tus "+n+" partido(s) de copa cuentan en las tablas y cuadros");
}});
devDoctorRegistrar({id:"universo_liguilla", area:"motor", n:"La liguilla de la B tiene cuadro y sube el que la gana", fn:function(){
  if(!E||!E.mundo||E.mundo.ver!==2) return _dok("sin registro único todavía");
  var lb=E.mundo.ligB;
  if(!lb) return _dok("la B todavía no termina su fase regular");
  var falta=[];
  if(!lb.rondas||!lb.rondas.Cuartos||lb.rondas.Cuartos.length!==3) falta.push("cuartos incompletos (deben ser 3: 3°–8°, 4°–7°, 5°–6°)");
  if(lb.rondas.Semifinal&&lb.rondas.Semifinal.every(function(t){ return t.a!==lb.tabla[1]&&t.b!==lb.tabla[1]; })) falta.push("el 2° de la fase regular no está en semis");
  (E.calendario||[]).forEach(function(p){
    if(!p||p.torneo!=="Liguilla de Ascenso") return;
    var L=(typeof mundoLlaveDe==="function")?mundoLlaveDe(p):null;
    if(!L) falta.push("tu partido de "+p.ronda+" vs "+(p.rivalNombre||p.rivalId)+" no es una llave del cuadro");
  });
  if(lb.campeon&&E.ascensoAnio===E.anio&&E.ligaMod&&(E.ligaMod[2026]||[]).indexOf(lb.campeon)<0)
    falta.push(((typeof _nomClub==="function")?_nomClub(lb.campeon):lb.campeon)+" ganó la liguilla pero no subió");
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("cuadro completo"+(lb.campeon?"; campeón "+((typeof _nomClub==="function")?_nomClub(lb.campeon):lb.campeon):""));
}});
/* 7.9035 · "el 1 de NUB" en el once probable y "el 7 de UdeC" en el partido: el rival de
   otra división (o extranjero, o de un año sin plantel) salía con nombres de relleno */
devDoctorRegistrar({id:"rivales_con_nombre", area:"motor", n:"Todos tus rivales salen con jugadores con nombre", fn:function(){
  if(!E||!E.calendario||typeof plantelRival!=="function") return _dok("sin partida");
  var relleno=/^el \d+ de /i, malos={}, n=0;
  var snap=(typeof clonarPartida==="function")?clonarPartida(E):null;
  try{
    E.calendario.forEach(function(p){
      if(!p||(!p.rivalId&&!p.rivalNombre)) return;
      n++;
      [p.rivalId||p.rivalNombre, p.rivalNombre||p.rivalId].forEach(function(q){
        var xi=plantelRival(q, p.fuerzaRival)||[];
        if(xi.length<11||xi.some(function(j){ return !j||!j.n||relleno.test(j.n); })) malos[(p.torneo||(p.tipo==="liga"?"liga":p.tipo))+" vs "+(p.rivalNombre||p.rivalId)]=1;
      });
    });
  } finally { if(snap&&typeof restaurarPartida==="function") restaurarPartida(snap); }
  var lista=Object.keys(malos);
  return lista.length?_dmal(lista.length+" rival(es) con once de relleno",lista.slice(0,8)):_dok("los rivales de tus "+n+" partidos tienen once con nombre");
}});
/* 7.9035 · un partido salteado: clasificar a una llave durante terminarPartido movía el
   puntero al próximo sin jugar y el idx++ se comía uno (quedaba sin jugar para siempre) */
devDoctorRegistrar({id:"calendario_sin_saltos", area:"motor", n:"Ningún partido queda salteado en tu calendario", fn:function(){
  if(!E||!E.calendario) return _dok("sin partida");
  var salt=E.calendario.slice(0,Math.min(E.idx||0,E.calendario.length)).filter(function(p){ return p&&!p.jugado; });
  var falta=salt.map(function(p){ return (p.torneo||(p.tipo==="liga"?"liga":p.tipo))+(p.ronda?" "+p.ronda:"")+" vs "+(p.rivalNombre||p.rivalId)+" ("+(p.f?p.f.d+"/"+p.f.m:"")+")"; });
  /* prueba sin tocar tu partida: insertar una llave con el partido actual ya jugado */
  if(typeof _insertarYOrdenar==="function"){
    var E0=E, prueba={calendario:[{f:{m:3,d:1},jugado:true},{f:{m:3,d:8},jugado:false},{f:{m:3,d:15},jugado:false}], idx:0};
    try{
      E=prueba; _insertarYOrdenar([{f:{m:4,d:1},jugado:false}]); E.idx++;
      if(E.calendario[E.idx]!==prueba.calendario[1]) falta.push("insertar una llave durante un partido se saltea el siguiente (prueba: quedó en el "+(E.idx+1)+"° en vez del 2°)");
    }finally{ E=E0; }
  }
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("sin partidos salteados; insertar llaves no mueve el puntero de más");
}});
devDoctorRegistrar({id:"llave_global", area:"motor", n:"Las llaves se definen por el global (y la tanda también)", fn:function(){
  var falta=[];
  if(typeof _mGlobal!=="function") return _dmal("mundo.js sin cuadros");
  var g=_mGlobal({unica:false, legs:[{ga:2,gb:1},{ga:1,gb:0}]});
  if(g[0]!==2||g[1]!==2) falta.push("ida 2-1 y vuelta 1-0 (local el otro) debería dar 2-2 en el global y da "+g.join("-"));
  if(typeof marcadorDefine!=="function"||!marcadorDefine._uni) falta.push("la tanda no mira el global del cuadro (miraba solo el partido de vuelta)");
  if(typeof intentarDesempate==="function"&&String(intentarDesempate).indexOf("m[0]!==m[1]")>=0) falta.push("después del alargue se corta sin tanda si la vuelta no está empatada aunque el global sí");
  if(typeof pideProrroga==="function"&&pideProrroga({tipo:"copa",torneo:"Liguilla de Ascenso",ronda:"Cuartos"})) falta.push("los cuartos de la liguilla tienen alargue (las bases dicen penales directo)");
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("global bien sumado; tanda y alargue según las bases");
}});

/* 7.9042 · el motor goleaba de más (~4 goles, 16 % de empates, 12 % de goleadas por 4+) y el VAR
   frenaba TODOS los goles. Simula partidos de tu próxima fecha sin tocar tu partida. */
function devMedirGoles(n){
  n=n||120;
  if(!E||!E.calendario||typeof iniciarPartido!=="function"||typeof clonarPartida!=="function") return null;
  var molde=E.calendario.filter(function(p){ return p&&p.tipo==="liga"; });
  if(!molde.length) return null;
  var snap=clonarPartida(E), bulk=E._bulkSim, g=0, emp=0, g4=0;
  try{
    for(var i=0;i<n;i++){
      E._bulkSim=true;
      var pp=Object.assign({},molde[i%molde.length],{jugado:false});
      var P=iniciarPartido(pp,"simular"); correrHasta(P,90);
      var a=P.gl, b=P.gv; g+=a+b; if(a===b) emp++; if(Math.abs(a-b)>=4) g4++;
      restaurarPartida(snap);
    }
  } finally { restaurarPartida(snap); E._bulkSim=bulk; }
  return { n:n, goles:g/n, empates:emp/n, goleadas:g4/n };
}
/* 7.9042 · ¿las correcciones en vivo se notan? Del 60' al 90', goles a favor y en contra
   con cada tipo de consigna vs no tocar nada. */
function devMedirCorreccion(n){
  n=n||150;
  if(!E||!E.calendario||typeof aplicarMomento!=="function") return null;
  var molde=E.calendario.filter(function(p){ return p&&p.tipo==="liga"; });
  if(!molde.length) return null;
  var snap=clonarPartida(E), bulk=E._bulkSim;
  var casos={nada:{}, ataque:{ataque:5,riesgoPlan:3,desgaste:2}, cerrar:{orden:4,ataque:-3,riesgoPlan:-1}}, out={};
  try{
    Object.keys(casos).forEach(function(k){
      var gf=0, gc=0;
      for(var i=0;i<n;i++){
        E._bulkSim=true;
        var pp=Object.assign({},molde[i%molde.length],{jugado:false});
        var P=iniciarPartido(pp,"simular"); correrHasta(P,60);
        var m0=miMarcador(P); aplicarMomento(P,casos[k]); correrHasta(P,90);
        var m1=miMarcador(P); gf+=m1[0]-m0[0]; gc+=m1[1]-m0[1];
        restaurarPartida(snap);
      }
      out[k]={gf:gf/n, gc:gc/n};
    });
  } finally { restaurarPartida(snap); E._bulkSim=bulk; }
  return out;
}
devDoctorRegistrar({id:"correcciones_pesan", area:"motor", n:"Las decisiones en vivo se notan (y cada una dice qué hace)", fn:function(){
  var falta=[];
  if(typeof aplicarMomento!=="function"||typeof peligro!=="function"||typeof iniciarPartido!=="function") return _dmal("sin motor de partido");
  var molde=(E&&E.calendario||[]).filter(function(p){ return p&&p.tipo==="liga"; })[0];
  if(!molde) return _dok("sin partida para medir");
  var snap=clonarPartida(E), bulk=E._bulkSim, det="";
  try{
    E._bulkSim=true;
    var base=iniciarPartido(Object.assign({},molde,{jugado:false}),"simular");
    base.min=60; base.iner={cor:0,ataj:0,falta:0};
    var copia=function(){ var q=Object.assign({},base); q.iner={cor:0,ataj:0,falta:0}; return q; };
    var p0=peligro(copia());
    var todas=[].concat(TACTICAS_INICIO,TACTICAS_ABAJO,TACTICAS_ARRIBA,TACTICAS_EMPATE);
    todas.forEach(function(o){
      var q=copia(); aplicarMomento(q,o.ef); var p1=peligro(q), ef=o.ef||{};
      if((ef.ataque||0)>=4 && p1.yo<p0.yo*1.10) falta.push("«"+o.t+"» casi no suma llegadas ("+Math.round((p1.yo/p0.yo-1)*100)+" %)");
      if((ef.orden||0)>=3 && p1.el>p0.el*0.92) falta.push("«"+o.t+"» casi no cierra ("+Math.round((p1.el/p0.el-1)*100)+" % de llegadas del rival)");
    });
    if(typeof efectoLegible!=="function") falta.push("las alternativas no dicen qué hacen (sin efectoLegible)");
    if(typeof MOMENTO_OPCIONES==="undefined"||MOMENTO_OPCIONES<5) falta.push("hay 4 alternativas o menos por momento");
    /* las barras de apoyo hacen algo, y la barra se arenga UNA vez (+1 hinchada) */
    if(typeof efectoApoyo!=="function") falta.push("las barras de ánimo/confianza/criterio son adorno (sin efectoApoyo)");
    else {
      var qh=copia(); qh.apoyo={hinchada:90,plantel:90,criterio:50,momentos:0}; var ph=peligro(qh);
      if(!(ph.yo>p0.yo && ph.el<p0.el)) falta.push("hinchada y plantel altos no cambian el partido");
    }
    if(typeof arengarBarra!=="function") falta.push("sin botón de la barra");
    else {
      var h0=E.ind.hinchada, qb=copia(); qb.apoyo={hinchada:50,plantel:50,criterio:50,momentos:0}; qb.lineas=[];
      var r1=arengarBarra(qb), r2=arengarBarra(qb);
      if(!r1||r2) falta.push("la barra se puede arengar "+(r1?"más de una vez":"cero veces")+" por partido");
      if(E.ind.hinchada!==Math.min(100,h0+1)) falta.push("arengar a la barra no suma +1 de hinchada ("+h0+" → "+E.ind.hinchada+")");
    }
    var qa=copia(); aplicarMomento(qa,{ataque:5,riesgoPlan:3}); var pa=peligro(qa);
    var qc=copia(); aplicarMomento(qc,{orden:4,ataque:-3,riesgoPlan:-1}); var pc=peligro(qc);
    det="ir a buscarlo: llegadas propias "+(pa.yo/p0.yo*100-100).toFixed(0)+" %, del rival +"+(pa.el/p0.el*100-100).toFixed(0)+" % · cerrarse: rival "+(pc.el/p0.el*100-100).toFixed(0)+" %";
  } finally { restaurarPartida(snap); E._bulkSim=bulk; }
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat([det])):_dok(det);
}});
devDoctorRegistrar({id:"gol_se_ve", area:"interfaz", n:"El gol se ve (también en modo liviano) y el del rival no molesta", fn:function(){
  var falta=[];
  if(typeof document==="undefined"||!document.body) return _dok("sin pantalla");
  if(typeof golCelDuracion!=="function") return _dmal("sin golCelDuracion");
  var b=document.body, tenia=b.classList.contains("perf");
  var prueba=function(clase){ var d=document.createElement("div"); d.className=clase; d.style.visibility="hidden"; b.appendChild(d);
    var ms=parseFloat(getComputedStyle(d).animationDuration)*1000||0; d.remove(); return ms; };
  try{
    b.classList.add("perf");
    var cel=prueba("gol-cel"), toast=prueba("gol-toast");
    if(cel<800) falta.push("en modo liviano el festejo dura "+Math.round(cel)+" ms: el gol es un parpadeo invisible");
    if(toast<800) falta.push("en modo liviano el aviso de gol rival dura "+Math.round(toast)+" ms");
  } finally { b.classList.toggle("perf",tenia); }
  if(!tenia && golCelDuracion(true)<2500) falta.push("el gol propio dura menos de 2,5 s");
  if(golCelDuracion(false)>=golCelDuracion(true)) falta.push("el gol rival se festeja igual o más que el propio");
  if(String(celebrarGol).indexOf("gol-toast")<0) falta.push("el gol rival tapa la pantalla completa");
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("gol propio "+golCelDuracion(true)+" ms con reloj detenido · rival: zócalo de "+golCelDuracion(false)+" ms");
}});
devDoctorRegistrar({id:"canal_coherente", area:"contenido", n:"El canal de TV calza con la época y el torneo", fn:function(){
  var falta=[];
  if(typeof canalDelPartido!=="function"||!E) return _dok("sin partida");
  var a0=E.anio, eb=E.eraBase;
  try{
    E.eraBase="historico";
    [1991,1998,2008,2015].forEach(function(an){ E.anio=an;
      var c=canalDelPartido({tipo:"liga",local:true,rivalId:"x"});
      if(/TNT/.test(c.n)) falta.push(an+": dice "+c.n+" (TNT Sports llegó en 2019)");
      var cl=canalDelPartido({tipo:"copa",torneo:"Copa Libertadores",local:true,rivalId:"x"});
      if(/ESPN|TNT/.test(cl.n)&&an<2019) falta.push(an+": la Libertadores sale por "+cl.n);
    });
    E.anio=2026;
    var am=canalDelPartido({tipo:"amistoso",local:true,rivalId:"x"});
    if(/TNT|ESPN|CDF/.test(am.n)) falta.push("un amistoso sale por "+am.n);
    var lg=canalDelPartido({tipo:"liga",local:true,rivalId:"x"});
    if(!lg.d||lg.d.length<12) falta.push("el canal no dice qué torneo es");
  } finally { E.anio=a0; E.eraBase=eb; }
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("canal según la época (abierta → CDF → TNT) y amistosos sin TV");
}});
devDoctorRegistrar({id:"dominio_final", area:"motor", n:"Al final del partido hay gráfico de dominio y consejos para mejorar", fn:function(){
  var falta=[];
  if(typeof registrarDominio!=="function"||typeof consejosPartido!=="function") return _dmal("sin gráfico de dominio");
  var molde=(E&&E.calendario||[]).filter(function(p){ return p&&p.tipo==="liga"; })[0];
  if(!molde) return _dok("sin partida para medir");
  var snap=clonarPartida(E), bulk=E._bulkSim, det="";
  try{
    E._bulkSim=true;
    var P=iniciarPartido(Object.assign({},molde,{jugado:false}),"simular"); correrHasta(P,90);
    var n=(P.dom||[]).length;
    if(n<15) falta.push("el partido registró solo "+n+" tramos de dominio (se necesitan 15+)");
    var vs=(P.dom||[]).map(function(x){ return x.v; }), rango=vs.length?Math.max.apply(null,vs)-Math.min.apply(null,vs):0;
    if(n && rango<0.2) falta.push("la curva es plana (rango "+rango.toFixed(2)+"): no muestra los momentos del partido");
    var c=consejosPartido(P);
    if(!c.length||c.length>3) falta.push(c.length+" consejos (se esperan 1 a 3)");
    c.forEach(function(x){ if(!/^Para /.test(x.t)) falta.push("consejo que no dice qué mejorar: «"+x.t+"»"); });
    det=n+" tramos · rango "+rango.toFixed(2)+" · "+c.map(function(x){ return x.t; }).join(" / ");
  } finally { restaurarPartida(snap); E._bulkSim=bulk; }
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat([det])):_dok(det);
}});
devDoctorRegistrar({id:"llaves_en_vivo", area:"interfaz", n:"Las llaves ajenas de tu ronda se pueden ver en vivo", fn:function(){
  if(typeof llavesEnVivo!=="function"||typeof marcarLlavesParaVer!=="function") return _dmal("sin vista de llaves en vivo");
  var lb=E&&E.mundo&&E.mundo.ligB;
  var pend=(E&&E.calendario||[]).slice(E.idx||0).find(function(p){ return p&&!p.jugado; });
  if(!lb||!pend||pend.torneo!=="Liguilla de Ascenso") return _dok("sin liguilla en curso (nada que ver)");
  var ant={Semifinal:"Cuartos",FINAL:"Semifinal"}[pend.ronda];
  if(!ant||!lb.rondas[ant]) return _dok("tu primera ronda de liguilla");
  var ajenas=lb.rondas[ant].filter(function(t){ return !(t.a===E.club||t.b===E.club)&&t.gana; });
  if(!ajenas.length) return _dok("sin llaves ajenas resueltas");
  var L=E.llavesVer;
  if(!L||L.ronda!==ant||L.anio!==E.anio) return _dmal("los "+ant.toLowerCase()+" se jugaron y no hay cómo verlos",["solo llegó un aviso: falta marcarLlavesParaVer(\"ligB\",\""+ant+"\")"]);
  return _dok(ajenas.length+" llave(s) de "+ant+" para ver"+(L.vista?" (ya las viste)":""));
}});
devDoctorRegistrar({id:"cancha_cenital", area:"interfaz", n:"La cancha del partido: proporción real, liviana y con repetición del gol", fn:function(){
  var falta=[];
  if(typeof _cvSize!=="function"||typeof _cvDraw!=="function"||typeof _cvNuevoEstado!=="function") return _dmal("sin cancha cenital");
  if(typeof document==="undefined"||!document.body) return _dok("sin pantalla");
  var caja=document.createElement("div"); caja.style.cssText="position:absolute;left:-9999px;top:0;width:900px";
  var cv=document.createElement("canvas"); caja.appendChild(cv); document.body.appendChild(caja);
  try{
    var s=_cvSize(cv), ratio=cv._w/cv._h;
    if(Math.abs(ratio-105/68)>0.03) falta.push("la cancha no respeta 105×68 (proporción "+ratio.toFixed(2)+")");
    var st=_cvNuevoEstado(null), g=cv.getContext("2d"), t0=performance.now();
    for(var i=0;i<30;i++){ _cvStep(null,0.016,st); _cvDraw(g,s.w,s.h,st,null); }
    var ms=(performance.now()-t0)/30;
    if(ms>4) falta.push("cada cuadro cuesta "+ms.toFixed(1)+" ms (con 4+ ms se traba en celulares)");
    var st2=_cvNuevoEstado(null); _cvArmarGol(st2,1,"x",10); var dentro=false;
    for(var k=0;k<200&&st2.seq;k++){ _cvPasoGol(st2,0.03); if(st2.seq&&st2.ball.x>1.0) dentro=true; }
    if(!dentro) falta.push("la repetición del gol no termina con la pelota en la red");
    if(typeof cvRepeticionGol!=="function") falta.push("no se pueden volver a ver los goles en la repetición");
    var enc=0; st.jug.forEach(function(a,i){ st.jug.forEach(function(b,j){ if(j>i&&Math.hypot(a.x-b.x,a.y-b.y)<0.01) enc++; }); });
    if(enc) falta.push(enc+" pares de jugadores parados uno encima del otro");
    var det="proporción "+ratio.toFixed(2)+" · "+ms.toFixed(2)+" ms por cuadro";
  } finally { caja.remove(); }
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat([det])):_dok(det);
}});
devDoctorRegistrar({id:"calendario_decisiones", area:"motor", n:"Decisiones de días y horarios miran tu calendario (y la ANFP pesa)", fn:function(){
  var falta=[];
  if(typeof textoConDia!=="function"||typeof efectoCalendario!=="function"||typeof aplicarFixtureANFP!=="function") return _dmal("sin calendario-real.js");
  var loc=typeof proximoLocal==="function"?proximoLocal():null;
  if(!loc) return _dok("sin partido de local por delante");
  var snap=clonarPartida(E), det="";
  try{
    var dia=nombreDiaDe(loc);
    var t=resolverTokens("Domingo, entrada barata. El domingo es sagrado.",E);
    if(dia!=="domingo" && /omingo/.test(t)) falta.push("una decisión dice «domingo» y tu próximo partido de local es el "+dia);
    var sinPromo=taquilla(Object.assign({},loc,{promo:null}));
    efectoCalendario("Domingo, entrada barata");
    var p2=proximoLocal(), conPromo=taquilla(p2);
    if(!(p2&&p2.promo&&conPromo.gente>sinPromo.gente)) falta.push("«entrada barata» no cambia la entrada del partido real ("+sinPromo.gente+" → "+conPromo.gente+" personas)");
    restaurarPartida(snap);
    var toc=aplicarFixtureANFP("castigo");
    if(!toc.length) falta.push("votar contra los grandes no toca tu fixture");
    else if(!toc.some(function(p){ return p.promo&&p.promo.motivo; })) falta.push("el castigo de la ANFP no se explica en el partido");
    restaurarPartida(snap);
    var tv=(typeof BOLSA!=="undefined")&&BOLSA.find(function(x){ return x.id==="b_tv_horario"; });
    if(tv && tv.cuando(E) && !proximoLocalFinde()) falta.push("la TV pide mover un partido de fin de semana y el tuyo no es de fin de semana");
    var fx=(typeof BOLSA!=="undefined")&&BOLSA.find(function(x){ return x.id==="b_anfp_fixture"; });
    if(fx && fx.cuando(E) && !tramoApretado()) falta.push("aparece «el viaje imposible» sin tramo apretado en tu fixture");
    det="próximo de local: "+dia+" "+loc.f.d+"/"+loc.f.m+" ante "+loc.rivalNombre+(tramoApretado()?" · hay tramo apretado":"");
  } finally { restaurarPartida(snap); }
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat([det])):_dok(det);
}});
devDoctorRegistrar({id:"noticias_relevantes", area:"contenido", n:"Las noticias son de tu club o de rivales que te importan", fn:function(){
  var falta=[];
  if(typeof titularesSemana!=="function"||typeof idsRelevantes!=="function") return _dmal("sin filtro de noticias");
  if(!E||!E.calendario) return _dok("sin partida");
  var idx0=E.idx, vistos={}, malas={};
  try{
    for(var k=0;k<14;k++){ E.idx=(idx0||0)+k;
      (titularesSemana()||[]).forEach(function(n){ vistos[n.t]=1;
        var c=typeof NOTICIAS_COND!=="undefined"&&NOTICIAS_COND[n.t];
        if(c){ try{ if(!c()) malas[n.t]=1; }catch(e){ malas[n.t]=1; } }
        if(/tutorial|Calendario muestra|Hecho de tabla/i.test((n.t||"")+" "+(n.d||""))) malas[n.t]=1;
      });
    }
  } finally { E.idx=idx0; }
  Object.keys(malas).forEach(function(t){ falta.push("titular que no te corresponde o que es una nota de desarrollo: «"+t+"»"); });
  var rel=idsRelevantes();
  (typeof mundoNoticias==="function"?mundoNoticias():[]).forEach(function(n){
    if((n.idA||n.idB) && !(rel[n.idA]||rel[n.idB])) falta.push("noticia de clubes ajenos a tu liga: «"+n.t+"»");
    if(/^Copa Chile · Grupo /.test(n.t||"")) falta.push("noticia de un grupo de Copa Chile que no es el tuyo: «"+n.t+"»");
  });
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok(Object.keys(vistos).length+" titulares distintos en 14 semanas, todos pertinentes");
}});
devDoctorRegistrar({id:"institucion_limites", area:"motor", n:"Institución: topes reales (3 pactos por temporada, nada repetible sin fin)", fn:function(){
  var falta=[];
  if(typeof pactar!=="function"||typeof pactosVigentes!=="function") return _dmal("sin mesa de la barra");
  var snap=clonarPartida(E);
  var avisoOrig=window.aviso; window.aviso=function(){};
  try{
    normalizarBarra(); E.barra.pactos=[]; E.plata=Math.max(E.plata||0,500);
    ["aliento","logistica","no_vender","no_bajar","extra"].forEach(function(t,i){ pactar({tipo:t,quien:t==="no_vender"?"X"+i:null,resumen:t,costo:0}); });
    if(pactosVigentes()>3) falta.push("se pueden tener "+pactosVigentes()+" pactos en pie (el tope es 3)");
    if(E.barra.pactos.some(function(p){ return p.tipo==="no_bajar"; }) && E.barra.pactos.some(function(p){ return p.tipo==="no_vender"; })) falta.push("«no vender al ídolo» y «no rematar el plantel» cuentan como dos pactos (son la misma promesa)");
    E.anio=(E.anio||2026)+1; normalizarBarra();
    if(pactosVigentes()!==0) falta.push("los pactos del año pasado siguen contando ("+pactosVigentes()+")");
    restaurarPartida(snap);
    if(typeof hacerJugadaPoder==="function"&&typeof jugadaUsada!=="function") falta.push("las jugadas de poder se repiten sin límite");
    if(typeof cambiarEstatuto==="function"&&String(cambiarEstatuto).indexOf("est_")<0) falta.push("los estatutos se pueden cambiar ida y vuelta sin límite");
    if(typeof aplicarInteraccion==="function"){
      var nOrig=window.notificar; window.notificar=function(){};
      try{ E.flags=E.flags||{}; delete E.flags.soploIdx; E.capital=Math.max(E.capital||0,50);
        var r1=aplicarInteraccion({t:"x",soplo:true}), r2=aplicarInteraccion({t:"x",soplo:true});
        if(r1.ok&&r2.ok) falta.push("el soplo anónimo se compra dos veces en la misma fecha");
      } finally { window.notificar=nOrig; }
    }
  } finally { window.aviso=avisoOrig; restaurarPartida(snap); }
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("3 pactos por temporada · jugadas y estatutos una vez por temporada · soplo cada 4 fechas");
}});
devDoctorRegistrar({id:"finanzas_realistas", area:"motor", n:"Finanzas con montos reales (CM con sueldo) y una bolsa que se mueve", fn:function(){
  var falta=[];
  if(typeof sueldoCMAnual!=="function") falta.push("el CM no tiene sueldo: se paga una vez y nunca más");
  else {
    var snap=clonarPartida(E);
    try{
      E.staff=E.staff||{}; E.staff.cm=false; var c0=costoSemanal();
      E.staff.cm=true; var c1=costoSemanal();
      if(!(c1>c0)) falta.push("con CM contratado el costo semanal no sube ("+c0+" → "+c1+")");
      if(sueldoCMAnual()>60) falta.push("el CM cuesta "+plata(sueldoCMAnual())+" al año (un CM real ronda 15 M)");
      if(typeof CM_CONTRATO!=="undefined"&&CM_CONTRATO>10) falta.push("contratar al CM cuesta "+plata(CM_CONTRATO));
    } finally { restaurarPartida(snap); }
  }
  if(typeof actualizarBolsa==="function"&&typeof invertirBolsa==="function"){
    var snap2=clonarPartida(E);
    try{
      normalizarBolsa(); var h0=E.bolsa.historia.length; actualizarBolsa();
      if(E.bolsa.historia.length<=h0 && h0<40) falta.push("la acción no registra la semana");
      var p0=E.bolsa.precio; golpeBolsa(1); if(E.bolsa.precio===p0) falta.push("ganar un partido no mueve la acción");
      E.personal.bolsillo=100; invertirBolsa(50); var rec=liquidarBolsa(1);
      if(Math.abs(rec-50)>2) falta.push("comprar y vender al mismo precio no devuelve lo invertido ("+rec+" de 50)");
    } finally { restaurarPartida(snap2); }
  }
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("CM "+plata(typeof CM_SUELDO_MES!=="undefined"?CM_SUELDO_MES:0)+"/mes en el flujo · bolsa semanal y por partido");
}});
devDoctorRegistrar({id:"plantel_vivo", area:"motor", n:"Plantel: charlas con memoria, renovar funciona, once sin lesionados, química por continuidad", fn:function(){
  var falta=[];
  if(typeof charlaJugador!=="function"||typeof renovarContrato!=="function") return _dmal("sin acciones de plantel");
  var snap=clonarPartida(E), av=window.aviso, pn=window.pushNotif; window.aviso=function(){}; window.pushNotif=function(){};
  try{
    var j=(E.plantel||[]).filter(function(x){ return !x.vendido&&!x.cedido; })[0];
    if(j){
      j._charlaIdx=null; var r1=charlaJugador(j,"banco"), r2=charlaJugador(j,"banco");
      if(!r1) falta.push("«Hablar y apoyar» no hace nada");
      if(r2) falta.push("se puede hablar con el mismo jugador sin límite (la moral sube con cada clic)");
      if(!(j.charlas&&j.charlas.length)) falta.push("el cuerpo técnico no recuerda las charlas");
      E.plata=500; j.contrato=j.contrato||{}; j.contrato.hasta=E.anio; var ok=false;
      try{ ok=renovarContrato(j); }catch(e){ falta.push("«Renovar» se rompe: "+e.message); }
      if(!ok) falta.push("no se puede renovar a un jugador al que le termina el contrato");
      else if(renovarContrato(j)) falta.push("se puede renovar dos veces seguidas (+4 años)");
    }
    if(typeof charlaGrupal==="function"){ E.flags=E.flags||{}; var g1=charlaGrupal("banco"), g2=charlaGrupal("banco"); if(!g1||g2) falta.push("la charla al grupo no funciona una vez por semana"); }
    else falta.push("no hay «hablar con todos»");
    var les=(E.plantel||[]).filter(function(x){ return !x.vendido; })[1]; if(les){ les.lesion=3; E.tactica.xiManual=null;
      if(onceIdeal().indexOf(les)>=0) falta.push("el once automático pone a un lesionado"); }
    if(typeof registrarJuntos==="function"){ var o=onceIdeal(), a=o[0], b=o[1]; if(a&&b){ var q0=quimicaPar(a,b); for(var i=0;i<10;i++) registrarJuntos(o); if(!(quimicaPar(a,b)>q0)) falta.push("jugar juntos no sube la química del par"); } }
    else falta.push("la química no depende de jugar juntos");
  } finally { window.aviso=av; window.pushNotif=pn; restaurarPartida(snap); }
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("charla 1/semana con memoria · renovar ok · grupo · once sin lesionados · química por continuidad");
}});
devDoctorRegistrar({id:"mercado_busqueda", area:"motor", n:"Mercado: se busca en TODOS los clubes y el ayudante recomienda con porqué", fn:function(){
  var falta=[];
  if(typeof poolMercadoReal!=="function"||typeof _normBusq!=="function") return _dmal("sin búsqueda de mercado");
  var pool=poolMercadoReal(), clubes={}; pool.forEach(function(j){ clubes[j.clubId]=1; });
  var nClub=Object.keys(clubes).length;
  if(nClub<20) falta.push("la búsqueda solo cubre "+nClub+" clubes");
  if(E.club!=="CC"){ var q=_normBusq("colo colo"), cc=pool.filter(function(j){ return _normBusq(j.club).indexOf(q)>=0; }).length;
    if(!cc) falta.push("buscar «colo colo» no encuentra a nadie de Colo-Colo"); }
  if(typeof recomendadosMercado==="function"){
    var rec=recomendadosMercado();
    if(rec.some(function(j){ return !j._porque; })) falta.push("hay recomendados sin porqué");
  } else falta.push("no hay recomendados del ayudante");
  var det=pool.length+" jugadores de "+nClub+" clubes";
  if(typeof bajaDeDivision==="function"&&miDivision()>1){
    var arriba=pool.filter(function(j){ return bajaDeDivision(j); })[0];
    if(arriba){ var of={sueldo:arriba.pidesueldo,rol:"titular"}; var conBaja=interesJugador(arriba,of);
      var copia=Object.assign({},arriba,{clubId:E.club}); var sinBaja=interesJugador(copia,of);
      if(!(conBaja<sinBaja)) falta.push("a un jugador de Primera le da lo mismo bajar de categoría"); det+=" · bajar pesa "+(conBaja-sinBaja); }
  }
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat([det])):_dok(det);
}});
devDoctorRegistrar({id:"estadio_dibujado", area:"interfaz", n:"Estadio dibujado que sube obra por obra; butacas que calzan con el aforo real", fn:function(){
  var falta=[];
  if(typeof etapaEstadio!=="function"||typeof svgEstadio!=="function") return _dmal("sin estadio dibujado");
  var snap=clonarPartida(E), det="";
  try{
    E.obrasHechas=[]; E.ind.estadio=50; var e0=etapaEstadio();
    E.obras={tipo:"remodelacion",semanas:1,resta:1}; var nOrig=window.notificar; window.notificar=function(){};
    try{ avanzarObras(); } finally { window.notificar=nOrig; }
    var e1=etapaEstadio();
    if(!(e1>e0)) falta.push("terminar una obra no sube el estadio dibujado (etapa "+e0+" → "+e1+")");
    var a=svgEstadio({etapa:2,ocup:0.5,completo:false}), c=svgEstadio({etapa:5,ocup:0.9,completo:true});
    if(c.length<a.length*1.2) falta.push("el estadio completo casi no se distingue del intermedio");
    if(typeof taquillaPorSector==="function"){ var sec=taquillaPorSector(null), tot=0; sec.forEach(function(x){ tot+=x.cap; });
      if(tot>aforoActual()) falta.push("se venden "+tot+" butacas en un estadio de "+aforoActual());
      det="etapa "+e0+"→"+e1+" con una obra · butacas "+tot+" de "+aforoActual(); }
  } finally { restaurarPartida(snap); }
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat([det])):_dok(det);
}});
devDoctorRegistrar({id:"plop_vivo", area:"interfaz", n:"PLOP!: sin repetidos, likes con la cuenta correcta, respuestas a lo que escribiste, análisis en vivo", fn:function(){
  var falta=[];
  if(typeof textoSinSentido!=="function") falta.push("responder «cf» trae respuestas de comunicado");
  else { if(!textoSinSentido("cf")) falta.push("«cf» no se reconoce como texto sin sentido"); if(textoSinSentido("vamos con todo el domingo")) falta.push("una frase normal se toma como sin sentido"); }
  if(typeof postProc==="function"&&E){
    var tl=(E.timeline||[]).slice(), n0=(E.timeline||[]).length;
    postProc("@doc1","hincha","texto de prueba del doctor","neutro"); postProc("@doc2","hincha","texto de prueba del doctor","neutro");
    if((E.timeline||[]).length-n0>1) falta.push("el feed publica dos veces el mismo texto ajeno");
    E.timeline=tl;
  }
  if(typeof cuentaPlop!=="function") falta.push("los likes y respuestas se firman siempre como el DT");
  else { var pe=REDES_PEST; try{ REDES_PEST="club"; if(cuentaPlop()===handleDT()&&handleClub()!==handleDT()) falta.push("desde la cuenta oficial se firma como el DT"); } finally { REDES_PEST=pe; } }
  if(typeof tickerAnalisis==="function"){ var P={min:31,ticker:[],stats:{pos:0.5},dom:[],part:{},gl:0,gv:0}; tickerAnalisis(P);
    if(!P.ticker.some(function(x){ return /📊/.test(x.texto); })) falta.push("el análisis en vivo no sale a los 30'"); }
  else falta.push("Plop en vivo sin análisis");
  if(typeof logoPlop!=="function") falta.push("PLOP! no se abre como ventana de navegador");
  if(typeof plopPistas==="function"){ var Q={min:40,ticker:[],part:{},gl:0,gv:0}; var pi=plopPistas(Q,"ataque");
    if(pi.length!==3||pi.some(function(x){ return Q.ticker.indexOf(x)<0; })) falta.push("las pistas de las decisiones no son mensajes del chat en vivo");
    else if(pi.filter(function(x){ return x.dir==="ataque"; }).length<2) falta.push("las pistas no marcan lo que pide la mayoría"); }
  else falta.push("las decisiones muestran pistas aparte del chat (texto obvio)");
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("sin repetidos · cuenta correcta · «cf» confunde · análisis 30/60/80 · ventana plop.com");
}});
devDoctorRegistrar({id:"economia_real", area:"motor", n:"Mercado a escala chilena real: precios por nivel y edad, compradores que pueden pagar, libres y préstamos", fn:function(){
  var falta=[];
  if(typeof valorMercado!=="function") return _dmal("sin economía real (economia-real.js)");
  var infl=(typeof inflacionEra==="function")?inflacionEra():1, k=infl/1.4;
  var v62=valorMercado({nivel:62,edad:25,proy:62,contrato:{hasta:(E.anio||2026)+2}}), v80=valorMercado({nivel:80,edad:25,proy:80,contrato:{hasta:(E.anio||2026)+2}});
  if(v62<25*k||v62>60*k) falta.push("un nivel 62 vale "+plata(v62)+" (esperado ~40 M de 2026)");
  if(v80<400*k||v80>1000*k) falta.push("un nivel 80 vale "+plata(v80)+" (esperado ~650 M de 2026)");
  if(v80<v62*8) falta.push("la figura (80) vale apenas "+(v80/v62).toFixed(1)+"× un suplente (62): los precios son casi lineales");
  var pool=(typeof poolMercadoReal==="function")?poolMercadoReal():[];
  var raros=pool.filter(function(j){ return j.valor>0 && (j.precio/j.valor>1.25||j.precio/j.valor<0.8); }).length;
  if(raros>pool.length*0.05) falta.push(raros+" precios de compra no calzan con el valor (¿inflación contada dos veces?)");
  if(typeof compradorPara==="function"){ var cmp=compradorPara({nivel:85,edad:26},Math.random,1400*k);
    if(cmp.id && divisionDe(cmp.id)>1) falta.push("un club de "+(divisionDe(cmp.id)===2?"la B":"Segunda")+" compra una figura de "+plata(1400*k)); }
  var lib=(typeof jugadoresLibres==="function")?jugadoresLibres():[];
  if(lib.length<10) falta.push("hay "+lib.length+" jugadores libres");
  if(lib.some(function(j){ return j.precio>0; })) falta.push("un libre pide pase");
  if(typeof pedirPrestamo==="function"&&typeof devolverPrestamos==="function"){
    var snap=clonarPartida(E), pf=window.puedeFirmar, gu=window.guardar, nt=window.notificar;
    window.puedeFirmar=function(){ return true; }; window.guardar=function(){}; window.notificar=function(){};
    try{ E.plata=Math.max(E.plata||0,500); var cand=prestables()[0];
      if(cand){ var r=pedirPrestamo(cand); if(!r.ok) falta.push("pedir a préstamo falla: "+r.msg);
        else { E.anio=(E.anio||2026); devolverPrestamos(); var vuelve=(E.cpu.sq[cand.clubId]||[]).some(function(x){ return x.n===cand.n; });
          if(!vuelve) falta.push("el prestado no vuelve a su club al cierre"); } }
    } finally { window.puedeFirmar=pf; window.guardar=gu; window.notificar=nt; restaurarPartida(snap); }
  }
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("niv 62 "+plata(v62)+" · niv 80 "+plata(v80)+" · "+lib.length+" libres · préstamos ida y vuelta");
}});
devDoctorRegistrar({id:"calendario_sofa", area:"interfaz", n:"Calendario tipo SofaScore: buscar, fichas de equipo, tablas con forma, copas", fn:function(){
  var falta=[];
  if(typeof vistaCalendarioSofa!=="function") return _dmal("sin Calendario nuevo");
  if(!(typeof mundoEra2026==="function"&&mundoEra2026()&&E&&E.mundo)) return _dok("época sin universo: usa la vista clásica");
  var idx=_csIndiceEquipos(), ligas=_csLigas(), nLig=0; ligas.forEach(function(l){ nLig+=(E.mundo.ligas[l.k].ids||[]).length; });
  if(idx.length<nLig*0.95) falta.push("el buscador encuentra "+idx.length+" de "+nLig+" equipos");
  var riv=ligas.length?(E.mundo.ligas[ligas[0].k].ids||[]).filter(function(id){ return id!==E.club; })[0]:null;
  if(riv){
    var ps=_csPartidosEquipo(riv), L=E.mundo.ligas[ligas[0].k];
    if(!ps.length) falta.push("la ficha de "+riv+" no tiene fixture");
    var jugados=ps.filter(function(p){ return p.jugado; }).length, tab=(mundoFilasLiga(ligas[0].k).filter(function(f){ return f.id===riv; })[0]||{}).pj||0;
    if(jugados!==tab) falta.push("la ficha de "+_csNom(riv)+" dice "+jugados+" jugados y la tabla "+tab);
    if(typeof cpuPlantel==="function"&&!cpuPlantel(riv).length) falta.push("la ficha de "+_csNom(riv)+" no muestra plantel");
  }
  var det=idx.length+" equipos buscables · "+ligas.length+" ligas · "+_csCopasDisponibles().length+" copas";
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat([det])):_dok(det);
}});
devDoctorRegistrar({id:"conmebol_ko", area:"motor", n:"Libertadores y Sudamericana: fase final simulada y con llaves", fn:function(){
  var falta=[], det=[];
  if(typeof conmebolKO!=="function") return _dmal("sin fase final CONMEBOL");
  if(!E||!E.mundo||!E.mundo.copas) return _dok("sin partida");
  ["lib","sud"].forEach(function(t){
    var pack=E.mundo.copas[t]; if(!pack||!pack.grupos||!Object.keys(pack.grupos).length) return;
    var ko=conmebolKO(t);
    if((pack.ronda||0)>=6 && !ko){ falta.push(t+": terminaron los grupos y no hay cuadro"); return; }
    if(!ko){ det.push(t+": grupos en curso"); return; }
    var r0=ko.rondas[ko.orden[0]]||[];
    if(r0.some(function(x){ return !x.a||!x.b; })) falta.push(t+": hay llaves con un equipo vacío");
    var hoy=mundoFechaHoy();
    r0.forEach(function(x){ x.fechas.forEach(function(f,i){ if(!x.mia && _mfn(f)<=_mfn(hoy) && !(x.legs&&x.legs[i])) falta.push(t+": un partido del "+f.d+"/"+f.m+" ya debió jugarse"); }); });
    var ko2=conmebolKO(t);
    if(JSON.stringify(ko2.rondas[ko.orden[0]].map(function(x){ return x.gana; }))!==JSON.stringify(r0.map(function(x){ return x.gana; }))) falta.push(t+": el cuadro cambia cada vez que se mira");
    det.push(t+": "+ko.orden[0]+(ko.campeon?" · campeón "+_cnNom(t,ko.campeon):""));
  });
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok(det.join(" · ")||"sin copas CONMEBOL");
}});
devDoctorRegistrar({id:"motor_goles", area:"motor", n:"Marcadores creíbles y VAR solo en jugadas dudosas", fn:function(){
  var falta=[];
  if(typeof VAR_REVISION==="undefined"||!(VAR_REVISION.gol<=0.3)) falta.push("el VAR revisa todos (o casi todos) los goles: no dejan gritar");
  if(typeof MOTOR_GOL==="undefined") falta.push("sin perillas MOTOR_GOL en partido.js");
  else if(MOTOR_GOL.corner.max>0.15) falta.push("los córners terminan en gol hasta "+Math.round(MOTOR_GOL.corner.max*100)+" % (real ≈ 3–5 %)");
  var m=devMedirGoles(200);   /* 200: con 120 el ruido cruzaba los topes (medido: goleadas 1,7–8,3 %) */
  if(m){
    if(m.goles>3.4||m.goles<2.0) falta.push("promedio de "+m.goles.toFixed(2)+" goles por partido (esperado 2,0–3,4; la liga real ronda 2,6)");
    if(m.empates<0.12) falta.push("solo "+Math.round(m.empates*100)+" % de empates (real 25–28 %)");
    if(m.goleadas>0.10) falta.push(Math.round(m.goleadas*100)+" % de partidos con 4+ goles de diferencia (real ≈ 3 %)");
  }
  var det=m?(m.goles.toFixed(2)+" goles/partido · "+Math.round(m.empates*100)+" % empates · "+(m.goleadas*100).toFixed(1)+" % goleadas (4+)"):"sin partida para medir";
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat([det])):_dok(det);
}});

/* 7.9037 · rendimiento: la escena del penal crecía sola en PC y el fondo animado obligaba a
   re-desenfocar todos los paneles de vidrio en cada cuadro */
devDoctorRegistrar({id:"rendimiento_ui", area:"interfaz", n:"La escena del penal no crece sola y el fondo no gasta de más", fn:function(){
  if(typeof document==="undefined"||!document.body) return _dok("sin DOM");
  var falta=[];
  if(typeof _arcoVista==="function"){
    /* el bug: cada recálculo subía una décima y el escenario seguía al dibujo. Un escenario que
       mide un pelo más que el dibujo NO puede mover el viewBox (si no, crece sin fin). */
    var NS="http://www.w3.org/2000/svg", box=document.createElement("div"), svg=document.createElementNS(NS,"svg");
    box.style.cssText="position:absolute;left:-9999px;top:0;width:632px;height:425px;visibility:hidden";
    svg.setAttribute("viewBox","0 -1 360 241"); box.appendChild(svg); document.body.appendChild(box);
    try{
      _arcoVista(svg); var v1=svg.getAttribute("viewBox");
      if(v1!=="0 -1 360 241") falta.push("la escena del penal se re-escala por un pelo ("+v1+"): en PC crece sola");
    } finally { box.remove(); }
    var st=document.createElement("div"); st.className="modal escena-3d"; st.innerHTML='<div class="e3d-stage"></div>';
    st.style.cssText="position:absolute;left:-9999px;visibility:hidden"; document.body.appendChild(st);
    var ar=getComputedStyle(st.firstChild).aspectRatio; st.remove();
    if(!ar||ar==="auto") falta.push("el escenario del penal toma el alto del dibujo (sin aspect-ratio)");
  }
  var cj=document.body.classList.contains("con-juego"), au=document.querySelector("#fondo .aurora");
  if(au){
    if(!cj) document.body.classList.add("con-juego");
    var ps=getComputedStyle(au).animationPlayState;
    if(!cj) document.body.classList.remove("con-juego");
    if(ps!=="paused") falta.push("el fondo aurora se sigue moviendo dentro del juego (re-desenfoca el vidrio en cada cuadro)");
  }
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("escena estable; fondo quieto dentro del juego");
}});

/* 7.9038 · "apretar cualquier cosa me manda arriba" y "se pierde el relato del partido" */
devDoctorRegistrar({id:"scroll_estable", area:"interfaz", n:"Apretar un botón no te manda arriba (ni en el partido)", fn:function(){
  var falta=[];
  if(typeof _renderCuerpo!=="function") falta.push("repintar una sección vacía la página y el scroll vuelve arriba");
  if(typeof pintarPartido!=="function"||String(pintarPartido).indexOf("ancla")<0) falta.push("los botones del partido (pausa, velocidad, cancha) sacan el relato de la vista");
  if(typeof irA!=="function"||String(irA).indexOf("cambia")<0) falta.push("volver a apretar la misma sección te manda arriba");
  if(!falta.length && E && document.body && !document.body.classList.contains("con-modal") && !document.body.classList.contains("en-partido")){
    var y0=window.scrollY, alto=document.documentElement.scrollHeight-innerHeight;
    if(alto<=200){ var vv=document.getElementById("vista"); if(vv){ vv.style.minHeight=(innerHeight+800)+"px"; alto=document.documentElement.scrollHeight-innerHeight; } }
    if(alto>200){
      window.scrollTo(0,Math.min(300,alto)); var y1=window.scrollY; render();
      if(Math.abs(window.scrollY-y1)>2) falta.push("probado en vivo: render() movió el scroll de "+y1+" a "+window.scrollY);
      window.scrollTo(0,y0);
    }
    var vx=document.getElementById("vista"); if(vx) vx.style.minHeight="";
  }
  return falta.length?_dmal(falta.length+" problema(s)",falta):_dok("el scroll se queda donde estabas");
}});

/* 7.9039 · pantallas sin duplicados: el autor contó 3 botones de Avisos, 2 de Jugar, un "Ir al
   Estadio" suelto en Finanzas, una pizarra en Plantel y metas repetidas en el Escritorio */
devDoctorRegistrar({id:"ui_sin_duplicados", area:"interfaz", n:"Cada cosa tiene un solo botón (sin duplicados)", fn:function(){
  var falta=[];
  if(typeof SECCIONES!=="undefined"&&SECCIONES.some(function(s){ return s[0]==="avisos"; })) falta.push("Avisos está en el menú además de la 🔔 de arriba");
  var cam=document.getElementById("campanaAvisos");
  if(cam&&getComputedStyle(cam).display!=="none") falta.push("hay una campana flotante además de la de la barra");
  var srcE=String(typeof vistaEscritorio==="function"?vistaEscritorio:"");
  if(/"Ir al partido"/.test(srcE)) falta.push("el Escritorio repite el botón Jugar (\"Ir al partido\")");
  if(/Lo que se espera de ti/.test(srcE)) falta.push("las metas se repiten en el Escritorio");
  if(/Entradas y estadio/.test(String(typeof vistaFinanzas==="function"?vistaFinanzas:""))) falta.push("Finanzas repite un botón a Estadio");
  if(/pla_ir_pizarra/.test(String(typeof vistaPlantel==="function"?vistaPlantel:""))) falta.push("Plantel repite el botón de la previa");
  if(typeof modalCharlaCapitan==="function"&&String(modalCharlaCapitan).indexOf("_claveCharla")<0) falta.push("la charla con el capitán se puede repetir sin límite");
  return falta.length?_dmal(falta.length+" duplicado(s)",falta):_dok("un botón por cosa; charla con el capitán, una por semana");
}});

/* 7.9040 · el ayudante HACE: cada problema que muestra tiene que resolverse con su botón */
devDoctorRegistrar({id:"ayudante_hace", area:"motor", n:"Lo que el ayudante ofrece hacer, lo hace de verdad", fn:function(){
  if(!E||typeof ayudanteAcciones!=="function") return _dmal("ayudante.js no está cargado");
  var acc=ayudanteAcciones(), falta=[], snap=clonarPartida(E);
  try{
    acc.forEach(function(a){
      var antes=JSON.stringify(E), txt=ayudanteHacer(a.id);
      if(!txt) falta.push("«"+a.t+"»: no hizo nada");
      else if(JSON.stringify(E)===antes) falta.push("«"+a.t+"»: dice que lo hizo pero no cambió nada");
    });
  } finally { restaurarPartida(snap); }
  if(acc.some(function(a){ return !a.porque; })) falta.push("hay acciones sin explicar por qué");
  return falta.length?_dmal(falta.length+" acción(es) de mentira",falta):_dok(acc.length?(acc.length+" acción(es) disponibles, todas hacen algo y explican por qué"):"nada que arreglar ahora");
}});

/* 7.9032 · legibilidad: el vidrio Aero no puede tapar el texto */
function _docLum(rgb){
  var m=String(rgb).match(/[\d.]+/g); if(!m) return 1;
  var c=m.slice(0,3).map(function(v){ v=+v/255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4); });
  return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];
}
function _docContraste(a,b){ var x=_docLum(a), y=_docLum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); }
devDoctorRegistrar({id:"legibilidad_ui", area:"interfaz", n:"Los botones y menús se leen (el brillo no tapa el texto)", fn:function(){
  if(typeof document==="undefined"||!document.body) return _dok("sin DOM");
  var falta=[], det=[];
  if(document.body.dataset.tema==="aero"){
    ["", "verde", "rojo"].forEach(function(v){
      var b=document.createElement("button"); b.className="btn-aqua"+(v?" "+v:""); b.textContent="x";
      b.style.cssText="position:absolute;left:-9999px"; document.body.appendChild(b);
      var cs=getComputedStyle(b), bg=cs.backgroundImage||"", m=bg.match(/rgba\(255,\s*255,\s*255,\s*([\d.]+)\)/);
      var blanco=m?+m[1]:0, txt=cs.color;
      if(_docLum(txt)>0.8 && blanco>0.55) falta.push("botón "+(v||"azul")+": texto blanco sobre brillo blanco al "+Math.round(blanco*100)+"%");
      det.push("botón "+(v||"azul")+": brillo "+Math.round(blanco*100)+"%");
      b.remove();
    });
  } else det.push("tema "+document.body.dataset.tema+": brillo de botones no aplica");
  var act=document.querySelector('#menu .mi[aria-selected="true"], #menu .mi[aria-current="page"]');
  if(act && document.body.classList.contains("nav-lateral")){
    var k=_docContraste(getComputedStyle(act).color,"rgb(214,236,255)");
    det.push("canal activo: contraste "+(Math.round(k*10)/10));
    if(k<4.5) falta.push("el canal activo de la barra lateral no se lee (contraste "+(Math.round(k*10)/10)+", mínimo 4,5)");
  }
  var op=document.createElement("div"); op.className="op"; op.innerHTML='<div class="req">x</div>'; op.style.cssText="position:absolute;left:-9999px";
  document.body.appendChild(op);
  if(/mono|console|consolas/i.test(getComputedStyle(op.firstChild).fontFamily)) falta.push("las descripciones de las opciones van en monoespaciada");
  op.remove();
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat(det)):_dok("se lee: "+det.join(" · "),det);
}});

/* 7.9033 · lo que da vida no se puede apagar sin que el doctor lo note */
devDoctorRegistrar({id:"vida_visible", area:"interfaz", n:"El juego tiene vida: retrato que envejece, plata que se siente, historia en orden", fn:function(){
  var falta=[], det=[];
  if(typeof retratoSVG!=="function"||typeof estadoRetrato!=="function") falta.push("falta el retrato del DT (retrato.js)");
  else if(E&&E.perfil){
    var b0=E.perfil.bienestar, sg0=E.temporada&&E.temporada.sinGanar;
    E.perfil.bienestar=90; if(E.temporada) E.temporada.sinGanar=0; var bien=estadoRetrato(), svgBien=retratoSVG();
    E.perfil.bienestar=15; if(E.temporada) E.temporada.sinGanar=4; var mal=estadoRetrato(), svgMal=retratoSVG();
    E.perfil.bienestar=b0; if(E.temporada) E.temporada.sinGanar=sg0;
    det.push("estrés tranquilo "+bien.estres+" → al límite "+mal.estres);
    if(mal.estres-bien.estres<40) falta.push("el retrato casi no cambia con el estrés ("+bien.estres+"→"+mal.estres+")");
    if(svgBien===svgMal) falta.push("el dibujo es idéntico con o sin estrés");
    if(typeof AVATARES!=="undefined"&&AVATARES.indexOf("retrato")<0) falta.push("el retrato no está entre los avatares");
    if(E.perfil.avatar&&E.perfil.avatar!=="retrato"&&E.perfil.avatar!=="😎"&&String(E.perfil.avatar).indexOf("orb-")!==0) falta.push("avatar desconocido: "+E.perfil.avatar);
  }
  if(typeof pintarBarra!=="function"||!pintarBarra._vida) falta.push("la barra no anima los cambios de plata (vida-ui.js)");
  if(typeof _lineaHistoriaPropia==="function"&&E){
    var L=_lineaHistoriaPropia(typeof _idHistoriaClub==="function"?_idHistoriaClub():E.club);
    for(var i=1;i<L.length;i++) if((L[i].anio||0)<(L[i-1].anio||0)){ falta.push("la línea de historia sale desordenada ("+L[i-1].anio+" antes que "+L[i].anio+")"); break; }
    det.push(L.length+" hitos en la historia");
  }
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat(det)):_dok(det.join(" · "),det);
}});

/* 7.9033b · lo que en celu se veía como "bug de mierda" */
devDoctorRegistrar({id:"celu_prolijo", area:"interfaz", n:"En celu: ventanas a su medida, sin pestañas de PC en el partido, textos que suenan bien", fn:function(){
  var falta=[], det=[];
  if(typeof resolverTokens==="function"&&E){
    var t=resolverTokens("El médico no quiere infiltrar al {IDOLO} y se lo dice del {CAPITAN}.",E);
    if(/\b(al|del) [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ [A-ZÁÉÍÓÚÑ]/.test(t)) falta.push("artículo delante de nombre completo: «"+t+"»");
    det.push("tokens: «"+t.slice(0,60)+"…»");
  }
  var celu=typeof window!=="undefined"&&window.matchMedia&&window.matchMedia("(max-width:720px)").matches;
  if(!celu){ det.push("pantalla ancha: las reglas de celu no aplican acá"); }
  else if(typeof modal==="function"&&typeof cerrarModal==="function"&&!document.querySelector("#capa-modal .modal")){
    modal(function(box){ box.appendChild(el("div","cab","<span>prueba</span>")); var c=el("div","cuerpo"); c.appendChild(el("p",null,"corto")); box.appendChild(c); });
    var m=document.querySelector("#capa-modal .modal"), h=m?m.getBoundingClientRect().height:0, vh=window.innerHeight;
    cerrarModal();
    det.push("ventana corta: "+Math.round(h)+"px de "+vh);
    if(h>vh*0.6) falta.push("una ventana de 2 líneas ocupa "+Math.round(h/vh*100)+"% de la pantalla (queda un hueco vacío)");
    var ep=document.body.classList.contains("en-partido"); document.body.classList.add("en-partido");
    var menu=document.getElementById("menu"), vis=menu&&getComputedStyle(menu).display!=="none";
    if(!ep) document.body.classList.remove("en-partido");
    if(vis) falta.push("en el partido aparecen las pestañas de PC arriba");
  }
  return falta.length?_dmal(falta.length+" problema(s)",falta.concat(det)):_dok(det.join(" · "),det);
}});

/* ============ MOTOR DEL DOCTOR ============ */
function devDoctor(opts){
  opts=opts||{};
  var res={ok:0, mal:0, checks:[], t0:Date.now()};
  DOCTOR_CHECKS.forEach(function(c){
    if(opts.soloRapidos && c.pesado) return;
    if(opts.area && c.area!==opts.area) return;
    var r;
    try{ r=c.fn()||_dok(""); }
    catch(e){ r=_dmal("EXCEPCIÓN: "+e.message); }
    r.id=c.id; r.area=c.area; r.n=c.n;
    res.checks.push(r);
    if(r.ok) res.ok++; else res.mal++;
  });
  res.ms=Date.now()-res.t0;
  res.total=res.ok+res.mal;
  res.veredicto=res.mal===0?"sano":(res.mal<=2?"con detalles":"roto");
  return res;
}
/* texto plano, para pegar en el chat de trabajo o en un issue */
function devDoctorTexto(res){
  res=res||devDoctor();
  var l=["FUTBOLINI · DOCTOR — "+res.veredicto.toUpperCase()+" ("+res.ok+"/"+res.total+" en "+res.ms+" ms)"];
  var areas={};
  res.checks.forEach(function(c){ (areas[c.area]=areas[c.area]||[]).push(c); });
  Object.keys(areas).forEach(function(a){
    l.push("");
    l.push("["+a.toUpperCase()+"]");
    areas[a].forEach(function(c){
      l.push((c.ok?"  OK  ":"  MAL ")+c.n+" — "+c.txt);
      if(!c.ok) (c.detalle||[]).slice(0,10).forEach(function(d){ l.push("        · "+d); });
    });
  });
  return l.join("\n");
}

/* ============ CARA: pestaña 🩺 del editor ============ */
function devPintarDoctor(cont){
  if(typeof el!=="function"||!cont) return;
  cont.appendChild(el("p","mini","Corre diagnósticos sobre <b>la partida abierta</b>. Los pesados (simular temporadas, barrer secciones) trabajan sobre una copia y restauran solo. Nada de lo que pruebes acá queda guardado."));
  var caja=el("div","dev-liga");
  cont.appendChild(caja);
  var acciones=el("div","fichas"); acciones.style.margin="6px 0";
  cont.appendChild(acciones);
  var salida=el("div"); cont.appendChild(salida);

  function pintarRes(res){
    salida.innerHTML="";
    var col=res.veredicto==="sano"?"#2fa84f":(res.veredicto==="con detalles"?"#d68a1f":"#c0392b");
    caja.innerHTML="<div class='dev-liga-cab'><b style='color:"+col+"'>"+res.veredicto.toUpperCase()+"</b>"+
      " <span class='mini'>"+res.ok+" de "+res.total+" chequeos · "+res.ms+" ms</span></div>";
    var areas={};
    res.checks.forEach(function(c){ (areas[c.area]=areas[c.area]||[]).push(c); });
    Object.keys(areas).forEach(function(a){
      salida.appendChild(el("h3","sub",{motor:"⚙️ Motor y tablas",simulacion:"⏩ Simulación",
        contenido:"📚 Contenido",interfaz:"📱 Interfaz"}[a]||a));
      areas[a].forEach(function(c){
        var f=el("div","fila"+(c.ok?"":" mal"));
        f.innerHTML="<span>"+(c.ok?"✅":"❌")+" "+escHtml(c.n)+"</span><b class='mini'>"+escHtml(c.txt||"")+"</b>";
        salida.appendChild(f);
        if(!c.ok&&(c.detalle||[]).length){
          var d=el("details"); d.appendChild(el("summary","mini","ver "+c.detalle.length+" detalle(s)"));
          c.detalle.slice(0,25).forEach(function(x){ d.appendChild(el("div","mini","· "+escHtml(String(x)))); });
          salida.appendChild(d);
        }
      });
    });
  }
  function correr(opts,label){
    salida.innerHTML=""; salida.appendChild(el("p","mini","⏳ "+label+"…"));
    setTimeout(function(){
      var res;
      try{ res=devDoctor(opts); }catch(e){ salida.innerHTML=""; salida.appendChild(el("p","mini","Explotó: "+e.message)); return; }
      pintarRes(res);
      if(typeof aviso==="function") aviso("🩺 "+res.veredicto+" · "+res.ok+"/"+res.total);
    },30);
  }
  function btn(txt,fn){ var b=el("button","ficha",txt); b.onclick=fn; acciones.appendChild(b); return b; }
  btn("🩺 Revisar todo",function(){ correr({},"revisando todo"); });
  btn("⚡ Solo lo rápido",function(){ correr({soloRapidos:true},"chequeos rápidos"); });
  btn("⚙️ Motor",function(){ correr({area:"motor"},"motor y tablas"); });
  btn("📚 Contenido",function(){ correr({area:"contenido"},"contenido"); });
  btn("📱 Interfaz",function(){ correr({area:"interfaz"},"interfaz"); });
  btn("⏩ Simular 5 temporadas",function(){
    salida.innerHTML=""; salida.appendChild(el("p","mini","⏳ simulando 5 temporadas sobre una copia…"));
    setTimeout(function(){
      var r=devSimularYRevisar(5); r.id="sim5"; r.area="simulacion"; r.n="Simular 5 temporadas";
      pintarRes({ok:r.ok?1:0, mal:r.ok?0:1, total:1, ms:0, veredicto:r.ok?"sano":"roto", checks:[r]});
    },30);
  });
  btn("💰 Radiografía económica",function(){
    salida.innerHTML=""; salida.appendChild(el("p","mini","⏳ abriendo cada club sobre una copia…"));
    setTimeout(function(){
      var r=devEconomiaClubes(E&&E.anio>=2010?2026:(E?E.anio:2026));
      salida.innerHTML="";
      salida.appendChild(el("p","mini","Balance de un año <b>sin gestionar</b> (TV+sponsors+socios+taquilla − planilla − operación − intereses). Sirve para calibrar: arriba debe sobrar para ambición; abajo, tener que vender."));
      r.forEach(function(x){
        if(x.error){ salida.appendChild(el("div","fila mal","<span>"+escHtml(x.id)+"</span><b class='mini'>"+escHtml(x.error)+"</b>")); return; }
        salida.appendChild(el("div","fila"+(x.balance<-500?" mal":""),"<span>"+escHtml(x.n||x.id)+" · nivel "+x.nivel+"</span><b class='mini'>planilla "+x.planilla+" · taquilla "+x.taquilla+" · balance "+(x.balance>0?"+":"")+x.balance+"</b>"));
      });
    },30);
  });
  btn("🎯 Calibrar motor vs IA",function(){
    salida.innerHTML=""; salida.appendChild(el("p","mini","⏳ jugando partidos de prueba sobre una copia…"));
    var pinta=(typeof pintarSimOverlay==="function")?pintarSimOverlay:function(){};
    pinta("🎯 Calibrando motor vs IA","Arrancando…",true);
    devCalibrarMotorAsync(150, null, function(h,t){
      pinta("🎯 Calibrando motor vs IA",h+" de "+t+" partidos de prueba ("+Math.round(100*h/t)+"%). La página sigue viva: puedes cancelar.",true);
    }, function(r){
      if(typeof cerrarSimOverlay==="function") cerrarSimOverlay();
      salida.innerHTML="";
      if(!r){ salida.appendChild(el("p","mini","Calibración cancelada: tu partida quedó como estaba.")); return; }
      salida.appendChild(el("p","mini","Puntos por partido de TU motor vs el modelo de la IA, a igual diferencia de fuerza. Brecha cerca de 0 = nadie tiene ventaja por ser el jugador. Ajuste actual: c="+(MOTOR_AJUSTE&&MOTOR_AJUSTE.c)+" · s="+(MOTOR_AJUSTE&&MOTOR_AJUSTE.s)+"."));
      (r||[]).forEach(function(x){
        salida.appendChild(el("div","fila"+(Math.abs(x.brecha)>0.35?" mal":""),"<span>dif "+x.dif+(x.local?" · local":" · visita")+"</span><b class='mini'>motor "+x.ptsMotor+" · IA "+x.ptsIA+" · brecha "+x.brecha+"</b>"));
      });
    });
  });
  btn("✉️ Probar login por código",function(){
    salida.innerHTML=""; salida.appendChild(el("p","mini","⏳ probando el flujo con un servidor simulado (no manda correos)…"));
    devProbarLoginCodigo().then(function(r){
      pintarRes({ok:r.ok?1:0, mal:r.ok?0:1, total:1, ms:r.ms||0, veredicto:r.ok?"sano":"roto",
        checks:[{id:"login_codigo", area:"interfaz", n:"Login por código al correo (simulado)", ok:r.ok, txt:r.txt, detalle:r.detalle||[]}]});
    });
  });
  btn("📋 Copiar informe",function(){
    var t=devDoctorTexto();
    try{ navigator.clipboard.writeText(t); if(typeof aviso==="function") aviso("Informe copiado"); }
    catch(e){ try{ console.log(t); if(typeof aviso==="function") aviso("Informe en la consola (F12)"); }catch(x){} }
  });
  correr({soloRapidos:true},"chequeos rápidos");
}
