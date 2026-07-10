import type { Project, Persona, PersonaDraft, Respondent, Study, Question, StudyResults, QuestionResult, QualitativeTheme } from '../types';
import { mockPersonas, mockProjects, mockRespondents, mockStudies } from '../mocks/mockData';

const clone = <T>(value: T): T => structuredClone(value);
const nowIso = () => new Date().toISOString();
const mockId = (prefix: string) => `${prefix}-${Math.random().toString(16).slice(2, 10)}`;

let projects = clone(mockProjects);
let personas = clone(mockPersonas);
let respondents = clone(mockRespondents);
let studies = clone(mockStudies);

const findProject = (projectId: string) => projects.find((project) => project.id === projectId);
const findPersona = (personaId: string) => personas.find((persona) => persona.id === personaId);
const findStudy = (studyId: string) => studies.find((study) => study.id === studyId);

const notFound = (label: string) => new Error(`Không tìm thấy ${label} trong dữ liệu mô phỏng phía frontend.`);

const slug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

const getProjectScopedPersonas = (projectId: string) =>
  personas.filter((persona) => persona.project_id === projectId);

const getProjectScopedRespondents = (projectId: string) =>
  respondents.filter((respondent) => respondent.project_id === projectId);

const makeGeneratedPersona = (projectId: string, customPrompt: string): Persona => {
  const label = customPrompt.split(/[,.]/)[0]?.trim() || 'Đối tượng tùy chỉnh';
  const name = label
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ') || 'Persona tùy chỉnh';

  return {
    id: `persona-${slug(label) || mockId('persona')}`,
    project_id: projectId,
    name,
    segment: label,
    quote: `Tôi sẽ cân nhắc nếu giá trị đủ rõ với một người như tôi: ${customPrompt}`,
    demographics: ['Tuổi: 22', 'Khu vực: Việt Nam', 'Nghề nghiệp: Hồ sơ mô phỏng', 'Nguồn: Frontend mock'],
    goals: ['Xem sản phẩm có phù hợp nhu cầu hằng ngày không', 'So sánh đề xuất với lựa chọn quen thuộc', 'Giảm bớt do dự trước khi trả tiền'],
    pain_points: ['Giá hoặc giá trị chưa rõ', 'Onboarding quá rườm rà', 'Thông điệp quá chung chung'],
    motivations: ['Tiết kiệm thời gian', 'Tự tin hơn trước khi chọn', 'Thấy tiến bộ nhanh'],
    buying_behavior: ['Đọc review trước', 'So sánh nhiều phương án', 'Thích bắt đầu bằng dùng thử'],
    decision_rules: ['Phải giải thích giá trị nhanh', 'Phải dễ thử', 'Phải tạo cảm giác đáng tin'],
    objections: ['Cần bằng chứng kết quả rõ hơn', 'Có thể quá đắt ở giai đoạn đầu', 'Lo ngại nội dung AI quá chung'],
    channels: ['TikTok', 'Facebook', 'Bạn bè giới thiệu'],
    assumptions: ['Được tạo cục bộ từ prompt mô tả đối tượng', 'Hồ sơ mô phỏng cần xác thực bằng người thật'],
    confidence_score: 72,
    validation: {
      is_human_validated: false,
      evidence_sources: ['Frontend mock generator'],
    },
    insight_profile: {
      profile_information: {
        summary: `Phân khúc mô phỏng được dựng từ prompt: ${customPrompt}`,
        personal_aspirations: 'Tìm ra giải pháp phù hợp, đáng tin và dễ đánh giá trước khi cam kết.',
      },
      buying_behavior: {
        purchase_decision_factors: ['Bằng chứng giá trị rõ ràng', 'Dùng thử ít ma sát', 'Giá minh bạch', 'Xác thực xã hội'],
        triggers: ['Bạn bè giới thiệu', 'Demo ngắn', 'Kết quả trước-sau dễ thấy', 'Ưu đãi giới hạn thân thiện với sinh viên'],
      },
      psychological_drivers: {
        goals: ['Giảm bớt bất định', 'Tiết kiệm thời gian', 'Ra quyết định mua tự tin hơn'],
        motivations: ['Tiện lợi', 'Rõ kết quả', 'Niềm tin'],
        key_needs: ['Onboarding nhanh', 'Ví dụ đáng tin', 'Tình huống sử dụng phù hợp'],
      },
      key_obstacles: {
        core_challenges: ['Thông điệp quá chung', 'Khác biệt chưa rõ', 'Bằng chứng còn yếu'],
        day_to_day_pain_points: ['Khoảng chú ý hạn chế', 'Quá nhiều sản phẩm cạnh tranh', 'Không thích thiết lập phức tạp'],
        perceived_barriers: ['Có thể không hợp bối cảnh riêng', 'Có thể quá đắt', 'Đầu ra AI có thể thiếu cá nhân hóa'],
      },
      communication: [
        { label: 'Thông điệp xoay quanh kết quả', weight: 88 },
        { label: 'Demo ngắn có bằng chứng', weight: 83 },
        { label: 'Chứng thực từ người dùng tương tự', weight: 79 },
      ],
      media_digital: {
        media_news_sources: [
          { label: 'Tìm kiếm trên TikTok', weight: 82 },
          { label: 'Review trên YouTube', weight: 76 },
          { label: 'Cộng đồng Facebook', weight: 70 },
        ],
        social_networks: [
          { label: 'TikTok', weight: 86 },
          { label: 'Facebook', weight: 76 },
          { label: 'Instagram', weight: 68 },
        ],
        websites_visited: [
          { label: 'Tìm kiếm Google', weight: 81 },
          { label: 'Trang app store', weight: 74 },
          { label: 'Website đối thủ', weight: 62 },
        ],
        subreddits: ['r/startups', 'r/productivity'],
        hashtags: ['#congcuaAI', '#nangsuat', '#doisongsinhvien'],
        content_types: [
          { label: 'Bài so sánh nhanh', weight: 84 },
          { label: 'Video demo', weight: 81 },
          { label: 'Trích đoạn review', weight: 77 },
        ],
      },
      website_interaction: {
        first_interaction_day: 'Thứ tư',
        first_interaction_time: '21:00',
        influential_resources: [
          { label: 'Khối use case trên landing', weight: 86 },
          { label: 'Khối thông tin giá', weight: 80 },
          { label: 'Ví dụ đầu ra', weight: 78 },
        ],
        resonating_topics: [
          { label: 'Thử trước khi trả tiền', weight: 88 },
          { label: 'Đầu ra cá nhân hóa', weight: 82 },
          { label: 'Bước tiếp theo rõ ràng', weight: 75 },
        ],
      },
    },
  };
};

