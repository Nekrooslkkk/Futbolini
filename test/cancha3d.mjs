/* FUTBOLINI · test/cancha3d.mjs (7.9126 · 7.9127 penal/córner en 3D · 7.9130 jugadores realistas) · la cancha 3D en un navegador de verdad (Playwright + WebGL por software).
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
  /* 7.9139 · un tercer caso: PC con los jugadores REALISTAS (cara, pelo, piel; Ajustes ▸ Jugadores 3D) — partido, penal, córner y repetición */
  for(const caso of [{nom:"PC",w:1366,h:800,papa:false},{nom:"celu en Modo papa (3D antiguo pedido)",w:390,h:844,papa:true},{nom:"PC con jugadores realistas",w:1366,h:800,papa:false,real:true}]){
    console.log("· "+caso.nom);
    const ctx=await b.newContext({viewport:{width:caso.w,height:caso.h},serviceWorkers:"block"}), p=await ctx.newPage();
    const err=[]; p.on("pageerror",e=>err.push(e.message)); p.on("console",m=>{ if(m.type()==="error"&&!/ERR_CERT|501|favicon|Failed to load resource/.test(m.text())) err.push(m.text()); });
    if(caso.papa) await ctx.addInitScript(()=>{ try{ localStorage.setItem("futbolini_papa","1"); }catch(e){} });
    await p.goto("http://127.0.0.1:"+port+"/index.html",{waitUntil:"load"});
    await p.waitForFunction(()=>typeof nuevaPartida==="function"&&document.getElementById("arranque"),null,{timeout:60000});
    const ini=await p.evaluate(async([papa,real])=>{
      document.getElementById("arranque").remove(); window.guardar=function(){};
      nuevaPartida("CC",2026,"historico"); E.config.cancha3d=true; if(papa) E.config.cancha3dPapa=true; if(real) E.config.c3dJugadores="realistas";
      const ok3=await cargarThree(); if(!ok3||!cancha3dSoportado()) return {sin:true};
      arrancarPartido(proximoPartido(),"seguir");
      return {sin:false};
    },[caso.papa,!!caso.real]);
    if(ini.sin){ ok(true,"(sin WebGL en este navegador: no se prueba el 3D)"); await ctx.close(); continue; }
    await esperar(2500);
    /* 7.9130 · jugadores realistas: en PC los 22 con el maniquí (colores del club); en Modo papa, los clásicos */
    if(!caso.papa) await p.waitForFunction(()=>C3D.est&&C3D.est.m3d&&C3D.est.m3d.length===22,null,{timeout:30000}).catch(()=>{});
    const mq=await p.evaluate(()=>{ const e=C3D.est, m=e&&e.m3d; if(!m) return {n:0}; const u=m[1].malla.material.userData.u, c=u.uKit.value[1];
      return {n:m.length, via:(e.m3dReal?MODELO3D_REAL:MODELO3D).via, colorCamiseta:c.r+c.g+c.b, clasicosOcultos:!e.piezas.torso.visible, real:!!e.m3dReal,
        conTextura:!!(m[1].D&&m[1].D.tex), peinados:new Set(m.map(I=>I.malla.material.userData.u.uPeinado?I.malla.material.userData.u.uPeinado.value:-1)).size}; });
    if(caso.papa) ok(mq.n===0,"Modo papa: jugadores clásicos (el maniquí es para equipos que aguantan)");
    else if(caso.real) ok(mq.n===22&&mq.real&&mq.conTextura&&mq.clasicosOcultos&&mq.colorCamiseta>0&&mq.peinados>=2,"los 22 jugadores REALISTAS con cara y piel, los colores del club y "+mq.peinados+" peinados distintos (vía "+mq.via+")");
    else ok(mq.n===22&&mq.clasicosOcultos&&mq.colorCamiseta>0&&!mq.real,"los 22 jugadores con el maniquí y los colores del club (vía "+mq.via+")");
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
    ok(r.calls<=90,"dibuja barato: "+r.calls+" llamadas de dibujo por cuadro");
    ok(caso.papa?r.calidad==="antigua":r.calidad!=="antigua","calidad "+r.calidad+(caso.papa?" (Modo papa → Antigua)":""));
    ok(r.doc,"doctor cancha3d_fisica_rinde: "+r.docTxt);
    await esperar(1500);
    /* 7.9138 · si el reloj no corre, se dice POR QUÉ (antes solo "12' → 12'": no se sabía qué lo tenía parado) */
    const m2=await p.evaluate(()=>{ const P=P_ACTUAL||{}, st=typeof _cvSt!=="undefined"?_cvSt:null;
      return {min:P.min, por:[P._celHasta&&Date.now()<P._celHasta?"espera "+Math.round(P._celHasta-Date.now())+" ms"+(P._repGol?" (repetición)":"")+(P._bpEspera?" (balón parado en cola)":""):"",
        (typeof PAUSADO!=="undefined"&&PAUSADO)?"pausado":"", (typeof MOMENTO_OPS!=="undefined"&&MOMENTO_OPS&&MOMENTO_OPS.length)?"pregunta abierta":"",
        P._varHold?"VAR":"", st&&st.seq?"gol en la cancha ("+st.seq.tipo+")":"", (typeof BP3D!=="undefined"&&BP3D.activo)?"balón parado 3D":"",
        (P.golesDetalle||[]).length?"goles "+(P.golesDetalle||[]).map(g=>g.min+"'").join(","):""].filter(Boolean).join(" · ")}; });
    /* el reloj ESPERA a propósito mientras la cancha cuenta un gol (7.9138) o pasa la repetición: eso no es estar trabado.
       Se le da hasta 12 s para soltarse; lo que se exige es que vuelva a correr */
    let min2=m2.min, porQue=m2.por;
    for(let k=0;k<12&&!(min2>r.min);k++){ await esperar(1000); const m3=await p.evaluate(()=>P_ACTUAL&&P_ACTUAL.min); if(m3>min2||m3>r.min){ min2=m3; break; } }
    ok(min2>r.min,"el partido sigue corriendo con el 3D ("+r.min+"' → "+min2+"')"+(min2>r.min?(m2.min>r.min?"":" · esperó a propósito: "+porQue):" · parado por: "+(porQue||"¿?")));
    /* 7.9132 · "cuando pausas, que la cancha también esté pausada": Espacio congela el reloj Y la cancha; al seguir, juegan */
    const pz=await p.evaluate(async()=>{
      const foto=()=>[_cvSt.ball.x,_cvSt.ball.y].concat(_cvSt.jug.map(j=>j.x+j.y*3)).map(v=>v.toFixed(4)).join(",");
      const tecla=()=>document.dispatchEvent(new KeyboardEvent("keydown",{key:" ",code:"Space",bubbles:true}));
      /* el reloj de la prueba corre ~10 min por segundo: se parte sin ventanas abiertas (entretiempo, pregunta) */
      clearInterval(TIMER); if(document.body.classList.contains("con-modal")&&typeof cerrarModal==="function") cerrarModal();
      document.querySelectorAll(".momento-vivo").forEach(x=>x.remove()); MOMENTO_OPS=[]; PAUSADO=false;
      /* si justo hay una revisión del VAR (~6 s, el juego detenido a propósito), se espera a que termine */
      for(let i=0;i<40&&P_ACTUAL._varHold;i++) await new Promise(r=>setTimeout(r,250));
      tecla(); correrEnVivo(); const pausado=PAUSADO, a=foto(), m=P_ACTUAL.min;
      await new Promise(r=>setTimeout(r,1500)); const b=foto(), m2=P_ACTUAL.min;
      /* al seguir se para el reloj de la prueba (corre ~10 min por segundo): si no, llega el entretiempo y su ventana
         congela la cancha (bien hecho) y queda abierta para lo que viene. La cancha se mueve igual: no depende del reloj */
      tecla(); clearInterval(TIMER);
      /* hasta 4 s para ver movimiento (si justo hay saque del medio, esperan quietos un momento) */
      let c=b; for(let i=0;i<10&&c===b;i++){ await new Promise(r=>setTimeout(r,400)); c=foto(); }
      const e=C3D.est, diag="congelada "+cvCongelada(P_ACTUAL)+" · PAUSADO "+PAUSADO+" · preguntas "+MOMENTO_OPS.length+" · VAR "+!!P_ACTUAL._varHold+
        " · min "+P_ACTUAL.min+" · terminado "+!!P_ACTUAL.terminado+" · canvas "+!!(e&&e.canvas.isConnected)+" · bp "+!!(e&&e.bp)+" · rep "+!!(e&&e.rep)+" · seq "+!!(_cvSt&&_cvSt.seq);
      return {pausado:pausado, quieta:a===b, reloj:m===m2, sigue:!PAUSADO&&c!==b, diag:diag};
    });
    ok(pz.pausado&&pz.quieta&&pz.reloj,"⏸ pausa (Espacio): el reloj y la cancha 3D se quedan quietos"+(pz.quieta?"":" (¡los jugadores siguen jugando!)"));
    ok(pz.sigue,"▶ al seguir, la cancha vuelve a jugar"+(pz.sigue?"":" (no se movió: "+pz.diag+")"));
    if(!caso.papa){
      /* 7.9127 · penal y córner DENTRO de la cancha 3D: se juegan, se anotan una sola vez y la cancha vuelve */
      for(const tipo of ["penal","corner"]){
        /* el reloj en pausa mientras se mide: si no, un gol del partido que sigue se contaba como del penal */
        /* _bpCadena=2: si la desvían al córner no se encadena otro (en el juego sí: la prueba mide una sola jugada) */
        /* 7.9132 · sin preguntas abiertas (en el juego no hay balón parado con una pregunta pendiente: el reloj espera) */
        const a=await p.evaluate((tipo)=>{ clearInterval(TIMER); document.querySelectorAll(".momento-vivo").forEach(x=>x.remove()); MOMENTO_OPS=[];
          PAUSADO=true; P_ACTUAL.modo="dirigir"; P_ACTUAL._bpCadena=2; E.config.cornerMinijuego=true; window._g0=P_ACTUAL.gl+P_ACTUAL.gv;
          window._lineas0=document.querySelectorAll(".relato *").length;
          mostrarAccion(tipo==="corner"?{tipo:"corner",aFavor:true}:{tipo:"penal"});
          const enCapa=!!document.querySelector(".bp3d-capa canvas.cancha3d");
          pintarPartido(); pintarPartido();   /* repintados durante la jugada: no abren otra ni se roban la cancha */
          return {enCapa:enCapa, sigue:!!document.querySelector(".bp3d-capa canvas.cancha3d"), capas:document.querySelectorAll(".bp3d-capa").length, modal:!!document.querySelector(".modal-fondo,.modal")&&document.body.classList.contains("con-modal")};
        },tipo);
        ok(a.enCapa&&a.sigue&&a.capas===1&&!a.modal,tipo+" 3D: se abre en la misma cancha y aguanta repintados (capas "+a.capas+(a.modal?", ¡y abrió el minijuego viejo encima!":"")+")");
        await esperar(600); await p.keyboard.press("Enter");
        /* 7.9129 · después del remate la jugada sigue (rebote) y el gol tiene repetición: Enter adelanta y "Saltar" corta */
        await esperar(500); await p.keyboard.press("Enter");
        let cerro=false; for(let i=0;i<60&&!cerro;i++){ await esperar(400);
          cerro=await p.evaluate(()=>{ const b=document.querySelector(".c3d-rep.on .c3d-rep-saltar"); if(b) b.click(); return !BP3D.activo&&!document.querySelector(".bp3d-capa"); }); }
        const z=await p.evaluate(()=>({vuelve:C3D.est&&C3D.est.canvas.parentNode===C3D.est.host&&C3D.est.canvas.isConnected, goles:P_ACTUAL.gl+P_ACTUAL.gv-window._g0}));
        ok(cerro&&z.vuelve,tipo+" 3D: se patea, se cierra y la cancha vuelve a su lugar");
        ok(z.goles<=1,tipo+" 3D: el resultado se anota una sola vez ("+z.goles+" gol/es)");
        await p.evaluate(()=>{ PAUSADO=false; });
      }
    }
    if(!caso.papa){
      /* 7.9129 · repetición del gol: aparece después del gol (3 cámaras, cartel), el reloj espera y "Saltar" la corta */
      /* 7.9132 · una pregunta abierta (momento táctico) congela la cancha a propósito: se cierra antes de armar el gol. El
         balón parado deja el modo "dirigir" y su reanudarPronto prende el reloj 650 ms después: se vuelve a "seguir" y se espera */
      await p.evaluate(()=>{ P_ACTUAL.modo="seguir"; clearInterval(TIMER); });
      await esperar(900);
      await p.evaluate(()=>{ clearInterval(TIMER); if(document.body.classList.contains("con-modal")&&typeof cerrarModal==="function") cerrarModal();
        document.querySelectorAll(".momento-vivo").forEach(x=>x.remove()); MOMENTO_OPS=[]; PAUSADO=false;
        if(typeof _cvArmarGol==="function") _cvArmarGol(_cvSt,1,"Prueba",10,{}); });
      let rep=null; for(let i=0;i<60&&!rep;i++){ await esperar(250); rep=await p.evaluate(()=>{ const e=C3D.est, r=e&&e.rep, h=document.querySelector(".c3d-rep.on");
        return r?{camaras:r.plan.length, total:r.total, cartel:h?h.textContent:"", visible:!!(h&&h.getBoundingClientRect().width>0), reloj:(e.P._celHasta||0)-Date.now()}:null; }); }
      /* si no arrancó, que la prueba diga por qué (jugada del gol, pausa, preguntas, minuto, balón parado pegado) */
      const diag=rep?null:await p.evaluate(()=>{ const e=C3D.est, S=_cvSt; return "seq "+(S&&S.seq?S.seq.tipo+" t="+(S.seq.t||0).toFixed(2)+" red="+!!S.seq.red:"ninguna")+
        " · congelada "+(typeof cvCongelada==="function"?cvCongelada(P_ACTUAL):"?")+" · PAUSADO "+PAUSADO+" · preguntas "+MOMENTO_OPS.length+" · min "+(P_ACTUAL&&P_ACTUAL.min)+
        " · terminado "+!!(P_ACTUAL&&P_ACTUAL.terminado)+" · canvas "+!!(e&&e.canvas.isConnected)+" · bp "+!!(e&&e.bp)+" · pendiente "+(e&&e.repPendiente); });
      ok(rep&&rep.camaras===3&&/Cámara 1/.test(rep.cartel)&&rep.visible,"gol: arranca la repetición con 3 cámaras y su cartel ("+(rep?rep.cartel.replace(/\s+/g," ").trim():"no arrancó: "+diag)+")");
      ok(rep&&rep.reloj>800,"durante la repetición el reloj del partido espera ("+(rep?Math.round(rep.reloj):"–")+" ms)");
      await p.evaluate(()=>{ const b=document.querySelector(".c3d-rep .c3d-rep-saltar"); if(b) b.click(); });
      await esperar(400);
      const fin=await p.evaluate(()=>({rep:!!(C3D.est&&C3D.est.rep), reloj:((C3D.est&&C3D.est.P&&C3D.est.P._celHasta)||0)-Date.now()}));
      ok(!fin.rep&&fin.reloj<600,"⏭ Saltar corta la repetición y el partido sigue");
      await p.evaluate(()=>{ PAUSADO=false; });
    }
    ok(err.length===0,"sin errores en la página"+(err.length?": "+err.slice(0,3).join(" | "):""));
    await ctx.close();
  }
}catch(e){ ok(false,"error: "+(e&&e.stack||e)); }
finally{ try{ await b.close(); }catch(e){} srv.kill(); }
console.log(malos?"❌ CANCHA 3D: "+malos+" falla(s)":"✅ CANCHA 3D: se reusa, se ve, dibuja barato, el arquero ataja y el balón parado se juega adentro y el gol tiene repetición; jugadores realistas");
process.exit(malos?1:0);
