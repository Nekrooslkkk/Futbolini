"use strict";
/* ============================================================
   FUTBOLINI 3.0 · mercado.js
   Mercado de fichajes: ofertas entrantes por tus jugadores y
   objetivos para comprar, con negociación de 4 pilares
   (precio · sueldo · rol · interés del jugador) y ventana de
   fichajes por mes. La inflación por era queda enganchada con
   la Mejora 3 mediante inflacionEra().
   ============================================================ */

/* Multiplicador de inflación de la temporada. Si existe ERA (Mejora 3),
   lo usa; si no, vale 1 y no cambia nada. */
function inflacionEra(){
  return (typeof ERA!=="undefined" && ERA[E.anio] && ERA[E.anio].inflacion) || 1;
}
/* Mes del próximo partido (para saber si la ventana está abierta). */
function mesMercado(){ const p=proximoPartido(); return p&&p.f?p.f.m:12; }
/* Ventana de fichajes: pretemporada (ene-feb) y mitad de año (jun-jul). */
function mercadoAbierto(){ const m=mesMercado(); return m<=2||m===6||m===7; }
function proximaVentana(){ const m=mesMercado(); return m<6?"junio":(m>7?"enero":"ahora"); }

/* ---------- ofertas entrantes: otros clubes quieren TUS jugadores ---------- */
function ofertasEntrantes(){
  const rr=azarFijo(semilla("mercEnt"+E.club+E.anio+"-"+E.idx));
  const cand=E.plantel.filter(j=>!j.vendido).sort((a,b)=>b.valor-a.valor);
  const out=[];
  cand.forEach(j=>{
    const atractivo=clamp(j.valor/600+(j.proy>j.nivel+4?0.2:0)+(j.edad<24?0.15:0),0.05,0.6);
    if(rr()<atractivo){
      const comprador=CLUBES_COMPRADORES[Math.floor(rr()*CLUBES_COMPRADORES.length)];
      const monto=Math.round(j.valor*(0.8+rr()*0.7)*inflacionEra());
      out.push({jid:j.n, comprador:comprador, monto:monto});
    }
  });
  return out.slice(0,5);
}
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
/* Lista del mercado de la semana, estable hasta que cambia la fecha. */
function mercadoSemana(){
  if(!E.mercado || E.mercado.idx!==E.idx){
    E.mercado={idx:E.idx, entrantes:ofertasEntrantes(), objetivos:objetivosMercado()};
  }
  return E.mercado;
}

/* ---------- negociación de 4 pilares ---------- */
/* Interés del jugador por venir: prestigio del club + mejora salarial + rol. */
function interesJugador(j,oferta){
  let v=0;
  v += (E.ind.prestigio-50)*0.6;
  v += clamp((oferta.sueldo-j.pidesueldo)/Math.max(1,j.pidesueldo)*45,-30,30);
  v += ({titular:12, promesa:(j.edad<=22?14:0), suplente:-10}[oferta.rol]||0);
  v += (E.plata>300?4:0);
  return Math.round(v);
}
/* Postura del club vendedor: le importa el precio contra lo que pide. */
function posturaVendedor(j,oferta){ return Math.round((oferta.precio-j.precio)/Math.max(1,j.precio)*100); }
function jugadorAcepta(j,oferta){ return interesJugador(j,oferta)>=0; }
function clubAcepta(j,oferta){ return oferta.precio>=Math.round(j.precio*0.9); }

/* Cerrar la compra: descuenta plata, suma el jugador al plantel. */
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
  guardar();
  return nuevo;
}
/* Aceptar una oferta entrante: vende y cobra. */
function aceptarOfertaEntrante(of){
  const j=E.plantel.find(x=>x.n===of.jid && !x.vendido);
  if(!j) return null;
  j.vendido=true; E.plata+=of.monto;
  E.ind.plantel=clamp(E.ind.plantel-Math.round(j.nivel/14),0,100);
  aplicarGrupos({hinchada:j.rasgos&&(j.rasgos.includes("ídolo")||j.rasgos.includes("capitán"))?-10:-2, directorio:6});
  const m=mercadoSemana(); m.entrantes=m.entrantes.filter(x=>x!==of);
  guardar();
  return j;
}

