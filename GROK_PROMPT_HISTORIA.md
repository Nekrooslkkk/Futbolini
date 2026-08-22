# Prompt para Grok — Épocas históricas de cada club (Futbolini 7.00)

Futbolini es un simulador de conducción de clubes chilenos: REALISTA en los datos, planteles
e historias (títulos, campañas, gente real), pero con harto humor y sátira chilena. Tiene de
todo: gestión seria, drama, prensa, barra y también la joda. 100% offline, JS vanilla. Ya
generaste los planteles 2026 y la "voz". Ahora queremos que **cada club tenga su época de
gloria jugable** (como Colo-Colo tiene 1989/1991), para arrancar la carrera desde ahí.

## Reglas duras (no romper)
Español chileno/neutro SIN lenguaje inclusivo. Nombres reales OK pero **stats estimadas**,
nunca oficiales. **NUNCA** frases inventadas atribuidas a personas reales como citas. La
historia se apoya en hechos públicos (títulos, campañas); todo lo demás es ficción del juego.
Sin copyright.

## Qué necesito por cada club (una época histórica real y jugable)
Elegí el **hito real** de cada club y armá su base para arrancar ese año:

- **UCH · 2011** — el equipo de Sampaoli, campeón de la Copa Sudamericana (invicto).
  (El plantel `PLANTEL_UCH_2011` ya existe; solo faltan indicadores/caja/historia de esa época.)
- **UC · 2019** — arranque del **tetracampeonato (2019-2022)**: la base con la que empiezan
  a ganar. Plantel 2019 + historia.
- **COQ** — su mejor época reciente (subcampeonato / gran campaña).
- **OHI** — campeón 2013-2014 (la era Cristóbal Campos / Ramón Fernández, etc.).
- **HUA** — campeón 2012 (Apertura) o 2023.
- **AUD** — su mejor camada de los 2000.
- **EVE** — campeón 2008.
- **NUB / COB / CAL / LSE / DCO / UDC** — su hito o mejor época real (ascensos históricos,
  campañas de copa, la época dorada del club). Si un club no tiene un hito grande, usá su
  mejor temporada reciente.

## Formato EXACTO a devolver (para pegar directo)

### 1) Registro de la época (uno por club, en un objeto EPOCAS_CLUB_ADD)
```js
CLUBID:[{ anio:2011, etq:"2011 · La Sudamericana", desc:"1-2 frases del contexto real (qué se logró y con qué idea de juego).", squad:"PLANTEL_UCH_2011", ind:{plantel:82,moral:70,hinchada:80,socios:60,cantera:60,estadio:45,prestigio:76,riesgo:24}, caja:{plata:400,deuda:600} }],
```
- `anio`: el año de arranque de esa época.
- `etq`: etiqueta corta para el botón del selector.
- `desc`: contexto real, seco y chileno.
- `squad`: el NOMBRE de la constante del plantel (ej "PLANTEL_UCH_2011"). Si el plantel no
  existe todavía, generalo abajo (punto 2) con ese nombre.
- `ind`: indicadores 0-100 coherentes con ese equipo en su mejor momento.
- `caja`: plata/deuda de la época (millones).

### 2) Planteles que falten (formato de siempre)
```js
const PLANTEL_UC_2019=[
 ["Nombre Apellido","POS",edad,nivel,proy,sueldo,valor,["rasgos"]],
 ...
];
```
- POS: "ARQ"|"DEF"|"VOL"|"DEL". 22-25 jugadores. nivel/proy 20-90. sueldo/valor en millones.
- rasgos (0-2): "canterano","extranjero","contención","proyección","ídolo","de la casa",
  "velocidad","enganche","juego aéreo","tiro libre","penales","desequilibrio",
  "cabeza caliente","frio de definicion","llegador".
- Nombres REALES de ese plantel (de referencia), stats estimadas.

### 3) (opcional) Micro-historia real para la vista Historia
Un par de líneas por club/época con los hechos reales (campeón de X, invicto, etc.), para
mostrar en la sección Historia. Formato libre, corto.

## Cómo devolver
Solo el código, agrupado: primero todos los `const PLANTEL_*` nuevos, después el objeto
`EPOCAS_CLUB_ADD` con todas las entradas. Si algo roza una regla dura, omitilo y seguí.
