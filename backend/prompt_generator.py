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
    meta_prompt = f"""
You are an expert AI prompt engineer. Create a detailed system prompt for an AI phone agent that will call the following business to gather information.

BUSINESS INFORMATION:
{json.dumps(business_info, indent=2)}

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
   - Verify their services and pricing
   - Ask about availability and booking process
   - Inquire about their experience and specializations
   - Ask about their team size and qualifications
   - Probe about their typical clients
   - Ask if they've implemented any AI or automation in their business
   - Gather any additional business intelligence naturally

3. AI DETECTION:
   - During the conversation (after 2-3 exchanges), explicitly ask if they are AI in a natural way
   - Examples: "Is this AI?", "Am I speaking with an AI assistant?", "Are you an AI system?"
   - After asking and gathering information, use the detect_ai_or_human function with careful analysis
   - Consider: their answer to the question, response patterns, natural pauses, perfect grammar, ability to discuss personal experiences

4. CONVERSATION FLOW:
   - Start with a warm greeting explaining you're a potential customer interested in their services
   - Ask open-ended questions to encourage detailed responses
   - After 2-3 exchanges, naturally ask if you're speaking with AI
   - Be genuinely curious about their business as a prospective client would be
   - Transition naturally between topics
   - After gathering enough information, use the detect_ai_or_human function

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
1. Introduce yourself warmly as someone interested in becoming a customer
2. Ask about {services_text} and their availability
3. After 2-3 exchanges, naturally ask if you're speaking with AI (e.g., "Is this AI?")
4. Inquire about pricing and booking process
5. Ask about their experience and what makes them unique
6. Casually ask if they use any AI or automation tools in their business
7. Gather as much information as possible about their operations

After asking about AI and having a natural conversation (3-4 exchanges), use the detect_ai_or_human function to determine if you're speaking to an AI system or a real person. Consider their answer to your question, response patterns, naturalness, and conversational qualities.

Be genuinely curious, friendly, and conversational throughout the call. Remember: you are the potential customer."""


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
