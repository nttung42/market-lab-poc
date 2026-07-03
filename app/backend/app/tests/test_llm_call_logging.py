from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
import pytest

from app.core import config as core_config
from app.db.database import Base
from app.infra.ai import log_repository
from app.infra.ai.litellm_sdk import LiteLLMSDKGateway
from app.models import models


class DummyStructuredOutput(BaseModel):
    answer: str


class DummyCompletion:
    def __init__(self, payload):
        self._payload = payload
        self._hidden_params = {"response_cost": 0.000123}

    def model_dump(self):
        return self._payload


@pytest.mark.asyncio
async def test_litellm_gateway_persists_llm_call_log(monkeypatch):
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    monkeypatch.setattr(log_repository, "_SCHEMA_READY", True)
    monkeypatch.setattr(log_repository, "SessionLocal", TestingSessionLocal)
    monkeypatch.setattr(core_config, "_ENV_LOADED", True)
    monkeypatch.setenv("GROQ_API_KEY", "test-groq-key")
    monkeypatch.setenv("LLM_ALIAS_RESPONDENT_GENERATOR_PROVIDER", "groq")
    monkeypatch.setenv(
        "LLM_ALIAS_RESPONDENT_GENERATOR_MODEL", "openai/gpt-oss-120b"
    )

    async def fake_acompletion(**kwargs):
        return DummyCompletion(
            {
                "choices": [
                    {
                        "message": {
                            "content": '{"answer":"Synthetic answer"}',
                        }
                    }
                ],
                "usage": {
                    "prompt_tokens": 12,
                    "completion_tokens": 7,
                    "total_tokens": 19,
                },
            }
        )

    import litellm

    monkeypatch.setattr(litellm, "acompletion", fake_acompletion)

    gateway = LiteLLMSDKGateway()
    result = await gateway.generate_structured(
        task_name="test_task",
        model_alias="respondent-generator",
        messages=[
            {"role": "system", "content": "You are a test assistant."},
            {"role": "user", "content": "Say hi."},
        ],
        response_schema=DummyStructuredOutput,
        metadata={"project_id": "proj-1", "persona_id": "persona-1"},
    )

    db = TestingSessionLocal()
    try:
        logs = db.query(models.LLMCallLog).all()
        assert len(logs) == 1
        log = logs[0]
        assert log.task_name == "test_task"
        assert log.status == "completed"
        assert log.request_id is not None
        assert log.feature_name == "test_task"
        assert log.model_alias == "respondent-generator"
        assert log.provider == "groq"
        assert log.model == "groq/openai/gpt-oss-120b"
        assert log.resolved_model == "groq/openai/gpt-oss-120b"
        assert log.project_id == "proj-1"
        assert log.persona_id == "persona-1"
        assert log.input_tokens == 12
        assert log.output_tokens == 7
        assert log.prompt_tokens == 12
        assert log.completion_tokens == 7
        assert log.total_tokens == 19
        assert log.cost == 0.000123
        assert log.tool_calls_count == 0
        assert log.error_type is None
        assert log.raw_response is not None
        assert log.usage == {
            "prompt_tokens": 12,
            "completion_tokens": 7,
            "total_tokens": 19,
        }
    finally:
        db.close()

    assert result.parsed.answer == "Synthetic answer"
