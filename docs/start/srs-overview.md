# Software Requirements Specification Overview

## 1. Introduction

### 1.1 Project Name

**Persona Research Intelligence Platform**

### 1.2 Purpose

Persona Research Intelligence Platform is a web-based software system that helps product, marketing, and startup teams create structured customer personas, generate synthetic respondents, run simulated research studies, analyze customer insights, and optionally validate findings with real human respondents.

The product combines two major capabilities:

- **Persona Intelligence**: generate, manage, and refine customer personas based on user input, uploaded research files, CRM/CSV data, public information, or manual editing.
- **Synthetic Research Engine**: use personas and synthetic panels to run surveys, interviews, concept tests, message tests, pricing tests, and feature prioritization studies.

### 1.3 Scope

The system focuses on early-stage customer research and hypothesis testing. It does not replace real user research, but helps teams quickly explore ideas, test assumptions, improve survey design, and identify insights before spending time and money on full-scale human research.

The MVP scope includes:

- Create and manage research projects.
- Create 3-5 structured personas per project.
- Generate synthetic respondents from personas.
- Build basic surveys and concept tests.
- Run simulated responses using AI models.
- Analyze quantitative and qualitative results.
- Export a simple insight report.

Future scope includes:

- Human respondent validation.
- CRM, analytics, social, and public data integrations.
- Advanced research methods such as focus groups, MaxDiff, Kano, and AI vs human comparison.
- Persona calibration based on real human data.

### 1.4 Target Users

The target users are teams that need customer insight but have limited time, budget, or access to real respondents.

| User Group | Description | Main Need |
| --- | --- | --- |
| Startup founders | Early-stage founders validating product ideas, pricing, or positioning | Quickly test assumptions before building or launching |
| Product managers | Product teams deciding features, roadmap, and user flows | Understand user needs, pain points, and objections |
| Marketing teams | Teams testing messages, ads, content, and campaign ideas | Identify which message resonates with each persona |
| UX researchers | Researchers preparing surveys, interviews, and usability hypotheses | Pilot research design before recruiting real users |
| Business students / small teams | Users learning or applying customer discovery methods | Create clear persona and research reports with minimal setup |

### 1.5 Key Objectives

The software must achieve these objectives:

1. Help users create evidence-aware customer personas instead of simple prompt-based personas.
2. Allow users to generate controlled synthetic respondent panels from persona profiles.
3. Let users build and run basic research studies such as surveys, interviews, concept tests, and message tests.
4. Analyze synthetic research results into charts, themes, quotes, objections, and recommendations.
5. Clearly label AI-generated insights, assumptions, confidence levels, and human validation status.
6. Provide exportable reports that support product and marketing decisions.

## 2. Functional Requirements

### 2.1 Core User Stories

| ID | User Story | Priority |
| --- | --- | --- |
| FR-01 | As a user, I want to create a research project with product name, industry, market, target audience, and research objective so that I can organize my customer research in one workspace. | Must Have |
| FR-02 | As a user, I want to create personas manually by entering demographic, behavioral, psychographic, pain point, goal, and buying behavior information so that I can define my target customer segments. | Must Have |
| FR-03 | As a user, I want the system to generate persona drafts from uploaded documents such as survey results, interview notes, reports, reviews, or CSV files so that I can save time creating personas. | Must Have |
| FR-04 | As a user, I want to edit persona profiles, evidence, confidence scores, and assumptions so that the personas remain accurate and transparent. | Must Have |
| FR-05 | As a user, I want to generate multiple synthetic respondents from each persona with controlled variation in age, location, budget, motivation, channel preference, and risk attitude so that simulated research results are more diverse. | Must Have |
| FR-06 | As a user, I want to build surveys with basic question types such as single choice, multiple choice, Likert scale, ranking, and free text so that I can collect structured synthetic feedback. | Must Have |
| FR-07 | As a user, I want to run a research study against selected personas or synthetic respondents so that I can simulate how different customer segments may respond. | Must Have |
| FR-08 | As a user, I want to run concept or message tests by comparing multiple product ideas, landing page texts, ads, or value propositions so that I can identify the strongest option. | Must Have |
| FR-09 | As a user, I want to view analysis dashboards with response distribution, segment comparison, top pain points, sentiment, themes, objections, and representative quotes so that I can understand the research results quickly. | Must Have |
| FR-10 | As a user, I want to export persona profiles and research reports as PDF or presentation-ready files so that I can share findings with stakeholders. | Must Have |
| FR-11 | As a user, I want to ask follow-up questions to a persona or study result so that I can explore reasoning behind an answer. | Nice to Have |
| FR-12 | As a user, I want to validate synthetic results with real human respondents and compare AI vs human responses so that I can increase trust in important decisions. | Nice to Have |

### 2.2 Out of Scope for MVP

The following features are not included in the first MVP:

- Full CRM integration.
- Automatic social media crawling.
- Real-time competitor intelligence.
- Payment processing and subscription billing.
- Advanced statistical testing.
- Fully automated human panel recruitment.
- Replacing real user research as a final decision-making source.

## 3. Non-Functional Requirements

