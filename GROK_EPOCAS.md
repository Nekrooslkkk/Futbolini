# GROK — ÉPOCAS, LIGAS, ESTADIOS, FOTOS y CALENDARIO (pack maestro)

> Segundo pack de prompts (el primero es `GROK_SUPERPROMPT.md` + `GROK_PROMPTS.md`).
> Acá van los **huecos grandes** que pidió el usuario. Cada bloque es **un prompt
> independiente**: pegalo solo. Claude mete el código/UI y revisa fuerte; vos (Grok 4.6
> build) traés **datos REALES verificados exhaustivamente**; el usuario aprueba.

## Norte del proyecto (roadmap — para que sepas a dónde vamos)
- **Futbolini 8.0** = Beta fuerte 2 · **9.0** = Beta fuerte 3 · **10.0** = Beta de juego
  (= Futbolini 1.0 beta jugable, para que se popularice). Todo lo de acá alimenta ese camino.

## Reglas inviolables (van en TODOS los prompts)
1. **Integridad total:** solo datos **reales, documentados y verificados** (Wikipedia/AFA/ANFP/
   Transfermarkt/prensa). Stats estimadas con aviso de "aproximado". **Nunca inventes** club,
   jugador, cita, estadio, aforo, título o fecha como real. Si no lo podés verificar, **no lo
   pongas** y marcá "sin verificar".
2. **Respeto:** diversidad sí, burla no.
3. **Formato molde idéntico** (`js/data-segunda2026.js`, `js/liga-registrar.js`, `REGLAS.md`).
   `id` = 3 letras únicas (no choquen con los existentes; revisá `data-*.js`). `fuerza` 40–90.
4. **Lógica local por liga/época.** ⚠️ Ojo grande: **la liga Argentina NO habla de ANFP** (eso
   es Chile). En Argentina la federación es **AFA**, la B es la **Primera Nacional**, hay
   **promedios**, "River/Boca", "el Kun", etc. Cada liga/época usa **sus** instituciones,
   torneos y jerga. Entregá para cada liga un bloque `federacion:{sigla, nombre, ascenso, terminos:[...]}`.

## ORDEN para que copiar sea FÁCIL a futuro (el usuario lo pidió expreso)
- **Una época/liga = UN archivo** `js/data-<clave>.js` + **una llamada** de registro. Nada de
  desparramar datos por 5 archivos. Molde: `registrarLiga(...)`.
- Cada club: `{id,n,c,fuerza,aforo,est,ciudad,z, esc, colores:[hex,hex], fund:año}`.
- Cada época declara: `{clave, anio, pais, federacion, secciones_ocultas:[...], torneos:[...]}`.
- Todo dato con **fuente** al lado en un comentario `/* fuente: ... */`.

---

## PROMPT A — Menú de inicio con TODOS los equipos (elección épica)
> Para el nuevo menú de inicio de Futbolini (filtros por división + buscador ya existen),
> completá los datos de **cada club de cada división chilena** (Primera, Primera B, Segunda)
> para que la elección se vea épica: por club dame `esc` (emoji que lo represente), `ciudad`,
> `colores:[hex principal, hex secundario]` y `fund` (año de fundación, verificado). Formato:
> `{ id:"CC", esc:"⚫", ciudad:"Santiago", colores:["#000000","#ffffff"], fund:1925 }`.
> Solo datos reales. Si un club no tiene color oficial claro, marcá "sin verificar".

## PROMPT B — Liga Argentina con LÓGICA argentina (no ANFP)
> Entregá la **Primera División Argentina** en formato `registrarLiga` (`LIGA_ARG_2026`) con
> TODOS los clubes: `id` (3 letras, no choquen con Chile), `n`, `c`, `ciudad`, `est` (estadio
> real), `aforo` (real), `fuerza` 40–90, `esc`, `colores`, `fund`. Además:
> 1. `federacion:{ sigla:"AFA", nombre:"Asociación del Fútbol Argentino", ascenso:"Primera Nacional",
>    terminos:["promedios","descenso por tabla anual","Superliga/LPF","el clásico"] }`.
> 2. **Formato real 2026**: cuántos equipos, zonas/playoffs, cómo sale el campeón, **descensos
>    por promedio + tabla anual**, cupos a Libertadores/Sudamericana. Claro para implementar.
> 3. Planteles de River/Boca/Racing/Independiente en `PLANTEL_<ID>_2026` (solo documentados).
> Nada de "ANFP", "Copa Chile" ni jerga chilena en esta liga.

## PROMPT C — Modo histórico 1991 (Colo-Colo campeón de América) mejorado
> El modo 1991 ya existe (calendario real de Colo-Colo + Libertadores). Mejoralo:
> 1. Verificá y completá el **fixture real 1991** de Colo-Colo (rival, sede, resultado, fecha).
> 2. **Libertadores 1991** completa (grupo, llaves, final vs Olimpia) con resultados reales y
>    breve reseña por partido.
> 3. **Qué pasó en el mundo del fútbol chileno 1991** para las simulaciones posteriores: qué
>    clubes existían, quién ascendía/descendía, formato del torneo de ese año. La idea: que si
>    seguís jugando desde 1991, el universo **evolucione como la historia real** (cambios de
>    formato de torneo por año). Dame una **línea de tiempo de cambios de formato** (1991→2008)
>    con año y qué cambió (nº de equipos, descensos, Apertura/Clausura, etc.).
> 4. Pool de **tweets/prensa de época** (1991, sin redes: titulares de diario/radio).

