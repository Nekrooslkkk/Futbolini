"use strict";
/* ============================================================
   FUTBOLINI · conmebol-ko.js  (7.9060)
   Pedido del autor: Libertadores y Sudamericana con sus llaves ("obvio que deberían estar
   simulándose"). La fase de grupos ya se simulaba en mundo.js; faltaba la fase final.
   - Clasifican 1° y 2° de cada grupo (+ mejores terceros si faltan cupos para 16).
   - Cuadro sembrado 1–16, ida y vuelta (vuelta en casa del mejor sembrado), final única.
   - Sin gol de visita: global empatado → penales. Mismo motor de goles (_golesM) y azar fijo:
     se calcula en el momento y siempre da lo mismo.
   - Si tu club está en el cuadro, tu llave muestra TUS partidos (rival y marcador del calendario).
   Mismas rondas y fechas que tu calendario (data-copas2026.js).
   ============================================================ */
const CNM_RONDAS=["Octavos","Cuartos","Semifinal","FINAL"];
const CNM_FECHAS={
  Octavos:[{m:8,d:12},{m:8,d:19}], Cuartos:[{m:9,d:16},{m:9,d:23}],
  Semifinal:[{m:10,d:21},{m:10,d:28}], FINAL:{lib:[{m:11,d:28}], sud:[{m:11,d:21}]}
};
const CNM_NOM={lib:"Copa Libertadores",sud:"Copa Sudamericana"};
function _cnClub(tor,id){
  const pack=E.mundo.copas[tor]; let g=null;
  Object.keys(pack.grupos||{}).some(L=>{ if((pack.grupos[L].ids||[]).indexOf(id)>=0){ g=pack.grupos[L]; return true; } return false; });
  return (typeof _clubConmebol==="function")?_clubConmebol(id,g):{id:id,n:id,fuerza:70};
}
function _cnNom(tor,id){ const c=_cnClub(tor,id); return (c&&(c.c||c.n))||id; }
/* los 16 del cuadro, sembrados (null si los grupos no terminaron) */
function conmebolClasificados(tor){
  const pack=E&&E.mundo&&E.mundo.copas&&E.mundo.copas[tor];
  if(!pack||!pack.grupos||!Object.keys(pack.grupos).length) return null;
  if((pack.ronda||0)<6) return null;
  const pos=[[],[],[]];
  Object.keys(pack.grupos).forEach(L=>{ mundoFilasConmebol(tor,L).slice(0,3).forEach((c,i)=>pos[i].push(c)); });
  const ord=a=>a.sort((x,y)=>y.pts-x.pts||(y.gf-y.gc)-(x.gf-x.gc)||y.gf-x.gf);
  let q=ord(pos[0]).concat(ord(pos[1]));
  if(q.length<16) q=q.concat(ord(pos[2]).slice(0,16-q.length));
  /* el cuadro necesita 16, 8 o 4: si los grupos documentados no alcanzan, se parte más adelante */
  const n=q.length>=16?16:(q.length>=8?8:(q.length>=4?4:0));
  return n?q.slice(0,n).map(c=>c.id):null;
}
/* orden de llaves del octavo para que 1 y 2 solo se crucen en la final */
const _CN_PARES=[[0,15],[7,8],[4,11],[3,12],[2,13],[5,10],[6,9],[1,14]];
function _cnMiLlave(tor,ronda){
  const nom=CNM_NOM[tor];
  const mios=(E.calendario||[]).filter(p=>p&&p.tipo==="copa"&&p.torneo===nom&&p.ronda===ronda);
  return mios.length?mios:null;
}
function _cnJugarLlave(tor,t,hoy){
  const nFin=t.unica;
  t.legs=t.fechas.map((f,i)=>{
    if(_mfn(f)>_mfn(hoy)) return null;
    const loc=nFin?t.a:(i===0?t.a:t.b), vis=loc===t.a?t.b:t.a;
    const g=_golesM(_cnClub(tor,loc),_cnClub(tor,vis),tor+"|KO|"+t.ronda+"|"+i+"|"+loc+"|"+vis);
    return {ga:g[0],gb:g[1]};
  });
  /* tu llave: vale lo que jugaste */
  if(t.mia){
    t.legs=t.mia.map(p=>p.jugado?{ga:p.local?p.gf:p.gc, gb:p.local?p.gc:p.gf}:null);
    if(t.mia.length===1) t.unica=true;
  }
  if(t.legs.some(l=>!l)) return t;
  const g=_mGlobal(t);
  if(g[0]!==g[1]){ t.gana=g[0]>g[1]?t.a:t.b; return t; }
  t.pens=true;
  if(t.mia){ const ult=t.mia[t.mia.length-1]; const gano=ult&&ult.penales?!!ult.penales.gano:null;
    if(gano!=null){ t.gana=gano?E.club:(t.a===E.club?t.b:t.a); return t; } }
  const rr=_mAzar(tor+"|pen|"+t.ronda+"|"+t.a+"|"+t.b); t.gana=rr()<0.5?t.a:t.b;
  return t;
}
function conmebolKO(tor){
  const q=conmebolClasificados(tor); if(!q) return null;
  const hoy=(typeof mundoFechaHoy==="function")?mundoFechaHoy():{m:12,d:31};
  const rondas={};
  const PARES={16:_CN_PARES,8:[[0,7],[3,4],[2,5],[1,6]],4:[[0,3],[1,2]]}[q.length];
  const inicio={16:0,8:1,4:2}[q.length];
  let vivos=PARES.map(p=>[q[p[0]],q[p[1]]]);   /* [mejor, peor] */
  const orden=CNM_RONDAS.slice(inicio);
  orden.forEach(r=>{
    if(!vivos) { rondas[r]=null; return; }
    const fechas=r==="FINAL"?CNM_FECHAS.FINAL[tor]:CNM_FECHAS[r];
    rondas[r]=vivos.map(par=>{
      /* ida en casa del peor sembrado: a = peor, b = mejor */
      const t={ronda:r, a:par[1], b:par[0], fechas:fechas, legs:[], unica:r==="FINAL", gana:null, pens:false};
      if(E.club&&(t.a===E.club||t.b===E.club)){
        const mias=_cnMiLlave(tor,r);
        if(mias){ t.mia=mias; t.rivalCal=mias[0].rivalNombre; }
      }
      return _cnJugarLlave(tor,t,hoy);
    });
    const listos=rondas[r].every(t=>t.gana);
    if(!listos||r==="FINAL"){ vivos=null; return; }
    const w=rondas[r].map(t=>t.gana), nuevo=[];
    for(let i=0;i<w.length;i+=2) nuevo.push([w[i],w[i+1]]);
    vivos=nuevo;
  });
  const fin=rondas.FINAL&&rondas.FINAL[0];
  return {orden:orden, rondas:rondas, campeon:fin&&fin.gana||null};
}
function _cnPintarLlave(tor,t){
  const box=el("div","llave"+(t.mia?" mia":""));
  const visto=i=>!!(t.legs&&t.legs[i]);
  let ga=0,gb=0,alguno=false;
  (t.legs||[]).forEach((l,i)=>{ if(!l) return; alguno=true; if(t.unica||i===0){ ga+=l.ga; gb+=l.gb; } else { ga+=l.gb; gb+=l.ga; } });
  const nom=id=>(t.mia&&id!==E.club&&t.rivalCal)?t.rivalCal:_cnNom(tor,id);
  const fila=(id,gl)=>'<div class="llave-eq'+(t.gana===id?" gana":"")+(id===E.club?" yo":"")+'">'+((typeof escudoChip==="function")?escudoChip(id):"")+
    '<span class="nom">'+escHtml(nom(id))+'</span><b class="gl">'+(alguno?gl:"—")+'</b></div>';
  box.innerHTML=fila(t.a,ga)+fila(t.b,gb);
  const legs=t.fechas.map((f,i)=>(t.unica?"final":(i===0?"ida":"vuelta"))+" "+f.d+"/"+f.m+": "+(visto(i)?(t.legs[i].ga+"-"+t.legs[i].gb):"—"));
  box.appendChild(el("div","llave-legs",legs.join(" · ")+(t.pens?" · penales":"")+(t.mia?" · tu llave":"")));
  return box;
}
function panelCuadroConmebol(tor){
  const ko=conmebolKO(tor);
  const p=panel(CNM_NOM[tor]+" · fase final","🏆","agua");
  if(!ko){
    p.cuerpo.appendChild(el("p","mini","El cuadro se arma cuando terminen los grupos (6 fechas). Pasan 1° y 2° de cada grupo"+
      (tor==="lib"?" y los mejores terceros hasta completar 16":"")+". Octavos desde el 12 de agosto, final única en noviembre."));
    return p;
  }
  p.cuerpo.appendChild(el("p","mini","Ida y vuelta (la vuelta en casa del mejor de la fase de grupos), sin gol de visita: global empatado → penales. Final única."+
    (ko.campeon?" <b>Campeón: "+escHtml(_cnNom(tor,ko.campeon))+"</b>.":"")));
  const wrap=el("div","cuadro");
  ko.orden.forEach(r=>{
    const col=el("div","cuadro-col");
    col.appendChild(el("div","cuadro-tit",r==="FINAL"?"Final":r));
    const lista=ko.rondas[r];
    if(!lista) col.appendChild(el("p","mini cuadro-vacio","Se arma cuando termine la ronda anterior."));
    else lista.forEach(t=>col.appendChild(_cnPintarLlave(tor,t)));
    wrap.appendChild(col);
  });
  p.cuerpo.appendChild(wrap);
  return p;
}
