#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if command -v node >/dev/null 2>&1; then
  grade_node="$(command -v node)"
else
  grade_node="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ ! -x "$grade_node" ]]; then
  echo 'Install Node.js, then run pnpm install and try again.' >&2
  exit 1
fi
if [[ ! -f node_modules/vite/bin/vite.js ]]; then
  echo 'Dependencies are missing. Run pnpm install in the project directory.' >&2
  exit 1
fi
exec "$grade_node" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort
