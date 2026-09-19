# BRIEF ULTRACODE — Escritorio (Claude Opus 4.8)
# Autor: Vicente · Grok lo redactó 19 sep 2026 · Futbolini 7.9005
# Pegá este archivo COMPLETO al inicio de la sesión Opus. Leé BRIEFING.md + PATCHES.md + GROK_CAZA.md después.

Sos Claude Code, Opus 4.8, exigencia ULTRACODE. No improvisás producto. No reconstruís el juego. Expandís sobre lo que ya existe. Entregás ventanas que se sienten institución, no Excel, con cromo Frutiger Aero / Windows Vista 7 (azul vidrio + orbe verde). Español chileno de tú. Cero voseo rioplatense (-ás/-és) salvo voz de club argentino. Toda cadena visible nueva pasa por `T("clave","fallback neutro")` y se agrega en `FRASES.neutro` + `FRASES.en` + `FRASES.pt` (+ `cl` si es voz de cancha).

No es 8.00. BTC sigue hueco. Segunda 2026 = cantera, no inventás nombres. No unscopeás `.ventana-so` / `.so-cuerpo` sin `body[data-tema="aero"]`. No quitás `!important` de negro/claro/insano. CDN: solo si ya está vendorizado local (`css/vendor/7-window.css`) o podés copiarlo offline al repo (MIT/gratis) como hiciste con 7.css. Nada de npm, React, build.

---

## 0. CARRILES (si los cruzás, se rompe el hilo)

### TUYO (hacelo ahora)
Escritorio, ventanas SO, CSS Aero de esas ventanas, Historia UI, metas UI, ayudante UI, decisiones-sobre-la-mesa UI, “lo que pasó esta semana” UI, once probable UI, “atiende antes de avanzar”, animaciones de ESA sección, noticias/titulares de club, i18n de lo que toques, FIFA/guerra UI (sigue pendiente).

Archivos que PODÉS tocar:
- `js/ui.js` — `vistaEscritorio`, `abrirDecision`, `pendientesAtender`, `modalAtiende` (el escritorio vive acá; CHECKLIST decía “coordinar con Grok”: **esta orden del autor te habilita el escritorio**).
- `js/ia.js` — `preguntarAyudante` (hoy es un `indexOf` de keywords; hay que hacerlo útil).
- `js/storylines.js` — `panelStoryline` / capítulos.
- `js/ventanas.js`, `css/aero.css`, `css/so.css` (scoped), `css/base.css` (solo si el escritorio lo pide), `js/idiomas.js` (claves nuevas).
- Datos de UI: `js/data-voz-76.js` (titulares que se repiten), pools de titulares si existen.
- Editor / asociación / mobile: lo tuyo de siempre.

### DE GROK (NO lo toques. Reportá el hueco en GROK_CAZA.md)
- `js/partido.js`, `js/ui-partido.js`, `css/gol.css` — motor de partido, arco, córner, VAR, tanda, “más 3D”. **El autor pidió mano que tapa el penal, palo, córner que no siempre es gol.** Eso es mío. No lo implementés.
- `js/mercado.js`, `js/nube.js`, `js/util.js` (escHtml / VERSION).
- Pool de fichajes 24/7 conectado a todos los campeonatos: **mío**. No armes un mercado paralelo.
- Efectos de motor que cambian el calendario del AÑO QUE VIENE, mods permanentes, flags de barra/público: si necesitás un gancho, **escribí la firma** (`E.flags.X` / `E.mods[]`) en GROK_CAZA y lo cableo. No inventés un segundo motor.

Si A depende de B y B es mío: dejá el gancho, no el invento.

---

## 1. QUITAR “Tu situación” / “El club hoy” del escritorio

Hoy: `vistaEscritorio` (ui.js ~684) pinta `panel("El club hoy")` con `SITUACION_CLUB[E.club]` en la columna derecha. Es un párrafo genérico que tienen TODOS los clubes. No merece ventana propia.

Hacer:
1. Borrar ese panel del escritorio. Cero duplicado (CHECKLIST ya marcó uno; este es el que queda).
2. Mover el texto a **Historia**, capítulo **2026 / “Hoy”** de ESE club (`HISTORIA_LINEA[id]`, hito `"Hoy"`). Si el club no tiene línea 2026, creá el hito Hoy con `SITUACION_CLUB` (no inventes hechos: reusá el string).
3. Ahí sí: contexto de por qué estás en el club. En el escritorio, no.

