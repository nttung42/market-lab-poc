## Why

The current Market Lab application only displays a single hardcoded project and lacks support for managing multiple workspaces. To achieve the complete end-to-end user journey defined in the SRS (`docs/start/srs-overview.md`), the application requires a central project dashboard on the Overview screen, support for project creation (initialization module), and full CRUD (Create, Read, Update, Delete) capabilities for projects, personas, and studies on both the frontend and backend.

## What Changes

- **Project Dashboard & Selection**: Convert the Overview page into a project dashboard that lists all projects. Selecting a project activates it as the workspace context.
- **Project Creation (Initialization)**: Add a form/modal on the Overview page to initialize a new project with Name, Product Description, Industry, Market, Target Audience, Research Objective, and Study Type.
- **Project Edit & Delete**: Support editing and deleting projects from the Overview page.
- **Persona CRUD (Persona Studio)**: Update the Persona Catalog screen to allow manual creation, editing, and deletion of personas.
- **Study CRUD (Study Builder)**: Allow editing and deleting studies from the Study Builder screen.
- **State Navigation Guard**: Disable the navigation links (PERSONAS, RESPONDENTS, STUDY BUILDER, DASHBOARD, REPORTS) in the application header if no active project is selected, prompting the user to select or create a project first.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `sample-project-workspace`: Update to support multiple projects (dashboard view), project initialization (creation), editing/updating project metadata, deleting projects, selecting the active project, and guarding other views until a project is active. Also add study CRUD (edit/delete) in the study builder.
- `sample-persona-catalog`: Update to support manual creation, editing, and deletion of personas (full CRUD).

## Impact

- **Backend**: Update `routers.py` and `schemas.py` to add endpoints for project creation, updating, and deletion; persona creation, updating, and deletion; study updating and deletion. Update database models cascade deletion behaviors to ensure clean SQLite deletes. Update `study_results` API to handle custom user-created personas dynamically rather than using hardcoded theme keys.
- **Frontend**: Update `client.ts` with the new CRUD API calls. Update `App.tsx` to handle `activeProjectId` and `selectedStudyId` statefully, disabling navigation if no project is active. Redesign `ProjectOverview.tsx` to serve as both the Project List Dashboard and the detailed Project Workspace. Redesign `PersonaCatalog.tsx` to support manual persona CRUD. Redesign `StudyBuilder.tsx` to support study CRUD.
