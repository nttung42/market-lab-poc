## ADDED Requirements

### Requirement: Seeded sample project
The system SHALL provide one deterministic sample project for the Phase 1 PoC demo scenario.

The sample project SHALL include, at minimum:

- Project name
- Product description
- Industry
- Market
- Target audience
- Research objective
- Study type or intended research flow
- Created or seeded timestamp metadata

The sample project SHALL use the English learning app for Vietnamese university students scenario from `docs/start/README.md`.

#### Scenario: Sample project exists in a clean environment
- **WHEN** the application starts with an empty local PoC database
- **THEN** the system creates or exposes a sample project for an English learning app targeting Vietnamese university students
- **AND** the project includes product description, market, target audience, and research objective fields

#### Scenario: Sample project seed is deterministic
- **WHEN** the seed process is run more than once
- **THEN** the system does not create duplicate sample projects
- **AND** the same stable project identifier can be used by later Phase 1 APIs or frontend routes

### Requirement: Structured project storage
The system SHALL store project data as structured fields rather than only as markdown, a prompt string, or frontend-only prose.

The project record SHALL be retrievable by backend logic in a shape suitable for later respondent generation and study creation phases.

#### Scenario: Project fields are addressable
- **WHEN** backend code retrieves the sample project
- **THEN** fields such as `product_description`, `market`, `target_audience`, and `research_objective` are individually addressable
- **AND** no parsing of a long natural-language prompt is required to read those fields

#### Scenario: Missing required project data is rejected or repaired
- **WHEN** seed data is loaded without a required project field
- **THEN** the system fails validation or repairs the seed to include the required field before exposing the project to the UI

### Requirement: Project read API
The system SHALL expose read access to the sample project through backend APIs or equivalent application data access functions.

The project read behavior SHALL support retrieving a list of available projects and retrieving the selected project by identifier.

#### Scenario: List projects
- **WHEN** the frontend requests available projects
- **THEN** the system returns the seeded sample project with its identifier, name, market, target audience, and research objective summary

#### Scenario: Get project detail
- **WHEN** the frontend requests the sample project by identifier
- **THEN** the system returns the full structured project record
- **AND** the response includes all minimum Phase 1 project fields

#### Scenario: Unknown project
- **WHEN** the frontend requests a project identifier that does not exist
- **THEN** the system returns a not-found state that the UI can render without crashing

### Requirement: Project overview screen
The system SHALL provide a project overview screen for the sample project.

The overview screen SHALL display the project name, product description, industry, market, target audience, research objective, intended study type, and a visible path to the persona catalog.

#### Scenario: User opens sample project overview
- **WHEN** the user opens the application or navigates to the sample project
- **THEN** the user can see the sample project's product, market, target audience, and research objective without manual database or code interaction

#### Scenario: User navigates from project overview to personas
- **WHEN** the user is viewing the project overview
- **THEN** the UI provides a clear navigation action or link to view the sample personas for that project

### Requirement: Synthetic research positioning on project overview
The system SHALL clearly distinguish the PoC project context from validated human research.

The project overview screen SHALL include a concise synthetic research limitation note indicating that Phase 1 personas are working assumptions for simulated research and require later human validation.

#### Scenario: User sees limitation note
- **WHEN** the user views the project overview screen
- **THEN** the screen shows a visible note that synthetic outputs and persona assumptions are not validated human research

### Requirement: Phase 1 project acceptance
The sample project workspace SHALL satisfy the Phase 1 acceptance criteria for project setup.

#### Scenario: Phase 1 project criteria pass
- **WHEN** a user opens the sample project
- **THEN** the user can identify the product, market, target audience, and research objective
- **AND** the project is available without manual database edits or code changes
