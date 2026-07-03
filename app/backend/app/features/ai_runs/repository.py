from datetime import datetime
from typing import Any
import uuid

from sqlalchemy.orm import Session

from app.models import models


def create_ai_run(
    db: Session,
    *,
    task_type: str,
    model_alias: str,
    provider: str,
    resolved_model: str,
    project_id: str | None = None,
    study_id: str | None = None,
    persona_id: str | None = None,
    request_payload: dict[str, Any] | None = None,
) -> models.AIRun:
    ai_run = models.AIRun(
        id=f"airun-{uuid.uuid4().hex[:8]}",
        task_type=task_type,
        status="pending",
        model_alias=model_alias,
        provider=provider,
        resolved_model=resolved_model,
        project_id=project_id,
        study_id=study_id,
        persona_id=persona_id,
        request_payload=request_payload,
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(ai_run)
    db.flush()
    return ai_run


def mark_ai_run_running(db: Session, ai_run: models.AIRun) -> models.AIRun:
    ai_run.status = "running"
    ai_run.started_at = datetime.utcnow().isoformat()
    db.flush()
    return ai_run


def mark_ai_run_completed(
    db: Session,
    ai_run: models.AIRun,
    *,
    raw_response: dict[str, Any] | None,
    parsed_output: dict[str, Any] | None,
    usage: dict[str, Any] | None = None,
) -> models.AIRun:
    ai_run.status = "completed"
    ai_run.raw_response = raw_response
    ai_run.parsed_output = parsed_output
    ai_run.usage = usage
    ai_run.error_detail = None
    ai_run.completed_at = datetime.utcnow().isoformat()
    db.flush()
    return ai_run


def mark_ai_run_failed(
    db: Session,
    ai_run: models.AIRun,
    *,
    error_detail: str,
    raw_response: dict[str, Any] | None = None,
    parsed_output: dict[str, Any] | None = None,
    usage: dict[str, Any] | None = None,
) -> models.AIRun:
    ai_run.status = "failed"
    ai_run.error_detail = error_detail
    ai_run.raw_response = raw_response
    ai_run.parsed_output = parsed_output
    ai_run.usage = usage
    ai_run.completed_at = datetime.utcnow().isoformat()
    db.flush()
    return ai_run
