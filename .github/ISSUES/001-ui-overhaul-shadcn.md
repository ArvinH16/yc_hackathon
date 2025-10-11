# UI Overhaul: Adopt shadcn/ui Across the App

Make the UI beautiful, cohesive, and accessible by adopting shadcn/ui component philosophy (and components) across all pages. Replace ad‑hoc HTML with well‑structured, reusable primitives and a consistent design system.

## Motivation

Current UI is functional but inconsistent and visually rough. We want a modern, production‑quality design that:
- Uses a coherent component library aligned with Tailwind CSS v4
- Ships accessible, keyboard‑friendly interactions by default
- Provides consistent spacing, typography, color, and motion
- Speeds up developer velocity with reusable primitives

## Goals

- Establish a consistent design system (tokens, typography, color, spacing, radius)
- Use shadcn/ui primitives for all interactive elements and layout
- Ensure a11y (focus states, ARIA, keyboard nav) and dark mode
- Implement responsive layouts for mobile, tablet, desktop
- Replace custom tables with a DataTable wrapper (TanStack Table + shadcn styles)
- Add standard UI patterns: cards, modals, toasts, skeletons, empty states

## Non‑Goals

- No backend changes or new product features
- No visual redesign of map tiles; focus is app chrome and components

## Deliverables

- shadcn/ui initialized in `frontend` (document command and chosen options)
- Design tokens documented (colors, radius, spacing, fonts) in `frontend/README-UI.md`
- UI primitives in `src/components/ui` (generated + a few project wrappers)
- App chrome components: `Navbar`, `Sidebar`, `PageHeader`, `PageContainer`
- Data table wrapper: `DataTable` built on `@tanstack/react-table`
- Feedback components: `Toast`, `Alert`, `Skeleton`, `EmptyState`, `LoadingSpinner`
- Forms: `Input`, `Select`, `Label`, `Checkbox`, `Tabs`, `Badge`
- Refactored pages (retain logic, improve presentation):
  - `/` Home navigation hub
  - `/dashboard/customer/map`
  - `/dashboard/customer/analytics`
  - `/dashboard/customer/monitoring`
  - `/dashboard/crm/leads`

## Acceptance Criteria

- [ ] shadcn/ui installed or scaffolded; components build with zero TS errors
- [ ] Dark mode supported; color tokens map to Tailwind v4 CSS variables
- [ ] `/` uses shadcn `Card`/`Button` patterns for nav tiles
- [ ] Map page wrapped in `PageContainer` with a `PageHeader` and `Card` for controls/legend
- [ ] Analytics page uses `Card` for KPIs and `DataTable` for pricing intelligence
- [ ] Monitoring page uses `Card` for sections and consistent table styles
- [ ] CRM Leads uses `DataTable` with sorting, basic filtering, and pagination
- [ ] Global `Navbar` + `Sidebar` present and responsive (collapsible on mobile)
- [ ] All interactive components have focus states and pass a basic a11y scan (axe or manual)
- [ ] No ad‑hoc raw table styling remains; consistent spacing and radii used app‑wide

## Implementation Plan

1) Setup & Design Tokens
- [ ] Initialize shadcn/ui (`npx shadcn@latest init`) and document chosen options
- [ ] Add `lucide-react` icons and map to our icon system
- [ ] Define tokens: colors, radius, spacing, shadows, transitions
- [ ] Ensure Tailwind v4 variables line up with shadcn tokens

2) Layout & App Chrome
- [ ] `Navbar` with product title, theme toggle, placeholder user menu
- [ ] `Sidebar` with sections: Customer (Map, Analytics, Monitoring), CRM (Leads)
- [ ] `PageHeader` with title/description/actions
- [ ] `PageContainer` establishes page padding/max‑width and responsive grid helpers

3) UI Primitives (shadcn)
- [ ] Add `button`, `card`, `dialog`, `dropdown-menu`, `table`, `badge`, `tabs`, `select`, `input`, `label`, `separator`, `skeleton`, `toast`
- [ ] Create thin wrappers only where app‑specific variants are needed (e.g., `StatsCard`)

4) DataTable (TanStack + shadcn styles)
- [ ] Create generic `DataTable<T>` with columns, sorting, pagination, empty state, and loading state
- [ ] Reuse on Analytics (pricing table) and CRM Leads

5) Page Refactors
- [ ] Home (`/`): Replace links with shadcn `Card` grid and primary `Button` CTAs
- [ ] Customer/Map: Move legend/controls into `Card` on overlay; add `Tabs` for filters
- [ ] Customer/Analytics: KPIs in `Card` grid; pricing table uses `DataTable`
- [ ] Customer/Monitoring: Section `Card`s; use consistent table and typography
- [ ] CRM/Leads: Replace table with `DataTable`, add filters (status, min score)

6) Feedback & A11y
- [ ] Add `Toaster` provider and example success/error messages
- [ ] Add `EmptyState` component for no data cases
- [ ] Add `Skeleton` loaders for page transitions and map details modal
- [ ] Run a basic a11y scan and fix critical issues

## Design Principles (shadcn philosophy)

- Composition over configuration: build with primitives, compose for features
- Controlled variants: keep variants minimal; prefer utility classes for layout
- Accessibility first: Radix‑based components, keyboard navigation, clear focus states
- Visual consistency: spacing scale, radius, font sizes, and shadows stay consistent
- Progressive enhancement: keep SSR‑safe, hydrate interactions client‑side

## Component Inventory (Initial)

- Layout: `Navbar`, `Sidebar`, `PageContainer`, `PageHeader`
- Primitives: `Button`, `Card`, `Tabs`, `Badge`, `Input`, `Label`, `Select`, `Separator`, `Skeleton`, `Toast`
- Data: `Table`, `DataTable` wrapper, `Pagination`
- Overlays: `Dialog` (modal), later `Sheet` if needed
- Icons: `lucide-react`
- Helpers: `EmptyState`, `LoadingSpinner`

## Risks & Mitigations

- React 19 + shadcn compatibility: choose component versions verified with React 19
- Package install/network limits: document exact install steps; fall back to copying component code if needed
- SSR/client boundary: mark interactive components with `"use client"` and dynamic import if necessary
- Scope creep: keep visual polish separate from new features; enforce acceptance criteria

## QA Plan

- Visual review across light/dark modes and breakpoints (sm/md/lg)
- Keyboard navigation pass (Tab/Shift+Tab, Esc on dialogs)
- Basic axe scan in dev to catch a11y violations
- Spot checks on DataTable sorting/filtering/pagination

## Timeline (indicative)

- Week 1: Setup, tokens, layout, primitives
- Week 2: DataTable + refactor Analytics/Leads
- Week 3: Refactor Map/Monitoring + polish, a11y pass

## Dependencies

- `shadcn@latest`, `lucide-react`, `@tanstack/react-table`
- Tailwind CSS v4 (already present)

## References

- shadcn/ui: https://ui.shadcn.com/
- TanStack Table: https://tanstack.com/table/latest

