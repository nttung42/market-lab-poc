## Nhận định chính

Bạn đang muốn làm một sản phẩm nằm giữa **Delve.ai** và **Expected Parrot**:

**Delve.ai** mạnh ở lớp **tạo chân dung khách hàng / persona intelligence**: lấy dữ liệu first-party, public data, CRM, web analytics, social, competitor, VoC… rồi tự động phân khúc, tạo persona, digital twin, synthetic users, journey map và insight marketing. Delve mô tả rõ các nhóm sản phẩm như Persona Generator, Digital Twins, Synthetic Research và Marketing Advisor. ([Delve AI][1])

**Expected Parrot** mạnh ở lớp **nghiên cứu / survey execution engine**: tạo câu hỏi, survey, scenarios, agents, chọn LLM, chạy hàng loạt, phân tích kết quả, kết hợp phản hồi AI và người thật. Tài liệu EDSL nói rõ nó dùng để “run surveys at scale”, mô phỏng nhiều respondents đa dạng, test biến thể câu hỏi, so sánh language models, label dữ liệu và kết hợp AI results với human data. ([Expected Parrot][2])

Vì vậy, sản phẩm của bạn nên được thiết kế thành:

> **Persona Intelligence Platform + Synthetic Research Engine**

Không nên chỉ làm “chat với persona”, vì như vậy rất dễ thành demo AI nông. Giá trị thật nằm ở: **persona có cấu trúc + có nguồn dữ liệu + có panel giả lập + có phương pháp nghiên cứu + có báo cáo phân tích + có cơ chế kiểm chứng bằng người thật.**

---

## 1. Phân tích chức năng hai hệ thống

| Nhóm chức năng                       | Delve.ai                                                                                                                                                                                                                 | Expected Parrot                                                                                                                                   | Bài học cho sản phẩm của bạn                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Tạo persona**                      | Tạo user, buyer, competitor, employee personas; có research persona, customer persona, social persona, website persona, competitor persona. ([Delve AI][3])                                                              | Không tập trung vào auto-generate persona giàu insight; dùng “agents” với traits/persona để trả lời survey. ([Expected Parrot][4])                | Bạn cần module riêng tên **Persona Studio** để tạo persona đầy đủ, không chỉ là prompt.                           |
| **Nguồn dữ liệu**                    | Kết hợp first-party data, public sources, CRM, analytics, social, reviews, forums, competitor intelligence. Delve nói có thể enrich bằng social insights, competitor intelligence và 40+ public sources. ([Delve AI][5]) | Có scenarios, file store, import dữ liệu, dynamic parameterization, nhưng thiên về chạy nghiên cứu hơn là enrich persona. ([Expected Parrot][6])  | Persona phải lưu cả **attribute + evidence + confidence**, không chỉ lưu mô tả văn bản.                           |
| **Phân khúc khách hàng**             | Tự động segment theo demographic, firmographic, psychographic, geographic, behavioral, transactional attributes. ([Delve AI][3])                                                                                         | Có AgentList và scenarios để chạy nhiều nhóm agent, nhưng segmentation không phải core product như Delve.                                         | Bạn cần **Segment Builder**: phân khúc theo rule, clustering, hoặc upload danh sách.                              |
| **Digital twin / chat**              | Cho phép chat với digital twins để hỏi feedback về campaign, product, pricing, JTBD, pain points. ([Delve AI][7])                                                                                                        | Agent có thể trả lời survey/interview theo persona traits.                                                                                        | Chat nên là một mode, không phải toàn bộ sản phẩm. Nên có “Ask persona”, “Interview persona”, “Compare personas”. |
| **Synthetic users / panel**          | Tạo hàng trăm/hàng nghìn synthetic users mô phỏng user base; lọc theo gender, location, behavior, decision patterns. ([Delve AI][8])                                                                                     | Có thể chạy survey với nhiều agents, scenarios và models. ([Expected Parrot][4])                                                                  | Bạn cần **Synthetic Panel Generator**: từ 1 persona mẹ sinh ra N respondents có biến thiên hợp lý.                |
| **Survey / interview / focus group** | Có surveys, interviews, focus groups, concept testing, campaign validation, problem exploration. ([Delve AI][8])                                                                                                         | Có nhiều loại câu hỏi: free text, multiple choice, checkbox, linear scale, matrix, numerical, Likert, rank, top-k, yes/no… ([Expected Parrot][4]) | Bạn nên build **Study Builder** với survey định lượng, interview định tính, focus group, A/B test, concept test.  |
| **Logic nghiên cứu**                 | Thiên về UI sản phẩm và dashboard marketing.                                                                                                                                                                             | Có survey logic, piping, conditional flow, scenarios, show rules, show flow, cost estimate, remote inference/cache. ([Expected Parrot][9])        | Học Expected Parrot ở phần engine: scenario randomization, question piping, conditional logic, cost tracking.     |
| **Human validation**                 | Có synthetic research là chính.                                                                                                                                                                                          | Có Humanize để đưa survey cho người thật, lấy human responses; có tích hợp Prolific studies. ([Expected Parrot][2]) ([Expected Parrot][10])       | Bắt buộc có **Validate with humans** nếu muốn sản phẩm đáng tin.                                                  |

