"use strict";
/* ============================================================
   FUTBOLINI 7.9012 · alma de Segunda + arcos AFA flacos
   Hechos públicos (estadio, ciudad, descenso, DT documentado).
   Cero citas inventadas. Stats de efecto = juego.
   Cargar DESPUÉS de data-afa-rigor.js (usa _d801/_o801).
   Cobertura: rico ≥6 (dec+arcos). SMO/LSC/OSO suben a rico.
   El resto de Segunda suma 1 carta (siguen medio, más gordos).
   ============================================================ */

(function alma9012(){
  var o = (typeof _o801==="function") ? _o801 : function(t,d,dif,g,b,m,w,x){
    x=x||{};
    return {t:t,d:d||"",dif:dif==null?45:dif,grupos:g||{},
      bien:{txt:b,ef:x.be||{}}, mitad:{txt:m||b,ef:x.me||{}},
      mal:{txt:w,ef:x.we||{},grupos:x.wg||{}}};
  };
  var d = (typeof _d801==="function") ? _d801 : function(id,club,anio,buzon,peso,mes,t,txt,ops,extra){
    var x={id:id,club:club,anio:anio,buzon:buzon,peso:peso||"medio",mes:mes||3,t:t,d:txt,op:ops};
    if(extra) Object.keys(extra).forEach(function(k){ x[k]=extra[k]; });
    return x;
  };

  var extra=[
    /* ——— SMO · 4 cartas más → rico (Paredes DT, caída 2025, Manríquez, chaguito) ——— */
    d("smo26_paredes","SMO",2026,"camarin","alto",2,
      "Paredes en el banco",
      "Esteban Paredes dirige a Santiago Morning en Segunda. Fue goleador de este club y de Colo-Colo. La camiseta pide que el ídolo alcance; la categoría no perdona la nostalgia.",
      [
        o("Dejarlo armar con oficio de Segunda","Menos circo, más puntos feos.",38,{tecnico:10,camarin:8,hinchada:-4},
          "El grupo se ordena. El chaguito entiende el tamaño.",
          "Semana seria. Poca tapa.",
          "Un sector quería al goleador, no al DT de lodazal.",
          {be:{moral:4},we:{moral:-3}}),
        o("Vender al ídolo-DT como marca","Nostalgia. Presente flaco.",52,{sponsors:8,prensa:6,camarin:-6},
          "Hay ruido de camiseta. El domingo sigue siendo La Pintana.",
          "Merch un mes.",
          "El vestuario se saturó de cámaras y se jugó tenso.",
          {be:{plata:28},we:{plata:8,moral:-4}})
      ]),
    d("smo26_caida","SMO",2026,"hinchada","alto",3,
      "La caída desde la B",
      "Morning bajó de la Liga de Ascenso 2025. Es debutante en Segunda. Hay gente que todavía pide pecho de categoría de arriba; el Municipal de La Pintana es otra película.",
      [
        o("Hablar de la caída sin maquillaje","Duele. Ordena.",36,{socios:10,directorio:6,hinchada:-6},
          "Se nombra lo que pasó. Se trabaja para no eternizarse abajo.",
          "Mensaje tibio.",
          "La tribuna lo leyó como rendirse.",
          {be:{prestigio:2},we:{moral:-4}}),
        o("Prometer el retorno ya","Ilusión. Vara alta.",54,{hinchada:12,prensa:6,directorio:-6},
          "La Pintana se prende. Si se tropieza, duele doble.",
          "Ruido un mes.",
          "Un tropiezo de zona apagó la frase.",
          {be:{moral:5},we:{moral:-6}})
      ]),
    d("smo26_manriquez","SMO",2026,"camarin","medio",4,
      "El capitán de 42",
      "Fernando Manríquez es el capitán. Cuarenta y dos años. Oficio, no vitrina. Los cadetes (Villegas, Massaccesi, Lobos) miran si el ciclo es de ellos o del veterano.",
      [
        o("Bancarlo como eje del vestuario","Oficio. Los pibes esperan.",40,{camarin:10,tecnico:6},
          "El capitán ordena. Los jóvenes aprenden callados.",
          "Respeto. Poca rotación.",
          "Un cadete pidió minutos y se enfrió el pasillo.",
          {be:{moral:4},we:{moral:-3}}),
        o("Rotar y darle minutos a la cantera","Sello. El ídolo se sienta.",46,{comunidad:8,camarin:-6},
          "Debutó un pibe. El capitán aceptó a regañadientes.",
          "Rotación tibia.",
          "Se perdió el eje un domingo y se notó.",
          {be:{prestigio:3},we:{moral:-4}})
      ]),
    d("smo26_chaguito","SMO",2026,"hinchada","medio",5,
      "Chaguito en zona Sur",
      "Morning es el chaguito: camiseta con pasado, presente en La Pintana, zona Sur de Santiago. No es Santa Laura ni el Nacional. El barrio pide precio de pueblo.",
      [
        o("Precio de barrio y llenar","Caja chica, ruido.",36,{hinchada:12,comunidad:10},
          "Se oye el municipal. El tesorero bufa.",
          "Llegó gente. No repleto.",
          "Bajaste y el viento igual se comió las gradas.",
          {be:{plata:-14,moral:3},we:{plata:-14}}),
        o("Cobrar como si fuera B","Más por cabeza.",50,{sponsors:6,hinchada:-8},
          "Taquilla de visita. El resto, huecos.",
          "Un domingo caro.",
          "Se vio un municipal vacío. La foto duele.",
          {be:{plata:22},we:{plata:8},wg:{prensa:-4}})
      ]),

    /* ——— LSC · 4 más → rico (10 años, Melipilla, Povea, Schwager) ——— */
    d("lsc26_diez","LSC",2026,"institucional","alto",2,
      "Diez años afuera",
      "Lota Schwager vuelve a Segunda tras diez años de ausencia. Subió por el play-off ante Comunal Cabrero, con la plaza que dejó la expulsión de Deportes Melipilla. La cuenca no quiere que esto sea un verano.",
      [
        o("Construir para quedarse","Poco épico. Sano.",36,{camarin:10,socios:8,hinchada:-4},
          "El minero habla de piso, no de fiesta. Coronel entiende.",
          "Orden. Poca tapa.",
          "Un sector quería el salto ya y se enojó.",
          {be:{prestigio:3},we:{moral:-3}}),
        o("Cobrar la fiesta del retorno","Plata ahora.",52,{sponsors:8,hinchada:6,camarin:-6},
          "Hay merch de cuenca. El domingo sigue siendo Segunda.",
          "Cheque chico.",
          "Se gastó el crédito del regreso en un mes.",
          {be:{plata:30},we:{plata:10,moral:-4}})
      ]),
    d("lsc26_schwager","LSC",2026,"hinchada","medio",4,
      "Federico Schwager de domingo",
      "El estadio lleva el nombre de la cuenca. Cuatro mil. Si no se llena, Lota se siente sucursal de Concepción. Si se llena, el carbón se oye.",
      [
        o("Entradas de cuenca y llenar","Bandera.",38,{hinchada:12,comunidad:10},
          "Coronel se oye. La caja aguanta justo.",
          "Llegó gente de la mina y del puerto.",
          "Bajaste y igual hubo huecos.",
          {be:{plata:-12,moral:3},we:{plata:-12}}),
        o("Cobrar la platea del retorno","Caja. Recelo.",50,{sponsors:6,hinchada:-8},
          "Un domingo caro. El resto, silbatina chica.",
          "Taquilla de visita.",
          "La cuenca lo leyó como turista en su casa.",
          {be:{plata:24},we:{plata:8},wg:{comunidad:-6}})
      ]),
    d("lsc26_povea","LSC",2026,"camarin","medio",5,
      "Povea, el eje",
      "Leonardo Povea es el capitán. Treinta y dos, contención, llegó de Valdivia. Alrededor hay préstamos (Alburquenque, Lincopán, Oñate) y veteranos de cuenca (Jopia, Contreras). Hay que decidir quién manda el vestuario.",
      [
        o("El capitán ordena el medio","Oficio.",40,{camarin:10,tecnico:6},
          "El grupo se ata al 5. Los préstamos entran cuando toca.",
          "Orden. Poca fiesta.",
          "Un joven pidió titularidad y se partió el pasillo.",
          {be:{moral:4},we:{moral:-3}}),
        o("Rotar a los préstamos de arriba","Ilusión de nombres.",48,{prensa:6,camarin:-6},
          "Entró un pibe de Primera. Un rato.",
          "Rotación.",
          "Se perdió el eje y se jugó nervioso.",
          {be:{moral:2},we:{moral:-4}})
      ]),
    d("lsc26_concepcion","LSC",2026,"institucional","medio",6,
      "Lota no es Concepción",
      "La cuenca queda al lado de Concepción. Hay quien quiere usar la marca del Gran Concepción para vender; la hinchada de Coronel pide club de mina, no sucursal.",
      [
        o("Club de Coronel, punto","Bandera.",36,{comunidad:14,hinchada:10,sponsors:-6},
          "El carbón no se disfraza. Caja chica.",
          "Identidad. Oficio justito.",
          "Plantel corto un mes.",
          {be:{prestigio:3},we:{plata:-8}}),
        o("Abrirse al Gran Concepción","Mercado. Recelo.",50,{sponsors:8,comunidad:-8},
          "Más visibilidad. Un lienzo preguntó de qué pueblo es esto.",
          "Cheque chico.",
          "Coronel se sintió escala.",
          {be:{plata:28},we:{plata:10},wg:{hinchada:-6}})
      ]),

    /* ——— OSO · 4 más → rico (viaje, invierno, 12 mil, Viale) ——— */
    d("oso26_viaje","OSO",2026,"preparacion","alto",2,
      "El viaje es el rival",
      "Osorno queda lejos. El bus cansa al que viene y también al que sale. Rubén Marcos Peralta es grande para la categoría; la ruta al norte no lo es.",
      [
        o("Gastar en llegar enteros","Menos caja, más piernas.",40,{camarin:10,tecnico:8,directorio:-4},
          "El plantel llega a horario. El tesorero cuenta pasajes.",
          "Viaje correcto.",
          "Se ahorró mal y se jugó con las piernas pesadas.",
          {be:{plata:-18,moral:3},we:{moral:-4}}),
        o("Viajar barato y aguantar","Austeridad. Riesgo.",48,{directorio:8,camarin:-8},
          "Se ahorró. Un empate feo de visita.",
          "Cansancio.",
          "Se perdió un partido en el bus, no en la cancha.",
          {be:{plata:16},we:{moral:-5}})
      ]),
    d("oso26_invierno","OSO",2026,"hinchada","medio",5,
      "Invierno en el Peralta",
      "El sur no es postal. Lluvia, frío, césped pesado. Eso es ventaja si el rival sufre; es problema si el propio plantel no lo banca.",
      [
        o("Hacer del invierno un arma","Puntos feos, poco marketing.",38,{hinchada:10,camarin:8,prensa:-4},
          "El rival llega quejándose del clima. Osorno suma feo.",
          "Localía de barro.",
          "El propio equipo patinó igual.",
          {be:{moral:3},we:{moral:-2}}),
        o("Pedir cancha más 'de revista'","Cómodo. Menos sur.",50,{sponsors:6,comunidad:-8},
          "Se arregla un tramo. El pueblo lo siente menos suyo.",
          "Césped más lindo, menos infierno.",
          "Se leyó como huir del sur.",
          {be:{plata:-20,estadio:4},we:{plata:-20},wg:{hinchada:-6}})
      ]),
    d("oso26_aforo12","OSO",2026,"finanzas","medio",4,
      "Doce mil asientos en Segunda",
      "El Rubén Marcos Peralta tiene aforo de Primera B o más. En Segunda, si no se llena, la foto es un recinto enorme vacío. Si se llena, incomoda a cualquiera.",
      [
        o("Campaña de socio del sur","Piso de gente.",40,{socios:10,comunidad:8},
          "Suben socios. La caja entra lenta.",
          "Un padrón chico pero fiel.",
          "La campaña no pegó y el recinto se vio grande.",
          {be:{plata:12},we:{plata:-8}}),
        o("Cobrar la visita grande y punto","Taquilla puntual.",50,{sponsors:8,hinchada:-6},
          "Un domingo de visita. El resto, huecos.",
          "Plata de un partido.",
          "Se vio el estadio vacío en la tele local.",
          {be:{plata:26},we:{plata:8},wg:{prensa:-4}})
      ]),
    d("oso26_viale","OSO",2026,"camarin","medio",3,
      "Viale arma el ciclo",
      "Jeremías Viale dirige a Provincial Osorno. Plantel con veteranos (Lauler, Gutiérrez, Bielkiewicz) y préstamos del sur. El banco pide tiempo; la ciudad pide puntos.",
      [
        o("Dar tiempo al ciclo","Poco épico.",38,{tecnico:10,camarin:8,hinchada:-4},
          "El grupo se ata al banco. La ciudad refunfuña.",
          "Semana de trabajo.",
          "La tribuna pidió cabeza temprano.",
          {be:{moral:3},we:{moral:-3}}),
        o("Pedirle el salto ya","Vara. Tensión.",54,{hinchada:10,directorio:-4},
          "Osorno se ilusiona. Si se cae, duele.",
          "Ruido un mes.",
          "Un tropiezo y el ciclo se sintió corto.",
          {be:{moral:4},we:{moral:-5}})
      ]),

    /* ——— resto Segunda · 1 carta extra (otro buzón, no clonar identidad) ——— */
    d("lin26_fiscal","LIN",2026,"hinchada","medio",5,
      "El Fiscal de domingo",
      "Tucapel Bustamante. Cuatro mil. Linares no llena si el precio es de Talca. El albirrojo pide gente de la ciudad.",
      [
        o("Precio de Linares y llenar","Caja chica.",38,{hinchada:10,comunidad:8},
          "Se oye el Fiscal. El tesorero bufa.",
          "Llegó gente del Maule.",
          "Bajaste y igual hubo huecos.",
          {be:{plata:-10,moral:2},we:{plata:-10}}),
        o("Cobrar la visita de la B","Taquilla puntual.",50,{sponsors:6,hinchada:-6},
          "Un domingo caro. El resto, silencio.",
          "Plata de un partido.",
          "Linares se vio vacío.",
          {be:{plata:20},we:{plata:6}})
      ]),
    d("clc26_silva","CLC",2026,"hinchada","medio",5,
      "Jorge Silva de pueblo",
      "Siete mil doscientos en San Fernando. Colchagua volvió al profesionalismo. Si se cobra como vitrina de valle, el pueblo se queda en la casa.",
      [
        o("Entrada de San Fernando","Bandera.",36,{hinchada:12,comunidad:8},
          "El valle se oye. Caja justa.",
          "Llegó gente del pueblo.",
          "Bajaste y el viento se comió las gradas.",
          {be:{plata:-12,moral:3},we:{plata:-12}}),
        o("Cobrar turismo de valle","Marca. Recelo.",50,{sponsors:8,comunidad:-6},
          "Un domingo de visita. El resto, huecos.",
          "Cheque chico.",
          "San Fernando lo leyó como postal.",
          {be:{plata:22},we:{plata:8}})
      ]),
    d("tra26_paso","TRA",2026,"preparacion","medio",4,
      "El paso y el viento",
      "Los Andes vive del paso cordillerano. El Regional es chico (3.500). El rival sufre el valle; el propio plantel también si se viaja mal.",
      [
        o("Localía de cordillera, viajar enteros","Puntos feos.",40,{camarin:8,hinchada:6},
          "El rival llega mareado. Trasandino suma chico.",
          "Viaje correcto.",
          "El viento también cansó a los de casa.",
          {be:{plata:-12,moral:3},we:{moral:-2}}),
        o("Ahorrar pasajes","Caja. Riesgo.",48,{directorio:8,camarin:-6},
          "Se ahorró. Un empate feo.",
          "Cansancio.",
          "Se perdió en el bus.",
          {be:{plata:14},we:{moral:-4}})
      ]),
    d("ova26_diaguita","OVA",2026,"hinchada","medio",5,
      "Diaguita de Limarí",
      "Cinco mil en Ovalle. El Ciclón escribe el profesionalismo (campeón de Tercera A 2023). Si el precio es de La Serena, el Limarí no entra.",
      [
        o("Precio de Ovalle y llenar","Pueblo.",38,{hinchada:10,comunidad:8},
          "Se oye el Diaguita. Caja chica.",
          "Llegó gente del valle.",
          "Bajaste y igual hubo huecos.",
          {be:{plata:-10,moral:2},we:{plata:-10}}),
        o("Cobrar como ciudad grande","Taquilla. Recelo.",50,{sponsors:6,hinchada:-6},
          "Un domingo caro.",
          "Plata puntual.",
          "Ovalle se vio sucursal de La Serena.",
          {be:{plata:18},we:{plata:6}})
      ]),
    d("cna26_municipal","CNA",2026,"hinchada","medio",5,
      "Atlético Municipal, 3.000",
      "Concón National. Litoral. Estadio chico, sin pasado de Primera. El pueblo costero pide verse, no pagar platea de Valparaíso.",
      [
        o("Entrada de Concón y llenar","Casa.",36,{hinchada:10,comunidad:8},
          "El litoral se oye. Caja justa.",
          "Llegó gente de la costa.",
          "Bajaste y el viento se comió las gradas.",
          {be:{plata:-8,moral:2},we:{plata:-8}}),
        o("Cobrar la costa como marca","Turismo. Recelo.",50,{sponsors:8,comunidad:-6},
          "Un domingo de visita.",
          "Cheque chico.",
          "Concón se sintió postal.",
          {be:{plata:16},we:{plata:6}})
      ]),
    d("gve26_augusto","GVE",2026,"hinchada","medio",5,
      "Augusto Rodríguez de pueblo",
      "San Vicente de Tagua Tagua. Tres mil. Los Verdes del secano. Si se cobra como Rancagua, el pueblo no entra.",
      [
        o("Precio de San Vicente","Casa.",36,{hinchada:10,comunidad:10},
          "El secano se oye.",
          "Llegó gente del pueblo.",
          "Bajaste y igual hubo huecos.",
          {be:{plata:-8,moral:2},we:{plata:-8}}),
        o("Cobrar la visita de O'Higgins","Taquilla puntual.",50,{sponsors:6,hinchada:-6},
          "Un domingo caro. El resto, silencio.",
          "Plata de un partido.",
          "San Vicente se vio sucursal.",
          {be:{plata:18},we:{plata:6}})
      ]),
    d("ren26_guzman","REN",2026,"hinchada","medio",5,
      "Guillermo Guzmán de Rengo",
      "Tres mil. Oro y Cielo. Recién en el profesionalismo. Primero, que el pueblo entre; después, soñar la B.",
      [
        o("Entrada de Rengo y llenar","Sobrevivir con gente.",36,{hinchada:10,comunidad:8},
          "Se oye el municipal. Caja justa.",
          "Llegó gente del valle.",
          "Bajaste y el recinto se vio chico y vacío.",
          {be:{plata:-8,moral:2},we:{plata:-8}}),
        o("Austeridad de boletería","Caja. Frío.",46,{directorio:6,hinchada:-6},
          "Se cobró. Poca gente. Las cuentas cierran.",
          "Taquilla chica.",
          "Rengo se sintió de trámite.",
          {be:{plata:12},we:{moral:-3}})
      ]),
    d("col26_rojas","COL",2026,"hinchada","medio",5,
      "Manuel Rojas, comuna norte",
      "Atlético Colina. Campeón de Tercera A 2025. Estadio de comuna, no de capital. Si el precio es de Santiago, Colina no entra.",
      [
        o("Precio de Colina y llenar","Comuna.",36,{hinchada:10,comunidad:10},
          "Chacabuco se oye. Caja chica.",
          "Llegó gente de la comuna.",
          "Bajaste y igual hubo huecos.",
          {be:{plata:-10,moral:2},we:{plata:-10}}),
        o("Cobrar como borde de capital","Taquilla. Recelo.",50,{sponsors:6,comunidad:-6},
          "Un domingo de visita santiaguina.",
          "Plata puntual.",
          "Colina se vio sucursal.",
          {be:{plata:20},we:{plata:6}})
      ]),
    d("bsa26_municipal","BSA",2026,"hinchada","medio",5,
      "Municipal de Salamanca",
      "Tres mil. Choapa. Las Brujas. Caja de pueblo. El auspicio de Los Pelambres está; el pueblo pide no sentirse marca minera.",
      [
        o("Entrada de Salamanca y llenar","Bandera.",36,{hinchada:12,comunidad:10},
          "El Choapa se oye.",
          "Llegó gente del valle.",
          "Bajaste y el viento se comió las gradas.",
          {be:{plata:-8,moral:2},we:{plata:-8}}),
        o("Cobrar la visita minera","Caja. Recelo.",50,{sponsors:8,comunidad:-6},
          "Un domingo caro.",
          "Cheque chico.",
          "Salamanca lo leyó como turista.",
          {be:{plata:18},we:{plata:6}})
      ]),
    d("rsj26_aforo","RSJ",2026,"cantera","medio",5,
      "Poco aforo, muchos cadetes",
      "Real San Joaquín nace de la escuela de Iván Zamorano. Dos mil. Si se ficha veterano para no sufrir, los cadetes se sientan. Si se debuta, la tabla duele.",
      [
        o("Debut obligatorio de un cadete","Sello de escuela.",38,{comunidad:10,directorio:-4},
          "Jugó un pibe. El sello se nota.",
          "Minutos. Puntos justos.",
          "Se sufrió de más un domingo.",
          {be:{prestigio:3},we:{moral:-3}}),
        o("Cerrar el once con oficio","Tabla. Menos escuela.",48,{camarin:8,comunidad:-6},
          "El once se ve de Segunda. Los cadetes miran.",
          "Un veterano rindió.",
          "Se gastó el relato de formador.",
          {be:{moral:2},we:{prestigio:-2}})
      ]),
    d("sci26_lobarnechea","SCI",2026,"hinchada","medio",5,
      "Lo Barnechea, proyecto joven",
      "Santiago City. Municipal de Lo Barnechea, 2.500. Negro y rosa. Sin 1991 que heredar. El barrio alto no llena solo; hay que bajar el precio o aceptar el recinto vacío.",
      [
        o("Precio para llenar el municipal","Honesto.",36,{hinchada:8,comunidad:6},
          "Llegó gente. El tesorero bufa.",
          "Un rato de ruido.",
          "Bajaste y igual hubo huecos.",
          {be:{plata:-8,moral:2},we:{plata:-8}}),
        o("Cobrar la marca City","Marketing. Frágil.",50,{sponsors:8,hinchada:-4},
          "Hay campaña. El municipal no acompaña.",
          "Ruido de redes.",
          "Se pidió de más. Lo Barnechea no es una final.",
          {be:{plata:16},we:{moral:-3}})
      ])
  ];

  if(typeof DECISIONES!=="undefined" && Array.isArray(DECISIONES)){
    extra.forEach(function(carta){
      if(!DECISIONES.some(function(x){ return x.id===carta.id; })) DECISIONES.push(carta);
    });
  }

  /* segundo arco para SMO/LSC/OSO (cuenta 1 extra cada uno) */
  var arcosMas={
    SMO:[{id:"smo_chaguito",t:"El chaguito no es de revista",desc:"La Pintana, zona Sur, camiseta con pasado. El presente es Segunda.",
      capitulos:[
        {id:"smo_c1",t:"Barrio o nostalgia",ctx:"Se puede vender 1942 o llenar el municipal de ahora.",
         ops:[{t:"Llenar La Pintana",d:"Pueblo.",ef:{plata:-12},grupos:{hinchada:12,comunidad:10},mem:"llenaste La Pintana como chaguito de zona Sur",cierra:true},
              {t:"Vender el pasado",d:"Merch.",ef:{plata:24},grupos:{sponsors:8,hinchada:-6},mem:"vendiste el pasado de Morning en Segunda",cierra:true}]}
      ]}],
    LSC:[{id:"lsc_diez",t:"Diez años no se cobran en un mes",desc:"Lota volvió. El play-off y Melipilla son el dato. Quedarse es el trabajo.",
      capitulos:[
        {id:"lsc_c1",t:"Fiesta o piso",ctx:"La cuenca quiere bandera. La caja quiere que no sea un verano.",
         ops:[{t:"Piso para quedarse",d:"Serio.",grupos:{camarin:10,socios:8},mem:"le diste piso a Lota para no ser un verano",cierra:true,logro:"de_la_comunidad"},
              {t:"Cobrar el retorno",d:"Plata.",ef:{plata:28},grupos:{sponsors:8,camarin:-6},mem:"cobraste el retorno de Lota en un mes",cierra:true}]}
      ]}],
    OSO:[{id:"oso_ruta",t:"La ruta al norte",desc:"Osorno queda lejos. El Peralta es grande. El bus también juega.",
      capitulos:[
        {id:"oso_c1",t:"Llegar enteros o ahorrar",ctx:"El viaje cansa. También es el arma de local.",
         ops:[{t:"Gastar en llegar enteros",d:"Piernas.",ef:{plata:-16},grupos:{camarin:10,tecnico:8},mem:"cuidaste el viaje de Osorno",cierra:true},
              {t:"Ahorrar el bus",d:"Caja.",ef:{plata:14},grupos:{directorio:8,camarin:-8},mem:"ahorraste el viaje y Osorno llegó cansado",cierra:true}]}
      ]}]
  };
  if(typeof ARCOS_EQUIPO==="object"){
    Object.keys(arcosMas).forEach(function(id){
      if(!ARCOS_EQUIPO[id]) ARCOS_EQUIPO[id]=[];
      arcosMas[id].forEach(function(a){
        if(!ARCOS_EQUIPO[id].some(function(x){ return x.id===a.id; })) ARCOS_EQUIPO[id].push(a);
      });
    });
  }

  /* AFA flacos: 1 arco de estadio/barrio (documentado). 1d+1a = medio. */
  var arcosAfa={
    ROS:[{id:"ros_arroyito",t:"El Gigante no se alquila",desc:"Arroyito. El clásico con Newell's parte la ciudad. No es Buenos Aires.",
      capitulos:[{id:"ros_1",t:"Clásico o tabla",ctx:"La semana canalla pide sangre. El promedio pide puntos.",
        ops:[{t:"Todo al clásico",d:"Rosario manda.",grupos:{hinchada:14,tecnico:-4},mem:"priorizaste el clásico canalla",cierra:true},
             {t:"Cuidar el promedio",d:"Frío.",grupos:{directorio:8,hinchada:-8},mem:"cuidaste la tabla y Rosario se enojó",cierra:true}]}]}],
    NEW:[{id:"new_lepra",t:"Parque Independencia",desc:"Newell's. La Lepra. El clásico de Rosario se juega acá también.",
      capitulos:[{id:"new_1",t:"Identidad leprosa",ctx:"Hay quien quiere modernizar el relato. El Parque no.",
        ops:[{t:"El Parque manda",d:"Bandera.",grupos:{hinchada:12,comunidad:8},mem:"defendiste el Parque Independencia",cierra:true},
             {t:"Abrir la marca",d:"Plata.",ef:{plata:40},grupos:{sponsors:8,hinchada:-8},mem:"abriste Newell's más allá del Parque",cierra:true}]}]}],
    HUR:[{id:"hur_patricios",t:"Parque Patricios, el Ducó",desc:"Huracán. El Tomás A. Ducó. El Globo es barrio, no vitrina del sur.",
      capitulos:[{id:"hur_1",t:"Barrio o platea",ctx:"El Ducó pide gente. La platea pide precio.",
        ops:[{t:"Precio de barrio",d:"Pueblo.",ef:{plata:-20},grupos:{hinchada:12,comunidad:10},mem:"cuidaste al hincha del Ducó",cierra:true,logro:"de_la_comunidad"},
             {t:"Cobrar la platea",d:"Caja.",ef:{plata:35},grupos:{sponsors:8,hinchada:-8},mem:"cuidaste la platea del Ducó",cierra:true}]}]}],
    TAL:[{id:"tal_kempes",t:"El Kempes no es Buenos Aires",desc:"Talleres. Córdoba. El interior pide mesa grande sin hipotecar la casa.",
      capitulos:[{id:"tal_1",t:"Interior o capital",ctx:"Hay plata de afuera. El Kempes quiere que el club se quede.",
        ops:[{t:"Córdoba primero",d:"Casa.",grupos:{comunidad:12,hinchada:10,sponsors:-6},mem:"dejaste a Talleres en Córdoba",cierra:true},
             {t:"Abrir a plata de capital",d:"Caja.",ef:{plata:70},grupos:{directorio:8,comunidad:-10},mem:"abriste Talleres a plata de capital",cierra:true}]}]}],
    LAN:[{id:"lan_sur",t:"Lanús es el sur",desc:"La Fortaleza. El sur del conurbano. No es Recoleta.",
      capitulos:[{id:"lan_1",t:"Sur o marca",ctx:"Un sponsor quiere limpiar el relato de barrio.",
        ops:[{t:"Quedarse sur",d:"Bandera.",grupos:{comunidad:12,hinchada:10},mem:"dejaste a Lanús oliendo a sur",cierra:true},
             {t:"Abrir la marca",d:"Plata.",ef:{plata:45},grupos:{sponsors:8,comunidad:-8},mem:"abriste Lanús como marca",cierra:true}]}]}],
    RAC:[{id:"rac_cilindro",t:"El Cilindro de Avellaneda",desc:"Racing. Avellaneda, no Capital. La Academia pide identidad de recinto.",
      capitulos:[{id:"rac_1",t:"Avellaneda manda",ctx:"Hay quien quiere jugar de marca porteña.",
        ops:[{t:"El Cilindro es la casa",d:"Identidad.",grupos:{hinchada:12,comunidad:8},mem:"defendiste el Cilindro",cierra:true},
             {t:"Abrir la marca Academia",d:"Marketing.",ef:{plata:50},grupos:{sponsors:10,hinchada:-6},mem:"abriste Racing como marca Academia",cierra:true}]}]}],
    IND:[{id:"ind_visera",t:"La Doble Visera",desc:"Independiente. Avellaneda. El Rey de Copas pide recinto, no nostalgia prestada.",
      capitulos:[{id:"ind_1",t:"Recinto o vitrina",ctx:"Se puede vender 1984 o llenar la visera ahora.",
        ops:[{t:"Llenar la visera",d:"Pueblo.",ef:{plata:-25},grupos:{hinchada:12,comunidad:8},mem:"llenaste la Doble Visera",cierra:true},
             {t:"Vender el Rey de Copas",d:"Nostalgia.",ef:{plata:40},grupos:{sponsors:8,hinchada:-6},mem:"vendiste el Rey de Copas en vez de llenar",cierra:true}]}]}],
    SLO:[{id:"slo_boedo",t:"Boedo no se muda",desc:"San Lorenzo. El Gasómetro. La Vuelta a Boedo es el relato, no un eslogan.",
      capitulos:[{id:"slo_1",t:"Boedo o negocio",ctx:"Hay plata si se suaviza el barrio.",
        ops:[{t:"Boedo primero",d:"Bandera.",grupos:{hinchada:14,comunidad:10,directorio:-6},mem:"empujaste la Vuelta a Boedo",cierra:true,logro:"de_la_comunidad"},
             {t:"Suavizar para el sponsor",d:"Caja.",ef:{plata:55},grupos:{sponsors:10,hinchada:-10},mem:"suavizaste Boedo por un sponsor",cierra:true}]}]}],
    VEL:[{id:"vel_fortin",t:"El Fortín de Liniers",desc:"Vélez. Liniers. No es la Bombonera ni Núñez.",
      capitulos:[{id:"vel_1",t:"Liniers manda",ctx:"Hay quien quiere marca de capital.",
        ops:[{t:"El Fortín es de Liniers",d:"Casa.",grupos:{comunidad:12,hinchada:8},mem:"dejaste a Vélez en Liniers",cierra:true},
             {t:"Abrir la marca",d:"Plata.",ef:{plata:48},grupos:{sponsors:8,comunidad:-8},mem:"abriste Vélez como marca",cierra:true}]}]}],
    ELP:[{id:"elp_bosque",t:"1 y 57, el Bosque",desc:"Estudiantes. La Plata. El Bosque no es Buenos Aires.",
      capitulos:[{id:"elp_1",t:"El Bosque o la capital",ctx:"Hay ruido de jugar más cerca de Capital.",
        ops:[{t:"Quedarse en el Bosque",d:"Casa.",grupos:{comunidad:12,hinchada:10},mem:"dejaste a Estudiantes en el Bosque",cierra:true},
             {t:"Abrir fechas afuera",d:"Cómodo.",ef:{plata:35},grupos:{sponsors:6,comunidad:-8},mem:"sacaste a Estudiantes del Bosque por comodidad",cierra:true}]}]}]
  };
  if(typeof ARCOS_EQUIPO==="object"){
    Object.keys(arcosAfa).forEach(function(id){
      if(!ARCOS_EQUIPO[id]) ARCOS_EQUIPO[id]=[];
      arcosAfa[id].forEach(function(a){
        if(!ARCOS_EQUIPO[id].some(function(x){ return x.id===a.id; })) ARCOS_EQUIPO[id].push(a);
      });
    });
  }
})();
