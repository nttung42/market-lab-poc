import json
import uuid

from app.infra.ai.gateway import LLMExecutionResult, get_llm_gateway
from app.infra.ai.prompts.study_answer_prompt import build_study_answer_messages
from app.infra.ai.schemas import StudyAnswerOutput
from app.infra.ai.tasks import STUDY_SIMULATION_TASK, STUDY_SIMULATOR_ALIAS
from app.models.models import Persona, Question, Respondent, Study


async def simulate_respondent_answer_execution(
    respondent: Respondent,
    persona: Persona,
    question: Question,
    project_desc: str,
) -> LLMExecutionResult[StudyAnswerOutput]:
    gateway = get_llm_gateway()
    messages = build_study_answer_messages(respondent, persona, question, project_desc)
    execution = await gateway.generate_structured(
        task_name=STUDY_SIMULATION_TASK,
        model_alias=STUDY_SIMULATOR_ALIAS,
        messages=messages,
        response_schema=StudyAnswerOutput,
        metadata={
            "study_question_id": question.id,
            "respondent_id": respondent.id,
            "persona_id": persona.id,
        },
    )
    execution.parsed_output["response_id"] = f"resp-ans-{uuid.uuid4().hex[:8]}"
    return execution


def _normalize_answer_value(question: Question, answer_value) -> str:
    if question.type == "multi_choice":
        if isinstance(answer_value, list):
            return json.dumps(answer_value)
        raise RuntimeError(
            f"Expected list answer for multi_choice question {question.id}."
        )
    return str(answer_value).strip()


async def simulate_respondent_answer_llm(
    respondent: Respondent,
    persona: Persona,
    question: Question,
    project_desc: str,
) -> str:
    execution = await simulate_respondent_answer_execution(
        respondent, persona, question, project_desc
    )
    return _normalize_answer_value(question, execution.parsed.answer)


async def simulate_study_run(
    study: Study,
    questions: list[Question],
    respondents: list[Respondent],
    personas_dict: dict[str, Persona],
    project_desc: str,
) -> list[dict[str, str]]:
    results = []
    for respondent in respondents:
        persona = personas_dict.get(respondent.persona_id)
        if not persona:
            continue

        for question in questions:
            execution = await simulate_respondent_answer_execution(
                respondent, persona, question, project_desc
            )
            results.append(
                {
                    "id": execution.parsed_output["response_id"],
                    "study_id": study.id,
                    "respondent_id": respondent.id,
                    "question_id": question.id,
                    "answer": _normalize_answer_value(question, execution.parsed.answer),
                }
            )

    return results