---

## 2. “Chân dung khách hàng” nên gồm những phần gì?

Bạn có thể thiết kế schema persona theo 12 nhóm sau.

### A. Thông tin định danh persona

Không phải thông tin cá nhân thật, mà là archetype:

| Thuộc tính     | Ví dụ                                                                 |
| -------------- | --------------------------------------------------------------------- |
| Persona name   | “Lan — Người mua thực dụng”                                           |
| Segment label  | High-value customer, one-time buyer, price-sensitive student          |
| Persona type   | B2C, B2B, SaaS buyer, e-commerce buyer, employee, competitor audience |
| Short quote    | “Tôi muốn giải pháp nhanh, dễ dùng, không mất thời gian học.”         |
| Segment size   | 18% tổng khách hàng                                                   |
| Business value | High LTV, high churn risk, low CAC, repeat buyer                      |

Delve cũng thường tạo 3–6 audience personas và gắn nhãn như High-Value Customer, Low-Value Customer, One-Time Buyer, Repeat Customer. ([Delve AI][5])

### B. Demographics / Firmographics

B2C:

| Nhóm         | Thuộc tính                                      |
| ------------ | ----------------------------------------------- |
| Demographic  | tuổi, giới tính, thu nhập, học vấn, nghề nghiệp |
| Geographic   | quốc gia, thành phố, vùng miền, urban/rural     |
| Life context | tình trạng gia đình, lối sống, thời gian rảnh   |

B2B:

| Nhóm             | Thuộc tính                                           |
| ---------------- | ---------------------------------------------------- |
| Firmographic     | ngành, quy mô công ty, doanh thu, thị trường         |
| Role             | chức danh, phòng ban, seniority                      |
| Buying committee | decision maker, influencer, evaluator, user, blocker |
| Budget context   | ngân sách, chu kỳ mua, procurement constraint        |

### C. Jobs To Be Done

Đây là phần rất quan trọng cho sản phẩm giả lập persona.

| Loại job         | Câu hỏi                                   |
| ---------------- | ----------------------------------------- |
| Functional job   | Họ cần hoàn thành việc gì?                |
| Emotional job    | Họ muốn cảm thấy thế nào?                 |
| Social job       | Họ muốn được người khác nhìn nhận ra sao? |
| Trigger          | Điều gì khiến họ bắt đầu tìm giải pháp?   |
| Success criteria | Khi nào họ thấy giải pháp là thành công?  |

Ví dụ: “Khi cần chạy chiến dịch marketing nhanh, tôi muốn hiểu nhóm khách hàng nào phản ứng tốt nhất để giảm rủi ro đốt ngân sách.”

### D. Goals, motivations, needs

