"use strict";
/* ============================================================
   FUTBOLINI · dev-banco.js — 7.9110 · BANCO DE PRUEBAS POR EQUIPO + VALIDADOR DE DATOS
   Pedido del autor (camino a la 8.00): "pulir lo que hay y después sea solo añadir equipos y probar que
   cada equipo funcione correctamente, histórico o normal".
   · validarDatosClub(id): lo mínimo que un club necesita para arrancar en cada época que el jugador puede
     elegir (nombre, indicadores, caja, escudo, color, estadio). Es lo que corre al agregar un club nuevo.
   · bancoUno(id,punto,modo): arranca la partida por el MISMO camino del botón "Empezar" (argsInicio),
     revisa el arranque, juega una temporada entera y revisa el cierre y el año siguiente. Respalda y
     restaura la partida del jugador: se puede correr sobre una partida real sin tocarla.
   · test/banco.sh corre bancoUno para TODOS los clubes × épocas × modos, en paralelo.
   ============================================================ */
function bancoClubes(){
  return (typeof clubesElegibles==="function")?clubesElegibles().lista.map(c=>c.id):[];
}
function _bNum(x){ return typeof x==="number"&&isFinite(x); }
/* ---------- validador de datos (liviano, sin simular) ---------- */
function validarDatosClub(id){
  const fallas=[];
  let pts=[];
  try{ pts=puntosDeInicio(id); }catch(e){ return [id+": puntosDeInicio explotó ("+e.message+")"]; }
  if(!pts.length) fallas.push(id+": no tiene ninguna época para empezar");
  pts.forEach(pt=>{
    const ai=argsInicio(id,pt,"historico",false);
    let base=(typeof baseEra==="function")?baseEra(ai.anio):pt.base;
    const ex=ai.extra||{};
    if(ex.epoca&&ex.epoca.liga) base=ex.epoca.liga;
    base={B:"2026b",C:"2026c",ARG:"arg2026","2006":2006,"1925":1925}[ex.categoria]||base;
    const D=datosEra(base), et=id+" "+pt.etq;
    const info=D.info[id], ind=D.ind[id], caja=D.caja[id];
    if(!info){ fallas.push(et+": sin ficha del club (CLUB_INFO de la época "+base+")"); return; }
    if(!info.n) fallas.push(et+": la ficha no trae nombre");
    if(!ind) fallas.push(et+": sin indicadores (IND_BASE)");
    else ["hinchada","prestigio","plantel"].forEach(k=>{ if(!_bNum(ind[k])) fallas.push(et+": indicador «"+k+"» no es número"); });
    if(!caja) fallas.push(et+": sin caja inicial (CAJA_BASE)");
    else ["plata","deuda"].forEach(k=>{ if(!_bNum(caja[k])) fallas.push(et+": caja «"+k+"» no es número"); });
    if(pt.tipo==="gloria"&&pt.ep&&!pt.ep.etq&&!pt.ep.anio) fallas.push(et+": época de gloria sin año ni etiqueta");
  });
  if(typeof escudoSVG==="function"&&!escudoSVG(id,24)) fallas.push(id+": sin escudo");
  if(typeof colorDeClub==="function"&&!colorDeClub(id)) fallas.push(id+": sin color de club");
  return fallas;
}
function validarDatosTodos(){
  const out=[]; bancoClubes().forEach(id=>validarDatosClub(id).forEach(f=>out.push(f)));
  return out;
}
/* ---------- una partida de punta a punta ---------- */
function _bPlantelVivo(){ return (E.plantel||[]).filter(j=>!j.vendido&&!j.cedido&&!j.retirado); }
/* 7.9110 · cada fecha de liga: nadie juega dos veces y nadie de fuera de la liga (el fixture real 2026 metía a un
   club que la simulación ya había descendido) */
