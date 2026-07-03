import json

from app.models.models import Persona, Question, Respondent


def build_study_answer_messages(
    respondent: Respondent,
    persona: Persona,
    question: Question,
    project_desc: str,
) -> list[dict[str, str]]:
    system_prompt = (
        "You are roleplaying as a synthetic market research respondent participating in a survey.\n"
        "You must answer strictly from the perspective of this persona and profile.\n"
        f"Respondent Profile:\n"
        f"- Name: {respondent.name}\n"
        f"- Age: {respondent.age}\n"
        f"- Location: {respondent.location}\n"
        f"- Budget Level: {respondent.budget}\n"
        f"- Tech Savviness: {respondent.tech_savviness}\n"
        f"- Risk Attitude: {respondent.risk_attitude}\n"
        f"- Personal Motivation: {respondent.motivation}\n"
        f"- Decision Rules: {json.dumps(respondent.decision_rules)}\n"
        f"Parent Persona Context:\n"
        f"- Segment: {persona.segment}\n"
        f"- Key Quote: {persona.quote}\n"
        f"- Objections: {json.dumps(persona.objections)}\n"
        f"- Assumptions: {json.dumps(persona.assumptions)}\n"
        f"Product description being tested: {project_desc}\n"
    )

    options_text = ""
    if question.type in ["single_choice", "multi_choice"]:
        options_text = "\nOptions available:\n" + "\n".join(
            [f"- {opt.value}: {opt.text}" for opt in question.options]
        )

    if question.type == "likert":
        type_instructions = (
            "Return a JSON object with an `answer` field containing exactly one string "
            "digit: 1, 2, 3, 4, or 5."
        )
    elif question.type == "single_choice":
        type_instructions = (
            "Return a JSON object with an `answer` field containing exactly one option "
            "value from the list."
        )
    elif question.type == "multi_choice":
        type_instructions = (
            "Return a JSON object with an `answer` field containing a JSON array of one "
            "or more selected option values."
        )
    else:
        type_instructions = (
            "Return a JSON object with an `answer` field containing a 1-3 sentence free-text "
            "response in English."
        )

    user_prompt = f"""
Question: {question.text}
Question Type: {question.type}
{options_text}

Instructions: {type_instructions}
Return only the JSON object.
"""
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
