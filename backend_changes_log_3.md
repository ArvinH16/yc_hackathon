# Backend Changes Log 3 - Call Report JSON Generation Fix

## Date: 2025-10-11

## Issue
The AI caller bot was not generating JSON call reports at the end of calls. Analysis revealed three main problems:

1. **Prompt Generation Failing**: The `prompt_generator.py` was throwing format specifier errors due to curly braces in JSON examples
2. **Calls Ending Too Quickly**: The bot wasn't getting a chance to submit reports before calls disconnected
3. **No Disconnection Handling**: When calls ended abruptly, the bot had no mechanism to save whatever data it had gathered

## Changes Made

### 1. Fixed Format Specifier Error in `prompt_generator.py`
**File**: [backend/prompt_generator.py](backend/prompt_generator.py:58-123)

**Problem**: Python's f-string formatting was interpreting curly braces in the JSON example as format placeholders, causing the error:
```
Invalid format specifier ' "...",
         "person_role": "owner|manager|employee|unknown",
```

**Solution**:
- Removed f-string formatting from the meta-prompt
- Used string concatenation to inject the business JSON separately
- Added a comment explaining the fix

**Code Change**:
```python
# Before: Used f-string with embedded JSON example containing {}
meta_prompt = f"""..."""

# After: Separate business JSON and use string concatenation
business_json = json.dumps(business_info, indent=2)
meta_prompt = """...""" + business_json + """..."""
```

### 2. Updated System Prompts to Be More Proactive
**Files**:
- [backend/prompt_generator.py](backend/prompt_generator.py:96-103) (meta-prompt instructions)
- [backend/bot.py](backend/bot.py:597) (default system prompt)

**Problem**: The AI was waiting until the conversation was "wrapping up" before submitting reports, but calls were ending before it could do so.

**Solution**: Added CRITICAL instructions to submit reports early if:
- The person is giving short responses
- The call seems like it might disconnect
- The person seems to want to hang up
- Call quality issues arise

**Key Addition**:
```
5. CRITICAL: Before ending the call OR if you sense the call might disconnect soon
   (getting short responses, person seems to want to hang up, poor call quality),
   immediately call submit_call_report with whatever information you have gathered.
   Better to submit an incomplete report than no report at all.
```

### 3. Added Call Disconnection Handler
**File**: [backend/bot.py](backend/bot.py:656-678)

**Problem**: When calls ended abruptly (user hung up, connection lost), the bot had no opportunity to submit whatever data it had collected.

**Solution**:
- Enhanced the `on_client_disconnected` event handler
- Before canceling the task, inject a final message to the LLM requesting immediate report submission
- Give the LLM 2 seconds to process and call the `submit_call_report` function
- Wrapped in try-catch to handle any errors gracefully

**Code Addition**:
```python
@transport.event_handler("on_client_disconnected")
async def on_client_disconnected(transport, client):
    logger.info("Outbound call ended")

    # Try to trigger a final report submission
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
        await asyncio.sleep(2)  # Give it time to process
    except Exception as e:
        logger.warning(f"Could not trigger final report on disconnect: {e}")

    await task.cancel()
```

## Expected Behavior After Changes

1. **Custom Prompt Generation**: The Gemini AI will now successfully generate custom prompts without format errors
2. **Proactive Reporting**: The bot will attempt to submit reports earlier in the conversation if it senses the call might end
3. **Disconnection Safety**: Even if the call ends abruptly, the bot will make one final attempt to save whatever data was gathered
4. **JSON Output**: After each call, a JSON report should be printed to the console and saved to `backend/call_reports/` directory

## Testing Recommendations

1. Run a test call and let it complete naturally
2. Run a test call and hang up mid-conversation to test the disconnection handler
3. Check the `backend/call_reports/` directory for generated JSON files
4. Verify the console output shows the formatted call report

## Files Modified

- `backend/prompt_generator.py` - Fixed format string error and added proactive reporting instructions
- `backend/bot.py` - Updated default prompt and added disconnection handler

## Next Steps

- Test with actual phone calls to verify JSON generation
- Consider adding a fallback mechanism to save partial conversation transcripts if the LLM still fails to call the function
- Monitor logs for any new errors or issues
