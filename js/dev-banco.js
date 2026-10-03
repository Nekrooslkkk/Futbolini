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

/* 7.9118 · CSP: el juego solo corre su propio código y solo habla con servidores de la lista. Se mira la política, que de
   verdad esté activa (eval tiene que fallar), que nada en pantalla dependa de onclick/onerror escritos en el HTML y que
   el navegador no haya bloqueado nada que el juego necesitaba. */
function cspPolitica(){
  const m=typeof document!=="undefined"&&document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if(!m) return null; const d={};
  String(m.getAttribute("content")||"").split(";").forEach(x=>{ const p=x.trim().split(/\s+/); if(p[0]) d[p[0].toLowerCase()]=p.slice(1); });
  return d;
}
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"csp_estricta", area:"interfaz", n:"Seguridad: la CSP deja correr solo el código del juego y hablar solo con servidores conocidos",
    arreglo:"index.html <meta http-equiv=\"Content-Security-Policy\"> (script-src 'self', sin inline ni eval) · imágenes que fallan: atributos data-esc-id / data-ocultar-si-falla (js/data-escudos.js _imgFallo) · bloqueos en CSP_VIOLACIONES (js/util.js)",
    fn:function(){
      const f=[], d=cspPolitica();
      if(!d) return _dmal("index.html no tiene CSP: cualquier HTML que se cuele puede correr código y mandar tus datos afuera");
      const pruebas=!!document.querySelector('meta[name="futbolini-pruebas"]');
      const sc=d["script-src"]||d["default-src"]||[];
      ["'unsafe-inline'","*","https:","http:","data:","blob:"].forEach(x=>{ if(sc.indexOf(x)>=0) f.push("script-src permite "+x); });
      if(sc.indexOf("'unsafe-eval'")>=0&&!pruebas) f.push("script-src permite 'unsafe-eval'");
      [["object-src","'none'"],["base-uri","'self'"],["form-action","'none'"],["frame-src","'none'"]].forEach(x=>{ if(!d[x[0]]||d[x[0]].join(" ")!==x[1]) f.push(x[0]+" tiene que ser "+x[1]); });
      ["img-src","connect-src","style-src","font-src","default-src"].forEach(k=>{ (d[k]||[]).forEach(v=>{ if(v==="*"||v==="https:"||v==="http:") f.push(k+" abierto a cualquier sitio ("+v+")"); }); });
      if(sc.indexOf("'unsafe-eval'")<0){ let corre=false; try{ corre=(new Function("return 1"))()===1; }catch(e){} if(corre) f.push("la CSP está escrita pero no se aplica (eval corrió)"); }
      const inl=[]; document.querySelectorAll("*").forEach(el=>{ for(const a of el.attributes){ if(/^on/i.test(a.name)){ inl.push("<"+el.tagName.toLowerCase()+" "+a.name+">"); break; } } });
      if(inl.length) f.push(inl.length+" elemento(s) con "+inl[0]+" en pantalla: la CSP lo bloquea, usa addEventListener");
      document.querySelectorAll('script[src],link[rel="stylesheet"][href]').forEach(el=>{ const u=el.getAttribute("src")||el.getAttribute("href")||"";
        if(/^https?:/i.test(u)&&!/^https:\/\/fonts\.googleapis\.com\//.test(u)&&!el.integrity) f.push("se carga "+u.slice(0,60)+" de un CDN sin huella (integrity): si lo cambian allá, corre acá"); });
      if(typeof AERO_7_WINDOW_SRI==="undefined"||!/^sha(256|384|512)-/.test(AERO_7_WINDOW_SRI)) f.push("7.css del CDN sin huella (js/ventanas.js AERO_7_WINDOW_SRI)");
      const base=(typeof SERVIDOR_CONFIG!=="undefined"&&SERVIDOR_CONFIG.base)||"";
      if(base){ let host=""; try{ host=new URL(base).origin; }catch(e){}
        if(!/^https:/.test(base)) f.push("el servidor propio no usa https: "+base);
        else if(!(d["connect-src"]||[]).some(v=>v===host||(v.indexOf("*.")>=0&&host.endsWith(v.split("*")[1])))) f.push("el servidor propio "+host+" no está en connect-src"); }
      const v=(typeof CSP_VIOLACIONES!=="undefined"?CSP_VIOLACIONES:[]);
      if(v.length) f.push(v.length+" bloqueo(s) de la CSP en esta sesión: "+v.slice(0,3).join(" · "));
      return f.length?_dmal(f.length+" problema(s)",f):_dok("solo código propio, sin eval, sin HTML con onclick; "+Object.keys(d).length+" reglas; 0 bloqueos");
    }});
}

/* 7.9118 · importar un archivo o bajar de la nube reemplaza TU partida actual, nunca otra de Mis partidas por calzar
   el _slot que traía de otro aparato. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"partida_externa_no_pisa", area:"motor", n:"Seguridad: una partida importada o bajada de la nube no pisa otra de tus partidas",
    arreglo:"js/ui.js adoptarPartidaExterna() (cargarPartidaArchivo y el botón Bajar partida) · js/motor.js normalizarEstado() valida _slot",
    fn:function(){
      if(typeof adoptarPartidaExterna!=="function") return _dmal("falta adoptarPartidaExterna(): la partida de afuera guarda en la ranura que trae");
      const f=[], prev=E;
      try{
        E={club:"UC",_slot:"pActual"};
        if(adoptarPartidaExterna({club:"CC",_slot:"pOtraTuya"})._slot!=="pActual") f.push("con una partida abierta, la importada no ocupa su ranura (pisa la que traía en el archivo)");
        E=null;
        const n=adoptarPartidaExterna({club:"CC",_slot:"pOtraTuya"})._slot;
        if(n==="pOtraTuya"||!n) f.push("sin partida abierta, la importada usa la ranura del archivo en vez de una nueva");
      }finally{ E=prev; }
      ["cargarPartidaArchivo","pintarSesionNube"].forEach(nom=>{ const fn=window[nom]; if(typeof fn!=="function") return;
        const src=typeof _docFuente==="function"?_docFuente(fn):String(fn);
        if(/E\s*=\s*(nuevo|r\.estado)\s*;/.test(src)) f.push(nom+"() asigna la partida de afuera sin adoptarPartidaExterna()"); });
      if(E&&E._slot!=null&&!/^[A-Za-z0-9_-]{1,40}$/.test(String(E._slot))) f.push("tu partida tiene una ranura con forma rara: "+String(E._slot).slice(0,30));
      return f.length?_dmal(f.length+" problema(s)",f):_dok("la de afuera ocupa la ranura que reemplaza, o una nueva");
    }});
}

/* 7.9119 · con el juego quieto no puede haber nada repintándose sin parar. Una animación infinita solo puede mover
   transform/opacity (eso lo hace la tarjeta gráfica); left/width/background-position/box-shadow/filter obligan al
   navegador a recalcular y pintar 60 veces por segundo: 8–11 % de CPU en reposo en un PC, el doble en un celu flaco. */
function animacionesQueRepintan(){
  const OK={transform:1,opacity:1,offset:1,easing:1,composite:1,computedOffset:1};
  const malas={};
  (typeof document!=="undefined"&&document.getAnimations?document.getAnimations():[]).forEach(a=>{
    if(a.playState!=="running"||!a.effect) return;
    const t=a.effect.getTiming?a.effect.getTiming():{}; if(t.iterations!==Infinity) return;
    const props={}; (a.effect.getKeyframes?a.effect.getKeyframes():[]).forEach(k=>Object.keys(k).forEach(p=>{ if(!OK[p]) props[p]=1; }));
    const ps=Object.keys(props); if(!ps.length) return;
    const nom=a.animationName||"(js)"; malas[nom]=ps.join("/");
  });
  return malas;
}
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"reposo_sin_repintar", area:"rendimiento", n:"Con el juego quieto no hay animaciones que repinten la pantalla sin parar",
    arreglo:"css/*.css: la @keyframes infinita tiene que animar solo transform/opacity (mover un ::before/::after más grande en vez de background-position, escalar un anillo en vez de box-shadow). Chequeo estático en test/correr_dev.sh",
    fn:function(){
      const secPrev=SEC, f=[];
      try{ ["escritorio","plantel","finanzas","vida"].forEach(s=>{ SEC=s; try{ render(); }catch(e){}
        const m=animacionesQueRepintan(); Object.keys(m).forEach(k=>{ const x="«"+s+"»: "+k+" anima "+m[k]; if(f.indexOf(x)<0&&f.length<8) f.push(x); }); }); }
      finally{ SEC=secPrev; try{ render(); }catch(e){} }
      return f.length?_dmal(f.length+" animación(es) infinita(s) que repintan",f):_dok("todas las animaciones infinitas van por transform/opacity (0 repintado en reposo)");
    }});
}

