# Prompt para Grok — Contenido de realismo para Futbolini

Este archivo es para pegarle a Grok (o a cualquier LLM con buen conocimiento del fútbol
chileno) y que devuelva **datos listos para pegar** en el juego. Futbolini es 100% offline:
Grok **no corre dentro del juego**, solo genera texto que después copiamos a los `data-*.js`.

---

## Contexto que Grok debe leer primero

Futbolini es un simulador satírico de conducción de clubes chilenos (estética Frutiger Aero /
Windows Vista). Manejás una *institución*, no solo un equipo: barra, prensa, directorio,
sponsors, hinchada, plata. El tono es **chileno/neutro, seco, gracioso y humano**, tipo crónica
de barrio. NO es solemne ni corporativo.

### Reglas DURAS (no romper nunca)
1. **Español chileno/neutro, SIN lenguaje inclusivo** (nada de "-e": es "todos", "jugadores", "la gente").
2. **Nombres reales OK** (clubes, jugadores, periodistas, estadios), pero:
   - Las **estadísticas son estimadas**, nunca se presentan como oficiales.
   - **NUNCA inventar declaraciones reales** atribuidas a una persona real como si las hubiera
     dicho de verdad. Un periodista real puede *preguntar* algo genérico dentro del juego; un
     jugador/DT real NO puede tener frases inventadas presentadas como citas textuales suyas.
   - El que declara en el juego es **el DT que maneja el usuario** (personaje del jugador), no una figura real.
3. **Nada de contenido que dañe a una persona real** (ni acusaciones, ni datos privados, ni burlas crueles).
4. **Sin copyright**: nada de letras de canciones, ni textos largos calcados de otra fuente.
5. Humor sí, mala leche gratis no. Se ríe *con* la cultura del fútbol chileno, no *de* una persona.

---

## Lo que necesito (elegí una tanda por respuesta y devolvé SOLO el array JS pedido)

### A) Tuits de PLOP / FutbolGram atados al MOMENTO del partido
No al relato literal, sino a lo que **está pasando ahora** (va ganando, le expulsaron a uno, metió
el 9 un hat-trick, penal errado, se le fue en tiempo). Voz de hincha, de meme, de cuenta troll,
de periodista. Cortos (máx ~140 caracteres). Variados en tono.

Formato:
```js
// contexto: uno de "gana_agonico" | "pierde_local" | "expulsion" | "hat_trick" |
//           "penal_errado" | "remontada" | "goleada_favor" | "clasico_gana" | "arquero_figura"
{ ctx:"hat_trick", quien:"@hincha", txt:"..." },
```
Dame ~8 por contexto. `quien` puede ser un handle inventado genérico (@doña_clarita, @barra_del_fondo,
@datofutbol) o el nombre de un medio real (para tuits "de prensa"), nunca una persona real citada textual.

### B) Preguntas de conferencia / sala de prensa (periodista real que PREGUNTA)
Preguntas genéricas y realistas que un periodista chileno haría en una previa o post-partido,
según el contexto. El periodista solo pregunta; nunca le pongas una opinión inventada como cita.

Formato:
```js
// situacion: "previa_favorito" | "post_derrota" | "racha_sin_ganar" | "clasico_previa" |
//            "post_goleada" | "figura_juvenil" | "rumor_venta"
{ sit:"post_derrota", q:"..." },
```
Dame ~6 por situación. Naturales, no acartonadas.

### C) Trivia real de fútbol (para el minijuego de pizarra)
Preguntas de cultura futbolística **verificables y simples** (reglas, historia básica, sentido común),
con 3 opciones y el índice de la correcta. Nada polémico ni de fechas exactas dudosas.

Formato:
```js
{ q:"¿...?", op:["...","...","..."], sol:1 },
```
Dame ~15.

### D) Nombres de relleno chilenos (jugadores de cantera, periodistas ficticios, barras)
Para mezclar con los reales sin quedarnos cortos. Nombres y apodos creíbles del ambiente chileno.

Formato: un array de strings.

