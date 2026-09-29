# CHECKLIST 8.00 — el camino (actualizado 28 sep 2026, 7.9092)

> **Decisión del autor (28 sep 2026):** primero se termina lo que falta ("all that shit"), después se pule y se
> pule hasta dejarlo piola, y ESO es la **8.00**. De ahí en adelante (8.01, 8.02…) es pulir y agregar cosas
> fáciles: equipos, jugadores, fotos, textos. Nada de sistemas nuevos grandes en la serie 8.0x.
>
> Cómo se usa: se marca `[x]` solo lo **verificado** (con doctor verde). Cada tanda deja su nota en
> `ChatDeTrabajIA.md`. Quien suba a 8.00 es el autor, cuando las 3 puertas de abajo estén abiertas.

## FASE A · Terminar lo que falta (7.90xx)
Sistemas que el autor pidió y todavía no existen o están a medias.
- [x] Aero de Windows 7 / Vista / DarkAero / Claro / Insano, con barras vivas y Animaciones OFF (7.9082–7.9087)
- [x] Partido en PC sin corrimiento · metas realistas · temporadas pasadas con repetición (7.9083–7.9088)
- [x] PLOP con perfil de red social · pizarra automática con química a 100 (7.9089)
- [x] **Penal, tiro libre y córner en 3D real** estilo PES 2006 (7.9092)
- [x] **Rendimiento base:** guardado agrupado, cinta del celu sin layout forzado (7.9093; doctor `rendimiento`)
- [x] **Mercado:** cupo de extranjeros real (ANFP 2026) y 🌎 en el mercado (7.9095)
- [x] **Escudos para todos los clubes** (libre de Commons / estilizado / generado) y en el marcador (7.9107–7.9109)
- [x] **Liga argentina con Apertura y Clausura** (el Clausura nunca se instalaba) (7.9108)
- [x] **Pantalla del partido ordenada** en celu y PC (7.9105)
- [x] Mercado: tope de citados por partido (5 de 6) en la lista (7.9096)
- [ ] Mercado: negociación más viva
- [x] **Segunda por zonas:** cierre de temporada cuadra fecha a fecha, sin −999 (7.9094)
- [x] **Segunda: arranque sin caja** → caja real + fila de decisiones + umbrales a escala + ayudante prudente (7.9106)
- [ ] **Voz por club en PLOP** → encargado a Sonnet (bloque 5 de PROMPT_SONNET_TEXTOS.md) (hoy 14 plantillas iguales para 46 clubes; anotado por Sonnet en 7.9091)
- [ ] **Economía y Vida/carrera:** el autor dijo "quedó corto" sin detalle → pedirle 5 líneas de juego real
- [ ] Textos: bloques 2, 3 y 4 de `PROMPT_SONNET_TEXTOS.md` (prensa, decisiones, vida y poder)

## FASE B · Pulir hasta dejarlo piola (7.95xx → 7.99xx)
Nada nuevo: solo que lo que hay se sienta terminado.
- [ ] Limpieza L1: borrar las 280 líneas muertas (probado que queda verde; ver GUIA_HUMANO.md)
- [x] Voseo fuera de personajes argentinos → 0 en datos y pantallas; doctor `sin_voseo` lo vigila (7.9096)
- [ ] Barra superior: 7 tarjetas es mucho → jerarquía (lo importante grande, el resto en un menú)
- [ ] Sonidos cortos CC0 (clic, aviso, gol, pito) con interruptor y respeto a Animaciones OFF
- [ ] Íconos Aero propios (las 14 ranuras de `js/data-ranuras.js`) — humano o provisorios SVG
- [ ] Fotos de estadio que faltan (15 Chile + 30 Argentina, Commons)
- [ ] Tutorial de 5 pasos para quien entra por primera vez (lo que traben los amigos de beta)
- [x] Rendimiento 2ª pasada: layouts forzados de `render` fuera; scroll del celu estable (7.9103). Cargar `dev-*.js` solo
      al abrir: medido, no conviene (±50 ms)
- [x] Emulación de Android barato completa (Moto G4, CPU 4×, 3G lento): segunda apertura 0,9 s, sin internet 0,7 s,
      partido 6/240 cuadros lentos (7.9107)
- [ ] Probar en un Android real barato (la emulación no reemplaza al teléfono) — humano
- [ ] Un barrido de 3 temporadas completas con 10 clubes distintos, con el doctor en cada cierre

## LAS 4 PUERTAS DE LA 8.00 (todas abiertas = se sube)
1. **Doctor sano** en `bash test/doctor.sh` + 5 partidas más (una por época y división) y las dos suites en verde.
2. **Cero deuda conocida:** FASE A completa, `DEUDA=""` en `test/correr_dev.sh`, cero voseo fuera de lugar.
3. **Rinde en un celu barato:** con la CPU 6× más lenta (Android de ~4 años), avanzar semana < 400 ms, ninguna
   sección > 400 ms y el partido en vivo con < 5 % de cuadros lentos. Se mide con `devRendimiento()`.
4. **Probado por humanos:** el autor jugó 1 temporada completa con un club chico y 2–3 amigos jugaron 30 min
   sin explicación; lo que anotaron está resuelto o conscientemente dejado para 8.0x.