/* 7.9119 · en Modo liviano los paneles fuera de la pantalla no se calculan (content-visibility). Eso encierra lo que
   tengan adentro: un position:fixed dentro de un panel dejaría de pegarse a la pantalla, y algo que se sale del panel
   se recortaría. Se mira que el ahorro esté puesto y que ningún panel tenga adentro algo fijo o pegajoso. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"liviano_paneles", area:"rendimiento", n:"Modo liviano: los paneles fuera de pantalla no se calculan, y nada fijo queda encerrado en uno",
    arreglo:"css/temas7.css (html body.perf #vista .panel{content-visibility:auto}) · si un panel necesita algo position:fixed/sticky adentro, sácalo del panel (al body) o excluye ese panel",
    fn:function(){
      if(typeof document==="undefined"||!document.body) return _dok("sin pantalla");
      const b=document.body, tenia=b.classList.contains("perf"), secPrev=SEC, f=[]; let vistos=0;
      try{ b.classList.add("perf");
        ["escritorio","plantel","calendario","mercado","institucion","vida","finanzas"].forEach(s=>{ SEC=s; try{ render(); }catch(e){}
          document.querySelectorAll("#vista .panel").forEach(pn=>{ vistos++;
            if(getComputedStyle(pn).contentVisibility!=="auto"&&f.length<6&&!f.some(x=>/no tiene content/.test(x))) f.push("«"+s+"»: el panel no tiene content-visibility:auto en Modo liviano (se calcula entero aunque no se vea)");
            pn.querySelectorAll("*").forEach(x=>{ const p=getComputedStyle(x).position; if((p==="fixed"||p==="sticky")&&f.length<8) f.push("«"+s+"»: <"+x.tagName.toLowerCase()+" class='"+String(x.className).slice(0,30)+"'> es "+p+" dentro de un panel: en Modo liviano queda encerrado"); }); }); });
      } finally { b.classList.toggle("perf",tenia); SEC=secPrev; try{ render(); }catch(e){} }
      return f.length?_dmal(f.length+" problema(s)",f):_dok(vistos+" paneles en 7 secciones: se saltan fuera de pantalla y nada fijo queda adentro");
    }});
}

/* 7.9120 · 🥔 Modo papa: que junte bien (misma lógica que usa sw.js) y que al prenderlo la pantalla quede de verdad
   liviana. La prueba completa (el doctor entero corriendo DENTRO del juego juntado, y el service worker de punta a
   punta) está en test/papa.sh. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"modo_papa", area:"rendimiento", n:"🥔 Modo papa: junta el juego sin cambiarlo y deja la pantalla liviana",
    arreglo:"js/papa-armar.js (papaTransformar/papaHTML/papaUnir, las usa sw.js) · js/papa.js (modoPapaSet, botones) · css/temas7.css (html.papa) · cancha.js _cvLiviano · arco-gl.js arcoGLApagado. Prueba entera: bash test/papa.sh",
    fn:function(){
      const f=[];
      if(typeof papaTransformar!=="function"||typeof papaHTML!=="function"||typeof papaUnir!=="function") return _dmal("no cargó js/papa-armar.js");
      if(typeof modoPapa!=="function"||typeof modoPapaSet!=="function") return _dmal("no cargó js/papa.js");
      const t=papaTransformar('const A=1;\n  const b=2;\nlet ÑANDÚ=3;\nconst name=4;');
      if(!/^var A=1;/m.test(t)||!/^  const b=2;/m.test(t)||!/^var ÑANDÚ=3;/m.test(t)) f.push("papaTransformar no convierte bien los const/let de primer nivel: "+t.replace(/\n/g," ⏎ "));
      if(!/^const name=4;/m.test(t)) f.push("papaTransformar convierte un nombre que ya existe en window (name): pisaría al navegador");
      const h=papaHTML('<html lang="es"><head><meta http-equiv="Content-Security-Policy" content="x"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?f" rel="stylesheet"></head><body><script src="js/util.js?v=9"></script>\n<script src="js/ui.js?v=9"></script>\n</body></html>',"9");
      if((h.match(/<script/g)||[]).length!==2||h.indexOf(PAPA_ARCHIVO+"?v=9")<0||h.indexOf(PAPA_GUARDIA+"?v=9")<0) f.push("papaHTML no deja exactamente el paquete + la guardia");
      if(!/class="papa"/.test(h)) f.push("papaHTML no marca <html class=\"papa\"> (el primer cuadro saldría pesado)");
      if(/<link[^>]+fonts\.g/.test(h)) f.push("papaHTML deja las fuentes de Google (una espera de red en celus flacos)");
      if(h.indexOf("Content-Security-Policy")<0) f.push("papaHTML se comió la CSP");
      if(!/self\.__papaOK=1/.test(papaUnir([{u:"a.js",src:"var x=1;"}]))) f.push("el paquete no marca que llegó entero: la guardia no sabría si falló");
      if(typeof PAPA_GUARDIA_JS!=="string"||PAPA_GUARDIA_JS.indexOf("normal=1")<0) f.push("la guardia no vuelve al modo normal si el paquete falla");
      if(typeof PAPA_GUARDIA_JS==="string"&&PAPA_GUARDIA_JS.indexOf("location.search")<0) f.push("la guardia puede quedar en bucle (no mira si ya está en ?normal=1)");
      /* la pantalla con html.papa */
      const html=document.documentElement, tenia=html.classList.contains("papa"), secPrev=SEC; let prevLS=null;
      try{ prevLS=localStorage.getItem("futbolini_papa"); }catch(e){}
      try{
        html.classList.add("papa"); try{ localStorage.setItem("futbolini_papa","1"); }catch(e){}
        SEC="escritorio"; try{ render(); }catch(e){}
        const inf=(document.getAnimations?document.getAnimations():[]).filter(a=>a.playState==="running"&&a.effect&&a.effect.getTiming&&a.effect.getTiming().iterations===Infinity);
        if(inf.length) f.push(inf.length+" animación(es) infinitas siguen corriendo en Modo papa ("+(inf[0].animationName||"?")+")");
        const pn=document.querySelector("#vista .panel");
        if(pn){ const cs=getComputedStyle(pn); if(cs.boxShadow!=="none") f.push("los paneles tienen sombra en Modo papa"); if(cs.contentVisibility!=="auto") f.push("los paneles fuera de pantalla se calculan en Modo papa"); }
        const au=document.querySelector("#fondo .aurora"); if(au&&getComputedStyle(au).display!=="none") f.push("el fondo animado (aurora) sigue en Modo papa");
        if(typeof _cvLiviano==="function"&&!_cvLiviano()) f.push("la cancha no usa su versión liviana en Modo papa");
        if(typeof arcoGLApagado==="function"&&!arcoGLApagado()) f.push("el balón parado sigue en 3D en Modo papa");
        const host=document.createElement("div"); try{ vistaAjustes(host); }catch(e){}
        if(!/Modo papa/.test(host.textContent||"")) f.push("Ajustes no ofrece el botón 🥔 Modo papa");
      } finally {
        html.classList.toggle("papa",tenia);
        try{ if(prevLS===null) localStorage.removeItem("futbolini_papa"); else localStorage.setItem("futbolini_papa",prevLS); }catch(e){}
        SEC=secPrev; try{ render(); }catch(e){}
      }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("junta sin cambiar el código (const→var solo arriba, nada de window), guardia lista, y la pantalla queda liviana"+(papaCargaJunta()?" · este arranque vino juntado":""));
    }});
}

