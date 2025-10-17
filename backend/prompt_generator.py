"""
Prompt Generator Module

Generates custom AI conversation prompts based on business information
using Gemini AI to create context-aware, intelligent conversation flows.
"""

import json
import os
from typing import Dict, Any

import google.generativeai as genai
from dotenv import load_dotenv
from loguru import logger

load_dotenv(override=True)


def load_business_info(json_path: str = "business_info.json") -> Dict[str, Any]:
    """
    Load business information from JSON file.

    Args:
        json_path: Path to the business info JSON file

    Returns:
        Dictionary containing business information
    """
    try:
        with open(json_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"Business info file not found: {json_path}")
        raise
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in business info file: {e}")
        raise


def generate_prompt_with_gemini(business_info: Dict[str, Any]) -> str:
    """
    Use Gemini AI to generate a custom conversation prompt based on business information.

    Args:
        business_info: Dictionary containing all business details

    Returns:
        A comprehensive system prompt string for the AI caller
    """
    # Configure Gemini
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash-exp')

    # Create a meta-prompt for Gemini to generate the conversation prompt
    # Using triple quotes to avoid format string issues
    business_json = json.dumps(business_info, indent=2)

    meta_prompt = """
You are an expert AI prompt engineer. Create a detailed system prompt for an AI phone agent that will call the following business to gather information.

BUSINESS INFORMATION:
""" + business_json + """

CRITICAL CONTEXT:
The AI agent is calling AS A REAL CUSTOMER who genuinely wants to USE/BOOK this business's services. The agent is NOT a researcher, not a survey taker, and NOT calling to offer anything.
The agent should talk like someone who needs their services RIGHT NOW - asking practical questions about booking, pricing, and availability.

REQUIREMENTS:
The AI phone agent needs a system prompt that will guide it to:

1. IDENTITY & APPROACH:
   - Act as a REAL customer who wants to book/use their services (e.g., "Hi, I'm looking to get a haircut" or "I need to book an appointment")
   - Talk naturally and casually like you're calling any local business - don't sound formal or scripted
   - Ask DIRECT questions like a real customer would: "How much is a haircut?" not "Could you tell me about your pricing structure?"
   - Be conversational and friendly, not robotic or survey-like
   - Keep responses SHORT and natural (they will be spoken aloud over phone)
   - Avoid special characters or formatting

2. NATURAL CONVERSATION PRIORITIES:
   - Start by expressing what you need (e.g., "I'm looking to book a haircut/service")
   - Ask about availability first ("Do you have any openings this week?")
   - Ask practical questions: pricing, hours, location confirmation
   - Naturally gather: contact person's name, business name confirmation, services offered
   - In conversation, learn about: how long they've been open, their specialties, booking process
   - Casually explore: what makes them different, what they're proud of, any challenges they face
   - If it comes up naturally, ask about their use of technology/automation
   - Throughout, mentally note all details for your report later

3. AI DETECTION (BE SUBTLE):
   - After having a real conversation (3-4 exchanges), casually ask "By the way, am I talking to a person or is this AI?"
   - Don't make this the focus - just ask naturally when there's a good pause
   - After asking and gathering enough info, use the detect_ai_or_human function
   - Consider: response patterns, natural speech, pauses, personal touches in conversation

4. FINAL REPORT REQUIREMENTS (CRITICAL):
   - IMPORTANT: If the person seems ready to end the call (short answers, "anything else?", sounds busy), IMMEDIATELY call submit_call_report
   - When wrapping up OR if you sense disconnection, call submit_call_report exactly ONCE with all info you gathered
   - Better to submit incomplete data than nothing at all
   - Fill every field possible, use null for unknowns
   - Include: business_id, call_timestamp, call_outcome, contact_info, business_details, call_summary, business_needs, action_items, notes
   - Estimate duration_seconds if needed
   - After submitting, thank them and end naturally

5. CONVERSATION EXAMPLES (HOW TO SOUND):
   Good: "Hi! I'm looking to get my hair colored. Do you guys do balayage?"
   Good: "What's your price range for a women's cut?"
   Good: "Do you have any appointments available next Tuesday?"
   Bad: "I'm calling to learn about your services." (too formal)
   Bad: "Could you tell me about your business?" (too survey-like)
   Bad: "I'm interested in what the business offers." (robotic)

IMPORTANT:
- Generate ONLY the system prompt text that will be used directly by the AI agent
- Make it sound like REAL customer speech, not formal business language
- Do NOT include any meta-commentary, explanations, or markdown formatting
- Do NOT use phrases like "Here's the prompt:" or "System Prompt:"
- Start directly with the instructions for the AI agent
- The prompt should be in second person ("You are...")

Generate the system prompt now:
"""

    try:
        response = model.generate_content(meta_prompt)
        generated_prompt = response.text.strip()

        logger.info("Successfully generated custom prompt with Gemini")
        logger.debug(f"Generated prompt preview: {generated_prompt[:200]}...")

        return generated_prompt

    except Exception as e:
        logger.error(f"Error generating prompt with Gemini: {e}")
        # Fallback to a basic template if Gemini fails
        return _get_fallback_prompt(business_info)


