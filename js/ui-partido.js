"use strict";
/* ============================================================
   FUTBOLINI 3.0 · ui-partido.js
   Pantallas de previa, partido en vivo y resumen.
   ============================================================ */
let P_ACTUAL=null, TIMER=null, PAUSADO=false, MOMENTO_OPS=[], VEL_PARTIDO=260;
/* Atajos durante el partido: Espacio = pausa/reanuda · 1/2/3 = decidir */
function partidoTeclas(e){
  if(!P_ACTUAL||P_ACTUAL.terminado) return;
  if(e.code==="Space"||e.key===" "){
    if(P_ACTUAL.modo!=="simular"){ e.preventDefault(); PAUSADO=!PAUSADO; if(!MOMENTO_OPS.length) pintarPartido(); aviso(PAUSADO?"⏸ Pausa":"▶ Sigue"); }
    return;
  }
  if(MOMENTO_OPS.length){
    const n=parseInt(e.key,10);
    if(n>=1&&n<=MOMENTO_OPS.length){ e.preventDefault(); const b=MOMENTO_OPS[n-1]; MOMENTO_OPS=[]; if(b) b.click(); }
  }
}
document.addEventListener("keydown",partidoTeclas);

function pantallaPrevia(part){
  const v=$("#vista"); v.innerHTML=""; v.dataset.sec="partido";
  const cab=panel(part.tipo==="copa"?("Copa Libertadores · "+part.ronda):("Campeonato Nacional · fecha "+part.fecha),
    part.tipo==="copa"?"🏆":"⚽", part.tipo==="copa"?"agua":"");
  cab.cuerpo.appendChild(el("h2","tit",(part.local?E.clubNombre+" vs "+part.rivalNombre:part.rivalNombre+" vs "+E.clubNombre)));
  cab.cuerpo.appendChild(el("p","mini",(part.local?"De local":"De visita")+" en "+part.sede+" · "+fechaTxt(part.f)+" de "+E.anio+
    (part.apodo?" · "+part.apodo:"")));
  v.appendChild(cab);

  const rej=el("div","rejilla dos");
  /* --- plan --- */
  const p1=panel("Plan de partido","📋");
  [["form","Formación",Object.keys(FORMACIONES)],["mentalidad","Mentalidad",Object.keys(MENTALIDADES)],
   ["estilo","Estilo",Object.keys(ESTILOS)],["presion","Presión",Object.keys(PRESIONES)]]
   .forEach(([k,lab,ops])=>{
    p1.cuerpo.appendChild(el("label","lb",lab));
    const f=el("div","fichas");
    ops.forEach(o=>{
      const b=el("button","ficha",o);
      b.setAttribute("aria-pressed",E.tactica[k]===o?"true":"false");
      b.onclick=()=>{ E.tactica[k]=o; guardar(); pantallaPrevia(part); };
      f.appendChild(b);
    });
    p1.cuerpo.appendChild(f);
  });
  const once=onceIdeal();
  p1.cuerpo.appendChild(el("h3","sub","Once titular"));
  const t=el("table");
  t.innerHTML="<thead><tr><th>Jugador</th><th>Pos</th><th class='n'>Nivel</th><th class='n'>Forma</th></tr></thead>";
  const tb=el("tbody");
  once.forEach(j=>tb.appendChild(el("tr",null,"<td>"+j.n+(j.real?" ●":"")+"</td><td>"+j.pos+"</td><td class='n'>"+j.nivel+"</td><td class='n'>"+Math.round(j.forma)+"</td>")));
  t.appendChild(tb); p1.cuerpo.appendChild(t);
  const les=E.plantel.filter(j=>j.lesion>0&&!j.vendido);
  if(les.length) p1.cuerpo.appendChild(el("p","mini","No disponibles: "+les.map(j=>j.n).join(", ")));
  /* 6.7 · designados de balón parado (penal / tiro libre / córner) */
  p1.cuerpo.appendChild(el("h3","sub","Balón parado"));
  [["penalista","🎯 Penales"],["tiroLibre","🎯 Tiros libres"],["corner","🚩 Córners"]].forEach(([k,lab])=>{
    const row=el("div"); row.style.margin="4px 0";
    row.appendChild(el("label","lb",lab));
    const sel=document.createElement("select"); sel.className="entrada"; sel.style.width="100%";
    const auto=document.createElement("option"); auto.value=""; auto.textContent="Automático (el mejor disponible)"; sel.appendChild(auto);
    once.filter(j=>j.pos!=="ARQ").forEach(j=>{ const o=document.createElement("option"); o.value=j.n; o.textContent=j.n+" ("+j.pos+", niv "+j.nivel+")"; if(E.tactica[k]===j.n) o.selected=true; sel.appendChild(o); });
    sel.onchange=()=>{ E.tactica[k]=sel.value||null; guardar(); };
    row.appendChild(sel);
    p1.cuerpo.appendChild(row);
  });
  /* 6.13 · roles/duties por jugador (estilo FM), colapsable, con update local */
  const detRol=el("details"); detRol.className="rival-prev";
  detRol.appendChild(el("summary","","🎭 Roles de los jugadores · Defensivo / Equilibrado / Ofensivo"));
  const balance=el("p","mini");
  const refrescarBalance=()=>{
    const cnt={def:0,eq:0,ofe:0};
    once.filter(j=>j.pos!=="ARQ").forEach(j=>{ cnt[(E.tactica.roles&&E.tactica.roles[j.n])||"eq"]++; });
    balance.innerHTML="<b>Balance:</b> "+cnt.ofe+" ofensivos · "+cnt.eq+" equilibrados · "+cnt.def+" defensivos. "+
      (cnt.ofe>=6?"Muy volcado al ataque: vas a generar, pero quedás abierto atrás.":
       cnt.def>=6?"Muy replegado: seguro atrás, pero te va a costar crear.":"Reparto sano.");
  };
  once.filter(j=>j.pos!=="ARQ").forEach(j=>{
    const row=el("div","rol-row");
    row.appendChild(el("span","rol-n",j.n));
    const bg=el("div","rol-btns");
    [["def","DEF","Defensivo: cuida atrás"],["eq","EQ","Equilibrado"],["ofe","OFE","Ofensivo: pisa el área"]].forEach(([k,lab,ti])=>{
      const cur=(E.tactica.roles&&E.tactica.roles[j.n])||"eq";
      const b=el("button","rol-b"+(cur===k?" on":""),lab); b.title=ti;
      b.onclick=(e)=>{ e.preventDefault(); E.tactica.roles=E.tactica.roles||{}; E.tactica.roles[j.n]=k; guardar();
        [].forEach.call(bg.children,c=>c.classList.remove("on")); b.classList.add("on"); refrescarBalance(); };
      bg.appendChild(b);
    });
    row.appendChild(bg);
    detRol.appendChild(row);
  });
  refrescarBalance();
  detRol.appendChild(balance);
  p1.cuerpo.appendChild(detRol);
  const manualOn=E.tactica.xiManual&&E.tactica.xiManual.length;
  const bali=el("button","btn-aqua ancho"+(manualOn?" verde":""),
    "👥 Alinear el equipo · "+(manualOn?"manual":"automático"));
  bali.onclick=()=>modalAlineacion(part);
  p1.cuerpo.appendChild(bali);
  const bpiz=el("button","btn-aqua ancho"+(E.tactica.pizarra&&E.tactica.pizarra.length?" verde":""),
    "🎯 Pizarra libre"+(E.tactica.pizarra&&E.tactica.pizarra.length?" · activa":""));
  bpiz.style.marginTop="6px";
  bpiz.onclick=()=>modalPizarra(part);
  p1.cuerpo.appendChild(bpiz);
  rej.appendChild(p1);

  /* --- lectura previa --- */
  const p2=panel("Antes de salir","🔍","agua");
  const fz=fuerzaEquipo(once);
  const lectura=fz.base>part.fuerzaRival+6?"Sobre el papel somos mejores, pero eso no se cobra en la cancha.":
    (fz.base>part.fuerzaRival-4?"Está parejo. Lo va a definir un detalle.":"El rival es superior. Hay que jugar perfecto.");
  p2.cuerpo.appendChild(el("p",null,"<b>"+E.dt+":</b> "+lectura));
  const cl=(typeof CLIMAS!=="undefined"&&CLIMAS[part.clima])||null;
  if(cl) p2.cuerpo.appendChild(el("p","mini",cl.ic+" Clima: "+cl.n+". "+cl.d));
  if(part.local) p2.cuerpo.appendChild(el("p","mini","Se espera buena taquilla: la gente está "+(E.ind.hinchada>65?"encendida":"tibia")+"."));
  if(part.local){
    const tq=ingresoPartidoLocal(part);
    p2.cuerpo.appendChild(fila("Taquilla proyectada",tq.gente.toLocaleString("es-CL")+" personas · "+plata(tq.ingreso)));
    p2.cuerpo.appendChild(el("p","mini","Ajustás el precio de cada sector en Finanzas."));
  }
  p2.cuerpo.appendChild(el("h3","sub","¿Cómo lo vivís?"));
  const bs=el("div");
  [["⚡ Simular","seguir","Lo ves en vivo. Adentro decidís: saltar al resultado al toque o seguirlo minuto a minuto."],
   ["🎯 Dirigir","dirigir","Intervenís en los momentos clave, con las barras de apoyo en vivo."]].forEach(([n,m,d])=>{
    const b=el("button","btn-aqua ancho"+(m==="dirigir"?" verde":""),n+" · <span style='font-weight:400;font-size:11.5px'>"+d+"</span>");
    b.style.marginBottom="7px";
    b.onclick=()=>arrancarPartido(part,m);
    bs.appendChild(b);
  });
  p2.cuerpo.appendChild(bs);
  if((part.ronda==="FINAL"||part.ronda==="Semifinal")&&typeof modalCharlaCapitan==="function"){
    const bc=el("button","btn-aqua ancho","🧑‍✈️ Charla con el capitán antes de salir");
    bc.onclick=modalCharlaCapitan;
    p2.cuerpo.appendChild(bc);
  }
  const confHecha=E.flags["conf_"+E.idx];
  const bconf=el("button","btn-aqua ancho"+(confHecha?" gris":""),confHecha?"🎤 Ya diste la conferencia":"🎤 Conferencia de prensa");
  bconf.disabled=confHecha; bconf.onclick=()=>modalConferencia(part);
  p2.cuerpo.appendChild(bconf);
  p2.cuerpo.appendChild(el("p","mini","En el partido: barra espaciadora pausa · «⏩ Al resultado» lo termina al toque · Dirigir usa teclas 1 / 2 / 3."));
  rej.appendChild(p2);
  v.appendChild(rej);
  window.scrollTo({top:0});
}
/* ---------- pizarra libre (posicionar los 11 en la cancha) ---------- */
function apodoJug(n){ const p=(n||"").split(" "); return (p[p.length-1]||n).slice(0,9); }
function mismaGente(piz,once){ if(!piz||piz.length!==once.length) return false; const set=new Set(once.map(j=>j.n)); return piz.every(p=>set.has(p.n)); }
/* 6.8 · editor de alineación: armá tu XI a mano (meté suplentes, sacá titulares) */
function modalAlineacion(part){
  const disp=E.plantel.filter(j=>!j.vendido&&!j.cedido&&(j.lesion||0)<=0)
    .sort((a,b)=>scoreOnce(b)-scoreOnce(a));
  let sel=(E.tactica.xiManual&&E.tactica.xiManual.length)
    ? E.tactica.xiManual.filter(n=>disp.find(j=>j.n===n))
    : onceIdeal().map(j=>j.n);
  const POS=[["ARQ","Arqueros"],["DEF","Defensas"],["VOL","Volantes"],["DEL","Delanteros"]];
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">👥</span><span>Alinear el equipo</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      const arqs=sel.filter(n=>{const j=disp.find(x=>x.n===n);return j&&j.pos==="ARQ";}).length;
      const ok=(sel.length===11&&arqs>=1);
      const info=el("div","resul "+(ok?"bien":"mitad"));
      info.innerHTML="<b>"+sel.length+" / 11</b> titulares"+
        (arqs<1?" · <b style='color:#c0392b'>falta un arquero</b>":"")+
        (sel.length>11?" · sacá "+(sel.length-11):"")+
        (sel.length<11?" · elegí "+(11-sel.length)+" más":"");
      c.appendChild(info);
      c.appendChild(el("p","mini","Tocá un jugador para meterlo o sacarlo del once. Los que no elijas van a la banca. 🩹 = lesionado (no disponible)."));
      POS.forEach(([p,lab])=>{
        const grupo=disp.filter(j=>j.pos===p);
        if(!grupo.length) return;
        const enPos=grupo.filter(j=>sel.indexOf(j.n)>=0).length;
        c.appendChild(el("h3","sub",lab+" · <span class='mini'>"+enPos+" en el XI</span>"));
        const cont=el("div","align-grid");
        grupo.forEach(j=>{
          const on=sel.indexOf(j.n)>=0;
          const b=el("button","align-jug"+(on?" on":""));
          b.innerHTML="<b>"+(on?"✓ ":"")+j.n+(j.real?" ●":"")+"</b><span class='mini'>niv "+j.nivel+" · forma "+Math.round(j.forma)+(j.rasgos&&j.rasgos.length?" · "+j.rasgos[0]:"")+"</span>";
          b.onclick=()=>{ const i=sel.indexOf(j.n); if(i>=0) sel.splice(i,1); else { if(sel.length>=11){ aviso("Ya tenés 11. Sacá a alguien primero."); return; } sel.push(j.n); } pintar(); };
          cont.appendChild(b);
        });
        c.appendChild(cont);
      });
      const g=el("button","btn-aqua ancho verde","Guardar mi alineación"); g.disabled=!ok;
      g.onclick=()=>{ E.tactica.xiManual=sel.slice(); guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Alineación guardada"); };
      c.appendChild(g);
      const a=el("button","btn-aqua ancho gris","Volver a automático (el juego elige)"); a.style.marginTop="6px";
      a.onclick=()=>{ E.tactica.xiManual=null; guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Alineación automática"); };
      c.appendChild(a);
    };
    pintar();
  },{cerrarFuera:false});
}
function modalPizarra(part){
  const once=onceIdeal();
  if(!E.tactica.pizarra || !mismaGente(E.tactica.pizarra,once)) E.tactica.pizarra=pizarraDesdeFormacion(once);
  modal(box=>{
    let drag=null;
    const celdaBajo=(x,y)=>{ const e=document.elementFromPoint(x,y); return e?e.closest(".celda"):null; };
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🎯</span><span>Pizarra táctica</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini","🖐️ Arrastrá a los jugadores por la cancha para acomodarlos. Se permiten esquemas asimétricos o bizarros. ⬆ arriba es el arco rival."));
      const grid=el("div","pizarra");
      for(let rr=PIZ_FILAS-1; rr>=0; rr--){
        for(let cc=0; cc<PIZ_COLS; cc++){
          const cell=el("div","celda"+(rr===0?" propia":(rr>=3?" ataque":"")));
          cell.dataset.r=rr; cell.dataset.c=cc;
          const ocup=E.tactica.pizarra.find(p=>p.r===rr&&p.c===cc);
          if(ocup){
            const chip=el("div","chip"+(ocup.pos==="ARQ"?" arq":"")+" arrastrable");
            chip.textContent=apodoJug(ocup.n);
            chip.style.touchAction="none";
            chip.addEventListener("pointerdown",ev=>{ ev.preventDefault();
              drag={entry:ocup,moved:false,sx:ev.clientX,sy:ev.clientY,ghost:null};
              try{ chip.setPointerCapture(ev.pointerId); }catch(_){}
            });
            chip.addEventListener("pointermove",ev=>{ if(!drag||drag.entry!==ocup) return;
              if(!drag.moved && Math.hypot(ev.clientX-drag.sx,ev.clientY-drag.sy)>5){ drag.moved=true;
                chip.classList.add("dragging");
                drag.ghost=document.createElement("div"); drag.ghost.className="chip-ghost"; drag.ghost.textContent=chip.textContent;
                document.body.appendChild(drag.ghost);
              }
              if(drag.moved){ drag.ghost.style.left=ev.clientX+"px"; drag.ghost.style.top=ev.clientY+"px";
                [].forEach.call(document.querySelectorAll(".celda.hover"),x=>x.classList.remove("hover"));
                const cl=celdaBajo(ev.clientX,ev.clientY); if(cl) cl.classList.add("hover");
              }
            });
            const soltar=ev=>{ if(!drag||drag.entry!==ocup) return;
              const wasMoved=drag.moved, ghost=drag.ghost;
              if(wasMoved){ const cl=celdaBajo(ev.clientX,ev.clientY);
                if(cl){ const rr2=+cl.dataset.r, cc2=+cl.dataset.c;
                  const otro=E.tactica.pizarra.find(p=>p.r===rr2&&p.c===cc2&&p!==ocup);
                  if(otro){ otro.r=ocup.r; otro.c=ocup.c; }   /* swap */
                  ocup.r=rr2; ocup.c=cc2; } }
              if(ghost) ghost.remove(); drag=null;
              if(wasMoved) pintar();
            };
            chip.addEventListener("pointerup",soltar);
            chip.addEventListener("pointercancel",soltar);
            cell.appendChild(chip);
          }
          grid.appendChild(cell);
        }
      }
      c.appendChild(grid);
      const forma=formaLibre(E.tactica.pizarra)||{ataque:0,orden:0,ancho:0};
      const detec=(typeof formacionDetectada==="function")?formacionDetectada(E.tactica.pizarra):null;
      c.appendChild(el("div","resul bien","Formación detectada: <b style='font-size:16px'>"+(detec||"—")+"</b>"+
        (detec&&["4-4-2","4-3-3","4-5-1","5-3-2","5-4-1","3-5-2","3-4-3","4-2-4"].indexOf(detec)<0?" <span class='mini'>(esquema no clásico: el equipo lo sentirá raro los primeros minutos)</span>":"")));
      c.appendChild(el("div","resul mitad","Efecto táctico — ataque <b>"+signo(Math.round(forma.ataque))+
        "</b> · orden <b>"+signo(Math.round(forma.orden))+"</b> · ancho <b>"+signo(Math.round(forma.ancho))+"</b>"));
      const g=el("button","btn-aqua ancho verde","Guardar pizarra");
      g.onclick=()=>{ guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Pizarra guardada"); };
      c.appendChild(g);
      const q=el("button","btn-aqua ancho gris","Volver a la formación clásica"); q.style.marginTop="6px";
      q.onclick=()=>{ E.tactica.pizarra=null; guardar(); cerrarModal(); if(part) pantallaPrevia(part); aviso("Formación clásica activada"); };
      c.appendChild(q);
    };
    pintar();
  });
}
/* Conferencia de prensa PRE-partido (Bloque 4): 3 respuestas que mueven prensa,
   credibilidad y moral, con contexto de favorito/underdog. Una por partido. */
