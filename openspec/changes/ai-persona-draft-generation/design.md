## Context

The repo already has a backend AI architecture for respondent generation and study simulation:

- Stable model aliases
- A shared LiteLLM-backed structured gateway
- AI run audit persistence
- Backend-owned provider configuration

Persona generation should follow the same pattern instead of creating a separate direct provider integration or putting AI logic in the frontend.

## Goals / Non-Goals

**Goals:**
- Generate one structured synthetic persona from a custom prompt.
- Use active project context to ground the generated persona.
- Persist the generated persona so later PoC steps can reuse it.
- Return structured fields aligned with the existing persona schema plus a richer marketing insight profile.
- Present the generated persona as read-only in the frontend.
- Persist AI execution metadata for audit and debugging.

**Non-Goals:**
- Editable AI draft review inside this generation flow.
- Upload-based persona generation.
- Multi-persona batch generation.
- Human-validation workflows or external evidence ingestion.

## Decisions

### 1. Route shape

Add a backend endpoint:

- `POST /api/projects/{project_id}/personas/generate`

Request body:

```json
{
  "custom_prompt": "Create a persona for ..."
}
```

Response body:

- A persisted structured persona with `id`, `project_id`, core persona fields, and an optional `insight_profile` object for richer read-only detail sections.

### 2. Generated persona persistence

The endpoint creates one persona record after the AI output passes strict schema validation. This supports the PoC flow where generated personas can be used by respondent generation and later study execution. The frontend still treats the generated artifact as read-only.

### 3. AI orchestration

Persona drafting will use:

- task type: `persona_draft_generation`
- model alias: `persona-drafter`

The backend service will create and update an `ai_runs` record using the same lifecycle pattern as respondent generation.

### 4. Prompt grounding

The prompt builder will include:

- Project name
- Product description
- Industry
- Market
- Target audience
- Research objective
- Study type
- User custom prompt

The model will be instructed to return only strict JSON and to clearly frame assumptions as synthetic and requiring human validation.

### 5. Structured output contract

The AI response must include the persona's core structured fields:

- name
- segment
- quote
- demographics
- goals
- pain_points
- motivations
- buying_behavior
- decision_rules
- objections
- channels
- assumptions
- confidence_score
- optional nested JTBD, psychographics, product fit, journey map, and validation metadata

The AI response should also include an optional `insight_profile` object with:

- profile information
- buying behavior
- psychological drivers
- key obstacles
- work and lifestyle
- communication preferences
- media, social, brand, commerce, and website signals
- preferences, products, services, places, events, values, hobbies, interests, and tools
- likely website interaction
- resonating topics
- industry-specific signals

This keeps persona data compliant with the project rule that core entities must be stored as structured fields rather than prompt blobs.

## Risks / Trade-offs

- **[Risk]** The model may return malformed or weakly grounded persona output.
  - **[Mitigation]** Parse with strict Pydantic schema validation and fail clearly on invalid output.
- **[Risk]** Users may assume AI-generated drafts are validated research.
  - **[Mitigation]** Keep the draft in the editable form and preserve the existing synthetic/human-validation notice in the UI.
- **[Risk]** Users may look for editing controls because older CRUD flows supported them.
  - **[Mitigation]** Label the detail as read-only and keep the generated output structured, scannable, and suitable for downstream PoC steps.
