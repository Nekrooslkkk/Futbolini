#!/usr/bin/env bash
# PARTIDA PERDIDA (7.9125): guardar, mudar a IndexedDB, recuperar y "Continuar", en el navegador de verdad (Playwright).
# Va dentro de correr_dev.sh. Sin Playwright avisa y no falla (el doctor igual revisa lo mismo sobre localStorage).
set -uo pipefail
cd "$(dirname "$0")/.."
if ! command -v node >/dev/null 2>&1; then echo "⚠ Sin node: no se prueban las partidas guardadas."; exit 0; fi
if [ -f /opt/node22/lib/node_modules/playwright/index.mjs ] || node -e "require.resolve('playwright')" >/dev/null 2>&1; then
  timeout 600 node test/partidas.mjs
else echo "⚠ Sin Playwright: las partidas guardadas no se prueban de punta a punta (el doctor sí)."; exit 0; fi
