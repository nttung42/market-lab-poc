import os
import random
import uuid
import json
import logging
import httpx
from typing import List, Dict, Any
from app.models.models import Study, Question, Respondent, Persona

logger = logging.getLogger("study_simulator")


def load_local_creds():
    cred_path = "d:/FPTU/7/EXE101/market-lab-poc/tmp/llm-cred.txt"
    if os.path.exists(cred_path):
        try:
            with open(cred_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    if "=" in line:
                        key, val = line.split("=", 1)
                        key = key.strip()
                        val = val.strip()
                        if val.startswith('"') and val.endswith('"'):
                            val = val[1:-1]
                        if val.startswith("'") and val.endswith("'"):
                            val = val[1:-1]
                        if val.endswith("\\"):
                            val = val[:-1].strip()
                        os.environ[key] = val
        except Exception as e:
            logger.error(f"Failed to load credentials from {cred_path}: {e}")


def generate_mock_answer(respondent: Respondent, persona: Persona, question: Question) -> str:
    """
    Generates realistic, persona-aligned answers for a question to satisfy
    high-fidelity simulation without API keys.
    """
    q_text_lower = question.text.lower()
    segment_lower = persona.segment.lower() if persona.segment else ""

    # 1. Likert Scale Question
    if question.type == "likert":
        # Options are usually 1-5
        if "price" in q_text_lower or "cost" in q_text_lower:
            if "price-sensitive" in segment_lower:
                return "1"  # Strongly Disagree (high price) or 5 (if asking if price is a concern)
            elif "career" in segment_lower:
                return "4"  # Less concern, focus on value
            return "3"
        elif "interview" in q_text_lower or "job" in q_text_lower:
            if "career" in segment_lower:
                return "5"  # Strongly Agree (very important)
            elif "casual" in segment_lower:
                return "2"
            return "3"
        elif "gamified" in q_text_lower or "fun" in q_text_lower or "streak" in q_text_lower:
            if "casual" in segment_lower:
                return "5"
            elif "career" in segment_lower:
                return "2"
            return "4"
        return str(random.choice(["3", "4", "5"]))

    # 2. Choice Questions (single_choice, multi_choice)
    elif question.type in ["single_choice", "multi_choice"]:
        options = question.options
        if not options:
            return "Yes" if question.type == "single_choice" else json.dumps(["Yes"])

        # Rank options based on persona preferences
        scored_options = []
        for opt in options:
            opt_lower = opt.text.lower()
            score = 10  # base score

            if "price-sensitive" in segment_lower:
                if "free" in opt_lower or "cheap" in opt_lower or "affordable" in opt_lower or "100k" in opt_lower:
                    score += 40
                elif "premium" in opt_lower or "expensive" in opt_lower or "annual" in opt_lower:
                    score -= 30
            elif "career" in segment_lower:
                if "interview" in opt_lower or "business" in opt_lower or "ielts" in opt_lower or "formal" in opt_lower or "pronunciation" in opt_lower:
                    score += 40
                elif "casual" in opt_lower or "game" in opt_lower or "streak" in opt_lower:
                    score -= 20
            elif "casual" in segment_lower:
                if "game" in opt_lower or "streak" in opt_lower or "fun" in opt_lower or "daily conversation" in opt_lower:
                    score += 40
                elif "ielts" in opt_lower or "grammar" in opt_lower or "academic" in opt_lower:
                    score -= 20

            scored_options.append((opt, max(1, score)))

        if question.type == "single_choice":
            # Select single option using roulette wheel selection
            choices = [item[0].value for item in scored_options]
            weights = [item[1] for item in scored_options]
            return random.choices(choices, weights=weights, k=1)[0]
        else:
            # Select 1 to 3 options for multi_choice
            choices = [item[0].value for item in scored_options]
            weights = [item[1] for item in scored_options]
            k = random.randint(1, min(3, len(choices)))
            selected = set()
            # simple weighted sample without replacement
            for _ in range(k):
                if not choices:
                    break
                choice = random.choices(choices, weights=weights, k=1)[0]
                idx = choices.index(choice)
                selected.add(choice)
                choices.pop(idx)
                weights.pop(idx)
            return json.dumps(list(selected))

    # 3. Open ended questions
    else:
        if "price" in q_text_lower or "subscription" in q_text_lower:
            if "price-sensitive" in segment_lower:
                return random.choice([
                    f"I find Duolingo's format nice, but standard course apps are too expensive. As a student, {respondent.motivation}. I can only pay if it's below 100k VND.",
                    "If the app locks too many practice features behind a subscription, I will immediately uninstall it. We need a solid free tier to practice basic communication.",
                    "I compare prices everywhere. I'd love a budget-friendly IELTS tracker, but monthly center costs are too high. 50k-80k VND is my sweet spot."
                ])
            elif "career" in segment_lower:
                return random.choice([
                    "Price is secondary if it gives actual results. I am preparing for MNC interviews, so high-quality feedback is worth paying for.",
                    "I prefer a clear annual plan, but they must guarantee interview preparation feedback that is highly accurate.",
                    "Happy to pay for professional training. Gamified coins don't help me get a job at a foreign bank, but good speaking mock tests do."
                ])
            else:
                return random.choice([
                    "I don't like app subscriptions that auto-renew without warning. I'd pay 50k VND for streaks and fun chat characters.",
                    "I buy things impulsively if the design is pretty. If they have cute characters and clean visual styles, I'd definitely subscribe.",
                    "As long as lessons are cheap and short, I don't mind. I want to learn without stressing about exam fees."
                ])
        elif "interview" in q_text_lower or "ielts" in q_text_lower or "business" in q_text_lower:
            if "career" in segment_lower:
                return random.choice([
                    "Mock interviews are exactly what I need. I want to practice formal greetings, project presentations, and answers to behavioral questions.",
                    "Pronunciation correction must be very detailed, explaining word stress and grammatical mistakes during speaking. That is crucial for my IELTS target.",
                    "I want an AI that simulates a tough interviewer asking follow-up questions so I get used to high-pressure speaking environments."
                ])
            elif "price-sensitive" in segment_lower:
                return random.choice([
                    "I need general IELTS speaking practice, but centers charge too much for mock tests. A cheap AI speaking simulator would be useful.",
                    "I just want to practice simple interview questions. Nothing too complex, just enough to pass basic English communication exams.",
                    "I prefer simple lesson prompts. IELTS prep is okay, but I mostly care about not failing my school speaking tests."
                ])
            else:
                return random.choice([
                    "I don't want strict exams or stressful interview mock tests. Practicing daily topics like movies or food is much more fun for me.",
                    "IELTS feels too academic and stressful. I'd rather talk to a cute AI friend about graphic design and music trends.",
                    "Keep it simple! Long formal business lessons are boring. Short conversations are much easier to stick to."
                ])
        else:
            if "price-sensitive" in segment_lower:
                return f"My main issue is affordability. I am Minh Thu, a student in Hanoi. I really want to practice speaking, but centers cost millions. This app solves my problem if it stays cheap."
            elif "career" in segment_lower:
                return f"My main objective is career advancement. I am Nam, studying Business in HCMC. I need professional-grade feedback for English job interviews. The design should reflect that."
            else:
                return f"I want something easy and motivating. I am Khanh Vy, a design student in Da Nang. I want to build a habit with streaks and visual badges. It shouldn't feel like schoolwork."


async def simulate_respondent_answer_llm(
    respondent: Respondent,
    persona: Persona,
    question: Question,
    project_desc: str
) -> str:
    """
    Calls the LLM to generate a realistic response from the perspective of the respondent.
    """
    load_local_creds()

    api_key = os.getenv("OPENAI_API_KEY")
    is_openrouter = False

    if api_key:
        base_url = os.getenv("OPENAI_BASE_URL")
        if base_url:
            url = f"{base_url.rstrip('/')}/chat/completions"
        else:
            url = "https://api.openai.com/v1/chat/completions"
        model = os.getenv("MODEL_NAME") or "gpt-4o-mini"
    else:
        api_key = os.getenv("OPENROUTER_API_KEY")
        is_openrouter = True
        url = "https://openrouter.ai/api/v1/chat/completions"
        model = os.getenv("MODEL_NAME") or "meta-llama/llama-3-8b-instruct:free"

    if not api_key:
        raise ValueError("No API key configured for study simulation.")

    system_prompt = (
        f"You are roleplaying as a synthetic market research respondent participating in a survey.\n"
        f"You must answer the question strictly from the perspective of this persona and profile.\n"
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
        options_text = "\nOptions available:\n" + "\n".join([f"- {opt.value}: {opt.text}" for opt in question.options])

    type_instructions = ""
    if question.type == "likert":
        type_instructions = "The question uses a Likert scale from 1 (Strongly Disagree) to 5 (Strongly Agree). You must return exactly a single digit: '1', '2', '3', '4', or '5'."
    elif question.type == "single_choice":
        type_instructions = "You must select exactly one option value from the options listed. Return ONLY the value string (e.g. 'opt-1')."
    elif question.type == "multi_choice":
        type_instructions = "You must select one or more option values. Return ONLY a JSON list of selected option values (e.g., ['opt-1', 'opt-3'])."
    else:
        type_instructions = "Answer the question in 1-3 sentences as a free-text response. Keep it in English, representing your perspective, struggles, and hopes."

    user_prompt = f"""
Question: {question.text}
Question Type: {question.type}
{options_text}

Instructions: {type_instructions}
Return only the answer directly. Do not include any explanation or markdown formatting (unless it is the JSON array for multi_choice).
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    if is_openrouter:
        headers["HTTP-Referer"] = "https://github.com/nttung42/market-lab-poc"
        headers["X-Title"] = "Market Lab PoC"

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.6,
    }

    async with httpx.AsyncClient(timeout=25.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"].strip()
        
        # Clean markdown formatting if any
        if content.startswith("```"):
            if content.startswith("```json"):
                content = content[7:]
            else:
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()
            
        return content


async def simulate_study_run(
    study: Study,
    questions: List[Question],
    respondents: List[Respondent],
    personas_dict: Dict[str, Persona],
    project_desc: str
) -> List[Dict[str, Any]]:
    """
    Main entrypoint to simulate answers for all respondents across all questions.
    """
    load_local_creds()
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENROUTER_API_KEY")

    results = []
    for respondent in respondents:
        persona = personas_dict.get(respondent.persona_id)
        if not persona:
            continue

        for question in questions:
            ans = None
            if api_key:
                try:
                    ans = await simulate_respondent_answer_llm(respondent, persona, question, project_desc)
                except Exception as e:
                    logger.error(f"LLM simulation failed for {respondent.name} on question '{question.text}': {e}. Falling back to mock.")
                    ans = generate_mock_answer(respondent, persona, question)
            else:
                ans = generate_mock_answer(respondent, persona, question)

            results.append({
                "id": f"resp-ans-{uuid.uuid4().hex[:8]}",
                "study_id": study.id,
                "respondent_id": respondent.id,
                "question_id": question.id,
                "answer": ans
            })

    return results
