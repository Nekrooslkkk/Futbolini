"use strict";
/* Servidor principal de Futbolini.
   Hoy: localhost. Mañana: el mismo archivo en el host del 1.0.
   Uso:  node servidor.js
         node servidor.js 8787
*/
const http=require("http");
const fs=require("fs");
const path=require("path");
const ROOT=__dirname;
const PORT=parseInt(process.argv[2],10)||8787;
const MIME={
  ".html":"text/html; charset=utf-8",
  ".js":"text/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".json":"application/json; charset=utf-8",
  ".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",
  ".gif":"image/gif",".svg":"image/svg+xml",".ico":"image/x-icon",
  ".mp3":"audio/mpeg",".ogg":"audio/ogg",".wav":"audio/wav",
  ".txt":"text/plain; charset=utf-8",".md":"text/plain; charset=utf-8"
};
const VERSION={nombre:"Futbolini",build:"5.1h",offline:true,ia:"heuristica-local"};

function send(res,code,body,type){
  res.writeHead(code,{"Content-Type":type||"text/plain; charset=utf-8","Cache-Control":"no-cache"});
  res.end(body);
}
function api(req,res){
  if(req.url==="/api/health"||req.url==="/api/version"){
    send(res,200,JSON.stringify(VERSION),"application/json; charset=utf-8");
    return true;
  }
  if(req.url==="/api/pensar" && req.method==="POST"){
    let raw="";
    req.on("data",c=>raw+=c);
    req.on("end",()=>{
      let j={};
      try{ j=JSON.parse(raw||"{}"); }catch(e){ j={}; }
      const t=String(j.texto||"").toLowerCase();
      let s=0;
      ["vamos","orgullo","ganar","juntos","garra"].forEach(w=>{ if(t.includes(w)) s+=10; });
      ["renunci","desastre","fracaso","asco"].forEach(w=>{ if(t.includes(w)) s-=12; });
      send(res,200,JSON.stringify({
        ok:true, offline:true, sentimiento:s,
        nota:"Heurística local. No llama a ningún modelo de pago."
      }),"application/json; charset=utf-8");
    });
    return true;
  }
  return false;
}
function safe(p){
  const full=path.normalize(path.join(ROOT,p));
  if(!full.startsWith(ROOT)) return null;
  return full;
}
const server=http.createServer((req,res)=>{
  const u=decodeURIComponent((req.url||"/").split("?")[0]);
  if(api(req,res)) return;
  let rel=u==="/"? "/index.html":u;
  const file=safe(rel);
  if(!file){ send(res,403,"forbidden"); return; }
  fs.readFile(file,(err,data)=>{
    if(err){ send(res,404,"no encontrado: "+rel); return; }
    send(res,200,data,MIME[path.extname(file)]||"application/octet-stream");
  });
});
server.listen(PORT,()=>{
  console.log("Futbolini "+VERSION.build+" → http://localhost:"+PORT+"/");
  console.log("API: /api/health  (mismo servidor para el 1.0)");
});
