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

## Banco por equipo (`test/banco.sh`, 7.9110)
```bash
bash test/banco.sh                 # todos los clubes elegibles × cada época de inicio × modo, 1 temporada
TEMPS=3 bash test/banco.sh         # 3 temporadas seguidas por partida (barrido largo, ~1 min)
bash test/banco.sh CC,UCH RIV      # solo esos (cada argumento = un navegador)
VERBOSO=1 bash test/banco.sh COQ   # muestra también las que pasan (directorio, caja, deuda por temporada)
```
Arranca cada partida por el mismo camino que el botón "Empezar" (`argsInicio`), revisa el arranque, juega la(s)
temporada(s) y revisa cierre, archivo, fixture y año siguiente. Es LA prueba para "agregué un club, ¿funciona?".
También mide cuántos DT echan en la primera temporada (tope 25 %: más que eso es un bug de balance).
Todo vive en `js/dev-banco.js` (`bancoUno`, `validarDatosClub`), así el doctor lo usa sobre la partida real.

## Partidas viejas (`test/saves.sh`, 7.9110)
Los saves de `test/saves/*.json.gz` se hicieron corriendo de verdad las versiones 7.9003, 7.9053 y 7.9090 (Colo-Colo
1991, la U 2026, Trasandino en Segunda, River en Argentina, 9 fechas jugadas). Tienen que cargar, pintar las 13
secciones y terminar la temporada en la versión actual. Para agregar una versión: `git worktree add` de ese commit,
inyectar un script que haga `nuevaPartida` + `avanzarRapido` y vuelque `E` en JSON, y guardarlo como
`{v, saves:{clave:E}}` en gzip (ver PATCHES 7.9110).
