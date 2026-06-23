# PoC Task Breakdown

## Phase 1: PoC Foundation and Sample Data

Estimated time: Day 1-2

Goal:

Set up the minimum product context, demo scenario, and structured sample data needed for the PoC.

Tasks:

| ID | Task | Output |
| --- | --- | --- |
| P1-T01 | Define PoC demo scenario | Finalized sample project for English learning app |
| P1-T02 | Define project data model | Project fields and storage schema |
| P1-T03 | Create 3 sample personas | Structured persona seed data |
| P1-T04 | Define persona schema | Persona JSON/interface with confidence and assumptions |
| P1-T05 | Build project overview screen | User can view project and research objective |
| P1-T06 | Build persona list/card screen | User can view 3 persona cards |

Acceptance criteria:

- User can open a sample project.
- Sample project has product, market, target audience, and research objective.
- User can see 3 personas.
- Each persona has goals, pain points, objections, decision rules, confidence score, and assumption labels.
- Persona data is structured, not stored only as a long prompt.

## Phase 2: Synthetic Respondent Generator

Estimated time: Day 3-4

Goal:

Generate controlled synthetic respondent profiles from each parent persona.

Tasks:

| ID | Task | Output |
| --- | --- | --- |
| P2-T01 | Define respondent schema | Respondent JSON/interface |
| P2-T02 | Implement respondent generation logic | Function/API to generate respondents from persona |
| P2-T03 | Add controlled variation fields | Age, location, budget, motivation, tech savviness, risk attitude, channel |
| P2-T04 | Build generate panel action | User can generate N respondents per persona |
| P2-T05 | Build respondent list/table | User can inspect generated respondents |
| P2-T06 | Persist generated respondents | Respondents survive refresh/reopen |

Acceptance criteria:

- User can generate at least 10 respondents per persona.
- Total generated panel supports at least 30 respondents.
- Respondents are linked to parent persona.
- Respondents under the same persona have meaningful variation.
- User can view respondent list with key attributes.
- Generated respondents are saved.

## Phase 3: Fixed Concept Test Builder

Estimated time: Day 5-6

Goal:

Allow the user to create a simple concept/message test without building a full survey builder.

Tasks:

| ID | Task | Output |
| --- | --- | --- |
| P3-T01 | Define study schema | Study JSON/interface |
| P3-T02 | Create concept input form | User can enter 2-3 concepts/messages |
| P3-T03 | Add selected panel/persona selector | User can choose respondents for study |
| P3-T04 | Add fixed question template | 5-7 standard concept test questions |
| P3-T05 | Build study preview | User can review concepts and questions before run |
| P3-T06 | Add validation rules | Prevent run if concepts/respondents are missing |

Acceptance criteria:

- User can create a concept test with at least 2 concepts.
- User can select generated respondents.
- User can preview fixed questions.
- System prevents running invalid study configs.
- Study config is saved before execution.

## Phase 4: Study Execution Engine

Estimated time: Day 7-9

Goal:

Run synthetic responses for selected respondents and concepts, then save structured results.

Tasks:

| ID | Task | Output |
| --- | --- | --- |
| P4-T01 | Define response schema | Structured response model |
| P4-T02 | Design LLM prompt template | Prompt using persona, respondent, concepts, and fixed questions |
| P4-T03 | Implement study run API/job | Backend process to run batch responses |
| P4-T04 | Parse LLM output into structured data | Scores, preference, reasoning, objections, quote |
| P4-T05 | Save partial and completed responses | Results persist even if some calls fail |
| P4-T06 | Add run status tracking | Pending, running, completed, failed |
| P4-T07 | Add basic model/cost metadata | Store model name, timestamp, respondent count |

Acceptance criteria:

- System can run at least 30 respondents against 2 concepts.
- Each response contains numeric scores and text reasoning.
- Each response records persona and respondent identity.
- Partial results are not lost when one generation fails.
- User can see run status.
- Completed study can be reopened with results.

## Phase 5: Insight Dashboard

Estimated time: Day 10-12

Goal:

Convert raw responses into decision-support insights.

Tasks:

| ID | Task | Output |
| --- | --- | --- |
| P5-T01 | Compute average scores by concept | Quantitative summary |
| P5-T02 | Compute preferred concept distribution | Winner and preference percentages |
| P5-T03 | Compute persona-level comparison | Segment comparison table/chart |
| P5-T04 | Extract top objections | Qualitative objection summary |
| P5-T05 | Extract representative quotes | Quotes grouped by persona/concept |
| P5-T06 | Generate recommendation summary | Suggested winner and next actions |
| P5-T07 | Build results dashboard UI | User-facing result view |
| P5-T08 | Add synthetic limitation label | Clear trust/validation warning |

Acceptance criteria:

- Dashboard shows overall winning concept.
- Dashboard shows average score by concept.
- Dashboard shows preference distribution.
- Dashboard shows persona/segment differences.
- Dashboard shows top objections.
- Dashboard shows at least 3 representative quotes.
- Dashboard includes recommended next actions.
- Dashboard clearly labels output as synthetic and not human-validated.

## Phase 6: Report and Demo Readiness

Estimated time: Day 13-14

Goal:

Package the completed study into a simple shareable report and prepare the demo flow.

Tasks:

| ID | Task | Output |
| --- | --- | --- |
| P6-T01 | Define report structure | Report sections and content |
| P6-T02 | Build report page | Study report generated from result data |
| P6-T03 | Add basic export option | HTML, Markdown, or simple PDF if feasible |
| P6-T04 | Add sample fallback data | Demo works even if AI API is unavailable |
| P6-T05 | Write demo script | 5-10 minute walkthrough |
| P6-T06 | Run end-to-end QA | Validate project-to-report flow |
| P6-T07 | Fix critical demo blockers | Stable PoC demo |

Acceptance criteria:

- Report includes research objective, concepts, personas, respondent count, winner, reasons, objections, quotes, and recommendations.
- Report includes a human validation reminder.
- User can reach report from completed study.
- Demo can be completed without database/code intervention.
- Sample fallback data exists for failed API/demo environment.
- End-to-end flow works from project overview to report.

## Suggested Implementation Priority

Must complete:

1. Sample project and personas.
2. Respondent generation.
3. Concept test creation.
4. Study execution.
5. Dashboard winner and reasoning.
6. Report page.

Should complete:

1. Persona-level charts.
2. Top objections.
3. Representative quotes.
4. Run status tracking.
5. Fallback sample data.

Could complete if time remains:

1. Markdown/PDF export.
2. Simple edit persona form.
3. Retry failed respondent generation.
4. Cost/token estimate.
5. Multiple model selection.

## Final Definition of Done

The PoC is done when a stakeholder can use the app to compare 2-3 product messages with 3 synthetic persona groups and receive a clear recommendation report in one uninterrupted flow.

