from sqlalchemy.orm import Session

from app.config import LLMConfigurationError
from app.core.errors import DomainNotFoundError, DomainValidationError
from app.features.ai_runs import repository as ai_run_repository
from app.features.projects.service import get_project
from app.features.respondents import repository
from app.infra.ai.tasks import (
    RESPONDENT_GENERATION_TASK,
    RESPONDENT_GENERATOR_ALIAS,
)
from app.models import models
from app.services.respondent_generator import (
    build_respondent_records,
    generate_respondents_execution,
)


def list_project_respondents(db: Session, project_id: str) -> list[models.Respondent]:
    get_project(db, project_id)
    return repository.list_project_respondents(db, project_id)


async def generate_project_respondents(
    db: Session, project_id: str, count_per_persona: int
) -> list[models.Respondent]:
    project = get_project(db, project_id)
    personas = repository.list_project_personas(db, project_id)
    if not personas:
        raise DomainValidationError("No personas found for this project")

    generated_payloads: list[dict] = []
    ai_runs: list[models.AIRun] = []

    try:
        for persona in personas:
            run = ai_run_repository.create_ai_run(
                db,
                task_type=RESPONDENT_GENERATION_TASK,
                model_alias=RESPONDENT_GENERATOR_ALIAS,
                provider="pending",
                resolved_model="pending",
                project_id=project.id,
                persona_id=persona.id,
                request_payload={
                    "project_id": project.id,
                    "persona_id": persona.id,
                    "requested_count": count_per_persona,
                },
            )
            ai_run_repository.mark_ai_run_running(db, run)
            ai_runs.append(run)

            execution = await generate_respondents_execution(persona, count_per_persona)
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
            generated_payloads.extend(build_respondent_records(persona, execution.parsed))
    except Exception as exc:
        if ai_runs:
            latest = ai_runs[-1]
            ai_run_repository.mark_ai_run_failed(
                db,
                latest,
                error_detail=str(exc),
            )
        else:
            failed_run = ai_run_repository.create_ai_run(
                db,
                task_type=RESPONDENT_GENERATION_TASK,
                model_alias=RESPONDENT_GENERATOR_ALIAS,
                provider="pending",
                resolved_model="pending",
                project_id=project.id,
            )
            ai_run_repository.mark_ai_run_failed(
                db,
                failed_run,
                error_detail=str(exc),
            )
        db.commit()
        raise

    respondents = repository.replace_project_respondents(db, project_id, generated_payloads)
    db.commit()
    for respondent in respondents:
        db.refresh(respondent)
    return respondents
