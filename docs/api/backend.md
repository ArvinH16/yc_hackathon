# Backend API

FastAPI service for initiating outbound calls and serving TwiML/Media Streams.

Base URL (local): `http://localhost:7860`

## POST /start

Initiate an outbound call via Twilio REST API.

Request (JSON):

```
{
  "phone_number": "+1XXXXXXXXXX",
  "body": {              // optional, JSON object
    "user": {"id": "u1", "name": "Alice"}
  }
}
```

Responses:

- 200 OK
  - `{"call_sid": "CA...", "status": "call_initiated", "phone_number": "+1..."}`
- 400 Bad Request (e.g., missing phone_number)
- 500 Server Error (e.g., Twilio error)

Notes:

- Server infers protocol for TwiML URL based on `Host` header
- Optional `body` is stored transiently and applied as Stream parameters at `/twiml`

## POST /twiml

Returns TwiML for the active call.

- For `ENV=production`, requires `AGENT_NAME` and `ORGANIZATION_NAME`
- Adds Stream parameters for provided `body` fields
- Pauses briefly to keep media stream open

Response: `application/xml` TwiML with `<Connect><Stream/></Connect>`

## WebSocket /ws

Media Streams endpoint. Twilio connects here and the server runs the Pipecat bot.

- Accepts Twilio Media Streams protocol
- Passes connection to `bot(bot_runner_args)` from `backend/bot.py`

## Environment Variables

- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `ENV` = `local` or `production`
- `AGENT_NAME`, `ORGANIZATION_NAME` (required for `production`)
- Optional AI keys (Gemini, Deepgram, Cartesia) as used by the bot

See also: `backend/env.example` and `backend/README.md`.

