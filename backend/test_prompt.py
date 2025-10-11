#!/usr/bin/env python3
"""
Quick test script to verify prompt generation works.
"""

from prompt_generator import get_custom_prompt

print("=" * 80)
print("Testing Prompt Generator")
print("=" * 80)
print()

try:
    prompt = get_custom_prompt()
    print("✓ Prompt generated successfully!")
    print()
    print("Generated Prompt:")
    print("-" * 80)
    print(prompt)
    print("-" * 80)
    print()
    print(f"Length: {len(prompt)} characters")
    print("✓ Test passed!")
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
