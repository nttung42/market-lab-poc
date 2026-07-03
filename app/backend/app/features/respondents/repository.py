from sqlalchemy.orm import Session

from app.models import models


def list_project_personas(db: Session, project_id: str) -> list[models.Persona]:
    return db.query(models.Persona).filter(models.Persona.project_id == project_id).all()


def list_project_respondents(db: Session, project_id: str) -> list[models.Respondent]:
    return db.query(models.Respondent).filter(models.Respondent.project_id == project_id).all()


def replace_project_respondents(
    db: Session, project_id: str, respondent_payloads: list[dict]
) -> list[models.Respondent]:
    db.query(models.Respondent).filter(models.Respondent.project_id == project_id).delete()
    db.flush()

    respondents = []
    for r_data in respondent_payloads:
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
            decision_rules=r_data["decision_rules"],
        )
        db.add(db_respondent)
        respondents.append(db_respondent)
    return respondents
