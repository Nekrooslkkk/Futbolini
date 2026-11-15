"use strict";
/* ============================================================
   FUTBOLINI 7.9149 · data-kits-voz.js — la voz de las camisetas (encargos S3 y S4)
   · colorEnPalabras(hex): una palabra SOLO si ese hex está en el mapa; si no, null. Una frase nunca nombra
     un color que esta función no devuelva: sin color dice "la camiseta", "el short" o "las medias".
   · fraseCenital(tipo,P): relato de lo que la cámara de arriba sí muestra (carrera, estirada, gol, afuera, repeticion).
   · salenDeCamarin(P): cómo salen vestidos, en la previa. Sin kit (los de 1925), habla del túnel, del pasto, del ruido.
   · revisarVocabularioKits(): lo usa el doctor kits_voz.
   Carga DESPUÉS de data-kits.js y ANTES de cancha.js.
   ============================================================ */
const KV_PALABRAS=["blanco","azul","rojo","amarillo","verde","negro","naranja","celeste","granate","marrón","rosado","violeta"];
const KV_COLORES={
  "#ffffff":"blanco", "#111111":"negro",
  "#003da5":"azul", "#0055a4":"azul", "#00205b":"azul", "#0033a0":"azul", "#0055a5":"azul", "#1d4fa0":"azul",
  "#e31837":"rojo", "#c8102e":"rojo", "#e30613":"rojo", "#cc0000":"rojo",
  "#ffd100":"amarillo", "#ffcc00":"amarillo",
  "#007a33":"verde", "#00843d":"verde", "#007a3d":"verde",
  "#f36c21":"naranja", "#7ec8e3":"celeste", "#5eb1e8":"celeste",
  "#6b2d3c":"granate", "#5c4033":"marrón", "#e89bb8":"rosado", "#4b2e83":"violeta"
};
/* colores que NO existen en los kits: si una frase los nombra, el doctor lo caza */
const KV_INVENTADOS=["bordó","azabache","marfil","dorado","plateado","gris","oro","crema","turquesa","lila","burdeo","fucsia","escarlata","bermellón"];

function colorEnPalabras(hex){
  const h=String(hex||"").toLowerCase();
  return KV_COLORES[h]||null;
}
const _KV_RAIZ={blanco:"blanc",negro:"negr",rojo:"roj",amarillo:"amarill",rosado:"rosad"};
function _kvAdj(pal,fem,plural){
  if(_KV_RAIZ[pal]) return _KV_RAIZ[pal]+(fem?"a":"o")+(plural?"s":"");
  if(!plural) return pal;
  return pal==="azul"?"azules":(pal==="marrón"?"marrones":pal+"s");
}
/* cada forma (género y número) de cada palabra → su palabra base; sirve para leer una frase y ver qué colores nombra */
const _KV_FORMAS=(function(){
  const m={};
  KV_PALABRAS.forEach(function(p){ [false,true].forEach(function(f){ [false,true].forEach(function(pl){ m[_kvAdj(p,f,pl)]=p; }); }); });
  KV_INVENTADOS.forEach(function(p){ m[p]=p; });
  return m;
})();
function _kvColoresEn(texto){
  const out=[];
  String(texto||"").toLowerCase().split(/[^a-záéíóúñü]+/).forEach(function(w){ if(_KV_FORMAS[w]&&out.indexOf(_KV_FORMAS[w])<0) out.push(_KV_FORMAS[w]); });
  return out;
}
function _kvElige(a){ return (typeof elige==="function")?elige(a):a[Math.floor(Math.random()*a.length)]; }
function _kvCap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

