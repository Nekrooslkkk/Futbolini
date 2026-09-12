"use strict";
/* ============================================================
   FUTBOLINI 7.75 · pulido.js
   Capa última: decisiones club-correctas, metas por división,
   atiende con "cómo", escritorio/institución/mercado, noticias,
   jugadas de poder entendibles, calendario-país (TODAS las
   tablas), ayudante sin tutorial, anim.
   Cargar DESPUÉS de data-formato2026.js y mundo.js.
   ============================================================ */

function _t74(k,n){ return (typeof T==="function")?T(k,n):n; }
function _div74(){
  if(!E) return "P";
  if(E.eraBase==="arg2026") return "ARG";
  if(E.eraBase==="2026c") return "C";
  if(E.eraBase==="2026b") return "B";
  return "P";
}
function _estClub74(){
  if(!E) return "el estadio";
  const c=(typeof clubMundo==="function")?clubMundo(E.club):(typeof clubLookup==="function"?clubLookup(E.club):null);
  if(c&&c.est) return c.est;
  if(typeof CLUB_INFO_2026==="object"&&CLUB_INFO_2026[E.club]&&CLUB_INFO_2026[E.club].est) return CLUB_INFO_2026[E.club].est;
  return E.clubNombre||"el estadio";
}

/* ---- tokens ESTADIO / CIUDAD / DIVISION ---- */
(function wrapTokens74(){
  if(typeof resolverTokens!=="function"||resolverTokens._p74) return;
  const orig=resolverTokens;
  resolverTokens=function(txt,est){
    let s=orig(txt,est);
    if(!s||typeof s!=="string") return s;
    try{
      const c=(typeof clubMundo==="function")?clubMundo((est&&est.club)||(E&&E.club)):(typeof clubLookup==="function"?clubLookup((est&&est.club)||(E&&E.club)):null);
      const estNom=c&&c.est?c.est:_estClub74();
      const ciu=c&&c.ciudad?c.ciudad:"";
      const div=_div74()==="C"?"Segunda División":(_div74()==="B"?"Primera B":(_div74()==="ARG"?"Liga Profesional":"Primera División"));
      s=s.replace(/\{ESTADIO\}/g,estNom).replace(/\{CIUDAD\}/g,ciu).replace(/\{DIVISION\}/g,div);
    }catch(e){}
    return s;
  };
  resolverTokens._p74=true;
})();

/* ---- clubLookup también busca Segunda ---- */
(function wrapLookup74(){
  if(typeof clubLookup!=="function"||clubLookup._p74) return;
  const orig=clubLookup;
  clubLookup=function(id){
    const r=orig(id); if(r) return r;
    if(typeof LIGA_C_2026!=="undefined"){
      for(let i=0;i<LIGA_C_2026.length;i++) if(LIGA_C_2026[i].id===id) return LIGA_C_2026[i];
    }
    if(typeof LIGA_ARG_2026!=="undefined"){
      for(let i=0;i<LIGA_ARG_2026.length;i++) if(LIGA_ARG_2026[i].id===id) return LIGA_ARG_2026[i];
    }
    return null;
  };
  clubLookup._p74=true;
})();

/* ---- decisiones: club-correctas + tope por tag ---- */
function textoAjenoClub74(d){
  if(!E||!d) return false;
  const txt=((d.t||"")+" "+(d.d||"")).toLowerCase();
  const club=E.club;
  if(/macul/.test(txt) && club!=="CC") return true;
  if(/monumental/.test(txt) && club!=="CC" && club!=="RIV" && club!=="TUC" && club!=="BOC") return true;
  if(/\banfp\b|quilín|quilin/.test(txt) && (typeof esClubArg==="function" && esClubArg(club))) return true;
  if(/santa laura/.test(txt) && club!=="UES") return true;
  if(/san carlos de apoquindo/.test(txt) && club!=="UC") return true;
  if(/estadio nacional/.test(txt) && club!=="UCH") return true;
  if(/sausalito/.test(txt) && club!=="EVE") return true;
  if(/la bombonera/.test(txt) && club!=="BOC") return true;
  if(/el monumental de lima/.test(txt)) return true;
  if(_div74()==="C" && /libertadores|sudamericana/.test(txt) && !/no (hay|clasifica|entra)/.test(txt)) return true;
  if(d.club && d.club!==club) return true;
  if(d.anio && d.anio!==E.anio) return true;
  if(d.era){
    const eras=Array.isArray(d.era)?d.era:[d.era];
    if(eras.indexOf(E.eraBase)<0 && eras.indexOf(String(E.eraBase))<0) return true;
  }
  if(d.div){
    const ds=Array.isArray(d.div)?d.div:[d.div];
    if(ds.indexOf(_div74())<0) return true;
  }
  return false;
}
(function wrapDec74(){
  if(typeof decisionesDisponibles!=="function"||decisionesDisponibles._p74) return;
  const orig=decisionesDisponibles;
  decisionesDisponibles=function(){
    return (orig()||[]).filter(d=>!textoAjenoClub74(d));
  };
  decisionesDisponibles._p74=true;
  if(typeof repartirDecisiones==="function" && !repartirDecisiones._p74){
    const origR=repartirDecisiones;
    repartirDecisiones=function(){
      origR.apply(this,arguments);
      try{ recortarDecisiones74(); }catch(e){}
    };
    repartirDecisiones._p74=true;
  }
})();
function recortarDecisiones74(){
  if(!E||!Array.isArray(E.decPend)) return;
  E.decPend=E.decPend.filter(x=>{
    const d=(typeof decisionPorId==="function")?decisionPorId(x.id):null;
    return !d || !textoAjenoClub74(d);
  });
  const urg=E.decPend.filter(x=>x.peso==="alto");
  const resto=E.decPend.filter(x=>x.peso!=="alto");
  const clubOwn=resto.filter(x=>{ const d=decisionPorId(x.id); return d&&d.club; });
  const bolsa=resto.filter(x=>{ const d=decisionPorId(x.id); return !(d&&d.club); });
  const sem=E.idx||0;
  bolsa.sort((a,b)=>{
    const da=decisionPorId(a.id), db=decisionPorId(b.id);
    const ta=(da&&da.tag)||a.id, tb=(db&&db.tag)||b.id;
    return ((ta.charCodeAt(0)+sem*13)%97)-((tb.charCodeAt(0)+sem*13)%97);
  });
  const vistos=Object.create(null), keep=[];
  bolsa.forEach(x=>{
    const d=decisionPorId(x.id); const tag=(d&&d.tag)||x.id;
    if(vistos[tag]) return;
    vistos[tag]=1;
    if(keep.length<3) keep.push(x);
  });
  E.decPend=urg.concat(clubOwn).concat(keep);
}

