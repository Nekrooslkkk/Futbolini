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
function girarRuleta(apId, monto, plenoNum){
  const ap=APUESTAS_CASINO.find(a=>a.id===apId); if(!ap) return null;
  const n=ri(0,36);
  const gano=ap.gana(n, plenoNum);
  const pago=gano?monto*ap.pago:0;
  const neto=pago-monto;
  E.personal.bolsillo=Math.max(0, E.personal.bolsillo+neto);
  return {n:n, color:(n===0?"verde":(RULETA_ROJOS.indexOf(n)>=0?"rojo":"negro")), gano:gano, pago:pago, neto:neto};
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
      ". Sube el riesgo institucional; si te auditan, se pudre. Podés blanquearlo con el Proceso de Redención en Finanzas."});
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
      d:"Saltaron irregularidades en la tesorería. Hay una investigación abierta sobre los fondos desviados. Tenés que responder."});
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
      d:"Restituiste "+plata(costo)+" (lo desviado + 20% de recargo administrativo). Se cierra la investigación, baja el riesgo y recuperás algo de credibilidad."});
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
function modalCasino(){
  let apId="rojo", monto=Math.max(5,Math.min(20,E.personal.bolsillo)), plenoNum=7, ultimo=null;
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🎰</span><span>Casino</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini","Ruleta europea (37 casillas, 0 verde). Jugás con tu bolsillo personal. Bolsillo: <b>"+plata(E.personal.bolsillo)+"</b>."));
      if(E.personal.bolsillo<=0){
        c.appendChild(el("div","resul mal","Te quedaste sin plata. Podés salir… o meter mano a la caja del club (opción abajo)."));
      }
      /* tipo de apuesta */
      c.appendChild(el("label","lb","Apuesta"));
      const f=el("div","fichas");
      APUESTAS_CASINO.forEach(a=>{
        const b=el("button","ficha",a.n+" ("+a.pago+"x · "+a.prob+")");
        b.setAttribute("aria-pressed",apId===a.id?"true":"false");
        b.onclick=()=>{ apId=a.id; pintar(); };
        f.appendChild(b);
      });
      c.appendChild(f);
      if(apId==="pleno"){
        c.appendChild(el("label","lb","Número (0-36): <b>"+plenoNum+"</b>"));
        const sn=el("input"); sn.type="range"; sn.min=0; sn.max=36; sn.value=plenoNum; sn.className="rango";
        sn.oninput=()=>{ plenoNum=parseInt(sn.value,10); const e=box.querySelector(".lb b"); };
        sn.onchange=()=>pintar();
        c.appendChild(sn);
      }
      /* monto */
      const maxB=Math.max(1,E.personal.bolsillo);
      monto=Math.min(monto,maxB);
      c.appendChild(el("label","lb","Ficha: <b>"+plata(monto)+"</b>"));
      const sm=el("input"); sm.type="range"; sm.min=1; sm.max=maxB; sm.value=monto; sm.className="rango";
      sm.oninput=()=>{ monto=parseInt(sm.value,10); const b=c.querySelectorAll(".lb b"); if(b.length) b[b.length-1].textContent=plata(monto); };
      c.appendChild(sm);
      const bg=el("button","btn-aqua ancho verde"+(E.personal.bolsillo<=0?" gris":""),"Girar la ruleta");
      bg.disabled=E.personal.bolsillo<=0;
      bg.onclick=()=>{ ultimo=girarRuleta(apId,monto,plenoNum); guardar(); pintar(); };
      c.appendChild(bg);
      if(ultimo){
        c.appendChild(el("div","resul "+(ultimo.gano?"bien":"mal"),
          "Salió el <b>"+ultimo.n+" "+ultimo.color+"</b>. "+(ultimo.gano?"¡Ganaste "+plata(ultimo.pago)+"! (neto "+plata(ultimo.neto)+")":"Perdiste "+plata(-ultimo.neto)+". La casa siempre gana un poquito.")));
      }
      if(E.personal.bolsillo<=0){
        const bd=el("button","btn-aqua ancho rojo","😈 Meter mano a la caja del club"); bd.style.marginTop="6px";
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
  p.cuerpo.appendChild(el("p","mini","Apostá tu plata personal en la ruleta. Odds de casino de verdad: a la larga, la banca gana. Bolsillo: <b>"+plata(E.personal.bolsillo)+"</b>."));
  const b=el("button","btn-aqua ancho verde","Entrar al casino");
  b.onclick=modalCasino;
  p.cuerpo.appendChild(b);
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
  p.cuerpo.appendChild(el("div","resul mal","Tenés <b>"+plata(E.flags.desfalco)+"</b> desviados de la tesorería."+
    (E.flags.investigacionAbierta?" <b>Hay una investigación abierta.</b>":" Todavía nadie te auditó, pero el riesgo corre.")));
  p.cuerpo.appendChild(el("h3","sub","Proceso de Redención"));
  const b1=el("button","btn-aqua ancho verde","Devolver todo (+20% recargo = "+plata(Math.round(E.flags.desfalco*1.2))+")");
  b1.onclick=()=>{ procesoRedencion("devolver"); render(); };
  const b2=el("button","btn-aqua ancho","Donaciones comunitarias y bajar el perfil ("+plata(Math.round(E.flags.desfalco*0.9))+")"); b2.style.marginTop="6px";
  b2.onclick=()=>{ procesoRedencion("donar"); render(); };
  p.cuerpo.appendChild(b1); p.cuerpo.appendChild(b2);
  return p;
}
