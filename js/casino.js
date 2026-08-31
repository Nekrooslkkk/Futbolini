"use strict";
/* ============================================================
   FUTBOLINI 5.0 · casino.js  (Bloque 2)
   Casino con plata personal (E.personal.bolsillo), corrupción /
   desfalco (meter mano a la caja del club E.plata) y redención.
   Tono satírico-realista, ficción de juego. Odds de ruleta reales.
   ============================================================ */

/* ---------- ruleta europea (37 casillas, ventaja de casa real ~2.7%) ---------- */
const RULETA_ROJOS=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const APUESTAS_CASINO=[
 {id:"rojo",  n:"Rojo",   pago:2,  gana:n=>n!==0&&RULETA_ROJOS.indexOf(n)>=0, prob:"48,6%"},
 {id:"negro", n:"Negro",  pago:2,  gana:n=>n!==0&&RULETA_ROJOS.indexOf(n)<0,  prob:"48,6%"},
 {id:"1a12",  n:"1 al 12",pago:3,  gana:n=>n>=1&&n<=12,  prob:"32,4%"},
 {id:"13a24", n:"13 al 24",pago:3, gana:n=>n>=13&&n<=24, prob:"32,4%"},
 {id:"25a36", n:"25 al 36",pago:3, gana:n=>n>=25&&n<=36, prob:"32,4%"},
 {id:"pleno", n:"Pleno (un número)",pago:36,gana:(n,e)=>n===e, prob:"2,7%"}
];
function colorRuleta(n){ return n===0?"verde":(RULETA_ROJOS.indexOf(n)>=0?"rojo":"negro"); }
function girarRuleta(apId, monto, plenoNum){
  const ap=APUESTAS_CASINO.find(a=>a.id===apId); if(!ap) return null;
  const n=ri(0,36);
  const gano=ap.gana(n, plenoNum);
  const pago=gano?monto*ap.pago:0;
  const neto=pago-monto;
  E.personal.bolsillo=Math.max(0, E.personal.bolsillo+neto);
  E.personal.ruletaHist=E.personal.ruletaHist||[];
  E.personal.ruletaHist.unshift({n:n,color:colorRuleta(n),gano:gano,neto:neto});
  if(E.personal.ruletaHist.length>14) E.personal.ruletaHist.length=14;
  return {n:n, color:colorRuleta(n), gano:gano, pago:pago, neto:neto};
}