DoD: Colo-Colo, un club de B, un argentino 2026, un 1991. Escritorio sin “El club hoy”. Historia 2026 muestra el párrafo.

---

## 2. Once probable del rival — niebla + 100.000 (no millones)

Hoy: `vistaEscritorio` → details “👁️ Ver el once probable” lista los 11 con **nombre + pos + nivel**. Demasiada info, gratis.

Hacer:
- Vista gratis: **3–5 nombres visibles** (los obvios: ídolo / más nivel / real●). El resto: `???????` + posición. SIN nivel, o un rango grosero (“68–74”) como mucho en los visibles.
- Botón **“Informe completo · $100.000”** (cien mil, `plata(100)`, no millones). Cobra `aplicarEfectos({plata:-100})` si hay caja. Si no hay, el botón se deshabilita y dice por qué.
- Pagado: se revela el XI completo (nombre, pos, nivel, ● real). Flag por rival+fecha para no cobrar dos veces el mismo informe (`E.flags.scouting["CC|UCH|idx"]`).
- Copy: “Es una lectura estimada. La formación final puede cambiar.”

DoD: sin pagar ves huecos. Con 100k ves todo. Caja baja 100. Segundo click al mismo rival no cobra.

---

## 3. “Atiende antes de avanzar” — que LLEVE y MARQUE

Hoy: `pendientesAtender` arma `{t:"3 decisiones urgentes sin resolver", d:"En Decisiones sobre la mesa.", ir:"escritorio"}`. El click hace `irA("escritorio")`. Aterrizás en el mismo escritorio, sin saber cuál es, sin scroll, sin highlight.

Hacer:
- El item de decisiones urgentes debe **abrir la primera urgente** (`abrirDecision(decisionPorId(urg[0].id), true)`), no ir al escritorio genérico.
- En el listado de “Decisiones sobre la mesa”, esa decisión lleva clase `dec-urgente` (borde alerta, scrollIntoView).
- Si el pendiente es meta en riesgo → scrollea a la tarjeta de esa meta y la marca.
- Si es sueldos / tribuna / moral → `irA` a la sección REAL (`finanzas` / `institucion`) como ya está, pero el destino pinta un highlight 2s.
- `modalAtiende` (el del botón Avanzar) usa la misma lógica. “Avanzar igual” se queda.

DoD: click en “3 decisiones urgentes…” abre la primera decisión, no recarga el escritorio. La mesa la tiene marcada.

---

## 4. Historia del club — capítulos con peso, no folleto

Hoy: `panelStoryline` + `modalStoryline` en `storylines.js`. Las decisiones de historia a veces preguntan **precio de entradas** como si fuera el alma del club. El autor:

- Precio de entradas **NO** es capítulo de historia. Es decisión de **partido / próximos partidos**, mientras no se vuelva a exigir o la caja no dé. Sacalo del arco histórico. Si ya está sembrada, reencauzala a `decPend` de tipo partido (o reportame el id y lo muevo).
- Cada capítulo que el jugador resuelve **cambia el presente**: flag, mod, grupo, moral, obligación. Si elige X, más adelante un “¿cambiamos Y?” puede **bloquearse** porque quedó una obligación viva (`E.mods` permanente o `E.flags.obligacion_X`).
- Más capítulos por club 2026, con peso. No inventes citas de personas reales. Ficción declarada. Vara = Colo-Colo: si un club no tiene arco, no copies el de Colo-Colo con el nombre cambiado.
- Historia 2026 incluye el párrafo de situación (punto 1).

DoD: elegir un capítulo deja un `E.flags` o `E.mods` que otra decisión/meta/UI lee. Precio de entradas no aparece como “historia del club”.

---

## 5. “Lo que se espera de ti” — tocas la meta y te LLEVA a resolverla

Hoy: click en la tarjeta togglea `.obj-porque` (un texto 💡). El autor: **mantené las metas**, pero el click **indica el camino**, no un párrafo de ayuda.

