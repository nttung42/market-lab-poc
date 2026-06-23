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
            # Optionally update fields to ensure fresh seed values
            for key, val in p_data.items():
                setattr(existing_persona, key, val)
            db.commit()
            print(f"Persona {p_data['id']} updated with seed data.")
