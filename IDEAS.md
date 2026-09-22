# IDEAS.md — wishlist / backlog de Futbolini

> 📌 Brief maestro de la BETA PRO en **ROADMAP_BETA.md** (por área y carril MOTOR/GROK/TUYO).
> Esta cola (IDEAS) sigue vigente para tareas chicas autónomas; el roadmap grande vive allá.

> Cola de trabajo. Decime **"seguí con IDEAS"** (o `/loop seguí con IDEAS` para
> que avance solo, turno tras turno) y voy tachando de arriba hacia abajo,
> commiteando cada tarea. Yo marco `[x]` lo hecho y anoto el commit.
> Regla: cada tarea es autónoma (no necesita que preguntes nada). Las que sí
> necesitan algo tuyo están en "🔒 Bloqueadas".

## 🚀 Por hacer (autónomas — arrancá por acá)
- [x] **Plop! hilos**: las cuentas se responden entre ellas — commit pendiente.
- [x] **Plop! memoria entre partidos**: callback de racha al cerrar el partido — commit pendiente.
- [x] **Momentos del partido más potentes**: flash de momentazo (gol/roja/penal) — commit pendiente.
- [x] **Cancha pixel v2**: arquero que se mueve en el penal, pelota con estela corta, red que vibra en el gol, proporción de campo, área chica y banderines — 7.996.
- [x] **Más contextos generativos**: tiroLibre/atajada_penal/lesion_grave enganchados; debut_juvenil gramática lista — commit pendiente.
- [x] **Economía**: botón "refinanciar" (baja interés, estira total), explicado paso a paso — commit pendiente.
- [x] **Lista de concentrados 16/18/23**: el banco es la nómina, no todo el plantel — 7.999.
- [ ] **Chilenización de docs .md** (no user-facing, baja prioridad).

## 🔒 Bloqueadas (necesito algo tuyo)
- [ ] **Fotos**: caras / escudos / estadios / noticias → van a `img/`, WebP livianas, **sin copyright**
  (CC0/CC-BY con crédito o propias). *(Necesito los archivos o el OK para buscarlas en Wikimedia Commons.)*
- [ ] **Planteles reales**: Limache 2026, correcciones a los grandes. *(Si subís datos, a `data/`.)*
- [ ] **Probar el login por código con un correo real** (desde CI no llega a Supabase). *(Solo vos.)*

## 🧹 Desbloqueadas / ya resueltas (22 sep 2026, revisión de Claude)
- [x] Login + nube: Supabase encendido en `nube.js`; login por código al correo (7.9028).
- [x] Primera B, Copa Chile, Copa de la Liga: existen y se simulan (tablas en Calendario).
- [x] Jugar sin internet: service worker + instalable como app (7.9030).

## ✅ Hecho (reciente)
- [x] Calendario vivo + repetición completa de cada partido (7.9031).
- [x] Equilibrio: el club del jugador ya no tiene ventaja; sueldos por mercado (7.9029).
- [x] Penal/tiro libre/córner reconstruidos (7.9027) · Ajustes ventana (7.9028).
- [x] Economía explicativa (semáforo + pasos) — commit 95e4d0d.
- [x] Cancha pixel-art — commit efb6cca.
- [x] Backend propio + guía Hetzner + cliente — commit 320e2c5.
- [x] Época histórica Palestino 1978 + fix épocas solo-2026 — commit 9778f69.
- [x] Motor generativo de Plop! (tuits con estado real + personas + memoria) — commit c9e8b63.
- [x] Partido conectado con Redes + marca unificada Plop! — commit ecab57e.
- [x] Tuits aprobados + apodos meme + contextos nuevos — commit 6c91cb9.
- [x] Vida 3.0 / Motor de variedad (adbac16) / Vida 2.0 (8cfdcc3).
