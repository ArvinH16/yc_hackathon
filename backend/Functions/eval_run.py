import os
from coval_caller import CovalClient

# Set API key
os.environ['COVAL_API_KEY'] = '76785c85-ce14-492a-808e-7f792d40b5c0'

# Configure metrics
metrics_config = {
    "metric_type_agent_unresponsive": {},
    "metric_type_agent_repeats_itself": {},
    "metric_type_agent_silent_until_prompted_again": {},
    "metric_type_coval_call_resolution_success": {},
    "metric_type_audio_frequency": {},
    "metric_type_latency": {},
    "metric_type_coval_conversation_progression": {}
}

test_set = "Bella Beambell Test Set: ymogu0"
phone_number = "+14259749321"

print(f"Launching evaluation with test set: {test_set}")
print(f"Phone number: {phone_number}")
print(f"Metrics: {', '.join(metrics_config.keys())}")
print()

try:
    client = CovalClient()
    result = client.eval_run(
        test_set_name=test_set,
        model_type="MODEL_TYPE_VOICE",
        model_config={ "persona_id": "56f5d6dc-df62-45c8-8ab", "phone_number": phone_number },
        metrics=metrics_config,
        iteration_count=1,
        concurrency=1
    )

    print("SUCCESS: Evaluation launched successfully!")
    print(f"Run ID: {result.get('run_id')}")
    print(f"Message: {result.get('message')}")
    print(f"SQS Message ID: {result.get('sqs_message_id')}")

except Exception as e:
    print(f"FAILED: Failed to launch evaluation: {e}")
