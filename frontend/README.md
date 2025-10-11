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
- `src/components/navigation/` — App-level navigation (breadcrumbs)
- `src/components/providers/` — Theme and view mode providers
- `src/types/` — TypeScript types
- `src/data/mock/` — Mock data for local development

## UI System

See `frontend/README-UI.md` for tokens, accessibility patterns, and component APIs.

### Breadcrumbs
- Global breadcrumbs are rendered in `AppShell` via `AppBreadcrumbs`.
- Auto-generates from the current path and maps common segments to friendly labels.
- Uses shadcn-style primitives in `src/components/ui/breadcrumb.tsx`.

## Notes

- Tailwind tokens defined in `src/app/globals.css` (dark mode supported)
- Mark interactive components with `"use client"`
- Prefer composing primitives over ad-hoc styles

## View Modes

The app supports two view modes toggled from the top navbar:

- Salon View (`customer`):
  - Map colors by competitive status and shows customer-focused details.
  - Analytics shows Pricing Intelligence and Revenue Opportunities.
  - Monitoring shows Price Trends.
  - Business modal tabs: Overview, Competitive Edge.

- BeamBell View (`admin`):
  - Map colors by AI vs Human and adds a Sales Actions CTA in popups.
  - Analytics shows Lead Insights (top conversion candidates) and AI Usage Overview.
  - Monitoring shows AI Adoption and Outreach Activity by status.
  - Business modal tabs: Overview, AI Analysis, Sales Actions.
  - Home shows an embedded BeamBell AI demo (Coval) with clear actions to open in a new tab or copy the demo link.

## Learn More

- Next.js docs: https://nextjs.org/docs
