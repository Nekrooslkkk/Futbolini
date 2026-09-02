"use strict";
/* ============================================================
   FUTBOLINI · data-historia.js  (7.00 · épocas de gloria)
   Planteles históricos reales aportados por Grok (ago 2026) + las
   entradas EPOCAS_CLUB_ADD. Se carga DESPUÉS de data-plantel.js y
   ANTES de data-clubes2026.js (que hace el merge de EPOCAS_CLUB).
   Registra cada plantel en PLANTELES_REALES[club][anio] por mutación.
   Nombres reales de referencia; stats estimadas del juego.
   ============================================================ */

const PLANTEL_UC_2019=[
["Matías Dituro","ARQ",32,84,84,90,180,["extranjero"]],
["Miguel Vargas","ARQ",22,58,70,18,40,["proyección"]],
["Benjamín Kuscevic","DEF",23,78,84,55,160,["proyección"]],
["Valber Huerta","DEF",26,76,78,50,120,[]],
["Germán Lanaro","DEF",30,74,74,55,90,["extranjero","juego aéreo"]],
["Stefano Magnasco","DEF",27,70,70,40,70,[]],
["Juan Cornejo","DEF",29,70,72,42,75,[]],
["Raimundo Rebolledo","DEF",22,64,74,25,70,["proyección"]],
["Luciano Aued","VOL",32,82,82,85,160,["extranjero","contención"]],
["César Pinares","VOL",28,80,82,70,140,["enganche"]],
["José Pedro Fuenzalida","VOL",34,84,84,90,150,["ídolo","llegador"]],
["César Fuentes","VOL",26,72,74,40,80,["contención"]],
["Diego Buonanotte","VOL",31,74,74,55,90,["extranjero","desequilibrio"]],
["Ignacio Saavedra","VOL",20,62,76,18,60,["proyección","canterano"]],
["Edson Puch","DEL",33,80,80,75,130,["desequilibrio","velocidad"]],
["Sebastián Sáez","DEL",34,74,74,55,80,["extranjero"]],
["Diego Valencia","DEL",19,66,80,20,90,["proyección"]],
["José Luis Muñoz","DEL",30,68,68,35,55,[]],
["César Munder","DEL",19,60,74,15,50,["proyección"]],
["Andrés Vilches","DEL",27,68,70,35,60,[]],
["Branco Ampuero","DEF",26,68,70,32,60,[]],
["Diego Gutiérrez","VOL",22,58,70,15,40,[]],
["Carlos Lobos","VOL",22,58,68,15,40,[]]
];

const PLANTEL_OHI_2013=[
["Paulo Garcés","ARQ",29,78,78,55,90,[]],
["Roberto González","ARQ",37,62,62,25,25,[]],
["Julio Barroso","DEF",28,82,82,70,140,["extranjero"]],
["Mariano Uglessich","DEF",31,74,74,50,80,["extranjero"]],
["Yerson Opazo","DEF",29,74,74,45,75,[]],
["Alejandro López","DEF",24,70,74,35,70,["extranjero"]],
["Benjamín Vidal","DEF",22,64,72,22,55,["proyección"]],
["Claudio Meneses","DEF",25,66,68,28,50,[]],
["Braulio Leal","VOL",32,76,76,55,90,["contención"]],
["César Fuentes","VOL",20,70,80,25,90,["proyección","canterano"]],
["Pedro Pablo Hernández","VOL",27,84,84,80,180,["extranjero","desequilibrio"]],
["Gonzalo Barriga","VOL",29,74,74,45,80,[]],
["Luis Pedro Figueroa","VOL",30,74,74,50,85,[]],
["Osman Huerta","VOL",24,66,70,25,50,[]],
["Pablo Calandria","DEL",31,84,84,85,160,["extranjero","ídolo"]],
["Francisco Pizarro","DEL",24,70,74,35,70,[]],
["Carlos Escobar","DEL",24,66,70,28,55,[]],
["Albert Acevedo","DEF",30,68,68,35,55,[]],
["Nicolás Vargas","VOL",20,60,72,15,45,["proyección"]],
["Fernando Gutiérrez","VOL",24,62,68,20,40,["extranjero"]],
["Diego Cháves","DEL",27,66,68,30,55,["extranjero"]],
["Bastián San Juan","DEF",19,55,70,10,35,["canterano"]]
];

