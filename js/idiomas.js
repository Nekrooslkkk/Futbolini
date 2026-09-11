"use strict";
/* ============================================================
   FUTBOLINI · idiomas.js  (7.69)
   Sistema de IDIOMA / REGISTRO: Español neutro, Chilensis (de verdad,
   sin voseo argentino), Português. Se llena de a poco.

   Cómo funciona: `T(clave, neutro)` devuelve la frase del idioma activo;
   si esa clave no está traducida, CAE A NEUTRO (nunca queda en blanco).
   Así se puede ir traduciendo pantalla por pantalla sin romper nada.

   Para sumar frases: agregá la `clave` en `FRASES.neutro` (base) y, cuando
   tengas la versión, en `FRASES.cl` (chilensis) y/o `FRASES.pt` (portugués).
   El chilensis lo pule el usuario (voz real); acá va un arranque respetuoso.
   Regla del repo: diversidad sí, burla no.
   ============================================================ */

var IDIOMA="neutro";
var IDIOMAS_DISPONIBLES=[
  ["neutro","🌎 Español neutro"],
  ["cl","🇨🇱 Chilensis"],
  ["pt","🇧🇷 Português"]
];

var FRASES={
  /* --- BASE: español neutro (sin voseo). Es el fallback de todo. --- */
  neutro:{
    ini_headline:"No manejas un equipo. Manejas una institución.",
    ini_bajada:"Gente con intereses distintos empujando para lados distintos, plata que se acaba, reglas internas que puedes cambiar si tienes el poder para hacerlo, y una historia real que puedes seguir o romper.",
    ini_elige:"1 · Elige club",
    ini_buscar:"Buscar club o ciudad…",
    ini_f_todos:"Todos",
    ini_f_clasicos:"Clásicos '91",
    ini_amigo_tit:"… o juega contra un amigo",
    ini_amigo_txt:"Un duelo dirigido, en vivo, sin cuentas ni servidor: se conectan con un código y cada uno maneja su club.",
    ini_amigo_btn:"🎮 Duelo con un amigo",
    aj_idioma:"Idioma",
    aj_idioma_txt:"Cambia el registro de los textos del juego. El chilensis se va puliendo con el tiempo; lo que aún no esté traducido se muestra en español neutro.",
    esc_atiende:"Atiende antes de avanzar",
    esc_atiende_txt:"Hay cosas que conviene resolver antes de apretar Avanzar. Toca una para ir a resolverla:",
    esc_metas:"Lo que se espera de ti",
    esc_metas_txt:"Metas de la dirigencia para este año. Se evalúan al cierre.",
    esc_como:"Cómo",
    esc_ayudante:"Ayudante",
    esc_ayudante_txt:"Tu mano derecha, gratis y sin servidor. Preguntale de verdad: del rival, la plata, la meta, la copa, la barra.",
    esc_decs:"Decisiones sobre la mesa",
    esc_semana:"Lo que pasó esta semana",
    inst_poder:"Jugadas de poder",
    inst_poder_txt:"No es apretar un botón. Primero tienes que tener al grupo de tu lado y capital. Cada una, una vez por año.",
    inst_grupos:"Grupos de interés",
    merc_obj:"Objetivos en el mercado",
    merc_ces:"Cesiones a préstamo",
    cal_pais:"El país se simula aunque no lo juegues",
    chip_informe:"Informe de la semana",
    chip_rival:"¿Cómo viene el rival?",
    chip_plata:"¿Cómo estamos de plata?",
    chip_camarin:"¿Y el camarín?",
    chip_meta:"¿Qué hago con la meta?",
    chip_domingo:"¿El domingo?",
    chip_vende:"¿Vendemos a alguien?",
    chip_capitan:"¿Hablo con el capitán?",
    chip_directorio:"¿Y el directorio?"
  },
  /* --- CHILENSIS (de verdad): -ai/-ís, 'po', 'cachái', sin voseo argentino. --- */
  cl:{
    ini_headline:"No manejái un equipo, po. Manejái una institución.",
    ini_bajada:"Cabros tirando pa' lados distintos, la plata que no alcanza, reglas internas que podí cambiar si tení el peso pa' hacerlo, y una historia real que podí seguir o mandar a la punta del cerro.",
    ini_elige:"1 · Elegí tu club",
    ini_buscar:"Busca tu club o ciudad…",
    ini_f_todos:"Todos",
    ini_f_clasicos:"Clásicos '91",
    ini_amigo_tit:"… o juega contra un amigo",
    ini_amigo_txt:"Un duelo dirigido, en vivo, sin cuentas ni na': se conectan con un código y cada uno maneja su cuadro.",
    ini_amigo_btn:"🎮 Pícate con un amigo",
    aj_idioma:"Idioma",
    aj_idioma_txt:"Cambia cómo habla el juego. El chilensis se va afinando de a poco; lo que falte sale en neutro por mientras.",
    esc_atiende:"Atendé esto antes de avanzar, po",
    esc_atiende_txt:"Hay weás que conviene resolver antes de apretar Avanzar. Toca una y te digo qué hacer:",
    esc_metas:"Lo que se espera de ti",
    esc_metas_txt:"Las metas de la dirigencia pa este año. Al cierre te las cobran, no te dormái.",
    esc_como:"Cómo se hace",
    esc_ayudante:"Ayudante",
    esc_ayudante_txt:"Tu mano derecha, gratis y sin servidor. Preguntale en serio: del rival, la plata, la meta, la copa, la barra. El weón lee el club de verdad.",
    esc_decs:"Decisiones sobre la mesa",
    esc_semana:"Lo que pasó esta semana",
    inst_poder:"Jugadas de poder",
    inst_poder_txt:"No es apretar un botón y listo. Primero tenís que tener al grupo de tu lado y capital. Cada una, una vez al año. Si no sabís lo que hacís, te explota.",
    inst_grupos:"Grupos de interés",
    merc_obj:"Objetivos en el mercado",
    merc_ces:"Cesiones a préstamo",
    cal_pais:"El país se simula aunque no lo juegues",
    chip_informe:"Informe de la semana",
    chip_rival:"¿Cómo viene el rival?",
    chip_plata:"¿Cómo andamos de luca?",
    chip_camarin:"¿Y el camarín?",
    chip_meta:"¿Qué hago con la meta?",
    chip_domingo:"¿El domingo?",
    chip_vende:"¿Vendemos a alguien?",
    chip_capitan:"¿Hablo con el capitán?",
    chip_directorio:"¿Y el directorio?"
  },
  /* --- PORTUGUÊS (arranque; el usuario/Grok lo afinan). --- */
  pt:{
    ini_headline:"Você não dirige um time. Dirige uma instituição.",
    ini_bajada:"Gente puxando para lados diferentes, dinheiro que acaba, regras internas que você pode mudar se tiver poder para isso, e uma história real que dá para seguir ou quebrar.",
    ini_elige:"1 · Escolha o clube",
    ini_buscar:"Buscar clube ou cidade…",
    ini_f_todos:"Todos",
    ini_f_clasicos:"Clássicos '91",
    ini_amigo_tit:"… ou jogue contra um amigo",
    ini_amigo_txt:"Um duelo ao vivo, sem contas nem servidor: conectam-se com um código e cada um comanda seu clube.",
    ini_amigo_btn:"🎮 Duelo com um amigo",
    aj_idioma:"Idioma",
    aj_idioma_txt:"Muda o registro dos textos do jogo. O que ainda não estiver traduzido aparece em espanhol neutro."
  }
};

