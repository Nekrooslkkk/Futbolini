"use strict";
/* ============================================================
   FUTBOLINI · noticias-relevantes.js  (7.9049)
   Pedido del autor: "Osorno ya estuvo en Primera… Hecho de tabla, no de leyenda"
   le salía a un DT de Rangers. Las noticias tienen que ser de TU club o de rivales
   que te importan (tu liga, tus próximos rivales). Además, varias "noticias" eran
   notas de desarrollo disfrazadas ("El ayudante no es un tutorial"): fuera.
   Carga después de mundo.js, redes.js y data-voz-76.js.
   ============================================================ */
/* clubes que le importan al jugador: el suyo, su liga y los próximos 3 rivales */
function idsRelevantes(){
  const s={};
  if(!E) return s;
  s[E.club]=true;
  Object.keys(E.tabla||{}).forEach(id=>{ s[id]=true; });
  (E.calendario||[]).slice(E.idx||0).filter(p=>p&&!p.jugado&&p.rivalId).slice(0,3).forEach(p=>{ s[p.rivalId]=true; });
  return s;
}
function noticiaEsRelevante(n){
  if(!n) return false;
  if(!n.idA&&!n.idB) return true;
  const s=idsRelevantes();
  return !!(s[n.idA]||s[n.idB]);
}
/* notas que no son noticias, y noticias de club que solo corren si ese club te importa */
const NOTICIAS_COND={
  "📰 La tabla de arriba se mueve":()=>false,
  "📰 El ayudante no es un tutorial":()=>false,
  "📰 Argentina también tiene tabla":()=>false,
  "📰 El banco no espera al clásico":()=>(E.deuda||0)>200,
  "😄 El VAR dibujó la raya con el codo":()=>(E.anio||0)>=2018,
  "📰 Segunda es zona, no Libertadores":()=>E.eraBase==="2026c",
  "📰 Esteban Paredes en Morning":()=>!!idsRelevantes().SMO,
  "📰 Osorno ya estuvo en Primera":()=>!!idsRelevantes().OSO && (E.anio||0)>1991
};
(function(){
  /* el tono: noticia, no nota al margen */
  if(typeof VOZ_NOTICIAS_76!=="undefined"){
    VOZ_NOTICIAS_76.forEach(n=>{
      if(n.t==="📰 Osorno ya estuvo en Primera") n.d="Provincial Osorno jugó el Nacional 1991: 19 puntos y descenso, junto a Wanderers.";
      if(n.t==="📰 Esteban Paredes en Morning") n.d="El Chaguito dirige a Santiago Morning en la Segunda 2026.";
      if(n.t==="📰 Segunda es zona, no Libertadores"){ n.t="📰 La Segunda se juega por zonas"; n.d="Doce fechas por zona y los tres primeros van a la liguilla del ascenso."; }
    });
    NOTICIAS_COND["📰 La Segunda se juega por zonas"]=()=>E.eraBase==="2026c";
  }
  if(typeof titularesSemana==="function" && !titularesSemana._rel){
    const orig=titularesSemana;
    titularesSemana=function(){
      const out=(orig.apply(this,arguments)||[]).filter(n=>{
        const c=n&&NOTICIAS_COND[n.t];
        try{ return !c||c(); }catch(e){ return false; }
      });
      return out;
    };
    Object.keys(orig).forEach(k=>titularesSemana[k]=orig[k]);
    titularesSemana._rel=true;
  }
  /* goleadas y chistes de la fecha: solo de tu liga o de tus próximos rivales */
  if(typeof mundoArmarNoticias==="function" && !mundoArmarNoticias._rel){
    const orig=mundoArmarNoticias;
    mundoArmarNoticias=function(part){
      const r=orig.apply(this,arguments);
      try{
        const pais=((E.mundo&&E.mundo.pais)||[]).slice(-24);
        const rel=pais.filter(noticiaEsRelevante);
        const noms={}; pais.forEach(g=>{ noms[g.a+" "+g.ga+"-"+g.gb+" "+g.b]=g; });
        let lista=(E.mundo.noticias||[]).filter(n=>!/^Goleada en /.test(n.t||""));
        lista=lista.filter(n=>{ const g=n.tipo==="chiste"&&noms[n.t]; return !g||noticiaEsRelevante(g); });
        /* Copa Chile: tu grupo (antes rotaba por cualquier grupo) */
        const ch=E.mundo&&E.mundo.copas&&E.mundo.copas.chile;
        lista=lista.filter(n=>!/^Copa Chile · Grupo /.test(n.t||""));
        if(ch&&ch.grupos){
          const letra=Object.keys(ch.grupos).find(l=>(ch.grupos[l].ids||[]).indexOf(E.club)>=0);
          const g=letra&&ch.grupos[letra];
          if(g&&typeof _ordTabla==="function"){
            const arr=_ordTabla(g.tab,g.ids), yo=arr.findIndex(x=>x.id===E.club);
            if(arr[0]&&arr[0].pj>0) lista.push({tipo:"imp",t:"Copa Chile · tu grupo ("+letra+")",
              d:_nomClub(arr[0].id)+" va 1° ("+arr[0].pts+" pts)"+(yo>0?"; tú vas "+(yo+1)+"°":(yo===0?": ese eres tú":""))+". Clasifican 1° y 2°."});
          }
        }
        const gol=rel.slice().sort((a,b)=>Math.abs(b.ga-b.gb)-Math.abs(a.ga-a.gb))[0];
        if(gol&&Math.abs(gol.ga-gol.gb)>=3) lista.unshift({tipo:"imp",t:"Goleada en "+(gol.liga||"tu liga"),
          d:gol.a+" "+gol.ga+"-"+gol.gb+" "+gol.b+". Un papelón de un lado, fiesta del otro.",idA:gol.idA,idB:gol.idB});
        E.mundo.noticias=lista.slice(0,8);
      }catch(e){}
      return r;
    };
    Object.keys(orig).forEach(k=>mundoArmarNoticias[k]=orig[k]);
    mundoArmarNoticias._rel=true;
  }
})();
