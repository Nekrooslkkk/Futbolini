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
  return (typeof ERA!=="undefined" && ERA[E.anio] && ERA[E.anio].inflacion) || 1;
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
function generarOfertasSemana(){
  if(!E.ofertasPend) E.ofertasPend=[];
  if(!E.mercadoLog) E.mercadoLog={rechazadas:{},vendidos:[]};
  caducarOfertas();
  const rr=azarFijo(semilla("oferta"+E.club+E.anio+"-"+E.idx));
  if(rr()>0.34) return null;                                   // ~1 de cada 3 semanas
  const cand=E.plantel.filter(j=>!j.vendido
    && !E.ofertasPend.some(o=>o.jid===j.n)                     // no dos ofertas por el mismo
    && (E.mercadoLog.rechazadas[j.n]==null || E.idx-E.mercadoLog.rechazadas[j.n]>=4)); // enfriamiento tras rechazo
  if(!cand.length) return null;
  const j=eligePeso(cand, x=>clamp(x.valor/300+(x.proy>x.nivel+4?0.4:0)+(x.edad<24?0.3:0),0.05,2));
  if(!j) return null;
  const comprador=CLUBES_COMPRADORES[Math.floor(rr()*CLUBES_COMPRADORES.length)];
  const monto=Math.round(j.valor*(0.8+rr()*0.8)*inflacionEra());
  const of={id:"of"+(E._ofid=(E._ofid||0)+1), jid:j.n, comprador:comprador, monto:monto, creada:E.idx};
  E.ofertasPend.push(of);
  const sobre=monto-j.valor;
  const n=notificar({
    t:comprador+" ofrece por "+j.n,
    tipo:"mercado",
    d:comprador+" pone "+plata(monto)+" sobre la mesa por "+j.n+" ("+j.pos+", nivel "+j.nivel+
      ", valor estimado "+plata(j.valor)+"). "+(sobre>=0?"Pagan por encima del valor: buena venta para la caja.":"Ofrecen por debajo del valor: venderías resignando plata.")+
      (j.rasgos&&(j.rasgos.includes("ídolo")||j.rasgos.includes("capitán"))?" Ojo: es un referente, la hinchada lo va a sentir.":"")+
      " Respondé desde Avisos o desde la sección Mercado.",
    acc:{tipo:"ofertaJugador", ofertaId:of.id, resuelta:false}
  });
  return n;
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
/* Responder una oferta entrante (desde Avisos o Mercado). */
function responderOferta(notif, aceptar){
  const of=ofertaPorId(notif.acc.ofertaId);
  if(!of){ if(notif.acc) notif.acc.resuelta=true; guardar(); return; }
  const j=E.plantel.find(x=>x.n===of.jid && !x.vendido);
  notif.acc.resuelta=true;
  E.ofertasPend=E.ofertasPend.filter(o=>o.id!==of.id);
  if(aceptar && j){
    j.vendido=true; E.plata+=of.monto;
    const ref=j.rasgos&&(j.rasgos.includes("ídolo")||j.rasgos.includes("capitán"));
    E.ind.plantel=clamp(E.ind.plantel-Math.round(j.nivel/14),0,100);
    aplicarGrupos({hinchada:ref?-12:-2, directorio:8});
    E.mercadoLog.vendidos.push({n:j.n,monto:of.monto,anio:E.anio});
    notificar({t:"Vendiste a "+j.n,tipo:"bueno",
      d:"Se cerró la salida de "+j.n+" a "+of.comprador+" por "+plata(of.monto)+". Entra la plata a la caja"+
        (ref?", pero la hinchada no perdona que se vaya un referente.":" y el plantel baja un poco de nivel.")});
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
    const ba=el("button","btn-aqua chico verde","Vender por "+plata(of.monto));
    ba.onclick=()=>{ const n=(E.notifs||[]).find(x=>x.acc&&x.acc.ofertaId===of.id); if(n){responderOferta(n,true);} render(); };
    const br=el("button","btn-aqua chico gris","Rechazar"); br.style.marginLeft="6px";
    br.onclick=()=>{ const n=(E.notifs||[]).find(x=>x.acc&&x.acc.ofertaId===of.id); if(n){responderOferta(n,false);} render(); };
    cont.appendChild(ba); cont.appendChild(br); d.appendChild(cont);
    pe.cuerpo.appendChild(d);
  });
  v.appendChild(pe);

  /* --- vender jugadores (buscar comprador) --- */
  const pv=panel("Vender jugadores","💸");
  pv.cuerpo.appendChild(el("p","mini","Salí a ofrecer a un jugador. Si hay interés, te llega una oferta para aceptar o rechazar."));
  E.plantel.filter(j=>!j.vendido).sort((a,b)=>b.valor-a.valor).slice(0,12).forEach(j=>{
    const row=el("div","fila");
    row.innerHTML='<span>'+(j.real?"● ":"")+j.n+' <span class="mini">'+j.pos+" · niv "+j.nivel+" · "+plata(j.valor)+'</span></span>';
    const b=el("button","btn-aqua chico"+(E.ofertasPend&&E.ofertasPend.some(o=>o.jid===j.n)?" gris":""),"Buscar comprador");
    b.disabled=E.ofertasPend&&E.ofertasPend.some(o=>o.jid===j.n);
    b.onclick=()=>buscarComprador(j);
    row.appendChild(b);
    pv.cuerpo.appendChild(row);
  });
  v.appendChild(pv);

  /* --- objetivos para comprar --- */
  const po=panel("Objetivos en el mercado","📤");
  if(!abierto) po.cuerpo.appendChild(el("div","resul mal","La ventana está cerrada: podés mirar y negociar, pero no cerrar compras hasta "+proximaVentana()+"."));
  const merc=mercadoSemana();
  merc.objetivos.forEach(j=>{
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

/* Modal de compra con BARRAS EDITABLES de precio y sueldo. */
function modalComprar(j,abierto){
  const oferta={ precio:j.precio, sueldo:j.pidesueldo, rol:"titular" };
  const minP=Math.max(1,Math.round(j.precio*0.5)), maxP=Math.round(j.precio*1.6);
  const minS=Math.max(1,Math.round(j.pidesueldo*0.7)), maxS=Math.round(j.pidesueldo*2);
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🧳</span><span>Fichar a '+j.n+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini",j.club+" · "+j.pos+" · "+j.edad+" años · nivel "+j.nivel+
        (j.proy>j.nivel+4?" · proyección "+j.proy:"")+". Piden "+plata(j.precio)+" y sueldo "+plata(j.pidesueldo)+"."));

      /* barra precio */
      c.appendChild(el("label","lb","Precio ofrecido — <b id='mcPrecio'>"+plata(oferta.precio)+"</b>"));
      const sp=el("input"); sp.type="range"; sp.min=minP; sp.max=maxP; sp.step=Math.max(1,Math.round(j.precio*0.02)); sp.value=oferta.precio; sp.className="rango";
      sp.oninput=()=>{ oferta.precio=parseInt(sp.value,10); readout(); };
      c.appendChild(sp);

      /* barra sueldo */
      c.appendChild(el("label","lb","Sueldo ofrecido — <b id='mcSueldo'>"+plata(oferta.sueldo)+"</b>"));
      const ss=el("input"); ss.type="range"; ss.min=minS; ss.max=maxS; ss.step=Math.max(1,Math.round(j.pidesueldo*0.03)); ss.value=oferta.sueldo; ss.className="rango";
      ss.oninput=()=>{ oferta.sueldo=parseInt(ss.value,10); readout(); };
      c.appendChild(ss);

      /* rol */
      c.appendChild(el("label","lb","Rol prometido"));
      const fr=el("div","fichas");
      [["titular","Titular"],["promesa","Promesa"],["suplente","Suplente"]].forEach(([k,n])=>{
        const b=el("button","ficha",n);
        b.setAttribute("aria-pressed",oferta.rol===k?"true":"false");
        b.onclick=()=>{ oferta.rol=k; pintar(); };
        fr.appendChild(b);
      });
      c.appendChild(fr);

      /* readout en vivo */
      const box2=el("div","resul mitad"); box2.id="mcReadout"; c.appendChild(box2);
      const b=el("button","btn-aqua ancho verde","Cerrar fichaje"); b.id="mcBtn"; b.style.marginTop="8px";
      b.onclick=()=>{ const nuevo=cerrarFichaje(j,oferta); cerrarModal(); render(); aviso("Fichaste a "+nuevo.n+" ("+oferta.rol+")"); };
      c.appendChild(b);
      const x=el("button","btn-aqua ancho gris","Dejarlo pasar"); x.style.marginTop="6px"; x.onclick=cerrarModal;
      c.appendChild(x);

      function readout(){
        const eP=document.getElementById("mcPrecio"); if(eP) eP.textContent=plata(oferta.precio);
        const eS=document.getElementById("mcSueldo"); if(eS) eS.textContent=plata(oferta.sueldo);
        const inter=interesJugador(j,oferta), jok=jugadorAcepta(j,oferta), cok=clubAcepta(j,oferta), platak=E.plata>=oferta.precio;
        const r=document.getElementById("mcReadout");
        if(r) r.innerHTML=
          "Interés del jugador: <b>"+(inter>=15?"convencido":inter>=0?"lo evalúa":"tibio")+" ("+signo(inter)+")</b><br>"+
          "Club vendedor: <b>"+(cok?"aceptaría el precio":"pide más plata (mín "+plata(Math.round(j.precio*0.9))+")")+"</b><br>"+
          "Costo: <b>"+plata(oferta.precio)+"</b>"+(platak?"":" · <b>no te alcanza</b>")+
          (!abierto?"<br><span class='mini'>Ventana cerrada: no se puede cerrar todavía.</span>":
            (!jok?"<br><span class='mini'>Subí el sueldo o mejorá el rol para convencerlo.</span>":
            (!cok?"<br><span class='mini'>Subí el precio para que el club libere al jugador.</span>":"")));
        const listo=jok&&cok&&platak&&abierto;
        const bt=document.getElementById("mcBtn"); if(bt){ bt.disabled=!listo; bt.classList.toggle("gris",!listo); }
      }
      readout();
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
    const b=el("button","btn-aqua ancho verde","Vender por "+plata(of.monto));
    b.onclick=()=>{ const n=(E.notifs||[]).find(x=>x.acc&&x.acc.ofertaId===of.id); if(n) responderOferta(n,true); cerrarModal(); render(); };
    c.appendChild(b);
    const x=el("button","btn-aqua ancho gris","Rechazar"); x.style.marginTop="6px";
    x.onclick=()=>{ const n=(E.notifs||[]).find(x=>x.acc&&x.acc.ofertaId===of.id); if(n) responderOferta(n,false); cerrarModal(); render(); };
    c.appendChild(x);
  });
}
