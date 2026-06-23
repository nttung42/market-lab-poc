import pytest
import asyncio
from unittest.mock import AsyncMock, patch
from app.models.models import Persona
from app.services.respondent_generator import (
    generate_mock_respondents,
    generate_respondents,
    generate_respondents_from_llm,
)


@pytest.fixture
def mock_persona():
    return Persona(
        id="persona-price-sensitive",
        project_id="english-learning-app-poc",
        name="Minh Thu",
        segment="Price-sensitive student",
        quote="I really want to improve my speaking, but as a student, I have to watch my expenses carefully.",
        demographics=["Age: 20", "Location: Hanoi, Vietnam", "Year: 2nd Year"],
        goals=["Improve speaking", "Find free resources"],
        pain_points=["Limited budget", "Paid apps are too expensive"],
        motivations=["Pass graduation requirements", "Save money"],
        buying_behavior=["Compares prices", "Relies on reviews"],
        decision_rules=["Must have free tier", "Under 100k VND/month"],
        objections=["Feature paywalls", "Auto-renewals"],
        channels=["TikTok", "Facebook Groups"],
        assumptions=["AI speech tool accuracy", "Refund policy expectations"],
        confidence_score=85.0,
    )


def test_generate_mock_respondents(mock_persona):
    count = 5
    respondents = generate_mock_respondents(mock_persona, count)

    assert len(respondents) == count
    for r in respondents:
        assert r["persona_id"] == mock_persona.id
        assert r["project_id"] == mock_persona.project_id
        assert "name" in r
        assert 18 <= r["age"] <= 22  # price-sensitive range in mock generator
        assert r["budget"] == "Low"
        assert r["tech_savviness"] in ["Low", "Medium", "High"]
        assert r["risk_attitude"] in ["Risk-averse", "Neutral", "Risk-seeking"]
        assert r["channel"] in mock_persona.channels
        assert len(r["decision_rules"]) > 0


def test_generate_respondents_fallback_when_no_api_key(mock_persona):
    # Ensure no API key environment variables are set
    with patch.dict("os.environ", {}, clear=True):
        respondents = asyncio.run(generate_respondents(mock_persona, 3))
        assert len(respondents) == 3
        # Should have fallen back to mock generator
        assert respondents[0]["budget"] == "Low"


class MockResponse:
    def __init__(self, json_data, status_code=200):
        self._json_data = json_data
        self.status_code = status_code

    def json(self):
        return self._json_data

    def raise_for_status(self):
        if self.status_code >= 400:
            import httpx
            raise httpx.HTTPStatusError("Error", request=None, response=None)


def test_generate_respondents_from_llm_success(mock_persona):
    llm_response_json = {
        "choices": [
            {
                "message": {
                    "content": '{\n  "respondents": [\n    {\n      "name": "Nguyen Van A",\n      "age": 20,\n      "location": "Hanoi, Vietnam",\n      "budget": "Low",\n      "motivation": "Practice for graduation",\n      "tech_savviness": "High",\n      "risk_attitude": "Neutral",\n      "channel": "TikTok",\n      "decision_rules": ["Must be free"]\n    }\n  ]\n}'
                }
            }
        ]
    }

    mock_client = AsyncMock()
    mock_client.__aenter__.return_value = mock_client
    mock_client.post.return_value = MockResponse(llm_response_json, status_code=200)

    with patch("httpx.AsyncClient", return_value=mock_client), patch.dict(
        "os.environ", {"OPENAI_API_KEY": "test-key"}
    ):
        respondents = asyncio.run(generate_respondents_from_llm(mock_persona, 1))
        assert len(respondents) == 1
        assert respondents[0]["name"] == "Nguyen Van A"
        assert respondents[0]["age"] == 20
        assert respondents[0]["budget"] == "Low"
        assert respondents[0]["decision_rules"] == ["Must be free"]


def test_generate_respondents_fallback_on_llm_error(mock_persona):
    mock_client = AsyncMock()
    mock_client.__aenter__.return_value = mock_client
    mock_client.post.side_effect = Exception("API Timeout")

    with patch("httpx.AsyncClient", return_value=mock_client), patch.dict(
        "os.environ", {"OPENROUTER_API_KEY": "test-key"}
    ):
        # Even if LLM fails, generate_respondents should handle it and return mock respondents
        respondents = asyncio.run(generate_respondents(mock_persona, 2))
        assert len(respondents) == 2
        assert respondents[0]["persona_id"] == mock_persona.id