/* 6.9 · conferencia de prensa VIVA: periodista con nombre + pregunta reactiva
   a lo que pasó (derrota, racha, promesa de la memoria, clásico, objetivo). */
const PERIODISTAS=[
 {n:"Tironi",m:"Deporte Total"},{n:"la Kari Fuentes",m:"Radio Gol"},
 {n:"el Chico Sotomayor",m:"El Balonazo"},{n:"Marcela Ríos",m:"Crónica FC"},
 {n:"el Colo Pérez",m:"Golpe de Arco"},{n:"don Aníbal",m:"La Tercera del Deporte"}
];
const CONF_ARQ={
 calma:{grupos:{prensa:6,camarin:4},rep:{credibilidad:4},ef:{moral:3},txt:"Bajaste el perfil. La prensa y el camarín lo valoran."},
 mea :{grupos:{prensa:8,camarin:-2},rep:{credibilidad:6},ef:{moral:1},txt:"La autocrítica te subió crédito, aunque el grupo quedó algo tocado."},
 confianza:{grupos:{hinchada:7,prensa:2},rep:{publica:3},ef:{moral:2},txt:"Saliste confiado. La hinchada se ilusiona."},
 palo:{grupos:{hinchada:8,anfp:-6,prensa:-6},rep:{dureza:6,credibilidad:-2},ef:{},txt:"Calentaste la previa: la gente lo festeja, la ANFP y la prensa no."}
};
function preguntasConferencia(part){
  const fz=fuerzaEquipo(onceIdeal());
  const favorito=fz.base>part.fuerzaRival+6;
  const sinGanar=(E.temporada&&E.temporada.sinGanar)||0;
  const ult=(E.idx>0)?E.calendario[E.idx-1]:null, ultJugado=ult&&ult.jugado;
  const perdioUlt=ultJugado&&((ult.gf||0)<(ult.gc||0));
  const ganoUlt=ultJugado&&((ult.gf||0)>(ult.gc||0));
  const prom=(typeof promesaPendiente==="function")?promesaPendiente():null;
  const clasico=(typeof esClasico==="function")&&esClasico(part);
  const dep=(E.objetivos||[]).find(o=>o.tipo==="pos");
  const bajoObj=dep&&(typeof posicionEnTabla==="function")&&E.temporada.pj>4&&posicionEnTabla()>dep.meta+2;
  const L=[];
  if(perdioUlt) L.push({q:"Después de la caída ante "+ult.rivalNombre+", ¿sigue creyendo en el proceso o hay para preocuparse?",ops:[
     {t:"Bancar el proceso, la mano no tiembla",k:"calma"},{t:"Autocrítica: me hago cargo yo",k:"mea"},{t:"Palo: el que dude que se baje",k:"palo"}]});
  if(sinGanar>=3) L.push({q:"Son "+sinGanar+" fechas sin ganar. ¿Siente que su puesto está en discusión?",ops:[
     {t:"Poner el pecho, me hago cargo",k:"calma"},{t:"Pedir tiempo y respaldo",k:"confianza"},{t:"Calentar: acá el que trabaja soy yo",k:"palo"}]});
  if(prom) L.push({q:"Se comenta que le prometió un arreglo a "+prom.quien+". ¿Verdad o versión?",ops:[
     {t:"Confirmar y bancar al jugador",k:"confianza"},{t:"«De los temas internos no hablo»",k:"calma"},{t:"Negar todo de plano",k:"palo"}]});
  if(clasico) L.push({q:"Se viene el clásico ante "+part.rivalNombre+". ¿Qué mensaje le deja a la gente?",ops:[
     {t:"Paños fríos, foco en el fútbol",k:"calma"},{t:"Encender a la hinchada",k:"confianza"},{t:"Tirarle un palo al rival",k:"palo"}]});
  if(favorito) L.push({q:"Son favoritos claros ante "+part.rivalNombre+". ¿No los relaja la vara alta?",ops:[
     {t:"Humildad y respeto al rival",k:"calma"},{t:"Confianza total, vamos por todo",k:"confianza"},{t:"«Favorito se es en la cancha»",k:"palo"}]});
  if(bajoObj) L.push({q:"Están lejos del objetivo del año. ¿Le preocupa su continuidad?",ops:[
     {t:"Asumir la responsabilidad de frente",k:"mea"},{t:"Pedir que se banque el proyecto",k:"confianza"},{t:"Palo a la dirigencia por los refuerzos",k:"palo"}]});
  if(ganoUlt&&sinGanar===0) L.push({q:"Vienen encendidos tras ganarle a "+ult.rivalNombre+". ¿Hasta dónde sueñan?",ops:[
     {t:"Pies en la tierra, paso a paso",k:"calma"},{t:"Ilusionar a la gente",k:"confianza"},{t:"«El que quiera soñar, que sueñe»",k:"palo"}]});
  L.push({q:"Previa ante "+part.rivalNombre+". ¿Con qué se queda de cara al partido?",ops:[
     {t:"Bajar el perfil y pedir humildad",k:"calma"},{t:"Salir con confianza total",k:"confianza"},{t:"Un palo al rival y a los árbitros",k:"palo"}]});
  return L;
}
function modalConferencia(part){
  const L=preguntasConferencia(part);
  const q=(L.length>1)?elige(L.slice(0,-1)):L[0];   /* preferí la pregunta contextual */
  const per=elige(PERIODISTAS);
  modal(box=>{
    box.appendChild(el("div","cab",'<span class="ic">🎤</span><span>Conferencia de prensa</span>'));
    const c=el("div","cuerpo"); box.appendChild(c);
    c.appendChild(el("div","resul mitad","<b>"+per.n+"</b> <span class='mini'>· "+per.m+"</span><br>"+q.q));
    const ops=el("div","ops");
    q.ops.forEach(o=>{
      const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div>';
      b.onclick=()=>{
        const a=CONF_ARQ[o.k]||CONF_ARQ.calma;
        if(a.grupos) aplicarGrupos(a.grupos); if(a.rep) aplicarRep(a.rep); if(a.ef) aplicarEfectos(a.ef);
        E.flags["conf_"+E.idx]=true;
        if(typeof postProc==="function") postProc("@"+per.m.replace(/\s/g,""),"prensa","«"+o.t+"», dijo el DT en conferencia ante "+part.rivalNombre+".","neutro");
        notificar({t:"Conferencia con "+per.n,tipo:"neutro",d:"«"+o.t+"». "+a.txt,bandeja:false});
        guardar(); cerrarModal(); pantallaPrevia(part); aviso("Declaraciones dadas");
      };
      ops.appendChild(b);
    });
    c.appendChild(ops);
    const x=el("button","btn-aqua ancho gris","No hablar con la prensa"); x.style.marginTop="6px";
    x.onclick=()=>{ aplicarGrupos({prensa:-4}); E.flags["conf_"+E.idx]=true; guardar(); cerrarModal(); pantallaPrevia(part); aviso("Te fuiste sin hablar"); };
    c.appendChild(x);
  });
}
function arrancarPartido(part,modo){
  P_ACTUAL=iniciarPartido(part,modo);
  PAUSADO=false; MOMENTO_OPS=[];
  if(modo==="simular"){ correrHasta(P_ACTUAL,90); pintarPartido(); cerrarPartido(); return; }
  pintarPartido(); correrEnVivo();
}
function pintarPartido(){
  const P=P_ACTUAL; if(!P) return;
  const v=$("#vista"); v.innerHTML=""; v.dataset.sec="partido";
  const [yo,otro]=miMarcador(P);
  const p=panel(P.part.tipo==="copa"?("Copa Libertadores · "+P.part.ronda):("Fecha "+P.part.fecha),"🎙️",P.part.tipo==="copa"?"agua":"");
  const marc=el("div","marcador");
  marc.innerHTML='<div class="eq">'+(P.part.local?E.clubNombre:P.part.rivalNombre)+'</div>'+
    '<div class="go">'+P.gl+" - "+P.gv+'</div>'+
    '<div class="eq">'+(P.part.local?P.part.rivalNombre:E.clubNombre)+'</div>';
  p.cuerpo.appendChild(marc);
  const tramo=P.min<=45?"1T":(P.min<90?"2T":"FT");
  p.cuerpo.appendChild(el("div","reloj",P.terminado?"Final del partido":((PAUSADO?"⏸ ":"")+"Minuto "+P.min+" · "+tramo)));
  if(!P.terminado&&P.modo!=="simular"){
    const ctrl=el("div","ctrlPartido");
    const bp=el("button","btn-aqua chico",PAUSADO?"▶ Seguir":"⏸ Pausa");
    bp.onclick=()=>{ PAUSADO=!PAUSADO; if(!MOMENTO_OPS.length) pintarPartido(); };
    ctrl.appendChild(bp);
    [["1x",420],["2x",240],["4x",110]].forEach(([n,vv])=>{
      const b=el("button","btn-aqua chico"+(VEL_PARTIDO===vv?"":" gris"),n);
      b.onclick=()=>{ VEL_PARTIDO=vv; if(!MOMENTO_OPS.length&&!PAUSADO) correrEnVivo(); pintarPartido(); };
      ctrl.appendChild(b);
    });
    /* saltar al resultado: la parte "instantánea" fusionada en el mismo partido */
    const bfin=el("button","btn-aqua chico verde","⏩ Al resultado"); bfin.style.marginLeft="4px";
    bfin.onclick=()=>{ clearInterval(TIMER); MOMENTO_OPS=[]; correrHasta(P,90); pintarPartido(); cerrarPartido(); };
    ctrl.appendChild(bfin);
    /* 6.18 · cambios con nombre */
    const bcam=el("button","btn-aqua chico","🔄 Cambio ("+(P.cambios||0)+"/"+(P.cambiosMax||3)+")"); bcam.style.marginLeft="4px";
    /* 6.25 · fix: no permitir cambio mientras hay una elección táctica pendiente (borraba las opciones) */
    bcam.disabled=(P.cambios||0)>=(P.cambiosMax||3) || (MOMENTO_OPS&&MOMENTO_OPS.length>0);
    bcam.onclick=modalCambio;
    ctrl.appendChild(bcam);
    p.cuerpo.appendChild(ctrl);
    if(P.modo==="dirigir"){
      if(!E.config) E.config={autoPausa:true};
      const bap=el("button","btn-aqua chico"+(E.config.autoPausa?"":" gris"),
        E.config.autoPausa?"⏸ Auto-pausa: ON":"▶ Auto-pausa: OFF");
      bap.title="Si está OFF, las jugadas (penal/tiro libre/lesión) se resuelven solas sin frenar el partido";
      bap.onclick=()=>{ E.config.autoPausa=!E.config.autoPausa; guardar(); pintarPartido(); };
      p.cuerpo.appendChild(bap);
    }
    const stam=clamp(100-P.cansancio*6,0,100);
    p.cuerpo.appendChild(el("div","mini","Físico del equipo"));
    p.cuerpo.appendChild(el("div",null,barrita(stam,stam>50?"#4fbf3f":(stam>25?"#e0a92a":"#c9392c"))));
  }
  /* 5.0 · barras de apoyo en vivo */
  if(P.modo!=="simular"){
    if(typeof actualizarApoyo==="function" && !P.apoyo) actualizarApoyo(P);
    if(P.apoyo){
      const ap=el("div","apoyo-live");
      const col=v=>v>=60?"#4fbf3f":(v>=35?"#e0a92a":"#c9392c");
      [["🎪 Ánimo hinchada",P.apoyo.hinchada],["👥 Confianza plantel",P.apoyo.plantel],["🧠 Criterio DT",P.apoyo.criterio]].forEach(([n,val])=>{
        const row=el("div","apoyo-row");
        row.innerHTML="<span class='apoyo-n'>"+n+"</span>"+barrita(val,col(val))+"<span class='apoyo-v'>"+Math.round(val)+"</span>";
        ap.appendChild(row);
      });
      p.cuerpo.appendChild(ap);
    }
  }
  const rel=el("div","relato");
  P.lineas.slice().reverse().forEach(l=>rel.appendChild(el("div","rel "+l.c,'<span class="m">'+l.m+"'</span><span>"+l.t+"</span>")));
  if(!P.lineas.length) rel.appendChild(el("div","rel","<span class='m'>0'</span><span>Rueda la pelota en "+P.part.sede+".</span>"));
  p.cuerpo.appendChild(rel);
  /* ticker de redes en vivo (FutbolGram) */
  if(P.modo!=="simular" && P.ticker && P.ticker.length){
    p.cuerpo.appendChild(el("h3","sub","📱 FutbolGram · en vivo"));
    const tk=el("div","ticker");
    P.ticker.slice(0,10).forEach(t=>{
      const d=el("div","tk "+(t.tono==="bueno"?"bien":(t.tono==="malo"?"mal":"")));
      d.innerHTML="<b>"+t.autor+"</b> <span class='mini'>"+t.m+"'</span><br>"+t.texto;
      tk.appendChild(d);
    });
    p.cuerpo.appendChild(tk);
  }
  const wrap=el("div","partido-wrap"); wrap.appendChild(p); v.appendChild(wrap);
}
/* Loop fluido: el reloj corre y se auto-pausa SOLO cuando hay una jugada de
   peligro que decidir (penal, tiro libre, lesión) o un momento táctico. */
