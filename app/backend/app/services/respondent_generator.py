import os
import random
import uuid
import json
import logging
import httpx
from typing import List, Dict, Any
from app.models.models import Persona

logger = logging.getLogger("respondent_generator")


def load_local_creds():
    """
    Loads credentials dynamically from tmp/llm-cred.txt in the workspace.
    """
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
                        # Clean quotes
                        if val.startswith('"') and val.endswith('"'):
                            val = val[1:-1]
                        if val.startswith("'") and val.endswith("'"):
                            val = val[1:-1]
                        # Clean backslashes at end of lines
                        if val.endswith("\\"):
                            val = val[:-1].strip()
                        os.environ[key] = val
        except Exception as e:
            logger.error(f"Failed to load credentials from {cred_path}: {e}")


def generate_mock_respondents(persona: Persona, count: int) -> List[Dict[str, Any]]:
    """
    Generates high-fidelity, diverse mock respondents to simulate individual
    variations of a parent Persona for robust offline testing.
    """
    # Pool of realistic names
    vietnamese_first_names_male = ["Anh", "Huy", "Quan", "Minh", "Long", "Dat", "Bao", "Tung", "Phuoc", "Bach", "Nam", "Manh", "Quyet", "Tuan", "Son", "Hai", "Lam"]
    vietnamese_first_names_female = ["Anh", "Chi", "Thao", "Trang", "Dan", "Thu", "Phuong", "My", "Ngan", "Hang", "Ngoc", "Vy", "Ha", "Linh", "Huong", "Giang"]
    vietnamese_middle_names_male = ["Duy", "Quoc", "Minh", "Duc", "Hoang", "Tien", "Gia", "Thanh", "Huu", "Viet", "Van"]
    vietnamese_middle_names_female = ["Mai", "Phuong", "Thu", "Bich", "Huyen", "Kim", "Thanh", "Bao", "Tra", "Thuy", "Ngoc", "Khanh"]
    vietnamese_last_names = ["Nguyen", "Tran", "Le", "Pham", "Hoang", "Phan", "Vu", "Vo", "Dang", "Bui", "Do", "Ho", "Ngo", "Duong", "Ly"]

    locations = ["Hanoi, Vietnam", "Ho Chi Minh City, Vietnam", "Da Nang, Vietnam", "Can Tho, Vietnam", "Hai Phong, Vietnam", "Nha Trang, Vietnam"]

    respondents = []
    segment_lower = persona.segment.lower() if persona.segment else ""

    for _ in range(count):
        # Generate a unique name
        is_male = random.choice([True, False])
        last = random.choice(vietnamese_last_names)
        if is_male:
            mid = random.choice(vietnamese_middle_names_male)
            first = random.choice(vietnamese_first_names_male)
        else:
            mid = random.choice(vietnamese_middle_names_female)
            first = random.choice(vietnamese_first_names_female)
        name = f"{last} {mid} {first}"

        # Determine demographics & behavioral variables based on parent persona
        if "price-sensitive" in segment_lower or "price sensitive" in segment_lower:
            age = random.randint(18, 22)
            location = random.choice(locations)
            budget = "Low"
            motivation = random.choice([
                f"Needs to learn speaking but cannot afford centers. Goal: {persona.goals[0] if persona.goals else 'Improve English communication'}.",
                "Wants to save money for other university expenses. Relies on free app features.",
                "Wants to pass graduation requirements without paying for premium English classes.",
                "Looks for value-oriented tools to practice basic English communication."
            ])
            tech_savviness = random.choice(["Medium", "High"])
            risk_attitude = random.choice(["Risk-averse", "Neutral"])
            channel = random.choice(persona.channels if persona.channels else ["TikTok", "Word of mouth"])
            decision_rules = [
                "Must be cheaper than 100k VND/month ($4).",
                "Needs immediately visible value before spending money.",
                "Prefers free tier with ads over forced paid subscription."
            ]
        elif "career" in segment_lower:
            age = random.randint(21, 25)
            location = random.choice(locations[:3])  # HCMC, Hanoi, Da Nang
            budget = random.choice(["Medium", "High"])
            motivation = random.choice([
                f"Wants to get an internship at a foreign multinational firm. Goal: {persona.goals[0] if persona.goals else 'Fluency for career'}.",
                "Preparing for IELTS speaking test band 6.5+ and job interviews.",
                "Needs to master business English vocabulary and professional formal communication.",
                "Wants to build a strong CV and practice mock interview conversations."
            ])
            tech_savviness = "High"
            risk_attitude = random.choice(["Neutral", "Risk-seeking"])
            channel = random.choice(persona.channels if persona.channels else ["LinkedIn", "YouTube"])
            decision_rules = [
                "Must have realistic interview simulator modules.",
                "Willing to pay premium for high-quality pronunciation analytics.",
                "Prefers structured, professional lesson flows over simple gamified exercises."
            ]
        else:  # Casual learner or other
            age = random.randint(18, 24)
            location = random.choice(locations)
            budget = random.choice(["Low", "Medium"])
            motivation = random.choice([
                "Wants to practice conversation in casual, everyday contexts without academic stress.",
                "Goal is to build a daily English habit without exams or pressure.",
                "Wants to understand movies and pop culture music without reading subtitles.",
                "Enjoys speaking English as a personal hobby and making friends."
            ])
            tech_savviness = random.choice(["Medium", "High"])
            risk_attitude = random.choice(["Neutral", "Risk-averse", "Risk-seeking"])
            channel = random.choice(persona.channels if persona.channels else ["TikTok", "Instagram"])
            decision_rules = [
                "Lessons must be short (under 15 minutes).",
                "UI must be modern, beautiful, and visually appealing.",
                "Should have fun elements like streaks or simple badges."
            ]

        respondent_dict = {
            "id": f"resp-{uuid.uuid4().hex[:8]}",
            "persona_id": persona.id,
            "project_id": persona.project_id,
            "name": name,
            "age": age,
            "location": location,
            "budget": budget,
            "motivation": motivation,
            "tech_savviness": tech_savviness,
            "risk_attitude": risk_attitude,
            "channel": channel,
            "decision_rules": decision_rules
        }
        respondents.append(respondent_dict)

    return respondents


