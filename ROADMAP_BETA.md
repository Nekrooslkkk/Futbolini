# ROADMAP_BETA.md — Camino a la BETA ABIERTA PROFESIONAL

> Brief maestro del usuario (07/09/2026) para llevar Futbolini a beta pública pro.
> Nada se pierde acá. Cada ítem está etiquetado por carril:
> **[MOTOR]** = ingeniería/JS (Claude) · **[GROK]** = contenido/datos/imágenes/historia/balance ·
> **[TUYO]** = necesita algo del usuario (definir, subir archivos, crear cuentas).
> ⚠️ **OJO:** hay OTRO chat autónomo tocando este repo (`/loop` sobre `IDEAS.md`) →
> `git fetch` antes de tocar, y coordinar para no pisar `cancha.js`/`plop-motor.js`/`partido.js`.

## REGLA DE ORO (no romper, aplica a TODO)
- **Ser consecuente, nunca simulaciones inexactas.** El modo historia de cada club/época debe
  reflejar los problemas REALES de esa época (U 1991/1989 sus temas de entonces; actual lo actual).
- Español **chileno** neutro (tú), sin lenguaje inclusivo. Chilenizar de verdad (pega, cabro, etc.).
- Nombres reales OK, **stats estimadas**, **NUNCA** citas inventadas a personas reales.
- Info histórica **verificada y sin sesgo** (delegar verificación a Grok).

---

## META de lanzamiento (checklist macro)
- [ ] Todos los huecos argumentales tapados.
- [ ] Todos los bugs resueltos.
- [ ] Ciberseguridad + cuentas sólidas.
- [ ] **Liga chilena completa** (Primera + Primera B + Copa Chile + Libertadores + Sudamericana).
- [ ] **Super modo histórico**: desde la creación de cada club hasta **2226** (con modernizaciones
      y problemas propios de cada época futura, escenarios que van cambiando según los cimientos).

---

## 1 · MENÚ INICIAL Y PARTIDAS
- [ ] **[MOTOR]** Pantalla de carga más linda, menos monótona (varias frases/animación). *(hay frases
      rotativas; falta el salto visual grande)*
- [x] **[MOTOR]** **Menú de pausa** para volver a elegir otro equipo → Ajustes → "Mis partidas" +
      "Nueva partida (elegir otro club)". (7.24)
- [x] **[MOTOR]** **Varias partidas guardadas** (slots) — se puede tener varias carreras; se eligen en
      el arranque y en Ajustes → Mis partidas. Migra el save viejo sin perder nada. (7.24)
- [ ] **[GROK/TUYO]** **Logos de los equipos actuales** (imágenes). Grok las busca; el usuario las sube
      a `img/` (juego offline → archivos locales). Las imágenes son un upgrade visual grande.

## 2 · MULTIJUGADOR (duelo con un amigo) — rehacer
- [ ] **[MOTOR]** Sacar el "copiar/escribir código" (es nefasto). Buscar señalización más piola.
- [ ] **[MOTOR]** Modo torneo: mini-torneo entre los dos.
- [ ] **[MOTOR]** **Modo carrera compartida**: el modo de siempre pero cada uno maneja un club, con
      **avance sincronizado** (que no pase que uno tiene 20 pts y el otro recién jugó 1 partido).

## 3 · PREPARACIÓN DEL PARTIDO (táctica) — es fome y poco clara
- [ ] **[MOTOR]** **Química**: se entiende re poco y no sube más allá de ~56 con cualquier cambio →
      revisar la fórmula/escala y **explicar** qué combina bien.
- [ ] **[MOTOR]** Formación / mentalidad / estilo / presión: que se entienda si estás combinando bien;
      **agregar más cosas por cambiar**.
- [ ] **[MOTOR]** Alineación con **MÁS jugadores** de verdad.
- [ ] **[GROK]** **Canteranos, datos, rasgos** (contenido para que haya más plantel/variedad).

## 4 · "ANTES DE SALIR" + CLIMA + PRENSA
- [ ] **[GROK]** Frase del cuerpo técnico: más realista, **chilenizada**, una frase, sin pelos en la
      lengua (menos fome).
- [ ] **[MOTOR]** **Clima**: mini-pestaña con simulación tipo Windows Vista.
- [ ] **[MOTOR]** Conferencia de prensa **conectada a los indicadores** y que provoque algo real.
- [ ] **[GROK/TUYO]** Imágenes de cada periodista.
- [ ] **[MOTOR]** Respuesta **de texto libre** del usuario, interpretada localmente (sin gastar plata,
      no por palabra-clave rígida: que ponga cualquier cosa y algo lo interprete → tono).
