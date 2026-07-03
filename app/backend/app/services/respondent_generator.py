import uuid
from typing import Any

from app.infra.ai.gateway import LLMExecutionResult, get_llm_gateway
from app.infra.ai.prompts.respondent_prompt import build_respondent_generation_messages
from app.infra.ai.schemas import RespondentGenerationOutput
from app.infra.ai.tasks import (
    RESPONDENT_GENERATION_TASK,
    RESPONDENT_GENERATOR_ALIAS,
)
from app.models.models import Persona


def _map_respondent_output(
    persona: Persona, item: dict[str, Any]
) -> dict[str, Any]:
    return {
        "id": f"resp-{uuid.uuid4().hex[:8]}",
        "persona_id": persona.id,
        "project_id": persona.project_id,
        "name": item.get("name", "Unknown Respondent"),
        "age": int(item.get("age", 20)),
        "location": item.get("location", "Hanoi, Vietnam"),
        "budget": item.get("budget", "Medium"),
        "motivation": item.get("motivation", ""),
        "tech_savviness": item.get("tech_savviness", "Medium"),
        "risk_attitude": item.get("risk_attitude", "Neutral"),
        "channel": item.get("channel", "Social Media"),
        "decision_rules": item.get("decision_rules", []),
    }


def build_respondent_records(
    persona: Persona, parsed_output: RespondentGenerationOutput
) -> list[dict[str, Any]]:
    return [
        _map_respondent_output(persona, respondent.model_dump())
        for respondent in parsed_output.respondents
    ]


async def generate_respondents_execution(
    persona: Persona, count: int
) -> LLMExecutionResult[RespondentGenerationOutput]:
    gateway = get_llm_gateway()
    messages = build_respondent_generation_messages(persona, count)
    execution = await gateway.generate_structured(
        task_name=RESPONDENT_GENERATION_TASK,
        model_alias=RESPONDENT_GENERATOR_ALIAS,
        messages=messages,
        response_schema=RespondentGenerationOutput,
        metadata={
            "project_id": persona.project_id,
            "persona_id": persona.id,
            "requested_count": count,
        },
    )
    if len(execution.parsed.respondents) != count:
        raise RuntimeError(
            f"LLM returned {len(execution.parsed.respondents)} respondents, expected {count}."
        )
    return execution


async def generate_respondents_from_llm(
    persona: Persona, count: int
) -> list[dict[str, Any]]:
    execution = await generate_respondents_execution(persona, count)
    return build_respondent_records(persona, execution.parsed)


async def generate_respondents(persona: Persona, count: int) -> list[dict[str, Any]]:
    return await generate_respondents_from_llm(persona, count)
