"use strict";
/* ============================================================
   FUTBOLINI · data-alma-arg.js  (7.9013 · sacar del 1% a los clubes sin alma)
   Medido con devInformeCobertura(): 76 clubes dirigibles, 1 rico, 52 medios y
   23 POBRES — los 23 de la liga argentina, con un solo ítem propio cada uno.
   Acá cada uno recibe UN arco de club (2 capítulos) y UNA decisión propia.

   INTEGRIDAD (regla del repo): esto es FICCIÓN DE DIRIGENCIA sobre ANCLAS REALES.
   El ancla — ciudad, estadio, aforo, apodo, identidad — es dato público y sale de
   LIGA_ARG_2026. Los dilemas son del juego. NO hay frases puestas en boca de
   personas reales, NO hay hechos históricos inventados y NO hay nombres de
   jugadores nuevos. Diversidad sí, burla no: cada club se escribe con respeto.
   ============================================================ */

/* ancla real (del propio LIGA_ARG_2026) + los dos dilemas propios del club */
var ALMA_ARG=[
 {id:"ROS",n:"Rosario Central",est:"Gigante de Arroyito",ciu:"Rosario",af:41654,ap:"el Canalla",
  t1:"Arroyito llena y la ciudad se parte en dos cada vez que juegan con Newell's.",
  t2:"La cantera rosarina produce más de lo que el club puede retener."},
 {id:"TAL",n:"Talleres",est:"Mario Alberto Kempes",ciu:"Córdoba",af:57000,ap:"la T",
  t1:"El Kempes es del Estado provincial: el club llena un estadio que no es suyo.",
  t2:"Córdoba quiere un equipo que pelee arriba todos los años, no cada tanto."},
 {id:"HUR",n:"Huracán",est:"Tomás Adolfo Ducó",ciu:"Parque Patricios",af:48314,ap:"el Globo",
  t1:"El Ducó es patrimonio del barrio: arreglarlo cuesta lo que cuesta un plantel.",
  t2:"Parque Patricios cambió de cara y el club tiene que decidir qué lugar ocupa ahí."},
 {id:"LAN",n:"Lanús",est:"Ciudad de Lanús",ciu:"Lanús",af:47090,ap:"el Granate",
  t1:"La Fortaleza es la ventaja real del club: ahí no viene nadie a pasear.",
  t2:"El sur del conurbano mira al club como institución, no solo como equipo."},
 {id:"ARG",n:"Argentinos Juniors",est:"Diego Armando Maradona",ciu:"La Paternal",af:25000,ap:"el Bicho",
  t1:"La cantera es la marca registrada: formar y vender, o formar y bancar.",
  t2:"La Paternal es chica y el estadio también: crecer sin mudarse es el desafío."},
 {id:"NEW",n:"Newell's Old Boys",est:"Marcelo Bielsa",ciu:"Rosario",af:38095,ap:"la Lepra",
  t1:"El Coloso pide obras y la comisión directiva pide paciencia.",
  t2:"Rosario exige protagonismo: el clásico manda más que la tabla."},
 {id:"BEL",n:"Belgrano",est:"Julio César Villagra",ciu:"Córdoba",af:30000,ap:"el Pirata",
  t1:"Alberdi es un barrio que vive del club y el club vive del barrio.",
  t2:"Córdoba tiene tres equipos en Primera y la plata de la ciudad se reparte."},
 {id:"DYJ",n:"Defensa y Justicia",est:"Norberto Tito Tomaghello",ciu:"Florencio Varela",af:12000,ap:"el Halcón",
  t1:"Es la cancha más chica de la categoría y eso define todo el modelo económico.",
  t2:"El club creció rápido: hay que decidir si se consolida o se sigue apostando."},
 {id:"INS",n:"Instituto",est:"Juan Domingo Perón",ciu:"Alta Córdoba",af:26535,ap:"la Gloria",
  t1:"Alta Córdoba espera hace años una campaña que la saque del medio de tabla.",
  t2:"El club forma bien y vende rápido: la hinchada ya no quiere despedidas."},
 {id:"UNI",n:"Unión",est:"15 de Abril",ciu:"Santa Fe",af:22852,ap:"el Tatengue",
  t1:"El 15 de Abril es chico y antiguo: ampliarlo o remodelarlo divide al socio.",
  t2:"Santa Fe es una ciudad de dos clubes y la competencia es por todo."},
 {id:"GLP",n:"Gimnasia y Esgrima La Plata",est:"Juan Carmelo Zerillo",ciu:"La Plata",af:30973,ap:"el Lobo",
  t1:"El Bosque está metido en el parque: cada obra pasa por el municipio.",
  t2:"La hinchada es enorme para el tamaño del club y nunca afloja."},
 {id:"TUC",n:"Atlético Tucumán",est:"Monumental José Fierro",ciu:"Tucumán",af:32700,ap:"el Decano",
  t1:"Ser del interior cuesta plata: cada viaje a Buenos Aires es un presupuesto.",
  t2:"Tucumán llena la cancha aunque el equipo ande mal, y eso obliga."},
 {id:"TIG",n:"Tigre",est:"José Dellagiovanna",ciu:"Victoria",af:26282,ap:"el Matador",
  t1:"El club sube y baja hace años: la estabilidad es el objetivo real.",
  t2:"La zona norte tiene plata, pero no toda quiere invertir en fútbol."},
 {id:"BAN",n:"Banfield",est:"Florencio Sola",ciu:"Banfield",af:21820,ap:"el Taladro",
  t1:"La cantera del Taladro sostiene el presupuesto desde hace décadas.",
  t2:"El Sola es un estadio de barrio con exigencias de Primera."},
 {id:"PLA",n:"Platense",est:"Ciudad de Vicente López",ciu:"Vicente López",af:22530,ap:"el Calamar",
  t1:"Volver a Primera fue la parte fácil: quedarse es la otra pelea.",
  t2:"Vicente López es zona cara y el club tiene que justificar cada peso."},
 {id:"CCO",n:"Central Córdoba",est:"Único Madre de Ciudades",ciu:"Santiago del Estero",af:34000,ap:"el Ferroviario",
  t1:"El Único es provincial y enorme: jugar ahí cambia la escala del club.",
  t2:"Santiago del Estero descubrió la Primera hace poco y no quiere soltarla."},
 {id:"IRV",n:"Independiente Rivadavia",est:"Bautista Gargantini",ciu:"Mendoza",af:24000,ap:"la Lepra mendocina",
  t1:"Mendoza esperó años este lugar y ahora pide que se note en la cancha.",
  t2:"El Gargantini necesita obras y el socio ya puso bastante."},
 {id:"SAR",n:"Sarmiento",est:"Eva Perón",ciu:"Junín",af:19000,ap:"el Verde",
  t1:"Junín es una ciudad chica sosteniendo un club de Primera.",
  t2:"El presupuesto es de los últimos y la tabla no perdona."},
 {id:"ALD",n:"Aldosivi",est:"José María Minella",ciu:"Mar del Plata",af:35180,ap:"el Tiburón",
  t1:"El Minella es municipal y gigante: el club paga por un estadio que le queda grande.",
  t2:"Mar del Plata vive del verano y el club necesita plata todo el año."},
 {id:"GME",n:"Gimnasia y Esgrima de Mendoza",est:"Víctor Antonio Legrotaglie",ciu:"Mendoza",af:11000,ap:"el Lobo mendocino",
  t1:"La cancha es chica y la demanda de entradas la supera cada domingo.",
  t2:"Mendoza tiene dos clubes en la elite y los dos quieren el mismo sponsor."},
 {id:"RIE",n:"Deportivo Riestra",est:"Guillermo Laza",ciu:"Bajo Flores",af:3000,ap:"el Malevo",
  t1:"Tres mil localidades en Primera: el estadio condiciona cada ingreso.",
  t2:"El club creció desde abajo y ahora tiene que sostenerse arriba."},
 {id:"ERC",n:"Estudiantes de Río Cuarto",est:"Antonio Candini",ciu:"Río Cuarto",af:12000,ap:"el León",
  t1:"Río Cuarto no es Córdoba capital: todo se consigue con menos.",
  t2:"El club llegó lejos con estructura chica y ahora le piden más."},
 {id:"BAR",n:"Barracas Central",est:"Claudio Chiqui Tapia",ciu:"Barracas",af:4400,ap:"el Guapo",
  t1:"Una cancha de 4.400 en Primera obliga a inventar ingresos.",
  t2:"Barracas es barrio porteño de toda la vida y el club es parte del paisaje."}
];

