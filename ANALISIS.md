# ANALISIS.md — estado real y rumbo (al día · v7.12)

> **LEER PRIMERO.** Este doc reemplaza el diagnóstico viejo de 5.1l (que quedó
> caduco y confundía). Refleja el estado real del juego hoy y el rumbo acordado
> con el usuario. Para el detalle de cada parche, ver `PATCHES.md`.

## Dónde estamos (v7.x)
Base sólida y estable. Corrí ~300 partidos simulados (5 clubes × 2 épocas × 30
fechas) sin un solo error de motor. Save/load limpio.

| Área | Estado real |
|---|---|
| Motor de partido | Estable. Fases dominio/equilibrio/ahogo, cansancio por jugador, cambios con nombre (máx 3), árbitro con nombre + sesgo visible, stats de transmisión (posesión/remates/al arco/córners). |
| Cancha | Canvas 2D con la pelota siguiendo la jugada. **Se ve fome (muy vector/liso). A rehacer en estilo pixel.** |
| Épocas | 1991, 2026 e histórico CC 1989→2008. Selector de época unificado (arreglado el bug de "U 2011 → plantel actual"). |
| Planteles | Nombres reales, stats aprox. con aviso. XI rival real si existe. |
| Redes / voz | Tuits chilenos aprobados (v7.11) + apodos meme de cuentas troll + contextos nuevos (descenso/rumor/invicto). **PERO: pool fijo, solo viven DENTRO del partido, y la marca está partida (Plop!/FutbolGram/Chirp).** |
| Economía | Flujo semanal, sueldos atrasados, clausura. **La deuda es un globo sin cuotas y NO se explica bien → el usuario quiere que sea siempre resoluble y paso a paso.** |
| Nube (opcional) | Login + respaldo por `fetch` a Supabase. Apagado (claves vacías). 100% opcional. |
| Guard nueva partida | v7.12: no crashea con combinaciones inválidas (club inexistente en la época). |

## Rumbo acordado (en construcción · orden de prioridad del usuario)

### 1. Redes con "vida" — motor generativo, no pool fijo 🔴 (prioridad)
El usuario NO quiere 240 tuits fijos: quiere que las cuentas reaccionen al
contexto real "como si tuvieran vida". Realidad técnica (sin IA de pago):
- **No** hay "IA viva" gratis y offline. **Sí** hay un salto enorme: pasar del
  pool fijo a un **motor generativo procedural** = cuentas persistentes con
  personalidad + estado (humor, bando, obsesiones, memoria), y frases armadas
  por gramática de fragmentos que se llenan con el estado REAL del partido/club
  (marcador, minuto, racha, jugador puntual, rivalidad, qué pasó antes).
  Combinatoria de miles, no 240. Cuentas que se responden en hilos y recuerdan
  ("te lo dije la fecha pasada").
- La capa nube opcional podría, a futuro, llamar un LLM para texto vivo de
  verdad — pero eso es la vía "de pago" que estamos evitando por ahora.

### 1b. Unificar todo bajo **Plop!** y conectar partido ↔ pestaña redes 🔴
- Hoy conviven Plop! / FutbolGram / Chirp. Debe ser **una sola red: Plop!**
- Lo que sale en el ticker del partido tiene que **persistir en `E.redes`** y
  seguir en la pestaña de redes (reacciones post-partido, al otro día).
- **Las pistas tácticas del partido NO aparecen en el feed** → hay que enchufarlas.

### 1.5 Fotos 📷
El usuario va a mandar imágenes. Regla del repo: todo offline, sin CDN → las
fotos viven en el repo (`img/`) o embebidas. Falta definir para qué (caras de
jugadores / escudos / estadios / imágenes de noticias) y optimizarlas livianas.

### 2. Economía fácil y explicativa 🟠
Que la deuda **siempre** se pueda resolver y que el juego lo explique paso a
paso, en chileno claro, sin "ensalada de botones". Pantalla de estado financiero
tipo tutorial: qué debes, por qué, y opciones con consecuencias explícitas.

### 3. Partido más potente + cancha pixel 🟠
Timer más concreto/potente, momentos con más peso, y **cancha en estilo pixel-art**
(Canvas con `imageSmoothingEnabled=false`, sprites chunky) en vez del look liso
actual. Todo offline, sin librerías.

### 4. Limpieza (v7.12 · hecho / en curso)
- ✅ Guard de `nuevaPartida` contra combinaciones inválidas.
- ✅ Este doc actualizado.
- ⏳ 1991: solo CC tiene fixture real; UCH/UC 91 se generan → se deja para el
  prompteo de textos de la beta.

## Definición de beta cerrada (checklist vivo)
1. CC / UCH / UC 1991 o 2026 con calendario que no mienta. — parcial (91 incompleto)
2. Avanzar no salta partidos. — ✅
3. Un año se siente distinto. — parcial
4. La plata te puede echar (y se puede remontar). — en rediseño (track 2)
5. Las redes hablan cuando pasa algo. — ✅ base; salto generativo en track 1
6. Guardar y seguir mañana. — ✅