/* 7.9121 · bug del autor: "gané con Colo-Colo pero no clasifiqué (por ende no se simuló)". En las épocas históricas el
   campeón quedaba marcado con cupo pero la Libertadores del año siguiente nunca se armaba (el sorteo corría solo desde
   2027), y en 1925 daba cupo a una copa que no existía. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"cupo_copa_se_juega", area:"motor", n:"El cupo a Libertadores ganado en la liga se juega al año siguiente, en cualquier época",
    arreglo:"js/data-copas2026.js: construirCalendario (envoltorio _copas33) siembra el grupo desde 1960 · cuposEpocaChile() · resolverCopa acepta las copas sorteadas (notaId SIM…)",
    fn:function(){
      if(typeof construirCalendario!=="function"||typeof cuposDesdeTemporada!=="function"||!E) return _dok("sin partida");
      const f=[], flagsPrev=JSON.stringify(E.flags||{}), anioPrev=E.anio, eraPrev=E.eraBase;
      try{
        E.flags=E.flags||{};
        [1990,1992,2007,2027].forEach(y=>{ E.flags.cupoLib=true; E.flags.cupoSud=false;
          let cal=[]; try{ cal=construirCalendario(E.club,y,true)||[]; }catch(e){ f.push(y+": construirCalendario explotó ("+e.message+")"); }
          const lib=cal.filter(p=>p.tipo==="copa"&&p.torneo==="Copa Libertadores");
          if(!lib.length) f.push("con cupo ganado, la Libertadores "+y+" no aparece en el calendario");
          else if(lib.length<6) f.push("Libertadores "+y+": solo "+lib.length+" partidos de grupo"); });
        E.eraBase=1991;
        const q=(anio,pos)=>{ E.anio=anio; return cuposDesdeTemporada(pos,false,false); };
        if(q(1925,1).lib) f.push("1925: el campeón clasifica a una Libertadores que todavía no existe (nace en 1960)");
        if(!q(1991,1).lib||!q(1991,2).lib) f.push("1991: el campeón o el 2° no clasifican a Libertadores");
        if(q(1991,3).lib) f.push("1991: el 3° clasifica (Chile tenía 2 cupos)");
        if(q(1991,5).sud) f.push("1991: da Sudamericana, que nace en 2002");
        if(q(1964,2).lib) f.push("1964: el 2° clasifica (hasta 1965 Chile llevaba 1 cupo)");
        if(!q(1966,2).lib) f.push("1966: el 2° no clasifica (desde ahí son 2)");
        if(q(1999,3).lib) f.push("1999: el 3° clasifica (el tercer cupo parte en 2000)");
        if(!q(2000,3).lib) f.push("2000: el 3° no clasifica");
        if(q(2016,4).lib) f.push("2016: el 4° clasifica (el cuarto cupo parte en 2017)");
        if(!q(2017,4).lib) f.push("2017: el 4° no clasifica");
        if(q(2001,8).sud) f.push("2001: da Sudamericana, que nace en 2002");
        if(!q(2002,5).sud) f.push("2002: no da Sudamericana");
      } finally { E.flags=JSON.parse(flagsPrev); E.anio=anioPrev; E.eraBase=eraPrev; }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("con cupo, la Libertadores aparece en 1990, 1992, 2007 y 2027; cupos por época (nada antes de 1960)");
    }});
}

/* 7.9121 · "cuando termina el partido a veces no dice que ganaste (Copa Chile, Copa de la Liga)": el final del partido
   (dirigido o simulado) y el resumen de simulación dicen pasaste / campeón / subcampeón / fuera, con penales. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"desenlace_copa", area:"interfaz", n:"Al terminar un partido de copa se dice si pasaste, saliste campeón o quedaste fuera",
    arreglo:"js/ui.js fotoCopa()/desenlaceCopa() · js/ui-partido.js cerrarPartido · js/ui.js simularDesdeAvance y jugarRapidoConRegistro",
    fn:function(){
      if(typeof desenlaceCopa!=="function"||typeof fotoCopa!=="function") return _dmal("falta desenlaceCopa/fotoCopa");
      if(!E) return _dok("sin partida");
      const f=[], calPrev=E.calendario, flagsPrev=JSON.stringify(E.flags||{}), titPrev=(E.titulos||[]).slice();
      const mk=(ronda,jug)=>({tipo:"copa",torneo:"Copa Prueba",ronda:ronda,jugado:!!jug,f:{m:6,d:1},rivalNombre:"X"});
      try{
        E.flags=E.flags||{};
        let semi=mk("Semifinal"); E.calendario=[semi]; let foto=fotoCopa(semi); semi.jugado=true; E.calendario.push(mk("FINAL"));
        let d=desenlaceCopa(semi,foto,true); if(!d||d.tipo!=="pasa"||!/FINAL/.test(d.txt)) f.push("ganar la semifinal no dice «Pasaste a FINAL» ("+(d&&d.txt)+")");
        semi=mk("Semifinal"); E.calendario=[semi]; foto=fotoCopa(semi); semi.jugado=true;
        d=desenlaceCopa(semi,foto,false); if(!d||d.tipo!=="fuera") f.push("perder la semifinal no dice «fuera» (dice: "+(d&&d.txt)+")");
        let fin=mk("FINAL"); E.calendario=[fin]; foto=fotoCopa(fin); fin.jugado=true;
        d=desenlaceCopa(fin,foto,true); if(!d||d.tipo!=="campeon") f.push("ganar la final no dice «Campeón»");
        d=desenlaceCopa(fin,foto,false); if(!d||d.tipo!=="sub") f.push("perder la final no dice «Subcampeón»");
        const g1=mk("Grupo A"), g2=mk("Grupo A"); E.calendario=[g1,g2]; foto=fotoCopa(g1); g1.jugado=true;
        if(desenlaceCopa(g1,foto,true)) f.push("a mitad de grupo ya anuncia un desenlace");
      } finally { E.calendario=calPrev; E.flags=JSON.parse(flagsPrev); E.titulos=titPrev; }
      const src=(n)=>{ const fn=window[n]; return typeof fn==="function"?(typeof _docFuente==="function"?_docFuente(fn):String(fn)):""; };
      if(!/desenlaceCopa/.test(src("cerrarPartido"))) f.push("el final del partido dirigido no muestra el desenlace de copa");
      if(!/desenlaceCopa/.test(src("simularDesdeAvance"))) f.push("el final simulado no muestra el desenlace de copa");
      if(!/penales/.test(src("simularDesdeAvance"))) f.push("el final simulado no cuenta los penales (un 1-1 ganado en penales sale «Empate»)");
      return f.length?_dmal(f.length+" problema(s)",f):_dok("semifinal, final, grupo y penales: dice lo que pasó");
    }});
  devDoctorRegistrar({id:"resultados_forzados", area:"motor", n:"Modo Dios / dev: «Ganar todo», «Perder todo» y «No echar» hacen lo que dicen",
    arreglo:"js/partido.js iniciarPartido/terminarPartido (E.flags.diosTodo) · js/carrera.js riesgoDestitucion/destituir (E.flags.diosNoEchar) · js/ui.js bloqueResultadosForzados",
    fn:function(){
      if(!E||typeof clonarPartida!=="function"||typeof restaurarPartida!=="function") return _dok("sin partida");
      const f=[], snap=clonarPartida(E), gu=window.guardar;
      try{
        window.guardar=function(){};
        ["ganar","perder"].forEach(m=>{ for(let i=0;i<3;i++){ const part=proximoPartido(); if(!part||part.jugado) break;
          E.flags.diosTodo=m; const P=iniciarPartido(part,"simular"); correrHasta(P,90); const r=terminarPartido(P)||{};
          const ok=m==="ganar"?r.yo>r.otro:r.yo<r.otro; if(!ok){ f.push("«"+(m==="ganar"?"Ganar":"Perder")+" todo» dejó un "+r.yo+"-"+r.otro); break; } } });
        E.flags.diosNoEchar=true; E.carrera.malos=5;
        if(riesgoDestitucion()) f.push("con «No echar» el directorio igual puede echarte");
        destituir("prueba del doctor"); if(E.carrera.enParo) f.push("con «No echar» destituir() igual te deja sin club");
        const host=document.createElement("div"); E.flags.modoDios=true; if(typeof bloqueResultadosForzados==="function") bloqueResultadosForzados(host);
        if(!/Ganar todo/.test(host.textContent)||!/Perder todo/.test(host.textContent)||!/No echar/.test(host.textContent)) f.push("faltan los botones Ganar todo / Perder todo / No echar");
      } catch(e){ f.push("explotó: "+e.message); }
      finally { window.guardar=gu; restaurarPartida(snap); }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("ganar y perder forzados cumplen, y con «No echar» nadie te echa");
    }});
}

/* 7.9121 · calendario "que se pueda ver todo": pestañas visibles en el celu, Resultados de TU liga con todas las fechas,
   copas del año en la repetición y la tabla entera en «La fecha se juega». */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"calendario_todo", area:"interfaz", n:"Calendario: se ve todo (pestañas, todas las fechas de tu liga, copas del año, tabla entera)",
    arreglo:"js/calendario-sofa.js _csResultados/_csFechasLiga · css/pulido.css .cs-tabs (flex-wrap en celu) · js/temporadas-archivo.js archivoCopasDelAnio/_repeCopasHTML · js/ui-jornada.js _jorTabla",
    fn:function(){
      const f=[];
      const src=(n)=>{ const fn=window[n]; return typeof fn==="function"?(typeof _docFuente==="function"?_docFuente(fn):String(fn)):""; };
      if(typeof archivoCopasDelAnio!=="function"||!/copas/.test(src("archivoCerrar"))) f.push("el archivo de temporadas no guarda las copas del año");
      if(typeof _jorTabla==="function"&&E&&typeof tablaOrdenada==="function"&&tablaOrdenada().length){
        const jPrev=E.ultimaJornada, host=document.createElement("div");
        try{ E.ultimaJornada={mio:{club:E.clubNombre,pos:1,posAntes:1},mov:[],mundo:[]}; _jorTabla(host); }catch(e){} finally{ E.ultimaJornada=jPrev; }
        if(!host.querySelector("details.jor-full")) f.push("«La fecha se juega» no ofrece la tabla entera");
      }
      if(E&&typeof mundoEra2026==="function"&&mundoEra2026()&&E.mundo&&E.mundo.ver===2&&typeof _csResultados==="function"){
        const secPrev=SEC, u=_csUI(), tabPrev=u.tab, ligaPrev=u.ligaRes;
        try{
          u.tab="resultados"; u.ligaRes=null; SEC="calendario"; render();
          const on=document.querySelector("#vista .cs-chips .ficha[aria-pressed='true']");
          if(on&&!/★/.test(on.textContent)) f.push("Resultados no abre en tu liga (abre en «"+on.textContent.trim()+"»)");
          const key=(typeof _ligaKeyJugador==="function")?_ligaKeyJugador():null, L=key&&E.mundo.ligas[key];
          const n=document.querySelectorAll("#vista details.cs-fecha-res").length;
          if(L&&(L.ronda||0)>0&&n<(L.ronda||0)) f.push("Resultados muestra "+n+" fechas de "+L.ronda+" jugadas");
          const tabs=document.querySelector("#vista .cs-tabs");
          if(tabs){ const r=tabs.getBoundingClientRect(); const fuera=[...tabs.querySelectorAll(".cs-tab")].filter(t=>{ const b=t.getBoundingClientRect(); return b.right>r.right+2||b.left<r.left-2; });
            if(fuera.length) f.push(fuera.length+" pestaña(s) del calendario quedan fuera de la pantalla ("+fuera.map(t=>t.textContent.trim()).join(", ")+")"); }
        } finally { u.tab=tabPrev; u.ligaRes=ligaPrev; SEC=secPrev; try{ render(); }catch(e){} }
      }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("pestañas a la vista, todas las fechas de tu liga, copas en la repetición y tabla entera");
    }});
}

/* 7.9122 · cancha 3D (cámara estilo FIFA): es una VISTA de la simulación, no un dibujo aparte. El doctor verifica que
   el módulo cargó, que el mapeo sim→mundo es coherente, que corre sobre el mismo _cvSt (alineado con la simulación) y
   que en Modo papa cae al cenital 2D. Lo visual lo juzga el autor; esto cuida que no se desconecte de la simulación. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"cancha3d_motor", area:"interfaz", n:"Cancha 3D: es una cámara de la simulación (mismo _cvSt) y cae al 2D en Modo papa",
    arreglo:"js/cancha3d.js (montarCanchaAuto, cancha3dActivo) · js/ui-partido.js monta con montarCanchaAuto · interruptor en Ajustes ▸ Pantalla",
    fn:function(){
      const f=[];
      ["montarCanchaAuto","cancha3dActivo","cancha3dSoportado","detenerCancha3D"].forEach(n=>{ if(typeof window[n]!=="function") f.push("falta "+n+"() (no cargó js/cancha3d.js)"); });
      if(typeof CAM3D==="undefined"||!CAM3D||typeof CAM3D.lado!=="number") f.push("CAM3D (la cámara, única fuente de verdad) no está definida");
      /* el partido monta con montarCanchaAuto, no con montarCancha directo (si no, nunca saldría el 3D) */
      const src=(typeof pantallaPartido==="function"&&typeof _docFuente==="function")?_docFuente(pantallaPartido):"";
      /* pantallaPartido puede no existir con ese nombre: busco en la función que arma el HUD */
      const txt=[window.pantallaPartido,window.montarHUD,window.pintarPartido].map(fn=>typeof fn==="function"?(typeof _docFuente==="function"?_docFuente(fn):String(fn)):"").join("\n");
      /* el 3D tiene que leer el estado de la simulación, no uno propio: montarCancha3D usa _cvSeed/_cvStep/_cvSt */
      /* 7.9126 · el 3D se partió en funciones (construir / cuadro / sincronizar): se lee todo el módulo */
      const s3=["montarCancha3D","_c3dCuadro","_c3dSincronizar","_c3dPartido"].map(n=>{ const fn=window[n]; return typeof fn==="function"?(typeof _docFuente==="function"?_docFuente(fn):String(fn)):""; }).join("\n");
      if(s3){ if(!/_cvStep/.test(s3)) f.push("la cancha 3D no avanza con _cvStep: estaría desconectada de la simulación");
        if(!/_cvSt|est\.st/.test(s3)) f.push("la cancha 3D no lee _cvSt: no reflejaría la simulación"); }
      /* Modo papa: cancha3dActivo() tiene que dar false con html.papa (salvo que se fuerce) */
      if(typeof cancha3dActivo==="function"){
        const html=document.documentElement, tenia=html.classList.contains("papa");
        const cfgPrev=E&&E.config?JSON.parse(JSON.stringify(E.config)):null;
        try{ if(E){ E.config=E.config||{}; E.config.cancha3d=true; delete E.config.cancha3dPapa; }
          html.classList.add("papa");
          if(typeof cancha3dSoportado==="function"&&cancha3dSoportado()&&cancha3dActivo()) f.push("en Modo papa la cancha 3D no cae al 2D liviano");
        } finally { html.classList.toggle("papa",tenia); if(E) E.config=cfgPrev||{}; }
      }
      /* mapeo coherente: el módulo mapea sim(0..1)→metros centrados (±52.5 largo, ±34 ancho) */
      if(s3 && !/\(simX-0\.5\)\*105|\(b\.x-0\.5\)\*105|worldZ/.test(s3.replace(/\s/g,""))&&!/105/.test(s3)) f.push("el mapeo sim→cancha no usa las medidas reales (105×68)");
      return f.length?_dmal(f.length+" problema(s)",f):_dok("el 3D corre sobre la misma simulación (_cvStep/_cvSt), mapea 105×68 y cae al 2D en Modo papa");
    }});
}