/* ============================================================
   UI del mercado
   ============================================================ */
function vistaMercado(){
  const v=$("#vista");
  const abierto=mercadoAbierto();
  const cab=panel("Mercado de fichajes","🧳","agua");
  cab.cuerpo.appendChild(el("p","mini","Ventana "+(abierto?"<b>abierta</b>":"<b>cerrada</b>")+
    ". Solo se compra y se vende en pretemporada (enero-febrero) y a mitad de año (junio-julio)."+
    (abierto?"":" Próxima apertura: "+proximaVentana()+".")));
  cab.cuerpo.appendChild(fila("Caja disponible",plata(E.plata)));
  if(inflacionEra()!==1) cab.cuerpo.appendChild(fila("Inflación de la era","×"+inflacionEra().toFixed(2)));
  v.appendChild(cab);

  const merc=mercadoSemana();

  /* --- ofertas entrantes --- */
  const pe=panel("Ofertas por tus jugadores","📥");
  if(!merc.entrantes.length) pe.cuerpo.appendChild(el("p","mini","Nadie golpeó la puerta esta semana."));
  merc.entrantes.forEach(of=>{
    const j=E.plantel.find(x=>x.n===of.jid&&!x.vendido); if(!j) return;
    const b=el("button","op");
    b.innerHTML='<div class="t">'+of.comprador+' quiere a '+j.n+'</div>'+
      '<div class="d">'+j.pos+' · nivel '+j.nivel+' · ofrecen <b>'+plata(of.monto)+'</b> (valor '+plata(j.valor)+')</div>';
    b.onclick=()=>modalVender(of,j,abierto);
    pe.cuerpo.appendChild(b);
  });
  v.appendChild(pe);

  /* --- objetivos para comprar --- */
  const po=panel("Objetivos en el mercado","📤");
  if(!merc.objetivos.length) po.cuerpo.appendChild(el("p","mini","No hay nombres disponibles por ahora."));
  merc.objetivos.forEach(j=>{
    const b=el("button","op");
    b.innerHTML='<div class="t">'+j.n+' <span class="mini">('+j.club+')</span></div>'+
      '<div class="d">'+j.pos+' · '+j.edad+' años · nivel '+j.nivel+(j.proy>j.nivel+4?" · proy "+j.proy:"")+
      ' · piden <b>'+plata(j.precio)+'</b> + sueldo '+plata(j.pidesueldo)+'</div>';
    b.onclick=()=>modalComprar(j,abierto);
    po.cuerpo.appendChild(b);
  });
  v.appendChild(po);
}

function modalVender(of,j,abierto){
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">📥</span><span>Oferta por '+j.n+'</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("p",null,of.comprador+" ofrece <b>"+plata(of.monto)+"</b> por "+j.n+" ("+j.pos+", nivel "+j.nivel+", valor estimado "+plata(j.valor)+")."));
    const dif=of.monto-j.valor;
    c.appendChild(el("div","resul "+(dif>=0?"bien":"mitad"), dif>=0?
      "Pagan por sobre el valor de mercado. Es una buena venta para la caja.":
      "Ofrecen bajo el valor. Vender ahora es resignar plata."));
    if(j.rasgos&&(j.rasgos.includes("ídolo")||j.rasgos.includes("capitán")))
      c.appendChild(el("div","resul mal","Es un referente: la hinchada no va a perdonar que lo dejes ir."));
    if(!abierto) c.appendChild(el("div","resul mal","La ventana está cerrada. No podés cerrar la operación ahora."));
    const b=el("button","btn-aqua ancho verde"+(abierto?"":" gris"),"Vender por "+plata(of.monto));
    b.disabled=!abierto;
    b.onclick=()=>{ const vendido=aceptarOfertaEntrante(of); cerrarModal(); render();
      aviso(vendido?("Vendiste a "+vendido.n+" · "+plata(of.monto)):"No se pudo cerrar"); };
    c.appendChild(b);
    const x=el("button","btn-aqua ancho gris","Rechazar"); x.style.marginTop="6px"; x.onclick=cerrarModal;
    c.appendChild(x);
  });
}