| Nhóm             | Ví dụ                                                    |
| ---------------- | -------------------------------------------------------- |
| Goals            | tiết kiệm thời gian, tăng doanh thu, giảm lỗi, học nhanh |
| Motivations      | được công nhận, tăng hiệu suất, tránh rủi ro             |
| Key needs        | onboarding dễ, support tốt, giá minh bạch                |
| Desired outcomes | chuyển đổi cao hơn, quy trình nhanh hơn                  |

Delve có các module như goals, motivations, key needs, jobs to be done. ([Delve AI][5])

### E. Pain points, barriers, objections

| Nhóm        | Ví dụ                                                                |
| ----------- | -------------------------------------------------------------------- |
| Pain points | mất thời gian, thiếu dữ liệu, quy trình thủ công                     |
| Barriers    | giá cao, khó tích hợp, không tin AI                                  |
| Objections  | “AI trả lời có đáng tin không?”, “Có thay thế được user thật không?” |
| Anxiety     | sợ quyết định sai, sợ dữ liệu không bảo mật                          |

Delve cũng đưa vào core challenges, day-to-day pain points, perceived barriers. ([Delve AI][5])

### F. Buying behavior / decision behavior

| Nhóm                | Thuộc tính                                              |
| ------------------- | ------------------------------------------------------- |
| Purchase triggers   | sự kiện khiến họ mua                                    |
| Evaluation criteria | giá, tính năng, thương hiệu, tích hợp, bảo mật          |
| Decision style      | nhanh/chậm, lý trí/cảm tính, thích thử nghiệm/né rủi ro |
| Buying stage        | awareness, consideration, decision, retention           |
| Role in decision    | user, recommender, buyer, approver                      |
| Price sensitivity   | cao/thấp, willingness to pay                            |
| Switching cost      | thấp/cao                                                |

Delve có buying behavior, purchase decision factors, triggers, role in buying committee, role in decision-making process. ([Delve AI][5])

### G. Psychographics

| Nhóm           | Thuộc tính                                                                      |
| -------------- | ------------------------------------------------------------------------------- |
| Personality    | Big Five: openness, conscientiousness, extraversion, agreeableness, neuroticism |
| Values         | tiết kiệm, đổi mới, an toàn, địa vị, tiện lợi                                   |
| Attitude       | cởi mở với AI hay hoài nghi                                                     |
| Risk tolerance | thích thử cái mới hay cần bằng chứng                                            |
| Emotion model  | cảm xúc tích cực/tiêu cực, mức hưng phấn/thờ ơ                                  |

Delve có module Big Five và emotion theo 2-D valence-arousal model. ([Delve AI][5])

### H. Channel, media, influence

| Nhóm                     | Thuộc tính                                          |
| ------------------------ | --------------------------------------------------- |
| Communication preference | email, social, phone, chat, webinar                 |
| Social networks          | Facebook, TikTok, LinkedIn, YouTube                 |
| News sources             | báo, blog, cộng đồng, newsletter                    |
| Influencers / brands     | người ảnh hưởng, thương hiệu họ theo dõi            |
| Hashtags / topics        | chủ đề họ quan tâm                                  |
| Content format           | video, case study, how-to guide, comparison, review |

Delve nêu rõ các phần như communication preferences, news sources, social networks, brands, hashtags, visited websites, tools, content formats. ([Delve AI][5])

### I. Product / service fit

| Nhóm             | Câu hỏi                              |
| ---------------- | ------------------------------------ |
| Feature interest | Persona này thích tính năng nào?     |
| Use case         | Họ dùng sản phẩm để làm gì?          |
| Must-have        | Tính năng bắt buộc                   |
| Nice-to-have     | Tính năng phụ                        |
| Deal breaker     | Điều gì khiến họ không mua?          |
| Alternative      | Họ đang dùng giải pháp nào thay thế? |

### J. Customer journey map

Tối thiểu nên có:

