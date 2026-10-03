#!/usr/bin/env bash
# CANCHA 3D (7.9126): un partido en 3D en el navegador de verdad (Playwright, WebGL por software). Va dentro de correr_dev.sh.
set -uo pipefail
cd "$(dirname "$0")/.."
if ! command -v node >/dev/null 2>&1; then echo "⚠ Sin node: no se prueba la cancha 3D."; exit 0; fi
if [ -f /opt/node22/lib/node_modules/playwright/index.mjs ] || node -e "require.resolve('playwright')" >/dev/null 2>&1; then
  timeout 600 node test/cancha3d.mjs
else echo "⚠ Sin Playwright: la cancha 3D no se prueba de punta a punta (el doctor sí revisa la simulación)."; exit 0; fi
