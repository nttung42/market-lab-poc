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
  runningStudies: Study[];
  totalQuestions: number;
  avgConfidence: number;
  readinessSteps: Array<{ label: string; complete: boolean; value: string }>;
  readinessPercent: number;
  latestStudy: Study | null;
  topChannels: string[];
  personaHighlights: Persona[];
  statusTone: string;
  respondentsPerPersona: Array<{
    id: string;
    name: string;
    segment: string;
    count: number;
    confidenceScore: number;
    topChannel: string;
    primaryNeed: string;
  }>;
  channelMix: Array<{
    label: string;
    value: number;
    share: number;
  }>;
  studyTimeline: Array<{
    id: string;
    title: string;
    status: Study['status'];
    createdAt: string;
    questionCount: number;
  }>;
  highlights: Array<{
    title: string;
    detail: string;
    tone: 'info' | 'success' | 'warning';
  }>;
  nextActions: string[];
  recentActivities: Array<{
    id: string;
    title: string;
    detail: string;
    timestamp?: string;
  }>;
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
