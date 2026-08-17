"use strict";
/* ============================================================
   FUTBOLINI 3.0 · mercado.js
   Mercado de fichajes:
   · Ofertas entrantes por tus jugadores → llegan como notificación
     accionable y NO vuelven si las rechazás.
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
   respondés o caducan. Si rechazaste, ese jugador queda "enfriado". */
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
  const of={id:"of"+(E._ofid=(E._ofid||0)+1), jid:j.n, comprador:comprador, monto:monto, creada:E.idx};
  E.ofertasPend.push(of);
  const sobre=monto-j.valor;
  notificar({
    t:comprador+" ofrece por "+j.n, tipo:"mercado",
    d:comprador+" pone "+plata(monto)+" sobre la mesa por "+j.n+" ("+j.pos+", nivel "+j.nivel+
      ", valor estimado "+plata(j.valor)+"). "+(sobre>=0?"Pagan por encima del valor: buena venta para la caja.":"Ofrecen por debajo del valor: venderías resignando plata.")+
      (j.rasgos&&(j.rasgos.includes("ídolo")||j.rasgos.includes("capitán"))?" Ojo: es un referente, la hinchada lo va a sentir.":"")+
      " Respondé desde Avisos o desde la sección Mercado.",
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
    d:j.n+" ("+j.edad+" años, nivel "+j.nivel+") se va cedido a "+club+" por una temporada para foguearse. No lo tenés disponible este año, pero vuelve mejor y el club que lo recibe le paga el sueldo."});
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
          ". La oferta sigue abierta: podés aceptar o rechazar desde Avisos.",
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
    j.vendido=true; E.plata+=of.monto;
    const ref=j.rasgos&&(j.rasgos.includes("ídolo")||j.rasgos.includes("capitán"));
    E.ind.plantel=clamp(E.ind.plantel-Math.round(j.nivel/14),0,100);
    aplicarGrupos({hinchada:ref?-12:-2, directorio:8});
    E.mercadoLog.vendidos.push({n:j.n,monto:of.monto,anio:E.anio});
    let txt;
    if(ref){
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
    notificar({t:"Rechazaste la oferta por "+of.jid,tipo:"neutro",
      d:"Le dijiste que no a "+of.comprador+". "+of.jid+" sigue en el plantel. Ese club no va a volver a preguntar por un tiempo."});
  }
  guardar();
}
/* Salir a buscar comprador por un jugador que VOS querés vender. */
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
    d:"Tras ofrecerlo, "+comprador+" responde con "+plata(monto)+" por "+j.n+" (valor "+plata(j.valor)+"). Aceptás o rechazás desde acá.",
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

function cerrarFichaje(j,oferta){
  E.plata-=oferta.precio;
  const nuevo=Object.assign({}, j, {
    sueldo:oferta.sueldo, rol:oferta.rol, real:false, forma:66, moral:70,
    contrato:{hasta:E.anio+2+(oferta.rol==="promesa"?2:0)}, lesion:0, goles:0, partidos:0, tarjetas:0
  });
  delete nuevo.precio; delete nuevo.pidesueldo; delete nuevo.club;
  E.plantel.push(nuevo);
  E.ind.plantel=clamp(Math.round(mediaPlantel()),0,100);
  const m=mercadoSemana(); m.objetivos=m.objetivos.filter(x=>x!==j);
  notificar({t:"Fichaste a "+nuevo.n,tipo:"bueno",
    d:"Se incorpora "+nuevo.n+" ("+nuevo.pos+", nivel "+nuevo.nivel+") como "+oferta.rol+". Costó "+plata(oferta.precio)+
      " y gana "+plata(oferta.sueldo)+" al año. El nivel del plantel se recalcula."});
  if(typeof redesReaccion==="function") redesReaccion("ficha",{n:nuevo.n});
  guardar();
  return nuevo;
}

/* ============================================================
   UI del mercado
   ============================================================ */
function vistaMercado(){
  const v=$("#vista");
  const abierto=mercadoAbierto();
  const cab=panel("Mercado de fichajes","🧳","agua");
  cab.cuerpo.appendChild(el("p","mini","Ventana "+(abierto?"<b>abierta</b>":"<b>cerrada</b>")+
    ". Comprás solo en pretemporada (enero-febrero) y a mitad de año (junio-julio)."+
    (abierto?"":" Próxima apertura: "+proximaVentana()+". Las ofertas por tus jugadores igual las podés responder.")));
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
    const ba=el("button","btn-aqua chico verde","Vender por "+plata(of.monto));
    ba.onclick=()=>{ const n=nOf(); if(n) responderOferta(n,"aceptar"); render(); };
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
  pc.cuerpo.appendChild(el("p","mini","Mandá juveniles (≤23) a foguearse una temporada. Vuelven con más nivel; mientras tanto no los tenés y el otro club les paga el sueldo."));
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
  } else if(!cedidos.length){ pc.cuerpo.appendChild(el("p","mini","No tenés juveniles para ceder ahora mismo.")); }
  v.appendChild(pc);

  /* --- objetivos para comprar (con filtros) --- */
  const po=panel("Objetivos en el mercado","📤");
  if(!abierto) po.cuerpo.appendChild(el("div","resul mal","La ventana está cerrada: podés mirar y negociar, pero no cerrar compras hasta "+proximaVentana()+"."));
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
    const b=el("button","btn-aqua chico verde","Negociar / Comprar"); b.style.marginTop="6px";
    b.onclick=()=>modalComprar(j,abierto);
    d.appendChild(b);
    po.cuerpo.appendChild(d);
  });
  v.appendChild(po);
}
var MERC_FILTRO={pos:"",joven:false,barato:false};

