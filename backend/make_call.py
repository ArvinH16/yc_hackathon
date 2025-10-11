#!/usr/bin/env python3
"""
Simple CLI tool to initiate outbound calls using business info from JSON.

Usage:
    uv run make_call.py [--local]

Options:
    --local     Use localhost instead of ngrok URL (defaults to checking .env for SERVER_URL)
"""

import json
import os
import sys

import requests
from dotenv import load_dotenv
from loguru import logger

load_dotenv(override=True)

# Configure logger
logger.remove(0)
logger.add(sys.stderr, level="INFO")


def load_business_info(json_path: str = "business_info.json") -> dict:
    """Load business information from JSON file."""
    try:
        with open(json_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"Business info file not found: {json_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in business info file: {e}")
        sys.exit(1)


def get_server_url(use_local: bool = False) -> str:
    """
    Get the server URL from environment or use default.

    Args:
        use_local: If True, force use of localhost

    Returns:
        Base server URL
    """
    if use_local:
        port = os.getenv("PORT", "7860")
        return f"http://localhost:{port}"

    # Check for SERVER_URL in environment (for ngrok or production)
    server_url = os.getenv("SERVER_URL")
    if server_url:
        return server_url.rstrip('/')

    # Default to localhost
    port = os.getenv("PORT", "7860")
    return f"http://localhost:{port}"


def initiate_call(phone_number: str, server_url: str) -> dict:
    """
    Make a POST request to the /start endpoint to initiate a call.

    Args:
        phone_number: Phone number to call
        server_url: Base URL of the server

    Returns:
        Response from the server
    """
    endpoint = f"{server_url}/start"

    payload = {
        "phone_number": phone_number
    }

    logger.info(f"Initiating call to {phone_number}")
    logger.info(f"Using server: {server_url}")

    try:
        response = requests.post(
            endpoint,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )

        response.raise_for_status()
        return response.json()

    except requests.exceptions.ConnectionError:
        logger.error(f"Failed to connect to server at {server_url}")
        logger.error("Make sure the server is running (uv run server.py)")
        sys.exit(1)
    except requests.exceptions.Timeout:
        logger.error("Request timed out")
        sys.exit(1)
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP error: {e}")
        logger.error(f"Response: {response.text if response else 'No response'}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)


def main():
    """Main entry point for the call initiator."""
    # Check for --local flag
    use_local = "--local" in sys.argv or "-l" in sys.argv

    # Print banner
    print("=" * 60)
    print("  AI Business Intelligence Call System")
    print("=" * 60)
    print()

    # Load business info
    logger.info("Loading business information...")
    business_info = load_business_info()

    business_name = business_info.get("businessName", "Unknown Business")
    phone_number = business_info.get("phone")

    if not phone_number:
        logger.error("No phone number found in business_info.json")
        logger.error("Please add a 'phone' field with the business phone number")
        sys.exit(1)

    # Display business info
    print(f"Target Business: {business_name}")
    print(f"Phone Number: {phone_number}")
    print(f"Industry: {business_info.get('industry', 'N/A')}")
    print()

    # Get server URL
    server_url = get_server_url(use_local)

    # Initiate the call
    logger.info("Starting outbound call...")
    print()

    result = initiate_call(phone_number, server_url)

    # Display results
    print()
    print("=" * 60)
    print("  Call Initiated Successfully!")
    print("=" * 60)
    print(f"Call SID: {result.get('call_sid', 'N/A')}")
    print(f"Status: {result.get('status', 'N/A')}")
    print(f"Phone: {result.get('phone_number', 'N/A')}")
    print()
    logger.success("Call initiated successfully! Check server logs for details.")


if __name__ == "__main__":
    main()
