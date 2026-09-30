# GUIA_HUMANO.md — lo que puedes hacer tú (Vicente) para que Futbolini dé el salto

> Escrita por Claude el 26 sep 2026, con la 7.9082. No es de coordinación entre IA (eso sigue en
> `ChatDeTrabajIA.md`): es **para ti**. Cada tarea dice qué hacer, dónde, cómo comprobar que no rompiste
> nada y cuánto rinde. Marca con `[x]` lo que vayas cerrando y súbelo; así sé qué ya está.

**Índice**
1. Mejorar el proyecto en sí (lo que solo un humano puede hacer)
2. Cómo escribirme mejores pedidos (prompts)
3. Imágenes: lista completa, medidas y prompts para generarlas
4. Lenguaje y escritura: la voz del juego y tareas de texto
5. Ideas buenas que puedes hacer tú
6. Grok: cómo pedirle y cómo repartir el trabajo
7. Código fácil de editar en VS Code (limpieza segura)
8. Cómo comprobar que no rompiste nada (sin saber programar)

---

## 1. Mejorar el proyecto en sí (lo que solo un humano puede hacer)

Estas cosas ni Grok ni yo las podemos hacer. Son las que más valen.

- [ ] **Jugar de verdad y anotar.** Una temporada entera con un club que no sea Colo-Colo (Linares, Everton,
  Magallanes). Ten un bloc al lado y usa este formato, una línea por cosa:
  `[fecha del juego] [pantalla] lo que pasó → lo que esperabas → cuánto molesta (1-3)`
  Ejemplo: `[12 mar 2026] [Mercado] ofrecí 800 M y aceptó al tiro → esperaba contraoferta → 2`.
  Diez líneas así valen más que "el mercado está fome": me dicen exactamente qué arreglar.
- [ ] **Probar en tu celular real** (no en el emulador). Lo que falla en un teléfono de verdad (teclado que tapa,
  dedo gordo, sol en la pantalla) no lo ve ningún test. Sácale pantallazos y súbelos a `img/_reportes/`.
  Prueba también el **🥔 Modo papa** (Ajustes ▸ Pantalla o la pantalla de inicio): ábrelo, cierra, y vuelve a abrir
  (la carga rápida rige desde la segunda vez). Anota cuántos segundos tarda con y sin.
- [ ] **Borrar lo que no usas (5 minutos, 7.9119).** El juego ya no apunta a ninguno de los dos, pero las cuentas
  siguen existiendo y yo no puedo entrar a ellas:
  - **Railway:** railway.app → tu proyecto → *Settings* → abajo del todo *Danger* → **Delete Project**.
  - **Supabase:** supabase.com → tu proyecto → *Project Settings* → *General* → abajo **Delete project**.
  Cuando el juego tenga gente, se crean de nuevo siguiendo `HOSTING.md` y `SETUP_NUBE.md` (con el §2b de blindaje).
- [ ] **Tu cuenta de GitHub:** verificación en dos pasos encendida (Settings → Password and authentication). Si
  alguien entra a tu GitHub, cambia el juego para todos: es lo más valioso que tienes que cuidar.
- [ ] **Probar el login por código con tu correo** (desde acá no llega a Supabase; ya está en `IDEAS.md`).
- [ ] **Planteles reales:** Limache 2026 y correcciones a los grandes. Pásalos como tabla simple
  (`nombre | posición | edad | nivel estimado`) en `data/`. Yo los convierto.
- [ ] **Dos o tres amigos de beta.** Que jueguen 30 minutos sin que les expliques nada. Anota dónde se traban:
  eso es el tutorial que falta.
- [ ] **Decidir el nombre del botón de propinas** y la plataforma (Ko-fi, Buy Me a Coffee o transferencia).
  Yo lo integro. El juego no lucra, pero que la gente pueda apoyar.

## 2. Cómo escribirme mejores pedidos (prompts)

Tus pedidos ya son buenos en lo importante: dices qué te molesta y por qué. Lo que más me ayudaría:

