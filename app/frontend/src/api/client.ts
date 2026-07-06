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

const notFound = (label: string) => new Error(`${label} not found in frontend mock data.`);

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
  const label = customPrompt.split(/[,.]/)[0]?.trim() || 'Custom audience';
  const name = label
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ') || 'Custom Persona';

  return {
    id: `persona-${slug(label) || mockId('persona')}`,
    project_id: projectId,
    name,
    segment: label,
    quote: `I would consider this if the value is clear for someone like me: ${customPrompt}`,
    demographics: ['Age: 22', 'Location: Vietnam', 'Occupation: Synthetic respondent profile', 'Source: Frontend mock'],
    goals: ['Understand whether the product fits daily needs', 'Compare the offer against familiar alternatives', 'Reduce decision uncertainty before paying'],
    pain_points: ['Unclear pricing or value proof', 'Too much onboarding friction', 'Generic messaging that does not match the situation'],
    motivations: ['Save time', 'Feel confident before choosing', 'See visible progress quickly'],
    buying_behavior: ['Reads reviews first', 'Compares alternatives', 'Starts with a trial before committing'],
    decision_rules: ['Must explain value quickly', 'Must be easy to try', 'Must feel trustworthy'],
    objections: ['Needs stronger proof of outcomes', 'May be too expensive for early use', 'Concerned about generic AI output'],
    channels: ['TikTok', 'Facebook', 'Peer recommendation'],
    assumptions: ['Generated locally from the typed audience prompt', 'Synthetic profile requiring human validation'],
    confidence_score: 72,
    validation: {
      is_human_validated: false,
      evidence_sources: ['Frontend mock generator'],
    },
    insight_profile: {
      profile_information: {
        summary: `A synthetic segment modeled from the prompt: ${customPrompt}`,
        personal_aspirations: 'Find a solution that feels relevant, trustworthy, and easy to evaluate before committing.',
      },
      buying_behavior: {
        purchase_decision_factors: ['Clear proof of value', 'Low-friction trial', 'Transparent pricing', 'Social validation'],
        triggers: ['Peer recommendation', 'Short demo', 'Visible before-after outcome', 'Limited-time student-friendly offer'],
      },
      psychological_drivers: {
        goals: ['Reduce uncertainty', 'Save time', 'Make a confident purchase decision'],
        motivations: ['Convenience', 'Outcome clarity', 'Trust'],
        key_needs: ['Fast onboarding', 'Credible examples', 'Relevant use cases'],
      },
      key_obstacles: {
        core_challenges: ['Generic messaging', 'Unclear differentiation', 'Weak proof points'],
        day_to_day_pain_points: ['Limited attention', 'Many competing products', 'Low tolerance for setup work'],
        perceived_barriers: ['May not fit my specific context', 'Could be too expensive', 'AI output may feel generic'],
      },
      communication: [
        { label: 'Outcome-led messaging', weight: 88 },
        { label: 'Short proof demos', weight: 83 },
        { label: 'Peer testimonials', weight: 79 },
      ],
      media_digital: {
        media_news_sources: [
          { label: 'TikTok search', weight: 82 },
          { label: 'YouTube reviews', weight: 76 },
          { label: 'Facebook communities', weight: 70 },
        ],
        social_networks: [
          { label: 'TikTok', weight: 86 },
          { label: 'Facebook', weight: 76 },
          { label: 'Instagram', weight: 68 },
        ],
        websites_visited: [
          { label: 'Google search', weight: 81 },
          { label: 'App store pages', weight: 74 },
          { label: 'Competitor websites', weight: 62 },
        ],
        subreddits: ['r/startups', 'r/productivity'],
        hashtags: ['#aitools', '#productivity', '#studentlife'],
        content_types: [
          { label: 'Quick comparison posts', weight: 84 },
          { label: 'Demo videos', weight: 81 },
          { label: 'Review snippets', weight: 77 },
        ],
      },
      website_interaction: {
        first_interaction_day: 'Wednesday',
        first_interaction_time: '21:00',
        influential_resources: [
          { label: 'Use-case landing section', weight: 86 },
          { label: 'Pricing block', weight: 80 },
          { label: 'Example output', weight: 78 },
        ],
        resonating_topics: [
          { label: 'Try before paying', weight: 88 },
          { label: 'Personalized output', weight: 82 },
          { label: 'Clear next step', weight: 75 },
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
      name: `${persona.name.split(' ')[0]} Mock ${index + 1}`,
      age: 18 + ((index + persona.name.length) % 9),
      location: template.location,
      budget: template.budget,
      motivation: persona.motivations[index % persona.motivations.length] || 'Evaluate the product value before committing.',
      tech_savviness: template.tech_savviness,
      risk_attitude: template.risk_attitude,
      channel: persona.channels[index % persona.channels.length] || 'Social Media',
      decision_rules: persona.decision_rules.slice(0, 2),
    };
  });

const choiceIndexForRespondent = (respondent: Respondent, optionsLength: number) => {
  const persona = findPersona(respondent.persona_id);
  if (!persona || optionsLength === 0) {
    return 0;
  }

  const segment = persona.segment.toLowerCase();
  if (segment.includes('price')) {
    return Math.max(0, optionsLength - 1);
  }
  if (segment.includes('career')) {
    return Math.min(1, optionsLength - 1);
  }
  if (segment.includes('casual')) {
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
        const labels = ['Strongly Disagree (1)', 'Disagree (2)', 'Neutral (3)', 'Agree (4)', 'Strongly Agree (5)'];
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
    const segment = persona.segment.toLowerCase();
    const quoteBank = segment.includes('price')
      ? [
          'I would try it if the free tier is useful enough before asking me to pay.',
          'The price can work, but I need to know there is no automatic renewal trap.',
          'Show me one clear improvement after the first session and I will keep using it.',
        ]
      : segment.includes('career')
        ? [
            'The interview module has to feel serious, not like a casual language game.',
            'I care less about cute streaks and more about grammar, pronunciation, and professional vocabulary.',
            'If the report helps me prepare for an internship interview, I can justify paying.',
          ]
        : segment.includes('casual')
          ? [
              'I want it to feel like chatting with a friendly coach, not doing homework.',
              'Short daily speaking games would keep me coming back after class.',
              'The AI voice has to sound natural, otherwise I would stop after a few tries.',
            ]
          : [
              'I need to understand how this fits my routine before I commit.',
              'The value has to be obvious from the first interaction.',
              'I would compare it with familiar alternatives before paying.',
            ];

    return {
      theme: `${persona.segment} Feedback & Objections`,
      description: `${persona.name}'s synthetic cohort reacts through the lens of ${persona.goals[0]?.toLowerCase() || 'their primary goal'}, while weighing trust, price, and fit risks.`,
      objections: persona.objections.slice(0, 3),
      quotes: samples.length
        ? samples.map((respondent, index) => `"${quoteBank[index % quoteBank.length]}" - ${respondent.name}`)
        : [`"I need the value to be obvious before I commit." - ${persona.name}`],
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
        title: 'Create a two-lane positioning system',
        details: 'Use separate acquisition angles for budget-safe daily practice and career-grade interview preparation. The current single message is too broad for the strongest segments.',
      },
      {
        priority: 'High',
        title: 'Make proof visible in the first session',
        details: 'Show a before-after pronunciation score, one corrected phrase, and a next-step recommendation before any payment prompt to reduce skepticism toward AI feedback.',
      },
      {
        priority: 'Medium',
        title: 'Treat pricing as a trust signal',
        details: 'Promote a localized student plan, no-card trial, and explicit cancellation copy. This turns price anxiety into a credibility advantage for the Minh Thu cohort.',
      },
      {
        priority: 'Medium',
        title: 'Use channel-specific creative variants',
        details: 'Run TikTok creator demos for casual learners, LinkedIn-style interview report screenshots for career-focused students, and Facebook student-group proof posts for price-sensitive users.',
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
