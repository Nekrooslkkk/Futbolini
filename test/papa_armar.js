/* FUTBOLINI · test/papa_armar.js (7.9120) · arma el juego juntado con EL MISMO código que usa sw.js
   (js/papa-armar.js), para correr el doctor entero adentro. Escribe archivos temporales que borra test/papa.sh. */
"use strict";
const fs=require("fs"), vm=require("vm");
vm.runInThisContext(fs.readFileSync("js/papa-armar.js","utf8"));
const html=fs.readFileSync("index.html","utf8"), ver=papaVersionDe(html);
if(!ver){ console.log("❌ index.html sin versión en util.js"); process.exit(1); }
const partes=papaScriptsDe(html).map(u=>({u:u, src:fs.readFileSync(u.replace(/\?.*$/,""),"utf8")}));
const js=papaUnir(partes);
fs.writeFileSync(PAPA_ARCHIVO,js); fs.writeFileSync(PAPA_GUARDIA,PAPA_GUARDIA_JS);
/* los nombres que pasaron de const/let a var: todos tienen que quedar colgando de window (si no, estaba dentro de una función) */
const nombres=[]; partes.forEach(p=>{ const re=/^(?:const|let)\s+([\p{L}_$][\p{L}\p{N}_$]*)/gmu; let m; while((m=re.exec(p.src))) if(!PAPA_NO_TOCAR.has(m[1])) nombres.push(m[1]); });
fs.writeFileSync("_papa_nombres.js","window.__papaNombres="+JSON.stringify(nombres)+";");
const pag=papaHTML(html,ver);
const iny=(s)=>pag.replace("</body>",s+"\n</body>");
fs.writeFileSync("_papa_doctor.html",iny('<pre id="out">corriendo...</pre>\n<script src="test/doctor.js"></script>'));
fs.writeFileSync("_papa_chk.html",iny('<pre id="out">corriendo...</pre>\n<script src="_papa_nombres.js"></script>\n<script src="test/papa_chk.js"></script>'));
console.log("  paquete: "+partes.length+" archivos → 1 ("+Math.round(js.length/1024)+" KB), "+nombres.length+" nombres de primer nivel");
