/* FUTBOLINI · test/pagina.mjs (7.9146) · abre una página de prueba (servida por http) con tiempo REAL y escribe lo que
   quedó en <pre id="out"> cuando aparece la marca de fin. Lo usan las pruebas que antes iban con Chrome y
   --virtual-time-budget (en el Chromium 153 el reloj virtual ya no se adelanta y se colgaban hasta el timeout).
   Uso: node test/pagina.mjs <puerto> <ruta> <MARCA_DONE> [segundos] [ancho,alto] */
let pw; try{ pw=await import("playwright"); }catch(e){ pw=await import("/opt/node22/lib/node_modules/playwright/index.mjs"); }
const [puerto,ruta,marca,seg,ven]=process.argv.slice(2);
const [w,h]=(ven||"1366,800").split(",").map(Number);
let b, salida="NO OUT · "+marca+":FAIL";
try{
  const opts={args:["--no-sandbox"]}; if(process.env.CHROME) opts.executablePath=process.env.CHROME;
  try{ b=await pw.chromium.launch(opts); }catch(e){ opts.executablePath="/opt/pw-browsers/chromium"; b=await pw.chromium.launch(opts); }
  const p=await (await b.newContext({viewport:{width:w,height:h},serviceWorkers:"block"})).newPage();
  await p.goto("http://127.0.0.1:"+puerto+"/"+ruta,{waitUntil:"load"});
  await p.waitForFunction(m=>((document.getElementById("out")||{}).textContent||"").indexOf(m+":")>=0,marca,{timeout:(+seg||500)*1000,polling:500});
  salida=await p.evaluate(()=>document.getElementById("out").textContent);
} catch(e){ try{ if(b){ const pg=b.contexts()[0]&&b.contexts()[0].pages()[0]; if(pg) salida=(await pg.evaluate(()=>(document.getElementById("out")||{}).textContent||""))+"\n"+marca+":FAIL"; } }catch(_){}
  salida+="\n("+e.message.split("\n")[0]+")"; }
finally{ if(b) await b.close(); }
console.log(salida);
