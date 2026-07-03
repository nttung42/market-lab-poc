import pytest
import asyncio
from unittest.mock import AsyncMock, patch
from app.config import LLMConfigurationError
from app.infra.ai.gateway import LLMExecutionResult
from app.infra.ai.schemas import RespondentGenerationOutput, RespondentOutput
from app.models.models import Persona
from app.services.respondent_generator import (
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


def test_generate_respondents_requires_api_key(mock_persona):
    mock_gateway = AsyncMock()
    mock_gateway.generate_structured.side_effect = LLMConfigurationError(
        "No API key configured for alias 'respondent-generator'. Set one of: "
        "LLM_ALIAS_RESPONDENT_GENERATOR_API_KEY, GROQ_API_KEY."
    )
    with patch("app.services.respondent_generator.get_llm_gateway", return_value=mock_gateway):
        with pytest.raises(
            LLMConfigurationError,
            match="No API key configured for alias 'respondent-generator'",
        ):
            asyncio.run(generate_respondents(mock_persona, 3))


def test_generate_respondents_from_llm_success(mock_persona):
    mock_gateway = AsyncMock()
    mock_gateway.generate_structured.return_value = LLMExecutionResult(
        parsed=RespondentGenerationOutput(
            respondents=[
                RespondentOutput(
                    name="Nguyen Van A",
                    age=20,
                    location="Hanoi, Vietnam",
                    budget="Low",
                    motivation="Practice for graduation",
                    tech_savviness="High",
                    risk_attitude="Neutral",
                    channel="TikTok",
                    decision_rules=["Must be free"],
                )
            ]
        ),
        request_payload={"task_name": "respondent_generation"},
        raw_response={"choices": []},
        parsed_output={
            "respondents": [
                {
                    "name": "Nguyen Van A",
                    "age": 20,
                    "location": "Hanoi, Vietnam",
                    "budget": "Low",
                    "motivation": "Practice for graduation",
                    "tech_savviness": "High",
                    "risk_attitude": "Neutral",
                    "channel": "TikTok",
                    "decision_rules": ["Must be free"],
                }
            ]
        },
        provider="openai",
        model_alias="respondent-generator",
        resolved_model="openai/gpt-4o-mini",
        usage=None,
    )

    with patch("app.services.respondent_generator.get_llm_gateway", return_value=mock_gateway):
        respondents = asyncio.run(generate_respondents_from_llm(mock_persona, 1))
        assert len(respondents) == 1
        assert respondents[0]["name"] == "Nguyen Van A"
        assert respondents[0]["age"] == 20
        assert respondents[0]["budget"] == "Low"
        assert respondents[0]["decision_rules"] == ["Must be free"]


def test_generate_respondents_propagates_llm_error(mock_persona):
    mock_gateway = AsyncMock()
    mock_gateway.generate_structured.side_effect = Exception("API Timeout")

    with patch("app.services.respondent_generator.get_llm_gateway", return_value=mock_gateway):
        with pytest.raises(Exception, match="API Timeout"):
            asyncio.run(generate_respondents(mock_persona, 2))


def test_generate_respondents_rejects_wrong_count(mock_persona):
    mock_gateway = AsyncMock()
    mock_gateway.generate_structured.return_value = LLMExecutionResult(
        parsed=RespondentGenerationOutput(
            respondents=[
                RespondentOutput(
                    name="Nguyen Van A",
                    age=20,
                    location="Hanoi, Vietnam",
                    budget="Low",
                    motivation="Practice for graduation",
                    tech_savviness="High",
                    risk_attitude="Neutral",
                    channel="TikTok",
                    decision_rules=["Must be free"],
                )
            ]
        ),
        request_payload={"task_name": "respondent_generation"},
        raw_response={"choices": []},
        parsed_output={"respondents": [{"name": "Nguyen Van A"}]},
        provider="openai",
        model_alias="respondent-generator",
        resolved_model="openai/gpt-4o-mini",
        usage=None,
    )
    with patch("app.services.respondent_generator.get_llm_gateway", return_value=mock_gateway):
        with pytest.raises(RuntimeError, match="expected 2"):
            asyncio.run(generate_respondents(mock_persona, 2))
