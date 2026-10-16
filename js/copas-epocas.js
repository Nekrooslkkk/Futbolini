"use strict";
/* ============================================================
   FUTBOLINI · copas-epocas.js — LA COPA CHILE CAMBIA CON LOS AÑOS (7.9138)
   Pedido del autor: "mejorar el sistema de copas: ve cómo se hizo la Copa Chile que tenía equipos de Tercera, porque
   tener la misma copa obviamente no es siempre así, generalmente varía; cuanto más tiempo pase, ahí podríamos definir
   ciertos modelos MÁS ÉPICOS… el futuro del fútbol también está en juego". Idea aprobada: formatos REALES con fuente +
   futuros marcados como ficción del juego.

   - LA HISTORIA REAL (COPA_CHILE_HISTORIA): cada edición 1958–2025 con su campeón y cómo se jugó, leída en
     es.wikipedia.org/wiki/Copa_Chile (consultado el 16 oct 2026). Se ve en el panel de copas («📜 La Copa Chile en la
     historia»). Nada inventado: si el artículo no detalla el formato, dice "formato no detallado".
   - LOS MODELOS (COPA_CHILE_MODELOS): 2026 es el real (Primera y B). Desde 2027 el Consejo de Presidentes puede
     reformarla (sorteado por partida, cada 2 años como mínimo; siempre el mismo para la misma partida) y cada modelo
     dice en qué edición real se inspira:
       · «Primera y B» (2026) · «Las tres categorías» (entra la Segunda; como 2021) · «La Copa de Todos» (Segunda y
         campeones amateur regionales invitados; como 2008-09 a 2010 y 2022) · «Final de ida y vuelta» (como 2018).
     El modelo cambia el sorteo de verdad (mundo.js) y tu calendario: con Segunda o invitados, un club de Segunda
     JUEGA la Copa Chile; con final de ida y vuelta, la final son dos partidos.
   - Los invitados amateur son genéricos ("Campeón amateur de Ñuble"): no se inventan clubes reales.
   ============================================================ */