/* ---- metas: Segunda / B y "cómo hacerlo" ---- */
function comoHacerObjetivo(o){
  if(!o) return "";
  if(o.hacer) return o.hacer;
  const div=_div74();
  if(o.tipo==="deuda") return "En Finanzas: pagá un tramo de deuda con caja extra, vendé un prescindible en Mercado (no al ídolo), cedé juveniles para bajar planilla y NO pidas más crédito. Cada semana en rojo te hunde. Un sponsor contento también entra plata.";
  if(o.tipo==="caja") return "Equilibrá el flujo semanal: recortá planilla (cesiones, no renovar al que no juega) y subí ingresos (taquilla, precio de entrada, sponsors). Si el resultado semanal es rojo, primero eso; después pensá en fichar.";
  if(o.tipo==="pos"){
    if(div==="C") return "Son 12 fechas de zona. Cada punto vale doble. Ganá de local, no tires las visitas. El 1° de la zona va a liguilla; el ganador sube a la B. No hay Libertadores acá.";
    if(div==="B") return "El 1° sube directo a Primera. 2° a 8° juegan liguilla por el segundo cupo. El último baja a Segunda. Sumá de local y no aflojes en la regular.";
    if(div==="ARG") return "29 fechas, una rueda, 30 clubes. Sumá de local. El formato real AFA es Apertura/Clausura en zonas de 15; acá se juega todos contra todos una vez.";
    return "Sumá puntos de liga. Ganá de local, no tires visitas. Un clásico ganado empuja la tabla y tapa fechas grises.";
  }
  if(o.tipo==="victorias") return "Hay que ganar partidos de liga, no empatar. Entrená fuerte la semana (escritorio), acomodá la pizarra si la química está floja, y no rotés de más en los que tenís que sumar.";
  if(o.tipo==="clasico") return (div==="C"
    ?"Ganale al rival de tu zona que más duele. En Segunda el clásico es el del pueblo, no el Superclásico. Prepará la semana (decisión de clásico si aparece) y no vendas al ídolo antes."
    :"Ganá al menos un clásico en el año. Semana de clásico: no aflojes el once y cargá el ambiente sin pasarte de riesgo.");
  if(o.tipo==="hinchada") return "Bajá el precio de la popular, reunite con la barra (Institución) y cerrá un pacto que puedas cumplir. Un resultado de local ayuda más que un discurso.";
  if(o.tipo==="directorio") return "No prometas refuerzos que no vas a traer. Ordená la caja, rindé cuentas (Interacción directa) y cumplí las metas deportivas. El directorio se calma con puntos y números, no con frases.";
  if(o.tipo==="grupo"){
    if(o.grupo==="sponsors") return "Imagen limpia: no te pelees con la prensa a lo loco, cumplí los partidos de TV y no hagas jugadas de poder contra los sponsors si la aprobación está floja. Un evento con la marca (pasillos) suma.";
    return "Trabajá ese grupo en Institución: estatutos, pasillos y jugadas de poder. Si está en contra, no lo aprietes — primero reconquistalo.";
  }
  if(o.tipo==="copaAvance") return "Jugá las copas, no las simules a ciegas. Rotá en las fáciles, salí entero a las que clasifican. La copa no perdona un once de reserva en un partido que vale.";
  return o.detalle||"";
}
function ajustarObjetivos74(objs){
  objs=objs||[];
  const div=_div74();
  const nZona=(div==="C")?(((typeof clubesLigaActual==="function")?clubesLigaActual():[]).length||7):((typeof LIGA_ACT!=="undefined"?LIGA_ACT.length:16));
  const dep=objs.find(o=>o.id==="dep");
  const vic=objs.find(o=>o.id==="vic");
  const cl=objs.find(o=>o.id==="clasico");
  if(div==="C" && dep){
    dep.t="Pelear la liguilla de ascenso";
    dep.meta=3;
    dep.detalle="Terminar entre los 3 primeros de tu zona ("+nZona+" clubes, 12 fechas).";
    dep.porque="En Segunda no hay Libertadores ni Copa Chile 2026. El premio es subir a la B.";
  }
  if(div==="C" && vic){
    const metaV=6;
    vic.meta=metaV; vic.t="Sumar "+metaV+" triunfos";
    vic.detalle="Ganar al menos "+metaV+" de las 12 fechas de zona.";
    vic.porque="Con 12 partidos no hay margen: hay que ganar, no administrar.";
  }
  if(div==="B" && vic && vic.meta>16){
    vic.meta=14; vic.t="Sumar 14 triunfos"; vic.detalle="Ganar al menos 14 de 30 fechas de la B.";
  }
  if(div==="C" && cl){
    cl.t="Ganar el clásico de zona";
    cl.detalle="Ganarle al rival de tu zona que más duele. Con uno basta.";
    cl.porque="En Segunda el clásico es el del pueblo. La gente no perdona fallarlo.";
  }
  objs.forEach(o=>{ o.hacer=comoHacerObjetivo(o); });
  return objs;
}
(function wrapObj74(){
  if(typeof generarObjetivos!=="function"||generarObjetivos._p74) return;
  const orig=generarObjetivos;
  generarObjetivos=function(){ return ajustarObjetivos74(orig()||[]); };
  generarObjetivos._p74=true;
  if(typeof expectativa==="function" && !expectativa._p74){
    const origE=expectativa;
    expectativa=function(){
      if(E&&E.eraBase==="2026c"){
        const p=(E.ind&&E.ind.prestigio)||50;
        return p>=55?{pos:3,txt:"pelear la liguilla de ascenso"}:{pos:5,txt:"no irse al fondo de la zona"};
      }
      return origE();
    };
    expectativa._p74=true;
  }
})();

