# Backend Changes Log - Agent Role Clarification

## Issue
The outbound AI agent was incorrectly introducing itself as calling **FROM** the business (e.g., "I'm calling from the dental office") instead of calling **AS A CUSTOMER TO** the business.

## Root Cause
The system prompts in both `bot.py` and `prompt_generator.py` didn't explicitly clarify that the agent should act as a potential customer calling TO the business to inquire about services.

## Changes Made

### 1. Updated `bot.py`

#### Default System Prompt (lines 102-123)
**Before:**
- Generic "friendly assistant making an outbound phone call"
- No clarity about the caller's role or relationship to the business
- Could be interpreted as calling FROM the business

**After:**
- Explicitly states: "You are a potential customer calling a business to inquire about their services"
- Clear instruction: "You are CALLING TO the business, not calling FROM the business"
- Structured goals for information gathering:
  1. Ask about services, pricing, and availability
  2. Inquire about experience and uniqueness
  3. Ask about booking process and clients
  4. Query about AI/automation usage
  5. Gather information naturally
- Emphasized: "Remember: you are the customer calling them"

#### Initial Greeting Prompt (lines 163-174)
**Before:**
- Default: "introduce yourself as Bella, and explain you're calling to see if you can get an appointment today"
- Could be ambiguous about whether calling as business or customer

**After:**
- Both custom and default prompts now explicitly state: "explain that you're a potential customer interested in their services"
- Clearer role definition from the very first interaction

### 2. Updated `prompt_generator.py`

#### Meta-Prompt Enhancement (lines 65-77)
**Added CRITICAL CONTEXT section:**
```
CRITICAL CONTEXT:
The AI agent is calling AS A POTENTIAL CUSTOMER TO this business. 
The agent is NOT an employee of this business. 
The agent should introduce itself as someone interested in USING their services, not offering services.
```

**Enhanced IDENTITY & APPROACH:**
- Act as a potential customer calling TO inquire about their services
- NEVER say "I'm calling from [business name]"
- Instead use: "I'm calling about [services]" or "I'm interested in [services]"
- Be friendly like a real prospective customer

#### Fallback Prompt Enhancement (lines 142-158)
**Added explicit instructions:**
- "You are a potential customer calling [business], a [industry], to inquire about their services"
- "IMPORTANT: You are CALLING TO this business as a customer, NOT calling FROM this business"
- "Introduce yourself warmly as someone interested in becoming a customer"
- "Remember: you are the potential customer"

## Expected Behavior After Changes

### Before:
```
Agent: "Hi there, my name is Bella and I'm calling from the dental office."
Agent: "I'm calling from the dental office, and I wanted to see if you were looking to get an appointment today?"
```

### After:
```
Agent: "Hi there, my name is Bella and I'm calling because I'm interested in learning more about your dental services."
Agent: "I'm looking for a new dentist and was wondering if you could tell me about your services and availability?"
```

## Testing Recommendations

1. **Test with default prompt**: Restart server and make a call to verify the agent introduces itself as a customer
2. **Test with custom prompt**: Verify Gemini generates prompts with proper customer role context
3. **Monitor conversation flow**: Ensure agent asks questions from a customer perspective throughout
4. **Verify information gathering**: Check that agent successfully collects business intelligence while maintaining customer role

## Related Files
- `/backend/bot.py` - Core bot logic and default prompts
- `/backend/prompt_generator.py` - Gemini-powered custom prompt generation
- `/backend/business_info.json` - Business data source for prompt generation

## Impact
- **High**: Fundamentally changes how the agent presents itself
- **User Experience**: More natural and appropriate conversations
- **Data Quality**: Better business intelligence gathering as businesses respond more openly to customer inquiries

