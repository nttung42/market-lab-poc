# AGENTS.md

## Project Overview

Market Lab PoC is a synthetic concept/message testing app for comparing 2-3 product messages against structured personas before human validation. The demo flow runs from project and personas to synthetic respondents, study execution, insight dashboard, and report.

## Quick Start

- Install: `make setup`
- Test: `make test`
- Full verification: `make check`

## Hard Constraints

1. Keep this file routing-oriented and between 50-200 lines.
   Source: user instruction on 2026-06-23.
   Applies: every edit to `AGENTS.md`.
   Expires: when the project adopts a different agent instruction standard.
2. Use OpenSpec as the source of truth for non-trivial product changes.
   Source: project OpenSpec workflow.
   Applies: before implementation or archive work.
   Expires: when OpenSpec is removed from the repo.
3. Read the active change under `openspec/changes/<change-name>/` before implementing scoped work.
   Source: OpenSpec artifacts.
   Applies: when a change exists for the request.
   Expires: when the change is archived.
4. Archive completed OpenSpec changes only under `/openspec/archive`.
   Source: user instruction on 2026-06-23.
   Applies: every archive operation.
   Expires: when an explicit repo-level decision changes the archive path.
5. Keep PoC work within the active phase unless the user explicitly expands scope.
   Source: `docs/start/tasks.md`.
   Applies: all implementation tasks.
   Expires: after the PoC roadmap is replaced.
6. Do not add auth, payment, external data integrations, advanced stats, human validation, or production PDF export without an OpenSpec change.
   Source: `docs/start/README.md`.
   Applies: feature planning and implementation.
   Expires: when those areas become in scope.
7. Backend owns persistence, validation, APIs, AI provider calls, and secrets.
   Source: `app/backend/ARCHITECTURE.md`.
   Applies: backend and integration work.
   Expires: when backend boundaries are redesigned.
8. Frontend must not store provider secrets or call OpenRouter/OpenAI directly.
   Source: `app/frontend/ARCHITECTURE.md`.
   Applies: frontend and AI integration work.
   Expires: when a secure browser-side provider strategy is approved.
9. Store core entities as structured fields, not only as prompts or prose.
   Source: Phase 1 OpenSpec specs.
   Applies: projects, personas, respondents, studies, responses, reports.
   Expires: never for core entities.
10. Preserve stable identifiers for core entities.
    Source: Phase 1 OpenSpec specs.
    Applies: schema, seed, API, and UI work.
    Expires: never for persisted records.
11. Clearly label synthetic outputs as assumptions or simulated research requiring human validation.
    Source: `docs/start/README.md`.
    Applies: UI, API payloads, reports, and exports.
    Expires: when real-human validation replaces synthetic output.
12. Prefer simple local/demo infrastructure over production infrastructure during the PoC.
    Source: `docs/start/tech-stack.md`.
    Applies: PoC engineering choices.
    Expires: when the PoC graduates to production planning.

## Topic Docs

- PoC Scope (`docs/poc-scope.md`) - Read when changing product flow, acceptance criteria, or in/out-of-scope behavior.
- Tech Stack Baseline (`docs/tech-stack-baseline.md`) - Read when adding dependencies, runtimes, build tooling, or infrastructure.
- OpenSpec Workflow (`docs/openspec-workflow.md`) - Read when proposing, applying, syncing, or archiving OpenSpec changes.
- Backend Architecture (`app/backend/ARCHITECTURE.md`) - Read when changing backend schemas, APIs, persistence, AI calls, or seeds.
- Frontend Architecture (`app/frontend/ARCHITECTURE.md`) - Read when changing routes, UI state, API clients, charts, or frontend data display.
