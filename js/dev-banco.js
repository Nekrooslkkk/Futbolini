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
