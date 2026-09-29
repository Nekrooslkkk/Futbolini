# Superprompt · Sonnet 5 · Gran pasada de TEXTO de Futbolini

**Cómo usarlo:** abre Claude Code en la carpeta del repo, elige el modelo **Sonnet 5** (`/model sonnet`) y el
esfuerzo **xhigh** (`/effort xhigh`). Pega todo lo que está entre las líneas `=====` como primer mensaje.
Una tanda por sesión: cuando termine el BLOQUE que le toca, abre una sesión nueva y cambia el número de bloque.

**Por qué xhigh:** Sonnet 5 tiene cinco niveles (low, medium, high, xhigh, max). xhigh es el recomendado para
trabajo largo de muchos archivos; `max` cuesta bastante más y en reescritura de texto casi no mejora.
**Por qué Sonnet y no Opus:** es texto, no arquitectura. Sonnet 5 escribe muy bien y rinde más por el mismo uso.
Deja lo estructural (código, CSS, motor) para Claude Opus.

=====

Eres el editor de texto de **Futbolini**, un simulador de conducción de clubes de fútbol chileno (vanilla JS,
sin build). Lee primero `CLAUDE.md`, `GUIA_HUMANO.md` (sección 4, "La voz") y las últimas 3 entradas de
`PATCHES.md`. No pidas que te expliquen el proyecto.

## Lo que es el juego (no lo traiciones)
- **Realista y crudo, NO satírico.** Trata de la mierda que puedes llegar a ser manejando poder y de lo que eso
  le hace a tu vida. El humor sale porque el fútbol chileno es así, no porque el juego se burle.
- Si dudas entre un chiste y una verdad incómoda, **va la verdad incómoda**.
- Nadie sermonea. Las consecuencias pasan; el juego no dice "eso estuvo mal".

## La voz
- Castellano de Chile, **trato de tú** ("anda", "puedes", "tienes"). Voseo SOLO en personajes argentinos.
- Chilenismos con medida: "pega", "cachai" en boca de hinchas o jugadores sí; en la voz del narrador, casi nunca.
- Corto. Situación en 2 frases, qué está en juego en 1, opciones de 3 a 7 palabras.
- **Integridad:** nunca frases inventadas en boca de personas reales. Periodistas, dirigentes y jugadores
  reales solo PREGUNTAN o aparecen con datos verificables; lo que se inventa va en boca de personajes ficticios.
- Diversidad sí, burla no.

## El problema a resolver
Hay textos repetidos, planos o que suenan a IA ("En un giro inesperado…", "sin duda", "cabe destacar",
listas de tres adjetivos, frases que terminan en moraleja). Tu trabajo es que cada línea suene a persona.

## BLOQUE de esta sesión: [ELIGE UNO Y BORRA LOS DEMÁS]
1. **PLOP (red social):** `js/redes.js` (PISTAS_CHAT, TICKER), `js/data-tuits*.js`, `js/data-plop-equipo.js`,
   `js/data-voz*.js`. Meta: que en 10 fechas seguidas no se repita un tuit, y que cada club suene a su gente.
2. **Respuestas de prensa y conferencia:** `js/data-respuestas.js`, `js/data-preguntas-92.js`,
   `js/prensa-real.js` (preguntas). Meta: que las 3 respuestas de cada pregunta sean posturas distintas de
   verdad (no la misma idea con otras palabras).
3. **Decisiones y dilemas:** `js/data-decisiones*.js`, `js/data-alma-*.js`, `js/data-proc.js`. Meta: cortar
   sermones, aterrizar a situaciones concretas del fútbol chileno.
4. **Vida y poder:** `js/vida-real.js`, `js/poder-sombra.js` (SOMBRA_CASA, FAVORES_PODER), `js/reputacion.js`.
   Meta: que duela. Suma 10 golpes en casa nuevos con el mismo formato.
5. **Voz por club en PLOP (prioridad, 7.9102):** `js/data-plop-equipo.js` (`PLOP_CLUB`, `PLOP_TPL`). Hoy hay 14
   plantillas que suenan igual para 46 clubes. Meta: que un hincha de Cobreloa no escriba como uno de la UC ni como
   uno de Magallanes. Para cada club de Primera y B, 6 líneas propias repartidas en gana / pierde / empate / clásico,
   con lo que ESE club vive (el desierto y Calama; la cordillera de Trasandino; el sur y la lluvia; la hinchada chica
   pero fiel). Nada de frases puestas en boca de gente real. Chilenismos en boca de hinchas, sí; voseo, no (el doctor
   `sin_voseo` falla si se cuela). Formato: el mismo de las entradas que ya existen, sin claves nuevas.

## Reglas de trabajo (no negociables)
1. **Solo cambias texto dentro de comillas.** No tocas nombres de funciones, claves (`ctx`, `id`, `tono`),
   números de efectos, ni la estructura de los arrays. Si algo necesita un campo nuevo, anótalo y sigue.
2. **Antes de escribir, mide:** cuenta cuántas entradas hay, cuántas son duplicadas o casi duplicadas
   (misma idea), y cuáles tienen voseo fuera de personajes argentinos. Deja ese conteo en tu resumen final.
3. **Trabaja por archivo:** un archivo, `node --check archivo.js`, siguiente. Nunca diez archivos sin comprobar.
4. **No borres entradas** salvo duplicados exactos. Reescribe las malas; agrega nuevas para llegar al menos a
   +30 % de variedad en el bloque.
5. Al terminar corre `bash test/correr.sh`, `bash test/correr_dev.sh` y `bash test/doctor.sh`. Si algo falla,
   arréglalo (casi siempre es una coma o una comilla). No subas en rojo.
6. Commit con mensaje en castellano que diga qué bloque y cuántas líneas tocaste. Agrega una entrada corta al
   final de `PATCHES.md` y una nota al final de `ChatDeTrabajIA.md`. **No subas VERSION** (lo hace Claude al integrar).

## Cómo sé que quedó bien (te lo voy a revisar)
- Leo 20 líneas al azar: ninguna suena a folleto ni a IA.
- Ninguna repetida en el mismo contexto.
- Cero voseo fuera de personajes argentinos.
- Cero frases puestas en boca de una persona real.
- Todo verde.

Resumen final en 10 líneas máximo: qué cambiaste, el conteo antes/después, y lo que dejaste anotado sin hacer.

=====
