/* FUTBOLINI · test/saves.mjs (7.9146) · las partidas viejas (test/saves/*.json.gz) en un navegador de verdad, con tiempo
   REAL (Playwright). Antes test/saves.sh usaba Chrome con --virtual-time-budget: en el Chromium 153 el reloj virtual ya
   no se adelanta y la prueba se colgaba 10 minutos (también con el código de 7.9141, que antes pasaba en 4 s). La
   página es la misma de siempre: index.html + test/saves.js. */
import { spawn } from "child_process";
let pw; try{ pw=await import("playwright"); }catch(e){ pw=await import("/opt/node22/lib/node_modules/playwright/index.mjs"); }
const port=20000+Math.floor(Math.random()*20000);
const srv=spawn("python3",["-m","http.server",String(port),"--bind","127.0.0.1"],{stdio:"ignore"});
let b, salida="NO OUT · SAVES_DONE:FAIL";
try{
  await new Promise(r=>setTimeout(r,900));
  const opts={args:["--no-sandbox"]}; if(process.env.CHROME) opts.executablePath=process.env.CHROME;
  try{ b=await pw.chromium.launch(opts); }catch(e){ opts.executablePath="/opt/pw-browsers/chromium"; b=await pw.chromium.launch(opts); }
  const p=await (await b.newContext({viewport:{width:1366,height:800},serviceWorkers:"block"})).newPage();
  await p.goto("http://127.0.0.1:"+port+"/_saves_tmp.html",{waitUntil:"load"});
  await p.waitForFunction(()=>/SAVES_DONE:/.test((document.getElementById("out")||{}).textContent||""),null,{timeout:600000});
  salida=await p.evaluate(()=>document.getElementById("out").textContent);
} catch(e){ salida+="\n"+e.message; }
finally{ if(b) await b.close(); srv.kill(); }
console.log(salida);
