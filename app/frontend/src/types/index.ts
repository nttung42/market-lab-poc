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
  jtbd?: {
    functional_job: string;
    emotional_job: string;
    social_job: string;
    success_criteria: string[];
  };
  psychographics?: {
    personality_traits: string[];
    core_values: string[];
    risk_tolerance: string;
    tech_savviness: string;
  };
  product_fit?: {
    must_haves: string[];
    nice_to_haves: string[];
    deal_breakers: string[];
    alternatives: string[];
  };
  journey_map?: {
    stage: string;
    goals: string[];
    pain_points: string[];
    touchpoints: string[];
  }[];
  validation?: {
    is_human_validated: boolean;
    evidence_sources: string[];
    last_validated_at?: string;
  };
  insight_profile?: PersonaInsightProfile;
}

export type PersonaDraft = Omit<Persona, 'id' | 'project_id'>;

export interface WeightedSignal {
  label: string;
  weight: number;
}

export interface PersonaInsightProfile {
  profile_information?: {
    summary: string;
    personal_aspirations: string;
  };
  buying_behavior?: {
    purchase_decision_factors: string[];
    triggers: string[];
  };
  psychological_drivers?: {
    goals: string[];
    motivations: string[];
    key_needs: string[];
  };
  key_obstacles?: {
    core_challenges: string[];
    day_to_day_pain_points: string[];
    perceived_barriers: string[];
  };
  work_lifestyle?: {
    occupation: string;
    industry: string;
    income: string;
    marital_status: string;
    housing_status: string;
  };
  communication?: WeightedSignal[];
  media_digital?: {
    media_news_sources: WeightedSignal[];
    social_networks: WeightedSignal[];
    websites_visited: WeightedSignal[];
    subreddits: string[];
    hashtags: string[];
    content_types: WeightedSignal[];
  };
  brand_commerce?: {
    brands: WeightedSignal[];
    shopping_websites: WeightedSignal[];
    products: WeightedSignal[];
    services: WeightedSignal[];
  };
  preferences?: {
    sports: WeightedSignal[];
    entertainment: WeightedSignal[];
    news: WeightedSignal[];
    places_likely_to_visit: WeightedSignal[];
    events_conferences: WeightedSignal[];
    values: WeightedSignal[];
    hobbies: WeightedSignal[];
    interests: WeightedSignal[];
    tools: WeightedSignal[];
  };
  website_interaction?: {
    first_interaction_day: string;
    first_interaction_time: string;
    influential_resources: WeightedSignal[];
    resonating_topics: WeightedSignal[];
  };
  industry_specific_insights?: {
    apparel_fashion: Record<string, WeightedSignal[]>;
    sporting_goods: Record<string, WeightedSignal[]>;
    consumer_goods: Record<string, WeightedSignal[]>;
  };
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