const PLANTEL_HUA_2012=[
["Nery Veloso","ARQ",25,74,78,40,80,[]],
["Cristian Muñoz","ARQ",35,70,70,40,45,["extranjero"]],
["Omar Merlo","DEF",25,76,80,45,100,["extranjero"]],
["José Contreras","DEF",30,74,74,40,70,[]],
["Claudio Muñoz","DEF",28,72,72,38,65,[]],
["Miguel Aceval","DEF",29,70,70,35,60,[]],
["Nicolás Crovetto","DEF",26,70,72,32,60,[]],
["Lorenzo Reyes","VOL",21,74,82,30,110,["proyección","contención"]],
["Gabriel Sandoval","VOL",28,72,72,38,70,[]],
["Nicolás Núñez","VOL",28,70,70,35,60,[]],
["Daniel González","VOL",28,70,72,35,65,[]],
["César Cortés","VOL",28,76,78,50,95,["desequilibrio"]],
["Manuel Villalobos","DEL",32,78,78,60,100,["ídolo"]],
["Braian Rodríguez","DEL",26,78,80,55,110,["extranjero"]],
["Andrés Vilches","DEL",20,62,74,18,55,["proyección"]],
["Mauricio Yedro","VOL",25,64,68,22,45,["extranjero"]],
["Octavio Pozo","VOL",29,62,62,22,35,[]],
["Juan Carlos Espinoza","DEF",21,58,68,15,40,[]],
["Leonardo Povea","VOL",18,55,72,10,40,["proyección"]],
["Martín Rodríguez","VOL",18,55,74,10,45,["proyección"]],
["Elvis Acuña","DEF",21,56,66,12,30,[]],
["Milton Benítez","DEL",26,60,64,18,35,["extranjero"]]
];

const PLANTEL_COB_2015=[
["Nicolás Peric","ARQ",36,78,78,55,70,["ídolo"]],
["Sebastián Cuerdo","ARQ",28,58,60,15,25,[]],
["Federico Martorell","DEF",34,70,70,35,45,["extranjero"]],
["Miguel Escalona","DEF",25,66,70,25,50,[]],
["Alexis Salazar","DEF",32,66,66,28,40,[]],
["Carlos Herrera","DEF",31,64,64,25,35,[]],
["Patricio Jerez","VOL",28,70,72,35,60,[]],
["Johan Fuentes","VOL",30,74,74,45,75,["contención"]],
["Rodrigo Ureña","VOL",22,68,76,25,70,["proyección"]],
["Israel Poblete","VOL",20,64,76,18,60,["proyección"]],
["Víctor Sarabia","VOL",31,66,66,28,40,[]],
["Nelson Sepúlveda","VOL",23,62,70,18,45,[]],
["Francisco Sánchez","VOL",30,66,66,28,45,[]],
["Matías Donoso","DEL",28,80,82,60,110,[]],
["Ever Cantero","DEL",29,74,74,45,75,["extranjero"]],
["Carlos Escobar","DEL",25,66,70,28,50,[]],
["Sebastián Zúñiga","DEL",25,64,68,22,45,[]],
["Cristián Ledesma","DEL",28,64,66,25,45,["extranjero"]],
["Juan Pablo Miño","VOL",27,64,66,25,45,["extranjero"]],
["Flavio Rojas","VOL",21,56,68,12,30,["canterano"]],
["Diego Cerón","DEF",24,58,64,15,35,[]],
["Augusto Álvarez","VOL",30,60,62,20,35,["extranjero"]]
];

