# AI Tools - Human vs AI Detection

## Overview

This tool enables your outbound AI agent to detect whether businesses are using AI receptionists or human staff. This is crucial for your competitive intelligence platform.

## How It Works

### Simple Strategy: Just Ask

Instead of complex audio analysis or pattern detection, we use a straightforward approach:
1. **Your AI calls a business**
2. **After initial greeting, it asks directly: "Are you an AI assistant or a real person?"**
3. **Most AIs will admit they're AI**
4. **The response is logged to your CRM for competitive intelligence**

## Implementation

### Files

- **`AITools/human_or_ai.py`**: Core detection tool with two main functions:
  - `ask_if_ai()`: Returns the question to ask
  - `log_ai_human_response()`: Logs the classification for CRM

### Function Calling Integration

The tool uses Gemini's function calling capabilities with two functions:

#### 1. `ask_if_they_are_ai`
- **When**: Called early in conversation after greeting
- **Does**: Prompts your AI to ask "Are you an AI assistant or a real person?"
- **Result**: Spoken to the business being called

#### 2. `log_ai_or_human_detection`
- **When**: Called immediately after they answer
- **Does**: Logs their response with classification (ai/human/unclear) and confidence
- **Result**: Data saved for CRM tracking

### Bot Configuration

In `bot.py`, the system prompt instructs the AI to:
1. Greet the person
2. Explain the call purpose
3. **Ask if they're AI or human (using the function)**
4. **Log their response (using the function)**
5. Continue with service questions

## Example Conversation Flow

```
Your AI: "Hi! This is calling from a local business survey. I'm gathering
         information about services in your area."

Business: "Hello! How can I help you?"

Your AI: [Calls ask_if_they_are_ai function]
         "By the way, are you an AI assistant or a real person?"

Business (AI): "I'm an AI assistant. How can I help you today?"

Your AI: [Calls log_ai_or_human_detection with classification="ai", confidence="high"]
         "Got it, thanks for letting me know! Can you tell me about your
         pricing for haircuts?"
```

## Data Captured

Each detection logs:
```python
{
    "classification": "ai",  # or "human" or "unclear"
    "confidence": "high",    # or "medium" or "low"
    "response_text": "I'm an AI assistant...",
    "should_log_to_crm": True,
    "metadata": {
        "detection_method": "direct_question",
        "timestamp": "auto"
    }
}
```

## Integration with Your Platform

This data feeds into your **Beam Bell CRM Dashboard** to:
- Track which competitors use AI vs human receptionists
- Identify sales opportunities (businesses with humans = potential customers)
- Analyze competitor AI agents (if they use AI)
- Generate targeted outreach campaigns

## Why This Approach Works

1. **Transparency**: Most AI systems are programmed to be honest about being AI
2. **Simple**: No complex audio analysis needed
3. **Reliable**: Direct answers are more accurate than inference
4. **Fast**: Gets the information in seconds
5. **Natural**: Fits smoothly into conversation flow

## Customization

### Alternative Questions

You can modify the questions in `human_or_ai.py`:

```python
"alternative_questions": [
    "Just curious - am I speaking with an AI or a human?",
    "Quick question - are you a bot or a real person?",
    "Are you an automated system or a human receptionist?",
]
```

### Response Handling

Customize the acknowledgment responses in `bot.py`:

```python
responses = {
    "ai": "Got it, thanks for letting me know!",
    "human": "Great, thanks!",
    "unclear": "I see, thank you."
}
```

## Testing

To test this functionality:

1. Start your bot server: `uv run server.py`
2. Make a test call to a business (or another AI agent)
3. Check the logs for:
   - "Asking if the business uses AI or human receptionist"
   - "AI/Human Detection Result: {...}"
4. Verify the classification is logged correctly

## Next Steps

1. **Persist to Database**: Currently logs to console - connect to your database
2. **CRM Integration**: Send results to your Beam Bell CRM dashboard
3. **Analytics**: Track AI adoption rates across competitors
4. **Outreach Automation**: Trigger automated emails based on detection results
