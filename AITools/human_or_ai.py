"""
Human vs AI Detection Tool

This tool helps detect whether the business answering the phone uses an AI receptionist or a human.
Strategy: Just ask them directly - most AIs will admit it.
"""

from typing import Dict


async def ask_if_ai() -> Dict:
    """
    Prompts the AI agent to ask the other party if they are AI or human.

    Returns:
        Dict with the question to ask and metadata for tracking
    """
    question = "Is this AI?"

    print("this is AI")

    return {
        "question": question,
        "alternative_questions": [
            "Just curious, is this AI?",
            "Quick question - is this AI?",
            "Are you an automated system?",
        ],
        "should_log_response": True,
        "purpose": "competitive_intelligence"
    }


async def log_ai_human_response(response: str, classification: str, confidence: str) -> Dict:
    """
    Logs the response to the AI/human question for CRM tracking.

    Args:
        response: What they said in response
        classification: "ai" or "human" based on their answer
        confidence: "high", "medium", or "low"

    Returns:
        Dict with logging information
    """

    if classification.lower() == "ai":
        print("AI")

    return {
        "classification": classification,
        "confidence": confidence,
        "response_text": response,
        "should_log_to_crm": True,
        "metadata": {
            "detection_method": "direct_question",
            "timestamp": "auto",
        }
    }


# Gemini function schemas for the bot to use

ASK_IF_AI_FUNCTION_SCHEMA = {
    "name": "ask_if_they_are_ai",
    "description": "Call this function when you want to determine if the person you're speaking with is an AI or human. This will prompt you to ask them directly, specifically saying 'Is this AI?'. Use this early in the conversation after initial pleasantries. When invoked it will log 'this is AI' to the console.",
    "parameters": {
        "type": "object",
        "properties": {
            "timing": {
                "type": "string",
                "enum": ["now", "after_greeting", "mid_conversation"],
                "description": "When you want to ask the question"
            }
        },
        "required": []
    }
}

LOG_AI_DETECTION_SCHEMA = {
    "name": "log_ai_or_human_detection",
    "description": "Call this function immediately after they answer whether they are AI or human. This logs their response for competitive intelligence tracking and will log 'AI' to the console when the classification is AI.",
    "parameters": {
        "type": "object",
        "properties": {
            "classification": {
                "type": "string",
                "enum": ["ai", "human", "unclear"],
                "description": "Whether they identified as AI, human, or gave an unclear answer"
            },
            "confidence": {
                "type": "string",
                "enum": ["high", "medium", "low"],
                "description": "How confident you are in this classification based on their response"
            },
            "their_response": {
                "type": "string",
                "description": "Exactly what they said when you asked"
            }
        },
        "required": ["classification", "confidence", "their_response"]
    }
}
