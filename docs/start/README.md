# PoC Specification: Synthetic Concept / Message Test

## 1. PoC Goal

Trong 2 tuần, PoC cần chứng minh rằng sản phẩm có thể giúp team product hoặc marketing ra quyết định ban đầu nhanh hơn bằng cách chạy nghiên cứu giả lập trên persona.

Core value cần chứng minh:

> Người dùng nhập 2-3 concept, message, value proposition, hoặc offer; chọn một nhóm synthetic personas; chạy synthetic concept test; sau đó nhận được báo cáo cho biết concept nào có tín hiệu tốt nhất, vì sao, nhóm persona nào thích/không thích, objection chính là gì, và nên chỉnh message như thế nào trước khi test với người thật.

PoC không nhằm chứng minh toàn bộ Persona Research Intelligence Platform. PoC chỉ chứng minh một vertical flow nhỏ nhưng có giá trị:

```text
Project
-> Personas
-> Synthetic respondents
-> Concept/message test
-> Simulated responses
-> Insight dashboard
-> Report
```

## 2. Success Definition

PoC được xem là thành công nếu người dùng có thể hoàn thành một research flow end-to-end mà không cần thao tác thủ công trong database hoặc code.

Minimum successful demo:

1. Tạo hoặc mở một sample project.
2. Xem 3 personas mẫu.
3. Generate synthetic respondents từ personas.
4. Nhập 2 concept/message để test.
5. Run study.
6. Xem dashboard kết quả.
7. Đọc report ngắn có recommendation.

Sau demo, người xem phải trả lời được:

- Concept/message nào nên chọn?
- Vì sao concept đó thắng?
- Persona nào phản ứng tốt nhất?
- Objection lớn nhất là gì?
- Nên sửa gì trước khi validate với người thật?

## 3. In Scope

PoC bao gồm:

- Simple project workspace.
- 3 structured sample personas.
- Synthetic respondent generation từ persona mẹ.
- Fixed concept/message test template.
- Basic AI-powered study execution.
- Quantitative result summary.
- Qualitative theme and objection extraction.
- Segment/persona comparison.
- Simple report page.
- Clear synthetic insight / human validation disclaimer.

## 4. Out of Scope

PoC không làm:

- Full authentication and team permission.
- Upload file để generate persona.
- CRM, social, analytics, hoặc public data integration.
- Full survey builder linh hoạt.
- Human respondent validation.
- Advanced statistical testing.
- Payment/subscription.
- Production-grade PDF export.
- Advanced pricing, MaxDiff, Kano, focus group.

## 5. Target Demo Scenario

Recommended demo scenario:

| Field | Value |
| --- | --- |
| Product | English learning app for Vietnamese university students |
| Market | Vietnam |
| Research goal | Choose the stronger value proposition for initial launch |
| Audience | University students aged 18-24 |
| Study type | Synthetic concept/message test |

Example concepts:

| Concept | Message |
| --- | --- |
| A | Learn English for job interviews in 15 minutes a day |
| B | Practice English with AI conversations anytime, without fear of mistakes |
| C | Improve TOEIC score with a personalized AI study plan |

Sample personas:

| Persona | Description |
| --- | --- |
| Price-sensitive student | Wants affordable tools, cares about clear value, avoids paid apps unless benefit is obvious |
| Career-focused student | Wants English for internship, job interviews, CV, and workplace communication |
| Casual learner | Wants low-pressure practice, prefers fun and flexible learning experiences |

## 6. Core Entities

### 6.1 Project

Minimum fields:

- Project name
- Product description
- Industry
- Market
- Target audience
- Research objective

### 6.2 Persona

Minimum fields:

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

### 6.3 Synthetic Respondent

Minimum fields:

- Respondent ID
- Parent persona
- Age
- Location
- Budget sensitivity
- Motivation
- Tech savviness
- Risk attitude
- Preferred channel
- Short profile

### 6.4 Study

Minimum fields:

- Study name
- Study type
- Research goal
- Concepts/messages
- Selected personas/respondents
- Questions
- Run status
- Model metadata

### 6.5 Response

Minimum fields:

- Study ID
- Respondent ID
- Persona ID
- Concept ID
- Scores
- Preferred concept
- Free-text reasoning
- Objections
- Quote
- Timestamp

## 7. Fixed Study Questions

PoC can use a fixed concept test template instead of a full survey builder.

Recommended questions:

1. How clear is this concept? Score 1-5.
2. How relevant is this concept to your current need? Score 1-5.
3. How trustworthy does this concept feel? Score 1-5.
4. How likely would you be to try this product? Score 1-5.
5. What is the biggest reason you like this concept?
6. What is the biggest objection or concern?
7. Which concept do you prefer overall, and why?

## 8. Dashboard Requirements

Minimum dashboard sections:

- Overall winning concept.
- Average score by concept.
- Preferred concept distribution.
- Persona/segment comparison.
- Top objections.
- Representative quotes.
- Recommended next actions.
- Synthetic research limitation note.

## 9. Report Requirements

Simple report output:

- Project and research objective.
- Tested concepts.
- Selected personas.
- Respondent count.
- Winner summary.
- Segment-level insight.
- Main objections.
- Representative quotes.
- Recommendations.
- Human validation reminder.

## 10. Non-Functional Expectations

For PoC:

- The full demo flow should complete in under 10 minutes.
- A small study should support at least 30 respondents and 2 concepts.
- Study results must persist after page refresh.
- If AI generation fails for some respondents, completed responses should still be saved.
- The interface should clearly distinguish synthetic output from validated human research.

## 11. Final Acceptance Criteria

PoC is accepted when:

- A user can run the complete flow from project to report.
- At least 3 personas are available.
- At least 30 synthetic respondents can be generated.
- At least 2 concepts can be compared.
- The system produces both numeric scores and qualitative reasoning.
- The dashboard identifies a winner and explains why.
- Segment/persona-level differences are visible.
- Top objections and representative quotes are shown.
- A report page is generated from the completed study.
- The report includes a limitation note that synthetic results need human validation.

