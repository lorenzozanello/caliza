#!/bin/bash
# Prepara web/ en sesiones de Claude Code en la nube: dependencias, .env de desarrollo y contenido de ejemplo.
set -euo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
cd "$CLAUDE_PROJECT_DIR/web"
npm install --no-audit --no-fund
[ -f .env ] || { cp .env.example .env; sed -i "s|^PAYLOAD_SECRET=.*|PAYLOAD_SECRET=$(openssl rand -hex 24)|" .env; }
[ -f caliza.db ] || npm run seed
