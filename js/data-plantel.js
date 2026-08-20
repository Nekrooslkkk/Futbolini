"use strict";
/* ============================================================
   FUTBOLINI 3.0 · data-plantel.js
   Planteles con nombres reales. Los jugadores del plantel de
   Colo-Colo 1991 corresponden al grupo que disputó la Copa
   Libertadores de ese año (listado aproximado). Edades, sueldos,
   valores y atributos son estimaciones del juego, no datos
   contractuales reales.
   ============================================================ */

/* [nombre, posición, edad aprox, nivel, proyección, sueldo anual (MM$), valor (MM$), rasgos] */
const PLANTEL_CC_1991=[
 ["Daniel Morón","ARQ",29,82,82,58,260,["ídolo","seguro bajo los tres palos"]],
 ["Marcelo Ramírez","ARQ",23,68,76,16,90,["joven"]],
 ["Lizardo Garrido","DEF",33,79,79,52,140,["ídolo","veterano","marca implacable"]],
 ["Javier Margas","DEF",22,80,90,34,520,["proyección europea","juego aéreo"]],
 ["Miguel Ramírez","DEF",21,74,86,22,300,["joven","polivalente"]],
 ["Gabriel Mendoza","DEF",23,80,86,36,420,["lateral ofensivo","llegó desde O'Higgins"]],
 ["Leonel Herrera","DEF",23,76,84,28,260,["apellido pesado","llega al gol"]],
 ["Eduardo Vilches","VOL",26,74,76,24,120,["orden","corre por dos"]],
 ["Jaime Pizarro","VOL",27,84,84,62,300,["capitán","cerebro","ídolo"]],
 ["Rubén Espinoza","VOL",26,83,85,58,340,["desequilibrio","gol de media distancia"]],
 ["Raúl Ormeño","VOL",30,72,72,26,70,["veterano","oficio"]],
 ["Marcelo Barticciotto","DEL",25,87,89,90,620,["ídolo","gambeta","aguanta la presión"]],
 ["Luis Pérez","DEL",26,81,84,44,340,["definición","préstamo desde U. Católica"]],
 ["Rubén Martínez","DEL",28,85,85,72,400,["goleador del torneo","olfato"]],
 ["Patricio Yáñez","DEL",30,78,78,66,180,["experiencia internacional","carácter"]],
 ["Ricardo Dabrowski","DEL",28,80,80,58,280,["extranjero","juego aéreo"]],
 ["Sergio Salgado","DEL",24,70,78,18,110,["recambio"]],
 ["Juan Carlos Peralta","DEF",26,70,72,20,90,["recambio"]],
 ["Sergio Verdirame","VOL",22,71,82,18,140,["zurdo","recambio"]],
 ["José Letelier","ARQ",24,64,70,10,40,["recambio"]],
 ["Agustín Salvatierra","DEF",24,66,72,12,50,["recambio"]],
 ["Raúl Castro","VOL",23,62,68,8,30,["recambio"]],
 ["Leonardo Soto","DEL",22,63,70,8,35,["recambio"]]
];

const PLANTEL_UCH_1994=[
 ["Sergio Vargas","ARQ",27,84,84,60,320,["selección","reflejos"]],
 ["Cristián Castañeda","DEF",25,78,82,34,200,["temperamento"]],
 ["Ronald Fuentes","DEF",25,78,82,34,200,["salida limpia"]],
 ["Rogelio Delgado","DEF",30,76,76,38,120,["extranjero","liderazgo"]],
 ["Luis Musrri","VOL",25,80,84,40,260,["capitán","pulmón"]],
 ["Víctor Hugo Castañeda","VOL",28,82,82,50,240,["pegada","tiro libre"]],
 ["Patricio Mardones","DEL",30,78,78,42,150,["penales","experiencia"]],
 ["Marcelo Salas","DEL",19,84,95,26,900,["joven","killer","proyección europea"]]
];

/* ---------- planteles 2026 (APROXIMADOS · verificar) ----------
   Nombres reales de referencia según las últimas temporadas. Edades,
   niveles, sueldos y valores son estimaciones del juego, y los rosters
   pueden haber cambiado en el mercado. Los huecos se completan con
   jugadores generados. */