/* 7.9123 · el sonido es un oscilador, no un archivo. Animaciones OFF y el interruptor lo callan. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"sonido_callado", area:"interfaz", n:"El sonido se calla con Animaciones OFF y con el interruptor",
    arreglo:"js/sonido.js sonidoPermitido(). No hay mp3: es WebAudio.",
    fn:function(){
      if(typeof sonidoPermitido!=="function"||typeof sonar!=="function") return _dmal("no cargó js/sonido.js",["falta el script en index.html"]);
      var b=document.body, tenia=b.classList.contains("anim-off"), prev=null, f=[];
      try{ prev=localStorage.getItem("futbolini3_sonido"); }catch(e){}
      try{
        localStorage.removeItem("futbolini3_sonido");
        b.classList.remove("anim-off");
        if(!sonidoPermitido()) f.push("con las animaciones prendidas el sonido queda mudo");
        b.classList.add("anim-off");
        if(sonidoPermitido()) f.push("con Animaciones OFF el sonido sigue activo");
        b.classList.remove("anim-off");
        localStorage.setItem("futbolini3_sonido","off");
        if(sonidoPermitido()) f.push("con Sonido off sigue activo");
        sonar("gol");
      }finally{
        b.classList.toggle("anim-off",tenia);
        try{ if(prev==null) localStorage.removeItem("futbolini3_sonido"); else localStorage.setItem("futbolini3_sonido",prev); }catch(e){}
      }
      if(String(celebrarGol).indexOf("gol-toast")<0) f.push("el festejo del gol perdió el zócalo del rival");
      return f.length?_dmal(f.length+" problema(s)",f):_dok("callado con Animaciones OFF y con Sonido off");
    }});
}

/* 7.9125 · PARTIDA PERDIDA (bug urgente del autor: "aprieto Continuar y no carga la partida anterior"). Con ~9 partidas
   localStorage se llenaba, el error de espacio se tragaba, el juego decía "guardado" y la ranura quedaba vacía o vieja.
   Estos chequeos corren sobre la partida y el navegador REALES del jugador: prueban con una ranura de prueba aparte
   y dejan la copia rápida, la lista y la partida activa como estaban (byte a byte). */
function _docRespaldoPartidas(){
  const r={E:E, ls:{}, ultimo:PARTIDAS.ultimo, estado:PARTIDAS.estado, ram:_ram[LLAVE]};
  [LLAVE,SLOTS_LLAVE,ACTIVO_LLAVE].forEach(k=>{ r.ls[k]=_lsTxt(k); });
  const n=document.getElementById("guardadoTxt"); r.txt=n?n.textContent:null; r.clase=n?n.className:"";
  r.cartel=document.getElementById("guardadoFallo");
  return r;
}
function _docRestaurarPartidas(r){
  Object.keys(r.ls).forEach(k=>{ if(r.ls[k]==null) _lsQuitar(k); else _lsPoner(k,r.ls[k]); });
  E=r.E; PARTIDAS.ultimo=r.ultimo; PARTIDAS.estado=r.estado;
  if(r.ram===undefined) delete _ram[LLAVE]; else _ram[LLAVE]=r.ram;
  if(E){ if(typeof initLigaMod==="function") initLigaMod(); if(typeof activarLiga==="function") activarLiga(E.eraBase); }
  const n=document.getElementById("guardadoTxt"); if(n&&r.txt!=null){ n.textContent=r.txt; n.className=r.clase; }
  const c=document.getElementById("guardadoFallo"); if(c&&c!==r.cartel) c.remove();
  if(r.cartel&&!r.cartel.isConnected) document.body.appendChild(r.cartel);
}
/* ¿IndexedDB contesta rápido acá? (en las pruebas sin pantalla el tiempo es virtual y la base tarda "segundos"): si no,
   la prueba se hace sobre localStorage, que es el mismo camino que usa el juego cuando la base no está */
