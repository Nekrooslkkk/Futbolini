"use strict";
/* ============================================================
   FUTBOLINI · data-proximamente.js — 7.9116 · ligas que se ven en el selector pero todavía no se juegan
   Pedido del autor: "añade la segunda división argentina y la primera brasileña, pero SOLO como próximamente:
   salgan como listas, pero faltan los jugadores; eso será para la 8.00".
   · Se muestran en el selector con candado y no arrancan partida (no hay planteles, caja ni calendario).
   · LISTA TENTATIVA: los clubes de cada liga 2026 se confirman con fuente antes de abrirlas (encargo a Grok en
     ChatDeTrabajIA.md). Hasta entonces el selector lo dice en pantalla.
   · Escudo: el que ya exista por nombre (CONMEBOL, Commons) o el generado con la sigla en colores neutros.
     No se inventan colores de clubes que no tenemos documentados.
   ============================================================ */
const LIGAS_PROXIMAMENTE=[
  {id:"arg_nacional", pais:"Argentina", bandera:"🇦🇷", n:"Primera Nacional", corto:"Primera Nacional", nivel:2,
   nota:"Segunda categoría del fútbol argentino (AFA). Dos zonas; dos ascensos a la Liga Profesional.",
   clubes:["Quilmes","Chacarita Juniors","Ferro Carril Oeste","All Boys","Almirante Brown","Atlanta","Colón",
     "Deportivo Morón","Temperley","Tristán Suárez","Deportivo Maipú","Agropecuario","Chaco For Ever",
     "Gimnasia y Tiro","Güemes","Mitre","San Martín de Tucumán","Racing de Córdoba","Estudiantes de Buenos Aires",
     "Los Andes","Defensores de Belgrano","Deportivo Madryn","San Telmo","Arsenal de Sarandí","Almagro","Patronato",
     "Atlético de Rafaela","Alvarado","Nueva Chicago","Colegiales","Midland","San Miguel","Ciudad de Bolívar","Central Norte"]},
  {id:"bra_seriea", pais:"Brasil", bandera:"🇧🇷", n:"Brasileirão Série A", corto:"Série A", nivel:1,
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
