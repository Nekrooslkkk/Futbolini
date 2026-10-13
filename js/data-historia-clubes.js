"use strict";
/* ============================================================
   FUTBOLINI · data-historia-clubes.js — 7.9133 · LA HISTORIA REAL DE LOS CLUBES (para aprender jugando)
   Pedido del autor (13 oct 2026): "armar la historia de los clubes, porque de Deportes Rengo ni idea, y la idea es al
   menos aprender; que sus capítulos no sean siempre los mismos. El de Colo-Colo tiene épica porque te dice cosas del club;
   el de Rengo es 'subir precio' y pura obviedad".
   Cómo se hace (scripts/historia_clubes.py, ver PATCHES 7.9133):
     1. HECHOS con fuente (scripts/historia/<ID>.json): solo lo que está escrito en la fuente, con la fecha de consulta.
     2. DeepSeek redacta hitos y arcos usando SOLO esos hechos; Claude lo revisa a mano (lo inventado se borra).
     3. Acá queda lo revisado: la LÍNEA (hechos públicos, en 3.ª persona) y los ARCOS (dilemas de HOY, ficción del juego,
        anclados en un hecho real que el jugador aprende al leer el contexto).
   Integridad: las personas reales solo aparecen como hechos, nunca hablan ni opinan. El doctor `historia_clubes` lo vigila.
   ============================================================ */
