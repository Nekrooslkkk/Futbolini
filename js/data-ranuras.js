"use strict";
/* ============================================================
   FUTBOLINI · data-ranuras.js — 7.9082 · IMÁGENES QUE PUEDE PONER UN HUMANO
   ------------------------------------------------------------
   ESTE ARCHIVO ES PARA EDITAR A MANO (Vicente, VS Code). Cómo:
     1. Haz la imagen (ver GUIA_HUMANO.md: medidas, estilo y prompts).
     2. Guárdala EXACTAMENTE con el nombre de `archivo` (minúsculas, sin espacios).
     3. Cambia `listo:false` por `listo:true` en su línea. Nada más.
   Si una imagen no está o está en false, el juego usa el emoji de siempre: nunca se rompe.
   El doctor (`ranuras_img`) te avisa si marcaste listo algo que no está, o si dejaste
   una imagen en la carpeta y te olvidaste de marcarla.
   Reglas: sin copyright (tuya, CC0 o generada por ti), PNG con fondo transparente para
   íconos, JPG para el fondo. Nada de escudos ni logos reales de marcas.
   ============================================================ */
const RANURAS_IMG=[
  /* fondo de escritorio (se ve en los bordes y detrás del Escritorio) */
  {id:"fondo",        archivo:"img/aero/fondo.jpg",           listo:false, medida:"1920×1080 JPG, < 400 KB", que:"Fondo Frutiger Aero: cielo celeste, pasto verde brillante, burbujas, luz. Sin gente ni texto."},
  {id:"logo",         archivo:"img/aero/logo.png",            listo:false, medida:"512×512 PNG transparente", que:"Logo de Futbolini: pelota glossy/vidrio con brillo, estilo ícono Vista. Sin letras."},
  /* íconos del menú lateral y del dock del celular (uno por sección) */
  {id:"sec-escritorio",  archivo:"img/aero/sec-escritorio.png",  listo:false, medida:"128×128 PNG transparente", que:"Escritorio: carpeta de documentos / pizarra con papeles."},
  {id:"sec-institucion", archivo:"img/aero/sec-institucion.png", listo:false, medida:"128×128 PNG transparente", que:"Institución: edificio con columnas (sede del club)."},
  {id:"sec-finanzas",    archivo:"img/aero/sec-finanzas.png",    listo:false, medida:"128×128 PNG transparente", que:"Finanzas: bolsa de monedas / billetera verde."},
  {id:"sec-plantel",     archivo:"img/aero/sec-plantel.png",     listo:false, medida:"128×128 PNG transparente", que:"Plantel: dos camisetas o siluetas de jugadores."},
  {id:"sec-mercado",     archivo:"img/aero/sec-mercado.png",     listo:false, medida:"128×128 PNG transparente", que:"Mercado: maleta / apretón de manos."},
  {id:"sec-estadio",     archivo:"img/aero/sec-estadio.png",     listo:false, medida:"128×128 PNG transparente", que:"Estadio: estadio visto desde arriba con focos."},
  {id:"sec-redes",       archivo:"img/aero/sec-redes.png",       listo:false, medida:"128×128 PNG transparente", que:"PLOP!: pajarito/gota roja glossy (la red social del juego)."},
  {id:"sec-calendario",  archivo:"img/aero/sec-calendario.png",  listo:false, medida:"128×128 PNG transparente", que:"Calendario: hoja de calendario con un balón."},
  {id:"sec-historia",    archivo:"img/aero/sec-historia.png",    listo:false, medida:"128×128 PNG transparente", que:"Historia: libro antiguo / copa con laureles."},
  {id:"sec-carrera",     archivo:"img/aero/sec-carrera.png",     listo:false, medida:"128×128 PNG transparente", que:"Carrera: medalla / credencial de DT."},
  {id:"sec-vida",        archivo:"img/aero/sec-vida.png",        listo:false, medida:"128×128 PNG transparente", que:"Vida: casa con corazón / foto familiar enmarcada."},
  {id:"sec-avisos",      archivo:"img/aero/sec-avisos.png",      listo:false, medida:"128×128 PNG transparente", que:"Avisos: sobre de correo con campanita."}
];
