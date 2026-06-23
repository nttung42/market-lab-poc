# PoC Tech Stack Recommendation

## 1. Recommended Stack

For this 2-week PoC, the recommended stack is:

```text
React + TypeScript + Vite
Tailwind CSS + Recharts + shadcn/ui
FastAPI + Pydantic
SQLite
OpenRouter/OpenAI API
```

This stack is suitable because it is fast to set up, easy to demo, and aligned with the final SRS direction of a React frontend and Python backend.

## 2. Frontend

Recommended:

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- shadcn/ui

Why:

- React + Vite enables fast setup and development.
- TypeScript helps keep persona, study, and response data structures clear.
- Tailwind CSS helps build UI quickly without spending too much time on custom CSS.
- Recharts is enough for PoC dashboards such as score comparison, preference distribution, and persona-level comparison.
- shadcn/ui can speed up form, table, card, dialog, and layout work.

Frontend should include:

- Project overview screen.
- Persona list/card screen.
- Synthetic respondent list.
- Concept test builder.
- Study run status.
- Result dashboard.
- Report page.

## 3. Backend

Recommended:

- FastAPI
- Pydantic
- SQLModel or SQLAlchemy if relational models are needed
- FastAPI background tasks or simple async jobs

Why:

- FastAPI works naturally with Python-based AI workflows.
- Pydantic is useful for strict schemas such as Persona, Respondent, Study, and Response.
- The API can expose clean endpoints for project, persona, respondent generation, study execution, and report data.
- For PoC scale, FastAPI background tasks or simple async handling are enough. Celery/RQ can wait until later.

Backend should include:

- Project APIs.
- Persona APIs.
- Synthetic respondent generation API.
- Study creation API.
- Study execution API.
- Result aggregation API.
- Report API.
- AI call wrapper.

## 4. Database

Recommended for PoC:

- SQLite

Why:

- Fastest option for local/demo development.
- No cloud setup required.
- Easy to reset and seed sample data.
- Enough for a 2-week PoC with projects, personas, respondents, studies, and responses.

Alternative:

- Supabase PostgreSQL

Use Supabase only if:

- The team already has a Supabase template.
- Multiple people need to use the same deployed demo data.
- Auth and shared access are needed early.

Recommendation:

For the 2-week PoC, start with SQLite. Move to Supabase/PostgreSQL after the value flow is proven.

## 5. AI Layer

Recommended:

- OpenRouter or OpenAI API
- Backend-side API calls only
- Structured JSON output

The backend should:

- Build prompts using persona, respondent, concepts, and fixed study questions.
- Request structured JSON from the model.
- Save raw model output.
- Save parsed structured output.
- Store model name, timestamp, and run metadata.

Response output should include:

- Concept scores.
- Preferred concept.
- Reasoning.
- Objection.
- Representative quote.
- Confidence or uncertainty note.

## 6. Background Jobs

For PoC:

- Use simple async execution or FastAPI background tasks.

Avoid for PoC:

- Celery
- Redis Queue
- Complex distributed worker setup

Rationale:

The PoC only needs to support small study runs, such as 30 respondents x 2 concepts. A lightweight job approach is enough.

## 7. Export and Report

Recommended for PoC:

- HTML report page.
- Optional Markdown export.
- Optional CSV export for raw responses.

Avoid at first:

- Production-grade PDF export.
- Presentation/PPT export.

Rationale:

PDF export can consume too much time during a 2-week PoC. A clean report page is enough to demonstrate value.

## 8. Suggested Folder Structure

```text
app/
  frontend/
    src/
      pages/
      components/
      features/
      api/
      types/
  backend/
    app/
      main.py
      models/
      schemas/
      routers/
      services/
      ai/
      db/
      seeds/
```

## 9. Implementation Priority

Must build first:

1. Backend schema and seed data.
2. Project and persona screens.
3. Respondent generation.
4. Concept test creation.
5. AI study execution.
6. Result dashboard.
7. Report page.

Can delay:

1. Authentication.
2. Supabase/PostgreSQL.
3. PDF export.
4. Full survey builder.
5. Human validation.
6. Advanced job queue.

## 10. Final Recommendation

React + FastAPI is the right stack for this PoC.

The best 2-week implementation choice is:

```text
React + TypeScript + Vite
Tailwind CSS + Recharts + shadcn/ui
FastAPI + Pydantic
SQLite
OpenRouter/OpenAI API
```

This gives the team enough speed to build a complete demo while keeping the architecture close to the future production direction.