const PLANTEL_UDC_2018=[
["Cristián Muñoz","ARQ",41,76,76,50,50,["extranjero","ídolo"]],
["Álvaro Salazar","ARQ",25,60,68,18,40,[]],
["Ronald de la Fuente","DEF",28,74,76,40,80,[]],
["Gustavo Mencia","DEF",30,72,72,40,70,["extranjero"]],
["Sergio Vittor","DEF",29,72,74,40,75,["extranjero"]],
["Guillermo Pacheco","DEF",29,70,72,35,65,[]],
["Esteban Flores","DEF",26,64,66,22,45,[]],
["Fernando Manríquez","VOL",34,78,78,55,90,["ídolo","tiro libre"]],
["Alejandro Camargo","VOL",29,74,76,45,85,["extranjero","contención"]],
["Hugo Droguett","VOL",36,74,74,50,70,["desequilibrio"]],
["Jean Meneses","VOL",25,78,84,45,130,["desequilibrio","proyección"]],
["Jonathan Benítez","VOL",27,70,72,35,70,["extranjero"]],
["Héctor Berríos","VOL",31,66,66,28,45,[]],
["Jean Paul Pineda","DEL",29,72,72,40,70,[]],
["Walter Ponce","DEL",20,66,76,20,70,["proyección"]],
["José Huentelaf","DEL",30,68,68,30,55,[]],
["Luis Pedro Figueroa","VOL",35,68,68,35,45,[]],
["Francisco Portillo","VOL",31,64,64,25,40,["extranjero"]],
["Claudio Navarrete","DEF",19,55,70,10,35,["canterano"]],
["Juan Abarzúa","VOL",26,60,64,18,35,[]],
["Diego Soto","VOL",16,52,72,8,40,["proyección"]],
["Pedro Morales","VOL",33,70,70,40,55,[]]
];

const PLANTEL_CAL_2018=[
["Gabriel Arias","ARQ",31,76,78,50,90,[]],
["Lucas Giovini","ARQ",37,62,62,25,25,["extranjero"]],
["Pablo Alvarado","DEF",32,74,74,45,80,["extranjero"]],
["Yonathan Andía","DEF",26,70,74,32,70,[]],
["Ángel Rodríguez","DEF",26,70,72,35,70,["extranjero"]],
["Felipe Salinas","DEF",36,64,64,25,30,[]],
["Marko Biskupovic","DEF",29,66,66,28,45,[]],
["Fernando Meneses","VOL",30,72,72,40,70,[]],
["Álvaro Césped","VOL",26,68,70,30,55,[]],
["Fernando Saavedra","VOL",32,68,68,32,50,[]],
["Brian Fernández","DEL",23,82,86,55,150,["extranjero","desequilibrio"]],
["Mariano Barbieri","DEL",28,74,76,45,85,["extranjero"]],
["Gonzalo Abán","DEL",31,70,70,35,60,["extranjero"]],
["Gonzalo Barriga","VOL",34,68,68,35,50,[]],
["Francisco Castro","DEL",27,66,68,28,50,[]],
["Daniel Castro","DEL",20,60,72,15,45,["proyección"]],
["Carlos Núñez","DEL",26,64,66,25,45,[]],
["Esteban Flores","DEF",26,62,66,20,40,[]],
["Matías Sánchez","VOL",30,62,62,22,35,["extranjero"]],
["Cristián Gutiérrez","DEF",21,58,70,15,40,["proyección"]],
["Sebastián Romero","VOL",22,56,66,12,30,[]],
["Nicolás Orellana","VOL",23,58,66,15,35,[]]
];

const PLANTEL_NUB_2022=[
["Nicola Pérez","ARQ",32,76,76,50,80,["extranjero"]],
["Hernán Muñoz","ARQ",33,58,58,18,25,[]],
["Bernardo Cerezo","DEF",27,72,74,40,75,[]],
["Rafael Caroca","DEF",33,70,70,38,55,[]],
["Jovany Campusano","DEF",29,70,70,35,60,[]],
["Fernando Cordero","DEF",35,72,72,40,60,[]],
["Pablo Vargas","DEF",25,68,72,28,60,[]],
["Lorenzo Reyes","VOL",31,74,74,50,80,["contención"]],
["Federico Mateos","VOL",29,74,76,45,90,["extranjero"]],
["Matías Moya","VOL",24,70,76,35,80,["extranjero"]],
["Iván Rozas","VOL",24,66,72,25,55,[]],
["Alexander Aravena","DEL",20,76,86,30,140,["proyección","desequilibrio"]],
["Patricio Rubio","DEL",33,76,76,55,90,[]],
["Nicolás Guerra","DEL",23,74,80,40,110,[]],
["Mathías Pinto","DEL",24,64,70,22,50,[]],
["Manuel Rivera","VOL",26,66,68,28,50,[]],
["Branco Provoste","VOL",22,62,72,18,50,["proyección"]],
["Maximiliano Torrealba","VOL",20,56,70,12,35,["canterano"]],
["Lucas Abascia","DEF",26,66,70,28,55,["extranjero"]],
["Raimundo Rebolledo","DEF",25,66,70,28,55,[]],
["Andrés Vilches","DEL",30,68,68,35,55,[]],
["Alex Valdés","VOL",22,58,68,15,40,[]]
];

