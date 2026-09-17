"use strict";
/* ============================================================
   FUTBOLINI 3.0 · mercado.js
   Mercado de fichajes:
   · Ofertas entrantes por tus jugadores → llegan como notificación
     accionable y NO vuelven si las rechazas.
   · Objetivos para comprar con negociación de 4 pilares
     (precio · sueldo · rol · interés) usando barras editables.
   · Ventana de fichajes por mes. Inflación por era enganchada con
     la Mejora 3 vía inflacionEra().
   ============================================================ */

function inflacionEra(){
  if(typeof eraDe!=="function" || !E) return 1;
  const er=eraDe(E.eraBase); return (er&&er.inflacion)||1;
}
function mesMercado(){ const p=proximoPartido(); return p&&p.f?p.f.m:12; }
function mercadoAbierto(){ const m=mesMercado(); return m<=2||m===6||m===7; }
function proximaVentana(){ const m=mesMercado(); return m<6?"junio":(m>7?"enero":"ahora"); }

/* ---------- objetivos: jugadores de otros clubes para comprar ---------- */
function objetivosMercado(){
  const rr=azarFijo(semilla("mercObj"+E.club+E.anio+"-"+E.idx));
  const out=[];
  const posibles=["ARQ","DEF","DEF","VOL","VOL","DEL","DEL"];
  const n=4+Math.floor(rr()*3);
  for(let i=0;i<n;i++){
    const pos=posibles[Math.floor(rr()*posibles.length)];
    const j=generarJugador(rr, E.ind.plantel+(rr()*22-8), pos, 18+Math.floor(rr()*15));
    j.club=CLUBES_COMPRADORES[Math.floor(rr()*CLUBES_COMPRADORES.length)];
    j.precio=Math.round(j.valor*(0.9+rr()*0.6)*inflacionEra());
    j.pidesueldo=Math.max(j.sueldo, Math.round(j.sueldo*(1+rr()*0.4)));
    out.push(j);
  }
  return out;
}
function mercadoSemana(){
  if(!E.mercado || E.mercado.idx!==E.idx){ E.mercado={idx:E.idx, objetivos:objetivosMercado()}; }
  return E.mercado;
}

/* ---------- ofertas entrantes por TUS jugadores (persistentes) ---------- */
/* Se generan al avanzar la semana y quedan en E.ofertasPend hasta que
   respondes o caducan. Si rechazaste, ese jugador queda "enfriado". */
/* crea UNA oferta entrante por una figura disponible; devuelve true si lo logró */
function crearOfertaEntrante(rr){
  const cand=E.plantel.filter(j=>!j.vendido && !j.cedido
    && !E.ofertasPend.some(o=>o.jid===j.n)                     // no dos ofertas por el mismo
    && (E.mercadoLog.rechazadas[j.n]==null || E.idx-E.mercadoLog.rechazadas[j.n]>=4)); // enfriamiento tras rechazo
  if(!cand.length) return false;
  /* peso más plano: reciben ofertas más jugadores, no siempre el crack */
  const j=eligePeso(cand, x=>clamp(0.4+x.valor/700+(x.proy>x.nivel+4?0.35:0)+(x.edad<24?0.25:0),0.15,1.6));
  if(!j) return false;
  const comprador=CLUBES_COMPRADORES[Math.floor(rr()*CLUBES_COMPRADORES.length)];
  const monto=Math.round(j.valor*(0.8+rr()*0.8)*inflacionEra());
  const claus=(typeof clausulaDe==="function")?clausulaDe(j):0;
  const pagaClau=claus>0 && monto>=claus;
  const of={id:"of"+(E._ofid=(E._ofid||0)+1), jid:j.n, comprador:comprador, monto:monto, creada:E.idx, pagaClausula:pagaClau};
  E.ofertasPend.push(of);
  const sobre=monto-j.valor;
  notificar({
    t:comprador+" ofrece por "+j.n, tipo:"mercado",
    d:comprador+" pone "+plata(monto)+" sobre la mesa por "+j.n+" ("+j.pos+", nivel "+j.nivel+
      ", valor estimado "+plata(j.valor)+
      (claus?", cláusula "+plata(claus)+" hasta "+(j.contrato&&j.contrato.hasta||"—"):"")+"). "+
      (pagaClau?"Pagan la cláusula: el contrato se cae si aceptas.":(sobre>=0?"Pagan por encima del valor: buena venta para la caja.":"Ofrecen por debajo del valor: venderías resignando plata."))+
      (j.rasgos&&(j.rasgos.includes("ídolo")||j.rasgos.includes("capitán"))?" Ojo: es un referente, la hinchada lo va a sentir.":"")+
      " Responde desde Avisos o desde la sección Mercado.",
    acc:{tipo:"ofertaJugador", ofertaId:of.id, resuelta:false}
  });
  return true;
}
/* Lluvia de ofertas: durante la ventana llueven; fuera, alguna esporádica. */
function generarOfertasSemana(){
  if(!E.ofertasPend) E.ofertasPend=[];
  if(!E.mercadoLog) E.mercadoLog={rechazadas:{},vendidos:[]};
  caducarOfertas();
  const rr=azarFijo(semilla("oferta"+E.club+E.anio+"-"+E.idx));
  const abierto=mercadoAbierto();
  let hechas=0;
  if(rr()<(abierto?0.62:0.18) && crearOfertaEntrante(rr)) hechas++;
  if(abierto && rr()<0.38 && crearOfertaEntrante(rr)) hechas++;   // segunda oferta en plena ventana
  return hechas?true:null;
}
/* ---------- venta flash / panic sell ---------- */
function ventaFlash(j){
  if(!j || j.vendido) return;
  const pct=rnd(0.40,0.55);
  const monto=Math.round(j.valor*pct);
  j.vendido=true; E.plata+=monto;
  const ref=j.rasgos&&(j.rasgos.includes("ídolo")||j.rasgos.includes("capitán"));
  E.ind.plantel=clamp(E.ind.plantel-Math.round(j.nivel/14),0,100);
  aplicarGrupos({directorio:-12, hinchada:ref?-12:-4});
  aplicarRep({credibilidad:-4});
  E.ofertasPend=(E.ofertasPend||[]).filter(o=>o.jid!==j.n);
  E.mercadoLog.vendidos.push({n:j.n,monto:monto,anio:E.anio,flash:true});
  const txtFlash=ref
    ?("Remataste a "+j.n+" por "+plata(monto)+" ("+Math.round(pct*100)+"% de su valor). Plata rápida, pero el directorio y la hinchada lo leen como manotazo de ahogado sobre un referente.")
    :("Remataste a "+j.n+" por "+plata(monto)+" ("+Math.round(pct*100)+"% de su valor). Entra plata ya; el directorio frunce el ceño por el precio, no necesariamente por la salida.");
  notificar({t:"Venta de urgencia: "+j.n,tipo:"malo",d:txtFlash});
  if(typeof redesReaccion==="function") redesReaccion("venta",{n:j.n,flash:true,ref:ref,edad:j.edad,nivel:j.nivel});
  guardar();
}
/* ---------- préstamos ---------- */
function puedeCeder(j){ return j && !j.vendido && !j.cedido && j.edad<=23; }
function cederPrestamo(j){
  if(!puedeCeder(j)) return;
  const club=CLUBES_COMPRADORES[Math.floor(Math.random()*CLUBES_COMPRADORES.length)];
  j.cedido={desde:E.anio, hasta:E.anio+1, club:club};
  E.ind.plantel=clamp(Math.round(mediaPlantel()),0,100);
  notificar({t:j.n+" se va a préstamo",tipo:"neutro",
    d:j.n+" ("+j.edad+" años, nivel "+j.nivel+") se va cedido a "+club+" por una temporada para foguearse. No lo tienes disponible este año, pero vuelve mejor y el club que lo recibe le paga el sueldo."});
  guardar();
}
function caducarOfertas(){
  if(!E.ofertasPend) return;
  const vivos=[];
  E.ofertasPend.forEach(o=>{
    if(E.idx-o.creada>=3){                                      // caduca a las 3 fechas
      const n=(E.notifs||[]).find(x=>x.acc&&x.acc.ofertaId===o.id&&!x.acc.resuelta);
      if(n){ n.acc.resuelta=true; }
      notificar({t:"Se cayó la oferta por "+o.jid,tipo:"neutro",
        d:o.comprador+" se cansó de esperar y retiró su oferta de "+plata(o.monto)+" por "+o.jid+".",bandeja:false});
    } else vivos.push(o);
  });
  E.ofertasPend=vivos;
}
function ofertaPorId(id){ return (E.ofertasPend||[]).find(o=>o.id===id)||null; }
/* Responder oferta: aceptar | rechazar | contra (pedir más plata).
   modo: true/"aceptar" | false/"rechazar" | "contra" */
