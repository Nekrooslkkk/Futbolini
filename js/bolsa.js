"use strict";
/* ============================================================
   FUTBOLINI · bolsa.js
   5.0 — BOLSA DE VALORES DEL CLUB + FINANZAS AVANZADAS
   El club chileno es una sociedad anónima que cotiza. El DT puede
   especular con su bolsillo personal (conflicto de interés: sabe
   los resultados antes que el mercado). Además: flujo de caja
   itemizado, préstamos estructurados y delegación al Tesorero.
   Estado en E.bolsa y E.finanzas. Sin frameworks.
   ============================================================ */

/* nombre satírico pero real de la sociedad anónima según el club */
function nombreSociedad(){
  const map={ CC:"Blanco y Negro S.A.", UCH:"Azul Azul S.A.D.P.", UC:"Cruzados SADP",
              COQ:"Coquimbo Unido SADP", EVE:"Everton de Viña SADP", PAL:"Palestino S.A.D.P." };
  if(map[E.club]) return map[E.club];
  const c=(typeof CLUB_POR_ID!=="undefined"&&CLUB_POR_ID[E.club])?CLUB_POR_ID[E.club]:null;
  return (c?c.n:"El club")+" S.A.D.P.";
}

/* valor fundamental de la acción: sale de la salud deportiva e institucional */
function fundamentoBolsa(){
  const t=E.temporada||{}; const sinGanar=t.sinGanar||0;
  let f = 30
    + (E.ind.prestigio||50)*0.9
    + (E.ind.hinchada||50)*0.25
    + ((E.ind.moral||50)-50)*0.25
    + (Array.isArray(E.titulos)?E.titulos.length:0)*6
    - (E.deuda||0)*0.018
    - sinGanar*2.2;
  if(E.flags&&E.flags.clausura) f-=15;
  return clamp(Math.round(f*100)/100, 4, 900);
}

function normalizarBolsa(){
  if(!E) return;
  if(!E.bolsa){
    const p=fundamentoBolsa();
    E.bolsa={ precio:p, base:p, historia:[p], acciones:0, invertido:0,
              flotante:0.35, sociedad:nombreSociedad() };
  }
  if(!Array.isArray(E.bolsa.historia)||!E.bolsa.historia.length) E.bolsa.historia=[E.bolsa.precio||fundamentoBolsa()];
  if(E.bolsa.acciones===undefined) E.bolsa.acciones=0;
  if(E.bolsa.invertido===undefined) E.bolsa.invertido=0;
  E.bolsa.sociedad=nombreSociedad();
  if(!E.finanzas) E.finanzas={ delegado:false };
  if(E.finanzas.delegado===undefined) E.finanzas.delegado=false;
}

/* el precio persigue el fundamento con inercia + ruido especulativo (semanal) */
function actualizarBolsa(){
  if(!E.bolsa) normalizarBolsa();
  const fund=fundamentoBolsa();
  const ruido=(Math.random()-0.5)*E.bolsa.precio*0.05;
  let np=E.bolsa.precio + (fund-E.bolsa.precio)*0.22 + ruido;
  E.bolsa.precio=clamp(Math.round(np*100)/100, 3, 1000);
  E.bolsa.base=fund;
  E.bolsa.historia.push(E.bolsa.precio);
  if(E.bolsa.historia.length>40) E.bolsa.historia.shift();
}
/* sacudón inmediato tras un partido: dir = 1 gana, -1 pierde, 0 empata */
function golpeBolsa(dir){
  if(!E.bolsa) normalizarBolsa();
  const salto=E.bolsa.precio*(dir>0?0.045:(dir<0?-0.05:-0.005))*(0.6+Math.random()*0.8);
  E.bolsa.precio=clamp(Math.round((E.bolsa.precio+salto)*100)/100,3,1000);
  E.bolsa.historia.push(E.bolsa.precio);
  if(E.bolsa.historia.length>40) E.bolsa.historia.shift();
}

