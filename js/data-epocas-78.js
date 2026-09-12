"use strict";
/* ============================================================
   FUTBOLINI 7.78 · data-epocas-78.js
   Capa última de GROK_EPOCAS: secciones ocultas 1925, AFA≠ANFP,
   calendario con titular/racha/clásico, prensa al escritorio.
   Cargar AL FINAL de index.html (después de pulido.js / voz-76).
   ============================================================ */

function seccionesOcultas(){
  if(!E) return [];
  if(E.eraBase===1925 || E.anio===1925) return (typeof SECCIONES_OCULTAS_1925!=="undefined")?SECCIONES_OCULTAS_1925:["redes","mercado"];
  return [];
}
function seccionOculta(id){ return seccionesOcultas().indexOf(id)>=0; }

function federacionDe(){
  if(typeof federacionActual==="function") return federacionActual();
  if(!E) return {sigla:"ANFP", nombre:"Asociación Nacional de Fútbol Profesional"};
  if(E.eraBase==="arg2026") return (typeof FEDERACION_ARG!=="undefined")?FEDERACION_ARG:{sigla:"AFA", nombre:"Asociación del Fútbol Argentino"};
  if(E.eraBase===1925) return {sigla:"LMD", nombre:"Liga Metropolitana de Deportes"};
  return {sigla:"ANFP", nombre:"Asociación Nacional de Fútbol Profesional"};
}

/* PROMPT H · titulares de jornada (neutro + chilensis) */
const TITULARES_FECHA=[
  {ctx:"fecha_previa", registro:"neutro", txt:"Se arma la fecha {N}. {RIVAL} en el horizonte."},
  {ctx:"fecha_previa", registro:"neutro", txt:"Jornada {N}: {SEDE}. Hay que sumar."},
  {ctx:"fecha_previa", registro:"cl", txt:"El domingo es contra {RIVAL}, po. Fecha {N}."},
  {ctx:"fecha_previa", registro:"cl", txt:"Se viene {RIVAL}. Si aflojái acá, la tabla te pasa a llevar."},
  {ctx:"fecha_previa", registro:"cl", txt:"Clásico o no, hay que salir a pelearla. Fecha {N}."},
  {ctx:"fecha_post", registro:"neutro", txt:"Cerró la fecha {N}. La tabla se mueve."},
  {ctx:"fecha_post", registro:"cl", txt:"Otra fecha menos. Ahora a mirar la tabla, no el Twitter."},
  {ctx:"fecha_post", registro:"neutro", txt:"Resultados en. El próximo ya está encima."}
];

function titularDeFecha(ctx){
  const reg=(typeof idiomaActual==="function"?idiomaActual():(typeof IDIOMA!=="undefined"?IDIOMA:"neutro"));
  const pool=TITULARES_FECHA.filter(function(t){ return t.ctx===ctx && (t.registro===reg || t.registro==="neutro"); });
  const t=pool.length?(typeof elige==="function"?elige(pool):pool[0]):TITULARES_FECHA[0];
  const part=(typeof proximoPartido==="function")?proximoPartido():null;
  let s=t.txt;
  s=s.replace("{N}", part&&part.fecha?String(part.fecha):(E&&E.idx!=null?String(E.idx+1):"—"));
  s=s.replace("{RIVAL}", part&&part.rivalNombre?part.rivalNombre:"el rival");
  s=s.replace("{SEDE}", part&&part.sede?part.sede:(part&&part.local?"local":"visita"));
  return s;
}

function rachaDe(){
  if(!E||!E.calendario) return "";
  let n=0, signo=null;
  for(let i=(E.idx||0)-1;i>=0;i--){
    const p=E.calendario[i];
    if(!p||!p.jugado||p.tipo==="amistoso") continue;
    const r=p.gf>p.gc?"G":(p.gf<p.gc?"P":"E");
    if(signo==null) signo=r;
    if(r!==signo) break;
    n++;
  }
  if(!n||!signo) return "";
  if(signo==="G") return n===1?"Viene de ganar":("Racha: "+n+" triunfos");
  if(signo==="P") return n===1?"Viene de perder":("Racha: "+n+" derrotas");
  return n===1?"Viene de empatar":("Racha: "+n+" empates");
}
function historialVs(rivalId){
  if(!E||!E.calendario||!rivalId) return "";
  let g=0,e=0,p=0;
  E.calendario.forEach(function(c){
    if(!c.jugado||c.rivalId!==rivalId) return;
    if(c.gf>c.gc) g++; else if(c.gf<c.gc) p++; else e++;
  });
  if(!(g+e+p)) return "";
  return "Historial este año: "+g+"-"+e+"-"+p;
}

