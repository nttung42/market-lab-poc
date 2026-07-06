import uuid

from sqlalchemy.orm import Session

from app.core.errors import DomainNotFoundError
from app.features.ai_runs import repository as ai_run_repository
from app.features.projects.service import get_project
from app.infra.ai.tasks import PERSONA_DRAFT_GENERATION_TASK, PERSONA_DRAFTER_ALIAS
from app.models import models
from app.schemas import schemas
from app.services.persona_generator import generate_persona_draft_execution


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
        insight_profile=persona_data.insight_profile,
    )
    db.add(db_persona)
    db.commit()
    db.refresh(db_persona)
    return db_persona


async def generate_project_persona_draft(
    db: Session, project_id: str, draft_request: schemas.PersonaDraftRequest
) -> schemas.PersonaDraft:
    project = get_project(db, project_id)
    run = ai_run_repository.create_ai_run(
        db,
        task_type=PERSONA_DRAFT_GENERATION_TASK,
        model_alias=PERSONA_DRAFTER_ALIAS,
        provider="pending",
        resolved_model="pending",
        project_id=project.id,
        request_payload={
            "project_id": project.id,
            "custom_prompt": draft_request.custom_prompt,
        },
    )
    ai_run_repository.mark_ai_run_running(db, run)
    db.commit()

    try:
        execution = await generate_persona_draft_execution(
            project, draft_request.custom_prompt
        )
        run.provider = execution.provider
        run.resolved_model = execution.resolved_model
        run.request_payload = execution.request_payload
        ai_run_repository.mark_ai_run_completed(
            db,
            run,
            raw_response=execution.raw_response,
            parsed_output=execution.parsed_output,
            usage=execution.usage,
        )
        db.commit()
        return schemas.PersonaDraft.model_validate(execution.parsed.model_dump())
    except Exception as exc:
        ai_run_repository.mark_ai_run_failed(
            db,
            run,
            error_detail=str(exc),
        )
        db.commit()
        raise


async def generate_project_persona(
    db: Session, project_id: str, generate_request: schemas.PersonaDraftRequest
) -> models.Persona:
    project = get_project(db, project_id)
    run = ai_run_repository.create_ai_run(
        db,
        task_type=PERSONA_DRAFT_GENERATION_TASK,
        model_alias=PERSONA_DRAFTER_ALIAS,
        provider="pending",
        resolved_model="pending",
        project_id=project.id,
        request_payload={
            "project_id": project.id,
            "custom_prompt": generate_request.custom_prompt,
            "mode": "persisted_read_only_persona",
        },
    )
    ai_run_repository.mark_ai_run_running(db, run)
    db.commit()

    try:
        execution = await generate_persona_draft_execution(
            project, generate_request.custom_prompt
        )
        persona_data = schemas.PersonaBase.model_validate(execution.parsed.model_dump())
        db_persona = models.Persona(
            id=f"persona-{uuid.uuid4().hex[:8]}",
            project_id=project.id,
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
            insight_profile=persona_data.insight_profile,
        )
        db.add(db_persona)
        db.flush()

        run.provider = execution.provider
        run.resolved_model = execution.resolved_model
        run.persona_id = db_persona.id
        run.request_payload = execution.request_payload
        ai_run_repository.mark_ai_run_completed(
            db,
            run,
            raw_response=execution.raw_response,
            parsed_output=execution.parsed_output,
            usage=execution.usage,
        )
        db.commit()
        db.refresh(db_persona)
        return db_persona
    except Exception as exc:
        ai_run_repository.mark_ai_run_failed(
            db,
            run,
            error_detail=str(exc),
        )
        db.commit()
        raise


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
    persona.insight_profile = persona_data.insight_profile
    db.commit()
    db.refresh(persona)
    return persona


def delete_persona(db: Session, persona_id: str) -> dict[str, str | bool]:
    persona = get_persona(db, persona_id)
    db.delete(persona)
    db.commit()
    return {"success": True, "message": f"Persona {persona_id} deleted successfully"}