/* ---------- S3 · lo que la cámara de arriba sí muestra ---------- */
/* {nombre} apellido de quien juega · {min} minuto · {cam} "la camiseta" (+ color solo si es de un kit) */
const KV_CENITAL={
  carrera:[
    "Sale {nombre} con la pelota y se abre camino por el medio.",
    "Desde arriba se ve el pase y se ve el espacio que queda adelante.",
    "{nombre} corre con la pelota pegada al pie, {min}'.",
    "El de {cam} lleva la pelota hacia adelante y los otros lo siguen.",
    "Los demás corren sin pelota. {nombre} no la suelta.",
    "La cancha se abre desde arriba: pelota al pie, el área al frente.",
    "{min}' y la jugada va por la banda. Todavía nadie la corta.",
    "Va la pelota y va el resto detrás; visto desde arriba parece un solo movimiento."
  ],
  estirada:[
    "El arquero se tira. Desde arriba solo se ve una sombra que se alarga.",
    "Se estira el arquero con el brazo por delante, {min}'.",
    "Un salto al costado: el arquero llega o no llega, y desde arriba cuesta saberlo.",
    "El arquero se estira y el área se le queda chica.",
    "Va el arquero al piso. Los defensas miran la pelota, no a él.",
    "Se tira el arquero y el pasto le amortigua la caída.",
    "El arquero cae y se levanta rápido: ya está mirando la pelota otra vez.",
    "{min}' · el arquero vuela hacia un costado mientras el resto mira."
  ],
  gol:[
    "Entra la pelota. {nombre} corre sin saber hacia dónde.",
    "Gol de {nombre} a los {min} minutos.",
    "La red se mueve y los de {cam} salen corriendo a abrazarse.",
    "La pelota llega al fondo. Desde arriba se ve la red hincharse y a todos correr hacia un mismo punto.",
    "{min}' · gol. {nombre} corre hacia la esquina.",
    "Pasó la línea: ya no hay nada que discutir.",
    "Gol. El arquero se queda mirando la pelota dentro de la red.",
    "Se corta el juego: la pelota está adentro y los dos equipos lo saben."
  ],
  afuera:[
    "El tiro se va por el costado del arco.",
    "Pasa cerca del palo, pero pasa por fuera.",
    "{nombre} remata y la pelota se pierde detrás del arco.",
    "Desde arriba se ve la trayectoria: nunca fue al arco.",
    "Remate de {nombre}, {min}'. Se va afuera.",
    "La pelota se va ancha. Nadie la toca.",
    "El tiro sale mordido y se va hacia la línea de fondo.",
    "Afuera: saque de arco o córner, según quién la tocó."
  ],
  repeticion:[   /* va antes del nombre del goleador: 22 caracteres como máximo */
    "REPETICIÓN",
    "OTRA VEZ, DESDE ARRIBA",
    "LA JUGADA, DE NUEVO",
    "REPLAY",
    "MÍRALA OTRA VEZ",
    "ASÍ ENTRÓ",
    "LA JUGADA COMPLETA",
    "UNA VEZ MÁS"
  ]
};
const _kvUlt={};
function _kvApellido(n){ const p=String(n||"").trim().split(/\s+/); return p.length?p[p.length-1]:""; }
/* el último gol del partido, si hay: el relato de gol y de repetición habla de ese */
function _kvUltGol(P){ const g=(P&&P.golesDetalle)||[]; return g.length?g[g.length-1]:null; }
function _kvDatos(tipo,P,x){
  const g=(tipo==="gol"||tipo==="repeticion")?_kvUltGol(P):null;
  let nombre=x.nombre||(g&&g.quien)||"";
  if(!nombre&&P&&P.once&&P.once.length&&x.mio!==false){ const j=_kvElige(P.once.filter(function(a){ return a&&a.n; })); nombre=j?j.n:""; }
  const min=(x.min!=null)?x.min:(g&&g.min!=null?g.min:(P&&typeof P.min==="number"?P.min:null));
  const mio=(x.mio!=null)?x.mio:(g?!!g.propio:true);
  return {nombre:_kvApellido(nombre), min:min, mio:mio};
}
/* "la camiseta" + el color SOLO si ese lado tiene kit y el hex que se dibuja es el del kit (la de emergencia no lo es) */
function _kvCam(P,mio){
  let pal=null;
  try{
    const id=mio?((P&&P.clubMio)||(typeof E!=="undefined"&&E&&E.club)):(P&&P.part&&P.part.rivalId);
    if(id&&typeof piezaKit==="function"&&piezaKit(id,false)&&typeof _cvColores==="function"){ const c=_cvColores(P||null); pal=colorEnPalabras(mio?c.mio:c.riv); }
  }catch(e){}
  return "la camiseta"+(pal?" "+_kvAdj(pal,true,false):"");
}
function fraseCenital(tipo,P,extra){
  const L=KV_CENITAL[tipo]; if(!L) return null;
  const d=_kvDatos(tipo,P,extra||{});
  const pool=L.filter(function(t){ return (t.indexOf("{nombre}")<0||d.nombre)&&(t.indexOf("{min}")<0||d.min!=null); });
  if(!pool.length) return null;
  const libres=pool.filter(function(t){ return t!==_kvUlt[tipo]; });
  const t=_kvElige(libres.length?libres:pool); _kvUlt[tipo]=t;
  return t.replace(/\{nombre\}/g,d.nombre).replace(/\{min\}/g,String(d.min)).replace(/\{cam\}/g,_kvCam(P,d.mio));
}