| Stage         | Nội dung                             |
| ------------- | ------------------------------------ |
| Awareness     | Họ nhận ra vấn đề thế nào?           |
| Research      | Họ tìm thông tin ở đâu?              |
| Consideration | Họ so sánh lựa chọn nào?             |
| Purchase      | Điều gì khiến họ quyết định?         |
| Onboarding    | Trở ngại khi bắt đầu dùng            |
| Retention     | Vì sao họ tiếp tục dùng hoặc rời bỏ  |
| Advocacy      | Khi nào họ giới thiệu cho người khác |

Delve cũng có sample customer journey map với stages, touchpoints, goals, challenges, needs, KPIs. ([Delve AI][5])

### K. Evidence & confidence

Đây là phần bạn nên làm khác biệt.

| Thuộc tính       | Ý nghĩa                                                  |
| ---------------- | -------------------------------------------------------- |
| Evidence source  | CRM, survey, interview, review, analytics, public source |
| Confidence score | mức tin cậy của từng insight                             |
| Last updated     | lần cập nhật gần nhất                                    |
| Data freshness   | dữ liệu mới/cũ                                           |
| Contradictions   | insight nào đang mâu thuẫn                               |
| Assumptions      | AI tự suy luận phần nào                                  |
| Human validated? | đã có người thật xác nhận chưa                           |

### L. Simulation profile

Đây là phần dành riêng cho “persona giả lập”.

| Thuộc tính                     | Ý nghĩa                                          |
| ------------------------------ | ------------------------------------------------ |
| Backstory                      | mô tả nhân vật                                   |
| Memory facts                   | các facts ổn định                                |
| Decision rules                 | cách persona ra quyết định                       |
| Response style                 | ngắn/dài, lý trí/cảm xúc, kỹ thuật/đời thường    |
| Randomness                     | mức đa dạng câu trả lời                          |
| Consistency constraints        | không được tự mâu thuẫn với profile              |
| Bias profile                   | thiên hướng giá rẻ, thương hiệu, tốc độ, bảo mật |
| Refusal / uncertainty behavior | khi không đủ thông tin thì trả lời thế nào       |

---

## 3. Các loại research, survey, testing khả thi cho nhiều personas

Bạn có thể chia thành 7 nhóm nghiệp vụ.

### Nhóm 1: Problem discovery / pain point research

Dùng để hiểu vấn đề, nhu cầu, động lực.

Phương pháp khả thi:

| Method                | Mục tiêu                      | Output                         |
| --------------------- | ----------------------------- | ------------------------------ |
| Synthetic interview   | Hỏi sâu từng persona          | transcript, pain points, quote |
| JTBD interview        | Hiểu job, trigger, outcome    | job stories                    |
| Need discovery survey | Định lượng nhu cầu            | ranking pain points            |
| Barrier research      | Vì sao chưa mua/chưa dùng     | objections, blockers           |
| Follow-up probing     | Hỏi tiếp dựa trên câu trả lời | reasoning sâu hơn              |

Phù hợp khi bạn đang ở giai đoạn tìm ý tưởng sản phẩm, thông điệp hoặc tính năng.

### Nhóm 2: Concept testing

Dùng để test ý tưởng sản phẩm, landing page, campaign, chính sách, offer.

| Method                 | Ví dụ                                  |
| ---------------------- | -------------------------------------- |
| Monadic test           | Mỗi persona xem 1 concept và đánh giá  |
| Sequential monadic     | Một persona xem nhiều concept lần lượt |
| A/B concept test       | So sánh Concept A vs B                 |
| Message resonance test | Thông điệp nào thuyết phục hơn         |
| Objection mining       | Persona phản đối điểm nào              |
| Purchase intent survey | “Bạn có khả năng mua không?”           |

Delve Synthetic Research cũng nói có thể customize study cho problem exploration, concept testing, campaign validation. ([Delve AI][8])

### Nhóm 3: Pricing research

Cẩn thận: synthetic personas chỉ nên dùng để **tham khảo ban đầu**, không nên dùng làm bằng chứng định giá cuối cùng.