const PLANTEL_COQ_2025=[
["Diego Sánchez","ARQ",38,76,76,50,55,["ídolo"]],
["Gonzalo Flores","ARQ",25,64,72,22,55,[]],
["Benjamín Gazzolo","DEF",28,72,74,45,90,[]],
["Manuel Fernández","DEF",36,68,68,35,40,[]],
["Elvis Hernández","DEF",25,68,72,32,70,[]],
["Francisco Salinas","DEF",25,66,70,28,60,[]],
["Juan Cornejo","DEF",34,66,66,32,40,[]],
["Sebastián Galani","VOL",27,68,70,35,65,["contención"]],
["Salvador Cordero","VOL",26,66,68,30,55,[]],
["Cristián Zavala","VOL",26,70,74,40,85,["velocidad"]],
["Guido Vadalá","VOL",28,72,74,45,90,["extranjero","enganche"]],
["Luis Riveros","VOL",27,68,70,35,70,[]],
["Nicolás Johansen","DEL",26,76,80,55,120,["extranjero"]],
["Lucas Pratto","DEL",37,70,70,50,50,["extranjero"]],
["Cecilio Waterman","DEL",34,74,74,55,80,["extranjero"]],
["Benjamín Chandía","VOL",22,68,78,25,80,["proyección"]],
["Facundo Pons","DEL",29,66,68,32,55,["extranjero"]],
["Dylan Glaby","VOL",27,66,68,30,55,["extranjero"]],
["Sebastián Cabrera","DEF",27,64,66,28,50,[]],
["Rodrigo Holgado","DEL",30,66,66,35,50,["extranjero"]],
["Cristóbal Dorador","ARQ",19,52,70,10,30,["proyección"]],
["Dixon Pereira","DEL",18,54,72,10,35,["proyección"]]
];

const PLANTEL_EVE_2012=[
["Ignacio González","ARQ",22,62,74,18,50,["proyección"]],
["Franco Quiroga","ARQ",28,60,62,20,30,[]],
["Marcos González","DEF",32,72,72,45,70,[]],
["Cristián Suárez","DEF",25,68,72,30,60,[]],
["Nelson Saavedra","DEF",24,64,68,22,45,[]],
["Juan Pablo Segovia","DEF",23,64,70,22,50,["extranjero"]],
["Fernando Saavedra","VOL",25,70,74,35,70,[]],
["Ángel Rojas","VOL",27,70,72,35,65,[]],
["José Luis Muñoz","DEL",25,72,76,40,80,[]],
["Jonathan Suazo","VOL",22,66,74,25,60,["proyección"]],
["Maximiliano Cerato","DEL",24,70,74,35,70,["extranjero"]],
["Sebastián Pinto","DEL",26,68,70,35,60,[]],
["Juan Pablo Miño","VOL",24,64,68,25,50,["extranjero"]],
["Cristián Canío","DEL",31,66,66,30,45,[]],
["Diego Oyarzún","DEF",19,58,70,12,40,["proyección"]],
["Nicolás Crovetto","DEF",26,66,68,28,50,[]],
["Gabriel Vargas","DEL",28,66,68,30,50,[]],
["Felipe Seymour","VOL",25,68,70,32,60,[]],
["Lucas Domínguez","DEF",23,64,70,22,50,[]],
["Juan Cuevas","VOL",24,64,68,25,50,["extranjero"]],
["Pedro Pablo Hernández","VOL",26,72,76,40,90,["extranjero"]],
["Bryan Rabello","VOL",20,66,78,22,80,["proyección"]]
];

