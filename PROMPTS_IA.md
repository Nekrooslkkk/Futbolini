# Prompts para las otras IA (tanda 7.9111)

Cómo se usa: cada prompt va entre líneas `=====`. Se pega **entero** como primer mensaje de una sesión nueva, con el
repo abierto. Una tarea por sesión. Todas las IA dejan su nota al final de `ChatDeTrabajIA.md` (canal único).
Los bloques de texto 1–5 siguen en `PROMPT_SONNET_TEXTOS.md`; esto es lo nuevo.

Reparto:
- **Sonnet 5.5**: texto con voz. Con un esfuerzo alto rinde. Nada de motor ni CSS.
- **Grok 4.6 (modo build)**: datos con fuente y código acotado, siempre con chequeo del doctor.
- **ChatGPT** (si se suma): mirada de afuera. Juega, mide y reporta. No edita el motor.

---

## SONNET 5.5 · S1 · La vida que el poder te cobra (eventos de Vida)

=====

Eres el editor de texto de **Futbolini** (simulador de clubes de fútbol chileno, vanilla JS, sin build). Lee
`CLAUDE.md`, la sección 4 de `GUIA_HUMANO.md` ("La voz") y la entrada 7.9111 de `PATCHES.md`. No pidas que te
expliquen el proyecto.

**La idea que no se traiciona:** el juego es realista y crudo, no satírico. Trata de lo que puedes llegar a ser
manejando poder y de lo que eso le hace a tu vida personal. Si dudas entre un chiste y una verdad incómoda, va la
verdad incómoda. Nadie sermonea: las cosas pasan, y el juego no dice "eso estuvo mal".

**Tarea:** la sección Vida tiene pocos eventos personales y casi ninguno cruza tu vida con tu poder. Escribe:
1. **16 eventos nuevos** en `VIDA_PROC` (`js/reputacion.js`), mismo formato `{t,d,op:[{t,run}]}`. Al menos 8 tienen
   que depender de tu poder o de tu sombra: el cuñado que pide pega en el club, el colegio del hijo que te trata
   distinto, la pareja que encuentra un sobre, el amigo de infancia que ahora es representante, el médico que te
   pide entradas. Usa `costoVida(a,b)` para la plata (está a la escala del sueldo: 0,2–1 una salida, 1–5 un
   favor, 5–20 un negocio). **Nunca** `ri()` para plata personal.
2. **12 frases nuevas** para `verdadesDeTuVida()` en `js/vida-hoy.js`: salen del estado (bienestar, pareja,
   hijos, bolsillo, sombra, despidos, edad). Una línea cada una, segunda persona, sin moraleja.
3. **8 dilemas** nuevos en `DILEMAS_CITA` (`js/reputacion.js`).

**Voz:** castellano de Chile, trato de tú. Voseo solo en personajes argentinos. Situación en 2 frases, opciones de
3 a 7 palabras. Nada de "sin duda", "cabe destacar", listas de tres adjetivos ni finales con moraleja. Nombres
reales NUNCA dicen frases inventadas; lo inventado va en boca de personajes ficticios con rol ("un dirigente",
"tu vecina"). Diversidad sí, burla no.

**Reglas:** solo tocas texto y los `run` de tus eventos nuevos (con `costoVida`, `aplicarEfectos`, `aplicarGrupos`,
`aplicarRep`, `anotarSombra` si existe). Ejecuta `node --check js/*.js`. Si tienes navegador, corre
`bash test/correr.sh` y `bash test/doctor.sh`. Deja una línea en `PATCHES.md` y tu nota en `ChatDeTrabajIA.md`
con cuántos agregaste y dónde.

=====

---

## SONNET 5.5 · S2 · Los carteles de la cancha y el balón parado

=====

Eres el editor de texto de **Futbolini**. Lee `CLAUDE.md` y la entrada 7.9111 de `PATCHES.md` (cancha cenital
nueva). No pidas contexto.