async function _docBdConfiable(){
  if(typeof _bdSoporta!=="function"||!_bdSoporta()) return false;
  const t=Date.now(), ll=await bdLlaves();
  return ll!==null&&(Date.now()-t)<1000;
}
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"guardado_honesto", area:"motor", asinc:true,
    n:"Guardar nunca miente: con el navegador lleno lo dice y ofrece descargar; con espacio guarda y se relee igual",
    arreglo:"js/partidas.js partidaEscribir()/partidaGuardarYa()/avisoGuardado() · js/rendimiento.js guardarAhora() devuelve {ok,parcial,err}",
    fn:async function(){
      if(!E||!E.club) return _dok("sin partida abierta");
      if(typeof _hayStorageExterno==="function"&&_hayStorageExterno()) return _dok("guardado del entorno (window.storage): no se prueba acá");
      if(typeof guardarPendienteYa==="function") await guardarPendienteYa();
      const f=[], resp=_docRespaldoPartidas(), id="doctorG"+Date.now().toString(36), setOrig=Storage.prototype.setItem;
      const conBD=await _docBdConfiable(), apagPrev=PARTIDAS.apagada;
      let donde="";
      try{
        E=JSON.parse(JSON.stringify(resp.E)); E._slot=id; delete E._guardadoEn;
        /* 1) navegador lleno: lo grande no entra en localStorage y no hay IndexedDB */
        PARTIDAS.apagada=true;
        Storage.prototype.setItem=function(k,v){ if(String(v).length>20000) throw new DOMException("lleno (prueba del doctor)","QuotaExceededError"); return setOrig.apply(this,arguments); };
        const r1=await guardarAhora();
        Storage.prototype.setItem=setOrig; PARTIDAS.apagada=!conBD;
        const reloj=document.getElementById("guardadoTxt"), txt1=reloj?reloj.textContent:"";
        if(!r1||typeof r1.ok!=="boolean") f.push("guardarAhora() no dice si quedó guardado (devuelve "+JSON.stringify(r1)+")");
        else if(r1.ok) f.push("con el navegador lleno dice que guardó (ok:true, en "+r1.donde.join("+")+")");
        if(reloj&&/^guardado/i.test(txt1)) f.push("el reloj de guardado dice «"+txt1+"» sin haber guardado");
        const cartel=document.getElementById("guardadoFallo");
        if(!cartel) f.push("no aparece el cartel de «No se pudo guardar tu partida»");
        else if(!/Descargar/.test(cartel.textContent)) f.push("el cartel no ofrece descargar la partida");
        /* 2) con espacio: guarda de verdad, el cartel se va, y se relee la misma copia */
        const r2=await guardarAhora();
        if(!r2||!r2.ok) f.push("con espacio no pudo guardar ("+(r2&&r2.err||"sin respuesta")+")");
        else donde=r2.donde.join("+");
        if(document.getElementById("guardadoFallo")) f.push("el cartel de error sigue ahí después de guardar bien");
        const leida=(typeof partidaLeer==="function")?await partidaLeer(id):null;
        if(!leida) f.push("lo que se guardó no se puede volver a leer");
        else if(_selloDe(leida)!==_selloDe(E)) f.push("al releer vuelve otra copia (sello "+_selloDe(leida)+" ≠ "+_selloDe(E)+")");
      } catch(e){ f.push("explotó: "+(e&&e.message||e)); }
      finally {
        Storage.prototype.setItem=setOrig; PARTIDAS.apagada=!conBD;
        try{ await partidaBorrarDatos(id); }catch(e){}
        PARTIDAS.apagada=apagPrev;
        _docRestaurarPartidas(resp);
      }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("lleno → lo dice y ofrece descargar · con espacio → guarda ("+donde+") y se relee igual"+(conBD?"":" · IndexedDB lenta o ausente acá: probado sobre localStorage"));
    }});

  devDoctorRegistrar({id:"partidas_inventario", area:"motor", asinc:true,
    n:"Tus partidas guardadas: todas tienen datos, ninguna quedó fuera de la lista, y hay espacio",
    arreglo:"js/partidas.js partidasMantener() (mudanza a IndexedDB, rescate de las que no están en la lista, fichas sin datos) · Ajustes ▸ Mis partidas",
    fn:async function(){
      if(typeof partidasMantener!=="function") return _dmal("falta js/partidas.js en index.html");
      const rep=await partidasMantener(), f=[], lista=await slotsLista();
      const nom=id=>{ const s=lista.find(x=>x.id===id); return s?((s.clubNombre||s.club)+" "+(s.anio||"")).trim():id; };
      const pct=Math.round(rep.usoLS/5.2e6*100);
      if(rep.sinDatos.length) f.push(rep.sinDatos.length+" partida(s) de tu lista sin datos (el navegador no las alcanzó a guardar): "+rep.sinDatos.map(nom).join(", ")+" · quítalas en Ajustes ▸ Mis partidas o cárgalas desde un archivo descargado");
      if(rep.bd&&rep.quedanLS) f.push(rep.quedanLS+" partida(s) siguen en localStorage aunque hay IndexedDB (la mudanza falló): "+rep.errores.slice(0,3).join(" · "));
      if(pct>=80) f.push("localStorage al "+pct+"% "+(rep.bd?"(revisa qué más se guarda ahí)":"y sin IndexedDB: descarga y borra las partidas viejas"));
      if(PARTIDAS.ultimo&&!PARTIDAS.ultimo.ok) f.push("el último guardado de esta sesión falló: "+(PARTIDAS.ultimo.err||"?"));
      if(E&&E._slot&&PARTIDAS.ultimo&&PARTIDAS.ultimo.ok&&PARTIDAS.ultimo.id===E._slot&&!rep.conDatos.has(E._slot)) f.push("la partida abierta dice que se guardó pero no aparece entre las guardadas");
      const det=[rep.total+" en la lista", rep.bd?(rep.enBD+" en IndexedDB"):"sin IndexedDB (todo en localStorage)", "localStorage "+pct+"%"];
      if(rep.movidas) det.push(rep.movidas+" mudada(s) a IndexedDB ahora");
      if(rep.recuperadas.length) det.push(rep.recuperadas.length+" rescatada(s) que no estaban en la lista");
      return f.length?_dmal(f.length+" problema(s)",f.concat(det)):_dok(det.join(" · "));
    }});

  devDoctorRegistrar({id:"continuar_carga", area:"motor", asinc:true,
    n:"Continuar abre la copia más nueva, y una partida sin datos (o que no carga) lo dice en vez de quedarse muda",
    arreglo:"js/motor.js cargarPartida() lee con partidaLeer() (la copia más nueva) · js/partidas.js partidaRapidaInicio() · js/ui.js arranquePintarLista()/abrirPartidaDeLista()",
    fn:async function(){
      if(!E||!E.club) return _dok("sin partida abierta");
      if(typeof _hayStorageExterno==="function"&&_hayStorageExterno()) return _dok("guardado del entorno (window.storage): no se prueba acá");
      if(typeof guardarPendienteYa==="function") await guardarPendienteYa();
      const f=[], resp=_docRespaldoPartidas(), id="doctorC"+Date.now().toString(36), av=window.aviso, ne=window.normalizarEstado, dichos=[];
      const conBD=await _docBdConfiable(), apagPrev=PARTIDAS.apagada;
      PARTIDAS.apagada=!conBD;
      const base=JSON.parse(JSON.stringify(resp.E)); base._slot=id;
      const copia=(t,marca)=>Object.assign({},base,{_guardadoEn:t, _docMarca:marca});
      const durable=async est=>{ const txt=JSON.stringify(est);
        if(typeof bdEscribir==="function"&&_bdSoporta()&&await bdEscribir(id,{id:id,t:est._guardadoEn,club:est.club,anio:est.anio,txt:txt})) return "IndexedDB";
        _lsPoner(slotKey(id),txt); return "localStorage"; };
      let lugar="";
      try{
        window.aviso=function(t){ dichos.push(String(t)); };
        /* a) la copia durable quedó vieja y la nueva solo alcanzó la copia rápida (se cerró la pestaña al guardar) */
        lugar=await durable(copia(1000,"vieja"));
        _lsPoner(LLAVE,JSON.stringify(copia(2000,"nueva")));
        let ok=false; try{ ok=await cargarPartida(id); }catch(e){ f.push("cargarPartida explotó: "+e.message); }
        if(!ok) f.push("cargarPartida no abre una partida que sí tiene datos ("+lugar+" + copia rápida)");
        else if(E._docMarca!=="nueva") f.push("Continuar abre la copia "+(E._docMarca||"?")+" de "+lugar+" aunque la copia rápida es más nueva");
        E=resp.E;
        /* b) al revés: la durable es la nueva y la copia rápida quedó vieja → manda la lista (sello t) */
        lugar=await durable(copia(3000,"nueva"));
        _lsPoner(LLAVE,JSON.stringify(copia(1000,"vieja")));
        const lista=[{id:id, club:base.club, clubNombre:base.clubNombre, anio:base.anio, guardado:Date.now(), t:3000}];
        if(typeof partidaRapidaInicio==="function"){ const g=await partidaRapidaInicio(id,lista); if(g&&_selloDe(g)<3000) f.push("al abrir el juego toma la copia rápida vieja aunque la lista dice que hay una más nueva"); }
        ok=false; try{ ok=await cargarPartida(id); }catch(e){}
        if(!ok||E._docMarca!=="nueva") f.push("con la copia rápida vieja, Continuar no abre la nueva de "+lugar);
        E=resp.E;
        /* c) ficha sin datos: cargarPartida dice false sin explotar y en el inicio sale marcada, no como botón mudo */
        if(typeof partidaBorrarDatos==="function") await partidaBorrarDatos(id); else _lsQuitar(slotKey(id));
        _lsQuitar(LLAVE);
        let r=null; try{ r=await cargarPartida(id); }catch(e){ f.push("cargarPartida de una partida sin datos explota: "+e.message); }
        if(r) f.push("cargarPartida de una partida sin datos dice que cargó");
        E=resp.E;
        if(typeof arranquePintarLista==="function"){
          PARTIDAS.estado={sinDatos:[id], conDatos:new Set()};
          const cont=document.createElement("div"); cont._salir=function(){};
          arranquePintarLista(cont,lista);
          const b=cont.querySelector(".arranque-btn");
          if(!b||!b.classList.contains("arr-rota")) f.push("en la pantalla de inicio, una partida sin datos sale como botón normal (que no hace nada)");
        } else f.push("falta arranquePintarLista() (la lista de partidas del inicio)");
        /* d) datos que hacen explotar la carga: el jugador se entera y su partida abierta no cambia */
        await durable(copia(4000,"rompe"));
        window.normalizarEstado=function(){ throw new Error("prueba del doctor"); };
        dichos.length=0;
        let ok2=null;
        try{ ok2=(typeof abrirPartidaDeLista==="function")?await abrirPartidaDeLista(id):await cargarPartida(id); }
        catch(e){ f.push("abrir una partida que no carga revienta el botón (error sin atrapar: "+e.message+")"); }
        finally{ window.normalizarEstado=ne; }
        if(ok2) f.push("una partida que no carga se da por abierta");
        if(!dichos.some(t=>/no abre|no carga/i.test(t))) f.push("abrir una partida que no carga no le dice nada al jugador");
        if(E!==resp.E) f.push("una partida que no carga deja cambiada la partida abierta");
      } catch(e){ f.push("explotó: "+(e&&e.message||e)); }
      finally {
        window.aviso=av; window.normalizarEstado=ne;
        try{ if(typeof partidaBorrarDatos==="function") await partidaBorrarDatos(id); }catch(e){}
        _lsQuitar(slotKey(id));
        PARTIDAS.apagada=apagPrev;
        _docRestaurarPartidas(resp);
      }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("abre la copia más nueva ("+lugar+" o copia rápida), y una sin datos o que no carga lo dice"+(conBD?"":" · IndexedDB lenta o ausente acá: probado sobre localStorage"));
    }});
}

/* 7.9125 · "el córner pega el juego": el minijuego siempre tiene salida (✕, vigilante si la animación se corta, error
   atrapado) y se puede apagar (Ajustes ▸ Pantalla: los córners se juegan solos). */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"corner_salida", area:"interfaz", n:"El córner nunca deja el partido pegado (salida ✕, vigilante, y se puede apagar)",
    arreglo:"js/ui-partido.js minijuegoCorner() (bsalir, vigilante 6 s, try/catch → _cornerSalida) · cornerMinijuegoOn() en pasoEnVivo/mostrarAccion · Ajustes ▸ Pantalla",
    fn:function(){
      const f=[];
      if(typeof cornerMinijuegoOn!=="function") return _dmal("falta cornerMinijuegoOn(): el córner no se puede apagar");
      const src=(n)=>{ const fn=window[n]; return typeof fn==="function"?(typeof _docFuente==="function"?_docFuente(fn):String(fn)):""; };
      const mc=src("minijuegoCorner");
      if(!/_cornerSalida/.test(mc)) f.push("el córner no tiene salida de emergencia (_cornerSalida)");
      if(!/setTimeout\(function\(\)\{ if\(!box\._cornerFin\)/.test(mc.replace(/\s+/g," ").replace(/\s/g,""))&&!/_cornerFin\)\s*_cornerSalida/.test(mc)) f.push("sin vigilante: si la animación se corta el modal queda abierto");
      if(!/Que se juegue solo/.test(mc)) f.push("falta el botón ✕ para cerrar el córner");
      if(!/cornerMinijuegoOn/.test(src("pasoEnVivo"))) f.push("con el minijuego apagado el partido igual se detiene en cada córner");
      /* apagado: mostrarAccion no abre el modal */
      if(E&&typeof mostrarAccion==="function"&&typeof P_ACTUAL!=="undefined"){
        const cfg=E.config?JSON.parse(JSON.stringify(E.config)):null, pPrev=P_ACTUAL, gu=window.guardar, pp=window.pintarPartido, rp=window.reanudarPronto;
        try{
          window.guardar=function(){}; window.pintarPartido=function(){}; window.reanudarPronto=function(){};
          E.config=E.config||{}; E.config.cornerMini=false;
          const part=(typeof proximoPartido==="function")?proximoPartido():null;
          if(part){
            P_ACTUAL=iniciarPartido(part,"dirigir");
            mostrarAccion({tipo:"corner",aFavor:true});
            if(document.querySelector("#capa-modal .modal")) f.push("con el minijuego apagado igual se abre la escena del córner");
          }
        } catch(e){ f.push("explotó: "+e.message); }
        finally { cerrarModal(); P_ACTUAL=pPrev; E.config=cfg||{}; window.guardar=gu; window.pintarPartido=pp; window.reanudarPronto=rp; }
      }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("✕ siempre, vigilante de 6 s, error atrapado y apagable");
    }});
}

