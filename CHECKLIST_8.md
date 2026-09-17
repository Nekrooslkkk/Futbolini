# CHECKLIST 8.00 — tablero vivo (Claude · UI/bugs · Grok · datos)

> Meta 8.00 (definición de Grok): **todos los clubes al nivel Colo-Colo** +
> solución total de bugs + más contenido + Plop mejorado.
> Se marca `[x]` lo cerrado y VERIFICADO. Coordinación en `GROK_CAZA.md`.

## Estado verificado (barrido automático de Claude · headless)
- ✅ 79 clubes jugables botean en su época. 316 partidos simulados. **0 errores de consola.**
- ✅ Todas las secciones renderizan sin excepción en las 3 divisiones + AFA + 1925/1991/2006.
- ✅ Suite de regresión: **812/812** verde (Grok 7.99955).
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
- [ ] Playoffs 2006 estilo México: dato listo, motor pendiente *(Grok)*
- [ ] Formato Segunda liguilla de 7: dato listo, ¿motor cerrado? *(verificar con Grok)*

## DECISIONES DEL AUTOR (pendientes de tu OK)
- [x] CDN de 7.css: **vendorizado local** (`css/vendor/7-window.css`, MIT). Offline real, verificado con unpkg bloqueado.
- [x] Auditor de rigor + editor **mergeados a main** (clave dev: `peomojon` → Ajustes → Editor de contenido).

## CONTENIDO hacia 8.00
- [x] **AFA decisiones + clásicos** (Claude) + **11 DTs 2026** (Grok prensa 16–17 sep + Claude Wikipedia; mismos nombres).
- [x] Planteles copiables: 12 huevos → `data-planteles.js` + `data-planteles-epoca.js` (Grok 7.99953)
- [ ] Más "decisión propia" por club en AFA — ya 30/30; el 91% era antes del merge
