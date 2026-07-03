import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import AsyncMock, patch
from app.config import LLMConfigurationError
from app.db.database import Base, get_db
from app.models import models
from app.infra.ai.gateway import LLMExecutionResult
from app.infra.ai.schemas import RespondentGenerationOutput, RespondentOutput, StudyAnswerOutput
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
