# Backend Testing Quick Reference

Quick guide for testing the backend. For comprehensive documentation, see [Backend Usage & Testing Guide](../docs/BACKEND_USAGE_AND_TESTING.md).

## Quick Start

### 1. Setup

```bash
# Install dependencies
uv sync

# Configure environment
cp env.example .env
# Edit .env with your API keys
```

### 2. Run Server

```bash
# Terminal 1: Start server
uv run server.py
```

```bash
# Terminal 2: Expose with ngrok
ngrok http 7860
```

### 3. Make a Test Call

**Option A: Using the script (Recommended)**
```bash
# Make sure business_info.json has a valid phone number
uv run make_call.py
```

**Option B: Using curl**
```bash
curl -X POST https://your-ngrok-url.ngrok.io/start \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+1234567890"}'
```

## Environment Variables Checklist

Required in `.env`:

- [ ] `GEMINI_API_KEY` - For LLM and prompt generation
- [ ] `DEEPGRAM_API_KEY` - For speech-to-text
- [ ] `XI_API_KEY` - ElevenLabs TTS
- [ ] `ELEVENLABS_VOICE_ID` - Voice for TTS
- [ ] `TWILIO_ACCOUNT_SID` - Twilio account
- [ ] `TWILIO_AUTH_TOKEN` - Twilio auth
- [ ] `TWILIO_PHONE_NUMBER` - Your Twilio number
- [ ] `ENV=local` - For development

## Testing Checklist

Before making calls:

- [ ] Server running on port 7860
- [ ] ngrok exposing the server
- [ ] `.env` configured with all keys
- [ ] `business_info.json` has valid phone number
- [ ] Twilio account has credits
- [ ] Target phone can receive calls

## Call Reports

Reports are saved to: `backend/call_reports/`

View latest report:
```bash
ls -lt call_reports/ | head -n 2
cat call_reports/call_report_*.json | jq .
```

## Common Tests

### Test 1: Call Your Own Phone
```bash
# Update business_info.json with your number
uv run make_call.py
# Answer and interact with the AI
```

### Test 2: Test Prompt Generation
```bash
uv run prompt_generator.py
```

### Test 3: Verify Environment
```bash
# Quick check all vars are set
grep -v '^#' .env | grep '='
```

### Test 4: Test Twilio Connection
```python
import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()
client = Client(os.getenv('TWILIO_ACCOUNT_SID'), os.getenv('TWILIO_AUTH_TOKEN'))
print(client.api.accounts(os.getenv('TWILIO_ACCOUNT_SID')).fetch().status)
```

## Monitoring Logs

Watch for these key log messages:

**Call initiated:**
```
Received outbound call request
Processing outbound call to +1234567890
Generating custom prompt with Gemini AI...
```

**Call connected:**
```
WebSocket connection accepted for outbound call
Starting outbound call conversation
```

**AI detection:**
```
🤖 DETECTION RESULT: Human (or AI)
```

**Report saved:**
```
============================================================
📄 CALL REPORT
============================================================
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Server won't start | Check port 7860 is free: `lsof -i :7860` |
| Can't connect | Verify ngrok is running: `curl http://localhost:4040/api/tunnels` |
| No call made | Check Twilio credentials and account credits |
| No audio | Verify ElevenLabs and Deepgram API keys |
| No report | Call must last 3-4+ minutes for full report |

## API Endpoints

- `POST /start` - Initiate outbound call
- `POST /twiml` - TwiML response (called by Twilio)
- `WebSocket /ws` - Media stream endpoint

## Key Files

- `server.py` - FastAPI server with endpoints
- `bot.py` - Pipecat bot logic
- `make_call.py` - CLI tool for making calls
- `prompt_generator.py` - AI prompt generator
- `business_info.json` - Target business data
- `call_reports/` - Generated call reports

## Production Deployment

For production (Pipecat Cloud):

```bash
ENV=production
AGENT_NAME=your-agent-name
ORGANIZATION_NAME=your-org-name
```

Deploy bot to Pipecat Cloud separately from the server.

---

**For detailed documentation, see: [Backend Usage & Testing Guide](../docs/BACKEND_USAGE_AND_TESTING.md)**