| Method                           | Mục tiêu                         |
| -------------------------------- | -------------------------------- |
| Willingness-to-pay hỏi trực tiếp | Ước lượng khoảng giá             |
| Gabor-Granger                    | Hỏi khả năng mua tại các mức giá |
| Van Westendorp                   | Quá rẻ, hợp lý, đắt, quá đắt     |
| Price objection interview        | Vì sao giá này bị từ chối        |
| Package testing                  | So sánh gói Basic/Pro/Enterprise |

### Nhóm 4: Feature prioritization / product testing

| Method            | Mục tiêu                               |
| ----------------- | -------------------------------------- |
| Feature ranking   | Xếp hạng tính năng quan trọng          |
| Top-K selection   | Chọn 3 tính năng quan trọng nhất       |
| Budget allocation | Cho 100 điểm, phân bổ vào tính năng    |
| Kano survey       | Must-have, performance, delighter      |
| MaxDiff           | Tính năng nào quan trọng hơn tương đối |
| Roadmap reaction  | Persona phản ứng với roadmap           |

Expected Parrot có các dạng câu hỏi như rank, top-k, numerical, matrix, checkbox, Likert, free text, phù hợp để xây các bài test này. ([Expected Parrot][4])

### Nhóm 5: Marketing / content / ad testing

| Method                 | Mục tiêu                          |
| ---------------------- | --------------------------------- |
| Ad copy testing        | Mẫu quảng cáo nào thuyết phục hơn |
| Landing page review    | Điểm nào gây tin tưởng/nghi ngờ   |
| Email subject test     | Subject nào dễ mở hơn             |
| Value proposition test | Proposition nào rõ nhất           |
| CTA testing            | CTA nào khiến persona hành động   |
| Channel fit test       | Persona hợp kênh nào              |

Delve Digital Twin nói có thể hỏi feedback tức thì về campaign, product, pricing, jobs-to-be-done, pain points, content preferences. ([Delve AI][7])

### Nhóm 6: UX / usability simulation

Dùng được nhưng phải ghi rõ là **AI-based usability hypothesis**, không phải usability test thật.

| Method                    | Mục tiêu                               |
| ------------------------- | -------------------------------------- |
| Task walkthrough          | Persona thử mô tả cách hoàn thành task |
| Comprehension test        | Persona hiểu màn hình/flow không       |
| Friction detection        | Điểm nào gây khó hiểu                  |
| First impression test     | Ấn tượng đầu tiên                      |
| Navigation expectation    | Persona mong nút/chức năng nằm ở đâu   |
| Error recovery simulation | Khi gặp lỗi, họ làm gì                 |

Không nên quảng cáo rằng phần này thay thế được quan sát người dùng thật, vì AI không có hành vi motor thật, không có attention thật, không có frustration thật như user thật.

### Nhóm 7: Human validation / hybrid research

Đây là lớp khiến sản phẩm nghiêm túc hơn.

| Method                 | Vai trò                                                 |
| ---------------------- | ------------------------------------------------------- |
| Synthetic pilot        | Chạy nhanh với AI personas để phát hiện lỗi câu hỏi     |
| Human survey           | Chạy với người thật để kiểm chứng                       |
| AI vs human comparison | So sánh phân phối câu trả lời                           |
| Calibration            | Điều chỉnh persona dựa trên human data                  |
| Confidence report      | Gắn nhãn insight nào đáng tin, insight nào cần validate |

Expected Parrot hỗ trợ hướng hybrid này: Survey Builder cho phép launch survey với cả AI agents và human respondents, phân tích/visualize/share results, kết hợp human và AI data. ([Expected Parrot][6])

---

## 4. Đề xuất module sản phẩm cho bạn

### Module 1: Project Workspace

Người dùng tạo một project nghiên cứu:

| Field           | Ví dụ                                                 |
| --------------- | ----------------------------------------------------- |
| Project name    | “Test app học tiếng Anh cho sinh viên”                |
| Industry        | EdTech                                                |
| Market          | Việt Nam                                              |
| Objective       | tìm persona, test concept, test pricing               |
| Target audience | sinh viên năm 1–4                                     |
| Data sources    | survey cũ, interview transcript, CSV, website, review |
| Research goal   | chọn thông điệp tốt nhất                              |