### E) STORYLINES / arcos de equipo (lo más importante para la 7.00)
Cada club merece SU historia propia: un conflicto identitario real de ese club, contado en 2-3 capítulos
donde el DT decide y las decisiones dejan huella. Ya existen los de U (estadio propio), Colo (el peso del
más grande), UC (esencia cruzada), Palestino (comunidad) y Limache (pueblo chico en primera). Faltan los
demás clubes chilenos. Para cada club dame **un arco** con la identidad REAL de ese club (su historia, su
gente, su ciudad, su drama típico) — con respeto, sin meterte en política ni inventar declaraciones reales.

Formato EXACTO (así se pega directo en `js/data-storylines.js` → `ARCOS_EQUIPO`):
```js
CLUBID: [{
  id:"clubid_tema", t:"Título corto", desc:"Enganche de una línea.",
  // era: "actual" | "historico" | omitir (aplica siempre)
  capitulos:[
    {id:"c1", t:"Título del capítulo", ctx:"Situación en 2-3 frases, con color chileno.",
     ops:[
       {t:"Opción A", d:"Consecuencia en una línea.", grupos:{hinchada:12,directorio:-6}, mem:"lo que hiciste, en 2ª persona", va:"c2"},
       {t:"Opción B", d:"...", ef:{plata:80}, grupos:{sponsors:10,comunidad:-8}, mem:"...", va:"c2"}
     ]},
    {id:"c2", t:"...", ctx:"...", ops:[
       {t:"Cierre bueno", d:"...", ef:{prestigio:8}, grupos:{comunidad:12,hinchada:10}, mem:"...", cierra:true},
       {t:"Cierre frío", d:"...", grupos:{directorio:8,hinchada:-10}, mem:"...", cierra:true}
     ]}
  ]
}],
```
Reglas de los efectos: `ef` acepta `plata,moral,prestigio,capital`; `grupos` acepta
`directorio,socios,hinchada,camarin,tecnico,prensa,anfp,sponsors,comunidad` (valores ~ -18..+18);
`rep` acepta `publica,credibilidad,dureza`. `mem` SIEMPRE en 2ª persona ("bancaste…", "vendiste…").
`va` apunta al id del siguiente capítulo; `cierra:true` termina el arco. Ids de club: usá los del juego
(CC, UCH, UC, PAL, LIM, y los que tengan los planteles 2026). 2-3 capítulos, 2-3 opciones cada uno.

### F) Logros bizarros pero reales (para la sección Logros)
Ideas de logros graciosos pero de verdad alcanzables jugando (como "Bomba de hidrógeno vs bomba de
hidrógeno" = meter un penal con el arquero). Cada uno con un nombre con gracia y una condición clara.

Formato:
```js
{ id:"slug", n:"Nombre con gracia", d:"Cómo se consigue, en una línea." },
```
Dame ~10, con condiciones que se puedan detectar en el juego (goles, tarjetas, rachas, mercado, barra…).

---

## Cómo devolver
- **Solo el bloque de código JS** pedido, listo para pegar. Sin explicaciones alrededor.
- Si algo roza una regla dura, omitilo en silencio y seguí con el resto.
- Mantené el largo corto: esto se lee en pantallas de celular.

---

## Dónde lo pega el desarrollador (referencia interna, no para Grok)
- Tuits (A) → `js/redes.js` (pools de `tickerPost` / `tickerAmbiente` / `actualidadRedes`).
- Preguntas de prensa (B) → `js/ui-partido.js` (`preguntasConferencia`, `preguntasPostPartido`).
- Trivia (C) → `js/partido.js` (`TRIVIA_FUTBOL`).
- Nombres (D) → `js/data-plantel.js` / pool de periodistas en `js/ui-partido.js` (`PERIODISTAS`).
- Storylines (E) → `js/data-storylines.js` (`ARCOS_EQUIPO`). El formato está documentado arriba del archivo.
- Logros (F) → `js/logros.js` (`LOGROS`), y hay que engancharles el hook que los desbloquea.
