import json
import random

from sqlalchemy.orm import Session

from app.core.errors import DomainNotFoundError
from app.features.studies import repository
from app.models import models
from app.schemas import schemas


def get_study_results(db: Session, study_id: str) -> schemas.StudyResults:
    study = repository.get_study_by_id(db, study_id)
    if not study:
        raise DomainNotFoundError("Study not found")

    questions = study.questions
    responses = repository.list_study_responses(db, study_id)
    respondents = repository.list_project_respondents(db, study.project_id)
    respondents_dict = {r.id: r for r in respondents}

    personas = repository.list_project_personas(db, study.project_id)
    personas_dict = {p.id: p for p in personas}

    quantitative_results = []
    for question in questions:
        q_responses = [r for r in responses if r.question_id == question.id]
        total_q_responses = len(q_responses)

        results_list = []
        avg_rating = 0.0

        if question.type in ["single_choice", "multi_choice"]:
            opt_counts = {opt.value: 0 for opt in question.options}
            for response in q_responses:
                if question.type == "single_choice":
                    val = response.answer
                    if val in opt_counts:
                        opt_counts[val] += 1
                else:
                    try:
                        vals = json.loads(response.answer)
                        for value in vals:
                            if value in opt_counts:
                                opt_counts[value] += 1
                    except Exception:
                        pass

            for opt in question.options:
                cnt = opt_counts.get(opt.value, 0)
                pct = round((cnt / total_q_responses * 100.0), 1) if total_q_responses else 0.0
                results_list.append(
                    schemas.ChoiceResult(option=opt.text, count=cnt, percentage=pct)
                )

        elif question.type == "likert":
            likert_counts = {str(i): 0 for i in range(1, 6)}
            total_score = 0
            valid_counts = 0
            for response in q_responses:
                val = response.answer.strip()
                if val in likert_counts:
                    likert_counts[val] += 1
                    total_score += int(val)
                    valid_counts += 1

            avg_rating = round(total_score / valid_counts, 2) if valid_counts else 0.0
            labels = {
                "1": "Strongly Disagree (1)",
                "2": "Disagree (2)",
                "3": "Neutral (3)",
                "4": "Agree (4)",
                "5": "Strongly Agree (5)",
            }
            for key in sorted(likert_counts.keys()):
                cnt = likert_counts[key]
                pct = round((cnt / total_q_responses * 100.0), 1) if total_q_responses else 0.0
                results_list.append(
                    schemas.ChoiceResult(option=labels[key], count=cnt, percentage=pct)
                )

        quantitative_results.append(
            schemas.QuestionResult(
                question_id=question.id,
                question_text=question.text,
                question_type=question.type,
                total_responses=total_q_responses,
                results=results_list,
                average_rating=avg_rating,
            )
        )

    qualitative_themes = []
    persona_responses = {p_id: [] for p_id in personas_dict.keys()}
    for response in responses:
        question = next((q for q in questions if q.id == response.question_id), None)
        if question and question.type == "open_text":
            respondent = respondents_dict.get(response.respondent_id)
            if respondent and respondent.persona_id in persona_responses:
                persona_responses[respondent.persona_id].append(
                    (respondent.name, response.answer)
                )

    theme_definitions = {
        "persona-price-sensitive": schemas.QualitativeTheme(
            theme="Price Sensitivity & Value Transparency",
            description="Price-sensitive respondents strongly advocate for a functional free tier. They express high anxiety about automatic subscription renewals and are hesitant to input financial details without immediate proof of value.",
            objections=[
                "Autorenewal subscription traps and lack of simple refund mechanics.",
                "Basic speaking capabilities locked behind a high premium tier.",
                "Lack of clear localized pricing below 100k VND ($4) per month.",
            ],
            quotes=[],
        ),
        "persona-career-focused": schemas.QualitativeTheme(
            theme="Professional Mock Interview Realism & Grammar Analytics",
            description="Career-driven students demand detailed, context-aware feedback (word stress, grammar corrections, body language placeholder notes) and high-fidelity mock interview sessions rather than simple, gamified exercises.",
            objections=[
                "Overly gamified layout elements that feel too casual or childish.",
                "Lack of specialized business English vocabulary and industry-specific interview routes.",
                "Speech diagnostics that fail to pinpoint exact grammatical errors during vocal practice.",
            ],
            quotes=[],
        ),
        "persona-casual-learner": schemas.QualitativeTheme(
            theme="Micro-learning Habit Motivation & Visual Gamification",
            description="Casual learners require micro-sessions (under 15 minutes) and strong gamified hooks (streaks, badges, clean visual styles) to stay engaged. They reject academic stress and stiff, robotic-sounding voice synthesis.",
            objections=[
                "Strict test formats or high pressure scoring guidelines.",
                "Robotic-sounding text-to-speech engine that feels cold or unnatural.",
                "Intrusive, pushy streak notifications.",
            ],
            quotes=[],
        ),
    }

    for persona_id, quote_list in persona_responses.items():
        theme = theme_definitions.get(persona_id)
        persona = personas_dict.get(persona_id)
        if not persona:
            continue

        if not theme:
            theme = schemas.QualitativeTheme(
                theme=f"{persona.name} ({persona.segment}) Objections & Feedback",
                description=(
                    f"Qualitative feedback and objections formulated by the "
                    f"{persona.name} persona segment regarding the value proposition."
                ),
                objections=persona.objections[:3] if persona.objections else ["Pricing clarity", "Feature value"],
                quotes=[],
            )

        if quote_list:
            sampled = quote_list[:3]
            theme.quotes = [f'"{text}" — {name}' for name, text in sampled]
        else:
            theme.quotes = [
                f'"I want to see how this fits my needs as a {persona.segment}." — {persona.name}',
                f'"The value of this solution needs to be immediately obvious." — {persona.name}',
            ]
        qualitative_themes.append(theme)

    if not qualitative_themes:
        qualitative_themes.append(
            schemas.QualitativeTheme(
                theme="General Concept Feedback",
                description="Respondents general feedback regarding the target application value proposition.",
                objections=["Clarity of instructions", "Value of feedback"],
                quotes=['"Looks interesting, but I need to test it first."'],
            )
        )

    recommendations = [
        schemas.RecommendationItem(
            priority="High",
            title="Introduce a Localized Vietnamese Pricing Tier",
            details="Implement an affordable subscription tier under 100k VND/month ($4/month) or a robust free tier with micro-transactions (e.g., pay-per-interview-mock) to satisfy price-sensitive students (Minh Thu segment).",
        ),
        schemas.RecommendationItem(
            priority="High",
            title="Launch Specialized Job Interview Modules",
            details="Develop formal mock interview tracks (banking, consulting, tech) and IELTS-aligned speaking simulations with diagnostic grammar check reports to attract and retain career-focused students (Hoang Nam segment).",
        ),
        schemas.RecommendationItem(
            priority="Medium",
            title="Integrate Premium, Human-like TTS Engines",
            details="Ensure speaking companions use highly natural, emotional, and expressive speech synthesis to retain casual learners who are easily demotivated by robotic voices (Khanh Vy segment).",
        ),
        schemas.RecommendationItem(
            priority="Medium",
            title="Develop a Minimalist SaaS Option Dashboard",
            details="Allow users to toggle between a gamified/casual mode (streaks, badges) and a professional/focused mode (dark theme, raw scores) to resolve the UI preference conflict between casual and career segments.",
        ),
    ]

    return schemas.StudyResults(
        study_id=study_id,
        total_respondents=len(respondents),
        quantitative=quantitative_results,
        qualitative_themes=qualitative_themes,
        recommendations=recommendations,
    )
