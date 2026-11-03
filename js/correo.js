"use strict";
/* ============================================================
   FUTBOLINI · correo.js — 7.9145 · 7.9146 Windows Mail
   Bandeja tipo Hotmail 2007, con color Aero. Se abre desde el ícono
   del escritorio (no desde la campana). La dirección queda fija en la
   partida. Los informes y el resumen de la semana llegan como correo,
   escrito en segunda persona.
   ============================================================ */
var CORREO_NOMBRES=["fabian","sebastian","camilo","matias","diego","nicolas","javier","andres","pablo","rodrigo","cristian","gonzalo","felipe","ignacio","tomas","benjamin","martin","joaquin","lucas","vicente"];
var CORREO_MAX=200;

function _correoSinTilde(s){
  return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}
function correoTld(){
  try{
    if(typeof paisDeEra==="function"){
      var p=String(paisDeEra()||"");
      if(/arg/i.test(p)) return "ar";
      if(/bra/i.test(p)) return "br";
    }
  }catch(e){}
  var era=String((E&&(E.eraBase||E.liga))||"");
  if(/arg|afa/i.test(era)) return "ar";
  return "cl";
}
function correoAbrev(){
  var id=String((E&&E.club)||"").toUpperCase();
  if(id && id.length<=4) return id;
  var n=_correoSinTilde((E&&E.clubNombre)||"Club").replace(/[^a-zA-Z ]/g," ").replace(/\s+/g," ").trim();
  var p=n.split(" ").filter(Boolean);
  if(p.length>=2) return (p[0].slice(0,3).charAt(0).toUpperCase()+p[0].slice(1,3).toLowerCase())+(p[1].charAt(0).toUpperCase()+p[1].slice(1).toLowerCase());
  return (p[0]||"Club").slice(0,8);
}
function correoAsegurar(){
  if(!E) return null;
  E.correo=E.correo||{};
  if(!E.correo.direccion){
    var nom=CORREO_NOMBRES[Math.floor(Math.random()*CORREO_NOMBRES.length)];
    var club=_correoSinTilde(E.clubNombre||"club").replace(/[^a-zA-Z]/g,"");
    var n=1+Math.floor(Math.random()*9);
    E.correo.direccion=nom+"_"+correoAbrev()+n+"@"+(club||"club").toLowerCase()+"."+correoTld();
  }
  if(!Array.isArray(E.correo.mails)) E.correo.mails=[];
  return E.correo;
}
function correoPush(m){
  var c=correoAsegurar(); if(!c||!m) return;
  c.mails.unshift({
    id:"m"+(E.anio||0)+"_"+(E.idx||0)+"_"+c.mails.length+"_"+Math.floor(Math.random()*999),
    anio:E.anio, idx:E.idx,
    de:m.de||"Ayudante del club",
    asunto:String(m.asunto||"Aviso").slice(0,90),
    cuerpo:String(m.cuerpo||"").slice(0,700),
    leido:false
  });
  if(c.mails.length>CORREO_MAX) c.mails.length=CORREO_MAX;
}
function correoSinLeer(){
  var c=E&&E.correo; if(!c||!c.mails) return 0;
  return c.mails.filter(function(m){ return m&&!m.leido&&!m.borrado; }).length;
}
function correoResumen(lineas){
  if(!E) return;
  if(E.piloto&&E.piloto.sinResumen) return;
  var cuerpo="Este es tu resumen de la semana: "+(lineas&&lineas.length?("resolviste "+lineas.length+" cosa"+(lineas.length>1?"s":"")+". "+lineas.join(" ")): "no tuviste que mover nada.");
  correoPush({de:"Syntergia", asunto:"Resumen de la semana "+(E.idx+1), cuerpo:cuerpo});
}

function _correoDecisiones(){
  var out=[];
  (E&&E.decPend||[]).forEach(function(x){
    var d=(typeof decisionPorId==="function")?decisionPorId(x.id):null;
    if(!d) return;
    out.push({x:x,d:d});
  });
  return out;
}

/* ============================================================
   7.9146 · WINDOWS MAIL (el correo de Vista), en vez del cuadro genérico de 7.9145.
   Barra de herramientas (Responder, Eliminar, Enviar y recibir, Marcar como leído, Buscar), carpetas a la izquierda
   (Bandeja de entrada, Sobre la mesa, Informes, Elementos eliminados), la lista con columnas (! · De · Asunto ·
   Recibido) y el panel de lectura abajo con su cabecera (De, Para, Fecha, Asunto). Las decisiones pendientes llegan
   como correo de quien las manda (el directorio, el capitán, el jefe de prensa…) y "Responder" abre la decisión de
   verdad. Barra de estado: cuántos mensajes y cuántos sin leer. En el celu: carpetas arriba y el mensaje a pantalla.
   ============================================================ */
