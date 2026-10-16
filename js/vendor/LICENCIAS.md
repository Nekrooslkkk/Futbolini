# Librerías de terceros guardadas en el repo (no se actualizan: mantenimiento eterno)

| Archivo | Qué es | Versión | Licencia | Fuente |
|---|---|---|---|---|
| `three.min.js` | three.js (3D del balón parado) | r149 | MIT | https://github.com/mrdoob/three.js |
| `peerjs.min.js` | PeerJS (salas de duelo: presenta a los dos navegadores; el juego va directo por WebRTC) | 1.5.4 | MIT | https://github.com/peers/peerjs (copiado de cdnjs) |

Las dos se cargan recién cuando se usan (`<link rel="alternate">` en index.html; el service worker las guarda para
jugar sin internet). PeerJS usa por defecto el buzón público gratuito de PeerJS (0.peerjs.com) solo para que los dos
navegadores se encuentren; si algún día hay servidor propio, se cambia en `_mpPeer()` de `js/multi.js`.

Modelos (no son librerías, pero tampoco se tocan): `img/modelos/jugador.glb` — maniquí animado de Quaternius, CC0 1.0 (7.9134: + animaciones de la Universal Animation Library 2, también CC0) · `img/modelos/jugador_real.glb` (7.9139) — jugador realista de los «Universal Base Characters [Standard]» de Quaternius, CC0 1.0
(ver `img/FUENTES.md`, sección Modelos 3D). Lo lee `js/modelo3d.js` con un lector glTF propio (sin librerías nuevas).
