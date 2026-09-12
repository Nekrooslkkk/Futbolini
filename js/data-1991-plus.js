"use strict";
/* ============================================================
   FUTBOLINI 7.78 · data-1991-plus.js
   PROMPT C · Modo 1991 mejorado: línea de tiempo de formatos
   1991→2008, prensa de época, reseñas extra de Libertadores.
   El fixture CC 1991 y COPA91 YA ESTÁN en data-liga.js (verificados
   contra solofutbol / Wikipedia). Acá no se reescribe: se suma.
   ============================================================ */

const FORMAT_CHILE_LINEA=[
  {anio:1991, n:16, pts:2, forma:"torneo largo ida y vuelta (30 fechas)",
    desc:"Campeón: Colo-Colo (18°). 2 pts por victoria. Descienden Osorno y Wanderers. Libertadores 1992: CC, Coquimbo, UC (liguilla)."},
  {anio:1992, n:16, pts:2, forma:"torneo largo",
    desc:"Sigue el formato anual. Campeón: Cobreloa. Ascienden Temuco y Huachipato."},
  {anio:1995, n:16, pts:3, forma:"torneo largo, 3 puntos por victoria",
    desc:"Chile adopta los 3 puntos por triunfo (FIFA 1995)."},
  {anio:1997, n:16, pts:3, forma:"Apertura y Clausura (primera vez)",
    desc:"Se parte el año en dos torneos independientes. Apertura: UC. Clausura: Colo-Colo."},
  {anio:1998, n:16, pts:3, forma:"vuelve el torneo largo anual",
    desc:"1998–2001: un solo campeón por año."},
  {anio:2002, n:16, pts:3, forma:"Apertura/Clausura + playoffs",
    desc:"Vuelven los torneos cortos, ahora con playoffs (cuartos/semis/final). Hasta 2009 (salvo 2007, que fue tabla)."},
  {anio:2006, n:19, pts:3, forma:"Apertura/Clausura, 19 clubes, playoffs",
    desc:"Concepción suspendido. Colo-Colo bicampeón (Borghi). Morning desciende."},
  {anio:2007, n:21, pts:3, forma:"Apertura/Clausura, 21 clubes, sin playoffs en Apertura",
    desc:"Concepción reincorporado. El Apertura se define por tabla. Colo-Colo tetra."},
  {anio:2008, n:20, pts:3, forma:"Apertura/Clausura con playoffs",
    desc:"Se regulariza a 20. Everton campeón del Apertura; Colo-Colo del Clausura."}
];

const COPA91_RESEÑA={
  grupo:"Grupo 2 con Deportes Concepción, Barcelona SC y LDU. Colo-Colo no pierde: 3-1 y 2-2 vs Barcelona, 3-0 y 0-0 vs LDU, 2-0 y 0-0 vs Concepción.",
  octavos:"Universitario de Lima: 0-0 en Lima, 2-1 en el Monumental (dos de Rubén Espinoza).",
  cuartos:"Nacional de Montevideo: 4-0 en Macul (Martínez, Dobrowski x2, Espinoza), 0-2 en Montevideo. Pasa por global.",
  semis:"Boca: 0-1 en la Bombonera, 3-1 en el Monumental (22 may). «Batalla de Macul»: expulsados Yáñez y Giunta.",
  final:"Olimpia: 0-0 en Asunción (29 may), 3-0 en el Monumental (5 jun) con doblete de Luis Pérez y gol de Leonel Herrera. Único título de Libertadores de un club chileno.",
  intercontinental:"8 dic 1991, Tokio: Estrella Roja 3-0. Resultado real."
};

const PRENSA_1991=[
  {ctx:"titular", registro:"neutro", txt:"COLO-COLO CAMPEÓN DE AMÉRICA. 3-0 a Olimpia en el Monumental."},
  {ctx:"titular", registro:"neutro", txt:"Pérez (2) y Leonel Herrera: la noche del 5 de junio."},
  {ctx:"titular", registro:"cl", txt:"AL FIN, PO. El Cacique es el Rey de América. Nadie nos saca esta."},
  {ctx:"titular", registro:"neutro", txt:"Coquimbo, subcampeón nacional. El puerto a la Libertadores 1992."},
  {ctx:"titular", registro:"neutro", txt:"Osorno y Wanderers descienden. El Nacional de 16 se mueve."},
  {ctx:"titular", registro:"cl", txt:"LA BATALLA DE MACUL. Boca se fue llorando: 3-1 y a la final."},
  {ctx:"titular", registro:"neutro", txt:"Martínez, 23 goles. El pichichi del Nacional 1991 es albo."},
  {ctx:"titular", registro:"neutro", txt:"Tokio: Estrella Roja 3, Colo-Colo 0. La Intercontinental se queda en Yugoslavia."}
];

(function mixPrensa91(){
  const pools=[];
  if(typeof PRENSA_1991!=="undefined") pools.push(PRENSA_1991);
  if(typeof PRENSA_2006!=="undefined") pools.push(PRENSA_2006);
  if(typeof PRENSA_1925!=="undefined") pools.push(PRENSA_1925);
  if(typeof TUITS_MOMENTO==="object"){
    pools.forEach(function(arr){
      arr.forEach(function(t){
        const ctx=t.ctx||"titular";
        TUITS_MOMENTO[ctx]=TUITS_MOMENTO[ctx]||[];
        TUITS_MOMENTO[ctx].push(t);
      });
    });
  }
})();