var CORREO_REMITE={institucional:"Directorio del club", refuerzos:"Secretaría técnica", finanzas:"Gerencia de finanzas",
  camarin:"Capitán del plantel", preparacion:"Cuerpo técnico", hinchada:"Agrupación de hinchas", cantera:"Fútbol formativo",
  prensa:"Jefe de prensa", gris:"Remitente desconocido"};
var CORREO_CARPETAS=[["entrada","📥","Bandeja de entrada"],["mesa","📌","Sobre la mesa"],["informes","📊","Informes"],["eliminados","🗑️","Elementos eliminados"]];
function _correoFecha(m){
  try{ var c=E.calendario&&E.calendario[m.idx!=null?m.idx:E.idx]; if(c&&c.f&&typeof fechaTxt==="function") return fechaTxt(c.f)+" "+(m.anio||E.anio); }catch(e){}
  return (m.anio||E.anio)+(m.idx!=null?" · sem. "+(m.idx+1):"");
}
/* todos los mensajes de la bandeja, en un solo formato (los correos guardados + las decisiones sobre la mesa) */
function correoMensajes(){
  correoAsegurar();
  var out=[];
  _correoDecisiones().forEach(function(dec){
    var t=typeof resolverTokens==="function"?resolverTokens(dec.d.t,E):dec.d.t;
    out.push({id:"dec_"+dec.x.id, dec:dec, de:CORREO_REMITE[dec.d.buzon]||"Club", asunto:t,
      cuerpo:(typeof resolverTokens==="function"&&dec.d.d)?resolverTokens(dec.d.d,E):(dec.d.d||""), alta:dec.x.peso==="alto",
      leido:!!(E.correo.decLeidas&&E.correo.decLeidas[dec.x.id]), fecha:_correoFecha({}), carpeta:"mesa"});
  });
  (E.correo.mails||[]).forEach(function(m){
    out.push({id:m.id, m:m, de:m.de, asunto:m.asunto, cuerpo:m.cuerpo, leido:!!m.leido, fecha:_correoFecha(m),
      carpeta:m.borrado?"eliminados":(/Syntergia|Ayudante/.test(m.de||"")?"informes":"entrada")});
  });
  return out;
}
function correoEnCarpeta(lista,k){
  return lista.filter(function(x){
    if(k==="eliminados") return x.carpeta==="eliminados";
    if(x.carpeta==="eliminados") return false;
    if(k==="entrada") return true;
    return x.carpeta===k; });
}
function correoMarcar(x,leido){
  if(!x) return;
  if(x.dec){ E.correo.decLeidas=E.correo.decLeidas||{}; if(leido) E.correo.decLeidas[x.dec.x.id]=1; else delete E.correo.decLeidas[x.dec.x.id]; }
  else if(x.m) x.m.leido=leido;
  x.leido=leido;
}
function correoMontar(host){
  correoAsegurar();
  var S=(typeof VD!=="undefined"&&VD.correo)?VD.correo:{carpeta:"entrada",sel:null,q:""};
  host.innerHTML=""; host.classList.add("wm-host");
  var wm=el("div","wm"); host.appendChild(wm);
  /* barra de herramientas */
  var tb=el("div","wm-tb"); tb.setAttribute("role","toolbar");
  var bt=function(ic,txt,fn,tit){ var b=el("button","wm-tbb"); b.type="button"; b.appendChild(el("span","wm-tbi",ic)); b.appendChild(el("span","wm-tbt",escHtml(txt))); b.title=tit||txt; b.onclick=fn; tb.appendChild(b); return b; };
  var bResp=bt("↩️","Responder",function(){ var x=sel(); if(x&&x.dec&&typeof abrirDecision==="function") abrirDecision(x.dec.d,true); },"Responder: abre la decisión");
  var bBorr=bt("🗑️","Eliminar",function(){ var x=sel(); if(!x||!x.m) return; x.m.borrado=!x.m.borrado; S.sel=null; guardarYpintar(); });
  bt("🔄","Enviar y recibir",function(){ estado.textContent="Recibiendo mensajes…"; setTimeout(pintar,450); });
  bt("✔️","Marcar como leído",function(){ correoEnCarpeta(correoMensajes(),S.carpeta).forEach(function(x){ correoMarcar(x,true); }); guardarYpintar(); },"Marca todo lo de esta carpeta como leído");
  var busca=el("input","wm-busca"); busca.type="search"; busca.placeholder="Buscar"; busca.value=S.q||""; busca.setAttribute("aria-label","Buscar en el correo");
  busca.oninput=function(){ S.q=busca.value; pintarLista(); };
  tb.appendChild(busca);
  wm.appendChild(tb);
  var cuerpo=el("div","wm-lay"); wm.appendChild(cuerpo);
  var nav=el("nav","wm-carpetas"); nav.setAttribute("aria-label","Carpetas");
  var der=el("div","wm-der"), lista=el("div","wm-lista"), vista=el("div","wm-vista");
  der.appendChild(lista); der.appendChild(vista);
  cuerpo.appendChild(nav); cuerpo.appendChild(der);
  var estado=el("div","wm-estado"); wm.appendChild(estado);
  var todos=[];
  function sel(){ return todos.filter(function(x){ return x.id===S.sel; })[0]||null; }
  function guardarYpintar(){ if(typeof guardar==="function") guardar(); pintar(); vdIconosAlDia(); }
  function pintarCarpetas(){
    nav.innerHTML="";
    nav.appendChild(el("div","wm-raiz","📁 Carpetas locales"));
    CORREO_CARPETAS.forEach(function(c){
      var xs=correoEnCarpeta(todos,c[0]), nl=xs.filter(function(x){ return !x.leido; }).length;
      var b=el("button","wm-carpeta"+(S.carpeta===c[0]?" sel":"")+(nl?" con":"")); b.type="button";
      b.innerHTML="<span>"+c[1]+"</span> "+escHtml(c[2])+(nl?" <b>("+nl+")</b>":"");
      b.onclick=function(){ S.carpeta=c[0]; S.sel=null; wm.classList.remove("wm-leyendo"); pintar(); };
      nav.appendChild(b);
    });
  }
  function pintarLista(){
    lista.innerHTML="";
    var q=(S.q||"").toLowerCase().trim();
    var xs=correoEnCarpeta(todos,S.carpeta).filter(function(x){ return !q||(x.asunto+" "+x.de+" "+x.cuerpo).toLowerCase().indexOf(q)>=0; });
    var t=el("table","wm-tabla"); t.setAttribute("role","grid");
    t.innerHTML="<thead><tr><th class='wm-c-imp' title='Importancia'>!</th><th class='wm-c-ic'></th><th>De</th><th>Asunto</th><th class='wm-c-fecha'>Recibido</th></tr></thead>";
    var tb2=el("tbody");
    xs.forEach(function(x){
      var tr=el("tr","wm-fila"+(x.leido?"":" nuevo")+(x.id===S.sel?" sel":"")); tr.tabIndex=0; tr.dataset.id=x.id;
      tr.innerHTML="<td class='wm-c-imp'>"+(x.alta?"<span class='wm-imp' title='Importancia alta'>!</span>":"")+"</td>"+
        "<td class='wm-c-ic'>"+(x.dec?"📌":(x.leido?"📭":"✉️"))+"</td><td class='wm-c-de'>"+escHtml(x.de)+"</td><td class='wm-c-as'>"+escHtml(x.asunto)+"</td><td class='wm-c-fecha'>"+escHtml(x.fecha)+"</td>";
      tr.onclick=function(){ S.sel=x.id; correoMarcar(x,true); if(typeof guardar==="function") guardar(); wm.classList.add("wm-leyendo"); pintar(); vdIconosAlDia(); };
      tr.ondblclick=function(){ if(x.dec&&typeof abrirDecision==="function") abrirDecision(x.dec.d,true); };
      tr.onkeydown=function(e){ if(e.key==="Enter"){ e.preventDefault(); tr.onclick(); } };
      tb2.appendChild(tr);
    });
    t.appendChild(tb2); lista.appendChild(t);
    if(!xs.length) lista.appendChild(el("p","wm-vacio",q?"No hay mensajes que coincidan con la búsqueda.":(S.carpeta==="mesa"?"No hay nada sobre la mesa. Por ahora.":"No hay mensajes en esta carpeta.")));
  }
  function pintarVista(){
    vista.innerHTML=""; var x=sel();
    bResp.disabled=!(x&&x.dec); bBorr.disabled=!(x&&x.m);
    bBorr.querySelector(".wm-tbt").textContent=(x&&x.m&&x.m.borrado)?"Recuperar":"Eliminar";
    if(!x){ vista.appendChild(el("p","wm-vacio","Selecciona un mensaje para leerlo.")); return; }
    var volver=el("button","wm-volver","← Volver a "+escHtml((CORREO_CARPETAS.filter(function(c){ return c[0]===S.carpeta; })[0]||[,,"la bandeja"])[2]));
    volver.type="button"; volver.onclick=function(){ wm.classList.remove("wm-leyendo"); };
    vista.appendChild(volver);
    var cab=el("div","wm-cab");
    cab.innerHTML="<div class='wm-as'>"+escHtml(x.asunto)+(x.alta?" <span class='wm-imp-tag'>Importancia alta</span>":"")+"</div>"+
      "<div><b>De:</b> "+escHtml(x.de)+"</div><div><b>Fecha:</b> "+escHtml(x.fecha)+"</div><div><b>Para:</b> "+escHtml(E.correo.direccion)+"</div>";
    vista.appendChild(cab);
    var cuerpoMsg=el("div","wm-msg"); cuerpoMsg.textContent=x.cuerpo||"(sin texto)";
    vista.appendChild(cuerpoMsg);
    if(x.dec){
      vista.appendChild(el("p","wm-nota","Esto sigue sobre la mesa"+(x.alta?" y hay que resolverlo antes del próximo partido":"")+". Responder abre la decisión con sus opciones y el consejo de tu gente."));
      var r=el("button","btn-aqua verde","↩️ Responder"); r.type="button"; r.onclick=function(){ if(typeof abrirDecision==="function") abrirDecision(x.dec.d,true); };
      vista.appendChild(r);
    }
  }
  function pintar(){
    todos=correoMensajes();
    if(S.sel&&!sel()) S.sel=null;
    pintarCarpetas(); pintarLista(); pintarVista();
    var xs=correoEnCarpeta(todos,S.carpeta), nl=xs.filter(function(x){ return !x.leido; }).length;
    estado.innerHTML="<span>"+xs.length+" mensaje"+(xs.length===1?"":"s")+", "+nl+" sin leer</span><span>"+(navigator.onLine===false?"Sin conexión":"Trabajando en línea")+"</span><span class='wm-dir'>"+escHtml(E.correo.direccion)+"</span>";
  }
  pintar();
  return wm;
}
/* los globitos del ícono de Correo se ponen al día sin repintar todo el escritorio */
function vdIconosAlDia(){
  var b=document.querySelector('.vd-ico[data-vd="correo"]'); if(!b) return;
  var n=correoMensajes().filter(function(x){ return !x.leido&&x.carpeta!=="eliminados"; }).length, g=b.querySelector(".vd-glob");
  if(!n){ if(g) g.remove(); return; }
  if(!g){ g=el("span","vd-glob"); b.appendChild(g); }
  g.textContent=String(n);
}
function abrirCorreo(){
  correoAsegurar();
  if(typeof vdAbrir==="function"&&typeof SEC!=="undefined"&&SEC==="escritorio"&&document.querySelector(".vd")){ vdAbrir("correo"); return; }
  if(typeof modal!=="function") return;
  /* fuera del Escritorio: el mismo Windows Mail en un cuadro */
  modal(function(box){
    var cuerpo=montarBarraSO(box,"Correo","✉️",function(){ cerrarModal(); });
    box.classList.add("vd-correo");
    correoMontar(cuerpo);
  },{clase:"correo-modal"});
}

