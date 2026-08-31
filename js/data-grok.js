"use strict";
/* ============================================================
   FUTBOLINI · data-grok.js
   Contenido real aportado por Grok (ago 2026): planteles 2026 de
   los clubes que faltaban, planteles 1991 y fixtures reales de
   Palestino y Deportes Limache 2026. Se carga DESPUÉS de
   data-liga.js y data-plantel.js y se enchufa por mutación a
   PLANTELES_REALES y FIXTURES_OFICIALES (const only prevents
   reassign, not mutation → sin zona muerta temporal).
   Nombres reales documentados; stats estimadas del juego.
   ============================================================ */

/* ---------------- planteles 2026 (11 clubes) ---------------- */
const PLANTEL_EVE_2026=[
 ["Ignacio González","ARQ",36,74,74,55,70,["seguro bajo los tres palos","veterano"]],
 ["Esteban Kirkman","ARQ",24,62,74,22,45,["joven"]],
 ["Isaac Esquenazi","ARQ",22,55,72,12,28,["canterano"]],
 ["Diego Oyarzún","DEF",33,73,73,58,95,["capitán","juego aéreo"]],
 ["Hugo Magallanes","DEF",28,74,76,62,160,["extranjero","juego aéreo"]],
 ["Óscar Opazo","DEF",35,70,70,48,55,["lateral ofensivo","veterano"]],
 ["Nicolás Baeza","DEF",29,70,71,45,90,["lateral ofensivo"]],
 ["Vicente Fernández","DEF",27,68,72,38,80,["lateral"]],
 ["Cristopher Barrera","DEF",28,67,68,35,70,["contención"]],
 ["Valentín Vidal","DEF",22,64,78,25,95,["joven","proyección"]],
 ["Ramiro González","DEF",35,66,66,32,40,["extranjero","veterano"]],
 ["Benjamín Berríos","VOL",28,73,74,55,140,["contención","box-to-box"]],
 ["Alan Medina","VOL",28,74,75,60,155,["extranjero","desequilibrio"]],
 ["Joaquín Moya","VOL",32,68,68,40,60,["experiencia"]],
 ["Lucas Soto","VOL",23,65,78,28,100,["joven","préstamo"]],
 ["Gustavo Charrupí","VOL",22,62,76,22,70,["extranjero","joven"]],
 ["Julián Alfaro","DEL",25,70,76,42,110,["desequilibrio"]],
 ["Josué Ovalle","DEL",26,69,73,40,95,["desequilibrio"]],
 ["Emiliano Ramos","DEL",21,64,82,25,140,["joven","proyección europea"]],
 ["Cristian Palacios","DEL",35,71,71,50,55,["goleador","extranjero"]],
 ["Braian Martínez","DEL",26,67,72,35,75,["extranjero","velocidad"]],
 ["Nicolás Montiel","DEL",21,63,79,22,90,["joven","extranjero"]]
];
const PLANTEL_COQ_2026=[
 ["Diego Sánchez","ARQ",39,73,73,50,45,["veterano","seguro bajo los tres palos"]],
 ["Gonzalo Flores","ARQ",26,66,74,28,55,["promesa"]],
 ["Cristóbal Dorador","ARQ",20,54,76,10,25,["joven"]],
 ["Benjamín Gazzolo","DEF",29,72,73,50,110,["juego aéreo"]],
 ["Francisco Salinas","DEF",26,75,80,70,220,["lateral ofensivo","proyección"]],
 ["Elvis Hernández","DEF",26,70,74,42,95,["extranjero"]],
 ["Sebastián Cabrera","DEF",28,71,72,48,115,["lateral ofensivo"]],
 ["Juan Cornejo","DEF",36,70,70,45,50,["asistidor","veterano"]],
 ["Manuel Fernández","DEF",37,68,68,35,35,["extranjero","veterano"]],
 ["Lukas Soza","DEF",28,66,68,32,60,[]],
 ["Sebastián Galani","VOL",29,73,73,55,120,["capitán","contención"]],
 ["Alejandro Camargo","VOL",37,70,70,42,45,["extranjero","experiencia"]],
 ["Guido Vadalá","VOL",29,71,73,48,100,["extranjero","creación"]],
 ["Salvador Cordero","VOL",28,67,68,35,65,["contención"]],
 ["Benjamín Chandía","VOL",22,64,78,22,85,["joven"]],
 ["Nicolás Johansen","DEL",28,74,75,58,150,["extranjero","goleador"]],
 ["Lucas Pratto","DEL",38,72,72,55,50,["extranjero","ídolo","experiencia"]],
 ["Cristián Zavala","DEL",27,70,74,45,110,["velocidad"]],
 ["Luis Riveros","DEL",28,69,71,40,85,["extranjero"]],
 ["Alejandro Azócar","DEL",26,67,72,32,75,["desequilibrio"]],
 ["Martín Mundaca","DEL",23,63,76,20,70,["joven"]]
];
const PLANTEL_AUD_2026=[
 ["Tomas Ahumada","ARQ",25,75,82,65,180,["seguro bajo los tres palos","proyección"]],
 ["Pedro Garrido","ARQ",22,60,74,15,35,["joven"]],
 ["Daniel Piña","DEF",24,70,76,40,95,["juego aéreo"]],
 ["Enzo Ferrario","DEF",26,71,74,45,110,["extranjero"]],
 ["Marcelo Ortiz","DEF",32,70,70,42,70,["extranjero"]],
 ["Felipe Salomoni","DEF",23,69,78,38,100,["extranjero","lateral ofensivo"]],
 ["Óliver Rojas","DEF",26,68,72,36,85,["lateral"]],
 ["Raimundo Rebolledo","DEF",29,67,68,32,65,["lateral ofensivo"]],
 ["Cristóbal Muñoz","DEF",26,64,68,25,50,[]],
 ["Marco Collao","VOL",28,72,73,52,120,["capitán","box-to-box"]],
 ["Federico Mateos","VOL",33,71,71,48,75,["extranjero","experiencia"]],
 ["César Pinares","VOL",35,70,70,45,55,["tiro libre","veterano"]],
 ["Nicolás Aedo","VOL",25,66,72,30,70,[]],
 ["Bryan Soto","VOL",25,64,70,25,55,["contención"]],
 ["Favian Loyola","VOL",21,62,78,20,70,["joven","extranjero"]],
 ["Franco Troyansky","DEL",29,72,73,50,110,["extranjero","goleador","penales"]],
 ["Damián Pizarro","DEL",21,70,84,40,200,["joven","proyección europea"]],
 ["Diego Coelho","DEL",31,70,70,45,80,["extranjero","juego aéreo"]],
 ["Giovani Chiaverano","DEL",21,68,80,32,130,["joven","extranjero","desequilibrio"]],
 ["Michael Vadulli","DEL",28,69,71,42,100,["velocidad"]],
 ["Ariel Uribe","DEL",27,68,72,38,95,["desequilibrio"]],
 ["Paolo Guajardo","DEL",23,66,76,28,80,["joven"]]
];
const PLANTEL_HUA_2026=[
 ["Christian Bravo","ARQ",20,68,80,28,90,["joven","proyección"]],
 ["Sebastián Mella","ARQ",21,64,78,20,70,["joven"]],
 ["Rodrigo Odriozola","ARQ",37,66,66,25,25,["extranjero","veterano"]],
 ["Rafael Caroca","DEF",37,71,71,42,45,["veterano","experiencia"]],
 ["Nicolás Vargas","DEF",32,70,70,40,65,["juego aéreo"]],
 ["Renzo Malanca","DEF",23,70,78,40,115,["extranjero","joven"]],
 ["Lucas Velásquez","DEF",20,67,80,25,95,["joven","lateral ofensivo"]],
 ["Maicol León","DEF",23,68,75,32,80,["box-to-box"]],
 ["Guillermo Guaiquil","DEF",23,66,74,28,65,["lateral"]],
 ["Cristián Toro","DEF",25,65,72,26,60,[]],
 ["Claudio Sepúlveda","VOL",34,72,72,50,70,["capitán","contención","ídolo"]],
 ["Ezequiel Cañete","VOL",27,71,74,48,100,["extranjero","creación"]],
 ["Kevin Altez","VOL",21,65,78,24,80,["joven","extranjero"]],
 ["Carlos Herrera","VOL",26,63,70,22,50,["contención"]],
 ["Nicolás Cárcamo","VOL",21,61,75,16,45,["joven"]],
 ["Lionel Altamirano","DEL",33,76,76,65,120,["extranjero","goleador"]],
 ["Mario Briceño","DEL",30,71,71,45,95,["desequilibrio"]],
 ["Cris Martínez","DEL",33,70,70,42,75,["extranjero","experiencia"]],
 ["Maximiliano Rodríguez","DEL",26,68,73,35,80,[]],
 ["Juan Figueroa","DEL",22,64,76,22,70,["joven"]],
 ["Luciano Arriagada","DEL",24,63,72,22,55,["juego aéreo"]]
];
const PLANTEL_OHI_2026=[
 ["Omar Carabalí","ARQ",29,74,76,60,150,["seguro bajo los tres palos"]],
 ["Jorge Peña","ARQ",26,66,72,28,60,[]],
 ["Diego Carreño","ARQ",24,60,72,15,35,[]],
 ["Tomas Avilés","DEF",22,76,85,80,320,["extranjero","joven","proyección europea"]],
 ["Alan Robledo","DEF",28,72,73,50,115,["extranjero"]],
 ["Miguel Brizuela","DEF",29,71,72,48,105,["extranjero"]],
 ["Luis Pavez","DEF",30,70,70,42,80,["lateral ofensivo"]],
 ["Felipe Faúndez","DEF",20,68,82,30,140,["joven","lateral ofensivo"]],
 ["Nicolás Garrido","DEF",23,67,75,30,80,[]],
 ["Leandro Díaz","DEF",27,67,70,32,70,["lateral"]],
 ["Benjamín Rojas","DEF",25,64,70,24,55,[]],
 ["Felipe Ogaz","VOL",23,70,78,40,110,["contención","joven"]],
 ["Bryan Rabello","VOL",32,72,72,50,90,["creación","tiro libre"]],
 ["Juan Leiva","VOL",32,71,71,45,85,["experiencia"]],
 ["Santiago Toloza","VOL",23,68,78,35,100,["extranjero","joven"]],
 ["Martín Maturana","VOL",22,64,76,22,70,["joven"]],
 ["Arnaldo Castillo","DEL",29,73,74,52,110,["extranjero","goleador"]],
 ["Walter Bou","DEL",32,72,72,50,90,["extranjero","goleador"]],
 ["Thiago Vecino","DEL",27,70,73,42,95,["extranjero"]],
 ["Bastián Yáñez","DEL",25,68,74,35,90,["velocidad"]],
 ["Ignacio Schor","DEL",26,67,72,32,80,["extranjero"]],
 ["Esteban Moreira","DEL",24,64,72,24,55,["juego aéreo"]]
];
const PLANTEL_NUB_2026=[
 ["Nicola Pérez","ARQ",36,74,74,55,65,["extranjero","seguro bajo los tres palos"]],
 ["Claudio Chandía","ARQ",19,55,76,10,30,["joven"]],
 ["Hernán Muñoz","ARQ",38,60,60,15,15,["veterano"]],
 ["Osvaldo Bosso","DEF",32,71,71,45,80,[]],
 ["Pablo Calderón","DEF",28,70,72,42,85,["extranjero"]],
 ["Felipe Campos","DEF",32,69,69,38,65,[]],
 ["Jovany Campusano","DEF",33,69,69,38,60,["lateral ofensivo"]],
 ["Diego Sanhueza","DEF",24,70,76,40,100,["lateral ofensivo"]],
 ["Sebastián Valencia","DEF",26,68,72,35,75,["juego aéreo"]],
 ["Carlos Salomón","DEF",26,64,70,24,50,[]],
 ["Lorenzo Reyes","VOL",35,72,72,50,70,["capitán","contención"]],
 ["Matías Plaza","VOL",25,73,78,50,130,["creación","asistidor"]],
 ["Manuel Rivera","VOL",30,71,71,45,95,["box-to-box"]],
 ["Gabriel Graciani","VOL",32,70,70,42,80,["extranjero","desequilibrio"]],
 ["Diego Céspedes","VOL",27,68,72,35,85,["contención"]],
 ["Ignacio Tapia","VOL",21,65,78,25,80,["joven","extranjero"]],
 ["Ignacio Jeraldino","DEL",30,72,72,50,100,["goleador"]],
 ["Franco Rami","DEL",23,69,77,38,95,["extranjero","joven"]],
 ["Fernando Ovelar","DEL",22,66,78,28,90,["extranjero","joven"]],
 ["Lucas Molina","DEL",20,64,80,20,85,["joven"]],
 ["Alex Valdés","DEL",24,64,72,22,55,["velocidad"]],
 ["Esteban Calderón","DEL",22,63,76,20,70,["joven"]]
];
const PLANTEL_COB_2026=[
 ["Matías Olguín","ARQ",30,70,71,38,60,[]],
 ["Alejandro Santander","ARQ",23,64,74,20,50,["joven"]],
 ["José Tiznado","DEF",31,71,71,42,75,["capitán"]],
 ["Christian Moreno","DEF",30,70,71,40,70,["extranjero"]],
 ["Franco Bechtholdt","DEF",33,69,69,36,55,["extranjero"]],
 ["Aaron Astudillo","DEF",26,68,72,34,75,["lateral"]],
 ["Antonio Castillo","DEF",27,67,70,32,70,["lateral"]],
 ["Rodrigo Sandoval","DEF",25,66,72,28,60,[]],
 ["Guillermo Pacheco","DEF",37,65,65,28,30,["veterano","lateral ofensivo"]],
 ["Víctor Campos","DEF",20,60,76,14,45,["joven"]],
 ["Agustín Nadruz","VOL",30,70,71,42,85,["extranjero","contención"]],
 ["Bryan Carvallo","VOL",29,70,71,42,80,["creación"]],
 ["César Yanis","VOL",30,69,70,38,75,["extranjero"]],
 ["Juan Fuentes","VOL",31,68,68,35,60,["contención"]],
 ["Felipe Villagrán","VOL",29,67,68,32,60,[]],
 ["Esteban Valencia","VOL",27,65,70,28,55,[]],
 ["Steffan Pino","DEL",32,73,73,50,90,["goleador","juego aéreo"]],
 ["Julián Brea","DEL",26,71,74,45,100,["extranjero","desequilibrio"]],
 ["Franco Frías","DEL",24,67,74,30,75,["extranjero"]],
 ["Renato Huerta","DEL",22,63,76,20,65,["joven"]]
];
const PLANTEL_CAL_2026=[
 ["Nicolás Avellaneda","ARQ",33,72,72,45,70,["extranjero","seguro bajo los tres palos"]],
 ["Nelson Espinoza","ARQ",30,66,68,28,50,[]],
 ["Daniel Gutiérrez","DEF",23,70,78,40,110,["joven","préstamo"]],
 ["Juan Salomoni","DEF",28,70,72,40,85,["extranjero"]],
 ["Rodrigo Cáseres","DEF",28,69,71,38,80,["extranjero"]],
 ["Christopher Díaz","DEF",31,68,68,35,65,["lateral"]],
 ["Cristián Gutiérrez","DEF",29,67,68,32,60,["extranjero","lateral"]],
 ["Vicente Lavín","DEF",23,65,74,24,60,["joven"]],
 ["Yonathan Andía","DEF",31,66,66,30,50,["lateral"]],
 ["Camilo Moya","VOL",28,68,70,35,70,["contención"]],
 ["Yerko Leiva","VOL",28,69,71,38,75,["creación"]],
 ["Carlo Villanueva","VOL",27,67,70,32,65,[]],
 ["Joan Cruz","VOL",23,66,76,28,80,["joven","préstamo"]],
 ["Kevin Méndez","VOL",31,70,70,40,75,["extranjero","desequilibrio"]],
 ["Sebastián Sáez","DEL",41,71,71,45,40,["capitán","goleador","extranjero","veterano"]],
 ["Bayron Oyarzo","DEL",31,69,69,38,70,["velocidad"]],
 ["Matías Campos López","DEL",35,68,68,35,45,["veterano"]],
 ["Francisco Pozzo","DEL",24,65,74,25,60,["extranjero"]],
 ["Martín Hiriart","DEL",21,60,76,15,50,["joven"]]
];
const PLANTEL_LSE_2026=[
 ["Federico Lanzillotta","ARQ",33,71,71,42,65,["extranjero"]],
 ["Eryin Sanhueza","ARQ",30,68,69,32,55,[]],
 ["Ignacio Sáez","ARQ",20,62,80,18,70,["joven","préstamo"]],
 ["Lucas Alarcón","DEF",26,70,74,40,85,[]],
 ["Andrés Zanini","DEF",29,70,71,40,80,["extranjero"]],
 ["Joaquín Gutiérrez","DEF",24,70,76,38,100,["lateral ofensivo"]],
 ["Bruno Gutiérrez","DEF",24,69,74,36,90,["préstamo"]],
 ["Fernando Dinamarca","DEF",22,67,78,28,85,["joven","lateral"]],
 ["Yahir Salazar","DEF",21,66,78,26,80,["joven","préstamo"]],
 ["Rafael Delgado","DEF",36,66,66,28,30,["extranjero","veterano"]],
 ["Francis Mac Allister","VOL",30,71,72,45,90,["extranjero","contención"]],
 ["Gonzalo Escalante","VOL",33,71,71,45,75,["extranjero"]],
 ["Sebastián Díaz","VOL",30,69,69,36,70,["contención"]],
 ["Felipe Chamorro","VOL",24,68,74,32,80,[]],
 ["Matías Marín","VOL",26,67,72,30,70,[]],
 ["Jeisson Vargas","DEL",28,74,75,55,130,["capitán","tiro libre","desequilibrio"]],
 ["Diego Rubio","DEL",33,72,72,50,80,["goleador"]],
 ["Ángelo Henríquez","DEL",32,70,70,42,70,["experiencia"]],
 ["Alexander Oroz","DEL",24,67,75,30,80,["velocidad"]],
 ["Gonzalo Figueroa","DEL",26,66,72,28,65,["extranjero"]],
 ["Nicolás Stefanelli","DEL",31,66,66,28,50,["extranjero"]]
];
const PLANTEL_DCO_2026=[
 ["César Dutra","ARQ",34,72,72,45,60,["extranjero"]],
 ["Nicolás Araya","ARQ",27,64,70,22,45,[]],
 ["Nery Veloso","ARQ",39,62,62,18,15,["veterano"]],
 ["Fausto Grillo","DEF",33,71,71,42,70,["extranjero"]],
 ["Diego Carrasco","DEF",31,69,69,36,60,[]],
 ["Norman Rodríguez","DEF",28,70,72,40,85,["extranjero","juego aéreo"]],
 ["Brayan Véjar","DEF",31,69,69,36,65,["lateral ofensivo"]],
 ["Ariel Cáceres","DEF",26,66,70,28,55,[]],
 ["Cristian Riquelme","DEF",22,65,76,24,75,["joven","préstamo"]],
 ["Mateo González","DEF",21,62,76,18,60,["joven"]],
 ["Jorge Henríquez","VOL",32,70,70,40,70,[]],
 ["Misael Dávila","VOL",35,69,69,38,50,["veterano"]],
 ["Sebastián Martínez","VOL",33,68,68,35,50,["contención"]],
 ["Ethan Espinoza","VOL",25,66,74,28,70,["préstamo"]],
 ["Leenhan Romero","VOL",19,60,78,14,55,["joven"]],
 ["Joaquín Larrivey","DEL",41,73,73,50,45,["capitán","goleador","extranjero","veterano"]],
 ["Joaquín Montecinos","DEL",27,70,73,42,90,["velocidad"]],
 ["Aldrix Jara","DEL",25,68,74,32,75,["goleador"]],
 ["Matías Cavalleri","DEL",28,67,70,32,65,[]],
 ["Fernando Romero","DEL",26,66,72,28,65,["extranjero"]]
];
const PLANTEL_UDC_2026=[
 ["Jorge Broun","ARQ",40,72,72,42,40,["extranjero","veterano"]],
 ["José Sanhueza","ARQ",25,68,74,30,65,[]],
 ["Diego Matamala","ARQ",24,62,72,16,40,[]],
 ["Osvaldo González","DEF",41,72,72,45,40,["capitán","ídolo","veterano"]],
 ["Miguel Barbieri","DEF",32,70,70,40,75,["extranjero"]],
 ["David Retamal","DEF",23,68,76,32,85,["joven","préstamo"]],
 ["Bastián Ubal","DEF",24,67,74,28,70,[]],
 ["Yerco Oyanedel","DEF",25,68,72,32,75,["lateral ofensivo"]],
 ["Antonio Díaz","DEF",26,67,72,30,70,["préstamo"]],
 ["Jorge Espejo","DEF",25,65,70,26,55,["lateral"]],
 ["Jeison Fuentealba","VOL",23,71,80,42,130,["joven","creación","préstamo"]],
 ["Facundo Mater","VOL",28,70,72,40,90,["extranjero"]],
 ["Bryan Ogaz","VOL",26,67,72,30,70,["contención"]],
 ["Luis Rojas","VOL",24,66,73,28,70,[]],
 ["Cristhofer Mesías","VOL",28,65,68,26,55,[]],
 ["Harol Salgado","VOL",25,64,70,24,55,["desequilibrio"]],
 ["Cecilio Waterman","DEL",35,73,73,50,80,["extranjero","goleador"]],
 ["Daniel Barrea","DEL",25,68,74,35,80,["extranjero"]],
 ["Pablo Parra","VOL",31,67,67,32,55,["experiencia"]],
 ["Iam González","DEL",22,63,76,20,65,["joven"]]
];

