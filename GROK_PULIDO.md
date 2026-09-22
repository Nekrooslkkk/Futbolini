# BRIEF DE PULIDO — para Grok (lo preparó Claude Opus 4.8 · 20 sep 2026 · Futbolini 7.9006)
# Pedido del autor (Vicente): "ordená las ventanas de cada sección y empezá a usar la opción de
# internet (CDN, cosas free) para subir el nivel de pulido del juego."
# Pegá este archivo al inicio de tu sesión, junto con BRIEFING.md + PATCHES.md + ChatGrokClaude.md.

> **Nota de carril (importante):** ordenar ventanas y vendorizar assets es, por acuerdo previo,
> el carril de Claude (CSS/ventanas/mobile). El autor te lo asignó ahora — dale — pero **coordinemos
> para no pisarnos**: si vas a tocar `css/so.css` / `css/aero.css` / `css/base.css` / `js/ventanas.js`,
> dejá una línea en tu NOTA PARA CLAUDE antes, o decime y lo hago yo. Reglas inviolables abajo.

---

## REGLAS (actualizadas por el autor: CDN en vivo SÍ, dale)
- **CDN en vivo está OK.** El autor levantó la restricción de offline para pulido: podés usar
  `<link>`/`<script>` a un CDN reputado (Google Fonts, jsDelivr, cdnjs, unpkg) directo en `index.html`.
  No hace falta vendorizar todo. Si algún asset lo querés dejar copiado local igual (como el 7.css ya
  vendorizado), bien, pero **no es obligatorio**. Cortala con la paranoia offline.
- **Solo cosas FREE:** MIT, OFL (fuentes), Apache-2.0, CC0/CC-BY. Nada de pago ni con marca de agua.
- **Sigue: vanilla, sin build, sin npm, sin React.** Un `<link>`/`<script src>` a CDN es un tag en el
  HTML, no un `npm install`. Eso está permitido; un pipeline de build no.
- **No unscopear `.ventana-so` / `.so-cuerpo`** sin `body[data-tema="aero"]`. No quitar `!important` de negro/claro/insano.
- **No tocar** `js/util.js` (`panel()`/`el()`/`escHtml`/VERSION); avisá si sumás `<script>` al orden de carga.
- Cadena visible nueva → `T("clave","fallback")` en `neutro`+`en`+`pt` (+`cl` si es voz de cancha).
- Peso con cabeza: no traigas una librería de 2 MB para un ícono. Free y liviano, pero sin miedo al CDN.

---

## PARTE A — ORDENAR LAS VENTANAS DE CADA SECCIÓN

**El problema:** cada `vista*` apila sus paneles en orden histórico de parche, no por lo que el jugador
necesita ver primero. Se siente desordenado sección a sección.

**El principio (aplicalo parejo a todas):**
1. **Lo accionable / el contexto de AHORA** primero (lo que el jugador vino a hacer).
2. **El estado** (números, indicadores) al medio o a la derecha.
3. **Lo secundario / memoria / histórico** al final.
En pantalla ancha es `rejilla dos` (izquierda = acción, derecha = estado). En 390px colapsa a una columna:
el orden del DOM manda, así que ordená pensando en el móvil.

**Referencia ya hecha (Claude, 7.9006):** el **Escritorio** quedó ordenado así — copiá el criterio:
- Izquierda: Próximo compromiso → Atiende antes de avanzar → Historia (arco) → Metas → Ayudante → Decisiones (agrupadas Partido/Institución/Plata) → Lo que pasó esta semana.
- Derecha: Estado del club → Modificadores → Temporada → El club no olvida.

**Secciones a ordenar** (`js/ui.js`, funciones `vista*`): `institucion`, `finanzas`, `plantel`,
`mercado`, `estadio`, `redes`, `calendario`, `historia`, `carrera`. Orden sugerido por sección:
- **Institución:** Capital → Jugadas de poder → **La Asociación (ANFP/AFA)** (ya la inserté tras Jugadas de poder) → Grupos → Estatutos → Mesa de la barra → Interacción directa.
- **Finanzas:** resumen caja/deuda (acción: pagar/renegociar) → ingresos/egresos → precios/aforo → proyección.
- **Plantel:** el once/pizarra (acción) → lista con estado (lesión/forma/moral) → cantera → detalles.
- **Mercado:** objetivos/ofertas (acción) → tu plantel vendible → mundo de fichajes → cesiones.
- **Estadio:** aforo/obras (acción) → sectores/precios → ingreso estimado próximo partido.
- **Redes/Plop:** feed (acción: responder) → tendencias → tu perfil.
- **Calendario:** próximo compromiso → calendario del año → copas del año → copas del país.
- **Historia:** Línea del club → Época 2026/1991 (incluye **"El club hoy"**, ya lo puse) → contexto real.
- **Carrera:** mandato/objetivos del cargo → ofertas de otros clubes → historial/dinastía.
**DoD:** cada sección abre con lo accionable arriba; el orden es el mismo criterio en las 10; 390px sin overflow; negro/claro/insano intactos.

---

## PARTE B — ASSETS FREE DE INTERNET / CDN (pulido visual)

**La idea del autor:** usar internet para traer cosas free que suban el nivel visual. **Directo por CDN
está bien** — es la forma más rápida. Vendorizar (copiar local) es opcional, para lo que quieras blindar.

**Receta rápida (CDN en vivo):**
1. Sumás el `<link>`/`<script src>` del CDN reputado en `index.html`, con el resto de los assets.
2. Lo usás en `css/aero.css` / `so.css` (font-family, clases del icon set, etc.).
3. Probás que se ve y no rompe temas ni 390px. Listo.

**Candidatos con onda (elegí, no metas todo):**
- **Tipografía Vista → `Segoe`-like:** Windows Vista/7 usaba **Segoe UI**. Free y con la misma vibra:
  **`Selawik`** (MIT, sustituto métrico de Segoe UI) o, por Google Fonts CDN, **`Inter`** / **`Open Sans`**
  / **`Nunito Sans`**. Un `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700">`
  y `font-family:"Inter",…` en el body. *Impacto: altísimo*, todo el juego sube de nivel de una.
- **Iconos:** el juego usa emoji (gratis, universal). Si querés vectoriales para el chrome:
  **Lucide** o **Tabler** (MIT) — por CDN o SVG inline, como te acomode.
- **Micro-animaciones / glass:** **animate.css** (MIT, CDN) para entradas suaves, o seguí con CSS puro
  (ya hay aurora/pasto en `aero.css`). Para el vidrio: `backdrop-filter`, no imágenes.

**Único cuidado real:** que sea FREE (MIT/OFL/Apache), reputado (Google Fonts, cdnjs, jsDelivr, unpkg),
por HTTPS, y que no rompa negro/claro/insano ni 390px. El 7.css ya vendorizado seguí cargándolo local
(no lo muevas a CDN, ya está y funciona).

**DoD:** se ve mejor de verdad; los 4 temas ok; 390px sin overflow; nada de pago; sin build/npm.

---

## ENTREGA
- Un commit por parte (A y B), mensaje en español como el repo.
- Al terminar, dejá tu **NOTA PARA CLAUDE** en `ChatGrokClaude.md`: archivos, qué vendorizaste + licencia, qué no tocaste, cómo probar, versión. Yo lo visto y sigo con FIFA/guerra UI (mi pendiente).
- Si algo de esto se cruza con `so.css`/`aero.css`/`ventanas.js` y preferís que lo haga yo, decilo y lo tomo.
