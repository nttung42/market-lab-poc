import logging
import json
from time import perf_counter
from typing import Any

from pydantic import BaseModel

from app.core.config import LLMConfigurationError, get_model_alias_config
from app.infra.ai.gateway import LLMExecutionResult
from app.infra.ai import log_repository

logger = logging.getLogger("backend_ai")


def _normalize_usage(usage: dict[str, Any] | None) -> dict[str, Any] | None:
    if not usage:
        return None

    prompt_tokens = usage.get("prompt_tokens")
    if prompt_tokens is None:
        prompt_tokens = usage.get("input_tokens")

    completion_tokens = usage.get("completion_tokens")
    if completion_tokens is None:
        completion_tokens = usage.get("output_tokens")

    total_tokens = usage.get("total_tokens")
    if total_tokens is None and isinstance(prompt_tokens, int) and isinstance(
        completion_tokens, int
    ):
        total_tokens = prompt_tokens + completion_tokens

    normalized = {
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": total_tokens,
    }
    return {key: value for key, value in normalized.items() if value is not None}


def _extract_tool_calls_count(raw_response: dict[str, Any]) -> int:
    try:
        tool_calls = raw_response["choices"][0]["message"].get("tool_calls") or []
        return len(tool_calls)
    except Exception:
        return 0


def _resolve_response_cost(completion: Any) -> float | None:
    hidden_params = getattr(completion, "_hidden_params", {}) or {}
    response_cost = hidden_params.get("response_cost")
    if response_cost is not None:
        try:
            return float(response_cost)
        except (TypeError, ValueError):
            return None

    try:
        from litellm import completion_cost

        return float(completion_cost(completion_response=completion))
    except Exception:
        return None


def _persist_started_log(
    *,
    task_name: str,
    model_alias: str,
    provider: str,
    resolved_model: str,
    request_payload: dict[str, Any],
    metadata: dict[str, Any] | None,
) -> str | None:
    try:
        return log_repository.create_llm_call_log(
            request_id=(metadata or {}).get("request_id"),
            user_id=(metadata or {}).get("user_id"),
            feature_name=(metadata or {}).get("feature_name") or task_name,
            task_name=task_name,
            model_alias=model_alias,
            provider=provider,
            resolved_model=resolved_model,
            request_payload=request_payload,
            request_metadata=metadata,
            prompt_version=(
                str((metadata or {}).get("prompt_version"))
                if (metadata or {}).get("prompt_version") is not None
                else None
            ),
        )
    except Exception:
        logger.exception(
            "Failed to persist LLM start log task=%s alias=%s provider=%s model=%s",
            task_name,
            model_alias,
            provider,
            resolved_model,
        )
        return None


def _persist_completed_log(
    log_id: str | None,
    *,
    raw_response: dict[str, Any] | None,
    usage: dict[str, Any] | None,
    normalized_usage: dict[str, Any] | None,
    cost: float | None,
    tool_calls_count: int,
    latency_ms: float,
) -> None:
    if not log_id:
        return

    try:
        log_repository.complete_llm_call_log(
            log_id,
            raw_response=raw_response,
            usage=usage,
            input_tokens=normalized_usage.get("prompt_tokens") if normalized_usage else None,
            output_tokens=normalized_usage.get("completion_tokens") if normalized_usage else None,
            prompt_tokens=normalized_usage.get("prompt_tokens") if normalized_usage else None,
            completion_tokens=normalized_usage.get("completion_tokens") if normalized_usage else None,
            total_tokens=normalized_usage.get("total_tokens") if normalized_usage else None,
            cost=cost,
            tool_calls_count=tool_calls_count,
            latency_ms=latency_ms,
        )
    except Exception:
        logger.exception("Failed to persist completed LLM log log_id=%s", log_id)


def _persist_failed_log(
    log_id: str | None,
    *,
    error_detail: str,
    error_type: str | None,
    raw_response: dict[str, Any] | None,
    usage: dict[str, Any] | None,
    normalized_usage: dict[str, Any] | None,
    cost: float | None,
    tool_calls_count: int | None,
    latency_ms: float,
) -> None:
    if not log_id:
        return

    try:
        log_repository.fail_llm_call_log(
            log_id,
            error_detail=error_detail,
            error_type=error_type,
            raw_response=raw_response,
            usage=usage,
            input_tokens=normalized_usage.get("prompt_tokens") if normalized_usage else None,
            output_tokens=normalized_usage.get("completion_tokens") if normalized_usage else None,
            prompt_tokens=normalized_usage.get("prompt_tokens") if normalized_usage else None,
            completion_tokens=normalized_usage.get("completion_tokens") if normalized_usage else None,
            total_tokens=normalized_usage.get("total_tokens") if normalized_usage else None,
            cost=cost,
            tool_calls_count=tool_calls_count,
            latency_ms=latency_ms,
        )
    except Exception:
        logger.exception("Failed to persist failed LLM log log_id=%s", log_id)