function fixtureProblemas(){
  if(!E||!E.calendario) return [];
  const liga=((typeof LIGA_ACT!=="undefined"&&LIGA_ACT)?LIGA_ACT:[]).map(c=>c.id), out=[];
  E.calendario.filter(p=>p.tipo==="liga"&&!p.jugado&&Array.isArray(p.jornada)&&!/liguilla|playoff/i.test(p.fase||"")).forEach(p=>{   /* lo jugado ya pasó: se miran las que faltan */
    const n={}, fuera=[];
    p.jornada.forEach(q=>{ if(!q||q[0]==="__BYE__"||q[1]==="__BYE__"||q[0]===q[1]) return;
      [q[0],q[1]].forEach(id=>{ n[id]=(n[id]||0)+1; if(liga.length&&liga.indexOf(id)<0&&fuera.indexOf(id)<0) fuera.push(id); }); });
    const dos=Object.keys(n).filter(id=>n[id]>1);
    if(dos.length) out.push("fecha "+p.fecha+": "+dos.join(",")+" juega(n) dos veces");
    if(fuera.length) out.push("fecha "+p.fecha+": "+fuera.join(",")+" no está en la liga");
  });
  return out;
}
function _bRevisarEstado(momento,f){
  if(!E){ f.push(momento+": no hay partida"); return; }
  ["plata","deuda"].forEach(k=>{ if(!_bNum(E[k])) f.push(momento+": E."+k+" = "+E[k]); });
  Object.keys(E.ind||{}).forEach(k=>{ if(typeof E.ind[k]==="number"&&!isFinite(E.ind[k])) f.push(momento+": indicador "+k+" = "+E.ind[k]); });
  const vivos=_bPlantelVivo();
  if(vivos.length<18) f.push(momento+": plantel con "+vivos.length+" jugadores (mínimo 18)");
  if(!vivos.some(j=>j.pos==="ARQ")) f.push(momento+": plantel sin arquero");
  const malos=vivos.filter(j=>!_bNum(j.nivel)||!j.n||!j.pos);
  if(malos.length) f.push(momento+": "+malos.length+" jugador(es) sin nombre, puesto o nivel ("+malos.slice(0,3).map(j=>j.n||"?").join(", ")+")");
  if(!E.tabla||!E.tabla[E.club]) f.push(momento+": tu club no está en la tabla");
  const pool=(typeof clubesLigaActual==="function")?clubesLigaActual():[];
  if(!pool.some(c=>c.id===E.club)) f.push(momento+": tu club no está en su propia liga");
  const sinFila=pool.filter(c=>!E.tabla[c.id]).map(c=>c.id);
  if(sinFila.length) f.push(momento+": "+sinFila.length+" rival(es) sin fila en la tabla ("+sinFila.slice(0,4).join(",")+")");
  const nan=Object.keys(E.tabla||{}).filter(k=>{ const x=E.tabla[k]; return !x||!_bNum(x.pts)||!_bNum(x.gf); });
  if(nan.length) f.push(momento+": filas de tabla con números rotos ("+nan.slice(0,4).join(",")+")");
  if(typeof proximoPartido==="function"&&!proximoPartido()) f.push(momento+": no hay próximo partido (calendario vacío)");
  if(typeof cupoExtranjeros==="function"&&!cupoExtranjeros()) f.push(momento+": sin regla de cupo de extranjeros");
  fixtureProblemas().slice(0,3).forEach(x=>f.push(momento+": fixture · "+x));
  if(typeof ingresoPersonalSemanal==="function"&&typeof planillaAnualClub==="function"){ const s=ingresoPersonalSemanal(), pl=planillaAnualClub(E);
    if(pl>0&&s*52>pl*0.35) f.push(momento+": el DT cobra "+s+" M/semana con planilla "+Math.round(pl)+" M/año"); }
}
function bancoUno(id,pt,modo,temps){
  const f=[], t0=Date.now(), nT=Math.max(1,Math.min(10,temps|0||1));
  const snap=(typeof E!=="undefined"&&E&&typeof clonarPartida==="function")?clonarPartida(E):null;
  const errs=[], ce=console.error, rd=window.riesgoDestitucion, gu=window.guardar;
  window.guardar=function(){};   /* nuevaPartida guarda: sin esto el banco pisaría la partida real del jugador */
  console.error=function(){ errs.push(Array.prototype.map.call(arguments,x=>x&&x.message?x.message:String(x)).join(" ").slice(0,160)); };
  let resumen="", despedido=false;
  try{
    const ai=argsInicio(id,pt,modo||"historico",false);
    const ok=nuevaPartida(ai.id,ai.anio,ai.modo,ai.extra);
    if(ok===false||!E||E.club!==id){ f.push("no arrancó (nuevaPartida devolvió "+ok+", club "+(E&&E.club)+")"); return {fallas:f,resumen:""}; }
    if(E.modo!==(modo||"historico")) f.push("modo "+E.modo+" en vez de "+modo);
    _bRevisarEstado("arranque",f);
    const anioIni=E.anio, liga0=E.eraBase, partes=[];
    for(let k=0;k<nT&&!f.length;k++){
      const anio0=E.anio, deuda0=Math.round(E.deuda), caja0=Math.round(E.plata), club0=E.club;
      let r=null, diag="";
      /* lo que ve el directorio justo antes de decidir si te echa (para leer un despido en el informe) */
      window.riesgoDestitucion=function(){ const v=rd.apply(this,arguments); diag="dir "+Math.round(E.grupos.directorio.aprob)+" · malos "+(E.carrera.malos|0)+" · caja "+caja0+"→"+Math.round(E.plata)+" · deuda "+deuda0+"→"+Math.round(E.deuda); return v; };
      E._bulkSim=true;
      try{
        r=simularTemporadasSync(1);
        /* relevo generacional: el jugador elige heredero y sigue; el banco hace lo mismo */
        if(r&&r.freno&&E.dinastia&&E.dinastia.sucesionPendiente&&typeof asumirSucesor==="function"){ asumirSucesor(); r=simularTemporadasSync(1); }
      }catch(e){ f.push(anio0+": la temporada explotó: "+e.message+" @"+((e.stack||"").split("\n")[1]||"").trim()); }
      window.riesgoDestitucion=rd;
      if(E) E._bulkSim=false;
      const desp=E.club!==club0;
      if(desp&&k===0) despedido=true;
      if(r&&r.freno) f.push(anio0+": la temporada se frenó: "+r.freno);
      if(E.anio<=anio0) f.push(anio0+": el año no avanzó ("+anio0+" → "+E.anio+")");
      const A=E.archivo||{temps:[]}, t=(A.temps||[]).filter(x=>x.anio===anio0&&x.club===club0).pop();
      if(!t) f.push("la temporada "+anio0+" no quedó en el archivo");
      else if(t.descuadres) f.push("archivo "+anio0+": "+t.descuadres+" equipos no cuadran con la tabla real");
      if(!E.carrera.fin&&!E.carrera.enParo) _bRevisarEstado(E.anio+" (año siguiente)",f);
      partes.push(desp?"DESPEDIDO ("+String(E.carrera.motivo||"").slice(0,60)+" · "+diag+") → "+E.club:diag);
      if(E.carrera.fin) break;
    }
    resumen=anioIni+"→"+E.anio+" · "+(liga0!==E.eraBase?liga0+"→"+E.eraBase+" · ":"")+partes.join(" | ");
    if(despedido) resumen="DESPEDIDO · "+resumen;
  }catch(e){ f.push("EXCEPCIÓN: "+e.message+" @"+((e.stack||"").split("\n")[1]||"").trim()); }
  finally{
    console.error=ce; window.riesgoDestitucion=rd; window.guardar=gu;
    errs.slice(0,4).forEach(x=>f.push("console.error: "+x));
    if(snap&&typeof restaurarPartida==="function"){ try{ restaurarPartida(snap); }catch(e){} }
  }
  return {fallas:f,resumen:resumen,despedido:despedido,ms:Date.now()-t0};
}
/* ---------- doctor ---------- */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"datos_clubes", area:"contenido", n:"Cada club elegible tiene lo mínimo para arrancar en cada época",
    arreglo:"js/dev-banco.js validarDatosClub(): ficha, indicadores, caja, escudo y color por época. Al agregar un club, completa lo que diga.",
    fn:function(){
      const ids=bancoClubes(); if(!ids.length) return _dmal("no se pudo leer la lista de clubes (clubesElegibles)");
      const f=validarDatosTodos();
      return f.length?_dmal(f.length+" dato(s) faltante(s)",f):_dok(ids.length+" clubes elegibles con datos completos en todas sus épocas");
    }});
  devDoctorRegistrar({id:"ayudante_directorio", area:"motor", n:"El ayudante no le quita apoyo a un directorio que ya está en rojo",
    arreglo:"js/arranque-justo.js pesoGrupoAyudante(): el peso de un grupo sube cuando su aprobación baja de 20.",
    fn:function(){
      if(typeof puntajeAyudante!=="function") return _dmal("no cargó js/arranque-justo.js");
      const trato={t:"trato",dif:20,grupos:{camarin:12,directorio:-8}}, nada={t:"nada",dif:20};
      const est=a=>({plata:500,deuda:0,grupos:{directorio:{aprob:a},camarin:{aprob:30}},plantel:[]});
      const f=[];
      if(!(puntajeAyudante(trato,est(50))>puntajeAyudante(nada,est(50)))) f.push("con el directorio en +50 no acepta +12 camarín / −8 directorio (debería)");
      if(!(puntajeAyudante(trato,est(-60))<puntajeAyudante(nada,est(-60)))) f.push("con el directorio en −60 igual le resta −8 (así se echaba a medio banco en la primera temporada)");
      return f.length?_dmal(f.length+" problema(s)",f):_dok("con directorio +50 negocia, con −60 lo cuida");
    }});
  devDoctorRegistrar({id:"banco_tu_club", area:"simulacion", n:"Banco: tu club juega una temporada entera desde su primera época", pesado:true,
    arreglo:"js/dev-banco.js bancoUno(). Para todos los clubes: bash test/banco.sh",
    fn:function(){
      if(!E) return _dok("sin partida");
      const id=E.club, pt=puntosDeInicio(id)[0]; if(!pt) return _dmal(id+" sin época de inicio");
      const r=bancoUno(id,pt,"historico");
      return r.fallas.length?_dmal(id+" · "+pt.etq+": "+r.fallas.length+" falla(s)",r.fallas):_dok(id+" · "+pt.etq+" · "+r.resumen);
    }});
}
/* ---------- partidas guardadas con versiones viejas (test/saves.sh) ----------
   Carga el estado por el mismo camino que el arranque (E=save; normalizarEstado; aplicarEstatutosMod), pinta
   cada sección, termina la temporada y revisa. Devuelve {fallas, resumen}. Respalda y restaura la partida real. */
