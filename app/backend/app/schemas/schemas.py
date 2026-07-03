from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

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
    
    # New structured columns (optional)
    jtbd: Optional[Dict[str, Any]] = None
    psychographics: Optional[Dict[str, Any]] = None
    product_fit: Optional[Dict[str, Any]] = None
    journey_map: Optional[List[Dict[str, Any]]] = None
    validation: Optional[Dict[str, Any]] = None

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


class RespondentBase(BaseModel):
    name: str = Field(..., min_length=1)
    age: int = Field(..., ge=0)
    location: str = Field(..., min_length=1)
    budget: str = Field(..., min_length=1)
    motivation: str = Field(..., min_length=1)
    tech_savviness: str = Field(..., min_length=1)
    risk_attitude: str = Field(..., min_length=1)
    channel: str = Field(..., min_length=1)
    decision_rules: List[str] = Field(..., min_items=0)

class RespondentCreate(RespondentBase):
    id: str
    persona_id: str
    project_id: str

class Respondent(RespondentBase):
    id: str
    persona_id: str
    project_id: str

    class Config:
        from_attributes = True

class RespondentGenerateRequest(BaseModel):
    count_per_persona: int = Field(10, ge=1, le=50)


class QuestionOptionBase(BaseModel):
    text: str = Field(..., min_length=1)
    value: str = Field(..., min_length=1)
    position: int = 0

class QuestionOptionCreate(QuestionOptionBase):
    id: str

class QuestionOption(QuestionOptionBase):
    id: str
    question_id: str

    class Config:
        from_attributes = True

class QuestionBase(BaseModel):
    text: str = Field(..., min_length=1)
    type: str = Field(..., min_length=1)  # single_choice, multi_choice, likert, open_text
    position: int = 0

class QuestionCreate(QuestionBase):
    id: str
    options: List[QuestionOptionCreate] = []

class Question(QuestionBase):
    id: str
    study_id: str
    options: List[QuestionOption] = []

    class Config:
        from_attributes = True

class StudyBase(BaseModel):
    title: str = Field(..., min_length=1)

class StudyCreate(StudyBase):
    id: str
    project_id: str
    status: str = "draft"
    created_at: str

class Study(StudyBase):
    id: str
    project_id: str
    status: str
    created_at: str
    questions: List[Question] = []

    class Config:
        from_attributes = True

class ResponseBase(BaseModel):
    answer: str

class ResponseCreate(ResponseBase):
    id: str
    study_id: str
    respondent_id: str
    question_id: str

class Response(ResponseBase):
    id: str
    study_id: str
    respondent_id: str
    question_id: str
    respondent: Respondent

    class Config:
        from_attributes = True

class StudyRunRequest(BaseModel):
    persona_ids: List[str] = []

class ChoiceResult(BaseModel):
    option: str
    count: int
    percentage: float

class QuestionResult(BaseModel):
    question_id: str
    question_text: str
    question_type: str
    total_responses: int
    results: List[ChoiceResult] = []
    average_rating: float = 0.0

class QualitativeTheme(BaseModel):
    theme: str
    description: str
    objections: List[str] = []
    quotes: List[str] = []

class RecommendationItem(BaseModel):
    priority: str
    title: str
    details: str

class StudyResults(BaseModel):
    study_id: str
    total_respondents: int
    quantitative: List[QuestionResult]
    qualitative_themes: List[QualitativeTheme]
    recommendations: List[RecommendationItem]


class AIRunBase(BaseModel):
    task_type: str
    status: str
    model_alias: str
    provider: str
    resolved_model: str
    project_id: Optional[str] = None
    study_id: Optional[str] = None
    persona_id: Optional[str] = None
    request_payload: Optional[Dict[str, Any]] = None
    raw_response: Optional[Dict[str, Any]] = None
    parsed_output: Optional[Dict[str, Any]] = None
    usage: Optional[Dict[str, Any]] = None
    error_detail: Optional[str] = None
    created_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


class AIRun(AIRunBase):
    id: str

    class Config:
        from_attributes = True

