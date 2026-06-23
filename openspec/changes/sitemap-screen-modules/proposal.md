## Why

The current Market Lab application has basic pages for Project Overview, Persona Catalog, and Synthetic Respondents. However, it lacks screens and functional capabilities for the key latter steps of the site map: the Study Builder (survey design, persona selection, running studies), the Results Dashboard (charts, qualitative insights, and segment analysis), and Report Exporting. Adding these modules will complete the end-to-end synthetic concept testing flow as described in the SRS.

## What Changes

- **Add Study Builder Module**: A screen for creating surveys with structured questions (single/multiple choice, free text, Likert scale), selecting personas or respondent panels, and monitoring/triggering the run.
- **Add Results Dashboard Module**: A dense, structured dashboard screen to show quantitative survey metrics (using Recharts), qualitative themes (objections, representative quotes), segment-by-segment comparisons, and AI recommendations.
- **Add Report Export Module**: Clean client-side layout formats for downloading/printing reports (as a simple simulated PDF and CSV export) with clear synthetic and confidence level warning labels.
- **Header & Routing Integration**: Update the application's header and routing system to support navigating through the complete user journey: Project Overview -> Persona Catalog -> Synthetic Respondents -> Study Builder -> Results Dashboard -> Report Export.

## Capabilities

### New Capabilities
- `study-builder`: Interface and schema for designing surveys, selecting persona segments, initiating study runs, and monitoring progress.
- `results-dashboard`: Interface and backend data views to display quantitative metrics (visualized in charts), extract qualitative themes and objections, compare segment behaviors, and present recommendations.
- `report-export`: Exporting study findings, persona descriptions, and analysis results to formats suitable for stakeholder sharing (simulated/client-side print layouts).

### Modified Capabilities
- `sample-project-workspace`: Update the main app routing layout and project navigation to link to Study Builder, Results Dashboard, and Reports, matching the full Site Map.

## Impact

- **Frontend**: Adds `StudyBuilder.tsx`, `ResultsDashboard.tsx`, and `ReportExport.tsx` in `app/frontend/src/pages`. Updates `App.tsx` and `types/index.ts` to support studies, questions, options, and simulated results.
- **Backend (Mocked/Simple)**: Since this is a PoC, backend owns persistence. We will extend the database models, schemas, and API routers to support study definitions, questions, and synthetic study responses/results (or simulate/seed them for the PoC sandbox).