## PROMPT D — Modo histórico 2006 (nuevo)
> Armá el **modo histórico 2006** del fútbol chileno, en formato molde, con TODO verificado:
> 1. **Clubes de Primera 2006** (`LIGA_2006`): id/n/ciudad/est/aforo/fuerza/colores/fund.
> 2. **Planteles reales 2006** de los grandes (`PLANTEL_<ID>_2006`), solo documentados.
> 3. **Formato del torneo 2006** (Apertura/Clausura, playoffs, descensos, cupos) — reglas reales.
> 4. **Sucesos reales 2006** (campeones, hitos, fichajes, datos de color) para decisiones/historia.
> 5. Pool de **titulares/tweets 2006** (registro de época). Marcá lo que no verifiques.

## PROMPT E — Modo histórico 1925 (nacimiento de Colo-Colo) — acotado
> Armá el **modo 1925**, año de la fundación de Colo-Colo. Es un modo **acotado y de época**:
> 1. Qué clubes/torneo existían en 1925 en Chile (amateur), con lo **verificable** (poco y claro).
> 2. **Qué NO debe aparecer** en ese modo (lista para que Claude oculte secciones): nada de
>    redes sociales, Copa Libertadores, VAR, sponsors modernos, mercado de pases millonario,
>    Primera B/Segunda profesional, etc. Decime qué secciones tienen sentido en 1925 y cuáles no.
> 3. Hechos reales de la fundación de Colo-Colo (1925, escisión de Magallanes, David Arellano)
>    para la intro y decisiones de época. Solo documentado.
> 4. Tono/lenguaje de época (titulares de prensa 1925). Nada anacrónico.

## PROMPT F — Estadios, aforos y ciudades VERIFICADOS (todas las divisiones)
> Revisá y entregá, por club de **cada división chilena** (Primera, B, Segunda) y de las ligas
> agregadas: `est` (nombre oficial del estadio actual), `aforo` (capacidad real actual),
> `ciudad`. Reportá SOLO lo que esté MAL en el juego hoy, con el dato correcto y **fuente**:
> `[FIX] ID — est/aforo/ciudad: valor_actual → valor_correcto (fuente)`. Ojo con estadios
> compartidos, mudanzas y remodelaciones (aforo cambia).

## PROMPT G — FOTOS (descarga AUTOMÁTICA, sin bajar estupideces)
> Ya existe el pipeline automático (`scripts/fotos_bajar.py` + `scripts/fotos_contacto.py`).
> El problema de antes era que se bajaba **un resultado de búsqueda** (Google/Commons a ciegas)
> en vez de **el archivo exacto**. Tu tarea es entregar el **manifiesto `FOTOS.json`**: una lista
> donde cada `url` es el **ENLACE DIRECTO al archivo de imagen** (termina en .jpg/.png/.webp),
> **verificado** que es exactamente ese estadio/club/persona. Formato (ver `FOTOS.example.json`):
> ```json
> { "id":"CC", "tipo":"estadio", "nombre":"Estadio Monumental David Arellano",
>   "url":"https://.../archivo-exacto.jpg", "autor":"Fotógrafo", "lic":"CC BY-SA 4.0" }
> ```
> Reglas:
> 1. **`url` = archivo directo, no una búsqueda ni una página.** De donde sea (sitio oficial del
>    club, prensa con permiso, Wikimedia) **mientras sea el archivo exacto y verificado**. Si pegás
>    un link que no termina en imagen o que es una búsqueda, el script lo **rechaza** (valida que
>    sean bytes de imagen de verdad, no HTML). Así no entra basura.
> 2. Preferí **licencia libre** (Commons/CC/dominio público) y anotá `autor` y `lic` para el crédito.
>    Si es del sitio oficial, decilo en `lic`.
> 3. Si de un ítem **no hay foto verificable**, ponelo con `"sin_foto":true` y sin `url` (el juego
>    usa el escudo emoji, que se ve bien). **Mejor sin foto que una foto equivocada.**
> 4. Entregá `tipo` in {estadio, club, periodista}. `id` = el del club/persona en el juego.
>
> **Automatización:** con ese `FOTOS.json`, el usuario (o Claude) corre `python3 scripts/fotos_bajar.py`
> → baja TODAS de una, valida cada una y descarta las malas → después `fotos_contacto.py` arma una
> **hoja de contacto** (`img/_contacto.html`) para revisar todas de un vistazo y borrar las 2-3 que
> hayan salido mal (solo esas se re-buscan). Cero "foto por foto durante años".
>
> **Sobre Google:** bajar del buscador NO se puede automatizar bien (va contra sus términos y trae
> justo la basura de antes). Por eso el manifiesto pide el **archivo exacto**: podés *encontrarlo*
> googleando, pero lo que pegás es el **link directo verificado**, no el resultado de búsqueda.

## PROMPT H — Cariño a la sección CALENDARIO (qué mostrar)
> Proponé el **contenido ideal de la sección Calendario** de Futbolini (Claude la maqueta). Hoy
> muestra: tus partidos, el "resto de la fecha" (otros equipos), la tabla, las copas y los
> amistosos. Decime, como diseñador de producto:
> 1. Qué datos por partido harían más rica la vista (racha, historial vs ese rival, forma, clima,
>    árbitro, si es clásico) — todo derivable de datos que ya existen.
> 2. Cómo agrupar visualmente liga / copa / liguilla / amistoso sin marear.
> 3. Frases cortas de "titular de la fecha" (registro neutro + chilensis) para encabezar cada
>    jornada. Formato `{ ctx:"fecha_previa"|"fecha_post", registro, txt }`.

---

### División de trabajo
**Grok 4.6 (build):** datos reales verificados + formatos + pools + fotos-fuentes. **Claude:**
código, UI, integración, tests, y te promptea los huecos que queden. **Usuario:** aprueba.
### Recordá
Verificado o no va. Formato molde. Lógica local por liga (AFA≠ANFP). Orden = un archivo por época/liga.
