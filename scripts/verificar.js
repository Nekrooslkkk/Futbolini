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
if(!version){ errores++; process.stderr.write("Falta VERSION en js/util.js\n"); }
if(/id="verBadge">\s*\d/.test(index)){ errores++; process.stderr.write("El badge duplica la versión; debe llenarse desde util.js.\n"); }
if(errores){ process.exit(1); }
console.log("OK: "+archivos.length+" archivos válidos · Futbolini "+version);
