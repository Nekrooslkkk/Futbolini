#!/usr/bin/env bash
# ESCRITORIO VISTA (7.9146): el escritorio y el correo usados de verdad en un navegador (Playwright). Va dentro de correr_dev.sh.
set -uo pipefail
cd "$(dirname "$0")/.."
if ! command -v node >/dev/null 2>&1; then echo "⚠ Sin node: no se prueba el escritorio."; exit 0; fi
if [ -f /opt/node22/lib/node_modules/playwright/index.mjs ] || node -e "require.resolve('playwright')" >/dev/null 2>&1; then
  timeout 600 node test/escritorio.mjs
else echo "⚠ Sin Playwright: el escritorio no se prueba de punta a punta (el doctor escritorio_vista sí lo revisa)."; exit 0; fi