### Module 2: Persona Studio

Chức năng:

1. Tạo persona từ mô tả thủ công.
2. Tạo persona từ file research: survey, interview, report, review.
3. Tạo persona từ CRM/CSV.
4. Tạo persona từ web/social/public sources.
5. Tự động phân khúc thành 3–6 personas.
6. Hiển thị persona card + full profile + journey map.
7. Gắn evidence và confidence cho từng insight.
8. Cho phép chỉnh sửa persona.
9. Export PDF/PPT/PNG.

Schema lõi:

```json
{
  "persona_id": "p_student_price_sensitive",
  "name": "Minh - Sinh viên nhạy cảm giá",
  "segment": "Price-sensitive student",
  "demographics": {},
  "context": {},
  "jobs_to_be_done": [],
  "goals": [],
  "pain_points": [],
  "motivations": [],
  "buying_behavior": {},
  "channels": {},
  "content_preferences": [],
  "decision_rules": [],
  "journey_map": [],
  "evidence": [],
  "confidence": {}
}
```

### Module 3: Synthetic Panel Generator

Từ mỗi persona mẹ, sinh ra nhiều respondent con.

Ví dụ:

| Persona mẹ                  | Synthetic respondents |
| --------------------------- | --------------------- |
| “Sinh viên tiết kiệm”       | 100 người             |
| “Sinh viên thích công nghệ” | 80 người              |
| “Phụ huynh chi trả”         | 50 người              |
| “Giảng viên/mentor”         | 20 người              |

Mỗi respondent con cần có biến thiên:

| Nhóm           | Ví dụ                                              |
| -------------- | -------------------------------------------------- |
| Age            | 18–24                                              |
| Location       | Hà Nội, TP.HCM, Đà Nẵng                            |
| Budget         | thấp, trung bình, cao                              |
| Tech savviness | low/medium/high                                    |
| Motivation     | học để thi, học để đi làm, học vì sở thích         |
| Risk attitude  | thích thử app mới hoặc chỉ dùng app quen           |
| Channel        | TikTok, Facebook group, YouTube, bạn bè giới thiệu |

Điểm quan trọng: **respondent con không nên chỉ copy persona mẹ**. Cần có controlled variation.

### Module 4: Study Builder

Các loại study nên có trong MVP:

| Study type             | Mục đích           |
| ---------------------- | ------------------ |
| Survey                 | định lượng         |
| Interview              | định tính          |
| Focus group            | thảo luận nhóm     |
| Concept test           | test ý tưởng       |
| Message test           | test thông điệp    |
| Feature prioritization | ưu tiên tính năng  |
| Pricing test           | test giá sơ bộ     |
| UX walkthrough         | test flow/màn hình |
| A/B test               | so sánh biến thể   |

Expected Parrot là mẫu tốt cho phần question engine vì có nhiều question types và cho phép thiết kế survey có scenarios, agents, models. ([Expected Parrot][4]) ([Expected Parrot][4])

### Module 5: Research Execution Engine

Luồng chạy:

```text
Research goal
→ chọn study type
→ chọn personas / synthetic panel
→ chọn scenarios / variants
→ chọn model
→ run batch
→ collect responses
→ analyze
→ report
→ optional human validation
```

Engine nên có:

| Chức năng              | Vì sao cần                               |
| ---------------------- | ---------------------------------------- |
| Batch run              | chạy hàng trăm personas                  |
| Scenario randomization | chia concept A/B/C                       |
| Conditional logic      | nếu trả lời A thì hỏi tiếp B             |
| Follow-up probing      | hỏi sâu lý do                            |
| Model comparison       | so sánh GPT/Claude/Gemini/local model    |
| Caching                | giảm chi phí                             |
| Token/cost tracking    | kiểm soát ngân sách                      |
| Reproducibility        | lưu prompt, model, seed, version         |
| Guardrail              | tránh persona trả lời vượt ngoài profile |