const PLANTEL_AUD_2018=[
["Nicolás Peric","ARQ",39,70,70,40,40,[]],
["Joaquín Muñoz","ARQ",27,58,62,15,30,[]],
["Osvaldo González","DEF",34,72,72,40,55,[]],
["Nicolás Crovetto","DEF",32,66,66,28,45,[]],
["Juan Pablo Gómez","DEF",27,66,70,28,55,[]],
["Osvaldo Bosso","DEF",25,66,70,28,55,[]],
["Iván Ledezma","VOL",22,66,74,22,60,["proyección"]],
["Luis Cabrera","VOL",24,66,70,25,55,[]],
["Sebastián Díaz","VOL",22,64,72,20,55,["proyección"]],
["David Drocco","VOL",29,66,68,30,50,["extranjero"]],
["Bryan Carrasco","DEL",27,72,74,40,80,[]],
["Sebastián Sáez","DEL",33,72,72,45,70,["extranjero"]],
["Renato Tarifeño","DEL",21,62,72,18,50,["proyección"]],
["Fabián Torres","DEF",25,62,66,20,40,[]],
["Marco Medel","VOL",28,66,66,28,45,[]],
["Carlos Labrín","DEF",27,64,66,25,45,[]],
["Ariel Martínez","VOL",25,62,66,20,40,[]],
["Diego Vallejos","DEL",28,64,66,25,45,[]],
["Matías Campos Toro","DEF",29,62,62,22,35,[]],
["Nicolás Orellana","DEL",23,60,68,18,40,[]],
["Ricardo Noir","DEL",31,64,64,28,40,["extranjero"]],
["Oliver Rojas","DEF",18,52,68,8,30,["canterano"]]
];

const PLANTEL_LSE_2019=[
["Eryin Sáez","ARQ",28,62,64,20,35,[]],
["Zacarías López","ARQ",21,60,72,15,50,["proyección"]],
["Jaime Soto","DEF",27,62,64,20,40,[]],
["Sergio Felipe","DEF",28,64,66,25,45,["extranjero"]],
["Enzo Guerrero","DEF",28,64,66,25,45,[]],
["Vicente Durán","DEF",22,58,68,15,40,[]],
["Juan Fuentes","DEF",24,62,68,22,50,[]],
["Leonardo Valencia","VOL",28,70,72,40,75,[]],
["Fernando Cornejo","VOL",23,64,72,22,55,[]],
["Jaime Valdés","VOL",38,70,70,40,45,["ídolo"]],
["Angelo Araos","VOL",22,66,76,25,70,["proyección"]],
["Sebastián Leyton","VOL",26,64,66,25,45,[]],
["Tobías Figueroa","DEL",27,68,70,35,60,["extranjero"]],
["Gastón Lezcano","DEL",28,70,72,38,70,[]],
["Enzo Gutiérrez","DEL",33,66,66,30,45,["extranjero"]],
["Claudio Jopia","DEF",28,60,62,18,35,[]],
["Bayron Oyarzo","DEL",24,62,70,20,50,[]],
["Lucas Godoy","VOL",20,56,70,12,35,["proyección"]],
["Martín Ramírez","DEL",21,56,68,12,35,[]],
["Diego Oyola","VOL",25,58,62,15,35,[]],
["Cristian Gutiérrez","DEF",22,56,66,12,35,[]],
["Nicolás Ferreyra","DEF",26,62,64,22,40,["extranjero"]]
];

