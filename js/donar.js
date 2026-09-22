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
       {fecha:"2026-09", btc:"0.001", para:"hosting", alias:"El Pibe", nota:"Railway"}
       // alias es OPCIONAL. Si no va, el libro dice «anónimo».
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
function donarAlias(m){
  const a=m&&m.alias&&String(m.alias).trim();
  if(!a) return "anónimo";
  return (typeof textoLimpio==="function")?textoLimpio(a,40):a.replace(/<[^>]*>/g,"").slice(0,40);
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
    cuerpo.appendChild(el("p",null,"Futbolini es <b>gratis y se queda gratis</b>. Nada se bloquea si no donas."));
    cuerpo.appendChild(el("p","mini","Bitcoin: nadie tiene que saber quién eres. La chain sí muestra cuánto entra y a qué se destina — anonimato de la persona, transparencia de la plata."));
    cuerpo.appendChild(el("p","mini",(DONAR.reparto||"")));
    cuerpo.appendChild(el("div","resul bien","<b>Si donas:</b> "+(DONAR.gracias||"")));

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
      cuerpo.appendChild(el("div","resul mitad","Todavía <b>no hay dirección Bitcoin</b> publicada. El autor la pega en <code>DONAR.btc</code> (un solo renglón). Mientras, la mejor ayuda es compartirlo o ver un aviso acá abajo."));
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

    cuerpo.appendChild(el("p","mini", typeof T==="function"?T("don_aviso_aj","El aviso gratis (hueco de anuncio) está en Ajustes · ⚙️. Nadie te obliga."):"El aviso gratis está en Ajustes. Nadie te obliga."));

    cuerpo.appendChild(el("h3","sub","Libro de aportes"));
    const libro=(DONAR.libro||[]).slice();
    if(!libro.length){
      cuerpo.appendChild(el("p","mini","Todavía no hay movimientos publicados. Cuando entre un aporte, se anota acá (fecha, monto, para qué, alias si la persona quiere). La chain es la fuente; este libro es el criollo. El alias es opcional: si no va, figura anónimo."));
    } else {
      libro.forEach(function(m){
        const quien=(typeof donarAlias==="function")?donarAlias(m):((m.alias&&String(m.alias).trim())||"anónimo");
        const fila=el("div","fila");
        const sp=el("span"); sp.textContent=(m.fecha||"—")+" · "+quien+" · "+(m.para||"juego");
        const bt=el("b"); bt.textContent=(m.btc||"—")+" BTC";
        fila.appendChild(sp); fila.appendChild(bt);
        cuerpo.appendChild(fila);
        if(m.nota){ const pn=el("p","mini"); pn.textContent=String(m.nota); cuerpo.appendChild(pn); }
      });
    }

    const x=el("button","btn-aqua ancho gris","Seguir jugando");
    x.style.marginTop="8px";
    x.onclick=function(){ cerrarModal(); };
    cuerpo.appendChild(x);
  },{clase:"ventana-so"});
  return box;
}
/* 7.9014 · hueco de anuncio: la gente aprieta, un día sale uno de verdad.
   Hoy es una pausa de 6 s. Vive en Ajustes. BTC sigue hueco. */
function donarAvisosVistos(){
  return (typeof E!=="undefined" && E && E.flags && E.flags.avisosVistos) || 0;
}
function donarVerAviso(cuerpo, btn){
  if(btn) btn.disabled=true;
  const wrap=el("div","resul bien");
  wrap.appendChild(el("b",null, typeof T==="function"?T("don_aviso_tit","Seis segundos de tu tiempo"):"Seis segundos de tu tiempo"));
  wrap.appendChild(el("p","mini", typeof T==="function"?T("don_aviso_txt","Un día acá puede salir un anuncio. Hoy es una pausa de 6 segundos: el autor no cobra y el juego no se bloquea. Nadie te obliga a apretar."):"Pausa de apoyo. El juego sigue gratis."));
  const wait=el("p","mini", typeof T==="function"?T("don_aviso_wait","Espera un momento…"):"Espera un momento…");
  wrap.appendChild(wait);
  const bar=el("div"); bar.style.height="8px"; bar.style.marginTop="8px"; bar.style.background="rgba(0,0,0,.12)"; bar.style.borderRadius="4px"; bar.style.overflow="hidden";
  const fill=el("div"); fill.style.height="100%"; fill.style.width="0%"; fill.style.background="#3dbb6a"; fill.style.transition="width 6s linear";
  bar.appendChild(fill); wrap.appendChild(bar);
  if(cuerpo) cuerpo.appendChild(wrap);
  requestAnimationFrame(function(){ fill.style.width="100%"; });
  setTimeout(function(){
    if(typeof E!=="undefined" && E){
      if(!E.flags) E.flags={};
      E.flags.avisosVistos=(E.flags.avisosVistos||0)+1;
      if(typeof guardar==="function") guardar();
    }
    wait.textContent=typeof T==="function"?T("don_aviso_ok","Listo. Gracias por el tiempo."):"Listo. Gracias por el tiempo.";
    if(typeof aviso==="function") aviso("💚 "+(typeof T==="function"?T("don_aviso_ok","Listo. Gracias por el tiempo."):"Gracias"));
    if(btn) btn.disabled=false;
  }, 6000);
}
function botonDonar(clase){
  const b=el("button",(clase||"btn-aqua ancho verde"),"₿ "+((DONAR&&DONAR.frase)||"Apoyar Futbolini"));
  b.type="button";
  b.onclick=function(ev){ if(ev) ev.stopPropagation(); abrirDonar(); };
  return b;
}
