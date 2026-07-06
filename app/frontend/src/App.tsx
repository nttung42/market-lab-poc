import { useState, useEffect } from 'react';
import { ProjectOverview } from './pages/ProjectOverview';
import { PersonaCatalog } from './pages/PersonaCatalog';
import { RespondentsDashboard } from './pages/RespondentsDashboard';
import { StudyBuilder } from './pages/StudyBuilder';
import { ResultsDashboard } from './pages/ResultsDashboard';
import { ReportExport } from './pages/ReportExport';
import { LandingPage } from './pages/LandingPage';
import { getProjects } from './api/client';
import type { Project } from './types';
import { Layout, Users, ExternalLink, Sparkles, ClipboardList, BarChart3, FileText, UserCircle, Settings, LogOut } from 'lucide-react';

type View = 'landing' | 'project-overview' | 'create-project' | 'edit-project' | 'persona-catalog' | 'synthetic-respondents' | 'study-builder' | 'results-dashboard' | 'report-export';


const normalizePath = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized;
};

const parsePath = (pathValue: string) => {
  const path = normalizePath(pathValue);
  
  if (!path || path === '/' || path === '/projects') {
    return { view: 'project-overview' as View, projectId: null };
  }

  if (path === '/landing') {
    return { view: 'landing' as View, projectId: null };
  }
  
  if (path === '/create-project') {
    return { view: 'create-project' as View, projectId: null };
  }
  
  // Pattern: /projects/:projectId/edit
  const editProjectMatch = path.match(/^\/projects\/([^/]+)\/edit$/);
  if (editProjectMatch) {
    return { view: 'edit-project' as View, projectId: editProjectMatch[1] };
  }
  
  // Pattern: /projects/:projectId/personas
  const personasMatch = path.match(/^\/projects\/([^/]+)\/personas$/);
  if (personasMatch) {
    return { view: 'persona-catalog' as View, projectId: personasMatch[1] };
  }
  
  // Pattern: /projects/:projectId/respondents
  const respondentsMatch = path.match(/^\/projects\/([^/]+)\/respondents$/);
  if (respondentsMatch) {
    return { view: 'synthetic-respondents' as View, projectId: respondentsMatch[1] };
  }
  
  // Pattern: /projects/:projectId/study-builder
  const studyBuilderMatch = path.match(/^\/projects\/([^/]+)\/study-builder$/);
  if (studyBuilderMatch) {
    return { view: 'study-builder' as View, projectId: studyBuilderMatch[1] };
  }
  
  // Pattern: /projects/:projectId/results/:studyId
  const resultsMatch = path.match(/^\/projects\/([^/]+)\/results\/([^/]+)$/);
  if (resultsMatch) {
    return { view: 'results-dashboard' as View, projectId: resultsMatch[1], studyId: resultsMatch[2] };
  }
  
  // Pattern: /projects/:projectId/reports/:studyId
  const reportsMatch = path.match(/^\/projects\/([^/]+)\/reports\/([^/]+)$/);
  if (reportsMatch) {
    return { view: 'report-export' as View, projectId: reportsMatch[1], studyId: reportsMatch[2] };
  }
  
  // Pattern: /projects/:projectId
  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    return { view: 'project-overview' as View, projectId: projectMatch[1] };
  }
  
  return { view: 'project-overview' as View, projectId: null };
};

