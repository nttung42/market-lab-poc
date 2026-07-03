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
            "confidence_score": 85.0,
            "jtbd": {
                "functional_job": "Improve everyday English speaking communication to meet graduation criteria without high costs.",
                "emotional_job": "Feel confident speaking English, avoiding embarrassment or anxiety about pronunciation.",
                "social_job": "Be respected by peers and fit into English-speaking study groups.",
                "success_criteria": ["Understand daily topics", "Accurate enough pronunciation", "Save money"]
            },
            "psychographics": {
                "personality_traits": ["Pragmatic", "Budget-conscious", "Slightly anxious", "Diligent"],
                "core_values": ["Safety", "Frugality", "Growth"],
                "risk_tolerance": "Low",
                "tech_savviness": "Medium"
            },
            "product_fit": {
                "must_haves": ["Free tier", "Clear pricing structure", "Self-paced exercises"],
                "nice_to_haves": ["Gamification features", "Peer comparisons"],
                "deal_breakers": ["Hidden auto-renewals", "Forced card details upfront"],
                "alternatives": ["Duolingo (Free)", "YouTube lessons", "Traditional textbook study"]
            },
            "journey_map": [
                {"stage": "Awareness", "goals": ["Find speaking resources"], "pain_points": ["Centers are too expensive"], "touchpoints": ["TikTok ads", "Classmate recommendation"]},
                {"stage": "Consideration", "goals": ["Compare English speaking apps"], "pain_points": ["Fear of paywalls"], "touchpoints": ["App Store reviews"]},
                {"stage": "Conversion", "goals": ["Install and try out"], "pain_points": ["Don't want to input card info"], "touchpoints": ["Onboarding signup"]},
                {"stage": "Onboarding", "goals": ["Complete first lesson"], "pain_points": ["App feels too pushy"], "touchpoints": ["First speaking evaluation"]},
                {"stage": "Retention", "goals": ["Learn daily speaking habit"], "pain_points": ["Losing motivation"], "touchpoints": ["Streak notifications", "Simple badges"]}
            ],
            "validation": {
                "is_human_validated": False,
                "evidence_sources": ["EdTech Market Report 2026", "Student Survey (50 respondents)"],
                "last_validated_at": None
            }
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
            "confidence_score": 90.0,
            "jtbd": {
                "functional_job": "Master professional English communication and mock interviews to secure a high-paying MNC internship.",
                "emotional_job": "Feel ready and composed when interviewed by foreign managers.",
                "social_job": "Stand out as a competent, global-minded professional among applicants.",
                "success_criteria": ["IELTS Speaking Band 6.5+", "Fluent business presentations", "Pass mock job interviews"]
            },
            "psychographics": {
                "personality_traits": ["Ambitious", "Goal-oriented", "Rational", "Determined"],
                "core_values": ["Achievement", "Efficiency", "Professionalism"],
                "risk_tolerance": "High",
                "tech_savviness": "High"
            },
            "product_fit": {
                "must_haves": ["Mock interview simulations", "Granular accent & grammar analytics", "Business vocabulary"],
                "nice_to_haves": ["CV scanning / pitch prep", "Industry-specific interview tracks"],
                "deal_breakers": ["Overly gamified interfaces", "Lack of professional mock scenarios", "No business-level tracks"],
                "alternatives": ["Speaking center tutors", "Mock interview websites", "Self-practice in front of mirror"]
            },
            "journey_map": [
                {"stage": "Awareness", "goals": ["Improve interview English"], "pain_points": ["Traditional apps are too simple/basic"], "touchpoints": ["LinkedIn posts", "Tech review channels"]},
                {"stage": "Consideration", "goals": ["Evaluate professional mock tools"], "pain_points": ["High price tags"], "touchpoints": ["Feature detail lists"]},
                {"stage": "Conversion", "goals": ["Purchase premium annual subscription"], "pain_points": ["Is the simulation realistic enough?"], "touchpoints": ["Checkout page"]},
                {"stage": "Onboarding", "goals": ["Run first mock interview"], "pain_points": ["Understanding feedback metrics"], "touchpoints": ["Interview simulator onboarding"]},
                {"stage": "Retention", "goals": ["Complete 3 mock interviews per week"], "pain_points": ["Lack of customized scenarios"], "touchpoints": ["Weekly progress report emails"]}
            ],
            "validation": {
                "is_human_validated": False,
                "evidence_sources": ["LinkedIn Student Placement Survey", "HR Interview Guidelines"],
                "last_validated_at": None
            }
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
            "confidence_score": 80.0,
            "jtbd": {
                "functional_job": "Improve pronunciation of slang and pop-culture terms to watch movies without subtitles.",
                "emotional_job": "Enjoy learning as a relaxing, stress-free hobby rather than academic work.",
                "social_job": "Connect with international students and participate in global pop-culture discussions.",
                "success_criteria": ["Understand movie quotes", "Stay motivated for 10+ days", "Have fun"]
            },
            "psychographics": {
                "personality_traits": ["Creative", "Impulsive", "Leisure-oriented", "Visual thinker"],
                "core_values": ["Fun", "Convenience", "Self-expression"],
                "risk_tolerance": "Medium",
                "tech_savviness": "High"
            },
            "product_fit": {
                "must_haves": ["Modern/clean visual style", "Gamified elements (streaks, badges)", "Lessons under 15 minutes"],
                "nice_to_haves": ["Expressive natural AI voice", "Pop-culture vocabulary"],
                "deal_breakers": ["Boring grammar drills", "Intrusive pushy streak warnings", "Strict exam/test formats"],
                "alternatives": ["Duolingo", "YouTube vloggers", "Netflix with bilingual subtitles"]
            },
            "journey_map": [
                {"stage": "Awareness", "goals": ["Find a fun English app"], "pain_points": ["Apps feel like boring classroom study"], "touchpoints": ["Instagram feeds", "TikTok influencers"]},
                {"stage": "Consideration", "goals": ["Try out visual interface"], "pain_points": ["UI looks outdated"], "touchpoints": ["App Store screenshots"]},
                {"stage": "Conversion", "goals": ["Subscribe to premium monthly trial"], "pain_points": ["Unnatural voice synthesis"], "touchpoints": ["Onboarding welcome page"]},
                {"stage": "Onboarding", "goals": ["Do a quick 5-min talk game"], "pain_points": ["Too much text upfront"], "touchpoints": ["First speaking game"]},
                {"stage": "Retention", "goals": ["Keep a 14-day speaking streak"], "pain_points": ["Streak pressure causes stress"], "touchpoints": ["Badge notifications", "Daily casual topics"]}
            ],
            "validation": {
                "is_human_validated": False,
                "evidence_sources": ["App Store Review Sentiment Analysis", "Casual Learner Focus Group (3 members)"],
                "last_validated_at": None
            }
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

    # Idempotent Study Seeding
    from app.models.models import Study, Question, QuestionOption
    study_id = "study-concept-test"
    existing_study = db.query(Study).filter(Study.id == study_id).first()
    if not existing_study:
        study = Study(
            id=study_id,
            project_id=project_id,
            title="Initial Value Proposition Concept Test",
            status="draft",
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
        print("Seeded study definition without synthetic respondents or responses.")