const HISTORIA_CLUBES={
  /* ---------- DEPORTES RENGO · "Oro y Cielo", "El Bravo entre los Bravos" ----------
     Fuente: https://es.wikipedia.org/wiki/Club_de_Deportes_Rengo (consultado 2026-10-13); 2024: https://en.wikipedia.org/wiki/Deportes_Rengo */
  REN:{
    fuente:"https://es.wikipedia.org/wiki/Club_de_Deportes_Rengo", consultado:"2026-10-13",
    apodos:["Oro y Cielo","El Bravo entre los Bravos"],
    hitos:[
      {anio:1984,hito:"Fundación",txt:"18 de marzo. Nace bajo la Asociación de Fútbol de Rengo para juntar a los clubes de la comuna en un solo equipo en la Tercera de ANFA, con los colores de la selección comunal."},
      {anio:1986,hito:"Apertura de Tercera",txt:"Campeón del Apertura de Tercera División: final con Comercio de Llay-Llay (1-1 en casa, 2-0 de visita). Lo sostienen las fábricas de la comuna: Viamaxi, Temsa y Bticino."},
      {anio:1996,hito:"Semillero tricampeón",txt:"El club es la base de las selecciones de Rengo campeonas nacionales amateur en 1986 (Valdivia), 1989 (Curicó) y 1996, en casa."},
      {anio:1997,hito:"Se van las fábricas",txt:"Cierran de a poco las fábricas que lo bancaban. Termina último de su grupo y baja a su asociación de origen: años de torneos locales."},
      {anio:2010,hito:"El regreso",txt:"Con apoyo municipal y jugadores que le facilita O'Higgins vuelve al fútbol amateur nacional (Tercera B): termina tercero. Sus juveniles ganan el Torneo de Novatos sub-18."},
      {anio:2013,hito:"Sube de Cuarta",txt:"Asciende en el Clausura de Cuarta División, junto a Deportes Limache, Estrella del Huasco, Deportivo Estación Central y Provincial Marga Marga."},
      {anio:2015,hito:"Copa Absoluta",txt:"Campeón de la nueva Copa Absoluta de ANFA (Tercera A y B), con Fred Gayoso en la banca: 5-1 en el global a Real San Joaquín."},
      {anio:2017,hito:"Por un gol",txt:"Queda a nada del profesionalismo en la Tercera A: el ascenso se lo lleva Fernández Vial por diferencia de goles."},
      {anio:2022,hito:"La noche de Puente Alto",txt:"Empata la última fecha y el ascenso directo se escapa. ANFA abre un cupo: 4 de diciembre, 1-1 con Deportes Colina y 7-6 en penales. Cristóbal Lecaros ataja el último: primer ascenso al profesionalismo."},
      {anio:2023,hito:"Local en San Fernando",txt:"Mientras remodelan el Guillermo Guzmán Díaz (de los años 60, 3.000 personas) juega de local en San Fernando. Le hace 5-0 a Deportes Concepción, su mayor goleada en Segunda."},
      {anio:2024,hito:"Cuarto en Segunda",txt:"Termina cuarto en la Segunda División Profesional."}
    ],
    /* dilemas de HOY (ficción del juego) anclados en esos hechos. Redactados con DeepSeek desde los hechos y revisados. */
    arcos:[{
      id:"ren_h_casa", t:"La casa del Bravo", desc:"El estadio es municipal, la remodelación costó y la Segunda exige: ¿quién manda en la casa?",
      capitulos:[
        {id:"ren_h_casa_1", t:"El patio prestado", ctx:"El Guillermo Guzmán Díaz es de la Municipalidad, de los años 60, y tras el ascenso de 2022 hubo que remodelarlo: en 2023 fuiste local en San Fernando. Hoy el municipio te pide el estadio dos días a la semana para actividades de la comuna.",
         ops:[
          {t:"Ceder los días que piden", d:"El municipio queda contento; el pasto lo paga.", ef:{plata:-5,moral:-2}, grupos:{comunidad:8,hinchada:-3,directorio:-4}, mem:"le abriste el estadio a la comuna aunque se te rompiera el pasto", va:"ren_h_casa_2"},
          {t:"Negarte: el calendario es del club", d:"Cuidas la cancha y te peleas con el alcalde.", ef:{prestigio:1}, grupos:{hinchada:3,directorio:3,comunidad:-8}, mem:"le cerraste el estadio a la comuna", va:"ren_h_casa_2"},
          {t:"Convenio con arriendo de por medio", d:"Todo por escrito. Y pagas.", ef:{plata:-15,prestigio:2}, grupos:{directorio:2,comunidad:3,sponsors:2}, mem:"firmaste un convenio caro con el municipio por tu propia casa", va:"ren_h_casa_2"}
         ]},
        {id:"ren_h_casa_2", t:"La cancha se cae", ctx:"Las obras que en 2023 te mandaron a San Fernando terminaron, pero la cancha no drena y el pasto se levanta en cada lluvia. Las bases de la Segunda piden un mínimo y el informe del veedor llega en dos fechas.",
         ops:[
          {t:"Drenaje nuevo, cueste lo que cueste", d:"Te descapitalizas, pero la cancha queda de profesional.", ef:{plata:-30,prestigio:3,capital:2}, grupos:{hinchada:4,anfp:3,directorio:-3}, mem:"pagaste el drenaje aunque la caja no daba", va:"ren_h_casa_3"},
          {t:"Parche con arena y a rezar", d:"Te ahorras la obra; la ANFP te anota y la hinchada lo ve.", ef:{plata:10,moral:-2,prestigio:-3}, grupos:{anfp:-6,hinchada:-3}, mem:"parchaste la cancha con arena y la ANFP te anotó", va:"ren_h_casa_3"},
          {t:"Que lo pague la Municipalidad", d:"Lo pagan ellos. La cuenta te la cobran en la próxima.", ef:{plata:5}, grupos:{comunidad:-4,directorio:-3,anfp:-1}, mem:"le pasaste la cuenta de la cancha al municipio", va:"ren_h_casa_3"}
         ]},
        {id:"ren_h_casa_3", t:"Localía en venta", ctx:"En Tercera tu alternativa era el Municipal de Rosario; en 2023 te recibió San Fernando. Hoy la Municipalidad de Rengo no firma la concesión larga y San Fernando ofrece su estadio por dos años.",
         ops:[
          {t:"Firmar con San Fernando", d:"Estabilidad. El hincha de Rengo deja de viajar.", ef:{plata:-10,moral:-2}, grupos:{hinchada:-6,comunidad:-5,anfp:3}, mem:"mandaste al Bravo a jugar de local fuera de Rengo", cierra:true},
          {t:"Volver a Rosario, más barato", d:"Ahorras, pero la cancha chica no levanta.", ef:{plata:6,moral:-3,prestigio:-2}, grupos:{hinchada:-6,sponsors:-2}, mem:"te fuiste a Rosario para ahorrar", cierra:true},
          {t:"Plantarte por la concesión en Rengo", d:"Te juegas la relación con el municipio por la casa.", ef:{plata:-8,moral:2,prestigio:3}, grupos:{hinchada:6,comunidad:5,directorio:-5}, mem:"te plantaste para que el Bravo juegue en Rengo", cierra:true}
         ]}
      ]
    },{
      id:"ren_h_cantera", t:"La cantera brava", desc:"El club fue semillero de tres selecciones campeonas. Hoy el semillero pide plata y paciencia.",
      capitulos:[
        {id:"ren_h_cantera_1", t:"Los cabros del oro", ctx:"Este club fue la base de las selecciones de Rengo campeonas nacionales amateur en 1986, 1989 y 1996, y en 2010 sus juveniles ganaron el Torneo de Novatos. Hoy tres juveniles piden contrato profesional y un club grande pregunta por ellos.",
         ops:[
          {t:"Contrato profesional a los tres", d:"Retienes talento; la planilla sube.", ef:{plata:-20,moral:3,prestigio:2}, grupos:{camarin:5,hinchada:4,directorio:-2}, mem:"le hiciste contrato a los cabros de Rengo", va:"ren_h_cantera_2"},
          {t:"Venderlos ahora", d:"Haces caja; la hinchada te dice vendido.", ef:{plata:25,moral:-3,prestigio:-2}, grupos:{hinchada:-7,camarin:-5,directorio:4}, mem:"vendiste a los cabros de la cantera apenas pidieron contrato", va:"ren_h_cantera_2"},
          {t:"Prestarlos para que se fogueen", d:"No gastas, pero se te pueden ir libres.", ef:{plata:-2}, grupos:{camarin:1,hinchada:-2}, mem:"mandaste a los juveniles a foguearse afuera", va:"ren_h_cantera_2"}
         ]},
        {id:"ren_h_cantera_2", t:"El convenio con O'Higgins", ctx:"En 2010 O'Higgins le facilitó jugadores al club para volver al fútbol nacional. Hoy te ofrecen un convenio: tres sub-21 a préstamo sin costo, con la condición de que jueguen. Tu técnico quiere elegir él.",
         ops:[
          {t:"Aceptar el convenio", d:"Plantel barato; el camarín y el técnico se molestan.", ef:{plata:10,moral:-2,prestigio:2}, grupos:{camarin:-5,tecnico:-4,directorio:3}, mem:"aceptaste los préstamos de O'Higgins con cláusula de titular", va:"ren_h_cantera_3"},
          {t:"Rechazarlo y confiar en los tuyos", d:"Identidad; faltan piernas.", ef:{plata:-5,moral:3,capital:-2}, grupos:{camarin:4,tecnico:3,hinchada:5,directorio:-2}, mem:"rechazaste el convenio y confiaste en tu cantera", va:"ren_h_cantera_3"},
          {t:"Uno solo, sin exigencias, y pagando", d:"Consigues uno, a tu manera.", ef:{plata:-8,moral:1}, grupos:{tecnico:2,camarin:1,directorio:-1}, mem:"negociaste un solo préstamo con O'Higgins, sin condiciones", va:"ren_h_cantera_3"}
         ]},
        {id:"ren_h_cantera_3", t:"Las raíces del Bravo", ctx:"Las selecciones tricampeonas salieron de las canchas de Rengo. Hoy los apoderados de la sub-15 te exigen prioridad y amenazan con llevarse a sus hijos a otro club de la zona.",
         ops:[
          {t:"Invertir en la sub-15", d:"La comunidad te sigue; el primer equipo se aprieta.", ef:{plata:-15,moral:2,prestigio:2,capital:2}, grupos:{comunidad:8,hinchada:4,directorio:-2}, mem:"apostaste por la sub-15 de Rengo", cierra:true},
          {t:"Cerrar la sub-15 por costos", d:"Ahorras y te ganas el rencor del pueblo.", ef:{plata:8,moral:-3,prestigio:-4,capital:-2}, grupos:{comunidad:-10,hinchada:-6,directorio:3}, mem:"cerraste la sub-15 para ahorrar", cierra:true},
          {t:"Cobrarles cuota a los apoderados", d:"Se mantiene, pero pierdes a los que no pueden pagar.", ef:{plata:5,moral:-1,prestigio:-1}, grupos:{comunidad:-5,hinchada:-2,directorio:2}, mem:"le cobraste a los apoderados y se te fueron los cabros que no podían pagar", cierra:true}
         ]}
      ]
    }]
  }
};
/* se suma a lo que ya hay: hitos en la LÍNEA (el del mismo año y nombre se reemplaza por el de acá, más completo) y arcos
   en ARCOS_EQUIPO (sin duplicar ids). Corre una vez al cargar, después de data-historico.js y data-storylines.js. */
