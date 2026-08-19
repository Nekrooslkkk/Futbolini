# ANALISIS.md — estado 5.1l (para Claude / Grok)

> Último zip **entregado antes de este turno:** `futbolini_5_1k.zip` (18/08 00:55).
> El modo Build arrancó una auditoría y **no llegó a pegar código ni a un zip nuevo**.
> Este turno (Grok, 18/08 ~21:11) **sí avanzó**: ver `5.1l` en `PATCHES.md`.
> Fuente de trabajo: `futbolini_actual/futbolini/`. Expandir. No reconstruir.

## Qué está hecho de verdad (no creer LISTADO viejo)

| Área | Estado real en 5.1k/l |
|---|---|
| Fixture 2026 CC / UCH / UC | Oficial, 30 fechas |
| Corte 18/08 | Sí, opcional al crear 2026 |
| Resto de la fecha | 5.1k simula y suma a la tabla |
| Planteles 5 clubes | Nombres públicos, stats aprox. |
| XI rival | **5.1l**: usa plantel real si existe; si no, “el 9 de Coquimbo” (no inventa) |
| Calendario PAL/LIM 2026 | **5.1l**: mismas fechas que CC, empareje de jornada |
| Avanzar | No salta partidos (modal) |
| Fases de partido | dominio/equilibrio/ahogo |
| Cerebro local | Heurística, 0 créditos |
| Chirp | 2 pestañas, hilos, RT, 140 chars (5.1l) |
| Spoiler | Toggle en Ajustes (5.1l) |
| Asamblea | Hinchada+socios < -45 → 3 semanas → destitución (5.1l) |

## Qué duele todavía (orden de beta)

### A. Datos
- Tabla semilla 18/08: CC documentado; el resto es referencia, no acta.
- PAL/LIM no tienen fixture oficial propio (solo fechas de CC + pairing).
- 1991: solo CC tiene calendario real. UCH/UC 91 se generan.
- Copa Chile / Libertadores 2026: no.
- Save: v4 rearma plantel fantasma; no hay migración por temporada.
- Verificar nombres 2026 contra Transfermarkt otra vez (el mercado se mueve).

### B. Partido
- Sigue siendo un timer con peligro. Fases pesan poco.
- Cansancio por jugador y recambio frío: **arrancados en 5.1l**, falta UI de cambio voluntario.
- Árbitro: hay `modSuma("arbitraje")` y más polémica en clásico/VAR; no hay nombre ni sesgo visible.
- Relato ya cita titulares (5.1l); aún no hay mapa de calor / posesión.

### C. Institución
- Grupos y estatutos existen; no te llaman.
- Asamblea de censura: sí (5.1l). Falta que la prensa filtre a -45.
- Blanco / ANFP / TV no tienen agenda propia.

### D. Economía
- Flujo semanal existe. La deuda es un globo, no cuotas.
- Clausura y sueldos atrasados sí. Cláusulas/comisiones no.

### E. Redes
- Cuentas no son persistentes (el @ cambia).
- No hay DMs, follow, viralidad real, hashtag que nazca de un hecho.

### F–G
- Tinder/dinastía/casino: **congelar**. No cierran la beta.
- IA de pago: apagada. `/api/pensar` local. No enchufar modelo.

### H
- Modos histórico/libre/caos: umbral de eventos + un poco de relato caos. Poco.
- Celular: jugable a medias. Partido con pulgar: no.
- Soundtrack: no.

## Definición de beta cerrada (todavía no)

1. CC / UCH / UC 1991 o 2026 con calendario que no mienta.
2. Avanzar no salta.
3. Un año se siente distinto.
4. La plata te puede echar.
5. Chirp habla cuando pasa algo.
6. Guardar y seguir mañana.

5.1l acerca 1, 2, 4 (asamblea) y 5 (140). Falta 3 (años) y tabla del resto como acta.

## 5.1m hecho
Charla de match, dilemas de cita, hijos a cantera, sucesor hijo/externo, `pensarOffline`.
IA de pago: apagada.

## Próximo parche sugerido (5.1n) — no lo hagas todo

1. Siembra de tabla 18/08 más fina + resultados reales del resto si se investigan.
2. Cambio voluntario en dirigir (máx 3, el que entra frío).
3. Prensa filtra si un grupo < -45.
4. Fixture 1991 UCH o UC (uno solo, bien hecho).
5. Cuentas Chirp persistentes (5 handles fijos).

## Archivos tocados en 5.1l

`data-plantel.js` `data-liga.js` `partido.js` `motor.js` `ui.js` `LISTADO.md` `PATCHES.md` `ANALISIS.md`
