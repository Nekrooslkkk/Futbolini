"use strict";
/* ============================================================
   FUTBOLINI · mundo.js — 7.9035 · UN SOLO UNIVERSO (reconstruido por Claude)

   Antes (7.75–7.9034) había DOS universos:
   - mundo.js simulaba "el país" con listas fijas de 2026 y resultados al
     azar, y copiaba los partidos del jugador buscando "cualquier partido
     jugado contra ese rival" (la ida volvía a contar en la vuelta).
   - las copas del jugador (data-32, data-formato2026) calculaban grupos,
     clasificados y rivales con OTRA estimación (y distinta en cada consulta).
   Resultado, reportado por el autor jugando con Rangers: Wanderers y Cobreloa
   ascendían y el Calendario los mostraba de nuevo en la B; la Copa de la Liga
   decía que no jugaste ningún partido (y te eliminaba del grupo que ganaste);
   la liguilla de la B nunca se jugaba si no eras vos (subía el 2° sin jugar).

   Ahora hay UN registro:
   - Ligas: la composición VIGENTE (E.ligaMod, con ascensos y descensos).
   - Copa Chile y Copa de la Liga: un sorteo (el real 2026; desde 2027 lo
     sortea el juego) que usan el país Y tu calendario. Fixture con fechas;
     cada partido se juega una vez, se guarda y todas las pantallas leen eso.
   - Tus partidos se anotan en ese mismo registro (tu marcador manda).
   - Octavos/semis/final salen del cuadro del juego: tus rivales son los
     que ganaron sus llaves, no una estimación por fuerza.
   - Liguilla de la B: cuadro completo (cuartos, semis, final ida y vuelta).
     El que sube es el que la gana.
   - Los ascensos de las divisiones que no juegas salen de SUS tablas.
   Todo con la misma física (_golesSimulados) y semillas estables: el mismo
   partido da el mismo resultado aunque el registro se rearme.
   ============================================================ */

function clubMundo(id){
  if(!id) return null;
  if(typeof CLUB_POR_ID!=="undefined" && CLUB_POR_ID[id]) return CLUB_POR_ID[id];
  if(typeof clubLookup==="function"){ const c=clubLookup(id); if(c) return c; }
  const listas=[];
  if(typeof LIGA_2026!=="undefined") listas.push(LIGA_2026);
  if(typeof LIGA_B_2026!=="undefined") listas.push(LIGA_B_2026);
  if(typeof LIGA_C_2026!=="undefined") listas.push(LIGA_C_2026);
  if(typeof LIGA_ARG_2026!=="undefined") listas.push(LIGA_ARG_2026);
  if(typeof LIGA91!=="undefined") listas.push(LIGA91);
  for(let i=0;i<listas.length;i++){
    for(let j=0;j<listas[i].length;j++) if(listas[i][j].id===id) return listas[i][j];
  }
  if(typeof clubEnLigasRegistradas==="function") return clubEnLigasRegistradas(id);
  return null;
}
function _nomClub(id){ const c=clubMundo(id); return c?(c.c||c.n):id; }
function _fila0(){ return {pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; }
/* semilla de ESTA partida: el país es reproducible dentro de tu partida (el mismo
   partido da el mismo resultado aunque el registro se rearme), pero cada partida nueva
   tiene su propio campeonato. Sin esto, Primera 2026 terminaba igual en todas. */
function _mSemillaPartida(){
  if(!E) return "";
  if(!E.mundoSemilla) E.mundoSemilla=String(Math.floor(Math.random()*1e9)+1);
  return E.mundoSemilla;
}
function _golesM(a,b,clave){
  if(clave) clave=clave+"|"+_mSemillaPartida();
  if(typeof _golesSimulados==="function") return _golesSimulados(a||{fuerza:55,id:"x"}, b||{fuerza:55,id:"y"}, clave);
  const d=(((a&&a.fuerza)||55)-((b&&b.fuerza)||55))/20;
  const lamH=Math.max(0.3,1.4+d*0.8), lamA=Math.max(0.3,1.1-d*0.8);
  const po=typeof _poissonGoles==="function"?_poissonGoles:(l=>Math.min(6,Math.max(0,Math.round(l+Math.random()-0.4))));
  return [po(lamH), po(lamA)];
}
function _aplicarTabla(tab, idA, idB, ga, gb){
  if(!tab[idA]) tab[idA]=_fila0();
  if(!tab[idB]) tab[idB]=_fila0();
  const ta=tab[idA], tb=tab[idB], pv=(typeof puntosVictoria==="function")?puntosVictoria():3;
  ta.pj++; tb.pj++; ta.gf+=ga; ta.gc+=gb; tb.gf+=gb; tb.gc+=ga;
  if(ga>gb){ ta.pg++; ta.pts+=pv; tb.pp++; }
  else if(ga<gb){ tb.pg++; tb.pts+=pv; ta.pp++; }
  else { ta.pe++; tb.pe++; ta.pts++; tb.pts++; }
}
function _ordTabla(tab, ids){
  return (ids||Object.keys(tab)).map(id=>{
    const t=tab[id]||_fila0();
    const c=clubMundo(id);
    return Object.assign({id:id, n:c?c.n:id}, t);
  }).sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf||((clubMundo(b.id)||{}).fuerza||0)-((clubMundo(a.id)||{}).fuerza||0));
}

/* ---------- fechas del año (mes*100+día) y azar estable ---------- */
function _mfn(f){ return f?((f.m||1)*100+(f.d||1)):0; }
function _mSumarDias(f, n){
  const d=new Date(2026, (f.m||1)-1, (f.d||1)+n);
  return {m:d.getMonth()+1, d:d.getDate()};
}
/* mismo partido = mismo resultado aunque se recalcule */
function _mAzar(clave){
  if(typeof azarFijo==="function"&&typeof semilla==="function"){
    const sal=(typeof salSim==="function")?salSim():"";
    return azarFijo(semilla(String(clave)+"|"+((E&&E.anio)||0)+"|"+sal+"|"+_mSemillaPartida()));
  }
  return Math.random;
}
function _mEsMia(t){ return !!(E&&E.club&&t&&(t.a===E.club||t.b===E.club)); }

function _ligaKeyJugador(){
  if(!E) return null;
  if(E.eraBase==="arg2026"){
    const z=(typeof zonaArgDe==="function")?zonaArgDe(E.club):null;
    if(z==="A") return "arg2026A";
    if(z==="B") return "arg2026B";
    return "arg2026A";
  }
  if(E.eraBase==="2026c"){
    const z=(typeof zonaSegDe==="function")?zonaSegDe(E.club):(typeof clubZona==="function"?clubZona(E.club):"sur");
    return z==="norte"?"2026cN":"2026cS";
  }
  if(E.eraBase==="2026b") return "2026b";
  if(E.eraBase===2026||E.eraBase==="2026") return "2026";
  if(E.eraBase && typeof LIGAS==="object" && LIGAS[E.eraBase]) return String(E.eraBase);
  return null;
}
/* composición VIGENTE de cada liga: con ascensos y descensos (E.ligaMod), no la lista de 2026 */
function _idsLigaVigente(key){
  const mod=(E&&E.ligaMod)||null;
  if(key==="2026"){
    if(mod&&mod[2026]) return mod[2026].slice();
    return (typeof LIGA_2026!=="undefined")?LIGA_2026.map(c=>c.id):[];
  }
  if(key==="2026b"){
    if(mod&&mod["2026b"]) return mod["2026b"].slice();
    return (typeof LIGA_B_2026!=="undefined")?LIGA_B_2026.map(c=>c.id):[];
  }
  if(key==="2026cN"||key==="2026cS"){
    const z=key==="2026cN"?"norte":"sur";
    const base=(mod&&mod["2026c"])?mod["2026c"].slice():((typeof LIGA_C_2026!=="undefined")?LIGA_C_2026.map(c=>c.id):[]);
    return base.filter(id=>{
      const zz=(typeof zonaSegDe==="function")?zonaSegDe(id):null;
      if(zz) return zz===z;
      const c=clubMundo(id); return c&&c.z===z;
    });
  }
  return null;
}
function _clubsDeLiga(key){
  const vig=_idsLigaVigente(key);
  if(vig) return vig.map(id=>clubMundo(id)).filter(Boolean);
  if(key==="arg2026" && typeof LIGA_ARG_2026!=="undefined") return LIGA_ARG_2026.slice();
  if((key==="arg2026A"||key==="arg2026B") && typeof LIGA_ARG_2026!=="undefined"){
    const z=key==="arg2026A"?"A":"B";
    return LIGA_ARG_2026.filter(c=>c.z===z);
  }
  if(typeof LIGAS==="object" && LIGAS[key] && LIGAS[key].length) return LIGAS[key].slice();
  return [];
}
function _fxLiga(clubs){
  if(typeof fixturesLiga==="function") return fixturesLiga(clubs);
  return [];
}

/* ---------- sorteos: los mismos para el país y para tu calendario ---------- */
function _mBarajar(arr, rr){
  const a=arr.slice();
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(rr()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; }
  return a;
}
/* Copa Chile: 2026 = grupos reales (ANFP). Desde 2027 el juego sortea 8 grupos de 4
   (2 de Primera + 2 de la B), con la composición vigente. */
function mundoSorteoCopaChile(anio){
  anio=anio||((E&&E.anio)||2026);
  if(anio===2026 && typeof COPA_CHILE_GRUPOS_2026==="object"){
    const out={}; Object.keys(COPA_CHILE_GRUPOS_2026).forEach(L=>{ out[L]=COPA_CHILE_GRUPOS_2026[L].slice(); }); return out;
  }
  const P=_idsLigaVigente("2026")||[], B=_idsLigaVigente("2026b")||[];
  if(P.length<16||B.length<16) return {};
  const rr=_mAzar("sorteoCCH"+anio);
  const p=_mBarajar(P,rr), b=_mBarajar(B,rr), out={};
  "ABCDEFGH".split("").forEach((L,i)=>{ out[L]=[p[2*i],p[2*i+1],b[2*i],b[2*i+1]]; });
  return out;
}
/* Copa de la Liga: solo Primera. 2026 real; desde 2027 sorteo de 4 grupos de 4. */
function mundoSorteoCopaLiga(anio){
  anio=anio||((E&&E.anio)||2026);
  if(anio===2026 && typeof COPA_LIGA_GRUPOS_2026==="object"){
    const out={}; Object.keys(COPA_LIGA_GRUPOS_2026).forEach(L=>{ out[L]=COPA_LIGA_GRUPOS_2026[L].slice(); }); return out;
  }
  const P=_idsLigaVigente("2026")||[];
  if(P.length<16) return {};
  const rr=_mAzar("sorteoCLI"+anio);
  const p=_mBarajar(P,rr), out={};
  "ABCD".split("").forEach((L,i)=>{ out[L]=p.slice(4*i,4*i+4); });
  return out;
}
function mundoGrupoDe(tor, clubId, anio){
  const s=tor==="chile"?mundoSorteoCopaChile(anio):mundoSorteoCopaLiga(anio);
  for(const L in s){ if(s[L].indexOf(clubId)>=0) return {letra:L, ids:s[L].slice()}; }
  return null;
}

/* fixture canónico de un grupo de 4 (ida y vuelta, 6 fechas, dos partidos por fecha).
   Cada par ordenado (local, visita) aparece UNA vez: así un resultado se ubica sin dudas. */
function _fxGrupo4(ids){
  if(!ids||ids.length<4) return [];
  const a=ids[0], b=ids[1], c=ids[2], d=ids[3];
  return [
    [[a,b],[c,d]], [[c,a],[b,d]], [[a,d],[b,c]],
    [[b,a],[d,c]], [[a,c],[d,b]], [[d,a],[c,b]]
  ];
}
/* compatibilidad: otros archivos llamaban _rrGrupo */
function _rrGrupo(ids){ return _fxGrupo4(ids); }

