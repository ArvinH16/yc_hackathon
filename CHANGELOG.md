# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning when we start tagging releases.

## [Unreleased]

### Added
- Root project `README.md` with overview, quickstart, and architecture
- Documentation index at `docs/README.md`
- Code of Conduct, Security policies
- Backend API doc at `docs/api/backend.md`
- Frontend architecture doc at `docs/frontend/architecture.md`
- PR and issue templates under `.github/`

### Changed
- Frontend mock data simplified:
  - Introduced `SimplifiedBusiness` with 6 core fields (`businessName`, `phone`, `email?`, `industry`, `services: string[]`, `prices: Record<string, number>`).
  - Rewrote mock datasets to the simplified shape: `mockBusinesses`, `mockLeads`, and updated analytics opportunities to reference business names.
  - Added `mockLocations.ts` mapping business names to lat/lng and address for map usage.
  - Updated components to consume simplified data (Map, Business modal, Business profile, CRM leads, Customer overview).
  - Kept legacy types and utilities for compatibility where needed.
 - Default UI theme is now light (was system). The navbar toggle still supports switching to dark and system preferences; initial load will render light unless a previous preference is stored.
