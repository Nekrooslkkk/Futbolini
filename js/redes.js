"use strict";
/* ============================================================
   FUTBOLINI 4.0 · redes.js  (pulido narrativa)
   Ecosistema de redes PROCEDURAL estilo Twitter 2008.
   Hinchas, prensa y jugadores postean con más variedad y contexto.
   Se engancha con ia.js (posteos del DT) y mercado/partido.
   ============================================================ */

const HANDLES_HINCHA=[
  "@hincha_de_ley","@tribuna_norte","@fanatico_del_club","@alma_y_vida",
  "@barra_fiel","@socio_n1","@el_pueblo_manda","@cancha_llena","@sangre_alba",
  "@viejo_hincha","@pibe_de_la_popular","@siempre_presente"
];
const HANDLES_PRENSA=[
  "@DeporteTotal","@RadioGolAM","@ElBalonazo","@PelotaAlPiso",
  "@CronicaFC","@GolpeDeArco","@LaRojaDeportes","@FutbolChileHoy"
];

function handleJugador(){
  const j=elige((E.plantel||[]).filter(x=>!x.vendido&&!x.cedido));
  if(!j) return "@jugador_oficial";
  const ap=j.n.split(" ").pop().toLowerCase().replace(/[^a-zñ]/g,"");
  return "@"+ap+(ri(0,1)?"_of":"_oficial");
}
function handleClub(){
  const n=(E.clubNombre||"club").replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g,"");
  return "@"+n+"_oficial";
}
function cuentaPrensa(){
  E.cuentas=E.cuentas||{};
  HANDLES_PRENSA.forEach(h=>{ if(!E.cuentas[h]) E.cuentas[h]={linea:ri(-1,1)}; });
  const h=elige(HANDLES_PRENSA);
  return {h:h, linea:(E.cuentas[h]&&E.cuentas[h].linea)||0};
}

