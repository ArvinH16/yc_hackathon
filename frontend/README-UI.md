# UI System (shadcn-inspired) — Overview

This frontend adopts a shadcn/ui component philosophy built on Tailwind CSS v4. Since package installs are restricted in this environment, components are implemented locally under `src/components/ui` with API and styling aligned to shadcn primitives.

## Install/Scaffold Notes

If you have network access, you can initialize shadcn/ui and add components using:

```
cd frontend
npx shadcn@latest init
npx shadcn@latest add button card dialog dropdown-menu table badge tabs select input label separator skeleton toast tooltip
```

This repo includes locally implemented primitives that do not require Radix or external packages. They can be swapped with official shadcn components later with minimal changes.

## Design Tokens

Defined in `src/app/globals.css` (Tailwind v4 `@theme inline`).

- Colors
  - `--background`, `--foreground`
  - `--muted`, `--muted-foreground`
  - `--card`, `--card-foreground`
  - `--popover`, `--popover-foreground`
  - `--border`, `--input`
  - `--primary`, `--primary-foreground`
  - `--secondary`, `--secondary-foreground`
  - `--accent`, `--accent-foreground`
  - `--destructive`, `--destructive-foreground`
  - `--ring`
- Radius
  - `--radius: 0.5rem` (used by components; tweak to change app-wide rounding)
- Fonts
  - `--font-sans`, `--font-mono` provided by Next Fonts in `layout.tsx`

Dark mode tokens are defined on `.dark` and applied via the `ThemeProvider` which toggles the root `<html>` class.

## Primitives

Implemented under `src/components/ui`:

- `button.tsx` — Variants: `default`, `secondary`, `outline`, `ghost`, `destructive`
- `card.tsx` — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `input.tsx`, `select.tsx`, `label.tsx`, `separator.tsx`
- `badge.tsx`, `skeleton.tsx`
- `table.tsx` — Styled table wrappers
- `tabs.tsx` — Simple controlled tabs (no Radix dep)
- `dialog.tsx` — Accessible modal with backdrop + Esc to close
- `toast.tsx` — `ToastProvider` + `useToast()` hook
- `empty-state.tsx`, `loading-spinner.tsx`
- `data-table.tsx` — Generic `DataTable<T>` using `@tanstack/react-table` with sorting + pagination

## Layout Components

Located in `src/components/layout`:

- `Navbar` — Title, theme toggle, mobile sidebar toggle
- `Sidebar` — Sections for Customer (Map, Analytics, Monitoring) and CRM (Leads)
- `PageHeader` — Title + optional description/actions
- `PageContainer` — Centered max-width + page padding
- `AppShell` — Composes navbar + sidebar + content area

## Usage Patterns

- Prefer composing features from primitives (`Card`, `Button`, etc.) over adding many variants.
- Keep layout spacing with Tailwind utilities. Use token-based colors.
- Ensure focus visibility with `focus-ring` utility defined in `globals.css`.
- Mark interactive, client-side components with `"use client"`.

## A11y Checklist

- Keyboard traversal: focusable, visible focus rings, Esc closes dialogs
- Landmarks: header/nav/main implicit via structure
- Color contrast: ensured by token palette

## Replacing With Official shadcn Components

When network access is available, run the shadcn CLI to generate official components and replace local implementations one-by-one, keeping the same file paths and exports to avoid refactor churn.

