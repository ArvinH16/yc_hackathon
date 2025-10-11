#!/usr/bin/env bash
set -euo pipefail

# Minimal docs guard. If API/env changed, require a doc file staged.

[[ "${SKIP_DOCS_CHECK:-}" == "1" ]] && exit 0

CHANGED=$(git diff --cached --name-only)
needs_docs=(backend/server.py backend/env.example)
docs_ok=(docs/api/backend.md backend/README.md README.md CHANGELOG.md)

trigger=0
for f in $CHANGED; do
  for t in "${needs_docs[@]}"; do [[ "$f" == "$t" ]] && trigger=1; done
done

[[ $trigger -eq 0 ]] && exit 0

for f in $CHANGED; do
  for d in "${docs_ok[@]}"; do [[ "$f" == "$d" ]] && exit 0; done
done

echo "Docs check: Update docs when changing backend API/env."
echo "Stage one of: docs/api/backend.md, backend/README.md, README.md, CHANGELOG.md"
echo "Bypass: SKIP_DOCS_CHECK=1 git commit -m '...' (use sparingly)"
exit 1
