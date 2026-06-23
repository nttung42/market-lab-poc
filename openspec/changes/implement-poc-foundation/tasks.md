## 1. Project Structure and Setup

- [x] 1.1 Inspect the repository and create the Phase 1 app structure for backend and frontend according to the chosen PoC stack.
- [x] 1.2 Add backend dependencies for FastAPI, Pydantic, SQLite persistence, and local development if they are not already present.
- [x] 1.3 Add frontend dependencies for React, TypeScript, Vite, Tailwind CSS, and UI primitives if they are not already present.
- [x] 1.4 Add local development commands or documentation so the backend and frontend can be started consistently.

## 2. Backend Schemas and Persistence

- [x] 2.1 Define the Project schema/model with required fields for name, product description, industry, market, target audience, research objective, study type, and seed metadata.
- [x] 2.2 Define the Persona schema/model with required fields for stable ID, project ID, name, segment, quote, demographics, goals, pain points, motivations, buying behavior, decision rules, objections, channels, assumptions, and confidence score.
- [x] 2.3 Configure SQLite storage or an equivalent local structured persistence layer for project and persona records.
- [x] 2.4 Add validation so required project and persona fields cannot be exposed as incomplete records.

## 3. Seed Data

- [x] 3.1 Create deterministic seed data for the English learning app sample project.
- [x] 3.2 Create structured seed data for the Price-sensitive student persona with distinct goals, pain points, objections, decision rules, assumptions, and confidence score.
- [x] 3.3 Create structured seed data for the Career-focused student persona with distinct goals, pain points, objections, decision rules, assumptions, and confidence score.
- [x] 3.4 Create structured seed data for the Casual learner persona with distinct goals, pain points, objections, decision rules, assumptions, and confidence score.
- [x] 3.5 Implement idempotent seeding so repeated startup or seed runs do not duplicate the sample project or personas.

## 4. Read APIs

- [x] 4.1 Implement project list retrieval for the seeded sample project.
- [x] 4.2 Implement project detail retrieval by project identifier, including not-found behavior.
- [x] 4.3 Implement persona list retrieval by project identifier, including unknown-project behavior.
- [x] 4.4 Implement persona detail retrieval by persona identifier, including not-found behavior.
- [x] 4.5 Add backend tests or API smoke checks for project retrieval, persona retrieval, idempotent seeding, and required-field validation.

## 5. Frontend Data Access and Types

- [ ] 5.1 Define TypeScript types that mirror the Project and Persona response shapes.
- [ ] 5.2 Add frontend API client functions or data hooks for project list, project detail, project personas, and persona detail.
- [ ] 5.3 Add loading, empty, and not-found states for project and persona data access.

## 6. Project Overview UI

- [ ] 6.1 Build the project overview route as the first usable screen of the PoC.
- [ ] 6.2 Display project name, product description, industry, market, target audience, research objective, and intended study type.
- [ ] 6.3 Add a visible navigation action from project overview to the persona catalog.
- [ ] 6.4 Add a synthetic research limitation note on the project overview screen.
- [ ] 6.5 Verify the overview screen works without manual database edits or code changes after setup.

## 7. Persona Catalog UI

- [ ] 7.1 Build the persona catalog route for the sample project.
- [ ] 7.2 Display exactly three persona cards for the seeded personas.
- [ ] 7.3 Show each persona's name, segment label, short quote, demographics summary, goals, pain points, objections, decision rules, assumptions, and confidence score.
- [ ] 7.4 Add a visible synthetic persona limitation note to the persona catalog.
- [ ] 7.5 Verify persona cards remain readable on common desktop and mobile viewport widths.

## 8. Phase 1 Verification

- [ ] 8.1 Run backend tests or smoke checks and confirm project/persona APIs return structured data.
- [ ] 8.2 Run frontend checks and confirm the project overview and persona catalog render successfully.
- [ ] 8.3 Manually verify Phase 1 acceptance criteria from `docs/start/tasks.md`.
- [ ] 8.4 Document any known gaps that belong to later phases, especially respondent generation, study creation, AI execution, dashboard, and report behavior.
