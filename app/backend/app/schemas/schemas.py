from pydantic import BaseModel, Field
from typing import List

class PersonaBase(BaseModel):
    name: str = Field(..., min_length=1)
    segment: str = Field(..., min_length=1)
    quote: str = Field(..., min_length=1)
    demographics: List[str] = Field(..., min_items=1)
    goals: List[str] = Field(..., min_items=1)
    pain_points: List[str] = Field(..., min_items=1)
    motivations: List[str] = Field(..., min_items=1)
    buying_behavior: List[str] = Field(..., min_items=1)
    decision_rules: List[str] = Field(..., min_items=1)
    objections: List[str] = Field(..., min_items=1)
    channels: List[str] = Field(..., min_items=1)
    assumptions: List[str] = Field(..., min_items=1)
    confidence_score: float = Field(..., ge=0.0, le=100.0)

class PersonaCreate(PersonaBase):
    id: str
    project_id: str

class Persona(PersonaBase):
    id: str
    project_id: str

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1)
    product_description: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    market: str = Field(..., min_length=1)
    target_audience: str = Field(..., min_length=1)
    research_objective: str = Field(..., min_length=1)
    study_type: str = Field(..., min_length=1)

class ProjectCreate(ProjectBase):
    id: str
    is_seeded: bool = False
    created_at: str

class Project(ProjectBase):
    id: str
    is_seeded: bool
    created_at: str
    personas: List[Persona] = []

    class Config:
        from_attributes = True
