"use strict";
/* ============================================================
   FUTBOLINI 7.75 · mundo.js
   El país se simula aunque no lo juegues. Tablas de las 3
   divisiones, Copa Chile, Copa de la Liga, Libertadores y
   Sudamericana de los chilenos. Misma física que 7.72
   (Poisson + forma + localía). En Calendario: TODAS las tablas.
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
  return null;
}
function _nomClub(id){ const c=clubMundo(id); return c?(c.c||c.n):id; }
function _fila0(){ return {pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}; }
function _golesM(a,b){
  if(typeof _golesSimulados==="function") return _golesSimulados(a||{fuerza:55,id:"x"}, b||{fuerza:55,id:"y"});
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
  }).sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf);
}

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
  return null;
}
function _clubsDeLiga(key){
  if(key==="arg2026" && typeof LIGA_ARG_2026!=="undefined") return LIGA_ARG_2026.slice();
  if((key==="arg2026A"||key==="arg2026B") && typeof LIGA_ARG_2026!=="undefined"){
    const z=key==="arg2026A"?"A":"B";
    return LIGA_ARG_2026.filter(c=>c.z===z);
  }
  if(key==="2026" && typeof LIGA_2026!=="undefined") return LIGA_2026.slice();
  if(key==="2026b" && typeof LIGA_B_2026!=="undefined") return LIGA_B_2026.slice();
  if((key==="2026cN"||key==="2026cS") && typeof LIGA_C_2026!=="undefined"){
    const z=key==="2026cN"?"norte":"sur";
    return LIGA_C_2026.filter(c=>c.z===z);
  }
  return [];
}
function _fxLiga(clubs){
  if(typeof fixturesLiga==="function") return fixturesLiga(clubs);
  return [];
}

function mundoInit(){
  if(!E) return;
  const anio=E.anio||2026;
  const M={ anio:anio, ligas:{}, copas:{chile:{}, copaLiga:{}, lib:{}, sud:{}}, noticias:[], pais:[], tick:-1 };
  ["2026","2026b","2026cN","2026cS","arg2026A","arg2026B"].forEach(k=>{
    const clubs=_clubsDeLiga(k);
    if(!clubs.length) return;
    const tab={}; clubs.forEach(c=>tab[c.id]=_fila0());
    M.ligas[k]={ ids:clubs.map(c=>c.id), tab:tab, fx:_fxLiga(clubs), ronda:0, nom:_nomLiga(k) };
  });
  if(typeof COPA_CHILE_GRUPOS_2026==="object"){
    M.copas.chile.grupos={}; M.copas.chile.ronda=0; M.copas.chile.partidos=[];
    Object.keys(COPA_CHILE_GRUPOS_2026).forEach(letra=>{
      const ids=COPA_CHILE_GRUPOS_2026[letra].slice();
      const tab={}; ids.forEach(id=>tab[id]=_fila0());
      M.copas.chile.grupos[letra]={ids:ids, tab:tab};
    });
  }
  if(typeof COPA_LIGA_GRUPOS_2026==="object"){
    M.copas.copaLiga.grupos={}; M.copas.copaLiga.ronda=0;
    Object.keys(COPA_LIGA_GRUPOS_2026).forEach(letra=>{
      const ids=COPA_LIGA_GRUPOS_2026[letra].slice();
      const tab={}; ids.forEach(id=>tab[id]=_fila0());
      M.copas.copaLiga.grupos[letra]={ids:ids, tab:tab};
    });
  }
  M.copas.lib.clubs={}; M.copas.lib.partidos=[]; M.copas.lib.grupos={};
  M.copas.sud.clubs={}; M.copas.sud.partidos=[]; M.copas.sud.grupos={};
  if(typeof CONMEBOL_GRUPOS_2026==="object"){
    ["lib","sud"].forEach(tor=>{
      (CONMEBOL_GRUPOS_2026[tor]||[]).forEach(g=>{
        const tab={}; g.ids.forEach(id=>tab[id]=_fila0());
        M.copas[tor].grupos[g.letra]={ids:g.ids.slice(), tab:tab, nom:g.nom||{}, fue:g.fue||{}, chile:g.chile||[], arg:g.arg||[]};
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
  E.mundo=M;
}

function _nomLiga(k){
  return { "2026":"Liga de Primera", "2026b":"Liga de Ascenso (B)",
    "2026cN":"Segunda · Zona Norte", "2026cS":"Segunda · Zona Sur",
    "arg2026A":"Apertura · Zona A", "arg2026B":"Apertura · Zona B",
    "arg2026":"Liga Profesional Argentina" }[k]||k;
}

function mundoTick(part){
  if(!E) return;
  if(!E.mundo||E.mundo.anio!==E.anio) mundoInit();
  const n=(part&&part.fecha)?part.fecha:((E.idx||0)+1);
  const target=(part&&part.fxRonda!=null)?(part.fxRonda+1):n;
  if(E.mundo.tick===n && !(part&&part.fxRonda!=null)) return;
  E.mundo.tick=n;
  const propia=_ligaKeyJugador();
  Object.keys(E.mundo.ligas).forEach(k=>{
    if(k===propia) return;
    mundoAlcanzarRondaLiga(k, target);
  });
  if(propia && E.tabla && E.mundo.ligas[propia]){
    Object.keys(E.tabla).forEach(id=>{
      const t=E.tabla[id];
      if(t) E.mundo.ligas[propia].tab[id]={pj:t.pj,pg:t.pg,pe:t.pe,pp:t.pp,gf:t.gf,gc:t.gc,pts:t.pts};
    });
    E.mundo.ligas[propia].ronda=Math.max(E.mundo.ligas[propia].ronda||0, target);
  }
  mundoSimCopas(part&&part.f, n);
  mundoArmarNoticias(part);
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
    const [ga,gb]=_golesM(a,b);
    _aplicarTabla(L.tab, a.id, b.id, ga, gb);
    pais.push({a:a.c||a.n, b:b.c||b.n, ga:ga, gb:gb, liga:L.nom, idA:a.id, idB:b.id});
  });
  L.ronda=rondaIdx+1;
  E.mundo.pais=(E.mundo.pais||[]).concat(pais).slice(-40);
}

function _rrGrupo(ids){
  const fx=[];
  const rot=ids.slice(1), fijo=ids[0];
  for(let r=0;r<3;r++){
    const orden=[fijo].concat(rot);
    const fecha=[];
    for(let i=0;i<2;i++) fecha.push([orden[i], orden[3-i]]);
    fx.push(fecha);
    rot.unshift(rot.pop());
  }
  const vuelta=fx.map(f=>f.map(p=>[p[1],p[0]]));
  return fx.concat(vuelta);
}

function mundoSimCopas(f, n){
  const mes=f&&f.m?f.m:((n<=4)?3:(n<=12)?6:(n<=20)?8:10);
  const ch=E.mundo.copas.chile;
  if(ch&&ch.grupos){
    const fechas=(typeof COPA_CHILE_FECHAS_2026!=="undefined")?COPA_CHILE_FECHAS_2026:
      [{m:1},{m:2},{m:6},{m:6},{m:7},{m:8}];
    let want=0;
    for(let i=0;i<fechas.length;i++) if((fechas[i].m||1)<=mes) want=i+1;
    while((ch.ronda||0)<want){
      const r=ch.ronda||0;
      Object.keys(ch.grupos).forEach(letra=>{
        const g=ch.grupos[letra];
        const fx=_rrGrupo(g.ids);
        (fx[r]||[]).forEach(par=>{
          if(E.club && (par[0]===E.club||par[1]===E.club)){
            const mio=(E.calendario||[]).find(p=>p.tipo==="copa"&&p.torneo==="Copa Chile"&&p.jugado&&p.rivalId&&(p.rivalId===par[0]||p.rivalId===par[1]));
            if(mio){
              const yo=mio.local?E.club:mio.rivalId, otro=mio.local?mio.rivalId:E.club;
              const ga=mio.local?mio.gf:mio.gc, gb=mio.local?mio.gc:mio.gf;
              if(yo&&otro) _aplicarTabla(g.tab, yo, otro, ga||0, gb||0);
            }
            return;
          }
          const a=clubMundo(par[0]), b=clubMundo(par[1]);
          if(!a||!b) return;
          const [ga,gb]=_golesM(a,b);
          _aplicarTabla(g.tab, a.id, b.id, ga, gb);
          E.mundo.pais.push({a:a.c||a.n,b:b.c||b.n,ga:ga,gb:gb,liga:"Copa Chile · Grupo "+letra,idA:a.id,idB:b.id});
        });
      });
      ch.ronda=(ch.ronda||0)+1;
    }
  }
  const cl=E.mundo.copas.copaLiga;
  if(cl&&cl.grupos){
    const fechas=(typeof COPA_LIGA_FECHAS_2026!=="undefined")?COPA_LIGA_FECHAS_2026:[{m:3},{m:3},{m:3},{m:5},{m:5},{m:6}];
    let want=0;
    for(let i=0;i<fechas.length;i++) if((fechas[i].m||3)<=mes) want=i+1;
    while((cl.ronda||0)<want){
      const r=cl.ronda||0;
      Object.keys(cl.grupos).forEach(letra=>{
        const g=cl.grupos[letra];
        const fx=_rrGrupo(g.ids);
        (fx[r]||[]).forEach(par=>{
          if(E.club && (par[0]===E.club||par[1]===E.club)) return;
          const a=clubMundo(par[0]), b=clubMundo(par[1]);
          if(!a||!b) return;
          const [ga,gb]=_golesM(a,b);
          _aplicarTabla(g.tab, a.id, b.id, ga, gb);
          E.mundo.pais.push({a:a.c||a.n,b:b.c||b.n,ga:ga,gb:gb,liga:"Copa de la Liga · Grupo "+letra,idA:a.id,idB:b.id});
        });
      });
      cl.ronda=(cl.ronda||0)+1;
    }
  }
  if(n>0){
    ["lib","sud"].forEach(tor=>{
      const pack=E.mundo.copas[tor];
      if(!pack||!pack.grupos) return;
      pack.ronda=pack.ronda||0;
      const want=Math.min(6, Math.max(0, Math.floor((n-1)/2))); /* 6 fechas de grupo a lo largo del año */
      while((pack.ronda||0)<want){
        const r=pack.ronda||0;
        Object.keys(pack.grupos).forEach(letra=>{
          const g=pack.grupos[letra];
          const fx=_rrGrupo(g.ids);
          (fx[r]||[]).forEach(par=>{
            if(E.club && (par[0]===E.club||par[1]===E.club)){
              const mio=(E.calendario||[]).find(p=>p.tipo==="copa"&&p.jugado&&p.ronda==="Grupo "+letra&&p.rivalId&&(p.rivalId===par[0]||p.rivalId===par[1]));
              if(mio){
                const yo=mio.local?E.club:mio.rivalId, otro=mio.local?mio.rivalId:E.club;
                const ga=mio.local?mio.gf:mio.gc, gb=mio.local?mio.gc:mio.gf;
                if(yo&&otro){
                  _aplicarTabla(g.tab, yo, otro, ga||0, gb||0);
                  if(pack.clubs[yo]) _aplicarTabla(pack.clubs, yo, otro, ga||0, gb||0);
                }
              }
              return;
            }
            const a=_clubConmebol(par[0], g), b=_clubConmebol(par[1], g);
            if(!a||!b) return;
            const [ga,gb]=_golesM(a,b);
            _aplicarTabla(g.tab, par[0], par[1], ga, gb);
            if(pack.clubs[par[0]]) _aplicarTabla(pack.clubs, par[0], par[1], ga, gb);
            pack.partidos.push({a:a.n, b:b.n, ga:ga, gb:gb, grupo:letra, tor:tor});
            E.mundo.pais.push({a:a.n,b:b.n,ga:ga,gb:gb,liga:(tor==="lib"?"Libertadores":"Sudamericana")+" · Grupo "+letra,idA:par[0],idB:par[1]});
          });
        });
        pack.ronda=(pack.ronda||0)+1;
      }
    });
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
        (E.eraBase==="2026c"||E.eraBase==="2026b"?" Si subís, ese es el que te va a esperar.":"")});
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

