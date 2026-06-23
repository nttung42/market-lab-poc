# Specification: Synthetic Respondents

## Purpose
Define the structured schema, LLM generation, SQLite database persistence, and user interfaces for synthetic respondents in the Market Lab platform.

## Requirements

### Requirement: Respondent schema
The system SHALL define a structured respondent data schema.

Each respondent record SHALL include:
- Stable respondent identifier
- Parent persona identifier
- Parent project identifier
- Full name
- Age (within a realistic range, e.g. 18-24 for the target audience)
- Location
- Budget level (e.g. Low, Medium, High)
- Motivation summary
- Tech savviness level (e.g. Low, Medium, High)
- Risk attitude (e.g. Risk-averse, Neutral, Risk-seeking)
- Preferred channel (e.g. Social Media, Word of Mouth, Search)
- Core decision rules or background context

#### Scenario: Schema validation passes with correct fields
- **WHEN** a generated respondent is validated against the schema
- **THEN** all required fields including age, location, budget, motivation, tech savviness, risk attitude, and preferred channel are present
- **AND** the respondent is correctly linked to a parent persona and project

### Requirement: Respondent generation logic
The system SHALL implement backend logic using an LLM to generate synthetic respondents.

The generation logic SHALL take a parent persona as input and construct a prompt asking the LLM to output N unique respondent profiles, each incorporating controlled variation parameters while remaining faithful to the persona's core goals, pain points, and objections.

#### Scenario: Generate respondents for a persona
- **WHEN** a request is made to generate 10 respondents for a specific persona
- **THEN** the system calls the LLM and parses the response into 10 structured respondent profiles
- **AND** each profile has distinct values for demographics and behavioral variables

### Requirement: Respondent persistence
The system SHALL persist all generated respondents to a local database.

The persisted respondents SHALL survive application restarts, page refreshes, and project/workspace switches.

#### Scenario: Respondents survive page reload
- **WHEN** the user generates respondents and refreshes the application
- **THEN** the previously generated respondents are loaded from the database and displayed in the UI

### Requirement: Generate panel action UI
The frontend SHALL provide a user interface to trigger the generation of a synthetic respondent panel.

The UI SHALL allow the user to select the size of the panel (N respondents per persona, with a default of 10) and trigger the generation process. It SHALL display a loading state while generation is in progress.

#### Scenario: User triggers generation from the UI
- **WHEN** the user clicks the "Generate Panel" button for a persona
- **THEN** the frontend shows a progress indicator and calls the generation API
- **AND** once completed, the newly generated respondents are added to the list

### Requirement: Respondent list and table UI
The system SHALL provide a scannable table or grid to inspect generated respondents.

The respondent view SHALL display key variation attributes (name, parent persona, age, location, budget, tech savviness, risk attitude, preferred channel) to help the user evaluate the diversity of the generated panel.

#### Scenario: User inspects respondent details
- **WHEN** the user views the respondent list
- **THEN** the table displays a row for each generated respondent
- **AND** each row clearly details their demographics, motivation, and behavioral variations

### Requirement: Synthetic respondent warning visibility
The respondent management view and any screen presenting respondent details SHALL display a clear limitation notice.

The notice SHALL state that respondents are simulated profiles generated via AI, and their characteristics and preferences represent assumptions requiring human validation.

#### Scenario: Respondent warning is displayed
- **WHEN** the user opens the respondent panel page
- **THEN** a warning banner is clearly visible with synthetic research transparency text
