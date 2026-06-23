## ADDED Requirements

### Requirement: State Navigation Guard
The system SHALL guard access to all detail-level navigation views (Personas, Respondents, Study Builder, Dashboard, Reports) based on whether an active project is selected.

If no project is active, the system SHALL disable these navigation views and prompt the user to select or create a project on the Overview page.

#### Scenario: Navigation is guarded when no project is active
- **WHEN** the application is loaded with no active project selected
- **THEN** navigation links for Personas, Respondents, Study Builder, Dashboard, and Reports are disabled in the header
- **AND** the Overview page instructs the user to select or create a project

#### Scenario: Navigation is enabled when project is active
- **WHEN** the user selects or creates a project
- **THEN** the navigation links for Personas, Respondents, Study Builder, Dashboard, and Reports become active and accessible

### Requirement: Study CRUD API and interface
The system SHALL expose API endpoints and UI controls to update and delete studies in the study builder.

#### Scenario: Delete a study
- **WHEN** the user deletes a study from the study builder screen
- **THEN** the frontend deletes the study and its associated survey responses from the database via the API
- **AND** the UI updates to show the next available study or empty state

## MODIFIED Requirements

### Requirement: Project CRUD API
The system SHALL support creating, reading, updating, and deleting projects through backend APIs.

The system SHALL expose:
- `POST /api/projects`: Create a new project, generating a unique ID and created timestamp.
- `PUT /api/projects/{project_id}`: Update project details.
- `DELETE /api/projects/{project_id}`: Delete a project, cascading delete to its associated personas, respondents, studies, and responses.

#### Scenario: List projects
- **WHEN** the frontend requests available projects
- **THEN** the system returns a list of all projects with their details

#### Scenario: Get project detail
- **WHEN** the frontend requests a project by identifier
- **THEN** the system returns the full structured project record

#### Scenario: Create a new project
- **WHEN** the user submits a new project form with valid fields
- **THEN** the system creates the project, stores it in SQLite, and returns the created record

#### Scenario: Update project details
- **WHEN** the user saves changes to an existing project's metadata
- **THEN** the system updates the record in SQLite and returns the updated project details

#### Scenario: Delete a project
- **WHEN** the user requests deletion of a project
- **THEN** the system deletes the project and all related personas, respondents, studies, and responses from the database

#### Scenario: Unknown project
- **WHEN** the frontend requests a project identifier that does not exist
- **THEN** the system returns a not-found state (404)

### Requirement: Project overview screen
The system SHALL provide a project overview screen that serves as a central project manager.

The screen SHALL display:
1. A list of all available projects, with actions to select, edit, or delete them.
2. A Project Initialization module (form) to create a new project.
3. Once a project is selected, the detailed metadata (Name, Description, Industry, Market, Target Audience, Research Objective, Study Type) of that active project, and a clear button to switch back to the project list or select a different project.

#### Scenario: User opens project overview
- **WHEN** the user navigates to the Overview page
- **THEN** the user sees a list of available projects and a form/button to create a new project

#### Scenario: User selects a project
- **WHEN** the user selects a project from the list
- **THEN** the project is marked active in the workspace
- **AND** the screen displays the detailed workspace details of the selected project