/* 7.9125 · el autor: "la cancha 3D se cambia sola a 2D cuando laguea; no debe cambiar solo". Si va lenta se OFRECE
   pasar al 2D (chip chico); si explota, se avisa. Nada se autodegrada sin avisar. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"tres_d_no_cambia_solo", area:"interfaz", n:"El 3D lento no se cambia solo a 2D: lo ofrece (y si falla, avisa)",
    arreglo:"js/arco-gl.js ofrecerAliviar3D() en el vigilante de arcoGLMontar · js/cancha3d.js vigilar() + aviso en el catch de cuadro()",
    fn:function(){
      const f=[], src=(n)=>{ const fn=window[n]; return typeof fn==="function"?(typeof _docFuente==="function"?_docFuente(fn):String(fn)):""; };
      if(typeof ofrecerAliviar3D!=="function") return _dmal("falta ofrecerAliviar3D(): el 3D se apagaría solo");
      const ag=src("arcoGLMontar").replace(/\s+/g," ");
      if(/\{ ?_glApagarPorLento\(est\); ?return; ?\}/.test(ag)) f.push("el balón parado 3D se apaga solo cuando va lento (sin preguntar)");
      if(ag&&!/ofrecerAliviar3D/.test(ag)) f.push("el balón parado 3D no ofrece pasar al dibujo");
      const c3=["montarCancha3D","_c3dCuadro","_c3dVigilar"].map(src).join("\n");   /* 7.9126 · el 3D se partió en funciones */
      if(c3&&!/ofrecerAliviar3D/.test(c3)) f.push("la cancha 3D del partido no ofrece pasar al 2D cuando va lenta");
      if(c3&&!/aviso\(/.test(c3)) f.push("si la cancha 3D falla cae al 2D sin avisar");
      let prev=null; try{ prev=localStorage.getItem("futbolini_3d_nopreg"); localStorage.removeItem("futbolini_3d_nopreg"); }catch(e){}
      try{
        const h=document.createElement("div"); let acepto=0;
        const chip=ofrecerAliviar3D(h,"prueba",function(){ acepto++; });
        if(!chip) f.push("ofrecerAliviar3D no muestra nada");
        else { const b=chip.querySelector("button"); if(b) b.click(); if(acepto!==1||h.querySelector(".a3-ofrece")) f.push("«Pasar a 2D» no hace el cambio"); }
        const ch2=ofrecerAliviar3D(h,"prueba",function(){}); if(ch2){ const bs=ch2.querySelectorAll("button"); bs[bs.length-1].click(); }
        if(ofrecerAliviar3D(h,"prueba",function(){})) f.push("después de «Seguir así» vuelve a preguntar");
      } finally { try{ if(prev==null) localStorage.removeItem("futbolini_3d_nopreg"); else localStorage.setItem("futbolini_3d_nopreg",prev); }catch(e){} }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("lento → se ofrece pasar a 2D (no se cambia solo); «Seguir así» no vuelve a preguntar; error → aviso");
    }});
}

/* 7.9125 · "Apoyar a todos dice siempre 0 lo sintieron": el conteo tiene que salir de lo que de verdad cambió */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"charla_grupal_mide", area:"motor", n:"Hablar con todo el plantel cuenta lo que de verdad cambió (y apoyar puede sonar vacío)",
    arreglo:"js/ui.js charlaGrupal() mide moral+forma antes/después · charlaGrupalTxt()",
    fn:function(){
      if(!E||!E.plantel||typeof charlaGrupal!=="function") return _dok("sin partida");
      const f=[], snap=clonarPartida(E), gu=window.guardar, av=window.aviso;
      try{
        window.guardar=function(){}; window.aviso=function(){};
        const vivos=E.plantel.filter(j=>!j.vendido&&!j.cedido);
        if(vivos.length<4) return _dok("plantel chico");
        vivos.forEach((j,i)=>{ j.moral=i%3===0?100:(i%3===1?40:65); j.forma=70; j.minutosTemporada=i%4===0?0:900; });
        if(E.flags) Object.keys(E.flags).filter(k=>/^charlaGrupal_|^charla_/.test(k)).forEach(k=>delete E.flags[k]);
        vivos.forEach(j=>{ delete j._charlaIdx; delete j._charlaAnio; });
        const antes=vivos.map(j=>(j.moral||0)+(j.forma||0));
        const r=charlaGrupal("banco")||{};
        let sube=0,baja=0,igual=0; vivos.forEach((j,i)=>{ const d=Math.round((j.moral+j.forma)-antes[i]); if(d>0) sube++; else if(d<0) baja++; else igual++; });
        if(r.sube!==sube||r.baja!==baja) f.push("el aviso dice "+r.sube+" bien / "+r.baja+" mal, pero cambiaron "+sube+" para arriba / "+baja+" para abajo");
        if(!baja) f.push("apoyar a todos nunca le cae mal a nadie (ni al que no juega): siempre «0 lo sintieron»");
        if(typeof charlaGrupalTxt==="function"&&!/lo sintieron/.test(charlaGrupalTxt(r))) f.push("el texto del resultado no dice cuántos lo sintieron");
      } catch(e){ f.push("explotó: "+e.message); }
      finally { window.guardar=gu; window.aviso=av; restaurarPartida(snap); }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("cuenta lo que cambió de verdad; al que no juega el apoyo le suena vacío");
    }});
}

/* 7.9125 · "el patrimonio desapareció de Vida": se ve el panel, el resumen de arriba lo dice, y el salto "Ir a" no lo
   deja escondido bajo la barra fija. (vida_patrimonio revisa la plata; esto revisa que se VEA.) */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"vida_patrimonio_visible", area:"interfaz", n:"Vida: el patrimonio se ve (panel, resumen de arriba y salto sin quedar bajo la barra)",
    arreglo:"js/vida-real.js panelPatrimonio() · js/vida-hoy.js chip 💎 de Tu vida hoy · css/pulido.css #vista section.panel{scroll-margin-top}",
    fn:function(){
      if(!E||!E.perfil) return _dok("sin partida");
      const f=[], secPrev=SEC;
      try{
        SEC="vida"; render();
        const v=document.getElementById("vista");
        const pan=[...v.querySelectorAll("section.panel")].find(p=>/Patrimonio/.test((p.querySelector(".cab")||{}).textContent||""));
        if(!pan) f.push("no hay panel de Patrimonio en Vida");
        else {
          if(!/Patrimonio total/.test(pan.textContent)) f.push("el panel no muestra el patrimonio total");
          const mt=parseFloat(getComputedStyle(pan).scrollMarginTop)||0, bar=document.querySelector(".barra,#barra,header");
          const alto=bar?bar.getBoundingClientRect().height:0;
          if(alto>0&&mt<alto-2) f.push("al saltar a Patrimonio la cabecera queda bajo la barra fija ("+Math.round(mt)+" px de margen, barra de "+Math.round(alto)+")");
        }
        const hoy=v.querySelector(".vida-hoy");
        if(hoy&&!/patrimonio/i.test((hoy.querySelector(".vh-chips")||{}).textContent||"")) f.push("«Tu vida hoy» no dice tu patrimonio (solo el bolsillo)");
        if(hoy&&!/Patrimonio/.test((hoy.querySelector(".vh-nav")||{}).textContent||"")) f.push("los accesos de Vida no llevan a Patrimonio");
      } catch(e){ f.push("explotó: "+e.message); }
      finally { SEC=secPrev; try{ render(); }catch(e){} }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("panel, resumen 💎 y salto visibles");
    }});
}