const COPA_CHILE_FUENTE={url:"https://es.wikipedia.org/wiki/Copa_Chile", consultado:"2026-10-16"};
const COPA_CHILE_HISTORIA=[
  [1958,"Colo-Colo","Eliminación con clubes de Primera y Segunda"],[1959,"Santiago Wanderers","Formato no detallado; final en el Estadio Nacional"],
  [1960,"Deportes La Serena","Copa Preparación: grupos y eliminación directa"],[1961,"Santiago Wanderers","Llaves de eliminación; final de ida y vuelta"],
  [1962,"Luis Cruz Martínez","Copa de Preparación; campeón un club de ascenso"],["1963–1973",null,"Sin competencia oficial de copa"],
  [1974,"Colo-Colo","Formato no detallado"],[1975,"Palestino","Llaves de ida y vuelta; final a partido único"],[1976,null,"No se jugó"],
  [1977,"Palestino","Final con alargue"],[1978,null,"No se jugó"],[1979,"Universidad de Chile","Copa Polla Gol: solo Primera, grupos, cuartos de ida y vuelta, semi y final únicas"],
  [1980,"Deportes Iquique","Grupos y luego eliminación directa"],[1981,"Colo-Colo","Formato no detallado"],[1982,"Colo-Colo","Desde cuartos, liguilla final de 4"],
  [1983,"Universidad Católica","Liguilla final"],[1984,"Everton","Cuatro grupos de Primera; semifinal y final única"],
  [1985,"Colo-Colo","Cinco grupos de 8 a dos ruedas; cuartos"],[1986,"Cobreloa","Copa Polla LAN Chile: dos grupos de 10 de Primera; final en tres partidos"],
  [1987,"Cobresal","Copa LAN Chile: grupos de 8; final entre los ganadores"],[1988,"Colo-Colo","Copa DIGEDER: cuatro grupos de 10 con clubes de ascenso"],
  [1989,"Colo-Colo","Copa DIGEDER: mismo formato"],[1990,"Colo-Colo","Copa DIGEDER: dos zonas de 8; final a partido único"],
  [1991,"Universidad Católica","Seis grupos de 6 (Primera y ascenso); octavos de ida y vuelta; final única"],[1992,"Unión Española","Formato no detallado"],
  [1993,"Unión Española","Grupos, luego cuatro grupos de 4; semis y final únicas"],[1994,"Colo-Colo","Grupos y eliminación de ida y vuelta; final única"],
  [1995,"Universidad Católica","Grupos separados de Primera y de ascenso; segunda fase"],[1996,"Colo-Colo","Copa Eduardo Simian: cuartos con 4 de Primera y 4 de la B; todo de ida y vuelta"],
  [1997,null,"No se jugó"],[1998,"Universidad de Chile","Copa Apertura: solo Primera, cuatro grupos de 4; final de ida y vuelta"],[1999,null,"No se jugó"],
  [2000,"Universidad de Chile","Copa Apertura: mismo formato de 1998"],["2001–2007",null,"No se jugó"],
  ["2008-09","Universidad de Concepción","Edición 2008-09: entran clubes de Tercera y de la ANFA"],
  [2009,"Unión San Felipe","Eliminación a un partido, el de menor división siempre de local; cupo a la Sudamericana; final única en Valparaíso"],
  [2010,"Deportes Iquique","Copa Chile Bicentenario: mismo formato; campeón en penales"],[2011,"Universidad Católica","Tabla de 36 clubes para definir 8; ida y vuelta"],
  ["2012/13","Universidad de Chile"," fase previa y 8 grupos de 4 (32 clubes); final única en sede neutral"],["2013/14","Deportes Iquique"," final en el Monumental"],
  ["2014-15","Universidad de Concepción"," final en Talca"],[2015,"Universidad de Chile"," final en La Serena, en penales"],
  [2016,"Colo-Colo","Desde esta edición el campeón va a la Libertadores (Chile 4)"],[2017,"Santiago Wanderers","Mismo formato; final en Concepción"],
  [2018,"Palestino","Eliminación directa; la final a doble partido"],[2019,"Colo-Colo","El estallido social movió las semis y la final a enero de 2020; final en Temuco"],
  [2020,null,"Suspendida por la pandemia"],[2021,"Colo-Colo","Eliminación directa con 45 equipos de todas las categorías profesionales de la ANFP"],
  [2022,"Magallanes","Invitados de Tercera B y campeones amateur regionales; final en penales"],[2023,"Colo-Colo","Fase regional (cuatro etapas) y fase nacional; final en Iquique"],
  [2024,"Universidad de Chile","Mismo formato que 2023; final en el Estadio Nacional"],[2025,"Huachipato","Final en penales ante Deportes Limache en El Teniente"]
].map(x=>({anio:String(x[0]), campeon:x[1], formato:x[2]}));

const COPA_CHILE_MODELOS={
  clasica:{n:"Primera y B", ic:"🏆", grupo:["P","P","B","B"], finalUnica:true,
    d:"32 clubes: 8 grupos de 4 (2 de Primera y 2 de la B), ida y vuelta; octavos, cuartos y semis de ida y vuelta; final única en sede neutral.",
    base:"El formato real de 2026 (bases de la ANFP)."},
  todas:{n:"Las tres categorías", ic:"🧩", grupo:["P","P","B","C"], finalUnica:true,
    d:"Entra la Segunda: 8 grupos de 4 (2 de Primera, 1 de la B y 1 de Segunda). El resto de la B y de la Segunda quedó en la fase previa.",
    base:"Inspirado en 2021, cuando jugaron 45 equipos de todas las categorías profesionales de la ANFP."},
  deTodos:{n:"La Copa de Todos", ic:"🔥", grupo:["P","P","B","X"], finalUnica:true,
    d:"Vuelven los invitados: clubes de Segunda y campeones amateur regionales. 8 grupos de 4 (2 de Primera, 1 de la B y 1 «chico»). Cualquiera le puede amargar el año a un grande.",
    base:"Inspirado en 2008-09 a 2010 (clubes de Tercera y de la ANFA) y en 2022 (Tercera B y campeones amateur regionales invitados)."},
  dobleFinal:{n:"Final de ida y vuelta", ic:"🔁", grupo:["P","P","B","B"], finalUnica:false,
    d:"El mismo formato de Primera y B, pero la final se juega en los dos estadios.",
    base:"Como en 2018, cuando la final se jugó a doble partido."}
};
const COPA_CHILE_PESOS=[["clasica",3],["todas",2],["deTodos",2],["dobleFinal",1]];
const CCH_AMATEUR=["Atacama","Coquimbo","Valparaíso","O'Higgins","Maule","Ñuble","La Araucanía","Los Lagos"].map((r,i)=>({
  id:"AMA"+(i+1), n:"Campeón amateur de "+r, c:"Amateur "+r, fuerza:30+((i*7)%9), aforo:1500, est:"Cancha municipal", ciudad:"", amateur:true}));