(function sumarHistoriaClubes(){
  Object.keys(HISTORIA_CLUBES).forEach(function(id){
    const H=HISTORIA_CLUBES[id];
    if(typeof HISTORIA_LINEA==="object"&&H.hitos){
      if(!HISTORIA_LINEA[id]) HISTORIA_LINEA[id]=[];
      const L=HISTORIA_LINEA[id];
      H.hitos.forEach(function(h){
        const i=L.findIndex(function(x){ return x&&x.anio===h.anio&&(x.hito===h.hito||x.anio!==2026); });
        if(i>=0&&L[i].hito!=="Hoy") L[i]={anio:h.anio,hito:h.hito,txt:h.txt,fuente:H.fuente}; else if(i<0) L.push({anio:h.anio,hito:h.hito,txt:h.txt,fuente:H.fuente});
      });
    }
    /* los arcos con historia real van PRIMERO: storylines.js arcoElegible toma el primero que no se jugó, y lo primero que
       el jugador vive con el club tiene que enseñarle algo verdadero (antes salía el genérico "Rengo a no bajar") */
    if(typeof ARCOS_EQUIPO==="object"&&H.arcos){
      if(!ARCOS_EQUIPO[id]) ARCOS_EQUIPO[id]=[];
      const nuevos=H.arcos.filter(function(a){ return !ARCOS_EQUIPO[id].some(function(x){ return x.id===a.id; }); });
      ARCOS_EQUIPO[id]=nuevos.concat(ARCOS_EQUIPO[id]);
    }
  });
})();