const navigate = (path: string) => {
  const normalizedPath = normalizePath(path);
  if (window.location.pathname !== normalizedPath || window.location.hash) {
    window.history.pushState(null, '', normalizedPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
};

const currentUserName = 'Alex';
const currentUserInitial = currentUserName.trim().charAt(0).toUpperCase();
const currentUserAvatarUrl = 'https://i.pravatar.cc/96?img=12';

function App() {
  const [currentView, setCurrentView] = useState<View>('project-overview');
  const [selectedStudyId, setSelectedStudyId] = useState<string>('study-concept-test');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string>('No Active Project');
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const refreshProjects = async () => {
    try {
      const list = await getProjects();
      setProjects(list);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  // Update active project name when projects list or activeProjectId changes
  useEffect(() => {
    if (activeProjectId && projects.length > 0) {
      const current = projects.find(p => p.id === activeProjectId);
      if (current) {
        setActiveProjectName(current.name);
      }
    } else if (!activeProjectId) {
      setActiveProjectName('No Active Project');
    }
  }, [activeProjectId, projects]);

  useEffect(() => {
    const handleLocationChange = () => {
      const legacyHashPath = window.location.hash.match(/^#(\/.*)$/)?.[1];
      if (legacyHashPath) {
        window.history.replaceState(null, '', normalizePath(legacyHashPath));
      }

      const parsed = parsePath(window.location.pathname);
      setCurrentView(parsed.view);
      setActiveProjectId(parsed.projectId);
      if (parsed.studyId) {
        setSelectedStudyId(parsed.studyId);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleSelectProject = (projectId: string | null) => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    } else {
      navigate(`/projects`);
    }
  };

  const isNavDisabled = !activeProjectId;

  if (currentView === 'landing') {
    return <LandingPage onStart={() => navigate('/projects')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-ml-surface text-ml-ink selection:bg-ml-blue-soft selection:text-ml-blue-strong">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-ml-border bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div 
            onClick={() => {
              navigate('/landing');
              setShowWorkspaceDropdown(false);
              setShowUserMenu(false);
            }}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="font-black text-xl tracking-tight leading-none">
              <span className="text-ml-blue">MARKET</span>
              <span className="text-ml-ink">LAB</span>
            </span>
          </div>

          {/* Center: Dropdown Workspace Selector */}
          <div className="relative z-50">
            <button
              onClick={() => {
                setShowWorkspaceDropdown(!showWorkspaceDropdown);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-1.5 bg-ml-surface hover:bg-ml-border/50 border border-ml-border/60 rounded-full text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
            >
              <span>{activeProjectId ? activeProjectName : 'Select Workspace'}</span>
              <span className="text-[9px] text-ml-ink-muted">▼</span>
            </button>
            
            {showWorkspaceDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-64 bg-white/95 backdrop-blur-md border border-ml-border/60 rounded-xl shadow-lg p-2 space-y-1">
                <div className="text-[9px] font-bold text-ml-ink-muted uppercase tracking-wider px-3 py-1 border-b border-ml-border/40">Workspaces</div>
                <div className="max-h-48 overflow-y-auto py-1">
                  <button
                    onClick={() => {
                      handleSelectProject(null);
                      setShowWorkspaceDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-ml-surface text-ml-ink uppercase"
                  >
                    📁 Workspace Directory
                  </button>
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        handleSelectProject(p.id);
                        setShowWorkspaceDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-ml-surface truncate uppercase ${activeProjectId === p.id ? 'text-ml-blue bg-ml-blue-soft/30' : 'text-ml-ink'}`}
                    >
                      💼 {p.name}
                    </button>
                  ))}
                </div>
                <div className="border-t border-ml-border/40 pt-1.5">
                  <button
                    onClick={() => {
                      setShowCreateModal(true);
                      setShowWorkspaceDropdown(false);
                    }}
                    className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-ml-blue hover:text-ml-blue-strong bg-ml-blue-soft/30 rounded-lg transition-colors uppercase"
                  >
                    + Initialize Workspace
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right area: User profile */}
          <div className="relative z-50">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowWorkspaceDropdown(false);
              }}
              className="flex items-center gap-3 rounded-full border border-transparent px-1.5 py-1 transition-colors hover:border-ml-border hover:bg-ml-surface"
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
            >
              <span className="hidden text-sm font-bold text-ml-ink sm:inline">
                Hello {currentUserName}
              </span>
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
                  Account
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-bold text-ml-ink transition-colors hover:bg-ml-surface"
                  role="menuitem"
                >
                  <Settings size={15} />
                  Setting
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-bold text-ml-danger transition-colors hover:bg-red-50"
                  role="menuitem"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sub-navigation for Active Project */}
      {activeProjectId && (
        <div className="w-full bg-white/60 backdrop-blur-md border-b border-ml-border/60">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-2">
            <button
              onClick={() => navigate(`/projects/${activeProjectId}`)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all relative ${
                currentView === 'project-overview' ? 'text-ml-blue' : 'text-ml-ink-muted hover:text-ml-ink'
              }`}
            >
              <Layout size={13} />
              OVERVIEW
              {currentView === 'project-overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
            </button>
            <button
              onClick={() => navigate(`/projects/${activeProjectId}/personas`)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all relative ${
                currentView === 'persona-catalog' ? 'text-ml-blue' : 'text-ml-ink-muted hover:text-ml-ink'
              }`}
            >
              <Users size={13} />
              PERSONAS
              {currentView === 'persona-catalog' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
            </button>
            <button
              onClick={() => navigate(`/projects/${activeProjectId}/respondents`)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all relative ${
                currentView === 'synthetic-respondents' ? 'text-ml-blue' : 'text-ml-ink-muted hover:text-ml-ink'
              }`}
            >
              <Sparkles size={13} />
              RESPONDENTS
              {currentView === 'synthetic-respondents' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
            </button>
            <span className="h-4 w-[1px] bg-ml-border/60 mx-1"></span>
            <button
              onClick={() => navigate(`/projects/${activeProjectId}/study-builder`)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all relative ${
                currentView === 'study-builder' ? 'text-ml-blue' : 'text-ml-ink-muted hover:text-ml-ink'
              }`}
            >
              <ClipboardList size={13} />
              STUDY BUILDER
              {currentView === 'study-builder' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
            </button>
            <button
              onClick={() => navigate(`/projects/${activeProjectId}/results/${selectedStudyId}`)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all relative ${
                currentView === 'results-dashboard' ? 'text-ml-blue' : 'text-ml-ink-muted hover:text-ml-ink'
              }`}
            >
              <BarChart3 size={13} />
              DASHBOARD
              {currentView === 'results-dashboard' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
            </button>
            <button
              onClick={() => navigate(`/projects/${activeProjectId}/reports/${selectedStudyId}`)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all relative ${
                currentView === 'report-export' ? 'text-ml-blue' : 'text-ml-ink-muted hover:text-ml-ink'
              }`}
            >
              <FileText size={13} />
              REPORTS
              {currentView === 'report-export' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ml-blue rounded-full"></span>}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col py-6 relative z-10">
        {(currentView === 'project-overview' || currentView === 'create-project' || currentView === 'edit-project') && (
          <ProjectOverview
            activeProjectId={activeProjectId}
            mode={activeProjectId ? 'detail' : 'list'}
            onSelectProject={handleSelectProject}
            onProjectsChanged={refreshProjects}
            onNavigateToPersonas={() => navigate(`/projects/${activeProjectId}/personas`)}
            onCreateProject={() => navigate('/create-project')}
            onEditProject={(projectId) => navigate(`/projects/${projectId}/edit`)}
          />
        )}

        {/* Create Project Modal Overlay */}
        {(currentView === 'create-project' || showCreateModal) && (
          <div className="fixed inset-0 bg-ml-ink/40 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto">
            <div className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-ml-border/60 bg-white shadow-xl animate-in fade-in zoom-in duration-200">
              <ProjectOverview
                activeProjectId={null}
                mode="create"
                onSelectProject={(id) => {
                  handleSelectProject(id);
                  setShowCreateModal(false);
                }}
                onProjectsChanged={refreshProjects}
                onNavigateToPersonas={() => {}}
                onCreateProject={() => navigate('/create-project')}
                onEditProject={(projectId) => navigate(`/projects/${projectId}/edit`)}
                onClose={() => {
                  setShowCreateModal(false);
                  if (currentView === 'create-project') {
                    handleSelectProject(activeProjectId);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Edit Project Modal Overlay */}
        {(currentView === 'edit-project' || showEditModal) && (
          <div className="fixed inset-0 bg-ml-ink/40 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto">
            <div className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-ml-border/60 bg-white shadow-xl animate-in fade-in zoom-in duration-200">
              <ProjectOverview
                activeProjectId={activeProjectId}
                mode="edit"
                onSelectProject={(id) => {
                  handleSelectProject(id);
                  setShowEditModal(false);
                }}
                onProjectsChanged={refreshProjects}
                onNavigateToPersonas={() => {}}
                onCreateProject={() => navigate('/create-project')}
                onEditProject={(projectId) => navigate(`/projects/${projectId}/edit`)}
                onClose={() => {
                  setShowEditModal(false);
                  if (currentView === 'edit-project') {
                    handleSelectProject(activeProjectId);
                  }
                }}
              />
            </div>
          </div>
        )}
        {isNavDisabled && currentView !== 'project-overview' && currentView !== 'create-project' && currentView !== 'edit-project' && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto px-6 py-12 text-center">
            <div className="w-16 h-16 bg-ml-warning/10 border border-ml-warning/20 rounded-full flex items-center justify-center text-ml-warning mb-5">
              <ClipboardList size={32} />
            </div>
            <h2 className="text-lg font-bold text-ml-ink uppercase tracking-wider mb-2">No Active Project</h2>
            <p className="text-xs text-ml-ink-muted leading-relaxed mb-6">
              Please select or create a project on the overview dashboard first before using other workspace modules.
            </p>
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Go to Overview
            </button>
          </div>
        )}
        {!isNavDisabled && currentView === 'persona-catalog' && (
          <PersonaCatalog projectId={activeProjectId!} />
        )}
        {!isNavDisabled && currentView === 'synthetic-respondents' && (
          <RespondentsDashboard projectId={activeProjectId!} />
        )}
        {!isNavDisabled && currentView === 'study-builder' && (
          <StudyBuilder
            projectId={activeProjectId!}
            onNavigateToResults={(studyId) => {
              setSelectedStudyId(studyId);
              navigate(`/projects/${activeProjectId}/results/${studyId}`);
            }}
          />
        )}
        {!isNavDisabled && currentView === 'results-dashboard' && (
          <ResultsDashboard
            studyId={selectedStudyId}
            onNavigateToReports={() => navigate(`/projects/${activeProjectId}/reports/${selectedStudyId}`)}
          />
        )}
        {!isNavDisabled && currentView === 'report-export' && (
          <ReportExport
            projectId={activeProjectId!}
            studyId={selectedStudyId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-ml-border py-6 bg-white text-center text-[11px] text-ml-ink-muted relative z-10 print:hidden">
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-3 md:min-h-6">
          <div className="font-medium text-center">
            © {new Date().getFullYear()} <span className="font-extrabold"><span className="text-ml-blue">MARKET</span><span className="text-ml-ink">LAB</span></span>. Developed by MarketUni Team.
          </div>
          <div className="flex items-center gap-3 font-semibold md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ml-blue flex items-center gap-0.5 transition-colors duration-150"
            >
              Docs
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
