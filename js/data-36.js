"use strict";
/* ============================================================
   FUTBOLINI 7.36 · data-36.js
   Cargar ÚLTIMO (después de data-35.js).
   Relato de arranque más vivo. Conserva _beta y _35.
   Nombres reales OK; stats estimadas; NUNCA citas inventadas.
   ============================================================ */
(function(){
  if(typeof fraseRelato!=="function" || fraseRelato._36) return;
  var orig=fraseRelato;
  fraseRelato=function(P,min){
    try{
      if(min<12 && Math.random()<0.62){
        var riv=(P&&P.part&&P.part.rivalNombre)||"el rival";
        var sede=(P&&P.part&&P.part.sede)||"el estadio";
        var inicio=[
          "Rueda la pelota en "+sede+". Los dos se miden.",
          "Primeros minutos: nadie quiere equivocarse primero.",
          "La tribuna empuja. "+riv+" se planta.",
          "Toque, toque, y todavía no hay profundidad.",
          "El partido pide paciencia. Hay tiempo.",
          "Salida limpia. Se busca el primer centro.",
          "Falta tempranera. El árbitro marca el tono.",
          "Un pelotazo largo para probar si hay espacio atrás.",
          "El arquero manda largo. Se arma la primera pelea arriba."
        ];
        if(P&&P.clasico) inicio.push("Clásico desde el minuto uno. Cada pelota pesa.");
        return inicio[Math.floor(Math.random()*inicio.length)];
      }
    }catch(e){}
    return orig(P,min);
  };
  fraseRelato._beta=!!orig._beta;
  fraseRelato._35=!!orig._35;
  fraseRelato._36=true;
})();