function responderOferta(notif, modo){
  const of=ofertaPorId(notif.acc&&notif.acc.ofertaId);
  if(!of){ if(notif.acc) notif.acc.resuelta=true; guardar(); return; }
  const j=E.plantel.find(x=>x.n===of.jid && !x.vendido);
  const aceptar=modo===true||modo==="aceptar";
  const contra=modo==="contra";

  /* --- contraoferta: el otro club puede subir o retirarse --- */
  if(contra){
    if(of._contraHecha){
      if(typeof aviso==="function") aviso("Ya pediste más por esta oferta.");
      return;
    }
    of._contraHecha=true;
    const rr=Math.random();
    if(rr<0.42){
      /* aceptan subir ~12-22% */
      const sube=Math.round(of.monto*(0.12+Math.random()*0.10));
      of.monto+=sube;
      notificar({t:of.comprador+" mejora la oferta",tipo:"mercado",
        d:of.comprador+" aceptó negociar y subió a "+plata(of.monto)+" por "+of.jid+
          ". La oferta sigue abierta: puedes aceptar o rechazar desde Avisos.",
        acc:{tipo:"ofertaJugador", ofertaId:of.id, resuelta:false}});
      /* la notif original queda resuelta; la nueva es la viva */
      if(notif.acc) notif.acc.resuelta=true;
    } else if(rr<0.72){
      /* se mantienen firmes */
      notificar({t:of.comprador+" no sube",tipo:"neutro",
        d:of.comprador+" se mantiene en "+plata(of.monto)+" por "+of.jid+
          ". Última chance: aceptar o rechazar.",
        acc:{tipo:"ofertaJugador", ofertaId:of.id, resuelta:false}});
      if(notif.acc) notif.acc.resuelta=true;
    } else {
      /* se retiran ofendidos */
      E.ofertasPend=E.ofertasPend.filter(o=>o.id!==of.id);
      E.mercadoLog.rechazadas[of.jid]=E.idx;
      if(notif.acc) notif.acc.resuelta=true;
      notificar({t:of.comprador+" se retiró",tipo:"malo",
        d:"Al pedir más plata, "+of.comprador+" se ofendió y retiró la oferta por "+of.jid+
          ". No van a volver a llamar en un tiempo."});
    }
    guardar();
    return;
  }

  /* --- aceptar / rechazar (cierra la oferta) --- */
  if(notif.acc) notif.acc.resuelta=true;
  E.ofertasPend=E.ofertasPend.filter(o=>o.id!==of.id);
  if(aceptar && j){
    const q=(typeof jugadorQuiereSalir==="function")?jugadorQuiereSalir(j,of):{quiere:true,obligatorio:true};
    if(!q.obligatorio && !q.quiere && !of._forzado){
      /* el jugador se niega: la oferta sigue viva, hay que hablar */
      of._jugadorDijoNo=true;
      E.ofertasPend.push(of);
      if(notif.acc) notif.acc.resuelta=false;
      j.moral=clamp((j.moral||70)+4,0,100);
      notificar({t:j.n+" no se quiere ir",tipo:"neutro",bandeja:false,
        d:j.n+" escuchó a "+of.comprador+" ("+plata(of.monto)+") y dijo que no. "+(q.razon||"")+" Moral +4: se sintió escuchado. Para moverlo hay que convencerlo o pagar la cláusula."});
      if(typeof redesReaccion==="function") redesReaccion("venta",{n:j.n,ref:esReferente(j),edad:j.edad,nivel:j.nivel,rechazoJugador:true});
      guardar();
      return;
    }
    j.vendido=true; E.plata+=of.monto;
    const ref=j.rasgos&&(j.rasgos.includes("ídolo")||j.rasgos.includes("capitán"));
    E.ind.plantel=clamp(E.ind.plantel-Math.round(j.nivel/14),0,100);
    aplicarGrupos({hinchada:ref?-12:-2, directorio:8});
    E.mercadoLog.vendidos.push({n:j.n,monto:of.monto,anio:E.anio});
    const clau=(typeof clausulaDe==="function")?clausulaDe(j):0;
    const pagoClau=of.pagaClausula||(clau>0&&of.monto>=clau);
    let txt;
    if(pagoClau){
      txt="Pagan la cláusula de "+j.n+" ("+plata(of.monto)+", contrato hasta "+(j.contrato&&j.contrato.hasta||"—")+"). El vínculo se corta: no hay más negociación.";
    } else if(ref){
      txt="Se cerró la salida de "+j.n+" a "+of.comprador+" por "+plata(of.monto)+
        ". Entra plata seria, pero vender a un referente siempre deja herida abierta en la hinchada. El directorio, en cambio, celebra el ingreso.";
    } else if(j.edad>=32){
      txt="Se cerró la salida de "+j.n+" ("+j.edad+" años) a "+of.comprador+" por "+plata(of.monto)+
        ". Operación de ciclo: se libera sueldo y entra caja. Pocos discuten la lógica.";
    } else {
      txt="Se cerró la salida de "+j.n+" a "+of.comprador+" por "+plata(of.monto)+
        ". Entra la plata a la caja y el plantel baja un poco de nivel. Decisión fría de conducción.";
    }
    notificar({t:"Vendiste a "+j.n,tipo:"bueno",d:txt});
    if(typeof redesReaccion==="function") redesReaccion("venta",{n:j.n,ref:ref,edad:j.edad,nivel:j.nivel});
  } else {
    E.mercadoLog.rechazadas[of.jid]=E.idx;
    const clauJ=j&&(typeof clausulaDe==="function")?clausulaDe(j):0;
    const queriaIr=j && (of.pagaClausula||(clauJ>0&&of.monto>=clauJ));
    if(queriaIr){
      j.moral=clamp((j.moral||70)-10,0,100);
      notificar({t:"Rechazaste la cláusula de "+of.jid,tipo:"malo",
        d:of.comprador+" ponía la cláusula y dijiste que no. "+of.jid+" se queda, pero el camarín lo siente: quería irse. Moral −10."});
    } else {
      notificar({t:"Rechazaste la oferta por "+of.jid,tipo:"neutro",
        d:"Le dijiste que no a "+of.comprador+". "+of.jid+" sigue en el plantel. Ese club no va a volver a preguntar por un tiempo."});
    }
  }
  guardar();
}
/* Salir a buscar comprador por un jugador que VOS quieres vender. */
function buscarComprador(j){
  if(!E.ofertasPend) E.ofertasPend=[];
  if(E.ofertasPend.some(o=>o.jid===j.n)){ aviso("Ya hay una oferta abierta por "+j.n); return; }
  const rr=azarFijo(semilla("busca"+j.n+E.idx));
  /* cuanto más valioso y joven, más fácil que aparezca interesado */
  const prob=clamp(0.35+j.valor/500+(j.edad<26?0.15:0),0.2,0.9);
  if(rr()>prob){
    notificar({t:"Nadie preguntó por "+j.n,tipo:"neutro",
      d:"Moviste el teléfono para colocar a "+j.n+", pero por ahora no apareció ningún club interesado."});
    render(); return;
  }
  const comprador=CLUBES_COMPRADORES[Math.floor(rr()*CLUBES_COMPRADORES.length)];
  const monto=Math.round(j.valor*(0.7+rr()*0.7)*inflacionEra());  // ofrecen algo menos si sos vos el que ofrece
  const of={id:"of"+(E._ofid=(E._ofid||0)+1), jid:j.n, comprador:comprador, monto:monto, creada:E.idx};
  E.ofertasPend.push(of);
  notificar({t:comprador+" se interesa por "+j.n,tipo:"mercado",
    d:"Tras ofrecerlo, "+comprador+" responde con "+plata(monto)+" por "+j.n+" (valor "+plata(j.valor)+"). Aceptás o rechazas desde acá.",
    acc:{tipo:"ofertaJugador", ofertaId:of.id, resuelta:false}});
  render();
}