function mundoInit(){
  if(!E) return;
  const anio=E.anio||2026;
  if(typeof initLigaMod==="function"){ try{ initLigaMod(); }catch(e){} }
  const viejo=E.mundo;
  const M={ ver:2, anio:anio, ligas:{}, copas:{chile:{}, copaLiga:{}, lib:{}, sud:{}, arg:{}}, noticias:[], pais:[], tick:-1, ligB:null };
  /* la memoria de mundo-vivo sobrevive si el registro se rearma a mitad de año */
  if(viejo && viejo.anio===anio){ ["vida","vidaEst","vidaSem"].forEach(k=>{ if(viejo[k]!=null) M[k]=viejo[k]; }); }
  ["2026","2026b","2026cN","2026cS","arg2026A","arg2026B"].forEach(k=>{
    const clubs=_clubsDeLiga(k);
    if(!clubs.length) return;
    const tab={}; clubs.forEach(c=>tab[c.id]=_fila0());
    M.ligas[k]={ ids:clubs.map(c=>c.id), tab:tab, fx:_fxLiga(clubs), ronda:0, nom:_nomLiga(k) };
  });
  /* liga clonada / registrada del jugador */
  try{
    const propia=_ligaKeyJugador();
    if(propia && !M.ligas[propia]){
      const clubs=_clubsDeLiga(propia);
      if(clubs.length){
        const tab={}; clubs.forEach(c=>tab[c.id]=_fila0());
        const nom=(typeof ERA==="object"&&ERA[propia]&&ERA[propia].n)||propia;
        M.ligas[propia]={ ids:clubs.map(c=>c.id), tab:tab, fx:_fxLiga(clubs), ronda:0, nom:nom };
      }
    }
  }catch(e){}
  E.mundo=M;
  _mSemillaPartida();
  /* copas nacionales con el MISMO sorteo que tu calendario */
  _mArmarCopaGrupos("chile", mundoSorteoCopaChile(anio),
    (typeof COPA_CHILE_FECHAS_2026!=="undefined")?COPA_CHILE_FECHAS_2026:[{m:1,d:31},{m:2,d:8},{m:6,d:20},{m:6,d:27},{m:7,d:5},{m:8,d:12}],
    "Copa Chile");
  _mArmarCopaGrupos("copaLiga", mundoSorteoCopaLiga(anio),
    (typeof COPA_LIGA_FECHAS_2026!=="undefined")?COPA_LIGA_FECHAS_2026:[{m:3,d:21},{m:3,d:25},{m:3,d:30},{m:5,d:3},{m:5,d:10},{m:6,d:6}],
    "Copa de la Liga");
  M.copas.lib.clubs={}; M.copas.lib.partidos=[]; M.copas.lib.grupos={};
  M.copas.sud.clubs={}; M.copas.sud.partidos=[]; M.copas.sud.grupos={};
  if(typeof CONMEBOL_GRUPOS_2026==="object"){
    ["lib","sud"].forEach(tor=>{
      (CONMEBOL_GRUPOS_2026[tor]||[]).forEach(g=>{
        const tab={}; g.ids.forEach(id=>tab[id]=_fila0());
        M.copas[tor].grupos[g.letra]={ids:g.ids.slice(), tab:tab, nom:g.nom||{}, fue:g.fue||{}, chile:g.chile||[], arg:g.arg||[], res:{}};
        g.ids.forEach(id=>{
          M.copas[tor].clubs[id]=_fila0();
          M.copas[tor].clubs[id].grupo=g.letra;
        });
      });
    });
  } else {
    if(typeof LIB_GRUPOS_2026_CHILE==="object"){
      Object.keys(LIB_GRUPOS_2026_CHILE).forEach(id=>{ M.copas.lib.clubs[id]=_fila0(); M.copas.lib.clubs[id].grupo=LIB_GRUPOS_2026_CHILE[id]; });
    }
    if(typeof SUD_FASE1_2026==="object"){
      Object.keys(SUD_FASE1_2026).forEach(id=>{ M.copas.sud.clubs[id]=_fila0(); });
    }
  }
  /* Copa Argentina 2026: el mundo es uno. Chile la ve aunque no la juegue. */
  M.copas.arg={ronda:0, partidos:[], vivos:{}};
  if(typeof COPA_ARG_32_2026==="object"){
    Object.keys(COPA_ARG_32_2026).forEach(function(id){ M.copas.arg.vivos[id]=1; });
  }
  /* partida guardada con el registro viejo: lo tuyo ya jugado se vuelve a anotar */
  try{ _mMigrarJugador(); }catch(e){}
}

/* grupo de copa: fixture con fecha por partido. Si el jugador está en el grupo,
   el fixture se deriva de SU calendario (mismas fechas, misma localía). */
function _mArmarCopaGrupos(tor, sorteo, fechas, torneoNom){
  const pack=E.mundo.copas[tor]={grupos:{}, ronda:0, torneo:torneoNom, ko:null, campeon:null, sub:null};
  const letras=Object.keys(sorteo||{});
  if(!letras.length) return;
  letras.forEach(L=>{
    let ids=sorteo[L].slice();
    let fx=null, fs=null, derivado=false;
    if(E.club && ids.indexOf(E.club)>=0){
      const r=_mFxDesdeJugador(ids, torneoNom, "Grupo "+L);
      if(r){ fx=r.fx; fs=r.fechas; ids=r.ids; derivado=true; }
    }
    if(!fx){ fx=_fxGrupo4(ids); fs=fx.map((x,i)=>fechas[i]||{m:7,d:1+i}); }
    const tab={}; ids.forEach(id=>tab[id]=_fila0());
    pack.grupos[L]={ids:ids, tab:tab, fx:fx, fechas:fs, res:{}, jugador:ids.indexOf(E.club)>=0, derivado:derivado};
  });
}
function _mFxDesdeJugador(ids, torneoNom, ronda){
  const mios=(E.calendario||[]).filter(p=>p&&p.tipo==="copa"&&p.torneo===torneoNom&&p.ronda===ronda&&p.rivalId)
    .slice().sort((a,b)=>_mfn(a.f)-_mfn(b.f));
  if(mios.length!==6) return null;
  const P=E.club, orden=[P];
  mios.forEach(m=>{ if(orden.indexOf(m.rivalId)<0) orden.push(m.rivalId); });
  if(orden.length!==4 || orden.some(id=>ids.indexOf(id)<0)) return null;
  const vistos={}, fx=[], fechas=[];
  mios.forEach(m=>{
    const riv=m.rivalId, par=m.local?[P,riv]:[riv,P];
    const otros=orden.filter(x=>x!==P&&x!==riv);
    const k=otros.slice().sort().join("|");
    const o=vistos[k]?[vistos[k][1],vistos[k][0]]:[otros[0],otros[1]];
    vistos[k]=o;
    fx.push([par,o]); fechas.push({m:m.f.m, d:m.f.d});
  });
  return {ids:orden, fx:fx, fechas:fechas};
}
/* si el calendario se armó DESPUÉS del registro, el grupo se re-deriva sin perder lo jugado */
function _mResincronizarGrupo(tor){
  const pack=E&&E.mundo&&E.mundo.copas&&E.mundo.copas[tor]; if(!pack||!pack.grupos) return;
  Object.keys(pack.grupos).forEach(L=>{
    const g=pack.grupos[L];
    if(!g.jugador||g.derivado) return;
    const r=_mFxDesdeJugador(g.ids, pack.torneo, "Grupo "+L);
    if(!r) return;
    const res={};
    Object.keys(g.res).forEach(k=>{
      const p=k.split("|"), a=p[1], b=p[2];
      let md=-1;
      r.fx.forEach((m,i)=>{ if(md<0 && m.some(x=>x[0]===a&&x[1]===b)) md=i; });
      if(md>=0) res[_mKey(md,a,b)]=g.res[k];
    });
    g.fx=r.fx; g.fechas=r.fechas; g.ids=r.ids; g.res=res; g.derivado=true;
  });
}
function _mKey(md,a,b){ return md+"|"+a+"|"+b; }
function _mAnotarGrupo(pack, L, md, a, b, ga, gb, esJugador){
  const g=pack.grupos[L]; if(!g) return false;
  const k=_mKey(md,a,b);
  if(g.res[k]) return false;
  g.res[k]=[ga,gb];
  _aplicarTabla(g.tab, a, b, ga, gb);
  if(!esJugador){
    (E.mundo.pais=E.mundo.pais||[]).push({a:_nomClub(a), b:_nomClub(b), ga:ga, gb:gb,
      liga:(pack.torneo||"Copa")+" · Grupo "+L, idA:a, idB:b});
  }
  return true;
}
function mundoGrupoCompleto(tor, L){
  const pack=E&&E.mundo&&E.mundo.copas&&E.mundo.copas[tor];
  const g=pack&&pack.grupos&&pack.grupos[L]; if(!g||!g.fx) return false;
  let n=0; g.fx.forEach(md=>{ n+=md.length; });
  return Object.keys(g.res).length>=n;
}
function mundoGruposCompletos(tor){
  const pack=E&&E.mundo&&E.mundo.copas&&E.mundo.copas[tor];
  if(!pack||!pack.grupos) return false;
  const ls=Object.keys(pack.grupos);
  return ls.length>0 && ls.every(L=>mundoGrupoCompleto(tor,L));
}

/* ---------- avanzar el país hasta una fecha (lo tuyo se anota cuando lo juegas) ---------- */
function _mSimGrupos(tor, tope, forzar){
  const pack=E.mundo.copas[tor];
  if(!pack||!pack.grupos) return;
  Object.keys(pack.grupos).forEach(L=>{
    const g=pack.grupos[L];
    (g.fx||[]).forEach((md,i)=>{
      if(!forzar && _mfn(g.fechas[i])>tope) return;
      md.forEach(par=>{
        if(E.club&&(par[0]===E.club||par[1]===E.club)) return;   /* el tuyo espera a que lo juegues */
        const k=_mKey(i,par[0],par[1]); if(g.res[k]) return;
        const a=clubMundo(par[0]), b=clubMundo(par[1]); if(!a||!b) return;
        const gl=_golesM(a,b,tor+"|G"+L+"|"+i+"|"+par[0]+"|"+par[1]);
        _mAnotarGrupo(pack, L, i, par[0], par[1], gl[0], gl[1], false);
      });
    });
  });
  pack.ronda=_mRondaCopa(pack);
  if(!pack.ko && mundoGruposCompletos(tor)) _mArmarKO(tor);
}
/* partidos TUYOS de grupo que ya pasaron y no están en tu calendario (reprogramados,
   borrados, partida vieja): si los jugaste se anotan; si no existen, se simulan.
   Sin esto el grupo nunca cerraba y el cuadro del país se quedaba esperando. */
function _mRellenarVencidos(tor, tope, forzar){
  const pack=E.mundo.copas[tor]; if(!pack||!pack.grupos||!E.club) return;
  Object.keys(pack.grupos).forEach(L=>{
    const g=pack.grupos[L]; if(!g.jugador) return;
    (g.fx||[]).forEach((md,i)=>{
      if(!forzar && _mfn(g.fechas[i])>=tope) return;
      md.forEach(par=>{
        if(par[0]!==E.club&&par[1]!==E.club) return;
        const k=_mKey(i,par[0],par[1]); if(g.res[k]) return;
        const local=par[0]===E.club, riv=local?par[1]:par[0];
        const mismo=p=>p&&p.tipo==="copa"&&p.torneo===pack.torneo&&p.ronda==="Grupo "+L&&p.rivalId===riv&&!!p.local===local;
        const jug=(E.calendario||[]).find(p=>mismo(p)&&p.jugado);
        if(jug){ _mAnotarGrupo(pack,L,i,par[0],par[1], local?(jug.gf||0):(jug.gc||0), local?(jug.gc||0):(jug.gf||0), true); jug._uni=true; return; }
        if(!forzar && (E.calendario||[]).some(p=>mismo(p)&&!p.jugado)) return;   /* todavía lo vas a jugar */
        const a=clubMundo(par[0]), b=clubMundo(par[1]); if(!a||!b) return;
        const gl=_golesM(a,b,tor+"|G"+L+"|"+i+"|"+par[0]+"|"+par[1]);
        _mAnotarGrupo(pack,L,i,par[0],par[1],gl[0],gl[1],false);
      });
    });
  });
}
function mundoHasta(f){
  if(!E||!E.mundo||E.mundo.ver!==2||!f) return;
  const tope=_mfn(f);
  ["chile","copaLiga"].forEach(tor=>{
    const pack=E.mundo.copas[tor];
    if(!pack||!pack.grupos) return;
    _mRellenarVencidos(tor, tope, false);
    _mSimGrupos(tor, tope, false);
    if(pack.ko) _mJugarKOHasta(tor, tope, false);
  });
  _mLigBAuto();
  if(E.mundo.ligB) _mLigBHasta(tope, false);
}
/* todos los grupos de un torneo, jugados ya (para armar el cuadro cuando lo necesitas) */
function mundoForzarGrupos(tor){
  if(!E||!E.mundo||E.mundo.ver!==2) return;
  _mSimGrupos(tor, 0, true);
}
function _mRondaCopa(pack){
  let r=0;
  const L=Object.keys(pack.grupos||{})[0]; if(!L) return 0;
  const g=pack.grupos[L];
  (g.fx||[]).forEach((md,i)=>{ if(md.every(par=>g.res[_mKey(i,par[0],par[1])])) r=i+1; });
  return r;
}

