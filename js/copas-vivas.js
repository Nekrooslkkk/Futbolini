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

/* 7.9035 · ya no hace falta "capturar" nada: desde el universo único (mundo.js) cada
   grupo guarda su fixture con fechas (g.fx / g.fechas) y TODOS sus resultados (g.res,
   los tuyos incluidos). Acá solo se lee ese registro. */

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
  if(ids.length<2) return {filas:[],cerrado:false,total:0};
  const fx=g.fx||((typeof _fxGrupo4==="function")?_fxGrupo4(ids):[]);
  const res=g.res||{}, filas=[];
  fx.forEach(function(md,i){
    (md||[]).forEach(function(par){
      const a=par[0], b=par[1], esMia=!!(E.club&&(a===E.club||b===E.club));
      const row={idA:a,idB:b,nA:_cvNombre(g,a),nB:_cvNombre(g,b),jugado:false,ga:null,gb:null,mia:esMia,
        f:(g.fechas&&g.fechas[i])||null, fecha:i+1};
      let r=res[i+"|"+a+"|"+b];
      /* CONMEBOL: tus partidos se guardan aparte (g.mios), una vez cada uno */
      if(!r && esMia && g.mios){ const m=g.mios.find(function(x){ return x.a===a&&x.b===b; }); if(m) r=[m.ga,m.gb]; }
      if(r){ row.jugado=true; row.ga=r[0]; row.gb=r[1]; }
      filas.push(row);
    });
  });
  return {filas:filas, cerrado:filas.length>0&&filas.every(function(f){ return f.jugado; }), total:fx.length};
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
      return copaGrupoFixture(tor,letra).filas.some(function(f){ return !f.jugado; });
    });
  });
}