Expected Parrot có các khái niệm tương tự như remote inference, remote caching, background job, show prompts/rules/flow. ([Expected Parrot][9])

### Module 6: Analysis Dashboard

Cần có 2 lớp phân tích.

**Định lượng:**

| Phân tích          | Ví dụ                                             |
| ------------------ | ------------------------------------------------- |
| Distribution       | 65% chọn concept A                                |
| Segment comparison | Persona A thích giá rẻ, Persona B thích tính năng |
| Ranking            | Top 5 pain points                                 |
| Likert average     | mức đồng ý trung bình                             |
| NPS/CSAT           | điểm hài lòng giả lập                             |
| Cross-tab          | theo persona, location, income                    |
| Outlier            | nhóm phản ứng khác thường                         |

**Định tính:**

| Phân tích            | Ví dụ                       |
| -------------------- | --------------------------- |
| Theme extraction     | các chủ đề lặp lại          |
| Sentiment            | tích cực/tiêu cực/trung lập |
| Quotes               | câu nói đại diện            |
| Objection clustering | nhóm lý do từ chối          |
| Opportunity          | insight có thể hành động    |
| Strategic takeaways  | đề xuất sản phẩm/marketing  |

Delve Synthetic Research nói sau khi study hoàn tất, hệ thống tạo, phân tích, trực quan hóa response; xem analytics, transcripts, summary report, key insights, themes, sentiments, takeaways và hỏi follow-up. ([Delve AI][8])

### Module 7: Validation & Trust Layer

Đây là module nên có ngay từ đầu.

| Thành phần                | Ý nghĩa                                 |
| ------------------------- | --------------------------------------- |
| Source trace              | insight này dựa trên dữ liệu nào        |
| Confidence score          | AI tự tin bao nhiêu                     |
| Assumption label          | đâu là suy luận chưa kiểm chứng         |
| Human validation status   | đã check với người thật chưa            |
| Synthetic limitation note | cảnh báo không thay thế nghiên cứu thật |
| Bias check                | persona có bị stereotype không          |
| Distribution comparison   | so AI answers với human answers         |

Nghiên cứu gần đây cho thấy digital personas có thể cải thiện alignment ở mức phân phối, nhất là với câu hỏi gắn với thuộc tính/giá trị ổn định, nhưng còn hạn chế cho dự đoán từng cá nhân và khó khôi phục cấu trúc đa biến của respondent thật. ([arXiv][11]) Một kết luận thực dụng là synthetic personas hữu ích nhất cho **survey design, early-stage testing, hypothesis generation**, còn các quyết định lớn vẫn cần human validation. ([arXiv][11])

---

## 5. MVP nên làm thế nào?

Theo mình, MVP tốt nhất không nên làm quá rộng. Làm theo thứ tự này:

### MVP 1: Persona + synthetic survey

Chức năng tối thiểu:

1. Tạo project.
2. Tạo 3–5 personas từ mô tả hoặc upload tài liệu.
3. Sinh 50–200 synthetic respondents.
4. Tạo survey với các question types cơ bản:

   * single choice
   * multiple choice
   * Likert scale
   * ranking
   * free text
5. Chạy survey.
6. Dashboard kết quả:

   * tổng quan
   * phân tích theo persona
   * theme từ câu trả lời mở
   * quote tiêu biểu
   * recommendation
7. Export report.

Đây là phần dễ chứng minh giá trị nhất.

### MVP 2: Concept / message testing

Thêm:

1. Upload 2–5 concept / ad copy / landing page text.
2. Chạy A/B/C test trên synthetic panel.
3. So sánh:

   * clarity
   * relevance
   * trust
   * purchase intent
   * objection
   * preferred version
4. Sinh báo cáo: “nên chọn concept nào, vì sao, persona nào thích/không thích.”

### MVP 3: Interview + follow-up

Thêm:

1. Interview 1:1 với từng persona.
2. Auto follow-up dựa trên câu trả lời.
3. Transcript.
4. Extract pain points, needs, objections, JTBD.

