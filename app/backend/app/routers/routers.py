from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
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