/* ---------- eliminatorias (Copa Chile: octavos→final · Copa de la Liga: semis→final) ---------- */
const _M_KO_FECHAS={
  chile:{Octavos:[{m:9,d:22},{m:10,d:7}], Cuartos:[{m:10,d:21},{m:11,d:4}], Semifinal:[{m:11,d:18},{m:11,d:25}], FINAL:[{m:12,d:10}]},
  copaLiga:{Semifinal:[{m:7,d:8},{m:7,d:12}], FINAL:[{m:7,d:18}]}
};
const _M_KO_SEDE={ chile:"Estadio Nacional", copaLiga:"Estadio Elías Figueroa Brander" };
function _mKOFechas(tor, ronda){
  const src=(tor==="chile"&&typeof COPA_CHILE_KO_FECHAS==="object")?COPA_CHILE_KO_FECHAS:
    ((tor==="copaLiga"&&typeof COPA_LIGA_KO_FECHAS==="object")?COPA_LIGA_KO_FECHAS:null);
  return ((src&&src[ronda])||_M_KO_FECHAS[tor][ronda]).map(f=>({m:f.m,d:f.d}));
}
/* semilla de una llave: mejor posición de grupo, después puntos, diferencia y goles */
function _mSemillaDe(tor, id){
  const pack=E.mundo.copas[tor];
  for(const L in pack.grupos){
    const fil=mundoFilasCopa(tor,L), i=fil.findIndex(x=>x.id===id);
    if(i>=0) return {pos:i+1, pts:fil[i].pts, dg:fil[i].gf-fil[i].gc, gf:fil[i].gf};
  }
  return {pos:9, pts:0, dg:0, gf:0};
}
function _mMejor(tor, a, b){
  const A=_mSemillaDe(tor,a), B=_mSemillaDe(tor,b);
  if(A.pos!==B.pos) return A.pos<B.pos?a:b;
  if(A.pts!==B.pts) return A.pts>B.pts?a:b;
  if(A.dg!==B.dg) return A.dg>B.dg?a:b;
  return A.gf>=B.gf?a:b;
}
/* llave ida/vuelta: la ida en casa del peor sembrado; la vuelta, del mejor */
function _mLlave(tor, ronda, x, y, unica){
  const fs=_mKOFechas(tor, ronda);
  if(unica) return {ronda:ronda, a:x, b:y, fechas:[fs[0]], legs:[null], unica:true, sede:_M_KO_SEDE[tor], gana:null, pens:false};
  const mejor=_mMejor(tor,x,y), peor=mejor===x?y:x;
  return {ronda:ronda, a:peor, b:mejor, fechas:[fs[0], fs[1]||_mSumarDias(fs[0],14)], legs:[null,null], unica:false, gana:null, pens:false};
}
function _mArmarKO(tor){
  const pack=E.mundo.copas[tor];
  const pos=(L,n)=>{ const f=mundoFilasCopa(tor,L); return f[n-1]&&f[n-1].id; };
  const ko={rondas:{}, orden:[]};
  if(tor==="chile"){
    /* formato 2026: 1° de un grupo vs 2° del grupo pareja (A↔C, B↔D, E↔G, F↔H) */
    const cr=[["A","C"],["B","D"],["C","A"],["D","B"],["E","G"],["F","H"],["G","E"],["H","F"]];
    if(!cr.every(p=>pack.grupos[p[0]]&&pack.grupos[p[1]])) return;
    ko.orden=["Octavos","Cuartos","Semifinal","FINAL"];
    ko.rondas.Octavos=cr.map(p=>_mLlave(tor,"Octavos",pos(p[0],1),pos(p[1],2),false));
  } else {
    /* Copa de la Liga: solo el 1° de cada grupo. Semis A↔D y B↔C */
    if(!["A","B","C","D"].every(L=>pack.grupos[L])) return;
    ko.orden=["Semifinal","FINAL"];
    ko.rondas.Semifinal=[_mLlave(tor,"Semifinal",pos("A",1),pos("D",1),false), _mLlave(tor,"Semifinal",pos("B",1),pos("C",1),false)];
  }
  pack.ko=ko;
}
function _mRondaSiguiente(ko, ronda){ const i=ko.orden.indexOf(ronda); return i>=0?ko.orden[i+1]||null:null; }
/* global de una llave desde el punto de vista de "a" */
function _mGlobal(t){
  let ga=0, gb=0;
  if(t.unica){ if(t.legs[0]){ ga=t.legs[0].ga; gb=t.legs[0].gb; } return [ga,gb]; }
  if(t.legs[0]){ ga+=t.legs[0].ga; gb+=t.legs[0].gb; }               /* ida: a local */
  if(t.legs[1]){ ga+=t.legs[1].gb; gb+=t.legs[1].ga; }               /* vuelta: b local */
  return [ga,gb];
}
/* define la llave: global; si empata, penales (los tuyos los define tu tanda) */
function _mDefinirLlave(tor, t, opts){
  opts=opts||{};
  if(t.gana) return t.gana;
  if(t.legs.some(l=>!l)) return null;
  const g=_mGlobal(t);
  if(g[0]!==g[1]){ t.gana=g[0]>g[1]?t.a:t.b; return t.gana; }
  t.pens=true;
  if(opts.ganaJugador!=null){ t.gana=opts.ganaJugador; return t.gana; }
  const rr=_mAzar(tor+"|pen|"+t.ronda+"|"+t.a+"|"+t.b);
  const fa=((clubMundo(t.a)||{}).fuerza||60), fb=((clubMundo(t.b)||{}).fuerza||60);
  t.gana=(rr()<0.5+(fa-fb)*0.004)?t.a:t.b;
  return t.gana;
}
function _mJugarLeg(tor, t, i){
  if(t.legs[i]) return;
  if(_mEsMia(t)) return;                                              /* el tuyo se juega de verdad */
  const loc=(t.unica||i===0)?t.a:t.b, vis=loc===t.a?t.b:t.a;
  const ca=clubMundo(loc), cb=clubMundo(vis); if(!ca||!cb) return;
  let gl=_golesM(ca,cb,tor+"|KO|"+t.ronda+"|"+i+"|"+loc+"|"+vis);
  if(t.unica){                                                        /* cancha neutral: sin localía */
    const alt=_golesM(cb,ca,tor+"|KOn|"+t.ronda+"|"+vis+"|"+loc);
    gl=[Math.round((gl[0]+alt[1])/2), Math.round((gl[1]+alt[0])/2)];
  }
  t.legs[i]={ga:gl[0], gb:gl[1]};
  (E.mundo.pais=E.mundo.pais||[]).push({a:_nomClub(loc), b:_nomClub(vis), ga:gl[0], gb:gl[1],
    liga:((E.mundo.copas[tor]&&E.mundo.copas[tor].torneo)||"Copa")+" · "+t.ronda, idA:loc, idB:vis});
}
/* define lo que se puede y arma la ronda siguiente cuando la anterior está completa */
function _mAvanzarKO(tor){
  const pack=E.mundo.copas[tor], ko=pack&&pack.ko; if(!ko) return false;
  let cambio=false;
  for(const ronda of ko.orden){
    const lista=ko.rondas[ronda]; if(!lista) break;
    lista.forEach(t=>{ if(!t.gana && t.legs.every(Boolean) && !_mEsMia(t)){ _mDefinirLlave(tor,t); cambio=true; } });
    const sig=_mRondaSiguiente(ko, ronda);
    if(sig && !ko.rondas[sig] && lista.every(t=>t.gana)){
      const w=lista.map(t=>t.gana), nueva=[];
      for(let k=0;k<w.length;k+=2) nueva.push(_mLlave(tor, sig, w[k], w[k+1], sig==="FINAL"));
      ko.rondas[sig]=nueva; cambio=true;
    }
    if(ronda==="FINAL" && lista[0] && lista[0].gana && !pack.campeon){
      pack.campeon=lista[0].gana; pack.sub=lista[0].gana===lista[0].a?lista[0].b:lista[0].a; cambio=true;
    }
  }
  return cambio;
}
/* juega (CPU) todo lo que ya pasó; si forzar, juega la ronda entera aunque sea futura */
function _mJugarKOHasta(tor, tope, forzar){
  const pack=E.mundo.copas[tor], ko=pack&&pack.ko; if(!ko) return;
  let guard=0;
  while(guard++<10){
    let cambio=false;
    ko.orden.forEach(ronda=>{
      (ko.rondas[ronda]||[]).forEach(t=>{
        t.fechas.forEach((f,i)=>{ if(!t.legs[i] && (forzar||_mfn(f)<=tope)){ _mJugarLeg(tor,t,i); if(t.legs[i]) cambio=true; } });
      });
    });
    if(_mAvanzarKO(tor)) cambio=true;
    if(!cambio) break;
  }
}
/* cierra una ronda entera (las llaves ajenas) y arma la siguiente */
function mundoCerrarRonda(tor, ronda){
  const pack=E&&E.mundo&&E.mundo.copas&&E.mundo.copas[tor], ko=pack&&pack.ko;
  if(!ko||!ko.rondas[ronda]) return;
  ko.rondas[ronda].forEach(t=>{ t.legs.forEach((l,i)=>{ if(!l) _mJugarLeg(tor,t,i); }); });
  _mAvanzarKO(tor);
}
/* la llave del jugador en una ronda (o null) */
function mundoLlaveJugador(tor, ronda){
  const pack=E&&E.mundo&&E.mundo.copas&&E.mundo.copas[tor], ko=pack&&pack.ko;
  if(!ko||!ko.rondas[ronda]) return null;
  return ko.rondas[ronda].find(t=>_mEsMia(t))||null;
}
/* partida vieja: tu calendario ya traía un rival para esta ronda. Manda tu calendario:
   se acomoda el cuadro (intercambio de rivales) para que el país y vos digan lo mismo. */
function _mAjustarLlave(lista, rivalCal){
  if(!lista||!lista.length||!rivalCal||!E.club) return;
  const limpiar=t=>{ if(!t.gana){ t.legs=t.legs.map(()=>null); t.pens=false; } };
  const mia=lista.find(t=>_mEsMia(t));
  const suya=lista.find(t=>t!==mia&&(t.a===rivalCal||t.b===rivalCal));
  if(!mia){
    if(suya){ if(suya.a===rivalCal) suya.b=E.club; else suya.a=E.club; limpiar(suya); }
    return;
  }
  const riv=mia.a===E.club?mia.b:mia.a;
  if(riv===rivalCal) return;
  if(mia.a===riv) mia.a=rivalCal; else mia.b=rivalCal;
  if(suya){ if(suya.a===rivalCal) suya.a=riv; else suya.b=riv; limpiar(suya); }
  limpiar(mia);
}
/* un partido de llave para TU calendario */
function _mPartidoLlave(torneoNom, t, i, notaTxt, fase){
  const riv=t.a===E.club?t.b:t.a;
  const local=t.unica?false:((i===0)?t.a===E.club:t.b===E.club);
  const c=clubMundo(riv)||{}, yo=clubMundo(E.club)||{}, f=t.fechas[i];
  return {
    tipo:"copa", torneo:torneoNom, ronda:t.ronda, rivalId:riv, rivalNombre:c.n||riv, fuerzaRival:c.fuerza||65,
    local:local, sede:t.unica?(t.sede||"cancha neutral"):(local?(yo.est||"local"):(c.est||"estadio rival")),
    f:{m:f.m, d:f.d}, jugado:false,
    clima:(typeof climaDeFecha==="function")?climaDeFecha(f.m,torneoNom+t.ronda+riv+i):"despejado",
    real:null, apodo:null, nota:i===0?(notaTxt||null):null,
    notaId:"U-"+torneoNom+"-"+t.ronda+"-"+riv+"-"+i, fase:fase||null
  };
}
/* inserta en TU calendario los partidos de tu llave (una sola vez por llave) */
function mundoInsertarLlaveJugador(tor, t, torneoNom, notaTxt){
  if(!t||!E) return false;
  const ya=(E.calendario||[]).some(p=>p&&p.tipo==="copa"&&p.torneo===torneoNom&&p.ronda===t.ronda);
  if(t.enCal||ya){ t.enCal=true; return false; }
  const nuevos=t.fechas.map((f,i)=>_mPartidoLlave(torneoNom, t, i, notaTxt||("Cuadro de "+torneoNom+" "+E.anio+": el rival salió de su llave."), tor==="ligB"?"liguillaB":null));
  if(typeof _insertarYOrdenar==="function") _insertarYOrdenar(nuevos);
  else { nuevos.forEach(p=>E.calendario.push(p)); }
  t.enCal=true;
  return true;
}
/* anota TU partido de copa en el registro (grupo o llave). Una sola vez por partido. */
function mundoRegistrarJugador(part, yo, otro){
  if(!E||!E.mundo||E.mundo.ver!==2||!part) return;
  const tor=part.torneo==="Copa Chile"?"chile":(part.torneo==="Copa de la Liga"?"copaLiga":null);
  if(!tor) return;
  const pack=E.mundo.copas[tor]; if(!pack||!pack.grupos) return;
  const riv=part.rivalId; if(!riv) return;
  const ronda=part.ronda||"";
  if(/^Grupo /.test(ronda)){
    _mResincronizarGrupo(tor);
    const L=ronda.replace(/^Grupo\s+/,""), g=pack.grupos[L]; if(!g) return;
    const a=part.local?E.club:riv, b=part.local?riv:E.club, ga=part.local?yo:otro, gb=part.local?otro:yo;
    let md=-1;
    g.fx.forEach((m,i)=>{ if(md<0 && m.some(p=>p[0]===a&&p[1]===b)) md=i; });
    if(md<0) return;
    if(g.res[_mKey(md,a,b)]){ part._uni=true; return; }
    _mAnotarGrupo(pack, L, md, a, b, ga, gb, true);
    part._uni=true;
    pack.ronda=_mRondaCopa(pack);
    if(!pack.ko && mundoGruposCompletos(tor)) _mArmarKO(tor);
    return;
  }
  if(!pack.ko){ mundoForzarGrupos(tor); _mRellenarVencidos(tor, 9999, true); if(!pack.ko && mundoGruposCompletos(tor)) _mArmarKO(tor); }
  if(!pack.ko||!pack.ko.rondas[ronda]) return;
  let t=mundoLlaveJugador(tor, ronda);
  if(!t||(t.a!==riv&&t.b!==riv)){ _mAjustarLlave(pack.ko.rondas[ronda], riv); t=mundoLlaveJugador(tor, ronda); }
  if(!t) return;
  const i=t.unica?0:(part.local===(t.a===E.club)?0:1);
  if(t.legs[i]){ part._uni=true; return; }
  const loc=t.unica?t.a:(i===0?t.a:t.b);                            /* ga/gb = goles del local de ESE partido */
  t.legs[i]=(loc===E.club)?{ga:yo, gb:otro}:{ga:otro, gb:yo};
  t.enCal=true;
  part._uni=true;
}

