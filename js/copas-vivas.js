"use strict";
/* ============================================================
   FUTBOLINI · copas-vivas.js   (Claude · las copas dejan de mostrar SOLO lo jugado)

   BUG REPORTADO POR EL AUTOR, verificado a 390px reales con Playwright:
   - panelCopasPais ("🌎 Copas del país") solo dibujaba partidos YA JUGADOS
     (20 filas, 20 con marcador, 0 con "—"). El jugador nunca veía qué se viene.
   - Los sub-paneles "Grupo X" de Copa Chile / CONMEBOL (dentro de panelCopas)
     dibujaban la tabla del grupo pero CERO filas de partidos: no había forma
     de ver quién juega contra quién en el resto del grupo.

   POR QUÉ pasaba (leído en mundo.js, sin tocarlo): Copa Libertadores y
   Sudamericana SÍ guardan cada partido para siempre (`pack.partidos`, nunca
   se poda). Copa Chile y Copa de la Liga NO: el campo `partidos` existe
   (Copa Chile) o ni existe (Copa de la Liga) pero `mundoSimCopas` nunca lo
   llena — solo empuja al log COMPARTIDO `E.mundo.pais`, que se poda a 40
   apenas crece (mundoTick). Los resultados de grupos ajenos se perdían.

   ARREGLO (wrap, sin tocar mundo.js): se envuelve `mundoSimCopas` y, apenas
   termina, se copian los partidos nuevos de CADA grupo (Chile/CopaLiga/
   Lib/Sud) a un mapa propio por grupo (`g._real`, clave "idA>idB", nunca se
   poda) ANTES de que `mundoTick` recorte `E.mundo.pais`. El pareo real
   (quién juega contra quién, en qué ronda) es determinista: `_rrGrupo(ids)`
   de mundo.js ya lo calcula así — acá solo se LEE, no se reinventa.

   Con eso, `copaGrupoFixture(torneo, letra)` arma la lista COMPLETA del
   grupo: lo jugado con marcador real, lo que falta con "—". Nada inventado:
   si un resultado no se pudo capturar (nunca debería pasar, ver arriba),
   se marca como pendiente en vez de fabricar un marcador.
   ============================================================ */

/* ---------- captura: Copa Chile y Copa de la Liga se ponen al nivel de CONMEBOL ---------- */
function _cvCapturarGrupo(pack, ligaTxt, letra){
  if(!pack||!pack.grupos||!pack.grupos[letra]) return;
  const g=pack.grupos[letra];
  if(!g._real) g._real={};
  ((E.mundo&&E.mundo.pais)||[]).forEach(function(x){
    if(!x||x.liga!==ligaTxt||x.idA==null||x.idB==null) return;
    const k=x.idA+">"+x.idB;
    if(g._real[k]) return;
    g._real[k]={a:x.a,b:x.b,ga:x.ga,gb:x.gb};
  });
}
(function wrapMundoSimCopasVivas(){
  if(typeof mundoSimCopas!=="function"||mundoSimCopas._cvivas) return;
  const orig=mundoSimCopas;
  mundoSimCopas=function(f,n){
    const r=orig.apply(this,arguments);
    try{
      if(E&&E.mundo&&E.mundo.copas){
        const ch=E.mundo.copas.chile;
        if(ch&&ch.grupos) Object.keys(ch.grupos).forEach(function(L){ _cvCapturarGrupo(ch,"Copa Chile · Grupo "+L,L); });
        const cl=E.mundo.copas.copaLiga;
        if(cl&&cl.grupos) Object.keys(cl.grupos).forEach(function(L){ _cvCapturarGrupo(cl,"Copa de la Liga · Grupo "+L,L); });
        const lib=E.mundo.copas.lib;
        if(lib&&lib.grupos) Object.keys(lib.grupos).forEach(function(L){ _cvCapturarGrupo(lib,"Libertadores · Grupo "+L,L); });
        const sud=E.mundo.copas.sud;
        if(sud&&sud.grupos) Object.keys(sud.grupos).forEach(function(L){ _cvCapturarGrupo(sud,"Sudamericana · Grupo "+L,L); });
      }
    }catch(e){}
    return r;
  };
  /* hereda las marcas de wraps anteriores (patrón del repo) */
  try{ Object.keys(orig).forEach(function(k){ mundoSimCopas[k]=orig[k]; }); }catch(e){}
  mundoSimCopas._cvivas=true;
})();

