---
allowed-tools: Bash(git diff:*), Bash(git rev-parse:*), Bash(git status:*), Read
description: Minimal staged-change check to ensure docs updated with API/env changes
---

# Docs Check — Minimal

1) List staged files:
```
git rev-parse --git-dir >/dev/null || exit 0
git diff --cached --name-only
```

2) If `backend/server.py` or `backend/env.example` is staged, ensure one of these is also staged:
- `docs/api/backend.md`
- `backend/README.md`
- `README.md`
- `CHANGELOG.md`

3) If not, tell the developer: “Update docs before committing.”

That’s it.

