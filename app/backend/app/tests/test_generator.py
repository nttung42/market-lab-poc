import pytest
import asyncio
from unittest.mock import AsyncMock, patch
from app.config import LLMConfigurationError
from app.infra.ai.gateway import LLMExecutionResult
from app.infra.ai.schemas import (
    PersonaDraftOutput,
    PersonaJTBDOutput,
    PersonaJourneyStageOutput,
    PersonaProductFitOutput,
    PersonaPsychographicsOutput,
    PersonaValidationOutput,
    RespondentGenerationOutput,
    RespondentOutput,
)
from app.models.models import Persona, Project
from app.services.respondent_generator import (
    generate_respondents,
    generate_respondents_from_llm,
)
from app.services.persona_generator import generate_persona_draft_execution


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


@pytest.fixture
def mock_project():
    return Project(
        id="english-learning-app-poc",
        name="English learning app PoC",
        product_description="AI speaking coach for university students",
        industry="EdTech",
        market="Vietnam",
        target_audience="Vietnamese university students aged 18-24",
        research_objective="Validate messaging",
        study_type="Synthetic Concept / Message Test",
        is_seeded=False,
        created_at="2026-07-04T00:00:00Z",
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


def test_generate_persona_draft_requires_api_key(mock_project):
    mock_gateway = AsyncMock()
    mock_gateway.generate_structured.side_effect = LLMConfigurationError(
        "No API key configured for alias 'persona-drafter'. Set one of: "
        "LLM_ALIAS_PERSONA_DRAFTER_API_KEY, GROQ_API_KEY."
    )
    with patch("app.services.persona_generator.get_llm_gateway", return_value=mock_gateway):
        with pytest.raises(
            LLMConfigurationError,
            match="No API key configured for alias 'persona-drafter'",
        ):
            asyncio.run(
                generate_persona_draft_execution(
                    mock_project,
                    "Create a price-sensitive student persona for IELTS speaking practice.",
                )
            )


def test_generate_persona_draft_success(mock_project):
    mock_gateway = AsyncMock()
    draft = PersonaDraftOutput(
        name="Lan Anh",
        segment="Price-sensitive IELTS learner",
        quote="I need speaking practice that feels credible but still fits my student budget.",
        demographics=[
            "Age: 21",
            "Location: Hanoi, Vietnam",
            "Gender: Female",
            "Occupation: Third-year Student",
            "Income: Low",
        ],
        goals=["Improve IELTS speaking", "Stay within budget"],
        pain_points=["Mock tests are expensive", "Solo practice lacks feedback"],
        motivations=["Graduate on time", "Qualify for scholarships"],
        buying_behavior=["Compares app plans", "Checks teacher reviews"],
        decision_rules=["Must be under 200k VND/month", "Needs IELTS-specific feedback"],
        objections=["AI scores may feel inaccurate", "Premium upsells feel risky"],
        channels=["TikTok", "Facebook groups"],
        assumptions=["Assumes phone-first learning habits"],
        confidence_score=84.0,
        jtbd=PersonaJTBDOutput(
            functional_job="Practice timed IELTS speaking mocks",
            emotional_job="Feel calm before speaking tests",
            social_job="Look competent in front of teachers and peers",
            success_criteria=["Band 7 target", "Detailed grammar feedback"],
        ),
        psychographics=PersonaPsychographicsOutput(
            personality_traits=["Practical", "Disciplined"],
            core_values=["Progress", "Affordability"],
            risk_tolerance="Neutral",
            tech_savviness="High",
        ),
        product_fit=PersonaProductFitOutput(
            must_haves=["Instant scoring"],
            nice_to_haves=["Progress tracker"],
            deal_breakers=["Hidden billing"],
            alternatives=["Language center mocks", "YouTube practice"],
        ),
        journey_map=[
            PersonaJourneyStageOutput(
                stage="Awareness",
                goals=["Find IELTS practice help"],
                pain_points=["Too many generic apps"],
                touchpoints=["TikTok reviews"],
            )
        ],
        validation=PersonaValidationOutput(
            is_human_validated=False,
            evidence_sources=["Synthetic prompt-based draft"],
            last_validated_at=None,
        ),
    )
    mock_gateway.generate_structured.return_value = LLMExecutionResult(
        parsed=draft,
        request_payload={"task_name": "persona_draft_generation"},
        raw_response={"choices": []},
        parsed_output=draft.model_dump(),
        provider="openai",
        model_alias="persona-drafter",
        resolved_model="openai/gpt-4o-mini",
        usage=None,
    )

    with patch("app.services.persona_generator.get_llm_gateway", return_value=mock_gateway):
        execution = asyncio.run(
            generate_persona_draft_execution(
                mock_project,
                "Create a price-sensitive student persona for IELTS speaking practice.",
            )
        )

    assert execution.parsed.name == "Lan Anh"
    assert execution.parsed.segment == "Price-sensitive IELTS learner"
    assert execution.parsed.validation.is_human_validated is False
