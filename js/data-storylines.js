"use strict";
/* ============================================================
   FUTBOLINI · data-storylines.js
   ARCOS DE EQUIPO (storylines con alma, propios de cada club).
   Se enganchan al motor de memoria: lo que elegís queda y te lo
   cobran después. Es un sistema PARALELO al motor de decisiones
   (no toca repartirDecisiones ni el token motor).

   ── CÓMO AGREGAR UN CLUB (para la 7.00) ──
   Meté una entrada en ARCOS_EQUIPO con la id del club (CC, UCH,
   UC, PAL, LIM, o las nuevas). Cada arco:
     {id, t, desc, era?, cond?, capitulos:[cap]}
       era: "actual" | "historico" | (omitir = aplica siempre;
             la U actual está en el mismo plano que Colo actual)
       cond: E=>bool  (opcional; condición extra para que arranque)
     Cada capítulo cap: {id, t, ctx, ops:[op]}
       op: {t, d?, ef?, grupos?, rep?, mem?, va?, cierra?}
         ef:     {plata,moral,prestigio,capital}   (aplicarEfectos)
         grupos: {directorio,socios,hinchada,camarin,tecnico,
                  prensa,anfp,sponsors,comunidad}   (aplicarGrupos)
         rep:    {publica,credibilidad,dureza}      (aplicarRep)
         mem:    texto en 2ª persona para recordar()
         va:     id del siguiente capítulo (omitir = el siguiente)
         cierra: true = termina el arco acá
   Los ARCOS_GENERICOS aplican a CUALQUIER club (relleno con alma).
   ============================================================ */