const PLANTEL_DCO_2010=[
["Nicolás Peric","ARQ",31,74,74,45,70,[]],
["José Luis Cabión","ARQ",27,58,60,15,25,[]],
["Albert Acevedo","DEF",27,70,72,35,65,[]],
["Miguel Aceval","DEF",27,68,70,32,60,[]],
["Sebastián Miranda","DEF",30,66,66,28,45,[]],
["Cristián Muñoz","DEF",26,64,66,25,45,[]],
["Fernando Meneses","VOL",25,70,74,35,70,[]],
["Alejandro Carrasco","VOL",32,66,66,28,40,[]],
["Leonardo Monje","DEL",29,70,72,40,65,[]],
["Gabriel Vargas","DEL",26,72,76,40,80,[]],
["Renato Ramos","DEL",31,68,68,35,55,[]],
["Diego Ruiz","DEL",30,66,66,30,50,[]],
["José Luis Silva","VOL",24,62,68,20,45,[]],
["Miguel Ángel González","VOL",26,64,66,25,45,[]],
["Juan José Ribera","VOL",30,62,62,22,35,[]],
["Patricio Gutiérrez","DEF",28,62,64,22,40,[]],
["Boris González","DEF",29,62,62,22,35,[]],
["Francisco Ibáñez","VOL",22,58,68,15,40,[]],
["Esteban González","DEL",25,62,66,22,45,[]],
["Matías Soto","VOL",21,56,66,12,30,[]],
["Diego Oyarzún","DEF",17,52,70,8,35,["proyección"]],
["Cristián Canío","DEL",29,66,66,30,45,[]]
];

