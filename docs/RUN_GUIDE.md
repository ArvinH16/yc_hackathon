# Run Guide - YC Hackathon Project

## Project Overview

This project is a Pipecat-based AI chatbot that integrates with Twilio to make intelligent outbound voice calls. The bot uses Google's Gemini for LLM inference, Deepgram for speech-to-text, and ElevenLabs for text-to-speech.

## Quick Start

### Prerequisites

1. **Python 3.10+** installed on your system
2. **uv** package manager - Install with:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```
3. **ngrok** for local development - [Download here](https://ngrok.com/download)
4. **API Keys** required:
   - Twilio Account (SID, Auth Token, Phone Number)
   - Google Gemini API Key
   - Deepgram API Key
   - ElevenLabs API Key (with Voice ID)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd yc_hackathon
   ```

2. **Navigate to backend and install dependencies**
   ```bash
   cd backend
   uv sync
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```

4. **Edit `.env` file with your API keys**
   ```bash
   # Open .env and fill in:
   GEMINI_API_KEY=your_gemini_key
   DEEPGRAM_API_KEY=your_deepgram_key
   XI_API_KEY=your_elevenlabs_key
   XI_MODEL_ID=eleven_flash_v2_5
   ELEVENLABS_VOICE_ID=your_voice_id
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio number

   # Environment configuration
   ENV=local
   AGENT_NAME=twilio-chatbot-dial-out
   ORGANIZATION_NAME=
   ```

## Running the Bot (Local Development)

### Step 1: Start the Server

In the `backend` directory:

```bash
uv run server.py
```

The server will start on **port 7860**. You should see:
```
Starting Twilio outbound chatbot server on port 7860
```

### Step 2: Expose Server with ngrok

In a **new terminal**:

```bash
ngrok http 7860
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

> **Tip**: Use `ngrok http 7860 --subdomain=your-custom-name` for a reusable URL (requires paid ngrok account)

### Step 3: Make an Outbound Call

With the server running and exposed via ngrok, use curl to initiate a call:

```bash
curl -X POST https://your-ngrok-url.ngrok.io/start \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890"
  }'
```

Replace:
- `your-ngrok-url.ngrok.io` with your actual ngrok URL
- `+1234567890` with the phone number you want to call

### Making Calls with Custom Data

You can pass custom data to personalize the conversation:

```bash
curl -X POST https://your-ngrok-url.ngrok.io/start \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "body": {
      "user_name": "John Doe",
      "user_id": "user123",
      "account_type": "premium",
      "custom_field": "any_value"
    }
  }'
```

The bot will have access to this data during the conversation.

## Project Structure

```
yc_hackathon/
├── backend/
│   ├── bot.py              # Main bot logic with LLM and conversation flow
│   ├── server.py           # FastAPI server for handling calls and webhooks
│   ├── pyproject.toml      # Python dependencies
│   ├── .env                # Environment variables (not tracked)
│   ├── env.example         # Example environment file
│   ├── Dockerfile          # Docker configuration
│   └── README.md           # Detailed technical documentation
├── .gitignore              # Git ignore rules
└── RUN_GUIDE.md           # This file
```

## How It Works

1. **You send a POST request** to `/start` endpoint with a phone number
2. **Server initiates call** using Twilio's REST API
3. **Call is answered** → Twilio fetches TwiML from `/twiml` endpoint
4. **Server returns TwiML** → Instructs Twilio to start WebSocket stream
5. **WebSocket connection** → Audio streams between caller and bot
6. **Bot converses** → Uses Gemini for AI, Deepgram for STT, ElevenLabs for TTS

## Troubleshooting

### Server won't start
- Check if port 7860 is already in use
- Verify all dependencies are installed: `uv sync`
- Check that `.env` file exists with all required keys

### Call fails to connect
- Verify ngrok is running and URL is correct
- Check Twilio credentials are correct
- Ensure Twilio phone number is voice-enabled
- Check server logs for error messages

### Bot doesn't respond
- Verify API keys are valid (Gemini, Deepgram, ElevenLabs)
- Check server console for WebSocket connection logs
- Ensure ElevenLabs Voice ID is correct

### Audio quality issues
- Check internet connection stability
- Try different ElevenLabs voice or model
- Verify Deepgram API key has proper permissions

## Production Deployment

For production deployment to Pipecat Cloud, see the detailed instructions in [backend/README.md](backend/README.md).

Key changes for production:
1. Set `ENV=production` in `.env`
2. Deploy bot to Pipecat Cloud
3. Set `AGENT_NAME` and `ORGANIZATION_NAME`
4. Deploy server separately (handles call initiation)

## Getting API Keys

### Twilio
1. Sign up at [twilio.com](https://www.twilio.com)
2. Get Account SID and Auth Token from [Console Dashboard](https://console.twilio.com/)
3. [Purchase a phone number](https://console.twilio.com/us1/develop/phone-numbers/manage/search) with voice capabilities

### Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key

### Deepgram
1. Sign up at [deepgram.com](https://deepgram.com)
2. Create an API key in your dashboard

### ElevenLabs
1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Get API key from your profile
3. Choose or create a voice and get its Voice ID

## Support

For detailed technical documentation, see [backend/README.md](backend/README.md).

For issues or questions about:
- Twilio integration: [Twilio Docs](https://www.twilio.com/docs)
- Pipecat framework: [Pipecat Docs](https://docs.pipecat.ai)
- This project: Check server logs and verify all API keys are correct
