export interface Persona {
  id: string;
  project_id: string;
  name: string;
  segment: string;
  quote: string;
  demographics: string[];
  goals: string[];
  pain_points: string[];
  motivations: string[];
  buying_behavior: string[];
  decision_rules: string[];
  objections: string[];
  channels: string[];
  assumptions: string[];
  confidence_score: number;
}

export interface Project {
  id: string;
  name: string;
  product_description: string;
  industry: string;
  market: string;
  target_audience: string;
  research_objective: string;
  study_type: string;
  is_seeded: boolean;
  created_at: string;
  personas?: Persona[];
}

export interface Respondent {
  id: string;
  persona_id: string;
  project_id: string;
  name: string;
  age: number;
  location: string;
  budget: string;
  motivation: string;
  tech_savviness: string;
  risk_attitude: string;
  channel: string;
  decision_rules: string[];
}

export interface QuestionOption {
  id: string;
  question_id: string;
  text: string;
  value: string;
  position: number;
}

export interface Question {
  id: string;
  study_id: string;
  text: string;
  type: 'single_choice' | 'multi_choice' | 'likert' | 'open_text';
  position: number;
  options: QuestionOption[];
}

export interface Study {
  id: string;
  project_id: string;
  title: string;
  status: 'draft' | 'running' | 'completed';
  created_at: string;
  questions?: Question[];
}

export interface ChoiceResult {
  option: string;
  count: number;
  percentage: number;
}

export interface QuestionResult {
  question_id: string;
  question_text: string;
  question_type: string;
  total_responses: number;
  results: ChoiceResult[];
  average_rating?: number;
}

export interface QualitativeTheme {
  theme: string;
  description: string;
  objections: string[];
  quotes: string[];
}

export interface RecommendationItem {
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  details: string;
}

export interface StudyResults {
  study_id: string;
  total_respondents: number;
  quantitative: QuestionResult[];
  qualitative_themes: QualitativeTheme[];
  recommendations: RecommendationItem[];
}


