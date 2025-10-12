# YC Hackathon Project

Context: BeamBell is our broader product effort (separate repo) at https://www.beambell.com. BeamBell offers two AI services: AI Concierge: a personal, phone‑based assistant with 30 free minutes monthly for registered users; and AI Receptionist: a 24/7 business solution that answers calls, books appointments, and handles inquiries with calendar/CRM integrations. This hackathon project was built in isolation from those codebases to focus on salons: outbound information gathering (offerings and pricing), lightweight AI/human detection, and competitive intelligence that powers the salon dashboards.

For salons: the dashboard shows a competitor map within a 50-mile radius, extracted service menus with normalized prices, pricing benchmarks and revenue opportunities, AI adoption flags, trend monitoring, and an Agent Evaluation panel powered by Coval.

![System Architecture](Screenshot%202025-10-11%20at%205.33.58%20PM.png)

## 1) What is this?

An AI‑powered competitive intelligence add‑on for BeamBell. It automatically gathers, analyzes, and visualizes competitor data within a 50‑mile radius by combining a lightweight web scraper with an outbound phone agent that calls real businesses and asks straightforward questions like a person would: what do you offer, which services/products are available, and what are the prices. The agent follows up to clarify ranges, packages, and availability when answers are vague, then summarizes what it learned. The system normalizes pricing/services and AI‑adoption signals and feeds them into dashboards that highlight the local landscape and flag sales opportunities for BeamBell: who to contact, why, and what to say. Near the end of each call, the agent drops a casual check to see whether it was speaking with a human or an AI receptionist; the focus is useful business info first, with the AI check as a light add‑on.

## 2) A video, less than 60 seconds long. (Ideally this is a demo and not you saying the same thing as section 1. Seriously, less than 60 seconds. Really, I mean it. Less than 60 seconds.)

Video link: <ADD_LINK_HERE>. The recording shows: starting an outbound call, the agent asking about offerings and prices, quick clarifications on ranges/packages, the casual AI check near the end, and the final summary. Keep it under a minute.

## 3) Describe how you used Gemini models and Pipecat. (You must use both Gemini models and Pipecat in this hackathon.)

Pipecat orchestrates the real‑time audio pipeline end‑to‑end: Twilio Media Streams send audio over WebSocket to our server, which runs a Pipecat graph that streams STT → LLM → TTS. Deepgram handles transcription, Gemini 2.5 Flash drives the conversation and tool calling, ElevenLabs speaks the replies, and Silero VAD manages turn‑taking. The model invokes a small tool, `detect_ai_or_human`, near the end of the call to issue a simple verdict without derailing the main Q&A. In local development Twilio connects directly to our FastAPI WebSocket at `/ws`; in production we route to Pipecat Cloud at `wss://api.pipecat.daily.co/ws/twilio`.

Key files: `backend/server.py` (dial via `/start`, serve TwiML at `/twiml`, host `/ws`) and `backend/bot.py` (Pipecat graph: Deepgram → Gemini → ElevenLabs, tool registration, session flow).

## 4) Describe other tools you used. So we can all learn from you, and so judges from Boundary, Coval, Langfuse, and Tavus can focus on projects that use those tools.

Twilio powers outbound calls and Media Streams. Deepgram provides low‑latency STT. ElevenLabs generates a clear, telephony‑rate voice. FastAPI hosts webhooks and the WebSocket. The frontend is a small Next.js app that surfaces extracted services and normalized prices, plus an “Agent Evaluation” panel. We use Coval for evaluation runs and metrics (call‑resolution success, conversation progression, latency) and link its dashboard directly in the UI. Not used in this prototype: Boundary, Langfuse, Tavus.

## 5) Tell us what you did new during the hackathon.

We stood up the outbound call flow end‑to‑end (`/start` and `/twiml`), built the streaming Pipecat pipeline, moved to Gemini 2.5 Flash for tool‑calling dialogue, and implemented the core behavior for extracting offerings and prices with clarifying follow‑ups. We added the casual AI‑vs‑human check near the end of calls, wired evaluation through Coval, and shipped a minimal UI to trigger calls and display structured results. Prior work was only scaffolding; the real‑time agent and extraction logic came together this weekend.

## 6) Give feedback on the tools you used. Sharing is caring. We want your feedback. (But, I hope it goes without saying, please be constructive.)

It was our first time using Coval; their team was kind and hands‑on, helped us get started quickly, and made sure we evaluated the agent correctly; this shortened the loop from test sets to metrics and dashboards. The Pipecat team shared practical cookbooks and recipes that let us assemble the full agentic system quickly; that guidance was extremely helpful. Technically, Pipecat’s pipeline ergonomics made the streaming graph easy to reason about; Deepgram’s latency/accuracy supported natural turn‑taking; ElevenLabs produced consistent voice quality at 8 kHz; Twilio’s Media Streams behaved predictably in both local and Pipecat Cloud routing. We’ll add sharper numbers after more runs.

## 7) Video link: https://drive.google.com/drive/folders/13eHz7L9Z-gndAxLkn0Acd7SsTgCQ7Fns?usp=sharing
Run the GitHub repo yourself to try it here: https://github.com/ArvinH16/yc_hackathon