/* ---------- corrupción: desviar fondos del club ---------- */
function desviarFondos(monto){
  monto=Math.round(Math.min(monto, E.plata*0.6));
  if(monto<=0){ if(typeof aviso==="function") aviso("No hay caja del club para desviar."); return; }
  E.plata=Math.max(0, E.plata-monto);
  E.personal.bolsillo+=monto;
  E.flags.desfalco=(E.flags.desfalco||0)+monto;
  E.ind.riesgo=clamp(E.ind.riesgo+Math.round(5+monto/60),0,100);
  aplicarRep({credibilidad:-3});
  notificar({t:"Metiste mano a la caja",tipo:"malo",
    d:"Desviaste "+plata(monto)+" de la tesorería del club a tu bolsillo. Total desviado: "+plata(E.flags.desfalco)+
      ". Sube el riesgo institucional; si te auditan, se pudre. Puedes blanquearlo con el Proceso de Redención en Finanzas."});
  if(typeof redesReaccion==="function"){}   // silencio en redes (por ahora nadie sabe)
  guardar();
}
/* chequeo semanal: cuanto más desviaste y menos credibilidad, más chance de auditoría */
function chequearDesfalco(){
  if(!E.flags.desfalco || E.flags.desfalco<=0) return;
  if(E.flags.investigacionAbierta) return;
  const p=clamp(E.flags.desfalco/1400 + (60-E.rep.credibilidad)/320, 0.015, 0.5);
  if(Math.random()<p){
    E.flags.investigacionAbierta=true;
    if(!E.decPend.some(x=>x.id==="enc_investigacion_dirigencial") && !E.decHechas["enc_investigacion_dirigencial_"+E.anio]){
      E.decPend.push({id:"enc_investigacion_dirigencial",clave:"enc_investigacion_dirigencial_"+E.anio,peso:"alto"});
    }
    notificar({t:"Auditoría en marcha",tipo:"malo",
      d:"Saltaron irregularidades en la tesorería. Hay una investigación abierta sobre los fondos desviados. Tienes que responder."});
  }
}
/* ---------- redención ---------- */
function procesoRedencion(tipo){
  const d=E.flags.desfalco||0; if(d<=0) return;
  if(tipo==="devolver"){
    const costo=Math.round(d*1.2);
    const dePersonal=Math.min(E.personal.bolsillo, costo);
    E.personal.bolsillo-=dePersonal;
    const resto=costo-dePersonal;
    if(resto>0) E.plata=Math.max(0,E.plata-resto);
    E.flags.desfalco=0; E.flags.investigacionAbierta=false;
    E.ind.riesgo=clamp(E.ind.riesgo-14,0,100);
    aplicarRep({credibilidad:8,publica:3}); aplicarGrupos({directorio:8});
    notificar({t:"Devolviste los fondos",tipo:"bueno",
      d:"Restituiste "+plata(costo)+" (lo desviado + 20% de recargo administrativo). Se cierra la investigación, baja el riesgo y recuperas algo de credibilidad."});
  } else { /* donaciones comunitarias + bajar el perfil */
    const costo=Math.round(d*0.9);
    E.plata=Math.max(0,E.plata-costo);
    E.flags.desfalco=0; E.flags.investigacionAbierta=false;
    E.ind.riesgo=clamp(E.ind.riesgo-8,0,100);
    aplicarRep({publica:6,credibilidad:4}); aplicarGrupos({comunidad:14,socios:6});
    notificar({t:"Lavaste la culpa con obras",tipo:"neutro",
      d:"Canalizaste "+plata(costo)+" en donaciones comunitarias y bajaste el perfil. La comunidad lo agradece y la investigación se diluye, aunque el fantasma queda dando vueltas."});
  }
  guardar();
}

/* ============================================================
   UI
   ============================================================ */
