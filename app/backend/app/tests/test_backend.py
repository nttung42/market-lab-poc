import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import AsyncMock, patch
from app.config import LLMConfigurationError
from app.db.database import Base, get_db
from app.models import models
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
    StudyAnswerOutput,
)
from app.main import app
from app.seeds.seed import seed_db
from app.schemas.schemas import ProjectCreate, PersonaCreate
from pydantic import ValidationError

import os

# Setup testing database in root/data/test_market_lab.db
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

DB_PATH = os.path.join(DATA_DIR, "test_market_lab.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_db(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)

def test_read_projects():
    response = client.get("/api/projects")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    project = data[0]
    assert project["id"] == "english-learning-app-poc"
    assert "English learning app" in project["name"]
    assert project["market"] == "Vietnam"
    assert project["industry"] == "EdTech"

def test_read_project_detail():
    response = client.get("/api/projects/english-learning-app-poc")
    assert response.status_code == 200
    project = response.json()
    assert project["id"] == "english-learning-app-poc"
    assert "target_audience" in project
    assert project["target_audience"] == "Vietnamese university students aged 18-24"

def test_read_project_not_found():
    response = client.get("/api/projects/unknown-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"

def test_read_project_personas():
    response = client.get("/api/projects/english-learning-app-poc/personas")
    assert response.status_code == 200
    personas = response.json()
    assert len(personas) == 3
    
    segments = [p["segment"] for p in personas]
    assert "Price-sensitive student" in segments
    assert "Career-focused student" in segments
    assert "Casual learner" in segments

    for p in personas:
        assert isinstance(p["demographics"], list)
        assert isinstance(p["goals"], list)
        assert isinstance(p["pain_points"], list)
        assert isinstance(p["decision_rules"], list)
        assert isinstance(p["objections"], list)
        assert isinstance(p["assumptions"], list)
        assert isinstance(p["confidence_score"], float) or isinstance(p["confidence_score"], int)

def test_read_project_personas_not_found():
    response = client.get("/api/projects/unknown-id/personas")
    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"

def test_read_persona_detail():
    response = client.get("/api/personas/persona-price-sensitive")
    assert response.status_code == 200
    persona = response.json()
    assert persona["id"] == "persona-price-sensitive"
    assert persona["name"] == "Minh Thu"
    assert len(persona["demographics"]) > 0

def test_read_persona_not_found():
    response = client.get("/api/personas/unknown-persona-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Persona not found"

def test_seeding_idempotence():
    db = TestingSessionLocal()
    # Call seed_db again
    seed_db(db)
    # Check project count is still 1 and persona count is still 3
    from app.models.models import Project, Persona
    project_count = db.query(Project).count()
    persona_count = db.query(Persona).count()
    db.close()
    
    assert project_count == 1
    assert persona_count == 3

def test_required_field_validation():
    # Try to validate project with missing field
    with pytest.raises(ValidationError):
        ProjectCreate(
            id="test-proj",
            name="Test",
            # product_description missing
            industry="EdTech",
            market="Vietnam",
            target_audience="Students",
            research_objective="Test",
            study_type="Test",
            created_at="2026-06-23"
        )

    # Try to validate persona with invalid score
    with pytest.raises(ValidationError):
        PersonaCreate(
            id="test-pers",
            project_id="test-proj",
            name="Test Persona",
            segment="Test Segment",
            quote="Quote",
            demographics=["D1"],
            goals=["G1"],
            pain_points=["P1"],
            motivations=["M1"],
            buying_behavior=["B1"],
            decision_rules=["R1"],
            objections=["O1"],
            channels=["C1"],
            assumptions=["A1"],
            confidence_score=150.0 # Bounded ge=0, le=100
        )


def test_generate_respondents_success():
    async def fake_execution(persona, count):
        respondents = [
            RespondentOutput(
                name=f"{persona.name} Respondent {idx}",
                age=20 + idx,
                location="Hanoi, Vietnam",
                budget="Medium",
                motivation="Practice speaking",
                tech_savviness="High",
                risk_attitude="Neutral",
                channel=persona.channels[0] if persona.channels else "TikTok",
                decision_rules=["Rule 1", "Rule 2", "Rule 3"],
            )
            for idx in range(count)
        ]
        return LLMExecutionResult(
            parsed=RespondentGenerationOutput(respondents=respondents),
            request_payload={"task_name": "respondent_generation"},
            raw_response={"choices": []},
            parsed_output={"respondents": [r.model_dump() for r in respondents]},
            provider="openai",
            model_alias="respondent-generator",
            resolved_model="openai/gpt-4o-mini",
            usage={"total_tokens": 10},
        )

    with patch(
        "app.features.respondents.service.generate_respondents_execution",
        new=AsyncMock(side_effect=fake_execution),
    ):
        response = client.post(
            "/api/projects/english-learning-app-poc/respondents/generate",
            json={"count_per_persona": 2}
        )

    assert response.status_code == 200
    data = response.json()
    # 3 personas * 2 respondents each = 6 respondents total
    assert len(data) == 6
    
    for r in data:
        assert "id" in r
        assert r["project_id"] == "english-learning-app-poc"
        assert r["persona_id"] is not None
        assert r["name"] is not None
        assert isinstance(r["age"], int)
        assert r["location"] is not None
        assert r["budget"] is not None
        assert r["motivation"] is not None
        assert r["tech_savviness"] is not None
        assert r["risk_attitude"] is not None
        assert r["channel"] is not None
        assert isinstance(r["decision_rules"], list)

    db = TestingSessionLocal()
    try:
        ai_runs = db.query(models.AIRun).filter(
            models.AIRun.task_type == "respondent_generation"
        ).all()
        assert len(ai_runs) == 3
        assert all(run.status == "completed" for run in ai_runs)
    finally:
        db.close()


def test_generate_respondents_requires_llm_config():
    with patch(
        "app.features.respondents.service.generate_respondents_execution",
        new=AsyncMock(
            side_effect=LLMConfigurationError(
                "No API key configured for alias 'respondent-generator'. Set one of: "
                "LLM_ALIAS_RESPONDENT_GENERATOR_API_KEY, GROQ_API_KEY."
            )
        ),
    ):
        response = client.post(
            "/api/projects/english-learning-app-poc/respondents/generate",
            json={"count_per_persona": 2}
        )
    assert response.status_code == 503
    assert "respondent-generator" in response.json()["detail"]


def test_generate_persona_draft_success():
    db = TestingSessionLocal()
    persona_count_before = db.query(models.Persona).count()
    db.close()

    async def fake_persona_draft(project, custom_prompt):
        draft = PersonaDraftOutput(
            name="Thao Nguyen",
            segment="IELTS Speaking Candidate",
            quote="I need speaking practice that feels realistic, not robotic.",
            demographics=[
                "Age: 22",
                "Location: HCMC, Vietnam",
                "Gender: Female",
                "Occupation: Final-year Student",
                "Income: Medium",
            ],
            goals=["Reach IELTS band 7.0", "Practice daily topics"],
            pain_points=["Center mock tests are expensive", "Self-study lacks direct feedback"],
            motivations=["Graduate on time", "Apply for scholarships"],
            buying_behavior=["Compares review videos", "Checks pricing carefully"],
            decision_rules=["Must feel IELTS-specific", "Needs clear score explanation"],
            objections=["AI scoring credibility", "Premium pricing risk"],
            channels=["TikTok", "Facebook groups"],
            assumptions=["Assumes mobile-first practice habits"],
            confidence_score=90.0,
            jtbd=PersonaJTBDOutput(
                functional_job="Practice IELTS parts 1-3 under time limits",
                emotional_job="Feel calmer before the exam",
                social_job="Earn respect through a strong score",
                success_criteria=["Band 7.0", "Feedback on grammar mistakes"],
            ),
            psychographics=PersonaPsychographicsOutput(
                personality_traits=["Ambitious", "Structured"],
                core_values=["Achievement", "Efficiency"],
                risk_tolerance="Neutral",
                tech_savviness="High",
            ),
            product_fit=PersonaProductFitOutput(
                must_haves=["IELTS-specific grading", "Instant corrections"],
                nice_to_haves=["Progress tracker"],
                deal_breakers=["Generic speaking topics"],
                alternatives=["IELTS center mocks", "Private tutors"],
            ),
            journey_map=[
                PersonaJourneyStageOutput(
                    stage="Awareness",
                    goals=["Find IELTS speaking practice apps"],
                    pain_points=["Tutors cost too much"],
                    touchpoints=["TikTok IELTS channel"],
                )
            ],
            validation=PersonaValidationOutput(
                is_human_validated=False,
                evidence_sources=["Synthetic prompt-based draft"],
                last_validated_at=None,
            ),
        )
        return LLMExecutionResult(
            parsed=draft,
            request_payload={"task_name": "persona_draft_generation"},
            raw_response={"choices": []},
            parsed_output=draft.model_dump(),
            provider="openai",
            model_alias="persona-drafter",
            resolved_model="openai/gpt-4o-mini",
            usage={"total_tokens": 12},
        )

    with patch(
        "app.features.personas.service.generate_persona_draft_execution",
        new=AsyncMock(side_effect=fake_persona_draft),
    ):
        response = client.post(
            "/api/projects/english-learning-app-poc/personas/draft",
            json={
                "custom_prompt": "Create a structured persona for an IELTS speaking learner who is budget-conscious and wants realistic feedback."
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["name"] == "Thao Nguyen"
    assert payload["segment"] == "IELTS Speaking Candidate"
    assert payload["validation"]["is_human_validated"] is False

    db = TestingSessionLocal()
    try:
        persona_count_after = db.query(models.Persona).count()
        assert persona_count_after == persona_count_before

        ai_run = (
            db.query(models.AIRun)
            .filter(models.AIRun.task_type == "persona_draft_generation")
            .order_by(models.AIRun.created_at.desc())
            .first()
        )
        assert ai_run is not None
        assert ai_run.status == "completed"
    finally:
        db.close()


def test_generate_persona_draft_requires_llm_config():
    with patch(
        "app.features.personas.service.generate_persona_draft_execution",
        new=AsyncMock(
            side_effect=LLMConfigurationError(
                "No API key configured for alias 'persona-drafter'. Set one of: "
                "LLM_ALIAS_PERSONA_DRAFTER_API_KEY, GROQ_API_KEY."
            )
        ),
    ):
        response = client.post(
            "/api/projects/english-learning-app-poc/personas/draft",
            json={"custom_prompt": "Create a persona for a serious IELTS learner."},
        )

    assert response.status_code == 503
    assert "persona-drafter" in response.json()["detail"]


def test_generate_persona_persists_read_only_profile():
    db = TestingSessionLocal()
    persona_count_before = db.query(models.Persona).count()
    db.close()

    async def fake_persona_generation(project, custom_prompt):
        persona = PersonaDraftOutput(
            name="Steven Matthews",
            segment="Metro Gen Z Sneakerhead",
            quote="I plan around drops, resale moves, and legit checks.",
            demographics=[
                "Age: 22",
                "Location: New York, United States",
                "Gender: Male",
                "Occupation: Runner and sneaker collector",
                "Income: Medium",
            ],
            goals=["Secure key SNKRS drops", "Build a curated sneaker rotation"],
            pain_points=["Low SNKRS win rates", "Fake pairs on resale platforms"],
            motivations=["Streetwear status", "Performance confidence"],
            buying_behavior=["Tracks resale prices", "Watches reviewer videos"],
            decision_rules=["Must be authentic", "Must fit sport and nightlife"],
            objections=["Bots dominate limited drops", "Resale pricing feels risky"],
            channels=["Social", "Messaging", "YouTube"],
            assumptions=["Prompt-based synthetic audience profile"],
            confidence_score=86.0,
            jtbd=PersonaJTBDOutput(
                functional_job="Find authentic shoes for running, basketball, and outfits",
                emotional_job="Feel ahead of culture without overspending",
                social_job="Signal taste within sneaker and sports circles",
                success_criteria=["Authentic pair", "Fair price", "Strong fit"],
            ),
            psychographics=PersonaPsychographicsOutput(
                personality_traits=["Trend-aware", "Analytical"],
                core_values=["Fitness", "Authenticity"],
                risk_tolerance="Medium",
                tech_savviness="High",
            ),
            product_fit=PersonaProductFitOutput(
                must_haves=["Drop calendar", "Authenticity signals"],
                nice_to_haves=["Resale trend alerts"],
                deal_breakers=["Fake inventory"],
                alternatives=["GOAT", "StockX"],
            ),
            journey_map=[
                PersonaJourneyStageOutput(
                    stage="Consideration",
                    goals=["Compare release value"],
                    pain_points=["Signals are scattered"],
                    touchpoints=["SNKRS", "YouTube"],
                )
            ],
            validation=PersonaValidationOutput(
                is_human_validated=False,
                evidence_sources=["Synthetic prompt-based generation"],
                last_validated_at=None,
            ),
            insight_profile={
                "profile_information": {
                    "summary": "A New York sneakerhead balancing performance, style, and resale value.",
                    "personal_aspirations": "Stay fit, build taste, and avoid bad purchases.",
                },
                "buying_behavior": {
                    "purchase_decision_factors": ["Authenticity", "Resale movement"],
                    "triggers": ["SNKRS notifications", "Shock drop rumors"],
                },
                "psychological_drivers": {
                    "goals": ["Win priority drops"],
                    "motivations": ["Social status"],
                    "key_needs": ["Transparent release info"],
                },
                "key_obstacles": {
                    "core_challenges": ["Bots"],
                    "day_to_day_pain_points": ["Missed drops"],
                    "perceived_barriers": ["Insider access"],
                },
                "work_lifestyle": {
                    "occupation": "Sneaker collector",
                    "industry": "Sports",
                    "income": "Medium",
                    "marital_status": "Married",
                    "housing_status": "Rents house",
                },
                "communication": [{"label": "Social", "weight": 92}],
                "media_digital": {
                    "media_news_sources": [{"label": "Complex", "weight": 80}],
                    "social_networks": [{"label": "YouTube", "weight": 90}],
                    "websites_visited": [{"label": "snkrs.com", "weight": 95}],
                    "subreddits": ["/r/Sneakers"],
                    "hashtags": ["#SNKRS"],
                    "content_types": [{"label": "Community sharing", "weight": 88}],
                },
                "brand_commerce": {
                    "brands": [{"label": "Nike", "weight": 98}],
                    "shopping_websites": [{"label": "GOAT", "weight": 86}],
                    "products": [{"label": "Footwear", "weight": 96}],
                    "services": [{"label": "Authentication", "weight": 82}],
                },
                "preferences": {
                    "sports": [{"label": "Running", "weight": 85}],
                    "entertainment": [{"label": "Nightlife", "weight": 70}],
                    "news": [{"label": "Sneaker news", "weight": 80}],
                    "places_likely_to_visit": [{"label": "Gyms", "weight": 72}],
                    "events_conferences": [{"label": "Nike community run", "weight": 88}],
                    "values": [{"label": "Healthy living", "weight": 84}],
                    "hobbies": [{"label": "Sports", "weight": 82}],
                    "interests": [{"label": "Technology", "weight": 55}],
                    "tools": [{"label": "Calendars", "weight": 76}],
                },
                "website_interaction": {
                    "first_interaction_day": "Weekday",
                    "first_interaction_time": "Mid day",
                    "influential_resources": [{"label": "Events", "weight": 90}],
                    "resonating_topics": [{"label": "snkrs_drop_strategy", "weight": 94}],
                },
                "industry_specific_insights": {
                    "apparel_fashion": {
                        "footwear_type": [{"label": "sneaker", "weight": 95}]
                    },
                    "sporting_goods": {
                        "activity_type": [{"label": "running", "weight": 85}]
                    },
                    "consumer_goods": {
                        "supply_stationery": [{"label": "calendar", "weight": 45}]
                    },
                },
            },
        )
        return LLMExecutionResult(
            parsed=persona,
            request_payload={"task_name": "persona_draft_generation"},
            raw_response={"choices": []},
            parsed_output=persona.model_dump(),
            provider="openai",
            model_alias="persona-drafter",
            resolved_model="openai/gpt-4o-mini",
            usage={"total_tokens": 20},
        )

    with patch(
        "app.features.personas.service.generate_persona_draft_execution",
        new=AsyncMock(side_effect=fake_persona_generation),
    ):
        response = client.post(
            "/api/projects/english-learning-app-poc/personas/generate",
            json={"custom_prompt": "Create a Nike SNKRS sneakerhead persona."},
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["id"].startswith("persona-")
    assert payload["project_id"] == "english-learning-app-poc"
    assert payload["validation"]["is_human_validated"] is False
    assert payload["insight_profile"]["brand_commerce"]["brands"][0]["label"] == "Nike"

    db = TestingSessionLocal()
    try:
        persona_count_after = db.query(models.Persona).count()
        assert persona_count_after == persona_count_before + 1
        persisted = db.query(models.Persona).filter(models.Persona.id == payload["id"]).first()
        assert persisted is not None
        assert persisted.insight_profile["website_interaction"]["first_interaction_day"] == "Weekday"

        ai_run = (
            db.query(models.AIRun)
            .filter(models.AIRun.persona_id == payload["id"])
            .first()
        )
        assert ai_run is not None
        assert ai_run.status == "completed"
    finally:
        db.close()


def test_get_respondents_success():
    # Make sure we can retrieve the generated respondents
    response = client.get("/api/projects/english-learning-app-poc/respondents")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 6


def test_run_study_success():
    async def fake_answer_execution(respondent, persona, question, project_desc):
        if question.type == "likert":
            answer = "4"
        elif question.type == "single_choice":
            answer = question.options[0].value
        else:
            answer = "Synthetic concern about price transparency."

        parsed = StudyAnswerOutput(answer=answer)
        return LLMExecutionResult(
            parsed=parsed,
            request_payload={"task_name": "study_simulation"},
            raw_response={"choices": []},
            parsed_output={"answer": answer, "response_id": f"{respondent.id}-{question.id}"},
            provider="openai",
            model_alias="study-simulator",
            resolved_model="openai/gpt-4o-mini",
            usage={"total_tokens": 5},
        )

    with patch(
        "app.features.studies.service.simulate_respondent_answer_execution",
        new=AsyncMock(side_effect=fake_answer_execution),
    ):
        response = client.post(
            "/api/studies/study-concept-test/run",
            json={"persona_ids": []},
        )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 18

    db = TestingSessionLocal()
    try:
        study = db.query(models.Study).filter(models.Study.id == "study-concept-test").first()
        assert study.status == "completed"
        ai_run = db.query(models.AIRun).filter(
            models.AIRun.task_type == "study_simulation",
            models.AIRun.study_id == "study-concept-test",
        ).order_by(models.AIRun.created_at.desc()).first()
        assert ai_run is not None
        assert ai_run.status == "completed"
    finally:
        db.close()


def test_get_study_results_success():
    response = client.get("/api/studies/study-concept-test/results")
    assert response.status_code == 200
    data = response.json()
    assert data["study_id"] == "study-concept-test"
    assert data["total_respondents"] == 6
    assert len(data["quantitative"]) == 3


def test_generate_respondents_project_not_found():
    response = client.post(
        "/api/projects/non-existent-project/respondents/generate",
        json={"count_per_persona": 2}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"


def test_get_respondents_project_not_found():
    response = client.get("/api/projects/non-existent-project/respondents")
    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"


def test_project_crud():
    # 1. Create Project
    response = client.post(
        "/api/projects",
        json={
            "name": "Test Project",
            "product_description": "A test product desc",
            "industry": "Software",
            "market": "Global",
            "target_audience": "Developers",
            "research_objective": "Validate pricing",
            "study_type": "Synthetic Concept / Message Test"
        }
    )
    assert response.status_code == 200
    project = response.json()
    assert "project-" in project["id"]
    assert project["name"] == "Test Project"
    
    # 2. Update Project
    response = client.put(
        f"/api/projects/{project['id']}",
        json={
            "name": "Updated Test Project",
            "product_description": "Updated test product desc",
            "industry": "Software",
            "market": "Global",
            "target_audience": "Developers",
            "research_objective": "Validate pricing",
            "study_type": "Synthetic Concept / Message Test"
        }
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Test Project"
    
    # 3. Create Persona for this Project
    response = client.post(
        f"/api/projects/{project['id']}/personas",
        json={
            "name": "Test Persona",
            "segment": "Developers segment",
            "quote": "I love testing",
            "demographics": ["Dev"],
            "goals": ["Build fast"],
            "pain_points": ["Bugs"],
            "motivations": ["Praise"],
            "buying_behavior": ["Online"],
            "decision_rules": ["Free tier"],
            "objections": ["Expensive"],
            "channels": ["Github"],
            "assumptions": ["Fast is better"],
            "confidence_score": 90.0
        }
    )
    assert response.status_code == 200
    persona = response.json()
    assert persona["name"] == "Test Persona"
    
    # 4. Update Persona
    response = client.put(
        f"/api/personas/{persona['id']}",
        json={
            "name": "Updated Test Persona",
            "segment": "Developers segment",
            "quote": "I love testing",
            "demographics": ["Dev"],
            "goals": ["Build fast"],
            "pain_points": ["Bugs"],
            "motivations": ["Praise"],
            "buying_behavior": ["Online"],
            "decision_rules": ["Free tier"],
            "objections": ["Expensive"],
            "channels": ["Github"],
            "assumptions": ["Fast is better"],
            "confidence_score": 95.0
        }
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Test Persona"
    assert response.json()["confidence_score"] == 95.0
    
    # 5. Delete Persona
    response = client.delete(f"/api/personas/{persona['id']}")
    assert response.status_code == 200
    
    # 6. Delete Project
    response = client.delete(f"/api/projects/{project['id']}")
    assert response.status_code == 200