/* ---- menú: ocultar secciones de 1925 ---- */
(function wrapMenu78(){
  if(typeof pintarMenu==="function" && !pintarMenu._e78){
    const orig=pintarMenu;
    pintarMenu=function(){
      orig();
      const hide=seccionesOcultas();
      if(!hide.length) return;
      const m=document.getElementById("menu"); if(!m) return;
      Array.prototype.slice.call(m.querySelectorAll("button.mi")).forEach(function(b){
        const t=(b.textContent||"");
        hide.forEach(function(id){
          const mapa={redes:"Redes", mercado:"Mercado"};
          if(mapa[id] && t.indexOf(mapa[id])>=0) b.style.display="none";
        });
      });
    };
    pintarMenu._e78=true;
  }
  if(typeof pintarDock==="function" && !pintarDock._e78){
    const orig=pintarDock;
    pintarDock=function(){
      orig();
      if(!seccionOculta("mercado")) return;
      const d=document.getElementById("dock"); if(!d) return;
      Array.prototype.slice.call(d.querySelectorAll(".dock-tab")).forEach(function(b){
        if(/Mercado/.test(b.textContent||"")) b.style.display="none";
      });
    };
    pintarDock._e78=true;
  }
  if(typeof render==="function" && !render._e78){
    const orig=render;
    render=function(){
      if(typeof SEC!=="undefined" && seccionOculta(SEC)) SEC="escritorio";
      return orig();
    };
    render._e78=true;
  }
})();

/* ---- calendario: titular + racha + clásico en cada fila ---- */
(function wrapCal78(){
  if(typeof vistaCalendario!=="function" || vistaCalendario._e78) return;
  const orig=vistaCalendario;
  vistaCalendario=function(){
    orig();
    const v=document.getElementById("vista"); if(!v||!E) return;
    const cab=v.querySelector(".panel");
    if(cab&&cab.cuerpo){
      const ctx=(E.idx>0 && E.calendario[E.idx-1]&&E.calendario[E.idx-1].jugado)?"fecha_post":"fecha_previa";
      const tit=el("div","resul mitad","<b>"+titularDeFecha(ctx)+"</b>");
      const ra=rachaDe();
      if(ra) tit.innerHTML+=" <span class='mini'>· "+ra+"</span>";
      cab.cuerpo.insertBefore(tit, cab.cuerpo.firstChild);
    }
    /* enriquecer filas: clásico / historial / clima */
    const filas=v.querySelectorAll(".panel .fila");
    (E.calendario||[]).forEach(function(c,i){
      const d=filas[i]; if(!d) return;
      const extra=[];
      if(typeof esClasico==="function" && esClasico(c) && c.tipo!=="amistoso") extra.push("clásico");
      else if(typeof esRivalidadRegional==="function" && esRivalidadRegional(E.club,c.rivalId)) extra.push("rivalidad");
      const hv=historialVs(c.rivalId); if(hv) extra.push(hv);
      if(c.clima&&typeof CLIMAS==="object"&&CLIMAS[c.clima]) extra.push((CLIMAS[c.clima].ic||"")+" "+CLIMAS[c.clima].n);
      if(!c.jugado && extra.length){
        const mini=d.querySelector(".mini");
        if(mini) mini.appendChild(document.createTextNode(" · "+extra.join(" · ")));
      }
    });
  };
  vistaCalendario._e78=true;
})();

/* ---- AFA: no hablar de ANFP en Argentina ---- */
(function wrapAfa78(){
  if(typeof preguntarAyudante!=="function"||preguntarAyudante._afa78) return;
  const orig=preguntarAyudante;
  preguntarAyudante=function(q){
    let r=orig(q);
    if(E&&E.eraBase==="arg2026"&&typeof r==="string"){
      r=r.replace(/\bANFP\b/g,"AFA").replace(/Copa Chile/g,"copa local");
    }
    if(E&&E.eraBase===1925&&typeof r==="string"){
      r=r.replace(/Libertadores/g,"torneo de Santiago").replace(/ANFP/g,"Liga Metropolitana");
    }
    return r;
  };
  preguntarAyudante._afa78=true;
})();

/* ---- pulido _div74: 2006 / 1925 ---- */
(function wrapDiv78(){
  if(typeof _div74!=="function"||_div74._e78) return;
  const orig=_div74;
  _div74=function(){
    if(E&&E.eraBase===1925) return "P25";
    if(E&&E.eraBase===2006) return "P06";
    return orig();
  };
  _div74._e78=true;
})();