function pintarHistRuleta(c){
  const h=E.personal.ruletaHist||[];
  if(!h.length) return;
  const fila=el("div","ruleta-hist");
  h.slice(0,12).forEach(x=>{
    const s=el("span","chip-n "+x.color,String(x.n));
    fila.appendChild(s);
  });
  c.appendChild(fila);
}
function modalCasino(){
  let apId="rojo", monto=Math.max(5,Math.min(20,E.personal.bolsillo)), plenoNum=7, ultimo=null, girando=false;
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🎰</span><span>Casino · ruleta</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini","Ruleta europea (0 verde, ventaja de casa 2,7%). Bolsillo: <b>"+plata(E.personal.bolsillo)+"</b>."));
      const rueda=el("div","rueda-wrap");
      const disco=el("div","rueda-disco"+(girando?" gira":""));
      disco.textContent=ultimo?String(ultimo.n):"?";
      disco.className="rueda-disco "+(ultimo?ultimo.color:"")+(girando?" gira":"");
      rueda.appendChild(disco);
      rueda.appendChild(el("div","rueda-punta","▼"));
      c.appendChild(rueda);
      pintarHistRuleta(c);
      if(E.personal.bolsillo<=0){
        c.appendChild(el("div","resul mal","Te quedaste sin plata. Puedes salir… o meter mano a la caja del club."));
      }
      c.appendChild(el("label","lb","Apuesta"));
      const f=el("div","fichas");
      APUESTAS_CASINO.forEach(a=>{
        const b=el("button","ficha",a.n+" · "+a.pago+"x");
        b.title=a.prob; b.setAttribute("aria-pressed",apId===a.id?"true":"false");
        b.onclick=()=>{ if(!girando){ apId=a.id; pintar(); } };
        f.appendChild(b);
      });
      c.appendChild(f);
      if(apId==="pleno"){
        c.appendChild(el("label","lb","Número (0-36): <b>"+plenoNum+"</b>"));
        const sn=el("input"); sn.type="range"; sn.min=0; sn.max=36; sn.value=plenoNum; sn.className="rango";
        sn.oninput=()=>{ plenoNum=parseInt(sn.value,10); const e=c.querySelector(".lb b"); if(e) e.textContent=plenoNum; };
        sn.onchange=()=>pintar();
        c.appendChild(sn);
      }
      const maxB=Math.max(1,E.personal.bolsillo);
      monto=Math.min(monto,maxB);
      c.appendChild(el("label","lb","Ficha: <b>"+plata(monto)+"</b>"));
      const sm=el("input"); sm.type="range"; sm.min=1; sm.max=maxB; sm.value=monto; sm.className="rango";
      sm.oninput=()=>{ monto=parseInt(sm.value,10); const bs=c.querySelectorAll(".lb b"); if(bs.length) bs[bs.length-1].textContent=plata(monto); };
      c.appendChild(sm);
      const bg=el("button","btn-aqua ancho verde"+(E.personal.bolsillo<=0||girando?" gris":""),girando?"La bola corre…":"Girar la ruleta");
      bg.disabled=E.personal.bolsillo<=0||girando;
      bg.onclick=()=>{
        if(girando||E.personal.bolsillo<=0) return;
        girando=true; pintar();
        let k=0;
        const iv=setInterval(()=>{
          disco.textContent=String(ri(0,36));
          disco.className="rueda-disco gira "+colorRuleta(parseInt(disco.textContent,10)||0);
          k++;
        },70);
        setTimeout(()=>{
          clearInterval(iv);
          ultimo=girarRuleta(apId,monto,plenoNum);
          girando=false; guardar(); pintar();
        },1600);
      };
      c.appendChild(bg);
      if(ultimo&&!girando){
        c.appendChild(el("div","resul "+(ultimo.gano?"bien":"mal"),
          "Salió el <b>"+ultimo.n+" "+ultimo.color+"</b>. "+(ultimo.gano?"Ganaste "+plata(ultimo.pago)+" (neto "+plata(ultimo.neto)+").":"Perdiste "+plata(-ultimo.neto)+".")));
      }
      const bj=el("button","btn-aqua ancho","Ir al blackjack");
      bj.style.marginTop="8px"; bj.onclick=()=>{ cerrarModal(); modalBlackjack(); };
      c.appendChild(bj);
      if(E.personal.bolsillo<=0){
        const bd=el("button","btn-aqua ancho rojo","Meter mano a la caja del club"); bd.style.marginTop="6px";
        bd.onclick=()=>{ cerrarModal(); modalDesviar(); };
        c.appendChild(bd);
      }
      const x=el("button","btn-aqua ancho gris","Salir del casino"); x.style.marginTop="6px"; x.onclick=()=>{ cerrarModal(); render(); };
      c.appendChild(x);
    };
    pintar();
  });
}
function modalDesviar(){
  let monto=Math.round(Math.min(E.plata*0.2, 100));
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">😈</span><span>Desviar fondos</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("div","resul mal","Vas a transferir plata de la tesorería del club a tu bolsillo. Sube el riesgo y, si te auditan, se arma. Blanqueable después con el Proceso de Redención."));
      c.appendChild(fila("Caja del club",plata(E.plata)));
      const maxD=Math.max(1,Math.round(E.plata*0.6));
      monto=Math.min(monto,maxD);
      c.appendChild(el("label","lb","Monto a desviar: <b id='dvM'>"+plata(monto)+"</b>"));
      const s=el("input"); s.type="range"; s.min=1; s.max=maxD; s.value=monto; s.className="rango";
      s.oninput=()=>{ monto=parseInt(s.value,10); const e=box.querySelector("#dvM"); if(e)e.textContent=plata(monto); };
      c.appendChild(s);
      const b=el("button","btn-aqua ancho rojo","Confirmar desvío"); b.onclick=()=>{ desviarFondos(monto); cerrarModal(); render(); };
      c.appendChild(b);
      const x=el("button","btn-aqua ancho gris","Arrepentirme"); x.style.marginTop="6px"; x.onclick=()=>{ cerrarModal(); render(); };
      c.appendChild(x);
    };
    pintar();
  });
}
/* panel para la sección Vida (casino personal) */
function panelCasino(){
  const p=panel("Casino","🎰");
  p.cuerpo.appendChild(el("p","mini","Plata personal. Ruleta europea y blackjack (la casa gana a la larga). Bolsillo: <b>"+plata(E.personal.bolsillo)+"</b>."));
  const b=el("button","btn-aqua ancho verde","Ruleta");
  b.onclick=modalCasino;
  p.cuerpo.appendChild(b);
  const bb=el("button","btn-aqua ancho"); bb.textContent="Blackjack"; bb.style.marginTop="6px";
  bb.onclick=modalBlackjack;
  p.cuerpo.appendChild(bb);
  if(E.personal.bolsillo<=0){
    const bd=el("button","btn-aqua ancho rojo","😈 Sin plata: meter mano a la caja"); bd.style.marginTop="6px";
    bd.onclick=modalDesviar;
    p.cuerpo.appendChild(bd);
  }
  return p;
}
/* panel para Finanzas (desfalco + redención), null si no hay desfalco */
function panelDesfalco(){
  if(!E.flags.desfalco || E.flags.desfalco<=0) return null;
  const p=panel("Fondos desviados","🕳️","grave");
  p.cuerpo.appendChild(el("div","resul mal","Tienes <b>"+plata(E.flags.desfalco)+"</b> desviados de la tesorería."+
    (E.flags.investigacionAbierta?" <b>Hay una investigación abierta.</b>":" Todavía nadie te auditó, pero el riesgo corre.")));
  p.cuerpo.appendChild(el("h3","sub","Proceso de Redención"));
  const b1=el("button","btn-aqua ancho verde","Devolver todo (+20% recargo = "+plata(Math.round(E.flags.desfalco*1.2))+")");
  b1.onclick=()=>{ procesoRedencion("devolver"); render(); };
  const b2=el("button","btn-aqua ancho","Donaciones comunitarias y bajar el perfil ("+plata(Math.round(E.flags.desfalco*0.9))+")"); b2.style.marginTop="6px";
  b2.onclick=()=>{ procesoRedencion("donar"); render(); };
  p.cuerpo.appendChild(b1); p.cuerpo.appendChild(b2);
  return p;
}

