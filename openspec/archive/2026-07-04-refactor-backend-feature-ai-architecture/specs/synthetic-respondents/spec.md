## MODIFIED Requirements

### Requirement: Respondent generation logic
The system SHALL implement backend logic using an LLM to generate synthetic respondents through the backend AI orchestration layer.

The generation logic SHALL take a parent persona as input and construct a prompt asking the LLM to output N unique respondent profiles, each incorporating controlled variation parameters while remaining faithful to the persona's core goals, pain points, and objections.

The generation workflow MUST use the backend AI gateway rather than provider-specific route code, MUST validate structured output before persistence, and MUST fail clearly when backend AI configuration or provider execution is unavailable.

#### Scenario: Generate respondents for a persona
- **WHEN** a request is made to generate 10 respondents for a specific persona
- **THEN** the system calls the backend AI orchestration layer and parses the response into 10 structured respondent profiles
- **AND** each profile has distinct values for demographics and behavioral variables

#### Scenario: AI configuration is unavailable for respondent generation
- **WHEN** a respondent generation request is made without a valid backend AI configuration for the required model alias
- **THEN** the backend rejects the request with a clear AI configuration failure
- **AND** it does not silently substitute a mock or fallback respondent panel

### Requirement: Respondent persistence
The system SHALL persist all generated respondents to a local database.

The persisted respondents SHALL survive application restarts, page refreshes, and project/workspace switches.

Respondent replacement flows MUST preserve the previously stored panel until a newly requested generation run succeeds and the new panel is ready to persist.

#### Scenario: Respondents survive page reload
- **WHEN** the user generates respondents and refreshes the application
- **THEN** the previously generated respondents are loaded from the database and displayed in the UI

#### Scenario: Failed regeneration does not destroy the last successful panel
- **WHEN** the user requests a fresh respondent generation run and the AI execution fails before valid output is persisted
- **THEN** the last successful respondent panel remains available in storage
- **AND** the failed run is reported separately from persisted respondent data

## ADDED Requirements

### Requirement: Study simulation uses backend AI execution state
The system SHALL run synthetic study simulation through the backend AI orchestration layer and preserve execution state for the run.

The study simulation workflow MUST validate AI answers before marking the study execution as completed and MUST record failure state when provider execution or parsing does not succeed.

#### Scenario: Study simulation completes through the AI gateway
- **WHEN** a user runs a study against generated respondents
- **THEN** the backend executes the simulation through the backend AI orchestration layer
- **AND** it records execution state before persisting the final study responses

#### Scenario: Failed study simulation does not report completion
- **WHEN** a study simulation run fails before valid responses are persisted
- **THEN** the backend does not mark the study workflow as completed
- **AND** the failure is exposed through backend execution state and error reporting
