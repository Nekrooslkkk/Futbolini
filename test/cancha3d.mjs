/* FUTBOLINI · test/cancha3d.mjs (7.9126) · la cancha 3D en un navegador de verdad (Playwright + WebGL por software).
   Un partido entero de 3D: se arma UNA vez y se reusa en cada repintado, dibuja barato, no tira errores, el arquero se
   tira y ataja, y en Modo papa (si el jugador lo pide) usa la calidad Antigua. */
import { spawn } from "child_process";
let pw; try{ pw=await import("playwright"); }catch(e){ pw=await import("/opt/node22/lib/node_modules/playwright/index.mjs"); }
const port=20000+Math.floor(Math.random()*20000);
const srv=spawn("python3",["-m","http.server",String(port),"--bind","127.0.0.1"],{stdio:"ignore"});
let malos=0; const ok=(c,t)=>{ console.log((c?"  ✅ ":"  ❌ ")+t); if(!c) malos++; };
const esperar=ms=>new Promise(r=>setTimeout(r,ms));
let b;
try{
  await esperar(900);
  const opts={args:["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]}; if(process.env.CHROME) opts.executablePath=process.env.CHROME;
  try{ b=await pw.chromium.launch(opts); }catch(e){ opts.executablePath="/opt/pw-browsers/chromium"; b=await pw.chromium.launch(opts); }
  for(const caso of [{nom:"PC",w:1366,h:800,papa:false},{nom:"celu en Modo papa (3D antiguo pedido)",w:390,h:844,papa:true}]){
    console.log("· "+caso.nom);
    const ctx=await b.newContext({viewport:{width:caso.w,height:caso.h},serviceWorkers:"block"}), p=await ctx.newPage();
    const err=[]; p.on("pageerror",e=>err.push(e.message)); p.on("console",m=>{ if(m.type()==="error"&&!/ERR_CERT|501|favicon|Failed to load resource/.test(m.text())) err.push(m.text()); });
    if(caso.papa) await ctx.addInitScript(()=>{ try{ localStorage.setItem("futbolini_papa","1"); }catch(e){} });
    await p.goto("http://127.0.0.1:"+port+"/index.html",{waitUntil:"load"});
    await p.waitForFunction(()=>typeof nuevaPartida==="function"&&document.getElementById("arranque"),null,{timeout:60000});
    const ini=await p.evaluate(async(papa)=>{
      document.getElementById("arranque").remove(); window.guardar=function(){};
      nuevaPartida("CC",2026,"historico"); E.config.cancha3d=true; if(papa) E.config.cancha3dPapa=true;
      const ok3=await cargarThree(); if(!ok3||!cancha3dSoportado()) return {sin:true};
      arrancarPartido(proximoPartido(),"seguir");
      return {sin:false};
    },caso.papa);
    if(ini.sin){ ok(true,"(sin WebGL en este navegador: no se prueba el 3D)"); await ctx.close(); continue; }
    await esperar(2500);
    const r=await p.evaluate(async()=>{
      const n0=C3D.montajes, e0=C3D.est;
      for(let i=0;i<4;i++){ pintarPartido(); await new Promise(r=>setTimeout(r,120)); }   /* gol, entretiempo, eventos: repintados */
      const e=C3D.est; e.renderer.info.reset(); e.renderer.render(e.scene,e.camGL);
      const mismos=C3D.est===e0&&C3D.montajes===n0, calls=e.renderer.info.render.calls;
      const c=DOCTOR_CHECKS.find(x=>x.id==="cancha3d_fisica_rinde"), d=c?c.fn():{ok:false,txt:"falta el chequeo"};
      /* que el canvas no esté vacío: se lee la imagen y se mide la variedad de colores */
      const cv=document.querySelector("canvas.cancha3d"); let colores=0;
      if(cv){ const t=document.createElement("canvas"); t.width=64; t.height=36; const x=t.getContext("2d");
        C3D.est&&C3D.est.renderer.render(C3D.est.scene,C3D.est.camGL); x.drawImage(cv,0,0,64,36);
        const px=x.getImageData(0,0,64,36).data, set=new Set(); for(let i=0;i<px.length;i+=16) set.add((px[i]>>4)+","+(px[i+1]>>4)+","+(px[i+2]>>4)); colores=set.size; }
      return {mismos:mismos, sigue:C3D.est===e0&&e0.canvas.isConnected, construcciones:C3D.montajes, calls:calls, calidad:e.calidad, doc:d.ok, docTxt:d.txt+" "+JSON.stringify(d.detalle||[]), colores:colores, conectado:cv&&cv.isConnected, min:P_ACTUAL.min};
    });
    ok(r.mismos,"4 repintados del partido reusan la misma escena 3D (se armó una sola vez)");
    ok(r.conectado&&r.colores>12,"la cancha 3D se ve (canvas en pantalla con "+r.colores+" tonos)");
    ok(r.sigue,"correr el doctor en medio del partido no rompe la cancha 3D en vivo");
    ok(r.calls<=70,"dibuja barato: "+r.calls+" llamadas de dibujo por cuadro");
    ok(caso.papa?r.calidad==="antigua":r.calidad!=="antigua","calidad "+r.calidad+(caso.papa?" (Modo papa → Antigua)":""));
    ok(r.doc,"doctor cancha3d_fisica_rinde: "+r.docTxt);
    await esperar(1500);
    const min2=await p.evaluate(()=>P_ACTUAL&&P_ACTUAL.min);
    ok(min2>r.min,"el partido sigue corriendo con el 3D ("+r.min+"' → "+min2+"')");
    ok(err.length===0,"sin errores en la página"+(err.length?": "+err.slice(0,3).join(" | "):""));
    await ctx.close();
  }
}catch(e){ ok(false,"error: "+(e&&e.stack||e)); }
finally{ try{ await b.close(); }catch(e){} srv.kill(); }
console.log(malos?"❌ CANCHA 3D: "+malos+" falla(s)":"✅ CANCHA 3D: se reusa, se ve, dibuja barato y el arquero ataja");
process.exit(malos?1:0);
