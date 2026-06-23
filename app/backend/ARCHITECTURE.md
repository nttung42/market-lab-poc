# Backend Architecture

## Applicability

Read this document when changing backend schemas, APIs, persistence, seeds, AI calls, response parsing, aggregation, or report data.

## Responsibility

The backend owns data models, persistence, validation, API contracts, AI orchestration, result aggregation, and report data preparation.

- Source: `docs/start/tech-stack.md` and Phase 1 OpenSpec design.
- Applies when: working under `app/backend`.
- Expires when: backend ownership is redesigned.

## Phase 1 Responsibility

Phase 1 backend work includes Project and Persona schemas, deterministic seed data, read APIs, and required-field validation.

- Source: `openspec/changes/implement-poc-foundation/`.
- Applies when: implementing PoC foundation.
- Expires when: Phase 1 is archived.

## Boundary Rules

- Backend owns database access, validation, API contracts, AI provider credentials, AI requests, structured AI parsing, and partial result persistence.
- Backend does not own browser rendering, frontend route state, or UI styling.

- Source: service split in `docs/start/tech-stack.md`.
- Applies when: deciding where code belongs.
- Expires when: service boundaries are redesigned.

## Phase 1 API Interface

Planned Phase 1 endpoints:

```text
GET /api/projects
GET /api/projects/{project_id}
GET /api/projects/{project_id}/personas
GET /api/personas/{persona_id}
```

- Source: Phase 1 OpenSpec design.
- Applies when: implementing project and persona retrieval.
- Expires when: API routes are generated from code and this doc is updated.

## Later API Interface

Expected later endpoints:

```text
POST /api/projects/{project_id}/respondents/generate
GET /api/projects/{project_id}/respondents
POST /api/studies
GET /api/studies/{study_id}
POST /api/studies/{study_id}/run
GET /api/studies/{study_id}/results
GET /api/studies/{study_id}/report
```

- Source: `docs/start/README.md` and `docs/start/tasks.md`.
- Applies when: implementing Phases 2-6.
- Expires when: later OpenSpec changes define final endpoint names.

## Persistence

Use SQLite for local/demo persistence. Phase 1 needs `projects` and `personas`; later phases add `respondents`, `studies`, `responses`, and report views or records.

- Source: `docs/start/tech-stack.md`.
- Applies when: creating storage and seed logic.
- Expires when: a production database is approved.

## Project Contract

Project records must include stable ID, name, product description, industry, market, target audience, research objective, intended study type, and seed metadata.

- Source: Phase 1 OpenSpec `sample-project-workspace`.
- Applies when: defining schemas, seeds, and API responses.
- Expires when: the project spec is modified.

## Persona Contract

Persona records must include stable ID, project ID, name, segment label, quote, demographics, goals, pain points, motivations, buying behavior, decision rules, objections, channel preferences, assumptions, and confidence score.

- Source: Phase 1 OpenSpec `sample-persona-catalog`.
- Applies when: defining schemas, seeds, and API responses.
- Expires when: the persona spec is modified.

## Backend Hard Rules

- Do not store core entities only as long prompt text.
- Seed data must be idempotent.
- Unknown resource IDs must return safe not-found responses.
- AI calls must be backend-side only.
- Save raw and parsed AI output when AI execution is added.
- Preserve partial completed responses during batch study runs.

- Source: Phase 1 OpenSpec, `docs/start/README.md`, and `docs/start/tech-stack.md`.
- Applies when: implementing backend behavior.
- Expires when: superseding specs replace these rules.
