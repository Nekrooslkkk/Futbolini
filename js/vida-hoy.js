"use strict";
/* ============================================================
   FUTBOLINI · vida-hoy.js — 7.9111 · "Tu vida hoy" arriba de la sección Vida
   Pedido del autor: "mejora la sección vida en lo que creas poder pulir". La idea del juego es lo que el poder le
   hace a tu vida personal, pero Vida era una columna de ocho paneles donde eso no se veía de una.
   · Tarjeta de arriba: edad, bienestar, pareja, hijos, cuántas semanas aguantas sin sueldo y la sombra.
   · Debajo, lo que te está pasando dicho sin anestesia (verdadesDeTuVida): nada se inventa, sale del estado.
   · Accesos rápidos a cada panel (en el celu la sección es larga).
   ============================================================ */
function verdadesDeTuVida(){
  if(!E||!E.perfil) return [];
  const out=[], p=E.perfil, par=p.pareja, bien=p.bienestar==null?70:p.bienestar;
  const hijos=(p.hijos||[]).filter(h=>!h.fallecido);
  const menores=hijos.filter(h=>((typeof edadHijo==="function")?edadHijo(h):(E.anio-h.nacido))<18);
  const sueldo=(typeof ingresoPersonalSemanal==="function")?ingresoPersonalSemanal():0;
  const bol=(E.personal&&E.personal.bolsillo)||0;
  if(par){
    const sin=par.semanasSinCita||0, niv=par.nivel==null?65:par.nivel;
    if(niv<30) out.push({t:"Lo tuyo con "+par.n+" está en las últimas. Si sigue así, un día llegas y no hay nadie.",tono:"mal"});
    else if(sin>=3) out.push({t:"Llevas "+sin+" semanas sin una cita con "+par.n+". No te lo va a decir, pero lo anota.",tono:"mal"});
  } else if(bien<45) out.push({t:"Después de cada partido vuelves a una casa vacía.",tono:"mal"});
  if(menores.length&&par&&(par.semanasSinCita||0)>=3) out.push({t:(menores.length>1?"Tus hijos te ven":"Tu hijo te ve")+" más en la tele que en la casa.",tono:"mal"});
  if(p.crisisHijo) out.push({t:p.crisisHijo.nombre+" está mal y tú tienes partido el fin de semana.",tono:"mal"});
  if(bien<30) out.push({t:"Estás quemado: duermes mal y en el camarín se nota cómo hablas.",tono:"mal"});
  if(sueldo>0){ const sem=Math.floor(bol/sueldo);
    if(sem<3) out.push({t:"Si te echan mañana, tu plata aguanta "+(sem<=0?"ni una semana":sem+" semana"+(sem===1?"":"s"))+".",tono:"mal"});
    else if(sem>=60) out.push({t:"Tienes para vivir "+Math.floor(sem/52)+" año(s) sin trabajar. El fútbol ya no te necesita para pagar la luz.",tono:"bien"}); }
  if(typeof sombraActual==="function"){ const s=sombraActual(); if(s>=20) out.push({t:"Sombra "+s+": "+etiquetaSombra(s)+".",tono:s>=45?"mal":"neutro"}); }
  const edad=(typeof edadDT==="function")?edadDT():0;
  if(edad>=66) out.push({t:"Tienes "+edad+" años. Cada temporada puede ser la última en el banco.",tono:"neutro"});
  if(E.carrera&&E.carrera.despidos>=2) out.push({t:"Te han echado "+E.carrera.despidos+" veces. En la calle ya no preguntan cómo juegan tus equipos, preguntan cuánto vas a durar.",tono:"neutro"});
  if(!out.length) out.push({t:"Por ahora la vida aguanta. El fútbol no avisa cuando se la va a llevar.",tono:"bien"});
  return out;
}
function panelVidaHoy(){
  const pv=panel("Tu vida hoy","🧭","vida-hoy");
  const p=E.perfil, par=p.pareja, bien=Math.round(p.bienestar==null?70:p.bienestar);
  const hijos=(p.hijos||[]).filter(h=>!h.fallecido).length;
  const sueldo=(typeof ingresoPersonalSemanal==="function")?ingresoPersonalSemanal():0, bol=(E.personal&&E.personal.bolsillo)||0;
  const chips=[
    ["🎂",(typeof edadDT==="function"?edadDT():"?")+" años"],
    ["💚","bienestar "+bien],
    ["💘",par?(escHtml(par.n)+" · "+Math.round(par.nivel==null?65:par.nivel)):"sin pareja"],
    ["👶",hijos?hijos+(hijos===1?" hijo":" hijos"):"sin hijos"],
    ["💵",plata(bol)+(sueldo>0?" · "+Math.floor(bol/sueldo)+" sem. de sueldo":"")]
  ];
  if(typeof sombraActual==="function") chips.push(["🕶️","sombra "+sombraActual()]);
  pv.cuerpo.appendChild(el("div","vh-chips",chips.map(c=>'<span class="vh-chip"><span>'+c[0]+'</span>'+c[1]+'</span>').join("")));
  const ul=el("ul","vh-verdades");
  verdadesDeTuVida().forEach(v=>{ ul.appendChild(el("li","vh-"+v.tono,escHtml(v.t))); });
  pv.cuerpo.appendChild(ul);
  return pv;
}
(function(){
  const o=window.vistaVida; if(typeof o!=="function"||o._vh) return;
  const w=function(){ const r=o.apply(this,arguments);
    try{
      const v=document.getElementById("vista"), host=(v&&v.querySelector(":scope > .ventana-so.in-vista :is(.so-cuerpo,.window-body)"))||v;
      if(host&&E&&E.perfil){
        const hoy=panelVidaHoy();
        const paneles=[].slice.call(host.querySelectorAll(":scope > section.panel"));
        host.insertBefore(hoy,paneles[0]||host.firstChild);
        /* accesos rápidos: en el celu la sección es larga */
        const nav=el("nav","vh-nav"); nav.setAttribute("aria-label","Ir a");
        paneles.forEach(pn=>{ const cab=pn.querySelector(":scope > .cab"); if(!cab) return;
          const b=el("button","ficha",cab.textContent.trim()); b.type="button";
          b.onclick=()=>{ try{ pn.scrollIntoView({behavior:"smooth",block:"start"}); }catch(e){ pn.scrollIntoView(); } };
          nav.appendChild(b); });
        hoy.cuerpo.appendChild(nav);
      }
    }catch(e){ console.error("vida-hoy:",e); }
    return r; };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._vh=true; w._orig=o; window.vistaVida=w;
})();