### MVP 4: Human validation

Thêm:

1. Public survey link cho người thật.
2. Import human responses.
3. So sánh AI vs human.
4. Calibration persona.

Expected Parrot cũng đi theo hướng này: có Humanize để tạo web survey cho người thật và Prolific integration để chạy nghiên cứu với human participants. ([Expected Parrot][12]) ([Expected Parrot][10])

---

## 6. Khung nghiệp vụ tổng thể nên là

```text
1. Define market / product / objective
   ↓
2. Collect or input data
   ↓
3. Generate / edit personas
   ↓
4. Generate synthetic panel
   ↓
5. Choose research method
   ↓
6. Build survey / interview / test
   ↓
7. Run simulation
   ↓
8. Analyze quantitative + qualitative results
   ↓
9. Generate insights + recommendations
   ↓
10. Validate with human respondents
   ↓
11. Update personas
```

---

## 7. Điểm khác biệt nên định vị

Bạn có thể định vị sản phẩm như sau:

> “Nền tảng tạo persona có căn cứ dữ liệu và chạy nghiên cứu giả lập với nhiều nhóm khách hàng, giúp đội product/marketing test ý tưởng, thông điệp, tính năng và giả thuyết trước khi tốn tiền khảo sát thật.”

Điểm mạnh nên nhấn:

1. **Persona không phải prompt rỗng**: có schema, evidence, confidence.
2. **Synthetic panel có phân phối**: không chỉ 1 chatbot.
3. **Có nhiều research methods**: survey, interview, focus group, concept test, message test, pricing test.
4. **Có phân tích tự động**: theme, sentiment, ranking, segment comparison.
5. **Có human validation**: không tuyên bố thay thế hoàn toàn người thật.
6. **Có auditability**: lưu nguồn dữ liệu, prompt, model, version, confidence.

---

## Kết luận ngắn

Bạn nên học **Delve.ai** ở phần:

* persona detail,
* data enrichment,
* segmentation,
* digital twin,
* synthetic users,
* marketing insight.

Bạn nên học **Expected Parrot** ở phần:

* survey engine,
* question types,
* scenarios,
* agents,
* batch execution,
* human validation,
* result analysis.

Sản phẩm hợp lý nhất là:

> **Persona Studio + Synthetic Panel + Research Builder + Insight Dashboard + Human Validation.**

Nếu làm MVP, hãy bắt đầu bằng **Persona Studio + Synthetic Survey/Concept Test**, vì đây là phần vừa dễ demo, vừa có giá trị thực tế, vừa chưa cần tích hợp quá nhiều dữ liệu phức tạp.

[1]: https://www.delve.ai/ "Delve AI: AI market research + marketing software"
[2]: https://docs.expectedparrot.com/ "Expected Parrot: Tools for AI-Powered Research - EDSL Documentation"
[3]: https://www.delve.ai/ai-persona-generator "AI Persona Generator Software (Free + Paid) | Delve AI"
[4]: https://docs.expectedparrot.com/en/latest/questions "Questions - EDSL Documentation"
[5]: https://www.delve.ai/blog/customer-personas "What Is a Customer Persona? Examples, Uses & Templates"
[6]: https://docs.expectedparrot.com/en/latest/survey_builder "Survey Builder - EDSL Documentation"
[7]: https://www.delve.ai/digital-twin-software "Digital Twin of Customer Software by Delve AI"
[8]: https://www.delve.ai/synthetic-research "Synthetic Research Software by Delve AI"
[9]: https://docs.expectedparrot.com/en/latest/surveys "Surveys - EDSL Documentation"
[10]: https://docs.expectedparrot.com/en/latest/prolific "Prolific studies - EDSL Documentation"
[11]: https://arxiv.org/abs/2605.10659 "When Can Digital Personas Reliably Approximate Human Survey Findings?"
[12]: https://docs.expectedparrot.com/en/latest/humanize "Humanize - EDSL Documentation"
