"use strict";
/* ============================================================
   FUTBOLINI 7.9086 · Plop por equipo
   Cargar DESPUÉS de data-caza-98.js (ese archivo ya envuelve tuitDeCtx).
   No toca el motor ni el calendario. Si el club tiene voz para ese momento,
   sale de acá ~60% de las veces. Un puñado de memes de partido, de prueba.
   {L}{G}{M}{P} se rellenan acá. {GOLEADOR}{RIVAL}{CLUB}{ARQUERO} los resuelve
   el ticker, salvo el penal errado (partido.js no pasa por el resolver):
   esas líneas no llevan llaves.
   COB es Cobreloa en 1991 y Cobresal desde 2026: se mira el nombre.
   Si el año es anterior al estadio, se dice "la cancha".
   ============================================================ */

const PLOP_CLUB={
  CC:{h:["@albo_del_fondo","@cacique_insomne","@macul_grita"],lugar:"el Monumental",desde:1989,gente:"albo",mito:"el cacique",pico:"la garra blanca"},
  UCH:{h:["@leon_del_nacional","@azul_de_nunoa","@la_u_en_vivo"],lugar:"el Nacional",desde:1938,gente:"azul",mito:"el león",pico:"la U"},
  UC:{h:["@franja_de_ley","@cruzado_del_fondo","@san_carlos_late"],lugar:"San Carlos",desde:1988,gente:"cruzado",mito:"la franja",pico:"los cruzados"},
  HUA:{h:["@acerero_de_ley","@talcahuano_sur","@el_acero_late"],lugar:"Talcahuano",desde:0,gente:"acerero",mito:"el acero",pico:"la usina"},
  EVE:{h:["@ruletero_sausalito","@vina_del_fondo","@el_ruletero"],lugar:"Sausalito",desde:1929,gente:"ruletero",mito:"el ruletero",pico:"oro y cielo"},
  PAL:{h:["@baisano_de_ley","@la_cisterna_grita","@palestra_late"],lugar:"La Cisterna",desde:1988,gente:"baisano",mito:"el baisano",pico:"la banda árabe"},
  COQ:{h:["@pirata_de_coquimbo","@el_puerto_grita","@rumoroso_late"],lugar:"el puerto",desde:0,gente:"pirata",mito:"el pirata",pico:"la banda pirata"},
  AUD:{h:["@italico_de_la_florida","@audax_del_fondo","@la_florida_late"],lugar:"La Florida",desde:2008,gente:"itálico",mito:"el itálico",pico:"la florida"},
  OHI:{h:["@celeste_del_teniente","@rancagua_grita","@ohiggins_late"],lugar:"El Teniente",desde:1945,gente:"celeste",mito:"la celeste",pico:"Rancagua"},
  NUB:{h:["@chillan_de_ley","@nublense_del_fondo","@el_rojo_de_chillan"],lugar:"Chillán",desde:0,gente:"de Chillán",mito:"el diablo rojo",pico:"Ñuble"},
  CBS:{h:["@minero_del_cobre","@el_salvador_grita","@cobresal_late"],lugar:"El Cobre",desde:1980,gente:"minero",mito:"el minero",pico:"El Salvador"},
  CBL:{h:["@loino_naranja","@calama_no_perdona","@zorros_del_fondo"],lugar:"Calama",desde:0,gente:"loíno",mito:"el naranja",pico:"los zorros"},
  SW:{h:["@wanderino_de_ley","@caturro_del_puerto","@el_decano_late"],lugar:"Valparaíso",desde:0,gente:"caturro",mito:"el decano",pico:"el puerto"},
  UES:{h:["@hispano_de_ley","@santa_laura_grita","@el_espanol_late"],lugar:"Santa Laura",desde:1923,gente:"hispano",mito:"el hispano",pico:"la colonia"},
  LSE:{h:["@papayero_de_ley","@la_portada_grita","@el_norte_late"],lugar:"La Serena",desde:0,gente:"papayero",mito:"el papayero",pico:"La Portada"},
  MAG:{h:["@carabelero","@magallanes_de_ley","@el_mano_late"],lugar:"el barrio",desde:0,gente:"carabelero",mito:"la carabela",pico:"el Mano"},
  CAL:{h:["@cementero_de_ley","@la_calera_grita","@calerano_late"],lugar:"La Calera",desde:0,gente:"cementero",mito:"el cementero",pico:"el valle"},
  DCO:{h:["@conce_de_ley","@el_leon_del_collao","@lota_late"],lugar:"Concepción",desde:0,gente:"de Conce",mito:"el león de Conce",pico:"el Collao"},
  UDC:{h:["@campanil_de_ley","@udec_del_fondo","@el_campanil_late"],lugar:"Concepción",desde:0,gente:"del Campanil",mito:"el Campanil",pico:"la universidad"},
  LIM:{h:["@tomatero_de_ley","@limache_grita","@el_tomate_late"],lugar:"Limache",desde:0,gente:"tomatero",mito:"el tomatero",pico:"Limache"},
  SLQ:{h:["@canario_de_quillota","@san_luis_late","@el_canario_grita"],lugar:"Quillota",desde:0,gente:"canario",mito:"el canario",pico:"el Lucio"},
  ANT:{h:["@puma_del_norte","@antofagasta_grita","@el_puma_late"],lugar:"Antofagasta",desde:0,gente:"puma",mito:"el puma",pico:"el norte"},
  REC:{h:["@recoleta_de_ley","@el_leon_de_recoleta","@recoleta_late"],lugar:"Recoleta",desde:0,gente:"de Recoleta",mito:"el león de Recoleta",pico:"el barrio"},
  IQQ:{h:["@dragon_de_iquique","@iquique_grita","@tierra_de_campeones"],lugar:"Iquique",desde:0,gente:"iquiqueño",mito:"el dragón",pico:"el puerto norte"},
  USF:{h:["@unino_de_ley","@san_felipe_grita","@el_uni_late"],lugar:"San Felipe",desde:0,gente:"unino",mito:"el uni",pico:"el Aconcagua"},
  COP:{h:["@copiapino_de_ley","@copiapo_grita","@el_atacama_late"],lugar:"Copiapó",desde:0,gente:"copiapino",mito:"el copiapino",pico:"el desierto"},
  CUR:{h:["@torero_de_curico","@la_granja_grita","@albirrojo_late"],lugar:"Curicó",desde:0,gente:"torero",mito:"el torero",pico:"La Granja"},
  RAN:{h:["@piduco_de_ley","@talca_grita","@rojinegro_late"],lugar:"Talca",desde:0,gente:"rojinegro",mito:"el piduco",pico:"el Maule"},
  TEM:{h:["@pije_de_temuco","@temuco_grita","@albiverde_late"],lugar:"Temuco",desde:0,gente:"pije",mito:"el pije",pico:"la Araucanía"},
  SMA:{h:["@santo_de_arica","@arica_grita","@san_marcos_late"],lugar:"Arica",desde:0,gente:"ariqueño",mito:"el santo",pico:"el morro"},
  PMO:{h:["@delfin_del_sur","@puerto_montt_grita","@chinquihue_late"],lugar:"Puerto Montt",desde:0,gente:"del sur",mito:"el delfín",pico:"el lago"},
  FV:{h:["@vialino_de_ley","@aurinegro_grita","@fernandez_vial"],lugar:"Concepción",desde:0,gente:"vialino",mito:"el aurinegro",pico:"la vial"},
  OSO:{h:["@toro_de_osorno","@osorno_grita","@el_probin_late"],lugar:"Osorno",desde:0,gente:"osornino",mito:"el toro",pico:"el probin"},
  RIV:{h:["@bando_de_nunez","@el_millonario_late","@river_del_fondo"],lugar:"Núñez",desde:1938,gente:"millonario",mito:"el millonario",pico:"la banda"},
  BOC:{h:["@xeneize_de_ley","@la_bombonera_grita","@boca_del_fondo"],lugar:"la Bombonera",desde:1940,gente:"xeneize",mito:"el xeneize",pico:"la doce"},
  RAC:{h:["@academia_de_ley","@el_cilindro_grita","@racing_late"],lugar:"el Cilindro",desde:1950,gente:"académico",mito:"la academia",pico:"Avellaneda"},
  IND:{h:["@rojo_de_avellaneda","@el_rojo_late","@independiente_grita"],lugar:"Avellaneda",desde:0,gente:"rojo",mito:"el rojo",pico:"la doble visera"},
  VEL:{h:["@fortin_de_liniers","@velez_late","@el_fortinero"],lugar:"Liniers",desde:0,gente:"fortinero",mito:"el fortín",pico:"el fortín"},
  SLO:{h:["@cuervo_de_boedo","@san_lorenzo_late","@boedo_grita"],lugar:"Boedo",desde:0,gente:"cuervo",mito:"el cuervo",pico:"Boedo"},
  ELP:{h:["@pincha_de_la_plata","@estudiantes_late","@el_leon_plata"],lugar:"La Plata",desde:0,gente:"pincha",mito:"el pincha",pico:"el bosque"},
  ROS:{h:["@canalla_de_arroyito","@central_late","@arroyito_grita"],lugar:"Arroyito",desde:0,gente:"canalla",mito:"el canalla",pico:"Rosario"},
  HUR:{h:["@quemero_de_ley","@huracan_late","@parque_grita"],lugar:"Parque Patricios",desde:0,gente:"quemero",mito:"el quemero",pico:"el globo"},
  LAN:{h:["@granate_de_ley","@lanus_late","@el_granate_grita"],lugar:"Lanús",desde:0,gente:"granate",mito:"el granate",pico:"el sur"},
  NEW:{h:["@rojinegro_rosario","@newells_late","@el_parque_grita"],lugar:"Rosario",desde:0,gente:"rojinegro",mito:"el león rosarino",pico:"el parque"},
  TAL:{h:["@la_t_de_cordoba","@talleres_late","@albiazul_grita"],lugar:"Córdoba",desde:0,gente:"albiazul",mito:"la T",pico:"el kempes"},
  TIG:{h:["@matador_de_victoria","@tigre_late","@el_matador_grita"],lugar:"Victoria",desde:0,gente:"matador",mito:"el matador",pico:"el delta"},
  BAN:{h:["@taladro_de_ley","@banfield_late","@el_taladro_grita"],lugar:"Banfield",desde:0,gente:"del taladro",mito:"el taladro",pico:"el sur profundo"}
};

