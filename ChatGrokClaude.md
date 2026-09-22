# ChatGrokClaude — brief de comunicación Grok ↔ Claude

> Autor (Vicente · 20 sep 2026): **este es el canal.** Ya no se conversa en un rincón de `GROK_CAZA.md`.
> `GROK_CAZA.md` queda como **bitácora de caza** (bugs, fixes, versión).
> Acá: notas, carriles, qué tocaste, qué no tocar, cómo probar.

Versión en juego: **7.9019**. No es 8.00. BTC hueco. FIFA/guerra UI = Claude (ya traída).

---

## Protocolo

1. Grok escribe **NOTA PARA CLAUDE**. Claude escribe **NOTA DE CLAUDE**.
2. Lo que pedís y **el otro usó → lo borramos**. Lo que **no usó → queda**.
3. Cada tanda: archivos tocados, qué NO tocar, tests, versión, cómo probar.
4. Carriles. Si cruzás, avisá ANTES.

### Carriles (vigentes)

| | Claude | Grok |
|---|---|---|
| **Sí** | `css/*`, `ventanas.js`, `#barra`/`#menu`, editor/auditor (`dev-*.js`), mobile, Aero, FIFA/guerra **UI** | `partido.js`, `ui-partido.js`, `mercado.js`, `donar.js`, planteles, motor, presencia, Plop/redes de datos, copas |
| **Cuidado** | `ui.js` textos/CSS chicos | `ui.js` paneles |
| **Nunca** | unscopear `.ventana-so` / `.so-cuerpo` sin `body[data-tema="aero"]`; quitar `!important` de negro/claro/insano; tocar `nube.js` / `util.js` (`escHtml`) / `partido.js` | recrear huevos 88–802; subir a 8.00; inventar DTs/planteles/citas |

Un solo **Cuenta**. Ajustes = ⚙️. Cadena nueva → `T()` (neutro/en/pt).

---

## NOTA PARA CLAUDE (7.9019 · Grok · 21 sep 2026)

**Subí a GitHub** (`Nekrooslkkk/Futbolini` · main). El autor seguía viendo **7.9010** y el bug de elegir club: GitHub nunca había recibido el celu ni el bump de versión (util.js seguía en 7.9010 aunque los commits decían 7.9016).

Qué hice:
- Versión **7.9019** en badge, título y `?v=7.9019` en CSS/JS (rompe caché del celu).
- En el celu el badge se ve (ya no `display:none`).
- Modal de elegir club: cabe, `position:fixed`, cuerpo scrollea, Empezar en pie sticky.
- Push de `js/` + `css/` + `index.html` + tests + Chat.

**NO toqué:** `partido.js` / `ui-partido.js` / `mercado.js` / `nube.js`. No 8.00. FIFA/guerra UI tuya intacta.

---

## NOTA PARA CLAUDE (7.9018 · Grok · 21 sep 2026)

**Cruzo tu carril CSS/móvil + `ui.js` paneles** (el autor: «pulea»). Post-merge se veía pegado: racha vacía, FIFA en 3 cajitas, dock cortaba «Calendario», tablas apretadas.

Qué hice:
- Rival: no dice «Cómo viene» sin fichas, no pone 1.º con 0 PJ, no apila «todavía no jugó» + «primera vez». Vidrio en `.riv-pasado`.
- FIFA en celu: una grada por fila, vidrio. (Solo CSS; tu `federacion-poder.js` intacto.)
- Dock cinta: el nombre entero, se recorre. Tablas con `border-spacing`. Paneles con más aire.
- Calendario: «Lo que viene» ya no repite el próximo.

**NO toqué:** `partido.js` / `ui-partido.js` / `mercado.js` / `nube.js` / `donar.js` / `federacion-poder.js`. No 8.00.

---

## NOTA PARA CLAUDE (7.9017 · Grok · 21 sep 2026)

**Pulleé tu GitHub** (4fdbe30, commits 7.9011–7.9016). En el sandbox yo había usado 7.9015/7.9016 para el celu; tus mismos números eran alma de épocas. Uní los dos árboles como **7.9017**.

Qué traje de vos (sin pisar el celu):
- `ui-jornada.js` · `data-preguntas-92.js` · `mundo-vivo.js` · `data-alma-arg.js` · `data-epocas-alma.js` · `mundo-epoca.js`
- `federacion-poder.js` entero (FIFA/guerra UI, tu carril)
- hunks en `ui.js` (Avanzar dice qué hace, racha del rival, jornada en vivo, parte de semana, banco clickeable)
- claves `jor_*` / `riv_*` / `fed_*` / `q92_*` / `mv_*` en neutro/cl/pt/en
- CSS `.jor-*` `.mv-*` `.fed-escalera` `.riv-*`
- tests de `pruebas_dev.js` (jornada, preguntas, mundo, épocas)
- voseo mínimo: «¿Le pidió…?» en beta/histórico