(function wrapCorreo(){
  if(typeof nuevaPartida==="function"&&!nuevaPartida._correo){
    var o=nuevaPartida;
    nuevaPartida=function(){ var r=o.apply(this,arguments); try{ if(E){ E.correo=null; correoAsegurar(); } }catch(e){} return r; };
    try{ Object.keys(o).forEach(function(k){ nuevaPartida[k]=o[k]; }); }catch(e){}
    nuevaPartida._correo=true;
  }
  if(typeof normalizarEstado==="function"&&!normalizarEstado._correo){
    var n=normalizarEstado;
    normalizarEstado=function(){ var r=n.apply(this,arguments); try{ correoAsegurar(); }catch(e){} return r; };
    try{ Object.keys(n).forEach(function(k){ normalizarEstado[k]=n[k]; }); }catch(e){}
    normalizarEstado._correo=true;
  }
  if(typeof ayudanteHacer==="function"&&!ayudanteHacer._correo){
    var h=ayudanteHacer;
    ayudanteHacer=function(id){
      var t=h.apply(this,arguments);
      try{
        if(t && !E._correoLote && !(E.piloto&&E.piloto.sinResumen)){
          correoPush({
            de:id==="decisiones"?"Tú":"Ayudante del club",
            asunto:id==="decisiones"?"Resolviste las decisiones":"El ayudante se encargó",
            cuerpo:id==="decisiones"?("Este es tu resumen: "+t):t
          });
        }
      }catch(e){}
      return t;
    };
    ayudanteHacer._correo=true;
  }
  if(typeof syntergiaTurno==="function"&&!syntergiaTurno._correo){
    var s=syntergiaTurno;
    syntergiaTurno=function(){
      if(E) E._correoLote=true;
      var hechas=[];
      try{ hechas=s.apply(this,arguments)||[]; }
      finally{ if(E) E._correoLote=false; }
      try{ if(hechas.length) correoResumen(hechas); }catch(e){}
      return hechas;
    };
    syntergiaTurno._correo=true;
  }
})();
