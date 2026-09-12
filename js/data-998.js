"use strict";
/* ============================================================
   FUTBOLINI 7.998 · el partido se dirige
   8.00 sigue RESERVADA.

   5 cambios IFAB 2020+ (3 paradas), descuento 90+N, bloque y ritmo
   como palancas reales, marcador con el minuto adentro, frases del
   cuerpo técnico más chilenas, más preguntas de prensa.

   Cargar ÚLTIMO. El motor vive en partido.js / ui-partido.js;
   acá el contenido extra y un par de enganches.
   ============================================================ */

(function frases998(){
  if(typeof FRASES_CUERPO==="undefined" || !Array.isArray(FRASES_CUERPO)) return;
  [
    {ctx:"favorito",x:"Cabros, si se creen el cuento a los 10 nos la recagan. Primer gol y después lucirse."},
    {ctx:"favorito",x:"Estos partidos se pierden en el camarín, no en la cancha. Que salgan con hambre."},
    {ctx:"parejo",x:"Está parejo, profe. El que ponga más pata gana. Nada de inventar el agua caliente."},
    {ctx:"parejo",x:"Que no se asusten con el primer pelotazo. Aguantan, respiran, y el segundo palo es nuestro."},
    {ctx:"desventaja",x:"Venimos de visita y más chicos. Orden, huevo y una contra limpia. El resto es ruido."},
    {ctx:"desventaja",x:"Que corran como si les fuera la pega. Porque les va."},
    {ctx:"clasico",x:"Clásico no se juega, se pelea. El que se esconda, al banco. Sin discusión."},
    {ctx:"clasico",x:"Hoy la gente no pide fútbol lindo. Pide que no nos agachemos. Eso."},
    {ctx:"racha_mala",x:"Llevamos rato sin ganar. Hoy se corta o se pone feo de verdad. No hay tercera."},
    {ctx:"racha_mala",x:"Que salgan a morder, no a pedir permiso. El miedo se les nota en la primera pelota."},
    {ctx:"meta_cerca",x:"Estamos a un paso. Ni un córner regalado. El que se ponga nervioso, que respire afuera."},
    {ctx:"meta_cerca",x:"Tres puntos y dormimos. Uno y seguimos sufriendo. Así de simple, cabros."}
  ].forEach(function(f){
    if(!FRASES_CUERPO.some(function(x){ return x.x===f.x; })) FRASES_CUERPO.push(f);
  });
})();

(function prensa998(){
  if(typeof PREGUNTAS_BETA==="undefined" || !Array.isArray(PREGUNTAS_BETA)) return;
  [
    {sit:"previa_favorito",q:"¿Le cambiaste el bloque o el ritmo para este rival, o sales con lo de siempre?"},
    {sit:"previa_favorito",q:"Con cinco cambios, ¿piensas partir fuerte y refrescar a los 60?"},
    {sit:"post_derrota",q:"¿El plan se cayó al primer gol o nunca estuvo?"},
    {sit:"post_derrota",q:"¿Cambiaste tarde? La gente lo silbó."},
    {sit:"racha_sin_ganar",q:"¿El camarín te sigue o ya hay caras de «hasta cuándo»?"},
    {sit:"clasico_previa",q:"En el clásico, ¿bloque bajo y aguantar, o salir a comerse el partido?"},
    {sit:"post_empate",q:"¿El descuento lo sentiste eterno? ¿Por qué no cerraron el partido antes?"},
    {sit:"post_empate",q:"¿Un punto de local es premio o es quedarse corto?"},
    {sit:"post_clasico",q:"¿El clásico te dejó el camarín entero o hay que recoger los pedazos?"},
    {sit:"post_goleada",q:"¿El ritmo vertiginoso se nota o fue el rival que se desarmó solo?"},
    {sit:"arbitro",q:"¿El descuento fue justo o te pareció largo a propósito?"},
    {sit:"figura_juvenil",q:"El pibe aguantó 90. ¿Lo ves para el clásico o lo cuidas?"}
  ].forEach(function(p){
    if(!PREGUNTAS_BETA.some(function(x){ return x.q===p.q; })) PREGUNTAS_BETA.push(p);
  });
})();

(function wrapFrase998(){
  if(typeof fraseCuerpoTecnico!=="function" || fraseCuerpoTecnico._f998) return;
  var orig=fraseCuerpoTecnico;
  fraseCuerpoTecnico=function(part){
    try{
      if(typeof E!=="undefined"&&E&&E.tactica){
        if(E.tactica.ritmo==="Vertiginoso" && Math.random()<0.35)
          return "Vas a ritmo vertiginoso. Primera media hora de infarto; si no entra, las piernas pesan.";
        if(E.tactica.bloque==="Alto" && E.tactica.presion==="Baja")
          return "Bloque alto y presión baja se pelean, profe. O empujamos arriba o nos replegamos. Las dos no.";
        if(E.tactica.bloque==="Bajo" && E.tactica.mentalidad==="Ultraofensivo")
          return "Bloque bajo con mentalidad ultraofensiva: el equipo no va a entender si sale o se esconde.";
      }
    }catch(e){}
    return orig(part);
  };
  fraseCuerpoTecnico._f998=true;
})();