- [ ] **[GROK]** Más preguntas/variantes (hoy "siempre sale lo mismo").

## 5 · DURANTE EL PARTIDO
- [ ] **[MOTOR]** ⚠️(otro chat en `cancha.js`) La cancha es DEMASIADO rectangular → que parezca cancha.
- [ ] **[MOTOR]** Datos (remates, al arco, córners) a **otro lado** de la pantalla.
- [ ] **[MOTOR]** Mejorar marcador + minutaje.
- [ ] **[MOTOR]** Mostrar el **canal que transmite** (atado a la concesión de TV que se va mejorando).
- [ ] **[MOTOR]** Botones (sobre todo el de **cambio**: se supone que son más) mejor.
- [ ] **[MOTOR]** Indicadores que se entiendan (qué apretás y qué pasa).
- [ ] **[GROK]** **Relato**: más variado, que no se repita 2 veces "Primeros toques, todavía sin
      profundidad".
- [ ] **[MOTOR+GROK]** **FutbolGram/Plop**: conectar el "Plop opina" con el otro feed (hoy no aparece
      en el otro chat) + más variedad (siempre sale lo mismo).

## 6 · POST-PARTIDO / DELEGAR
- [ ] **[MOTOR+GROK]** Preguntas del final = más una conferencia; hoy SIEMPRE sale lo mismo → Grok
      rellena pools.
- [ ] **[MOTOR]** Al **delegar al ayudante**: botón "cómo responder" con pista **tibio / caliente /
      frío**. Máx **3 delegaciones por campeonato** (y distinto cada campeonato).

## 7 · COMPETICIONES
- [ ] **[MOTOR+GROK]** **Copa Libertadores** y **Copa Sudamericana**: simulaciones **fieles al formato**
      (si se avanza en años, y cuando los cimientos indiquen, generar escenarios futuristas que cambian).
- [ ] **[GROK]** **Primera B**: **DECIDIDO** → temporada **2026** (solo era actual), con **Cobreloa** +
      otros clubes de Primera B 2026 que elija Claude. Equipos + fixture + planteles reales (Grok).
- [ ] **[GROK]** **Copa Chile**: **DECIDIDO** → para el **modo actual (2026)**; existió también en 1991,
      así que si se juega esa época va también. Formato + calendario por año (Grok verifica).

## 8 · ESCRITORIO / OBJETIVOS / AYUDANTE / NOTIS / AVANZAR
- [~] **[MOTOR]** "Lo que se espera de vos" → **"de ti"** ✅ (7.25) + barrido de "vos" en la UI seria.
      PENDIENTE: gráficos que se entiendan + llevarlo a Historia. (Audit voseo completo aparte: hinchas/
      barra quedan en chileno marcado a propósito.)
- [ ] **[MOTOR]** Cerebro local → renombrar a **"Ayudante"**, lectura más cercana tipo IA, que **puedas
      preguntarle**.
- [ ] **[MOTOR]** "Lo que pasó esta semana": lo que valga la pena atender aparece en **notificaciones**.
- [ ] **[MOTOR]** Problemas del juego que debas atender salgan como **"ATIENDE ANTES DE AVANZAR"**.
- [ ] **[MOTOR]** **Botón Avanzar mejorado**: que simule TODO (delegar todo y avanzar rápido, para
      partidas rápidas / hacer videos).

## 9 · INSTITUCIÓN
- [ ] **[MOTOR]** Opciones realistas; que se entienda lo de **grupos de interés**; poder hacer MÁS cosas.
- [ ] **[MOTOR]** **Capital institucional** que deje hacer más cosas / arriesgarte (más realista).

## 10 · ESTADIO
- [ ] **[MOTOR/GROK]** **Modelo 3D** del estadio (o una foto real como mínimo).

## 11 · REDES (Plop) — que sea una red social de verdad
- [ ] **[MOTOR]** Un comentario de un colocolino en rojo NO debería poder joderte (es de un colocolino):
      revisar que hostilidad ≠ hincha propio.
- [ ] **[MOTOR]** **Reportar**: que sea más difícil y que **no sirva mientras no mejores tu popularidad**.
- [ ] **[MOTOR]** Respuestas: que se generen **más comentarios** de respuesta a ti, que puedas **discutir
      sin fin**.
