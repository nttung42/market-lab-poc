## Why

The PoC needs a reliable foundation before synthetic respondents, study execution, dashboards, or reports can be implemented. Phase 1 establishes the demo scenario, structured sample data, and first user-facing screens so stakeholders can open the product and immediately understand the research context and target personas without touching code or the database.

## What Changes

- Add a seeded sample project for the recommended demo scenario: an English learning app for Vietnamese university students.
- Define the minimum project data model needed for PoC setup and later study creation.
- Add three structured sample personas aligned with the demo audience:
  - Price-sensitive student
  - Career-focused student
  - Casual learner
- Define the persona data contract with goals, pain points, objections, decision rules, confidence, and assumption labels.
- Build a project overview screen where users can view product, market, target audience, and research objective.
- Build a persona list/card screen where users can inspect the three personas.
- Persist foundation sample data in structured storage rather than only as prompts or static prose.
- Include clear synthetic-research positioning where the UI presents personas as assumptions for PoC research, not validated human evidence.

## Capabilities

### New Capabilities

- `sample-project-workspace`: Defines and exposes the PoC sample project, including structured project fields, seed data, retrieval behavior, and the project overview screen.
- `sample-persona-catalog`: Defines and exposes structured sample personas, including persona schema, seed data, retrieval behavior, and persona list/card presentation.

### Modified Capabilities

None. No existing OpenSpec capabilities are present in this repository.

## Impact

- Frontend: add initial routing/views for the project overview and persona catalog.
- Backend: add project and persona schemas/models, seed data, and read APIs for Phase 1.
- Database/storage: introduce structured persistence for sample project and persona records, expected to use SQLite for the PoC.
- Test/demo data: add deterministic seed content for the English learning app scenario.
- Future phases: respondent generation, concept test creation, and reporting will depend on these project and persona contracts.
