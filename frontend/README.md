## Frontend — Overview

Next.js (App Router) dashboard for customer maps, analytics, monitoring, and basic CRM. Implements a local shadcn-inspired UI system built on Tailwind v4.

## Getting Started

Run the dev server:

```
npm install
npm run dev
```

Open http://localhost:3000 to view the app. Pages live under `src/app/`.

## Scripts

- `dev` — start development server
- `build` — production build
- `start` — run production server
- `lint` — run linting (if configured)

## Structure

- `src/app/` — App Router pages/layouts
- `src/components/ui/` — UI primitives (button, card, dialog, table, tabs, etc.)
- `src/components/layout/` — Shell components (Navbar, Sidebar, AppShell)
- `src/components/providers/` — Theme and view mode providers
- `src/types/` — TypeScript types
- `src/data/mock/` — Mock data for local development

## UI System

See `frontend/README-UI.md` for tokens, accessibility patterns, and component APIs.

## Notes

- Tailwind tokens defined in `src/app/globals.css` (dark mode supported)
- Mark interactive components with `"use client"`
- Prefer composing primitives over ad-hoc styles

## Learn More

- Next.js docs: https://nextjs.org/docs
