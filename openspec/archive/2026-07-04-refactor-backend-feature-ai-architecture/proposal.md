## Why

The current backend can execute the PoC flow, but its business logic, persistence, and AI-calling concerns are tightly coupled inside route handlers and feature services. This makes provider changes risky, slows maintenance, and creates a poor scaling path for longer-running respondent generation and study execution workloads.

## What Changes

- Refactor the backend into feature-based modules with thin HTTP routers, explicit application services, and repository boundaries for data access.
- Introduce a dedicated AI orchestration layer that exposes a stable internal gateway contract while hiding provider-specific details behind LiteLLM-backed adapters.
- Add explicit backend run lifecycle handling for synthetic respondent generation and study simulation, including configuration validation, execution metadata, and failure reporting.
- Persist AI execution audit data needed for troubleshooting, provider swaps, and future cost/quality monitoring.
- Remove backend assumptions that generated outputs are ephemeral or only request-scoped, preparing the backend for background execution and safer retries.

## Capabilities

### New Capabilities
- `backend-ai-orchestration`: Backend AI gateway, provider configuration, execution lifecycle, and audit behavior for synthetic generation and simulation workflows.

### Modified Capabilities
- `synthetic-respondents`: Update generation and study execution requirements to run through the backend AI orchestration layer, preserve execution state, and fail clearly when AI configuration or provider calls are unavailable.

## Impact

- **Backend structure**: Split `app/backend/app` into feature-oriented modules with service and repository boundaries instead of route-heavy orchestration.
- **AI infrastructure**: Add LiteLLM-backed provider adapters, internal model aliases, structured-output validation, and centralized AI telemetry/config handling.
- **Persistence**: Extend backend storage to record AI run metadata, execution status, raw/parsed outputs, and failure context needed for supportable operations.
- **API behavior**: Generation and study-run endpoints will report clearer AI execution states and become easier to migrate to background jobs without changing their feature contracts.
- **Dependencies**: Add LiteLLM as the backend integration layer for OpenAI-compatible and future provider routing.
