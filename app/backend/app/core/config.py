import logging
import os
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger("backend_config")

_ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
_ENV_LOADED = False
_PROVIDER_API_KEY_ENV = {
    "groq": "GROQ_API_KEY",
    "openrouter": "OPENROUTER_API_KEY",
}


class LLMConfigurationError(RuntimeError):
    """Raised when backend LLM configuration is missing or invalid."""


@dataclass(frozen=True)
class LLMModelAliasConfig:
    alias: str
    provider: str
    model: str
    litellm_model: str
    api_key: str
    api_base: str | None


def load_backend_env() -> None:
    """
    Load backend environment variables from app/backend/.env once per process.
    Existing OS environment variables win over local .env values.
    """
    global _ENV_LOADED

    if _ENV_LOADED:
        return

    _ENV_LOADED = True
    if not _ENV_PATH.exists():
        return

    try:
        for raw_line in _ENV_PATH.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue

            if line.startswith("export "):
                line = line[7:].strip()

            if "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip()

            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            elif value.startswith("'") and value.endswith("'"):
                value = value[1:-1]

            os.environ.setdefault(key, value)
    except OSError as exc:
        logger.error(f"Failed to load backend .env from {_ENV_PATH}: {exc}")


def _resolve_api_key(alias: str, alias_env: str, provider: str) -> str:
    alias_key_name = f"LLM_ALIAS_{alias_env}_API_KEY"
    alias_key = os.getenv(alias_key_name)
    if alias_key:
        return alias_key

    provider_key_name = _PROVIDER_API_KEY_ENV.get(provider)
    if provider_key_name:
        provider_key = os.getenv(provider_key_name)
        if provider_key:
            return provider_key

    env_names = [alias_key_name]
    if provider_key_name and provider_key_name not in env_names:
        env_names.append(provider_key_name)

    raise LLMConfigurationError(
        f"No API key configured for alias '{alias}'. Set one of: {', '.join(env_names)}."
    )


def _resolve_api_base(alias_env: str, provider: str) -> str | None:
    alias_base_name = f"LLM_ALIAS_{alias_env}_BASE_URL"
    alias_base = os.getenv(alias_base_name)
    if alias_base:
        return alias_base

    return None


def _build_litellm_model(provider: str, model: str) -> str:
    if model.startswith(f"{provider}/"):
        return model

    if provider != "openai":
        return f"{provider}/{model}"

    return model if "/" in model else f"{provider}/{model}"


def get_model_alias_config(alias: str) -> LLMModelAliasConfig:
    load_backend_env()

    alias_env = alias.upper().replace("-", "_")
    provider = os.getenv(f"LLM_ALIAS_{alias_env}_PROVIDER") or "groq"
    model = os.getenv(f"LLM_ALIAS_{alias_env}_MODEL")
    if not model:
        raise LLMConfigurationError(
            f"LLM_ALIAS_{alias_env}_MODEL is not configured for alias '{alias}'."
        )

    api_key = _resolve_api_key(alias, alias_env, provider)
    api_base = _resolve_api_base(alias_env, provider)
    litellm_model = _build_litellm_model(provider, model)
    return LLMModelAliasConfig(
        alias=alias,
        provider=provider,
        model=model,
        litellm_model=litellm_model,
        api_key=api_key,
        api_base=api_base or None,
    )