/* ---------------- planteles 1991 (8 clubes) ---------------- */
const PLANTEL_UC_1991=[
 ["Patricio Toledo","ARQ",29,80,82,58,220,["selección","seguro bajo los tres palos"]],
 ["Andrés Romero","DEF",24,76,80,45,180,["selección","lateral ofensivo"]],
 ["Miguel Ponce","DEF",20,70,82,22,140,["joven","lateral"]],
 ["Leonel Contreras","DEF",29,72,73,35,90,["juego aéreo"]],
 ["Rodrigo Blasco","DEF",22,64,74,16,60,[]],
 ["Francisco Hörmann","DEF",23,66,72,20,70,[]],
 ["José del Solar","VOL",23,79,84,50,260,["extranjero","contención","proyección europea"]],
 ["Fabián Estay","VOL",22,78,84,48,240,["selección","desequilibrio"]],
 ["Nelson Parraguez","VOL",20,74,86,28,200,["joven","contención","proyección europea"]],
 ["Mario Lepe","VOL",26,76,78,45,160,["ídolo","tiro libre"]],
 ["Jorge Contreras","VOL",31,80,80,55,180,["selección","creación"]],
 ["Gerardo Reinoso","VOL",26,79,80,52,190,["extranjero","goleador"]],
 ["Ricardo Monje","VOL",24,68,72,22,70,[]],
 ["Adolfo Ovalle","VOL",21,62,74,14,50,["joven"]],
 ["Rodrigo Barrera","DEL",21,76,84,40,220,["joven","goleador","velocidad"]],
 ["Raimundo Tupper","DEL",22,77,82,42,210,["ídolo","desequilibrio"]],
 ["José Percudani","DEL",26,78,78,50,170,["extranjero","goleador"]],
 ["Ian MacNiven","DEL",19,58,76,10,45,["joven"]]
];
const PLANTEL_COQ_1991=[
 ["Rolando Rivera","ARQ",28,72,73,32,80,[]],
 ["Johnny Pérez","ARQ",26,70,72,28,70,[]],
 ["Jaime Muñoz","DEF",27,74,75,38,110,["líbero"]],
 ["Daniel López","DEF",26,72,73,32,90,[]],
 ["Miguel Ramos","DEF",28,71,72,30,80,["lateral"]],
 ["Javier Toledo","DEF",25,70,72,28,75,["lateral"]],
 ["Sergio Rivero","DEF",27,70,71,28,70,["lateral"]],
 ["Roberto Barraza","DEF",29,68,68,24,55,[]],
 ["Luis Fuentes","DEF",20,62,80,14,70,["joven"]],
 ["Carlos Soto","VOL",27,74,75,38,110,["contención"]],
 ["Ronaldo Moraes","VOL",28,73,74,36,100,["extranjero"]],
 ["Roberto Corró","VOL",26,70,72,28,75,[]],
 ["Orlando Mondaca","VOL",25,69,71,26,70,[]],
 ["Pedro González","DEL",25,78,82,48,200,["goleador","proyección"]],
 ["Cristián Olguín","DEL",24,74,76,36,120,["goleador"]],
 ["Patricio Marzán","DEL",26,68,70,24,65,[]],
 ["Eugenio Julio","DEL",23,66,72,20,60,[]]
];
const PLANTEL_OHI_1991=[
 ["Nelson Tapia","ARQ",24,74,86,35,180,["joven","proyección europea"]],
 ["Cristián Trejos","ARQ",29,68,68,22,50,[]],
 ["Mauro Meléndez","DEF",28,74,74,36,100,[]],
 ["Joel Molina","DEF",25,72,73,32,85,[]],
 ["Jorge Gómez","DEF",22,73,80,32,140,["joven"]],
 ["Daniel Fuentes","DEF",24,72,74,30,95,[]],
 ["Luis Casanova","DEF",25,68,70,22,60,[]],
 ["Leonel Pedreros","DEF",29,67,67,20,50,[]],
 ["Fernando Cornejo","VOL",22,75,84,35,170,["joven","box-to-box"]],
 ["Roque Alfaro","VOL",34,74,74,38,80,["extranjero","experiencia"]],
 ["Norberto Retamar","VOL",27,72,73,32,90,["extranjero"]],
 ["Guillermo Carreño","VOL",29,72,72,32,85,[]],
 ["Claudio Figueroa","VOL",31,68,68,24,55,[]],
 ["Jaime Riveros","VOL",20,62,80,14,80,["joven"]],
 ["Carlos Gustavo de Luca","DEL",29,84,84,62,320,["extranjero","goleador"]],
 ["Ronald Baroni","DEL",25,74,76,38,130,["extranjero"]],
 ["Martín Gálvez","DEL",28,70,71,28,75,[]],
 ["Malcom Moyano","DEL",21,64,74,16,55,["joven"]]
];
const PLANTEL_COB_1991=[
 ["Mario Osben","ARQ",40,78,78,45,70,["ídolo","veterano","seguro bajo los tres palos"]],
 ["Luis Abarca","DEF",29,73,74,35,95,[]],
 ["Claudio Tello","DEF",27,74,75,36,110,[]],
 ["Héctor Puebla","DEF",36,74,74,38,70,["ídolo","veterano"]],
 ["Miguel Rojas","DEF",26,68,70,24,60,[]],
 ["Omar Gómez","VOL",28,70,71,28,70,[]],
 ["Sergio Merlini","VOL",28,72,73,32,90,["extranjero"]],
 ["Camilo Pino","VOL",25,68,72,24,65,[]],
 ["Juan Covarrubias","VOL",30,80,80,52,200,["creación","ídolo"]],
 ["Carlos González","VOL",26,70,72,28,75,[]],
 ["Marco Antonio Figueroa","DEL",29,85,85,65,350,["extranjero","goleador"]],
 ["Marcelo Álvarez","DEL",26,72,74,32,95,[]],
 ["José Ortega","DEL",22,68,76,22,80,["joven"]],
 ["Ángel Bustos","DEL",27,66,68,20,55,[]]
];
const PLANTEL_UES_1991=[
 ["Carlos Prono","ARQ",27,76,77,42,120,["extranjero"]],
 ["Eduardo Azargado","ARQ",27,64,68,16,40,[]],
 ["Juan Rivera","DEF",31,72,72,32,70,[]],
 ["Marcelo Zunino","DEF",24,71,74,28,85,[]],
 ["Ricardo González","DEF",25,70,72,26,75,[]],
 ["Manuel Miranda","DEF",29,69,69,24,60,[]],
 ["Juan Carlos González","DEF",22,66,76,18,70,["joven"]],
 ["José Luis Sierra","VOL",22,76,86,38,220,["joven","creación","proyección europea"]],
 ["Marcelo Vega","VOL",19,72,86,28,200,["joven","desequilibrio"]],
 ["Nelson Enríquez","VOL",30,70,70,28,65,[]],
 ["Fernando Pérez","VOL",29,69,69,26,60,[]],
 ["Luis Bustos","VOL",22,68,74,22,70,[]],
 ["Sandro Navarrete","VOL",22,68,73,22,70,[]],
 ["Miguel Ángel Latín","VOL",22,66,72,18,55,[]],
 ["Aníbal González","DEL",27,84,84,60,300,["goleador"]],
 ["Cristián Montecinos","DEL",20,70,82,24,130,["joven","goleador"]],
 ["Richard Valenzuela","DEL",24,64,70,16,50,[]]
];
const PLANTEL_UCH_1991=[
 ["Eduardo Fournier","ARQ",35,74,74,38,70,["veterano"]],
 ["Walter Mella","ARQ",23,60,70,12,35,[]],
 ["Roberto Reynero","DEF",26,72,74,32,85,[]],
 ["Horacio Rivas","DEF",26,70,72,28,75,[]],
 ["Carlos Soto","DEF",31,70,70,28,65,[]],
 ["Álex Martínez","DEF",31,69,69,26,60,[]],
 ["Patricio Reyes","DEF",33,70,70,28,55,["veterano","selección"]],
 ["Cristián Mora","DEF",22,72,80,30,120,["joven"]],
 ["Luis Musrri","VOL",22,74,84,32,160,["joven","contención","ídolo"]],
 ["Carlos Morales","VOL",22,72,78,30,110,["extranjero"]],
 ["Hugo Bello","VOL",27,68,70,22,60,[]],
 ["Esteban Valencia","VOL",19,62,82,12,80,["joven"]],
 ["Mariano Puyol","DEL",32,78,78,48,140,["ídolo","goleador"]],
 ["José Castro","DEL",24,76,78,42,150,["extranjero","goleador"]],
 ["Franz Arancibia","DEL",24,72,75,32,100,[]],
 ["Walter Fernández","DEL",26,68,70,24,65,["extranjero"]],
 ["Rodrigo Goldberg","DEL",19,58,80,10,60,["joven"]]
];
const PLANTEL_FV_1991=[
 ["Osmar Brunelli","ARQ",29,73,74,32,80,[]],
 ["Pedro Jaque","DEF",27,72,74,30,85,[]],
 ["Víctor Hugo Amatti","DEF",28,73,74,32,95,["extranjero"]],
 ["Alberto Cisternas","VOL",26,70,72,26,70,[]],
 ["Walter Pajón","VOL",27,70,71,26,70,[]],
 ["Luis Ceballos","VOL",25,69,72,24,70,[]],
 ["Luis Riquelme","VOL",26,68,70,22,60,[]],
 ["Álvaro Vergara","DEL",25,74,76,36,110,["goleador"]],
 ["Servando Vecino","DEL",28,68,70,24,65,["extranjero"]]
];
const PLANTEL_DCO_1991=[
 ["Juan Carlos Almada","DEL",28,83,83,58,280,["extranjero","goleador"]],
 ["Danilo Figueroa","DEL",24,72,74,30,90,[]],
 ["Osvaldo Hurtado","DEL",33,72,72,32,70,["veterano"]],
 ["Luis Pérez","VOL",26,70,72,26,75,[]],
 ["Juan Lee Chong","VOL",27,68,70,22,60,[]],
 ["Héctor Adomaitis","VOL",21,68,80,22,110,["joven"]]
];