/* Negociación de compra en 2-3 pasos: tu oferta → contraoferta → cierre.
   Insistir cuesta (suben lo que piden); a las 3 rondas se levantan de la mesa. */
function modalComprar(j,abierto){
  const oferta={ precio:j.precio, sueldo:j.pidesueldo, rol:"titular" };
  const minP=Math.max(1,Math.round(j.precio*0.5)), maxP=Math.round(j.precio*1.7);
  const minS=Math.max(1,Math.round(j.pidesueldo*0.7)), maxS=Math.round(j.pidesueldo*2);
  let paso=1, contra=null, ronda=0, exigePrecio=Math.round(j.precio*0.9);
  modal(box=>{
    const cerrar=()=>{ const nuevo=cerrarFichaje(j,oferta); cerrarModal(); render(); aviso("Fichaste a "+nuevo.n+" ("+oferta.rol+")"); };
    /* evalúa la oferta actual: aceptan, o arman contraoferta */
    const evaluar=()=>{
      ronda++;
      const cok=oferta.precio>=exigePrecio, jok=jugadorAcepta(j,oferta);
      if(cok&&jok){
        if(!abierto){ contra={cerrado:false,msg:"El acuerdo está, pero la ventana está cerrada: no se puede firmar hasta "+proximaVentana()+"."}; paso=2; pintar(); return; }
        if(E.plata<oferta.precio){ contra={cerrado:false,msg:"Se pusieron de acuerdo, pero no te alcanza la caja ("+plata(oferta.precio)+")."}; paso=2; pintar(); return; }
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
        if(!abierto||E.plata<oferta.precio){ evaluar(); return; }
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
      if(!abierto){ contra.msg="Trato cerrado en la palabra, pero la ventana está cerrada: firmás en "+proximaVentana()+"."; pintar(); return; }
      if(E.plata<oferta.precio){ contra.msg="Aceptaste, pero no te alcanza la caja para "+plata(oferta.precio)+"."; pintar(); return; }
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
        const b=el("button","btn-aqua ancho verde","Enviar oferta"); b.style.marginTop="8px";
        b.onclick=evaluar; c.appendChild(b);
      } else if(paso===2){
        c.appendChild(el("div","resul mitad","<b>Respuesta (ronda "+ronda+"):</b><br>"+contra.msg));
        if(contra.precio||contra.sueldo){
          const ba=el("button","btn-aqua ancho verde","Aceptar la contraoferta"); ba.onclick=aceptarContra; c.appendChild(ba);
          const bi=el("button","btn-aqua ancho"); bi.textContent="Insistir con mi oferta"; bi.style.marginTop="6px"; bi.onclick=insistir; c.appendChild(bi);
        } else {
          const bv=el("button","btn-aqua ancho"); bv.textContent="Volver a la mesa"; bv.onclick=()=>{ paso=1; pintar(); }; c.appendChild(bv);
        }
      } else { /* paso 3: se cayó */
        c.appendChild(el("div","resul mal","El club se levantó de la mesa: insististe demasiado y se enfriaron. Probá con otro objetivo."));
      }
      const x=el("button","btn-aqua ancho gris",paso===3?"Cerrar":"Dejarlo pasar"); x.style.marginTop="6px"; x.onclick=cerrarModal;
      c.appendChild(x);
    };
    pintar();
  });
}

/* Modal de venta directa (cuando abrís una oferta puntual). */
function modalVender(of,j,abierto){
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">📥</span><span>Oferta por '+j.n+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p",null,of.comprador+" ofrece <b>"+plata(of.monto)+"</b> por "+j.n+"."));
    const nOf=()=>(E.notifs||[]).find(x=>x.acc&&x.acc.ofertaId===of.id&&!x.acc.resuelta);
    const b=el("button","btn-aqua ancho verde","Vender por "+plata(of.monto));
    b.onclick=()=>{ const n=nOf(); if(n) responderOferta(n,"aceptar"); cerrarModal(); render(); };
    c.appendChild(b);
    const bc=el("button","btn-aqua ancho","Pedir más plata"); bc.style.marginTop="6px";
    bc.onclick=()=>{ const n=nOf(); if(n) responderOferta(n,"contra"); cerrarModal(); render(); };
    c.appendChild(bc);
    const x=el("button","btn-aqua ancho gris","Rechazar"); x.style.marginTop="6px";
    x.onclick=()=>{ const n=nOf(); if(n) responderOferta(n,"rechazar"); cerrarModal(); render(); };
    c.appendChild(x);
  });
}