/* ---------- liguilla de la Primera B (2°–8°, bases ANFP 2026) ---------- */
function _mLigBFechasBase(ultimaRegular){
  const fx=(typeof LIGUILLA_B_FECHAS==="object")?LIGUILLA_B_FECHAS:{Cuartos:[{m:11,d:4},{m:11,d:8}],Semifinal:[{m:11,d:15},{m:11,d:19}],FINAL:[{m:11,d:22},{m:11,d:26}]};
  let corr=0;
  if(ultimaRegular && _mfn(fx.Cuartos[0])<=_mfn(ultimaRegular)){
    corr=Math.round((new Date(2026,ultimaRegular.m-1,ultimaRegular.d+3)-new Date(2026,fx.Cuartos[0].m-1,fx.Cuartos[0].d))/86400000);
  }
  const sh=f=>_mSumarDias(f,corr);
  return {Cuartos:fx.Cuartos.map(sh), Semifinal:fx.Semifinal.map(sh), FINAL:fx.FINAL.map(sh)};
}
function _mLigBLlave(lb, ronda, x, y){
  const pos=id=>lb.tabla.indexOf(id)+1;
  const peor=pos(x)>pos(y)?x:y, mejor=peor===x?y:x;
  return {ronda:ronda, a:peor, b:mejor, fechas:lb.fechas[ronda].map(f=>({m:f.m,d:f.d})), legs:[null,null], unica:false, gana:null, pens:false, alargue:ronda==="FINAL"};
}
/* crea el cuadro con la tabla FINAL de la fase regular (ids en orden 1°..16°) */
function mundoCrearLiguillaB(tablaIds, ultimaRegular){
  if(!E||!E.mundo||!tablaIds||tablaIds.length<8) return null;
  if(E.mundo.ligB&&E.mundo.ligB.anio===E.anio) return E.mundo.ligB;
  const lb={anio:E.anio, tabla:tablaIds.slice(), fechas:_mLigBFechasBase(ultimaRegular), orden:["Cuartos","Semifinal","FINAL"], rondas:{}, campeon:null};
  lb.rondas.Cuartos=[_mLigBLlave(lb,"Cuartos",tablaIds[2],tablaIds[7]), _mLigBLlave(lb,"Cuartos",tablaIds[3],tablaIds[6]), _mLigBLlave(lb,"Cuartos",tablaIds[4],tablaIds[5])];
  E.mundo.ligB=lb;
  return lb;
}
/* si no juegas en la B, su liguilla se arma sola cuando termina su fase regular */
function _mLigBAuto(){
  if(!E||!E.mundo||E.mundo.ligB) return;
  if(_ligaKeyJugador()==="2026b") return;                              /* la tuya la arma tu último partido */
  const L=E.mundo.ligas&&E.mundo.ligas["2026b"];
  if(!L||!L.fx||!L.fx.length||(L.ronda||0)<L.fx.length) return;
  mundoCrearLiguillaB(_ordTabla(L.tab,L.ids).map(x=>x.id), null);
}
function _mLigBSemis(lb){
  if(lb.rondas.Semifinal) return;
  const q=lb.rondas.Cuartos; if(!q||!q.every(t=>t.gana)) return;
  const pos=id=>lb.tabla.indexOf(id)+1;
  const w=q.map(t=>t.gana).sort((a,b)=>pos(a)-pos(b));               /* mejor a peor */
  lb.rondas.Semifinal=[_mLigBLlave(lb,"Semifinal",lb.tabla[1],w[2]), _mLigBLlave(lb,"Semifinal",w[0],w[1])];   /* el 2° contra el peor que pasó */
}
function _mLigBFinal(lb){
  if(lb.rondas.FINAL) return;
  const s=lb.rondas.Semifinal; if(!s||!s.every(t=>t.gana)) return;
  lb.rondas.FINAL=[_mLigBLlave(lb,"FINAL",s[0].gana,s[1].gana)];
}
function _mLigBJugarLeg(t,i){
  if(t.legs[i]) return;
  if(_mEsMia(t)) return;
  const loc=i===0?t.a:t.b, vis=loc===t.a?t.b:t.a;
  const ca=clubMundo(loc), cb=clubMundo(vis); if(!ca||!cb) return;
  const gl=_golesM(ca,cb,"ligB|"+t.ronda+"|"+i+"|"+loc+"|"+vis);
  t.legs[i]={ga:gl[0], gb:gl[1]};
  (E.mundo.pais=E.mundo.pais||[]).push({a:_nomClub(loc), b:_nomClub(vis), ga:gl[0], gb:gl[1], liga:"Liguilla de Ascenso · "+t.ronda, idA:loc, idB:vis});
}
/* cuartos y semis empatados: penales sin alargue. Final: alargue y después penales.
   Si la llave es tuya, el alargue y la tanda ya se jugaron en tu partido. */
function _mLigBDefinir(t, ganaJugador){
  if(t.gana) return t.gana;
  if(t.legs.some(l=>!l)) return null;
  const g=_mGlobal(t);
  if(g[0]!==g[1]){ t.gana=g[0]>g[1]?t.a:t.b; return t.gana; }
  if(ganaJugador!=null){ t.pens=true; t.gana=ganaJugador; return t.gana; }
  if(t.alargue){
    const rr=_mAzar("ligB|alargue|"+t.a+"|"+t.b);
    const ea=rr()<0.22?1:0, eb=rr()<0.26?1:0;                         /* la vuelta es en casa de b */
    t.alargueGoles=[ea,eb];
    if(ea!==eb){ t.gana=ea>eb?t.a:t.b; return t.gana; }
  }
  t.pens=true;
  const rp=_mAzar("ligB|pen|"+t.ronda+"|"+t.a+"|"+t.b);
  t.gana=rp()<0.5?t.a:t.b;
  return t.gana;
}
function _mLigBAvanzar(lb){
  let cambio=false;
  lb.orden.forEach(r=>(lb.rondas[r]||[]).forEach(t=>{
    if(!t.gana && t.legs.every(Boolean) && !_mEsMia(t)){ _mLigBDefinir(t); cambio=true; }
  }));
  if(!lb.rondas.Semifinal && lb.rondas.Cuartos.every(t=>t.gana)){ _mLigBSemis(lb); cambio=true; }
  if(lb.rondas.Semifinal && !lb.rondas.FINAL && lb.rondas.Semifinal.every(t=>t.gana)){ _mLigBFinal(lb); cambio=true; }
  if(lb.rondas.FINAL && lb.rondas.FINAL[0].gana && !lb.campeon){ lb.campeon=lb.rondas.FINAL[0].gana; cambio=true; }
  return cambio;
}
function _mLigBHasta(tope, forzar){
  const lb=E.mundo.ligB; if(!lb) return;
  let guard=0;
  while(guard++<8){
    let cambio=false;
    lb.orden.forEach(r=>(lb.rondas[r]||[]).forEach(t=>{
      t.fechas.forEach((f,i)=>{ if(!t.legs[i]&&(forzar||_mfn(f)<=tope)){ _mLigBJugarLeg(t,i); if(t.legs[i]) cambio=true; } });
    }));
    if(_mLigBAvanzar(lb)) cambio=true;
    if(!cambio) break;
  }
}
/* cierra una ronda de la liguilla (llaves ajenas) y arma la siguiente */
function mundoLigBCerrarRonda(ronda){
  const lb=E&&E.mundo&&E.mundo.ligB; if(!lb||!lb.rondas[ronda]) return;
  lb.rondas[ronda].forEach(t=>t.legs.forEach((l,i)=>{ if(!l) _mLigBJugarLeg(t,i); }));
  _mLigBAvanzar(lb);
}
function mundoLlaveLigB(ronda){
  const lb=E&&E.mundo&&E.mundo.ligB; if(!lb||!lb.rondas[ronda]) return null;
  return lb.rondas[ronda].find(t=>_mEsMia(t))||null;
}
function mundoRegistrarLigB(part, yo, otro){
  if(!E||!E.mundo||!E.mundo.ligB||!part||part.torneo!=="Liguilla de Ascenso") return;
  const lista=E.mundo.ligB.rondas[part.ronda]; if(!lista) return;
  let t=mundoLlaveLigB(part.ronda);
  if(!t||(t.a!==part.rivalId&&t.b!==part.rivalId)){ _mAjustarLlave(lista, part.rivalId); t=mundoLlaveLigB(part.ronda); }
  if(!t) return;
  const i=part.local===(t.a===E.club)?0:1;
  if(t.legs[i]){ part._uni=true; return; }
  const loc=i===0?t.a:t.b;
  t.legs[i]=(loc===E.club)?{ga:yo, gb:otro}:{ga:otro, gb:yo};
  t.enCal=true;
  part._uni=true;
}

/* ---------- tu llave (copa o liguilla): el global que ya llevas y quién pasa ---------- */
function mundoLlaveDe(part){
  if(!part||!E||!E.mundo||E.mundo.ver!==2||part.tipo!=="copa") return null;
  let t=null, tor=null;
  if(part.torneo==="Liguilla de Ascenso"){ tor="ligB"; t=mundoLlaveLigB(part.ronda); }
  else if(part.torneo==="Copa Chile"){ tor="chile"; t=mundoLlaveJugador("chile", part.ronda); }
  else if(part.torneo==="Copa de la Liga"){ tor="copaLiga"; t=mundoLlaveJugador("copaLiga", part.ronda); }
  if(!t) return null;
  const riv=t.a===E.club?t.b:t.a;
  if(part.rivalId && part.rivalId!==riv) return null;
  const i=t.unica?0:(part.local===(t.a===E.club)?0:1);
  return {tor:tor, t:t, i:i, riv:riv};
}
/* lo que ya llevas en la llave SIN contar el partido que se está jugando */
function mundoGlobalPrevio(part){
  const L=mundoLlaveDe(part); if(!L) return null;
  const t=L.t; let gf=0, gc=0, pend=0;
  t.legs.forEach((l,j)=>{
    if(j===L.i) return;
    if(!l){ pend++; return; }
    const loc=t.unica?t.a:(j===0?t.a:t.b);
    if(loc===E.club){ gf+=l.ga; gc+=l.gb; } else { gf+=l.gb; gc+=l.ga; }
  });
  return {gf:gf, gc:gc, pendientes:pend, unica:!!t.unica};
}
/* cuando tu llave está completa: se define (tu tanda manda) y dice si pasas */
function mundoDefinirLlaveJugador(part){
  const L=mundoLlaveDe(part); if(!L) return null;
  const t=L.t;
  if(t.legs.some(l=>!l)) return {t:t, listo:false};
  const g=_mGlobal(t), yoA=t.a===E.club;
  let gj=null;
  if(g[0]===g[1] && part.penales) gj=part.penales.gano?E.club:L.riv;
  if(L.tor==="ligB") _mLigBDefinir(t, gj); else _mDefinirLlave(L.tor, t, {ganaJugador:gj});
  if(L.tor==="ligB"){ _mLigBAvanzar(E.mundo.ligB); }
  else { _mAvanzarKO(L.tor); }
  return {t:t, listo:true, pasa:t.gana===E.club, gf:yoA?g[0]:g[1], gc:yoA?g[1]:g[0], pens:!!t.pens, riv:L.riv, tor:L.tor};
}

