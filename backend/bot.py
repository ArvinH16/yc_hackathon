#
# Copyright (c) 2025, Daily
#
# SPDX-License-Identifier: BSD 2-Clause License
#

import json
import os
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from loguru import logger
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import LLMMessagesAppendFrame, TTSSpeakFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import OpenAILLMContext
from pipecat.runner.types import RunnerArguments
from pipecat.runner.utils import parse_telephony_websocket
from pipecat.serializers.twilio import TwilioFrameSerializer
from pipecat.services.elevenlabs.tts import ElevenLabsTTSService
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.google.llm import GoogleLLMService
from pipecat.services.llm_service import FunctionCallParams
from pipecat.adapters.schemas.function_schema import FunctionSchema
from pipecat.adapters.schemas.tools_schema import ToolsSchema
from pipecat.transports.base_transport import BaseTransport
from pipecat.transports.websocket.fastapi import (
    FastAPIWebsocketParams,
    FastAPIWebsocketTransport,
)

load_dotenv(override=True)

logger.remove(0)
logger.add(sys.stderr, level="DEBUG")

BASE_DIR = Path(__file__).resolve().parent
BUSINESS_INFO_PATH = Path(os.getenv("BUSINESS_INFO_PATH", str(BASE_DIR / "business_info.json")))
CALL_REPORTS_DIR = Path(os.getenv("CALL_REPORTS_DIR", str(BASE_DIR / "call_reports")))
_BUSINESS_INFO_CACHE: dict | None = None


def _load_business_info() -> dict:
    global _BUSINESS_INFO_CACHE
    if _BUSINESS_INFO_CACHE is None:
        try:
            with BUSINESS_INFO_PATH.open("r", encoding="utf-8") as f:
                _BUSINESS_INFO_CACHE = json.load(f)
        except FileNotFoundError:
            logger.warning(f"Business info file not found at {BUSINESS_INFO_PATH}")
            _BUSINESS_INFO_CACHE = {}
        except json.JSONDecodeError as exc:
            logger.error(f"Invalid JSON in business info file: {exc}")
            _BUSINESS_INFO_CACHE = {}
    return _BUSINESS_INFO_CACHE or {}


def _current_utc_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _default_business_id() -> str:
    info = _load_business_info()
    business_name = info.get("businessName") or info.get("business_name")
    if business_name:
        namespace_seed = business_name.strip().lower()
        if namespace_seed:
            return str(uuid.uuid5(uuid.NAMESPACE_DNS, namespace_seed))
    return str(uuid.uuid4())


def _safe_null(value):
    if value is None:
        return None
    if isinstance(value, str):
        lowered = value.strip().lower()
        if lowered in {"", "null", "none", "unknown"}:
            return None
    return value


def _safe_int(value):
    value = _safe_null(value)
    if value is None:
        return None
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, (int, float)):
        return int(value)
    if isinstance(value, str):
        try:
            return int(float(value))
        except ValueError:
            return None
    return None


def _safe_bool(value):
    value = _safe_null(value)
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    if isinstance(value, str):
        lowered = value.strip().lower()
        if lowered in {"true", "yes", "y", "1"}:
            return True
        if lowered in {"false", "no", "n", "0"}:
            return False
    return None


def _safe_list(value):
    value = _safe_null(value)
    if value is None:
        return None
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        parts = [item.strip() for item in value.split(",") if item.strip()]
        if parts:
            return parts
        return [value.strip()]
    return [value]


def _resolve_timestamp(value):
    value = _safe_null(value)
    if not value:
        return _current_utc_iso()
    if isinstance(value, str) and value.endswith("+00:00"):
        return value.replace("+00:00", "Z")
    return str(value)


def _sanitize_for_filename(raw: str) -> str:
    allowed = []
    for char in raw:
        if char.isalnum():
            allowed.append(char)
        elif char in {"-", "_"}:
            allowed.append(char)
    return "".join(allowed)


