"use strict";
/* ============================================================
   FUTBOLINI · data-fixture2026.js
   Liga de Primera 2026 para los 11 clubes que no tenían fixture propio.
   Sin esto, emparejarFecha inventaba la mitad de cada fecha.
   Misma fuente que LIGA_CC_2026: T13 (1/10/2026), cruzado con el anexo.
   La fecha 1 queda O'Higgins 2-1 D. Concepción (La Tercera, El Teniente).
   real es local-visita. null = no jugado. No se inventa el 2/10 (UDC-Huachipato).
   ============================================================ */
const LIGA_EVE_2026=[
 {fecha:1, f:{m:2,d:2}, rival:"CAL", local:true, real:"0-1"},
 {fecha:2, f:{m:2,d:7}, rival:"CC", local:false, real:"2-0"},
 {fecha:3, f:{m:2,d:13}, rival:"HUA", local:true, real:"0-3"},
 {fecha:4, f:{m:2,d:22}, rival:"AUD", local:false, real:"1-0"},
 {fecha:5, f:{m:3,d:1}, rival:"UDC", local:false, real:"0-3"},
 {fecha:6, f:{m:3,d:7}, rival:"LIM", local:true, real:"1-0"},
 {fecha:7, f:{m:3,d:14}, rival:"UC", local:false, real:"2-2"},
 {fecha:8, f:{m:4,d:4}, rival:"NUB", local:true, real:"0-0"},
 {fecha:9, f:{m:4,d:11}, rival:"LSE", local:false, real:"1-0"},
 {fecha:10, f:{m:4,d:18}, rival:"UCH", local:true, real:"0-0"},
 {fecha:11, f:{m:4,d:26}, rival:"COB", local:true, real:"3-1"},
 {fecha:12, f:{m:5,d:17}, rival:"DCO", local:false, real:"0-2"},
 {fecha:13, f:{m:5,d:22}, rival:"COQ", local:true, real:"1-1"},
 {fecha:14, f:{m:5,d:31}, rival:"OHI", local:false, real:"2-3"},
 {fecha:15, f:{m:6,d:13}, rival:"PAL", local:true, real:"1-2"},
 {fecha:16, f:{m:7,d:27}, rival:"CAL", local:false, real:"1-1"},
 {fecha:17, f:{m:8,d:1}, rival:"CC", local:true, real:"3-4"},
 {fecha:18, f:{m:8,d:8}, rival:"HUA", local:false, real:"1-4"},
 {fecha:19, f:{m:8,d:15}, rival:"AUD", local:true, real:"1-1"},
 {fecha:20, f:{m:8,d:24}, rival:"UDC", local:true, real:"3-1"},
 {fecha:21, f:{m:8,d:29}, rival:"LIM", local:false, real:"0-3"},
 {fecha:22, f:{m:9,d:5}, rival:"UC", local:true, real:"0-1"},
 {fecha:23, f:{m:9,d:12}, rival:"NUB", local:false, real:"1-3"},
 {fecha:24, f:{m:10,d:11}, rival:"LSE", local:true, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"UCH", local:false, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"COB", local:false, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"DCO", local:true, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"COQ", local:false, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"OHI", local:true, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"PAL", local:false, real:null},
];
const LIGA_COQ_2026=[
 {fecha:1, f:{m:1,d:31}, rival:"UDC", local:false, real:"1-0"},
 {fecha:2, f:{m:2,d:7}, rival:"PAL", local:true, real:"3-1"},
 {fecha:3, f:{m:2,d:14}, rival:"LSE", local:false, real:"0-1"},
 {fecha:4, f:{m:2,d:21}, rival:"UC", local:false, real:"3-1"},
 {fecha:5, f:{m:2,d:28}, rival:"DCO", local:true, real:"0-1"},
 {fecha:6, f:{m:3,d:7}, rival:"HUA", local:false, real:"1-3"},
 {fecha:7, f:{m:3,d:14}, rival:"UCH", local:true, real:"0-1"},
 {fecha:8, f:{m:4,d:3}, rival:"COB", local:true, real:"3-2"},
 {fecha:9, f:{m:5,d:3}, rival:"CC", local:false, real:"3-1"},
 {fecha:10, f:{m:4,d:19}, rival:"NUB", local:true, real:"1-1"},
 {fecha:11, f:{m:4,d:24}, rival:"CAL", local:false, real:"1-2"},
 {fecha:12, f:{m:5,d:15}, rival:"AUD", local:true, real:"3-0"},
 {fecha:13, f:{m:5,d:22}, rival:"EVE", local:false, real:"1-1"},
 {fecha:14, f:{m:5,d:31}, rival:"LIM", local:false, real:"2-3"},
 {fecha:15, f:{m:6,d:13}, rival:"OHI", local:true, real:"0-0"},
 {fecha:16, f:{m:9,d:2}, rival:"UDC", local:true, real:"1-0"},
 {fecha:17, f:{m:8,d:1}, rival:"PAL", local:false, real:"2-1"},
 {fecha:18, f:{m:8,d:8}, rival:"LSE", local:true, real:"1-1"},
 {fecha:19, f:{m:8,d:26}, rival:"UC", local:true, real:"1-2"},
 {fecha:20, f:{m:8,d:23}, rival:"DCO", local:false, real:"1-1"},
 {fecha:21, f:{m:9,d:16}, rival:"HUA", local:true, real:"0-1"},
 {fecha:22, f:{m:9,d:5}, rival:"UCH", local:false, real:"4-2"},
 {fecha:23, f:{m:9,d:12}, rival:"COB", local:false, real:"3-2"},
 {fecha:24, f:{m:10,d:11}, rival:"CC", local:true, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"NUB", local:false, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"CAL", local:true, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"AUD", local:false, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"EVE", local:true, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"LIM", local:true, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"OHI", local:false, real:null},
];
const LIGA_AUD_2026=[
 {fecha:1, f:{m:1,d:30}, rival:"UCH", local:false, real:"0-0"},
 {fecha:2, f:{m:2,d:6}, rival:"UDC", local:true, real:"3-0"},
 {fecha:3, f:{m:2,d:15}, rival:"NUB", local:false, real:"1-0"},
 {fecha:4, f:{m:2,d:22}, rival:"EVE", local:true, real:"1-0"},
 {fecha:5, f:{m:2,d:27}, rival:"CAL", local:false, real:"3-0"},
 {fecha:6, f:{m:3,d:7}, rival:"CC", local:true, real:"0-1"},
 {fecha:7, f:{m:3,d:13}, rival:"DCO", local:true, real:"3-0"},
 {fecha:8, f:{m:4,d:3}, rival:"OHI", local:false, real:"2-1"},
 {fecha:9, f:{m:4,d:11}, rival:"UC", local:true, real:"3-4"},
 {fecha:10, f:{m:4,d:19}, rival:"HUA", local:false, real:"3-2"},
 {fecha:11, f:{m:4,d:24}, rival:"LIM", local:true, real:"2-2"},
 {fecha:12, f:{m:5,d:15}, rival:"COQ", local:false, real:"3-0"},
 {fecha:13, f:{m:5,d:23}, rival:"COB", local:true, real:"2-1"},
 {fecha:14, f:{m:5,d:31}, rival:"PAL", local:false, real:"0-0"},
 {fecha:15, f:{m:6,d:12}, rival:"LSE", local:true, real:"1-1"},
 {fecha:16, f:{m:7,d:26}, rival:"UCH", local:true, real:"1-2"},
 {fecha:17, f:{m:7,d:31}, rival:"UDC", local:false, real:"0-1"},
 {fecha:18, f:{m:8,d:10}, rival:"NUB", local:true, real:"2-2"},
 {fecha:19, f:{m:8,d:15}, rival:"EVE", local:false, real:"1-1"},
 {fecha:20, f:{m:8,d:21}, rival:"CAL", local:true, real:"0-0"},
 {fecha:21, f:{m:8,d:30}, rival:"CC", local:false, real:"5-1"},
 {fecha:22, f:{m:9,d:4}, rival:"DCO", local:false, real:"0-1"},
 {fecha:23, f:{m:9,d:13}, rival:"OHI", local:true, real:"1-0"},
 {fecha:24, f:{m:10,d:10}, rival:"UC", local:false, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"HUA", local:true, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"LIM", local:false, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"COQ", local:true, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"COB", local:false, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"PAL", local:true, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"LSE", local:false, real:null},
];
const LIGA_HUA_2026=[
 {fecha:1, f:{m:1,d:31}, rival:"COB", local:false, real:"1-0"},
 {fecha:2, f:{m:2,d:8}, rival:"UCH", local:true, real:"2-1"},
 {fecha:3, f:{m:2,d:13}, rival:"EVE", local:false, real:"0-3"},
 {fecha:4, f:{m:2,d:21}, rival:"PAL", local:true, real:"2-1"},
 {fecha:5, f:{m:2,d:28}, rival:"LIM", local:false, real:"3-0"},
 {fecha:6, f:{m:3,d:7}, rival:"COQ", local:true, real:"1-3"},
 {fecha:7, f:{m:3,d:16}, rival:"CC", local:false, real:"2-0"},
 {fecha:8, f:{m:4,d:6}, rival:"UDC", local:true, real:"5-1"},
 {fecha:9, f:{m:4,d:10}, rival:"OHI", local:false, real:"0-2"},
 {fecha:10, f:{m:4,d:19}, rival:"AUD", local:true, real:"3-2"},
 {fecha:11, f:{m:4,d:26}, rival:"LSE", local:false, real:"0-0"},
 {fecha:12, f:{m:5,d:17}, rival:"CAL", local:true, real:"3-1"},
 {fecha:13, f:{m:5,d:24}, rival:"DCO", local:false, real:"2-0"},
 {fecha:14, f:{m:5,d:31}, rival:"UC", local:true, real:"0-3"},
 {fecha:15, f:{m:6,d:13}, rival:"NUB", local:false, real:"2-2"},
 {fecha:16, f:{m:7,d:25}, rival:"COB", local:true, real:"3-3"},
 {fecha:17, f:{m:8,d:2}, rival:"UCH", local:false, real:"2-0"},
 {fecha:18, f:{m:8,d:8}, rival:"EVE", local:true, real:"1-4"},
 {fecha:19, f:{m:8,d:17}, rival:"PAL", local:false, real:"5-1"},
 {fecha:20, f:{m:8,d:22}, rival:"LIM", local:true, real:"1-3"},
 {fecha:21, f:{m:9,d:16}, rival:"COQ", local:false, real:"0-1"},
 {fecha:22, f:{m:9,d:6}, rival:"CC", local:true, real:"0-0"},
 {fecha:23, f:{m:10,d:2}, rival:"UDC", local:false, real:null},
 {fecha:24, f:{m:10,d:10}, rival:"OHI", local:true, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"AUD", local:false, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"LSE", local:true, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"CAL", local:false, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"DCO", local:true, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"UC", local:false, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"NUB", local:true, real:null},
];
const LIGA_OHI_2026=[
 {fecha:1, f:{m:2,d:2}, rival:"DCO", local:true, real:"2-1"},
 {fecha:2, f:{m:2,d:7}, rival:"LSE", local:true, real:"1-0"},
 {fecha:3, f:{m:2,d:14}, rival:"LIM", local:false, real:"2-1"},
 {fecha:4, f:{m:2,d:21}, rival:"CC", local:true, real:"0-1"},
 {fecha:5, f:{m:2,d:28}, rival:"PAL", local:false, real:"4-2"},
 {fecha:6, f:{m:3,d:7}, rival:"UC", local:true, real:"1-0"},
 {fecha:7, f:{m:3,d:16}, rival:"CAL", local:false, real:"3-3"},
 {fecha:8, f:{m:4,d:3}, rival:"AUD", local:true, real:"2-1"},
 {fecha:9, f:{m:4,d:10}, rival:"HUA", local:true, real:"0-2"},
 {fecha:10, f:{m:4,d:19}, rival:"COB", local:false, real:"2-3"},
 {fecha:11, f:{m:4,d:25}, rival:"NUB", local:false, real:"0-2"},
 {fecha:12, f:{m:5,d:16}, rival:"UDC", local:true, real:"0-1"},
 {fecha:13, f:{m:6,d:18}, rival:"UCH", local:false, real:"2-0"},
 {fecha:14, f:{m:5,d:31}, rival:"EVE", local:true, real:"2-3"},
 {fecha:15, f:{m:6,d:13}, rival:"COQ", local:false, real:"0-0"},
 {fecha:16, f:{m:7,d:26}, rival:"DCO", local:false, real:"2-0"},
 {fecha:17, f:{m:8,d:2}, rival:"LSE", local:false, real:"1-2"},
 {fecha:18, f:{m:8,d:9}, rival:"LIM", local:true, real:"1-3"},
 {fecha:19, f:{m:8,d:16}, rival:"CC", local:false, real:"2-2"},
 {fecha:20, f:{m:8,d:23}, rival:"PAL", local:true, real:"0-1"},
 {fecha:21, f:{m:8,d:31}, rival:"UC", local:false, real:"3-2"},
 {fecha:22, f:{m:9,d:6}, rival:"CAL", local:true, real:"2-1"},
 {fecha:23, f:{m:9,d:13}, rival:"AUD", local:false, real:"1-0"},
 {fecha:24, f:{m:10,d:10}, rival:"HUA", local:false, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"COB", local:true, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"NUB", local:true, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"UDC", local:false, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"UCH", local:true, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"EVE", local:false, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"COQ", local:true, real:null},
];
const LIGA_NUB_2026=[
 {fecha:1, f:{m:2,d:1}, rival:"PAL", local:false, real:"1-1"},
 {fecha:2, f:{m:2,d:8}, rival:"LIM", local:true, real:"1-1"},
 {fecha:3, f:{m:2,d:15}, rival:"AUD", local:true, real:"1-0"},
 {fecha:4, f:{m:2,d:20}, rival:"CAL", local:false, real:"0-1"},
 {fecha:5, f:{m:3,d:1}, rival:"UC", local:true, real:"1-2"},
 {fecha:6, f:{m:3,d:6}, rival:"DCO", local:false, real:"0-2"},
 {fecha:7, f:{m:3,d:15}, rival:"LSE", local:true, real:"2-2"},
 {fecha:8, f:{m:4,d:4}, rival:"EVE", local:false, real:"0-0"},
 {fecha:9, f:{m:4,d:12}, rival:"UCH", local:true, real:"1-0"},
 {fecha:10, f:{m:4,d:19}, rival:"COQ", local:false, real:"1-1"},
 {fecha:11, f:{m:4,d:25}, rival:"OHI", local:true, real:"0-2"},
 {fecha:12, f:{m:5,d:17}, rival:"CC", local:false, real:"6-2"},
 {fecha:13, f:{m:5,d:23}, rival:"UDC", local:true, real:"2-2"},
 {fecha:14, f:{m:5,d:29}, rival:"COB", local:false, real:"0-1"},
 {fecha:15, f:{m:6,d:13}, rival:"HUA", local:true, real:"2-2"},
 {fecha:16, f:{m:7,d:26}, rival:"PAL", local:true, real:"2-0"},
 {fecha:17, f:{m:9,d:2}, rival:"LIM", local:false, real:"2-0"},
 {fecha:18, f:{m:8,d:10}, rival:"AUD", local:false, real:"2-2"},
 {fecha:19, f:{m:8,d:16}, rival:"CAL", local:true, real:"2-1"},
 {fecha:20, f:{m:8,d:22}, rival:"UC", local:false, real:"1-2"},
 {fecha:21, f:{m:8,d:29}, rival:"DCO", local:true, real:"0-1"},
 {fecha:22, f:{m:9,d:6}, rival:"LSE", local:false, real:"2-1"},
 {fecha:23, f:{m:9,d:12}, rival:"EVE", local:true, real:"1-3"},
 {fecha:24, f:{m:10,d:9}, rival:"UCH", local:false, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"COQ", local:true, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"OHI", local:false, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"CC", local:true, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"UDC", local:false, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"COB", local:true, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"HUA", local:false, real:null},
];
const LIGA_COB_2026=[
 {fecha:1, f:{m:1,d:31}, rival:"HUA", local:true, real:"1-0"},
 {fecha:2, f:{m:2,d:9}, rival:"CAL", local:false, real:"3-1"},
 {fecha:3, f:{m:2,d:14}, rival:"UC", local:true, real:"3-2"},
 {fecha:4, f:{m:2,d:20}, rival:"DCO", local:false, real:"1-1"},
 {fecha:5, f:{m:2,d:27}, rival:"LSE", local:true, real:"0-1"},
 {fecha:6, f:{m:3,d:8}, rival:"PAL", local:false, real:"4-2"},
 {fecha:7, f:{m:3,d:15}, rival:"LIM", local:true, real:"2-5"},
 {fecha:8, f:{m:4,d:3}, rival:"COQ", local:false, real:"3-2"},
 {fecha:9, f:{m:4,d:12}, rival:"UDC", local:false, real:"1-0"},
 {fecha:10, f:{m:4,d:19}, rival:"OHI", local:true, real:"2-3"},
 {fecha:11, f:{m:4,d:26}, rival:"EVE", local:false, real:"3-1"},
 {fecha:12, f:{m:5,d:17}, rival:"UCH", local:true, real:"1-0"},
 {fecha:13, f:{m:5,d:23}, rival:"AUD", local:false, real:"2-1"},
 {fecha:14, f:{m:5,d:29}, rival:"NUB", local:true, real:"0-1"},
 {fecha:15, f:{m:6,d:13}, rival:"CC", local:false, real:"3-0"},
 {fecha:16, f:{m:7,d:25}, rival:"HUA", local:false, real:"3-3"},
 {fecha:17, f:{m:8,d:1}, rival:"CAL", local:true, real:"4-0"},
 {fecha:18, f:{m:8,d:7}, rival:"UC", local:false, real:"2-0"},
 {fecha:19, f:{m:8,d:16}, rival:"DCO", local:true, real:"0-2"},
 {fecha:20, f:{m:8,d:23}, rival:"LSE", local:false, real:"3-3"},
 {fecha:21, f:{m:8,d:28}, rival:"PAL", local:true, real:"2-0"},
 {fecha:22, f:{m:9,d:7}, rival:"LIM", local:false, real:"3-0"},
 {fecha:23, f:{m:9,d:12}, rival:"COQ", local:true, real:"3-2"},
 {fecha:24, f:{m:10,d:10}, rival:"UDC", local:true, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"OHI", local:false, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"EVE", local:true, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"UCH", local:false, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"AUD", local:true, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"NUB", local:false, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"CC", local:true, real:null},
];
const LIGA_CAL_2026=[
 {fecha:1, f:{m:2,d:2}, rival:"EVE", local:false, real:"0-1"},
 {fecha:2, f:{m:2,d:9}, rival:"COB", local:true, real:"3-1"},
 {fecha:3, f:{m:2,d:15}, rival:"CC", local:false, real:"1-0"},
 {fecha:4, f:{m:2,d:20}, rival:"NUB", local:true, real:"0-1"},
 {fecha:5, f:{m:2,d:27}, rival:"AUD", local:true, real:"3-0"},
 {fecha:6, f:{m:3,d:6}, rival:"LSE", local:false, real:"3-0"},
 {fecha:7, f:{m:3,d:16}, rival:"OHI", local:true, real:"3-3"},
 {fecha:8, f:{m:4,d:4}, rival:"LIM", local:false, real:"4-0"},
 {fecha:9, f:{m:4,d:13}, rival:"DCO", local:true, real:"1-0"},
 {fecha:10, f:{m:4,d:20}, rival:"UC", local:false, real:"1-2"},
 {fecha:11, f:{m:4,d:24}, rival:"COQ", local:true, real:"1-2"},
 {fecha:12, f:{m:5,d:17}, rival:"HUA", local:false, real:"3-1"},
 {fecha:13, f:{m:5,d:23}, rival:"PAL", local:true, real:"1-2"},
 {fecha:14, f:{m:5,d:29}, rival:"UDC", local:false, real:"0-0"},
 {fecha:15, f:{m:6,d:14}, rival:"UCH", local:true, real:"2-2"},
 {fecha:16, f:{m:7,d:27}, rival:"EVE", local:true, real:"1-1"},
 {fecha:17, f:{m:8,d:1}, rival:"COB", local:false, real:"4-0"},
 {fecha:18, f:{m:8,d:9}, rival:"CC", local:true, real:"1-2"},
 {fecha:19, f:{m:8,d:16}, rival:"NUB", local:false, real:"2-1"},
 {fecha:20, f:{m:8,d:21}, rival:"AUD", local:false, real:"0-0"},
 {fecha:21, f:{m:8,d:31}, rival:"LSE", local:true, real:"0-1"},
 {fecha:22, f:{m:9,d:6}, rival:"OHI", local:false, real:"2-1"},
 {fecha:23, f:{m:9,d:14}, rival:"LIM", local:true, real:"1-0"},
 {fecha:24, f:{m:10,d:11}, rival:"DCO", local:false, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"UC", local:true, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"COQ", local:false, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"HUA", local:true, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"PAL", local:false, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"UDC", local:true, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"UCH", local:false, real:null},
];
const LIGA_LSE_2026=[
 {fecha:1, f:{m:2,d:1}, rival:"UC", local:true, real:"2-2"},
 {fecha:2, f:{m:2,d:7}, rival:"OHI", local:false, real:"1-0"},
 {fecha:3, f:{m:2,d:14}, rival:"COQ", local:true, real:"0-1"},
 {fecha:4, f:{m:2,d:22}, rival:"UDC", local:true, real:"1-1"},
 {fecha:5, f:{m:2,d:27}, rival:"COB", local:false, real:"0-1"},
 {fecha:6, f:{m:3,d:6}, rival:"CAL", local:true, real:"3-0"},
 {fecha:7, f:{m:3,d:15}, rival:"NUB", local:false, real:"2-2"},
 {fecha:8, f:{m:4,d:5}, rival:"UCH", local:false, real:"4-0"},
 {fecha:9, f:{m:4,d:11}, rival:"EVE", local:true, real:"1-0"},
 {fecha:10, f:{m:4,d:18}, rival:"DCO", local:false, real:"3-3"},
 {fecha:11, f:{m:4,d:26}, rival:"HUA", local:true, real:"0-0"},
 {fecha:12, f:{m:5,d:15}, rival:"PAL", local:false, real:"5-1"},
 {fecha:13, f:{m:5,d:24}, rival:"LIM", local:true, real:"4-1"},
 {fecha:14, f:{m:5,d:30}, rival:"CC", local:true, real:"2-4"},
 {fecha:15, f:{m:6,d:12}, rival:"AUD", local:false, real:"1-1"},
 {fecha:16, f:{m:7,d:25}, rival:"UC", local:false, real:"3-3"},
 {fecha:17, f:{m:8,d:2}, rival:"OHI", local:true, real:"1-2"},
 {fecha:18, f:{m:8,d:8}, rival:"COQ", local:false, real:"1-1"},
 {fecha:19, f:{m:8,d:14}, rival:"UDC", local:false, real:"0-2"},
 {fecha:20, f:{m:8,d:23}, rival:"COB", local:true, real:"3-3"},
 {fecha:21, f:{m:8,d:31}, rival:"CAL", local:false, real:"0-1"},
 {fecha:22, f:{m:9,d:6}, rival:"NUB", local:true, real:"2-1"},
 {fecha:23, f:{m:9,d:13}, rival:"UCH", local:true, real:"0-3"},
 {fecha:24, f:{m:10,d:11}, rival:"EVE", local:false, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"DCO", local:true, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"HUA", local:false, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"PAL", local:true, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"LIM", local:false, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"CC", local:false, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"AUD", local:true, real:null},
];
const LIGA_DCO_2026=[
 {fecha:1, f:{m:2,d:2}, rival:"OHI", local:false, real:"2-1"},
 {fecha:2, f:{m:2,d:8}, rival:"UC", local:false, real:"2-0"},
 {fecha:3, f:{m:2,d:15}, rival:"UDC", local:false, real:"2-1"},
 {fecha:4, f:{m:2,d:20}, rival:"COB", local:true, real:"1-1"},
 {fecha:5, f:{m:2,d:28}, rival:"COQ", local:false, real:"0-1"},
 {fecha:6, f:{m:3,d:6}, rival:"NUB", local:true, real:"0-2"},
 {fecha:7, f:{m:3,d:13}, rival:"AUD", local:false, real:"3-0"},
 {fecha:8, f:{m:4,d:5}, rival:"CC", local:true, real:"0-1"},
 {fecha:9, f:{m:4,d:13}, rival:"CAL", local:false, real:"1-0"},
 {fecha:10, f:{m:4,d:18}, rival:"LSE", local:true, real:"3-3"},
 {fecha:11, f:{m:4,d:23}, rival:"PAL", local:false, real:"0-1"},
 {fecha:12, f:{m:5,d:17}, rival:"EVE", local:true, real:"0-2"},
 {fecha:13, f:{m:5,d:24}, rival:"HUA", local:true, real:"2-0"},
 {fecha:14, f:{m:5,d:30}, rival:"UCH", local:false, real:"2-1"},
 {fecha:15, f:{m:6,d:14}, rival:"LIM", local:true, real:"3-2"},
 {fecha:16, f:{m:7,d:26}, rival:"OHI", local:true, real:"2-0"},
 {fecha:17, f:{m:8,d:2}, rival:"UC", local:true, real:"3-0"},
 {fecha:18, f:{m:8,d:9}, rival:"UDC", local:true, real:"1-0"},
 {fecha:19, f:{m:8,d:16}, rival:"COB", local:false, real:"0-2"},
 {fecha:20, f:{m:8,d:23}, rival:"COQ", local:true, real:"1-1"},
 {fecha:21, f:{m:8,d:29}, rival:"NUB", local:false, real:"0-1"},
 {fecha:22, f:{m:9,d:4}, rival:"AUD", local:true, real:"0-1"},
 {fecha:23, f:{m:9,d:13}, rival:"CC", local:false, real:"1-1"},
 {fecha:24, f:{m:10,d:11}, rival:"CAL", local:true, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"LSE", local:false, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"PAL", local:true, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"EVE", local:false, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"HUA", local:false, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"UCH", local:true, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"LIM", local:false, real:null},
];
const LIGA_UDC_2026=[
 {fecha:1, f:{m:1,d:31}, rival:"COQ", local:true, real:"1-0"},
 {fecha:2, f:{m:2,d:6}, rival:"AUD", local:false, real:"3-0"},
 {fecha:3, f:{m:2,d:15}, rival:"DCO", local:true, real:"2-1"},
 {fecha:4, f:{m:2,d:22}, rival:"LSE", local:false, real:"1-1"},
 {fecha:5, f:{m:3,d:1}, rival:"EVE", local:true, real:"0-3"},
 {fecha:6, f:{m:3,d:9}, rival:"UCH", local:false, real:"1-1"},
 {fecha:7, f:{m:3,d:15}, rival:"PAL", local:true, real:"1-0"},
 {fecha:8, f:{m:4,d:6}, rival:"HUA", local:false, real:"5-1"},
 {fecha:9, f:{m:4,d:12}, rival:"COB", local:true, real:"1-0"},
 {fecha:10, f:{m:4,d:17}, rival:"LIM", local:false, real:"3-0"},
 {fecha:11, f:{m:4,d:26}, rival:"CC", local:true, real:"1-2"},
 {fecha:12, f:{m:5,d:16}, rival:"OHI", local:false, real:"0-1"},
 {fecha:13, f:{m:5,d:23}, rival:"NUB", local:false, real:"2-2"},
 {fecha:14, f:{m:5,d:29}, rival:"CAL", local:true, real:"0-0"},
 {fecha:15, f:{m:6,d:14}, rival:"UC", local:false, real:"5-1"},
 {fecha:16, f:{m:9,d:2}, rival:"COQ", local:false, real:"1-0"},
 {fecha:17, f:{m:7,d:31}, rival:"AUD", local:true, real:"0-1"},
 {fecha:18, f:{m:8,d:9}, rival:"DCO", local:false, real:"1-0"},
 {fecha:19, f:{m:8,d:14}, rival:"LSE", local:true, real:"0-2"},
 {fecha:20, f:{m:8,d:24}, rival:"EVE", local:false, real:"3-1"},
 {fecha:21, f:{m:8,d:30}, rival:"UCH", local:true, real:"2-1"},
 {fecha:22, f:{m:9,d:6}, rival:"PAL", local:false, real:"2-1"},
 {fecha:23, f:{m:10,d:2}, rival:"HUA", local:true, real:null},
 {fecha:24, f:{m:10,d:10}, rival:"COB", local:false, real:null},
 {fecha:25, f:{m:10,d:25}, rival:"LIM", local:true, real:null},
 {fecha:26, f:{m:11,d:1}, rival:"CC", local:false, real:null},
 {fecha:27, f:{m:11,d:8}, rival:"OHI", local:true, real:null},
 {fecha:28, f:{m:11,d:22}, rival:"NUB", local:true, real:null},
 {fecha:29, f:{m:11,d:29}, rival:"CAL", local:false, real:null},
 {fecha:30, f:{m:12,d:6}, rival:"UC", local:true, real:null},
];

