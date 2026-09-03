"use strict";
/* ============================================================
   FUTBOLINI · plop-motor.js  (7.13 · Plop! con vida)
   Motor GENERATIVO procedural: en vez de elegir 1 de un pool fijo, ARMA la
   frase con el estado REAL del partido (marcador, minuto, goleador, rival,
   racha, posición). Cada cuenta tiene PERSONALIDAD y el conjunto tiene MEMORIA.
   No reemplaza los tuits aprobados: se mezcla con ellos (a veces canned,
   a veces generado) envolviendo `tuitDeCtx`. Cargar ÚLTIMO (después de data-tuits).
   ============================================================ */

/* ---------- personalidad por cuenta (voz) ---------- */
const PLOP_PERSONAS={
  "@barra_del_sur":{voz:"exaltado"}, "@pibe_popular23":{voz:"exaltado"}, "@albo_insomne":{voz:"exaltado"},
  "@cuenta_troll":{voz:"ironico"}, "@garrafal_cl":{voz:"ironico"}, "@el_del_tercer_tiempo":{voz:"ironico"},
  "@dona_del_canal13":{voz:"tierno"}, "@tia_del_grupo":{voz:"tierno"},
  "@datofutbol_cl":{voz:"dato"},
  "@RadioGolAM":{voz:"serio"}, "@DeporteTotal":{voz:"serio"},
  "@weon_del_metro":{voz:"cotidiano"},
  "@socio_enojado":{voz:"amargado"}, "@viejo_del_bar":{voz:"amargado"},
  "@hincha_rival_xd":{voz:"rival"},
  "@dt_de_living":{voz:"analitico"}
};
const PLOP_POR_VOZ=(function(){ const m={}; Object.keys(PLOP_PERSONAS).forEach(function(h){ const v=PLOP_PERSONAS[h].voz; (m[v]=m[v]||[]).push(h); }); return m; })();

/* ---------- banco de fragmentos ---------- */
const FR={
  wn:["wn","weon","hermano","po","cabros","loco",""],
  grito:["ME MUERO","NO PUEDO CREERLO","ESTO ES TODO","NO DA EL CORAZÓN","ME QUIERO MORIR","QUÉ LOCURA"],
  emoB:["🔥","🐐","🎉","😭","💪","🙌","👑"],
  emoM:["😔","🤡","😡","💀","🫠","😭"],
  emoN:["👀","🤔","🫣","😅","📉","📈"],
  glVerbo:["la clavó","la reventó","apareció","la mandó a guardar","definió como los dioses","no perdonó"],
  fome:["fome","penca","para el olvido","de trámite","gris"],
  senora:["ay hijito","ay por dios","mijito lindo","ave maría","ay no"],
};
function P1(a){ return (typeof elige==="function")?elige(a):a[Math.floor(Math.random()*a.length)]; }
function limpiaEsp(s){ return String(s).replace(/\s{2,}/g," ").replace(/\s+([.,!?])/g,"$1").trim(); }

/* ---------- estado real (del partido en curso y del club) ---------- */
function plopEstado(){
  const P=(typeof P_ACTUAL!=="undefined")?P_ACTUAL:null;
  const Eg=(typeof E!=="undefined"&&E)?E:{};
  let yo=0,ot=0,min=0;
  if(P){
    const mm=(typeof miMarcador==="function")?miMarcador(P):[P.gl||0,P.gv||0];
    yo=mm[0]||0; ot=mm[1]||0; min=P.min||0;
  }
  const tok=function(k){ return (typeof resolverTokens==="function"&&Eg.plantel)?resolverTokens("{"+k+"}",Eg):null; };
  const rival=(P&&P.part&&P.part.rivalNombre)||((typeof proximoPartido==="function"&&proximoPartido()&&proximoPartido().rivalNombre))||"el rival";
  return {
    yo:yo, ot:ot, min:min, extra:Math.max(0,min-90),
    marcador:yo+"-"+ot, marcadorInv:ot+"-"+yo,
    goleador:tok("GOLEADOR")||"el 9", figura:tok("FIGURA")||"el 10",
    arquero:tok("ARQUERO")||"el 1", capitan:tok("CAPITAN")||"el capi", dt:(Eg.dt||"el DT"),
    rival:rival, club:(Eg.clubNombre||"el club"),
    pos:(typeof posicionEnTabla==="function")?posicionEnTabla():0,
    sinPerder:(Eg.temporada&&Eg.temporada.sinPerder)||0,
    local:!(P&&P.part&&P.part.local===false)
  };
}