/* ---------------- fixtures reales 2026 ---------------- */
const LIGA_PAL_2026=[
 {fecha:1,  f:{m:2,d:1},   rival:"NUB", local:true,  real:"1-1"},
 {fecha:2,  f:{m:2,d:7},   rival:"COQ", local:false, real:"1-3"},
 {fecha:3,  f:{m:2,d:13},  rival:"UCH", local:true,  real:"0-0"},
 {fecha:4,  f:{m:2,d:21},  rival:"HUA", local:false, real:"1-2"},
 {fecha:5,  f:{m:2,d:28},  rival:"OHI", local:true,  real:"4-2"},
 {fecha:6,  f:{m:3,d:8},   rival:"COB", local:true,  real:"4-2"},
 {fecha:7,  f:{m:3,d:15},  rival:"UDC", local:false, real:"0-1"},
 {fecha:8,  f:{m:4,d:2},   rival:"UC",  local:false, real:"1-6"},
 {fecha:9,  f:{m:4,d:11},  rival:"LIM", local:true,  real:"1-0"},
 {fecha:10, f:{m:4,d:19},  rival:"CC",  local:false, real:"1-0"},
 {fecha:11, f:{m:4,d:23},  rival:"DCO", local:true,  real:"0-1"},
 {fecha:12, f:{m:5,d:15},  rival:"LSE", local:true,  real:"5-1"},
 {fecha:13, f:{m:5,d:23},  rival:"CAL", local:false, real:"2-1"},
 {fecha:14, f:{m:5,d:31},  rival:"AUD", local:true,  real:"0-0"},
 {fecha:15, f:{m:6,d:13},  rival:"EVE", local:false, real:"2-1"},
 {fecha:16, f:{m:7,d:26},  rival:"NUB", local:false, real:"0-2"},
 {fecha:17, f:{m:8,d:1},   rival:"COQ", local:true,  real:"2-1"},
 {fecha:18, f:{m:8,d:9},   rival:"UCH", local:false, real:"1-2"},
 {fecha:19, f:{m:8,d:17},  rival:"HUA", local:true,  real:"5-1"},
 {fecha:20, f:{m:8,d:23},  rival:"OHI", local:false, real:null},
 {fecha:21, f:{m:8,d:28},  rival:"COB", local:false, real:null},
 {fecha:22, f:{m:9,d:6},   rival:"UDC", local:true,  real:null},
 {fecha:23, f:{m:9,d:12},  rival:"UC",  local:true,  real:null},
 {fecha:24, f:{m:10,d:11}, rival:"LIM", local:false, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"CC",  local:true,  real:null},
 {fecha:26, f:{m:11,d:1},  rival:"DCO", local:false, real:null},
 {fecha:27, f:{m:11,d:8},  rival:"LSE", local:false, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"CAL", local:true,  real:null},
 {fecha:29, f:{m:11,d:29}, rival:"AUD", local:false, real:null},
 {fecha:30, f:{m:12,d:6},  rival:"EVE", local:true,  real:null}
];
const LIGA_LIM_2026=[
 {fecha:1,  f:{m:1,d:31},  rival:"CC",  local:true,  real:"3-1"},
 {fecha:2,  f:{m:2,d:8},   rival:"NUB", local:false, real:"1-1"},
 {fecha:3,  f:{m:2,d:14},  rival:"OHI", local:true,  real:"2-1"},
 {fecha:4,  f:{m:2,d:22},  rival:"UCH", local:false, real:"2-2"},
 {fecha:5,  f:{m:2,d:28},  rival:"HUA", local:true,  real:"3-0"},
 {fecha:6,  f:{m:3,d:7},   rival:"EVE", local:false, real:"0-1"},
 {fecha:7,  f:{m:3,d:15},  rival:"COB", local:false, real:"5-2"},
 {fecha:8,  f:{m:4,d:4},   rival:"CAL", local:true,  real:"4-0"},
 {fecha:9,  f:{m:4,d:11},  rival:"PAL", local:false, real:"0-1"},
 {fecha:10, f:{m:4,d:17},  rival:"UDC", local:true,  real:"3-0"},
 {fecha:11, f:{m:4,d:24},  rival:"AUD", local:false, real:"2-2"},
 {fecha:12, f:{m:5,d:16},  rival:"UC",  local:true,  real:"0-2"},
 {fecha:13, f:{m:5,d:24},  rival:"LSE", local:false, real:"1-4"},
 {fecha:14, f:{m:5,d:31},  rival:"COQ", local:true,  real:"2-3"},
 {fecha:15, f:{m:6,d:14},  rival:"DCO", local:false, real:"2-3"},
 {fecha:16, f:{m:7,d:24},  rival:"CC",  local:false, real:"1-3"},
 {fecha:18, f:{m:8,d:9},   rival:"OHI", local:false, real:"3-1"},
 {fecha:19, f:{m:8,d:15},  rival:"UCH", local:true,  real:"1-3"},
 {fecha:20, f:{m:8,d:22},  rival:"HUA", local:false, real:null},
 {fecha:21, f:{m:8,d:29},  rival:"EVE", local:true,  real:null},
 {fecha:17, f:{m:9,d:2},   rival:"NUB", local:true,  real:null},
 {fecha:22, f:{m:9,d:7},   rival:"COB", local:true,  real:null},
 {fecha:23, f:{m:9,d:14},  rival:"CAL", local:false, real:null},
 {fecha:24, f:{m:10,d:11}, rival:"PAL", local:true,  real:null},
 {fecha:25, f:{m:10,d:25}, rival:"UDC", local:false, real:null},
 {fecha:26, f:{m:11,d:1},  rival:"AUD", local:true,  real:null},
 {fecha:27, f:{m:11,d:8},  rival:"UC",  local:false, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"LSE", local:true,  real:null},
 {fecha:29, f:{m:11,d:29}, rival:"COQ", local:false, real:null},
 {fecha:30, f:{m:12,d:6},  rival:"DCO", local:true,  real:null}
];