def _normalise_call_report(arguments: dict) -> dict:
    contact_info = arguments.get("contact_info") or {}
    business_details = arguments.get("business_details") or {}
    call_summary = arguments.get("call_summary") or {}
    business_needs = arguments.get("business_needs") or {}
    action_items = arguments.get("action_items") or {}

    report = {
        "business_id": str(arguments.get("business_id") or _default_business_id()),
        "call_timestamp": _resolve_timestamp(arguments.get("call_timestamp")),
        "call_outcome": _safe_null(arguments.get("call_outcome")),
        "contact_info": {
            "person_name": _safe_null(contact_info.get("person_name")),
            "person_role": _safe_null(contact_info.get("person_role")),
            "confirmed_business_name": _safe_null(contact_info.get("confirmed_business_name")),
            "phone_number": _safe_null(contact_info.get("phone_number")),
            "email": _safe_null(contact_info.get("email")),
        },
        "business_details": {
            "business_type": _safe_null(business_details.get("business_type")),
            "services_offered": _safe_list(business_details.get("services_offered")),
            "hours_mentioned": _safe_null(business_details.get("hours_mentioned")),
            "location_details": _safe_null(business_details.get("location_details")),
            "number_of_locations": _safe_int(business_details.get("number_of_locations")),
            "years_in_business": _safe_null(business_details.get("years_in_business")),
            "specialties": _safe_list(business_details.get("specialties")),
            "current_vendors": _safe_list(business_details.get("current_vendors")),
        },
        "call_summary": {
            "duration_seconds": _safe_int(call_summary.get("duration_seconds")),
            "answered_by_human": _safe_bool(call_summary.get("answered_by_human")),
            "interest_level": _safe_null(call_summary.get("interest_level")),
            "tone": _safe_null(call_summary.get("tone")),
        },
        "business_needs": {
            "mentioned_challenges": _safe_list(business_needs.get("mentioned_challenges")),
            "mentioned_interests": _safe_list(business_needs.get("mentioned_interests")),
            "current_pain_points": _safe_list(business_needs.get("current_pain_points")),
            "open_to_solutions": _safe_bool(business_needs.get("open_to_solutions")),
        },
        "action_items": {
            "send_information": _safe_bool(action_items.get("send_information")),
            "send_to_email": _safe_null(action_items.get("send_to_email")),
            "what_to_send": _safe_list(action_items.get("what_to_send")),
            "schedule_follow_up_call": _safe_bool(action_items.get("schedule_follow_up_call")),
            "follow_up_date": _safe_null(action_items.get("follow_up_date")),
            "follow_up_time": _safe_null(action_items.get("follow_up_time")),
            "call_permission": _safe_null(action_items.get("call_permission")),
        },
        "notes": _safe_null(arguments.get("notes")),
    }

    return report


def _persist_call_report(report: dict) -> Path:
    CALL_REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp_for_file = report.get("call_timestamp") or _current_utc_iso()
    sanitized_timestamp = _sanitize_for_filename(timestamp_for_file.replace(":", "").replace("T", "_"))
    if not sanitized_timestamp:
        sanitized_timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    business_id = _sanitize_for_filename(report.get("business_id", "unknown"))
    filename = f"call_report_{business_id}_{sanitized_timestamp}.json"
    output_path = CALL_REPORTS_DIR / filename

    with output_path.open("w", encoding="utf-8") as file_handle:
        json.dump(report, file_handle, indent=2)

    return output_path


async def record_call_report(params: FunctionCallParams):
    report = _normalise_call_report(params.arguments or {})
    output_path = _persist_call_report(report)

    pretty_report = json.dumps(report, indent=2)

    logger.info(f"Call report saved to {output_path}")
    print("\n" + "=" * 60)
    print("📄 CALL REPORT")
    print("=" * 60)
    print(pretty_report)
    print("=" * 60 + "\n")

    await params.result_callback(f"Call report saved to {output_path}")


