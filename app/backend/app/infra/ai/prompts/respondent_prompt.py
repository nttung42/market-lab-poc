import json

from app.models.models import Persona


def build_respondent_generation_messages(persona: Persona, count: int) -> list[dict[str, str]]:
    system_prompt = (
        "You are an AI research assistant. Your task is to generate a panel of synthetic "
        "respondents derived from a parent market persona. Each respondent profile must "
        "represent a variation of the parent persona with realistic demographic and "
        "behavioral attributes. Return strict JSON only."
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
Keep the core goals and pain points in mind, but vary age, location, budget level, motivation summary,
tech savviness, risk attitude, preferred channel, and 3 specific decision rules.

Return only a JSON object in this format:
{{
  "respondents": [
    {{
      "name": "Full Name",
      "age": 21,
      "location": "City, Vietnam",
      "budget": "Low/Medium/High",
      "motivation": "A brief summary of their motivation",
      "tech_savviness": "Low/Medium/High",
      "risk_attitude": "Risk-averse/Neutral/Risk-seeking",
      "channel": "Preferred channel",
      "decision_rules": ["rule 1", "rule 2", "rule 3"]
    }}
  ]
}}
"""
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
