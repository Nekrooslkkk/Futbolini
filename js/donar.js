"use strict";
/* ============================================================
   FUTBOLINI · donar.js
   UNA sola fuente de verdad para Apoyar.
   Bitcoin: anonimato de quién da + transparencia on-chain de
   cuánto entra y a qué se destina. El juego sigue 100% gratis.

   Pegá acá (vos o Claude), nada más:
     DONAR.btc      = "bc1q...."          // dirección on-chain
     DONAR.lnurl    = ""                 // opcional Lightning
     DONAR.explorer = ""                 // si vacío: mempool.space/address/<btc>
     DONAR.libro    = [                  // lo publicás vos cuando hay movimiento
       {fecha:"2026-09", btc:"0.001", para:"hosting", nota:"Railway"}
     ]
   ============================================================ */

const DONAR={
  btc:"",
  lnurl:"",
  explorer:"",
  url:"",
  firma:"Vicente",
  frase:"Apoyar con Bitcoin",
  perks:false,
  gracias:"muchas gracias por donar, todo será destinado al juego, repartiremos cuando sea necesario",
  reparto:"Lo que entra va a bienes del juego (hosting, arte, datos). Si renta, el autor se queda el postre; si apaña más gente, sale más para todos — distribución equitativa.",
  libro:[]
};

function donarTieneBtc(){
  const a=DONAR&&DONAR.btc&&String(DONAR.btc).trim();
  return !!(a && /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{20,}$/.test(a));
}
function donarTieneLink(){
  return !!(DONAR && DONAR.url && /^https?:\/\//i.test(String(DONAR.url)));
}
function donarExplorer(){
  if(DONAR&&DONAR.explorer&&/^https?:\/\//i.test(DONAR.explorer)) return DONAR.explorer;
  if(donarTieneBtc()) return "https://mempool.space/address/"+String(DONAR.btc).trim();
  return "";
}
function donarTexto(){
  const f=(DONAR&&DONAR.frase)||"Apoyar Futbolini";
  const n=(DONAR&&DONAR.firma)?(" · "+DONAR.firma):"";
  return f+n;
}
function copiarTexto(txt, okMsg){
  const t=String(txt||"");
  if(!t) return;
  const done=function(){ if(typeof aviso==="function") aviso(okMsg||"Copiado"); };
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).then(done).catch(function(){ copiarFallback(t, done); });
  } else copiarFallback(t, done);
}
function copiarFallback(t, done){
  try{
    const ta=document.createElement("textarea"); ta.value=t; document.body.appendChild(ta);
    ta.select(); document.execCommand("copy"); ta.remove(); if(done) done();
  }catch(e){ if(typeof aviso==="function") aviso("No se pudo copiar"); }
}
function abrirDonar(){
  if(typeof modal!=="function"){
    if(donarTieneBtc()) copiarTexto(DONAR.btc, DONAR.gracias);
    else if(donarTieneLink()) window.open(DONAR.url,"_blank","noopener");
    return;
  }
  const box=modal(function(caja){
    caja.innerHTML="";
    const cuerpo=(typeof montarBarraSO==="function")
      ? montarBarraSO(caja,"Apoyar Futbolini","₿",function(){ cerrarModal(); })
      : (function(){ caja.appendChild(el("div","cab",'<span class="ic">₿</span><span>Apoyar Futbolini</span>')); const c=el("div","cuerpo"); caja.appendChild(c); return c; })();
    cuerpo.appendChild(el("p",null,"Futbolini es <b>gratis y se queda gratis</b>. Nada se bloquea si no donás."));
    cuerpo.appendChild(el("p","mini","Bitcoin: nadie tiene que saber quién sos. La chain sí muestra cuánto entra y a qué se destina — anonimato de la persona, transparencia de la plata."));
    cuerpo.appendChild(el("p","mini",(DONAR.reparto||"")));
    cuerpo.appendChild(el("div","resul bien","<b>Si donás:</b> "+(DONAR.gracias||"")));

    if(donarTieneBtc()){
      const dir=el("div","resul mitad");
      dir.innerHTML="<div class='mini'>Dirección on-chain</div><code class='donar-dir'>"+DONAR.btc+"</code>";
      cuerpo.appendChild(dir);
      const bc=el("button","btn-aqua ancho verde","₿ Copiar dirección");
      bc.onclick=function(){ copiarTexto(DONAR.btc, DONAR.gracias); };
      cuerpo.appendChild(bc);
      const ex=donarExplorer();
      if(ex){
        const bx=el("button","btn-aqua ancho","🔎 Ver en la chain");
        bx.style.marginTop="6px";
        bx.onclick=function(){ window.open(ex,"_blank","noopener"); };
        cuerpo.appendChild(bx);
      }
    } else {
      cuerpo.appendChild(el("div","resul mitad","Todavía <b>no hay dirección Bitcoin</b> publicada. El autor la pega en <code>DONAR.btc</code> (un solo renglón). Mientras, la mejor ayuda es compartirlo."));
    }
    if(DONAR.lnurl){
      const bl=el("button","btn-aqua chico","⚡ Lightning"); bl.style.marginTop="6px";
      bl.onclick=function(){ copiarTexto(DONAR.lnurl, "Invoice Lightning copiada"); };
      cuerpo.appendChild(bl);
    }
    if(donarTieneLink()){
      const b=el("button","btn-aqua chico","Abrir link extra"); b.style.marginTop="6px";
      b.onclick=function(){ window.open(DONAR.url,"_blank","noopener"); };
      cuerpo.appendChild(b);
    }

    cuerpo.appendChild(el("h3","sub","Libro de aportes"));
    const libro=(DONAR.libro||[]).slice();
    if(!libro.length){
      cuerpo.appendChild(el("p","mini","Todavía no hay movimientos publicados. Cuando entre un aporte, se anota acá (fecha, monto, para qué). La chain es la fuente; este libro es el criollo."));
    } else {
      libro.forEach(function(m){
        cuerpo.appendChild(el("div","fila","<span>"+(m.fecha||"—")+" · "+(m.para||"juego")+"</span><b>"+(m.btc||"—")+" BTC</b>"));
        if(m.nota) cuerpo.appendChild(el("p","mini",m.nota));
      });
    }

    const x=el("button","btn-aqua ancho gris","Seguir jugando");
    x.style.marginTop="8px";
    x.onclick=function(){ cerrarModal(); };
    cuerpo.appendChild(x);
  },{clase:"ventana-so"});
  return box;
}
function botonDonar(clase){
  const b=el("button",(clase||"btn-aqua ancho verde"),"₿ "+((DONAR&&DONAR.frase)||"Apoyar Futbolini"));
  b.type="button";
  b.onclick=function(ev){ if(ev) ev.stopPropagation(); abrirDonar(); };
  return b;
}