/* ---- atiende: qué hacer, no solo el diagnóstico ---- */
(function wrapAtiende74(){
  if(typeof pendientesAtender!=="function"||pendientesAtender._p74) return;
  const orig=pendientesAtender;
  pendientesAtender=function(){
    const p=orig()||[];
    try{
      p.forEach(it=>{
        if(/Meta en riesgo/i.test(it.t||"")){
          const o=(E.objetivos||[]).find(x=>progresoObjetivo(x).estado==="riesgo");
          if(o){ it.d="«"+o.t+"» — "+(o.hacer||comoHacerObjetivo(o)); it.ir=irMeta74(o); }
        }
        if(/decisión/i.test(it.t||"")) it.d="En el escritorio, abajo: las urgentes van primero. Resolvelas antes del partido; si no, el club decide solo y casi nunca a tu favor.";
        if(/Química floja/i.test(it.t||"")) it.d="Andá a la pizarra (previa del partido) y juntá a los que se llevan: misma edad, mismos rasgos, dos ídolos de la casa. No pongas juntos a los que se pelean.";
        if(/Camarín cortado/i.test(it.t||"")) it.d="Charlá con el capitán (Redes), no armes un once de castigo, pagá sueldos si están atrasados (Finanzas) y ganá el próximo. Ganar cura casi todo.";
        if(/Sueldos atrasados/i.test(it.t||"")) it.d="Finanzas → regularizá la caja. Mientras debas sueldos, la moral cae sola cada semana. Vendé un prescindible o cortá gastos; no fichería.";
        if(/Popular clausurada/i.test(it.t||"")) it.d="Institución → mesa con la barra. Bajá el tono, cumplí un pacto chico, no los quemés en radio. El aforo vuelve cuando el clima baja.";
        if(/aviso/i.test(it.t||"")) it.d="Campana de avisos (arriba). Ofertas y pedidos caducan: si no respondés, el otro club se va.";
      });
      if(E&&E.ind&&E.ind.cantera<40 && !p.some(x=>/cantera/i.test(x.t||"")))
        p.push({ic:"🌱",t:"Cantera abandonada",d:"En Decisiones o Institución invertí un poco en formadores. Si no, los pibes se van al vecino.",ir:"institucion"});
    }catch(e){}
    return p;
  };
  pendientesAtender._p74=true;
})();
function irMeta74(o){
  if(!o) return "escritorio";
  if(o.tipo==="deuda"||o.tipo==="caja") return "finanzas";
  if(o.tipo==="grupo"||o.tipo==="directorio"||o.tipo==="hinchada") return "institucion";
  if(o.tipo==="pos"||o.tipo==="victorias"||o.tipo==="clasico"||o.tipo==="copaAvance") return "calendario";
  return "escritorio";
}

