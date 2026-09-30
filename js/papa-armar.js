"use strict";
/* ============================================================
   FUTBOLINI · papa-armar.js — 7.9120 · 🥔 Modo papa (la parte que junta el juego)

   El juego son ~130 archivos. En un celu flaco, pedirlos y procesarlos uno por uno se come la mayor parte de la
   carga (medido con CPU 20× más lenta: 4,5 s repartido en archivos contra 0,8 s en uno solo). Con el Modo papa
   encendido, el service worker (sw.js) los junta EN EL EQUIPO DEL JUGADOR en un solo archivo y lo guarda: no hay
   build en el repo, ningún programa externo, y queda para jugar sin internet.

   Estas funciones son puras (texto entra, texto sale) para que las usen igual sw.js, el juego y las pruebas
   (test/papa.sh arma el mismo paquete y corre el doctor adentro).

   Por qué const/let de primer nivel pasan a var: separados, preguntar `typeof X` por una constante que declara un
   archivo posterior da "undefined"; en un solo archivo esa constante ya existe pero sin valor y la misma pregunta
   revienta. Con var vuelve a dar "undefined", igual que antes. Todos los archivos ya son "use strict", así que el
   paquete entero lo es. Los nombres que ya existen en window (name, status, top…) no se tocan nunca: un var ahí
   pisaría al navegador (hoy no hay ninguno; test/papa.sh lo revisa).
   ============================================================ */
const PAPA_ARCHIVO="js/_papa.js";
const PAPA_GUARDIA="js/_papa_guardia.js";
const PAPA_NO_TOCAR=new Set(["name","status","top","parent","self","window","document","location","history","length",
  "origin","event","frames","opener","closed","screen","print","open","close","stop","focus","blur","find","external",
  "navigator","performance","crypto","caches","indexedDB","localStorage","sessionStorage","fetch","alert","confirm","prompt"]);

/* los <script src="js/…"> de index.html, en orden */
function papaScriptsDe(html){
  const out=[], re=/<script src="(js\/[^"]+)"><\/script>/g; let m;
  while((m=re.exec(String(html)))) out.push(m[1]);
  return out;
}
/* la versión que trae index.html (la de util.js): el paquete solo sirve para esa versión exacta */
function papaVersionDe(html){ const m=/<script src="js\/util\.js\?v=([^"]+)"/.exec(String(html)); return m?m[1]:null; }
/* const/let de primer nivel (columna 0) → var. Lo de adentro de funciones va con sangría y no se toca. */
function papaTransformar(src){
  return String(src).replace(/^(const|let)(\s+)([\p{L}_$][\p{L}\p{N}_$]*)/gmu,function(t,k,sp,n){ return PAPA_NO_TOCAR.has(n)?t:"var"+sp+n; });
}
/* partes: [{u:"js/util.js?v=…", src:"…"}] → un solo archivo. Al final marca que llegó entero. */
function papaUnir(partes){
  return '"use strict";\n/* Futbolini · Modo papa: '+partes.length+' archivos juntados en este equipo por sw.js (js/papa-armar.js) */\n'+
    partes.map(function(p){ return "\n/* ==== "+p.u+" ==== */\n"+papaTransformar(p.src)+"\n;"; }).join("")+
    "\n;self.__papaOK=1;\n";
}
/* index.html de la versión papa: un solo script (+ la guardia), sin las fuentes de Google, con html.papa desde el
   primer cuadro. La CSP y todo lo demás quedan igual. */
function papaHTML(html,ver){
  let h=String(html).replace(/<script src="js\/[^"]+"><\/script>\n?/g,"");
  h=h.replace(/<link rel="preconnect" href="https:\/\/fonts\.[^"]+"[^>]*>\n?/g,"")
     .replace(/<link href="https:\/\/fonts\.googleapis\.com[^"]*" rel="stylesheet">\n?/g,"");
  h=h.replace(/<html([^>]*)>/,function(t,a){ return /class=/.test(a)?t.replace(/class="/,'class="papa '):"<html"+a+' class="papa">'; });
  return h.replace("</body>",'<script src="'+PAPA_ARCHIVO+"?v="+ver+'"></script>\n<script src="'+PAPA_GUARDIA+"?v="+ver+'"></script>\n</body>');
}
/* si el paquete se cortó a medio camino (un error arriba de todo), no se queda la pantalla en blanco: se apaga el
   modo papa, se avisa, y se recarga en modo normal */
const PAPA_GUARDIA_JS='"use strict";(function(){ if(self.__papaOK||/[?&]normal=1/.test(location.search)) return;'+   /* ya en normal: nunca en bucle */
  ' try{ localStorage.setItem("futbolini_papa","0"); localStorage.setItem("futbolini_papa_fallo",String(Date.now())); }catch(e){}'+
  ' try{ navigator.serviceWorker.controller.postMessage({tipo:"papa",on:false}); }catch(e){}'+
  ' location.replace(location.pathname+"?normal=1"); })();';