const PLOP_TPL={
  gol_propio:[
    "GOL de {GOLEADOR}. En {L} no quedó nadie sentado.",
    "{GOLEADOR} la metió y {M} se acordó para qué juega.",
    "gol {G}. {RIVAL} mirando el piso y la tribuna arriba.",
    "el arco de {RIVAL} era un deseo. {GOLEADOR} lo cumplió.",
    "{P} despierta cuando aparece {GOLEADOR}.",
    "{CLUB} arriba. que {RIVAL} cuente los defensas de nuevo.",
    "así se grita en {L}: entra {GOLEADOR} y se acaba la discusión.",
    "un centro y {GOLEADOR}. a veces el fútbol es simple.",
    "la pelota entró y {M} ya está inventando el canto.",
    "{GOLEADOR} no pidió permiso. {L} tampoco."
  ],
  gana_agonico:[
    "en el descuento {GOLEADOR} nos salvó. el corazón no daba más.",
    "ya puteábamos el empate y {GOLEADOR} le cerró la boca a {RIVAL}.",
    "sobre la hora, como le gusta al hincha {G}: feo y eterno.",
    "90 y pico. gol en {L}. que no me hablen hasta mañana.",
    "{M} no se queda en el empate. {GOLEADOR} lo demostró.",
    "el partido se apagaba y {P} lo encendió.",
    "{GOLEADOR} en el alargue. mañana en la pega van a estar callados.",
    "descuento, grito, tres puntos. {L} no tiene techo.",
    "iban a escribir empate. {GOLEADOR} rompió la hoja.",
    "el hincha {G} aguanta hasta el final. hoy aguantó y ganó."
  ],
  pierde_local:[
    "perder en {L} es imperdonable. {RIVAL} se fue cantando.",
    "de local y ni un centro decente. {M} merece otra cosa.",
    "silbaron en {L} y tenían razón.",
    "{RIVAL} nos ganó en casa. que nadie invente una excusa.",
    "la tribuna se fue callada. duele más que el gol.",
    "esto no es {P}. esto es un domingo para olvidar.",
    "localidad: vergüenza. el hincha {G} no pagó por esto.",
    "en casa se gana o se explica. hoy no hubo ninguna de las dos.",
    "{CLUB} de local y {RIVAL} más cómodo. da rabia.",
    "apagaron la luz en {L}. merecido."
  ],
  empate:[
    "un punto que sabe a poco. {L} pedía los tres.",
    "empatar de local es perder con modales.",
    "ni {M} ni {RIVAL} se impusieron. el empate se llevó la tarde.",
    "empate de esos que no le contái a nadie en la micro.",
    "{CLUB} y {RIVAL} se anularon. el hincha {G} se quedó con hambre.",
    "un empate. ni fiesta ni funeral. oficina.",
    "el cero a cero en {L} es una siesta cara.",
    "{P} no vino a sumar uno. vino a sumar tres.",
    "se repartieron el punto y nadie quedó conforme.",
    "empate {G}. la tabla se mueve un poquito y el orgullo no."
  ],
  hat_trick:[
    "tres de {GOLEADOR}. el resto fue extra en la foto.",
    "{GOLEADOR} se comió el partido. {L} lo está nombrando.",
    "hat-trick. si lo venden, que sea caro.",
    "tres goles y hoy el nombre es {GOLEADOR}. {M} que lo aplauda.",
    "{GOLEADOR} por tres. {RIVAL} que pida la hora.",
    "{P} tiene un nueve suelto. se llama {GOLEADOR}.",
    "la pelota le obedece. tres veces, por si quedó duda.",
    "hat-trick {G}. el banco aplaude y el rival cuenta.",
    "{GOLEADOR} dejó el partido resuelto y la tribuna ronca.",
    "uno, dos, tres. {L} ya no pide otro. pide la camiseta."
  ],
  clasico_gana:[
    "el clásico se ganó en la cancha, no en la previa.",
    "mañana el hincha {G} camina distinto. clásico en el bolsillo.",
    "{GOLEADOR} decidió el clásico. {L} no lo va a olvidar.",
    "ganarle a {RIVAL} cura hasta el lumbago.",
    "clásico para {M}. que lo escriban así, sin adorno.",
    "la pica se gana con gol. {GOLEADOR} lo entendió.",
    "el vecino del otro no sale a comprar el pan. yo sí.",
    "{P} en un clásico no se discute. se canta.",
    "tres puntos y una semana de silencio en la otra vereda.",
    "clásico, {L}, {GOLEADOR}. no hace falta más dato."
  ],
  expulsion:[
    "roja inútil. ahora a transpirar con diez en {L}.",
    "se fue el más caliente. siempre se va el más caliente.",
    "segunda amarilla. la vieron todos en {L} menos él.",
    "diez hombres. {M} igual no tiene derecho a rendirse.",
    "la roja nos dejó cojos. que no se haga el leso.",
    "expulsión y el banco mirando el piso. postal del hincha {G}.",
    "con diez se sufre más. {P} igual se queda.",
    "roja y {RIVAL} se creció. hay que ordenarse ya.",
    "el que se va no juega. el que se queda, que corra.",
    "tarjeta roja en {L}. el partido se partió al medio."
  ],
  remontada:[
    "íbamos abajo y {M} dio vuelta la tarde.",
    "{GOLEADOR} empujó la remontada. {L} se vino abajo.",
    "el primer tiempo fue de {RIVAL}. el segundo, del hincha {G}.",
    "darlo vuelta duele más rico. esto es {P}.",
    "nadie avisó al marcador que íbamos perdiendo.",
    "remontada en {L}. que {RIVAL} lo cuente como quiera.",
    "de atrás y con bronca. así juega {M}.",
    "{GOLEADOR} no miró el resultado viejo. miró el arco.",
    "el banco dejó de sufrir y empezó a saltar. al fin.",
    "lo dimos vuelta. {P} no se escribe en el primer tiempo."
  ],
  goleada_favor:[
    "esto ya no es partido. es un paseo en {L}.",
    "{RIVAL} pide la hora y {GOLEADOR} no tiene reloj.",
    "goleada {G}. fea para ellos, domingo para uno.",
    "el marcador se desordenó y {M} no pidió permiso.",
    "a este ritmo {RIVAL} se va antes del pitazo.",
    "{CLUB} liquidó. en {L} ya cantan sin mirar el reloj.",
    "baile. que lo cuenten en la micro de vuelta.",
    "{P} de paseo. {RIVAL} de visita, en el peor sentido.",
    "goleada y el hincha {G} igual va a pedir el quinto. hambre.",
    "se acabó temprano. {GOLEADOR} dejó la firma y el resto acompañó."
  ],
  penal_errado:[
    "la mandó a la nube. el arquero ni se tiró.",
    "penal errado en {L}. la tarde entera en un solo tiro.",
    "quién le dio el penal. el hincha {G} quiere el nombre.",
    "{M} se quedó en silencio. el palo no perdona y el pie tampoco.",
    "penal a la luna. en {L} no hay explicación que alcance.",
    "se erró y la tribuna se hundió. {P} no merecía ese tiro.",
    "el penal era un punto. lo regalamos.",
    "ni fuerza ni rincón. un penal para olvidar en {L}.",
    "el arquero se quedó parado y la pelota igual no entró. cine mudo.",
    "errado. que el siguiente lo patee otro, por favor."
  ],
  atajada_penal:[
    "{ARQUERO} se quedó grande. el penal no era un trámite.",
    "penal atajado en {L}. la tribuna se olvidó de respirar.",
    "el uno atajó y {M} tiene arquero para rato.",
    "le dijo que no al penal. el hincha {G} todavía está gritando.",
    "{P} se salvó en la línea de los doce pasos.",
    "el arquero eligió un lado y acertó. en {L} eso es himno.",
    "atajada. {RIVAL} ya la estaba festejando.",
    "un penal menos y {M} sigue vivo.",
    "el uno no se tiró al centro por suerte. se tiró bien.",
    "eso no se entrena el domingo. {ARQUERO} lo tiene de nacimiento."
  ],
  lesion_grave:[
    "se quedó tirado y {L} se calló de verdad.",
    "que no sea nada. el partido puede esperar.",
    "salió en camilla y al hincha {G} se le pasó el enojo.",
    "{M} pierde a uno y ojalá sea solo por hoy.",
    "la tribuna dejó de cantar. eso asusta más que el gol.",
    "lesión en {L}. que vuelva, no que se haga el héroe hoy.",
    "{P} se queda corto cuando uno no se levanta.",
    "ojalá sea un susto. el banco ya está más serio.",
    "se llevaron a uno y el partido siguió, pero más feo.",
    "prioridad la persona. los tres puntos después."
  ],
  tiroLibre:[
    "tiro libre al borde del área. en {L} ya están de pie.",
    "si no es gol, que al menos le saque el sueño a {RIVAL}.",
    "la barrera saltó tarde. el hincha {G} no.",
    "{M} tiene un tiro libre. que no lo regalen.",
    "pelota quieta, corazón rápido. {L} lo sabe.",
    "{P} y una pelota detenida. puede ser el partido.",
    "que la ponga alguien con pierna, no con discurso.",
    "tiro libre. {RIVAL} arma la muralla y igual tiembla."
  ],
  arquero_figura:[
    "{ARQUERO} está enorme. {L} ya lo nombró figura.",
    "el uno nos mantiene vivos. {M} se lo debe.",
    "atajadas de esas que valen un gol. hincha {G} agradecido.",
    "sin {ARQUERO} esto era goleada al revés.",
    "{P} tiene arquero. hoy se notó.",
    "el arco es chico cuando está {ARQUERO}.",
    "figura bajo los tres palos. que no lo discutan.",
    "valla que aguanta. {RIVAL} se va a acostar con rabia."
  ]
};
PLOP_TPL.empate_pobre=PLOP_TPL.empate;