function modalComprar(j,abierto){
  /* estado de la negociación */
  const oferta={ precio:j.precio, sueldo:j.pidesueldo, rol:"titular" };
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🧳</span><span>Fichar a '+j.n+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini",j.club+" · "+j.pos+" · "+j.edad+" años · nivel "+j.nivel+
        (j.proy>j.nivel+4?" · proyección "+j.proy:"")+". Piden "+plata(j.precio)+" y sueldo "+plata(j.pidesueldo)+"."));

      /* pilar 1: precio */
      c.appendChild(el("label","lb","Precio ofrecido"));
      const fp=el("div","fichas");
      [["Rebaja (−15%)",Math.round(j.precio*0.85)],["Lo que piden",j.precio],["Al alza (+10%)",Math.round(j.precio*1.10)]]
       .forEach(([n,val])=>{
        const b=el("button","ficha",n+" · "+plata(val));
        b.setAttribute("aria-pressed",oferta.precio===val?"true":"false");
        b.onclick=()=>{ oferta.precio=val; pintar(); };
        fp.appendChild(b);
      });
      c.appendChild(fp);

      /* pilar 2: sueldo */
      c.appendChild(el("label","lb","Sueldo ofrecido"));
      const fs=el("div","fichas");
      [["Ajustado",Math.round(j.pidesueldo*0.9)],["Lo pedido",j.pidesueldo],["Generoso (+25%)",Math.round(j.pidesueldo*1.25)]]
       .forEach(([n,val])=>{
        const b=el("button","ficha",n+" · "+plata(val));
        b.setAttribute("aria-pressed",oferta.sueldo===val?"true":"false");
        b.onclick=()=>{ oferta.sueldo=val; pintar(); };
        fs.appendChild(b);
      });
      c.appendChild(fs);

      /* pilar 3: rol */
      c.appendChild(el("label","lb","Rol prometido"));
      const fr=el("div","fichas");
      [["titular","Titular"],["promesa","Promesa"],["suplente","Suplente"]].forEach(([k,n])=>{
        const b=el("button","ficha",n);
        b.setAttribute("aria-pressed",oferta.rol===k?"true":"false");
        b.onclick=()=>{ oferta.rol=k; pintar(); };
        fr.appendChild(b);
      });
      c.appendChild(fr);

      /* pilar 4: interés del jugador (calculado) */
      const inter=interesJugador(j,oferta);
      const jok=jugadorAcepta(j,oferta), cok=clubAcepta(j,oferta);
      const platak=E.plata>=oferta.precio;
      c.appendChild(el("div",null,'<div class="fila" style="border:none;padding:3px 0"><span>Interés del jugador</span><b>'+
        (inter>=15?"convencido":inter>=0?"lo evalúa":"tibio")+" ("+signo(inter)+')</b></div>'+
        barrita(clamp(inter+50,0,100),inter>=0?"#4fbf3f":"#e0a92a")));
      c.appendChild(fila("Postura del club vendedor", cok?"aceptaría":"pide más plata"));
      c.appendChild(fila("Costo del fichaje", plata(oferta.precio)+(platak?"":" · no te alcanza")));

      const listo=jok&&cok&&platak&&abierto;
      const b=el("button","btn-aqua ancho verde"+(listo?"":" gris"),"Cerrar fichaje");
      b.disabled=!listo; b.style.marginTop="8px";
      b.onclick=()=>{ const nuevo=cerrarFichaje(j,oferta); cerrarModal(); render();
        aviso("Fichaste a "+nuevo.n+" ("+oferta.rol+")"); };
      c.appendChild(b);
      if(!abierto) c.appendChild(el("p","mini","La ventana está cerrada: se puede negociar, no cerrar."));
      else if(!platak) c.appendChild(el("p","mini","Necesitás "+plata(oferta.precio)+" en caja."));
      else if(!cok) c.appendChild(el("p","mini","El club vendedor no baja de "+plata(Math.round(j.precio*0.9))+"."));
      else if(!jok) c.appendChild(el("p","mini","El jugador no está convencido: subí el sueldo o mejorá el rol."));
      const x=el("button","btn-aqua ancho gris","Dejarlo pasar"); x.style.marginTop="6px"; x.onclick=cerrarModal;
      c.appendChild(x);
    };
    pintar();
  });
}
