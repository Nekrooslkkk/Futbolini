"use strict";
/* ============================================================
   FUTBOLINI · federacion.js  (7.78)
   Federación por PAÍS/época: una liga extranjera no debe hablar de la ANFP.
   Chile → ANFP; Argentina → AFA; se puede extender con más países.

   Cómo funciona sin editar mil textos: envolvemos `resolverTokens` (patrón de
   pulido.js) para LOCALIZAR el texto de decisiones/eventos al vuelo. En Chile
   NO cambia nada (cero riesgo para el contenido existente); solo cuando la
   partida es de otro país cambia ANFP→AFA, "Copa Chile"→"Copa Argentina", etc.

   Para agregar un país: sumá una entrada en FEDERACIONES y, si hace falta, un
   mapeo de época→país en `paisDeEra` (o seteá ERA[clave].pais desde el data file).
   ============================================================ */

var FEDERACIONES = {
  chile: {
    pais: "Chile", sigla: "ANFP",
    nombre: "Asociación Nacional de Fútbol Profesional",
    ascenso: "Primera B", copa: "Copa Chile"
  },
  argentina: {
    pais: "Argentina", sigla: "AFA",
    nombre: "Asociación del Fútbol Argentino",
    ascenso: "Primera Nacional", copa: "Copa Argentina"
  }
};

/* País de una época. Prioridad: 1) ERA[base].pais si el data file lo declara;
   2) heurística por la clave ("arg…" → argentina); 3) Chile por defecto. */
function paisDeEra(base) {
  if (base == null && typeof E !== "undefined" && E) base = E.eraBase;
  try {
    if (typeof ERA === "object" && ERA[base] && ERA[base].pais && FEDERACIONES[ERA[base].pais])
      return ERA[base].pais;
  } catch (e) {}
  var s = String(base == null ? "" : base).toLowerCase();
  if (s.indexOf("arg") >= 0) return "argentina";
  return "chile";
}
function federacionActual() { return FEDERACIONES[paisDeEra()] || FEDERACIONES.chile; }
function fedSigla()   { return federacionActual().sigla; }
function fedNombre()  { return federacionActual().nombre; }
function fedAscenso() { return federacionActual().ascenso; }
function fedCopa()    { return federacionActual().copa; }

/* Localiza un texto según el país de la partida. En Chile devuelve igual. */
function localizarFed(txt) {
  if (txt == null) return txt;
  if (paisDeEra() === "chile") return txt;
  var f = federacionActual();
  return String(txt)
    .replace(/ANFP/g, f.sigla)
    .replace(/Copa Chile/g, f.copa)
    .replace(/Primera B/g, f.ascenso);
}

/* Envolvemos resolverTokens: todo el texto de decisiones/eventos queda localizado
   sin editar cada string. Idempotente (no se envuelve dos veces). */
(function wrapFed() {
  if (typeof resolverTokens === "function" && !resolverTokens._fed) {
    var orig = resolverTokens;
    resolverTokens = function (t, E) { return localizarFed(orig(t, E)); };
    resolverTokens._fed = true;
  }
})();
