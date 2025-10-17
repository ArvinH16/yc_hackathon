# Backend Usage and Testing Guide

Complete guide for using and testing the AI-powered outbound calling backend system.

## Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Backend](#running-the-backend)
- [Testing the System](#testing-the-system)
- [Understanding Call Reports](#understanding-call-reports)
- [Advanced Testing](#advanced-testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

This backend system is an AI-powered outbound calling agent that:
- Initiates phone calls to businesses via Twilio
- Acts as a real customer to gather business intelligence
- Detects whether it's speaking with AI or human
- Generates structured call reports with comprehensive business data
- Uses AI to create personalized conversation prompts for each business

**Key Technologies:**
- **Pipecat**: AI conversation pipeline framework
- **Twilio**: Voice calling infrastructure  
- **Gemini AI**: LLM for conversation and prompt generation
- **Deepgram**: Speech-to-text
- **ElevenLabs**: Text-to-speech
- **FastAPI**: REST API and WebSocket server

---

## System Architecture

```
┌──────────────┐     POST /start      ┌──────────────┐
│  Test Script │ ───────────────────> │  FastAPI     │
│  or Client   │                      │  Server      │
└──────────────┘                      │  (port 7860) │
                                      └───────┬──────┘
                                              │
                                              │ Twilio REST API
                                              ↓
                                      ┌──────────────┐
                                      │   Twilio     │
                                      │   Service    │
                                      └───────┬──────┘
                                              │
                                              │ Outbound Call
                                              ↓
                                      ┌──────────────┐
                                      │   Business   │
                                      │    Phone     │
                                      └───────┬──────┘
                                              │
                                              │ TwiML Request
                                              ↓
                                      ┌──────────────┐
                                      │  POST /twiml │
                                      │  Returns     │
                                      │  WebSocket   │
                                      │  Connection  │
                                      └───────┬──────┘
                                              │
                                              │ WebSocket /ws
                                              ↓
                                      ┌──────────────┐
                                      │  Pipecat     │
                                      │  Bot Logic   │
                                      │              │
                                      │  STT → LLM   │
                                      │  → TTS       │
                                      └──────────────┘
                                              │
                                              ↓
                                      ┌──────────────┐
                                      │ Call Report  │
                                      │   (JSON)     │
                                      └──────────────┘
```

---

## Prerequisites

### Required Accounts & API Keys

1. **Twilio Account**
   - Sign up at [twilio.com](https://www.twilio.com)
   - Purchase a phone number with voice capabilities
   - Get Account SID and Auth Token from dashboard

2. **Google Gemini API**
   - Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Used for LLM conversation and prompt generation

3. **Deepgram API**
   - Sign up at [deepgram.com](https://deepgram.com)
   - Get API key for speech-to-text

4. **ElevenLabs API**
   - Sign up at [elevenlabs.io](https://elevenlabs.io)
   - Get API key and voice ID for text-to-speech

### System Requirements

- **Python**: 3.10 or higher
- **uv**: Package manager ([installation guide](https://docs.astral.sh/uv/))
- **ngrok**: For local development ([ngrok.com](https://ngrok.com))
- **Docker** (optional): For containerized deployment

---

## Installation

### 1. Clone and Navigate to Backend

```bash
cd /path/to/yc_hackathon/backend
```

### 2. Install Dependencies with uv

```bash
uv sync
```

This will install all required packages defined in `pyproject.toml`:
- `pipecat-ai` with all necessary extensions
- `twilio` SDK
- `google-generativeai`
- `requests`
- And all their dependencies

### 3. Verify Installation

```bash
uv run python --version  # Should be 3.10+
```

---

## Configuration

### 1. Create Environment File

```bash
cp env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and fill in your API keys:

```bash
# Required: AI Services
GEMINI_API_KEY=your_gemini_api_key_here
DEEPGRAM_API_KEY=your_deepgram_api_key_here
XI_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
XI_MODEL_ID=eleven_flash_v2_5

# Required: Twilio
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio number

# Environment Configuration
ENV=local  # Use 'local' for development, 'production' for cloud deployment
AGENT_NAME=twilio-chatbot-dial-out  # For production deployment
ORGANIZATION_NAME=your_org_name  # For production deployment

# Optional: Server Configuration
PORT=7860  # Default server port
SERVER_URL=  # Set this to your ngrok URL when using make_call.py
```

### 3. Configure Business Information

Edit `business_info.json` with the target business details:

```json
{
    "businessName": "Code Salon",
    "phone": "+14259749321",
    "email": "info@business.com",
    "industry": "Hair Salon & Beauty Services",
    "services": [
        "Haircuts and styling",
        "Hair coloring"
    ],
    "prices": {
        "womens_haircut": "$60-$100",
        "mens_haircut": "$35-$50"
    },
    "hours": {
        "monday_friday": "9:00 AM - 7:00 PM",
        "saturday": "8:00 AM - 6:00 PM"
    },
    "location": {
        "address": "456 Salon Boulevard",
        "city": "Palo Alto",
        "state": "CA",
        "zip": "94301"
    },
    "yearsInBusiness": 8,
    "specializations": [
        "Color correction",
        "Hair extensions specialist"
    ]
}
```

**Note:** This file is used to:
1. Generate personalized conversation prompts via Gemini
2. Provide context for the AI caller
3. Determine which business to call

---

## Running the Backend

### Local Development Setup

#### Step 1: Start the Server

In terminal 1:

```bash
cd backend
uv run server.py
```

You should see:
```
Starting Twilio outbound chatbot server on port 7860
INFO:     Started server process [PID]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:7860
```

#### Step 2: Expose Server with ngrok

In terminal 2:

```bash
ngrok http 7860
```

You'll see output like:
```
Forwarding   https://abc123xyz.ngrok.io -> http://localhost:7860
```

**Important:** Copy the HTTPS URL (e.g., `https://abc123xyz.ngrok.io`)

#### Step 3: Update Environment (Optional)

If using the `make_call.py` script, add the ngrok URL to your `.env`:

```bash
SERVER_URL=https://abc123xyz.ngrok.io
```

Now your backend is ready to accept call requests!

---

## Testing the System

### Method 1: Using the make_call.py Script (Recommended)

This is the easiest way to test the system.

```bash
# Make sure business_info.json has a valid phone number
# The script will use the phone number from business_info.json

uv run make_call.py
```

**Output:**
```
============================================================
  AI Business Intelligence Call System
============================================================

Target Business: Code Salon
Phone Number: +14259749321
Industry: Hair Salon & Beauty Services

Starting outbound call...

============================================================
  Call Initiated Successfully!
============================================================
Call SID: CA1234567890abcdef
Status: call_initiated
Phone: +14259749321
```

**For localhost testing:**
```bash
uv run make_call.py --local
```

### Method 2: Using curl

Test the API directly:

```bash
curl -X POST https://your-ngrok-url.ngrok.io/start \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+14259749321"
  }'
```

**Response:**
```json
{
  "call_sid": "CA1234567890abcdef",
  "status": "call_initiated", 
  "phone_number": "+14259749321"
}
```

### Method 3: Using Python Requests

Create a test script:

```python
import requests

url = "http://localhost:7860/start"
# url = "https://your-ngrok-url.ngrok.io/start"  # For ngrok

payload = {
    "phone_number": "+14259749321"
}

response = requests.post(url, json=payload)
print(response.json())
```

---

## Understanding Call Reports

### Call Report Generation

After each call, the system automatically generates a structured JSON report in the `call_reports/` directory.

**Report Location:**
```
backend/call_reports/call_report_<business_id>_<timestamp>.json
```

### Report Structure

```json
{
  "business_id": "uuid-string",
  "call_timestamp": "2025-10-17T14:30:00Z",
  "call_outcome": "answered",
  "contact_info": {
    "person_name": "Sarah Johnson",
    "person_role": "owner",
    "confirmed_business_name": "Code Salon",
    "phone_number": "+14259749321",
    "email": "info@codesalon.com"
  },
  "business_details": {
    "business_type": "hair_salon",
    "services_offered": ["haircuts", "coloring", "styling"],
    "hours_mentioned": "9 AM to 7 PM weekdays",
    "location_details": "Downtown on Salon Boulevard",
    "number_of_locations": 1,
    "years_in_business": "8 years",
    "specialties": ["balayage", "extensions"],
    "current_vendors": ["local suppliers"]
  },
  "call_summary": {
    "duration_seconds": 180,
    "answered_by_human": true,
    "interest_level": "interested",
    "tone": "friendly"
  },
  "business_needs": {
    "mentioned_challenges": ["booking management", "inventory tracking"],
    "mentioned_interests": ["online scheduling"],
    "current_pain_points": ["manual appointment tracking"],
    "open_to_solutions": true
  },
  "action_items": {
    "send_information": true,
    "send_to_email": "info@codesalon.com",
    "what_to_send": ["pricing info", "service menu"],
    "schedule_follow_up_call": false,
    "follow_up_date": null,
    "follow_up_time": null,
    "call_permission": "yes"
  },
  "notes": "Very friendly owner, excited about new technology solutions"
}
```

### Viewing Call Reports

```bash
# View latest report
ls -lt backend/call_reports/ | head -n 2

# View specific report
cat backend/call_reports/call_report_*.json | jq .

# Count total reports
ls -1 backend/call_reports/*.json | wc -l
```

---

## Advanced Testing

### Testing Prompt Generation

Test the AI prompt generator separately:

```bash
cd backend
uv run prompt_generator.py
```

**Output:**
```
Testing Prompt Generator...
================================================================================

GENERATED PROMPT:
--------------------------------------------------------------------------------
You are a real customer calling Code Salon because you're looking to get...
[Full generated prompt]
--------------------------------------------------------------------------------

Prompt generated successfully!
```

### Testing Individual Components

#### 1. Test Server Health

```bash
curl http://localhost:7860/
```

#### 2. Test Environment Variables

```python
import os
from dotenv import load_dotenv

load_dotenv()

# Check all required keys are present
required_keys = [
    'GEMINI_API_KEY',
    'DEEPGRAM_API_KEY', 
    'XI_API_KEY',
    'ELEVENLABS_VOICE_ID',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER'
]

for key in required_keys:
    value = os.getenv(key)
    print(f"{key}: {'✓ Set' if value else '✗ Missing'}")
```

#### 3. Test Business Info Loading

```python
from prompt_generator import load_business_info

info = load_business_info()
print(f"Business: {info.get('businessName')}")
print(f"Phone: {info.get('phone')}")
print(f"Services: {len(info.get('services', []))}")
```

#### 4. Test Twilio Connection

```python
import os
from twilio.rest import Client

account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')

client = Client(account_sid, auth_token)

# Test by fetching account info
account = client.api.accounts(account_sid).fetch()
print(f"Account Status: {account.status}")
print(f"Account Name: {account.friendly_name}")
```

### Monitoring Real-Time Logs

Watch server logs in real-time:

```bash
# In the terminal running server.py
# You'll see detailed logs like:

# When call is initiated:
Received outbound call request
Processing outbound call to +14259749321
Target business: Code Salon
Generating custom prompt with Gemini AI...
Custom prompt generated (2847 characters)

# When call connects:
WebSocket connection accepted for outbound call
Auto-detected transport: twilio
Received custom prompt for business: Code Salon
Starting outbound call conversation

# During conversation:
🤖 DETECTION RESULT: Human
Call report saved to /path/to/call_reports/call_report_xxx.json

# Call report output:
============================================================
📄 CALL REPORT
============================================================
{
  "business_id": "...",
  ...
}
============================================================
```

---

## Testing Different Scenarios

### Scenario 1: Test with Your Own Phone

```bash
# Update business_info.json with your phone number
# Then run the call

uv run make_call.py
```

Answer the call and interact naturally with the AI agent.

### Scenario 2: Test AI Detection

When on the call, respond in different ways:
- **Human-like:** Use natural pauses, "umm", variations in tone
- **AI-like:** Perfect grammar, instant responses, consistent patterns

The bot will detect which one you're mimicking.

### Scenario 3: Test Call Report Completeness

During a test call, provide:
- Your name and role
- Business details (services, pricing, hours)
- Challenges you face
- Interest in solutions
- Email for follow-up

Then check the generated report for completeness.

### Scenario 4: Test Call Interruption

Hang up mid-call and check if a partial report is still generated.

### Scenario 5: Test Multiple Businesses

1. Create multiple business info files:
```bash
cp business_info.json business_info_salon.json
cp business_info.json business_info_restaurant.json
# Edit each with different business data
```

2. Modify `make_call.py` to accept a parameter:
```python
# Or manually swap the files before each test
```

---

## Production Deployment

### Using Docker

```bash
cd backend
docker build -t ai-caller-backend .
docker run -p 7860:7860 --env-file .env ai-caller-backend
```

### Using Pipecat Cloud

1. Deploy bot to Pipecat Cloud:
```bash
# Follow Pipecat Cloud deployment guide
pipecat deploy bot.py
```

2. Update `.env`:
```bash
ENV=production
AGENT_NAME=your-agent-name
ORGANIZATION_NAME=your-org-name
```

3. Deploy server separately (to your cloud provider)

---

## Troubleshooting

### Common Issues

#### 1. "Missing Twilio credentials"

**Problem:** Environment variables not loaded

**Solution:**
```bash
# Ensure .env file exists and has correct values
cat .env | grep TWILIO

# Try running with explicit env loading
export $(cat .env | xargs)
uv run server.py
```

#### 2. "Failed to connect to server"

**Problem:** Server not running or wrong URL

**Solution:**
```bash
# Check server is running
lsof -i :7860

# Verify ngrok is running
curl -s http://localhost:4040/api/tunnels | jq .

# Use correct URL in make_call.py
```

#### 3. "Business info file not found"

**Problem:** Missing or wrong path to `business_info.json`

**Solution:**
```bash
# Check file exists
ls -la business_info.json

# Ensure you're in the backend directory
pwd  # Should end with /backend
```

#### 4. Call connects but AI doesn't speak

**Problem:** TTS or STT API issues

**Solution:**
```bash
# Check API keys are valid
echo $ELEVENLABS_VOICE_ID
echo $DEEPGRAM_API_KEY

# Check server logs for specific errors
# Test APIs independently
```

#### 5. No call report generated

**Problem:** Call ended before report submission

**Solution:**
- Keep call going longer (3-4 minutes)
- Bot should automatically submit before disconnect
- Check `call_reports/` directory anyway - partial reports may exist

#### 6. ngrok URL changes on restart

**Problem:** Free ngrok URLs are temporary

**Solution:**
```bash
# Use static subdomain (requires paid ngrok)
ngrok http 7860 --subdomain=my-ai-caller

# Or update SERVER_URL in .env each time
```

### Debug Mode

Enable verbose logging:

```python
# In bot.py, the logger is already configured
# Check logs in terminal where server.py is running
```

### Testing Checklist

Before making calls, verify:

- [ ] `.env` file exists with all required keys
- [ ] `business_info.json` has valid phone number
- [ ] Server is running on port 7860
- [ ] ngrok is exposing the server
- [ ] Twilio account has credits
- [ ] Phone number being called can receive calls
- [ ] All API services (Gemini, Deepgram, ElevenLabs) have valid keys

---

## API Reference

### POST /start

Initiate an outbound call.

**Request:**
```json
{
  "phone_number": "+1234567890",  // Required
  "body": {                        // Optional
    "custom_field": "value"
  }
}
```

**Response:**
```json
{
  "call_sid": "CAxxxxx",
  "status": "call_initiated",
  "phone_number": "+1234567890"
}
```

### POST /twiml

Returns TwiML for active call (called by Twilio, not manually).

**Response:** XML TwiML with WebSocket connection instructions

### WebSocket /ws

Handles media stream from Twilio (internal use, not called directly).

---

## Best Practices

1. **Always test with your own phone first** before calling real businesses
2. **Monitor call reports** to ensure data is being captured correctly
3. **Review generated prompts** to ensure they match your use case
4. **Keep API keys secure** - never commit `.env` to version control
5. **Respect business hours** when making real calls
6. **Be ethical** - identify yourself honestly if asked
7. **Handle personal data responsibly** - call reports contain PII
8. **Test thoroughly** in development before production use

---

## Additional Resources

- [Pipecat Documentation](https://docs.pipecat.ai)
- [Twilio Voice API](https://www.twilio.com/docs/voice)
- [Gemini API Guide](https://ai.google.dev/docs)
- [Deepgram API](https://developers.deepgram.com)
- [ElevenLabs API](https://elevenlabs.io/docs)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs for specific errors
3. Verify all API credentials are valid
4. Test each component independently

---

**Last Updated:** October 17, 2025
**Version:** 1.0

