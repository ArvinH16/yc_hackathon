# Repo Agent Rules (Simple)

Keep it simple. When code changes user-visible behavior, update docs in the same PR.

- If `backend/server.py` or `backend/env.example` change, stage a doc change in at least one of:
  - `docs/api/backend.md`, `backend/README.md`, `README.md`, `CHANGELOG.md`
- Run `.claude/commands/docs-check.md` for a quick staged-change check.
- Local guard: `git config core.hooksPath .githooks` (uses `scripts/docs-guard.sh`).
- Bypass only if truly internal: `SKIP_DOCS_CHECK=1 git commit -m "..."`.

That’s it. Less is more.
