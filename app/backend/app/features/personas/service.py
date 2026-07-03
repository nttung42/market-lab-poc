import uuid

from sqlalchemy.orm import Session

from app.core.errors import DomainNotFoundError
from app.features.projects.service import get_project
from app.models import models
from app.schemas import schemas


def list_project_personas(db: Session, project_id: str) -> list[models.Persona]:
    get_project(db, project_id)
    return db.query(models.Persona).filter(models.Persona.project_id == project_id).all()


def get_persona(db: Session, persona_id: str) -> models.Persona:
    persona = db.query(models.Persona).filter(models.Persona.id == persona_id).first()
    if not persona:
        raise DomainNotFoundError("Persona not found")
    return persona


def create_project_persona(
    db: Session, project_id: str, persona_data: schemas.PersonaBase
) -> models.Persona:
    get_project(db, project_id)
    db_persona = models.Persona(
        id=f"persona-{uuid.uuid4().hex[:8]}",
        project_id=project_id,
        name=persona_data.name,
        segment=persona_data.segment,
        quote=persona_data.quote,
        demographics=persona_data.demographics,
        goals=persona_data.goals,
        pain_points=persona_data.pain_points,
        motivations=persona_data.motivations,
        buying_behavior=persona_data.buying_behavior,
        decision_rules=persona_data.decision_rules,
        objections=persona_data.objections,
        channels=persona_data.channels,
        assumptions=persona_data.assumptions,
        confidence_score=persona_data.confidence_score,
        jtbd=persona_data.jtbd,
        psychographics=persona_data.psychographics,
        product_fit=persona_data.product_fit,
        journey_map=persona_data.journey_map,
        validation=persona_data.validation,
    )
    db.add(db_persona)
    db.commit()
    db.refresh(db_persona)
    return db_persona


def update_persona(
    db: Session, persona_id: str, persona_data: schemas.PersonaBase
) -> models.Persona:
    persona = get_persona(db, persona_id)
    persona.name = persona_data.name
    persona.segment = persona_data.segment
    persona.quote = persona_data.quote
    persona.demographics = persona_data.demographics
    persona.goals = persona_data.goals
    persona.pain_points = persona_data.pain_points
    persona.motivations = persona_data.motivations
    persona.buying_behavior = persona_data.buying_behavior
    persona.decision_rules = persona_data.decision_rules
    persona.objections = persona_data.objections
    persona.channels = persona_data.channels
    persona.assumptions = persona_data.assumptions
    persona.confidence_score = persona_data.confidence_score
    persona.jtbd = persona_data.jtbd
    persona.psychographics = persona_data.psychographics
    persona.product_fit = persona_data.product_fit
    persona.journey_map = persona_data.journey_map
    persona.validation = persona_data.validation
    db.commit()
    db.refresh(persona)
    return persona


def delete_persona(db: Session, persona_id: str) -> dict[str, str | bool]:
    persona = get_persona(db, persona_id)
    db.delete(persona)
    db.commit()
    return {"success": True, "message": f"Persona {persona_id} deleted successfully"}
