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
    aj_idioma_txt:"Cambia el registro de los textos del juego. El chilensis se va puliendo con el tiempo; lo que aún no esté traducido se muestra en español neutro."
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
    aj_idioma_txt:"Cambia cómo habla el juego. El chilensis se va afinando de a poco; lo que falte sale en neutro por mientras."
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
