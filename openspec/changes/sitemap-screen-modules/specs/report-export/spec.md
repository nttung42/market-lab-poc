## ADDED Requirements

### Requirement: Shareable client-side print layout
The system SHALL provide a print-optimized, clean layout view for the study reports.

The print view SHALL include all persona profiles, study configuration, quantitative charts, and qualitative themes in a single scrollable document suitable for browser PDF generation (Ctrl+P / print).

#### Scenario: User prints report
- **WHEN** the user is on the Reports page and clicks "Print Report" or "Save to PDF"
- **THEN** the system triggers the native browser print dialogue using a clean CSS print media stylesheet that hides headers, footers, and interactive action buttons

### Requirement: CSV export of raw responses
The system SHALL allow users to export the raw study responses in CSV format.

The CSV file SHALL include:
- Respondent ID and persona segment
- Demographic and behavioral attributes (age, location, budget, risk attitude)
- Questions asked and the respondent's answers

#### Scenario: User downloads responses as CSV
- **WHEN** the user clicks "Export CSV" on the Reports page
- **THEN** the system triggers a client-side download of a `.csv` file containing the structured survey responses

### Requirement: Synthetic warning labeling on exports
The system SHALL enforce that all exported reports (PDF/Print and CSV) clearly display a synthetic research warning banner.

The banner SHALL state: "Simulated Research - Human Validation Required. These results represent synthetic models of customer behavior and have not been validated by real human research."

#### Scenario: Warning visible on exported report
- **WHEN** a report is printed or exported as CSV
- **THEN** the document includes the synthetic research limitation label at the top or bottom of every page or file header