/* ---- ayudante: responde más y según la división ---- */
(function wrapAyuda74(){
  if(typeof preguntarAyudante!=="function"||preguntarAyudante._p74) return;
  const orig=preguntarAyudante;
  preguntarAyudante=function(q){
    const baja=(q||"").toLowerCase();
    const t=(...ws)=>ws.some(w=>baja.indexOf(w)>=0);
    if(t("domingo","sabado","sábado","esta fecha","el proximo","el próximo")){
      return orig("¿Cómo viene el rival?");
    }
    if(t("vendemos","vendo a","vender a","cedemos")){
      const h=huecoPlantel74();
      let r="Ventana abierta en ene-feb y jun-jul. ";
      if(h.length) r+="Corto de "+h.join(", ")+": si vendís, que no sea de ahí. ";
      r+="Un prescindible que no entra al once ordena más la caja que un préstamo más.";
      return r;
    }
    if(t("capitan","capitán","hablo con")){
      return orig("¿Y el camarín?");
    }
    if(t("directorio") && !t("estatuto")){
      const o=(E&&E.objetivos||[]).find(x=>typeof progresoObjetivo==="function"&&progresoObjetivo(x).estado==="riesgo")
        ||(E&&E.objetivos||[])[0];
      if(o) return "El directorio mira «"+o.t+"». "+comoHacerObjetivo(o);
    }
    if(t("libertadores","sudamericana","conmebol","copa libertadores")){
      if(_div74()==="C") return "En Segunda 2026 no hay Libertadores ni Copa Chile. El premio es subir a la B. Si querís ver quién manda en Primera, Calendario: pestaña Tablas.";
      if(_div74()==="B") return "La B no clasifica a Libertadores, salvo que ganes Copa Chile y subas. El 1° de la regular sube directo; 2°–8° van a liguilla.";
      if(_div74()==="ARG") return "Campeón de Apertura y de Clausura van a Libertadores. En el juego es una rueda de 29: terminá arriba. Copa Chile no se juega acá.";
      const enLib=typeof LIB_GRUPOS_2026_CHILE==="object"&&E&&LIB_GRUPOS_2026_CHILE[E.club];
      if(enLib) return "Este año ya tenís grupo de Libertadores (lo ganaste en 2025). El mandato ahora es pelear el nacional y no hacer el ridículo en el grupo. Calendario → CONMEBOL.";
      return "A Libertadores 2027 entran los de arriba de la tabla + el campeón de Copa de la Liga + repechaje de Copa Chile. Terminá entre los 4 o ganá la copa. El cupo 2026 ya está escrito.";
    }
    if(t("copa chile","copa de la liga","supercopa")){
      if(_div74()==="ARG") return "Estás en la Liga Profesional argentina. No hay Copa Chile. Calendario muestra la tabla de los 30.";
      if(_div74()==="C") return "Copa Chile 2026 no incluye Segunda (bases ANFP). Copa de la Liga es solo Primera. En el Calendario igual ves las tablas simuladas del país.";
      if(t("liga")) return "Copa de la Liga: solo Primera, 4 grupos, clasifica únicamente el 1°. El campeón es Chile 3 a Libertadores. No es Copa Chile.";
      return "Copa Chile: 8 grupos (Primera + B), clasifican 1° y 2°. El campeón va a repechaje Chile 4. Tus partidos los jugái vos; el resto del grupo se simula.";
    }
    if(t("segunda","zona","liguilla")){
      if(_div74()==="C") return "Tu zona son 7 clubes, 12 fechas. Top 3 a liguilla de título. El 1° de esa liguilla sube a la B. Abajo se huele Tercera. Cada punto vale doble.";
      return "Segunda se juega por zonas Norte/Sur. Si subís o bajás, el que llega brigido lo ves en Calendario → 2ª Norte/Sur.";
    }
    if(t("que hago","qué hago","como hago","cómo hago","meta","finanza","deuda","ordenar")){
      const o=(E&&E.objetivos||[]).find(x=>typeof progresoObjetivo==="function"&&progresoObjetivo(x).estado==="riesgo")
        ||(E&&E.objetivos||[])[0];
      if(o) return "La meta «"+o.t+"»: "+comoHacerObjetivo(o)+" Estado: "+((typeof progresoObjetivo==="function")?progresoObjetivo(o).txt:"—")+".";
    }
    if(t("poder","jugada","capital")){
      return "Las jugadas de poder no son un botón de suerte. Primero subí la credibilidad (cumplí promesas) y la aprobación del grupo que vas a tocar. Si la ANFP te odia, el lobby se te da vuelta. Si no te alcanza el capital, cambiá un estatuto chico o rindé cuentas al directorio para sumar. Cada jugada, una vez por año.";
    }
    if(t("estatuto","estatutos")){
      return "En Institución podís cambiar propiedad, modelo, identidad, barra, finanzas, ANFP, comunicación y edad del plantel. Cada cambio cuesta capital y molesta a quien pierde. La identidad es lo más caro: si comunidad y socios se te dan vuelta juntos, se parte el club.";
    }
    if(t("barra","mesa")){
      return "La mesa de la barra no es un slider. Pactái cosas (lienzos, viaje, no vender al ídolo, congelar popular) y si las rompés te cuelgan un lienzo y te silban. Reunite cada 4 fechas. Tres pactos en pie = caldera de local.";
    }
    if(t("mercado","fichar","ceder","cesion","cesión","prestamo","préstamo","vendemos","vender")){
      const h=huecoPlantel74();
      let r="Ventana abierta en ene-feb y jun-jul. ";
      if(h.length) r+="Te falta profundidad en "+h.join(", ")+". Ojear antes de comprar (sale barato y te dice el techo). ";
      r+="Las cesiones son para pibes ≤23: se foguean una temporada, el otro club les paga el sueldo, vuelven con más nivel. No cedái al que es titular.";
      return r;
    }
    if(t("calendario","tabla","pais","país","primera")){
      if(_div74()==="ARG") return "Calendario muestra la tabla de la Liga Profesional: 30 clubes, una rueda. Tus puntos + el resto de la fecha. No hay Copa Chile acá.";
      return "El Calendario tiene las tablas de todo el país: Primera, B, Segunda Norte/Sur, Copa Chile, Copa de la Liga y CONMEBOL. Aunque estés en Segunda ves quién manda arriba — misma física que tus partidos.";
    }
    const r=orig(q);
    if(t("informe")){
      const ins=(typeof cerebroLocal==="function")?cerebroLocal():[];
      if(ins.length) return ins.map(i=>i.t+" — "+i.d).join(" ");
    }
    return r;
  };
  preguntarAyudante._p74=true;
})();
(function wrapCerebro74(){
  if(typeof cerebroLocal!=="function"||cerebroLocal._p74) return;
  const orig=cerebroLocal;
  cerebroLocal=function(){
    const ins=orig()||[];
    try{
      if(E&&Array.isArray(E.objetivos)&&typeof progresoObjetivo==="function"){
        const r=E.objetivos.find(o=>progresoObjetivo(o).estado==="riesgo");
        if(r){
          const ya=ins.find(i=>i.cat==="objetivo");
          if(ya) ya.d=comoHacerObjetivo(r);
          else ins.unshift({cat:"objetivo",ic:"🎯",prio:8,t:"Meta en riesgo: "+r.t,d:comoHacerObjetivo(r)});
        }
      }
      if(_div74()==="C"){
        const k=(typeof _ligaKeyJugador==="function")?_ligaKeyJugador():null;
        const filas=(k && typeof mundoFilasLiga==="function")?mundoFilasLiga(k):[];
        const yo=filas.findIndex(f=>f.id===E.club);
        if(yo>=0) ins.push({cat:"partido",ic:"🗺️",prio:4,t:(yo+1)+"° en la zona · "+filas[yo].pts+" pts",d:"Top 3 a liguilla. Cada punto vale doble acá abajo."});
      }
      ins.sort((a,b)=>b.prio-a.prio);
    }catch(e){}
    return ins.slice(0,6);
  };
  cerebroLocal._p74=true;
})();
function chipsAyudante74(){
  const base=[
    _t74("chip_informe","Informe de la semana"),
    _t74("chip_domingo","¿El domingo?"),
    _t74("chip_rival","¿Cómo viene el rival?"),
    _t74("chip_plata","¿Cómo estamos de plata?"),
    _t74("chip_vende","¿Vendemos a alguien?"),
    _t74("chip_capitan","¿Hablo con el capitán?")
  ];
  if(E&&E.objetivos&&E.objetivos.some(o=>typeof progresoObjetivo==="function"&&progresoObjetivo(o).estado==="riesgo"))
    base.splice(1,0,_t74("chip_directorio","¿Y el directorio?"));
  return base;
}

