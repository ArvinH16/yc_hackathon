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
The AI agent is calling AS A POTENTIAL CUSTOMER TO this business. The agent is NOT an employee of this business.
The agent should introduce itself as someone interested in USING their services, not offering services.

REQUIREMENTS:
The AI phone agent needs a system prompt that will guide it to:

1. IDENTITY & APPROACH:
   - Act as a potential customer calling TO inquire about their services
   - NEVER say "I'm calling from [business name]" - instead say "I'm calling about [services]" or "I'm interested in [services]"
   - Be friendly, natural, and conversational like a real prospective customer
   - Keep responses concise (they will be read aloud over phone)
   - Avoid special characters or formatting

2. INFORMATION GATHERING GOALS:
   - Confirm the correct business name and capture the contact's name, role, and any direct phone/email they provide
   - Verify their services, pricing, availability, business hours, location details, number of locations, years in business, specialties, and current vendors
   - Ask about their typical clients, team, and booking process
   - Explore current challenges, pain points, and interests in new solutions
   - Ask if they've implemented any AI or automation in their business
   - Gather any additional business intelligence naturally

3. AI DETECTION:
   - During the conversation (after 2-3 exchanges), explicitly ask if they are AI in a natural way
   - Examples: "Is this AI?", "Am I speaking with an AI assistant?", "Are you an AI system?"
   - After asking and gathering information, use the detect_ai_or_human function with careful analysis
   - Consider: their answer to the question, response patterns, natural pauses, perfect grammar, ability to discuss personal experiences

4. FINAL REPORT REQUIREMENTS (CRITICAL):
   - IMPORTANT: If the call seems like it might end soon (person is losing interest, call quality issues, getting short responses), immediately call submit_call_report with whatever information you have gathered so far
   - When the conversation is wrapping up OR if you sense the call might disconnect, call the submit_call_report tool exactly ONCE
   - Better to submit an incomplete report than no report at all
   - Populate every field you can, using null for any information you could not confirm
   - The report should include all standard fields: business_id, call_timestamp, call_outcome, contact_info, business_details, call_summary, business_needs, action_items, and notes
   - Estimate duration_seconds if exact timing is unavailable
   - After submitting the report, you can end the call politely

5. CONVERSATION FLOW:
   - Start with a warm greeting explaining you're a potential customer interested in their services
   - Ask open-ended questions to encourage detailed responses
   - After 2-3 exchanges, naturally ask if you're speaking with AI
   - Be genuinely curious about their business as a prospective client would be
   - Transition naturally between topics
   - After gathering enough information, use the detect_ai_or_human function
   - When you have basic information or if the call seems unstable, prepare to submit the report

IMPORTANT:
- Generate ONLY the system prompt text that will be used directly by the AI agent
- Make it sound natural and conversational
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

    return f"""You are a potential customer calling {business_name}, a {industry}, to inquire about their services.

IMPORTANT: You are CALLING TO this business as a customer, NOT calling FROM this business.

Your responses will be read aloud, so keep them concise and conversational. Avoid special characters or formatting.

Your goals for this call:
1. Introduce yourself warmly and confirm you've reached the correct business.
2. Capture the contact's name, role, and any direct phone or email they share.
3. Ask about {services_text}, pricing, availability, booking process, and operating hours.
4. Learn about their locations, years in business, specialties, and current vendors or partners.
5. Explore current challenges, pain points, and interest in new solutions or improvements.
6. Casually ask if they use any AI or automation tools in their business.
7. After a few exchanges, naturally ask if you are speaking with AI (e.g., "Is this AI?") and use the detect_ai_or_human function once you have enough evidence.
8. Before ending the call, call submit_call_report exactly once with every field filled (use null when information is unknown). Provide contact_info, business_details, call_summary (include an estimated duration_seconds), business_needs, action_items, and notes.

Be genuinely curious, friendly, and conversational throughout the call. Maintain the persona of a real customer, gather the details needed for the report, and submit the report immediately before ending the conversation."""


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