/* ---------- negociación de compra (4 pilares) ---------- */
function interesJugador(j,oferta){
  let v=0;
  v += (E.ind.prestigio-50)*0.6;
  v += clamp((oferta.sueldo-j.pidesueldo)/Math.max(1,j.pidesueldo)*45,-30,30);
  v += ({titular:12, promesa:(j.edad<=22?14:0), suplente:-10}[oferta.rol]||0);
  v += (E.plata>300?4:0);
  return Math.round(v);
}
function posturaVendedor(j,oferta){ return Math.round((oferta.precio-j.precio)/Math.max(1,j.precio)*100); }
function jugadorAcepta(j,oferta){ return interesJugador(j,oferta)>=0; }
function clubAcepta(j,oferta){ return oferta.precio>=Math.round(j.precio*0.9); }

/* 7.99952 · el jugador DECIDE. No es un botón. Moral, ídolo, cláusula, edad. */
function esReferente(j){
  return !!(j&&j.rasgos&&(j.rasgos.indexOf("ídolo")>=0||j.rasgos.indexOf("capitán")>=0||j.rasgos.indexOf("de la casa")>=0));
}
function tieneManager(j){
  if(!j) return false;
  if(j.rasgos&&j.rasgos.indexOf("mercenario")>=0) return true;
  if((j.nivel||0)>=70) return true;
  if((j.valor||0)>=180) return true;
  if((j.edad||25)<=23 && (j.proy||0)>=(j.nivel||50)+6) return true;
  return false;
}
function jugadorQuiereSalir(j,of){
  if(!j) return {quiere:false,peso:0,razon:"nadie",obligatorio:false};
  const ofe=of||{};
  const monto=ofe.monto||ofe.precio||0;
  const valor=Math.max(1,j.valor||80);
  const ratio=monto/valor;
  const moral=j.moral||70;
  const ref=esReferente(j);
  const claus=(typeof clausulaDe==="function")?clausulaDe(j):0;
  const pagaClau=!!(ofe.pagaClausula||(claus>0&&monto>=claus));
  if(pagaClau) return {quiere:true,peso:100,razon:"Pagan la cláusula: el contrato se cae.",obligatorio:true};
  let peso=0;
  if(moral<42) peso+=38;
  else if(moral<55) peso+=16;
  else if(moral>82) peso-=22;
  if(ref) peso-=28;
  if(j.rasgos&&j.rasgos.indexOf("de la casa")>=0) peso-=12;
  if(j.rasgos&&j.rasgos.indexOf("mercenario")>=0) peso+=24;
  if((j.edad||25)<=23) peso+=10;
  if((j.edad||25)>=33) peso-=10;
  if(ratio>=1.35) peso+=20;
  else if(ratio<0.75) peso-=14;
  if((E.ind.prestigio||50)<38) peso+=12;
  if((E.ind.hinchada||50)<32 && ref) peso+=8;
  let razon;
  if(peso>=18) razon=moral<50?"Está descontento y se quiere ir.":"La oferta lo tienta.";
  else if(ref) razon="Es referente: no se va porque el DT aprete un botón.";
  else if(moral>80) razon="Está bien acá. Hay que convencerlo.";
  else razon="No está decidido. Habla, mira la plata, mira al DT.";
  return {quiere:peso>=18,peso:peso,razon:razon,obligatorio:false};
}
function convencerSalida(j,of){
  const q=jugadorQuiereSalir(j,of);
  if(q.obligatorio) return true;
  const moral=j.moral||70;
  const ratio=(of.monto||0)/Math.max(1,j.valor||80);
  let p=0.22+(70-moral)*0.007+(ratio-1)*0.18;
  if(tieneManager(j)) p+=0.14;
  if(esReferente(j)) p-=0.22;
  p=clamp(p,0.08,0.72);
  return Math.random()<p;
}
function _periodistaMercado(){
  if(typeof bucketPeriodistas==="function"){
    const b=bucketPeriodistas((E&&E.anio)||2026)||[];
    if(b.length) return b[Math.floor(Math.random()*b.length)];
  }
  return {n:"la prensa",m:"radio local",r:"periodista"};
}
function vocesMercado(j,of,ctx){
  const voces=[];
  if(!j) return voces;
  const q=jugadorQuiereSalir(j,of);
  const moral=j.moral||70;
  const ref=esReferente(j);
  const monto=of&&(of.monto||of.precio)||0;
  const club=(of&&of.comprador)||(j.club)||"el otro club";
  /* jugador */
  let yo;
  if(q.obligatorio) yo="Si pagan la cláusula, me voy. El contrato es el contrato.";
  else if(q.quiere&&moral<50) yo="Quiero irme. Acá ya no estoy cómodo.";
  else if(q.quiere) yo="La oferta es seria. Quiero escucharlo.";
  else if(ref) yo="Yo me puse esta camiseta. No me voy porque llegue un sobre.";
  else if(moral>80) yo="Estoy bien. Si el club necesita la plata, hablamos. Si no, me quedo.";
  else yo="Depende. Que me expliquen el proyecto y el sueldo.";
  voces.push({quien:j.n,rol:"jugador",txt:yo});
  /* representante */
  if(tieneManager(j)){
    let mgr;
    if(q.obligatorio) mgr="Cláusula pagada. Firmamos y cobramos. No hay novela.";
    else if(q.quiere) mgr="Mi representado está abierto. Suban un poco y cerramos.";
    else mgr="Hoy no está para irse. Si insisten, la comisión también sube.";
    voces.push({quien:"el representante de "+j.n,rol:"manager",txt:mgr});
  }
  /* prensa — nombres reales, lo que dicen es ficción del juego */
  const per=_periodistaMercado();
  let pr;
  if(ctx==="compra") pr=j.n+" al "+(E.clubNombre||"club")+". "+(q.quiere?"El entorno no lo descarta.":"El entorno frena.");
  else if(ref) pr="Vender a "+j.n+" no es una operación: es una declaración. La hinchada ya está hablando.";
  else pr=club+" pone "+(typeof plata==="function"?plata(monto):monto)+" por "+j.n+". El DT tiene que decidir con el camarín, no con el Excel.";
  voces.push({quien:per.n,rol:"prensa",medio:per.m,txt:pr});
  /* hinchada */
  const hin=E.ind&&E.ind.hinchada||50;
  let ht;
  if(ref&&hin>=55) ht="Si se va, que se vaya el DT también. A "+j.n+" no se lo toca.";
  else if(ref) ht="Duele. Pero si entra plata para armar equipo, se aguanta. A regañadientes.";
  else if(q.quiere) ht="Si el tipo se quiere ir, que se vaya. Acá se queda el que pelea.";
  else ht="Que no malvendan. Y que avisen, no nos enteremos por un filtrado.";
  voces.push({quien:"la hinchada",rol:"hincha",txt:ht});
  return voces;
}
function pintarVoces(donde,voces){
  if(!donde||!voces||!voces.length) return;
  const box=el("div","voces-merc");
  voces.forEach(function(v){
    const d=el("div","voz "+(v.rol||""));
    d.innerHTML="<b>"+v.quien+(v.medio?" <span class='mini'>· "+v.medio+"</span>":"")+"</b><span class='mini'>«"+v.txt+"»</span>";
    box.appendChild(d);
  });
  donde.appendChild(box);
}