/* ---------- nombre de un id dentro de un grupo (CONMEBOL trae nombres propios) ---------- */
function _cvNombre(g,id){
  if(g&&g.nom&&g.nom[id]) return g.nom[id];
  const c=(typeof clubMundo==="function")?clubMundo(id):null;
  return c?(c.c||c.n):id;
}
const CV_TOR_LIGA={chile:"Copa Chile",copaLiga:"Copa de la Liga",lib:"Libertadores",sud:"Sudamericana"};
const CV_TOR_NOM={chile:"Copa Chile",copaLiga:"Copa de la Liga",lib:"Copa Libertadores",sud:"Copa Sudamericana"};

/* ---------- la lista completa de un grupo: jugado con marcador, pendiente con "—" ---------- */
function copaGrupoFixture(torneo, letra){
  const pack=E&&E.mundo&&E.mundo.copas&&E.mundo.copas[torneo];
  if(!pack||!pack.grupos||!pack.grupos[letra]) return {filas:[],cerrado:false,total:0};
  const g=pack.grupos[letra], ids=g.ids||[];
  if(ids.length<2||typeof _rrGrupo!=="function") return {filas:[],cerrado:false,total:0};
  const fx=_rrGrupo(ids);           /* fx = rondas; cada ronda trae 2 pares simultáneos */
  const real=g._real||{};
  const torNom=CV_TOR_NOM[torneo];
  const filas=[];
  /* ida y vuelta contra el mismo rival son DOS filas distintas. Buscar solo
     por rivalId asignaba el único partido jugado a las dos (doble conteo).
     Se marca cada entrada de E.calendario como "usada" apenas se asigna. */
  const usados=new Set();
  fx.forEach(function(fecha){
    (fecha||[]).forEach(function(par){
      const a=par[0], b=par[1];
      const esMia=E.club&&(a===E.club||b===E.club);
      const row={idA:a,idB:b,nA:_cvNombre(g,a),nB:_cvNombre(g,b),jugado:false,ga:null,gb:null,mia:!!esMia};
      if(esMia){
        const otro=a===E.club?b:a;
        const mio=(E.calendario||[]).find(function(p){
          return p.tipo==="copa"&&p.jugado&&p.ronda==="Grupo "+letra&&p.rivalId===otro&&(!torNom||p.torneo===torNom)&&!usados.has(p);
        });
        if(mio){ usados.add(mio); row.jugado=true; if(a===E.club){ row.ga=mio.gf; row.gb=mio.gc; } else { row.ga=mio.gc; row.gb=mio.gf; } }
      } else {
        const r=real[a+">"+b];
        if(r){ row.jugado=true; row.ga=r.ga; row.gb=r.gb; }
      }
      filas.push(row);
    });
  });
  return {filas:filas, cerrado:(pack.ronda||0)>=fx.length, total:fx.length};
}

/* ---------- próximos cruces del país (el hueco original: solo se veía lo jugado) ---------- */
function copasPaisProximos(max){
  max=max||8;
  const out=[];
  if(!E||!E.mundo||!E.mundo.copas) return out;
  ["chile","copaLiga","lib","sud"].forEach(function(tor){
    const pack=E.mundo.copas[tor]; if(!pack||!pack.grupos) return;
    Object.keys(pack.grupos).forEach(function(letra){
      const r=copaGrupoFixture(tor,letra);
      const prox=r.filas.filter(function(f){ return !f.jugado&&!f.mia; })[0];
      if(prox) out.push({liga:CV_TOR_LIGA[tor]+" · Grupo "+letra, a:prox.nA, b:prox.nB});
    });
  });
  return out.slice(0,max);
}
/* ---------- ¿algún grupo del país sigue con partidos por jugar? ---------- */
function copasPaisConPendientes(){
  if(!E||!E.mundo||!E.mundo.copas) return false;
  return ["chile","copaLiga","lib","sud"].some(function(tor){
    const pack=E.mundo.copas[tor]; if(!pack||!pack.grupos) return false;
    return Object.keys(pack.grupos).some(function(letra){
      const g=pack.grupos[letra], ids=g.ids||[];
      if(ids.length<2) return false;
      return (pack.ronda||0)<(ids.length-1)*2;
    });
  });
}