/* ---------- memoria del conjunto ---------- */
function plopMem(){
  if(typeof E==="undefined"||!E) return {humor:60,hist:[]};
  if(!E.plop) E.plop={humor:60, hist:[], obsesion:null};
  return E.plop;
}
function plopRecuerda(txt){ const m=plopMem(); m.hist.unshift(txt); if(m.hist.length>10) m.hist.length=10; }

/* ---------- GRAMÁTICA: una frase por contexto, según voz y estado ---------- */
/* cada generador devuelve string final (sin tokens {}) usando el estado real */
const PLOP_GRAM={
  gana_agonico:function(v,s){
    if(v==="exaltado") return P1([s.min+"'"+(s.extra?"+"+s.extra:"")+" y "+s.goleador+" "+P1(FR.glVerbo)+" "+P1(FR.wn)+". "+P1(FR.grito)+" "+P1(FR.emoB),
      "GANAMOS "+s.marcador+" SOBRE LA HORA "+P1(FR.wn)+". "+P1(FR.grito)+" "+P1(FR.emoB)]);
    if(v==="tierno") return P1([P1(FR.senora)+" casi me da algo, "+s.goleador+" la metió al final. "+P1(FR.emoB),
      P1(FR.senora)+" ganamos "+s.marcador+" en el descuento. gracias diosito"]);
    if(v==="ironico") return P1([s.rival+" ya festejaba el empate y "+s.goleador+" al "+s.min+"'. ksksks",
      "el "+s.min+"' es el mejor minuto del año. "+s.marcador+" y a la casa "+P1(FR.emoN)]);
    if(v==="dato") return "gol al "+s.min+"'"+(s.extra?"+"+s.extra:"")+". "+s.goleador+" define y quedamos "+s.marcador+". "+(s.pos?s.pos+"° en la tabla.":"");
    if(v==="cotidiano") return "grité el gol del "+s.min+"' en la micro y la gente me miró raro. "+s.marcador+" igual "+P1(FR.emoB);
    return s.club+" gana "+s.marcador+" con gol sobre la hora de "+s.goleador+". Tres puntos de oro.";
  },
  pierde_local:function(v,s){
    if(v==="exaltado") return P1(["EN CASA "+P1(FR.wn)+". PERDIMOS "+s.marcadorInv+" EN CASA. "+P1(FR.emoM),
      "no puede ser "+P1(FR.wn)+", "+s.marcadorInv+" de local contra "+s.rival+". "+P1(FR.emoM)]);
    if(v==="amargado") return P1(["pagué la entrada pa ver "+s.marcadorInv+" contra "+s.rival+". esto ya es identidad "+P1(FR.emoM),
      "de local y "+P1(FR.fome)+". el "+s.pos+"° puesto no miente."]);
    if(v==="ironico") return "el estadio más lindo y el fútbol más "+P1(FR.fome)+". "+s.marcadorInv+" contra "+s.rival+". coherencia.";
    if(v==="tierno") return P1(FR.senora)+" qué vergüenza, "+s.marcadorInv+" en casa. ni pa la once quedé con ánimo.";
    if(v==="rival") return "vengo de visita y me llevo los 3. gracias por la casa "+P1(FR.wn)+" 😌";
    if(v==="dato") return s.marcadorInv+" de local ante "+s.rival+". los caemos al "+s.pos+"° de la tabla.";
    return s.club+" cae "+s.marcadorInv+" en casa ante "+s.rival+". Pocas ideas, el entorno pide respuestas.";
  },
  hat_trick:function(v,s){
    if(v==="exaltado") return "TRES DE "+s.goleador.toUpperCase()+" "+P1(FR.wn)+". ANDATE A EUROPA YA "+P1(FR.emoB);
    if(v==="dato") return "hat-trick de "+s.goleador+". quedamos "+s.marcador+", el 9 se destapó.";
    if(v==="ironico") return "el arquero de "+s.rival+" ya pidió cambio de carrera. "+s.goleador+" le hizo tres. ksks";
    if(v==="tierno") return P1(FR.senora)+" ese cabro "+s.goleador+" tiene ángel, tres goles y saluda a la cámara.";
    if(v==="serio") return "Noche histórica de "+s.goleador+": tres goles y "+s.club+" arriba "+s.marcador+".";
    return s.goleador+" está en modo dios "+P1(FR.wn)+", tres goles "+P1(FR.emoB);
  },
  goleada_favor:function(v,s){
    if(v==="exaltado") return s.marcador+" y quiero más "+P1(FR.wn)+". QUE LO ESCUCHE TODO CHILE "+P1(FR.emoB);
    if(v==="ironico") return "apaguen esto por piedad, "+s.marcadorInv+" abajo "+s.rival+" ya es contenido pa tiktok.";
    if(v==="dato") return s.marcador+" ante "+s.rival+". dominio total, "+s.figura+" bailando.";
    if(v==="tierno") return P1(FR.senora)+" qué lindo cuando ganan fácil, "+s.marcador+" y hasta el té sabe mejor.";
    return "Goleada "+s.marcador+". "+s.figura+" se paseó y "+s.club+" ordena la tabla.";
  },
  remontada:function(v,s){
    if(v==="exaltado") return "ÍBAMOS ABAJO Y LO DIMOS VUELTA "+P1(FR.wn)+". "+s.marcador+". YO NO TENGO CORAZÓN YA "+P1(FR.emoB);
    if(v==="ironico") return s.rival+" celebró como si fuera final. spoiler: "+s.marcador+". somos chile "+P1(FR.emoN);
    if(v==="dato") return "abajo en el marcador y terminamos "+s.marcador+". remontada de las que no se explican.";
    if(v==="tierno") return P1(FR.senora)+" yo ya había apagado la tele, "+s.figura+" nos salvó. qué susto más rico.";
    return "Carácter: "+s.club+" lo dio vuelta y quedó "+s.marcador+" ante "+s.rival+".";
  },
  clasico_gana:function(v,s){
    if(v==="exaltado") return "CLÁSICO NUESTRO "+P1(FR.wn)+". DÍGANLO EN VOZ ALTA. "+s.marcador+" "+P1(FR.emoB);
    if(v==="ironico") return "les ganamos el clásico "+s.marcador+" y ahora son filósofos en Plop!. ksks";
    if(v==="tierno") return P1(FR.senora)+" el vecino del "+s.rival+" no va a salir a barrer mañana.";
    if(v==="dato") return "clásico ganado "+s.marcador+" a "+s.rival+". "+s.figura+" el diferencial.";
    return "El clásico se queda en casa. "+s.figura+" fue figura, "+s.marcador+" ante "+s.rival+".";
  },
  arquero_figura:function(v,s){
    if(v==="exaltado") return s.arquero+" ATAJÓ TODO "+P1(FR.wn)+". ES UN MURO "+P1(FR.emoB);
    if(v==="dato") return s.arquero+": partidazo. valla en cero y el marcador quedó "+s.marcador+".";
    if(v==="ironico") return "propongo que "+s.arquero+" pague menos entrada. él es el espectáculo, atajó hasta con la cara.";
    if(v==="tierno") return P1(FR.senora)+" ese "+s.arquero+" tiene las manos benditas.";
    return "Figura del partido: "+s.arquero+". Sostuvo el "+s.marcador+".";
  },
  empate_pobre:function(v,s){
    if(v==="amargado") return "0-0 que sabe a derrota contra "+s.rival+". agua tibia, nada "+P1(FR.emoM);
    if(v==="ironico") return "el partido más beige del año. 0-0 con "+s.rival+", el único peligro fue un córner.";
    if(v==="dato") return "0-0 ante "+s.rival+". xG total pa la risa. no pasó nada, literal.";
    if(v==="exaltado") return "ABURRIDO "+P1(FR.wn)+". 0-0. ME QUIERO IR A DORMIR "+P1(FR.emoM);
    return "Reparto de puntos sin goles ante "+s.rival+". Poco fútbol.";
  },
  gol_anulado_var:function(v,s){
    if(v==="exaltado") return "EL VAR NOS ROBÓ "+P1(FR.wn)+". "+s.goleador+" lo hizo todo bien y el software no "+P1(FR.emoM);
    if(v==="ironico") return "offside de la uña del meñique de "+s.goleador+". tecnología de punta contra nosotros.";
    if(v==="dato") return "gol anulado a "+s.goleador+" por posición adelantada. margen milimétrico.";
    if(v==="amargado") return "siempre el VAR contra "+s.club+". siempre. teoría no tan teoría.";
    return "El VAR anula el tanto de "+s.goleador+". Duele, pero corrige.";
  },
  penal_errado:function(v,s){
    if(v==="exaltado") return "SE LA MANDÓ A LA LUNA "+P1(FR.wn)+". EL PENAL. "+P1(FR.grito)+" "+P1(FR.emoM);
    if(v==="ironico") return "lo tiró tan al medio que el arquero de "+s.rival+" alcanzó a tomarse un café. SKKS";
    if(v==="dato") return s.goleador+" erra el penal. el arco de "+s.rival+" sigue en cero.";
    if(v==="amargado") return "un penal no se falla hermano. la wea "+P1(FR.fome)+".";
    return s.goleador+" desperdicia la pena máxima. Oportunidad clave que se esfuma.";
  },
  expulsion:function(v,s){
    if(v==="exaltado") return "ROJA "+P1(FR.wn)+". SE FUE. quedamos con 10 contra "+s.rival+" "+P1(FR.emoM);
    if(v==="ironico") return "tarjeta roja speedrun any%. se la buscó solito el "+P1(FR.wn)+".";
    if(v==="dato") return "expulsión temprana. "+s.club+" jugará con uno menos ante "+s.rival+".";
    if(v==="tierno") return P1(FR.senora)+" ese niño necesita una cachetada de la mamá, no del árbitro.";
    return "Roja directa. El partido se le complica a "+s.club+" ante "+s.rival+".";
  },
  autogol:function(v,s){
    if(v==="exaltado") return "AUTOGOL DEL NUESTRO "+P1(FR.wn)+". "+P1(FR.grito)+" "+P1(FR.emoM);
    if(v==="ironico") return "el único que definió con precisión hoy fue el defensa. al arco propio. crack.";
    if(v==="dato") return "autogol en contra ante "+s.rival+". error defensivo grave, quedamos "+s.marcador+".";
    if(v==="rival") return "ni lo pedimos y nos lo regalaron envuelto. gracias caballero 🎁";
    return "Tanto en contra tras error propio. El partido se inclina para "+s.rival+".";
  },
  invicto:function(v,s){
    if(v==="dato") return s.sinPerder+" partidos sin perder. "+s.club+" alarga el invicto y suma en la tabla.";
    if(v==="exaltado") return "SEGUIMOS SIN PERDER "+P1(FR.wn)+". que lo griten en la calle "+P1(FR.emoB);
    if(v==="amargado") return "invicto y igual a veces jugamos pa atrás. el "+s.pos+"° no se regala igual.";
    return "Se mantiene el invicto de "+s.club+". "+s.figura+" otra vez entre los destacados.";
  },
  descenso_peligro:function(v,s){
    if(v==="amargado") return "abajo otra vez. "+s.pos+"° en la tabla. esto no es juego "+P1(FR.emoM);
    if(v==="tierno") return P1(FR.senora)+" ya no duermo los sábados con "+s.club+". esto pone vieja a una.";
    if(v==="dato") return s.club+" "+s.pos+"° y en zona de riesgo. cada punto es oxígeno ahora.";
    if(v==="ironico") return "la tabla de abajo nos tiene de foto de perfil. íntimo con el descenso.";
    return s.club+" sigue en zona de descenso. El calendario no perdona.";
  },
  rumor_fichaje:function(v,s){
    if(v==="exaltado") return "SI LLEGA ESE REFUERZO A "+s.club.toUpperCase()+" ARMO LA FIESTA "+P1(FR.emoB);
    if(v==="ironico") return "lo dieron por firmado en 4 cuentas. o sea está más lejos que nunca.";
    if(v==="dato") return "el presunto refuerzo de "+s.club+" tiene números interesantes. por ahora, humo.";
    if(v==="amargado") return "si es verdad que pongan la plata. si es mentira que dejen de vender humo.";
    return s.club+" evalúa un refuerzo. El club no confirma ni desmiente.";
  }
};