- [ ] **[MOTOR]** Comunicados rápidos: más **extensos** y **solo con CM contratado** (si no, no salen).
- [ ] **[MOTOR]** Nombre de usuario integrado a Plop; pantalla de carga con logo; que **todo el menú
      parezca un Twitter** (pero sigue siendo Futbolini).

## 12 · CALENDARIO / HISTORIA / CARRERA
- [ ] **[MOTOR]** Calendario: en cada partido ver el **historial** (relato completo, chats, etc.).
- [ ] **[GROK]** Modo historia mejorado con **info real** (verificada por club/época).
- [ ] **[MOTOR]** Modo carrera: **integrar todo lo que pasa** ahí.

## 13 · BARRA SUPERIOR
- [x] **[MOTOR]** **Tu plata personal** en la barra de arriba (chip "Tu plata", junto a Caja). ✅ (7.25)
- [x] **[MOTOR]** Login como **botón de cuenta** arriba, al lado de Avanzar. ✅ (7.21)

## 14 · VIDA (estilo BitLife realista pero piola)
- [ ] **[MOTOR]** Edad: **calendario** bueno para cambiarla.
- [ ] **[MOTOR]** Orientación del match que **sirva**; más opciones; mejores citas; poder responder más;
      que no sea tan rápido; poder mejorar o no estar; **tener una vida**.
- [ ] **[MOTOR]** Lo que te compras: más **visible** y mejor.
- [ ] **[MOTOR+GROK]** Más **trabajos**; changas → **"pegas"** (chilenizar todo, hoy no es NADA chilensis).
- [ ] **[GROK]** Vida social: más variedad (no repetido).
- [ ] **[MOTOR]** **Casino**: tragamonedas, apostar cualquier monto, más realista y lindo.

## 15 · UI GLOBAL / AVISOS / DEV / DIOS / LOGIN
- [x] **[MOTOR]** **Avisos**: **campana grande flotante** abajo a la derecha (con badge); al apretar,
      **ventana encima** con el fondo **blureado**. La campanita de la barra ahora abre el mismo modal. ✅ (7.25)
- [ ] **[MOTOR]** **Modo Desarrollador**: potenciar para probar miles de cosas y optimizar el juego.
- [ ] **[MOTOR]** **Modo Dios**: mejorar; si lo activás **te priva de logros**, **avisa antes de cagarla**,
      y que haya MÁS cosas (lo actual es poco).
- [ ] **[MOTOR]** Sacar el toggle de **spoilers históricos**.
- [ ] **[MOTOR/GROK]** **Temas** mejorados; subir MUCHO el detalle de la UI (algo casi nuevo, genial).

---

## CONTENIDO PARA GROK (consolidado — prompts a preparar)
- Logos de los 16+ clubes actuales (imágenes) · fotos de periodistas · fotos/render de estadios.
- Relato de partido (pool grande, anti-repetición) · frases del cuerpo técnico chilenas.
- Preguntas de prensa/post-partido (pools grandes por contexto) · tuits Plop (más variedad).
- Canteranos + datos + rasgos por club.
- **Historia verificada por club y época** (problemas reales de cada era, sin sesgo) → base del
  "ser consecuente". Incluye Primera B, Copa Chile, formatos Libertadores/Sudamericana.
- Balance del juego (Grok tiene acceso): economía, química, dificultad, dopaje, mercado.

## BLOQUEADAS (necesitan al usuario)
- Imágenes/logos/fotos → subir a `img/` (o Grok las provee).
- Primera B: qué clubes y de qué año. · Copa Chile: qué año.
- Hosting pagado tipo Hostinger (para después, dijo el usuario).

## PRIORIDAD SUGERIDA (primeras tandas, carril MOTOR, sin pisar al otro chat)
1. Varias partidas (slots) + menú de pausa "cambiar de club". (Menú inicial)
2. Tu plata personal en la barra + "vos→ti" + avisos como campana con modal blureado.
3. Química clara (fórmula + explicación) + más cosas por cambiar en la táctica.
4. Ayudante (rename + preguntable) + "atiende antes de avanzar".
5. Avanzar-rápido (delegar todo).
6. Redes: fix colocolino-en-rojo + reportar gateado por popularidad + hilos de discusión.
7. Modo Dios/Dev potenciados (Dios priva logros + avisa).
> Libertadores/Sudamericana, Primera B, Copa Chile, súper histórico a 2226 y multijugador-carrera
> son grandes: van con su propio mini-plan y contenido de Grok.
