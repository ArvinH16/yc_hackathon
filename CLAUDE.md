# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a competitive intelligence platform for Beam Bell that uses AI-powered voice agents to gather competitor data. The system makes outbound calls to competitor businesses, detects whether they use AI or human receptionists, collects pricing/service information, and presents insights through two distinct dashboard interfaces.

**Core Technology Stack:**
- **Backend**: Python with Pipecat AI framework, FastAPI, Twilio for voice calls
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **AI Services**: Google Gemini (LLM), Deepgram (STT), ElevenLabs (TTS)
- **Voice Detection**: Custom AI vs. Human detection via function calling

## Architecture

### Two-Dashboard System

1. **Customer Dashboard** (`/dashboard/customer/*`) - For salon owners (Beam Bell customers)
   - Map view with competitor locations and color-coded competitive positioning
   - Analytics dashboard with pricing intelligence and LLM-powered recommendations
   - Monitoring dashboard for tracking market trends over time

2. **CRM Dashboard** (`/dashboard/crm/*`) - Internal Beam Bell sales tool
   - Leads management for businesses identified during competitor calls
   - AI detection results and transcript analysis
   - Outreach tracking and conversion metrics

### Backend Components

- **`server.py`**: FastAPI server handling outbound call initiation, TwiML generation, and WebSocket connections
  - `/start` endpoint: Initiates outbound calls via Twilio API
  - `/twiml` endpoint: Returns TwiML instructions for WebSocket streaming
  - `/ws` endpoint: WebSocket handler for real-time audio streaming
  - In-memory storage for call body data keyed by call SID

- **`bot.py`**: Pipecat pipeline implementation with AI conversation logic
  - Pipeline: WebSocket → STT (Deepgram) → LLM (Gemini) → TTS (ElevenLabs) → WebSocket
  - Custom `detect_ai_or_human` function for identifying AI vs. human receptionists
  - Conversational agent persona (Bella) that probes to determine AI/human nature

### Frontend Components

- **Type System** (`src/types/`): Centralized TypeScript definitions for Business, Analytics, CRM, User, etc.
- **Mock Data** (`src/data/mock/`): Development data for businesses, analytics, trends, leads, company profiles
- **Layout Components** (`src/components/layout/`): Navbar, Sidebar, PageHeader, PageContainer, AppShell
- **Dashboard Components** (`src/components/dashboard/`): MapView, MapLegend, BusinessDetailModal
- **UI Components** (`src/components/ui/`): shadcn/ui-based components (Card, Button, Table, etc.)

## Development Commands

### Backend

```bash
cd backend

# Install dependencies using uv package manager
uv sync

# Run the server locally (default port 7860)
uv run server.py

# Environment setup
cp env.example .env
# Edit .env with required API keys:
#   - GEMINI_API_KEY
#   - DEEPGRAM_API_KEY
#   - XI_API_KEY (ElevenLabs)
#   - ELEVENLABS_VOICE_ID
#   - TWILIO_ACCOUNT_SID
#   - TWILIO_AUTH_TOKEN
#   - TWILIO_PHONE_NUMBER
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production (uses Turbopack)
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Local Development Workflow

1. Start backend server: `cd backend && uv run server.py`
2. Expose with ngrok: `ngrok http 7860` (in separate terminal)
3. Start frontend: `cd frontend && npm run dev`
4. Make outbound call:
   ```bash
   curl -X POST https://your-ngrok-url.ngrok.io/start \
     -H "Content-Type: application/json" \
     -d '{"phone_number": "+1234567890"}'
   ```

## Environment Configuration

The backend supports two deployment modes via `ENV` variable:

- **`ENV=local`** (default): Uses local/ngrok WebSocket URLs
- **`ENV=production`**: Routes to Pipecat Cloud, requires `AGENT_NAME` and `ORGANIZATION_NAME`

## Key Patterns & Conventions

### Backend

- **Call Data Flow**: `POST /start` → Twilio initiates call → `/twiml` serves TwiML → WebSocket `/ws` connects → bot pipeline runs
- **Function Calling**: LLM uses `detect_ai_or_human` function with boolean `is_ai` parameter to log detection results
- **Body Data Passing**: Custom data passed in `/start` request body is stored by call SID and injected as TwiML parameters
- **Transport**: Uses `FastAPIWebsocketTransport` with `TwilioFrameSerializer` for audio streaming

### Frontend

- **Mock Data Strategy**: All dashboards use mock data from `src/data/mock/` during development
- **View Mode Provider**: Context provider for switching between customer/CRM dashboards
- **Theme Provider**: Supports light/dark themes
- **Responsive Design**: Mobile-first with Tailwind breakpoints, uses responsive dialog/tab components
- **Type Safety**: Strict TypeScript with centralized type definitions
- **Leaflet Maps**: React Leaflet for interactive competitor maps in customer dashboard

### Important Implementation Details

1. **AI Detection Logic** (`bot.py:39-58`):
   - Function is called by LLM after conversation probing
   - Logs detection result to console with emoji indicators (🤖 or 👤)
   - Returns analysis explanation via result callback

2. **Call Body Data** (`server.py:25-64`):
   - Stored in-memory dict keyed by Twilio call SID
   - Retrieved during TwiML generation and cleaned up after use
   - Passed as individual TwiML stream parameters (not JSON string)

3. **WebSocket URL Generation** (`server.py:31-38`):
   - Local: `wss://{host}/ws`
   - Production: `wss://api.pipecat.daily.co/ws/twilio` with `_pipecatCloudServiceHost` parameter

4. **Frontend Routing Structure**:
   - `/` - Landing page
   - `/dashboard/customer` - Customer overview
   - `/dashboard/customer/map` - Map view
   - `/dashboard/customer/analytics` - Pricing intelligence
   - `/dashboard/customer/monitoring` - Trend analysis
   - `/dashboard/crm/leads` - Leads management
   - `/dashboard/business/[id]` - Individual business detail

## Testing

- Backend: No automated tests currently (manual testing via curl + ngrok)
- Frontend: ESLint for code quality

## Production Deployment

1. Deploy bot to Pipecat Cloud following [Pipecat quickstart](https://docs.pipecat.ai/getting-started/quickstart)
2. Set `ENV=production`, `AGENT_NAME`, and `ORGANIZATION_NAME` in backend `.env`
3. Deploy `server.py` separately (handles call initiation, not conversation logic)
4. Frontend can be deployed to Vercel or similar Next.js host

## Documentation References

- Full run guide: `docs/RUN_GUIDE.md`
- Project concept: `docs/IDEA.md`
- Backend technical details: `backend/README.md`
- User journey: `docs/USER-JOURNEY-DIAGRAM.md`
