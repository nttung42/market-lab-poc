import type { Persona, Project, Respondent, Study } from '../../types';

export type ProjectOverviewMode = 'list' | 'detail' | 'create' | 'edit';

export type WorkspaceSuggestion = {
  label: string;
  name: string;
  product_description: string;
  industry: string;
  market: string;
  target_audience: string;
  research_objective: string;
  study_type: string;
};

export type ProjectFormValues = {
  name: string;
  product_description: string;
  industry: string;
  market: string;
  target_audience: string;
  research_objective: string;
  study_type: string;
};

export interface ProjectOverviewProps {
  activeProjectId: string | null;
  mode: ProjectOverviewMode;
  onSelectProject: (projectId: string | null) => void;
  onProjectsChanged: () => void;
  onNavigateToPersonas: () => void;
  onCreateProject: () => void;
  onEditProject: (projectId: string) => void;
  onClose?: () => void;
}

export interface ProjectOverviewDetailMetrics {
  completedStudies: Study[];
  draftStudies: Study[];
  totalQuestions: number;
  avgConfidence: number;
  readinessSteps: Array<{ label: string; complete: boolean; value: string }>;
  readinessPercent: number;
  latestStudy: Study | null;
  topChannels: string[];
  personaHighlights: Persona[];
  statusTone: string;
}

export interface ProjectOverviewDetailViewProps {
  project: Project;
  personas: Persona[];
  respondents: Respondent[];
  studies: Study[];
  metrics: ProjectOverviewDetailMetrics;
  onNavigateToPersonas: () => void;
  onEditProject: (projectId: string) => void;
  onSelectProject: (projectId: string | null) => void;
}
