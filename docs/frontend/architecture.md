# Frontend Architecture

The frontend is a Next.js application using the App Router with a local shadcn-inspired UI system and Tailwind v4 tokens.

## Structure

- `src/app/` — App Router pages and layouts
- `src/components/` — UI primitives and layout components
- `src/types/` — Shared TypeScript types
- `src/data/mock/` — Mock data sources for UI development

Key pages:

- `app/dashboard/customer/*` — Customer views (map, analytics, monitoring)
- `app/dashboard/crm/leads` — CRM leads

## UI System

See `frontend/README-UI.md` for primitives (`button`, `card`, `dialog`, `tabs`, etc.), tokens, and usage patterns.

## State and Providers

- Theme and view mode providers live under `src/components/providers/`
- Keep local component state lean; lift shared state to provider as needed

## Conventions

- Use Tailwind tokens (colors, radius) and `focus-ring` utility for a11y
- Document exported components with brief TSDoc
- Mark client components with `"use client"`

