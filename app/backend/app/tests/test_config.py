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
