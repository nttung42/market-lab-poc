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
