# OpenSpec Workflow

## Applicability

Read this document when proposing, applying, syncing, reviewing, or archiving OpenSpec changes.

## Source of Truth

OpenSpec is the planning source of truth for non-trivial product changes.

- Source: project workflow and `.codex/skills/openspec-*`.
- Applies when: a task changes behavior, schemas, APIs, UI flows, or phase scope.
- Expires when: OpenSpec is removed from this repo.

## Change Reading Order

Read active change artifacts in this order when present: `proposal.md`, `design.md`, `specs/**/spec.md`, then `tasks.md`.

- Source: OpenSpec artifact dependency order.
- Applies when: implementing or reviewing a scoped change.
- Expires when: the active schema changes artifact order.

## Implementation Scope

Implementation must stay aligned with the active OpenSpec requirements and checklist.

- Source: OpenSpec specs and tasks.
- Applies when: coding, testing, or reviewing a change.
- Expires when: the change is archived.

## Spec Requirements

Every OpenSpec requirement must be testable and include scenarios using `#### Scenario`.

- Source: OpenSpec spec instructions.
- Applies when: creating or editing `openspec/changes/*/specs/**/*.md`.
- Expires when: OpenSpec changes its spec format.

## Phase 1 Active Change

The current Phase 1 change is:

```text
openspec/changes/implement-poc-foundation/
```

- Source: current repository state.
- Applies when: implementing PoC foundation work.
- Expires when: this change is archived.

## Archive Destination

Archive completed changes only under:

```text
/openspec/archive
```

- Source: user instruction on 2026-06-23.
- Applies when: archiving any completed OpenSpec change.
- Expires when: an explicit repo-level decision changes the archive path.

## Archive Safety

Do not manually move active changes into another archive directory.

- Source: user instruction on 2026-06-23 and OpenSpec workflow.
- Applies when: cleaning up or finalizing planning artifacts.
- Expires when: OpenSpec tooling owns archive location automatically and verifies it.

## Sync Rule

Sync or archive specs only after implementation and verification match the accepted behavior.

- Source: OpenSpec archive/sync workflow.
- Applies when: turning delta specs into main specs.
- Expires when: a different spec lifecycle is adopted.
