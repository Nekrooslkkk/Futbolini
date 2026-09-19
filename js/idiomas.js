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
  ["pt","🇧🇷 Português"],
  ["en","🇬🇧 English"]
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
    chip_directorio:"¿Y el directorio?",
    arco_gol:"⚽ GOL",
    arco_ataja:"🧤 ATAJADA",
    arco_barrera:"🧱 LA BARRERA",
    arco_palo:"🪵 TRAVESAÑO",
    arco_afuera:"↑ AFUERA",
    arco_defensa:"🛡️ DESPEJA",
    arco_hud_pen:"PENAL",
    arco_hud_tl:"TIRO LIBRE",
    arco_hud_cor:"CÓRNER",
    arco_pen_tit:"Penal · dibuja tu tiro",
    arco_tl_tit:"Tiro libre · dibuja tu remate",
    arco_cor_tit:"Córner · dibuja el centro",
    arco_colocado:"Colocado",
    arco_potente:"Potente",
    arco_picadita:"Picadita",
    tanda_tit:"Tanda · dibuja tu penal"
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
    esc_atiende:"Atiende esto antes de avanzar, po",
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
    chip_directorio:"¿Y el directorio?",
    arco_gol:"⚽ GOL",
    arco_ataja:"🧤 ATAJADA",
    arco_barrera:"🧱 LA BARRERA",
    arco_palo:"🪵 TRAVESAÑO",
    arco_afuera:"↑ AFUERA",
    arco_defensa:"🛡️ DESPEJA",
    arco_hud_pen:"PENAL",
    arco_hud_tl:"TIRO LIBRE",
    arco_hud_cor:"CÓRNER",
    arco_pen_tit:"Penal · dibuja el tiro, po",
    arco_tl_tit:"Tiro libre · dibuja el remate",
    arco_cor_tit:"Córner · dibuja el centro",
    arco_colocado:"Colocado",
    arco_potente:"Potente",
    arco_picadita:"Picadita",
    tanda_tit:"Tanda · dibuja el penal, po"
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
    aj_idioma_txt:"Muda o registro dos textos do jogo. O que ainda não estiver traduzido aparece em espanhol neutro.",
    esc_atiende:"Resolva isto antes de avançar",
    esc_atiende_txt:"Há coisas para resolver antes de apertar Avançar. Toque uma para ir até ela:",
    esc_metas:"O que se espera de você",
    esc_metas_txt:"Metas da diretoria para este ano. Avaliam-se no encerramento.",
    esc_como:"Como",
    esc_ayudante:"Assistente",
    esc_ayudante_txt:"Sua mão direita, de graça e sem servidor. Pergunte de verdade: rival, dinheiro, meta, copa, torcida.",
    esc_decs:"Decisões na mesa",
    esc_semana:"O que aconteceu nesta semana",
    inst_poder:"Jogadas de poder",
    inst_poder_txt:"Não é apertar um botão. Primeiro o grupo tem que estar do seu lado, e você precisa de capital. Cada uma, uma vez por ano.",
    inst_grupos:"Grupos de interesse",
    merc_obj:"Objetivos no mercado",
    merc_ces:"Empréstimos",
    cal_pais:"O país se simula mesmo que você não jogue",
    chip_informe:"Informe da semana",
    chip_rival:"Como vem o rival?",
    chip_plata:"Como está o dinheiro?",
    chip_camarin:"E o vestiário?",
    chip_meta:"O que faço com a meta?",
    chip_domingo:"E no domingo?",
    chip_vende:"Vendemos alguém?",
    chip_capitan:"Falo com o capitão?",
    chip_directorio:"E a diretoria?",
    arco_gol:"⚽ GOL",
    arco_ataja:"🧤 DEFESA",
    arco_barrera:"🧱 A BARREIRA",
    arco_palo:"🪵 TRAVE",
    arco_afuera:"↑ PRA FORA",
    arco_defensa:"🛡️ AFASTA",
    arco_hud_pen:"PÊNALTI",
    arco_hud_tl:"FALTA",
    arco_hud_cor:"ESCANTEIO",
    arco_pen_tit:"Pênalti · desenhe o chute",
    arco_tl_tit:"Falta · desenhe o chute",
    arco_cor_tit:"Escanteio · desenhe o cruzamento",
    arco_colocado:"Colocado",
    arco_potente:"Forte",
    arco_picadita:"Cavadinha",
    tanda_tit:"Disputa de pênaltis · desenhe o chute"
  },
  en:{
    ini_headline:"You don't run a team. You run an institution.",
    ini_bajada:"People pulling in different directions, money that runs out, house rules you can change if you have the power, and a real history you can follow or break.",
    ini_elige:"1 · Pick a club",
    ini_buscar:"Search club or city…",
    ini_f_todos:"All",
    ini_f_clasicos:"'91 classics",
    ini_amigo_tit:"… or play a friend",
    ini_amigo_txt:"A live directed duel, no accounts, no server: you connect with a code and each of you runs a club.",
    ini_amigo_btn:"🎮 Duel a friend",
    aj_idioma:"Language",
    aj_idioma_txt:"Changes the game's voice. Anything not translated yet falls back to neutral Spanish.",
    esc_atiende:"Handle this before you advance",
    esc_atiende_txt:"There are things to settle before you hit Advance. Tap one to go deal with it:",
    esc_metas:"What they expect of you",
    esc_metas_txt:"The board's targets for this year. They get scored at the close.",
    esc_como:"How",
    esc_ayudante:"Assistant",
    esc_ayudante_txt:"Your right hand, free, no server. Ask for real: the rival, the money, the target, the cup, the barra.",
    esc_decs:"Decisions on the table",
    esc_semana:"What happened this week",
    inst_poder:"Power plays",
    inst_poder_txt:"It is not a button. First you need the group on your side, and capital. Each one, once a year.",
    inst_grupos:"Interest groups",
    merc_obj:"Market objectives",
    merc_ces:"Loans",
    cal_pais:"The country simulates even if you don't play it",
    chip_informe:"Week report",
    chip_rival:"How's the rival looking?",
    chip_plata:"How's the money?",
    chip_camarin:"And the dressing room?",
    chip_meta:"What do I do with the target?",
    chip_domingo:"Sunday?",
    chip_vende:"Do we sell someone?",
    chip_capitan:"Do I talk to the captain?",
    chip_directorio:"And the board?",
    arco_gol:"⚽ GOAL",
    arco_ataja:"🧤 SAVED",
    arco_barrera:"🧱 THE WALL",
    arco_palo:"🪵 CROSSBAR",
    arco_afuera:"↑ WIDE",
    arco_defensa:"🛡️ CLEARED",
    arco_hud_pen:"PENALTY",
    arco_hud_tl:"FREE KICK",
    arco_hud_cor:"CORNER",
    arco_pen_tit:"Penalty · draw your shot",
    arco_tl_tit:"Free kick · draw your shot",
    arco_cor_tit:"Corner · draw the cross",
    arco_colocado:"Placed",
    arco_potente:"Power",
    arco_picadita:"Chip",
    tanda_tit:"Shootout · draw your penalty"
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