const respondentTemplates = [
  { budget: 'Low', tech_savviness: 'Medium', risk_attitude: 'Risk-averse', location: 'Hanoi, Vietnam' },
  { budget: 'Medium', tech_savviness: 'High', risk_attitude: 'Neutral', location: 'Ho Chi Minh City, Vietnam' },
  { budget: 'High', tech_savviness: 'High', risk_attitude: 'Risk-seeking', location: 'Da Nang, Vietnam' },
  { budget: 'Medium', tech_savviness: 'Medium', risk_attitude: 'Neutral', location: 'Can Tho, Vietnam' },
];

const buildRespondentsForPersona = (persona: Persona, count: number): Respondent[] =>
  Array.from({ length: count }, (_, index) => {
    const template = respondentTemplates[index % respondentTemplates.length];
    return {
      id: `resp-${slug(persona.name)}-${index + 1}-${Math.random().toString(16).slice(2, 6)}`,
      persona_id: persona.id,
      project_id: persona.project_id,
      name: `${persona.name.split(' ')[0]} Mẫu ${index + 1}`,
      age: 18 + ((index + persona.name.length) % 9),
      location: template.location,
      budget: template.budget,
      motivation: persona.motivations[index % persona.motivations.length] || 'Đánh giá giá trị sản phẩm trước khi cam kết.',
      tech_savviness: template.tech_savviness,
      risk_attitude: template.risk_attitude,
      channel: persona.channels[index % persona.channels.length] || 'Mạng xã hội',
      decision_rules: persona.decision_rules.slice(0, 2),
    };
  });

const choiceIndexForRespondent = (respondent: Respondent, optionsLength: number) => {
  const persona = findPersona(respondent.persona_id);
  if (!persona || optionsLength === 0) {
    return 0;
  }

  if (persona.id === 'persona-price-sensitive') {
    return Math.max(0, optionsLength - 1);
  }
  if (persona.id === 'persona-career-focused') {
    return Math.min(1, optionsLength - 1);
  }
  if (persona.id === 'persona-casual-learner') {
    return Math.min(2, optionsLength - 1);
  }

  return respondent.id.length % optionsLength;
};

