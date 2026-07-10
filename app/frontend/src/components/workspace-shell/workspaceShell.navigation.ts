import {
  Bot,
  ClipboardList,
  FolderKanban,
  House,
  Lightbulb,
  MessageSquare,
  Search,
  Users,
} from 'lucide-react';
import { appRoutes } from './workspaceShell.constants';
import type { SidebarItem, SidebarSection } from './workspaceShell.types';

export const buildHomeItem = (_activeProjectId: string | null): SidebarItem => ({
  id: 'home',
  label: 'Home',
  icon: House,
  kind: 'route',
  to: appRoutes.home,
  end: true,
});

export const projectItem: SidebarItem = {
  id: 'projects',
  label: 'Projects',
  icon: FolderKanban,
  kind: 'route',
  to: appRoutes.workspaceRoot,
};

export const buildSidebarSections = (
  activeProjectId: string | null,
  _selectedStudyId: string,
): SidebarSection[] => {
  const projectReady = Boolean(activeProjectId);

  return [
    {
      id: 'persona-intelligence',
      label: 'Persona Intelligence',
      items: [
        {
          id: 'persona-intelligence',
          label: 'Persona Intelligence',
          icon: Search,
          kind: 'route',
          to: projectReady ? appRoutes.personas(activeProjectId!) : undefined,
          enabled: projectReady,
        },
        {
          id: 'digital-twin',
          label: 'Interactive Digital Twin Chat',
          icon: Bot,
          kind: 'disabled',
          badge: 'Sau MVP',
        },
      ],
    },
    {
      id: 'synthetic-research',
      label: 'Synthetic Research',
      items: [
        {
          id: 'panel-generator',
          label: 'Synthetic Panel Generator',
          icon: Users,
          kind: 'route',
          to: projectReady ? appRoutes.respondents(activeProjectId!) : undefined,
          enabled: projectReady,
        },
        {
          id: 'research-engine',
          label: 'Synthetic Research Engine',
          icon: ClipboardList,
          kind: 'route',
          to: projectReady ? appRoutes.studyBuilder(activeProjectId!) : undefined,
          enabled: projectReady,
        },
        {
          id: 'concept-testing',
          label: 'Concept Testing',
          icon: Lightbulb,
          kind: 'disabled',
          badge: 'Tạm khóa',
        },
        {
          id: 'message-testing',
          label: 'Message Testing',
          icon: MessageSquare,
          kind: 'disabled',
          badge: 'Tạm khóa',
        },
      ],
    },
  ];
};