function cerrarFichaje(j,oferta){
  const comision=oferta.comision||0;
  E.plata-=(oferta.precio+comision);
  const nuevo=Object.assign({}, j, {
    sueldo:oferta.sueldo, rol:oferta.rol, real:false, forma:66, moral:70,
    contrato:{hasta:E.anio+2+(oferta.rol==="promesa"?2:0), clausula:Math.max(30, Math.round((j.valor||80)*1.7))}, lesion:0, goles:0, partidos:0, tarjetas:0
  });
  delete nuevo.precio; delete nuevo.pidesueldo; delete nuevo.club;
  E.plantel.push(nuevo);
  E.ind.plantel=clamp(Math.round(mediaPlantel()),0,100);
  const m=mercadoSemana(); m.objetivos=m.objetivos.filter(x=>x!==j);
  notificar({t:"Fichaste a "+nuevo.n,tipo:"bueno",
    d:"Se incorpora "+nuevo.n+" ("+nuevo.pos+", nivel "+nuevo.nivel+") como "+oferta.rol+". Costó "+plata(oferta.precio)+
      (comision?" + "+plata(comision)+" de comisión al representante":"")+
      " y gana "+plata(oferta.sueldo)+" al año. El nivel del plantel se recalcula."});
  if(typeof redesReaccion==="function") redesReaccion("ficha",{n:nuevo.n});
  guardar();
  return nuevo;
}

