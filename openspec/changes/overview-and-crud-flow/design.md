## Context

The current Market Lab codebase has static and hardcoded elements that prevent users from managing multiple projects, custom personas, or custom studies. To complete the normal flow outlined in `docs/start/srs-overview.md`, we need to implement full CRUD (Create, Read, Update, Delete) capabilities across the application stack.

## Goals / Non-Goals

**Goals:**
- Implement backend API routes for creating, updating, and deleting projects, personas, and studies.
- Implement frontend API clients for these CRUD actions.
- Redesign `App.tsx` and header navigation to support stateful project switching and disable deep links if no project is active.
- Redesign `ProjectOverview.tsx` to display all projects, initialize new projects (with form validation), and display active project details with edit/delete actions.
- Redesign `PersonaCatalog.tsx` to allow manual creation, editing, and deletion of custom personas.
- Redesign `StudyBuilder.tsx` to support editing study titles and deleting studies.
- Ensure the backend dynamically maps qualitative results for custom, user-created personas.

**Non-Goals:**
- Adding authentication, user accounts, or team permissions.
- Storing files in external cloud storage (keep SQLite database as the local PoC store).

## Decisions

### 1. Backend Route Specifications
We will add standard RESTful endpoints to `routers.py`:
- `POST /projects` (Body: `schemas.ProjectBase`)
- `PUT /projects/{project_id}` (Body: `schemas.ProjectBase`)
- `DELETE /projects/{project_id}`
- `POST /projects/{project_id}/personas` (Body: `schemas.PersonaBase`)
- `PUT /personas/{persona_id}` (Body: `schemas.PersonaBase`)
- `DELETE /personas/{persona_id}`
- `PUT /studies/{study_id}` (Body: `schemas.StudyBase`)
- `DELETE /studies/{study_id}`

### 2. SQLite Cascading Deletion
We will leverage SQLAlchemy's built-in relationship cascading. `Project` has cascade properties for `personas`, `respondents`, and `studies`. To prevent SQLite foreign-key orphan exceptions for `Response` which references `Respondent` and `Question`, we will rely on SQLAlchemy's cascade delete orphan tracking, ensuring deleting a project or study cleans up all downstream responses automatically.

### 3. Dynamic Qualitative Themes for Custom Personas
Instead of relying on hardcoded theme keys matching seeded personas, the `get_study_results` endpoint in the backend will dynamically generate theme blocks for unrecognized personas:
- **Theme Title**: `{Persona.name} ({Persona.segment}) Objections & Feedback`
- **Description**: Summary compiled from the persona's motivation and buying behavior.
- **Objections**: Extracted directly from the persona's structured `objections` array.
- **Quotes**: Sampled from respondent answers if the simulation has run, otherwise fallback to a mock quote synthesized from the persona segment.

### 4. Stateful Project Navigation & Guards
- `App.tsx` will track `activeProjectId` as a state variable initialized to `null`.
- On load, it will fetch available projects. If any exist, it will default to the first project's ID to keep the demo instant and functional.
- The header navigation links will be disabled if `activeProjectId` is `null`.

## Risks / Trade-offs

- **[Risk]**: Deleting a project deletes everything, which could lead to accidental data loss.
  - **[Mitigation]**: Implement clear "Are you sure?" confirmation alerts on the frontend before triggering delete APIs.
- **[Risk]**: Custom personas might not have all list fields filled out, causing backend ValidationErrors.
  - **[Mitigation]**: Ensure both frontend forms and backend schemas define empty list defaults (`[]`) for list-like fields rather than requiring non-empty arrays.
