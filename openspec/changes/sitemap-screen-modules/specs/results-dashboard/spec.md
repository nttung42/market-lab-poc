## ADDED Requirements

### Requirement: Quantitative results visualization
The system SHALL visualize the quantitative answers of a completed study in the Results Dashboard.

The dashboard SHALL display:
- Choice distribution charts (using bar or pie charts) for single/multiple choice questions
- Average ratings and score breakdown for Likert scale questions
- Total response count and overview metrics

#### Scenario: User views quantitative charts
- **WHEN** the user opens the Results Dashboard for a completed study
- **THEN** the system renders interactive charts showing response percentages for each question option
- **AND** the charts follow the Brand Design system colors

### Requirement: Qualitative analysis and theme extraction
The system SHALL summarize and extract qualitative insights from free text responses in the study.

The dashboard SHALL display:
- Main themes or topics identified
- Primary objections or user hesitations
- Curated representative synthetic quotes with persona names

#### Scenario: User views qualitative themes and objections
- **WHEN** the user opens the Results Dashboard for a completed study
- **THEN** the system lists extracted themes, objections, and direct quote cards labeled by respondent persona

### Requirement: Segment-by-segment comparison
The system SHALL support filtering or comparing response distributions across different respondent personas.

#### Scenario: User compares persona segments
- **WHEN** the user is on the Results Dashboard and selects "Compare Segments"
- **THEN** the system renders a breakdown of responses side-by-side or stacked by persona segment

### Requirement: Actionable recommendations
The system SHALL present structured recommendations for product, pricing, or message improvement based on the study findings.

#### Scenario: User reads recommendations
- **WHEN** the user views the Results Dashboard
- **THEN** the system displays a "Recommendations" card detailing specific actionable feedback and priority levels
