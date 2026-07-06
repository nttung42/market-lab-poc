import json

from sqlalchemy.orm import Session

from app.config import LLMConfigurationError
from app.core.errors import DomainNotFoundError, DomainValidationError
from app.features.ai_runs import repository as ai_run_repository
from app.features.projects.service import get_project
from app.features.studies import repository
from app.infra.ai.tasks import STUDY_SIMULATION_TASK, STUDY_SIMULATOR_ALIAS
from app.models import models
from app.schemas import schemas
from app.services.study_simulator import simulate_respondent_answer_execution


def list_project_studies(db: Session, project_id: str) -> list[models.Study]:
    get_project(db, project_id)
    return repository.list_project_studies(db, project_id)


def create_project_study(
    db: Session, project_id: str, study_data: schemas.StudyBase
) -> models.Study:
    get_project(db, project_id)
    return repository.create_study(db, project_id, study_data)


def get_study(db: Session, study_id: str) -> models.Study:
    study = repository.get_study_by_id(db, study_id)
    if not study:
        raise DomainNotFoundError("Study not found")
    return study


def create_study_question(
    db: Session, study_id: str, question_data: schemas.QuestionCreate
) -> models.Question:
    get_study(db, study_id)
    return repository.create_question(db, study_id, question_data)


def update_study(
    db: Session, study_id: str, study_data: schemas.StudyBase
) -> models.Study:
    study = get_study(db, study_id)
    study.title = study_data.title
    db.commit()
    db.refresh(study)
    return study


def delete_study(db: Session, study_id: str) -> dict[str, str | bool]:
    study = get_study(db, study_id)
    db.delete(study)
    db.commit()
    return {"success": True, "message": f"Study {study_id} deleted successfully"}


def _normalize_answer(question: models.Question, answer_value) -> str:
    if question.type == "likert":
        answer = str(answer_value)
        if answer not in {"1", "2", "3", "4", "5"}:
            raise DomainValidationError(
                f"Invalid likert answer '{answer}' for question {question.id}"
            )
        return answer

    if question.type == "single_choice":
        answer = str(answer_value)
        valid_options = {opt.value for opt in question.options}
        if answer not in valid_options:
            raise DomainValidationError(
                f"Invalid single_choice answer '{answer}' for question {question.id}"
            )
        return answer

    if question.type == "multi_choice":
        if not isinstance(answer_value, list):
            raise DomainValidationError(
                f"Expected a list answer for multi_choice question {question.id}"
            )
        valid_options = {opt.value for opt in question.options}
        if not answer_value or any(value not in valid_options for value in answer_value):
            raise DomainValidationError(
                f"Invalid multi_choice answer '{answer_value}' for question {question.id}"
            )
        return json.dumps(answer_value)

    answer = str(answer_value).strip()
    if not answer:
        raise DomainValidationError(f"Open-text answer is empty for question {question.id}")
    return answer


async def run_study_simulation(
    db: Session, study_id: str, req: schemas.StudyRunRequest
) -> list[models.Response]:
    study = get_study(db, study_id)
    project_id = study.project_id
    respondents = repository.list_project_respondents(db, project_id)
    if not respondents:
        raise DomainValidationError(
            "No synthetic respondents generated for this project. Please generate them first."
        )

    if req.persona_ids:
        respondents = [r for r in respondents if r.persona_id in req.persona_ids]
        if not respondents:
            raise DomainValidationError(
                "No respondents matching the specified persona filters."
            )

    personas = repository.list_project_personas(db, project_id)
    personas_dict = {persona.id: persona for persona in personas}
    project = get_project(db, project_id)

    ai_run = ai_run_repository.create_ai_run(
        db,
        task_type=STUDY_SIMULATION_TASK,
        model_alias=STUDY_SIMULATOR_ALIAS,
        provider="pending",
        resolved_model="pending",
        project_id=project_id,
        study_id=study_id,
        request_payload={
            "study_id": study.id,
            "project_id": project_id,
            "persona_ids": req.persona_ids,
            "respondent_count": len(respondents),
            "question_count": len(study.questions),
        },
    )
    ai_run_repository.mark_ai_run_running(db, ai_run)
    db.commit()

    response_payloads: list[dict] = []
    raw_results = []
    parsed_results = []
    total_usage = None

    try:
        for respondent in respondents:
            persona = personas_dict.get(respondent.persona_id)
            if not persona:
                continue

            for question in study.questions:
                execution = await simulate_respondent_answer_execution(
                    respondent, persona, question, project.product_description
                )
                ai_run.provider = execution.provider
                ai_run.resolved_model = execution.resolved_model
                normalized_answer = _normalize_answer(
                    question, execution.parsed.answer
                )
                response_payloads.append(
                    {
                        "id": execution.parsed_output.get("response_id"),
                        "study_id": study.id,
                        "respondent_id": respondent.id,
                        "question_id": question.id,
                        "answer": normalized_answer,
                    }
                )
                raw_results.append(execution.raw_response)
                parsed_results.append(
                    {
                        "respondent_id": respondent.id,
                        "question_id": question.id,
                        "parsed_output": execution.parsed_output,
                    }
                )
                total_usage = execution.usage
    except Exception as exc:
        ai_run_repository.mark_ai_run_failed(
            db,
            ai_run,
            error_detail=str(exc),
            raw_response={"executions": raw_results} if raw_results else None,
            parsed_output={"executions": parsed_results} if parsed_results else None,
            usage=total_usage,
        )
        db.commit()
        raise

    db_responses = repository.replace_study_responses(
        db,
        study_id=study_id,
        respondent_ids=[respondent.id for respondent in respondents],
        response_payloads=response_payloads,
    )
    study.status = "completed"
    ai_run_repository.mark_ai_run_completed(
        db,
        ai_run,
        raw_response={"executions": raw_results},
        parsed_output={"executions": parsed_results},
        usage=total_usage,
    )
    db.commit()

    for response in db_responses:
        db.refresh(response)
    return db_responses