/* ---------- ojeo / informe de scout (revela lo que no dicen los números) ---------- */
function costoOjeo(j){ return Math.max(8, Math.round((j.valor||100)*0.04)); }
function informeOjeo(j){
  if(!E.ojeados) E.ojeados={};
  if(E.ojeados[j.n]) return E.ojeados[j.n];
  const rr=azarFijo(semilla("ojeo"+j.n+(E.club||"")));
  const pick=a=>a[Math.floor(rr()*a.length)];
  const caracter=pick(["líder de camarín","profesional callado","temperamental, cuesta manejarlo",
    "inseguro bajo presión","algo mercenario","corazón, deja todo en la cancha","frío pero cumplidor"]);
  const fisico=(rr()<0.22)?"frágil: se lesiona seguido":(rr()<0.55?"físico normal":"de fierro, casi no para");
  const techo=(j.proy>=j.nivel+8)?"techo alto: puede pegar el salto":((j.proy>j.nivel+3)?"tiene margen para crecer":"ya es lo que va a ser");
  const humor=pick(["motivado, quiere el desafío","cómodo donde está, hay que convencerlo","con un pie afuera de su club","dolido con su hinchada actual"]);
  const info={caracter:caracter, fisico:fisico, techo:techo, humor:humor};
  E.ojeados[j.n]=info; return info;
}
function ojear(j){
  if(E.ojeados&&E.ojeados[j.n]) return;
  const costo=costoOjeo(j);
  if(E.plata<costo){ if(typeof aviso==="function") aviso("No te alcanza para el informe ("+plata(costo)+")"); return; }
  aplicarEfectos({plata:-costo});
  informeOjeo(j);
  guardar(); render();
  if(typeof aviso==="function") aviso("Informe de ojeador listo: "+j.n);
}
/* comisión del representante (fija por jugador, 5-13% del precio) */
function comisionRep(precio,j){ const pct=5+(semilla((j&&j.n)||"rep")%9); return Math.round((precio||0)*pct/100); }

/* ============================================================
   UI del mercado
   ============================================================ */
