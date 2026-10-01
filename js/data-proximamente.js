"use strict";
/* ============================================================
   FUTBOLINI · data-proximamente.js — 7.9116 · ligas que se ven en el selector pero todavía no se juegan
   Pedido del autor: "añade la segunda división argentina y la primera brasileña, pero SOLO como próximamente:
   salgan como listas, pero faltan los jugadores; eso será para la 8.00".
   · Se muestran en el selector con candado y no arrancan partida (no hay planteles, caja ni calendario).
   · 7.9123 · listas 2026 confirmadas. No se inventan colores. Siguen sin plantel: no arrancan partida.
   · Escudo: el que ya exista por nombre (CONMEBOL, Commons) o el generado con la sigla en colores neutros.
     No se inventan colores de clubes que no tenemos documentados.
   ============================================================ */
const LIGAS_PROXIMAMENTE=[
  {id:"arg_nacional", pais:"Argentina", bandera:"🇦🇷", n:"Primera Nacional", corto:"Primera Nacional", nivel:2,
   /* 36 clubes, dos zonas de 18. Ascenso del Interior, 21 dic 2025 (lista completa).
      Zonas: 442 / Perfil, 22 dic 2025. Salen de la lista tentativa: Arsenal y Alvarado.
      Entran: Acassuso, Godoy Cruz, Gimnasia y Esgrima de Jujuy y San Martín de San Juan.
      «Midland» es Ferrocarril Midland (Libertad). Güemes es el de Santiago del Estero.
      Estudiantes es el de Caseros. Racing es el de Córdoba. Mitre es el de Santiago del Estero. */
   nota:"Segunda categoría del fútbol argentino (AFA). 36 clubes en dos zonas de 18. Dos ascensos a la Liga Profesional.",
   clubes:["Acassuso","Agropecuario","All Boys","Almagro","Almirante Brown","Atlanta","Atlético de Rafaela",
     "Central Norte","Chacarita Juniors","Chaco For Ever","Ciudad de Bolívar","Colegiales","Colón",
     "Defensores de Belgrano","Deportivo Madryn","Deportivo Maipú","Deportivo Morón","Estudiantes de Buenos Aires",
     "Ferro Carril Oeste","Ferrocarril Midland","Gimnasia y Esgrima de Jujuy","Gimnasia y Tiro","Godoy Cruz","Güemes",
     "Los Andes","Mitre","Nueva Chicago","Patronato","Quilmes","Racing de Córdoba","San Martín de San Juan",
     "San Martín de Tucumán","San Miguel","San Telmo","Temperley","Tristán Suárez"]},
  {id:"bra_seriea", pais:"Brasil", bandera:"🇧🇷", n:"Brasileirão Série A", corto:"Série A", nivel:1,
   /* 20 clubes cerrados el 7 dic 2025 (No Ataque) y repetidos por ge, 29 dic 2025.
      Suben desde la Série B 2025: Coritiba, Athletico Paranaense, Chapecoense y Remo.
      Bajan de la Série A 2025 (no van en esta lista): Fortaleza, Ceará, Juventude y Sport.
      Al 1 oct 2026 la tabla en curso sigue con estos 20 (ge / TheStatsAPI). No se cambia ningún nombre. */
   nota:"Primera división de Brasil (CBF). 20 clubes, todos contra todos, 38 fechas; cuatro descensos.",
   clubes:["Flamengo","Palmeiras","Cruzeiro","Mirassol","Fluminense","Botafogo","Bahia","São Paulo","Grêmio",
     "Red Bull Bragantino","Atlético Mineiro","Santos","Corinthians","Vasco da Gama","Vitória","Internacional",
     "Coritiba","Athletico Paranaense","Chapecoense","Remo"]}
];
/* cuántos clubes hay "listos" en el selector aunque no se jueguen (para el doctor y el contador) */
function clubesProximamente(){
  const out=[];
  LIGAS_PROXIMAMENTE.forEach(function(l){ l.clubes.forEach(function(n){ out.push({n:n, liga:l.id, ligaN:l.n, pais:l.pais, bandera:l.bandera}); }); });
  return out;
}