Hacer:
- Click en una meta = acción. Ejemplos:
  - Meta deportiva (puntos/posición) → scrollea a Próximo compromiso / pizarra.
  - Meta económica → `irA("finanzas")`.
  - Meta institucional (hinchada/socios) → `irA("institucion")`.
  - Meta en riesgo → además abre el ayudante con esa meta precargada (punto 6).
- El 💡 `porque` puede quedar en un chevron, secundario. El acto principal es NAVEGAR.
- Si la meta está cumplida, el click no molesta: muestra el estado y listo.

DoD: click en meta en riesgo no solo muestra texto; te deja en la pantalla donde se empuja esa meta.

---

## 6. Ayudante — útil de verdad, no un detector de 4 palabras

Hoy: `preguntarAyudante` en `ia.js` es una cascada de `indexOf`. El chat “escribe lo que quieras” es mentira. El autor lo llama absurdo. Tiene razón.

Hacer, SIN llamar a una API de pago (offline, local, como el resto):

A. **Acciones, no solo texto.** El ayudante propone botones que HACEN:
   - Armar el once / abrir pizarra (`irA` previa o plantel).
   - Subir moral: atajo a charla con capitán / gesto de camarín si existe; si no, el botón que ya reconquista en Institución.
   - Cambiar lesionados: listar los `j.lesion` y llevar a plantel con esos nombres marcados.
   - Ordenar el equipo: lectura del plan (ya existe `lecturaPlan`) + botón a la pizarra.
   - Meta en riesgo: el mismo destino del punto 5.

B. **El input de texto se queda**, pero el parser tiene que:
   - Tokenizar (no 4 keywords). Sinónimos chilenos: *caja, luca, prestamo, pizarra, once, volante, arco, barra, popular, DT, cantera, liguilla, copa*.
   - Combinar 2 temas (“cómo armo el once con los lesionados”) → respuesta que menciona ambos + botones de los dos.
   - Si no pilla nada: no inventes un consejo genérico. Decí “no te pillé, ¿es del once, de la caja, de la meta o del rival?” y mostrá chips.
   - Cero voseo. Tú.

C. Es el mismo ayudante que explica las metas (punto 5). Un cerebro, dos entradas.

DoD: escribir “los lesionados y el once” devuelve nombres reales del plantel + un botón que abre plantel. “subir la moral” no es un párrafo: es un camino clickeable.

---

## 7. Decisiones sobre la mesa — “él elegiría” vs 🔥/😐/🧊

Hoy: botón “🧑‍🏫 Pedir pista al ayudante” (máx 3/año) marca caliente/frío/tibio en TODAS las opciones (`puntajeOpcion`).

Hacer:
- **Caliente / tibio / frío: SIEMPRE visibles**, sin gastar al ayudante. Es lectura del club, no un poder. El jugador decide igual.
- El botón del ayudante (sigue el cupo 3/año si querés, o sacalo del cupo: el autor pidió que sea “él elegiría”) pasa a: **“🧑‍🏫 Él elegiría esta”**. Marca UNA opción (la de `puntajeOpcion` máximo que cumpla requisito). Copy: “El ayudante se la jugaría acá. Decides tú.”
- No es un tooltip de temperaturas. Es una recomendación única.

DoD: abrís una decisión y ya ves 🔥😐🧊. El botón del ayudante señala UNA. No hace falta pedirlo para ver las temperaturas.

---

## 8. Filosofía: las decisiones PESAN en el presente y se pueden revertir

El autor, textual: *“si te enojás con la barra y por eso viene menos gente, que se note po, que puedas cambiarlo”*. *“Las decisiones DEBEN ser cambiables como filosofía.”* *“Si habla de algo a futuro y no pasa, es una idiotez.”*

Tuyo (UI + flags que ya existan):
- Toda decisión que muestre un efecto (“la barra viene menos”) tiene que **leerse en una UI viva**: público del próximo partido, panel Institución, “El club no olvida”, modificadores activos. Si el efecto no tiene UI, no lo prometas en el copy.
- Añadí, donde el motor YA tenga el flag, un control para **deshacer / negociar** (gesto con la barra, bajar precio, disculpa pública) — una decisión posterior, no un undo mágico.
- Ordená `E.decPend` por club y por arco (storyline id, buzón, peso), no por orden de siembra random. Agrupá visualmente: Historia del club / Partido / Institución / Plata.

