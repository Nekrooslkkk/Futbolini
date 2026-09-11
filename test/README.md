# test/ — pruebas automáticas de Futbolini

Red de regresión para que Claude, Codex y Grok no rompan el juego sin darse cuenta.
No usa red ni APIs pagadas; corre el juego real en un navegador headless.

## Correr
```bash
bash test/correr.sh
```
- Primero hace `node --check` de todos los `js/`.
- Después arma una copia de `index.html`, le inyecta `test/pruebas_core.js` y la
  levanta en **Chromium headless** (usa `$CHROME` si está seteado; si no, busca
  `chromium`/`google-chrome`). Sale **0** si TODO VERDE, **1** si hay fallos.
- Sin Chromium: igual valida sintaxis y sale 0 avisando que faltó el navegador.

Ejemplo con ruta explícita:
```bash
CHROME=/ruta/a/chrome bash test/correr.sh
```

## Qué cubre hoy (`pruebas_core.js`)
- Arranque de las 3 divisiones (Primera / Primera B / Segunda).
- Calendario propio de la Segunda (rivales de Segunda, torneo correcto).
- Simulación de una temporada completa (Primera) hasta el fin.
- Ascenso/descenso de 3 niveles (campeón de Segunda sube; colista de Primera baja).
- Copa Chile: temporada con copa simulada sin excepción.
- Guardado: round-trip de `E` (serializar/deserializar) sin pérdida.

Cualquier **error de consola** durante las pruebas cuenta como fallo.

## Agregar una prueba
Editá `test/pruebas_core.js`: usá `ok(cond, "nombre")` para un chequeo y
`safe(fn, "nombre")` para envolver algo que podría tirar excepción (muestra el
stack si falla). Mantené cada prueba autónoma (arrancá con `nuevaPartida(...)`).

> Recomendado: correr `bash test/correr.sh` antes de cada push.
