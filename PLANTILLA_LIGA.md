# PLANTILLA_LIGA.md — cómo copiar una liga con el mismo rigor que la chilena

> Para cuando digas: **"copiando el formato, haz la liga danesa"**.
> Esto es la receta mecánica. No hay que inventar arquitectura: se rellena.

## Regla que manda sobre todo
**Nada inventado como real.** Nombres, estadios, aforos, fundaciones y títulos van
**verificados**. Si un dato no está documentado, **se deja afuera** y se declara en
`DEV_SIN_DATO` (en `js/dev-esquema.js`) con el motivo. El auditor **no lo cuenta en
contra**, así nadie se ve tentado a rellenar con humo. Los planteles sin fuente se
dejan como cantera: el juego los genera.

## La vara
Un club está "completo" cuando tiene **los mismos campos llenos que Colo-Colo**.
El editor lo mide solo: **Ajustes → Modo desarrollador → Editor de contenido → Rigor**.
Meta: la liga nueva en **100%**, igual que Primera/B/Segunda 2026.

---

## Paso 1 · El array de clubes
Un archivo nuevo `js/data-<pais><anio>.js`. Cada club, este molde exacto:

```js
const LIGA_DIN_2026=[
  { id:"XXX", n:"Nombre oficial", c:"Apodo corto", fuerza:70, aforo:38000,
    est:"Nombre del estadio", ciudad:"Ciudad", z:"—" },
  /* ...todos los clubes del torneo... */
];
```
- `id` = 3 letras **únicas** (que no choquen con Chile ni Argentina — revisá
  `data-liga.js`, `data-clubes2026.js`, `data-b2026.js`, `data-segunda2026.js`,
  `data-argentina2026.js`).
- `fuerza` = estimación **40–90**. Es lo que deriva indicadores y caja.

## Paso 2 · Registrar la liga (una línea)
```js
if(typeof registrarLiga==="function"){
  registrarLiga({ eraKey:"din2026", clubs:LIGA_DIN_2026, baseEra:2026,
                  nombre:"Superliga danesa" });
}
```
`registrarLiga` (ver `js/liga-registrar.js`) cablea solo, derivando de `fuerza`:
`CLUB_INFO_2026`, `IND_BASE_2026`, `CAJA_BASE_2026`, `ESTATUTO_INICIAL`, `PODER_CLUB`.
Con eso ya arranca. Lo que sigue es lo que la lleva de "arranca" a **rigurosa**.

## Paso 3 · La época y la federación
```js
ERA["din2026"].desc = "Cómo se juega este torneo, en una frase.";
ERA["din2026"].pais = "dinamarca";          /* para que NO diga ANFP */
ERA["din2026"].puntosVictoria = 3;
```
Y en `js/federacion.js` sumá la federación (sigla, nombre, copa, ascenso) al mapa
`FEDERACIONES`, para que los textos digan la entidad correcta y no la chilena.

## Paso 4 · Lo que el auditor va a exigir club por club
Estos son los campos del `ESQUEMA_CLUB`. El editor te los muestra en rojo si faltan:

| Campo | Dónde vive | Qué es |
|---|---|---|
| Nombre / Descripción / Técnico | `CLUB_INFO_2026[id]` | quién es el club |
| Ciudad / Fundación / Colores | `CLUB_META[id]` | identidad |
| Indicadores (8) | `IND_BASE_2026[id]` | deriva de `fuerza` |
| Caja (plata, deuda) | `CAJA_BASE_2026[id]` | deriva de `fuerza` |
| Estatuto / Mapa de poder | `ESTATUTO_INICIAL`, `PODER_CLUB` | deriva |
| **Situación** | `SITUACION_CLUB[id]` | *por qué juego a esto* (1–2 frases) |
| **Historia** | `HISTORIA_LINEA[id]` | hitos `{anio,hito,txt}` |
| **Clásico** | `RIVALIDADES_2026` | pares `["AAA","BBB"]` reales y **variados** |
| **Época dorada** | `EPOCAS_CLUB[id]` | el botón de oro |
| **Estadio** | `ESTADIOS_DATA[id]` | `{nombre,aforo,sectores:[{n,tipo,cuota,precio}]}` |
| Escudo estilizado | `ESCUDOS_CLUB[id]` | `{c1,c2,txt}` (colores, sin copyright) |
| Escudo archivo *(opcional)* | `ESCUDOS_FOTOS[id]` | ver `img/FOTOS.txt` (footylogos) |
| Plantel real *(opcional)* | `PLANTELES_REALES[id]` | solo si está documentado |

Lo que **deriva** de `fuerza` ya viene gratis. Lo que hay que **escribir a mano** es
el alma: situación, historia, clásico, época dorada, estadio.

## Paso 5 · Cargar y medir
1. Agregá el `<script>` al final de `index.html`.
2. Abrí el juego → **Ajustes → Modo desarrollador** → clave → **Editor de contenido**.
3. Pestaña **Rigor**: buscá tu liga. Cada club es un botón con su %.
4. Clic en un club → pestaña **Club** → rellená lo que está en rojo → **Guardar**.
5. Pestaña **Exportar** → te da `data-parche-dev.js`. Guardalo en `js/`, agregalo a
   `index.html`, y queda permanente y versionado en git.

## Paso 6 · Antes de dar por cerrado
- `node --check js/*.js`
- `bash test/correr.sh` (tiene que quedar verde)
- El auditor en consola: `devInforme()` → tu liga en 100%.
- Una línea en `PATCHES.md`.

---

## Atajo: pedirlo en una frase
> "Copiando `PLANTILLA_LIGA.md`, armá la liga danesa 2026: array de clubes con
> datos verificados, registrarLiga, federación danesa, y el alma de cada club
> (situación, historia, clásico, época dorada, estadio). Lo que no esté
> documentado, a `DEV_SIN_DATO`."

Con eso el trabajo es rellenar la tabla del Paso 4, y el auditor dice cuándo está listo.