function panelMundoCalendario(v){
  if(!E||!E.mundo) return;
  if(!mundoEra2026()) return;
  const esArg=E.eraBase==="arg2026";
  const tabs=el("div","mundo-tabs");
  const cont=el("div","mundo-cont");
  if(!E.uiMundoTab) E.uiMundoTab="tablas";
  const ops=esArg
    ?[["tablas","Tablas"],["arg2026A","Zona A"],["arg2026B","Zona B"],["conmebol","CONMEBOL"],["copaArg","Copa Argentina"],["pais","Resultados"]]
    :[["tablas","Tablas"],["2026","Primera"],["2026b","Primera B"],["2026cN","2ª Norte"],["2026cS","2ª Sur"],["chile","Copa Chile"],["copaLiga","Copa de la Liga"],["conmebol","CONMEBOL"],["pais","Resultados"]];
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
            propia?"Tus puntos + el resto de la fecha, misma física Poisson.":"No la jugás: se simula igual, ronda a ronda. Nadie empieza con 14 PJ.", false));
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
        :"Tablas del país entero. Se llenan al avanzar: Primera, B, las dos zonas de Segunda, Copa Chile, Copa de la Liga y los chilenos en CONMEBOL.";
      cont.appendChild(intro);
      const grid=el("div","tablas-pais");
      [
        ["2026","Liga de Primera","📊"],
        ["2026b","Liga de Ascenso (B)","📊"],
        ["2026cN","Segunda · Zona Norte","📊"],
        ["2026cS","Segunda · Zona Sur","📊"]
      ].forEach(([k,nom,ic])=>{
        if(!E.mundo.ligas[k]) return;
        const propia=_ligaKeyJugador()===k;
        grid.appendChild(cabTabla(nom+(propia?" · la tuya":""), ic, mundoFilasLiga(k),
          propia?"Tus puntos + el resto de la fecha, misma física.":"No la juegas: se simula igual que un partido tuyo.", false));
      });
      cont.appendChild(grid);
      const ch=E.mundo.copas.chile;
      if(ch&&ch.grupos&&Object.keys(ch.grupos).length){
        const pc=panel("Copa Chile · grupos","🏆","agua");
        pc.cuerpo.appendChild(el("p","mini","8 grupos (Primera + B). Clasifican 1° y 2°. Segunda 2026 no entra. El resto del grupo se simula; si lo jugái vos, vale tu marcador."));
        const ggrid=el("div","tablas-copa");
        Object.keys(ch.grupos).forEach(letra=>{
          const box=el("div","tabla-grupo");
          box.appendChild(el("h3","sub","Grupo "+letra));
          box.appendChild(mundoPintarTabla(mundoFilasCopa("chile",letra),{compact:true}));
          ggrid.appendChild(box);
        });
        pc.cuerpo.appendChild(ggrid);
        cont.appendChild(pc);
      }
      const cl=E.mundo.copas.copaLiga;
      if(cl&&cl.grupos&&Object.keys(cl.grupos).length){
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
      }
      const lib=E.mundo.copas.lib||{};
      const sud=E.mundo.copas.sud||{};
      if((lib.grupos&&Object.keys(lib.grupos).length)||(sud.grupos&&Object.keys(sud.grupos).length)){
        const p=panel("CONMEBOL · grupos 2026","🌎","agua");
        p.cuerpo.appendChild(el("p","mini","Grupos reales 2026. Se simulan con la misma física Poisson. Si lo jugás vos, vale tu marcador. Sudamericana también tiene tabla."));
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
      }
      return;
    }
    if(t==="pais"){
      const p=panel("Lo que se jugó en el país","🌎","agua");
      p.cuerpo.appendChild(el("p","mini","Misma física que tus partidos. Si un grande gana en Primera y vos estás en Segunda, ya sabés quién llega brigido."));
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
      if(!pack||!pack.grupos){ p.cuerpo.appendChild(el("p","mini","Este torneo no corre en esta época.")); cont.appendChild(p); return; }
      p.cuerpo.appendChild(el("p","mini",t==="chile"
        ?"8 grupos (Primera + B). Clasifican 1° y 2°. Segunda NO entra a Copa Chile 2026 (bases ANFP)."
        :"Solo Primera. 4 grupos de 4, clasifica únicamente el 1°. El campeón es Chile 3 a Libertadores."));
      Object.keys(pack.grupos).forEach(letra=>{
        p.cuerpo.appendChild(el("h3","sub","Grupo "+letra));
        p.cuerpo.appendChild(mundoPintarTabla(mundoFilasCopa(t, letra),{compact:false}));
      });
      cont.appendChild(p);
      return;
    }
    if(t==="conmebol"){
      const p=panel("CONMEBOL 2026 · Libertadores y Sudamericana","🌎","agua");
      p.cuerpo.appendChild(el("p","mini","Grupos documentados (CONMEBOL / TyC 2026). Chile: Coquimbo B, Católica D; Sudamericana PAL F, AUD G, OHI C (tras Fase 3). Argentina: Estudiantes A, Independiente Rivadavia C, Boca D, Platense E. Se simulan; tus partidos valen."));
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
      const p=panel("Copa Argentina 2026","🏆","agua");
      p.cuerpo.appendChild(el("p","mini","64 equipos, partido único en cancha neutral. Empate: penales, sin alargue. El campeón entra a Libertadores 2027. Cruces de 32avos documentados (sorteo 10 dic 2025). El marcador lo jugás vos; no se copia el resultado histórico."));
      const ms=(E.calendario||[]).filter(x=>x.tipo==="copa"&&/Copa Argentina/i.test(x.torneo||""));
      if(!ms.length) p.cuerpo.appendChild(el("p","mini","Este club todavía no tiene Copa Argentina en el calendario (o no es un club AFA)."));
      else ms.forEach(m=>{
        const marc=m.jugado?(m.gf+"-"+m.gc):"—";
        p.cuerpo.appendChild(el("div","fila","<span>"+(m.ronda||"32avos")+" vs "+(m.rivalNombre||"?")+(m.sede?" · "+m.sede:"")+"</span><b>"+marc+"</b>"));
      });
      cont.appendChild(p);
      return;
    }
    const L=E.mundo.ligas[t];
    if(!L){ cont.appendChild(cabTabla("Tabla","📊",[],"No hay tabla para esta liga en esta época.")); return; }
    const propia=_ligaKeyJugador();
    cont.appendChild(cabTabla(L.nom,"📊", mundoFilasLiga(t),
      t===propia?"Esta es TU liga: los puntos son los que se jugaron (vos + el resto de la fecha).":"No la jugái vos: cada fecha se simula con la misma física.",
      false));
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
    :"Primera, B, Segunda Norte y Sur, Copa Chile, Copa de la Liga, Libertadores y Sudamericana. Aunque no las juegues, se simulan. La tuya va marcada."));
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
