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

---

## Cómo devolver
- **Solo el bloque de código JS** pedido, listo para pegar. Sin explicaciones alrededor.
- Si algo roza una regla dura, omitilo en silencio y seguí con el resto.
- Mantené el largo corto: esto se lee en pantallas de celular.

---

## Dónde lo pega el desarrollador (referencia interna, no para Grok)
- Tuits (A) → `js/redes.js` (pools de `actualidadRedes` / `tuitDesdeActualidad`).
- Preguntas de prensa (B) → `js/ui-partido.js` (`preguntasConferencia`, `preguntasPostPartido`).
- Trivia (C) → `js/partido.js` (`TRIVIA_FUTBOL`).
- Nombres (D) → `js/data-plantel.js` / pool de periodistas en `js/ui-partido.js` (`PERIODISTAS`).
