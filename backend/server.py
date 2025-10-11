#
# Copyright (c) 2025, Daily
#
# SPDX-License-Identifier: BSD 2-Clause License
#

"""server.py

Webhook server to handle outbound call requests, initiate calls via Twilio API,
and handle subsequent WebSocket connections for Media Streams.
"""

import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from twilio.rest import Client as TwilioClient
from twilio.twiml.voice_response import Connect, Stream, VoiceResponse

from prompt_generator import get_custom_prompt, load_business_info

load_dotenv(override=True)

# In-memory store for body data by call SID
call_body_data = {}

# ----------------- HELPERS ----------------- #


def get_websocket_url(host: str) -> str:
    """Get the appropriate WebSocket URL based on environment."""
    env = os.getenv("ENV", "local").lower()

    if env == "production":
        return "wss://api.pipecat.daily.co/ws/twilio"
    else:
        return f"wss://{host}/ws"


def generate_twiml(host: str, body_data: dict = None) -> str:
    """Generate TwiML response with WebSocket streaming using Twilio SDK."""

    websocket_url = get_websocket_url(host)

    # Create TwiML response
    response = VoiceResponse()
    connect = Connect()
    stream = Stream(url=websocket_url)

    # Add Pipecat Cloud service host for production
    env = os.getenv("ENV", "local").lower()
    if env == "production":
        agent_name = os.getenv("AGENT_NAME")
        org_name = os.getenv("ORGANIZATION_NAME")
        service_host = f"{agent_name}.{org_name}"
        stream.parameter(name="_pipecatCloudServiceHost", value=service_host)

    # Add body parameter (if provided)
    if body_data:
        # Pass each key-value pair as separate parameters instead of JSON string
        for key, value in body_data.items():
            stream.parameter(name=key, value=value)

    connect.append(stream)
    response.append(connect)
    response.pause(length=20)

    return str(response)


def make_twilio_call(to_number: str, from_number: str, twiml_url: str):
    """Make an outbound call using Twilio's REST API."""
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")

    if not account_sid or not auth_token:
        raise ValueError("Missing Twilio credentials")

    # Create Twilio client and make the call
    client = TwilioClient(account_sid, auth_token)
    call = client.calls.create(to=to_number, from_=from_number, url=twiml_url, method="POST")

    return {"sid": call.sid}


# ----------------- API ----------------- #


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/start")
async def initiate_outbound_call(request: Request) -> JSONResponse:
    """Handle outbound call request and initiate call via Twilio."""
    print("Received outbound call request")

    try:
        data = await request.json()

        # Load business information
        business_info = load_business_info()

        # Extract phone number from request or use the one from business_info
        phone_number = data.get("phone_number")
        if not phone_number:
            phone_number = business_info.get("phone")
            if not phone_number:
                raise HTTPException(
                    status_code=400,
                    detail="Missing 'phone_number' in request or business_info.json"
                )

        phone_number = str(phone_number)
        print(f"Processing outbound call to {phone_number}")
        print(f"Target business: {business_info.get('businessName', 'Unknown')}")

        # Generate custom prompt using Gemini
        print("Generating custom prompt with Gemini AI...")
        try:
            custom_prompt = get_custom_prompt()
            print(f"Custom prompt generated ({len(custom_prompt)} characters)")
        except Exception as e:
            print(f"Warning: Failed to generate custom prompt: {e}")
            custom_prompt = None

        # Extract body data if provided, or initialize empty dict
        body_data = data.get("body", {})

        # Add the custom prompt to body data
        if custom_prompt:
            body_data["system_prompt"] = custom_prompt

        # Add business name for reference
        body_data["business_name"] = business_info.get("businessName", "Unknown")

        # Get server URL for TwiML webhook
        host = request.headers.get("host")
        if not host:
            raise HTTPException(status_code=400, detail="Unable to determine server host")

        # Use https for production, http for localhost
        protocol = (
            "https"
            if not host.startswith("localhost") and not host.startswith("127.0.0.1")
            else "http"
        )

        # Simple TwiML URL without query parameters
        twiml_url = f"{protocol}://{host}/twiml"

        # Initiate outbound call via Twilio
        try:
            call_result = make_twilio_call(
                to_number=phone_number,
                from_number=os.getenv("TWILIO_PHONE_NUMBER"),
                twiml_url=twiml_url,
            )
            call_sid = call_result["sid"]

            # Store body data for this call
            if body_data:
                call_body_data[call_sid] = body_data

        except Exception as e:
            print(f"Error initiating Twilio call: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to initiate call: {str(e)}")

    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

    return JSONResponse(
        {"call_sid": call_sid, "status": "call_initiated", "phone_number": phone_number}
    )


@app.post("/twiml")
async def get_twiml(request: Request) -> HTMLResponse:
    """Return TwiML instructions for connecting call to WebSocket."""
    print("Serving TwiML for outbound call")

    # Parse form data from Twilio webhook
    form_data = await request.form()

    # Extract call information
    call_sid = form_data.get("CallSid", "")

    # Retrieve body data for this call
    body_data = call_body_data.get(call_sid, {})

    # Clean up stored data for this call
    if call_sid and body_data:
        # Clean up the stored data
        del call_body_data[call_sid]

    # Validate environment configuration for production
    env = os.getenv("ENV", "local").lower()
    if env == "production":
        if not os.getenv("AGENT_NAME") or not os.getenv("ORGANIZATION_NAME"):
            raise HTTPException(
                status_code=500,
                detail="AGENT_NAME and ORGANIZATION_NAME must be set for production deployment",
            )

    try:
        # Get the server host to construct WebSocket URL
        host = request.headers.get("host")
        if not host:
            raise HTTPException(status_code=400, detail="Unable to determine server host")

        # Generate TwiML with body data parameter
        twiml_content = generate_twiml(host, body_data)

        return HTMLResponse(content=twiml_content, media_type="application/xml")

    except Exception as e:
        print(f"Error generating TwiML: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate TwiML: {str(e)}")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Handle WebSocket connection from Twilio Media Streams."""
    await websocket.accept()
    print("WebSocket connection accepted for outbound call")

    try:
        # Import the bot function from the bot module
        from bot import bot
        from pipecat.runner.types import WebSocketRunnerArguments

        # Create runner arguments and run the bot
        runner_args = WebSocketRunnerArguments(websocket=websocket)
        runner_args.handle_sigint = False

        await bot(runner_args)

    except Exception as e:
        print(f"Error in WebSocket endpoint: {e}")
        await websocket.close()


# ----------------- Main ----------------- #


if __name__ == "__main__":
    # Run the server
    port = int(os.getenv("PORT", "7860"))
    print(f"Starting Twilio outbound chatbot server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