(function(){
  if(typeof FIXTURES_OFICIALES!=="object") return;
  var mapa={
    EVE:LIGA_EVE_2026, COQ:LIGA_COQ_2026, AUD:LIGA_AUD_2026, HUA:LIGA_HUA_2026,
    OHI:LIGA_OHI_2026, NUB:LIGA_NUB_2026, COB:LIGA_COB_2026, CAL:LIGA_CAL_2026,
    LSE:LIGA_LSE_2026, DCO:LIGA_DCO_2026, UDC:LIGA_UDC_2026
  };
  Object.keys(mapa).forEach(function(id){
    if(!FIXTURES_OFICIALES[id]) FIXTURES_OFICIALES[id]={};
    FIXTURES_OFICIALES[id][2026]=mapa[id];
  });
})();


devDoctorRegistrar({
  id:"fixture_primera_2026",
  area:"contenido",
  n:"Liga de Primera 2026: los 16 clubes tienen las 30 fechas (T13)",
  arreglo:"js/data-fixture2026.js, js/data-liga.js y js/data-grok.js. real es local-visita. El 2/10 UDC-Huachipato queda null.",
  fn:function(){
    var ids=["CC","UCH","UC","EVE","PAL","COQ","AUD","HUA","OHI","NUB","COB","CAL","LSE","DCO","UDC","LIM"];
    var mal=[];
    if(typeof FIXTURES_OFICIALES!=="object") return _dmal("no hay FIXTURES_OFICIALES");
    ids.forEach(function(id){
      var fx=(FIXTURES_OFICIALES[id]||{})[2026];
      if(!fx||fx.length!==30) mal.push(id+" no tiene 30 fechas");
    });
    var ohi=((FIXTURES_OFICIALES.OHI||{})[2026]||[]).filter(function(p){ return p.fecha===1; })[0];
    if(!ohi||ohi.rival!=="DCO"||ohi.local!==true||ohi.real!=="2-1") mal.push("la fecha 1 no es O'Higgins 2-1 D. Concepción");
    var cc20=((FIXTURES_OFICIALES.CC||{})[2026]||[]).filter(function(p){ return p.fecha===20; })[0];
    if(!cc20||cc20.real!=="1-2"||cc20.local!==false) mal.push("Colo-Colo fecha 20 (en la U) no es 1-2");
    var udc=((FIXTURES_OFICIALES.UDC||{})[2026]||[]).filter(function(p){ return p.fecha===23; })[0];
    if(!udc||udc.rival!=="HUA"||udc.real!==null) mal.push("U. de Concepción vs Huachipato del 2/10 no tiene que traer marcador");
    if(typeof CORTE_2026!=="object"||CORTE_2026.m!==10||CORTE_2026.d!==1) mal.push("el corte no está en el 1/10");
    if(!TABLA_2026_CORTE||!TABLA_2026_CORTE.CC||TABLA_2026_CORTE.CC.pts!==54||TABLA_2026_CORTE.CC.pj!==23) mal.push("la tabla del corte no tiene a Colo-Colo con 54 puntos");
    if(!TABLA_2026_CORTE.UDC||TABLA_2026_CORTE.UDC.pj!==22||!TABLA_2026_CORTE.HUA||TABLA_2026_CORTE.HUA.pj!==22) mal.push("UDC o Huachipato no están en 22 PJ");
    for(var n=1;n<=30;n++){
      var visto={}, pares=0, roto=false;
      ids.forEach(function(id){
        var fx=(FIXTURES_OFICIALES[id]||{})[2026]||[];
        var m=null;
        for(var i=0;i<fx.length;i++) if(fx[i].fecha===n) m=fx[i];
        if(!m){ roto=true; return; }
        var casa=m.local?id:m.rival, vis=m.local?m.rival:id;
        var k=casa<vis?casa+"-"+vis:vis+"-"+casa;
        if(visto[k]) return;
        if(visto[casa]||visto[vis]) roto=true;
        visto[k]=1; visto[casa]=visto[vis]=1; pares++;
        var otro=((FIXTURES_OFICIALES[m.rival]||{})[2026]||[]).filter(function(p){ return p.fecha===n; })[0];
        if(!otro||otro.rival!==id||otro.local===m.local||otro.real!==m.real){ mal.push("fecha "+n+" "+id+" no calza con "+m.rival); }
      });
      if(roto||pares!==8) mal.push("fecha "+n+" no cierra en 8 partidos");
    }
    return mal.length?_dmal(mal[0], mal.slice(0,8)):_dok("16 clubes × 30 fechas, corte al 1/10, Colo-Colo 54 pts");
  }
});