/* ---------- blackjack (regla de casino: dealer stands on 17, BJ paga 3:2) ---------- */
function mazoBJ(){
  const pals=["♠","♥","♦","♣"], vals=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const m=[]; pals.forEach(p=>vals.forEach(v=>m.push({v:v,p:p})));
  return mezcla(m);
}
function valCarta(c){ if(c.v==="A") return 11; if("JQK".indexOf(c.v)>=0) return 10; return parseInt(c.v,10); }
function totalBJ(mano){
  let t=0, as=0;
  mano.forEach(c=>{ const v=valCarta(c); t+=v; if(c.v==="A") as++; });
  while(t>21&&as>0){ t-=10; as--; }
  return t;
}
function txtMano(mano,ocultar){
  return mano.map((c,i)=> (ocultar&&i===0?"??":c.v+c.p)).join("  ");
}
function modalBlackjack(){
  let monto=Math.max(5,Math.min(15,E.personal.bolsillo));
  let mazo=[], yo=[], dealer=[], fase="apuesta", msg="";
  function deal(){
    if(E.personal.bolsillo<monto){ msg="No te alcanza."; return; }
    E.personal.bolsillo-=monto;
    mazo=mazoBJ(); yo=[mazo.pop(),mazo.pop()]; dealer=[mazo.pop(),mazo.pop()];
    if(totalBJ(yo)===21){ cobrar("bj"); }
    else fase="juego";
    guardar();
  }
  function hit(){
    yo.push(mazo.pop());
    if(totalBJ(yo)>21) cobrar("bust");
  }
  function stand(){
    while(totalBJ(dealer)<17) dealer.push(mazo.pop());
    const t=totalBJ(yo), d=totalBJ(dealer);
    if(d>21||t>d) cobrar("win");
    else if(t===d) cobrar("push");
    else cobrar("lose");
  }
  function cobrar(tipo){
    fase="fin";
    if(tipo==="bj"){ const p=Math.round(monto*2.5); E.personal.bolsillo+=p; msg="Blackjack. Cobrás "+plata(p)+" (3:2)."; }
    else if(tipo==="win"){ const p=monto*2; E.personal.bolsillo+=p; msg="Ganaste. +" +plata(p)+"."; }
    else if(tipo==="push"){ E.personal.bolsillo+=monto; msg="Empate. Se devuelve la apuesta."; }
    else if(tipo==="bust") msg="Te pasaste. Perdiste "+plata(monto)+".";
    else msg="La casa gana. −"+plata(monto)+".";
    guardar();
  }
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🃏</span><span>Blackjack</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini","Dealer se planta en 17. Blackjack paga 3:2. Bolsillo: <b>"+plata(E.personal.bolsillo)+"</b>."));
      if(fase!=="apuesta"){
        c.appendChild(el("div","bj-mano","Dealer · "+(fase==="fin"?totalBJ(dealer):"?")+"<br><span class='bj-cards'>"+txtMano(dealer,fase!=="fin")+"</span>"));
        c.appendChild(el("div","bj-mano","Vos · "+totalBJ(yo)+"<br><span class='bj-cards'>"+txtMano(yo,false)+"</span>"));
      }
      if(fase==="apuesta"){
        const maxB=Math.max(1,E.personal.bolsillo);
        monto=Math.min(monto,maxB);
        c.appendChild(el("label","lb","Apuesta: <b>"+plata(monto)+"</b>"));
        const sm=el("input"); sm.type="range"; sm.min=1; sm.max=maxB; sm.value=monto; sm.className="rango";
        sm.oninput=()=>{ monto=parseInt(sm.value,10); const e=c.querySelector(".lb b"); if(e)e.textContent=plata(monto); };
        c.appendChild(sm);
        const b=el("button","btn-aqua ancho verde"+(E.personal.bolsillo<=0?" gris":""),"Repartir");
        b.disabled=E.personal.bolsillo<=0;
        b.onclick=()=>{ deal(); pintar(); };
        c.appendChild(b);
      } else if(fase==="juego"){
        const h=el("button","btn-aqua ancho verde","Pedir carta");
        h.onclick=()=>{ hit(); pintar(); };
        const s=el("button","btn-aqua ancho","Plantarse"); s.style.marginTop="6px";
        s.onclick=()=>{ stand(); pintar(); };
        c.appendChild(h); c.appendChild(s);
      } else {
        c.appendChild(el("div","resul "+(msg.indexOf("Gan")>=0||msg.indexOf("Black")>=0?"bien":(msg.indexOf("Empate")>=0?"mitad":"mal")),msg));
        const o=el("button","btn-aqua ancho verde","Otra mano");
        o.onclick=()=>{ fase="apuesta"; yo=[]; dealer=[]; msg=""; pintar(); };
        c.appendChild(o);
      }
      const ru=el("button","btn-aqua ancho gris","Volver a la ruleta"); ru.style.marginTop="8px";
      ru.onclick=()=>{ cerrarModal(); modalCasino(); };
      c.appendChild(ru);
      const x=el("button","btn-aqua ancho gris","Salir"); x.style.marginTop="6px";
      x.onclick=()=>{ cerrarModal(); render(); };
      c.appendChild(x);
    };
    pintar();
  });
}