/* ---- noticias tipo diario (mundo + club) ---- */
(function wrapTits74(){
  if(typeof titularesSemana!=="function"||titularesSemana._p74) return;
  const orig=titularesSemana;
  titularesSemana=function(){
    const out=orig()||[];
    try{
      if(typeof mundoNoticias==="function"){
        mundoNoticias().forEach(n=>{
          out.push({t:(n.tipo==="chiste"?"😄 ":"📰 ")+n.t, d:n.d, tipo:n.tipo});
        });
      }
      if(E&&E.ind&&E.ind.hinchada>=80) out.push({t:"😄 La gente ya canta tu nombre",d:"En el almacén del barrio te saludan por el apellido. Disfrutalo, que en Chile dura poco.",tipo:"chiste"});
      if(E&&E.deuda>2000) out.push({t:"📰 El banco llama otra vez",d:"La deuda no es un número en una planilla: es un tipo en traje que quiere fechas. Finanzas.",tipo:"imp"});
    }catch(e){}
    return out.slice(0,10);
  };
  titularesSemana._p74=true;
})();

/* ---- poder: requisitos, una vez al año, más jugadas ---- */
function enriquecerJugadas74(){
  if(typeof JUGADAS_PODER==="undefined") return;
  const extra=[
    {id:"rescate_sponsor",n:"Adelanto de sponsor",ic:"💼",costo:10,prob:0.38,reqGrupo:"sponsors",reqMin:8,
      desc:"Si la marca te banca, le pedís un adelanto de contrato. Si te odian, se ríen y se van.",
      como:"Subí sponsors (imagen limpia, no pelearte con la prensa) y después apretá. Credibilidad alta baja el riesgo.",
      bueno:{ef:{plata:120},grupos:{sponsors:-2},msg:"Llegó el adelanto. La marca te mira con lupa el resto del año."},
      malo:{grupos:{sponsors:-16},rep:{credibilidad:-4},msg:"La marca se bajó. Quedaste peor que antes."}},
    {id:"asamblea_expres",n:"Asamblea exprés",ic:"🗳️",costo:14,prob:0.42,reqGrupo:"socios",reqMin:0,
      desc:"Convocás a los socios para legitimar un cambio. Si te odian, te destituyen en vivo.",
      como:"Rindé cuentas antes (pasillos). Si los socios están en contra, NO hagas esta jugada.",
      bueno:{grupos:{socios:10,directorio:6},ef:{capital:8},msg:"La asamblea te bancó. Quedaste más fuerte adentro."},
      malo:{grupos:{socios:-18,directorio:-10},ef:{riesgo:6},msg:"Te silbaron. El directorio ya mira reemplazo."}},
    {id:"vitrina_cantera",n:"Vitrina de cantera",ic:"🌱",costo:8,prob:0.32,reqGrupo:"comunidad",reqMin:-10,
      desc:"Mandái a los pibes a un amistoso con cámaras. Si rinden, sube el prestigio; si no, parecen amateurs.",
      como:"Solo si la cantera está sobre 40. Si está en el piso, primero invertí en formadores.",
      bueno:{ef:{cantera:6,prestigio:3},grupos:{comunidad:8,hinchada:4},msg:"Los pibes se vieron bien. La gente se ilusionó."},
      malo:{ef:{cantera:-2},grupos:{prensa:-4},msg:"Se vio el lodazal. La radio se rió."}},
    {id:"pacto_prensa",n:"Desayuno con la prensa",ic:"🎙️",costo:6,prob:0.28,reqGrupo:"prensa",reqMin:-20,
      desc:"Los invitás, les das material, les pedís aire. Barato. Si te odian, igual sale el titular feo.",
      como:"Funciona cuando la prensa no está en pie de guerra. Off the record (pasillos) suma antes.",
      bueno:{grupos:{prensa:10},rep:{prensa:6},msg:"Salieron notas tibias a favor. Un respiro."},
      malo:{grupos:{prensa:-8},rep:{prensa:-4},msg:"Filtraron la conversación. Quedaste como calculador."}}
  ];
  extra.forEach(j=>{ if(!JUGADAS_PODER.some(x=>x.id===j.id)) JUGADAS_PODER.push(j); });
  const como={
    lobby_anfp:"Subí ANFP (estatuto 'Bloque' o votar con ellos) y la credibilidad. Si la ANFP te odia, el lobby se filtra y te sancionan.",
    golpe_camarin:"Solo con moral no tan rota y un referente de tu lado. Si el camarín está en guerra, esto explota.",
    sponsor_agresivo:"Sponsors sobre 0 y caja apurada. Si ya están molestos, no los exprimas: se van.",
    purga_directorio:"Directorio no puede estar en pie de guerra. Primero rindé cuentas, después corré a los que te hacen sombra.",
    presion_arbitral:"Credibilidad alta. Si ya te tildaron de tramposo, el pito te va a mirar con lupa."
  };
  JUGADAS_PODER.forEach(j=>{ if(!j.como && como[j.id]) j.como=como[j.id]; });
}
enriquecerJugadas74();
(function wrapPoder74(){
  if(typeof probMalaJugada!=="function"||probMalaJugada._p74) return;
  const orig=probMalaJugada;
  probMalaJugada=function(j){
    let p=orig(j);
    try{
      if(j.reqGrupo && E&&E.grupos&&E.grupos[j.reqGrupo]){
        const ap=E.grupos[j.reqGrupo].aprob;
        const min=j.reqMin!=null?j.reqMin:0;
        if(ap<min) p=clamp(p+0.22,0.15,0.9);
        else if(ap>=30) p=clamp(p-0.12,0.08,0.8);
      }
      if(E&&E.flags&&E.flags["poder_"+j.id+"_"+E.anio]) p=0.95;
    }catch(e){}
    return p;
  };
  probMalaJugada._p74=true;
  if(typeof hacerJugadaPoder==="function" && !hacerJugadaPoder._p74){
    const origH=hacerJugadaPoder;
    hacerJugadaPoder=function(j){
      if(E&&E.flags&&E.flags["poder_"+j.id+"_"+E.anio]){ aviso("Esa jugada ya la usaste este año. El club tiene memoria."); return; }
      if(j.reqGrupo && E&&E.grupos&&E.grupos[j.reqGrupo] && E.grupos[j.reqGrupo].aprob<(j.reqMin!=null?j.reqMin:-80)){
        if(!confirm("«"+j.n+"»: "+(GRUPO_POR_ID[j.reqGrupo]?GRUPO_POR_ID[j.reqGrupo].n:j.reqGrupo)+" no te banca. El riesgo de que salga mal es alto. ¿Igual?")) return;
      }
      const cap=E.capital;
      origH(j);
      if(E.capital<cap){ E.flags["poder_"+j.id+"_"+E.anio]=true; }
    };
    hacerJugadaPoder._p74=true;
  }
})();