**a) Una meta por tanda, con un "listo cuando…".** Así sé cuándo parar y tú cuándo revisar.
> ❌ "Mejora la economía, está fome."
> ✅ "Economía: quiero sentir que me falta plata. Listo cuando en una temporada con Linares tenga que vender a
> alguien para pagar sueldos al menos una vez."

**b) Muéstrame, no me describas.** Un pantallazo con una flecha vale por un párrafo. Súbelo a `img/_reportes/`
y dime el nombre del archivo. Si es de otro juego que te gusta ("quiero el mercado como el del FM 2008"),
nombra el juego y la pantalla exacta.

**c) Separa "lo que falla" de "lo que no me gusta".** Lo primero lo arreglo sin preguntar; lo segundo es diseño y
a veces conviene conversarlo. Sirve escribirlo en dos listas.

**d) Dime qué NO tocar.** "No cambies el partido en vivo, me gusta como está." Me ahorra romper algo que querías.

**e) Prioriza con números.** Si pides 5 cosas, ordénalas 1-5. Si se acaba el tiempo, hago las primeras bien en vez
de las cinco a medias.

**f) Cuando te hago preguntas al final de una etapa**, contéstalas aunque sea con "lo que tú creas". Si las
cierras sin responder (pasó esta vez), sigo con mi mejor criterio, pero puedo errarle a lo que querías.

**Plantilla para copiar:**
```
Etapa: <nombre corto>
Meta: <qué quiero sentir/ver al jugar>
Listo cuando: <prueba concreta que puedo hacer yo>
Prioridades: 1) … 2) … 3) …
No tocar: …
Referencias: img/_reportes/<archivo>.png, <juego y pantalla>
Lo que falla (bugs): …
Lo que no me gusta (diseño): …
```

## 3. Imágenes: lista completa, medidas y prompts para generarlas

### 3.1 Reglas (que no se te olviden)
- **Sin copyright ajeno:** hechas por ti, generadas por ti con IA, CC0 o dominio público. Nada de escudos ni logos
  reales de clubes o marcas, ni el logo de Windows. Estilo Aero sí; marcas no.
- **Nombres en minúscula, sin espacios ni tildes** (`sec-finanzas.png`, no `Sec Finanzas.PNG`).
- **Livianas:** íconos en PNG con fondo transparente, fondo en JPG de menos de 400 KB. Si pesan mucho, pásalas por
  squoosh.app (gratis, en el navegador).

### 3.2 Guía de estilo (pégala al principio de cada prompt)
Pega esto antes de cada pedido a un generador de imágenes (van mejor en inglés):
```
Frutiger Aero / Windows Vista era icon, glossy 3D, soft glass reflections, bright top-left light,
subtle drop shadow, vivid but clean colors (sky blue, grass green, aqua, white highlights),
rounded shapes, no text, no letters, no logos, no brand marks, transparent background, centered,
high detail, 2008 desktop software aesthetic
```
Para el fondo cambia la última parte por `wide desktop wallpaper, 16:9, no icons, no text`.

### 3.3 Ranuras ya preparadas en el juego (14)
Están en `js/data-ranuras.js`. Para cada una: haz la imagen, guárdala en `img/aero/` con el nombre exacto y cambia
`listo:false` por `listo:true` en su línea. Si el archivo falta, el juego vuelve solo al emoji.

