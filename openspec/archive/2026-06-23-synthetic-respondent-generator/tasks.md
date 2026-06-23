## 1. Database Schema and Pydantic Models

- [x] 1.1 Add SQLAlchemy model for Respondent in `app/backend/app/models/models.py` with foreign key links to `projects` and `personas`.
- [x] 1.2 Add Pydantic schemas (`RespondentBase`, `RespondentCreate`, `Respondent`) in `app/backend/app/schemas/schemas.py`.

## 2. Respondent Generation Logic

- [x] 2.1 Create `app/backend/app/services/respondent_generator.py` and implement LLM prompt construction and schema parsing using standard environment API key.
- [x] 2.2 Add robust mock respondent fallback logic in the generator service for offline mode when no API keys are present.
- [x] 2.3 Write backend unit tests in `app/backend/app/tests/test_generator.py` to verify the generation service under various mock scenarios.

## 3. Backend Router Endpoints

- [x] 3.1 Implement `POST /api/projects/{project_id}/respondents/generate` to generate a respondent panel for a project.
- [x] 3.2 Implement `GET /api/projects/{project_id}/respondents` to list all respondents generated for a project.
- [x] 3.3 Write backend unit tests in `app/backend/app/tests/test_routers.py` (or extending existing test suite) to verify respondent router endpoints.

## 4. Frontend Types and API Client

- [x] 4.1 Update `app/frontend/src/types/index.ts` to include the `Respondent` model interface.
- [x] 4.2 Add `generateRespondents` and `getProjectRespondents` methods to `app/frontend/src/api/client.ts`.

## 5. Frontend UI Components and Views

- [x] 5.1 Create a new page or tab inside the project workspace for "Synthetic Respondents" (e.g. `app/frontend/src/pages/RespondentsDashboard.tsx`).
- [x] 5.2 Implement a panel generator action widget with a loading state spinner.
- [x] 5.3 Implement a responsive data table to display and filter generated respondents, listing parent persona, age, location, and key behavioral parameters.
- [x] 5.4 Add a highly visible synthetic warning notice reminding users that this simulated data requires human validation.
- [x] 5.5 Connect navigation routes in `app/frontend/src/App.tsx` to include the new respondents view.

## 6. End-to-End Verification

- [x] 6.1 Run full suite of frontend and backend tests to confirm everything builds and passes cleanly.
- [x] 6.2 Perform manual end-to-end testing of the generation flow and verify that respondents successfully persist in the SQLite database across refreshes.
