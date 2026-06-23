from sqlalchemy.orm import Session
from app.models.models import Project, Persona
from datetime import datetime

def seed_db(db: Session):
    # Idempotent Project Seeding
    project_id = "english-learning-app-poc"
    existing_project = db.query(Project).filter(Project.id == project_id).first()
    
    if not existing_project:
        project = Project(
            id=project_id,
            name="English learning app for Vietnamese university students",
            product_description="An AI-powered mobile app designed to help Vietnamese university students practice speaking English confidently without fear of making mistakes, with tailored lessons for IELTS and job interviews.",
            industry="EdTech",
            market="Vietnam",
            target_audience="Vietnamese university students aged 18-24",
            research_objective="Choose the stronger value proposition for initial launch",
            study_type="Synthetic Concept / Message Test",
            is_seeded=True,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(project)
        db.commit()
        print(f"Seeded project: {project_id}")
    else:
        print(f"Project {project_id} already exists. Skipping project seed.")

    # Idempotent Persona Seeding
    personas_data = [
        {
            "id": "persona-price-sensitive",
            "project_id": project_id,
            "name": "Minh Thu",
            "segment": "Price-sensitive student",
            "quote": "I really want to improve my speaking, but as a student, I have to watch my expenses carefully. I can't afford expensive center courses.",
            "demographics": [
                "Age: 20",
                "Location: Hanoi, Vietnam",
                "Year: 2nd Year University Student",
                "Major: Accounting"
            ],
            "goals": [
                "Improve English speaking for basic communication",
                "Find free or highly affordable resources",
                "Study at my own pace between classes"
            ],
            "pain_points": [
                "Limited budget for learning software or courses",
                "Most English apps require credit card/subscription after a short trial",
                "Feels speaking classes at centers are too expensive"
            ],
            "motivations": [
                "Pass university English graduation requirement",
                "Feel more confident when talking to peers",
                "Save money for other living expenses"
            ],
            "buying_behavior": [
                "Always looks for discount codes or free trials",
                "Compares prices across multiple apps before committing",
                "Relies heavily on reviews from other students"
            ],
            "decision_rules": [
                "Must have a fully functional free tier",
                "Paid plans must be under 100k VND/month ($4)",
                "Value must be immediately obvious in the first 3 days"
            ],
            "objections": [
                "Hidden subscription auto-renewals",
                "Feature locks behind high paywalls",
                "Not sure if the speaking practice is actually helpful without a teacher"
            ],
            "channels": [
                "TikTok",
                "Facebook Groups for Students",
                "Word of mouth from classmates"
            ],
            "assumptions": [
                "Assumes AI speech evaluation might not be accurate for Vietnamese accents",
                "Expects paid apps to have refund policies"
            ],
            "confidence_score": 85.0
        },
        {
            "id": "persona-career-focused",
            "project_id": project_id,
            "name": "Hoang Nam",
            "segment": "Career-focused student",
            "quote": "I need to speak English fluently to get an internship at a multinational company. Academic IELTS is good, but professional communication is what gets me hired.",
            "demographics": [
                "Age: 21",
                "Location: Ho Chi Minh City, Vietnam",
                "Year: 3rd Year University Student",
                "Major: Business Administration"
            ],
            "goals": [
                "Master English vocabulary for professional settings",
                "Practice mock interviews and CV presentations in English",
                "Prepare for IELTS speaking band 6.5+"
            ],
            "pain_points": [
                "Struggles with business terminology and formal communication",
                "Anxious about interviews with foreign managers",
                "Hard to find people to practice professional conversations with"
            ],
            "motivations": [
                "Secure a high-paying internship/job at a foreign firm",
                "Build a strong CV that stands out",
                "Network with international professionals"
            ],
            "buying_behavior": [
                "Willing to pay a premium for high-quality, targeted features",
                "Prefers annual plans if they offer better long-term value",
                "Reads tech blogs and professional recommendations"
            ],
            "decision_rules": [
                "App must have specialized job interview simulation modules",
                "Must offer detailed, professional pronunciation feedback",
                "Must feel professional, not like a game"
            ],
            "objections": [
                "Too simple or gamified (e.g., matching cards)",
                "No dedicated business English track",
                "Speech analysis doesn't catch grammatical errors in speaking"
            ],
            "channels": [
                "LinkedIn",
                "Facebook Group (IELTS / HR)",
                "Youtube tech review channels"
            ],
            "assumptions": [
                "Assumes high price correlates with premium quality",
                "Assumes AI can effectively simulate a real job interviewer"
            ],
            "confidence_score": 90.0
        },
        {
            "id": "persona-casual-learner",
            "project_id": project_id,
            "name": "Khanh Vy",
            "segment": "Casual learner",
            "quote": "I don't have an exam deadline, I just want to practice English conversations without stress. The key for me is staying motivated and having fun.",
            "demographics": [
                "Age: 19",
                "Location: Da Nang, Vietnam",
                "Year: 1st Year University Student",
                "Major: Graphic Design"
            ],
            "goals": [
                "Practice speaking English in casual, everyday contexts",
                "Build a daily learning habit without feeling pressured",
                "Improve pronunciation of popular culture terms"
            ],
            "pain_points": [
                "Finds traditional grammar exercises boring and repetitive",
                "Easily loses motivation when apps feel like schoolwork",
                "Anxious about making mistakes in front of real people"
            ],
            "motivations": [
                "Understand English movies and music without subtitles",
                "Make friends with international students",
                "Enjoy learning English as a hobby"
            ],
            "buying_behavior": [
                "Subscribes impulsively if the interface looks fun and beautiful",
                "Likes gamified elements like streaks and badges",
                "Influenced by creative advertising"
            ],
            "decision_rules": [
                "Lessons must take less than 15 minutes a day",
                "Interface must be visually appealing and modern",
                "No strict penalties or stressful exams"
            ],
            "objections": [
                "Too academic or focused on grammar rules",
                "Stiff, robotic AI voice that feels unnatural",
                "Stressful streaks or pushy notifications"
            ],
            "channels": [
                "Instagram",
                "TikTok",
                "Shopee/E-commerce banners"
            ],
            "assumptions": [
                "Assumes app will keep me motivated with game-like lessons",
                "Assumes standard pronunciation is sufficient"
            ],
            "confidence_score": 80.0
        }
    ]

    for p_data in personas_data:
        existing_persona = db.query(Persona).filter(Persona.id == p_data["id"]).first()
        if not existing_persona:
            persona = Persona(**p_data)
            db.add(persona)
            db.commit()
            print(f"Seeded persona: {p_data['id']}")
        else:
            for key, val in p_data.items():
                setattr(existing_persona, key, val)
            db.commit()
            print(f"Persona {p_data['id']} updated with seed data.")

    # Idempotent Respondent Seeding
    from app.models.models import Respondent, Study, Question, QuestionOption, Response
    existing_respondents = db.query(Respondent).filter(Respondent.project_id == project_id).all()
    if not existing_respondents:
        from app.services.respondent_generator import generate_mock_respondents
        personas = db.query(Persona).filter(Persona.project_id == project_id).all()
        for persona in personas:
            # Generate 5 respondents per persona for seed
            generated = generate_mock_respondents(persona, 5)
            for r_data in generated:
                db_resp = Respondent(
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
                db.add(db_resp)
        db.commit()
        print("Seeded 15 synthetic respondents.")

    # Idempotent Study Seeding
    study_id = "study-concept-test"
    existing_study = db.query(Study).filter(Study.id == study_id).first()
    if not existing_study:
        study = Study(
            id=study_id,
            project_id=project_id,
            title="Initial Value Proposition Concept Test",
            status="completed",
            created_at=datetime.utcnow().isoformat()
        )
        db.add(study)
        db.commit()

        # Seed Questions
        q1 = Question(
            id="q-price",
            study_id=study_id,
            text="How important is a free-tier or pricing below 100k VND ($4) per month to your decision to use this app?",
            type="likert",
            position=0
        )
        q2 = Question(
            id="q-feature",
            study_id=study_id,
            text="Which feature would make you most likely to practice English speaking on this app daily?",
            type="single_choice",
            position=1
        )
        q3 = Question(
            id="q-objection",
            study_id=study_id,
            text="What is your main concern or hesitation about using an AI-powered speaking practice application?",
            type="open_text",
            position=2
        )
        db.add_all([q1, q2, q3])
        db.commit()

        # Seed Question Options for q2
        opts = [
            ("Specialized IELTS speaking mock tests", "ielts"),
            ("Job interview mock simulator with formal business feedback", "job-interview"),
            ("Casual, game-like conversations with cute AI friends", "casual-game"),
            ("Daily vocabulary challenges & streaks", "vocab-streaks")
        ]
        for idx, (text, value) in enumerate(opts):
            db.add(QuestionOption(
                id=f"opt-{value}",
                question_id="q-feature",
                text=text,
                value=value,
                position=idx
            ))
        db.commit()

        # Seed responses for all seeded respondents
        from app.services.study_simulator import generate_mock_answer
        db_respondents = db.query(Respondent).filter(Respondent.project_id == project_id).all()
        db_personas = db.query(Persona).filter(Persona.project_id == project_id).all()
        personas_dict = {p.id: p for p in db_personas}
        db_questions = [q1, q2, q3]

        # Fetch questions with loaded options relation
        db_questions = db.query(Question).filter(Question.study_id == study_id).all()

        import uuid
        for resp in db_respondents:
            p_obj = personas_dict[resp.persona_id]
            for q in db_questions:
                ans = generate_mock_answer(resp, p_obj, q)
                db.add(Response(
                    id=f"resp-ans-{uuid.uuid4().hex[:8]}",
                    study_id=study_id,
                    respondent_id=resp.id,
                    question_id=q.id,
                    answer=ans
                ))
        db.commit()
        print("Seeded survey questions and study responses.")

