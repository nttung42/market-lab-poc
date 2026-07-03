## ADDED Requirements

### Requirement: Feature-scoped backend AI gateway
The backend SHALL expose a shared internal AI gateway interface for feature services that need language-model execution.

The gateway MUST hide provider-specific request details from feature services and MUST allow feature services to request AI tasks using stable internal model aliases rather than vendor model identifiers.

#### Scenario: Respondent generation uses a model alias
- **WHEN** the respondent generation service requests AI execution
- **THEN** it passes a task definition and internal model alias to the backend AI gateway
- **AND** the feature service does not construct provider-specific HTTP payloads itself

#### Scenario: Study simulation changes provider configuration
- **WHEN** the backend AI provider configuration changes from one OpenAI-compatible provider to another
- **THEN** the feature service contract remains unchanged
- **AND** the change is applied through backend AI configuration or adapter wiring rather than route or feature rewrites

### Requirement: Centralized AI provider configuration
The backend SHALL centralize AI provider configuration and validation in backend infrastructure code.

The configuration MUST support stable model aliases, backend-side secrets, and provider-specific settings without requiring feature services to read raw environment variables directly.

#### Scenario: Missing AI configuration is detected centrally
- **WHEN** a feature service requests AI execution and the configured model alias is missing required credentials
- **THEN** the backend AI layer rejects the request with a configuration error
- **AND** the feature service receives a clear backend error without attempting a provider call

### Requirement: Structured AI output validation
The backend SHALL validate parsed AI output against task-specific structured schemas before persisting feature data.

The gateway or its associated parser layer MUST reject malformed or incomplete AI output before domain records are written.

#### Scenario: Parsed respondent output fails schema validation
- **WHEN** an AI response omits required respondent fields or returns incompatible types
- **THEN** the backend marks the AI execution as failed
- **AND** it does not persist partial invalid respondent records as successful output

### Requirement: AI execution audit persistence
The backend SHALL persist AI execution audit data for synthetic generation and simulation workflows.

Each persisted AI run MUST include a stable run identifier, task type, execution status, timestamps, model alias, resolved provider/model metadata, raw provider output, parsed output, and error detail when execution fails.

#### Scenario: Successful AI run is auditable
- **WHEN** respondent generation or study simulation completes successfully
- **THEN** the backend stores the run metadata and raw/parsed output for later inspection
- **AND** the persisted run can be linked back to the affected project, study, or persona scope

#### Scenario: Failed AI run preserves failure context
- **WHEN** the provider call fails or parsed output is rejected
- **THEN** the backend stores a failed run record with the error context
- **AND** operators can inspect the failed execution without relying on transient request logs

### Requirement: AI run lifecycle states
The backend SHALL track AI execution lifecycle states independently from HTTP request success.

Supported lifecycle states MUST include at least `pending`, `running`, `completed`, and `failed`.

#### Scenario: Run state changes during study execution
- **WHEN** a study simulation starts
- **THEN** the backend creates or updates an AI run record to `running`
- **AND** once outputs are persisted it transitions the run to `completed`

#### Scenario: Run state changes on provider failure
- **WHEN** a provider request times out or returns an unrecoverable error
- **THEN** the backend transitions the AI run to `failed`
- **AND** downstream services do not mark the feature workflow as successfully completed
