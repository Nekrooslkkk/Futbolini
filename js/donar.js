"use strict";
/* ============================================================
   FUTBOLINI · donar.js
   UNA sola fuente de verdad para el botón Apoyar.
   Pegá tu link acá. El resto del juego lo lee. Nada de paywall:
   el juego sigue 100% jugable si url queda vacío.

   Cómo copiar/pegar (para vos o para Claude):
     DONAR.url   = "https://ko-fi.com/TU_USUARIO"   (o PayPal.me / Mercado Pago)
     DONAR.firma = "Vicente"                        (o "" si no querés nombre)
     DONAR.frase = "Invitale un café al juego"
   ============================================================ */

const DONAR={
  url:"",
  firma:"Vicente",
  frase:"Invitale un café al juego",
  perks:false
};

function donarTieneLink(){
  return !!(DONAR && DONAR.url && /^https?:\/\//i.test(String(DONAR.url)));
}
function donarTexto(){
  const f=(DONAR&&DONAR.frase)||"Apoyar Futbolini";
  const n=(DONAR&&DONAR.firma)?(" · "+DONAR.firma):"";
  return f+n;
}
function abrirDonar(){
  if(typeof modal!=="function"){
    if(donarTieneLink()) window.open(DONAR.url,"_blank","noopener");
    return;
  }
  const box=modal(function(caja){
    caja.innerHTML="";
    const cuerpo=(typeof montarBarraSO==="function")
      ? montarBarraSO(caja,"Apoyar Futbolini","💚",function(){ cerrarModal(); })
      : (function(){ caja.appendChild(el("div","cab",'<span class="ic">💚</span><span>Apoyar Futbolini</span>')); const c=el("div","cuerpo"); caja.appendChild(c); return c; })();
    cuerpo.appendChild(el("p",null,"Futbolini es <b>gratis y se queda gratis</b>. Corre en tu navegador, sin IA de pago. Si te gusta, un café ayuda a seguirlo."));
    cuerpo.appendChild(el("p","mini","Nada se bloquea si no donás. Ni el partido, ni las copas, ni Plop."));
    if(donarTieneLink()){
      const b=el("button","btn-aqua ancho verde","💚 "+((DONAR.frase)||"Abrir pasarela"));
      b.onclick=function(){ window.open(DONAR.url,"_blank","noopener"); };
      cuerpo.appendChild(b);
      cuerpo.appendChild(el("p","mini","Se abre en otra pestaña. El link lo pega el autor en <code>js/donar.js</code>."));
    } else {
      cuerpo.appendChild(el("div","resul mitad","Todavía <b>no hay pasarela</b> (Ko-fi / PayPal / Mercado Pago). El autor pega el link en <code>js/donar.js</code> — una sola línea. Mientras, la mejor ayuda es compartirlo."));
    }
    const x=el("button","btn-aqua ancho gris","Seguir jugando");
    x.style.marginTop="8px";
    x.onclick=function(){ cerrarModal(); };
    cuerpo.appendChild(x);
  },{clase:"ventana-so"});
  return box;
}
function botonDonar(clase){
  const b=el("button",(clase||"btn-aqua ancho verde"),"💚 "+((DONAR&&DONAR.frase)||"Apoyar Futbolini"));
  b.type="button";
  b.onclick=function(ev){ if(ev) ev.stopPropagation(); abrirDonar(); };
  return b;
}