/* 7.9125 · "Quilín sale con Colchagua": la carta del Consejo de Presidentes / reparto de la TV se colaba a la Segunda
   (y a la AFA y a 1925) porque los eventos generados (data-proc.js) no pasaban por decisionCabeEnClub. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"anfp_no_se_fuga", area:"contenido", n:"El Consejo de Presidentes y la TV de la ANFP no le llegan a quien no vota (Segunda, AFA, 1925)",
    arreglo:"js/data-caza-97.js decisionCabeEnClub() (bloque Segunda) · js/data-proc.js generarDecisionProc/sembrarDecisionProcDeCategoria pasan el filtro",
    fn:function(){
      if(!E||typeof decisionCabeEnClub!=="function"||typeof DEC_PROC==="undefined") return _dok("sin partida");
      const f=[], snap=clonarPartida(E), gu=window.guardar;
      const fuga=(eti,blob)=>{ const b=String(blob).toLowerCase();
        if(eti==="seg"&&/consejo de presidentes|reparto de (la )?tv|contrato de (la )?televisi|derechos de (la )?transmisi/.test(b)) return true;
        if(eti!=="seg"&&/quil[ií]n|\banfp\b/.test(b)) return true; return false; };
      try{
        window.guardar=function(){};
        [["CLC",2026,{categoria:"C"},"seg"],["RIV",2026,{categoria:"ARG"},"afa"],["CC",1925,null,"1925"]].forEach(c=>{
          try{ E=null; nuevaPartida(c[0],c[1],"historico",c[2]||undefined); }catch(e){ return; }
          if(!E) return;
          const malas=decisionesDisponibles().filter(d=>fuga(c[3],JSON.stringify(d))).map(d=>d.id);
          if(malas.length) f.push(c[0]+" "+c[1]+": cartas de la ANFP que no le tocan: "+malas.slice(0,4).join(", "));
          let n=0; for(let i=0;i<120;i++){ const d=generarDecisionProc(); if(d&&fuga(c[3],JSON.stringify(d))){ n++; if(n===1) f.push(c[0]+" "+c[1]+": evento generado «"+(d.t||"?")+"» no le toca"); } }
        });
      } catch(e){ f.push("explotó: "+e.message); }
      finally { window.guardar=gu; restaurarPartida(snap); }
      return f.length?_dmal(f.length+" problema(s)",f):_dok("Segunda, AFA y 1925 sin Consejo de Presidentes ni TV de la ANFP (120 eventos generados por caso)");
    }});
}

/* 7.9126 · cancha 3D reconstruida: el remate tiene física (bajo el travesaño y entre los palos si va al arco; al lado o
   por arriba si no, con saque de arco), el arquero se tira y la retiene, la escena se REUSA entre repintados (antes se
   rearmaba entera en cada gol/entretiempo: un tirón cada vez) y dibuja barato (todo instanciado). */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"cancha3d_fisica_rinde", area:"interfaz", n:"Cancha 3D: remates con física, arquero que ataja y escena que se reusa y dibuja barato",
    arreglo:"js/cancha.js _cvDecidir/_cvJuego (zFin, afuera, saque, atajada) · js/cancha3d.js montarCancha3D (reuso), _c3dPiezas (instanciado), _c3dSincronizar (arquero)",
    fn:function(){
      const f=[], det=[];
      if(typeof _cvNuevoEstado!=="function"||typeof _cvDecidir!=="function") return _dmal("falta la simulación de cancha.js");
      /* 1) física del remate, sobre una simulación aparte */
      let al=0, afu=0, malosAl=0, malosAf=0, saque=0, retenida=0, rapidos=0;
      for(let n=0;n<160;n++){
        const st=_cvNuevoEstado(null), del=st.jug.findIndex(p=>p.mio&&p.rol==="fwd");
        st.jug[del].x=0.86; st.jug[del].y=0.5; st.own=del; st.ball.x=0.87; st.ball.y=0.5;
        const r=Math.random; let k=0; Math.random=function(){ k++; return k===1?0.05:r(); };
        try{ _cvDecidir(st,null); }finally{ Math.random=r; }
        const q=st.pase; if(!q||!q.tiro){ f.push("forzando un remate no sale tiro"); break; }
        const altoM=(q.zFin||0)*11, ladoM=Math.abs(q.y1-0.5)*68;
        if(q.afuera){ afu++; if(altoM<=2.44&&ladoM<=3.66) malosAf++; }
        else { al++; if(altoM>2.3||ladoM>3.66) malosAl++; }
        if(q.dur<0.4) rapidos++;
        for(let i=0;i<120&&(st.pase||st.saque);i++) _cvStep(null,0.02,st);
        if(q.afuera&&(st.ultimaSalida==="arco"||st.ultimaSalida==="corner")) saque++;   /* 7.9127 · con física: saque de arco o córner */
        if(!q.afuera&&(st.ultimoRemate==="atajada"||st.ultimoRemate==="rechazo"||(st.own>=0&&st.jug[st.own].rol==="gk"))) retenida++;
      }
      if(rapidos) f.push(rapidos+" remate(s) llegan en menos de 0,4 s: el arquero no alcanza ni a moverse");
      if(malosAl) f.push(malosAl+" remate(s) «al arco» van por arriba del travesaño o fuera de los palos");
      if(malosAf) f.push(malosAf+" remate(s) «afuera» entran por el arco (no van ni al lado ni por arriba)");
      if(afu&&saque<afu*0.9) f.push("después de un remate afuera no hay saque de arco ("+saque+" de "+afu+")");
      if(al&&retenida<al*0.9) f.push("el arquero no ataja ni rechaza los tiros al arco ("+retenida+" de "+al+")");
      det.push(al+" al arco · "+afu+" afuera · "+saque+" saques de arco");
      /* 2) la escena 3D (solo si hay WebGL y three.js cargado) */
      if(typeof THREE!=="undefined"&&typeof cancha3dSoportado==="function"&&cancha3dSoportado()&&typeof montarCancha3D==="function"&&E){
        const host=document.createElement("div"); host.style.cssText="position:fixed;left:-9999px;top:0;width:480px;height:270px"; document.body.appendChild(host);
        const prevEst=C3D.est, stPrev=(typeof _cvSt!=="undefined")?_cvSt:null, P={part:{local:true,rivalId:"UCH"}, gl:0, gv:0, min:10};
        try{
          if(prevEst) C3D.est=null;
          const est=montarCancha3D(host,P);
          if(!est){ f.push("montarCancha3D no arma la escena con WebGL disponible"); }
          else {
            const n0=C3D.montajes;
            const host2=document.createElement("div"); host2.style.cssText=host.style.cssText; document.body.appendChild(host2);
            montarCancha3D(host2,P);
            if(typeof C3D.montajes!=="number"||C3D.montajes!==n0) f.push("repintar el partido rearma la escena 3D entera (debería reusarse)");
            if(est.canvas.parentNode!==host2) f.push("al repintar, el 3D no se muda al contenedor nuevo");
            est.renderer.info.reset(); est.renderer.render(est.scene,est.camGL);
            const calls=est.renderer.info.render.calls; det.push(calls+" llamadas de dibujo");
            if(calls>70) f.push("la cancha 3D hace "+calls+" llamadas de dibujo por cuadro (tope 70): algo dejó de estar instanciado");
            /* arquero: se tira con el remate y la retiene */
            const S=_cvSt, gi=S.jug.findIndex(p=>!p.mio&&p.rol==="gk"), g=S.jug[gi];
            S.pase={x0:0.8,y0:0.5,x1:0.985,y1:0.54,t:0.3,dur:0.6,to:gi,tiro:true,zFin:0.1}; g._dive=0.8;
            _c3dSincronizar(est,0.016);
            const m=new THREE.Matrix4(), q=new THREE.Quaternion(), pos=new THREE.Vector3(), sc=new THREE.Vector3();
            est.piezas.torso.getMatrixAt(gi,m); m.decompose(pos,q,sc);
            const inclinado=Math.abs(new THREE.Euler().setFromQuaternion(q,"YXZ").z)>0.4;
            if(!inclinado) f.push("con el remate encima el arquero no se tira (queda parado: «se congela»)");
            S.pase=null; g._dive=0; S.own=gi; S.atajada={gk:gi,t:1,z:0.1};
            _c3dSincronizar(est,0.016);
            if(est.bola.position.y<0.6) f.push("el arquero ataja pero la pelota queda en el pasto, no en sus manos");
            host2.remove();
          }
        } catch(e){ f.push("el 3D explotó: "+e.message); }
        finally {
          /* deja el partido en vivo como estaba: su escena 3D y su simulación (el doctor puede correr en medio de un partido) */
          if(C3D.est!==prevEst) detenerCancha3D();
          host.remove(); _cvSt=stPrev; C3D.est=prevEst;
          if(prevEst&&prevEst.canvas.isConnected&&!prevEst.raf){ prevEst.ultT=performance.now(); prevEst.raf=requestAnimationFrame(t=>_c3dCuadro(prevEst,t)); }
        }
      } else det.push("sin WebGL o three.js acá: solo se revisó la simulación");
      return f.length?_dmal(f.length+" problema(s)",f.concat(det)):_dok(det.join(" · "));
    }});
}

/* 7.9126 · balón parado estilo Score Hero: en PC se MANTIENE Espacio para cargar la barra y al soltar se patea con esa
   potencia (antes Espacio pateaba al tiro con la potencia del botón); en el celu la potencia es la velocidad del dedo. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"barra_potencia", area:"interfaz", n:"Balón parado: mantener Espacio carga la barra de potencia y soltar patea con esa potencia",
    arreglo:"js/arco3d.js _a3Teclado (Espacio → _a3CargaEmpieza) + keyup _a3CargaSuelta · efectoConPotencia · CSS .a3-pot",
    fn:function(){
      const f=[];
      if(typeof _a3CargaEmpieza!=="function"||typeof _a3CargaSuelta!=="function") return _dmal("falta la carga con Espacio (_a3CargaEmpieza/_a3CargaSuelta)");
      const src=(typeof _docFuente==="function")?_docFuente(_a3Teclado):String(_a3Teclado);
      if(!/_a3CargaEmpieza/.test(src)) f.push("Espacio patea al tiro en vez de cargar la potencia");
      if(typeof efectoConPotencia!=="function") f.push("falta efectoConPotencia");
      else {
        if(efectoConPotencia({},0.15).efecto!=="colocado") f.push("un toque corto no sale colocado");
        if(efectoConPotencia({},0.75).efecto!=="potente") f.push("cargar a 3/4 no sale potente");
        if(!efectoConPotencia({},0.97).pasado) f.push("cargar a tope no eleva el tiro (no hay riesgo en pasarse)");
      }
      if(!document._a3Teclado) f.push("el teclado del balón parado no está escuchando");
      return f.length?_dmal(f.length+" problema(s)",f):_dok("toque = colocado · ¾ = potente · a tope = se eleva; en el celu, la velocidad del dedo");
    }});
}

/* 7.9127 · "faltan equipos en las tablas": en la Segunda (y Argentina/2006) tus partidos traen fase y la tabla los
   descartaba: tu club salía sin forma ni resultados en su ficha. Cada club de la liga del jugador tiene que tener su
   forma si ya jugó. */
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"tabla_forma_propia", area:"interfaz", n:"Tablas: tu club tiene su forma y sus resultados como todos (también en la Segunda)",
    arreglo:"js/calendario-sofa.js _csPartidosEquipo (filtro de fase y fxRonda)",
    fn:function(){
      if(!E||!E.mundo||!E.mundo.ligas||typeof _csForma!=="function"||typeof _csLigaDe!=="function") return _dok("sin mundo de ligas en esta época");
      const key=_csLigaDe(E.club); if(!key) return _dok("tu liga no está en el mundo de esta época");
      const jugados=(E.calendario||[]).filter(p=>p&&p.tipo==="liga"&&p.jugado&&!(p.fase&&/liguilla|playoff|final|semi|cuartos|octavos/i.test(p.fase))).length;
      if(!jugados) return _dok("todavía no juegas partidos de liga");
      const f=_csForma(E.club);
      if(!f.length) return _dmal("jugaste "+jugados+" partido(s) de liga y tu club sale sin forma en la tabla");
      return _dok("tu forma: "+f.join(" ")+" ("+jugados+" jugados)");
    }});
}

