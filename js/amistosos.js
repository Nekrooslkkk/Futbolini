"use strict";
/* ============================================================
   FUTBOLINI · amistosos.js  (7.9061)
   Pedido del autor (tarea 14):
   - Pretemporada gratis, casi sin lesiones, con rivales lógicos; todos aceptan salvo Chile↔Argentina.
   - Amistoso pagado por tamaño (grande/mediano/chico, no por país) con precios y ganancias reales.
   - Invitaciones y ofertas ya negociadas.
   - Organizar tu propia copa: sponsor (marcas chilenas con una letra cambiada), nombre, trofeo
     obligatorio, reglas (cambios, alargue o penales directos, árbitro).
   - El amistoso libre de siempre pasa a Ajustes como "Solo jugar".
   Estado: E.amistosos = {anio, pretemp:n, invit:[], copa:null, trofeos:[]}.
   ============================================================ */
function _amE(){
  if(!E.amistosos||E.amistosos.anio!==E.anio) E.amistosos={anio:E.anio, pretemp:0, invit:[], copa:null, trofeos:(E.amistosos&&E.amistosos.trofeos)||[]};
  return E.amistosos;
}
function _amInfl(){ return (typeof inflacionEra==="function")?inflacionEra():1; }
function _amR(x){ return x<10?Math.round(x*10)/10:Math.round(x); }
function paisDeClub(id){ return (typeof LIGA_ARG_2026!=="undefined"&&LIGA_ARG_2026.some(c=>c.id===id))?"arg":"chi"; }
/* tamaño del club: grande / mediano / chico (por prestigio y fuerza, no por país) */
function tamanoClub(id){
  if(["CC","UCH","UC","BOC","RIV","RAC","IND","SLO"].indexOf(id)>=0) return "grande";
  const c=(typeof clubMundo==="function"&&clubMundo(id))||{};
  const f=c.fuerza||55;
  return f>=72?"grande":(f>=60?"mediano":"chico");
}
const CACHET={grande:[15,40],mediano:[3,8],chico:[0.5,1.5]};
function cachetDe(id){ const r=CACHET[tamanoClub(id)]; const s=(typeof semilla==="function")?(semilla(id+"cachet")%100)/100:0.5; return _amR((r[0]+(r[1]-r[0])*s)*_amInfl()/1.4); }
const TIRON={grande:1.45,mediano:1.12,chico:0.8};
/* ---------- pretemporada ---------- */
function enPretemporada(){
  const oficiales=(E.calendario||[]).filter(p=>p&&p.tipo!=="amistoso");
  return !oficiales.some(p=>p.jugado);
}
function rivalesPretemporada(){
  const yoPais=paisDeClub(E.club), miDiv=(typeof miDivision==="function")?miDivision():1;
  const ids=(typeof idsClubesCpu==="function")?idsClubesCpu():[];
  return ids.filter(id=>id!==E.club && paisDeClub(id)===yoPais && Math.abs(((typeof divisionDeClub==="function")?divisionDeClub(id):1)-miDiv)<=1)
    .map(id=>({id:id,n:(typeof _nomClubCpu==="function")?_nomClubCpu(id):id,t:tamanoClub(id)}));
}
function _amPartido(rivalId, opts){
  const m=(typeof clubMapaTodos==="function")?clubMapaTodos():{};
  const riv=m[rivalId]||(typeof clubMundo==="function"&&clubMundo(rivalId))||{n:rivalId,fuerza:55};
  const yoEst=((typeof CLUB_POR_ID!=="undefined"&&CLUB_POR_ID[E.club])||{}).est||"tu estadio";
  const prox=proximoPartido(), fm=(prox&&prox.f)||{m:1,d:20};
  return Object.assign({ tipo:"amistoso", amistoso:true, rivalId:rivalId, rivalNombre:riv.n||riv.c||rivalId, fuerzaRival:riv.fuerza||55,
    local:true, sede:yoEst, f:{m:fm.m,d:Math.max(1,(fm.d||15)-3)}, clima:"despejado", jugado:false, torneo:"Amistoso" }, opts||{});
}
function jugarPretemporada(rivalId){
  const A=_amE();
  if(!enPretemporada()) return {ok:false,msg:"La pretemporada ya terminó: empezó el torneo."};
  if(A.pretemp>=3) return {ok:false,msg:"Ya jugaste los 3 amistosos de pretemporada."};
  if(paisDeClub(rivalId)!==paisDeClub(E.club)) return {ok:false,msg:"Cruzar la cordillera en pretemporada no se arregla: la otra asociación no lo autoriza."};
  A.pretemp++;
  lanzarAmistoso(_amPartido(rivalId,{pretemporada:true,torneo:"Amistoso de pretemporada"}));
  return {ok:true};
}
/* ---------- amistoso pagado ---------- */
function presupuestoAmistoso(rivalId){
  const t=tamanoClub(rivalId), costo=cachetDe(rivalId);
  let taq=0; try{ const r=taquilla({tipo:"amistoso",promo:{gente:TIRON[t]*0.8}}); taq=r.ingreso; }catch(e){}
  return {tam:t, costo:costo, taquilla:taq, neto:_amR(taq-costo)};
}
function jugarAmistosoPagado(rivalId){
  const p=presupuestoAmistoso(rivalId);
  if((E.plata||0)<p.costo) return {ok:false,msg:"No te alcanza para el cachet ("+plata(p.costo)+")."};
  aplicarEfectos({plata:-p.costo});
  lanzarAmistoso(_amPartido(rivalId,{promo:{gente:TIRON[p.tam]*0.8,motivo:"Amistoso con "+p.tam+": cachet "+plata(p.costo)},torneo:"Amistoso"}));
  return {ok:true};
}
/* ---------- invitaciones (llegan solas durante la temporada) ---------- */
function generarInvitacion(){
  const A=_amE();
  A.invit=(A.invit||[]).filter(x=>(x.vence||0)>=(E.idx||0));
  if(A.invit.length>=2) return null;
  const rr=(typeof azarFijo==="function"&&typeof semilla==="function")?azarFijo(semilla("invit"+E.anio+"-"+E.idx)):Math.random;
  if(rr()>0.18) return null;
  const miT=tamanoClub(E.club), ids=((typeof idsClubesCpu==="function")?idsClubesCpu():[]).filter(id=>id!==E.club);
  if(!ids.length) return null;
  const id=ids[Math.floor(rr()*ids.length)], t=tamanoClub(id);
  /* el grande te invita a su cancha (paga poco: tú ganas vitrina); el chico te quiere a ti (paga tu cachet) */
  const local=t==="grande"&&miT!=="grande";
  const pago=_amR(local?cachetDe(E.club)*0.5+0.5:cachetDe(E.club));
  const inv={id:"inv"+E.anio+"-"+E.idx, rivalId:id, n:(typeof _nomClubCpu==="function")?_nomClubCpu(id):id, localRival:local, pago:pago, vence:(E.idx||0)+3};
  A.invit.push(inv);
  if(typeof notificar==="function") notificar({t:"Invitación a un amistoso: "+inv.n,tipo:"neutro",bandeja:true,d:inv.n+" te invita a jugar "+(local?"en su cancha":"en la tuya")+". Pagan "+plata(pago)+". Aceptas o no desde Calendario → Amistoso."});
  return inv;
}
function aceptarInvitacion(invId){
  const A=_amE(), inv=(A.invit||[]).find(x=>x.id===invId); if(!inv) return {ok:false,msg:"La invitación ya venció."};
  A.invit=A.invit.filter(x=>x!==inv);
  aplicarEfectos({plata:inv.pago});
  const riv=(typeof clubMundo==="function"&&clubMundo(inv.rivalId))||{};
  lanzarAmistoso(_amPartido(inv.rivalId,{local:!inv.localRival, sede:inv.localRival?(riv.est||"estadio rival"):undefined, torneo:"Amistoso (invitación)"}));
  return {ok:true};
}
/* ---------- tu propia copa ---------- */
const SPONSORS_CL=["Copek","Sodimak","Riplei","Jambo","Unimart","Cristol","Escudu","Soprale","Bilx","Carrozi","Lucheti","Falabela","Entek","Colum"];
const TROFEOS={lata:{n:"Copa de lata",costo:0.5,prest:0},plata:{n:"Copa de plata",costo:2,prest:1},oro:{n:"Copa de oro",costo:6,prest:3}};
function crearCopaPropia(cfg){
  const A=_amE();
  if(A.copa&&A.copa.fase!=="fin") return {ok:false,msg:"Ya tienes una copa en curso."};
  const eq=(cfg.equipos||[]).filter(Boolean).slice(0,3);
  if(eq.length<3) return {ok:false,msg:"Elige 3 invitados."};
  const tro=TROFEOS[cfg.trofeo]||TROFEOS.lata, infl=_amInfl()/1.4;
  const costoTro=_amR(tro.costo*_amInfl()/1.4);
  if((E.plata||0)<costoTro) return {ok:false,msg:"No te alcanza para el trofeo ("+plata(costoTro)+")."};
  aplicarEfectos({plata:-costoTro});
  const sponsorPaga=_amR(eq.reduce((s,id)=>s+({grande:6,mediano:2,chico:0.8}[tamanoClub(id)]),0)*infl+1);
  aplicarEfectos({plata:sponsorPaga});
  const nombre=String(cfg.nombre||"").replace(/[<>]/g,"").trim().slice(0,40)||("Copa "+(cfg.sponsor||SPONSORS_CL[0]));
  const semis=[[E.club,eq[0]],[eq[1],eq[2]]];
  A.copa={nombre:nombre, sponsor:cfg.sponsor||SPONSORS_CL[0], trofeo:cfg.trofeo||"lata", reglas:Object.assign({cambios:5,alargue:false,arbitro:"normal"},cfg.reglas||{}),
    equipos:[E.club].concat(eq), semis:semis, fase:"semi", finalista:null, campeon:null, sponsorPaga:sponsorPaga};
  return {ok:true,msg:"«"+nombre+"» presentada por "+A.copa.sponsor+": el sponsor puso "+plata(sponsorPaga)+"; el trofeo costó "+plata(costoTro)+"."};
}
function jugarCopaPropia(){
  const A=_amE(), c=A.copa; if(!c||c.fase==="fin") return {ok:false,msg:"No hay copa en curso."};
  const rival=c.fase==="semi"?c.semis[0][1]:c.finalista;
  lanzarAmistoso(_amPartido(rival,{torneo:c.nombre, ronda:c.fase==="semi"?"Semifinal":"FINAL", copaPropia:true, reglas:c.reglas,
    promo:{gente:1.1,motivo:c.nombre+" · "+c.sponsor}}));
  return {ok:true};
}
/* después de cada amistoso de la copa propia, avanza el cuadro */
function avanzarCopaPropia(part){
  const A=_amE(), c=A.copa; if(!c||!part||!part.copaPropia) return;
  const gano=part.penales?!!part.penales.gano:((part.gf||0)>(part.gc||0));
  if(c.fase==="semi"){
    /* la otra semi se simula con la física del juego */
    const s=c.semis[1], a=clubMundo(s[0]), b=clubMundo(s[1]);
    const g=(typeof _golesM==="function")?_golesM(a,b,"copaPropia|"+E.anio+"|"+s.join("|")):[1,0];
    c.otraSemi={a:s[0],b:s[1],ga:g[0],gb:g[1]};
    c.finalista=g[0]===g[1]?(Math.random()<0.5?s[0]:s[1]):(g[0]>g[1]?s[0]:s[1]);
    if(gano){ c.fase="final"; if(typeof notificar==="function") notificar({t:c.nombre+": a la final",tipo:"bueno",bandeja:false,d:"En la otra semi "+_nomClub(s[0])+" "+g[0]+"-"+g[1]+" "+_nomClub(s[1])+". La final es contra "+_nomClub(c.finalista)+"."}); }
    else {
      /* quedaste afuera: la final la juegan los otros dos (se simula igual) */
      const ganSemi=part.rivalId, fa=clubMundo(ganSemi), fb=clubMundo(c.finalista);
      const gf=(typeof _golesM==="function")?_golesM(fa,fb,"copaPropiaFinal|"+E.anio+"|"+ganSemi+"|"+c.finalista):[1,0];
      c.fase="fin"; c.campeon=gf[0]===gf[1]?(Math.random()<0.5?ganSemi:c.finalista):(gf[0]>gf[1]?ganSemi:c.finalista);
      c.finalSim={a:ganSemi,b:c.finalista,ga:gf[0],gb:gf[1]};
      if(typeof notificar==="function") notificar({t:c.nombre+": afuera en semis",tipo:"malo",bandeja:false,
        d:"Tu propia copa y te quedaste en semis. La final: "+_nomClub(ganSemi)+" "+gf[0]+"-"+gf[1]+" "+_nomClub(c.finalista)+". Se lleva el trofeo que pagaste "+_nomClub(c.campeon)+"."});
    }
  } else if(c.fase==="final"){
    c.fase="fin"; c.campeon=gano?E.club:c.finalista;
    if(gano){ const tro=TROFEOS[c.trofeo]||TROFEOS.lata; A.trofeos=(A.trofeos||[]).concat([{anio:E.anio,n:c.nombre,trofeo:tro.n}]);
      aplicarEfectos({prestigio:tro.prest,hinchada:1});
      if(typeof notificar==="function") notificar({t:"¡Campeón de "+c.nombre+"!",tipo:"bueno",bandeja:true,d:tro.n+" para la vitrina. No es oficial, pero la gente la festeja igual."}); }
    else if(typeof notificar==="function") notificar({t:"Final perdida en "+c.nombre,tipo:"malo",bandeja:false,d:"El trofeo que pagaste se lo lleva "+_nomClub(c.campeon)+"."});
  }
}
/* ---------- lanzar el partido (previa) ---------- */
function lanzarAmistoso(part){
  if(typeof cerrarModal==="function") cerrarModal();
  SEC="partido";
  if(typeof pantallaPrevia==="function") pantallaPrevia(part);
}
/* ---------- enganches con el motor ---------- */
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._am) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._am=true; window[nom]=w; };
  /* la copa propia se define: partido único, alargue según las reglas, si no penales directos */
  envolver("esLlaveDirecta",o=>function(part){ return (part&&part.copaPropia)?true:o.apply(this,arguments); });
  envolver("esPartidoUnicoDesempate",o=>function(part){ return (part&&part.copaPropia)?true:o.apply(this,arguments); });
  envolver("pideProrroga",o=>function(part){ return (part&&part.copaPropia)?!!(part.reglas&&part.reglas.alargue):o.apply(this,arguments); });
  /* reglas de la copa (cambios, árbitro) y pretemporada casi sin lesiones */
  envolver("iniciarPartido",o=>function(part){
    const P=o.apply(this,arguments);
    if(P&&part&&part.reglas){ if(part.reglas.cambios) P.cambiosMax=part.reglas.cambios;
      if(P.arbitro&&part.reglas.arbitro==="estricto") P.arbitro=Object.assign({},P.arbitro,{cartas:1.4,estilo:"estricto"});
      if(P.arbitro&&part.reglas.arbitro==="permisivo") P.arbitro=Object.assign({},P.arbitro,{cartas:0.6,estilo:"deja jugar"}); }
    if(P&&part&&part.pretemporada) P.sinLesiones=true;
    return P;
  });
  envolver("terminarPartido",o=>function(P){
    const r=o.apply(this,arguments);
    try{ if(P&&P.part&&P.part.copaPropia) avanzarCopaPropia(P.part); }catch(e){}
    return r;
  });
  envolver("tickSemana",o=>function(){ const r=o.apply(this,arguments); try{ if(!enPretemporada()) generarInvitacion(); }catch(e){} return r; });
})();
/* ---------- UI: el centro de amistosos ---------- */
function modalAmistosos(){
  const A=_amE();
  modal(box=>{
    const cuerpo=(typeof montarBarraSO==="function")?montarBarraSO(box,"Amistosos","🤝",function(){ cerrarModal(); }):(function(){ const c=el("div","cuerpo"); box.appendChild(c); return c; })();
    const tabs=el("div","fichas"); cuerpo.appendChild(tabs);
    const cont=el("div"); cuerpo.appendChild(cont);
    let tab=enPretemporada()&&A.pretemp<3?"pre":(A.invit&&A.invit.length?"inv":(A.copa&&A.copa.fase!=="fin"?"copa":"pago"));
    const pintar=()=>{
      tabs.innerHTML=""; cont.innerHTML="";
      [["pre","🏕 Pretemporada"],["pago","💰 Pagado"],["inv","✉️ Invitaciones"+(A.invit&&A.invit.length?" ("+A.invit.length+")":"")],["copa","🏆 Tu copa"]].forEach(([k,n])=>{
        const b=el("button","ficha",n); b.setAttribute("aria-pressed",tab===k?"true":"false"); b.onclick=()=>{ tab=k; pintar(); }; tabs.appendChild(b); });
      if(tab==="pre"){
        if(!enPretemporada()){ cont.appendChild(el("p","mini","La pretemporada terminó: ya empezó el torneo. Mira los pagados o las invitaciones.")); return; }
        cont.appendChild(el("p","mini","Gratis, casi sin lesiones y contra rivales lógicos (tu división o la de al lado). Todos aceptan, salvo cruzar la cordillera. Te quedan <b>"+(3-A.pretemp)+"</b> de 3."));
        rivalesPretemporada().slice(0,24).forEach(x=>{ const b=el("button","op",'<div class="t">'+((typeof escudoChip==="function")?escudoChip(x.id):"")+" "+escHtml(x.n)+'</div><div class="d">'+x.t+'</div>');
          b.disabled=A.pretemp>=3; b.onclick=()=>{ const r=jugarPretemporada(x.id); if(!r.ok) aviso(r.msg); }; cont.appendChild(b); });
      } else if(tab==="pago"){
        cont.appendChild(el("p","mini","Traes a un rival a tu cancha y le pagas el cachet según su tamaño (grande 15–40 M, mediano 3–8 M, chico ~1 M). Un grande llena más la tribuna. Ves el neto antes de aceptar."));
        const ids=((typeof idsClubesCpu==="function")?idsClubesCpu():[]).filter(id=>id!==E.club);
        const ord={grande:0,mediano:1,chico:2};
        ids.map(id=>({id:id,p:presupuestoAmistoso(id)})).sort((a,b)=>ord[a.p.tam]-ord[b.p.tam]||b.p.neto-a.p.neto).slice(0,30).forEach(x=>{
          const b=el("button","op",'<div class="t">'+((typeof escudoChip==="function")?escudoChip(x.id):"")+" "+escHtml(_nomClub(x.id))+' <span class="mini">('+x.p.tam+')</span></div>'+
            '<div class="d">Cachet '+plata(x.p.costo)+' · taquilla estimada '+plata(x.p.taquilla)+' · <b>neto '+(x.p.neto>=0?"+":"")+plata(x.p.neto)+'</b></div>');
          b.onclick=()=>{ const r=jugarAmistosoPagado(x.id); if(!r.ok) aviso(r.msg); }; cont.appendChild(b); });
      } else if(tab==="inv"){
        const inv=(A.invit||[]).filter(x=>(x.vence||0)>=(E.idx||0));
        if(!inv.length) cont.appendChild(el("p","mini","No hay invitaciones ahora. Durante la temporada llegan solas: un grande que te quiere de rival de vitrina o un chico que paga por tenerte."));
        inv.forEach(x=>{ const d=el("div","resul mitad","<b>"+escHtml(x.n)+"</b> te invita "+(x.localRival?"a su cancha":"a jugar en la tuya")+" · pagan <b>"+plata(x.pago)+"</b> · vence en "+Math.max(0,x.vence-(E.idx||0))+" fecha(s)");
          const b=el("button","btn-aqua chico verde","Aceptar y jugar"); b.style.marginTop="6px"; b.onclick=()=>{ const r=aceptarInvitacion(x.id); if(!r.ok) aviso(r.msg); };
          const n=el("button","btn-aqua chico gris","Rechazar"); n.style.margin="6px 0 0 6px"; n.onclick=()=>{ A.invit=A.invit.filter(y=>y!==x); guardar(); pintar(); };
          d.appendChild(b); d.appendChild(n); cont.appendChild(d); });
      } else {
        const c=A.copa;
        if(c&&c.fase!=="fin"){
          cont.appendChild(el("div","resul bien","<b>"+escHtml(c.nombre)+"</b> · presenta "+escHtml(c.sponsor)+" · "+(TROFEOS[c.trofeo]||TROFEOS.lata).n+"<br><span class='mini'>Cambios "+c.reglas.cambios+" · "+(c.reglas.alargue?"alargue y penales":"penales directos")+" · árbitro "+c.reglas.arbitro+"</span>"));
          cont.appendChild(el("p","mini",c.fase==="semi"?("Semifinal: "+escHtml(E.clubNombre)+" vs "+escHtml(_nomClub(c.semis[0][1]))+". La otra: "+escHtml(_nomClub(c.semis[1][0]))+" vs "+escHtml(_nomClub(c.semis[1][1]))+"."):("Final contra "+escHtml(_nomClub(c.finalista))+".")));
          const b=el("button","btn-aqua ancho verde",c.fase==="semi"?"Jugar la semifinal":"Jugar la final"); b.onclick=()=>{ const r=jugarCopaPropia(); if(!r.ok) aviso(r.msg); }; cont.appendChild(b);
          return;
        }
        if(c&&c.fase==="fin") cont.appendChild(el("p","mini","Última: "+escHtml(c.nombre)+" · campeón "+escHtml(_nomClub(c.campeon))+"."));
        cont.appendChild(el("p","mini","Armas un cuadrangular en tu cancha: eliges nombre, sponsor, trofeo (obligatorio) y reglas. El sponsor paga según a quién invites."));
        const f=el("div","copa-form");
        f.innerHTML="<label class='lb'>Nombre</label><input class='entrada cp-nom' maxlength='40' placeholder='Copa…'>"+
          "<label class='lb'>Sponsor</label><select class='entrada cp-spo'>"+SPONSORS_CL.map(x=>"<option>"+x+"</option>").join("")+"</select>"+
          "<label class='lb'>Trofeo</label><select class='entrada cp-tro'><option value='lata'>Copa de lata · "+plata(_amR(0.5*_amInfl()/1.4))+"</option><option value='plata'>Copa de plata · "+plata(_amR(2*_amInfl()/1.4))+"</option><option value='oro'>Copa de oro · "+plata(_amR(6*_amInfl()/1.4))+"</option></select>"+
          "<label class='lb'>Cambios</label><select class='entrada cp-cam'><option>3</option><option selected>5</option><option value='11'>libres</option></select>"+
          "<label class='lb'>Empate</label><select class='entrada cp-ala'><option value='0'>penales directos</option><option value='1'>alargue y penales</option></select>"+
          "<label class='lb'>Árbitro</label><select class='entrada cp-arb'><option>normal</option><option>estricto</option><option>permisivo</option></select>"+
          "<label class='lb'>Invitados (3)</label>";
        const ids=((typeof idsClubesCpu==="function")?idsClubesCpu():[]).filter(id=>id!==E.club&&paisDeClub(id)===paisDeClub(E.club));
        const sel=[];
        for(let k=0;k<3;k++){ const s=el("select","entrada cp-inv"); s.innerHTML="<option value=''>—</option>"+ids.map(id=>"<option value='"+id+"'>"+escHtml(_nomClub(id))+" ("+tamanoClub(id)+")</option>").join(""); sel.push(s); f.appendChild(s); }
        cont.appendChild(f);
        const b=el("button","btn-aqua ancho verde","Presentar la copa"); b.style.marginTop="8px";
        b.onclick=()=>{
          const q=s=>f.querySelector(s);
          const r=crearCopaPropia({nombre:q(".cp-nom").value, sponsor:q(".cp-spo").value, trofeo:q(".cp-tro").value,
            reglas:{cambios:parseInt(q(".cp-cam").value,10)||5, alargue:q(".cp-ala").value==="1", arbitro:q(".cp-arb").value},
            equipos:sel.map(s=>s.value).filter((v,i,a)=>v&&a.indexOf(v)===i)});
          aviso(r.msg); if(r.ok){ guardar(); pintar(); }
        };
        cont.appendChild(b);
      }
    };
    pintar();
  },{clase:"ventana-so"});
}
/* el amistoso libre de siempre vive en Ajustes: "Solo jugar" */
(function(){
  const o=window.vistaAjustes; if(typeof o!=="function"||o._am) return;
  const w=function(host){
    const r=o.apply(this,arguments);
    try{
      const dest=host||document.getElementById("vista");
      if(dest&&E&&E.club&&typeof modalAmistoso==="function"){
        const p=panel("Solo jugar","🤝");
        p.cuerpo.appendChild(el("p","mini","Un partido libre contra cualquier club, sin plata ni consecuencias: para probar el once o jugar por jugar. Los amistosos con plata, invitaciones y tu copa están en Calendario → Amistosos."));
        const b=el("button","btn-aqua ancho","🤝 Jugar un amistoso libre"); b.onclick=()=>modalAmistoso();
        p.cuerpo.appendChild(b); dest.appendChild(p);
      }
    }catch(e){}
    return r;
  };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._am=true; window.vistaAjustes=w;
})();