/* ---------- fábrica de arcos (2 capítulos, opciones con consecuencia real) ---------- */
function _almaArco(c){
  var id=c.id.toLowerCase();
  return {
    id:"alma_"+id, t:c.n+": "+c.ap,
    desc:"Un arco propio de "+c.n+": lo que se decide acá queda en la memoria del club.",
    capitulos:[
      {id:"alma_"+id+"_1", t:"La casa",
       ctx:c.t1+" El estadio "+c.est+" declara "+c.af.toLocaleString("es-AR")+
           " localidades y en "+c.ciu+" todos saben cuántas se llenan. La dirigencia pone el tema sobre la mesa: "+
           "invertir en la casa o poner esa plata en el plantel. No alcanza para las dos cosas.",
       ops:[
        {t:"Invertir en el estadio",
         d:"Obras, comodidad y aforo. Se nota en dos años, no en dos meses.",
         ef:{plata:-90,prestigio:3}, grupos:{socios:12,comunidad:8,hinchada:6,directorio:-6},
         mem:"pusiste la plata de "+c.n+" en el estadio antes que en el plantel", va:"alma_"+id+"_2"},
        {t:"Reforzar el plantel ahora",
         d:"La tabla es hoy. El estadio puede esperar otro año más.",
         ef:{plata:-70,moral:6}, grupos:{tecnico:12,hinchada:8,socios:-8},
         mem:"elegiste plantel por sobre estadio en "+c.n, va:"alma_"+id+"_2"},
        {t:"No gastar: primero ordenar la caja",
         d:"Prudente y antipático. Nadie aplaude un balance.",
         ef:{plata:60}, grupos:{directorio:12,hinchada:-10,tecnico:-6},
         mem:"frenaste todo gasto en "+c.n+" para ordenar la caja", va:"alma_"+id+"_2"}
       ]},
      {id:"alma_"+id+"_2", t:"La identidad",
       ctx:c.t2+" La pregunta que llega al escritorio es simple y difícil: qué quiere ser "+c.n+
           " los próximos años, y cuánto está dispuesto a pagar por eso.",
       ops:[
        {t:"Apostar a la cantera y al club",
         d:"Proyecto largo. Si sale, el club cambia de escala; si no, se hace largo.",
         ef:{cantera:10,prestigio:4}, grupos:{socios:10,comunidad:10,hinchada:6,directorio:-4},
         rep:{credibilidad:4},
         mem:"apostaste por la cantera y la identidad de "+c.n, cierra:true},
        {t:"Comprar para pelear ya",
         d:"Resultado rápido, planilla pesada y un año de mucha presión.",
         ef:{plata:-120,moral:8,prestigio:2}, grupos:{hinchada:14,tecnico:8,directorio:-10},
         mem:"te la jugaste con refuerzos para que "+c.n+" pelee ya", cierra:true},
        {t:"Sostener lo que hay, sin ruido",
         d:"Continuidad. Ni épica ni desastre: el club sigue.",
         grupos:{directorio:8,camarin:6,hinchada:-6},
         rep:{credibilidad:2},
         mem:"elegiste continuidad y bajo perfil en "+c.n, cierra:true}
       ]}
    ]
  };
}

