import { Menu } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Outlet,
  matchPath,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router';
import { getProjects } from '../api/client';
import type { Project } from '../types';
import { WorkspaceSidebar } from './workspace-shell/WorkspaceSidebar';
import {
  appRoutes,
  defaultStudyId,
} from './workspace-shell/workspaceShell.constants';
import {
  buildHomeItem,
  buildSidebarSections,
  projectItem,
} from './workspace-shell/workspaceShell.navigation';
import type { WorkspaceContextValue } from './workspace-shell/workspaceShell.types';

export { appRoutes, defaultStudyId } from './workspace-shell/workspaceShell.constants';

export const useWorkspaceContext = () => useOutletContext<WorkspaceContextValue>();

export const WorkspaceShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedStudyId, setSelectedStudyId] = useState(defaultStudyId);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const workspaceDropdownRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const activeProjectMatch = matchPath('/project/:projectId/*', location.pathname);
  const activeProjectId = activeProjectMatch?.params.projectId ?? null;

  const refreshProjects = async () => {
    try {
      const list = await getProjects();
      setProjects(list);
    } catch (error) {
      console.error('Không thể tải danh sách dự án', error);
    }
  };

  useEffect(() => {
    void refreshProjects();
  }, []);

  useEffect(() => {
    const resultsMatch = matchPath('/project/:projectId/results/:studyId', location.pathname);
    const reportsMatch = matchPath('/project/:projectId/reports/:studyId', location.pathname);
    const routeStudyId = resultsMatch?.params.studyId ?? reportsMatch?.params.studyId;

    if (routeStudyId) {
      setSelectedStudyId(routeStudyId);
    }
  }, [location.pathname]);

  useEffect(() => {
    setShowWorkspaceDropdown(false);
    setShowUserMenu(false);
    setShowMobileSidebar(false);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(target)) {
        setShowWorkspaceDropdown(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const activeProjectName = useMemo(() => {
    if (location.pathname === appRoutes.home) {
      return 'Tổng quan';
    }

    if (!activeProjectId) {
      return 'Danh sách dự án';
    }

    if (projects.length === 0) {
      return 'Đang tải dự án...';
    }

    return (
      projects.find((project) => project.id === activeProjectId)?.name ??
      'Dự án không tồn tại'
    );
  }, [activeProjectId, location.pathname, projects]);

  const openProjectDirectory = () => navigate(appRoutes.workspaceRoot);
  const openProjectDetail = (projectId: string) => navigate(appRoutes.workspace(projectId));
  const openCreateProject = () => navigate(appRoutes.workspaceCreate);
  const openEditProject = (projectId: string) => navigate(appRoutes.workspaceEdit(projectId));
  const openResults = (projectId: string, studyId: string) => {
    setSelectedStudyId(studyId);
    navigate(appRoutes.results(projectId, studyId));
  };
  const openReports = (projectId: string, studyId: string) => {
    setSelectedStudyId(studyId);
    navigate(appRoutes.reports(projectId, studyId));
  };

  const contextValue: WorkspaceContextValue = {
    projects,
    activeProjectId,
    activeProjectName,
    selectedStudyId,
    refreshProjects,
    openProjectDirectory,
    openProjectDetail,
    openCreateProject,
    openEditProject,
    openResults,
    openReports,
  };

  const homeItem = useMemo(() => buildHomeItem(activeProjectId), [activeProjectId]);
  const sidebarSections = useMemo(
    () => buildSidebarSections(activeProjectId, selectedStudyId),
    [activeProjectId, selectedStudyId],
  );

  return (
    <div className="min-h-screen bg-ml-surface text-ml-ink selection:bg-ml-blue-soft selection:text-ml-blue-strong">
      {showMobileSidebar && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ml-ink/30 backdrop-blur-[2px] lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
          aria-label="Đóng lớp phủ điều hướng"
        />
      )}

      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[276px] max-w-[88vw] border-r border-ml-border bg-[#fbfbfc] transition-transform duration-200 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 ${
            showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <WorkspaceSidebar
            projects={projects}
            activeProjectId={activeProjectId}
            activeProjectName={activeProjectName}
            homeItem={homeItem}
            projectItem={projectItem}
            sidebarSections={sidebarSections}
            showWorkspaceDropdown={showWorkspaceDropdown}
            showUserMenu={showUserMenu}
            workspaceDropdownRef={workspaceDropdownRef}
            userMenuRef={userMenuRef}
            onToggleWorkspaceDropdown={() => {
              setShowWorkspaceDropdown((current) => !current);
              setShowUserMenu(false);
            }}
            onToggleUserMenu={() => {
              setShowUserMenu((current) => !current);
              setShowWorkspaceDropdown(false);
            }}
            onCloseUserMenu={() => setShowUserMenu(false)}
            onCloseMobileSidebar={() => setShowMobileSidebar(false)}
            onOpenProjectDirectory={openProjectDirectory}
            onOpenProjectDetail={openProjectDetail}
            onOpenCreateProject={openCreateProject}
            onLogout={() => navigate(appRoutes.landing)}
          />
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <button
            type="button"
            onClick={() => setShowMobileSidebar(true)}
            className="fixed bottom-5 right-5 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-ml-border bg-white text-ml-ink shadow-lg transition-colors hover:border-ml-blue/20 hover:text-ml-blue lg:hidden"
            aria-label="Mở thanh điều hướng"
          >
            <Menu size={18} />
          </button>

          <main className="relative z-10 flex flex-1 flex-col py-6">
            <Outlet context={contextValue} />
          </main>
        </div>
      </div>
    </div>
  );
};
