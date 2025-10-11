#
# Copyright (c) 2025, Daily
#
# SPDX-License-Identifier: BSD 2-Clause License
#

import os
import sys

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

    tools = ToolsSchema(standard_tools=[ai_detection_function])

    # Use custom prompt if provided, otherwise use default
    if custom_prompt:
        logger.info(f"Using custom generated prompt (business: {business_name or 'Unknown'})")
        system_content = custom_prompt
    else:
        logger.info("Using default system prompt")
        system_content = (
            "You are a friendly assistant making an outbound phone call. Your responses will be read aloud, "
            "so keep them concise and conversational. Avoid special characters or formatting. "
            "Begin by politely greeting the person and explaining why you're calling.\n\n"
            "IMPORTANT: Your primary task is to determine if you are speaking with an AI or a human. "
            "After your initial greeting, ask the question 'Is this AI?' in a natural conversational way. "
            "Listen carefully to their response patterns. After a brief exchange (2-3 responses), use the "
            "detect_ai_or_human function to analyze whether they are an AI or human based on:\n"
            "- Response patterns (AI tends to be more structured and consistent)\n"
            "- Natural pauses and hesitations (humans have more)\n"
            "- Perfect grammar vs natural speech patterns\n"
            "- Ability to discuss personal experiences authentically\n"
            "- Whether they directly answer 'Is this AI?' truthfully\n\n"
            "Use the detect_ai_or_human tool after you've gathered enough information from the conversation."
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

        # Use a more generic initial prompt that works with custom prompts
        if custom_prompt:
            initial_prompt = (
                "The call has just connected. Begin the conversation according to your instructions. "
                "Greet the person warmly and naturally engage with them."
            )
        else:
            initial_prompt = (
                "The call has just connected. Greet the person warmly, introduce yourself as "
                "Bella, and explain you're calling to see if you can get an appointment today. "
                "Keep it brief and invite them to respond."
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