function vistaMercado(){
  const v=$("#vista");
  const abierto=mercadoAbierto();
  const cab=panel("Mercado de fichajes","🧳","agua");
  cab.cuerpo.appendChild(el("p","mini","Ventana "+(abierto?"<b>abierta</b>":"<b>cerrada</b>")+
    ". Comprás solo en pretemporada (enero-febrero) y a mitad de año (junio-julio)."+
    (abierto?"":" Próxima apertura: "+proximaVentana()+". Las ofertas por tus jugadores igual las puedes responder.")+
    " Vender no es un botón: habla el jugador, el representante si tiene, la prensa y la hinchada. El ídolo puede plantarse."));
  cab.cuerpo.appendChild(fila("Caja disponible",plata(E.plata)));
  if(inflacionEra()!==1) cab.cuerpo.appendChild(fila("Inflación de la era","×"+inflacionEra().toFixed(2)));
  v.appendChild(cab);

  /* --- ofertas entrantes (persistentes) --- */
  const pe=panel("Ofertas por tus jugadores","📥",(E.ofertasPend&&E.ofertasPend.length)?"alerta":"");
  if(!E.ofertasPend||!E.ofertasPend.length) pe.cuerpo.appendChild(el("p","mini","No hay ofertas abiertas. Cuando un club pregunte por alguien tuyo, te va a llegar un aviso."));
  (E.ofertasPend||[]).forEach(of=>{
    const j=E.plantel.find(x=>x.n===of.jid&&!x.vendido); if(!j) return;
    const d=el("div","resul mitad");
    d.innerHTML="<b>"+of.comprador+" quiere a "+j.n+"</b><br>"+
      j.pos+" · nivel "+j.nivel+" · ofrecen <b>"+plata(of.monto)+"</b> (valor "+plata(j.valor)+")";
    const cont=el("div"); cont.style.marginTop="6px";
    const nOf=()=>(E.notifs||[]).find(x=>x.acc&&x.acc.ofertaId===of.id&&!x.acc.resuelta);
    const ba=el("button","btn-aqua chico verde","Hablar / negociar");
    ba.onclick=()=>modalVender(of,j,abierto);
    const bc=el("button","btn-aqua chico","Pedir más"); bc.style.marginLeft="6px";
    bc.onclick=()=>{ const n=nOf(); if(n) responderOferta(n,"contra"); render(); };
    const br=el("button","btn-aqua chico gris","Rechazar"); br.style.marginLeft="6px";
    br.onclick=()=>{ const n=nOf(); if(n) responderOferta(n,"rechazar"); render(); };
    cont.appendChild(ba); cont.appendChild(bc); cont.appendChild(br); d.appendChild(cont);
    pe.cuerpo.appendChild(d);
  });
  v.appendChild(pe);

  /* --- vender jugadores (buscar comprador / rematar) --- */
  const pv=panel("Vender jugadores","💸");
  pv.cuerpo.appendChild(el("p","mini","«Buscar comprador» ofrece al jugador y espera interés. «Rematar» lo vende YA por el 40-55% del valor (plata urgente, pero el directorio lo castiga)."));
  E.plantel.filter(j=>!j.vendido&&!j.cedido).sort((a,b)=>b.valor-a.valor).slice(0,12).forEach(j=>{
    const row=el("div","resul mitad");
    row.innerHTML='<b>'+(j.real?"● ":"")+j.n+'</b> <span class="mini">'+j.pos+" · niv "+j.nivel+" · "+plata(j.valor)+'</span>';
    const cont=el("div"); cont.style.marginTop="5px";
    const tiene=E.ofertasPend&&E.ofertasPend.some(o=>o.jid===j.n);
    const b=el("button","btn-aqua chico"+(tiene?" gris":""),"Buscar comprador"); b.disabled=tiene;
    b.onclick=()=>buscarComprador(j);
    const br=el("button","btn-aqua chico rojo","Rematar"); br.style.marginLeft="6px";
    br.onclick=()=>{ if(confirm("¿Rematar a "+j.n+" por ~"+plata(Math.round(j.valor*0.47))+"? El directorio no lo va a perdonar.")){ ventaFlash(j); render(); } };
    cont.appendChild(b); cont.appendChild(br); row.appendChild(cont);
    pv.cuerpo.appendChild(row);
  });
  v.appendChild(pv);

  /* --- cesiones a préstamo --- */
  const pc=panel("Cesiones a préstamo","🔄");
  pc.cuerpo.appendChild(el("p","mini","Manda juveniles (≤23) a foguearse una temporada. Vuelven con más nivel; mientras tanto no los tienes y el otro club les paga el sueldo."));
  const cedidos=E.plantel.filter(j=>!j.vendido&&j.cedido);
  if(cedidos.length){
    pc.cuerpo.appendChild(el("h3","sub","En préstamo ahora"));
    cedidos.forEach(j=>pc.cuerpo.appendChild(el("div","fila","<span>"+j.n+' <span class="mini">'+j.pos+" · niv "+j.nivel+'</span></span><b class="mini">'+j.cedido.club+" · vuelve "+j.cedido.hasta+"</b>")));
  }
  const cedibles=E.plantel.filter(puedeCeder).sort((a,b)=>b.proy-a.proy).slice(0,10);
  if(cedibles.length){
    pc.cuerpo.appendChild(el("h3","sub","Se pueden ceder"));
    cedibles.forEach(j=>{
      const row=el("div","fila");
      row.innerHTML='<span>'+j.n+' <span class="mini">'+j.pos+" · "+j.edad+"a · niv "+j.nivel+" · proy "+j.proy+'</span></span>';
      const b=el("button","btn-aqua chico","Ceder");
      b.onclick=()=>{ cederPrestamo(j); render(); };
      row.appendChild(b); pc.cuerpo.appendChild(row);
    });
  } else if(!cedidos.length){ pc.cuerpo.appendChild(el("p","mini","No tienes juveniles para ceder ahora mismo.")); }
  v.appendChild(pc);

  /* --- objetivos para comprar (con filtros) --- */
  const po=panel("Objetivos en el mercado","📤");
  if(!abierto) po.cuerpo.appendChild(el("div","resul mal","La ventana está cerrada: puedes mirar y negociar, pero no cerrar compras hasta "+proximaVentana()+"."));
  /* filtros */
  po.cuerpo.appendChild(el("label","lb","Posición"));
  const fp=el("div","fichas");
  [["","Todas"],["ARQ","ARQ"],["DEF","DEF"],["VOL","VOL"],["DEL","DEL"]].forEach(([k,n])=>{
    const b=el("button","ficha",n); b.setAttribute("aria-pressed",MERC_FILTRO.pos===k?"true":"false");
    b.onclick=()=>{ MERC_FILTRO.pos=k; render(); }; fp.appendChild(b);
  });
  po.cuerpo.appendChild(fp);
  const fx=el("div","fichas");
  [["joven","Jóvenes (≤23)"],["barato","Dentro de mi caja"]].forEach(([k,n])=>{
    const b=el("button","ficha",n); b.setAttribute("aria-pressed",MERC_FILTRO[k]?"true":"false");
    b.onclick=()=>{ MERC_FILTRO[k]=!MERC_FILTRO[k]; render(); }; fx.appendChild(b);
  });
  po.cuerpo.appendChild(fx);
  const merc=mercadoSemana();
  const lista=merc.objetivos.filter(j=>
    (!MERC_FILTRO.pos||j.pos===MERC_FILTRO.pos) &&
    (!MERC_FILTRO.joven||j.edad<=23) &&
    (!MERC_FILTRO.barato||j.precio<=E.plata));
  if(!lista.length) po.cuerpo.appendChild(el("p","mini","Ningún objetivo cumple los filtros esta semana."));
  lista.forEach(j=>{
    const d=el("div","resul mitad");
    d.innerHTML="<b>"+j.n+" <span class='mini'>("+j.club+")</span></b><br>"+
      j.pos+" · "+j.edad+" años · nivel "+j.nivel+(j.proy>j.nivel+4?" · proy "+j.proy:"")+
      " · piden <b>"+plata(j.precio)+"</b> + sueldo "+plata(j.pidesueldo);
    const oj=E.ojeados&&E.ojeados[j.n];
    if(oj) d.appendChild(el("div","mini","🔍 <b>Informe:</b> "+oj.caracter+" · "+oj.fisico+" · "+oj.techo+" · "+oj.humor));
    const cont=el("div"); cont.style.marginTop="6px";
    if(!oj){
      const bo=el("button","btn-aqua chico","Ojear ("+plata(costoOjeo(j))+")");
      bo.onclick=()=>ojear(j); cont.appendChild(bo);
    }
    const b=el("button","btn-aqua chico verde","Negociar / Comprar"); if(!oj) b.style.marginLeft="6px";
    b.onclick=()=>modalComprar(j,abierto);
    cont.appendChild(b); d.appendChild(cont);
    po.cuerpo.appendChild(d);
  });
  v.appendChild(po);
}
var MERC_FILTRO={pos:"",joven:false,barato:false};