const ARCOS_EQUIPO = {
  /* ---------- UNIVERSIDAD DE CHILE: el estadio propio ---------- */
  UCH: [{
    id:"uch_estadio", t:"La U y el estadio propio",
    desc:"Años de arriendo y de jugar en cancha ajena. Aparece la chance de tener casa propia.",
    capitulos:[
      {id:"uch_1", t:"Casa propia", ctx:"La U arrastra décadas sin estadio propio: el Nacional es prestado y cada partido de local es negociar con otro. La dirigencia pone sobre la mesa impulsar un proyecto de estadio. La hinchada sueña; el directorio hace números y transpira.",
       ops:[
        {t:"Impulsar el proyecto con todo", d:"Es la bandera histórica del hincha. Cuesta capital político, pero te ganás a la gente.", ef:{capital:-8}, grupos:{hinchada:14,socios:8,directorio:-6}, mem:"le pusiste el pecho al viejo sueño del estadio propio de la U", va:"uch_2"},
        {t:"Primero lo deportivo, el estadio después", d:"Prudente pero frío: la gente lo va a leer como otra promesa pateada.", grupos:{camarin:5,hinchada:-8}, rep:{credibilidad:3}, mem:"pateaste otra vez el tema del estadio de la U", cierra:true}
       ]},
      {id:"uch_2", t:"¿Con qué plata?", ctx:"El proyecto camina, ahora falta la parte fea: financiarlo. Nadie regala un estadio.",
       ops:[
        {t:"Endeudarse fuerte y arrancar ya", d:"Rápido pero peligroso: el directorio se agarra la cabeza.", ef:{plata:120,prestigio:2}, grupos:{directorio:-12,hinchada:6}, mem:"te endeudaste para empujar el estadio", va:"uch_3"},
        {t:"Naming rights con un sponsor", d:"Entra plata, pero venderle el nombre al hincha tradicional duele.", ef:{plata:90}, grupos:{sponsors:12,hinchada:-6,comunidad:-4}, mem:"vendiste el naming del proyecto de estadio", va:"uch_3"},
        {t:"Colecta de socios y aporte popular", d:"Lento y romántico. Si la gente responde, es imparable.", grupos:{socios:14,hinchada:10,directorio:-4}, mem:"bancaste el estadio con aporte de los socios", va:"uch_3"}
       ]},
      {id:"uch_3", t:"Permisos y vecinos", ctx:"El terreno tiene dueños, vecinos y permisos. Acá muchos proyectos mueren.",
       ops:[
        {t:"Negociar de frente, ceder algo", d:"Caro y lento, pero sale bien parado.", ef:{capital:-6,prestigio:8}, grupos:{comunidad:10,hinchada:16,directorio:6,socios:8}, mem:"sacaste adelante el estadio propio de la U", cierra:true},
        {t:"Forzar con contactos y presión", d:"Rápido pero deja olor a favor turbio.", ef:{prestigio:6}, grupos:{hinchada:12,anfp:-8,comunidad:-12}, rep:{dureza:6}, mem:"forzaste los permisos del estadio a lo bruto", cierra:true},
        {t:"El proyecto se cae", d:"No dieron los tiempos ni la plata. Otra vez a fojas cero.", grupos:{hinchada:-16,socios:-8,directorio:-6}, mem:"el sueño del estadio de la U quedó en humo, otra vez", cierra:true}
       ]}
    ]
  }],
  /* ---------- COLO-COLO: el peso de ser el más grande ---------- */
  CC: [{
    id:"cc_grandeza", t:"El peso del más grande",
    desc:"Ser el equipo del pueblo tira para un lado; la concesionaria tira para el otro.",
    capitulos:[
      {id:"cc_1", t:"Marca vs pueblo", ctx:"Colo-Colo es el más popular de Chile, y eso es plata: la concesionaria quiere exprimir la marca. Pero la hinchada te mira con lupa: al Cacique no se lo vende como shampoo.",
       ops:[
        {t:"Bancar la identidad popular", d:"El hincha te adopta. La caja lo siente.", grupos:{hinchada:14,comunidad:8,sponsors:-8,directorio:-6}, mem:"le pusiste el pecho a la identidad popular de Colo", va:"cc_2"},
        {t:"Aprovechar la marca al máximo", d:"Entra plata gruesa, pero la gente empieza a desconfiar.", ef:{plata:110}, grupos:{sponsors:14,directorio:10,hinchada:-10}, mem:"exprimiste la marca Colo-Colo por caja", va:"cc_2"}
       ]},
      {id:"cc_2", t:"Gira o clásico", ctx:"Cae una oferta millonaria por una gira de exhibición en Asia, justo la semana de un partido bravo. Plata segura contra descanso y foco.",
       ops:[
        {t:"Ir a la gira, la caja manda", d:"Entra plata, pero llegás fundido al torneo.", ef:{plata:70,moral:-4}, grupos:{sponsors:10,camarin:-6,hinchada:-4}, mem:"metiste a Colo en una gira comercial en plena pelea", va:"cc_3"},
        {t:"Rechazar, foco en el campeonato", d:"El plantel y el hincha lo agradecen; el directorio putea por la plata.", grupos:{camarin:8,hinchada:8,directorio:-8,sponsors:-6}, mem:"rechazaste la gira para cuidar el torneo", va:"cc_3"}
       ]},
      {id:"cc_3", t:"El Cacique y la calle", ctx:"La hinchada más grande del país te pide un gesto: entradas populares, o bancar un reclamo social del barrio. La concesionaria dice que no es asunto del club.",
       ops:[
        {t:"Hacer el gesto con la gente", d:"Te ganás la calle para siempre; algunos socios se incomodan.", ef:{prestigio:8,capital:-4}, grupos:{hinchada:18,comunidad:14,directorio:-6}, mem:"pusiste a Colo del lado de su gente", cierra:true},
        {t:"Mantener al club al margen", d:"Ordenado y frío. El pueblo toma nota.", grupos:{directorio:8,sponsors:6,hinchada:-12,comunidad:-8}, rep:{credibilidad:-3}, mem:"mantuviste a Colo lejos de su hinchada por conveniencia", cierra:true}
       ]}
    ]
  }],
  /* ---------- UNIVERSIDAD CATÓLICA: el club modelo ---------- */
  UC: [{
    id:"uc_modelo", t:"Cruzados: crecer sin perder la esencia",
    desc:"Club ordenado y prolijo, pero de hinchada chica. La presión es crecer sin volverse otro.",
    capitulos:[
      {id:"uc_1", t:"Masificar o cuidar", ctx:"La UC es el club prolijo: cuentas sanas, buena cantera, poca masa. El directorio quiere masificar la marca; los puristas dicen que la esencia cruzada no se negocia.",
       ops:[
        {t:"Salir a buscar más hinchada", d:"Marketing, precios bajos, presencia en regiones.", ef:{plata:-40}, grupos:{comunidad:12,hinchada:10,directorio:-4}, mem:"saliste a masificar la hinchada de la UC", va:"uc_2"},
        {t:"Cuidar la identidad de siempre", d:"Menos ruido, misma esencia. El grande no perdona el estancamiento.", grupos:{socios:10,camarin:6,comunidad:-6}, mem:"priorizaste la esencia cruzada por sobre crecer", va:"uc_2"}
       ]},
      {id:"uc_2", t:"Cantera o vitrina", ctx:"La UC vive de formar y vender. Aparece una oferta enorme por tu joya de inferiores, justo cuando el equipo la necesita.",
       ops:[
        {t:"Vender y reinvertir en el club", d:"El modelo cruzado en estado puro: se forma y se vende.", ef:{plata:150}, grupos:{directorio:10,sponsors:6,hinchada:-8,camarin:-4}, mem:"vendiste a la joya de la cantera, fiel al modelo UC", va:"uc_3"},
        {t:"Retenerla y apostar por ella", d:"Romántico y caro. Si sale bien, sos un genio.", grupos:{hinchada:12,camarin:8,directorio:-8}, mem:"retuviste a la joya de la UC contra la lógica de caja", va:"uc_3"}
       ]},
      {id:"uc_3", t:"El sello cruzado", ctx:"Fin de ciclo del arco: la prensa pregunta qué es hoy la Católica. Tu respuesta define la marca del club por años.",
       ops:[
        {t:"Un club serio que forma y compite", d:"Mensaje maduro. Suma respeto transversal.", ef:{prestigio:10}, grupos:{prensa:8,socios:10,directorio:8}, rep:{credibilidad:8}, mem:"consolidaste a la UC como club modelo y serio", cierra:true},
        {t:"Vamos a pelearle a los grandes de igual a igual", d:"Ambicioso. Si no lo respaldás con títulos, te lo cobran.", ef:{prestigio:6}, grupos:{hinchada:12,directorio:-4,prensa:4}, mem:"prometiste que la UC iba a pelearle a los grandes", cierra:true}
       ]}
    ]
  }]
};