/* tenencia y ganancia del DT (todo en millones de la época) */
function valorTenencia(){ return (E.bolsa&&E.bolsa.acciones)?E.bolsa.acciones*E.bolsa.precio:0; }
function gananciaBolsa(){ return valorTenencia()-((E.bolsa&&E.bolsa.invertido)||0); }
function variacionBolsa(){ const h=E.bolsa.historia; if(!h||h.length<2) return 0; const a=h[h.length-2],b=h[h.length-1]; return a?Math.round((b-a)/a*1000)/10:0; }

/* invertir un monto del bolsillo personal; recibe acciones fraccionarias */
function invertirBolsa(monto){
  if(!E.bolsa) normalizarBolsa();
  monto=Math.round(monto);
  if(monto<=0||E.personal.bolsillo<monto) return false;
  E.personal.bolsillo-=monto;
  E.bolsa.acciones+=monto/E.bolsa.precio;
  E.bolsa.invertido+=monto;
  return true;
}
/* liquidar una fracción (0..1) de la tenencia; devuelve lo recaudado */
function liquidarBolsa(frac){
  if(!E.bolsa||E.bolsa.acciones<=0) return 0;
  frac=clamp(frac,0,1);
  const acc=E.bolsa.acciones*frac;
  const ingreso=Math.round(acc*E.bolsa.precio);
  E.personal.bolsillo+=ingreso;
  E.bolsa.acciones-=acc;
  E.bolsa.invertido=Math.max(0,E.bolsa.invertido*(1-frac));
  if(E.bolsa.acciones<1e-6){ E.bolsa.acciones=0; E.bolsa.invertido=0; }
  return ingreso;
}
/* dividendo anual a accionistas si la campaña fue buena (llamado en fin de temporada) */
function dividendoBolsa(pos){
  if(!E.bolsa||E.bolsa.acciones<=0) return 0;
  if(pos>6) return 0;
  const tasa=[0,0.06,0.05,0.04,0.03,0.025,0.02][pos]||0;
  const div=Math.round(valorTenencia()*tasa);
  if(div>0){ E.personal.bolsillo+=div;
    if(typeof notificar==="function") notificar({t:"Dividendo de "+E.bolsa.sociedad,tipo:"bueno",
      d:"Como accionista cobraste "+plata(div)+" en dividendos por la campaña. La plata llama a la plata.",bandeja:false}); }
  return div;
}

/* ---------------- FINANZAS AVANZADAS ---------------- */
/* préstamo estructurado: caja ahora a cambio de deuda con recargo (el interés corre semanal) */
function tomarPrestamo(monto){
  monto=Math.round(monto); if(monto<=0) return false;
  const recargo=Math.round(monto*1.08);
  aplicarEfectos({plata:monto}); E.deuda+=recargo;
  if(typeof notificar==="function") notificar({t:"Crédito tomado",tipo:"neutro",
    d:"Entraron "+plata(monto)+" a la caja. La deuda sube "+plata(recargo)+" (con recargo) y los intereses corren cada semana.",bandeja:false});
  return true;
}
/* gestión delegada al Tesorero (se ejecuta en tickSemana si E.finanzas.delegado) */
function gestionTesorero(){
  if(!E.finanzas||!E.finanzas.delegado) return;
  /* abona deuda con el excedente de caja, dejando un colchón */
  if(E.deuda>0 && E.plata>250){
    const ab=Math.min(E.deuda, Math.round((E.plata-200)*0.5));
    if(ab>0){ E.plata-=ab; E.deuda-=ab; }
  }
  /* comisión de gestión: el tesorero se lleva su tajada (más si es poco honesto) */
  const honestidad=(E.staff&&E.staff.tesorero)||60;
  const fee=Math.round((ingresoSemanal())*(0.02+(100-honestidad)/1500));
  if(fee>0){ E.plata=Math.max(0,E.plata-fee); if(E.flags) E.flags.feeTesoreroUlt=fee; }
}