/* Memes de prueba: del partido, no de la vida real de nadie. */
const PLOP_MEME=[
  {ctx:"gol_propio",quien:"@meme_del_90",txt:"nadie pidió ese centro. {GOLEADOR} igual lo convirtió. formato meme, final feliz."},
  {ctx:"gol_propio",quien:"@plot_del_area",txt:"plot twist: el que iba a definir era {GOLEADOR} y esta vez sí definió."},
  {ctx:"gol_propio",quien:"@replay_lento",txt:"el replay lo muestra lento y uno igual grita. enfermedad de domingo."},
  {ctx:"gana_agonico",quien:"@meme_del_90",txt:"mi vieja: ya apaga eso. yo: quedan cuatro. {GOLEADOR}: quedan cero."},
  {ctx:"gana_agonico",quien:"@plot_del_area",txt:"el empate ya estaba escrito. {GOLEADOR} rompió la hoja en el descuento."},
  {ctx:"gana_agonico",quien:"@sillon_oficial",txt:"tiré el cojín al aire. el cojín no pidió un gol al 90."},
  {ctx:"pierde_local",quien:"@meme_del_90",txt:"de local, con la gente, y {RIVAL} se fue a la micro cantando. capítulo final."},
  {ctx:"pierde_local",quien:"@plot_del_area",txt:"plot: íbamos a ganar. capítulo final: no."},
  {ctx:"pierde_local",quien:"@sillon_oficial",txt:"la tribuna silbó y el césped no tuvo la culpa. buen intento."},
  {ctx:"empate",quien:"@meme_del_90",txt:"empatar de local es perder con educación. nadie aplaudió el protocolo."},
  {ctx:"empate",quien:"@plot_del_area",txt:"los dos arqueros fueron figura. el partido fue figurante."},
  {ctx:"empate_pobre",quien:"@sillon_oficial",txt:"cero a cero y yo igual transpiré. el cuerpo no leyó el marcador."},
  {ctx:"hat_trick",quien:"@meme_del_90",txt:"tres goles. el resto del equipo fue extra de la película de {GOLEADOR}."},
  {ctx:"hat_trick",quien:"@plot_del_area",txt:"hat-trick y en el living ya lo iban a sacar. clásico del living."},
  {ctx:"clasico_gana",quien:"@meme_del_90",txt:"el clásico no se explica. se grita y después se guarda el silencio del otro."},
  {ctx:"clasico_gana",quien:"@cuñado_modo",txt:"le mandé el marcador al cuñado, sin texto. el texto era el marcador."},
  {ctx:"expulsion",quien:"@meme_del_90",txt:"segunda amarilla. el tipo no sabe contar hasta dos. diez contra once."},
  {ctx:"expulsion",quien:"@plot_del_area",txt:"roja. yo en el living: no era para tanto. el replay: era para tanto."},
  {ctx:"remontada",quien:"@meme_del_90",txt:"íbamos abajo y nadie avisó al marcador. error de ellos."},
  {ctx:"remontada",quien:"@sillon_oficial",txt:"el primer tiempo fue de ellos. el segundo fue una venganza con público."},
  {ctx:"goleada_favor",quien:"@meme_del_90",txt:"{RIVAL} pide la hora y el reloj sigue en el primer tiempo. cruel."},
  {ctx:"goleada_favor",quien:"@plot_del_area",txt:"esto ya no es partido. es un paseo con público que pagó entrada."},
  {ctx:"penal_errado",quien:"@meme_del_90",txt:"la mandó a la luna. el arquero ni se tiró. cine mudo, entrada cara."},
  {ctx:"penal_errado",quien:"@plot_del_area",txt:"penal errado. temporada resumida en un tiro. no hay más plot."},
  {ctx:"penal_errado",quien:"@sillon_oficial",txt:"quién le dio el penal. quiero el nombre, no el discurso."},
  {ctx:"atajada_penal",quien:"@meme_del_90",txt:"{ARQUERO} dijo que no. el penal era un trámite y no le salió el trámite."},
  {ctx:"atajada_penal",quien:"@plot_del_area",txt:"el uno atajó y la tribuna se olvidó de respirar. detalle menor."},
  {ctx:"lesion_grave",quien:"@meme_del_90",txt:"se quedó tirado y hasta el meme se calló. que no sea nada."},
  {ctx:"tiroLibre",quien:"@plot_del_area",txt:"tiro libre al borde. si no es gol, que al menos asuste al arquero."},
  {ctx:"arquero_figura",quien:"@sillon_oficial",txt:"figura: el que está bajo los tres palos. el resto que firme de testigo."}
];