/* ---------- partida guardada con el registro viejo ---------- */
function _mMigrarJugador(){
  if(!E||!E.mundo||!E.calendario) return;
  const jug=E.calendario.filter(p=>p&&p.jugado&&p.tipo==="copa"&&p.f&&
    (p.torneo==="Copa Chile"||p.torneo==="Copa de la Liga"||p.torneo==="Liguilla de Ascenso"))
    .sort((a,b)=>_mfn(a.f)-_mfn(b.f));
  if(!jug.length) return;
  if(E.eraBase==="2026b" && E.flags && E.flags.liguillaBTabla && !E.mundo.ligB){
    const reg=E.calendario.filter(p=>p&&p.tipo==="liga"&&!p.fase&&p.f).sort((a,b)=>_mfn(a.f)-_mfn(b.f));
    mundoCrearLiguillaB(E.flags.liguillaBTabla, reg.length?reg[reg.length-1].f:null);
  }
  jug.forEach(p=>{
    p._uni=false;
    mundoHasta(p.f);
    mundoRegistrarJugador(p, p.gf||0, p.gc||0);
    mundoRegistrarLigB(p, p.gf||0, p.gc||0);
    const L=mundoLlaveDe(p);
    if(L && L.t.legs.every(Boolean) && !L.t.gana) mundoDefinirLlaveJugador(p);
  });
}

/* ---------- el año se cierra: todo lo pendiente del país se juega ---------- */
function mundoCompletarTemporada(){
  if(!E||!E.mundo||E.mundo.ver!==2) return;
  const propia=_ligaKeyJugador();
  Object.keys(E.mundo.ligas||{}).forEach(k=>{
    if(k===propia) return;
    const L=E.mundo.ligas[k]; if(L&&L.fx) mundoAlcanzarRondaLiga(k, L.fx.length);
  });
  mundoHasta({m:12,d:31});
  ["chile","copaLiga"].forEach(tor=>{
    const pack=E.mundo.copas[tor]; if(!pack||!pack.grupos||!Object.keys(pack.grupos).length) return;
    _mRellenarVencidos(tor, 9999, true);                               /* lo tuyo que quedó sin jugar */
    _mSimGrupos(tor, 0, true);
    if(pack.ko){
      Object.keys(pack.ko.rondas).forEach(r=>pack.ko.rondas[r].forEach(t=>{
        if(_mEsMia(t)&&!t.gana){
          t.legs.forEach((l,i)=>{ if(!l){ const loc=t.unica?t.a:(i===0?t.a:t.b), vis=loc===t.a?t.b:t.a;
            const gl=_golesM(clubMundo(loc)||{fuerza:60},clubMundo(vis)||{fuerza:60},tor+"|KOfin|"+t.ronda+"|"+i); t.legs[i]={ga:gl[0],gb:gl[1]}; } });
          _mDefinirLlave(tor,t);
        }
      }));
      _mJugarKOHasta(tor, 9999, true);
    }
  });
  _mLigBAuto();
  if(E.mundo.ligB){
    const lb=E.mundo.ligB;
    lb.orden.forEach(r=>(lb.rondas[r]||[]).forEach(t=>{
      if(_mEsMia(t)&&!t.gana){
        t.legs.forEach((l,i)=>{ if(!l){ const loc=i===0?t.a:t.b, vis=loc===t.a?t.b:t.a;
          const gl=_golesM(clubMundo(loc)||{fuerza:60},clubMundo(vis)||{fuerza:60},"ligBfin|"+t.ronda+"|"+i); t.legs[i]={ga:gl[0],gb:gl[1]}; } });
        _mLigBDefinir(t);
      }
    }));
    _mLigBHasta(9999, true);
  }
  /* campeones del país para los cupos (si no los ganó el jugador) */
  E.flags=E.flags||{};
  const ch=E.mundo.copas.chile;
  if(ch&&ch.campeon&&ch.campeon!==E.club){ E.flags.copaChileCampeonClub=ch.campeon; if(ch.sub===E.club) E.flags.copaChileSubcampeon=true; }
  const cl=E.mundo.copas.copaLiga;
  if(cl&&cl.campeon&&cl.campeon!==E.club) E.flags.copaLigaCampeonClub=cl.campeon;
}
/* orden final de una división: SU tabla del universo (la tuya, la real) */
function mundoOrdenDivision(tier){
  if(!E||!E.mundo||E.mundo.ver!==2||!E.mundo.ligas) return null;
  const L=E.mundo.ligas;
  if(tier===2026||tier==="2026") return L["2026"]?mundoFilasLiga("2026").map(x=>x.id):null;
  if(tier==="2026b") return L["2026b"]?mundoFilasLiga("2026b").map(x=>x.id):null;
  if(tier==="2026c"){
    if(!L["2026cN"]&&!L["2026cS"]) return null;
    const fn=L["2026cN"]?mundoFilasLiga("2026cN"):[], fs=L["2026cS"]?mundoFilasLiga("2026cS"):[];
    /* los punteros de zona primero (el mejor de los dos arriba), después el resto */
    const cmp=(a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf;
    const cab=[fn[0],fs[0]].filter(Boolean).sort(cmp);
    const resto=fn.slice(1).concat(fs.slice(1)).sort(cmp);
    return cab.concat(resto).map(x=>x.id);
  }
  return null;
}
/* orden de un grupo de ids (una división entera o parte) según el universo */
function mundoOrdenDeIds(ids){
  if(!ids||!ids.length) return null;
  for(const t of [2026,"2026b","2026c"]){
    const ord=mundoOrdenDivision(t); if(!ord||!ord.length) continue;
    if(ids.every(id=>ord.indexOf(id)>=0)) return ord.filter(id=>ids.indexOf(id)>=0);
  }
  return null;
}

function _nomLiga(k){
  return { "2026":"Liga de Primera", "2026b":"Liga de Ascenso (B)",
    "2026cN":"Segunda · Zona Norte", "2026cS":"Segunda · Zona Sur",
    "arg2026A":"Apertura · Zona A", "arg2026B":"Apertura · Zona B",
    "arg2026":"Liga Profesional Argentina" }[k]||k;
}

function mundoTick(part){
  if(!E) return;
  if(!E.mundo||E.mundo.anio!==E.anio||E.mundo.ver!==2) mundoInit();
  if(!E.mundo) return;
  const n=(part&&part.fecha)?part.fecha:((E.idx||0)+1);
  const target=(part&&part.fxRonda!=null)?(part.fxRonda+1):n;
  if(!(E.mundo.tick===n && !(part&&part.fxRonda!=null))){
    E.mundo.tick=n;
    const propia=_ligaKeyJugador();
    Object.keys(E.mundo.ligas).forEach(k=>{
      if(k===propia) return;
      mundoAlcanzarRondaLiga(k, target);
    });
    if(propia && E.mundo.ligas[propia]){
      E.mundo.ligas[propia].ronda=Math.max(E.mundo.ligas[propia].ronda||0, target);
    }
  }
  if(part&&part.f) mundoHasta(part.f);
  mundoSimCopas(part&&part.f, n);
  if(!E._bulkSim) mundoArmarNoticias(part);
  if(E.mundo.pais && E.mundo.pais.length>80) E.mundo.pais=E.mundo.pais.slice(-40);
}
function mundoAlcanzarRonda(target){
  if(!E||!E.mundo) return;
  const propia=_ligaKeyJugador();
  Object.keys(E.mundo.ligas||{}).forEach(k=>{
    if(k===propia) return;
    mundoAlcanzarRondaLiga(k, target);
  });
}
function mundoAlcanzarRondaLiga(key, target){
  const L=E.mundo.ligas[key]; if(!L||!L.fx) return;
  const tope=Math.min(target, L.fx.length);
  while((L.ronda||0)<tope) mundoSimRondaLiga(key, L.ronda||0);
}
function mundoSimRondaLiga(key, rondaIdx){
  const L=E.mundo.ligas[key]; if(!L||!L.fx||rondaIdx<0||rondaIdx>=L.fx.length) return;
  if(L.ronda>rondaIdx) return;
  const jornada=L.fx[rondaIdx]||[];
  const pais=[];
  jornada.forEach(par=>{
    const a=clubMundo(par[0]), b=clubMundo(par[1]);
    if(!a||!b||par[0]===par[1]) return;
    if(E.club && (par[0]===E.club||par[1]===E.club)) return;
    const [ga,gb]=_golesM(a,b,"liga|"+key+"|"+rondaIdx+"|"+a.id+"|"+b.id);
    _aplicarTabla(L.tab, a.id, b.id, ga, gb);
    pais.push({a:a.c||a.n, b:b.c||b.n, ga:ga, gb:gb, liga:L.nom, idA:a.id, idB:b.id});
    /* 7.9059 · resultado por ronda: la ficha de cada equipo y su racha lo leen */
    (L.res=L.res||{})[rondaIdx]=(L.res[rondaIdx]||[]).concat([[a.id,b.id,ga,gb]]);
  });
  L.ronda=rondaIdx+1;
  E.mundo.pais=(E.mundo.pais||[]).concat(pais).slice(-40);
}

/* CONMEBOL (grupos con equipos extranjeros) y Copa Argentina: siguen por mes.
   Tu partido CONMEBOL se anota cuando lo juegas (mundoRegistrarConmebol), una vez. */
function mundoSimCopas(f, n){
  const mes=f&&f.m?f.m:((n<=4)?3:(n<=12)?6:(n<=20)?8:10);
  if(n>0){
    ["lib","sud"].forEach(tor=>{
      const pack=E.mundo.copas[tor];
      if(!pack||!pack.grupos) return;
      pack.ronda=pack.ronda||0;
      const want=Math.min(6, Math.max(0, Math.floor((n-1)/2)));   /* 6 fechas de grupo a lo largo del año */
      while((pack.ronda||0)<want){
        const r=pack.ronda||0;
        Object.keys(pack.grupos).forEach(letra=>{
          const g=pack.grupos[letra];
          (_fxGrupo4(g.ids)[r]||[]).forEach(par=>{
            if(E.club && (par[0]===E.club||par[1]===E.club)) return;
            const a=_clubConmebol(par[0], g), b=_clubConmebol(par[1], g);
            if(!a||!b) return;
            const [ga,gb]=_golesM(a,b,tor+"|G"+letra+"|"+r+"|"+par[0]+"|"+par[1]);
            _aplicarTabla(g.tab, par[0], par[1], ga, gb);
            if(pack.clubs[par[0]]) _aplicarTabla(pack.clubs, par[0], par[1], ga, gb);
            (g.res=g.res||{})[_mKey(r,par[0],par[1])]=[ga,gb];
            pack.partidos.push({a:a.n, b:b.n, ga:ga, gb:gb, grupo:letra, tor:tor});
            E.mundo.pais.push({a:a.n,b:b.n,ga:ga,gb:gb,liga:(tor==="lib"?"Libertadores":"Sudamericana")+" · Grupo "+letra,idA:par[0],idB:par[1]});
          });
        });
        pack.ronda=(pack.ronda||0)+1;
      }
    });
  }
  if(typeof mundoSimCopaArg==="function") mundoSimCopaArg(mes);
}
/* tu partido CONMEBOL de grupo: a la tabla del grupo, una vez */
function mundoRegistrarConmebol(part, yo, otro){
  if(!E||!E.mundo||!E.mundo.copas||!part||part._uniC) return;
  const tor=/Libertadores/i.test(part.torneo||"")?"lib":(/Sudamericana/i.test(part.torneo||"")?"sud":null);
  if(!tor||!/^Grupo /.test(part.ronda||"")) return;
  const L=(part.ronda||"").replace(/^Grupo\s+/,""), pack=E.mundo.copas[tor], g=pack&&pack.grupos&&pack.grupos[L];
  if(!g||g.ids.indexOf(E.club)<0) return;
  let riv=part.rivalId;
  if(!riv||g.ids.indexOf(riv)<0){
    const nom=String(part.rivalNombre||"").toLowerCase();
    riv=g.ids.find(id=>String((g.nom&&g.nom[id])||_nomClub(id)).toLowerCase()===nom)||null;
  }
  if(!riv) return;
  const a=part.local?E.club:riv, b=part.local?riv:E.club, ga=part.local?yo:otro, gb=part.local?otro:yo;
  g.mios=g.mios||[];
  if(g.mios.some(x=>x.a===a&&x.b===b)){ part._uniC=true; return; }
  _aplicarTabla(g.tab, a, b, ga, gb);
  if(pack.clubs[E.club]) _aplicarTabla(pack.clubs, a, b, ga, gb);
  g.mios.push({a:a,b:b,ga:ga,gb:gb});
  part._uniC=true;
}
function mundoSimCopaArg(mes){
  if(!E||!E.mundo||!E.mundo.copas) return;
  if(!E.mundo.copas.arg) E.mundo.copas.arg={ronda:0,partidos:[],vivos:{}};
  const pack=E.mundo.copas.arg;
  if(typeof COPA_ARG_32_2026!=="object") return;
  if(!pack.vivos||!Object.keys(pack.vivos).length){
    pack.vivos=pack.vivos||{};
    Object.keys(COPA_ARG_32_2026).forEach(function(id){ pack.vivos[id]=1; });
  }
  const want=mes>=11?5:(mes>=10?4:(mes>=8?3:(mes>=5?2:(mes>=2?1:0))));
  while((pack.ronda||0)<want){
    const r=pack.ronda||0;
    const nomR=["32avos","16avos","Octavos","Cuartos","Semifinal","FINAL"][Math.min(r,5)];
    if(r===0){
      Object.keys(COPA_ARG_32_2026).forEach(function(id){
        const spec=COPA_ARG_32_2026[id];
        if(E.club && (id===E.club || spec.id===E.club)){
          const mio=(E.calendario||[]).find(function(p){ return p.tipo==="copa"&&/Copa Argentina/i.test(p.torneo||"")&&p.jugado; });
          if(mio){
            const gf=mio.gf||0, gc=mio.gc||0;
            pack.partidos.push({a:_nomClub(id), b:spec.n, ga:gf, gb:gc, liga:"Copa Argentina · 32avos", ronda:"32avos", idA:id});
            if(gf<gc||(gf===gc&&!(mio.penales&&mio.penales.gano))) pack.vivos[id]=0;
          }
          return;
        }
        const a=clubMundo(id)||{id:id,n:id,c:id,fuerza:70};
        const b={id:spec.id||("riv_"+id), n:spec.n, c:spec.n, fuerza:spec.fue||50};
        const g=_golesM(a,b,"arg|32|"+id);
        let ga=g[0], gb=g[1], pens=false;
        if(ga===gb){ pens=true; if(_mAzar("argpen|32|"+id)()<0.5) ga++; else gb++; }
        pack.partidos.push({a:a.c||a.n, b:b.n, ga:ga, gb:gb, liga:"Copa Argentina · 32avos", ronda:"32avos", pens:pens, idA:id, idB:b.id});
        E.mundo.pais.push({a:a.c||a.n, b:b.n, ga:ga, gb:gb, liga:"Copa Argentina", idA:id, idB:b.id});
        if(ga<=gb) pack.vivos[id]=0;
      });
    } else {
      const vivos=Object.keys(pack.vivos).filter(function(id){ return pack.vivos[id]; });
      const used={};
      vivos.forEach(function(id){
        if(used[id]) return;
        let opp=null;
        if(r===1 && COPA_ARG_32_2026[id] && COPA_ARG_32_2026[id].next && COPA_ARG_32_2026[id].next.id) opp=COPA_ARG_32_2026[id].next.id;
        if(r===2 && typeof COPA_ARG_OCTAVOS_2026==="object" && COPA_ARG_OCTAVOS_2026[id] && COPA_ARG_OCTAVOS_2026[id].id) opp=COPA_ARG_OCTAVOS_2026[id].id;
        if(opp && pack.vivos[opp] && !used[opp] && opp!==id){
          used[id]=used[opp]=1;
          if(E.club && (id===E.club || opp===E.club)) return;
          const a=clubMundo(id)||{id:id,n:id,c:id,fuerza:70};
          const b=clubMundo(opp)||{id:opp,n:opp,c:opp,fuerza:70};
          const g=_golesM(a,b,"arg|"+r+"|"+id+"|"+opp);
          let ga=g[0], gb=g[1], pens=false;
          if(ga===gb){ pens=true; if(_mAzar("argpen|"+r+"|"+id+"|"+opp)()<0.5) ga++; else gb++; }
          pack.partidos.push({a:a.c||a.n, b:b.c||b.n, ga:ga, gb:gb, liga:"Copa Argentina · "+nomR, ronda:nomR, pens:pens, idA:id, idB:opp});
          E.mundo.pais.push({a:a.c||a.n, b:b.c||b.n, ga:ga, gb:gb, liga:"Copa Argentina", idA:id, idB:opp});
          if(ga>gb) pack.vivos[opp]=0; else pack.vivos[id]=0;
        }
      });
    }
    pack.ronda=r+1;
  }
}
function _clubConmebol(id, g){
  const c=clubMundo(id);
  if(c) return c;
  const nom=(g&&g.nom&&g.nom[id])||id;
  const fue=(g&&g.fue&&g.fue[id])||70;
  return {id:id, n:nom, c:nom, fuerza:fue};
}

function mundoArmarNoticias(part){
  const out=[];
  const pais=(E.mundo.pais||[]).slice(-12);
  pais.slice().sort((a,b)=>Math.abs(b.ga-b.gb)-Math.abs(a.ga-a.gb)).slice(0,2).forEach(g=>{
    if(Math.abs(g.ga-g.gb)>=3) out.push({tipo:"imp", t:"Goleada en "+(g.liga||"el país"),
      d:g.a+" "+g.ga+"-"+g.gb+" "+g.b+". Un papelón de un lado, fiesta del otro."});
  });
  if(E.mundo.ligas["2026"]){
    const arr=_ordTabla(E.mundo.ligas["2026"].tab, E.mundo.ligas["2026"].ids);
    if(arr[0]&&arr[0].pj>0) out.push({tipo:"imp", t:_nomClub(arr[0].id)+" manda en Primera",
      d:"Puntero con "+arr[0].pts+" pts. "+(arr[1]?("Lo persigue "+_nomClub(arr[1].id)+" ("+arr[1].pts+")."):"")+
        (E.eraBase==="2026c"||E.eraBase==="2026b"?" Si subes, ese es el que te va a esperar.":"")});
  }
  if(E.mundo.ligas["2026b"] && (E.eraBase==="2026c"||E.eraBase===2026||E.eraBase==="2026")){
    const arr=_ordTabla(E.mundo.ligas["2026b"].tab, E.mundo.ligas["2026b"].ids);
    if(arr[0]&&arr[0].pj>0) out.push({tipo:"imp", t:"En la B manda "+_nomClub(arr[0].id),
      d:arr[0].pts+" puntos. El 1° sube directo; 2°–8° van a liguilla."});
  }
  const ch=E.mundo.copas.chile;
  if(ch&&ch.grupos){
    const letra=Object.keys(ch.grupos)[E.idx%8];
    const g=ch.grupos[letra];
    if(g){
      const arr=_ordTabla(g.tab, g.ids);
      if(arr[0]&&arr[0].pj>0) out.push({tipo:"imp", t:"Copa Chile · Grupo "+letra,
        d:_nomClub(arr[0].id)+" va 1° ("+arr[0].pts+" pts). Clasifican 1° y 2°."});
    }
  }
  const chiste=pais[pais.length-1];
  if(chiste){
    const pool=[
      "En la conferencia dijeron «el plan se cumplió». El plan, aparentemente, era sufrir.",
      "El DT rival pidió «más verticalidad». Lo único vertical fue la cara cuando les metieron el segundo.",
      "Hubo un penal tan claro que hasta el linier lo vio. Casi un milagro.",
      "La tribuna visitante cantó todo el segundo tiempo. El resultado no los acompañó, la garganta sí.",
      "Alguien filtró que el 9 pidió el cambio. El 9 después dijo que era «rotación». Claro."
    ];
    const i=(E.anio*31+(E.idx||0)*17+chiste.ga*3)%pool.length;
    out.push({tipo:"chiste", t:chiste.a+" "+chiste.ga+"-"+chiste.gb+" "+chiste.b, d:pool[i]});
  }
  if(part&&part.rivalNombre){
    out.push({tipo:"imp", t:"Se viene "+part.rivalNombre,
      d:(part.local?"De local":"De visita")+" · "+(part.torneo||"liga")+(part.ronda?" · "+part.ronda:"")+" · "+(part.sede||"")+"."});
  }
  E.mundo.noticias=out.slice(0,8);
}

function mundoNoticias(){ return (E&&E.mundo&&E.mundo.noticias)||[]; }

function mundoFilasLiga(key){
  const L=E&&E.mundo&&E.mundo.ligas&&E.mundo.ligas[key];
  if(!L) return [];
  /* 7.9030 · TU liga se lee de la tabla real, no de una copia: la copia solo se
     sincronizaba en mundoTick, que se salta en simulaciones masivas, y el
     Calendario mostraba 0 PJ después de jugar. */
  if(key===_ligaKeyJugador() && E.tabla){
    const tab={};
    L.ids.forEach(id=>{ const t=E.tabla[id]; tab[id]=t?{pj:t.pj,pg:t.pg,pe:t.pe,pp:t.pp,gf:t.gf,gc:t.gc,pts:t.pts}:(L.tab[id]||_fila0()); });
    return _ordTabla(tab, L.ids);
  }
  return _ordTabla(L.tab, L.ids);
}
function mundoFilasCopa(torneo, letra){
  const pack=E&&E.mundo&&E.mundo.copas&&E.mundo.copas[torneo];
  if(!pack||!pack.grupos||!pack.grupos[letra]) return [];
  const g=pack.grupos[letra];
  return _ordTabla(g.tab, g.ids);
}
function mundoFilasConmebol(tor, letra){
  const pack=E&&E.mundo&&E.mundo.copas&&E.mundo.copas[tor];
  if(!pack||!pack.grupos||!pack.grupos[letra]) return [];
  const g=pack.grupos[letra];
  return (g.ids||[]).map(id=>{
    const t=g.tab[id]||_fila0();
    const c=clubMundo(id);
    const n=(c&&(c.c||c.n))||(g.nom&&g.nom[id])||id;
    return Object.assign({id:id, n:n}, t);
  }).sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf);
}

