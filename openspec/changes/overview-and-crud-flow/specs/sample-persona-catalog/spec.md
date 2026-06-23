## ADDED Requirements

### Requirement: Dynamic study results mapping
The system's study results generator SHALL dynamically handle custom, user-created personas.

When calculating qualitative themes and quotes for a study run:
1. If the persona belongs to the project but does not match a pre-coded theme key, the system SHALL dynamically construct a theme structure using the persona's name, segment, and objections defined in its profile.
2. The system SHALL sample actual open-text survey responses for quotes if available, or generate a segment-aligned mock quote fallback.

#### Scenario: Dynamic theme generated for custom persona
- **WHEN** study results are requested for a project with custom user-created personas
- **THEN** the qualitative themes array dynamically includes themed objections and quotes matching the custom persona name and segment

## MODIFIED Requirements

### Requirement: Persona CRUD API
The system SHALL support creating, reading, updating, and deleting personas through backend APIs.

The system SHALL expose:
- `POST /api/projects/{project_id}/personas`: Create a new persona.
- `PUT /api/personas/{persona_id}`: Update an existing persona.
- `DELETE /api/personas/{persona_id}`: Delete an existing persona.

#### Scenario: List personas for project
- **WHEN** the frontend requests personas for a project
- **THEN** the system returns all personas associated with that project in SQLite

#### Scenario: Create a new persona
- **WHEN** the user saves a new persona form for a project
- **THEN** the system stores the persona in SQLite and links it to the active project

#### Scenario: Update a persona
- **WHEN** the user saves changes to an existing persona's profile
- **THEN** the system updates the persona record in SQLite and returns the updated persona

#### Scenario: Delete a persona
- **WHEN** the user requests deletion of a persona
- **THEN** the system deletes the persona and any dependent synthetic respondents from SQLite

#### Scenario: No personas for unknown project
- **WHEN** the frontend requests personas for a project identifier that does not exist
- **THEN** the system returns a 404 error or empty list

### Requirement: Persona list and card screen
The system SHALL provide a persona catalog screen for the active project that supports full CRUD operations.

The screen SHALL display:
1. All personas linked to the project as cards.
2. A button to create a new persona, launching a form to fill out Name, Segment, Quote, Demographics, Goals, Pain Points, Motivations, Buying Behavior, Decision Rules, Objections, Channel Preferences, Assumptions, and Confidence Score.
3. Edit and Delete buttons on each persona card to modify or remove them.

#### Scenario: User opens persona catalog
- **WHEN** the user navigates to the Persona page
- **THEN** the user sees cards for all existing personas in the active project and a button to add a new persona

#### Scenario: User creates a custom persona
- **WHEN** the user fills out the persona creation form and submits
- **THEN** the frontend saves the new persona via the API and updates the card list to include it
