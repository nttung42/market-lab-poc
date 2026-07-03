## Context

The current backend keeps most orchestration inside `routers.py`, while AI-calling logic is duplicated across feature services and tied directly to OpenAI-compatible HTTP payloads. This works for the PoC sandbox, but it creates high change cost when swapping providers, introduces route-heavy business logic, and leaves no stable place to capture AI execution metadata, retries, or structured-output validation.

This change stays within the PoC phase and backend boundary rules: backend remains responsible for persistence, validation, APIs, AI provider calls, and secrets. The design must improve maintainability and provider flexibility without introducing production-only infrastructure such as distributed queues, auth, or external workflow engines.

## Goals / Non-Goals

**Goals:**
- Reorganize backend code into feature-based modules with explicit service and repository boundaries.
- Introduce a single internal AI gateway contract used by respondent generation and study simulation flows.
- Use LiteLLM as the backend integration layer so model aliases and provider configuration can change without feature-level rewrites.
- Persist AI execution metadata, status, and raw/parsed output needed for debugging and future quality/cost monitoring.
- Preserve current product behavior while making long-running AI workflows easier to move to background execution later.

**Non-Goals:**
- Rebuilding the frontend information architecture or changing user-facing study flows.
- Adding distributed job infrastructure, provider-side prompt management, or multi-tenant configuration.
- Supporting direct frontend AI calls or browser-side secrets.
- Introducing advanced model routing policies beyond what is needed for stable provider abstraction in the PoC.

## Decisions

### 1. Refactor backend by feature with shared infrastructure modules
We will split route-heavy backend code into feature packages such as `projects`, `personas`, `respondents`, and `studies`, plus shared `core` and `infra` modules.

- `router.py` stays transport-only: request validation, dependency injection, and HTTP error mapping.
- `service.py` owns use-case orchestration and business rules.
- `repository.py` owns database reads/writes for the feature.
- `infra/ai` owns provider-specific integrations and schemas.

This keeps business logic close to the feature while preventing route handlers from becoming the orchestration layer.

**Alternative considered:** Keep a flat router + services layout and only extract AI helpers.
- Rejected because it would reduce duplicate AI code but still leave persistence, reporting, and execution-state logic scattered across route handlers.

### 2. Introduce an internal `LLMGateway` abstraction backed by LiteLLM
We will define one internal AI interface for feature services, such as:

- `generate_structured(task_name, model_alias, messages, response_schema, metadata)`

Feature services will depend only on that interface. A LiteLLM-backed adapter will implement:
- provider/model resolution
- OpenAI-compatible chat completions
- structured-output handling
- retries/timeouts/logging hooks

The first implementation may use the LiteLLM Python SDK directly. The interface will allow a later swap to LiteLLM Proxy without changing feature services.

**Alternative considered:** Call provider SDKs or `httpx` directly from each service.
- Rejected because provider config, response parsing, telemetry, and retries would remain duplicated and tightly coupled to each workflow.

### 3. Use stable internal model aliases instead of hardcoding vendor models in features
Feature services will request internal aliases such as:
- `respondent-generator`
- `study-simulator`

The alias-to-provider/model mapping will live in backend config / LiteLLM config, not in feature code. This lets the team change providers, model families, or endpoints with configuration changes rather than business-logic edits.

**Alternative considered:** Keep `MODEL_NAME` as a single global env var.
- Rejected because respondent generation, study simulation, and later insight summarization may need different model policies.

### 4. Add explicit AI run persistence for audit and execution lifecycle
We will add backend persistence for AI execution runs. A run record should capture at minimum:
- stable run ID
- feature task type (`respondent_generation`, `study_simulation`, etc.)
- target entity (`project_id`, `study_id`, optional `persona_id`)
- status (`pending`, `running`, `completed`, `failed`)
- model alias, resolved provider/model, and endpoint family
- request metadata
- raw response payload
- parsed output payload
- error detail
- timestamps and basic usage metrics when available

This satisfies the backend architecture rule to save raw and parsed AI output and creates a scaling path toward retries or background jobs.

**Alternative considered:** Persist only final respondents/responses.
- Rejected because provider swaps, debugging malformed outputs, and supportability all become much harder without run-level audit data.

### 5. Make respondent generation and study simulation transactional at the run level
The services will stop doing destructive replace as the first step. Instead:
- create/update an AI run record
- call the gateway
- validate parsed structured output
- write new domain records
- finalize run status

Where replacement semantics are still needed, old data will only be removed after a new run succeeds, ideally within one transaction boundary per feature operation.

**Alternative considered:** Keep delete-then-insert semantics.
- Rejected because it can destroy previous data on partial failure and makes retry behavior unsafe.

### 6. Keep synchronous HTTP execution for this change, but shape it for background jobs later
The endpoints will remain request/response for the PoC, but services and run-state models will be designed so execution can later move behind a worker without changing the feature contract.

This means:
- status fields become meaningful now
- orchestration leaves route handlers
- AI run records can outlive a single request

**Alternative considered:** Introduce a queue/worker in this change.
- Rejected because it expands infrastructure scope beyond the current PoC phase and is not required to realize the architecture split.

## Risks / Trade-offs

- **[Risk]** Adding LiteLLM is a new dependency and abstraction layer.
  - **Mitigation:** Keep a thin internal gateway interface so LiteLLM remains replaceable and vendor lock-in stays low.

- **[Risk]** Feature-based refactoring can touch many backend files at once.
  - **Mitigation:** Migrate incrementally by introducing new modules and moving one workflow at a time behind stable APIs.

- **[Risk]** Run-audit persistence increases schema and storage complexity.
  - **Mitigation:** Start with compact JSON fields and essential metadata only; defer advanced analytics tables until needed.

- **[Risk]** Synchronous execution still limits throughput for large study runs.
  - **Mitigation:** Treat this change as the architectural prerequisite for later background execution, not the final scaling state.

- **[Risk]** Structured-output validation may reject provider responses more often at first.
  - **Mitigation:** Centralize schema validation and error handling in the AI gateway so prompts and model configs can be tuned in one place.

## Migration Plan

1. Add core AI configuration objects, LiteLLM dependency, and the internal gateway interface.
2. Add AI run persistence models and migrations/seeding-safe schema updates.
3. Create feature-level service/repository modules for `respondents` and `studies`.
4. Move respondent generation to the new service stack and AI gateway while preserving endpoint shape.
5. Move study simulation to the same stack and persist run metadata/raw output.
6. Move aggregation/report logic out of route handlers into feature services.
7. Leave compatibility shims in place only until all routes call the new service layer.

Rollback strategy:
- revert route wiring to the old modules if needed
- keep schema additions backward-compatible so old feature data remains readable during rollback

## Open Questions

- Should the first LiteLLM integration use the Python SDK only, or should the repo also commit an optional LiteLLM Proxy config for local ops?
- Do we want one generic `ai_runs` table or separate `respondent_generation_runs` and `study_simulation_runs` tables for simpler querying?
- Should result aggregation recommendations remain deterministic rules for now, or move behind the same AI gateway in a later change?