function mundoPintarTabla(filas, opts){
  opts=opts||{};
  const compact=!!opts.compact;
  const tb=el("table","tabla-liga"+(compact?" tabla-mini":""));
  tb.innerHTML=compact
    ?"<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>Pts</th><th class='n'>DG</th></tr></thead>"
    :"<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>G</th><th class='n'>E</th><th class='n'>P</th><th class='n'>GF</th><th class='n'>GC</th><th class='n'>Pts</th></tr></thead>";
  const body=el("tbody");
  const yo=opts.yo!=null?opts.yo:(E&&E.club);
  (filas||[]).forEach((c,i)=>{
    const tr=el("tr",c.id===yo?"yo":"");
    const ec=(typeof escudoChip==="function")?escudoChip(c.id):"";
    if(compact) tr.innerHTML="<td class='n'>"+(i+1)+"</td><td>"+ec+(c.n||c.id)+"</td><td class='n'>"+c.pj+"</td><td class='n'>"+c.pts+"</td><td class='n'>"+(c.gf-c.gc)+"</td>";
    else tr.innerHTML="<td class='n'>"+(i+1)+"</td><td>"+ec+(c.n||c.id)+"</td><td class='n'>"+c.pj+"</td><td class='n'>"+c.pg+"</td><td class='n'>"+c.pe+"</td><td class='n'>"+c.pp+"</td><td class='n'>"+c.gf+"</td><td class='n'>"+c.gc+"</td><td class='n'>"+c.pts+"</td>";
    body.appendChild(tr);
  });
  tb.appendChild(body);
  return tb;
}
function mundoEra2026(){
  if(!E) return false;
  return E.anio>=2010 || E.eraBase===2026 || E.eraBase==="2026" || E.eraBase==="2026b" || E.eraBase==="2026c" || E.eraBase==="arg2026";
}
function mundoPuntero(key){
  const f=mundoFilasLiga(key);
  return f[0]||null;
}


