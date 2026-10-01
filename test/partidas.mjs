/* FUTBOLINI · test/partidas.mjs (7.9125) · PARTIDA PERDIDA, de punta a punta en el navegador de verdad (Playwright,
   tiempo real: IndexedDB no corre bajo --virtual-time-budget, por eso esto no va en doctor.sh).
   El bug del autor: con ~9 partidas localStorage se llenaba, el juego decía "guardado" sin guardar y "Continuar" no
   abría la partida. Se prueba lo que vería él: navegador lleno con el formato viejo → abrir 7.9125 → todo de vuelta. */
import { spawn } from "child_process";
let pw; try{ pw=await import("playwright"); }catch(e){ pw=await import("/opt/node22/lib/node_modules/playwright/index.mjs"); }
const port=20000+Math.floor(Math.random()*20000);
const srv=spawn("python3",["-m","http.server",String(port),"--bind","127.0.0.1"],{stdio:"ignore"});
let malos=0; const ok=(c,t)=>{ console.log((c?"  ✅ ":"  ❌ ")+t); if(!c) malos++; };
const esperar=ms=>new Promise(r=>setTimeout(r,ms));
const base="http://127.0.0.1:"+port+"/index.html";
let b;
async function abrir(p){
  await p.goto(base,{waitUntil:"load"});
  await p.waitForFunction(()=>typeof nuevaPartida==="function"&&document.getElementById("arranque"),null,{timeout:60000});
  await p.waitForFunction(()=>typeof PARTIDAS!=="undefined"&&PARTIDAS.estado,null,{timeout:20000}).catch(()=>{});
  await esperar(400);
}
const botones=p=>p.evaluate(()=>[...document.querySelectorAll("#arranque .arranque-btn")].map(x=>x.textContent));
try{
  await esperar(900);
  const opts={args:["--no-sandbox"]}; if(process.env.CHROME) opts.executablePath=process.env.CHROME;
  try{ b=await pw.chromium.launch(opts); }catch(e){ opts.executablePath="/opt/pw-browsers/chromium"; b=await pw.chromium.launch(opts); }

  /* 1) el navegador como lo dejó la 7.9122: 9 partidas en localStorage (casi lleno), y la última sin datos */
  console.log("· navegador lleno con el formato viejo → abrir esta versión");
  let ctx=await b.newContext({serviceWorkers:"block"}), p=await ctx.newPage();
  const errores=[]; p.on("pageerror",e=>errores.push(e.message));
  await abrir(p);
  const lleno=await p.evaluate(async()=>{
    document.getElementById("arranque").remove();
    window.guardar=function(){};
    nuevaPartida("CC",2026,"historico"); E.flags.diosNoEchar=true; simularTemporadas(1);
    const molde=JSON.stringify(E); localStorage.clear();
    const clubes=[["CC","Colo-Colo"],["UCH","Universidad de Chile"],["UC","Universidad Católica"],["COB","Cobresal"],["PAL","Palestino"],["AUD","Audax Italiano"],["EVE","Everton"],["HUA","Huachipato"],["COQ","Coquimbo Unido"]];
    const lista=[]; let t=Date.now()-20*3600e3, lleno=false;
    clubes.forEach(([c,n],i)=>{
      const est=JSON.parse(molde); est.club=c; est.clubNombre=n; est._slot="pv"+i; delete est._guardadoEn;
      try{ localStorage.setItem("futbolini3_partida_"+est._slot,JSON.stringify(est)); }catch(e){ lleno=true; }
      lista.push({id:est._slot,club:c,clubNombre:n,anio:est.anio,epoca:"",modo:"historico",gen:1,guardado:(t+=3600e3)});
    });
    lista.push({id:"pvPerdida",club:"OHI",clubNombre:"O'Higgins",anio:2027,epoca:"",modo:"historico",gen:1,guardado:t+3600e3});   /* nunca se escribió */
    localStorage.setItem("futbolini3_slots",JSON.stringify(lista));
    localStorage.setItem("futbolini3_activo",JSON.stringify("pvPerdida"));
    const act=JSON.parse(molde); act.club="HUA"; act.clubNombre="Huachipato"; act._slot="pv7";
    try{ localStorage.setItem("futbolini3_save",JSON.stringify(act)); }catch(e){ lleno=true; }
    return {uso:partidasUsoLS(), lleno:lleno};
  });
  ok(lleno.uso>4e6,"armado: localStorage con "+Math.round(lleno.uso/1e5)/10+" M de caracteres (casi lleno, como el del autor)");
  await abrir(p);
  await p.waitForFunction(()=>PARTIDAS.estado&&PARTIDAS.estado.enBD>=9,null,{timeout:30000}).catch(()=>{});
  const tras=await p.evaluate(()=>({uso:partidasUsoLS(), enBD:PARTIDAS.estado.enBD, quedanLS:_lsLlavesPartida().length, sinDatos:PARTIDAS.estado.sinDatos}));
  ok(tras.enBD===9&&tras.quedanLS===0,"las 9 partidas se mudaron solas a IndexedDB (en BD: "+tras.enBD+", quedan en localStorage: "+tras.quedanLS+")");
  ok(tras.uso<1.2e6,"localStorage queda liviano: "+Math.round(tras.uso/1e5)/10+" M de caracteres (antes "+Math.round(lleno.uso/1e5)/10+")");
  ok(tras.sinDatos.length===1&&tras.sinDatos[0]==="pvPerdida","la que nunca se guardó queda marcada «sin datos» ("+tras.sinDatos.join(",")+")");
  let bs=await botones(p);
  ok(/^▶ Continuar · Coquimbo/.test(bs[0]||""),"el primer botón es «Continuar» con la última partida que SÍ tiene datos ("+(bs[0]||"").slice(0,40)+")");
  ok(/^⚠️ O'Higgins/.test(bs[bs.length-2]||"")&&/sin datos/.test(bs[bs.length-2]||""),"la partida sin datos va al final y lo dice (no es un botón mudo)");
  await p.click("#arranque .arranque-btn >> nth=0"); await esperar(1500);
  let st=await p.evaluate(()=>({E:E&&E.club, arr:!!document.getElementById("arranque")}));
  ok(st.E==="COQ"&&!st.arr,"Continuar abre la partida (Coquimbo) y entra al juego");
  ok(errores.length===0,"sin errores en la página"+(errores.length?": "+errores.slice(0,3).join(" | "):""));
  await ctx.close();

  /* 2) jugar 12 partidas: todas se guardan, localStorage no crece, y cada una vuelve a abrir */
  console.log("· 12 partidas jugadas y guardadas");
  ctx=await b.newContext({serviceWorkers:"block"}); p=await ctx.newPage();
  await abrir(p);
  const doce=await p.evaluate(async()=>{
    document.getElementById("arranque").remove();
    const clubes=["CC","UCH","UC","COB","PAL","AUD","EVE","HUA","COQ","OHI","IQU","LSE","ULC","NUB","DLS","UES"], out=[];
    for(const c of clubes){
      if(out.length>=12) break;
      E=null; nuevaPartida(c,2026,"historico"); if(!E||E.club!==c) continue;
      E.flags.diosNoEchar=true; simularTemporadas(1);
      const r=await guardarAhora(); out.push({c:c, ok:!!(r&&r.ok), kb:r&&r.kb});
    }
    return {out:out, uso:partidasUsoLS(), malos:out.filter(x=>!x.ok).map(x=>x.c)};
  });
  ok(doce.out.length>=10&&!doce.malos.length,doce.out.length+" partidas de ~"+(doce.out[0]&&doce.out[0].kb)+" KB guardadas, todas ok"+(doce.malos.length?" (fallaron: "+doce.malos.join(",")+")":""));
  ok(doce.uso<1.2e6,"localStorage sigue en "+Math.round(doce.uso/1e5)/10+" M de caracteres (antes se llenaba con ~9)");
  await abrir(p);
  bs=await botones(p);
  ok(bs.length===doce.out.length+1,"el inicio lista las "+doce.out.length+" partidas + «Nueva partida»");
  const alto=await p.evaluate(()=>{ const l=document.getElementById("arrLista"); return {h:l.clientHeight, sh:l.scrollHeight, vh:innerHeight, doc:document.getElementById("arranque").scrollHeight}; });
  ok(alto.sh>alto.h&&alto.h<=alto.vh*0.5,"la lista tiene su propio scroll ("+alto.h+" px de "+alto.sh+") y no agranda la pantalla");
  await p.click("#arranque .arranque-btn >> nth=6"); await esperar(1500);
  st=await p.evaluate(()=>({E:E&&E.club, arr:!!document.getElementById("arranque")}));
  ok(!!st.E&&!st.arr,"una del medio de la lista abre ("+st.E+")");
  /* cierre brusco: la copia rápida es más nueva que IndexedDB → al volver manda la más nueva, y se asienta en la base */
  const brusco=await p.evaluate(async()=>{
    await guardarAhora(); const id=E._slot;
    const est=JSON.parse(JSON.stringify(E)); est._guardadoEn=E._guardadoEn+5000; est._marcaPrueba="cierre-brusco";
    localStorage.setItem(LLAVE,JSON.stringify(est));   /* lo único que alcanzó a quedar al cerrar la pestaña */
    return id;
  });
  await abrir(p);
  await p.click("#arranque .arranque-btn >> nth=0"); await esperar(1200);
  st=await p.evaluate(async(id)=>{ const r=await bdLeer(id); return {marca:E&&E._marcaPrueba, slot:E&&E._slot, bd:r?_jsonPartida(r.txt)._marcaPrueba:null}; },brusco);
  ok(st.slot===brusco&&st.marca==="cierre-brusco","tras un cierre brusco, Continuar abre lo último (la copia rápida más nueva)");
  ok(st.bd==="cierre-brusco","y al abrir, esa copia quedó asentada en IndexedDB");
  /* el doctor en el navegador de verdad (con IndexedDB) */
  const doc=await p.evaluate(async()=>{ const r=await devDoctorCompleto({area:"motor",sinHistoria:true}); return r.checks.filter(c=>c.asinc).map(c=>({id:c.id, ok:c.ok, txt:c.txt, d:(c.detalle||[]).slice(0,3)})); });
  doc.forEach(c=>ok(c.ok,"doctor "+c.id+": "+c.txt+(c.ok?"":" · "+c.d.join(" · "))));
  ok(doc.length>=3,"el doctor corre sus "+doc.length+" chequeos asíncronos de partidas");
  await ctx.close();

  /* 3) sin IndexedDB y con el navegador lleno: no miente, ofrece descargar, y al haber espacio vuelve a guardar */
  console.log("· sin IndexedDB y lleno");
  ctx=await b.newContext({serviceWorkers:"block"});
  await ctx.addInitScript(()=>{ try{ Object.defineProperty(window,"indexedDB",{get(){ return undefined; }}); }catch(e){} });
  p=await ctx.newPage(); await abrir(p);
  const sin=await p.evaluate(async()=>{
    document.getElementById("arranque").remove();
    nuevaPartida("UC",2026,"historico");
    await guardarAhora();   /* la copia rápida y la ranura ya existen con la versión anterior */
    let n=0; [400000,40000,4000,400].forEach(tam=>{ const r="x".repeat(tam); try{ for(;;){ localStorage.setItem("relleno"+(n++),r); } }catch(e){} });
    E.notifs=(E.notifs||[]).concat([{t:"relleno para que no quepa",d:"y".repeat(3000)}]);   /* un poco más grande que lo guardado */
    const r1=await guardarAhora();
    const cartel=document.getElementById("guardadoFallo"), reloj=document.getElementById("guardadoTxt");
    const a={ok:r1&&r1.ok, parcial:r1&&r1.parcial, err:r1&&r1.err, cartel:!!cartel&&/Descargar/.test(cartel.textContent), reloj:reloj?reloj.textContent:""};
    for(let k=0;k<n;k++) localStorage.removeItem("relleno"+k);
    const r2=await guardarAhora();
    return {a:a, ok2:r2&&r2.ok, donde2:r2&&r2.donde.join("+"), cartel2:!!document.getElementById("guardadoFallo"), bd:!!PARTIDAS.bd};
  });
  ok(!sin.bd,"(sin IndexedDB de verdad en esta prueba)");
  ok(sin.a.ok===false,"lleno: guardar dice que NO guardó ("+sin.a.err+")");
  ok(sin.a.cartel&&!/^guardado/.test(sin.a.reloj),"lleno: cartel con «Descargar partida» y el reloj dice «"+sin.a.reloj+"»");
  ok(sin.ok2&&!sin.cartel2,"con espacio otra vez: guarda ("+sin.donde2+") y el cartel se va");
  await ctx.close();
}catch(e){ ok(false,"error: "+(e&&e.stack||e)); }
finally{ try{ await b.close(); }catch(e){} srv.kill(); }
console.log(malos?"❌ PARTIDAS: "+malos+" falla(s)":"✅ PARTIDAS: se guardan, se mudan, se recuperan y Continuar abre la última");
process.exit(malos?1:0);
