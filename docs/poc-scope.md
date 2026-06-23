# PoC Scope

## Applicability

Read this document when changing the product flow, demo scenario, acceptance criteria, phase boundaries, or feature scope.

## Product Goal

Market Lab PoC helps product and marketing teams compare early messages using synthetic personas before spending time with real respondents.

- Source: `docs/start/README.md`.
- Applies when: describing or changing the PoC value proposition.
- Expires when: the PoC is replaced by a production product brief.

## Demo Flow

The intended flow is:

```text
Project
-> Personas
-> Synthetic respondents
-> Concept/message test
-> Simulated responses
-> Insight dashboard
-> Report
```

- Source: `docs/start/README.md`.
- Applies when: adding routes, APIs, or tasks to the end-to-end flow.
- Expires when: a later roadmap changes the canonical flow.

## Demo Scenario

Use an English learning app for Vietnamese university students as the default scenario.

- Source: `docs/start/README.md`.
- Applies when: seeding data or preparing the demo.
- Expires when: the team approves a different demo scenario.

## Minimum Demo Success

The demo is successful when a user can open a sample project, view 3 personas, generate synthetic respondents, enter at least 2 concepts, run a study, view results, and read a recommendation report.

- Source: `docs/start/README.md`.
- Applies when: evaluating end-to-end readiness.
- Expires when: acceptance criteria are replaced.

## In Scope

- Simple project workspace.
- Three structured sample personas.
- Synthetic respondent generation.
- Fixed concept/message test.
- Basic AI-powered study execution.
- Quantitative and qualitative summaries.
- Segment comparison.
- Simple report page.
- Synthetic research disclaimer.

- Source: `docs/start/README.md`.
- Applies when: deciding whether a PoC feature belongs in the roadmap.
- Expires when: a new scope document supersedes `docs/start/README.md`.

## Out of Scope

- Full auth and team permissions.
- Uploads to generate personas.
- CRM, social, analytics, or public data integrations.
- Flexible survey builder.
- Human respondent validation.
- Advanced statistical testing.
- Payment or subscription.
- Production PDF export.
- Advanced research methods such as MaxDiff, Kano, or focus groups.

- Source: `docs/start/README.md`.
- Applies when: rejecting or deferring feature requests.
- Expires when: an OpenSpec change explicitly moves one of these items in scope.

## Phase 1 Boundary

Phase 1 only covers foundation and sample data: project schema, persona schema, seeded project, seeded personas, project overview screen, and persona cards.

- Source: `docs/start/tasks.md` and `openspec/changes/implement-poc-foundation/`.
- Applies when: implementing or reviewing Phase 1.
- Expires when: Phase 1 is archived and the next active change takes over.
