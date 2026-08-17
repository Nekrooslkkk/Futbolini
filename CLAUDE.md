# CLAUDE.md — contexto auto-cargable de Futbolini

> Si estás leyendo esto al inicio de una sesión: **NO pidas que te re-expliquen el proyecto.**
> Leé `PATCHES.md` (bitácora completa) y `BRIEFING.md` (memoria) que están en esta misma carpeta,
> mirá `git log --oneline`, y ya sabés todo. Después seguí con lo que pida el usuario o con `IDEAS.md`.

## Qué es
**Futbolini**: simulador satírico de conducción de clubes de fútbol chileno. Vanilla JS puro (ES6),
sin frameworks, sin build, sin CDN. Corre abriendo `index.html` o `python -m http.server`. Todo el
estado cuelga del objeto global `E` (localStorage vía `Store`). Épocas: 1991, 2026, e histórico CC 1989→2008.

## Reglas inviolables
- NUNCA reconstruir desde cero. Se EXPANDE sobre lo existente.
- Estilo del repo: identificadores/comentarios en español, funciones cortas, `"use strict"`.
- No romper el orden de carga de `index.html` ni globals. Sin dependencias externas.
- Integridad: nombres reales con stats estimadas y aviso "aproximado". Nada de frases inventadas como reales.
- Diversidad sí, burla no (pool de citas escrito con respeto para todes).

## Fuentes de verdad (LEER antes de tocar)
- `PATCHES.md` — qué hace cada parche, qué archivos toca, cómo editar planteles, cómo encender la IA.
- `BRIEFING.md` — memoria portátil (para delegar a otras IA).
- `IDEAS.md` — wishlist del usuario: pendientes por hacer. Trabajá de acá cuando te digan "seguí con IDEAS".

## Cómo probar (protocolo)
1. Sintaxis: `node --check js/*.js`.
2. Lógica: harness de Node (no está en el repo; concatena los `js/` sin DOM y simula temporadas).
3. UI: `python -m http.server` + navegador. OJO: el navegador CACHEA los .js por origen →
   para verificar cambios, usá un puerto nuevo.
4. Commit con mensaje descriptivo + una línea en `PATCHES.md`. (git = el guardado permanente.)

## Cómo trabaja el usuario
Delega partes a Grok (co-diseño, rinde bien) y a veces trae datos investigados. Prefiere que le dejes
todo commiteado y documentado. Para no perder el hilo: git + PATCHES.md + BRIEFING.md.
