"use strict";
/* ============================================================
   FUTBOLINI 7.999 · lista de concentrados
   8.00 sigue RESERVADA.

   Nomina de época: 16 (hasta 1994), 18 (1995-2019), 23 (2020+).
   El que no entra ni se viste. Relato y prensa hablan de la banca.
   Cargar ÚLTIMO.
   ============================================================ */

(function relato999(){
  if(typeof RELATO_BETA==="undefined" || !Array.isArray(RELATO_BETA)) return;
  [
    {m:"descuento",x:"El cuarto árbitro mira el reloj. Cada pelota es la última."},
    {m:"descuento",x:"Descuento. Las piernas pesan y la platea no se sienta."},
    {m:"descuento",x:"90 y tantos. Acá ya no se juega, se pelea el aire."},
    {m:"descuento",x:"Un córner más. El arquero sube. El corazón se sale."},
    {m:"banca",x:"El recambio se nota: piernas nuevas contra piernas pesadas."},
    {m:"banca",x:"El que acaba de entrar pide la pelota. Quiere justificar la ficha."},
    {m:"banca",x:"Desde la banca gritan un nombre. El que está adentro no lo escucha."},
    {m:"inicio",x:"La lista quedó corta. En la tribuna ya se discute quién no salió."},
    {m:"inicio",x:"Saque al medio. El que se quedó afuera mira con cara de pocos amigos."},
    {m:"equilibrio",x:"El 5 pide calma. El banco pide otro cambio. El DT no se mueve."},
    {m:"cansancio",x:"Las piernas ya no responden. Hay recambio, pero hay que gastarlo bien."},
    {m:"clasico",x:"En el clásico la lista duele más. El que no juega no olvida."}
  ].forEach(function(r){
    if(!RELATO_BETA.some(function(x){ return x.x===r.x; })) RELATO_BETA.push(r);
  });
})();

(function frases999(){
  if(typeof FRASES_CUERPO==="undefined" || !Array.isArray(FRASES_CUERPO)) return;
  [
    {ctx:"favorito",x:"La lista está armada. El que se quedó afuera que mire y aprenda. Hoy ganan los que están."},
    {ctx:"parejo",x:"Hay recambio de verdad en el banco. Si se tranca, se mueve. No hay que esperar al 80."},
    {ctx:"desventaja",x:"Concentramos 23 y hay que usarlos. El que se esconda, sale. Sin drama."},
    {ctx:"clasico",x:"En el clásico la nómina duele. El que no está, que aguante. Hoy no hay consuelo."},
    {ctx:"racha_mala",x:"Cortar un nombre de la lista no es capricho. Es el único palo que nos queda."}
  ].forEach(function(f){
    if(!FRASES_CUERPO.some(function(x){ return x.x===f.x; })) FRASES_CUERPO.push(f);
  });
})();

(function prensa999(){
  if(typeof PREGUNTAS_BETA==="undefined" || !Array.isArray(PREGUNTAS_BETA)) return;
  [
    {sit:"previa_favorito",q:"¿Por qué cortaste a un nombre de la lista? ¿Se lo dijiste en la cara?"},
    {sit:"previa_favorito",q:"Con 12 en la banca, ¿vas a usar los cinco cambios o es adorno?"},
    {sit:"post_derrota",q:"¿Te faltó banco? El recambio llegó tarde o no llegó."},
    {sit:"post_derrota",q:"El que se quedó afuera, ¿tenía razón en enojarse?"},
    {sit:"post_empate",q:"¿Por qué no moviste el banco antes? El partido se te iba."},
    {sit:"post_goleada",q:"Los que entraron de la banca, ¿justificaron la ficha o era el rival?"},
    {sit:"clasico_previa",q:"En el clásico, ¿la lista es de los que pelean o de los que rinden?"},
    {sit:"racha_sin_ganar",q:"¿Hasta cuándo vas a cortar los mismos de la nómina?"},
    {sit:"figura_juvenil",q:"El pibe estaba en la lista y jugó. ¿Es titular de acá en adelante?"},
    {sit:"arbitro",q:"¿El descuento te alcanzó para meter el último recambio?"}
  ].forEach(function(p){
    if(!PREGUNTAS_BETA.some(function(x){ return x.q===p.q; })) PREGUNTAS_BETA.push(p);
  });
})();

(function wrapFrase999(){
  if(typeof fraseCuerpoTecnico!=="function" || fraseCuerpoTecnico._f999) return;
  var orig=fraseCuerpoTecnico;
  fraseCuerpoTecnico=function(part){
    try{
      if(typeof estrellasCortadas==="function"){
        var cort=estrellasCortadas(typeof onceIdeal==="function"?onceIdeal():[]);
        if(cort.length && Math.random()<0.55)
          return cort[0].n+" se queda fuera de la lista. Se va a enojar. Si es por fútbol, bancalo; si es capricho, te va a explotar el camarín.";
      }
      if(typeof bancaMaxEra==="function" && bancaMaxEra()>=12 && Math.random()<0.25)
        return "Nómina de 23. El banco tiene que pesar: si no mueves a los 60, los 12 de atrás son adorno.";
    }catch(e){}
    return orig(part);
  };
  fraseCuerpoTecnico._f999=true;
})();

(function wrapRelato999(){
  if(typeof fraseRelato!=="function" || fraseRelato._f999) return;
  var orig=fraseRelato;
  fraseRelato=function(P,min){
    try{
      if(typeof RELATO_BETA!=="undefined" && RELATO_BETA.length){
        var m=null;
        if(min>=90) m="descuento";
        else if(P&&P.cambios) m="banca";
        if(m){
          var pool=RELATO_BETA.filter(function(r){ return r.m===m; }).map(function(r){ return r.x; });
          if(pool.length && Math.random()<0.5 && typeof eligeNuevo==="function") return eligeNuevo(P, pool);
        }
      }
    }catch(e){}
    return orig(P,min);
  };
  fraseRelato._f999=true;
})();