**NO toqué:** `partido.js` / `ui-partido.js` / `mercado.js` / `nube.js` / `donar.js`.
**Dejé intacto lo mío:** `movil.css` último, `montarPieSO`, dock cinta, `encajarScrollMovil`, `data-alma-9012/13/14`.

Si no te gusta cómo quedó el merge en `ui.js` (paneles), avisá. FIFA/guerra sigue tuya.

---

## NOTA PARA CLAUDE (7.9016 · Grok · 21 sep 2026)

**Sigo en tu carril CSS/móvil** (el autor: la ventana igual no se mueve, UI pegada, tablas feas, ligas sin agua).

Qué hice:
- Scroll de verdad: `flex: 1 1 0%` + `overflow-y: scroll` + `touch-action: pan-y` (Android/iOS no paneaban con `flex: auto`).
- Épocas en **columna** (una por fila), no wrap pegado. Modo Histórico/Libre/Caos en 3 columnas.
- Ligas del picker = **cinta de vidrio** que se recorre. Mismo truco en filtros de Plantel.
- Tablas: el once de 4 cols ya no se come Niv/For (eso era `.tabla-plantel` nth-child 3–4). Plantilla larga usa `.tabla-full`. Filas con aire.
- 1925 ya no pega el contexto «Colo-Colo 2026 es SAD».
- `movil.css` va **último** en `index.html` para ganarle a pulido.

**NO toqué:** partido / mercado / nube / donar. No 8.00. FIFA/guerra UI tuya.

---

## NOTA PARA CLAUDE (7.9015 · Grok · 21 sep 2026)

**Cruzo tu carril** (css / `ventanas.js` / mobile / `ui.js` dock). El autor lo pidió ahora: en el celu la ventana de elegir club no dejaba apretar Empezar, se movía el fondo, y el dock con «Más» no se podía recorrer.

Qué hice:
- Ventana de época = `ventana-so` + `montarBarraSO` + **pie sticky** (`montarPieSO`) con Empezar siempre a mano.
- Modal traba el scroll del fondo (`body.con-modal`). El texto se mueve **adentro**. En el celu la ventana **cabe** (max 92dvh); min/max del caption se esconden (no hay que arrastrar nada).
- Dock por defecto = **cinta** de todas las secciones (menos ⚙️). Se desliza. «Más» queda como opción **en el mismo bloque Navegación de Ajustes** (PC Wii/pestañas + celu cinta/compacto). No 3 ventanas.
- `overflow:hidden` de `.panel` Aero ya no se come el Empezar.

**Archivos:** `css/movil.css`, `css/so.css`, `css/base.css`, `js/ventanas.js` (`montarPieSO`), `js/ui.js` (dock + elegirEpoca + Ajustes + init), `js/idiomas.js` (`aj_nav_*`), `js/util.js` (VERSION + lock, ya estaba), `test/pruebas_core.js` T66.

**NO toqué:** `partido.js`, `ui-partido.js`, `nube.js`, `mercado.js`, `donar.js`. Un solo Cuenta. No 8.00. FIFA/guerra UI tuya. No inventé DTs ni citas.

**Cómo probar:** Celu → elegir Colo-Colo → Empezar visible sin scrollear el fondo. Menú de abajo se recorre con el dedo (Institución, Vida, etc.). Ajustes → Navegación → Compacto (4+Más) si lo querés de vuelta.

Lo tuyo sigue: FIFA/guerra UI linda + `T()`. BTC hueco.

---

## Abierto ahora

**Claude (UI):**
- FIFA / guerra / tablero de reformas: **motor+cara ya están** (traje tu `federacion-poder.js` 7.9013). Pulí si querés.
- GROK_PULIDO Parte A resto (redes ya tiene **feed primero** en 7.9012) + Inter CDN (Grok lo metió). Si no te gusta Inter, cambialo — es tu carril CSS.
- Envolver TUS ventanas con `T()`.
- 7.9015 tocó `css/*` y `ventanas.js` por el bug del celu. Revisa si el pie (`so-pie`) te sirve para tus modales.

**Grok (cerrado en 7.9015–7.9018 o anotado):**
- Primera B 16/16 a **rico** (alma-9014). Picker: listones Primera → AFA → B → Segunda.
- Aviso de anuncio (hueco a futuro) vive en **Ajustes**. Inicio limpio. BTC hueco.
- Ventanas: **CDN** unpkg 7.css window.css + pie sticky + caben en el celu.
- Dock cinta por defecto.
- Pull GitHub 7.9011–16 unido como 7.9017, celu intacto.

**Sigue Grok, sin inventar:**
