from datetime import datetime
import uuid

from sqlalchemy.orm import Session

from app.models import models
from app.schemas import schemas


def list_project_studies(db: Session, project_id: str) -> list[models.Study]:
    return db.query(models.Study).filter(models.Study.project_id == project_id).all()


def get_study_by_id(db: Session, study_id: str) -> models.Study | None:
    return db.query(models.Study).filter(models.Study.id == study_id).first()


def create_study(
    db: Session, project_id: str, study_data: schemas.StudyBase
) -> models.Study:
    db_study = models.Study(
        id=f"study-{uuid.uuid4().hex[:8]}",
        project_id=project_id,
        title=study_data.title,
        status="draft",
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(db_study)
    db.commit()
    db.refresh(db_study)
    return db_study


def create_question(
    db: Session, study_id: str, question_data: schemas.QuestionCreate
) -> models.Question:
    db_question = models.Question(
        id=question_data.id,
        study_id=study_id,
        text=question_data.text,
        type=question_data.type,
        position=question_data.position,
    )
    db.add(db_question)
    for idx, opt in enumerate(question_data.options):
        db.add(
            models.QuestionOption(
                id=opt.id,
                question_id=question_data.id,
                text=opt.text,
                value=opt.value,
                position=idx,
            )
        )
    db.commit()
    db.refresh(db_question)
    return db_question


def replace_study_responses(
    db: Session,
    *,
    study_id: str,
    respondent_ids: list[str],
    response_payloads: list[dict],
) -> list[models.Response]:
    db.query(models.Response).filter(
        models.Response.study_id == study_id,
        models.Response.respondent_id.in_(respondent_ids),
    ).delete(synchronize_session=False)
    db.flush()

    responses = []
    for r_data in response_payloads:
        db_resp = models.Response(
            id=r_data["id"],
            study_id=r_data["study_id"],
            respondent_id=r_data["respondent_id"],
            question_id=r_data["question_id"],
            answer=r_data["answer"],
        )
        db.add(db_resp)
        responses.append(db_resp)
    return responses


def list_study_responses(db: Session, study_id: str) -> list[models.Response]:
    return db.query(models.Response).filter(models.Response.study_id == study_id).all()


def list_project_respondents(db: Session, project_id: str) -> list[models.Respondent]:
    return db.query(models.Respondent).filter(models.Respondent.project_id == project_id).all()


def list_project_personas(db: Session, project_id: str) -> list[models.Persona]:
    return db.query(models.Persona).filter(models.Persona.project_id == project_id).all()