| Archivo | Medida | Prompt (después de la guía de estilo) |
|---|---|---|
| `img/aero/fondo.jpg` | 1920×1080 JPG | `rolling bright green grass hills under a clear sky blue, soft aurora light ribbons, floating translucent bubbles, lens flare, dewdrops, serene, Windows Vista wallpaper mood` |
| `img/aero/logo.png` | 512×512 | `a glossy glass soccer ball icon with water reflections and a green aurora glow inside, orb shape` |
| `img/aero/sec-escritorio.png` | 128×128 | `a glossy folder with papers and a small whiteboard, blue and white` |
| `img/aero/sec-institucion.png` | 128×128 | `a small classical building with columns, marble white with blue glass roof` |
| `img/aero/sec-finanzas.png` | 128×128 | `a green leather wallet with shiny gold coins spilling out` |
| `img/aero/sec-plantel.png` | 128×128 | `two soccer jerseys side by side, one blue one white, glossy fabric` |
| `img/aero/sec-mercado.png` | 128×128 | `a travel suitcase with a handshake symbol, brown and blue` |
| `img/aero/sec-estadio.png` | 128×128 | `a small soccer stadium seen from above at an angle, green pitch, floodlights` |
| `img/aero/sec-redes.png` | 128×128 | `a cute round red glossy bird, like a water droplet with a beak, speech bubble` |
| `img/aero/sec-calendario.png` | 128×128 | `a desk calendar page with a red top binding and a small soccer ball` |
| `img/aero/sec-historia.png` | 128×128 | `an old leather book with a small golden trophy on top` |
| `img/aero/sec-carrera.png` | 128×128 | `a gold medal with a blue ribbon and a coach credential badge` |
| `img/aero/sec-vida.png` | 128×128 | `a small cozy house with a glowing heart window` |
| `img/aero/sec-avisos.png` | 128×128 | `an envelope with a small golden bell, glossy` |

Truco: genera las 12 de secciones **en una sola tanda** con el mismo prompt base, así quedan de la misma familia.

### 3.4 Fotos de estadio que faltan (reales, con licencia libre)
Van por el sistema que ya existe: `img/FOTOS.txt` (pega el link directo de Wikimedia Commons al lado del ID) y después
yo o tú corremos `python3 scripts/fotos_bajar.py img/FOTOS.txt`. **Solo de Commons con licencia CC o dominio público**;
anota el autor, que va en `img/FUENTES.md`.
- **Chile (15 sin foto):** SCR Deportes Santa Cruz, SMO Santiago Morning, LSC Lota Schwager, OSO Provincial Osorno,
  LIN Deportes Linares, CLC Colchagua, TRA Trasandino, COL Atlético Colina, OVA Provincial Ovalle, CNA Concón National,
  BSA Brujas de Salamanca, RSJ Real San Joaquín, SCI Santiago City, GVE General Velásquez, REN Deportes Rengo.
- **Argentina (30 sin foto):** River, Boca, Racing, Independiente, Vélez, San Lorenzo, Estudiantes (LP), Rosario
  Central, Talleres, Huracán, Lanús, Argentinos Juniors, Newell's, Belgrano, Defensa y Justicia, Instituto, Unión,
  Gimnasia (LP), Atlético Tucumán, Tigre, Banfield, Platense, Central Córdoba (SdE), Independiente Rivadavia,
  Sarmiento (J), Aldosivi, Gimnasia (Mendoza), Deportivo Riestra, Estudiantes (Río Cuarto), Barracas Central.
  Casi todos tienen foto libre en Commons. (Se agregan en `img/FOTOS.txt` con su ID de 3 letras: RIV, BOC, RAC…)
- **Escudos argentinos:** NO busques los oficiales (son marcas). El juego dibuja uno estilizado propio y así se queda.

### 3.4b Escudos de clubes (7.9109)
Todos los clubes ya tienen escudo en el juego. Hay tres tipos:
- **Real con licencia libre** (Wikimedia Commons: dominio público, CC0, CC BY o CC BY-SA). Están en `img/clubes/`,
  con autor y licencia en `img/FUENTES.md`.
- **Estilizado**: forma de escudo con los colores del club y su sigla. No es el oficial.
- **Generado**: sigla en gris, para clubes sin colores documentados (los de 1925, Cobresal).

El doctor `escudos_todos` (modo dev ▸ 🩺) te dice cuántos hay de cada tipo. Si encuentras un escudo **con licencia libre
comprobada**, pásamelo con el enlace de Commons y lo conecto. Los escudos oficiales con marca registrada sin licencia
no se pueden usar (el juego no puede depender de algo que un club nos puede hacer bajar).

### 3.5 Imágenes a futuro (todavía sin ranura: si las haces, las conecto yo)
- Fondo por época: `fondo-1991.jpg` (tonos cálidos, TV de tubo, pasto más seco) y `fondo-2026.jpg`.
- Pantalla de carga: una ilustración ancha 1600×600 de una tribuna de noche con bengalas **sin** escudos ni banderas
  reales.
