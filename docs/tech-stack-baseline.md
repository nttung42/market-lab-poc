# Tech Stack Baseline

## Applicability

Read this document when adding dependencies, choosing runtimes, changing build tooling, or introducing infrastructure.

## Version Policy

Use these versions as the PoC baseline unless implementation proves an incompatibility.

- Source: package registry and official docs check on 2026-06-23.
- Applies when: creating package manifests, lockfiles, Docker images, or setup scripts.
- Expires when: dependencies are pinned in code and this document is updated to match.

## Frontend Baseline

- Node.js: 22.12+ or any version satisfying Vite 8 requirements.
- React: 19.2.x.
- TypeScript: 6.0.x.
- Vite: 8.0.x.
- Tailwind CSS: 4.3.x.
- shadcn/ui: shadcn CLI v4.
- Recharts: 3.8.x.

- Source: `docs/start/tech-stack.md`, npm registry, Vite docs, shadcn docs.
- Applies when: working under `app/frontend`.
- Expires when: frontend package files pin a different approved baseline.

## Backend Baseline

- Python: 3.14.x for new environments unless a dependency forces a documented downgrade.
- FastAPI: 0.138.x.
- Pydantic: 2.13.x.
- SQLModel: 0.0.38, or SQLAlchemy if implementation needs lower-level control.
- Database: SQLite for the PoC.
- AI provider: OpenRouter or OpenAI API from backend only.

- Source: `docs/start/tech-stack.md`, PyPI, Python downloads.
- Applies when: working under `app/backend`.
- Expires when: backend dependency files pin a different approved baseline.

## Infrastructure Rule

Prefer local/demo infrastructure over production infrastructure during the PoC.

- Source: `docs/start/tech-stack.md`.
- Applies when: choosing database, queues, deployment, and export tooling.
- Expires when: production planning starts.

## Database Rule

Use SQLite for the PoC; defer Supabase/PostgreSQL unless shared deployed data or auth becomes necessary.

- Source: `docs/start/tech-stack.md`.
- Applies when: implementing persistence or migrations.
- Expires when: an OpenSpec change approves a production database.

## Background Jobs Rule

Use simple async execution or FastAPI background tasks for PoC study runs; do not add Celery, Redis Queue, or distributed workers yet.

- Source: `docs/start/tech-stack.md`.
- Applies when: implementing study execution.
- Expires when: workload requirements exceed PoC scale.

## Export Rule

Prefer an HTML report page and optional Markdown/CSV export; avoid production-grade PDF export.

- Source: `docs/start/tech-stack.md`.
- Applies when: implementing reports or exports.
- Expires when: export quality becomes a product requirement.
