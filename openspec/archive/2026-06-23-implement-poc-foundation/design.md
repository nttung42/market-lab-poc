## Context

Phase 1 is the foundation for the two-week Synthetic Concept / Message Test PoC. The repository currently has planning documents under `docs/start/` and an empty OpenSpec baseline, so this change defines the first executable product slice: a seeded sample project, three structured sample personas, and the screens/API contracts needed to inspect them.

The target demo scenario is an English learning app for Vietnamese university students. Later phases will generate synthetic respondents from the personas, run concept tests, aggregate insights, and produce a report. Those later phases depend on Phase 1 data being structured, stable, and easy to retrieve.

The recommended PoC stack is React + TypeScript + Vite, Tailwind CSS, FastAPI + Pydantic, SQLite, and an AI API in later phases. Phase 1 does not require AI calls, background jobs, authentication, or external integrations.

## Goals / Non-Goals

**Goals:**

- Establish a deterministic sample project for the PoC demo scenario.
- Define project and persona schemas that later phases can reference without rework.
- Seed three complete personas with explicit assumptions and confidence metadata.
- Provide read-only project overview and persona catalog screens.
- Store and serve data as structured records, not as a single prompt blob or markdown-only fixture.
- Make the UI clear that personas are synthetic assumptions for PoC exploration.

**Non-Goals:**

- No authentication, team permissions, or multi-tenant workspace behavior.
- No persona generation from uploads, CRM, analytics, social, or public data.
- No respondent generation, study creation, AI execution, dashboard, or report behavior.
- No persona editing workflow unless the implementation can add it without delaying Phase 1 acceptance.
- No production-grade migration framework beyond a simple local/demo SQLite setup.

## Decisions

### Use deterministic seed data for the first project

The first project SHALL be seeded from code or a migration script so every local/demo environment starts from the same research context.

Alternatives considered:

- Static frontend-only JSON: fastest, but it prevents later backend phases from sharing the same source of truth.
- Manual database setup: flexible, but it violates the PoC requirement that the demo flow should not need database intervention.

Rationale: deterministic seed data gives the team a stable demo while keeping the storage shape close to later respondent and study phases.

### Store project and persona records as structured backend data

Project and persona records SHOULD be represented with typed schemas in the backend and matching TypeScript types in the frontend. Persona fields that contain multiple values, such as goals or objections, SHOULD be arrays rather than newline-delimited text.

Alternatives considered:

- Store personas as long prompts only: convenient for LLM prompting later, but weak for UI, validation, segment comparison, and respondent generation.
- Over-normalize each persona attribute into many relational tables: cleaner long term, but unnecessary for the PoC.

Rationale: typed structured data is enough for Phase 1 and directly supports Phase 2 respondent generation.

### Use read-only APIs for Phase 1 foundation data

Phase 1 SHOULD expose simple read APIs:

- `GET /api/projects`
- `GET /api/projects/{project_id}`
- `GET /api/projects/{project_id}/personas`
- `GET /api/personas/{persona_id}`

Write APIs can wait until a future phase unless the implementation needs them for seed tooling.

Alternatives considered:

- No backend API: simpler for the first screen, but it creates throwaway frontend fixtures.
- Full CRUD: useful later, but not required for the Phase 1 acceptance criteria.

Rationale: read APIs create the contract needed by the UI and later phases while keeping the first implementation small.

### Build the first UI as product screens, not a landing page

The app SHOULD open directly into the sample project overview and provide navigation to the persona catalog. The first viewport should show the project context, research objective, and a clear route to inspect personas.

Alternatives considered:

- Marketing-style landing page: visually broad, but it does not demonstrate the research workflow.
- Empty dashboard shell: leaves stakeholders without concrete demo content.

Rationale: Phase 1 success is about making the research context immediately inspectable.

### Represent confidence and assumptions explicitly

Each persona SHALL include a confidence score and assumption labels. The UI SHOULD display these fields so users understand the inputs are synthetic working assumptions.

Alternatives considered:

- Hide confidence metadata until reporting: less clutter, but weaker transparency.
- Use one global disclaimer only: simpler, but it does not show which persona details are assumption-based.

Rationale: transparent assumptions are central to trustworthy synthetic research positioning.

## Risks / Trade-offs

- Seed data becomes stale or too demo-specific -> Keep it in a dedicated seed module with clear IDs so it can be replaced later without changing API contracts.
- Frontend and backend types drift -> Define backend schemas first and mirror the same field names in TypeScript.
- Persona cards become too dense -> Use progressive layout: summary fields visible first, details grouped by goals, pain points, objections, and decision rules.
- SQLite setup slows early UI work -> Allow a simple seed-on-start path for local development while keeping records structured.
- Overbuilding Phase 1 delays later phases -> Keep screens read-only and avoid CRUD, auth, uploads, and AI calls.

## Migration Plan

1. Add backend schema/model definitions for project and persona records.
2. Add a seed script or startup seed routine for the sample project and personas.
3. Add read endpoints for project and persona data.
4. Add frontend routes/pages for project overview and persona catalog.
5. Verify the app can be opened in a clean environment and show the seeded project plus three personas.

Rollback for Phase 1 is low risk: remove the seeded data module, read endpoints, and frontend routes introduced by this change.

## Open Questions

- None blocking for Phase 1. Future phases can decide whether persona editing and multiple projects are needed after the end-to-end PoC is proven.