function uidPost(){ return "p"+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function postProc(autor,tipo,texto,tono,extra){
  E.timeline=E.timeline||[];
  const part=typeof proximoPartido==="function"?proximoPartido():null;
  const likesBase=tipo==="prensa"?ri(80,2800):tipo==="club"?ri(200,4500):tipo==="rival"?ri(40,900):ri(5,1800);
  const item={
    id:uidPost(),
    autor:autor, handle:autor, tipo:tipo, texto:texto, tono:tono||"neutro",
    fecha:(part&&part.f?fechaTxt(part.f):"hoy"), anio:E.anio,
    likes:likesBase, rts:ri(0,tipo==="prensa"?400:80), replies:0,
    hilo:[], menciones:[]
  };
  if(extra) Object.assign(item,extra);
  E.timeline.unshift(item);
  if(E.timeline.length>80) E.timeline.length=80;
  return item;
}
function tendencias(){
  const t=[];
  const part=typeof proximoPartido==="function"?proximoPartido():null;
  if(part) t.push({tag:"#"+String(part.rivalNombre||"rival").replace(/\s+/g,""), n:ri(1200,18000)});
  t.push({tag:"#"+(E.clubNombre||"Club").replace(/\s+/g,""), n:ri(3000,40000)});
  t.push({tag:"#LigaDePrimera", n:ri(8000,55000)});
  if(E.anio===1991) t.push({tag:"#Libertadores91", n:ri(2000,22000)});
  if((E.ind&&E.ind.moral)<45) t.push({tag:"#RenunciaYa", n:ri(900,9000)});
  t.push({tag:"#ANFP", n:ri(400,7000)});
  return t;
}
/* pools de tweets con sabor: aliento, calor de clásico y hostiles (para el auto-troleo) */
const TWEETS_HINCHA=[
  {x:"¡Vamos a ganarles, MADRES KLA! Esta la ganamos sí o sí 🔥",t:"bueno"},
  {x:"Si el equipo deja todo, nosotros dejamos la garganta. VAMOS.",t:"bueno"},
  {x:"Confío en el proceso. Paso a paso, pero para arriba.",t:"bueno"},
  {x:"Bancamos al DT hasta las últimas. El que se baja no es hincha.",t:"bueno"},
  {x:"Otra vez a llenar el estadio. Que sepan lo que es jugar acá.",t:"bueno"}
];
const TWEETS_HOSTIL=[
  {x:"Este DT no sabe ni formar el equipo. Que se vaya YA. 🤡",t:"malo"},
  {x:"Con esta dirigencia no llegamos a ningún lado. Vendehúmos.",t:"malo"},
  {x:"Los de la tele otra vez con los penales regalados. Vergüenza.",t:"malo"}
];
function sembrarRedes(){
  if(!E) return;
  E.timeline=E.timeline||[];
  if(E.timeline.length>8) return;
  const part=typeof proximoPartido==="function"?proximoPartido():null;
  const riv=part?part.rivalNombre:"el próximo";
  postProc(elige(HANDLES_PRENSA),"prensa",
    "Arranca la semana en "+(E.clubNombre||"el club")+". El entorno mira el plantel y la tabla.","neutro");
  const h1=elige(TWEETS_HINCHA);
  postProc(elige(HANDLES_HINCHA),"hincha", part?(h1.x):"Otro ciclo. A bancar, como siempre.", h1.t);
  postProc(handleJugador(),"jugador","Enfocados. El grupo está trabajando.","neutro");
  postProc("@hincha_rival","rival","Cuando vengan acá se van a enterar. No son el equipo de la tele.", "malo");
  /* un hostil interno para que el jugador aprenda a NO repostearlo */
  if(Math.random()<0.6){ const ho=elige(TWEETS_HOSTIL); postProc(elige(["@bancado_de_sillon","@el_verdadero_hincha","@critico_del_club"]),"hincha",ho.x,ho.t); }
  if(Math.random()<0.5){ const h2=elige(TWEETS_HINCHA); postProc(elige(HANDLES_HINCHA),"hincha",h2.x,h2.t); }
  if(part&&part.tipo==="copa") postProc(elige(HANDLES_PRENSA),"prensa","Copa de por medio. Un tropiezo y el año se pone cuesta arriba.","neutro");
}
function moverSeguidores(n){
  E.seguidores=Math.max(0,Math.round((E.seguidores||0)+n));
  if(E.seguidores>=1000000 && typeof desbloquear==="function") desbloquear("influencer");
}
/* 6.3 · tu usuario de PLOP (elegís cómo firmás; ya no "el cuerpo técnico") */
function handleDT(){
  if(E&&E.perfil&&E.perfil.plopUser) return E.perfil.plopUser;
  const base=String((E&&E.dt)||"DT").toLowerCase().replace(/[^a-z0-9ñ]/g,"").slice(0,15);
  return "@"+(base||"dt");
}
/* verificado: prensa y club vienen verificados; el resto se compra (E.plopVerif) */
function esVerificado(t){
  if(!t) return false;
  const h=(typeof t==="string")?t:t.autor;
  if(!(typeof t==="string") && (t.tipo==="prensa"||t.tipo==="club")) return true;
  return !!(E&&E.plopVerif&&E.plopVerif[h]);
}
/* 6.11 · convierte un recuerdo (2ª persona) en algo que la gente comenta (3ª persona) */
function memoriaEn3a(txt){
  let t=" "+txt;
  const map={ganaste:"ganó",perdiste:"perdió",goleaste:"goleó",vendiste:"vendió",prometiste:"prometió",
    saliste:"salió",levantaste:"levantó",reposteaste:"reposteó",moviste:"movió",forzaste:"forzó",
    metiste:"metió"};
  Object.keys(map).forEach(k=>{ t=t.replace(new RegExp("\\b"+k+"\\b","g"),map[k]); });
  t=t.replace(/\bte golearon\b/g,"lo golearon").replace(/\bte hiciste\b/g,"se hizo").replace(/\bte cobra\b/g,"le cobra");
  t=t.trim();
  return "el DT "+t;
}
/* un tweet que cita un hecho REAL de tu historia (memoria) */
function tweetDesdeMemoria(){
  if(typeof memoriaReciente!=="function") return null;
  const hechos=memoriaReciente(m=>(m.usado||0)<3, 8);
  if(!hechos.length) return null;
  const m=elige(hechos); m.usado=(m.usado||0)+1;
  const frase=memoriaEn3a(m.txt);
  if(m.tono==="bueno"){
    return postProc(elige(HANDLES_HINCHA),"hincha",elige([
      "Todavía me acuerdo cuando "+frase+". Grande 🙌",
      "El que dude que se acuerde: "+frase+" 💙",
      "Momentos que no se olvidan: "+frase+"."]),"bueno");
  }
  if(m.tono==="malo"||m.tono==="riesgo"){
    return postProc(elige(["@bancado_de_sillon","@el_verdadero_hincha","@memoria_de_hincha","@critico_del_club"]),"hincha",elige([
      "Nadie olvida que "+frase+". Ojo con eso 👀",
      "El hincha tiene memoria: "+frase+".",
      "Todavía duele que "+frase+"."]),"malo");
  }
  return postProc(elige(HANDLES_PRENSA),"prensa","Se sigue comentando que "+frase+".","neutro");
}
/* 6.19 · handle de hincha que depende del club */
function handleHinchaDeClub(){
  const m={CC:"@colocolino_dsiempre",UCH:"@chuncho_del_nacional",UC:"@cruzado_de_ley",
    COQ:"@pirata_coquimbo",EVE:"@ruletero_vina",PAL:"@arabe_tricolor",AUD:"@tano_dela_florida",
    HUA:"@acerero_talcahuano",OHI:"@celeste_rancagua",NUB:"@rojo_de_chillan",COB:"@minero_cobresal",
    CAL:"@cementero_calera",LSE:"@granate_serena",DCO:"@leon_del_collao",UDC:"@campanil_udec",LIM:"@tomatero_limache"};
  return (E&&m[E.club])||"@hincha_de_ley";
}
/* 6.19 · SOLO hechos que existen AHORA en el save (no un banco 2010) */
function actualidadRedes(){
  const a={ club:(E&&E.clubNombre)||"el club", anio:E&&E.anio, modo:E&&E.modo };
  const prox=(typeof proximoPartido==="function")?proximoPartido():null;
  if(prox){ a.rival=prox.rivalNombre; a.sede=prox.sede; a.local=prox.local; }
  const ult=(E&&E.idx>0)?E.calendario[E.idx-1]:null;
  if(ult&&ult.jugado){ a.ultRival=ult.rivalNombre; a.ultGF=ult.gf; a.ultGC=ult.gc; a.ultLocal=ult.local;
    if(ult.goleadores&&ult.goleadores.length) a.goleador=elige(ult.goleadores); }
  const vent=((E&&E.memoria)||[]).filter(m=>m.tipo==="venta"&&m.anio===E.anio&&(E.idx-(m.idx||0))<=2).pop();
  if(vent&&vent.quien) a.vendido=vent.quien;
  const les=((E&&E.plantel)||[]).filter(j=>!j.vendido&&j.lesion>0);
  if(les.length){ const l=elige(les); a.lesionado=l.n; a.lesionadoPos=l.pos; }
  if(E&&E.temporada&&E.temporada.pj>0&&typeof posicionEnTabla==="function"){ a.pos=posicionEnTabla(); a.pts=E.temporada.pts; a.fecha=E.temporada.pj; }
  if(E&&E.barra){ if(E.barra.roto) a.pactoRoto=true;
    else { const vig=(E.barra.pactos||[]).filter(p=>!p.roto); if(vig.length&&(E.idx-(vig[vig.length-1].idx||0))<=3) a.pacto=vig[vig.length-1].resumen; } }
  return a;
}
/* 6.19 · genera un tuit a partir de un hecho real; el fresco (venta/resultado/lesión) manda */
function tuitDesdeActualidad(){
  const a=actualidadRedes(), c=[];
  if(a.ultGF!=null){
    const m=a.ultGF+"-"+a.ultGC, viz=a.ultLocal?" en casa":" de visita";
    if(a.ultGF>a.ultGC) c.push({f:1,tono:"bueno",tipo:"hincha",x:elige([
      m+" a "+a.ultRival+viz+". Así da gusto 💪",
      "Ganamos "+m+" a "+a.ultRival+". "+(a.goleador?"Grande "+a.goleador+" 🔥":"A seguir.")])});
    else if(a.ultGF===a.ultGC) c.push({f:1,tono:"malo",tipo:"hincha",x:"Otro "+m+" con "+a.ultRival+". Nos falta gol, siempre lo mismo."});
    else c.push({f:1,tono:"malo",tipo:"hincha",x:elige([
      m+" con "+a.ultRival+(a.ultLocal?" y de local":", de visita")+". Así no se juega.",
      "Perder "+m+" con "+a.ultRival+"... esto ya cansa 😤"])});
  }
  if(a.vendido) c.push({f:1,tono:"malo",tipo:"hincha",x:elige([
    "Se va "+a.vendido+". Plata lista, el equipo más pobre. Gracias "+a.club+".",
    a.vendido+" afuera. ¿Con quién jugamos ahora? 🤦"])});
  if(a.lesionado) c.push({f:1,tono:"neutro",tipo:"hincha",x:a.lesionado+" no llega. ¿Y ahora quién juega de "+(a.lesionadoPos||"eso")+"?"});
  if(a.rival) c.push({f:0,tono:"neutro",tipo:"prensa",x:elige([
    "El finde es "+a.rival+" en "+a.sede+". "+(a.goleador?"Si no aparece "+a.goleador+", esto es otro 0-0.":"Partido bravo."),
    a.club+" va con "+a.rival+" en "+a.sede+". A ver con qué cara se planta."])});
  if(a.pts!=null) c.push({f:0,tono:"malo",tipo:"hincha",x:"Fecha "+a.fecha+", "+a.pts+" pts, "+ordinal(a.pos)+". Esto ya no es proyecto."});
  if(a.pactoRoto) c.push({f:1,tono:"malo",tipo:"hincha",x:"La mesa era clara y la rompieron. Con la barra no se juega. 🚩"});
  else if(a.pacto) c.push({f:1,tono:"neutro",tipo:"hincha",x:"La barra acordó "+a.pacto+". Ahora que la dirigencia cumpla."});
  if(!c.length) return null;
  const frescos=c.filter(x=>x.f), pool=(frescos.length&&Math.random()<0.75)?frescos:c;
  const pick=elige(pool);
  const handle=pick.tipo==="prensa"?elige(HANDLES_PRENSA):(Math.random()<0.5?handleHinchaDeClub():elige(HANDLES_HINCHA));
  /* anti-repetición: no repetir el texto del último post */
  if(E&&E.timeline&&E.timeline[0]&&E.timeline[0].texto===pick.x) return null;
  return postProc(handle, pick.tipo, pick.x, pick.tono);
}
/* un post de "bot" para que el feed se mueva solo, como Twitter */
function botPost(){
  const part=typeof proximoPartido==="function"?proximoPartido():null;
  const riv=part?part.rivalNombre:"el próximo rival";
  /* 6.19 · el hecho FRESCO del save manda (venta, resultado, lesión, previa, tabla) */
  const fresco=(typeof tuitDesdeActualidad==="function")?tuitDesdeActualidad():null;
  if(fresco) return fresco;
  /* memoria al 40% cuando no hay hecho fresco */
  if(Math.random()<0.4){ const m=tweetDesdeMemoria(); if(m) return m; }
  /* relleno estático (máx ~20%): solo si no hubo fresco ni memoria */
  const dados=[
    ()=>postProc(elige(HANDLES_HINCHA),"hincha",elige(TWEETS_HINCHA).x,"bueno"),
    ()=>postProc(elige(HANDLES_PRENSA),"prensa",elige([
        "Rumores de mercado en "+((E&&E.clubNombre)||"el club")+". Seguimos de cerca.",
        "El plantel entrena pensando en "+riv+".",
        "Se habla de cambios en la formación para el finde.",
        "La tabla aprieta y cada punto vale oro."]),"neutro"),
    ()=>postProc("@hincha_rival","rival",elige([
        "Los vamos a pasar por arriba 😎","Puro humo el rival de la fecha.","Acá se viene a sufrir, avisados están."]),"malo"),
    ()=>postProc(elige(HANDLES_HINCHA),"hincha",elige(TWEETS_HINCHA).x,"bueno"),
    ()=>{ const ho=elige(TWEETS_HOSTIL); return postProc(elige(["@bancado_de_sillon","@el_verdadero_hincha","@critico_del_club"]),"hincha",ho.x,"malo"); }
  ];
  return elige(dados)();
}

/* ---------- reacciones con contexto ---------- */
function redesReaccion(tipo,data){
  if(!E) return;
  data=data||{};

  if(tipo==="partido"){
    const dif=(data.yo||0)-(data.otro||0);
    const rival=data.rival||"el rival";
    if(dif>0){
      const frasesH=[
        "¡GRANDE! "+data.yo+"-"+data.otro+". Así se juega, con huevos 💪",
        "Victoria trabajada. El pueblo lo siente ❤️",
        "Le ganamos a "+rival+" y se notó la jerarquía. ¡ARRIBA!",
        "Tres puntos de oro. Ahora a pensar en el próximo.",
        "Esto es del club. Nadie regala nada y lo sacamos igual."
      ];
      postProc(elige(HANDLES_HINCHA),"hincha",elige(frasesH),"bueno");
      if(dif>=3){
        const pr=cuentaPrensa();
        postProc(pr.h,"prensa",
          pr.linea<0
            ?"Goleada "+data.yo+"-"+data.otro+" ante "+rival+". No se emocionen: esto no tapa el resto."
            :"Goleada contundente: "+data.yo+"-"+data.otro+" ante "+rival+". El equipo se afirma.",
          pr.linea<0?"neutro":"bueno");
        postProc(handleJugador(),"jugador",elige([
          "Feliz por el triunfo del grupo. Seguimos 👊",
          "Buen trabajo de todos. A disfrutar un rato y después a pensar en lo que viene."
        ]),"bueno");
      } else if(dif===1){
        postProc(elige(HANDLES_PRENSA),"prensa",
          "Victoria ajustada ante "+rival+" ("+data.yo+"-"+data.otro+"). Sufrió, pero sumó.",
          "neutro");
      }
      moverSeguidores(ri(180,1100)+dif*280);
    } else if(dif<0){
      const frasesM=[
        "Otra vez lo mismo... 😡 La gente se cansa.",
        "Así no, muchachos. Faltó actitud contra "+rival+".",
        "Un papelón. ¿Hasta cuándo vamos a bancar esto?",
        "Perdimos bien feo. El vestuario tiene que mirarse a la cara.",
        "La hinchada bancó y el equipo no respondió. Duele."
      ];
      postProc(elige(HANDLES_HINCHA),"hincha",elige(frasesM),"malo");
      postProc(elige(HANDLES_PRENSA),"prensa",
        "Derrota ante "+rival+" ("+data.otro+"-"+data.yo+") que enciende las alarmas en el entorno.",
        "malo");
      if(Math.abs(dif)>=3){
        postProc(elige(HANDLES_HINCHA),"hincha","Esto ya no es casualidad. Hay que cambiar algo ya.","malo");
      }
      moverSeguidores(-ri(120,900));
    } else {
      postProc(elige(HANDLES_HINCHA),"hincha",elige([
        "Empate tibio. Faltó profundidad.",
        "Un punto que sabe a poco. Había que ganar.",
        "Empatamos con "+rival+". Ni fu ni fa."
      ]),"neutro");
      moverSeguidores(ri(-80,220));
    }
    return;
  }

  if(tipo==="ficha"){
    postProc(elige(HANDLES_HINCHA),"hincha",elige([
      "¡Bienvenido "+data.n+"! Ojalá rompa todo 🙌",
      data.n+" llega con ganas. A bancarlo desde el primer día.",
      "Nuevo refuerzo: "+data.n+". Que se ponga la camiseta de verdad."
    ]),"bueno");
    postProc(handleJugador(),"jugador",elige([
      "Contento con la llegada de "+data.n+". Suma al grupo 👊",
      "Bienvenido al vestuario, "+data.n+". Acá se trabaja en serio."
    ]),"bueno");
    if(ri(0,1)){
      postProc(elige(HANDLES_PRENSA),"prensa",
        "El club oficializó a "+data.n+". Operación que apunta a reforzar el plantel de cara a lo que viene.",
        "neutro");
    }
    moverSeguidores(ri(280,1600));
    return;
  }

  if(tipo==="venta"){
    /* Variedad real: no siempre amurrado.
       data.flash = remate de urgencia
       data.ref   = ídolo/capitán
       data.edad / data.nivel opcionales
    */
    const n=data.n||"el jugador";
    const esFlash=!!data.flash;
    const esRef=!!data.ref;
    const roll=Math.random();

    if(esFlash){
      // remate: casi siempre malo, pero con matices
      if(esRef){
        postProc(elige(HANDLES_HINCHA),"hincha",elige([
          "¿Cómo van a rematar así a "+n+"?? Vergüenza dirigencial 🤬",
          "Vender a un referente de urgencia es no entender nada del club.",
          n+" se va por dos mangos. La historia no lo va a olvidar."
        ]),"malo");
        moverSeguidores(-ri(500,1800));
      } else {
        postProc(elige(HANDLES_HINCHA),"hincha",elige([
          "Remate de "+n+". Plata rápida, pero se nota el apuro.",
          "Se fue "+n+" a precio de liquidación. Ojalá sirva para ordenar la casa."
        ]),"malo");
        postProc(elige(HANDLES_PRENSA),"prensa",
          n+" salió en operación de urgencia. El club priorizó caja por sobre valor de mercado.",
          "neutro");
        moverSeguidores(-ri(150,700));
      }
    } else if(esRef){
      // referente vendido "bien": reacción mixta
      if(roll<0.45){
        postProc(elige(HANDLES_HINCHA),"hincha",elige([
          "Se va "+n+". Duele, pero si la plata es seria y el club se fortalece, se entiende.",
          n+" dio todo. Ojalá le vaya bien... y que el club no se equivoque con el reemplazo."
        ]),"neutro");
        postProc(elige(HANDLES_PRENSA),"prensa",
          "Salida de un referente: "+n+" cambia de club. Operación que genera debate en el entorno.",
          "neutro");
        moverSeguidores(-ri(200,900));
      } else {
        postProc(elige(HANDLES_HINCHA),"hincha",elige([
          "No puedo creer que dejen ir a "+n+". Esto es una traición a la historia del club.",
          "Primero los ídolos, después los dirigentes. Así siempre."
        ]),"malo");
        moverSeguidores(-ri(400,1400));
      }
    } else {
      // jugador normal: mayoría neutra/positiva de caja
      if(roll<0.55){
        postProc(elige(HANDLES_PRENSA),"prensa",
          n+" deja el club. Operación que ayuda a la caja y abre espacio en el plantel.",
          "neutro");
        if(ri(0,1)){
          postProc(elige(HANDLES_HINCHA),"hincha",elige([
            "Se fue "+n+". No era intocable. A mirar para adelante.",
            "Buena venta si la plata vuelve al plantel. Hay que ser fríos a veces."
          ]),"neutro");
        }
        moverSeguidores(ri(-80,350));
      } else if(roll<0.8){
        postProc(elige(HANDLES_HINCHA),"hincha",
          "Se va "+n+". Ojalá el club sepa reinvertir, porque si no es más de lo mismo.",
          "neutro");
        moverSeguidores(ri(-150,200));
      } else {
        postProc(elige(HANDLES_HINCHA),"hincha",
          "Otra salida más. El plantel se desarma y después nos piden paciencia.",
          "malo");
        moverSeguidores(-ri(100,500));
      }
    }
    return;
  }

  if(tipo==="precio"){
    if(data.ratio>1.35){
      postProc(elige(HANDLES_HINCHA),"hincha",elige([
        "Suben las entradas otra vez y el fútbol lo paga el hincha de siempre 😤",
        "Precios de marquesina para un equipo que todavía no demuestra. Así no se llena."
      ]),"malo");
      moverSeguidores(-ri(60,320));
    } else if(data.ratio<0.82){
      postProc(elige(HANDLES_HINCHA),"hincha",elige([
        "Entradas populares, así se llena la cancha 👏",
        "Buen gesto de la dirigencia con los precios. El pueblo responde."
      ]),"bueno");
      moverSeguidores(ri(120,550));
    }
    return;
  }
}

/* campañas del Community Manager (requiere E.staff.cm) */
function campanaCM(tipo){
  if(!E.staff||!E.staff.cm){
    if(typeof aviso==="function") aviso("Primero contratá un Community Manager (Finanzas)");
    return;
  }
  if(tipo==="humo"){
    aplicarEfectos({hinchada:6,moral:2});
    aplicarRep({credibilidad:-3});
    moverSeguidores(ri(600,2600));
    postProc(handleClub(),"club",elige([
      "El club más grande. Vamos por todo, familia.",
      "Historia, gloria y futuro. Esto es "+(E.clubNombre||"el club")+" 💪",
      "Nadie nos calla. Orgullo de vestir estos colores."
    ]),"bueno");
    notificar({t:"Campaña de humo",tipo:"neutro",
      d:"El CM encendió a la gente (+hinchada, +seguidores) a costa de algo de credibilidad si después no acompañan los resultados.",
      bandeja:false});
  } else {
    aplicarRep({credibilidad:6,publica:2});
    aplicarGrupos({prensa:5});
    moverSeguidores(ri(-100,300));
    postProc(handleClub(),"club",
      "Comunicado oficial: el club informa con transparencia sobre su situación institucional.",
      "neutro");
    notificar({t:"Comunicado oficial",tipo:"neutro",
      d:"El CM emitió un comunicado serio: suma credibilidad y ordena el mensaje.",
      bandeja:false});
  }
  guardar();
}

/* ingreso anual por seguidores (sponsor digital), solo si hay CM */
function ingresoDigital(){
  return (E.staff&&E.staff.cm)?Math.round((E.seguidores||0)*0.02):0;
}

/* ============================================================
   5.0 · Bloque 3 — Ticker EN VIVO durante el partido (FutbolGram)
   Se llama por cada tick del partido; empuja posts cortos a
   P.ticker (feed local del partido). No toca E.timeline.
   ============================================================ */
function tickerPost(P, ev){
  if(!P || !ev) return;
  P.ticker=P.ticker||[];
  const m=ev.min||P.min||0;
  const club=(typeof E!=="undefined"&&E.clubNombre)?E.clubNombre:"el club";
  const rival=(P.part&&P.part.rivalNombre)||"el rival";
  let autor=elige(HANDLES_HINCHA), texto=null, tono="neutro";
  switch(ev.tipo){
    case "gol":
      autor=elige(HANDLES_HINCHA); tono="bueno";
      texto=elige(["¡GOOOOL NUESTRO! "+m+"' 🔥🔥","¡LA METIÓ! "+m+"', vamos carajo 💪","Golazo. Se grita con todo, "+m+"' ⚽","¡ARRIBA! "+m+"' pura garra ❤️"]); break;
    case "golRival":
      autor=elige(HANDLES_HINCHA); tono="malo";
      texto=elige(["Nos hicieron gol... "+m+"' 😩","Uh no, gol del rival. A despertar, "+m+"'.","Otra vez mal parados atrás, "+m+"' 😡","Gol de "+rival+". Duele, "+m+"'."]); break;
    case "penal":
      autor=elige(HANDLES_PRENSA); tono="bueno";
      texto="🚨 ¡PENAL para "+club+" en el "+m+"'! El VAR lo mira con lupa…"; break;
    case "penalRival":
      autor=elige(HANDLES_PRENSA); tono="malo";
      texto="🚨 Penal en contra, "+m+"'. Polémico: la banca protesta y las redes explotan."; break;
    case "tiroLibre":
      autor=elige(HANDLES_HINCHA); tono="neutro";
      texto="Tiro libre peligrosísimo, "+m+"'. A meterla de una 🙏"; break;
    case "tarjeta":
      autor=elige(HANDLES_PRENSA); tono="neutro";
      texto="🟨 Amarilla en el "+m+"'. Ojo con la próxima."; break;
    case "lesion":
      autor=elige(HANDLES_HINCHA); tono="malo";
      texto="Uno quedó tirado en el "+m+"'… ojalá no sea grave 🤕"; break;
    case "chance":
      if(Math.random()<0.45){ autor=elige(HANDLES_HINCHA); texto="¡UHHH la que se perdió! "+m+"' 😱"; tono="neutro"; }
      break;
    case "polemica":
      autor=elige(HANDLES_PRENSA); texto="📺 Repiten la jugada del "+m+"'… el árbitro ya es tendencia."; tono="neutro"; break;
    default: return;
  }
  if(!texto) return;
  P.ticker.unshift({m:m, autor:autor, texto:texto, tono:tono});
  if(P.ticker.length>18) P.ticker.length=18;
}