/* ---------- S4 · cómo salen vestidos ---------- */
/* r: "" siempre · "k" solo con kit · "f" solo con franja · l: "l" solo de local · "v" solo de visita */
const KV_SALEN=[
  {r:"",t:"En el túnel nadie habla. Afuera, el ruido ya empezó."},
  {r:"",l:"l",t:"Es tu pasto y es tu gente: el ruido llega al túnel antes que el equipo."},
  {r:"",l:"v",t:"Sales de visita: el ruido de afuera no es tuyo. El pasto, tampoco."},
  {r:"",t:"Los últimos metros del túnel se hacen en fila y sin mirar al lado."},
  {r:"",t:"Bajo los tapones se oye el pasto. Después, de golpe, la tribuna."},
  {r:"k",t:"Salen con {cam} y {sho}."},
  {r:"k",t:"{cam}, {sho} y {med}: así sale tu equipo."},
  {r:"k",t:"Tu equipo sale con {cam}. Desde la banca se le reconoce por el color antes que por la cara."},
  {r:"k",t:"Lo primero que se ve en el túnel son {med}."},
  {r:"k",t:"Todo en orden: {cam} y {sho}. Falta lo único que no se plancha, la cabeza."},
  {r:"k",t:"Con {cam} puesta, el equipo mira el pasto desde la puerta del túnel."},
  {r:"k",l:"l",t:"En casa, tu equipo sale con {cam}. El pasto ya lo conoce."},
  {r:"k",l:"v",t:"De visita, el equipo sale con {cam}: la alternativa. El pasto no es suyo."},
  {r:"f",t:"{fra} cruza el pecho de tu equipo en la puerta del túnel."},
  {r:"f",t:"Hoy se ve {fra} en {cam}. La gente la reconoce antes que el nombre."},
  {r:"f",t:"{fra} y {cam}: así los ve el rival cuando se abre el túnel."}
];
/* las piezas en palabras: el color solo si colorEnPalabras lo devuelve; si no, el sustantivo solo */
function _kvPiezas(pz){
  const c=function(hex,sust,fem,plural){ const w=colorEnPalabras(hex); return sust+(w?" "+_kvAdj(w,fem,plural):""); };
  let fra=null;
  if(pz.franja){
    const base=pz.franja==="banda"?"la banda":"la franja "+pz.franja, w=colorEnPalabras(pz.franjaColor);
    fra=base+(w?" "+_kvAdj(w,true,false):"");
  }
  return {cam:c(pz.camiseta,"la camiseta",true,false), sho:c(pz.short,"el short",false,false), med:c(pz.medias,"las medias",true,true), fra:fra};
}
let _kvSalen={clave:null,txt:"",ult:null};
function salenDeCamarin(P){
  const part=(P&&P.part)||P||{};
  const id=(P&&P.clubMio)||part.clubMio||(typeof E!=="undefined"&&E&&E.club)||null;
  const local=part.local!==false;
  const clave=[id,part.rivalId||"",part.f||part.fecha||"",local?1:0].join("|");
  if(clave===_kvSalen.clave) return _kvSalen.txt;   /* repintar la previa no cambia la línea */
  const pz=(id&&typeof piezaKit==="function")?piezaKit(id,!local):null;
  const pie=pz?_kvPiezas(pz):null;
  const pool=KV_SALEN.filter(function(s){
    if(s.r==="k"&&!pz) return false;
    if(s.r==="f"&&!(pie&&pie.fra)) return false;
    if(s.l==="l"&&!local) return false;
    if(s.l==="v"&&local) return false;
    return true;
  });
  const libres=pool.filter(function(s){ return s!==_kvSalen.ult; });
  const s=_kvElige(libres.length?libres:pool);
  let txt=s.t;
  if(pie) txt=txt.replace(/\{cam\}/g,pie.cam).replace(/\{sho\}/g,pie.sho).replace(/\{med\}/g,pie.med).replace(/\{fra\}/g,pie.fra||"");
  txt=_kvCap(txt);
  _kvSalen={clave:clave,txt:txt,ult:s};
  return txt;
}

/* ---------- el doctor kits_voz (js/dev-banco.js) ---------- */
function _kvTodasLasLineas(){
  let L=KV_SALEN.map(function(s){ return s.t; });
  Object.keys(KV_CENITAL).forEach(function(k){ L=L.concat(KV_CENITAL[k]); });
  return L;
}
/* Puro. kits/lineas/mapa por defecto son los reales; con otros sirve para probar el chequeo al revés.
   Falla si una línea nombra un color que ningún kit usa, y si el mapa trae un hex que ningún kit usa. */
function revisarVocabularioKits(kits,lineas,mapa){
  const K=kits||KITS, M=mapa||KV_COLORES, L=lineas||_kvTodasLasLineas();
  const mal=[], usados={};
  Object.keys(K).forEach(function(id){
    const k=K[id]||{};
    ["local","visita"].forEach(function(l){ (k[l]||[]).forEach(function(h){ usados[String(h).toLowerCase()]=1; }); });
    [k.franjaColor,k.franjaColorVisita].forEach(function(h){ if(h) usados[String(h).toLowerCase()]=1; });
  });
  Object.keys(M).forEach(function(h){
    if(!usados[h.toLowerCase()]) mal.push("el mapa trae "+h+" ("+M[h]+") y ningún kit lo usa");
    if(KV_PALABRAS.indexOf(M[h])<0) mal.push(h+" apunta a «"+M[h]+"», que no es una de las 12 palabras");
  });
  const permitidas={};
  Object.keys(usados).forEach(function(h){ if(M[h]) permitidas[M[h]]=1; });
  L.forEach(function(t){ _kvColoresEn(t).forEach(function(p){ if(!permitidas[p]) mal.push("«"+String(t).slice(0,50)+"» nombra «"+p+"» y ningún kit tiene ese color"); }); });
  return {ok:!mal.length, mal:mal, sinPalabra:Object.keys(usados).filter(function(h){ return !M[h]; }), palabras:Object.keys(permitidas).length};
}
