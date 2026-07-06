## Why

The Persona Catalog currently shows an AI helper, but the product direction has shifted away from editable CRUD-style persona drafting. The intended demo mental model is simpler and more persuasive: the user enters one audience request, waits while the AI processes it, and lands on a structured read-only persona detail.

To make persona creation useful for message-testing setup while preserving transparency, the product needs a backend AI generation flow that turns a custom prompt into one persisted, structured synthetic persona profile. The persona should read like a marketing intelligence artifact, not a form.

## What Changes

- Add a backend AI endpoint to generate and persist a structured read-only persona from project context and a custom prompt.
- Reuse the shared backend AI gateway, model alias configuration, and AI run audit persistence for persona generation.
- Replace the frontend mock/editable helper with a one-input generation screen, loading state, and read-only persona detail.
- Extend the persona response with structured marketing insight sections inspired by audience-intelligence persona reports.

## Capabilities

### New Capabilities

- `sample-persona-catalog`: Generate a structured read-only synthetic persona from a custom prompt and project context.

### Modified Capabilities

- `sample-persona-catalog`: Persona creation flow becomes "Prompt -> Processing -> Read-only Detail".

## Impact

- **Backend**: Add request/response schemas, AI prompt builder, structured output schema, persona generation service, AI run tracking, and a new route under the persona feature.
- **Frontend**: Replace the mock/editable AI behavior in `PersonaCatalog.tsx` with a typed API call, processing state, and read-only detail layout.
- **Testing**: Add backend service and route tests for successful generation/persistence, provider/config failures, and synthetic validation labeling.
