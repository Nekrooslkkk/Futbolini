/* FUTBOLINI · test/banco.mjs (7.9146) · el banco por equipo con tiempo REAL (Playwright): una pestaña por tanda, en paralelo,
   cada una con test/banco.js adentro (la misma página de siempre). Escribe la salida de cada tanda en <dir>/out<i>.txt para
   que test/banco.sh sume igual que antes. Antes era Chrome con --virtual-time-budget, que en el Chromium 153 ya no se
   adelanta (se colgaba hasta el timeout). Uso: node test/banco.mjs <dir> <temps> <tanda>... */
import { spawn } from "child_process";
import fs from "fs";
let pw; try{ pw=await import("playwright"); }catch(e){ pw=await import("/opt/node22/lib/node_modules/playwright/index.mjs"); }
const [dir,temps,...tandas]=process.argv.slice(2);
const port=20000+Math.floor(Math.random()*20000);
const srv=spawn("python3",["-m","http.server",String(port),"--bind","127.0.0.1"],{stdio:"ignore"});
let b;
try{
  await new Promise(r=>setTimeout(r,900));
  const opts={args:["--no-sandbox"]}; if(process.env.CHROME) opts.executablePath=process.env.CHROME;
  try{ b=await pw.chromium.launch(opts); }catch(e){ opts.executablePath="/opt/pw-browsers/chromium"; b=await pw.chromium.launch(opts); }
  await Promise.all(tandas.map(async(T,i)=>{
    let out="NO OUT (tanda "+T+") · BANCO_DONE:FAIL";
    try{
      const ctx=await b.newContext({viewport:{width:1366,height:800},serviceWorkers:"block"});   /* cada tanda, navegador limpio */
      const p=await ctx.newPage();
      await p.goto("http://127.0.0.1:"+port+"/_banco_tmp.html?temps="+(temps||1)+"#"+T,{waitUntil:"load"});
      await p.waitForFunction(()=>/BANCO_DONE:/.test((document.getElementById("out")||{}).textContent||""),null,{timeout:1500000,polling:1000});
      out=await p.evaluate(()=>document.getElementById("out").textContent);
      await ctx.close();
    } catch(e){ out+="\n"+e.message; }
    fs.writeFileSync(dir+"/out"+i+".txt",out+"\n");
  }));
} finally{ if(b) await b.close(); srv.kill(); }
