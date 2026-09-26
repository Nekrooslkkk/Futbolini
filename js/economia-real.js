"use strict";
/* ============================================================
   FUTBOLINI · economia-real.js  (7.9056)
   Pedido del autor: rebalancear TODO el mercado a escala real chilena, por edad y nivel;
   compradores realistas (un chico no te compra a tu figura); jugadores libres y préstamos.
   - valorMercado(j): exponencial en el nivel (antes casi lineal: una figura valía 1,5× un
     suplente). En pesos de 2026: nivel 62 ≈ 40 M · 70 ≈ 140 M · 80 ≈ 650 M · 85 ≈ 1.400 M.
     Edad, proyección y contrato mueven el precio. Se recalcula cada semana para todos.
   - j.valor queda en plata de la época (ya no se multiplica otra vez por la inflación).
   - Compradores con presupuesto por división y tamaño; si nadie en Chile puede, compra afuera.
   - Libres cada temporada (sin pase: sueldo + prima) y préstamos por un año.
   ============================================================ */
const INFL_2026=1.4;
function _infl(){ return (typeof inflacionEra==="function")?inflacionEra():1; }
function _r(x){ return x<10?Math.round(x*10)/10:Math.round(x); }
function valorMercado(j){
  if(!j) return 0;
  const n=j.nivel||50, ed=j.edad||26;
  let v=30*Math.pow(2,(n-60)/4.5);
  v*= ed<=20?1.5:(ed<=23?1.3:(ed<=27?1:(ed<=30?0.8:(ed<=32?0.55:0.3))));
  v*= 1+Math.max(0,(j.proy||n)-n)*0.03;
  const resta=(j.contrato&&j.contrato.hasta)?(j.contrato.hasta-((E&&E.anio)||2026)):1;
  if(resta<=0) v*=0.5; else if(resta===1) v*=0.8;
  return Math.max(0.3,_r(v*_infl()/INFL_2026));
}
function actualizarValores(){
  if(!E) return;
  const tocar=j=>{ if(!j||j.vendido) return; j.valor=valorMercado(j);
    if(j.contrato&&j.contrato.clausula&&(j.contrato.clausula<j.valor*1.2||j.contrato.clausula>j.valor*5)) j.contrato.clausula=Math.max(1,Math.round(j.valor*2)); };
  (E.plantel||[]).forEach(tocar);
  Object.keys((E.cpu&&E.cpu.sq)||{}).forEach(id=>(E.cpu.sq[id]||[]).forEach(tocar));
  E._valoresV=2;
}
/* ---------- compradores con plata de verdad ---------- */
function divisionDe(id){ return (typeof divisionDeClub==="function")?divisionDeClub(id):1; }
function presupuestoCompra(id){
  const c=(typeof clubMundo==="function"&&clubMundo(id))||{};
  const f=c.fuerza||60, div=divisionDe(id), grande=["CC","UCH","UC"].indexOf(id)>=0;
  const arg=(typeof LIGA_ARG_2026!=="undefined")&&LIGA_ARG_2026.some(x=>x.id===id);
  let p=div===1?60*Math.pow(2,(f-60)/8):(div===2?25*Math.pow(2,(f-55)/8):8);
  if(grande) p*=3; if(arg) p*=1.6;
  return _r(p*_infl()/INFL_2026);
}
const COMPRADORES_AFUERA=["un club de la MLS","un club brasileño","un club mexicano","un club de Arabia Saudita","un club argentino","un club de Portugal"];
function compradorPara(j,rr,monto){
  rr=rr||Math.random;
  let ids=(typeof idsClubesCpu==="function")?idsClubesCpu().filter(id=>id!==(E&&E.club)):[];
  const miDiv=(typeof miDivision==="function")?miDivision():1;
  const pueden=ids.filter(id=>presupuestoCompra(id)>=monto*0.9 && divisionDe(id)<=Math.max(miDiv,1));
  if(pueden.length){ const id=pueden[Math.floor(rr()*pueden.length)]; return {id:id, n:(typeof _nomClubCpu==="function"?_nomClubCpu(id):id)}; }
  return {id:null, n:COMPRADORES_AFUERA[Math.floor(rr()*COMPRADORES_AFUERA.length)]};
}
/* ---------- jugadores libres (sin pase) ---------- */
function jugadoresLibres(){
  if(!E) return [];
  if(E.libres && E.libres.anio===E.anio) return E.libres.lista.filter(j=>!j.firmado);
  const rr=(typeof azarFijo==="function"&&typeof semilla==="function")?azarFijo(semilla("libres"+E.anio+(E.mundoSemilla||""))):Math.random;
  const pos=["ARQ","DEF","DEF","DEF","VOL","VOL","VOL","DEL","DEL"], lista=[];
  for(let i=0;i<24;i++){
    const vet=rr()<0.7;
    const j=generarJugador(rr, 46+rr()*18, pos[Math.floor(rr()*pos.length)], vet?29+Math.floor(rr()*6):21+Math.floor(rr()*5));
    j.libre=true; j.club="Libre"; j.clubId=null; j.contrato={hasta:0};
    j.valor=valorMercado(j); j.precio=0;
    j.prima=_r(Math.max(0.5,j.valor*0.05));
    j.pidesueldo=Math.max(1,Math.round(j.sueldo*(vet?0.9:1.05)));
    lista.push(j);
  }
  E.libres={anio:E.anio,lista:lista};
  return lista;
}
function ficharLibre(j){
  if(!j||j.firmado) return {ok:false,msg:"Ya firmó con otro club."};
  if(typeof puedeFirmar==="function"&&!puedeFirmar()) return {ok:false,msg:"Los libres también firman con la ventana abierta ("+(typeof proximaVentana==="function"?proximaVentana():"")+")."};
  if((E.plata||0)<j.prima) return {ok:false,msg:"No te alcanza para la prima de firma ("+plata(j.prima)+")."};
  const of={sueldo:j.pidesueldo,rol:"titular"};
  if(typeof interesJugador==="function"&&interesJugador(j,of)<-12) return {ok:false,msg:j.n+" prefiere esperar una oferta de un club más grande."};
  aplicarEfectos({plata:-j.prima});
  const nuevo=Object.assign({},j,{sueldo:j.pidesueldo,forma:64,moral:72,contrato:{hasta:E.anio+1},lesion:0,goles:0,partidos:0,tarjetas:0});
  ["libre","club","clubId","precio","pidesueldo","prima","firmado"].forEach(k=>delete nuevo[k]);
  E.plantel.push(nuevo); j.firmado=true;
  if(typeof guardar==="function") guardar();
  return {ok:true,msg:"Firmaste a "+j.n+" (libre): prima "+plata(j.prima)+" y "+plata(nuevo.sueldo)+" de sueldo al año, hasta "+(E.anio+1)+"."};
}
/* ---------- préstamos (pedir un jugador por la temporada) ---------- */
function prestables(){
  const pool=(typeof poolMercadoReal==="function")?poolMercadoReal():[];
  const porClub={};
  pool.forEach(j=>{ (porClub[j.clubId]=porClub[j.clubId]||[]).push(j); });
  return pool.filter(j=>{
    if(j.edad<=23) return true;
    const mismos=(porClub[j.clubId]||[]).filter(x=>x.pos===j.pos).sort((a,b)=>b.nivel-a.nivel);
    return mismos.indexOf(j)>=2;   /* no es titular en su club: lo sueltan a préstamo */
  });
}
function costoPrestamo(j){ return _r(Math.max(0.5,(j.valor||10)*0.08)); }
function pedirPrestamo(j){
  if(typeof puedeFirmar==="function"&&!puedeFirmar()) return {ok:false,msg:"Los préstamos se cierran con la ventana abierta."};
  const fee=costoPrestamo(j);
  if((E.plata||0)<fee) return {ok:false,msg:"No te alcanza para el préstamo ("+plata(fee)+")."};
  if(prestables().every(x=>x.n!==j.n)) return {ok:false,msg:(j.club||"Su club")+" no lo presta: es titular allá."};
  aplicarEfectos({plata:-fee});
  const nuevo=Object.assign({},j,{sueldo:Math.max(1,Math.round((j.sueldo||10)*0.5)),forma:66,moral:70,lesion:0,goles:0,partidos:0,tarjetas:0,
    contrato:{hasta:E.anio}, prestamo:{clubId:j.clubId, club:j.club, hasta:E.anio, sueldoOrig:j.sueldo}});
  ["precio","pidesueldo","club","clubId"].forEach(k=>delete nuevo[k]);
  if(j.clubId&&typeof cpuQuitar==="function") cpuQuitar(j.clubId,j.n);
  E.plantel.push(nuevo);
  if(typeof guardar==="function") guardar();
  return {ok:true,msg:j.n+" llega a préstamo desde "+(j.club||"su club")+" hasta fin de "+E.anio+". Costo "+plata(fee)+"; pagas la mitad de su sueldo."};
}
/* al cerrar la temporada, los prestados vuelven a su club */
function devolverPrestamos(){
  if(!E||!E.plantel) return 0;
  let n=0;
  E.plantel.forEach(j=>{
    if(!j.prestamo||j.vendido||(j.prestamo.hasta||0)>(E.anio||0)) return;
    j.vendido=true; n++;
    const vuelta=Object.assign({},j,{sueldo:j.prestamo.sueldoOrig||j.sueldo,vendido:false}); delete vuelta.prestamo;
    if(j.prestamo.clubId&&typeof cpuSumar==="function") cpuSumar(j.prestamo.clubId,vuelta);
    if(typeof notificar==="function") notificar({t:"Termina el préstamo de "+j.n,tipo:"neutro",bandeja:false,d:j.n+" vuelve a "+(j.prestamo.club||"su club")+"."});
  });
  return n;
}
/* ---------- enganches ---------- */
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o["_eco"]) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._eco=true; window[nom]=w; };
  envolver("poolMercadoReal",o=>function(){
    if(E&&E._valoresV!==2) actualizarValores();
    return o.apply(this,arguments).map(j=>{ j.valor=valorMercado(j); j.precio=Math.max(0.5,_r(j.valor*((j.edad||25)<23?1.1:1))); return j; });
  });
  envolver("tickSemana",o=>function(){ const r=o.apply(this,arguments); try{ actualizarValores(); }catch(e){} return r; });
  envolver("finDeTemporada",o=>function(){ try{ devolverPrestamos(); }catch(e){} return o.apply(this,arguments); });
  envolver("normalizarEstado",o=>function(){ const r=o.apply(this,arguments); try{ if(E&&E.plantel) actualizarValores(); }catch(e){} return r; });
})();
/* ---------- UI: libres y préstamos en el Mercado ---------- */
let MERC_EXTRA="libres";
function panelLibresPrestamos(){
  const p=panel("Libres y préstamos","🆓","agua");
  p.cuerpo.appendChild(el("p","mini","Así fichan los clubes chicos de verdad: <b>libres</b> (sin pase: solo prima de firma y sueldo) o <b>a préstamo</b> por la temporada (el club dueño lo suelta si no es titular allá; pagas la mitad del sueldo y vuelve en diciembre)."));
  const f=el("div","fichas");
  [["libres","🆓 Libres"],["prestamo","🔄 Préstamos"]].forEach(([k,n])=>{
    const b=el("button","ficha",n); b.setAttribute("aria-pressed",MERC_EXTRA===k?"true":"false");
    b.onclick=()=>{ MERC_EXTRA=k; pintar(); };
    f.appendChild(b);
  });
  p.cuerpo.appendChild(f);
  const box=el("div"); p.cuerpo.appendChild(box);
  const abierta=(typeof puedeFirmar==="function")?puedeFirmar():true;
  const pintar=()=>{
    f.querySelectorAll(".ficha").forEach((b,i)=>b.setAttribute("aria-pressed",(i===0?"libres":"prestamo")===MERC_EXTRA?"true":"false"));
    box.innerHTML="";
    if(!abierta) box.appendChild(el("p","mini","La ventana está cerrada: se firman cuando abra ("+(typeof proximaVentana==="function"?proximaVentana():"")+")."));
    const lista=(MERC_EXTRA==="libres"?jugadoresLibres():prestables().sort((a,b)=>b.nivel-a.nivel))
      .filter(j=>!MERC_FILTRO.pos||j.pos===MERC_FILTRO.pos).slice(0,MERC_EXTRA==="libres"?24:20);
    if(!lista.length) box.appendChild(el("p","mini","No hay nadie disponible con ese filtro."));
    lista.forEach(j=>{
      const d=el("div","resul mitad");
      const costo=MERC_EXTRA==="libres"?("prima "+plata(j.prima)+" + sueldo "+plata(j.pidesueldo)):("préstamo "+plata(costoPrestamo(j))+" + medio sueldo "+plata(Math.max(1,Math.round((j.sueldo||10)*0.5))));
      d.innerHTML="<b>"+(j.real?"● ":"")+escHtml(j.n)+" <span class='mini'>("+escHtml(MERC_EXTRA==="libres"?"libre":(j.club||"—"))+")</span></b><br>"+
        j.pos+" · "+j.edad+" años · nivel "+j.nivel+(j.proy>j.nivel+4?" · proy "+j.proy:"")+" · "+costo;
      const b=el("button","btn-aqua chico verde",MERC_EXTRA==="libres"?"Fichar libre":"Pedir a préstamo"); b.style.marginTop="6px"; b.disabled=!abierta;
      b.onclick=()=>{ const r=MERC_EXTRA==="libres"?ficharLibre(j):pedirPrestamo(j); aviso(r.msg); if(r.ok) render(); };
      d.appendChild(b); box.appendChild(d);
    });
  };
  pintar();
  return p;
}
(function(){
  const envolver=(nom,fn)=>{ const o=window[nom]; if(typeof o!=="function"||o["_eco"]) return; const w=fn(o); Object.keys(o).forEach(k=>w[k]=o[k]); w._eco=true; window[nom]=w; };
  envolver("vistaMercado",o=>function(){ const r=o.apply(this,arguments); try{ const v=document.getElementById("vista"); if(v&&E) v.appendChild(panelLibresPrestamos()); }catch(e){} return r; });
  envolver("nuevaPartida",o=>function(){ const r=o.apply(this,arguments); try{ actualizarValores(); }catch(e){} return r; });
})();
