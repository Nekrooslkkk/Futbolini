"use strict";
/* ============================================================
   FUTBOLINI · arranque-justo.js — 7.9106 · que un club chico no nazca en llamas
   Pedido del autor ("haz las 2 cosas"): la Segunda arrancaba sin caja y le llovían decisiones de plata. Medido:
   9–10 decisiones pendientes al empezar (Primera: 4–5), umbrales de plata pensados para Primera ("no alcanza para
   la planilla" con caja < 120, cuando un club de Segunda arranca con 70) y crisis de escándalo en la semana 5.
   1) Al empezar quedan como mucho 5 decisiones pendientes; el resto espera en fila y entra de a una por semana
      (nada se pierde: solo se ordena).
   2) Las decisiones de plata miran la caja con la escala del club: el umbral se multiplica por
      planilla anual / 1.000 (entre 0,35 y 1). A un club grande no le cambia nada.
   (La caja inicial de la Segunda está en data-segunda2026.js; la espiral de riesgo por caja negativa, en motor.js.)
   ============================================================ */
const ARRANQUE_MAX_PEND=5;
const UMBRAL_PLATA={b_sueldos:1, b_directorio_caja:1, b_camarin_sueldo_atrasado:1, b_sponsor_pecho:1, b_sponsor_gris:1};
function planillaAnualClub(est){ return ((est&&est.plantel)||[]).filter(j=>j&&!j.vendido&&!j.cedido).reduce((s,j)=>s+(Number(j.sueldo)||0),0); }
function escalaCajaClub(est){ const p=planillaAnualClub(est); return p>0?Math.max(0.35,Math.min(1,p/1000)):1; }
/* deja como mucho N decisiones pendientes; el resto a la fila */
function _arranqueOrdenar(){
  if(!E||!Array.isArray(E.decPend)) return;
  E.decCola=Array.isArray(E.decCola)?E.decCola:[];
  if(E.decPend.length<=ARRANQUE_MAX_PEND) return;
  const orden={alto:0,medio:1,bajo:2};
  const todas=E.decPend.slice().sort((a,b)=>(orden[a.peso]??1)-(orden[b.peso]??1));
  E.decPend=todas.slice(0,ARRANQUE_MAX_PEND);
  E.decCola=E.decCola.concat(todas.slice(ARRANQUE_MAX_PEND));
}
/* una por semana desde la fila, si no hay más de 3 esperando */
function _arranqueSoltarUna(){
  if(!E||!Array.isArray(E.decCola)||!E.decCola.length) return;
  E.decPend=E.decPend||[];
  if(E.decPend.length>=3) return;
  const d=E.decCola.shift();
  if(d&&!E.decPend.some(x=>x.id===d.id)) E.decPend.push(d);
}
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o._aj) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._aj=true; w._orig=o; window[nom]=w; };
  envolver("nuevaPartida",o=>function(){ const r=o.apply(this,arguments); try{ _arranqueOrdenar(); }catch(e){} return r; });
  envolver("tickSemana",o=>function(){ const r=o.apply(this,arguments); try{ _arranqueSoltarUna(); }catch(e){} return r; });
  /* umbrales de plata a la escala del club: se le muestra la caja "como si" fuera un club de planilla 1.000 */
  const bolsas=[typeof BOLSA!=="undefined"?BOLSA:null, typeof DECISIONES!=="undefined"?DECISIONES:null].filter(Array.isArray);
  bolsas.forEach(lista=>lista.forEach(d=>{
    if(!d||!UMBRAL_PLATA[d.id]||typeof d.cuando!=="function"||d.cuando._aj) return;
    const o=d.cuando;
    d.cuando=function(est){ if(!est) return o.apply(this,arguments); const esc=escalaCajaClub(est); if(esc>=1) return o.apply(this,arguments);
      const vista=Object.create(est); vista.plata=(Number(est.plata)||0)/esc; return o.call(this,vista); };
    d.cuando._aj=true; d.cuando._orig=o;
  }));
})();

/* 7.9106 · el ayudante que decide cuando simulas ya no elige "la primera que se pueda pagar" (que casi siempre era la
   cara o la arriesgada: reparación completa, invertir en serio, prometer titularidad). Elige como un DT prudente:
   castiga el riesgo, cuida la caja a la escala del club y valora moral, hinchada y reputación. */
/* valor esperado: efectos directos de la opción + desenlaces (bien/mitad/mal) pesados por su dificultad */
function _ayudanteSuma(dst,src,f){ if(!src) return; Object.keys(src).forEach(k=>{ const v=Number(src[k]); if(isFinite(v)) dst[k]=(dst[k]||0)+v*f; }); }
function puntajeAyudante(op,est){
  if(!op) return -1e9;
  const dif=Number(op.dif)||40;
  const pBien=Math.max(0.1,Math.min(0.8,0.78-dif/110)), pMal=Math.max(0.05,Math.min(0.6,dif/140)), pMitad=Math.max(0,1-pBien-pMal);
  const ef={}, rep={}, gr={};
  _ayudanteSuma(ef,op.ef,1); _ayudanteSuma(rep,op.rep,1); _ayudanteSuma(gr,op.grupos,1);
  [["bien",pBien],["mitad",pMitad],["mal",pMal]].forEach(([k,pr])=>{ const r=op[k]; if(!r) return; _ayudanteSuma(ef,r.ef,pr); _ayudanteSuma(rep,r.rep,pr); _ayudanteSuma(gr,r.grupos,pr); });
  const esc=escalaCajaClub(est||E), num=v=>Number(v)||0;
  let s=0;
  s-=Math.max(0,num(ef.riesgo))*3; s+=Math.max(0,-num(ef.riesgo))*1;
  const pl=num(ef.plata)+num(op.plata)-num(op.costo);
  s+=pl<0?pl/(40*esc):pl/(200*esc);
  s-=Math.max(0,num(ef.deuda))/(35*esc);   /* la deuda pesa más que la plata que entra: un crédito no es un regalo */
  ["moral","hinchada","prestigio","plantel","cantera","socios","estadio"].forEach(k=>{ s+=num(ef[k])*0.35; });
  Object.keys(rep).forEach(k=>{ s+=num(rep[k])*(k==="dureza"?0.05:0.25); });
  Object.keys(gr).forEach(k=>{ s+=num(gr[k])*(k==="camarin"||k==="directorio"?0.22:0.12); });   /* camarín y directorio: paro y despido */
  if(op.doping) s-=50;
  return s;
}
(function(){
  if(typeof delegarDecisionesPendientes!=="function"||delegarDecisionesPendientes._aj) return;
  const o=delegarDecisionesPendientes;
  const w=function(){
    let n=0;
    (E.decPend||[]).slice().forEach(x=>{
      try{
        const d=(typeof decisionPorId==="function")?decisionPorId(x.id):null;
        if(!d||!d.op||!d.op.length) return;
        let mejor=-1, pMejor=-1e9;
        d.op.forEach((op,i)=>{ const ok=(typeof requisitoCumplido==="function")?requisitoCumplido(op).ok:true; if(!ok) return;
          const p=puntajeAyudante(op,E); if(p>pMejor){ pMejor=p; mejor=i; } });
        if(mejor<0) mejor=0;
        resolverDecision(d,mejor); n++;
      }catch(e){}
    });
    return n;
  };
  w._aj=true; w._orig=o; window.delegarDecisionesPendientes=w;
})();