const buildQuestionResult = (question: Question, scopedRespondents: Respondent[]): QuestionResult => {
  if (question.type === 'likert') {
    const counts = [0, 0, 0, 0, 0];
    scopedRespondents.forEach((respondent) => {
      const score = respondent.budget === 'Low' ? 5 : respondent.budget === 'Medium' ? 4 : 3;
      counts[score - 1] += 1;
    });
    const totalScore = counts.reduce((sum, count, index) => sum + count * (index + 1), 0);
    const total = scopedRespondents.length;

    return {
      question_id: question.id,
      question_text: question.text,
      question_type: question.type,
      total_responses: total,
      average_rating: total ? Number((totalScore / total).toFixed(2)) : 0,
      results: counts.map((count, index) => {
        const labels = ['Hoàn toàn không đồng ý (1)', 'Không đồng ý (2)', 'Trung lập (3)', 'Đồng ý (4)', 'Hoàn toàn đồng ý (5)'];
        return {
          option: labels[index],
          count,
          percentage: total ? Number(((count / total) * 100).toFixed(1)) : 0,
        };
      }),
    };
  }

  if (question.type === 'single_choice' || question.type === 'multi_choice') {
    const counts = question.options.map(() => 0);
    scopedRespondents.forEach((respondent) => {
      const selectedIndex = choiceIndexForRespondent(respondent, question.options.length);
      if (typeof counts[selectedIndex] === 'number') {
        counts[selectedIndex] += 1;
      }
      if (question.type === 'multi_choice' && question.options.length > 1 && respondent.tech_savviness === 'High') {
        counts[(selectedIndex + 1) % question.options.length] += 1;
      }
    });
    const total = scopedRespondents.length;

    return {
      question_id: question.id,
      question_text: question.text,
      question_type: question.type,
      total_responses: total,
      average_rating: 0,
      results: question.options.map((option, index) => ({
        option: option.text,
        count: counts[index] || 0,
        percentage: total ? Number((((counts[index] || 0) / total) * 100).toFixed(1)) : 0,
      })),
    };
  }

  return {
    question_id: question.id,
    question_text: question.text,
    question_type: question.type,
    total_responses: scopedRespondents.length,
    average_rating: 0,
    results: [],
  };
};

const buildQualitativeThemes = (projectId: string, scopedRespondents: Respondent[]): QualitativeTheme[] =>
  getProjectScopedPersonas(projectId).map((persona) => {
    const samples = scopedRespondents.filter((respondent) => respondent.persona_id === persona.id).slice(0, 3);
    const quoteBank = persona.id === 'persona-price-sensitive'
      ? [
          'Mình sẽ thử nếu gói miễn phí đủ hữu ích trước khi bắt đầu thu phí.',
          'Mức giá có thể chấp nhận được, nhưng mình cần chắc rằng không có bẫy tự gia hạn.',
          'Hãy cho mình thấy một cải thiện rõ ràng ngay sau buổi đầu và mình sẽ tiếp tục dùng.',
        ]
      : persona.id === 'persona-career-focused'
        ? [
            'Module phỏng vấn phải đủ nghiêm túc chứ không giống một trò chơi ngôn ngữ.',
            'Mình quan tâm ngữ pháp, phát âm và từ vựng công việc hơn là các streak dễ thương.',
            'Nếu báo cáo giúp mình chuẩn bị phỏng vấn thực tập tốt hơn thì mình sẵn sàng trả phí.',
          ]
        : persona.id === 'persona-casual-learner'
          ? [
              'Mình muốn cảm giác như đang trò chuyện với một người hướng dẫn thân thiện chứ không phải làm bài tập về nhà.',
              'Các trò luyện nói ngắn mỗi ngày sẽ khiến mình quay lại sau giờ học.',
              'Giọng AI phải tự nhiên, nếu không mình sẽ dừng sau vài lần thử.',
            ]
          : [
              'Mình cần hiểu nó phù hợp với thói quen hằng ngày thế nào trước khi cam kết.',
              'Giá trị phải rõ ngay từ lần tương tác đầu tiên.',
              'Mình sẽ so sánh với các lựa chọn quen thuộc trước khi trả tiền.',
            ];

    return {
      theme: `Phản hồi và phản đối của nhóm ${persona.segment}`,
      description: `Nhóm mô phỏng của ${persona.name} phản ứng dựa trên mục tiêu ${persona.goals[0]?.toLowerCase() || 'chính của họ'}, đồng thời cân nhắc niềm tin, giá và mức độ phù hợp.`,
      objections: persona.objections.slice(0, 3),
      quotes: samples.length
        ? samples.map((respondent, index) => `"${quoteBank[index % quoteBank.length]}" - ${respondent.name}`)
        : [`"Mình cần thấy giá trị thật rõ trước khi cam kết." - ${persona.name}`],
    };
  });

