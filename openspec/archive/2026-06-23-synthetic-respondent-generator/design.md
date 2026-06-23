## Context

In Phase 1, we established the foundation: Projects and Persona definitions seeded in SQLite. In Phase 2, we introduce **Synthetic Respondents**—individual virtual survey participants representing variations of their parent Persona. This document details the technical design for generating, persisting, and displaying these respondents.

## Goals / Non-Goals

**Goals:**
- Define database model and schemas for respondents.
- Implement an LLM service in FastAPI to generate N diverse respondents from a persona.
- Add backend API endpoints to generate and fetch respondents.
- Provide a mock/fallback generator if LLM API keys are missing to ensure robust offline testing.
- Design a premium frontend UI to trigger respondent generation and inspect respondent panels using tables/grids with a beautiful dark/glassmorphic design.

**Non-Goals:**
- Designing survey question templates or study configurations (Phase 3).
- Running responses/simulated interviews (Phase 4).
- Production payment systems, user authentication, or multi-tenant isolation.

## Decisions

### 1. LLM Integration and Mock Fallback
- **Choice**: Call OpenAI or OpenRouter API from backend via `httpx`.
- **Details**:
  - Prompt the model to return a structured JSON array of respondents based on a persona's properties.
  - Read `OPENAI_API_KEY` or `OPENROUTER_API_KEY` from environment variables.
  - If no API key is provided, log a warning and fall back to a deterministic, high-fidelity mock generator that creates 10 highly realistic and varied respondents per persona.
- **Rationale**: Keeps backend secure (Constraint 8) and ensures the PoC runs fully out-of-the-box (Constraint 12) without requiring an API key.

### 2. SQLite Database Schema
- **Choice**: New SQLAlchemy table `respondents` with foreign key relations to both `personas` and `projects`.
- **Details**:
  ```python
  class Respondent(Base):
      __tablename__ = "respondents"
      id = Column(String, primary_key=True, index=True)
      persona_id = Column(String, ForeignKey("personas.id"), nullable=False)
      project_id = Column(String, ForeignKey("projects.id"), nullable=False)
      name = Column(String, nullable=False)
      age = Column(Integer, nullable=False)
      location = Column(String, nullable=False)
      budget = Column(String, nullable=False) # e.g. Low, Medium, High
      motivation = Column(String, nullable=False)
      tech_savviness = Column(String, nullable=False) # e.g. Low, Medium, High
      risk_attitude = Column(String, nullable=False) # e.g. Risk-averse, Neutral, Risk-seeking
      channel = Column(String, nullable=False)
      decision_rules = Column(JSON, nullable=False) # list of rules / context
  ```
- **Rationale**: Simple SQLite table, easily queryable and properly normalized.

### 3. API Contract
- **Choice**: REST endpoints matching `app/backend/ARCHITECTURE.md`.
- **Details**:
  - `POST /api/projects/{project_id}/respondents/generate`: Triggers panel generation. Body: `{ "count_per_persona": 10 }`.
  - `GET /api/projects/{project_id}/respondents`: Retrieves all generated respondents for a project.
- **Rationale**: Straightforward integration for frontend client.

### 4. UI Dashboard & Warning Labels
- **Choice**: Add a new "Synthetic Respondents" sub-page or tab to the project workspace.
- **Details**:
  - A dashboard listing the personas and showing their current generated respondent count.
  - "Generate Respondent Panel" button with interactive loading state.
  - A details table displaying respondents with columns for Name, Parent Persona, Age, Location, Budget, Tech Savviness, and Risk Attitude.
  - Glassmorphic CSS style consistent with Phase 1 design system.
  - Highly visible notice: "Simulated Panel: Generated respondents are synthetic representations of market personas. Validate findings with real human research before making final business decisions."
- **Rationale**: Provides clear validation warnings (Constraint 11) while ensuring premium, interactive UX.

## Risks / Trade-offs

- **[Risk]** API call timeout/failures when generating large batches of respondents (e.g. N = 30).
  - *Mitigation*: Generate respondents in a single LLM API call per project/persona using a compact structured output schema, or fall back to high-quality mock data generator if API call fails.
- **[Risk]** LLM output format inconsistency.
  - *Mitigation*: Use Pydantic models with validation to parse the LLM JSON response. Implement clean error handling that falls back to structured templates if parsing fails.
