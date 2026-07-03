## 1. Backend Module Foundations

- [x] 1.1 Create `core`, `infra`, and feature-based backend module boundaries under `app/backend/app`
- [x] 1.2 Move route-heavy orchestration responsibilities into feature `service.py` modules while keeping routers transport-only
- [x] 1.3 Add feature-level repository helpers for respondent and study persistence workflows

## 2. AI Gateway and LiteLLM Integration

- [x] 2.1 Add LiteLLM to backend dependencies and create a backend AI gateway interface used by feature services
- [x] 2.2 Implement a LiteLLM-backed adapter with centralized alias-based model configuration and backend-side credential validation
- [x] 2.3 Add task-specific prompt builders and structured-output schemas for respondent generation and study simulation

## 3. AI Run Persistence and Lifecycle

- [x] 3.1 Add backend persistence models and schemas for AI run audit data, including status, raw output, parsed output, and error context
- [x] 3.2 Update respondent generation to create and finalize AI run records around successful and failed executions
- [x] 3.3 Update study simulation to track execution lifecycle state and preserve failure context without reporting completed runs on invalid output

## 4. Feature Workflow Refactor

- [x] 4.1 Refactor the respondent generation feature to call the shared AI gateway through feature services instead of provider-specific code
- [x] 4.2 Refactor the study simulation feature to call the shared AI gateway through feature services instead of provider-specific code
- [x] 4.3 Ensure replacement flows preserve previously successful respondent and response data until a new run succeeds
- [x] 4.4 Move study result aggregation and recommendation logic out of `routers.py` into the studies feature service layer

## 5. Verification and Readiness

- [x] 5.1 Update backend tests to cover centralized AI configuration failures, run lifecycle persistence, and successful feature orchestration through the new service boundaries
- [x] 5.2 Run backend verification to confirm existing generate/respond/run/result APIs still satisfy the updated synthetic respondent capability requirements
- [x] 5.3 Document the backend AI alias/config pattern so provider swaps can be made without feature-level rewrites