- Sonidos Aero cortos (clic, aviso, gol, pito), CC0 de kenney.nl o freesound.org (filtra por CC0). Formato .ogg, menos de 50 KB.

## 4. Lenguaje y escritura: la voz del juego y tareas de texto

### 4.1 La voz (resumen para ti y para Grok)
- **Castellano de Chile, trato de tú.** "Anda a la pizarra", no "Andá". "Puedes", no "podés".
  - **Excepción:** los personajes argentinos (dirigentes, periodistas y jugadores de clubes argentinos) hablan con
    voseo, porque así hablan.
- **Realista y crudo, no satírico.** El humor sale de cómo es el fútbol chileno, no de burlarse. Si dudas entre un
  chiste y una verdad incómoda, va la verdad incómoda.
- **Corto.** Una decisión se lee en 10 segundos: situación (2 frases), qué está en juego (1), opciones de 3 a 7 palabras.
- **Nadie te sermonea.** Las consecuencias pasan; el juego no te dice "eso estuvo mal".
- **Integridad:** personas reales solo con datos verificables. **Nunca frases inventadas puestas en boca de alguien
  real.** Los periodistas y dirigentes ficticios tienen nombres ficticios.
- **Diversidad sí, burla no.**

### 4.2 Tareas de texto (de más fácil a más difícil)
- [ ] **T1 · Chilenizar el voseo que se coló** (unas 150 formas en total, la mayoría en `js/pulido.js`,
  `js/data-eventos.js`, `js/ia.js`, `js/ui.js` y `js/data-decisiones-plus.js`).
  En VS Code: `Ctrl+Shift+F`, activa el botón `.*` (expresión regular) y pega:
  ```
  (?<![\wáéíóúñ])(andá|sumá|ganá|juntá|podés|tenés|querés|sabés|pensá|jugá|cumplí|pedí|salí|seguí|subí|perdés|tocá|elegí|mirá|apretá|pagá|vendé|bajá|hacé|tené|decí|esperá|Resolvelas)(?![\wáéíóúñ])
  ```
  En "archivos a excluir" pon: `*argentin*, *afa*, *arg*, js/dev-*`. Cambia cada uno a tú: andá→anda, podés→puedes,
  cumplí→cumple, pedí→pide, salí→sal, seguí→sigue, sumá→suma, tocá→toca, elegí→elige, hacé→haz, tené→ten,
  decí→di, Resolvelas→Resuélvelas.
  **Ojo:** "sos" y "vos" también aparecen como partes de variables (`sos=…`) o de palabras ("nuevos"): cambia solo
  los que están **dentro de comillas** y son texto que ve el jugador.
- [ ] **T2 · Pistas del chat en vivo:** `js/redes.js`, busca `const PISTAS_CHAT`. Son frases de hinchas por
  situación (`ataque`, `aguantar`, `equilibrio`, `riesgo`). Suma 5 por grupo. Formato: `"frase",` dentro de los
  corchetes. Cortas, como se escribe en el celu en el estadio.
- [ ] **T3 · Trivia del entretiempo:** `js/prensa-real.js`, `const TRIVIA_GENERAL`. Copia una línea y cambia:
  ```js
  {q:"¿Pregunta?",op:["Correcta","Incorrecta 1","Incorrecta 2"],sol:0,desde:2002},
  ```
  `sol:0` = la primera es la correcta (el juego las mezcla solo). `desde:` = año desde el que la pregunta tiene
  sentido (sácalo si siempre vale). **Solo datos que puedas comprobar**, y deja la fuente en un comentario
  `/* fuente: … */` al final de la línea.
- [ ] **T4 · Respuestas de conferencia:** `js/data-respuestas.js`. Cada pregunta tiene 3 respuestas con su tono
  después de `|` (`calma`, `confianza`, `ataque`, etc.). Mantén los tonos que ya existen.