const EPOCAS_CLUB_ADD={
UC:[{anio:2019,etq:"2019 · Bicampeones",squad:"PLANTEL_UC_2019",
desc:"Campeón del Nacional 2019 con Quinteros. Dominio de punta a punta y base del tetra 2018-2021.",
dt:"Gustavo Quinteros",
ind:{plantel:86,moral:78,hinchada:62,socios:60,cantera:76,estadio:80,prestigio:84,riesgo:14},
caja:{plata:700,deuda:420}}],
OHI:[{anio:2013,etq:"2013 · Primera estrella",squad:"PLANTEL_OHI_2013",
desc:"Campeón del Apertura 2013 con Berizzo. Calandria, el Tucu Hernández y la final en el Nacional.",
dt:"Eduardo Berizzo",
ind:{plantel:82,moral:80,hinchada:75,socios:58,cantera:60,estadio:55,prestigio:78,riesgo:18},
caja:{plata:380,deuda:160}}],
HUA:[{anio:2012,etq:"2012 · Clausura de acero",squad:"PLANTEL_HUA_2012",
desc:"Campeón del Clausura 2012 con Pellicer. Final a penales ante Unión Española en el CAP.",
dt:"Jorge Pellicer",
ind:{plantel:80,moral:78,hinchada:70,socios:52,cantera:72,estadio:60,prestigio:76,riesgo:20},
caja:{plata:320,deuda:140}}],
COB:[{anio:2015,etq:"2015 · Milagro en el desierto",squad:"PLANTEL_COB_2015",
desc:"Campeón del Clausura 2015 con Giovagnoli. Primer título de la historia, entre aluviones y El Cobre.",
dt:"Dalcio Giovagnoli",
ind:{plantel:76,moral:82,hinchada:72,socios:48,cantera:50,estadio:58,prestigio:74,riesgo:28},
caja:{plata:240,deuda:90}}],
UDC:[{anio:2018,etq:"2018 · Subcampeón",squad:"PLANTEL_UDC_2018",
desc:"Subcampeón del Nacional 2018 con Bozán. 58 puntos, a un paso de la UC, y Libertadores al año.",
dt:"Francisco Bozán",
ind:{plantel:78,moral:76,hinchada:60,socios:52,cantera:70,estadio:78,prestigio:72,riesgo:22},
caja:{plata:300,deuda:120}}],
CAL:[{anio:2018,etq:"2018 · Animador",squad:"PLANTEL_CAL_2018",
desc:"Mejor campaña moderna: pelea arriba, 6-1 a la U y clasificación a Sudamericana. Brian Fernández en llamas.",
dt:"Víctor Rivero",
ind:{plantel:74,moral:72,hinchada:58,socios:48,cantera:45,estadio:48,prestigio:66,riesgo:30},
caja:{plata:220,deuda:100}}],
NUB:[{anio:2022,etq:"2022 · Subcampeón y Libertadores",squad:"PLANTEL_NUB_2022",
desc:"Subcampeón 2022 con Jaime García. Histórica clasificación a fase de grupos de Libertadores.",
dt:"Jaime García",
ind:{plantel:78,moral:80,hinchada:78,socios:55,cantera:58,estadio:62,prestigio:74,riesgo:20},
caja:{plata:280,deuda:110}}],
COQ:[{anio:2025,etq:"2025 · Primer título",squad:"PLANTEL_COQ_2025",
desc:"Campeón de la Liga de Primera 2025. Primera estrella del club en 67 años de historia.",
dt:"Esteban González",
ind:{plantel:80,moral:84,hinchada:82,socios:60,cantera:52,estadio:70,prestigio:80,riesgo:16},
caja:{plata:450,deuda:100}}],
EVE:[{anio:2012,etq:"2012 · Vuelta a Primera",squad:"PLANTEL_EVE_2012",
desc:"Ascenso vía promoción ante U. de Concepción. El regreso a Primera después de dos años en la B.",
dt:"el cuerpo técnico",
ind:{plantel:70,moral:75,hinchada:65,socios:50,cantera:55,estadio:72,prestigio:60,riesgo:32},
caja:{plata:260,deuda:150}}],
AUD:[{anio:2018,etq:"2018 · Media tabla alta",squad:"PLANTEL_AUD_2018",
desc:"Campaña sólida de media-alta con clasificación continental al horizonte. Carrasco y Sáez al frente.",
dt:"Juan José Ribera",
ind:{plantel:70,moral:65,hinchada:52,socios:50,cantera:58,estadio:55,prestigio:58,riesgo:30},
caja:{plata:280,deuda:130}}],
LSE:[{anio:2019,etq:"2019 · De vuelta arriba",squad:"PLANTEL_LSE_2019",
desc:"Retorno consolidado a Primera con figuras experimentadas y jóvenes con proyección.",
dt:"el cuerpo técnico",
ind:{plantel:66,moral:68,hinchada:55,socios:45,cantera:50,estadio:65,prestigio:55,riesgo:35},
caja:{plata:220,deuda:120}}],
DCO:[{anio:2010,etq:"2010 · León en Primera",squad:"PLANTEL_DCO_2010",
desc:"Una de las últimas temporadas competitivas del León en Primera antes del largo bajón institucional.",
dt:"el cuerpo técnico",
ind:{plantel:68,moral:70,hinchada:75,socios:55,cantera:48,estadio:78,prestigio:60,riesgo:34},
caja:{plata:200,deuda:100}}],
PAL:[{anio:1978,etq:"1978 · La Estrella Árabe",
desc:"Campeón del Campeonato Nacional 1978, el título más recordado del club. Con Elías Figueroa de vuelta en Chile como eje defensivo y Óscar Fabbiani goleador (35 goles), Palestino hilvanó una racha histórica de 44 fechas invicto (1977-78). Dirigía Caupolicán Peña. (Plantel en juego: aproximado, época recreada.)",
dt:"Caupolicán Peña",
ind:{plantel:82,moral:85,hinchada:74,socios:52,cantera:56,estadio:52,prestigio:82,riesgo:14},
caja:{plata:240,deuda:90}}]
};

/* registrar los planteles históricos en PLANTELES_REALES[club][anio] */
(function registrarHistoria(){
  if(typeof PLANTELES_REALES!=="object") return;
  function reg(club,anio,squad){ if(!PLANTELES_REALES[club]) PLANTELES_REALES[club]={}; PLANTELES_REALES[club][anio]=squad; }
  reg("UC",2019,PLANTEL_UC_2019);
  reg("OHI",2013,PLANTEL_OHI_2013);
  reg("HUA",2012,PLANTEL_HUA_2012);
  reg("COB",2015,PLANTEL_COB_2015);
  reg("UDC",2018,PLANTEL_UDC_2018);
  reg("CAL",2018,PLANTEL_CAL_2018);
  reg("NUB",2022,PLANTEL_NUB_2022);
  reg("COQ",2025,PLANTEL_COQ_2025);
  reg("EVE",2012,PLANTEL_EVE_2012);
  reg("AUD",2018,PLANTEL_AUD_2018);
  reg("LSE",2019,PLANTEL_LSE_2019);
  reg("DCO",2010,PLANTEL_DCO_2010);
})();