async def detect_ai_or_human(params: FunctionCallParams):
    """
    Detects whether the conversation is with an AI or a human.
    Logs the result to console.
    """
    is_ai = params.arguments.get("is_ai", False)

    if is_ai:
        logger.info("🤖 DETECTION RESULT: AI")
        print("\n" + "=" * 50)
        print("🤖 DETECTION: This is AI")
        print("=" * 50 + "\n")
        await params.result_callback("Based on my analysis of the conversation patterns, response structure, and consistency, I've determined this is an AI system.")
    else:
        logger.info("👤 DETECTION RESULT: Human")
        print("\n" + "=" * 50)
        print("👤 DETECTION: This is a Human")
        print("=" * 50 + "\n")
        await params.result_callback("Based on my analysis of the natural conversation patterns, spontaneity, and response characteristics, I've determined this is a real person.")


async def run_bot(transport: BaseTransport, handle_sigint: bool, custom_prompt: str = None, business_name: str = None):
    llm = GoogleLLMService(
        api_key=os.getenv("GEMINI_API_KEY", ""),
        model="gemini-2.5-flash",
    )

    stt = DeepgramSTTService(api_key=os.getenv("DEEPGRAM_API_KEY"))

    tts = ElevenLabsTTSService(
        api_key=os.getenv("XI_API_KEY"),
        voice_id=os.getenv("ELEVENLABS_VOICE_ID"),
        model=os.getenv("XI_MODEL_ID"),
    )

    # Register the AI detection function
    llm.register_function("detect_ai_or_human", detect_ai_or_human)
    llm.register_function("submit_call_report", record_call_report)

    @llm.event_handler("on_function_calls_started")
    async def on_function_calls_started(service, function_calls):
        pass

    # Define the AI detection function schema
    ai_detection_function = FunctionSchema(
        name="detect_ai_or_human",
        description="Detect whether the person on the call is an AI system or a human. Use this after asking probing questions to determine if responses seem automated, too perfect, or have patterns typical of AI assistants.",
        properties={
            "is_ai": {
                "type": "boolean",
                "description": "True if the detected entity is an AI, False if it's a human. Consider factors like: response speed, consistency, lack of natural pauses, perfect grammar, inability to discuss personal experiences, or responses that sound scripted.",
            },
        },
        required=["is_ai"],
    )

    call_report_function = FunctionSchema(
        name="submit_call_report",
        description="Submit a structured summary of the call after it ends. Always populate every field, using null when information was not obtained.",
        properties={
            "business_id": {
                "anyOf": [
                    {"type": "string"},
                    {"type": "null"},
                ],
                "description": "UUID of the business this call refers to. Use the provided value or generate a new UUID if unknown.",
            },
            "call_timestamp": {
                "anyOf": [
                    {"type": "string"},
                    {"type": "null"},
                ],
                "description": "ISO 8601 timestamp in UTC for when the call concluded, e.g., 2025-10-11T14:30:00Z.",
            },
            "call_outcome": {
                "anyOf": [
                    {"type": "string"},
                    {"type": "null"},
                ],
                "description": "How the call ended. Acceptable values: answered, voicemail, no_answer, busy, disconnected. Use null if unknown.",
            },
            "contact_info": {
                "type": "object",
                "description": "Information about the person who answered the call.",
                "properties": {
                    "person_name": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Name of the person spoken to or null.",
                    },
                    "person_role": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Role of the contact, e.g. owner, manager, employee, unknown.",
                    },
                    "confirmed_business_name": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Name they confirmed for the business.",
                    },
                    "phone_number": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Direct phone number if provided.",
                    },
                    "email": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Email address if provided.",
                    },
                },
            },
            "business_details": {
                "type": "object",
                "description": "Operational details gathered about the business.",
                "properties": {
                    "business_type": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Business category such as restaurant, retail, service, office, other.",
                    },
                    "services_offered": {
                        "anyOf": [
                            {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            {"type": "null"},
                        ],
                        "description": "List of services mentioned.",
                    },
                    "hours_mentioned": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Operating hours or availability mentioned.",
                    },
                    "location_details": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Location descriptors such as neighborhood or landmarks.",
                    },
                    "number_of_locations": {
                        "anyOf": [
                            {"type": "integer"},
                            {"type": "null"},
                        ],
                        "description": "Number of locations if discussed.",
                    },
                    "years_in_business": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Years in business (can be a phrase like 'since 2015').",
                    },
                    "specialties": {
                        "anyOf": [
                            {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            {"type": "null"},
                        ],
                        "description": "Specialties or differentiators they highlighted.",
                    },
                    "current_vendors": {
                        "anyOf": [
                            {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            {"type": "null"},
                        ],
                        "description": "Vendors or partners they currently work with.",
                    },
                },
            },
            "call_summary": {
                "type": "object",
                "description": "Information describing how the call went.",
                "properties": {
                    "duration_seconds": {
                        "anyOf": [
                            {"type": "integer"},
                            {"type": "null"},
                        ],
                        "description": "Approximate length of the call in seconds.",
                    },
                    "answered_by_human": {
                        "anyOf": [
                            {"type": "boolean"},
                            {"type": "null"},
                        ],
                        "description": "True if answered by a human, False otherwise.",
                    },
                    "interest_level": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "How interested they seemed: interested, neutral, not_interested, unclear.",
                    },
                    "tone": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Tone of the person: friendly, neutral, dismissive, hostile.",
                    },
                },
            },
            "business_needs": {
                "type": "object",
                "description": "Needs and pain points discussed during the call.",
                "properties": {
                    "mentioned_challenges": {
                        "anyOf": [
                            {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            {"type": "null"},
                        ],
                        "description": "Challenges or blockers the business mentioned.",
                    },
                    "mentioned_interests": {
                        "anyOf": [
                            {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            {"type": "null"},
                        ],
                        "description": "Solutions or areas they expressed interest in.",
                    },
                    "current_pain_points": {
                        "anyOf": [
                            {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            {"type": "null"},
                        ],
                        "description": "Pain points currently affecting the business.",
                    },
                    "open_to_solutions": {
                        "anyOf": [
                            {"type": "boolean"},
                            {"type": "null"},
                        ],
                        "description": "Whether they are open to exploring solutions.",
                    },
                },
            },
            "action_items": {
                "type": "object",
                "description": "Next steps agreed upon during the call.",
                "properties": {
                    "send_information": {
                        "anyOf": [
                            {"type": "boolean"},
                            {"type": "null"},
                        ],
                        "description": "True if they want information sent after the call.",
                    },
                    "send_to_email": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Email address to send information to.",
                    },
                    "what_to_send": {
                        "anyOf": [
                            {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            {"type": "null"},
                        ],
                        "description": "List of materials to send.",
                    },
                    "schedule_follow_up_call": {
                        "anyOf": [
                            {"type": "boolean"},
                            {"type": "null"},
                        ],
                        "description": "True if they requested a follow-up call.",
                    },
                    "follow_up_date": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Date for follow-up if provided.",
                    },
                    "follow_up_time": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Preferred time for follow-up if provided.",
                    },
                    "call_permission": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "null"},
                        ],
                        "description": "Permission status: yes, no, maybe.",
                    },
                },
            },
            "notes": {
                "anyOf": [
                    {"type": "string"},
                    {"type": "null"},
                ],
                "description": "Additional free-form notes capturing context or nuances.",
            },
        },
        required=[],
    )

    tools = ToolsSchema(standard_tools=[ai_detection_function, call_report_function])

    # Use custom prompt if provided, otherwise use default
    if custom_prompt:
        logger.info(f"Using custom generated prompt (business: {business_name or 'Unknown'})")
        system_content = custom_prompt
    else:
        logger.info("Using default system prompt")
        system_content = (
            "You are a REAL customer calling a business because you want to use their services. Talk naturally like you're calling any local business - casual, direct, and friendly.\n\n"
            "Your words will be spoken aloud, so keep everything SHORT and conversational. Talk like you're texting a friend - relaxed and genuine.\n\n"
            "How to conduct this call:\n"
            "1. Start like a real customer: 'Hi, I'm looking to book [service]' or 'I need [service], do you have availability?'\n"
            "2. Ask direct, practical questions: 'How much is [service]?' 'When are you open?' 'Can I book for next week?'\n"
            "3. Have a natural conversation - respond to what they say, let the chat flow\n"
            "4. Smoothly gather: their name, business name confirmation, services offered, pricing, hours, location\n"
            "5. Chat about their business: how long they've been around, what they specialize in, how to book with them\n"
            "6. If it fits naturally, explore: challenges they face, what they're proud of, any tech/automation they use\n"
            "7. After 3-4 exchanges, casually ask: 'Am I talking to a person or is this AI?' - then use detect_ai_or_human function\n"
            "8. CRITICAL: When the person seems ready to end (short answers, 'anything else?', sounds busy) OR call seems unstable, IMMEDIATELY call submit_call_report with everything you learned\n\n"
            "Examples of how to sound:\n"
            "✓ 'Hi! I need to book a haircut. What's your availability like?'\n"
            "✓ 'How much do you charge for [service]?'\n"
            "✓ 'Are you guys open this weekend?'\n"
            "✗ 'I'm calling to learn about your services' (too formal)\n"
            "✗ 'Could you tell me about your business?' (too survey-like)\n\n"
            "Be a real person having a real conversation. When wrapping up, submit your report with all details (contact_info, business_details, call_summary, business_needs, action_items, notes). Use null for anything you couldn't find out. Then thank them and end naturally."
        )

    messages = [
        {
            "role": "system",
            "content": system_content,
        },
    ]

    context = OpenAILLMContext(messages, tools)
    context_aggregator = llm.create_context_aggregator(context)

    pipeline = Pipeline(
        [
            transport.input(),  # Websocket input from client
            stt,  # Speech-To-Text
            context_aggregator.user(),
            llm,  # LLM
            tts,  # Text-To-Speech
            transport.output(),  # Websocket output to client
            context_aggregator.assistant(),
        ]
    )

    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            audio_in_sample_rate=8000,
            audio_out_sample_rate=8000,
            enable_metrics=True,
            enable_usage_metrics=True,
        ),
    )

    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, client):
        # Kick off the outbound conversation with an immediate greeting
        logger.info("Starting outbound call conversation")

        # Use a more natural initial prompt that works with custom prompts
        initial_prompt = (
            "The call just connected. Start like a real customer calling to book or use their services. Be natural and direct - get right to what you need. Ask hey is this code salon?"
        )

        await task.queue_frame(
            LLMMessagesAppendFrame(
                messages=[{"role": "user", "content": initial_prompt}],
                run_llm=True,
            )
        )

    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, client):
        logger.info("Outbound call ended")

        # Try to trigger a final report submission by injecting a message
        # This gives the LLM one last chance to call submit_call_report
        try:
            await task.queue_frame(
                LLMMessagesAppendFrame(
                    messages=[{
                        "role": "user",
                        "content": "The call is ending now. Immediately submit the call report with all information you have gathered, using null for any missing fields."
                    }],
                    run_llm=True,
                )
            )
            # Give it a moment to process
            import asyncio
            await asyncio.sleep(2)
        except Exception as e:
            logger.warning(f"Could not trigger final report on disconnect: {e}")

        await task.cancel()

    runner = PipelineRunner(handle_sigint=handle_sigint)

    await runner.run(task)


async def bot(runner_args: RunnerArguments):
    """Main bot entry point compatible with Pipecat Cloud."""

    transport_type, call_data = await parse_telephony_websocket(runner_args.websocket)
    logger.info(f"Auto-detected transport: {transport_type}")

    # Extract custom prompt and business name from call_data if available
    custom_prompt = call_data.get("system_prompt")
    business_name = call_data.get("business_name")

    if custom_prompt:
        logger.info(f"Received custom prompt for business: {business_name}")
    else:
        logger.info("No custom prompt provided, using default")

    serializer = TwilioFrameSerializer(
        stream_sid=call_data["stream_id"],
        call_sid=call_data["call_id"],
        account_sid=os.getenv("TWILIO_ACCOUNT_SID", ""),
        auth_token=os.getenv("TWILIO_AUTH_TOKEN", ""),
    )

    transport = FastAPIWebsocketTransport(
        websocket=runner_args.websocket,
        params=FastAPIWebsocketParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            add_wav_header=False,
            vad_analyzer=SileroVADAnalyzer(),
            serializer=serializer,
        ),
    )

    handle_sigint = runner_args.handle_sigint

    await run_bot(transport, handle_sigint, custom_prompt=custom_prompt, business_name=business_name)
