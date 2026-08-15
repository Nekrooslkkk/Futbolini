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

function postProc(autor,tipo,texto,tono){
  E.timeline=E.timeline||[];
  const part=typeof proximoPartido==="function"?proximoPartido():null;
  const likesBase=tipo==="prensa"?ri(80,2800):tipo==="club"?ri(200,4500):ri(5,1800);
  E.timeline.unshift({
    autor:autor, tipo:tipo, texto:texto, tono:tono||"neutro",
    fecha:(part&&part.f?fechaTxt(part.f):"hoy"), anio:E.anio,
    likes:likesBase
  });
  if(E.timeline.length>50) E.timeline.length=50;
}
function moverSeguidores(n){
  E.seguidores=Math.max(0,Math.round((E.seguidores||0)+n));
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
        postProc(elige(HANDLES_PRENSA),"prensa",
          "Goleada contundente: "+data.yo+"-"+data.otro+" ante "+rival+". El equipo se afirma en la tabla.",
          "bueno");
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
