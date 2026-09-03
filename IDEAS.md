# IDEAS.md — wishlist / backlog de Futbolini

> Cola de trabajo. Decime **"seguí con IDEAS"** (o `/loop seguí con IDEAS` para
> que avance solo, turno tras turno) y voy tachando de arriba hacia abajo,
> commiteando cada tarea. Yo marco `[x]` lo hecho y anoto el commit.
> Regla: cada tarea es autónoma (no necesita que preguntes nada). Las que sí
> necesitan algo tuyo están en "🔒 Bloqueadas".

## 🚀 Por hacer (autónomas — arrancá por acá)
- [ ] **Plop! hilos**: que las cuentas se respondan entre ellas (1-2 réplicas por post caliente), usando las personas de `plop-motor.js`.
- [ ] **Plop! memoria entre partidos**: que recuerden la racha y el resultado anterior ("la fecha pasada te funaban, ahora…"). Usar `E.plop.hist` + `E.temporada`.
- [ ] **Momentos del partido más potentes**: subir el peso visual/narrativo del momento clave (gol, penal, roja) — pausa dramática, texto más grande, reacción del banco.
- [ ] **Cancha pixel v2**: pequeños detalles (arquero que se mueve en el penal, pelota con estela corta, red que vibra en el gol).
- [ ] **Más contextos generativos**: sumar `tiroLibre`, `atajada_penal`, `debut_juvenil`, `lesion_grave` a `PLOP_GRAM`.
- [ ] **Economía**: botón "refinanciar" (baja el interés semanal a cambio de estirar el total), explicado paso a paso.
- [ ] **Chilenización de docs .md** (no user-facing, baja prioridad).

## 🔒 Bloqueadas (necesito algo tuyo)
- [ ] **Login + saves en la nube**: encender Supabase (gratis) → pegar 2 llaves en `nube.js` (ver `SETUP_NUBE.md`). *(Necesito que crees el proyecto Supabase.)*
- [ ] **Fotos**: caras / escudos / estadios / noticias → van a `img/`, WebP livianas. *(Necesito los archivos.)*
- [ ] **Primera B**: equipos + fixture. *(Necesito confirmar qué clubes y de qué año.)*
- [ ] **Copa Chile**: formato + calendario (da cupo internacional). *(Investigo yo, pero confirmá el año.)*
- [ ] **"Copa de la Liga"**: aclarar qué es (Chile no tiene una tradicional). *(Necesito tu definición.)*
- [ ] **Planteles reales**: Limache 2026, correcciones a los grandes. *(Si subís datos, a `data/`.)*

## ✅ Hecho (reciente)
- [x] Economía explicativa (semáforo + pasos) — commit 95e4d0d.
- [x] Cancha pixel-art — commit efb6cca.
- [x] Backend propio + guía Hetzner + cliente — commit 320e2c5.
- [x] Época histórica Palestino 1978 + fix épocas solo-2026 — commit 9778f69.
- [x] Motor generativo de Plop! (tuits con estado real + personas + memoria) — commit c9e8b63.
- [x] Partido conectado con Redes + marca unificada Plop! — commit ecab57e.
- [x] Tuits aprobados + apodos meme + contextos nuevos — commit 6c91cb9.
- [x] Vida 3.0 / Motor de variedad (adbac16) / Vida 2.0 (8cfdcc3).
