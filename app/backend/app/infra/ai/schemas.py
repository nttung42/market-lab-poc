from typing import Any

from pydantic import BaseModel, Field


class RespondentOutput(BaseModel):
    name: str = Field(..., min_length=1)
    age: int = Field(..., ge=0)
    location: str = Field(..., min_length=1)
    budget: str = Field(..., min_length=1)
    motivation: str = Field(..., min_length=1)
    tech_savviness: str = Field(..., min_length=1)
    risk_attitude: str = Field(..., min_length=1)
    channel: str = Field(..., min_length=1)
    decision_rules: list[str] = Field(default_factory=list)


class RespondentGenerationOutput(BaseModel):
    respondents: list[RespondentOutput]


class StudyAnswerOutput(BaseModel):
    answer: str | list[str] | int | float | dict[str, Any]
