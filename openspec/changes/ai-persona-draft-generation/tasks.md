## 1. OpenSpec

- [x] 1.1 Add a change describing backend AI persona draft generation from custom prompt

## 2. Backend AI Generation

- [x] 2.1 Add request and response schemas for persona draft generation
- [x] 2.2 Add persona drafting task constants, AI prompt builder, and structured output schema
- [x] 2.3 Implement backend persona draft generation service with AI run audit lifecycle
- [x] 2.4 Add `POST /api/projects/{project_id}/personas/draft` route
- [x] 2.5 Convert generation contract to persisted read-only persona output
- [x] 2.6 Add structured marketing insight profile fields to generation output

## 3. Frontend Persona Studio

- [x] 3.1 Add typed API client helper for persona draft generation
- [x] 3.2 Replace the mock AI helper in `PersonaCatalog.tsx` with the real backend draft flow
- [x] 3.3 Populate the editable persona form from the returned structured draft
- [x] 3.4 Replace editable draft form interaction with one-input generation flow
- [x] 3.5 Add read-only generated persona detail layout

## 4. Verification

- [x] 4.1 Add backend tests for successful persona draft generation, config failure, and non-persistence
- [x] 4.2 Run relevant backend and frontend verification commands
- [x] 4.3 Update verification for persisted generated persona and read-only UI
