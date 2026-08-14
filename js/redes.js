"use strict";
/* ============================================================
   FUTBOLINI 4.0 · redes.js
   Ecosistema de redes PROCEDURAL: hinchas, prensa y jugadores
   postean solos reaccionando a lo que pasa (resultados, fichajes,
   ventas, precios). Campañas del Community Manager e ingresos por
   seguidores (sponsor digital). Se engancha con ia.js (posteos del DT).
   ============================================================ */

const HANDLES_HINCHA=["@hincha_de_ley","@tribuna_norte","@fanatico_del_club","@alma_y_vida","@barra_fiel","@socio_n1","@el_pueblo_manda"];
const HANDLES_PRENSA=["@DeporteTotal","@RadioGolAM","@ElBalonazo","@PelotaAlPiso","@CronicaFC","@GolpeDeArco"];
function handleJugador(){ const j=elige(E.plantel.filter(x=>!x.vendido&&!x.cedido)); return j?("@"+j.n.split(" ").pop().toLowerCase().replace(/[^a-z]/g,"")+"_of"):"@jugador"; }
function handleClub(){ return "@"+(E.clubNombre||"club").replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g,"")+"_oficial"; }

function postProc(autor,tipo,texto,tono){
  E.timeline=E.timeline||[];
  const part=proximoPartido();
  E.timeline.unshift({autor:autor,tipo:tipo,texto:texto,tono:tono||"neutro",
    fecha:(part&&part.f?fechaTxt(part.f):"cierre"),anio:E.anio,likes:ri(2,4200)});
  if(E.timeline.length>45) E.timeline.length=45;
}
function moverSeguidores(n){ E.seguidores=Math.max(0,Math.round((E.seguidores||0)+n)); }

/* reacción del ecosistema a un hecho del juego */
function redesReaccion(tipo,data){
  if(!E) return; data=data||{};
  if(tipo==="partido"){
    const dif=(data.yo||0)-(data.otro||0);
    if(dif>0){
      postProc(elige(HANDLES_HINCHA),"hincha",elige(["¡GRANDE! "+data.yo+"-"+data.otro+", a seguir así 💪","Esto es del pueblo ❤️ vamos que se puede","Le ganamos y bien merecido. ¡ARRIBA!"]),"bueno");
      if(dif>=3) postProc(elige(HANDLES_PRENSA),"prensa","Golpe de autoridad: "+data.yo+"-"+data.otro+" ante "+data.rival+". El equipo se afirma.","bueno");
      moverSeguidores(ri(200,1200)+dif*300);
    } else if(dif<0){
      postProc(elige(HANDLES_HINCHA),"hincha",elige(["Otra vez lo mismo... 😡","Así no, muchachos, la gente se cansa","Un papelón. ¿Hasta cuándo?"]),"malo");
      postProc(elige(HANDLES_PRENSA),"prensa","Derrota que enciende las alarmas: "+data.otro+"-"+data.yo+" ante "+data.rival+".","malo");
      moverSeguidores(-ri(100,800));
    } else { postProc(elige(HANDLES_HINCHA),"hincha","Empate tibio, faltó actitud.","neutro"); moverSeguidores(ri(-100,200)); }
  } else if(tipo==="ficha"){
    postProc(elige(HANDLES_HINCHA),"hincha","¡Bienvenido "+data.n+"! Ojalá rompa todo 🙌","bueno");
    postProc(handleJugador(),"jugador","Contento con la llegada de "+data.n+", suma al grupo 👊","bueno");
    moverSeguidores(ri(300,1500));
  } else if(tipo==="venta"){
    if(data.flash||data.ref){ postProc(elige(HANDLES_HINCHA),"hincha","¿Cómo van a soltar así a "+data.n+"?? Vergüenza dirigencial 🤬","malo"); moverSeguidores(-ri(400,1600)); }
    else postProc(elige(HANDLES_PRENSA),"prensa",data.n+" deja el club. Operación que ayuda a la caja.","neutro");
  } else if(tipo==="precio"){
    if(data.ratio>1.3){ postProc(elige(HANDLES_HINCHA),"hincha","Suben las entradas otra vez y el fútbol lo paga el hincha de siempre 😤","malo"); moverSeguidores(-ri(50,300)); }
    else if(data.ratio<0.85){ postProc(elige(HANDLES_HINCHA),"hincha","Entradas populares, así se llena la cancha 👏","bueno"); moverSeguidores(ri(100,500)); }
  }
}

/* campañas del Community Manager (requiere E.staff.cm) */
function campanaCM(tipo){
  if(!E.staff||!E.staff.cm){ if(typeof aviso==="function") aviso("Primero contratá un Community Manager (Finanzas)"); return; }
  if(tipo==="humo"){
    aplicarEfectos({hinchada:6,moral:2}); aplicarRep({credibilidad:-3}); moverSeguidores(ri(600,2600));
    postProc(handleClub(),"club",elige(["🔴⚪ El club más grande. Vamos por todo, familia.","Historia, gloria y futuro. Esto es "+E.clubNombre+" 💪","Nadie nos calla. Orgullo de ser de este club ❤️"]),"bueno");
    notificar({t:"Campaña de humo",tipo:"neutro",d:"El CM encendió a la gente (+hinchada, +seguidores) a costa de algo de credibilidad si después no acompañan los resultados.",bandeja:false});
  } else {
    aplicarRep({credibilidad:6,publica:2}); aplicarGrupos({prensa:5}); moverSeguidores(ri(-100,300));
    postProc(handleClub(),"club","Comunicado oficial: el club informa con transparencia sobre su situación institucional.","neutro");
    notificar({t:"Comunicado oficial",tipo:"neutro",d:"El CM emitió un comunicado serio: suma credibilidad y ordena el mensaje.",bandeja:false});
  }
  guardar();
}
/* ingreso anual por seguidores (sponsor digital), solo si hay CM */
function ingresoDigital(){ return (E.staff&&E.staff.cm)?Math.round((E.seguidores||0)*0.02):0; }
