import type { LucideIcon } from 'lucide-react';
import type { Project } from '../../types';

export type WorkspaceContextValue = {
  projects: Project[];
  activeProjectId: string | null;
  activeProjectName: string;
  selectedStudyId: string;
  refreshProjects: () => Promise<void>;
  openProjectDirectory: () => void;
  openProjectDetail: (projectId: string) => void;
  openCreateProject: () => void;
  openEditProject: (projectId: string) => void;
  openResults: (projectId: string, studyId: string) => void;
  openReports: (projectId: string, studyId: string) => void;
};

export type SidebarItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  kind: 'route' | 'disabled';
  to?: string;
  end?: boolean;
  badge?: string;
  enabled?: boolean;
};

export type SidebarSection = {
  id: string;
  label: string;
  items: SidebarItem[];
};
