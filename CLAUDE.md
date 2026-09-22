# CLAUDE.md — contexto auto-cargable de Futbolini

> Si estás leyendo esto al inicio de una sesión: **NO pidas que te re-expliquen el proyecto.**
> Leé `PATCHES.md` (bitácora completa) y `BRIEFING.md` (memoria) que están en esta misma carpeta,
> mirá `git log --oneline`, y ya sabés todo. Después seguí con lo que pida el usuario o con `IDEAS.md`.

## Qué es
**Futbolini**: simulador de conducción de clubes de fútbol chileno. Vanilla JS puro (ES6),
sin frameworks, sin build. Corre abriendo `index.html` o `python -m http.server`. Todo el estado
cuelga del objeto global `E` (localStorage vía `Store`). Épocas: 1991, 2026, e histórico CC 1989→2008.

> **NO es un juego satírico.** (Corrección del autor, 22 sep 2026 — decía "satírico" y estaba mal.)
> Es **realista y crudo**: sobre la mierda que podés llegar a ser manejando poder, y sobre lo que
> eso le hace a tu vida personal. El humor aparece porque el fútbol chileno es así, no porque el
> juego se esté burlando. Si dudás entre un chiste y una verdad incómoda, **va la verdad incómoda**.

## Reglas inviolables
- **Lo intocable es la IDEA, no el código.** (Cambio del autor, 22 sep 2026.) Antes acá decía
  "NUNCA reconstruir desde cero". Ya no: **se puede reconstruir un sistema entero si está feo o
  no funciona**, siempre que no se mate la idea principal (ver "Qué es" arriba) ni el diseño.
  Reconstruir ≠ improvisar: se reconstruye con un plan, con tests, y se avisa en `ChatDeTrabajIA.md`.
  Lo que sigue prohibido es tirar abajo lo que YA funciona bien solo porque no lo escribiste vos.
- **Internet SÍ.** (Cambio del autor, 22 sep 2026.) Antes decía "sin CDN". El juego puede y debe
  usar internet para dar el salto de calidad: CDN de fuentes, iconos, assets, y a futuro servidores
  propios del autor. **Condición: todo asset sin copyright** (MIT/OFL/Apache/CC0 o dominio público);
  hay de sobra. El juego **no lucra**: se mantiene con propinas y cariño.
- **Pero tiene que poder vivir sin internet.** El "offline" no es una restricción de desarrollo:
  es una **funcionalidad para el jugador**. Tiene que poder **descargarse el estado del juego tal
  cual** y jugarlo tranquilo, sin depender de nadie. Un retiro, un viaje, un domingo sin señal.
  Regla práctica: si se cae internet, el juego **sigue jugándose** — se degrada, no se rompe.
- **Mantenimiento eterno.** Nada de dependencias que obliguen a migrar cada seis meses.
  Vanilla, sin build, sin npm: eso se mantiene solo por años y es por eso que se eligió.
- Estilo del repo: identificadores/comentarios en español, funciones cortas, `"use strict"`.
- No romper el orden de carga de `index.html` ni globals.
- Integridad: nombres reales con stats estimadas y aviso "aproximado". Nada de frases inventadas como reales.
- Diversidad sí, burla no (pool de citas escrito con respeto para todes).

## Regla permanente: el MODO DESARROLLADOR crece en cada parche
> Pedido explícito del autor (22 sep 2026): **"es algo que quiero que SIEMPRE hagas"**.

En **todo** parche, además de lo que se pida, hay que dejar el modo dev mejor que como estaba.
No es opcional ni hay que preguntarlo. Concretamente:
- Si arreglás un bug, **dejá el chequeo que lo habría cazado** dentro del doctor (`devDoctor()`),
  no solo en los tests. Los tests corren en CI; el doctor corre sobre la partida real del jugador.
- Si agregás contenido o un sistema, agregá su auditoría (cuánto hay, qué falta, qué está roto).
- Todo lo que hagas "a mano" para verificar algo (una sonda, una medición, un conteo) **se
  automatiza y se deja adentro**: si lo necesitaste una vez, lo vas a necesitar de nuevo.
- Herramientas: `devDoctor()` (diagnóstico completo con veredicto), `devPintarDoctor(cont)`
  (pestaña 🩺 Doctor del editor), `auditarTodo()`, `devInformeCobertura()`, `epocasHuerfanas()`.
- La clave del modo dev y cómo se abre están en `PATCHES.md`.

## Fuentes de verdad (LEER antes de tocar)
- `ANALISIS.md` — diagnóstico 5.1l y qué falta para la beta. LEER PRIMERO.
- `PATCHES.md` — qué hace cada parche, qué archivos toca, cómo editar planteles, cómo encender la IA.
- `LISTADO.md` — checklist A–I (actualizar si cerrás un ítem).
- `BRIEFING.md` — memoria portátil (para delegar a otras IA).
- `ChatDeTrabajIA.md` — **canal único** de trabajo entre las IA (antes `GROK_CAZA.md`). Toda tanda
  deja su nota al final. No se crean archivos de coordinación nuevos.
- `IDEAS.md` — wishlist del usuario: pendientes por hacer. Trabajá de acá cuando te digan "seguí con IDEAS".

## Cómo probar (protocolo)
1. Sintaxis: `node --check js/*.js`.
2. Lógica: harness de Node (no está en el repo; concatena los `js/` sin DOM y simula temporadas).
3. UI: `python -m http.server` + navegador. OJO: el navegador CACHEA los .js por origen →
   para verificar cambios, usá un puerto nuevo.
4. Commit con mensaje descriptivo + una línea en `PATCHES.md`. (git = el guardado permanente.)
5. **Al subir `VERSION` (js/util.js), cambiá TODOS los `?v=` de `index.html` a la misma versión**
   (`sed -i 's/?v=VIEJA/?v=NUEVA/g' index.html`). Si no, el navegador y el service worker sirven
   JS viejo. El doctor `offline_listo` y la suite dev fallan si no calzan.

## Cómo trabaja el usuario
Delega partes a Grok (co-diseño, rinde bien) y a veces trae datos investigados. Prefiere que le dejes
todo commiteado y documentado. Para no perder el hilo: git + PATCHES.md + BRIEFING.md.