/* ---------- qué modelo se juega cada año (2026 real; desde 2027 lo decide el Consejo) ---------- */
function _cchRnd(clave){
  const sal=(typeof _mSemillaPartida==="function")?_mSemillaPartida():"";
  return (typeof azarFijo==="function"&&typeof semilla==="function")?azarFijo(semilla("reformaCCH|"+clave+"|"+sal)):Math.random;
}
function copaChileModeloId(anio){
  anio=anio||((typeof E!=="undefined"&&E&&E.anio)||2026);
  if(anio<=2026||typeof E==="undefined"||!E) return "clasica";
  E.copaChile=E.copaChile||{mod:{}};
  const M=E.copaChile.mod; if(!M[2026]) M[2026]="clasica";
  if(M[anio]) return M[anio];
  let prev=copaChileModeloId(anio-1), desde=anio-1;
  while(desde>2026&&M[desde-1]===prev) desde--;
  let id=prev;
  const rr=_cchRnd(anio);
  if(anio-desde>=2&&rr()<0.35){
    const ops=COPA_CHILE_PESOS.filter(p=>p[0]!==prev), tot=ops.reduce((s,p)=>s+p[1],0); let r=rr()*tot;
    for(const p of ops){ r-=p[1]; if(r<=0){ id=p[0]; break; } }
  }
  M[anio]=id;
  return id;
}
function copaChileModelo(anio){ const id=copaChileModeloId(anio); return Object.assign({id:id, real:(anio||0)<=2026}, COPA_CHILE_MODELOS[id]); }
function copaFinalUnica(tor){ if(tor!=="chile") return true; return copaChileModelo((typeof E!=="undefined"&&E&&E.anio)||2026).finalUnica!==false; }

