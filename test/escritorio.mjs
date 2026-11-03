/* FUTBOLINI · test/escritorio.mjs (7.9146) · el escritorio Vista y el correo (Windows Mail), USADOS de verdad en un navegador:
   doble clic en los íconos, ventanas que se VEN (se mira qué hay en el centro), arrastrar, minimizar a la barra de tareas,
   maximizar, que sobrevivan a render(), leer un correo, responder (abre la decisión), Escape, cambiar de sección y volver,
   y en el celular: ventana a pantalla completa y el correo con "← Volver". Va dentro de correr_dev.sh. */
import { spawn } from "child_process";
let pw; try{ pw=await import("playwright"); }catch(e){ pw=await import("/opt/node22/lib/node_modules/playwright/index.mjs"); }
const port=20000+Math.floor(Math.random()*20000);
const srv=spawn("python3",["-m","http.server",String(port),"--bind","127.0.0.1"],{stdio:"ignore"});
let malos=0; const ok=(c,t)=>{ console.log((c?"  ✅ ":"  ❌ ")+t); if(!c) malos++; };
const esperar=ms=>new Promise(r=>setTimeout(r,ms));
/* la ventana se ve de verdad: está en pantalla, opaca y lo que hay en su centro es ella misma (no algo encima ni nada) */
const seVe=(p,id)=>p.evaluate((id)=>{ const w=document.querySelector('.vd-win[data-vd="'+id+'"]'); if(!w) return false;
  const r=w.getBoundingClientRect(), cs=getComputedStyle(w); if(r.width<50||r.height<50||cs.visibility!=="visible"||+cs.opacity<0.9) return false;
  const e=document.elementFromPoint(r.left+r.width/2,r.top+Math.min(r.height/2,140)); return !!(e&&w.contains(e)); },id);