/* ---------- generar un tuit del contexto, con estado real ---------- */
function plopVocesPara(ctx){
  const tono=(typeof tonoDeCtx==="function")?tonoDeCtx(ctx):"neutro";
  let voces;
  if(tono==="bueno") voces=["exaltado","tierno","dato","serio","cotidiano"];
  else if(tono==="malo") voces=["amargado","ironico","rival","exaltado","tierno","serio"];
  else voces=["ironico","dato","amargado","cotidiano","analitico","serio","tierno"];
  return voces;
}
function generarPlop(ctx){
  try{
    const gen=PLOP_GRAM[ctx]; if(!gen) return null;
    const s=plopEstado();
    const voces=plopVocesPara(ctx);
    /* elegir una cuenta cuya voz calce con el tono, evitando repetir la última */
    const cand=[]; voces.forEach(function(v){ (PLOP_POR_VOZ[v]||[]).forEach(function(h){ cand.push({h:h,v:v}); }); });
    if(!cand.length) return null;
    const pick=cand[Math.floor(Math.random()*cand.length)];
    let txt=gen(pick.v, s);
    if(!txt) return null;
    txt=limpiaEsp(txt);
    const m=plopMem();
    if(m.hist.indexOf(txt)>=0) return null; /* no repetir textual reciente */
    plopRecuerda(txt);
    return {ctx:ctx, quien:pick.h, txt:txt};
  }catch(e){ return null; }
}