const buildStudyResults = (studyId: string): StudyResults => {
  const study = findStudy(studyId);
  if (!study) {
    throw notFound('Study');
  }

  const scopedRespondents = getProjectScopedRespondents(study.project_id);

  return {
    study_id: study.id,
    total_respondents: scopedRespondents.length,
    quantitative: (study.questions || []).map((question) => buildQuestionResult(question, scopedRespondents)),
    qualitative_themes: buildQualitativeThemes(study.project_id, scopedRespondents),
    recommendations: [
      {
        priority: 'High',
        title: 'Tách định vị thành hai hướng rõ ràng',
        details: 'Dùng hai góc thu hút riêng cho nhu cầu luyện tập hằng ngày tiết kiệm và nhu cầu chuẩn bị phỏng vấn mang tính sự nghiệp. Một thông điệp duy nhất hiện tại quá rộng cho các phân khúc mạnh nhất.',
      },
      {
        priority: 'High',
        title: 'Hiển thị bằng chứng giá trị ngay buổi đầu',
        details: 'Cho người dùng thấy điểm phát âm trước-sau, một câu được sửa và gợi ý bước tiếp theo trước bất kỳ lời nhắc thanh toán nào để giảm hoài nghi với phản hồi AI.',
      },
      {
        priority: 'Medium',
        title: 'Biến giá thành tín hiệu tạo niềm tin',
        details: 'Nhấn mạnh gói sinh viên nội địa hóa, dùng thử không cần thẻ và nội dung hủy gói thật rõ ràng. Điều này biến nỗi lo về giá thành lợi thế tin cậy cho nhóm Minh Thu.',
      },
      {
        priority: 'Medium',
        title: 'Tạo biến thể creative theo từng kênh',
        details: 'Dùng video demo của creator trên TikTok cho nhóm học thoải mái, ảnh báo cáo kiểu LinkedIn cho nhóm định hướng sự nghiệp và bài viết chứng thực trong nhóm sinh viên Facebook cho nhóm nhạy cảm về giá.',
      },
    ],
  };
};

export async function getProjects(): Promise<Project[]> {
  return clone(projects.map((project) => ({
    ...project,
    personas: getProjectScopedPersonas(project.id),
  })));
}

export async function getProject(projectId: string): Promise<Project> {
  const project = findProject(projectId);
  if (!project) {
    throw notFound('Project');
  }

  return clone({
    ...project,
    personas: getProjectScopedPersonas(project.id),
  });
}

export async function getProjectPersonas(projectId: string): Promise<Persona[]> {
  if (!findProject(projectId)) {
    throw notFound('Project');
  }

  return clone(getProjectScopedPersonas(projectId));
}

export async function getPersona(personaId: string): Promise<Persona> {
  const persona = findPersona(personaId);
  if (!persona) {
    throw notFound('Persona');
  }

  return clone(persona);
}

export async function generateRespondents(projectId: string, countPerPersona: number): Promise<Respondent[]> {
  const scopedPersonas = getProjectScopedPersonas(projectId);
  respondents = respondents.filter((respondent) => respondent.project_id !== projectId);
  respondents = [
    ...respondents,
    ...scopedPersonas.flatMap((persona) => buildRespondentsForPersona(persona, countPerPersona)),
  ];

  return clone(getProjectScopedRespondents(projectId));
}

export async function getProjectRespondents(projectId: string): Promise<Respondent[]> {
  if (!findProject(projectId)) {
    throw notFound('Project');
  }

  return clone(getProjectScopedRespondents(projectId));
}

export async function getProjectStudies(projectId: string): Promise<Study[]> {
  if (!findProject(projectId)) {
    throw notFound('Project');
  }

  return clone(studies.filter((study) => study.project_id === projectId));
}

export async function createStudy(projectId: string, title: string): Promise<Study> {
  if (!findProject(projectId)) {
    throw notFound('Project');
  }

  const study: Study = {
    id: mockId('study'),
    project_id: projectId,
    title,
    status: 'draft',
    created_at: nowIso(),
    questions: [],
  };
  studies = [study, ...studies];

  return clone(study);
}

export async function getStudy(studyId: string): Promise<Study> {
  const study = findStudy(studyId);
  if (!study) {
    throw notFound('Study');
  }

  return clone(study);
}

export async function addQuestion(
  studyId: string,
  question: { id: string; text: string; type: string; position: number; options: { id: string; text: string; value: string }[] },
): Promise<Question> {
  const study = findStudy(studyId);
  if (!study) {
    throw notFound('Study');
  }

  const typedQuestion: Question = {
    id: question.id,
    study_id: studyId,
    text: question.text,
    type: question.type as Question['type'],
    position: question.position,
    options: question.options.map((option, index) => ({
      id: option.id,
      question_id: question.id,
      text: option.text,
      value: option.value,
      position: index,
    })),
  };

  study.questions = [...(study.questions || []), typedQuestion];
  return clone(typedQuestion);
}

