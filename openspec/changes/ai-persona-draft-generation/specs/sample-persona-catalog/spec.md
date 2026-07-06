## ADDED Requirements

### Requirement: Persona generation API

The system SHALL support generating a structured read-only persona through a backend AI endpoint using project context and a user-provided custom prompt.

The system SHALL expose:

- `POST /api/projects/{project_id}/personas/generate`

The endpoint SHALL:

1. Accept a custom prompt string from the frontend.
2. Use backend AI orchestration rather than frontend or provider-direct calls.
3. Validate and persist one generated persona record.
4. Return structured persona fields and structured read-only insight sections rather than a freeform paragraph.
5. Mark the output as synthetic and not human validated.

#### Scenario: Generate persona from custom prompt
- **WHEN** the user submits a custom prompt for an existing project
- **THEN** the backend calls the shared AI gateway with project context
- **AND** the response is validated as a structured persona
- **AND** one new persona record is stored in SQLite
- **AND** the response is returned with persona id and project id

#### Scenario: Persona generation fails because AI config is missing
- **WHEN** the persona generation endpoint is called without a valid backend AI configuration for the required alias
- **THEN** the backend returns a clear AI configuration failure response

### Requirement: Persona generation uses structured validation

The system SHALL validate AI-generated personas against a structured schema before persisting or returning data to the frontend.

The schema SHALL include the core persona fields required by the existing persona contract, optional structured sub-sections already supported by the persona model, and optional read-only marketing insight sections.

#### Scenario: Invalid AI persona is rejected
- **WHEN** the AI provider returns malformed JSON or omits required persona fields
- **THEN** the backend rejects the response
- **AND** the failure is surfaced without creating a persona record

### Requirement: Persona catalog AI generation interaction

The persona catalog screen SHALL let the user request a real backend-generated persona from a single custom prompt and inspect the result in a read-only detail view.

The screen SHALL:

1. Show one primary custom prompt input.
2. Send the custom prompt to the backend generation endpoint.
3. Show a loading/processing state while generation is running.
4. Display the generated persona in a read-only detail layout.
5. Avoid edit controls in the generated persona detail.

#### Scenario: User inspects generated persona
- **WHEN** the user submits the AI persona prompt
- **THEN** the frontend shows processing feedback
- **AND** the generated persona detail appears after the backend returns successfully
- **AND** the persona detail is clearly labeled read-only, synthetic, and requiring human validation
