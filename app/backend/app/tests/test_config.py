from app.core import config as core_config


def test_get_model_alias_config_supports_groq_namespaced_models(monkeypatch):
    monkeypatch.setattr(core_config, "_ENV_LOADED", True)
    monkeypatch.setenv("LLM_ALIAS_RESPONDENT_GENERATOR_PROVIDER", "groq")
    monkeypatch.setenv("LLM_ALIAS_RESPONDENT_GENERATOR_MODEL", "openai/gpt-oss-120b")
    monkeypatch.setenv("GROQ_API_KEY", "test-groq-key")
    monkeypatch.delenv("LLM_ALIAS_RESPONDENT_GENERATOR_API_KEY", raising=False)
    monkeypatch.delenv("LLM_ALIAS_RESPONDENT_GENERATOR_BASE_URL", raising=False)

    config = core_config.get_model_alias_config("respondent-generator")

    assert config.provider == "groq"
    assert config.api_key == "test-groq-key"
    assert config.api_base is None
    assert config.litellm_model == "groq/openai/gpt-oss-120b"


def test_get_model_alias_config_supports_openrouter_provider_key(monkeypatch):
    monkeypatch.setattr(core_config, "_ENV_LOADED", True)
    monkeypatch.setenv("LLM_ALIAS_PERSONA_DRAFTER_PROVIDER", "openrouter")
    monkeypatch.setenv("LLM_ALIAS_PERSONA_DRAFTER_MODEL", "anthropic/claude-3.5-sonnet")
    monkeypatch.setenv("OPENROUTER_API_KEY", "test-openrouter-key")
    monkeypatch.delenv("LLM_ALIAS_PERSONA_DRAFTER_API_KEY", raising=False)
    monkeypatch.delenv("LLM_ALIAS_PERSONA_DRAFTER_BASE_URL", raising=False)

    config = core_config.get_model_alias_config("persona-drafter")

    assert config.provider == "openrouter"
    assert config.api_key == "test-openrouter-key"
    assert config.api_base is None
    assert config.litellm_model == "openrouter/anthropic/claude-3.5-sonnet"


def test_get_model_alias_config_requires_openrouter_api_key(monkeypatch):
    monkeypatch.setattr(core_config, "_ENV_LOADED", True)
    monkeypatch.setenv("LLM_ALIAS_STUDY_SIMULATOR_PROVIDER", "openrouter")
    monkeypatch.setenv("LLM_ALIAS_STUDY_SIMULATOR_MODEL", "openai/gpt-4o-mini")
    monkeypatch.delenv("LLM_ALIAS_STUDY_SIMULATOR_API_KEY", raising=False)
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)

    try:
        core_config.get_model_alias_config("study-simulator")
    except core_config.LLMConfigurationError as exc:
        assert str(exc) == (
            "No API key configured for alias 'study-simulator'. Set one of: "
            "LLM_ALIAS_STUDY_SIMULATOR_API_KEY, OPENROUTER_API_KEY."
        )
    else:
        raise AssertionError("Expected missing OpenRouter API key to raise LLMConfigurationError")


def test_get_model_alias_config_requires_alias_model(monkeypatch):
    monkeypatch.setattr(core_config, "_ENV_LOADED", True)
    monkeypatch.setenv("GROQ_API_KEY", "test-groq-key")
    monkeypatch.delenv("LLM_ALIAS_STUDY_SIMULATOR_MODEL", raising=False)

    try:
        core_config.get_model_alias_config("study-simulator")
    except core_config.LLMConfigurationError as exc:
        assert str(exc) == (
            "LLM_ALIAS_STUDY_SIMULATOR_MODEL is not configured for alias "
            "'study-simulator'."
        )
    else:
        raise AssertionError("Expected missing alias model to raise LLMConfigurationError")
