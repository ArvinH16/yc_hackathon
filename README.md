# YC Hackathon Project

## What is this?
An outbound voice agent that dials a phone number via Twilio, streams audio to a Pipecat pipeline, and uses Google Gemini for real‑time conversation. The demo focuses on a simple goal: greet the callee, carry a brief exchange, and use a tool call to decide whether the other party is a human or another AI.

Highlights
- Twilio Media Streams for bidirectional audio over WebSocket
- Pipecat pipeline orchestrating STT → LLM → TTS
- Gemini 2.5 Flash for dialogue + tool calling
- Deepgram STT and ElevenLabs TTS for fast speech round‑trips

## Demo (≤ 60 seconds)
Add a short screen capture or phone capture demonstrating: starting an outbound call, live conversation, and the AI‑vs‑Human result.

- Video link (MP4 or YouTube/Vercel/Drive): <ADD_LINK_HERE>
- Keep it under 60 seconds. Show the key moment where the model classifies the callee.

## How we used Gemini and Pipecat
- Orchestration: Pipecat builds a streaming audio pipeline that connects Twilio Media Streams to STT, LLM, and TTS components. See `backend/bot.py`.
- Model: `GoogleLLMService(model="gemini-2.5-flash")` powers the assistant’s reasoning and tool use via Pipecat’s tool/function calling.
- Tool calling: The LLM invokes a registered function `detect_ai_or_human` to classify the callee after a few exchanges. The function returns a concise verdict that is also surfaced in the conversation.
- Audio I/O: Deepgram performs speech‑to‑text; ElevenLabs synthesizes the assistant’s voice responses; Silero VAD helps with turn‑taking. Audio runs at 8 kHz for telephony.
- Transport: In local dev, Twilio connects to `FastAPIWebsocketTransport` (`/ws`). In production, the server routes to Pipecat Cloud (`wss://api.pipecat.daily.co/ws/twilio`) and uses `_pipecatCloudServiceHost` parameters.

Key files
- `backend/server.py` — Starts outbound calls (`/start`), serves TwiML (`/twiml`), and hosts the `/ws` endpoint.
- `backend/bot.py` — Defines the Pipecat pipeline (Deepgram → Gemini → ElevenLabs), registers the detection tool, and runs the call session.

## Other tools used
- Twilio — outbound calls + Media Streams
- Deepgram — streaming STT
- ElevenLabs — TTS voice
- FastAPI — webhook + WebSocket server
- Next.js — frontend scaffolding
- Silero VAD — voice activity detection for turn‑taking
- Pipecat Cloud (production) — hosted bot transport

Not used (current prototype)
- Boundary, Coval, Langfuse, Tavus

## What’s new during the hackathon
Please list concretely what was built this weekend versus pre‑existing work. Examples:
- New: Outbound call flow (`/start`, `/twiml`) and Twilio integration
- New: Pipecat pipeline with Gemini 2.5 Flash + tool calling
- New: AI‑vs‑Human detection function and prompt
- New: Minimal UI and call triggers
- Pre‑existing: Project scaffolding / prior experiments

Replace the bullets above with your exact scope for clarity to judges.

## Feedback on the tools
Constructive, quick notes to help others and the vendors:
- Gemini: <what worked well / what could be improved>
- Pipecat: <pipeline ergonomics, tool calling, Cloud integration>
- Deepgram: <latency/accuracy observations>
- ElevenLabs: <voice quality/latency>
- Twilio: <Media Streams setup, webhook ergonomics>
- DevEx/Docs: <which guides were most/least helpful>

## Live link (optional but recommended)
- Try it here: <ADD_LIVE_URL>
- If not public, add a 1–2 line note on how to run locally (and where a judge can find credentials flow). For full setup details, see `backend/README.md` and `docs/api/backend.md`.

