"use strict";
/* ============================================================
   FUTBOLINI · ajustes-real.js  (7.9067)
   Pedido del autor (etapa 3, tarea 17): Ajustes ordenado.
   - Pestañas: Partida · Pantalla · Proyecto · Trucos. Los paneles que otros archivos agregan
     (nube, respaldo, offline, amistosos, editor) caen en su pestaña por el título.
   - Mis partidas con su propio scroll y buscador (la lista larga empujaba todo lo demás).
   - Pantalla: cada ajuste en su tarjeta (tema, navegación, rendimiento, idioma).
   - Modo Dios: además de los atajos, editar a mano cada número (caja, deuda, bolsillo,
     indicadores, grupos, reputación y cualquier jugador).
   - Modo dev: editor de la partida (recorre E como un árbol y edita cualquier valor).
   Cargar después de todos los que envuelven vistaAjustes (dev-editor, pulido, amistosos).
   ============================================================ */
const AJ_TABS=[
  {id:"partida", n:"💾 Partida",  re:/Mis partidas|Respaldo|sin internet|Cuenta en la nube|Solo jugar/i},
  {id:"pantalla",n:"🎨 Pantalla", re:/^Ajustes$|^Pantalla|Animaciones/i},
  {id:"proyecto",n:"💚 Proyecto", re:/El proyecto|En este momento/i},
  {id:"trucos",  n:"😇 Trucos",   re:/Modo Dios|Modo desarrollador|Editor de contenido|Editor de la partida/i}
];
function _ajTabGuardada(){ try{ return localStorage.getItem("futbolini3_ajtab")||"partida"; }catch(e){ return "partida"; } }
function _ajTabSet(t){ try{ localStorage.setItem("futbolini3_ajtab",t); }catch(e){} }
function _tituloPanel(p){
  const c=p.querySelector(":scope > .cab"); if(!c) return "";
  const s=c.querySelectorAll(":scope > span"); return (s.length?s[s.length-1].textContent:c.textContent).trim();
}
function pestanaDePanel(tit){ const t=AJ_TABS.find(x=>x.re.test(tit)); return t?t.id:"partida"; }
/* ---------- Mis partidas: lista con scroll propio y buscador ---------- */
function _ajMisPartidas(v){
  const pm=[...v.querySelectorAll(":scope > .panel")].find(p=>/Mis partidas/.test(_tituloPanel(p)));
  if(!pm||pm._aj) return; pm._aj=true;
  const cont=pm.cuerpo?pm.cuerpo.children[1]:pm.querySelector(".cuerpo > div");
  if(!cont) return;
  cont.classList.add("mp-lista");
  const q=el("input","mp-buscar"); q.type="search"; q.placeholder="Buscar partida por club o año…"; q.hidden=true;
  q.oninput=()=>{ const s=q.value.toLowerCase().trim(); cont.querySelectorAll(".fila").forEach(f=>{ f.style.display=(!s||f.textContent.toLowerCase().indexOf(s)>=0)?"":"none"; }); };
  cont.parentNode.insertBefore(q,cont);
  const revisar=()=>{ const n=cont.querySelectorAll(".fila").length; q.hidden=n<=5; const act=[...cont.querySelectorAll(".fila")].find(f=>/actual/.test(f.textContent)); if(act) act.classList.add("mp-actual"); };
  try{ new MutationObserver(revisar).observe(cont,{childList:true}); }catch(e){}
  revisar();
  /* guardar / borrar la partida actual viven con las partidas, no con el tema visual */
  [...v.querySelectorAll(":scope > .panel button")].filter(b=>/^(Guardar ahora|Borrar esta partida)$/.test(b.textContent.trim())).forEach(b=>{
    b.style.marginLeft="0"; b.style.marginRight="6px"; b.style.marginTop="8px"; pm.cuerpo.appendChild(b);
  });
}
/* ---------- Pantalla: cada ajuste en su tarjeta ---------- */
function _ajPantalla(v){
  const pa=[...v.querySelectorAll(":scope > .panel")].find(p=>_tituloPanel(p)==="Ajustes");
  if(!pa||pa._aj) return; pa._aj=true;
  const cab=pa.querySelector(":scope > .cab span:last-child"); if(cab) cab.textContent="Pantalla";
  const cu=pa.cuerpo||pa.querySelector(".cuerpo"); const nodos=[...cu.childNodes];
  const grilla=el("div","aj-grilla"); let g=null;
  const proy=[...v.querySelectorAll(":scope > .panel")].find(p=>/El proyecto/.test(_tituloPanel(p)));
  nodos.forEach(n=>{
    if(n.nodeType===1&&n.classList.contains("resul")&&/Aviso/.test(n.textContent)&&proy){ (proy.cuerpo||proy.querySelector(".cuerpo")).appendChild(n); return; }
    if(n.nodeType===1&&n.matches("label.lb")){ g=el("div","aj-grupo"); grilla.appendChild(g); }
    if(!g){ g=el("div","aj-grupo"); grilla.appendChild(g); }
    g.appendChild(n);
  });
  cu.innerHTML=""; cu.appendChild(grilla);
  const an=[...v.querySelectorAll(":scope > .panel")].find(p=>/Animaciones/.test(_tituloPanel(p)));
  if(an){ const c2=an.cuerpo||an.querySelector(".cuerpo"); const g2=el("div","aj-grupo"); g2.appendChild(el("label","lb","Animaciones")); [...c2.childNodes].forEach(n=>g2.appendChild(n)); grilla.appendChild(g2); an.remove(); }
}
/* ---------- Modo Dios: editar a mano ---------- */
function diosSet(ruta,valor){
  const partes=String(ruta).split("."); let o=E;
  for(let i=0;i<partes.length-1;i++){ if(o==null) return false; o=o[partes[i]]; }
  if(o==null) return false;
  o[partes[partes.length-1]]=valor; return true;
}
function _diosFila(etq,ruta,min,max,paso){
  const partes=ruta.split("."); let v=E; partes.forEach(p=>{ v=v==null?undefined:v[p]; });
  const d=el("div","dios-fila");
  const lb=el("span","dios-etq",escHtml(etq));
  const val=el("b","dios-val",String(Math.round((v||0)*10)/10));
  let inp;
  if(max!=null&&max-min<=200){ inp=el("input"); inp.type="range"; inp.min=min; inp.max=max; inp.step=paso||1; }
  else { inp=el("input","dios-num"); inp.type="number"; if(min!=null) inp.min=min; if(max!=null) inp.max=max; inp.step=paso||1; }
  inp.value=v||0;
  inp.oninput=()=>{ const x=parseFloat(inp.value); if(isNaN(x)) return; diosSet(ruta,x); val.textContent=String(x); };
  inp.onchange=()=>{ guardar(); if(typeof pintarBarra==="function") pintarBarra(); };
  d.appendChild(lb); d.appendChild(inp); d.appendChild(val);
  return d;
}
function panelDiosEditor(){
  const det=el("details","dios-editor"); det.open=true;
  det.appendChild(el("summary",null,"✏️ Editar a mano"));
  const sec=(t)=>{ const s=el("div","dios-sec"); s.appendChild(el("div","lb",t)); det.appendChild(s); return s; };
  const s1=sec("Plata (en millones)");
  s1.appendChild(_diosFila("Caja del club","plata",-99999,999999,1));
  s1.appendChild(_diosFila("Deuda","deuda",0,999999,1));
  if(E.personal) s1.appendChild(_diosFila("Tu bolsillo","personal.bolsillo",0,9999999,1));
  s1.appendChild(_diosFila("Capital institucional","capital",0,999,1));
  const s2=sec("Indicadores del club (0–100)");
  Object.keys(E.ind||{}).forEach(k=>s2.appendChild(_diosFila(k.charAt(0).toUpperCase()+k.slice(1),"ind."+k,0,100,1)));
  if(typeof GRUPOS!=="undefined"&&E.grupos){
    const s3=sec("Grupos de poder (−100 a 100)");
    GRUPOS.forEach(g=>{ if(E.grupos[g.id]) s3.appendChild(_diosFila(g.n||g.id,"grupos."+g.id+".aprob",-100,100,1)); });
  }
  if(typeof REPUTACION!=="undefined"&&E.rep){
    const s4=sec("Tu reputación (0–100)");
    REPUTACION.forEach(r=>s4.appendChild(_diosFila(r.n,"rep."+r.id,0,100,1)));
  }
  if(E.perfil){
    const s5=sec("Tu vida");
    s5.appendChild(_diosFila("Bienestar","perfil.bienestar",0,100,1));
    if(E.perfil.pareja) s5.appendChild(_diosFila("Relación","perfil.pareja.nivel",0,100,1));
  }
  const s6=sec("Un jugador");
  const vivos=(E.plantel||[]).filter(j=>!j.vendido);
  const sel=el("select","dios-sel");
  vivos.forEach((j,i)=>{ const o=el("option",null,escHtml(j.n+" · "+(j.pos||"")+" · "+Math.round(j.nivel||0))); o.value=i; sel.appendChild(o); });
  const zona=el("div");
  const pintarJ=()=>{
    zona.innerHTML=""; const j=vivos[+sel.value]; if(!j) return;
    const idx=E.plantel.indexOf(j);
    [["Nivel","nivel",1,99],["Edad","edad",15,45],["Forma","forma",30,99],["Cansancio","cansancio",0,30],["Lesión (fechas)","lesion",0,30]]
      .forEach(x=>zona.appendChild(_diosFila(x[0],"plantel."+idx+"."+x[1],x[2],x[3],1)));
  };
  sel.onchange=pintarJ; s6.appendChild(sel); s6.appendChild(zona); pintarJ();
  return det;
}
function _ajDios(v){
  const pg=[...v.querySelectorAll(":scope > .panel")].find(p=>/Modo Dios/.test(_tituloPanel(p)));
  if(!pg||pg._aj||!E||!E.flags||!E.flags.modoDios) return; pg._aj=true;
  const cu=pg.cuerpo||pg.querySelector(".cuerpo");
  const nodos=[...cu.childNodes], i=nodos.findIndex(n=>n.nodeType===1&&n.tagName==="BUTTON");
  if(i>=0){
    const at=el("details","dios-atajos"); at.appendChild(el("summary",null,"⚡ Atajos"));
    nodos.slice(i+1).forEach(n=>at.appendChild(n));
    cu.appendChild(panelDiosEditor()); cu.appendChild(at);
  } else cu.appendChild(panelDiosEditor());
}
/* ---------- modo dev: editor de la partida (árbol de E) ---------- */
let DEV_RUTA=[];
function devValorEn(ruta){ let o=E; for(const k of ruta){ if(o==null) return undefined; o=o[k]; } return o; }
function devSetRuta(rutaTxt,valor){
  const r=Array.isArray(rutaTxt)?rutaTxt:String(rutaTxt).split(".").filter(Boolean);
  if(!r.length) return false;
  const padre=devValorEn(r.slice(0,-1)); if(padre==null||typeof padre!=="object") return false;
  padre[r[r.length-1]]=valor; return true;
}
function panelEditorPartida(){
  const p=panel("Editor de la partida","🧬","agua");
  p.classList.add("dev-estado");
  p.cuerpo.appendChild(el("p","mini","Recorre toda la partida (el objeto <code>E</code>) y cambia cualquier valor. Se guarda al salir del campo. Para probar casos raros sin tocar código."));
  const cont=el("div"); p.cuerpo.appendChild(cont);
  const pintar=()=>{
    cont.innerHTML="";
    const migas=el("div","dev-migas");
    const raiz=el("button","btn-aqua chico","E"); raiz.onclick=()=>{ DEV_RUTA=[]; pintar(); }; migas.appendChild(raiz);
    DEV_RUTA.forEach((k,i)=>{ migas.appendChild(document.createTextNode(" › ")); const b=el("button","btn-aqua chico gris",escHtml(String(k))); b.onclick=()=>{ DEV_RUTA=DEV_RUTA.slice(0,i+1); pintar(); }; migas.appendChild(b); });
    cont.appendChild(migas);
    const obj=devValorEn(DEV_RUTA);
    if(obj==null||typeof obj!=="object"){ DEV_RUTA=[]; pintar(); return; }
    const q=el("input","dev-filtro"); q.type="search"; q.placeholder="Filtrar claves…"; cont.appendChild(q);
    const lista=el("div","dev-lista"); cont.appendChild(lista);
    const claves=Object.keys(obj);
    const pintarLista=()=>{
      lista.innerHTML="";
      const s=q.value.toLowerCase();
      claves.filter(k=>!s||k.toLowerCase().indexOf(s)>=0).slice(0,150).forEach(k=>{
        const v=obj[k], fila=el("div","dev-kv");
        fila.appendChild(el("span","dev-k",escHtml(k)));
        if(v!==null&&typeof v==="object"){
          const n=Array.isArray(v)?("["+v.length+"]"):("{"+Object.keys(v).length+"}");
          const b=el("button","btn-aqua chico",n+" abrir ›"); b.onclick=()=>{ DEV_RUTA=DEV_RUTA.concat([k]); pintar(); }; fila.appendChild(b);
        } else if(typeof v==="boolean"){
          const c=el("input"); c.type="checkbox"; c.checked=v; c.onchange=()=>{ obj[k]=c.checked; guardar(); }; fila.appendChild(c);
        } else if(typeof v==="function"){ fila.appendChild(el("span","mini","(función)")); }
        else {
          const i=el("input","dev-v"); i.type=typeof v==="number"?"number":"text"; i.value=v==null?"":v; if(typeof v==="number") i.step="any";
          i.onchange=()=>{ obj[k]=(typeof v==="number")?(parseFloat(i.value)||0):(i.value===""&&v===null?null:i.value); guardar(); if(typeof pintarBarra==="function") pintarBarra(); };
          fila.appendChild(i);
        }
        lista.appendChild(fila);
      });
      if(claves.length>150) lista.appendChild(el("p","mini","Hay "+claves.length+" claves: filtra para ver el resto."));
    };
    q.oninput=pintarLista; pintarLista();
  };
  pintar();
  return p;
}
/* ---------- el envoltorio ---------- */
(function(){
  const o=window.vistaAjustes; if(typeof o!=="function"||o._ajR) return;
  const w=function(host){
    const r=o.apply(this,arguments);
    try{
      const v=host||$("#vista"); if(!v) return r;
      if(E&&typeof devOn==="function"&&devOn()&&!v.querySelector(".dev-estado")) v.appendChild(panelEditorPartida());
      _ajMisPartidas(v); _ajPantalla(v); _ajDios(v);
      const paneles=[...v.querySelectorAll(":scope > .panel")];
      const porTab={}; paneles.forEach(p=>{ const t=pestanaDePanel(_tituloPanel(p)); p.dataset.ajtab=t; (porTab[t]=porTab[t]||[]).push(p); });
      const tabs=AJ_TABS.filter(t=>porTab[t.id]&&porTab[t.id].length);
      let act=_ajTabGuardada(); if(!tabs.some(t=>t.id===act)) act=tabs.length?tabs[0].id:"partida";
      const barra=el("div","aj-tabs"); barra.setAttribute("role","tablist");
      const mostrar=id=>{ act=id; _ajTabSet(id); paneles.forEach(p=>{ p.style.display=p.dataset.ajtab===id?"":"none"; }); barra.querySelectorAll("button").forEach(b=>b.setAttribute("aria-selected",b.dataset.t===id?"true":"false")); };
      tabs.forEach(t=>{ const b=el("button","aj-tab",t.n); b.dataset.t=t.id; b.setAttribute("role","tab"); b.onclick=()=>{ mostrar(t.id); if(v.scrollTop) v.scrollTop=0; }; barra.appendChild(b); });
      /* orden dentro de cada pestaña: como estaban, y las pestañas en su orden */
      v.insertBefore(barra,v.firstChild);
      AJ_TABS.forEach(t=>(porTab[t.id]||[]).forEach(p=>v.appendChild(p)));
      [...v.children].filter(n=>n!==barra&&!n.classList.contains("panel")).forEach(n=>v.appendChild(n));
      mostrar(act);
    }catch(e){ console.error("ajustes:",e); }
    return r;
  };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._ajR=true; window.vistaAjustes=w;
})();
if(typeof document!=="undefined"&&!document.getElementById("css-ajustes-real")){
  const st=document.createElement("style"); st.id="css-ajustes-real";
  st.textContent=
    ".aj-tabs{position:sticky;top:0;z-index:5;display:flex;gap:4px;padding:6px;margin:0 0 8px;border-radius:12px;background:rgba(255,255,255,.85);backdrop-filter:blur(6px);box-shadow:0 1px 4px rgba(0,0,0,.12);overflow-x:auto}"+
    ".aj-tab{flex:1 0 auto;border:0;border-radius:9px;padding:8px 10px;font-weight:600;font-size:13.5px;background:transparent;cursor:pointer;color:inherit;white-space:nowrap}"+
    ".aj-tab[aria-selected=true]{background:linear-gradient(#3d8fe0,#1f63b5);color:#fff}"+
    "body[data-tema=negro] .aj-tabs{background:rgba(20,24,30,.9)}"+
    "@media (max-width:460px){.aj-tab{flex:1 1 0;font-size:12px;padding:8px 4px}}"+
    ".dios-fila:has(.dios-num) .dios-val{visibility:hidden}"+
    ".mp-lista{max-height:min(46vh,360px);overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;border-radius:8px;border:1px solid rgba(0,0,0,.08);padding:0 6px}"+
    ".mp-lista .fila.mp-actual{background:rgba(79,191,63,.12);position:sticky;top:0;z-index:1}"+
    ".mp-buscar,.dev-filtro{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid rgba(0,0,0,.15);margin:4px 0 6px;font-size:14px}"+
    ".aj-grilla{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px}"+
    ".aj-grupo{background:rgba(0,0,0,.04);border-radius:10px;padding:8px 10px}.aj-grupo>.lb:first-child{margin-top:0}"+
    ".dios-editor,.dios-atajos{margin-top:8px}.dios-editor>summary,.dios-atajos>summary{cursor:pointer;font-weight:700;margin:6px 0}"+
    ".dios-sec{margin:6px 0 10px}.dios-fila{display:grid;grid-template-columns:minmax(90px,1fr) 2fr 56px;gap:8px;align-items:center;padding:3px 0}"+
    ".dios-etq{font-size:13px}.dios-val{text-align:right;font-variant-numeric:tabular-nums}.dios-num{width:100%;box-sizing:border-box;padding:5px;border-radius:6px;border:1px solid rgba(0,0,0,.15)}"+
    ".dios-sel{width:100%;padding:7px;border-radius:8px;margin-bottom:4px}"+
    ".dev-migas{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-bottom:4px}.dev-lista{max-height:50vh;overflow:auto;overscroll-behavior:contain}"+
    ".dev-kv{display:grid;grid-template-columns:minmax(90px,1fr) 1.4fr;gap:6px;align-items:center;padding:3px 0;border-bottom:1px solid rgba(0,0,0,.05)}"+
    ".dev-k{font-family:ui-monospace,monospace;font-size:12.5px;overflow:hidden;text-overflow:ellipsis}.dev-v{width:100%;box-sizing:border-box;padding:5px;border-radius:6px;border:1px solid rgba(0,0,0,.15);font-size:13px}";
  document.head.appendChild(st);
}
