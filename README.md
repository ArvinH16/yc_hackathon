# YC Hackathon Project

End-to-end prototype with a Twilio outbound voice bot (FastAPI) and a Next.js frontend dashboard. The backend initiates calls and bridges audio via Twilio Media Streams to a Pipecat-based bot; the frontend provides customer/CRM views and analytics.

## Project Status

- Status: Alpha (rapidly evolving; APIs and UI may change)
- Targets: Local development first; production via Pipecat Cloud + Twilio

## Repository Layout

- `backend/` — FastAPI server that initiates outbound calls and serves TwiML for Twilio Media Streams
- `frontend/` — Next.js app with dashboard views and a local shadcn-inspired UI system
- `docs/` — Guides, diagrams, and architecture notes

See `docs/README.md` for a browsable docs index.

## Quickstart

Prerequisites:

- Python 3.10+
- `uv` (Python package manager)
- Node.js 18+ and npm (or pnpm/yarn/bun)
- ngrok (for exposing the backend to Twilio during local dev)

1) Configure backend environment

```
cp backend/env.example backend/.env
# Fill in: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
# Optional (for production): ENV=production, AGENT_NAME, ORGANIZATION_NAME
# Optional (for voice AI): Gemini, Deepgram, Cartesia keys
```

2) Run the backend

```
cd backend
uv sync
uv run server.py  # serves on http://localhost:7860
```

3) Expose backend (for Twilio callbacks while local)

```
ngrok http 7860
# Copy the https URL and use it as the host when initiating calls
```

4) Run the frontend

```
cd frontend
npm install
npm run dev  # http://localhost:3000
```

5) Make a test outbound call

Use the backend endpoint to trigger a call (replace values):

```
curl -X POST https://<your-ngrok-subdomain>.ngrok.io/start \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1XXXXXXXXXX",
    "body": {"user": {"id": "user123", "name": "Test"}}
  }'
```

More details: `backend/README.md` and `docs/api/backend.md`.

## Architecture Overview

```mermaid
flowchart LR
  subgraph Client
    Browser[Frontend (Next.js)]
  end

  subgraph Server
    API[FastAPI Server]\n/start, /twiml, /ws
    Bot[Pipecat Bot]
  end

  Twilio[Twilio Voice & Media Streams]

  Browser -->|User triggers call| API
  API -->|REST: Initiate Call| Twilio
  Twilio -->|Fetch TwiML /twiml| API
  Twilio -->|WebSocket Audio| API
  API -->|WebSocket| Bot
```

See `docs/architecture/system-overview.md` and `docs/USER-JOURNEY-DIAGRAM.md` for more.

## Development

- Backend: FastAPI with Twilio integration. See `backend/README.md`.
- Frontend: Next.js (App Router), TypeScript, Tailwind v4. See `frontend/README.md` and `frontend/README-UI.md`.

## Contributing

Contributions welcome. Open issues/PRs as needed. Keep docs updated when behavior changes (see `AGENTS.md`).

## Security

Please review `SECURITY.md` for how to report vulnerabilities.

## Changelog and Roadmap

- `CHANGELOG.md` follows Keep a Changelog format.
- `ROADMAP.md` outlines near-term milestones.