/* Negociación de compra en 2-3 pasos: tu oferta → contraoferta → cierre.
   Insistir cuesta (suben lo que piden); a las 3 rondas se levantan de la mesa. */
function modalComprar(j,abierto){
  const oferta={ precio:j.precio, sueldo:j.pidesueldo, rol:"titular", comisionRebaja:false, comisionIntento:false };
  const minP=Math.max(1,Math.round(j.precio*0.5)), maxP=Math.round(j.precio*1.7);
  const minS=Math.max(1,Math.round(j.pidesueldo*0.7)), maxS=Math.round(j.pidesueldo*2);
  let paso=1, contra=null, ronda=0, exigePrecio=Math.round(j.precio*0.9);
  const comAct=()=>Math.round(comisionRep(oferta.precio,j)*(oferta.comisionRebaja?0.5:1));
  const costoTotal=()=>oferta.precio+comAct();
  modal(box=>{
    const cerrar=()=>{ oferta.comision=comAct(); const nuevo=cerrarFichaje(j,oferta); cerrarModal(); render(); aviso("Fichaste a "+nuevo.n+" ("+oferta.rol+")"); };
    const regatearComision=()=>{
      if(oferta.comisionIntento){ if(typeof aviso==="function") aviso("Ya le apretaste la mano al representante."); return; }
      oferta.comisionIntento=true;
      if(Math.random()<0.5){ oferta.comisionRebaja=true; if(typeof aviso==="function") aviso("El representante aflojó: comisión a la mitad."); }
      else { if(typeof aviso==="function") aviso("El representante no baja un peso. Es lo que es."); }
      pintar();
    };
    /* evalúa la oferta actual: aceptan, o arman contraoferta */
    const evaluar=()=>{
      ronda++;
      const cok=oferta.precio>=exigePrecio, jok=jugadorAcepta(j,oferta);
      if(cok&&jok){
        if(!abierto){ contra={cerrado:false,msg:"El acuerdo está, pero la ventana está cerrada: no se puede firmar hasta "+proximaVentana()+"."}; paso=2; pintar(); return; }
        if(E.plata<costoTotal()){ contra={cerrado:false,msg:"Se pusieron de acuerdo, pero no te alcanza la caja: precio "+plata(oferta.precio)+" + comisión "+plata(comAct())+"."}; paso=2; pintar(); return; }
        cerrar(); return;
      }
      contra={cerrado:false};
      if(!cok) contra.precio=exigePrecio;
      if(!jok){ contra.sueldo=Math.max(oferta.sueldo, Math.round(j.pidesueldo*1.12)); contra.rol=(j.edad<=22?"promesa":"titular"); }
      contra.msg = "El club "+(cok?"acepta el precio":"pide "+plata(contra.precio))+
        (jok?"":" · el jugador quiere "+plata(contra.sueldo)+(contra.rol&&contra.rol!==oferta.rol?" y ser "+contra.rol:""));
      paso=2; pintar();
    };
    const insistir=()=>{
      /* pequeña chance de que cedan; si no, suben la vara y vuelven a contraofertar */
      if(Math.random()<Math.max(0.05,0.28-ronda*0.08)){ // ceden a tu oferta actual
        if(!abierto||E.plata<costoTotal()){ evaluar(); return; }
        cerrar(); return;
      }
      exigePrecio=Math.round(exigePrecio*1.06);
      if(ronda>=3){ paso=3; pintar(); return; }   // se levantan de la mesa
      evaluar();
    };
    const aceptarContra=()=>{
      if(contra.precio) oferta.precio=contra.precio;
      if(contra.sueldo) oferta.sueldo=contra.sueldo;
      if(contra.rol) oferta.rol=contra.rol;
      if(!abierto){ contra.msg="Trato cerrado en la palabra, pero la ventana está cerrada: firmas en "+proximaVentana()+"."; pintar(); return; }
      if(E.plata<costoTotal()){ contra.msg="Aceptaste, pero no te alcanza la caja: precio "+plata(oferta.precio)+" + comisión "+plata(comAct())+"."; pintar(); return; }
      cerrar();
    };
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🧳</span><span>Fichar a '+j.n+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini",j.club+" · "+j.pos+" · "+j.edad+" años · nivel "+j.nivel+
        (j.proy>j.nivel+4?" · proyección "+j.proy:"")+". Piden "+plata(j.precio)+" y sueldo "+plata(j.pidesueldo)+"."));

      if(paso===1){
        c.appendChild(el("label","lb","Precio ofrecido — <b id='mcPrecio'>"+plata(oferta.precio)+"</b>"));
        const sp=el("input"); sp.type="range"; sp.min=minP; sp.max=maxP; sp.step=Math.max(1,Math.round(j.precio*0.02)); sp.value=oferta.precio; sp.className="rango";
        sp.oninput=()=>{ oferta.precio=parseInt(sp.value,10); const e=document.getElementById("mcPrecio"); if(e)e.textContent=plata(oferta.precio); };
        c.appendChild(sp);
        c.appendChild(el("label","lb","Sueldo ofrecido — <b id='mcSueldo'>"+plata(oferta.sueldo)+"</b>"));
        const ss=el("input"); ss.type="range"; ss.min=minS; ss.max=maxS; ss.step=Math.max(1,Math.round(j.pidesueldo*0.03)); ss.value=oferta.sueldo; ss.className="rango";
        ss.oninput=()=>{ oferta.sueldo=parseInt(ss.value,10); const e=document.getElementById("mcSueldo"); if(e)e.textContent=plata(oferta.sueldo); };
        c.appendChild(ss);
        c.appendChild(el("label","lb","Rol prometido"));
        const fr=el("div","fichas");
        [["titular","Titular"],["promesa","Promesa"],["suplente","Suplente"]].forEach(([k,n])=>{
          const b=el("button","ficha",n); b.setAttribute("aria-pressed",oferta.rol===k?"true":"false");
          b.onclick=()=>{ oferta.rol=k; pintar(); }; fr.appendChild(b);
        });
        c.appendChild(fr);
        const cj=el("div","resul mitad"); cj.style.marginTop="8px";
        cj.innerHTML="🤝 <b>Representante:</b> comisión "+plata(comAct())+(oferta.comisionRebaja?" <span class='mini'>(rebajada)</span>":"")+
          "<br><span class='mini'>Se paga aparte del precio. Total a desembolsar: <b>"+plata(costoTotal())+"</b>.</span>";
        c.appendChild(cj);
        if(!oferta.comisionIntento){
          const brc=el("button","btn-aqua chico amarillo","Regatear comisión"); brc.style.marginBottom="6px";
          brc.onclick=regatearComision; c.appendChild(brc);
        }
        const b=el("button","btn-aqua ancho verde","Enviar oferta"); b.style.marginTop="4px";
        b.onclick=evaluar; c.appendChild(b);
      } else if(paso===2){
        c.appendChild(el("div","resul mitad","<b>Respuesta (ronda "+ronda+"):</b><br>"+contra.msg));
        if(typeof vocesMercado==="function") pintarVoces(c, vocesMercado(j,oferta,"compra"));
        if(contra.precio||contra.sueldo){
          const ba=el("button","btn-aqua ancho verde","Aceptar la contraoferta"); ba.onclick=aceptarContra; c.appendChild(ba);
          const bi=el("button","btn-aqua ancho"); bi.textContent="Insistir con mi oferta"; bi.style.marginTop="6px"; bi.onclick=insistir; c.appendChild(bi);
        } else {
          const bv=el("button","btn-aqua ancho"); bv.textContent="Volver a la mesa"; bv.onclick=()=>{ paso=1; pintar(); }; c.appendChild(bv);
        }
      } else { /* paso 3: se cayó */
        c.appendChild(el("div","resul mal","El club se levantó de la mesa: insististe demasiado y se enfriaron. Prueba con otro objetivo."));
      }
      const x=el("button","btn-aqua ancho gris",paso===3?"Cerrar":"Dejarlo pasar"); x.style.marginTop="6px"; x.onclick=cerrarModal;
      c.appendChild(x);
    };
    pintar();
  });
}