/* ---------- arcos que aplican a CUALQUIER club (relleno con alma) ---------- */
const ARCOS_GENERICOS = [
  {
    id:"gen_sede", t:"La sede se cae a pedazos",
    desc:"El complejo de entrenamiento está para el arrastre. Algo hay que hacer.",
    capitulos:[
      {id:"gs_1", t:"Camarines de terror", ctx:"El complejo de entrenamiento está viejo: goteras, canchas peladas, camarines fríos. El plantel se queja, la prensa saca fotos. Arreglarlo cuesta; taparlo, también.",
       ops:[
        {t:"Invertir y modernizar de verdad", d:"Plata que no se ve en la tabla, pero el plantel lo nota.", ef:{plata:-70,moral:6}, grupos:{camarin:12,tecnico:8,prensa:4}, mem:"modernizaste el complejo del club", cierra:true},
        {t:"Un parche y a otra cosa", d:"Sale barato hoy, caro mañana.", ef:{plata:-15}, grupos:{camarin:-4,prensa:-3}, mem:"tapaste con un parche el complejo que se cae", cierra:true},
        {t:"Que aguanten, hay cosas más urgentes", d:"Ahorrás, pero el grupo lo siente.", grupos:{camarin:-10,tecnico:-6}, mem:"dejaste el complejo del club abandonado", cierra:true}
       ]}
    ]
  },
  {
    id:"gen_idolo_dt", t:"El ídolo quiere volver",
    desc:"Un histórico del club, recién retirado, golpea la puerta para sumarse.",
    cond:E=>((E.ind&&E.ind.prestigio)||50)>=40,
    capitulos:[
      {id:"gi_1", t:"El ídolo en la puerta", ctx:"Un ídolo del club, recién colgados los botines, quiere sumarse al proyecto: cuerpo técnico, inferiores, lo que sea. La gente lo ama. Vos sabés que el ídolo con cargo es un arma de doble filo.",
       ops:[
        {t:"Sumarlo al cuerpo técnico", d:"La hinchada estalla de alegría. Ojo si después hay que echarlo.", grupos:{hinchada:14,camarin:6,tecnico:-4}, mem:"sumaste a un ídolo del club al cuerpo técnico", va:"gi_2"},
        {t:"Darle las inferiores", d:"Lo cuidás lejos del primer equipo. Sabio.", grupos:{hinchada:8,comunidad:8,tecnico:4}, mem:"le diste las inferiores a un ídolo del club", cierra:true},
        {t:"Agradecer y decir que no", d:"Frío pero profesional. La gente no lo entiende.", grupos:{hinchada:-10,prensa:-4}, rep:{dureza:4}, mem:"le cerraste la puerta a un ídolo del club", cierra:true}
       ]},
      {id:"gi_2", t:"Ídolo con cargo", ctx:"El ídolo ya está adentro y opina de todo. La prensa lo cita, la hinchada lo respalda por encima tuyo. El vestuario mira cómo reaccionás.",
       ops:[
        {t:"Marcarle la cancha con respeto", d:"Ordenás sin romper. Si te banca, quedás grande.", ef:{capital:-4}, grupos:{camarin:8,tecnico:8}, rep:{dureza:4,credibilidad:4}, mem:"le marcaste la cancha al ídolo con cargo, sin romper", cierra:true},
        {t:"Dejarlo hacer para no pelear", d:"Evitás el conflicto, pero perdés autoridad.", grupos:{hinchada:6,camarin:-8,tecnico:-6}, rep:{credibilidad:-4}, mem:"dejaste que el ídolo con cargo te pasara por encima", cierra:true}
       ]}
    ]
  }
];