| Category | Core Requirement |
| --- | --- |
| Performance | Main pages should load within 2 seconds under normal conditions. A small synthetic study should finish within a reasonable time depending on AI model speed. |
| Security | Users must log in before accessing projects, personas, studies, and reports. Each user can only access their own data or shared team data. |
| Data Privacy | Uploaded files, persona information, prompts, and research results must be stored securely and must not be visible to other users. |
| Reliability | If AI generation fails, the system should show a clear error and allow the user to retry. Study results should not be lost after generation. |
| Explainability | AI-generated insights must be labeled clearly so users know what is based on input data, what is AI-inferred, and what still needs human validation. |
| Usability | A new user should be able to create a project, create personas, run a basic study, and view results without technical knowledge. |

## 4. Sitemap / User Flow

### 4.1 Sitemap

```text
Public Website
    |
    +-- Sample Persona / Sample Report Gallery
    +-- Try Demo / Trial Sandbox
    |
    v
Login / Sign up
    |
    v
Dashboard
    |
    +-- Projects
    |     |
    |     +-- Create Project
    |     +-- Project Overview
    |            |
    |            +-- Persona Studio
    |            |     |
    |            |     +-- Persona List
    |            |     +-- Persona Detail
    |            |     +-- Generate Persona
    |            |     +-- Edit Persona
    |            |
    |            +-- Synthetic Panel
    |            |     |
    |            |     +-- Generate Respondents
    |            |     +-- Respondent List
    |            |
    |            +-- Study Builder
    |            |     |
    |            |     +-- Create Survey
    |            |     +-- Create Concept Test
    |            |     +-- Select Personas / Panel
    |            |     +-- Run Study
    |            |
    |            +-- Results Dashboard
    |            |     |
    |            |     +-- Quantitative Results
    |            |     +-- Qualitative Themes
    |            |     +-- Segment Comparison
    |            |     +-- Recommendations
    |            |
    |            +-- Reports
    |                  |
    |                  +-- Export PDF
    |                  +-- Export CSV
    |
    +-- Account Settings
```

### 4.2 Key User Journey

```text
Access public website
-> View sample personas, sample studies, or sample reports
-> Try a limited demo / trial research workflow
-> Sign up to save progress or create a full project
-> Create project
-> Enter product / market / research objective
-> Generate or create personas
-> Review and edit persona profiles
-> Generate synthetic respondents
-> Create survey or concept test
-> Select personas / panel
-> Run study
-> View dashboard
-> Read insights and recommendations
-> Export report
-> Optional: validate with human respondents
```

### 4.3 Main Screens

| Screen | Purpose |
| --- | --- |
| Public Website | Introduce the product and route visitors to samples, demo, login, or sign up. |
| Sample Gallery | Show example personas, studies, dashboards, and exported reports so users can understand expected output before registering. |
| Trial Sandbox | Let visitors try a limited workflow with sample data or temporary inputs before creating an account. |
| Dashboard | Show all projects, recent studies, and quick actions. |
| Create Project | Capture product, industry, market, audience, and research objective. |
| Persona Studio | Create, generate, edit, and compare personas. |
| Persona Detail | Show demographics, JTBD, goals, motivations, pain points, buying behavior, channels, evidence, and confidence. |
| Synthetic Panel | Generate and manage synthetic respondents from personas. |
| Study Builder | Create survey, interview, concept test, message test, or feature prioritization study. |
| Study Run Monitor | Show generation status, cost estimate, model used, and run progress. |
| Results Dashboard | Display quantitative and qualitative research results. |
| Report Export | Generate shareable PDF and CSV exports. |
| Settings | Manage account, team, API keys, and privacy settings. |

## 5. Tech Stack

| Layer | Uses | Why |
| --- | --- | --- |
| Frontend | React JS with TypeScript | Builds the web app, dashboards, study builder, and report views with maintainable code. |
| UI & charts | Tailwind CSS, Recharts | Speeds up consistent UI development and displays research result charts. |
| Backend API | Python with FastAPI | Provides APIs for projects, personas, studies, study runs, and result analysis. |
| AI & data processing | Python AI/data libraries, LLM API | Supports persona generation, synthetic responses, and research data analysis. |
| Background jobs | Job queue/worker | Handles long-running tasks such as persona generation, survey runs, and report creation. |
| Authentication | Authentication service | Manages user login and protects private project data. |
| Database | Supabase PostgreSQL | Stores users, projects, personas, studies, responses, evidence, and reports. |
| File storage | Cloudflare R2 | Stores uploaded documents, generated reports, and exported files. |
| Hosting & deployment | Cloudflare Pages, VPS, Cloudflare DNS | Deploys frontend, backend, domain management, SSL, CDN, and routing. |
| CI/CD | GitHub Actions | Automates build, checks, and deployment when the codebase is updated. |
| Third-party services | OpenRouter AI API, PDF generation library, email service, human survey platform | Generates AI content, exports reports, sends notifications, and supports future human validation. |

## 6. MVP Boundary Summary

The first MVP should prioritize:

1. Project workspace.
2. Persona creation and editing.
3. Synthetic respondent generation.
4. Survey and concept test builder.
5. Synthetic study execution.
6. Results dashboard.
7. PDF/CSV export.
8. Clear confidence and assumption labeling.

The product should avoid claiming that synthetic research replaces real users. The correct positioning is that it supports early discovery, hypothesis generation, survey preparation, concept testing, and faster decision support before human validation.