(function(){
  if(typeof TUITS_MOMENTO!=="undefined" && Array.isArray(TUITS_MOMENTO)){
    PLOP_MEME.forEach(function(t){
      /* 7.9087 (Claude) · gol_propio NO va al pool global: por diseño un gol común en neutro no fuerza tuit */
      if(t.ctx==="gol_propio") return;
      if(!TUITS_MOMENTO.some(function(x){ return x.txt===t.txt; })) TUITS_MOMENTO.push({ctx:t.ctx,quien:t.quien,txt:t.txt});
    });
  }
  if(typeof tuitDeCtx!=="function" || tuitDeCtx._eq) return;
  var base=tuitDeCtx;
  var recientes=[];
  function recuerda(txt){ recientes.push(txt); if(recientes.length>24) recientes.shift(); }
  function libre(arr){
    var u=arr.filter(function(x){ return recientes.indexOf(x.txt)<0; });
    var pool=u.length?u:arr;
    return pool[Math.floor(Math.random()*pool.length)];
  }
  function ok(txt){
    if(!txt || txt.length>200) return false;
    if(/\{[A-Z_]+\}/.test(txt) && /penal_errado/.test(ok._ctx||"")) return false;
    if(typeof textoPlopAjeno==="function" && textoPlopAjeno(txt)) return false;
    return true;
  }
  function metaDe(){
    if(typeof E==="undefined" || !E || !E.club) return null;
    var id=E.club;
    if(id==="COB"){
      var nom=E.clubNombre||"";
      var anio=E.anio||2026;
      if(/cobreloa/i.test(nom) || (anio<2000 && !/cobresal/i.test(nom))) id="CBL";
      else id="CBS";
    }
    var meta=PLOP_CLUB[id];
    return meta?{id:E.club, meta:meta}:null;
  }
  function llenar(meta, txt){
    var anio=(typeof E!=="undefined" && E && E.anio)||2026;
    var L=(meta.desde && anio<meta.desde)?"la cancha":meta.lugar;
    return txt.replace(/\{L\}/g,L).replace(/\{G\}/g,meta.gente).replace(/\{M\}/g,meta.mito).replace(/\{P\}/g,meta.pico);
  }
  function envuelto(ctx){
    /* 7.9087 (Claude) · la base decide SI hay tuit: si dice que no (gol común en neutro) no se inventa uno,
       y la erupción chilensis del gol no se reemplaza (tests core "en neutro un gol común no fuerza tuit") */
    var b0=base(ctx);
    if(!b0) return b0;
    if(ctx==="gol_propio" && /GOO+|CTM/i.test(b0.txt||"")) return b0;
    try{
      ok._ctx=ctx;
      var r=Math.random();
      var memes=PLOP_MEME.filter(function(t){ return t.ctx===ctx; });
      if(memes.length && r<0.14){
        var m=libre(memes);
        if(m && ok(m.txt)){ recuerda(m.txt); return {ctx:ctx, quien:m.quien, txt:m.txt}; }
      }
      var pack=metaDe();
      var tpls=pack && PLOP_TPL[ctx];
      if(tpls && tpls.length && r<0.74){
        var candidatos=tpls.map(function(t,i){
          return {quien:pack.meta.h[i%pack.meta.h.length], txt:llenar(pack.meta, t)};
        }).filter(function(t){ return ok(t.txt); });
        if(candidatos.length){
          var t=libre(candidatos);
          recuerda(t.txt);
          return {ctx:ctx, quien:t.quien, txt:t.txt, club:pack.id};
        }
      }
    }catch(e){}
    return b0;
  }
  Object.keys(base).forEach(function(k){ envuelto[k]=base[k]; });
  envuelto._eq=true;
  tuitDeCtx=envuelto;
})();