/* ---------- cuadros (llaves) — lo que ya pasó con marcador, lo que viene con "—" ---------- */
function mundoFechaHoy(){
  let f=null;
  ((E&&E.calendario)||[]).forEach(p=>{ if(p&&p.jugado&&p.f&&(!f||_mfn(p.f)>_mfn(f))) f=p.f; });
  return f||{m:1,d:1};
}
function _mEsc(s){ return (typeof escHtml==="function")?escHtml(String(s)):String(s); }
function _mT(k,d){ return (typeof T==="function")?T(k,d):d; }
function mundoPintarLlave(t, hoy){
  const box=el("div","llave"+(_mEsMia(t)?" mia":""));
  const visto=i=>!!t.legs[i];
  const todo=t.legs.every((l,i)=>visto(i));
  const g=_mGlobal(t);
  /* global parcial: solo lo que ya se jugó a la fecha */
  let ga=0, gb=0, alguno=false;
  t.legs.forEach((l,i)=>{ if(!visto(i)) return; alguno=true;
    if(t.unica||i===0){ ga+=l.ga; gb+=l.gb; } else { ga+=l.gb; gb+=l.ga; } });
  const fila=(id,gl)=>'<div class="llave-eq'+(todo&&t.gana===id?" gana":"")+(E&&id===E.club?" yo":"")+'">'+
    ((typeof escudoChip==="function")?escudoChip(id):"")+'<span class="nom">'+_mEsc(_nomClub(id))+'</span><b class="gl">'+(alguno?gl:"—")+'</b></div>';
  box.innerHTML=fila(t.a,ga)+fila(t.b,gb);
  const legs=t.fechas.map((f,i)=>{
    const tag=t.unica?_mT("cua_final","final"):(i===0?_mT("cua_ida","ida"):_mT("cua_vuelta","vuelta"));
    const loc=t.unica?null:(i===0?t.a:t.b);
    const res=visto(i)?(t.legs[i].ga+"-"+t.legs[i].gb):"—";
    return tag+" "+f.d+"/"+f.m+(loc?" "+_mT("cua_casa","en casa de")+" "+_mEsc(_nomClub(loc)):"")+": "+res;
  });
  let pie=legs.join(" · ");
  if(todo && t.alargueGoles) pie+=" · "+_mT("cua_alargue","alargue")+" "+t.alargueGoles[0]+"-"+t.alargueGoles[1];
  if(todo && t.pens) pie+=" · "+_mT("cua_pen","se definió en penales");
  if(todo && !t.unica && g[0]===g[1] && !t.pens) pie+=" · "+_mT("cua_global","global igualado");
  box.appendChild(el("div","llave-legs",pie));
  return box;
}
function mundoPintarCuadro(orden, rondas, hoy, notaEspera){
  const wrap=el("div","cuadro");
  orden.forEach(r=>{
    const col=el("div","cuadro-col");
    col.appendChild(el("div","cuadro-tit",_mEsc(r==="FINAL"?"Final":r)));
    const lista=rondas[r];
    if(!lista||!lista.length){
      col.appendChild(el("p","mini cuadro-vacio",_mT("cua_espera","Se arma cuando termine la ronda anterior.")));
    } else lista.forEach(t=>col.appendChild(mundoPintarLlave(t,hoy)));
    if(notaEspera && notaEspera[r]) col.appendChild(el("p","mini cuadro-vacio",notaEspera[r]));
    wrap.appendChild(col);
  });
  return wrap;
}
/* cuadro de Copa Chile o Copa de la Liga (null si todavía no hay cuadro) */
function mundoPanelLlaves(tor){
  const pack=E&&E.mundo&&E.mundo.copas&&E.mundo.copas[tor];
  if(!pack||!pack.grupos||!Object.keys(pack.grupos).length) return null;
  const p=panel((pack.torneo||"Copa")+" · "+_mT("cua_tit","cuadro"),"🏆","agua");
  if(!pack.ko){
    p.cuerpo.appendChild(el("p","mini",tor==="chile"
      ?"El cuadro se arma cuando terminen los grupos: 1° de un grupo contra el 2° de su grupo pareja (A↔C, B↔D, E↔G, F↔H). Ida en casa del peor clasificado."
      :"El cuadro se arma cuando terminen los grupos: pasa solo el 1° de cada grupo. Semis A↔D y B↔C, final única en el Elías Figueroa."));
    return p;
  }
  const hoy=mundoFechaHoy();
  p.cuerpo.appendChild(el("p","mini","Todas las llaves salen de las tablas del país (las tuyas incluidas). Global a dos partidos; si empata, penales."+(pack.campeon?" "+_mT("cua_campeon","Campeón")+": "+_mEsc(_nomClub(pack.campeon))+".":"")));
  p.cuerpo.appendChild(mundoPintarCuadro(pack.ko.orden, pack.ko.rondas, hoy));
  return p;
}
/* cuadro de la liguilla de la B (null si todavía no terminó la fase regular) */
function mundoPanelLiguillaB(){
  const lb=E&&E.mundo&&E.mundo.ligB;
  if(!lb) return null;
  const p=panel(_mT("cua_liguilla","Liguilla de Ascenso · cuadro"),"⬆️","agua");
  const seg=lb.tabla[1];
  p.cuerpo.appendChild(el("p","mini","2° a 8° de la fase regular. El 1° ("+_mEsc(_nomClub(lb.tabla[0]))+") ya subió. "+
    "Cuartos 3°–8°, 4°–7°, 5°–6°; el 2° ("+_mEsc(_nomClub(seg))+") espera en semis al peor que pase. Ida en casa del peor. "+
    "Cuartos y semis empatados: penales. Final: alargue y penales."+(lb.campeon?" "+_mT("cua_sube","Sube")+": "+_mEsc(_nomClub(lb.campeon))+".":"")));
  p.cuerpo.appendChild(mundoPintarCuadro(lb.orden, lb.rondas, mundoFechaHoy(), {Semifinal:lb.rondas.Semifinal?null:(_nomClub(seg)+" espera acá.")}));
  return p;
}

/* 7.9037 · el resumen de Tablas pintaba ~1.000 nodos de copas que casi nadie abre (medio
   segundo en un celular). Van plegados, se dibujan al abrir y se recuerda cuáles abriste. */
const _M_ABIERTOS={};
function _mPlegable(clave, titulo, pintarFn){
  const d=el("details","mundo-plegable");
  d.appendChild(el("summary","",titulo));
  let listo=false;
  const pintarYa=()=>{ if(listo) return; listo=true; try{ pintarFn(d); }catch(e){ d.appendChild(el("p","mini","No se pudo dibujar: "+e.message)); } };
  d.addEventListener("toggle",()=>{ _M_ABIERTOS[clave]=d.open; if(d.open) pintarYa(); });
  if(_M_ABIERTOS[clave]){ d.open=true; pintarYa(); }
  return d;
}
function panelMundoCalendario(v){
  if(!E||!E.mundo) return;
  if(!mundoEra2026()) return;
  const esArg=E.eraBase==="arg2026";
  const tabs=el("div","mundo-tabs");
  const cont=el("div","mundo-cont");
  if(!E.uiMundoTab) E.uiMundoTab="tablas";
  const ops=esArg
    ?[["tablas","Tablas"],["arg2026A","Zona A"],["arg2026B","Zona B"],["conmebol","CONMEBOL"],["copaArg","Copa Argentina"],["pais","Resultados"]]
    :[["tablas","Tablas"],["2026","Primera"],["2026b","Primera B"],["2026cN","2ª Norte"],["2026cS","2ª Sur"],["chile","Copa Chile"],["copaLiga","Copa de la Liga"],["conmebol","CONMEBOL"],["copaArg","Copa Argentina"],["pais","Resultados"]];
  function cabTabla(titulo, ic, filas, nota, compact){
    const p=panel(titulo, ic||"📊","agua");
    if(nota) p.cuerpo.appendChild(el("p","mini",nota));
    if(!filas||!filas.length) p.cuerpo.appendChild(el("p","mini","Todavía en cero: se llena al jugar o avanzar una fecha."));
    else p.cuerpo.appendChild(mundoPintarTabla(filas,{compact:!!compact}));
    return p;
  }
  function pintar(){
    cont.innerHTML="";
    const t=E.uiMundoTab;
    if(t==="tablas"){
      const intro=el("p","mini");
      if(esArg){
        const pa=mundoPuntero("arg2026A"), pb=mundoPuntero("arg2026B");
        const bits=[];
        if(pa&&pa.pj>0) bits.push("Zona A: <b>"+_nomClub(pa.id)+"</b> "+pa.pts+" pts");
        if(pb&&pb.pj>0) bits.push("Zona B: <b>"+_nomClub(pb.id)+"</b> "+pb.pts+" pts");
        intro.innerHTML=bits.length
          ?("Punteros ahora · "+bits.join(" · ")+". Apertura 2026: 2 zonas de 15, 14 PJ. Copa Argentina a partido único.")
          :"Liga Profesional 2026: Apertura en 2 zonas de 15 (sorteo AFA). 14 partidos de zona. Tabla viva, ronda a ronda.";
        cont.appendChild(intro);
        const grid=el("div","tablas-pais");
        [["arg2026A","Apertura · Zona A"],["arg2026B","Apertura · Zona B"]].forEach(([k,nom])=>{
          const propia=_ligaKeyJugador()===k;
          grid.appendChild(cabTabla(nom+(propia?" · la tuya":""),"📊", mundoFilasLiga(k),
            propia?"Tus puntos + el resto de la fecha, misma física Poisson.":"No la juegas: se simula igual, ronda a ronda. Nadie empieza con 14 PJ.", false));
        });
        cont.appendChild(grid);
        return;
      }
      const bits=[];
      [["2026","Primera"],["2026b","la B"],["2026cN","2ª Norte"],["2026cS","2ª Sur"]].forEach(([k,nom])=>{
        const p=mundoPuntero(k);
        if(p&&p.pj>0) bits.push(nom+": <b>"+_nomClub(p.id)+"</b> "+p.pts+" pts");
      });
      intro.innerHTML=bits.length
        ?("Punteros ahora · "+bits.join(" · ")+". Ligas y copas, todas. La tuya va marcada.")
        :"Tablas del país entero. Se llenan al avanzar: Primera, B, las dos zonas de Segunda, Copa Chile, Copa Argentina, Copa de la Liga y CONMEBOL.";
      cont.appendChild(intro);
      /* tu liga abierta; las otras plegadas */
      const grid=el("div","tablas-pais tablas-pais-1"), otras=[];
      [["2026","Liga de Primera","📊"],["2026b","Liga de Ascenso (B)","📊"],["2026cN","Segunda · Zona Norte","📊"],["2026cS","Segunda · Zona Sur","📊"]].forEach(([k,nom,ic])=>{
        if(!E.mundo.ligas[k]) return;
        if(_ligaKeyJugador()===k) grid.appendChild(cabTabla(nom+" · la tuya", ic, mundoFilasLiga(k), "Tus puntos + el resto de la fecha, misma física.", false));
        else otras.push([k,nom,ic]);
      });
      cont.appendChild(grid);
      otras.forEach(([k,nom,ic])=>{
        const pu=mundoPuntero(k);
        cont.appendChild(_mPlegable("tab-"+k, ic+" "+nom+(pu&&pu.pj>0?" · puntero "+_nomClub(pu.id)+" ("+pu.pts+")":""), function(d){
          d.appendChild(cabTabla(nom, ic, mundoFilasLiga(k), "No la juegas: se simula igual que un partido tuyo.", false));
        }));
      });
      const plb=mundoPanelLiguillaB(); if(plb) cont.appendChild(plb);
      const ch=E.mundo.copas.chile;
      if(ch&&ch.grupos&&Object.keys(ch.grupos).length) cont.appendChild(_mPlegable("tab-cch","🏆 Copa Chile · grupos"+(ch.ko?" y cuadro":""),function(cont){
        const pc=panel("Copa Chile · grupos","🏆","agua");
        pc.cuerpo.appendChild(el("p","mini","8 grupos (Primera + B). Clasifican 1° y 2°. Segunda no entra. Tus partidos cuentan con tu marcador; el resto se juega en las mismas fechas."));
        const ggrid=el("div","tablas-copa");
        Object.keys(ch.grupos).forEach(letra=>{
          const box=el("div","tabla-grupo");
          box.appendChild(el("h3","sub","Grupo "+letra));
          box.appendChild(mundoPintarTabla(mundoFilasCopa("chile",letra),{compact:true}));
          ggrid.appendChild(box);
        });
        pc.cuerpo.appendChild(ggrid);
        cont.appendChild(pc);
        const k1=mundoPanelLlaves("chile"); if(k1&&ch.ko) cont.appendChild(k1);
      }));
      const cl=E.mundo.copas.copaLiga;
      if(cl&&cl.grupos&&Object.keys(cl.grupos).length) cont.appendChild(_mPlegable("tab-cli","🏆 Copa de la Liga · grupos"+(cl.ko?" y cuadro":""),function(cont){
        const pc=panel("Copa de la Liga · grupos","🏆","agua");
        pc.cuerpo.appendChild(el("p","mini","Solo Primera. 4 grupos de 4, clasifica únicamente el 1°. El campeón es Chile 3 a Libertadores."));
        const ggrid=el("div","tablas-copa");
        Object.keys(cl.grupos).forEach(letra=>{
          const box=el("div","tabla-grupo");
          box.appendChild(el("h3","sub","Grupo "+letra));
          box.appendChild(mundoPintarTabla(mundoFilasCopa("copaLiga",letra),{compact:true}));
          ggrid.appendChild(box);
        });
        pc.cuerpo.appendChild(ggrid);
        cont.appendChild(pc);
        const k2=mundoPanelLlaves("copaLiga"); if(k2&&cl.ko) cont.appendChild(k2);
      }));
      const lib=E.mundo.copas.lib||{};
      const sud=E.mundo.copas.sud||{};
      if((lib.grupos&&Object.keys(lib.grupos).length)||(sud.grupos&&Object.keys(sud.grupos).length)) cont.appendChild(_mPlegable("tab-cnm","🌎 CONMEBOL · grupos 2026",function(cont){
        const p=panel("CONMEBOL · grupos 2026","🌎","agua");
        p.cuerpo.appendChild(el("p","mini","Grupos reales 2026. Se simulan con la misma física Poisson. Si lo juegas tú, vale tu marcador. Sudamericana también tiene tabla."));
        [["lib","Libertadores"],["sud","Sudamericana"]].forEach(([k,nom])=>{
          const pack=E.mundo.copas[k];
          if(!pack||!pack.grupos) return;
          Object.keys(pack.grupos).forEach(letra=>{
            const box=el("div","tabla-grupo");
            box.appendChild(el("h3","sub",nom+" · Grupo "+letra));
            box.appendChild(mundoPintarTabla(mundoFilasConmebol(k,letra),{compact:true}));
            p.cuerpo.appendChild(box);
          });
        });
        cont.appendChild(p);
      }));
      return;
    }
    if(t==="pais"){
      const p=panel("Lo que se jugó en el país","🌎","agua");
      p.cuerpo.appendChild(el("p","mini","Misma física que tus partidos. Si un grande gana en Primera y tú estás en Segunda, ya sabes quién llega brígido."));
      const lista=(E.mundo.pais||[]).slice(-20).reverse();
      if(!lista.length) p.cuerpo.appendChild(el("p","mini","Todavía no hay fecha simulada del resto. Jugá o avanzá una y aparece."));
      lista.forEach(x=>{
        const d=el("div","fila");
        d.innerHTML="<span>"+(x.liga?("<span class='mini'>"+x.liga+" · </span>"):"")+x.a+" vs "+x.b+"</span><b>"+x.ga+"-"+x.gb+"</b>";
        p.cuerpo.appendChild(d);
      });
      cont.appendChild(p);
      return;
    }
    if(t==="chile"||t==="copaLiga"){
      const pack=E.mundo.copas[t];
      const titulo=t==="chile"?"Copa Chile · grupos":"Copa de la Liga · grupos";
      const p=panel(titulo,"🏆","agua");
      if(!pack||!pack.grupos||!Object.keys(pack.grupos).length){ p.cuerpo.appendChild(el("p","mini","Este torneo no corre en esta época.")); cont.appendChild(p); return; }
      p.cuerpo.appendChild(el("p","mini",t==="chile"
        ?"8 grupos (Primera + B). Clasifican 1° y 2°. Segunda NO entra a Copa Chile (bases ANFP)."
        :"Solo Primera. 4 grupos de 4, clasifica únicamente el 1°. El campeón es Chile 3 a Libertadores."));
      Object.keys(pack.grupos).forEach(letra=>{
        p.cuerpo.appendChild(el("h3","sub","Grupo "+letra));
        p.cuerpo.appendChild(mundoPintarTabla(mundoFilasCopa(t, letra),{compact:false}));
      });
      const k=mundoPanelLlaves(t); if(k) cont.appendChild(k);
      cont.appendChild(p);
      return;
    }
    if(t==="conmebol"){
      const p=panel("CONMEBOL 2026 · Libertadores y Sudamericana","🌎","agua");
      p.cuerpo.appendChild(el("p","mini","Grupos documentados (sorteo CONMEBOL 19 mar 2026). Libertadores A–E + Sudamericana A–H. Chile: Coquimbo B y Católica D (Lib); Sudamericana PAL F, AUD G, OHI C. Argentina: Tigre A, San Lorenzo D, Racing E, Riestra F, Barracas G, River H; Lib: Estudiantes A, Independiente Rivadavia C, Boca D, Platense E. Se simulan; tus partidos valen."));
      [["lib","Copa Libertadores"],["sud","Copa Sudamericana"]].forEach(([k,nom])=>{
        const pack=E.mundo.copas[k];
        if(!pack||!pack.grupos||!Object.keys(pack.grupos).length){
          p.cuerpo.appendChild(el("p","mini",nom+": todavía no hay grupos sembrados en esta época."));
          return;
        }
        p.cuerpo.appendChild(el("h3","sub",nom));
        Object.keys(pack.grupos).forEach(letra=>{
          p.cuerpo.appendChild(el("h3","sub","Grupo "+letra));
          p.cuerpo.appendChild(mundoPintarTabla(mundoFilasConmebol(k, letra),{compact:false}));
        });
        (pack.partidos||[]).slice(-8).forEach(x=>{
          p.cuerpo.appendChild(el("div","fila mini","<span>"+x.a+" vs "+x.b+(x.grupo?" · G"+x.grupo:"")+"</span><b>"+x.ga+"-"+x.gb+"</b>"));
        });
      });
      if(typeof FORMAT_COPAS==="object" && FORMAT_COPAS.cupos2026)
        p.cuerpo.appendChild(el("p","mini",FORMAT_COPAS.cupos2026));
      if(typeof FORMAT_COPAS==="object" && FORMAT_COPAS.sudamericana2026)
        p.cuerpo.appendChild(el("p","mini",FORMAT_COPAS.sudamericana2026));
      cont.appendChild(p);
      return;
    }
    if(t==="copaArg"){
      const p=panel("Copa Argentina 2026","🇦🇷","agua");
      p.cuerpo.appendChild(el("p","mini","El mundo es uno: 64 equipos, partido único en cancha neutral, empate a penales (sin alargue). Cruces de 32avos documentados (sorteo 10 dic 2025). Aunque dirijas en Chile, acá ves cómo va. No se inventan clubes."));
      const pack=E.mundo&&E.mundo.copas&&E.mundo.copas.arg;
      const ms=(pack&&pack.partidos)||[];
      const mios=(E.calendario||[]).filter(function(x){ return x.tipo==="copa"&&/Copa Argentina/i.test(x.torneo||""); });
      if(mios.length){
        p.cuerpo.appendChild(el("h3","sub","Tu cuadro"));
        mios.forEach(function(m){
          const marc=m.jugado?(m.gf+"-"+m.gc):"—";
          p.cuerpo.appendChild(el("div","fila","<span>"+(m.ronda||"32avos")+" vs "+(m.rivalNombre||"?")+(m.sede?" · "+m.sede:"")+"</span><b>"+marc+"</b>"));
        });
      }
      if(ms.length){
        p.cuerpo.appendChild(el("h3","sub","Lo que se jugó"));
        ms.slice(-24).reverse().forEach(function(x){
          p.cuerpo.appendChild(el("div","fila","<span><span class='mini'>"+(x.ronda||"")+" · </span>"+x.a+" vs "+x.b+(x.pens?" · penales":"")+"</span><b>"+x.ga+"-"+x.gb+"</b>"));
        });
      } else {
        p.cuerpo.appendChild(el("p","mini","Todavía no se jugó una ronda. Avanza una fecha (febrero en adelante) y acá aparecen los 32avos."));
      }
      cont.appendChild(p);
      return;
    }
    const L=E.mundo.ligas[t];
    if(!L){ cont.appendChild(cabTabla("Tabla","📊",[],"No hay tabla para esta liga en esta época.")); return; }
    const propia=_ligaKeyJugador();
    cont.appendChild(cabTabla(L.nom,"📊", mundoFilasLiga(t),
      t===propia?"Esta es TU liga: los puntos son los que se jugaron (vos + el resto de la fecha).":"No la jugái vos: cada fecha se simula con la misma física.",
      false));
    if(t==="2026b"){ const plb=mundoPanelLiguillaB(); if(plb) cont.appendChild(plb); }
  }
  ops.forEach(([id,nom])=>{
    const b=el("button","ficha"+(E.uiMundoTab===id?" on":""),nom);
    b.onclick=()=>{ E.uiMundoTab=id; [...tabs.children].forEach(x=>x.classList.remove("on")); b.classList.add("on"); pintar(); };
    tabs.appendChild(b);
  });
  const wrap=el("div","mundo-wrap");
  wrap.appendChild(el("h2","tit mundo-tit",esArg?"Tablas de la Liga Profesional":"Tablas del país"));
  wrap.appendChild(el("p","mini",esArg
    ?"Apertura 2026: 2 zonas de 15 (sorteo AFA). 14 PJ de zona. Copa Argentina: 32avos a partido único en cancha neutral, empate a penales. CONMEBOL 2026 de Boca D, Estudiantes A, Platense E, Independiente Rivadavia C."
    :"Primera, B, Segunda Norte y Sur, Copa Chile, Copa Argentina, Copa de la Liga, Libertadores y Sudamericana. Un solo país: tus partidos y los del resto viven en el mismo registro."));
  wrap.appendChild(tabs); wrap.appendChild(cont);
  v.appendChild(wrap);
  pintar();
}