/* ---------------- enchufar a los mapas del juego (mutación) ---------------- */
/* ---------------- plantel histórico: U. de Chile 2011 (Sampaoli · campeón Copa Sudamericana) ---------------- */
/* Nombres reales documentados; stats estimadas ("aproximado"). */
const PLANTEL_UCH_2011=[
 ["Johnny Herrera","ARQ",30,84,84,120,220,["ídolo","seguro bajo los tres palos","penales"]],
 ["Paulo Garcés","ARQ",25,72,76,50,90,["recambio"]],
 ["Matías Rodríguez","DEF",25,80,82,110,320,["extranjero","lateral ofensivo"]],
 ["Osvaldo González","DEF",25,79,82,100,300,["juego aéreo"]],
 ["José Rojas","DEF",26,80,81,110,300,["capitán","de la casa","juego aéreo"]],
 ["Marcos González","DEF",30,77,77,90,180,["experiencia"]],
 ["Eugenio Mena","DEF",23,80,86,90,420,["lateral ofensivo","proyección europea"]],
 ["Albert Acevedo","DEF",27,72,73,60,110,["extranjero"]],
 ["Marcelo Díaz","VOL",24,82,86,110,480,["de la casa","creación","tiro libre","llegador"]],
 ["Charles Aránguiz","VOL",22,83,90,110,620,["proyección europea","box-to-box","llegador"]],
 ["Guillermo Marín","VOL",25,75,77,80,150,["orden"]],
 ["Felipe Seymour","VOL",24,73,76,70,130,["contención"]],
 ["Gustavo Lorenzetti","VOL",26,80,81,110,300,["extranjero","desequilibrio"]],
 ["Eduardo Vargas","DEL",21,84,92,120,900,["joven","goleador","proyección europea","frio de definicion"]],
 ["Gustavo Canales","DEL",29,79,79,100,220,["extranjero","goleador","juego aéreo"]],
 ["Ángelo Henríquez","DEL",17,74,88,50,420,["joven","de la casa","proyección europea"]],
 ["Junior Fernandes","DEL",23,76,80,80,220,["velocidad"]],
 ["Sebastián Ubilla","DEL",25,74,76,70,150,["velocidad"]]
];
(function(){
  if(typeof PLANTELES_REALES==="object"){
    if(PLANTELES_REALES.UCH) PLANTELES_REALES.UCH[2011]=PLANTEL_UCH_2011; else PLANTELES_REALES.UCH={2011:PLANTEL_UCH_2011};
    PLANTELES_REALES.EVE={2026:PLANTEL_EVE_2026};
    PLANTELES_REALES.COQ={2026:PLANTEL_COQ_2026, 1991:PLANTEL_COQ_1991};
    PLANTELES_REALES.AUD={2026:PLANTEL_AUD_2026};
    PLANTELES_REALES.HUA={2026:PLANTEL_HUA_2026};
    PLANTELES_REALES.OHI={2026:PLANTEL_OHI_2026, 1991:PLANTEL_OHI_1991};
    PLANTELES_REALES.NUB={2026:PLANTEL_NUB_2026};
    PLANTELES_REALES.COB={2026:PLANTEL_COB_2026, 1991:PLANTEL_COB_1991};
    PLANTELES_REALES.CAL={2026:PLANTEL_CAL_2026};
    PLANTELES_REALES.LSE={2026:PLANTEL_LSE_2026};
    PLANTELES_REALES.DCO={2026:PLANTEL_DCO_2026, 1991:PLANTEL_DCO_1991};
    PLANTELES_REALES.UDC={2026:PLANTEL_UDC_2026};
    PLANTELES_REALES.UES={1991:PLANTEL_UES_1991};
    PLANTELES_REALES.FV={1991:PLANTEL_FV_1991};
    if(PLANTELES_REALES.UC) PLANTELES_REALES.UC[1991]=PLANTEL_UC_1991; else PLANTELES_REALES.UC={1991:PLANTEL_UC_1991};
    if(PLANTELES_REALES.UCH) PLANTELES_REALES.UCH[1991]=PLANTEL_UCH_1991; else PLANTELES_REALES.UCH={1991:PLANTEL_UCH_1991};
  }
  if(typeof FIXTURES_OFICIALES==="object"){
    FIXTURES_OFICIALES.PAL={2026:LIGA_PAL_2026};
    FIXTURES_OFICIALES.LIM={2026:LIGA_LIM_2026};
  }
})();