export async function runStudy(studyId: string, personaIds: string[]): Promise<Respondent[]> {
  const study = findStudy(studyId);
  if (!study) {
    throw notFound('Study');
  }

  study.status = 'completed';
  if (getProjectScopedRespondents(study.project_id).length === 0) {
    const selected = personaIds.length
      ? personas.filter((persona) => personaIds.includes(persona.id))
      : getProjectScopedPersonas(study.project_id);
    respondents = [
      ...respondents,
      ...selected.flatMap((persona) => buildRespondentsForPersona(persona, 5)),
    ];
  }

  return clone(getProjectScopedRespondents(study.project_id));
}

export async function getStudyResults(studyId: string): Promise<StudyResults> {
  return clone(buildStudyResults(studyId));
}

export async function createProject(project: Omit<Project, 'id' | 'is_seeded' | 'created_at'>): Promise<Project> {
  const created: Project = {
    ...project,
    id: mockId('project'),
    is_seeded: false,
    created_at: nowIso(),
  };
  projects = [created, ...projects];

  return clone(created);
}

export async function updateProject(projectId: string, project: Omit<Project, 'id' | 'is_seeded' | 'created_at'>): Promise<Project> {
  const current = findProject(projectId);
  if (!current) {
    throw notFound('Project');
  }

  const updated = { ...current, ...project };
  projects = projects.map((item) => (item.id === projectId ? updated : item));

  return clone(updated);
}

export async function deleteProject(projectId: string): Promise<void> {
  projects = projects.filter((project) => project.id !== projectId);
  personas = personas.filter((persona) => persona.project_id !== projectId);
  respondents = respondents.filter((respondent) => respondent.project_id !== projectId);
  studies = studies.filter((study) => study.project_id !== projectId);
}

export async function createPersona(projectId: string, persona: Omit<Persona, 'id' | 'project_id'>): Promise<Persona> {
  if (!findProject(projectId)) {
    throw notFound('Project');
  }

  const created: Persona = {
    ...persona,
    id: mockId('persona'),
    project_id: projectId,
  };
  personas = [created, ...personas];

  return clone(created);
}

export async function generatePersonaDraft(_projectId: string, customPrompt: string): Promise<PersonaDraft> {
  const generated = makeGeneratedPersona('draft-project', customPrompt);
  return clone({
    name: generated.name,
    segment: generated.segment,
    quote: generated.quote,
    demographics: generated.demographics,
    goals: generated.goals,
    pain_points: generated.pain_points,
    motivations: generated.motivations,
    buying_behavior: generated.buying_behavior,
    decision_rules: generated.decision_rules,
    objections: generated.objections,
    channels: generated.channels,
    assumptions: generated.assumptions,
    confidence_score: generated.confidence_score,
    jtbd: generated.jtbd,
    psychographics: generated.psychographics,
    product_fit: generated.product_fit,
    journey_map: generated.journey_map,
    validation: generated.validation,
    insight_profile: generated.insight_profile,
  });
}

export async function generatePersona(projectId: string, customPrompt: string): Promise<Persona> {
  if (!findProject(projectId)) {
    throw notFound('Project');
  }

  const generated = makeGeneratedPersona(projectId, customPrompt);
  const uniquePersona = personas.some((persona) => persona.id === generated.id)
    ? { ...generated, id: mockId('persona') }
    : generated;
  personas = [uniquePersona, ...personas];

  return clone(uniquePersona);
}

export async function updatePersona(personaId: string, persona: Omit<Persona, 'id' | 'project_id'>): Promise<Persona> {
  const current = findPersona(personaId);
  if (!current) {
    throw notFound('Persona');
  }

  const updated = { ...current, ...persona };
  personas = personas.map((item) => (item.id === personaId ? updated : item));

  return clone(updated);
}

export async function deletePersona(personaId: string): Promise<void> {
  personas = personas.filter((persona) => persona.id !== personaId);
  respondents = respondents.filter((respondent) => respondent.persona_id !== personaId);
}

export async function updateStudy(studyId: string, title: string): Promise<Study> {
  const current = findStudy(studyId);
  if (!current) {
    throw notFound('Study');
  }

  const updated = { ...current, title };
  studies = studies.map((study) => (study.id === studyId ? updated : study));

  return clone(updated);
}

export async function deleteStudy(studyId: string): Promise<void> {
  studies = studies.filter((study) => study.id !== studyId);
}