Mío (reportame ids):
- Si una decisión dice “el próximo año tenés mal horario” y el calendario del año siguiente NO cambia, es un bug de motor. Anotá el `id` de la decisión en GROK_CAZA. Yo cableo `construirCalendario` del año N+1 con `E.flags.fixtureHostil`.
- Efectos de público/barra que no están en `ingresoPartidoLocal`: igual, pasame el id.

DoD: una decisión de “te pelease con la barra” baja un número que el jugador VE (hinchada, aforo o taquilla) y existe un camino para revertirlo. El copy no promete el 2027 si el 2027 no lee el flag.

---

## 9. “Lo que pasó esta semana” — menos ruido, más club

Hoy: `E.bandeja` (7) + `titularesSemana()`. El titular **“El VAR dibujó la raya con el codo”** (`data-voz-76.js` `noticia_chiste`) sale TODO el rato y no tiene que ver con el club.

Hacer:
- Ese chiste entra a un pool grande, **con cooldown**. No dos semanas seguidas. Peso bajo.
- Titulares atados al club: próximo rival, lesión real del plantel, decisión que tomaste, copa que jugás, posición real. Usá `E.clubNombre`, `proximoPartido()`, `memoriaReciente()`, goleador. Cero “el VAR” si tu club no tuvo VAR esa semana.
- No llenes. 3–5 ítems buenos > 12 genéricos.
- Cada titular, si es accionable, es clickeable (al partido, a la decisión, a finanzas).

DoD: 10 semanas simuladas de Colo-Colo 2026. El chiste del VAR aparece ≤ 1 vez. Aparecen al menos 6 titulares que mencionan al club o al rival de esa semana.

---

## 10. Aero de TODA la sección escritorio

- Cada panel de `vistaEscritorio` es `.ventana-so` consistente (no a medio camino entre flat y vidrio).
- Animaciones Vista: entrada suave de ventanas, hover aqua, orbe, glass. `body.perf` y `prefers-reduced-motion` las apagan.
- Temas negro / claro / insano: no se rompen (el bug del negro-blanco ya se pagó). Todo scoped o con `body[data-tema]`.
- Mobile 390px: 0 overflow. Probá Escritorio, Historia, Decisiones.
- CDN: si sumás 7.css extra o webfont, **vendorizá** a `css/vendor/` (MIT). Offline real. Como el 7-window.css.

DoD: escritorio en aero se siente Vista. En negro no se pone blanco. En 390px no hay scroll horizontal.

---

## 11. FUERA DE ALCANCE (Grok lo toma; no lo implementés)

El autor también pidió, en el mismo mensaje:
1. Partido más detallado / “más 3D”: mano que tapa el penal, palo, córner que no siempre es gol.
2. Mundo de fichajes 24/7 conectado a todos los campeonatos.

Eso es **partido.js / ui-partido.js / mercado.js**. Si lo tocás, pisamos. Dejá una línea en GROK_CAZA: “autor pidió X, Grok lo tiene”. FIFA/guerra UI sí es tuyo.

---

## 12. PROTOCOLO DE ENTREGA

1. Leé este brief + BRIEFING.md + PATCHES.md + GROK_CAZA.md. No asumas.
2. Un commit por bloque (1–3, 4–6, 7–9, 10) o uno solo si es coherente. Mensaje en español, como el repo.
3. `T()` en todo string nuevo. Chilensis sin voseo.
4. No toques `nube.js` / `partido.js` / `util.js` / `ui-partido.js` / `mercado.js`.
5. No metas Ajustes ni Cuenta otra vez en el lateral. Ajustes = solo ⚙️. Un solo botón Cuenta arriba.
6. Al final, 8 líneas en GROK_CAZA:
   - archivos tocados
   - funciones nuevas/cambiadas
   - ganchos que Grok debe cablear (firma + id)
   - cómo probar (club + click path)
   - qué NO hiciste a propósito
7. Si un club 2026 no tiene dato: no inventes. Cantera / omití el capítulo.

Criterio de hecho del autor: se NOTA. No un refactor invisible. Ventanas que pesan, decisiones que muerden, ayudante que lleva, noticias del club, Aero de verdad.
