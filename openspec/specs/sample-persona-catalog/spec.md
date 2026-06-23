# Specification: Sample Persona Catalog

## Purpose
Define the structured schema, API access, and user interface for synthetic personas in Phase 1 of Market Lab.

## Requirements

### Requirement: Persona schema
The system SHALL define a structured persona schema for Phase 1 sample personas.

Each persona SHALL include, at minimum:

- Stable persona identifier
- Parent project identifier
- Name
- Segment label
- Short quote
- Demographics
- Goals
- Pain points
- Motivations
- Buying behavior
- Decision rules
- Objections
- Channel preferences
- Assumptions
- Confidence score

List-like attributes SHALL be represented as structured arrays or equivalent typed collections.

#### Scenario: Persona schema includes required fields
- **WHEN** a sample persona is loaded
- **THEN** the persona includes goals, pain points, objections, decision rules, confidence score, and assumption labels
- **AND** those values are stored as structured fields rather than only as a long prompt

#### Scenario: Persona belongs to sample project
- **WHEN** backend code retrieves a sample persona
- **THEN** the persona includes a project identifier linking it to the seeded sample project

### Requirement: Seeded sample personas
The system SHALL seed exactly three Phase 1 sample personas for the sample project.

The seeded personas SHALL represent:

- Price-sensitive student
- Career-focused student
- Casual learner

Each seeded persona SHALL be tailored to Vietnamese university students aged 18-24 evaluating an English learning app.

#### Scenario: Persona catalog contains three personas
- **WHEN** the user opens the persona catalog for the sample project
- **THEN** the system shows exactly the three Phase 1 sample personas
- **AND** their segment labels match price-sensitive, career-focused, and casual learner positioning

#### Scenario: Personas contain meaningful differences
- **WHEN** the three personas are compared
- **THEN** each persona has distinct goals, pain points, objections, motivations, buying behavior, and decision rules
- **AND** those differences are suitable for later synthetic respondent generation

### Requirement: Persona confidence and assumptions
The system SHALL include confidence and assumptions metadata for each persona.

The confidence score SHALL be visible as a bounded value such as 0-1, 0-100, or an equivalent clearly documented scale. Assumptions SHALL be displayed as explicit labels or statements.

#### Scenario: Confidence score is visible
- **WHEN** the user views a persona card or detail view
- **THEN** the user can see the persona confidence score
- **AND** the UI makes the score scale understandable

#### Scenario: Assumptions are visible
- **WHEN** the user views a persona card or detail view
- **THEN** the user can see assumption labels or assumption statements for that persona

### Requirement: Persona read API
The system SHALL expose read access to personas associated with the sample project through backend APIs or equivalent application data access functions.

The persona read behavior SHALL support retrieving all personas for a project and retrieving an individual persona by identifier.

#### Scenario: List personas for project
- **WHEN** the frontend requests personas for the sample project
- **THEN** the system returns the three seeded personas linked to that project
- **AND** each returned persona includes the required Phase 1 fields

#### Scenario: Get persona detail
- **WHEN** the frontend requests one seeded persona by identifier
- **THEN** the system returns the full structured persona record

#### Scenario: No personas for unknown project
- **WHEN** the frontend requests personas for a project identifier that does not exist
- **THEN** the system returns a not-found or empty state that the UI can render without crashing

### Requirement: Persona list and card screen
The system SHALL provide a persona catalog screen for the sample project.

The persona catalog SHALL display all three personas as cards or an equivalent scannable list. Each persona card SHALL show the persona name, segment label, short quote, demographics summary, goals, pain points, objections, decision rules, confidence score, and assumptions.

#### Scenario: User views persona cards
- **WHEN** the user navigates to the persona catalog
- **THEN** the user can see all three sample personas
- **AND** each persona shows goals, pain points, objections, decision rules, confidence score, and assumptions

#### Scenario: Persona card content remains readable
- **WHEN** persona cards are displayed on common desktop and mobile viewport widths
- **THEN** text remains readable without overlapping controls or adjacent content
- **AND** users can scan key fields without opening developer tools or raw JSON

### Requirement: Synthetic persona transparency
The system SHALL present sample personas as synthetic assumptions for PoC exploration, not as validated customer research.

The persona catalog SHALL include a visible limitation note or label that these personas require human validation before product or marketing decisions are finalized.

#### Scenario: User sees persona limitation note
- **WHEN** the user views the persona catalog
- **THEN** the UI shows that personas are synthetic assumptions and need human validation

### Requirement: Phase 1 persona acceptance
The persona catalog SHALL satisfy the Phase 1 acceptance criteria for sample personas.

#### Scenario: Phase 1 persona criteria pass
- **WHEN** a user opens the persona catalog
- **THEN** the user can see three personas
- **AND** each persona has goals, pain points, objections, decision rules, confidence score, and assumption labels
- **AND** persona data is structured rather than stored only as a long prompt
