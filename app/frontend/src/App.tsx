import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  matchPath,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router';
import {
  BarChart3,
  ClipboardList,
  ExternalLink,
  FileText,
  Layout,
  LogOut,
  Settings,
  Sparkles,
  UserCircle,
  Users,
} from 'lucide-react';
import { getProjects } from './api/client';
import { LandingPage } from './pages/LandingPage';
import { PersonaCatalog } from './pages/PersonaCatalog';
import { ProjectOverview } from './pages/ProjectOverview';
import { ReportExport } from './pages/ReportExport';
import { RespondentsDashboard } from './pages/RespondentsDashboard';
import { ResultsDashboard } from './pages/ResultsDashboard';
import { StudyBuilder } from './pages/StudyBuilder';
import type { Project } from './types';

const currentUserName = 'Người dùng';
const currentUserInitial = currentUserName.trim().charAt(0).toUpperCase();
const currentUserAvatarUrl = 'https://i.pravatar.cc/96?img=12';
const defaultStudyId = 'study-concept-test';

const appRoutes = {
  landing: '/',
  workspaceRoot: '/project',
  workspaceCreate: '/project/new',
  workspace(projectId: string) {
    return `/project/${projectId}`;
  },
  workspaceEdit(projectId: string) {
    return `/project/${projectId}/edit`;
  },
  personas(projectId: string) {
    return `/project/${projectId}/personas`;
  },
  respondents(projectId: string) {
    return `/project/${projectId}/respondents`;
  },
  studyBuilder(projectId: string) {
    return `/project/${projectId}/study-builder`;
  },
  results(projectId: string, studyId: string) {
    return `/project/${projectId}/results/${studyId}`;
  },
  reports(projectId: string, studyId: string) {
    return `/project/${projectId}/reports/${studyId}`;
  },
};