const BANCO_SECCIONES=["escritorio","institucion","finanzas","plantel","mercado","estadio","redes","calendario","historia","carrera","vida","avisos","ajustes"];
function probarSaveViejo(est){
  const f=[], snap=(typeof E!=="undefined"&&E&&typeof clonarPartida==="function")?clonarPartida(E):null;
  const errs=[], ce=console.error, secPrev=(typeof SEC!=="undefined")?SEC:"escritorio", gu=window.guardar;
  window.guardar=function(){};
  console.error=function(){ errs.push(Array.prototype.map.call(arguments,x=>x&&x.message?x.message:String(x)).join(" ").slice(0,160)); };
  let resumen="";
  try{
    E=JSON.parse(JSON.stringify(est));
    try{ normalizarEstado(); if(typeof aplicarEstatutosMod==="function") aplicarEstatutosMod(); }
    catch(e){ f.push("no carga: "+e.message); return {fallas:f,resumen:""}; }
    _bRevisarEstado("al cargar",f);
    BANCO_SECCIONES.forEach(s=>{ try{ SEC=s; render(); }catch(e){ f.push("la sección «"+s+"» explota: "+e.message); } });
    const anio0=E.anio;
    try{ E._bulkSim=true; simularTemporadasSync(1); }catch(e){ f.push("terminar la temporada explota: "+e.message); }
    if(E) E._bulkSim=false;
    if(E.anio<=anio0) f.push("el año no avanzó ("+anio0+" → "+E.anio+")");
    if(!E.carrera.fin&&!E.carrera.enParo) _bRevisarEstado("año siguiente",f);
    resumen=E.club+" "+anio0+"→"+E.anio;
  }catch(e){ f.push("EXCEPCIÓN: "+e.message); }
  finally{
    console.error=ce; window.guardar=gu;
    errs.slice(0,4).forEach(x=>f.push("console.error: "+x));
    try{ SEC=secPrev; }catch(e){}
    if(snap&&typeof restaurarPartida==="function"){ try{ restaurarPartida(snap); }catch(e){} }
  }
  return {fallas:f,resumen:resumen};
}
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"save_ida_vuelta", area:"motor", n:"Tu partida guardada vuelve a cargar, se pinta entera y termina su temporada", pesado:true,
    arreglo:"js/dev-banco.js probarSaveViejo(). Saves de versiones viejas: bash test/saves.sh",
    fn:function(){
      if(!E) return _dok("sin partida");
      const r=probarSaveViejo(clonarPartida(E));
      return r.fallas.length?_dmal(r.fallas.length+" falla(s) al recargar tu partida",r.fallas):_dok("recargada, "+BANCO_SECCIONES.length+" secciones pintadas · "+r.resumen);
    }});
}
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"banco_no_guarda", area:"motor", n:"Las pruebas del banco no pisan tu partida guardada",
    arreglo:"js/dev-banco.js: bancoUno/probarSaveViejo apagan guardar() mientras corren y lo devuelven al final.",
    fn:function(){
      const gu=window.guardar; let n=0;
      window.guardar=function(){ n++; };
      const f=[];
      try{
        const id=(E&&E.club)||"CC", pt=puntosDeInicio(id)[0];
        const pre=window.guardar; bancoUno(id,pt,"historico",0);
        if(window.guardar!==pre) f.push("bancoUno no devolvió guardar() como estaba");
      }catch(e){ f.push("EXCEPCIÓN: "+e.message); }
      finally{ window.guardar=gu; }
      if(n) f.push("bancoUno guardó "+n+" vez/veces mientras corría (pisa la partida real)");
      return f.length?_dmal(f.length+" problema(s)",f):_dok("el banco corre sin guardar y deja guardar() intacto");
    }, pesado:true});
  /* 7.9110 · Apertura/Clausura: cada año nuevo parte en Apertura, sin la tabla del Apertura anterior */
  devDoctorRegistrar({id:"apertura_cada_anio", area:"motor", n:"Argentina y 2006: cada año vuelve a tener Apertura y Clausura",
    arreglo:"js/motor.js nuevoAnio(): resetea E.flags.argFase/fase2006 a \"apertura\" y borra E.tablaApertura antes del calendario.",
    fn:function(){
      if(!E) return _dok("sin partida");
      const snap=clonarPartida(E), gu=window.guardar, f=[];
      window.guardar=function(){};
      try{
        E._bulkSim=true;
        E.flags.argFase="clausura"; E.flags.fase2006="clausura"; E.tablaApertura={X:{pts:9}}; E.temporadaApertura={pts:9};
        nuevoAnio();
        if(E.flags.argFase!=="apertura") f.push("argFase quedó en «"+E.flags.argFase+"» al empezar el año (el Clausura argentino no se siembra)");
        if(E.flags.fase2006!=="apertura") f.push("fase2006 quedó en «"+E.flags.fase2006+"» al empezar el año (el Clausura 2006 no se siembra)");
        if(E.tablaApertura) f.push("la tabla del Apertura del año anterior sigue viva (suma puntos viejos al año nuevo)");
      }catch(e){ f.push("EXCEPCIÓN: "+e.message); }
      finally{ window.guardar=gu; restaurarPartida(snap); }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("año nuevo: fase en Apertura y sin tabla vieja");
    }});
}
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"fixture_limpio", area:"motor", n:"Cada fecha de liga: nadie juega dos veces ni aparece un club que no está en la liga",
    arreglo:"js/data-liga.js emparejarFecha(): los cruces oficiales solo si los dos clubes siguen en la liga; construirCalendario descarta el fixture real si un rival ya no está.",
    fn:function(){
      if(!E) return _dok("sin partida");
      const p=fixtureProblemas();
      return p.length?_dmal(p.length+" fecha(s) con cruces rotos",p):_dok(E.calendario.filter(x=>x.tipo==="liga"&&!x.jugado).length+" fechas de liga por jugar, limpias");
    }});
}
if(typeof devDoctorRegistrar==="function"){
  /* 7.9110 · cambiar de club (despido, rescate u oferta) no te cambia la vida: edad, familia, plata, logros, sombra */
  devDoctorRegistrar({id:"cambio_club_vida", area:"motor", n:"Al cambiar de club tu vida viaja contigo (edad, familia, patrimonio, logros, sombra)",
    arreglo:"js/carrera.js aceptarClub(): copia PERSONALES (perfil, personal, logros, sombra, records, dinastia, config, _slot) a la partida nueva.",
    fn:function(){
      if(!E) return _dok("sin partida");
      const snap=clonarPartida(E), gu=window.guardar, f=[];
      window.guardar=function(){};
      try{
        E._bulkSim=true;
        E.perfil=E.perfil||{}; E.perfil.nacimiento="1961-03-03"; E.perfil.hijos=[{nombre:"Hijo de prueba"}];
        E.personal=E.personal||{}; E.personal.bolsillo=7777;
        E.logros=E.logros||{}; E.logros._prueba={anio:E.anio};
        if(typeof _sombraE==="function"){ _sombraE().log.push({tipo:"prueba",peso:9,anio:E.anio}); }
        E._slot=E._slot||"slot_prueba"; const slot=E._slot;
        const otro=(ofertaDeRescate()[0]||{}).id; if(!otro) return _dok("sin club de rescate para probar");
        aceptarClub(otro,E.anio);
        if(!E.perfil||E.perfil.nacimiento!=="1961-03-03") f.push("la fecha de nacimiento cambió (el DT rejuvenece al cambiar de club)");
        if(!E.perfil||!(E.perfil.hijos||[]).some(h=>h.nombre==="Hijo de prueba")) f.push("se perdieron los hijos");
        if(!E.personal||E.personal.bolsillo!==7777) f.push("se perdió tu patrimonio personal (bolsillo)");
        if(!E.logros||!E.logros._prueba) f.push("se perdieron los logros");
        if(typeof _sombraE==="function"&&!((E.sombra||{}).log||[]).some(x=>x.tipo==="prueba")) f.push("la sombra se borró (cambiar de club lavaba el pasado)");
        if(E._slot!==slot) f.push("la partida perdió su ranura (queda duplicada en Mis partidas)");
        if(E.club!==otro) f.push("no quedó en el club nuevo");
      }catch(e){ f.push("EXCEPCIÓN: "+e.message); }
      finally{ window.guardar=gu; restaurarPartida(snap); }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("edad, hijos, bolsillo, logros, sombra y ranura viajan contigo");
    }});
}
if(typeof devDoctorRegistrar==="function"){
  /* 7.9111 · el parpadeo verde del celu: cada repintado del partido ponía un canvas nuevo y vacío, y en modo liviano el
     primer dibujo se saltaba; además, con pregunta abierta un max-height de CSS aplastaba la cancha y la estiraba de vuelta */
  devDoctorRegistrar({id:"cancha_sin_parpadeo", area:"interfaz", n:"La cancha del partido nunca se muestra vacía ni se aplasta con las preguntas",
    arreglo:"js/cancha.js montarCancha() dibuja al tiro y canchaReusable() devuelve el mismo canvas; el alto con pregunta lo pone _cvSize (no CSS).",
    fn:function(){
      if(typeof montarCancha!=="function"||typeof _cvDraw!=="function") return _dmal("sin cancha");
      const f=[];
      if(typeof canchaReusable!=="function") f.push("falta canchaReusable(): cada repintado del partido pone un canvas nuevo (en blanco)");
      const guard={st:_cvSt,cv:_cvCanvas,raf:_cvRAF};
      const caja=document.createElement("div"); caja.style.cssText="position:absolute;left:-9999px;top:0;width:360px";
      const cv=document.createElement("canvas"); caja.appendChild(cv); document.body.appendChild(caja);
      try{
        _cvRAF=0; _cvSt=null;
        montarCancha(cv);
        if(_cvRAF) cancelAnimationFrame(_cvRAF);
        const g=cv.getContext("2d"), d=g.getImageData(0,0,cv.width,cv.height).data;
        let min=765,max=0; for(let i=0;i<d.length;i+=4*97){ const v=d[i]+d[i+1]+d[i+2]; if(v<min) min=v; if(v>max) max=v; }
        if(max-min<60) f.push("recién montada, la cancha está lisa (vacía hasta el cuadro siguiente: el parpadeo verde)");
      }catch(e){ f.push("EXCEPCIÓN: "+e.message); }
      finally{ caja.remove(); _cvSt=guard.st; _cvCanvas=guard.cv; _cvRAF=guard.raf; }
      let css=""; try{ Array.from(document.querySelectorAll("style")).forEach(s=>{ css+=s.textContent; }); }catch(e){}
      if(/hay-momento[^{]*\.cancha2d\{max-height/.test(css)) f.push("hay un max-height de CSS para la cancha con pregunta abierta (la aplasta y la estira: parpadea)");
      return f.length?_dmal(f.length+" problema(s)",f):_dok("se dibuja al montarla, se reutiliza entre repintados y el alto lo decide _cvSize");
    }});
}
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"boton_texto_chico", area:"interfaz", n:"El texto chico de un botón se lee (mismo color que el botón)",
    arreglo:"css/pulido.css: html body .btn-aqua .mini{color:inherit}",
    fn:function(){
      const b=document.createElement("button"); b.className="btn-aqua ancho"; b.innerHTML="<b>x</b><div class='mini'>y</div>";
      const caja=document.createElement("div"); caja.className="modal"; caja.style.cssText="position:absolute;left:-9999px"; caja.appendChild(b); document.body.appendChild(caja);
      try{ const cb=getComputedStyle(b).color, cm=getComputedStyle(b.querySelector(".mini")).color;
        return cb===cm?_dok("el texto chico usa el color del botón ("+cb+")"):_dmal("texto chico "+cm+" sobre un botón de texto "+cb+" (en los azules no se lee)"); }
      finally{ caja.remove(); }
    }});
}
if(typeof devDoctorRegistrar==="function"){
  /* 7.9111 · "hay como 5 en cancha": el 3D completa cada jugada con los que faltan, en posiciones de reglamento */
  devDoctorRegistrar({id:"balon_parado_poblado", area:"interfaz", n:"Córner y tiro libre en 3D con la cancha poblada, todos donde manda el reglamento",
    arreglo:"js/arco-gl.js sitiosExtras(cam): atacantes, defensores y árbitro por jugada; _glExtras los pone en la escena.",
    fn:function(){
      if(typeof sitiosExtras!=="function") return _dmal("falta sitiosExtras (el 3D solo muestra al pateador, la barrera y el arquero)");
      const f=[], det=[];
      const casos=[{n:"córner",cam:{frontal:false,sg:1},min:16},{n:"córner izq",cam:{frontal:false,sg:-1},min:16},{n:"tiro libre",cam:{frontal:true,modo:"tl",Zb:20},min:10},{n:"penal",cam:{frontal:true,modo:"penal",Zb:11},min:8}];
      casos.forEach(c=>{
        const r=sitiosExtras(c.cam), j=r.sitios.filter(q=>q.eq!=="arb");
        det.push(c.n+": "+j.length+" jugadores + "+(r.sitios.length-j.length)+" árbitro");
        if(j.length<c.min) f.push(c.n+": solo "+j.length+" jugadores de relleno (mínimo "+c.min+")");
        if(!r.sitios.some(q=>q.eq==="arb")) f.push(c.n+": sin árbitro");
        if(c.cam.modo==="penal") r.sitios.forEach(q=>{ const d=Math.hypot(q.x,q.z-11), dentro=q.z<16.5&&Math.abs(q.x)<20.16;
          if(q.eq!=="arb"&&(dentro||d<9.15||q.z<11)) f.push("penal: un jugador en ("+q.x+","+q.z+") está dentro del área o a menos de 9,15 m"); });
        if(c.cam.modo==="tl") r.sitios.forEach(q=>{ if(q.eq==="def"&&Math.hypot(q.x,q.z-c.cam.Zb)<9.15) f.push("tiro libre: un defensor a menos de 9,15 m de la pelota"); if(q.eq!=="arb"&&q.z<8&&Math.abs(q.x)<3.66) f.push("tiro libre: alguien parado delante del arco (tapa dónde apuntas)"); });
        if(!c.cam.frontal){ const ocup={}; r.sitios.forEach(q=>{ const k=Math.round(q.x)+","+Math.round(q.z); if(ocup[k]) f.push(c.n+": dos jugadores en el mismo lugar ("+k+")"); ocup[k]=1; }); }
      });
      return f.length?_dmal(f.length+" problema(s)",f.concat(det)):_dok(det.join(" · "));
    }});
}
if(typeof devDoctorRegistrar==="function"){
  /* 7.9111 · la plata de la vida a la escala del club: antes el DT de Segunda cobraba 8 M por semana (casi lo de
     Colo-Colo), una cita costaba hasta 30 M y el bolsillo se redondeaba a entero cada semana */
  devDoctorRegistrar({id:"vida_a_escala", area:"motor", n:"Vida: el sueldo es del contrato con el club y los gastos van a su escala",
    arreglo:"js/reputacion.js sueldoContratoDT() (≈22 % de la planilla / 52), factorVida() y costoVida(); js/motor.js paga el sueldo a dos decimales.",
    fn:function(){
      if(!E) return _dok("sin partida");
      if(typeof sueldoContratoDT!=="function"||typeof costoVida!=="function") return _dmal("faltan sueldoContratoDT/costoVida (el sueldo es igual en todos los clubes)");
      const f=[], s=ingresoPersonalSemanal(), pl=(typeof planillaAnualClub==="function")?planillaAnualClub(E):0;
      if(pl>0&&s*52>pl*0.35) f.push("el DT cobra "+plata(s)+" por semana con una planilla de "+plata(pl)+" al año (más de un tercio de la planilla)");
      let caro=0; for(let i=0;i<20;i++) if(costoVida(0.2,0.9)>s*0.5) caro++;
      if(caro) f.push("una cita cuesta más de media semana de sueldo");
      const guard=E.contratoDT;
      try{ E.contratoDT={club:"__otro__",sueldo:999}; if(sueldoContratoDT()===999) f.push("el contrato no se rehace al cambiar de club (el sueldo de un grande te sigue a la Segunda)"); }
      finally{ E.contratoDT=guard; }
      if(typeof tickSemana==="function"&&/bolsillo\+ingresoPersonalSemanal\(\)\)\)/.test(_docFuente(tickSemana))) f.push("el sueldo semanal se redondea a entero (se come los sueldos chicos)");
      if(typeof verdadesDeTuVida==="function"&&!verdadesDeTuVida().length) f.push("«Tu vida hoy» sale vacía");
      return f.length?_dmal(f.length+" problema(s)",f):_dok("sueldo "+plata(s)+"/semana · planilla "+plata(pl)+"/año · cita ≤ media semana");
    }});
}
if(typeof devDoctorRegistrar==="function"){
  /* 7.9113 · en el tema insano la barra de Jugar quedaba al final de la página: el body llevaba un filter animado, y un
     filter/transform/backdrop-filter en un ANCESTRO vuelve relativo a él todo lo position:fixed. Se revisa en cada tema. */
  function fijosAtrapados(){
    const out=[], props=["filter","transform","backdropFilter","webkitBackdropFilter","perspective"];
    [].slice.call(document.querySelectorAll("#barra,.dock-avanza,.barra-jugar,.ctrlPartido,#btnAvanzar,nav.dock-cinta")).forEach(n=>{
      if(!n.isConnected||getComputedStyle(n).position!=="fixed") return;
      for(let a=n.parentElement;a&&a!==document.documentElement;a=a.parentElement){
        const cs=getComputedStyle(a);
        const p=props.find(k=>cs[k]&&cs[k]!=="none");
        const will=/transform|filter|perspective/.test(cs.willChange||""), cont=/paint|layout|strict|content/.test(cs.contain||"");
        if(p||will||cont){ out.push((n.id?"#"+n.id:"."+String(n.className).split(" ")[0])+" queda atrapado por "+(a.id?"#"+a.id:a.tagName.toLowerCase()+(a.className&&typeof a.className==="string"?"."+a.className.split(" ")[0]:""))+" ("+(p||(will?"will-change":"contain"))+": "+(p?cs[p]:(cs.willChange||cs.contain))+")"); break; }
      }
    });
    return out;
  }
  devDoctorRegistrar({id:"fijos_sin_atrapar", area:"interfaz", n:"En todos los temas, la barra de Jugar y lo fijo quedan pegados a la pantalla",
    arreglo:"css/temas7.css: nada de filter/transform/backdrop-filter en body ni en ancestros de lo fijo (el tema insano animaba filter en body).",
    fn:function(){
      if(typeof document==="undefined"||!document.body) return _dok("sin pantalla");
      const temaPrev=document.body.getAttribute("data-tema"), f=[];
      const temas=["aero","negro","claro","insano"];
      try{
        temas.forEach(t=>{ document.body.setAttribute("data-tema",t); fijosAtrapados().forEach(x=>f.push(t+": "+x)); });
        /* y un fijo de prueba, por si en esta pantalla no hay barra de Jugar */
        const prueba=document.createElement("div"); prueba.className="barra-jugar"; prueba.style.cssText="position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0";
        document.body.appendChild(prueba);
        try{ temas.forEach(t=>{ document.body.setAttribute("data-tema",t);
          for(let a=document.body;a&&a!==document.documentElement;a=a.parentElement){ const cs=getComputedStyle(a); if((cs.filter&&cs.filter!=="none")||(cs.transform&&cs.transform!=="none")){ f.push(t+": el "+a.tagName.toLowerCase()+" lleva filter/transform (todo lo fijo se va al final de la página)"); break; } } }); }
        finally{ prueba.remove(); }
      } finally { if(temaPrev==null) document.body.removeAttribute("data-tema"); else document.body.setAttribute("data-tema",temaPrev); }
      const uniq=f.filter((x,i)=>f.indexOf(x)===i);
      return uniq.length?_dmal(uniq.length+" problema(s)",uniq):_dok(temas.length+" temas revisados: lo fijo queda pegado a la pantalla");
    }});
}
if(typeof devDoctorRegistrar==="function"){
  /* 7.9113 · entrar al partido trababa ~2 s en un celu barato: la textura del estadio pintaba 17 mil personas con un
     fill() cada una, y se armaba en el primer cuadro del partido. Ahora va por lotes de color y se arma antes. */
  devDoctorRegistrar({id:"cancha_textura_liviana", area:"rendimiento", n:"La textura del estadio se arma con pocos trazos y antes del partido",
    arreglo:"js/cancha.js _cvTextura(): público en un Path2D por color; precalentarCancha() la arma en un momento muerto.",
    fn:function(){
      if(typeof _cvTextura!=="function") return _dmal("sin cancha");
      const f=[], P=CanvasRenderingContext2D.prototype, of=P.fill, oa=P.arc; let fills=0, arcs=0;
      const guard=_cvFondo; let ms=0;
      P.fill=function(){ fills++; return of.apply(this,arguments); }; P.arc=function(){ arcs++; return oa.apply(this,arguments); };
      try{ _cvFondo=null; const a=performance.now(); _cvTextura(8); ms=performance.now()-a; }
      catch(e){ f.push("EXCEPCIÓN: "+e.message); }
      finally{ P.fill=of; P.arc=oa; _cvFondo=guard; }
      if(fills+arcs>400) f.push("armar la textura hace "+fills+" fill() y "+arcs+" arc() (el público se pinta de a uno: ~2 s de trabón al entrar al partido en un celu barato)");
      if(typeof precalentarCancha!=="function") f.push("falta precalentarCancha(): la textura se arma en el primer cuadro del partido");
      return f.length?_dmal(f.length+" problema(s)",f):_dok(fills+" fill() y "+arcs+" arc() · "+Math.round(ms)+" ms a 8 px/m · se arma antes del partido");
    }});
  /* 7.9114 · cada club del selector trae camiseta, short y medias en hex. Sin fuente, no entra (y acá se lista). */
  devDoctorRegistrar({id:"kits_clubes", area:"datos", n:"Cada club elegible tiene camiseta, short y medias en hex",
    arreglo:"js/data-kits.js KITS: local y visita de 3 hex #rrggbb. franja solo vertical, horizontal o banda.",
    fn:function(){
      if(typeof KITS!=="object"||typeof revisarKits!=="function") return _dmal("falta js/data-kits.js (KITS / revisarKits)");
      if(typeof clubesElegibles!=="function") return _dmal("sin clubesElegibles");
      const ids=clubesElegibles().lista.map(function(c){ return c.id; });
      const r=revisarKits(ids, KITS);
      const det=r.sin.map(function(id){ return "sin kit: "+id; }).concat(r.mal);
      return r.ok?_dok(r.con+"/"+r.total+" clubes elegibles con kit"):_dmal(r.sin.length+" sin kit, "+r.mal.length+" color(es) malo(s)", det);
    }});
}
if(typeof devDoctorRegistrar==="function"){
  /* 7.9116 · duelos en sala: lo que manda el rival se valida, los nombres se escapan, códigos cortos y viven en Ajustes */
  devDoctorRegistrar({id:"duelos_seguros", area:"interfaz", n:"Duelos: sala con código y clave, mensajes del rival validados, acceso desde Ajustes",
    arreglo:"js/multi.js mpValidarMsg() (lista blanca de tipos, números y clubes), _mpNombreLimpio/_mpEsc, panelDuelos() en Ajustes. Prueba completa: bash test/duelo.sh",
    fn:function(){
      if(typeof mpValidarMsg!=="function"||typeof modalDuelo!=="function") return _dmal("no cargó js/multi.js");
      const f=[], J=JSON.stringify, club=(mpClubes()[0]||{}).id;
      const malos=[["tipo desconocido",J({tipo:"eval",x:1})],["club que no existe",J({tipo:"club",club:"<img src=x>"})],["jugada fuera de rango",J({tipo:"duelo_pick",n:1,idx:7})],
        ["goles negativos",J({tipo:"duelo_res",n:1,gHost:-1,gGuest:0,pH:0,pG:0})],["mensaje gigante",J({tipo:"hola",nombre:"x".repeat(3000)})],["no es JSON","{{{"]];
      malos.forEach(x=>{ if(mpValidarMsg(x[1])!==null) f.push("acepta un mensaje con "+x[0]); });
      if(club&&!mpValidarMsg(J({tipo:"club",club:club}))) f.push("rechaza un club válido");
      const n=mpValidarMsg(J({tipo:"hola",nombre:"<b onclick=x>Ana</b>"}));
      if(!n||/[<>]/.test(n.nombre)) f.push("el nombre del rival pasa con etiquetas HTML");
      for(let i=0;i<20;i++){ const c=mpCodigoNuevo(); if(!mpCodigoValido(c)){ f.push("código de sala inválido: "+c); break; } }
      if(mpNormalizarCodigo(" ab-c d9 ")!=="ABCD9") f.push("el código no se normaliza (mayúsculas, sin espacios)");
      /* de comportamiento: se pinta Ajustes en una caja aparte y se busca el panel, en su pestaña */
      if(typeof vistaAjustes==="function"&&typeof E!=="undefined"&&E){
        const caja=document.createElement("div"), snap=clonarPartida(E); caja.style.cssText="position:absolute;left:-9999px;width:400px;visibility:hidden"; document.body.appendChild(caja);
        try{ vistaAjustes(caja);
          const pd=[].slice.call(caja.querySelectorAll(".panel")).find(p=>/Duelos/.test((p.querySelector(".cab")||{}).textContent||""));
          if(!pd) f.push("los duelos no aparecen en Ajustes");
          else if(pd.dataset&&pd.dataset.ajtab!==undefined&&pd.dataset.ajtab!=="duelos") f.push("el panel de duelos cae en la pestaña «"+pd.dataset.ajtab+"» y no en la suya");
        }catch(e){ f.push("Ajustes se cae: "+e.message); }
        finally{ caja.remove(); restaurarPartida(snap); }
      }
      if(typeof dueloLugar!=="function"||!DUELO_LUGARES.some(x=>x[0]===dueloLugar())) f.push("no se sabe dónde va el acceso rápido a duelos");
      if(typeof cargarPeerJS!=="function") f.push("falta cargarPeerJS (PeerJS tiene que bajar recién al abrir Duelos)");
      return f.length?_dmal(f.length+" problema(s)",f):_dok("mensajes validados, nombres limpios, códigos de 5 letras, en Ajustes (acceso rápido: "+dueloLugar()+")");
    }});
  /* 7.9116 · ligas próximamente: se ven en el selector, pero no arrancan partida */
  devDoctorRegistrar({id:"ligas_proximamente", area:"contenido", n:"Ligas «Próximamente» a la vista y sin arrancar partida",
    arreglo:"js/data-proximamente.js LIGAS_PROXIMAMENTE; en js/ui.js pickerClubes() sus tarjetas solo avisan.",
    fn:function(){
      if(typeof LIGAS_PROXIMAMENTE==="undefined") return _dmal("no cargó js/data-proximamente.js");
      const f=[], det=[];
      LIGAS_PROXIMAMENTE.forEach(l=>{ det.push(l.bandera+" "+l.n+": "+l.clubes.length+" clubes");
        if(l.clubes.length<10) f.push(l.n+": solo "+l.clubes.length+" clubes"); if(new Set(l.clubes).size!==l.clubes.length) f.push(l.n+": clubes repetidos"); });
      if(typeof pickerClubes!=="function") return _dmal("sin selector");
      const liga=LIGAS_PROXIMAMENTE[0], clave="futbolini_picker_f"; let prev=null; try{ prev=localStorage.getItem(clave); localStorage.setItem(clave,"pronto:"+liga.id); }catch(e){}
      const caja=document.createElement("div"); caja.style.cssText="position:absolute;left:-9999px;width:600px"; document.body.appendChild(caja);
      const np=window.nuevaPartida, ep=window.elegirEpoca, av=window.aviso; let arranco=0, avisos=0;
      window.nuevaPartida=function(){ arranco++; }; window.elegirEpoca=function(){ arranco++; }; window.aviso=function(){ avisos++; };
      try{ pickerClubes(caja); const c=caja.querySelector(".pick-pronto");
        if(!c) f.push("el selector no muestra las tarjetas de "+liga.n); else { c.click(); if(arranco) f.push("una tarjeta «Próximamente» arranca partida"); if(!avisos) f.push("una tarjeta «Próximamente» no dice nada al tocarla"); } }
      catch(e){ f.push("EXCEPCIÓN: "+e.message); }
      finally{ window.nuevaPartida=np; window.elegirEpoca=ep; window.aviso=av; caja.remove(); try{ if(prev==null) localStorage.removeItem(clave); else localStorage.setItem(clave,prev); }catch(e){} }
      return f.length?_dmal(f.length+" problema(s)",f.concat(det)):_dok(det.join(" · ")+" · con candado");
    }});
}
if(typeof devDoctorRegistrar==="function"){
  /* 7.9116 · una partida compartida como archivo es texto de otra persona: el nombre de la pareja vivía en .n y al
     cargar se limpiaba .nombre, así que un archivo manipulado ejecutaba código al abrir Vida */
  devDoctorRegistrar({id:"xss_partida_cargada", area:"seguridad", n:"Una partida manipulada no ejecuta código al cargarla y recorrer las secciones", pesado:true,
    arreglo:"js/motor.js normalizarEstado() limpia todo lo que escribe el jugador; al pintar, escHtml().",
    fn:function(){
      if(!E||typeof normalizarEstado!=="function") return _dok("sin partida");
      const snap=clonarPartida(E), secPrev=SEC, gu=window.guardar, f=[];
      const X='<img src=x onerror="window.__xssDoc=(window.__xssDoc||0)+1">';
      window.__xssDoc=0; window.guardar=function(){};
      try{
        const est=JSON.parse(JSON.stringify(E));
        est.perfil=est.perfil||{}; est.perfil.nombre="Ana"+X; est.perfil.pareja={n:"Bea"+X,desde:E.anio,nivel:60};
        est.perfil.hijos=[{nombre:"Hijo"+X,nacido:E.anio-5}]; est.perfil.plopNombre="P"+X; est.perfil.plopUser="u"+X; est.perfil.plopBio="b"+X;
        est.perfil.tinder={matches:[{n:"M"+X,bio:"x"+X,anio:E.anio}]};
        if(est.dinastia){ est.dinastia.linaje="L"+X; est.dinastia.raiz="R"+X; }
        est.clubNombre="C"+X; est.dt="D"+X;
        /* 7.9117 · y los cientos de textos que no escribe el jugador pero viajan en el archivo */
        est.notifs=(est.notifs||[]).concat([{t:"Aviso"+X,d:"det"+X,tipo:"malo",anio:E.anio}]);
        est.bandeja=(est.bandeja||[]).concat([{t:"B"+X,d:"d"+X}]);
        est.cronica=(est.cronica||[]).concat([{t:"Cr"+X,txt:"c"+X,anio:E.anio}]);
        est.memoria=(est.memoria||[]).concat([{id:"m",tipo:"x",txt:"mem"+X,anio:E.anio,idx:0,usado:0}]);
        est.sombra={log:[{tipo:"x",peso:1,txt:"s"+X,anio:E.anio}],vistos:{},ultEvento:-99,ultFavor:-99};
        if(est.perfil.vidaSocial) est.perfil.vidaSocial.agenda=[{t:"Ag"+X,modo:"m"+X,anio:E.anio,txt:"a"+X}];
        est.perfil.avatarImg="https://rastreo.example/pixel.png";
        est.ind=Object.assign(JSON.parse('{"__proto__":{"contaminado":1}}'),est.ind);
        E=est; normalizarEstado();
        if(({}).contaminado||Object.prototype.contaminado) f.push("una partida contaminó Object.prototype");
        if(E.perfil.avatarImg) f.push("la foto de perfil acepta una URL externa (rastrea a quien abre la partida)");
        /* se mira el DOM apenas se pinta cada sección: el onerror se dispara después y el repintado siguiente lo borra */
        ["escritorio","plantel","redes","carrera","vida","historia","avisos"].forEach(s=>{
          try{ SEC=s; render(); }catch(e){ f.push("la sección «"+s+"» explota con la partida manipulada: "+e.message); return; }
          const vivos=[].filter.call(document.querySelectorAll("img"),i=>/__xssDoc/.test(i.getAttribute("onerror")||""));
          vivos.forEach(i=>i.removeAttribute("onerror"));
          if(vivos.length) f.push("«"+s+"»: "+vivos.length+" <img onerror> inyectada(s) desde la partida (ej.: "+(vivos[0].parentElement?vivos[0].parentElement.textContent.slice(0,40):"")+")");
        });
      }catch(e){ f.push("EXCEPCIÓN: "+e.message); }
      finally{ window.guardar=gu; restaurarPartida(snap); SEC=secPrev; try{ render(); }catch(e){} }
      if(window.__xssDoc) f.push("se ejecutó código "+window.__xssDoc+" vez/veces");
      return f.length?_dmal(f.length+" problema(s)",f):_dok("partida envenenada (nombres, pareja, avisos, crónica, memoria, sombra, agenda, foto, __proto__) limpia en 7 secciones");
    }});
}
