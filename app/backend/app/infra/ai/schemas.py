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


class PersonaJTBDOutput(BaseModel):
    functional_job: str = Field(..., min_length=1)
    emotional_job: str = Field(..., min_length=1)
    social_job: str = Field(..., min_length=1)
    success_criteria: list[str] = Field(default_factory=list)


class PersonaPsychographicsOutput(BaseModel):
    personality_traits: list[str] = Field(default_factory=list)
    core_values: list[str] = Field(default_factory=list)
    risk_tolerance: str = Field(..., min_length=1)
    tech_savviness: str = Field(..., min_length=1)


class PersonaProductFitOutput(BaseModel):
    must_haves: list[str] = Field(default_factory=list)
    nice_to_haves: list[str] = Field(default_factory=list)
    deal_breakers: list[str] = Field(default_factory=list)
    alternatives: list[str] = Field(default_factory=list)


class PersonaJourneyStageOutput(BaseModel):
    stage: str = Field(..., min_length=1)
    goals: list[str] = Field(default_factory=list)
    pain_points: list[str] = Field(default_factory=list)
    touchpoints: list[str] = Field(default_factory=list)


class PersonaValidationOutput(BaseModel):
    is_human_validated: bool
    evidence_sources: list[str] = Field(default_factory=list)
    last_validated_at: str | None = None


class WeightedSignalOutput(BaseModel):
    label: str = Field(..., min_length=1)
    weight: int = Field(..., ge=0, le=100)


class PersonaProfileInformationOutput(BaseModel):
    summary: str = Field(..., min_length=1)
    personal_aspirations: str = Field(..., min_length=1)


class PersonaBuyingBehaviorOutput(BaseModel):
    purchase_decision_factors: list[str] = Field(default_factory=list)
    triggers: list[str] = Field(default_factory=list)


class PersonaPsychologicalDriversOutput(BaseModel):
    goals: list[str] = Field(default_factory=list)
    motivations: list[str] = Field(default_factory=list)
    key_needs: list[str] = Field(default_factory=list)


class PersonaKeyObstaclesOutput(BaseModel):
    core_challenges: list[str] = Field(default_factory=list)
    day_to_day_pain_points: list[str] = Field(default_factory=list)
    perceived_barriers: list[str] = Field(default_factory=list)


class PersonaWorkLifestyleOutput(BaseModel):
    occupation: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    income: str = Field(..., min_length=1)
    marital_status: str = Field(..., min_length=1)
    housing_status: str = Field(..., min_length=1)


class PersonaMediaDigitalOutput(BaseModel):
    media_news_sources: list[WeightedSignalOutput] = Field(default_factory=list)
    social_networks: list[WeightedSignalOutput] = Field(default_factory=list)
    websites_visited: list[WeightedSignalOutput] = Field(default_factory=list)
    subreddits: list[str] = Field(default_factory=list)
    hashtags: list[str] = Field(default_factory=list)
    content_types: list[WeightedSignalOutput] = Field(default_factory=list)


class PersonaBrandCommerceOutput(BaseModel):
    brands: list[WeightedSignalOutput] = Field(default_factory=list)
    shopping_websites: list[WeightedSignalOutput] = Field(default_factory=list)
    products: list[WeightedSignalOutput] = Field(default_factory=list)
    services: list[WeightedSignalOutput] = Field(default_factory=list)


class PersonaPreferencesOutput(BaseModel):
    sports: list[WeightedSignalOutput] = Field(default_factory=list)
    entertainment: list[WeightedSignalOutput] = Field(default_factory=list)
    news: list[WeightedSignalOutput] = Field(default_factory=list)
    places_likely_to_visit: list[WeightedSignalOutput] = Field(default_factory=list)
    events_conferences: list[WeightedSignalOutput] = Field(default_factory=list)
    values: list[WeightedSignalOutput] = Field(default_factory=list)
    hobbies: list[WeightedSignalOutput] = Field(default_factory=list)
    interests: list[WeightedSignalOutput] = Field(default_factory=list)
    tools: list[WeightedSignalOutput] = Field(default_factory=list)


class PersonaWebsiteInteractionOutput(BaseModel):
    first_interaction_day: str = Field(..., min_length=1)
    first_interaction_time: str = Field(..., min_length=1)
    influential_resources: list[WeightedSignalOutput] = Field(default_factory=list)
    resonating_topics: list[WeightedSignalOutput] = Field(default_factory=list)


class PersonaIndustryInsightsOutput(BaseModel):
    apparel_fashion: dict[str, list[WeightedSignalOutput]] = Field(default_factory=dict)
    sporting_goods: dict[str, list[WeightedSignalOutput]] = Field(default_factory=dict)
    consumer_goods: dict[str, list[WeightedSignalOutput]] = Field(default_factory=dict)


class PersonaInsightProfileOutput(BaseModel):
    profile_information: PersonaProfileInformationOutput | None = None
    buying_behavior: PersonaBuyingBehaviorOutput | None = None
    psychological_drivers: PersonaPsychologicalDriversOutput | None = None
    key_obstacles: PersonaKeyObstaclesOutput | None = None
    work_lifestyle: PersonaWorkLifestyleOutput | None = None
    communication: list[WeightedSignalOutput] = Field(default_factory=list)
    media_digital: PersonaMediaDigitalOutput | None = None
    brand_commerce: PersonaBrandCommerceOutput | None = None
    preferences: PersonaPreferencesOutput | None = None
    website_interaction: PersonaWebsiteInteractionOutput | None = None
    industry_specific_insights: PersonaIndustryInsightsOutput | None = None


class PersonaDraftOutput(BaseModel):
    name: str = Field(..., min_length=1)
    segment: str = Field(..., min_length=1)
    quote: str = Field(..., min_length=1)
    demographics: list[str] = Field(..., min_length=1)
    goals: list[str] = Field(..., min_length=1)
    pain_points: list[str] = Field(..., min_length=1)
    motivations: list[str] = Field(..., min_length=1)
    buying_behavior: list[str] = Field(..., min_length=1)
    decision_rules: list[str] = Field(..., min_length=1)
    objections: list[str] = Field(..., min_length=1)
    channels: list[str] = Field(..., min_length=1)
    assumptions: list[str] = Field(..., min_length=1)
    confidence_score: float = Field(..., ge=0.0, le=100.0)
    jtbd: PersonaJTBDOutput
    psychographics: PersonaPsychographicsOutput
    product_fit: PersonaProductFitOutput
    journey_map: list[PersonaJourneyStageOutput] = Field(default_factory=list)
    validation: PersonaValidationOutput
    insight_profile: PersonaInsightProfileOutput | None = None
