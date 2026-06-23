# Frontend Architecture

## Applicability

Read this document when changing routes, UI state, API clients, project overview, persona catalog, charts, report display, or frontend data contracts.

Read `app/frontend/DESIGN_SYSTEM.md` before changing frontend visual styling, layout, components, or charts.

## Responsibility

The frontend owns browser routes, UI layout, interaction states, typed backend API consumption, charts, reports, and loading/error/not-found states.

- Source: `docs/start/tech-stack.md` and Phase 1 OpenSpec design.
- Applies when: working under `app/frontend`.
- Expires when: frontend ownership is redesigned.

## Phase 1 Responsibility

Phase 1 frontend work opens directly into a project overview, displays the seeded project, displays three persona cards, and labels persona assumptions as synthetic.

- Source: `openspec/changes/implement-poc-foundation/`.
- Applies when: implementing PoC foundation UI.
- Expires when: Phase 1 is archived.

## Boundary Rules

- Frontend owns browser routing, UI components, UI state, API client functions, TypeScript response types, charts, and presentation.
- Frontend does not own SQLite access, AI provider credentials, direct OpenRouter/OpenAI calls, or long-running study execution.

- Source: service split in `docs/start/tech-stack.md`.
- Applies when: deciding where code belongs.
- Expires when: service boundaries are redesigned.

## Phase 1 API Consumption

Use typed API client functions or hooks for:

```text
GET /api/projects
GET /api/projects/{project_id}
GET /api/projects/{project_id}/personas
GET /api/personas/{persona_id}
```

- Source: Phase 1 OpenSpec design.
- Applies when: rendering project and persona data.
- Expires when: generated clients or final API contracts replace these routes.

## Planned Routes

Phase 1 routes:

```text
/                           Project overview
/projects/:projectId         Project overview
/projects/:projectId/personas
/personas/:personaId
```

Later routes:

```text
/projects/:projectId/respondents
/studies/new
/studies/:studyId
/studies/:studyId/results
/studies/:studyId/report
```

- Source: PoC flow and Phase 1 design.
- Applies when: adding navigation.
- Expires when: routing is implemented and this doc is updated from code.

## Project Overview Contract

Project overview must show project name, product description, industry, market, target audience, research objective, intended study type, persona navigation, and synthetic research limitation note.

- Source: Phase 1 OpenSpec `sample-project-workspace`.
- Applies when: building or reviewing the overview screen.
- Expires when: the project workspace spec changes.

## Persona Catalog Contract

Persona catalog must show exactly three seeded personas in Phase 1, including name, segment, quote, demographics, goals, pain points, objections, decision rules, assumptions, confidence score, and limitation note.

- Source: Phase 1 OpenSpec `sample-persona-catalog`.
- Applies when: building or reviewing persona cards.
- Expires when: the persona catalog spec changes.

## Frontend Hard Rules

- Do not build a marketing landing page as the primary PoC screen.
- Do not call AI providers from the browser.
- Do not store provider secrets in frontend files.
- Do not use frontend-only fixtures as the final source of truth when backend APIs exist.
- Keep UI aligned with backend structured fields.
- Clearly label synthetic personas and insights as requiring human validation.
- Keep product UI dense, scannable, and usable on desktop and mobile.

- Source: `docs/start/README.md`, `docs/start/tech-stack.md`, and Phase 1 OpenSpec.
- Applies when: implementing frontend behavior.
- Expires when: superseding specs replace these rules.
