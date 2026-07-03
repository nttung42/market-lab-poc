from datetime import datetime
import uuid

from sqlalchemy.orm import Session

from app.core.errors import DomainNotFoundError
from app.models import models
from app.schemas import schemas


def list_projects(db: Session) -> list[models.Project]:
    return db.query(models.Project).all()


def get_project(db: Session, project_id: str) -> models.Project:
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise DomainNotFoundError("Project not found")
    return project


def create_project(db: Session, project_data: schemas.ProjectBase) -> models.Project:
    db_project = models.Project(
        id=f"project-{uuid.uuid4().hex[:8]}",
        name=project_data.name,
        product_description=project_data.product_description,
        industry=project_data.industry,
        market=project_data.market,
        target_audience=project_data.target_audience,
        research_objective=project_data.research_objective,
        study_type=project_data.study_type,
        is_seeded=False,
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project(
    db: Session, project_id: str, project_data: schemas.ProjectBase
) -> models.Project:
    project = get_project(db, project_id)
    project.name = project_data.name
    project.product_description = project_data.product_description
    project.industry = project_data.industry
    project.market = project_data.market
    project.target_audience = project_data.target_audience
    project.research_objective = project_data.research_objective
    project.study_type = project_data.study_type
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project_id: str) -> dict[str, str | bool]:
    project = get_project(db, project_id)
    db.delete(project)
    db.commit()
    return {"success": True, "message": f"Project {project_id} deleted successfully"}
