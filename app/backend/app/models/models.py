from sqlalchemy import Column, String, Boolean, Float, ForeignKey, JSON, Integer
from sqlalchemy.orm import relationship
from app.db.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    product_description = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    market = Column(String, nullable=False)
    target_audience = Column(String, nullable=False)
    research_objective = Column(String, nullable=False)
    study_type = Column(String, nullable=False)
    is_seeded = Column(Boolean, default=False)
    created_at = Column(String, nullable=False)

    personas = relationship("Persona", back_populates="project", cascade="all, delete-orphan")
    respondents = relationship("Respondent", back_populates="project", cascade="all, delete-orphan")
    studies = relationship("Study", back_populates="project", cascade="all, delete-orphan")


class Persona(Base):
    __tablename__ = "personas"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    segment = Column(String, nullable=False)
    quote = Column(String, nullable=False)
    
    # List-like properties stored as JSON arrays in SQLite
    demographics = Column(JSON, nullable=False)
    goals = Column(JSON, nullable=False)
    pain_points = Column(JSON, nullable=False)
    motivations = Column(JSON, nullable=False)
    buying_behavior = Column(JSON, nullable=False)
    decision_rules = Column(JSON, nullable=False)
    objections = Column(JSON, nullable=False)
    channels = Column(JSON, nullable=False)
    assumptions = Column(JSON, nullable=False)
    
    confidence_score = Column(Float, nullable=False)
    
    # New structured marketing/product columns (nullable for backward compatibility)
    jtbd = Column(JSON, nullable=True)
    psychographics = Column(JSON, nullable=True)
    product_fit = Column(JSON, nullable=True)
    journey_map = Column(JSON, nullable=True)
    validation = Column(JSON, nullable=True)

    project = relationship("Project", back_populates="personas")
    respondents = relationship("Respondent", back_populates="persona", cascade="all, delete-orphan")


class Respondent(Base):
    __tablename__ = "respondents"

    id = Column(String, primary_key=True, index=True)
    persona_id = Column(String, ForeignKey("personas.id"), nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    budget = Column(String, nullable=False)  # e.g., Low, Medium, High
    motivation = Column(String, nullable=False)
    tech_savviness = Column(String, nullable=False)  # e.g., Low, Medium, High
    risk_attitude = Column(String, nullable=False)  # e.g., Risk-averse, Neutral, Risk-seeking
    channel = Column(String, nullable=False)
    decision_rules = Column(JSON, nullable=False)  # list of rules / context

    project = relationship("Project", back_populates="respondents")
    persona = relationship("Persona", back_populates="respondents")


class Study(Base):
    __tablename__ = "studies"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    status = Column(String, default="draft", nullable=False)  # draft, running, completed
    created_at = Column(String, nullable=False)

    project = relationship("Project", back_populates="studies")
    questions = relationship("Question", back_populates="study", cascade="all, delete-orphan")
    responses = relationship("Response", back_populates="study", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, index=True)
    study_id = Column(String, ForeignKey("studies.id"), nullable=False)
    text = Column(String, nullable=False)
    type = Column(String, nullable=False)  # single_choice, multi_choice, likert, open_text
    position = Column(Integer, default=0, nullable=False)

    study = relationship("Study", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")
    responses = relationship("Response", back_populates="question", cascade="all, delete-orphan")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(String, primary_key=True, index=True)
    question_id = Column(String, ForeignKey("questions.id"), nullable=False)
    text = Column(String, nullable=False)
    value = Column(String, nullable=False)
    position = Column(Integer, default=0, nullable=False)

    question = relationship("Question", back_populates="options")


class Response(Base):
    __tablename__ = "responses"

    id = Column(String, primary_key=True, index=True)
    study_id = Column(String, ForeignKey("studies.id"), nullable=False)
    respondent_id = Column(String, ForeignKey("respondents.id"), nullable=False)
    question_id = Column(String, ForeignKey("questions.id"), nullable=False)
    answer = Column(String, nullable=False)

    study = relationship("Study", back_populates="responses")
    question = relationship("Question", back_populates="responses")
    respondent = relationship("Respondent")