/* ---- estatutos extra + interacciones extra ---- */
(function extraInstitucion74(){
  if(typeof ESTATUTOS==="undefined") return;
  if(!ESTATUTOS.some(c=>c.id==="comunicacion")){
    ESTATUTOS.push(
      {id:"comunicacion", n:"Política de comunicación", ic:"📢",
        op:[
          {id:"abierta",n:"Puertas abiertas",d:"La prensa entra cuando quiere. Transparencia, poco misterio.",ef:{prensa:12,directorio:-4},mod:{ingresoSponsor:0.04}},
          {id:"controlada",n:"Controlada",d:"Un vocero, un mensaje. Lo normal.",ef:{},mod:{}},
          {id:"silencio",n:"Silencio de radio",d:"Ni una declaración. Misterio o paranoia, según quién te lea.",ef:{prensa:-16,directorio:6},mod:{}},
          {id:"hinchada_primero",n:"Hablarle a la hinchada",d:"Redes y tribuna mandan el relato.",ef:{hinchada:12,prensa:-6},mod:{ingresoTaquilla:0.05}}
        ]},
      {id:"formacion", n:"Edad del plantel", ic:"👶",
        op:[
          {id:"jovenes",n:"Apuesta a jóvenes",d:"Titulares de 23 o menos. Barato, inestable.",ef:{camarin:-6,comunidad:8},mod:{cantera:0.2,gastoPlanilla:-0.1}},
          {id:"mixta",n:"Mixto",d:"Veteranos y pibes. El equilibrio.",ef:{},mod:{}},
          {id:"veteranos",n:"Experiencia primero",d:"Gente que ya vio de todo. Caro y corto de piernas.",ef:{camarin:8,directorio:4},mod:{gastoPlanilla:0.12}},
          {id:"extranjeros",n:"Cupo extranjero alto",d:"Se trae de afuera. La cantera se queja.",ef:{comunidad:-10,camarin:4},mod:{nivelFichajes:0.1}}
        ]}
    );
  }
  if(typeof ESTATUTO_INICIAL==="object"){
    Object.keys(ESTATUTO_INICIAL).forEach(id=>{
      const e=ESTATUTO_INICIAL[id];
      if(e && e.comunicacion==null) e.comunicacion="controlada";
      if(e && e.formacion==null) e.formacion="mixta";
    });
  }
  if(typeof INTERACCIONES!=="undefined"){
    const add=(g,op)=>{
      const gr=INTERACCIONES.find(x=>x.g===g);
      if(!gr) return;
      if(!gr.ops.some(x=>x.t===op.t)) gr.ops.push(op);
    };
    add("Barra brava",{t:"Pagarles el viaje al clásico",d:"Buses, entradas, trapos. Aliento asegurado; queda la cuenta.",plata:-80,grupos:{hinchada:12,prensa:-4},ef:{riesgo:5}});
    add("Barra brava",{t:"Cederles un palco simbólico",d:"Un gesto. Ellos bajan el tono un rato.",capital:-4,grupos:{hinchada:8,socios:-4}});
    add("Directorio",{t:"Pedir paciencia por escrito",d:"Un memo: 'el proyecto es de 18 meses'. Si perdés, queda como prueba en contra.",capital:-3,grupos:{directorio:6},flags:{pidioPaciencia:true}});
    add("Prensa",{t:"Filtrar una exclusiva a uno solo",d:"Un periodista amigo. Los demás se enojan.",grupos:{prensa:6},rep:{prensa:4,credibilidad:-2}});
    if(!INTERACCIONES.some(x=>x.g==="Camarín")){
      INTERACCIONES.push({g:"Camarín",ic:"👕",ops:[
        {t:"Asado con el plantel",d:"Un gesto barato que ordena el clima… o se va de las manos.",plata:-25,ef:{moral:5},grupos:{camarin:8}},
        {t:"Premio al que rinde",d:"Plata extra al que sumó. Los que no jugaron resongán.",plata:-40,ef:{moral:4},grupos:{camarin:4,directorio:-2}}
      ]});
    }
    if(!INTERACCIONES.some(x=>x.g==="Sponsors")){
      INTERACCIONES.push({g:"Sponsors",ic:"💼",ops:[
        {t:"Evento con la marca",d:"Los pibes con la camiseta nueva, fotos, discurso.",plata:-20,grupos:{sponsors:10,prensa:4}},
        {t:"Pedir un adelanto de contrato",d:"Plata ahora, tensión después.",grupos:{sponsors:-6},ef:{plata:80}}
      ]});
    }
  }
})();
function asegurarEstatutos74(){
  if(!E||!E.estatutos) return;
  if(E.estatutos.comunicacion==null) E.estatutos.comunicacion="controlada";
  if(E.estatutos.formacion==null) E.estatutos.formacion="mixta";
}

/* ---- barra: más pactos, más consecuencias ---- */
(function wrapBarra74(){
  if(typeof pactosBarra!=="function"||pactosBarra._p74) return;
  const orig=pactosBarra;
  pactosBarra=function(){
    const L=orig()||[];
    const extra=[
      {tipo:"precio", t:"Congelar el precio de la popular",
        d:"La popular no sube este año. Duele en caja, calienta la tribuna.",
        costo:0, ef:{}, grupos:{hinchada:10,directorio:-6,sponsors:-3}, resumen:"popular congelada"},
      {tipo:"canterano", t:"Un canterano de titular en el clásico",
        d:"Un pibe de la casa en el once del próximo partido grande. Si no lo cumplís, lienzo.",
        costo:0, ef:{}, grupos:{hinchada:8,tecnico:-6}, resumen:"canterano titular en el clásico"},
      {tipo:"silencio", t:"No quemar a la barra en radio",
        d:"Cero acusaciones públicas. Ellos bajan el tono, vos no los acusás.",
        costo:0, ef:{}, grupos:{hinchada:6,prensa:-4}, resumen:"no quemar a la barra en radio"}
    ];
    extra.forEach(o=>{ if(!L.some(x=>x.tipo===o.tipo)) L.push(o); });
    return L;
  };
  pactosBarra._p74=true;
})();

