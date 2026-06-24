from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random
import json
from app.db.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/projects", response_model=List[schemas.Project])
def read_projects(db: Session = Depends(get_db)):
    projects = db.query(models.Project).all()
    return projects

@router.get("/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/projects/{project_id}/personas", response_model=List[schemas.Persona])
def read_project_personas(project_id: str, db: Session = Depends(get_db)):
    # First, verify project exists
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    personas = db.query(models.Persona).filter(models.Persona.project_id == project_id).all()
    return personas

@router.get("/personas/{persona_id}", response_model=schemas.Persona)
def read_persona(persona_id: str, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id == persona_id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    return persona


@router.post("/projects/{project_id}/respondents/generate", response_model=List[schemas.Respondent])
async def generate_project_respondents(
    project_id: str,
    req: schemas.RespondentGenerateRequest,
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    personas = db.query(models.Persona).filter(models.Persona.project_id == project_id).all()
    if not personas:
        raise HTTPException(status_code=400, detail="No personas found for this project")

    # Clear existing respondents for this project
    db.query(models.Respondent).filter(models.Respondent.project_id == project_id).delete()
    db.commit()

    all_respondents = []
    from app.services.respondent_generator import generate_respondents

    for persona in personas:
        generated = await generate_respondents(persona, req.count_per_persona)
        for r_data in generated:
            db_respondent = models.Respondent(
                id=r_data["id"],
                persona_id=r_data["persona_id"],
                project_id=r_data["project_id"],
                name=r_data["name"],
                age=r_data["age"],
                location=r_data["location"],
                budget=r_data["budget"],
                motivation=r_data["motivation"],
                tech_savviness=r_data["tech_savviness"],
                risk_attitude=r_data["risk_attitude"],
                channel=r_data["channel"],
                decision_rules=r_data["decision_rules"]
            )
            db.add(db_respondent)
            all_respondents.append(db_respondent)

    db.commit()
    for r in all_respondents:
        db.refresh(r)

    return all_respondents


@router.get("/projects/{project_id}/respondents", response_model=List[schemas.Respondent])
def read_project_respondents(project_id: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    respondents = db.query(models.Respondent).filter(models.Respondent.project_id == project_id).all()
    return respondents


# --- Study & Survey Router Endpoints ---

@router.get("/projects/{project_id}/studies", response_model=List[schemas.Study])
def read_project_studies(project_id: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    studies = db.query(models.Study).filter(models.Study.project_id == project_id).all()
    return studies


@router.post("/projects/{project_id}/studies", response_model=schemas.Study)
def create_project_study(
    project_id: str,
    study_data: schemas.StudyBase,
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    import uuid
    from datetime import datetime

    study_id = f"study-{uuid.uuid4().hex[:8]}"
    db_study = models.Study(
        id=study_id,
        project_id=project_id,
        title=study_data.title,
        status="draft",
        created_at=datetime.utcnow().isoformat()
    )
    db.add(db_study)
    db.commit()
    db.refresh(db_study)
    return db_study


@router.get("/studies/{study_id}", response_model=schemas.Study)
def read_study(study_id: str, db: Session = Depends(get_db)):
    study = db.query(models.Study).filter(models.Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study


@router.post("/studies/{study_id}/questions", response_model=schemas.Question)
def create_study_question(
    study_id: str,
    question_data: schemas.QuestionCreate,
    db: Session = Depends(get_db)
):
    study = db.query(models.Study).filter(models.Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    db_question = models.Question(
        id=question_data.id,
        study_id=study_id,
        text=question_data.text,
        type=question_data.type,
        position=question_data.position
    )
    db.add(db_question)

    for idx, opt in enumerate(question_data.options):
        db_option = models.QuestionOption(
            id=opt.id,
            question_id=question_data.id,
            text=opt.text,
            value=opt.value,
            position=idx
        )
        db.add(db_option)

    db.commit()
    db.refresh(db_question)
    return db_question


@router.post("/studies/{study_id}/run", response_model=List[schemas.Response])
async def run_study_simulation(
    study_id: str,
    req: schemas.StudyRunRequest,
    db: Session = Depends(get_db)
):
    study = db.query(models.Study).filter(models.Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    # Fetch respondents & personas
    project_id = study.project_id
    respondents = db.query(models.Respondent).filter(models.Respondent.project_id == project_id).all()
    if not respondents:
        raise HTTPException(status_code=400, detail="No synthetic respondents generated for this project. Please generate them first.")

    # Filter by persona if requested
    if req.persona_ids:
        respondents = [r for r in respondents if r.persona_id in req.persona_ids]
        if not respondents:
            raise HTTPException(status_code=400, detail="No respondents matching the specified persona filters.")

    personas = db.query(models.Persona).filter(models.Persona.project_id == project_id).all()
    personas_dict = {p.id: p for p in personas}

    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    project_desc = project.product_description if project else ""

    # Clear previous responses for this study & matching respondents
    resp_ids = [r.id for r in respondents]
    db.query(models.Response).filter(
        models.Response.study_id == study_id,
        models.Response.respondent_id.in_(resp_ids)
    ).delete(synchronize_session=False)
    db.commit()

    # Simulate answers
    from app.services.study_simulator import simulate_study_run
    simulated_responses = await simulate_study_run(
        study=study,
        questions=study.questions,
        respondents=respondents,
        personas_dict=personas_dict,
        project_desc=project_desc
    )

    db_responses = []
    for r_data in simulated_responses:
        db_resp = models.Response(
            id=r_data["id"],
            study_id=r_data["study_id"],
            respondent_id=r_data["respondent_id"],
            question_id=r_data["question_id"],
            answer=r_data["answer"]
        )
        db.add(db_resp)
        db_responses.append(db_resp)

    # Mark study status as completed
    study.status = "completed"
    db.commit()

    # Refresh responses
    for r in db_responses:
        db.refresh(r)

    return db_responses


@router.get("/studies/{study_id}/results", response_model=schemas.StudyResults)
def get_study_results(study_id: str, db: Session = Depends(get_db)):
    study = db.query(models.Study).filter(models.Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    questions = study.questions
    responses = db.query(models.Response).filter(models.Response.study_id == study_id).all()
    respondents = db.query(models.Respondent).filter(models.Respondent.project_id == study.project_id).all()
    respondents_dict = {r.id: r for r in respondents}

    personas = db.query(models.Persona).filter(models.Persona.project_id == study.project_id).all()
    personas_dict = {p.id: p for p in personas}

    # Aggregate Quantitative Results
    quantitative_results = []
    for question in questions:
        q_responses = [r for r in responses if r.question_id == question.id]
        total_q_responses = len(q_responses)

        results_list = []
        avg_rating = 0.0

        if question.type in ["single_choice", "multi_choice"]:
            # Initialise options with 0
            opt_counts = {opt.value: 0 for opt in question.options}
            for r in q_responses:
                if question.type == "single_choice":
                    val = r.answer
                    if val in opt_counts:
                        opt_counts[val] += 1
                else:
                    try:
                        vals = json.loads(r.answer)
                        for v in vals:
                            if v in opt_counts:
                                opt_counts[v] += 1
                    except Exception:
                        pass
            
            for opt in question.options:
                cnt = opt_counts.get(opt.value, 0)
                pct = round((cnt / total_q_responses * 100.0), 1) if total_q_responses > 0 else 0.0
                results_list.append(schemas.ChoiceResult(
                    option=opt.text,
                    count=cnt,
                    percentage=pct
                ))

        elif question.type == "likert":
            likert_counts = {str(i): 0 for i in range(1, 6)}
            total_score = 0
            valid_counts = 0
            for r in q_responses:
                val = r.answer.strip()
                if val in likert_counts:
                    likert_counts[val] += 1
                    total_score += int(val)
                    valid_counts += 1
            
            avg_rating = round(total_score / valid_counts, 2) if valid_counts > 0 else 0.0
            
            # Map numeric values to simple labels
            labels = {
                "1": "Strongly Disagree (1)",
                "2": "Disagree (2)",
                "3": "Neutral (3)",
                "4": "Agree (4)",
                "5": "Strongly Agree (5)"
            }
            for key in sorted(likert_counts.keys()):
                cnt = likert_counts[key]
                pct = round((cnt / total_q_responses * 100.0), 1) if total_q_responses > 0 else 0.0
                results_list.append(schemas.ChoiceResult(
                    option=labels[key],
                    count=cnt,
                    percentage=pct
                ))

        quantitative_results.append(schemas.QuestionResult(
            question_id=question.id,
            question_text=question.text,
            question_type=question.type,
            total_responses=total_q_responses,
            results=results_list,
            average_rating=avg_rating
        ))

    # Aggregate Qualitative Themes
    qualitative_themes = []
    # Segregate open-ended answers by persona
    persona_responses = {}
    for p_id in personas_dict.keys():
        persona_responses[p_id] = []

    for r in responses:
        q = next((qu for qu in questions if qu.id == r.question_id), None)
        if q and q.type == "open_text":
            resp_obj = respondents_dict.get(r.respondent_id)
            if resp_obj and resp_obj.persona_id in persona_responses:
                persona_responses[resp_obj.persona_id].append((resp_obj.name, r.answer))

    # Pre-coded themes matching our personas
    theme_definitions = {
        "persona-price-sensitive": schemas.QualitativeTheme(
            theme="Price Sensitivity & Value Transparency",
            description="Price-sensitive respondents strongly advocate for a functional free tier. They express high anxiety about automatic subscription renewals and are hesitant to input financial details without immediate proof of value.",
            objections=[
                "Autorenewal subscription traps and lack of simple refund mechanics.",
                "Basic speaking capabilities locked behind a high premium tier.",
                "Lack of clear localized pricing below 100k VND ($4) per month."
            ],
            quotes=[]
        ),
        "persona-career-focused": schemas.QualitativeTheme(
            theme="Professional Mock Interview Realism & Grammar Analytics",
            description="Career-driven students demand detailed, context-aware feedback (word stress, grammar corrections, body language placeholder notes) and high-fidelity mock interview sessions rather than simple, gamified exercises.",
            objections=[
                "Overly gamified layout elements that feel too casual or childish.",
                "Lack of specialized business English vocabulary and industry-specific interview routes.",
                "Speech diagnostics that fail to pinpoint exact grammatical errors during vocal practice."
            ],
            quotes=[]
        ),
        "persona-casual-learner": schemas.QualitativeTheme(
            theme="Micro-learning Habit Motivation & Visual Gamification",
            description="Casual learners require micro-sessions (under 15 minutes) and strong gamified hooks (streaks, badges, clean visual styles) to stay engaged. They reject academic stress and stiff, robotic-sounding voice synthesis.",
            objections=[
                "Strict test formats or high pressure scoring guidelines.",
                "Robotic-sounding text-to-speech engine that feels cold or unnatural.",
                "Intrusive, pushy streak notifications."
            ],
            quotes=[]
        )
    }

    # Populate quotes dynamically from actual responses
    import json
    for p_id, q_list in persona_responses.items():
        theme = theme_definitions.get(p_id)
        p_obj = personas_dict.get(p_id)
        if not p_obj:
            continue
        p_name = p_obj.name
        p_seg = p_obj.segment
        p_objections = p_obj.objections if p_obj.objections else []

        if not theme:
            theme = schemas.QualitativeTheme(
                theme=f"{p_name} ({p_seg}) Objections & Feedback",
                description=f"Qualitative feedback and objections formulated by the {p_name} persona segment regarding the value proposition.",
                objections=p_objections[:3] if p_objections else ["Pricing clarity", "Feature value"],
                quotes=[]
            )

        # Select up to 3 random quotes from the respondent answers
        if q_list:
            sampled = random.sample(q_list, min(3, len(q_list)))
            theme.quotes = [f'"{text}" — {name}' for name, text in sampled]
        else:
            # Mock fallback quotes if no responses generated yet
            theme.quotes = [
                f'"I want to see how this fits my needs as a {p_seg}." — {p_name}',
                f'"The value of this solution needs to be immediately obvious." — {p_name}'
            ]
        qualitative_themes.append(theme)

    # General fallback theme if no responses/personas match
    if not qualitative_themes:
        qualitative_themes.append(schemas.QualitativeTheme(
            theme="General Concept Feedback",
            description="Respondents general feedback regarding the target application value proposition.",
            objections=["Clarity of instructions", "Value of feedback"],
            quotes=['"Looks interesting, but I need to test it first."']
        ))

    # Structured Actionable Recommendations
    recommendations = [
        schemas.RecommendationItem(
            priority="High",
            title="Introduce a Localized Vietnamese Pricing Tier",
            details="Implement an affordable subscription tier under 100k VND/month ($4/month) or a robust free tier with micro-transactions (e.g., pay-per-interview-mock) to satisfy price-sensitive students (Minh Thu segment)."
        ),
        schemas.RecommendationItem(
            priority="High",
            title="Launch Specialized Job Interview Modules",
            details="Develop formal mock interview tracks (banking, consulting, tech) and IELTS-aligned speaking simulations with diagnostic grammar check reports to attract and retain career-focused students (Hoang Nam segment)."
        ),
        schemas.RecommendationItem(
            priority="Medium",
            title="Integrate Premium, Human-like TTS Engines",
            details="Ensure speaking companions use highly natural, emotional, and expressive speech synthesis to retain casual learners who are easily demotivated by robotic voices (Khanh Vy segment)."
        ),
        schemas.RecommendationItem(
            priority="Medium",
            title="Develop a Minimalist SaaS Option Dashboard",
            details="Allow users to toggle between a gamified/casual mode (streaks, badges) and a professional/focused mode (dark theme, raw scores) to resolve the UI preference conflict between casual and career segments."
        )
    ]

    return schemas.StudyResults(
        study_id=study_id,
        total_respondents=len(respondents),
        quantitative=quantitative_results,
        qualitative_themes=qualitative_themes,
        recommendations=recommendations
    )


# --- CRUD Endpoints ---

@router.post("/projects", response_model=schemas.Project)
def create_project(project_data: schemas.ProjectBase, db: Session = Depends(get_db)):
    import uuid
    from datetime import datetime
    
    project_id = f"project-{uuid.uuid4().hex[:8]}"
    db_project = models.Project(
        id=project_id,
        name=project_data.name,
        product_description=project_data.product_description,
        industry=project_data.industry,
        market=project_data.market,
        target_audience=project_data.target_audience,
        research_objective=project_data.research_objective,
        study_type=project_data.study_type,
        is_seeded=False,
        created_at=datetime.utcnow().isoformat()
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: str, project_data: schemas.ProjectBase, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_project.name = project_data.name
    db_project.product_description = project_data.product_description
    db_project.industry = project_data.industry
    db_project.market = project_data.market
    db_project.target_audience = project_data.target_audience
    db_project.research_objective = project_data.research_objective
    db_project.study_type = project_data.study_type
    
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/projects/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"success": True, "message": f"Project {project_id} deleted successfully"}

@router.post("/projects/{project_id}/personas", response_model=schemas.Persona)
def create_project_persona(project_id: str, persona_data: schemas.PersonaBase, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    import uuid
    persona_id = f"persona-{uuid.uuid4().hex[:8]}"
    db_persona = models.Persona(
        id=persona_id,
        project_id=project_id,
        name=persona_data.name,
        segment=persona_data.segment,
        quote=persona_data.quote,
        demographics=persona_data.demographics,
        goals=persona_data.goals,
        pain_points=persona_data.pain_points,
        motivations=persona_data.motivations,
        buying_behavior=persona_data.buying_behavior,
        decision_rules=persona_data.decision_rules,
        objections=persona_data.objections,
        channels=persona_data.channels,
        assumptions=persona_data.assumptions,
        confidence_score=persona_data.confidence_score,
        # New structured columns
        jtbd=persona_data.jtbd,
        psychographics=persona_data.psychographics,
        product_fit=persona_data.product_fit,
        journey_map=persona_data.journey_map,
        validation=persona_data.validation
    )
    db.add(db_persona)
    db.commit()
    db.refresh(db_persona)
    return db_persona

@router.put("/personas/{persona_id}", response_model=schemas.Persona)
def update_persona(persona_id: str, persona_data: schemas.PersonaBase, db: Session = Depends(get_db)):
    db_persona = db.query(models.Persona).filter(models.Persona.id == persona_id).first()
    if not db_persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    
    db_persona.name = persona_data.name
    db_persona.segment = persona_data.segment
    db_persona.quote = persona_data.quote
    db_persona.demographics = persona_data.demographics
    db_persona.goals = persona_data.goals
    db_persona.pain_points = persona_data.pain_points
    db_persona.motivations = persona_data.motivations
    db_persona.buying_behavior = persona_data.buying_behavior
    db_persona.decision_rules = persona_data.decision_rules
    db_persona.objections = persona_data.objections
    db_persona.channels = persona_data.channels
    db_persona.assumptions = persona_data.assumptions
    db_persona.confidence_score = persona_data.confidence_score
    
    # New structured columns
    db_persona.jtbd = persona_data.jtbd
    db_persona.psychographics = persona_data.psychographics
    db_persona.product_fit = persona_data.product_fit
    db_persona.journey_map = persona_data.journey_map
    db_persona.validation = persona_data.validation
    
    db.commit()
    db.refresh(db_persona)
    return db_persona

@router.delete("/personas/{persona_id}")
def delete_persona(persona_id: str, db: Session = Depends(get_db)):
    db_persona = db.query(models.Persona).filter(models.Persona.id == persona_id).first()
    if not db_persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    
    db.delete(db_persona)
    db.commit()
    return {"success": True, "message": f"Persona {persona_id} deleted successfully"}

@router.put("/studies/{study_id}", response_model=schemas.Study)
def update_study(study_id: str, study_data: schemas.StudyBase, db: Session = Depends(get_db)):
    db_study = db.query(models.Study).filter(models.Study.id == study_id).first()
    if not db_study:
        raise HTTPException(status_code=404, detail="Study not found")
    
    db_study.title = study_data.title
    db.commit()
    db.refresh(db_study)
    return db_study

@router.delete("/studies/{study_id}")
def delete_study(study_id: str, db: Session = Depends(get_db)):
    db_study = db.query(models.Study).filter(models.Study.id == study_id).first()
    if not db_study:
        raise HTTPException(status_code=404, detail="Study not found")
    
    db.delete(db_study)
    db.commit()
    return {"success": True, "message": f"Study {study_id} deleted successfully"}


