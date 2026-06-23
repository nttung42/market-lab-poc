## Context

The current Market Lab application implements the initial phases of customer discovery (project workspace setup, personas catalog, and synthetic respondent generation). However, to complete the end-to-end site map flow defined in the SRS, the application needs screens and database structures to support building a study, running it, viewing the charts and themes in a results dashboard, and exporting the report.

## Goals / Non-Goals

**Goals:**
- Implement the Study Builder screen allowing survey creation (single-choice, multiple-choice, Likert scale, open-ended questions), segment selection, and running/monitoring the study.
- Implement the Results Dashboard screen containing interactive Recharts components, qualitative theme cards, objections, and AI recommendations.
- Implement the Reports screen with PDF-friendly print styling and a CSV downloader.
- Update the main application header and state routing to accommodate all views of the complete Site Map.
- Maintain consistency with the `--ml-blue`, `--ml-surface`, `--ml-ink` design system and startup SaaS aesthetics.
- Establish clean SQLite models for `Study`, `Question`, `Option`, and `Response` on the backend, with simple API endpoints.

**Non-Goals:**
- Integrating actual PDF generation libraries on the backend (we will use CSS `@media print` for browser-based PDF printing).
- Advanced statistical analytics (t-tests, ANOVA) or complex user permissions/auth.

## Decisions

### 1. Database Schema Extensions (Backend)
We will introduce four new models in SQLite:
- `Study`: ID, project_id, title, status (draft, running, completed), created_at.
- `Question`: ID, study_id, text, type (single_choice, multi_choice, likert, open_text), position.
- `QuestionOption`: ID, question_id, text, value, position (for choice options).
- `Response`: ID, study_id, respondent_id, question_id, answer (JSON or string representation of chosen option/text).

### 2. Simulated/Real Study Execution
When a study is triggered, the backend will generate simulated answers for each respondent in the panel. To satisfy early-stage PoC usability without requiring complex external LLM configuration on every developer environment:
- If an OpenRouter/OpenAI API key is configured, the backend can simulate answers using a simple LLM call that feeds the persona profile and question.
- Otherwise, it will fallback to a rule-based deterministic response simulation (e.g., matching the respondent's tech-savviness, budget, risk attitude, and motivations to the question options) to guarantee a reliable, instant demo experience.

### 3. Navigation and State Management
We will expand the current `View` state in `App.tsx` to:
- `project-overview`
- `persona-catalog`
- `synthetic-respondents`
- `study-builder`
- `results-dashboard`
- `report-export`
The header will render these as a SaaS-like step-by-step horizontal wizard or navigation links to guide the user from left to right.

### 4. Startup SaaS Visual Styling
- Dark headers, sleek borders (1px `--ml-border`), and solid accent colors.
- Clear, distinct status badges for "Synthetic Output - Human Validation Required" to fulfill explainability requirements.
- Responsive bento-grid layouts on the results dashboard.

## Risks / Trade-offs

- **[Risk]**: Study execution could timeout if calling an external LLM API for dozens of respondents.
  - **[Mitigation]**: We will implement a fast mock simulation fallback and run actual calls in a simple background progress loops, rendering incremental progress on the Study Run Monitor.
- **[Risk]**: PDF layouts look messy when printing directly from the browser.
  - **[Mitigation]**: We will define specific `@media print` CSS rules in `index.css` to hide headers, sidebar controls, and navigation buttons, forcing a clean pagination layout.
