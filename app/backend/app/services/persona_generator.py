from app.infra.ai.gateway import LLMExecutionResult, get_llm_gateway
from app.infra.ai.prompts.persona_prompt import build_persona_draft_messages
from app.infra.ai.schemas import PersonaDraftOutput
from app.infra.ai.tasks import PERSONA_DRAFT_GENERATION_TASK, PERSONA_DRAFTER_ALIAS
from app.models.models import Project


async def generate_persona_draft_execution(
    project: Project, custom_prompt: str
) -> LLMExecutionResult[PersonaDraftOutput]:
    gateway = get_llm_gateway()
    messages = build_persona_draft_messages(project, custom_prompt)
    return await gateway.generate_structured(
        task_name=PERSONA_DRAFT_GENERATION_TASK,
        model_alias=PERSONA_DRAFTER_ALIAS,
        messages=messages,
        response_schema=PersonaDraftOutput,
        metadata={
            "project_id": project.id,
            "feature_name": "persona_draft_generation",
            "prompt_version": "persona-draft-v1",
        },
    )
