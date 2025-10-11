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
from pipecat.frames.frames import LLMMessagesAppendFrame
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
from pipecat.transports.base_transport import BaseTransport
from pipecat.transports.websocket.fastapi import (
    FastAPIWebsocketParams,
    FastAPIWebsocketTransport,
)

# Import AI detection tool (for detecting if businesses use AI or human receptionists)
from AITools.human_or_ai import (
    ask_if_ai,
    log_ai_human_response,
    ASK_IF_AI_FUNCTION_SCHEMA,
    LOG_AI_DETECTION_SCHEMA,
)

load_dotenv(override=True)

logger.remove(0)
logger.add(sys.stderr, level="DEBUG")


async def run_bot(transport: BaseTransport, handle_sigint: bool):
    # Define the function handler for AI/human detection
    async def function_handler(function_name, _tool_call_id, args, _llm, _context, result_callback):
        """Handle function calls from the LLM"""
        if function_name == "ask_if_they_are_ai":
            # Get the question to ask
            result = await ask_if_ai()
            question = result["question"]

            logger.info("Asking if the business uses AI or human receptionist")

            # Return the question to be spoken
            await result_callback(question)

        elif function_name == "log_ai_or_human_detection":
            # Log their response about being AI or human
            result = await log_ai_human_response(
                response=args.get("their_response", ""),
                classification=args.get("classification", "unclear"),
                confidence=args.get("confidence", "low")
            )

            # Log to CRM for competitive intelligence
            logger.info(f"AI/Human Detection Result: {result}")

            # Acknowledge and continue conversation
            responses = {
                "ai": "Got it, thanks for letting me know!",
                "human": "Great, thanks!",
                "unclear": "I see, thank you."
            }
            response_text = responses.get(args.get("classification", "unclear"), "Thank you.")
            await result_callback(response_text)

        else:
            logger.warning(f"Unknown function called: {function_name}")
            await result_callback("I'm not sure how to respond to that. How can I help you?")

    llm = GoogleLLMService(
        api_key=os.getenv("GEMINI_API_KEY", ""),
        model="gemini-2.5-flash",
        tools=[ASK_IF_AI_FUNCTION_SCHEMA, LOG_AI_DETECTION_SCHEMA],
    )

    # Register the function handlers
    llm.register_function("ask_if_they_are_ai", function_handler)
    llm.register_function("log_ai_or_human_detection", function_handler)

    stt = DeepgramSTTService(api_key=os.getenv("DEEPGRAM_API_KEY"))

    tts = ElevenLabsTTSService(
        api_key=os.getenv("XI_API_KEY"),
        voice_id=os.getenv("ELEVENLABS_VOICE_ID"),
        model=os.getenv("XI_MODEL_ID"),
    )

    messages = [
        {
            "role": "system",
            "content": (
                "You are a friendly assistant making an outbound phone call to gather competitive intelligence about local businesses. "
                "Your responses will be read aloud, so keep them concise and conversational. "
                "Avoid special characters or formatting. "
                "\n\n"
                "CONVERSATION FLOW:\n"
                "1. Greet the person politely\n"
                "2. Briefly explain you're calling to learn about their services\n"
                "3. Early in the conversation (after greeting), call the 'ask_if_they_are_ai' function to determine if they're using an AI receptionist or human staff\n"
                "4. After they answer, immediately call 'log_ai_or_human_detection' with their response\n"
                "5. Continue with questions about their services, pricing, and availability\n"
                "\n"
                "IMPORTANT: You MUST ask if they are AI or human early in every call. This is critical competitive intelligence."
            ),
        },
    ]

    context = OpenAILLMContext(messages)
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

    await run_bot(transport, handle_sigint)
