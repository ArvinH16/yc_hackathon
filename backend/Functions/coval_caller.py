import requests
import os
from typing import List, Optional, Dict, Any


class CovalClient:
    """Client for interacting with Coval API"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Coval client

        Args:
            api_key: Coval API key. If not provided, will look for COVAL_API_KEY env var
        """
        self.api_key = api_key or os.getenv("COVAL_API_KEY")
        if not self.api_key:
            raise ValueError("API key must be provided or set in COVAL_API_KEY environment variable")

        self.base_url = "https://api.coval.dev"
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key
        }

    def eval_run(
        self,
        test_set_name: str,
        model_type: str = "MODEL_TYPE_VOICE",
        model_config: Optional[Dict[str, Any]] = None,
        metrics: Optional[Dict[str, Any]] = None,
        iteration_count: int = 1,
        concurrency: int = 1,
        sub_sample_size: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Launch an evaluation run

        Args:
            test_set_name: Name of the test set to use
            model_type: Type of model (MODEL_TYPE_VOICE, MODEL_TYPE_TEXT, etc.)
            model_config: Model configuration settings
            metrics: Metrics configuration
            iteration_count: Number of iterations
            concurrency: Number of parallel simulations
            sub_sample_size: Sample size from test set

        Returns:
            Response dict with run_id, message, and sqs_message_id
        """
        url = f"{self.base_url}/eval/run"

        payload = {
            "test_set_name": test_set_name,
            "agent_id": "bella-beambell",
            "model": {
                "type": model_type,
                "config": model_config or {}
            },
            "metrics": metrics or {},
            "iteration_count": iteration_count,
            "concurrency": concurrency
        }

        if sub_sample_size:
            payload["sub_sample_size"] = sub_sample_size

        # Debug: print the payload
        print("Payload being sent:")
        import json
        print(json.dumps(payload, indent=2))
        print()

        response = requests.post(url, json=payload, headers=self.headers)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: Status Code {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error Response: {error_data}")
            except:
                print(f"Raw Response: {response.text}")
            response.raise_for_status()

    def get_metrics(self) -> Dict[str, Any]:
        """
        Get list of available metrics

        Returns:
            Dictionary of available metrics
        """
        url = f"{self.base_url}/metrics"
        response = requests.get(url, headers=self.headers)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: Status Code {response.status_code}")
            print(f"Response: {response.text}")
            response.raise_for_status()