- [ ] **T5 · La sombra del poder** (lo nuevo, tema central del juego): `js/poder-sombra.js`, `SOMBRA_CASA` y
  `FAVORES_PODER`. Cada evento tiene título, descripción y 3 opciones con consecuencias personales (`bien` =
  bienestar, `par` = pareja, `bolsillo`, `sombra`…). Copia uno entero y cambia los textos; deja los números
  parecidos. Ideas que faltan: tu madre te pide que no salgas más en la tele; un periodista amigo te pide un dato a
  cambio de silencio; tu hijo quiere jugar en tu club; la pareja encuentra un segundo teléfono.

## 5. Ideas buenas que puedes hacer tú

- [ ] **Diario de un DT (para promocionar):** juega una temporada y escribe 5 entradas cortas como si fueras el DT.
  Sirven para la página del juego y me muestran qué momentos te quedan en la memoria (esos hay que potenciar).
- [ ] **Página en itch.io** (gratis, acepta propinas y juegos HTML). Yo preparo el .zip; tú haces la cuenta, subes los
  pantallazos y escribes la descripción.
- [ ] **Grabar 1 minuto de partido en vivo** con OBS (gratis). Sirve de tráiler y me muestra cómo se siente el ritmo.
- [ ] **Lista de "momentos del fútbol chileno"** reales y públicos que el juego podría tener como eventos: una línea
  cada uno, con año y link a la noticia. Ejemplos del tipo: estadios clausurados, clubes que cambiaron de ciudad,
  quiebras, sociedades anónimas que llegaron. Grok puede investigarlos si le pasas la lista de temas.
- [ ] **Paleta de tu club favorito** (colores exactos en hex) para temas visuales por club.
- [ ] **Respaldo:** una vez al mes, Ajustes → Partida → descargar respaldo. Guárdalo en Drive.

## 6. Grok: cómo pedirle y cómo repartir el trabajo

**Reparto que funciona:**

| Grok | Claude |
|---|---|
| Texto: frases, dilemas, respuestas, trivia | Código, CSS e interfaz |
| Investigar datos reales con fuente | Integrar y probar |
| Co-diseñar ideas | Mantener el doctor y los tests |
| | Versión y `?v=` |

Cuando Grok toca código o CSS, pasan cosas como la del Aero: capas encima de capas que se pisan. En la bitácora
quedó que Grok cruzó a archivos de CSS e interfaz varias veces.

**Reglas para pegarle al principio de cada tarea:**
```
Eres co-autor de texto de Futbolini (simulador de clubes chilenos, realista y crudo, no satírico).
- Solo editas los arrays de texto que te indico. NO tocas funciones, CSS, index.html ni VERSION.
- Castellano de Chile, trato de tú (voseo solo en personajes argentinos).
- Nunca inventes frases de personas reales. Datos reales solo con fuente (link) en un comentario.
- Mantén el formato exacto de las líneas vecinas (comillas, comas, llaves).
- Entrega: el bloque listo para pegar + al final de ChatDeTrabajIA.md una nota:
  "## TEXTO (Grok · fecha) · archivo · array · cuántas entradas · qué cubren".
- Si algo no calza en el formato, pregunta en vez de inventar un campo nuevo.
```

**Formato de encargo (así le pides):**
```
Tarea: sumar 10 entradas a SOMBRA_CASA en js/poder-sombra.js
Mira primero: las 5 que ya existen (mismo formato, mismos nombres de efectos: bien, par, bolsillo, sombra, rep, grupos).
Tema: lo que el poder le hace a tu casa (pareja, hijos, padres, amigos, salud).
Tono: realista, sin moralina. 2 frases de situación. 3 opciones de 3 a 7 palabras.
No: nombres reales, sexo explícito, violencia gráfica.
Listo cuando: 10 entradas pegables, sin repetir situaciones de las 5 que ya hay.
```