const PLANTEL_CC_2026=[
 ["Fernando de Paul","ARQ",35,76,76,90,110,["experiencia"]],
 ["Vozinha","ARQ",40,70,70,40,30,["veterano"]],
 ["Erick Wiemberg","DEF",32,74,74,100,160,["lateral"]],
 ["Javier Méndez","DEF",31,75,75,110,180,["marca"]],
 ["Jonathan Villagra","DEF",25,76,82,120,420,["proyección"]],
 ["Jeyson Rojas","DEF",24,72,76,80,200,["lateral"]],
 ["Joaquín Sosa","DEF",24,73,78,90,260,["extranjero"]],
 ["Arturo Vidal","VOL",39,76,76,200,80,["ídolo","carácter","experiencia internacional"]],
 ["Claudio Aquino","VOL",35,78,78,160,280,["extranjero","desequilibrio"]],
 ["Álvaro Madrid","VOL",31,74,74,110,160,["orden"]],
 ["Víctor Méndez","VOL",26,73,76,100,220,["contención"]],
 ["Marcos Bolados","DEL",30,74,74,120,180,["velocidad"]],
 ["Javier Correa","DEL",33,78,78,170,260,["extranjero","goleador"]],
 ["Maximiliano Romero","DEL",27,77,80,150,360,["extranjero","definición"]],
 ["Leandro Hernández","DEL",21,74,84,80,420,["joven","proyección"]],
 ["Francisco Marchant","DEL",20,70,80,50,220,["canterano"]],
 ["Lautaro Pastrán","DEL",24,73,78,90,280,["extranjero"]],
 ["Tomás Alarcón","VOL",27,73,74,90,200,["contención"]],
 ["Iván Román","DEF",20,72,84,70,400,["proyección"]],
 ["Diego Ulloa","DEF",23,70,76,60,160,["lateral"]]
];
const PLANTEL_UCH_2026=[
 ["Gabriel Castellón","ARQ",32,78,78,130,220,["reflejos"]],
 ["Cristopher Toselli","ARQ",38,70,70,60,30,["veterano"]],
 ["Igor Lichnovsky","DEF",32,77,77,140,240,["selección"]],
 ["Nicolás Ramírez","DEF",29,76,76,120,240,["marca"]],
 ["Matías Zaldivia","DEF",35,74,74,110,100,["experiencia"]],
 ["Marcelo Morales","DEF",23,76,84,100,480,["lateral","proyección"]],
 ["Fabián Hormazábal","DEF",30,76,76,120,280,["lateral ofensivo"]],
 ["Charles Aránguiz","VOL",37,79,79,200,140,["ídolo","cerebro","experiencia internacional"]],
 ["Marcelo Díaz","VOL",39,72,72,120,40,["ídolo","veterano"]],
 ["Israel Poblete","VOL",31,73,73,100,140,["orden"]],
 ["Lucas Assadi","VOL",22,80,88,140,720,["enganche","proyección","canterano"]],
 ["Agustín Arce","VOL",21,72,80,70,260,["canterano"]],
 ["Eduardo Vargas","DEL",36,78,78,180,160,["ídolo","experiencia internacional"]],
 ["Maximiliano Guerrero","DEL",26,76,80,120,360,["velocidad"]],
 ["Octavio Rivero","DEL",34,74,74,130,140,["extranjero"]],
 ["Gonzalo Reyna","DEL",22,72,80,80,260,["extranjero","proyección"]],
 ["Juan Martín Lucero","DEL",34,76,76,140,180,["extranjero","goleador"]]
];
const PLANTEL_UC_2026=[
 ["Vicente Bernedo","ARQ",25,74,80,90,280,["proyección"]],
 ["Darío Melo","ARQ",33,68,68,50,40,["recambio"]],
 ["Daniel González","DEF",24,78,82,140,420,["salida limpia"]],
 ["Eugenio Mena","DEF",38,72,72,80,50,["veterano","lateral"]],
 ["Branco Ampuero","DEF",32,73,73,90,140,["marca"]],
 ["Tomás Asta-Buruaga","DEF",29,72,72,80,140,["recambio"]],
 ["Gary Medel","VOL",39,75,75,180,80,["ídolo","carácter"]],
 ["Alfred Canales","VOL",26,74,80,90,320,["contención"]],
 ["Cristián Cuevas","VOL",31,72,72,100,160,["lateral"]],
 ["Fernando Zuqui","VOL",34,73,73,120,140,["extranjero"]],
 ["Clemente Montes","DEL",25,77,82,120,420,["velocidad","canterano"]],
 ["Fernando Zampedri","DEL",38,80,80,200,220,["capitán","goleador"]],
 ["Diego Valencia","DEL",26,72,74,100,200,["definición"]],
 ["Juan Rossel","DEL",21,70,80,60,220,["proyección"]]
];
const PLANTEL_PAL_2026=[
 ["Sebastián Pérez","ARQ",35,74,74,80,90,["experiencia"]],
 ["Sebastián Salas","ARQ",25,66,72,30,50,["recambio"]],
 ["Enzo Roco","DEF",34,75,75,110,140,["experiencia internacional"]],
 ["José Bizama","DEF",32,72,72,80,90,["marca"]],
 ["Dilan Zúñiga","DEF",30,73,73,90,180,["lateral"]],
 ["Ian Garguez","DEF",21,72,82,60,280,["proyección"]],
 ["Vicente Espinoza","DEF",22,70,76,50,160,["lateral"]],
 ["Dylan Glaby","VOL",30,73,73,90,160,["extranjero","orden"]],
 ["Joe Abrigo","VOL",31,75,75,110,200,["desequilibrio"]],
 ["Sebastián Gallegos","VOL",34,72,72,80,90,["experiencia"]],
 ["Nicolás Meza","VOL",24,68,74,40,80,["recambio"]],
 ["Bryan Carrasco","DEL",35,72,72,90,80,["veterano"]],
 ["Ronnie Fernández","DEL",35,73,73,100,110,["goleador"]],
 ["César Munder","DEL",26,74,76,90,200,["velocidad"]],
 ["Jonathan Benítez","DEL",34,72,72,80,90,["extranjero"]],
 ["Nelson Da Silva","DEL",29,73,74,90,140,["extranjero"]]
];
/* Deportes Limache 2026 · nombres públicos de referencia, stats estimadas */
const PLANTEL_LIM_2026=[
 ["Claudio González","ARQ",36,72,72,70,80,["experiencia"]],
 ["Matías Bórquez","ARQ",27,70,72,55,90,["reflejos"]],
 ["Alfonso Parot","DEF",36,74,74,90,100,["capitán","veterano"]],
 ["Augusto Aguirre","DEF",26,72,76,80,180,["extranjero"]],
 ["Dylan Escobar","DEF",25,70,74,60,140,["marca"]],
 ["Javier Rojas","DEF",20,68,78,40,160,["joven"]],
 ["César Fuentes","VOL",33,71,71,80,90,["orden"]],
 ["Leonardo Valencia","VOL",35,74,74,100,110,["experiencia","pegada"]],
 ["Jean Meneses","VOL",33,76,76,120,200,["desequilibrio"]],
 ["Misael Llantén","VOL",27,70,72,60,120,["pulmón"]],
 ["Daniel Castro","DEL",32,75,75,110,220,["goleador"]],
 ["Marcos Arturia","DEL",28,72,74,90,180,["extranjero"]],
 ["Gonzalo Sosa","DEL",21,71,80,70,240,["proyección"]]
];
/* ---------- planteles históricos Colo-Colo (datos reales cruzados, stats estimadas) ---------- */
const PLANTEL_CC_1989=[  /* Campeón Nacional + Copa Chile · DT Arturo Salah */
 ["Daniel Morón","ARQ",30,80,80,50,180,["ídolo","seguro bajo los tres palos"]],
 ["Marcelo Ramírez","ARQ",24,66,76,14,70,["joven","recambio"]],
 ["Lizardo Garrido","DEF",32,78,78,45,120,["ídolo","veterano","marca implacable"]],
 ["Eduardo Vilches","DEF",26,74,76,24,120,["orden","corre por dos"]],
 ["Hugo González","DEF",26,73,74,22,100,["marca"]],
 ["Javier Margas","DEF",20,74,92,26,420,["joven","proyección europea","juego aéreo"]],
 ["Miguel Ramírez","DEF",19,70,86,18,260,["joven","polivalente"]],
 ["Alfonso Neculñir","DEF",29,70,70,20,80,["oficio"]],
 ["Jaime Pizarro","VOL",25,82,86,55,320,["capitán","cerebro","ídolo"]],
 ["Rubén Espinoza","VOL",28,81,82,50,300,["desequilibrio","gol de media distancia"]],
 ["Raúl Ormeño","VOL",31,74,74,28,90,["ídolo","veterano","oficio"]],
 ["Sergio Díaz","VOL",26,78,80,40,240,["goleador"]],
 ["Marcelo Barticciotto","DEL",22,82,92,58,520,["joven","gambeta","figura"]],
 ["Ricardo Dabrowski","DEL",28,79,80,45,260,["extranjero","goleador","juego aéreo"]],
 ["Sergio Salgado","DEL",31,76,76,40,150,["goleador","veterano"]],
 ["Guillermo Carreño","DEL",27,74,74,30,140,["recambio"]]
];
const PLANTEL_CC_2002=[  /* Campeón Clausura en plena quiebra · DT Jaime Pizarro · plantel muy joven */
 ["Eduardo Lobos","ARQ",21,74,82,24,180,["joven","reflejos"]],
 ["Claudio Bravo","ARQ",19,70,94,18,340,["joven","proyección europea"]],
 ["Luis Mena","DEF",23,74,80,28,200,["figura"]],
 ["David Henríquez","DEF",25,74,76,30,160,["capitán","marca"]],
 ["Miguel Aceval","DEF",19,68,82,18,200,["joven"]],
 ["Miguel Riffo","DEF",21,70,78,20,140,["recambio"]],
 ["Rodolfo Madrid","DEF",22,70,74,20,120,["polivalente"]],
 ["Marcelo Espina","VOL",35,78,78,40,100,["ídolo","veterano","cerebro"]],
 ["Francisco Huaiquipán","VOL",24,72,74,24,130,["orden"]],
 ["Braulio Leal","VOL",21,70,80,20,160,["joven"]],
 ["Raúl Muñoz","VOL",27,70,70,24,90,["oficio"]],
 ["Alonzo Zúñiga","VOL",22,70,76,20,120,["recambio"]],
 ["Sebastián González","DEL",24,78,82,40,280,["goleador","figura"]],
 ["Ignacio Quinteros","DEL",23,74,78,30,180,["goleador"]],
 ["Manuel Neira","DEL",25,76,78,38,240,["goleador","figura"]],
 ["Gonzalo Fierro","DEL",19,70,86,18,240,["joven","proyección europea"]],
 ["Marcelo Barticciotto","DEL",35,74,74,30,80,["ídolo","veterano"]]
];
const PLANTEL_CC_2006=[  /* Ciclo Claudio Borghi (tetracampeonato 2006-2007) · camada de oro */
 ["Claudio Bravo","ARQ",23,84,92,60,560,["selección","reflejos","proyección europea"]],
 ["Sebastián Cejas","ARQ",31,74,74,30,90,["extranjero","experiencia"]],
 ["Luis Mena","DEF",27,76,76,40,200,["figura"]],
 ["David Henríquez","DEF",29,76,76,40,160,["capitán"]],
 ["Miguel Riffo","DEF",25,74,74,30,160,["marca"]],
 ["Miguel Aceval","DEF",23,72,76,26,160,["polivalente"]],
 ["Gonzalo Fierro","DEF",23,78,84,45,360,["figura","proyección europea"]],
 ["Arturo Vidal","VOL",19,78,96,42,760,["joven","proyección europea","carácter"]],
 ["Arturo Sanhueza","VOL",27,76,76,40,180,["orden"]],
 ["Rodrigo Meléndez","VOL",29,74,74,36,140,["oficio"]],
 ["Moisés Villarroel","VOL",30,72,72,34,100,["veterano"]],
 ["Matías Fernández","VOL",20,85,95,70,820,["figura","proyección europea","desequilibrio"]],
 ["Jorge Valdivia","VOL",22,82,88,60,560,["figura","cerebro"]],
 ["Humberto Suazo","DEL",25,86,88,75,700,["goleador","olfato","figura"]],
 ["Alexis Sánchez","DEL",17,74,97,32,780,["joven","proyección europea","gambeta"]],
 ["Álvaro Ormeño","VOL",28,72,72,30,110,["recambio"]]
];
const PLANTELES_REALES={
  CC:{1989:PLANTEL_CC_1989, 1991:PLANTEL_CC_1991, 2002:PLANTEL_CC_2002, 2006:PLANTEL_CC_2006, 2007:PLANTEL_CC_2006, 2026:PLANTEL_CC_2026},
  UCH:{1994:PLANTEL_UCH_1994, 2026:PLANTEL_UCH_2026},
  UC:{2026:PLANTEL_UC_2026},
  PAL:{2026:PLANTEL_PAL_2026},
  LIM:{2026:PLANTEL_LIM_2026}
};