/* ---- mercado: huecos del plantel ---- */
function huecoPlantel74(){
  if(!E||!E.plantel) return [];
  const pos={ARQ:0,DEF:0,VOL:0,DEL:0};
  E.plantel.filter(j=>!j.vendido&&!j.cedido).forEach(j=>{ if(pos[j.pos]!=null) pos[j.pos]++; });
  const need=[];
  if(pos.ARQ<2) need.push("ARQ");
  if(pos.DEF<5) need.push("DEF");
  if(pos.VOL<5) need.push("VOL");
  if(pos.DEL<3) need.push("DEL");
  return need;
}

/* ---- UI wraps ---- */
function panelTitulo74(p){
  const s=p&&p.querySelector&&p.querySelector(".cab span:last-child");
  return s?s.textContent:"";
}
function pulirEscritorio74(){
  if(!E) return;
  $$("#vista .obj").forEach(box=>{
    if(box.querySelector(".obj-hacer")) return;
    const t=box.querySelector(".obj-t");
    const o=(E.objetivos||[]).find(x=>t&&x.t===t.textContent);
    if(!o) return;
    const h=comoHacerObjetivo(o);
    if(h) box.appendChild(el("div","obj-hacer","Cómo: "+h));
    try{ const pr=progresoObjetivo(o); if(pr&&pr.estado) box.classList.add(pr.estado); }catch(e){}
  });
  $$("#vista .panel").forEach(p=>{
    const tit=panelTitulo74(p);
    if(tit==="Decisiones sobre la mesa"){
      p.querySelectorAll(".op").forEach(b=>b.classList.add("dec-card"));
    }
    if(tit==="Lo que pasó esta semana"){
      p.querySelectorAll(".resul, .titular").forEach((n,i)=>{
        if(n.classList.contains("noticia")) return;
        n.classList.add("noticia");
        if(/goleada|manda|banco|deuda|clausur/i.test(n.textContent)) n.classList.add("imp");
        else if(/😄|canta|almacén|radio se rió/i.test(n.textContent)) n.classList.add("chiste");
        else if(/malo|silb|atras|crisis/i.test(n.textContent)) n.classList.add("malo");
        else n.classList.add("club");
      });
    }
    if(tit==="Ayudante"){
      const fichas=p.querySelector(".fichas");
      if(fichas && !fichas.dataset.p74){
        fichas.dataset.p74="1";
        fichas.innerHTML="";
        const inp=p.querySelector("input");
        chipsAyudante74().forEach(txt=>{
          const c=el("button","ficha",txt);
          c.onclick=()=>{ if(inp){ inp.value=txt; const ev=new KeyboardEvent("keydown",{key:"Enter",bubbles:true}); inp.dispatchEvent(ev); } };
          fichas.appendChild(c);
        });
      }
    }
  });
}
function pulirInstitucion74(){
  asegurarEstatutos74();
  $$("#vista .panel").forEach(p=>{
    const tit=panelTitulo74(p);
    if(tit==="Grupos de interés"){
      p.querySelectorAll(".cuerpo > div").forEach(d=>{
        if(d.classList.contains("grupo-card")) return;
        d.classList.add("grupo-card");
        const id=(GRUPOS||[]).find(g=>d.textContent.indexOf(g.n)>=0);
        if(id){
          const como={
            directorio:"Sube con puntos, caja sana y cumplir metas. Baja si prometés y no cumplís.",
            socios:"Sube escuchándolos (asamblea, estatuto club social). Baja con SAD o capital externo.",
            hinchada:"Sube ganando, entradas baratas y no vender ídolos. Mesa de la barra.",
            camarin:"Sueldos al día, once justo, asado de vez en cuando. Castigo = paro.",
            tecnico:"Autoridad y los refuerzos que pidió. Si lo desautorizás en radio, se va.",
            prensa:"Acceso y material. Cerrarles la puerta duele un mes.",
            anfp:"Votá con ellos o andate al bloque de provinciales. El lobby sin crédito se filtra.",
            sponsors:"Imagen limpia y audiencia. Exprimirlos con aprobación baja = se van.",
            comunidad:"Que el club siga siendo de los suyos. Identidad corporativa los parte."
          }[id.id];
          if(como && !d.querySelector(".como")) d.appendChild(el("div","como","Cómo moverlos: "+como));
        }
      });
    }
    if(tit==="Jugadas de poder"){
      p.querySelectorAll(".op").forEach(b=>{
        b.classList.add("jugada-op","dec-card");
        const j=(typeof JUGADAS_PODER!=="undefined")?JUGADAS_PODER.find(x=>b.textContent.indexOf(x.n)>=0):null;
        if(j&&j.como && !b.querySelector(".req")){
          const usado=E&&E.flags&&E.flags["poder_"+j.id+"_"+E.anio];
          const req=j.reqGrupo&&GRUPO_POR_ID[j.reqGrupo]?(" · grupo clave: "+GRUPO_POR_ID[j.reqGrupo].n):"";
          b.appendChild(el("div","req","Cómo se logra: "+j.como+req+(usado?" · ya la usaste este año":"")));
        }
      });
    }
  });
}
function pulirMercado74(){
  const need=huecoPlantel74();
  $$("#vista .panel").forEach(p=>{
    const tit=panelTitulo74(p);
    if(tit==="Objetivos en el mercado"){
      const c=p.cuerpo||p.querySelector(".cuerpo");
      if(c && !c.querySelector(".merc-need-cab")){
        const d=el("p","mini merc-need-cab");
        d.innerHTML=need.length
          ?"Objetivo = un jugador que el ojeador te marca esta semana. <b>Tu plantel está corto de "+need.join(", ")+"</b>: priorizá esos. Ojear cuesta poco y te dice si el techo vale la plata. Negociar no es apretar «comprar»: precio, sueldo y rol. A las 3 rondas se levantan."
          :"Objetivo = un jugador que el ojeador te marca esta semana. El plantel está cubierto; fichá solo si es un salto de nivel. Ojear antes. Negociar: precio + sueldo + rol.";
        c.insertBefore(d, c.firstChild&&c.firstChild.nextSibling);
      }
      p.querySelectorAll(".resul").forEach(n=>{
        n.classList.add("merc-card");
        if(need.length){
          const pos=need.find(x=>n.textContent.indexOf(x)>=0);
          if(pos && !n.querySelector(".merc-need")) n.appendChild(el("div","merc-need","Te falta profundidad acá ("+pos+")."));
        }
      });
    }
    if(tit==="Cesiones a préstamo"){
      const c=p.cuerpo||p.querySelector(".cuerpo");
      if(c && !c.querySelector(".merc-ces")){
        const d=el("p","mini merc-ces","Cesión = el pibe se va un año, el otro club le paga el sueldo, vuelve con más nivel y minutos. Sirve si no te entra en el once y tiene proyección. No cedás al titular ni al que es tu único ARQ.");
        if(c.firstChild) c.insertBefore(d, c.firstChild.nextSibling);
      }
    }
    if(tit==="Vender jugadores"){
      p.querySelectorAll(".resul").forEach(n=>n.classList.add("merc-card"));
    }
  });
}
function pulirAjustes74(){
  const v=$("#vista"); if(!v) return;
  if(v.querySelector(".aj-anim-74")) return;
  const p=panel("Animaciones del escritorio","✨");
  p.classList.add("aj-anim-74");
  p.cuerpo.appendChild(el("p","mini","Las tarjetas, las barras y las decisiones tienen un poco de vidrio Vista. Si te marea o el equipo es lento, apagalas. El modo liviano (arriba) también las corta."));
  const f=el("div","fichas");
  const off=document.body.classList.contains("anim-off");
  [[false,"Animaciones on"],[true,"Animaciones off"]].forEach(([on,n])=>{
    const b=el("button","ficha",n);
    b.setAttribute("aria-pressed",off===on?"true":"false");
    b.onclick=()=>{ document.body.classList.toggle("anim-off",on); Store.set("futbolini3_anim",on?"off":"on"); render(); };
    f.appendChild(b);
  });
  p.cuerpo.appendChild(f);
  const rend=v.querySelectorAll(".panel");
  if(rend.length>=2) v.insertBefore(p, rend[2]||null);
  else v.appendChild(p);
}