/* ---------- el sorteo según el modelo (el jugador siempre entra si su categoría juega) ---------- */
function _cchIds(key){ return (typeof _idsLigaVigente==="function"&&_idsLigaVigente(key))||[]; }
function copaChileSorteoModelo(anio,rr){
  const mod=copaChileModelo(anio);
  const P=_cchIds("2026"), B=_cchIds("2026b"), C=_cchIds("2026cN").concat(_cchIds("2026cS"));
  if(P.length<16||B.length<8) return null;
  const mio=(typeof E!=="undefined"&&E)?E.club:null, bar=a=>(typeof _mBarajar==="function")?_mBarajar(a,rr):a.slice();
  const tomar=(lista,n)=>{ let a=bar(lista); if(mio&&a.indexOf(mio)>=0){ a=[mio].concat(a.filter(x=>x!==mio)); } return a.slice(0,n); };
  const p=bar(P).slice(0,16);
  let b, x;
  if(mod.grupo[3]==="B"){ b=bar(B).slice(0,16); x=null; }
  else {
    b=tomar(B,8);
    if(mod.grupo[3]==="C") x=tomar(C,8);
    else { const seg=tomar(C,5); x=seg.concat(CCH_AMATEUR.map(a=>a.id).slice(0,8-seg.length)); }
    if(x.length<8) return null;
    x=bar(x); if(mio&&x.indexOf(mio)>=0){ /* el jugador no siempre en el grupo A */ }
  }
  const out={};
  "ABCDEFGH".split("").forEach((L,i)=>{ out[L]=x?[p[2*i],p[2*i+1],b[i],x[i]]:[p[2*i],p[2*i+1],b[2*i],b[2*i+1]]; });
  return out;
}
/* ---------- enganches ---------- */
(function(){
  const os=window.mundoSorteoCopaChile;
  if(typeof os==="function"&&!os._epocas){
    /* BUG viejo (desde 2027): el sorteo se calculaba dos veces (al armar TU calendario y al armar el país) y salía
       distinto: tu grupo no era el del país, tu llave de octavos nunca se armaba y la copa quedaba sin campeón.
       Ahora el sorteo de cada año se guarda la primera vez y los dos lo leen igual. */
    const w=function(anio){
      anio=anio||((E&&E.anio)||2026);
      if(anio<=2026||typeof E==="undefined"||!E) return os.apply(this,arguments);
      E.copaChile=E.copaChile||{mod:{}};
      const S=E.copaChile.sorteos=E.copaChile.sorteos||{};
      if(S[anio]&&Object.keys(S[anio]).length===8){ const o={}; Object.keys(S[anio]).forEach(L=>o[L]=S[anio][L].slice()); return o; }
      const mod=copaChileModelo(anio);
      let r;
      if(mod.grupo[3]==="B") r=os.apply(this,arguments);
      else { const rr=(typeof _mAzar==="function")?_mAzar("sorteoCCH"+anio):Math.random; r=copaChileSorteoModelo(anio,rr)||os.apply(this,arguments); }
      if(r&&Object.keys(r).length===8){ S[anio]={}; Object.keys(r).forEach(L=>S[anio][L]=r[L].slice()); Object.keys(S).forEach(y=>{ if(+y<anio-1) delete S[y]; }); }
      return r;
    };
    Object.keys(os).forEach(k=>w[k]=os[k]); w._epocas=true; window.mundoSorteoCopaChile=w;
  }
  /* quién juega: en los modelos con Segunda o invitados, el que salió en el sorteo */
  const oj=window.juegaCopaChile;
  if(typeof oj==="function"&&!oj._epocas){
    const w=function(clubId,anio){
      if((anio||0)>=2027&&typeof E!=="undefined"&&E&&typeof mundoGrupoDe==="function"){
        const mod=copaChileModelo(anio);
        if(mod.grupo[3]!=="B"){ const base=oj.apply(this,arguments), div=(typeof divisionVigenteDe==="function")?divisionVigenteDe(clubId):null;
          if(!base&&div!=="C") return false;
          return !!mundoGrupoDe("chile",clubId,anio); }
      }
      return oj.apply(this,arguments);
    };
    Object.keys(oj).forEach(k=>w[k]=oj[k]); w._epocas=true; window.juegaCopaChile=w;
  }
  /* los invitados amateur existen para el resto del juego (nombre, fuerza, estadio) */
  const ol=window.clubLookup;
  if(typeof ol==="function"&&!ol._epocas){
    const w=function(id){ const r=ol.apply(this,arguments); if(r) return r; return CCH_AMATEUR.find(a=>a.id===id)||null; };
    Object.keys(ol).forEach(k=>w[k]=ol[k]); w._epocas=true; window.clubLookup=w;
  }
  /* la Segunda saca la Copa Chile de su calendario (data-formato2026.js): si el modelo la incluye, vuelve */
  const oc=window.construirCalendario;
  if(typeof oc==="function"&&!oc._epocas){
    const w=function(clubId,anio,conCopa){
      const cal=oc.apply(this,arguments)||[];
      try{
        if((anio||0)>=2027&&E&&E.eraBase==="2026c"&&!cal.some(p=>p.tipo==="copa"&&p.torneo==="Copa Chile")&&juegaCopaChile(clubId,anio)&&typeof partidosCopaChileGrupo==="function"){
          const ocup={}; cal.forEach(p=>{ if(p.f) ocup[p.f.m*100+p.f.d]=1; });
          partidosCopaChileGrupo(clubId,anio).forEach(p=>{ let k=p.f.m*100+p.f.d, n=0; while(ocup[k]&&n<10){ p.f={m:p.f.m,d:Math.min(28,p.f.d+3)}; k=p.f.m*100+p.f.d; n++; } ocup[k]=1; cal.push(p); });
          cal.sort((a,b)=>((typeof ordenFecha==="function")?ordenFecha(a.f)-ordenFecha(b.f):(a.f.m*100+a.f.d)-(b.f.m*100+b.f.d)));
        }
      }catch(e){}
      return cal;
    };
    Object.keys(oc).forEach(k=>w[k]=oc[k]); w._epocas=true; window.construirCalendario=w;
  }
  /* el año nuevo trae la noticia si la ANFP cambió la copa */
  const on=window.nuevoAnio;
  if(typeof on==="function"&&!on._cch){
    const w=function(){
      const r=on.apply(this,arguments);
      try{ if(E&&E.anio>=2027){ const a=copaChileModelo(E.anio), b=copaChileModelo(E.anio-1);
        if(a.id!==b.id&&typeof notificar==="function") notificar({t:"📜 La ANFP reformó la Copa Chile "+E.anio+": «"+a.n+"»",tipo:"neutro",bandeja:true,
          d:a.d+" "+a.base+" (Modelo de ficción del juego, basado en ediciones reales de la Copa Chile.)"}); } }catch(e){}
      return r;
    };
    Object.keys(on).forEach(k=>w[k]=on[k]); w._cch=true; window.nuevoAnio=w;
  }
  /* el panel de copas cuenta cómo se juega este año y la historia real */
  const op=window.panelCopas;
  if(typeof op==="function"&&!op._cch){
    const w=function(v){
      const r=op.apply(this,arguments);
      try{ if(E&&(E.anio||0)>=2026){ const host=v||document.getElementById("vista"); if(host) host.appendChild(panelCopaChileEpoca()); } }catch(e){}
      return r;
    };
    Object.keys(op).forEach(k=>w[k]=op[k]); w._cch=true; window.panelCopas=w;
  }
})();
function panelCopaChileEpoca(){
  const a=copaChileModelo(E.anio);
  const p=panel("La Copa Chile "+E.anio+": "+a.n,a.ic||"🏆");
  p.cuerpo.appendChild(el("p","",escHtml(a.d)));
  p.cuerpo.appendChild(el("p","mini",(a.real?"Formato real. ":"Modelo de ficción del juego. ")+escHtml(a.base)));
  const prox=[]; for(let y=E.anio-3;y<E.anio;y++){ if(y>=2026) prox.push(y+": "+COPA_CHILE_MODELOS[copaChileModeloId(y)].n); }
  if(prox.length) p.cuerpo.appendChild(el("p","mini","Años anteriores en tu partida: "+prox.map(escHtml).join(" · ")));
  const b=el("button","btn-aqua chico","📜 La Copa Chile en la historia"); b.onclick=modalHistoriaCopaChile; p.cuerpo.appendChild(b);
  return p;
}
function modalHistoriaCopaChile(){
  modal(function(box){
    const cu=(typeof montarBarraSO==="function")?montarBarraSO(box,"📜 La Copa Chile en la historia","📜",cerrarModal)
      :(function(){ box.appendChild(el("div","cab",'<span class="ic">📜</span><span>La Copa Chile en la historia</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();
    cu.appendChild(el("p","mini","Cada edición con su campeón y cómo se jugó. Fuente: <a href=\""+COPA_CHILE_FUENTE.url+"\" target=\"_blank\" rel=\"noopener\">Wikipedia · Copa Chile</a> (consultado el "+COPA_CHILE_FUENTE.consultado+"). Desde 2027, los formatos de tu partida son ficción del juego inspirada en estas ediciones."));
    const t=el("div","cch-hist");
    COPA_CHILE_HISTORIA.forEach(h=>t.appendChild(el("div","cch-fila"+(h.campeon?"":" sin"),"<b>"+h.anio+"</b><span>"+(h.campeon?"🏆 "+escHtml(h.campeon):"—")+"</span><span class='mini'>"+escHtml(h.formato)+"</span>")));
    cu.appendChild(t);
  },{clase:"ventana-so"});
}
if(typeof document!=="undefined"&&!document.getElementById("css-copas-epocas")){
  const st=document.createElement("style"); st.id="css-copas-epocas";
  st.textContent=".cch-hist{max-height:60vh;overflow-y:auto;display:flex;flex-direction:column;gap:2px}"+
    ".cch-fila{display:grid;grid-template-columns:52px minmax(120px,1fr) 2fr;gap:8px;padding:5px 6px;border-radius:6px;background:rgba(255,255,255,.55);font-size:13px;align-items:start}"+
    ".cch-fila.sin{opacity:.6}@media (max-width:560px){.cch-fila{grid-template-columns:44px 1fr}.cch-fila .mini{grid-column:1/-1}}";
  document.head.appendChild(st);
}