type WorkspaceContextValue = {
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

const useWorkspaceContext = () => useOutletContext<WorkspaceContextValue>();

const LegacyProjectsRedirect = () => {
  const location = useLocation();
  const nextPath = location.pathname.replace(/^\/projects/, '/project') || appRoutes.workspaceRoot;

  return <Navigate to={`${nextPath}${location.search}${location.hash}`} replace />;
};

const LandingRoute = () => {
  const navigate = useNavigate();

  return <LandingPage onStart={() => navigate(appRoutes.workspaceRoot)} />;
};

const WorkspaceShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedStudyId, setSelectedStudyId] = useState(defaultStudyId);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeProjectMatch = matchPath('/project/:projectId/*', location.pathname);
  const activeProjectId = activeProjectMatch?.params.projectId ?? null;

  const refreshProjects = async () => {
    try {
      const list = await getProjects();
      setProjects(list);
    } catch (err) {
      console.error('Không thể tải danh sách dự án', err);
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
  }, [location.pathname]);

  const activeProjectName = useMemo(() => {
    if (!activeProjectId) {
      return 'Danh sách dự án';
    }

    if (projects.length === 0) {
      return 'Đang tải dự án...';
    }

    return projects.find((project) => project.id === activeProjectId)?.name ?? 'Dự án không tồn tại';
  }, [activeProjectId, projects]);

  const contextValue: WorkspaceContextValue = {
    projects,
    activeProjectId,
    activeProjectName,
    selectedStudyId,
    refreshProjects,
    openProjectDirectory: () => navigate(appRoutes.workspaceRoot),
    openProjectDetail: (projectId) => navigate(appRoutes.workspace(projectId)),
    openCreateProject: () => navigate(appRoutes.workspaceCreate),
    openEditProject: (projectId) => navigate(appRoutes.workspaceEdit(projectId)),
    openResults: (projectId, studyId) => {
      setSelectedStudyId(studyId);
      navigate(appRoutes.results(projectId, studyId));
    },
    openReports: (projectId, studyId) => {
      setSelectedStudyId(studyId);
      navigate(appRoutes.reports(projectId, studyId));
    },
  };

  const navButtonClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all relative ${
      isActive ? 'text-ml-blue' : 'text-ml-ink-muted hover:text-ml-ink'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-ml-surface text-ml-ink selection:bg-ml-blue-soft selection:text-ml-blue-strong">
      <header className="sticky top-0 z-40 w-full border-b border-ml-border bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to={appRoutes.landing}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="font-black text-xl tracking-tight leading-none">
              <span className="text-ml-blue">MARKET</span>
              <span className="text-ml-ink">LAB</span>
            </span>
          </Link>

          <div className="relative z-50">
            <button
              onClick={() => {
                setShowWorkspaceDropdown((current) => !current);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-1.5 bg-ml-surface hover:bg-ml-border/50 border border-ml-border/60 rounded-full text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
            >
              <span>{activeProjectName}</span>
              <span className="text-[9px] text-ml-ink-muted">▼</span>
            </button>

            {showWorkspaceDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-64 bg-white/95 backdrop-blur-md border border-ml-border/60 rounded-xl shadow-lg p-2 space-y-1">
                <div className="text-[9px] font-bold text-ml-ink-muted uppercase tracking-wider px-3 py-1 border-b border-ml-border/40">
                  Không gian làm việc
                </div>
                <div className="max-h-48 overflow-y-auto py-1">
                  <button
                    onClick={contextValue.openProjectDirectory}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-ml-surface text-ml-ink uppercase"
                  >
                    📁 Danh sách dự án
                  </button>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => contextValue.openProjectDetail(project.id)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-ml-surface truncate uppercase ${
                        activeProjectId === project.id ? 'text-ml-blue bg-ml-blue-soft/30' : 'text-ml-ink'
                      }`}
                    >
                      💼 {project.name}
                    </button>
                  ))}
                </div>
                <div className="border-t border-ml-border/40 pt-1.5">
                  <button
                    onClick={contextValue.openCreateProject}
                    className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-ml-blue hover:text-ml-blue-strong bg-ml-blue-soft/30 rounded-lg transition-colors uppercase"
                  >
                    + Tạo dự án mới
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-50">
            <button
              onClick={() => {
                setShowUserMenu((current) => !current);
                setShowWorkspaceDropdown(false);
              }}
              className="flex items-center gap-3 rounded-full border border-transparent px-1.5 py-1 transition-colors hover:border-ml-border hover:bg-ml-surface"
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
            >
              <span className="hidden text-sm font-bold text-ml-ink sm:inline">Xin chào {currentUserName}</span>
              <img
                src={currentUserAvatarUrl}
                alt={`Avatar của ${currentUserName}`}
                className="h-9 w-9 rounded-full border border-ml-blue/20 object-cover shadow-sm"
              />
              <span className="sr-only">{currentUserInitial}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-ml-border/60 bg-white p-1.5 shadow-lg" role="menu">
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-bold text-ml-ink transition-colors hover:bg-ml-surface"
                  role="menuitem"
                >
                  <UserCircle size={15} />
                  Tài khoản
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-bold text-ml-ink transition-colors hover:bg-ml-surface"
                  role="menuitem"
                >
                  <Settings size={15} />
                  Cài đặt
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-bold text-ml-danger transition-colors hover:bg-red-50"
                  role="menuitem"
                >
                  <LogOut size={15} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {activeProjectId && (
        <div className="w-full bg-white/60 backdrop-blur-md border-b border-ml-border/60">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-2">
            <NavLink end to={appRoutes.workspace(activeProjectId)} className={navButtonClass}>
              {({ isActive }) => (
                <>
                  <Layout size={13} />
                  TỔNG QUAN
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
                </>
              )}
            </NavLink>
            <NavLink to={appRoutes.personas(activeProjectId)} className={navButtonClass}>
              {({ isActive }) => (
                <>
                  <Users size={13} />
                  CHÂN DUNG
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
                </>
              )}
            </NavLink>
            <NavLink to={appRoutes.respondents(activeProjectId)} className={navButtonClass}>
              {({ isActive }) => (
                <>
                  <Sparkles size={13} />
                  NGƯỜI THAM GIA
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
                </>
              )}
            </NavLink>
            <span className="h-4 w-[1px] bg-ml-border/60 mx-1"></span>
            <NavLink to={appRoutes.studyBuilder(activeProjectId)} className={navButtonClass}>
              {({ isActive }) => (
                <>
                  <ClipboardList size={13} />
                  TẠO NGHIÊN CỨU
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
                </>
              )}
            </NavLink>
            <NavLink to={appRoutes.results(activeProjectId, selectedStudyId)} className={navButtonClass}>
              {({ isActive }) => (
                <>
                  <BarChart3 size={13} />
                  BẢNG KẾT QUẢ
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
                </>
              )}
            </NavLink>
            <NavLink to={appRoutes.reports(activeProjectId, selectedStudyId)} className={navButtonClass}>
              {({ isActive }) => (
                <>
                  <FileText size={13} />
                  BÁO CÁO
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
                </>
              )}
            </NavLink>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col py-6 relative z-10">
        <Outlet context={contextValue} />
      </main>

      <footer className="w-full border-t border-ml-border py-6 bg-white text-center text-[11px] text-ml-ink-muted relative z-10 print:hidden">
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-3 md:min-h-6">
          <div className="font-medium text-center">
            © {new Date().getFullYear()} <span className="font-extrabold"><span className="text-ml-blue">MARKET</span><span className="text-ml-ink">LAB</span></span>. Phát triển bởi đội MarketUni.
          </div>
          <div className="flex items-center gap-3 font-semibold md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ml-blue flex items-center gap-0.5 transition-colors duration-150"
            >
              Tài liệu
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ProjectDirectoryRoute = () => {
  const workspace = useWorkspaceContext();

  return (
    <ProjectOverview
      activeProjectId={null}
      mode="list"
      onSelectProject={(projectId) => {
        if (projectId) {
          workspace.openProjectDetail(projectId);
          return;
        }
        workspace.openProjectDirectory();
      }}
      onProjectsChanged={workspace.refreshProjects}
      onNavigateToPersonas={() => {}}
      onCreateProject={workspace.openCreateProject}
      onEditProject={workspace.openEditProject}
    />
  );
};

const ProjectCreateRoute = () => {
  const workspace = useWorkspaceContext();

  return (
    <>
      <ProjectDirectoryRoute />
      <div className="fixed inset-0 bg-ml-ink/40 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto">
        <div className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-ml-border/60 bg-white shadow-xl animate-in fade-in zoom-in duration-200">
          <ProjectOverview
            activeProjectId={null}
            mode="create"
            onSelectProject={(projectId) => {
              if (projectId) {
                workspace.openProjectDetail(projectId);
              } else {
                workspace.openProjectDirectory();
              }
            }}
            onProjectsChanged={workspace.refreshProjects}
            onNavigateToPersonas={() => {}}
            onCreateProject={workspace.openCreateProject}
            onEditProject={workspace.openEditProject}
            onClose={workspace.openProjectDirectory}
          />
        </div>
      </div>
    </>
  );
};

const ProjectDetailRoute = () => {
  const { projectId = '' } = useParams();
  const workspace = useWorkspaceContext();
  const navigate = useNavigate();

  return (
    <ProjectOverview
      activeProjectId={projectId}
      mode="detail"
      onSelectProject={(nextProjectId) => {
        if (nextProjectId) {
          workspace.openProjectDetail(nextProjectId);
          return;
        }
        workspace.openProjectDirectory();
      }}
      onProjectsChanged={workspace.refreshProjects}
      onNavigateToPersonas={() => navigate(appRoutes.personas(projectId))}
      onCreateProject={workspace.openCreateProject}
      onEditProject={workspace.openEditProject}
    />
  );
};

const ProjectEditRoute = () => {
  const { projectId = '' } = useParams();
  const workspace = useWorkspaceContext();

  return (
    <>
      <ProjectDetailRoute />
      <div className="fixed inset-0 bg-ml-ink/40 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto">
        <div className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-ml-border/60 bg-white shadow-xl animate-in fade-in zoom-in duration-200">
          <ProjectOverview
            activeProjectId={projectId}
            mode="edit"
            onSelectProject={(nextProjectId) => {
              if (nextProjectId) {
                workspace.openProjectDetail(nextProjectId);
                return;
              }
              workspace.openProjectDirectory();
            }}
            onProjectsChanged={workspace.refreshProjects}
            onNavigateToPersonas={() => {}}
            onCreateProject={workspace.openCreateProject}
            onEditProject={workspace.openEditProject}
            onClose={() => workspace.openProjectDetail(projectId)}
          />
        </div>
      </div>
    </>
  );
};

const PersonaCatalogRoute = () => {
  const { projectId = '' } = useParams();

  return <PersonaCatalog projectId={projectId} />;
};

const RespondentsRoute = () => {
  const { projectId = '' } = useParams();

  return <RespondentsDashboard projectId={projectId} />;
};

const StudyBuilderRoute = () => {
  const { projectId = '' } = useParams();
  const workspace = useWorkspaceContext();

  return (
    <StudyBuilder
      projectId={projectId}
      onNavigateToResults={(studyId) => workspace.openResults(projectId, studyId)}
    />
  );
};

const ResultsRoute = () => {
  const { projectId = '', studyId = defaultStudyId } = useParams();
  const workspace = useWorkspaceContext();

  return (
    <ResultsDashboard
      studyId={studyId}
      onNavigateToReports={() => workspace.openReports(projectId, studyId)}
    />
  );
};

const ReportsRoute = () => {
  const { projectId = '', studyId = defaultStudyId } = useParams();

  return <ReportExport projectId={projectId} studyId={studyId} />;
};

function App() {
  return (
    <Routes>
      <Route path={appRoutes.landing} element={<LandingRoute />} />
      <Route path="/landing" element={<Navigate to={appRoutes.landing} replace />} />
      <Route path="/projects/*" element={<LegacyProjectsRedirect />} />
      <Route path="/project" element={<WorkspaceShell />}>
        <Route index element={<ProjectDirectoryRoute />} />
        <Route path="new" element={<ProjectCreateRoute />} />
        <Route path=":projectId">
          <Route index element={<ProjectDetailRoute />} />
          <Route path="edit" element={<ProjectEditRoute />} />
          <Route path="personas" element={<PersonaCatalogRoute />} />
          <Route path="respondents" element={<RespondentsRoute />} />
          <Route path="study-builder" element={<StudyBuilderRoute />} />
          <Route path="results/:studyId" element={<ResultsRoute />} />
          <Route path="reports/:studyId" element={<ReportsRoute />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={appRoutes.landing} replace />} />
    </Routes>
  );
}

export default App;