function pulirCalendario75(){
  const v=$("#vista"); if(!v||!E) return;
  const eraMundo=(typeof mundoEra2026==="function")?mundoEra2026():(E.anio>=2010);
  if(!eraMundo) return;
  $$("#vista .panel").forEach(p=>{
    const tit=panelTitulo74(p);
    if(/^Tabla de posiciones/.test(tit||"")) p.remove();
  });
  if(!E.mundo && typeof mundoInit==="function") mundoInit();
  if(typeof panelMundoCalendario!=="function") return;
  if(!v.querySelector(".mundo-wrap")) panelMundoCalendario(v);
  const wrap=v.querySelector(".mundo-wrap");
  if(!wrap) return;
  if(v.firstChild!==wrap) v.insertBefore(wrap, v.firstChild);
}

(function wrapUI74(){
  if(typeof vistaEscritorio==="function" && !vistaEscritorio._p74){
    const orig=vistaEscritorio;
    vistaEscritorio=function(){ orig.apply(this,arguments); try{ pulirEscritorio74(); }catch(e){} };
    vistaEscritorio._p74=true;
  }
  if(typeof vistaCalendario==="function" && !vistaCalendario._p74){
    const orig=vistaCalendario;
    vistaCalendario=function(){
      orig.apply(this,arguments);
      try{ pulirCalendario75(); }catch(e){}
    };
    vistaCalendario._p74=true;
  }
  if(typeof vistaInstitucion==="function" && !vistaInstitucion._p74){
    const orig=vistaInstitucion;
    vistaInstitucion=function(){ orig.apply(this,arguments); try{ pulirInstitucion74(); }catch(e){} };
    vistaInstitucion._p74=true;
  }
  if(typeof vistaMercado==="function" && !vistaMercado._p74){
    const orig=vistaMercado;
    vistaMercado=function(){ orig.apply(this,arguments); try{ pulirMercado74(); }catch(e){} };
    vistaMercado._p74=true;
  }
  if(typeof vistaAjustes==="function" && !vistaAjustes._p74){
    const orig=vistaAjustes;
    vistaAjustes=function(){ orig.apply(this,arguments); try{ pulirAjustes74(); }catch(e){} };
    vistaAjustes._p74=true;
  }
  if(typeof abrirDecision==="function" && !abrirDecision._p74){
    const orig=abrirDecision;
    abrirDecision=function(d,enModal){
      orig(d,enModal);
      try{ $$(".dec .ops .op").forEach(b=>b.classList.add("dec-card")); }catch(e){}
    };
    abrirDecision._p74=true;
  }
  if(typeof normalizarEstado==="function" && !normalizarEstado._p74){
    const orig=normalizarEstado;
    normalizarEstado=function(){ orig.apply(this,arguments); try{ asegurarEstatutos74(); }catch(e){} };
    normalizarEstado._p74=true;
  }
})();

/* animaciones: leer preferencia al boot */
(function bootAnim74(){
  try{
    if(typeof Store!=="undefined" && Store.get){
      Store.get("futbolini3_anim").then(function(v){ if(v==="off") document.body.classList.add("anim-off"); }).catch(function(){});
    }
  }catch(e){}
})();
