import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.database import Base, get_db
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
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Seed database
    seed_db(db)
    db.close()
    yield
    # Drop tables after tests
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