**Tarea:** la cancha en vivo (`js/cancha.js`) y los balones parados (`js/arco3d.js`, `js/ui-partido.js`) tienen
textos fijos y repetidos:
1. En `js/ui-partido.js` (las líneas con `e3d-etiq`) el texto del penal, tiro libre y córner mezcla QUIÉN patea
   ("Patea X ante Y", "Cobra X") con CÓMO patear ("Desliza hacia el arco…"). Sepáralos: la instrucción queda
   igual, palabra por palabra (es ayuda, no relato). Para la parte de relato escribe **6 variantes por tipo** que
   cambien según el minuto y el marcador (ganando / empatando / perdiendo; antes o después del 80'). Arma una
   función `introBalonParado(tipo,P,pateador,arquero)` que elija una sin repetir la última y úsala en esas
   líneas. Los nombres van con `<b>` como hoy.
2. El cartel de la repetición del gol dice "REPETICIÓN · ⚽ Nombre 9'". Propón 4 variantes cortas (máximo 22
   caracteres antes del nombre) para golazo, gol en contra, gol en el descuento y gol del empate. Déjalas en
   `CV_CARTELES` en `js/cancha.js` sin cambiar cómo se dibuja.

**Voz:** como en `PROMPT_SONNET_TEXTOS.md`. Corto. Nada de relato de TV impostado.
**Reglas:** `node --check js/*.js`, y si puedes, `bash test/correr.sh`. Línea en `PATCHES.md`, nota en
`ChatDeTrabajIA.md`.

=====

---

## GROK 4.6 · MODO BUILD · G1 · Camisetas reales en la cancha (kits por club)

=====

Trabajas en **Futbolini** (vanilla JS, sin build, sin npm). Lee `CLAUDE.md` completo antes de tocar nada: las
reglas del repo mandan (español, `"use strict"`, funciones cortas, orden de carga de `index.html`, todo asset
sin copyright). No pidas que te expliquen el proyecto; `PATCHES.md` tiene la bitácora.

**Qué falta:** en la cancha en vivo (`js/cancha.js`, dibujo cenital de la 7.9111) cada equipo sale de UN color
(`infoClub(id).color`) y el short es ese color oscurecido. Colo-Colo se ve blanco entero; la U, azul entero.

**Tarea:**
1. Crea `js/data-kits.js` con `KITS={ID:{local:[camiseta,short,medias], visita:[…], franja:null|"vertical"|"horizontal"|"banda", franjaColor:"#…"}}`
   para **todos** los clubes de `clubesElegibles()` (Primera, B, Segunda, Argentina, 1991, 2006, 1925). Cada
   club con una línea de comentario con la fuente (sitio del club, Wikipedia, ANFP). Si no encuentras fuente, NO
   inventes: deja el club fuera y anótalo en tu nota.
2. Cárgalo en `index.html` **antes** de `js/cancha.js`, con el mismo `?v=` que el resto.
3. En `_cvColores(P)` de `js/cancha.js`: usa `KITS` si existe (local si juegas de local, y si chocan los colores,
   el rival va de visita). Devuelve además `shortMio`, `shortRiv`, `mediasMio`, `mediasRiv` (el dibujo ya lee
   `col.shortMio`/`col.shortRiv`). Si hay franja, dibújala en `_cvJugadorTop` sobre la camiseta (dos o tres rayas
   en la elipse de los hombros, recortadas con `ctx.clip()` dentro de `save/restore`).
4. **Doctor (obligatorio):** agrega en `js/dev-banco.js` un chequeo `kits_clubes` que cuente cuántos clubes
   elegibles tienen kit, liste los que faltan y falle si un kit trae un color que no es hex válido. Verifícalo
   al revés: rompe un color y confirma que el chequeo falla.
5. Corre `bash test/correr.sh`, `bash test/correr_dev.sh`, `bash test/doctor.sh` y `bash test/banco.sh`.
   Todo en verde antes de subir. El doctor `cancha_cenital` exige menos de 4 ms por cuadro: no lo rompas.
6. Sube `VERSION` en `js/util.js` y todos los `?v=` de `index.html` (`sed -i 's/?v=VIEJA/?v=NUEVA/g' index.html`).
   Línea en `PATCHES.md`, nota en `ChatDeTrabajIA.md`.

**No toques:** la simulación de la cancha (`_cvJuego`, `_cvDecidir`, `_cvPasoGol`), las cámaras del 3D ni el motor.

=====

---

## GROK 4.6 · MODO BUILD · G2 · Que el área reaccione en el balón parado 3D

=====

Trabajas en **Futbolini**. Lee `CLAUDE.md` y las entradas 7.9092 y 7.9111 de `PATCHES.md` antes de tocar nada.

**Contexto:** desde la 7.9111 el córner, el tiro libre y el penal en 3D (`js/arco-gl.js`) tienen el área poblada
(`sitiosExtras(cam)` y `_glExtras`, guardados en `est.extras`). Pero están quietos como estatuas mientras la pelota
vuela.

**Tarea:**
1. En `_glSincronizar(est,t)`, cuando la pelota sale (`svg._pateado`), que los extras reaccionen: giran la cabeza
   y el cuerpo hacia la pelota (suave, no de golpe), los atacantes cercanos dan 2–3 pasos hacia donde cae y los
   defensores cierran. Con gol (`arco-golazo` en la clase del SVG) los atacantes levantan los brazos y los
   defensores bajan la cabeza; con atajada al revés.
2. Usa lo que ya trae `jugador3D` (`userData.piernas`, `brazos`, `cuerpo`). Nada de modelos ni librerías nuevas.
3. **Presupuesto:** en celular liviano (`est.liviano`) la reacción es solo girar hacia la pelota. El vigilante
   `ARCOGL_VIG` apaga el 3D si baja de ~15 fps: si tu cambio lo gatilla en la emulación de celular barato, está mal.
4. **Doctor:** chequeo `balon_parado_reacciona` en `js/dev-banco.js`: sin WebGL no puede renderizar, así que valida
   la función pura que calcula hacia dónde va cada extra (sácala a una función `reaccionExtra(sitio,bola,estado)`)
   y que ningún extra entre al arco ni cruce la línea de fondo. Verifícalo al revés.
5. `bash test/correr.sh`, `bash test/correr_dev.sh`, `bash test/doctor.sh` en verde. Sube `VERSION` y los `?v=`.
   Línea en `PATCHES.md`, nota en `ChatDeTrabajIA.md`.

**No toques:** las cámaras (`_camMirando`, `camFrontal`), el apuntado ni `potDeVelocidad`: están calibrados.

=====

---

## GROK 4.6 · MODO BUILD · G3 · Caja y deuda real de Primera B y Segunda (datos con fuente)

=====

Trabajas en **Futbolini**. Lee `CLAUDE.md` y la entrada 7.9110 de `PATCHES.md` (banco por equipo).

**Contexto:** `VERBOSO=1 bash test/banco.sh` muestra caja y deuda por temporada de cada club. Los chicos de B y
Segunda terminan cada año con 100–300 M más de deuda.

**Tarea (solo datos, no motor):**
1. Para cada club de `LIGA_B_2026` y `LIGA_C_2026`, busca caja, deuda y presupuesto anual 2025–2026 con fuente
   (memorias anuales, CMF para SADP, prensa económica). `CAJA_BASE_2026` nace en `js/motor.js` y la B y la
   Segunda se completan en `js/data-b2026.js`, `js/data-tarea-e.js` y `js/data-segunda2026.js`: deja los datos en un comentario sobre
   la línea de cada club, con la fuente y la fecha.
2. Solo cambia el número si la fuente es clara. Si no hay fuente, no toques y anótalo.
3. Corre `HILOS=6 bash test/banco.sh` antes y después y pega en tu nota cómo cambió la deuda media por división.
4. Doctor: el chequeo `datos_clubes` tiene que seguir en verde. Sube `VERSION` y los `?v=` solo si cambiaste
   un número. Nota en `ChatDeTrabajIA.md`.

=====

---

## CHATGPT · C1 · Jugar como un jugador nuevo y contar qué se traba

=====

Vas a probar **Futbolini**, un simulador de dirigir clubes de fútbol chileno que corre en el navegador (abre
`index.html` o la URL que te den). Eres un jugador que nunca lo vio. No leas el código antes de jugar.

1. Empieza con un club chico de la **Segunda División** y juega **10 fechas**: decide lo que te pregunten, entra a
   un partido en vivo, patea al menos un penal o un córner, mira la sección Vida.
2. Después empieza con **Colo-Colo 1991** y juega 5 fechas.
3. Escribe un informe corto (máximo 40 líneas) con:
   - las 5 cosas que no entendiste o que te trabaron, en orden de gravedad, con la pantalla y lo que hiciste;
   - los números que te parecieron falsos (sueldos, precios, resultados), con el valor que viste;
   - 3 momentos en que el juego te hizo sentir algo (bueno o malo) y por qué;
   - si en el celular algo quedó cortado, parpadeó o no se pudo tocar.
4. Recién ahí puedes leer `CLAUDE.md` y `CHECKLIST_8.md` y decir cuáles de tus problemas ya están en la lista.

Tu informe va al final de `ChatDeTrabajIA.md` con el título **"Playtest ChatGPT"**. No edites código: tu valor es
la mirada de alguien que llega sin saber nada.

=====