## DESPUÉS DE LA 8.00 · la serie 8.0x (pulir y agregar lo fácil)
Cosas que NO tocan el motor y que se pueden hacer siempre, de a poco:
- **Equipos y ligas:** `PLANTILLA_LIGA.md` + editor de contenido (clave dev). Cada liga nueva con su auditoría de rigor al 100 %.
- **Jugadores:** planteles reales en `data/` (tabla simple nombre|posición|edad|nivel) → Claude los convierte.
- **Fotos:** `img/FOTOS.txt` + `scripts/fotos_bajar.py` (solo Commons/CC0) · íconos en `img/aero/` + `js/data-ranuras.js`.
- **Textos:** superprompt de Sonnet por bloques; Grok para datos con fuente.
- Regla de la serie: cada 8.0x deja el doctor verde y una línea en PATCHES.md. Un sistema nuevo grande = 8.1.

---
## Histórico (hasta 22 sep 2026)
> Se marca `[x]` lo cerrado y VERIFICADO. Coordinación en `ChatDeTrabajIA.md`.

## Estado verificado (barrido automático de Claude · headless)
- ✅ 79 clubes jugables botean en su época. 316 partidos simulados. **0 errores de consola.**
- ✅ Todas las secciones renderizan sin excepción en las 3 divisiones + AFA + 1925/1991/2006.
- ✅ Suite de regresión: **990/990** verde (Grok 7.9005 T57 prórroga + tanda). Dev **115/115** previo.
- → Conclusión: el motor NO crashea. Lo que falta para 8.00 es UX y rigor de datos.

## RIGOR (auditor de Claude · vara = Colo-Colo)
- [x] Chile Primera 2026 · **100%**
- [x] Chile Primera B 2026 · **100%**
- [x] Chile Segunda 2026 · **100%**
- [x] Chile 1991 / 2006 / 1925 · **100%** (clubes dirigibles)
- [x] **TODAS las ligas al 100% (listón Colo-Colo).** Gate de rigor de 8.00 (auditor) cumplido — subir a 8.00 lo decide el autor.
- [x] **Argentina · 100%** — decisiones 30/30 y clásicos (Claude). 11 DTs: mismos nombres Grok (prensa 16–17 sep) y Claude (Wikipedia 17 sep).

## UI (Claude)
- [x] Barra superior no corta Deuda a anchos medios (base.css, 7.99951-ui)
- [x] Panel de situación duplicado ("El club hoy" vs "Tu situación") — quitado el mío
- [ ] Reorganizar jerarquía de la barra (7 tarjetas es mucho) — *coordinar con Grok, es su ui.js*
- [x] Mobile 390px real (Playwright): 0 overflow en 5 secciones. Fix legibilidad botones aqua a 2 líneas + gramática 'decisiones'.
- [ ] Consistencia de ventanas Aero (que ninguna pantalla quede a medio camino entre estilos)

## MOTOR (reportado a Grok — sus archivos, no los toco)
- [x] `partido.js`: `tieneRasgo` duplicada — Grok 7.99954
- [x] Entretiempo clavado al 45' (no se salta con tick 2–4 min) — Grok 7.99955
- [x] 11 DTs AFA 2026 con fuente — Grok 7.99955
- [x] Voseo de datos (lista Claude 12) — Grok 7.99956
- [x] Panel «Hay x personas jugando ahora» en Ajustes — Grok 7.99956
- [x] Playoffs 2006 estilo México — Grok 7.99957 (Wikipedia 17 sep 2026)
- [x] Temas: negro ya no se ve blanco — Grok 7.99958
- [x] XSS toasts/Plop/login + código al correo + editor PEGAR — Grok 7.9000
- [x] Ligas clonadas jugables (calendario + eraBase + clubMundo) — Grok 7.9001
- [x] Reformas de asociación cambian el torneo (puntos/descensos/cupos) + semillas FIFA/guerra — Grok 7.9001
- [x] Preguntas de conferencia localizadas (Boca ≠ Copa Chile) — Grok 7.9001
- [x] Liga clonada COMPLETA: copa doméstica + picker + Plop al ticker — Grok 7.9002
- [x] Partido en vivo: inercia de córners/atajadas + VAR zócalo 2s + hot-swap Autobús — Grok 7.9003
- [x] Penal/tiro libre de transmisión + Copa Argentina visible en Chile 2026 + Avanzar con recap — Grok 7.9004
- [x] Estadio nocturno + córner jugable (misma cancha) + recap con posesión — Grok 7.9004b
- [x] Prórroga + tanda de penales en copas (ya no un random) — Grok 7.9005
- [ ] Formato Segunda liguilla de 7: dato listo, ¿motor cerrado? *(verificar con Grok)*

## DECISIONES DEL AUTOR (pendientes de tu OK)
- [x] CDN de 7.css: **vendorizado local** (`css/vendor/7-window.css`, MIT). Offline real, verificado con unpkg bloqueado.
- [x] Auditor de rigor + editor **mergeados a main** (clave dev: `peomojon` → Ajustes → Editor de contenido).

## CONTENIDO hacia 8.00
- [x] **AFA decisiones + clásicos** (Claude) + **11 DTs 2026** (Grok prensa 16–17 sep + Claude Wikipedia; mismos nombres).
- [x] Planteles copiables: 12 huevos → `data-planteles.js` + `data-planteles-epoca.js` (Grok 7.99953)
- [ ] Más "decisión propia" por club en AFA — ya 30/30; el 91% era antes del merge
