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
 ["Tomas Alarcón","VOL",27,73,74,90,200,["contención"]],
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
 ["Tomas Asta-Buruaga","DEF",29,72,72,80,140,["recambio"]],
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
 ["Gonzalo Sosa","DEL",37,75,75,110,180,["goleador","veterano"]]
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
/* Cláusula de salida: vence con el contrato. ídolo/cantera sale más cara. Stats estimadas. */
function clausulaDe(j){
  if(!j) return 0;
  if(!j.contrato) j.contrato={hasta:0};
  if(!j.contrato.clausula){
    const ras=j.rasgos||[];
    const idolo=ras.indexOf("ídolo")>=0||ras.indexOf("de la casa")>=0||ras.indexOf("capitán")>=0;
    const joven=j.edad<=23 && (j.proy||0)>(j.nivel||0)+4;
    const mul=idolo?2.2:(joven?2.5:1.55);
    j.contrato.clausula=Math.max(30, Math.round((j.valor||80)*mul));
  }
  return j.contrato.clausula;
}
function etqContrato(j){
  if(!j||!j.contrato) return "sin contrato";
  const h=j.contrato.hasta||"?";
  const c=clausulaDe(j);
  return "hasta "+h+(c?" · cláusula "+plata(c)+" (vence "+h+")":"");
}
function generarJugador(rr,nivelBase,pos,edad){
  const nivel=clamp(Math.round(nivelBase+rr()*20-10),28,92);
  const edd=edad||18+Math.floor(rr()*16);
  const proy=clamp(nivel+(edd<23?Math.round(rr()*12):0),28,95);
  const infl=(typeof inflacionEra==="function" && typeof E!=="undefined" && E)?inflacionEra():1;
  let nombre;
  const joven=edd<=21;
  if(joven && typeof NOMBRES_CANTERA!=="undefined" && NOMBRES_CANTERA.length){
    const usados={};
    if(typeof E!=="undefined" && E && Array.isArray(E.plantel)) E.plantel.forEach(j=>{ if(j&&j.n) usados[j.n]=1; });
    const pool=NOMBRES_CANTERA.filter(n=>!usados[n]);
    const src=pool.length?pool:NOMBRES_CANTERA;
    nombre=src[Math.floor(rr()*src.length)];
  } else {
    const pila=NOMBRES_PILA[Math.floor(rr()*NOMBRES_PILA.length)];
    const ape=APELLIDOS[Math.floor(rr()*APELLIDOS.length)];
    const ape2=APELLIDOS[Math.floor(rr()*APELLIDOS.length)];
    nombre=pila+" "+ape+((rr()<0.25&&ape2!==ape)?(" "+ape2):"");
  }
  const rasgos=edd<=21?["cantera"]:[];
  if(joven && typeof APODOS_CANTERA!=="undefined" && APODOS_CANTERA.length && rr()<0.35){
    rasgos.push(APODOS_CANTERA[Math.floor(rr()*APODOS_CANTERA.length)]);
  }
  return {n:nombre,
    pos:pos,edad:edd,nivel:nivel,proy:proy,
    sueldo:Math.round(nivel*nivel/110*infl),valor:Math.round((nivel*nivel/16+(proy-nivel)*10)*infl),
    rasgos:rasgos,forma:65+Math.round(rr()*15),moral:65+Math.round(rr()*15),real:false,
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
  out.forEach(j=>{
    if(!j.contrato.hasta) j.contrato.hasta=anio+1+Math.floor(rr()*3);
    if(typeof clausulaDe==="function") clausulaDe(j);
  });
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
/* XI rival: plantel vivo de la CPU si existe. Si no, documentado. Nunca se queda pegado en 2026. */
function plantelRival(idOrNombre,fuerza){
  const id=idClubDe(idOrNombre);
  if(id && typeof cpuPlantel==="function"){
    try{
      const pl=cpuPlantel(id);
      if(pl&&pl.length>=11){
        const pick=function(pos,n){ return pl.filter(function(j){ return j.pos===pos && !j.vendido; }).sort(function(a,b){ return (b.nivel||0)-(a.nivel||0); }).slice(0,n); };
        let xi=pick("ARQ",1).concat(pick("DEF",4),pick("VOL",4),pick("DEL",2));
        if(xi.length<11){
          const resto=pl.filter(function(j){ return xi.indexOf(j)<0 && !j.vendido; }).sort(function(a,b){ return (b.nivel||0)-(a.nivel||0); });
          xi=xi.concat(resto.slice(0,11-xi.length));
        }
        return xi.slice(0,11);
      }
    }catch(e){}
  }
  const anio=(typeof E!=="undefined"&&E&&E.anio)||2026;
  const pack=id&&PLANTELES_REALES[id];
  let reales=pack&&(pack[anio]||null);
  if(!reales && pack){
    const ys=Object.keys(pack).map(Number).filter(function(n){ return !isNaN(n); }).sort(function(a,b){ return b-a; });
    const y=ys.find(function(x){ return x<=anio; })||ys[0];
    if(y!=null) reales=pack[y];
  }
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
/* ---------- CPUs: el resto de los clubes envejece, se retira y se ficha ----------
   7.9010 · el mundo no se queda congelado en 2026. Cada club tiene plantel vivo
   en E.cpu.sq[id]. Al pasar el año crecen, cuelgan los botines y se mueven. */
function idsClubesCpu(){
  const ids={};
  if(typeof PLANTELES_REALES==="object") Object.keys(PLANTELES_REALES).forEach(function(id){ ids[id]=1; });
  [typeof LIGA_2026!=="undefined"&&LIGA_2026, typeof LIGA_B_2026!=="undefined"&&LIGA_B_2026,
   typeof LIGA_C_2026!=="undefined"&&LIGA_C_2026, typeof LIGA_ARG_2026!=="undefined"&&LIGA_ARG_2026,
   typeof LIGA91!=="undefined"&&LIGA91].forEach(function(L){
    if(Array.isArray(L)) L.forEach(function(c){ if(c&&c.id) ids[c.id]=1; });
  });
  if(typeof LIGAS==="object") Object.keys(LIGAS).forEach(function(era){
    (LIGAS[era]||[]).forEach(function(c){ if(c&&c.id) ids[c.id]=1; });
  });
  return Object.keys(ids);
}
function _nomClubCpu(id){
  try{
    if(typeof clubMundo==="function"){ const c=clubMundo(id); if(c) return c.n||c.c||id; }
    if(typeof clubLookup==="function"){ const c=clubLookup(id); if(c) return c.n||c.c||id; }
    if(typeof CLUB_POR_ID==="object"&&CLUB_POR_ID[id]) return CLUB_POR_ID[id].n||CLUB_POR_ID[id].c||id;
  }catch(e){}
  return id;
}
function cpuSeedFromData(id, ySrc){
  const pack=typeof PLANTELES_REALES==="object"&&PLANTELES_REALES[id];
  if(pack){
    let y=ySrc;
    if(y==null || !pack[y]){
      const years=Object.keys(pack).map(Number).filter(function(n){ return !isNaN(n); }).sort(function(a,b){ return b-a; });
      const anio=(typeof E!=="undefined"&&E&&E.anio)||2026;
      y=years.find(function(x){ return x<=anio; });
      if(y==null) y=years[0];
    }
    if(y!=null && pack[y] && pack[y].length){
      return pack[y].map(function(a){ return jugadorDesde(a); });
    }
  }
  const c=(typeof clubMundo==="function"&&clubMundo(id))||(typeof CLUB_POR_ID==="object"&&CLUB_POR_ID[id])||{};
  if(typeof armarPlantel==="function") return armarPlantel(id, (typeof E!=="undefined"&&E&&E.anio)||2026, c.fuerza||60);
  return [];
}
function cpuAnioFuente(id){
  const pack=typeof PLANTELES_REALES==="object"&&PLANTELES_REALES[id];
  if(!pack) return (typeof E!=="undefined"&&E&&E.anio)||2026;
  const years=Object.keys(pack).map(Number).filter(function(n){ return !isNaN(n); }).sort(function(a,b){ return b-a; });
  const anio=(typeof E!=="undefined"&&E&&E.anio)||2026;
  const y=years.find(function(x){ return x<=anio; });
  return y!=null?y:(years[0]||anio);
}
function cpuEnvejecerUno(pl, id, anio, rr){
  pl=(pl||[]).slice();
  rr=rr||function(){ return Math.random(); };
  pl.forEach(function(j){
    j.edad=(j.edad||20)+1;
    let delta=0;
    if(j.edad<=23) delta=1+Math.floor(rr()*3);
    else if(j.edad<=29) delta=Math.floor(rr()*3)-1;
    else delta=-(1+Math.floor(rr()*3));
    j.nivel=clamp((j.nivel||60)+delta, 20, 94);
    if(j.edad<=24) j.proy=Math.max(j.proy||j.nivel, j.nivel+Math.floor(rr()*4));
    j.goles=0; j.partidos=0; j.lesion=0; j.forma=66+Math.floor(rr()*12);
  });
  const vivos=pl.filter(function(j){ return (j.edad||0)<37; });
  const nRet=pl.length-vivos.length;
  const fuerza=((typeof clubMundo==="function"&&clubMundo(id))||{}).fuerza||58;
  function meteJoven(pos){
    if(typeof generarJugador!=="function") return;
    const joven=generarJugador(rr, fuerza*0.7+8, pos, 17+Math.floor(rr()*3));
    joven.rasgos=["cantera"]; joven.real=false;
    joven.contrato={hasta:(anio||2026)+3+Math.floor(rr()*2)};
    vivos.push(joven);
  }
  for(let i=0;i<nRet;i++) meteJoven(["ARQ","DEF","DEF","VOL","VOL","DEL"][i%6]);
  while(vivos.length<18) meteJoven(["DEF","VOL","DEL","ARQ"][vivos.length%4]);
  if(vivos.length>24){
    vivos.sort(function(a,b){ return (a.nivel||0)-(b.nivel||0); });
    vivos.splice(0, vivos.length-24);
  }
  return vivos;
}
function cpuAsegurar(id){
  if(!id || typeof E==="undefined" || !E) return [];
  if(!E.cpu) E.cpu={anio:null, sq:{}};
  if(E.cpu.sq[id] && E.cpu.sq[id].length) return E.cpu.sq[id];
  const ySrc=cpuAnioFuente(id);
  let pl=cpuSeedFromData(id, ySrc);
  const skip=Math.max(0, ((E.anio||2026)-(ySrc||2026)));
  if(skip>0 && pl.length){
    const rr=azarFijo(semilla("cpuSkip"+id+(E.anio||0)));
    for(let k=0;k<skip;k++) pl=cpuEnvejecerUno(pl, id, (ySrc||2026)+k+1, rr);
  }
  E.cpu.sq[id]=pl;
  if(E.cpu.anio==null) E.cpu.anio=(skip>0?(E.anio||ySrc):(ySrc||E.anio||2026));
  return pl;
}
function cpuAsegurarTodos(){
  if(typeof E==="undefined" || !E) return;
  if(!E.cpu) E.cpu={anio:null, sq:{}};
  idsClubesCpu().forEach(function(id){ if(id!==E.club) cpuAsegurar(id); });
  if(E.cpu.anio==null) E.cpu.anio=E.anio;
}
function cpuPlantel(id){
  if(!id) return [];
  if(typeof E!=="undefined" && E && id===E.club && Array.isArray(E.plantel)) return E.plantel.filter(function(j){ return !j.vendido; });
  return cpuAsegurar(id);
}
function cpuQuitar(clubId, nombre){
  if(!clubId || !nombre || typeof E==="undefined" || !E || !E.cpu || !E.cpu.sq[clubId]) return;
  E.cpu.sq[clubId]=E.cpu.sq[clubId].filter(function(j){ return j.n!==nombre; });
}
function cpuSumar(clubId, j){
  if(!clubId || !j || typeof E==="undefined" || !E) return;
  cpuAsegurar(clubId);
  if(!E.cpu.sq[clubId]) E.cpu.sq[clubId]=[];
  if(E.cpu.sq[clubId].some(function(x){ return x.n===j.n; })) return;
  const copia=Object.assign({}, j, {vendido:false, cedido:null, goles:0, partidos:0});
  delete copia.precio; delete copia.pidesueldo; delete copia.club; delete copia.clubId;
  E.cpu.sq[clubId].push(copia);
}
function cpuMercadoAnio(rr){
  if(typeof E==="undefined" || !E || !E.cpu || !E.cpu.sq) return 0;
  rr=rr||Math.random;
  const ids=Object.keys(E.cpu.sq).filter(function(id){ return id!==E.club; });
  if(ids.length<2) return 0;
  const n=6+Math.floor(rr()*8);
  let hechas=0;
  for(let i=0;i<n;i++){
    const de=ids[Math.floor(rr()*ids.length)];
    const a=ids[Math.floor(rr()*ids.length)];
    if(!de||!a||de===a) continue;
    const cand=(E.cpu.sq[de]||[]).filter(function(j){
      const ras=j.rasgos||[];
      return j.edad>=21 && j.edad<=33 && ras.indexOf("ídolo")<0 && ras.indexOf("capitán")<0;
    });
    if(!cand.length || (E.cpu.sq[de]||[]).length<16) continue;
    const j=cand[Math.floor(rr()*cand.length)];
    E.cpu.sq[de]=E.cpu.sq[de].filter(function(x){ return x!==j; });
    E.cpu.sq[a].push(j);
    hechas++;
  }
  return hechas;
}
function cpuTickAnio(){
  if(typeof E==="undefined" || !E) return 0;
  cpuAsegurarTodos();
  if(E.cpu.anio===E.anio) return 0;
  const from=E.cpu.anio!=null?E.cpu.anio:((E.anio||2026)-1);
  const rr=azarFijo(semilla("cpuTick"+(E.club||"x")+(E.anio||0)));
  let y=from, hechas=0;
  while(y<E.anio){
    y++;
    Object.keys(E.cpu.sq).forEach(function(id){
      if(id===E.club) return;
      E.cpu.sq[id]=cpuEnvejecerUno(E.cpu.sq[id]||[], id, y, rr);
    });
    hechas+=cpuMercadoAnio(rr)||0;
  }
  E.cpu.anio=E.anio;
  return hechas;
}
function poolMercadoReal(){
  if(typeof E==="undefined" || !E) return [];
  cpuAsegurarTodos();
  const out=[];
  const yo=E.club;
  const pre=(E.preacuerdos||[]).reduce(function(s,pa){ if(pa&&pa.j&&pa.j.n) s[pa.j.n]=1; return s; },{});
  Object.keys((E.cpu&&E.cpu.sq)||{}).forEach(function(id){
    if(id===yo) return;
    (E.cpu.sq[id]||[]).forEach(function(j){
      if(!j || j.vendido || j.cedido || pre[j.n]) return;
      const infl=(typeof inflacionEra==="function")?inflacionEra():1;
      const precio=Math.max(1, Math.round((j.valor||80)*(0.85+((j.edad||25)<23?0.15:0))*infl));
      out.push(Object.assign({}, j, {
        club:_nomClubCpu(id),
        clubId:id,
        precio:precio,
        pidesueldo:Math.max(j.sueldo||8, Math.round((j.sueldo||8)*1.08*((typeof factorMercado==="function")?factorMercado():1)))
      }));
    });
  });
  return out;
}
/* ---------- tokens: las decisiones nombran jugadores de verdad ---------- */
function resolverTokens(txt,E,extra){
  if(!txt) return txt;
  const p=(E&&E.plantel||[]).filter(j=>!j.vendido);
  const mejor=(f,filtro)=>{const l=filtro?p.filter(filtro):p; if(!l.length) return null;
    return l.slice().sort((a,b)=>f(b)-f(a))[0];};
  const val={
    CAPITAN:(mejor(j=>j.nivel+((j.rasgos||[]).includes("capitán")?40:0))||{}).n,
    GOLEADOR:(mejor(j=>j.goles*10+j.nivel,j=>j.pos==="DEL")||{}).n,
    ARQUERO:(mejor(j=>j.nivel,j=>j.pos==="ARQ")||{}).n,
    IDOLO:(mejor(j=>j.nivel+((j.rasgos||[]).includes("ídolo")?40:0))||{}).n,
    JOVEN:(mejor(j=>j.proy-j.edad,j=>j.edad<=23)||{}).n,
    VETERANO:(mejor(j=>j.edad,j=>j.edad>=28)||{}).n,
    DEFENSA_JOVEN:(mejor(j=>j.proy-j.edad,j=>j.pos==="DEF"&&j.edad<=24)||{}).n,
    CRACK:(mejor(j=>j.valor)||{}).n,
    JUGADOR:(mejor(j=>j.nivel+j.forma/8)||{}).n,
    FIGURA:(mejor(j=>j.nivel+j.forma/10)||{}).n,
    DT:(E.dt||"el cuerpo técnico"),
    CLUB:(E.clubNombre||"el club"),
    RIVAL:((typeof proximoPartido==="function"&&proximoPartido()&&proximoPartido().rivalNombre)||"el rival"),
    ANIO:E.anio
  };
  if(extra&&typeof extra==="object") Object.keys(extra).forEach(function(k){ if(extra[k]!=null) val[k]=extra[k]; });
  return txt.replace(/\{([A-Z_]+)\}/g,(m,k)=> val[k]!=null?val[k]:m);
}
function jugadorPorToken(token,E){
  const nombre=resolverTokens("{"+token+"}",E);
  return E.plantel.find(j=>j.n===nombre)||null;
}
