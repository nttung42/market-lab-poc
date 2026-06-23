## ADDED Requirements

### Requirement: Survey creation interface
The system SHALL support creating a survey study with structured questions within the Study Builder screen.

The questions SHALL support the following types:
- Single choice (with custom options)
- Multiple choice (with custom options)
- Likert scale (1-5 or strongly disagree to strongly agree)
- Free text / open-ended questions

#### Scenario: User configures survey questions
- **WHEN** the user is on the Study Builder screen and clicks "Add Question"
- **THEN** the user can enter the question text and select its type
- **AND** the system updates the current study configuration with the new question

### Requirement: Select personas and respondents for study
The system SHALL allow the user to select which personas or generated synthetic respondent panels will participate in the simulated study.

The system SHALL display the size and characteristics of the selected panel before running the study.

#### Scenario: User selects study audience
- **WHEN** the user is configuring a study in the Study Builder
- **THEN** the system displays a list of available personas and generated respondents
- **AND** the user can toggle which segments to include in the study run

### Requirement: Trigger and monitor simulated study run
The system SHALL support triggering a simulated study run and displaying its execution status.

The run monitor SHALL display:
- Total respondents participating
- Current completion percentage
- Estimated duration
- AI model or provider details used for simulation (e.g., GPT-4o-mini or simulated API)

#### Scenario: User runs a synthetic study
- **WHEN** the user clicks the "Run Study" button
- **THEN** the system initiates the simulation process
- **AND** displays a progress bar showing completion rate and status (e.g., "Simulating responses...")