class LiteLLMSDKGateway:
    async def generate_structured(
        self,
        *,
        task_name: str,
        model_alias: str,
        messages: list[dict[str, str]],
        response_schema: type[BaseModel],
        metadata: dict[str, Any] | None = None,
    ) -> LLMExecutionResult:
        try:
            from litellm import acompletion
        except ImportError as exc:
            raise RuntimeError(
                "LiteLLM is required for backend AI execution but is not installed."
            ) from exc

        alias_config = get_model_alias_config(model_alias)
        started_at = perf_counter()
        request_payload = {
            "task_name": task_name,
            "model_alias": model_alias,
            "messages": messages,
            "response_format": {"type": "json_object"},
            "metadata": metadata or {},
        }
        log_id = _persist_started_log(
            task_name=task_name,
            model_alias=model_alias,
            provider=alias_config.provider,
            resolved_model=alias_config.litellm_model,
            request_payload=request_payload,
            metadata=metadata,
        )
        logger.info(
            "LLM request started task=%s alias=%s provider=%s model=%s message_count=%s metadata_keys=%s",
            task_name,
            model_alias,
            alias_config.provider,
            alias_config.litellm_model,
            len(messages),
            sorted((metadata or {}).keys()),
        )
        try:
            completion = await acompletion(
                model=alias_config.litellm_model,
                messages=messages,
                api_key=alias_config.api_key,
                api_base=alias_config.api_base,
                response_format={"type": "json_object"},
            )
        except Exception:
            elapsed_ms = round((perf_counter() - started_at) * 1000, 2)
            _persist_failed_log(
                log_id,
                error_detail="Provider call failed.",
                error_type="provider_call_error",
                raw_response=None,
                usage=None,
                normalized_usage=None,
                cost=None,
                tool_calls_count=None,
                latency_ms=elapsed_ms,
            )
            logger.exception(
                "LLM request failed task=%s alias=%s provider=%s model=%s latency_ms=%s",
                task_name,
                model_alias,
                alias_config.provider,
                alias_config.litellm_model,
                elapsed_ms,
            )
            raise

        raw_response = (
            completion.model_dump()
            if hasattr(completion, "model_dump")
            else dict(completion)
        )
        content = raw_response["choices"][0]["message"]["content"].strip()
        if content.startswith("```"):
            if content.startswith("```json"):
                content = content[7:]
            else:
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

        usage = raw_response.get("usage")
        normalized_usage = _normalize_usage(usage)
        tool_calls_count = _extract_tool_calls_count(raw_response)
        response_cost = _resolve_response_cost(completion)
        elapsed_ms = round((perf_counter() - started_at) * 1000, 2)

        try:
            parsed = response_schema.model_validate(json.loads(content))
        except Exception as exc:
            _persist_failed_log(
                log_id,
                error_detail="Response parsing failed.",
                error_type=type(exc).__name__,
                raw_response=raw_response,
                usage=usage,
                normalized_usage=normalized_usage,
                cost=response_cost,
                tool_calls_count=tool_calls_count,
                latency_ms=elapsed_ms,
            )
            logger.exception(
                "LLM response parsing failed task=%s alias=%s provider=%s model=%s latency_ms=%s usage=%s",
                task_name,
                model_alias,
                alias_config.provider,
                alias_config.litellm_model,
                elapsed_ms,
                normalized_usage or usage,
            )
            raise

        _persist_completed_log(
            log_id,
            raw_response=raw_response,
            usage=usage,
            normalized_usage=normalized_usage,
            cost=response_cost,
            tool_calls_count=tool_calls_count,
            latency_ms=elapsed_ms,
        )
        logger.info(
            "LLM request completed task=%s alias=%s provider=%s model=%s latency_ms=%s usage=%s cost=%s tool_calls_count=%s",
            task_name,
            model_alias,
            alias_config.provider,
            alias_config.litellm_model,
            elapsed_ms,
            normalized_usage or usage,
            response_cost,
            tool_calls_count,
        )
        return LLMExecutionResult(
            parsed=parsed,
            request_payload=request_payload,
            raw_response=raw_response,
            parsed_output=parsed.model_dump(),
            provider=alias_config.provider,
            model_alias=model_alias,
            resolved_model=alias_config.litellm_model,
            usage=usage,
        )
