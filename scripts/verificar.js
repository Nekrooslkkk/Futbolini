"use strict";
/* Chequeo sin dependencias: sintaxis y versión única antes de publicar. */
const fs=require("fs");
const path=require("path");
const cp=require("child_process");
const raiz=path.join(__dirname,"..");
const js=fs.readdirSync(path.join(raiz,"js")).filter(n=>n.endsWith(".js")).map(n=>path.join(raiz,"js",n));
const archivos=js.concat([path.join(raiz,"servidor.js"),path.join(raiz,"server","index.js")]);
let errores=0;
archivos.forEach(function(archivo){
  const r=cp.spawnSync(process.execPath,["--check",archivo],{encoding:"utf8"});
  if(r.status!==0){ errores++; process.stderr.write(r.stderr||("Error de sintaxis: "+archivo+"\n")); }
});
const util=fs.readFileSync(path.join(raiz,"js","util.js"),"utf8");
const version=(util.match(/const VERSION\s*=\s*["']([^"']+)["']/)||[])[1];
const index=fs.readFileSync(path.join(raiz,"index.html"),"utf8");
const ui=fs.readFileSync(path.join(raiz,"js","ui.js"),"utf8");
if(!version){ errores++; process.stderr.write("Falta VERSION en js/util.js\n"); }
if(/id="verBadge">\s*\d/.test(index)){ errores++; process.stderr.write("El badge duplica la versión; debe llenarse desde util.js.\n"); }
if(/saveVer\s*:\s*1/.test(ui)){ errores++; process.stderr.write("La exportación duplica la versión de partida; debe usar SAVE_VER.\n"); }
/* 7.9149 · cada club con historia real en el juego tiene su ficha de hechos con fuente (scripts/historia/<ID>.json), con la
   misma fuente y fecha de consulta: lo que entra a data-historia-clubes.js sale de ahí y no de la memoria de nadie */
const hist=fs.readFileSync(path.join(raiz,"js","data-historia-clubes.js"),"utf8");
const reClub=/^  ([A-Z]{2,4}):\{\r?\n\s+fuente:"([^"]+)", consultado:"([^"]+)"/gm;
let mh, nh=0;
while((mh=reClub.exec(hist))){
  nh++;
  const f=path.join(raiz,"scripts","historia",mh[1]+".json");
  if(!fs.existsSync(f)){ errores++; process.stderr.write("Falta scripts/historia/"+mh[1]+".json (hechos con fuente de la historia de "+mh[1]+").\n"); continue; }
  let j; try{ j=JSON.parse(fs.readFileSync(f,"utf8")); }catch(e){ errores++; process.stderr.write(mh[1]+".json no es JSON válido.\n"); continue; }
  if(!Array.isArray(j.hechos)||j.hechos.length<6){ errores++; process.stderr.write(mh[1]+".json trae menos de 6 hechos.\n"); }
  if(j.fuente!==mh[2]){ errores++; process.stderr.write(mh[1]+": la fuente de data-historia-clubes.js no es la de su .json.\n"); }
  if(j.consultado!==mh[3]){ errores++; process.stderr.write(mh[1]+": consultado "+mh[3]+" en el .js y "+j.consultado+" en el .json.\n"); }
}
if(errores){ process.exit(1); }
console.log("OK: "+archivos.length+" archivos válidos · "+nh+" historias con su ficha de hechos · Futbolini "+version);
