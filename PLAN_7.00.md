# PLAN MAESTRO · Futbolini 7.00 — "La actualización multijugador"

> Estado al arrancar: 16 clubes manejables, voz de Grok integrada, overhaul visual
> 7.0 completo, listo para GitHub Pages. Falta la joya: **jugar contra un amigo**.
> Este plan es la hoja de ruta. Se ejecuta por fases; cada fase se prueba y commitea.

---

## 0 · Objetivo de la 7.00

Que dos personas puedan **enfrentarse de verdad**: cada una elige su club, se conectan
por un **link + un código** (sin cuentas, sin servidor, sin loguear nada), y cuando se
cruzan **aparecen los dos y deciden** el partido. Todo respetando el alma del juego:
100% offline-first, vanilla JS, cero frameworks, privacidad total.

Además, dejar el juego **pulido y redondo** antes de que lo pruebe gente nueva.

---

## FASE A · PULIDA PRE-LANZAMIENTO  (antes de tocar multijugador)

Barrido final para que la primera impresión sea impecable.

- **A1 · Revisión visual de las 12 vistas** una por una (PC ancho + celular): que ninguna
  scrollee de más, que el vidrio/aurora se vea parejo, que no haya textos cortados.
- **A2 · Estados vacíos y de error** con onda (sin partida, sin decisiones, club recién
  ascendido con caja flaca, etc.).
- **A3 · Onboarding del primer minuto**: que un jugador nuevo entienda en 30 segundos qué
  hacer. Revisar el texto del inicio, el primer partido, el primer buzón.
- **A4 · Consistencia de componentes**: botones, fichas, etiquetas, barritas — todos con
  el mismo lenguaje Aero.
- **A5 · Cabos sueltos conocidos**:
  - Logro `post_oficial_muerto` sin hook (o lo reescribimos a algo detectable, o lo sacamos).
  - Verificar arcos de los 11 clubes nuevos in-game (que disparen y cierren bien).
  - Clásicos regionales: confirmar que se sienten (empuje, prensa, memoria).
- **A6 · Rendimiento**: que el fondo animado y el blur no laguean en celulares modestos.
  Fallback si `prefers-reduced-motion` o pantalla chica.
- **A7 · QA de temporada completa** con 3-4 clubes distintos (grande, chico, ascendido).

**Entregable A:** juego pulido, sin sustos, listo para que lo vea gente.

---

## FASE B · MULTIJUGADOR  (el corazón de la 7.00)

### Enfoque técnico (decidido)
**WebRTC DataChannel con señalización manual (copia-pega de código).**
- Dos navegadores se conectan **directo entre sí** (peer-to-peer). No hay servidor de
  por medio que vea los datos → privacidad real.
- La "señalización" (el saludo inicial para conectarse) se hace **copiando y pegando un
  código** que se mandan por WhatsApp/Discord. Sin backend.
- Se usa un **STUN público** (solo para descubrir la IP pública; no transmite datos del
  juego) para que funcione entre redes distintas. Sin TURN (si ambos están tras NAT muy
  cerrado puede fallar; para redes caseras normales, funciona).
- Un peer es **anfitrión** (corre la simulación autoritativa); el otro manda sus
  decisiones por el canal. Así no hay que sincronizar RNG.

### Incrementos (cada uno se prueba y commitea)

- **B1 · Conexión P2P básica** (`js/multi.js`)
  - Pantalla "Duelo con un amigo": **Crear sala** (genera un código-oferta) / **Unirse**
    (pega el código, devuelve un código-respuesta que el anfitrión pega de vuelta).
  - Al conectar: un "handshake" (ping/pong + nombres) que prueba que el canal vive.
  - Manejo de errores: código inválido, conexión caída, timeout.
  - *Prueba:* dos pestañas del mismo PC se conectan y se saludan.

- **B2 · Lobby de duelo sincronizado**
  - Cada jugador elige su **club** (de los 16) y su **nombre de DT**. Se intercambian
    las elecciones por el canal. Los dos ven "Vos: X vs Amigo: Y".
  - Elegir época/reglas base compartidas (2026 por defecto).
  - Botón "Listos" de ambos lados → arranca el duelo.

- **B3 · El duelo dirigido** (lo que pidió el jefe: "aparecen los 2 y deciden")
  - Un partido único entre los dos clubes. El **anfitrión simula**; ambos DT reciben los
    momentos clave (charlas tácticas, cambios, penales) y **cada uno decide por su equipo**.
  - Las decisiones del visitante viajan por el canal; el anfitrión las aplica y reenvía el
    estado (marcador, relato, ticker) para que los dos vean lo mismo.
  - Timeout por decisión (si uno se cuelga, sigue con la opción por defecto).
  - El minijuego de penal, la pizarra y la química **por lado**.
  - *Prueba:* dos pestañas juegan un partido completo, ambos deciden, mismo resultado.

- **B4 · Resultado + reenganche**
  - Pantalla de resultado compartida (quién ganó, goleadores, un par de stats).
  - Guardar el historial de duelos (`E.duelos`): marcador global vs ese amigo.
  - "Revancha" (volver al lobby manteniendo la conexión).
  - Opcional: un **tablón de duelos** (mini-liga entre amigos, con código de liga).

- **B5 · Robustez y UX**
  - Reconexión si se cae el canal a mitad de partido (retomar del último estado).
  - Copy-to-clipboard de los códigos con un toque; QR opcional del código (dibujado en
    canvas, sin librería) para pasarlo de una.
  - Mensajes claros cuando algo falla, sin jerga técnica.

**Entregable B:** dos amigos juegan un duelo dirigido de principio a fin, sin servidor.

---

## FASE C · CIERRE Y LANZAMIENTO

- **C1 · Pase de contenido de Grok** (con el `GROK_PROMPT.md`): rellenar pools que queden
  cortos, arcos que falten, más tuits/trivia. El jefe lo hace por su lado y yo lo integro.
- **C2 · Publicar en GitHub Pages** (ya está listo el repo) y verificar el link en vivo.
- **C3 · README/onboarding para multijugador**: 4 pasos simples de cómo retar a un amigo.
- **C4 · Versión**: subir el número visible a **7.0** en la barra.
- **C5 · QA final** de todo junto (single + multi) y bitácora en PATCHES.md.

---

## Riesgos y decisiones abiertas

- **NAT/TURN:** sin TURN, un porcentaje chico de redes no conectará. Aceptable para v1;
  si molesta, se evalúa un TURN gratis después. (No compromete el offline single-player.)
- **Sincronía del partido:** el modelo anfitrión-autoritativo evita desyncs de RNG. Es el
  camino simple y sólido; el visitante "ve y decide", no simula.
- **Alcance de B4/B5:** el tablón de liga y el QR son "lindos de tener"; si aprieta el
  tiempo/créditos, se dejan para un 7.01.
- **post_oficial_muerto:** decidir en A5 si se reescribe o se saca.

## Orden de ataque
**A (pulida) → B1 → B2 → B3 → B4 → (B5 si da) → C.**
Cada paso: implementar → probar en navegador (puerto nuevo) → commit → seguir.
