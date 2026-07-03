from datetime import datetime
from typing import Any
import uuid

from app.db.database import Base, SessionLocal, engine, ensure_llm_call_log_schema
from app.models import models

_SCHEMA_READY = False


def _ensure_log_table_ready() -> None:
    global _SCHEMA_READY

    if _SCHEMA_READY:
        return

    Base.metadata.create_all(bind=engine)
    ensure_llm_call_log_schema()
    _SCHEMA_READY = True


def create_llm_call_log(
    *,
    request_id: str | None,
    user_id: str | None,
    feature_name: str | None,
    task_name: str,
    model_alias: str,
    provider: str,
    resolved_model: str,
    request_payload: dict[str, Any] | None,
    request_metadata: dict[str, Any] | None,
    prompt_version: str | None,
) -> str:
    _ensure_log_table_ready()
    db = SessionLocal()
    try:
        metadata = request_metadata or {}
        question_id = metadata.get("study_question_id") or metadata.get("question_id")
        log = models.LLMCallLog(
            id=f"llmlog-{uuid.uuid4().hex[:8]}",
            request_id=request_id or f"llmreq-{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            feature_name=feature_name,
            task_name=task_name,
            status="running",
            model_alias=model_alias,
            provider=provider,
            model=resolved_model,
            resolved_model=resolved_model,
            project_id=metadata.get("project_id"),
            study_id=metadata.get("study_id"),
            persona_id=metadata.get("persona_id"),
            respondent_id=metadata.get("respondent_id"),
            question_id=question_id,
            request_payload=request_payload,
            request_metadata=metadata,
            prompt_version=prompt_version,
            created_at=datetime.utcnow().isoformat(),
        )
        db.add(log)
        db.commit()
        return log.id
    finally:
        db.close()


def complete_llm_call_log(
    log_id: str,
    *,
    raw_response: dict[str, Any] | None,
    usage: dict[str, Any] | None,
    input_tokens: int | None,
    output_tokens: int | None,
    prompt_tokens: int | None,
    completion_tokens: int | None,
    total_tokens: int | None,
    cost: float | None,
    tool_calls_count: int | None,
    latency_ms: float | None,
) -> None:
    _ensure_log_table_ready()
    db = SessionLocal()
    try:
        log = db.query(models.LLMCallLog).filter(models.LLMCallLog.id == log_id).first()
        if not log:
            return

        log.status = "completed"
        log.raw_response = raw_response
        log.usage = usage
        log.input_tokens = input_tokens
        log.output_tokens = output_tokens
        log.prompt_tokens = prompt_tokens
        log.completion_tokens = completion_tokens
        log.total_tokens = total_tokens
        log.cost = cost
        log.tool_calls_count = tool_calls_count
        log.latency_ms = latency_ms
        log.error_type = None
        log.error_detail = None
        log.completed_at = datetime.utcnow().isoformat()
        db.commit()
    finally:
        db.close()


def fail_llm_call_log(
    log_id: str,
    *,
    error_detail: str,
    error_type: str | None,
    raw_response: dict[str, Any] | None,
    usage: dict[str, Any] | None,
    input_tokens: int | None,
    output_tokens: int | None,
    prompt_tokens: int | None,
    completion_tokens: int | None,
    total_tokens: int | None,
    cost: float | None,
    tool_calls_count: int | None,
    latency_ms: float | None,
) -> None:
    _ensure_log_table_ready()
    db = SessionLocal()
    try:
        log = db.query(models.LLMCallLog).filter(models.LLMCallLog.id == log_id).first()
        if not log:
            return

        log.status = "failed"
        log.raw_response = raw_response
        log.usage = usage
        log.input_tokens = input_tokens
        log.output_tokens = output_tokens
        log.prompt_tokens = prompt_tokens
        log.completion_tokens = completion_tokens
        log.total_tokens = total_tokens
        log.cost = cost
        log.tool_calls_count = tool_calls_count
        log.latency_ms = latency_ms
        log.error_type = error_type
        log.error_detail = error_detail
        log.completed_at = datetime.utcnow().isoformat()
        db.commit()
    finally:
        db.close()