function correrEnVivo(){
  clearInterval(TIMER);
  TIMER=setInterval(pasoEnVivo, VEL_PARTIDO);
}
function pasoEnVivo(){
  if(PAUSADO) return;
  const P=P_ACTUAL; if(!P){ clearInterval(TIMER); return; }
  if(P.terminado||P.min>=90){ clearInterval(TIMER); pintarPartido(); cerrarPartido(); return; }
  /* momento táctico programado (solo dirigir) */
  if(P.modo==="dirigir" && P.momentoIdx<P.momentos.length && P.min>=P.momentos[P.momentoIdx]){
    clearInterval(TIMER); pintarPartido(); mostrarMomento(); return;
  }
  const ev=tickPartido(P);
  if(typeof actualizarApoyo==="function") actualizarApoyo(P);
  if(typeof tickerPost==="function") tickerPost(P,ev);
  if(ev.tipo==="penalRival"){ resolverEventoAuto(P,ev); pintarPartido(); return; }
  if(ev.tipo==="penal"||ev.tipo==="lesion"||ev.tipo==="tiroLibre"){
    const autoP=!E.config||E.config.autoPausa!==false;
    if(P.modo==="dirigir"&&autoP){ clearInterval(TIMER); pintarPartido(); mostrarAccion(ev); return; }
    resolverEventoAuto(P,ev);
  }
  pintarPartido();
}
function reanudarPronto(){
  setTimeout(()=>{ if(!P_ACTUAL) return;
    if(P_ACTUAL.terminado||P_ACTUAL.min>=90){ cerrarPartido(); }
    else correrEnVivo();
  }, 650);
}
/* momento táctico (charla/cambio de plan) */
/* 6.18 · cambio manual con nombre durante el partido */
function modalCambio(){
  const P=P_ACTUAL; if(!P) return;
  if((P.cambios||0)>=(P.cambiosMax||3)){ aviso("Ya usaste todos los cambios"); return; }
  const wasPaused=PAUSADO; PAUSADO=true; clearInterval(TIMER);
  const banca=(typeof bancaPartido==="function")?bancaPartido(P):E.plantel.filter(j=>!j.vendido&&!j.cedido&&!(j.lesion>0)&&P.once.indexOf(j)<0);
  let sale=null;
  const reanudar=()=>{ cerrarModal(); PAUSADO=wasPaused; pintarPartido(); if(!PAUSADO&&!MOMENTO_OPS.length) correrEnVivo(); };
  modal(box=>{
    const pintar=()=>{
      box.innerHTML="";
      box.appendChild(el("div","cab",'<span class="ic">🔄</span><span>Cambio '+((P.cambios||0)+1)+' / '+(P.cambiosMax||3)+'</span>'));
      const c=el("div","cuerpo"); box.appendChild(c);
      c.appendChild(el("p","mini","Elegí quién SALE y quién ENTRA. Al minuto "+P.min+"."));
      c.appendChild(el("h3","sub","Sale de la cancha"));
      const g1=el("div","align-grid");
      P.once.forEach(j=>{
        const b=el("button","align-jug"+(sale===j?" on":""));
        b.innerHTML="<b>"+(sale===j?"✓ ":"")+j.n+"</b><span class='mini'>"+j.pos+" · cansancio "+Math.round(j.cansancio||0)+"</span>";
        b.onclick=()=>{ sale=(sale===j?null:j); pintar(); };
        g1.appendChild(b);
      });
      c.appendChild(g1);
      if(sale){
        c.appendChild(el("h3","sub","Entra por "+sale.n));
        if(!banca.length){ c.appendChild(el("p","mini","No quedan suplentes disponibles.")); }
        const g2=el("div","align-grid");
        banca.slice().sort((a,b)=>((b.pos===sale.pos)-(a.pos===sale.pos))||(b.nivel-a.nivel)).forEach(j=>{
          const b=el("button","align-jug");
          b.innerHTML="<b>"+j.n+"</b><span class='mini'>"+j.pos+" · niv "+j.nivel+" · forma "+Math.round(j.forma)+"</span>";
          b.onclick=()=>{ if(hacerCambio(P,sale,j)){ reanudar(); aviso(j.n+" entra por "+sale.n); } };
          g2.appendChild(b);
        });
        c.appendChild(g2);
      }
      const x=el("button","btn-aqua ancho gris","Cerrar sin cambiar"); x.style.marginTop="6px";
      x.onclick=reanudar;
      c.appendChild(x);
    };
    pintar();
  },{cerrarFuera:false});
}
function mostrarMomento(){
  const P=P_ACTUAL;
  const m=momentoActual(P);
  const p=panel(m.t,"🧠","alerta");
  p.cuerpo.appendChild(el("p",null,m.d));
  const ops=el("div","ops ops-part"); MOMENTO_OPS=[];
  m.op.forEach((o,i)=>{
    const b=el("button","op");
    b.innerHTML='<div class="t"><span class="tecla">'+(i+1)+'</span> '+o.t+'</div>';
    b.onclick=()=>{ MOMENTO_OPS=[]; aplicarMomento(P,o.ef); P.momentoIdx++;
      if(P.apoyo){ P.apoyo.momentos=(P.apoyo.momentos||0)+1; P.apoyo.criterio=clamp(P.apoyo.criterio+6,0,99); }
      correrEnVivo(); };
    ops.appendChild(b); MOMENTO_OPS.push(b);
  });
  p.cuerpo.appendChild(ops);
  p.cuerpo.appendChild(el("p","mini","Elegí con 1 / 2 / 3 / 4 · flechas y Enter."));
  (document.querySelector(".partido-wrap")||$("#vista")).appendChild(p);
}
/* jugada de peligro que el DT resuelve en el acto */
function candidatosPenal(P){
  const c=P.once.filter(j=>j.pos!=="ARQ");
  const punt=j=>(j.nivel||60)+((j.rasgos&&j.rasgos.includes("penales"))?30:0)+((j.rasgos&&j.rasgos.includes("definición"))?12:0);
  let lista=c.slice().sort((a,b)=>punt(b)-punt(a)).slice(0,3);
  /* 6.7 · el pateador designado en la previa va primero si está en cancha */
  const des=E.tactica&&E.tactica.penalista;
  if(des){ const dj=P.once.find(j=>j.n===des); if(dj){ lista=[dj].concat(lista.filter(j=>j.n!==des)).slice(0,3); } }
  return lista;
}
function centroTiroLibre(P){
  /* 6.7 · el ejecutante de tiro libre designado tira si está en cancha */
  const desTL=E.tactica&&E.tactica.tiroLibre&&P.once.find(j=>j.n===E.tactica.tiroLibre);
  const ejecuta=desTL||P.once.filter(j=>j.rasgos&&(j.rasgos.includes("tiro libre")||j.rasgos.includes("desequilibrio")))[0];
  const aereo=P.once.filter(j=>j.rasgos&&j.rasgos.includes("juego aéreo"))[0]||elige(P.once.filter(j=>j.pos==="DEF"||j.pos==="DEL"))||P.once[0];
  if(ejecuta&&ejecuta.rasgos&&ejecuta.rasgos.includes("tiro libre")){
    linea(P,P.min,"Tiro libre para "+ejecuta.n+", especialista, se para sobre la pelota…");
    const pd=clamp(0.16+(ejecuta.nivel-70)/200,0.08,0.30);
    if(Math.random()<pd){ ejecuta.goles++; P.goleadores.push(ejecuta.n); regGol(P,P.min,ejecuta.n,true,"tiro libre"); if(P.part.local)P.gl++;else P.gv++;
      linea(P,P.min,"¡GOLAZO de tiro libre de "+ejecuta.n+"! "+marcadorTxt(P),"gol"); return; }
  }
  linea(P,P.min,"Centro al área"+(ejecuta?" de "+ejecuta.n:"")+", sube "+(aereo?aereo.n:"la defensa")+" a cabecear…");
  const prob=clamp(0.14+((aereo&&aereo.rasgos&&aereo.rasgos.includes("juego aéreo"))?0.10:0),0.06,0.28);
  if(Math.random()<prob){ if(aereo){aereo.goles++;P.goleadores.push(aereo.n);regGol(P,P.min,aereo.n,true,"cabeza"); if(aereo.pos==="DEF"&&typeof desbloquear==="function") desbloquear("gol_defensa");} if(P.part.local)P.gl++;else P.gv++;
    linea(P,P.min,"¡Gol de cabeza"+(aereo?" de "+aereo.n:"")+"! "+marcadorTxt(P),"gol"); }
  else linea(P,P.min,"Despeja la defensa rival de cabeza.");
}
function mostrarAccion(ev){
  const P=P_ACTUAL;
  let titulo="", opciones=[];
  if(ev.tipo==="penal"){
    titulo="¡Penal a favor! ¿Quién patea?";
    opciones=candidatosPenal(P).map(j=>({t:j.n+" · "+((j.rasgos&&j.rasgos.includes("penales"))?"especialista":"nivel "+j.nivel),
      run:()=>penalEnPartido(P,true,null,j)}));
  } else if(ev.tipo==="tiroLibre"){
    titulo="Tiro libre peligroso";
    opciones=[
      {t:"Al arco, buscar el golazo",run:()=>tiroLibreAuto(P)},
      {t:"Centro al área",run:()=>centroTiroLibre(P)},
      {t:"Jugarla en corto, sin riesgo",run:()=>linea(P,P.min,"La juegan en corto y rearman con paciencia.")}
    ];
  } else { /* lesión */
    const j=lesionEnPartido(P);
    titulo="Lesión de "+(j?j.n:"un jugador");
    opciones=[
      {t:"Meter un recambio fresco",run:()=>{ P.empuje+=0.2; linea(P,P.min,"Entra sangre nueva por el lesionado."); }},
      {t:"Aguantar y reordenar",run:()=>{ P.orden+=1; P.cansancio+=0.6; linea(P,P.min,"El equipo se reacomoda con lo puesto."); }}
    ];
  }
  const p=panel(titulo,"⚡","alerta");
  const ops=el("div","ops ops-part"); MOMENTO_OPS=[];
  opciones.forEach((o,i)=>{
    const b=el("button","op");
    b.innerHTML='<div class="t"><span class="tecla">'+(i+1)+'</span> '+o.t+'</div>';
    b.onclick=()=>{ MOMENTO_OPS=[]; o.run(); pintarPartido(); reanudarPronto(); };
    ops.appendChild(b); MOMENTO_OPS.push(b);
  });
  p.cuerpo.appendChild(ops);
  p.cuerpo.appendChild(el("p","mini","Elegí con 1 / 2 / 3 · flechas y Enter."));
  (document.querySelector(".partido-wrap")||$("#vista")).appendChild(p);
}
function hitosPartido(res){
  const h=[], yo=res.yo, otro=res.otro, dif=Math.abs(yo-otro);
  if(yo>=5) h.push("🎩 Manita: "+yo+" goles en un partido.");
  else if(dif>=4&&yo>otro) h.push("💥 Goleada histórica.");
  if(yo>0&&otro===0) h.push("🧤 Valla invicta.");
  const cuenta={};
  (res.golesDetalle||[]).forEach(g=>{ if(g.propio) cuenta[g.quien]=(cuenta[g.quien]||0)+1; });
  for(const k in cuenta){ if(cuenta[k]>=3) h.push("⚽ ¡Hat-trick de "+k+"!"); else if(cuenta[k]===2) h.push("⚽ Doblete de "+k+"."); }
  (res.golesDetalle||[]).forEach(g=>{ if(g.propio&&(cuenta[g.quien]||0)<2){ const j=E.plantel.find(x=>x.n===g.quien); if(j&&j.edad<=20) h.push("🌱 Gol del juvenil "+j.n+" ("+j.edad+" años)."); } });
  return h;
}
function cerrarPartido(){
  const P=P_ACTUAL; if(!P||P.cerrado) return;
  P.cerrado=true; clearInterval(TIMER); MOMENTO_OPS=[];
  const res=terminarPartido(P);
  const gano=res.yo>res.otro;
  const p=panel("Final del partido","📄",gano?"":"alerta");
  p.cuerpo.appendChild(el("h2","tit",(gano?"Victoria ":(res.yo<res.otro?"Derrota ":"Empate "))+res.yo+"-"+res.otro+" ante "+P.part.rivalNombre));

  /* caja de resumen: goles con minuto, tarjetas, lesiones */
  const cajita=el("div","resul mitad");
  let html="";
  const goles=(res.golesDetalle||[]).slice().sort((a,b)=>a.min-b.min);
  if(goles.length) html+="<b>Goles</b><br>"+goles.map(g=>g.min+"' "+(g.propio?"":"("+P.part.rivalNombre+") ")+g.quien+
    (g.tipo&&g.tipo!=="jugada"?" <span class='mini'>["+g.tipo+"]</span>":"")+
    (g.asist?" <span class='mini'>(asist. "+g.asist+")</span>":"")).join("<br>")+"<br>";
  else html+="<b>Sin goles.</b><br>";
  if(res.tarjetas&&res.tarjetas.length) html+="<span class='mini'>Amarillas: "+res.tarjetas.join(", ")+"</span><br>";
  if(res.lesionados&&res.lesionados.length) html+="<span class='mini'>Lesionados: "+res.lesionados.join(", ")+"</span><br>";
  cajita.innerHTML=html;
  p.cuerpo.appendChild(cajita);

  /* hitos / efemérides */
  const hitos=hitosPartido(res);
  if(hitos.length) p.cuerpo.appendChild(el("div","resul "+(gano?"bien":"mitad"),hitos.join("<br>")));

  if(P.part.local) p.cuerpo.appendChild(fila("Público / taquilla",res.gente.toLocaleString("es-CL")+" personas · "+plata(res.caja)));

  /* salto de posición + otros resultados de la fecha (solo liga) */
  if(res.esLiga){
    if(res.posAntes&&res.posDespues){
      const delta=res.posAntes-res.posDespues;
      p.cuerpo.appendChild(fila("Posición en la tabla",ordinal(res.posDespues)+(delta>0?" ▲ (subiste "+delta+")":(delta<0?" ▼ (bajaste "+(-delta)+")":" (sin cambios)"))));
    }
    if(E.ultimaFecha&&E.ultimaFecha.length){
      p.cuerpo.appendChild(el("h3","sub","Otros resultados de la fecha"));
      E.ultimaFecha.forEach(r=>p.cuerpo.appendChild(el("div","fila","<span>"+r.a+"</span><b>"+r.ga+" - "+r.gb+"</b><span>"+r.b+"</span>")));
    }
    /* mini tabla en vivo: top 5 + tu posición */
    const arr=tablaOrdenada();
    const t=el("table"); t.innerHTML="<thead><tr><th></th><th>Club</th><th class='n'>PJ</th><th class='n'>Pts</th></tr></thead>";
    const tb=el("tbody");
    arr.forEach((c,i)=>{ if(i<5||c.id===E.club) tb.appendChild(el("tr",c.id===E.club?"yo":"", "<td class='n'>"+(i+1)+"</td><td>"+c.n+"</td><td class='n'>"+c.pj+"</td><td class='n'>"+c.pts+"</td>")); });
    t.appendChild(tb);
    p.cuerpo.appendChild(el("h3","sub","Tabla al día")); p.cuerpo.appendChild(t);
  }

  if(P.part.real){
    p.cuerpo.appendChild(el("h3","sub","En la línea histórica"));
    p.cuerpo.appendChild(el("p","mini","Ese partido terminó "+P.part.real+"."+
      (P.part.real===res.yo+"-"+res.otro?" Coincide con lo que acabás de jugar.":" Tu partida ya va por otro lado.")));
    const nota=NOTAS_COPA[P.part.notaId];
    if(nota) p.cuerpo.appendChild(el("p","mini",nota));
  }

  /* rueda de prensa: manual (mini-decisión) o automática (ayudante) */
  seccionPrensa(p,res);

  const b=el("button","btn-aqua ancho verde","Cerrar y seguir la semana");
  b.onclick=()=>{
    P_ACTUAL=null;
    if(typeof procesarSemanaPostPartido==="function"){
      const r=procesarSemanaPostPartido();
      if(r&&r.ev&&r.ev.tipo==="decision") return;
    }
    irA("escritorio");
  };
  p.cuerpo.appendChild(b);
  $("#vista").appendChild(p);
  window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
}
/* ---------- rueda de prensa post-partido ---------- */
function opcionesPrensa(res){
  if(res.yo>res.otro) return [
   {t:"Elogiar al plantel y bajar el perfil",ef:{},grupos:{camarin:6,prensa:5},rep:{publica:3},d:"Mensaje sobrio: el camarín lo agradece y la prensa te trata bien."},
   {t:"Agrandarse y prometer más",ef:{hinchada:4},grupos:{hinchada:6,prensa:-4},rep:{credibilidad:-3},d:"La hinchada se prende, pero pusiste la vara alta y la prensa toma nota."},
   {t:"Mandarle un recado al rival",ef:{},grupos:{hinchada:5,anfp:-6,prensa:-3},rep:{dureza:4},d:"Calentaste la previa del próximo; algunos lo aplauden, otros no."}
  ];
  if(res.yo<res.otro) return [
   {t:"Poner la cara y bancar al grupo",ef:{moral:4},grupos:{camarin:8,prensa:3},rep:{publica:2},d:"Diste la cara: el vestuario lo valora."},
   {t:"Autocrítica pública",ef:{moral:-2},grupos:{prensa:6},rep:{credibilidad:6},d:"Sinceridad que suma credibilidad, aunque duela hacia adentro."},
   {t:"Apuntar al árbitro",ef:{hinchada:4},grupos:{hinchada:6,anfp:-8,prensa:-6},rep:{dureza:5,publica:-3},d:"La hinchada compra el complot; la ANFP y la prensa, no."}
  ];
  return [
   {t:"Rescatar lo bueno",ef:{moral:2},grupos:{prensa:3},d:"Un empate se puede vender bien si sabés hablar."},
   {t:"Mostrar bronca por los puntos perdidos",ef:{},grupos:{camarin:-3,prensa:4},rep:{dureza:3},d:"Marcaste exigencia; el camarín siente la presión."}
  ];
}
function seccionPrensa(p,res){
  p.cuerpo.appendChild(el("h3","sub","Rueda de prensa"));
  const tog=el("div","mini");
  tog.innerHTML="Modo: <b>"+(E.prensaAuto?"automático (ayudante)":"manual (vos hablás)")+"</b>";
  p.cuerpo.appendChild(tog);
  const bt=el("button","btn-aqua chico gris",E.prensaAuto?"Pasar a manual":"Delegar en el ayudante");
  bt.onclick=()=>{ E.prensaAuto=!E.prensaAuto; guardar(); tog.innerHTML="Modo: <b>"+(E.prensaAuto?"automático (ayudante)":"manual (vos hablás)")+"</b>"; bt.textContent=E.prensaAuto?"Pasar a manual":"Delegar en el ayudante"; zonaPrensa.innerHTML=""; pintarZonaPrensa(); };
  p.cuerpo.appendChild(bt);
  const zonaPrensa=el("div"); p.cuerpo.appendChild(zonaPrensa);
  let hecho=false;
  function pintarZonaPrensa(){
    zonaPrensa.innerHTML="";
    if(hecho) return;
    if(E.prensaAuto){
      const r=res.yo>res.otro?{grupos:{prensa:3,camarin:2}}:res.yo<res.otro?{grupos:{prensa:1,camarin:1}}:{grupos:{prensa:1}};
      aplicarGrupos(r.grupos);
      notificar({t:"El ayudante habló con la prensa",tipo:"neutro",d:"Se ocupó de la rueda de prensa sin sobresaltos. Declaraciones tibias, cero polémica.",bandeja:false});
      guardar(); hecho=true;
      zonaPrensa.appendChild(el("div","resul mitad","El ayudante se encargó: sin polémica."));
    } else {
      const ops=el("div","ops");
      opcionesPrensa(res).forEach(o=>{
        const b=el("button","op"); b.innerHTML='<div class="t">'+o.t+'</div>';
        b.onclick=()=>{
          if(o.ef) aplicarEfectos(o.ef); if(o.grupos) aplicarGrupos(o.grupos); if(o.rep) aplicarRep(o.rep);
          notificar({t:"Declaraciones a la prensa",tipo:"neutro",d:o.d,bandeja:false});
          guardar(); hecho=true; zonaPrensa.innerHTML=""; zonaPrensa.appendChild(el("div","resul bien",o.d));
        };
        ops.appendChild(b);
      });
      zonaPrensa.appendChild(ops);
    }
  }
  pintarZonaPrensa();
}
