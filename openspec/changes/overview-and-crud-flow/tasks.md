## 1. Backend CRUD Development

- [ ] 1.1 Add API endpoints for creating, updating, and deleting projects, personas, and studies in app/backend/app/routers/routers.py
- [ ] 1.2 Update the qualitative themes results generation in app/backend/app/routers/routers.py to dynamically handle custom user-created personas rather than using hardcoded segment keys

## 2. Frontend API Client

- [ ] 2.1 Implement API client helper functions for all new CRUD operations in app/frontend/src/api/client.ts

## 3. Stateful Application Setup & Navigation Guard

- [ ] 3.1 Refactor app/frontend/src/App.tsx to manage the active project state, fetching the first project on mount, and disabling navigation tabs if no project is active

## 4. Page Component Implementation

- [ ] 4.1 Redesign app/frontend/src/pages/ProjectOverview.tsx to act as both a project list dashboard (with initialization form, edit, delete actions) and a detail workspace view
- [ ] 4.2 Update app/frontend/src/pages/PersonaCatalog.tsx to implement manual persona creation, editing, and deletion interface
- [ ] 4.3 Update app/frontend/src/pages/StudyBuilder.tsx to support editing study title and deleting studies

## 5. Verification & Testing

- [ ] 5.1 Run backend pytest tests to ensure new endpoints function correctly
- [ ] 5.2 Verify the end-to-end user journey: Create Project -> Create Persona -> Generate Respondents -> Create Study -> Run -> View Dashboard -> Export Report