/* ---------- fábrica de decisiones propias (una por club, 2026) ---------- */
function _almaDecision(c){
  var id=c.id.toLowerCase();
  return {
    id:"alma26_"+id, club:c.id, anio:2026, buzon:"institucional", peso:"medio", mes:3,
    t:"El socio de "+c.n+" pregunta por el estadio",
    d:"Llega una nota de la comisión de socios. "+c.t1+" Piden una respuesta concreta sobre qué se va a hacer "+
      "esta temporada con el "+c.est+", que hoy declara "+c.af.toLocaleString("es-AR")+" localidades. "+
      "No es una pregunta retórica: quieren un número y una fecha.",
    posturas:{socios:35,hinchada:20,directorio:-15,prensa:10},
    consejo:{
      tesorero:"Cualquier obra sale de la misma caja que paga sueldos. Decilo así, sin maquillaje.",
      deportivo:"Si prometemos obras y bajamos el plantel, la tabla nos lo va a cobrar en junio.",
      prensa:"Una respuesta clara, aunque sea un no, rinde más que otra promesa sin fecha."
    },
    op:[
     {t:"Comprometer obras con fecha",d:"Plata y plazo por escrito. Después hay que cumplir.",dif:45,
      grupos:{socios:14,comunidad:8,directorio:-8},
      bien:{txt:"El compromiso con fecha ordena al club y el socio responde con cuotas al día.",ef:{plata:-60,prestigio:4}},
      mitad:{txt:"El anuncio gusta, pero nadie se convence del todo hasta ver la primera máquina.",ef:{plata:-40}},
      mal:{txt:"Prometer fecha sin la plata asegurada fue un error: el socio lo lee como humo.",ef:{plata:-40},grupos:{socios:-12}}},
     {t:"Decir la verdad: este año no hay",d:"Honesto y caro en imagen. Al menos nadie queda esperando.",dif:30,
      grupos:{directorio:10,socios:-8},rep:{credibilidad:5},
      bien:{txt:"La franqueza se agradece. Duele, pero el club queda parado en algo firme.",ef:{},grupos:{prensa:6}},
      mitad:{txt:"Se entiende, aunque deja gusto a poco después de tantos años.",ef:{}},
      mal:{txt:"Sonó a excusa y la comisión de socios lo tomó como un portazo.",grupos:{socios:-14,hinchada:-8}}},
     {t:"Buscar un aporte externo",d:"Sponsor, municipio o provincia. Entra plata, entran condiciones.",dif:55,
      grupos:{sponsors:12,socios:6,hinchada:-4},
      bien:{txt:"Aparece un aporte serio y la obra deja de ser una promesa.",ef:{plata:110,prestigio:3},grupos:{comunidad:8}},
      mitad:{txt:"Hay interés, pero el acuerdo queda a medio firmar y todo sigue igual.",ef:{plata:30}},
      mal:{txt:"El acuerdo se cayó y quedó la sensación de que el club salió a pedir sin plan.",grupos:{sponsors:-10,socios:-6}}}
    ]};
}

/* ---------- registro: mismo patrón del repo (no pisa lo que ya existe) ---------- */
(function mergeAlmaArg(){
  try{
    if(typeof ARCOS_EQUIPO==="object"&&ARCOS_EQUIPO){
      ALMA_ARG.forEach(function(c){
        var a=_almaArco(c);
        if(!ARCOS_EQUIPO[c.id]) ARCOS_EQUIPO[c.id]=[a];
        else if(!ARCOS_EQUIPO[c.id].some(function(x){ return x.id===a.id; })) ARCOS_EQUIPO[c.id].push(a);
      });
    }
  }catch(e){}
  try{
    if(typeof DECISIONES!=="undefined"&&Array.isArray(DECISIONES)){
      ALMA_ARG.forEach(function(c){
        var d=_almaDecision(c);
        if(!DECISIONES.some(function(x){ return x.id===d.id; })) DECISIONES.push(d);
      });
    }
  }catch(e){}
})();