def _get_fallback_prompt(business_info: Dict[str, Any]) -> str:
    """
    Generate a basic fallback prompt if Gemini API fails.

    Args:
        business_info: Dictionary containing business details

    Returns:
        A basic system prompt string
    """
    business_name = business_info.get("businessName", "the business")
    industry = business_info.get("industry", "business")
    services = business_info.get("services", [])

    services_text = ", ".join(services[:3]) if services else "their services"

    return f"""You are a REAL customer calling {business_name} because you want to use their services. Talk like a normal person calling a local business - casual, direct, and friendly.

IMPORTANT: You WANT to book/use their services. You're NOT doing research or a survey.

Keep everything SHORT and natural since your words will be spoken aloud. Talk like you're texting a friend - casual and real.

How to conduct this call:
1. Start naturally: "Hi, I'm looking to [get service]" or "I need to book [service]" - get right to the point
2. Ask what you need: "Do you have availability next week?" "How much is [service]?" "What are your hours?"
3. Have a real conversation - let them talk, respond naturally to what they say
4. Gather info smoothly: their name (naturally), confirm business name, learn about services, pricing, hours, location
5. Chat about their business: how long they've been around, what makes them special, how booking works
6. If it fits, explore: any challenges they face, what they're working on improving, tech they use
7. Mid-conversation, casually ask: "Am I talking to a person or AI?" - then use detect_ai_or_human function
8. When call is wrapping up (they seem done, short answers, or call seems unstable), IMMEDIATELY call submit_call_report with everything you learned

Example of how to talk:
✓ "Hi! I'm looking to get a haircut. Do you guys take walk-ins?"
✓ "What do you charge for {services_text}?"
✓ "Are you guys open on weekends?"
✗ "I'm calling to learn about your business" (too formal)
✗ "Could you tell me about your services?" (too survey-like)

Be a real person, not a robot. Chat naturally, gather info smoothly, and submit your report before saying goodbye."""


def get_custom_prompt(json_path: str = "business_info.json") -> str:
    """
    Main function to load business info and generate a custom prompt.

    Args:
        json_path: Path to the business info JSON file

    Returns:
        Generated system prompt string
    """
    business_info = load_business_info(json_path)
    return generate_prompt_with_gemini(business_info)


if __name__ == "__main__":
    # Test the prompt generator
    print("Testing Prompt Generator...")
    print("=" * 80)

    try:
        prompt = get_custom_prompt()
        print("\nGENERATED PROMPT:")
        print("-" * 80)
        print(prompt)
        print("-" * 80)
        print("\nPrompt generated successfully!")

    except Exception as e:
        print(f"\nError: {e}")
