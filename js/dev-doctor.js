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
/* ============ ÁREA: SIMULACIÓN ============ */
/* Corre temporadas COMPLETAS sobre una copia y revisa que al final todo cierre.
   Usa el snapshot de Grok (clonarPartida/restaurarPartida) para no tocar la
   partida real del jugador. Es el chequeo pesado. */
function devSimularYRevisar(temporadas){
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
      detalle.push("temporada "+anio+": "+vueltas+" compromisos · puntero "+((camp&&camp.n)||"?")+" ("+((camp&&camp.pts)||0)+" pts)");
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
      var sobran=Object.keys(E.tabla||{}).filter(function(id){ return !(pool2||[]).some(function(c){ return c.id===id; }); });
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
  btn("📋 Copiar informe",function(){
    var t=devDoctorTexto();
    try{ navigator.clipboard.writeText(t); if(typeof aviso==="function") aviso("Informe copiado"); }
    catch(e){ try{ console.log(t); if(typeof aviso==="function") aviso("Informe en la consola (F12)"); }catch(x){} }
  });
  correr({soloRapidos:true},"chequeos rápidos");
}
