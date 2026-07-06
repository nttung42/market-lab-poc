import json

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import LLMConfigurationError
from app.core.errors import DomainNotFoundError, DomainValidationError
from app.db.database import get_db
from app.features.personas import service as persona_service
from app.features.projects import service as project_service
from app.features.respondents import service as respondent_service
from app.features.studies import results_service, service as study_service
from app.schemas import schemas

router = APIRouter()


def _map_service_exception(exc: Exception) -> HTTPException:
    if isinstance(exc, DomainNotFoundError):
        return HTTPException(status_code=404, detail=str(exc))
    if isinstance(exc, DomainValidationError):
        return HTTPException(status_code=400, detail=str(exc))
    if isinstance(exc, LLMConfigurationError):
        return HTTPException(status_code=503, detail=str(exc))
    if isinstance(exc, (httpx.HTTPError, RuntimeError, ValueError, KeyError, json.JSONDecodeError)):
        return HTTPException(status_code=502, detail=str(exc))
    raise exc


@router.get("/projects", response_model=list[schemas.Project])
def read_projects(db: Session = Depends(get_db)):
    return project_service.list_projects(db)


@router.get("/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: str, db: Session = Depends(get_db)):
    try:
        return project_service.get_project(db, project_id)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.get("/projects/{project_id}/personas", response_model=list[schemas.Persona])
def read_project_personas(project_id: str, db: Session = Depends(get_db)):
    try:
        return persona_service.list_project_personas(db, project_id)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.get("/personas/{persona_id}", response_model=schemas.Persona)
def read_persona(persona_id: str, db: Session = Depends(get_db)):
    try:
        return persona_service.get_persona(db, persona_id)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.post("/projects/{project_id}/respondents/generate", response_model=list[schemas.Respondent])
async def generate_project_respondents(
    project_id: str,
    req: schemas.RespondentGenerateRequest,
    db: Session = Depends(get_db),
):
    try:
        return await respondent_service.generate_project_respondents(
            db, project_id, req.count_per_persona
        )
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.get("/projects/{project_id}/respondents", response_model=list[schemas.Respondent])
def read_project_respondents(project_id: str, db: Session = Depends(get_db)):
    try:
        return respondent_service.list_project_respondents(db, project_id)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.get("/projects/{project_id}/studies", response_model=list[schemas.Study])
def read_project_studies(project_id: str, db: Session = Depends(get_db)):
    try:
        return study_service.list_project_studies(db, project_id)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.post("/projects/{project_id}/studies", response_model=schemas.Study)
def create_project_study(
    project_id: str,
    study_data: schemas.StudyBase,
    db: Session = Depends(get_db),
):
    try:
        return study_service.create_project_study(db, project_id, study_data)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.get("/studies/{study_id}", response_model=schemas.Study)
def read_study(study_id: str, db: Session = Depends(get_db)):
    try:
        return study_service.get_study(db, study_id)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.post("/studies/{study_id}/questions", response_model=schemas.Question)
def create_study_question(
    study_id: str,
    question_data: schemas.QuestionCreate,
    db: Session = Depends(get_db),
):
    try:
        return study_service.create_study_question(db, study_id, question_data)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.post("/studies/{study_id}/run", response_model=list[schemas.Response])
async def run_study_simulation(
    study_id: str,
    req: schemas.StudyRunRequest,
    db: Session = Depends(get_db),
):
    try:
        return await study_service.run_study_simulation(db, study_id, req)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.get("/studies/{study_id}/results", response_model=schemas.StudyResults)
def get_study_results(study_id: str, db: Session = Depends(get_db)):
    try:
        return results_service.get_study_results(db, study_id)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.post("/projects", response_model=schemas.Project)
def create_project(project_data: schemas.ProjectBase, db: Session = Depends(get_db)):
    return project_service.create_project(db, project_data)


@router.put("/projects/{project_id}", response_model=schemas.Project)
def update_project(
    project_id: str, project_data: schemas.ProjectBase, db: Session = Depends(get_db)
):
    try:
        return project_service.update_project(db, project_id, project_data)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.delete("/projects/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    try:
        return project_service.delete_project(db, project_id)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.post("/projects/{project_id}/personas", response_model=schemas.Persona)
def create_project_persona(
    project_id: str, persona_data: schemas.PersonaBase, db: Session = Depends(get_db)
):
    try:
        return persona_service.create_project_persona(db, project_id, persona_data)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.post("/projects/{project_id}/personas/draft", response_model=schemas.PersonaDraft)
async def generate_project_persona_draft(
    project_id: str,
    draft_request: schemas.PersonaDraftRequest,
    db: Session = Depends(get_db),
):
    try:
        return await persona_service.generate_project_persona_draft(
            db, project_id, draft_request
        )
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.post("/projects/{project_id}/personas/generate", response_model=schemas.Persona)
async def generate_project_persona(
    project_id: str,
    generate_request: schemas.PersonaDraftRequest,
    db: Session = Depends(get_db),
):
    try:
        return await persona_service.generate_project_persona(
            db, project_id, generate_request
        )
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.put("/personas/{persona_id}", response_model=schemas.Persona)
def update_persona(
    persona_id: str, persona_data: schemas.PersonaBase, db: Session = Depends(get_db)
):
    try:
        return persona_service.update_persona(db, persona_id, persona_data)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.delete("/personas/{persona_id}")
def delete_persona(persona_id: str, db: Session = Depends(get_db)):
    try:
        return persona_service.delete_persona(db, persona_id)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.put("/studies/{study_id}", response_model=schemas.Study)
def update_study(
    study_id: str, study_data: schemas.StudyBase, db: Session = Depends(get_db)
):
    try:
        return study_service.update_study(db, study_id, study_data)
    except Exception as exc:
        raise _map_service_exception(exc) from exc


@router.delete("/studies/{study_id}")
def delete_study(study_id: str, db: Session = Depends(get_db)):
    try:
        return study_service.delete_study(db, study_id)
    except Exception as exc:
        raise _map_service_exception(exc) from exc