**Consejos para Grok en general:**
- Tareas de **un solo archivo y un solo array**. Mejor 3 tandas de 10 que una de 30: se revisan mejor.
- Pídele siempre **"primero lee lo que ya existe"**: si no, repite ideas.
- Para datos reales, **exige el link** y verifica 2 o 3 al azar. Si falla uno, revisa todos.
- Grok escribe; yo integro. Si Grok te dice que "ya lo subió", pásame su bloque igual y yo lo integro con tests.

## 7. Código fácil de editar en VS Code (limpieza segura)

**Antes de empezar (una vez):**
1. Abre la carpeta `Futbolini` en VS Code (Archivo → Abrir carpeta).
2. Extensión recomendada: **Live Server** (Ritwick Dey). Clic derecho en `index.html` → "Open with Live Server". Así
   ves los cambios al guardar. (Es una herramienta tuya: el juego no depende de ella.)
3. Regla de oro: **un cambio → guardar → probar → siguiente**. Nunca diez cambios de una.
4. Si algo se rompe: en la barra izquierda, Control de código fuente (el ícono de ramitas) → clic derecho en el
   archivo → "Descartar cambios". Vuelve a como estaba.

### L1 · ~~Borrar código muerto: 8 funciones copiadas dos veces~~ ✅ HECHO (7.9110)
Lo hizo Claude en la 7.9110 (le pediste "soluciona eso"): se borraron las 8 copias muertas de `js/ui-partido.js` y
`js/partido.js` (~280 líneas). Quedan las de `js/arco3d.js` y `js/prensa-real.js`. `test/correr_dev.sh` ahora falla si
aparece cualquier función declarada dos veces, así que no vuelve a pasar.

### L2 · Textos
Todas las tareas de la sección 4 (T1 a T5) son edición segura **si solo cambias lo que está entre comillas**.
Cuidado con:
- las comillas: si tu texto lleva comillas, usa «» o '' adentro;
- la coma del final de cada línea;
- no borrar una `}` o `]`.

### L3 · Ranuras de imagen
`js/data-ranuras.js`: solo cambiar `listo:false` → `listo:true` cuando el archivo esté en su lugar.

### Lo que NO conviene que toques (todavía)
- `index.html`: el orden de los `<script>` importa y los `?v=` tienen que calzar con `VERSION`.
- Los CSS viejos (`aero.css`, `so.css`, `pulido.css`): `aero7.css` los pisa en el tema Aero, pero los otros temas
  (negro, claro) todavía usan partes. Limpiarlos es trabajo mío, con el doctor al lado.
- Cualquier cosa con `E.` (el estado de la partida) o `function`: ahí se rompen partidas guardadas.

## 8. Cómo comprobar que no rompiste nada (sin saber programar)

**La prueba rápida (2 minutos), después de cada cambio:**
1. Abre el juego (Live Server) y aprieta `F12` → pestaña **Console**. **Si hay líneas rojas nuevas**, algo se rompió:
   lee el nombre de archivo y la línea que dice ahí, y "Descartar cambios".
   (Los errores de red o de `supabase` sin internet no cuentan.)
2. Entra a una partida y pasa por las secciones que tocaste.
3. **El doctor:** Ajustes (⚙️) → **Trucos** → Modo desarrollador. La clave está en `js/ui.js`, busca
   "Clave de desarrollador". Luego aprieta **🩺 Revisar todo**.
   - Tiene que decir **SANO**. Si dice ROTO, cada problema trae el archivo y la línea (📍) y cómo se arregla (🔧).
   - "Copiar informe" y pégamelo si no entiendes.
4. Para cambios en el partido: con el modo dev activo, juega un partido y aprieta **🧪 Probar** (aparece en el
   partido): fuerza un **penal** y un **tiro libre** y chútalos. Sigue hasta el entretiempo (ahí sale la trivia).

**La prueba completa** (si tienes Git Bash o WSL; si no, yo la corro al integrar):
```
bash test/correr_dev.sh      # suite del modo dev (incluye el detector de funciones duplicadas)
bash test/correr.sh          # suite general
bash test/doctor.sh          # doctor en 3 partidas + celular
```

---
*Si algo de esta guía quedó viejo (una línea que ya no calza, una tarea que ya hice yo), avísame y la actualizo.*