/* 7.9127 · física realista de la pelota (pedido del autor: "física, gravedad y toques realistas"). Juega 2 minutos de
   la simulación de la cancha en una copia aparte y mide: nadie corre a más de ~9,8 m/s, la pelota no se teletransporta
   ni pasa de ~36 m/s, pica cuando cae, nunca queda muerta sin que nadie la vaya a buscar, y no hay números rotos. */
function devFisicaCancha(seg){
  const st=_cvNuevoEstado(null), dt=1/30, N=Math.round(30*(seg||120));
  const m={pases:0,botes:0,maxZ:0,maxJug:0,maxBola:0,teleport:0,nan:0,muerta:0,salidas:0};
  let prevB={x:st.ball.x,y:st.ball.y}, prevSaque=null, run=0, prevPase=null; const pos=st.jug.map(p=>({x:p.x,y:p.y}));
  for(let i=0;i<N;i++){
    _cvStep(null,dt,st);
    const b=st.ball, reanudo=prevSaque&&!st.saque; if(st.saque&&st.saque!==prevSaque) m.salidas++; prevSaque=st.saque;
    if(st.pase&&st.pase!==prevPase) m.pases++; prevPase=st.pase;
    if(![b.x,b.y,b.z].every(isFinite)){ m.nan++; break; }
    m.maxZ=Math.max(m.maxZ,b.z*11);
    const vb=Math.hypot((b.x-prevB.x)*105,(b.y-prevB.y)*68)/dt; prevB={x:b.x,y:b.y};
    if(!st.saque&&!reanudo&&!st.seq){ m.maxBola=Math.max(m.maxBola,vb); if(vb>45) m.teleport++; }
    st.jug.forEach((p,k)=>{ const v=Math.hypot((p.x-pos[k].x)*105,(p.y-pos[k].y)*68)/dt; if(!st.saque&&!reanudo) m.maxJug=Math.max(m.maxJug,v); pos[k]={x:p.x,y:p.y}; });
    const libre=st.own<0&&!st.saque, quieta=Math.hypot(b.vx||0,b.vy||0)<0.3;
    if(libre&&quieta&&!(st.persigue&&st.persigue.length)){ run++; m.muerta=Math.max(m.muerta,run*dt); } else run=0;
  }
  m.botes=st.botes||0;
  return m;
}
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"fisica_partido", area:"motor", n:"Física de la cancha: velocidades humanas, pelota que vuela, pica y rueda, sin teletransportes",
    arreglo:"js/cancha.js CV_FIS, _cvFisicaPelota, _cvPasar (patada raso/elevada), _cvControlar, _cvSalida/_cvReanudar, _cvMover (m/s), con dueño: tope 12 m/s al traer la pelota",
    fn:function(){
      if(typeof _cvNuevoEstado!=="function"||typeof _cvStep!=="function") return _dmal("falta la simulación de cancha.js");
      const m=devFisicaCancha(360), f=[];   /* 6 min: con 2 el arquero que chupaba la pelota salía 1 de cada 3 veces */
      if(m.nan) f.push("la simulación se rompe (números NaN)");
      if(m.maxJug>9.8) f.push("un jugador corre a "+m.maxJug.toFixed(1)+" m/s (un velocista de fútbol llega a ~9)");
      if(m.teleport) f.push("la pelota se teletransporta "+m.teleport+" vez/veces (más de 45 m/s de un cuadro a otro)");
      if(m.maxBola>36) f.push("la pelota va a "+m.maxBola.toFixed(1)+" m/s (un remate fuerte ronda 30)");
      if(m.botes<4) f.push("en 6 minutos la pelota casi no pica ("+m.botes+" botes): no hay balones por arriba o no cae con gravedad");
      if(m.muerta>3) f.push("la pelota queda muerta "+m.muerta.toFixed(1)+" s sin que nadie la vaya a buscar");
      if(m.pases<90) f.push("en 6 minutos hay solo "+m.pases+" pases/remates: el juego se traba");
      const txt="6 min: "+m.pases+" pases · "+m.botes+" botes · alto máx "+m.maxZ.toFixed(1)+" m · jugador máx "+m.maxJug.toFixed(1)+" m/s · pelota máx "+m.maxBola.toFixed(1)+" m/s · "+m.salidas+" salidas";
      return f.length?_dmal(f.length+" problema(s)",f.concat([txt])):_dok(txt);
    }});
}
/* 7.9127 · balón parado dentro de la cancha 3D (bp3d.js): mismas probabilidades que el minijuego de siempre,
   mira bien orientada, barrera física con la misma parábola que se ve, y un repintado no abre la jugada dos veces */
function _docBp3dEnvuelto(n){
  let f=typeof window!=="undefined"?window[n]:null;
  for(let i=0;f&&i<6;i++){ if(f._bp3d) return f; f=f._orig; }
  return null;
}
function devBp3dLey(N){
  N=N||400;
  const P={iner:{}}, ARQ={n:"arq",nivel:72}, pat={n:"pat",nivel:72,rasgos:[]}, Z=BP3D.ARCO.z, m={pen:0,penN:0,bajo:0,alto:0,cor:0,corN:0};
  for(let i=0;i<N;i++){
    const jp={tipo:"penal",P:P,ARQ:ARQ,pat:pat,bola:{x:0,z:Z-11,lado:1},mira:{x:(Math.random()*2-1)*3.3,y:0.15+Math.random()*2.1}};
    const o=_bpResolver(jp,"colocado"); m.penN++; if(o.res==="gol") m.pen++;
    /* tiro libre de frente a 20 m: rasante contra la barrera vs por arriba de ella */
    const tb={x:0,z:Z-20,lado:1}, mb={tipo:"tl",P:P,ARQ:ARQ,pat:pat,bola:tb,mira:{x:0.4+Math.random()*0.4,y:0.5+Math.random()*0.4}};
    if(_bpResolver(mb,"colocado").res==="barrera") m.bajo++;
    const ma={tipo:"tl",P:P,ARQ:ARQ,pat:pat,bola:tb,mira:{x:0.4+Math.random()*0.4,y:2.15+Math.random()*0.15}};
    if(_bpResolver(ma,"colocado").res==="barrera") m.alto++;
    const jc={tipo:"corner",P:P,ARQ:ARQ,pat:pat,cabeceador:pat,bola:{x:33.6,z:Z-0.6,lado:1},mira:{x:(Math.random()*2-1)*4,z:Z-6-Math.random()*6}};
    const c=_bpResolver(jc,"colocado"); m.corN++; if(c.res==="gol") m.cor++;
  }
  return m;
}
if(typeof devDoctorRegistrar==="function"){
  devDoctorRegistrar({id:"bp3d_misma_ley", area:"interfaz", n:"Penal, tiro libre y córner en la cancha 3D: misma ley que el minijuego, mira orientada, barrera física, sin jugadas dobles",
    arreglo:"js/bp3d.js (bp3dALegado, _bpResolver, _bpVuelo, envolver: BP3D.activo.P===P) · js/ui-partido.js pasoEnVivo (el reloj espera con BP3D.activo)",
    fn:function(){
      if(typeof BP3D==="undefined"||typeof _bpResolver!=="function") return _dmal("falta js/bp3d.js en index.html");
      const f=[];
      ["minijuegoPenal","minijuegoTiroLibre","minijuegoCorner"].forEach(n=>{ const w=_docBp3dEnvuelto(n);
        if(!w) f.push(n+" no pasa por la cancha 3D (falta el envoltorio de bp3d.js)");
        else if(String(w).indexOf("BP3D.activo.P===P")<0) f.push(n+": un repintado durante la jugada abre otra encima (el gol contaba doble)"); });
      if(typeof _bpCerrar==="function"&&!/onRes!=="function"\)\{[^}]*reanudarPronto/.test(String(_bpCerrar))) f.push("_bpCerrar reanuda el partido también en la tanda: se patean dos penales seguidos");
      if(typeof pasoEnVivo==="function"&&String(pasoEnVivo).indexOf("BP3D.activo")<0) f.push("pasoEnVivo no espera al balón parado 3D: el reloj corre mientras pateas");
      /* la mira: lo que ves a la izquierda es la izquierda del arco de siempre */
      const zi=penZona(bp3dALegado(2.8,0.6).x,bp3dALegado(2.8,0.6).y), zd=penZona(bp3dALegado(-2.8,0.6).x,bp3dALegado(-2.8,0.6).y), zc=penZona(bp3dALegado(0,1.9).x,bp3dALegado(0,1.9).y);
      if(zi.tercio!=="izq"||zd.tercio!=="der"||zc.tercio!=="centro"||zc.alt!=="alto") f.push("la mira está dada vuelta: izquierda 3D → "+zi.tercio+", derecha → "+zd.tercio+", centro alto → "+zc.tercio+"/"+zc.alt);
      const ida=bp3dDesdeLegado(bp3dALegado(1.7,1.1).x,bp3dALegado(1.7,1.1).y);
      if(Math.abs(ida.x-1.7)>0.01||Math.abs(ida.y-1.1)>0.01) f.push("bp3dDesdeLegado no deshace bp3dALegado");
      const m=devBp3dLey(400), pen=m.pen/m.penN, cor=m.cor/m.corN;
      if(pen<0.55||pen>0.93) f.push("penales 3D: "+Math.round(pen*100)+"% de gol (la ley de siempre da ~70–85%)");
      if(m.bajo<360) f.push("un tiro libre rasante al medio pasa la barrera "+(400-m.bajo)+"/400 veces");
      if(m.alto>40) f.push("un tiro libre por arriba de la barrera (2,2 m) la pega "+m.alto+"/400 veces: la barrera no usa la parábola");
      if(cor>0.35) f.push("córner 3D: "+Math.round(cor*100)+"% de gol (cornerResolver da ~3–15%, como el fútbol real)");
      const txt="penal "+Math.round(pen*100)+"% gol · TL rasante "+m.bajo+"/400 a la barrera, por arriba "+m.alto+"/400 · córner "+Math.round(cor*100)+"% gol";
      return f.length?_dmal(f.length+" problema(s)",f.concat([txt])):_dok(txt);
    }});
}