/* ---- Pools de tuits POR IDIOMA (se suman a los del pool base según contexto).
   Chilensis crudo de cancha (aparece SOLO en modo Chilensis; neutro/pt quedan limpios).
   Escrito con la voz del usuario. Placeholder {GOLEADOR}. --- */
var _GOL_CL=[
  {quien:"@barra_del_sur", txt:"GOOOOOOOL GOOOOOL CONCHETUMARE, TE AMO {GOLEADOR}, HAZME UN HIJO!!"},
  {quien:"@weon_del_metro", txt:"GOOOOL WN GOOOOL, {GOLEADOR} ERÍS GRANDE, LA CTM QUE TE AMO"},
  {quien:"@hincha_insomne", txt:"AAAAAH GOOOOOL, {GOLEADOR} POR LA CHUCHA QUE JUEGA BIEN, GRÍTALO"},
  {quien:"@pibe_popular23", txt:"SE ROMPIÓ LA RED CTM, {GOLEADOR} ERÍS UN CRACK, TE LLEVO AL ALTAR"},
  {quien:"@dona_del_barrio", txt:"gooool mijito lindo, {GOLEADOR} me lo saludan a la mamá, qué golazo por dios"}
];
var TUITS_IDIOMA={
  cl:{
    gol_propio:_GOL_CL,
    gana_agonico:_GOL_CL.concat([{quien:"@albo_insomne", txt:"EN LA HORA CTM, {GOLEADOR} NOS SALVÓ LA VIDA, LLORO"}]),
    remontada:_GOL_CL.concat([{quien:"@garrafal_cl", txt:"DE LA NADA WN, {GOLEADOR} DIO VUELTA TODO, QUÉ EQUIPO CTM"}]),
    clasico_gana:_GOL_CL.concat([{quien:"@barra_del_sur", txt:"EN EL CLÁSICO CTM, {GOLEADOR} LOS HIZO LLORAR, ESTO NO SE OLVIDA"}]),
    goleada_favor:_GOL_CL,
    hat_trick:[{quien:"@datofutbol_cl", txt:"TRES {GOLEADOR}, TRES CTM. HÁGANLE UNA ESTATUA AL TIRO"}].concat(_GOL_CL)
  }
};

/* Resuelve una clave por el idioma activo, con fallback a neutro y a un default. */
function T(clave, neutro){
  var pack=FRASES[IDIOMA];
  if(pack && pack[clave]!=null) return pack[clave];
  if(FRASES.neutro && FRASES.neutro[clave]!=null) return FRASES.neutro[clave];
  return (neutro!=null)?neutro:clave;
}
/* Cambia el idioma activo (si existe el pack). */
function setIdioma(k){ if(k && (FRASES[k]||k==="neutro")) IDIOMA=k; return IDIOMA; }
function idiomaActual(){ return IDIOMA; }
