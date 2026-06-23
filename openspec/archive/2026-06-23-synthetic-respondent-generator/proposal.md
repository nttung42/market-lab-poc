## Why

To test product messages and concepts effectively, we need a panel of diverse, granular respondents that reflect the characteristics of our parent personas while incorporating realistic individual variation (such as age, budget, tech savviness, and risk attitude). Generating these synthetic respondents dynamically allows simulated concept testing before human validation.

## What Changes

- Add a structured data schema for synthetic respondents.
- Implement respondent generation logic in the backend utilizing an LLM to generate diverse respondents from a parent persona.
- Define specific variation attributes (age, location, budget, motivation, tech savviness, risk attitude, channel preference).
- Create backend API endpoints to trigger respondent generation, list/retrieve respondents, and persist them to the database.
- Build frontend UI components allowing users to generate a panel of N respondents per persona, view the generated respondents in a list or table format, and inspect their variation attributes.
- Persist synthetic respondents to database, ensuring they survive browser reloads or workspace reopen.
- Explicitly label all generated respondent profiles and synthetic outputs as simulated data requiring human validation.

## Capabilities

### New Capabilities

- `synthetic-respondents`: Defines the structured schema, LLM generation prompt, DB persistence, API, and UI for managing synthetic respondents derived from personas.

### Modified Capabilities

<!-- None -->

## Impact

- **Backend**:
  - Database schema: New `respondents` table linked to `personas` (or `projects`).
  - Schema definitions: `Respondent` and related Pydantic models.
  - Service: `respondent_generator` service calling the LLM API to generate N distinct respondents based on a persona's profile with controlled variation rules.
  - Router: New endpoints `/api/projects/{project_id}/respondents/generate` and `/api/projects/{project_id}/respondents`.
  - Tests: Backend unit tests for the generation logic, model fields, and router endpoints.
- **Frontend**:
  - API Client: Update to add calls for generating and fetching respondents.
  - Components: Respondent card, respondent list table, and generate action controls.
  - Page: Integrated respondent management section in the project/persona views.
