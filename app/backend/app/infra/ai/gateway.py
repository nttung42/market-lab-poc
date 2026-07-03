from dataclasses import dataclass
from typing import Any, Generic, Protocol, TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


@dataclass
class LLMExecutionResult(Generic[T]):
    parsed: T
    request_payload: dict[str, Any]
    raw_response: dict[str, Any]
    parsed_output: dict[str, Any]
    provider: str
    model_alias: str
    resolved_model: str
    usage: dict[str, Any] | None


class LLMGateway(Protocol):
    async def generate_structured(
        self,
        *,
        task_name: str,
        model_alias: str,
        messages: list[dict[str, str]],
        response_schema: type[T],
        metadata: dict[str, Any] | None = None,
    ) -> LLMExecutionResult[T]: ...


def get_llm_gateway() -> LLMGateway:
    from app.infra.ai.litellm_sdk import LiteLLMSDKGateway

    return LiteLLMSDKGateway()
