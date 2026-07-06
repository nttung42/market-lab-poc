import json

from app.models.models import Project


def build_persona_draft_messages(
    project: Project, custom_prompt: str
) -> list[dict[str, str]]:
    system_prompt = (
        "You are an AI market research and audience intelligence specialist. "
        "Your task is to generate exactly one structured synthetic persona for an "
        "early-stage message-testing workflow. "
        "Use the provided project context and user custom prompt. Return strict JSON only. "
        "Keep outputs grounded, specific, useful for marketing decisions, and clearly "
        "assumption-based rather than claiming real-world validation."
    )

    user_prompt = f"""
Project Context:
- Project Name: {project.name}
- Product Description: {project.product_description}
- Industry: {project.industry}
- Market: {project.market}
- Target Audience: {project.target_audience}
- Research Objective: {project.research_objective}
- Study Type: {project.study_type}

User Custom Prompt:
{custom_prompt.strip()}

Generate exactly one structured synthetic persona for this project.

Requirements:
- Keep the persona aligned to the project context and the user prompt.
- Represent assumptions transparently.
- Do not claim human validation unless explicit evidence is provided.
- Use structured arrays for list fields.
- Confidence score must be between 0 and 100.
- The persona will be displayed as read-only in the UI, so make every section clear and scannable.
- Include concrete marketing signals such as triggers, channels, media sources, brands, websites, content types, and resonating topics.
- For weighted signal objects, use integer weights from 0 to 100.
- Validation should default to synthetic/unvalidated unless the prompt explicitly provides real evidence.

Return only a JSON object in this format:
{json.dumps(
    {
        "name": "Persona name",
        "segment": "Segment label",
        "quote": "A first-person quote",
        "demographics": [
            "Age: 21",
            "Location: Ho Chi Minh City, Vietnam",
            "Gender: Female",
            "Occupation: Final-year Student",
            "Income: Low",
        ],
        "goals": ["Goal 1", "Goal 2"],
        "pain_points": ["Pain point 1", "Pain point 2"],
        "motivations": ["Motivation 1", "Motivation 2"],
        "buying_behavior": ["Behavior 1", "Behavior 2"],
        "decision_rules": ["Rule 1", "Rule 2"],
        "objections": ["Objection 1", "Objection 2"],
        "channels": ["Channel 1", "Channel 2"],
        "assumptions": ["Assumption 1", "Assumption 2"],
        "confidence_score": 82,
        "jtbd": {
            "functional_job": "Functional job",
            "emotional_job": "Emotional job",
            "social_job": "Social job",
            "success_criteria": ["Criterion 1", "Criterion 2"],
        },
        "psychographics": {
            "personality_traits": ["Trait 1", "Trait 2"],
            "core_values": ["Value 1", "Value 2"],
            "risk_tolerance": "Neutral",
            "tech_savviness": "Medium",
        },
        "product_fit": {
            "must_haves": ["Need 1", "Need 2"],
            "nice_to_haves": ["Nice 1"],
            "deal_breakers": ["Deal breaker 1"],
            "alternatives": ["Alternative 1", "Alternative 2"],
        },
        "journey_map": [
            {
                "stage": "Awareness",
                "goals": ["Goal 1"],
                "pain_points": ["Pain point 1"],
                "touchpoints": ["Touchpoint 1"],
            }
        ],
        "validation": {
            "is_human_validated": False,
            "evidence_sources": ["Synthetic prompt-based draft"],
            "last_validated_at": None,
        },
        "insight_profile": {
            "profile_information": {
                "summary": "Concise persona summary for marketing and concept testing.",
                "personal_aspirations": "What this person wants to become or protect in daily life.",
            },
            "buying_behavior": {
                "purchase_decision_factors": [
                    "Primary factor 1",
                    "Primary factor 2",
                    "Primary factor 3",
                ],
                "triggers": ["Trigger 1", "Trigger 2", "Trigger 3"],
            },
            "psychological_drivers": {
                "goals": ["Goal 1", "Goal 2"],
                "motivations": ["Motivation 1", "Motivation 2"],
                "key_needs": ["Need 1", "Need 2"],
            },
            "key_obstacles": {
                "core_challenges": ["Challenge 1", "Challenge 2"],
                "day_to_day_pain_points": ["Pain point 1", "Pain point 2"],
                "perceived_barriers": ["Barrier 1", "Barrier 2"],
            },
            "work_lifestyle": {
                "occupation": "Occupation",
                "industry": "Industry",
                "income": "Income band or range",
                "marital_status": "Marital status",
                "housing_status": "Housing status",
            },
            "communication": [
                {"label": "Social", "weight": 90},
                {"label": "Messaging", "weight": 75},
                {"label": "Email", "weight": 35},
            ],
            "media_digital": {
                "media_news_sources": [
                    {"label": "Source 1", "weight": 80},
                    {"label": "Source 2", "weight": 65},
                ],
                "social_networks": [
                    {"label": "YouTube", "weight": 90},
                    {"label": "TikTok", "weight": 80},
                ],
                "websites_visited": [
                    {"label": "example.com", "weight": 85}
                ],
                "subreddits": ["/r/example"],
                "hashtags": ["#example", "#category"],
                "content_types": [
                    {"label": "Community sharing", "weight": 90},
                    {"label": "Videos", "weight": 70},
                ],
            },
            "brand_commerce": {
                "brands": [
                    {"label": "Brand 1", "weight": 90},
                    {"label": "Brand 2", "weight": 70},
                ],
                "shopping_websites": [
                    {"label": "Shopping site", "weight": 80}
                ],
                "products": [
                    {"label": "Product category", "weight": 90}
                ],
                "services": [
                    {"label": "Service category", "weight": 65}
                ],
            },
            "preferences": {
                "sports": [{"label": "Running", "weight": 80}],
                "entertainment": [{"label": "Nightlife", "weight": 70}],
                "news": [{"label": "Industry news", "weight": 60}],
                "places_likely_to_visit": [{"label": "Gyms", "weight": 75}],
                "events_conferences": [{"label": "Community event", "weight": 85}],
                "values": [{"label": "Healthy living", "weight": 80}],
                "hobbies": [{"label": "Fitness", "weight": 85}],
                "interests": [{"label": "Technology", "weight": 60}],
                "tools": [{"label": "Calendars", "weight": 70}],
            },
            "website_interaction": {
                "first_interaction_day": "Weekday",
                "first_interaction_time": "Mid day",
                "influential_resources": [
                    {"label": "Events", "weight": 90},
                    {"label": "Social", "weight": 70},
                ],
                "resonating_topics": [
                    {"label": "topic_keyword_1", "weight": 90},
                    {"label": "topic_keyword_2", "weight": 75},
                ],
            },
            "industry_specific_insights": {
                "apparel_fashion": {
                    "style": [{"label": "fitness", "weight": 75}],
                    "product_type": [{"label": "sneaker", "weight": 90}],
                },
                "sporting_goods": {
                    "activity_type": [{"label": "running", "weight": 85}],
                    "product_type": [{"label": "gear", "weight": 65}],
                },
                "consumer_goods": {
                    "room_area": [{"label": "outdoor", "weight": 50}],
                    "supply_stationery": [{"label": "calendar", "weight": 45}],
                },
            },
        },
    },
    ensure_ascii=True,
    indent=2,
)}
"""

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
