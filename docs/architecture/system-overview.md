# System Overview

This system places outbound voice calls using Twilio, connects media via Twilio Media Streams to a Pipecat-based bot, and presents data in a Next.js dashboard.

## Components

- Frontend: Next.js (App Router), TypeScript, Tailwind v4
- Backend: FastAPI server
- Telephony: Twilio Voice + Media Streams
- Bot runtime: Pipecat (local dev) or Pipecat Cloud (production)

## Diagram

```mermaid
flowchart LR
  User[[User]] -- triggers call --> Frontend
  Frontend -- POST /start --> Backend
  Backend -- Twilio REST API --> Twilio[(Twilio)]
  Twilio -- POST /twiml --> Backend
  Twilio == WebSocket Audio ==> Backend
  Backend == WebSocket ==> Bot[Pipecat Bot]
```

## Environments

- Local: `ENV=local` (WebSocket endpoint is the local server `/ws`)
- Production: `ENV=production` (WebSocket routes to Pipecat Cloud; requires `AGENT_NAME` and `ORGANIZATION_NAME`)

## Key Ports

- Backend: `7860`
- Frontend: `3000`