const NOMBRES_PILA=["Luis","Carlos","Jorge","Mauricio","Cristián","Rodrigo","Felipe","Marcelo","Sebastián","Iván",
 "Héctor","Nelson","Patricio","Ramón","Víctor","Álvaro","Esteban","Franco","Matías","Gonzalo","Claudio","Fabián"];
const APELLIDOS=["Aránguiz","Bravo","Cáceres","Díaz","Espinoza","Fuentes","Gutiérrez","Henríquez","Ibáñez","Jara",
 "López","Muñoz","Navarrete","Órdenes","Pizarro","Quinteros","Rojas","Sepúlveda","Tapia","Urrutia","Valdés",
 "Yáñez","Zúñiga","Contreras","Silva","Riquelme","Maldonado","Cortés","Fernández","Aguilera","Bustos","Cifuentes"];

function semilla(txt){let h=2166136261;for(let i=0;i<txt.length;i++){h^=txt.charCodeAt(i);h=Math.imul(h,16777619);}return Math.abs(h);}
function azarFijo(s){let x=s;return()=>{x=(x*1103515245+12345)&0x7fffffff;return x/0x7fffffff;};}

function jugadorDesde(a){
  return {n:a[0],pos:a[1],edad:a[2],nivel:a[3],proy:a[4],
    sueldo:a[5],valor:a[6],rasgos:a[7]||[],forma:70,moral:70,real:true,
    contrato:{hasta:0},lesion:0,goles:0,partidos:0,tarjetas:0};
}
function generarJugador(rr,nivelBase,pos,edad){
  const nivel=clamp(Math.round(nivelBase+rr()*20-10),28,92);
  const edd=edad||18+Math.floor(rr()*16);
  const proy=clamp(nivel+(edd<23?Math.round(rr()*12):0),28,95);
  const infl=(typeof inflacionEra==="function" && typeof E!=="undefined" && E)?inflacionEra():1;
  const nro=1+Math.floor(rr()*80);
  return {n:"Canterano "+pos+" "+nro,
    pos:pos,edad:edd,nivel:nivel,proy:proy,
    sueldo:Math.round(nivel*nivel/110*infl),valor:Math.round((nivel*nivel/16+(proy-nivel)*10)*infl),
    rasgos:["cantera"],forma:65+Math.round(rr()*15),moral:65+Math.round(rr()*15),real:false,
    contrato:{hasta:0},lesion:0,goles:0,partidos:0,tarjetas:0};
}
/* Arma un plantel: nombres reales si hay. No rellena con gente inventada si ya hay 16+. */
function armarPlantel(clubId,anio,nivelBase){
  const out=[];
  const reales=(PLANTELES_REALES[clubId]||{})[anio];
  if(reales) reales.forEach(a=>out.push(jugadorDesde(a)));
  const rr=azarFijo(semilla(clubId+"-"+anio));
  if(!reales || out.length<16){
    const faltan=["ARQ","DEF","DEF","VOL","VOL","DEL","DEF","VOL","DEL","VOL"];
    let i=0;
    const tope=reales?18:22;
    while(out.length<tope && i<faltan.length*3){
      out.push(generarJugador(rr,nivelBase||60,faltan[i%faltan.length]));
      i++;
    }
  }
  out.forEach(j=>{ if(!j.contrato.hasta) j.contrato.hasta=anio+1+Math.floor(rr()*3); });
  return out;
}
function idClubDe(idOrNombre){
  if(!idOrNombre) return null;
  if(typeof CLUB_POR_ID==="object" && CLUB_POR_ID[idOrNombre]) return idOrNombre;
  const keys=typeof CLUB_POR_ID==="object"?Object.keys(CLUB_POR_ID):[];
  return keys.find(k=>{
    const c=CLUB_POR_ID[k];
    return c&&(c.n===idOrNombre||c.c===idOrNombre);
  })||null;
}
/* XI rival: plantel documentado si existe. Si no, apodos del club (no inventa nombres). */
function plantelRival(idOrNombre,fuerza){
  const id=idClubDe(idOrNombre);
  const anio=(typeof E!=="undefined"&&E&&E.anio)||2026;
  const pack=id&&PLANTELES_REALES[id];
  const reales=pack&&(pack[anio]||pack[2026]||pack[1991]);
  if(reales&&reales.length>=11){
    const pick=(pos,n)=>reales.filter(a=>a[1]===pos).slice(0,n);
    const filas=pick("ARQ",1).concat(pick("DEF",4),pick("VOL",4),pick("DEL",2));
    while(filas.length<11) filas.push(reales[filas.length%reales.length]);
    return filas.slice(0,11).map(a=>jugadorDesde(a));
  }
  const tag=(id&&CLUB_POR_ID[id]&&(CLUB_POR_ID[id].c||CLUB_POR_ID[id].n))||String(idOrNombre||"rival");
  const pos=["ARQ","DEF","DEF","DEF","DEF","VOL","VOL","VOL","DEL","DEL","DEL"];
  const rol=["el 1","el 2","el 3","el 4","el 5","el 6","el 8","el 10","el 7","el 9","el 11"];
  return pos.map((p,i)=>({
    n:rol[i]+" de "+tag, pos:p, edad:25, nivel:clamp((fuerza||60)-4,40,86),
    proy:70, sueldo:40, valor:80, rasgos:[], forma:70, moral:70, real:false,
    contrato:{hasta:0}, lesion:0, goles:0, partidos:0, tarjetas:0, cansancio:0
  }));
}
/* ---------- tokens: las decisiones nombran jugadores de verdad ---------- */
function resolverTokens(txt,E){
  if(!txt) return txt;
  const p=E.plantel.filter(j=>!j.vendido);
  const mejor=(f,filtro)=>{const l=filtro?p.filter(filtro):p; if(!l.length) return null;
    return l.slice().sort((a,b)=>f(b)-f(a))[0];};
  const val={
    CAPITAN:(mejor(j=>j.nivel+(j.rasgos.includes("capitán")?40:0))||{}).n,
    GOLEADOR:(mejor(j=>j.goles*10+j.nivel,j=>j.pos==="DEL")||{}).n,
    ARQUERO:(mejor(j=>j.nivel,j=>j.pos==="ARQ")||{}).n,
    IDOLO:(mejor(j=>j.nivel+(j.rasgos.includes("ídolo")?40:0))||{}).n,
    JOVEN:(mejor(j=>j.proy-j.edad,j=>j.edad<=23)||{}).n,
    VETERANO:(mejor(j=>j.edad,j=>j.edad>=28)||{}).n,
    DEFENSA_JOVEN:(mejor(j=>j.proy-j.edad,j=>j.pos==="DEF"&&j.edad<=24)||{}).n,
    CRACK:(mejor(j=>j.valor)||{}).n,
    DT:(E.dt||"el cuerpo técnico"),
    CLUB:(E.clubNombre||"el club"),
    RIVAL:((typeof proximoPartido==="function"&&proximoPartido()&&proximoPartido().rivalNombre)||"el rival"),
    ANIO:E.anio
  };
  return txt.replace(/\{([A-Z_]+)\}/g,(m,k)=> val[k]!=null?val[k]:m);
}
function jugadorPorToken(token,E){
  const nombre=resolverTokens("{"+token+"}",E);
  return E.plantel.find(j=>j.n===nombre)||null;
}
