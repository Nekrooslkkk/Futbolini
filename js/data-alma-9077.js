"use strict";
/* ============================================================
   FUTBOLINI · data-alma-9077.js  (7.9077 · revisar el alma)
   Pedido del autor: "revisar el alma y mejorar eso". Medido con devInformeCobertura():
   76 dirigibles, 35 ricos, 41 medios. Los medios eran los 30 de la AFA y 11 de Segunda;
   River, Boca, Racing, Independiente, San Lorenzo, Vélez y Estudiantes tenían 3 ítems
   (menos que Deportes Rengo). Acá cada uno recibe dilemas propios hasta llegar a "rico" (6+).

   A diferencia de data-alma-arg.js (una plantilla con el nombre cambiado), cada dilema está
   escrito para ESE club. INTEGRIDAD (regla del repo): ficción de dirigencia sobre ANCLAS
   PÚBLICAS (estadio, barrio, ciudad, rivalidades, debates conocidos). Sin frases de personas
   reales, sin hechos históricos inventados con fecha, sin jugadores nuevos. Lo que pasa en la
   partida es del juego. Tono: realista, nada de burla.
   Formato: [título, situación, [[opción, detalle, perfil], ×3]]. El perfil decide consecuencias.
   ============================================================ */
const ALMA_PERFIL={
  obra:    {ef:{plata:-70,prestigio:3}, grupos:{socios:10,comunidad:6,directorio:-6}, dif:45,
            bien:"La obra avanza a la vista de todos y el socio lo agradece con la cuota al día.", mal:"La obra se atrasa y la plata se fue antes que el cemento."},
  caja:    {ef:{plata:60}, grupos:{directorio:10,hinchada:-8,tecnico:-4}, dif:30,
            bien:"La caja respira. Nadie aplaude un balance, pero el club duerme tranquilo.", mal:"Ahorraste donde dolía y la tribuna lo notó antes que el tesorero."},
  gasto:   {ef:{plata:-90,moral:5}, grupos:{hinchada:10,tecnico:8,directorio:-8}, dif:50,
            bien:"La apuesta rinde en la cancha y la gente vuelve a creer.", mal:"Se gastó fuerte y el equipo no respondió: la planilla quedó pesando."},
  cantera: {ef:{cantera:8}, grupos:{socios:6,comunidad:6,tecnico:-4}, rep:{credibilidad:2}, dif:40,
            bien:"Los cabros responden y el club se reconoce en ellos.", mal:"Se apostó por los juveniles y la categoría les quedó grande este año."},
  barrio:  {ef:{prestigio:2}, grupos:{comunidad:12,socios:6,sponsors:-4}, dif:35,
            bien:"El barrio siente que el club volvió a ser suyo.", mal:"El gesto se quedó en foto: el barrio pedía algo más que una visita."},
  sponsor: {ef:{plata:80}, grupos:{sponsors:12,socios:-8,hinchada:-6}, dif:40,
            bien:"El acuerdo trae plata sin tocar lo que la gente considera sagrado.", mal:"La plata entró, pero la gente siente que el club se vendió un poco."},
  barra:   {ef:{riesgo:6}, grupos:{hinchada:10,prensa:-8,anfp:-6}, dif:55,
            bien:"La tribuna queda de tu lado. Por ahora.", mal:"El acuerdo con la barra se supo y ahora es tema de todos."},
  firme:   {rep:{dureza:4,credibilidad:2}, grupos:{prensa:6,hinchada:-6,directorio:4}, dif:40,
            bien:"La firmeza se respeta, aunque cueste aplausos.", mal:"Te plantaste y quedaste solo: la pelea te costó más de lo que ganaste."},
  socios:  {grupos:{socios:14,directorio:-8}, rep:{credibilidad:3}, dif:35,
            bien:"El socio siente que el club lo escucha de verdad.", mal:"Abriste la discusión y el socio la usó para pasar todas las cuentas pendientes."},
  camarin: {ef:{moral:5}, grupos:{camarin:10,directorio:-4}, dif:35,
            bien:"El plantel lo toma como un gesto y responde en la cancha.", mal:"El gesto con el plantel se leyó afuera como privilegio."},
  politica:{ef:{capital:4}, grupos:{anfp:8,comunidad:-4}, rep:{credibilidad:-2}, dif:45,
            bien:"El acomodo con el poder de turno abre puertas que antes estaban cerradas.", mal:"El acomodo salió a la luz y te pasó la cuenta en credibilidad."},
  prensa:  {grupos:{prensa:10,hinchada:-4}, rep:{credibilidad:3}, dif:30,
            bien:"Hablar claro te ordena el relato y la prensa te lo reconoce.", mal:"Diste la cara y la tomaron para el titular que querían."}
};
const ALMA_9077={
 /* ---------- los grandes de la AFA (tenían 3: necesitan 3) ---------- */
 RIV:[
  ["El Monumental y el precio de la platea","Después de la remodelación, el estadio es de los más grandes del continente y el abono subió. El socio de siempre dice que lo están echando de su propia cancha.",
   [["Congelar el abono del socio antiguo","Menos plata por entrada, más cancha llena de los de siempre.","socios"],["Subir precios: el estadio lo vale","La obra se paga con lo que entra.","caja"],["Abrir una tribuna popular barata","Se pierde recaudación, se gana ruido.","barrio"]]],
  ["La cantera de Núñez tiene precio de exportación","Un juvenil del predio despierta interés de Europa antes de consolidarse en Primera. En el club dicen que esa es la marca de la casa: formar para jugar, no para vender.",
   [["Blindarlo con contrato largo","Que la venta llegue, pero cuando él haya jugado acá.","cantera"],["Venderlo ahora, al mejor postor","El mercado europeo no espera a nadie.","caja"],["Dejar que lo decida él y su familia","Sin presión, sin blindaje.","camarin"]]],
  ["Otro sponsor para la camiseta","El estadio ya lleva el nombre de una marca y ahora una empresa quiere un espacio más en la camiseta. En Núñez hay quien dice que la banda roja ya está bastante tapada.",
   [["Rechazarlo: la camiseta no es un cartel","La identidad no tiene precio.","firme"],["Aceptarlo solo en la manga","Plata sin tapar la banda.","sponsor"],["Llevarlo a votación de socios","Que decida la asamblea.","socios"]]]
 ],
 BOC:[
  ["La Bombonera no alcanza","Hay más socios que lugares. La discusión de siempre vuelve: ampliar en La Boca o pensar en otro estadio. El barrio entero opina.",
   [["Ampliar donde está","La Bombonera es La Boca. Nada se mueve.","obra"],["Estudiar un estadio nuevo","Más lugar, más plata, menos identidad.","caja"],["Sortear las entradas entre socios","Ordenar lo que hay antes de construir.","socios"]]],
  ["La reventa de entradas es un negocio","Las entradas de socio aparecen en la reventa a precio de oro. La prensa pregunta quién está detrás. La tribuna sabe y calla.",
   [["Denunciar y cruzar datos","Aunque salpique a gente del club.","firme"],["Cambiar el sistema de acceso sin buscar culpables","Arreglar sin incendiar.","prensa"],["Dejarlo pasar: todos los clubes lo tienen","Silencio y tribuna tranquila.","barra"]]],
  ["El barrio de La Boca pide que el club vuelva a mirarlo","Los vecinos dicen que los turistas llenan Caminito y el club solo aparece los domingos. Piden escuelas deportivas y apoyo en los conventillos.",
   [["Abrir el club al barrio con programas sociales","Menos marketing, más Boca.","barrio"],["Hacer una campaña con sponsors para el barrio","La plata la ponen otros.","sponsor"],["No es tarea del club de fútbol","Cada uno en lo suyo.","caja"]]]
 ],
 RAC:[
  ["El Cilindro y la Academia","El estadio de hormigón es un símbolo de Avellaneda. Mantenerlo cuesta cada año más de lo que el club presupuesta.",
   [["Hacer la mantención completa","Que el Cilindro dure otros cincuenta años.","obra"],["Arreglar solo lo urgente","El plantel también necesita.","gasto"],["Buscar un socio privado para las obras","Plata a cambio de explotación comercial.","sponsor"]]],
  ["La pelea en Avellaneda","Dos gigantes a cuadras de distancia. Cada clásico con Independiente paraliza la ciudad y la seguridad pide jugar sin visitantes.",
   [["Pedir que vuelva el público visitante","El fútbol es con dos hinchadas.","firme"],["Aceptar sin visitantes","Seguridad primero.","politica"],["Proponer un protocolo propio con el municipio","Hacerse cargo del problema.","barrio"]]],
  ["La hinchada que no se va nunca","Racing llena aunque pierda. La dirigencia sabe que esa fidelidad también es presión: no hay excusa para no pelear arriba.",
   [["Reforzar el plantel para pelear todo","La gente se lo merece.","gasto"],["Explicar el proyecto con números","Sin prometer lo que no se tiene.","prensa"],["Premiar al socio fiel con beneficios","Cuidar al que siempre está.","socios"]]]
 ],
 IND:[
  ["La deuda del Rey de Copas","El club más ganador de América carga una deuda que no se condice con su historia. Los acreedores golpean la puerta y la hinchada no quiere oír de ajustes.",
   [["Plan de pagos duro y transparente","Decir la verdad aunque duela.","caja"],["Vender a la figura para respirar","La cantera siempre produce otro.","caja"],["Pedir un aporte de los socios","Que el club sea de los que lo quieren.","socios"]]],
  ["El Libertadores de América necesita obras","El estadio se renovó hace años, pero partes siguen sin terminar. La obra inconclusa es una herida para el socio.",
   [["Terminar la obra antes que nada","Cerrar la herida.","obra"],["Priorizar el plantel","La obra puede esperar otra temporada.","gasto"],["Concesionar espacios para financiarla","Plata de otros para terminar.","sponsor"]]],
  ["La mística de las copas","La hinchada mide cada temporada con la vara de las copas internacionales. La realidad del plantel es otra.",
   [["Bajar la vara en público","Hablar de reconstrucción.","prensa"],["Prometer volver a la copa","La mística se alimenta.","gasto"],["Apostar por los juveniles del club","Reconstruir desde abajo.","cantera"]]]
 ],
 VEL:[
  ["El Amalfitani fuera del fútbol","El estadio de Liniers recibe recitales que dejan plata, pero el césped sufre y el equipo lo paga.",
   [["Seguir con los recitales","La plata sostiene el club.","caja"],["Cerrar el estadio a eventos","El fútbol primero.","firme"],["Limitar fechas y cobrar más","Un punto medio.","sponsor"]]],
  ["El club social de Liniers","Vélez es también un gran club polideportivo. Los socios de otras disciplinas piden más presupuesto y el fútbol no quiere soltar.",
   [["Repartir mejor entre disciplinas","El club es más que la Primera.","socios"],["Priorizar el fútbol profesional","Es lo que sostiene todo.","gasto"],["Crear un fondo aparte con sponsors","Que paguen otros.","sponsor"]]],
  ["La Villa Olímpica y la formación","Las divisiones inferiores son una fábrica. El problema es que se van jóvenes, antes de devolverle algo al club.",
   [["Cláusulas altas desde juveniles","Que se vayan, pero bien pagados.","cantera"],["Darles minutos en Primera ya","Que valgan más jugando.","camarin"],["Vender al primero que ofrezca","Caja inmediata.","caja"]]]
 ],
 SLO:[
  ["La vuelta a Boedo","El proyecto de volver al barrio de origen es la causa que une a la gente. La construcción depende de plata que el club no tiene.",
   [["Todo el esfuerzo a la vuelta","Aunque el plantel se resienta.","obra"],["Avanzar despacio sin endeudarse","Boedo, pero con los pies en la tierra.","caja"],["Hacer una campaña de aportes de hinchas","Que la vuelta sea de todos.","socios"]]],
  ["El Bidegain y la crisis","La institución arrastra problemas económicos y de conducción. Los socios piden una auditoría completa.",
   [["Abrir los libros a una auditoría","Transparencia total.","prensa"],["Resolverlo puertas adentro","Sin escándalos.","politica"],["Llamar a asamblea extraordinaria","Que los socios decidan.","socios"]]],
  ["El Ciclón y el barrio","El club nació con una historia de barrio y de parroquia. La gente de Boedo quiere que el club vuelva a estar presente, más allá del estadio.",
   [["Programas en escuelas de Boedo y Almagro","Volver a ser del barrio.","barrio"],["Una sede social en Boedo antes que el estadio","Presencia primero.","obra"],["Priorizar lo deportivo","Ganar también es volver.","gasto"]]]
 ],
 ELP:[
  ["El estadio renovado en La Plata","El Pincha tiene de nuevo su casa en 1 y 57. Mantenerla moderna y llena es el desafío de cada semana.",
   [["Invertir en servicios y comodidad","Una casa a la altura.","obra"],["Precios populares para llenar","La gente primero.","socios"],["Explotar el estadio con eventos","Que el estadio se pague solo.","sponsor"]]],
  ["La escuela del Pincha","El club tiene una tradición de formación y de trabajo táctico. Hay quien dice que esa identidad se está perdiendo.",
   [["Contratar un cuerpo técnico formativo","Que la identidad baje a las inferiores.","cantera"],["Seguir el mercado: comprar hecho","Resultados rápidos.","gasto"],["Apostar a ex jugadores del club para formar","La mística se transmite.","camarin"]]],
  ["El clásico platense","La ciudad vive en dos colores. El clásico con Gimnasia define temporadas, directivas y ánimos.",
   [["Preparar el clásico como final","Es lo que la gente pide.","gasto"],["Bajar la temperatura en público","Un partido más, dicen afuera.","prensa"],["Pactar con Gimnasia un protocolo de paz","Que se juegue en paz.","barrio"]]]
 ],
 /* ---------- el resto de la AFA (tenían 4: necesitan 2) ---------- */
 ROS:[
  ["La ciudad dividida","En Rosario la rivalidad con Newell's atraviesa familias, oficinas y escuelas. El clásico define el ánimo de la ciudad por meses.",
   [["Preparar el clásico como final","Es lo único que importa, dicen.","gasto"],["Bajar la temperatura desde el club","El fútbol no es la guerra.","prensa"],["Acordar con el rival acciones sociales conjuntas","Una ciudad, dos camisetas.","barrio"]]],
  ["El Gigante necesita techo","El estadio de Arroyito es enorme y viejo. Los socios piden techar tribunas y mejorar accesos.",
   [["Encarar la obra","La casa primero.","obra"],["Esperar a que alcance la plata","Sin deuda nueva.","caja"],["Buscar financiamiento de la provincia","Plata pública con condiciones.","politica"]]]
 ],
 TAL:[
  ["El Kempes es de todos","El estadio es provincial y Talleres lo llena. Otros clubes y eventos lo usan también, y la T paga por cada fecha.",
   [["Pedir la concesión de largo plazo","Hacerse cargo del estadio.","politica"],["Construir un estadio propio","Independencia total, a pagar por años.","obra"],["Seguir como está","No cambiar lo que funciona.","caja"]]],
  ["Córdoba quiere un grande","La hinchada de la T es de las más numerosas del interior. La presión por pelear arriba todos los años es real.",
   [["Invertir para pelear todo","Córdoba se lo merece.","gasto"],["Construir de a poco","Sin pasos en falso.","cantera"],["Explicar el presupuesto con números","Honestidad antes que promesas.","prensa"]]]
 ],
 HUR:[
  ["El Globo y el Ducó","El Tomás Adolfo Ducó es un estadio histórico que necesita obras mayores. El barrio lo considera patrimonio.",
   [["Declararlo prioridad y juntar fondos","El Ducó no se cae.","obra"],["Pedir apoyo al gobierno de la ciudad","Patrimonio es de todos.","politica"],["Arreglar lo mínimo y seguir","La plata no alcanza.","caja"]]],
  ["Parque Patricios cambió","El barrio se llenó de oficinas y empresas tecnológicas. El club puede aprovecharlo o quedar como un vecino antiguo.",
   [["Buscar sponsors del nuevo barrio","Plata cerca de casa.","sponsor"],["Abrir el club a los vecinos nuevos","Sumar socios del barrio.","barrio"],["Cuidar al socio de siempre","El Globo es de los de antes.","socios"]]]
 ],
 LAN:[
  ["El modelo Lanús","El club es citado como ejemplo de orden institucional. Mantenerlo exige decir que no a gastos que la hinchada pide.",
   [["Mantener el orden aunque cueste","El modelo es el club.","caja"],["Hacer una excepción por un refuerzo","Una vez no rompe nada.","gasto"],["Explicarlo en asamblea","Que el socio lo entienda.","socios"]]],
  ["Los chicos del sur","Muchos juveniles del conurbano sur llegan al club. Algunos vienen de familias que dependen de que el chico llegue.",
   [["Programa de apoyo a familias de juveniles","El club cuida.","cantera"],["Profesionalizar sin involucrarse","Cada uno en lo suyo.","caja"],["Becas de estudio obligatorias","Fútbol y colegio.","barrio"]]]
 ],
 ARG:[
  ["La casa del Diego","El estadio lleva el nombre del más grande. Cada visita de turistas deja plata, pero el club no quiere volverse un museo.",
   [["Abrir un museo y recorridos","La historia también paga.","sponsor"],["Cuidar el estadio para el socio","Primero los de La Paternal.","socios"],["Invertir esa plata en inferiores","Hacer al próximo Diego.","cantera"]]],
  ["El Semillero del Mundo","La cantera es la marca registrada del Bicho. Un club grande ofrece mucho por un juvenil de 17 años.",
   [["Aceptar: así vive el club","Formar y vender.","caja"],["Blindarlo un año más","Que juegue en Primera primero.","cantera"],["Pedir un porcentaje de la venta futura","Venta inteligente.","prensa"]]]
 ],
 NEW:[
  ["El estadio que lleva un nombre propio","El Coloso lleva el nombre de un entrenador que es leyenda del club. Las obras pendientes son una deuda con esa historia.",
   [["Encarar la remodelación","Estar a la altura del nombre.","obra"],["Priorizar el plantel","La historia se honra ganando.","gasto"],["Pedir a los socios que decidan","Asamblea.","socios"]]],
  ["La Lepra y las inferiores","Newell's tiene una tradición de juveniles que llegaron lejos. Hoy la hinchada dice que el club vende antes de disfrutarlos.",
   [["Retener a los mejores juveniles","Que jueguen acá.","cantera"],["Vender para ordenar la caja","Así funciona el negocio.","caja"],["Dar la palabra a los chicos y sus familias","Que decidan ellos.","camarin"]]]
 ],
 BEL:[
  ["El Gigante de Alberdi","El Pirata tiene su propia cancha en el barrio y también juega en el Kempes. Cada partido abre la discusión de dónde conviene jugar.",
   [["Jugar todo en Alberdi","El barrio es la casa.","barrio"],["Jugar los grandes en el Kempes","Más entradas, más plata.","caja"],["Ampliar la cancha del barrio","Crecer donde está.","obra"]]],
  ["La hinchada que siguió en la B","Belgrano mantuvo su hinchada en los años difíciles. Hoy exige que el club no vuelva a caer.",
   [["Cuidar la categoría antes que todo","Sin riesgos.","caja"],["Invertir para crecer","La hinchada merece más.","gasto"],["Premiar a los socios de los años duros","Memoria.","socios"]]]
 ],
 DYJ:[
  ["El Halcón de Varela","Un club chico que llegó a jugar copas internacionales. Mantener ese nivel con un estadio pequeño es el desafío.",
   [["Sostener el modelo de juego","La identidad trajo los resultados.","camarin"],["Invertir más en el plantel","Ir por más.","gasto"],["Consolidar la estructura del club","Que no dependa del técnico de turno.","cantera"]]],
  ["Florencio Varela y el club","El distrito crece y el club es de lo poco que lo pone en el mapa. El municipio ofrece ayuda a cambio de presencia.",
   [["Aceptar la alianza con el municipio","Ayuda con condiciones.","politica"],["Mantener distancia","El club es independiente.","firme"],["Programas propios en los barrios","Presencia sin intermediarios.","barrio"]]]
 ],
 INS:[
  ["Alta Córdoba y la Gloria","Instituto es parte de la identidad de Alta Córdoba. El barrio pide un club presente y un equipo que no sufra.",
   [["Presencia social en el barrio","La Gloria es de Alta Córdoba.","barrio"],["Plantel para la permanencia","Primero sobrevivir.","gasto"],["Ordenar la caja","Sin deudas nuevas.","caja"]]],
  ["La cantera de la Gloria","El club forma bien y vende rápido. La hinchada ya no quiere despedir a sus chicos a los seis meses.",
   [["Retener a los juveniles un año más","Que la gente los disfrute.","cantera"],["Vender, así se sostiene el club","Realismo.","caja"],["Contratos con cláusulas de regreso","Que vuelvan.","prensa"]]]
 ],
 UNI:[
  ["Santa Fe es de dos","La competencia con Colón es por todo: socios, sponsors, chicos de las inferiores y, sobre todo, el clásico.",
   [["Ganar el clásico a toda costa","Es lo que la ciudad mide.","gasto"],["Competir por socios con beneficios","Ganar la ciudad desde abajo.","socios"],["Buscar sponsors que no estén con el rival","Ganar la plata.","sponsor"]]],
  ["El 15 de Abril y su tamaño","El estadio es antiguo y chico. Ampliarlo o mudarse es una discusión que divide a la gente.",
   [["Ampliar donde está","La casa es la casa.","obra"],["Pensar en un estadio nuevo","Crecer en serio.","caja"],["Mejorar lo que hay sin ampliar","Paso a paso.","socios"]]]
 ],
 GLP:[
  ["El Bosque y el municipio","El estadio está dentro del Paseo del Bosque. Cualquier obra pasa por permisos que tardan años.",
   [["Presionar al municipio","El club lo necesita.","politica"],["Hacer lo que se puede sin permisos grandes","Pragmático.","caja"],["Mudarse de a poco a otro predio","El futuro.","obra"]]],
  ["La hinchada más fiel de La Plata","El Lobo tiene una hinchada enorme para su tamaño de club. Esa fidelidad no perdona una temporada mala.",
   [["Premiar al socio con beneficios","Cuidar al que siempre está.","socios"],["Reforzar el plantel","La gente merece un equipo.","gasto"],["Hablar claro del presupuesto","Honestidad.","prensa"]]]
 ],
 TUC:[
  ["El Decano y los viajes","Cada viaje a Buenos Aires es un presupuesto. Los clubes del interior juegan con desventaja económica.",
   [["Pedir a la liga compensación por viajes","El interior también es fútbol.","politica"],["Buscar un sponsor de transporte","Que viaje otro.","sponsor"],["Recortar en otros gastos","Ajustarse.","caja"]]],
  ["Tucumán llena igual","La gente del Decano va aunque el equipo ande mal. La dirigencia sabe que esa fidelidad no se puede defraudar.",
   [["Precios bajos para el socio","Cuidar al fiel.","socios"],["Invertir esa recaudación en el plantel","Devolver en la cancha.","gasto"],["Programas con escuelas de la provincia","Crecer la hinchada.","barrio"]]]
 ],
 TIG:[
  ["El Matador y los ascensos","Tigre sube y baja. Salir de ese ciclo requiere un proyecto que no dependa de una temporada.",
   [["Proyecto a cinco años","Estabilidad primero.","cantera"],["Todo por mantenerse este año","Urgencia.","gasto"],["Cambiar la estructura del club","Profesionalizar.","caja"]]],
  ["Victoria y la zona norte","El club está en una zona con plata, pero los vecinos no siempre ven al fútbol como su causa.",
   [["Atraer sponsors de la zona","Plata cerca.","sponsor"],["Abrir el club a las familias","Sumar socios.","barrio"],["Cuidar la identidad de siempre","Tigre es Tigre.","socios"]]]
 ],
 BAN:[
  ["El Taladro y la cantera","Banfield vive de formar jugadores desde hace décadas. Un club europeo quiere un convenio de exclusividad.",
   [["Firmar el convenio","Plata y vitrina.","sponsor"],["Mantener la independencia","Vender a quien convenga.","firme"],["Invertir más en el predio","Mejor cantera, mejores ventas.","cantera"]]],
  ["El Sola de barrio","El estadio es de barrio y tiene exigencias de Primera. Seguridad, accesos y comodidades cuestan.",
   [["Hacer las obras exigidas","Cumplir.","obra"],["Pedir plazo a la liga","Sin plata no hay obra.","politica"],["Reducir el aforo","Menos gente, menos gasto.","caja"]]]
 ],
 PLA:[
  ["El Calamar volvió","Volver a Primera fue una fiesta. Quedarse exige un presupuesto que el club no siempre tiene.",
   [["Invertir para quedarse","No volver a bajar.","gasto"],["Mantenerse con lo que hay","Sin riesgos.","caja"],["Apostar a las inferiores","Identidad.","cantera"]]],
  ["Vicente López y su estadio","El club juega en una zona cara. Cada metro cuadrado vale mucho y hay ofertas por terrenos del club.",
   [["No vender nada del club","El patrimonio es sagrado.","firme"],["Vender un terreno para invertir","Plata para crecer.","caja"],["Consultar a los socios","Decisión de todos.","socios"]]]
 ],
 CCO:[
  ["El Único de Santiago del Estero","El estadio provincial es enorme y moderno. Jugar ahí cambió la escala del club, pero no es del club.",
   [["Negociar el uso con la provincia","Aprovechar lo que hay.","politica"],["Volver a la cancha propia","Independencia.","firme"],["Llenar el Único con precios bajos","Hacer crecer la hinchada.","socios"]]],
  ["El Ferroviario en Primera","Santiago del Estero descubrió la Primera hace poco. La gente no quiere perderla.",
   [["Todo por la permanencia","No bajar.","gasto"],["Construir estructura para el futuro","Para quedarse de verdad.","cantera"],["Hacer al club de la provincia","Crecer la base.","barrio"]]]
 ],
 IRV:[
  ["La Lepra mendocina en la elite","Mendoza esperó años tener a su club en la elite. La presión de la ciudad es grande.",
   [["Invertir para consolidarse","Mendoza lo merece.","gasto"],["Ir con cautela","No endeudarse.","caja"],["Construir el club para durar","Pensar a largo plazo.","cantera"]]],
  ["El Gargantini necesita obras","El estadio pide trabajos y el socio ya puso bastante. La provincia ofrece apoyo.",
   [["Aceptar el apoyo provincial","Con condiciones.","politica"],["Juntar fondos con los socios","Que sea de todos.","socios"],["Esperar","No es el momento.","caja"]]]
 ],
 SAR:[
  ["Junín sostiene un club de Primera","Una ciudad chica con un club en la elite. Cada peso cuenta y el presupuesto es de los más bajos.",
   [["Pedir apoyo a empresas de Junín","Que la ciudad se involucre.","sponsor"],["Vivir de la cantera","Formar y vender.","cantera"],["Recortar para sobrevivir","Sin deudas.","caja"]]],
  ["El Verde y su gente","La gente de Junín va a la cancha como a una fiesta del pueblo. El club es parte de la vida de la ciudad.",
   [["Mantener precios populares","La cancha es para todos.","socios"],["Subir precios para el presupuesto","Realismo.","caja"],["Hacer del partido un evento familiar","Crecer la hinchada.","barrio"]]]
 ],
 ALD:[
  ["El Tiburón y el verano","Mar del Plata vive del verano. El club necesita ingresos todo el año y no solo en la temporada turística.",
   [["Explotar el estadio en verano","Aprovechar la temporada.","sponsor"],["Buscar socios todo el año","Construir base.","socios"],["Vivir de la venta de jugadores","Formar y vender.","cantera"]]],
  ["El Minella le queda grande","El estadio municipal es enorme para el club. Pagar el uso cuesta y la cancha queda vacía.",
   [["Mudarse a una cancha más chica","A la medida del club.","caja"],["Llenarlo con precios bajos","Hacer crecer la hinchada.","barrio"],["Negociar mejor con el municipio","Pagar menos.","politica"]]]
 ],
 GME:[
  ["La cancha es chica","La demanda de entradas supera la capacidad cada fin de semana. Ampliar o seguir igual.",
   [["Ampliar","Crecer.","obra"],["Priorizar al socio","Los de siempre adentro.","socios"],["Jugar partidos grandes en otro estadio","Más plata.","caja"]]],
  ["Mendoza tiene dos clubes","La Lepra y el Lobo comparten ciudad y sponsors. La competencia es por todo.",
   [["Buscar sponsors propios","Diferenciarse.","sponsor"],["Competir por socios","Ganar la ciudad.","socios"],["Acordar con el rival no pisarse","Convivir.","prensa"]]]
 ],
 RIE:[
  ["Tres mil en Primera","El estadio es chico y condiciona todo: taquilla, sponsors y exigencias de la liga.",
   [["Ampliar la cancha","Crecer.","obra"],["Jugar de local en otra cancha","Más capacidad.","caja"],["Sacarle provecho a lo chico: cancha caliente","Identidad.","barrio"]]],
  ["El Malevo creció desde abajo","El club subió muchas categorías. Sostenerse arriba requiere otra estructura.",
   [["Profesionalizar el club","Estructura de Primera.","caja"],["Mantener la identidad de barrio","No olvidar de dónde se viene.","barrio"],["Invertir en plantel","Resultados primero.","gasto"]]]
 ],
 ERC:[
  ["Río Cuarto no es la capital","Todo se consigue con menos. El club llegó lejos con estructura chica.",
   [["Buscar apoyo de empresas del sur cordobés","Que la región acompañe.","sponsor"],["Vivir de lo propio","Sin deudas.","caja"],["Formar jugadores de la región","Identidad.","cantera"]]],
  ["El León y la ciudad","El club es orgullo de Río Cuarto. La gente pide que se note fuera de la cancha.",
   [["Programas en escuelas de la ciudad","Presencia.","barrio"],["Mejorar el estadio","Una casa digna.","obra"],["Priorizar el plantel","Ganar es presencia.","gasto"]]]
 ],
 BAR:[
  ["4.400 en Primera","Una cancha chica obliga a inventar ingresos. Los sponsors quieren más visibilidad.",
   [["Jugar partidos grandes en otro estadio","Más taquilla.","caja"],["Ampliar la cancha","Crecer donde está.","obra"],["Buscar sponsors de barrio","Plata cercana.","sponsor"]]],
  ["Barracas y su gente","El club es parte del barrio de toda la vida. Los vecinos piden que el club siga siendo de ellos.",
   [["Abrir el club al barrio","Ser del barrio.","barrio"],["Profesionalizar sin olvidar","Crecer con identidad.","socios"],["Priorizar el fútbol profesional","Estar arriba.","gasto"]]]
 ],
 /* ---------- Segunda División de Chile (tenían 4: necesitan 2) ---------- */
 LIN:[
  ["El Fiscal de Linares y la lluvia","El estadio Tucapel Bustamante sufre cada invierno. El agua se come la cancha y los partidos se juegan en barro.",
   [["Invertir en drenaje","Una cancha que se pueda jugar.","obra"],["Pedir apoyo al municipio","El estadio es fiscal.","politica"],["Jugar como se pueda","No hay plata.","caja"]]],
  ["La Maule sur y los Albirrojos","Linares es ciudad agrícola. Los temporeros y sus familias son buena parte de la hinchada.",
   [["Horarios que respeten las faenas","Que la gente pueda ir.","barrio"],["Entradas baratas en temporada","Cuidar al hincha de siempre.","socios"],["Buscar sponsors agrícolas","La plata está en el campo.","sponsor"]]]
 ],
 CLC:[
  ["San Fernando y el vino","Colchagua es valle de viñas. Las viñas grandes podrían sostener al club, pero piden visibilidad y condiciones.",
   [["Acuerdo con una viña grande","Plata del valle.","sponsor"],["Muchos sponsors chicos locales","Que no mande uno solo.","barrio"],["Sin sponsors fuertes","El club no se vende.","firme"]]],
  ["El Jorge Silva Valenzuela","El estadio es de los más grandes de la categoría para 7.200 personas. Llenarlo es otra cosa.",
   [["Precios bajos para llenar","Hacer hinchada.","socios"],["Llevar colegios gratis","Semillero de hinchas.","barrio"],["Arrendarlo para otros eventos","Que se pague solo.","caja"]]]
 ],
 TRA:[
  ["Los Andes y la cordillera","Trasandino carga el nombre del ferrocarril que cruzaba a Argentina. La ciudad lo siente como parte de su historia.",
   [["Recuperar la historia del club en la ciudad","Memoria.","barrio"],["Pensar en el futuro, no en el tren","Mirar adelante.","caja"],["Pedir apoyo a la minería de la zona","Plata grande con condiciones.","sponsor"]]],
  ["El Regional de Los Andes","El estadio es compartido y el club lo usa con horarios ajustados. Los entrenamientos se hacen donde se puede.",
   [["Buscar un predio propio para entrenar","Independencia.","obra"],["Negociar mejor con el municipio","Pragmático.","politica"],["Arreglarse con lo que hay","Sin gastos.","caja"]]]
 ],
 COL:[
  ["Colina crece rápido","La comuna se llenó de condominios nuevos. Hay familias con plata que no conocen al club.",
   [["Campaña para vecinos nuevos","Sumar socios.","barrio"],["Sponsors de inmobiliarias","Plata de los que construyen.","sponsor"],["Cuidar al hincha de siempre","El club es de los de antes.","socios"]]],
  ["El Manuel Rojas","El estadio municipal es chico y compartido con otras actividades de la comuna.",
   [["Pedir prioridad al municipio","El club representa a Colina.","politica"],["Invertir en la cancha","Mejorarla.","obra"],["Seguir igual","No hay plata.","caja"]]]
 ],
 OVA:[
  ["El Diaguita y el Limarí","Ovalle es la capital del valle del Limarí. El club puede ser el equipo de toda la provincia.",
   [["Programas en comunas del valle","Ser de todo el Limarí.","barrio"],["Sponsors de la agroindustria","La plata del valle.","sponsor"],["Concentrarse en Ovalle","Primero la ciudad.","socios"]]],
  ["La sequía y la cancha","Años de sequía hacen caro mantener el pasto. Algunos piden cancha sintética.",
   [["Cambiar a pasto sintético","Menos agua, menos mantención.","obra"],["Mantener el natural con riego eficiente","Tradición y cuidado.","caja"],["Pedir apoyo regional","Con el problema del agua, ayuda.","politica"]]]
 ],
 CNA:[
  ["Concón y el turismo","La comuna vive del turismo y las dunas. El club es chico al lado de Wanderers y Everton.",
   [["Ser el club de Concón","Identidad local.","barrio"],["Sponsors del turismo","Aprovechar el verano.","sponsor"],["Formar jugadores para los grandes de la región","Vivir de la cantera.","cantera"]]],
  ["Crecer al lado de gigantes","Muchos hinchas de la zona son de Wanderers o Everton. Hacer hinchada propia es difícil.",
   [["Entradas gratis para niños","Semillero de hinchas.","socios"],["No competir: complementar","Segundo equipo de todos.","prensa"],["Invertir para ganar y llamar la atención","Resultados.","gasto"]]]
 ],
 BSA:[
  ["Salamanca y la minería","La zona del Choapa vive de la minería. Las mineras podrían financiar al club, pero no todos en el pueblo las quieren.",
   [["Aceptar el sponsor minero","Plata grande.","sponsor"],["Rechazarlo por el conflicto del agua","El pueblo primero.","firme"],["Llevarlo a consulta con la comunidad","Que decidan todos.","socios"]]],
  ["Las Brujas y su nombre","El apodo viene de las leyendas de Salamanca. El club puede usar esa identidad para crecer.",
   [["Hacer de la leyenda una marca","Identidad que vende.","sponsor"],["Cuidar la tradición sin comercializarla","Respeto.","barrio"],["No es tema del fútbol","Cancha.","caja"]]]
 ],
 RSJ:[
  ["San Joaquín es comuna de trabajo","La comuna es obrera, cercana a industrias. El club es el equipo del barrio.",
   [["Programas con juntas de vecinos","Ser del barrio.","barrio"],["Buscar sponsors industriales","La plata cerca.","sponsor"],["Entradas para trabajadores","Cuidar al de siempre.","socios"]]],
  ["Crecer en Santiago","Competir por hinchas con Colo-Colo, la U y la Católica es imposible. El club tiene que encontrar su lugar.",
   [["Ser el segundo equipo del barrio","Complementar.","prensa"],["Formar jugadores para los grandes","Vivir de la cantera.","cantera"],["Apostar a ascender","Resultados.","gasto"]]]
 ],
 SCI:[
  ["Un club nuevo en Lo Barnechea","Santiago City juega en una comuna con plata, pero sin tradición futbolera propia.",
   [["Construir identidad en la comuna","Ser de Lo Barnechea.","barrio"],["Aprovechar sponsors de la zona","La plata está.","sponsor"],["Apostar por resultados rápidos","Llamar la atención.","gasto"]]],
  ["La comuna es de dos mundos","Lo Barnechea tiene barrios muy ricos y otros humildes. El club puede ser puente o reflejar la división.",
   [["Escuelas de fútbol gratis en los barrios humildes","Ser de todos.","cantera"],["Entradas diferenciadas por comuna","Equidad.","socios"],["Seguir sin tomar partido","Solo fútbol.","caja"]]]
 ],
 GVE:[
  ["San Vicente de Tagua Tagua","Una comuna rural que tiene club en el fútbol profesional. Los recursos son pocos y la gente es mucha.",
   [["Trabajar con los colegios de la comuna","Crecer desde abajo.","cantera"],["Sponsors agrícolas","La plata del campo.","sponsor"],["Ahorrar para sobrevivir","Sin deudas.","caja"]]],
  ["El estadio Augusto Rodríguez","La cancha municipal es compartida con el fútbol amateur de la comuna, que es muy fuerte.",
   [["Compartir con orgullo","El club es de todos.","barrio"],["Pedir prioridad","El profesional primero.","politica"],["Invertir en otra cancha","Independencia.","obra"]]]
 ],
 REN:[
  ["Rengo y el valle del Cachapoal","El club es parte de una ciudad agrícola que crece. Las familias nuevas no siempre conocen al club.",
   [["Campaña para vecinos nuevos","Sumar socios.","barrio"],["Sponsors agrícolas","La plata del valle.","sponsor"],["Cuidar al de siempre","Identidad.","socios"]]],
  ["La cancha Guillermo Guzmán","El estadio municipal necesita mantención y el municipio tiene otras prioridades.",
   [["Hacer la mantención con plata propia","No esperar a nadie.","obra"],["Presionar al municipio","Es su estadio.","politica"],["Esperar","No hay plata.","caja"]]]
 ]
};
function _almaDec9077(id,i,x){
  const nom=(typeof nomClubCualquiera==="function")?nomClubCualquiera(id):id;
  const [t,d,ops]=x;
  return {id:"alma77_"+id.toLowerCase()+"_"+(i+1), club:id, anio:2026, buzon:"institucional", peso:"medio", mes:[3,5,7][i%3],
    t:t, d:d, posturas:{socios:20,hinchada:15,directorio:-10,prensa:5},
    op:ops.map(o=>{
      const P=ALMA_PERFIL[o[2]]||ALMA_PERFIL.caja;
      const r={t:o[0], d:o[1], dif:P.dif};
      if(P.grupos) r.grupos=Object.assign({},P.grupos);
      if(P.rep) r.rep=Object.assign({},P.rep);
      const mitadEf={}; Object.keys(P.ef||{}).forEach(k=>mitadEf[k]=Math.round(P.ef[k]*0.5));
      r.bien={txt:P.bien.replace(/el club/,nom), ef:Object.assign({},P.ef||{})};
      r.mitad={txt:"Quedó a medias en "+nom+": algo se ganó, algo se perdió.", ef:mitadEf};
      r.mal={txt:P.mal, ef:{}, grupos:Object.keys(P.grupos||{}).reduce((g,k)=>{ if(P.grupos[k]>0) g[k]=-Math.round(P.grupos[k]*0.6); return g; },{})};
      return r;
    })};
}
/* registro: no pisa lo que ya existe */
(function mergeAlma9077(){
  try{
    if(typeof DECISIONES==="undefined"||!Array.isArray(DECISIONES)) return;
    Object.keys(ALMA_9077).forEach(id=>{
      ALMA_9077[id].forEach((x,i)=>{ const d=_almaDec9077(id,i,x); if(!DECISIONES.some(y=>y.id===d.id)) DECISIONES.push(d); });
    });
  }catch(e){ console.error("alma 9077:",e); }
})();