/* Mesa de venta: hablan el jugador, el representante, la prensa y la hinchada.
   El jugador puede negarse aunque el DT acepte. */
function modalVender(of,j,abierto){
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      const cuerpo=(typeof montarBarraSO==="function")
        ? montarBarraSO(box,"Oferta por "+j.n,"📥",function(){ cerrarModal(); })
        : (function(){ box.appendChild(el("div","cab",'<span class="ic">📥</span><span>Oferta por '+j.n+'</span>')); const c=el("div","cuerpo"); box.appendChild(c); return c; })();
      const q=jugadorQuiereSalir(j,of);
      cuerpo.appendChild(el("p",null,of.comprador+" ofrece <b>"+plata(of.monto)+"</b> por "+j.n+" (valor "+plata(j.valor)+", moral "+Math.round(j.moral||70)+")."));
      cuerpo.appendChild(el("p","mini",q.razon+(q.obligatorio?" · cláusula: se va sí o sí.":"")));
      pintarVoces(cuerpo, vocesMercado(j,of,"venta"));
      const nOf=()=>(E.notifs||[]).find(x=>x.acc&&x.acc.ofertaId===of.id&&!x.acc.resuelta);
      if(q.obligatorio || q.quiere){
        const b=el("button","btn-aqua ancho verde",(q.obligatorio?"Pagar / aceptar cláusula":"Aceptar: el jugador quiere irse")+" · "+plata(of.monto));
        b.onclick=()=>{ const n=nOf(); if(n) responderOferta(n,"aceptar"); cerrarModal(); render(); };
        cuerpo.appendChild(b);
      } else if(of._jugadorDijoNo){
        cuerpo.appendChild(el("div","resul mitad","Ya dijo que no. Podés convencerlo (a veces afloja) o dejarlo."));
        const cv=el("button","btn-aqua ancho verde","Convencerlo");
        cv.onclick=()=>{
          const ok=convencerSalida(j,of);
          if(ok){
            of._forzado=true;
            const n=nOf(); if(n) responderOferta(n,"aceptar");
            aviso(j.n+" aceptó irse, a regañadientes");
          } else {
            j.moral=clamp((j.moral||70)-6,0,100);
            if(typeof aplicarGrupos==="function") aplicarGrupos({camarin:-4,hinchada:esReferente(j)?-6:-2});
            notificar({t:j.n+" se plantó",tipo:"malo",
              d:"Lo apretaste y se plantó. Moral −6. El camarín lo leyó. "+of.comprador+" sigue esperando, pero el tipo no se mueve."});
            aviso(j.n+" se plantó");
          }
          cerrarModal(); render();
        };
        cuerpo.appendChild(cv);
      } else {
        const b=el("button","btn-aqua ancho","Proponerle la salida");
        b.onclick=()=>{ const n=nOf(); if(n) responderOferta(n,"aceptar"); cerrarModal(); render(); };
        cuerpo.appendChild(b);
        cuerpo.appendChild(el("p","mini","Si no quiere, la oferta no se cierra. Habla. El ídolo pesa, la moral pesa, la cláusula pesa."));
      }
      const bc=el("button","btn-aqua ancho","Pedir más plata"); bc.style.marginTop="6px";
      bc.onclick=()=>{ const n=nOf(); if(n) responderOferta(n,"contra"); cerrarModal(); render(); };
      cuerpo.appendChild(bc);
      const x=el("button","btn-aqua ancho gris","Rechazar la oferta"); x.style.marginTop="6px";
      x.onclick=()=>{ const n=nOf(); if(n) responderOferta(n,"rechazar"); cerrarModal(); render(); };
      cuerpo.appendChild(x);
    };
    pintar();
  },{clase:"ventana-so"});
}
