# BRIEF DE PULIDO — para Grok (lo preparó Claude Opus 4.8 · 20 sep 2026 · Futbolini 7.9006)
# Pedido del autor (Vicente): "ordená las ventanas de cada sección y empezá a usar la opción de
# internet (CDN, cosas free) para subir el nivel de pulido del juego."
# Pegá este archivo al inicio de tu sesión, junto con BRIEFING.md + PATCHES.md + GROK_CAZA.md.

> **Nota de carril (importante):** ordenar ventanas y vendorizar assets es, por acuerdo previo,
> el carril de Claude (CSS/ventanas/mobile). El autor te lo asignó ahora — dale — pero **coordinemos
> para no pisarnos**: si vas a tocar `css/so.css` / `css/aero.css` / `css/base.css` / `js/ventanas.js`,
> dejá una línea en tu NOTA PARA CLAUDE antes, o decime y lo hago yo. Reglas inviolables abajo.

---

## REGLAS QUE NO SE ROMPEN (o rompés la beta)
- **Vanilla JS, sin build, sin npm, sin React.** Corre abriendo `index.html`.
- **OFFLINE de verdad.** Si se corta internet, el juego funciona igual. → Ningún `<link>`/`<script>`
  a un CDN en vivo. Todo asset externo se **VENDORIZA**: se copia al repo (`css/vendor/…`) y se
  referencia local. Precedente exacto: `css/vendor/7-window.css` (26 KB, MIT, cargado por
  `js/ventanas.js` con `AERO_7_WINDOW="css/vendor/7-window.css"`).
- **Solo licencias libres:** MIT, OFL (fuentes), Apache-2.0, CC0/CC-BY con atribución. Nada propietario.
- **No unscopear `.ventana-so` / `.so-cuerpo`** sin `body[data-tema="aero"]`. No quitar `!important` de negro/claro/insano.
- **No tocar** `js/util.js` (`panel()`/`el()`/`escHtml`/VERSION), ni el orden de carga de `index.html` sin avisar.
- Cadena visible nueva → `T("clave","fallback")` en `neutro`+`en`+`pt` (+`cl` si es voz de cancha).
- Peso: el juego es liviano. Cada asset vendorizado, lo mínimo (subset de fuente, no la familia entera).

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

## PARTE B — ASSETS FREE DE INTERNET, VENDORIZADOS OFFLINE (pulido visual)

**La idea del autor:** usar internet para traer cosas free que suban el nivel visual. **La forma correcta:**
bajar el asset MIT/OFL, copiarlo al repo, referenciarlo local. Nunca cargar de un CDN en vivo.

**Receta (idéntica a como quedó el 7.css):**
1. Bajar el archivo del asset libre (fuente `.woff2`, css, svg) a `css/vendor/…` (fuentes en `css/vendor/fonts/`).
2. Declararlo local en un css vendorizado (ej. `css/vendor/tipografia.css` con `@font-face { src:url("fonts/xxx.woff2") }`).
3. Sumar el `<link>` en `index.html` **apuntando al archivo local**, con el resto de los css.
4. **Probar offline:** cortar red / bloquear el dominio original y confirmar que carga igual (así verifiqué el 7.css).
5. Anotar la licencia en el header del archivo vendorizado.

**Candidatos seguros y con onda (elegí, no metas todo):**
- **Tipografía Vista de verdad → `Selawik` (MIT, de Microsoft):** es el sustituto métrico-compatible de
  **Segoe UI** (la fuente de Windows Vista/7). Encaja PERFECTO con el Frutiger Aero del juego y es MIT.
  Alternativas OFL: `Inter`, `Open Sans`. Vendorizá solo los pesos que uses (400/600/700), subset latino.
  *Impacto:* altísimo. Todo el juego pasa de la fuente de sistema a la estética Vista real.
- **Iconos:** el juego usa emoji (universal, gratis, cero peso). Si querés íconos vectoriales para el chrome,
  `Lucide` o `Tabler` (MIT, SVG inline — no CDN). Poné solo los SVG que uses, inline. No traigas la librería.
- **Texturas glass/aurora:** preferí **CSS puro** (gradientes/`backdrop-filter`) antes que imágenes. Ya hay
  aurora/pasto en `aero.css`. Un `.woff2` de fuente rinde más que cualquier textura.

**Lo que NO:** Google Fonts por `<link>` a fonts.googleapis.com (eso es CDN en vivo → rompe offline y filtra
IP). Font Awesome por CDN. Ninguna librería JS por CDN. Nada que pida build/npm.

**DoD:** el asset carga con la red cortada; licencia anotada; peso razonable (una fuente subset ≈ 20–60 KB por peso);
negro/claro/insano no se rompen; 390px ok.

---

## ENTREGA
- Un commit por parte (A y B), mensaje en español como el repo.
- Al terminar, dejá tu **NOTA PARA CLAUDE** en `GROK_CAZA.md`: archivos, qué vendorizaste + licencia, qué no tocaste, cómo probar offline, versión. Yo lo visto y sigo con FIFA/guerra UI (mi pendiente).
- Si algo de esto se cruza con `so.css`/`aero.css`/`ventanas.js` y preferís que lo haga yo, decilo y lo tomo.
