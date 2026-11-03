#!/usr/bin/env node
"use strict";
/* ============================================================
   FUTBOLINI · scripts/juntar.js — 7.9146 · arma js/juego.js (el juego en UN archivo)

   Desde 7.9145 index.html carga un solo archivo (js/juego.js) para que cualquier PC abra al tiro y sin pantalla
   blanca. Ese archivo se ARMA, no se edita: se editan los js/ de siempre y se corre
       node scripts/juntar.js
   Lee la lista en orden de js/orden.txt y junta con el MISMO código que el Modo papa (js/papa-armar.js, papaUnir):
   const/let de primer nivel pasan a var, cada archivo con su marca "/* ==== js/... ==== *\/". También copia la VERSION
   de js/util.js a index.html (título, splash, ?v=) y a js/boot-pintar.js: al subir de versión basta con cambiar util.js.
       node scripts/juntar.js --revisar
   no escribe nada: sale con error si js/juego.js quedó viejo o si hay un js/ que no está en la lista (test/correr.sh lo
   corre primero: un parche con el paquete desactualizado no pasa las pruebas).
   Sin dependencias: Node puro. Se mantiene solo.
   ============================================================ */
const fs=require("fs"), path=require("path"), vm=require("vm");
const RAIZ=path.join(__dirname,"..");
const leer=f=>fs.readFileSync(path.join(RAIZ,f),"utf8");
const AFUERA=new Set(["js/juego.js","js/boot-pintar.js"]);   /* el paquete mismo y el primer archivo chico del index */

vm.runInThisContext(leer("js/papa-armar.js"));
const lista=leer("js/orden.txt").split("\n").map(s=>s.trim()).filter(s=>s&&s[0]!=="#");
const ver=(/VERSION="([^"]+)"/.exec(leer("js/util.js"))||[])[1]||"?";

function armar(){
  const partes=lista.map(u=>({u:u, src:leer(u)}));
  let js=papaUnir(partes);
  /* la cabecera dice la versión y que no se edita a mano; al final, la lista (la usan el doctor y las pruebas) */
  js=js.replace(/^[^\n]*\n[^\n]*\n/,'"use strict";\n/* Futbolini · '+ver+' · '+partes.length+' archivos en uno, armado por scripts/juntar.js '+
    '(mismo código que js/papa-armar.js). NO SE EDITA A MANO: se editan los archivos de js/orden.txt y se corre node scripts/juntar.js */\n');
  return js+"self.JUEGO_ARCHIVOS="+JSON.stringify(lista)+";\n";
}

const faltan=lista.filter(u=>!fs.existsSync(path.join(RAIZ,u)));
const sueltos=fs.readdirSync(path.join(RAIZ,"js")).filter(f=>/\.js$/.test(f)).map(f=>"js/"+f)
  .filter(u=>!AFUERA.has(u)&&lista.indexOf(u)<0);
const repetidos=lista.filter((u,i)=>lista.indexOf(u)!==i);
const problemas=[];
if(faltan.length) problemas.push("js/orden.txt nombra archivos que no existen: "+faltan.join(", "));
if(sueltos.length) problemas.push("hay js/ que no están en js/orden.txt (no entrarían al juego): "+sueltos.join(", "));
if(repetidos.length) problemas.push("js/orden.txt repite: "+repetidos.join(", "));
if(problemas.length){ problemas.forEach(p=>console.log("❌ "+p)); process.exit(1); }

/* la versión vive en js/util.js (VERSION); el HTML (título, splash, ?v=) y boot-pintar.js la repiten: se copian de ahí */
const V="(\\d+\\.\\d+[0-9a-z]*)";
function conVersion(f,reglas){
  const viejo=leer(f); let nuevoTxt=viejo;
  reglas.forEach(r=>{ nuevoTxt=nuevoTxt.replace(new RegExp(r[0].replace("@V@",V),"g"),(m,...g)=>m.replace(g[r[1]],ver)); });
  return {f:f, viejo:viejo, nuevo:nuevoTxt};
}
const versiones=[
  conVersion("index.html",[["<title>Futbolini @V@ ",0],['name="futbolini-version" content="@V@"',0],["Versión @V@<",0],['\\?v=@V@"',0]]),
  conVersion("js/boot-pintar.js",[['var V="@V@"',0]])
];
const nuevo=armar();
if(process.argv.indexOf("--revisar")>=0){
  const actual=fs.existsSync(path.join(RAIZ,"js/juego.js"))?leer("js/juego.js"):"";
  if(actual!==nuevo){
    console.log("❌ js/juego.js está desactualizado: alguien editó un js/ y no rearmó el paquete. Corre: node scripts/juntar.js");
    process.exit(1);
  }
  const malas=versiones.filter(x=>x.viejo!==x.nuevo).map(x=>x.f);
  if(malas.length){ console.log("❌ la versión de "+malas.join(" y ")+" no es la de js/util.js ("+ver+"). Corre: node scripts/juntar.js"); process.exit(1); }
  console.log("  js/juego.js al día ("+lista.length+" archivos, "+ver+")");
} else {
  versiones.forEach(x=>{ if(x.viejo!==x.nuevo){ fs.writeFileSync(path.join(RAIZ,x.f),x.nuevo); console.log("  versión "+ver+" puesta en "+x.f); } });
  fs.writeFileSync(path.join(RAIZ,"js/juego.js"),nuevo);
  console.log("js/juego.js armado: "+lista.length+" archivos → "+Math.round(nuevo.length/1024)+" KB ("+ver+")");
}
