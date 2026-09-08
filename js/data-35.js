"use strict";
/* ============================================================
   FUTBOLINI 7.35 · data-35.js
   Cargar ÚLTIMO (después de data-32.js).
   Relato que distingue histórico / libre / caos.
   Nombres reales OK; stats estimadas; NUNCA citas inventadas.
   ============================================================ */
(function(){
  if(typeof fraseRelato!=="function" || fraseRelato._35) return;
  var orig=fraseRelato;
  fraseRelato=function(P,min){
    var t=orig(P,min);
    try{
      var modo=(typeof E!=="undefined"&&E&&E.modo)||"historico";
      var anio=(typeof E!=="undefined"&&E&&E.anio)||2026;
      if(modo==="caos" && Math.random()<0.22){
        var caos=[
          "Se corta la luz un segundo. Nadie sabe si fue el estadio o el partido.",
          "Un globo cae en el área. El árbitro no sabe si parar.",
          "El partido se va de las manos: falta, reclamo, otra falta.",
          "Pasa algo que no estaba en el libreto. El público se ríe nervioso."
        ];
        return caos[Math.floor(Math.random()*caos.length)];
      }
      if(modo==="historico" && anio<2000 && Math.random()<0.28){
        var radio=[
          "La radio relata con la voz quebrada. No hay replay: lo que viste, viste.",
          "El cine de la tribuna: humo, bombos, y la pelota de cuero que no corre.",
          "Nadie pide el VAR. El linier baja la bandera y se arma el reclamo.",
          "En el almacén del barrio ya están discutiendo este centro."
        ];
        return radio[Math.floor(Math.random()*radio.length)];
      }
      if(modo==="libre" && Math.random()<0.18){
        var libre=[
          "Acá no hay libreto. El partido se escribe ahora.",
          "Lo que pasó en la historia, pasó. Hoy mandas tú.",
          "El rival no sabe que esta vez el guión lo armas tú."
        ];
        return libre[Math.floor(Math.random()*libre.length)];
      }
    }catch(e){}
    return t;
  };
  fraseRelato._beta=!!orig._beta;
  fraseRelato._35=true;
})();
