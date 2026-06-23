from sqlalchemy import Column, String, Boolean, Float, ForeignKey, JSON
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

    project = relationship("Project", back_populates="personas")