let b;
try{
  await esperar(900);
  const opts={args:["--no-sandbox"]}; if(process.env.CHROME) opts.executablePath=process.env.CHROME;
  try{ b=await pw.chromium.launch(opts); }catch(e){ opts.executablePath="/opt/pw-browsers/chromium"; b=await pw.chromium.launch(opts); }
  for(const caso of [{nom:"PC",w:1366,h:800,movil:false},{nom:"celular",w:390,h:844,movil:true}]){
    console.log("· "+caso.nom);
    const ctx=await b.newContext({viewport:{width:caso.w,height:caso.h},serviceWorkers:"block",hasTouch:caso.movil,isMobile:caso.movil});
    const p=await ctx.newPage(); const err=[];
    p.on("pageerror",e=>err.push(e.message)); p.on("console",m=>{ if(m.type()==="error"&&!/ERR_CERT|501|favicon|Failed to load resource/.test(m.text())) err.push(m.text()); });
    await p.goto("http://127.0.0.1:"+port+"/index.html",{waitUntil:"load"});
    await p.waitForFunction(()=>typeof nuevaPartida==="function"&&document.getElementById("arranque"),null,{timeout:60000});
    await p.evaluate(()=>{ document.getElementById("arranque").remove(); window.guardar=function(){}; nuevaPartida("CC",2026,"historico"); SEC="escritorio"; render(); });
    await esperar(500);
    const ics=await p.evaluate(()=>[...document.querySelectorAll(".vd-ico")].map(x=>{ const r=x.getBoundingClientRect(); return {id:x.dataset.vd,x:Math.round(r.left),y:Math.round(r.top)}; }));
    ok(["decisiones","correo"].every(id=>ics.some(i=>i.id===id)),"íconos del escritorio: "+ics.map(i=>i.id).join(", "));
    if(!caso.movil) ok(ics.every(i=>i.x===ics[0].x)&&ics.every((i,k)=>!k||i.y>ics[k-1].y),"en PC van en columna a la izquierda, como Windows");
    ok(await p.evaluate(()=>!!document.querySelector(".vd-lateral .vd-cal")),"barra lateral con el calendario del juego");
    const abrir=async id=>{ const l=p.locator('.vd-ico[data-vd="'+id+'"]'); if(caso.movil) await l.tap(); else await l.dblclick(); await esperar(260); };
    const cerrar=async id=>{ await p.locator('.vd-win[data-vd="'+id+'"] .so-btn.cerrar').click(); await esperar(220); };
    if(!caso.movil){
      for(const i of ics){ await abrir(i.id); ok(await seVe(p,i.id),"doble clic en «"+i.id+"»: la ventana se abre y SE VE"); }
      /* arrastrar el correo por su barra de título */
      const r0=await p.evaluate(()=>{ const r=document.querySelector('.vd-win[data-vd="correo"]').getBoundingClientRect(); return {x:r.left,y:r.top}; });
      await p.mouse.move(r0.x+200,r0.y+14); await p.mouse.down(); await p.mouse.move(r0.x+120,r0.y+60,{steps:6}); await p.mouse.up();
      const r1=await p.evaluate(()=>{ const r=document.querySelector('.vd-win[data-vd="correo"]').getBoundingClientRect(); return {x:r.left,y:r.top}; });
      ok(Math.abs(r1.x-(r0.x-80))<4&&Math.abs(r1.y-(r0.y+46))<4,"se arrastra por la barra de título ("+Math.round(r0.x)+","+Math.round(r0.y)+" → "+Math.round(r1.x)+","+Math.round(r1.y)+")");
      /* minimizar → barra de tareas → volver */
      await p.locator('.vd-win[data-vd="correo"] .so-btn.min').click(); await esperar(150);
      ok(!(await seVe(p,"correo"))&&await p.locator('#vd-tareas .vd-tarea[data-vd="correo"]').count()===1,"minimizar la manda a la barra de tareas");
      await p.locator('#vd-tareas .vd-tarea[data-vd="correo"]').click(); await esperar(150);
      ok(await seVe(p,"correo"),"un clic en la barra de tareas la trae de vuelta, adelante");
      ok(await p.evaluate(()=>{ const t=document.getElementById("vd-tareas").getBoundingClientRect(), j=document.getElementById("avanceGrande"); if(!j) return true; const r=j.getBoundingClientRect(); return t.right<=r.left||t.bottom<=r.top||t.top>=r.bottom; }),"la barra de tareas no queda debajo del botón Jugar");
      /* maximizar con doble clic en la barra */
      await p.mouse.dblclick(r1.x+200,r1.y+14); await esperar(150);
      ok(await p.evaluate(()=>document.querySelector('.vd-win[data-vd="correo"]').getBoundingClientRect().width>1000),"doble clic en la barra la maximiza");
      await p.mouse.dblclick(500,(await p.evaluate(()=>document.querySelector('.vd-win[data-vd="correo"]').getBoundingClientRect().top))+14); await esperar(150);
      /* las ventanas sobreviven a render() (resolver algo repinta todo el escritorio) */
      const n0=await p.evaluate(()=>document.querySelectorAll(".vd-win").length);
      await p.evaluate(()=>render()); await esperar(200);
      ok(await p.evaluate(()=>document.querySelectorAll(".vd-win").length)===n0&&await seVe(p,"correo"),"después de render() siguen las "+n0+" ventanas abiertas");
      ok(await p.evaluate(()=>{ const w=document.querySelector('.vd-win[data-vd="decisiones"]'), c=w&&w.querySelector(".panel > .cab"); return !c||getComputedStyle(c).display==="none"; }),"adentro de la ventana el panel no repite su cabecera");
      ok(await p.evaluate(()=>!document.querySelector('.vd-win[role="dialog"]')),"ninguna ventana lleva role=dialog (7.css la escondería)");
    } else {
      await abrir("decisiones");
      ok(await seVe(p,"decisiones")&&await p.evaluate(()=>{ const r=document.querySelector('.vd-win[data-vd="decisiones"]').getBoundingClientRect(); return r.width>=innerWidth-2&&r.height>=innerHeight-2; }),"en el celular la ventana va a pantalla completa y se ve");
      await cerrar("decisiones");
      ok(!(await p.evaluate(()=>!!document.querySelector('.vd-win[data-vd="decisiones"]'))),"la X la cierra");
      await abrir("correo");
    }
    /* el correo: leer, la cuenta baja, responder abre la decisión */
    const antes=await p.evaluate(()=>{ const g=document.querySelector('.vd-ico[data-vd="correo"] .vd-glob'); return g?+g.textContent:0; });
    ok(antes>0,"el ícono de Correo avisa "+antes+" sin leer");
    ok(await p.evaluate(()=>document.querySelectorAll('.vd-win[data-vd="correo"] .wm-carpeta').length>=4&&document.querySelectorAll('.vd-win[data-vd="correo"] .wm-fila').length>0),"Windows Mail: carpetas y la lista con mensajes");
    await p.locator('.vd-win[data-vd="correo"] .wm-fila').first().click(); await esperar(150);
    const leido=await p.evaluate(()=>({nuevo:document.querySelector('.vd-win[data-vd="correo"] .wm-fila.sel').classList.contains("nuevo"),
      cab:(document.querySelector('.vd-win[data-vd="correo"] .wm-cab')||{}).textContent||"", glob:+((document.querySelector('.vd-ico[data-vd="correo"] .vd-glob')||{}).textContent||0)}));
    ok(!leido.nuevo&&/De:/.test(leido.cab)&&/Para:/.test(leido.cab),"abrir un mensaje lo marca leído y muestra De / Fecha / Para");
    ok(leido.glob===antes-1,"el globito del ícono baja ("+antes+" → "+leido.glob+")");
    if(caso.movil){
      ok(await p.evaluate(()=>{ const v=document.querySelector('.vd-win[data-vd="correo"] .wm-volver'); return !!v&&getComputedStyle(v).display!=="none"; }),"en el celular el mensaje ocupa la pantalla con «← Volver»");
      await p.locator('.vd-win[data-vd="correo"] .wm-volver').tap(); await esperar(120);
      ok(await p.evaluate(()=>getComputedStyle(document.querySelector('.vd-win[data-vd="correo"] .wm-lista')).display!=="none"),"«← Volver» vuelve a la lista");
      await p.locator('.vd-win[data-vd="correo"] .wm-fila').first().tap(); await esperar(120);
    }
    await p.locator('.vd-win[data-vd="correo"] .wm-vista .btn-aqua').click(); await esperar(250);
    ok(await p.evaluate(()=>{ const m=document.getElementById("capa-modal"); return !!(m&&m.children.length); }),"«Responder» abre la decisión de verdad");
    await p.evaluate(()=>{ if(typeof cerrarModal==="function") cerrarModal(); }); await esperar(150);
    if(!caso.movil){
      const n1=await p.evaluate(()=>document.querySelectorAll(".vd-win:not(.vd-sale)").length);
      await p.keyboard.press("Escape"); await esperar(220);
      ok(await p.evaluate(()=>document.querySelectorAll(".vd-win").length)===n1-1,"Escape cierra la ventana de adelante");
    }
    /* cambiar de sección: no quedan ventanas flotando; al volver, vuelven */
    const quedan=await p.evaluate(()=>document.querySelectorAll(".vd-win").length);
    await p.evaluate(()=>{ irA("plantel"); }); await esperar(200);
    ok(await p.evaluate(()=>document.querySelectorAll(".vd-win").length===0&&!document.getElementById("vd-tareas")),"en otra sección no quedan ventanas flotando");
    await p.evaluate(()=>{ irA("escritorio"); }); await esperar(250);
    ok(await p.evaluate(()=>document.querySelectorAll(".vd-win").length)===quedan,"al volver al Escritorio vuelven las "+quedan+" ventanas");
    ok(!err.length,"sin errores en la página"+(err.length?": "+err.slice(0,3).join(" | "):""));
    await ctx.close();
  }
} catch(e){ ok(false,"la prueba explotó: "+e.message); }
finally{ if(b) await b.close(); srv.kill(); }
console.log(malos?"❌ ESCRITORIO: "+malos+" falla(s)":"✅ ESCRITORIO VISTA: íconos, ventanas que se ven, se arrastran, se minimizan, se maximizan, sobreviven al repintado, y Windows Mail");
process.exit(malos?1:0);