/* ---------- HOOK: envolver tuitDeCtx para mezclar generado + aprobado ---------- */
(function(){
  if(typeof tuitDeCtx!=="function" || tuitDeCtx._gen) return;
  const base=tuitDeCtx;
  tuitDeCtx=function(ctx){
    /* 55%: intenta generar con estado real; si falla, cae al pool aprobado */
    if(PLOP_GRAM[ctx] && Math.random()<0.55){
      const g=generarPlop(ctx);
      if(g) return g;
    }
    return base(ctx);
  };
  tuitDeCtx._gen=true;
})();

/* ============================================================
   HILOS: las cuentas se responden entre ellas. Cuando un hincha postea en el
   feed, otra cuenta (con voz distinta) le tira 1-2 réplicas cortas según el
   tono. Se cuelga de postProc (que ya guarda item.hilo, renderizado con ↳).
   ============================================================ */
const PLOP_REPLICAS={
  bueno:{
    exaltado:["ESO WN 🔥","VAMOS QUE SE PUEDE 🙌","ARRIBA CARAJO","así se habla po"],
    ironico:["por fin alguien lo dice","no lo hubiera dicho mejor ksks","tomá pa vos"],
    amargado:["ojalá dure","no me ilusiono igual","a ver cuánto aguanta"],
    tierno:["ay qué lindo hijito 🥺","así me gusta","el corazón contento"],
    dato:["+1, los números lo respaldan","tal cual, dato firme"],
    rival:["disfruten mientras dure 😌","ya nos va a tocar"],
    cotidiano:["lo grité en la micro jaja","me hiciste el día"],
    serio:["comparto el análisis.","coincido, fue clave."]
  },
  malo:{
    exaltado:["ME CARGA ESTA WEA 😡","NO PUEDE SER PO","ya fue, ya fue"],
    ironico:["clásico de la casa","sorpresa cero ksks","lo veía venir"],
    amargado:["lo dije hace rato","este club me va a matar","siempre lo mismo"],
    tierno:["ay no hijito 😔","qué pena me da"],
    dato:["los números venían avisando","-moral, anoten"],
    rival:["gracias, se agradece 🤣","los amo por esto"],
    cotidiano:["me arruinaron el día","chao finde"],
    serio:["hay que corregir esto.","preocupa, sí."]
  },
  neutro:{
    ironico:["ver pa creer","mmm veremos","ni fu ni fa"],
    amargado:["a mí no me convence","tengo mis dudas"],
    dato:["dato para la mesa","anotado."],
    cotidiano:["jaja tal cual","lo mismo pienso"],
    serio:["punto válido."]
  }
};
function plopReplica(tono, evitar){
  const banco=PLOP_REPLICAS[tono]||PLOP_REPLICAS.neutro;
  const voces=Object.keys(banco); if(!voces.length) return null;
  for(let i=0;i<6;i++){
    const v=voces[Math.floor(Math.random()*voces.length)];
    const cuentas=(PLOP_POR_VOZ[v]||[]).filter(function(h){ return h!==evitar; });
    if(!cuentas.length) continue;
    const h=cuentas[Math.floor(Math.random()*cuentas.length)];
    const opts=banco[v]; const txt=opts[Math.floor(Math.random()*opts.length)];
    return {autor:h, texto:txt};
  }
  return null;
}
(function(){
  if(typeof postProc!=="function" || postProc._hilo) return;
  const base=postProc;
  postProc=function(autor,tipo,texto,tono,extra){
    const item=base(autor,tipo,texto,tono,extra);
    try{
      if(item && tipo==="hincha" && Math.random()<0.38){
        item.hilo=item.hilo||[];
        const r1=plopReplica(item.tono, autor);
        if(r1){ item.hilo.push({autor:r1.autor, texto:r1.texto, fecha:"ahora"});
          if(Math.random()<0.35){
            const r2=plopReplica(item.tono, r1.autor);
            if(r2 && r2.autor!==r1.autor) item.hilo.push({autor:r2.autor, texto:r2.texto, fecha:"ahora"});
          }
          item.replies=(item.replies||0)+item.hilo.length;
        }
      }
    }catch(e){}
    return item;
  };
  postProc._hilo=true;
})();