async def generate_respondents_from_llm(persona: Persona, count: int) -> List[Dict[str, Any]]:
    """
    Calls the LLM provider (OpenRouter or OpenAI) to generate structured respondents.
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
        raise ValueError("No API key configured for LLM.")

    system_prompt = (
        "You are an AI research assistant. Your task is to generate a panel of synthetic respondents "
        "derived from a parent market persona. Each respondent profile must represent a variation of "
        "the parent persona, with realistic demographic and behavioral attributes. "
        "You must return the output in a strict JSON format containing a list of respondents."
    )

    user_prompt = f"""
Parent Persona Profile:
- Name: {persona.name}
- Segment: {persona.segment}
- Quote: {persona.quote}
- Demographics: {json.dumps(persona.demographics)}
- Goals: {json.dumps(persona.goals)}
- Pain Points: {json.dumps(persona.pain_points)}
- Motivations: {json.dumps(persona.motivations)}
- Buying Behavior: {json.dumps(persona.buying_behavior)}
- Decision Rules: {json.dumps(persona.decision_rules)}
- Objections: {json.dumps(persona.objections)}
- Channels: {json.dumps(persona.channels)}
- Assumptions: {json.dumps(persona.assumptions)}

Generate exactly {count} distinct synthetic respondent profiles that are individual variations of this persona.
Keep the core goals and pain points in mind, but vary their age (typically within 18-24 range), location (cities in Vietnam like Hanoi, HCMC, Da Nang), budget level (Low, Medium, or High), motivation summary, tech savviness level (Low, Medium, High), risk attitude (Risk-averse, Neutral, Risk-seeking), preferred channel, and 3 specific decision rules.

You MUST respond ONLY with a JSON object in this format:
{{
  "respondents": [
    {{
      "name": "Full Name",
      "age": 21,
      "location": "City, Vietnam",
      "budget": "Low/Medium/High",
      "motivation": "A brief summary of their personal motivation for learning/practicing English",
      "tech_savviness": "Low/Medium/High",
      "risk_attitude": "Risk-averse/Neutral/Risk-seeking",
      "channel": "Their preferred marketing/discovery channel",
      "decision_rules": ["rule 1", "rule 2", "rule 3"]
    }}
  ]
}}
Do not write any markdown code blocks outside of the JSON or any conversational filler. Just the JSON object.
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
        "temperature": 0.7,
        "response_format": {"type": "json_object"}
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

        # Parse content
        content = data["choices"][0]["message"]["content"].strip()

        # Handle standard codeblock encapsulation if model output wraps it
        if content.startswith("```"):
            if content.startswith("```json"):
                content = content[7:]
            else:
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

        parsed = json.loads(content)

        results = []
        for item in parsed.get("respondents", []):
            results.append({
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
                "decision_rules": item.get("decision_rules", [])
            })

        # Pad with mock data if LLM returned fewer than requested
        if len(results) < count:
            shortfall = count - len(results)
            logger.warning(f"LLM returned fewer respondents than requested ({len(results)} vs {count}). Padding with mock data.")
            results.extend(generate_mock_respondents(persona, shortfall))

        return results[:count]


async def generate_respondents(persona: Persona, count: int) -> List[Dict[str, Any]]:
    """
    Main entrypoint for generating synthetic respondents. Integrates both
    LLM generation and mock fallback modes.
    """
    load_local_creds()
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        logger.info("No API key configured. Generating via high-fidelity mock generator.")
        return generate_mock_respondents(persona, count)

    try:
        return await generate_respondents_from_llm(persona, count)
    except Exception as e:
        logger.error(f"LLM generation failed: {e}. Falling back to high-fidelity mock generator.")
        return generate_mock_respondents(persona, count)
