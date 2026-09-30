/* FUTBOLINI · test/papa_sw.mjs (7.9120) · el service worker de verdad: prende el Modo papa, junta, sirve el juego en
   un archivo, y si el paquete viene roto la guardia vuelve sola al modo normal. Necesita Playwright y python3. */
import { spawn } from "child_process";
let pw; try{ pw=await import("playwright"); }catch(e){ pw=await import("/opt/node22/lib/node_modules/playwright/index.mjs"); }
const port=20000+Math.floor(Math.random()*20000);
const srv=spawn("python3",["-m","http.server",String(port),"--bind","127.0.0.1"],{stdio:"ignore"});
let malos=0; const ok=(c,t)=>{ console.log((c?"  ✅ ":"  ❌ ")+t); if(!c) malos++; };
const esperar=ms=>new Promise(r=>setTimeout(r,ms));
let b;
try{
  await esperar(900);
  const opts={args:["--no-sandbox"]}; if(process.env.CHROME) opts.executablePath=process.env.CHROME;
  try{ b=await pw.chromium.launch(opts); }catch(e){ opts.executablePath="/opt/pw-browsers/chromium"; b=await pw.chromium.launch(opts); }
  const ctx=await b.newContext(); const p=await ctx.newPage();
  const base="http://127.0.0.1:"+port+"/index.html";
  const scripts=()=>p.evaluate(()=>[...document.querySelectorAll("script[src]")].filter(s=>/^js\//.test(s.getAttribute("src"))).length);
  await p.goto(base,{waitUntil:"load"});
  ok(await p.waitForFunction(()=>navigator.serviceWorker&&navigator.serviceWorker.controller,null,{timeout:30000}).then(()=>true).catch(()=>false),"el service worker toma el control");
  const r=await p.evaluate(()=>new Promise(res=>{ navigator.serviceWorker.addEventListener("message",ev=>{ if(ev.data&&ev.data.tipo==="papa_listo") res(ev.data); }); modoPapaSet(true,true); setTimeout(()=>res(null),60000); }));
  ok(r&&r.ok&&r.kb>500,"al prender el Modo papa el juego se junta en el equipo"+(r?" ("+Math.round(r.kb/1024*10)/10+" MB)":""));
  await p.goto(base,{waitUntil:"load"}); await esperar(1200);
  ok((await scripts())===2&&await p.evaluate(()=>self.__papaOK===1&&document.documentElement.classList.contains("papa")),"la próxima apertura llega juntada (2 archivos en vez de 130) y en Modo papa");
  ok(await p.evaluate(()=>typeof render==="function"&&!!document.getElementById("arranque")),"y el juego arranca normal (pantalla de inicio)");
  /* paquete roto: la guardia devuelve al modo normal sin pantalla en blanco */
  await p.evaluate(async()=>{ const v=VERSION; for(const k of await caches.keys()){ if(!k.startsWith("futbolini-juego-")) continue; const c=await caches.open(k); await c.put("js/_papa.js?v="+v,new Response("throw new Error('roto');",{headers:{"Content-Type":"application/javascript"}})); } });
  await p.goto(base,{waitUntil:"load"}).catch(()=>{}); await esperar(2500);
  ok(/normal=1/.test(p.url())&&(await scripts())>100&&await p.evaluate(()=>localStorage.getItem("futbolini_papa")==="0"),"con el paquete roto, la guardia apaga el Modo papa y recarga normal (sin pantalla en blanco)");
  await esperar(3000);
  ok(await p.evaluate(()=>/Modo papa no pudo cargar/.test(document.getElementById("avisos")?document.getElementById("avisos").textContent:"")),"y le avisa al jugador que volvió al normal");
  await p.goto(base,{waitUntil:"load"}); await esperar(800);
  ok((await scripts())>100&&!(await p.evaluate(()=>document.documentElement.classList.contains("papa"))),"apagado, el juego vuelve a cargar completo (modo full)");
}catch(e){ ok(false,"error: "+e.message); }
finally{ try{ await b.close(); }catch(e){} srv.kill(); }
process.exit(malos?1:0);