(function wrapMundo(){
  if(typeof nuevaPartida==="function" && !nuevaPartida._mundo74){
    const orig=nuevaPartida;
    nuevaPartida=function(){ const r=orig.apply(this,arguments); try{ mundoInit(); }catch(e){} return r; };
    nuevaPartida._mundo74=true;
  }
  if(typeof simularResto==="function" && !simularResto._mundo74){
    const orig=simularResto;
    simularResto=function(part){ const r=orig.apply(this,arguments); try{ mundoTick(part); }catch(e){} return r; };
    simularResto._mundo74=true;
  }
  if(typeof nuevoAnio==="function" && !nuevoAnio._mundo74){
    const orig=nuevoAnio;
    nuevoAnio=function(){ const r=orig.apply(this,arguments); try{ mundoInit(); }catch(e){} return r; };
    nuevoAnio._mundo74=true;
  }
})();

/* ============================================================
   7.9035 · enganches del universo único
   ============================================================ */
/* tu partido de copa entra al registro ANTES de que la copa decida nada */
function mundoAnotarPartidoJugador(part, yo, otro){
  if(!E||!part||part.tipo!=="copa") return;
  if(typeof mundoEra2026==="function" && !mundoEra2026()) return;
  if(!E.mundo||E.mundo.ver!==2||E.mundo.anio!==E.anio) mundoInit();
  if(!E.mundo||E.mundo.ver!==2) return;
  if(part.f) mundoHasta(part.f);
  mundoRegistrarJugador(part, yo, otro);
  mundoRegistrarLigB(part, yo, otro);
  mundoRegistrarConmebol(part, yo, otro);
}
function _mHeredar(nuevo, viejo){ try{ Object.keys(viejo||{}).forEach(k=>{ nuevo[k]=viejo[k]; }); }catch(e){} return nuevo; }
(function wrapUniverso(){
  /* resolverCopa: el más externo (todas las copas lo envuelven antes que mundo.js) */
  if(typeof resolverCopa==="function" && !resolverCopa._uni){
    const orig=resolverCopa;
    resolverCopa=function(part, yo, otro){
      try{ mundoAnotarPartidoJugador(part, yo, otro); }catch(e){}
      return orig.apply(this, arguments);
    };
    _mHeredar(resolverCopa, orig); resolverCopa._uni=true;
  }
  /* cierre de año: lo pendiente del país se juega ANTES de ascensos y cupos */
  if(typeof finDeTemporada==="function" && !finDeTemporada._uni){
    const orig=finDeTemporada;
    finDeTemporada=function(){
      try{ mundoCompletarTemporada(); }catch(e){}
      return orig.apply(this, arguments);
    };
    _mHeredar(finDeTemporada, orig); finDeTemporada._uni=true;
  }
  if(typeof procesarAscensoDescenso==="function" && !procesarAscensoDescenso._uni){
    const orig=procesarAscensoDescenso;
    procesarAscensoDescenso=function(){
      try{ mundoCompletarTemporada(); }catch(e){}
      const r=orig.apply(this, arguments);
      if(E) E.ascensoAnio=E.anio;                  /* el Doctor compara el campeón de la liguilla con los que subieron */
      return r;
    };
    _mHeredar(procesarAscensoDescenso, orig); procesarAscensoDescenso._uni=true;
  }
  /* las divisiones que no juegas se ordenan por SU tabla, no por fuerza + azar */
  if(typeof _ordenSimDiv==="function" && !_ordenSimDiv._uni){
    const orig=_ordenSimDiv;
    _ordenSimDiv=function(ids){
      try{ const o=mundoOrdenDeIds(ids); if(o&&o.length===ids.length) return o; }catch(e){}
      return orig.apply(this, arguments);
    };
    _mHeredar(_ordenSimDiv, orig); _ordenSimDiv._uni=true;
  }
  /* el global de tu llave sale del registro: la tanda se juega si el GLOBAL empata
     (antes Copa de la Liga y la liguilla miraban solo el partido de vuelta) */
  if(typeof marcadorDefine==="function" && !marcadorDefine._uni){
    const orig=marcadorDefine;
    marcadorDefine=function(P){
      const r=orig.apply(this, arguments);
      try{
        if(!P||!P.part||P.diosForzar) return r;
        if(typeof esLlaveDirecta==="function" && !esLlaveDirecta(P.part)) return r;
        const g=mundoGlobalPrevio(P.part);
        if(!g) return r;
        const m=miMarcador(P), yo=m[0], otro=m[1];
        if(g.unica) return {necesita:yo===otro, yo:yo, otro:otro};
        if(g.pendientes>0) return {necesita:false, yo:yo, otro:otro};
        return {necesita:(g.gf+yo)===(g.gc+otro), yo:yo, otro:otro, acumYo:g.gf+yo, acumEl:g.gc+otro};
      }catch(e){ return r; }
    };
    _mHeredar(marcadorDefine, orig); marcadorDefine._uni=true;
  }
  /* bases ANFP: liguilla de la B y Copa de la Liga (semis y final) van a penales SIN
     alargue; la final de la liguilla sí tiene alargue */
  if(typeof pideProrroga==="function" && !pideProrroga._uni){
    const orig=pideProrroga;
    pideProrroga=function(part){
      if(part&&part.torneo==="Liguilla de Ascenso") return part.ronda==="FINAL";
      if(part&&part.torneo==="Copa de la Liga") return false;
      return orig.apply(this, arguments);
    };
    _mHeredar(pideProrroga, orig); pideProrroga._uni=true;
  }
})();
