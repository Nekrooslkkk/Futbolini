"use strict";
/* ============================================================
   FUTBOLINI · data-periodistas.js  (7.10)
   Periodistas, relatores y comentaristas chilenos REALES por época
   (datos de Grok). Nombres y medios reales; lo que dicen en el juego es
   ficción. El juego elige el bloque según el año que estás jugando.
   Claves = año ancla de cada era; se usa el bloque con año ≤ al jugado.
   ============================================================ */
const PERIODISTAS_POR_ERA = {
  1991: [ /* activos aprox. 1985-1998 (radio, diarios y TV de la época) */
    { n:"Julio Martínez", r:"relator/comentarista", m:"Canal 13 / Radio Cooperativa" },
    { n:"Sergio Livingstone", r:"comentarista", m:"TVN / Radio Agricultura" },
    { n:"Pedro Carcuro", r:"relator", m:"TVN" },
    { n:"Alberto Fouillioux", r:"comentarista", m:"Canal 13 / Radio Nacional" },
    { n:"Néstor Isella", r:"comentarista", m:"Canal 13" },
    { n:"Milton Millas", r:"relator/comentarista", m:"Mega / Radio Agricultura" },
    { n:"Marcelo González", r:"relator", m:"Mega" },
    { n:"Héctor Vega Onesime", r:"comentarista", m:"Mega" },
    { n:"Juan Manuel Ramírez", r:"relator", m:"Mega / Fox Sports" },
    { n:"Vladimiro Mimica", r:"relator", m:"CHV / UCV / radio" },
    { n:"Héctor Tito Awad", r:"comentarista", m:"CHV / radio" },
    { n:"Hans Marwitz", r:"relator", m:"Canal 13 / Radio Nacional" },
    { n:"Juan Ramón Cid", r:"relator", m:"TVN" },
    { n:"Nicanor Molinare", r:"relator", m:"VTR Cablexpress" },
    { n:"Mario Mauriziano", r:"comentarista", m:"VTR Cablexpress" },
    { n:"Patricio Yáñez", r:"comentarista", m:"VTR / Radio Portales" },
    { n:"Eduardo Bonvallet", r:"comentarista", m:"Radio Nacional / Chilevisión" },
    { n:"Carlos Campusano", r:"relator", m:"Radio Nacional" },
    { n:"Héctor Tito Garrido", r:"relator", m:"Radio Nacional" },
    { n:"Claudio Palma", r:"relator", m:"Radio Nacional / SKY" },
    { n:"Eugenio Cornejo", r:"comentarista", m:"radio / TV" },
    { n:"Fernando Solabarrieta", r:"periodista", m:"TVN" },
    { n:"Edgardo Marín", r:"periodista", m:"El Mercurio / revistas" },
    { n:"Danilo Díaz", r:"periodista", m:"radio / prensa" },
    { n:"Renato González (Mister Huifa)", r:"periodista", m:"Radio Cooperativa / prensa" }
  ],
  2003: [ /* activos aprox. 1998-2010 (SKY, Fox Sports, CDF, radios) */
    { n:"Claudio Palma", r:"relator", m:"SKY / Canal 13 / CDF" },
    { n:"Sebastián Tatán Luchsinger", r:"relator", m:"SKY / Chilevisión / ADN" },
    { n:"Pedro Carcuro", r:"relator", m:"TVN / Radio Agricultura" },
    { n:"Alejandro Lorca", r:"relator", m:"CDF" },
    { n:"Juan Manuel Ramírez", r:"relator", m:"Fox Sports" },
    { n:"Fernando Solabarrieta", r:"relator/periodista", m:"Fox Sports / Mega" },
    { n:"Aldo Schiappacasse", r:"comentarista", m:"Canal 13 / Fox Sports / CDF" },
    { n:"Rodrigo Sepúlveda", r:"comentarista", m:"SKY / Mega" },
    { n:"Rodrigo Astorga", r:"comentarista", m:"SKY" },
    { n:"Luka Tudor", r:"comentarista", m:"SKY" },
    { n:"Patricio Yáñez", r:"comentarista", m:"Fox Sports / CDF / Radio Bío Bío" },
    { n:"Mario Mauriziano", r:"comentarista", m:"Fox Sports / CDF" },
    { n:"Sergio Livingstone", r:"comentarista", m:"TVN / Radio Agricultura" },
    { n:"Alberto Fouillioux", r:"comentarista", m:"Canal 13" },
    { n:"Néstor Isella", r:"comentarista", m:"Canal 13" },
    { n:"Rodrigo Goldberg", r:"comentarista", m:"CDF / Radio Bío Bío" },
    { n:"Dante Poli", r:"comentarista", m:"CDF" },
    { n:"Claudio Borghi", r:"comentarista", m:"Fox Sports / CDF" },
    { n:"Juvenal Olmos", r:"comentarista", m:"Fox Sports / Agricultura" },
    { n:"Juan Cristóbal Guarello", r:"periodista", m:"Canal 13 / ADN / El Mercurio" },
    { n:"Claudio Bustíos", r:"periodista", m:"TVN / CDF" },
    { n:"Francisco Sougarret", r:"periodista", m:"SKY / CDF" },
    { n:"Jorge Cubillos", r:"periodista", m:"SKY / CDF" },
    { n:"Rodrigo Norambuena", r:"periodista", m:"SKY / Fox Sports" },
    { n:"Ernesto Díaz Correa", r:"relator", m:"Radio Cooperativa" }
  ],
  2015: [ /* activos aprox. 2010-2018 (CDF, Fox Sports, ESPN, radios) */
    { n:"Claudio Palma", r:"relator", m:"Canal 13 / Fox Sports / CDF" },
    { n:"Alejandro Lorca", r:"relator", m:"CDF" },
    { n:"Patricio Pini Vergara", r:"relator", m:"CDF" },
    { n:"Patricio Grillo Barrera", r:"relator", m:"CDF" },
    { n:"Ignacio Valenzuela", r:"relator", m:"Canal 13 / CDF" },
    { n:"Orlando Villagrán", r:"relator", m:"CDF" },
    { n:"Sebastián Tatán Luchsinger", r:"relator", m:"Chilevisión / ADN" },
    { n:"Aldo Schiappacasse", r:"comentarista", m:"Canal 13 / Fox Sports / CDF" },
    { n:"Manuel de Tezanos", r:"comentarista", m:"Fox Sports / CDF" },
    { n:"Rodrigo Goldberg", r:"comentarista", m:"Fox Sports / CDF / Cooperativa" },
    { n:"Patricio Yáñez", r:"comentarista", m:"CDF / Radio Agricultura" },
    { n:"Claudio Borghi", r:"comentarista", m:"Fox Sports / CDF" },
    { n:"Juvenal Olmos", r:"comentarista", m:"Fox Sports / CDF" },
    { n:"Dante Poli", r:"comentarista", m:"ESPN / Radio Futuro" },
    { n:"Marcelo Espina", r:"comentarista", m:"ESPN" },
    { n:"Rodrigo Sepúlveda", r:"comentarista", m:"Mega" },
    { n:"Fernando Solabarrieta", r:"periodista", m:"Mega / Fox Sports / CNN Chile" },
    { n:"Gonzalo Fouillioux", r:"comentarista", m:"CDF / TVN" },
    { n:"Francisco Sagredo", r:"periodista", m:"Fox Sports / Radio Agricultura" },
    { n:"Cristián Caamaño", r:"periodista", m:"Fox Sports / Agricultura" },
    { n:"Juan Cristóbal Guarello", r:"periodista", m:"Canal 13 / Agricultura" },
    { n:"Felipe Bianchi", r:"periodista", m:"Mega / Fox Sports" },
    { n:"Jorge Gómez Pelotazo", r:"periodista", m:"ESPN / CDF" },
    { n:"Rodrigo Herrera", r:"periodista", m:"Mega" },
    { n:"Waldemar Méndez", r:"comentarista", m:"CDF / Radio Duna" }
  ],
  2025: [ /* activos aprox. 2019-2026 (TNT Sports, ESPN, TV abierta, radios) */
    { n:"Claudio Palma", r:"relator", m:"TNT Sports / Chilevisión" },
    { n:"Alejandro Lorca", r:"relator", m:"TNT Sports" },
    { n:"Ignacio Valenzuela", r:"relator", m:"TNT Sports / Canal 13" },
    { n:"Patricio Pini Vergara", r:"relator", m:"TNT Sports" },
    { n:"Orlando Villagrán", r:"relator", m:"TNT Sports" },
    { n:"Patricio Grillo Barrera", r:"relator", m:"TNT Sports" },
    { n:"Rocío Ayala", r:"relatora", m:"TNT Sports / Radio ADN" },
    { n:"Rodrigo Sandoval", r:"relator", m:"TNT Sports" },
    { n:"Fabián Astudillo", r:"relator", m:"TNT Sports" },
    { n:"Ernesto Díaz Correa", r:"relator", m:"Radio Cooperativa" },
    { n:"Aldo Schiappacasse", r:"comentarista", m:"TNT Sports / Chilevisión" },
    { n:"Manuel de Tezanos", r:"comentarista", m:"TNT Sports" },
    { n:"Gonzalo Fouillioux", r:"comentarista", m:"TNT Sports / TVN" },
    { n:"Leonardo Burgueño", r:"comentarista", m:"TNT Sports" },
    { n:"Johnny Herrera", r:"comentarista", m:"TNT Sports" },
    { n:"Juvenal Olmos", r:"panelista", m:"TNT Sports" },
    { n:"Rodrigo Goldberg", r:"comentarista", m:"Radio Cooperativa / TNT" },
    { n:"Claudio Borghi", r:"comentarista", m:"ESPN" },
    { n:"Dante Poli", r:"comentarista", m:"ESPN / Radio Futuro" },
    { n:"Mauricio Pinilla", r:"comentarista", m:"ESPN / Radio Agricultura" },
    { n:"Jorge Valdivia", r:"comentarista", m:"ESPN / Radio ADN" },
    { n:"Marcelo Barticciotto", r:"comentarista", m:"Radio Cooperativa" },
    { n:"Sebastián Esnaola", r:"comentarista", m:"Cooperativa / ESPN" },
    { n:"Francisco Sagredo", r:"periodista", m:"ESPN / Radio Agricultura" },
    { n:"Fernando Solabarrieta", r:"periodista", m:"Chilevisión / CNN Chile" },
    { n:"Juan Cristóbal Guarello", r:"periodista", m:"Radio Agricultura / Canal 13" },
    { n:"Fernando Agustín Tapia", r:"periodista", m:"TVN" },
    { n:"Guillermo Santibáñez", r:"relator", m:"TVN" }
  ]
};
/* bloque de periodistas para el año jugado (usa la era ancla ≤ año) */
function bucketPeriodistas(anio){
  const keys=Object.keys(PERIODISTAS_POR_ERA).map(Number).sort((a,b)=>a-b);
  let pick=keys[0];
  keys.forEach(k=>{ if(k<=anio) pick=k; });
  return PERIODISTAS_POR_ERA[pick]||PERIODISTAS_POR_ERA[keys[keys.length-1]];
}
